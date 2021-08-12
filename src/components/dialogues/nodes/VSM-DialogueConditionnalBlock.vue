<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, -1, 'global')"
        @mousedown="selecting"
        @dblclick="clickOnDialogue"
        @contextmenu="showContextMenu($event, 'global', -1)"
        fill="url(#ConditionalBlock)"
        :stroke="selected ? '#e5ae00' : '#000000'"
        stroke-width="0.25"
        :x="dialogue.x"
        :y="dialogue.y"
        width="21"
        height="14"
        rx="1"
        ry="1"/>

    <vsm-plug
        fillGradient="#ConditionalBlockOutput"
        type="output"
        :locX="input1X"
        :locY="yBottom"
        :index="0"
        @mEnter="mouseEnter"
        @mLeave="mouseLeave"
        @mUp="linkEnd"
        @mDown="startLinkingFromOutput"
        @cMenu="showContextMenu">
    </vsm-plug>

    <vsm-plug
        fillGradient="#ConditionalBlockOutput"
        type="output"
        :locX="input2X"
        :locY="yBottom"
        :index="1"
        @mEnter="mouseEnter"
        @mLeave="mouseLeave"
        @mUp="linkEnd"
        @mDown="startLinkingFromOutput"
        @cMenu="showContextMenu">
    </vsm-plug>

    <vsm-plug
        fillGradient="#ConditionalBlockOutput"
        type="input"
        :locX="dialogue.x + 10.5"
        :locY="yTop"
        :index="0"
        @mEnter="mouseEnter($event)"
        @mLeave="mouseLeave"
        @mUp="linkEnd"
        @mDown="startLinkingFromInput"
        @cMenu="showContextMenu"
    >
    </vsm-plug>

    <text
        pointer-events="none"
        :x="xT"
        :y="yTF"
        class="text"
        font-family="Karla"
        :font-size="fontSizeText">
      True
    </text>

    <text
        pointer-events="none"
        :x="xF"
        :y="yTF"
        class="text"
        font-family="Karla"
        :font-size="fontSizeText">
      False
    </text>

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

export default {
  name: "vsm-dialogueconditionnalblock",

  mixins: [mix_dialogueblock],

  components:{"vsm-plug" : PlugNodeComponent, "vsm-initialicon" : InitialDialogueIcon},

  computed: {
    input1X : function() {
      return this.dialogue.x + 5.5;
    },
    input2X : function() {
      return this.dialogue.x + 15.5;
    },
    yBottom: function () {
      return this.dialogue.y + 11.8;
    },
    yTF: function(){
      return this.dialogue.y + 10.5;
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
  .text {
    user-select: none;
  }
</style>