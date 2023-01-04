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
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
var Harvest;
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
(function (Harvest) {
    var ƒ = FudgeCore;
    // Initialize Viewport
    let viewport;
    let avatar;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        viewport.camera.mtxPivot.translateZ(+10);
        viewport.camera.mtxPivot.rotateY(+180);
        hndLoad(_event);
    }
    async function hndLoad(_event) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/Playersprite.png");
        Harvest.graph = viewport.getBranch();
        avatar = new Harvest.Avatar();
        avatar.initializeAnimations(imgSpriteSheet);
        Harvest.graph.addChild(avatar);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        // Check for key presses
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
            avatar.act(Harvest.WALK.RIGHT);
            avatar.walkleftright(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
            avatar.act(Harvest.WALK.RIGHT);
            avatar.walkleftright(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
            avatar.act(Harvest.WALK.UP);
            avatar.walkupdown(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
            avatar.act(Harvest.WALK.DOWN);
            avatar.walkupdown(deltaTime);
        }
        else {
            avatar.act(Harvest.WALK.IDLE);
        }
        viewport.draw();
    }
})(Harvest || (Harvest = {}));
var Harvest;
(function (Harvest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let WALK;
    (function (WALK) {
        WALK[WALK["IDLE"] = 0] = "IDLE";
        WALK[WALK["LEFT"] = 1] = "LEFT";
        WALK[WALK["RIGHT"] = 2] = "RIGHT";
        WALK[WALK["UP"] = 3] = "UP";
        WALK[WALK["DOWN"] = 4] = "DOWN";
    })(WALK = Harvest.WALK || (Harvest.WALK = {}));
    class Avatar extends ƒAid.NodeSprite {
        xSpeed = .9;
        walkLeft;
        walkRight;
        walkUp;
        walkDown;
        constructor() {
            super("AvatarInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }
        walkleftright(_deltaTime) {
            this.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
            //this.mtxLocal.rotateX(this.xSpeed * _deltaTime, true);
        }
        walkupdown(_deltaTime) {
            console.log("updown");
            this.mtxLocal.translateZ(this.xSpeed * _deltaTime, true);
        }
        act(_action) {
            let animation;
            switch (_action) {
                case WALK.LEFT:
                    animation = this.walkLeft;
                    break;
                case WALK.RIGHT:
                    animation = this.walkRight;
                    break;
                case WALK.IDLE:
                    //this.showFrame(0);
                    break;
                case WALK.UP:
                    animation = this.walkUp;
                    break;
                case WALK.DOWN:
                    animation = this.walkDown;
                    break;
            }
        }
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
            this.walkLeft = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.walkLeft.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.walkRight = new ƒAid.SpriteSheetAnimation("Right", coat);
            this.walkRight.generateByGrid(ƒ.Rectangle.GET(0, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
            this.walkUp.generateByGrid(ƒ.Rectangle.GET(0, 48, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
            this.walkDown.generateByGrid(ƒ.Rectangle.GET(32, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.framerate = 20;
        }
    }
    Harvest.Avatar = Avatar;
})(Harvest || (Harvest = {}));
//# sourceMappingURL=Script.js.map