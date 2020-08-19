const { db } = require('../util/admin');

exports.getAllExercises = (request, response) => {
    db
        .collection('exercises')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let exercises = [];
            data.forEach((doc) => {
                exercises.push({
                    exerciseId: doc.id,
                    title: doc.data().title,
                    sets: doc.data().sets,
                    reps: doc.data().reps,
                    comments: doc.data().comments,
                    createdAt: doc.data().createdAt,
                });
            });
            return response.json(exercises);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code});
        });
};

exports.createExerciseRecord = (request, response) => {
    const sets = request.body.sets
    const reps = request.body.reps
    const comments = request.body.comments
    if ((sets && !reps) || (!sets && reps)) {
        if (!reps) return response.status(400).json({ reps: 'Must not be empty' })
        if (!sets) return response.status(400).json({ sets: 'Must not be empty' })
    }

    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }

    const newExerciseRecord = {
        title: request.body.title,
        createdAt: new Date().toISOString()
    }
    if (sets && reps) {
        newExerciseRecord['sets'] = sets
        newExerciseRecord['reps'] = reps
    }
    if (comments) {
        newExerciseRecord['comments'] = comments
    }

    db
        .collection('exercises')
        .add(newExerciseRecord)
        .then((doc)=>{
            const responseExerciseItem = newExerciseRecord;
            responseExerciseItem.id = doc.id;
            return response.json(responseExerciseItem);
        })
        .catch((err) => {
            response.status(500).json({ error: 'Something went wrong' });
            console.error(err);
        });
};