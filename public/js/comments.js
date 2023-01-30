const imageComments = {
    data() {
        return {
            username: null,
            comment: null,
            comments: [],
            
        };
    },

    props: ["imgId"],

    methods: {
        uploadComment() {
            const commentData = {
                imageId: this.imgId,
                username: this.username,
                comment: this.comment,
                
            };

            fetch("/images/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commentData), 
            })
                .then((result) => result.json())
                .then((data) => {
                    
                    this.comments.unshift(data);
                });
        },
    },
    mounted() {
         
        fetch(`/images/comments/${this.imgId}`)
            .then((res) => res.json())
            .then((data) => {
                // console.log("comments in F.End", data);
                this.comments = data;
            });
    },
    template: `
        <div class="comment-component">
            <h6>Add a comment!</h6>
            <form class="comment-form"
                action="/images/comments"
                method="POST"
                @submit.prevent="uploadComment"
            >
                <label for="comment-user"></label>
                <input
                class="inputText comment-field"
                    type="text"
                    name="comment-user"
                    id="username"
                    v-model="username"
                    maxlength="35"
                    required
                    style="width: 100%"
                    placeholder="your name!"
                />

                <label for="comment-text"></label>
                <input
                class="inputText comment-field"
                    type="text"
                    name="comment-text"
                    v-model="comment"
                    required
                    style="padding-bottom: 25px"
                    placeholder="write your comment here!"
                />

                <input
                    class="comment-btn"
                    type="submit"
                    value="add comment"
                />
            </form>
            <div class="comments">
            <div class="comments-box"  v-for="comment in comments">
                
                    <p class="comments-details user-name" style="margin-bottom: 5px; font-size: 15px">
                         {{ comment.username}} :
                    </p >
                    <p class="comments-details">{{ comment.comment}}</p>
                
                
            </div>
            </div>
        </div>
    `,
};

export default imageComments;
