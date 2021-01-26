<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn :max-height="sizeButton"
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
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
const remote = require('electron').remote;

export default {
  name: "VSM-Dropdown-Menu",

  props: {
    name: { required: true, type: String },
    sizeHeight : {required: true},
    items: {
      required: true,
    },
  },

  created() {
    remote.getCurrentWindow().addListener("resize", this.myEventHandler);
  },

  destroyed() {
    remote.getCurrentWindow().removeListener("resize", this.myEventHandler);
  },

  methods: {
    myEventHandler() {
      console.log("change size" + window.innerHeight);
      this.height = window.innerHeight;
    }
  },

  computed: {
    // a computed getter
    sizeButton: function () {
      // `this` points to the vm instance
      return (this.height * this.sizeHeight / 100)+"px" ;
    }
  },

  data: () => ({
    height: window.innerHeight,
  }),
}
</script>

<style scoped>

</style>