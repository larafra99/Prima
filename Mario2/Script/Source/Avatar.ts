
namespace Script { // namespace nach Titel des Spieles bennenen
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Avatar extends ƒAid.NodeSprite{
        readonly xSpeedDefault = 0.9;
        readonly xSpeedSprint = 3;
        private walkanimation: ƒAid.SpriteSheetAnimation; 
        private ySpeed: number = 1;
        private gravity: number = 5;

        public constructor(){
            super("Avatar");
            this.addComponent(new ƒ.ComponentTransform());
        }

        public update(_deltaTime: number): void {
            this.ySpeed-=this.gravity*_deltaTime;
            let yOffset: number = this.ySpeed* _deltaTime;
            this.mtxLocal.translateY(yOffset);
        }

        public initializeAnimation(_imageSpriteSheer:ƒ.TextureImage):void{
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imageSpriteSheer);
        
            this.walkanimation = new ƒAid.SpriteSheetAnimation("walk", coat);
            this.walkanimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 15, 16), 3, 12, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        }
    }
}