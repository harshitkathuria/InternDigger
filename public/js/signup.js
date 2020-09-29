import { showAlert } from './alert';

export const signup = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/interndigger/api/v1/users/signup',
      data
    });
  
    if(res.data.status === 'success') {
      showAlert('success', 'Acoount Created');
      window.setTimeout(() => {
        if(res.data.data.user.role === 'candidate')
          location.assign('/userHome');
        else 
          location.assign('/me')
      }, 1500);
    }
  } catch(err) {
    console.log(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
}