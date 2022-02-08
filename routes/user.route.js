const express = require('express');
const route = express.Router();
const userModel = require('../models/user.model')
const createError = require('http-errors')
const { userValidate } = require('../helpers/validation')

route.post('/register', async (req, res, next)=>{
    try {
        const { username, password } = req.body;
        const { error } = userValidate(req.body);

        if(error){
            throw createError(error.details[0].message)
        }

        const isExits = await userModel.findOne({
            username: username
        })
        
        if(isExits){
            throw createError.Conflict(`${username} is ready been registered`);
        }

        const user = new userModel({
            username,
            password
        })

        const saveUser = await user.save();

        return res.json({
            status: 200,
            elements: saveUser
        })
    } catch (error) {
        next(error)
    }
})

route.post('/login', async (req, res, next)=>{
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({username});
        if(!user){
            throw createError.NotFound('User not registered!')
        }

        const isValid = await user.isCheckPassword(password)

        if(!isValid){
            throw createError.Unauthorized();
        }
        res.send(user)
    } catch (error) {
        next(error)
    }
})

module.exports = route;