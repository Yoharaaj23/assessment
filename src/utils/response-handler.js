import {expect} from "chai";
import {scenarioContext} from "./scenario-context.js";
import path from "path";
import fs from "fs";

function expectedFieldsCheck(actualResponseData, expectedDataTable){
    const expectedFields = expectedDataTable.raw().map(row => row[0]);
    console.log(expectedFields);
    expectedFields.forEach(field => {
        expect(actualResponseData).to.have.property(field);
    });
}

function assertResponseMatchesFile(actualResponseData, expectedJson){
    expect(actualResponseData).to.deep.equal(expectedJson);
}

function assertResponseStatusCode(expectedStatusCode) {
    let response = scenarioContext.getData('responseData');
    expect(response.status).to.equal(expectedStatusCode);
}
async function assertByReplacingValuesInFile (response, filePath, replacements) {
    // Read the expected response file

    let expectedResponse = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf8')
    );

    // Convert to string to perform replacements
    let expectedResponseStr = JSON.stringify(expectedResponse);

    // Replace all placeholders with actual values
    Object.entries(replacements).forEach(([placeholder, value]) => {
        expectedResponseStr = expectedResponseStr.replace(
            new RegExp(placeholder, 'g'), value
        );
    });

    // Parse back to object
    expectedResponse = JSON.parse(expectedResponseStr);

    // Compare with actual response
    assertResponseMatchesFile(response.data, expectedResponse);
}


export {expectedFieldsCheck, assertResponseMatchesFile, assertResponseStatusCode, assertByReplacingValuesInFile};
