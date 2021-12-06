<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="title"></span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-text-field
              v-if="variable!=null"
              label="Name"
              :rules="[rules.required, rules.counter, rules.existCharName, rules.notNull]"
              v-model="variable.name"
              :value="variable.name"
          ></v-text-field>

          <v-row>
            <v-icon v-if="select!=null" :color="select.color" large> {{ select.icon }} </v-icon>
            <v-select
                class="mt-5 ml-3"
                :items="listTypeVar"
                item-text="name"
                v-model="select"
                return-object
                label="Solo field"
                @change="changeType"
                solo
            ></v-select>
          </v-row>
          <v-row>
            <p class="mr-2 text-h6"> Initial Value : </p>
            <vsm-setter :assets="assets" :variable="variable" :listvar="listVariables" :initialval="true"></vsm-setter>
          </v-row>

        </v-container>

      </v-card-text>

      <v-card-actions>
        <vsm-help-button link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_Variables.md"></vsm-help-button>
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
            :disabled="!canSave"
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import listVariables from '../../assets/listTypesVariables.json'
import baseVariable from '../../assets/base_variables.json'
import Setter from "@/components/variables/VSM-SetterVariable";
import {removeDependencyVariable} from "@/lib";
import helpButton from "@/components/VSM-HelpButton";

export default {
  name: "VSM-EditVariablePanel",

  props:["bus", "listVariables", "assets", "listPages"],

  components:{
    "vsm-setter" : Setter,
    "vsm-help-button" : helpButton,
  },

  computed:{
    title(){
      return (this.editionMode ? "Edit " : "New ") + "Variable" ;
    },
    canSave(){
      if(this.variable == null || this.variable.name === "" || this.variable.name === "null" || this.variable.name.length>20 || (this.listVariables.filter(e => e.name === this.variable.name).length >= 1 && this.previousName !== this.variable.name)) return false;
      return true;
    },
  },

  data () {
    return {
      dialog: false,
      listTypeVar: listVariables,
      select: null,
      editionMode: false,
      variable: null,
      indexEdition: -1,
      previousName: "",
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        existCharName: value => (this.listVariables.filter(e => e.name === value).length < 1 || this.previousName === value) || 'Already Exist',
        notNull : value => value !== "null" || 'Not Null Name'
      },
    };
  },

  methods:{
    cancel(){
      this.hide();
    },
    save(){
      if(this.canSave){
        if(this.editionMode){
          let oldtype = this.assets[5].content[this.indexEdition].type;
          this.assets[5].content[this.indexEdition] = this.variable;
          if(this.variable.type.name !== oldtype.name) removeDependencyVariable(oldtype.name, this.previousName, "null", this.listPages, this.assets);
          else if(this.previousName !== this.variable.name) removeDependencyVariable(this.variable.type.name, this.previousName, this.variable.name, this.listPages, this.assets);
        } else {
          this.assets[5].content.push(this.variable);
        }
        this.hide();
        this.$emit("accept");
      }
    },
    show(){
      if(this.editionMode){
        this.variable = JSON.parse(JSON.stringify(this.listVariables[this.indexEdition]))
      } else {
        this.variable = JSON.parse(JSON.stringify(baseVariable));
      }
      this.previousName = this.variable.name;
      this.select = this.variable.type;
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    changeType(){
      this.variable.type = this.select;
      this.variable.value = {
        type: "value",
        value: JSON.parse(JSON.stringify(this.select.defaultValue))
      };
    },
  },

  mounted() {
    this.select = listVariables[0];
    this.bus.$on('showEditVariable', (data) => {
      this.editionMode = data.type;
      this.indexEdition = data.index;
      this.show();
    });
    this.bus.$on('hideEditVariable', this.hide);
  },
}
</script>

<style scoped>

</style>