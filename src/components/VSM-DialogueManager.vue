<template>
  <v-card
      :height="height+'px'"
      width="100%"
      class="overflow-hidden justify-center"
      @mouseleave="leaveDialogueManager"
      @mousemove="trackMouse"
      @keyup.delete="deletePress"

      @keyup.&="addDialogue('dialogue')"
      @keyup.é="addDialogue('choices')"
      @keyup.51="addDialogue('condition')"
      @keyup.52="addDialogue('function')"
      @keyup.54="addDialogue('transition')"
      @keyup.53="addDialogue('input')"
  >
    <vsm-tooltip
      :bus="bus"
      :text="textTooltip"
    >

    </vsm-tooltip>

      <vsm-contextmenu
          :bus="bus"
          :item-context-menu="itemsMenu"
          @editdialogue="editDialogue"
          @breakinputs="breakInputLinks(true)"
          @breakoutputs="breakOutputLinks(true)"
          @breaklinks="breakLinks"
          @deletedialogue="deleteDialogue"

          @adddialogue="addDialogue('dialogue')"
          @addcondition="addDialogue('condition')"
          @addfunctionnode="addDialogue('function')"
          @addinputnode="addDialogue('input')"
          @addtransitionnode="addDialogue('transition')"
          @adddialoguechoices="addDialogue('choices')"

      > </vsm-contextmenu>

          <panZoom ref="panzoomelement" @init="initPanZoom" :options="{zoomDoubleClickSpeed: 1,beforeMouseDown: testIgnore, maxZoom: 10, minZoom:1, bounds: true,boundsPadding: 1}">

            <svg :height="height+'px'" :style="{cursor: getCursor}" width="100%" ref="svgBox" style="background-color: #dedede;" @mouseup="mouseUp" @mousedown="mouseDownSVG" @contextmenu="contextMenuDM">

              <line v-if="linkingBlock !== -1" pointer-events="none" :x1="linkingOutput===-1 ? linkXInp(linkingBlock, linkingInput) : linkXOut(linkingBlock, linkingOutput)" :y1="linkingOutput===-1 ? linkYInp(linkingBlock, linkingInput) : linkYOut(linkingBlock, linkingOutput)" :x2="xMouse" :y2="yMouse" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line>

              <g v-for="(value,index) in listDialogues" v-bind:key="index">
                <vsm-dialogueblock v-if="value.type === 'dialogue'" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialogueblock>
                <vsm-dialoguechoices v-if="value.type === 'choices'" @choiceHover="onChoiceHovered" @choiceStopHover="onChoiceStopHovered" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguechoices>
                <vsm-dialoguecondition v-else-if="value.type === 'condition'" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguecondition>
                <vsm-dialoguefunction v-else-if="value.type === 'function'" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguefunction>
                <vsm-dialogueinput v-else-if="value.type === 'input'" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialogueinput>
                <vsm-dialoguetransition v-else-if="value.type === 'transition'" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguetransition>

                <g v-for="(valueL,indexL) in value.nextDialogue" v-bind:key="indexL">
                  <line v-if="valueL.id !== -1" pointer-events="none" :x1="linkXOut(index, indexL)" :y1="linkYOut(index, indexL)" :x2="linkXInp(valueL.id, valueL.ii)" :y2="linkYInp(valueL.id, valueL.ii)" style="stroke:rgb(0,0,0);stroke-width:0.7" ></line>
                </g>
              </g>

              <rect
                v-if="selectingBox"
                rx="0"
                ry="0"
                :x="selectionBoxX"
                :y="selectionBoxY"
                :width="selectionBoxWidth"
                :height="selectionBoxHeight"
                class="selectionBox"
              >
              </rect>


            </svg>
          </panZoom>

  </v-card>
</template>

<script>
import Vue from "vue";
import testComp from './VSM-DialogueBlock';
import condition from './VSM-DialogueConditionnalBlock';
import functionDia from './VSM-DialogueFunctionBlock';
import inputDia from './VSM-DialogueInput';
import transitionDia from './VSM-DialogueTransitionPage';
import choicesDia from './VSM-DialogueChoices';
import contextMenu from './VSM-ContextMenu';
import tooltip from './VSM-Tooltip';
import { getDate, removePreviousDialoguesFromOutput, squareIntoSelection} from "@/lib";
import jsonBaseDialogue from './../assets/base_dialogue.json';
import jsonBaseDialogueCondition from './../assets/base_dialogueconditionnal.json';
import jsonBaseDialogueFunction from './../assets/base_dialoguefunction.json';
import jsonBaseDialogueInput from './../assets/base_dialogueinput.json';
import jsonBaseDialogueTransitionEntry from './../assets/base_dialoguetransition_entry.json';
import jsonBaseDialogueChoices from './../assets/base_dialoguechoices.json';
//import jsonBaseDialogueTransitionArrival from './../assets/base_dialoguetransition_entry.json';

