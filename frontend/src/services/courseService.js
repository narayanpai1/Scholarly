import axios from 'axios';
import authService from './authService';
import baseAPIService from './baseAPIService';

/***
 * Lets you perform different operations related to courses
 * 
 * Sends requests to api/course if needed.
 */
class courseService extends baseAPIService {
  constructor() {
    super('/course');
  }

  getAllFormsOfCourse(courseId) {
    return axios
      .get(this.url + '/forms/' + courseId, { headers: authService.getAuthHeaders() })
      .then((response) => {
        return response.data;
      });
  }

  getEnrolledCourses() {
    return axios
      .get(this.url + '/enrolled', { headers: authService.getAuthHeaders() })
      .then((response) => {
        return response.data;
      });
  }
}

export default new courseService();
