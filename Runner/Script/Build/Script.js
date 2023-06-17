"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
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
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let cmpCamera;
    let avatar;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        Runner.graph = viewport.getBranch();
        cmpCamera = viewport.camera;
        Runner.spriteNode = Runner.graph.getChildrenByName("Player")[0]; // get Sprite by name
        console.log("S", Runner.spriteNode);
        await hndLoad();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function hndLoad() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Image/Sprite4.png");
        avatar = new Runner.Avatar();
        avatar.initializeAnimations(imgSpriteSheet);
        //avatar.act(ACTION.DOWN);
        //avatar.act(ACTION.IDLE);
        Runner.spriteNode.addChild(avatar);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Runner || (Runner = {}));
var Runner;
(function (Runner) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["IDLE"] = 0] = "IDLE";
        ACTION[ACTION["LEFTRIGHT"] = 1] = "LEFTRIGHT";
        ACTION[ACTION["UP"] = 2] = "UP";
        ACTION[ACTION["DOWN"] = 3] = "DOWN";
        ACTION[ACTION["INTERACTION"] = 4] = "INTERACTION";
    })(ACTION = Runner.ACTION || (Runner.ACTION = {}));
    class Avatar extends ƒAid.NodeSprite {
        xSpeed = 1.1;
        animationCurrent;
        walkLeftRight;
        walkUp;
        walkDown;
        fieldActionRight;
        fieldActionUp;
        fieldActionDown;
        constructor() {
            super("AvatarInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }
        walkleftright(_deltaTime) {
            Runner.spriteNode.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }
        // public act(_action: ACTION): void {
        //     let animation: ƒAid.SpriteSheetAnimation;
        //     switch (_action) {
        //         case ACTION.LEFTRIGHT:
        //             animation = this.walkLeftRight;
        //             break;
        //         case ACTION.IDLE:
        //             break;
        //         case ACTION.UP:
        //             animation = this.walkUp;
        //             break;
        //         case ACTION.DOWN:
        //             animation = this.walkDown;
        //             break;
        //             this.interaction = true;
        //             if (this.animationCurrent == this.walkLeftRight) {
        //                 this.showFrame(farmingTool);
        //                 animation = this.fieldActionRight;
        //                 console.log("Left")
        //                 break;
        //             }
        //             else if (this.animationCurrent == this.walkUp) {
        //                 this.showFrame(farmingTool);
        //                 animation = this.fieldActionUp;
        //                 console.log("UP");
        //                 break;
        //             }
        //             else if (this.animationCurrent == this.walkDown) {
        //                 this.showFrame(farmingTool);
        //                 animation = this.fieldActionDown;
        //                 console.log("Down");
        //                 break;
        //             }
        //     }
        //     if (_action == ACTION.IDLE) {
        //         if (this.interaction) {
        //             animation = this.animationCurrent;
        //             this.interaction = false;
        //         }
        //         this.showFrame(0);
        //     }
        //     else if (animation != this.animationCurrent && _action != ACTION.INTERACTION) {
        //         this.setAnimation(animation);
        //         this.animationCurrent = animation;
        //     }
        // }
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
            this.walkLeftRight = new ƒAid.SpriteSheetAnimation("Run", coat);
            this.walkLeftRight.generateByGrid(ƒ.Rectangle.GET(10, 285, 50, 70), 6, 10, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            // this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
            // this.walkUp.generateByGrid(ƒ.Rectangle.GET(10, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            // this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
            // this.walkDown.generateByGrid(ƒ.Rectangle.GET(10, 70, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            // this.fieldActionRight = new ƒAid.SpriteSheetAnimation("Actionright", coat);
            // this.fieldActionRight.generateByGrid(ƒ.Rectangle.GET(480, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            // this.fieldActionUp = new ƒAid.SpriteSheetAnimation("Actionup", coat);
            // this.fieldActionUp.generateByGrid(ƒ.Rectangle.GET(480, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            // this.fieldActionDown = new ƒAid.SpriteSheetAnimation("Actiondown", coat);
            // this.fieldActionDown.generateByGrid(ƒ.Rectangle.GET(480, 65, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.framerate = 25;
        }
    }
    Runner.Avatar = Avatar;
})(Runner || (Runner = {}));
//# sourceMappingURL=Script.js.map