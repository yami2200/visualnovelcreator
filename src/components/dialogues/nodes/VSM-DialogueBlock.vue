<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, -1, 'global')"
        @mousedown="selecting"
        @dblclick="clickOnDialogue"
        @contextmenu="showContextMenu($event, 'global', -1)"
        fill="url(#DialogueBlock)"
        :stroke="selected ? '#e5ae00' : '#000000'"
        stroke-width="0.25"
        :x="dialogue.x"
        :y="dialogue.y"
        width="21"
        height="10"
        rx="1"
        ry="1"/>

    <vsm-plug
        fillGradient="#DialogueBlockOutput"
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

    <vsm-plug
        fillGradient="#DialogueBlockOutput"
        type="output"
        :locX="dialogue.x + 10.5"
        :locY="yBottom"
        :index="0"
        @mEnter="mouseEnter"
        @mLeave="mouseLeave"
        @mUp="linkEnd"
        @mDown="startLinkingFromOutput"
        @cMenu="showContextMenu">
    </vsm-plug>

    <text
        pointer-events="none"
        dominant-baseline="middle"
        text-anchor="middle"
        :x="xText"
        :y="yText"
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
import PlugNodeComponent from "./VSM-PlugNodeComponent";
import InitialDialogueIcon from "./VSM-InitialDialogueIcon";

export default {
  name: "vsm-dialogueblock",

  mixins: [mix_dialogueblock],

  components:{"vsm-plug" : PlugNodeComponent, "vsm-initialicon" : InitialDialogueIcon},
}
</script>

<style scoped>
  .button_diag {
    fill: #79e784;
  }

  .clickable:hover {
    fill: #20ab2f;
    cursor: pointer;
    transition: fill 0.3s;
  }

  .text {
    user-select: none;
  }

  .test:hover{
    fill: url(#DialogueBlockOutputHovered);
    cursor: pointer;
  }
</style>