@create-product
Feature: Product Management - Create Product

  Background:
    Given the api and database status is valid

  @positive @retrieve-product
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

  @negative
  Scenario Outline: Create a product - Invalid Value
    Given I logged into the inventory management with a valid user
    When I send a request to create a product with the following payload
      | name   | price   | productType   | quantity   |
      | <name> | <price> | <productType> | <quantity> |
    Then the response status code should be 400
    And the response should match the expected file "<fileName>"

    Examples:
      | name   | price   | productType   | quantity | fileName                 |
      |        | 105.101 | game          | 11       | invalid_name_productType |
      | Wonder | 0       | miscellaneous | 1        | invalid_price            |
      |        |         | laptops       | 1123432  | invalid_name_price       |

  @negative
  Scenario: Validate duplicate product creation
    Given I logged into the inventory management with a valid user
    When I send a request to create a product with the following payload
      | name  | price | productType | quantity |
      | Halo3 | 51.10 | games       | 11       |
    Then the response status code should be 201
    When I send a request to create a product with the following payload
      | name               | price | productType | quantity |
      | stored-productName | 51.10 | games       | 11       |
    Then the response status code should be 400
    And the response should contain the following fields
      | message              |
      | conflict.existingId  |
      | conflict.name        |
      | conflict.productType |
    And the response should contain a "message" field with value "Product with this name and type already exists"

  @negative
  Scenario: Create a product - No Authentication
    When I send a request to create a product with the following payload without authentication
      | name | price | productType | quantity |
      | Halo | 15.10 | games       | 1        |
    Then the response status code should be 401
    And the response should contain a "message" field with value "No token, authorization denied"

  @e2e @retrieve-product @update-product @delete-product
  Scenario: Product Management - E2E
    Given a product exists in the inventory
      | name | price  | productType | quantity |
      | Asus | 999.10 | laptops     | 1        |
    When I send a request to update "stored-productId" product with the updated details
      | name | price  | productType | quantity |
      | Dell | 888.10 | laptops     | 2        |
    Then the response status code should be 200
    And successfully retrieved the created the product from the inventory
    When I send a request to delete a product with "stored-productId"
    Then the response status code should be 200
    And the response should contain a "message" field with value "Product removed"
    When I send a request to retrieve a product with "stored-productId"
    Then the response status code should be 404