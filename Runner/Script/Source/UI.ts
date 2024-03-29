namespace Runner {
    import ƒ = FudgeCore;
    import ƒui = FudgeUserInterface;

    export class UserInterface extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void {
            /**/
        }
        public speed: number;
        public money: number;
        public maxspeed: number;
        public opponentmulitplicator: number;
        public moneymultipilcator: number;
        public controller: ƒui.Controller;

        constructor(_config: { [key: string]: number }) {
            super();
            this.speed = _config.speed;
            this.money = _config.money;
            this.maxspeed = _config.maxspeed;
            this.opponentmulitplicator = _config.opponentmulitplicator;
            this.moneymultipilcator = _config.moneymultipilcator;
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
        }
    }
}