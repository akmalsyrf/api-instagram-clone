const { user, chat } = require("@models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

let connectedUser = {};
const socketIo = (io) => {
    // create middlewares before connection event
    // to prevent client access socket server without token
    io.use((socket, next) => {
        if (socket.handshake.headers && socket.handshake.headers.token) {
            const verified = jwt.verify(socket.handshake.headers.token, process.env.TOKEN_API);
            if (verified) {
                next();
            } else {
                next(new Error("Not Authorized"));
            }
        } else {
            next(new Error("Not Authorized"));
        }
    });

    io.on("connection", async (socket) => {
        console.log("client connect: ", socket.id);

        const userId = socket.handshake.query.id;
        connectedUser[userId] = socket.id;

        socket.on("load contact", async () => {
            try {
                let contacts = await user.findAll({
                    include: [
                        { model: chat, as: "recipientMessage", attributes: { exclude: ["id_recipient"] } },
                        { model: chat, as: "senderMessage", attributes: { exclude: ["id_sender"] } }
                    ],
                    attributes: { exclude: ["password"] }
                });
                contacts = JSON.parse(JSON.stringify(contacts));

                socket.emit("contacts", contacts);
            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        })

        socket.on("load messages", async (payload) => {
            try {
                const token = socket.handshake.auth.token;

                const tokenKey = process.env.TOKEN_API;
                const verified = jwt.verify(token, tokenKey);

                const id_recipient = payload; // catch recipient id sent from client
                const id_sender = verified.id; // id user

                let messages = await chat.findAll({
                    where: {
                        id_sender: { [Op.or]: [id_sender, id_recipient] },
                        id_recipient: { [Op.or]: [id_sender, id_recipient] }
                    },
                    include: [
                        { model: user, as: "recipient", attributes: { exclude: ["password"] } },
                        { model: user, as: "sender", attributes: { exclude: ["password"] } }
                    ],
                    order: [["createdAt", "ASC"]],
                    attributes: { exclude: ["id_sender", "id_recipient"] }
                });
                messages = JSON.parse(JSON.stringify(messages));

                socket.emit("messages", messages);
            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        })

        socket.on("send message", async (payload) => {
            try {
                const token = socket.handshake.auth.token;

                const tokenKey = process.env.TOKEN_API;
                const verified = jwt.verify(token, tokenKey);

                const id_sender = verified.id; //id user
                const { message, id_recipient } = payload; // catch recipient id and message sent from client

                await chat.create({
                    message,
                    id_recipient,
                    id_sender,
                });

                // emit to just sender and recipient default rooms by their socket id
                io.to(socket.id).to(connectedUser[id_recipient]).emit("new message", id_recipient);
            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        })
        socket.on("disconnect", () => {
            console.log("client disconnected", socket.id);
            delete connectedUser[userId];
        })
    })
}

module.exports = socketIo;