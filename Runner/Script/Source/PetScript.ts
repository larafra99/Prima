
namespace Runner {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Runner);  // Register the namespace to FUDGE for serialization
  
    export class PetScript extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(PetScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      constructor() {
        super();
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
        this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
      }
  
      // Activate the functions of this component as response to events
      public hndEvent = (_event: Event): void => {
        switch (_event.type) {
          case ƒ.EVENT.COMPONENT_ADD:
            ƒ.Debug.log( this.node);
            break;
          case ƒ.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
          case ƒ.EVENT.NODE_DESERIALIZED:
            console.log("I dont understand");
            this.node.addEventListener("Reset", this.startPostion); 
            this.node.addEventListener("ChangeSpeed", this.petSpeedChange); 
        }
      }
     
    private startPostion(_event:Event):void{
        petStateMachine.petReset();
        petNode.mtxLocal.translation.x= -4.69;
        petNode.mtxLocal.translation= new ƒ.Vector3(-4.7,-3, 12);
      }
    private petSpeedChange(_event:Event):void{
      petStateMachine.changeSpeed();
    }
    }
  }