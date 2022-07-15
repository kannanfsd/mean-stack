const express = require('express');

const Post = require('../model/post');

const router = express.Router();

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully.',
      postId: createdPost._id
    });
  });

})

router.get('',(req, res, next)=> {
  Post.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'Post fetched successfully.',
      posts: documents
    });
  });
  // const posts = [
  //   {id: 'fdfd12145', title: 'First post', content: 'This is coming from server'},
  //   {id: 'fdfd12146', title: 'Second post', content: 'This is coming from server'},
  //   {id: 'fdfd12147', title: 'Third post', content: 'This is coming from server'}
  // ];
  // console.log('First Middleware');
  // next();
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!'
      })
    }
  })
})

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(
    (result) => {
      console.log(result);
      res.status(200).json({
        message: 'Post deleted!'
      });
    });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Update successful!'
    });
  });
});

module.exports = router;
