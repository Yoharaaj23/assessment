Feature: Product Management - Update Product

  Scenario Outline: Successfully update a valid product
    Given I logged into the inventory management with a valid user
    When I send a request to create a product with the following payload
      | name | price | productType | quantity |
      | Cars | 11.10 | games       | 1        |
    Then the response status code should be 201
    And successfully retrieved the created the product from the inventory
    When I send a request to update "stored" product with the updated details
      | name   | price   | productType   | quantity   |
      | <name> | <price> | <productType> | <quantity> |
    Then the response status code should be 200
    And successfully retrieved the created the product from the inventory

    Examples:
      | name        | price | productType   | quantity |
      |             | 15.10 | game          | 10       |
      | UpdatedName | 0     | miscellaneous | 10       |
      |             |       | mobile        | 120      |

  Scenario: Update a product - Unknown Product Id
    Given I logged into the inventory management with a valid user
    When I send a request to update "unknown-id" product with the updated details
      | name | price  | productType | quantity |
      | Cars | 111.10 | games       | 1        |
    Then the response status code should be 404
    And the response should contain a "message" field with value "Product not found"

  Scenario: Update a product - No Authentication
    When I send a request to update a product with the following payload without authentication
      | name | price | productType | quantity |
      | Halo | 15.10 | games       | 1        |
    Then the response status code should be 401
    And the response should contain a "message" field with value "No token, authorization denied"