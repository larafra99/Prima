namespace Harvest {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
  
    export enum ANIMAL_WALK {
        IDLE, LEFTRIGHT, UP, DOWN, SLEEP
    }
  
    export class AnimalStateMachine extends ƒAid.ComponentStateMachine<ANIMAL_WALK> {
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(AnimalStateMachine);
      private static instructions: ƒAid.StateMachineInstructions<ANIMAL_WALK> = AnimalStateMachine.get();
    //   public forceEscape: number = 25;
    //   public torqueIdle: number = 5;
    //   private cmpBody: ƒ.ComponentRigidbody;
    //   private cmpMaterial: ƒ.ComponentMaterial;
  
  
      constructor() {
        super();
        this.instructions = AnimalStateMachine.instructions; // setup instructions with the static set
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
      }
  
      public static get(): ƒAid.StateMachineInstructions<ANIMAL_WALK> {
        let setup: ƒAid.StateMachineInstructions<ANIMAL_WALK> = new ƒAid.StateMachineInstructions();
        setup.transitDefault = AnimalStateMachine.transitDefault;
        setup.actDefault = AnimalStateMachine.actDefault;
        setup.setAction(ANIMAL_WALK.IDLE, <ƒ.General>this.actIdle);
        setup.setAction(ANIMAL_WALK.DOWN, <ƒ.General>this.actWalk);
        setup.setAction(ANIMAL_WALK.SLEEP, <ƒ.General>this.actSleep)
        //setup.setTransition(ANIMAL_WALK.IDLE, ANIMAL_WALK.DOWN, <ƒ.General>this.transitDie);
        return setup;
      }
  
      private static transitDefault(_machine: AnimalStateMachine): void {
        console.log("Transit to", _machine.stateNext);
      }
  
      private static async actDefault(_machine: AnimalStateMachine): Promise<void> {
        console.log(ANIMAL_WALK[_machine.stateCurrent]);
      }
  
      private static async actIdle(_machine: AnimalStateMachine): Promise<void> {
        _machine.node.mtxLocal.rotateY(5);
      }

      private static async actWalk(_machine: AnimalStateMachine): Promise<void> {
        _machine.node.mtxLocal.rotateY(5);
        // _machine.cmpMaterial.clrPrimary = ƒ.Color.CSS("white");
        // let difference: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_machine.node.mtxWorld.translation, cart.mtxWorld.translation);
        // difference.normalize(_machine.forceEscape);
        // _machine.cmpBody.applyForce(difference);
        // StateMachine.actDefault(_machine);
      }
      private static async actSleep(_machine: AnimalStateMachine): Promise<void> {
        _machine.node.mtxLocal.rotateY(5);
        //
      }

  
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case ƒ.EVENT.COMPONENT_ADD:
            console.log("Statemachine");
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            this.transit(ANIMAL_WALK.IDLE);
            break;
          case ƒ.EVENT.COMPONENT_REMOVE:
            console.log("Statemachine");
            this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            break;
          case ƒ.EVENT.NODE_DESERIALIZED:
            console.log("Statemachine");
            this.transit(ANIMAL_WALK.IDLE);
            
            break;
        }
      }
  
      private update = (_event: Event): void => {
        this.act();
      }
    }  
}