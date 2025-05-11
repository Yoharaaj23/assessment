Feature: Product Management - Create Product

  Background:
    Given the api and database status is valid

  Scenario Outline: Successfully create a valid product - <name> - <productType>
    Given I logged into the inventory management with a valid user
    When I send a request to create a product with the following payload
      | name   | price   | productType   | quantity   |
      | <name> | <price> | <productType> | <quantity> |
    Then the response status code should be 201
    And the response should contain the following fields
      | productId   |
      | name        |
      | price       |
      | productType |
      | quantity    |
      | createdAt   |
    And successfully retrieved the created the product from the inventory

    Examples:
      | name     | price  | productType        | quantity |
      | Halo     | 15.10  | games              | 1        |
      | Mouse    | 20.00  | computer accessory | 100      |
      | MacBook  | 999.9  | laptops            | 10       |
      | Notebook | 3.00   | miscellaneous      | 100000   |
      | Pixel 7  | 250.00 | mobile             | 99       |

  Scenario Outline: Create a product - Invalid Value
    Given I logged into the inventory management with a valid user
    When I send a request to create a product with the following payload
      | name   | price   | productType   | quantity   |
      | <name> | <price> | <productType> | <quantity> |
    Then the response status code should be 400
    And the response should match the expected file "<fileName>"

    Examples:
      | name   | price | productType   | quantity | fileName                 |
      |        | 15.10 | game          | 1        | invalid_name_productType |
      | Wonder | 0     | miscellaneous | 1        | invalid_price            |
      |        |       | mobile        | 12       | invalid_name_price       |

  Scenario: Create a product - No Authentication
    When I send a request to create a product with the following payload without authentication
      | name | price | productType | quantity |
      | Halo | 15.10 | games       | 1        |
    Then the response status code should be 401
    And the response should contain a "message" field with value "No token, authorization denied"

#    todo - early perf tests