/**
 * Crazy Tag - 2D Platformer Engine & UI Controller
 */

// Web Audio API Synthesizer Engine
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        try {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {
            console.warn("SoundEngine initialization failed:", e);
            this.ctx = null;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        const icon = document.querySelector('#sound-toggle-btn i');
        if (this.enabled) {
            if (icon) icon.className = 'fas fa-volume-up';
            this.init();
        } else {
            if (icon) icon.className = 'fas fa-volume-mute';
        }
        return this.enabled;
    }

    playJump() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }

    playDash() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 0.1;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
            noise.stop(this.ctx.currentTime + 0.1);
        } catch (e) {}
    }

    playTag() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.3);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        } catch (e) {}
    }

    playFreeze() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
        } catch (e) {}
    }

    playTimeStop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.8);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.8);
        } catch (e) {}
    }

    playLavaBurn() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(90, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.4);

            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.4);
        } catch (e) {}
    }

    playWin() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C Major chord
            notes.forEach((freq, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + index * 0.1);
                gain.gain.setValueAtTime(0.12, now + index * 0.1);
                gain.gain.linearRampToValueAtTime(0.01, now + index * 0.1 + 0.4);

                osc.start(now + index * 0.1);
                osc.stop(now + index * 0.1 + 0.4);
            });
        } catch (e) {}
    }

    playAlert() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, this.ctx.currentTime);
            osc.frequency.setValueAtTime(450, this.ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }
}

const sound = new SoundEngine();

// Ability Definitions
const ABILITIES_REGISTRY = {
    teleport: {
        name: "Teleport (Blink)",
        desc: "Teleportiere in Bewegungsrichtung",
        icon: "fa-bolt",
        cooldown: 15000
    },
    moveplus: {
        name: "Movement Plus",
        desc: "Schneller laufen & Doppelsprung",
        icon: "fa-angles-up",
        cooldown: 20000
    },
    timestop: {
        name: "Time Stop",
        desc: "Friere alle anderen für 1.5s ein",
        icon: "fa-hourglass-start",
        cooldown: 20000
    },
    phase: {
        name: "Phase (Schatten)",
        desc: "Unverwundbar & Gehe durch Wände für 3s",
        icon: "fa-ghost",
        cooldown: 14000
    },
    invis: {
        name: "Unsichtbarkeit",
        desc: "Werde für 4s komplett unsichtbar",
        icon: "fa-eye-slash",
        cooldown: 14000
    },
    knockback: {
        name: "Rückstoß-Druckwelle",
        desc: "Schleudere nahe Spieler weit weg",
        icon: "fa-expand-arrows-alt",
        cooldown: 10000
    },
    swap: {
        name: "Positionstausch",
        desc: "Tausche Ort mit einem zufälligen Spieler",
        icon: "fa-arrows-rotate",
        cooldown: 15000
    },
    dash: {
        name: "Dash",
        desc: "Bewege dich 4 Blöcke weit in Bewegungsrichtung mit Invincibility",
        icon: "fa-gauge-high",
        cooldown: 12000
    },
    gluetrap: {
        name: "Klebefalle",
        desc: "Platziere bis zu 2 Fallen, die Gegner um 79% verlangsamt",
        icon: "fa-snowflake",
        cooldown: 10000
    },
    gravity: {
        name: "Gravitations-Flip",
        desc: "Drehe Schwerkraft für dich für 5s um",
        icon: "fa-arrows-up-down",
        cooldown: 15000
    },
    decoy: {
        name: "Ablenkung (Decoy)",
        desc: "Erzeuge einen Klon, der läuft",
        icon: "fa-users-rectangle",
        cooldown: 16000
    },
    blindness: {
        name: "Erblindung",
        desc: "Schränke Sichtbereich anderer Spieler für 3s ein",
        icon: "fa-user-ninja",
        cooldown: 14000
    },
    wallplace: {
        name: "Barriere",
        desc: "Erzeuge solide Energiewand vor dir für 4s",
        icon: "fa-bars",
        cooldown: 16000
    },
    disguise: {
        name: "Spiegelbild (Disguise)",
        desc: "Ändere deine Leuchtmarkierung für 3.5s",
        icon: "fa-mask",
        cooldown: 15000
    },
    shrink: {
        name: "Schrumpfen",
        desc: "Werde für 5s winzig klein (13x13px)",
        icon: "fa-compress-arrows-alt",
        cooldown: 15000
    },
    webtrap: {
        name: "Spinnennetz",
        desc: "Platziere Netz, das Gegner für 0.75s fesselt (Max. 1 Netz)",
        icon: "fa-spider",
        cooldown: 12000
    },
    invertkeys: {
        name: "Invertierte Tasten",
        desc: "Kehrt die Steuerung aller Gegner für 3s um",
        icon: "fa-repeat",
        cooldown: 22000
    },
    mindcontrol: {
        name: "Gedankenkontrolle",
        desc: "Steuere einen Gegner für 4s; dein eigener Körper ist starr",
        icon: "fa-brain",
        cooldown: 25000
    },
    clonetrio: {
        name: "Klon-Trio",
        desc: "Erzeuge 3 Klone für 2s, die in verschiedene Richtungen weglaufen",
        icon: "fa-users",
        cooldown: 20000
    },
    blastshot: {
        name: "Schallprojektil",
        desc: "Schieße ein Projektil, das Gegner stark wegstößt",
        icon: "fa-bullseye",
        cooldown: 12000
    },
    shield: {
        name: "Schutzschild",
        desc: "2.5s Schild: Immun gegen Fangen & stößt Fänger weg",
        icon: "fa-shield-halved",
        cooldown: 14000
    },
    random: {
        name: "Zufall",
        desc: "Löst eine zufällige Fähigkeit aus und rotiert weiter",
        icon: "fa-shuffle",
        cooldown: 22000
    }
};

