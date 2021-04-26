export const mix_editassetpanel = {

    props: {
        bus: {required: true},
        assets: {required: true},
        projectProp : {required: true},
        listPages:{required: true},
    },

    methods:{
        hide() {
            this.dialog = false;
        },
        cancel() {
            this.hide();
            this.$emit("cancel");
        },
    },

    data () {
        return {
            dialog: false,
            type: "",
            editionMode : false,
            indexEdition: 0,
            previousName: "",
        };
    },

    mounted() {
        this.bus.$on('show'+this.type, (data) => {
            this.editionMode = data.type;
            this.indexEdition = data.index;
            this.show();
        });
        this.bus.$on('hide'+this.type, this.hide);
    },
}