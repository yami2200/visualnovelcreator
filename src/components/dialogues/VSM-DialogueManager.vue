<template>
  <v-card
      height="100vh"
      width="100%"
      class="overflow-hidden justify-center"
      :style="{backgroundColor: backgroundColorSVG}"
      @mouseleave="leaveDialogueManager"
      @mousemove="trackMouse"
      @keyup.delete="deletePress"

      @keyup.&="addDialogue('dialogue')"
      @keyup.é="addDialogue('choices')"
      @keyup.51="addDialogue('condition')"
      @keyup.52="addDialogue('function')"
      @keyup.54="addDialogue('transition')"
      @keyup.53="addDialogue('input')"

      @keyup.f2="renameDialogueRequest"
  >

    <vsm-inputtext :bus="bus" :maxLetters="30" :text="'Write a new name for your dialogue'+(selectionDialogue.length>1 ? 's' : '')+' :'" :headline="'Rename dialogue'+(selectionDialogue.length>1 ? 's' : '')" @accept="renameDialogues"></vsm-inputtext>

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
          @initialdialogue="setInitialDialogue"

          @adddialogue="addDialogue('dialogue')"
          @addcondition="addDialogue('condition')"
          @addfunctionnode="addDialogue('function')"
          @addinputnode="addDialogue('input')"
          @addtransitionnode="addDialogue('transition')"
          @adddialoguechoices="addDialogue('choices')"

      > </vsm-contextmenu>

    <vsm-editdialoguepanel @initShortcut="initShortcutLink" :bus="bus" :listDialogues="listDialogues" @refresh="refresh" :assets="assets" :listPages="listPages" @DeleteTransition="deleteTransitionDialogue"></vsm-editdialoguepanel>

          <panZoom ref="panzoomelement" @init="initPanZoom" :options="{zoomDoubleClickSpeed: 1, beforeMouseDown: testIgnore, maxZoom: 10, minZoom:1, bounds: true, boundsPadding: 1}" style="outline: none;">

            <svg :height="2000+'px'" :style="{cursor: getCursor, backgroundColor: backgroundColorSVG}" :width="2000+'px'" ref="svgBox" @mouseup="mouseUp" @mousedown="mouseDownSVG" @contextmenu="contextMenuDM">

              <defs>

                <linearGradient id="InitialDialogueIcon" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#3455eb"/>
                  <stop offset="100%" stop-color="#051d87"/>
                </linearGradient>

                <linearGradient id="DialogueBlock" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#81D152"/>
                  <stop offset="100%" stop-color="#519e24"/>
                </linearGradient>
                <linearGradient id="DialogueBlockOutput" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#6bad44"/>
                  <stop offset="100%" stop-color="#3e7a1b"/>
                </linearGradient>
                <linearGradient id="DialogueBlockOutputHovered" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#558a36"/>
                  <stop offset="100%" stop-color="#2b5712"/>
                </linearGradient>

                <linearGradient id="ChoiceBlock" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#42ADC7"/>
                  <stop offset="100%" stop-color="#097791"/>
                </linearGradient>
                <linearGradient id="ChoiceBlockOutput" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#2669b1"/>
                  <stop offset="100%" stop-color="#024b99"/>
                </linearGradient>
                <linearGradient id="ChoiceBlockOutputHovered" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#1f548c"/>
                  <stop offset="100%" stop-color="#023b78"/>
                </linearGradient>
                <linearGradient id="ChoiceBlockObjectOutput" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#1436ad"/>
                  <stop offset="100%" stop-color="#002194"/>
                </linearGradient>
                <linearGradient id="ChoiceBlockObjectOutputHovered" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#10256e"/>
                  <stop offset="100%" stop-color="#001663"/>
                </linearGradient>

                <linearGradient id="ConditionalBlock" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#FF5347"/>
                  <stop offset="100%" stop-color="#b30d02"/>
                </linearGradient>
                <linearGradient id="ConditionalBlockOutput" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#b82127"/>
                  <stop offset="100%" stop-color="#ab0208"/>
                </linearGradient>
                <linearGradient id="ConditionalBlockOutputHovered" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#821e22"/>
                  <stop offset="100%" stop-color="#570306"/>
                </linearGradient>

                <linearGradient id="FunctionBlock" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#FF9D4F"/>
                  <stop offset="100%" stop-color="#ba5e14"/>
                </linearGradient>
                <linearGradient id="FunctionBlockOutput" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#de6723"/>
                  <stop offset="100%" stop-color="#b84300"/>
                </linearGradient>
                <linearGradient id="FunctionBlockOutputHovered" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#914519"/>
                  <stop offset="100%" stop-color="#752b01"/>
                </linearGradient>

                <linearGradient id="InputBlock" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#F5F263"/>
                  <stop offset="100%" stop-color="#d6d206"/>
                </linearGradient>
                <linearGradient id="InputBlockOutput" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#cfb826"/>
                  <stop offset="100%" stop-color="#a69007"/>
                </linearGradient>
                <linearGradient id="InputBlockOutputHovered" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#a39224"/>
                  <stop offset="100%" stop-color="#5e5203"/>
                </linearGradient>

                <linearGradient id="TransitionBlock" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#5B4DB7"/>
                  <stop offset="100%" stop-color="#251499"/>
                </linearGradient>
                <linearGradient id="TransitionBlockOutput" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#451ca5"/>
                  <stop offset="100%" stop-color="#29008a"/>
                </linearGradient>
                <linearGradient id="TransitionBlockOutputHovered" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#351a73"/>
                  <stop offset="100%" stop-color="#16004a"/>
                </linearGradient>

              </defs>

              <path v-if="linkingBlock !== -1" pointer-events="none" :d="getPathLinkBezierToMouse(linkingOutput===-1 ? xMouse : linkXOut(linkingBlock, linkingOutput), linkingOutput===-1 ? yMouse : linkYOut(linkingBlock, linkingOutput), linkingOutput===-1 ? linkXInp(linkingBlock, linkingInput) : xMouse, linkingOutput===-1 ? linkYInp(linkingBlock, linkingInput) : yMouse)" style="stroke:rgb(0,0,0);stroke-width:0.3" fill="none"/>

              <g v-for="(value,index) in listDialogues" v-bind:key="index">
                <g v-for="(valueL,indexL) in value.nextDialogue" v-bind:key="indexL">
                  <path v-if="valueL.id !== -1" pointer-events="none" :d="getPathLinkBezier(index, indexL, valueL)" style="stroke:rgb(0,0,0);stroke-width:0.3" fill="none"/>
                </g>

                <vsm-dialogueblock v-if="value.type === 'dialogue'" @clickDialogue="clickDialogue" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialogueblock>
                <vsm-dialoguechoices v-if="value.type === 'choices'" @clickDialogue="clickDialogue" @choiceHover="onChoiceHovered" @choiceStopHover="onChoiceStopHovered" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguechoices>
                <vsm-dialoguecondition v-else-if="value.type === 'condition'" @clickDialogue="clickDialogue" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguecondition>
                <vsm-dialoguefunction v-else-if="value.type === 'function'" @clickDialogue="clickDialogue" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguefunction>
                <vsm-dialogueinput v-else-if="value.type === 'input'" @clickDialogue="clickDialogue" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialogueinput>
                <vsm-dialoguetransition v-else-if="value.type === 'transition'" @clickDialogue="clickDialogue" @contextMenu="contextMenu" :linkingOutput="linkingOutput" @updatePlugsLoc="updatePlugsLocFromChild" @linkingInput="startingLinkFromInput" :linkingblock="linkingBlock" :bus="bus"  @linkEnd="linkEnd" @linkingOutput="startingLinkFromOutput" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-dialoguetransition>

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

    <v-card-actions style="height: 50px; position: fixed; z-index: 10; bottom: 5px; pointer-events:none;">
      <v-btn
          style="pointer-events: auto;"
          @mouseenter="leaveDialogueManager"
          @click="playGame(false)"
          :disabled="disablePlayBtn"
          color="primary"
          absolute
          top
          left
          fab
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn
          style="margin-left: 70px"
          :style="{pointerEvents : (disablePlayFromDialogueBtn ? 'none' : 'auto')}"
          @mouseenter="leaveDialogueManager"
          :disabled="disablePlayFromDialogueBtn"
          @click="playGame(true)"
          color="green"
          small
          absolute
          top
          left
          fab
      >
        <v-icon>mdi-clipboard-play-outline</v-icon>
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import Vue from "vue";
import testComp from './nodes/VSM-DialogueBlock';
import condition from './nodes/VSM-DialogueConditionnalBlock';
import functionDia from './nodes/VSM-DialogueFunctionBlock';
import inputDia from './nodes/VSM-DialogueInput';
import transitionDia from './nodes/VSM-DialogueTransitionPage';
import choicesDia from './nodes/VSM-DialogueChoices';
import contextMenu from '../VSM-ContextMenu';
import tooltip from '../VSM-Tooltip';
import {writeFile, readFileSync, getDate, removePreviousDialoguesFromOutput, squareIntoSelection} from "@/lib";
import jsonBaseDialogue from '../../assets/base_dialogue.json';
import jsonBaseDialogueCondition from '../../assets/base_dialogueconditionnal.json';
import jsonBaseDialogueFunction from '../../assets/base_dialoguefunction.json';
import jsonBaseDialogueInput from '../../assets/base_dialogueinput.json';
import jsonBaseDialogueTransitionEntry from '../../assets/base_dialoguetransition_entry.json';
import jsonBaseDialogueChoices from '../../assets/base_dialoguechoices.json';
import inputText from "@/components/modalrequest/VSM-InputTextModal";
import EditDialogue from "@/components/VSM-EditDialoguePanel"
import {remote} from "electron";

