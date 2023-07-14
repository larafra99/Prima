namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  //TODO: access Mouse
  //TODO: spawn Opponent, Opponent not define
  export let graph: ƒ.Node;
  export let spriteNode: ƒ.Node;
  export let Opponents: ƒ.Node;
  export let OpponentsTrans:Float32Array;

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera
  let avatar:Avatar;
  let OpponentNode: ƒ.Node;
  let cmpRigidbody: ƒ.ComponentRigidbody;
  let oppoTimer: number= 0;
  let Spawntimer: number= 2.5;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  //TODO: get it to work
  // window.onclick =(event: MouseEvent)=> { 
  //   console.log("clccccc");
  //   avatar.act(ACTION.FIGHT);
  // }

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS
    // cmpCamera = viewport.camera;

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    spriteNode= graph.getChildrenByName("Player")[0];
    cmpRigidbody= spriteNode.getComponent(ƒ.ComponentRigidbody); 
    console.log("Rigid", cmpRigidbody);
    Opponents= graph.getChildrenByName("Opponents")[0]; // get Sprite by name
    // console.log("O", Opponents);
    // console.log("S",spriteNode);

    await hndLoad();
    // spawnOpponents();
    // console.log("O", Opponents);
    // OpponentNode = Opponents.getChildrenByName("Opponent")[0];
    // OpponentNode.mtxLocal.translateX(+3);
    // let oppoRigidbody: ƒ.ComponentRigidbody = OpponentNode.getComponent(ƒ.ComponentRigidbody);
    // console.log(oppoRigidbody);
    // oppoRigidbody.applyForce(ƒ.Vector3.X(15))
    // Opponents.mtxLocal.translateX(-3);
    

    
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

     ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function hndLoad(): Promise<void> {
    avatar = new Avatar();
    ƒ.Loop.start();
  }
  function spawnOpponents(): void{
    // console.log("HEllo");

    oppoTimer += ƒ.Loop.timeFrameGame/1000;
    // console.log(oppoTimer);
    if (oppoTimer> Spawntimer){
      // console.log("HElllo ist me");
      Opponents.addChild(Opponent.createOpponents());
      // Opponents.mtxLocal.translateX(-1.0*ƒ.Loop.timeFrameGame/1000);
      oppoTimer= 0;
    }
    
    // Opponents.mtxLocal.translateX(3);
  }
  

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    //window.addEventListener()
    spawnOpponents();
    // TODO: Knoten wir vor der Gegenererstellung bewegt 
    OpponentsTrans= Opponents.mtxLocal.translation.get()
    // console.log(OpponentsTrans);
    Opponents.mtxLocal.translateX(-1.0*ƒ.Loop.timeFrameGame/1000);
    // console.log("view", Opponents.getChildren());

    
    
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP])) {
      avatar.act(ACTION.FIGHT);
      
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
      avatar.act(ACTION.MISSED);
    }
    else{
      avatar.act(ACTION.IDLE);
    }
    
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

}