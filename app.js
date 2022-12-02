const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const nunjucks = require('nunjucks');
const { sequelize, User } = require('./models');

const passport = require('passport');
const passportConfig = require('./passport');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const postRouter = require('./routes/post');
const indexRouter = require('./routes');


const Post = require('./models/post');

dotenv.config();
passportConfig();  //패스포트 설정

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(err => console.error(err));

app.use(
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.SECRET),
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/post', postRouter);
app.use('/', indexRouter);

app.use(async (req, res, next) => {
    try {
        const posts = await Post.findAll({ //모든 게시글 정보를 불러옴(유저의 닉네임 정보도 포함)
            include: [
                {
                    model: User,
                    attributes: ['nickname']
                },
            ]
        });
        if(req?.user?.id){
            const user = await User.findOne({ //현재 로그인한 유저의 정보를 불러옴(그 유저가 작성한 게시글의 제목과 번호 포함)
                include: [
                    {
                        model: Post,
                        attributes: ['title', 'id']
                    },
                ],
                where: {id: req?.user?.id}
            }); 
            res.locals.myPosts = user.Posts.map(v => [v?.title, v?.id]);
        }
        
        res.locals.posts = posts.map(v => [v?.title, v?.id, v?.User?.nickname]);
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('index');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
