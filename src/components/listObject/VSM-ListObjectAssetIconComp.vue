<template>
  <v-row>
    <v-list-item-icon>
      <v-icon> {{ icon }} </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title v-text="name"></v-list-item-title>
    </v-list-item-content>
  </v-row>
</template>

<script>
export default {
  name: "VSM-ListObjectAssetIconComp",

  props : ["name", "icon"]
}
</script>

<style scoped>

</style>