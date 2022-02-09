const express = require('express');
const route = express.Router();
const userModel = require('../models/user.model');
const createError = require('http-errors');
const { userValidate } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken } = require('../helpers/jwt_service');

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
            password,
            role: "user"
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

        const { error } = userValidate(req.body);

        if(error){
            throw createError(error.details[0].message)
        }

        const user = await userModel.findOne({username});
        if(!user){
            throw createError.NotFound('User not registered!')
        }

        const isValid = await user.isCheckPassword(password)

        if(!isValid){
            throw createError.Unauthorized();
        }
        // res.send(user)
        const accessToken = await signAccessToken(user._id);
        res.json({
            accessToken
        })
    } catch (error) {
        next(error)
    }
})

route.get('/lists', verifyAccessToken , async (req, res, next) => {
    try {
        const user = await userModel.findById(req.payload.userId)

        if(user.role !== 'admin'){
            throw createError.Forbidden();
        }
          
        const userList = await userModel.find();
        res.json({
            userList
        })
    } catch (error) {
        next(error);
    }
})

route.get('/profile', verifyAccessToken, async (req, res, next) => {
    try {
        const user = await userModel.findById(req.payload.userId)
        res.send(user)
    } catch (error) {
        next(error)
    }
})

module.exports = route;