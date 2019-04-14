/* eslint-disable no-param-reassign */
import '../styles/app.scss';

require('../index.html');

let state = [
  {
    id: 1,
    name: 'Xinhe',
    location: 'Taipei',
  },
];
let currentPage = 1;
let from = 1;
let to = 5;
const recordsPerPage = 5;
const addRecordForm = document.getElementsByName('add-record-form')[0];
const nameField = document.getElementsByName('name')[0];
const locationField = document.getElementsByName('location');
const addRecordBtn = document.querySelector('form .btn');
const recordList = document.querySelector('.list-group');
const recordsTotal = document.getElementsByClassName('record-list__item-total')[0];
const btnPrev = document.querySelectorAll('.record-list__page-control button')[0];
const btnNext = document.querySelectorAll('.record-list__page-control button')[1];
const pageControl = document.querySelector('.record-list__page-control');
const pageSpan = document.querySelector('.record-list__page-control span');
const englishValidator = /^[A-Za-z]*$/;

const validateForm = () => {
  if (!nameField.value || !englishValidator.test(nameField.value)) {
    document.getElementsByClassName('form__input__warning')[0].classList.add('form__input__warning--error');
    document.getElementsByClassName('form__input__warning')[0].innerHTML = 'Please enter english only.';
    nameField.classList.add('form__input--danger');
    return false;
  }
  if (nameField.value.length <= 2) {
    document.getElementsByClassName('form__input__warning')[0].classList.add('form__input__warning--error');
    document.getElementsByClassName('form__input__warning')[0].innerHTML = 'Please enter 3-10 characters.';
    nameField.classList.add('form__input--danger');
    return false;
  }
  document.getElementsByClassName('form__input__warning')[0].classList.remove('form__input__warning--error');
  nameField.classList.remove('form__input--danger');
  return true;
};

const clearForm = () => {
  nameField.value = '';
  locationField[0].checked = true;
  addRecordBtn.disabled = true;
  addRecordBtn.classList.remove('btn--primary');
  addRecordBtn.classList.add('btn--disabled');
};

const idCounter = () => {
  let id = state.length;
  const countUp = () => {
    id += 1;
    return id;
  };
  return countUp;
};

const getValueFromRadioButton = (name) => {
  const buttons = document.getElementsByName(name);
  for (let i = 0; i < buttons.length; i += 1) {
    const button = buttons[i];
    if (button.checked) {
      return button.value;
    }
  }
  return null;
};

const numPages = () => Math.ceil(state.length / recordsPerPage);

// Render records list

const render = (template, data) => {
  const patt = /\{([^}]+)\}/g; // matches {id}
  return template.replace(patt, (_, key) => data[key]);
};

const add = (key) => {
  const listGroupItem = '#{id}, {name}, {location}<button class="btn btn--primary--outline btn--xs list-group__item__action">Delete</button>';
  const DOMli = document.createElement('li');
  DOMli.classList.add('list-group__item');
  DOMli.setAttribute('data-id', state[key].id);
  DOMli.innerHTML = render(listGroupItem, state[key]);
  if (!recordList.innerHTML) {
    recordList.innerHTML = '';
  }
  recordList.appendChild(DOMli);
  return false;
};

const renderRecordList = (renderFrom, renderTo) => {
  recordList.innerHTML = '';
  state.map((item, key) => {
    if (key + 1 >= renderFrom && key < renderTo) {
      add(key);
    }
    return false;
  });
  recordsTotal.innerHTML = state.length;
  if (state.length < to) {
    pageSpan.innerHTML = `${from} - ${state.length}`;
  } else {
    pageSpan.innerHTML = `${from} - ${to}`;
  }
  if (state.length < 1) {
    pageControl.style.display = 'none';
  } else {
    pageControl.style.display = 'flex';
  }
  if (currentPage === 1) {
    btnPrev.classList.remove('btn--primary');
    btnPrev.classList.add('btn--disabled');
    btnPrev.disabled = true;
  } else {
    btnPrev.disabled = false;
    btnPrev.classList.remove('btn--disabled');
    btnPrev.classList.add('btn--primary');
  }
  if (currentPage === numPages()) {
    btnNext.classList.remove('btn--primary');
    btnNext.classList.add('btn--disabled');
    btnNext.disabled = true;
  } else {
    btnNext.disabled = false;
    btnNext.classList.remove('btn--disabled');
    btnNext.classList.add('btn--primary');
  }
  if (state.length > to) {
    btnNext.disabled = false;
    btnNext.classList.remove('btn--disabled');
    btnNext.classList.add('btn--primary');
  }
};

// Pagination

const changePage = (page) => {
  // Validate page
  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();

  from = (page - 1) * recordsPerPage + 1;
  to = (page * recordsPerPage);
  renderRecordList(from, to);
};

const prevPage = () => {
  if (currentPage > 1) {
    currentPage -= 1;
    changePage(currentPage);
  }
};

const nextPage = () => {
  if (currentPage < numPages()) {
    currentPage += 1;
    changePage(currentPage);
  }
};

// Event Listener

window.addEventListener('load', () => {
  addRecordBtn.disabled = true;
  addRecordBtn.classList.remove('btn--primary');
  addRecordBtn.classList.add('btn--disabled');
  renderRecordList(from, to);
});

// Validate when typing
nameField.addEventListener('input', () => {
  if (!validateForm()) {
    addRecordBtn.disabled = true;
    addRecordBtn.classList.remove('btn--primary');
    addRecordBtn.classList.add('btn--disabled');
  } else {
    addRecordBtn.disabled = false;
    addRecordBtn.classList.remove('btn--disabled');
    addRecordBtn.classList.add('btn--primary');
  }
});

// Add record item
const id = idCounter();
addRecordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    const record = {
      id: id(),
      name: e.target.name.value,
      location: getValueFromRadioButton('location'),
    };
    state.push(record);

    from = (currentPage - 1) * recordsPerPage + 1;
    to = (currentPage * recordsPerPage);

    renderRecordList(from, to);
    clearForm();
  }
});

// Delete record item
recordList.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const removeId = parseInt(e.target.parentNode.getAttribute('data-id'), 10);
    state = state.filter(item => item.id !== removeId);
    renderRecordList(from, to);
    if (state.length < from) {
      prevPage();
    }
  }
}, false);

btnNext.addEventListener('click', () => nextPage());

btnPrev.addEventListener('click', () => prevPage());
