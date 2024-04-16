var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
require('dotenv').config();
var logger = require('morgan');

var indexRouter = require('./routes/index');
var weatherRouter = require('./routes/weather');

var app = express();

const cors = require('cors');
app.use(cors({
  origin: 'https://sunspotter-front-ro3boj72f-vincenthubers-projects.vercel.app',
  methods: ["POST", "GET"],
  credentials:true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/weather', weatherRouter);

module.exports = app;