const BrowserWindow = remote.BrowserWindow
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
    'vsm-inputtext' : inputText,
    'vsm-editdialoguepanel' : EditDialogue,
  },

  props: ['width', 'listDialogues', "assets", "listPages", "busEntry", "projectproperties", "currentpage"],

  data : () => ({
    color: "red",
    manualMove: false,

    itemsMenu: [{title : "yes", action : "test1"}, {title : "no", action : "test2"}],
    contextMenuSelection: null,
    contextMenuNode: false,
    mouseEvent: null,

    textTooltip: "",

    clipboard: {frompage : "", content : []},

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
    editDialogueShortcutFunction: null,

    windowGame : null,

    initialDialogue : {page : null, index: -1},

    selectionDialogue: [],
  }),

  computed : {
    selectionBoxX(){
      if(this.mouseEvent == null) return this.selectingBoxLoc.x;
      return Math.min(this.selectingBoxLoc.x, this.mouseEvent.offsetX);
    },
    selectionBoxY(){
      if(this.mouseEvent == null) return this.selectingBoxLoc.y;
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
    disablePlayFromDialogueBtn(){
      return this.selectionDialogue.length !== 1;
    },
    backgroundColorSVG(){
      return (this.$vuetify.theme.dark ? '#282936': '#dedede');
    },
    disablePlayBtn(){
      return this.initialDialogue === null || this.initialDialogue.page === null || this.initialDialogue.index === -1;
    },
  },
  methods:{
    test(){
      console.log("enter")
    },
    playGame(fromselection){
      let textURL = "";
      if(fromselection){
        if(this.disablePlayFromDialogueBtn) return;
        textURL = "?page=" + this.currentpage +"&dialogue="+this.selectionDialogue[0].index;
      } else {
        textURL = "?page=" + this.initialDialogue.page +"&dialogue="+this.initialDialogue.index;
      }

      this.$emit("save");

      let icon = "";
      if(this.projectproperties.icon!=="") icon = this.projectproperties.directory+this.projectproperties.icon;

      try{
        if(this.windowGame !== null){
          this.windowGame.close();
        }
      } catch{
        console.log('');
      }

      this.windowGame = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        width: 1280,
        height: 720,
        icon: icon,
        webPreferences: {
          webSecurity: false,
        }});
      this.windowGame.on('close', function () { this.windowGame = null });
      let devEngine = false;
      if(devEngine && process.env.NODE_ENV !== 'production'){
        var fileHTML = readFileSync("Y:\\Yami-Production\\Visual Novel Maker (Web Version)\\visualnovelmaker\\src\\engine\\game.html");
        var fileJS = readFileSync("Y:\\Yami-Production\\Visual Novel Maker (Web Version)\\visualnovelmaker\\src\\engine\\libEngine.js");
        var fileCSS = readFileSync("Y:\\Yami-Production\\Visual Novel Maker (Web Version)\\visualnovelmaker\\src\\engine\\styleEngine.css");
        //var fileHTML = readFileSync("C:\\Users\\Romai\\OneDrive\\Bureau\\VIsual Novel Maker\\visualnovelmaker\\src\\engine\\game.html");
        //var fileJS = readFileSync("C:\\Users\\Romai\\OneDrive\\Bureau\\VIsual Novel Maker\\visualnovelmaker\\src\\engine\\libEngine.js");
        //var fileCSS = readFileSync("C:\\Users\\Romai\\OneDrive\\Bureau\\VIsual Novel Maker\\visualnovelmaker\\src\\engine\\styleEngine.css");
        writeFile(this.projectproperties.directory+"/game.html", fileHTML);
        writeFile(this.projectproperties.directory+"/libEngine.js", fileJS);
        writeFile(this.projectproperties.directory+"/styleEngine.css", fileCSS);
      }
      this.windowGame.loadURL("file://"+this.projectproperties.directory+"/game.html"+textURL);
      this.windowGame.once('ready-to-show', () => {
        this.windowGame.show()
      });
    },

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
      return this.listDialogues[id].inputsLoc[ii].y;
    },
    getPathLinkBezier(index, indexL, valueL){
      let linkX = this.linkXOut(index, indexL);
      let linkY = this.linkYOut(index, indexL);
      let linkX2 = this.linkXInp(valueL.id, valueL.ii);
      let linkY2 = this.linkYInp(valueL.id, valueL.ii);
      return 'M '+linkX+','+linkY+' C '+linkX+', '+(linkY+10)+' '+linkX2+', '+(linkY2-10)+' '+linkX2+', '+linkY2;
    },
    getPathLinkBezierToMouse(x1, y2, xMouse, yMouse){
      return 'M '+x1+','+y2+' C '+x1+', '+(y2+10)+' '+xMouse+', '+(yMouse-10)+' '+xMouse+', '+yMouse;
    },

    // ############################# SELECTION BEHAVIOR
    selectDialogue(data){
      if(this.selectingBox) return;
      this.justClick = true;
      var index = this.selectionDialogue.findIndex(v => v.index === data.index);
      if(index === -1) {
        if(this.selectionDialogue.length > 0 && (!data.shift || data.e.button ===2)) this.stopSelecting(this.selectionDialogue, [data.index]);
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
        this.selectingBoxContent = [];
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
      this.selectionDialogue.length = 0;
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
      if(data.previous !== -1) {
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
      if(this.linkingBlock === -1 || this.linkingBlock===data.indexD) return;
      this.bus.$emit('unselect'+data.indexD);
      if(this.linkingOutput!==-1){
        this.listDialogues[this.linkingBlock].nextDialogue[this.linkingOutput] = {id : data.indexD, ii: data.indexIO};
        if(this.listDialogues[data.indexD].previousDialogue[data.indexIO][0].id !== -1){
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
      if(this.scrollDirLinking[0] !== 0 || this.scrollDirLinking[1] !== 0){
        clearInterval(this.updateScroll);
      }
    },
    mouseMoveLink(e){
      this.xMouse = e.offsetX;
      this.yMouse = e.offsetY;

      if(e.x < 50) {
        if(this.scrollDirLinking[0] === 0 && this.scrollDirLinking[1] === 0) this.addScrollInterval();
        this.scrollDirLinking = [1, this.scrollDirLinking[1]];
      } else if(e.x > this.width-50) {
        if(this.scrollDirLinking[0] === 0 && this.scrollDirLinking[1] === 0) this.addScrollInterval();
        this.scrollDirLinking = [-1, this.scrollDirLinking[1]];
      } else if(this.scrollDirLinking[0] !== 0){
        this.scrollDirLinking = [0, this.scrollDirLinking[1]];
        if(this.scrollDirLinking[1] === 0) {
          clearInterval(this.updateScroll);
        }
      }

      if(e.y < 100) {
        if(this.scrollDirLinking[0] === 0 && this.scrollDirLinking[1] === 0) this.addScrollInterval();
        this.scrollDirLinking = [this.scrollDirLinking[0], 1];
      } else if(e.y > this.height-50) {
        if(this.scrollDirLinking[0] === 0 && this.scrollDirLinking[1] === 0) this.addScrollInterval();
        this.scrollDirLinking = [this.scrollDirLinking[0], -1];
      } else if(this.scrollDirLinking[1] !== 0){
        this.scrollDirLinking = [this.scrollDirLinking[0], 0];
        if(this.scrollDirLinking[0] === 0) {
          clearInterval(this.updateScroll);
        }
      }

    },
    addScrollInterval(){
      this.updateScroll = setInterval(() => {
        this.panzoom.moveTo(this.panzoom.getTransform().x + this.scrollDirLinking[0]*10, this.panzoom.getTransform().y + this.scrollDirLinking[1]*10);
        if(this.panzoom.getTransform().x !== 0 && this.panzoom.getTransform().x > (-1)*this.width*(this.panzoom.getTransform().scale-1) + 10) this.xMouse -= this.scrollDirLinking[0] * 10 * Math.pow(this.panzoom.getTransform().scale, -1);
        if(this.panzoom.getTransform().y !== 0 && this.panzoom.getTransform().y > (-1)*this.height*(this.panzoom.getTransform().scale-1) + 10) this.yMouse -= this.scrollDirLinking[1] * 10 * Math.pow(this.panzoom.getTransform().scale, -1);
      }, 20)
    },
    leaveDialogueManager(e){
      if(this.linkingBlock !== -1) {
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
      this.panzoom.setTransformOrigin(null);
      this.panzoom.zoomTo(0.5,0.5,5);
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
    setInitialDialogue(){
      if(this.contextMenuSelection.index === undefined || this.contextMenuSelection.index.length === 0) return;
      if(this.initialDialogue.page !== undefined && this.initialDialogue.page !== null && this.initialDialogue.index !== -1){
        this.listPages.filter(p => p.title === this.initialDialogue.page).forEach((p) => {
          if(p.listDialogues[this.initialDialogue.index] !== undefined) {
            p.listDialogues[this.initialDialogue.index].initial = false;
            if(p.title === this.currentpage){
              this.bus.$emit('select'+this.initialDialogue.index);
              this.bus.$emit('unselect'+this.initialDialogue.index);
            }
          }
        });
      }
      this.initialDialogue = {page : this.currentpage, index: this.contextMenuSelection.index[0]};
      this.listPages.filter(p => p.title === this.initialDialogue.page).forEach((p) => {
        if(p.listDialogues[this.initialDialogue.index] !== undefined) {
          p.listDialogues[this.initialDialogue.index].initial = true;
          if(p.title === this.currentpage) this.stopSelecting(this.selectionDialogue);
        }
      });
    },

    // ############################ INPUT (KEYBOARD MOUSE) MANAGEMENT
    deletePress(){
      if(this.selectionDialogue.length > 0){
        this.contextMenuSelection = {index: JSON.parse(JSON.stringify(this.selectionDialogue)), type: "global", indexIO: -1};
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
    shorcutHandle(e){
      if(this.editDialogueShortcutFunction(e)) return;
      if(e.control && e.key === "c"){
        this.copyDialogues();
      } else if(e.control && e.key === "x"){
        this.cutDialogues();
      } else if(e.control && e.key === "v"){
        this.pasteDialogues();
      } else if(e.control && e.key === "s"){
        this.$emit("save");
      }
    },
    initShortcutLink(p){
      this.editDialogueShortcutFunction = p.f;
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
          dialogue.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
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
    clickDialogue(data){
      this.bus.$emit("showEditDialoguePanel", {index : data });
      this.stopSelecting(this.selectionDialogue);
    },
    editDialogue(){
      if(this.selectionDialogue.length === 0) return
      this.bus.$emit("showEditDialoguePanel", {index : this.selectionDialogue[0].index });
      this.stopSelecting(this.selectionDialogue);
    },
    deleteDialogue(manual = true, dialogues = this.listDialogues){
      if(this.contextMenuSelection==null) return;

      var list = this.contextMenuSelection.index;
      if(list.length === 0) return;

      this.stopSelecting(this.selectionDialogue);

      if(list[0].index === undefined) list[0] = {index: list[0]};
      this.contextMenuSelection.indexIO = -1;

      var listTransitionArrivalsToDelete = [];

      var ref = this;
      list.forEach(function(element){
        if(element.index !== -1 && !(dialogues[element.index].id !== undefined && dialogues[element.index].tabs.length===0 && manual)) {

          ref.contextMenuSelection.index = element.index;
          ref.breakInputLinks(false, dialogues);
          ref.breakOutputLinks(false, dialogues);

          if(dialogues[element.index].id !== undefined && dialogues[element.index].tabs.length>0 && dialogues[element.index].transitionpage !== ""){
            listTransitionArrivalsToDelete.push({id : dialogues[element.index].id, page: dialogues[element.index].transitionpage});
          }

          if(dialogues[element.index].initial !== undefined && dialogues[element.index].initial){
            ref.initialDialogue = {page : null, index: -1};
          }

          dialogues.splice(element.index, 1);

          var deleteIndex = element.index;

          for(var i = 0; i<dialogues.length; i++){

            var j = 0;
            dialogues[i].nextDialogue.forEach(function(nD){
              if(nD.id > deleteIndex) {
                dialogues[i].nextDialogue[j] = {id : nD.id -1, ii: nD.ii}; // this.listDialogues[i].nextDialogue[j]
              }
              j++;
            });

            j = 0;
            var k = 0;
            dialogues[i].previousDialogue.forEach(function(pD){
              pD.forEach(function(prev){
                if(prev.id > deleteIndex) {
                  dialogues[i].previousDialogue[j][k] = {id : prev.id -1, ii: prev.ii}; //this.listDialogues[i].previousDialogue[j][k]
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

      process.nextTick(() => {
        listTransitionArrivalsToDelete.forEach((d) => {
          this.deleteTransitionDialogue(d);
        });
      });
    },
    deleteTransitionDialogue(data){
      this.listPages.forEach((p) => {
        if(p.title === data.page){
          return this.deleteDialogueID({id : data.id, dialogues : p.listDialogues});
        }
      });
    },
    deleteDialogueID(data){
      var l = data.dialogues.findIndex((d) => d.id === data.id && d.tabs.length === 0);
      if(l !== -1){
        this.contextMenuSelection = {
          index : [l],
          indexIO : -1,
          type : "global"
        };
        this.deleteDialogue(false, data.dialogues);
      }
    },
    deleteAllDialogueID(list){
      list.forEach((data) => {
        this.deleteDialogueID(data);
      })
    },

    // ########################### LINKS BETWEEN DIALOGUES EDITING
    breakLinks(){
      if(this.contextMenuSelection==null) return;
      if(this.contextMenuSelection.type === "input") this.breakInputLinks();
      else if(this.contextMenuSelection.type === "output") this.breakOutputLinks();
    },
    breakInputLinks(removeCMD, dialogues = this.listDialogues){
      if(this.contextMenuSelection==null) return;
      var j = 0;
      var i = 0;
      if(this.contextMenuSelection.indexIO === -1){
        for(j = 0; j<dialogues[this.contextMenuSelection.index].previousDialogue.length ;j++){
          for(i = 0; i<dialogues[this.contextMenuSelection.index].previousDialogue[j].length; i++){
            if(dialogues[this.contextMenuSelection.index].previousDialogue[j][i].id !== -1) dialogues[dialogues[this.contextMenuSelection.index].previousDialogue[j][i].id].nextDialogue[dialogues[this.contextMenuSelection.index].previousDialogue[j][i].ii] = {id: -1, i:0};
            dialogues[this.contextMenuSelection.index].previousDialogue[j][i] = {id: -1, ii:0 };
          }
        }
      } else {
        j = this.contextMenuSelection.indexIO;
        for(i = 0; i<dialogues[this.contextMenuSelection.index].previousDialogue[j].length; i++){
          if(dialogues[this.contextMenuSelection.index].previousDialogue[j][i].id !== -1) dialogues[dialogues[this.contextMenuSelection.index].previousDialogue[j][i].id].nextDialogue[dialogues[this.contextMenuSelection.index].previousDialogue[j][i].ii] = {id: -1, i:0};
          dialogues[this.contextMenuSelection.index].previousDialogue[j][i] = {id: -1, ii:0 };
        }
      }
      this.$forceUpdate();
      if(removeCMD) this.contextMenuSelection=null;
    },
    breakOutputLinks(removeCMD, dialogues = this.listDialogues){
      if(this.contextMenuSelection==null) return;
      var i = 0;
      if(this.contextMenuSelection.indexIO === -1){
        for(i = 0; i<dialogues[this.contextMenuSelection.index].nextDialogue.length ;i++){
          removePreviousDialoguesFromOutput(dialogues, this.contextMenuSelection.index, i);
          dialogues[this.contextMenuSelection.index].nextDialogue[i] = {id: -1, ii:0};
        }
      } else {
        i = this.contextMenuSelection.indexIO;
        removePreviousDialoguesFromOutput(dialogues, this.contextMenuSelection.index, i);
        dialogues[this.contextMenuSelection.index].nextDialogue[i] = {id: -1, ii:0};
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

    // ################################# RENAME DIALOGUE
    renameDialogueRequest(){
      if(this.selectionDialogue.length===0) return;
      if(this.listDialogues[this.selectionDialogue[0].index].frompage === "") return;
      this.bus.$emit("showInputText", this.listDialogues[this.selectionDialogue[0].index].title);
    },
    renameDialogues(newname){
      if(this.selectionDialogue.length===0) return;
      var index = 1;
      var ref = this;
      this.selectionDialogue.forEach((element) => {
        if(ref.listDialogues[element.index].frompage === undefined) ref.listDialogues[element.index].title = newname+(index===1 ? '' : '_'+index);
        if(ref.listDialogues[element.index].transitionpage !== undefined && ref.listDialogues[element.index].id !== ""){
          var p = this.listPages.filter((p) => p.title === ref.listDialogues[element.index].transitionpage);
          if(p.length>0){
            p[0].listDialogues.forEach((d) => {
              if(d.id === ref.listDialogues[element.index].id){
                d.title = newname+(index===1 ? '' : '_'+index);
              }
            });
          }
        }
        if(ref.listDialogues[element.index].frompage === undefined) index++;
      });
    },

    // ##################################### REFRESH
    refresh(data){
      this.$forceUpdate();
      process.nextTick(() => {
        data.forEach((e) => {
          this.bus.$emit('moving'+e);
        })
      });
    },

    // ###################################### COPY PASTE DIALOGUES
    copyDialogues(){
      if(this.selectionDialogue.length === 0) return;
      this.clipboard = {frompage : this.currentpage, content : [], deltaX : 0, deltaY : 0, pasteCount : 0};
      let minX = 1000000, minY = 1000000;
      let maxX = -1000000, maxY = -1000000;
      let listIndex = this.selectionDialogue.map((s) => s.index);
      this.selectionDialogue.forEach((d) => {
        if(this.listDialogues[d.index].type !== "transition"){

          var copy = JSON.parse(JSON.stringify(this.listDialogues[d.index]));
          if(copy.initial) copy.initial = false;

          copy.previousDialogue.forEach((p) => {
            p.forEach((pp) => {
                pp.id = listIndex.findIndex((i) => i === pp.id);
            });
          });

          copy.nextDialogue.forEach((p) => {
              p.id = listIndex.findIndex((i) => i === p.id);
          });

          if(copy.x - copy.offsetLoc.x > maxX) maxX = copy.x - copy.offsetLoc.x;
          if(copy.y - copy.offsetLoc.y > maxY) maxY = copy.y - copy.offsetLoc.y;
          if(copy.x - copy.offsetLoc.x < minX) minX = copy.x - copy.offsetLoc.x;
          if(copy.y - copy.offsetLoc.y < minY) minY = copy.y - copy.offsetLoc.y;
          this.clipboard.content.push(copy);
        }
      });
      this.clipboard.deltaX = (maxX + minX) / 2;
      this.clipboard.deltaY = (maxY + minY) / 2;
    },
    pasteDialogues(){
      if(this.clipboard.content.length === 0) return;
      var size = this.listDialogues.length;
      this.clipboard.content.forEach((d) => {
        var newdiag = JSON.parse(JSON.stringify(d));
        newdiag.x = (newdiag.x - this.clipboard.deltaX) + this.mouseEvent.offsetX;
        newdiag.y = (newdiag.y - this.clipboard.deltaY) + this.mouseEvent.offsetY;
        newdiag.title += "_copy"+(this.clipboard.pasteCount===0 ? "" : "_"+this.clipboard.pasteCount);

        newdiag.previousDialogue.forEach((p) => {
          p.forEach((pp) => {
            if(pp.id !== -1){
              pp.id += size;
            }
          });
        });

        newdiag.nextDialogue.forEach((p) => {
          if(p.id !== -1){
            p.id += size;
          }
        });

        this.listDialogues.push(newdiag);
      });
      this.clipboard.pasteCount += 1;
    },
    cutDialogues(){
      this.copyDialogues();
      this.deletePress();
    },

    // ####################################### LOADING AND SET INITIAL DIALOGUE
    setInitialWhenLoading(listPage){
      this.initialDialogue = {page : null, index : -1};
      listPage.forEach((p) => {
        var i = 0;
        p.listDialogues.forEach((d) => {
          if(d.initial !== undefined && d.initial){
            this.initialDialogue = {page : p.title, index : i};
            return;
          }
          i++;
        });
      });
    },
  },

  mounted() {
    this.busEntry.$on("deleteTransitionId", this.deleteDialogueID);
    this.busEntry.$on("deleteAllTransitionId", this.deleteAllDialogueID);
    this.busEntry.$on("reload", this.setInitialWhenLoading);
    this.$emit("initShortcut", {name : "DialogueManager", f: this.shorcutHandle})
  }

}
</script>

<style scoped>
.selectionBox {
  fill: #1a91ff;
  opacity: 0.33;
}
</style>