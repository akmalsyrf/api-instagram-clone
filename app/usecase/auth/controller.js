const { user } = require("@models/user");

const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const { name, username, email, password } = req.body

        const userExist = await user.findOne({
            where: {
                email: email,
            },
        });
        if (userExist) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "email already used",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let createUser = await user.create({ name, username, email, password: hashedPassword }, { attributes: { exlude: ["password"] } })
        createUser = JSON.parse(JSON.stringify(createUser))
        const dataToken = {
            id: createUser.id,
            username: createUser.username,
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);

        res.status(200).json({
            status: "success",
            message: "user created",
            data: { token, user: createUser }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        });
    }
}

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(5).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            status: "error",
            message: error.details[0].message,
        });
    }
    try {
        const { email, password } = req.body

        const userExist = await user.findOne({
            where: {
                email: email,
            },
        });

        if (!userExist) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "user doesn't exist",
            });
        }

        const isValid = await bcrypt.compare(password, userExist.password);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                status: "error",
                message: "credential is invalid",
            });
        }
        const dataToken = {
            id: userExist.id,
            username: userExist.username,
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);

        res.status(200).json({
            status: "success",
            message: "user logged in",
            data: { token, user: userExist }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message,
        });
    }
}

exports.facebookLogin = async (req, res) => {
    if (req.isAuthenticated()) {
        const { id, fb_id, name, username, email, email_verified_at } = req.user
        const dataToken = {
            id, username
        };
        const token = jwt.sign(dataToken, process.env.TOKEN_API);
        res.status(200).json({
            status: "success",
            message: "Success login with facebook",
            data: { token, user: { id, fb_id, name, username, email, email_verified_at } }
        });
    } else {
        res.status(401).json({
            status: "failed",
            success: false,
            message: "Unauthorized"
        });
    }
}