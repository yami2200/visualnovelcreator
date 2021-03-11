<template>
    <v-tooltip top
               v-model="showMenu"
               :position-x="x"
               :position-y="y">
      <span> {{ text }}</span>
    </v-tooltip>
</template>

<script>
export default {
  name: "VSM-Tooltip",

  props : ['text','bus'],

  methods : {
    show(e){
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY-20;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    hide(){
      this.showMenu = false;
    },
  },

  data: () => ({
    showMenu: false,
    x: 0,
    y: 0,
  }),

  mounted() {
    this.bus.$on('showTooltip', this.show);
    this.bus.$on('hideTooltip', this.hide);
  },
}
</script>

<style scoped>

</style>