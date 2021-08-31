<template>
  <v-row>
    <v-list-item-icon class="ml-2 mr-2">
      <v-icon> mdi-script-text </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title style="overflow: visible;" class="text-h6"> <strong :style="{color: functionC.color}" style="text-shadow: 1px 1px 2px black;"> {{ functionC.name }}</strong> </v-list-item-title>
    </v-list-item-content>
  </v-row>
</template>

<script>
export default {
  name: "VSM-ListObjectCustomFunctionComp",

  props : ["functionC"]
}
</script>

<style scoped>

</style>