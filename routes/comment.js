const path = require('path');

const express = require('express');
const Comment = require('../models/comment');

const { isLoggedIn } = require('./helpers');

const router = express.Router();

router.post('/commenting/:id', isLoggedIn, async (req, res, next) => {
    const { comments } = req.body;
    const postId = req.params.id;
    try {
        await Comment.create({
            comments,
            userId: req.user.id,
            postId
        });
        res.redirect(`/post/${postId}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update/:id', async (req, res, next) => {
    const { comments } = req.body;
    try {
        const result = await Post.update({
            content
        }, {
            where: { id: req.params.id }
        });
        if (result) res.redirect('/');
        else next('Not updated!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const result = await Post.destroy({
            where: { id: comment }
        });

        if (result) res.redirect('/');
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;
