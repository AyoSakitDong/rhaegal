const { firebaseConfig } = require("./key");
const admin = require("firebase-admin");
const firebase = require("firebase");
const sdkkey = require("./adminsdk.json");
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(sdkkey),
  databaseURL: "https://ayosakitdong.firebaseio.com"
});
const db = admin.firestore();
module.exports = {
  admin,
  firebase,
  db,
  firebaseConfig
};
