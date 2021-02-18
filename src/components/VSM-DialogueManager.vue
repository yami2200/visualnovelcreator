<template>
  <v-card :height="height" width="100%" class="overflow-hidden justify-center">
    <v-container fill-height fluid>
      <v-row align="center"
             justify="center">
        <v-col>
          <panZoom>

            <flowy
                class="fill-height"
                :nodes="nodes"
                :beforeMove="beforeMovingNode"
                :beforeAdd="beforeAddingNode"
                @add="onNodeAdded"
                @move="onNodeMoved"
                @remove="onNodeRemoved"
            ></flowy>
          </panZoom>

        </v-col>
      </v-row>
    </v-container>

  </v-card>
</template>

<script>
import Vue from 'vue';
import testComp from './test';

Vue.component('demo-node', testComp)

export default {
  name: "VSM-DialogueManager",

  props: ['height'],

  data : () => ({
    nodes: [
      {
        id: '1',
        parentId: -1,
        nodeComponent: 'demo-node',
        data: {
          text: 'Parent block',
          title: 'New Visitor',
          description: '<span>When a <b>new visitor</b> goes to <i>Site 1</i></span>',
        },
      },
      {
        id: '2',
        parentId: '1',
        nodeComponent: 'demo-node',
        data: {
          text: 'Parent block',
          title: 'New Visitor',
          description: '<span>When a <b>new visitor</b> goes to <i>Site 1</i></span>',
        },
      },
      {
        id: '3',
        parentId: '1',
        nodeComponent: 'demo-node',
        data: {
          text: 'Parent block',
          title: 'New Visitor',
          description: '<span>When a <b>new visitor</b> goes to <i>Site 1</i></span>',
        },
      },
      {
        id: '4',
        parentId: '3',
        nodeComponent: 'demo-node',
        data: {
          text: 'Parent block',
          title: 'New Visitor',
          description: '<span>When a <b>new visitor</b> goes to <i>Site 1</i></span>',
        },
      },
    ],

  }),

  methods:{
    onNodeRemoved(event){
      console.log(event);
    },
    onNodeMoved(event){
      console.log(event);
    },
    onNodeAdded(event){
      console.log(event);
    },
    beforeAddingNode({ to, from }){
      console.log(to);
      console.log(from);
    },
    beforeMovingNode({ to, from }){
      console.log(to);
      console.log(from);
    }
  }
}
</script>

<style scoped>

</style>