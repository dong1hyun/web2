const path = require('path');

const express = require('express');
const Comment = require('../models/comment');

const { isLoggedIn } = require('./helpers');

const router = express.Router();

router.route('/')
    .get(isLoggedIn, (req, res) => {
        res.locals.title = require('../package.json').name;
        // res.locals.userId = req.user.id;
        res.render('comment');
    })
    .post(async (req, res, next) => {
        const { comment } = req.body;
        const postId = req.params.id;

        try {
            await Comment.create({ postId, comment });
            res.redirect('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });



module.exports = router;
