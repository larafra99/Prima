namespace Runner {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum ACTION {
        IDLE,FIGHT,MISSED
    }

    export class Avatar extends ƒAid.NodeSprite {
        
        


        public constructor() {
            super("AvatarInstance");
        }

       
        public async act(_action: ACTION): Promise<void> {
        //     let animation: ƒAid.SpriteSheetAnimation;
            switch (_action) {
                case ACTION.FIGHT:
                    console.log("Fight");
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0] as ƒ.AnimationSprite;
                    missedOpponnent= false;
                    fight= true;
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = 15;
                    break;
                case ACTION.IDLE:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0] as ƒ.AnimationSprite;
                    if(missedOpponnent){
                        playerFps= 5;
                        petNode.dispatchEvent(new Event("ChangeSpeed", {bubbles: true}));
                    }
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = playerFps;
                    break;
                case ACTION.MISSED:
                    // TODO: hold animation longer
                    
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("missed_animation")[0] as ƒ.AnimationSprite;
                    missedOpponnent= true; 
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation.fps = 15;
                    
                    await new Promise(resolve => {setTimeout(resolve, 200)});
                    avatar.act(ACTION.IDLE);
                    // console.log(spriteNode.getComponent(ƒ.ComponentAnimator).playmode= );
                    break;
            }
            
            ui.speed= playerFps;
            opponentSpeed= ui.speed*0.01;
        }  
    }
}