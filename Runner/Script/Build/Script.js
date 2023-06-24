"use strict";
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
        // cmpCamera = viewport.camera;
        cmpCamera = Runner.graph.getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        Runner.spriteNode = Runner.graph.getChildrenByName("Player")[0];
        Runner.Opponents = Runner.graph.getChildrenByName("Opponents")[0]; // get Sprite by name
        //console.log("S",spriteNode);
        await hndLoad();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    async function hndLoad() {
        avatar = new Runner.Avatar();
        ƒ.Loop.start();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        //window.addEventListener()
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
    ƒ.Project.registerScriptNamespace(Runner); // Register the namespace to FUDGE for serialization
    class OpponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(OpponentScript);
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
                    if (!Runner.Opponents) {
                        return;
                    }
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    this.loadOppo();
                    break;
            }
        };
        async loadOppo() {
            console.log("ASDFGHJ");
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("./Image/Sprite1.png");
            Runner.Opponents.addChild;
        }
    }
    Runner.OpponentScript = OpponentScript;
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
        constructor() {
            super("AvatarInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }
        act(_action) {
            //     let animation: ƒAid.SpriteSheetAnimation;
            switch (_action) {
                case ACTION.FIGHT:
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0];
                    this.missedOpponnent = false;
                    break;
                case ACTION.IDLE:
                    Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0];
                    if (this.missedOpponnent) {
                        Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = 5;
                    }
                    else {
                        Runner.spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = 15;
                    }
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
//# sourceMappingURL=Script.js.map