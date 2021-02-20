<template>
  <g>
    <rect @mousedown="selecting" fill="#dadada" :stroke="selected ? '#e5ae00' : '#000000'" stroke-width="0.5" :x="dialogue.x" :y="dialogue.y" width="21" height="10" rx="1" ry="1"/>
    <rect @mouseup="linkInput" class="button_diag" stroke="#000000" stroke-width="0.3" :x="xChild" :y="yTop" width="5.5" height="2" rx="1" ry="1"/>
    <rect @mousedown="startLinkingFromOutput($event, 0)" class="button_diag" stroke="#000000" stroke-width="0.3" :x="xChild" :y="yBottom" width="5.5" height="2" rx="1" ry="1"/>
  </g>
</template>

<script>
export default {
  name: "test",

  props: ['dialogue', 'index', 'bus'],

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
  },

  methods: {
    selecting(e){
      this.selected = true;
      this.$emit("selectD", {e:e, index: this.index});
    },
    unselect(){
      this.selected = false;
    },
    linkInput(e){
      this.$emit("linkEndInput", {indexD: this.index, e:e});
    },
    startLinkingFromOutput(e, indexO){
      this.dialogue.nextDialogue[indexO] = -1;
      this.$emit("linkingOutput", {indexD: this.index, indexO: indexO, e:e});
    }
  },

  mounted() {
    this.bus.$on('unselect'+this.index, this.unselect)
  },
}
</script>

<style scoped>
  .button_diag {
    fill: #4a90d6;
  }

  .button_diag:hover {
    fill: #2669b1;
    cursor: pointer;
    transition: fill 0.3s;
  }
</style>