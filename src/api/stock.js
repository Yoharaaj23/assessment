import {makeRequest} from "./api-client.js";

const createOrder = async (orderData) => {
    return await makeRequest('POST', '/orders', {}, orderData, {}, true)
}

const getProductStock = async (productId) => {
   return await makeRequest('GET', `/orders/product/${productId}`, {}, {}, {}, true);
}

export {createOrder, getProductStock};