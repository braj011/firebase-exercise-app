const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllExercises,
    createExerciseRecord,
} = require('./APIs/exercises')

app.get('/exercises', getAllExercises);
app.post('/exercises',  createExerciseRecord)
exports.api = functions.https.onRequest(app);