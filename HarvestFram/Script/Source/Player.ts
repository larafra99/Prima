
namespace Harvest { // namespace nach Titel des Spieles bennenen
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum WALK {
        IDLE, LEFT, RIGHT, UP, DOWN
    }

    export class Avatar extends ƒAid.NodeSprite {
        private xSpeed: number = .9;

        private walkLeft: ƒAid.SpriteSheetAnimation;
        private walkRight: ƒAid.SpriteSheetAnimation;
        private walkUp: ƒAid.SpriteSheetAnimation;
        private walkDown: ƒAid.SpriteSheetAnimation;


        public constructor() {
        super("AvatarInstance");
        this.addComponent(new ƒ.ComponentTransform());
        }

        public walkleftright(_deltaTime: number): void {
            this.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }

        public walkupdown(_deltaTime: number): void {
            this.mtxLocal.translateZ(this.xSpeed * _deltaTime, true); 
        }
            
        public act(_action: WALK): void {
        let animation: ƒAid.SpriteSheetAnimation;
        switch (_action) {
            case WALK.LEFT:
            animation = this.walkLeft;
            break;
            case WALK.RIGHT:
            animation = this.walkRight;
            break;
            case WALK.IDLE:
            //this.showFrame(0);
            break;
            case WALK.UP:
            animation = this.walkUp;
            break;
            case WALK.DOWN:
            animation = this.walkDown;
            break;
        }
        }

        public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);

        this.walkLeft = new ƒAid.SpriteSheetAnimation("Left", coat);
        this.walkLeft.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 70, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

        this.walkRight = new ƒAid.SpriteSheetAnimation("Right", coat);
        this.walkRight.generateByGrid(ƒ.Rectangle.GET(10, 475, 86, 100), 3, 70, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

        this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
        this.walkUp.generateByGrid(ƒ.Rectangle.GET(10, 345, 86, 100), 3, 70, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

        this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
        this.walkDown.generateByGrid(ƒ.Rectangle.GET(10, 70, 86, 100), 3, 70, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
        
        this.framerate = 20;
        this.mtxLocal.translateY(+0.5);
        }
    }
}