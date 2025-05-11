import {Given, When, Then} from '@cucumber/cucumber';
import {addProduct, getAllProducts, getProductById, updateProduct} from "../../src/api/products.js";
import {scenarioContext} from "../../src/utils/scenario-context.js";
import {expect} from 'chai';
import dotenv from 'dotenv';
import {assertByReplacingValuesInFile, expectedFieldsCheck} from "../../src/utils/response-handler.js";
import {loggedIn} from "./auth-steps.js";
import {aProductExists, createProductRequested, productRetrieved} from "../../src/utils/helpers/product-helpers.js";

dotenv.config();

When('I send a request to get all products', async function () {
    let response = await getAllProducts();
    scenarioContext.setData('responseData', response);
});
Then('the response should be a list of products', function () {
    let response = scenarioContext.getData('responseData');
    expect(response.data).to.be.an('array');
});

Then('a product entry should have the following fields', function (dataTable) {
    let response = scenarioContext.getData('responseData');
    let firstEntry = response.data[0];
    expectedFieldsCheck(firstEntry, dataTable)
});

When('I send a request to create a product with the following payload', createProductRequested);

Then('successfully retrieved the created the product from the inventory', productRetrieved);

When('I send a request to create a product with the following payload without authentication', async function (dataTable) {
    let response = await addProduct(dataTable, false);
    scenarioContext.setData('responseData', response);
});

When('I send a request to update {string} product with the updated details', async function (productId, dataTable) {
    const headers = dataTable.raw()[0];
    const values = dataTable.raw()[1];
    const row = Object.fromEntries(headers.map((key, i) => [key, values[i]]));
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
    if (productId.includes('stored')) {
        productId = scenarioContext.getData('productId');
    }
    console.log("payload: " + JSON.stringify(payload) + "")
    let response = await updateProduct(productId, payload, true);
    scenarioContext.setData('responseData', response);
});

When('I send a request to update a product with the following payload without authentication', async function (dataTable) {
    let response = await updateProduct("any", dataTable, false);
    scenarioContext.setData('responseData', response);
});
When('I send a request to retrieve a product with {string}', async function (productId) {
    let response = await getProductById(productId);
    scenarioContext.setData('responseData', response);
});
Given('a product exists in the inventory', aProductExists);

Then('the response should match {string} with replaced values', async function (fileName) {
    const storedProductId = scenarioContext.getData('productId');

    await assertByReplacingValuesInFile(
        scenarioContext.getData('responseData'), // your actual response
        `tests/resources/response/${fileName}.json`,
        {
            'THE_PRODUCT_ID': storedProductId
        }
    );
});