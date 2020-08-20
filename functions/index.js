const functions = require('firebase-functions');
const auth = require('./util/auth');
const app = require('express')();
const {
    getAllExercises,
    getSingleExercise,
    createExerciseRecord,
    deleteExerciseRecord,
    editExerciseRecord,
} = require('./APIs/exercises')
const {
    getUserDetail,
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    updateUserDetails
} = require('./APIs/users')

// auth middleware added here also - so that only  a user can access their data
app.get('/exercises', auth, getAllExercises)
app.post('/exercises', auth, createExerciseRecord)
app.get('/exercises/:exerciseId', auth, getSingleExercise)
app.put('/exercises/:exerciseId', auth, editExerciseRecord)
app.delete('/exercises/:exerciseId', auth, deleteExerciseRecord)

// Users
app.post('/login', loginUser)
app.post('/signup', signUpUser)

// auth middleware so that only authenticated users can do the below actions
// auth in this case is a middleware sub-stack that only gets used on this post route  - rather than at application level
app.post('/user/image', auth, uploadProfilePhoto)
app.get('/user', auth, getUserDetail)
app.post('/user', auth, updateUserDetails)
exports.api = functions.https.onRequest(app)