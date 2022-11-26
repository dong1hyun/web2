const express = require('express');
const Post = require('../models/post');
const { isLoggedIn } = require('./helpers');

const router = express.Router();

router.get('/', isLoggedIn, (req, res, next) => {
    res.render('post');
});

router.post('/posting', async (req, res, next) => {
    const { title, content } = req.body;

    try {
        await Post.create({
            title,
            content,
            userId: req.user.id
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.get('/myPosts/:id', async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: {id: req.params.id}
        });
        console.log(post);
        res.json(post.content);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;