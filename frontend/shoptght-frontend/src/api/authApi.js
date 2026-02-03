import axiosClient from './axiosClient';

const authApi = {
  register(data) {
    return axiosClient.post('/auth/register', data);
  },
  login(data) {
    return axiosClient.post('/auth/token', data);
  },
  validate(token) {
    return axiosClient.get(`/auth/validate?token=${token}`);
  }
};

export default authApi;