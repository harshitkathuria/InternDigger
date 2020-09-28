import { showAlert } from './alert';

// Paginate.....

const loadPageBtn = async (Model, query = '') => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/interndigger/api/v1/${Model}/?${query}`
    });

    if(res.data.status === 'success') {
      let result = res.data.data.vacancies;
      let pageBtn = result.length / 5;
      if(result.length % 5)
        pageBtn++;
      
      let markup = '';
      for(let i = 1; i <= pageBtn; i++) {    
        markup += `<div class="btn btn-secondary btn-medium btn-page">${i}</div>`;
      }
      
      const paginate = document.querySelector('.pagination');
      paginate.innerHTML = markup;
    }
  } catch(err) {
    console.log(err.message);
    showAlert('error', err.message);
  }
}

// Clear out the filter fields
const clearFields = () => {
  document.querySelector('#filter-position').value = '';
  document.querySelector('#filter-city').value = '';
  document.querySelector('.fa-chevron-up').style.display = 'inline-block';
  document.querySelector('.fa-chevron-down').style.display = 'none';
  document.querySelector('.filter-suboptions-list').style.display = 'none';
  document.querySelector('#full-time').checked = false;
  document.querySelector('#part-time').checked = false;
}

export const loadContentPageWise = async (Model, filter, pageNum = 1, subModel, query) => {
  try {
    if(!query)
      query = '';
    if(filter) {
      if(!filter.type)
        filter.type = '';
      query += filter.btnType === 'Save' ? `position=${filter.position}&city=${filter.city}&type=${filter.type}`: '';
      // ClearBtn Pressed
      if(!query) {
        clearFields();
      }
    }
    let url = '';
    if(Model == 'users') {
      url = `/interndigger/api/v1/${Model}/${window.userID}/?page=${pageNum}&limit=5&${query}`
    }
    else 
      url = `/interndigger/api/v1/${Model}/?page=${pageNum}&limit=5&${query}`
    const res = await axios({
      method: 'GET',
      url
    });
  
    if(res.data.status === 'success') {
      let markup = '';
      if(Model === 'vacancy') {
        let vacancies = res.data.data.vacancies;
        if(window.userRole === 'candidate') {
          for(let i = 0; i < vacancies.length; i++) {
            markup += 
            `<div class="card">
              <div class="card-content">
                <div class="row heading">
                  <h3 class="position">${vacancies[i].position}</h3>
                  <span class="lead posted">${vacancies[i].organization}</span>
                </div>
                <p class="summary">${vacancies[i].summary}</p>
                <div class="details"><a href="/vacancy/${vacancies[i].jobID}">Read More</a></div>
              </div>
            </div>`
          }
        }
        else {
          for(let i = 0; i < vacancies.length; i++) {
            const posted = new Date(vacancies[i].postedOn).toLocaleDateString('en-US');
            markup += 
            `<div class="card">
              <p class="position">${vacancies[i].position}</p>
              <p class="postedDate">${posted}</p>
              <p class="readmore"><a href="/vacancy/${vacancies[i].jobID}">Read More</a></p>
              <p class="delete"><a href="/vacancy/${vacancies[i].jobID}">Delete Vacancy <i class="fas fa-times-circle"></i></a></p>
            </div>`
          }
        }
      }
      else if(Model === 'users') {
        let responses = res.data.data.user.response;
        if(subModel && subModel === 'res') {
          for(let i = 0; i < responses.length; i++) {
            const date = new Date(responses[i].appliedAt).toLocaleDateString('en-US');
            markup +=
            `<div class="card">
              <p class="name">${responses[i].user.name}</p>
              <p class="email">${responses[i].user.email}</p>
              <p class="appliedDate">${date}</p>
              <p class="readmore"><a href="/vacancy/${responses[i].vacancy.jobID}">Read More</a></p>
            </div>`
          }
        }
        else if(subModel && subModel === 'vac'){
          for(let i = 0; i < responses.length; i++) {
            markup += 
            `<div class="card">
              <p class="company">${responses[i].vacancy.organization}</p>
              <p class="position">${responses[i].vacancy.position}</p>
              <p class="appliedDate">${new Date(responses[i].appliedAt).toLocaleDateString('en-US')}</p>
              <p class="readmore"><a href="/vacancy/${responses[i].vacancy.jobID}">Read More</a></p>
            </div>`
          }
        }
      }
      if(markup == '') {
        markup = 
        `<div class="card">
          <div class="card-content">
            <div class="row heading">
              <h3>No Data Found </h3>
            </div>
          </div>
        </div>`;
      }
      const cardWrapper = document.querySelectorAll('.card-wrapper');
      cardWrapper.forEach(el => el.innerHTML = markup)
      if(filter)
        loadPageBtn(Model, query);
    }
  } catch(err) {
    console.log(err.message);
    showAlert('error', err.message);
  }
}