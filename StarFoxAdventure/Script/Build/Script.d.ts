declare namespace Script {
    import ƒ = FudgeCore;
    class EngineScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rgdBodySpaceship;
        strafeThrust: number;
        forwardthrust: number;
        private relativeX;
        private relativeY;
        private relativeZ;
        private width;
        private height;
        private xAxis;
        private yAxis;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
        handleMouse: (e: MouseEvent) => void;
        setRelativeAxes(): void;
        backwards(): void;
        thrust(): void;
        rollLeft(): void;
        rollRight(): void;
    }
}
declare namespace Script {
}
