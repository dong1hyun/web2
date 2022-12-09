const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.findAll({
                attributes: ['id']
            });

            res.locals.title = require('../package.json').name;
            res.locals.port = process.env.PORT;
            res.locals.users = users.map(v => v.id);
            res.locals.curUser = req?.user?.id;
            res.locals.isLoggedIn = !req?.user?.id;
            res.render('user');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        const { id, password, name, nickname } = req.body;

        if (!id) return next('아이디를 입력하세요.');
        if (!password) return next('비밀번호를 입력하세요.');

        const user = await User.findOne({ where: { id } });
        if (user) {
            next('이미 등록된 사용자 아이디입니다.');
            return;
        }

        try {
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                id,
                password: hash,
                name,
                nickname
            });

            res.send({
                result: 'success',
                id,
                name,
                nickname,
                error: null
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.post('/update', async (req, res, next) => {
    const {password, nickname} = req.body;

    if (!password) return next('비밀번호를 입력하세요.');

    try {
        const hash = await bcrypt.hash(password, 12);

        const result = await User.update({
            password: hash,
            nickname
        }, {
            where: { id: req.body.id }
        });

        if (result) {
            res.send({
                result: 'success',
                id,
                nickname,
                error: null
            });
        }
        else next('Not updated!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.id }
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

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'name', 'nickname']
        });
        res.json(user);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
