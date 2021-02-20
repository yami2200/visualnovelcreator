<template>
  <v-card :height="height+'px'" width="100%" class="overflow-hidden justify-center">

          <panZoom @panstart="pan" :options="{zoomDoubleClickSpeed: 1,beforeMouseDown: testIgnore, maxZoom: 10, minZoom:1, bounds: true,boundsPadding: 1}">

            <svg :height="height+'px'" width="100%" ref="svgBox" style="background-color: green;" @mouseup="mouseUp">
                <!--<path :x="xTest" :y="yTest" @mousemove="mouseMove" @mousedown="mouseDown" @mouseup="mouseUp" @mouseenter="printtest('Enter')" d="M150 0 L75 200 L225 200 Z" />
                -->
               <!-- <rect
                    width="10"
                    height="10"
                    class="square"
                    :fill="color"
                    :x="xTest"
                    :y="yTest"
                    @mousedown="mouseDown"
                >
                </rect>-->
              <g v-for="(value,index) in listDialogues" v-bind:key="index">
                <vsm-test :bus="bus" @selectD="selectDialogue" :index="index" :dialogue="value"></vsm-test>
                <g v-for="(valueL,indexL) in value.nextDialogue" v-bind:key="indexL">
                  <line v-if="valueL != -1" :x1="getOutputLocX(index, value.nextDialogue.length)" :y1="getOutputLocY(index)" :x2="getInputLocX(valueL)" :y2="getInputLocY(valueL)" style="stroke:rgb(0,0,0);stroke-width:1" ></line>
                </g>
              </g>


            </svg>
          </panZoom>

  </v-card>
</template>

<script>
import Vue from "vue";
import testComp from './test';

export default {
  name: "VSM-DialogueManager",

  components: {
    'vsm-test' : testComp,
  },

  props: ['height'],

  data : () => ({
    xTest: 500,
    yTest: 500,
    color: "red",

    bus: new Vue(),
    dragOffsetX: 0,
    dragOffsetY: 0,
    selectedDialogue: -1,
    listDialogues: [
      {
        title : "Untitled Dialogue",
        x : 500,
        y : 300,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        nextDialogue : [1]
      },
      {
        title : "Untitled Dialogue",
        x : 500,
        y : 320,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        nextDialogue : [2]
      },
      {
        title : "Untitled Dialogue",
        x : 500,
        y : 340,
        text : "",
        type : "dialogue",
        choices : [],
        action : [],
        nextDialogue : [-1]
      },
    ]
  }),

  computed: {
    /*getInputLocX: function (index) {
      //console.log(index);
      return this.listDialogues[index].x + 7.5;
    },
    getInputLocY: function (index){
      return this.listDialogues[index].y + 0.5;
    }*/
  },

  methods:{
    getInputLocX(index){
      return this.listDialogues[index].x + 10.5;
    },
    getInputLocY(index){
      return this.listDialogues[index].y;
    },
    getOutputLocY(index){
      return this.listDialogues[index].y + 9;
    },
    getOutputLocX(index, length){
      if(length==1){
        return this.listDialogues[index].x + 10.5;
      }
      return 0;
    },
    printtest(text){
      console.log(text);
    },
    selectDialogue(data){
      console.log(data);
      this.selectedDialogue = data.index;
      this.dragOffsetX = data.e.offsetX - this.listDialogues[this.selectedDialogue].x;
      this.dragOffsetY = data.e.offsetY - this.listDialogues[this.selectedDialogue].y;
      this.$refs.svgBox.addEventListener('mousemove', this.mouseMove)
    },
    testIgnore(){
      return this.selectedDialogue != -1;
    },
    pan(){
      console.log("pan");
    },
    mouseUp(){
      this.$refs.svgBox.removeEventListener('mousemove', this.mouseMove)
      this.bus.$emit('unselect'+this.selectedDialogue);
      this.selectedDialogue = -1;
    },
    mouseMove(e){
        this.listDialogues[this.selectedDialogue].x = e.offsetX - this.dragOffsetX;
        this.listDialogues[this.selectedDialogue].y = e.offsetY - this.dragOffsetY;
    },
  },

}
</script>

<style scoped>

</style>