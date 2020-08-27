const admin = require("firebase-admin");
// const serviceAccount = require("../../firebase-admin-key");

// fixed - needed to include the service account for the app + correct credentials
// https://console.firebase.google.com/project/exercise-app-2fbaf/settings/serviceaccounts/adminsdk

admin.initializeApp()
    // credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://exercise-app-2fbaf.firebaseio.com"


const db = admin.firestore();

module.exports = { admin, db };