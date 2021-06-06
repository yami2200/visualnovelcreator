<template>
  <v-card flat height="500">
    <v-checkbox
        class="ml-2"
        v-model="current.waitEndScript"
        label="Wait the end of all script before leaving the dialogue:"
    ></v-checkbox>
      <v-card
          class="mx-auto"
          width="100%"
          height="450"
          tile
      >
        <v-list class="mt-2 overflow-y-auto" max-height="450" dense>
          <vsm-scriptlist :assets="assets" :action="current.action" :indentation="0"> </vsm-scriptlist>
        </v-list>

      </v-card>
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