namespace Runner {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Runner);  // Register the namespace to FUDGE for serialization
  
    enum PETSTATE {
      IDLE, RUN, REST, SIT
    }
    let petTimer:number = 0;

  
    export class PetState extends ƒAid.ComponentStateMachine<PETSTATE> {
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(PetState);
      private static instructions: ƒAid.StateMachineInstructions<PETSTATE> = PetState.get();
      
  
      constructor() {
        super();
        this.instructions = PetState.instructions; // setup instructions with the static set
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
        // Listen to this component being added to or removed from a node
        this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent); 
      }
  
      public static get(): ƒAid.StateMachineInstructions<PETSTATE> {
        let setup: ƒAid.StateMachineInstructions<PETSTATE> = new ƒAid.StateMachineInstructions();
        setup.transitDefault = PetState.transitDefault;
        setup.actDefault = PetState.petDefault;

        setup.setAction(PETSTATE.IDLE, <ƒ.General>this.petIdle);
        setup.setAction(PETSTATE.RUN, <ƒ.General>this.petRun);
        setup.setAction(PETSTATE.SIT, <ƒ.General>this.petSit);
        setup.setAction(PETSTATE.REST, <ƒ.General>this.petRest);
        return setup;
      }
  
      private static transitDefault(_pet: PetState): void {
        console.log("Transit to", _pet.stateNext);
        
      }
  
      private static async petDefault(_pet: PetState): Promise<void> {
        console.log(PETSTATE[_pet.stateCurrent]);
      }
  
      private static async petIdle(_pet: PetState): Promise<void> {
        console.log("walk");
        petTimer += ƒ.Loop.timeFrameGame/1000;
        _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_pet")[0] as ƒ.AnimationSprite;
        if (petTimer> 3){
            _pet.transit(PETSTATE.RUN);
            petTimer= 0;
        }
      }

      private static async petRun(_pet: PetState): Promise<void> {
        _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("run_pet")[0] as ƒ.AnimationSprite;
        _pet.node.mtxLocal.translateX(3.0*ƒ.Loop.timeFrameGame/1000);
        if(_pet.node.mtxLocal.translation.x> 4){
            _pet.transit(PETSTATE.SIT)
        }
        
      }
      private static async petSit(_pet: PetState): Promise<void> {
        petTimer += ƒ.Loop.timeFrameGame/1000;
        _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("sit_pet")[0] as ƒ.AnimationSprite;
        _pet.node.mtxLocal.translateX(-1.0*ƒ.Loop.timeFrameGame/1000);
        if (petTimer> 0.19){
            _pet.transit(PETSTATE.REST);
            petTimer= 0;
        }
      }
      private static async petRest(_pet: PetState): Promise<void> {
        _pet.node.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("rest_pet")[0] as ƒ.AnimationSprite;
        _pet.node.mtxLocal.translateX(-2*ƒ.Loop.timeFrameGame/1000);
        if(_pet.node.mtxLocal.translation.x<= -4.5){
            _pet.transit(PETSTATE.IDLE)
        }
      }
      
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case ƒ.EVENT.COMPONENT_ADD:
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            this.transit(PETSTATE.IDLE);
            break;
          case ƒ.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            break;
          case ƒ.EVENT.NODE_DESERIALIZED:  
            break;
        }
      }
      
      public petReset():void{
        console.log("PEtSTatereset")
        this.transit(PETSTATE.IDLE);
      }
  
      private update = (_event: Event): void => {
        this.act();

      }
      
    }  
}