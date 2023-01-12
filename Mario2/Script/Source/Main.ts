///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Script {
  
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  export let viewport: ƒ.Viewport;
  let marioNode:ƒ.Node;
  let branch: ƒ.Node;
  let marioSprite: ƒAid.NodeSprite;
  let cmpTimeAudio:ƒ.ComponentAudio;
  
  
  let marioSpeed: number = 3.0;
  let facing: boolean = true; // true = right
  // let ySpeed: number  = 0;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(20);
    viewport.camera.mtxPivot.rotateY(180);
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
    branch = viewport.getBranch();
    marioNode= branch.getChildrenByName("MarioPosition")[0]; // get Sprite by name

    loadSprite();
    audio();
  }

  async function loadSprite():Promise<void>{
    let spriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await spriteSheet.load("./Images/PlayerSprite.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, spriteSheet);

    let walkanimation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("walk", coat);
    walkanimation.generateByGrid(ƒ.Rectangle.GET(10, 475, 86, 100), 3, 70, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
    marioSprite = new ƒAid.NodeSprite("marioSprite");
    marioSprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    marioSprite.setAnimation(walkanimation);
    marioSprite.mtxLocal.translateY(+0.5); // mtx = Matrix 
    marioSprite.framerate = 10;
    marioNode.addChild(marioSprite);

    let avatarInstance: Avatar= new Avatar();
    avatarInstance.initializeAnimation(spriteSheet);
    branch.addChild(avatarInstance);
    avatarInstance.update;
    
    let cmpAudio: ƒ.ComponentAudio = branch.getComponent(ƒ.ComponentAudio);
    //cmpAudio
    console.log("CMPAudio",cmpAudio);
  }

  // function checkCollision():void {
  //   let blocks:ƒ.Node = branch.getChildrenByName("Floor")[0];
  //   let pos: ƒ.Vector3 = marioNode.mtxLocal.translation;
    
  //   for(let block of blocks.getChildren()){
  //     let blockpos: ƒ.Vector3 = block.mtxLocal.translation;
  //     if (Math.abs(pos.x - blockpos.x) < 0.5){
  //       if(pos.y<blockpos.x+0.5){
  //         pos.y = blockpos.y +0.5;
  //         marioNode.mtxLocal.translation = pos;
  //         ySpeed = 0;
  //       }
  //     }
  //   }
  // }
  async function audio():Promise<void>{
    let audioWarning: ƒ.Audio = new ƒ.Audio("Audio/smb_warning.wav");

    cmpTimeAudio = new ƒ.ComponentAudio(audioWarning,false,false);
    cmpTimeAudio.connect(true);
    cmpTimeAudio.volume=4;
  }

  function update(_event: Event): void {
    let gravity: number = 5;
    let jumpForce: number = 3;
    let deltaTime:number= marioSpeed*ƒ.Loop.timeFrameGame/1000;
    let ySpeed: number  = 0;
    ySpeed-=gravity* deltaTime;
    let yOffset: number = ySpeed * deltaTime;
    let pos: ƒ.Vector3 = marioNode.mtxLocal.translation;

    if (pos.y + yOffset > 0)
    marioNode.mtxLocal.translateY(yOffset);
    else {
      ySpeed = 0;
      pos.y = 0;
      marioNode.mtxLocal.translation = pos;
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      marioNode.mtxLocal.translateX(deltaTime);
      cmpTimeAudio.play(true);

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
    
    //checkCollision();
    ƒ.Loop.timeFrameGame
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}