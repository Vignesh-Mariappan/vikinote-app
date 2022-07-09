// @ts-nocheck
// Download PDF settings
window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;

// DOM Elements
var overlayEl = document.querySelector('.overlay');
var notesUser = document.querySelector('.notes-user');

var notebookListEl = document.querySelector('.notes-notebook-list');
var newNbIconEl = document.querySelector('.fa-plus');
var closeCreateNbDialogIconEl = document.querySelector('.fa-xmark');
var createNbDialogEl = document.querySelector('.create-nb-dialog');
var createNbDialogNameTextEl = document.querySelector('.create-nb-dialog input');
var createNbDialogBtnEl = document.querySelector('.create-nb-dialog-btn');
var selectedNotebookEl = document.querySelector('.notes-notebook-list-item-selected');
var userLogOutBtn = document.querySelector('.notes-logout-btn');

var notesSidebarListEl = document.querySelector('.notes-sidebar-list');
var notesSidebarBtnEl = document.querySelector('.notes-sidebar-btn');

var notesPreviewEl = document.querySelector('.notes-preview');
/* Section Elements */
var newSectionEl = document.querySelector('.notes-preview-section');
var notesPreviewBody = document.querySelector('.notes-preview-body');
var notesData;
var currentUser = localStorage.getItem('currentUser');

/**
 * @author Vignesh
 * @function selectedNBData
 * @description this function is used to get the selected notebook data from the notesData
 * @param none
 * @returns {object} - selected notebook data from the notesData
 */
function selectedNBData() {
  // find the selected notebook using the CSS class
  let selectedNotebook = Array.from(notebookListEl.children).find((nbListItem) => nbListItem.classList.contains('notes-notebook-list-item-selected'));

  if (!selectedNotebook) return {};

  // get the notebook id from the element
  let selectedNotebookId = parseInt(selectedNotebook.dataset.id);

  // iterate the notesData and find the notebook inside the selected nb
  return notesData.notebooks.find((notebook) => notebook.notebookId === selectedNotebookId);
}

/**
 * @author Vignesh
 * @function selectedNote
 * @description this function is used to get the selected note inside the selected notebook from the notesData
 * @param notesOfSelectedNB - array of selected notes
 * @returns {object} - selected notebook data from the notesData
 */
function selectedNote(notesOfSelectedNB) {
  // find the id of the selected note from the DOM
  let selectedNoteId = parseInt(Array.from(notesSidebarListEl.children).find((nbListItem) => nbListItem.classList.contains('notes-sidebar-list-item-selected')).dataset.id);

  // find the notes in the notesData array using the notes ID and return
  return notesOfSelectedNB.find((note) => note.notesId === selectedNoteId);
}

/**
 * @author Vignesh
 * @function setNotesUser
 * @description this function is used to set the current user in the UI. If there is no current user, then redirect to login page
 * @param none
 * @returns none
 */
function setNotesUser() {
  if (!currentUser) {
    window.location.href = 'https://vignesh-mariappan.github.io/login.html';
    return;
  }
  notesUser.textContent = currentUser;
}

/**
 * @author Vignesh
 * @function loadSelectedNoteInPreview
 * @description this function is used to load the selected note in the notes preview
 * @param {object} note
 * @returns none
 */
function loadSelectedNoteInPreview(note) {
  // this is to disable or enable the download button based on the content
  let style = note.body.length === 0 ? 'pointer-events:none;color:#d3d3d3;' : 'pointer-events:auto;color:black;';

  // clear the notes preview section before constructing
  notesPreviewEl.textContent = '';
  notesPreviewEl.innerHTML = `
    <div class = "notes-preview-title" contentEditable></div>
    <div class="notes-preview-icons">
    <div class="notes-preview-section">
        <i class="fa-solid fa-plus"></i>
      </div>
    <div class="notes-preview-save">
      <i class="fa-solid fa-floppy-disk"></i>
    </div>
    <div class="notes-preview-download" style=${style}>
      <i class="fa-solid fa-download"></i>
    </div>
    <div class="notes-preview-delete">
      <i class="fa-solid fa-trash"></i>
    </div>
  </div>
  <div class = "notes-preview-body"></div>
    `;

  // iterate the notes body array and create sections
  note.body.forEach((section) => createSection(section));

  // set the title of the notes-preview section
  notesPreviewEl.children[0].textContent = note.title;
}

