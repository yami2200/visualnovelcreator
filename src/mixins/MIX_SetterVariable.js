export const mix_settervariable = {

    data: () => ({
        dialog: false,
        type: "",
    }),

    computed:{
        refEnabled(){
            return this.refEnable!=undefined && this.refEnable;
        },
    },

    methods: {
        show() {
            this.dialog = true;
        },
        hide() {
            this.dialog = false;
        },
        save(){

        },
        cancel(){
            this.hide();
        },
    },

    mounted() {
        this.bus.$on('showSetter' + this.type, this.show);
        this.bus.$on('hideSetter' + this.type, this.hide);
    },

    props: ["bus", "variable", "refEnable"],
}