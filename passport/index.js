const passport = require('passport');
const local = require('./local');
const User = require('../models/user');
// serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고,
// deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것입니다.
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => { // 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회해서 req.user에 저장
    User.findOne({
      where: { id }
    })
    .then(user => done(null, user))
    .catch(err => done(err));
  });

  local();
};
