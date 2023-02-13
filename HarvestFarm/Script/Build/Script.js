"use strict";
var Harvest;
(function (Harvest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Animal extends ƒAid.NodeSprite {
        walkLeftRight;
        walkUp;
        walkDown;
        sleepAnimation;
        animalStateMachine;
        constructor() {
            super("AnimalInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }
        async initializeAnimations(_imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, _imgSpriteSheet);
            this.walkLeftRight = new ƒAid.SpriteSheetAnimation("Right", coat);
            this.walkLeftRight.generateByGrid(ƒ.Rectangle.GET(10, 475, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
            this.walkUp.generateByGrid(ƒ.Rectangle.GET(10, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
            this.walkDown.generateByGrid(ƒ.Rectangle.GET(10, 70, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.sleepAnimation = new ƒAid.SpriteSheetAnimation("Sleep", coat);
            this.sleepAnimation.generateByGrid(ƒ.Rectangle.GET(480, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.framerate = 25;
            this.setAnimation(this.walkDown);
            this.animalStateMachine = new Harvest.AnimalStateMachine();
            this.addComponent(this.animalStateMachine);
        }
    }
    Harvest.Animal = Animal;
})(Harvest || (Harvest = {}));
var Harvest;
(function (Harvest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let ANIMAL_WALK;
    (function (ANIMAL_WALK) {
        ANIMAL_WALK[ANIMAL_WALK["IDLE"] = 0] = "IDLE";
        ANIMAL_WALK[ANIMAL_WALK["LEFTRIGHT"] = 1] = "LEFTRIGHT";
        ANIMAL_WALK[ANIMAL_WALK["UP"] = 2] = "UP";
        ANIMAL_WALK[ANIMAL_WALK["DOWN"] = 3] = "DOWN";
        ANIMAL_WALK[ANIMAL_WALK["SLEEP"] = 4] = "SLEEP";
    })(ANIMAL_WALK = Harvest.ANIMAL_WALK || (Harvest.ANIMAL_WALK = {}));
    class AnimalStateMachine extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(AnimalStateMachine);
        static instructions = AnimalStateMachine.get();
        //   public forceEscape: number = 25;
        //   public torqueIdle: number = 5;
        //   private cmpBody: ƒ.ComponentRigidbody;
        //   private cmpMaterial: ƒ.ComponentMaterial;
        constructor() {
            super();
            this.instructions = AnimalStateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = AnimalStateMachine.transitDefault;
            setup.actDefault = AnimalStateMachine.actDefault;
            setup.setAction(ANIMAL_WALK.IDLE, this.actIdle);
            setup.setAction(ANIMAL_WALK.DOWN, this.actWalk);
            setup.setAction(ANIMAL_WALK.SLEEP, this.actSleep);
            //setup.setTransition(ANIMAL_WALK.IDLE, ANIMAL_WALK.DOWN, <ƒ.General>this.transitDie);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            console.log(ANIMAL_WALK[_machine.stateCurrent]);
        }
        static async actIdle(_machine) {
            _machine.node.mtxLocal.rotateY(5);
        }
        static async actWalk(_machine) {
            _machine.node.mtxLocal.rotateY(5);
            // _machine.cmpMaterial.clrPrimary = ƒ.Color.CSS("white");
            // let difference: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_machine.node.mtxWorld.translation, cart.mtxWorld.translation);
            // difference.normalize(_machine.forceEscape);
            // _machine.cmpBody.applyForce(difference);
            // StateMachine.actDefault(_machine);
        }
        static async actSleep(_machine) {
            _machine.node.mtxLocal.rotateY(5);
            //
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    console.log("Statemachine");
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    this.transit(ANIMAL_WALK.IDLE);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    console.log("Statemachine");
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    console.log("Statemachine");
                    this.transit(ANIMAL_WALK.IDLE);
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
    }
    Harvest.AnimalStateMachine = AnimalStateMachine;
})(Harvest || (Harvest = {}));
var Harvest;
(function (Harvest) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Harvest); // Register the namespace to FUDGE for serialization
    class CharacterEventScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CharacterEventScript);
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
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    //this.startNewDay();
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.update);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = (_event) => {
            if (!Harvest.graph) {
                return;
            }
            this.getDistance();
        };
        getDistance() {
            if (this.node.mtxWorld.translation.x > -5 && this.node.mtxWorld.translation.x < 5 && this.node.mtxWorld.translation.z > -5 && this.node.mtxWorld.translation.z < 5) {
                //console.log("Yes");
                Harvest.onField = true;
            }
            else {
                Harvest.onField = false;
                let house = Harvest.graph.getChildrenByName("House")[0];
                let distance = ƒ.Vector3.DIFFERENCE(this.node.mtxWorld.translation, house.mtxWorld.translation);
                //console.log("d",distance.magnitude);
                if (distance.magnitude < 1.6) {
                    Harvest.nearHouse = true;
                }
                else {
                    Harvest.nearHouse = false;
                }
            }
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
    let animalNode;
    let viewport;
    let cmpCamera;
    let cmpBgAudio;
    let avatar;
    let animal;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        let response = await fetch("config.json");
        let config = await response.json();
        Harvest.stamina = config.stamina;
        Harvest.vitality = config.vitality;
        Harvest.playerstate = new Harvest.UserInterface(config);
        //console.log("P",playerstate);
        viewport = _event.detail;
        Harvest.graph = viewport.getBranch();
        cmpCamera = viewport.camera;
        Harvest.spriteNode = Harvest.graph.getChildrenByName("Player")[0]; // get Sprite by name
        animalNode = Harvest.graph.getChildrenByName("Animal")[0];
        //console.log("animal", animalNode);
        cmpCamera.mtxPivot.rotateY(180);
        cmpCamera.mtxPivot.rotateX(20);
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 8, 25);
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        let waterButton = document.getElementById("wateringCan");
        waterButton.addEventListener("click", function () { checkButton("wateringCan"); });
        let hoeButton = document.getElementById("hoe");
        hoeButton.addEventListener("click", function () { checkButton("hoe"); });
        let scytheButton = document.getElementById("scythe");
        scytheButton.addEventListener("click", function () { checkButton("scythe"); });
        let seedButton = document.getElementById("seed");
        seedButton.addEventListener("click", function () { checkButton("seed"); });
        //cmpField =graph.getChildrenByName("Ground")[0].getChildrenByName("Field")[0].getComponent(ƒ.ComponentMesh);
        //console.log("Field",cmpField);
        await hndLoad();
        bgAudio();
    }
    async function hndLoad() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/PlayerSprite.png");
        avatar = new Harvest.Avatar();
        avatar.initializeAnimations(imgSpriteSheet);
        avatar.act(Harvest.ACTION.DOWN);
        avatar.act(Harvest.ACTION.IDLE);
        Harvest.spriteNode.addChild(avatar);
        await loadAnimal();
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    async function loadAnimal() {
        //TODO: Exchange for animal sprites
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/PlayerSprite.png");
        animal = new Harvest.Animal();
        animal.initializeAnimations(imgSpriteSheet);
        animalNode.addChild(animal);
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
    function startNewDay() {
        Harvest.playerstate.stamina = Harvest.stamina;
        Harvest.playerstate.vitality = Harvest.vitality;
        Harvest.playerstate.day++;
        // can be deletet later 
        Harvest.spriteNode.mtxLocal.translation = new ƒ.Vector3(-6, 0, -6);
    }
    function checkButton(id) {
        if (id == "wateringCan") {
            console.log("water");
            Harvest.farmingTool = 1;
        }
        else if (id == "hoe") {
            console.log("hoe");
            Harvest.farmingTool = 0;
        }
        else if (id == "scythe") {
            console.log("scythe");
            Harvest.farmingTool = 2;
        }
        else if (id == "seed") {
            console.log("seed");
            Harvest.farmingTool = 3;
        }
        if (Harvest.onField) {
            //TODO:action gießen, hacken, etc. mit musik
            Harvest.playerstate.stamina = Harvest.playerstate.stamina - 5;
            avatar.act(Harvest.ACTION.INTERACTION);
        }
    }
    function update(_event) {
        ƒ.Physics.simulate();
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            Harvest.spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
            avatar.act(Harvest.ACTION.LEFTRIGHT);
            avatar.walkleftright(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            Harvest.spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
            avatar.act(Harvest.ACTION.LEFTRIGHT);
            avatar.walkleftright(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            Harvest.spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
            avatar.act(Harvest.ACTION.UP);
            avatar.walkupdown(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            Harvest.spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
            avatar.act(Harvest.ACTION.DOWN);
            avatar.walkupdown(deltaTime);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
            if (Harvest.nearHouse) {
                startNewDay();
            }
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
        xSpeed = 1.1;
        interaction;
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
            Harvest.spriteNode.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }
        walkupdown(_deltaTime) {
            Harvest.spriteNode.mtxLocal.translateZ(this.xSpeed * _deltaTime, true);
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
                    if (Harvest.farmingTool == 3) {
                        // Seed setting 
                        break;
                    }
                    this.interaction = true;
                    if (this.animationCurrent == this.walkLeftRight) {
                        this.showFrame(Harvest.farmingTool);
                        animation = this.fieldActionRight;
                        console.log("Left");
                        break;
                    }
                    else if (this.animationCurrent == this.walkUp) {
                        this.showFrame(Harvest.farmingTool);
                        animation = this.fieldActionUp;
                        console.log("UP");
                        break;
                    }
                    else if (this.animationCurrent == this.walkDown) {
                        this.showFrame(Harvest.farmingTool);
                        animation = this.fieldActionDown;
                        console.log("Down");
                        break;
                    }
            }
            if (_action == ACTION.IDLE) {
                if (this.interaction) {
                    animation = this.animationCurrent;
                    this.interaction = false;
                }
                this.showFrame(0);
            }
            else if (animation != this.animationCurrent && _action != ACTION.INTERACTION) {
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
            this.fieldActionRight = new ƒAid.SpriteSheetAnimation("Actionright", coat);
            this.fieldActionRight.generateByGrid(ƒ.Rectangle.GET(480, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.fieldActionUp = new ƒAid.SpriteSheetAnimation("Actionup", coat);
            this.fieldActionUp.generateByGrid(ƒ.Rectangle.GET(480, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.fieldActionDown = new ƒAid.SpriteSheetAnimation("Actiondown", coat);
            this.fieldActionDown.generateByGrid(ƒ.Rectangle.GET(480, 65, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            this.framerate = 25;
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
        stamina;
        vitality;
        day;
        time;
        controller;
        constructor(_config) {
            super();
            this.stamina = _config.stamina;
            this.vitality = _config.vitality;
            this.day = 0;
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
            //console.log(this.controller);
        }
    }
    Harvest.UserInterface = UserInterface;
})(Harvest || (Harvest = {}));
//# sourceMappingURL=Script.js.map