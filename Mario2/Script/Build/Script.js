"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        xSpeedDefault = 0.9;
        xSpeedSprint = 3;
        walkanimation;
        ySpeed = 1;
        gravity = 5;
        constructor() {
            super("Avatar");
            this.addComponent(new ƒ.ComponentTransform());
        }
        update(_deltaTime) {
            this.ySpeed -= this.gravity * _deltaTime;
            let yOffset = this.ySpeed * _deltaTime;
            this.mtxLocal.translateY(yOffset);
        }
        initializeAnimation(_imageSpriteSheer) {
            let coat = new ƒ.CoatTextured(undefined, _imageSpriteSheer);
            this.walkanimation = new ƒAid.SpriteSheetAnimation("walk", coat);
            this.walkanimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 12, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        }
    }
    Script.Avatar = Avatar;
})(Script || (Script = {}));
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
var Script;
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    document.addEventListener("interactiveViewportStarted", start);
    let marioNode;
    let branch;
    let marioSprite;
    let cmpTimeAudio;
    let marioSpeed = 3.0;
    let facing = true; // true = right
    // let ySpeed: number  = 0;
    function start(_event) {
        Script.viewport = _event.detail;
        Script.viewport.camera.mtxPivot.translateZ(20);
        Script.viewport.camera.mtxPivot.rotateY(180);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        branch = Script.viewport.getBranch();
        marioNode = branch.getChildrenByName("MarioPosition")[0]; // get Sprite by name
        loadSprite();
        audio();
    }
    async function loadSprite() {
        let spriteSheet = new ƒ.TextureImage();
        await spriteSheet.load("./Images/PlayerSprite.png");
        let coat = new ƒ.CoatTextured(undefined, spriteSheet);
        let walkanimation = new ƒAid.SpriteSheetAnimation("walk", coat);
        walkanimation.generateByGrid(ƒ.Rectangle.GET(10, 475, 86, 100), 3, 70, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
        marioSprite = new ƒAid.NodeSprite("marioSprite");
        marioSprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        marioSprite.setAnimation(walkanimation);
        marioSprite.mtxLocal.translateY(+0.5); // mtx = Matrix 
        marioSprite.framerate = 10;
        marioNode.addChild(marioSprite);
        let avatarInstance = new Script.Avatar();
        avatarInstance.initializeAnimation(spriteSheet);
        branch.addChild(avatarInstance);
        avatarInstance.update;
        let cmpAudio = branch.getComponent(ƒ.ComponentAudio);
        //cmpAudio
        console.log("CMPAudio", cmpAudio);
    }
    // function checkCollision():void {
    //   let blocks:ƒ.Node = branch.getChildrenByName("Floor")[0];
    //   let pos: ƒ.Vector3 = marioNode.mtxLocal.translation;
    //   for(let block of blocks.getChildren()){
    //     let blockpos: ƒ.Vector3 = block.mtxLocal.translation;
    //     if (Math.abs(pos.x - blockpos.x) < 0.5){
    //       if(pos.y<blockpos.x+0.5){
    //         pos.y = blockpos.y +0.5;
    //         marioNode.mtxLocal.translation = pos;
    //         ySpeed = 0;
    //       }
    //     }
    //   }
    // }
    async function audio() {
        let audioWarning = new ƒ.Audio("Audio/smb_warning.wav");
        cmpTimeAudio = new ƒ.ComponentAudio(audioWarning, false, false);
        cmpTimeAudio.connect(true);
        cmpTimeAudio.volume = 4;
    }
    function update(_event) {
        let gravity = 5;
        let jumpForce = 3;
        let deltaTime = marioSpeed * ƒ.Loop.timeFrameGame / 1000;
        let ySpeed = 0;
        ySpeed -= gravity * deltaTime;
        let yOffset = ySpeed * deltaTime;
        let pos = marioNode.mtxLocal.translation;
        if (pos.y + yOffset > 0)
            marioNode.mtxLocal.translateY(yOffset);
        else {
            ySpeed = 0;
            pos.y = 0;
            marioNode.mtxLocal.translation = pos;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            marioNode.mtxLocal.translateX(deltaTime);
            cmpTimeAudio.play(true);
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
        //checkCollision();
        ƒ.Loop.timeFrameGame;
        // ƒ.Physics.simulate();  // if physics is included and used
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptRotator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptRotator);
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
                    //ƒ.Debug.log(this.message, this.node);
                    this.node.addComponent(new ƒ.ComponentTransform());
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
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
        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
        update = (_event) => {
            console.log("Eventlistener loop");
            this.node.mtxLocal.rotateY(1);
        };
    }
    Script.ScriptRotator = ScriptRotator;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map