const express = require("express");
const ejs = require("ejs");
const ShortUrl = require("./models/shortUrl.model");
const mongoose = require("mongoose");
require("dotenv").config();

var port = process.env.PORT || 3000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB connection established successfully");
});

//create instance of express app
var app = express();

app.use(express.json());

//to serve html and js in ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	ShortUrl.find()
		.then((urls) => {
			res.render("index.ejs", { urls });
		})
		.catch((err) => res.json(err));
});

app.post("/shortURL", (req, res) => {
	// console.log(req.body);
	const URLFull = String(req.body.fullURL);
	const newShortURL = new ShortUrl({ URLFull });
	newShortURL
		.save()
		.then(() => res.redirect("/"))
		.catch((err) => res.json(err));
});

app.get("/:URLShort", (req, res) => {
	ShortUrl.findOne({ URLShort: req.params.URLShort })
		.then((url) => {
			url.visits = url.visits + 1;
			url.save()
				.then(() => {
					res.redirect(url.URLFull);
				})
				.catch((err) => res.json(err));
		})
		.catch((err) => res.json(err));
});

app.use(function (req, res, next) {
	res.status(404).render("404error.ejs");
});

app.listen(port, () => console.log(`listening to PORT ${port}...`));
