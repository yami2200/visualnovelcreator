export const mix_scriptcomponent = {

    props:["indentation", "lightcolormode", "functionAction", "index", "assets"],

    computed:{
        getIndentation(){
            return this.indentation + "%";
        },
        getWidth(){
            if(this.indentation > 30) return 70+"%";
            return (100 - this.indentation) +"%";
        },
        getWidthFunctionContainer(){
            if(this.indentation > 30) return 75+"%";
            return (100 - this.indentation) +"%";
        },
      getColor(){
          if(this.lightcolormode) return this.functionAction.lightColor;
          return this.functionAction.darkColor;
      },
    },

    methods:{
        contextMenuDM(e){
            this.$emit("rightClickComp", {e: e, index: this.index, indentation: this.indentation});
        },
    },

}