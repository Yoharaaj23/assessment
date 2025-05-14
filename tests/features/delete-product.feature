@delete-product
Feature: Product Management - Delete Product

  Background:
    Given the api and database status is valid

  @positive
  Scenario: Delete a product
    Given a product exists in the inventory
      | name   | price | productType   | quantity |
      | TShirt | 20.50 | miscellaneous | 100      |
    When I send a request to delete a product with "stored-productId"
    Then the response status code should be 200
    And the response should contain a "message" field with value "Product removed"

  @negative
  Scenario: Delete a product - Unknown Product Id
    Given I logged into the inventory management with a valid user
    When I send a request to delete a product with "unknown-id"
    Then the response status code should be 404
    And the response should contain a "message" field with value "Product not found"

  @negative
  Scenario: Delete a product - No Authentication
    When I send a request to delete a product with the following payload without authentication
      | name | price | productType | quantity |
      | Halo | 15.10 | games       | 1        |
    Then the response status code should be 401
    And the response should contain a "message" field with value "No token, authorization denied"