<template>
  <v-card width="150px" height="40px">
    <v-card-text>
      <v-row justify="center" align="center">
        <p class="ml-5" style="float: left" v-if="variable!=undefined"> <strong> {{ variable.initialValue }} </strong> </p>
        <v-spacer></v-spacer>
        <v-btn icon class="mb-3" @click="editVar">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </v-row>
    </v-card-text>

  </v-card>
</template>

<script>
export default {
  name: "VSM-SetterInteger",

  props:["variable"],

  methods:{
    editVar(){

    },
  },

}
</script>

<style scoped>

</style>