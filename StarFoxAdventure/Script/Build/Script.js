"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class EngineScript extends ƒ.ComponentScript {
        static iSubclass = ƒ.Component.registerSubclass(EngineScript);
        message = "SpaceshipMovement added to ";
        rigidbody;
        power = 15000;
        cmpCrashAudio;
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
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.rigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.hndCollision);
                    this.node.addEventListener("SensorHit", this.hndCollision);
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, this.update);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = () => {
            if (!Script.gameState) {
                return;
            }
            Script.gameState.height = this.node.mtxWorld.translation.y;
            Script.gameState.velocity = Math.round(this.rigidbody.getVelocity().magnitude);
        };
        hndCollision = (_event) => {
            console.log("Bum");
            console.log(_event);
            let audioCrash = new ƒ.Audio("Audio/smb_warning.wav");
            this.cmpCrashAudio = new ƒ.ComponentAudio(audioCrash, false, true);
            this.cmpCrashAudio.connect(true);
            this.cmpCrashAudio.volume = 4;
        };
        yaw(_value) {
            this.rigidbody.applyTorque(new ƒ.Vector3(0, _value * -10, 0));
        }
        pitch(_value) {
            this.rigidbody.applyTorque(ƒ.Vector3.SCALE(this.node.mtxWorld.getX(), _value * 7.5));
        }
        roll(_value) {
            this.rigidbody.applyTorque(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), _value));
        }
        backwards() {
            this.rigidbody.applyForce(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), -this.power));
        }
        thrust() {
            this.rigidbody.applyForce(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), this.power));
        }
    }
    Script.EngineScript = EngineScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        reduceMutator(_mutator) {
            /**/
        }
        height = 1;
        velocity = 2;
        fuel = 20;
        controller;
        constructor() {
            super();
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let Spaceship;
    let graph;
    let viewport;
    let cmpEngine;
    let vctMouse = ƒ.Vector2.ZERO();
    document.addEventListener("interactiveViewportStarted", start);
    window.addEventListener("mousemove", hndMouse);
    function start(_event) {
        Script.gameState = new Script.GameState();
        viewport = _event.detail;
        graph = viewport.getBranch();
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        ƒ.Physics.settings.solverIterations = 300;
        //graph.addEventListener(ƒ.EVENT.RENDER_PREPARE,update)
        Spaceship = graph.getChildrenByName("Spaceship")[0];
        cmpEngine = Spaceship.getComponent(Script.EngineScript);
        let cmpCamera = Spaceship.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
        ;
        viewport.camera = cmpCamera;
        Script.Terrain = graph.getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
        //console.log("Tea", Terrain);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        control();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        //let info:ƒ.TerrainInfo= (Terrain.mesh as ƒ.MeshTerrain).getTerrainInfo(Spaceship.mtxLocal.translation,Terrain.mtxWorld);
        //console.log("INFO",info.distance);
    }
    function hndMouse(e) {
        vctMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
        vctMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
    }
    function control() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
            cmpEngine.thrust();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
            cmpEngine.backwards();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            cmpEngine.roll(-5);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            cmpEngine.roll(5);
        }
        cmpEngine.pitch(vctMouse.y);
        cmpEngine.yaw(vctMouse.x);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class SensorScript extends ƒ.ComponentScript {
        static iSubclass = ƒ.Component.registerSubclass(SensorScript);
        message = "Sensor added to ";
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
                    this.node.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        update = (_event) => {
            if (!Script.Terrain)
                return;
            let mesh = Script.Terrain.mesh;
            let parent = this.node.getParent();
            let info = mesh.getTerrainInfo(parent.mtxLocal.translation, Script.Terrain.mtxWorld);
            console.log(parent.name, info.distance);
            if (info.distance < 0) {
                this.node.dispatchEvent(new Event("SensorHit", { bubbles: true }));
            }
        };
    }
    Script.SensorScript = SensorScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map