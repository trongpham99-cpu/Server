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
        // if(!username || !password){
        //     throw createError.BadRequest();
        // }

        const isExits = await userModel.findOne({
            username: username
        })
        
        if(isExits){
            throw createError.Conflict(`${username} is ready been registered`);
        }

        const isCreate = await userModel.create({
            username: username,
            password: password
        })

        return res.json({
            status: 200,
            elements: isCreate
        })
    } catch (error) {
        next(error)
    }
})

module.exports = route;