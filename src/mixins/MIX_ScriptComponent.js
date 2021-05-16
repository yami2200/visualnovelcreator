import Vue from "vue";

export const mix_scriptcomponent = {

    props:["indentation", "lightcolormode", "functionAction", "index", "assets"],

    data : () => ({
        busCM: new Vue(),
        itemsContextMenu: [{title : "Insert New on Top", action : "insertnew"}, {title : "Move on Top", action : "movetop"}]
    }),

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
        insertNewFunctionTop(){
            this.$emit("InsertNew", this.index, this.indentation);
        },
        moveFunctionTop(){
            this.$emit("moveTop", this.index);
        },
        contextMenuDM(e){
            this.busCM.$emit("showContextMenu", e);
        },
    },

}