const functions = require("firebase-functions");
const express = require("express");
const app = express();
const { auth } = require("./utils/fbAuth");
const cors = require("cors");
var { register } = require("./users/register");
var { login } = require("./users/login");
var { getAllObat, getObat } = require("./obat/obat");
var { addObat } = require("./admin/kelolaObat");
app.use(cors());
app.post("/register", register);
app.post("/login", login);
app.get("/obat", getAllObat);
app.get("/obat/:idObat", getObat);
//kelola obat
app.post("/admin/addObat", auth, addObat);

exports.api = functions.region("asia-east2").https.onRequest(app);
