<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="700px"
      max-height="800px"
  >
    <vsm-editpanelvariables @accept="save" :assets="assets" :bus="bus" :list-variables="variables" :listPages="listPages"></vsm-editpanelvariables>
    <vsm-confirmation-request-modal @accept="deleteSelected" :bus="bus1" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>

    <v-card
      max-height="60vh">
      <v-card-title>
        <span class="headline" v-text="'Global Variables :'"></span>
      </v-card-title>
      <v-card-text>
        <v-card>
        <v-container>

          <v-list max-height="39vh" class="mt-1 overflow-y-auto">
            <v-list-item-group v-model="selectedItem">
            <v-list-item
                v-for="(varia, index) in variables"
                :key="index"
            >
              <v-list-item-avatar>
                <v-icon :color="varia.type.color" large> {{ varia.type.icon }} </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title style="overflow: visible;" class="text-h6"> <strong :style="{color: varia.type.color}">{{ varia.type.name }}</strong> : {{varia.name}} </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>

              </v-list-item-action>

            </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-container>
        <v-app-bar
            dense
            bottom
            width="100%"
            height="50px"
        >
          <v-spacer></v-spacer>

          <v-btn icon @click="deleteV" :disabled="disableEditButton">
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <v-btn icon @click="edit" :disabled="disableEditButton">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>

          <v-btn icon @click="newV">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>

          <v-spacer></v-spacer>
        </v-app-bar>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <vsm-help-button link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_Variables.md"></vsm-help-button>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="close"
        >
          Close
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import VSMEditVariablePanel from "@/components/variables/VSM-EditVariablePanel";
import ConfirmationModal from "@/components/modalrequest/VSM-ConfirmationRequestModal"
import {removeDependencyVariable} from "@/lib";
import helpButton from "@/components/VSM-HelpButton";

export default {
  name: "VSM-VariablesPanel",
  components: {
    "vsm-editpanelvariables" : VSMEditVariablePanel,
    "vsm-confirmation-request-modal" : ConfirmationModal,
    "vsm-help-button" : helpButton,
  },

  props:["bus", "variables", "assets", "listPages"],

  data () {
    return {
      dialog: false,
      selectedItem : null,
      headlineCRM: "",
      textCRM: "",
      bus1: new Vue(),
    };
  },

  computed: {
    disableEditButton() {
      return this.selectedItem == null;
    },
  },

  methods:{
    close(){
      this.hide();
    },
    save(){
      this.$forceUpdate();
      this.$emit("save");
    },
    show(){
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    edit(){
      this.bus.$emit("showEditVariable", {type: true, index: this.selectedItem})
    },
    newV(){
      this.bus.$emit("showEditVariable", {type: false, index: -1})
    },
    deleteV(){
      if(this.disableEditButton) return;
      this.headlineCRM = "Do you really want to delete this variable ?";
      this.textCRM = "You are trying to delete the variable : "+ this.variables[this.selectedItem].name +", are you sure you want to continue ? ";
      this.bus1.$emit('showConfirmationRequestModal');
    },
    deleteSelected(){
      removeDependencyVariable(this.variables[this.selectedItem].type.name, this.variables[this.selectedItem].name, "null", this.listPages, this.assets);
      this.variables.splice(this.selectedItem, 1);
      this.$emit("save");
    },
  },

  mounted() {
    this.bus.$on('showVariablesPanel', this.show);
    this.bus.$on('hideVariablesPanel', this.hide);
  },
}
</script>

<style scoped>

</style>