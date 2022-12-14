namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let Spaceship:ƒ.Node;
  export let graph: ƒ.Node;
  export let Terrain:ƒ.ComponentMesh;
  export let gameState:GameState;
  export let viewport: ƒ.Viewport;
  let cmpEngine: EngineScript;
  let vctMouse: ƒ.Vector2 = ƒ.Vector2.ZERO();
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  window.addEventListener("mousemove", hndMouse);

  async function start(_event: CustomEvent): Promise<void> {
    let response: Response = await fetch('config.json');
    let json = await response.json();
    console.log(json);
    gameState= new GameState();
    viewport = _event.detail;
    
    graph= viewport.getBranch();
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
    ƒ.Physics.settings.solverIterations = 300;
    
    //graph.addEventListener(ƒ.EVENT.RENDER_PREPARE,update)
    Spaceship= graph.getChildrenByName("Spaceship")[0];
    cmpEngine = Spaceship.getComponent(EngineScript);
    let cmpCamera =Spaceship.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);;
    viewport.camera = cmpCamera;
    Terrain= graph.getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
    //console.log("Tea", Terrain);
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    //init();
  }

  function update(_event: Event): void {
    control();
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    //let info:ƒ.TerrainInfo= (Terrain.mesh as ƒ.MeshTerrain).getTerrainInfo(Spaceship.mtxLocal.translation,Terrain.mtxWorld);
    //console.log("INFO",info.distance);
  }

  function hndMouse(e: MouseEvent): void {
    vctMouse.x = 2 * (e.clientX / window.innerWidth) - 1;
    vctMouse.y = 2 * (e.clientY / window.innerHeight) - 1;
  }

  function control (){
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
      cmpEngine.thrust();
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
      cmpEngine.backwards();
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      cmpEngine.roll(-5);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      cmpEngine.roll(5);
    }
    cmpEngine.pitch(vctMouse.y);
    cmpEngine.yaw(vctMouse.x);
  }
}