/**
 * @author Vignesh
 * @function loadSmallNotesOfSelectedNB
 * @description this function is used to load the notes in the notes sidebar section
 * @param none
 * @returns none
 */
function loadSmallNotesOfSelectedNB() {
  // clear the sidebar small notes if any
  notesSidebarListEl.textContent = '';

  let selectedNotebook = selectedNBData();

  if (selectedNotebook && selectedNotebook.notes && selectedNotebook.notes.length > 0) {
    let notesOfSelectedNB = selectedNBData().notes;

    /* <div class="notes-sidebar-list-item notes-sidebar-list-item--selected">
                    <div class="small-note-title">Untitled</div>
                    <div class="small-note-body">Lorem ipsum dolor sit amet</div>
                    <div class="small-note-time">05 / 07 / 2022</div>
                </div> */
    // sort the notes based on time
    notesOfSelectedNB.sort(function (note1, note2) {
      return new Date(note1.time) > new Date(note2.time) ? -1 : 1;
    });

    // create small note item and add it to the notes sidebar list
    notesOfSelectedNB.forEach((note, index) => {
      // create a sidebar list item div
      let sidebarListItm = document.createElement('div');
      sidebarListItm.classList.add('notes-sidebar-list-item');
      if (index === 0) sidebarListItm.classList.add('notes-sidebar-list-item-selected');

      // create title div & set the text
      let smallNoteTitle = document.createElement('div');
      smallNoteTitle.classList.add('small-note-title');
      smallNoteTitle.textContent = note.title;

      // create body div & set the text
      let smallNotebody = document.createElement('div');
      smallNotebody.classList.add('small-note-body');
      smallNotebody.textContent = note.body.length > 0 ? `${note.body[0].sectionBody.substr(0, 50)}...` : '';

      // create time div & set the text
      let smallNoteTime = document.createElement('div');
      smallNoteTime.classList.add('small-note-time');
      smallNoteTime.textContent = note.time.split('T')[0];

      // append the above three elements into list item div
      sidebarListItm.append(smallNoteTitle);
      sidebarListItm.append(smallNotebody);
      sidebarListItm.append(smallNoteTime);

      // add data id attribute to the list item
      sidebarListItm.dataset.id = note.notesId;

      // append the list item div into sidebar list el
      notesSidebarListEl.append(sidebarListItm);
    });

    // load selected Note in the notes preview section
    if (notesOfSelectedNB.length > 0) loadSelectedNoteInPreview(notesOfSelectedNB[0]);
  } else notesPreviewEl.textContent = '';
}

/**
 * @author Vignesh
 * @function checkAndCreateNotesData
 * @description this function is used to check whether notesData is created for current user in local storage, if not it will create one
 * @param none
 * @returns none
 */
function checkAndCreateNotesData() {
  notesData = JSON.parse(localStorage.getItem(currentUser) || '{}');

  if (Object.entries(notesData).length === 0) {
    let newData = {
      user: currentUser,
      notebooks: [],
    };
    localStorage.setItem(currentUser, JSON.stringify(newData));

    notesData = JSON.parse(localStorage.getItem(currentUser) || '{}');
  }

  loadNotebooks();
}

