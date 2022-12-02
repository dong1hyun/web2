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
    })

module.exports = router;
