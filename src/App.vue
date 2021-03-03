<template>
  <v-app>
    <v-main>
      <vsm-menu-bar :height="height"></vsm-menu-bar>

        <v-row no-gutters>
          <v-col cols="8">
            <!-- https://github.com/thecodealer/vue-panzoom -->

                  <vsm-dialogue-manager :width="widthDialogPanel" :height="sizeDialogPanel">  </vsm-dialogue-manager>


          </v-col>
          <v-col cols="4">
            <v-card height="30vh">
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
      process.nextTick((data = this) => {
        if(!remote.getCurrentWindow().isMinimized()) {
          data.width = window.innerWidth;
          if(this.minimized){
            this.minimized = false;
            data.height = window.innerHeight;
          } else if(remote.getCurrentWindow().isMaximized()){
            data.height = window.outerHeight-20;
          } else {
            data.height = window.outerHeight-37;
          }
        } else {
          this.minimized = true;
        }
      });
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
      return this.width*2/3;
    }
  },

  data: () => ({
    height: window.innerHeight,
    width: window.innerWidth,
    assets : jsonAssets,
    bus: new Vue(),
    project_properties: jsonProjectProperties,
    minimized: false,
  }),


};
</script>
