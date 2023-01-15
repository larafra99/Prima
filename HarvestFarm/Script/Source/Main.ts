///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Harvest {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  export let graph: ƒ.Node;
  export let playerstate: UserInterface;
  let cmpCamera: ƒ.ComponentCamera
  let cmpBgAudio:ƒ.ComponentAudio;
  let avatar: Avatar;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch("config.json");
    let config: {[key: string]: number} = await response.json();
    
    playerstate= new UserInterface(config);
    viewport = _event.detail;
    cmpCamera = viewport.camera;
   //TODO: camera at an angle 
    cmpCamera.mtxPivot.rotateY(+180);
    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0,0,20);
    hndLoad(_event);
    bgAudio();
  }
  

  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/PlayerSprite.png");

    graph = viewport.getBranch();
    avatar = new Avatar();
    avatar.initializeAnimations(imgSpriteSheet);
    avatar.act(ACTION.DOWN);
    avatar.act(ACTION.IDLE);
    graph.addChild(avatar);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function updateCamera():void{
    //TODO: camera walking with character
  }

  async function bgAudio():Promise<void> {
    let bgMusic: ƒ.Audio = new ƒ.Audio("Audio/BGM_Spring.mp3");

    cmpBgAudio = new ƒ.ComponentAudio(bgMusic,true,true);
    cmpBgAudio.connect(true);
    cmpBgAudio.volume=4;
  }

  function update(_event: Event): void {
    if (!UserInterface){
      return;
    }
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
      avatar.act(ACTION.LEFTRIGHT);
      avatar.walkleftright(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
      avatar.act( ACTION.LEFTRIGHT);
      avatar.walkleftright(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])){
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
      avatar.act(ACTION.UP);
      avatar.walkupdown(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
      avatar.act(ACTION.DOWN);
      avatar.walkupdown(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])){
      avatar.act(ACTION.INTERACTION);
      //TODO:action gießen, hacken, etc. mit musik
      
    }
    else{
      avatar.act(ACTION.IDLE);
    }  
    viewport.draw();
    updateCamera();
  }
}