"use strict";
var Harvest;
(function (Harvest) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Harvest); // Register the namespace to FUDGE for serialization
    class CharacterEventScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CharacterEventScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        eventAudio;
        stamina;
        vitality;
        startpoint;
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
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    console.log("Startpoint", this.startpoint);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        startNewDay() {
            this.node.mtxLocal.set(this.startpoint);
            this.stamina = Harvest.playerstate.stamina;
            this.vitality = Harvest.playerstate.vitality;
        }
    }
    Harvest.CharacterEventScript = CharacterEventScript;
})(Harvest || (Harvest = {}));
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
    let viewport;
    let cmpCamera;
    let cmpBgAudio;
    let avatar;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        let response = await fetch("config.json");
        let config = await response.json();
        Harvest.playerstate = new Harvest.UserInterface(config);
        viewport = _event.detail;
        cmpCamera = viewport.camera;
        //TODO: camera at an angle 
        cmpCamera.mtxPivot.rotateY(+180);
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 0, 20);
        hndLoad(_event);
        bgAudio();
    }
    async function hndLoad(_event) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/PlayerSprite.png");
        Harvest.graph = viewport.getBranch();
        avatar = new Harvest.Avatar();
        avatar.initializeAnimations(imgSpriteSheet);
        avatar.act(Harvest.ACTION.DOWN);
        avatar.act(Harvest.ACTION.IDLE);
        Harvest.graph.addChild(avatar);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function updateCamera() {
        //TODO: camera walking with character
    }
    async function bgAudio() {
        let bgMusic = new ƒ.Audio("Audio/BGM_Spring.mp3");
        cmpBgAudio = new ƒ.ComponentAudio(bgMusic, true, true);
        cmpBgAudio.connect(true);
        cmpBgAudio.volume = 4;
    }
    function update(_event) {
        if (!Harvest.UserInterface) {
            return;
        }
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
            avatar.act(Harvest.ACTION.LEFTRIGHT);
            avatar.walkleftright(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
            avatar.act(Harvest.ACTION.LEFTRIGHT);
            avatar.walkleftright(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
            avatar.act(Harvest.ACTION.UP);
            avatar.walkupdown(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
            avatar.act(Harvest.ACTION.DOWN);
            avatar.walkupdown(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
            avatar.act(Harvest.ACTION.INTERACTION);
            //TODO:action gießen, hacken, etc. mit musik
        }
        else {
            avatar.act(Harvest.ACTION.IDLE);
        }
        viewport.draw();
        updateCamera();
    }
})(Harvest || (Harvest = {}));
var Harvest;
(function (Harvest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["IDLE"] = 0] = "IDLE";
        ACTION[ACTION["LEFTRIGHT"] = 1] = "LEFTRIGHT";
        ACTION[ACTION["UP"] = 2] = "UP";
        ACTION[ACTION["DOWN"] = 3] = "DOWN";
        ACTION[ACTION["INTERACTION"] = 4] = "INTERACTION";
    })(ACTION = Harvest.ACTION || (Harvest.ACTION = {}));
    class Avatar extends ƒAid.NodeSprite {
        xSpeed = .9;
        animationCurrent;
        walkLeftRight;
        walkUp;
        walkDown;
        fieldActionLeft;
        fieldActionRight;
        fieldActionUp;
        fieldActionDown;
        //playerstate.stamina= this.node.mtxWorld.translation.y;
        //playerstate.vitality= Math.round(this.rigidbody.getVelocity().magnitude);
        constructor() {
            super("AvatarInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }
        walkleftright(_deltaTime) {
            this.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }
        walkupdown(_deltaTime) {
            this.mtxLocal.translateZ(this.xSpeed * _deltaTime, true);
        }
        act(_action) {
            let animation;
            switch (_action) {
                case ACTION.LEFTRIGHT:
                    animation = this.walkLeftRight;
                    break;
                case ACTION.IDLE:
                    break;
                case ACTION.UP:
                    animation = this.walkUp;
                    break;
                case ACTION.DOWN:
                    animation = this.walkDown;
                    break;
                case ACTION.INTERACTION:
                    break;
            }
            if (_action == ACTION.INTERACTION) {
                if (this.animationCurrent == this.walkLeftRight) {
                    animation = this.fieldActionRight;
                    console.log("Left");
                }
                else if (this.animationCurrent == this.walkUp) {
                    animation = this.fieldActionUp;
                    console.log("UP");
                }
                else if (this.animationCurrent == this.walkDown) {
                    animation = this.fieldActionDown;
                    console.log("Down");
                }
                console.log("YESSSS");
            }
            if (_action == ACTION.IDLE) {
                this.showFrame(0);
            }
            else if (animation != this.animationCurrent) {
                this.setAnimation(animation);
                this.animationCurrent = animation;
            }
        }
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
            this.walkLeftRight = new ƒAid.SpriteSheetAnimation("Right", coat);
            this.walkLeftRight.generateByGrid(ƒ.Rectangle.GET(10, 475, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
            this.walkUp.generateByGrid(ƒ.Rectangle.GET(10, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
            this.walkDown.generateByGrid(ƒ.Rectangle.GET(10, 70, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.fieldActionLeft = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionLeft.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.fieldActionRight = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionRight.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.fieldActionUp = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionUp.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.fieldActionDown = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionDown.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.framerate = 20;
            //this.mtxLocal.translateY(+0.5);
        }
    }
    Harvest.Avatar = Avatar;
})(Harvest || (Harvest = {}));
var Harvest;
(function (Harvest) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class UserInterface extends ƒ.Mutable {
        reduceMutator(_mutator) {
            /**/
        }
        stamina = 100;
        vitality = 50;
        //public time: TimerHandler
        controller;
        constructor(_config) {
            super();
            this.stamina = _config.stamina;
            this.vitality = _config.vitality;
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
    }
    Harvest.UserInterface = UserInterface;
})(Harvest || (Harvest = {}));
//# sourceMappingURL=Script.js.map