---
layout: manual
title: Antifraud - Integration Manual
description: Technical integration API Antifraud Gateway Braspag
search: true
categories: manual
tags:
  - Risk Management
language_tabs:
  json: JSON    
---

# Overview

**Antifraud Gateway** is a platform developed by the Braspag Risk team to facilitate the integration of customers who wish to perform fraud analysis with different providers and with different technologies, ie, the Antifraud Gateway is responsible for performing the interconnection between the client that uses JSON in the messaging and the provider that uses XML in messaging, for example..

The platform is based on REST architecture, which exchanges data in JSON format following authorization flows defined by the OAuth 2 protocol, where all standards are widely used by the market and supported by technical communities.

> To learn more about OAuth 2, see [https://oauth.net/2/](https://oauth.net/2/)

The platform was built using one of Braspag's main products, the Cartão Protegido, for card tokenization and token fraud analysis.

# Objective

The purpose of this documentation is to guide the developer on how to integrate with Antifraud Gateway API Braspag, gateway of providers of antifraud solutions, describing the operations available with sample requests and responses.

To perform an operation, combine the base endpoint of the environment with the endpoint of the desired operation and send using the HTTP VERB as described in the operation.

# Hosts

## BraspagAuth API

|Environment|URL|
|:-|:-|
|`Sandbox`|https://authsandbox.braspag.com.br|
|`Produção`|https://auth.braspag.com.br|

## Antifraud Gateway API

|Environment|URL|
|:-|:-|
|`Sandbox`|https://risksandbox.braspag.com.br|
|`Produção`|https://risk.braspag.com.br|

# Authentication

## Access Token

The Antifraud Gateway API uses the industry standard OAuth 2.0 protocol for authorization of access to its specific resources by environments, which are: **Sandbox** e **Produção**.

This session describes the flow required for client applications to obtain valid access tokens for use on the platform.

## Obtaining the access token  

The access token is obtained through the oauth **client_credentials**. The diagram below illustrates, in chronological order, the communication between **Client Application**, **BraspagAuth API** and **Antifraud Gateway API**.

1. The **Client Application**, informs the **BraspagAuth API** your credential.

2. The **BraspagAuth API** validates the credential received. If valid, returns the access token for **Client Application**.

3. The **Client Application** informs the access token in the header of the HTTP requests made to the **Antifraud Gateway API**.

4. If the access token is valid, the request is processed and the data is returned to the **Client Application**

> Request a credential by opening a ticket through our support tool, sending the exit IP (s) of your homologation and production servers. <br/>
[Support Braspag](https://suporte.braspag.com.br/hc/en-us)

## How to get the token

Once in possession of the credential, you will need to "encrypt" it in Base64, using the **client_id:client_secret** convention, and send the result in the header through the **Authorization** field.

Exemple:
* client_id: **braspagtestes**
* client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* String to be encoded in Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* Result after encoding: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`scope`|AntifraudGatewayApp|
|`grant_type`|client_credentials|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`access_token`|The access token requested. The application can use this token to authenticate itself to the protected resource, in this case the Antifraud Gateway API|
|`token_type`|Indicates the value of the token type|
|`expires_in`|Expiry of the access token, in seconds <br/> The token when it expires, it is necessary to get a new one|

# Conducting a fraud analysis

Braspag, upon receiving the request data, directs the provider to analyze them. Providers use technologies such as device identification, IP geolocation, social network analytics, proxy detection, and speed counters. In real-time you will receive a recommendation from the analysis and you can take an action.

## Analyzing a transaction in ReDShield

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "RedShield",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "Tid": "12345678910111216AB8",
  "Nsu": "951852",
  "AuthorizationCode":"T12345",
  "SaleDate": "2016-12-09 10:01:55.662",
  "SplitingPaymentMethod": "None",
  "IsRetryTransaction": false,
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA",
    "EciThreeDSecure": "5"
  },
  "Billing": {
    "Street": "Rua Neturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Saturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "Email": "emailentrega@dominio.com.br",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silvao",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Comment": "Em frente ao 322"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silva",
    "BirthDate": "1983-10-01",
    "Gender": "Male",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Ip": "127.0.0.1",
    "BrowserFingerprint": "04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw==",
    "Status": "NEW"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "6500",
      "MerchantItemId": "4",
      "Sku": "abc123",
      "Quantity": 1,
      "OriginalPrice": "7000",
      "GiftMessage": "Te amo!",
      "Description": "Uma description do Mouse",
      "ShippingInstructions": "Proximo ao 546",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "123456"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "7500",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "OriginalPrice": "8000",
      "GiftMessage": "Te odeio!",
      "Description": "Uma description do Teclado",
      "ShippingInstructions": "Proximo ao 123",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "987654"
    }
  ],
  "CustomConfiguration": {
    "MerchantWebsite": "www.test.com"
  },
  "MerchantDefinedData": [
    {
      "Key": "USER_DATA4",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "Segment",
      "Value": "8999"
    },
    {
      "Key": "MerchantId",
      "Value": "Seller123456"
    }
  ],
  "Airline": {
    "ThirdPartyBooking": "Y",
    "Bookingtype": "Corporate",
    "TicketDeliveryMethod": "Delivery",
    "BookingReferenceNumber": "L5W4NW",
    "Passengers": [
    {
        "FirstName": "Fulano",
        "MiddleName": "D",
        "LastName": "Tal",
        "PassengerType": "Adult",
        "Email": "email@mail.com",
        "Phone": "1234567890",
        "TicketNumber": "123541",
        "LoyaltyMemberNumber": "159753852",
        "Legs" : [
        {
            "ArrivalAirport": "AMS",
            "DepartureAirport": "GIG",
            "ArrivalCountry": "NLD",
            "DepartureCountry": "BRA",
            "AirlineCode": "KLM",
            "DepartureDateTime": "2018-01-09 18:00",
            "ClassOfService": "Standard"
        }]
    }]
  }
}
```

### Request

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parameters in the body (Body)**

|Parameter|Description|Type|Required|Size|
|:-|:-|:-:|:-:|-:|
|`MerchantOrderId`|Merchant order number|string|yes|100|
|`TotalOrderAmount`|Total order value in cents <br/> Ex: 123456 = r$ 1.234,56|long|yes|-|
|`TransactionAmount`|Value of the financial transaction in cents <br/> Ex: 150000 = r$ 1.500,00|long|yes|-|
|`Currency`|Currency. More information on [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)|enum|-|-|
|`Provider`|Antifraud provider <br/> [Table 1 - Provider]({{ site.baseurl_root }}en/manual/antifraude#table-1-provider)|enum|-|-|
|`OrderDate`|Order date <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Note: If you are not informed, a date will be generated by Braspag|datetime|no|-|
|`BraspagTransactionId`|Transaction id in Pagador Braspag|guid|no|-|
|`Tid`|Acquirer transaction id <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the fields` Nsu`, `AuthorizationCode` and` SaleDate`, besides this one in question|string|no|20|
|`Nsu`|Acquirer transaction unique sequence number <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `AuthorizationCode` and `SaleDate`, in addition to the one in question|string|no|10|
|`AuthorizationCode`|Acquirer authorization code <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the` Tid`, `Nsu` and `SaleDate`, in addition to the one in question|string|no|10|
|`SaleDate`|Acquirer authorization date <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `Nsu `and` AuthorizationCode`, in addition to the one in question|datetime|no|-|
|`SplitingPaymentMethod`|Identifies whether the transaction authorization is with one or more cards or with more than one payment methods <br/> [Table 2 - SplitingPaymentMethod]({{ site.baseurl_root }}en/manual/antifraude#table-2-splitingpaymentmethod)|enum|-|-|
|`IsRetryTransaction`|Retentive of an analysis, and should be sent with value equal to TRUE when the return code on the first attempt equals BP900|bool|no|-|
|`Card.Number`|Credit card number|string|yes|19|
|`Card.Holder`|Holder name|string|yes|50|
|`Card.ExpirationDate`|Credit card expiration date <br/> Ex.: 01/2023|string|yes|7|
|`Card.Cvv`|Credit card security code|string|yes|4|
|`Card.Brand`|Credit card brand <br/> [Table 3 - Card.Brand]({{ site.baseurl_root }}en/manual/antifraude#table-3-card.brand)|enum|-|-|
|`Card.EciThreeDSecure`|Electronic Commerce Indicator (ECI)|string|no|1|
|`Card.Save`|Indicates whether credit card data will be stored on the Cartão Protegido|bool|no|-|
|`Card.Token`|Credit card token saved on the Cartão Protegido|guid|no|-|
|`Card.Alias`|Credit card alias saved on the Cartão Protegido|string|no|64|
|`Billing.Street`|Billing address street|string|no|24|
|`Billing.Number`|Billing address number|string|no|5|
|`Billing.Complement`|Billing address complement|string|no|14|
|`Billing.Neighborhood`|Billing address neighborhood|string|no|15|
|`Billing.City`|Billing address city|string|no|20|
|`Billing.State`|Billing address state|string|no|2|
|`Billing.Country`|Billing address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|no|2|
|`Billing.ZipCode`|Billing address zipcode|string|no|9|
|`Shipping.Street`|Shipping address street|string|no|24|
|`Shipping.Number`|Shipping address number|string|no|5|
|`Shipping.Complement`|Shipping address complement|string|no|14|
|`Shipping.Neighborhood`|Shipping address neighborhood|string|no|15|
|`Shipping.City`|Shipping address city|string|no|20|
|`Shipping.State`|Shipping address state|string|no|2|
|`Shipping.Country`|Shipping address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|no|2|
|`Shipping.ZipCode`|Shipping address zipcode|string|no|9|
|`Shipping.Email`|Email of the person responsible to receive the product at the shipping address|string|no|60|
|`Shipping.FirstName`|First name of person in charge of receiving product at shipping address|string|no|30|
|`Shipping.MiddleName`|First letter of the middle name of the person in charge of receiving the product at the shipping address|string|no|1|
|`Shipping.LastName`|Last name of the person in charge of receiving the product at the shipping address|string|no|30|
|`Shipping.Phone`|Telephone number of the person in charge of receiving the product at the shipping address <br/> Ex.: 552121114700|string|no|19|
|`Shipping.WorkPhone`|Workphone number of the person in charge of receiving the product at the shipping address <br/> Ex.: 552121114701|string|no|19|
|`Shipping.Mobile`|Mobile number of the person in charge of receiving the product at the shipping address <br/> Ex.: 5521987654321|string|no|19|
|`Shipping.ShippingMethod`|Order delivery method <br/> [Table 4 - ShippingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-4-shippingmethod)|enum|-|-|
|`Shipping.Comment`|Shipping address references|string|no|160|
|`Customer.MerchantCustomerId`|Customer document number, CPF or CNPJ|string|yes|16|
|`Customer.FirstName`|Customer first name|string|yes|30|
|`Customer.MiddleName`|First letter of the middle name customer|string|no|1|
|`Customer.LastName`|Customer last name|string|yes|30|
|`Customer.BirthDate`|Customer birthdate <br/> Ex.: 1983-10-01|date|yes|-|
|`Customer.Gender`|Customer gender <br/> [Table 6 - Customer.Gender]({{ site.baseurl_root }}en/manual/antifraude#table-6-customer.gender)|string|no|6|
|`Customer.Email`|Customer email|string|no|60|
|`Customer.Ip`|Customer IP address|string|no|15|
|`Customer.Phone`|Customer telephone number <br/> Ex.: 552121114700|string|no|19|
|`Customer.WorkPhone`|Customer workphone number <br/> Ex.: 552121114701|string|no|19|
|`Customer.Mobile`|Customer mobile number <br/> Ex.: 5521987654321|string|no|19|
|`Customer.Status`|Merchant customer status <br/> [Table 7 - Customer.Status]({{ site.baseurl_root }}en/manual/antifraude#table-7-customer.status)|string|no|8|
|`Customer.BrowserFingerPrint`|Device fingerprint and customer IP real geolocation - [Fingerprint configuration]({{ site.baseurl_root }}/en/manual/antifraude#redshield44)|string|yes|6005|
|`CartItem[n].ProductName`|Product name|string|no|50|
|`CartItem[n].UnitPrice`|Product unit price <br/> Ex: 10950 = r$ 109,50|long|no|-|
|`CartItem[n].OriginalPrice`|Product original price <br/> Ex: 11490 = r$ 114,90|long|no|-|
|`CartItem[n].MerchantItemId`|Merchant product id|string|no|30|
|`CartItem[n].Sku`|Product SKU|string|no|12|
|`CartItem[n].Quantity`|Product quantity|int|no|-|
|`CartItem[n].GiftMessage`|Gift message|string|no|160|
|`CartItem[n].Description`|Product description|string|no|76|
|`CartItem[n].ShippingInstructions`|Product delivery instructions|string|no|160|
|`CartItem[n].ShippingMethod`|Product delivery method <br/> [Table 4 - ShippingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-4-shippingmethod)|enum|-|-|
|`CartItem[n].ShippingTranckingNumber`|Product tracking number|string|no|19|
|`Airline.ThirdPartyBooking`|Indicates whether the reservation was scheduled by third parties, such as tourism agencies|bool|no|-|
|`Airline.BookingType`|Type of booking schedule|string|no|255|
|`Airline.TicketDeliveryMethod`|Ticket delivery type|string|no|127|
|`Airline.BookingReferenceNumber`|Booking reference number|string|no|9|
|`Airline.Passengers[n].FirstName`|Passenger first name|string|no|29|
|`Airline.Passengers[n].MiddleName`|Passenger middle name|string|no|1|
|`Airline.Passengers[n].LastName`|Passenger last name|string|no|28|
|`Airline.Passengers[n].PassengerType`|Passenger type <br/> [Table 9 - Airline.Passengers{n}.PassengerType]({{ site.baseurl_root }}en/manual/antifraude#table-9-airline.passengers[n].passengertype)|enum|no|-|
|`Airline.Passengers[n].Phone`|Passenger telephone number <br/> Ex.: 552121114700|string|no|19|
|`Airline.Passengers[n].Email`|Passenger email|string|no|60|
|`Airline.Passengers[n].LoyaltyMemberNumber`|Loyalty member number|string|no|255|
|`Airline.Passengers[n].TicketNumber`|Ticket number|string|no|20|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Departure airport code. More informations on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|no|3|
|`Airline.Passengers[n].Legs[n].DepartureCountry`|Country code of departure airport. More information on [ISO 3-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|no|3|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Arrival airport code. More information on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|no|3|
|`Airline.Passengers[n].Legs[n].ArrivalCountry`|Country code of arrival airport. More information on [ISO 3-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|no|3|
|`Airline.Passengers[n].Legs[n].AirlineCode`|Airline code|string|no|3|
|`Airline.Passengers[n].Legs[n].DepartureDateTime`|Departure datetime <br/> Ex.: 2018-03-31 19:16:38 |datetime|no|-|
|`Airline.Passengers[n].Legs[n].ClassOfService`|Class service|string|no|30|
|`CustomConfiguration.MerchantWebsite`|Merchant website|string|no|60|
|`MerchantDefinedData[n].Key`|Field key set against antifraud provider <br/> [Table 36 - MerchantDefinedData(ReDShield)]({{ site.baseurl_root }}en/manual/antifraude#table-36-merchantdefineddata-(redshield))|int|no|-|
|`MerchantDefinedData[n].Value`|Field value set against antifraud provider <br/> [Table 36 - MerchantDefinedData(ReDShield)]({{ site.baseurl_root }}en/manual/antifraude#table-36-merchantdefineddata-(redshield))|var|no|-|

### Response

``` json
{
   "TransactionId": "fdf8f357-a723-e811-80c3-0003ff21d83f",
   "Status": "Accept",
   "ProviderAnalysisResult": {
       "ProviderRequestId": "8a829449620619e801620b31d1c85d5a",
       "Result": {
           "ProviderCode": "000.000.000",
           "ProviderDescription": "Transaction succeeded"
       },
       "ResultDetails": {
           "CSITransactionLink": "https://csi-stage.redworldwide.com/index.red#transactiondetail/000548000001XAR20180309093717761",
           "ProviderStatus": "ACCEPT",
           "ProviderTransactionId": "381069636258",
           "ProviderResponseCode": "0150",
           "ProviderOrderId": "000548000001XAR20180309093717761"
       },
       "Ndc": "8a82941859d5969a0159db3f6ecc1418_60d2e8536e244db2bf04146872b00d38"
   },
   "Links": [
       {
           "Method": "GET",
           "Href": "http://localhost:1316/Analysis/v2/fdf8f357-a723-e811-80c3-0003ff21d83f",
           "Rel": "Self"
       }
   ]
}

