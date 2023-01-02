///<reference path="./../../../Aid/Build/FudgeAid.d.ts"/>
namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;    

    export function init(): void {
        let time0 = 0;
        let time1 = 2000;
        let value0 = 1;
        let value1 = 45;
        let fps = 30;
        if (!graph) {
            return;
        }
         let cube = graph.getChildrenByName("Cube")[0];
        console.log("CUBE", cube);
        
        let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
        animseq.addKey(new ƒ.AnimationKey(time0, value0));
        animseq.addKey(new ƒ.AnimationKey(time1, value1));

        let animStructure: ƒ.AnimationStructure = {
            components: {
                ComponentTransform: [
                    {
                        "ƒ.ComponentTransform": {
                            mtxLocal: {
                                rotation: {
                                    x: animseq,
                                    y: animseq
                                }
                            }
                        }
                    }
                ]
            }
        };
        let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure, fps);
        let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE["LOOP"], ƒ.ANIMATION_PLAYBACK["TIMEBASED_CONTINOUS"]);
        cmpAnimator.scale = 1;


        cube.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
    }

}
