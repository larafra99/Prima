namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);
  
  export class SensorScript extends ƒ.ComponentScript {// class need to be named like the file
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(SensorScript);
    public message: string = "Sensor added to ";

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
          ƒ.Debug.log(this.message, this.node);
          
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.node.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    private update = (_event:Event): void => {
      if(!Terrain)
        return;
      let mesh:ƒ.MeshTerrain=(Terrain.mesh as ƒ.MeshTerrain);
      let parent: ƒ.Node= this.node.getParent();
      let info:ƒ.TerrainInfo= mesh.getTerrainInfo(parent.mtxLocal.translation,Terrain.mtxWorld);
      console.log(parent.name,info.distance);
      if(info.distance<0){
        this.node.dispatchEvent(new Event("SensorHit",{bubbles: true}))
      }
    }
  
//Camera
    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}