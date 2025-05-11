import {expect} from 'chai';

const validateProductDetails = (actualProduct, expectedDetails) => {
    const fieldsToValidate = {
        productId: 'productId',
        name: 'productName',
        price: 'productPrice',
        productType: 'productType',
        quantity: 'productQuantity',
        createdAt: 'ProductCreatedAt'
    };

    Object.entries(fieldsToValidate).forEach(([productField, contextKey]) => {
        expect(actualProduct[productField]).to.equal(expectedDetails[contextKey]);
    });
};

const verifyRetrievedProduct = async (scenarioContext, getProductById) => {
    const response = scenarioContext.getData('responseData');
    const productId = response.data["productId"];

    const getProductByIdResponse = await getProductById(productId);
    expect(getProductByIdResponse.status).to.equal(200);

    validateProductDetails(getProductByIdResponse.data, {
        productId: productId,
        productName: scenarioContext.getData('productName'),
        productPrice: scenarioContext.getData('productPrice'),
        productType: scenarioContext.getData('productType'),
        productQuantity: scenarioContext.getData('productQuantity'),
        ProductCreatedAt: scenarioContext.getData('ProductCreatedAt')
    });

    return getProductByIdResponse;
};

module.exports = {
    validateProductDetails,
    verifyRetrievedProduct
};