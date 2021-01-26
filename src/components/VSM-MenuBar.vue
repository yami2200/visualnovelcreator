<template>
  <v-app-bar max-height="3%">
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
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
const remote = require('electron').remote;
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
    }

  }

};
</script>

<style scoped>

</style>