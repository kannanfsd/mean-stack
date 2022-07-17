const express = require('express');
const multer = require('multer');
const { create } = require('../model/post');

const Post = require('../model/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() +'.'+ext)
  }
})

router.post('', multer(storage).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+'/images/'+req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully.',
      post: {
        ...createdPost,
        id: createdPost._id
      }
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

router.put("/:id",multer(storage).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol+"://"+req.get('host');
    imagePath = url+'/images'+req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Update successful!'
    });
  });
});

module.exports = router;
