namespace Harvest {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum ACTION {
        IDLE, LEFTRIGHT, UP, DOWN, INTERACTION
    }

    export class Avatar extends ƒAid.NodeSprite {
        private xSpeed: number = .9;

        private animationCurrent: ƒAid.SpriteSheetAnimation;
        private walkLeftRight: ƒAid.SpriteSheetAnimation;
        private walkUp: ƒAid.SpriteSheetAnimation;
        private walkDown: ƒAid.SpriteSheetAnimation;
        private fieldActionLeft:ƒAid.SpriteSheetAnimation;
        private fieldActionRight:ƒAid.SpriteSheetAnimation;
        private fieldActionUp:ƒAid.SpriteSheetAnimation;
        private fieldActionDown:ƒAid.SpriteSheetAnimation;

        
        //playerstate.stamina= this.node.mtxWorld.translation.y;
        //playerstate.vitality= Math.round(this.rigidbody.getVelocity().magnitude);

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

        public act(_action: ACTION): void {
            let animation: ƒAid.SpriteSheetAnimation;
            switch (_action) {
                case ACTION.LEFTRIGHT:
                    animation = this.walkLeftRight;
                    break;
                case ACTION.IDLE:
                    break;
                case ACTION.UP:
                    animation = this.walkUp;
                    break;
                case ACTION.DOWN:
                    animation = this.walkDown;
                    break;
                case ACTION.INTERACTION: 
                    break;
            }
            if(_action== ACTION.INTERACTION){
                if(this.animationCurrent == this.walkLeftRight){
                    animation= this.fieldActionRight;
                    console.log("Left")
                }
                else if(this.animationCurrent == this.walkUp){
                    animation= this.fieldActionUp;
                    console.log("UP");
                }
                else if(this.animationCurrent == this.walkDown){
                    animation= this.fieldActionDown
                    console.log("Down");
                }
                console.log("YESSSS");
            }
            

            if(_action == ACTION.IDLE){
                this.showFrame(0);
            }
            
            else if (animation != this.animationCurrent) {
                this.setAnimation(animation);
                this.animationCurrent = animation;   
            }
        }

        public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);

            this.walkLeftRight = new ƒAid.SpriteSheetAnimation("Right", coat);
            this.walkLeftRight.generateByGrid(ƒ.Rectangle.GET(10, 475, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
            this.walkUp.generateByGrid(ƒ.Rectangle.GET(10, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
            this.walkDown.generateByGrid(ƒ.Rectangle.GET(10, 70, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            
            this.fieldActionLeft = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionLeft.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.fieldActionRight = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionRight.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            
            this.fieldActionUp = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionUp.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));
            
            this.fieldActionDown = new ƒAid.SpriteSheetAnimation("Left", coat);
            this.fieldActionDown.generateByGrid(ƒ.Rectangle.GET(10, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.framerate = 20;
            //this.mtxLocal.translateY(+0.5);
        }
    }
}