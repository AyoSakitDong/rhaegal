const { firebase, db } = require("../utils/firebaseConfig");
const { validateLoginData } = require("../utils/validator");
exports.login = (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  };
  const { errors, valid } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(async data => {
      let uid = data.user.uid;
      let token = await data.user.getIdToken();
      let doc = await db.doc(`users/${uid}`).get();
      let userData;
      if (doc.exists) {
        userData = doc.data();
      }
      console.log(token);
      let result = {
        token,
        ...userData
      };
      return res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        return res.status(403).json({ error: "Wrong credetials" });
      } else if (err.code === "auth/invalid-email") {
        return res.status(400).json({ email: "Must be a valid email" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};
