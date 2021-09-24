export const mix_modal = {

    props:["bus"],

    data: () => ({
        dialog: false,
        nameText: "",
    }),

    mounted() {
        this.bus.$on('show'+this.nameText, this.show);
        this.bus.$on('hide'+this.nameText, this.hide);
        this.$emit("initShortcut", {name: this.nameText, f: this.handleShortcut});
    },

    methods:{
        handleShortcut(e){
            if(this.dialog){
                if(e.control && e.key === "s"){
                    this.save();
                } else if(e.key === "Escape") {
                    this.cancel();
                }
                return true;
            }
            return false;
        },

        save(){
          //empty
        },
        cancel(){
          this.hide();
        },
        hide(){
            this.dialog = false;
        },
        show(){
            this.dialog = true;
        },
    },

}