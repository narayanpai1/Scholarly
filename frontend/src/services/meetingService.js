const axios = require('axios');
import authService from './authService';

/***
 * Lets you perform different operations related to meetings
 * 
 * Sends requests to api/meeting if needed.
 */
export default {
  async add(data) {
    let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/api/meeting/', data, {
      headers: authService.getAuthHeaders(),
    });

    return response.data;
  },

  async getMeetingLink(meetingId) {
    let response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/api/meeting/' + meetingId,
      {
        headers: authService.getAuthHeaders(),
      },
    );

    return response.data;
  },

  async getAllMeetingsOfCourse(courseId) {
    let response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/api/meeting/getAllMeetings/' + courseId,
      {
        headers: authService.getAuthHeaders(),
      },
    );

    return response.data;
  },
};
