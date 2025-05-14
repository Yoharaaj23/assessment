import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { scenarioContext } from '../../src/utils/scenario-context.js';
import { getStatus } from '../../src/api/status.js';
import {
  assertResponseMatchesFile,
  assertResponseStatusCode,
  expectedFieldsCheck
} from '../../src/utils/response-handler.js';
import { FileHandler } from '../../src/utils/file-handler.js';
import { getStoredValue } from '../../src/utils/helpers/context-helpers.js';

Given('the api and database status is valid', async function() {
  const response = await getStatus();
  expect(response.data['status']).to.equal('OK');
  expect(response.data['dbStatus']).to.equal('Connected');
});

Then('the response status code should be {int}', assertResponseStatusCode);

Then('the response should contain a {string} field', function fieldCheck(propertyName) {
  const response = scenarioContext.getData('response');
  expect(response.data).to.have.property(propertyName);
});

Then('the response should contain a {string} field with value {string}', function(propertyName, value) {
  if (value === '') {
    // Skip the check if the expected value is empty
    return;
  }
  value = getStoredValue(value, scenarioContext);

  const response = scenarioContext.getData('response');
  const actual = response.data[propertyName];
  expect(response.data).to.have.property(propertyName);
  const expected = !isNaN(value) ? Number(value) : value;
  expect(actual).to.equal(expected);
});

Then('the response should contain the following fields', function(dataTable) {
  const response = scenarioContext.getData('response');
  expectedFieldsCheck(response.data, dataTable);
});

Then('the response should match the expected file {string}', function(fileName) {
  const response = scenarioContext.getData('response');
  if (!response || !response.data) {
    throw new Error('No response data found in scenario context');
  }
  const expected = FileHandler.readJsonFile(`response/${fileName}`);
  assertResponseMatchesFile(response.data, expected);
});

Then('the response should contain the field with value', function(dataTable) {
  const response = scenarioContext.getData('response');
  const actualResponseData = response.data;
  const expectedFields = dataTable.raw()[0];

  for (let i = 0; i < expectedFields.length; i++) {
    let value = dataTable.raw()[1][i];
    value = getStoredValue(value, scenarioContext);
    let expectedValue = !isNaN(value) ? Number(value) : value;

    const fieldPath = expectedFields[i].split('.');
    let actualValue = actualResponseData;

    for (const key of fieldPath) {
      expect(actualValue).to.have.property(key);
      actualValue = actualValue[key];
    }
    expect(actualValue).to.equal(expectedValue);
  }
});

Then('the response time should be less than {int} milliseconds with {int}% threshold', function(expectedResponseTime, thresholdPercentage) {
  const response = scenarioContext.getData('response');
  expect(response).to.have.property('responseTime');
  const maxAllowedTime = expectedResponseTime * (1 + thresholdPercentage / 100);

  console.log(`Response time: ${response.responseTime}ms | Expected: ${expectedResponseTime}ms | Max allowed (${thresholdPercentage}%): ${maxAllowedTime}ms`);
  expect(response.responseTime,
    `Response time ${response.responseTime}ms exceeds maximum allowed time ${maxAllowedTime}ms (Expected: ${expectedResponseTime}ms + ${thresholdPercentage}% threshold)`
  ).to.be.below(maxAllowedTime);
});