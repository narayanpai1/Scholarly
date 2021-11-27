import axios from 'axios';
import jwtDecode from 'jwt-decode';
const API_URL = process.env.REACT_APP_BACKEND_URL + '/api/user/';

/***
 * Different operations related to authentication, creating an account etc.
 * 
 * Sends requests to api/user if needed.
 */
var authService = {
  isAuthenticated() {
    const token = localStorage.getItem('userTicket');
    if (token) {
      return true;
    } else {
      return false;
    }
  },

  get() {
    return axios.get(API_URL, { headers: authService.getAuthHeaders() }).then((response) => {
      return response.data;
    });
  },

  edit(user) {
    return axios.put(API_URL, user, { headers: authService.getAuthHeaders() }).then((response) => {
      return response;
    });
  },

  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },

  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },

  login(data, fromGoogle) {
    let endPoint = fromGoogle ? 'googleLogin' : 'login';
    return axios.post(API_URL + endPoint, data).then((response) => {
      if (response.data && response.data.accessToken) {
        localStorage.setItem('userTicket', JSON.stringify(response.data.accessToken));
      }
      return response;
    });
  },

  loginWithGoogle(res) {
    var data = {
      name: res.profileObj.name,
      email: res.profileObj.email,
      image: res.profileObj.imageUrl,
    };

    if(!res.profileObj.imageUrl){
      data.image=res.profileObj.image;
    }

    if (res.isStudent !== undefined) {
      data.isStudent = res.isStudent;
    }

    return authService.login(data, true);
  },

  loginWithMail(user) {
    var data = {
      email: user.email,
      password: user.password,
    };

    return authService.login(data);
  },

  signUp(user) {
    return axios.post(API_URL + 'signup', user).then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem('userTicket', JSON.stringify(response.data.accessToken));
      }
      return response;
    });
  },

  logout() {
    localStorage.removeItem('userTicket');
  },

  getCurrentUser() {
    let userTicket = localStorage.getItem('userTicket');
    if (!userTicket) return '';
    console.log(jwtDecode(userTicket));
    return jwtDecode(userTicket);
  },

  getAuthHeaders() {
    return {
      authorization: 'Bearer ' + localStorage.getItem('userTicket').slice(1, -1),
    };
  },
};

export default authService;
