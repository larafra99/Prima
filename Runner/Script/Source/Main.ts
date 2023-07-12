namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  //TODO: access Mouse
  //TODO: spawn Opponent, Opponent not define
  export let graph: ƒ.Node;
  export let spriteNode: ƒ.Node;
  export let Opponents: ƒ.Node;

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera
  let avatar:Avatar;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  //TODO: get it to work
  // window.onclick =(event: MouseEvent)=> { 
  //   console.log("clccccc");
  //   avatar.act(ACTION.FIGHT);
  // }

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    // cmpCamera = viewport.camera;

    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    spriteNode= graph.getChildrenByName("Player")[0];
    Opponents= graph.getChildrenByName("Opponents")[0]; // get Sprite by name
    // console.log("O", Opponents);
    // console.log("S",spriteNode);

    await hndLoad();
    spawnOpponents();
    

    
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function hndLoad(): Promise<void> {
    avatar = new Avatar();
    ƒ.Loop.start();
  }
  function spawnOpponents(){
    // console.log("HEllo");
    Opponents.addChild(Opponent.createOpponents());
  }
  

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    //window.addEventListener()
    // spawnOpponents();
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