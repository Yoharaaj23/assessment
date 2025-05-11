Feature: Product Management - Retrieve Product

  Background:
    Given the api and database status is valid

  Scenario: List all products from the inventory
    When I send a request to get all products
    Then the response status code should be 200
    And the response should be a list of products
    And a product entry should have the following fields
      | productId   |
      | name        |
      | price       |
      | productType |
      | quantity    |
      | createdAt   |

    Scenario: Retrieve a product - Unknown Product Id
      When I send a request to retrieve a product with "id"
      Then the response status code should be 404
      And the response should contain a "message" field with value "Product not found"