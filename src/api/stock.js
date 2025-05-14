import { makeRequest } from './api-client.js';

const createOrder = async (orderData, requiresAuth = true) => {
  return await makeRequest('POST', '/orders', {}, orderData, {}, requiresAuth);
};

const getProductStock = async (productId, requiresAuth = true) => {
  return await makeRequest('GET', `/orders/product/${productId}`, {}, {}, {}, requiresAuth);
};

export { createOrder, getProductStock };