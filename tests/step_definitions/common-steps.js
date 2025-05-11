import {Given, Then} from '@cucumber/cucumber';
import {expect} from 'chai';
import {scenarioContext} from "../../src/utils/scenario-context.js";
import {getStatus} from "../../src/api/status.js";
import {
    assertResponseMatchesFile,
    assertResponseStatusCode,
    expectedFieldsCheck
} from "../../src/utils/response-handler.js";
import * as ResponseHandler from "../../src/utils/response-handler.js";
import {FileHandler} from "../../src/utils/file-handler.js";

Then('the response status code should be {int}', assertResponseStatusCode);

Then('the response should contain a {string} field', function fieldCheck(propertyName) {
    let response = scenarioContext.getData('responseData');
    expect(response.data).to.have.property(propertyName);
});

Then('the response should contain a {string} field with value {string}', function (propertyName, value) {
    let response = scenarioContext.getData('responseData');
    expect(response.data).to.have.property(propertyName);
    expect(response.data[propertyName]).to.equal(value);
});
Given('the api and database status is valid', async function () {
    let response = await getStatus();
    console.log(response.data);
    expect(response.data["status"]).to.equal('OK');
    expect(response.data["dbStatus"]).to.equal('Connected');
});
Then('the response should contain the following fields', function (dataTable) {
    let response = scenarioContext.getData('responseData');
    expectedFieldsCheck(response.data, dataTable)
});
Then('the response should match the expected file {string}', function (fileName) {
    let response = scenarioContext.getData('responseData');
    if (!response || !response.data) {
        throw new Error('No response data found in scenario context');
    }
    const expected = FileHandler.readJsonFile(`response/${fileName}`);
    assertResponseMatchesFile(response.data, expected);
});
