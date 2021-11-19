const axios = require('axios');

export default {
  uploadImage(data) {
    return axios.post(process.env.REACT_APP_BACKEND_URL + '/', data, {}).then((res) => {
      return res.data;
    });
  },
};
