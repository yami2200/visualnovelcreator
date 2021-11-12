import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                text: "#343434",
                selectionComp: "#000000",
                background : "#FFFFFF"
            },
            dark: {
                text: "#BFBFBF",
                selectionComp: "#FFFFFF",
                background : "#1E1E1E"
            },
        },
    },
});
