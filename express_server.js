const morgan = require("morgan");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
app.set("view engine", "ejs");
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

// Checks if email is already registered and returns the account id if it is
const emailCheck = (email) => {
  for (let userkey in users) {
    if (users[userkey].email === email) {
      return userkey;
    }
  }
  return false;
};

const urlsForUser = (id) => {
  const shortURLArr = [];
  for (let shortURL in urlDatabase) {
    shortURLArr.push(shortURL);
  }
  const filteredURLs = shortURLArr.filter(shortURL => urlDatabase[shortURL].userID === id);
  return filteredURLs;
};

// Objects! 

const urlDatabase = {
  "b2xVn2": { "longURL": "http://www.lighthouselabs.ca", "userID": "userRandomID" },
  "9sm5xK": { "longURL": "http://www.google.com", "userID": "userRandomID" }
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
  const userId = req.cookies["user_id"];
  const templateVars = {
    user: users[userId],
    urls: urlDatabase,
    userURLs: urlsForUser(userId)
  };
  res.render("urls_index", templateVars);
});

// For Registering!
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "" || emailCheck(email)) {
    res.status(400).send("Invalid entry!");
  } else {
    let newId = validRandom(users);
    users[newId] = {
      id: newId,
      email: email,
      password: password
    }
    res.cookie("user_id", newId);
    res.redirect("/urls");
  }
});

// For Logins!
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = emailCheck(email)
  if (!userId || users[userId].password !== password) {
    res.status(403).send("Invalid entry! Double-check your spelling or register instead!!");
  } else {
    res.cookie("user_id", userId);
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});

// For Logouts!
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Adds new shortURL:longURL key:value pair and redirects
app.post("/urls", (req, res) => {
  let shortURL = validRandom(urlDatabase);
  urlDatabase[shortURL].longURL = `http://${req.body.longURL}`;
  res.redirect(`/urls/${shortURL}`);
});

// Deletes a shortURL:longURL and redirects
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userId) {
    delete urlDatabase[shortURL]
  }
  res.redirect("/urls");
});

// Updates a shortURL:longURL and redirects
app.post("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.newLongURL;
  if (urlDatabase[shortURL].userID === userId) {
    urlDatabase[shortURL].longURL = newLongURL;
  }
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
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
  const userId = req.cookies["user_id"];
  const userURLs = urlsForUser(userId);

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