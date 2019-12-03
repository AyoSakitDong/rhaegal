const {
  firebase,
  db,
  firebaseConfig,
  admin
} = require("../utils/firebaseConfig");
const { isEmail, isEmpty } = require("../utils/validator");

exports.addObat = (req, res) => {
  //INSERT A FUNCTION THAT SOMEHOW CHECK THE USER IS ADMIN OR NOT
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });
  let obatRef = db.collection("obat").doc();
  let data = { idObat: obatRef.id };
  let errors = {};
  let imageToBeUploaded = {};
  let imageFileName;
  busboy.on("field", (fieldname, val) => {
    switch (fieldname.trim()) {
      case "namaObat":
        isEmpty(val)
          ? (errors.namaObat = "Must not be empty")
          : (data.namaObat = val);
        break;
      case "deskripsi":
        isEmpty(val)
          ? (errors.deskripsi = "Must not be empty")
          : (data.deskripsi = val);
        break;
      case "harga":
        isEmpty(val)
          ? (errors.harga = "Must not be empty")
          : (data.harga = val);
        break;
    }
  });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = data.idObat + "." + imageExtension;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        data.img = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return obatRef.set(data);
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};
