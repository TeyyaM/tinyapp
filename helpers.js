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

module.exports = {
  getUserByEmail,
  urlsForUser
};