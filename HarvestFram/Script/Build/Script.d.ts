/// <reference path="../../../Aid/Build/FudgeAid.d.ts" />
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
}
declare namespace Harvest {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    enum WALK {
        IDLE = 0,
        LEFT = 1,
        RIGHT = 2,
        UP = 3,
        DOWN = 4
    }
    class Avatar extends ƒAid.NodeSprite {
        private xSpeed;
        private walkLeft;
        private walkRight;
        private walkUp;
        private walkDown;
        constructor();
        walkleftright(_deltaTime: number): void;
        walkupdown(_deltaTime: number): void;
        act(_action: WALK): void;
        initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void>;
    }
}
