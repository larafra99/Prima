declare namespace Runner {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let spriteNode: ƒ.Node;
    let Opponents: ƒ.Node;
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class OpponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        loadOppo(): Promise<void>;
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
