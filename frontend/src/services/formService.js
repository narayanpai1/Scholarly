import axios from 'axios';
import authService from './authService';
import baseAPIService from './baseAPIService';

class formService extends baseAPIService {
  constructor() {
    super('/form');
  }

  submitResponse(data) {
    return axios
      .post(this.url + '/addresponse', data, { headers: authService.getAuthHeaders() })
      .then((response) => {
        console.log(response.data);
        return response.data;
      });
  }

  getResponse(formId) {
    return axios
      .get(this.url + '/getresponse/' + formId, { headers: authService.getAuthHeaders() })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      });
  }
}

export default new formService();
