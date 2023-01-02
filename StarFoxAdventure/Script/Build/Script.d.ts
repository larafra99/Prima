/// <reference path="../../../Aid/Build/FudgeAid.d.ts" />
declare namespace Script {
    function init(): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class EngineScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        power: number;
        private cmpCrashAudio;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
        private hndCollision;
        yaw(_value: number): void;
        pitch(_value: number): void;
        roll(_value: number): void;
        backwards(): void;
        thrust(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void;
        height: number;
        velocity: number;
        fuel: number;
        private controller;
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let Terrain: ƒ.ComponentMesh;
    let gameState: GameState;
    let viewport: ƒ.Viewport;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SensorScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        ATTACK = 1
    }
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        forceEscape: number;
        torqueIdle: number;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actIdle;
        private static actAttack;
        private static actDie;
        private hndEvent;
        private update;
    }
    export {};
}
