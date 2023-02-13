namespace Harvest {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Animal extends ƒAid.NodeSprite {
        private walkLeftRight: ƒAid.SpriteSheetAnimation;
        private walkUp: ƒAid.SpriteSheetAnimation;
        private walkDown: ƒAid.SpriteSheetAnimation;
        private sleepAnimation: ƒAid.SpriteSheetAnimation;

        private animalStateMachine: AnimalStateMachine;

        public constructor() {
            super("AnimalInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }     

        public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);

            this.walkLeftRight = new ƒAid.SpriteSheetAnimation("Right", coat);
            this.walkLeftRight.generateByGrid(ƒ.Rectangle.GET(10, 475, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
            this.walkUp.generateByGrid(ƒ.Rectangle.GET(10, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
            this.walkDown.generateByGrid(ƒ.Rectangle.GET(10, 70, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.sleepAnimation = new ƒAid.SpriteSheetAnimation("Sleep", coat);
            this.sleepAnimation.generateByGrid(ƒ.Rectangle.GET(480, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.framerate = 25;
            this.setAnimation(this.walkDown);
            this.animalStateMachine= new AnimalStateMachine();
            this.addComponent(this.animalStateMachine);
        }
    }
}