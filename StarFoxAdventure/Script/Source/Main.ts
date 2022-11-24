namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let Spaceship:ƒ.Node;
  let graph: ƒ.Node;
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph= viewport.getBranch();
    
    //graph.addEventListener(ƒ.EVENT.RENDER_PREPARE,update)
    Spaceship= graph.getChildrenByName("Spaceship")[0];
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
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

}