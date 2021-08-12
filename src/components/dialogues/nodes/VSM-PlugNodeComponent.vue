<template>
  <polygon
      class="output"
      :style="styleOutput"
      stroke="#000"
      @mouseenter="$emit('mEnter', $event)"
      @mouseleave="$emit('mLeave')"
      @mouseup="$emit('mUp', $event, index, type)"
      @mousedown="$emit('mDown', $event, index)"
      @contextmenu="$emit('cMenu', $event, type, index)"
      stroke-width="0.2"
      style="stroke-linejoin: round;"
      :points="(locX + 2) + ' ' + (locY) + ' ' + (locX - 2) + ' ' + (locY) + ' ' + (locX) + ' ' + (locY + 2)"/>
</template>

<script>
export default {
  name: "VSM-PlugNodeComponent",

  props:["locX", "locY", "fillGradient", "type", "index"],

  computed:{
    styleOutput(){
      return {
        "--fill": 'url('+this.fillGradient+')',
        "--fill-hover": 'url('+this.fillGradient+'Hovered)'
      }
    },
  },
}

</script>

<style scoped>

.output{
  fill : var(--fill);
}

.output:hover{
  fill : var(--fill-hover);
  cursor: pointer;
}

</style>