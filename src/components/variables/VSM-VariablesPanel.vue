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

          <vsm-listobject
              height="39vh"
              :items="variables"
              :bus="bus1"
              searchAttribrute="name"
              @newObject="newV"
              @editObject="edit"
              @deleteObject="deleteV">

            <template v-slot:default="slotProps">
              <vsm-listobjectvariable :variable="slotProps.itemList"></vsm-listobjectvariable>
            </template>

          </vsm-listobject>

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
import ListObjectComp from "@/components/VSM-ListObjectComponent";
import ListObjectVariableComp from "@/components/listObject/VSM-ListObjectVariableComp";
import {mix_modal} from "@/mixins/MIX_Modal";

export default {
  name: "VSM-VariablesPanel",
  components: {
    "vsm-editpanelvariables" : VSMEditVariablePanel,
    "vsm-confirmation-request-modal" : ConfirmationModal,
    "vsm-help-button" : helpButton,
    "vsm-listobject" : ListObjectComp,
    "vsm-listobjectvariable" : ListObjectVariableComp,
  },

  props:["bus", "variables", "assets", "listPages"],

  mixins:[mix_modal],

  data () {
    return {
      nameText: "VariablesPanel",
      headlineCRM: "",
      textCRM: "",
      bus1: new Vue(),
      deleteIndex: 0,
    };
  },

  methods:{
    close(){
      this.hide();
    },
    save(){
      this.bus1.$emit("updateList");
      this.$emit("save");
    },
    edit(index){
      this.bus.$emit("showEditVariable", {type: true, index: index})
    },
    newV(){
      this.bus.$emit("showEditVariable", {type: false, index: -1})
    },
    deleteV(index){
      this.headlineCRM = "Do you really want to delete this variable ?";
      this.textCRM = "You are trying to delete the variable : "+ this.variables[index].name +", are you sure you want to continue ? ";
      this.deleteIndex = index;
      this.bus1.$emit('showConfirmationRequestModal');
    },
    deleteSelected(){
      removeDependencyVariable(this.variables[this.deleteIndex].type.name, this.variables[this.deleteIndex].name, "null", this.listPages, this.assets);
      this.variables.splice(this.deleteIndex, 1);
      this.bus1.$emit("setSelectItem", null);
      this.$emit("save");
    },
  },

}
</script>

<style scoped>

</style>