function loadNotebooks() {
  //   notesData = JSON.parse(localStorage.getItem(currentUser) || '{}');

  notebookListEl.textContent = '';

  if (notesData.notebooks.length > 0) {
    // iterate the notebooks and create an li element for each notebook
    notesData.notebooks.forEach((notebook, index) => {
      // create an li element
      let notebookListItem = document.createElement('li');

      // set the classes
      notebookListItem.classList.add('notes-notebook-list-item');
      if (index === 0) notebookListItem.classList.add('notes-notebook-list-item-selected');

      // create an i tag
      let stackIconEl = document.createElement('i');

      // set the classes
      stackIconEl.classList.add('fa-solid', 'fa-layer-group');

      // set the style attribute
      stackIconEl.style.cssText += 'padding-right: 10px;';

      // append the icon el to li element
      notebookListItem.append(stackIconEl);

      // set the notebook title
      let notebookTitleEl = document.createElement('span');
      notebookTitleEl.textContent = notebook.notebookTitle;
      notebookListItem.append(notebookTitleEl);

      // create an i tag
      let trashIconEl = document.createElement('i');
      // set the classes
      trashIconEl.classList.add('fa-solid', 'fa-trash');
      // set the style attribute
      trashIconEl.style.cssText += 'padding-right: 10px;';
      notebookListItem.append(trashIconEl);

      // set the id to the data attribute
      notebookListItem.dataset.id = notebook.notebookId;

      // append it to the ul element
      notebookListEl.append(notebookListItem);
    });
  } else {
    notesSidebarBtnEl.style.display = 'none';
  }

  loadSmallNotesOfSelectedNB();
}

function addNewNotebook() {
  // notebookListEl
  let notebook = notesData.notebooks[notesData.notebooks.length - 1];

  let selectedNotebook = Array.from(notebookListEl.children).find((nbListItem) => nbListItem.classList.contains('notes-notebook-list-item-selected'));
  // remove the selected class from the selected nb
  if (selectedNotebook) selectedNotebook.classList.remove('notes-notebook-list-item-selected');

  // take the last notebook from notesdata
  // create an li element
  let notebookListItem = document.createElement('li');

  // set the classes
  notebookListItem.classList.add('notes-notebook-list-item', 'notes-notebook-list-item-selected');

  // create an i tag
  let stackIconEl = document.createElement('i');

  // set the classes
  stackIconEl.classList.add('fa-solid', 'fa-layer-group');

  // set the style attribute
  stackIconEl.style.cssText += 'padding-right: 10px;';

  // append the icon el to li element
  notebookListItem.append(stackIconEl);

  // set the notebook title
  let notebookTitleEl = document.createElement('span');
  notebookTitleEl.textContent = notebook.notebookTitle;
  notebookListItem.append(notebookTitleEl);

  // create an i tag
  let trashIconEl = document.createElement('i');
  // set the classes
  trashIconEl.classList.add('fa-solid', 'fa-trash');
  // set the style attribute
  trashIconEl.style.cssText += 'padding-right: 10px;';
  notebookListItem.append(trashIconEl);

  // set the id to the data attribute
  notebookListItem.dataset.id = notebook.notebookId;

  // append it to the ul element
  notebookListEl.append(notebookListItem);

  notesSidebarBtnEl.style.display = 'block';

  loadSmallNotesOfSelectedNB();

  createNbDialogEl.style.display = 'none';
  createNbDialogNameTextEl.value = '';
  createNbDialogBtnEl.setAttribute('disabled', 'true');
  overlayEl.style.visiblity = 'hidden';
  overlayEl.style.pointerEvents = 'auto';
}

function nbListItemClickHandler(event) {
  let nbClicked = event.target; // span element inside the li element>

  if (nbClicked.classList.contains('fa-trash')) {
    let notebookToDeleteId = nbClicked.closest('.notes-notebook-list-item').dataset.id;

    let notebookToDeleteIndex = notesData.notebooks.findIndex((notebook) => notebook.notebookId === notebookToDeleteId);

    notesData.notebooks.splice(notebookToDeleteIndex, 1);

    // set it to the local storage for the current user
    localStorage.setItem(currentUser, JSON.stringify(notesData));

    // set the new notesData from the local storage
    notesData = JSON.parse(localStorage.getItem(currentUser));

    loadNotebooks();
  } else {
    let selectedNotebook = Array.from(notebookListEl.children).find((nbListItem) => nbListItem.classList.contains('notes-notebook-list-item-selected'));

    if (selectedNotebook.dataset.id !== nbClicked.closest('.notes-notebook-list-item').dataset.id) {
      // remove the selected class from the selected nb
      selectedNotebook.classList.remove('notes-notebook-list-item-selected');

      // add the selected class to the notebook clicked
      nbClicked.closest('.notes-notebook-list-item').classList.add('notes-notebook-list-item-selected');

      // load notes of selected NB
      loadSmallNotesOfSelectedNB();
    }
  }
}

