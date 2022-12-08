namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  
  
  export class EngineScript extends ƒ.ComponentScript {// class need to be named like the file
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(EngineScript);
    public message: string = "SpaceshipMovement added to ";

    private rigidbody: ƒ.ComponentRigidbody;
    public power: number = 15000;
    private cmpCrashAudio:ƒ.ComponentAudio;

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
          //ƒ.Debug.log(this.message, this.node);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
          this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollision)
          this.node.addEventListener("SensorHit",this.hndCollision);
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);

          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    update = (): void => {
      if (!gameState){
        return;
      }
      gameState.height= this.node.mtxWorld.translation.y;
      gameState.velocity= Math.round(this.rigidbody.getVelocity().magnitude);

    }
    private hndCollision= (_event: Event):void =>{
      console.log("Bum");
      console.log(_event);

      let audioCrash: ƒ.Audio = new ƒ.Audio("Audio/smb_warning.wav");
      this.cmpCrashAudio = new ƒ.ComponentAudio(audioCrash,false,true);
      this.cmpCrashAudio.connect(true);
      this.cmpCrashAudio.volume=4;
    }

    public yaw(_value: number) {
      this.rigidbody.applyTorque(new ƒ.Vector3(0, _value * -10, 0));
    }
    public pitch(_value: number) {
      this.rigidbody.applyTorque(ƒ.Vector3.SCALE(this.node.mtxWorld.getX(), _value * 7.5));
    }
    public roll(_value: number) {
      this.rigidbody.applyTorque(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), _value));
    }
    public backwards() {
      this.rigidbody.applyForce(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), -this.power));
    }
    public thrust() {
      this.rigidbody.applyForce(ƒ.Vector3.SCALE(this.node.mtxWorld.getZ(), this.power));
    }

  }
}