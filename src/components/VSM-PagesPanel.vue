<template>
  <v-card height="30vh">

    <v-list shaped height="25vh" class="overflow-y-auto">
      <v-list-item-group
          mandatory
          v-model="selectedItem"
          color="primary"
      >
        <v-list-item
            v-for="(item, i) in listPage"
            :key="i"
            @click="onChange"
        >
          <v-list-item-icon>
            <v-icon> mdi-book-open-page-variant-outline </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-app-bar
        dense
        height="50vh"
    >
      <v-spacer></v-spacer>

      <v-btn icon @click="deletePageRequest" :disabled=disableEditButtons>
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn icon @click="renameRequest" :disabled=disableEditButtons>
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <v-btn icon @click="newPageRequest">
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
    </v-app-bar>
  </v-card>
</template>

<script>
export default {
  name: "VSM-PagesPanel",

  props:['listPage', 'bus'],

  data: () => ({
    selectedItem: null,
  }),

  computed: {
    disableEditButtons : function () {
      return (this.selectedItem==null || this.selectedItem.unkillable);
    }
  },

  methods:{
    newPageRequest(){
      this.$emit("requestPage", {index : this.selectedItem, type : "new"});
    },
    deletePageRequest(){
      this.$emit("requestPage", {index : this.selectedItem, type : "delete"});
    },
    renameRequest(){
      this.$emit("requestPage", {index : this.selectedItem, type : "rename"});
    },
    onChange(){
      process.nextTick(() => {
        this.$emit("changePage", this.selectedItem);
      });
    },
    changeSelectedPage(newIndex){
      if(newIndex<0) this.selectedItem = 0;
      else this.selectedItem = newIndex;
    },
  },

  mounted() {
    this.bus.$on('changeSelectedPage', this.changeSelectedPage);
  },
}
</script>

<style scoped>

</style>