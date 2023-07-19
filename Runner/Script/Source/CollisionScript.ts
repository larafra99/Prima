
namespace Runner {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Runner);  // Register the namespace to FUDGE for serialization

  export class CollisionScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CollisionScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    private rigidbody: ƒ.ComponentRigidbody;

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
          ƒ.Debug.log(this.node);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
          this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision);

      }
    }

    private async hndCollision(_event: ƒ.EventPhysics): Promise<void> {
      let oppoNode: ƒ.Node = _event.cmpRigidbody.node;
      //  allows player to hit opponent after collision happend
      if (!fight) {
        // as long as opponent is in front of the player it can still be hit
        await new Promise(resolve => { setTimeout(resolve, 1000 - 2.5 * ui.speed) });
      }
      // opponent is hit
      if (fight) {
        // increase speed of character and pet
        if (ui.speed < ui.maxspeed) {
          playerFps = playerFps + 0.1;
          petNode.dispatchEvent(new Event("ChangeSpeed", { bubbles: true }));
        }
        // removes hit opponent, adds money
        Opponents.removeChild(oppoNode);
        ui.money = parseFloat((ui.money + (ui.opponentmulitplicator * ui.moneymultipilcator)).toFixed(1));
      }
      // opponent is missed show missed animation
      else {
        avatar.act(ACTION.MISSED);
      }
    }
  }
}
