<template>
  <v-app>
    <v-main>
      <vsm-menu-bar :loading="processing" :bus="bus" :height="height"></vsm-menu-bar>
      <vsm-newproject-modal :bus="bus" @save="newProjectCreated"></vsm-newproject-modal>
      <vsm-inputtext :bus="bus" :maxLetters="30" text="Write a new name for your page :" headline="Rename the page" @accept="renamePage" :duplicate-names="listNamePages"></vsm-inputtext>
      <vsm-variables-panel v-if="assets!=null && assets.length>5" :bus="bus" :variables="assets[5].content" :assets="assets" :listPages="listPage"></vsm-variables-panel>
        <v-row no-gutters>
          <v-col cols="8">
            <vsm-dialogue-manager v-if="selectedDialoguePage!=null" @save="saveProjectButton" :currentpage="listPage[this.selectedDialoguePage].title" :projectproperties="project_properties" :busEntry="bus" :listPages="assets[6].content" :assets="assets" :width="widthDialogPanel" :height="sizeDialogPanel" :listDialogues="listDialogues">  </vsm-dialogue-manager>
          </v-col>
          <v-col cols="4">
            <vsm-pagespanel :listPage="listPage" :bus="bus" @changePage="onSwitchPage" @requestPage="requestPage"></vsm-pagespanel>
            <vsm-assets-panel @saveAssets="saveProjectButton" :project_prop="project_properties" :size-height="height" :assets="assets" :bus="bus" :listPages="listPage"></vsm-assets-panel>
          </v-col>
        </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";

const remote = require('electron').remote;
const {dialog} = require('electron').remote;
const render = require('electron').ipcRenderer;

import MenuBar from './components/VSM-MenuBar.vue';
import AssetsPanel from './components/assetsmanagement/VSM-AssetsPanel.vue';
import DialogueManager from './components/dialogues/VSM-DialogueManager.vue';
import PagesPanel from './components/pages/VSM-PagesPanel';
import jsonAssets from './test/assets.json';
import jsonVariables from './test/listVar.json';
import jsonProjectProperties from './test/project_properties2.json';
import jsonBasePage from './assets/base_page.json';
import inputText from "@/components/modalrequest/VSM-InputTextModal";
import newProject from "@/components/VSM-NewProjectModal";
import VarPanel from "@/components/variables/VSM-VariablesPanel";
import jsonBaseAsset from './assets/base_assets.json';

