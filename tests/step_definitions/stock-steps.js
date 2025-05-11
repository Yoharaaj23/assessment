import {When} from '@cucumber/cucumber';
import {getProductStock} from "../../src/api/stock.js";
import {scenarioContext} from "../../src/utils/scenario-context.js";

// When('I send a request to create a new {string} order with the following payload', function (dataTable) {
//     const headers = dataTable.raw()[0];
//     const values = dataTable.raw()[1];
//     const row = Object.fromEntries(headers.map((key, i) => [key, values[i]]));
//     console.log(row);
//     const payload = {};
//
// });

When('I send a request to get current stock level for a product id {string}', async function (productId) {
  if(productId.includes('stored')) {
       productId = scenarioContext.getData('productId');
   }
   console.log("productId: " + productId);
    let response = await getProductStock(productId);
    scenarioContext.setData('responseData', response);
});