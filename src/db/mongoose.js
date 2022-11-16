const mongoose = require('mongoose')

// MongoDB/bin/mongod --dbpath=MongoDB-data
// connectiong to db
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
})









// // creating new user
// const user1 = new User({
//     name: 'Lastuser',
//     email: 'test11@gmail.com',
//     age: 33,
//     password: 'p1234kfj934r'

// })
// // inserting a new user to db
// user1.save().then(() => {
//     console.log(user1);
// }).catch((error) => {
//     console.log('error !', error);
// })



// const task1 = new Task({
//     description: '  noding',
// })

// task1.save().then(() => {
//     console.log(task1)
// }).catch((error) => {
//     console.log('error !', error)
// })