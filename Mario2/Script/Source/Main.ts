
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Script {
  
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let marioPos:ƒ.Node;
  let marioSpeed: number = 3.0;
  let marioSprite: ƒAid.NodeSprite;
  let facing: boolean = true; // true = right

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    loadSprite();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);
    let branch: ƒ.Node = viewport.getBranch();
    console.log(branch);
    marioPos= branch.getChildrenByName("MarioPosition")[0]; // get Sprite by name
    console.log("Mario",marioPos);
  }

  async function loadSprite():Promise<void>{
    let spriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await spriteSheet.load("./Images/mariowalkx16.gif");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, spriteSheet);

    let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("walk", coat);
    animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 12, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
    marioSprite = new ƒAid.NodeSprite("Sprite");
    marioSprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    marioSprite.setAnimation(animation);
    marioSprite.setFrameDirection(1);
    marioSprite.mtxLocal.translateY(+0.5); // mtx = Matrix 
    marioSprite.framerate = 10;
    marioPos.removeAllChildren();
    marioPos.addChild(marioSprite);
    viewport.draw();
  }

  function update(_event: Event): void {
    
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      marioPos.mtxLocal.translateX(marioSpeed*ƒ.Loop.timeFrameGame/1000 );
      if (!facing){
        marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180)
        facing = true;
      }
      //marioPos.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(0.01);
    }
    if (ƒ.Keyboard.isPressedOne([ ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      marioPos.mtxLocal.translateX(-marioSpeed*ƒ.Loop.timeFrameGame/1000 );
      
      if (facing){
        marioSprite.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(180)
        facing = false;
      }
    }
    ƒ.Loop.timeFrameGame
    
    //console.log( ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W,ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.S,ƒ.KEYBOARD_CODE.D]));
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    
    
  }


}