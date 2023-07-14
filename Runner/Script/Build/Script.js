"use strict";
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Runner); // Register the namespace to FUDGE for serialization
    class CollisionScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CollisionScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
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
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    console.log("I dont understand");
                    this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.rigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.hndCollision);
                    this.node.addEventListener("SensorHit", this.hndCollision);
            }
        };
        hndCollision = (_event) => {
            console.log("Bumm");
        };
    }
    Runner.CollisionScript = CollisionScript;
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let cmpCamera;
    let avatar;
    let OpponentNode;
    let cmpRigidbody;
    let oppoTimer = 0;
    let Spawntimer = 2.5;
    document.addEventListener("interactiveViewportStarted", start);
    //TODO: get it to work
    // window.onclick =(event: MouseEvent)=> { 
    //   console.log("clccccc");
    //   avatar.act(ACTION.FIGHT);
    // }
    async function start(_event) {
        viewport = _event.detail;
        Runner.graph = viewport.getBranch();
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        // cmpCamera = viewport.camera;
        cmpCamera = Runner.graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        Runner.spriteNode = Runner.graph.getChildrenByName("Player")[0];
        cmpRigidbody = Runner.spriteNode.getComponent(ƒ.ComponentRigidbody);
        console.log("Rigid", cmpRigidbody);
        Runner.Opponents = Runner.graph.getChildrenByName("Opponents")[0]; // get Sprite by name
        // console.log("O", Opponents);
        // console.log("S",spriteNode);
        await hndLoad();
        // spawnOpponents();
        // console.log("O", Opponents);
        // OpponentNode = Opponents.getChildrenByName("Opponent")[0];
        // OpponentNode.mtxLocal.translateX(+3);
        // let oppoRigidbody: ƒ.ComponentRigidbody = OpponentNode.getComponent(ƒ.ComponentRigidbody);
        // console.log(oppoRigidbody);
        // oppoRigidbody.applyForce(ƒ.Vector3.X(15))
        // Opponents.mtxLocal.translateX(-3);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function hndLoad() {
        avatar = new Runner.Avatar();
        ƒ.Loop.start();
    }
    function spawnOpponents() {
        // console.log("HEllo");
        oppoTimer += ƒ.Loop.timeFrameGame / 1000;
        // console.log(oppoTimer);
        if (oppoTimer > Spawntimer) {
            // console.log("HElllo ist me");
            Runner.Opponents.addChild(Runner.Opponent.createOpponents());
            // Opponents.mtxLocal.translateX(-1.0*ƒ.Loop.timeFrameGame/1000);
            oppoTimer = 0;
        }
        // Opponents.mtxLocal.translateX(3);
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        //window.addEventListener()
        spawnOpponents();
        // TODO: Knoten wir vor der Gegenererstellung bewegt 
        Runner.OpponentsTrans = Runner.Opponents.mtxLocal.translation.get();
        // console.log(OpponentsTrans);
        Runner.Opponents.mtxLocal.translateX(-1.0 * ƒ.Loop.timeFrameGame / 1000);
        // console.log("view", Opponents.getChildren());
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP])) {
            avatar.act(Runner.ACTION.FIGHT);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            avatar.act(Runner.ACTION.MISSED);
        }
        else {
            avatar.act(Runner.ACTION.IDLE);
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
            // this.getComponent(ƒ.ComponentTransform).mtxLocal.translation= new ƒ.Vector3(14+ OpponentsTrans[0], -3.45, 10);
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translation = new ƒ.Vector3(7 - Runner.OpponentsTrans[0], -3.45, 10);
            this.mtxLocal.rotateY(180);
            // TODO: to start later x = 6.5 
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.translation = new ƒ.Vector2(0.3935483992099762, 0.1);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleX(0.068);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleY(0.173);
            let rigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(rigidbody);
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
                    console.log("FOPS", this.playerFps);
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0];
                    this.missedOpponnent = false;
                    break;
                case ACTION.IDLE:
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0];
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