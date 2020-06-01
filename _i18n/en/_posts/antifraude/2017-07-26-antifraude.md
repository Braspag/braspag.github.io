---
layout: manual
title: Antifraud - Integration Manual
description: Technical integration API Antifraud Gateway Braspag
search: true
translated: true
categories: manual
tags:
    - Risk Management
language_tabs:
  json: JSON
  shell: cURL
  html: HTML 
---

# Overview

**Antifraud Gateway** is a platform developed by the Braspag's Risk team to facilitate the integration of clients who wish to perform fraud analysis with different providers and with different technologies, ie, the Antifraud Gateway is responsible for performing the interconnection between the client that uses JSON in the messaging and the provider that uses XML in messaging, for example.

The API is based on REST architecture, which exchange data in JSON format following authorization flows defined by the OAuth 2 protocol, where all standards are widely used by the industry and supported by the technical communities.

> To learn more about OAuth 2, see [https://oauth.net/2/](https://oauth.net/2/)

The platform was built using one of Braspag's main products, the Cartão Protegido, for card tokenization and token fraud analysis.

# Objective

The purpose of this documentation is to guide the developer on how to integrate with Antifraud Gateway API, gateway of providers of antifraud solutions, describing the operations available with sample requests and responses.

To perform an operation, combine the base endpoint of the environment with the endpoint of the desired operation and send using the HTTP VERB as described in the operation.

# Hosts

## BraspagAuth API

|Environment|URL|
|:-|:-|
|`Sandbox`|https://authsandbox.braspag.com.br/|
|`Produção`|https://auth.braspag.com.br/|

## Antifraud Gateway API

|Environment|URL|
|:-|:-|
|`Sandbox`|https://risksandbox.braspag.com.br/|
|`Produção`|https://risk.braspag.com.br/|

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

## Analyzing a transaction in Cybersource

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
|`CartItem[n].Sku`|Product SKU|string|yes|255|
|`CartItem[n].Quantity`|Product quantity|int|yes|-|
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

# Tables

## Table 1 - Provider

|Value|
|:-|
|Cybersource|

## Table 3 - Card.Brand

|Valor|Provider|Observação|
|:-|:-|:-|
|Amex|Cybersource|-|
|Diners|Cybersource|-|
|Discover|Cybersource|-|
|JCB|Cybersource|-|
|Master|Cybersource|-|
|Dankort|Cybersource|-|
|Cartebleue|Cybersource|-|
|Maestro|Cybersource|-|
|Visa|Cybersource|-|
|Elo|Cybersource|-|
|Hipercard|Cybersource|Will be sent to Cybersource as Private Label|
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
|NextDay|Next day delivery|Cybersource|
|TwoDay|Two-day delivery|Cybersource|
|ThreeDay|Three day delivery|Cybersource|
|LowCost|Low cost delivery|Cybersource|
|Pickup|Store pickup|Cybersource|
|Other|Other delivery method|Cybersource|
|None|No delivery, as it is a service or subscription|Cybersource| 

## Table 8 - Airline.JourneyType

|Value|Description|Provider|
|:-|:-|:-|
|OneWayTrip|One way trip|Cybersource|
|RoundTrip|Round trip|Cybersource|

## Table 9 - Airline.Passengers[n].PassengerType

|Value|Description|Provider|
|:-|:-|:-|
|Adult|Adult|Cybersource|
|Child|Child|Cybersource|
|Infant|Infant|Cybersource|

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
|Accept|Transaction accepted after fraud analysis|Cybersource|
|Review|Transaction review after fraud analysis|Cybersource|
|Reject|Rejected Transaction after fraud analysis|Cybersource|
|Pendent|Transaction pending, when sending the same for analysis of fraud occurred a timeout in the response between Braspag and Cybersource|
|Unfinished|Transaction not finalized for some reason, contract validation or internal error <br/> A transaction analyzed in Cybersource, in the analysis response the `ProviderAnalysisResult.ProviderStatus` field is equal to **REJECT** and the `ProviderAnalysisResult.ProviderCode` other than **481**, the transaction status will be **Unfinished**|Cybersource|
|ProviderError|Transaction with provider error while being submitted for analysis|Cybersource|

## Table 21 - ProviderStatus

|Value|Description|Provider|From-To with the `Status` field (Transaction status in Antifraud Gateway Braspag)|
|:-|:-|:-|:-|
|ACCEPT|Accepted transaction at provider|Cybersource|Accept|
|REVIEW|Transaction review at provider|Cybersource|Review|
|REJECT|Rejected transaction at provider|Cybesource|Reject|
|ERROR|Transaction with provider error|Cybersource|ProviderError|

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

## Table 29 - ProviderAnalysisResult.AfsReply.PhoneInfoCode

|Value|Description|Provider|
|:-|:-|:-|
|MM-ACBST|Customer's phone number not consistent with billing address state|Cybersource|
|RISK-AC|Customer's area code associated with high risk|Cybersource|
|RISK-PH|U.S. or Canada phone number incomplete, or one or more parts of the number are risky|Cybersource|
|TF-AC|Phone number uses toll-free area code|Cybersource|
|UNV-AC|Invalid area code|Cybersource|
|UNV-OC|Invalid area code and/or phone prefix|Cybersource|
|UNV-PH|Invalid phone number|Cybersource|

## Table 30 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode

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

## Table 31 - ProviderAnalysisResult.AfsReply.VelocityInfoCode

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

## Table 32 - ProviderAnalysisResult.AfsReply.IpRoutingMethod

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
|T|Rule true|Cybersource|
|F|Rule false|Cybersource|
|N|The rule can not be evaluated because the data is insufficient|Cybersource|
|E|The rule can not be evaluated because an error has occurred|Cybersource|

## Table 37 - MerchantDefinedData (Cybersource)