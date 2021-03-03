<template>
  <v-card :height="height+'px'" width="100%" class="overflow-hidden justify-center" @mouseleave="leaveDialogueManager">

          <panZoom ref="panzoomelement" @init="initPanZoom" :options="{zoomDoubleClickSpeed: 1,beforeMouseDown: testIgnore, maxZoom: 10, minZoom:1, bounds: true,boundsPadding: 1}">

            <svg :height="height+'px'" width="100%" ref="svgBox" style="background-color: #dedede;" @mouseup="mouseUp">

              <line v-if="linkingBlock != -1" pointer-events="none" :x1="linkingOutput==-1 ? linkXInp(linkingBlock, linkingInput) : linkXOut(linkingBlock, linkingOutput)" :y1="linkingOutput==-1 ? linkYInp(linkingBlock, linkingInput) : linkYOut(linkingBlock, linkingOutput)" :x2="xMouse" :y2="yMouse" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line>

              <g v-for="(value,index) in listDialogues" v-bind:key="index">
                <vsm-dialogueblock v-if="value.type == 'dialogue'" @updatePlugsLoc="updatePlugsLocFromChild" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialogueblock>
                <vsm-dialoguecondition v-if="value.type == 'condition'" @updatePlugsLoc="updatePlugsLocFromChild" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguecondition>

                <g v-for="(valueL,indexL) in value.nextDialogue" v-bind:key="indexL">
                  <!--<line v-if="valueL != -1" :x1="getOutputLocX(index, indexL, value.nextDialogue.length)" :y1="getOutputLocY(index)" :x2="getInputLocX(valueL)" :y2="getInputLocY(valueL)" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line> -->
                  <line v-if="valueL.id != -1" pointer-events="none" :x1="linkXOut(index, indexL)" :y1="linkYOut(index, indexL)" :x2="linkXInp(valueL.id, valueL.ii)" :y2="linkYInp(valueL.id, valueL.ii)" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line>
                </g>
              </g>

            </svg>
          </panZoom>

  </v-card>
</template>

<script>
import Vue from "vue";
import testComp from './VSM-DialogueBlock';
import condition from './VSM-DialogueConditionnalBlock';

