namespace Harvest {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Harvest);  // Register the namespace to FUDGE for serialization
  
    export class CharacterEventScript extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(CharacterEventScript);
      // Properties may be mutated by users in the editor via the automatically created user interface
      
      public eventAudio: ƒ.ComponentAudio;
      private stamina: number;
      private vitality: number;
      private startpoint:ƒ.Matrix4x4;
  
  
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
            break;
          case ƒ.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
          case ƒ.EVENT.NODE_DESERIALIZED:
            console.log("Startpoint", this.startpoint);
            // if deserialized the node is now fully reconstructed and access to all its components and children is possible
            break;
        }
      }
      private startNewDay():void{
        this.node.mtxLocal.set(this.startpoint);
        this.stamina= playerstate.stamina;
        this.vitality= playerstate.vitality;

      }
  
      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }