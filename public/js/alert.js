// Alerts.......................

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if(el)
    el.remove();
}

export const showAlert = (type, msg, time = 7) => {
  
  hideAlert();
  const innerHtml = `<div class='alert alert-${type}'>${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', innerHtml);

  window.setTimeout(hideAlert, time * 1000);
}