const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {  //  passport.authenticate('local') 미들웨어가 로컬 로그인 전략 수행
        if (user) req.login(user, loginError => res.redirect('/'));  //req.login은 serializeUser을 호출
        else next(`Login fail!`);
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
