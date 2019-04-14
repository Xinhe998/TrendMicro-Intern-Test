import '../styles/app.scss';

require('../index.html');

// let state = [
//   {
//     id: 1,
//     name: 'Tom',
//     location: 'Taipei',
//   },
// ];

const addRecordForm = document.getElementsByName('add-record-form')[0];
const nameField = document.getElementsByName('name')[0];
const englishValidator = /^[A-Za-z0-9]*$/;

const validateForm = () => {
  if (!nameField.value || !englishValidator.test(nameField.value)) {
    document.getElementsByClassName('form__input__warning')[0].classList.add('form__input__warning--error');
    nameField.classList.add('form__input--danger');
    return false;
  }
  document.getElementsByClassName('form__input__warning')[0].classList.remove('form__input__warning--error');
  nameField.classList.remove('form__input--danger');
  return true;
};

nameField.addEventListener('input', () => {
  validateForm();
});

addRecordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  validateForm();
});
