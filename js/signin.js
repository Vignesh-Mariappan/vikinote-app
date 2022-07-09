// @ts-nocheck
var signInUsernameEl = document.querySelector('#signin-username');
var signInPasswordEl = document.querySelector('#signin-password');
var signInConfirmPasswordEl = document.querySelector('#signin-confirm-password');
var signInMessage = document.querySelector('.signin-message');
var signInSuccessMessage = document.querySelector('.signin-success-message');
// @ts-ignore
var users = JSON.parse(localStorage.getItem('users') || '[]');

function displayMessage(text) {
  signInMessage.textContent = text;
  signInMessage.style.display = 'block';

  setTimeout(() => {
    signInMessage.style.display = 'none';
  }, 3000);
}

function signinFormSubmit() {
  let user = users.find((user) => user.username === signInUsernameEl.value);

  if (user) {
    displayMessage('Username is already taken');
  } else if (signInUsernameEl.value.length < 6) {
    displayMessage('Username should be minimum 6 chars');
  } else if (signInPasswordEl.value.length < 8) {
    displayMessage('Password should be minimum 8 chars');
  } else if (signInPasswordEl.value !== signInConfirmPasswordEl.value) {
    displayMessage('Password doesnot match');
  } else {
    // create a new user object
    let newUser = {
      username: signInUsernameEl.value,
      password: signInPasswordEl.value,
    };

    // set it to the local storage
    users = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(users));

    signInSuccessMessage.textContent = 'User successfully created';
    signInSuccessMessage.style.display = 'block';

    // Show the success message for 2 seconds
    setTimeout(() => {
      // clear the input fields
      signInUsernameEl.value = '';
      signInPasswordEl.value = '';
      signInConfirmPasswordEl.value = '';
      signInSuccessMessage.style.display = 'none';
      // redirect it to the login page
      window.location.href = '/login.html';
    }, 3000);
  }
}
