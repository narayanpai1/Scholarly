const axios = require('axios');

/***
 * A service to upload images related to anything in the app.
 */
export default {
  uploadImage(data) {
    return axios.post(process.env.REACT_APP_BACKEND_URL + '/', data, {}).then((res) => {
      return res.data;
    });
  },
};
