export const mix_dialogueblock = {

    props: ['dialogue', 'index', 'bus', 'linkingblock'],

    data: () => ({
        selected: false,
        onePerInput: false,
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
        selecting(e){
            this.selected = true;
            this.$emit("selectD", {e:e, index: this.index});
        },
        unselect(){
            this.selected = false;
        },
        linkEnd(e, ii){
            var indexI = ii;
            if(indexI == -1){ // TO DO
                for(var i = 0; i<this.dialogue.previousDialogue.length ;i++){
                    if(this.dialogue.previousDialogue[i].length == 1 && this.dialogue.previousDialogue[i][0].id == -1){
                        indexI = i;
                        break;
                    }
                }
                if(indexI == -1) indexI = 0;
            }
            this.$emit("linkEnd", {indexD: this.index, e:e, indexInput: indexI, onePerInput: this.onePerInput});
            if(this.selected) this.unselect();
        },
        startLinkingFromOutput(e, indexO){
            this.$emit("linkingOutput", {indexD: this.index, indexO: indexO, e:e, previous: this.dialogue.nextDialogue[indexO].id, previousI: this.dialogue.nextDialogue[indexO].ii});
            this.dialogue.nextDialogue[indexO] = {id: -1, ii: 0};
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