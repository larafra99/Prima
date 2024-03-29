namespace Harvest {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Harvest);  // Register the namespace to FUDGE for serialization
  
    export class CharacterEventScript extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(CharacterEventScript);
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
            break;
          case ƒ.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
          case ƒ.EVENT.NODE_DESERIALIZED:
            //this.startNewDay();
            this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
            // if deserialized the node is now fully reconstructed and access to all its components and children is possible
            break;
        }
      }

      private update = (_event: Event): void => {
        if(!graph){
          return;
        }
        this.getDistance();
        
      }  

      private getDistance(){
        if(this.node.mtxWorld.translation.x>-5 && this.node.mtxWorld.translation.x<5 && this.node.mtxWorld.translation.z>-5 && this.node.mtxWorld.translation.z<5){
          //console.log("Yes");
          onField= true;
        }
        else{
          onField = false;
          let house:ƒ.Node= graph.getChildrenByName("House")[0]; 
          let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(this.node.mtxWorld.translation, house.mtxWorld.translation);
          //console.log("d",distance.magnitude);
          if (distance.magnitude<1.6){
            nearHouse= true;
          }
          else{
            nearHouse= false;
          }
          
        }
      }
    }
  }