const { firebaseConfig } = require("./key");
const admin = require("firebase-admin");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);
admin.initializeApp();
let db = admin.firestore();
module.exports = {
  admin,
  firebase,
  db,
  firebaseConfig
};
