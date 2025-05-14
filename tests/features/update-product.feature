@update-product
Feature: Product Management - Update Product

  @positive
  Scenario Outline: Successfully update a valid product
    Given a product exists in the inventory
      | name        | price | productType | quantity |
      | Bike Racing | 10.10 | games       | 1        |
    When I send a request to update "stored-productId" product with the updated details
      | name   | price   | productType   | quantity   |
      | <name> | <price> | <productType> | <quantity> |
    Then the response status code should be 200
    And successfully retrieved the created the product from the inventory

    Examples:
      | name        | price   | productType   | quantity |
      |             | 1233.11 | laptops       | 110      |
      | UpdatedName | 0       | miscellaneous | 10       |
      |             |         | mobile        | 120      |

  @negative
  Scenario: Update a product - Unknown Product Id
    Given I logged into the inventory management with a valid user
    When I send a request to update "unknown-id" product with the updated details
      | name | price  | productType | quantity |
      | Cars | 111.10 | games       | 1        |
    Then the response status code should be 404
    And the response should contain a "message" field with value "Product not found"

  @negative
  Scenario: Update a product - No Authentication
    When I send a request to update a product with the following payload without authentication
      | name | price | productType | quantity |
      | Halo | 15.10 | games       | 1        |
    Then the response status code should be 401
    And the response should contain a "message" field with value "No token, authorization denied"