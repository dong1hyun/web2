const path = require('path');

const express = require('express');
const Comment = require('../models/comment');

const { isLoggedIn } = require('./helpers');

const router = express.Router();

router.post('/commenting/:id', isLoggedIn, async (req, res, next) => {
    const { comments } = req.body;

    if (!comments) return next('댓글 내용을 입력하세요.');
    const postId = req.params.id;
    try {
        await Comment.create({
            comments,
            userId: req.user.id,
            postId
        });
        res.send({
            result: 'success',
            comments,
            error: null
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update/:id/:cid', async (req, res, next) => {
    const { comments } = req.body;
    if (!comments) return next('댓글 내용을 입력하세요.');
    
    try {
        console.log("update");
        const result = await Comment.update({
            comments
        }, {
            where: { id: req.params.cid }
        });
        if (result) {
            res.send({
                result: 'success',
                comments,
                error: null
            });
        }
        else next('Not updated!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:id/:cid', async (req, res, next) => {
    try {
        const result = await Comment.destroy({
            where: { id: req.params.cid }
        });
        
        if (result) {
            res.send({
                result: 'success',
                error: null
            });
        }
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;