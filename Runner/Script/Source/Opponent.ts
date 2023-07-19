namespace Runner {
    import ƒ = FudgeCore;
    export class Opponent extends ƒ.Node {
        // define attributes and components of opponent
        public constructor( ) {
            super("Opponent");
            this.addComponent(new ƒ.ComponentMesh(ƒ.Project.getResourcesByName("Player")[0] as ƒ.MeshQuad));
            this.addComponent(new ƒ.ComponentTransform( ));
            this.getComponent(ƒ.ComponentTransform).mtxLocal.translation= new ƒ.Vector3(7- OpponentsTrans[0], -3.1, 10);
            this.mtxLocal.rotateY(180);
            
            let rigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1,ƒ.BODY_TYPE.KINEMATIC,ƒ.COLLIDER_TYPE.CUBE);
            this.addComponent(rigidbody);
            this.addComponent((new RemoveOpponentScript()));
        }

        public static createOpponents(skin: ƒ.Material):ƒ.Node{
            let OpponentNode= new ƒ.Node("OpponentNode");
            // creates opponent
            OpponentNode= new Opponent();
            // sets material
            OpponentNode.addComponent(new ƒ.ComponentMaterial(skin));
            OpponentNode.getComponent(ƒ.ComponentMaterial).mtxPivot.translation = new ƒ.Vector2(0.4, 0.1);
            OpponentNode.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleX(0.068);
            OpponentNode.getComponent(ƒ.ComponentMaterial).mtxPivot.scaleY(0.173);
            return OpponentNode;
        }

       
          
    }
}