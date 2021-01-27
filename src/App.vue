<template>
  <v-app>
    <v-main>
      <vsm-menu-bar></vsm-menu-bar>

        <v-row no-gutters>
          <v-col cols="8">
            <!-- https://github.com/thecodealer/vue-panzoom -->
          </v-col>
          <v-col cols="4">
            <v-card :height="sizePreviewPannel">
            </v-card>
            <vsm-assets-panel :size-height="height" :assets="assets" :bus="bus"></vsm-assets-panel>
          </v-col>
        </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";

const remote = require('electron').remote;
import MenuBar from './components/VSM-MenuBar.vue';
import AssetsPanel from './components/VSM-AssetsPanel.vue';
//import ConfirmationRequest from './components/VSM-ConfirmationRequestModal.vue';
import json from './test/assets.json';

export default {
  name: 'App',

  components: {
    'vsm-menu-bar' : MenuBar,
    'vsm-assets-panel' : AssetsPanel,
    //'vsm-confirmation-request-modal' : ConfirmationRequest,
  },

  mounted() {
    this.bus.$on('testParent', this.print);
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
    },
    print() {
      console.log("text parent");
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
    bus: new Vue(),
  }),


};
</script>
