Feature: Stock Management - Handling product orders

  Background:
    Given the api and database status is valid

  Scenario: Successful Buy Order Creation
    Given a product exists in the inventory
      | name   | price | productType   | quantity |
      | TShirt | 20.50 | miscellaneous | 100      |
    When I send a request to get current stock level for a product id "stored"
    Then the response status code should be 404
    And the response should match "product-stock-level-zero" with replaced values

#    When I send a request to create a new "buy" order with the following payload
#      | orderType | productId | quantity |
#      | buy       | stored    | 11       |
#    Then the response status code should be 201
