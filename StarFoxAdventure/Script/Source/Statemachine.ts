namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    enum JOB {
      IDLE, ATTACK
    }
  
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(StateMachine);
      private static instructions: ƒAid.StateMachineInstructions<JOB> = StateMachine.get();
      public forceEscape: number = 25;
      public torqueIdle: number = 5;
    //   private cmpBody: ƒ.ComponentRigidbody;
    //   private cmpMaterial: ƒ.ComponentMaterial;
  
  
      constructor() {
        super();
        this.instructions = StateMachine.instructions; // setup instructions with the static set
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
  
       
      }
  
      public static get(): ƒAid.StateMachineInstructions<JOB> {
        let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
        setup.transitDefault = StateMachine.transitDefault;
        setup.actDefault = StateMachine.actDefault;
        setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
        setup.setAction(JOB.ATTACK, <ƒ.General>this.actAttack);
       
        //setup.setTransition(JOB.IDLE, JOB.ATTACK, <ƒ.General>this.transitDie);
        return setup;
      }
  
      private static transitDefault(_machine: StateMachine): void {
        console.log("Transit to", _machine.stateNext);
      }
  
      private static async actDefault(_machine: StateMachine): Promise<void> {
        console.log(JOB[_machine.stateCurrent]);
      }
  
      private static async actIdle(_machine: StateMachine): Promise<void> {
        _machine.node.mtxLocal.rotateY(5);
      }

      private static async actAttack(_machine: StateMachine): Promise<void> {
        // _machine.cmpMaterial.clrPrimary = ƒ.Color.CSS("white");
        // let difference: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_machine.node.mtxWorld.translation, cart.mtxWorld.translation);
        // difference.normalize(_machine.forceEscape);
        // _machine.cmpBody.applyForce(difference);
        // StateMachine.actDefault(_machine);
      }
      private static async actDie(_machine: StateMachine): Promise<void> {
        //
      }

  
      // Activate the functions of this component as response to events
      private hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case ƒ.EVENT.COMPONENT_ADD:
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            this.transit(JOB.IDLE);
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
  
      private update = (_event: Event): void => {
        this.act();
      }
    }  
}