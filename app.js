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
const socketPort = process.env.SOCKET_PORT;
const io = require("@service/WebsocketService")(app)
io.listen(socketPort);
console.log(`Socket io server listening on port ${socketPort}`);

//socket controller
require("./app/usecase/chat/controller")(io); //chat

// const proxy = require("express-http-proxy")
// app.use("/*", proxy(process.env.CLIENT_URL ?? 'http://localhost:19006'))

app.use(logger('dev'));
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:19006', credentials: true, methods: 'GET,PUT,POST,OPTIONS', allowedHeaders: 'Content-Type,Authorization' }));
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
