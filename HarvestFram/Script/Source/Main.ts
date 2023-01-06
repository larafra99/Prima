///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Harvest {
  import ƒ = FudgeCore;

  // Initialize Viewport
  let viewport: ƒ.Viewport;
  export let graph: ƒ.Node;
  export let playerstate: UserInterface;
  let avatar: Avatar;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(+10);
    viewport.camera.mtxPivot.rotateY(+180);
    hndLoad(_event);
  }

  
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/PlayerSprite.png");

    graph = viewport.getBranch();
    avatar = new Avatar();
    avatar.initializeAnimations(imgSpriteSheet);
    graph.addChild(avatar);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    if (!UserInterface){
      return;
    }
    playerstate.stamina= this.node.mtxWorld.translation.y;
    playerstate.vitality= Math.round(this.rigidbody.getVelocity().magnitude);

    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    // Check for key presses
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
      avatar.act(WALK.RIGHT);
      avatar.walkleftright(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
      avatar.act( WALK.RIGHT);
      avatar.walkleftright(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])){
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
      avatar.act(WALK.UP);
      avatar.walkupdown(deltaTime);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
      avatar.act(WALK.DOWN);
      avatar.walkupdown(deltaTime);
    }
    else{
      avatar.act(WALK.IDLE);
    }
      
    viewport.draw();
  }

}