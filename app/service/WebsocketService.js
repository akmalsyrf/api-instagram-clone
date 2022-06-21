const http = require("http");
const { Server } = require("socket.io");
const io = (app) => new Server(http.createServer(app), {
    // cors: {
    //     origin: process.env.CLIENT_URL,
    // },
});

module.exports = io;