<template>
  <v-card :height="height+'px'" width="100%" class="overflow-hidden justify-center" @mouseleave="leaveDialogueManager">
      <vsm-contextmenu
          :bus="bus"
          :item-context-menu="itemsMenu"
          @editdialogue="editDialogue"
          @breakinputs="breakInputLinks(true)"
          @breakoutputs="breakOutputLinks(true)"
          @breaklinks="breakLinks"
          @deletedialogue="deleteDialogue"

          @adddialogue="addDialogue('dialogue')"
      > </vsm-contextmenu>

          <panZoom ref="panzoomelement" @init="initPanZoom" :options="{zoomDoubleClickSpeed: 1,beforeMouseDown: testIgnore, maxZoom: 10, minZoom:1, bounds: true,boundsPadding: 1}">

            <svg :height="height+'px'" width="100%" ref="svgBox" style="background-color: #dedede;" @mouseup="mouseUp" @contextmenu="contextMenuDM">

              <line v-if="linkingBlock != -1" pointer-events="none" :x1="linkingOutput==-1 ? linkXInp(linkingBlock, linkingInput) : linkXOut(linkingBlock, linkingOutput)" :y1="linkingOutput==-1 ? linkYInp(linkingBlock, linkingInput) : linkYOut(linkingBlock, linkingOutput)" :x2="xMouse" :y2="yMouse" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line>

              <g v-for="(value,index) in listDialogues" v-bind:key="index">
                <vsm-dialogueblock v-if="value.type == 'dialogue'" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialogueblock>
                <vsm-dialoguecondition v-if="value.type == 'condition'" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguecondition>

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
import contextMenu from './VSM-ContextMenu';
import { removePreviousDialoguesFromOutput} from "@/lib";
import jsonBaseDialogue from './../assets/base_dialogue.json';

const baseDialogue = jsonBaseDialogue;

