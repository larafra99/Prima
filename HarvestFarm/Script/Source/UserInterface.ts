namespace Harvest {
    import ƒ= FudgeCore;
    import ƒui= FudgeUserInterface;

    export class UserInterface extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void {
            /**/ 
        }
        public stamina: number;
        public vitality: number;
        public day: number;
        //public time: TimerHandler
        private controller: ƒui.Controller

        constructor(_config: {[key: string]: number}){
            super();
            this.stamina = _config.stamina;
            this.vitality=_config.vitality;
            this.controller= new ƒui.Controller(this,document.querySelector("#vui"))
            console.log(this.controller);
        }


    }
}