```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parameters in the body (Body)**

|Parameter|Description|Type|
|:-|:-|:-:|
|`TransactionId`|Transaction id on Antifraud Gateway Braspag|guid|
|`Status`|Transaction status on Antifraud Gateway Braspag <br/> [Table 20  - Status]({{ site.baseurl_root }}en/manual/antifraude#table-20-status)|enum|
|`ProviderAnalysisResult.ProviderRequestId`|ReDShield transaction request id |string|
|`ProviderAnalysisResult.Result.ProviderCode`|ReDShield return code|string|
|`ProviderAnalysisResult.Result.ProviderDescription`|ReDShield return message|string|
|`ProviderAnalysisResult.ResultDetails.CSITransactionLink`|Link to view transaction details on ReDShield CSI portal|string|
|`ProviderAnalysisResult.ResultDetails.ProviderStatus`|ReDShield transaction status <br/> [Table 21 - ProviderStatus]({{ site.baseurl_root }}en/manual/antifraude#table-21-providerstatus)|enum|
|`ProviderAnalysisResult.ResultDetails.ProviderTransactionId`|ReDShield transaction id|string|
|`ProviderAnalysisResult.ResultDetails.ProviderOrderId`|ReDShield order id|string|
|`ProviderAnalysisResult.Ndc`|ReDShield unique request id|string|

## Analyzing a transaction in Cybersource

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "Cybersource",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "Tid": "12345678910111216AB8",
  "Nsu": "951852",
  "AuthorizationCode":"T12345",
  "SaleDate": "2016-12-09 10:01:55.662",
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA"
  },
  "Billing": {
    "Street": "Rua Saturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Neturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "FirstName": "João",
    "LastName": "Silva",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "LastName": "Silva",
    "BirthDate": "2016-12-09",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "Ip": "127.0.0.1",
    "BrowserHostName":"www.dominiobrowsercomprador.com.br",
    "BrowserCookiesAccepted":true,
    "BrowserEmail":"emailbrowsercomprador@dominio.com.br",
    "BrowserType":"Chrome 58 on Windows 10",
    "BrowserFingerprint":"braspag123456789"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "12000",
      "Sku": "abc123",
      "Quantity": 1,
      "Risk":"Low",
      "AddressRiskVerify":"No",
      "HostHedge":"Low",
      "NonSensicalHedge":"Normal",
      "ObscenitiesHedge":"High",
      "TimeHedge":"Low",
      "PhoneHedge":"Normal",
      "VelocityHedge":"High"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "96385",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "Risk": "High"
    }
  ],
  "MerchantDefinedData": [
    {
      "Key": "1",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "2",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "3",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    }
  ],
  "Bank":{
    "Address": "Rua Marte, 29",
    "Code": "237",
    "Agency": "987654",
    "City": "Rio de Janeiro",
    "Country": "BR",
    "Name": "Bradesco",
    "SwiftCode": "789"
  },
  "FundTransfer":{
    "AccountNumber":"159753",
    "AccountName":"Conta particular",
    "BankCheckDigit":"51",
    "Iban":"123456789"
  },
  "Invoice":{
    "IsGift": false,
    "ReturnsAccept": true,
    "Tender": "Consumer"
  },
  "Airline": {
    "JourneyType": "OneWayTrip",
    "DepartureDateTime": "2018-01-09 18:00",
    "Passengers": [
    {
        "FirstName": "Fulano",
        "LastName": "Tal",
        "PassangerId": "",
        "PassengerType": "Adult",
        "Email": "email@mail.com",
        "Phone": "1234567890",
        "Status": "Gold",
        "Legs" : [
        {
            "ArrivalAirport": "AMS",
            "DepartureAirport": "GIG"
        }]
    }]
  }
}
```

### Request

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parameters in the body (Body)**