// Map Tile Registry
// Dimension 30 columns x 17 rows. Tile size is 32x32. Total: 960x544.
const MAPS = {
    classic: {
        name: "Standard-Raster",
        bgColor: "#1f212a",
        tileColor: "#424759",
        grid: [
            "##############################",
            "#                            #",
            "#                            #",
            "#                            #",
            "#         ########           #",
            "#                            #",
            "#                            #",
            "#                            #",
            "#    #####        #####      #",
            "#                            #",
            "#                            #",
            "#                            #",
            "#          ######            #",
            "#                            #",
            "#                            #",
            "#                            #",
            "##############################"
        ]
    },
    jungle: {
        name: "Jungle Canopy",
        bgColor: "#14221c",
        tileColor: "#2e5d32",
        bushColor: "rgba(55, 178, 77, 0.4)",
        grid: [
            "##############################",
            "#        B          B        #",
            "#       ###        ###       #",
            "#                            #",
            "#                            #",
            "#                            #",
            "#     B      ####      B     #",
            "#######      ####      #######",
            "#                            #",
            "#                            #",
            "#    T                  T    #",
            "#   ####              ####   #",
            "#                            #",
            "#                            #",
            "##            B             ##",
            "#          #######           #",
            "##############################"
        ]
    },
    space: {
        name: "Space Station",
        bgColor: "#0b0c16",
        tileColor: "#3a415a",
        grid: [
            "##############################",
            "#                            #",
            "#                            #",
            "#   P1                       #",
            "#   ###                ###   #",
            "#                            #",
            "#                            #",
            "#                            #",
            "#          ########          #",
            "#                            #",
            "#                            #",
            "#   P2                  P1   #",
            "#####                  #######",
            "#                            #",
            "#                            #",
            "#                            #",
            "##############################"
        ]
    },
    volcano: {
        name: "Volcano Arena",
        bgColor: "#241212",
        tileColor: "#4a1c1c",
        grid: [
            "##############################",
            "#                            #",
            "#                            #",
            "#         ###    ###         #",
            "#                            #",
            "#                            #",
            "#    ####            ####    #",
            "#                            #",
            "#                            #",
            "####                      ####",
            "#                            #",
            "#                            #",
            "#          ########          #",
            "#                            #",
            "#                            #",
            "#                            #",
            "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL"
        ]
    },
    ice: {
        name: "Ice Peaks",
        bgColor: "#132135",
        tileColor: "#577ca8",
        grid: [
            "##############################",
            "#                            #",
            "#                            #",
            "#         IIIIIIIIII         #",
            "#                            #",
            "#                            #",
            "#    III              III    #",
            "#                            #",
            "#                            #",
            "III                        III",
            "#                            #",
            "#                            #",
            "#          IIIIIIII          #",
            "#                            #",
            "#                            #",
            "#                            #",
            "IIIIIIIIIIIIIIIIIIIIIIIIIIIIII"
        ]
    }
};

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.canvas.width = 960;
        this.canvas.height = 544;
        this.ctx = this.canvas.getContext('2d');
        
        this.activeScreen = 'screen-menu';
        this.isPlaying = false;
        
        // Physics configurations
        this.gravity = 0.4;
        this.friction = 0.85;
        this.iceFriction = 0.98;
        this.normalFriction = 0.85;
        
        // Match States
        this.currentMapKey = 'classic';
        this.currentMap = MAPS.classic;
        this.gameMode = 'classic';
        this.seekerId = null;
        this.tagImmunityTimer = 0; // Prevent instant tag backs
        this.gameDuration = 60; // seconds
        this.gameTimer = null;
        
        // Players (Local and remote)
        this.localPlayer = {
            x: 100,
            y: 100,
            vx: 0,
            vy: 0,
            width: 26,
            height: 26,
            facing: 1, // 1 = right, -1 = left
            isSeeker: false,
            isDead: false,
            deadTimer: 0,
            abilities: ['teleport', 'moveplus'],
            cooldowns: [0, 0, 0],
            gravityDirection: 1, // 1 = down, -1 = up
            doubleJumpAvailable: true,
            activeAbilities: {
                invis: 0,
                phase: 0,
                dash: 0,
                gravity: 0,
                disguise: 0,
                shrink: 0,
                shield: 0
            },
            blindnessTimer: 0,
            keysInvertedTimer: 0,
            isMindControlled: false,
            mindControlTimer: 0,
            name: "Spieler",
            color: "#5c7cfa",
            passiveAbility: 'seeker_speed',
            queuedRandomAbility: null,
            speedBuffTimer: 0,
            isReady: false
        };
        
        this.remotePlayers = {}; // Keyed by ID: current sync data + rendering coords
        
        // Inputs
        this.keys = {};
        this.jumpPressed = false;
        this._syncAccumulatedJump = false;
        
        // Hazards & Obstacles arrays
        this.fireballs = [];
        this.icicles = [];
        this.glueTraps = [];
        this.webTraps = [];
        this.defenseProjectiles = [];
        this.particles = [];
        this.mapItems = [];
        this.roundItemsOrder = [];
        this.spawnedIntervals = [false, false, false];

        // Mind Control State
        this.isMindControlling = false;
        this.mindControlTargetId = null;
        this.mindControlTimer = 0;
        this.controlledKeys = null;
        this.floatingEmojis = [];
        this.decoys = [];
        this.temporaryWalls = [];
        this.dashShadows = [];
        this.shockwaves = [];
        
        // Time Stop State
        this.timeStoppedBy = null;
        this.timeStopDuration = 0;

        // Random Mode timers
        this.randomSwitchTimer = 0;

        // Round structures
        this.currentRound = 1;
        this.maxRounds = 1;
        this.gameDurationSec = 90; // Default 1:30
        this.randomSwitchInterval = 15; // Default 15s
        this.playerScores = {};
        this.showRoundOverStandings = false;
        this.roundOverCountdown = 0;

        // Custom Keybindings
        const defaultControls = {
            left: ['a', 'arrowleft'],
            right: ['d', 'arrowright'],
            up: ['w', 'arrowup'],
            down: ['s', 'arrowdown'],
            jump: [' ', 'spacebar'],
            slot1: ['click_left'],
            slot2: ['click_right'],
            slot3: ['r']
        };
        try {
            const savedControls = localStorage.getItem('crazy-tag-controls');
            this.controls = savedControls ? JSON.parse(savedControls) : defaultControls;
            if (!this.controls.slot3) {
                this.controls.slot3 = ['r'];
            }
        } catch (e) {
            this.controls = defaultControls;
        }
        this.waitingForRebind = null;

        // Mobile touch control inputs
        this.mobileMode = false;
        this.mobileJoystickX = 0;
        this.mobileJoystickY = 0;
        this.mobileJoystickWasUp = false;

        // Test room state variables
        this.inTestRoom = false;
        this.bot = null;
        this.botEnabled = true;
        
        // Ability modal state variables
        this.modalTargetSlot = 0;
        this.modalContext = 'lobby'; // 'lobby' or 'testroom'

        // Load saved theme
        const savedTheme = localStorage.getItem('crazy-tag-theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }

        this.rollNextRandomAbility();

        // Setup DOM event listeners
        this.initUI();
    }

    // --- UI Layout & Setup Functions ---
    initUI() {
        // Load saved player name or fallback to auto-generated name
        const savedPlayerName = localStorage.getItem('crazy-tag-player-name');
        if (savedPlayerName) {
            document.getElementById('player-name-input').value = savedPlayerName;
        } else {
            const randNum = Math.floor(Math.random() * 900) + 100;
            document.getElementById('player-name-input').value = `Spieler${randNum}`;
        }

        // Theme toggle binding (Cog dropdown theme checkbox)
        const themeChk = document.getElementById('settings-theme-chk');
        const updateThemeUI = () => {
            const isLight = document.body.classList.contains('light-theme');
            themeChk.checked = isLight;
        };
        updateThemeUI();
        themeChk.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('light-theme');
                localStorage.setItem('crazy-tag-theme', 'light');
            } else {
                document.body.classList.remove('light-theme');
                localStorage.setItem('crazy-tag-theme', 'dark');
            }
        });

        // Settings dropdown toggle
        const settingsToggleBtn = document.getElementById('settings-toggle-btn');
        const settingsDropdown = document.getElementById('settings-dropdown');
        settingsToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('hidden');
        });

        window.addEventListener('click', (e) => {
            if (!settingsDropdown.classList.contains('hidden') && !settingsDropdown.contains(e.target) && !settingsToggleBtn.contains(e.target)) {
                settingsDropdown.classList.add('hidden');
            }
        });

        // Sound switch checkbox binding
        const soundChk = document.getElementById('settings-sound-chk');
        soundChk.checked = sound.enabled;
        soundChk.addEventListener('change', (e) => {
            sound.enabled = e.target.checked;
            if (sound.enabled) sound.init();
        });

        // Mobile mode checkbox binding
        const mobileChk = document.getElementById('settings-mobile-chk');
        mobileChk.addEventListener('change', (e) => {
            this.toggleMobileMode(e.target.checked);
        });

        // Auto-detect mobile devices
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isTouchDevice) {
            mobileChk.checked = true;
            this.toggleMobileMode(true);
        }

        // Fullscreen mode checkbox binding
        const fullscreenChk = document.getElementById('settings-fullscreen-chk');
        fullscreenChk.addEventListener('change', (e) => {
            this.toggleFullscreen(e.target.checked);
        });

        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = !!document.fullscreenElement;
            fullscreenChk.checked = isFullscreen;
            if (isFullscreen) {
                document.body.focus();
            }
        });

        // Blur checkboxes and range sliders to prevent keyboard lock on settings modifications
        document.querySelectorAll('input[type="checkbox"], input[type="range"]').forEach(input => {
            input.addEventListener('change', () => input.blur());
            input.addEventListener('click', () => input.blur());
        });

        // Main Menu controls
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                colorOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.localPlayer.color = opt.dataset.color;
                const avatar = document.getElementById('avatar-preview');
                avatar.style.backgroundColor = opt.dataset.color;
            });
        });

        // Initialize avatar color
        document.getElementById('avatar-preview').style.backgroundColor = this.localPlayer.color;

        document.getElementById('create-room-btn').addEventListener('click', () => {
            const name = document.getElementById('player-name-input').value.trim() || 'Spieler';
            localStorage.setItem('crazy-tag-player-name', name);
            sound.init();
            this.localPlayer.name = name;
            multiplayer.createRoom(name, this.localPlayer.color, (code) => {
                this.showScreen('screen-lobby');
                document.getElementById('lobby-room-code').textContent = code;
                this.updateLobbyQRCode(code);
                this.updateLobbyAbilityButtons();
                this.updateLobbyReadyState();
                this.updateLobbyControls();
            });
        });

        document.getElementById('join-room-btn').addEventListener('click', () => {
            const code = document.getElementById('room-code-input').value.trim().toUpperCase();
            const name = document.getElementById('player-name-input').value.trim() || 'Spieler';
            if (code.length !== 6) {
                alert("Der Code muss 6 Zeichen lang sein!");
                return;
            }
            localStorage.setItem('crazy-tag-player-name', name);
            sound.init();
            this.localPlayer.name = name;
            multiplayer.joinRoom(code, name, this.localPlayer.color, () => {
                this.showScreen('screen-lobby');
                document.getElementById('lobby-room-code').textContent = code;
                this.updateLobbyQRCode(code);
                this.updateLobbyAbilityButtons();
                this.updateLobbyReadyState();
                this.updateLobbyControls();
            }, (err) => {
                alert(err);
            });
        });

        // Collapsible Test Room settings panel
        const testPanelHeader = document.getElementById('test-panel-header');
        const testRoomPanel = document.getElementById('test-room-panel');
        const testPanelChevron = document.getElementById('test-panel-chevron');
        if (testPanelHeader && testRoomPanel && testPanelChevron) {
            testPanelHeader.addEventListener('click', () => {
                const isCollapsed = testRoomPanel.classList.toggle('collapsed');
                if (isCollapsed) {
                    testPanelChevron.className = 'fa-solid fa-chevron-down';
                    testPanelHeader.style.borderBottom = 'none';
                    testPanelHeader.style.paddingBottom = '0';
                } else {
                    testPanelChevron.className = 'fa-solid fa-chevron-up';
                    testPanelHeader.style.borderBottom = '1.5px solid var(--border-color)';
                    testPanelHeader.style.paddingBottom = '6px';
                }
            });
        }

        document.getElementById('copy-code-btn').addEventListener('click', () => {
            const code = document.getElementById('lobby-room-code').textContent;
            navigator.clipboard.writeText(window.location.origin + window.location.pathname + "?room=" + code)
                .then(() => alert("Raum-Link in die Zwischenablage kopiert!"))
                .catch(() => alert("Kopieren fehlgeschlagen: " + code));
        });

        // Lobby actions
        document.getElementById('leave-lobby-btn').addEventListener('click', () => {
            multiplayer.leaveRoom();
            const qrImg = document.getElementById('lobby-qr-image');
            if (qrImg) {
                qrImg.src = '';
                qrImg.style.display = 'none';
            }
            this.showScreen('screen-menu');
        });

        document.getElementById('start-game-btn').addEventListener('click', () => {
            if (!multiplayer.isHost) return;
            
            multiplayer.startGame({
                mode: this.gameMode,
                map: this.currentMapKey,
                maxRounds: this.maxRounds,
                duration: this.gameDurationSec,
                interval: this.randomSwitchInterval,
                round: 1,
                scores: {}
            });
        });

        // Game Over screen actions
        document.getElementById('rematch-btn').addEventListener('click', () => {
            if (multiplayer.isHost) {
                multiplayer.returnToLobby();
            }
        });

        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            multiplayer.leaveRoom();
            const qrImg = document.getElementById('lobby-qr-image');
            if (qrImg) {
                qrImg.src = '';
                qrImg.style.display = 'none';
            }
            this.showScreen('screen-menu');
        });

        // Check if there is a room in URL params to auto-fill
        const urlParams = new URLSearchParams(window.location.search);
        const urlRoom = urlParams.get('room');
        if (urlRoom) {
            document.getElementById('room-code-input').value = urlRoom.toUpperCase().substring(0, 6);
        }

        // Chat listeners
        const chatInput = document.getElementById('lobby-chat-input');
        const sendChatBtn = document.getElementById('lobby-chat-send-btn');
        const sendMsg = () => {
            const txt = chatInput.value.trim();
            if (txt) {
                multiplayer.sendChatMsg(txt);
                // Immediately display sent messages locally to feel instant
                this.onChatReceived(this.localPlayer.name, this.localPlayer.color, txt);
                chatInput.value = '';
            }
        };
        sendChatBtn.addEventListener('click', sendMsg);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMsg();
        });

        // Emoji Reactions click handlers
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const emoji = btn.dataset.emoji;
                multiplayer.sendReaction(emoji);
            });
        });

        // Lobby settings triggers (Custom selections)
        document.querySelectorAll('#lobby-game-mode-group .toggle-item').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!multiplayer.isHost) return;
                document.querySelectorAll('#lobby-game-mode-group .toggle-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const mode = btn.dataset.value;
                this.gameMode = mode;

                // Adjust elements visibility
                const selectRow = document.getElementById('classic-map-select-row');
                const intervalRow = document.getElementById('random-interval-row');
                const abilsBox = document.getElementById('lobby-abilities-box');
                if (mode === 'random') {
                    selectRow.style.display = 'none';
                    intervalRow.style.display = 'flex';
                    abilsBox.style.display = 'none';
                } else {
                    selectRow.style.display = 'flex';
                    intervalRow.style.display = 'none';
                    abilsBox.style.display = 'flex';
                }

                this.updateLobbyReadyState();
                multiplayer.broadcastLobbyUpdate();
            });
        });

        document.querySelectorAll('#lobby-map-cards .map-card').forEach(card => {
            card.addEventListener('click', () => {
                if (!multiplayer.isHost) return;
                document.querySelectorAll('#lobby-map-cards .map-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.currentMapKey = card.dataset.value;
                multiplayer.broadcastLobbyUpdate();
            });
        });

        const roundsSlider = document.getElementById('lobby-rounds-slider');
        const roundsValLabel = document.getElementById('lobby-rounds-value');
        roundsSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            roundsValLabel.textContent = val === 1 ? '1 Runde' : `${val} Runden`;
            if (multiplayer.isHost) {
                this.maxRounds = val;
                multiplayer.broadcastLobbyUpdate();
            }
        });

        document.querySelectorAll('#lobby-duration-group .toggle-item').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!multiplayer.isHost) return;
                document.querySelectorAll('#lobby-duration-group .toggle-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.gameDurationSec = parseInt(btn.dataset.value);
                multiplayer.broadcastLobbyUpdate();
            });
        });

        document.querySelectorAll('#lobby-random-interval-group .toggle-item').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!multiplayer.isHost) return;
                document.querySelectorAll('#lobby-random-interval-group .toggle-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.randomSwitchInterval = parseInt(btn.dataset.value);
                multiplayer.broadcastLobbyUpdate();
            });
        });

        // Ability Slots click handlers in Lobby
        document.getElementById('ability-slot-btn-1').addEventListener('click', () => {
            if (this.gameMode === 'random') return;
            this.openAbilityPicker(0, 'lobby');
        });
        document.getElementById('ability-slot-btn-2').addEventListener('click', () => {
            if (this.gameMode === 'random') return;
            this.openAbilityPicker(1, 'lobby');
        });
        document.getElementById('ability-slot-btn-3').addEventListener('click', () => {
            if (this.gameMode === 'random') return;
            this.openAbilityPicker(2, 'lobby');
        });

        // Test Room button triggers
        document.getElementById('enter-test-room-btn').addEventListener('click', () => {
            sound.init();
            this.enterTestRoom();
        });
        document.getElementById('leave-test-room-btn').addEventListener('click', () => {
            this.leaveTestRoom();
        });
        document.getElementById('test-slot-1-btn').addEventListener('click', () => {
            this.openAbilityPicker(0, 'testroom');
        });
        document.getElementById('test-slot-2-btn').addEventListener('click', () => {
            this.openAbilityPicker(1, 'testroom');
        });
        document.getElementById('test-slot-3-btn').addEventListener('click', () => {
            this.openAbilityPicker(2, 'testroom');
        });

        // Ready button in Lobby click handler
        const readyBtn = document.getElementById('ready-btn');
        readyBtn.addEventListener('click', () => {
            this.localPlayer.isReady = !this.localPlayer.isReady;
            multiplayer.updateMyReadyState(this.localPlayer.isReady);
            if (this.localPlayer.isReady) {
                readyBtn.classList.add('btn-is-ready');
                readyBtn.textContent = 'Nicht bereit';
            } else {
                readyBtn.classList.remove('btn-is-ready');
                readyBtn.textContent = 'Bereit';
            }
        });

        // Close button for passive picker modal
        document.getElementById('close-passive-modal-btn').addEventListener('click', () => {
            document.getElementById('passive-picker-modal').classList.add('hidden');
        });

        document.getElementById('test-bot-enable-chk').addEventListener('change', (e) => {
            this.botEnabled = e.target.checked;
            if (!this.botEnabled) {
                this.bot = null;
            } else {
                this.spawnBot();
            }
        });
        document.getElementById('test-bot-respawn-btn').addEventListener('click', () => {
            if (this.botEnabled) this.spawnBot();
        });

        document.getElementById('test-trigger-bot-1-btn').addEventListener('click', () => {
            this.castBotAbilityDirectly('timestop');
        });
        document.getElementById('test-trigger-bot-2-btn').addEventListener('click', () => {
            this.castBotAbilityDirectly('blindness');
        });

        // Modal Picker elements binding
        document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderModalAbilities(btn.dataset.category);
            });
        });
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            document.getElementById('ability-picker-modal').classList.add('hidden');
        });
        document.getElementById('ability-picker-modal').addEventListener('click', (e) => {
            if (e.target.id === 'ability-picker-modal') {
                document.getElementById('ability-picker-modal').classList.add('hidden');
            }
        });

        // Controls bindings rebinding buttons
        document.querySelectorAll('.keybind-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;

                // Reset other buttons
                document.querySelectorAll('.keybind-btn').forEach(b => {
                    b.classList.remove('waiting');
                    b.textContent = this.getKeyDisplayName(this.controls[b.dataset.action][0]);
                });

                btn.classList.add('waiting');
                btn.textContent = 'Taste drücken...';
                this.waitingForRebind = action;
            });
        });

        // Window-level capture listener to bind mouse clicks during rebinding
        window.addEventListener('mousedown', (e) => {
            if (this.waitingForRebind) {
                e.preventDefault();
                e.stopPropagation();
                let bindValue = null;
                if (e.button === 0) bindValue = 'click_left';
                else if (e.button === 2) bindValue = 'click_right';
                
                if (bindValue) {
                    const btn = document.querySelector(`.keybind-btn.waiting`);
                    if (btn) {
                        btn.classList.remove('waiting');
                        this.controls[this.waitingForRebind] = [bindValue];
                        this.updateControlsUI();
                        this.updateLobbyAbilityButtons();
                        localStorage.setItem('crazy-tag-controls', JSON.stringify(this.controls));
                        this.waitingForRebind = null;
                    }
                }
            }
        }, true);

        this.updateControlsUI();
        this.updateLobbyAbilityButtons();

        // Mobile touch Virtual Joystick and Buttons Event Handling
        const joystickZone = document.getElementById('virtual-joystick-zone');
        const joystickBase = document.getElementById('virtual-joystick-base');
        const joystickKnob = document.getElementById('virtual-joystick-knob');
        let touchId = null;
        let startX = 0;
        let startY = 0;

        joystickZone.addEventListener('touchstart', (e) => {
            if (touchId !== null) return;
            const touch = e.changedTouches[0];
            touchId = touch.identifier;
            
            const rect = joystickZone.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;
            
            joystickBase.style.left = touchX + 'px';
            joystickBase.style.top = touchY + 'px';
            
            startX = touch.clientX;
            startY = touch.clientY;
            
            this.mobileJoystickX = 0;
            this.mobileJoystickY = 0;
        });

        joystickZone.addEventListener('touchmove', (e) => {
            if (touchId === null) return;
            let touch = null;
            for (let t of e.touches) {
                if (t.identifier === touchId) {
                    touch = t;
                    break;
                }
            }
            if (!touch) return;

            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            const dist = Math.hypot(dx, dy);
            const maxRadius = 40;
            const angle = Math.atan2(dy, dx);
            const finalDist = Math.min(dist, maxRadius);

            const knobX = Math.cos(angle) * finalDist;
            const knobY = Math.sin(angle) * finalDist;

            joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
            this.mobileJoystickX = knobX / maxRadius;
            this.mobileJoystickY = knobY / maxRadius;
        });

        const resetJoystick = (e) => {
            for (let t of e.changedTouches) {
                if (t.identifier === touchId) {
                    touchId = null;
                    joystickBase.style.left = '80px';
                    joystickBase.style.top = 'calc(100% - 80px)';
                    joystickKnob.style.transform = 'translate(-50%, -50%)';
                    this.mobileJoystickX = 0;
                    this.mobileJoystickY = 0;
                    break;
                }
            }
        };
        joystickZone.addEventListener('touchend', resetJoystick);
        joystickZone.addEventListener('touchcancel', resetJoystick);

        document.getElementById('mobile-btn-f1').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.triggerAbility(0);
        });
        document.getElementById('mobile-btn-f2').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.triggerAbility(1);
        });
        document.getElementById('mobile-btn-f3').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.triggerAbility(2);
        });
        document.getElementById('mobile-btn-jump').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.jumpPressed = true;
        });
        document.getElementById('mobile-btn-jump').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.jumpPressed = false;
        });

        // Generalized mouse inputs handler for gameplay controls (Left/Right/Up/Down/Jump/Slot1/Slot2)
        const handleMouseInput = (e, isDown) => {
            if (!this.isPlaying) return;
            if (this.waitingForRebind) return;

            let mouseKey = null;
            if (e.button === 0) mouseKey = 'click_left';
            else if (e.button === 2) mouseKey = 'click_right';

            if (!mouseKey) return;

            let matched = false;

            if (this.controls.left.includes(mouseKey)) {
                this.keys['ArrowLeft'] = isDown;
                matched = true;
            }
            if (this.controls.right.includes(mouseKey)) {
                this.keys['ArrowRight'] = isDown;
                matched = true;
            }
            if (this.controls.up.includes(mouseKey)) {
                this.keys['ArrowUp'] = isDown;
                matched = true;
            }
            if (this.controls.down.includes(mouseKey)) {
                this.keys['ArrowDown'] = isDown;
                matched = true;
            }
            if (this.controls.jump.includes(mouseKey)) {
                if (isDown) {
                    if (!this.keys['Spacebar']) {
                        this.jumpPressed = true;
                    }
                    this.keys['Spacebar'] = true;
                } else {
                    this.keys['Spacebar'] = false;
                    this.jumpPressed = false;
                }
                matched = true;
            }

            if (isDown) {
                if (this.controls.slot1.includes(mouseKey)) {
                    this.triggerAbility(0);
                    matched = true;
                }
                if (this.controls.slot2.includes(mouseKey)) {
                    this.triggerAbility(1);
                    matched = true;
                }
                if (this.controls.slot3.includes(mouseKey) && this.localPlayer.passiveAbility === 'third_slot') {
                    this.triggerAbility(2);
                    matched = true;
                }
            }

            if (matched) {
                e.preventDefault();
            }
        };

        this.canvas.addEventListener('mousedown', (e) => handleMouseInput(e, true));
        window.addEventListener('mouseup', (e) => handleMouseInput(e, false));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Keyboard bindings listener
        window.addEventListener('keydown', (e) => {
            const isTyping = (e.target.tagName === 'INPUT' && ['text', 'password', 'email', 'search', 'url', 'number', 'tel'].includes(e.target.type)) || 
                             e.target.tagName === 'TEXTAREA';
            if (isTyping) {
                return;
            }

            const keyLower = e.key.toLowerCase();

            // Rebind controls callback hook
            if (this.waitingForRebind) {
                e.preventDefault();
                const btn = document.querySelector(`.keybind-btn.waiting`);
                if (btn) {
                    btn.classList.remove('waiting');
                    this.controls[this.waitingForRebind] = [keyLower];
                    this.updateControlsUI();
                    this.updateLobbyAbilityButtons();
                    localStorage.setItem('crazy-tag-controls', JSON.stringify(this.controls));
                    this.waitingForRebind = null;
                }
                return;
            }

            if (this.isPlaying) {
                if (this.isFrozen) {
                    e.preventDefault();
                    return;
                }
                let matched = false;

                if (this.controls.left.includes(keyLower)) {
                    this.keys['ArrowLeft'] = true;
                    matched = true;
                }
                if (this.controls.right.includes(keyLower)) {
                    this.keys['ArrowRight'] = true;
                    matched = true;
                }
                if (this.controls.up.includes(keyLower)) {
                    this.keys['ArrowUp'] = true;
                    matched = true;
                }
                if (this.controls.down.includes(keyLower)) {
                    this.keys['ArrowDown'] = true;
                    matched = true;
                }
                if (this.controls.jump.includes(keyLower)) {
                    if (!this.keys['Spacebar']) {
                        this.jumpPressed = true;
                    }
                    this.keys['Spacebar'] = true;
                    matched = true;
                }

                if (this.controls.slot1.includes(keyLower)) {
                    e.preventDefault();
                    this.triggerAbility(0);
                    matched = true;
                }
                if (this.controls.slot2.includes(keyLower)) {
                    e.preventDefault();
                    this.triggerAbility(1);
                    matched = true;
                }
                if (this.controls.slot3.includes(keyLower) && this.localPlayer.passiveAbility === 'third_slot') {
                    e.preventDefault();
                    this.triggerAbility(2);
                    matched = true;
                }

                if (matched) {
                    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'f1', 'f2'].includes(keyLower)) {
                        e.preventDefault();
                    }
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            const isTyping = (e.target.tagName === 'INPUT' && ['text', 'password', 'email', 'search', 'url', 'number', 'tel'].includes(e.target.type)) || 
                             e.target.tagName === 'TEXTAREA';
            if (isTyping) {
                return;
            }

            if (this.isPlaying) {
                if (this.isFrozen) {
                    this.keys['ArrowLeft'] = false;
                    this.keys['ArrowRight'] = false;
                    this.keys['ArrowUp'] = false;
                    this.keys['ArrowDown'] = false;
                    this.keys['Spacebar'] = false;
                    this.jumpPressed = false;
                    return;
                }
                const keyLower = e.key.toLowerCase();
                if (this.controls.left.includes(keyLower)) this.keys['ArrowLeft'] = false;
                if (this.controls.right.includes(keyLower)) this.keys['ArrowRight'] = false;
                if (this.controls.up.includes(keyLower)) this.keys['ArrowUp'] = false;
                if (this.controls.down.includes(keyLower)) this.keys['ArrowDown'] = false;
                if (this.controls.jump.includes(keyLower)) {
                    this.keys['Spacebar'] = false;
                    this.jumpPressed = false;
                }
            }
        });

        // Bind multiplayer callbacks
        multiplayer.on('onLobbyUpdate', (players, mode, map, rounds, duration, interval) => this.onLobbyUpdated(players, mode, map, rounds, duration, interval));
        multiplayer.on('onGameStart', (settings) => this.onGameStarted(settings));
        multiplayer.on('onPlayerSync', (id, state) => this.onPlayerSync(id, state));
        multiplayer.on('onGameEvent', (ev) => this.onGameEvent(ev));
        multiplayer.on('onChatMsg', (name, col, text) => this.onChatReceived(name, col, text));
        multiplayer.on('onReaction', (id, emo) => this.onReactionReceived(id, emo));
        multiplayer.on('onHostMigrated', (newHostId) => this.onHostMigrated(newHostId));
        multiplayer.on('onReturnToLobby', () => {
            this.isPlaying = false;
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
                this.gameTimer = null;
            }
            if (!multiplayer.isHost) {
                multiplayer.startLobbyPing();
            }
            this.showScreen('screen-lobby');
            this.updateLobbyReadyState();
            this.updateLobbyControls();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(scr => {
            scr.classList.remove('active');
            scr.style.display = 'none';
        });
        const target = document.getElementById(screenId);
        target.style.display = 'flex';
        setTimeout(() => target.classList.add('active'), 20);
        this.activeScreen = screenId;

        if (screenId === 'screen-game') {
            this.isPlaying = true;
            this.setupGameLoop();
            if (this.mobileMode) {
                document.getElementById('mobile-controls-overlay').classList.remove('hidden');
            }
        } else {
            this.isPlaying = false;
            document.getElementById('mobile-controls-overlay').classList.add('hidden');
        }
    }

    toggleMobileMode(enabled) {
        this.mobileMode = enabled;
        const overlay = document.getElementById('mobile-controls-overlay');
        if (enabled && this.isPlaying) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    toggleFullscreen(enable) {
        const container = document.getElementById('app-container');
        if (enable) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    getKeyDisplayName(key) {
        if (!key) return '...';
        if (key === ' ') return 'Space';
        if (key === 'arrowleft') return '←';
        if (key === 'arrowright') return '→';
        if (key === 'arrowup') return '↑';
        if (key === 'arrowdown') return '↓';
        if (key === 'click_left') return 'Maus 1 (Links)';
        if (key === 'click_right') return 'Maus 2 (Rechts)';
        return key.toUpperCase();
    }

    getShortKeyDisplayName(key) {
        if (!key) return '?';
        if (key === 'click_left') return 'M1';
        if (key === 'click_right') return 'M2';
        if (key === ' ') return 'SPC';
        if (key === 'arrowleft') return '←';
        if (key === 'arrowright') return '→';
        if (key === 'arrowup') return '↑';
        if (key === 'arrowdown') return '↓';
        return key.toUpperCase();
    }

    updateControlsUI() {
        document.querySelectorAll('.keybind-btn').forEach(btn => {
            const action = btn.dataset.action;
            const keys = this.controls[action];
            if (keys && keys.length > 0) {
                btn.textContent = this.getKeyDisplayName(keys[0]);
            }
        });

        // Also update help card instruction texts
        const slot1Key = this.controls.slot1?.[0];
        const slot2Key = this.controls.slot2?.[0];
        const helpSlot1 = document.getElementById('help-slot1-key');
        const helpSlot2 = document.getElementById('help-slot2-key');
        if (helpSlot1) helpSlot1.textContent = this.getKeyDisplayName(slot1Key);
        if (helpSlot2) helpSlot2.textContent = this.getKeyDisplayName(slot2Key);
    }

    updateLobbyAbilityButtons() {
        const maxSlots = this.localPlayer.passiveAbility === 'third_slot' ? 3 : 2;
        const lobbySlot3 = document.getElementById('ability-slot-btn-3');
        const testSlot3 = document.getElementById('test-slot-3-btn');
        if (maxSlots === 3) {
            if (lobbySlot3 && !this.isPlaying && !this.inTestRoom) lobbySlot3.style.display = 'flex';
            if (testSlot3 && this.inTestRoom) testSlot3.style.display = 'block';
        } else {
            if (lobbySlot3) lobbySlot3.style.display = 'none';
            if (testSlot3) testSlot3.style.display = 'none';
        }

        const updateSlot = (slotIdx, btnId) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            const key = this.localPlayer.abilities[slotIdx];
            const keyName = this.getShortKeyDisplayName(this.controls[slotIdx === 0 ? 'slot1' : (slotIdx === 1 ? 'slot2' : 'slot3')][0]);
            if (key && ABILITIES_REGISTRY[key]) {
                const abil = ABILITIES_REGISTRY[key];
                btn.className = "ability-slot-btn configured";
                btn.innerHTML = `
                    <span class="slot-key">${keyName}</span>
                    <div class="slot-content">
                        <i class="fa-solid ${abil.icon}"></i>
                        <span>${this.getAbilityNameWithQueued(key)}</span>
                    </div>
                `;
            } else {
                btn.className = "ability-slot-btn empty";
                btn.innerHTML = `
                    <span class="slot-key">${keyName}</span>
                    <div class="slot-content">
                        <i class="fa-solid fa-plus"></i>
                        <span>Slot ${keyName} wählen</span>
                    </div>
                `;
            }
        };
        updateSlot(0, 'ability-slot-btn-1');
        updateSlot(1, 'ability-slot-btn-2');
        if (maxSlots === 3) {
            updateSlot(2, 'ability-slot-btn-3');
        }
        updateSlot(0, 'test-slot-1-btn');
        updateSlot(1, 'test-slot-2-btn');
        if (maxSlots === 3) {
            updateSlot(2, 'test-slot-3-btn');
        }
    }

    openAbilityPicker(slotIdx, context) {
        this.modalTargetSlot = slotIdx;
        this.modalContext = context;
        const slotKey = slotIdx === 0 ? 'Q' : (slotIdx === 1 ? 'E' : 'R');
        document.getElementById('modal-slot-num').textContent = slotKey;

        document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });

        this.renderModalAbilities('all');
        document.getElementById('ability-picker-modal').classList.remove('hidden');
    }

    renderModalAbilities(category = 'all') {
        const grid = document.getElementById('modal-abilities-grid');
        grid.innerHTML = '';

        for (let key in ABILITIES_REGISTRY) {
            const abil = ABILITIES_REGISTRY[key];

            const categoriesMap = {
                teleport: 'mobility',
                moveplus: 'mobility',
                dash: 'mobility',
                gravity: 'mobility',
                invis: 'deception',
                decoy: 'deception',
                blindness: 'sabotage',
                phase: 'mobility',
                knockback: 'defense',
                gluetrap: 'sabotage',
                timestop: 'special',
                swap: 'special',
                wallplace: 'defense',
                disguise: 'deception',
                shrink: 'special',
                webtrap: 'sabotage',
                invertkeys: 'sabotage',
                mindcontrol: 'sabotage',
                clonetrio: 'deception',
                blastshot: 'defense',
                shield: 'defense',
                random: 'special'
            };

            if (category !== 'all' && categoriesMap[key] !== category) {
                continue;
            }

            const div = document.createElement('div');
            div.className = 'ability-card';

            let isEquippedInOther = false;
            for (let i = 0; i < this.localPlayer.abilities.length; i++) {
                if (i !== this.modalTargetSlot && this.localPlayer.abilities[i] === key) {
                    isEquippedInOther = true;
                    break;
                }
            }
            if (isEquippedInOther) {
                div.classList.add('already-selected');
            }

            const cooldownSec = abil.cooldown / 1000;
            div.innerHTML = `
                <div class="ability-card-icon"><i class="fa-solid ${abil.icon}"></i></div>
                <div class="ability-card-details">
                    <span class="ability-card-name">${abil.name}</span>
                    <span class="ability-card-desc">${abil.desc}</span>
                </div>
                <div class="ability-card-cooldown">${cooldownSec}s CD</div>
            `;

            if (!isEquippedInOther) {
                div.addEventListener('click', () => {
                    this.localPlayer.abilities[this.modalTargetSlot] = key;
                    this.updateLobbyAbilityButtons();
                    document.getElementById('ability-picker-modal').classList.add('hidden');

                    if (this.modalContext === 'lobby') {
                        multiplayer.updateMyAbilities(this.localPlayer.abilities);
                        this.updateLobbyReadyState();
                    } else if (this.modalContext === 'testroom') {
                        this.updateHUDAbilities();
                    }
                });
            }

            grid.appendChild(div);
        }
    }

    updateLobbyReadyState() {
        // Explicit ready buttons are used now; we don't automatically ready clients up.
    }

    updateLobbyControls() {
        const isHost = multiplayer.isHost;

        document.querySelectorAll('#lobby-game-mode-group .toggle-item').forEach(btn => btn.style.pointerEvents = isHost ? 'auto' : 'none');
        document.querySelectorAll('#lobby-map-cards .map-card').forEach(btn => btn.style.pointerEvents = isHost ? 'auto' : 'none');
        document.getElementById('lobby-rounds-slider').disabled = !isHost;
        document.querySelectorAll('#lobby-duration-group .toggle-item').forEach(btn => btn.style.pointerEvents = isHost ? 'auto' : 'none');
        document.querySelectorAll('#lobby-random-interval-group .toggle-item').forEach(btn => btn.style.pointerEvents = isHost ? 'auto' : 'none');

        this.updateStartGameButton();
    }

    updateLobbyQRCode(code) {
        const qrImg = document.getElementById('lobby-qr-image');
        if (qrImg) {
            const joinUrl = window.location.origin + window.location.pathname + "?room=" + code;
            qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(joinUrl);
            qrImg.style.display = 'block';
        }
    }

    updateStartGameButton() {
        const startBtn = document.getElementById('start-game-btn');
        const readyBtn = document.getElementById('ready-btn');
        
        if (multiplayer.isHost) {
            if (startBtn) startBtn.style.display = 'block';
            if (readyBtn) readyBtn.style.display = 'none';

            const players = Object.values(multiplayer.players);
            const playerKeys = Object.keys(multiplayer.players);

            const correctCount = playerKeys.length >= 2;
            const allReady = players.every(p => p.isHost || p.isReady);

            if (startBtn) startBtn.disabled = !(correctCount && allReady);
        } else {
            if (startBtn) startBtn.style.display = 'none';
            if (readyBtn) readyBtn.style.display = 'block';
        }
    }

    onLobbyUpdated(players, mode, map, rounds, duration, interval) {
        if (players[multiplayer.myId]) {
            this.localPlayer.color = players[multiplayer.myId].color;
            document.getElementById('avatar-preview').style.backgroundColor = this.localPlayer.color;
        }

        // Clean up remote players who left the room (prevent ghost characters)
        for (let pid in this.remotePlayers) {
            if (!players[pid]) {
                delete this.remotePlayers[pid];
            }
        }

        // Host settings sync to clients
        if (!multiplayer.isHost) {
            if (mode && mode !== this.gameMode) {
                this.gameMode = mode;
                document.querySelectorAll('#lobby-game-mode-group .toggle-item').forEach(b => {
                    b.classList.toggle('active', b.dataset.value === mode);
                });

                const selectRow = document.getElementById('classic-map-select-row');
                const intervalRow = document.getElementById('random-interval-row');
                const abilsBox = document.getElementById('lobby-abilities-box');
                if (mode === 'random') {
                    selectRow.style.display = 'none';
                    intervalRow.style.display = 'flex';
                    abilsBox.style.display = 'none';
                } else {
                    selectRow.style.display = 'flex';
                    intervalRow.style.display = 'none';
                    abilsBox.style.display = 'flex';
                }
                this.updateLobbyReadyState();
            }
            if (map && map !== this.currentMapKey) {
                this.currentMapKey = map;
                document.querySelectorAll('#lobby-map-cards .map-card').forEach(c => {
                    c.classList.toggle('active', c.dataset.value === map);
                });
            }
            if (rounds !== undefined) {
                this.maxRounds = rounds;
                document.getElementById('lobby-rounds-slider').value = rounds;
                document.getElementById('lobby-rounds-value').textContent = rounds === 1 ? '1 Runde' : `${rounds} Runden`;
            }
            if (duration !== undefined) {
                this.gameDurationSec = duration;
                document.querySelectorAll('#lobby-duration-group .toggle-item').forEach(b => {
                    b.classList.toggle('active', parseInt(b.dataset.value) === duration);
                });
            }
            if (interval !== undefined) {
                this.randomSwitchInterval = interval;
                document.querySelectorAll('#lobby-random-interval-group .toggle-item').forEach(b => {
                    b.classList.toggle('active', parseInt(b.dataset.value) === interval);
                });
            }
        }

        this.updateLobbyControls();
        document.getElementById('lobby-player-count').textContent = Object.keys(players).length;

        const grid = document.getElementById('lobby-players-grid');
        grid.innerHTML = '';

        const getPassiveName = (key) => {
            switch (key) {
                case 'seeker_speed': return 'Jäger-Tempo';
                case 'less_cooldown': return 'Abklingzeit-Reduktion';
                case 'resilience': return 'Zähigkeit';
                case 'third_slot': return 'Dritter Slot';
                case 'speciality_plus': return 'Spezialität Plus';
                default: return 'Passive wählen...';
            }
        };

        for (let pid in players) {
            const p = players[pid];
            const card = document.createElement('div');
            card.className = `player-card ${p.isHost ? 'is-host' : ''} ${p.isReady ? 'ready' : ''}`;

            const isMe = (pid === multiplayer.myId);
            const abilityText = p.abilities.map(k => ABILITIES_REGISTRY[k]?.name || k).join(', ') || 'Auswahl...';
            const displayAbilitiesText = isMe ? (this.gameMode === 'classic' ? abilityText : 'Fähigkeiten zufällig') : (this.gameMode === 'classic' ? 'Fähigkeiten verdeckt' : 'Fähigkeiten zufällig');

            let passiveBtnHtml = '';
            if (isMe) {
                const passiveName = getPassiveName(this.localPlayer.passiveAbility);
                passiveBtnHtml = `
                    <button class="lobby-passive-btn">
                        <i class="fa-solid fa-cog"></i> ${passiveName}
                    </button>
                `;
            }

            card.innerHTML = `
                <div class="player-avatar-box ${isMe ? 'clickable-avatar' : ''}" style="background-color: ${p.color}">
                    <div class="player-eyes">
                        <div class="eye left"></div>
                        <div class="eye right"></div>
                    </div>
                </div>
                <div class="player-name-wrapper" style="display: flex; align-items: center; justify-content: center; gap: 5px; margin-top: 8px;">
                    <div class="player-name" style="margin: 0; font-size: 0.95rem; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${p.name} ${isMe ? '(Du)' : ''}</div>
                    ${isMe ? '<i class="fa-solid fa-pen name-edit-pen" style="font-size: 0.75rem; opacity: 0.6; cursor: pointer; transition: opacity 0.2s;" title="Namen ändern"></i>' : ''}
                </div>
                <div class="status-indicator">${p.isHost ? 'Host' : (p.isReady ? 'Bereit' : 'Wählt...')}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 3px; max-width: 100%; overflow: hidden; text-overflow: ellipsis;">
                    ${displayAbilitiesText}
                </div>
                ${passiveBtnHtml}
            `;
            grid.appendChild(card);

            if (isMe) {
                // Avatar click opens passive picker
                const avatarBox = card.querySelector('.player-avatar-box');
                if (avatarBox) {
                    avatarBox.addEventListener('click', () => {
                        this.openPassivePicker();
                    });
                }
                
                // Passive button click opens passive picker
                const passiveBtn = card.querySelector('.lobby-passive-btn');
                if (passiveBtn) {
                    passiveBtn.addEventListener('click', () => {
                        this.openPassivePicker();
                    });
                }

                // Name edit pen click
                const pen = card.querySelector('.name-edit-pen');
                if (pen) {
                    pen.addEventListener('mouseenter', () => pen.style.opacity = '1');
                    pen.addEventListener('mouseleave', () => pen.style.opacity = '0.6');
                    pen.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const currentName = this.localPlayer.name;
                        const newName = prompt("Neuen Spielernamen eingeben (max. 12 Zeichen):", currentName);
                        if (newName !== null) {
                            const trimmed = newName.trim();
                            if (trimmed !== "") {
                                const finalName = trimmed.substring(0, 12);
                                this.localPlayer.name = finalName;
                                localStorage.setItem('crazy-tag-player-name', finalName);
                                multiplayer.updateMyName(finalName);
                                const inputField = document.getElementById('player-name-input');
                                if (inputField) inputField.value = finalName;
                            }
                        }
                    });
                }
            }
        }

        this.updateStartGameButton();
    }

    onChatReceived(name, color, text) {
        const log = document.getElementById('lobby-chat-log');
        const div = document.createElement('div');
        div.className = 'chat-msg';
        div.innerHTML = `<span class="author" style="color: ${color}">${name}:</span> ${text}`;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    }

    onReactionReceived(senderId, emoji) {
        // Spawn floating emoji in-game or log in chat
        if (this.isPlaying) {
            this.spawnFloatingEmoji(senderId, emoji);
        }
    }

    onHostMigrated(newHostId) {
        this.updateLobbyControls();
        const rematchBtn = document.getElementById('rematch-btn');
        if (newHostId === multiplayer.myId) {
            rematchBtn.removeAttribute('disabled');
        } else {
            rematchBtn.setAttribute('disabled', 'true');
        }
    }

    // --- Lobby game start callback ---
    onGameStarted(settings) {
        // Keep lobby ping running during game to prevent timeouts during round transitions
        // multiplayer.stopLobbyPing();
        this.gameMode = settings.mode;
        this.currentMapKey = settings.map;
        this.inTestRoom = false; // Turn off test room if we start a game
        this.bot = null;        // Clear NPC bot from test room
        // Always hide the test room floating panel in a real game
        document.getElementById('test-room-panel').classList.add('hidden');

        // Sync round and scores
        this.maxRounds = settings.maxRounds !== undefined ? settings.maxRounds : 1;
        this.gameDurationSec = settings.duration || 90;
        this.randomSwitchInterval = settings.interval || 15;

        this.currentRound = settings.round || 1;
        this.playerScores = settings.scores || {};
        for (let pid in multiplayer.players) {
            if (this.playerScores[pid] === undefined) {
                this.playerScores[pid] = 0;
            }
        }

        // Reset local player states
        this.localPlayer.vx = 0;
        this.localPlayer.vy = 0;
        this.localPlayer.cooldowns = [0, 0, 0];
        this.localPlayer.activeAbilities.invis = 0;
        this.localPlayer.activeAbilities.phase = 0;
        this.localPlayer.activeAbilities.shield = 0;
        this.localPlayer.gravityDirection = 1;
        this.localPlayer.isDead = false;
        this.localPlayer.blindnessTimer = 0;
        this.localPlayer.keysInvertedTimer = 0;
        this.localPlayer.isMindControlled = false;
        this.localPlayer.mindControlTimer = 0;
        this.isMindControlling = false;
        this.mindControlTargetId = null;
        this.mindControlTimer = 0;
        this.controlledKeys = null;
        this.localPlayer.speedBuffTimer = 0;
        
        // Clean game arrays
        this.fireballs = [];
        this.icicles = [];
        this.glueTraps = [];
        this.webTraps = [];
        this.defenseProjectiles = [];
        this.particles = [];
        this.floatingEmojis = [];
        this.decoys = [];
        this.timeStoppedBy = null;
        this.timeStopDuration = 0;
        this.mapItems = [];
        this.spawnedIntervals = [false, false, false];
        this.roundItemsOrder = ['speed2x', 'cooldown_reset', 'swap'].sort(() => 0.5 - Math.random());

        // Position placements randomly on solid tiles
        this.setMap(settings.map);
        this.respawnPlayer(this.localPlayer);

        // Build game UI
        document.getElementById('hud-mode').textContent = `${this.gameMode === 'classic' ? 'Klassisch' : 'Zufällig'} (Runde ${this.currentRound}/${this.maxRounds})`;
        document.getElementById('hud-map').textContent = this.currentMap.name;

        // Random mode setup
        if (this.gameMode === 'random') {
            this.randomSwitchTimer = this.randomSwitchInterval; // Use custom switch interval
            this.rollRandomAbilities();
        }

        const isReconnect = settings.gameDuration !== undefined && settings.gameDuration < this.gameDurationSec;

        // Initialize remote players representation
        this.remotePlayers = {};
        for (let pid in multiplayer.players) {
            if (pid !== multiplayer.myId) {
                const p = multiplayer.players[pid];
                this.remotePlayers[pid] = {
                    id: pid,
                    x: 100,
                    y: 100,
                    renderX: 100,
                    renderY: 100,
                    vx: 0,
                    vy: 0,
                    width: 22,
                    height: 30,
                    facing: 1,
                    isSeeker: false,
                    isDead: false,
                    color: p.color,
                    name: p.name,
                    activeAbils: { invis: 0, phase: 0, dash: 0, disguise: 0, shrink: 0, gravity: 0, shield: 0 },
                    inputs: { left: false, right: false, down: false, jump: false }
                };
            }
        }

        // Configure HUD Ability items
        this.updateHUDAbilities();

        if (isReconnect) {
            this.isFrozen = false;
            this.gameDuration = settings.gameDuration;
            const minInit = Math.floor(this.gameDuration / 60);
            const secInit = this.gameDuration % 60;
            document.getElementById('hud-timer').textContent = `${minInit}:${secInit < 10 ? '0' : ''}${secInit}`;
            
            if (settings.seekerId) {
                this.setSeeker(settings.seekerId);
            }
            
            const startTimer = () => {
                if (this.gameTimer) clearInterval(this.gameTimer);
                this.gameTimer = setInterval(() => {
                    if (this.isPlaying && !this.timeStoppedBy) {
                        this.gameDuration--;
                        if (this.gameDuration <= 0) {
                            this.endRound();
                        } else {
                            const m = Math.floor(this.gameDuration / 60);
                            const s = this.gameDuration % 60;
                            document.getElementById('hud-timer').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
                            
                            if (this.gameDuration <= 10) {
                                this.triggerAlertBanner(this.gameDuration.toString(), 900, null);
                                sound.playAlert();
                            }
                        }

                        // Host spawns items
                        if (multiplayer.isHost) {
                            this.checkItemSpawning();
                        }

                        // Host fires volcano hazards & icicles
                        if (multiplayer.isHost && this.currentMapKey === 'volcano' && Math.random() < 0.25) {
                            multiplayer.sendGameEvent({
                                type: 'spawn_fireball',
                                x: Math.random() * this.canvas.width
                            });
                        }
                        if (multiplayer.isHost && this.currentMapKey === 'ice' && Math.random() < 0.2) {
                            multiplayer.sendGameEvent({
                                type: 'spawn_icicle',
                                x: Math.random() * this.canvas.width
                            });
                        }

                        // Random Mode ticks
                        if (this.gameMode === 'random') {
                            this.randomSwitchTimer--;
                            if (this.randomSwitchTimer <= 0) {
                                this.randomSwitchTimer = this.randomSwitchInterval;
                                if (multiplayer.isHost) {
                                    this.triggerRandomSwitch();
                                }
                            }
                        }
                    }
                }, 1000);
            };
            startTimer();
        } else {
            this.isFrozen = true;
            
            // Host assigns first seeker
            if (multiplayer.isHost) {
                const playerIds = Object.keys(multiplayer.players);
                const randomSeeker = playerIds[Math.floor(Math.random() * playerIds.length)];
                multiplayer.sendGameEvent({
                    type: 'initial_seeker',
                    seekerId: randomSeeker
                });
            }

            // Start countdown animation
            this.triggerAlertBanner("3", 1000, () => {
                sound.playAlert();
                this.triggerAlertBanner("2", 1000, () => {
                    sound.playAlert();
                    this.triggerAlertBanner("1", 1000, () => {
                        sound.playAlert();
                        this.triggerAlertBanner("LOS!", 1000, null);
                        sound.playWin();
                        this.isFrozen = false;
                        
                        // Setup match timer
                        this.gameDuration = this.gameDurationSec;
                        const minInit = Math.floor(this.gameDuration / 60);
                        const secInit = this.gameDuration % 60;
                        document.getElementById('hud-timer').textContent = `${minInit}:${secInit < 10 ? '0' : ''}${secInit}`;
                        
                        if (this.gameTimer) clearInterval(this.gameTimer);
                        this.gameTimer = setInterval(() => {
                            if (this.isPlaying && !this.timeStoppedBy) {
                                this.gameDuration--;
                                if (this.gameDuration <= 0) {
                                    this.endRound();
                                } else {
                                    const m = Math.floor(this.gameDuration / 60);
                                    const s = this.gameDuration % 60;
                                    document.getElementById('hud-timer').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
                                    
                                    if (this.gameDuration <= 10) {
                                        this.triggerAlertBanner(this.gameDuration.toString(), 900, null);
                                        sound.playAlert();
                                    }
                                }

                                // Host spawns items
                                if (multiplayer.isHost) {
                                    this.checkItemSpawning();
                                }

                                // Host fires volcano hazards & icicles
                                if (multiplayer.isHost && this.currentMapKey === 'volcano' && Math.random() < 0.25) {
                                    multiplayer.sendGameEvent({
                                        type: 'spawn_fireball',
                                        x: Math.random() * this.canvas.width
                                    });
                                }
                                if (multiplayer.isHost && this.currentMapKey === 'ice' && Math.random() < 0.2) {
                                    multiplayer.sendGameEvent({
                                        type: 'spawn_icicle',
                                        x: Math.random() * this.canvas.width
                                    });
                                }

                                // Random Mode ticks
                                if (this.gameMode === 'random') {
                                    this.randomSwitchTimer--;
                                    if (this.randomSwitchTimer <= 0) {
                                        this.randomSwitchTimer = this.randomSwitchInterval;
                                        if (multiplayer.isHost) {
                                            this.triggerRandomSwitch();
                                        }
                                    }
                                }
                            }
                        }, 1000);
                    });
                });
            });
        }

        this.showScreen('screen-game');
    }

    triggerAlertBanner(text, ms, callback) {
        const banner = document.getElementById('game-alert-banner');
        const content = document.getElementById('game-alert-content');
        
        content.textContent = text;
        banner.classList.remove('hidden');
        
        setTimeout(() => {
            banner.classList.add('hidden');
            if (callback) callback();
        }, ms);
    }

    updateHUDAbilities() {
        const abils = this.localPlayer.abilities;
        const maxSlots = this.localPlayer.passiveAbility === 'third_slot' ? 3 : 2;
        
        // Show/hide Slot 3 elements
        const hudAbil3 = document.getElementById('hud-ability-3');
        const mobBtnF3 = document.getElementById('mobile-btn-f3');
        const testSlot3 = document.getElementById('test-slot-3-btn');
        const lobbySlot3 = document.getElementById('ability-slot-btn-3');
        const bindSlot3Setting = document.getElementById('settings-bind-slot3');
        
        if (maxSlots === 3) {
            if (hudAbil3 && this.isPlaying) hudAbil3.style.display = 'flex';
            if (mobBtnF3 && this.isPlaying && this.mobileMode) mobBtnF3.style.display = 'block';
            if (testSlot3 && this.inTestRoom) testSlot3.style.display = 'block';
            if (lobbySlot3 && !this.isPlaying && !this.inTestRoom) lobbySlot3.style.display = 'flex';
            if (bindSlot3Setting) bindSlot3Setting.style.display = 'flex';
        } else {
            if (hudAbil3) hudAbil3.style.display = 'none';
            if (mobBtnF3) mobBtnF3.style.display = 'none';
            if (testSlot3) testSlot3.style.display = 'none';
            if (lobbySlot3) lobbySlot3.style.display = 'none';
            if (bindSlot3Setting) bindSlot3Setting.style.display = 'none';
            
            // Clean up third slot ability if passive changed
            if (this.localPlayer.abilities.length > 2) {
                this.localPlayer.abilities = this.localPlayer.abilities.slice(0, 2);
            }
        }

        for (let i = 0; i < maxSlots; i++) {
            const widget = document.getElementById(`hud-ability-${i+1}`);
            if (!widget) continue;
            
            const abKey = abils[i];
            
            // Dynamically update bound key badge text
            const bindingKey = this.controls[`slot${i+1}`]?.[0];
            const keyBadge = widget.querySelector('.ability-key');
            if (keyBadge) {
                keyBadge.textContent = this.getShortKeyDisplayName(bindingKey);
            }

            const mobBtn = document.getElementById(`mobile-btn-f${i+1}`);
            let mobIcon = '';

            if (abKey && ABILITIES_REGISTRY[abKey]) {
                const spec = ABILITIES_REGISTRY[abKey];
                widget.querySelector('.ability-icon').innerHTML = `<i class="fa-solid ${spec.icon}"></i>`;
                widget.querySelector('.ability-name').textContent = this.getAbilityNameWithQueued(abKey);
                
                // Set the cooldown fill properly
                let cdPercent = 0;
                if (this.localPlayer.cooldowns[i] > 0 && spec.cooldown > 0) {
                    cdPercent = (this.localPlayer.cooldowns[i] / (this.getAdjustedCooldown(abKey) / 1000)) * 100;
                }
                widget.querySelector('.cooldown-fill').style.width = `${cdPercent}%`;
                mobIcon = `<i class="fa-solid ${spec.icon}"></i>`;
            } else {
                widget.querySelector('.ability-icon').innerHTML = `<i class="fa-solid fa-question"></i>`;
                widget.querySelector('.ability-name').textContent = "Keine";
                widget.querySelector('.cooldown-fill').style.width = '0%';
                mobIcon = `<i class="fa-solid fa-question"></i>`;
            }

            if (mobBtn) {
                const iconContainer = mobBtn.querySelector('.mobile-btn-icon');
                if (iconContainer) {
                    iconContainer.innerHTML = mobIcon;
                }
            }
        }
    }

    setMap(mapKey) {
        this.currentMapKey = mapKey;
        this.currentMap = MAPS[mapKey] || MAPS.classic;
    }

    respawnPlayer(player) {
        // Find solid ground platforms to put player on safely
        const solids = [];
        const grid = this.currentMap.grid;
        
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === '#' || grid[row][col] === 'I') {
                    // Check if block above is empty air
                    if (row > 0 && grid[row-1][col] === ' ') {
                        solids.push({ col: col, row: row - 1 });
                    }
                }
            }
        }

        if (solids.length > 0) {
            const pick = solids[Math.floor(Math.random() * solids.length)];
            player.x = pick.col * 32 + 5;
            player.y = pick.row * 32 + 2;
        } else {
            player.x = 100;
            player.y = 100;
        }
        player.vx = 0;
        player.vy = 0;
        player.gravityDirection = 1;
    }

    rollRandomAbilities() {
        const allKeys = Object.keys(ABILITIES_REGISTRY);
        // Shuffle helper
        const shuffled = allKeys.sort(() => 0.5 - Math.random());
        this.localPlayer.abilities = [shuffled[0], shuffled[1]];
        this.updateHUDAbilities();
    }

    triggerRandomSwitch() {
        if (!multiplayer.isHost) return;

        // Roll new map & Broadcast switch event
        const mapKeys = Object.keys(MAPS);
        const randomMap = mapKeys[Math.floor(Math.random() * mapKeys.length)];
        
        multiplayer.sendGameEvent({
            type: 'random_switch',
            map: randomMap
        });
    }

    // --- Multiplayer Event Sync Handle ---
    onPlayerSync(id, data) {
        let rp = this.remotePlayers[id];
        if (!rp) {
            const p = multiplayer.players[id];
            if (p) {
                this.remotePlayers[id] = {
                    id: id,
                    x: data.x,
                    y: data.y,
                    renderX: data.x,
                    renderY: data.y,
                    vx: data.vx,
                    vy: data.vy,
                    width: 22,
                    height: 30,
                    facing: data.facing,
                    isSeeker: false,
                    isDead: data.isDead,
                    color: p.color,
                    name: p.name,
                    activeAbils: data.activeAbils || { invis: 0, phase: 0, dash: 0, disguise: 0, shrink: 0, gravity: 0, shield: 0 },
                    inputs: data.inputs || { left: false, right: false, down: false, jump: false }
                };
                rp = this.remotePlayers[id];
            } else {
                return;
            }
        }

        const now = performance.now();

        // Snap to position on first sync or large teleport gap (e.g., Swap / Blink)
        const isFirstSync = !rp.receivedAt;
        const dx = data.x - rp.renderX;
        const dy = data.y - rp.renderY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (isFirstSync || dist > 220) {
            rp.renderX = data.x;
            rp.renderY = data.y;
            rp.x = data.x;
            rp.y = data.y;
            if (rp.packetBuffer) {
                rp.packetBuffer = []; // Clear buffer to prevent rubber-band sliding after teleports
            }
        }

        // Update authoritative state
        rp.vx = data.vx;
        rp.vy = data.vy;
        rp.facing = data.facing;
        rp.isDead = data.isDead;
        rp.receivedAt = now;
        rp.activeAbils = data.activeAbils || { invis: 0, phase: 0, dash: 0, disguise: 0, shrink: 0, gravity: 0, shield: 0 };
        rp.inputs = data.inputs || { left: false, right: false, down: false, jump: false };
        
        // Push this position packet to playback interpolation buffer
        if (!rp.packetBuffer) {
            rp.packetBuffer = [];
        }
        rp.packetBuffer.push({
            x: data.x,
            y: data.y,
            time: now
        });
        if (rp.packetBuffer.length > 30) {
            rp.packetBuffer.shift();
        }
    }

    onGameEvent(ev) {
        switch (ev.type) {
            case 'initial_seeker':
                this.setSeeker(ev.seekerId);
                this.triggerAlertBanner(`${multiplayer.players[ev.seekerId]?.name} fängt!`, 1800);
                break;

            case 'tag':
                this.setSeeker(ev.to);
                if (ev.to === multiplayer.myId || ev.from === multiplayer.myId) {
                    this.tagImmunityTimer = 1.5;
                }
                sound.playTag();
                this.triggerAlertBanner(`${multiplayer.players[ev.to]?.name} wurde gefangen!`, 1500);
                
                // Spawn splash particles at the tagged runner's position
                const p = ev.to === multiplayer.myId ? this.localPlayer : this.remotePlayers[ev.to];
                if (p) {
                    this.spawnTagBurst(p.x + p.width/2, p.y + p.height/2);
                }
                break;

            case 'random_switch':
                sound.playAlert();
                this.setMap(ev.map);
                document.getElementById('hud-map').textContent = this.currentMap.name;

                this.rollRandomAbilities();
                this.localPlayer.cooldowns = [0, 0];
                this.localPlayer.activeAbilities.invis = 0;
                this.localPlayer.activeAbilities.phase = 0;
                this.localPlayer.gravityDirection = 1;

                this.triggerAlertBanner(`Karte geändert: ${this.currentMap.name}!`, 2000);
                this.respawnPlayer(this.localPlayer);
                break;

            case 'ability_effect':
                this.handleRemoteAbilityEffect(ev);
                break;

            case 'spawn_fireball':
                this.fireballs.push({
                    x: ev.x,
                    y: this.canvas.height + 20,
                    vy: -(3 + Math.random() * 4),
                    radius: 12
                });
                break;

            case 'spawn_icicle':
                this.icicles.push({
                    x: ev.x,
                    y: -20,
                    vy: 2 + Math.random() * 3,
                    width: 10,
                    height: 25
                });
                break;

            case 'trap_placed':
                {
                    let senderTraps = this.glueTraps.filter(t => t.owner === ev.sender);
                    if (senderTraps.length >= 2) {
                        const oldest = senderTraps[0];
                        this.glueTraps = this.glueTraps.filter(t => t !== oldest);
                    }
                    this.glueTraps.push({
                        x: ev.x,
                        y: ev.y,
                        owner: ev.sender,
                        duration: ev.duration || 1.5
                    });
                }
                break;

            case 'trap_triggered':
                this.glueTraps = this.glueTraps.filter(t => Math.abs(t.x - ev.tx) > 5 || Math.abs(t.y - ev.ty) > 5);
                if (ev.victim === multiplayer.myId) {
                    this.slowPlayer(ev.duration || 1.5, 0.21);
                }
                break;

            case 'spawn_decoy':
                if (ev.sender !== multiplayer.myId) {
                    this.spawnDecoyEntity(ev.x, ev.y, ev.vx, ev.vy, ev.facing, ev.color, ev.name, ev.sender, ev.duration || 4.0, 'decoy');
                }
                break;

            case 'decoy_popped':
                this.decoys = this.decoys.filter(d => Math.abs(d.x - ev.dx) > 12 || Math.abs(d.y - ev.dy) > 12);
                this.spawnTagBurst(ev.dx + 11, ev.dy + 15);
                break;

            case 'wall_placed':
                this.temporaryWalls.push({
                    x: ev.x,
                    y: ev.y,
                    width: ev.w,
                    height: ev.h,
                    life: 4.0,
                    owner: ev.sender
                });
                break;

            case 'web_placed':
                {
                    let senderTraps = this.webTraps.filter(t => t.owner === ev.sender);
                    if (senderTraps.length >= 1) {
                        const oldest = senderTraps[0];
                        this.webTraps = this.webTraps.filter(t => t !== oldest);
                    }
                    this.webTraps.push({
                        x: ev.x,
                        y: ev.y,
                        owner: ev.sender,
                        duration: ev.duration || 0.75
                    });
                }
                break;

            case 'web_triggered':
                this.webTraps = this.webTraps.filter(t => Math.abs(t.x - ev.tx) > 5 || Math.abs(t.y - ev.ty) > 5);
                if (ev.victim === multiplayer.myId) {
                    this.rootPlayer(ev.duration || 0.75);
                }
                break;

            case 'invert_keys':
                if (ev.sender !== multiplayer.myId) {
                    const dur = this.localPlayer.passiveAbility === 'resilience' ? ev.duration * 0.5 : ev.duration;
                    this.localPlayer.keysInvertedTimer = dur;
                    this.triggerAlertBanner("Steuerung invertiert!", 1500);
                }
                break;

            case 'mind_control_start':
                if (ev.targetId === multiplayer.myId) {
                    this.localPlayer.isMindControlled = true;
                    const dur = this.localPlayer.passiveAbility === 'resilience' ? ev.duration * 0.5 : ev.duration;
                    this.localPlayer.mindControlTimer = dur;
                    this.controlledKeys = null;
                    this.triggerAlertBanner("Gedankenkontrolliert!", 2000);
                }
                break;

            case 'mind_control_input':
                if (ev.targetId === multiplayer.myId) {
                    this.controlledKeys = ev.keys;
                }
                break;

            case 'spawn_clone_trio':
                this.spawnDecoyEntity(ev.x, ev.y, -3.5, 0, -1, ev.color, ev.name, ev.sender, ev.duration || 2.0, 'trio');
                this.spawnDecoyEntity(ev.x, ev.y, 3.5, 0, 1, ev.color, ev.name, ev.sender, ev.duration || 2.0, 'trio');
                this.spawnDecoyEntity(ev.x, ev.y, 0, 0, ev.facing, ev.color, ev.name, ev.sender, ev.duration || 2.0, 'trio');
                break;

            case 'spawn_proj':
                this.defenseProjectiles.push({
                    x: ev.x,
                    y: ev.y,
                    vx: ev.vx,
                    vy: 0,
                    radius: 8,
                    owner: ev.owner,
                    force: ev.force || 22
                });
                break;

            case 'shield_knockback':
                if (ev.targetId === multiplayer.myId) {
                    this.executeShieldKnockbackOnLocal(ev.fromX, ev.fromY);
                }
                break;

            case 'spawn_item':
                this.mapItems.push({
                    id: ev.id,
                    type: ev.itemType,
                    x: ev.x,
                    y: ev.y
                });
                break;

            case 'collect_item':
                this.mapItems = this.mapItems.filter(i => i.id !== ev.id);
                this.applyItemEffect(ev.itemType, ev.collectorId);
                break;

            case 'swap_positions':
                if (ev.targetId === multiplayer.myId) {
                    sound.playDash();
                    this.localPlayer.x = ev.toX;
                    this.localPlayer.y = ev.toY;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                    this.tagImmunityTimer = 1.5;
                    this.triggerAlertBanner("Position getauscht!", 1500);
                }
                break;
        }
    }

    setSeeker(id) {
        this.seekerId = id;
        this.localPlayer.isSeeker = (id === multiplayer.myId);
        
        // Update top hud panel
        const nameNode = document.getElementById('hud-seeker-name');
        nameNode.textContent = multiplayer.players[id]?.name || "Unbekannt";

        for (let pid in this.remotePlayers) {
            this.remotePlayers[pid].isSeeker = (pid === id);
        }
    }

    // --- Ability Execution Logic ---
    triggerAbility(slotIdx) {
        if (this.isFrozen) return;
        const abKey = this.localPlayer.abilities[slotIdx];
        if (!abKey || this.localPlayer.cooldowns[slotIdx] > 0 || this.localPlayer.isDead) return;

        // Mind control checks - cannot cast if controlled or controlling
        if (this.isMindControlling || this.localPlayer.isMindControlled) return;

        // Freeze check
        if (this.localPlayer.isRooted) return;
        
        const isTimeStoppedForLocal = this.timeStoppedBy && 
                                     this.timeStoppedBy !== multiplayer.myId && 
                                     this.timeStoppedBy !== 'local_player';
        if (isTimeStoppedForLocal) return;

        const spec = ABILITIES_REGISTRY[abKey];
        let triggered = false;

        switch (abKey) {
            case 'teleport':
                triggered = this.castTeleport();
                break;
            case 'moveplus':
                triggered = this.castMovePlus();
                break;
            case 'dash':
                triggered = this.castDash();
                break;
            case 'timestop':
                triggered = this.castTimeStop();
                break;
            case 'phase':
                triggered = this.castPhase();
                break;
            case 'invis':
                triggered = this.castInvis();
                break;
            case 'knockback':
                triggered = this.castKnockback();
                break;
            case 'swap':
                triggered = this.castSwap();
                break;
            case 'gluetrap':
                triggered = this.castGlueTrap();
                break;
            case 'gravity':
                triggered = this.castGravityFlip();
                break;
            case 'decoy':
                triggered = this.castDecoy();
                break;
            case 'blindness':
                triggered = this.castBlindness();
                break;
            case 'wallplace':
                triggered = this.castWallPlace();
                break;
            case 'disguise':
                triggered = this.castDisguise();
                break;
            case 'shrink':
                triggered = this.castShrink();
                break;
            case 'webtrap':
                triggered = this.castWebTrap();
                break;
            case 'invertkeys':
                triggered = this.castInvertKeys();
                break;
            case 'mindcontrol':
                triggered = this.castMindControl();
                break;
            case 'clonetrio':
                triggered = this.castCloneTrio();
                break;
            case 'blastshot':
                triggered = this.castBlastShot();
                break;
            case 'shield':
                triggered = this.castShield();
                break;
            case 'random':
                if (this.localPlayer.queuedRandomAbility) {
                    triggered = this.castSubAbility(this.localPlayer.queuedRandomAbility);
                    if (triggered) {
                        this.rollNextRandomAbility();
                        this.updateHUDAbilities();
                    }
                }
                break;
        }

        if (triggered && spec.cooldown > 0) {
            this.localPlayer.cooldowns[slotIdx] = this.getAdjustedCooldown(abKey) / 1000;
        }
    }

    castTeleport() {
        sound.playDash();
        let dx = 0;
        let dy = 0;
        if (this.keys['ArrowLeft']) dx = -1;
        if (this.keys['ArrowRight']) dx = 1;
        if (this.keys['ArrowUp']) dy = -1;
        if (this.keys['ArrowDown']) dy = 1;

        if (this.mobileMode && (Math.abs(this.mobileJoystickX) > 0.1 || Math.abs(this.mobileJoystickY) > 0.1)) {
            dx = Math.sign(this.mobileJoystickX);
            dy = Math.sign(this.mobileJoystickY);
        }

        if (dx === 0 && dy === 0) {
            dx = this.localPlayer.facing;
        }

        const dist = 96; // 3 blocks
        const angle = Math.atan2(dy, dx);
        const targetX = this.localPlayer.x + Math.cos(angle) * dist;
        const targetY = this.localPlayer.y + Math.sin(angle) * dist;

        const minX = 32;
        const maxX = this.canvas.width - 32 - this.localPlayer.width;
        const minY = 32;
        const maxY = this.canvas.height - 32 - this.localPlayer.height;

        let finalX = Math.max(minX, Math.min(maxX, targetX));
        let finalY = Math.max(minY, Math.min(maxY, targetY));

        // If landing inside solid tile, do spiral search for nearest free position
        if (this.checkCollisionAt(finalX, finalY, this.localPlayer.width, this.localPlayer.height)) {
            let found = false;
            const steps = [
                {dx: 0, dy: -8}, {dx: 0, dy: 8}, {dx: -8, dy: 0}, {dx: 8, dy: 0},
                {dx: -8, dy: -8}, {dx: 8, dy: -8}, {dx: -8, dy: 8}, {dx: 8, dy: 8},
                {dx: 0, dy: -16}, {dx: 0, dy: 16}, {dx: -16, dy: 0}, {dx: 16, dy: 0},
                {dx: -16, dy: -16}, {dx: 16, dy: -16}, {dx: -16, dy: 8}, {dx: 16, dy: 8},
                {dx: 0, dy: -24}, {dx: 0, dy: 24}, {dx: -24, dy: 0}, {dx: 24, dy: 0},
                {dx: -32, dy: 0}, {dx: 32, dy: 0}, {dx: 0, dy: -32}, {dx: 0, dy: 32}
            ];
            for (const step of steps) {
                const testX = finalX + step.dx;
                const testY = finalY + step.dy;
                if (testX >= minX && testX <= maxX && testY >= minY && testY <= maxY) {
                    if (!this.checkCollisionAt(testX, testY, this.localPlayer.width, this.localPlayer.height)) {
                        finalX = testX;
                        finalY = testY;
                        found = true;
                        break;
                    }
                }
            }
        }

        this.spawnDashTrail(this.localPlayer.x, this.localPlayer.y, finalX, finalY);
        this.localPlayer.x = finalX;
        this.localPlayer.y = finalY;

        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'teleport',
            x1: this.localPlayer.x,
            y1: this.localPlayer.y
        });
        return true;
    }

    castMovePlus() {
        sound.playFreeze();
        this.localPlayer.activeAbilities.moveplus = 10.0; // 10 seconds duration
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'moveplus',
            duration: 10.0
        });
        return true;
    }

    castDash() {
        sound.playDash();
        let dx = 0;
        let dy = 0;
        if (this.keys['ArrowLeft']) dx = -1;
        if (this.keys['ArrowRight']) dx = 1;
        if (this.keys['ArrowUp']) dy = -1;
        if (this.keys['ArrowDown']) dy = 1;

        if (this.mobileMode && (Math.abs(this.mobileJoystickX) > 0.1 || Math.abs(this.mobileJoystickY) > 0.1)) {
            dx = this.mobileJoystickX;
            dy = this.mobileJoystickY;
        }

        if (dx === 0 && dy === 0) {
            dx = this.localPlayer.facing;
        }

        const len = Math.hypot(dx, dy);
        const ndx = dx / len;
        const ndy = dy / len;

        // Buff: 4 blocks (128px) range and 70% higher speed (544 px/s)
        this.localPlayer.dashVx = ndx * 544;
        this.localPlayer.dashVy = ndy * 544;
        this.localPlayer.activeAbilities.dash = 0.235; // 128 / 544 ≈ 0.235s duration
        this.localPlayer.dashShadowTimer = 0.5;

        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'dash',
            duration: 0.235
        });
        return true;
    }

    castTimeStop() {
        sound.playTimeStop();
        this.timeStoppedBy = 'local_player';
        this.timeStopDuration = 1.5; // Nerfed to 1.5s duration
        
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'timestop'
        });
        return true;
    }

    castPhase() {
        sound.playFreeze();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 3.6 : 3.0;
        this.localPlayer.activeAbilities.phase = duration;
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'phase',
            duration: duration
        });
        return true;
    }

    castInvis() {
        sound.playFreeze();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 4.8 : 4.0;
        this.localPlayer.activeAbilities.invis = duration;
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'invis',
            duration: duration
        });
        return true;
    }

    castKnockback() {
        sound.playTag();
        const kx = this.localPlayer.x + this.localPlayer.width / 2;
        const ky = this.localPlayer.y + this.localPlayer.height / 2;
        const forceFactor = this.localPlayer.passiveAbility === 'speciality_plus' ? 1.2 : 1.0;

        this.shockwaves.push({
            x: kx,
            y: ky,
            radius: 5,
            maxRadius: 75,
            speed: 250, // px/s
            life: 0.3,
            maxLife: 0.3
        });

        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'knockback',
            x: kx,
            y: ky,
            forceFactor: forceFactor
        });

        this.applyRadialKnockback(kx, ky, multiplayer.myId, forceFactor);
        return true;
    }

    castSwap() {
        let targets = [];
        if (this.inTestRoom) {
            if (this.botEnabled && this.bot && !this.bot.isDead) {
                targets.push({ id: 'npc_bot', obj: this.bot });
            }
        } else {
            for (let pid in this.remotePlayers) {
                const rp = this.remotePlayers[pid];
                if (!rp.isDead) {
                    targets.push({ id: pid, obj: rp });
                }
            }
        }

        if (targets.length === 0) return false; // No players to swap with

        sound.playDash();
        const pick = targets[Math.floor(Math.random() * targets.length)];
        const targetId = pick.id;
        const target = pick.obj;
        
        // Spawn swap markers
        this.spawnTagBurst(this.localPlayer.x + this.localPlayer.width/2, this.localPlayer.y + this.localPlayer.height/2);
        this.spawnTagBurst(target.x + target.width/2, target.y + target.height/2);

        // Update local pos immediately
        const oldX = this.localPlayer.x;
        const oldY = this.localPlayer.y;
        this.localPlayer.x = target.x;
        this.localPlayer.y = target.y;
        this.localPlayer.vx = 0;
        this.localPlayer.vy = 0;

        // Apply 1.5s tag immunity
        this.tagImmunityTimer = 1.5;

        if (this.inTestRoom) {
            this.bot.tagImmunityTimer = 1.5;
            this.bot.x = oldX;
            this.bot.y = oldY;
            this.bot.vx = 0;
            this.bot.vy = 0;
        } else {
            multiplayer.sendGameEvent({
                type: 'ability_effect',
                abil: 'swap',
                targetId: targetId,
                toX: oldX,
                toY: oldY
            });
        }

        return true;
    }

    castGlueTrap() {
        sound.playFreeze();
        const tx = this.localPlayer.x + this.localPlayer.width/2;
        const ty = this.localPlayer.y + this.localPlayer.height;
        
        // Stack limit of 2
        let myTraps = this.glueTraps.filter(t => t.owner === multiplayer.myId);
        if (myTraps.length >= 2) {
            const oldest = myTraps[0];
            this.glueTraps = this.glueTraps.filter(t => t !== oldest);
        }

        this.glueTraps.push({
            x: tx,
            y: ty,
            owner: multiplayer.myId
        });

        multiplayer.sendGameEvent({
            type: 'trap_placed',
            x: tx,
            y: ty,
            sender: multiplayer.myId
        });
        return true;
    }

    castGravityFlip() {
        sound.playJump();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 6.0 : 5.0;
        this.localPlayer.activeAbilities.gravity = duration;
        this.localPlayer.doubleJumpAvailable = true;
        
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'gravity',
            duration: duration
        });
        return true;
    }

    castDecoy() {
        sound.playDash();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 4.8 : 4.0;
        multiplayer.sendGameEvent({
            type: 'spawn_decoy',
            x: this.localPlayer.x,
            y: this.localPlayer.y,
            vx: this.localPlayer.facing * 3.5,
            vy: this.localPlayer.vy,
            facing: this.localPlayer.facing,
            color: this.localPlayer.color,
            name: this.localPlayer.name,
            duration: duration
        });
        this.spawnDecoyEntity(this.localPlayer.x, this.localPlayer.y, this.localPlayer.facing * 3.5, this.localPlayer.vy, this.localPlayer.facing, this.localPlayer.color, this.localPlayer.name, multiplayer.myId, duration, 'decoy');
        return true;
    }

    spawnDecoyEntity(x, y, vx, vy, facing, color, name, owner, life = 4.0, type = 'decoy') {
        this.decoys.push({
            x: x,
            y: y,
            renderX: x,
            renderY: y,
            vx: vx,
            vy: vy,
            facing: facing,
            color: color,
            name: name,
            owner: owner,
            life: life,
            width: 26,
            height: 26,
            type: type
        });
    }

    updateDecoys(dt) {
        const th = 32;
        this.decoys = this.decoys.filter(dec => {
            dec.life -= dt;
            if (dec.life <= 0) return false;

            // Apply horizontal speed override based on target chasing/escaping
            if (dec.type === 'decoy') {
                const dir = this.getDecoyMoveDirection(dec);
                if (dir !== 0) {
                    dec.facing = dir;
                    dec.vx = dir * 3.5;
                }
            }

            dec.vy += this.gravity;
            
            // Separate X-Movement
            dec.x += dec.vx;
            
            // X collision check
            let hitHorizontal = false;
            if (this.checkCollisionAt(dec.x, dec.y, dec.width, dec.height)) {
                dec.x -= dec.vx;
                hitHorizontal = true;
            }

            // Separate Y-Movement
            dec.y += dec.vy;
            
            // Y collision check
            if (this.checkCollisionAt(dec.x, dec.y, dec.width, dec.height)) {
                if (dec.vy > 0) {
                    const row = Math.floor((dec.y + dec.height) / th);
                    dec.y = row * th - dec.height;
                    dec.vy = 0;
                } else if (dec.vy < 0) {
                    dec.y += 2;
                    dec.vy = 0;
                }
            }

            dec.renderX += (dec.x - dec.renderX) * 0.25;
            dec.renderY += (dec.y - dec.renderY) * 0.25;

            // Clamping inside solid borders
            if (dec.x < 32) { dec.x = 32; dec.vx *= -1; dec.facing *= -1; hitHorizontal = true; }
            if (dec.x > this.canvas.width - 32 - dec.width) { dec.x = this.canvas.width - 32 - dec.width; dec.vx *= -1; dec.facing *= -1; hitHorizontal = true; }
            if (dec.y < 32) { dec.y = 32; dec.vy = 0; }
            if (dec.y > this.canvas.height - 32 - dec.height) { dec.y = this.canvas.height - 32 - dec.height; dec.vy = 0; }

            // If hit wall horizontally, jump if possible! (Only normal decoys jump)
            if (hitHorizontal && dec.type === 'decoy') {
                const onGround = this.checkCollisionAt(dec.x + 3, dec.y + dec.height + 2, dec.width - 6, 2);
                if (onGround) {
                    dec.vy = -8.5;
                } else {
                    dec.vx *= -1;
                    dec.facing *= -1;
                }
            } else if (hitHorizontal && dec.type === 'trio') {
                dec.vx *= -1;
                dec.facing *= -1;
            }

            // Contact checks - pop only on opponent touch
            let touched = false;

            if (!this.localPlayer.isDead && this.checkOverlap(this.localPlayer, dec)) {
                const decOwnerIsSeeker = this.isDecoyOwnerSeeker(dec);
                const localIsSeeker = this.localPlayer.isSeeker;
                if (decOwnerIsSeeker !== localIsSeeker) {
                    touched = true;
                }
            }
            if (this.inTestRoom && this.botEnabled && this.bot && !this.bot.isDead && this.checkOverlap(this.bot, dec)) {
                const decOwnerIsSeeker = this.isDecoyOwnerSeeker(dec);
                const botIsSeeker = this.bot.isSeeker;
                if (decOwnerIsSeeker !== botIsSeeker) {
                    touched = true;
                }
            }
            if (!this.inTestRoom) {
                for (let pid in this.remotePlayers) {
                    const rp = this.remotePlayers[pid];
                    if (!rp.isDead && this.checkOverlap(rp, dec)) {
                        const decOwnerIsSeeker = this.isDecoyOwnerSeeker(dec);
                        const rpIsSeeker = rp.isSeeker;
                        if (decOwnerIsSeeker !== rpIsSeeker) {
                            touched = true;
                        }
                    }
                }
            }

            if (touched) {
                sound.playLavaBurn();
                this.spawnTagBurst(dec.x + dec.width / 2, dec.y + dec.height / 2);
                multiplayer.sendGameEvent({
                    type: 'decoy_popped',
                    owner: dec.owner,
                    dx: dec.x,
                    dy: dec.y
                });
                return false;
            }

            return true;
        });
    }

    checkOverlap(r1, r2) {
        const x1 = r1.renderX !== undefined ? r1.renderX : r1.x;
        const y1 = r1.renderY !== undefined ? r1.renderY : r1.y;
        const x2 = r2.renderX !== undefined ? r2.renderX : r2.x;
        const y2 = r2.renderY !== undefined ? r2.renderY : r2.y;
        return x1 < x2 + r2.width &&
               x1 + r1.width > x2 &&
               y1 < y2 + r2.height &&
               y1 + r1.height > y2;
    }

    castBlindness() {
        sound.playTimeStop();
        const targetType = this.localPlayer.isSeeker ? 'runners' : 'seeker';
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 3.6 : 3.0;
        
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'blindness',
            target: targetType,
            duration: duration,
            casterId: multiplayer.myId
        });
        return true;
    }

    castWallPlace() {
        let wx, wy, w, h;
        if (this.keys['ArrowUp']) {
            // Horizontal platform above
            w = 48;
            h = 16;
            wx = this.localPlayer.x + this.localPlayer.width / 2 - w / 2;
            wy = this.localPlayer.y - h - 12;
        } else if (this.keys['ArrowDown']) {
            // Horizontal platform below
            w = 48;
            h = 16;
            wx = this.localPlayer.x + this.localPlayer.width / 2 - w / 2;
            wy = this.localPlayer.y + this.localPlayer.height + 12;
        } else {
            // Standard vertical wall in front
            w = 16;
            h = 48;
            wx = this.localPlayer.x + (this.localPlayer.facing === 1 ? this.localPlayer.width + 12 : -w - 12);
            wy = this.localPlayer.y + this.localPlayer.height - h;
        }

        // Clamp to screen boundaries
        const minX = 32;
        const maxX = this.canvas.width - 32 - w;
        const minY = 32;
        const maxY = this.canvas.height - 32 - h;
        wx = Math.max(minX, Math.min(maxX, wx));
        wy = Math.max(minY, Math.min(maxY, wy));

        // Check if wall overlaps with solid tiles (vertical walls use h - 2 to allow ground placement)
        const colHeight = (h === 48) ? h - 2 : h;
        if (this.checkCollisionAt(wx, wy, w, colHeight)) {
            return false;
        }

        sound.playFreeze();
        this.temporaryWalls.push({
            x: wx,
            y: wy,
            width: w,
            height: h,
            life: 4.0,
            owner: multiplayer.myId
        });
        
        multiplayer.sendGameEvent({
            type: 'wall_placed',
            x: wx,
            y: wy,
            w: w,
            h: h,
            sender: multiplayer.myId
        });
        return true;
    }

    castWebTrap() {
        sound.playFreeze();
        const tx = this.localPlayer.x + this.localPlayer.width/2;
        const ty = this.localPlayer.y + this.localPlayer.height;
        
        let myTraps = this.webTraps.filter(t => t.owner === multiplayer.myId);
        if (myTraps.length >= 1) {
            const oldest = myTraps[0];
            this.webTraps = this.webTraps.filter(t => t !== oldest);
        }

        this.webTraps.push({
            x: tx,
            y: ty,
            owner: multiplayer.myId
        });

        multiplayer.sendGameEvent({
            type: 'web_placed',
            x: tx,
            y: ty,
            sender: multiplayer.myId
        });
        return true;
    }

    castInvertKeys() {
        sound.playFreeze();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 3.6 : 3.0;
        
        if (this.inTestRoom) {
            if (this.botEnabled && this.bot && !this.bot.isDead) {
                this.bot.keysInvertedTimer = duration;
            }
        } else {
            multiplayer.sendGameEvent({
                type: 'invert_keys',
                duration: duration,
                sender: multiplayer.myId
            });
        }
        return true;
    }

    castMindControl() {
        sound.playFreeze();
        let targetId = null;
        if (this.inTestRoom) {
            if (this.botEnabled && this.bot && !this.bot.isDead) {
                targetId = 'npc_bot';
            }
        } else {
            let activeTargets = [];
            for (let pid in this.remotePlayers) {
                if (!this.remotePlayers[pid].isDead) {
                    activeTargets.push(pid);
                }
            }
            if (activeTargets.length > 0) {
                targetId = activeTargets[Math.floor(Math.random() * activeTargets.length)];
            }
        }

        if (!targetId) return false;

        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 4.8 : 4.0;

        this.isMindControlling = true;
        this.mindControlTargetId = targetId;
        this.mindControlTimer = duration;

        if (targetId === 'npc_bot') {
            this.bot.isMindControlled = true;
            this.bot.mindControlTimer = duration;
        } else {
            multiplayer.sendGameEvent({
                type: 'mind_control_start',
                targetId: targetId,
                duration: duration,
                sender: multiplayer.myId
            });
        }
        return true;
    }

    castCloneTrio() {
        sound.playFreeze();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 2.4 : 2.0;
        
        // Spawn 3 decoys running in different directions / stationary, all with duration lifetime, type 'trio'
        this.spawnDecoyEntity(this.localPlayer.x, this.localPlayer.y, -3.5, 0, -1, this.localPlayer.color, this.localPlayer.name, multiplayer.myId, duration, 'trio');
        this.spawnDecoyEntity(this.localPlayer.x, this.localPlayer.y, 3.5, 0, 1, this.localPlayer.color, this.localPlayer.name, multiplayer.myId, duration, 'trio');
        this.spawnDecoyEntity(this.localPlayer.x, this.localPlayer.y, 0, 0, this.localPlayer.facing, this.localPlayer.color, this.localPlayer.name, multiplayer.myId, duration, 'trio');
        
        multiplayer.sendGameEvent({
            type: 'spawn_clone_trio',
            x: this.localPlayer.x,
            y: this.localPlayer.y,
            color: this.localPlayer.color,
            name: this.localPlayer.name,
            facing: this.localPlayer.facing,
            sender: multiplayer.myId,
            duration: duration
        });
        return true;
    }

    castBlastShot() {
        sound.playTag();
        const px = this.localPlayer.x + this.localPlayer.width / 2;
        const py = this.localPlayer.y + this.localPlayer.height / 2;
        const vx = this.localPlayer.facing * 8;
        const force = this.localPlayer.passiveAbility === 'speciality_plus' ? 26.4 : 22;
        
        this.defenseProjectiles.push({
            x: px,
            y: py,
            vx: vx,
            vy: 0,
            radius: 8,
            owner: multiplayer.myId,
            force: force
        });

        multiplayer.sendGameEvent({
            type: 'spawn_proj',
            x: px,
            y: py,
            vx: vx,
            owner: multiplayer.myId,
            force: force
        });
        return true;
    }

    castShield() {
        sound.playFreeze();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 3.0 : 2.5;
        this.localPlayer.activeAbilities.shield = duration;

        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'shield',
            duration: duration
        });
        return true;
    }

    applyShieldKnockback(shielded, target) {
        sound.playTag();
        const sx = shielded.x + shielded.width / 2;
        const sy = shielded.y + shielded.height / 2;
        const tx = target.x + target.width / 2;
        const ty = target.y + target.height / 2;
        
        const angle = Math.atan2(ty - sy, tx - sx);
        const force = 7;
        target.vx = Math.cos(angle) * force;
        target.vy = Math.sin(angle) * force - 2;
    }

    executeShieldKnockbackOnLocal(fromX, fromY) {
        sound.playTag();
        const px = this.localPlayer.x + this.localPlayer.width / 2;
        const py = this.localPlayer.y + this.localPlayer.height / 2;
        const angle = Math.atan2(py - fromY, px - fromX);
        let force = 7;
        if (this.localPlayer.passiveAbility === 'resilience') {
            force *= 0.5;
        }
        this.localPlayer.vx = Math.cos(angle) * force;
        this.localPlayer.vy = Math.sin(angle) * force - (this.localPlayer.passiveAbility === 'resilience' ? 1.0 : 2.0);
    }

    castDisguise() {
        sound.playFreeze();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 4.2 : 3.5;
        this.localPlayer.activeAbilities.disguise = duration;
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'disguise',
            duration: duration
        });
        return true;
    }

    castShrink() {
        sound.playJump();
        const duration = this.localPlayer.passiveAbility === 'speciality_plus' ? 6.0 : 5.0;
        this.localPlayer.activeAbilities.shrink = duration;
        this.localPlayer.width = 13;
        this.localPlayer.height = 13;
        
        multiplayer.sendGameEvent({
            type: 'ability_effect',
            abil: 'shrink',
            duration: duration
        });
        return true;
    }

    handleRemoteAbilityEffect(ev) {
        switch (ev.abil) {
            case 'timestop':
                if (ev.sender !== multiplayer.myId) {
                    this.timeStoppedBy = ev.sender;
                    this.timeStopDuration = 1.5; // 1.5 seconds stop
                    this.triggerAlertBanner("TIME STOPPED!", 1800);
                }
                break;

            case 'knockback':
                this.applyRadialKnockback(ev.x, ev.y, ev.sender);
                break;

            case 'swap':
                if (ev.targetId === multiplayer.myId) {
                    sound.playDash();
                    this.localPlayer.x = ev.toX;
                    this.localPlayer.y = ev.toY;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                    this.tagImmunityTimer = 1.5;
                }
                break;

            case 'blindness':
                if (ev.casterId !== multiplayer.myId) {
                    let isTarget = false;
                    if (ev.target === 'seeker' && this.localPlayer.isSeeker) {
                        isTarget = true;
                    } else if (ev.target === 'runners' && !this.localPlayer.isSeeker) {
                        isTarget = true;
                    }

                    if (isTarget) {
                        sound.playTimeStop();
                        let dur = ev.duration || 3.0;
                        if (this.localPlayer.passiveAbility === 'resilience') {
                            dur *= 0.5;
                        }
                        this.localPlayer.blindnessTimer = dur;
                        this.triggerAlertBanner("ERBLINDET!", 1500);
                    }
                }
                break;

            case 'shield':
                if (ev.sender !== multiplayer.myId) {
                    const rp = this.remotePlayers[ev.sender];
                    if (rp) {
                        if (!rp.activeAbils) rp.activeAbils = {};
                        rp.activeAbils.shield = ev.duration;
                    }
                }
                break;


        }
    }

    applyRadialKnockback(kx, ky, senderId, forceFactor = 1.0) {
        // Evaluate distance from shockwave
        const px = this.localPlayer.x + this.localPlayer.width/2;
        const py = this.localPlayer.y + this.localPlayer.height/2;
        const dist = Math.hypot(px - kx, py - ky);

        if (dist < 75 && senderId !== multiplayer.myId) {
            sound.playTag();
            // Launch player away (scaled force by 180%, i.e., 47.52 instead of 26.4)
            const angle = Math.atan2(py - ky, px - kx);
            let force = 47.52 * (1 - dist / 75) * forceFactor;
            if (this.localPlayer.passiveAbility === 'resilience') {
                force *= 0.5;
            }
            this.localPlayer.vx = Math.cos(angle) * force;
            this.localPlayer.vy = Math.sin(angle) * force;
        }

        // Also knock back singleplayer bot
        if (this.inTestRoom && this.botEnabled && this.bot && !this.bot.isDead) {
            const bx = this.bot.x + this.bot.width / 2;
            const by = this.bot.y + this.bot.height / 2;
            const bdist = Math.hypot(bx - kx, by - ky);
            if (bdist < 75 && senderId !== 'npc_bot') {
                sound.playTag();
                const angle = Math.atan2(by - ky, bx - kx);
                const force = 47.52 * (1 - bdist / 75) * forceFactor;
                this.bot.vx = Math.cos(angle) * force;
                this.bot.vy = Math.sin(angle) * force;
            }
        }
    }

    rootPlayer(seconds) {
        sound.playFreeze();
        this.localPlayer.isRooted = true;
        this.localPlayer.rootTimer = this.localPlayer.passiveAbility === 'resilience' ? seconds * 0.5 : seconds;
        this.localPlayer.vx = 0;
        this.localPlayer.vy = 0;
    }

    slowPlayer(duration, multiplier) {
        sound.playFreeze();
        this.localPlayer.isSlowed = true;
        this.localPlayer.slowTimer = this.localPlayer.passiveAbility === 'resilience' ? duration * 0.5 : duration;
        this.localPlayer.slowMultiplier = multiplier;
    }

    slowBot(duration, multiplier) {
        sound.playFreeze();
        if (this.bot) {
            this.bot.isSlowed = true;
            this.bot.slowTimer = duration;
            this.bot.slowMultiplier = multiplier;
        }
    }

    // --- Interactive Game Loops ---
    setupGameLoop() {
        // Cancel any existing loop to prevent multiple parallel loops (the main cause of jitter)
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        this._lastFrameTime = null;
        this._physicsAccumulator = 0;  // leftover time for fixed physics stepping
        this._syncAccumulator = 0;     // for rate-limiting network sync

        const FIXED_DT = 1 / 60;      // physics always runs at 60 Hz

        const loop = (timestamp) => {
            if (!this.isPlaying) {
                this._rafId = null;
                return;
            }
            this._rafId = requestAnimationFrame(loop);

            // Compute real elapsed time; cap at 100ms to avoid spiral-of-death
            if (!this._lastFrameTime) this._lastFrameTime = timestamp;
            const elapsed = Math.min((timestamp - this._lastFrameTime) / 1000, 0.1);
            this._lastFrameTime = timestamp;

            // Run physics in fixed steps to keep deterministic behaviour
            this._physicsAccumulator += elapsed;
            while (this._physicsAccumulator >= FIXED_DT) {
                this.update(FIXED_DT);
                this._physicsAccumulator -= FIXED_DT;
            }

            this.draw();
        };
        this._rafId = requestAnimationFrame(loop);
    }

    update(dt) {
        // Round Over Standings countdown
        if (this.showRoundOverStandings) {
            this.roundOverCountdown -= dt;
            if (this.roundOverCountdown <= 0) {
                this.showRoundOverStandings = false;
                this.isPlaying = false; // Stop loop, wait for next round start
                if (multiplayer.isHost) {
                    this.currentRound++;
                    multiplayer.startGame({
                        mode: this.gameMode,
                        map: this.currentMapKey,
                        maxRounds: this.maxRounds,
                        duration: this.gameDurationSec,
                        interval: this.randomSwitchInterval,
                        round: this.currentRound,
                        scores: this.playerScores
                    });
                }
            }
            return; // Skip normal gameplay updates
        }

        // Seeker fail-safety: if seeker is missing, host re-assigns
        if (multiplayer.isHost && this.isPlaying && !this.showRoundOverStandings) {
            if (!this.seekerId || !multiplayer.players[this.seekerId]) {
                const playerIds = Object.keys(multiplayer.players);
                if (playerIds.length > 0) {
                    const randomSeeker = playerIds[Math.floor(Math.random() * playerIds.length)];
                    multiplayer.sendGameEvent({
                        type: 'initial_seeker',
                        seekerId: randomSeeker
                    });
                }
            }
        }

            // Timer Tickdowns
            if (this.tagImmunityTimer > 0) this.tagImmunityTimer -= dt;
            
            // Root timer tickdown
            if (this.localPlayer.rootTimer > 0) {
                this.localPlayer.rootTimer -= dt;
                if (this.localPlayer.rootTimer <= 0) {
                    this.localPlayer.isRooted = false;
                }
            }

            // Slow timers tickdowns
            if (this.localPlayer.slowTimer > 0) {
                this.localPlayer.slowTimer -= dt;
                if (this.localPlayer.slowTimer <= 0) {
                    this.localPlayer.isSlowed = false;
                }
            }
            if (this.bot && this.bot.slowTimer > 0) {
                this.bot.slowTimer -= dt;
                if (this.bot.slowTimer <= 0) {
                    this.bot.isSlowed = false;
                }
            }

            // Bot tag immunity decrement
            if (this.bot && this.bot.tagImmunityTimer > 0) {
                this.bot.tagImmunityTimer -= dt;
            }

            // Blindness timer decrement
            if (this.localPlayer.blindnessTimer > 0) {
                this.localPlayer.blindnessTimer = Math.max(0, this.localPlayer.blindnessTimer - dt);
            }

            // Inverted keys timer tickdown
            if (this.localPlayer.keysInvertedTimer > 0) {
                this.localPlayer.keysInvertedTimer = Math.max(0, this.localPlayer.keysInvertedTimer - dt);
            }
            if (this.bot && this.bot.keysInvertedTimer > 0) {
                this.bot.keysInvertedTimer = Math.max(0, this.bot.keysInvertedTimer - dt);
            }

            // Mind Control timer tickdown
            if (this.isMindControlling) {
                this.mindControlTimer -= dt;
                if (this.mindControlTimer <= 0) {
                    this.isMindControlling = false;
                    this.mindControlTargetId = null;
                }
            }
            if (this.localPlayer.isMindControlled) {
                this.localPlayer.mindControlTimer -= dt;
                if (this.localPlayer.mindControlTimer <= 0) {
                    this.localPlayer.isMindControlled = false;
                    this.controlledKeys = null;
                }
            }
            if (this.bot && this.bot.isMindControlled) {
                this.bot.mindControlTimer -= dt;
                if (this.bot.mindControlTimer <= 0) {
                    this.bot.isMindControlled = false;
                }
            }

            // Time stop update
            if (this.timeStopDuration > 0) {
                this.timeStopDuration -= dt;
                if (this.timeStopDuration <= 0) {
                    this.timeStoppedBy = null;
                }
            }

            // Local player death recovery
            if (this.localPlayer.isDead) {
                this.localPlayer.deadTimer -= dt;
                if (this.localPlayer.deadTimer <= 0) {
                    this.localPlayer.isDead = false;
                    this.respawnPlayer(this.localPlayer);
                }
            }

            // Active buffs duration reduction
            for (let b in this.localPlayer.activeAbilities) {
                if (this.localPlayer.activeAbilities[b] > 0) {
                    this.localPlayer.activeAbilities[b] -= dt;
                }
            }

            // Shrink check
            const isShrunk = this.localPlayer.activeAbilities.shrink > 0;
            if (isShrunk) {
                this.localPlayer.width = 13;
                this.localPlayer.height = 13;
            } else {
                if (this.localPlayer.width !== 26) {
                    this.localPlayer.width = 26;
                    this.localPlayer.height = 26;
                    if (this.checkCollisionAt(this.localPlayer.x, this.localPlayer.y, 26, 26)) {
                        let pushed = false;
                        const pushDirs = [
                            {dx: 0, dy: -8}, {dx: 0, dy: 8}, {dx: -8, dy: 0}, {dx: 8, dy: 0},
                            {dx: -16, dy: 0}, {dx: 16, dy: 0}, {dx: 0, dy: -16}, {dx: 0, dy: 16}
                        ];
                        for (const dir of pushDirs) {
                            if (!this.checkCollisionAt(this.localPlayer.x + dir.dx, this.localPlayer.y + dir.dy, 26, 26)) {
                                this.localPlayer.x += dir.dx;
                                this.localPlayer.y += dir.dy;
                                pushed = true;
                                break;
                            }
                        }
                        if (!pushed) {
                            this.respawnPlayer(this.localPlayer);
                        }
                    }
                }
            }

            // Shockwaves updates
            if (this.shockwaves) {
                this.shockwaves = this.shockwaves.filter(sw => {
                    sw.radius += sw.speed * dt;
                    sw.life -= dt;
                    return sw.life > 0;
                });
            }

            // Temporary walls updates
            if (this.temporaryWalls) {
                this.temporaryWalls = this.temporaryWalls.filter(w => {
                    w.life -= dt;
                    return w.life > 0;
                });
            }

            // Web traps updates
            if (this.webTraps) {
                // Handled in updateHazards
            }

            // Update defense projectiles
            this.updateDefenseProjectiles();

            // Evaluate shield knockback contacts
            if (this.inTestRoom) {
                if (this.botEnabled && this.bot && !this.bot.isDead && !this.localPlayer.isDead) {
                    if (this.localPlayer.activeAbilities.shield > 0 && this.bot.isSeeker) {
                        if (this.checkOverlap(this.localPlayer, this.bot)) {
                            this.applyShieldKnockback(this.localPlayer, this.bot);
                        }
                    }
                    if (this.bot.activeAbilities.shield > 0 && this.localPlayer.isSeeker) {
                        if (this.checkOverlap(this.localPlayer, this.bot)) {
                            this.applyShieldKnockback(this.bot, this.localPlayer);
                        }
                    }
                }
            } else {
                if (!this.localPlayer.isDead) {
                    for (let pid in this.remotePlayers) {
                        const rp = this.remotePlayers[pid];
                        if (rp.isDead) continue;
                        if (this.localPlayer.activeAbilities.shield > 0 && !this.localPlayer.isSeeker && rp.isSeeker) {
                            if (this.checkOverlap(this.localPlayer, rp)) {
                                multiplayer.sendGameEvent({
                                    type: 'shield_knockback',
                                    targetId: pid,
                                    fromX: this.localPlayer.x + this.localPlayer.width / 2,
                                    fromY: this.localPlayer.y + this.localPlayer.height / 2
                                });
                            }
                        }
                        if (rp.activeAbils.shield > 0 && !rp.isSeeker && this.localPlayer.isSeeker) {
                            if (this.checkOverlap(this.localPlayer, rp)) {
                                const kx = rp.x + rp.width / 2;
                                const ky = rp.y + rp.height / 2;
                                this.executeShieldKnockbackOnLocal(kx, ky);
                            }
                        }
                    }
                }
            }

            // Dash shadow trail updates
            if (this.localPlayer.dashShadowTimer > 0) {
                this.localPlayer.dashShadowTimer -= dt;
            }
            if (this.localPlayer.activeAbilities.dash > 0 || this.localPlayer.dashShadowTimer > 0) {
                if (!this.localPlayer.shadowSpawnCooldown || this.localPlayer.shadowSpawnCooldown <= 0) {
                    this.dashShadows.push({
                        x: this.localPlayer.x,
                        y: this.localPlayer.y,
                        width: this.localPlayer.width,
                        height: this.localPlayer.height,
                        color: this.localPlayer.color,
                        facing: this.localPlayer.facing,
                        isSeeker: this.localPlayer.isSeeker,
                        life: 0.5,
                        maxLife: 0.5
                    });
                    this.localPlayer.shadowSpawnCooldown = 0.05;
                } else {
                    this.localPlayer.shadowSpawnCooldown -= dt;
                }
            }
            if (this.dashShadows) {
                this.dashShadows = this.dashShadows.filter(s => {
                    s.life -= dt;
                    return s.life > 0;
                });
            }

            // Test room "No Cooldown" toggle check
            const noCooldown = this.inTestRoom && document.getElementById('test-nocooldown-chk')?.checked;
            if (noCooldown) {
                this.localPlayer.cooldowns = [0, 0, 0];
            }

            // Cooldowns widgets decrement
            const abils = this.localPlayer.abilities;
            const maxSlots = this.localPlayer.passiveAbility === 'third_slot' ? 3 : 2;
            for (let i = 0; i < maxSlots; i++) {
                if (this.localPlayer.cooldowns[i] > 0) {
                    this.localPlayer.cooldowns[i] = Math.max(0, this.localPlayer.cooldowns[i] - dt);
                }
                
                // Redraw UI cooldown fill percentage
                const widget = document.getElementById(`hud-ability-${i+1}`);
                const mobBtn = document.getElementById(`mobile-btn-f${i+1}`);
                const spec = ABILITIES_REGISTRY[abils[i]];
                
                let cdPercent = 0;
                let isCooldownActive = this.localPlayer.cooldowns[i] > 0;
                
                if (spec && spec.cooldown > 0) {
                    cdPercent = (this.localPlayer.cooldowns[i] / (this.getAdjustedCooldown(abils[i]) / 1000)) * 100;
                }
                
                if (widget) {
                    const fill = widget.querySelector('.cooldown-fill');
                    if (fill) fill.style.width = `${cdPercent}%`;
                }

                if (mobBtn) {
                    const cdOverlay = mobBtn.querySelector('.mobile-btn-cooldown');
                    if (cdOverlay) {
                        if (isCooldownActive) {
                            cdOverlay.textContent = this.localPlayer.cooldowns[i].toFixed(1) + 's';
                            cdOverlay.style.display = 'flex';
                        } else {
                            cdOverlay.style.display = 'none';
                        }
                    }
                }
            }

        // Physics Updates
        const isTimeStoppedForLocal = this.timeStoppedBy && 
                                     this.timeStoppedBy !== multiplayer.myId && 
                                     this.timeStoppedBy !== 'local_player';

        const isTimeStoppedForBot = this.timeStoppedBy && 
                                   this.timeStoppedBy !== 'npc_bot';

        if (!isTimeStoppedForLocal) {
            this.updateLocalPhysics(dt);
        }

        // Check for map items collection
        this.checkItemCollisions();

        if (this.inTestRoom) {
            if (!this.testRoomItemTimer) this.testRoomItemTimer = 0;
            this.testRoomItemTimer += dt;
            if (this.testRoomItemTimer >= 15) {
                this.testRoomItemTimer = 0;
                const items = ['speed2x', 'cooldown_reset', 'swap'];
                const randomItem = items[Math.floor(Math.random() * items.length)];
                this.spawnItemOnMap(randomItem);
            }
        }

        // Speed buff timer tickdown
        if (this.localPlayer.speedBuffTimer > 0) {
            this.localPlayer.speedBuffTimer -= dt;
        }

        // Projectiles and hazards are frozen during any time stop
        if (!this.timeStoppedBy) {
            this.updateHazards();
            this.updateDecoys(dt);
        }

        // Bot updates in Test Room (skip if time is stopped for bot)
        if (this.inTestRoom && this.botEnabled && this.bot && !isTimeStoppedForBot) {
            this.updateBot(dt);
        }

        // Sync position to broker — rate-limited to ~30 packets/sec (every ~33ms)
        if (!this.inTestRoom && multiplayer.roomCode && (!this.timeStoppedBy || this.timeStoppedBy === multiplayer.myId)) {
            this._syncAccumulator = (this._syncAccumulator || 0) + dt;
            if (this._syncAccumulator >= 0.033) {
                this._syncAccumulator -= 0.033;
                multiplayer.sendPositionSync({
                    x: this.localPlayer.x,
                    y: this.localPlayer.y,
                    vx: this.localPlayer.vx * 60, // px/frame → px/second for dead-reckoning
                    vy: this.localPlayer.vy * 60,
                    facing: this.localPlayer.facing,
                    anim: this.localPlayer.vx !== 0 ? 'walk' : 'idle',
                    isDead: this.localPlayer.isDead,
                    activeAbils: this.localPlayer.activeAbilities,
                    inputs: {
                        left: this.keys['ArrowLeft'] || (this.mobileMode && this.mobileJoystickX < -0.1),
                        right: this.keys['ArrowRight'] || (this.mobileMode && this.mobileJoystickX > 0.1),
                        down: this.keys['ArrowDown'] || (this.mobileMode && this.mobileJoystickY > 0.5),
                        jump: this._syncAccumulatedJump
                    }
                });
                this._syncAccumulatedJump = false;
            }

            // Send Mind Control input to target player (every frame — needs low latency)
            if (this.isMindControlling && this.mindControlTargetId) {
                multiplayer.sendGameEvent({
                    type: 'mind_control_input',
                    targetId: this.mindControlTargetId,
                    keys: {
                        left: this.keys['ArrowLeft'],
                        right: this.keys['ArrowRight'],
                        up: this.keys['ArrowUp'],
                        down: this.keys['ArrowDown'],
                        jump: this.jumpPressed
                    }
                });
            }
        }

        // Decay active visual buffs and run tag collision — in update() (physics side)
        if (!this.inTestRoom) {
            for (let pid in this.remotePlayers) {
                const rp = this.remotePlayers[pid];
                rp.id = pid;
                this.updateRemotePlayerPlayback(rp, performance.now());
                for (let b in rp.activeAbils) {
                    if (rp.activeAbils[b] > 0) rp.activeAbils[b] -= dt;
                }
            }
            // Evaluate tag contact
            if (this.localPlayer.isSeeker && !this.localPlayer.isDead && this.tagImmunityTimer <= 0) {
                this.checkTagCollisions();
            }
        } else {
            // Role swapping tags in test room
            if (this.botEnabled && this.bot && !this.bot.isDead && !this.localPlayer.isDead) {
                const localImmune = this.tagImmunityTimer > 0 || this.localPlayer.activeAbilities.phase > 0 || this.localPlayer.activeAbilities.dash > 0 || this.localPlayer.activeAbilities.shield > 0;
                const botImmune = (this.bot.tagImmunityTimer && this.bot.tagImmunityTimer > 0) || 
                                  (this.bot.activeAbilities && (this.bot.activeAbilities.phase > 0 || this.bot.activeAbilities.dash > 0 || this.bot.activeAbilities.shield > 0));
                
                let canTag = true;
                if (localImmune || botImmune) canTag = false;

                if (canTag && this.localPlayer.x < this.bot.x + this.bot.width &&
                    this.localPlayer.x + this.localPlayer.width > this.bot.x &&
                    this.localPlayer.y < this.bot.y + this.bot.height &&
                    this.localPlayer.y + this.localPlayer.height > this.bot.y) {
                    
                    const localWasSeeker = this.localPlayer.isSeeker;
                    this.localPlayer.isSeeker = !localWasSeeker;
                    this.bot.isSeeker = localWasSeeker;
                    this.tagImmunityTimer = 1.5;
                    this.bot.tagImmunityTimer = 1.5;
                    sound.playTag();
                    
                    this.spawnTagBurst((this.localPlayer.x + this.bot.x) / 2 + 11, (this.localPlayer.y + this.bot.y) / 2 + 15);
                    const newSeekerName = this.localPlayer.isSeeker ? this.localPlayer.name : this.bot.name;
                    this.triggerAlertBanner(`${newSeekerName} fängt!`, 1500);
                    
                    document.getElementById('hud-seeker-name').textContent = newSeekerName;
                }
            }
        }

        // Particles and floating emojis tick
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= dt;
            return p.life > 0;
        });

        this.floatingEmojis = this.floatingEmojis.filter(e => {
            e.y -= 45 * dt; // Rise up
            e.life -= dt;
            return e.life > 0;
        });
    }

    updateLocalPhysics(dt) {
        if (this.isFrozen) {
            this.localPlayer.vx = 0;
            this.localPlayer.vy = 0;
            return;
        }
        if (this.localPlayer.isDead || this.localPlayer.isRooted) return;

        // Custom properties per map
        const isSpace = this.currentMapKey === 'space';
        const isIce = this.currentMapKey === 'ice';

        const mapGravity = isSpace ? 0.18 : this.gravity;
        const currentFriction = isIce ? this.iceFriction : this.friction;

        // Phase active? Phase turns off collisions with walls
        const isPhased = this.localPlayer.activeAbilities.phase > 0;

        // Movement Plus slotted passive bonus & active buff check
        const hasMovePlusBuff = this.localPlayer.activeAbilities.moveplus > 0;
        const slowMult = this.localPlayer.isSlowed ? this.localPlayer.slowMultiplier : 1.0;
        
        // Item speed buff
        const hasSpeedBuff = this.localPlayer.speedBuffTimer > 0;
        const speedBuffMult = hasSpeedBuff ? 2.0 : 1.0;
        
        // Passive speed multipliers
        const passiveSpeedMult = this.localPlayer.passiveAbility === 'third_slot' ? 0.8 : 1.0;
        const isSeekerBonus = this.localPlayer.isSeeker ? (this.localPlayer.passiveAbility === 'seeker_speed' ? 1.25 : 1.15) : 1.0;

        const speedMultiplier = isSeekerBonus * (hasMovePlusBuff ? 1.5 : 1.0) * slowMult * speedBuffMult * passiveSpeedMult;

        const gravityDir = this.localPlayer.activeAbilities.gravity > 0 ? -1 : 1;

        // Apply Gravity (skip if currently dashing)
        const isDashing = this.localPlayer.activeAbilities.dash > 0;
        let leftPressed = this.keys['ArrowLeft'];
        let rightPressed = this.keys['ArrowRight'];
        let upPressed = this.keys['ArrowUp'];
        let downPressed = this.keys['ArrowDown'];
        let spacePressed = this.jumpPressed;

        if (this.localPlayer.isMindControlled && this.controlledKeys) {
            leftPressed = this.controlledKeys.left;
            rightPressed = this.controlledKeys.right;
            upPressed = this.controlledKeys.up;
            downPressed = this.controlledKeys.down;
            spacePressed = this.controlledKeys.jump;
        } else if (this.isMindControlling) {
            leftPressed = false;
            rightPressed = false;
            upPressed = false;
            downPressed = false;
            spacePressed = false;
            this.localPlayer.vx = 0;
        }

        if (this.localPlayer.keysInvertedTimer > 0) {
            const tempL = leftPressed;
            leftPressed = rightPressed;
            rightPressed = tempL;

            const tempU = upPressed;
            upPressed = downPressed;
            downPressed = tempU;
        }

        if (!isDashing) {
            this.localPlayer.vy += mapGravity * gravityDir;
            if (!this.isOnGround() && downPressed) {
                this.localPlayer.vy += 0.55 * gravityDir;
            }
        }

        // Key movements & Mobile Virtual Joystick
        let ax = 0;
        const speedX = isIce ? 0.25 : 0.6; // Slippery builds momentum

        if (leftPressed) {
            ax = -speedX * speedMultiplier;
            this.localPlayer.facing = -1;
        }
        if (rightPressed) {
            ax = speedX * speedMultiplier;
            this.localPlayer.facing = 1;
        }

        // Mobile joystick analog calculation
        if (this.mobileMode && Math.abs(this.mobileJoystickX) > 0.1 && !this.isMindControlling && !this.localPlayer.isMindControlled) {
            ax = this.mobileJoystickX * speedX * speedMultiplier;
            this.localPlayer.facing = Math.sign(this.mobileJoystickX);
        }

        if (isDashing) {
            // Dash velocity override: uses real dt so speed is framerate-independent
            this.localPlayer.vx = this.localPlayer.dashVx * dt;
            this.localPlayer.vy = this.localPlayer.dashVy * dt;
        } else {
            this.localPlayer.vx += ax;
            this.localPlayer.vx *= currentFriction;

            // Cap speed
            const maxVx = (hasMovePlusBuff ? 7.5 : 5.0) * isSeekerBonus * slowMult * speedBuffMult * passiveSpeedMult;
            if (Math.abs(this.localPlayer.vx) > maxVx) {
                this.localPlayer.vx = Math.sign(this.localPlayer.vx) * maxVx;
            }

            // Jump triggers (custom keyboard / space binds / mobile jump button)
            if (spacePressed) {
                this.jumpPressed = false; // Consume the edge trigger
                this._syncAccumulatedJump = true;
                if (this.localPlayer.isMindControlled && this.controlledKeys) {
                    this.controlledKeys.jump = false;
                }
                const standingOnGround = this.isOnGround();
                if (standingOnGround) {
                    sound.playJump();
                    const jumpPower = isSpace ? 4.5 : 8.5;
                    this.localPlayer.vy = -jumpPower * gravityDir;
                    this.localPlayer.doubleJumpAvailable = true;
                } else if (this.isTouchingWallLeft()) {
                    sound.playJump();
                    const jumpPower = isSpace ? 4.5 : 8.5;
                    this.localPlayer.vy = -jumpPower * gravityDir;
                    this.localPlayer.vx = 4.8;
                    this.localPlayer.doubleJumpAvailable = true;
                } else if (this.isTouchingWallRight()) {
                    sound.playJump();
                    const jumpPower = isSpace ? 4.5 : 8.5;
                    this.localPlayer.vy = -jumpPower * gravityDir;
                    this.localPlayer.vx = -4.8;
                    this.localPlayer.doubleJumpAvailable = true;
                } else if (this.localPlayer.doubleJumpAvailable && hasMovePlusBuff) {
                    // Double jump mechanics
                    sound.playJump();
                    const dJumpPower = isSpace ? 3.5 : 6.5;
                    this.localPlayer.vy = -dJumpPower * gravityDir;
                    this.localPlayer.doubleJumpAvailable = false;
                    this.spawnDashTrail(this.localPlayer.x, this.localPlayer.y, this.localPlayer.x, this.localPlayer.y + 15);
                }
            }

            // Mobile joystick jump is disabled. Only jump via jump button.
            this.mobileJoystickWasUp = this.mobileJoystickY < -0.5;
        }

        // Collision logic
        if (!isPhased) {
            // Horizontal Collision
            this.localPlayer.x += this.localPlayer.vx;
            this.resolveCollisions('horizontal');

            // Vertical Collision
            this.localPlayer.y += this.localPlayer.vy;
            this.resolveCollisions('vertical');
        } else {
            // Phasewalking: pass straight through, but keep inside playable grid area (clamped to outer borders)
            this.localPlayer.x += this.localPlayer.vx;
            this.localPlayer.y += this.localPlayer.vy;
        }

        // Always keep player inside playable grid area (clamped to outer borders)
        const minX = 32;
        const maxX = this.canvas.width - 32 - this.localPlayer.width;
        const minY = 32;
        const maxY = this.canvas.height - 32 - this.localPlayer.height;
        if (this.localPlayer.x < minX) this.localPlayer.x = minX;
        if (this.localPlayer.x > maxX) this.localPlayer.x = maxX;
        if (this.localPlayer.y < minY) this.localPlayer.y = minY;
        if (this.localPlayer.y > maxY) this.localPlayer.y = maxY;

        // Special tiles overlap checks (Jungle trampolines / portal etc.)
        this.checkSpecialTiles();
    }

    // --- Remote player Entity Interpolation (Playback) ---
    updateRemotePlayerPlayback(rp, now) {
        if (!rp.packetBuffer || rp.packetBuffer.length === 0) return;

        const isRpFrozen = this.timeStoppedBy && this.timeStoppedBy !== rp.id;
        if (isRpFrozen) {
            rp.vx = 0;
            rp.vy = 0;
            return;
        }

        const renderTime = now - 150; // Playback 150ms in the past (standard Minecraft / Source default)
        const buffer = rp.packetBuffer;

        let packetA = null;
        let packetB = null;

        for (let i = 0; i < buffer.length - 1; i++) {
            if (buffer[i].time <= renderTime && buffer[i+1].time > renderTime) {
                packetA = buffer[i];
                packetB = buffer[i+1];
                break;
            }
        }

        if (packetA && packetB) {
            // We have surrounding packets! Interpolate between them.
            const timeDiff = packetB.time - packetA.time;
            const fraction = timeDiff > 0 ? (renderTime - packetA.time) / timeDiff : 0;
            
            rp.x = packetA.x + (packetB.x - packetA.x) * fraction;
            rp.y = packetA.y + (packetB.y - packetA.y) * fraction;
        } else {
            // If we don't have surrounding packets (e.g. renderTime is in the future due to lag),
            // LERP towards the latest known packet to prevent teleporting/snapping.
            const latest = buffer[buffer.length - 1];
            const dx = latest.x - rp.x;
            const dy = latest.y - rp.y;
            rp.x += dx * 0.20;
            rp.y += dy * 0.20;
        }

        // Keep render position closely following simulation position
        rp.renderX = rp.x;
        rp.renderY = rp.y;
    }

    isOnGround() {
        const gravityDir = this.localPlayer.activeAbilities.gravity > 0 ? -1 : 1;
        const checkY = gravityDir === 1 
            ? this.localPlayer.y + this.localPlayer.height 
            : this.localPlayer.y - 2;
        
        // Ground checking with shrinking width to prevent infinite wall jumps
        return this.checkCollisionAt(this.localPlayer.x + 3, checkY, this.localPlayer.width - 6, 2);
    }

    isTouchingWallLeft() {
        return this.checkCollisionAt(this.localPlayer.x - 3, this.localPlayer.y + 2, 3, this.localPlayer.height - 4);
    }

    isTouchingWallRight() {
        return this.checkCollisionAt(this.localPlayer.x + this.localPlayer.width, this.localPlayer.y + 2, 3, this.localPlayer.height - 4);
    }

    checkCollisionAt(x, y, w, h) {
        const colStart = Math.floor(x / 32);
        const colEnd = Math.floor((x + w) / 32);
        const rowStart = Math.floor(y / 32);
        const rowEnd = Math.floor((y + h) / 32);

        const grid = this.currentMap.grid;

        for (let r = rowStart; r <= rowEnd; r++) {
            if (r < 0 || r >= grid.length) continue;
            for (let c = colStart; c <= colEnd; c++) {
                if (c < 0 || c >= grid[r].length) continue;
                const tile = grid[r][c];
                // Solid tiles
                if (tile === '#' || tile === 'I') {
                    return true;
                }
            }
        }

        // Also check temporary walls
        if (this.temporaryWalls) {
            for (const wall of this.temporaryWalls) {
                if (x < wall.x + wall.width &&
                    x + w > wall.x &&
                    y < wall.y + wall.height &&
                    y + h > wall.y) {
                    return true;
                }
            }
        }

        return false;
    }

    resolveCollisions(dir) {
        const grid = this.currentMap.grid;
        const tw = 32;
        const th = 32;

        const colStart = Math.floor(this.localPlayer.x / tw);
        const colEnd = Math.floor((this.localPlayer.x + this.localPlayer.width) / tw);
        const rowStart = Math.floor(this.localPlayer.y / th);
        const rowEnd = Math.floor((this.localPlayer.y + this.localPlayer.height) / th);

        const gravityDir = this.localPlayer.activeAbilities.gravity > 0 ? -1 : 1;

        // Resolve tile collisions
        for (let r = rowStart; r <= rowEnd; r++) {
            if (r < 0 || r >= grid.length) continue;
            for (let c = colStart; c <= colEnd; c++) {
                if (c < 0 || c >= grid[r].length) continue;
                const tile = grid[r][c];
                if (tile === '#' || tile === 'I') {
                    const tileX = c * tw;
                    const tileY = r * th;

                    if (this.localPlayer.x < tileX + tw &&
                        this.localPlayer.x + this.localPlayer.width > tileX &&
                        this.localPlayer.y < tileY + th &&
                        this.localPlayer.y + this.localPlayer.height > tileY) {
                        
                        if (dir === 'horizontal') {
                            if (this.localPlayer.vx > 0) {
                                this.localPlayer.x = tileX - this.localPlayer.width;
                            } else if (this.localPlayer.vx < 0) {
                                this.localPlayer.x = tileX + tw;
                            }
                            this.localPlayer.vx = 0;
                        } else if (dir === 'vertical') {
                            if (this.localPlayer.vy > 0) {
                                this.localPlayer.y = tileY - this.localPlayer.height;
                                if (gravityDir === 1) {
                                    this.localPlayer.doubleJumpAvailable = true;
                                }
                            } else if (this.localPlayer.vy < 0) {
                                this.localPlayer.y = tileY + th;
                                if (gravityDir === -1) {
                                    this.localPlayer.doubleJumpAvailable = true;
                                }
                            }
                            this.localPlayer.vy = 0;
                        }
                    }
                }
            }
        }

        // Resolve temporary walls collisions
        if (this.temporaryWalls) {
            for (const wall of this.temporaryWalls) {
                if (this.localPlayer.x < wall.x + wall.width &&
                    this.localPlayer.x + this.localPlayer.width > wall.x &&
                    this.localPlayer.y < wall.y + wall.height &&
                    this.localPlayer.y + this.localPlayer.height > wall.y) {
                    
                    if (dir === 'horizontal') {
                        if (this.localPlayer.vx > 0) {
                            this.localPlayer.x = wall.x - this.localPlayer.width;
                        } else if (this.localPlayer.vx < 0) {
                            this.localPlayer.x = wall.x + wall.width;
                        }
                        this.localPlayer.vx = 0;
                    } else if (dir === 'vertical') {
                        if (this.localPlayer.vy > 0) {
                            this.localPlayer.y = wall.y - this.localPlayer.height;
                            if (gravityDir === 1) {
                                this.localPlayer.doubleJumpAvailable = true;
                            }
                        } else if (this.localPlayer.vy < 0) {
                            this.localPlayer.y = wall.y + wall.height;
                            if (gravityDir === -1) {
                                this.localPlayer.doubleJumpAvailable = true;
                            }
                        }
                        this.localPlayer.vy = 0;
                    }
                }
            }
        }
    }

    checkSpecialTiles() {
        const px = this.localPlayer.x + this.localPlayer.width/2;
        const py = this.localPlayer.y + this.localPlayer.height/2;

        const col = Math.floor(px / 32);
        const row = Math.floor(py / 32);

        const grid = this.currentMap.grid;
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) return;

        const tile = grid[row][col];
        const gravityDir = this.localPlayer.activeAbilities.gravity > 0 ? -1 : 1;

        // Jungle trampoline (bouncy leaves)
        if (tile === 'T') {
            sound.playJump();
            this.localPlayer.vy = -10.5 * gravityDir;
            this.localPlayer.doubleJumpAvailable = true;
            this.spawnDashTrail(this.localPlayer.x, this.localPlayer.y, this.localPlayer.x, this.localPlayer.y + 10);
        }

        // Volcano Lava or Ice water floor triggers instantly
        if (tile === 'L') {
            this.burnLocalPlayer();
        }

        // Space portals
        if (tile === 'P') {
            this.triggerSpacePortal(col, row);
        }
    }

    triggerSpacePortal(currCol, currRow) {
        // Identify portal string coordinate in map grid
        // Space grid defines:
        // P1 = Row 2 Col 4, Row 10 Col 24
        // P2 = Row 10 Col 4, Row 14 Col 4
        // Search for the corresponding matching portal partner
        const grid = this.currentMap.grid;
        const targetPortals = [];

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] === 'P' && (r !== currRow || c !== currCol)) {
                    targetPortals.push({ r, c });
                }
            }
        }

        if (targetPortals.length > 0) {
            sound.playDash();
            // Choose one randomly to swap to
            const target = targetPortals[Math.floor(Math.random() * targetPortals.length)];
            this.spawnTagBurst(this.localPlayer.x + this.localPlayer.width/2, this.localPlayer.y + this.localPlayer.height/2);
            this.localPlayer.x = target.c * 32 + 5;
            this.localPlayer.y = target.r * 32 + 2;
            this.localPlayer.vx = 0;
            this.localPlayer.vy = 0;
            this.spawnTagBurst(this.localPlayer.x + this.localPlayer.width/2, this.localPlayer.y + this.localPlayer.height/2);
        }
    }

    burnLocalPlayer() {
        if (this.localPlayer.isDead || this.localPlayer.activeAbilities.phase > 0) return;
        sound.playLavaBurn();
        this.localPlayer.isDead = true;
        this.localPlayer.deadTimer = 1.0; // 1s respawn wait
        this.spawnTagBurst(this.localPlayer.x + this.localPlayer.width/2, this.localPlayer.y + this.localPlayer.height/2);
    }

    updateHazards() {
        // Update volcano fireballs
        this.fireballs = this.fireballs.filter(fb => {
            fb.y += fb.vy;
            
            // Check collision with local player
            if (!this.localPlayer.isDead && this.localPlayer.activeAbilities.phase <= 0) {
                const px = this.localPlayer.x + this.localPlayer.width/2;
                const py = this.localPlayer.y + this.localPlayer.height/2;
                const d = Math.hypot(px - fb.x, py - fb.y);
                if (d < fb.radius + 12) {
                    this.burnLocalPlayer();
                    return false; // delete fireball
                }
            }

            return fb.y > -50;
        });

        // Update icicles
        this.icicles = this.icicles.filter(ic => {
            ic.y += ic.vy;

            // Check collision with local player
            if (!this.localPlayer.isDead && this.localPlayer.activeAbilities.phase <= 0) {
                const px = this.localPlayer.x + this.localPlayer.width/2;
                const py = this.localPlayer.y + this.localPlayer.height/2;
                if (px > ic.x && px < ic.x + ic.width && py > ic.y && py < ic.y + ic.height) {
                    this.rootPlayer(1.2); // Freeze for 1.2s
                    return false; // delete icicle
                }
            }

            return ic.y < this.canvas.height + 50;
        });

        // Check local collision with placed glue traps
        this.glueTraps.forEach(trap => {
            if (trap.owner !== multiplayer.myId && !this.localPlayer.isDead && this.localPlayer.activeAbilities.phase <= 0) {
                const px = this.localPlayer.x + this.localPlayer.width/2;
                const py = this.localPlayer.y + this.localPlayer.height;
                const dist = Math.hypot(px - trap.x, py - trap.y);
                if (dist < 15) {
                    // Trigger trap sync
                    multiplayer.sendGameEvent({
                        type: 'trap_triggered',
                        tx: trap.x,
                        ty: trap.y,
                        victim: multiplayer.myId
                    });
                }
            }

            // Also check bot collision in Test Room
            if (this.inTestRoom && this.botEnabled && this.bot && !this.bot.isDead && this.bot.activeAbilities.phase <= 0) {
                if (trap.owner !== 'npc_bot') {
                    const bx = this.bot.x + this.bot.width / 2;
                    const by = this.bot.y + this.bot.height;
                    const dist = Math.hypot(bx - trap.x, by - trap.y);
                    if (dist < 15) {
                        trap.triggeredByBot = true;
                        this.slowBot(1.5, 0.21);
                    }
                }
            }
        });

        // Filter out traps triggered by the bot
        this.glueTraps = this.glueTraps.filter(t => !t.triggeredByBot);

        // Check local collision with placed web traps
        this.webTraps.forEach(trap => {
            if (trap.owner !== multiplayer.myId && !this.localPlayer.isDead && this.localPlayer.activeAbilities.phase <= 0) {
                const px = this.localPlayer.x + this.localPlayer.width/2;
                const py = this.localPlayer.y + this.localPlayer.height;
                const dist = Math.hypot(px - trap.x, py - trap.y);
                if (dist < 15) {
                    multiplayer.sendGameEvent({
                        type: 'web_triggered',
                        tx: trap.x,
                        ty: trap.y,
                        victim: multiplayer.myId
                    });
                }
            }

            if (this.inTestRoom && this.botEnabled && this.bot && !this.bot.isDead && this.bot.activeAbilities.phase <= 0) {
                if (trap.owner !== 'npc_bot') {
                    const bx = this.bot.x + this.bot.width / 2;
                    const by = this.bot.y + this.bot.height;
                    const dist = Math.hypot(bx - trap.x, by - trap.y);
                    if (dist < 15) {
                        trap.triggeredByBot = true;
                        this.rootBot(0.75);
                    }
                }
            }
        });

        // Filter out traps triggered by the bot
        this.webTraps = this.webTraps.filter(t => !t.triggeredByBot);
    }

    updateDefenseProjectiles() {
        if (this.defenseProjectiles) {
            this.defenseProjectiles = this.defenseProjectiles.filter(proj => {
                proj.x += proj.vx;
                
                if (proj.x < 32 || proj.x > this.canvas.width - 32) return false;

                if (this.checkCollisionAt(proj.x - proj.radius, proj.y - proj.radius, proj.radius * 2, proj.radius * 2)) {
                    return false;
                }

                if (this.inTestRoom && this.botEnabled && this.bot && !this.bot.isDead && proj.owner === multiplayer.myId) {
                    const bx = this.bot.x + this.bot.width / 2;
                    const by = this.bot.y + this.bot.height / 2;
                    const dist = Math.hypot(bx - proj.x, by - proj.y);
                    if (dist < proj.radius + 13) {
                        sound.playTag();
                        this.bot.vx = Math.sign(proj.vx) * 22;
                        this.bot.vy = -6;
                        this.spawnTagBurst(proj.x, proj.y);
                        return false;
                    }
                }

                if (proj.owner !== multiplayer.myId && !this.localPlayer.isDead && this.localPlayer.activeAbilities.phase <= 0) {
                    const lpx = this.localPlayer.x + this.localPlayer.width / 2;
                    const lpy = this.localPlayer.y + this.localPlayer.height / 2;
                    const dist = Math.hypot(lpx - proj.x, lpy - proj.y);
                    if (dist < proj.radius + 13) {
                        sound.playTag();
                        let kbX = Math.sign(proj.vx) * (proj.force || 22);
                        let kbY = -6;
                        if (this.localPlayer.passiveAbility === 'resilience') {
                            kbX *= 0.5;
                            kbY *= 0.5;
                        }
                        this.localPlayer.vx = kbX;
                        this.localPlayer.vy = kbY;
                        this.spawnTagBurst(proj.x, proj.y);
                        return false;
                    }
                }

                return true;
            });
        }
    }

    checkTagCollisions() {
        // The seeker checks contact boxes against all active runners
        for (let pid in this.remotePlayers) {
            const rp = this.remotePlayers[pid];
            if (rp.isDead || rp.activeAbils.phase > 0 || rp.activeAbils.dash > 0 || rp.activeAbils.shield > 0) continue; // Phased / dead / dashing / shielded players cannot be tagged

            if (this.localPlayer.x < rp.x + rp.width &&
                this.localPlayer.x + this.localPlayer.width > rp.x &&
                this.localPlayer.y < rp.y + rp.height &&
                this.localPlayer.y + this.localPlayer.height > rp.y) {
                
                // Tag collision occurred! Send tag sync event
                multiplayer.sendGameEvent({
                    type: 'tag',
                    from: multiplayer.myId,
                    to: pid
                });
                break;
            }
        }
    }

    // --- Drawing / Rendering ---
    draw() {
        // --- Remote player interpolation (runs at native refresh rate for max smoothness) ---
        if (!this.inTestRoom) {
            const now = performance.now();
            for (let pid in this.remotePlayers) {
                const rp = this.remotePlayers[pid];

                // Local simulation physics (running at 60Hz in update()) has already updated rp.x and rp.y.
                // The LERP smoothly guides renderX/renderY to filter out network jitter.
                let targetX = rp.x;
                let targetY = rp.y;

                // Snap on large gaps (teleport ability, respawn)
                const dx = targetX - rp.renderX;
                const dy = targetY - rp.renderY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 220) {
                    rp.renderX = targetX;
                    rp.renderY = targetY;
                } else {
                    // Exponential LERP at native framerate — smooth on any Hz monitor
                    // lerpSpeed=20 → reaches target in ~50ms
                    const realDt = (now - (this._drawLastTime || now)) / 1000;
                    const alpha = 1 - Math.exp(-20 * realDt);
                    rp.renderX += dx * alpha;
                    rp.renderY += dy * alpha;
                }
            }
            this._drawLastTime = now;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background layout color
        const isLightMode = document.body.classList.contains('light-theme');
        let currentBgColor = this.currentMap.bgColor;
        let currentTileColor = this.currentMap.tileColor;
        let gridStrokeStyle = "rgba(255, 255, 255, 0.03)";

        if (isLightMode && this.currentMapKey === 'classic') {
            currentBgColor = "#e9ecef";
            currentTileColor = "#adb5bd";
            gridStrokeStyle = "rgba(0, 0, 0, 0.03)";
        }

        this.ctx.fillStyle = currentBgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grids background (subtle styling)
        this.ctx.strokeStyle = gridStrokeStyle;
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw Map Tiles
        const grid = this.currentMap.grid;
        const tw = 32;
        const th = 32;

        this.ctx.fillStyle = currentTileColor;
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const tile = grid[r][c];
                
                if (tile === '#') {
                    // Standard box tile
                    this.ctx.fillStyle = currentTileColor;
                    this.ctx.fillRect(c * tw, r * th, tw, th);
                    this.ctx.strokeStyle = isLightMode ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.15)";
                    this.ctx.strokeRect(c * tw + 1, r * th + 1, tw - 2, th - 2);
                } else if (tile === 'I') {
                    // Ice block
                    this.ctx.fillStyle = "#8fbdec";
                    this.ctx.fillRect(c * tw, r * th, tw, th);
                    this.ctx.fillStyle = "rgba(255,255,255,0.4)";
                    this.ctx.fillRect(c * tw + 2, r * th + 2, tw - 4, 6);
                } else if (tile === 'L') {
                    // Lava blocks bubbling look
                    this.ctx.fillStyle = "#e03131";
                    this.ctx.fillRect(c * tw, r * th, tw, th);
                    // Bubble hints
                    this.ctx.fillStyle = "#f76707";
                    const tVal = Date.now() * 0.005;
                    this.ctx.fillRect(c * tw + 6 + Math.sin(tVal + c)*3, r * th + 8, 4, 4);
                } else if (tile === 'T') {
                    // Trampoline mushroom
                    this.ctx.fillStyle = "#ff922b";
                    this.ctx.fillRect(c * tw + 2, r * th + 16, tw - 4, th - 16);
                    this.ctx.fillStyle = "#f03e3e";
                    this.ctx.fillRect(c * tw, r * th + 8, tw, 8);
                } else if (tile === 'P') {
                    // Space portal vortex drawing
                    this.ctx.fillStyle = "#3b5bdb";
                    this.ctx.beginPath();
                    const radius = 10 + Math.sin(Date.now() * 0.01) * 3;
                    this.ctx.arc(c * tw + 16, r * th + 16, radius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        // Draw Glue Traps flat on the ground
        this.glueTraps.forEach(trap => {
            const isOwn = (trap.owner === multiplayer.myId);
            this.ctx.fillStyle = isOwn ? "rgba(55, 178, 77, 0.85)" : "rgba(224, 49, 49, 0.85)"; // Green for own, Red for enemy
            this.ctx.fillRect(trap.x - 16, trap.y - 4, 32, 4);
        });

        // Draw temporary walls
        if (this.temporaryWalls) {
            this.temporaryWalls.forEach(wall => {
                this.ctx.save();
                this.ctx.fillStyle = "rgba(92, 124, 250, 0.75)"; // Semi-transparent blue energy barrier
                this.ctx.strokeStyle = "rgba(92, 124, 250, 0.95)";
                this.ctx.lineWidth = 2;
                this.drawRoundedRect(wall.x, wall.y, wall.width, wall.height, 4);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
            });
        }

        // Draw shockwaves
        if (this.shockwaves) {
            this.shockwaves.forEach(sw => {
                this.ctx.save();
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${sw.life / sw.maxLife})`;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            });
        }

        // Draw dash shadows
        if (this.dashShadows) {
            this.dashShadows.forEach(s => {
                this.ctx.save();
                this.ctx.globalAlpha = (s.life / s.maxLife) * 0.4;
                const isSeekerRender = (s.activeAbils && s.activeAbils.disguise > 0) ? !s.isSeeker : s.isSeeker;
                const strokeColor = isSeekerRender ? "#e03131" : "#1a1a1a";
                this.ctx.fillStyle = s.color;
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = 2;
                this.drawRoundedRect(s.x, s.y, s.width, s.height, 6);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
            });
        }

        // Draw Map Items
        if (this.mapItems) {
            this.mapItems.forEach(item => {
                this.ctx.save();
                const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.15;
                const radius = 14 * pulse;
                
                let color = "#e03131"; 
                let symbol = "?";
                if (item.type === 'speed2x') {
                    color = "#fab005"; 
                    symbol = "⚡";
                } else if (item.type === 'cooldown_reset') {
                    color = "#15aabf"; 
                    symbol = "↻";
                } else if (item.type === 'swap') {
                    color = "#be4bdb"; 
                    symbol = "⇆";
                }
                
                // Glow effect
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = 15;
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Draw white border
                this.ctx.strokeStyle = "rgba(255,255,255,0.8)";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Draw symbol
                this.ctx.shadowBlur = 0; 
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = "bold 14px sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(symbol, item.x, item.y);
                this.ctx.restore();
            });
        }

        // Draw Remote Players
        for (let pid in this.remotePlayers) {
            const rp = this.remotePlayers[pid];
            this.drawPlayer(rp);
        }

        // Draw Bot NPC if in test room
        if (this.inTestRoom && this.botEnabled && this.bot && !this.bot.isDead) {
            const tempBotForRendering = Object.assign({}, this.bot);
            tempBotForRendering.activeAbils = this.bot.activeAbilities || { invis: 0, phase: 0 };
            this.drawPlayer(tempBotForRendering);
        }

        // Draw Local Player
        if (!this.localPlayer.isDead) {
            const tempPlayerForRendering = Object.assign({}, this.localPlayer);
            tempPlayerForRendering.activeAbils = this.localPlayer.activeAbilities || { invis: 0, phase: 0 };
            // Draw direct values
            tempPlayerForRendering.renderX = this.localPlayer.x;
            tempPlayerForRendering.renderY = this.localPlayer.y;
            this.drawPlayer(tempPlayerForRendering);
        }

        // Draw Decoys
        this.decoys.forEach(dec => {
            const tempDecoyForRendering = Object.assign({}, dec);
            tempDecoyForRendering.renderX = dec.renderX !== undefined ? dec.renderX : dec.x;
            tempDecoyForRendering.renderY = dec.renderY !== undefined ? dec.renderY : dec.y;
            tempDecoyForRendering.activeAbils = { invis: 0, phase: 0 };
            
            const isSeeker = this.isDecoyOwnerSeeker(dec);
            tempDecoyForRendering.isSeeker = isSeeker;
            tempDecoyForRendering.isDead = false;
            if (isSeeker) {
                tempDecoyForRendering.color = "#e03131"; 
            }
            this.drawPlayer(tempDecoyForRendering);
        });

        // Draw Web Traps
        if (this.webTraps) {
            this.webTraps.forEach(trap => {
                const isOwn = (trap.owner === multiplayer.myId);
                this.ctx.save();
                this.ctx.strokeStyle = isOwn ? "rgba(77, 171, 247, 0.85)" : "rgba(224, 49, 49, 0.85)";
                this.ctx.lineWidth = 1.5;
                const wx = trap.x;
                const wy = trap.y - 2;
                
                this.ctx.beginPath();
                this.ctx.moveTo(wx - 16, wy);
                this.ctx.lineTo(wx + 16, wy);
                this.ctx.moveTo(wx - 12, wy - 8);
                this.ctx.lineTo(wx + 12, wy - 8);
                
                this.ctx.moveTo(wx - 16, wy);
                this.ctx.quadraticCurveTo(wx, wy - 12, wx + 16, wy);
                this.ctx.moveTo(wx - 12, wy - 8);
                this.ctx.quadraticCurveTo(wx, wy - 16, wx + 12, wy - 8);
                
                this.ctx.moveTo(wx, wy);
                this.ctx.lineTo(wx, wy - 16);
                this.ctx.moveTo(wx - 8, wy);
                this.ctx.lineTo(wx - 12, wy - 12);
                this.ctx.moveTo(wx + 8, wy);
                this.ctx.lineTo(wx + 12, wy - 12);
                this.ctx.stroke();
                this.ctx.restore();
            });
        }

        // Draw defense projectiles
        if (this.defenseProjectiles) {
            this.defenseProjectiles.forEach(proj => {
                this.ctx.save();
                this.ctx.fillStyle = "#4dabf7"; // Bright energy blue
                this.ctx.shadowColor = "#4dabf7";
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // White core
                this.ctx.fillStyle = "#ffffff";
                this.ctx.beginPath();
                this.ctx.arc(proj.x, proj.y, proj.radius * 0.4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        }

        // Draw Bushes on top of players to hide them
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c] === 'B') {
                    this.ctx.fillStyle = this.currentMap.bushColor || "rgba(55, 178, 77, 0.4)";
                    this.ctx.fillRect(c * tw, r * th, tw, th);
                }
            }
        }

        // Draw volcano Fireballs
        this.ctx.fillStyle = "#ff6b6b";
        this.fireballs.forEach(fb => {
            this.ctx.beginPath();
            this.ctx.arc(fb.x, fb.y, fb.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = "#fcc419";
            this.ctx.beginPath();
            this.ctx.arc(fb.x, fb.y, fb.radius - 4, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw Ice Icicles
        this.ctx.fillStyle = "#a5d8ff";
        this.icicles.forEach(ic => {
            this.ctx.beginPath();
            this.ctx.moveTo(ic.x + ic.width / 2, ic.y + ic.height);
            this.ctx.lineTo(ic.x, ic.y);
            this.ctx.lineTo(ic.x + ic.width, ic.y);
            this.ctx.closePath();
            this.ctx.fill();
        });

        // Draw particle trails
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw reaction floating emojis
        this.floatingEmojis.forEach(e => {
            this.ctx.font = "24px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText(e.emoji, e.x, e.y);
        });

        // Time Stop screen overlay effect
        if (this.timeStoppedBy) {
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.strokeStyle = "#ff0000";
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Blindness overlay mask effect
        if (this.localPlayer.blindnessTimer > 0) {
            this.ctx.save();
            const px = this.localPlayer.x + this.localPlayer.width / 2;
            const py = this.localPlayer.y + this.localPlayer.height / 2;
            const radius = 60; // Overhauled blindness mask to 60px visibility radius

            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.arc(px, py, radius, 0, Math.PI * 2, true);
            this.ctx.closePath();

            this.ctx.fillStyle = "rgba(0, 0, 0, 1.0)"; // Overhauled to 100% black
            this.ctx.fill();

            const grad = this.ctx.createRadialGradient(px, py, radius - 15, px, py, radius);
            grad.addColorStop(0, "rgba(0, 0, 0, 0)");
            grad.addColorStop(1, "rgba(0, 0, 0, 1.0)");
            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(px, py, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Draw Round Over Standings on Canvas
        if (this.showRoundOverStandings) {
            this.ctx.fillStyle = "rgba(24, 25, 30, 0.9)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.font = "bold 26px var(--font-primary)";
            this.ctx.fillStyle = "var(--color-warning)";
            this.ctx.textAlign = "center";
            this.ctx.fillText(`Runde ${this.currentRound} von ${this.maxRounds} beendet!`, this.canvas.width / 2, 80);

            this.ctx.font = "16px var(--font-primary)";
            this.ctx.fillStyle = "var(--text-muted)";
            const seekerPlayer = multiplayer.players[this.seekerId];
            this.ctx.fillText(seekerPlayer ? `${seekerPlayer.name} war der Fänger!` : "", this.canvas.width / 2, 115);

            this.ctx.font = "bold 20px var(--font-primary)";
            this.ctx.fillStyle = "var(--text-main)";
            this.ctx.fillText("Spieler-Standings (Überlebte Runden):", this.canvas.width / 2, 170);

            // Draw player list ranked by score
            const sortedPlayers = Object.keys(multiplayer.players).map(pid => {
                return {
                    id: pid,
                    name: multiplayer.players[pid].name,
                    color: multiplayer.players[pid].color,
                    score: this.playerScores[pid] || 0
                };
            }).sort((a, b) => b.score - a.score);

            let startY = 220;
            sortedPlayers.forEach((sp, idx) => {
                this.ctx.fillStyle = sp.color;
                this.ctx.fillRect(this.canvas.width / 2 - 180, startY - 14, 16, 16);

                this.ctx.font = "bold 16px var(--font-primary)";
                this.ctx.fillStyle = "var(--text-main)";
                this.ctx.textAlign = "left";
                this.ctx.fillText(`${idx + 1}. ${sp.name}`, this.canvas.width / 2 - 150, startY);

                this.ctx.textAlign = "right";
                this.ctx.fillText(`${sp.score} / ${this.currentRound}`, this.canvas.width / 2 + 180, startY);

                startY += 30;
            });

            this.ctx.font = "bold 16px var(--font-primary)";
            this.ctx.fillStyle = "var(--color-primary)";
            this.ctx.textAlign = "center";
            this.ctx.fillText(`Nächste Runde startet in ${Math.ceil(this.roundOverCountdown)} Sekunden...`, this.canvas.width / 2, this.canvas.height - 60);
        }
    }

    drawPlayer(p) {
        const activeAbils = p.activeAbils || p.activeAbilities || { invis: 0, phase: 0, disguise: 0, shrink: 0, shield: 0 };
        const isInvis = activeAbils.invis > 0;
        const isPhased = activeAbils.phase > 0;
        const isDisguised = activeAbils.disguise > 0;
        const isShrunk = activeAbils.shrink > 0;
        const isShielded = activeAbils.shield > 0;

        // Skip drawing entirely if invisible (except if local player rendering)
        const isMe = p.name === this.localPlayer.name;
        if (isInvis && !isMe) return;

        this.ctx.save();

        // Transparency properties
        if (isInvis && isMe) {
            this.ctx.globalAlpha = 0.35; // See-through to myself
        } else if (isPhased) {
            this.ctx.globalAlpha = 0.6;
        }

        // Spiegelbild role visual swap
        const isSeekerRender = isDisguised ? !p.isSeeker : p.isSeeker;

        // Shrink visual size
        const renderW = isShrunk ? 13 : p.width;
        const renderH = isShrunk ? 13 : p.height;

        // Apply walk bounce (running bounce animation removed)
        let drawY = p.renderY;

        // Draw player container box
        const strokeColor = isSeekerRender ? "#e03131" : "#1a1a1a";
        this.ctx.fillStyle = p.color;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = isShrunk ? 1.5 : 3;

        // Rounded box helper
        this.drawRoundedRect(p.renderX, drawY, renderW, renderH, isShrunk ? 3 : 6);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw active shield bubble
        if (isShielded) {
            this.ctx.save();
            this.ctx.strokeStyle = "rgba(77, 171, 247, 0.9)";
            this.ctx.fillStyle = "rgba(77, 171, 247, 0.15)";
            this.ctx.lineWidth = 3;
            
            this.ctx.beginPath();
            const shieldRadius = Math.max(renderW, renderH) * 0.85;
            this.ctx.arc(p.renderX + renderW / 2, drawY + renderH / 2, shieldRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Draw Phased/Shadow aura highlights
        if (isPhased) {
            this.ctx.save();
            this.ctx.strokeStyle = "#cc5de8";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(p.renderX - 3, drawY - 3, renderW + 6, renderH + 6);
            this.ctx.restore();
        }

        // Draw face/eyes (look left/right depending on velocity facing)
        const eyeOffset = p.facing === 1 ? (isShrunk ? 1 : 2) : (isShrunk ? -1 : -2);
        this.ctx.fillStyle = strokeColor;

        const leftEyeX = p.renderX + renderW * 0.25 + eyeOffset;
        const rightEyeX = p.renderX + renderW * 0.65 + eyeOffset;
        const eyeY = drawY + renderH * 0.35;

        // Expressions
        if (isSeekerRender) {
            // Angry angled eyebrows/eyes
            this.ctx.beginPath();
            this.ctx.moveTo(leftEyeX - (isShrunk ? 1 : 2), eyeY - (isShrunk ? 1 : 2));
            this.ctx.lineTo(leftEyeX + (isShrunk ? 1.5 : 3), eyeY + (isShrunk ? 0.5 : 1));
            this.ctx.moveTo(rightEyeX + (isShrunk ? 1 : 2), eyeY - (isShrunk ? 1 : 2));
            this.ctx.lineTo(rightEyeX - (isShrunk ? 1.5 : 3), eyeY + (isShrunk ? 0.5 : 1));
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = isShrunk ? 1.25 : 2.5;
            this.ctx.stroke();

            // Angry eye dots
            this.ctx.beginPath();
            this.ctx.arc(leftEyeX, eyeY + (isShrunk ? 1.5 : 3), isShrunk ? 1.25 : 2.5, 0, Math.PI*2);
            this.ctx.arc(rightEyeX, eyeY + (isShrunk ? 1.5 : 3), isShrunk ? 1.25 : 2.5, 0, Math.PI*2);
            this.ctx.fill();
        } else if (p.isDead) {
            // Dead / Stunned "X" eyes
            this.ctx.font = isShrunk ? "bold 6px sans-serif" : "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("×", leftEyeX, eyeY + (isShrunk ? 1 : 2));
            this.ctx.fillText("×", rightEyeX, eyeY + (isShrunk ? 1 : 2));
        } else {
            // Normal rounded eyes
            this.ctx.beginPath();
            let eyeH = isShrunk ? 2 : 4;
            const seekerDist = this.getDistToSeeker(p);
            
            if (seekerDist < 120 && !p.isSeeker) {
                // Scared circular wide eyes
                this.ctx.arc(leftEyeX, eyeY, isShrunk ? 1.5 : 3, 0, Math.PI*2);
                this.ctx.arc(rightEyeX, eyeY, isShrunk ? 1.5 : 3, 0, Math.PI*2);
            } else {
                // Normal blink cycle
                const blink = Math.sin(Date.now() * 0.005) > 0.97;
                if (blink) eyeH = 1;
                this.ctx.ellipse(leftEyeX, eyeY, isShrunk ? 1 : 2, eyeH, 0, 0, Math.PI*2);
                this.ctx.ellipse(rightEyeX, eyeY, isShrunk ? 1 : 2, eyeH, 0, 0, Math.PI*2);
            }
            this.ctx.fill();
        }

        // Draw Player name above head
        this.ctx.globalAlpha = 1.0;
        this.ctx.font = "bold 9px sans-serif";
        this.ctx.fillStyle = "#f8f9fa";
        this.ctx.textAlign = "center";
        
        let labelText = p.name;
        if (isSeekerRender) labelText = `👹 ${p.name}`;
        
        this.ctx.fillText(labelText, p.renderX + renderW/2, drawY - 8);

        // Draw active freeze root details
        if (isMe && this.localPlayer.isRooted) {
            this.ctx.fillStyle = "rgba(165, 216, 255, 0.45)";
            this.ctx.fillRect(p.renderX - 2, drawY + renderH - 8, renderW + 4, 10);
        }

        this.ctx.restore();
    }

    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    getDistToSeeker(p) {
        let seekerPos = null;
        let seekerInvis = false;

        if (this.inTestRoom) {
            if (this.botEnabled && this.bot && !this.bot.isDead) {
                if (this.bot.isSeeker) {
                    seekerPos = this.bot;
                    seekerInvis = this.bot.activeAbilities && this.bot.activeAbilities.invis > 0;
                } else if (this.localPlayer.isSeeker) {
                    seekerPos = this.localPlayer;
                    seekerInvis = this.localPlayer.activeAbilities.invis > 0;
                }
            } else {
                if (this.localPlayer.isSeeker) {
                    seekerPos = this.localPlayer;
                    seekerInvis = this.localPlayer.activeAbilities.invis > 0;
                }
            }
        } else {
            if (!this.seekerId) return 9999;
            if (this.seekerId === multiplayer.myId) {
                seekerPos = this.localPlayer;
                seekerInvis = this.localPlayer.activeAbilities.invis > 0;
            } else if (this.remotePlayers[this.seekerId]) {
                seekerPos = this.remotePlayers[this.seekerId];
                seekerInvis = (seekerPos.activeAbils && seekerPos.activeAbils.invis > 0) || 
                              (seekerPos.activeAbilities && seekerPos.activeAbilities.invis > 0);
            }
        }

        if (!seekerPos || seekerInvis) return 9999;
        return Math.hypot((p.x - seekerPos.x), (p.y - seekerPos.y));
    }

    // --- Particle Spawn Helpers ---
    spawnDashTrail(x1, y1, x2, y2) {
        const steps = 6;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = x1 + (x2 - x1) * t;
            const py = y1 + (y2 - y1) * t;
            this.particles.push({
                x: px + 10,
                y: py + 15,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 6 + Math.random() * 4,
                color: "rgba(255, 255, 255, 0.4)",
                life: 0.3,
                maxLife: 0.3
            });
        }
    }

    spawnTagBurst(x, y) {
        const count = 16;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 5 + Math.random() * 5,
                color: this.localPlayer.color,
                life: 0.5,
                maxLife: 0.5
            });
        }
    }

    spawnFloatingEmoji(senderId, emoji) {
        let px = 100;
        let py = 100;

        if (senderId === multiplayer.myId) {
            px = this.localPlayer.x + this.localPlayer.width / 2;
            py = this.localPlayer.y - 12;
        } else if (this.remotePlayers[senderId]) {
            px = this.remotePlayers[senderId].renderX + this.remotePlayers[senderId].width / 2;
            py = this.remotePlayers[senderId].renderY - 12;
        }

        this.floatingEmojis.push({
            x: px,
            y: py,
            emoji: emoji,
            life: 1.8 // remains floating for 1.8 seconds
        });
    }

    // --- Match End & Scoreboard Results ---
    endRound() {
        this.isPlaying = false;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        sound.playWin();

        // Calculate scores for this round
        for (let pid in multiplayer.players) {
            if (this.playerScores[pid] === undefined) {
                this.playerScores[pid] = 0;
            }
            if (pid !== this.seekerId) {
                this.playerScores[pid]++;
            }
        }

        if (this.currentRound < this.maxRounds) {
            // Show Standings overlay for 3 seconds, loop keeps ticking
            this.roundOverCountdown = 3.0;
            this.showRoundOverStandings = true;
            this.isPlaying = true; // Let update() run to tick the countdown
        } else {
            // End of rounds! Show final screen
            let topScore = -1;
            let overallWinner = null;
            for (let pid in multiplayer.players) {
                const s = this.playerScores[pid] || 0;
                if (s > topScore) {
                    topScore = s;
                    overallWinner = multiplayer.players[pid];
                }
            }

            document.getElementById('winner-name-display').textContent = overallWinner ? `${overallWinner.name} (${topScore} Siege)` : "Niemand";
            
            const avatarBox = document.getElementById('game-over-avatar');
            avatarBox.style.backgroundColor = overallWinner ? overallWinner.color : "#5c7cfa";
            avatarBox.querySelector('.player-eyes').className = "player-eyes normal";

            // Draw Scoreboard list
            const board = document.getElementById('game-over-scoreboard');
            board.innerHTML = '';

            // Sort players by score
            const sortedPlayers = Object.keys(multiplayer.players).map(pid => {
                return {
                    name: multiplayer.players[pid].name,
                    color: multiplayer.players[pid].color,
                    score: this.playerScores[pid] || 0
                };
            }).sort((a, b) => b.score - a.score);

            sortedPlayers.forEach((sp, idx) => {
                const row = document.createElement('div');
                row.className = `scoreboard-row ${idx === 0 ? 'is-winner' : ''}`;
                if (idx === 0) row.style.borderColor = "var(--color-success)";
                row.innerHTML = `
                    <span class="scoreboard-rank">#${idx + 1}</span>
                    <div class="player-avatar-box" style="background-color: ${sp.color}; width: 26px; height: 26px; border-width: 2px;">
                        <div class="player-eyes" style="top: 20%;"><div class="eye" style="width:3px; height:5px;"></div><div class="eye" style="width:3px; height:5px;"></div></div>
                    </div>
                    <span class="scoreboard-row-name">${sp.name}</span>
                    <span class="scoreboard-role runner" style="background-color: rgba(55,178,77,0.1); color: var(--color-success);">${sp.score} / ${this.maxRounds} Siege</span>
                `;
                board.appendChild(row);
            });

            const rematchBtn = document.getElementById('rematch-btn');
            if (rematchBtn) {
                if (multiplayer.isHost) {
                    rematchBtn.removeAttribute('disabled');
                } else {
                    rematchBtn.setAttribute('disabled', 'true');
                }
            }

            this.showScreen('screen-game-over');
        }
    }
    // --- Test Room & NPC Bot implementation ---
    enterTestRoom() {
        this.inTestRoom = true;
        this.activeScreen = 'screen-game';
        
        // Setup default abilities for player if not chosen
        if (this.localPlayer.abilities.length === 0) {
            this.localPlayer.abilities = ['teleport', 'moveplus'];
        }
        
        // Reset player states
        this.localPlayer.vx = 0;
        this.localPlayer.vy = 0;
        this.localPlayer.cooldowns = [0, 0, 0];
        this.localPlayer.activeAbilities.invis = 0;
        this.localPlayer.activeAbilities.phase = 0;
        this.localPlayer.activeAbilities.shield = 0;
        this.localPlayer.gravityDirection = 1;
        this.localPlayer.isDead = false;
        this.localPlayer.blindnessTimer = 0;
        this.localPlayer.keysInvertedTimer = 0;
        this.localPlayer.isMindControlled = false;
        this.localPlayer.mindControlTimer = 0;
        this.isMindControlling = false;
        this.mindControlTargetId = null;
        this.mindControlTimer = 0;
        this.controlledKeys = null;
        this.localPlayer.speedBuffTimer = 0;
        this.testRoomItemTimer = 0;
        
        this.tagImmunityTimer = 0;
        this.timeStoppedBy = null;
        this.timeStopDuration = 0;

        // Reset arrays
        this.fireballs = [];
        this.icicles = [];
        this.glueTraps = [];
        this.webTraps = [];
        this.particles = [];
        this.floatingEmojis = [];
        this.decoys = [];
        this.defenseProjectiles = [];
        this.mapItems = [];
        this.spawnedIntervals = [false, false, false];
        this.roundItemsOrder = ['speed2x', 'cooldown_reset', 'swap'].sort(() => 0.5 - Math.random());

        // Set map to classic map for testing
        this.setMap('classic');
        this.respawnPlayer(this.localPlayer);

        // UI Setup
        document.getElementById('hud-mode').textContent = "Testraum";
        document.getElementById('hud-map').textContent = this.currentMap.name;
        document.getElementById('hud-timer').textContent = "∞";

        // Update HUD slot representations
        this.updateHUDAbilities();

        // Setup Test Room Panel switches
        document.getElementById('test-bot-enable-chk').checked = this.botEnabled;
        document.getElementById('test-bot-ai-chk').checked = true;
        document.getElementById('test-bot-abilities-chk').checked = true;

        // Show/hide floating panel
        document.getElementById('test-room-panel').classList.remove('hidden');

        // Spawn Bot NPC
        if (this.botEnabled) {
            this.spawnBot();
        }

        this.updateLobbyAbilityButtons();

        // Show screen game
        this.showScreen('screen-game');
        
        // Update Seeker name on HUD
        const newSeekerName = this.bot && this.bot.isSeeker ? this.bot.name : this.localPlayer.name;
        document.getElementById('hud-seeker-name').textContent = newSeekerName;
        document.getElementById('hud-seeker-name').className = "value danger";
    }

    leaveTestRoom() {
        this.inTestRoom = false;
        this.bot = null;
        document.getElementById('test-room-panel').classList.add('hidden');
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        this.showScreen('screen-menu');
    }

    spawnBot() {
        this.bot = {
            id: 'npc_bot',
            name: 'NPC Bot',
            color: '#e03131',
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            width: 26,
            height: 26,
            facing: -1,
            isSeeker: true, // Bot starts as Seeker to chase player
            isDead: false,
            deadTimer: 0,
            abilities: ['timestop', 'blindness'],
            cooldowns: [5.0, 8.0],
            activeAbilities: { invis: 0, phase: 0, dash: 0, gravity: 0, disguise: 0, shrink: 0, shield: 0 },
            gravityDirection: 1,
            doubleJumpAvailable: true,
            isRooted: false,
            rootTimer: 0,
            blindnessTimer: 0,
            keysInvertedTimer: 0,
            isMindControlled: false,
            mindControlTimer: 0,
            isSlowed: false,
            slowTimer: 0,
            slowMultiplier: 1.0,
            renderX: 0,
            renderY: 0
        };
        
        const solids = [];
        const grid = this.currentMap.grid;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === '#' || grid[row][col] === 'I') {
                    if (row > 0 && grid[row-1][col] === ' ') {
                        const tx = col * 32 + 5;
                        const ty = row * 32 + 2;
                        const dist = Math.hypot(tx - this.localPlayer.x, ty - this.localPlayer.y);
                        if (dist > 250) {
                            solids.push({ col, row: row - 1 });
                        }
                    }
                }
            }
        }
        
        if (solids.length > 0) {
            const pick = solids[Math.floor(Math.random() * solids.length)];
            this.bot.x = pick.col * 32 + 5;
            this.bot.y = pick.row * 32 + 2;
        } else {
            this.bot.x = 600;
            this.bot.y = 100;
        }
        
        this.bot.renderX = this.bot.x;
        this.bot.renderY = this.bot.y;
    }

    updateBot(dt) {
        if (this.bot.isDead) {
            this.bot.deadTimer -= dt;
            if (this.bot.deadTimer <= 0) {
                this.bot.isDead = false;
                this.spawnBot();
            }
            return;
        }

        for (let b in this.bot.activeAbilities) {
            if (this.bot.activeAbilities[b] > 0) {
                this.bot.activeAbilities[b] -= dt;
            }
        }

        if (this.bot.isRooted) {
            this.bot.rootTimer -= dt;
            if (this.bot.rootTimer <= 0) this.bot.isRooted = false;
        }
        if (this.bot.blindnessTimer > 0) {
            this.bot.blindnessTimer = Math.max(0, this.bot.blindnessTimer - dt);
        }

        if (this.bot.cooldowns[0] > 0) this.bot.cooldowns[0] -= dt;
        if (this.bot.cooldowns[1] > 0) this.bot.cooldowns[1] -= dt;

        this.updateBotPhysics(dt);

        this.bot.renderX += (this.bot.x - this.bot.renderX) * 0.25;
        this.bot.renderY += (this.bot.y - this.bot.renderY) * 0.25;

        const abilsEnabled = document.getElementById('test-bot-abilities-chk').checked;
        if (abilsEnabled && !this.bot.isRooted && !this.timeStoppedBy) {
            const dist = Math.hypot(this.localPlayer.x - this.bot.x, this.localPlayer.y - this.bot.y);
            
            if (this.bot.cooldowns[0] <= 0) {
                if (this.bot.isSeeker && dist < 220) {
                    this.castBotAbilityDirectly('timestop');
                    this.bot.cooldowns[0] = 16.0;
                } else if (!this.bot.isSeeker && dist < 120) {
                    this.castBotAbilityDirectly('timestop');
                    this.bot.cooldowns[0] = 16.0;
                }
            }

            if (this.bot.cooldowns[1] <= 0) {
                if (this.bot.isSeeker && dist < 300) {
                    this.castBotAbilityDirectly('blindness');
                    this.bot.cooldowns[1] = 12.0;
                }
            }
        }
    }

    updateBotPhysics(dt) {
        if (this.bot.isRooted) return;

        if (this.bot.speedBuffTimer === undefined) this.bot.speedBuffTimer = 0;
        if (this.bot.speedBuffTimer > 0) {
            this.bot.speedBuffTimer -= dt;
        }

        this.bot.vy += this.gravity * this.bot.gravityDirection;
        this.bot.vx *= this.friction;

        const aiEnabled = document.getElementById('test-bot-ai-chk').checked;
        if (this.bot.isMindControlled) {
            let targetDir = 0;
            if (this.keys['ArrowLeft']) targetDir = -1;
            if (this.keys['ArrowRight']) targetDir = 1;

            if (this.localPlayer.keysInvertedTimer > 0) {
                targetDir *= -1;
            }

            const botSlowMult = this.bot.isSlowed ? this.bot.slowMultiplier : 1.0;
            const botSpeedBuffMult = (this.bot.speedBuffTimer > 0) ? 2.0 : 1.0;
            const botAcc = 0.45 * botSlowMult * botSpeedBuffMult;
            this.bot.vx += targetDir * botAcc;

            const maxSpeed = 4.5 * botSlowMult * botSpeedBuffMult;
            if (Math.abs(this.bot.vx) > maxSpeed) {
                this.bot.vx = Math.sign(this.bot.vx) * maxSpeed;
            }

            if (Math.abs(this.bot.vx) > 0.1) {
                this.bot.facing = Math.sign(this.bot.vx);
            }

            const ground = this.isBotOnGround();
            if (ground) {
                let shouldJump = false;
                const movingInDirection = Math.sign(this.bot.vx) === targetDir;
                if (movingInDirection && Math.abs(this.bot.vx) < 0.25 && targetDir !== 0) {
                    shouldJump = true;
                }

                if (this.jumpPressed) {
                    shouldJump = true;
                }

                if (shouldJump) {
                    this.bot.vy = -7.2 * this.bot.gravityDirection;
                    this.bot.doubleJumpAvailable = true;
                }
            }
        } else if (aiEnabled && !this.localPlayer.isDead) {
            let targetDir = 0;
            const diffX = this.localPlayer.x - this.bot.x;
            const playerInvis = this.localPlayer.activeAbilities && this.localPlayer.activeAbilities.invis > 0;
            
            if (playerInvis) {
                targetDir = 0;
            } else {
                if (this.bot.isSeeker) {
                    if (diffX > 8) targetDir = 1;
                    else if (diffX < -8) targetDir = -1;
                } else {
                    if (diffX > 0) targetDir = -1;
                    else if (diffX <= 0) targetDir = 1;
                }
            }

            if (this.bot.keysInvertedTimer > 0) {
                targetDir *= -1;
            }

            const botSlowMult = this.bot.isSlowed ? this.bot.slowMultiplier : 1.0;
            const botSpeedBuffMult = (this.bot.speedBuffTimer > 0) ? 2.0 : 1.0;
            const botAcc = 0.45 * (this.bot.isSeeker ? 1.15 : 1.0) * botSlowMult * botSpeedBuffMult;
            this.bot.vx += targetDir * botAcc;
            
            const maxSpeed = 4.5 * (this.bot.isSeeker ? 1.15 : 1.0) * botSlowMult * botSpeedBuffMult;
            if (Math.abs(this.bot.vx) > maxSpeed) {
                this.bot.vx = Math.sign(this.bot.vx) * maxSpeed;
            }

            if (Math.abs(this.bot.vx) > 0.1) {
                this.bot.facing = Math.sign(this.bot.vx);
            }

            const ground = this.isBotOnGround();
            if (ground) {
                let shouldJump = false;
                const movingInDirection = Math.sign(this.bot.vx) === targetDir;
                if (movingInDirection && Math.abs(this.bot.vx) < 0.25 && targetDir !== 0) {
                    shouldJump = true;
                }
                
                const diffY = this.localPlayer.y - this.bot.y;
                if (!playerInvis && this.bot.isSeeker && diffY < -40 && Math.abs(diffX) < 120 && Math.random() < 0.08) {
                    shouldJump = true;
                }

                if (!this.bot.isSeeker && !playerInvis && Math.random() < 0.015) {
                    shouldJump = true;
                }

                if (shouldJump) {
                    this.bot.vy = -7.2 * this.bot.gravityDirection;
                    this.bot.doubleJumpAvailable = true;
                }
            } else if (this.bot.doubleJumpAvailable && Math.random() < 0.01 && this.bot.vy > 0) {
                this.bot.vy = -5.8 * this.bot.gravityDirection;
                this.bot.doubleJumpAvailable = false;
                this.spawnDashTrail(this.bot.x, this.bot.y, this.bot.x, this.bot.y + 15);
            }
        }

        this.bot.x += this.bot.vx;
        this.resolveBotCollisions('horizontal');

        this.bot.y += this.bot.vy;
        this.resolveBotCollisions('vertical');

        if (this.bot.x < 0) this.bot.x = 0;
        if (this.bot.x > this.canvas.width - this.bot.width) this.bot.x = this.canvas.width - this.bot.width;
        if (this.bot.y < 0) this.bot.y = 0;
        if (this.bot.y > this.canvas.height - this.bot.height) {
            this.bot.y = this.canvas.height - this.bot.height;
            this.bot.vy = 0;
            if (this.currentMapKey === 'volcano') {
                this.spawnBot();
            }
        }
    }

    resolveBotCollisions(dir) {
        const grid = this.currentMap.grid;
        const tw = 32;
        const th = 32;

        const colStart = Math.floor(this.bot.x / tw);
        const colEnd = Math.floor((this.bot.x + this.bot.width) / tw);
        const rowStart = Math.floor(this.bot.y / th);
        const rowEnd = Math.floor((this.bot.y + this.bot.height) / th);

        for (let r = rowStart; r <= rowEnd; r++) {
            if (r < 0 || r >= grid.length) continue;
            for (let c = colStart; c <= colEnd; c++) {
                if (c < 0 || c >= grid[r].length) continue;
                const tile = grid[r][c];
                if (tile === '#' || tile === 'I') {
                    const tileX = c * tw;
                    const tileY = r * th;

                    if (this.bot.x < tileX + tw &&
                        this.bot.x + this.bot.width > tileX &&
                        this.bot.y < tileY + th &&
                        this.bot.y + this.bot.height > tileY) {
                        
                        if (dir === 'horizontal') {
                            if (this.bot.vx > 0) {
                                this.bot.x = tileX - this.bot.width;
                            } else if (this.bot.vx < 0) {
                                this.bot.x = tileX + tw;
                            }
                            this.bot.vx = 0;
                        } else if (dir === 'vertical') {
                            if (this.bot.vy > 0) {
                                this.bot.y = tileY - this.bot.height;
                                if (this.bot.gravityDirection === 1) this.bot.doubleJumpAvailable = true;
                            } else if (this.bot.vy < 0) {
                                this.bot.y = tileY + th;
                                if (this.bot.gravityDirection === -1) this.bot.doubleJumpAvailable = true;
                            }
                            this.bot.vy = 0;
                        }
                    }
                }
            }
        }

        // Resolve temporary walls collisions for bot
        if (this.temporaryWalls) {
            for (const wall of this.temporaryWalls) {
                if (this.bot.x < wall.x + wall.width &&
                    this.bot.x + this.bot.width > wall.x &&
                    this.bot.y < wall.y + wall.height &&
                    this.bot.y + this.bot.height > wall.y) {
                    
                    if (dir === 'horizontal') {
                        if (this.bot.vx > 0) {
                            this.bot.x = wall.x - this.bot.width;
                        } else if (this.bot.vx < 0) {
                            this.bot.x = wall.x + wall.width;
                        }
                        this.bot.vx = 0;
                    } else if (dir === 'vertical') {
                        if (this.bot.vy > 0) {
                            this.bot.y = wall.y - this.bot.height;
                            if (this.bot.gravityDirection === 1) this.bot.doubleJumpAvailable = true;
                        } else if (this.bot.vy < 0) {
                            this.bot.y = wall.y + wall.height;
                            if (this.bot.gravityDirection === -1) this.bot.doubleJumpAvailable = true;
                        }
                        this.bot.vy = 0;
                    }
                }
            }
        }
    }

    isBotOnGround() {
        const checkY = this.bot.gravityDirection === 1 
            ? this.bot.y + this.bot.height 
            : this.bot.y - 2;
        
        return this.checkBotCollisionAt(this.bot.x + 3, checkY, this.bot.width - 6, 2);
    }

    checkBotCollisionAt(x, y, w, h) {
        const colStart = Math.floor(x / 32);
        const colEnd = Math.floor((x + w) / 32);
        const rowStart = Math.floor(y / 32);
        const rowEnd = Math.floor((y + h) / 32);
        const grid = this.currentMap.grid;

        for (let r = rowStart; r <= rowEnd; r++) {
            if (r < 0 || r >= grid.length) continue;
            for (let c = colStart; c <= colEnd; c++) {
                if (c < 0 || c >= grid[r].length) continue;
                const tile = grid[r][c];
                if (tile === '#' || tile === 'I') return true;
            }
        }

        // Check temporary walls for bot collision checks
        if (this.temporaryWalls) {
            for (const wall of this.temporaryWalls) {
                if (x < wall.x + wall.width &&
                    x + w > wall.x &&
                    y < wall.y + wall.height &&
                    y + h > wall.y) {
                    return true;
                }
            }
        }
        return false;
    }

    castBotAbilityDirectly(abilKey) {

        switch (abilKey) {
            case 'timestop':
                sound.playTimeStop();
                this.timeStoppedBy = 'npc_bot';
                this.timeStopDuration = 1.5; // 1.5s freeze
                this.triggerAlertBanner("TIME STOPPED!", 1800);
                break;
            case 'blindness':
                sound.playTimeStop();
                this.localPlayer.blindnessTimer = 3.0; // 3s blindness
                this.triggerAlertBanner("ERBLINDET!", 1500);
                break;
        }
    }

    rootBot(seconds) {
        sound.playFreeze();
        if (this.bot) {
            this.bot.isRooted = true;
            this.bot.rootTimer = seconds;
            this.bot.vx = 0;
            this.bot.vy = 0;
        }
    }

    getAdjustedCooldown(abilKey) {
        const spec = ABILITIES_REGISTRY[abilKey];
        if (!spec) return 0;
        let cd = spec.cooldown || 0;
        if (this.localPlayer.passiveAbility === 'less_cooldown') {
            cd = cd * 0.85; // 15% reduction
        }
        return cd;
    }

    getAbilityNameWithQueued(abKey) {
        if (abKey === 'random') {
            const queued = this.localPlayer.queuedRandomAbility;
            const queuedName = queued && ABILITIES_REGISTRY[queued] ? ABILITIES_REGISTRY[queued].name : '...';
            return `Zufall (${queuedName})`;
        }
        return ABILITIES_REGISTRY[abKey] ? ABILITIES_REGISTRY[abKey].name : abKey;
    }

    rollNextRandomAbility() {
        const keys = Object.keys(ABILITIES_REGISTRY).filter(k => k !== 'random');
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        this.localPlayer.queuedRandomAbility = randKey;
    }

    isDecoyOwnerSeeker(dec) {
        if (this.inTestRoom) {
            if (dec.owner === multiplayer.myId) {
                return this.localPlayer.isSeeker;
            } else if (this.bot && dec.owner === 'bot') {
                return this.bot.isSeeker;
            }
            return false;
        } else {
            return dec.owner === this.seekerId;
        }
    }

    getDecoyMoveDirection(dec) {
        const decIsSeeker = this.isDecoyOwnerSeeker(dec);
        
        if (decIsSeeker) {
            let nearestRunner = null;
            let minDist = 999999;
            
            const checkRunner = (p) => {
                if (!p || p.isDead) return;
                let isRunner = false;
                if (this.inTestRoom) {
                    isRunner = !p.isSeeker;
                } else {
                    isRunner = (p.id !== this.seekerId && p.id !== 'seeker');
                }
                if (isRunner) {
                    const d = Math.hypot(p.x - dec.x, p.y - dec.y);
                    if (d < minDist) {
                        minDist = d;
                        nearestRunner = p;
                    }
                }
            };
            
            if (multiplayer.myId !== dec.owner) {
                checkRunner(this.localPlayer);
            }
            if (this.inTestRoom && this.bot && dec.owner !== 'bot') {
                checkRunner(this.bot);
            }
            if (!this.inTestRoom) {
                for (let pid in this.remotePlayers) {
                    if (pid !== dec.owner) {
                        checkRunner(this.remotePlayers[pid]);
                    }
                }
            }
            
            if (nearestRunner) {
                return nearestRunner.x > dec.x ? 1 : -1;
            }
        } else {
            let seeker = null;
            if (this.inTestRoom) {
                if (this.localPlayer.isSeeker) seeker = this.localPlayer;
                else if (this.bot && this.bot.isSeeker) seeker = this.bot;
            } else {
                if (this.seekerId === multiplayer.myId) seeker = this.localPlayer;
                else if (this.remotePlayers[this.seekerId]) seeker = this.remotePlayers[this.seekerId];
            }
            
            if (seeker && !seeker.isDead) {
                return seeker.x > dec.x ? -1 : 1;
            }
        }
        
        return dec.facing;
    }

    openPassivePicker() {
        const modal = document.getElementById('passive-picker-modal');
        if (!modal) return;
        modal.classList.remove('hidden');

        const list = document.getElementById('passive-abilities-list');
        if (!list) return;
        list.innerHTML = '';

        const passives = [
            {
                key: 'seeker_speed',
                name: 'Jäger-Tempo',
                desc: '+10% Lauftempo als Fänger (zusätzlich zu den standardmäßigen 15%)',
                icon: 'fa-gauge-high'
            },
            {
                key: 'less_cooldown',
                name: 'Abklingzeit-Reduktion',
                desc: '15% kürzere Abklingzeiten für alle aktiven Fähigkeiten',
                icon: 'fa-stopwatch'
            },
            {
                key: 'resilience',
                name: 'Zähigkeit',
                desc: 'Halbiert die Dauer aller gegnerischen Sabotagen auf sich selbst und verringert erhaltenen Rückstoß um 50%',
                icon: 'fa-solid fa-shield-halved'
            },
            {
                key: 'third_slot',
                name: 'Dritter Slot',
                desc: '-20% Lauftempo, schaltet jedoch einen dritten Slot für eine aktive Fähigkeit frei',
                icon: 'fa-layer-group'
            },
            {
                key: 'speciality_plus',
                name: 'Spezialität Plus',
                desc: 'Erhöht alle aktiven Fertigkeiten-Effekte (Dauer, Knockback-Kraft, Root-Dauer, Dash-Reichweite) um +20%',
                icon: 'fa-star'
            }
        ];

        passives.forEach(p => {
            const card = document.createElement('div');
            const isActive = this.localPlayer.passiveAbility === p.key;
            card.className = `passive-option-card ${isActive ? 'active' : ''}`;
            card.innerHTML = `
                <div class="passive-icon-box">
                    <i class="fa-solid ${p.icon}"></i>
                </div>
                <div class="passive-details">
                    <div class="passive-name">${p.name}</div>
                    <div class="passive-desc">${p.desc}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                if (this.localPlayer.passiveAbility === p.key) {
                    this.localPlayer.passiveAbility = null;
                } else {
                    this.localPlayer.passiveAbility = p.key;
                }
                modal.classList.add('hidden');
                this.updateHUDAbilities();
                this.updateLobbyAbilityButtons();
                if (multiplayer.roomCode) {
                    this.onLobbyUpdated(multiplayer.players, this.gameMode, this.currentMapKey, this.maxRounds, this.gameDurationSec, this.randomSwitchInterval);
                }
            });
            list.appendChild(card);
        });
    }

    checkItemSpawning() {
        const elapsed = this.gameDurationSec - this.gameDuration;
        const t1 = Math.floor(this.gameDurationSec / 6);
        const t2 = Math.floor(this.gameDurationSec / 2);
        const t3 = Math.floor(5 * this.gameDurationSec / 6);

        if (elapsed >= t1 && !this.spawnedIntervals[0]) {
            this.spawnedIntervals[0] = true;
            this.spawnItemOnMap(this.roundItemsOrder[0]);
        }
        if (elapsed >= t2 && !this.spawnedIntervals[1]) {
            this.spawnedIntervals[1] = true;
            this.spawnItemOnMap(this.roundItemsOrder[1]);
        }
        if (elapsed >= t3 && !this.spawnedIntervals[2]) {
            this.spawnedIntervals[2] = true;
            this.spawnItemOnMap(this.roundItemsOrder[2]);
        }
    }

    spawnItemOnMap(itemType) {
        const solids = [];
        const grid = this.currentMap.grid;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === '#' || grid[row][col] === 'I') {
                    if (row > 0 && grid[row-1][col] === ' ') {
                        solids.push({ col: col, row: row - 1 });
                    }
                }
            }
        }
        if (solids.length === 0) return;
        const pick = solids[Math.floor(Math.random() * solids.length)];
        const x = pick.col * 32 + 16;
        const y = pick.row * 32 + 16;
        const itemId = Math.random().toString(36).substr(2, 9);

        if (this.inTestRoom) {
            this.mapItems.push({
                id: itemId,
                type: itemType,
                x: x,
                y: y
            });
        } else {
            multiplayer.sendGameEvent({
                type: 'spawn_item',
                id: itemId,
                itemType: itemType,
                x: x,
                y: y
            });
        }
    }

    checkItemCollisions() {
        if (!this.isPlaying) return;

        for (let i = 0; i < this.mapItems.length; i++) {
            const item = this.mapItems[i];
            
            if (!this.localPlayer.isDead) {
                const distLocal = Math.hypot(this.localPlayer.x + this.localPlayer.width / 2 - item.x, this.localPlayer.y + this.localPlayer.height / 2 - item.y);
                if (distLocal < 22) {
                    if (this.inTestRoom) {
                        this.mapItems = this.mapItems.filter(itm => itm.id !== item.id);
                        this.applyItemEffect(item.type, multiplayer.myId);
                    } else {
                        multiplayer.sendGameEvent({
                            type: 'collect_item',
                            id: item.id,
                            itemType: item.type,
                            collectorId: multiplayer.myId
                        });
                    }
                    break;
                }
            }

            if (this.inTestRoom && this.botEnabled && this.bot && !this.bot.isDead) {
                const distBot = Math.hypot(this.bot.x + this.bot.width / 2 - item.x, this.bot.y + this.bot.height / 2 - item.y);
                if (distBot < 22) {
                    this.mapItems = this.mapItems.filter(itm => itm.id !== item.id);
                    this.applyItemEffect(item.type, 'bot');
                    break;
                }
            }
        }
    }

    applyItemEffect(itemType, playerId) {
        if (playerId === multiplayer.myId) {
            if (itemType === 'speed2x') {
                this.localPlayer.speedBuffTimer = 5.0;
                this.triggerAlertBanner("TEMPO SCHNELLER (2x)!", 1500);
                sound.playWin();
            } else if (itemType === 'cooldown_reset') {
                this.localPlayer.cooldowns = [0, 0, 0];
                this.updateHUDAbilities();
                this.triggerAlertBanner("FÄHIGKEITEN RESET!", 1500);
                sound.playFreeze();
            } else if (itemType === 'swap') {
                let targets = [];
                if (this.inTestRoom) {
                    if (this.bot && !this.bot.isDead) targets.push('bot');
                } else {
                    for (let pid in this.remotePlayers) {
                        if (!this.remotePlayers[pid].isDead) {
                            targets.push(pid);
                        }
                    }
                }
                if (targets.length > 0) {
                    const targetId = targets[Math.floor(Math.random() * targets.length)];
                    const oldX = this.localPlayer.x;
                    const oldY = this.localPlayer.y;
                    let targetX, targetY;
                    if (targetId === 'bot') {
                        targetX = this.bot.x;
                        targetY = this.bot.y;
                        this.bot.x = oldX;
                        this.bot.y = oldY;
                        this.bot.vx = 0;
                        this.bot.vy = 0;
                    } else {
                        const rp = this.remotePlayers[targetId];
                        targetX = rp.x;
                        targetY = rp.y;
                        multiplayer.sendGameEvent({
                            type: 'swap_positions',
                            targetId: targetId,
                            toX: oldX,
                            toY: oldY
                        });
                    }
                    this.localPlayer.x = targetX;
                    this.localPlayer.y = targetY;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                    this.tagImmunityTimer = 1.5;
                    sound.playDash();
                    this.triggerAlertBanner("Position getauscht!", 1500);
                }
            }
        } else if (playerId === 'bot') {
            if (itemType === 'speed2x') {
                this.bot.speedBuffTimer = 5.0;
            } else if (itemType === 'cooldown_reset') {
                this.bot.cooldowns = [0, 0];
            } else if (itemType === 'swap') {
                if (!this.localPlayer.isDead) {
                    const oldX = this.bot.x;
                    const oldY = this.bot.y;
                    this.bot.x = this.localPlayer.x;
                    this.bot.y = this.localPlayer.y;
                    this.bot.vx = 0;
                    this.bot.vy = 0;
                    this.localPlayer.x = oldX;
                    this.localPlayer.y = oldY;
                    this.localPlayer.vx = 0;
                    this.localPlayer.vy = 0;
                    this.tagImmunityTimer = 1.5;
                    sound.playDash();
                    this.triggerAlertBanner("Position getauscht!", 1500);
                }
            }
        }
    }

    castSubAbility(subKey) {
        switch (subKey) {
            case 'teleport': return this.castTeleport();
            case 'moveplus': return this.castMovePlus();
            case 'dash': return this.castDash();
            case 'timestop': return this.castTimeStop();
            case 'phase': return this.castPhase();
            case 'invis': return this.castInvis();
            case 'knockback': return this.castKnockback();
            case 'swap': return this.castSwap();
            case 'gluetrap': return this.castGlueTrap();
            case 'gravity': return this.castGravityFlip();
            case 'decoy': return this.castDecoy();
            case 'blindness': return this.castBlindness();
            case 'wallplace': return this.castWallPlace();
            case 'disguise': return this.castDisguise();
            case 'shrink': return this.castShrink();
            case 'webtrap': return this.castWebTrap();
            case 'invertkeys': return this.castInvertKeys();
            case 'mindcontrol': return this.castMindControl();
            case 'clonetrio': return this.castCloneTrio();
            case 'blastshot': return this.castBlastShot();
            case 'shield': return this.castShield();
            default: return false;
        }
    }

    resetReadyState() {
        this.localPlayer.isReady = false;
        multiplayer.updateMyReadyState(false);
        const readyBtn = document.getElementById('ready-btn');
        if (readyBtn) {
            readyBtn.classList.remove('btn-is-ready');
            readyBtn.textContent = 'Bereit';
        }
    }
}

// Instantiate engine when script loaded
window.game = new GameEngine();

// Prevent zoom gestures on iOS Safari
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
});
document.addEventListener('gestureend', function (e) {
    e.preventDefault();
});
