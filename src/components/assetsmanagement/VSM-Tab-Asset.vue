<template>
  <v-tab  :href="href" style="min-width: unset!important; width: 20%!important; padding: 0!important;position: relative">
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <div v-on="on" style="width: 100%; height: 100%; display: inline-block;text-align: center; padding-top:14%">
          <v-icon> {{ icon }} </v-icon>
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </v-tab>
</template>

<script>
export default {
  name: "VSM-Tab-Asset",
  props:["href", "icon", "tooltip"]
}
</script>

<style scoped>

</style>