import axios from 'axios';
import authService from './authService';

/***
 * The base class for different REST APIs in the app.
 * 
 * Get a resource: GET /<resource_name>/:res_id
 * Get all the resources: GET /<resource_name>
 * Create a resource: POST /<resource_name>
 * Update a resource: PUT /<resource_name>/:res_id
 * Delete a resource: DELETE /<resource_name>/:res_id
 */
class baseAPIService {
  constructor(endpoint) {
    this.url = baseAPIService.BASE_URL + endpoint;
  }

  async get(id) {
    let response = await axios.get(this.url + '/' + id, {
      headers: authService.getAuthHeaders(),
    });
    return response.data;
  }

  async getAll() {
    let response = await axios.get(this.url, { headers: authService.getAuthHeaders() });
    return response.data;
  }

  async delete(id) {
    let response = await axios.delete(this.url + '/' + id, {
      headers: authService.getAuthHeaders(),
    });
    return response.data;
  }

  async add(data) {
    let response = await axios.post(this.url, data, { headers: authService.getAuthHeaders() });
    return response.data;
  }

  async edit(id, data) {
    let response = await axios.put(this.url + '/' + id, data, {
      headers: authService.getAuthHeaders(),
    });
    return response.data;
  }
}

baseAPIService.BASE_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default baseAPIService;
