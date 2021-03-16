const morgan = require('morgan');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8080; // default port 8080

const generateRandomString = () => {
  let shortURL = "";
  let alphabet = "abcdefghijklmnopqrstuvwxyz";
  while (shortURL.length < 6) {
    let num = Math.floor(Math.random() * 36);
    if (num <= 9) {
      shortURL += num;
    } else {
      num -= 10;
      shortURL += alphabet.charAt(num);
    }
  }
  return shortURL;
};

// Saved urls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Home page

app.get("/", (req, res) => {
  res.render("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// Adds new shortURL:longURL key:value pair and redirects
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = `http://${req.body.longURL}`;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  res.render('urls_new');
});

app.get("/urls.json", (req, res) => {
  res.render(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// Redirects to the longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});