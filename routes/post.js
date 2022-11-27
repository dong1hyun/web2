const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');

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

router.get('/:id', async (req, res, next) => {
    try {
        const post = await Post.findOne({
            include: [
                {
                    model: User,
                        attributes: ['nickname', 'id']
                },
            ],
            where: {id: req.params.id}
        });
        res.locals.authority = req?.user?.id == post?.User?.id;
        res.locals.title = post.title;
        res.locals.nickname = post.User.nickname
        res.locals.content = post.content;
        res.locals.id = post.id;
        res.locals.port = 5000;
        res.render('postContent');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update/:id', async (req, res, next) => {
    const {content} = req.body;
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

router.get('/delete/:id', async(req, res, next) => {
    try {
        const result = await Post.destroy({
            where: { id: req.params.id }
        });

        if (result) res.redirect('/');
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;