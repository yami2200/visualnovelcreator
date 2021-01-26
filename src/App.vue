<template>
  <v-app>
    <v-main>
      <vsm-menu-bar></vsm-menu-bar>
    </v-main>
  </v-app>
</template>

<script>
import MenuBar from './components/VSM-MenuBar.vue'

export default {
  name: 'App',

  components: {
    'vsm-menu-bar' : MenuBar
  },

  data: () => ({
    //
  }),
};
</script>
