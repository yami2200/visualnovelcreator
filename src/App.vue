<template>
  <v-app>
    <v-main>
      <vsm-menu-bar :loading="processing" :bus="bus" :height="height" @package="packageProjectRequest" @enginecode="editEngineCodePanel" @preferences="openEditorPreferencesPanel" @properties="openProjectPropertiesPanel" @customfunction="openCustomFunctionsPanel"></vsm-menu-bar>
      <vsm-newproject-modal :bus="bus" @save="newProjectCreated"></vsm-newproject-modal>
      <vsm-packageproject :bus="bus" @save="packageProject"></vsm-packageproject>
      <vsm-inputtext :bus="bus" :maxLetters="30" text="Write a new name for your page :" headline="Rename the page" @accept="renamePage" :duplicate-names="listNamePages"></vsm-inputtext>
      <vsm-variables-panel v-if="assets!=null && assets.length>5" @save="saveProjectButton" :bus="bus" :variables="assets[5].content" :assets="assets" :listPages="listPage"></vsm-variables-panel>
      <vsm-enginecode-panel :assets="assets" :bus="bus" :properties="project_properties"></vsm-enginecode-panel>
      <vsm-customfunctions :assets="assets" :bus="bus" @save="saveCustomFunctions"></vsm-customfunctions>
      <vsm-editorpreferences :bus="bus" :preferences="editorPreferences" @save="saveEditorPreferences"></vsm-editorpreferences>
      <vsm-projectproperties :bus="bus" :properties="project_properties" :assets="assets" @save="saveProjectProperties"></vsm-projectproperties>
      <vsm-projectopening :bus="bus" :preferences="editorPreferences" @newProject="newProjectButton" @openProject="openProjectButton" @openRecent="loadProjectFromProjectProperties"></vsm-projectopening>
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
import {remote, ipcRenderer, shell} from "electron";
import MenuBar from './components/VSM-MenuBar.vue';
import AssetsPanel from './components/assetsmanagement/VSM-AssetsPanel.vue';
import DialogueManager from './components/dialogues/VSM-DialogueManager.vue';
import PagesPanel from './components/pages/VSM-PagesPanel';
import OpenProjectModal from './components/modalrequest/VSM-ProjectOpeningModal';
import jsonAssets from './assets/base_assets.json';
import jsonBasePage from './assets/base_page.json';
import jsonBasePreferences from './assets/base_editorPreferences.json';
import inputText from "@/components/modalrequest/VSM-InputTextModal";
import newProject from "@/components/VSM-NewProjectModal";
import packageProject from "@/components/VSM-PackageProjectModal";
import VarPanel from "@/components/variables/VSM-VariablesPanel";
import jsonBaseAsset from './assets/base_assets.json';
import EngineCodeComp from '@/components/VSM-EngineCodeEditPanel';
import EditorPreferencesComp from '@/components/VSM-EditorPreferencesPanel';
import ProjectPropertiesComp from '@/components/VSM-ProjectPropertiesPanel';
import CustomFunctionComp from "@/components/VSM-CustomFunctionPanel";
import {createFileProject, readFileSync, saveAssets, saveProperties, createPackageWeb, createPackageWindows, getCustomFunctionFileText, writeFile} from "@/lib";
import fse from "fs-extra";
import path from "path";