export default {
  name: "VSM-DialogueManager",

  components: {
    'vsm-dialogueblock' : testComp,
    'vsm-dialoguecondition' : condition,
  },

  props: ['height', 'width'],

  data : () => ({
    xTest: 500,
    yTest: 500,
    color: "red",

    updateScroll: null,
    scrollDirLinking: [0,0],

    panzoom: null,
    linkingBlock: -1,
    linkingOutput: -1,
    linkingInput: -1,
    xMouse: 0,
    yMouse: 0,
    bus: new Vue(),
    dragOffsetX: 0,
    dragOffsetY: 0,
    selectedDialogue: -1,
    listDialogues: [
      {
        title : "Dialogue 1",
        x : 500,
        y : 300,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        previousDialogue : [[{id: -1, ii: 0}]],
        nextDialogue : [{id: 1, ii: 0}],
        outputsLoc : [{
          x: 0,
          y: 0
        }],
        inputsLoc : [{
          x: 0,
          y: 0
        }]
      },
      {
        title : "A",
        x : 500,
        y : 320,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        previousDialogue : [[{id: 0, ii: 0}]],
        nextDialogue : [{id: 2, ii: 0}],
        outputsLoc : [{
          x: 0,
          y: 0
        }],
        inputsLoc : [{
          x: 0,
          y: 0
        }]
      },
      {
        title : "Supra dialogue long azeoids",
        x : 500,
        y : 340,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        previousDialogue : [[{id: 1, ii: 0}]],
        nextDialogue : [{id: 3, ii: 0}],
        outputsLoc : [{
          x: 0,
          y: 0
        }],
        inputsLoc : [{
          x: 0,
          y: 0
        }]
      },
      {
        title : "Dialogue Middle",
        x : 500,
        y : 360,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        previousDialogue : [[{id: 2, ii: 0}]],
        nextDialogue : [{id: -1, ii: 0}],
        outputsLoc : [{
          x: 0,
          y: 0
        }],
        inputsLoc : [{
          x: 0,
          y: 0
        }]
      },
      {
        title : "conditionnal block",
        x : 500,
        y : 380,
        text : "",
        type : "condition",
        choices : [],
        action : [],
        previousDialogue : [[{id: -1, ii: 0}], [{id: -1, ii: 0}]],
        nextDialogue : [{id: -1, ii: 0}],
        outputsLoc : [{
          x: 0,
          y: 0
        }],
        inputsLoc : [{
          x: 0,
          y: 0
        }, {
          x: 0,
          y: 0
        }]
      },
    ]
  }),

  methods:{
    linkXOut(id, ii){
      return this.listDialogues[id].outputsLoc[ii].x;
    },
    linkYOut(id, ii){
      return this.listDialogues[id].outputsLoc[ii].y;
    },
    linkXInp(id, ii) {
      return this.listDialogues[id].inputsLoc[ii].x;
    },
    linkYInp(id, ii){
      return  this.listDialogues[id].inputsLoc[ii].y;
    },


    selectDialogue(data){
      this.selectedDialogue = data.index;
      this.dragOffsetX = data.e.offsetX - this.listDialogues[this.selectedDialogue].x;
      this.dragOffsetY = data.e.offsetY - this.listDialogues[this.selectedDialogue].y;
      this.$refs.svgBox.addEventListener('mousemove', this.mouseMove)
    },
    testIgnore(){
      return this.selectedDialogue != -1 || this.linkingBlock != -1;
    },
    mouseUp(){
      if(this.selectedDialogue != -1){
        this.stopSelecting();
      }
      if(this.linkingBlock != -1) {
        this.stopLinking();
      }
    },
    stopSelecting(){
      this.$refs.svgBox.removeEventListener('mousemove', this.mouseMove);
      this.bus.$emit('unselect'+this.selectedDialogue);
      this.selectedDialogue = -1;
    },
    mouseMove(e){
      this.listDialogues[this.selectedDialogue].x = e.offsetX - this.dragOffsetX;
      this.listDialogues[this.selectedDialogue].y = e.offsetY - this.dragOffsetY;
      this.bus.$emit('moving'+this.selectedDialogue);

    },
    startingLinkFromOutput(data){
      this.$refs.svgBox.addEventListener('mousemove', this.mouseMoveLink);
      if(data.previous != -1) {
        if(this.listDialogues[data.previous].previousDialogue[data.previousI].length>1){
          this.listDialogues[data.previous].previousDialogue[data.previousI].splice(this.listDialogues[data.previous].previousDialogue[data.previousI].findIndex(v => v.id === data.indexD && v.ii === data.indexO), 1);
        } else {
          this.listDialogues[data.previous].previousDialogue[data.previousI] = [{id: -1, ii:0}];
        }
      }
      this.linkingOutput = data.indexO;
      this.linkingBlock = data.indexD;
      this.xMouse = data.e.offsetX;
      this.yMouse = data.e.offsetY;
    },
    linkEnd(data){
      if(this.linkingBlock == -1) return;
      if(this.linkingOutput!=-1 && this.linkingBlock!=data.indexD){
        this.listDialogues[this.linkingBlock].nextDialogue[this.linkingOutput] = {id : data.indexD, ii: data.indexInput};
        if(this.listDialogues[data.indexD].previousDialogue[data.indexInput][0].id != -1){
          if(data.onePerInput){
            this.listDialogues[this.listDialogues[data.indexD].previousDialogue[data.indexInput][0].id].nextDialogue[this.listDialogues[data.indexD].previousDialogue[data.indexInput][0].ii] = {id: -1, ii:0}
            this.listDialogues[data.indexD].previousDialogue[data.indexInput] = [{id : this.linkingBlock, ii: this.linkingOutput}];
          } else {
            this.listDialogues[data.indexD].previousDialogue[data.indexInput].push({id : this.linkingBlock, ii: this.linkingOutput});
          }
        } else {
          this.listDialogues[data.indexD].previousDialogue[data.indexInput] = [{id : this.linkingBlock, ii: this.linkingOutput}];
        }

        this.stopLinking();
        console.log(this.listDialogues);
      }
    },
    stopLinking(){
      this.linkingBlock = -1;
      this.$refs.svgBox.removeEventListener('mousemove', this.mouseMoveLink);
      if(this.scrollDirLinking[0] != 0 || this.scrollDirLinking[1] != 0){
        clearInterval(this.updateScroll);
      }
    },
    mouseMoveLink(e){
      this.xMouse = e.offsetX;
      this.yMouse = e.offsetY;

      if(e.x < 50) {
        if(this.scrollDirLinking[0] == 0 && this.scrollDirLinking[1] == 0) this.addScrollInterval();
        this.scrollDirLinking = [1, this.scrollDirLinking[1]];
      } else if(e.x > this.width-50) {
        if(this.scrollDirLinking[0] == 0 && this.scrollDirLinking[1] == 0) this.addScrollInterval();
        this.scrollDirLinking = [-1, this.scrollDirLinking[1]];
      } else if(this.scrollDirLinking[0] != 0){
        this.scrollDirLinking = [0, this.scrollDirLinking[1]];
        if(this.scrollDirLinking[1] == 0) {
          clearInterval(this.updateScroll);
        }
      }

      if(e.y < 100) {
        if(this.scrollDirLinking[0] == 0 && this.scrollDirLinking[1] == 0) this.addScrollInterval();
        this.scrollDirLinking = [this.scrollDirLinking[0], 1];
      } else if(e.y > this.height-50) {
        if(this.scrollDirLinking[0] == 0 && this.scrollDirLinking[1] == 0) this.addScrollInterval();
        this.scrollDirLinking = [this.scrollDirLinking[0], -1];
      } else if(this.scrollDirLinking[1] != 0){
        this.scrollDirLinking = [this.scrollDirLinking[0], 0];
        if(this.scrollDirLinking[0] == 0) {
          clearInterval(this.updateScroll);
        }
      }

    },
    addScrollInterval(){
      this.updateScroll = setInterval(() => {
        this.panzoom.moveTo(this.panzoom.getTransform().x + this.scrollDirLinking[0]*10, this.panzoom.getTransform().y + this.scrollDirLinking[1]*10);
        if(this.panzoom.getTransform().x != 0 && this.panzoom.getTransform().x > (-1)*this.width*(this.panzoom.getTransform().scale-1) + 10) this.xMouse -= this.scrollDirLinking[0] * 10 * Math.pow(this.panzoom.getTransform().scale, -1);
        if(this.panzoom.getTransform().y != 0 && this.panzoom.getTransform().y > (-1)*this.height*(this.panzoom.getTransform().scale-1) + 10) this.yMouse -= this.scrollDirLinking[1] * 10 * Math.pow(this.panzoom.getTransform().scale, -1);
      }, 20)
    },
    leaveDialogueManager(){
      if(this.linkingBlock != -1) {
        this.stopLinking();
      }
      if(this.selectedDialogue != -1){
        this.stopSelecting();
      }
    },
    initPanZoom(instance){
      this.panzoom = instance;
      this.panzoom.zoomTo(0.5,0.5,1.5);
    },
    updatePlugsLocFromChild(data){
      this.listDialogues[data.index].outputsLoc = data.outputsLoc;
      this.listDialogues[data.index].inputsLoc = data.inputsLoc;
    }
  },

}
</script>

<style scoped>

</style>