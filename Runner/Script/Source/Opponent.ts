namespace Runner {
    import ƒ = FudgeCore;


    export class Opponent extends ƒ.Node {


        public constructor() {
            super("Opponent");
            this.addComponent(new ƒ.ComponentMesh(ƒ.Project.getResourcesByName("Player")[0] as ƒ.MeshQuad));
            this.addComponent(new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("OpponentShader")[0] as ƒ.Material));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation= new ƒ.Vector3(-2, -3.45, 10);
            this.mtxLocal.rotateY(180);
            // TODO: to start later x = 6.5 
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.translation = new ƒ.Vector2(0.3935483992099762, 0.1);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleX(0.068);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleY(0.173);
            // this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleY(0.1525000035762787);
            // this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleX(0.06451612710952759);

            
            
        }

        public static createOpponents():ƒ.Node{
            console.log("Oppo");
            let OpponentNode= new ƒ.Node("OpponentNode");
            OpponentNode= new Opponent();
            console.log("Node", OpponentNode);
            return OpponentNode;
        }

       
          
    }
}