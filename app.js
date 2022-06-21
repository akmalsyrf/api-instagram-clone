var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const session = require("express-session");

require("module-alias/register");
require("dotenv").config();

var app = express();
const baseUrl = "/api/v1";

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'SECRET'
}));

//initialize passport using facebook strategy
require("@service/FacebookService")(app)

//websocket server
const io = require("@service/WebsocketService")(app)
const socketPort = process.env.SOCKET_PORT;
io.listen(socketPort);
console.log(`Socket io server started on port ${socketPort}`);

//socket controller
require("./app/usecase/chat/controller")(io);

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//import router
const authRouter = require("./app/usecase/auth/router");
const postRouter = require("./app/usecase/post/router");
const commentRouter = require("./app/usecase/comment/router");

//api
app.use(baseUrl, authRouter);
app.use(baseUrl, postRouter);
app.use(baseUrl, commentRouter);

//not found
app.use((_, res) => res.sendStatus(404));

module.exports = app;
