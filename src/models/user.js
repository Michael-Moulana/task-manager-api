const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be a positive number')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.includes('password')) {
                throw new Error("password must be greater than 6 characters and not contain \'password'\ in it")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// virtual property: relation between two entities and is not stored in the db 
// first argument -> name for our virtual field ( tasks, userTasks, myTasks, ...)
// sec arg -> object. configure fields
//
userSchema.virtual('tasks', {
    ref: 'Task', // Task model
    localField: '_id', // name of field in the current model
    foreignField: 'owner' // name of field in the other model
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


// token
// methods = are accessible on the instances, sometimes called instance methods
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token: token})
    
    await user.save()

    return token
}


// login
// statics = are accessible on the model, sometimes called model methods
userSchema.statics.findByCredentials = async (email, password) => {
    // find user by email and return
    const user = await User.findOne({ email: email})
    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
}


// hash the plain text password before saving (middleware)
userSchema.pre('save', async function (next) {
    // 'this' gives us access to the individual user that is about to save
    // for convinience, defining 'user' constant and assigning 'this' to it.
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete the user tasks when the user is removed (middleware)
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

// define user model
const User = mongoose.model('User', userSchema)

module.exports = User