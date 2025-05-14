import { expect } from 'chai';
import { getProductStock } from '../../api/stock.js';
import { scenarioContext } from '../scenario-context.js';

export const assertOrderResponse = (responseData, expectedData) => {

  let orderType = expectedData.orderType;
  let quantity = expectedData.quantity;
  let currentStock = scenarioContext.getData('currentStock');

  expect(responseData['success']).to.equal(true);
  expect(responseData['orderId']).to.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
  expect(responseData['productId']).to.equal(expectedData.productId);
  expect(responseData['productName']).to.equal(expectedData.productName);
  expect(responseData['orderType']).to.equal(orderType);
  expect(responseData['quantity']).to.equal(quantity);
  expect(responseData['username']).to.equal(process.env.TEST_USERNAME);
  expect(responseData['timestamp']).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/);

  // Dynamic validation for stocks
  expect(responseData['previousStock']).to.equal(currentStock);
  expect(responseData['newStock']).to.equal(
    responseData['previousStock'] + (orderType === 'buy' ? quantity : -quantity)
  );

};

export const storeCurrentStock = async (productId) => {
  console.log('Getting current stock for product id: ' + productId);
  const productStockResponse = await getProductStock(productId);
  expect(productStockResponse.status).to.be.oneOf([200, 404]);
  scenarioContext.setData('currentStock', productStockResponse.data['currentStock']);
};

