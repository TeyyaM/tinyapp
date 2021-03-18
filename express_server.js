const morgan = require("morgan");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
// Our helper.js functions
const {
  getUserByEmail,
  urlsForUser,
  validRandom
} = require("./helpers");

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2", "key3", "key4", "key5"],
  maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
}))

const PORT = 8080; // default port 8080

// Objects! 

const urlDatabase = {
  "b2xVn2": { "longURL": "http://www.lighthouselabs.ca", "userID": "userRandomID" },
  "9sm5xK": { "longURL": "http://www.google.com", "userID": "userRandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$3EBiIr7hoUO93a/Sl73QAeJKvIaNHm9waACOcxHf956xr6yfXV1EG"
    // password: "purple"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$A9TJqq7iEy31koWXRVXrh.3W2YZdc8CCWHcgKyqK4/KTzulQhlSEi"
    // password: "dish"
  }
};

// Home page redirects

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const templateVars = {
    user: users[userId],
    urls: urlDatabase,
    userURLs: urlsForUser(userId, urlDatabase)
  };
  res.render("urls_index", templateVars);
});

// For Registering!
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === "" || password === "" || getUserByEmail(email, users)) {
    res.status(400).send("Invalid entry!");
  } else {
    let newId = validRandom(users);
    users[newId] = {
      id: newId,
      email: email,
      password: hashedPassword
    }
    req.session.user_id = newId;
    res.redirect("/urls");
  }
});

// For Logins!
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = getUserByEmail(email, users);
  if (!userId || !bcrypt.compareSync(password, users[userId].password)) {
    res.status(403).send("Invalid entry! Double-check your spelling or register instead!!");
  } else {
    req.session.user_id = userId;
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

// For Logouts!
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Adds new shortURL:longURL key:value pair and redirects
app.post("/urls", (req, res) => {
  const shortURL = validRandom(urlDatabase);
  urlDatabase[shortURL] = {
    longURL: `http://${req.body.longURL}`,
    userID: req.session.user_id
  }
  res.redirect(`/urls/${shortURL}`);
});

// Deletes a shortURL:longURL and redirects
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userId) {
    delete urlDatabase[shortURL]
  }
  res.redirect("/urls");
});

// Updates a shortURL:longURL and redirects
app.post("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.newLongURL;
  if (urlDatabase[shortURL].userID === userId) {
    urlDatabase[shortURL].longURL = newLongURL;
  }
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (!templateVars.user) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.render(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.user_id;
  const userURLs = urlsForUser(userId, urlDatabase);
  const templateVars = {
    user: users[userId],
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    belongsToUser: userURLs.includes(shortURL)
  };
  res.render("urls_show", templateVars);

});

// Redirects to the longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.url.slice(3);
  const longURL = urlDatabase[shortURL].longURL
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.render("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});