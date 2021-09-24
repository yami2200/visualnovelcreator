export const mix_editassetpanel = {

    props: {
        assets: {required: true},
        projectProp : {required: true},
        listPages:{required: true},
    },

    methods:{
        cancel() {
            this.hide();
            this.$emit("cancel");
        },
    },

    data () {
        return {
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