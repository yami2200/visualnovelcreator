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
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "VSM-VariablesPanel",

  data () {
    return {
      dialog: false,
    };
  },
}
</script>

<style scoped>

</style>