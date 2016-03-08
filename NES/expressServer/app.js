var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret: 'mySecret', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash());


app.use(function (req, res, next) {
    var message = req.flash('message');
    res.locals.message = message.length ? message : null;
    var username = req.flash('username');
    res.locals.username = username.length ? username : null;
    next();
});
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/shopuser', require('./routes/entering'));
app.use('/users', require('./routes/users'));

app.use('/views/partials', require('./routes/partials'));
app.use('/views/app', require('./routes/app/app'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    //var err = new Error('Not Found');
    //err.status = 404;
    // next(err);
    res.redirect('/');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


module.exports = app;
