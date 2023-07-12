declare namespace Runner {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let spriteNode: ƒ.Node;
    let Opponents: ƒ.Node;
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class Opponent extends ƒ.Node {
        constructor();
        static createOpponents(): ƒ.Node;
    }
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class OpponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        loadOppo(): void;
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