|Parameter|Description|Type|Required|Size|
|:-|:-|:-:|:-:|-:|
|`MerchantOrderId` |Merchant order number|string|yes|100|
|`TotalOrderAmount`|Total order value in cents <br/> Ex: 123456 = r$ 1.234,56|long|yes|-|
|`TransactionAmount`|Value of the financial transaction in cents <br/> Ex: 150000 = r$ 1.500,00|long|yes|-|
|`Currency`|Currency. More information on [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)|string|yes|3|
|`Provider`|Antifraud provider <br/> [Table 1 - Provider]({{ site.baseurl_root }}en/manual/antifraude#table-1-provider)|enum|-|-|
|`OrderDate`|Order date <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Note: If you are not informed, a date will be generated by Braspag|datetime|no|-|
|`BraspagTransactionId`|Transaction id in Pagador Braspag|guid|no|-|
|`Tid`|Acquirer transaction id <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the fields` Nsu`, `AuthorizationCode` and` SaleDate`, besides this one in question|string|no|20|
|`Nsu`|Acquirer transaction unique sequence number <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `AuthorizationCode` and `SaleDate`, in addition to the one in question|string|no|10|
|`AuthorizationCode`|Acquirer authorization code <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the` Tid`, `Nsu` and `SaleDate`, in addition to the one in question|string|no|10|
|`SaleDate`|Acquirer authorization date <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `Nsu `and` AuthorizationCode`, in addition to the one in question|datetime|no|-|
|`Card.Number`|Credit card number|string|yes|20|
|`Card.Holder`|Holder name|string|yes|50|
|`Card.ExpirationDate`|Credit card expiration date <br/> Ex.: 01/2023|string|yes|7|
|`Card.Brand`|Credit card brand <br/> [Table 3 - Card.Brand]({{ site.baseurl_root }}en/manual/antifraude#table-3-card.brand)|enum|-|-|
|`Card.Save`|Indicates whether credit card data will be stored on the Cartão Protegido|bool|no|-|
|`Card.Token`|Credit card token saved on the Cartão Protegido|guid|no|-|
|`Card.Alias`|Credit card alias saved on the Cartão Protegido|string|no|64|
|`Billing.Street`|Billing address street|string|yes|54|
|`Billing.Number`|Billing address number|string|no|5|
|`Billing.Complement`|Billing address complement|string|no|14|
|`Billing.Neighborhood`|Billing address neighborhood|string|no|45|
|`Billing.City`|Billing address city|string|yes|50|
|`Billing.State`|Billing address state|string|no|2|
|`Billing.Country`|Billing address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|yes|2|
|`Billing.ZipCode`|Billing address zipcode|string|no|9|
|`Shipping.Street`|Shipping address street|string|no|54|
|`Shipping.Number`|Shipping address number|string|no|5|
|`Shipping.Complement`|Shipping address complement|string|no|14|
|`Shipping.Neighborhood`|Shipping address neighborhood|string|no|45|
|`Shipping.City`|Shipping address city|string|no|50|
|`Shipping.State`|Shipping address state|string|no|2|
|`Shipping.Country`|Shipping address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|no|2|
|`Shipping.ZipCode`|Shipping address zipcode|string|no|9|
|`Shipping.FirstName`|First name of person in charge of receiving product at shipping address|string|no|60|
|`Shipping.LastName`|Last name of the person in charge of receiving the product at the shipping address|string|no|60|
|`Shipping.Phone`|Telephone number of the person in charge of receiving the product at the shipping address <br/> Ex.: 552121114700|string|no|15|
|`Shipping.ShippingMethod`|Order delivery method <br/> [Table 4 - ShippingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-4-shippingmethod)|enum|-|-|
|`Customer.MerchantCustomerId`|Customer document number, CPF or CNPJ|string|yes|16|
|`Customer.FirstName`|Customer first name|string|yes|60|
|`Customer.LastName`|Customer last name|string|yes|60|
|`Customer.BirthDate`|Customer birthdate <br/> Ex.: 1983-10-01|date|yes|-|
|`Customer.Email`|Customer email|string|yes|100|
|`Customer.Ip`|Customer IP address|string|no|15|
|`Customer.Phone`|Customer telephone number <br/> Ex.: 552121114700|string|no|15|
|`Customer.BrowserHostName`|Host name entered by the customer's browser and identified through the HTTP header|string|no|60|
|`Customer.BrowserCookiesAccepted`|Identifies whether the customer's browser accepts cookies or not|bool|-|-|
|`Customer.BrowserEmail`|E-mail registered in the customer's browser. Can differ from merchant email (`Customer.Email`)|string|no|100|
|`Customer.BrowserType`|Name of the browser used by the customer and identified through the HTTP header|string|no|40|
|`Customer.BrowserFingerprint`|Identifier used to cross information obtained from the buyer's device. This same identifier must be used to generate the value that will be assigned to the `session_id` field of the script that will be included on the checkout page. <br/> Note: This identifier can be any value or order number but must be unique for 48 hours. <br/> [Fingerprint Configuration]({{ site.baseurl_root }}/manual/antifraude#cybersource)|string|yes|100|
|`CartItem[n].ProductName`|Product name|string|yes|255|
|`CartItem[n].Risk`|Risk level of the product associated with the quantity of chargebacks <br/> [Table 11 - CartItem{n}.Risk]({{ site.baseurl_root }}en/manual/antifraude#table-11-cartitem[n].risk)|enum|-|-|
|`CartItem[n].UnitPrice`|Product unit price <br/> Ex: 10950 = r$ 109,50|long|yes|-|
|`CartItem[n].Sku`|Product SKU|string|no|255|
|`CartItem[n].Quantity`|Product quantity|int|no|-|
|`CartItem[n].AddressRiskVerify`|Identifies that you will evaluate the billing and shipping addresses for different cities, states or countries <br/> [Table 12 - CartItem{n}.AddressRiskVerify]({{ site.baseurl_root }}en/manual/antifraude#table-12-cartitem[n].addressriskverify)|enum|-|-|
|`CartItem[n].HostHedge`|Level of importance of customer IP and email addresses in fraud analysis <br/> [Table 13 - CartItem{n}.HostHedge]({{ site.baseurl_root }}en/manual/antifraude#table-13-cartitem[n].hosthedge)|enum|-|-|
|`CartItem[n].NonSensicalHedge`|Level of importance of verifications about the customer data non sensical in fraud analysis <br/> [Table 14 - CartItem{n}.NonSensicalHedge]({{ site.baseurl_root }}en/manual/antifraude#table-14-cartitem[n].nonsensicalhedge)|enum|-|-|
|`CartItem[n].ObscenitiesHedge`|Level of importance of checks on customer data with obscenity in fraud analysis <br/> [Table 15 - CartItem{n}.ObscenitiesHedge]({{ site.baseurl_root }}en/manual/antifraude#table-15-cartitem[n].obscenitieshedge)|enum|-|-|
|`CartItem[n].TimeHedge`|Level of importance of the time of day in the fraud analysis that the customer made the request <br/> [Table 16 - CartItem{n}.TimeHedge]({{ site.baseurl_root }}en/manual/antifraude#table-16-cartitem[n].timehedge)|enum|-|-|
|`CartItem[n].PhoneHedge`|Level of importance of checks on customer's phone numbers in fraud analysis <br/> [Table 17 - CartItem{n}.PhoneHedge]({{ site.baseurl_root }}en/manual/antifraude#table-17-cartitem[n].phonehedge)|enum|-|-|
|`CartItem[n].VelocityHedge`|Level of importance of customer's purchase frequency in the fraud analysis of the previous 15 minutes <br/> [Table 18 - CartItem{n}.VelocityHedge]({{ site.baseurl_root }}en/manual/antifraude#table-18-cartitem[n].velocityhedge)|enum|-|-|
|`Bank.Name`|Customer's bank name|string|no|40|
|`Bank.Code`|Customer's bank code|string|no|15|
|`Bank.Agency`|Customer's bank agency|string|no|15|
|`Bank.Address`|Customer's bank address|string|no|255|
|`Bank.City`|Customer's bank city|string|no|15|
|`Bank.Country`|Customer's bank city <br/> More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|no|2|
|`Bank.SwiftCode`|Customer's bank swift code|string|no|30|
|`FundTransfer.AccountName`|Name linked to bank account|string|no|30|
|`FundTransfer.AccountNumber`|Customer's bank account number|string|no|30|
|`FundTransfer.BankCheckDigit`|Code used to validate customer's bank account|string|no|2|
|`FundTransfer.Iban`|Customer's International Bank Account Number (IBAN)|string|no|30|
|`Invoice.IsGift`|Indicates whether the order placed by the customer is for gift|bool|no|-|
|`Invoice.ReturnsAccepted`|Indicates whether the order placed by the customer can be returned to the merchant|bool|no|-|
|`Invoice.Tender`|Payment method used by the customer <br/> [Table 19 - Invoice.Tender]({{ site.baseurl_root }}en/manual/antifraude#table-19-invoice.tender)|enum|no|-|
|`Airline.JourneyType`|Journey type <br/> [Table 8 - Airline.JourneyType]({{ site.baseurl_root }}en/manual/antifraude#table-8-airline.journeytype)|enun|no|-|
|`Airline.DepartureDateTime`|Departure datetime <br/> Ex.: 2018-03-31 19:16:38|datetime|no|-|
|`Airline.Passengers[n].FirstName`|Passenger first name|string|no|60|
|`Airline.Passengers[n].LastName`|Passenger last name|string|no|60|
|`Airline.Passengers[n].PassengerId`|Identifier of the passenger to whom the ticket was issued|string|no|32|
|`Airline.Passengers[n].PassengerType`|Passenger type <br/> [Table 9 - Airline.Passengers{n}.PassengerType]({{ site.baseurl_root }}en/manual/antifraude#table-9-airline.passengers[n].passengertype)|enum|no|-|
|`Airline.Passengers[n].Phone`|Passenger telephone number <br/> Ex.: 552121114700|string|no|15|
|`Airline.Passengers[n].Email`|Passenger email|string|no|255|
|`Airline.Passengers[n].Status`|Airline classification <br/> [Table 10 - Airline.Passengers{n}.Status]({{ site.baseurl_root }}en/manual/antifraude#table-10-airline.passengers[n].status)|enum|no|60|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Departure airport code. More informations on. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|no|3|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Arrival airport code. More information on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|no|3|
|`CustomConfiguration.Comments`|Comments that the merchant may associate fraud analysis|string|no|255|
|`CustomConfiguration.ScoreThreshold`|Acceptable level of risk for each product|int|-|-|
|`MerchantDefinedData[n].Key`|Field key set against antifraud provider <br/> [Table 37 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}en/manual/antifraude#table-37-merchantdefineddata-(cybersource))|int|no|-|
|`MerchantDefinedData[n].Value`|Field value set against antifraud provider <br/> [Table 37 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}en/manual/antifraude#table-37-merchantdefineddata-(cybersource))|var|no|-|

``` json
{
   "TransactionId": "1eae3d39-a723-e811-80c3-0003ff21d83f",
   "Status": "Accept",
   "ProviderAnalysisResult": {
       "ProviderTransactionId": "5206061832306553904009",
       "ProviderStatus": "ACCEPT",
       "ProviderCode": "100",
       "ProviderRequestTransactionId": "AhjzbwSTGjifFZXHYduJEAFReTUyEoftDpA9+Ehk0kv9Atj2YEBMmAL2",
       "AfsReply": {
           "reasonCode": "100",
           "afsResult": "99",
           "hostSeverity": "3",
           "consumerLocalTime": "11:36:23",
           "afsFactorCode": "D^F^Z",
           "addressInfoCode": "COR-BA",
           "hotlistInfoCode": "NEG-AFCB^NEG-BA^NEG-CC^NEG-EM^NEG-PEM^NEG-SA^REV-PPH^REV-SUSP",
           "internetInfoCode": "FREE-EM^RISK-EM",
           "suspiciousInfoCode": "RISK-TB",
           "velocityInfoCode": "VEL-NAME",
           "scoreModelUsed": "default_lac"
       },
       "DecisionReply": {
           "casePriority": "3",
           "activeProfileReply": {},
           "velocityInfoCode": "GVEL-R1^GVEL-R2^GVEL-R4^GVEL-R6^GVEL-R7^GVEL-R9"
       }
   },
   "Links": [
       {
           "Method": "GET",
           "Href": "http://localhost:1316/Analysis/v2/1eae3d39-a723-e811-80c3-0003ff21d83f",
           "Rel": "Self"
       }
   ]
}
```

### Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parameters in the body (Body)**

|Parameter|Description|Type|
|:-|:-|:-:|
|`TransactionId`|Transaction id on Antifraud Gateway Braspag Braspag|guid|
|`Status`|Transaction status on Antifraud Gateway Braspag <br/> [Table 20  - Status]({{ site.baseurl_root }}en/manual/antifraude#table-20-status)|enum|
|`ProviderAnalysisResult.ProviderTransactionId`|Cybersource transaction id|string|
|`ProviderAnalysisResult.ProviderStatus`|Cybersource transaction status <br/> [Table 21 - ProviderStatus]({{ site.baseurl_root }}en/manual/antifraude#table-21-providerstatus)|enum|
|`ProviderAnalysisResult.ProviderCode`|Cybersource return code <br/> [Table 22 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}en/manual/antifraude#table-22-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.ProviderRequestTransactionId`|Cybersource transaction request id|string|
|`ProviderAnalysisResult.Missing`|Missing fields in the request sent to Cybersource|string|
|`ProviderAnalysisResult.Invalid`|Fields with invalid values sent to Cybersource|string|
|`ProviderAnalysisResult.AfsReply.AddressInfoCode`|Codes that indicate incompatibilities between the customer's billing and shipping addresses <br/> Codes are concatenated using the character <br/> Os códigos são concatenados usando o caracter ^ Ex.: MM-A^MM-Z <br/>[Table 23 - ProviderAnalysisResult.AfsReply.AddressInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-23-provideranalysisresult.afsreply.addressinfocode)|string|
|`ProviderAnalysisResult.AfsReply.AfsFactorCode`|Codes that affect analysis score <br/> Codes are concatenated using the ^ character. Ex: [Table 24 - ProviderAnalysisResult.AfsReply.AfsFactorCode]({{ site.baseurl_root }}en/manual/antifraude#table-24-provideranalysisresult.afsreply.afsfactorcode)|string|
|`ProviderAnalysisResult.AfsReply.AfsResult`|Total calculated score for order|int|
|`ProviderAnalysisResult.AfsReply.BinCountry`|BIN country code of the card used in the analysis. More information on More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`ProviderAnalysisResult.AfsReply.CardAccountType`|Card type <br/> [Table 25 - ProviderAnalysisResult.AfsReply.CardAccountType]({{ site.baseurl_root }}en/manual/antifraude#table-25-provideranalysisresult.afsreply.cardaccounttype)|string|
|`ProviderAnalysisResult.AfsReply.CardIssuer`|Name of the bank or issuer of the card|string|
|`ProviderAnalysisResult.AfsReply.CardScheme`|Card brand|string|
|`ProviderAnalysisResult.AfsReply.ConsumerLocalTime`|Customer's local time, calculated from the date of the request and the billing address|string|
|`ProviderAnalysisResult.AfsReply.HostSeverity`|Risk level of the customer's e-mail domain, 0 to 5, where 0 is undetermined risk and 5 represents the highest risk|int|
|`ProviderAnalysisResult.AfsReply.HotListInfoCode`|Codes that indicate customer data are associated with positive or negative lists <br/> Codes are concatenated using the ^ character. Ex .: NEG-AFCB ^ NEG-CC [Table 26 - ProviderAnalysisResult.AfsReply.HotListInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-26-provideranalysisresult.afsreply.hotlistinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IdentityInfoCode`|Codes that indicate excessive identity changes <br/> Codes are concatenated using the ^ character. Example: COR-BA-MM-BIN [Table 27 - ProviderAnalysisResult.AfsReply.IdentityInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-27-provideranalysisresult.afsreply.identityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.InternetInfoCode`|Codes that indicate problems with the email address, IP address or billing address <br/> Codes are concatenated using the ^ character. Ex .: COR-BA-MM-BIN [Table 28 Codes are concatenated using the ^ character. Ex .: COR-BA-MM-BIN [Table 28 - ProviderAnalysisResult.AfsReply.InternetInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-28-provideranalysisresult.afsreply.internetinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IpCity`|Customer's city name obtained from the IP address|string|
|`ProviderAnalysisResult.AfsReply.IpCountry`|Customer's country name obtained from the IP address|string|
|`ProviderAnalysisResult.AfsReply.IpRoutingMethod`|Customer's routing method obtained from the IP address <br/> [Table 32 - ProviderAnalysisResult.AfsReply.IpRoutingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-32-provideranalysisresult.afsreply.iproutingmethod)|string|
|`ProviderAnalysisResult.AfsReply.IpState`|Customer's state name obtained from the IP address|string|
|`ProviderAnalysisResult.AfsReply.PhoneInfoCode`|Codes that indicate a problem with the customer's phone number <br/> Codes are concatenated using the ^ character. Ex .: UNV-AC ^ RISK-AC [Table 29 - ProviderAnalysisResult.AfsReply.PhoneInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-29-provideranalysisresult.afsreply.phoneinfocode)|string|
|`ProviderAnalysisResult.AfsReply.ReasonCode`|Cybersource return code <br/> [Table 22 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}en/manual/antifraude#table-22-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.AfsReply.ScoreModelUsed`|Name of the scoring model used in the analysis. If you do not have a defined, the Cybersource default scoring model was used|string|
|`ProviderAnalysisResult.AfsReply.SuspiciousInfoCode`|Codes that indicate that the customer potentially provided suspicious information <br/> Codes are concatenated using the ^ character. Ex .: RISK-TB ^ RISK-TS [Table 30 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-30-provideranalysisresult.afsreply.suspiciousinfocode)|string|
|`ProviderAnalysisResult.AfsReply.VelocityInfoCode`|Codes that indicate that the customer has a high frequency of purchases <br/> Codes are concatenated using the ^ character. Ex .: VELV-SA VELI-CC VELSIP [Table 31 - ProviderAnalysisResult.AfsReply.VelocityInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-31-provideranalysisresult.afsreply.velocityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.BrowserLanguage`|Browser language used by the customer at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ScreenResolution`|Screen resolution of the customer at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.CookiesEnabled`|Flag identifying that the customer's browser was enabled to temporarily store cookies at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.FlashEnabled`|Flag identifying that the customer's browser enabled the execution of Flash content at the time of purchase |string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.Hash`|Hash generated from the data collected by the fingerprint script|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ImagesEnabled`|Flag identifying that the customer's browser was enabled with image caching at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.JavascriptEnabled`|Flag identifying that the customer's browser was running Javascript sripts enabled at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddress`|Flag identifying that customer IP address is real|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCity`|Flag identifying that the customer IP address is in fact of the city that it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCountry`|Flag identifying that the customer IP address is in fact of the country that it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartId`|Customer device identifier|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartIdConfidenceLevel`|Customer device identifier|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.DestinationQueue`|When verbose mode is enabled, the name of the queue to which the transactions do not automatically accept are sent|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.Name`|When verbose mode is enabled, name of the profile selected in the analysis. If you do not have any, the default profile has been selected|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.SelectedBy`|When verbose mode is enabled, name of the rule selector that selects the rules profile|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].RuleId`|When verbose mode is enabled, rule id|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision`|When verbose mode is enabled, decision taken by rule <br/> [Table 33 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Decision]({{ site.baseurl_root }}en/manual/antifraude#table-33-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].decision)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation`|When verbose mode is enabled, rule evaluation <br/> [Table 34 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Evaluation]({{ site.baseurl_root }}en/manual/antifraude#table-34-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].evaluation)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Name`|When verbose mode is enabled, rule name|string|
|`ProviderAnalysisResult.DecisionReply.CasePriority`|Sets the priority level of the rules or profiles of the merchant. The priority level varies from 1 (major) to 5 (minor) and the default value is 3, and this will be assigned if you have not set the priority of the rules or profiles. This field will only be returned if the merchant is an Enhanced Case Management subscriber|string|
|`ProviderAnalysisResult.DecisionReply.VelocityInfoCode`|Codes of information triggered by analysis. These codes were generated when the rules were created|string|

## Indicating integration errors

``` json
{
  "Message": "The request is invalid.",
  "ModelState": {
    "request.Customer.Gender": [
      "Error converting value \"M\" to type 'Antifraude.Domain.Enums.GenderType'. Path 'Customer.Gender', line 51, position 17."
    ],
    "FraudAnalysisRequestError": [
      "The Card.EciThreeDSecure lenght is gratter than 1",
      "The Shipping.Complement lenght is gratter than 14",
      "The Shipping.MiddleName lenght is gratter than 1",
      "The Customer.MerchantCustomerId lenght is gratter than 16",
      "The Customer.MiddleName lenght is gratter than 1"
    ]
  }
}
```

### Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`Message`|Message stating that the request is invalid|
|`ModelState`|Collection that will contain messages with fields that do not conform to the type or domain as specified in the manual|
|`FraudAnalysisRequestError`|Collection that will contain messages with fields that do not conform to the size specified in the manual|

# Queries

## Querying a transaction ReDShield

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">analysis/v2/{Id}</span></aside>

``` json
{
  "TransactionId": "fdf8f357-a723-e811-80c3-0003ff21d83f",
   "Status": "Accept",
   "ProviderAnalysisResult": {
       "ProviderRequestId": "8a829449620619e801620b31d1c85d5a",
       "Result": {
           "ProviderCode": "000.000.000",
           "ProviderDescription": "Transaction succeeded"
       },
       "ResultDetails": {
           "CSITransactionLink": "https://csi-stage.redworldwide.com/index.red#transactiondetail/000548000001XAR20180309093717761",
           "ProviderStatus": "ACCEPT",
           "ProviderTransactionId": "381069636258",
           "ProviderResponseCode": "0150",
           "ProviderOrderId": "000548000001XAR20180309093717761"
       },
       "Ndc": "8a82941859d5969a0159db3f6ecc1418_60d2e8536e244db2bf04146872b00d38"
   },
   "Links": [
       {
           "Method": "GET",
           "Href": "http://localhost:1316/Analysis/v2/fdf8f357-a723-e811-80c3-0003ff21d83f",
           "Rel": "Self"
       }
   ],
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "RedShield",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "SplitingPaymentMethod": "None",
  "IsRetryTransaction": false,
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA",
    "EciThreeDSecure": "5"
  },
  "Billing": {
    "Street": "Rua Neturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Saturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "Email": "emailentrega@dominio.com.br",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silvao",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Comment": "Em frente ao 322"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silva",
    "BirthDate": "1983-10-01",
    "Gender": "Male",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Ip": "127.0.0.1",
    "BrowserFingerprint": "04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw==",
    "Status": "NEW"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "6500",
      "MerchantItemId": "4",
      "Sku": "abc123",
      "Quantity": 1,
      "OriginalPrice": "7000",
      "GiftMessage": "Te amo!",
      "Description": "Uma description do Mouse",
      "ShippingInstructions": "Proximo ao 546",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "123456"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "7500",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "OriginalPrice": "8000",
      "GiftMessage": "Te odeio!",
      "Description": "Uma description do Teclado",
      "ShippingInstructions": "Proximo ao 123",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "987654"
    }
  ],
  "CustomConfiguration": {
    "MerchantWebsite": "www.test.com"
  },
  "MerchantDefinedData": [
    {
      "Key": "USER_DATA4",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "Segment",
      "Value": "8999"
    },
    {
      "Key": "MerchantId",
      "Value": "Seller123456"
    }
  ],
  "Airline": {
    "ThirdPartyBooking": "Y",
    "Bookingtype": "Corporate",
    "TicketDeliveryMethod": "Delivery",
    "BookingReferenceNumber": "L5W4NW",
    "Passengers": [
    {
        "FirstName": "Fulano",
        "MiddleName": "D",
        "LastName": "Tal",
        "PassengerType": "Adult",
        "Email": "email@mail.com",
        "Phone": "1234567890",
        "TicketNumber": "123541",
        "LoyaltyMemberNumber": "159753852",
        "Legs" : [
        {
            "ArrivalAirport": "AMS",
            "DepartureAirport": "GIG",
            "ArrivalCountry": "NLD",
            "DepartureCountry": "BRA",
            "AirlineCode": "KLM",
            "DepartureDateTime": "2018-01-09 18:00",
            "ClassOfService": "Standard"
        }]
    }]
  }
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

### Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body (Body)**

|Parameter|Description|Type|
|:-|:-|:-:|
|`TransactionId`|Transaction id on Antifraud Gateway Braspag|guid|
|`Status`|Transaction status on Antifraud Gateway Braspag <br/> [Table 20  - Status]({{ site.baseurl_root }}en/manual/antifraude#table-20-status)|enum|
|`ProviderAnalysisResult.ProviderRequestId`|ReDShield transaction request id|string|
|`ProviderAnalysisResult.Result.ProviderCode`|ReDShield return code|string|
|`ProviderAnalysisResult.Result.ProviderDescription`|ReDShield return message|string|
|`ProviderAnalysisResult.ResultDetails.CSITransactionLink`|Link to view transaction details on ReDShield CSI portal|string|
|`ProviderAnalysisResult.ResultDetails.ProviderStatus`|ReDShield transaction status <br/> [Table 21 - ProviderStatus]({{ site.baseurl_root }}en/manual/antifraude#table-21-providerstatus)|enum|
|`ProviderAnalysisResult.ResultDetails.ProviderTransactionId`|ReDShield transaction id|string|
|`ProviderAnalysisResult.ResultDetails.ProviderOrderId`|ReDShield order id|string|
|`ProviderAnalysisResult.Ndc`|ReDShield unique request id|string|
|`MerchantOrderId`|Merchant order number|string|
|`TotalOrderAmount`|Total order value in cents <br/> Ex: 123456 = r$ 1.234,56|long|
|`TransactionAmount`|Value of the financial transaction in cents <br/> Ex: 150000 = r$ 1.500,00|long|
|`Currency`|Currency. More information on [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)|enum|
|`Provider`|Antifraud provider <br/> [Table 1 - Provider]({{ site.baseurl_root }}//en/manual/antifraude#table-1-provider)|enum|
|`OrderDate`|Order date <br/> Ex.: 2016-12-09 19:16:38.155|datetime|
|`BraspagTransactionId`|Transaction id in Pagador Braspag|guid|
|`Tid`|Acquirer transaction id <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the fields` Nsu`, `AuthorizationCode` and` SaleDate`, besides this one in question|string|
|`Nsu`|Acquirer transaction unique sequence number <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `AuthorizationCode` and `SaleDate`, in addition to the one in question|string|
|`AuthorizationCode`|Acquirer authorization code <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the` Tid`, `Nsu` and `SaleDate`, in addition to the one in question|string|
|`SaleDate`|Acquirer authorization date <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `Nsu `and` AuthorizationCode`, in addition to the one in question|datetime|
|`SplitingPaymentMethod`|Identifies whether the transaction authorization is with one or more cards or with more than one payment methods <br/> [Table 2 - SplitingPaymentMethod]({{ site.baseurl_root }}en/manual/antifraude#table-2-splitingpaymentmethod)|enum|
|`IsRetryTransaction`|Retentive of an analysis, and should be sent with value equal to TRUE when the return code on the first attempt equals BP900|bool|
|`Card.Number`|Credit card number|string|
|`Card.Holder`|Holder name|string|
|`Card.ExpirationDate`|Credit card expiration date <br/> Ex.: 01/2023|string|
|`Card.Cvv`|Credit card security code|string|
|`Card.Brand`|Credit card brand <br/> [Table 3 - Card.Brand]({{ site.baseurl_root }}en/manual/antifraude#table-3-card.brand)|enum|
|`Card.EciThreeDSecure`|Electronic Commerce Indicator (ECI)|string|
|`Card.Save`|Indicates whether credit card data will be stored on the Cartão Protegido|bool|
|`Card.Token`|Credit card token saved on the Cartão Protegido|guid|
|`Card.Alias`|Credit card alias saved on the Cartão Protegido|string|
|`Billing.Street`|Billing address street|string|
|`Billing.Number`|Billing address number|string|
|`Billing.Complement`|Billing address complement|string|
|`Billing.Neighborhood`|Billing address neighborhood|string|
|`Billing.City`|Billing address city|string|
|`Billing.State`|Billing address state|string|
|`Billing.Country`|Billing address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Billing.ZipCode`|Billing address zipcode|string|
|`Shipping.Street`|Shipping address street|string|
|`Shipping.Number`|Shipping address number|string|
|`Shipping.Complement`|Shipping address complement|string|
|`Shipping.Neighborhood`|Shipping address neighborhood|string|
|`Shipping.City`|Shipping address city|string|
|`Shipping.State`|Shipping address state|string|
|`Shipping.Country`|Shipping address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Shipping.ZipCode`|Shipping address zipcode|string|
|`Shipping.Email`|Email of the person responsible to receive the product at the shipping address|string|
|`Shipping.FirstName`|First name of person in charge of receiving product at shipping address|string|
|`Shipping.MiddleName`|First letter of the middle name of the person in charge of receiving the product at the shipping address|string|
|`Shipping.LastName`|Last name of the person in charge of receiving the product at the shipping address|string|
|`Shipping.Phone`|Telephone number of the person in charge of receiving the product at the shipping address <br/> Ex.: 552121114700|string|
|`Shipping.WorkPhone`|Workphone number of the person in charge of receiving the product at the shipping address <br/> Ex.: 552121114701|string|
|`Shipping.Mobile`|Mobile number of the person in charge of receiving the product at the shipping address <br/> Ex.: 5521987654321|string|
|`Shipping.ShippingMethod`|Order delivery method <br/> [Table 4 - ShippingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-4-shippingmethod)|enum|
|`Shipping.Comment`|Shipping address references|string|
|`Customer.MerchantCustomerId`|Customer document number, CPF or CNPJ|string|
|`Customer.FirstName`|Customer first name|string|
|`Customer.MiddleName`|First letter of the middle name customer|string|
|`Customer.LastName`|Customer last name|string|
|`Customer.BirthDate`|Customer birthdate <br/> Ex.: 1983-10-01|date|
|`Customer.Gender`|Customer gender <br/> [Table 6 - Customer.Gender]({{ site.baseurl_root }}//en/manual/antifraude#table-6-customer.gender)|string|
|`Customer.Email`|Customer email|string|
|`Customer.Ip`|Customer IP address|string|
|`Customer.Phone`|Customer telephone number <br/> Ex.: 552121114700|string|
|`Customer.WorkPhone`|Customer workphone number <br/> Ex.: 552121114701|string|
|`Customer.Mobile`|Customer mobile number <br/> Ex.: 5521987654321|string|
|`Customer.Status`|Merchant customer status <br/> [Table 7 - Customer.Status]({{ site.baseurl_root }}en/manual/antifraude#table-7-customer.status)|string|
|`Customer.BrowserFingerPrint`|Device fingerprint and customer IP real geolocation|string|
|`CartItem[n].ProductName`|Product name|string|
|`CartItem[n].UnitPrice`|Product unit price <br/> Ex: 10950 = r$ 109,50|long|
|`CartItem[n].OriginalPrice`|Product original price <br/> Ex: 11490 = r$ 114,90|long|
|`CartItem[n].MerchantItemId`|Merchant product id|string|
|`CartItem[n].Sku`|Product SKU|string|
|`CartItem[n].Quantity`|Product quantity|int|
|`CartItem[n].GiftMessage`|Gift message|string|
|`CartItem[n].Description`|Product description|string|
|`CartItem[n].ShippingInstructions`|Product delivery instructions|string|
|`CartItem[n].ShippingMethod`|Product delivery method <br/> [Table 4 - ShippingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-4-shippingmethod)|enum|
|`CartItem[n].ShippingTranckingNumber`|Product tracking number|string|
|`Airline.ThirdPartyBooking`|Indicates whether the reservation was scheduled by third parties, such as tourism agencies|bool|
|`Airline.BookingType`|Type of booking schedule|string|
|`Airline.TicketDeliveryMethod`|Ticket delivery type|string|
|`Airline.BookingReferenceNumber`|Booking reference number|string|
|`Airline.Passengers[n].FirstName`|Passenger first name|string|
|`Airline.Passengers[n].MiddleName`|Passenger middle name|string|
|`Airline.Passengers[n].LastName`|Passenger last name|string|
|`Airline.Passengers[n].PassengerType`|Passenger type <br/> [Table 9 - Airline.Passengers{n}.PassengerType]({{ site.baseurl_root }}en/manual/antifraude#table-9-airline.passengers[n].passengertype)|enum|
|`Airline.Passengers[n].Phone`|Passenger telephone number <br/> Ex.: 552121114700|string|
|`Airline.Passengers[n].Email`|Passenger email|string|
|`Airline.Passengers[n].LoyaltyMemberNumber`|Loyalty member number|string|
|`Airline.Passengers[n].TicketNumber`|Ticket number|string|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Departure airport code. More informations on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`Airline.Passengers[n].Legs[n].DepartureCountry`|Country code of departure airport. More information on [ISO 3-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Arrival airport code. More information on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`Airline.Passengers[n].Legs[n].ArrivalCountry`|Country code of arrival airport. More information on [ISO 3-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Airline.Passengers[n].Legs[n].AirlineCode`|Airline code|string|
|`Airline.Passengers[n].Legs[n].DepartureDateTime`|Departure datetime <br/> Ex.: 2018-03-31 19:16:38 |datetime|
|`Airline.Passengers[n].Legs[n].ClassOfService`|Class service|string|
|`CustomConfiguration.MerchantWebsite`|Merchant website|string|
|`MerchantDefinedData[n].Key`|Field key set against antifraud provider <br/> [Table 36 - MerchantDefinedData(ReDShield)]({{ site.baseurl_root }}en/manual/antifraude#table-36-merchantdefineddata-(redshield))|int|no|-|
|`MerchantDefinedData[n].Value`|Field value set against antifraud provider <br/> [Table 36 - MerchantDefinedData(ReDShield)]({{ site.baseurl_root }}en/manual/antifraude#table-36-merchantdefineddata-(redshield))|var|no|-|

## Querying a transaction Cybersource

``` json
{
   "TransactionId": "1eae3d39-a723-e811-80c3-0003ff21d83f",
   "Status": "Accept",
   "ProviderAnalysisResult": {
       "ProviderTransactionId": "5206061832306553904009",
       "ProviderStatus": "ACCEPT",
       "ProviderCode": "100",
       "ProviderRequestTransactionId": "AhjzbwSTGjifFZXHYduJEAFReTUyEoftDpA9+Ehk0kv9Atj2YEBMmAL2",
       "AfsReply": {
           "reasonCode": "100",
           "afsResult": "99",
           "hostSeverity": "3",
           "consumerLocalTime": "11:36:23",
           "afsFactorCode": "D^F^Z",
           "addressInfoCode": "COR-BA",
           "hotlistInfoCode": "NEG-AFCB^NEG-BA^NEG-CC^NEG-EM^NEG-PEM^NEG-SA^REV-PPH^REV-SUSP",
           "internetInfoCode": "FREE-EM^RISK-EM",
           "suspiciousInfoCode": "RISK-TB",
           "velocityInfoCode": "VEL-NAME",
           "scoreModelUsed": "default_lac"
       },
       "DecisionReply": {
           "casePriority": "3",
           "activeProfileReply": {},
           "velocityInfoCode": "GVEL-R1^GVEL-R2^GVEL-R4^GVEL-R6^GVEL-R7^GVEL-R9"
       }
   },
   "Links": [
       {
           "Method": "GET",
           "Href": "http://localhost:1316/Analysis/v2/1eae3d39-a723-e811-80c3-0003ff21d83f",
           "Rel": "Self"
       }
   ],
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "Cybersource",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA"
  },
  "Billing": {
    "Street": "Rua Saturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Neturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "FirstName": "João",
    "LastName": "Silva",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "LastName": "Silva",
    "BirthDate": "2016-12-09",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "Ip": "127.0.0.1",
    "BrowserHostName":"www.dominiobrowsercomprador.com.br",
    "BrowserCookiesAccepted":true,
    "BrowserEmail":"emailbrowsercomprador@dominio.com.br",
    "BrowserType":"Chrome 58 on Windows 10"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "12000",
      "Sku": "abc123",
      "Quantity": 1,
      "Risk":"Low",
      "AddressRiskVerify":"No",
      "HostHedge":"Low",
      "NonSensicalHedge":"Normal",
      "ObscenitiesHedge":"High",
      "TimeHedge":"Low",
      "PhoneHedge":"Normal",
      "VelocityHedge":"High"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "96385",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "Risk": "High"
    }
  ],
  "MerchantDefinedData": [
    {
      "Key": "1",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "2",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "3",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    }
  ],
  "Bank":{
    "Address": "Rua Marte, 29",
    "Code": "237",
    "Agency": "987654",
    "City": "Rio de Janeiro",
    "Country": "BR",
    "Name": "Bradesco",
    "SwiftCode": "789"
  },
  "FundTransfer":{
    "AccountNumber":"159753",
    "AccountName":"Conta particular",
    "BankCheckDigit":"51",
    "Iban":"123456789"
  },
  "Invoice":{
    "IsGift": false,
    "ReturnsAccept": true,
    "Tender": "Consumer"
  },
  "Airline": {
    "JourneyType": "OneWayTrip",
    "DepartureDateTime": "2018-01-09 18:00",
    "Passengers": [
    {
        "FirstName": "Fulano",
        "LastName": "Tal",
        "PassangerId": "",
        "PassengerType": "Adult",
        "Email": "email@mail.com",
        "Phone": "1234567890",
        "Status": "Gold",
        "Legs" : [
        {
            "ArrivalAirport": "AMS",
            "DepartureAirport": "GIG"
        }]
    }]
  }
}
```

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">analysis/v2/{Id}</span></aside>

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

### Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body (Body)**

|Parameter|Description|Type|
|:-|:-|:-:|
|`TransactionId`|Transaction id on Antifraud Gateway Braspag Braspag|guid|
|`Status`|Transaction status on Antifraud Gateway Braspag <br/> [Table 20  - Status]({{ site.baseurl_root }}en/manual/antifraude#table-20-status)|enum|
|`ProviderAnalysisResult.ProviderTransactionId`|Cybersource transaction id|string|
|`ProviderAnalysisResult.ProviderStatus`|Cybersource transaction status <br/> [Table 21 - ProviderStatus]({{ site.baseurl_root }}en/manual/antifraude#table-21-providerstatus)|enum|
|`ProviderAnalysisResult.ProviderCode`|Cybersource return code <br/> [Table 22 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}en/manual/antifraude#table-22-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.ProviderRequestTransactionId`|Cybersource transaction request id|string|
|`ProviderAnalysisResult.Missing`|Missing fields in the request sent to Cybersource|string|
|`ProviderAnalysisResult.Invalid`|Fields with invalid values sent to Cybersource|string|
|`ProviderAnalysisResult.AfsReply.AddressInfoCode`|Codes that indicate incompatibilities between the customer's billing and shipping addresses <br/> Codes are concatenated using the character <br/> Os códigos são concatenados usando o caracter ^ Ex.: MM-A^MM-Z <br/>[Table 23 - ProviderAnalysisResult.AfsReply.AddressInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-23-provideranalysisresult.afsreply.addressinfocode)|string|
|`ProviderAnalysisResult.AfsReply.AfsFactorCode`|Codes that affect analysis score <br/> Codes are concatenated using the ^ character. Ex: [Table 24 - ProviderAnalysisResult.AfsReply.AfsFactorCode]({{ site.baseurl_root }}en/manual/antifraude#table-24-provideranalysisresult.afsreply.afsfactorcode)|string|
|`ProviderAnalysisResult.AfsReply.AfsResult`|Total calculated score for order|int|
|`ProviderAnalysisResult.AfsReply.BinCountry`|BIN country code of the card used in the analysis. More information on More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`ProviderAnalysisResult.AfsReply.CardAccountType`|Card type <br/> [Table 25 - ProviderAnalysisResult.AfsReply.CardAccountType]({{ site.baseurl_root }}en/manual/antifraude#table-25-provideranalysisresult.afsreply.cardaccounttype)|string|
|`ProviderAnalysisResult.AfsReply.CardIssuer`|Name of the bank or issuer of the card|string|
|`ProviderAnalysisResult.AfsReply.CardScheme`|Card brand|string|
|`ProviderAnalysisResult.AfsReply.ConsumerLocalTime`|Customer's local time, calculated from the date of the request and the billing address|string|
|`ProviderAnalysisResult.AfsReply.HostSeverity`|Risk level of the customer's e-mail domain, 0 to 5, where 0 is undetermined risk and 5 represents the highest risk|int|
|`ProviderAnalysisResult.AfsReply.HotListInfoCode`|Codes that indicate customer data are associated with positive or negative lists <br/> Codes are concatenated using the ^ character. Ex .: NEG-AFCB ^ NEG-CC [Table 26 - ProviderAnalysisResult.AfsReply.HotListInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-26-provideranalysisresult.afsreply.hotlistinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IdentityInfoCode`|Codes that indicate excessive identity changes <br/> Codes are concatenated using the ^ character. Example: COR-BA-MM-BIN [Table 27 - ProviderAnalysisResult.AfsReply.IdentityInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-27-provideranalysisresult.afsreply.identityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.InternetInfoCode`|Codes that indicate problems with the email address, IP address or billing address <br/> Codes are concatenated using the ^ character. Ex .: COR-BA-MM-BIN [Table 28 Codes are concatenated using the ^ character. Ex .: COR-BA-MM-BIN [Table 28 - ProviderAnalysisResult.AfsReply.InternetInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-28-provideranalysisresult.afsreply.internetinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IpCity`|Customer's city name obtained from the IP address|string|
|`ProviderAnalysisResult.AfsReply.IpCountry`|Customer's country name obtained from the IP address|string|
|`ProviderAnalysisResult.AfsReply.IpRoutingMethod`|Customer's routing method obtained from the IP address <br/> [Table 32 - ProviderAnalysisResult.AfsReply.IpRoutingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-32-provideranalysisresult.afsreply.iproutingmethod)|string|
|`ProviderAnalysisResult.AfsReply.IpState`|Customer's state name obtained from the IP address|string|
|`ProviderAnalysisResult.AfsReply.PhoneInfoCode`|Codes that indicate a problem with the customer's phone number <br/> Codes are concatenated using the ^ character. Ex .: UNV-AC ^ RISK-AC [Table 29 - ProviderAnalysisResult.AfsReply.PhoneInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-29-provideranalysisresult.afsreply.phoneinfocode)|string|
|`ProviderAnalysisResult.AfsReply.ReasonCode`|Cybersource return code <br/> [Table 22 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}en/manual/antifraude#table-22-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.AfsReply.ScoreModelUsed`|Name of the scoring model used in the analysis. If you do not have a defined, the Cybersource default scoring model was used|string|
|`ProviderAnalysisResult.AfsReply.SuspiciousInfoCode`|Codes that indicate that the customer potentially provided suspicious information <br/> Codes are concatenated using the ^ character. Ex .: RISK-TB ^ RISK-TS [Table 30 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-30-provideranalysisresult.afsreply.suspiciousinfocode)|string|
|`ProviderAnalysisResult.AfsReply.VelocityInfoCode`|Codes that indicate that the customer has a high frequency of purchases <br/> Codes are concatenated using the ^ character. Ex .: VELV-SA VELI-CC VELSIP [Table 31 - ProviderAnalysisResult.AfsReply.VelocityInfoCode]({{ site.baseurl_root }}en/manual/antifraude#table-31-provideranalysisresult.afsreply.velocityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.BrowserLanguage`|Browser language used by the customer at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ScreenResolution`|Screen resolution of the customer at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.CookiesEnabled`|Flag identifying that the customer's browser was enabled to temporarily store cookies at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.FlashEnabled`|Flag identifying that the customer's browser enabled the execution of Flash content at the time of purchase |string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.Hash`|Hash generated from the data collected by the fingerprint script|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ImagesEnabled`|Flag identifying that the customer's browser was enabled with image caching at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.JavascriptEnabled`|Flag identifying that the customer's browser was running Javascript sripts enabled at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddress`|Flag identifying that customer IP address is real|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCity`|Flag identifying that the customer IP address is in fact of the city that it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCountry`|Flag identifying that the customer IP address is in fact of the country that it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartId`|Customer device identifier|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartIdConfidenceLevel`|Customer device identifier|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.DestinationQueue`|When verbose mode is enabled, the name of the queue to which the transactions do not automatically accept are sent|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.Name`|When verbose mode is enabled, name of the profile selected in the analysis. If you do not have any, the default profile has been selected|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.SelectedBy`|When verbose mode is enabled, name of the rule selector that selects the rules profile|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].RuleId`|When verbose mode is enabled, rule id|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision`|When verbose mode is enabled, decision taken by rule <br/> [Table 33 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Decision]({{ site.baseurl_root }}en/manual/antifraude#table-33-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].decision)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation`|When verbose mode is enabled, rule evaluation <br/> [Table 34 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Evaluation]({{ site.baseurl_root }}en/manual/antifraude#table-34-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].evaluation)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Name`|When verbose mode is enabled, rule name|string|
|`ProviderAnalysisResult.DecisionReply.CasePriority`|Sets the priority level of the rules or profiles of the merchant. The priority level varies from 1 (major) to 5 (minor) and the default value is 3, and this will be assigned if you have not set the priority of the rules or profiles. This field will only be returned if the merchant is an Enhanced Case Management subscriber|string|
|`ProviderAnalysisResult.DecisionReply.VelocityInfoCode`|Codes of information triggered by analysis. These codes were generated when the rules were created|string|
|`MerchantOrderId` |Merchant order number|string|
|`TotalOrderAmount`|Total order value in cents <br/> Ex: 123456 = r$ 1.234,56|long|
|`TransactionAmount`|Value of the financial transaction in cents <br/> Ex: 150000 = r$ 1.500,00|long|
|`Currency`|Currency. More information on [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)|string|
|`Provider`|Antifraud provider <br/> [Table 1 - Provider]({{ site.baseurl_root }}//en/manual/antifraude#table-1-provider)|enum|
|`OrderDate`|Order date <br/> Ex.: 2016-12-09 19:16:38.155|datetime|
|`BraspagTransactionId`|Transaction id in Pagador Braspag|guid|
|`Tid`|Acquirer transaction id <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the fields` Nsu`, `AuthorizationCode` and` SaleDate`, besides this one in question|string|
|`Nsu`|Acquirer transaction unique sequence number <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `AuthorizationCode` and `SaleDate`, in addition to the one in question|string|
|`AuthorizationCode`|Acquirer authorization code <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the `BraspagTransactionId` field, so you need to send the` Tid`, `Nsu` and `SaleDate`, in addition to the one in question|string|
|`SaleDate`|Acquirer authorization date <br/> Note: If you do not have integration with the Pagador Braspag, you can not send the field `BraspagTransactionId`, so you need to send the fields` Tid`, `Nsu `and` AuthorizationCode`, in addition to the one in question|datetime|
|`Card.Number`|Credit card number|string|
|`Card.Holder`|Holder name|string|
|`Card.ExpirationDate`|Credit card expiration date <br/> Ex.: 01/2023|string|
|`Card.Brand`|Credit card brand <br/> [Table 3 - Card.Brand]({{ site.baseurl_root }}en/manual/antifraude#table-3-card.brand)|enum|
|`Card.Save`|Indicates whether credit card data will be stored on the Cartão Protegido|bool|
|`Card.Token`|Credit card token saved on the Cartão Protegido|guid|
|`Card.Alias`|Credit card alias saved on the Cartão Protegido|string|
|`Billing.Street`|Billing address street|string|
|`Billing.Number`|Billing address number|string|
|`Billing.Complement`|Billing address complement|string|
|`Billing.Neighborhood`|Billing address neighborhood|string|
|`Billing.City`|Billing address city|string|
|`Billing.State`|Billing address state|string|
|`Billing.Country`|Billing address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Billing.ZipCode`|Billing address zipcode|string|
|`Shipping.Street`|Shipping address street|string|
|`Shipping.Number`|Shipping address number|string|
|`Shipping.Complement`|Shipping address complement|string|
|`Shipping.Neighborhood`|Shipping address neighborhood|string|
|`Shipping.City`|Shipping address city|string|
|`Shipping.State`|Shipping address state|string|
|`Shipping.Country`|Shipping address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Shipping.ZipCode`|Shipping address zipcode|string|
|`Shipping.FirstName`|First name of person in charge of receiving product at shipping address|string|
|`Shipping.LastName`|Last name of the person in charge of receiving the product at the shipping address|string|
|`Shipping.Phone`|Telephone number of the person in charge of receiving the product at the shipping address <br/> Ex.: 552121114700|string|
|`Shipping.ShippingMethod`|Order delivery method <br/> [Table 4 - ShippingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-4-shippingmethod)|enum|
|`Customer.MerchantCustomerId`|Customer document number, CPF or CNPJ|string|
|`Customer.FirstName`|Customer first name|string|
|`Customer.LastName`|Customer last name|string|
|`Customer.BirthDate`|Customer birthdate <br/> Ex.: 1983-10-01|date|
|`Customer.Email`|Customer email|string|
|`Customer.Ip`|Customer IP address|string|
|`Customer.Phone`|Customer telephone number <br/> Ex.: 552121114700|string|
|`Customer.BrowserHostName`|Host name entered by the customer's browser and identified through the HTTP header|string|
|`Customer.BrowserCookiesAccepted`|Identifies whether the customer's browser accepts cookies or not|bool|
|`Customer.BrowserEmail`|E-mail registered in the customer's browser. Can differ from merchant email (`Customer.Email`)|string|
|`Customer.BrowserType`|Name of the browser used by the customer and identified through the HTTP header|string|
|`CartItem[n].ProductName`|Product name|string|
|`CartItem[n].Risk`|Risk level of the product associated with the quantity of chargebacks <br/> [Table 11 - CartItem{n}.Risk]({{ site.baseurl_root }}en/manual/antifraude#table-11-cartitem[n].risk)|enum|
|`CartItem[n].UnitPrice`|Product unit price <br/> Ex: 10950 = r$ 109,50|long|
|`CartItem[n].Sku`|Product SKU|string|
|`CartItem[n].Quantity`|Product quantity|int|
|`CartItem[n].AddressRiskVerify`|Identifies that you will evaluate the billing and shipping addresses for different cities, states or countries <br/> [Table 12 - CartItem{n}.AddressRiskVerify]({{ site.baseurl_root }}en/manual/antifraude#table-12-cartitem[n].addressriskverify)|enum|
|`CartItem[n].HostHedge`|Level of importance of customer IP and email addresses in fraud analysis <br/> [Table 13 - CartItem{n}.HostHedge]({{ site.baseurl_root }}en/manual/antifraude#table-13-cartitem[n].hosthedge)|enum|
|`CartItem[n].NonSensicalHedge`|Level of importance of verifications about the customer data non sensical in fraud analysis <br/> [Table 14 - CartItem{n}.NonSensicalHedge]({{ site.baseurl_root }}en/manual/antifraude#table-14-cartitem[n].nonsensicalhedge)|enum|
|`CartItem[n].ObscenitiesHedge`|Level of importance of checks on customer data with obscenity in fraud analysis <br/> [Table 15 - CartItem{n}.ObscenitiesHedge]({{ site.baseurl_root }}en/manual/antifraude#table-15-cartitem[n].obscenitieshedge)|enum|
|`CartItem[n].TimeHedge`|Level of importance of the time of day in the fraud analysis that the customer made the request <br/> [Table 16 - CartItem{n}.TimeHedge]({{ site.baseurl_root }}en/manual/antifraude#table-16-cartitem[n].timehedge)|enum|
|`CartItem[n].PhoneHedge`|Level of importance of checks on customer's phone numbers in fraud analysis <br/> [Table 17 - CartItem{n}.PhoneHedge]({{ site.baseurl_root }}en/manual/antifraude#table-17-cartitem[n].phonehedge)|enum|
|`CartItem[n].VelocityHedge`|Level of importance of customer's purchase frequency in the fraud analysis of the previous 15 minutes <br/> [Table 18 - CartItem{n}.VelocityHedge]({{ site.baseurl_root }}en/manual/antifraude#table-18-cartitem[n].velocityhedge)|enum|
|`Bank.Name`|Customer's bank name|string|
|`Bank.Code`|Customer's bank code|string|
|`Bank.Agency`|Customer's bank agency|string|
|`Bank.Address`|Customer's bank address|string|
|`Bank.City`|Customer's bank city|string|
|`Bank.Country`|Customer's bank city <br/> More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Bank.SwiftCode`|Customer's bank swift code|string|
|`FundTransfer.AccountName`|Name linked to bank account|string|
|`FundTransfer.AccountNumber`|Customer's bank account number|string|
|`FundTransfer.BankCheckDigit`|Code used to validate customer's bank account|string|
|`FundTransfer.Iban`|Customer's International Bank Account Number (IBAN)|string|
|`Invoice.IsGift`|Indicates whether the order placed by the customer is for gift|bool|
|`Invoice.ReturnsAccepted`|Indicates whether the order placed by the customer can be returned to the merchant|bool|
|`Invoice.Tender`|Payment method used by the customer <br/> [Table 19 - Invoice.Tender]({{ site.baseurl_root }}en/manual/antifraude#table-19-invoice.tender)|enum|
|`Airline.JourneyType`|Journey type <br/> [Table 8 - Airline.JourneyType]({{ site.baseurl_root }}en/manual/antifraude#table-8-airline.journeytype)|enun|
|`Airline.DepartureDateTime`|Departure datetime <br/> Ex.: 2018-03-31 19:16:38|datetime|
|`Airline.Passengers[n].FirstName`|Passenger first name|string|
|`Airline.Passengers[n].LastName`|Passenger last name|string|
|`Airline.Passengers[n].PassengerId`|Identifier of the passenger to whom the ticket was issued|string|
|`Airline.Passengers[n].PassengerType`|Passenger type <br/> [Table 9 - Airline.Passengers{n}.PassengerType]({{ site.baseurl_root }}en/manual/antifraude#table-9-airline.passengers[n].passengertype)|enum|
|`Airline.Passengers[n].Phone`|Passenger telephone number <br/> Ex.: 552121114700|string|
|`Airline.Passengers[n].Email`|Passenger email|string|
|`Airline.Passengers[n].Status`|Airline classification <br/> [Table 10 - Airline.Passengers{n}.Status]({{ site.baseurl_root }}en/manual/antifraude#table-10-airline.passengers[n].status)|enum|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Departure airport code. More informations on. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Arrival airport code. More information on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`CustomConfiguration.Comments`|Comments that the merchant may associate fraud analysis|string|
|`CustomConfiguration.ScoreThreshold`|Acceptable level of risk for each product|int|
|`MerchantDefinedData[n].Key`|Field key set against antifraud provider <br/> [Table 37 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}en/manual/antifraude#table-37-merchantdefineddata-(cybersource))|int|no|-|
|`MerchantDefinedData[n].Value`|Field value set against antifraud provider <br/> [Table 37 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}en/manual/antifraude#table-37-merchantdefineddata-(cybersource))|var|no|-|

## Querying a non-existent transaction

<aside class="request"><span class="method get">GET</span> <span class="endpoint">analysis/v2/{Id}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

### Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

# Notification Post

This session describes the Notification POST service, which sends a notification to the merchant, in case there is any change of status in the review transaction to accept / reject or accept to reject.

* In the process of onboarding your merchant, it is necessary to ask the Implementation Team of Braspag to register the URL of change of status of your merchant.

* When prompted by Braspag's server, sending a POST, the URL registered to receive notification of the status change, should return the HTTP 200 (OK) code, indicating that the message was successfully received and processed by the merchant server. Otherwise, 3 more shipping attempts will be made.

* The status change URL can only use port 80 (default for http) or port 443 (default for https). We recommend that the merchant always work with SSL for this URL, that is, always HTTPS.

* After the merchant receives the status change notification, it must perform a GET through the URL https://{antifraude endpoint}/analysi/v2/{Id}, sending the transaction ID that was received in the notification of the change of status to get the new status of the transaction.

## Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{url loja}</span></aside>

``` json
{  
   "Id":"tttttttt-tttt-tttt-tttt-tttttttttttt"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|

**Parameters in the body (Body)**

|Parameter|Description|Type|
|:-|:-|:-:|
|`Id`|Transaction id on Antifraud Gateway Braspag|guid|

## Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

# Link Pagador and Antifraud transaction

This session describes how to link a transaction from the Pagador Braspag to a transaction of the Antifraud Gateway Braspag.

> You should make this call when using the flow below: <br/>
> 1 - Send analyzes through the Antifraud Gateway Braspag <br/>
> 2 - Performs the authorization through the Pagador Braspag <br/>
> 3 - The 3rd step should be the call to this service to link the transaction of the Pagador Braspag to the transaction of the Antifraud Gateway Braspag

<aside class="request"><span class="method patch">PATCH</span> <span class="endpoint">transaction/{id}</span></aside>

## Request

``` json
{
    "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parameters in the body (Body)**

|Parameter|Description|Type|Required|Size|
|:-|:-|:-:|:-:|-:|
|`BraspagTransactionId`|Transaction id in Pagador Braspag|guid|yes|-|

## Response

**Parameters in the header (Header)**

When the Pagador transaction is properly linked to the Antifraud transaction

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

* When the Payer transaction is not entered in the requisition

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* When the Antifraud Gateway transaction is not found in the database

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

* When the Pagador transaction is already associated with another Antifraud Gateway transaction

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|409 Conflict|

# Cybersource Status Update

This section describes how to change the status of transactions in review to accept or reject or accept to reject.

## Request

<aside class="request"><span class="method patch">PATCH</span> <span class="endpoint">transaction/{id}</span></aside>

``` json
{
    "Status":"Accept",
    "Comments":"Transaction accepted after contact with customer."
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parameters in the body (Body)**

|Parameter|Description|Type|Required|Size|
|:-|:-|:-:|:-:|-:|
|`Status`|Transaction new status - Table 19|enum|yes|-|
|`Comments`|Comment associated with status change|string|no|255|

## Response

* When the transaction is received for processing.

``` json
{
    "Message": "Change status request successfully received. New status: Accept."
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`Message`|Message containing the reason for the operation|string|

* When the transaction is not found in the database.

``` json
{
    "Message": "The transaction does not exist."
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`Message`|Message containing the reason for the operation|string|

* When the transaction is not eligible to change status.

``` json
{
    "Message": "The transaction is not able to update status. Actual status: Reject."
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`Message`|Message containing the reason for the operation|string|

* When the new status sent is different from Accept or Reject.

``` json
{
    "Message": "The new status is invalid to update transaction. Accepted status are: 'Accept' or 'Reject'."
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`Message`|Message containing the reason for the operation|string|

* When the type or size of any field is not sent as specified in the manual.

``` json
{
    "Message": "The request is invalid.",
    "ModelState": {
        "request.Status": [
            "Error converting value \"Review\" to type 'Antifraude.Domain.Enums.StatusType'. Path 'Status', line 2, position 16."
        ],
        "request.Comments": [
            "The field Comments must be a string or array type with a maximum length of '255'."
        ]
    }
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`Message`|Message stating that the request is invalid|
|`ModelState`|Collection that will contain messages with fields that do not conform to the type, domain or size as specified in the manual|

# Fingerprint Configuration

This session describes how it works and how to set up the fingerprint on your checkout page and mobiles.

## ReDShield

### Integration with your checkout page(site)

#### How it works?

![Fluxo]({{ site.baseurl_root }}/images/braspag/af/fingerprint.png)

1 - The merchant checkout page sends the attributes of the customer's device to Iovation, thus creating the *blackbox* <br/> 2 - The merchant receives the encrypted Iovation string and writes the same on the checkout page in a field of type *hidden* <br/> 3 - The merchant sends to Braspag, along with the other data of the transaction to be analyzed, the *blackbox* <br/> 4 - Braspag receives all the data, validated and sends to ReDShield <br/> 5 - ReDShield receives all data, sends the *blackbox* to Iovation to decrypt <br/> 6 - RedShield receives from Iovation the attributes of the customer's device

#### How to configure?

1 - Include Iovation's javascript on your checkout page <br/> 2 - Add configuration parameters in javascript <br/> 3 - Create a field of type *hidden* on your page to write the *blackbox* in it send it along with the transaction data to be analyzed

**Note:** Do not cache the script as it may occur that multiple devices are identified as being the same.

* Including javascript from Iovation

To include javascript, add the following element **&lt;script&gt;** to your checkout page.

This is the URL of the Iovation snare.js version: &lt;script type = "text / javascript" src = "https://mpsnare.iesnare.com/snare.js"&gt;&lt;/script&gt;

* Configuration parameters

|Parameter|Description|Default|
|:-|:-|:-|
|`io_install_flash`|Determines whether the user will be prompted to install Flash or update the version|false|
|`io_flash_needs_handler`|This parameter will only be valid if the `io_install_flash` parameter is set to TRUE, otherwise it will not be executed <br/> You can customize your own message here if Flash is not installed <br/> Ex.: var `io_flash_needs_handler` = "Alert('Instalar Flash');"|-|
|`io_install_stm`|Determines whether the user will be prompted to install Active X, which helps to collect hardware information <br/> This control is only available for Internet Explorer, and if Active X is already installed, this setting will have no effect|false|
|`io_exclude_stm`|Determines whether Active X should be executed when installed <br/> It is possible to choose to disable control for specific platforms <br/> Possible values: <br/> 0 - runs on all platforms <br/> 1 - does not execute on Windows 9.x (including versions 3.1, 95, 98 and ME) <br/> 2 - does not run on Windows CE <br/> 4 - does not run on Windows XP (including NT, 2000, 2003 and 8 ) <br/> 8 - does not run in Windows Vista <br/> Note: Values are the combination of sums of the above values, for example: 12 - does not run in Windows XP (4) or Windows Vista (8)|15|
|`io_bbout_element_id`|Id of the HTML element to fill with the *blackbox* <br/> If the `io_bb_callback` parameter is set, it will have no effect|-|
|`io_enable_rip`|Determines whether to attempt to collect information to obtain the customer's real IP address|true|
|`io_bb_callback`|Parameter to customize the check of the collection of the *blackbox* has been completed <br/> When using, write the function according to the following syntax: <br/> *io_callback (bb, complete)*, where: <br/> bb - blackbox value <br/> complete - boolean value indicating collection completed|-|

**IMPORTANT!**
Configuration parameters must be placed before calling the above tag. They determine how Iovation's javascript will work, and errors can occur if they are placed before the javascript call.

**Exemple**
![Exemple HTML]({{ site.baseurl_root }}/images/braspag/af/exemplohtmlred.png)

## Integration into mobile applications

**Overview**
This topic explains how to integrate the Iovation mobile SDK into your iOS and Android applications.

** Downloading the SDK **
If you have not yet downloaded the iOS or Android SDK, you should do so before continuing. To do so, access one of the links below according to the desired one. <br/> [Download Deviceprint SDK iOS](https://github.com/iovation/deviceprint-SDK-iOS) <br/> [Download Deviceprint SDK Android](https://github.com/iovation/deviceprint-SDK-Android)

** About integration **
Add the Iovation Mobile SDK to your applications to collect information about customer devices. A *blackbox* that contains all available device information will be generated.

![Fingerprint mobile collection flow]({{ site.baseurl_root }}/images/braspag/af/fingerprintmobile.png)

### Integrating with iOS apps

IOS Integration files and requirements
![IOS integration details]({{ site.baseurl_root }}/images/braspag/af/fingerprintios1.png)

This version supports iOS 5.1.1 or higher on the following devices:
- iPhone 3GS and later
- iPod Touch 3rd generation or later
- All iPads

* Installing the SDK on iOS

1 - Download and unzip the SDK

2 - In Xcode, drag *iovation.framework* into the navigation area of your project
![Installation Details SDK]({{site.baseurl_root}}/images/braspag/af/fingerprintios2.png)

3 - In the dialog that appears:
- Select *Copy items if needed* to copy the framework to the project directory
- Select the check box for the targets in which you plan to use the framework
![Installation Details SDK]({{site.baseurl_root}}/images/braspag/af/fingerprintios3.png)

4 - Click finish

5 - Add the following frameworks to the destination of the application in XCode:
*ExternalAccessory.framework*. If you verify that the Wireless Accessory Configuration is enabled in Xcode 6 or higher and you do not need to, disable and re-add the ExternalAccessory.framework
*CoreTelephony.framework*
![Installation Details SDK]({{site.baseurl_root}}/images/braspag/af/fingerprintios4.png)

6 - Optionally, add these frameworks if your application makes use of them:
*AdSupport.framework*. If your app shows ads
Note: Do not include if your application does not use ads, as the App Store rejects applications that include the framework but do not use ads
*CoreLocation.framework*. If your application uses local monitoring
Note: Do not include, unless your application requests the user's geolocation permission.

* Using the + ioBegin function

The *+ioBegin* function collects information about the device and generates a *blackbox*. This *blackbox* should be sent via the *Customer.BrowserFingerPrint* field in conjunction with the other data for analysis.

* Syntax

> NSSstring * bbox = [iovation ioBegin]

* Return values

> bbox - string containing *blackbox*

**IMPORTANT!**
The *blackbox* that returned from *+ioBegin* should never be empty. An empty black box indicates that the protection offered by the system may have been compromised.

**Exemple**
![Code exemple]({{ site.baseurl_root }}/images/braspag/af/exemplocodigo1.png)

### Integrating with Android apps

Android integration files and requirements
![Details]({{site.baseurl_root}}/images/braspag/af/fingerprintandroid.png) {:.left} {:title = "Android integration details"}

**NOTE**
If the listed permissions are not required by the application, the values obtained by using these permissions are ignored. Permissions are not required to get a *blackbox*, but help get more information from the device.

Version 1.2.0 of the Iovation Mobile SDK for Android supports versions of Android 2.1 or higher.

* Installing the SDK on Android

1 - Download and unzip the deviceprint-lib-1.2.0.aar <br/> 2 - Start the IDE of your choice <br/> 3 - In Eclipse and Maven, deploy the *.aar* extension file to the local Maven repository, using maven-deploy. More details at: [Maven Guide](http://maven.apache.org/guides/mini/guide-3rd-party-jars-local.html) <br/> 4 - In Android Studio, select *File -> New Module*. Expand *More Modules* and choose *Import existing .jar or .aar package* <br/> 5 - Select the file deviceprint-lib-1.2.0.aar, and click *Finish* <br/> 6 - Make sure that the device-lib is a build dependency in the build.gradle file

![Details]({{website.baseurl_root}}/images/braspag/af/fingerprintandroid1.png) {:.left} {:title="Android integration details"}

* Using the ioBegin function

The *ioBegin* function collects information about the device and generates a *blackbox*. This *blackbox* should be sent via the *Customer.BrowserFingerPrint* field in conjunction with the other data for analysis.

* Syntax

> public static String ioBegin (Context context)

* Parameters 

> context - an instance of the class *android.content.Context* used to access information about the device

* Return values

> string containing the *blackbox*

**IMPORTANT**
The *blackbox* that returned from *ioBegin* should never be empty. An empty *blackbox* indicates that it only contains *0500* indicates that the protection offered by the system may have been compromised.

**IMPORTANT**
The *device-lib-1.2.0.aar* file should be bundled with the application.

* Compiling the sample application in Android Studio

**IMPORTANT**
If the option to run the module does not appear, select *File -> Project Structure* and open the *Modules* panel. From there, set the Android SDK version to the list.

![Code Exemple]({{ site.baseurl_root }}/images/braspag/af/exemplocodigo2.png)

1 - Download and unzip the deviceprint-lib-1.2.0.aar <br/> 2 - In Android Studio, select *File -> Open* or click *Open Project* via *quick-start* <br/> 3 - In the directory where you unzipped the *deviceprint-lib-1.2.0.aar*, open the *android-studio-sample-app* directory of the sample application <br/> 4 - Open the *DevicePrintSampleActivity* <br> 5 - With some settings, Android Studio can detect an Android Framework in the project and not configure it. In this case, open the *Event Log* and click *Configure* <br/> 6 - A pop-up will open for you to select the Android Framework. Click *OK* to fix the errors. <br/> 7 - In Android Studio, select *File -> New Module*. Expand *More Modules* and choose *Import existing .jar or .aar package* <br/> 8 - Select the file deviceprint-lib-1.2.0.aar, and click *Finish* <br/> 9 - Make sure device-lib is a build dependency in build.gradle file <br/> ![Android integration details]({{site.baseurl_root}}/images/braspag/af/fingerprintandroid1.png) <br/> 10 - Open the DevicePrintSampleActivity folder
11 - In the project navigation option, open *src/main/java/com/iovation/mobile/android/sample/DevicePrintSampleActivity.java* <br/> 12 - Right-click and select *Run DevicePrintSampleAct* <br/> 13 - Select a connected physical device or a virtual Android to run the application <br/> 14 - The application will compile and run

The next example is simple, where it has a button and clicking a text box is filled with the *blackbox*. For a richer example, see the Android Studio sample application included with the SDK.

## Cybersource

It will be necessary to add two tags, the **&lt;script&gt;** inside the **&lt;head&gt;** tag for a correct performance and **&lt;noscript&gt;** within the **&lt;body&gt;** tag, so that the device data collection is performed even if the browser Javascript is disabled.

**IMPORTANT**

If the 2 code segments are not placed on the checkout page, the results may not be accurate.

**Domain**

|Environment|Description|
|:-|:-|
|`Testing`|Use h.online-metrix.net, which is the DNS of the fingerprint server, as shown in the HTML example below|
|`Production`|Change the domain to a local URL, and configure your web server to redirect this URL to h.online-metrix.net|

**Variables**

|Variable|Description|
|:-|:-|
|`ProviderOrgId`|Sandbox = 1snn5n9w <br/> Production = k8vif92e|
|`ProviderMerchantId`|Identifier of your merchant on Cybersource. If you do not have it, contact Braspag|
|`ProviderIdentifier`|Identifier used to cross information obtained from the customer's device. This same identifier must be assigned to the `Customer.BrowserFingerprint` field that will be sent in the analysis request. <br/> The result of the concatenation between the `ProviderMerchantId` field and this, should be assigned to the `session_id` field of the script that will be included in the checkout page. <br/> Example: <br/> `ProviderMerchantId` = braspag <br/> `ProviderIdentifier` = 123456789 <br/> Result = braspag123456789 <br/><br/> Note: This identifier can be any value or the order number, but must be unique for 48 hours.|

> Javascript Code

![Code example]({{ site.baseurl_root }}/images/braspag/af/exemploscriptdfp.png)

**IMPORTANT**
Be sure to copy all data correctly and have replaced the variables correctly by their values.

** Configuring Your Web Server **

All objects refer to h.online-metrix.net, which is the DNS of the fingerprint server. When you are ready for production, you must change the server name to a local URL, and configure a URL redirection for h.online-metrix.net on your web server.

**IMPORTANT**
If you do not complete this section, you will not receive correct results, and the fingerprint provider's domain (URL) will be visible, and your consumer is more likely to block it.

## Integration into mobile applications

** Downloading the SDK **
If you have not yet downloaded the iOS or Android SDK, you should do so before continuing. To do so, access one of the links below as desired: <br/> [Download Deviceprint SDK iOS]({{site.baseurl_root}}/files/braspag/antifraude/cybersource-iossdk-fingerprint-v5.0.32.zip) <br/> [Download Deviceprint SDK Android]({{site.baseurl_root}}/files/braspag/antifraude/cybersource-androidsdk-fingerprint-v5.0.96.zip)

# Tables

## Table 1 - Provider

|Value|
|:-|
|ReDShield|
|Cybersource|

## Table 2 - SplitingPaymentMethod

|Value|Description|Provider|
|:-|:-|:-|
|None|Payment with a card only|ReDShield|
|CardSplit|Payment with more than one card|ReDShield|
|MixedPaymentMethodSplit|Payment with more than one payment method|ReDShield|

## Table 3 - Card.Brand

|Value|Provider|
|:-|:-|
|Amex|ReDShield, Cybersource|
|Diners|ReDShield, Cybersource|
|Discover|ReDShield, Cybersource|
|JCB|ReDShield, Cybersource|
|Master|ReDShield, Cybersource|
|Dankort|ReDShield, Cybersource|
|Cartebleue|ReDShield, Cybersource|
|Maestro|ReDShield, Cybersource|
|Visa|ReDShield, Cybersource|
|Elo|ReDShield, Cybersource|
|Hipercard|ReDShield, Cybersource|

## Table 4 - ShippingMethod

|Value|Description|Provider|
|:-|:-|:-|
|SameDay|Same day delivery|ReDShield, Cybersource|
|NextDay|Next day delivery|ReDShield, Cybersource|
|TwoDay|Two-day delivery|ReDShield, Cybersource|
|ThreeDay|Three day delivery|ReDShield, Cybersource|
|LowCost|Low cost delivery|ReDShield, Cybersource|
|Pickup|Store pickup|ReDShield, Cybersource|
|CarrierDesignatedByCustomer|Customer designated delivery|ReDShield|
|International|International delivery|ReDShield|
|Military|Military delivery|ReDShield|
|Other|Other delivery method|ReDShield, Cybersource|
|None|No delivery, as it is a service or subscription|ReDShield, Cybersource| 

## Table 6 - Customer.Gender

|Value|Description|Provider|
|:-|:-|:-|
|Male|Male|ReDShield|
|Female|Female|ReDShield|

## Table 7 - Customer.Status

|Value|Description|Provider|
|:-|:-|:-|
|New|Identifies when the customer is new to the merchant, never made a purchase|ReDShield|
|Existing|Identifies when the customer exists in the merchant, has already made a purchase|ReDShield|

## Table 8 - Airline.JourneyType

|Value|Description|Provider|
|:-|:-|:-|
|OneWayTrip|One way trip|Cybersource|
|RoundTrip|Round trip|Cybersource|

## Table 9 - Airline.Passengers[n].PassengerType

|Value|Description|Provider|
|:-|:-|:-|
|Adult|Adult|ReDShield, Cybersource|
|Child|Child|ReDShield, Cybersource|
|Infant|Infant|ReDShield, Cybersource|
|Youth|Youth|ReDShield|
|Student|Student|ReDShield|
|SeniorCitizen|Senior|ReDShield|
|Military|Military|ReDShield|

## Table 10 - Airline.Passengers[n].Status

|Value|Provider|
|:-|:-|
|Standard|Cybersource|
|Gold|Cybersource|
|Platinum|Cybersource|

## Table 11 - CartItem[n].Risk

|Value|Description|Provider|
|:-|:-|:-|
|Low|Product associated with few chargebacks (default)|Cybersource|
|Normal|Product associated with the normal quantity of chargebacks|Cybersource|
|High|Product associated with many chargebacks|Cybersource|

## Table 12 - CartItem[n].AddressRiskVerify

|Value|Description|Provider|
|:-|:-|:-|
|Yes|Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido|Cybersource|
|No|Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)|Cybersource|
|Off|Diferenças entre os endereços de cobrança e entrega não afetam a pontuação|Cybersource|

|Yes|In case of divergence between billing and shipping addresses, it assigns low risk to the request|Cybersource|
|No|In case of divergence between billing and shipping addresses, it assigns high risk to the request (default)|Cybersource|
|Off|Differences between billing and shipping addresses do not affect punctuation|Cybersource|

## Table 13 - CartItem[n].HostHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect fraud scoring score|Cybersource|

## Table 14 - CartItem[n].NonSensicalHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect fraud scoring score|Cybersource|

## Table 15 - CartItem[n].ObscenitiesHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect fraud scoring score|Cybersource|

## Table 16 - CartItem[n].TimeHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect fraud scoring score|Cybersource|

## Table 17 - CartItem[n].PhoneHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect fraud scoring score|Cybersource|

## Table 18 - CartItem[n].VelocityHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect fraud scoring score|Cybersource|

## Table 19 - Invoice.Tender

|Value|Description|Provider|
|:-|:-|:-|
|Consumer|Personal credit card (default)|Cybersource|
|Corporate|Corporate credit card|Cybersource|
|Debit|Debit card|Cybersource|
|CollectDelivery|Delivery charges|Cybersource|
|ElectronicCheck|Electronic check|Cybersource|
|PaymentP2P|Payment from person to person|Cybersource|
|PrivateLabel|Private credit card|Cybersource|
|Other|Payments with other methods|Cybersource|

## Table 20 - Status

|Value|Description|Provider|
|:-|:-|:-|
|Accept|Transaction accepted after fraud analysis |ReDShield, Cybersource|
|Review|Transaction review after fraud analysis|ReDShield, Cybersource|
|Reject|Rejected Transaction after fraud analysis|ReDShield, Cybersource|
|Pendent|Transaction pending, when sending the same for analysis of fraud occurred a timeout in the response between Braspag and Cybersource|
|Unfinished|Transaction not finalized for some reason, contract validation or internal error <br/> A transaction analyzed in Cybersource, in the analysis response the `ProviderAnalysisResult.ProviderStatus` field is equal to **REJECT** and the `ProviderAnalysisResult.ProviderCode` other than **481**, the transaction status will be **Unfinished**|ReDShield, Cybersource|
|ProviderError|Transaction with provider error while being submitted for analysis|ReDShield, Cybersource|

## Table 21 - ProviderStatus

|Value|Description|Provider|From-To with the `Status` field (Transaction status in Antifraud Gateway Braspag)|
|:-|:-|:-|:-|
|APPROVE|Approved transaction at provider|ReDShield|Accept|
|ACCEPT|Accepted transaction at provider|ReDShield, Cybersource|Accept|
|PEND|Transactio review at provider|ReDShield|Review|
|CHALLENGE|Transaction review at provider|ReDShield|Review|
|REVIEW|Transaction review at provider|Cybersource|Review|
|CANCEL|Reject transaction at provider|ReDShield|Reject|
|DENY|Rejected transaction at provider|ReDShield|Reject|
|REJECT|Rejected transaction at provider|Cybesource|Reject|
|ENETLP|Transaction with provider error|ReDShield|ProviderError|
|ENORSP|Transaction with provider error|ReDShield|ProviderError|
|ERROR|Transaction with provider error|ReDShield, Cybersource|ProviderError|

## Table 22 - ProviderAnalysisResult.ProviderCode

|Value|Description|Provider|
|:-|:-|:-|
|100|Operation successful|Cybersource|
|101|The transaction sent for fraud analysis is missing one or more required fields <br/> Check in the response the `ProviderAnalysisResult.Missing` field <br/> Possible action: Resend the transaction with the complete information|Cybersource|
|102|The transaction sent for fraud analysis has one or more fields with invalid values <br/> Check in the response the `ProviderAnalysisResult.Invalid` field <br/> Possible action: Resend the transaction with the correct information|Cybersource|
|150|Internal error <br/> Possible action: Wait a few minutes and try to resend the transaction|Cybersource|
|151|The transaction was received, but time-out occurred on the server. This error does not include time-out between client and server <br/> Possible action: Wait a few minutes and try to resend the transaction|Cybersource|
|152|The request was received, but has occurred time-out <br/> Possible action: Wait a few minutes and try to resend the transaction|Cybersource|
|202|Transaction declined because card expired or expiration date does not match correct <br/> Possible action: Request another card or other payment method|Cybersource|
|231|Transaction declined because card is invalid <br/> Possible action: Request another card or other payment method|Cybersource|
|234|Trouble with store setup in Cybersource <br/> Possible action: Contact support to fix the configuration problem|Cybersource|
|400|Fraud score exceeds your limit <br> Possible action: Review the customer transaction|Cybersource|
|480|The transaction was marked as review by the DM (Decision Manager)|Cybersource|
|481|The transaction was rejected by the DM (Decision Manager)|Cybersource|

## Table 23 - ProviderAnalysisResult.AfsReply.AddressInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|COR-BA|The billing address has corrected elements or can be normalized|Cybersource|
|COR-SA|The shipping address has corrected elements or can be normalized|Cybersource|
|INTL-BA|The billing country is outside of the U.S.|Cybersource|
|INTL-SA|The shipping country is outside of the U.S.|Cybersource|
|MIL-USA|The address is a U.S. military address|Cybersource|
|MM-A|The billing and shipping addresses use different street addresses|Cybersource|
|MM-BIN|The card BIN (the first six digits of the number) does not match the country|Cybersource|
|MM-C|The billing and shipping addresses use different cities|Cybersource|
|MM-CO|The billing and shipping addresses use different countries|Cybersource|
|MM-ST|The billing and shipping addresses use different states|Cybersource|
|MM-Z|The billing and shipping addresses use different postal codes|Cybersource|
|UNV-ADDR|The address is unverifiable|Cybersource|

## Table 24 - ProviderAnalysisResult.AfsReply.AfsFactorCode

|Value|Description|Provider|
|:-|:-|:-|
|A|Excessive address change. The customer changed the billing address two or more times in the last six months|Cybersource|
|B|Card BIN or authorization risk. Risk factors are related to credit card BIN and/or card authorization checks|Cybersource|
|C|High number of account numbers. The customer used more than six credit cards numbers in the last six months|Cybersource|
|D|Email address impact. The customer uses a free email provider, or the email address is risky|Cybersource|
|E|Positive list. The customer is on your positive list|Cybersource|
|F|Negative list. The account number, street address, email address, or IP address for this order appears on your negative list|Cybersource|
|G|Geolocation inconsistencies. The customer’s email domain, phone number, billing address, shipping address, or IP address is suspicious|Cybersource|
|H|Excessive name changes. The customer changed the name two or more times in the last six months|Cybersource|
|I|Internet inconsistencies. The IP address and email domain are not consistent with the billing address|Cybersource|
|N|Nonsensical input. The customer name and address fields contain meaningless words or language|Cybersource|
|O|Obscenities. The customer’s input contains obscene words|Cybersource|
|P|Identity morphing. Multiple values of an identity element are linked to a value of a different identity element. For example, multiple phone numbers are linked to a single account number|Cybersource|
|Q|Phone inconsistencies. The customer’s phone number is suspicious|Cybersource|
|R|Risky order. The transaction, customer, and merchant information show multiple high-risk correlations|Cybersource|
|T|Time hedge. The customer is attempting a purchase outside of the expected hours|Cybersource|
|U|Unverifiable address. The billing or shipping address cannot be verified|Cybersource|
|V|Velocity. The account number was used many times in the past 15 minutes|Cybersource|
|W|Marked as suspect. The billing or shipping address is similar to an address previously marked as suspect|Cybersource|
|Y|Gift Order. The street address, city, state, or country of the billing and shipping addresses do not correlate|Cybersource|
|Z|Invalid value. Because the request contains an unexpected value, a default value was substituted. Although the transaction can still be processed, examine the request carefully for abnormalities in the order|Cybersource|

## Table 25 - ProviderAnalysisResult.AfsReply.CardAccountType

|Value|Description|Provider|
|:-|:-|:-|
|CN|Private card|Cybersource|
|CP|Corporate card|Cybersource|

## Table 26 - ProviderAnalysisResult.AfsReply.HotListInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|CON-POSNEG|The order triggered both a positive and negative list match. The result of the positive list match overrides that of the negative list match|Cybersource|
|NEG-BA|The billing address is on the negative list|Cybersource|
|NEG-BCO|The billing country is on the negative list|Cybersource|
|NEG-BIN|The credit card BIN (the first six digits of the number) is on the negative list|Cybersource|
|NEG-BINCO|The country in which the credit card was issued is on the negative list|Cybersource|
|NEG-BZC|The billing postal code is on the negative list|Cybersource|
|NEG-CC|The credit card number is on the negative list|Cybersource|
|NEG-EM|The email address is on the negative list|Cybersource|
|NEG-EMCO|The country in which the email address is located is on the negative list|Cybersource|
|NEG-EMDOM|The email domain (for example, mail.example.com) is on the negative list|Cybersource|
|NEG-FP|O device fingerprint está na lista negativa|Cybersource|
|NEG-HIST|A transaction was found on the negative list|Cybersource|
|NEG-ID|The customer’s account ID is on the negative list|Cybersource|
|NEG-IP|The IP address (for example, 10.1.27.63) is on the negative list|Cybersource|
|NEG-IP3|The network IP address (for example, 10.1.27) is on the negative list. A network IP address includes up to 256 IP addresses|Cybersource|
|NEG-IPCO|The country in which the IP address is located is on the negative list|Cybersource|
|NEG-PEM|A passenger’s email address is on the negative list|Cybersource|
|NEG-PH|The phone number is on the negative list|Cybersource|
|NEG-PID|A passenger’s account ID is on the negative list|Cybersource|
|NEG-PPH|A passenger’s phone number is on the negative list|Cybersource|
|NEG-SA|The shipping address is on the negative list|Cybersource|
|NEG-SCO|The shipping country is on the negative list|Cybersource|
|NEG-SZC|The shipping postal code is on the negative list|Cybersource|
|POS-TEMP|The customer is on the temporary positive list|Cybersource|
|POS-PERM|The customer is on the permanent positive list|Cybersource|
|REV-BA|The billing address is on the review list|Cybersource|
|REV-BCO|The billing country is on the review list|Cybersource|
|REV-BIN|The credit card BIN (the first six digits of the number) is on the review list|Cybersource|
|REV-BINCO|The country in which the credit card was issued is on the review list|Cybersource|
|REV-BZC|The billing postal code is on the review list|Cybersource|
|REV-CC|The credit card number is on the review list|Cybersource|
|REV-EM|The email address is on the review list|Cybersource|
|REV-EMCO|The country in which the email address is located is on the review list|Cybersource|
|REV-EMDOM|The email domain (for example, mail.example.com) is on the review list|Cybersource|
|REV-FP|O device fingerprint está na lista de revisão|Cybersource|
|REV-ID|The customer’s document (CPF ou CNPJ) is on the review list|Cybersource|
|REV-IP|The IP address (for example, 10.1.27.63) is on the review list|Cybersource|
|REV-IP3|The network IP address (for example, 10.1.27) is on the review list. A network IP address includes up to 256 IP addresses|Cybersource|
|REV-IPCO|The country in which the IP address is located is on the review list|Cybersource|
|REV-PEM|A passenger’s email address is on the review list|Cybersource|
|REV-PH|The phone number is on the review list|Cybersource|
|REV-PID|A passenger’s account ID is on the review list|Cybersource|
|REV-PPH|A passenger’s phone number is on the review list|Cybersource|
|REV-SA|The shipping address is on the review list|Cybersource|
|REV-SCO|The shipping country is on the review list|Cybersource|
|REV-SZC|The shipping postal code is on the review list|Cybersource|

## Table 27 - ProviderAnalysisResult.AfsReply.IdentityInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|MORPH-B|The same billing address has been used several times with multiple customer identities|Cybersource|
|MORPH-C|The same card number has been used several times with multiple customer identities|Cybersource|
|MORPH-E|The same email address has been used several times with multiple customer identities|Cybersource|
|MORPH-I|The same IP address has been used several times with multiple customer identities|Cybersource|
|MORPH-P|The same phone number has been used several times with multiple customer identities|Cybersource|
|MORPH-S|The same shipping address has been used several times with multiple customer identities|Cybersource|

## Table 28 - ProviderAnalysisResult.AfsReply.InternetInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|FREE-EM|O endereço de Customer email é de um provedor de e-mail gratuito|Cybersource|
|INTL-IPCO|O país do endereço de Customer email está fora dos EUA|Cybersource|
|INV-EM|O endereço de Customer email é inválido|Cybersource|
|MM-EMBCO|O domínio do endereço de Customer email não é consistente com o país do endereço de cobrança|Cybersource|
|MM-IPBC|O endereço de Customer email não é consistente com a Billing address city|Cybersource|
|MM-IPBCO|O endereço de Customer email não é consistente com o país do endereço de cobrança|Cybersource|
|MM-IPBST|O endereço IP do comprador não é consistente com o estado no endereço de cobrança. No entanto, este código de informação não pode ser devolvido quando a inconsistência é entre estados imediatamente  adjacentes|Cybersource|
|MM-IPEM|O endereço de Customer email não é consistente com o endereço IP|Cybersource|
|RISK-EM|O domínio do Customer email (por exemplo, mail.example.com) está associado com alto risco|Cybersource|
|UNV-NID|O endereço IP do comprador é de um proxy anônimo. Estas entidades escondem completamente informações sobre o endereço de IP|Cybersource|
|UNV-RI400SK|O endereço IP é de origem de risco|Cybersource|
|UNV-EMBCO|O país do endereço de e-mail não corresponde ao país do endereço de cobrança|Cybersource|

## Table 29 - ProviderAnalysisResult.AfsReply.PhoneInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|MM-ACBST|O número de telefone do comprador não é consistente com o estado no endereço de cobrança|Cybersource|
|RISK-AC|O código de área do comprador está associado com risco alto|Cybersource|
|RISK-PH|O número de telefone dos EUA. ou do Canadá é incompleto, ou uma ou mais partes do número são arriscadas|Cybersource|
|TF-AC|O número do telefone utiliza um código de área toll-free (grátis)|Cybersource|
|UNV-AC|O código de área é inválido|Cybersource|
|UNV-OC|O código de área e/ou o prefixo de telefone são/é inválido|Cybersource|
|UNV-PH|O número do telefone é inválido|Cybersource|

## Table 30 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|BAD-FP|O dispositivo é arriscado|Cybersource|
|INTL-BIN|O cartão de crédito foi emitido fora dos EUA|Cybersource|
|MM-TZTLO|Fuso horário do dispositivo é incompatível com os fusos horários do país|Cybersource|
|MUL-EM|O comprador tem usado mais de quatro endereços de e-mail diferentes|Cybersource|
|NON-BC|A Billing address city é sem sentido|Cybersource|
|NON-FN|O Customer first name é sem sentido|Cybersource|
|NON-LN|O Customer last name é sem sentido|Cybersource|
|OBS-BC|A Billing address city contem obscenidades|Cybersource|
|OBS-EM|O endereço de e-mail contem obscenidades|Cybersource|
|RISK-AVS|O resultado do combinado do teste AVS e endereço de cobrança normalizado são arriscados, o resultado AVS indica uma correspondência exata, mas o endereço de cobrança não é entregável|Cybersource|
|RISK-BC|A Billing address city possui caracteres repetidos|Cybersource|
|RISK-BIN|No passado, este BIN do cartão de crédito (os seis primeiros dígitos do número do cartão) mostrou uma elevada incidência de fraude|Cybersource|
|RISK-DEV|Algumas das características do dispositivo são arriscadas|Cybersource|
|RISK-FN|Nome e Customer last name contêm combinações de letras improváveis|Cybersource|
|RISK-LN|Nome do meio ou Customer last name contêm combinações de letras improváveis|Cybersource|
|RISK-PIP|O endereço IP do proxy é arriscado|Cybersource|
|RISK-SD|A inconsistência nos países dos endereços cobrança e entrega é arriscada|Cybersource|
|RISK-TB|O dia e a hora da ordem associada ao endereço de cobrança é arriscado|Cybersource|
|RISK-TIP|O verdadeiro endereço IP é arriscado|Cybersource|
|RISK-TS|O dia e a hora da ordem associada ao endereço de entrega é arriscado|Cybersource|

## Table 31 - ProviderAnalysisResult.AfsReply.VelocityInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|VEL-ADDR|Diferente estados dos endereços de cobrança e/ou entrega (EUA e Canadá apenas) têm sido usadas várias vezes com o Credit card number e/ou endereço de email|Cybersource|
|VEL-CC|Diferentes números de cartões de créditos foram usados várias vezes com o mesmo nome ou endereço de email|Cybersource|
|VEL-NAME|Diferentes nomes foram usados várias vezes com o mesmo Credit card number e/ou endereço de email|Cybersource|
|VELS-CC|O Credit card number tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-CC|O Credit card number tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-CC|O Credit card number tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-CC|O Credit card number tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-TIP|O endereço IP verdadeiro tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-TIP|O endereço IP verdadeiro tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-TIP|O endereço IP verdadeiro tem sido utilizado várias vezes durante um intervalo longo|Cybersource|

## Table 32 - ProviderAnalysisResult.AfsReply.IpRoutingMethod

|Value|Description|Provider|
|:-|:-|:-|
|Anonymizer|Endereços de IP estão escondidos porque o comprador é extremamente cauteloso, quer privacidade absoluta ou é fraudulento|Cybersource|
|AOL, AOL dialup, AOL POP and AOL proxy|Membros da AOL. Na maioria dos casos, o país pode ser identificado, mas o estado e cidade não podem|Cybersource|
|Cache proxy|Proxy usado através de um acelerador da Internet ou de uma distribuição de conteúdo de serviço. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|Cybersource|
|Fixed|O endereço de IP está próximo ou no mesmo local que o comprador|Cybersource|
|International proxy|Proxy que contém tráfego de vários países. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|Cybersource|
|Mobile gateway|Gateway para conectar dispositivos móveis à internet. Muitas operadoras, especialmente na Europa, atendem mais do que um país e tráfego ocorre através de hubs de rede centralizados. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|Cybersource|
|POP|Discagem do comprador em um ISP regional provavelmente perto da localização do endereço de IP, mas possivelmente através de limites geográficos|Cybersource|
|Regional proxy|Proxy que contém tráfego de vários estados dentro de um único país. O comprador pode estar localizado em um estado diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|Cybersource|
|Satellite|Conexões por satélite. Se o uplink e o downlink estiverem cadastrados, o método roteamento é considerado padrão porque o remetente é conhecido. No entanto, se o downlink não está registrado, o comprador pode estar em qualquer lugar dentro do feixe padrão do satélite, que pode abranger um continente ou mais|Cybersource|
|SuperPOP|O comprador está discando em um ISP multi-estatal ou multinacional que provavelmente não é provável a localização do endereço de IP. O comprador pode estar discando através de limites geográficos|Cybersource|
|No value returned|O tipo de roteamento é desconhecido|Cybersource|

## Table 33 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision

|Value|Provider|
|:-|:-|
|ACCEPT|Cybersource|
|ERROR|Cybersource|
|REJECT|Cybersource|
|REVIEW|Cybersource|

## Table 34 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation

|Value|Description|Provider|
|:-|:-|:-|
|T|A regra é verdadeira|Cybersource|
|F|A regra é falsa|Cybersource|
|N|A regra não pode ser avaliada porque os dados são insuficientes|Cybersource|
|E|A regra não pode ser avaliada porque ocorreu um erro|Cybersource|

## Table 36 - MerchantDefinedData (ReDShield)

|Key|Value|Type|Tamanho|
|:-|:-|:-|:-|
|1 a 3|Reservado|-|-|
|4 a 8|Campos livres e definidos junto ao provedor de antifraude, conforme as regras de negócio|var|256|
|9 a 13|Reservado|-|-|
|14|Segment|MCC (Merchant Category Code) da sua loja|int|-|
|15 a 20|Campos livres e definidos junto ao provedor de antifraude, conforme as regras de negócio|var|30|
|21|Reservado|-|-|
|22|Campo livre e definido junto ao provedor de antifraude, conforme as regras de negócio|var|30|
|23|Reservado|-|-|
|24|Campo livre e definido junto ao provedor de antifraude, conforme a regras de negócio|var|30|
|25|Reservado|-|-|

## Table 37 - MerchantDefinedData (Cybersource)

|Key|Value|Type|
|:-|:-|:-|
|1|Cliente efetuou Login <br/> Se o cliente final logou no site para comprar, enviar: o login dele <br/> Se fez compra como visitante, enviar: Guest <br/> Se a venda foi feita direto por um terceiro, um agente por exemplo, não enviar o campo|string|
|2|Quantidade em dias que o cliente é seu cliente|int|
|3|Quantidade de parcelas do pedido|int|
|4|Canal de Venda <br/> Possíveis valores: <br/> Call Center -> compra pelo telefone <br/> Web -> compra pela web <br/> Portal -> um agente fazendo a compra para o cliente <br/> Quiosque -> compras em quiosques <br/> Movel -> compras feitas em celulares ou tablets|string|
|5|Enviar o código do cupom/desconto caso o cliente utilize na compra|string|
|6|Data da última compra realizada pelo cliente <br/> Formato: MM-DD-AAAA - Ex.: 12-15-2017|date|
|7|Código ou nome do seller (vendedor)|string|
|8|Tentativas realizada pelo cliente de efetuar o pagamento do mesmo pedido, podendo ser com diferentes cartões de créditos e/ou através de outros meios de pagamentos|int|
|9|Identifica se cliente irá retirar o produto na loja <br/> Possíveis valores: SIM ou NAO|string|
|10|Identifica se o pagamento será realizado por outra pessoa que não esteja presente na viagem ou pacote <br/> Possíveis valores: SIM ou NAO|string|
|11|Categoria do hotel (quantas estrelas) <br/> Possíveis valores: <br/> 1 -> Simples <br/> 2 -> Econômico <br> 3 -> Turismo <br/> 4 -> Superior <br/> 5 -> Luxo|int|
|12|Data de checkin no hotel <br/> Formato: MM-DD-AAAA - Ex.: 12-05-2018|date|
|12|Data de checkout no hotel <br/> Formato: MM-DD-AAAA - Ex.: 19-05-2018|date|
|14|Categoria da viagem ou pacote <br> Possíveis valores: Nacional ou Internacional ou Nacional/Internacional|string|
|15|Nome da companhia aérea / locadora de carro / hotel <br/> Enviar o nome de cada uma das empresas, separado por /|string|
|16|Código PNR da reserva <br/> Quando houver uma alteração da reserva para este PNR, com antecipação da data de voo, é importante fazer uma nova análise de fraude enviando este PNR novamente|string|
|17|Identifica se houve antecipação de reserva <br/> Possíveis valores: SIM ou NAO <br/> Se sim, fundamental o envio também do campo 16 - Código PNR da reserva|string
|18-25|Reservados para novos campos de turismo|-|
|26|Bin (6 primeiros dígitos) do cartão de crédito|string|
|27-30|Reservados para campos interno|-|
|31|Quantidade de trocas de números de cartão de crédito que o cliente efetuou para realizar o pagamento do pedido|int|
|32|Identifica se o e-mail foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|
|33|Identifica se o Credit card number foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|
|34|Identifica se o e-mail foi confirmado para ativação de conta <br/> Possível valor: SIM <br/> Caso não tenha sido confirmado ou não exista um processo de ativação de conta com confiração de e-mail, não enviar o campo|string|
|35|Identifica o tipo de cliente <br/> Pssíveis valores: Local ou Turista <br/> Caso não possua esta informação, não enviar o campo|string|
|36|Identifica se foi utilizado cartão presente (GiftCard) na compra <br/> Possíveis valor: SIM <br/> Caso não tenho sido utilizado cartão presente na compra, não enviar o campo|string|
|37|Meio de envio do pedido <br/> Possíveis valores: Sedex ou Sedex 10 ou 1 Dia ou 2 Dias ou Motoboy ou Mesmo Dia <br/> Caso não tenha meio de envio, não enviar o campo|string|
|38|Número do telefone do cliente identificado através da bina quando venda realizada através do canal de venda igual a Call Center <br/> Formato: DDDNúmero - Ex.: 2121114720|string|
|39 a 40|Reservados|-|
|41 a 95|Campos livres e definidos junto ao provedor de antifraude, conforme as regras de negócio|-|
|96 a 100|Reservados|-|