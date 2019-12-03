const {
  firebase,
  db,
  firebaseConfig,
  admin
} = require("../utils/firebaseConfig");
exports.getAllObat = (req, res) => {
  db.collection("obat")
    .get()
    .then(snapshot => {
      result = [];
      snapshot.forEach(doc => {
        result.push(doc.data());
      });
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: err.code });
    });
};
exports.getObat = (req, res) => {
  db.collection("obat")
    .where("idObat", "==", req.params.idObat)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        return res.status(404).json({ error: "not found" });
      }
      result = [];
      snapshot.forEach(doc => {
        result.push(doc.data());
      });
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: err.code });
    });
};
