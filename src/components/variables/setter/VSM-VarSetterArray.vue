<template>
  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :disabled-input-specific="disabledInputSpecific" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled" :onlyVariable="onlyVariable">
    <v-container
        class="px-0"
        fluid
    >
      <vsm-confirmation-request-modal @accept="changeTypeAccepted" @cancel="cancelChangeType" :bus="bus" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>

      <v-select
          class="mt-2 ml-3"
          :items="listTypeVar"
          item-text="name"
          v-model="select"
          return-object
          label="Choose type of object in Array"
          @change="changeType"
          solo
      ></v-select>

      <v-card>
        <vsm-list-object
            height="30vh"
            :items="value.values"
            :bus="bus1"
            :canSearch="false"
            @newObject="newObject"
            @deleteObject="deleteObject">
          <template v-slot:default="slotProps">
            <vsm-list-item :index="slotProps.index" :variable="slotProps.itemList" :assets="assets" :listvariables="listvariables" :initialval="!refEnabled"></vsm-list-item>
          </template>
        </vsm-list-object>
      </v-card>


    </v-container>
  </vsm-setterdefault>
</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import VarSetterDefault from "./VSM-VarSetterDefault";
import listVariables from '@/assets/listTypesVariables.json';
import baseVariable from '@/assets/base_variables.json';
import ListObjectComp from "@/components/VSM-ListObjectComponent";
import listObjectArrayComp from "@/components/listObject/VSM-ListObjectArrayComp";
import Vue from "vue";
import ConfirmationRequest from "@/components/modalrequest/VSM-ConfirmationRequestModal";

export default {
  name: "VSM-VarSetterBoolean",

  mixins: [mix_settervariable],

  components: {
    'vsm-confirmation-request-modal' : ConfirmationRequest,
    "vsm-setterdefault" : VarSetterDefault,
    "vsm-list-object" : ListObjectComp,
    "vsm-list-item" : listObjectArrayComp,
  },

  data: () => ({
    bus1: new Vue(),
    type: "Array",
    headlineCRM: "",
    textCRM: "",

    listTypeVar: listVariables,
    value: {
      type : {
        name : "Integer",
        icon : "mdi-numeric",
        color : "#22c74e",
        defaultValue : 0
      },
      values: []
    },
  }),

  methods: {
    resetDefault(){
      this.value = {
        type : {
          name : "Integer",
          icon : "mdi-numeric",
          color : "#22c74e",
          defaultValue : 0
        },
        values: []
      };
      this.select = this.value.type;
    },
    showVar(){
      this.show();
      this.select = this.variable.value.value.type;
    },
    changeType(e){
      if(e.name !== this.value.type.name && this.value.values.length > 0){
        this.headlineCRM = "Do you really want to change the object type of array ?";
        this.textCRM = "You are trying to change type of array, you will lose "+this.value.values.length +" object stored in array, are you sure you want to continue ? ";
        this.bus.$emit('showConfirmationRequestModal');
      } else {
        this.value.type = e;
        this.value.values = [];
      }
    },
    changeTypeAccepted(){
      this.value.type = this.select;
      this.value.values = [];
    },
    cancelChangeType(){
      this.select = this.value.type;
    },
    newObject(){
      let obj = JSON.parse(JSON.stringify(baseVariable));
      obj.value.value = this.value.type.defaultValue;
      obj.type = this.value.type;
      this.value.values.push(obj);
    },
    deleteObject(){
      console.log("delete");
    },
    changeChoice(c){
      this.choice = c;
      this.select = this.value.type;
    },
  },

  props:["assets"],

  mounted() {
    this.bus.$on('showSetterArray', this.showVar);
  },

}
</script>

<style scoped>

</style>