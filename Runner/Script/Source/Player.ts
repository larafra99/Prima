namespace Runner {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum ACTION {
        IDLE, LEFTRIGHT, UP, DOWN, INTERACTION
    }

    export class Avatar extends ƒAid.NodeSprite {
        private xSpeed: number = 1.1;

        private animationCurrent: ƒAid.SpriteSheetAnimation;
        private walkLeftRight: ƒAid.SpriteSheetAnimation;
        private walkUp: ƒAid.SpriteSheetAnimation;
        private walkDown: ƒAid.SpriteSheetAnimation;
        private fieldActionRight: ƒAid.SpriteSheetAnimation;
        private fieldActionUp: ƒAid.SpriteSheetAnimation;
        private fieldActionDown: ƒAid.SpriteSheetAnimation;


        public constructor() {
            super("AvatarInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }

        public walkleftright(_deltaTime: number): void {
            spriteNode.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }

        // public act(_action: ACTION): void {
        //     let animation: ƒAid.SpriteSheetAnimation;
        //     switch (_action) {
        //         case ACTION.LEFTRIGHT:
        //             animation = this.walkLeftRight;
        //             break;
        //         case ACTION.IDLE:
        //             break;
        //         case ACTION.UP:
        //             animation = this.walkUp;
        //             break;
        //         case ACTION.DOWN:
        //             animation = this.walkDown;
        //             break;
                

        //             this.interaction = true;

        //             if (this.animationCurrent == this.walkLeftRight) {
        //                 this.showFrame(farmingTool);
        //                 animation = this.fieldActionRight;
        //                 console.log("Left")
        //                 break;
        //             }
        //             else if (this.animationCurrent == this.walkUp) {
        //                 this.showFrame(farmingTool);
        //                 animation = this.fieldActionUp;
        //                 console.log("UP");
        //                 break;
        //             }
        //             else if (this.animationCurrent == this.walkDown) {
        //                 this.showFrame(farmingTool);
        //                 animation = this.fieldActionDown;
        //                 console.log("Down");
        //                 break;
        //             }
        //     }

        //     if (_action == ACTION.IDLE) {
        //         if (this.interaction) {
        //             animation = this.animationCurrent;
        //             this.interaction = false;
        //         }
        //         this.showFrame(0);
        //     }

        //     else if (animation != this.animationCurrent && _action != ACTION.INTERACTION) {
        //         this.setAnimation(animation);
        //         this.animationCurrent = animation;
        //     }
        // }

        public async initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void> {
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, _imgSpriteSheet);

            this.walkLeftRight = new ƒAid.SpriteSheetAnimation("Run", coat);
            this.walkLeftRight.generateByGrid(ƒ.Rectangle.GET(10, 285, 50, 70), 6, 10, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            // this.walkUp = new ƒAid.SpriteSheetAnimation("Up", coat);
            // this.walkUp.generateByGrid(ƒ.Rectangle.GET(10, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            // this.walkDown = new ƒAid.SpriteSheetAnimation("Down", coat);
            // this.walkDown.generateByGrid(ƒ.Rectangle.GET(10, 70, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            // this.fieldActionRight = new ƒAid.SpriteSheetAnimation("Actionright", coat);
            // this.fieldActionRight.generateByGrid(ƒ.Rectangle.GET(480, 210, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            // this.fieldActionUp = new ƒAid.SpriteSheetAnimation("Actionup", coat);
            // this.fieldActionUp.generateByGrid(ƒ.Rectangle.GET(480, 345, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            // this.fieldActionDown = new ƒAid.SpriteSheetAnimation("Actiondown", coat);
            // this.fieldActionDown.generateByGrid(ƒ.Rectangle.GET(480, 65, 86, 100), 3, 100, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(95.8));

            this.framerate = 25;
        }
    }
}