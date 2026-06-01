/**
 * Crazy Tag - Multiplayer Management Layer (MQTT-based)
 */

class MultiplayerManager {
    constructor() {
        this.client = null;
        this.roomCode = null;
        this.myId = 'player_' + Math.random().toString(36).substr(2, 9);
        this.myName = 'Spieler';
        this.myColor = '#5c7cfa';
        this.myAbilities = ['teleport', 'moveplus'];
        this.players = {}; // Keyed by playerId: { id, name, color, abilities, isHost, isReady, lastSeen }
        this.isHost = false;
        
        // MQTT Fallback Server List (WSS/WS WebSockets broker endpoints)
        const isSecure = window.location.protocol === 'https:';
        this.brokers = [
            isSecure ? 'wss://broker.emqx.io:8084/mqtt' : 'ws://broker.emqx.io:8083/mqtt',
            isSecure ? 'wss://test.mosquitto.org:8081/mqtt' : 'ws://test.mosquitto.org:8080/mqtt',
            'ws://broker.hivemq.com:8000/mqtt'
        ];
        this.currentBrokerIndex = 0;

        // Callback hooks to be bound by game.js
        this.callbacks = {
            onConnected: () => {},
            onConnectionFailed: () => {},
            onLobbyUpdate: (players) => {},
            onGameStart: (settings) => {},
            onPlayerSync: (id, state) => {},
            onGameEvent: (event) => {},
            onChatMsg: (senderName, senderColor, text) => {},
            onReaction: (senderId, emoji) => {},
            onHostMigrated: (newHostId) => {}
        };

        this.heartbeatTimer = null;
        this.checkMissedHeartbeatsTimer = null;
        this.lobbyPingTimer = null;
    }

