<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn :height="sizeButton" :max-height="sizeButton" :min-height="sizeButton"
             v-on="on"
      >
        {{ name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="$emit(item.action)"
          dense
          class="listBtn"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "VSM-Dropdown-Menu",

  props: {
    name: { required: true, type: String },
    items: {
      required: true,
    },
  },

  computed: {
    sizeButton: function () {
      return "100%";
    }
  },

}
</script>

<style scoped lang="scss">
::v-deep .listBtn {
  max-height: 5px !important;
}

</style>