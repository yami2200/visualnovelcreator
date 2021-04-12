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
              :rules="[rules.required, rules.counter, rules.existCharName]"
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
                solo
            ></v-select>
          </v-row>
          <v-row>
            <p class="mr-2 text-h6"> Initial Value : </p>
            <vsm-setter :variable="variable" :listvar="listVariables" :initialval="false"></vsm-setter>
          </v-row>

        </v-container>

      </v-card-text>

      <v-card-actions>
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
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import listVariables from './../assets/listTypesVariables.json'
import baseVariable from './../assets/base_variables.json'
import Setter from "@/components/VSM-SetterVariable";

export default {
  name: "VSM-EditVariablePanel",

  props:["bus", "listVariables"],

  components:{
    "vsm-setter" : Setter,
  },

  computed:{
    title(){
      return (this.editionMode ? "Edit " : "New ") + "Variable" ;
    }
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
        existCharName: value => (this.listVariables.filter(e => e.name === value).length < 1 || this.previousName == value) || 'Already Exist',
      },
    };
  },

  methods:{
    cancel(){
      this.hide();
    },
    save(){

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