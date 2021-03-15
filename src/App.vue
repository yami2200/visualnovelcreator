<template>
  <v-app>
    <v-main>
      <vsm-menu-bar :bus="bus" :height="height"></vsm-menu-bar>
      <vsm-newproject-modal :bus="bus" @save="newProjectCreated"></vsm-newproject-modal>
      <vsm-inputtext :bus="bus" :maxLetters="30" text="Write a new name for your page :" headline="Rename the page" @accept="renamePage"></vsm-inputtext>

        <v-row no-gutters>
          <v-col cols="8">
            <!-- https://github.com/thecodealer/vue-panzoom -->

                  <vsm-dialogue-manager v-if="selectedDialoguePage!=null" :width="widthDialogPanel" :height="sizeDialogPanel" :listDialogues="listPage[selectedDialoguePage].listDialogues">  </vsm-dialogue-manager>


          </v-col>
          <v-col cols="4">
            <vsm-pagespanel :listPage="listPage" :bus="bus" @changePage="onSwitchPage" @requestPage="requestPage"></vsm-pagespanel>
            <vsm-assets-panel :project_prop="project_properties" :size-height="height" :assets="assets" :bus="bus"></vsm-assets-panel>
          </v-col>
        </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";

const remote = require('electron').remote;
const {dialog} = require('electron').remote;

import MenuBar from './components/VSM-MenuBar.vue';
import AssetsPanel from './components/VSM-AssetsPanel.vue';
import DialogueManager from './components/VSM-DialogueManager.vue';
import PagesPanel from './components/VSM-PagesPanel';
import jsonAssets from './test/assets.json';
import jsonProjectProperties from './test/project_properties.json';
import jsonBasePage from './assets/base_page.json';
import inputText from "@/components/VSM-InputTextModal";
import newProject from "@/components/VSM-NewProjectModal";
import jsonBaseAsset from './assets/base_assets.json';

import {createFileProject, readFileSync} from "@/lib";

const basePage = jsonBasePage;

export default {
  name: 'App',

  components: {
    'vsm-menu-bar' : MenuBar,
    'vsm-assets-panel' : AssetsPanel,
    'vsm-dialogue-manager' : DialogueManager,
    'vsm-pagespanel' : PagesPanel,
    'vsm-inputtext' : inputText,
    'vsm-newproject-modal' : newProject,
  },

  mounted() {
    this.bus.$on('testParent', this.print);
    this.bus.$on('newproject', this.newProjectButton);
    this.bus.$on('openproject', this.openProjectButton);
    this.bus.$on('save', this.saveProjectButton);
    this.bus.$on('saveas', this.saveAsProjectButton);
    this.bus.$on('exit', this.exitButton);
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
    },
    onSwitchPage(selectedPage){
      if(selectedPage==null || selectedPage == undefined){
        this.selectedDialoguePage = null;
      } else {
        this.selectedDialoguePage = selectedPage;
      }
    },
    requestPage(data){
      if(data.type === "new"){
        this.listPage.push(JSON.parse(JSON.stringify(basePage)));
      }
      if(data.index == null || data.index == undefined) return;
      if(data.type === "rename"){
        this.bus.$emit("showInputText", this.listPage[data.index].title);
      }
      if(data.type === "delete"){
        if(!this.listPage[this.selectedDialoguePage].unkillable){
          this.deleteCurentPage();
        }
      }
    },
    renamePage(newname){
      this.listPage[this.selectedDialoguePage].title = newname;
    },
    deleteCurentPage(){
      var index = this.selectedDialoguePage;
      this.bus.$emit("changeSelectedPage", index-1)
      this.selectedDialoguePage = Math.max(0, index-1);
      this.listPage.splice(index, 1);
    },

    loadProjectFromProperties(){

    },

    // ######################### FILE MENU
    newProjectButton() {
      this.bus.$emit("showNewProjectModal");
    },
    newProjectCreated(data){
      this.assets = JSON.parse(JSON.stringify(jsonBaseAsset));
      createFileProject(data.directory, data, this.assets)
      this.project_properties = data;
      this.project_properties.directory = data.directory+"\\"+data.name+"\\";
    },
    openProjectButton() {
      var path = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [
          { name : 'Visual Novel Maker Project', extensions: ['vsm'] }
          ],
      });
      if(path == null || path == undefined) return;
      var file_properties = null;
      if(path.length>0) file_properties = JSON.parse(readFileSync(path[0]));
      if(file_properties!=null){
        var realpath = path[0].substring(0, path[0].lastIndexOf("\\"));
        file_properties.directory = realpath+"\\";
        var assetsTempo = JSON.parse(readFileSync(file_properties.directory+"assets.json"));
        if(assetsTempo!=null){
          this.project_properties = file_properties;
          this.assets = assetsTempo;
        }
      }
    },
    saveProjectButton(){

      console.log("Save project");
    },
    saveAsProjectButton(){
      console.log("Save as project");
    },
    exitButton(){
      this.w.close()
    },
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
    selectedDialoguePage: 0,
    listPage: [
      {
        title : "First Page",
        unkillable : true,
        listDialogues: [],
      },
      {
        title : "Untitled Page",
        unkillable : false,
        listDialogues: [],
      },
    ]
  }),


};
</script>
