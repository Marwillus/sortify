import axios from 'axios';

export const getParamValues = (url) => {
  return url
    .slice(1)
    .split('&')
    .reduce((initial, item) => {
      const [title, value] = item.split('=');
      initial[title] = value;
      return initial;
    }, {});
};
const setAuthHeader = () => {
  try {
    const params = JSON.parse(localStorage.getItem('params'));
    if (params) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${params.access_token}`;
     
    }
  } catch (error) {
    console.log('Error setting auth', error);
  }
}; 



export default setAuthHeader