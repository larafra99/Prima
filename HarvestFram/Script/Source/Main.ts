///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  let player: Avatar;
  export let graph: ƒ.Node;
  let facing: boolean = true; 
  let PlayerNode:ƒ.Node;
  let branch: ƒ.Node;
  let PlayerSprite: ƒAid.NodeSprite;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(20);
    viewport.camera.mtxPivot.rotateY(180);

    branch = viewport.getBranch();
    PlayerNode= branch.getChildrenByName("Player")[0];
    console.log("Player",PlayerNode);
    loadSprite();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  async function loadSprite():Promise<void>{
    let spriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await spriteSheet.load("./Images/mariowalkx16.gif");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, spriteSheet);

    let walkanimation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("walk", coat);
    walkanimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 12, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
    PlayerSprite = new ƒAid.NodeSprite("PlayerSprite");
    PlayerSprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    PlayerSprite.setAnimation(walkanimation);
    PlayerSprite.mtxLocal.translateY(+0.5); // mtx = Matrix 
    PlayerSprite.framerate = 10;
    PlayerNode.addChild(PlayerSprite);

    let avatarInstance: Avatar= new Avatar();
    avatarInstance.initializeAnimation(spriteSheet);
    branch.addChild(avatarInstance);
    avatarInstance.update;
    
  }

  function update(_event: Event): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      PlayerNode.mtxLocal.translateX(90);

      if (!facing){
        PlayerSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180)
        facing = true;
      }
    }
    if (ƒ.Keyboard.isPressedOne([ ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      PlayerNode.mtxLocal.translateX(-90);

      if (facing){
        PlayerSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180)
        facing = false;
      }
    }
    
    PlayerNode.mtxLocal.translateY(5);

    if (PlayerNode.mtxLocal.translation.y <=0){
      PlayerNode.mtxLocal.translation.y =0;
    }
    viewport.draw();
  }
}