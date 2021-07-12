<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, -1, 'global')"
        @mousedown="selecting"
        @dblclick="clickOnDialogue"
        @contextmenu="showContextMenu($event, 'global', -1)"
        fill="#42ADC7"
        :stroke="selected ? '#e5ae00' : '#000000'"
        stroke-width="0.5"
        :x="dialogue.x"
        :y="dialogue.y"
        :width="sizeBlock"
        height="10"
        rx="1"
        ry="1"/>

    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, 0, 'input')"
        @mousedown="startLinkingFromInput($event, 0)"
        @contextmenu="showContextMenu($event, 'input', 0)"
        class="button_diag clickable"
        stroke="#000000"
        stroke-width="0.3"
        :x="xChild"
        :y="yTop"
        width="5.5"
        height="2"
        rx="1"
        ry="1"/>

    <rect
        v-for="(choice, index) in dialogue.choices"
        :key="choice.text"
        @mouseenter="mouseEnterOutput($event, index)"
        @mouseleave="mouseLeaveOutput"
        @mouseup="linkEnd($event, index, 'output')"
        @mousedown="startLinkingFromOutput($event, index)"
        @contextmenu="showContextMenu($event, 'output', index)"
        class="clickable"
        :class="dialogue.choices[index].type === 'choice' ? 'button_diag' : 'button_diag_obj'"
        stroke="#000000"
        stroke-width="0.3"
        :x="xChildM(index)"
        :y="yBottom"
        width="5.5"
        height="2"
        rx="1"
        ry="1"/>

    <text
        pointer-events="none"
        :x="xText"
        :y="yText"
        dominant-baseline="middle"
        text-anchor="middle"
        class="text"
        font-family="Nunito"
        :font-size="fontSizeText">
      {{ textValue }}
    </text>
    <polygon
        v-if="dialogue.initial"
        fill="#0000ff"
        stroke="#FFFFFF"
        stroke-width="0.3"
        :points="pointsTriangle"/>
  </g>
</template>

<script>
import { mix_dialogueblock } from "@/mixins/MIX_DialogueBlock";

export default {
  name: "vsm-dialogueblock",

  mixins: [mix_dialogueblock],

  computed: {
    yBottom : function (){
      return this.dialogue.y + 8.5;
    },
    xChild: function () {
      return this.dialogue.x + (this.sizeBlock / 2) - 3 ;
    },
    sizeBlock : function (){
      if(this.dialogue.choices.length<4) return 21;
      return 21 + (this.dialogue.choices.length-3) * 7;
    },
    xText:function () {
      return this.dialogue.x + this.sizeBlock/2;
    },
  },

  methods :{
    xChildM(index){
      if(this.dialogue.choices.length === 1) return this.dialogue.x + 7.5;
      return this.dialogue.x + (this.sizeBlock / this.dialogue.choices.length) * (index+0.5/this.dialogue.choices.length)
    },
    updatePlugsLocations(){
      var output = [];
      for(var i = 0; i<this.dialogue.choices.length; i++){
        output.push({x: this.xChildM(i)+3, y:this.yBottom+1.5})
      }
      this.$emit("updatePlugsLoc", {index: this.index, outputsLoc: output, inputsLoc: [{x : this.xChild + 3, y : this.dialogue.y}]});
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
  .button_diag {
    fill: #4a90d6;
  }

  .clickable:hover {
    fill: #2669b1;
    cursor: pointer;
    transition: fill 0.3s;
  }

  .button_diag_obj {
    fill: #1436ad;
  }

  .text {
    user-select: none;
  }
</style>