<template>
  <v-card :height="height+'px'" width="100%" class="overflow-hidden justify-center" @mouseleave="leaveDialogueManager">

          <panZoom ref="panzoomelement" @init="initPanZoom" :options="{zoomDoubleClickSpeed: 1,beforeMouseDown: testIgnore, maxZoom: 10, minZoom:1, bounds: true,boundsPadding: 1}">

            <svg :height="height+'px'" width="100%" ref="svgBox" style="background-color: #dedede;" @mouseup="mouseUp">
                <!--<path :x="xTest" :y="yTest" @mousemove="mouseMove" @mousedown="mouseDown" @mouseup="mouseUp" @mouseenter="printtest('Enter')" d="M150 0 L75 200 L225 200 Z" />
                -->
               <!-- <rect
                    width="10"
                    height="10"
                    class="square"
                    :fill="color"
                    :x="xTest"
                    :y="yTest"
                    @mousedown="mouseDown"
                > @mouseIn="mouseEnterDialogue" @mouseOut="mouseLeaveDialogue"
                </rect>-->
              <line v-if="linkingBlock != -1" :x1="linkingOutput==-1 ? getInputLocX(linkingBlock) : getOutputLocX(linkingBlock, linkingOutput, listDialogues[linkingBlock].nextDialogue.length)" :y1="linkingOutput==-1 ? getInputLocY(linkingBlock) : getOutputLocY(linkingBlock)" :x2="xMouse" :y2="yMouse" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line>

              <g v-for="(value,index) in listDialogues" v-bind:key="index">
                <vsm-dialogueblock v-if="value.type == 'dialogue'" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialogueblock>
                <vsm-dialoguecondition v-if="value.type == 'condition'" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguecondition>

                <g v-for="(valueL,indexL) in value.nextDialogue" v-bind:key="indexL">
                  <line v-if="valueL != -1" :x1="getOutputLocX(index, indexL, value.nextDialogue.length)" :y1="getOutputLocY(index)" :x2="getInputLocX(valueL)" :y2="getInputLocY(valueL)" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line>
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
        nextDialogue : [1]
      },
      {
        title : "A",
        x : 500,
        y : 320,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        nextDialogue : [2]
      },
      {
        title : "Supra dialogue long azeoids",
        x : 500,
        y : 340,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        nextDialogue : [3]
      },
      {
        title : "Dialogue Middle",
        x : 500,
        y : 360,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        nextDialogue : [-1]
      },
      {
        title : "conditionnal block",
        x : 500,
        y : 380,
        text : "",
        type : "condition",
        choices : [],
        action : [],
        nextDialogue : [-1]
      },
    ]
  }),

  methods:{
    getInputLocX(index){
      return this.listDialogues[index].x + 10.5;
    },
    getInputLocY(index){
      return this.listDialogues[index].y;
    },
    getOutputLocY(index){
      return this.listDialogues[index].y + 9;
    },
    getOutputLocX(indexD, indexO, length){
      if(length==1){
        return this.listDialogues[indexD].x + 10.5;
      }
      return indexO; // TO DO FOR CHOICES
    },
    printtest(text){
      console.log(text);
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
      this.$refs.svgBox.removeEventListener('mousemove', this.mouseMove)
      this.bus.$emit('unselect'+this.selectedDialogue);
      this.selectedDialogue = -1;
    },
    mouseMove(e){
        this.listDialogues[this.selectedDialogue].x = e.offsetX - this.dragOffsetX;
        this.listDialogues[this.selectedDialogue].y = e.offsetY - this.dragOffsetY;
    },
    startingLinkFromOutput(data){
      this.$refs.svgBox.addEventListener('mousemove', this.mouseMoveLink);
      this.linkingOutput = data.indexO;
      this.linkingBlock = data.indexD;
      this.xMouse = data.e.offsetX;
      this.yMouse = data.e.offsetY;
    },
    linkEnd(data){
      if(this.linkingBlock == -1) return;
      if(this.linkingOutput!=-1 && this.linkingBlock!=data.indexD){
        this.listDialogues[this.linkingBlock].nextDialogue[this.linkingOutput] = data.indexD;
        this.stopLinking();
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
    }
  },

}
</script>

<style scoped>

</style>