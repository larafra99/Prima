/// <reference path="../../../Aid/Build/FudgeAid.d.ts" />
declare namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        readonly xSpeedDefault = 0.9;
        readonly xSpeedSprint = 3;
        private walkanimation;
        private ySpeed;
        private gravity;
        constructor();
        update(_deltaTime: number): void;
        initializeAnimation(_imageSpriteSheer: ƒ.TextureImage): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
