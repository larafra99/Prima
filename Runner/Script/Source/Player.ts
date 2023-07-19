namespace Runner {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    //  defines Character actions 
    export enum ACTION {
        IDLE,FIGHT,MISSED
    }

    export class Avatar extends ƒAid.NodeSprite {
        
        public constructor() {
            super("AvatarInstance");
        }

        public async act(_action: ACTION): Promise<void> {
            switch (_action) {
                //  player fight action
                case ACTION.FIGHT:
                    missedOpponnent= false;
                    fight= true;
                    //  fight action possible after cooldown
                    if(!fightCoolDown){
                        spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("fight_animation")[0] as ƒ.AnimationSprite;
                        spriteNode.getComponent(ƒ.ComponentAnimator).scale = 1;
                        fightCoolDown= true;
                    }
                    //  timer for cooldown
                    let time: ƒ.Time = new ƒ.Time();
                    new ƒ.Timer(time, 100, 1, this.enableFighting);
                    break;
                //  sets idle action (Character runs)
                case ACTION.IDLE:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("walk_animation")[0] as ƒ.AnimationSprite;
                    //  changes speed of the player if opponents are missed 
                    if(missedOpponnent){
                        playerFps= 0.1;
                        petNode.dispatchEvent(new Event("ChangeSpeed", {bubbles: true}));
                    }
                    spriteNode.getComponent(ƒ.ComponentAnimator).scale = playerFps;
                    break;
                //  character action if opponents are missed
                case ACTION.MISSED:
                    spriteNode.getComponent(ƒ.ComponentAnimator).animation = ƒ.Project.getResourcesByName("missed_animation")[0] as ƒ.AnimationSprite;
                    missedOpponnent= true; 
                    spriteNode.getComponent(ƒ.ComponentAnimator).scale= 1;
                    
                    await new Promise(resolve => {setTimeout(resolve, 200)});
                    avatar.act(ACTION.IDLE);
                    break;
            }
            // updates VUI and opponets speed 
            ui.speed=  parseInt((playerFps*10).toFixed(0));
            opponentSpeed= playerFps;
        } 
    //  disables fight cooldown  
    public enableFighting():void{
        fightCoolDown= false;
    }
    }
}               