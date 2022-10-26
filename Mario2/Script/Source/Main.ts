///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Script {
  
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let viewport: ƒ.Viewport;
  let marioNode:ƒ.Node;
  let marioSprite: ƒAid.NodeSprite;
  
  let marioSpeed: number = 3.0;
  let facing: boolean = true; // true = right
  let ySpeed: number  = 0;


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
    let branch: ƒ.Node = viewport.getBranch();
    marioNode= branch.getChildrenByName("MarioPosition")[0]; // get Sprite by name

    loadSprite();
  }

  async function loadSprite():Promise<void>{
    let spriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await spriteSheet.load("./Images/mariowalkx16.gif");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, spriteSheet);

    let walkanimation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("walk", coat);
    walkanimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 12, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
    marioSprite = new ƒAid.NodeSprite("Avatar");
    marioSprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    marioSprite.setAnimation(walkanimation);
    marioSprite.mtxLocal.translateY(+0.5); // mtx = Matrix 
    marioSprite.framerate = 10;
    marioNode.addChild(marioSprite);

    
  }

  function checkcollision():void {
    let graph: ƒ.Node = viewport.getBranch();
    let blocks:ƒ.Node = graph.getChildrenByName("Floor")[0];
    let pos: ƒ.Vector3 = marioNode.mtxLocal.translation;
    
    for(let block of blocks.getChildren()){
      let blockpos: ƒ.Vector3 = block.mtxLocal.translation;
      if (pos.x - blockpos.x<0.5){
        if(pos.y<blockpos.x+0.5){
          pos.y = blockpos.y +0.5;
          marioNode.mtxLocal.translation = pos;
          ySpeed = 0;
        }
      }
    }
  }

  function update(_event: Event): void {
    let gravity: number = 5;
    let jumpForce: number = 3;
    let deltaTime:number= marioSpeed*ƒ.Loop.timeFrameGame/1000;
    let ySpeed: number  = 0;
    ySpeed-=gravity* deltaTime;
    let pos: ƒ.Vector3 = marioNode.mtxLocal.translation;
    

    checkcollision();
    

    if (pos.y + ySpeed > 0)
      marioNode.mtxLocal.translateY(ySpeed);
    else {
      ySpeed = 0;
      pos.y = 0;
      //marioPos.mtxLocal.translation = pos;
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      marioNode.mtxLocal.translateX(deltaTime);

      if (!facing){
        marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180)
        facing = true;
      }
    }
    if (ƒ.Keyboard.isPressedOne([ ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      marioNode.mtxLocal.translateX(-deltaTime);

      if (facing){
        marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180)
        facing = false;
      }
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) ) {
      marioNode.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
      ySpeed = jumpForce;
    }
    marioNode.mtxLocal.translateY(ySpeed);
    

    if (marioNode.mtxLocal.translation.y <=0){
      marioNode.mtxLocal.translation.y =0;
    }

    ƒ.Loop.timeFrameGame
    
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
// animationsstautus let current animation für sprint 
//sprint 
// animation -->sprite stop 
// mutatoren anschauen 
// test rectangle