const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllExercises,
    createExerciseRecord,
    editExerciseRecord,
    deleteExerciseRecord,
} = require('./APIs/exercises')

app.get('/exercises', getAllExercises);
app.post('/exercises',  createExerciseRecord)
app.put('/exercises/:exerciseId',  editExerciseRecord)
app.delete('/exercises/:exerciseId',  deleteExerciseRecord)
exports.api = functions.https.onRequest(app);