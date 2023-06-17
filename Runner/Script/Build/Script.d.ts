declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Runner {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let spriteNode: ƒ.Node;
}
declare namespace Runner {
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
        private animationCurrent;
        private walkLeftRight;
        private walkUp;
        private walkDown;
        private fieldActionRight;
        private fieldActionUp;
        private fieldActionDown;
        constructor();
        walkleftright(_deltaTime: number): void;
        initializeAnimations(_imgSpriteSheet: ƒ.TextureImage): Promise<void>;
    }
}
