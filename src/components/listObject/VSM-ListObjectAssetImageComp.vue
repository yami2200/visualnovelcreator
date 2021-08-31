<template>
  <v-row>
    <v-list-item-avatar>
      <v-img :src="img"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-text="name"></v-list-item-title>
    </v-list-item-content>
  </v-row>
</template>

<script>
export default {
  name: "VSM-ListObjectAssetImageComp",

  props : ["img", "name"]
}
</script>

<style scoped>

</style>