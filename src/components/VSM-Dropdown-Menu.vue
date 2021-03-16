<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn :max-height="sizeButton" min-height="20px"
             v-on="on"
      >
        {{ name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="$emit(item.action)"
          dense
          class="listBtn"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
//const remote = require('electron').remote;

export default {
  name: "VSM-Dropdown-Menu",

  props: {
    name: { required: true, type: String },
    sizeHeight : {required: true},
    height : {required: true},
    items: {
      required: true,
    },
  },

  /*created() {
    remote.getCurrentWindow().addListener("resize", this.myEventHandler);
  },

  destroyed() {
    remote.getCurrentWindow().removeListener("resize", this.myEventHandler);
  },*/

  /*methods: {
    myEventHandler() {
      this.height = window.innerHeight;
    }
  },*/

  computed: {
    sizeButton: function () {
      return (this.height * this.sizeHeight / 100)+"px";
    }
  },

  /*data: () => ({
    height: window.innerHeight,
  }),*/
}
</script>

<style scoped lang="scss">
::v-deep .listBtn {
  max-height: 5px !important;
}

</style>