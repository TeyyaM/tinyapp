// Checks if email is already registered and returns the account id if it is
const getUserByEmail = (email, userDatabase) => {
  const users = userDatabase;
  for (let userkey in users) {
    if (users[userkey].email === email) {
      return userkey;
    }
  }
  return undefined;
};

const urlsForUser = (id, urlDatabase) => {
  const shortURLArr = [];
  for (let shortURL in urlDatabase) {
    shortURLArr.push(shortURL);
  }
  const filteredURLs = shortURLArr.filter(shortURL => urlDatabase[shortURL].userID === id);
  return filteredURLs;
};

// Makes sure the string isn't already a key in the specified database
const validRandom = (database) => {
  // generates a random string that might already be in use
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
  // Makes sure string isn't in use
  let string = generateRandomString();
  if (string in database) {
    while (string in database) {
      string = generateRandomString();
    }
  }
  return string;
};

module.exports = {
  getUserByEmail,
  urlsForUser,
  validRandom
};