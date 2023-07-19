namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");
  // define variables for use
  export let graph: ƒ.Node;
  export let spriteNode: ƒ.Node;
  export let Opponents: ƒ.Node;
  export let petNode: ƒ.Node;

  export let avatar: Avatar;
  export let ui: UserInterface;
  export let petStateMachine: PetState;

  export let fight: boolean = false;
  export let missedOpponnent: boolean = false;
  export let fightCoolDown: boolean = false;

  export let json: { [key: string]: number };

  export let playerFps: number;
  export let opponentSpeed: number;
  export let OpponentsTrans: Float32Array;


  let viewport: ƒ.Viewport;
  let cmpCamera: ƒ.ComponentCamera;
  let cmpAudio: ƒ.ComponentAudio;
  let oppoSkin: ƒ.Material;
  let bgMusic: ƒ.Audio = new ƒ.Audio("Sound/background.mp3");
  let swordAudio: ƒ.Audio = new ƒ.Audio("Sound/sword.wav");

  let oppoTimer: number = 0;
  let hitTimer: number = 0;
  let buttonCounter: number = 0;

  let changOopposkinButton: HTMLButtonElement;
  let randomOppo: boolean = false;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    // fetching config file and it's data
    let response = await fetch("config.json");
    let json = await response.json();

    // Creating USerInterface and Statemachine
    ui = new UserInterface(json);
    petStateMachine = new PetState();

    // creating graph and Audio and Camera Components
    viewport = _event.detail;
    graph = viewport.getBranch();
    cmpCamera = graph.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    cmpAudio = graph.getComponent(ƒ.ComponentAudio);

    // getting Nodes from the graph
    spriteNode = graph.getChildrenByName("Player")[0];
    Opponents = graph.getChildrenByName("Opponents")[0];
    petNode = graph.getChildrenByName("Pet")[0];

    // setting playerspeed and opponentspeed
    playerFps = ui.speed / 10;
    opponentSpeed = playerFps;
    // getting Opponentskin
    oppoSkin = ƒ.Project.getResourcesByName("OpponentShader")[0] as ƒ.Material;
    // getting button elements from UI / index
    let resetButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("resetbutton");
    resetButton.addEventListener("click", function (): void { reset() });
    let OpponentMultiplicatorButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("opponentbutton");
    OpponentMultiplicatorButton.addEventListener("click", function (): void { checkButton("oppo") });
    let moneyMulitpilactorButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("multipicatorbutton");
    moneyMulitpilactorButton.addEventListener("click", function (): void { checkButton("money") });
    let maxSpeedButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("maxspeedbutton");
    maxSpeedButton.addEventListener("click", function (): void { checkButton("speed") });
    changOopposkinButton = <HTMLButtonElement>document.getElementById("changeopposkinbutton");
    changOopposkinButton.textContent = "Anderer Gegener";
    changOopposkinButton.addEventListener("click", function (): void { checkButton("skin") });

    // waiting for Player to be created
    await hndLoad();

    // loading background audio
    bgAudio();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }
  // creating new Player
  async function hndLoad(): Promise<void> {
    avatar = new Avatar();
  }
  // starting background
  function bgAudio(): void {
    cmpAudio = new ƒ.ComponentAudio(bgMusic, true, true);
    cmpAudio.connect(true);
    cmpAudio.volume = 2;
  }
  // defines random spawntime for opponents
  function spawnTimer(): number {
    return (Math.random() * (12 - 0.9) + 0.9);
  }
  // creates opponents
  function spawnOpponents(): void {
    if (randomOppo) {
      // sets skin for opponents
      if (Math.random() < 0.5) {
        oppoSkin = ƒ.Project.getResourcesByName("OpponentShader")[0] as ƒ.Material;
      }
      else {
        oppoSkin = ƒ.Project.getResourcesByName("OpponentShader2")[0] as ƒ.Material;
      }
    }
    oppoTimer += ƒ.Loop.timeFrameGame / 1000;
    if (oppoTimer > spawnTimer()) {
      document.getElementById("transaktion").innerText = "";
      Opponents.addChild(Opponent.createOpponents(oppoSkin));
      oppoTimer = 0;
    }
  }
  // allows Player that earlier hits count, opponent doesn't need to be hit just before the collision
  function hitOpponent(): void {
    hitTimer += ƒ.Loop.timeFrameGame / 1000;
    if (hitTimer > 0.3 && fight) {
      fight = false;
      hitTimer = 0;
    }
  }
  // if buttons are pressed execiutes function
  function checkButton(add: string): void {
    // opponents drop more money
    if (add == "oppo" && ui.money >= 50) {
      ui.opponentmulitplicator = ui.opponentmulitplicator + 1;
      ui.money = parseFloat((ui.money - 50).toFixed(1));;
    }
    // increases money value
    else if (add == "money" && ui.money >= 20) {
      ui.moneymultipilcator = ui.moneymultipilcator + 0.1;
      ui.money = parseFloat((ui.money - 20).toFixed(1));
    }
    // increases max speed
    else if (add == "speed" && ui.money >= 100) {
      ui.maxspeed = ui.maxspeed + 1;
      ui.money = parseFloat((ui.money - 100).toFixed(1));;
    }
    // changes opponentskin are enables random opponents
    else if (add == "skin" && ui.money >= 500) {
      if (buttonCounter == 0) {
        oppoSkin = ƒ.Project.getResourcesByName("OpponentShader2")[0] as ƒ.Material;
        changOopposkinButton.textContent = "Random Gegner";
      }
      else if (buttonCounter == 1) {
        randomOppo = true;
        changOopposkinButton.disabled = true;
        changOopposkinButton.hidden = true;
      }
      ui.money = parseFloat((ui.money - 500).toFixed(1));;
      buttonCounter = buttonCounter + 1;
    }
    else {
      document.getElementById("transaktion").innerText = "Geld war nicht ausreichend für die Transaktion";
    }
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    // Spawns opponents
    spawnOpponents();
    // moves opoonents with the help of mother node
    OpponentsTrans = Opponents.mtxLocal.translation.get();
    Opponents.mtxLocal.translateX(-(1.0 + opponentSpeed) * ƒ.Loop.timeFrameGame / 1000);
    // allows eralier hit times 
    hitOpponent();
    // checks if Player wants to attack
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      // changes audio to sword sound
      cmpAudio.setAudio(swordAudio);
      cmpAudio.loop = false;
      cmpAudio.volume = 10;
      cmpAudio.play(true);
      // shows Fight animation
      avatar.act(ACTION.FIGHT);
    }
    // shows characters idle animation if no opponents were missed
    else if (!missedOpponnent) {
      avatar.act(ACTION.IDLE);
      // sets audio back to backgroundmusic
      if (cmpAudio.getAudio().name == "sword.wav") {
        cmpAudio.setAudio(bgMusic);
        cmpAudio.volume = 2;
        cmpAudio.loop = true;
        cmpAudio.play(true);
      }
    }
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
  //  resets the game, puts all Nodes back in starting position
  function reset(): void {
    console.log("Reset");
    ui.money = 0;
    ui.maxspeed = 10;
    ui.opponentmulitplicator = 1;
    ui.moneymultipilcator = 1;
    playerFps = 10;

    petNode.dispatchEvent(new Event("Reset", { bubbles: true }));
    missedOpponnent = false;
    avatar.act(ACTION.IDLE);
    Opponents.removeAllChildren();
  }
}