export default {
  name: "VSM-DialogueManager",

  components: {
    'vsm-dialogueblock' : testComp,
    'vsm-dialoguecondition' : condition,
    'vsm-contextmenu' : contextMenu,
  },

  props: ['height', 'width'],

  data : () => ({
    xTest: 500,
    yTest: 500,
    color: "red",

    itemsMenu: [{title : "yes", action : "test1"}, {title : "no", action : "test2"}],
    contextMenuSelection: null,
    contextMenuNode: false,
    contextMenuGlobalEvent: null,

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
        title : "Beginning",
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
        title : "Meeting Sabrina",
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
        title : "Sabrina likes you",
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
        title : "Sabrina doesn't like you",
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
        title : "Conditionnal Block",
        x : 500,
        y : 380,
        text : "",
        type : "condition",
        choices : [],
        action : [],
        previousDialogue : [[{id: -1, ii: 0}]],
        nextDialogue : [{id: -1, ii: 0}, {id: -1, ii: 0}],
        outputsLoc : [{
          x: 0,
          y: 0
        },
          {
          x: 0,
          y: 0
        }],
        inputsLoc : [{
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

    startingLinkFromInput(data){
      this.$refs.svgBox.addEventListener('mousemove', this.mouseMoveLink);
      this.linkingOutput = -1;
      this.linkingBlock = data.indexD;
      this.linkingInput = data.indexI;
      this.xMouse = data.e.offsetX;
      this.yMouse = data.e.offsetY;
    },


    linkEnd(data){
      if(this.linkingBlock == -1 || this.linkingBlock==data.indexD) return;
      if(this.linkingOutput!=-1){
        this.listDialogues[this.linkingBlock].nextDialogue[this.linkingOutput] = {id : data.indexD, ii: data.indexIO};
        if(this.listDialogues[data.indexD].previousDialogue[data.indexIO][0].id != -1){
          if(data.onePerInput){
            this.listDialogues[this.listDialogues[data.indexD].previousDialogue[data.indexIO][0].id].nextDialogue[this.listDialogues[data.indexD].previousDialogue[data.indexIO][0].ii] = {id: -1, ii:0}
            this.listDialogues[data.indexD].previousDialogue[data.indexIO] = [{id : this.linkingBlock, ii: this.linkingOutput}];
          } else {
            this.listDialogues[data.indexD].previousDialogue[data.indexIO].push({id : this.linkingBlock, ii: this.linkingOutput});
          }
        } else {
          this.listDialogues[data.indexD].previousDialogue[data.indexIO] = [{id : this.linkingBlock, ii: this.linkingOutput}];
        }

        this.stopLinking();
      } else {
        if(this.listDialogues[data.indexD].nextDialogue.length === 0) return;
        if(this.listDialogues[data.indexD].nextDialogue[data.indexIO].id === this.linkingBlock && this.listDialogues[data.indexD].nextDialogue[data.indexIO].ii === this.linkingInput) return;

        removePreviousDialoguesFromOutput(this.listDialogues, data.indexD, data.indexIO);

        /*var oldNext = this.listDialogues[data.indexD].nextDialogue[data.indexIO];
        if(oldNext.id != -1){
          if(this.listDialogues[oldNext.id].previousDialogue[oldNext.ii].length <=1) this.listDialogues[oldNext.id].previousDialogue[oldNext.ii] = [{id: -1, ii:0}];
          else this.listDialogues[oldNext.id].previousDialogue[oldNext.ii].splice(this.listDialogues[oldNext.id].previousDialogue[oldNext.ii].findIndex(v => v.id === data.indexD && v.ii === data.indexIO), 1);
        }*/
        this.listDialogues[data.indexD].nextDialogue[data.indexIO] = {id : this.linkingBlock, ii: this.linkingInput};

        if(this.listDialogues[this.linkingBlock].previousDialogue[this.linkingInput].length<=1) this.listDialogues[this.linkingBlock].previousDialogue[this.linkingInput] = [{id: data.indexD, ii:data.indexIO}]
        else this.listDialogues[this.linkingBlock].previousDialogue[this.linkingInput].push({id: data.indexD, ii:data.indexIO});

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
    },
    updatePlugsLocFromChild(data){
      this.listDialogues[data.index].outputsLoc = data.outputsLoc;
      this.listDialogues[data.index].inputsLoc = data.inputsLoc;
    },

    contextMenuDM(e){
      if(!this.contextMenuNode){
        this.contextMenuGlobalEvent = e;
        this.itemsMenu = [{title: "Add Dialogue", action: "adddialogue"},{title: "Add Dialogue Choices", action: "adddialoguechoices"}, {title: "Add Condition", action: "addcondition"}, {title: "Add Function Node", action: "addfunctionnode"}]
        this.bus.$emit("showContextMenu", e);
      }
      this.contextMenuNode = false;
    },

    contextMenu(data){
      this.contextMenuNode = true;
      this.itemsMenu = data.items;
      this.contextMenuSelection = {index: data.indexD, type: data.type, indexIO: data.indexIO}
      this.bus.$emit("showContextMenu", data.e);
    },


    addDialogue(type){
      if(this.contextMenuGlobalEvent==null) return;
      switch (type) {
        case 'dialogue':
          var dialogue = JSON.parse(JSON.stringify(baseDialogue));
          dialogue.x = this.contextMenuGlobalEvent.offsetX + dialogue.offsetLoc.x;
          dialogue.y = this.contextMenuGlobalEvent.offsetY + dialogue.offsetLoc.y;
          this.listDialogues.push(dialogue);
          break;
        case 'choices':
          break;
        case 'condition':
          break;
        case 'function':
          break;
      }
    },
    editDialogue(){
      console.log("edit dialogue");
    },
    deleteDialogue(){
      if(this.contextMenuSelection==null && this.contextMenuSelection.index === -1) return;
      this.contextMenuSelection.indexIO = -1;
      this.breakInputLinks(false);
      this.breakOutputLinks(false);
      this.listDialogues.splice(this.contextMenuSelection.index, 1);

      var deleteIndex = this.contextMenuSelection.index;
      var ref = this;

      for(var i = 0; i<this.listDialogues.length; i++){

        var j = 0;
        this.listDialogues[i].nextDialogue.forEach(function(nD){
          if(nD.id > deleteIndex) {
            ref.listDialogues[i].nextDialogue[j] = {id : nD.id -1, ii: nD.ii}; // this.listDialogues[i].nextDialogue[j]
          }
          j++;
        });

        j = 0;
        var k = 0;
        this.listDialogues[i].previousDialogue.forEach(function(pD){
          pD.forEach(function(prev){
            if(prev.id > deleteIndex) {
              ref.listDialogues[i].previousDialogue[j][k] = {id : prev.id -1, ii: prev.ii}; //this.listDialogues[i].previousDialogue[j][k]
            }
            k++;
          });
          j++;
        });

      }

      this.contextMenuSelection=null;
    },

    breakLinks(){
      if(this.contextMenuSelection==null) return;
      if(this.contextMenuSelection.type == "input") this.breakInputLinks();
      else if(this.contextMenuSelection.type == "output") this.breakOutputLinks();
    },
    breakInputLinks(removeCMD){
      if(this.contextMenuSelection==null) return;
      var j = 0;
      var i = 0;
      if(this.contextMenuSelection.indexIO === -1){
        for(j = 0; j<this.listDialogues[this.contextMenuSelection.index].previousDialogue.length ;j++){
          for(i = 0; i<this.listDialogues[this.contextMenuSelection.index].previousDialogue[j].length; i++){
            if(this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i].id !== -1) this.listDialogues[this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i].id].nextDialogue[this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i].ii] = {id: -1, i:0};
            this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i] = {id: -1, ii:0 };
          }
        }
      } else {
        j = this.contextMenuSelection.indexIO;
        for(i = 0; i<this.listDialogues[this.contextMenuSelection.index].previousDialogue[j].length; i++){
          if(this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i].id !== -1) this.listDialogues[this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i].id].nextDialogue[this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i].ii] = {id: -1, i:0};
          this.listDialogues[this.contextMenuSelection.index].previousDialogue[j][i] = {id: -1, ii:0 };
        }
      }
      this.$forceUpdate();
      if(removeCMD) this.contextMenuSelection=null;
    },
    breakOutputLinks(removeCMD){
      if(this.contextMenuSelection==null) return;
      var i = 0;
      if(this.contextMenuSelection.indexIO === -1){
        for(i = 0; i<this.listDialogues[this.contextMenuSelection.index].nextDialogue.length ;i++){
          removePreviousDialoguesFromOutput(this.listDialogues, this.contextMenuSelection.index, i);
          this.listDialogues[this.contextMenuSelection.index].nextDialogue[i] = {id: -1, ii:0};
        }
      } else {
        i = this.contextMenuSelection.indexIO;
        removePreviousDialoguesFromOutput(this.listDialogues, this.contextMenuSelection.index, i);
        this.listDialogues[this.contextMenuSelection.index].nextDialogue[i] = {id: -1, ii:0};
      }
      this.$forceUpdate();
      if(removeCMD) this.contextMenuSelection=null;
    },

  },

}
</script>

<style scoped>

</style>