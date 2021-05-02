<template>
  <v-card flat height="500">
    <v-row class="mt-4">
      <v-col cols="12" xl="6" md="6" sm="9">
        <v-text-field
            v-if="current!=null"
            label="Name"
            v-model="current.title"
            :value="current.title"
        ></v-text-field>
        <span class="mt-2 mr-4"> Transition Page : </span>
        <v-select
            class="mt-2"
            :items="listPagesNames"
            v-model="current.transitionpage"
            label="Change Transition Page"
            solo
        ></v-select>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "VSM-DialogueTabBasic",

  props:["current", "assets", "listPages"],

  computed:{
    listPagesNames(){
      return this.listPages.map((p) => p.title);
    },
  },
}
</script>

<style scoped>

</style>