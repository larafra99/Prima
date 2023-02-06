/// <reference path="../../../Aid/Build/FudgeAid.d.ts" />
declare namespace Harvest {
    import ƒ = FudgeCore;
    class CharacterEventScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        eventAudio: ƒ.ComponentAudio;
        private startpoint;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
        private startNewDay;
        private getDistance;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Harvest {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let playerstate: UserInterface;
    let cmpField: ƒ.ComponentMesh;
    let spriteNode: ƒ.Node;
    let onField: boolean;
    let stamina: number;
    let vitality: number;
}
declare namespace Harvest {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    enum ACTION {
        IDLE = 0,
        LEFTRIGHT = 1,
        UP = 2,
        DOWN = 3,
        INTERACTION = 4
    }
    class Avatar extends ƒAid.NodeSprite {
        private xSpeed;
        private interaction;
        private animationCurrent;
        private walkLeftRight;
        private walkUp;
        private walkDown;
        private fieldActionRight;
        private fieldActionUp;
        private fieldActionDown;
        constructor();
        walkleftright(_deltaTime: number): void;
        walkupdown(_deltaTime: number): void;
        act(_action: ACTION): void;
        initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void>;
    }
}
declare namespace Harvest {
    import ƒ = FudgeCore;
    class UserInterface extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void;
        stamina: number;
        vitality: number;
        day: number;
        private controller;
        constructor(_config: {
            [key: string]: number;
        });
    }
}
