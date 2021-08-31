<template>
  <v-row>
    <v-list-item-avatar>
      <v-icon :color="variable.type.color" large> {{ variable.type.icon }} </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title style="overflow: visible;" class="text-h6"> <strong :style="{color: variable.type.color}">{{ variable.type.name }}</strong> : {{variable.name}} </v-list-item-title>
    </v-list-item-content>
  </v-row>
</template>

<script>
export default {
  name: "VSM-ListObjectVariableComp",

  props : ["variable"]
}
</script>

<style scoped>

</style>