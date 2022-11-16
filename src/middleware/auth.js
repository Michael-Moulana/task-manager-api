const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        // verify() returns a json object with two value-> _id & iat
        // 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // the second argument: checking that this token (up above) is still a part of that tokens array. when the user logs out, we're going to delete this token. So, we want to make sure it actually exists inside of there.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error()
        }

        req.token = token
        // adding a property to store the fetched user, so the root handler will access it later on
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.'})
    }
}

module.exports = auth