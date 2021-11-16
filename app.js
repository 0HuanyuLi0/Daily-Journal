//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://huanyuli:%21vdyGh%402@cluster0.jblht.mongodb.net/dailyJournal');
}

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const PostSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model('Post', PostSchema);

const initPost1 = new Post({
  title: 'Day 1',
  content: homeStartingContent
})

Post.find({}, (err, docs) => {
  if (docs.length === 0) initPost1.save();
})


const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get('/', (req, res) => {
  res.redirect('/home')
})

app.get('/:nav', (req, res) => {
  const navTo = req.params.nav;

  if (navTo === 'home') {
    Post.find({}, (err, docs) => {
      res.render('home', {
        postTitle: `Home`,
        postContent: homeStartingContent,
        _: _,
        posts: docs
      })

    })

  }


  if (navTo === 'contact') {
    res.render('home', {
      postTitle: `Content`,
      postContent: contactContent
    })
  };

  if (navTo === 'about') {
    res.render('home', {
      postTitle: `About`,
      postContent: aboutContent
    })
  };

  if (navTo === 'compose') {
    res.render('compose');
  };

})


app.get('/posts/:postID', (req, res) => {
  const postID = req.params.postID;
  Post.findById(postID, (err, doc) => {
    res.render('home', {
      postTitle: doc.title,
      postContent: doc.content
    })
  })
})

app.get('/delete/:postID', (req, res) => {
  const postID = req.params.postID;
  Post.findByIdAndDelete(postID, (err, doc) => res.redirect('/home'))
})

app.post('/compose', (req, res) => {
  const inputPost = new Post(
    {
      title: _.startCase(_.lowerCase(req.body.postTitle)),
      content: req.body.postBody,
    }
  )
  inputPost.save(err => {
    if (!err) res.redirect('/home')
  });

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);