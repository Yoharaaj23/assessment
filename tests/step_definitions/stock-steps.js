import { When, Then } from '@cucumber/cucumber';
import { createOrder, getProductStock } from '../../src/api/stock.js';
import { scenarioContext } from '../../src/utils/scenario-context.js';
import { expect } from 'chai';
import { assertOrderResponse, storeCurrentStock } from '../../src/utils/helpers/order-helpers.js';
import { getStoredValue } from '../../src/utils/helpers/context-helpers.js';

When('I send a request to create a new {string} order with the following payload', async function(orderType, dataTable) {
  const fields = dataTable.raw()[0];
  const values = dataTable.raw()[1];
  const row = Object.fromEntries(fields.map((key, i) => [key, values[i]]));
  console.log(row);
  const payload = {};

  row.productId = getStoredValue(row.productId, scenarioContext);

  if (row.orderType) {
    payload.orderType = row.orderType;
  }
  if (row.productId) {
    payload.productId = row.productId;
  }
  if (row.quantity) {
    payload.quantity = parseInt(row.quantity);
    scenarioContext.setData(`${orderType}OrderQuantity`, parseInt(row.quantity));
  }

  await storeCurrentStock(payload.productId);
  const response = await createOrder(payload, true);
  scenarioContext.setData('response', response);
});

When('I send a request to get current stock level for a product id {string}', async function(productId) {
  productId = getStoredValue(productId, scenarioContext);
  console.log('Getting current stock for product id: ' + productId);
  const response = await getProductStock(productId);
  scenarioContext.setData('response', response);
});

When('I send a request to create a new {string} order with the following payload without authentication', async function(orderType, dataTable) {
  const response = await createOrder(dataTable, false);
  scenarioContext.setData('response', response);
});

When('I send a request to get current stock level for a product id {string} without authentication', async function(productId) {
  const response = await getProductStock(productId, false);
  scenarioContext.setData('response', response);
});

Then('the {string} order response should be valid', function(orderType) {
  const response = scenarioContext.getData('response');
  const responseData = response.data;

  assertOrderResponse(responseData, {
    productId: scenarioContext.getData('productId'),
    productName: scenarioContext.getData('productName'),
    orderType: orderType,
    quantity: scenarioContext.getData(`${orderType}OrderQuantity`)
  });
});

Then('the {string} current stock level should reflect all {int} completed transactions', async function(productId, totalTransactions) {
  productId = getStoredValue(productId, scenarioContext);
  const response = await getProductStock(productId);
  const totalBuys = scenarioContext.getData('buyOrderQuantity');
  const totalSells = scenarioContext.getData('sellOrderQuantity');

  expect(response.status).to.equal(200);
  expect(response.data['productId']).to.equal(productId);
  expect(response.data['totalBuys']).to.equal(totalBuys);
  expect(response.data['totalSells']).to.equal(totalSells);
  expect(response.data['currentStock']).to.equal(totalBuys - totalSells);
  expect(response.data['totalTransactions']).to.equal(totalTransactions);
});