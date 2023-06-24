namespace Runner {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum ACTION {
        IDLE,FIGHT,MISSED
    }

    export class Avatar extends ƒAid.NodeSprite {
        private missedOpponnent:boolean = false;


        public constructor() {
            super("AvatarInstance");
            this.addComponent(new ƒ.ComponentTransform());
        }

       
        public act(_action: ACTION): void {
        //     let animation: ƒAid.SpriteSheetAnimation;
            switch (_action) {
                case ACTION.FIGHT:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0] as ƒ.AnimationSprite;
                    this.missedOpponnent= false;
                    break;
                case ACTION.IDLE:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0] as ƒ.AnimationSprite;
                    if(this.missedOpponnent){
                        spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = 5;
                    }
                    else{
                        spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = 15;
                    }
                    break;
                case ACTION.MISSED:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("missed_animation")[0] as ƒ.AnimationSprite;
                    this.missedOpponnent= true; 
                    break;
            }
        }  
    }
}