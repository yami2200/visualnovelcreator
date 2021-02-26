<template>
  <v-app>
    <v-main>
      <vsm-menu-bar></vsm-menu-bar>

        <v-row no-gutters>
          <v-col cols="8">
            <!-- https://github.com/thecodealer/vue-panzoom -->

                  <vsm-dialogue-manager :width="widthDialogPanel" :height="sizeDialogPanel">  </vsm-dialogue-manager>


          </v-col>
          <v-col cols="4">
            <v-card :height="sizePreviewPannel">
            </v-card>
            <vsm-assets-panel :project_prop="project_properties" :size-height="height" :assets="assets" :bus="bus"></vsm-assets-panel>
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
import DialogueManager from './components/VSM-DialogueManager.vue';
import jsonAssets from './test/assets.json';
import jsonProjectProperties from './test/project_properties.json';

export default {
  name: 'App',

  components: {
    'vsm-menu-bar' : MenuBar,
    'vsm-assets-panel' : AssetsPanel,
    'vsm-dialogue-manager' : DialogueManager,
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
      this.width = window.innerWidth;
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
    },
    sizeDialogPanel: function(){
      return (this.height * 0.97);
    },
    widthDialogPanel: function(){
      console.log(this.width*2/3);
      return this.width*2/3;
    }
  },

  data: () => ({
    height: window.innerHeight,
    width: window.innerWidth,
    assets : jsonAssets,
    bus: new Vue(),
    project_properties: jsonProjectProperties,
  }),


};
</script>
