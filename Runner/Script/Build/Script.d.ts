declare namespace Runner {
    import ƒ = FudgeCore;
    class CollisionScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
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
    let avatar: Avatar;
    let ui: UserInterface;
    let fight: boolean;
    let missedOpponnent: boolean;
    let json: {
        [key: string]: number;
    };
    let petNode: ƒ.Node;
    let petStateMachine: PetState;
    let playerFps: number;
    let opponentSpeed: number;
    let fightCoolDown: boolean;
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class Opponent extends ƒ.Node {
        constructor();
        static createOpponents(skin: ƒ.Material): ƒ.Node;
    }
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class PetScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private startPostion;
        private petSpeedChange;
    }
}
declare namespace Runner {
    import ƒAid = FudgeAid;
    enum PETSTATE {
        IDLE = 0,
        RUN = 1,
        REST = 2,
        SIT = 3
    }
    export class PetState extends ƒAid.ComponentStateMachine<PETSTATE> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<PETSTATE>;
        private static transitDefault;
        private static petDefault;
        private static petIdle;
        private static petRun;
        private static petSit;
        private static petRest;
        private hndEvent;
        petReset(): void;
        changeSpeed(): void;
        private update;
    }
    export {};
}
declare namespace Runner {
    import ƒAid = FudgeAid;
    enum ACTION {
        IDLE = 0,
        FIGHT = 1,
        MISSED = 2
    }
    class Avatar extends ƒAid.NodeSprite {
        constructor();
        act(_action: ACTION): Promise<void>;
        enableFighting(): void;
    }
}
declare namespace Runner {
    import ƒ = FudgeCore;
    class RemoveOpponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
    }
}
declare namespace Runner {
    import ƒ = FudgeCore;
    import ƒui = FudgeUserInterface;
    class UserInterface extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void;
        speed: number;
        money: number;
        maxspeed: number;
        opponentmulitplicator: number;
        moneymultipilcator: number;
        controller: ƒui.Controller;
        constructor(_config: {
            [key: string]: number;
        });
    }
}
