<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, -1, 'global')"
        @mousedown="selecting"
        @dblclick="clickOnDialogue"
        @contextmenu="showContextMenu($event, 'global', -1)"
        fill="#FF9D4F"
        :stroke="selected ? '#e5ae00' : '#000000'"
        stroke-width="0.5"
        :x="dialogue.x"
        :y="dialogue.y"
        width="21"
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
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, 0, 'output')"
        @mousedown="startLinkingFromOutput($event, 0)"
        @contextmenu="showContextMenu($event, 'output', 0)"
        class="button_diag clickable"
        stroke="#000000"
        stroke-width="0.3"
        :x="xChild"
        :y="yBottom"
        width="5.5"
        height="2"
        rx="1"
        ry="1"/>

    <text
        pointer-events="none"
        :x="xText"
        :y="yText"
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
  name: "VSM-DialogueFunctionBlock",

  mixins: [mix_dialogueblock],
}
</script>

<style scoped>
.button_diag {
  fill: #de6723;
}

.clickable:hover {
  fill: #ab4a2c;
  cursor: pointer;
  transition: fill 0.3s;
}

.text {
  user-select: none;
}
</style>