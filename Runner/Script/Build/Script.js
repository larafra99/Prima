"use strict";
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Runner); // Register the namespace to FUDGE for serialization
    class CollisionScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CollisionScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        rigidbody;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.rigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.hndCollision);
            }
        };
        async hndCollision(_event) {
            let oppoNode = _event.cmpRigidbody.node;
            //  allows player to hit opponent after collision happend
            if (!Runner.fight) {
                // as long as opponent is in front of the player it can still be hit
                await new Promise(resolve => { setTimeout(resolve, 800 - 10 * Runner.ui.speed); });
            }
            // opponent is hit
            if (Runner.fight) {
                // increase speed of character and pet
                if (Runner.ui.speed < Runner.ui.maxspeed) {
                    Runner.playerFps = Runner.playerFps + 0.1;
                    Runner.petNode.dispatchEvent(new Event("ChangeSpeed", { bubbles: true }));
                }
                // removes hit opponent, adds money
                Runner.Opponents.removeChild(oppoNode);
                Runner.ui.money = parseFloat((Runner.ui.money + (Runner.ui.opponentmulitplicator * Runner.ui.moneymultipilcator)).toFixed(1));
            }
            // opponent is missed show missed animation
            else {
                Runner.avatar.act(Runner.ACTION.MISSED);
            }
        }
    }
    Runner.CollisionScript = CollisionScript;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    Runner.fight = false;
    Runner.missedOpponnent = false;
    Runner.fightCoolDown = false;
    let viewport;
    let cmpCamera;
    let cmpAudio;
    let oppoSkin;
    let bgMusic = new ƒ.Audio("Sound/background.mp3");
    let swordAudio = new ƒ.Audio("Sound/sword.wav");
    let oppoTimer = 0;
    let hitTimer = 0;
    let buttonCounter = 0;
    let changOopposkinButton;
    let randomOppo = false;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        // fetching config file and it's data
        let response = await fetch("config.json");
        let json = await response.json();
        // Creating USerInterface and Statemachine
        Runner.ui = new Runner.UserInterface(json);
        Runner.petStateMachine = new Runner.PetState();
        // creating graph and Audio and Camera Components
        viewport = _event.detail;
        Runner.graph = viewport.getBranch();
        cmpCamera = Runner.graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        cmpAudio = Runner.graph.getComponent(ƒ.ComponentAudio);
        // getting Nodes from the graph
        Runner.spriteNode = Runner.graph.getChildrenByName("Player")[0];
        Runner.Opponents = Runner.graph.getChildrenByName("Opponents")[0];
        Runner.petNode = Runner.graph.getChildrenByName("Pet")[0];
        // setting playerspeed and opponentspeed
        Runner.playerFps = Runner.ui.speed / 10;
        Runner.opponentSpeed = Runner.playerFps;
        // getting Opponentskin
        oppoSkin = ƒ.Project.getResourcesByName("OpponentShader")[0];
        // getting button elements from UI / index
        let resetButton = document.getElementById("resetbutton");
        resetButton.addEventListener("click", function () { reset(); });
        let OpponentMultiplicatorButton = document.getElementById("opponentbutton");
        OpponentMultiplicatorButton.addEventListener("click", function () { checkButton("oppo"); });
        let moneyMulitpilactorButton = document.getElementById("multipicatorbutton");
        moneyMulitpilactorButton.addEventListener("click", function () { checkButton("money"); });
        let maxSpeedButton = document.getElementById("maxspeedbutton");
        maxSpeedButton.addEventListener("click", function () { checkButton("speed"); });
        changOopposkinButton = document.getElementById("changeopposkinbutton");
        changOopposkinButton.textContent = "Anderer Gegener";
        changOopposkinButton.addEventListener("click", function () { checkButton("skin"); });
        // waiting for Player to be created
        await hndLoad();
        // loading background audio
        bgAudio();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    // creating new Player
    async function hndLoad() {
        Runner.avatar = new Runner.Avatar();
    }
    // starting background
    function bgAudio() {
        cmpAudio = new ƒ.ComponentAudio(bgMusic, true, true);
        cmpAudio.connect(true);
        cmpAudio.volume = 2;
    }
    // defines random spawntime for opponents
    function spawnTimer() {
        return (Math.random() * (10 - 0.9) + 0.9);
    }
    // creates opponents
    function spawnOpponents() {
        if (randomOppo) {
            // sets skin for opponents
            if (Math.random() < 0.5) {
                oppoSkin = ƒ.Project.getResourcesByName("OpponentShader")[0];
            }
            else {
                oppoSkin = ƒ.Project.getResourcesByName("OpponentShader2")[0];
            }
        }
        oppoTimer += ƒ.Loop.timeFrameGame / 1000;
        if (oppoTimer > spawnTimer()) {
            document.getElementById("transaktion").innerText = "";
            Runner.Opponents.addChild(Runner.Opponent.createOpponents(oppoSkin));
            oppoTimer = 0;
        }
    }
    // allows Player that earlier hits count, opponent doesn't need to be hit just before the collision
    function hitOpponent() {
        hitTimer += ƒ.Loop.timeFrameGame / 1000;
        if (hitTimer > 0.2 && Runner.fight) {
            Runner.fight = false;
            hitTimer = 0;
        }
    }
    // if buttons are pressed execiutes function
    function checkButton(add) {
        // opponents drop more money
        if (add == "oppo" && Runner.ui.money >= 50) {
            Runner.ui.opponentmulitplicator = Runner.ui.opponentmulitplicator + 1;
            Runner.ui.money = parseFloat((Runner.ui.money - 50).toFixed(1));
            return;
        }
        // increases money value
        else if (add == "money" && Runner.ui.money >= 20) {
            Runner.ui.moneymultipilcator = Runner.ui.moneymultipilcator + 0.1;
            Runner.ui.money = parseFloat((Runner.ui.money - 20).toFixed(1));
            return;
        }
        // increases max speed
        else if (add == "speed" && Runner.ui.money >= 100) {
            Runner.ui.maxspeed = Runner.ui.maxspeed + 1;
            Runner.ui.money = parseFloat((Runner.ui.money - 100).toFixed(1));
            return;
        }
        // changes opponentskin are enables random opponents
        else if (add == "skin" && Runner.ui.money >= 500) {
            if (buttonCounter == 0) {
                oppoSkin = ƒ.Project.getResourcesByName("OpponentShader2")[0];
                changOopposkinButton.textContent = "Random Gegner";
                return;
            }
            else if (buttonCounter == 1) {
                randomOppo = true;
                changOopposkinButton.disabled = true;
                changOopposkinButton.hidden = true;
            }
            Runner.ui.money = parseFloat((Runner.ui.money - 500).toFixed(1));
            buttonCounter = buttonCounter + 1;
            return;
        }
        else {
            document.getElementById("transaktion").innerText = "Geld war nicht ausreichend für die Transaktion";
            return;
        }
    }
    function update(_event) {
        ƒ.Physics.simulate();
        // Spawns opponents
        spawnOpponents();
        // moves opoonents with the help of mother node
        Runner.OpponentsTrans = Runner.Opponents.mtxLocal.translation.get();
        Runner.Opponents.mtxLocal.translateX(-(1.0 + Runner.opponentSpeed) * ƒ.Loop.timeFrameGame / 1000);
        // allows eralier hit times 
        hitOpponent();
        // checks if Player wants to attack
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            // changes audio to sword sound
            cmpAudio.setAudio(swordAudio);
            cmpAudio.loop = false;
            cmpAudio.volume = 10;
            cmpAudio.play(true);
            // shows Fight animation
            Runner.avatar.act(Runner.ACTION.FIGHT);
        }
        // shows characters idle animation if no opponents were missed
        else if (!Runner.missedOpponnent) {
            Runner.avatar.act(Runner.ACTION.IDLE);
            // sets audio back to backgroundmusic
            if (cmpAudio.getAudio().name == "sword.wav") {
                cmpAudio.setAudio(bgMusic);
                cmpAudio.volume = 2;
                cmpAudio.loop = true;
                cmpAudio.play(true);
            }
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    //  resets the game, puts all Nodes back in starting position
    function reset() {
        console.log("Reset");
        Runner.ui.money = 0;
        Runner.ui.maxspeed = 10;
        Runner.ui.opponentmulitplicator = 1;
        Runner.ui.moneymultipilcator = 1;
        Runner.playerFps = 1;
        Runner.petNode.dispatchEvent(new Event("Reset", { bubbles: true }));
        Runner.missedOpponnent = false;
        Runner.avatar.act(Runner.ACTION.IDLE);
        Runner.Opponents.removeAllChildren();
    }
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    class Opponent extends ƒ.Node {
        // define attributes and components of opponent
        constructor() {
            super("Opponent");
            this.addComponent(new ƒ.ComponentMesh(ƒ.Project.getResourcesByName("Player")[0]));
            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translation = new ƒ.Vector3(7 - Runner.OpponentsTrans[0], -3.1, 10);
            this.mtxLocal.rotateY(180);
            let rigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(rigidbody);
            this.addComponent((new Runner.RemoveOpponentScript()));
        }
        static createOpponents(skin) {
            let OpponentNode = new ƒ.Node("OpponentNode");
            // creates opponent
            OpponentNode = new Opponent();
            // sets material
            OpponentNode.addComponent(new ƒ.ComponentMaterial(skin));
            OpponentNode.getComponent(ƒ.ComponentMaterial).mtxPivot.translation = new ƒ.Vector2(0.4, 0.1);
            OpponentNode.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleX(0.068);
            OpponentNode.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleY(0.173);
            return OpponentNode;
        }
    }
    Runner.Opponent = Opponent;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Runner); // Register the namespace to FUDGE for serialization
    class PetScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(PetScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // listens after events 
                    this.node.addEventListener("Reset", this.startPostion);
                    this.node.addEventListener("ChangeSpeed", this.petSpeedChange);
            }
        };
        // reset event dog gets back in starting position
        startPostion(_event) {
            // sets dog back to idle
            Runner.petStateMachine.petReset();
            Runner.petNode.mtxLocal.translation.x = -4.69;
            Runner.petNode.mtxLocal.translation = new ƒ.Vector3(-4.7, -3, 12);
        }
        //  events to change speed of the pet relativ to character speed
        petSpeedChange(_event) {
            Runner.petStateMachine.changeSpeed();
        }
    }
    Runner.PetScript = PetScript;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Runner); // Register the namespace to FUDGE for serialization
    // defines pet states
    let PETSTATE;
    (function (PETSTATE) {
        PETSTATE[PETSTATE["IDLE"] = 0] = "IDLE";
        PETSTATE[PETSTATE["RUN"] = 1] = "RUN";
        PETSTATE[PETSTATE["REST"] = 2] = "REST";
        PETSTATE[PETSTATE["SIT"] = 3] = "SIT";
    })(PETSTATE || (PETSTATE = {}));
    // define variable
    let petTimer = 0;
    let resetboolean = false;
    let currentState = PETSTATE.IDLE;
    class PetState extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(PetState);
        static instructions = PetState.get();
        constructor() {
            super();
            this.instructions = PetState.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = PetState.transitDefault;
            setup.actDefault = PetState.petDefault;
            setup.setAction(PETSTATE.IDLE, this.petIdle);
            setup.setAction(PETSTATE.RUN, this.petRun);
            setup.setAction(PETSTATE.SIT, this.petSit);
            setup.setAction(PETSTATE.REST, this.petRest);
            return setup;
        }
        static transitDefault(_pet) {
            // console.log("Transit to", _pet.stateNext);
        }
        static async petDefault(_pet) {
            // console.log("default");
            // console.log(PETSTATE[_pet.stateCurrent]);
        }
        // sets idle state and animation
        static async petIdle(_pet) {
            currentState = PETSTATE.IDLE;
            resetboolean = false;
            petTimer += ƒ.Loop.timeFrameGame / 1000;
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_pet")[0];
            // change to run state 
            if (petTimer > 3) {
                _pet.transit(PETSTATE.RUN);
                petTimer = 0;
            }
        }
        // sets run state and animation
        static async petRun(_pet) {
            currentState = PETSTATE.RUN;
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("run_pet")[0];
            //  stops running state for reset
            if (resetboolean) {
                _pet.transit(PETSTATE.IDLE);
            }
            _pet.node.mtxLocal.translateX((3.0 + Runner.opponentSpeed) * ƒ.Loop.timeFrameGame / 1000);
            // change to sit state 
            if (_pet.node.mtxLocal.translation.x > 4) {
                _pet.transit(PETSTATE.SIT);
            }
        }
        // sets sit state and animation
        static async petSit(_pet) {
            currentState = PETSTATE.SIT;
            petTimer += ƒ.Loop.timeFrameGame / 1000;
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("sit_pet")[0];
            _pet.node.mtxLocal.translateX(-(1.0 + Runner.opponentSpeed) * ƒ.Loop.timeFrameGame / 1000);
            _pet.node.getComponent(ƒ.ComponentAnimator).playmode = ƒ.ANIMATION_PLAYMODE.PLAY_ONCE;
            // change to rest state
            if (petTimer > 0.19) {
                _pet.transit(PETSTATE.REST);
                petTimer = 0;
            }
        }
        // sets rest state and animation
        static async petRest(_pet) {
            currentState = PETSTATE.REST;
            _pet.node.getComponent(ƒ.ComponentAnimator).playmode = ƒ.ANIMATION_PLAYMODE.LOOP;
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("rest_pet")[0];
            _pet.node.mtxLocal.translateX(-(2.25 + Runner.opponentSpeed) * ƒ.Loop.timeFrameGame / 1000);
            // change to idle state
            if (_pet.node.mtxLocal.translation.x <= -4.5) {
                _pet.transit(PETSTATE.IDLE);
            }
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    this.transit(PETSTATE.IDLE);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    break;
            }
        };
        //  player resets the game, dog back in start position 
        petReset() {
            this.transit(PETSTATE.IDLE);
            resetboolean = true;
        }
        //  changes dog speed 
        changeSpeed() {
            this.transit(currentState);
        }
        update = (_event) => {
            this.act();
        };
    }
    Runner.PetState = PetState;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    //  defines Character actions 
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["IDLE"] = 0] = "IDLE";
        ACTION[ACTION["FIGHT"] = 1] = "FIGHT";
        ACTION[ACTION["MISSED"] = 2] = "MISSED";
    })(ACTION = Runner.ACTION || (Runner.ACTION = {}));
    class Avatar extends ƒAid.NodeSprite {
        constructor() {
            super("AvatarInstance");
        }
        async act(_action) {
            switch (_action) {
                //  player fight action
                case ACTION.FIGHT:
                    Runner.missedOpponnent = false;
                    Runner.fight = true;
                    //  fight action possible after cooldown
                    if (!Runner.fightCoolDown) {
                        Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0];
                        Runner.spriteNode.getComponent(ƒ.ComponentAnimator).scale = 1;
                        Runner.fightCoolDown = true;
                    }
                    //  timer for cooldown
                    let time = new ƒ.Time();
                    new ƒ.Timer(time, 100, 1, this.enableFighting);
                    break;
                //  sets idle action (Character runs)
                case ACTION.IDLE:
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0];
                    //  changes speed of the player if opponents are missed 
                    if (Runner.missedOpponnent) {
                        Runner.playerFps = 0.1;
                        Runner.petNode.dispatchEvent(new Event("ChangeSpeed", { bubbles: true }));
                    }
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).scale = Runner.playerFps;
                    break;
                //  character action if opponents are missed
                case ACTION.MISSED:
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("missed_animation")[0];
                    Runner.missedOpponnent = true;
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).scale = 1;
                    await new Promise(resolve => { setTimeout(resolve, 200); });
                    Runner.avatar.act(ACTION.IDLE);
                    break;
            }
            // updates VUI and opponets speed 
            Runner.ui.speed = parseInt((Runner.playerFps * 10).toFixed(0));
            Runner.opponentSpeed = Runner.playerFps;
        }
        //  disables fight cooldown  
        enableFighting() {
            Runner.fightCoolDown = false;
        }
    }
    Runner.Avatar = Avatar;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Runner); // Register the namespace to FUDGE for serialization
    class RemoveOpponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(RemoveOpponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    // ƒ.Debug.log( this.node);
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.update);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    break;
            }
        };
        //  delets opoonents if they are out of frame
        update = (_event) => {
            if (this.node.mtxLocal.translation.x < -7 - Runner.OpponentsTrans[0]) {
                Runner.Opponents.removeChild(this.node);
            }
        };
    }
    Runner.RemoveOpponentScript = RemoveOpponentScript;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class UserInterface extends ƒ.Mutable {
        reduceMutator(_mutator) {
            /**/
        }
        speed;
        money;
        maxspeed;
        opponentmulitplicator;
        moneymultipilcator;
        controller;
        constructor(_config) {
            super();
            this.speed = _config.speed;
            this.money = _config.money;
            this.maxspeed = _config.maxspeed;
            this.opponentmulitplicator = _config.opponentmulitplicator;
            this.moneymultipilcator = _config.moneymultipilcator;
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
        }
    }
    Runner.UserInterface = UserInterface;
})(Runner || (Runner = {}));
//# sourceMappingURL=Script.js.map