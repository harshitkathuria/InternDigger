import '@babel/polyfill';

import { login, logOut } from './login';
import { signup } from './signup';
import { updateUserData, updateUserPassword } from './updateUser';
import { post, createResponse } from './createDocument';
import { loadContentPageWise } from './loadPage';

// DOM
const loginForm = document.querySelector('.login-form');
const signUpForm = document.querySelector('.signup-form');
const logoutBtn = document.querySelector('.logout');
const pagination = document.querySelectorAll('.pagination');
const submitFilterBtns = document.querySelector('.submit-btns');


// Sign Up

if(signUpForm) { 
  signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    let organization = null;
    if(document.getElementById('org'))
      organization = document.getElementById('org').value;
    signup({ name, email, organization, password, passwordConfirm, organization});
  });
}

// Login............................

if(loginForm) { 
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// Log out...................

if(logoutBtn) {
  logoutBtn.addEventListener('click', logOut);
}

// UPDATE PERSONAL RECORD

const updatePersonalForm = document.querySelector('.form-user-data');
if(updatePersonalForm) {
  updatePersonalForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const name = document.getElementById('name').value;
    let organization;
    if(document.getElementById('org'))
      organization = document.getElementById('org').value;
    updateUserData({ email, name, organization});
  })
}

// CHANGE PASSWORD

const updatePasswordForm = document.querySelector('.form-user-password');
if(updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('savePassword').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateUserPassword({ passwordCurrent, password, passwordConfirm });

    document.getElementById('savePassword').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  })
}

// Post Vacancy

const postBtn = document.getElementById('btn-post');

if(postBtn) {
  postBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vacancyAttrib = {};
    vacancyAttrib.position = document.getElementById('position').value;
    vacancyAttrib.duration = document.getElementById('duration').value;
    vacancyAttrib.description = document.getElementById('description').value;
    vacancyAttrib.summary = document.getElementById('cover-info').value;
    vacancyAttrib.stipend = Number(document.getElementById('stipend').value);
    vacancyAttrib.lastDate = document.getElementById('last-date').value;
    vacancyAttrib.email = document.getElementById('email').value;
    vacancyAttrib.jobID = Number(document.getElementById('jobID').value);
    vacancyAttrib.type = document.getElementById('type').value;
    vacancyAttrib.city = document.getElementById('city').value;
    post(vacancyAttrib);
  })
}

// Create Response

const applyBtn = document.querySelector('.btn-apply');
if(applyBtn) {
  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    createResponse();
  })
}

if(pagination) {
  pagination.forEach(el => {
    el.addEventListener('click', (e) => {
      if(e.target.classList.contains('btn-page')) {
        const pageNum = e.target.innerText;

        let position, city, type;
        if(document.querySelector('#filter-position'))
          position = document.querySelector('#filter-position').value;
        if(document.querySelector('#filter-city'))
          city = document.querySelector('#filter-city').value;
        if(document.querySelector('input[type="radio"]:checked'))
          type = document.querySelector('input[type="radio"]:checked').value;

        let filter = null;
        let Model = null;
        Model = 'vacancy';
        if(position || city || type) {
          filter = {};
          filter.btnType = 'Save';
          filter.position = position;
          filter.city = city;
          if(type)
            filter.type = type;
        }
        let subModel = null, query = null;
        if(e.target.parentElement.id === 'get-responses') {
          Model = 'users';
          subModel = window.userRole === 'candidate' ? 'vac' : 'res';
        }
        else if(e.target.parentElement.id === 'posted-vacancies-page') {
          Model = 'vacancy';
          query = `contactEmail=${window.userEmail}`;
        }
        // console.log(Model, filter, pageNum, subModel);
        loadContentPageWise(Model, filter, pageNum, subModel, query);
      }
    })
  })
}


// FILTERING

const dropdownFilter = document.querySelector('.dropdown');
// Toggle type button / filter
if(dropdownFilter) {
  dropdownFilter.addEventListener('click', () => {
    if(document.querySelector('.fa-chevron-up').style.display !== 'none') {
      document.querySelector('.fa-chevron-up').style.display = 'none';
      document.querySelector('.fa-chevron-down').style.display = 'inline-block';
      document.querySelector('.filter-suboptions-list').style.display = 'block';
      // document.querySelector('#full-time').checked = true;
    }
    else {
      document.querySelector('.fa-chevron-up').style.display = 'inline-block';
      document.querySelector('.fa-chevron-down').style.display = 'none';
      document.querySelector('.filter-suboptions-list').style.display = 'none';
    }
  })
}

if(submitFilterBtns) {
  submitFilterBtns.addEventListener('click', (e) => {
    if(e.target.classList.contains('btn-filter')) {
      const filter = {};
      filter.type = '';
      if(document.querySelector('.fa-chevron-up').style.display === 'none') {
        const type = document.querySelector('input[type="radio"]:checked');
        if(type)
          filter.type = type.value;
      }
      filter.position = document.querySelector('#filter-position').value;
      filter.city = document.querySelector('#filter-city').value; 
      filter.btnType = e.target.innerText;
      loadContentPageWise('vacancy', filter);
    }
  })
}