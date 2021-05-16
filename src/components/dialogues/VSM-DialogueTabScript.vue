<template>
  <v-card flat height="500">
    <v-row class="mt-1">
      <v-card
          class="mx-auto"
          width="100%"
          height="480"
          tile
      >
        <v-list class="mt-2 overflow-y-auto" max-height="480" dense>
          <vsm-scriptlist :assets="assets" :action="current.action" :indentation="0"> </vsm-scriptlist>
        </v-list>

      </v-card>

    </v-row>
  </v-card>
</template>

<script>
import listScript from "@/components/dialogues/VSM-ListScript"

export default {
  name: "VSM-DialogueTabBasic",

  components:{
    "vsm-scriptlist" : listScript
  },

  props:["current", "assets"],
}
</script>

<style scoped>

</style>