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
}
