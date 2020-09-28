import { showAlert } from './alert';

export const updateUserData = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/interndigger/api/v1/users/updateMe',
      data
    });
  
    if(res.data.status === 'success') {
      showAlert('success', 'Profile Updated');
      window.setTimeout(() => window.location.reload(), 1000);
    }
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
}

export const updateUserPassword = async(data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/interndigger/api/v1/users/updateMyPassword',
      data
    });
  
    if(res.data.status === 'success') {
      showAlert('success', 'Password Updated Successfully');
      window.setTimeout(() => window.location.reload(), 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response.data.message);
  }
}