/**
 * Crazy Tag - Multiplayer Management Layer (Firebase Realtime Database)
 */

class MultiplayerManager {
    constructor() {
        this.db = null;
        this.roomCode = null;
        this.myId = 'player_' + Math.random().toString(36).substr(2, 9);
        this.myName = 'Spieler';
        this.myColor = '#5c7cfa';
        this.myAbilities = ['teleport', 'moveplus'];
        this.players = {}; // Keyed by playerId: { id, name, color, abilities, isHost, isReady, lastSeen }
        this.isHost = false;

        // Callback hooks to be bound by game.js
        this.callbacks = {
            onConnected: () => {},
            onConnectionFailed: () => {},
            onLobbyUpdate: (players, mode, map, rounds, duration, interval) => {},
            onGameStart: (settings) => {},
            onPlayerSync: (id, state) => {},
            onGameEvent: (event) => {},
            onChatMsg: (senderName, senderColor, text) => {},
            onReaction: (senderId, emoji) => {},
            onHostMigrated: (newHostId) => {},
            onReturnToLobby: () => {}
        };

        // Firebase event listeners tracker (for off-binding)
        this.listeners = {};

        // Initialize Firebase connection
        this.initFirebase();
    }

    // Initialize Firebase Web SDK (Compat mode)
    initFirebase() {
        if (typeof firebase === 'undefined') {
            console.warn("Firebase SDK is not loaded yet. Retrying in 500ms...");
            setTimeout(() => this.initFirebase(), 500);
            return;
        }

        try {
            const firebaseConfig = {
                databaseURL: "https://test-e7832-default-rtdb.firebaseio.com/"
            };

            // Initialize app if not already done
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.db = firebase.database();
            console.log("Firebase Realtime Database initialized successfully.");
            
            // Fire connected callback
            setTimeout(() => this.callbacks.onConnected(), 100);
        } catch (e) {
            console.error("Firebase initialization failed:", e);
            setTimeout(() => this.callbacks.onConnectionFailed(), 100);
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
        // Generate a 6-character room code
        const randStr = Math.random().toString(36).substr(2, 6).toUpperCase();
        this.roomCode = randStr;
        this.isHost = true;
        this.myName = name || 'Host';
        this.myColor = color;
        this.players = {};

        if (!this.db) {
            console.error("Firebase not connected!");
            return;
        }

        const roomRef = this.db.ref('rooms/' + this.roomCode);

        // Current player entry
        const me = {
            id: this.myId,
            name: this.myName,
            color: this.myColor,
            abilities: this.myAbilities,
            isHost: true,
            isReady: true,
            lastSeen: Date.now()
        };

        this.players[this.myId] = me;

        // Clear and initialize room
        roomRef.remove().then(() => {
            // Set initial room info
            roomRef.child('info').set({
                mode: 'classic',
                map: 'classic',
                rounds: 10,
                duration: 90,
                interval: 15,
                isGameActive: false,
                hostId: this.myId
            });

            // Set player entry
            const myPlayerRef = roomRef.child('players/' + this.myId);
            myPlayerRef.set(me);

            // Configure disconnect removal hooks
            myPlayerRef.onDisconnect().remove();
            roomRef.child('sync/' + this.myId).onDisconnect().remove();

            // Establish room listeners
            this.setupRoomListeners();

            if (onSuccess) onSuccess(this.roomCode);
        }).catch(err => {
            console.error("Failed to create room:", err);
        });
    }

    // Join an existing room
    joinRoom(code, name, color, onSuccess, onFailure) {
        this.roomCode = code.toUpperCase();
        this.isHost = false;
        this.myName = name || 'Spieler';
        this.myColor = color;
        this.players = {};

        if (!this.db) {
            if (onFailure) onFailure("Verbindung zur Datenbank fehlt.");
            return;
        }

        const roomRef = this.db.ref('rooms/' + this.roomCode);

        // Check if room exists by checking 'info' node
        roomRef.child('info').once('value').then(snapshot => {
            if (!snapshot.exists()) {
                if (onFailure) onFailure("Raum existiert nicht! Überprüfe den Code.");
                return;
            }

            const me = {
                id: this.myId,
                name: this.myName,
                color: this.myColor,
                abilities: this.myAbilities,
                isHost: false,
                isReady: false,
                lastSeen: Date.now()
            };

            const myPlayerRef = roomRef.child('players/' + this.myId);
            myPlayerRef.set(me).then(() => {
                // Configure disconnect removal hooks
                myPlayerRef.onDisconnect().remove();
                roomRef.child('sync/' + this.myId).onDisconnect().remove();

                // Establish room listeners
                this.setupRoomListeners();

                // Announce entrance
                this.sendChatMsg(`${this.myName} hat die Lobby betreten!`);

                if (onSuccess) onSuccess();
            });
        }).catch(err => {
            if (onFailure) onFailure("Verbindung fehlgeschlagen: " + err.message);
        });
    }

    // Leave current room
    leaveRoom() {
        this.clearRoomListeners();

        if (this.roomCode && this.db) {
            this.sendChatMsg(`${this.myName} hat die Lobby verlassen.`);
            this.db.ref('rooms/' + this.roomCode + '/players/' + this.myId).remove();
            this.db.ref('rooms/' + this.roomCode + '/sync/' + this.myId).remove();
        }

        this.roomCode = null;
        this.isHost = false;
        this.players = {};
    }

    // Establish Real-time database event listeners
    setupRoomListeners() {
        this.clearRoomListeners();

        const roomRef = this.db.ref('rooms/' + this.roomCode);

        // 1. Players Listener (Sync complete player states, host status, kicks)
        this.listeners.players = roomRef.child('players').on('value', snapshot => {
            const playersVal = snapshot.val() || {};
            this.players = playersVal;

            // Host migration logic (if current host disconnected/deleted)
            const hostPlayer = Object.values(this.players).find(p => p.isHost);
            if (!hostPlayer && Object.keys(this.players).length > 0) {
                this.migrateHost();
            }

            // Sync settings parameters down
            roomRef.child('info').once('value').then(infoSnap => {
                const info = infoSnap.val() || {};
                this.callbacks.onLobbyUpdate(
                    this.players, 
                    info.mode, 
                    info.map, 
                    info.rounds, 
                    info.duration, 
                    info.interval
                );
            });
        });

        // 2. Room Info Listener (Game starts, returns to lobby)
        this.listeners.info = roomRef.child('info').on('value', snapshot => {
            const info = snapshot.val();
            if (!info) return;

            // Update local representation
            const hostPlayer = Object.values(this.players).find(p => p.isHost);
            if (hostPlayer && hostPlayer.id !== info.hostId) {
                // Update local settings metadata
                this.callbacks.onLobbyUpdate(
                    this.players, 
                    info.mode, 
                    info.map, 
                    info.rounds, 
                    info.duration, 
                    info.interval
                );
            }

            // Monitor active gameplay status
            if (info.isGameActive && window.game && !window.game.isPlaying) {
                roomRef.child('gameState').once('value').then(stateSnap => {
                    const gameState = stateSnap.val() || {};
                    this.callbacks.onGameStart({
                        mode: info.mode,
                        map: info.map,
                        maxRounds: info.rounds,
                        duration: info.duration,
                        interval: info.interval,
                        round: gameState.round || 1,
                        scores: gameState.scores || {},
                        seekerId: gameState.seekerId || null,
                        gameDuration: gameState.gameDuration || info.duration || 90
                    });
                });
            } else if (!info.isGameActive && window.game && window.game.isPlaying) {
                // Transition back to lobby
                this.callbacks.onReturnToLobby();
            }
        });

        // 3. Position Sync Listener (Child updates — optimized for 30Hz throughput)
        this.listeners.sync = roomRef.child('sync').on('child_changed', snapshot => {
            const pid = snapshot.key;
            if (pid === this.myId) return;

            const syncData = snapshot.val();
            if (syncData) {
                this.callbacks.onPlayerSync(pid, syncData);
            }
        });

        this.listeners.syncAdded = roomRef.child('sync').on('child_added', snapshot => {
            const pid = snapshot.key;
            if (pid === this.myId) return;

            const syncData = snapshot.val();
            if (syncData) {
                this.callbacks.onPlayerSync(pid, syncData);
            }
        });

        // 4. Game Events Queue
        this.listeners.events = roomRef.child('events').on('child_added', snapshot => {
            const event = snapshot.val();
            if (event && event.sender !== this.myId) {
                this.callbacks.onGameEvent(event);
            }
        });

        // 5. Chat & Reactions Queue
        this.listeners.chat = roomRef.child('chat').on('child_added', snapshot => {
            const msg = snapshot.val();
            if (msg && msg.id !== this.myId) {
                if (msg.type === 'reaction') {
                    this.callbacks.onReaction(msg.id, msg.emoji);
                } else {
                    this.callbacks.onChatMsg(msg.name, msg.color, msg.text);
                }
            }
        });
    }

    // Detach all Real-time database event listeners
    clearRoomListeners() {
        if (!this.db || !this.roomCode) return;

        const roomRef = this.db.ref('rooms/' + this.roomCode);

        if (this.listeners.players) roomRef.child('players').off('value', this.listeners.players);
        if (this.listeners.info) roomRef.child('info').off('value', this.listeners.info);
        if (this.listeners.sync) roomRef.child('sync').off('child_changed', this.listeners.sync);
        if (this.listeners.syncAdded) roomRef.child('sync').off('child_added', this.listeners.syncAdded);
        if (this.listeners.events) roomRef.child('events').off('child_added', this.listeners.events);
        if (this.listeners.chat) roomRef.child('chat').off('child_added', this.listeners.chat);

        this.listeners = {};
    }

    // Elect new host alphabetically from remaining players
    migrateHost() {
        const activeIds = Object.keys(this.players).sort();
        if (activeIds.length === 0) {
            this.leaveRoom();
            return;
        }

        const newHostId = activeIds[0];

        // If I am the next host, write update to database
        if (newHostId === this.myId) {
            console.log("Migrating room host status to me:", this.myId);
            const roomRef = this.db.ref('rooms/' + this.roomCode);
            
            roomRef.child('players/' + this.myId + '/isHost').set(true);
            roomRef.child('info/hostId').set(this.myId);

            this.isHost = true;
            this.sendChatMsg("Du bist jetzt der Raum-Host!");
            this.callbacks.onHostMigrated(this.myId);
        }
    }

    // High frequency position updates
    sendPositionSync(state) {
        if (!this.db || !this.roomCode) return;

        const syncMsg = {
            id: this.myId,
            x: Math.round(state.x),
            y: Math.round(state.y),
            vx: Math.round(state.vx * 10) / 10,
            vy: Math.round(state.vy * 10) / 10,
            facing: state.facing,
            anim: state.anim,
            isDead: state.isDead,
            activeAbils: state.activeAbils,
            inputs: state.inputs
        };

        // Write directly to our sync node
        this.db.ref('rooms/' + this.roomCode + '/sync/' + this.myId).set(syncMsg);
    }

    // Publish a gameplay event (tag, swap, etc.)
    sendGameEvent(event) {
        if (!this.db || !this.roomCode) return;
        event.sender = this.myId;
        event.timestamp = Date.now();
        this.db.ref('rooms/' + this.roomCode + '/events').push(event);
    }

    // Publish chat message
    sendChatMsg(text) {
        if (!this.db || !this.roomCode) return;
        this.db.ref('rooms/' + this.roomCode + '/chat').push({
            id: this.myId,
            name: this.myName,
            color: this.myColor,
            text: text,
            timestamp: Date.now()
        });
    }

    // Publish a reactions event
    sendReaction(emoji) {
        if (!this.db || !this.roomCode) return;
        this.db.ref('rooms/' + this.roomCode + '/chat').push({
            id: this.myId,
            type: 'reaction',
            emoji: emoji,
            timestamp: Date.now()
        });
    }

    // Update abilities list
    updateMyAbilities(abils) {
        this.myAbilities = abils;
        if (this.roomCode && this.db) {
            this.db.ref('rooms/' + this.roomCode + '/players/' + this.myId + '/abilities').set(abils);
        }
    }

    // Update ready state
    updateMyReadyState(ready) {
        if (this.roomCode && this.db) {
            this.db.ref('rooms/' + this.roomCode + '/players/' + this.myId + '/isReady').set(ready);
        }
    }

    // Update name
    updateMyName(newName) {
        const oldName = this.myName;
        this.myName = newName;
        if (this.roomCode && this.db) {
            this.db.ref('rooms/' + this.roomCode + '/players/' + this.myId + '/name').set(newName);
            this.sendChatMsg(`${oldName} heißt nun ${newName}`);
        }
    }

    // Host triggers game start
    startGame(settings) {
        if (!this.isHost || !this.db || !this.roomCode) return;

        const roomRef = this.db.ref('rooms/' + this.roomCode);

        // Clear historical game events to start fresh
        roomRef.child('events').remove();

        // Configure active settings info
        roomRef.child('info').update({
            mode: settings.mode,
            map: settings.map,
            rounds: settings.maxRounds,
            duration: settings.duration,
            interval: settings.interval,
            isGameActive: true
        });

        // Initialize game states
        roomRef.child('gameState').set({
            round: settings.round || 1,
            scores: settings.scores || {},
            seekerId: settings.seekerId || null,
            gameDuration: settings.gameDuration || settings.duration || 90
        });
    }

    // Host triggers return to lobby screen
    returnToLobby() {
        if (!this.isHost || !this.db || !this.roomCode) return;

        const roomRef = this.db.ref('rooms/' + this.roomCode);

        // Reset non-host players' ready states
        for (let pid in this.players) {
            if (pid !== this.myId) {
                roomRef.child('players/' + pid + '/isReady').set(false);
            }
        }

        // Set game state inactive
        roomRef.child('info/isGameActive').set(false);
    }

    // Sync lobby settings updates (Host triggers)
    broadcastLobbyUpdate() {
        if (!this.isHost || !this.db || !this.roomCode) return;

        this.db.ref('rooms/' + this.roomCode + '/info').update({
            mode: window.game ? window.game.gameMode : 'classic',
            map: window.game ? window.game.currentMapKey : 'classic',
            rounds: window.game ? (window.game.maxRounds || 10) : 10,
            duration: window.game ? (window.game.gameDurationSec || 90) : 90,
            interval: window.game ? (window.game.randomSwitchInterval || 15) : 15
        });
    }

    // Backward compatibility stubs (no-ops for Firebase backend)
    startLobbyPing() {}
    stopLobbyPing() {}
    startHeartbeat() {}
    stopHeartbeat() {}
    startHeartbeatWatcher() {}
    stopHeartbeatWatcher() {}
}

// Global instance exposed
window.multiplayer = new MultiplayerManager();
