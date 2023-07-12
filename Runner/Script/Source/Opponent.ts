namespace Runner {
    import ƒ = FudgeCore;


    export class Opponent extends ƒ.Node {


        public constructor() {
            super("Opponent");
            this.addComponent(new ƒ.ComponentMesh(ƒ.Project.getResourcesByName("Quad")[0] as ƒ.MeshQuad));
            this.addComponent(new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("Test")[0] as ƒ.Material));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation= new ƒ.Vector3(5, -3.4000000953674316, 10);
            // TODO: to start later x = 6.5 
        }

        public static createOpponents():ƒ.Node{
            console.log("Oppo");
            let OpponentNode= new ƒ.Node("OpponentNode");
            OpponentNode= new Opponent();
            return OpponentNode;
        }

       
          
    }
}