const removeFilePart = dirname => path.parse(dirname).dir;
const basePage = jsonBasePage;
const {dialog} = remote;
var pathPreferences = remote.app.getPath('appData');
const pathApp = remote.app.getPath("exe");

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
    'vsm-enginecode-panel' : EngineCodeComp,
    'vsm-editorpreferences' : EditorPreferencesComp,
    'vsm-projectproperties' : ProjectPropertiesComp,
    "vsm-customfunctions" : CustomFunctionComp,
    'vsm-projectopening' : OpenProjectModal,
    "vsm-packageproject" : packageProject
  },

  mounted() {
    this.bus.$on('testParent', this.print);
    this.bus.$on('newproject', this.newProjectButton);
    this.bus.$on('openproject', this.openProjectButton);
    this.bus.$on('save', this.saveProjectButton);
    this.bus.$on('saveas', this.saveAsProjectButton);
    this.bus.$on('exit', this.exitButton);
    this.bus.$on('variables', this.variablesPanel);
    ipcRenderer.on('shortcut', (event, message) => {
      if(event.senderId === 0) this.shortcuts(message);
    })
  },

  created() {
    remote.getCurrentWindow().removeAllListeners("resize");
    remote.getCurrentWindow().addListener("resize", this.resizeWindow);
    document.documentElement.style.overflow = 'hidden';
    window.document.title = "Visual Novel Creator";
    this.loadEditorPreferences();
    process.nextTick(() => {
      this.bus.$emit("showOpeningAppProject");
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
      this.assets[8].content = this.project_properties;
      this.assets[7].content.forEach((f) => {
        writeFile(this.project_properties.directory+f.title, f.value);
      });
      window.document.title = "Visual Novel Creator - "+this.project_properties.name;
      this.bus.$emit("hideOpeningAppProject");

      this.addProjectToRecentPreferences();

      process.nextTick(() => {
        this.bus.$emit("reload", this.assets[6].content);
      });

      this.endProcessing();
    },
    openProjectButton() {
      var path = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [
          { name : 'Visual Novel Creator Project', extensions: ['vnc'] }
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
          window.document.title = "Visual Novel Creator - "+this.project_properties.name;
          this.bus.$emit("hideOpeningAppProject");
          this.addProjectToRecentPreferences();
        }
      }
    },
    saveProjectAfterAssetEdit(){
      this.saveProjectProperties(this.assets[8].content);
    },
    saveProjectButton(){
      this.processing = true;

      saveProperties(this.project_properties);
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
      this.assets[7].content.forEach((f) => {
        writeFile(this.project_properties.directory+f.title, f.value);
      });
      this.saveCustomFunctions();
      this.endProcessing();
    },
    packageProjectRequest(){
      this.bus.$emit("showPackageProjectModal");
    },
    packageProject(project){
      this.processing = true;
      switch (project.type){
        case "Windows":
          createPackageWindows(project.directory, this.assets, process.env.NODE_ENV !== 'production', path.join(removeFilePart(pathApp),"/packageWindows/"));
          break;
        case "Web" :
          createPackageWeb(project.directory, this.assets);
          break;
      }
      shell.openPath(project.directory);
      this.endProcessing();
    },
    exitButton(){
      this.w.close();
    },

    // ############################ EDIT MENU

    variablesPanel(){
      this.bus.$emit("showVariablesPanel");
    },
    editEngineCodePanel(){
      this.bus.$emit("showEngineCodeEditPanel");
    },

    loadEditorPreferences(first = true){
      var preferences = null;
      try{
        preferences = JSON.parse(readFileSync(pathPreferences+"\\"+"visualnovelmaker"+"\\"+"preferences.json"));
      }
      catch {
        console.log("An error occured when trying to read editor preferences ! \n The editor will load default preferences.");
      }
      if(preferences!=null){
        this.editorPreferences = preferences;
        this.updateEditorPreferences();
        return;
      } else if (first){
        writeFile(pathPreferences+"\\"+"visualnovelmaker"+"\\"+"preferences.json", JSON.stringify(jsonBasePreferences));
        this.loadEditorPreferences(false);
      } else {
        alert("An error occured when trying to read editor preferences ! \n The editor will load default preferences.");
      }
      this.editorPreferences = JSON.parse(JSON.stringify(jsonBasePreferences));
      this.updateEditorPreferences();
    },
    updateEditorPreferences(){
      if(this.editorPreferences === null) return;
      switch (this.editorPreferences.theme){
        case "light":
          this.$vuetify.theme.dark = false;
          break;
        case "dark":
          this.$vuetify.theme.dark = true;
          break;
      }
    },
    openEditorPreferencesPanel(){
      this.bus.$emit("showEditorPreferencesPanel");
    },
    saveEditorPreferences(pref){
      this.editorPreferences = pref;
      writeFile(pathPreferences+"\\"+"visualnovelmaker"+"\\"+"preferences.json", JSON.stringify(this.editorPreferences));
      this.updateEditorPreferences();
    },
    addProjectToRecentPreferences(){
      if(this.editorPreferences.recentProjects === undefined) this.editorPreferences.recentProjects = [];
      let url = this.project_properties.directory + this.project_properties.name + ".vnc";
      this.editorPreferences.recentProjects = this.editorPreferences.recentProjects.filter(p => p !== url);
      this.editorPreferences.recentProjects.unshift(url);
      this.saveEditorPreferences(this.editorPreferences);
    },

    openProjectPropertiesPanel(){
      this.bus.$emit("showProjectPropertiesPanel");
    },
    saveProjectProperties(prop){
      this.project_properties = prop;
      this.assets[8].content = this.project_properties;
      this.saveProjectButton();
    },

    openCustomFunctionsPanel(){
      this.bus.$emit("showCustomFunctionEditPanel");
    },
    saveCustomFunctions(){
      writeFile(this.project_properties.directory+"customFunction.js", getCustomFunctionFileText(this.assets[9].content));
      this.saveProjectButton();
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
    assets : JSON.parse(JSON.stringify(jsonAssets)),
    bus: new Vue(),
    project_properties: null,
    variables: null,
    minimized: false,
    selectedDialoguePage: 0,
    listNamePages: [],
    refresh : true,
    editorPreferences : null,
    w: remote.getCurrentWindow(),
  }),


};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@500&display=swap');

body{
  font-family: 'Karla', sans-serif;
}

</style>