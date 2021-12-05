export const mix_settervariable = {

    data: () => ({
        dialog: false,
        type: "",
        choice: "1",
        value: null,
        select: null,
        refreshComputed: true,
    }),

    computed:{
        refEnabled(){
            return this.refEnable !== undefined && this.refEnable && this.listCompatibleVariables.length > 0;
        },
        listCompatibleVariables(){
            return this.listvariables.filter((v) => v.type.name === this.type && v.name !== this.variable.name);
        },
        disabledInputSpecific(){
            return this.choice!=="1" && this.listCompatibleVariables.length > 0;
        },
        disableSaveButton(){
            return (this.choice === "1" && this.value==null) || (this.choice === "2" && this.select==null);
        }
    },

    methods: {
        show() {
            this.dialog = true;
            this.resetDefault();
            this.refreshComputed = !this.refreshComputed;
            if(this.onlyVariable){
                this.choice = "2";
                let val = this.listCompatibleVariables.filter((v) => v.name === this.variable.value.value);
                if(val.length === 0){
                    this.select = null;
                } else {
                    this.select = val[0].name;
                }
            } else if(this.variable.value.type === "value") {
                this.choice = "1";
                this.value = this.variable.value.value;
            } else if(this.variable.value.type === "variable" && this.refEnabled) {
                let val = this.listCompatibleVariables.filter((v) => v.name === this.variable.value.value);
                if(val.length === 0){
                    this.choice = "1";
                    this.value = this.variable.type.defaultValue;
                } else {
                    this.choice = "2";
                    this.select = val[0].name;
                }
            } else {
                this.choice = "1";
                this.value = this.variable.type.defaultValue;
            }
            this.bus.$emit("setVarSetterInitial", {choice: this.choice, select: this.select});
            this.$forceUpdate();
        },
        hide() {
            this.dialog = false;
        },
        resetDefault(){
          console.log("reset Default not implemented !")  ;
        },
        save(){
            if(this.disableSaveButton) return;
            if(this.choice === "1") {
                this.$emit("newval", {type: "value", value: this.value});
            } else {
                if(this.select == null) return;
                if(this.select.name == undefined) this.$emit("newval", {type: "variable", value: this.select});
                else this.$emit("newval", {type: "variable", value: this.select.name});
            }
            this.hide();
        },
        cancel(){
            this.hide();
        },
        changeChoice(c){
            this.choice = c;
        },
        changeVarSelecting(s){
          this.select = s;
        },
    },

    mounted() {
        this.bus.$on('showSetter' + this.type, this.show);
        this.bus.$on('hideSetter' + this.type, this.hide);
    },

    props: ["bus", "variable", "refEnable", "listvariables", "onlyVariable"],
}