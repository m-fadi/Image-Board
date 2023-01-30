import * as Vue from "./vue.js";
import imageComponent from "./photo.js";
// const photoComponent = {
//     data() {
//         return {
//             heading: "This is my component!",
//         };
//     },
//     template: `<h2>{{heading}}</h2>
//         <p>I hope you like my component!!!</p>`,
// };

Vue.createApp({
    data() {
        return {
            headline: "My Vue App",
            images: [],
            imageId: null,
            title: "",
            message: "",
            // cardCSS: "data-card",
            // photo: "",
            // description: "",
            // titleTemp: "",
            // descriptionTemp: "",
            // idTemp: 0,
        };
    },

    components: {
        "image-component": imageComponent,
    },

    methods: {
        uploadImage: function (e) {
            e.preventDefault();
            const myFileInput = document.querySelector("input[type='file']");
            const image = myFileInput.files[0];
            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);

            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    this.photo = result.file;
                    this.message = result.message;
                    this.title = result.title;
                    this.imageId = result.id;
                    //this.images = [...this.images, result];
                    this.images.unshift(result);
                })
                .catch((err) => console.log(err));
        },

        showImage(e) {
            console.log("e.target.id", e.target.id);
            console.log("location.pathname", location.pathname);
            history.pushState(null, "", `/image/${e.target.id}`);
            this.imageId = e.target.id;
            console.log("location.pathname", location.pathname);
        },
        closeImage() {
            console.log("CLOSE IMAGE");
            this.imageId = null;
            history.replaceState(null, "", "/");
        },
    },

    mounted() {
        fetch("/images")
            .then((res) => {
                return res.json();
            })
            .then((images) => {
                console.log(images);
                this.images = images;
            });
    },
}).mount("main");

//https://s3.amazonaws.com/:spicedling/:kitty.PNG
import * as Vue from "./vue.js";
import imageComponent from "./photo.js";
// const photoComponent = {
//     data() {
//         return {
//             heading: "This is my component!",
//         };
//     },
//     template: `<h2>{{heading}}</h2>
//         <p>I hope you like my component!!!</p>`,
// };

Vue.createApp({
    data() {
        return {
            headline: "My Vue App",
            images: [],
            imageId: null,
            title: "",
            message: "",
            // cardCSS: "data-card",
            // photo: "",
            // description: "",
            // titleTemp: "",
            // descriptionTemp: "",
            // idTemp: 0,
        };
    },

    components: {
        "image-component": imageComponent,
    },

    methods: {
        uploadImage: function (e) {
            e.preventDefault();
            const myFileInput = document.querySelector("input[type='file']");
            const image = myFileInput.files[0];
            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);

            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    this.photo = result.file;
                    this.message = result.message;
                    this.title = result.title;
                    this.imageId = result.id;
                    //this.images = [...this.images, result];
                    this.images.unshift(result);
                })
                .catch((err) => console.log(err));
        },

        showImage(e) {
            console.log("e.target.id", e.target.id);
            console.log("location.pathname", location.pathname);
             history.pushState(null, "", `/image/${e.target.id}`);
            this.imageId = e.target.id;
           console.log("location.pathname", location.pathname);
        },
        closeImage() {
            console.log("CLOSE IMAGE");
            this.imageId = null;
            history.replaceState(null, "", "/");
        },
    },

    mounted() {
        fetch("/images")
            .then((res) => {
                return res.json();
            })
            .then((images) => {
                console.log(images);
                this.images = images;
            });
    },
}).mount("main");

//https://s3.amazonaws.com/:spicedling/:kitty.PNG
