<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="700px"
      max-height="700px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="'Global Variables :'"></span>
      </v-card-title>
      <v-card-text>
        <v-card>
        <v-container>

          <v-list height="200px" class="mt-2 overflow-y-auto">
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
export default {
  name: "VSM-VariablesPanel",

  props:["bus", "variables"],

  data () {
    return {
      dialog: false,
      selectedItem : null,
    };
  },

  computed: {
    disableEditButton() {
      return this.selectedItem == null;
    },
  },

  methods:{
    cancel(){
      this.hide();
    },
    save(){

    },
    show(){
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    edit(){
      console.log("edit")
    },
    newV(){
      console.log("emit")
    },
    deleteV(){
      console.log("delete")
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