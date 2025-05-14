import axios from 'axios';
import dotenv from 'dotenv';
import { scenarioContext } from '../utils/scenario-context.js';

dotenv.config();

/**
 * Makes HTTP requests to REST APIs
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} endpoint - The endpoint path to append to base URL
 * @param {null} params - (optional) The parameters to add in the request
 * @param {null} body - (optional) The request body
 * @param {Object} [headers] - (optional) Custom headers for the request
 * @param requiresAuth - To define the authentication requirement
 * @returns {Promise} Response from the API
 */

const makeRequest = async (method, endpoint, params = null, body = null, headers = {}, requiresAuth = false) => {
  try {
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (requiresAuth) {
      const token = scenarioContext.getData('authToken'); // or however you store your token
      if (!token) {
        throw new Error('Authentication required but no token found');
      }
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const url = `${process.env.API_BASE_URL}${endpoint}`;
    const startTime = Date.now();
    const response = await axios({
      method: method.toUpperCase(),
      url,
      params: params,
      data: body,
      headers: requestHeaders
    });
    response.responseTime = Date.now() - startTime;
    return response;

  } catch (error) {
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};

export { makeRequest };