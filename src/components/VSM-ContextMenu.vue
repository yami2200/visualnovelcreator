<template>
  <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      rounded="0"
      :close-on-content-click="true"
  >
    <v-list>
      <v-list-item
          v-for="(item, index) in itemContextMenu"
          :key="index"
          @click="click(item.action)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "VSM-ContextMenu",

  props : ['itemContextMenu', 'bus'],

  methods : {
    show(e){
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    hide(){
      this.showMenu = false;
    },
    click(event){
      this.$emit(event);
    }
  },

  data: () => ({
    showMenu: false,
    x: 0,
    y: 0,
  }),


  mounted() {
    this.bus.$on('showContextMenu', this.show);
    this.bus.$on('hideContextMenu', this.hide);
  },
}
</script>

<style scoped>

</style>