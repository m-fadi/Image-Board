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
            showComponent: false,

            // cardCSS: "data-card",
            photo: "",
            description: "",
            titleTemp: "",
            // descriptionTemp: "",
            // idTemp: 0,
        };
    },

    components: {
        "image-component": imageComponent,
    },

    methods: {
        uploadImage: function (e) {
            const myFileInput = document.querySelector("input[type='file']");
            console.log(myFileInput.files);
            if (!myFileInput.files[0]) {
                this.message = "You must first select an image!";
                return;
            }
            e.preventDefault();

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
                    console.log("results in app", result);
                    // if (result.message) {
                    //     this.message = result.message;
                    // }
                    if (result.success) {
                        console.log("result in client:", result.data);
                        this.images.unshift(result.data);
                    }
                    //this.images.unshift(result);
                })
                .catch((err) => console.log(err));
        },

        showImage(e) {
            history.pushState({}, "", `/img/${e.target.id}`);
            this.imageId = e.target.id;
            this.showComponent = true;
            // console.log("path of img in showImg()", location.pathname)
            // console.log("state in showImg()", history.state);
        },
        closeImage() {
            this.showComponent = false;
            this.imageId = null;
            history.replaceState(null, "", "/");
        },

        loadApp() {
            fetch("/images")
                .then((res) => {
                    return res.json();
                })
                .then((result) => {
                    this.images = result;
                });
        },

        displayImgComponent() {
            let imgPath = location.pathname;
            let pathArr = imgPath.split("/");
this.showComponent = true;
            if (
                pathArr.length == 3 &&
                pathArr[1] == "images" &&
                parseInt(pathArr[2])
            ) {
                this.showComponent = true;
            } else {
                this.showComponent = false;
            }
        },

        loadMore() {
            console.log(this.images);
            let lastImage = this.images[this.images.length - 1].id;

            fetch(`/moreImages/${lastImage}`)
                .then((result) => result.json())
                .then((result) => {
                    console.log("result get more images f end", result);
                    this.images.push(...result);
                    console.log(" images f end", this.images);
                });
        },
    },

    mounted() {
        addEventListener("popstate", (e) => {
            this.displayImgComponent();
        });
        this.displayImgComponent();

        this.loadApp();
    },
}).mount("main");

//https://s3.amazonaws.com/:spicedling/:kitty.PNG
