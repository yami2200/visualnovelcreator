<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, -1, 'global')"
        @mousedown="selecting"
        @dblclick="clickOnDialogue"
        @contextmenu="showContextMenu($event, 'global', -1)"
        fill="#FF5347"
        :stroke="selected ? '#e5ae00' : '#000000'"
        stroke-width="0.5"
        :x="dialogue.x"
        :y="dialogue.y"
        width="21"
        height="15"
        rx="1"
        ry="1"/>

    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, 0, 'output')"
        @mousedown="startLinkingFromOutput($event, 0)"
        @contextmenu="showContextMenu($event, 'output', 0)"
        class="button_diag clickable"
        stroke="#000000"
        stroke-width="0.3"
        :x="input1X"
        :y="yBottom"
        width="8"
        height="3"
        rx="1"
        ry="1"/>

    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, 1, 'output')"
        @mousedown="startLinkingFromOutput($event, 1)"
        @contextmenu="showContextMenu($event, 'output', 1)"
        class="button_diag clickable"
        stroke="#000000"
        stroke-width="0.3"
        :x="input2X"
        :y="yBottom"
        width="8"
        height="3"
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

    <text
        pointer-events="none"
        :x="xT"
        :y="yTF"
        class="text"
        font-family="Nunito"
        :font-size="fontSizeText">
      True
    </text>

    <text
        pointer-events="none"
        :x="xF"
        :y="yTF"
        class="text"
        font-family="Nunito"
        :font-size="fontSizeText">
      False
    </text>

    <text
        pointer-events="none"
        :x="xText"
        :y="yText"
        class="text"
        font-family="Nunito"
        :font-size="fontSizeText">
      {{ textValue }}
    </text>
  </g>
</template>

<script>
import { mix_dialogueblock } from "@/mixins/MIX_DialogueBlock";

export default {
  name: "vsm-dialogueconditionnalblock",

  mixins: [mix_dialogueblock],

  computed: {
    input1X : function() {
      return this.dialogue.x + 1.5;
    },
    input2X : function() {
      return this.dialogue.x + 11.5;
    },
    yBottom: function () {
      return this.dialogue.y + 12.5;
    },
    yTF: function(){
      return this.dialogue.y + 11.5;
    },
    xT: function(){
      return this.dialogue.x + 13.5;
    },
    xF: function(){
      return this.dialogue.x + 3.5;
    },
  },

  methods: {
    updatePlugsLocations(){
      this.$emit("updatePlugsLoc", {index: this.index, outputsLoc: [{x : this.dialogue.x + 5.5, y : this.dialogue.y + 14}, {x : this.dialogue.x + 15.5, y : this.dialogue.y + 14}], inputsLoc: [{x : this.dialogue.x + 10.5, y : this.dialogue.y}]});
    }
  },
}
</script>

<style scoped>
  .button_diag {
    fill: #b82127;
  }

  .clickable:hover {
    fill: #8a0a0a;
    cursor: pointer;
    transition: fill 0.3s;
  }

  .text {
    user-select: none;
  }
</style>