function notesSidebarListClickHandler(event) {
  // clicked small note
  let clickedSmallNote = event.target.closest('.notes-sidebar-list-item');

  // iterate the notesData and find the notes inside the selected nb
  let notesOfSelectedNB = selectedNBData().notes;

  // find the note information that is clicked inside the notes array
  let noteInfo = notesOfSelectedNB.find((note) => note.notesId === parseInt(clickedSmallNote.dataset.id));

  // modify the title of the preview with the note info
  // modify the text area of the preview
  loadSelectedNoteInPreview(noteInfo);

  // remove the already selected sidebar note item css class
  notesSidebarListEl.querySelector('.notes-sidebar-list-item-selected').classList.remove('notes-sidebar-list-item-selected');

  // add the selected CSS class to clicked small note
  clickedSmallNote.classList.add('notes-sidebar-list-item-selected');
}

function notesSidebarBtnClickHandler(event) {
  // find the notes of selected notebook in the notesData array
  let notesOfSelectedNB = selectedNBData().notes;

  // push a new note object in the notes array inside the notebook we found in the previous step with id randomly generated, title as untitled, time as created time
  notesOfSelectedNB.push({
    notesId: new Date().getTime(),
    title: 'Untitled',
    body: [],
    time: new Date().toISOString(),
  });

  // set it to the local storage for the current user
  localStorage.setItem(currentUser, JSON.stringify(notesData));

  // set the new notesData from the local storage
  notesData = JSON.parse(localStorage.getItem(currentUser));

  // call the loadSmallNotesOfSelectedNB
  loadSmallNotesOfSelectedNB();
}

function saveNote() {
  let selectedNote = Array.from(notesSidebarListEl.children).find((listItem) => listItem.classList.contains('notes-sidebar-list-item-selected'));

  let selectedNoteId = parseInt(selectedNote.dataset.id);

  let notesOfSelectedNB = selectedNBData().notes;
  // updated array of section objects
  let sectionUpdates = [];

  // iterate the sections in the notesPreviewBody element and push the updated values of the section to the array
  Array.from(notesPreviewEl.children[2].children).forEach((section) => {
    let sectionId = section.dataset.id;
    let sectionTitle = section.children[0].textContent;
    let sectionBody = section.children[1].textContent;
    sectionUpdates.push({
      sectionId: sectionId,
      sectionTitle: sectionTitle,
      sectionBody: sectionBody,
    });
  });

  // set the updated array to the selected note of the selected notebook
  notesOfSelectedNB = notesOfSelectedNB.map((note) => {
    if (selectedNoteId === note.notesId) {
      note.title = notesPreviewEl.children[0].textContent;
      note.body = sectionUpdates;
      note.time = new Date().toISOString();
    }

    return note;
  });

  // set it to the local storage for the current user
  localStorage.setItem(currentUser, JSON.stringify(notesData));

  // set the new notesData from the local storage
  notesData = JSON.parse(localStorage.getItem(currentUser));

  loadSmallNotesOfSelectedNB();
}

function saveKeysPressedHandler(event) {
  if ((window.navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey) && event.keyCode == 83) {
    event.preventDefault();

    saveNote();
  }
}

function newNbIconClickHandler(event) {
  createNbDialogEl.style.display = 'flex';
  overlayEl.style.visiblity = 'visible';
  overlayEl.style.pointerEvents = 'none';
  createNbDialogNameTextEl.value = '';
  createNbDialogBtnEl.setAttribute('disabled', 'true');
}

function closeNbDialogIconClickHandler(event) {
  createNbDialogEl.style.display = 'none';
  createNbDialogNameTextEl.value = '';
  createNbDialogBtnEl.setAttribute('disabled', 'true');
  overlayEl.style.visiblity = 'hidden';
  overlayEl.style.pointerEvents = 'auto';
}

function createNbNameBoxChangeHandler(event) {
  if (event.target.value.length >= 4) {
    createNbDialogBtnEl.removeAttribute('disabled');
  } else {
    createNbDialogBtnEl.setAttribute('disabled', 'true');
  }
}

