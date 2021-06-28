<template>
  <v-app-bar max-height="3%" min-height="20px">
    <v-toolbar-items>
      <vsm-dropdown-menu
          :items="FileItems"
          name="File"
          :height="height"
          sizeHeight=3
          @newproject="bus.$emit('newproject')"
          @openproject="bus.$emit('openproject')"
          @save="bus.$emit('save')"
          @saveas="bus.$emit('saveas')"
          @exit="bus.$emit('exit')">
      </vsm-dropdown-menu>
      <vsm-dropdown-menu
          :items="EditItems"
          :height="height"
          name="Edit"
          sizeHeight=3
          @variablespanel="bus.$emit('variables')"
          @enginecode="$emit('enginecode')"
          @projectproperties="properties"
          @apppreferences="$emit('preferences')">
      </vsm-dropdown-menu>
      <vsm-dropdown-menu
          :items="HelpItems"
          :height="height"
          name="Help"
          sizeHeight=3
          @github="githublink"
          @websiteauthor="authorwebsiteLink"
          @bugsuggestion="bugsuggestionlink">
      </vsm-dropdown-menu>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-row
        class="fill-height"
        align-content="center"
        justify="center"
    >
      <v-col
          class="subtitle-1"
          cols="10"
      ></v-col>
      <v-col
          class="subtitle-1"
          cols="2"
      >
        <v-progress-linear
            striped
            height="10"
            color="lime"
            class="mb-8"
            :indeterminate="loading"
            :active="loading"
        ></v-progress-linear>
      </v-col></v-row>

  </v-app-bar>
</template>

<script>
import {shell} from "electron";
import Dropdown from "./VSM-Dropdown-Menu";

export default {
  name: "VSM-MenuBar",

  components: {
    'vsm-dropdown-menu' : Dropdown
  },

  props : ['height', 'bus','loading'],

  data: () => ({
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
      {title: "Variables",
        action: "variablespanel"},
      {title: "Custom Functions",
        action: "functionspanel"},
      {title: "Engine Code",
        action: "enginecode"},
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
      {title: "Bugs & Suggestions",
        action: "bugsuggestion"},
    ],
  }),

  methods: {
    // ########################### EDIT MENU ###############################
    properties(){
      console.log("Project Properties");
    },

    // ########################## HELP MENU #####################################
    githublink(){
      shell.openExternal('https://github.com/yami2200/visualnovelmaker');
    },
    authorwebsiteLink(){
      shell.openExternal('https://romainbriend.com/');
    },
    bugsuggestionlink(){
      shell.openExternal('https://github.com/yami2200/visualnovelmaker/issues');
    },

  }

};
</script>

<style scoped>

</style>