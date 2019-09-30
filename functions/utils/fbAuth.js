const { admin, db } = require('./firebaseConfig')

exports.auth = (req,res,next) => {
    console.log("Checking Authorization")
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    } else {
        return res.status(403).json({ error : 'Unauthorized'});
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        console.log("loggedIn")
        return db.doc(`users/${req.user.uid}`).get()
    })
    .then((doc) =>{
        req.user.info = doc.data()
        return next()
    })
    .catch(err => {
        console.error('Error while verifying token', err);
        return res.status(403).json(err);
    })
}