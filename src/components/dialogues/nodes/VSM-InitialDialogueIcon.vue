<template>
  <polygon
      fill="url(#InitialDialogueIcon)"
      stroke="#FFFFFF"
      stroke-width="0.3"
      style="stroke-linejoin: round;"
      :points="pointsTriangle"/>
</template>

<script>
export default {
  name: "VSM-InitialDialogueIcon",

  props:["x", "y"],

  computed:{
    pointsTriangle(){
      return (this.x + 2) + ' ' + (this.y) + ' ' + (this.x - 1) + ' ' + (this.y + 2) + ' ' + (this.x - 1) + ' ' + (this.y - 2);
    },
  },

}
</script>

<style scoped>

</style>