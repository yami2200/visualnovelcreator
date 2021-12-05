<template>
  <v-container ref="containerList" :style="{width: '100%', padding: '0px', height: height}" style="max-width: unset">
    <v-list shaped height="calc(100% - 50px)" width="100%" class="overflow-y-auto">
      <v-list-item-group
          :mandatory="mandatory !== undefined && mandatory && !searchMode"
          v-model="selectedItem"
          color="primary"
      >
        <v-list-item
            v-for="(itemList, i) in listItems"
            :key="i"
            @contextmenu="contextMenu($event, i)"
            @click="clickItem(i)"
        >

          <slot :itemList="itemList" :index="i"></slot>

        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-app-bar
        dense
        height="50"
    >
      <v-btn v-if="canSearch === undefined || canSearch" icon @click="searchButton">
        <v-icon v-if="searchMode">mdi-arrow-left-thick</v-icon>
        <v-icon v-else>mdi-magnify</v-icon>
      </v-btn>
      <v-text-field v-if="searchMode" ref="searchInput" class="mt-4" v-model="search"></v-text-field>

      <v-spacer></v-spacer>

      <v-btn icon @click="deleteObject" :disabled=disableEditionButtons>
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn icon @click="editObject" :disabled=disableEditionButtons>
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <v-btn icon @click="newObject">
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>

      <v-spacer v-if="!searchMode"></v-spacer>
    </v-app-bar>
  </v-container>
</template>

<script>
export default {
  name: "VSM-ListObjectComponent",

  props:["height", "items", "bus", "canSearch", "searchAttribrute", "mandatory"],

  mounted() {
    if(this.bus !== undefined){
      this.bus.$on("resetSelectItem", () => {this.selectedItem = null});
      this.bus.$on("setSelectItem", (index) => {this.selectedItem = index})
      this.bus.$on("updateList", () => {this.$forceUpdate()})
    }
  },

  computed: {
    listItems(){
      if(this.items === undefined) return [];
      if(this.searchMode) return this.items.filter((item) => item[this.searchAttribrute].toLowerCase().includes(this.search.toLowerCase()));
      return this.items;
    },
    disableEditionButtons(){
      return this.selectedItem === null || this.selectedItem === undefined || this.selectedItem === -1;
    },
  },

  data : () => ({
    selectedItem: null,
    searchMode: false,
    search: "",
    oldSearch: "",
  }),

  methods:{
    newObject(){
      this.$emit("newObject");
    },
    editObject(){
      if(this.disableEditionButtons) return;
      let index = this.selectedItem;
      if(this.searchMode) index = this.items.indexOf(this.listItems[this.selectedItem]);
      if(index === -1) return;
      this.$emit("editObject", index);
    },
    deleteObject(){
      if(this.disableEditionButtons) return;
      let index = this.selectedItem;
      if(this.searchMode) index = this.items.indexOf(this.listItems[this.selectedItem]);
      if(index === -1) return;
      this.$emit("deleteObject", index);
    },
    searchButton(){
      this.selectedItem = null
      this.searchMode = !this.searchMode;
      this.$nextTick(() => {
        if(this.searchMode) this.$refs["searchInput"].focus();
      });
    },
    contextMenu(event, i){
      if(i === undefined || i === null || i === -1) return;
      let index = i;
      if(this.searchMode) index = this.items.indexOf(this.listItems[i]);
      if(index === -1) return;
      this.$emit('contextMenuClick', event, index);
    },
    clickItem(i){
      let index = i;
      if(this.searchMode) index = this.items.indexOf(this.listItems[i]);
      this.$emit('changeItem', index);
    },
  },

}
</script>

<style scoped>

</style>