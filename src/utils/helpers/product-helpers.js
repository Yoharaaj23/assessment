import { scenarioContext } from '../scenario-context.js';
import { addProduct, getProductById } from '../../api/products.js';
import { expect } from 'chai';
import { loggedIn } from '../../../tests/step_definitions/auth-steps.js';
import { assertResponseStatusCode } from '../response-handler.js';
import { getStoredValue } from './context-helpers.js';

export async function createProductRequest(dataTable) {
  const [headers, values] = dataTable.raw();
  const row = Object.fromEntries(headers.map((key, i) => [key, values[i]]));
  const payload = {};


  scenarioContext.setData('productPrice', parseFloat(row.price));
  scenarioContext.setData('productType', row.productType);
  scenarioContext.setData('productQuantity', parseInt(row.quantity));

  if (row.name) {
    if (row.name.includes('stored-')) {
      payload.name = getStoredValue(row.name, scenarioContext);
    } else
      payload.name = `${row.name}_${Date.now()}`;
    scenarioContext.setData('productName', payload.name);
  }
  if (row.price) {
    payload.price = parseFloat(row.price);
  }
  if (row.productType) {
    payload.productType = row.productType;
  }
  if (row.quantity) payload.quantity = parseInt(row.quantity);

  let response = await addProduct(payload, true);
  scenarioContext.setData('response', response);
}

export async function productRetrieved() {
  let response = scenarioContext.getData('response');
  let createdAt = response.data['createdAt'];
  let productId = response.data['productId'];

  console.log('Product ID: ' + productId);
  scenarioContext.setData('productId', productId);

  let getProductByIdResponse = await getProductById(productId);
  console.log(`Get a Product by its ID Response:  ${JSON.stringify(getProductByIdResponse.data)}`);

  expect(getProductByIdResponse.status).to.equal(200);
  expect(getProductByIdResponse.data['productId']).to.equal(productId);
  expect(getProductByIdResponse.data['name']).to.equal(scenarioContext.getData('productName'));
  expect(getProductByIdResponse.data['price']).to.equal(scenarioContext.getData('productPrice'));
  expect(getProductByIdResponse.data['productType']).to.equal(scenarioContext.getData('productType'));
  expect(getProductByIdResponse.data['quantity']).to.equal(scenarioContext.getData('productQuantity'));
  expect(getProductByIdResponse.data['createdAt']).to.equal(createdAt);
}

export async function aProductExists(dataTable) {
  await loggedIn();
  await createProductRequest(dataTable);
  assertResponseStatusCode(201);
  await productRetrieved();

}
