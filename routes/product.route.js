const express = require('express');
const route = express.Router();
const createError = require('http-errors');
const { signAccessToken, verifyAccessToken } = require('../helpers/jwt_service');

route.get('/lists', async (req, res, next) => {
    try {
        const products = [
            {
                id: 0,
                name: "Điện thoại Iphone 13 Pro Max"
            },
            {
                id: 1,
                name: "Điện thoại Iphone 12 Pro Max"
            },
            {
                id: 2,
                name: "Điện thoại Samsung A8"
            }
        ]
        res.json({
            products
        })
    } catch (error) {
        next(error)
    }
})

module.exports = route;
