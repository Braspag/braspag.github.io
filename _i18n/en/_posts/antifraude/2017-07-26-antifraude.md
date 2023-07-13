---
layout: manual
title: Antifraude Integration Guide
description: Technical Integration API Antifraude Gateway Braspag
search: true
translated: true
categories: manual
sort_order: 1
tags:
    - 3. Risk Management
language_tabs:
  json: JSON
  shell: cURL
  html: HTML 
---

# About this documentation 

This manual presents the API Antifraude Gateway Braspag integration for **separated fraud analysis calls**. For joint call integration with other services, see the service manual of interest: [Pagador](https://braspag.github.io//en/manual/braspag-pagador){:target="_blank"}, [API Cielo E-commerce](https://braspag.github.io//manual/api-ecommerce-cielo-af){:target="_blank"}, [Split Cielo E-commerce](https://braspag.github.io//en/manual/split-de-pagamentos-cielo-e-commerce){:target="_blank"} or [Split Pagador](https://braspag.github.io//manual/split-de-pagamentos-pagador#antifraude){:target="_blank"}.

# Overview

Braspag's **Antifraude Gateway** is an API REST that offers risk management for your e-commerce with the analysis from the best anti-fraud providers in the world.

## Why have a fraud analysis?

* Get the best conversion by controlling the chargeback rate;
* Identify fraudulent transactions;
* Increase security by analyzing Antifraude's transaction history;
* Avoid brand fines for increasing the chargeback frequency.

## Benefits of the Antifraude Gateway

The Braspag Antifraude Gateway facilitates the fraud analysis process in your e-commerce, allowing you to:

* Access to the best anti-fraud providers on the market, without the burden of direct integration;
* Simplified integration;
* Readiness: the main e-commerce platforms are already integrated with Braspag.

## Antifraud providers

Anti-fraud providers offer neural network-based tools, non-relational databases, recommendations based on transaction history, behavior and repetitions by time interval, among other functions that make up the fraud analysis model.

When contracting the Antifraude Gateway, you choose which provider(s) you want to analyze your transactions with and which plan.

### Cybersource

Cybersource is a Visa group company, that has been operating fraud management since 1994.

Learn more about Cybersource's plans in the table below.

| PLANS | DESCRIPTION |
|---|---|
| Hierarchy | Risk models standardized by the e-commerce industry.|
| Advanced | Allows proposals for improvements in risk rules and monthly consulting with Cybersource and Braspag. |
| Enterprise | It has a dedicated CyberSource risk analyst, who will proactively propose adjustments to the business ruleset in order to improve conversion and reduce chargeback rates.|

### ACI Worldwide

ACI Worlwide, founded in 1975, is a global mission-critical software company providing fraud control and prevention solutions as well as real-time payment processing and management for corporations.

In this manual, refer to the requirements and [attached tables corresponding to your anti-fraud provider](https://braspag.github.io//en/manual/antifraude#tables).

# Fraud Analysis Flows

The Antifraude Gateway forwards transaction data to an anti-fraud provider for analysis. The providers use technologies such as machine identification, IP geolocation, social network analysis, proxy detection and replay counters. Braspag receives a recommendation from the provider in real time and can then take action based on the risk of fraud identified by the analysis.
There are two possible flows for fraud analysis:

* **AnalyseFirst:** all transactions are first submitted to Antifraude for analysis and, if accepted, proceed to the acquirer's authorization process. 
* **AuthorizeFirst:** all transactions are first submitted for authorization by the acquirer and, if authorized, are sent for analysis by Antifraude.

![Fluxos AnalyseFirst e AuthorizeFirst]({{ site.baseurl_root }}/images/braspag/af/fluxo-analysefirst-authorizefirst-en.png)

*Review status is returned only if included in your plan.

## AnalyseFirst

1. The merchant requests a fraud analysis from Antifraude;
2. Antifraude returns the status Accept, Reject or Review;
3. The merchant sends the transaction request to the payment gateway;
4. The payment gateway requests authorization from the acquirer;
5. The acquirer authorizes the transaction or authorizes and capture;
6. The payment gateway returns the authorization response.

## AuthorizeFirst

1. The merchant sends the transaction request to the payment gateway;
2. The payment gateway requests authorization from the acquirer;
3. The acquirer authorizes the transaction;
4. The payment gateway returns the authorization response;
5. The merchant requests a fraud analysis from Antifraude;
6. Antifraude returns the status Accept, Reject or Review.

The chosen flow must be determined during integration, because it is part of the application architecture.

If, after integration, you wish to change the fraud analysis flow, you should request Braspag's support, as there are details involved in a possible change, mainly in relation to speed rules.

## Which flow is recommended for my e-commerce?

* The choice can be made according to the rules of your business, taking into account aspects such as the average ticket and type of product sold;
* You can build your application with both flows and apply the business rules according to your risk criteria.

Below are some characteristics of each flow, which can help you decide on the best model for your business:

**AnalyzeFirst**

* Antifraud will be able to see e-commerce credit card transactions;
* Avoids early awareness of the credit card limit, avoiding attrition/bad consumer experience;
* Favors the learning of the Antifraude engine;
* There is an analysis cost when the credit card used in the transaction does not have an available limit.

**AuthorizeFirst**

* Avoids the cost of analysis on credit card transactions that have no available limit;
* Antifraude will not be able to see e-commerce credit card transactions.

# Environments

## Sandbox

|Environment|Base URL|Description|
|:-|:-|:-|
|**Braspag OAUTH2 Server**|https://authsandbox.braspag.com.br/ | Authentication.|
|**API Risk**|https://risksandbox.braspag.com.br/ | Fraud analysis, query, associate transaction and status update.|

## Production

|Environment|Base URL|Description|
|:-|:-|:-|
|**Braspag OAUTH2 Server**|https://auth.braspag.com.br/ | Authentication|
|**API Risk**|https://risk.braspag.com.br/ | Fraud analysis, query, associate transaction and status update. |

# Authentication

The API Antifraude Gateway Braspag uses the OAuth 2.0 market standard protocol to authorize access to its specific resources by environment, **Sandbox** and **Production**.

## Obtaining access token

During onboarding, you will be given the `ClientId` and `ClientSecret` credentials. If you have not received the credentials, ask [Braspag Support](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}.

**1.** Concatenate the credentials in the `ClientId:ClientSecret` form;<br/>
**2.** Convert the result to base64, generating a string;

> **Example:**<br/>
> * client_id: **braspagtestes**<br/>
> * client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * String to encode in Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * Result after coding: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**<br/>

**3.** Send the base64 string in the Authentication request (POST);<br/>
**4.** The Authentication API will validate the string and return the `access_token`.

The returned token (`access_token`) must be used in every request to the Antifraude Gateway API as an authorization key. The `access_token` has a validity of 20 minutes and it is necessary to generate a new one every time the validity expires.

See the image for the authentication flow and the sending of the `access_token` in the fraud analysis request.

![Fluxo de Autenticação]({{ site.baseurl_root }}/images/braspag/af/af-autenticacao-bpauth-en.png)

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

**Parameters on the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parameters on the body**

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

**Parameters on the body**

|Parameter|Description|
|:-|:-|
|`access_token`|Requested access token.|
|`token_type`|Indicates the value of the type of token.|
|`expires_in`|Access token expiration, in seconds. <br/>After it expires, you need to get a new one.|

# Integrating with Cybersource

Below is an example of a fraud analysis request with Cybersource.

> Attention: You should only send the `BraspagTransactionId` field if your flow is `AuthorizeFirst` and you are using Pagador Braspag. The `BraspagTransactionId` field is the identifier of the transaction in Pagador. Learn more at [Pagador documentation](https://braspag.github.io//en/manual/braspag-pagador){:target="_blank"}.

## Analyzing a transaction at Cybersource

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "Cybersource",
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
    "BrowserFingerprint":"123456789"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "Category": "EletronicGood"
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
      "Category": "EletronicGood"
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

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parameters in the body**

|Parameter|Description|Type|Required|Size|
|:-|:-|:-:|:-:|-:|
|`MerchantOrderId`|Order number.|string|Yes|100|
|`TotalOrderAmount`|Total order amount in cents. <br/> Example: 123456 = R$ 1.234,56|long|Yes|-|
|`TransactionAmount`|Financial transaction amount in cents. <br/> Example: 150000 = R$ 1.500,00|long|Yes|-|
|`Currency`|Currency code. More information in [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html){:target="_blank"}|string|Yes|3|
|`Provider`|Antifraud provider.<br/> [Table 1 - Provider](https://braspag.github.io//en/manual/antifraude#table-1-provider)|enum|-|-|
|`BraspagTransactionId`|Transaction ID on Braspag Pagador. Note: You can send this field if your fraud analysis flow is AuthorizeFirst, in which authorization happens first. If you do not have an integration with Pagador Braspag, you can send the fields `Tdi`, `Nsu`, `AuthorizationCode` and `SaleDate` instead of the field `BraspagTransactionId`.|guid|No|-|
|`Tid`|Acquirer transaction id <br/> Note: You can send this field if your fraud analysis flow is AuthorizeFirst, in which authorization happens first. If you do not have integration with Pagador Braspag, you have the option of sending the `Tid` accompanied by the fields `Nsu`, `AuthorizationCode` and `SaleDate` instead of the field `BraspagTransactionId`.|string|No|20|
|`Nsu`|Unique sequence number of the acquirer transaction <br/> Note: You can send this field if your fraud analysis flow is AuthorizeFirst, in which the authorization happens first. If you do not have an integration with Pagador Braspag, you have the option of sending the `Nsu` accompanied by the fields `Tid`, `AuthorizationCode` and `SaleDate` instead of the field `BraspagTransactionId`.|string|No|10|
|`AuthorizationCode`|Acquirer transaction authorization code <br/> Note: You can send this field if your fraud analysis flow is AuthorizeFirst, in which authorization happens first. If you do not have an integration with Pagador Braspag, you have the option of sending the `AuthorizationCode`, accompanied by the fields `Tid`, `Nsu` and `SaleDate` instead of the field `BraspagTransactionId`|string|No|10|
|`SaleDate`|Transaction authorization date at acquirer <br/> Note: You can send this field if your fraud analysis flow is AuthorizeFirst, in which authorization happens first. If you do not have an integration with Pagador Braspag, you have the option of sending this field, accompanied by the fields `Tid`, `Nsu` and `AuthorizationCode` instead of the field `BraspagTransactionId`|datetime|No|-|
|`Card.Number`|Credit card number.|string|Yes|19|
|`Card.Holder`|Cardholder name printed on credit card.|string|Yes|50|
|`Card.ExpirationDate`|Credit card expiration date. <br/> Eg: 01/2023|string|Yes|7|
|`Card.Brand`|Credit card brand. <br/> [Table 3 - Card.Brand](https://braspag.github.io//en/manual/antifraude#table-3-card.brand)|enum|Yes|-|
|`Card.Save`|Indicates whether credit card data will be stored in Cartão Protegido.|bool|No|-|
|`Card.Token`|Credit card identifier saved in Cartão Protegido.|guid|No|-|
|`Card.Alias`|*Alias* (nickname) of the credit card saved in Cartão Protegido|string|No|64|
|`Billing.Street`|Billing address.|string|Yes|54|
|`Billing.Number`|Billing address number.|string|Yes|5|
|`Billing.Complement`|Billing address complement.|string|No|14|
|`Billing.Neighborhood`|Billing address neighborhood.|string|Yes|45|
|`Billing.City`|Billing address city.|string|Yes|50|
|`Billing.State`|Billing address state.|string|Yes|2|
|`Billing.Country`|Billing address country. More information at [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|Yes|2|
|`Billing.ZipCode`|Billing address postal code.|string|Yes|9|
|`Shipping.Street`|Delivery address address.|string|No|54|
|`Shipping.Number`|Delivery address number.|string|No|5|
|`Shipping.Complement`|Delivery address complement.|string|No|14|
|`Shipping.Neighborhood`|Delivery address neighborhood.|string|No|45|
|`Shipping.City`|Delivery address city.|string|No|50|
|`Shipping.State`|Delivery address status.|string|No|2|
|`Shipping.Country`|Delivery address country. More information at[ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|No|2|
|`Shipping.ZipCode`|Delivery address postal code.|string|No|9|
|`Shipping.FirstName`|First name of person responsible to receive the product at the delivery address.|string|No|60|
|`Shipping.LastName`|Last name of the person responsible to receive the product at the delivery address.|string|No|60|
|`Shipping.Phone`|Telephone number of the person responsible for receiving the product at the delivery address. <br/> Eg.: 552121114700|string|No|15|
|`Shipping.ShippingMethod`|Order delivery method <br/> [Table 4 - ShippingMethod](https://braspag.github.io//en/manual/antifraude#table-4-shippingmethod)|enum|-|-|
|`Customer.MerchantCustomerId`|Shopper's identification document number, CPF or CNPJ|string|Yes|16|
|`Customer.FirstName`|Shopper's first name.|string|Yes|60|
|`Customer.LastName`|Shopper's last name.|string|Yes|60|
|`Customer.BirthDate`|Shopper's birth date. <br/> Eg.: 1983-10-01|date|Yes|-|
|`Customer.Email`|Shopper's email.|string|Yes|100|
|`Customer.Ip`|Shopper's IP address. IPv4 or IPv6 formats.|string|Yes|45|
|`Customer.Phone`|Shopper's phone number.<br/> Eg.: 552121114700|string|Yes|15|
|`Customer.BrowserHostName`|Host name informed by the shopper's browser and identified through the HTTP header|string|No|60|
|`Customer.BrowserCookiesAccepted`|Identifies whether the shopper's browser accepts cookies.<br/> Possible values: true / false (default)|bool|-|-|
|`Customer.BrowserEmail`|Email registered in the shopper's browser. It can differ from the registration email in the store (`Customer.Email`)|string|No|100|
|`Customer.BrowserType`|Browser name used by the shopper and identified through the HTTP header <br/> Eg.: Google Chrome, Mozilla Firefox, Safari etc.|string|No|40|
|`Customer.BrowserFingerprint`|Identifier used to cross information obtained from the shopper's device. This same identifier must be used to generate the value that will be assigned to the `session_id` field of the script that will be included on the checkout page. <br/> Note: This identifier can be any value or the order number, but it must be unique for 48 hours. <br/> Learn more at [Fingerprint with a Cybersource](https://braspag.github.io/manual/antifraude#fingerprint-com-a-cybersource)|string|Yes|88|
|`CartItem[n].ProductName`|Product's name.|string|Yes|255|
|`CartItem[n].Category`|Product category. <br/> [Table 36 - CartItem{n}.Category](https://braspag.github.io//en/manual/antifraude#table-36-cartitem[n].category)|enum|-|-|
|`CartItem[n].Risk`|Product risk level associated with the amount of chargebacks. <br/> [Table 10 - CartItem{n}.Risk](https://braspag.github.io//en/manual/antifraude#table-10-cartitem[n].risk)|enum|-|-|
|`CartItem[n].UnitPrice`|Product unit price. <br/> Eg: 10950 = R$ 109.50|long|Yes|-|
|`CartItem[n].Sku`|Product SKU (Stock Keeping Unit).|string|Yes|255|
|`CartItem[n].Quantity`|Product quantity.|int|Yes|-|
|`CartItem[n].AddressRiskVerify`|Identifies who will evaluate billing and delivery addresses for different cities, states or countries <br/> [Table 11 - CartItem{n}.AddressRiskVerify](https://braspag.github.io//en/manual/antifraude#table-11-cartitem[n].addressriskverify)|enum|-|-|
|`CartItem[n].HostHedge`|Importance level of shopper's IP and email addresses in fraud analysis. <br/> [Table 12 - CartItem{n}.HostHedge](https://braspag.github.io//en/manual/antifraude#table-12-cartitem[n].hosthedge)|enum|-|-|
|`CartItem[n].NonSensicalHedge`|Importance level of the verification of shopper's non sensical data in fraud analysis. <br/> [Table 13 - CartItem{n}.NonSensicalHedge](https://braspag.github.io//en/manual/antifraude#table-13-cartitem[n].nonsensicalhedge)|enum|-|-|
|`CartItem[n].ObscenitiesHedge`|Importance level of the verification of shopper's data containing obscenity in fraud analysis.<br/> [Table 14 - CartItem{n}.ObscenitiesHedge](https://braspag.github.io//en/manual/antifraude#table-14-cartitem[n].obscenitieshedge)|enum|-|-|
|`CartItem[n].TimeHedge`|Importance level of the time in the day that the shopper placed the order for fraud analysis. <br/> [Table 15 - CartItem{n}.TimeHedge](https://braspag.github.io//en/manual/antifraude#table-15-cartitem[n].timehedge)|enum|-|-|
|`CartItem[n].PhoneHedge`|Importance level of the verification of shopper's phone numbers in fraud analysis. <br/> [Table 16 - CartItem{n}.PhoneHedge](https://braspag.github.io//en/manual/antifraude#table-16-cartitem[n].phonehedge)|enum|-|-|
|`CartItem[n].VelocityHedge`|Importance level of shopper's buying frequency in the last 15 minutes in fraud analysis. <br/> [Table 17 - CartItem{n}.VelocityHedge](https://braspag.github.io//en/manual/antifraude#table-17-cartitem[n].velocityhedge){:target="_blank"}|enum|-|-|
|`Bank.Name`|Name of shopper's bank.|string|No|40|
|`Bank.Code`|Shopper's bank's code.|string|No|15|
|`Bank.Agency`|Shopper's bank agency.|string|No|15|
|`Bank.Address`|Shopper's bank address.|string|No|255|
|`Bank.City`|City where the shopper's bank is located.|string|No|15|
|`Bank.Country`|Country where the shopper's bank is located. <br/> More information in [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|No|2|
|`Bank.SwiftCode`|Shopper's bank unique identifier code.|string|No|30|
|`FundTransfer.AccountName`|Name linked to bank account.|string|No|30|
|`FundTransfer.AccountNumber`|Shopper's bank account number|string|No|30|
|`FundTransfer.BankCheckDigit`|Code used to validate the shopper's bank account|string|No|2|
|`FundTransfer.Iban`|Shopper's international bank account number (IBAN)|string|No|30|
|`Invoice.IsGift`|Indicates whether the order placed by the shopper is a gift.|bool|No|-|
|`Invoice.ReturnsAccepted`|Indicates whether the order placed by the shopper can be returned to the store.|bool|No|-|
|`Invoice.Tender`|Payment method used by the shopper.<br/> [Table 18 - Invoice.Tender](https://braspag.github.io//en/manual/antifraude#table-18-invoice.tender)|enum|No|-|
|`Airline.JourneyType`|Type of journey.<br/> [Table 7 - Airline.JourneyType](https://braspag.github.io//en/manual/antifraude#table-7-airline.journeytype)|enun|No|-|
|`Airline.DepartureDateTime`|Departure date and time. <br/> Eg.: 2018-03-31 19:16:38|datetime|No|-|
|`Airline.Passengers[n].FirstName`|Passenger's first name.|string|No|60|
|`Airline.Passengers[n].LastName`|Passenger's last name.|string|No|60|
|`Airline.Passengers[n].PassengerId`|Identifier of the passenger to whom the ticket was issued.|string|No|32|
|`Airline.Passengers[n].PassengerType`|Passenger type. <br/> [Table 8 - Airline.Passengers{n}.PassengerType](https://braspag.github.io//en/manual/antifraude#table-8-airline.passengers[n].passengertype)|enum|No|-|
|`Airline.Passengers[n].Phone`|Passenger's phone number. <br/> Eg.: 552121114700|string|No|15|
|`Airline.Passengers[n].Email`|Passenger's email.|string|No|255|
|`Airline.Passengers[n].Status`|Airline rating. <br/> [Table 9 - Airline.Passengers{n}.Status](https://braspag.github.io//en/manual/antifraude#table-9-airline.passengers[n].status)|enum|No|60|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Departure airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|string|No|3|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Arrival airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|string|No|3|
|`CustomConfiguration.Comments`|Comments that the store may associate with fraud analysis.|string|No|255|
|`CustomConfiguration.ScoreThreshold`|Acceptable level of risk for each product.|int|-|-|
|`MerchantDefinedData[n].Key`|Field key defined with the anti-fraud provider. <br/> [Table 34 - MerchantDefinedData(Cybersource)](https://braspag.github.io//en/manual/antifraude#table-34-merchantdefineddata-(cybersource)))|int|não|-|
|`MerchantDefinedData[n].Value`|Field value defined with the anti-fraud provider. <br/> [Tabela 34 - MerchantDefinedData(Cybersource)](https://braspag.github.io//en/manual/antifraude#table-34-merchantdefineddata-(cybersource)))|var|No|-|

### Response

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

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parameters in the body**

|Parameter|Description|Type|
|:-|:-|:-:|
|`TransactionId`|Transaction ID in the Braspag Antifraude Gateway|guid|
|`Status`|Transaction status in the Braspag Antifraude Gateway <br/> [Table 19 - Status](https://braspag.github.io//en/manual/antifraude#table-19-status)|enum|
|`ProviderAnalysisResult.ProviderTransactionId`|Transaction ID at Cybersource|string|
|`ProviderAnalysisResult.ProviderStatus`|Transaction status at Cybersource <br/> [Table 20 - ProviderStatus](https://braspag.github.io//en/manual/antifraude#table-20-providerstatus)|enum|
|`ProviderAnalysisResult.ProviderCode`|Cybersource return code <br/> [Table 21 - ProviderAnalysisResult.ProviderCode](https://braspag.github.io//en/manual/antifraude#table-21-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.ProviderRequestTransactionId`|Transaction request ID at Cybersource|string|
|`ProviderAnalysisResult.Missing`|Missing fields in the request sent to Cybersource|string|
|`ProviderAnalysisResult.Invalid`|Fields with invalid values sent to Cybersource|string|
|`ProviderAnalysisResult.AfsReply.AddressInfoCode`|Codes indicate incompatibilities between the shopper's billing and shipping addresses <br/> Codes are concatenated using the ^ character Eg: MM-A^MM-Z <br/>[Table 22 - ProviderAnalysisResult.AfsReply.AddressInfoCode](https://braspag.github.io//en/manual/antifraude#table-22-provideranalysisresult.afsreply.addressinfocode))|string|
|`ProviderAnalysisResult.AfsReply.AfsFactorCode`|Codes that affected the analysis score <br/> Codes are concatenated using the ^ character. E.g.: F^P <br/>[Table 23 - ProviderAnalysisResult.AfsReply.AfsFactorCode](https://braspag.github.io//en/manual/antifraude#table-23-provideranalysisresult.afsreply.afsfactorcode)|string|
|`ProviderAnalysisResult.AfsReply.AfsResult`|Total score calculated for the order|int|
|`ProviderAnalysisResult.AfsReply.BinCountry`|Country code of the BIN of the card used in the analysis. More information at [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|
|`ProviderAnalysisResult.AfsReply.CardAccountType`|Shopper's card type <br/>[Table 24 - ProviderAnalysisResult.AfsReply.CardAccountType]https://braspag.github.io//en/manual/antifraude#table-24-provideranalysisresult.afsreply.cardaccounttype)|string|
|`ProviderAnalysisResult.AfsReply.CardIssuer`|Name of bank or card issuer|string|
|`ProviderAnalysisResult.AfsReply.CardScheme`|Card brand|string|
|`ProviderAnalysisResult.AfsReply.ConsumerLocalTime`|Shopper's local time, calculated from date of request and billing address|string|
|`ProviderAnalysisResult.AfsReply.HostSeverity`|Shopper's email domain risk level, from 0 to 5, where 0 is undetermined risk and 5 represents the highest risk|int|
|`ProviderAnalysisResult.AfsReply.HotListInfoCode`|Codes that indicate that the shopper's data are associated in positive or negative lists <br/> The codes are concatenated using the ^ character. Eg: NEG-AFCB^NEG-CC <br/>[Table 25 - ProviderAnalysisResult.AfsReply.HotListInfoCode](https://braspag.github.io//en/manual/antifraude#table-25-provideranalysisresult.afsreply.hotlistinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IdentityInfoCode`|Codes that indicate excessive identity changes <br/> Codes are concatenated using the ^ character. Ex.: COLOR-BA^MM-BIN <br/>[Table 26 - ProviderAnalysisResult.AfsReply.IdentityInfoCode](https://braspag.github.io//en/manual/antifraude#table-26-provideranalysisresult.afsreply.identityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.InternetInfoCode`|Codes that indicate problems with the email address, IP address, or billing address <br/> Codes are concatenated using the ^ character. Eg: FREE-EM^RISK-EM <br/> [Table 27 - ProviderAnalysisResult.AfsReply.InternetInfoCode](https://braspag.github.io//en/manual/antifraude#table-27-provideranalysisresult.afsreply.internetinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IpCity`|Shopper's city name obtained from IP Address|string|
|`ProviderAnalysisResult.AfsReply.IpCountry`|Shopper's country name obtained from IP address|string|
|`ProviderAnalysisResult.AfsReply.IpRoutingMethod`|Shopper routing method obtained from IP address<br/> [Table 31 - ProviderAnalysisResult.AfsReply.IpRoutingMethod](https://braspag.github.io//en/manual/antifraude#table-31-provideranalysisresult.afsreply.iproutingmethod)|string|
|`ProviderAnalysisResult.AfsReply.IpState`|Shopper state name obtained from IP address|string|
|`ProviderAnalysisResult.AfsReply.PhoneInfoCode`|Codes that indicate a problem with the buyer's phone number <br/> Codes are concatenated using the ^ character. Eg: UNV-AC^RISK-AC <br/>[Table 28 - ProviderAnalysisResult.AfsReply.PhoneInfoCode](https://braspag.github.io//en/manual/antifraude#table-28-provideranalysisresult.afsreply.phoneinfocode)|string|
|`ProviderAnalysisResult.AfsReply.ReasonCode`|Cybersouce return code <br/> [Table 21 - ProviderAnalysisResult.ProviderCode](https://braspag.github.io//en/manual/antifraude#table-21-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.AfsReply.ScoreModelUsed`|Name of the scoring model used in the analysis. If you don't have any template defined, Cybersource's default template was used|string|
|`ProviderAnalysisResult.AfsReply.SuspiciousInfoCode`|Codes indicating that the shopper has potentially provided suspicious information <br/> The codes are concatenated using the ^ character. Eg: RISK-TB^RISK-TS<br/> [Table 29 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode](https://braspag.github.io//en/manual/antifraude#table-29-provideranalysisresult.afsreply.suspiciousinfocode)|string|
|`ProviderAnalysisResult.AfsReply.VelocityInfoCode`|Codes that indicate that the buyer has a high frequency of purchases <br/> The codes are concatenated using the ^ character. Ex.: VELV-SA^VELI-CC^VELSIP <br/> [Table 30 - ProviderAnalysisResult.AfsReply.VelocityInfoCode](https://braspag.github.io//en/manual/antifraude#table-30-provideranalysisresult.afsreply.velocityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.BrowserLanguage`|Browser language used by the buyer at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ScreenResolution`|Shopper screen resolution at time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.CookiesEnabled`|Flag identifying that the shopper's browser was enabled to store cookies temporarily at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.FlashEnabled`|Flag identifying that the shopper's browser enabled the execution of Flash content at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.Hash`|Hash generated from the data collected by the fingerprint script|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ImagesEnabled`|Flag identifying that the shopper's browser had image caching enabled at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.JavascriptEnabled`|Flag identifying that the shopper's browser had JavaScript scripts enabled at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddress`|Flag identifying that the shopper's IP is real|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCity`|Flag identifying that the shopper's IP is actually from the city it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCountry`|Flag identifying that the shopper's IP is in fact from the country it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartId`|Shopper device identifier|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartIdConfidenceLevel`|Shopper device identifier|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.DestinationQueue`|When verbose mode is enabled, name of the queue where transactions not automatically accepted are sent|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.Name`|When verbose mode is enabled, profile name is selected in analysis. If you don't have any, the default profile has been selected|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.SelectedBy`|When verbose mode is enabled, name of the rule selector that selects the rule profiles|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].RuleId`|When verbose mode is enabled, rule ID|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision`|When verbose mode is enabled, decision made by rule <br/> [Table 32 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Decision](https://braspag.github.io//en/manual/antifraude#table-32-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].decision)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation`|When verbose mode is enabled, rule evaluation <br/> [Table 33 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Evaluation](https://braspag.github.io//en/manual/antifraude#table-33-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].evaluation)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Name`|When verbose mode is enabled, rule name|string|
|`ProviderAnalysisResult.DecisionReply.CasePriority`|Sets the priority level for merchant rules or profiles. The priority level varies from 1 (highest) to 5 (lowest) and the default value is 3, and this will be assigned if you have not defined the priority of the rules or profiles. This field will only be returned if the store subscribes to Enhanced Case Management|int|
|`ProviderAnalysisResult.DecisionReply.VelocityInfoCode`|Information codes triggered by the analysis. These codes were generated when creating the rules|string|

## Querying a Cybersource transaction

To know the status of a transaction at Cybersource, we recommend that you set up the [Notification Post](https://braspag.github.io//en/manual/antifraude#notification-post) and also do the query by poll, which is presented below:

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">analysis/v2/{Id}</span></aside>

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

### Response

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
      "Category": "EletronicGood",
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
      "Category": "EletronicGood",
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

**Parameter in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body**

|Parameter|Description|Type|
|:-|:-|:-:|
|`TransactionId`|Transaction ID in the Braspag Antifraude Gateway|guid|
|`Status`|Transaction status in the Braspag Antifraude Gateway <br/> [Table 19 - Status](https://braspag.github.io//en/manual/antifraude#table-19-status)|enum|
|`ProviderAnalysisResult.ProviderTransactionId`|Transaction ID at Cybersource|string|
|`ProviderAnalysisResult.ProviderStatus`|Transaction status at Cybersource <br/> [Table 20 - ProviderStatus](https://braspag.github.io//en/manual/antifraude#table-20-providerstatus)|enum|
|`ProviderAnalysisResult.ProviderCode`|Cybersource return code <br/> [Table 21 - Provider Analysis Result.Provider Code](https://braspag.github.io//en/manual/antifraude#table-21-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.ProviderRequestTransactionId`|Transaction request ID at Cybersource|string|
|`ProviderAnalysisResult.Missing`|Missing fields in the request sent to Cybersource|string|
|`ProviderAnalysisResult.Invalid`|Fields with invalid values sent to Cybersource|string|
|`ProviderAnalysisResult.AfsReply.AddressInfoCode`|Codes indicate incompatibilities between the shopper's billing and delivery addresses <br/> The codes are concatenated using the ^ character Eg: MM-A^MM-Z <br/>[Table 22 - ProviderAnalysisResult.AfsReply.AddressInfoCode](https://braspag.github.io//en/manual/antifraude#table-22-provideranalysisresult.afsreply.addressinfocode)|string|
|`ProviderAnalysisResult.AfsReply.AfsFactorCode`|Codes that affected the analysis score <br/> Codes are concatenated using the ^ character. E.g.: F^P <br/>[Table 23 - ProviderAnalysisResult.AfsReply.AfsFactorCode](https://braspag.github.io//en/manual/antifraude#table-23-provideranalysisresult.afsreply.afsfactorcode)|string|
|`ProviderAnalysisResult.AfsReply.AfsResult`|Total score calculated for the order|int|
|`ProviderAnalysisResult.AfsReply.BinCountry`|Country code of the BIN of the card used in the analysis. More information at [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`ProviderAnalysisResult.AfsReply.CardAccountType`|Shopper's card type <br/>[Table 24 - ProviderAnalysisResult.AfsReply.CardAccountType](https://braspag.github.io//en/manual/antifraude#table-24-provideranalysisresult.afsreply.cardaccounttype)|string|
|`ProviderAnalysisResult.AfsReply.CardIssuer`|Name of bank or card issuer|string|
|`ProviderAnalysisResult.AfsReply.CardScheme`|Card brand|string|
|`ProviderAnalysisResult.AfsReply.ConsumerLocalTime`|Shopper's local time, calculated from date of request and billing address|string|
|`ProviderAnalysisResult.AfsReply.HostSeverity`|Shopper's email domain risk level, from 0 to 5, where 0 is undetermined risk and 5 represents the highest risk|int|
|`ProviderAnalysisResult.AfsReply.HotListInfoCode`|Codes that indicate that the shopper's data are associated in positive or negative lists <br/> The codes are concatenated using the ^ character. Eg: NEG-AFCB^NEG-CC <br/>[Table 25 - ProviderAnalysisResult.AfsReply.HotListInfoCode]https://braspag.github.io//en/manual/antifraude#table-25-provideranalysisresult.afsreply.hotlistinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IdentityInfoCode`|Codes that indicate excessive identity changes <br/> Codes are concatenated using the ^ character. Eg: COR-BA^MM-BIN <br/> [Table 26 - ProviderAnalysisResult.AfsReply.IdentityInfoCode](https://braspag.github.io//en/manual/antifraude#table-26-provideranalysisresult.afsreply.identityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.InternetInfoCode`|Codes that indicate problems with the email address, IP address, or billing address <br/> Codes are concatenated using the ^ character. Eg: COR-BA^MM-BIN <br/> [Table 27 - ProviderAnalysisResult.AfsReply.InternetInfoCode](https://braspag.github.io//en/manual/antifraude#table-27-provideranalysisresult.afsreply.internetinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IpCity`|Shopper city name obtained from IP Address|string|
|`ProviderAnalysisResult.AfsReply.IpCountry`|Shopper country name obtained from IP address|string|
|`ProviderAnalysisResult.AfsReply.IpRoutingMethod`|Shopper routing method obtained from IP address <br/> [Table 31 - ProviderAnalysisResult.AfsReply.IpRoutingMethod](https://braspag.github.io//en/manual/antifraude#table-31-provideranalysisresult.afsreply.iproutingmethod)|string|
|`ProviderAnalysisResult.AfsReply.IpState`|Nome do estado do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.PhoneInfoCode`|Códigos que indicam um problema com o número de telefone do comprador <br/> Os códigos são concatenados usando o caracter ^. Ex.: UNV-AC^RISK-AC <br/> [Tabela 28 - ProviderAnalysisResult.AfsReply.PhoneInfoCode](https://braspag.github.io//en/manual/antifraude#table-28-provideranalysisresult.afsreply.phoneinfocode)|string|
|`ProviderAnalysisResult.AfsReply.ReasonCode`|Cybersource return code <br/> [Table 21 - Provider Analysis Result.Provider Code](https://braspag.github.io//en/manual/antifraude#table-21-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.AfsReply.ScoreModelUsed`|Name of the scoring model used in the analysis. If you don't have any template defined, Cybersource's default template was used|string|
|`ProviderAnalysisResult.AfsReply.SuspiciousInfoCode`|Codes indicating that the shopper has potentially provided suspicious information <br/> The codes are concatenated using the ^ character. Eg: RISK-TB^RISK-TS <br/> [Table 29 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode](https://braspag.github.io//en/manual/antifraude#table-29-provideranalysisresult.afsreply.suspiciousinfocode)|string|
|`ProviderAnalysisResult.AfsReply.VelocityInfoCode`|Codes that indicate that the shopper has a high frequency of purchases <br/> The codes are concatenated using the ^ character. Eg: VELV-SA^VELI-CC^VELSIP <br/> [Table 30 - ProviderAnalysisResult.AfsReply.VelocityInfoCode](https://braspag.github.io//en/manual/antifraude#table-30-provideranalysisresult.afsreply.velocityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.BrowserLanguage`|Browser language used by the shopper at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ScreenResolution`|Shopper screen resolution at time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.CookiesEnabled`|Flag identifying that the shopper's browser was enabled to store cookies temporarily at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.FlashEnabled`|Flag identifying that the shopper's browser enabled the execution of Flash content at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.Hash`|Hash generated from the data collected by the fingerprint script|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ImagesEnabled`|Flag identifying that the shopper's browser had image caching enabled at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.JavascriptEnabled`|Flag identifying that the shopper's browser had JavaScript scripts enabled at the time of purchase|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddress`|Flag identifying that the shopper's IP is real|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCity`|Flag identifying that the shopper's IP is actually from the city it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCountry`|Flag identifying that the shopper's IP is in fact from the country it should be|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartId`|Shopper device identifier|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartIdConfidenceLevel`|Shopper device identifier|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.DestinationQueue`|When verbose mode is enabled, name of the queue where transactions not automatically accepted are sent|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.Name`|When verbose mode is enabled, name of profile selected in analysis. If you don't have any, the default profile has been selected|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.SelectedBy`|When verbose mode is enabled, name of the rule selector that selects the rules profile|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].RuleId`|When verbose mode is enabled, rule Id|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision`|When verbose mode is enabled, decision taken by rule <br/> [Table 30 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Decision](https://braspag.github.io//en/manual/antifraude#table-30-provideranalysisresult.afsreply.velocityinfocode)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation`|When verbose mode is enabled, rule evaluation <br/> [Table 33 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Evaluation](https://braspag.github.io//en/manual/antifraude#table-33-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].evaluation)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Name`|When verbose mode is enabled, rule name|string|
|`ProviderAnalysisResult.DecisionReply.CasePriority`|Sets the priority level for merchant rules or profiles. The priority level varies from 1 (highest) to 5 (lowest) and the default value is 3, and this will be assigned if you have not defined the priority of the rules or profiles. This field will only be returned if the store subscribes to Enhanced Case Management|string|
|`ProviderAnalysisResult.DecisionReply.VelocityInfoCode`|Information codes triggered by the analysis. These codes were generated when creating the rules|string|
|`MerchantOrderId` |Store order number|string|
|`TotalOrderAmount`|Total order value in cents <br/> Eg: 123456 = BRL 1,234.56|long|
|`TransactionAmount`|Value of the financial transaction in cents <br/> Eg: 150000 = R$ 1,500.00|long|
|`Currency`|Currency. More information in [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html){:target="_blank"}|string|
|`Provider`|Anti-fraud solution provider <br/> [Table 1 - Provider](https://braspag.github.io//en/manual/antifraude#table-1-provider)|enum|
|`BraspagTransactionId`|Transaction ID in Braspag Pagador|guid|
|`Tid`|Transaction ID at acquirer|string|
|`Nsu`|Unique sequential number of the transaction at the acquirer <br/>|string|
|`AuthorizationCode`|Acquirer transaction authorization code <br/>|string|
|`SaleDate`|Transaction authorization date at the acquirer <br/>|datetime|
|`Card.Number`|Credit card number|string|
|`Card.Holder`|Holder name|string|
|`Card.ExpirationDate`|Credit card expiration date <br/> Ex.: 01/2023|string|
|`Card.Brand`|Credit card brand <br/> [Table 3 - Card.Brand]({{ site.baseurl_root }}en/manual/antifraude#table-3-card.brand)|enum|
|`Card.Save`|Indicates whether credit card data will be stored on the Cartão Protegido|bool|
|`Card.Token`|Credit card token saved on the Cartão Protegido|guid|
|`Card.Alias`|Credit card alias saved on the Cartão Protegido|string||
|`Billing.Street`|Billing address street|string|
|`Billing.Number`|Billing address number|string|
|`Billing.Complement`|Billing address complement|string|
|`Billing.Neighborhood`|Billing address neighborhood|string|
|`Billing.City`|Billing address city|string|
|`Billing.State`|Billing address state|string|
|`Billing.Country`|Billing address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|
|`Billing.ZipCode`|Billing address zipcode|string|
|`Shipping.Street`|Shipping address street|string|
|`Shipping.Number`|Shipping address number|string|
|`Shipping.Complement`|Shipping address complement|string|
|`Shipping.Neighborhood`|Shipping address neighborhood|string|
|`Shipping.City`|Shipping address city|string|
|`Shipping.State`|Shipping address state|string|
|`Shipping.Country`|Shipping address country. More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|
|`Shipping.ZipCode`|Shipping address zipcode|string|
|`Shipping.FirstName`|First name of person in charge of receiving product at shipping address|string|
|`Shipping.LastName`|Last name of the person in charge of receiving the product at the shipping address|string|
|`Shipping.Phone`|Telephone number of the person in charge of receiving the product at the shipping address <br/> Eg.: 552121114700|string|
|`Shipping.ShippingMethod`|Order delivery method <br/> [Table 4 - ShippingMethod]({{ site.baseurl_root }}en/manual/antifraude#table-4-shippingmethod)|enum|
|`Customer.MerchantCustomerId`|Customer document number, CPF or CNPJ|string|
|`Customer.FirstName`|Customer first name|string|
|`Customer.LastName`|Customer last name|string|
|`Customer.BirthDate`|Customer birthdate <br/> Eg.: 1983-10-01|date|
|`Customer.Email`|Customer email|string|
|`Customer.Ip`|Customer IP address|string|
|`Customer.Phone`|Customer telephone number <br/> Ex.: 552121114700|string|
|`Customer.BrowserHostName`|Host name entered by the customer's browser and identified through the HTTP header|string|
|`Customer.BrowserCookiesAccepted`|Identifies whether the customer's browser accepts cookies or not|bool|
|`Customer.BrowserEmail`|E-mail registered in the customer's browser. Can differ from merchant email (`Customer.Email`)|string|
|`Customer.BrowserType`|Name of the browser used by the customer and identified through the HTTP header|string|
|`CartItem[n].ProductName`|Product name|string|
|`CartItem[n].Category`|Product category <br/> [Table 36 - CartItem{n}.Category](https://braspag.github.io//en/manual/antifraude#table-36-cartitem[n].category)|enum|
|`CartItem[n].Risk`|Product risk level associated with the amount of chargebacks <br/> [Table 10 - CartItem{n}.Risk](https://braspag.github.io//en/manual/antifraude#table-10-cartitem[n].risk)|enum|
|`CartItem[n].UnitPrice`|Product unit price <br/> Eg: 10950 = R$ 109.50|long|
|`CartItem[n].Sku`|Product Sku|string|
|`CartItem[n].Quantity`|Product quantity|int|
|`CartItem[n].AddressRiskVerify`|Identifies that it will evaluate billing and delivery addresses for different cities, states or countries <br/> [Table 11 - CartItem{n}.AddressRiskVerify](https://braspag.github.io//en/manual/antifraude#table-11-cartitem[n].addressriskverify)|enum|
|`CartItem[n].HostHedge`|Level of importance of shopper's IP and email addresses in fraud analysis <br/> [Table 12 - CartItem{n}.HostHedge](https://braspag.github.io//en/manual/antifraude#table-12-cartitem[n].hosthedge)|enum|
|`CartItem[n].NonSensicalHedge`|Level of importance of meaningless shopper data checks in fraud analysis <br/> [Table 13 - CartItem{n}.NonSensicalHedge](https://braspag.github.io//en/manual/antifraude#table-13-cartitem[n].nonsensicalhedge)|enum|
|`CartItem[n].ObscenitiesHedge`|Importance level of obscenity shopper data checks in fraud analysis <br/> [Table 14 - CartItem{n}.ObscenitiesHedge](https://braspag.github.io//en/manual/antifraude#table-14-cartitem[n].obscenitieshedge)|enum|
|`CartItem[n].TimeHedge`|Level of importance of the time of day in the fraud analysis that the shopper placed the order <br/> [Table 15 - CartItem{n}.TimeHedge](https://braspag.github.io//en/manual/antifraude#table-15-cartitem[n].timehedge)|enum|
|`CartItem[n].PhoneHedge`|Level of importance of checks on shopper phone numbers in fraud analysis <br/> [Table 16 - CartItem{n}.PhoneHedge](https://braspag.github.io//manual/antifraude#tabela-16-cartitem[n].phonehedge)|enum|
|`CartItem[n].VelocityHedge`|Importance level of the shopper's purchase frequency in the fraud analysis within the previous 15 minutes <br/> [Table 17 - CartItem{n}.VelocityHedge](https://braspag.github.io//en/manual/antifraude#table-17-cartitem[n].velocityhedge)|enum|
|`Bank.Name`|Shopper's bank name|string|
|`Bank.Code`|Shopper's bank code|string|
|`Bank.Agency`|Shopper's bank agency|string|
|`Bank.Address`|Shopper's bank address|string|
|`Bank.City`|Shopper's bank city|string|
|`Bank.Country`|Shopper's bank city <br/> More information on [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|
|`Bank.SwiftCode`|Shopper's bank swift code|string|
|`FundTransfer.AccountName`|Name linked to bank account|string|
|`FundTransfer.AccountNumber`|Customer's bank account number|string|
|`FundTransfer.BankCheckDigit`|Code used to validate customer's bank account|string|
|`FundTransfer.Iban`|Customer's International Bank Account Number (IBAN)|string|
|`Invoice.IsGift`|Indicates whether the order placed by the customer is for gift|bool|
|`Invoice.ReturnsAccepted`|Indicates whether the order placed by the customer can be returned to the merchant|bool|
|`Invoice.Tender`|Payment method used by the customer <br/> [Table 18 - Invoice.Tender](https://braspag.github.io//en/manual/antifraude#table-18-invoice.tender)|enum|
|`Airline.JourneyType`|Journey type <br/> [Table 7 - Airline.JourneyType](https://braspag.github.io//en/manual/antifraude#table-7-airline.journeytype)|enun|
|`Airline.DepartureDateTime`|Departure datetime <br/> Ex.: 2018-03-31 19:16:38|datetime|
|`Airline.Passengers[n].FirstName`|Passenger first name|string|
|`Airline.Passengers[n].LastName`|Passenger last name|string|
|`Airline.Passengers[n].PassengerId`|Identifier of the passenger to whom the ticket was issued|string|
|`Airline.Passengers[n].PassengerType`|Passenger type <br/> [Table 9 - Airline.Passengers{n}.PassengerType](https://braspag.github.io//en/manual/antifraude#table-8-airline.passengers[n].passengertype)|enum|
|`Airline.Passengers[n].Phone`|Passenger telephone number <br/> Ex.: 552121114700|string|
|`Airline.Passengers[n].Email`|Passenger email|string|
|`Airline.Passengers[n].Status`|Airline classification <br/> [Table 10 - Airline.Passengers{n}.Status](https://braspag.github.io//en/manual/antifraude#table-9-airline.passengers[n].status)|enum|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Departure airport code. More information on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Arrival airport code. More information on [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`CustomConfiguration.Comments`|Comments that the merchant may associate fraud analysis|string|
|`CustomConfiguration.ScoreThreshold`|Acceptable level of risk for each product|int|
|`MerchantDefinedData[n].Key`|Field key set against antifraud provider <br/> [Table 37 - MerchantDefinedData(Cybersource)](https://braspag.github.io//en/manual/antifraude#table-34-merchantdefineddata-(cybersource)|int|
|`MerchantDefinedData[n].Value`|Field value set against antifraud provider <br/> [Table 37 - MerchantDefinedData(Cybersource)](https://braspag.github.io//en/manual/antifraude#table-34-merchantdefineddata-(cybersource))|var|

## Update on the Cybersource status

In case of manual review by the e-commerce itself, we recommend that the result of the review (new status) be sent to Cybersource in order to refine the fraud analysis process of your store.

Follow the example request below to change the status of transactions:

* From *Review* to *Accept* or *Reject*;
* From *Accept* to *Reject*.

### Request

To request the status update you must generate the access token (access_token) and send it in the request header.

<aside class="request"><span class="method patch">PATCH</span> <span class="endpoint">analysis/v2/{id}</span></aside>

``` json
{
    "Status": "Accept",
    "Comments": "Dados do cliente OK"
}
```

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parameters in the body**

|Parameter|Description|Type|Required|Size|
|:-|:-|:-:|:-:|-:|
|`Status`|New transaction status. Accept or Reject|string|Yes|-|
|`Comments`|Comment associated with status change|string|No|255|

### Response

* When the transaction is received for processing

``` json
{
    "Status": "Accept",
    "ChangeStatusResponse": {
        "Status": "OK",
        "Message": "Change Status request successfully received. New status: Accept."
    }
}
```

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body**

|Parameter|Description|
|:-|:-|
|`Status`|New transaction status|string|
|`ChangeStatusResponse.Status`|Identifies that Cybersource received the status change request|string|
|`ChangeStatusResponse.Message`|Message containing content of the operation performed|string|

* When the transaction is not found in the database.
<br/><br/>

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

* When the transaction is not eligible for change of status.
<br/><br/>
**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* When the new status sent is different from Accept or Reject.
<br/><br/>
**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* When the type or size of a field is not sent as specified in the manual.

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

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body**

|Parameter|Description|
|:-|:-|
|`Message`|Message informing that the request is invalid|
|`ModelState`|Collection that will contain messages with fields that do not conform to the type, domain or size as specified in the manual|

## Fingerprint with Cybersource

### What is Fingerprint?

The Fingerprint is the digital identification of the shopper's device. This identification is made up of a series of data collected on the checkout page of the website or application, such as:

* Shopper's device IP;
* Browser version;
* Operational system;
* Language and country compatibility.<br/>
<br/>

Fingerprint identifies the device used per browsing session and persists for approximately 24 hours. If the page is closed and the shopper returns to the site by opening a new page, or if you close the application and open it again, you must generate a new session and a new session ID.

The Fingerprint is important for fraud analysis because, often, only the cart data is not enough to guarantee an assertive analysis. The data collected by Fingerprint complements the analysis and increases the security of your store.

<aside class="notice">IMPORTANT: To comply with the requirements of Lei Geral de Proteção de Dados (General Data Protection Act) or LGPD, include information about data collection from the er'shopper's device in your e-commerce's cookie policy.</aside>

### Who creates Fingerprint?

For analysis via Cybersource, Fingerprint is created before the fraud analysis request by **Threatmetrix**, the company that identifies the device.

To establish communication between your checkout page and Threatmetrix and send the shopper's data, you need to insert a Fingerprint code in your e-commerce; read more about it at [How to set up Fingerprint in Cybersource?](https://braspag.github.io//en/manual/antifraude#how-to-set-up-fingerprint-in-cybersource?)

### Fingerprint Flow with Cybersource

Fingerprint creation takes place separately from the fraud analysis request.

See the representation of the Fingerprint creation flow and fraud analysis request:

![Fluxo Fingerprint Cybersource]({{ site.baseurl_root }}/images/braspag/af/fluxo-fingerprint-cybersource-en.png)
 
**Fingerprint creation step**

1. The shopper fills in the requested data on the merchant's checkout page (website or application);
2. The merchant's checkout page, already set up with the Fingerprint code, collects the shopper's data and sends it to Threatmetrix requesting the identification of the device (Fingerprint creation);
3. Threatmetrix creates the Fingerprint of the shopper's device.

**Fraud analysis step**

1. The merchant sends the fraud analysis request with the `Customer.BrowserFingerprint` field to the Antifraude Gateway;
2. The Antifraude Gateway validates the request and requests the fraud analysis to Cybersource;
3. Cybersource consults the Fingerprint in the Threatmetrix, performs the fraud analysis and sends the recommendation (Accept/Reject/Review) to the Antifraude Gateway;
4. The Antifraude Gateway returns the result of the fraud analysis to the merchant;
5. The merchant returns the transaction status (approved or not approved) to the shopper.

### Where to send the Fingerprint?

In the fraud analysis request with Cybersource, the value of the `Customer.BrowserFingerprint` field will be the `ProviderIdentifier`, which must be generated by the e-commerce.

Note that the value of this field is not the Fingerprint itself, but an indication of the Fingerprint of the transaction. This indication will be used by Cybersource to query the Fingerprint in the device identification service and thus use it to compose the fraud analysis.

### How to set up Fingerprint in Cybersource?

Fingerprint consists of implementing a script on your checkout page (front-end), in the part where the shopper fills in the registration data.

Fingerprint configuration will be different for each type of client application ([web](https://braspag.github.io//en/manual/antifraude#setting-up-fingerprint-on-cybersource-%E2%80%93-web), [Android](https://braspag.github.io//en/manual/antifraude#setting-up-fingerprint-on-cybersource-%E2%80%93-android) or [iOS](https://braspag.github.io//en/manual/antifraude#setting-up-fingerprint-on-cybersource-%E2%80%93-ios)), but the variables used are the same; see the table with Fingerprint variables.

#### Fingerprint variables

The following table presents the Fingerprint configuration variables with Threatmetrix and Cybersource.

|VARIABLE|DESCRIPTION|VALUE|FORMAT|SIZE|
|---|---|---|---|---|
|`org_id`|Indicates the environment in Threatmetrix: Sandbox or Production.|Sandbox = 1snn5n9w<br>Production = k8vif92e|String|08|
|`ProviderMerchantId`|Identifier of the merchant or operation, provided by Braspag, in the format braspag_nameofmerchant.<br>**This is different from MerchantId**. |Provided by Braspag after contracting.|String|30|
|`ProviderIdentifier`| Variable you must generate to identify the session. We recommend using a GUID. It is the value that will be sent in the `Customer.BrowserFingerprint` field.|Custom|GUID or String, in which integer, uppercase or lowercase letter, hyphen and "\_" (*underscore*) are accepted.|88|
|`session_id` (for web)| Concatenation of `ProviderMerchantId` and `ProviderIdentifier` variables.| Custom| `ProviderMerchantIdProviderIdentifier` |118|
|`MyVariable` (for mobile)|Concatenation of `ProviderMerchantId` and `ProviderIdentifier` variables.| Custom | `ProviderMerchantIdProviderIdentifier`|118|

### Setting up Fingerprint on Cybersource – Web

You will need to insert a JavaScript script in the front-end code of your checkout page.

#### 1. Fill in the Threatmetrix URL

The Threatmetrix URL will be inserted in the script and therefore must be filled in correctly.

![URL Threatmetrix]({{ site.baseurl_root }}/images/braspag/af/url-threatmetrix.png)

> The Threatmetrix URL template is **https://h.online-metrix.net/fp/tags.js?org_id=OrgId&session_id=ProviderMerchantIdProviderIdentifier**

In the URL, replace the `OrgId`, `ProviderMerchantId` and `ProviderIdentifier` values as directed in the Threatmetrix URL Variables table.

#### 2. Add the tags to the script

Insert the URL filled in step 1 into the `script` and `noscript` tags of the JavaScript template.

The JavaScript model is represented in the following image.

![Exemplo Código]({{ site.baseurl_root }}/images/braspag/af/exemplo-script-js.png)

> [Access our GitHub](https://github.com/Braspag/braspag.github.io/blob/docs/_i18n/pt/_posts/antifraude/javascript-fingerprint-cybersource.js){:target="_blank "} to view and copy the JavaScript template.

* Insert the `script` tag inside the `head` tag for correct performance:

&lt;`head`&gt;<br>
&lt;`script type="text/javascript" src="https://h.online-metrix.net/fp/tags.js?org_id=ProviderOrgId&session_id=ProviderMerchantIdProviderIdentifier"&gt;&lt;/script`&gt;<br>
&lt;`/head`&gt;

* Insert the `noscript` tag inside the `body` tag, so that the device data collection is carried out even if the browser's JavaScript is disabled. The `noscript` tag is a redundancy to collaborate with data collection.

&lt;`body`&gt;<br>
&lt;`noscript`&gt;<br>
&lt;`iframe style="width: 100px; height: 100px; border: 0; psition:absolute; top: -5000px;" src="https://h.online-metrix.net/fp/tags?org_id=ProviderOrgId&session_id=ProviderMerchantIdProviderIdentifier"`&gt;&lt;`/iframe`&gt;<br>
&lt;`/noscript`&gt;<br>
&lt;`/body`&gt;

<aside class="warning">Make sure you copy all data correctly and replace variables with their values.</aside>

#### 3. Apply the JavaScript template

Insert the Javascript with tags (step 2) into the front-end code of your checkout page.

You must put the code at checkout, in the part of filling in the registration data. Thus, the data that make up the Fingerprint will be collected while the shopper fills in the form.

> In the fraud analysis request, send only the value `ProviderIdentifier` in the `Customer.BrowserFingerprint` field.

### Setting up Fingerprint on Cybersource – Android

#### 1. Add SDK to your project

Download the [Android SDK](https://github.com/Braspag/braspag.github.io/raw/bf88c72d069e15925b13227ce653df931f275d1d/files/braspag/antifraude/ThreatMetrix%20Android%20SDK%206.0-138_.zip){:target ="_blank"}.

Then add the SDK to your project.

#### 2. Add the libraries

Add the libraries and dependencies to the project:

* TMXProfiling-6.0-138.aar 
* MXProfilingConnections-6.0-138.aar
<br/>
<br/>
Learn more about building libraries on Android in the [Android for Developers](https://developer.android.com/studio/projects/android-library){:target="_blank"} documentation.

#### 3. Include permissions

In Manifest, you must include the following permissions:

&lt;`uses-permission android:name="android.permission.INTERNET"`&gt;

&lt;`/uses-permission`&gt;

#### 4. Import the libraries

Import the following libraries:

* import com.threatmetrix.TrustDefender.TMXConfig
* import com.threatmetrix.TrustDefender.TMXEndNotifier
* import com.threatmetrix.TrustDefender.TMXProfiling
* import com.threatmetrix.TrustDefender.TMXProfilingHandle
* import com.threatmetrix.TrustDefender.TMXProfilingOptions

#### 5. Parameterize the SDK

You must parameterize the SDK with the following parameters:

`TMXConfig config = new TMXConfig()`

`.setOrgId("OrgId")`
<br/>
<br/>
In the **“OrgId”** field, indicate the value corresponding to the environment in the Threatmetrix:

* Sandbox: “1snn5n9w”;
* Production: “k8vif92e”.

`.setFPServer("h.online-metrix.net")`

`.setContext(getApplicationContext());`

`.setTimeout(20, TimeUnit.SECONDS)`

`TMXProfiling.getInstance().init(config);`

#### 6. Create the session id variable

The `ProviderMerchantId` value must be concatenated with the `ProviderIdentifier` variable (defined by your e-commerce) to create the session identification (`MyVariable`).

`MyVariable` = `ProviderMerchantId` + `ProviderIdentifier`

**Example:**

`MyVariable` = `braspag_XXXX` + `ProviderIdentifier`
<br/>
<br/>
> In the fraud analysis request, send only the value `ProviderIdentifier` in the `Customer.BrowserFingerprint` field. If the `ProviderIdentifier` generated by your e-commerce is "202201080949", in the field `Customer.BrowserFingerprint` send the value "202201080949".

<aside class="notice">We recommend that the `ProviderIdentifier` variable be a GUID.</aside>

#### 7. Implement Profiling

Implement Profiling with EndNotifier.

`TMXProfilingOptions options = new TMXProfilingOptions().setCustomAttributes(null);options.setSessionID(MyVariable)`

`TMXProfilingHandle profilingHandle = TMXProfiling.getInstance().profile(options,new CompletionNotifier());`

`class CompletionNotifier implements TMXEndNotifier`

`{`
<br/>
`Override public void complete(TMXProfilingHandle.Result result)`
<br/>
`{ // Once Profile is done. Check the status code in the results dictionary, and use the session Id in the API.`
<br/>
`}`
<br/>
`}`

Download the [Cybersource support material](https://github.com/Braspag/braspag.github.io/raw/bf88c72d069e15925b13227ce653df931f275d1d/files/braspag/antifraude/DecisionManagerDeviceFingerprint_v6.pdf){:target="_blank"} .

### Setting up Fingerprint on Cybersource – iOS

#### 1. Add SDK to your project

Download the [iOS SDK](https://github.com/Braspag/braspag.github.io/raw/bf88c72d069e15925b13227ce653df931f275d1d/files/braspag/antifraude/ThreatMetrix%20iOS%20SDK%206.0-91_.zip){:target ="_blank"}.

Then add the SDK to your project.

#### 2. Import the libraries and dependencies

Add the following libraries and dependencies to your project:

* import RLTMXProfiling
* import RLTMXProfilingConnections
* import RLTMXBehavioralBiometrics

#### 3. Parameterize the SDK

Parameterize the SDK with the following parameters:

`self.profile.configure(configData:[`

`RLTMXOrgID : "OrgID",`
<br/>
<br/>
In the “OrgID” field, indicate the value corresponding to the environment in the Threatmetrix:

* Sandbox: “1snn5n9w”;
* Production: “k8vif92e”.

`RLTMXFingerprintServer : "h.online-metrix.net",`

`RLTMXProfileTimeout : self.profileTimeout,`

`RLTMXLocationServices : true,`

`RLTMXProfilingConnectionsInstance : profilingConnections,`

`])`

#### 4. Create the session id variable

The `ProviderMerchantId` value must be concatenated with the `ProviderIdentifier` variable (defined by e-commerce) to create the session identification (`MyVariable`).

`MyVariable` = `ProviderMerchantId` + `ProviderIdentifier`

**Example:**

`MyVariable` = `braspag_XXXX` + `ProviderIdentifier`

`self.profile.sessionID` = @"`MyVariable`"
<br/>
<br/>
> In the fraud analysis request, send only the value `ProviderIdentifier` in the `Customer.BrowserFingerprint` field. If the `ProviderIdentifier` generated by your e-commerce is "202201080949", in the field `Customer.BrowserFingerprint` send the value "202201080949".

<aside class="notice">We recommend that the `ProviderIdentifier` variable be a GUID.</aside>

#### 5. Implement Profiling

Add the doProfileRequest() function to your application and specify the following options:

`let profileHandle: RLTMXProfileHandle =`

`self.profile.profileDevice(profileOptions:[RLTMXCustomAttributes: [],`

`RLTMXSessionID: [MyVariable], callbackBlock:{(result: [AnyHashable : Any]?) -> Void in`

Download the [Cybersource support material](https://github.com/Braspag/braspag.github.io/raw/bf88c72d069e15925b13227ce653df931f275d1d/files/braspag/antifraude/DecisionManagerDeviceFingerprint_v6.pdf){:target="_blank"}.

# Integrating with ACI Worldwide

## Analyzing a transaction at ACI Worldwide

When your antifraude provider is ACI Worldwide, send the value "RedShield" in the `Provider` field.

### Request

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

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parameters in the body**

|Paramater|Description|Type|Required|Size|
|:-|:-|:-:|:-:|-:|
|`MerchantOrderId`|Order number.|string|Yes|100|
|`TotalOrderAmount`|Total order amount in cents. <br/> Example: 123456 = R$ 1.234,56|long|Yes|-|
|`TransactionAmount`|Financial transaction amount in cents. <br/> Example: 150000 = R$ 1.500,00|long|Yes|-|
|`Currency`|Currency. More information in [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html){:target="_blank"}|enum|-|-|
|`Provider`|Anti-fraud solution provider. <br/> [Table 1 - Provider](https://braspag.github.io//en/manual/antifraude#table-1-provider)|enum|-|-|
|`OrderDate`|Order date <br/> Eg: 2016-12-09 19:16:38.155 <br/> Note: If not informed, a date will be generated by Braspag|datetime|No|-|
|`BraspagTransactionId`|Transaction ID on Braspag Pagador.|guid|No|-|
|`Tid`|Id of the transaction at the acquirer <br/> Note: If you do not have an integration with Pagador Braspag, you will not be able to send the `BraspagTransactionId` field, so it is necessary to send the fields `Nsu`, `AuthorizationCode` and `SaleDate `, in addition to this one.|string|No|20|
|`Nsu`|Unique sequential number of the transaction in the acquirer <br/> Note: If you do not have an integration with Pagador Braspag, you will not be able to send the `BraspagTransactionId` field, so it is necessary to send the fields `Tid`, `AuthorizationCode` and `SaleDate`, other than this one in question|string|No|10|
|`AuthorizationCode`|Acquirer transaction authorization code <br/> Note: If you do not have integration with Pagador Braspag, you will not be able to send the `BraspagTransactionId` field, so it is necessary to send the fields `Tid`, `Nsu` and `SaleDate`, other than this one.|string|No|10|
|`SaleDate`|Date of authorization of the transaction at the acquirer <br/> Note: If you do not have an integration with Pagador Braspag, you will not be able to send the `BraspagTransactionId` field, so it is necessary to send the fields `Tid`, `Nsu ` and `AuthorizationCode`, besides this one.|datetime|No|-|
|`SplitingPaymentMethod`|Identifies whether the transaction is authorized with one or more cards or with more than one payment method. <br/> [Table 2 - SplitingPaymentMethod](https://braspag.github.io//en/manual/antifraude#table-2-splitingpaymentmethod)|enum |-|-|
|`IsRetryTransaction`|Retry of an analysis, must be sent with a value equal to TRUE when the return code in the first attempt is equal to BP900.|bool|No|-|
|`Card.Number`|Credit card number.|string|Yes|19|
|`Card.Holder`|Credit card name.|string|Yes|50|
|`Card.ExpirationDate`|Credit card expiration date. <br/> Eg: 01/2023|string|Yes|7|
|`Card.Cvv`|Credit card security code.|string|Yes|4|
|`Card.Brand`|Credit card brand. <br/> [Table 3 - Card.Brand](https://braspag.github.io//en/manual/antifraude#table-3-card.brand)|enum|-|-|
|`Card.EciThreeDSecure`|Authentication ECI (Electronic Commerce Indicator) code.|string|No|1|
|`Card.Save`|Indicates whether credit card data will be stored in Cartão Protegido.|bool|No|-|
|`Card.Token`|Credit card identifier saved in the Cartão Protegido.|guid|No|-|
|`Card.Alias`|Alias (nickname) of the credit card saved in the Cartão Protegido.|string|No|64|
|`Billing.Street`|Billing address street.|string|No|24|
|`Billing.Number`|Billing address number.|string|No|5|
|`Billing.Complement`|Billing address complement.|string|No|14|
|`Billing.Neighborhood`|Billing Address neighborhood.|string|No|15|
|`Billing.City`|Billing address city.|string|No|20|
|`Billing.State`|Billing address state.|string|No|2|
|`Billing.Country`|Billing address country. More information at [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|No|2|
|`Billing.ZipCode`|Billing address postal code.|string|No|9|
|`Shipping.Street`|Delivery address street.|string|No|24|
|`Shipping.Number`|Delivery address number.|string|No|5|
|`Shipping.Complement`|Delivery address complement.|string|No|14|
|`Shipping.Neighborhood`|Delivery address neighborhood.|string|No|15|
|`Shipping.City`|Delivery address city.|string|No|20|
|`Shipping.State`|Delivery address status.|string|No|2|
|`Shipping.Country`|Delivery address country. More information at[ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|No|2|
|`Shipping.ZipCode`|Delivery address postal code.|string|No|9|
|`Shipping.Email`|E-mail of the person responsible to receive the product at the delivery address.|string|No|60|
|`Shipping.FirstName`|First name of person responsible to receive the product at the delivery address.|string|No|30|
|`Shipping.MiddleName`|First letter of the middle name of the person responsible to receive the product at the delivery address.|string|No|1|
|`Shipping.LastName`|Last name of the person responsible to receive the product at the delivery address.|string|No|30|
|`Shipping.Phone`|Telephone number of the person responsible for receiving the product at the delivery address. <br/> Eg.: 552121114700|string|No|19|
|`Shipping.WorkPhone`|Work telephone number of the person responsible for receiving the product at the delivery address. <br/> Eg.: 552121114701|string|No|19|
|`Shipping.Mobile`|Cell phone number of the person responsible for receiving the product at the delivery address. <br/> Eg.: 5521987654321|string|No|19|
|`Shipping.ShippingMethod`|Order delivery method <br/> [Table 4 - ShippingMethod](https://braspag.github.io//en/manual/antifraude#table-4-shippingmethod)|enum|-|-|
|`Shipping.Comment`|Delivery address references.|string|No|160|
|`Customer.MerchantCustomerId`|Shopper's identification document number, CPF or CNPJ|string|Yes|16|
|`Customer.FirstName`|Shopper's first name.|string|Yes|30|
|`Customer.MiddleName`|First letter of shopper's middle name.|string|No|1|
|`Customer.LastName`|Shopper's last name.|string|Yes|30|
|`Customer.BirthDate`|Shopper's birth date. <br/> Eg.: 1983-10-01|date|Yes|-|
|`Customer.Gender`|Shopper's gender. <br/> [Table 5 - Customer.Gender](https://braspag.github.io//en/manual/antifraude#table-5-customer.gender)|string|No|6|
|`Customer.Email`|Shopper's email.|string|No|60|
|`Customer.Ip`|Shopper's IP address.|string|No|15|
|`Customer.Phone`|Shopper's phone number.<br/> Eg.: 552121114700|string|No|19|
|`Customer.WorkPhone`|Shopper's phone number <br/> Eg.: 552121114701|string|No|19|
|`Customer.Mobile`|Shopper's cell phone number <br/> Ex.: 5521987654321|string|No|19|
|`Customer.Status`|Status of the shopper in the store <br/> [Table 6 - Customer.Status](https://braspag.github.io//en/manual/antifraude#table-6-customer.status)|string|No|8|
|`Customer.BrowserFingerPrint`|Device Fingerprint and real shopper IP Ggeolocation. - [Fingerprint Settings](https://braspag.github.io//en/manual/antifraude#fingerprint-with-aci-worldwide)|string|Yes|6005|
|`CartItem[n].ProductName`|Product's name.|string|No|50|
|`CartItem[n].UnitPrice`|Product unit price. <br/> Eg: 10950 = R$ 109.50|long|No|-|
|`CartItem[n].OriginalPrice`|Original product price. <br/> Eg: 11490 = R$ 114.90|long|No|-|
|`CartItem[n].MerchantItemId`|Product ID in store.|string|No|30|
|`CartItem[n].Sku`|Product SKU (Stock Keeping Unit).|string|No|12|
|`CartItem[n].Quantity`|Product quantity.|int|No|-|
|`CartItem[n].GiftMessage`|Gift message.|string|No|160|
|`CartItem[n].Description`|Product description.|string|No|76|
|`CartItem[n].ShippingInstructions`|Product delivery instructions.|string|No|160|
|`CartItem[n].ShippingMethod`|Product delivery method. <br/> [Table 4 - ShippingMethod](https://braspag.github.io//en/manual/antifraude#table-4-shippingmethod)|enum|-|-|
|`CartItem[n].ShippingTranckingNumber`|Product tracking number.|string|No|19|
|`Airline.ThirdPartyBooking`|Indicates whether the reservation was booked by third parties, such as travel agencies.|bool|No|-|
|`Airline.BookingType`|Reservation schedule type|string|No|255|
|`Airline.TicketDeliveryMethod`|Ticket delivery type|string|No|127|
|`Airline.BookingReferenceNumber`|Booking reference number|string|No|9|
|`Airline.Passengers[n].FirstName`|Passenger's first name.|string|No|29|
|`Airline.Passengers[n].MiddleName`|Passenger's middle name.|string|No|1|
|`Airline.Passengers[n].LastName`|Passenger's last name.|string|No|28|
|`Airline.Passengers[n].PassengerType`|Passenger type. <br/> [Table 8 - Airline.Passengers{n}.PassengerType](https://braspag.github.io//en/manual/antifraude#table-8-airline.passengers[n].passengertype)|enum|No|-|
|`Airline.Passengers[n].Phone`|Passenger's phone number. <br/> Eg.: 552121114700|string|Noo|19|
|`Airline.Passengers[n].Email`|Passenger's email.|string|No|60|
|`Airline.Passengers[n].LoyaltyMemberNumber`|Passenger loyalty number.|string|No|255|
|`Airline.Passengers[n].TicketNumber`|Ticket number.|string|No|20|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Departure airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|string|No|3|
|`Airline.Passengers[n].Legs[n].DepartureCountry`|Departure airport country code. More information at [ISO 3-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|No|3|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Arrival airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|string|No|3|
|`Airline.Passengers[n].Legs[n].ArrivalCountry`|Country code of the airport of arrival. More information at [ISO 3-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|string|No|3|
|`Airline.Passengers[n].Legs[n].AirlineCode`|Airline code.|string|No|3|
|`Airline.Passengers[n].Legs[n].DepartureDateTime`|Departure date and time <br/> Eg.: 2018-03-31 19:16:38 |datetime|No|-|
|`Airline.Passengers[n].Legs[n].ClassOfService`|Class of service.|string|No|30|
|`CustomConfiguration.MerchantWebsite`|Merchant website.|string|No|60|
|`MerchantDefinedData[n].Key`|Field key defined with the anti-fraud provider. <br/> [Table 35 - MerchantDefinedData (ACI Worldwide)](https://braspag.github.io//en/manual/antifraude#table-35-merchantdefineddata-(aci-worldwide))|int|não|-|
|`MerchantDefinedData[n].Value`|Field value defined with the anti-fraud provider. <br/> [Table 35 - MerchantDefinedData (ACI Worldwide)](https://braspag.github.io//en/manual/antifraude#table-35-merchantdefineddata-(aci-worldwide))|var|No|-|

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

**Parameters in the header**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parameters in the body**

|Parameter|Description|Type|
|:-|:-|:-:|
|`TransactionId`|Transaction ID in the Braspag Antifraude Gateway|guid|
|`Status`|Transaction status in the Braspag Antifraude Gateway <br/> [Table 19 - Status](https://braspag.github.io//en/manual/antifraude#table-19-status)|enum|
|`ProviderAnalysisResult.ProviderRequestId`|Transaction request ID on ReDShield|string|
|`ProviderAnalysisResult.Result.ProviderCode`|ReDShield return code|string|
|`ProviderAnalysisResult.Result.ProviderDescription`|ReDShield return message|string|
|`ProviderAnalysisResult.ResultDetails.CSITransactionLink`|Link to view transaction details on ReDShield's CSI portal|string|
|`ProviderAnalysisResult.ResultDetails.ProviderStatus`|Transaction status at ReDShield <br/> [Table 20 - ProviderStatus](https://braspag.github.io//en/manual/antifraude#table-20-providerstatus)|enum|
|`ProviderAnalysisResult.ResultDetails.ProviderTransactionId`|Transaction ID on ReDShield|string|
|`ProviderAnalysisResult.ResultDetails.ProviderOrderId`|Order ID on ReDShield|string|
|`ProviderAnalysisResult.Ndc`|Exclusive ID of the ReDShield request|string|

# Queries

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

* After the merchant receives the status change notification, it must perform a GET through the URL https://{antifraude endpoint}/analysis/v2/{Id}, sending the transaction ID that was received in the notification of the change of status to get the new status of the transaction.

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

<aside class="request"><span class="method patch">PATCH</span> <span class="endpoint">analysis/v2/{id}</span></aside>

``` json
{
    "Status": "Accept",
    "Comments": "Dados do cliente OK"
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
|`Status`|Transaction new status. Accept or Reject|string|yes|-|
|`Comments`|Comment associated with status change|string|no|255|

## Response

* When the transaction is received for processing.

``` json
{
    "Status": "Accept",
    "ChangeStatusResponse": {
        "Status": "OK",
        "Message": "Change Status request successfully received. New status: Accept."
    }
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`Status`|Transaction new status|string|
|`ChangeStatusResponse.Status`|Identify that Cybersource has received a status change request|string|
|`ChangeStatusResponse.Message`|Message containing content of the operation performed|string|

* When the transaction is not found in the database.

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

* When the transaction is not eligible to change status.

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* When the new status sent is different from Accept or Reject.

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

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

An important component of fraud analysis, Fingerprint is a Javascript that must be inserted on your website to capture important data such as: customer's IP, browser version, operating system etc.
Often, only the cart data is not enough to guarantee an assertive analysis. The data collected by Fingerprint complement the analysis and ensure that your store is more protected.

It will be necessary to add two tags, the **&lt;script&gt;** inside the **&lt;head&gt;** tag for a correct performance and **&lt;noscript&gt;** within the **&lt;body&gt;** tag, so that the device data collection is performed even if the browser Javascript is disabled.

<aside class="warning">If the 2 code segments are not placed on the checkout page, the results may not be accurate</aside>

**Variables**

|Variable|Description|
|:-|:-|
|`org_id`|Sandbox = 1snn5n9w <br/> Production = k8vif92e|
|`session_id`|Concatenation of the variables `ProviderMerchantId` and` Customer.BrowserFingerprint` <br/> `ProviderMerchantId` = Identifier of your store in Cybersource. If not, contact Braspag <br/> `Customer.BrowserFingerprint` = Identifier used to cross information obtained from the buyer's device. <br/> Obs .: This identifier can be any value or the order number, but it must be unique for 48 hours.|

> Javascript Code

![Code example]({{ site.baseurl_root }}/images/braspag/af/exemploscriptdfp.png)

The variables, when properly filled in, would provide a URL similar to the example below:

![Exemplo Url](https://braspag.github.io/images/braspag/af/urldfpaf.png)

<aside class = "warning"> Make sure that you copy all the data correctly and that you have replaced the variables correctly with the respective values. </aside>

** Integração em aplicativos mobile **

> Request the SDKs (iOS and Android) and manuals together with the integration ticket.

# Annexes

## Table 1 - Provider

|Provider|Value|
|---|---|
|Cybersource|Cybersource|
|ACI Wordwide|ReDShield|

## Table 2 - SplitingPaymentMethod

|Value|Description|Provider|
|:-|:-|:-|
|None|Payment with one card only.|ACI Wordwide|
|CardSplit|Payment with more than one card.|ACI Wordwide|
|MixedPaymentMethodSplit|Payment with more than one payment method.|ACI Wordwide|

## Table 3 - Card.Brand

|Value|Provider|Observation|
|:-|:-|:-|
|Amex|Cybersource, ACI Wordwide|-|
|Diners|Cybersource, ACI Wordwide|-|
|Discover|Cybersource, ACI Wordwide|-|
|JCB|Cybersource, ACI Wordwide|-|
|Master|Cybersource, ACI Wordwide|-|
|Dankort|Cybersource, ACI Wordwide|-|
|Cartebleue|Cybersource, ACI Wordwide|-|
|Maestro|Cybersource, ACI Wordwide|-|
|Visa|Cybersource, ACI Wordwide|-|
|Elo|Cybersource, ACI Wordwide|-|
|Hipercard|Cybersource, ACI Wordwide|Will be sent to Cybersource as Private Label|
|Aura|Cybersource|Will be sent to Cybersource as Private Label|
|Hiper|Cybersource|Will be sent to Cybersource as Private Label|
|Naranja|Cybersource|Will be sent to Cybersource as Private Label|
|Nevada|Cybersource|Will be sent to Cybersource as Private Label|
|Cabal|Cybersource|Will be sent to Cybersource as Private Label|
|Credz|Cybersource|Will be sent to Cybersource as Private Label|
|Credsystem|Cybersource|Will be sent to Cybersource as Private Label|
|Banese|Cybersource|Will be sent to Cybersource as Private Label|
|Riachuelo|Cybersource|Will be sent to Cybersource as Private Label|
|Carnet|Cybersource|Will be sent to Cybersource as Private Label|
|Other|Cybersource|Will be sent to Cybersource as Private Label|

## Table 4 - ShippingMethod

|Value|Description|Provider|
|:-|:-|:-|
|SameDay|Same day delivery|Cybersource|
|SameDay|Same day delivery|ACI Worldwide, Cybersource|
|NextDay|Next day delivery|ACI Worldwide, Cybersource|
|TwoDay|Delivery in two days|ACI Worldwide, Cybersource|
|ThreeDay|Delivery in three days|ACI Worldwide, Cybersource|
|LowCost|Low cost delivery method|ACI Worldwide, Cybersource|
|Pickup|Store pickup|ACI Worldwide, Cybersource|
|CarrierDesignatedByCustomer|Delivery method designated by the shopper|ACI Worldwide|
|International|International delivery method|ACI Worldwide|
|Military|Military delivery method|ACI Worldwide|
|Other|Other delivery methods|ACI Worldwide, Cybersource|
|None|No delivery method as it is a service or subscription|ACI Worldwide, Cybersource|

## Table 5 - Customer.Gender

|Value|Provider|
|:-|:-|:-|
|Male|ACI Worldwide|
|Female|ACI Worldwide|

## Table 6 - Customer.Status

|Value|Description|Provider|
|:-|:-|:-|
|New|Identifies when the shopper is new to the store and never made a purchase|ACI Worldwide|
|Existing|Identifies when the shopper has used the store and has already made a purchase|ACI Worldwide|

## Table 7 - Airline.JourneyType

|Value|Description|Provider|
|:-|:-|:-|
|OneWayTrip|One-way trip|Cybersource|
|RoundTrip|Round trip|Cybersource|

## Table 8 - Airline.Passengers[n].PassengerType

|Value|Description|Provider|
|:-|:-|:-|
|Adult|Adult|ACI Worldwide, Cybersource|
|Child|Child|ACI Worldwide, Cybersource|
|Infant|Infant|ACI Worldwide, Cybersource|
|Youth|Teenager|ACI Worldwide|
|Student|Student|ACI Worldwide|
|SeniorCitizen|Senior Citizen|ACI Worldwide|
|Military|Military|ACI Worldwide|

## Table 9 - Airline.Passengers[n].Status

|Value|Provider|
|:-|:-|
|Standard|Cybersource|
|Gold|Cybersource|
|Platinum|Cybersource|

## Table 10 - CartItem[n].Risk

|Value|Description|Provider|
|:-|:-|:-|
|Low|Product associated with a low amount of chargebacks (default)|Cybersource|
|Normal|Product associated with the normal amount of chargebacks|Cybersource|
|High|Product associated with a high amount of chargebacks|Cybersource|

## Table 11 - CartItem[n].AddressRiskVerify

|Value|Description|Provider|
|:-|:-|:-|
|Yes|In case of divergence between billing and delivery addresses, assign low risk to the order|Cybersource|
|No|In case of divergence between billing and delivery addresses, assign high risk to the order (default)|Cybersource|
|Off|Differences between billing and delivery addresses do not affect the score|Cybersource|

## Table 12 - CartItem[n].HostHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect the fraud analysis score|Cybersource|

## Table 13 - CartItem[n].NonSensicalHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect the fraud analysis score|Cybersource|

## Table 14 - CartItem[n].ObscenitiesHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect the fraud analysis score|Cybersource|

## Table 15 - CartItem[n].TimeHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect the fraud analysis score|Cybersource|

## Table 16 - CartItem[n].PhoneHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect the fraud analysis score|Cybersource|

## Table 17 - CartItem[n].VelocityHedge

|Value|Description|Provider|
|:-|:-|:-|
|Low|Low|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|High|Cybersource|
|Off|Will not affect the fraud analysis score|Cybersource|

## Table 18 - Invoice.Tender

|Value|Description|Provider|
|:-|:-|:-|
|Consumer|Personal credit card (default)|Cybersource|
|Corporate|Corporate credit card|Cybersource|
|Debit|Debit card|Cybersource|
|CollectDelivery|Charge on delivery|Cybersource|
|EletronicCheck|Electronic check|Cybersource|
|PaymentP2P|Person-to-person payment|Cybersource|
|PrivateLabel|Private credit card payment|Cybersource|
|Other|Payments with other methods|Cybersource|

## Table 19 - Status

|Value|Description|Provider|
|:-|:-|:-|
|Accept|Transaction accepted after fraud analysis|ACI Worldwide, Cybersource|
|Review|Transaction under review after fraud analysis|ACI Worldwide, Cybersource|
|Reject|Transaction rejected after fraud analysis|ACI Worldwide, Cybersource|
|Pendent|Transaction pending, because when sending it for fraud analysis there was a timeout in the response between Braspag and Cybersource|Cybersource|
|Unfinished|Transaction not finalized due to some contract validation reason or internal error <br/> A transaction analyzed at Cybersource, in the analysis response the field `ProviderAnalysisResult.ProviderStatus` is equal to **REJECT** and the field `ProviderAnalysisResult.ProviderCode` other than **481**, transaction status will be **Unfinished**|ACI Worldwide, Cybersource|
|ProviderError|Transação com erro no provedor ao ser enviada para análise|ACI Worldwide, Cybersource|

## Table 20 - ProviderStatus

|Value|Description|Provider|From-To with the `Status` field (Status of the transaction in the Braspag Antifraude Gateway)|
|:-|:-|:-|:-|
|APPROVE|Transaction approved at the provider|ACI Worldwide|Accept|
|ACCEPT|Transaction accepted at provider|ACI Worldwide, Cybersource|Accept|
|PEND|Transaction under review at the provider|ACI Worldwide|Review|
|CHALLENGE|Transaction under review at the provider|ACI Worldwide|Review|
|REVIEW|Transaction under review at the provider|Cybersource|Review|
|CANCEL|Transaction rejected at provider|ACI Worldwide|Reject|
|DENY|Transaction rejected at provider|ACI Worldwide|Reject|
|REJECT|Transaction rejected at provider|Cybesource|Reject|
|ENETLP|Transaction error at provider|ACI Worldwide|ProviderError|
|ENORSP|Transaction error at provider|ACI Worldwide|ProviderError|
|ERROR|Transaction error at provider|ACI Worldwide, Cybersource|ProviderError|

## Table 21 - ProviderAnalysisResult.ProviderCode

|Value|Description|Provider|
|:-|:-|:-|
|100|Successfully performed operation|Cybersource|
|101|Transaction submitted for fraud analysis is missing one or more required fields. <br/> Check the `ProviderAnalysisResult.Missing` field in the response <br/> Possible action: Resend the transaction with complete information|Cybersource|
|102|The transaction sent for fraud analysis has one or more fields with invalid values <br/> Check the `ProviderAnalysisResult.Invalid` field in the response <br/> Possible action: Resend the transaction with the correct information|Cybersource|
|150|Internal error <br/> Possible Action: Wait a few minutes and try to resend the transaction|Cybersource|
|151|The transaction was received, but the server timed out. This error does not include time-out between client and server<br/> Possible Action: Wait a few minutes and try to resend the transaction|Cybersource|
|152|Order was received, but time-out occurred <br/> Possible Action: Wait a few minutes and try to resend the transaction|Cybersource|
|202|The transaction was declined because the card has expired or the expiration date does not match the correct one <br/> Possible action: Request another card or payment method|Cybersource|
|231|The transaction was declined as card is invalid <br/> Possible action: Request another card or payment method|Cybersource|
|234|Problem with store configuration at Cybersource <br/> Possible action: Contact support to fix the configuration issue|Cybersource|
|400|Fraud score exceeds your threshold <br/> Possible action: Review the shopper's transaction|Cybersource|
|480|The transaction was marked as review by the DM (Decision Manager)|Cybersource|
|481|The transaction was rejected by the DM(Decision Manager)|Cybersource|

## Table 22 - ProviderAnalysisResult.AfsReply.AddressInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|COR-BA|Billing address can be normalized|Cybersource|
|COR-SA|Delivery address can be normalized|Cybersource|
|INTL-BA|Billing address country is outside the US|Cybersource|
|INTL-SA|Delivery address country is outside the US|Cybersource|
|MIL-USA|US Military Address|Cybersource|
|MM-A|Billing and delivery addresses use different street names|Cybersource|
|MM-BIN|Card BIN (first six digits of card number) does not match country|Cybersource|
|MM-C|Billing and delivery addresses use different cities|Cybersource|
|MM-CO|Billing and delivery addresses use different countries|Cybersource|
|MM-ST|Billing and shipping addresses use different states|Cybersource|
|MM-Z|Billing and delivery addresses use different postal codes|Cybersource|
|UNV-ADDR|The address is unverifiable|Cybersource|

## Table 23 - ProviderAnalysisResult.AfsReply.AfsFactorCode

|Value|Description|Provider|
|:-|:-|:-|
|A|Excessive change of address. Shopper has changed billing address two or more times in the past six months|Cybersource|
|B|Card BIN or risk authorization. Risk factors are related to credit card BIN and/or card authorization checks|Cybersource|
|C|High numbers of credit cards. Shopper has used more than six credit card numbers in the last six months|Cybersource|
|D|Impact of email address. Shopper uses free email provider or email address is risky|Cybersource|
|E|Positive list. The shopper is on your positive list|Cybersource|
|F|Negative list. Account number, address, email address or IP address for this purpose appears your negative list|Cybersource|
|G|Geolocation inconsistencies. Shopper's email domain, phone number, billing address, shipping address or IP address is suspicious|Cybersource|
|H|Excessive name changes. The shopper changed the name two or more times in the last six months|Cybersource|
|I|Internet inconsistencies. IP address and email domain are not consistent with billing address|Cybersource|
|N|Meaningless input. Shopper's name and address fields contain meaningless words or language|Cybersource|
|O|Obscenities. Shopper data contains obscene words|Cybersource|
|P|Morphing identity. Multiple values of an identity element are linked to a value of a different identity element. For example, multiple phone numbers are linked to a single account number.|Cybersource|
|Q|Phone inconsistencies. Shopper's phone number is suspicious|Cybersource|
|R|Risky order. Transaction, shopper and merchant show high risk correlated information|Cybersource|
|T|Time coverage. The shopper is trying to buy outside the expected time|Cybersource|
|U|Unverifiable address. Billing or delivery address cannot be verified|Cybersource|
|V|Card has been used many times in the last 15 minutes|Cybersource|
|W|Marked as suspicious. The billing or delivery address is similar to an address previously marked as suspicious|Cybersource|
|Y|The address, city, state or country of the billing and delivery addresses do not match|Cybersource|
|Z|Invalid value. Since the request contains an unexpected value, a default value has been substituted. Although the transaction can still be processed, examine the order carefully for anomalies|Cybersource|

## Table 24 - ProviderAnalysisResult.AfsReply.CardAccountType

|Value|Description|Provider|
|:-|:-|:-|
|CN|Private card|Cybersource|
|CP|Corporate card|Cybersource|

## Table 25 - ProviderAnalysisResult.AfsReply.HotListInfoCode

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

## Table 26 - ProviderAnalysisResult.AfsReply.IdentityInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|MORPH-B|The same billing address has been used several times with multiple customer identities|Cybersource|
|MORPH-C|The same card number has been used several times with multiple customer identities|Cybersource|
|MORPH-E|The same email address has been used several times with multiple customer identities|Cybersource|
|MORPH-I|The same IP address has been used several times with multiple customer identities|Cybersource|
|MORPH-P|The same phone number has been used several times with multiple customer identities|Cybersource|
|MORPH-S|The same shipping address has been used several times with multiple customer identities|Cybersource|

## Table 27 - ProviderAnalysisResult.AfsReply.InternetInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|FREE-EM|The customer’s email address is from a free email provider|Cybersource|
|INTL-IPCO|The country of the customer’s IP address is outside of the U.S.|Cybersource|
|INV-EM|The customer’s email address is invalid|Cybersource|
|MM-EMBCO|The domain in the customer’s email address is not consistent with the country in the billing address|Cybersource|
|MM-IPBC|The customer’s IP address is not consistent with the city in the billing address|Cybersource|
|MM-IPBCO|The customer’s IP address is not consistent with the country in the billing address|Cybersource|
|MM-IPBST|The customer’s IP address is not consistent with the state in the billing address. However, this information code may not be returned when the inconsistency is between immediately adjacent states|Cybersource|
|MM-IPEM|The customer’s email address is not consistent with the customer’s IP address|Cybersource|
|RISK-EM|The customer's email domain (for example, mail.example.com) is associated with higher risk|Cybersource|
|UNV-NID|The customer’s IP address is from an anonymous proxy. These entities completely hide the IP information|Cybersource|
|UNV-RISK|The IP address is from a risky source|Cybersource|
|UNV-EMBCO|The country of the customer’s email address does not match the country in the billing address|Cybersource|

## Table 28 - ProviderAnalysisResult.AfsReply.PhoneInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|MM-ACBST|Customer's phone number not consistent with billing address state|Cybersource|
|RISK-AC|Customer's area code associated with high risk|Cybersource|
|RISK-PH|U.S. or Canada phone number incomplete, or one or more parts of the number are risky|Cybersource|
|TF-AC|Phone number uses toll-free area code|Cybersource|
|UNV-AC|Invalid area code|Cybersource|
|UNV-OC|Invalid area code and/or phone prefix|Cybersource|
|UNV-PH|Invalid phone number|Cybersource|

## Table 29 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|BAD-FP|The device is risky|Cybersource|
|INTL-BIN|The credit card was issued outside of the U.S.|Cybersource|
|MM-TZTLO|The device's time zone is inconsistent with the country's time zones|Cybersource|
|MUL-EM|The customer has used more than four different email addresses|Cybersource|
|NON-BC|The billing city is nonsensical|Cybersource|
|NON-FN|The customer’s first name is nonsensical|Cybersource|
|NON-LN|The customer’s last name is nonsensical|Cybersource|
|OBS-BC|The billing city contains obscenities|Cybersource|
|OBS-EM|The email address contains obscenities|Cybersource|
|RISK-AVS|The combined AVS test result and normalized billing address are risky, such as when the AVS result indicates an exact match, but the normalized billing address is not deliverable|Cybersource|
|RISK-BC|The billing city has repeated characters|Cybersource|
|RISK-BIN|In the past, this payment card BIN has shown a high incidence of fraud|Cybersource|
|RISK-DEV|Some of the device characteristics are risky|Cybersource|
|RISK-FN|The customer’s first and last names contain unlikely letter combinations|Cybersource|
|RISK-LN|The customer’s middle or last name contains unlikely letter combinations|Cybersource|
|RISK-PIP|The proxy IP address is risky|Cybersource|
|RISK-SD|The inconsistency in billing and shipping countries is risky|Cybersource|
|RISK-TB|The day and time of the order associated with the billing address is risky|Cybersource|
|RISK-TIP|The true IP address is risky|Cybersource|
|RISK-TS|The day and time of the order associated with the shipping address is risky|Cybersource|

## Table 30 - ProviderAnalysisResult.AfsReply.VelocityInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|VEL-ADDR|Different billing and/or shipping states (U.S. and Canada only) have been used several times with the credit card number and/or email address|Cybersource|
|VEL-CC|Different credit cards have been used several times with the same name or email address|Cybersource|
|VEL-NAME|Different names have been used several times with the credit card number and/or email address|Cybersource|
|VELS-CC|The credit cards has been used several times during the short tracking interval|Cybersource|
|VELI-CC|The credit cards has been used several times during the medium tracking interval|Cybersource|
|VELL-CC|The credit cards has been used several times during the long tracking interval|Cybersource|
|VELV-CC|The credit cards has been used several times during the very long tracking interval|Cybersource|
|VELS-EM|The customer’s email address has been used several times during the short tracking interval|Cybersource|
|VELI-EM|The customer’s email address has been used several times during the medium tracking interval|Cybersource|
|VELL-EM|The customer’s email address has been used several times during the long tracking interval|Cybersource|
|VELV-EM|The customer’s email address has been used several times during the very long tracking interval|Cybersource|
|VELS-FP|The device fingerptint has been used several times during the short tracking interval.
|VELI-FP|The device fingerptint has been used several times during the medium tracking interval.
|VELL-FP|The device fingerptint has been used several times during the long tracking interval.
|VELV-FP|The device fingerptint has been used several times during the very long tracking interval.
|VELS-IP|The IP address has been used several times during the short tracking interval|Cybersource|
|VELI-IP|The IP address has been used several times during the medium tracking interval|Cybersource|
|VELL-IP|The IP address has been used several times during the long tracking interval|Cybersource|
|VELV-IP|The IP address has been used several times during the very long tracking interval|Cybersource|
|VELS-SA|The shipping address has been used several times during the short tracking interval|Cybersource|
|VELI-SA|The shipping address has been used several times during the medium tracking interval|Cybersource|
|VELL-SA|The shipping address has been used several times during the long tracking interval|Cybersource|
|VELV-SA|The shipping address has been used several times during the very long tracking interval|Cybersource|
|VELS-TIP|The true IP address has been used several times during the short interval|Cybersource|
|VELI-TIP|The true IP address has been used several times during the medium interval|Cybersource|
|VELL-TIP|The true IP address has been used several times during the long interval|Cybersource|

## Table 31 - ProviderAnalysisResult.AfsReply.IpRoutingMethod

|Value|Description|Provider|
|:-|:-|:-|
|Anonymizer|IP addresses that are hidden because the customer is extremely cautious, wants absolute privacy, or is fraudulent|Cybersource|
|AOL, AOL dialup, AOL POP and AOL proxy|AOL members. In most cases, the country can be identified, but the state and city cannot|Cybersource|
|Cache proxy|Proxy used through either an Internet accelerator or a content distribution service. The customer may be located in a country different from that indicated by the IP address|Cybersource|
|Fixed|IP address is near or at the same location as the user|Cybersource|
|International proxy|Proxy that contains traffic from multiple countries. The customer may be located in a country different from that indicated by the IP address. In many cases, corporate networks are routing the traffic from international offices through a central point, often the corporate headquarters|Cybersource|
|Mobile gateway|Gateway to connect mobile devices to the public Internet. Many mobile operators, especially in Europe, service more than one country and route traffic through centralized network hubs. The customer may be located in a country different from that indicated by the IP address|Cybersource|
|POP|Customer dialing into a regional ISP most likely near the IP location but possibly across geographical boundaries|Cybersource|
|Regional proxy|Proxy that contains traffic from multiple states within a single country. The customer may be located in a state different from that indicated by the IP address. In many cases, corporate networks are routing the traffic from regional offices through a central point, often the corporate headquarters|Cybersource|
|Satellite|Satellite connections. If the uplink and the downlink are registered, the routing method is considered standard because the sender is known. However, if the downlink is not registered, the customer can be anywhere within the beam pattern of the satellite, which may span a continent or more|Cybersource|
|SuperPOP|Customer is dialing into a multi-state or multi-national ISP that is not likely near the IP location. The customer may be dialing across geographical boundaries|Cybersource|
|No value returned|The routing type is unknown|Cybersource|

## Table 32 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision

|Value|Provider|
|:-|:-|
|ACCEPT|Cybersource|
|ERROR|Cybersource|
|REJECT|Cybersource|
|REVIEW|Cybersource|

## Table 33 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation

|Value|Description|Provider|
|:-|:-|:-|
|T|The rule is true|Cybersource|
|F|The rule is false|Cybersource|
|N|The rule can not be evaluated because the data is insufficient|Cybersource|
|E|The rule can not be evaluated because an error has occurred|Cybersource|

## Table 34 - MerchantDefinedData (Cybersource)

> Relevance level <br/> 1 - Relevant <br/> 2 - Very Relevant <br/> 3 - Extremely Relevant <br/><br/>
> Depending on the level of relevance of the fields and the possibility of designing the risk strategy according to the needs of your business, when validating test transactions, they will be charged if they are not sent. With this, we request a prior analysis of the documentation and signaling of the fields that will not be possible to be sent.<br/><br/>
> If you do not have the data to send, please do not send the corresponding field as empty, that is, just do not send it.

|ID|Value|Type|Relevance Level|Segment|Required|
|--|-----|----|-------------------|--------|---|
|1|Customer who logged in. Possible values: "{*customer_login*}" (if the final customer logs in to purchase on the site) / "Guest" (if the final customer makes the purchase as a visitor). Note: **Do not** submit the field if the sale is made directly by a third party (e.g.: an agent).|string|2|All|**Yes**|
|2|How long (in days) the customer has been your customer. E.g.: 314.|int|3|All|No|
|3|Quantity of order installments.|int|3|All|No|
|4|Sales channel. Possible values: "Call Center" (phone purchase) / "Web" (web purchase) / "Portal" (purchase through agent) / "Kiosk" (kiosk  purchase) / "Mobile" (cell phone or tablet purchases). Note: When “Call Center”, the submission of field **39**(call center user name) is required.|string|3|All|**Yes**|
|5|Coupon/discount code in case the customer uses it in the purchase.|string|1|All|No|
|6|How long (in days) since customer's last purchase. E.g.: 55.|int|3|All|No|
|7|Seller's code or name.|string|1|All|No|
|8|Number of customer's attempts to pay one same order, which may have been using different credit cards and/or other payment methods.|int|2|All|No|
|9|Identifies if the customer will pick up the product in the store. Possible values: "YES" / "NO". Note: When “YES”, the submission of field **22**(code of pick up store) is required.|string|3|Retail or Cosmetics|**Yes**|
|10|Identifies whether payment will be made by someone not present on the trip or package. Possible values: "YES" / "NO".|string|3|Air or Tourism|No|
|11|Hotel category (star rating). Possible values: "1" (simple) / "2"  (budget) / "3" (tourism) / "4" (superior) / "5" (luxury).|int|3|Tourism|No|
|12|How long (in days) from purchase date to hotel check-in. E.g.: 123.|int|3|Tourism|No|
|13|Number of nights at the hotel. E.g.: 5.|int|3|Tourism|No|
|14|Trip or package category. <br> Possible values: "National" / "International" / "National/International".|string|3|Air or Tourism|No|
|15|Name of airline / car rental /hotel. Note: Name each company name, separated by a "/".|string|2|Air or Tourism|No|
|16|Reservation PNR code. When there is a reservation change for this PNR to an earlier flight date, it is important to apply a new fraud analysis by resubmitting this PNR.|string|3|Air|No|
|17|Identifies if the reservation was brought forward. Possible values: "YES" / "NO". Note: When “YES”, the submission of field **16** (reservation PNR code) is required.|string|3|Air|No|
|18|Rented vehicle category. Possible values: "1" (basic) / "2" (sport) / "3" (prime) / "4" (utility) / "5" (armored).|string|3|Tourism|No|
|19|Identifies if the package refers to a cruise. Possible values: "YES" / "NO".|string|2|Tourism|No|
|20|Decision of fraud review for the latest purchase. Possible values: "ACCEPT" / "REJECTED".|string|3|All|No|
|21|Shipping cost. E.g.: 10599 = $ 105.99|long|1|Retail or Cosmetics|No|
|22|Code of pick up store. Note: This field must be sent when field **9** is "YES".|string|3|Retail or Cosmetics|No|
|23|Credit card suffix (last 4 digits).|int|1|All|No|
|24|How long in days since first customer purchase. E.g.: 150.|int|3|All|No|
|25|Gender of the customer. Possible values: "F" (female) / "M" (male).|string|2|All|No|
|26|Credit card bin (first 6 digits).|int|1|All|No|
|27|Delivery address street type. Possible values: "R" (residential) / "C" (commercial).|string|2|All|No|
|28|Average time taken by the customer to make the purchase.|int|2|All|No|
|29|Number of retries the customer made to log in.|int|2|All|No|
|30|Number of web pages the customer visited within the 30 minutes before the purchase.|int|2|All|No|
|31|Number of changes of credit card number the customer made to make the order payment.|int|2|All|No|
|32|Identifies whether the email was pasted or typed. Possible values: "Typed" / "Pasted".|string|3|All|No|
|33|Identifies whether the credit card number was pasted or entered. Possible values: "Typed / Pasted".|string|3|All|No|
|34|Identifies if the email has been verified for account activation. Possible values: "YES" / "NO".|string|2|All|No|
|35|Identifies the type of customer. Possible values: "Local" / "Tourist".|string|2|Tourism|No|
|36|Identifies whether a giftcard was used as the payment method. Possible values: "YES" / "NO".|string|1|All|No|
|37|Order delivery method. Possible values: "Sedex" / "Sedex 10" / "1 day" / "2 days" / "Motoboy" / "Same day".|string|3|Retail or Cosmetics|No|
|38|Customer phone number identified via caller ID for a sale made through a "Call Center". Format: DDIDDNumber - E.g.: 552121114720.|string|3|All|No|
|39|Call center username. Note: This field must be sent when field **4** is "Call Center".|string|1|All|No|
|40|Comments added when the order is a gift.|string|1|All|No|
|41|Document type. Possible values: "CPF" / "CNPJ" / "Passport".|string|2|All|No|
|42|Customer's age.|int|2|All|No|
|43|Customer's income range. E.g.: 100000 = $ 1,000.00.|long|2|All|No|
|44|Historical quantity of customer purchases.|int|3|All|No|
|45|Identifies if the purchase was made by an employee. Possible values: "YES" / "NO".|string|2|All|No|
|46|Name printed on the credit card (bearer).|string|3|All|No|
|47|Identifies whether it is a private label card. Possible values: "YES" / "NO".|string|2|All|No|
|48|Number of payment methods used to make the purchase.|int|2|All|No|
|49|Average value of the purchases made over the past 6 months. E.g.: 159050 = $ 1,590.99.|long|3|All|No|
|50|Current purchase value deviation factor over average of the past 6 months.|3|All|No|
|51|Identifies if you are a VIP client with special risk treatment or positive list. Possible values: "YES" / "NO".|string|3|All|No|
|52|Product category. Possible values: "Animals & Pets" / "Clothing & Accessories" / "Business & Industry" / "Cameras & Optics" / "Electronics" / "Food, Beverage & Cigarettes" / "Furniture" / "Tools" / "Health & Beauty" / "Home & Garden" / "Bags & Luggage" / "Adult" / "Guns & Ammo" / "Office Supplies" / "Religion & Ceremonials" / "Software" / "Sports Equipment" / "Toys & Games" / "Vehicles & Parts" / "Books" / "DVDs & Videos" / "Magazines & Newspapers" / "Music" / "Other Unspecified Categories".|string|2|All|No|
|53|Identifies if there is an SMS phone confirmation routine. Possible values: "YES" / "NO".|string|2|All|No|
|54|2nd payment method.|string|2|All|No|
|55|3rd payment method.|string|2|All|No|
|56|If 2nd payment method is "credit card", send brand.|string|1|All|No|
|57|If 3rd payment method is "credit card", send brand.|string|1|All|No|
|58|If 2nd payment method, inform the amount paid. E.g.: 128599 = $ 1,285.99.|long|2|All|No|
|59|If 3rd payment method, inform the amount paid. E.g.: 59089 = R $ 590,89.|long|2|All|No|
|60|How long (in days) since last change. E.g.: 57.|int|3|All|No|
|61|Identifies if there was any registration information change.|string|1|No|
|62|Number of points redeemed in the latest purchase.|long|3|Loyalty|No|
|63|Amount of points left in balance.|long|2|Loyalty|No|
|64|Number of days since last points exchange.|long|2|Loyalty|No|
|65|Customer identifier in loyalty program.|string|2|Loyalty|No|
|66|Number of minutes recharged over the past 30 days.|long|2|Digital Goods|No|
|67|Number of top-ups performed over the past 30 days.|long|2|Digital Goods|No|
|68|Number of days between departure date and return date.|int|2|Air|No|
|69|Number of passengers traveling regardless of age group.|int|2|Air|No|
|70|Flight identifier.|string|1|Air|No|
|71|Number of infants traveling.|int|2|Air|No|
|72|Number of children traveling.|int|2|Air|No|
|73|Number of adults traveling.|int|2|Air|No|
|74|Identifies a frequent flyer. Possible values: "YES" / "NO".|string|2|Air|No|
|75|Frequent flyer number.|string|2|Air|No|
|76|Frequent flyer category. This category may vary according to the airline.|int|2|Air|No|
77|Boarding day. Possible values: "Sunday" / "Monday" / "Tuesday" / "Wednesday" / "Thursday" / "Friday" / "Saturday".|string|2|Air|No|
|78|Airline code. E.g.: "JJ" / "LA" / "AA" / "UA" / "G3" etc.|string|1|Air|No|
|79|Class of ticket fare. E.g.: "W" / "Y" / "N" etc.|string|2|Air|No|
|80|Passenger's cell phone number. Format: DDIDDNumber - E.g.: 5521976781114.|string|2|Air|No|
|81|Identifies if the credit card holder will travel. Possible values: "YES" / "NO".|string|3|Air|No|
|82|Identifies if the seller will work with manual review. Possible values: "YES" / "NO".|string|1|All|No|
|83|Business segment. E.g.: "Retail".|string|2|All|**Yes**|
|84|Name of the platform integrated with the Gateway Braspag Anti-fraud API. For direct integrations between the store and Braspag, send the value "PROPRIA".|string|3|All|**Yes**|
|85 to 89|Free fields defined with the anti-fraud provider, according to the business rules.|-|-|-|No|
|90 to 100|Reserved.|-|-|-|No|

## Table 35 - MerchantDefinedData (ACI Worldwide)

|Key|Value|Type|Size|
|:-|:-|:-|:-|
|1 to 3|Reserved|-|-|
|4 to 8|Free fields defined with the anti-fraud provider, according to business rules|var|256|
|9 to 13|Reserved|-|-|
|14|Segment|MCC (Merchant Category Code) of your store|int|-|
|15 to 20|Free fields defined with the anti-fraud provider, according to business rules|var|30|
|21|Reserved|-|-|
|22|Free field defined with the anti-fraud provider, according to business rules|var|30|
|23|Reserved|-|-|
|24|Free field defined with the anti-fraud provider, according to business rules|var|30|
|25|Reserved|-|-|

## Table 36 - CartItem[n].Category

|Value|Description|Provider|
|:-|:-|:-|
|AdultContent|Adult Content|Cybersource|
|Coupon|Coupon applied to entire order|Cybersource|
|Default|Default value for the product type. When no other value is sent, the category being sent is assumed to be this|Cybersource|
|EletronicGood|Electronic product other than software|Cybersource|
|EletronicSoftware|Software distributed electronically via download|Cybersource|
|GiftCertificate|Gift Certificate|Cybersource|
|HandlingOnly|Fee you charge your customer to cover your selling administrative costs. Ex.: Convenience fee / Installation fee|Cybersource|
|Service|Service that will be performed for the client|Cybersource|
|ShippingAndHandling|Amount of freight and fee you charge your customer to cover your sales administrative costs|Cybersource|
|ShippingOnly|Shipping value|Cybersource|
|Subscription|Subscription. Eg.: Streaming videos / Subscription to news|Cybersource|
