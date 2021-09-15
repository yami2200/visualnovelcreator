<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, -1, 'global')"
        @mousedown="selecting"
        @dblclick="clickOnDialogue"
        @contextmenu="showContextMenu($event, 'global', -1)"
        fill="url(#ChoiceBlock)"
        :stroke="selected ? '#e5ae00' : '#000000'"
        stroke-width="0.25"
        :x="dialogue.x"
        :y="dialogue.y"
        :width="sizeBlock"
        height="10"
        rx="1"
        ry="1"/>

    <vsm-plug
        fillGradient="#ChoiceBlockOutput"
        type="input"
        :locX="xChild"
        :locY="yTop"
        :index="0"
        @mEnter="mouseEnter"
        @mLeave="mouseLeave"
        @mUp="linkEnd"
        @mDown="startLinkingFromInput"
        @cMenu="showContextMenu">
    </vsm-plug>

    <vsm-plug
        v-for="(choice, index) in dialogue.choices"
        :key="choice.text"
        :fillGradient="dialogue.choices[index].type === 'choice' ? '#ChoiceBlockOutput' : '#ChoiceBlockObjectOutput'"
        type="output"
        :locX="xChildM(index)"
        :locY="yBottom"
        :index="index"
        @mEnter="mouseEnterOutput($event, index)"
        @mLeave="mouseLeaveOutput"
        @mUp="linkEnd"
        @mDown="startLinkingFromOutput"
        @cMenu="showContextMenu">
    </vsm-plug>

    <text
        pointer-events="none"
        :x="xText"
        :y="yText"
        dominant-baseline="middle"
        text-anchor="middle"
        class="text"
        font-family="Karla"
        :font-size="fontSizeText">
      {{ textValue }}
    </text>
    <vsm-initialicon
        v-if="dialogue.initial"
        :x="dialogue.x"
        :y="dialogue.y">
    </vsm-initialicon>
  </g>
</template>

<script>
import { mix_dialogueblock } from "@/mixins/MIX_DialogueBlock";
import PlugNodeComponent from "@/components/dialogues/nodes/VSM-PlugNodeComponent";
import InitialDialogueIcon from "@/components/dialogues/nodes/VSM-InitialDialogueIcon";
import {sizeChoiceNode} from "@/lib";

export default {
  name: "vsm-dialogueblock",

  mixins: [mix_dialogueblock],

  components:{"vsm-plug" : PlugNodeComponent, "vsm-initialicon" : InitialDialogueIcon},

  computed: {
    yBottom : function (){
      return this.dialogue.y + 8;
    },
    xChild: function () {
      return this.dialogue.x + (this.sizeBlock / 2) ;
    },
    sizeBlock : function (){
      return sizeChoiceNode(this.dialogue.choices.length);
    },
    intervalSize : function (){
      return ((this.sizeBlock - this.dialogue.choices.length * 4) / (this.dialogue.choices.length+1));
    },
    xText:function () {
      return this.dialogue.x + this.sizeBlock/2;
    },
  },

  methods :{
    xChildM(index){
      if(this.dialogue.choices.length === 1) return this.dialogue.x + 10.5;
      return this.dialogue.x + index*4 + (index+1) * this.intervalSize + 2;
    },
    updatePlugsLocations(){
      var output = [];
      for(var i = 0; i<this.dialogue.choices.length; i++){
        output.push({x: this.xChildM(i), y:this.yBottom+1.5})
      }
      this.$emit("updatePlugsLoc", {index: this.index, outputsLoc: output, inputsLoc: [{x : this.xChild , y : this.dialogue.y}]});
    },
    mouseEnterOutput(e, io){
      this.$emit("choiceHover", {text: this.dialogue.choices[io].text, e:e});
      this.mouseEnter();
    },
    mouseLeaveOutput(){
      this.$emit("choiceStopHover");
      this.mouseLeave();
    }
  },

  mounted() {
    this.bus.$on('unselect'+this.index, this.unselect);
    this.bus.$on('select'+this.index, this.selecting);
    this.bus.$on('moving'+this.index, this.updatePlugsLocations);
    this.updatePlugsLocations();
  },

}
</script>

<style scoped>
  .text {
    user-select: none;
  }
</style>