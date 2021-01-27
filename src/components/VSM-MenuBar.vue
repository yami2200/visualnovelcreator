<template>
  <v-app-bar max-height="3%" min-height="20px">
    <v-toolbar-items>
      <vsm-dropdown-menu
          :items="FileItems"
          name="File"
          sizeHeight=3
          @newproject="newProjectButton"
          @openproject="openProjectButton"
          @save="saveProjectButton"
          @saveas="saveAsProjectButton"
          @exit="exitButton">
      </vsm-dropdown-menu>
      <vsm-dropdown-menu
          :items="EditItems"
          name="Edit"
          sizeHeight=3
          @projectproperties="properties"
          @apppreferences="preferences">
      </vsm-dropdown-menu>
      <vsm-dropdown-menu
          :items="HelpItems"
          name="Help"
          sizeHeight=3
          @github="githublink"
          @websiteauthor="authorwebsiteLink">
      </vsm-dropdown-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
const remote = require('electron').remote;
const { shell } = require('electron');
import Dropdown from "./VSM-Dropdown-Menu";

export default {
  name: "VSM-MenuBar",

  components: {
    'vsm-dropdown-menu' : Dropdown
  },

  data: () => ({
    w: remote.getCurrentWindow(),
    FileItems: [
      { title: "New Project",
      action: "newproject"},
      {title: "Open",
        action: "openproject"},
      {title: "Save",
        action: "save"},
      {title: "Save As",
        action: "saveas"},
      {title: "Exit",
        action: "exit"},
    ],
    EditItems: [
      {title: "Project Properties",
      action: "projectproperties"},
      {title: "App Preferences",
        action: "apppreferences"},
    ],
    HelpItems: [
      {title: "Github",
        action: "github"},
      {title: "Author WebSite",
        action: "websiteauthor"},
    ],
  }),

  methods: {
    // ############################### FILE MENU ##############################
    newProjectButton() {
      console.log("Creating new project");
    },
    openProjectButton() {
      console.log("Open project");
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

    // ########################### EDIT MENU ###############################
    preferences(){
      console.log("App Preferences");
    },
    properties(){
      console.log("Project Properties");
    },

    // ########################## HELP MENU #####################################
    githublink(){
      shell.openExternal('https://github.com/yami2200/visualnovelmaker');
    },
    authorwebsiteLink(){
      shell.openExternal('https://romainbriend.com/');
    }

  }

};
</script>

<style scoped>

</style>