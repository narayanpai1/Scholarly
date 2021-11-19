import axios from 'axios';
import authService from './authService';
import baseAPIService from './baseAPIService';

class courseService extends baseAPIService {
  constructor() {
    super('/course');
  }

  getAllFormsOfCourse(courseId) {
    return axios
      .get(this.url + '/forms/' + courseId, { headers: authService.getAuthHeaders() })
      .then((response) => {
        console.log(response.data);
        return response.data;
      });
  }

  getEnrolledCourses() {
    return axios
      .get(this.url + '/enrolled', { headers: authService.getAuthHeaders() })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      });
  }
}

export default new courseService();
