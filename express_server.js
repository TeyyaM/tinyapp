const morgan = require('morgan');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = 8080; // default port 8080

const generateRandomString = () => {
  let string = "";
  let alphabet = "abcdefghijklmnopqrstuvwxyz";
  while (string.length < 6) {
    let num = Math.floor(Math.random() * 36);
    if (num <= 9) {
      string += num;
    } else {
      num -= 10;
      string += alphabet.charAt(num);
    }
  }
  return string;
};
// Makes sure the string isn't already a key in the specified database
const validRandom = (database) => {
  let string = generateRandomString();
  if (string in database) {
    while (string in database) {
      string = generateRandomString();
    }
  }
  return string;
}

// Objects! 

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Home page

app.get("/", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("Hello!", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

// For Registering!
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render('register', templateVars);
});

app.post("/register", (req, res) => {
  let newId = validRandom(users);
  users[newId] = {
    id: newId,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', newId);
  res.redirect("/urls");
});

// For Logins! WILL NEED TO EDIT
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

// For Logouts!
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// Adds new shortURL:longURL key:value pair and redirects
app.post("/urls", (req, res) => {
  let shortURL = validRandom(urlDatabase);
  urlDatabase[shortURL] = `http://${req.body.longURL}`;
  res.redirect(`/urls/${shortURL}`);
});
// Deletes a shortURL:longURL and redirects
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect("/urls");
});
// Updates a shortURL:longURL and redirects
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const newLongURL = req.body.newLongURL
  urlDatabase[shortURL] = newLongURL;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render('urls_new', templateVars);
});

app.get("/urls.json", (req, res) => {
  res.render(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
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