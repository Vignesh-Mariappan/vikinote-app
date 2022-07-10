// @ts-nocheck
// Get the users form Local storage
let users = JSON.parse(localStorage.getItem('users') || '[]');

// DOM elements
var loginUsernameEl = document.querySelector('#login-username');
var loginPasswordEl = document.querySelector('#login-password');
var loginMessageEl = document.querySelector('.login-message');

/**
 * @author Vignesh
 * @function displayMessage
 * @description this function is used to display the error message in the login form for three seconds and it disappears
 * @param {string} text - text to be displayed in the error message
 * @returns none
 */
function displayMessage(text) {
  loginMessageEl.textContent = text;
  loginMessageEl.style.display = 'block';

  setTimeout(() => {
    loginMessageEl.style.display = 'none';
  }, 3000);
}

/**
 * @author Vignesh
 * @function loginFormSubmit
 * @description When the user submits the login form, the following method will check the credentials and login to the App, if the entered details are wrong, error message will be shown to the user
 * @param {object} event
 * @returns none
 */
function loginFormSubmit(event) {
  // Find the user from the users array
  const user = users.find((user) => loginUsernameEl.value === user.username);

  // if there is no user in the users array, display no user found error
  if (!user) {
    displayMessage('User does not exists, create a new account');
  } else if (user.password !== loginPasswordEl.value) {
    // if there is an user in the users array, but password entered is wrong, display the entered password wrong error
    displayMessage('Please enter the correct password');
  } else {
    // if the user enters the correct credentials, then clear the text field inputs
    loginUsernameEl.textContent = '';
    loginPasswordEl.textContent = '';
    // set the currentUser in the local storage to the username
    localStorage.setItem('currentUser', user.username);
    // redirect the app to the home page of the application
    // window.location.href = '/index.html';
    window.location.href = 'https://vignesh-mariappan.github.io/vikinote-app/index.html';
  }
}
