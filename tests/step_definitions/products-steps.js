import { Given, Then, When } from '@cucumber/cucumber';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../../src/api/products.js';
import { scenarioContext } from '../../src/utils/scenario-context.js';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { expectedFieldsCheck } from '../../src/utils/response-handler.js';
import { aProductExists, createProductRequest, productRetrieved } from '../../src/utils/helpers/product-helpers.js';
import { getStoredValue } from '../../src/utils/helpers/context-helpers.js';

dotenv.config();

Given('a product exists in the inventory', aProductExists);

When('I send a request to get all products', async function() {
  const response = await getAllProducts();
  scenarioContext.setData('response', response);
});

When('I send a request to create a product with the following payload', createProductRequest);

When('I send a request to create a product with the following payload without authentication', async function(dataTable) {
  const response = await addProduct(dataTable, false);
  scenarioContext.setData('response', response);
});

When('I send a request to update {string} product with the updated details', async function(productId, dataTable) {
  const fields = dataTable.raw()[0];
  const values = dataTable.raw()[1];
  const row = Object.fromEntries(fields.map((key, i) => [key, values[i]]));
  const payload = {};

  if (row.name) {
    payload.name = row.name;
    scenarioContext.setData('productName', row.name);
  }
  if (row.price) {
    payload.price = parseFloat(row.price);
    scenarioContext.setData('productPrice', parseFloat(row.price));
  }
  if (row.productType) {
    payload.productType = row.productType;
    scenarioContext.setData('productType', row.productType);
  }
  if (row.quantity) {
    payload.quantity = parseInt(row.quantity);
    scenarioContext.setData('productQuantity', parseInt(row.quantity));
  }
  productId = getStoredValue(productId, scenarioContext);
  console.log('Update Product payload: ' + JSON.stringify(payload) + '');
  const response = await updateProduct(productId, payload);
  scenarioContext.setData('response', response);
});

When('I send a request to update a product with the following payload without authentication', async function(dataTable) {
  const response = await updateProduct('any', dataTable, false);
  scenarioContext.setData('response', response);
});

When('I send a request to retrieve a product with {string}', async function(productId) {
  productId = getStoredValue(productId, scenarioContext);
  const response = await getProductById(productId);
  scenarioContext.setData('response', response);
});


When('I send a request to delete a product with {string}', async function(productId) {
  productId = getStoredValue(productId, scenarioContext);
  const response = await deleteProduct(productId);
  scenarioContext.setData('response', response);
});

When('I send a request to delete a product with the following payload without authentication', async function(productId) {
  const response = await deleteProduct(productId, false);
  scenarioContext.setData('response', response);
});

Then('the response should be a list of products', function() {
  const response = scenarioContext.getData('response');
  expect(response.data).to.be.an('array');
});

Then('a product entry should have the following fields', function(dataTable) {
  const response = scenarioContext.getData('response');
  const firstEntry = response.data[0];
  expectedFieldsCheck(firstEntry, dataTable);
});

Then('successfully retrieved the created the product from the inventory', productRetrieved);