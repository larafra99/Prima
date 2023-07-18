namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
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
  export let playerFps: number;
  export let opponentSpeed:number;

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera;
  let cmpAudio:ƒ.ComponentAudio;
  let oppoSkin:ƒ.Material;
  
  
  let oppoTimer: number= 0;
  let hitTimer:number= 0;

  let bgMusic: ƒ.Audio = new ƒ.Audio("Sound/background.mp3");
  let swordAudio: ƒ.Audio = new ƒ.Audio("Sound/sword.wav");

  let changOopposkinButton: HTMLButtonElement;
  let buttonCounter:number =0;
  let randomOppo:boolean = false;


  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
 

  async function start(_event: CustomEvent): Promise<void> {
    let response = await fetch("config.json");
    let json = await response.json();
    ui= new UserInterface(json);
    petStateMachine= new PetState();

    viewport = _event.detail;
    graph = viewport.getBranch();
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS
    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    cmpAudio = graph.getComponent(ƒ.ComponentAudio);

    spriteNode= graph.getChildrenByName("Player")[0];
    Opponents= graph.getChildrenByName("Opponents")[0];
    petNode= graph.getChildrenByName("Pet")[0];
    playerFps= spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps;
    opponentSpeed= ui.speed*0.01;
    oppoSkin= ƒ.Project.getResourcesByName("OpponentShader")[0] as ƒ.Material;

    let resetButton: HTMLButtonElement =<HTMLButtonElement>document.getElementById("resetbutton");
    resetButton.addEventListener("click", function (): void {reset()});
    let OpponentMultiplicatorButton: HTMLButtonElement =<HTMLButtonElement>document.getElementById("opponentbutton");
    OpponentMultiplicatorButton.addEventListener("click", function (): void {checkButton("oppo")});
    let moneyMulitpilactorButton: HTMLButtonElement =<HTMLButtonElement>document.getElementById("multipicatorbutton");
    moneyMulitpilactorButton.addEventListener("click", function (): void {checkButton("money")});
    let maxSpeedButton: HTMLButtonElement =<HTMLButtonElement>document.getElementById("maxspeedbutton");
    maxSpeedButton.addEventListener("click", function (): void {checkButton("speed")});
    changOopposkinButton =<HTMLButtonElement>document.getElementById("changeopposkinbutton");
    changOopposkinButton.textContent="Anderer Gegener";
    changOopposkinButton.addEventListener("click", function (): void {checkButton("skin")});
    
    await hndLoad();
    bgAudio();
  
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
     ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function hndLoad(): Promise<void> {
    avatar = new Avatar();
    ƒ.Loop.start();
  }
  function bgAudio():void{

    cmpAudio = new ƒ.ComponentAudio(bgMusic,true,true);
    cmpAudio.connect(true);
    cmpAudio.volume=2;
  }
  
  function spawnTimer():number{
    return (Math.random() * (12 - 0.9) + 0.9);
  }

  function spawnOpponents(): void{
    if(randomOppo){
      if(Math.random()<0.5){
        oppoSkin= ƒ.Project.getResourcesByName("OpponentShader")[0] as ƒ.Material;
      }
      else{
        oppoSkin=ƒ.Project.getResourcesByName("OpponentShader2")[0] as ƒ.Material;
      }
    }
    oppoTimer += ƒ.Loop.timeFrameGame/1000;
    if (oppoTimer> spawnTimer()){
    // if (oppoTimer> 3){
      document.getElementById("transaktion").innerText="";
      Opponents.addChild(Opponent.createOpponents(oppoSkin));
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

  function checkButton(add:string):void{
    if(add=="oppo"&&ui.money>=50){
      ui.opponentmulitplicator=ui.opponentmulitplicator+1;
      ui.money= parseFloat((ui.money-50).toFixed(1));;
    }
    else if( add== "money" && ui.money>=20){
      ui.moneymultipilcator= ui.moneymultipilcator+0.1;
      ui.money= parseFloat((ui.money-20).toFixed(1));
    }
    else if(add=="speed" && ui.money>=100){
      ui.maxspeed= ui.maxspeed+1;
      ui.money= parseFloat((ui.money-100).toFixed(1));;
    }
    else if(add=="skin" && ui.money>=500){
      if(buttonCounter==0){
        oppoSkin= ƒ.Project.getResourcesByName("OpponentShader2")[0] as ƒ.Material;
        changOopposkinButton.textContent="Random Gegner"

      }
      else if(buttonCounter==1){
        randomOppo=true;
        changOopposkinButton.disabled = true;
        changOopposkinButton.hidden= true;

      
      }
      ui.money= parseFloat((ui.money-500).toFixed(1));;
      buttonCounter= buttonCounter+1;
    }
    else{
      document.getElementById("transaktion").innerText= "Geld war nicht ausreichend für die Transaktion";
    }
  }

  
  function update(_event: Event): void {
    ƒ.Physics.simulate(); 
    spawnOpponents();
    OpponentsTrans= Opponents.mtxLocal.translation.get()
    Opponents.mtxLocal.translateX(-(1.0+ opponentSpeed)*ƒ.Loop.timeFrameGame/1000);
    hitOpponent();

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      cmpAudio.setAudio(swordAudio);
      cmpAudio.loop = false;
      cmpAudio.volume= 10;
      cmpAudio.play(true);
      avatar.act(ACTION.FIGHT); 
    }
    else if (!missedOpponnent){
      avatar.act(ACTION.IDLE);
      if(cmpAudio.getAudio().name == "sword.wav"){
        cmpAudio.setAudio(bgMusic);
        cmpAudio.volume= 2;
        cmpAudio.loop = true;
        cmpAudio.play(true);
      }
    }
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function reset():void{
    console.log("Reset");
    ui.money= 0;
    ui.maxspeed= 15;
    ui.opponentmulitplicator= 1;
    ui.moneymultipilcator= 1;
    playerFps= 15;
    
    petNode.dispatchEvent(new Event("Reset", {bubbles: true}));
    missedOpponnent= false;
    avatar.act(ACTION.IDLE);
    Opponents.removeAllChildren();
  }

}