function createNbDialogBtnElHandler(event) {
  notesData.notebooks.push({
    notebookId: new Date().getTime(),
    notebookTitle: createNbDialogNameTextEl.value,
    notes: [],
  });

  // set in local storage
  localStorage.setItem(currentUser, JSON.stringify(notesData));

  notesData = JSON.parse(localStorage.getItem(currentUser));

  // add new notebook to the view
  addNewNotebook();
}

function deleteNote() {
  let selectedNote = Array.from(notesSidebarListEl.children).find((listItem) => listItem.classList.contains('notes-sidebar-list-item-selected'));

  let selectedNoteId = parseInt(selectedNote.dataset.id);

  let notesOfSelectedNB = selectedNBData().notes;

  notesOfSelectedNB = notesOfSelectedNB.filter((note) => selectedNoteId !== note.notesId);

  selectedNBData().notes = notesOfSelectedNB;

  // set it to the local storage for the current user
  localStorage.setItem(currentUser, JSON.stringify(notesData));

  // set the new notesData from the local storage
  notesData = JSON.parse(localStorage.getItem(currentUser));

  loadSmallNotesOfSelectedNB();
}

function downloadNoteAsPDF() {
  let noteTitle = notesPreviewEl.children[0].textContent;
  let doc = new jsPDF('p', 'in', 'a4');
  let noteText = document.querySelector('.notes-preview-body').textContent;

  doc.setDrawColor('black');
  doc.setLineWidth(1 / 72);

  let textLines = doc.setFont('Arial').setFontSize(12).splitTextToSize(noteText, 7.25);

  let verticalOffset = 0.5;
  doc.text(0.5, verticalOffset + 12 / 72, textLines);
  verticalOffset += (textLines.length * 12) / 72;

  doc.save(`${noteTitle}.pdf`);

  //   <html><head><title>Notes App</title></head><body>` + document.querySelector('.notes-preview-body').innerHTML + `</body></html>
  //   doc.html(`<div style="width:900px">${document.querySelector('.notes-preview-body').innerHTML}</div>`, {
  //     callback: function (doc) {
  //       doc.save(`${noteTitle}.pdf`);
  //     },
  //   });
}

function notesPreviewClickHandler(event) {
  // save note button click
  if (event.target.closest('div').classList.contains('notes-preview-section')) {
    newSectionElClickHandler(event);
  } else if (event.target.closest('div').classList.contains('notes-preview-save')) {
    saveNote(event);
  } else if (event.target.closest('div').classList.contains('notes-preview-delete')) {
    deleteNote();
  } else if (event.target.closest('div').classList.contains('notes-preview-download')) {
    downloadNoteAsPDF();
  }
}

function userLogOutBtnClickHandler(event) {
  localStorage.setItem('currentUser', '');
  window.location.href = '/login.html';
}

/* Section changes */
function newSectionElClickHandler() {
  // create a new section
  let section = {
    sectionId: new Date().getTime(),
    sectionTitle: 'Untitled section',
    sectionBody: '',
  };

  // find the selected note
  let selectedNB = selectedNBData();

  if (selectedNB && selectedNB.notes && selectedNB.notes.length > 0) {
    let notesOfSelectedNB = selectedNB.notes;

    let selectedNoteOfSelectedNB = selectedNote(notesOfSelectedNB);

    // push the section to the body of the selected note of the selected note book
    selectedNoteOfSelectedNB.body.push(section);

    // create new section in the UI passing the section object
    createSection(section);

    // set the new notesData for the current user
    localStorage.setItem(currentUser, JSON.stringify(notesData));

    // set the new data to the notesData
    notesData = JSON.parse(localStorage.getItem(currentUser));
  }
}

function deleteSection(event) {
  // find the section ID to delete
  let sectionToDelete = event.target.closest('.section');
  let sectionIdToDelete = sectionToDelete.dataset.id;

  // Remove from UI
  notesPreviewEl.children[2].removeChild(event.target.closest('.section'));

  // find the selected notebook
  let selectedNB = selectedNBData();

  // find the selected note from the selected notebook notes
  let notesOfSelectedNB = selectedNB.notes;
  let selectedNoteOfSelectedNB = selectedNote(notesOfSelectedNB);

  // Filter the section from the body array of the selected note of the selected notebook
  let filteredSectionArray = selectedNoteOfSelectedNB.body.filter((section) => section.sectionId !== sectionIdToDelete);

  // set the new array to the selected note of the selected notebook after delete
  selectedNoteOfSelectedNB.body = [...filteredSectionArray];

  // set the new notesData for the current user
  localStorage.setItem(currentUser, JSON.stringify(notesData));

  // set the new data to the notesData
  notesData = JSON.parse(localStorage.getItem(currentUser));
}

