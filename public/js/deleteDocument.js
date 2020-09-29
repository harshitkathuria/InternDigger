import { showAlert } from './alert';

export const deleteVacancy = async(id) => {
  if(!confirm('Are your sure you want to dlete this vacancy?'))
    return;

  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/interndigger/api/v1/vacancy/${id}`
    });
  
    showAlert('success', 'Vacancy Deleted');
    window.setTimeout(() => window.location.reload(), 1500);
  } catch (err) {
    showAlert('Try again later');
    console.log(err.response.data.message);
  }  
}