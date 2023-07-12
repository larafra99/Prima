namespace Runner {
    import ƒ= FudgeCore;
    import ƒui= FudgeUserInterface;

    export class UserInterface extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void {
            /**/ 
        }
        public speed: number;
        public money: number;

        constructor(_config: {[key: string]: number}){
            super();
            this.speed = _config.stamina;
            this.money=_config.vitality;
            
            //console.log(this.controller);
        }
    }
}