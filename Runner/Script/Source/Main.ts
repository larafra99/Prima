namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let graph: ƒ.Node;
  export let spriteNode: ƒ.Node;

  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera
  let avatar:Avatar;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    cmpCamera = viewport.camera;
    spriteNode= graph.getChildrenByName("Player")[0]; // get Sprite by name
    console.log("S",spriteNode);

    await hndLoad();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  async function hndLoad(): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Image/Sprite4.png");

    avatar = new Avatar();
    avatar.initializeAnimations(imgSpriteSheet);
    //avatar.act(ACTION.DOWN);
    //avatar.act(ACTION.IDLE);
    spriteNode.addChild(avatar);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }


  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

}