const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

//CONNECTION TO MONGO DB;
async function connectToDB(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
        console.log("connected to database");
    }catch(err){
        console.log(err);
    }
}
connectToDB();

//Article Schema
const articleSchema = {
    title: {
        type: String,
        required: [1]
    },
    content: {
        type: String,
        required: [1]
    }
};

//Article Model
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(
    async function (req, res) {
    try{
        const foundArticles = await Article.find();
        foundArticles ? res.status(200).send(foundArticles) : res.status(404).send("No articles found.")
    }catch(err){
        res.status(500).send(err);
    }
})

.post(
    async function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        try{
            await newArticle.save();
            res.status(200).send("Successfully added a new article.");
        }catch(err){
            res.status(500).send(err);
        }
    }
)

.delete(
    async function(req, res) {
        try{
            await Article.deleteMany();
            res.status(200).send("Successfully deleted all articles.");
        }catch(err){
            res.status(500).send(err);
        }
    }
);

/////////////////////////////////////////////TARGETING ARTICLES
app.route('/articles/:articleTitle')

.get(async function(req, res) {
    try{
        const foundArticles = await Article.findOne({title: req.params.articleTitle});
        foundArticles ? res.status(200).send(foundArticles) : res.status(401).send("No Articles matching that title was found.");
    }catch(err){
        res.status(500).send(err);
    };
})

.put(async function(req, res) {
    try{
        await Article.updateOne(
            {title : req.params.articleTitle},
            {title : req.body.title, content : req.body.content}
        )
        res.status(200).send("Article successfully updated.");
    }catch(err){
        res.status(500).send(err);
    }
})

.patch(async function(req, res) {
    try{
        await Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body}
        )
        res.status(200).send("Article successfully updated.");
    }catch(err){
        res.status(500).send(err)
    }
})

.delete(async function(req, res) {
    try{
        await Article.deleteOne(
            {title: req.params.articleTitle}
        );
        res.status(200).send("Article succesfully deleted.");
    }catch(err){
        res.status(500).send(err);
    }
});

app.listen(3000, function () {
    console.log("app is running...");
});
