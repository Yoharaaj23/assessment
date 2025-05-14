import { expect } from 'chai';
import { scenarioContext } from './scenario-context.js';

function expectedFieldsCheck(actualResponseData, expectedDataTable) {
  const expectedFields = expectedDataTable.raw().map(row => row[0]);

  expectedFields.forEach(field => {

    const fieldPath = field.split('.');
    let actualValue = actualResponseData;

    for (const key of fieldPath) {
      expect(actualValue).to.have.property(key);
      actualValue = actualValue[key];
    }
  });

}

function assertResponseMatchesFile(actualResponseData, expectedJson) {
  expect(actualResponseData).to.deep.equal(expectedJson);
}

function assertResponseStatusCode(expectedStatusCode) {
  let response = scenarioContext.getData('response');
  expect(response.status).to.equal(expectedStatusCode);
}

export { expectedFieldsCheck, assertResponseMatchesFile, assertResponseStatusCode };
