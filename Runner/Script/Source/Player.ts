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
            switch (_action) {
                case ACTION.FIGHT:
                    missedOpponnent= false;
                    fight= true;
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0] as ƒ.AnimationSprite;
                    spriteNode.getComponent(ƒ.ComponentAnimator).scale = 1;
                    fightCoolDown= true;

                    let time: ƒ.Time = new ƒ.Time();
                    new ƒ.Timer(time, 100, 1, this.enableFighting);
                    break;
                case ACTION.IDLE:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0] as ƒ.AnimationSprite;
                    if(missedOpponnent){
                        playerFps= 0.1;
                        petNode.dispatchEvent(new Event("ChangeSpeed", {bubbles: true}));
                    }
                    spriteNode.getComponent(ƒ.ComponentAnimator).scale = playerFps;
                    break;
                case ACTION.MISSED:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("missed_animation")[0] as ƒ.AnimationSprite;
                    missedOpponnent= true; 
                    spriteNode.getComponent(ƒ.ComponentAnimator).scale= 1;
                    
                    await new Promise(resolve => {setTimeout(resolve, 200)});
                    avatar.act(ACTION.IDLE);
                    break;
            }
            ui.speed=  parseInt((playerFps*10).toFixed(0));
            opponentSpeed= playerFps;
        }  
    public enableFighting():void{
        fightCoolDown= false;
    }
    }
}               