<template>
  <g>
    <rect
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
        @mouseup="linkEnd"
        @mousedown="selecting"
        fill="#dadada"
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
        @mouseup="linkEnd"
        @mousedown="selecting"
        class="button_diag"
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
        @mouseup="linkEnd"
        @mousedown="startLinkingFromOutput($event, 0)"
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
        @mousedown="selecting"
        @mouseup="linkEnd"
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
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
export default {
  name: "vsm-dialogueblock",

  props: ['dialogue', 'index', 'bus', 'linkingblock'],

  data: () => ({
    selected: false,
  }),

  computed: {
    xChild: function () {
      return this.dialogue.x + 7.5;
    },
    yBottom: function () {
      return this.dialogue.y + 7.5;
    },
    yTop: function () {
      return this.dialogue.y + 0.5;
    },
    yText: function () {
      return this.dialogue.y + 5.75;
    },
    xText:function () {
      return this.dialogue.x + 2 + (7.5 - this.dialogue.title.length / 25 * 7.5);
    },
    fontSizeText:function () {
      if(this.dialogue.title.length < 10) return 3;
      if(this.dialogue.title.length < 22) return 2;
      return 1.5;
    },
    textValue:function () {
      if(this.dialogue.title.length < 25) return this.dialogue.title;
      return this.dialogue.title.substring(0,25) + " ...";
    }
  },

  methods: {
    selecting(e){
      this.selected = true;
      this.$emit("selectD", {e:e, index: this.index});
    },
    unselect(){
      this.selected = false;
    },
    linkEnd(e){
      this.$emit("linkEnd", {indexD: this.index, e:e});
      if(this.selected) this.unselect();
    },
    startLinkingFromOutput(e, indexO){
      this.dialogue.nextDialogue[indexO] = -1;
      this.$emit("linkingOutput", {indexD: this.index, indexO: indexO, e:e});
    },
    mouseEnter(){
      if(this.linkingblock != -1 && this.linkingblock != this.index){
        this.selected = true;
      }
    },
    mouseLeave(){
      if(this.linkingblock != -1 && this.selected) this.unselect();
    }
  },

  mounted() {
    this.bus.$on('unselect'+this.index, this.unselect)
    this.bus.$on('select'+this.index, this.selecting)
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

  .text {
    user-select: none;
  }
</style>