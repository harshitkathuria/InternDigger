import { showAlert } from "./alert";

const postBtn = document.getElementById('btn-post');

export const post = async (data) => {
  try{
    const res = await axios({
      method: 'POST',
      url: '/interndigger/api/v1/vacancy',
      data
    })
    if(res.data.status === 'success') {
      postBtn.disabled = true;
      postBtn.classList.remove('btn-up');
      postBtn.style.opacity = '0.7';
      console.log('vacancy created')
      showAlert('success', 'Vacancy Created');
      window.setTimeout(() => window.location.reload(), 2000);
    }
  } catch(err) {
    showAlert('error', err);
    console.log(err.response.data.message);
  }
}

const applyBtn = document.querySelector('.btn-apply');

export const createResponse = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/interndigger/api/v1/response',
      data: {
        vacancy: window.vacancyID,
      }
    })
    if(res.data.status === 'success') {
      applyBtn.textContent = 'Applied';
      applyBtn.disabled = true;
      applyBtn.classList.remove('btn-up');
      applyBtn.style.opacity = '0.7';
      
      showAlert('success', 'You have Applied for this internship')
      window.setTimeout(() => window.location.reload(), 2000);
    }
  } catch(err) {
    console.log(err.response.data.message);
    showAlert('error', err);
  }
}