const baseDialogue = jsonBaseDialogue;
const baseDialogueCondition = jsonBaseDialogueCondition;
const baseDialogueFunction = jsonBaseDialogueFunction;
const baseDialogueInput = jsonBaseDialogueInput;
const baseDialogueTransition = jsonBaseDialogueTransitionEntry;
const baseDialogueChoices = jsonBaseDialogueChoices;

export default {
  name: "VSM-DialogueManager",

  components: {
    'vsm-dialogueblock' : testComp,
    'vsm-dialoguecondition' : condition,
    'vsm-dialoguefunction' : functionDia,
    'vsm-contextmenu' : contextMenu,
    'vsm-dialogueinput' : inputDia,
    'vsm-dialoguetransition' : transitionDia,
    'vsm-dialoguechoices' : choicesDia,
    'vsm-tooltip' : tooltip,
  },

  props: ['height', 'width'],

  data : () => ({
    xTest: 500,
    yTest: 500,
    color: "red",

    itemsMenu: [{title : "yes", action : "test1"}, {title : "no", action : "test2"}],
    contextMenuSelection: null,
    contextMenuNode: false,
    mouseEvent: null,

    textTooltip: "",

    updateScroll: null,
    scrollDirLinking: [0,0],
    selectingBox: false,
    selectingBoxContent: [],
    selectingBoxLoc: {x: 0,y:0},
    lastSelectionGroup: null,
    panButtonPress: false,

    movingDialogue: false,

    justClick: false,
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

    selectionDialogue: [],

    listDialogues: [
      {
        title : "Beginning",
        x : 500,
        y : 300,
        text : "",
        type : "dialogue",
        action : [],
        offsetLoc : {x :  -10, y :  -5},
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
        action : [],
        offsetLoc : {x :  -10, y :  -5},
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
        action : [],
        offsetLoc : {x :  -10, y :  -5},
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
        action : [],
        offsetLoc : {x :  -10, y :  -5},
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
        action : [],
        offsetLoc : {x :  -10, y :  -7.5},
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

  computed : {
    selectionBoxX(){
      return Math.min(this.selectingBoxLoc.x, this.mouseEvent.offsetX);
    },
    selectionBoxY(){
      return Math.min(this.selectingBoxLoc.y, this.mouseEvent.offsetY);
    },
    selectionBoxWidth(){
      return Math.abs(Math.max(this.selectingBoxLoc.x, this.mouseEvent.offsetX) - Math.min(this.selectingBoxLoc.x, this.mouseEvent.offsetX));
    },
    selectionBoxHeight(){
      return Math.abs(Math.max(this.selectingBoxLoc.y, this.mouseEvent.offsetY) - Math.min(this.selectingBoxLoc.y, this.mouseEvent.offsetY));
    },
    getCursor(){
      return (this.panButtonPress ? 'grabbing' : (this.movingDialogue ? 'move' : 'default'));
    },
  },

  methods:{
    // ########################### GETTER FOR PLUGS LINKS LOCATIONS
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

    // ############################# SELECTION BEHAVIOR
    selectDialogue(data){
      if(this.selectingBox) return;
      this.justClick = true;
      var index = this.selectionDialogue.findIndex(v => v.index === data.index);
      if(index === -1) {
        if(this.selectionDialogue.length > 0 && (!data.shift || data.e.button ==2)) this.stopSelecting(this.selectionDialogue, [data.index]);
        this.selectionDialogue.push({
          index: data.index,
          offsetX: data.e.offsetX - this.listDialogues[data.index].x,
          offsetY: data.e.offsetY - this.listDialogues[data.index].y,
        });
      } else {
        this.lastSelectionGroup = {time: getDate(), index: data.index};
      }
      for(var i = 0; i<this.selectionDialogue.length;i++){
        this.selectionDialogue[i].offsetX = data.e.offsetX - this.listDialogues[this.selectionDialogue[i].index].x;
        this.selectionDialogue[i].offsetY = data.e.offsetY - this.listDialogues[this.selectionDialogue[i].index].y;
      }
      this.$refs.svgBox.addEventListener('mousemove', this.mouseMove)
    },
    testIgnore(e){
      return this.selectionDialogue.length > 0 || this.linkingBlock !== -1 || e.button !==1;
    },
    mouseDownSVG(e){
      if(e.button === 1 && e.buttons === 4) {
        e.preventDefault();
        this.panButtonPress = true;
      }
      if(this.justClick){
        this.justClick = false;
        return;
      }
      if(this.selectionDialogue.length > 0){
        this.stopSelecting(this.selectionDialogue);
      }
      if(!this.panButtonPress && e.button === 0 && e.button !== 2){
        this.selectingBox = true;
        this.selectingBoxLoc = {x: e.offsetX, y:e.offsetY};
      }
    },
    mouseUp(e){
      if(this.selectionDialogue.length > 0){
        this.$refs.svgBox.removeEventListener('mousemove', this.mouseMove);
        if(this.lastSelectionGroup!=null){
          if(getDate() - this.lastSelectionGroup.time < 150){
            this.stopSelecting(this.selectionDialogue, [this.lastSelectionGroup.index])
          }
        }
        this.lastSelectionGroup = null;
      }
      if(this.linkingBlock !== -1) {
        this.stopLinking();
      }
      if(this.selectingBox) {
        this.endSelectingBox(e);
      }
      if(this.panButtonPress) this.panButtonPress = false;
      if(this.movingDialogue) this.movingDialogue = false;
    },
    stopSelecting(array, ignoreIndex){
      if(array === this.selectionDialogue) this.$refs.svgBox.removeEventListener('mousemove', this.mouseMove);
      var newSelection = [];
      var ref = this;
      this.selectionDialogue.forEach(function(element){
        if(array.includes(element) && (ignoreIndex===undefined || !ignoreIndex.includes(element.index))){
          ref.bus.$emit('unselect'+element.index);
        } else {
          newSelection.push(element);
        }
      });
      this.selectionDialogue = newSelection;
    },
    mouseMove(e){
      this.movingDialogue = true;
      var ref = this;
      this.selectionDialogue.forEach((element) => {
        ref.listDialogues[element.index].x = e.offsetX - element.offsetX;
        ref.listDialogues[element.index].y = e.offsetY - element.offsetY;
        ref.bus.$emit('moving'+element.index);
      })
      /*this.listDialogues[this.selectedDialogue].x = e.offsetX - this.dragOffsetX;
      this.listDialogues[this.selectedDialogue].y = e.offsetY - this.dragOffsetY;
      this.bus.$emit('moving'+this.selectedDialogue);*/
    },
    endSelectingBox(e){
      this.stopSelecting(this.selectionDialogue);
      var ref = this;
      this.selectingBoxContent.forEach(dialogue => {
        this.selectDialogue({e:e, index: this.listDialogues.indexOf(dialogue), shift: true});
        var index = ref.listDialogues.indexOf(dialogue);
        ref.selectionDialogue.push({
          index: ref.listDialogues.indexOf(dialogue),
          offsetX: e.offsetX - ref.listDialogues[index].x,
          offsetY: e.offsetY - ref.listDialogues[index].y,
        });
      });
      this.selectingBox = false;
    },

    // ############################# LINKING BEHAVIOR
    startingLinkFromOutput(data){
      this.justClick = true;
      this.stopSelecting(this.selectionDialogue);
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
      this.justClick = true;
      this.stopSelecting(this.selectionDialogue);
      this.$refs.svgBox.addEventListener('mousemove', this.mouseMoveLink);
      this.linkingOutput = -1;
      this.linkingBlock = data.indexD;
      this.linkingInput = data.indexI;
      this.xMouse = data.e.offsetX;
      this.yMouse = data.e.offsetY;
    },
    linkEnd(data){
      if(this.linkingBlock == -1 || this.linkingBlock==data.indexD) return;
      this.bus.$emit('unselect'+data.indexD);
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
    leaveDialogueManager(e){
      if(this.linkingBlock != -1) {
        this.stopLinking();
      }
      if(this.selectingBox){
        this.endSelectingBox(e);
      }
      if(this.panButtonPress) this.panButtonPress = false;
      if(this.movingDialogue) this.movingDialogue = false;
    },

    // ############################ LOCATIONS MANAGEMENT
    initPanZoom(instance){
      this.panzoom = instance;
      this.panzoom.zoomTo(0.5,0.5,1.5);
    },
    updatePlugsLocFromChild(data){
      this.listDialogues[data.index].outputsLoc = data.outputsLoc;
      this.listDialogues[data.index].inputsLoc = data.inputsLoc;
    },

    // ############################ CONTEXT MENU BEHAVIOR
    contextMenuDM(e){
      if(!this.contextMenuNode){
        this.itemsMenu = [{title: "Add Dialogue", action: "adddialogue"},{title: "Add Dialogue Choices", action: "adddialoguechoices"}, {title: "Add Condition", action: "addcondition"}, {title: "Add Function Node", action: "addfunctionnode"}, {title: "Add Input Node", action: "addinputnode"}, {title: "Add Transition Node", action: "addtransitionnode"}]
        this.bus.$emit("showContextMenu", e);
      }
      this.contextMenuNode = false;
    },
    contextMenu(data){
      this.contextMenuNode = true;
      this.itemsMenu = data.items;
      this.contextMenuSelection = {index: [data.indexD], type: data.type, indexIO: data.indexIO}
      this.bus.$emit("showContextMenu", data.e);
    },

    // ############################ INPUT (KEYBOARD MOUSE) MANAGEMENT
    deletePress(){
      if(this.selectionDialogue.length > 0){
        this.contextMenuSelection = {index: this.selectionDialogue, type: "global", indexIO: -1};
        this.stopSelecting(this.selectionDialogue);
        this.deleteDialogue();
      }
    },
    trackMouse(e){
      this.mouseEvent = e;
      if(this.selectingBox){
        var minX = this.selectionBoxX;
        var maxX = Math.max(this.selectingBoxLoc.x, this.mouseEvent.offsetX)
        var minY = this.selectionBoxY;
        var maxY = Math.max(this.selectingBoxLoc.y, this.mouseEvent.offsetY)
        var ref = this;
        var indexs = this.listDialogues.filter(v => squareIntoSelection(minX, maxX, minY, maxY, v.x, v.y, -v.offsetLoc.x*2, -v.offsetLoc.y*2));
        var i = 0;
        this.listDialogues.forEach(dialogue => {
          if(indexs.includes(dialogue)){
            if(!this.selectingBoxContent.includes(dialogue)){
              ref.bus.$emit('select'+i, e);
            }
          } else if(this.selectingBoxContent.includes(dialogue)){
            ref.bus.$emit('unselect'+i, e);
          }
          i++;
        });
        this.selectingBoxContent = indexs;
      }
    },

    // ############################ DIALOGUES EDITING
    addDialogue(type){
      if(this.mouseEvent==null) return;
      var dialogue = null;
      switch (type) {
        case 'dialogue':
          dialogue = JSON.parse(JSON.stringify(baseDialogue));
          break;
        case 'choices':
          dialogue = JSON.parse(JSON.stringify(baseDialogueChoices));
          break;
        case 'condition':
          dialogue = JSON.parse(JSON.stringify(baseDialogueCondition));
          break;
        case 'function':
          dialogue = JSON.parse(JSON.stringify(baseDialogueFunction));
          break;
        case 'transition':
          dialogue = JSON.parse(JSON.stringify(baseDialogueTransition));
          break;
        case 'input':
          dialogue = JSON.parse(JSON.stringify(baseDialogueInput));
          break;
      }
      if(dialogue == null) return;
      dialogue.x = this.mouseEvent.offsetX + dialogue.offsetLoc.x;
      dialogue.y = this.mouseEvent.offsetY + dialogue.offsetLoc.y;
      this.listDialogues.push(dialogue);
    },
    editDialogue(){
      console.log("edit dialogue");
    },
    deleteDialogue(){
      if(this.contextMenuSelection==null) return;

      var list = this.contextMenuSelection.index;
      if(list.length === 0) return;

      this.stopSelecting(this.selectionDialogue);

      if(list[0].index === undefined) list[0] = {index: list[0]};
      this.contextMenuSelection.indexIO = -1;

      var ref = this;
      list.forEach(function(element){
        if(element.index !== -1) {

          ref.contextMenuSelection.index = element.index;
          ref.breakInputLinks(false);
          ref.breakOutputLinks(false);

          ref.listDialogues.splice(element.index, 1);

          var deleteIndex = element.index;

          for(var i = 0; i<ref.listDialogues.length; i++){

            var j = 0;
            ref.listDialogues[i].nextDialogue.forEach(function(nD){
              if(nD.id > deleteIndex) {
                ref.listDialogues[i].nextDialogue[j] = {id : nD.id -1, ii: nD.ii}; // this.listDialogues[i].nextDialogue[j]
              }
              j++;
            });

            j = 0;
            var k = 0;
            ref.listDialogues[i].previousDialogue.forEach(function(pD){
              pD.forEach(function(prev){
                if(prev.id > deleteIndex) {
                  ref.listDialogues[i].previousDialogue[j][k] = {id : prev.id -1, ii: prev.ii}; //this.listDialogues[i].previousDialogue[j][k]
                }
                k++;
              });
              j++;
            });

          }

          for(var o = 0; o<list.length; o++){
            if(list[o].index > element.index) list[o].index--;
          }

        }
      })
      this.contextMenuSelection=null;
    },

    // ########################### LINKS BETWEEN DIALOGUES EDITING
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

    // ############################# CHOICES HOVERED
    onChoiceHovered(data){
      this.textTooltip = data.text;
      this.bus.$emit("showTooltip", data.e);
    },
    onChoiceStopHovered(){
      this.bus.$emit("hideTooltip");
    },

  },

}
</script>

<style scoped>
.selectionBox {
  fill: #1a91ff;
  opacity: 0.33;
}
</style>