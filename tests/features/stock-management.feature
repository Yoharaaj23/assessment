@orders @stock
Feature: Stock Management - Handling product orders

  Background:
    Given the api and database status is valid

  @stock @buy @positive
  Scenario: Successful Buy Order Creation - First Order For A Product
    Given a product exists in the inventory
      | name   | price | productType   | quantity |
      | TShirt | 20.50 | miscellaneous | 100      |
    When I send a request to get current stock level for a product id "stored-productId"
    Then the response status code should be 404
    And the response should contain the field with value
      | message                          | productId        | currentStock |
      | No orders found for this product | stored-productId | 0            |
    When I send a request to create a new "buy" order with the following payload
      | orderType | productId        | quantity |
      | buy       | stored-productId | 11       |
    Then the response status code should be 201
    And the "buy" order response should be valid

  @e2e @stock @orders @buy @sell @positive
  Scenario: Validate Stock Management - Buy & Sell orders
    Given a product exists in the inventory
      | name    | price  | productType        | quantity |
      | Monitor | 120.50 | computer accessory | 10       |
    When I send a request to get current stock level for a product id "stored-productId"
    Then the response status code should be 404
    And the response should contain the field with value
      | message                          | productId        | currentStock |
      | No orders found for this product | stored-productId | 0            |
    When I send a request to create a new "buy" order with the following payload
      | orderType | productId        | quantity |
      | buy       | stored-productId | 20       |
    Then the response status code should be 201
    And the "buy" order response should be valid
    When I send a request to create a new "sell" order with the following payload
      | orderType | productId        | quantity |
      | sell      | stored-productId | 5        |
    Then the response status code should be 201
    And the "sell" order response should be valid
    Then the "stored-productId" current stock level should reflect all 2 completed transactions

  @negative
  Scenario Outline: Validate Stock Management -Invalid - <test>
    Given I logged into the inventory management with a valid user
    When I send a request to create a new "sell" order with the following payload
      | orderType   | productId   | quantity   |
      | <orderType> | <productId> | <quantity> |
    Then the response status code should be <statusCode>
    And the response should contain a "message" field with value "<messageInResponse>"
    And the response should contain a "received" field with value "<receivedInResponse>"

    Examples:
      | test              | orderType | productId    | quantity | statusCode | messageInResponse                               | receivedInResponse |
      | Invalid orderType | sells     | anyproductid | 10       | 400        | Invalid order type. Must be \"buy\" or \"sell\" | sells              |
      | Invalid quantity  | buy       | anyproductid | 0        | 400        | Quantity must be a positive number              | 0                  |
      | Invalid productId | sell      |              | 10       | 400        | Invalid product ID                              |                    |
      | Product not found | sell      | anyproductid | 10       | 404        | Product not found                               |                    |

  @negative
  Scenario: Validate Stock Management - Insufficient stock for sale
    Given a product exists in the inventory
      | name   | price  | productType        | quantity |
      | Webcam | 100.00 | computer accessory | 5        |
    When I send a request to create a new "buy" order with the following payload
      | orderType | productId        | quantity |
      | buy       | stored-productId | 10       |
    Then the response status code should be 201
    And the "buy" order response should be valid
    When I send a request to create a new "sell" order with the following payload
      | orderType | productId        | quantity |
      | sell      | stored-productId | 100      |
    Then the response status code should be 400
    And the response should contain the field with value
      | message                     | currentStock | requested | deficit |
      | Insufficient stock for sale | 10           | 100       | 90      |

  @negative
  Scenario: Order Creation - Without Authentication
    When I send a request to create a new "buy" order with the following payload without authentication
      | orderType | productId        | quantity |
      | buy       | stored-productId | 10       |
    Then the response status code should be 401
    And the response should contain a "message" field with value "No token, authorization denied"

  @negative
  Scenario: Get Current Stock Level - Without Authentication
    When I send a request to get current stock level for a product id "stored-productId" without authentication
    Then the response status code should be 401
    And the response should contain a "message" field with value "No token, authorization denied"