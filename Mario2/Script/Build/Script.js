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
    document.addEventListener("interactiveViewportStarted", start);
    let viewport;
    let marioNode;
    let marioSprite;
    let marioSpeed = 3.0;
    let facing = true; // true = right
    let ySpeed = 0;
    function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        let branch = viewport.getBranch();
        marioNode = branch.getChildrenByName("MarioPosition")[0]; // get Sprite by name
        loadSprite();
    }
    async function loadSprite() {
        let spriteSheet = new ƒ.TextureImage();
        await spriteSheet.load("./Images/mariowalkx16.gif");
        let coat = new ƒ.CoatTextured(undefined, spriteSheet);
        let walkanimation = new ƒAid.SpriteSheetAnimation("walk", coat);
        walkanimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 12, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        marioSprite = new ƒAid.NodeSprite("Avatar");
        marioSprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        marioSprite.setAnimation(walkanimation);
        marioSprite.mtxLocal.translateY(+0.5); // mtx = Matrix 
        marioSprite.framerate = 10;
        marioNode.addChild(marioSprite);
    }
    function checkcollision() {
        let graph = viewport.getBranch();
        let blocks = graph.getChildrenByName("Floor")[0];
        let pos = marioNode.mtxLocal.translation;
        for (let block of blocks.getChildren()) {
            let blockpos = block.mtxLocal.translation;
            if (pos.x - blockpos.x < 0.5) {
                if (pos.y < blockpos.x + 0.5) {
                    pos.y = blockpos.y + 0.5;
                    marioNode.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
    function update(_event) {
        let gravity = 5;
        let jumpForce = 3;
        let deltaTime = marioSpeed * ƒ.Loop.timeFrameGame / 1000;
        let ySpeed = 0;
        ySpeed -= gravity * deltaTime;
        let pos = marioNode.mtxLocal.translation;
        checkcollision();
        if (pos.y + ySpeed > 0)
            marioNode.mtxLocal.translateY(ySpeed);
        else {
            ySpeed = 0;
            pos.y = 0;
            //marioPos.mtxLocal.translation = pos;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            marioNode.mtxLocal.translateX(deltaTime);
            if (!facing) {
                marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
                facing = true;
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            marioNode.mtxLocal.translateX(-deltaTime);
            if (facing) {
                marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180);
                facing = false;
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            marioNode.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
            ySpeed = jumpForce;
        }
        marioNode.mtxLocal.translateY(ySpeed);
        if (marioNode.mtxLocal.translation.y <= 0) {
            marioNode.mtxLocal.translation.y = 0;
        }
        ƒ.Loop.timeFrameGame;
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
// animationsstautus let current animation für sprint 
//sprint 
// animation -->sprite stop 
// mutatoren anschauen 
// test rectangle
//# sourceMappingURL=Script.js.map