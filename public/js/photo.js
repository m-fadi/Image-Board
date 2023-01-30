import comments from "./comments.js";
const imageComponent = {
    data() {
        return {
            image: null,
        };
    },
    props: ["imgId"],
    mounted() {
        console.log(this.imgId)
        fetch(`/images/${this.imgId}`, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((result) => result.json())
            .then((data) => {
                console.log("img in component", data);

                this.image = data;
            });
    },
    components: {
        comments: comments,
    },
    methods: {
        closeImageTrigger() {
            console.log("closeImageTriggered!");
            this.$emit("close");
        },
    },

    template: `
        <div class="image-component" v-if="image">
       
            <div class="imgDetails">
            
                <h3 class="imgTitle">{{ image.title }}</h3>
                <p class="close-component" @click="closeImageTrigger" style="cursor: pointer">  </p> 
                <img class="pup-img"
                    :src="image.url"
                    :id="image.imgId"
                    
                   
                />
                <p class="img-component-description">{{ image.description }}</p>

                
                 <p class="img-component-username">Uploaded by: {{ image.username }}  -  on: {{ image.created_at }} </p>
            </div>
               
                
                    <comments  v-bind:img-id="imgId"></comments>
                
            
        </div>
    `,
    
};

export default imageComponent;
