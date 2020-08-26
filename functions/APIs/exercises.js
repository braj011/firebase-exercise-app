const { db } = require('../util/admin');

exports.getAllExercises = (request, response) => {
    db
        .collection('exercises')
        .where('username', '==', request.user.username)
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let exercises = [];
            data.forEach((doc) => {
                exercises.push({
                    username: doc.data().username,
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

exports.getSingleExercise = (request, response) => {
    db
        .doc(`/exercise/${request.params.exerciseId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json(
                    {
                        error: 'Exercise not found'
                    });
            }
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"UnAuthorized"})
            }
            let exerciseData = doc.data();
            exerciseData.todoId = doc.id;
            return response.json(exerciseData);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: error.code });
        });
};


exports.createExerciseRecord = (request, response) => {
    const sets = request.body.sets
    const reps = request.body.reps
    const comments = request.body.comments
    if ((sets && !reps) || (!sets && reps)) {
        if (!reps) return response.status(400).json({ reps: 'Must not be empty if sets is present' })
        if (!sets) return response.status(400).json({ sets: 'Must not be empty if reps is present' })
    }

    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }

    const newExerciseRecord = {
        title: request.body.title,
        createdAt: new Date().toISOString(),
        username: request.user.username
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

//todo: want to be able to come back and add sets & reps to the document? (if they don't exist on the document already)
exports.editExerciseRecord = ( request, response ) => {
    if(request.body.exerciseId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('exercises').doc(`${request.params.exerciseId}`);
    //the below updates the whole exercise item with whatever comes in with the request
    document.update(request.body)
        .then(()=> {
            response.json({message: 'Updated successfully'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({
                error: err.code
            });
        });
};


exports.deleteExerciseRecord = (request, response) => {
    const document = db.doc(`/exercise/${request.params.exerciseId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Exercise record not found' })
            }
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"UnAuthorized"})
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successful' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};