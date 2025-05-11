import {makeRequest} from "./api-client.js";

const getStatus = async () => {
    return await makeRequest('GET', '/status', {}, {}, {}, false);
};

export {getStatus};