function createSection(section) {
  // create a section div
  // add the id to the section div
  let sectionDivEl = document.createElement('div');
  sectionDivEl.classList.add('section');
  sectionDivEl.dataset.id = section.sectionId;

  // create the title container to hold title and trash icon
  let sectionTitleContainerEl = document.createElement('div');
  sectionTitleContainerEl.classList.add('section-title-container');

  // create the title element to hold the section title
  let sectionTitleEl = document.createElement('div');
  sectionTitleEl.classList.add('section-title');
  sectionTitleEl.setAttribute('contenteditable', '');
  sectionTitleEl.textContent = section.sectionTitle ? section.sectionTitle : 'Untitled section';

  // delete icon to delete the section
  let delSectionIconEl = document.createElement('i');
  delSectionIconEl.classList.add('fa-solid', 'fa-trash');

  // create a section body
  let sectionBodyEl = document.createElement('div');
  sectionBodyEl.classList.add('section-body');
  sectionBodyEl.setAttribute('contenteditable', '');
  sectionBodyEl.textContent = section.sectionBody ? section.sectionBody : '';

  // add the elements to the section
  sectionTitleContainerEl.append(sectionTitleEl);
  sectionTitleContainerEl.append(delSectionIconEl);
  sectionDivEl.append(sectionTitleContainerEl);
  sectionDivEl.append(sectionBodyEl);

  // add the section to the notes preview body
  notesPreviewEl.children[2].append(sectionDivEl);
}

notesPreviewEl.addEventListener('click', (event) => {
  if (event.target.classList.contains('fa-trash')) {
    deleteSection(event);
  }
});

notesPreviewEl.addEventListener('keydown', (event) => {
  if (event.target.classList[0] === 'section-title') {
    if (event.key === 'Enter') {
      event.preventDefault();
      return false;
    }

    // let len = event.target.innerText.trim().length;

    // if (len >= 70) {
    //   event.preventDefault();
    //   return false;
    // }
  }
});

notesPreviewEl.onpaste = (event) => {
  if (event.target.classList[0] === 'section-body' || event.target.classList.contains('section-title')) {
    event.preventDefault();
    var text = event.clipboardData.getData('text/plain');
    event.target.textContent += text;
  }
  if (event.target.classList.contains('section-title')) {
    event.preventDefault();
    var text = event.clipboardData.getData('text/plain');
    event.target.textContent = text;
  }
};

function reportWindowSize() {
  if (window.innerWidth <= 850) {
    overlayEl.style.display = 'none';
    document.querySelector('.desktop-only-support-ui').style.display = 'block';
  } else {
    overlayEl.style.display = 'block';
    document.querySelector('.desktop-only-support-ui').style.display = 'none';
  }
}

// On refresh function calls
setNotesUser();
checkAndCreateNotesData();
reportWindowSize();

// Event Listeners
notebookListEl.addEventListener('click', nbListItemClickHandler);
notesSidebarListEl.addEventListener('click', notesSidebarListClickHandler);
notesSidebarBtnEl.addEventListener('click', notesSidebarBtnClickHandler);
newNbIconEl.addEventListener('click', newNbIconClickHandler);
closeCreateNbDialogIconEl.addEventListener('click', closeNbDialogIconClickHandler);
createNbDialogNameTextEl.addEventListener('input', createNbNameBoxChangeHandler);
createNbDialogBtnEl.addEventListener('click', createNbDialogBtnElHandler);
notesPreviewEl.addEventListener('click', notesPreviewClickHandler);
userLogOutBtn.addEventListener('click', userLogOutBtnClickHandler);
document.addEventListener('keydown', saveKeysPressedHandler, false);

window.onresize = reportWindowSize;
