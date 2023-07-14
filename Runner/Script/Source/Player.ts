namespace Runner {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum ACTION {
        IDLE,FIGHT,MISSED
    }

    export class Avatar extends ƒAid.NodeSprite {
        private missedOpponnent:boolean = false;
        private playerFps: number = spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps;


        public constructor() {
            super("AvatarInstance");
        }

       
        public act(_action: ACTION): void {
        //     let animation: ƒAid.SpriteSheetAnimation;
            switch (_action) {
                case ACTION.FIGHT:
                    console.log("FOPS", this.playerFps);
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0] as ƒ.AnimationSprite;
                    this.missedOpponnent= false;
                    break;
                case ACTION.IDLE:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0] as ƒ.AnimationSprite;
                    if(this.missedOpponnent){
                        this.playerFps= 5;
                    }
                    else{
                        if(spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps < 15){
                            // this.playerFps= this.playerFps+1; 
                            this.playerFps= 15;  
                        }
                    }
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = this.playerFps;
                    break;
                case ACTION.MISSED:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("missed_animation")[0] as ƒ.AnimationSprite;
                    this.missedOpponnent= true; 
                    break;
            }
        }  
    }
}