export const mix_scriptcomponent = {

    props:["indentation", "lightcolormode", "functionAction", "index", "assets"],

    data: () => ({
       selected: false,
        timeoutMouseHover: null,
        mouseDirection: "null",
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
          //if(this.lightcolormode) return this.functionAction.lightColor;
          if(!this.functionAction.enable) return "#888888";
          if(this.selected) return this.functionAction.lightColor;
          return this.functionAction.darkColor;
      },
        getBorder(){
          if(this.selected) return "0 0 0 1.5pt "+this.$vuetify.theme.themes[this.theme].selectionComp;
          return "none";
        },
        theme(){
            return (this.$vuetify.theme.dark) ? 'dark' : 'light'
        },
        cssVars() {
            return {
                '--bg-color-insert': this.$vuetify.theme.themes[this.theme].background,
                "margin-left" : this.getIndentation,
                "box-shadow" : this.getBorder
            }
        }
    },

    methods:{
        select(e){
            this.selected = !this.selected;
            this.$emit("selectComp", {index: this.index, setSelect: this.setSelected, ctrl : e.ctrlKey});
        },
        contextMenuDM(e){
            if(!this.selected && (this.mouseDirection === "null" || this.timeoutMouseHover !== null)) this.selected = true;
            this.$emit("rightClickComp", {e: e, index: this.index, indentation: this.indentation, setSelect: this.setSelected});
        },
        setSelected(newVal){
          this.selected = newVal;
        },
        emitHoverDirection(){
            let obj = this.getInfoInsertHovering(this.mouseDirection);
            this.$emit("hoverInsertComp", obj);
        },
        getInfoInsertHovering(direction){
            return (direction ? null: null);
        },
        mouseLeave(){
            this.mouseDirection = "null";
            this.mouseLeaverRemoveHoverEffect();
            if(this.timeoutMouseHover !== null) clearTimeout(this.timeoutMouseHover);
            this.timeoutMouseHover = null;
            this.emitHoverDirection();
        },
        mouseLeaverRemoveHoverEffect(){
          //empty
        },
        switchMouseHoverPart(dir, newClass, refID){
            this.mouseLeave();
            let ref = this;
            this.timeoutMouseHover = setTimeout(function(){ ref.emitHoverDirection(); if(ref.$refs[refID] !== undefined) {ref.$refs[refID].$el.classList.add(newClass);} clearTimeout(ref.timeoutMouseHover); ref.timeoutMouseHover = null; }, 1000, ref);
            this.mouseDirection = dir;
        },
        deleteF(){
            this.$emit("deleteFunction", {index: this.index, setSelect: this.setSelected});
        },
    },

}


export const mix_scriptcomponentcontainer = {
    methods:{
        rightClickComp(data){
            this.$emit("rightClickComp",data);
        },
        deleteFunction(f){
            this.$emit("deleteFunction", f);
        },
        hoverInsertComp(comp){
            this.$emit("hoverInsertComp", comp);
        },
        toggleChildSelection(comp){
            this.$emit("selectComp", comp);
        },
    }
}