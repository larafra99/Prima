declare namespace Runner {
    import ƒ = FudgeCore;
    class CollisionScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        constructor();
        hndEvent: (_event: Event) => void;
        private hndCollision;
    }
}
declare namespace Runner {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let spriteNode: ƒ.Node;
    let Opponents: ƒ.Node;
    let OpponentsTrans: Float32Array;
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class Opponent extends ƒ.Node {
        constructor();
        static createOpponents(): ƒ.Node;
    }
}
declare namespace Runner {
    import ƒAid = FudgeAid;
    enum ACTION {
        IDLE = 0,
        FIGHT = 1,
        MISSED = 2
    }
    class Avatar extends ƒAid.NodeSprite {
        private missedOpponnent;
        private playerFps;
        constructor();
        act(_action: ACTION): void;
    }
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class UserInterface extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void;
        speed: number;
        money: number;
        constructor(_config: {
            [key: string]: number;
        });
    }
}
