module.exports = function (User) {
    User.afterRemote('create', function (ctx, user, next) {
        ctx.result.verify({
            type: 'email',
            from: '237625092@qq.com',
            to: user.email,
            redirect: 'http://localhost:3000/login'
        }, next);
    });
};
