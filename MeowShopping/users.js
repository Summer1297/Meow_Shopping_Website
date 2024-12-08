const users = {
  admin: { userData: {}, role: 'admin' }
};

function isValid(username) {
    let isValid = true;
    isValid = !!username && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
    return isValid;
  }

function addUserData(username, userData) {
  users[username] = { 
    userData, 
    role: 'user' 
  };
}

function getUserData(username) {
  return users[username];
}

export default { 
    isValid,
    addUserData, 
    getUserData 
};