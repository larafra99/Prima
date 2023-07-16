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
                    console.log("I dont understand");
                    this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.rigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.hndCollision);
            }
        };
        async hndCollision(_event) {
            if (!Runner.fight) {
                await new Promise(resolve => { setTimeout(resolve, 1000); });
            }
            // console.log(this.rigidbody.id)
            // console.log(ƒ.EventPhysics.)
            if (Runner.fight) {
                console.log("LEft");
                // spriteNode.dispatchEvent(new Event("Hit", {bubbles: true}));
            }
            else {
                console.log("Bumm");
                // TODO:hold animation longer
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
    let viewport;
    let cmpCamera;
    let oppoTimer = 0;
    let hitTimer = 0;
    document.addEventListener("interactiveViewportStarted", start);
    //TODO: get it to work
    // window.onclick =(event: MouseEvent)=> { 
    //   console.log("clccccc");
    //   avatar.act(ACTION.FIGHT);
    // }
    async function start(_event) {
        let response = await fetch("config.json");
        let json = await response.json();
        console.log(json);
        viewport = _event.detail;
        Runner.graph = viewport.getBranch();
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        cmpCamera = viewport.camera;
        cmpCamera = Runner.graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        Runner.spriteNode = Runner.graph.getChildrenByName("Player")[0];
        Runner.Opponents = Runner.graph.getChildrenByName("Opponents")[0];
        // console.log("O", Opponents);
        // console.log("S",spriteNode);
        await hndLoad();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function hndLoad() {
        Runner.avatar = new Runner.Avatar();
        ƒ.Loop.start();
    }
    function spawnTimer() {
        return (Math.random() * (8 - 1.2) + 1.2);
    }
    function spawnOpponents() {
        oppoTimer += ƒ.Loop.timeFrameGame / 1000;
        // if (oppoTimer> spawnTimer()){
        if (oppoTimer > 5) {
            Runner.Opponents.addChild(Runner.Opponent.createOpponents());
            oppoTimer = 0;
        }
    }
    function hitOpponent() {
        hitTimer += ƒ.Loop.timeFrameGame / 1000;
        if (hitTimer > 0.4 && Runner.fight) {
            Runner.fight = false;
            hitTimer = 0;
        }
    }
    function update(_event) {
        ƒ.Physics.simulate();
        //window.addEventListener()
        spawnOpponents();
        Runner.OpponentsTrans = Runner.Opponents.mtxLocal.translation.get();
        Runner.Opponents.mtxLocal.translateX(-1.0 * ƒ.Loop.timeFrameGame / 1000);
        hitOpponent();
        // console.log(fight);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP])) {
            Runner.avatar.act(Runner.ACTION.FIGHT);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            Runner.avatar.act(Runner.ACTION.MISSED);
        }
        else {
            Runner.avatar.act(Runner.ACTION.IDLE);
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    class Opponent extends ƒ.Node {
        constructor() {
            super("Opponent");
            this.addComponent(new ƒ.ComponentMesh(ƒ.Project.getResourcesByName("Player")[0]));
            this.addComponent(new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("OpponentShader")[0]));
            this.addComponent(new ƒ.ComponentTransform());
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translation = new ƒ.Vector3(7 - Runner.OpponentsTrans[0], -3.45, 10);
            this.mtxLocal.rotateY(180);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.translation = new ƒ.Vector2(0.3935483992099762, 0.1);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleX(0.068);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleY(0.173);
            let rigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(rigidbody);
            this.addComponent((new Runner.RemoveOpponentScript()));
        }
        static createOpponents() {
            // console.log("Oppo");
            let OpponentNode = new ƒ.Node("OpponentNode");
            OpponentNode = new Opponent();
            // console.log("Node", OpponentNode);
            return OpponentNode;
        }
    }
    Runner.Opponent = Opponent;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Runner); // Register the namespace to FUDGE for serialization
    let PETSTATE;
    (function (PETSTATE) {
        PETSTATE[PETSTATE["IDLE"] = 0] = "IDLE";
        PETSTATE[PETSTATE["RUN"] = 1] = "RUN";
        PETSTATE[PETSTATE["REST"] = 2] = "REST";
        PETSTATE[PETSTATE["SIT"] = 3] = "SIT";
    })(PETSTATE || (PETSTATE = {}));
    let petTimer = 0;
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
            setup.setTransition(PETSTATE.IDLE, PETSTATE.RUN, this.transit);
            setup.setTransition(PETSTATE.RUN, PETSTATE.SIT, this.transit);
            setup.setTransition(PETSTATE.SIT, PETSTATE.REST, this.transit);
            setup.setTransition(PETSTATE.REST, PETSTATE.IDLE, this.transit);
            //setup.setTransition(JOB.IDLE, JOB.ATTACK, <ƒ.General>this.transitDie);
            return setup;
        }
        static transitDefault(_pet) {
            console.log("Transit to", _pet.stateNext);
        }
        static transit(_pet) {
            console.log("Transit");
            // 
        }
        static async petDefault(_pet) {
            console.log(PETSTATE[_pet.stateCurrent]);
        }
        static async petIdle(_pet) {
            petTimer += ƒ.Loop.timeFrameGame / 1000;
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_pet")[0];
            if (petTimer > 3) {
                _pet.transit(PETSTATE.RUN);
                petTimer = 0;
            }
            // 
        }
        static async petRun(_pet) {
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("run_pet")[0];
            _pet.node.mtxLocal.translateX(3.0 * ƒ.Loop.timeFrameGame / 1000);
            if (_pet.node.mtxLocal.translation.x > 4) {
                _pet.transit(PETSTATE.SIT);
            }
        }
        static async petSit(_pet) {
            petTimer += ƒ.Loop.timeFrameGame / 1000;
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("sit_pet")[0];
            _pet.node.mtxLocal.translateX(-1.0 * ƒ.Loop.timeFrameGame / 1000);
            if (petTimer > 0.19) {
                _pet.transit(PETSTATE.REST);
                petTimer = 0;
            }
        }
        static async petRest(_pet) {
            _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("rest_pet")[0];
            _pet.node.mtxLocal.translateX(-1.8 * ƒ.Loop.timeFrameGame / 1000);
            if (_pet.node.mtxLocal.translation.x <= -4.5) {
                _pet.transit(PETSTATE.IDLE);
            }
        }
        // Activate the functions of this component as response to events
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
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["IDLE"] = 0] = "IDLE";
        ACTION[ACTION["FIGHT"] = 1] = "FIGHT";
        ACTION[ACTION["MISSED"] = 2] = "MISSED";
    })(ACTION = Runner.ACTION || (Runner.ACTION = {}));
    class Avatar extends ƒAid.NodeSprite {
        missedOpponnent = false;
        playerFps = Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps;
        constructor() {
            super("AvatarInstance");
        }
        act(_action) {
            //     let animation: ƒAid.SpriteSheetAnimation;
            switch (_action) {
                case ACTION.FIGHT:
                    // console.log("FOPS", this.playerFps);
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0];
                    this.missedOpponnent = false;
                    Runner.fight = true;
                    break;
                case ACTION.IDLE:
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0];
                    // fight= false;
                    if (this.missedOpponnent) {
                        this.playerFps = 5;
                    }
                    else {
                        if (Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps < 15) {
                            // this.playerFps= this.playerFps+1; 
                            this.playerFps = 15;
                        }
                    }
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = this.playerFps;
                    break;
                case ACTION.MISSED:
                    // TODO: hold animation longer
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("missed_animation")[0];
                    this.missedOpponnent = true;
                    break;
            }
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
                    // this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
                    this.node.addEventListener("Hit", this.removeAfterHit);
                    break;
            }
        };
        update = (_event) => {
            // TODO: Remove Zahl auch -7 setzen, werden erst removed, wenn sie aus dem Bild sind 
            if (this.node.mtxLocal.translation.x < -6 - Runner.OpponentsTrans[0]) {
                console.log("Opponent removed");
                Runner.Opponents.removeChild(this.node);
            }
        };
        removeAfterHit(_event) {
            console.log("I've been hit");
        }
    }
    Runner.RemoveOpponentScript = RemoveOpponentScript;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    class UserInterface extends ƒ.Mutable {
        reduceMutator(_mutator) {
            /**/
        }
        speed;
        money;
        constructor(_config) {
            super();
            this.speed = _config.stamina;
            this.money = _config.vitality;
            //console.log(this.controller);
        }
    }
    Runner.UserInterface = UserInterface;
})(Runner || (Runner = {}));
//# sourceMappingURL=Script.js.map