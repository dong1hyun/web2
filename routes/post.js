const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

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
                }
            ],
            where: { id: req.params.id } // 페이지 넘버
        });
        const comment = await Comment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['nickname']
                }
            ],
            where: { postId: req.params.id } // 페이지 넘버
        });

        res.locals.authority = req?.user?.id == post?.User?.id; //현재 로그인 돼있는 아이디와 게시글 작성아이디가 같으면 권한이 있음
        res.locals.title = post.title; //게시글 제목
        res.locals.nickname = post.User.nickname //닉네임
        res.locals.content = post.content; //게시글 내용
        res.locals.id = post.id; //게시글 번호
        res.locals.port = 5000;
        res.locals.comments = comment.map(v => [v.comments, v.User.nickname, v.id, req?.user?.id == v.userId]);
        res.render('postContent');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update/:id', async (req, res, next) => {
    const { content } = req.body;
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
            where: { id: req.params.id }
        });

        if (result) res.redirect('/');
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/comments/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id }
        });

        if (user) {
            const comments = await user.getComments();
            res.json(comments);
        } else
            next(`There is no user with ${req.params.id}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;