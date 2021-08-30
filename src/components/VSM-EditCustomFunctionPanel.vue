<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="50%"
      max-height="900px"
  >
    <v-card
        max-height="80vh">
      <v-card-title>
          <span class="headline" v-text="(editMode ? 'Edit' : 'New') + ' Custom Function'"></span>
      </v-card-title>
      <v-card-text>
        <v-container v-if="customFunction !== null" class="ml-0 mr-0">
          <v-row>
            <v-col cols="12" md="6" sm="6" xl="6">
              <v-text-field
                  label="Name"
                  @keydown="changeName"
                  :rules="[rules.required, rules.existCharName]"
                  v-model="customFunction.name"
                  :value="customFunction.name"
              ></v-text-field>
              <v-color-picker
                  dot-size="25"
                  v-model="customFunction.color"
                  hide-inputs
                  swatches-max-height="200"
              ></v-color-picker>
            </v-col>
            <v-col cols="12" md="6" sm="6" xl="6">
              <v-card height="100%">
                <v-list height="250px" class="overflow-y-auto" dense>
                  <v-list-item
                      v-for="(input, index) in customFunction.inputs"
                      :key="index"
                  >
                    <span class="mr-2"> {{ index }}</span>
                    <v-text-field
                        label="Name"
                        :rules="[rules.required]"
                        v-model="input.name"
                        :value="input.name"
                    ></v-text-field>
                    <v-select
                        class="mr-1 ml-1"
                        :items="listTypeVar"
                        item-text="name"
                        v-model="input.type"
                        return-object
                        @change="changeInputType(index)"
                        label="Solo field"
                        solo
                    ></v-select>
                    <v-btn icon @click="deleteInput(index)">
                      <v-icon color="red lighten-1">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-card>

              <v-row align="center" justify="center">
                <v-btn @click="addNewInput"> Add new Input</v-btn>
              </v-row>

            </v-col>
          </v-row>
          <MonacoEditor class="mt-8" style="width: 100%; height: 30vh" v-model="customFunction.code" language="javascript" theme="vs-dark"/>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <vsm-help-button link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_CustomFunctions.md"></vsm-help-button>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="save"
            :disabled="disableSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseCustomFunction from "@/assets/base_customFunction.json";
import Var from "@/assets/base_variables.json";
import MonacoEditor from 'vue-monaco';
import listVariables from "../assets/listTypesVariables.json";
import helpButton from "@/components/VSM-HelpButton";

export default {
  name: "VSM-EditCustomFunctionPanel",

  props:["bus", "assets"],

  components: {
    MonacoEditor,
    "vsm-help-button" : helpButton,
  },

  computed:{
    disableSave(){
      return this.customFunction===null || this.customFunction.name === "" || (this.assets[9].content.filter(e => e.name === this.customFunction.name).length >= 1 && this.previousName !== this.customFunction.name);
    },
  },

  data () {
    return {
      dialog: false,
      editMode: false,
      customFunction : null,
      previousName : "",
      listTypeVar: listVariables,
      rules: {
        required: value => !!value || 'Required.',
        existCharName: value => (this.assets[9].content.filter(e => e.name === value).length < 1 || this.previousName == value) || 'Already Exist',
      },
    };
  },

  methods:{
    changeName(e){
      if(!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.key === "Backspace" || e.key === "Delete")){
        e.preventDefault();
      }
    },
    changeInputType(index){
      this.customFunction.inputs[index].value.value = this.customFunction.inputs[index].type.defaultValue;
    },
    save(){
      this.customFunction.lightColor = this.customFunction.color;
      this.customFunction.darkColor = this.customFunction.color;
      this.$emit("save", {f: this.customFunction, edit: this.editMode});
      this.hide();
    },
    cancel(){
      this.hide();
    },
    show(data){
      this.editMode = data.edit;
      this.customFunction = null;
      if(data.edit){
        this.customFunction = JSON.parse(JSON.stringify(data.f));
        this.previousName = this.customFunction.name;
      } else {
        this.customFunction = JSON.parse(JSON.stringify(BaseCustomFunction));
      }
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    addNewInput(){
      this.customFunction.inputs.push(JSON.parse(JSON.stringify(Var)));
    },
    deleteInput(index){
      this.customFunction.inputs.splice(index, 1);
    },
  },

  mounted() {
    this.bus.$on('showEditCustomFunction', this.show);
    this.bus.$on('hideEditCustomFunction', this.hide);
  }
}
</script>

<style scoped>

</style>