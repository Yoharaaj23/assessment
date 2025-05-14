import { makeRequest } from './api-client.js';

const getAllProducts = async () => {
  return await makeRequest('GET', '/products', {}, {}, {}, false);
};

const addProduct = async (productData, requiresAuth = true) => {
  return await makeRequest('POST', '/products', {}, productData, {}, requiresAuth);
};

const updateProduct = async (id, productData, requiresAuth = true) => {
  return await makeRequest('PUT', `/products/${id}`, {}, productData, {}, requiresAuth);
};

const deleteProduct = async (id, requiresAuth = true) => {
  return await makeRequest('DELETE', `/products/${id}`, {}, {}, {}, requiresAuth);
};

const getProductById = async (id) => {
  return await makeRequest('GET', `/products/${id}`, {}, {}, {}, false);
};

export { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById };