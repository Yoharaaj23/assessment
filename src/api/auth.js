import { makeRequest } from './api-client.js';

const login = async (username, password) => {
  try {
    const body = {
      username: username,
      password: password
    };
    return await makeRequest('POST', '/auth/login', {}, body, {}, false);
  } catch (error) {
    return error;
  }
};
export { login };