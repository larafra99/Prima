
///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Script {
  
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let marioPos:ƒ.Node;
  let marioSpeed: number = 3.0;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log(viewport);
    let branch: ƒ.Node = viewport.getBranch();
    console.log(branch);
    marioPos= branch.getChildrenByName("MarioPosition")[0]; // get Sprite by name
    console.log("Mario",marioPos);
  }

  function update(_event: Event): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      marioPos.mtxLocal.translateX(marioSpeed*ƒ.Loop.timeFrameGame/1000 );
      //marioPos.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(0.01);
    }
    if (ƒ.Keyboard.isPressedOne([ ƒ.KEYBOARD_CODE.A,ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      marioPos.mtxLocal.translateX(-marioSpeed*ƒ.Loop.timeFrameGame/1000 );
    }
    ƒ.Loop.timeFrameGame
    
    //console.log( ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W,ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.S,ƒ.KEYBOARD_CODE.D]));
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    // mtx = Matrix 
    
  }


}