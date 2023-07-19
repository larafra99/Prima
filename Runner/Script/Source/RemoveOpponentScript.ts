namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Runner);  // Register the namespace to FUDGE for serialization

  export class RemoveOpponentScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(RemoveOpponentScript);
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
          // ƒ.Debug.log( this.node);
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          break;
      }
    }
    //  delets opoonents if they are out of frame
    private update = (_event: Event): void => {
      if (this.node.mtxLocal.translation.x < -7 - OpponentsTrans[0]) {
        Opponents.removeChild(this.node);
      }
    }
  }
}
