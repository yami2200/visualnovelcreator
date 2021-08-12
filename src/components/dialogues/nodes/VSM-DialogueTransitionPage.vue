<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd($event, -1, 'global')"
        @mousedown="selecting"
        @dblclick="clickOnDialogue"
        @contextmenu="showContextMenu($event, 'global', -1)"
        fill="url(#TransitionBlock)"
        :stroke="selected ? '#e5ae00' : '#000000'"
        stroke-width="0.25"
        :x="dialogue.x"
        :y="dialogue.y"
        width="21"
        height="10"
        rx="1"
        ry="1"/>


    <vsm-plug
        v-if="dialogue.nextDialogue.length==0"
        fillGradient="#TransitionBlockOutput"
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
        v-if="dialogue.nextDialogue.length>0"
        fillGradient="#TransitionBlockOutput"
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
  name: "VSM-DialogueTransitionPage",

  mixins: [mix_dialogueblock],

  components:{"vsm-plug" : PlugNodeComponent, "vsm-initialicon" : InitialDialogueIcon},
}
</script>

<style scoped>
.text {
  user-select: none;
}
</style>