    // Connect to MQTT Broker with fallback support
    connect(onSuccess, onFailure) {
        if (this.client && this.client.connected) {
            if (onSuccess) onSuccess();
            return;
        }

        const brokerUrl = this.brokers[this.currentBrokerIndex];
        console.log(`Connecting to MQTT broker: ${brokerUrl}`);

        const options = {
            clientId: this.myId,
            clean: true,
            connectTimeout: 5000,
            reconnectPeriod: 0 // We handle reconnection manually via fallback
        };

        try {
            this.client = mqtt.connect(brokerUrl, options);
        } catch (e) {
            console.error("MQTT connection error: ", e);
            this.handleConnectionFailure(onFailure);
            return;
        }

        this.client.on('connect', () => {
            console.log(`Connected to broker: ${brokerUrl}`);
            this.callbacks.onConnected();
            if (onSuccess) onSuccess();
        });

        this.client.on('error', (err) => {
            console.error('MQTT error:', err);
            this.client.end();
            this.handleConnectionFailure(onFailure);
        });

        this.client.on('offline', () => {
            console.log('MQTT offline, trying fallback...');
            this.handleConnectionFailure(onFailure);
        });

        this.client.on('message', (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                this.handleMessage(topic, payload);
            } catch (e) {
                // Ignore parsing errors for non-json
            }
        });
    }

    handleConnectionFailure(onFailure) {
        if (this.client) {
            this.client.end(true);
        }
        this.currentBrokerIndex = (this.currentBrokerIndex + 1) % this.brokers.length;
        if (this.currentBrokerIndex === 0) {
            // Checked all brokers, report failure
            if (onFailure) this.callbacks.onConnectionFailed();
            if (onFailure) onFailure();
        } else {
            // Try next broker
            setTimeout(() => this.connect(), 1000);
        }
    }

    // Bind event callbacks
    on(event, callback) {
        if (this.callbacks[event] !== undefined) {
            this.callbacks[event] = callback;
        }
    }

    // Create a new room as Host
    createRoom(name, color, onSuccess) {
        this.roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        this.isHost = true;
        this.myName = name || 'Host';
        this.myColor = color;

        this.connect(() => {
            this.subscribeToRoom();
            
            // Add self to players
            this.players = {};
            this.players[this.myId] = {
                id: this.myId,
                name: this.myName,
                color: this.myColor,
                abilities: this.myAbilities,
                isHost: true,
                isReady: true,
                lastSeen: Date.now()
            };

            this.startHeartbeat();
            this.callbacks.onLobbyUpdate(this.players);
            if (onSuccess) onSuccess(this.roomCode);
        });
    }

    // Join an existing room
    joinRoom(code, name, color, onSuccess, onFailure) {
        this.roomCode = code.toUpperCase();
        this.isHost = false;
        this.myName = name || 'Spieler';
        this.myColor = color;
        this.players = {};

        this.connect(() => {
            this.subscribeToRoom();

            // Send Join Request to Host
            const joinMsg = {
                type: 'join_request',
                id: this.myId,
                name: this.myName,
                color: this.myColor,
                abilities: this.myAbilities
            };
            this.publish('system', joinMsg);

            // Set a timeout in case room does not exist
            const timeout = setTimeout(() => {
                if (Object.keys(this.players).length === 0) {
                    this.leaveRoom();
                    if (onFailure) onFailure("Keine Antwort vom Raum-Host. Existiert der Code?");
                }
            }, 4000);

            // Wait for lobby_sync response from host
            this.lobbySyncSuccessCallback = () => {
                clearTimeout(timeout);
                this.startHeartbeatWatcher();
                this.startLobbyPing();
                if (onSuccess) onSuccess();
            };
        }, onFailure);
    }

    leaveRoom() {
        this.stopHeartbeat();
        this.stopHeartbeatWatcher();
        this.stopLobbyPing();

        if (this.client && this.client.connected) {
            if (this.roomCode) {
                // Inform others we are leaving
                this.publish('system', { type: 'leave', id: this.myId });
                this.unsubscribeFromRoom();
            }
        }

        this.roomCode = null;
        this.isHost = false;
        this.players = {};
        this.lobbySyncSuccessCallback = null;
    }

    subscribeToRoom() {
        const baseTopic = `crazy/room/${this.roomCode}/`;
        this.client.subscribe(baseTopic + 'system');
        this.client.subscribe(baseTopic + 'sync');
        this.client.subscribe(baseTopic + 'events');
        this.client.subscribe(baseTopic + 'chat');
    }

    unsubscribeFromRoom() {
        const baseTopic = `crazy/room/${this.roomCode}/`;
        this.client.unsubscribe(baseTopic + 'system');
        this.client.unsubscribe(baseTopic + 'sync');
        this.client.unsubscribe(baseTopic + 'events');
        this.client.unsubscribe(baseTopic + 'chat');
    }

    publish(subtopic, msg) {
        if (!this.client || !this.client.connected || !this.roomCode) return;
        const topic = `crazy/room/${this.roomCode}/${subtopic}`;
        this.client.publish(topic, JSON.stringify(msg));
    }

    // High frequency position synchronization
    sendPositionSync(state) {
        // State contains: { x, y, vx, vy, facing, animState, score, isDead, activeAbils }
        const syncMsg = {
            id: this.myId,
            x: Math.round(state.x),
            y: Math.round(state.y),
            vx: Math.round(state.vx * 10) / 10,
            vy: Math.round(state.vy * 10) / 10,
            facing: state.facing,
            anim: state.anim,
            isDead: state.isDead,
            activeAbils: state.activeAbils
        };
        this.publish('sync', syncMsg);
    }

    sendGameEvent(event) {
        // Event contains: { type: "tag"|"ability_trigger"|"trap_dropped"|"trap_tripped" etc. }
        event.sender = this.myId;
        event.timestamp = Date.now();
        this.publish('events', event);
    }

    sendChatMsg(text) {
        this.publish('chat', {
            id: this.myId,
            name: this.myName,
            color: this.myColor,
            text: text
        });
    }

    sendReaction(emoji) {
        this.publish('chat', {
            id: this.myId,
            type: 'reaction',
            emoji: emoji
        });
    }

    updateMyAbilities(abils) {
        this.myAbilities = abils;
        if (this.roomCode) {
            if (this.isHost) {
                this.players[this.myId].abilities = abils;
                this.broadcastLobbyUpdate();
            } else {
                this.publish('system', {
                    type: 'ability_update',
                    id: this.myId,
                    abilities: abils
                });
            }
        }
    }

    updateMyReadyState(ready) {
        if (this.roomCode) {
            if (this.isHost) {
                // Host is always ready
            } else {
                this.publish('system', {
                    type: 'ready_update',
                    id: this.myId,
                    ready: ready
                });
            }
        }
    }

    updateMyName(newName) {
        this.myName = newName;
        if (this.roomCode) {
            if (this.isHost) {
                if (this.players[this.myId]) {
                    this.players[this.myId].name = newName;
                }
                this.broadcastLobbyUpdate();
            } else {
                this.publish('system', {
                    type: 'name_update',
                    id: this.myId,
                    name: newName
                });
            }
        }
    }

    // Host starting the game
    startGame(settings) {
        if (!this.isHost) return;
        this.publish('system', {
            type: 'start_game',
            settings: settings
        });
    }

    // Message handler routing
    handleMessage(topic, payload) {
        const subtopic = topic.split('/').pop();

        if (subtopic === 'system') {
            this.handleSystemMessage(payload);
        } else if (subtopic === 'sync') {
            if (payload.id !== this.myId) {
                if (this.players[payload.id]) {
                    this.players[payload.id].lastSeen = Date.now();
                }
                this.callbacks.onPlayerSync(payload.id, payload);
            }
        } else if (subtopic === 'events') {
            this.callbacks.onGameEvent(payload);
        } else if (subtopic === 'chat') {
            if (payload.type === 'reaction') {
                if (payload.id !== this.myId) {
                    this.callbacks.onReaction(payload.id, payload.emoji);
                }
            } else {
                if (payload.id !== this.myId) {
                    this.callbacks.onChatMsg(payload.name, payload.color, payload.text);
                }
            }
        }
    }

    handleSystemMessage(msg) {
        switch (msg.type) {
            case 'join_request':
                if (this.isHost) {
                    let finalColor = msg.color;
                    const takenColors = Object.values(this.players).map(p => p.color);
                    if (takenColors.includes(finalColor)) {
                        const palette = ["#5c7cfa", "#37b24d", "#f59f00", "#ae3ec9", "#1098ad", "#f76707", "#e03131", "#0ca678"];
                        const freeColor = palette.find(c => !takenColors.includes(c));
                        if (freeColor) {
                            finalColor = freeColor;
                        } else {
                            finalColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                        }
                    }

                    this.players[msg.id] = {
                        id: msg.id,
                        name: msg.name,
                        color: finalColor,
                        abilities: msg.abilities || [],
                        isHost: false,
                        isReady: false,
                        lastSeen: Date.now()
                    };
                    this.broadcastLobbyUpdate();
                    
                    // Welcome announcement in chat
                    this.sendChatMsg(`${msg.name} hat die Lobby betreten!`);
                }
                break;

            case 'lobby_sync':
                // Received complete player list from Host
                this.players = msg.players;
                this.callbacks.onLobbyUpdate(this.players, msg.mode, msg.map, msg.rounds, msg.duration, msg.interval);
                
                // Track host heartbeat
                const hostPlayer = Object.values(this.players).find(p => p.isHost);
                if (hostPlayer) {
                    hostPlayer.lastSeen = Date.now();
                }

                if (this.lobbySyncSuccessCallback) {
                    this.lobbySyncSuccessCallback();
                    this.lobbySyncSuccessCallback = null;
                }
                break;

            case 'ability_update':
                if (this.isHost && this.players[msg.id]) {
                    this.players[msg.id].lastSeen = Date.now();
                    this.players[msg.id].abilities = msg.abilities;
                    this.broadcastLobbyUpdate();
                }
                break;

            case 'name_update':
                if (this.isHost && this.players[msg.id]) {
                    this.players[msg.id].lastSeen = Date.now();
                    const oldName = this.players[msg.id].name;
                    this.players[msg.id].name = msg.name;
                    this.broadcastLobbyUpdate();
                    this.sendChatMsg(`${oldName} heißt nun ${msg.name}`);
                }
                break;

            case 'ready_update':
                if (this.isHost && this.players[msg.id]) {
                    this.players[msg.id].lastSeen = Date.now();
                    this.players[msg.id].isReady = msg.ready;
                    this.broadcastLobbyUpdate();
                }
                break;

            case 'lobby_ping':
                // Client is alive in the lobby — update lastSeen
                if (this.isHost && this.players[msg.id]) {
                    this.players[msg.id].lastSeen = Date.now();
                }
                break;

            case 'leave':
                const leavingPlayer = this.players[msg.id];
                if (leavingPlayer) {
                    delete this.players[msg.id];
                    if (this.isHost) {
                        this.broadcastLobbyUpdate();
                        this.sendChatMsg(`${leavingPlayer.name} hat die Lobby verlassen.`);
                    } else {
                        this.callbacks.onLobbyUpdate(this.players);
                    }
                }
                break;

            case 'heartbeat':
                // Heartbeat from host to keep room alive and confirm host is active
                if (!this.isHost && this.players[msg.hostId]) {
                    this.players[msg.hostId].lastSeen = Date.now();
                }
                break;

            case 'start_game':
                this.callbacks.onGameStart(msg.settings);
                break;

            case 'host_migration':
                console.log(`Host migration! New Host is: ${msg.newHostId}`);
                if (this.players[msg.oldHostId]) {
                    delete this.players[msg.oldHostId];
                }
                
                // Update host status
                for (let pid in this.players) {
                    this.players[pid].isHost = (pid === msg.newHostId);
                }

                if (msg.newHostId === this.myId) {
                    this.isHost = true;
                    this.stopHeartbeatWatcher();
                    this.startHeartbeat();
                    this.sendChatMsg("Du bist jetzt der Raum-Host!");
                }

                this.callbacks.onHostMigrated(msg.newHostId);
                this.callbacks.onLobbyUpdate(this.players);
                break;
        }
    }

    broadcastLobbyUpdate() {
        if (!this.isHost) return;
        // Host is always ready
        if (this.players[this.myId]) {
            this.players[this.myId].isReady = true;
        }
        this.publish('system', {
            type: 'lobby_sync',
            players: this.players,
            mode: window.game.gameMode,
            map: window.game.currentMapKey,
            rounds: window.game.maxRounds || 10,
            duration: window.game.gameDurationSec || 90,
            interval: window.game.randomSwitchInterval || 15
        });
    }

    // Host heartbeat to keep everyone connected
    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.publish('system', {
                type: 'heartbeat',
                hostId: this.myId
            });
            // Host also cleans up dead clients who haven't sent syncs in a long time (only during game/lobby)
            const now = Date.now();
            let changed = false;
            for (let pid in this.players) {
                if (pid !== this.myId && now - this.players[pid].lastSeen > 8000) {
                    const deadPlayer = this.players[pid];
                    console.log(`Removing disconnected player: ${deadPlayer.name}`);
                    delete this.players[pid];
                    this.sendChatMsg(`${deadPlayer.name} hat die Verbindung verloren.`);
                    changed = true;
                }
            }
            if (changed) {
                this.broadcastLobbyUpdate();
            }
        }, 3000);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    // Clients watch for Host disconnections
    startHeartbeatWatcher() {
        this.stopHeartbeatWatcher();
        this.checkMissedHeartbeatsTimer = setInterval(() => {
            const hostPlayer = Object.values(this.players).find(p => p.isHost);
            if (!hostPlayer) return;

            const now = Date.now();
            // If we haven't seen the host in 7 seconds, migrate!
            if (now - hostPlayer.lastSeen > 7000) {
                console.log("Host timed out! Electing new host...");
                this.migrateHost(hostPlayer.id);
            }
        }, 2000);
    }

    stopHeartbeatWatcher() {
        if (this.checkMissedHeartbeatsTimer) {
            clearInterval(this.checkMissedHeartbeatsTimer);
            this.checkMissedHeartbeatsTimer = null;
        }
    }

    // Lobby ping: non-host clients send a ping every 4s so host doesn't time them out
    startLobbyPing() {
        this.stopLobbyPing();
        this.lobbyPingTimer = setInterval(() => {
            if (!this.isHost && this.roomCode) {
                this.publish('system', { type: 'lobby_ping', id: this.myId });
            } else {
                // If we became host or left, stop pinging
                this.stopLobbyPing();
            }
        }, 4000);
    }

    stopLobbyPing() {
        if (this.lobbyPingTimer) {
            clearInterval(this.lobbyPingTimer);
            this.lobbyPingTimer = null;
        }
    }

    migrateHost(oldHostId) {
        // Find next player in line (alphabetical by ID) to become host
        const activeIds = Object.keys(this.players)
            .filter(pid => pid !== oldHostId)
            .sort();

        if (activeIds.length === 0) {
            // No players left to migrate to
            this.leaveRoom();
            return;
        }

        const newHostId = activeIds[0];
        
        // If I am the next player, trigger migration announcement
        if (newHostId === this.myId) {
            this.publish('system', {
                type: 'host_migration',
                oldHostId: oldHostId,
                newHostId: this.myId
            });
        }
    }
}

// Global instance exposed
window.multiplayer = new MultiplayerManager();
