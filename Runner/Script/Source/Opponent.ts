namespace Runner {
    import ƒ = FudgeCore;
    export class Opponent extends ƒ.Node {

        public constructor() {
            super("Opponent");
            this.addComponent(new ƒ.ComponentMesh(ƒ.Project.getResourcesByName("Player")[0] as ƒ.MeshQuad));
            this.addComponent(new ƒ.ComponentMaterial(ƒ.Project.getResourcesByName("OpponentShader")[0] as ƒ.Material));
            this.addComponent(new ƒ.ComponentTransform( ));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translation= new ƒ.Vector3(7- OpponentsTrans[0], -3.1, 10);
            this.mtxLocal.rotateY(180);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.translation = new ƒ.Vector2(0.3935483992099762, 0.1);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleX(0.068);
            this.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleY(0.173);
            let rigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1,ƒ.BODY_TYPE.KINEMATIC,ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(rigidbody);
            this.addComponent((new RemoveOpponentScript()));
        }

        public static createOpponents():ƒ.Node{
            // console.log("Oppo");
            let OpponentNode= new ƒ.Node("OpponentNode");
            OpponentNode= new Opponent();
            // console.log("Node", OpponentNode);
            return OpponentNode;
        }

       
          
    }
}