export const mix_dialogueblock = {

    props: ['dialogue', 'index', 'bus', 'linkingblock', 'linkingOutput'],

    data: () => ({
        selected: false,
        onePerInput: false,
        contextMenuX: 0,
        contextMenuY: 0,
        itemContextMenu: ["Edit", "Break Input Links", "Break Output Links"],
    }),

    computed: {
        xChild: function () {
            return this.dialogue.x + 7.5;
        },
        yBottom: function () {
            return this.dialogue.y + 7.5;
        },
        yTop: function () {
            return this.dialogue.y + 0.5;
        },
        yText: function () {
            return this.dialogue.y + 5.75;
        },
        xText:function () {
            return this.dialogue.x + 2 + (7.5 - this.dialogue.title.length / 25 * 7.5);
        },
        fontSizeText:function () {
            if(this.dialogue.title.length < 10) return 3;
            if(this.dialogue.title.length < 22) return 2;
            return 1.5;
        },
        textValue:function () {
            if(this.dialogue.title.length < 25) return this.dialogue.title;
            return this.dialogue.title.substring(0,25) + " ...";
        }
    },

    methods: {
        printDebug(text){
            console.log(text);
        },
        selecting(e){
            this.selected = true;
            this.$emit("selectD", {e:e, index: this.index});
        },
        unselect(){
            this.selected = false;
        },
        showContextMenu(e, type, indexIO){
            if(type === "global"){
                this.$emit("contextMenu", {e:e, indexD: this.index, type: type, indexIO: indexIO, items: [{title : "Break Input Links", action:"breakinputs"}, {title : "Break Output Links", action:"breakoutputs"}, {title : "Edit Dialogue", action:"editdialogue"}, {title : "Delete Dialogue", action:"deletedialogue"}]});
            } else{
                this.$emit("contextMenu", {e:e, indexD: this.index, type: type, indexIO: indexIO, items: [{title : "Break Links", action:"breaklinks"}]});
            }
        },
        clickOnDialogue(){
            console.log("clicked dialogue !")
        },
        linkEnd(e, ii, plugType){
            var indexI = ii;
            if((plugType=="output" && this.linkingOutput!=-1) || (plugType=="input" && this.linkingOutput==-1)) indexI = -1;
            if(indexI == -1){
                if(this.linkingOutput==-1){
                    for(var i = 0; i<this.dialogue.nextDialogue.length ;i++){
                        if(this.dialogue.nextDialogue[i].id == -1){
                            indexI = i;
                            break;
                        }
                    }
                } else {
                    for(var j = 0; j<this.dialogue.previousDialogue.length ;j++){
                        if(this.dialogue.previousDialogue[j].length == 1 && this.dialogue.previousDialogue[j][0].id == -1){
                            indexI = j;
                            break;
                        }
                    }
                }

                if(indexI == -1) indexI = 0;
            }

            this.$emit("linkEnd", {indexD: this.index, e:e, indexIO: indexI, onePerInput: this.onePerInput});
            if(this.selected) this.unselect();
        },
        startLinkingFromOutput(e, indexO){
            if(e.button === 0){
                this.$emit("linkingOutput", {indexD: this.index, indexO: indexO, e:e, previous: this.dialogue.nextDialogue[indexO].id, previousI: this.dialogue.nextDialogue[indexO].ii});
                this.dialogue.nextDialogue[indexO] = {id: -1, ii: 0};
            }
        },
        startLinkingFromInput(e, indexI){
            if(e.button === 0) this.$emit("linkingInput", {indexD: this.index, indexI: indexI, e:e});
        },
        mouseEnter(){
            if(this.linkingblock != -1 && this.linkingblock != this.index){
                this.selected = true;
            }
        },
        mouseLeave(){
            if(this.linkingblock != -1 && this.selected) this.unselect();
        },
        updatePlugsLocations(){
            this.$emit("updatePlugsLoc", {index: this.index, outputsLoc: [{x : this.dialogue.x + 10.5, y : this.dialogue.y + 9}], inputsLoc: [{x : this.dialogue.x + 10.5, y : this.dialogue.y}]});
        }
    },

    mounted() {
        this.bus.$on('unselect'+this.index, this.unselect);
        this.bus.$on('select'+this.index, this.selecting);
        this.bus.$on('moving'+this.index, this.updatePlugsLocations);
        this.updatePlugsLocations();
    },

}