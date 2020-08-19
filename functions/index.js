const functions = require('firebase-functions');
const app = require('express')();
const {
    getAllExercises,
    createExerciseRecord,
    editExerciseRecord,
    deleteExerciseRecord,
} = require('./APIs/exercises')
const {
    loginUser,
    signUpUser
} = require('./APIs/users')


app.get('/exercises', getAllExercises);
app.post('/exercises',  createExerciseRecord)
app.put('/exercises/:exerciseId',  editExerciseRecord)
app.delete('/exercises/:exerciseId',  deleteExerciseRecord)

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
exports.api = functions.https.onRequest(app);