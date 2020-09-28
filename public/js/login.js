import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/interndigger/api/v1/users/login',
      data: {
        email,
        password
      }
    });
  
    if(res.data.status === 'success') {
      showAlert('success', 'Logged In successfully');
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

export const logOut = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/interndigger/api/v1/users/logout'
    });

    if(res.data.status === 'success') {
      location.assign('/');
    }
  } catch(err) {
    console.log(err);
    showAlert('error', 'Please try again later...');
  }
}