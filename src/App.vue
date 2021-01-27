<template>
  <v-app>
    <v-main>
      <vsm-menu-bar></vsm-menu-bar>
        <v-row no-gutters>
          <v-col cols="8">
          </v-col>
          <v-col cols="4">
            <v-card :height="sizePreviewPannel">
            </v-card>
            <vsm-assets-panel :size-height="height" :assets="assets"></vsm-assets-panel>
          </v-col>
        </v-row>
    </v-main>
  </v-app>
</template>

<script>
const remote = require('electron').remote;
import MenuBar from './components/VSM-MenuBar.vue';
import AssetsPanel from './components/VSM-AssetsPanel.vue';
import json from './test/assets.json';

export default {
  name: 'App',

  components: {
    'vsm-menu-bar' : MenuBar,
    'vsm-assets-panel' : AssetsPanel,
  },

  created() {
    remote.getCurrentWindow().addListener("resize", this.resizeWindow);
    document.documentElement.style.overflow = 'hidden'
  },

  destroyed() {
    remote.getCurrentWindow().removeListener("resize", this.resizeWindow);
  },

  methods: {
    resizeWindow() {
      this.height = window.innerHeight;
    }
  },

  computed: {
    sizePreviewPannel: function () {
      return (this.height * 0.3)+"px";
    },
    sizeTabsPannel: function () {
      return (this.height * 0.67)+"px";
    }
  },

  data: () => ({
    height: window.innerHeight,
    assets : json,
  }),


};
</script>
