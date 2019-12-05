const { firebase, db } = require("../utils/firebaseConfig");
const { validateSignupData } = require("../utils/validator");
exports.register = (req, res) => {
  let newUser = {
    nama: req.body.nama,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };
  const { errors, valid } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(async data => {
      token = data.user.getIdToken();
      const { password, confirmPassword, ...restUser } = newUser;
      userCredentials = { ...restUser, img: "noimg.jpg" };
      console.log(userCredentials);
      await db.doc(`/users/${data.user.uid}`).set(userCredentials);
      return token;
    })
    .then(token => {
      return res.status(201).json({
        token,
        nama: newUser.nama,
        email: newUser.email,
        img: "noimg.jpg"
      });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};
