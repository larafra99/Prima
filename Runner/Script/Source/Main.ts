namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  //TODO: access Mouse
  //TODO: spawn Opponent, Opponent not define
  export let graph: ƒ.Node;
  export let spriteNode: ƒ.Node;
  export let Opponents: ƒ.Node;
  export let OpponentsTrans:Float32Array;
  export let avatar:Avatar;
  export let ui:UserInterface;

  export let fight: boolean = false;
  export let missedOpponnent:boolean = false;
  export let json: {[key: string]: number};
  export let petNode:ƒ.Node;
  export let petStateMachine: PetState;

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera;
  
  
  let oppoTimer: number= 0;
  let hitTimer:number= 0;


  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  //TODO: get it to work
  // window.onclick =(event: MouseEvent)=> { 
  //   console.log("clccccc");
  //   avatar.act(ACTION.FIGHT);
  // }

  async function start(_event: CustomEvent): Promise<void> {
    let response = await fetch("config.json");
    let json = await response.json();
    ui= new UserInterface(json);
    petStateMachine= new PetState();

    viewport = _event.detail;
    graph = viewport.getBranch();
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS
    cmpCamera = viewport.camera;
    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;

    spriteNode= graph.getChildrenByName("Player")[0];
    Opponents= graph.getChildrenByName("Opponents")[0];
    petNode= graph.getChildrenByName("Pet")[0];
    // console.log("O", Opponents);
    // console.log("S",spriteNode);

    let resetButton: HTMLButtonElement =<HTMLButtonElement>document.getElementById("resetbutton");
    resetButton.addEventListener("click", function (): void {reset()});
    

    await hndLoad();
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

     ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function hndLoad(): Promise<void> {
    avatar = new Avatar();
    ƒ.Loop.start();
  }

  function spawnTimer():number{
    return (Math.random() * (8 - 1.2) + 1.2);
  }

  function spawnOpponents(): void{
    oppoTimer += ƒ.Loop.timeFrameGame/1000;
    // if (oppoTimer> spawnTimer()){
    if (oppoTimer> 5){
      Opponents.addChild(Opponent.createOpponents());
      oppoTimer= 0;
    }
  }
  function hitOpponent():void{
    hitTimer += ƒ.Loop.timeFrameGame/1000;
    if (hitTimer> 0.4 && fight ){
      fight = false;
      hitTimer= 0;
    }
  }
  
  
  

  function update(_event: Event): void {
    ƒ.Physics.simulate(); 
    //window.addEventListener()
    spawnOpponents();
    OpponentsTrans= Opponents.mtxLocal.translation.get()
    Opponents.mtxLocal.translateX(-1.0*ƒ.Loop.timeFrameGame/1000);
    hitOpponent();
    // console.log(fight);


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
  function reset():void{
    console.log("Reset");
    ui.money= 0;
    ui.speed= 15;
    petNode.dispatchEvent(new Event("Reset", {bubbles: true}));
    missedOpponnent= false;
    avatar.act(ACTION.IDLE);
    
    
  }

}