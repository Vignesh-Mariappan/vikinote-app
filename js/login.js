// @ts-nocheck
let users = JSON.parse(localStorage.getItem('users') || '[]');
var loginUsernameEl = document.querySelector('#login-username');
var loginPasswordEl = document.querySelector('#login-password');
var loginMessageEl = document.querySelector('.login-message');

function displayMessage(text) {
  loginMessageEl.textContent = text;
  loginMessageEl.style.display = 'block';

  setTimeout(() => {
    loginMessageEl.style.display = 'none';
  }, 3000);
}

function loginFormSubmit(event) {
  // event.preventDefault();

  console.log(users);

  const user = users.find((user) => loginUsernameEl.value === user.username);

  if (!user) {
    console.log('username not exists, create an account');
    displayMessage('User does not exists, create a new account');
  } else if (user.password !== loginPasswordEl.value) {
    console.log('Password entered is wrong');
    displayMessage('Please enter the correct password');
  } else {
    loginUsernameEl.textContent = '';
    loginPasswordEl.textContent = '';
    localStorage.setItem('currentUser', user.username);
    window.location.href = 'https://vignesh-mariappan.github.io/vikinote-app/index.html';
  }
}
