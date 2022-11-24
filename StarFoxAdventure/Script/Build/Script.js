"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    // class need to be named like the file
    class EngineScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(EngineScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "SpaceshipMovement added to ";
        rgdBodySpaceship;
        strafeThrust = 20;
        forwardthrust = 50;
        relativeX;
        relativeY;
        relativeZ;
        width = 0;
        height = 0;
        xAxis = 0;
        yAxis = 0;
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
                    this.rgdBodySpaceship = this.node.getComponent(ƒ.ComponentRigidbody);
                    // this.rgdBodySpaceship.addVelocity(new ƒ.Vector3(0, 0, 10));
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    console.log(this.node);
                    window.addEventListener("mousemove", this.handleMouse);
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
        update = () => {
            this.setRelativeAxes();
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                this.thrust();
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                this.backwards();
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                this.rollLeft();
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                this.rollRight();
            }
            //this.rgdBodySpaceship.applyTorque(new ƒ.Vector3(0, this.xAxis * -10, 0));
            //this.rgdBodySpaceship.applyTorque(ƒ.Vector3.SCALE(this.relativeX, this.yAxis * 1.5));
        };
        handleMouse = (e) => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            let mousePositionY = e.clientY;
            let mousePositionX = e.clientX;
            this.xAxis = 2 * (mousePositionX / this.width) - 1;
            this.yAxis = 2 * (mousePositionY / this.height) - 1;
        };
        setRelativeAxes() {
            this.relativeZ = this.node.mtxWorld.getZ();
            this.relativeY = this.node.mtxWorld.getY();
            this.relativeX = this.node.mtxWorld.getX();
        }
        backwards() {
            this.rgdBodySpaceship.applyForce(ƒ.Vector3.SCALE(this.relativeZ, -this.forwardthrust));
        }
        thrust() {
            let scaledRotatedDirection = ƒ.Vector3.SCALE(this.relativeZ, this.forwardthrust);
            this.rgdBodySpaceship.applyForce(scaledRotatedDirection);
        }
        rollLeft() {
            this.rgdBodySpaceship.applyTorque(ƒ.Vector3.SCALE(this.relativeZ, -1));
        }
        rollRight() {
            this.rgdBodySpaceship.applyTorque(ƒ.Vector3.SCALE(this.relativeZ, 1));
        }
    }
    Script.EngineScript = EngineScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let Spaceship;
    let graph;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        //graph.addEventListener(ƒ.EVENT.RENDER_PREPARE,update)
        Spaceship = graph.getChildrenByName("Spaceship")[0];
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        // let rigidbody:ƒ.ComponentRigidbody= Spaceship.getComponent(ƒ.ComponentRigidbody);
        // //rigidbody.applyTorque(ƒ.Vector3.Y(1));
        // //rigidbody.applyLinearImpulse(ƒ.Vector3.X(20));
        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])){
        //   rigidbody.applyForce(ƒ.Vector3.Z(2));
        // }
        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
        //   rigidbody.applyForce(ƒ.Vector3.Z(-2));
        // }
        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
        //   rigidbody.applyForce(ƒ.Vector3.X(2));
        // }
        // if (ƒ.Keyboard.isPressedOne([ ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT])){
        //   rigidbody.applyForce(ƒ.Vector3.X(-2));
        // }
    }
    // für die drehung 
    //this.relativeZ = this.node.mtxWorld.getZ();
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map