import {createFileProject, readFileSync, saveAssets, saveProperties} from "@/lib";
const fse = require('fs-extra');

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
    'vsm-variables-panel' : VarPanel,
  },

  mounted() {
    this.bus.$on('testParent', this.print);
    this.bus.$on('newproject', this.newProjectButton);
    this.bus.$on('openproject', this.openProjectButton);
    this.bus.$on('save', this.saveProjectButton);
    this.bus.$on('saveas', this.saveAsProjectButton);
    this.bus.$on('exit', this.exitButton);
    this.bus.$on('variables', this.variablesPanel);
    render.on('shortcut', (event, message) => {
      if(event.senderId === 0) this.shortcuts(message);
    })
  },

  created() {
    remote.getCurrentWindow().addListener("resize", this.resizeWindow);
    document.documentElement.style.overflow = 'hidden';
    process.nextTick(() => {
      this.loadProjectFromProjectProperties(this.project_properties, [this.project_properties.directory+"\\azz"]);
    });
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
    // ######################## PAGES MANAGEMENT
    onSwitchPage(selectedPage){
      if(selectedPage===null || selectedPage === undefined){
        this.selectedDialoguePage = null;
      } else {
        this.selectedDialoguePage = selectedPage;
      }
    },
    requestPage(data){
      if(data.type === "new"){
        var newPage = JSON.parse(JSON.stringify(basePage));
        if(this.listPage.filter((p) => p.title === newPage.title).length > 0){
          var index = 1;
          var searchingIndex = true;
          while(searchingIndex){
            index++;
            if(this.listPage.filter((p) => p.title === newPage.title + " " + index).length === 0) searchingIndex = false;
          }
          newPage.title = newPage.title + " " + index;
        }
        this.listPage.push(newPage);
      }
      if(data.index === null || data.index === undefined) return;
      if(data.type === "rename"){
        this.listNamePages = ["null"].concat(this.listPage.filter((p) => p.title !== this.listPage[data.index].title).map(v => v.title));
        this.bus.$emit("showInputText", this.listPage[data.index].title);
      }
      if(data.type === "delete"){
        if(!this.listPage[this.selectedDialoguePage].unkillable){
          this.deleteCurentPage();
        }
      }
    },
    renamePage(newname){
      var oldname = this.listPage[this.selectedDialoguePage].title;
      this.listPage[this.selectedDialoguePage].title = newname;
      this.listPage.forEach((p) => {
        p.listDialogues.forEach((d) => {
          if(d.transitionpage !== undefined && d.transitionpage === oldname){
            d.transitionpage = newname;
          }
        })
      })
    },
    deleteCurentPage(){
      var index = this.selectedDialoguePage;
      this.bus.$emit("changeSelectedPage", index-1);
      var listIDArrival = [];
      this.listPage.forEach((p) => {
        if(p === this.listPage[index]){
          p.listDialogues.forEach((d) => {
            if(d.transitionpage !== undefined && d.transitionpage !== this.listPage[index].title){
              listIDArrival.push({id : d.id, page : d.transitionpage});
            }
          });
        } else {
          p.listDialogues.forEach((d) => {
            if(d.transitionpage !== undefined && d.transitionpage === this.listPage[index].title){
              d.transitionpage = "";
            }
          });
        }
      });
      this.selectedDialoguePage = Math.max(0, index-1);
      this.listPage.splice(index, 1);
      this.listPage.forEach((p) => {
        listIDArrival.forEach((data) => {
          if(p.title === data.page){
            data.dialogues = p.listDialogues;
          }
        })
      });
      this.bus.$emit("deleteAllTransitionId", listIDArrival);
    },

    // ######################### FILE MENU
    newProjectButton() {
      this.bus.$emit("showNewProjectModal");
    },
    newProjectCreated(data){
      this.processing = true;

      this.assets = JSON.parse(JSON.stringify(jsonBaseAsset));
      createFileProject(data.directory, data, this.assets)
      this.project_properties = data;
      this.project_properties.directory = data.directory+"\\"+data.name+"\\";

      this.endProcessing();
    },
    openProjectButton() {
      var path = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [
          { name : 'Visual Novel Maker Project', extensions: ['vsm'] }
          ],
      });
      if(path === null || path === undefined) return;
      var file_properties = null;
      if(path.length>0) file_properties = JSON.parse(readFileSync(path[0]));
      this.loadProjectFromProjectProperties(file_properties, path);
    },
    loadProjectFromProjectProperties(file_properties, path){
      if(file_properties!=null){
        var realpath = path[0].substring(0, path[0].lastIndexOf("\\"));
        file_properties.directory = realpath+"\\";
        var assetsTempo = JSON.parse(readFileSync(file_properties.directory+"assets.json"));
        if(assetsTempo!=null){
          this.project_properties = file_properties;
          this.assets = assetsTempo;
          process.nextTick(() => {
            this.bus.$emit("reload", this.assets[6].content);
          });
        }
      }
    },
    saveProjectButton(){
      this.processing = true;

      saveProperties(this.project_properties)
      saveAssets(this.project_properties, this.assets);

      this.endProcessing();
    },
    saveAsProjectButton(){
      var path = dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });
      if(path === null || path === undefined || path.length===0) return;

      this.processing = true;

      const realpath = path[0]+"\\";
      var tempoProperties = JSON.parse(JSON.stringify(this.project_properties));
      tempoProperties.directory = realpath+this.project_properties.name+"\\";
      createFileProject(realpath, tempoProperties, this.assets)

      const srcDir = this.project_properties.directory + "Assets\\";
      const destDir = tempoProperties.directory+"Assets\\";

      fse.copySync(srcDir, destDir,{ overwrite: true });

      this.project_properties = tempoProperties;

      this.endProcessing();
    },
    exitButton(){
      this.w.close()
    },

    // ############################ EDIT MENU

    variablesPanel(){
      this.bus.$emit("showVariablesPanel");
    },

    // ############################# INPUTS
    shortcuts(event){
      if(event.type === "keyDown"){
        switch (event.key){
          case "s":
            if(event.control) {
              this.saveProjectButton();
            }
            break;
          case "c":
            if(event.control) {
              this.bus.$emit("copyDialogue");
            }
            break;
          case "v":
            if(event.control) {
              this.bus.$emit("pasteDialogue");
            }
            break;
          case "x":
            if(event.control) {
              this.bus.$emit("cutDialogue");
            }
            break;
        }
      }
    },
    endProcessing(){
      setTimeout(() => {
        this.processing = false;
      }, 300);
    },
  },

  computed: {
    sizeDialogPanel: function(){
      return (this.height * 0.97);
    },
    widthDialogPanel: function(){
      return this.width*2/3;
    },
    listDialogues: function(){
      this.refresh;
      return this.listPage[this.selectedDialoguePage].listDialogues;
    },
    listPage: function(){
      return this.assets[6].content;
    }
  },

  data: () => ({
    height: window.innerHeight,
    width: window.innerWidth,
    processing : false,
    assets : jsonAssets,
    bus: new Vue(),
    project_properties: jsonProjectProperties,
    variables: JSON.parse(JSON.stringify(jsonVariables)),
    minimized: false,
    selectedDialoguePage: 0,
    listNamePages: [],
    refresh : true,
    /*listPage: [
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
    ]*/
  }),


};
</script>