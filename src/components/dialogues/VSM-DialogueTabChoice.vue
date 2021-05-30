<template>
  <v-card flat height="500">
    <v-row class="mt-1">
      <v-spacer></v-spacer>
      <v-btn
          @click="addChoice"
          color="primary"
          elevation="2"
      > Add new choice </v-btn>
      <v-spacer></v-spacer>
      <v-btn
          @click="addObject"
          color="warning"
          elevation="2"
      > Add new object usage </v-btn>
      <v-spacer></v-spacer>
    </v-row>
    <v-list class="mt-5 overflow-y-auto"  max-height="450">
      <v-list-item
          v-for="(choice, index) in current.choices"
          :key="index"
      >
        <v-list-item-icon v-if="choice.type === 'choice'">
          <v-icon> mdi-arrow-decision-outline </v-icon>
        </v-list-item-icon>
        <v-list-item-icon v-else>
          <v-icon> mdi-archive </v-icon>
        </v-list-item-icon>
        <v-text-field
            class="mr-5"
            label="Text"
            v-model="choice.text"
            :value="choice.text"
        ></v-text-field>
        <vsm-setter v-if="choice.type === 'choice'" :variable="choice.condition" :listvar="assets[5].content" :initialval="false" :assets="assets"> </vsm-setter>
        <vsm-setter v-else :variable="choice.object" :listvar="assets[5].content" :initialval="false" :assets="assets"> </vsm-setter>
        <v-btn icon class="ml-5" @click="deleteChoice(index)">
          <v-icon color="red lighten-1">mdi-delete</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import setter from "@/components/variables/VSM-SetterVariable"
import baseChoice from "@/assets/base_choice.json"
import baseObject from "@/assets/base_objectChoice.json"

export default {
  name: "VSM-DialogueTabBasic",

  components:{
    "vsm-setter" : setter
  },

  methods:{
    addChoice(){
      var searching = true;
      var added = false;
      var indexName = 0;
      var choice = JSON.parse(JSON.stringify(baseChoice));
      var nextDialogue = { id: -1, ii: 0 };
      var output = { x: 0, y: 0 };


      while(searching){
        var list = this.current.choices.filter((c) => (c.text === baseChoice.text && indexName === 0) || (c.text === baseChoice.text + " "+ indexName));
        if(list.length>0){
          indexName ++;
        } else {
          searching = false;
        }
      }

      for(var i = 0;i<this.current.choices.length;i++){
        if(added){

          this.listDialogues[this.current.nextDialogue[i].id].previousDialogue[this.current.nextDialogue[i].ii].forEach((p) => {
            if(p.id === this.indexChoice && p.ii === i-1){
              p.ii += 1;
            }
          });

        } else {

          if(this.current.choices[i].type === "object"){
            choice.text = choice.text + (indexName===0 ? "" : " "+indexName);
            this.current.choices.splice(i, 0, choice);
            this.current.nextDialogue.splice(i, 0, nextDialogue);
            this.current.outputsLoc.splice(i,0, output);
            added = true;
            i = this.current.choices.length;
          }

        }
      }

      if(!added){
        choice.text = choice.text + (indexName===0 ? "" : " "+indexName);
        this.current.choices.push(choice);
        this.current.nextDialogue.push(nextDialogue);
        this.current.outputsLoc.push(output);
      }
    },
    addObject(){
      var searching = true;
      var indexName = 0;
      var object = JSON.parse(JSON.stringify(baseObject));
      var nextDialogue = { id: -1, ii: 0 };
      var output = { x: 0, y: 0 };

      while(searching){
        var list = this.current.choices.filter((c) => (c.text === baseObject.text && indexName === 0) || (c.text === baseObject.text + " "+ indexName));
        if(list.length>0){
          indexName ++;
        } else {
          searching = false;
        }
      }

      object.text = object.text + (indexName===0 ? "" : " "+indexName);
      this.current.choices.push(object);
      this.current.nextDialogue.push(nextDialogue);
      this.current.outputsLoc.push(output);
    },
    deleteChoice(index){
      if(this.current.choices[index].type === "choice" && this.current.choices.filter((c) => c.type === "choice").length <=1) return;

      if(this.current.nextDialogue[index].id !== -1){

        this.listDialogues[this.current.nextDialogue[index].id].previousDialogue[this.current.nextDialogue[index].ii].forEach((p) => {
          if(p.id === this.indexChoice && p.ii === index){
            p.ii = 0;
            p.id = -1;
          }
        });

      }
      for(var i = index+1; i<this.current.nextDialogue.length; i++){
        if(this.current.nextDialogue[i].id !== -1){

          this.listDialogues[this.current.nextDialogue[i].id].previousDialogue[this.current.nextDialogue[i].ii].forEach((p) => {
            if(p.id === this.indexChoice && p.ii === i){
              p.ii -= 1;
            }
          });

        }
      }
      this.current.choices.splice(index, 1);
      this.current.nextDialogue.splice(index, 1);
      this.current.outputsLoc.splice(index, 1);
    },
  },

  props:["current", "assets", "listDialogues", "indexChoice"],
}
</script>

<style scoped>

</style>