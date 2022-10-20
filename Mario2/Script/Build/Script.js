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
var Script;
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let marioPos;
    let marioSpeed = 3.0;
    let marioSprite;
    let facing = true; // true = right
    function start(_event) {
        viewport = _event.detail;
        loadSprite();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        console.log(viewport);
        let branch = viewport.getBranch();
        console.log(branch);
        marioPos = branch.getChildrenByName("MarioPosition")[0]; // get Sprite by name
        console.log("Mario", marioPos);
    }
    async function loadSprite() {
        let spriteSheet = new ƒ.TextureImage();
        await spriteSheet.load("./Images/mariowalkx16.gif");
        let coat = new ƒ.CoatTextured(undefined, spriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation("walk", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 12, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        marioSprite = new ƒAid.NodeSprite("Sprite");
        marioSprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        marioSprite.setAnimation(animation);
        marioSprite.setFrameDirection(1);
        marioSprite.mtxLocal.translateY(+0.5); // mtx = Matrix 
        marioSprite.framerate = 10;
        marioPos.removeAllChildren();
        marioPos.addChild(marioSprite);
        viewport.draw();
    }
    function update(_event) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            marioPos.mtxLocal.translateX(marioSpeed * ƒ.Loop.timeFrameGame / 1000);
            if (!facing) {
                marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
                facing = true;
            }
            //marioPos.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(0.01);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            marioPos.mtxLocal.translateX(-marioSpeed * ƒ.Loop.timeFrameGame / 1000);
            if (facing) {
                marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
                facing = false;
            }
        }
        ƒ.Loop.timeFrameGame;
        //console.log( ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W,ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.S,ƒ.KEYBOARD_CODE.D]));
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map