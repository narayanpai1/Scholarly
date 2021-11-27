import axios from 'axios';
import authService from './authService';
import baseAPIService from './baseAPIService';

/***
 * Lets you perform different operations related to forms/tests
 * 
 * Sends requests to api/form if needed.
 */
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

  getMyResponse(formId) {
    return axios
      .get(this.url + '/getmyresponse/' + formId, { headers: authService.getAuthHeaders() })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      });
  }
}

export default new formService();
