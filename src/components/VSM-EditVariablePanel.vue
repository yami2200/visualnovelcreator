<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="'Global Variables :'"></span>
      </v-card-title>

      <v-card-text>

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
  name: "VSM-EditVariablePanel",

  data () {
    return {
      dialog: false,
      editionMode: false,
      variable: null,
    };
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
  },

  mounted() {
    this.bus.$on('showEditVariable', (data) => {
      this.editionMode = data.type;
      this.variable = data.variable;
      this.show();
    });
    this.bus.$on('hideEditVariable', this.hide);
  },
}
</script>

<style scoped>

</style>