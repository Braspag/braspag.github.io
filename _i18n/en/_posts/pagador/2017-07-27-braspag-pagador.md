---
layout: manual
title: API Rest Integration Guide
description: Gateway Braspag Technical Integration
search: true
translated: true
categories: manual
sort_order: 1
tags:
    - 1. Pagador
language_tabs:
  json: JSON
  shell: cURL
  
---

# Introduction to the Pagador API

The purpose of this documentation is to guide the developer on how to integrate with the Pagador API, Braspag's payment gateway, describing all available services using request and response examples

Below is the representation of a standard **transactional flow**, followed by a short description of the main parties involved:

![Fluxo Transacional](https://braspag.github.io/images/fluxo-transacional-en-menor.png)

* **E-commerce platform:** Provides technical solution for merchants to build all the infrastructure and processes needed for their e-commerce operation.
* **Gateway:** Connects e-commerces with payment services (acquirer, *boleto* bill, issuer), making it easier for the merchants to manage payment providers.
* **Acquirer:** Connects the transaction with the payment networks (brands) and settles the transaction for the merchants.
* **Card network (or brand):** Communicates with the issuer of the transaction card and settles the transaction for the acquirers.
* **Issuer:** Gives credit and stores the shopper's money. In the transaction, either approves or denies it for reasons of balance, card validity or fraud. Settles the transaction for the brand.

## Attributes of the Solution

The Pagador API solution (refer to [this article](https://suporte.braspag.com.br/hc/pt-br/articles/360013153791-O-que-%C3%A9-o-Pagador-){:target="_blank"} in Portuguese for more details) was developed with the market reference REST technology, which works regardless of the technology used by our customers. Therefore, it is possible to integrate using various programming languages, such as: *ASP*, *ASP.Net*, *Java*, *PHP*, *Ruby* and *Python*.

Here are some of the main benefits of using Braspag's e-commerce platform:

* **No proprietary apps**: no applications need to be installed in the online store environment.
* **Simplicity**: the protocol used is purely HTTPS.
* **Easy testing**: Braspag's platform offers a publicly accessible Sandbox environment that allows the developer to create a test account without the need for accreditation, making it easier and faster to start integrating.
* **Credentials**: the client's credentials (affiliation number and access key) are transmitted in the header of the HTTP request.
* **Security**: the information is always exchanged between the store server and Braspag, without the customer's browser.
* **Multiplatform integration**: the integration is performed through REST APIs, which allows the use of different applications.

## Integration Architecture

The model used in the integration of the APIs is simple. It is based in the use of two URLs:
* URL for transactions - specific for operations such as authorization, capture and cancellation of transactions.
* URL for queries - specific for consultation operations, such as a transaction search.

<br/>To perform an operation:

1. Combine the environment **base** URL with the desired operation **endpoint**. E.g.: https://api.braspag.com.br/*v2/sales/*.
2. Submit a request to that URL using the correct HTTP method.

|HTTP Method| Description|
|---|---|
|**GET**|Retrieves existing resources, e.g.: a transaction query.|
|**POST**|Creates new resources, e.g.: creating a transaction.|
|**PUT**|Updates existing resources, e.g.: capturing or canceling a previously authorized transaction.|

All operations require the access credentials **"Merchant ID"** and **"Merchant Key"** to be sent through the request header.<br>
Each request operation will return an [HTTP Status](https://braspag.github.io//en/manual/braspag-pagador#list-of-http-status-code) code, indicating whether it was successfully completed or not.

## Test and Production Environments

Use our **Sandbox** environment to test our products and services before bringing your solution into the **Production** environment.

<aside class="notice">Access credentials must be used to authenticate all requests made to the API endpoints.</aside>
<aside class="warning">For safety reasons, these credentials must not be unduly shared or exposed.</aside> 

### Sandbox Environment

Create an account in our sandbox and try out our APIs during your testing phase, with no commitment.

|Information|Description|
|----|----|
|Access credentials|`MerchantId` and `MerchantKey` received after your test account creation in [Sandbox Registration](https://cadastrosandbox.braspag.com.br/){:target="_blank"}.|
|Base URL for transactions|https://apisandbox.braspag.com.br/|
|Base URL for query services|https://apiquerysandbox.braspag.com.br/|

### Production Environment

Once you are done running your tests and ready for *go-live*, you can implement your solution in the production environment.

|Information|Description|
|---|---|
|Access credentials|`MerchantId` and `MerchantKey` provided by Braspag. Send us an email (*comercial@braspag.com.br*) for more information.|
|Base URL for transactions|https://api.braspag.com.br/|
|Base URL for query services|https://apiquery.braspag.com.br/|

## Transactional Terms

In order for you to better enjoy the features available in our API, it is important to first understand some of the concepts involved in the process of a credit card transaction:

|Step|Description|
|---|---|
|**Authorization**| Makes the process of a credit card sale possible. The authorization (also called pre-authorization) only earmarks the customer's fund, not yet releasing it from their account.|
|**Capture**| Moves the transaction out of the pending state, so that the charging can take effect. The time limit for capturing a pre-authorized transaction varies between acquirers, reaching up to 5 days after the pre-authorization date.
|**Automatic Capture**| **Authorizes** and **captures** the transaction at the same time, exempting the merchant from sending a confirmation.
|**Cancellation**| Cancels the sale on the same day of its authorization/capture. In case of an **authorized** transaction, the cancellation will release the limit of the card that has been earmarked. If the transaction has already been **captured**, the cancellation will undo the sale, but only if executed on the same day.
|**Refund**| Cancels de sale on the day after its capture. The transaction will be submitted to the chargeback process by the acquirer.

<aside class="warning">Reminder: An authorized transaction only generates credit to the merchant after being captured.</aside>

Some of the important features that we offer for your transactions are listed below:

|Term|Description|
|---|---|
|**Antifraude**| A feature which consists in a fraud prevention platform, that provides a detailed risk analysis of online purchases. The process is fully transparent to the cardholder. According to a pre-established criteria, the request can be automatically accepted, rejected or redirected for manual review. For further information, refer to the [Antifraude](https://braspag.github.io//en/manual/antifraude){:target="_blank"} integration guide.
|**Autenticação**| A process which allows the transaction to pass through the card issuing bank authentication process, bringing more security to the sale as it transfers the risk of fraud to the issuer. For further information, refer to the [3DS 2.0 Authentication](https://braspag.github.io//en/manualp/emv3ds){:target="_blank"} documentation. 
|**Cartão Protegido**| A platform that offers secure storage of sensitive credit card data. This data is transformed into an encrypted code called "token", which can be stored in a database. With this platform, the store is able to offer features such as "*1-Click Purchase*" and "*Transaction Submission Retry*", while preserving the integrity and confidentiality of that data. For further information, refer to the [Cartão Protegido](https://braspag.github.io//en/manual/cartao-protegido-api-rest){:target="_blank"} integration guide.

## Braspag Support Service

<aside class="notice">Braspag offers high availability support. You can contact us from 9AM to 7PM weekdays, through our 24 hour emergency call service or through our web-based tool. Our support team speaks Portuguese, English and Spanish.</aside>

You can access our web support tool here: [Zendesk](https://suporte.braspag.com.br/hc/en-us){:target="_blank"} and check our [Atendimento Braspag](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag){:target="_blank"} article, in Portuguese, for further information about our support service.

# Payment Methods

The Pagador API works with transactions made with the following payment methods: credit card, debit card, *boleto* bill, electronic transfer, e-wallet and voucher.

To prevent duplicate orders from occurring during a transaction, Pagador has the option of blocking duplicate orders which, when enabled, returns the "302" error code, informing that the `MerchantOrderId` sent is duplicated. For more details on the feature, you can refer to [this article](https://suporte.braspag.com.br/hc/pt-br/articles/360030183991){:target="_blank"}, in Portuguese.

## Credit and Debit Cards

### Creating a Credit Transaction

When requesting authorization for a credit transaction, it is necessary to follow the contract below. The details related to your affiliation are sent within the `Payment.Credentials` node, and must be sent whenever a new authorization request is submitted for approval.

If your store uses *Retry* or *Loadbalance* services, affiliations must be registered by the customer support team. To request the registration of affiliations, [click here](https://suporte.braspag.com.br/hc/en-us/requests/new){:target="_blank"} and send your request.

<aside class="warning">IMPORTANT: The order identification number (MerchantOrderId) does not change, remaining the same throughout the transactional flow. However, an additional number (SentOrderId) can be generated for the order and used during the transaction. This number (SentOrderId) will only be different in case of adaptation to the acquirer's rules or in case there are repeated order identification numbers (MerchantOrderId).</aside>

The parameters contained within the `Address` and `DeliveryAddress` nodes are **required** when the transaction is submitted to the [Antifraude](https://braspag.github.io//en/manual/antifraude){:target="_blank"} or **Velocity** analysis. These parameters are marked with an * in the required column of the table below.

> **Mastercard credit card transactions with stored credentials**: Mastercard brand requires the Transaction Initiator Indicator for credit and debit card transactions using stored card data. The goal is to indicate if the transaction was initiated by the cardholder or by the merchant. In this scenario, the node `InitiatedTransactionIndicator` must be sent with the parameters `Category` and `SubCategory` for Mastercard transactions, within the `Payment` node. Please check the complete list of categories in the `Category` parameter description and the subcategories tables in [Mastercard Transaction Initiator](https://braspag.github.io//en/manual/braspag-pagador#mastercard-transaction-initiator).

Here are request and response examples on how to create a credit transaction:

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
   "MerchantOrderId":"2017051002",
   "Customer":{
      "Name":"Shopper Name",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email": "shopper@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Address":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Message",
      "DoSplit":false,
      "CreditCard":{
         "CardNumber":"4551870000000181",
         "Holder": "Cardholder Name",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false",
         "Alias":"",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
      },
      "InitiatedTransactionIndicator": {
          "Category": "C1",
          "Subcategory": "Standingorder"
},
      "Credentials":{
         "code":"9999999",
         "key":"D8888888",
         "password":"LOJA9999999",
         "username":"#Braspag2018@NOMEDALOJA#",
         "signature":"001"
      },
      "ExtraDataCollection":[
         {
            "Name":"FieldName",
            "Value":"FieldValue"
         }
      ]
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId":"2017051002",
   "Customer":{
      "Name": "shopper Name",
      "Identity": "12345678909",
      "IdentityType": "CPF",
      "Email": "shopper@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Address":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Message",
      "DoSplit":false,
      "CreditCard":{
         "CardNumber":"455187******0181",
         "Holder": "Cardholder Name",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false",
         "Alias":"",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
      },
      "InitiatedTransactionIndicator": {
          "Category": "C1",
          "Subcategory": "Standingorder"
},
      "Credentials":{
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
      },
      "ExtraDataCollection":[
         {
            "Name":"FieldName",
            "Value":"FieldValue"
         }
      ]
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Store identifier at Braspag.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication at Braspag.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`MerchantOrderId`|Order ID number.|Text|50|Yes|
|`Customer.Name`|Customer's name.|Text|255|Yes|
|`Customer.Identity`|Customer's ID number.|Text|14|No|
|`Customer.IdentityType`|Customer's ID document type (CPF or CNPJ).|Text|255|No|
|`Customer.Email`|Customer's email address.|Text|255|No|
|`Customer.Birthdate`|Customer's date of birth in the YYYY-MM-DD format.|Date|10|No|
|`Customer.IpAddress`|Customer's IP address. IPv4 and IPv6 support.|Text|45|No|
|`Customer.Address.Street`|Customer's address street.|Text|255|No*|
|`Customer.Address.Number`|Customer's contact address number.|Text|15|No*|
|`Customer.Address.Complement`|Customer's contact address additional information.|Text|50|No*|
|`Customer.Address.ZipCode`|Customer's contact address zip code.|Text|9|No*|
|`Customer.Address.City`|Customer's contact address city.|Text|50|No*|
|`Customer.Address.State`|Customer's contact address state.|Text|2|No*|
|`Customer.Address.Country`|Customer's contact address country.|Text|35|No*|
|`Customer.Address.District`|Customer's neighborhood.|Text|50|No*|
|`Customer.DeliveryAddress.Street`|Delivery address street.|Text|255|No*|
|`Customer.DeliveryAddress.Number`|Delivery address number.|Text|15|No*|
|`Customer.DeliveryAddress.Complement`|Delivery address additional information.|Text|50|No*|
|`Customer.DeliveryAddress.ZipCode`|Delivery address zip code.|Text|9|No*|
|`Customer.DeliveryAddress.City`|Delivery address city.|Text|50|No*|
|`Customer.DeliveryAddress.State`|Delivery address state.|Text|2|No*|
|`Customer.DeliveryAddress.Country`|Delivery address country.|Text|35|No*|
|`Customer.DeliveryAddress.District`|Delivery address neighborhood.|Text|50|No*|
|`Payment.Provider`|Name of payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type.|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.ServiceTaxAmount`|Applicable for airlines only. Value of the amount of the authorization to be allocated to the service charge. Note: This value is not added to the authorization value.|Number|15|No|
|`Payment.Currency`|Currency in which the payment will be made (BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP).|Text|3|No|
|`Payment.Country`|Country in which the payment will be made.|Text|3|No|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.Interest`|Installment type - Store ("ByMerchant") or Issuer ("ByIssuer").|Text|10|No|
|`Payment.Capture`|Indicates whether the authorization will use automatic capture ("true") or not ("false"). Please check with acquirer about the availability of this feature.|Boolean|---|No (default "false")|
|`Payment.Authenticate`|Indicates whether the transaction will be authenticated ("true") or not ("false"). Please check with acquirer about the availability of this feature.|Boolean|---|No (default "false")|
|`Payment.Recurrent`|Indicates whether the transaction is of recurring type ("true") or not ("false"). The "true" value will not set a new recurrence, it will only allow the execution of a transaction without the need to send CVV. `Authenticate` must be "false" when `Recurrent` is "true". **For Cielo, Cielo 30 and Rede2 transactions only.** |Boolean|---|No (default "false")|
|`Payment.SoftDescriptor`|Text to be printed on bearer's invoice.|Text|13|No|
|`Payment.DoSplit`|Indicates whether the transaction will be split between multiple accounts ("true") or not ("false").|Boolean|---|No (default "false")|
|`Payment.ExtraDataCollection.Name`|Name of the extra data field.|Text|50|No|
|`Payment.ExtraDataCollection.Value`|Value of the extra data field.|Text|1024|No|
|`Payment.Credentials.Code`|Affiliation generated by acquirer.|Text|100|Yes|
|`Payment.Credentials.Key`|Affiliation key/token generated by acquirer.|Text|100|Yes|
|`Payment.Credentials.Username`|Username generated on credential process with the **Getnet** acquirer (field must be submitted if transaction is directed to Getnet).|Text|50|No|
|`Payment.Credentials.Password`|Password generated on credential process with the **Getnet** acquirer (field must be submitted if transaction is directed to Getnet).|Text|50|No|
|`Payment.Credentials.Signature`|Submission of the *TerminalID* for Global Payments (applicable to merchants affiliated with this acquirer). E.g.: "001". For **Safra**, send establishment name, city and state concatenated with a semicolon (;), e.g.: “EstablishmentName;SaoPaulo;SP”.|Text|3|No|
|`Payment.PaymentFacilitator.EstablishmentCode`|Facilitator establishment code. “Facilitator ID” (Facilitator register with card network).<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Number|11|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.EstablishmentCode`|Sub-merchant's establishment code. “Sub-Merchant ID” (Sub-accredited register with facilitator).<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Number|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.Mcc`|Sub-merchant's MCC.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Number|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.Address`|Sub-merchant's address.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Text|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.City`|Sub-merchant's city.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Text|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.State`|Sub-merchant's state.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Text|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.PostalCode`|Sub-merchant's postal code.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Text|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.PhoneNumber`|Sub-merchant's telephone number.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Text|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.Identity`|Sub-merchant's CNPJ or CPF.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Text|15|Yes for facilitators|
|`Payment.PaymentFacilitator.SubEstablishment.CountryCode`|Sub-merchant's country code based on ISO 3166.<br><br>**Applicable to `Provider` Cielo30 or Rede2.**|Text|15|Yes for facilitators|
|`Payment.CreditCard.CardNumber`|Customer's card number.|Text|19|Yes|
|`Payment.CreditCard.Holder`|Name of cardholder printed on the card.|Text|25|Yes|
|`Payment.CreditCard.ExpirationDate`|Expiration date printed on the card.|Text|7|Yes|
|`Payment.CreditCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`Payment.CreditCard.Brand`|Card brand.|Text|10|Yes|
|`Payment.CreditCard.SaveCard`|Indicates whether the card will be saved to generate the token (*CardToken*).|Boolean|---|No (default "false")|
|`Payment.CreditCard.Alias`|Name given by merchant to card saved as *CardToken*.|Text|64|No|
|`Payment.CreditCard.CardOnFile.Usage`|"First" if the card has been stored and it is your first use.<br>"Used" if the card has been stored and it has been used previously in another transaction.<br><br>**Applicable to `Provider` Cielo only.**|Text|-|No|
|`Payment.CreditCard.CardOnFile.Reason`|Indicates the purpose of the card storage, in case the `Usage` field is "Used".<br><br>"Recurring" - Scheduled recurring purchase (e.g.: subscription services).<br>"Unscheduled" - Unscheduled recurring purchase (e.g.: services apps).<br>"Installments" - Installment through recurrence. <br><br> **Applicable to `Provider` Cielo only.**|Text|-|Conditional|

#### Response

```json
{
"MerchantOrderId":"2017051002",
    "Customer":{
        "Name":"Shopper Name",
        "Identity":"12345678909",
        "IdentityType":"CPF",
        "Email": "shopper@braspag.com.br",
        "Birthdate":"1991-01-02",
        "Address":{
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27th floor",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
        },
        "DeliveryAddress":{
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27th floor",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "DoSplit":false,
        "CreditCard":{
            "CardNumber": "455187******0181",
            "Holder": "Cardholder Name",
            "ExpirationDate":"12/2021",
            "SaveCard":"false",
            "Brand":"Visa",
            "Alias": "",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
        },
      "InitiatedTransactionIndicator": {
          "Category": "C1",
          "Subcategory": "Standingorder"
},
        "Credentials":{
            "Code":"9999999",
            "Key":"D8888888",
            "Password":"LOJA9999999",
            "Username":"#Braspag2018@NOMEDALOJA#"
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor":"Message",
        "VelocityAnalysis": {
            "Id": "c374099e-c474-4916-9f5c-f2598fec2925",
            "ResultMessage": "Accept",
            "Score": 0
        },
        "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
        "Type":"CreditCard",
        "Amount":10000,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider":"Simulado",
        "ExtraDataCollection": [{
            "Name":"FieldName",
            "Value":"FieldValue"
        }],
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [{
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"
            }
        ]
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
"MerchantOrderId":"2017051002",
    "Customer":{
        "Name":"Shopper Name",
        "Identity":"12345678909",
        "IdentityType":"CPF",
        "Email": "shopper@braspag.com.br",
        "Birthdate":"1991-01-02",
        "Address":{
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27th floor",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
        },
        "DeliveryAddress":{
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27th floor",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
    },
    "Payment":{
        "ServiceTaxAmount": 0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "DoSplit":false,
        "CreditCard":{
            "CardNumber": "455187******0181",
            "Holder": "Cardholder Name",
            "ExpirationDate":"12/2021",
            "SaveCard":"false",
            "Brand":"Visa",
            "Alias": "",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
        },
      "InitiatedTransactionIndicator": {
          "Category": "C1",
          "Subcategory": "Standingorder"
},
        "Credentials":{
            "code":"9999999",
            "key":"D8888888",
            "password":"LOJA9999999",
            "username":"#Braspag2018@NOMEDALOJA#",
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor":"Message",
        "VelocityAnalysis": {
            "Id": "c374099e-c474-4916-9f5c-f2598fec2925",
            "ResultMessage": "Accept",
            "Score": 0
        },
        "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
        "Type":"CreditCard",
        "Amount":10000,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider":"Simulado",
        "ExtraDataCollection": [{
            "Name":"FieldName",
            "Value":"FieldValue"
        }],
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [{
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"
            }
        ]
    }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Transaction ID at payment provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale reference.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code from the acquirer.|Text|300|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`CapturedDate`|Date the transaction was captured. |Text|19|YYYY-MM-DD HH:mm:SS|
|`CapturedAmount`|Captured amount in cents.|Number|15|100 equivalent to R$ 1,00|
|`ECI`|Electronic Commerce Indicator. Represents the authentication result.|Text|2|E.g.: 5|
|`ReasonCode`|Return code from operation.|Text|32|Alphanumeric|
|`ReasonMessage`|Return message from operation.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|

### Creating a Debit Transaction

A debit card transaction is carried out in the same way as a credit card transaction. It is mandatory, however, to submit it to the authentication process.

All debit transactions must be authenticated as required by the issuing banks and brands, in order to promote greater security. To authenticate a debit transaction, we use the [EMV 3DS 2.0](https://www.emvco.com/emv-technologies/3-d-secure/){:target="_blank"} protocol. This protocol is a script integrated into the e-commerce website that verifies the identity of the cardholder while maintaining a good shopping experience and reducing the risk of fraud.

To integrate the authentication method, check the [3DS 2.0](https://braspag.github.io//en/manualp/emv3ds){:target="_blank"} documentation.

See below the representation of a standard **transactional flow** in the creation of a debit transaction, with the authentication and authorization steps:
![3DS 2.0 Flow]({{ site.baseurl_root }}/images/fluxo3ds-en.png)

> **Mastercard debit card transactions with stored credentials**: Mastercard brand requires the Transaction Initiator Indicator for credit and debit card transactions using stored card data. The goal is to indicate whether the transaction was initiated by the cardholder or by the merchant. In this scenario, the node `InitiatedTransactionIndicator` must be sent with the parameters `Category` and `SubCategory` for Mastercard transactions, within the `Payment` node. Please check the complete list of categories in the `Category` parameter description and the subcategories tables in [Mastercard Transaction Initiator](https://braspag.github.io//en/manual/braspag-pagador#mastercard-transaction-initiator).

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
   "MerchantOrderId":"202301131052",
   "Customer":{
      "Name":"Nome do Comprador",
      "Identity":"12345678900",
      "IdentityType":"CPF",
      "Email":"comprador@email.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "DebitCard":{
         "CardNumber":"************1106",
         "Holder":"NOME DO TITULAR DO CARTÃO",
         "ExpirationDate":"12/2030",
         "SaveCard":false,
         "Brand":"Master"      },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"https://braspag.com.br",
      "ProofOfSale":"20230113",
      "AcquirerTransactionId":"0510053219433",
      "AuthorizationCode":"936403",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"5",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
]}
      "InitiatedTransactionIndicator": {
          "Category": "C1",
          "Subcategory": "Standingorder"
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--header "MerchantKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--data-binary
--verbose
{
   "MerchantOrderId":"202301131052",
   "Customer":{
      "Name":"Nome do Comprador",
      "Identity":"12345678900",
      "IdentityType":"CPF",
      "Email":"comprador@email.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "DebitCard":{
         "CardNumber":"************1106",
         "Holder":"NOME DO TITULAR DO CARTÃO",
         "ExpirationDate":"12/2030",
         "SaveCard":false,
         "Brand":"Master"      },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"https://braspag.com.br",
      "ProofOfSale":"20230113",
      "AcquirerTransactionId":"0510053219433",
      "AuthorizationCode":"936403",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"5",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
      ]}
      "InitiatedTransactionIndicator": {
          "Category": "C1",
          "Subcategory": "Standingorder"
   }
}
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type. In this case, "DebitCard".|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.ReturnUrl`|URL to which the user will be redirected at the end of the payment.|Text|1024|Yes|
|`Payment.DebitCard.CardNumber`|Customer's card number.|Text|16|Yes|
|`Payment.DebitCard.Holder`|Name of the cardholder printed on the card.|Text|25|Yes|
|`Payment.DebitCard.ExpirationDate`|Expiration date printed on the card, in the MM/YYYY format.|Text|7|Yes|
|`Payment.DebitCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`Payment.DebitCard.Brand`|Card brand.|Text|10|Yes|
|`Payment.DebitCard.CardOnFile.Usage`|"First" if the card has been stored and it is your first use.<br>"Used" if the card has been stored and it has been used previously in another transaction.<br><br>**Applicable to `Provider` Cielo only.**|Text|-|No|
|`Payment.DebitCard.CardOnFile.Reason`|Indicates the purpose of the card storage, in case the `Usage` field is "Used".<br><br>"Recurring" - Scheduled recurring purchase (e.g.: subscription services).<br>"Unscheduled" - Unscheduled recurring purchase (e.g.: services apps).<br>"Installments" - Installment through recurrence. <br><br> **Applicable to `Provider` Cielo only.**|Text|-|Conditional|
|`Payment.Authenticate` | Defines whether the buyer will be directed to the issuer for card authentication. | Boolean ("true" / "false") | - | Yes, if the authentication is validated.|
|`Payment.ExternalAuthentication.ReturnUrl` | Callback URL only applicable if version is "1". | Alphanumeric | 1024 | Yes. |
|`Payment.ExternalAuthentication.Cavv` | Signature returned in authentication success scenarios. | Text | 28 | Yes, if authentication is validated. |
|`Payment.ExternalAuthentication.Xid` | XID returned in the authentication process. | Text | 28 | Yes, when the 3DS version is "1".|
|`Payment.ExternalAuthentication.Eci` | *Electronic Commerce Indicator* returned in the authentication process. | Number | 1 | Yes. |
|`Payment.ExternalAuthentication.Version` | 3DS version used in the authentication process. | Alphanumeric | 1 position | Yes, when the 3DS version is "2".|
|`Payment.ExternalAuthentication.ReferenceId` | RequestID returned in the authentication process. | GUID | 36 | Yes, when the 3DS version is "2". |
|`Payment.InitiatedTransactionIndicator.Category`|Transaction Initiator Indicator category. *Valid only for Mastercard*.<br>Possible values:<br>- “C1”: transaction initiated by the cardholder;<br>- “M1”: recurring payment or installment initiated by the merchant<br>- “M2”: transaction initiated by the merchant.|string|2|Conditional. Required only for Mastercard.|
|`Payment.InitiatedTransactionIndicator.Subcategory`|Indicator subcategory. Valid only for Mastercard brand.<br>Possible values:<br>If `InitiatedTransactionIndicator.Category` = "C1" or "M1"<br>*CredentialsOnFile*<br>*StandingOrder*<br>*Subscription*<br> *Installment*<br>If `InitiatedTransactionIndicator.Category` = "M2"<br>*PartialShipment*<br>*RelatedOrDelayedCharge*<br>*NoShow*<br>*Resubmission*<br>Please refer to [Mastercard Transaction Initiator](https://braspag.github.io//en/manual/braspag-pagador#mastercard-transaction-initiator) tables for the full list.|string|-|Conditional. Required only for Mastercard.|

#### Response

```json
{
    "MerchantOrderId": "2017051002",
    "Customer": {
       "Name": "Nome do Comprador",
       "Identity": "12345678909",
       "IdentityType": "CPF",
       "Email": "comprador@braspag.com.br",
       "Birthdate": "1991-01-02",
       "Address": {
          "Street": "Alameda Xingu",
          "Number": "512",
          "Complement": "27 andar",
          "ZipCode": "12345987",
          "City": "São Paulo",
          "State": "SP",
          "Country": "BRA",
          "District": "Alphaville"
       },
       "DeliveryAddress": {
          "Street": "Alameda Xingu",
          "Number": "512",
          "Complement": "27 andar",
          "ZipCode": "12345987",
          "City": "São Paulo",
          "State": "SP",
          "Country": "BRA",
          "District": "Alphaville"
    },
    "Payment": {
       "DebitCard": {
          "CardNumber": "455187******0181",
          "Holder": "NOME DO TITULAR DO CARTÃO",
          "ExpirationDate": "12/2031",
          "SaveCard": false,
          "Brand": "Visa"     },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"http://www.braspag.com.br",
      "ProofOfSale":"20230115053219433",
      "AcquirerTransactionId":"10069930690009D366FA",
      "AuthorizationCode":"936403",
      "SentOrderId":"10045146",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"02",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "PaymentId":"21423fa4-6bcf-448a-97e0-e683fa2581b",
      "Type":"DebitCard",
      "Amount":10000,
      "ReceivedDate":"2023-01-09 16:24:14",
      "CapturedAmount":10000,
      "CapturedDate":"2023-01-09 16:24:15",
      "Currency":"BRL",
      "Country":"BRA",
      "Provider":"Cielo",
      "ExtraDataCollection":[
         {
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"         }
      ],
      "ReasonCode":0,
      "ReasonMessage":"Successful",
      "Status":2,
      "ProviderReturnCode":"00",
      "ProviderReturnMessage":"Successful",
      "Links":[
         {
            "Method":"GET",
            "Rel":"self",
            "Href":"https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"         },
         {
            "Method":"PUT",
            "Rel":"void",
            "Href":"https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"         }
      ]
   }
}
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantOrderId": "2017051002",
    "Customer": {
       "Name": "Nome do Comprador",
       "Identity": "12345678909",
       "IdentityType": "CPF",
       "Email": "comprador@braspag.com.br",
       "Birthdate": "1991-01-02",
       "Address": {
          "Street": "Alameda Xingu",
          "Number": "512",
          "Complement": "27 andar",
          "ZipCode": "12345987",
          "City": "São Paulo",
          "State": "SP",
          "Country": "BRA",
          "District": "Alphaville"
       },
       "DeliveryAddress": {
          "Street": "Alameda Xingu",
          "Number": "512",
          "Complement": "27 andar",
          "ZipCode": "12345987",
          "City": "São Paulo",
          "State": "SP",
          "Country": "BRA",
          "District": "Alphaville"
    },
    "Payment": {
       "DebitCard": {
          "CardNumber": "455187******0181",
          "Holder": "NOME DO TITULAR DO CARTÃO",
          "ExpirationDate": "12/2031",
          "SaveCard": false,
          "Brand": "Visa"     },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"http://www.braspag.com.br",
      "ProofOfSale":"20230115053219433",
      "AcquirerTransactionId":"10069930690009D366FA",
      "AuthorizationCode":"936403",
      "SentOrderId":"10045146",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"02",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "PaymentId":"21423fa4-6bcf-448a-97e0-e683fa2581b",
      "Type":"DebitCard",
      "Amount":10000,
      "ReceivedDate":"2023-01-09 16:24:14",
      "CapturedAmount":10000,
      "CapturedDate":"2023-01-09 16:24:15",
      "Currency":"BRL",
      "Country":"BRA",
      "Provider":"Cielo",
      "ExtraDataCollection":[
         {
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"         }
      ],
      "ReasonCode":0,
      "ReasonMessage":"Successful",
      "Status":2,
      "ProviderReturnCode":"00",
      "ProviderReturnMessage":"Successful",
      "Links":[
         {
            "Method":"GET",
            "Rel":"self",
            "Href":"https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"         },
         {
            "Method":"PUT",
            "Rel":"void",
            "Href":"https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"         }
      ]
   }
}
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale reference.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code from the acquirer.|Text|300|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction Status.|Byte|2|E.g.: 1|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|
|`Payment.MerchantAdviceCode` | Flag return code that defines period for retry. *Valid for Mastercard*.|Text| 2 | Numeric|
|`Payment.ExternalAuthentication.Cavv` | Cavv value submitted in the authorization request. | Text | 28 | kBMaEAEAbV3FcwnExrXh4phhmpIj |
|`Payment.ExternalAuthentication.Xid` | Xid value submitted in the authorization request. | Text | 28 | ZGUzNzgwYzQxM2ZlMWMxMzVkMjc= |
|`Payment.ExternalAuthentication.Eci` | ECI value submitted in the authorization request. | Number | 1 | Ex. 5 |
|`Payment.ExternalAuthentication.Version` | 3DS version used in the authentication process. | Alphanumeric | 1 | Ex: 2 |
|`Payment.ExternalAuthentication.ReferenceId`| RequestID returned in the authentication process. | GUID | 36 | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |

### Creating a Debit Transaction with no Authentication

It is possible to process a debit card without having to submit your customer to the authentication process. You will find more details in the [Débito sem Senha](https://suporte.braspag.com.br/hc/pt-br/articles/360013285531){:target="_blank"} article, written in Portuguese.<br>That is the case with the "Coronavoucher" emergency aid, provided by the government, which can be consumed through the *Caixa Econômica Federal* virtual debit card. In such case, the request must follow the Debit Card pattern, only with **no authentication**, according to the example below.

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
      "Payment": {
         "Provider": "Cielo30",
         "Type": "DebitCard",
         "Amount": 10000,
         "Currency": "BRL",
         "Country": "BRA",
         "Installments": 1,
         "Capture": true,
         "Authenticate": false,
         "DebitCard":{
            "CardNumber":"5067220000000001",
            "Holder":"Nome do Portador",
            "ExpirationDate":"12/2021",
            "SecurityCode":"123",
            "Brand":"Elo"
            "CardOnFile":{
              "Usage":"Used",
              "Reason":"Unscheduled"
        },
        [...]
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Cielo30",
      "Type": "DebitCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Capture": true,
      "Authenticate": false,
      "DebitCard":{
         "CardNumber":"5067220000000001",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Elo"
         "CardOnFile":{
            "Usage":"Used",
            "Reason":"Unscheduled"
      },
      [...]
   }
}
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of payment method provider. **Applicable to "Cielo30" only.**|Text|15|Yes|
|`Payment.Type`|Payment method type. In this case, "DebitCard".|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments. For this type, always use "1".|Number|2|Yes|
|`DeditCard.CardNumber`|Customer's card number.|Text|16|Yes|
|`DeditCard.Holder`|Name of cardholder printed on the card.|Text|25|Yes|
|`DebitCard.ExpirationDate`|Expiration date printed on the card, in the MM/YYYY format.|Text|7|Yes|
|`DebitCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`DebitCard.Brand`|Card brand. For this type, always use "Elo".|Text|10|Yes|
|`DebitCard.CardOnFile.Usage`|"First" if the card has been stored and it is your first use.<br>"Used" if the card has been stored and it has been used previously in another transaction.<br><br>**Applicable to `Provider` Cielo only.**|Text|-|No|
|`DebitCard.CardOnFile.Reason`|Indicates the purpose of the card storage, in case the `Usage` field is "Used".<br><br>"Recurring" - Scheduled recurring purchase (e.g.: subscription services).<br>"Unscheduled" - Unscheduled recurring purchase (e.g.: services apps).<br>"Installments" - Installment through recurrence. <br><br> **Applicable to `Provider` Cielo only.**|Text|-|Conditional|

#### Response

```json
{
 [...]
  "Payment": {
    "DebitCard": {
      "CardNumber": "506722******0001",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Elo"
      "CardOnFile":{
        "Usage":"Used",
        "Reason":"Unscheduled"
    },
    "AcquirerTransactionId": "10069930690009D366FA",
    "PaymentId": "21423fa4-6bcf-448a-97e0-e683fa2581ba",
    "Type": "DebitCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:19:58",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo30",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 2,
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
 [...]
  "Payment": {
    "DebitCard": {
      "CardNumber": "506722******0001",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Elo"
      "CardOnFile":{
         "Usage":"Used",
         "Reason":"Unscheduled"
    },
    "AcquirerTransactionId": "10069930690009D366FA",
    "PaymentId": "21423fa4-6bcf-448a-97e0-e683fa2581ba",
    "Type": "DebitCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:19:58",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo30",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 2,
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale reference.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code from the acquirer.|Text|300|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|

### 3D Secure Authentication

With the authentication process, it is possible to carry out a risk analysis considering a greater amount of user and seller data, thus helping in the online purchase validation process. When validated correctly, the risk of *chargeback* (disputing a purchase made by credit or debit card) of the transaction is passed on to the issuer; that is, the merchant will not receive disputes.

The most current authenticator standard is [3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"}, and the 3DS 1.0 version has been discontinued.

<aside class="notice">The 3DS 2.0 standard is also suitable for the mobile environment.</aside>

In addition to being compatible with different types of devices (desktop, tablet or smartphone), the [3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"} version has features that provide a better online shopping experience for your customer.

During the transaction flow, the authorization step can be performed separately or together with authentication. To learn more about the second flow, check out the documentation for [Authorization with Authentication](https://braspag.github.io/manual/autorizacao-com-autenticacao#autoriza%C3%A7%C3%A3o-com-autentica%C3 %A7%C3%A3o){:target="_blank"} from 3DS 2.0.

### Mastercard Transaction Initiator

The following tables apply to Mastercard credit and debit transactions with stored credentials. The objective is to identify whether the transaction was initiated by the **cardholder** or by the **e-commerce**:

* **Cardholder-Initiated Transaction (CIT)**: the transaction is initiated by the cardholder, who provides their payment credentials and allows them to be stored.
* **Merchant-Initiated Transaction (MIT)**: the transaction is initiated by the merchant, after an agreement in which the cardholder authorizes the merchant to save and use the account data to initiate one or more transactions in the future (such as recurrent payments or installments, and charges commonly applied by the tourism and hospitality sector).
<br/>

The transaction initiator indicator must be sent in the node `Payment.InitiatedTransactionIndicator`, within parameters `Category` and `Subcategory`. Please refer to the following request example and tables for more information:

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
   "Payment":{
     (...)
    "InitiatedTransactionIndicator": {
        "Category": "C1",
        "Subcategory": "Standingorder"
    },
    (...)
   }
```

```shell
   "Payment":{
     (...)
    "InitiatedTransactionIndicator": {
        "Category": "C1",
        "Subcategory": "Standingorder"
    },
    (...)
   }
```

> For the full request example see [Creating a credit card transaction](https://braspag.github.io//en/manual/braspag-pagador#creating-a-credit-transaction) or [Creating a debit transaction](https://braspag.github.io//en/manual/braspag-pagador#creating-a-debit-transaction).

| Property   | Description | Type   | Size | Required |
|---|---|---|---|---|
|`Payment.InitiatedTransactionIndicator.Category`|Transaction Initiator Indicator category. *Valid only for Mastercard*.<br>Possible values:<br>- “C1”: transaction initiated by the cardholder;<br>- “M1”: recurring payment or installment initiated by the merchant<br>- “M2”: transaction initiated by the merchant.|string|2|Conditional. Required only for Mastercard.|
|`Payment.InitiatedTransactionIndicator.Subcategory`|Indicator subcategory. Valid only for Mastercard brand.<br>Possible values:<br>If `InitiatedTransactionIndicator.Category` = "C1" or "M1"<br>*CredentialsOnFile*<br>*StandingOrder*<br>*Subscription*<br> *Installment*<br>If `InitiatedTransactionIndicator.Category` = "M2"<br>*PartialShipment*<br>*RelatedOrDelayedCharge*<br>*NoShow*<br>*Resubmission*<br>Please refer to the tables below for the full list.|string|-|Conditional. Required only for Mastercard.|

#### Response

The response will be the default response for the credit or debit transaction, returning the node `Payment.InitiatedTransactionIndicator` as sent in the request.

**Category C1 - transaction initiated by the cardholder**

`Payment.InitiatedTransactionIndicator.Category` = "C1"

|Indicator subcategory|Meaning|Description/Example|
|---|---|---|
|`CredentialsOnFile`| Saves card credentials for future purchases. | The shopper initiates the purchase and the merchant asks for the shopper to save card data for future purchases initiated by the cardholder.|
|`StandingOrder`| Saves card credentials for recurrent purchases of variable amount and fixed frequency. | Initial transaction to store card data for utility bills monthly payments.|
|`Subscription` | Saves card credentials for recurrent purchases of fixed amount and fixed frequency.|Initial transaction to store card data for a monthly subscription (e.g .newspapers and magazines).|
|`Installment` | Saves card data for installment buying. | Initial transaction to store card data for installment buying |

**Category M1 - recurring payment or installment initiated by the merchant**

`Payment.InitiatedTransactionIndicator.Category` = "M1"

In this category, the transaction is completed after an agreement between merchant and cardholder, in which the cardholder authorizes the merchant to store and use cardholder account credentials to initiate one or more transactions in the future, according to the subcategory:

|Indicator subcategory|Meaning|Description/Example|
|---|---|---|
|`CredentialsOnFile`| Saves card data for future purchases initiated by the merchant, with fixed or variable amount and no fixed interval or scheduled date|E.g.: the shopper agrees with transactions for toll charges when the balance in their account is below a certain amount (auto-recharge)|
|`StandingOrder` | Saves card data for future purchases initiated by the merchant, with variable amount and fixed frequency. | E.g., utility bills monthy payments.|
|`Subscription`| Saves card data for future purchases initiated by the merchant, with fixed amount and fixed frequency. | E.g., monthly subscription or fixed monthly service payment.|
|`Installment` | Saves card data for future purchases initiated by the merchant, with known amount and defined period. | E.g.: the shopper buys a TV for $600 and chooses to pay in three $200 installments; in this situation, the first transaction is initiated by the cardholder and the following two transactions are initiated by the merchant.|

**Category M2 - merchant-initiated transaction per industry practice**

`Payment.InitiatedTransactionIndicator.Category` = "M2"

|Indicator subcategory|Meaning|Description|
|---|---|---|
| `PartialShipment` | Saves card data for future purchases initiated by the merchant, when the order will be delivered in more than one shipping. | Partial shipment may occur when the amount of purchased goods in the e-commerce is not available for shipping in the time of purchase. Each shipping is a separate transaction.|
|`RelatedOrDelayedCharge` | Saves card data for future purchases initiated by the merchant for additional expenses. | Additional charge after providing initial services and processing the payment. E.g., hotel minibar fridge charges after cardholder check-out.|
|`NoShow`| Saves card data for future purchases initiated by the merchant for fine charges. | A fine charged according to the merchant cancellation policy. E.g.: the cancellation of a reservation by the cardholder without adequate prior notice to the establishment.|
| `Resubmission` | Saves card data for retrying previously denied transactions.| The previous attempt to submit a transaction was denied, but the issuer response does not prohibit the merchant to retry. E.g.: insufficient funds/response above credit limit.|

> **Important**: Card data is stored in encrypted form.

### Capturing a Transaction

When a transaction is submitted with the `Payment.Capture` parameter as "false", there is the need of a later request for capturing the transaction, in order for it to be confirmed.

An authorization that is not captured by the deadline is automatically released by the acquirer. Merchants may have specific negotiations with the acquirers to change their capturing deadline. For further information about capture deadlines and refund, you can refer to [this article](https://suporte.braspag.com.br/hc/pt-br/articles/360028661812){:target="_blank"}, in Portuguese.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/capture?amount=xxx&serviceTaxAmount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Store identifier in the API.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in the API.|Text 40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`PaymentId`|Order identifier field.|GUID|36|Yes (through endpoint)|
|`Amount`|Amount to be captured, in cents. The support for partial capture must be verified with the acquirer.|Number|15|No|
|`ServiceTaxAmount`|Applicable to airlines. Amount of the authorization to be allocated to the service charge. Note: This value is not added to the authorization value.|Number|15|No|

#### Response

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/void"
        }
    ]
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/void"
        }
    ]
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ReasonCode`|Acquirer return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Acquirer return message.|Text|512|Alphanumeric|

### Canceling/Refunding a Transaction

The availability of the refunding service varies depending on the acquirer. Each acquirer has its own deadlines to allow the refund of a transaction. In [this article](https://suporte.braspag.com.br/hc/pt-br/articles/360028661812){:target="_blank"}, written in Portuguese, you can check each of them.

To cancel a credit card transaction, you must send an HTTP message through the PUT method to the *Payment* resource, as in the example:

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/void?amount=xxx</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/void?amount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Store identifier in the API.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in the API.|Text|40|Sim (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`PaymentId`|Order identifier field.|GUID|36|Yes (through endpoint)|
|`Amount`|Amount to be canceled/refunded, in cents. **Note**: 1. Check if your acquirer supports the cancelling or refunding of operations.<br>2. If the value for `Amount` is "0" (zero), or if `Amount` is not sent, the refund will consider the total captured amount.|Number|15|No (through endpoint)|

#### Response

```json
{
    "Status": 10,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "9",
    "ProviderReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        }
    ]
}
```

```shell
{
    "Status": 10,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "9",
    "ProviderReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        }
    ]
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ReturnCode`|Acquirer's return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Acquirer's return message.|Text|512|Alphanumeric|

### Analyzing with Velocity Check

*Velocity Check* is a fraud-fighting tool that prevents massive bursts of transactions with repeated payment data. It analyzes the frequency of traceability elements such as Card Number, Social Security Number, Zip Code, among others, and blocks suspicious transactions.

The functionality must be contracted separately and then enabled in your store via dashboard. When Velocity is active, the transaction response brings in the `Velocity` node, with details of the analysis.

In case of a Velocity rule rejection, *ProviderReasonCode* will be "BP 171 - Rejected by fraud risk" (Velocity, with "ReasonCode 16 - AbortedByFraud").

#### Response

```json
{
    [...]
    "VelocityAnalysis": {
        "Id": "2d5e0463-47be-4964-b8ac-622a16a2b6c4",
        "ResultMessage": "Reject",
        "Score": 100,
        "RejectReasons": [
        {
            "RuleId": 49,
            "Message": "Blocked by the CardNumber rule. Name: Maximum 3 Card Hits in 1 day. HitsQuantity: 3. HitsTimeRangeInSeconds: 1440. ExpirationBlockTimeInSeconds: 1440"
        }]
    [...]
  }
}
```

```shell
{
    [...]
    "VelocityAnalysis": {
        "Id": "2d5e0463-47be-4964-b8ac-622a16a2b6c4",
        "ResultMessage": "Reject",
        "Score": 100,
        "RejectReasons": [
        {
            "RuleId": 49,
            "Message": "Blocked by the CardNumber rule. Name: Maximum 3 Card Hits in 1 day. HitsQuantity: 3. HitsTimeRangeInSeconds: 1440. ExpirationBlockTimeInSeconds: 1440"
        }]
    [...]
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`VelocityAnalysis.Id`|Identification of the analysis performed.|GUID|36|
|`VelocityAnalysis.ResultMessage`|Analysis result ("Accept" / "Reject").|Text|25|
|`VelocityAnalysis.Score`|Number of points given to the operation. E.g.: 100.|Number|10|
|`VelocityAnalysis.RejectReasons.RuleId`|Rejection rule code.|Number|10|
|`VelocityAnalysis.RejectReasons.Message`|Description of the rejection rule.|Text|512|

### Using DCC (Currency Converter)

The Dynamic Currency Conversion (DCC) is a currency converter from the **Global Payments** acquirer that allows a foreign cardholder to choose between paying in reais or in their local currency, converting the order amount at the time of purchase with full transparency for the customer.
The solution is suitable for establishments such as hotels, inns, shopping centers and tourist shops, that receive payments with cards issued abroad.

<aside class="notice">To use this feature using the standard authentication functionality, the merchant must contact the Global Payments acquirer and request a DCC activation at their store.</aside>

<aside class="warning">This feature is not compatible with external MPI transactions.</aside>

When the establishment has DCC product enabled, the authorization process is performed in the 3 steps described below:

#### STEP 1 - Authorization

In the first step, when applying for an authorization with an international card, Global Payments identifies the card's country and applies the currency conversion following the brand-specific calculations, and then returns the conversion information.

##### Request

There is no difference between a standard authorization request and a DCC authorization request.

##### Response

```json
{
    [...]
    },
    "Payment":{
        "ServiceTaxAmount": 0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "CreditCard":{
            "CardNumber": "123412******1234",
            "Holder": "Shopper Test",
            "ExpirationDate": "12/2022",
            "SaveCard":"false",
            "Brand":"Visa",
        },
        "ReturnUrl": "http://www.braspag.com.br/",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type":"CreditCard",
        "Amount": 100,
        "ReceivedDate": "2018-08-23 10:46:25",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 12,
        "ProviderReturnCode": "0",
        "ProviderReturnMessage": "Authorized Transaction",
        "CurrencyExchangeData": {
            "Id": "fab6f3a752d700af1d50fdd19987b95df497652b",
            "CurrencyExchanges": [{
                    "Currency": "EUR",
                    "ConvertedAmount": 31,
                    "ConversionRate": 3.218626,
                    "ClosingDate": "2017-03-09T00:00:00"
                },
                {
                    "Currency":"BRL",
                    "ConvertedAmount": 100
                }
            ]
        },
        [...]
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    [...]
    },
    "Payment":{
        "ServiceTaxAmount":0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "CreditCard":{
            "CardNumber": "123412******1234",
            "Holder": "Shopper Test",
            "ExpirationDate": "12/2022",
            "SaveCard":"false",
            "Brand":"Visa",
        },
        "ReturnUrl": "http://www.braspag.com.br/",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type":"CreditCard",
        "Amount": 100,
        "ReceivedDate": "2018-08-23 10:46:25",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 12,
        "ProviderReturnCode": "0",
        "ProviderReturnMessage": "Authorized Transaction",
        "CurrencyExchangeData": {
            "Id": "fab6f3a752d700af1d50fdd19987b95df497652b",
            "CurrencyExchanges": [{
                    "Currency": "EUR",
                    "ConvertedAmount": 31,
                    "ConversionRate": 3.218626,
                    "ClosingDate": "2017-03-09T00:00:00"
                },
                {
                    "Currency":"BRL",
                    "ConvertedAmount": 100
                }
            ]
        }
        [...]
}
```

|Property|Description|Type|Size|Format|
|-------------------------|-----------------------------------------------------------------------------|-------|---------|--------------------------------------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale number.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code.|Text|300|Alphanumeric|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 12|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|
|`CurrencyExchangeData.Id`|ID of the currency exchange action.|Text|50|1b05456446c116374005602dcbaf8db8879515a0|
|`CurrencyExchangeData.CurrencyExchanges.Currency`|Customer's local currency/credit card.|Numeric|4|EUR|
|`CurrencyExchangeData.CurrencyExchanges.ConvertedAmount`|Converted value.|Numeric|12|23|
|`CurrencyExchangeData.CurrencyExchanges.ConversionRate`|Conversion rate.|Numeric|9|3.218626|
|`CurrencyExchangeData.CurrencyExchanges.ClosingDate`|Transaction end date.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`CurrencyExchangeData.CurrencyExchanges.Currency`|Real currency code.|Text|3|BRA|
|`CurrencyExchangeData.CurrencyExchanges.ConvertedAmount`|Order value in reais.|Numeric|12|100|

#### STEP 2 - Payment Options

In the second step, the store system will present the customer with the options of paying in reais or in their country's currency (credit card currency), following the best practices requested by the brand. The text is presented in English and the website layout does not need to be changed, as long as the currency selection options follow the same font, color and dimension characteristics.

In Global Payments, the payment options (in reais or in the card currency) are displayed on the screen, right beside a summary of the purchase.

#### STEP 3 - Confirmation

In the third step, the store system sends the transaction confirmation with the information of the currency chosen by the customer. At this point, the authorization response is returned.

##### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/{PaymentId}/confirm</span></aside>

```json
{
  "Id": "1b05456446c116374005602dcbaf8db8879515a0",
  "Currency": "EUR",
  "Amount": 23
}
```

```shell
--request POST " https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/confirm"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "Id": "1b05456446c116374005602dcbaf8db8879515a0",
  "Currency": "EUR",
  "Amount": 23
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Id`|ID of the currency exchange action.|Text|50|Yes|
|`Currency`|Customer's selected currency.|Numeric|4|Yes|
|`Amount`|Converted value.|Numeric|12|Yes|

##### Response

```json
{
   [...]
   "Payment":{
        "ServiceTaxAmount": 0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture": false,
        "Authenticate":false,
        "Recurrent":false,
        "CreditCard":{
            "CardNumber": "123412******1234",
            "Holder": "TestDcc",
            "ExpirationDate": "12/2022",
            "SecurityCode": "***",
            "Brand":"Visa",
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor":"Message",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type":"CreditCard",
        "Amount": 23,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 23,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        [...]
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   [...]
   "Payment":{
        "ServiceTaxAmount": 0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture": false,
        "Authenticate":false,
        "Recurrent":false,
        "CreditCard":{
            "CardNumber": "123412******1234",
            "Holder": "TestDcc",
            "ExpirationDate": "12/2022",
            "SecurityCode": "***",
            "Brand":"Visa",
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor":"Message",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type":"CreditCard",
        "Amount": 23,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 23,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        [...]
    }
}
```

|Property|Description|Type|Size|Format|
|-------------------------|-----------------------------------------------------------------------------|-------|---------|--------------------------------------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale number.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code.|Text|300|Alphanumeric|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 12|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|

## Pix

In Pix, the transmission of the payment order and the availability of funds to the receiving user takes place in real time, 24 hours a day and without the need for intermediates. Thus, it is a type of payment method that enables fast payments with lower transaction costs.

<aside class="notice">Pix specifications may undergo changes and adaptations until the official release date of the feature by Braspag.</aside>
<aside class="warning">Pix is currently available for providers Cielo 3.0, Bradesco and Banco do Brasil. First, you need to contact the provider in order to authorize this type of payment method.</aside>

The life cycle of a Pix transaction:

| SEQUENCE | RESPONSIBLE | DESCRIPTION | TRANSACTION STATUS |
|--------------|------------|------------|------------|
| 1 | Store | Generates the QR Code. | 12 - Pending |
| 2 | Shopper | Pays QR Code. | 2 - Paid |
| 3 | Store | Receives payment confirmation notification. | 2 - Paid |
| 4 | Store | Queries the transaction status. | 2 - Paid |
| 5 | Store | Releases order. | 2 - Paid |
| 6 | Store | If necessary, requests refund of the Pix transaction (similar to card refund). | 2 - Paid |
| 7 | Store | Receives refund confirmation notification. | 11 - Refunded |
| * | Store | Queries the transaction status. | 11 - Refunded |

### Creating a transaction with QR code Pix

You can generate a Pix QR code through the API Pagador by simply perform the integration as specified below.

Among the required request fields, two stand out: `Type`, which must be sent as "Pix"; and `Provider', which must be "Cielo30" or "Bradesco2". The response for the request will return the *base64* encoded QR Code Pix image, which must be made available to the shopper.

See below the representation of the **transactional flow** in QR code Pix generation:
![Fluxo Geração QR Code Pix]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/pix-1-geracaoqrcodepix.png)

The shopper then performs the QR code reading through one of the Pix payment enabled applications and makes the payment. In this step, there is no participation of the store or Braspag, as shown below:
![Fluxo Pagamento QR Code Pix]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/pix-2-pagamentodopix.png)

Here are examples of a request and response for generating the QR code Pix:

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{ 
   "MerchantOrderId":"2020102601",
   "Customer":{
      "Name":"Nome do Pagador",
      "Identity":"12345678909",
      "IdentityType":"CPF"
   },
   "Payment":{ 
      "Type":"Pix",
      "Provider":"Bradesco2",
      "Amount":100,
      "QrCodeExpiration":86400
   }    
}
```

```shell
--request POST "https://(...)/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{ 
   "MerchantOrderId":"2020102601",
   "Customer":{
      "Name":"Nome do Pagador",
      "Identity":"12345678909",
      "IdentityType":"CPF"
   },
   "Payment":{ 
      "Type":"Pix",
      "Provider":"Bradesco2",
      "Amount":100,
      "QrCodeExpiration":86400
   }    
}
--verbose
```

| PROPERTY | DESCRIPTION| TYPE | SIZE | REQUIRED?|
| --- | --- | --- | --- | --- |
| `MerchantOrderId` | Order ID number. | Text | 50 | Yes |
| `Customer.Name`| Customer's name. | Text | 255 | Yes |
| `Customer.Identity` | Customer's CPF or CNPJ number. | Text | 14 | Yes |
| `Customer.IdentityType` | Customer’s ID document type (CPF or CNPJ). | Text | 255 | Yes |
| `Payment.Type` | Payment method type. In this case, "Pix". | Text | - | Yes |
| `Payment.Provider` | Name of payment method provider. In this case, "Cielo30" or "Bradesco2". | Text | - | Yes |
| `Payment.Amount`| Order amount, in cents. | Number | 15 | Yes |
| `Payment.QrCodeExpiration` | QR Code expiration time, in seconds. E.g.: 24 hours = 86400.<br>**Provider Cielo30**: QR Code expiration time is 24 hours and cannot be configured.<br>**Provider Bradesco2**: QR Code expiration time can be configured at Bradesco Shopfácil or in the authorization request through parameter `Payment.QrCodeExpiration`.<br>**Provider BancoDoBrasil3**: QR Code expiration time can be sent at the time of authorization via the `Payment.QrCodeExpiration` parameter.| Number | 3600 | No |

#### Response

```json
{
   "MerchantOrderId":"2020102601",
   "Customer":{
        "Name": "Luis Henrique",
        "Identity": "21844718933",
        "IdentityType": "CPF"
   },
   "Payment":{
      (...)   
      "PaymentId":"1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type":"Pix",
      "Provider":"Bradesco2",
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "QrcodeBase64Image":"rfhviy64ak+zse18cwcmtg==[...]",
      "QrCodeString":"00020101021226880014br.gov.bcb.pix2566qrcodes-h.cielo.com.br/pix-qr/d05b1a34-ec52-4201-ba1e-d3cc2a43162552040000530398654041.005802BR5918Merchant Teste HML6009Sao Paulo62120508000101296304031C",
      "QrCodeExpiration": 86400,
      "Amount":100,
      "ReceivedDate":"2020-10-15 18:53:20",
      "Status":12,
      "ProviderReturnCode":"0",
      "ProviderReturnMessage":"Pix gerado com sucesso",
      (...)
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId":"2020102601",
   "Customer":{
        "Name": "Luis Henrique",
        "Identity": "21844718933",
        "IdentityType": "CPF"
   },
   "Payment":{
      (...)   
      "Paymentid":"1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type":"Pix",
      "Provider":"Bradesco2",
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "QrcodeBase64Image":"rfhviy64ak+zse18cwcmtg==[...]",
      "QrCodeString":"00020101021226880014br.gov.bcb.pix2566qrcodes-h.cielo.com.br/pix-qr/d05b1a34-ec52-4201-ba1e-d3cc2a43162552040000530398654041.005802BR5918Merchant Teste HML6009Sao Paulo62120508000101296304031C",
      "QrCodeExpiration": 86400,
      "Amount":100,
      "ReceivedDate":"2020-10-15 18:53:20",
      "Status":12,
      "ProviderReturnCode":"0",
      "ProviderReturnMessage":"Pix gerado com sucesso",
      (...)
   }
}
--verbose
```

| PROPERTY | DESCRIPTION| TYPE | SIZE | FORMAT|
| --- | --- | --- | --- | --- |
| `Payment.PaymentId` | Order identifier field. | GUID | 40 | Text |
| `Payment.AcquirerTransactionId` | Transaction identifier at the acquirer.| GUID | 36 | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `Payment.ProofOfSale` | NSU Pix. | Text | 20 | Alphanumeric text|
| `Payment.SentOrderId` | Number sent to Pix issuer representing the order number. The `Payment.SentOrderId` is used for financial reconciliation. | Number | 8 | 10045146 |
| `Payment.QrcodeBase64Image` | Base64 encoded QR code image. | Text | - |Text | 
| `Payment.QrCodeString`| Coded text for the shopper to "copy" and "paste" in the  internet banking correspondent field for payments made in mobile environment.|Text|Variable | Alphanumeric text|
| `Payment.Status` | Transaction Status. If transaction is a success, the initial status is "12" (*Pending*). [Click here](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transa%C3%A7%C3%A3o){:target="_blank"} to view status list.| Number| - | 12 |
| `Payment.ProviderReturnCode` | Code returned by the acquirer. | Text | 32 | 0 |
| `Payment.ProviderReturnMessage` | Message returned by the acquirer. | Text | 512 | "Pix generated successfully" |

### Requesting a Pix Refund

If the merchant needs to "cancel" a Pix transfer, it is possible to perform an operation called a "refund". It is important to note that the refund is not an instant operation, and can be complied with or not by the Pix provider. When a refund is accepted, the store receives a [notification](https://braspag.github.io//en/manual/braspag-pagador#notification-post){:target="_blank"}.<br/>

![Fluxo Cancelamento Pix]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/pix-3-devolucaopix.png)

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/void?amount=xxx</span></aside>

```shell
--request PUT "https://(...)/sales/{PaymentId}/void?Amount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose
```

| PROPERTY | DESCRIPTION| TYPE | SIZE | REQUIRED?|
|-----------|---------|----|-------|-----------|
| `MerchantId`| API store identifier. | GUID | 36|Yes |
| `MerchantKey`| Public key for dual authentication in the API. | Text |40|Yes |
| `RequestId`| Store-defined request identifier, used when the merchant uses different servers for each GET/POST/PUT. | GUID| 36 | No |
| `PaymentId`| Order identifier field. | GUID | 36|Yes |
| `Amount` | Amount to be cancelled/refunded, in cents. Check whether the contracted acquirer supports the cancellation or refund operation.| Number | 15| No |

#### Response

```json
{
   "Status": 12,
   "ReasonCode": 0,
   "ReasonMessage": "Successful",
   "ProviderReturnCode": "0",
   "ProviderReturnMessage": "Reembolso solicitado com sucesso",
   "Links": [
      {
         "Method": "GET",
         "Rel": "self",
         "Href": "https://(...)/sales/{PaymentId}"
      }
   ]
}
```

```shell
{
   "Status": 12,
   "ReasonCode": 0,
   "ReasonMessage": "Successful",
   "ProviderReturnCode": "0",
   "ProviderReturnMessage": "Reembolso solicitado com sucesso",
   "Links": [
      {
         "Method": "GET",
         "Rel": "self",
         "Href": "https://(...)/sales/{PaymentId}"
      }
   ]
}
```

| PROPERTY | DESCRIPTION| TYPE | SIZE | FORMAT|
|-----------|---------|----|-------|-------|
|`Status` | Transaction status. | Byte | 2 | Ex.: "1" |
| `ReasonCode`| Acquirer's return code. | Text | 32 | Alphanumeric text|
| `ReasonMessage` | Acquirer's return message. | Text | 512 | Alphanumeric text|

## QR Code Transaction

To create a QR code transaction you must submit a request using the POST method as shown below. This request will create the transaction, which will receive the *Pending* status in Braspag, and generate the QR code for the payment. The customer makes the payment through one of the supported applications and the transaction changes status (e.g.: to *Pago* when paid, *Não pago* when not paid, or *Não autorizado* for unauthorized transactions).
The example below covers the minimum required fields to be submitted for authorization:

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
 "MerchantOrderId": "20191123",
 "Customer":{
  "Name":"QRCode Test"
  },
 "Payment":{
   "Provider":"Cielo30",
   "Type":"qrcode",
   "Amount":100,
   "Installments":1,
   "Capture": false
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
 "MerchantOrderId": "20191023",
 "Customer":{
  "Name":"QRCode Test"
  },
 "Payment":{
   "Provider":"Cielo30",
   "Type":"qrcode",
   "Amount": 500,
   "Installments":1,
   "Capture": false
   }
}
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantOrderId`|Order ID number.|Text|50|Yes|
|`Customer.Name`|Customer's name.|Text|255|No|
|`Payment.Provider`|Name of payment method provider. Currently only available for "Cielo".|Text|15|Yes|
|`Payment.Type`|Payment method type. In this case, "qrcode".|Text|100|Yes|
|`Payment.Amount`|Order amount (greater than 0) in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.Capture`|Submit "true" for a transaction with auto capture.|Boolean|-|No|

### Response

```json
{
 "MerchantOrderId": "20191023",
 "Customer":{
  "Name": "QRCode Test"
 },
 "Payment": {
  "Installments":1,
  "Capture": false,
  "AcquirerTransactionId": "52d641fb-2880-4024-89f4-7b452dc5d9cd",
  "QrCodeBase64Image": "iVBORw0KGgoAAAA(...)",
  "PaymentId": "403dba6-23e3-468b-92f8-f9af56d3b9d7",
  "Type": "QrCode",
  "Amount": 100,
  "ReceivedDate": "2019-10-23 21:30:00",
  "Currency":"BRL",
  "Country":"BRA",
  "Provider": "Cielo30",
  "ReasonCode": 0,
  "ReasonMessage": "Successful",
  "Status": 12,
  "ProviderReturnCode": "0",
  "ProviderReturnMessage": "Successfully generated QRCode",
  "Links": [
   {
    "Method": "GET",
    "Rel": "self",
    "Href": "http://apiquerysandbox.braspag.com.br/v2/sales/4031dba6-23e3-468b-92f8-f9af56d3b9d7"
   }
  ]
 }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
 "MerchantOrderId": "20191023",
 "Customer":{
  "Name": "QRCode Test"
 },
 "Payment":{
  "Installments":1,
  "Capture": false,
  "AcquirerTransactionId": "52d641fb-2880-4024-89f4-7b452dc5d9cd",
  "QrCodeBase64Image": "iVBORw0KGgoAAAA(...)",
  "PaymentId": "403dba6-23e3-468b-92f8-f9af56d3b9d7",
  "Type": "QrCode",
  "Amount": 100,
  "ReceivedDate": "2019-10-23 21:30:00",
  "Currency":"BRL",
  "Country":"BRA",
  "Provider": "Cielo30",
  "ReasonCode": 0,
  "ReasonMessage": "Successful",
  "Status": 12,
  "ProviderReturnCode": "0",
  "ProviderReturnMessage": "Successfully generated QRCode",
  "Links": [
   {
    "Method": "GET",
    "Rel": "self",
    "Href": "http://apiquerysandbox.braspag.com.br/v2/sales/4031dba6-23e3-468b-92f8-f9af56d3b9d7"
   }
  ]
 }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`QrCodeBase64Image`|Base64 encoded QR code. The QR code image can be displayed on the page through an HTML code as follows:<br><br> &lt;img src="data:image/png;base64,{código da imagem em base 64}"&gt;.|Text|Variable|Alphanumeric text|
|`PaymentId`|Order identifier field, required for operations such as query, capture and cancellation.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Transaction status. For transactions with QR Code, the initial status is "12" (*Pending*).|Byte|-|2|
|`ReturnCode`|Acquirer's return code.|Text|32|Alphanumeric|
|`ReturnMessage`|Acquirer's return message.|Text|512|Alphanumeric|

## Boleto

### Registered Boleto

FEBRABAN, the Brazilian Federation of Banks, together with the banking network, launched the **New Payment Slip-Registered Collections Platform**. This new system was created in order to promote greater control and security to the boleto transactional in e-commerce, and to ensure more reliability and convenience to users.

Since July 21, 2018, all boletos issued in e-commerce must be registered. [Click here](https://portal.febraban.org.br/pagina/3150/1094/en-us/new-payment-platform){:target="_blank"} to access the full announcement (available only in Portuguese).

Here is a list of the migration/membership procedures (in Portuguese) for each bank:

* [Bradesco](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/24157160-4da2-46d4-a119-60d8f614a842/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Bradesco.pdf)
* [Banco do Brasil](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/0f4644c6-da10-42ab-b647-09786d5db5cb/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Banco_do_Brasil.pdf)
* [Itaú](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/de2e95e8-441a-4fa2-be01-9b89463477d0/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Ita%C3%BA_v1.1.pdf)
* [Santander](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/a8661c34-6341-466a-86cf-078fb5e19626/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Santander.pdf)
* [Caixa Econômica](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/fee80b87-2b37-4f19-b293-bb43389025de/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Caixa_v1.1.pdf)

### Creating a Boleto Transaction

To generate boletos, customer's data such as ID number (CPF or CNPJ) and address must be provided. Below is an example of how to create a boleto as the payment method.

The `Payment.FineRate` and `Payment.FineAmount` parameters must not be used together. The same rule applies to the `Payment.InterestRate` and `Payment.InterestAmount` parameters. They are all marked with an "\*" in the "REQUIRED" column,

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
    "MerchantOrderId":"2017091101",
    "Customer":
    {
        "Name": "shopper Name",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Address":{
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27th floor",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
        }
    },
    "Payment":
    {
     "Provider":"Simulado",
     "Type": "Boleto",
     "Amount":10000,
     "BoletoNumber":"2017091101",
     "Assignor": "Test Company",
     "Demonstrative": "Desmonstrative Test",
     "ExpirationDate": "2017-12-31",
     "Identification": "12346578909",
     "Instructions": "Accept only until the due date.",
     "DaysToFine": 1,
     "FineRate": 10.00000,
     "FineAmount": 1000,
     "DaysToInterest": 1,
     "InterestRate": 5.00000,
     "InterestAmount": 500
    }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantOrderId":"2017091101",
    "Customer":
    {
        "Name": "shopper Name",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Address":{
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27th floor",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
        }
    },
    "Payment":
    {
     "Provider":"Simulado",
     "Type": "Boleto",
     "Amount":10000,
     "BoletoNumber":"2017091101",
     "Assignor": "Test Company",
     "Demonstrative": "Desmonstrative Test",
     "ExpirationDate": "2017-12-31",
     "Identification": "12346578909",
     "Instructions": "Accept only until the due date.",
     "DaysToFine": 1,
     "FineRate": 10.00000,
     "FineAmount": 1000,
     "DaysToInterest": 1,
     "InterestRate": 5.00000,
     "InterestAmount": 500
    }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Store identifier at Braspag.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication at Braspag.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`MerchantOrderId`|Order ID number. Rule varies according to the provider used (see table annexed).|Text|see table annexed|Yes|
|`Customer.Name`|Customer's name. The rule varies according to the provider used (see table annexed).|Text|see table annexed|Yes|
|`Customer.Identity`|Customer ID like RG, CPF or CNPJ number.|Text|14|No|
|`Customer.IdentityType`|Customer's ID document Type (CPF or CNPJ).|Text|255|No|
|`Customer.Address.Street`|Customer's contact address. The rule varies according to the provider used (see table annexed).|Text|see table annexed|Yes|
|`Customer.Address.Number`|Customer's contact address number. The rule varies according to the provider used (see table annexed).|Text|see table annexed|Yes|
|`Customer.Address.Complement`|Customer's contact address complement. The rule varies according to the provider used (see table annexed).|Text|see table annexed|No|
|`Customer.Address.ZipCode`|Customer's contact address zip code.|Text|8|No|
|`Customer.Address.District`|Customer's contact address district. The rule varies according to the provider used (see table annexed).|Text|see table annexed|Yes|
|`Customer.Address.City`|Customer's contact address city. The rule varies according to the provider used (see table annexed).|Text|see table annexed|Yes|
|`Customer.Address.State`|Customer's contact address state.|Text|2|No|
|`Customer.Address.Country`|Customer's contact address country.|Text|35|No|
|`Payment.Provider`|Name of payment method provider. See table annexed to access the list of providers.|Text|15|Yes|
|`Payment.Type`|Payment method type. In this case, "Boleto".|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.BoletoNumber`|Boleto number ("Nosso Número"). If filled, overrides the value set on the payment method. The rule varies according to the provider used (see table annexed).|Text|see table annexed|No|
|`Payment.Assignor`|Name of the assignor. If filled, overrides the value set on the payment method.|Text|200|No|
|`Payment.Demonstrative`|Statement text. If filled, overrides the value set on the payment method. The rule varies according to the provider used (see table annexed).|Text|see table annexed|No|
|`Payment.ExpirationDate`|Boleto's expiration date. If you are not previously registered with the payment method, this field is required. If sent on request, overrides the value set on the payment method.|Date|YYYY-MM-DD|No|
|`Payment.Identification`|Assignor's CNPJ. If filled, overrides the value set on the payment method.|Text|14|No|
|`Payment.Instructions`|Boleto's instructions. If filled, overrides the value set on the payment method. The rule varies according to the provider used (see table annexed). To break lines in this text always use the `<br>` HTML tag.|Text|see table annexed|No|
|`Payment.NullifyDays`|Deadline for automatic annulment of the boleto. After the number of days set in this field from the due date, the boleto will be automatically canceled. E.g.: a boleto due on Dec 15th which has 5 "nullify days" can be paid until Dec 20th; after this date the title is canceled. Note: Feature valid only for Banco Santander registered boletos.|Number|2|No|
|`Payment.DaysToFine`|Optional and only applicable for Bradesco2 provider. Number of days (an integer) after the due date to charge a fine amount. E.g.: 3.|Number|15|No|
|`Payment.FineRate`|Optional and only applicable for Bradesco2 provider. Amount of fine (in percentage) after due date, based on the boleto total amount (%). Permits decimal with up to 5 decimal places. Do not submit if using `FineAmount`. E.g.: 1012345 = 10.12345%.|Number|15|No*|
|`Payment.FineAmount`|Optional and only applicable for Bradesco2 provider. Amount of fine (in cents) after due date in absolute value. Do not submit if using `FineRate`. E.g.: 1000 = R$ 10.00.|Number|15|No*|
|`Payment.DaysToInterest`|Optional and only applicable for Bradesco2 provider. Number of days (an integer) after due date to start charging daily interest based on the boleto total amount. E.g.: 3.|Number|15|No|
|`Payment.InterestRate`|Optional and only applicable for Bradesco2 provider. Monthly interest amount (in percentage) after due date , based on the boleto total amount (%). Interest is charged pro rata per day (monthly divided by 30). Permits decimal with up to 5 decimal places. Do not submit if using `InterestAmount`. E.g.: 10.12345.|Number|15|No*|
|`Payment.InterestAmount`|Optional and only applicable for Bradesco2 provider. Absolute value (in cents) for daily interest after due date. Do not submit if using `InterestRate`. E.g.: 1000 = R$ 10.00.|Number|15|No*|

#### Response

```json
{
  "MerchantOrderId": "2017091101",
  "Customer":{
    "Name":"Shopper Name",
    "Identity":"12345678909",
    "IdentityType":"CPF",
    "Address":{
      "Street":"Alameda Xingu",
      "Number":"512",
      "Complement":"27th floor",
      "ZipCode":"12345987",
      "City":"São Paulo",
      "State":"SP",
      "Country": "BRA"
    }
  },
  "Payment":{
    "Instructions": "Accept only until the due date.",
    "ExpirationDate": "2017-12-31",
    "Demonstrative": "Desmonstrative Test",
    "Url": "https://homologacao.pagador.com.br/post/pagador/reenvia.asp/d24b0aa4-21c9-449d-b85c-6279333f070f",
    "BoletoNumber": "2017091101",
    "BarCodeNumber": "00091739000000100000494250000000263400656560",
    "DigitableLine": "00090.49420 50000.000260 34006.565609 1 73900000010000",
    "Assignor": "Test Company",
    "Address": "Av. Brigadeiro Faria Lima, 160",
    "Identification": "12346578909",
    "PaymentId": "d24b0aa4-21c9-449d-b85c-6279333f070f",
    "Type": "Boleto",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 16:42:55",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "InterestAmount": 1,
    "FineAmount": 5,
    "DaysToFine": 1,
    "DaysToInterest": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/d24b0aa4-21c9-449d-b85c-6279333f070f"
      }
    ]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "MerchantOrderId": "2017091101",
  "Customer":{
    "Name":"Shopper Name",
    "Identity":"12345678909",
    "IdentityType":"CPF",
    "Address":{
      "Street":"Alameda Xingu",
      "Number":"512",
      "Complement":"27th floor",
      "ZipCode":"12345987",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
     "District":"Alphaville"
    }
  },
  "Payment":{
    "Instructions": "Accept only until the due date.",
    "ExpirationDate": "2017-12-31",
    "Demonstrative": "Desmonstrative Test",
    "Url": "https://homologacao.pagador.com.br/post/pagador/reenvia.asp/d24b0aa4-21c9-449d-b85c-6279333f070f",
    "BoletoNumber": "2017091101",
    "BarCodeNumber": "00091739000000100000494250000000263400656560",
    "DigitableLine": "00090.49420 50000.000260 34006.565609 1 73900000010000",
    "Assignor": "Test Company",
    "Address": "Av. Brigadeiro Faria Lima, 160",
    "Identification": "12346578909",
    "PaymentId": "d24b0aa4-21c9-449d-b85c-6279333f070f",
    "Type": "Boleto",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 16:42:55",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "InterestAmount": 1,
    "FineAmount": 5,
    "DaysToFine": 1,
    "DaysToInterest": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/d24b0aa4-21c9-449d-b85c-6279333f070f"
      }
    ]
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ExpirationDate`|Expiration date.|Text|10|2014-12-25|
|`Url`|Boleto URL generated.|string|256|https://.../pagador/reenvia.asp/8464a692-b4bd-41e7-8003-1611a2b8ef2d|
|`BoletoNumber`|"NossoNumero" generated.|Text|50|2017091101|
|`BarCodeNumber`|Numerical representation of the barcode.|Text|44|00091628800000157000494250100000001200656560|
|`DigitableLine`|Digitable line.|Texto|256|00090.49420 50100.000004 12006.565605 1 62880000015700|
|`Address`|Store address registered in the issuer.|Text|256|E.g.: Av. Teste, 160|
|`Status`|Transaction status. See status list annexed.|Byte|2|E.g.: 1|

### Boleto Conciliation

In order to update the status of a Boleto to *Pago* (meaning paid), the Pagador must receive CNAB files with the related settlements from the banks. To enable your store to receive bank files, simply follow the procedure described on [this article](https://suporte.braspag.com.br/hc/pt-br/articles/360007068352-Como-funciona-a-Concilia%C3%A7%C3%A3o-via-Nexxera-){:target="_blank"}{:target="_blank"} (written in Portuguese).

### Specific Rules by Issuer 

The following is a list of properties and their size specifications, related to different rules for each issuer and their respective providers:

|Property|Bradesco|Banco do Brasil|Itaú Shopline|Santander|Caixa Econômica|Citibank|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|`Provider`|Bradesco2|BancoDoBrasil2|ItauShopline|Santander2|Caixa2|Citibank2|
|`MerchantOrderId`|27 (`*1`)|50|8|50|11 (`*2`)|10 (`*2`)|
|`Payment.BoletoNumber`|11 (`*3`)|9 (`*4`)|8 (`*5`)|13 (`*3`)|12 (`*6`)|11 (`*7`)|
|`Customer.Name`|34|60 (`*8`)|30|40|40|50 (`*9`)|
| `Customer.Address.Street`; `Customer.Address.Number`; `Customer.Address.Complement`; `Customer.Address.District` | Street: 70<br><br>Number: 10<br><br>Complement: 20<br><br>District: 50 | Total up to 60 characters (`*8`) | Street, Number and Complement must total up to 40 characters<br><br>District: 15 | Street, Number and Complement must total up to 40 characters<br><br>District: 15 | Street, Number e Complement must total up to 40 characters<br><br>District: 15 | Street, Number e Complement must total up to 40 characters<br><br>District: 50 (`*9`) |
|`Customer.Address.City`|50|18 (`*8`)|15|30|15|50 (`*9`)|
|`Payment.Instructions`|450|450|N/A|450|450|450|
|`Payment.Demonstrative`|255|N/A|N/A|255|255|255|

|Remarks|Details|
|---|---|
|`*1`|Only letters, numbers, and characters like "\_" and "$".|
|`*2`|If it exceeds 11 digits, the API will generate an incremental number from the defined configuration.|
|`*3`|The value must be unique, i.e., the bank does not allow repeating previously used values.|
|`*4`|When submitted with over 9 positions, the API considers the last 9 digits.|
|`*5`|Must always be the same as the order number (`MerchantOrderId`).|
|`*6`|The API automatically concatenates the value “14” + 12 free digits + check digit, before sending it to the bank. If the total exceeds 14 digits, the API considers the last 14 digits.|
|`*7`|When the number sent exceeds the maximum number, the API generates a random number.|
|`*8`|The following are accepted as valid characters: numbers, letters A to Z (UPPERCASE) and conjunction special characters (hyphen "-" and apostrophe "'". When used, there must be no space between letters. Correct examples: D'EL-REI / D'ALCORTIVO / SANT'ANA. Incorrect examples: D'EL - REI / a space between words.|
|`*9`|Special characters and diacritics will be removed automatically.|

## E-Wallet (Digital Wallet)

E-wallets are electronic safes (repositories) of cards and payment data for the physical and e-commerce customers. Digital wallets allow a customer to register their payment details, making the purchase process more convenient and secure.

<aside class="warning">The merchant needs the wallets to be integrated in their checkout in order to use them in Pagador.</aside>

Contact the provider of your choice for further information on how to contract the service.

### Available E-Wallets

Pagador currently supports the main digital wallets available in the market, which are listed below:

* [*Apple Pay*](https://www.apple.com/br/apple-pay/){:target="_blank"}
* [*Samsung Pay*](https://www.samsung.com.br/samsungpay/){:target="_blank"}
* [*Google Pay*](https://pay.google.com/intl/pt-BR_br/about/){:target="_blank"}

<aside class="warning">When the “Wallet” node is sent in the request, the “CreditCard” node becomes optional.</aside>

<aside class="warning">When the “Wallet” node is sent in the request, the “DebitCard” node containing the “ReturnUrl” will be required for debit cards.</aside>

### E-Wallet Integration

Refer to our [E-Wallets](https://braspag.github.io//en/manual/ewallets){:target="_blank"} guide for more details about how to integrate the e-wallets in your checkout.

## Voucher

### Creating a Voucher Transaction

A transaction with a voucher card is similar to a debit card transaction; only without the authentication process. Currently, only the *Alelo* and *Ticket* providers are supported in this modality.

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Alelo",
      "Type": "DebitCard",
      "Amount": 10,
      "Installments": 1,
      "DebitCard": {
         "CardNumber": "****4903",
         "Holder": "TesteBraspag",
         "ExpirationDate": "02/2019",
         "SecurityCode": "***",
         "Brand": "Elo"
      },
      [...]
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Alelo",
      "Type": "DebitCard",
      "Amount": 10,
      "Installments": 1,
      "DebitCard": {
         "CardNumber": "****4903",
         "Holder": "TesteBraspag",
         "ExpirationDate": "02/2019",
         "SecurityCode": "***",
         "Brand": "Elo"
      },
      [...]
   }
}
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of the payment method provider. Currently only "Cielo" supports this form of payment via Pagador.|Text|15|Yes|
|`Payment.Type`|Payment method type. In this case, "DebitCard".|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.ReturnUrl`|URL to which the user will be redirected after the end of the payment.|Text|1024|Yes|
|`DeditCard.CardNumber`|Customer's card number.|Text|16|Yes|
|`DeditCard.Holder`|Name of the cardholder printed on the card.|Text|25|Yes|
|`DebitCard.ExpirationDate`|Expiration date printed on the card, in the MM/YYYY format. Note: "Ticket" vouchers do not have an expiration date printed on the card. Send a date previous to the current date to process the transaction.|Text|7|Yes|
|`DebitCard.SecurityCode`|Security code printed on back of card.|Text|4|Yes|
|`DebitCard.Brand`|Card brand.|Text|10|Yes|

#### Response

```json
{
    [...]
    "Payment":{
        "DebitCard":{
            "CardNumber": "527637******4903",
            "Holder": "TestBraspag",
            "ExpirationDate": "02/2019",
            "SaveCard":"false",
            "Brand": "Elo"
        },
        "ProofOfSale": "004045",
        "AcquirerTransactionId": "c63fb9f7-02ad-42b3-a182-c56e26238a00",
        "AuthorizationCode": "128752",
        "Eci": "0",
        "PaymentId": "562a8563-9181-4f12-bee8-0ccc89c8f931",
        "Type": "DebitCard",
        "Amount": 10,
        "ReceivedDate": "2018-02-21 10:59:57",
        "CapturedAmount": 10,
        "CapturedDate": "2018-02-21 11:00:48",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider": "Alelo",
        "ReturnUrl": "http://www.braspag.com.br",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "00",
        "ProviderReturnMessage": "Transaction successfully captured",
        [...]
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    [...]
    "Payment":{
        "DebitCard":{
            "CardNumber": "527637******4903",
            "Holder": "TestBraspag",
            "ExpirationDate": "02/2019",
            "SaveCard":"false",
            "Brand": "Elo"
        },
        "ProofOfSale": "004045",
        "AcquirerTransactionId": "c63fb9f7-02ad-42b3-a182-c56e26238a00",
        "AuthorizationCode": "128752",
        "Eci": "0",
        "PaymentId": "562a8563-9181-4f12-bee8-0ccc89c8f931",
        "Type": "DebitCard",
        "Amount": 10,
        "ReceivedDate": "2018-02-21 10:59:57",
        "CapturedAmount": 10,
        "CapturedDate": "2018-02-21 11:00:48",
        "Currency":"BRL",
        "Country":"BRA",
        "Provider": "Alelo",
        "ReturnUrl": "http://www.braspag.com.br",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "00",
        "ProviderReturnMessage": "Transaction successfully captured",
        [...]
    }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale reference.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code from the acquirer.|Text|300|Alphanumeric|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DDHH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|
|`AuthenticationUrl`|URL to which the holder will be redirected for authentication.|Text|56|https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f|

# Recurrence

Unlike traditional credit card or boleto payments, recurring payments are automatically repeated for periods and at specified intervals, always charging the same amount from the same card or account.

It is widely used for magazine subscriptions, monthly fees, software licenses, among others. In addition to the technical integration, it is necessary for the customer's merchant to be enabled with the acquirer to receive recurring payments.

The merchant counts with features that can be used to shape their charging system in accordance with their business. Some of these features are: parameterization and change of periodicity, start and end date, number of attempts and interval between attempts. To learn more details about Recurrence, refer to our [article](https://suporte.braspag.com.br/hc/pt-br/articles/360013311991){:target="_blank"} in Portuguese.

<aside class="notice">Recurring credit card sales do not require CVV.</aside>
<aside class="warning">Recurrence is not available for e-wallet transactions due to the use of ephemeral keys which are necessary in credit operations.</aside>
<aside class="warning">For safety reasons, recurrence is only possible for cards that pass the Luhn Algorithm checksum formula, also known as "mod10".</aside>

## Recurrence Authorization

### Authorizing a Credit Card Recurrence

Add the `RecurrentPayment` node to the `Payment` node to schedule future recurrences when authorizing a transaction for the first time in the recurrence series.

The `Payment.RecurrentPayment.Interval` and `Payment.RecurrentPayment.DailyInterval` parameters, marked with an "\*" in the "REQUIRED" column, must not be used together. 

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount": 10000,
      "Installments": 1,
      "CreditCard": {
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment": {
         "AuthorizeNow":"true",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount": 10000,
      "Installments": 1,
      "CreditCard": {
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment": {
         "AuthorizeNow":"true",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of the payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type.|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.RecurrentPayment.EndDate`|Recurring end date.|Text|10|No|
|`Payment.RecurrentPayment.Interval`|Recurrence interval. Must not be used together with `DailyInterval`.<br>Monthly (default) / Bimonthly / Quarterly / SemiAnnual / Annual|Text|10|No*|
|`Payment.RecurrentPayment.DailyInterval`|Pattern of recurrence in days. Must not be used together with `Interval`.|Number|2|No*|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - authorizes right at request. / "false" - for future scheduling.|Boolean|---|Yes|
|`CreditCard.CardNumber`|Customer’s card number.|Text|19|Yes|
|`CreditCard.Holder`|Name of cardholder printed on the card.|Text|25|Yes|
|`CreditCard.ExpirationDate`|Expiration date printed on the card, in the MM/YYYY format.|Text|7|Yes|
|`CreditCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`CreditCard.Brand`|Card brand.|Text|10|Yes|

#### Response

```json
{
  [...]
  "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187******0181",
      "Holder": "Cardholder Name",
      "ExpirationDate":"12/2021",
      "SaveCard":"false",
      "Brand":"Visa",
    },
    "ProofOfSale": "5646418",
    "AcquirerTransactionId": "0511045646418",
    "AuthorizationCode": "100024",
    "PaymentId": "067f73ce-62fb-4d76-871d-0bcbb88fbd22",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 16:56:46",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    "RecurrentPayment": {
      "RecurrentPaymentId": "808d3631-47ca-43b4-97f5-bd29ab06c271",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-06-11",
      "EndDate":"2019-12-31",
      "Interval": "Monthly",
      [...]
    }
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187******0181",
      "Holder": "Cardholder Name",
      "ExpirationDate":"12/2021",
      "SaveCard":"false",
      "Brand":"Visa",
    },
    "ProofOfSale": "5646418",
    "AcquirerTransactionId": "0511045646418",
    "AuthorizationCode": "100024",
    "PaymentId": "067f73ce-62fb-4d76-871d-0bcbb88fbd22",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 16:56:46",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    "RecurrentPayment": {
      "RecurrentPaymentId": "808d3631-47ca-43b4-97f5-bd29ab06c271",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-06-11",
      "EndDate":"2019-12-31",
      "Interval": "Monthly",
      [...]
    }
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|ID that represents the recurrence, used for future queries and changes.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`NextRecurrency`|Date when the next recurrence will happen.|Text|10|2019-12-11 (YYYY-MM-DD)|
|`EndDate`|End of recurrence date.|Text|10|2019-12-31 (YYYY-MM-DD)|
|`Interval`|Interval between recurrences.|Text|10|Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Whether the first recurrence will already be authorized or not.|Boolean|---|"true" or "false"|

## Recurrence Schedule 

### Scheduling an Authorization

Unlike the previous recurrence, this example does not authorize immediately, but schedules a future authorization.

To schedule the first transaction in the recurrence series, pass the `Payment.RecurrentPayment.AuthorizeNow` parameter as "false" and add the `Payment.RecurrentPayment.StartDate` parameter.

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017091101",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Installments":1,
      "CreditCard":{
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment":{
         "AuthorizeNow":false,
         "StartDate":"2017-12-31",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017091101",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Installments":1,
      "CreditCard":{
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment":{
         "AuthorizeNow":false,
         "StartDate":"2017-12-31",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of the payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type.|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.RecurrentPayment.StartDate`|Recurrence start date.|Text|10|No|
|`Payment.RecurrentPayment.EndDate`|Recurrence end date.|Text|10|No|
|`Payment.RecurrentPayment.Interval`|Recurrence Interval.<br>Monthly (Default) / Bimonthly / Quarterly / SemiAnnual / Annual.|Text|10|No|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - authorizes right at request. / "false" - for future scheduling.|Boolean|---|Yes|
|`CreditCard.CardNumber`|Customer’s card number.|Text|19|Yes|
|`CreditCard.Holder`|Name of cardholder printed on the card.|Text|25|Yes|
|`CreditCard.ExpirationDate`|Expiration date printed on the card, in the MM/YYYY format.|Text|7|Yes|
|`CreditCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`CreditCard.Brand`|Card brand.|Text|10|Yes|

#### Response

```json
{
  [...]
  "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187******0181",
      "Holder": "Cardholder Name",
      "ExpirationDate":"12/2021",
      "SaveCard":"false",
      "Brand": "Undefined"
    },
    "Type":"CreditCard",
    "Amount":10000,
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    Status 20
    "RecurrentPayment": {
      "RecurrentPaymentId": "32703035-7dfb-4369-ac53-34c7ff7b84e8",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-12-31",
      "StartDate": "2017-12-31",
      "EndDate":"2019-12-31",
      "Interval": "Monthly",
      [...]
      "AuthorizeNow": false
    }
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187******0181",
      "Holder": "Cardholder Name",
      "ExpirationDate":"12/2021",
      "SaveCard":"false",
      "Brand": "Undefined"
    },
    "Type":"CreditCard",
    "Amount":10000,
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "Status":20,
    "RecurrentPayment": {
      "RecurrentPaymentId": "32703035-7dfb-4369-ac53-34c7ff7b84e8",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-12-31",
      "StartDate": "2017-12-31",
      "EndDate":"2019-12-31",
      "Interval": "Monthly",
      [...]
      "AuthorizeNow": false
    }
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|Field identifier of the next recurrence.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`NextRecurrency`|Date of next recurrence.|Text|7|05/2019 (MM/YYYY)|
|`StartDate`|Start date of recurrence.|Text|7|05/2019 (MM/YYYY)|
|`EndDate`|End date of recurrence.|Text|7|05/2019 (MM/YYYY)|
|`Interval`|Interval between recurrences.|Text|10|Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Whether the first recurrence will already be authorized or not.|Boolean|---|"true" / "false"|

## Data Alteration

### Changing Customer Data

To change customer data in an existing recurrence, simply make a PUT call to the specified endpoint.
In **response** to your request, the API will return an [HTTP Status](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code){:target="_blank"} code, informing whether the operation was successful or not.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Customer</span></aside>

```json
{
  "Name": "Another Shopper Name",
  "Email":"outrocomprador@braspag.com.br",
  "Birthdate":"1999-12-12",
  "Identity":"0987654321",
  "IdentityType": "CPF",
  "Address":{
      "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      },
   "DeliveryAddress":{
      "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      }
    }
}
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Customer"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "Name": "Another Shopper Name",
    "Email":"outrocomprador@braspag.com.br",
    "Birthdate":"1999-12-12",
    "Identity":"0987654321",
    "IdentityType": "CPF",
    "Address":{
    "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
   },
   "DeliveryAddress":{
    "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|
|`Customer.Name`|Customer's name.|Text|255|Yes|
|`Customer.Email`|Customer's email.|Text|255|No|
|`Customer.Birthdate`|Customer's date of birth.|Date|10|No|
|`Customer.Identity`|Customer's ID, CPF or CNPJ number.|Text|14|No|
|`Customer.IdentityType`|Customer's ID document type (CPF or CNPJ).|Text|255|No|
|`Customer.Address.Street`|Customer's contact address.|Text|255|No|
|`Customer.Address.Number`|Customer's contact address number.|Text|15|No|
|`Customer.Address.Complement`|Customer's contact address additional information.|Text|50|No|
|`Customer.Address.ZipCode`|Customer's contact address zip code.|Text|9|No|
|`Customer.Address.City`|Customer's contact address city.|Text|50|No|
|`Customer.Address.State`|Customer's contact address state.|Text|2|No|
|`Customer.Address.Country`|Customer's contact address country.|Text|35|No|
|`Customer.Address.District`|Customer's contact address neighborhood.|Text|50|No|
|`Customer.DeliveryAddress.Street`|Delivery address street.|Text|255|No|
|`Customer.DeliveryAddress.Number`|Delivery address number.|Text|15|No|
|`Customer.DeliveryAddress.Complement`|Delivery address additional information.|Text|50|No|
|`Customer.DeliveryAddress.ZipCode`|Delivery address zip code.|Text|9|No|
|`Customer.DeliveryAddress.City`|Delivery address city.|Text|50|No|
|`Customer.DeliveryAddress.State`|Delivery address state.|Text|2|No|
|`Customer.DeliveryAddress.Country`|Delivery address country.|Text|35|No|
|`Customer.DeliveryAddress.District`|Delivery address neighborhood.|Text|50|No|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code){:target="_blank"} annex for a list of all HTTP status codes possibly returned by the API.

### Changing Recurrence End Date

To change the end date of the existing recurrence, just make a PUT call as in the example.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate</span></aside>

```json
"2021-01-09"
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2021-01-09"
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|
|`EndDate`|End date of recurrence.|Text|10|Yes|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code){:target="_blank"} annex for a list of all HTTP status codes possibly returned by the API.

### Changing Recurrence Interval

To change the range of an existing recurrence, just make a PUT call as shown in the example.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Interval</span></aside>

```json
"SemiAnnual"
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Interval"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"SemiAnnual"
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|
|`Interval`|Recurrence Interval.<br>Monthly / Bimonthly / Quarterly / SemiAnnual / Annual.|Text|10|Yes|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code){:target="_blank"} annex for a list of all HTTP status codes possibly returned by the API.

### Changing Recurrence Day

Take the following API updating rules into account when modifying the expiration day of an existing recurrence:

1- If the newly entered day comes after the current day, we will update the recurrence day with effect on the next recurrence.<br>E.g.: Today is May 5, and the next recurrence is on May 25. When I update it to day 10, the next recurrence date will be May 10.

2- If the newly entered day comes before the current day, we will update the recurrence day, but this will take effect only after the next recurrence is successfully executed. <br>E.g.: Today is May 5, and the next recurrence is on May 25. When I update it to day 3, the next recurrence will remain on May 25. Once it has run, the next recurrence will be scheduled for June 3.

3- If the newly entered day comes before the current day, but the next recurrence is in another month, we will update the recurrence day with effect on the coming recurrence.<br>E.g.: Today is May 5, and the next recurrence is September 25. When I upgrade to day 3, the next recurrence date will be September 3.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay</span></aside>

```json
16
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
16
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|
|`RecurrencyDay`|Recurrence Day.|Number|2|Yes|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code) annex for a list of all HTTP status codes possibly returned by the API.

### Changing Recurrence Transaction Amount

To modify the transaction value of an existing recurrence, simply make a PUT call as shown in the example.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Amount</span></aside>

```json
156
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Amount"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
156
--verbose

```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|
|`Payment.Amount`|Order value in cents (156 equals R$ 1.56).|Number|15|Yes|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code) annex for a list of all HTTP status codes possibly returned by the API.

### Changing Next Payment Date

To change only one next payment date, make a PUT call as shown in the example.

<aside class="warning">This change only affects the payment date of the exact next recurrence. All the following dates will remain unchanged.</aside>

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate</span></aside>

```json
"2017-06-15"
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2016-06-15"
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|
|`NextPaymentDate`|Date of next recurrence payment.|Text|10|Yes|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code) annex for a list of all HTTP status codes possibly returned by the API.

### Changing Recurrence Payment Data

During the life cycle of a recurrence, you can change:

* Acquirer (e.g.: from Rede to Cielo)
* Card (in case of an expired card)
* Payment method (from card to boleto and vice versa)
<br/>
To change the payment details, simply make a PUT call as shown in the example.

<aside class="warning">CAUTION: This change affects all Payment node data. In order to keep the previous data, you must enter the fields that will remain unchanged with their currently saved values.</aside>

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Payment</span></aside>

```json
{
   "Type":"CreditCard",
   "Amount": "20000",
   "Installments":3,
   "Country": "USA",
   "Currency":"USD",
   "SoftDescriptor":"Message",
   "Provider":"Simulado",
   "CreditCard":{
      "Brand":"Master",
      "Holder": "Cardholder Name",
      "CardNumber":"4111111111111111",
      "ExpirationDate":"05/2019"
      },
   "Credentials": {
      "code":"9999999",
      "key":"D8888888",
      "password":"LOJA9999999",
      "username": "#Braspag2018@NOMEDALOJA#",
      "signature": "001"
      }
}
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Payment"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "Type":"CreditCard",
   "Amount": "20000",
   "Installments":3,
   "Country": "USA",
   "Currency":"USD",
   "SoftDescriptor":"Message",
   "Provider":"Simulado",
   "CreditCard":{
      "Brand":"Master",
      "Holder": "Cardholder Name",
      "CardNumber":"4111111111111111",
      "ExpirationDate":"05/2019"
      },
   "Credentials": {
      "code":"9999999",
      "key":"D8888888",
      "password":"LOJA9999999",
      "username": "#Braspag2018@NOMEDALOJA#",
      "signature": "001"
      }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|
|`Provider`|Name of the payment method provider.|Text|15|Yes|
|`Type`|Payment method type.|Text|100|Yes|
|`Amount`|Order amount in cents.|Number|15|Yes|
|`Installments`|Number of installments.|Number|2|Yes|
|`SoftDescriptor`|Text to be printed on the credit card invoice.|Text|13|No|
|`CreditCard.CardNumber`|Card number.|Text|19|Yes|
|`CreditCard.Holder`|Card holder name.|Text|25|Yes|
|`CreditCard.ExpirationDate`|Expiration date printed on the card.|Text|7|Yes|
|`CreditCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`CreditCard.Brand`|Card brand.|Text|10|Yes|
|`Credentials.Code`|Affiliation generated by the acquirer.|Text|100|Yes|
|`Credentials.Key`|Affiliation key/token generated by the acquirer.|Text|100|Yes|
|`Credentials.Username`|User generated during the accreditation with the acquirer (providers like Rede and Getnet need a username and password for communicating, so this field is required).|Text|50|No|
|`Credentials.Password`|Password generated during the accreditation with the acquirer (providers like Rede and Getnet need a username and password for communicating, so this field is required).|Text|50|No|
|`Credentials.Signature`|Submit the *TerminalID* from **Global Payments**. E.g.: 001. For **Safra**, include establishment name, city and state concatenated with a semicolon “;”. E.g.: StoreName;Sao Paulo;SP.|Text|3|No|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code) annex for a list of all HTTP status codes possibly returned by the API.

## Order Deactivation

### Deactivating a Recurring Order

To deactivate a recurring request, simply make a PUT call as shown in the example.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Payment</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Deactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code) annex for a list of all HTTP status codes possibly returned by the API.

## Order Reactivation

### Reactivating a Recurring Order

To reactivate a recurring request, simply make a PUT call as shown in the example.

#### Request

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence ID number.|Text|50|Yes (through endpoint)|

#### Response

```shell
HTTP Status 200
```

Refer to the [HTTP Status Code](https://braspag.github.io//en/manual/braspag-pagador?json#list-of-http-status-code) annex for a list of all HTTP status codes possibly returned by the API.

## Transaction with Renova Fácil

*Renova Fácil* was developed by CIELO together with issuers. It's a service which aims in increasing the conversion rate of recurring credit card sales.

It identifies expired cards during the transaction and goes through the authorization using a new card, which is then returned for storage.

To use Renova Fácil, the service must be enabled at CIELO. No extra information must be sent in the authorization request, but the response will have one more node as shown in the example response.

<aside class="notice>Participating Banks: Bradesco, Banco do Brasil, Santander, Panamericano, Citibank.</aside>

### Response

```json
{
  [...]
  "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187* *** **0183",
      "Holder": "Cardholder Name",
      "ExpirationDate": "12/2016",
      "SaveCard":"false",
      "Brand":"Visa",
    },
    "AcquirerTransactionId": "0512105630844",
    "NewCard": {
      "CardNumber": "4551870000512353",
      "Holder": "Cardholder Name",
      "ExpirationDate": "05/2020",
      "SaveCard":"false",
      "Brand": "Visa"
    },
    "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-12 10:56:30",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 15,
    "ReasonMessage": "CardExpired",
    "Status": 3,
    "ProviderReturnCode": "57",
    "ProviderReturnMessage": "Card Expired",
    [...]
  }
}
```

```shell
{
  [...]
  "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187* *** **0183",
      "Holder": "Cardholder Name",
      "ExpirationDate": "12/2016",
      "SaveCard":"false",
      "Brand":"Visa",
    },
    "AcquirerTransactionId": "0512105630844",
    "NewCard": {
      "CardNumber": "4551870000512353",
      "Holder": "Cardholder Name",
      "ExpirationDate": "05/2020",
      "SaveCard":"false",
      "Brand":"Visa",
    },
    "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-12 10:56:30",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 15,
    "ReasonMessage": "CardExpired",
    "Status": 3,
    "ProviderReturnCode": "57",
    "ProviderReturnMessage": "Card Expired",
    [...]
  }
}
```

|Property|Description|Type|Size|
|-----------|---------|----|-------|-------|
|`NewCard.CardNumber`|Customer's new card number.|Text|16|
|`NewCard.Holder`|Name of cardholder printed on the new card.|Text|25|
|`NewCard.ExpirationDate`|Expiration date printed on the new card.|Text|7|
|`CreditCard.SecurityCode`|Security code printed on the back of the card.|Text|4|
|`NewCard.Brand`|New card brand.|Text|10|

# Saving and Reusing Cards

With [Cartão Protegido](https://braspag.github.io//en/manual/cartao-protegido-api-rest){:target="_blank"}, you can safely save your client's credit card in accordance with the PCI standards. The card information is saved as a token (excluding the card CVV), making transaction process easier by replacing its data in a future transaction from the same shopper, while keeping the integrity of the saved cards. 

<aside class="warning">ATTENTION: For safety reasons, it's only possible to save cards that pass the Luhn Algorithm checksum formula, also known as "mod10".</aside>

In addition to generating a card token, you can associate a name (identifier in text format) with the saved card. This identifier will be the `Alias`.

## Saving a Card During an Authorization

#### Request

To save a credit card used in a transaction, simply send the `Payment.SaveCard` parameter as _true_ in the standard authorization request. The card number to be used can be validated through the technique exaplained in [this article](https://suporte.braspag.com.br/hc/pt-br/articles/360050638051){:target="_blank"}, in Portuguese.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":true,
         "Alias":"",
       },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":true,
         "Alias":"",
       },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of the payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type.|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`CreditCard.CardNumber`|Customer’s card number.|Text|19|Yes|
|`CreditCard.Holder`|Name of cardholder printed on the card.|Text|25|Yes|
|`CreditCard.ExpirationDate`|Expiration date printed on the card, in the MM/YYYY format.|Text|7|Yes|
|`CreditCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`CreditCard.Brand`|Card brand.|Text|10|Yes|
|`CreditCard.SaveCard`|"true" - saves the card. / "false" - does not save the card.|Boolean|10|No (default "false")|
|`CreditCard.Alias`|Credit card alias.|Text|64|No|

##### Response

The `CreditCard.CardToken` parameter will return the token to be saved for future transactions with the same card.

```json
{
  [...]
  },
    "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187******0181",
      "Holder": "Cardholder Name",
      "ExpirationDate":"12/2021",
      "SaveCard": true,
      "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
      "Brand":"Visa",
      "Alias": "Customer1"
    },
    "ProofOfSale": "3519928",
    "AcquirerTransactionId": "0511023519928",
    "AuthorizationCode": "536934",
    "PaymentId": "3af00b2d-dbd0-42d6-a669-d4937f0881da",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 14:35:19",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  },
    "Payment":{
    "ServiceTaxAmount": 0,
    "Installments":1,
    "Interest":"ByMerchant",
    "Capture":true,
    "Authenticate":false,
    "Recurrent":false,
    "CreditCard":{
      "CardNumber": "455187******0181",
      "Holder": "Cardholder Name",
      "ExpirationDate":"12/2021",
      "SaveCard": true,
      "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
      "Brand":"Visa",
      "Alias": "Customer1"
    },
    "ProofOfSale": "3519928",
    "AcquirerTransactionId": "0511023519928",
    "AuthorizationCode": "536934",
    "PaymentId": "3af00b2d-dbd0-42d6-a669-d4937f0881da",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 14:35:19",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}
--verbose
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale reference.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code from the acquirer.|Text|300|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|
|`CreditCard.CardToken`|*Cartão Protegido* token, representing the card data.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Creating a Card Token Transaction

This is an example of how to use the previously saved *card token* to create a transaction. For security reasons, a card token doesn't include the Security Code (CVV). Therefore, you must request this information from the holder for each new transaction. If your merchant location is set to "recurring", you can submit transactions without the CVV.

The `CreditCard` node within the `Payment` node will change as shown in the example.

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of the payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type.|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`CreditCard.CardToken`|*Cartão Protegido* token, representing the card data.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Security code printed on the back of the card. To make transactions without the CVV, you must request permission with your acquirer.|Text|4|No|
|`CreditCard.Brand`|Card brand.|Text|10|Yes|

##### Response

```json
{
   [...]
   },
     "Payment":{
        "Provider":"Simulado",
        "Type":"CreditCard",
        "Amount":10000,
        "Currency":"BRL",
        "Country":"BRA",
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "SoftDescriptor":"Message",
        "CreditCard":{
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   [...]
   },
     "Payment":{
        "Provider":"Simulado",
        "Type":"CreditCard",
        "Amount":10000,
        "Currency":"BRL",
        "Country":"BRA",
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "SoftDescriptor":"Message",
        "CreditCard":{
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale reference.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code from the acquirer.|Text|300|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|

## Creating a Transaction with Alias

This is an example of how to use the previously saved *alias* to create a transaction. For security reasons, an alias does not include the Security Code. Therefore, you must request this information from the holder for each new transaction. If your merchant location is set to *recurring*, you can submit transactions without CVV.

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "Alias":"Cliente1",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "Alias":"Cliente1",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Name of the payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type.|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`CreditCard.CardToken`|*Cartão Protegido* token, representing the card data.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Security code printed on the back of the card. To make transactions without the CVV, you must request permission with your acquirer.|Text|4|No|
|`CreditCard.Brand`|Card brand.|Text|10|Yes|
|`CreditCard.Alias`|Credit card alias.|Text|64|No|

##### Response

```json
{
   [...]
   },
     "Payment":{
        "Provider":"Simulado",
        "Type":"CreditCard",
        "Amount":10000,
        "Currency":"BRL",
        "Country":"BRA",
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "SoftDescriptor":"Message",
        "CreditCard":{
            "Alias": "Customer1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   [...]
   },
     "Payment":{
        "Provider":"Simulado",
        "Type":"CreditCard",
        "Amount":10000,
        "Currency":"BRL",
        "Country":"BRA",
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":true,
        "Authenticate":false,
        "Recurrent":false,
        "SoftDescriptor":"Message",
        "CreditCard":{
            "Alias": "Customer1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type":"CreditCard",
    "Amount":10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency":"BRL",
    "Country":"BRA",
    "Provider":"Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}

```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`ProofOfSale`|Proof of sale reference.|Text|20|Alphanumeric|
|`AuthorizationCode`|Authorization code from the acquirer.|Text|300|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`ReasonCode`|Operation return code.|Text|32|Alphanumeric|
|`ReasonMessage`|Operation return message.|Text|512|Alphanumeric|
|`Status`|Transaction status.|Byte|2|E.g.: 1|
|`ProviderReturnCode`|Code returned by the payment provider (acquirer or issuer).|Text|32|57|
|`ProviderReturnMessage`|Message returned by the payment provider (acquirer or issuer).|Text|512|Transaction Approved|

# Payments with Fraud Analysis

You can verify whether a transaction is likely to be a fraud or not during an authorization. This verification can be triggered in different stages of the transaction, according to the rules defined by the client. The fraud analysis will have a different behavior for each type of integration, as described below : 

|Integration Type|Description|Required Parameters|
|-|-|-|
|Pre-authorization analysis|Before the transaction is submitted for authorization, the fraud analysis assesses whether it is of high risk or not. This avoids risky transactions being sent for authorization.|`FraudAnalysis.Sequence` is "AnalyseFirst"|
|Analysis after authorization|Before the transaction is sent to the fraud analysis, it will be sent for authorization.|`FraudAnalysis.Sequence` is "AuthorizeFirst"|
|Analysis of authorized transactions|The fraud analysis is only triggered to analyze transactions with the "authorized" status. This avoids the cost of unauthorized transactions analyses.|`FraudAnalysis.Sequence` is "AuthorizeFirst" and `FraudAnalysis.SequenceCriteria` is "OnSuccess"|
|Analysis in any event|Regardless of the transaction status after authorization, the fraud analysis will examine the risks.|`FraudAnalysis.Sequence` is "AuthorizeFirst", `FraudAnalysis.SequenceCriteria` is "Always"|
|Authorization in any event|Regardless of the transaction fraud score, it will always be submitted for authorization.|`FraudAnalysis.Sequence` is "AnalyseFirst", `FraudAnalysis.SequenceCriteria` is "Always"|
|Capture secure transactions|After the fraud analysis, an authorized transaction is automatically captured if tagged as low risk. In the case of manual review, the transaction will be automatically captured as soon as Braspag is notified of the new status "Accept".|`FraudAnalysis.Sequence` is "AuthorizeFirst", `FraudAnalysis.CaptureOnLowRisk` is "true", `Payment.Capture` is "false"|
|Cancel a suspect transaction|If the fraud analysis sets high risk for an already authorized or captured transaction, it will be immediately canceled or reversed. In the case of manual review, the transaction will be automatically canceled or reversed as soon as Braspag is notified of the new status "Reject".|`FraudAnalysis.Sequence` is "AuthorizeFirst", `FraudAnalysis.VoidOnHighRisk` is "true"|

If not otherwise specified during authorization, Braspag will process your transaction through the following flow:
* `FraudAnalysis.Sequence` as "AuthorizeFirst",
* `FraudAnalysis.SequenceCriteria` as "OnSuccess",
* `FraudAnalysis.VoidOnHighRisk` as "false",
* `FraudAnalysis.CaptureOnLowRisk` as "false".

## Implementing Cybersource Fraud Analysis

For the CyberSource fraud analysis to be performed during a credit card transaction, you must add the following nodes to the authorization agreement: `FraudAnalysis`, `Cart`, `MerchantDefinedFields` and `Travel` (this one only for airline tickets). 

During the Cybersource deployment, additional information can be stored through MDDs (Merchand Defined Data). MDDs are fields numbered 0 through N used to store unique merchant information. [This article](https://suporte.braspag.com.br/hc/pt-br/articles/360004822532-Implanta%C3%A7%C3%A3o-Cybersource-MDD-s-Geral){:target="_blank"} (in Portuguese) has details on how to fill these fields.

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
   "MerchantOrderId":"2017051002",
   "Customer":{
      "Name": "shopper Name",
      "Identity": "12345678910",
      "IdentityType": "CPF",
      "Email": "shopper@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "Address":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Message",
      "DoSplit":false,
      "CreditCard":{
         "CardNumber":"455187******0181",
         "Holder": "Cardholder Name",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard": "false"
      },
      "Credentials":{
         "code":"9999999",
         "key":"D8888888",
         "password":"LOJA9999999",
         "username":"#Braspag2018@NOMEDALOJA#",
         "signature":"001"
      },
      "ExtraDataCollection":[
         {
            "Name":"FieldName",
            "Value":"FieldValue"
         }
      ],
      "FraudAnalysis": {
         "Sequence": "AnalyseFirst",
         "SequenceCriteria": "Always",
         "Provider": "Cybersource",
         "CaptureOnLowRisk": false,
         "VoidOnHighRisk": false,
         "TotalOrderAmount": 10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{
            "CookiesAccepted":false,
            "Email": "shopper@braspag.com.br",
            "HostName":"Test",
            "IpAddress": "127.0.0.1",
            "Type": "Chrome"
         },
         "Cart": {
            "IsGift": false,
            "ReturnsAccepted": true,
            "Items":[
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               }
            ]
         },
         "MerchantDefinedFields":[
            {
               "Id": 2,
               "Value": "100"
            },
            {
               "Id": 4,
               "Value": "Web"
            },
            {
               "Id": 9,
               "Value":"SIM"
            }
         ],
         "Shipping":{
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[
               {
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[
                     {
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
         }
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId":"2017051002",
   "Customer":{
      "Name": "shopper Name",
      "Identity": "12345678910",
      "IdentityType": "CPF",
      "Email": "shopper@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "Address":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Message",
      "DoSplit":false,
      "CreditCard":{
         "CardNumber":"455187******0181",
         "Holder": "Cardholder Name",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard": "false"
      },
      "Credentials":{
         "code":"9999999",
         "key":"D8888888",
         "password":"LOJA9999999",
         "username":"#Braspag2018@NOMEDALOJA#",
         "signature":"001"
      },
      "ExtraDataCollection":[
         {
            "Name":"FieldName",
            "Value":"FieldValue"
         }
      ],
      "FraudAnalysis": {
         "Sequence": "AnalyseFirst",
         "SequenceCriteria": "Always",
         "Provider": "Cybersource",
         "CaptureOnLowRisk": false,
         "VoidOnHighRisk": false,
         "TotalOrderAmount": 10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{
            "CookiesAccepted":false,
            "Email": "shopper@braspag.com.br",
            "HostName":"Test",
            "IpAddress": "127.0.0.1",
            "Type": "Chrome"
         },
         "Cart": {
            "IsGift": false,
            "ReturnsAccepted": true,
            "Items":[
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               }
            ]
         },
         "MerchantDefinedFields":[
            {
               "Id": 2,
               "Value": "100"
            },
            {
               "Id": 4,
               "Value": "Web"
            },
            {
               "Id": 9,
               "Value":"SIM"
            }
         ],
         "Shipping":{
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[
               {
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[
                     {
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
         }
      }
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Store identifier at Braspag.|GUID|36|Yes|
|`MerchantKey`|Public key for dual authentication with Braspag.|Text|40|Yes|
|`RequestId`|Store-defined request identifier.|GUID|36|No|
|`MerchantOrderId`|Order ID number.|Text|50|Yes|
|`Customer.Name`|Customer's full name.|Text|120|Yes|
|`Customer.Identity`|Customer's ID number.|Text|16|Yes|
|`Customer.IdentityType`|Customer's ID document type.<br/>Possible values: CPF / CNPJ.|Text|255|No|
|`Customer.Email`|Customer's email address.|Text|100|Yes|
|`Customer.Birthdate`|Customer's date of birth.<br/>E.g.: 1991-01-10.|Date|10|Yes|
|`Customer.Phone`|Customer's phone number.<br/>E.g.: 5521976781114.|Text|15|Yes|
|`Customer.Address.Street`|Billing address street.|Text|54|Yes|
|`Customer.Address.Number`|Billing address number.|Text|5|Yes|
|`Customer.Address.Complement`|Billing address additional information.|Text|14|No|
|`Customer.Address.ZipCode`|Billing address zip code.|Text|9|Yes|
|`Customer.Address.City`|Billing address city.|Text|50|Yes|
|`Customer.Address.State`|Billing address status.|Text|2|Yes|
|`Customer.Address.Country`|Billing address country.<br/>For details, refer to [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Text|2|Yes|
|`Customer.Address.District`|Billing address neighborhood.|Text|45|Yes|
|`Customer.DeliveryAddress.Street`|Delivery address street.|Text|54|No|
|`Customer.DeliveryAddress.Number`|Delivery address number.|Text|5|No|
|`Customer.DeliveryAddress.Complement`|Delivery address additional information.|Text|14|No|
|`Customer.DeliveryAddress.ZipCode`|Delivery address zip code.|Text|9|No|
|`Customer.DeliveryAddress.City`|Delivery address city.|Text|50|No|
|`Customer.DeliveryAddress.State`|Delivery address state.|Text|2|No|
|`Customer.DeliveryAddress.Country`|Delivery address country.<br/>For details, refer to [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui).|Text|2|No|
|`Customer.DeliveryAddress.District`|Delivery address neighborhood.|Text|45|No|
|`Payment.Provider`|Name of authorization provider.|Text|15|Yes|
|`Payment.Type`|Type of payment method.<br/>Note: Only "CreditCard" type works with fraud analysis.|Text|100|Yes|
|`Payment.Amount`|Financial transaction amount in cents.<br/>E.g.: 150000 = $ 1,500.00.|Number|15|Yes|
|`Payment.ServiceTaxAmount`|Applicable to airlines only. Amount of the authorization to be allocated to service fee.<br/> Note: This amount is not added to the authorization value.|Number|15|No|
|`Payment.Currency`|Currency in which the payment will be made.<br/>Possible values: BRL / USD / MXN / COP / PLC / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP.|Text|3|No|
|`Payment.Country`|Country in which the payment will be made.|Text|3|No|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.Interest`|Installment type.<br/>Possible values: "ByMerchant" / "ByIssuer".|Text|10|No|
|`Payment.Capture`|Indicates if the authorization will use automatic capture.<br/>Possible values: true / false (default). <br/> Note: Check with the acquirer about the availability of this feature.<br/>Note2: This field must be completed in accordance with the fraud analysis flow.|Boolean|---|No|
|`Payment.Authenticate`|Indicates if the transaction will be authenticated.<br/>Possible values: "true" / "false" (default).<br/>Note: Check with the acquirer about the availability of this feature.|Boolean|---|No|
|`Payment.Recurrent`|Indicates if the transaction is of recurring type.<br/>Possible values: "true" / "false" (default).<br/>Note: "true" will not create a recurrence, but  only allow a transaction to continue without the need to send the CVV. It will also indicate to the acquirer that it's the charging of a recurrence transaction.<br/> Note2: For **Cielo** transactions only.<br/> Note3: The `Payment.Authenticate` field must be "false" when this one is "true".|Boolean|---|No|
|`Payment.SoftDescriptor`|Text that will be printed on the bearer's invoice. <br/> Note: The value of this field must be clear and easy for the bearer to identify the place of purchase as it is one of the main chargeback offenders.|Text|13|No|
|`Payment.DoSplit`|Indicates if the transaction will be split among multiple participants.<br/> Possible values: "true" / "false" (default).<br/> To use the split payment functionality, you must contract the solution with Braspag.|Boolean|---|No|
|`Payment.ExtraDataCollection.Name`|Extra field identifier to be sent.|Text|50|No|
|`Payment.ExtraDataCollection.Value`|Extra field value to be sent.|Text|1024|No|
|`Payment.Credentials.Code`|Affiliation generated by the acquirer.|Text|100|Yes|
|`Payment.Credentials.Key`|Affiliation key/token generated by the acquirer.|Text|100|Yes|
|`Payment.Credentials.Username`|User generated by the **Getnet** acquirer.<br/> Note: The field must be submitted if the transaction is directed to Getnet.|Text|50|No|
|`Payment.Credentials.Password`|Password generated with the Acquirer Getnet <br/> Note: The field must be submitted if the transaction is directed to Getnet.|Text|50|No|
|`Payment.Credentials.Signature`|Terminal ID with the **Global Payments** acquirer.<br/> Note: This field must be submitted if the transaction is directed to Global Payments.|Text|3|No|
|`Payment.CreditCard.CardNumber`|Credit card number.|Text|19|Yes|
|`Payment.CreditCard.Holder`|Holder name printed on credit card. Note: Size regulation may vary depending on the acquirer.|Text|25|Yes|
|`Payment.CreditCard.ExpirationDate`|Credit card expiration date.|Text|7|Yes|
|`Payment.CreditCard.SecurityCode`|Security code printed on the back of the credit card.|Text|4|Yes|
|`Payment.CreditCard.Brand`|Credit card brand.|Text|10|Yes|
|`Payment.CreditCard.SaveCard`|Indicates if the credit card data will be stored in *Cartão Protegido*.|Boolean|---|No|
|`Payment.CreditCard.Alias`|Credit card alias saved to *Cartão Protegido*.|Text|64|No|
|`Payment.FraudAnalysis.Sequence`|Fraud analysis flow type.<br/> Possible values: "AnalyseFirst" / "AuthorizeFirst".|Text|14|Yes|
|`Payment.FraudAnalysis.SequenceCriteria`|Fraud analysis flow criteria.<br/> Possible values: "OnSuccess" / "Always".|Text|9|Yes|
|`Payment.FraudAnalysis.Provider`|Anti-fraud analysis provider.<br/> Possible value: "Cybersource"|Text|10|Yes|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indicates if the transaction will be captured after the fraud analysis.<br/> Possible values: "true" / "false" (default)<br/> Note: When sent as "true" and the fraud analysis returns it as low risk ("*Accept*") the previously authorized transaction will be captured.<br/>Note2: When sent as "true" and the fraud analysis returns it as "*Review*" the transaction will be authorized. It will be captured after Braspag receives notification of the status change to low risk ("*Accept*").<br/> Note: To use this parameter, the sequence of the risk analysis flow (`FraudAnalysis.Sequence`) must be "AuthorizeFirst".|Boolean|---|No|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indicates if the transaction will be captured after the fraud analysis. <br/> Possible values: "true" / "false" (default).<br/> Note: When sent as "true" and the fraud analysis returns it as of high risk ("*Reject*") the previously authorized transaction will be canceled.<br/>Note2: When sent as "true" and the fraud analysis returns it as "*Review*" the transaction will remain authorized. It will be cancelled after Braspag receives notification of the status change to high risk ("*Reject*").<br/> Note: To use this parameter, the sequence of the risk analysis flow (`FraudAnalysis.Sequence`) must be "AuthorizeFirst".|Boolean|---|No|
|`Payment.FraudAnalysis.TotalOrderAmount`|Order total value in cents.<br/> E.g.: 123456 = R $ 1,234.56|Number|15|Yes|
|`Payment.FraudAnalysis.FingerPrintId`|Identifier used to crosscheck information obtained from the shopper's device. This same identifier must be used to generate the value to be assigned to the `session_id` field of the script, which will be included in the checkout page. <br/> Note: This identifier can be any value or order number, but must be unique for 48 hours.|Text|100|Yes|
|`Payment.FraudAnalysis.Browser.HostName`|Host name entered by the shopper's browser and identified through the HTTP header.|Text|60|No|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifies if the shopper's browser accepts cookies. <br/> Possible values: "true" / "false". (default)|Boolean|---|Yes|
|`Payment.FraudAnalysis.Browser.Email`|Email registered in the shopper's browser. May differ from store registration email (`Customer.Email`).|Text|100|No|
|`Payment.FraudAnalysis.Browser.Type`|Name of browser used by the shopper and identified via HTTP header.<br/> E.g.: Google Chrome, Mozilla Firefox, Safari, etc.|Text|40|No|
|`Payment.FraudAnalysis.Browser.IpAddress`|Shopper's IP address. IPv4 or IPv6 format.|Text|45|Yes|
|`Payment.FraudAnalysis.Cart.IsGift`|Indicates if the order placed by the shopper is a gift.|Boolean|---|No|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indicates if the shopper's order can be returned to the store.<br/> Possible values: "true" / "false" (default).|Boolean|---|No|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Identifies the evaluation of the billing and delivery addresses for different cities, states or countries.<br/> [Value List - Payment.Fraudanalysis.Cart.Items {n} .GiftCategory]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].giftcategory)|Text|9|No|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Importance level, in the fraud analysis, of shopper's IP address and email address.<br/> [Value List - Payment.Fraudanalysis.Cart.Items {n }.HostHedge]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].hosthedge)|Text|6|No|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Importance level, in the fraud analysis, of the meaningless shopper's data checks. <br/> [List of Values - Cart.Items {n}.NonSensicalHedge]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].nonsensicalhedge)|Text|6|No|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Importance level, in the fraud analysis, of the checks on shopper's data containing obscenity.  <br/> [Value List - Payment.Fraudanalysis.Cart.Items {n} .ObscenitiesHedge]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].obscenitieshedge)|Text|6|No|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Importance level, in the fraud analysis, of the checks on shopper's phone numbers.  <br/> [List of Values - Payment.Fraudanalysis.Cart.Items {n} .PhoneHedge]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].phonehedge)|Text|6|No|
|`Payment.FraudAnalysis.Cart.Items.Name`|Product Name|Text|255|Yes|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Product quantity.|Number|15|Yes|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (Stock Keeping Unit) of the product.|Text|255|Yes|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Unit price.<br/> E.g.: 10950 = $ 109.50.|Number|15|Yes|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Product risk level associated with the amount of chargebacks. <br/> [List of Values - Payment.Fraudanalysis.CartI.tems {n}.Risk]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].risk)|Text|6|No|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Importance level, in the fraud analysis, of time of the day the order was placed. <br/> [List of Payments - Payment.Fraudanalysis.Cart.Items {n }.TimeHedge]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].timehedge)|Text|6|No|
|`Payment.FraudAnalysis.Cart.Items.Type`|Product category. <br/> [Value List - Payment.Fraudanalysis.Cart.Items {n}.Type]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].type)|Text|19|No|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Importance level, in the fraud analysis, of shopper's purchase frequency within the previous 15 minutes.<br/> [List of Values - Payment.Fraudanalysis.Cart.Items { n}.VelocityHedge]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].velocityhedge)|Text|6|No|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|ID of additional information to be sent. <br/> [Tabela de MDDs]({{site.baseurl_root}}manual/braspag-pagador#tabela-de-mdds)|Número|2|Sim|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Value of additional information to be sent. <br/> [MDDs table]({{site.baseurl_root}}manual/braspag-pagador#tabela-de-mdds)|Text|255|Yes|
|`Payment.FraudAnalysis.Shipping.Addressee`|Full name of the responsible for receiving the product at the shipping address.|Text|120|No|
|`Payment.FraudAnalysis.Shipping.Method`|Shipping delivery method. <br/> [Lista de Valores - Payment.Fraudanalysis.Shipping.Method]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.shipping.method)|Texto|8|Não|
|`Payment.FraudAnalysis.Shipping.Phone`|Phone number of the responsible for receiving the product at the shipping address. <br/> E.g.: 552121114700.|Text|15|No|
|`Payment.FraudAnalysis.Travel.JourneyType`|Trip type. <br/> [Value List - Payment.FraudAnalysis.Travel.JourneyType]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.journeytype)|Texto|32|No|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Date and time of departure. <br/> E.g.: 2018-03-31 19:16:38.|DateTime|---|No|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Passenger's full name.|Text|120|No|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Passenger's document number.|Text|32|No|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Airline rating. <br/> [List of Values - Payment.FraudAnalysis.Travel.Passengers {n}.Status]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].status)|Text|15|No|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Passenger type. <br/> [Value List - Payment.FraudAnalysis.Travel.Passengers {n}.PassengerType]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].rating)|Text|13|No|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Passenger's email.|Text|255|No|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Passenger's phone. <br/> E.g.: 552121114700|Text|15|No|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Departure airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Text|3|No|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Arrival airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Text|3|No|

<aside class="warning">The fields of the "FraudAnalysis.Travel" node become required if your business segment is the airline segment.</aside>

### Response

```json
{
   "MerchantOrderId":"2017051002",
   "Customer":{
      "Name": "shopper Name",
      "Identity": "12345678910",
      "IdentityType": "CPF",
      "Email": "shopper@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114"
      "Address":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Message",
      "DoSplit":false,
      "CreditCard":{
         "CardNumber":"455187******0181",
         "Holder": "Cardholder Name",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard": "false"
      },
      "Credentials":{
         "code":"9999999",
         "key":"D8888888",
         "password":"LOJA9999999",
         "username":"#Braspag2018@NOMEDALOJA#",
         "signature":"001"
      },
      "ExtraDataCollection":[
         {
            "Name":"FieldName",
            "Value":"FieldValue"
         }
      ],
      "FraudAnalysis": {
         "Sequence": "AnalyseFirst",
         "SequenceCriteria": "Always",
         "Provider": "Cybersource",
         "CaptureOnLowRisk": false,
         "VoidOnHighRisk": false,
         "TotalOrderAmount": 10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{
            "CookiesAccepted":false,
            "Email": "shopper@braspag.com.br",
            "HostName":"Test",
            "IpAddress": "127.0.0.1",
            "Type": "Chrome"
         },
         "Cart": {
            "IsGift": false,
            "ReturnsAccepted": true,
            "Items":[
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               }
            ]
         },
         "MerchantDefinedFields":[
            {
               "Id": 2,
               "Value": "100"
            },
            {
               "Id": 4,
               "Value": "Web"
            },
            {
               "Id": 9,
               "Value":"SIM"
            }
         ],
         "Shipping":{
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[
               {
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[
                     {
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
        },
        "Id": "0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
        "Status": 1,
        "FraudAnalysisReasonCode": 100,
        "ReplyData": {
            "AddressInfoCode":"COR-BA^MM-BIN",
            "FactorCode":"B^D^R^Z",
            "Score":42,
            "BinCountry": "us",
            "CardIssuer":"FIA CARD SERVICES, N.A.",
            "CardScheme":"VisaCredit",
            "HostSeverity":1,
            "InternetInfoCode":"FREE-EM^RISK-EM",
            "IpRoutingMethod": "Undefined",
            "ScoreModelUsed": "default_lac",
            "CasePriority": 3,
            "ProviderTransactionId":"5220688414326697303008"
         }
      },
      "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
      "ProofOfSale": "20170510053219433",
      "AcquirerTransactionId": "0510053219433",
      "AuthorizationCode": "936403",
      "ReceivedDate": "2017-05-10 17:32:19",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 17:32:19",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "Status": 2,
      "ProviderReturnCode": "6",
      "ProviderReturnMessage": "Operation Successful",
      "Links": [{
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"
      }]
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId":"2017051002",
   "Customer":{
      "Name": "shopper Name",
      "Identity": "12345678910",
      "IdentityType": "CPF",
      "Email": "shopper@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114"
      "Address":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27th floor",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country": "BR",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Message",
      "DoSplit":false,
      "CreditCard":{
         "CardNumber":"455187******0181",
         "Holder": "Cardholder Name",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard": "false"
      },
      "Credentials":{
         "code":"9999999",
         "key":"D8888888",
         "password":"LOJA9999999",
         "username":"#Braspag2018@NOMEDALOJA#",
         "signature":"001"
      },
      "ExtraDataCollection":[
         {
            "Name":"FieldName",
            "Value":"FieldValue"
         }
      ],
      "FraudAnalysis": {
         "Sequence": "AnalyseFirst",
         "SequenceCriteria": "Always",
         "Provider": "Cybersource",
         "CaptureOnLowRisk": false,
         "VoidOnHighRisk": false,
         "TotalOrderAmount": 10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{
            "CookiesAccepted":false,
            "Email": "shopper@braspag.com.br",
            "HostName":"Test",
            "IpAddress": "127.0.0.1",
            "Type": "Chrome"
         },
         "Cart": {
            "IsGift": false,
            "ReturnsAccepted": true,
            "Items":[
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {
                  "GiftCategory": "Undefined",
                  "HostHedge": "Off",
                  "NonSensicalHedge": "Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTest2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               }
            ]
         },
         "MerchantDefinedFields":[
            {
               "Id": 2,
               "Value": "100"
            },
            {
               "Id": 4,
               "Value": "Web"
            },
            {
               "Id": 9,
               "Value":"SIM"
            }
         ],
         "Shipping":{
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[
               {
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[
                     {
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
        },
        "Id": "0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
        "Status": 1,
        "FraudAnalysisReasonCode": 100,
        "ReplyData": {
            "AddressInfoCode":"COR-BA^MM-BIN",
            "FactorCode":"B^D^R^Z",
            "Score":42,
            "BinCountry": "us",
            "CardIssuer":"FIA CARD SERVICES, N.A.",
            "CardScheme":"VisaCredit",
            "HostSeverity":1,
            "InternetInfoCode":"FREE-EM^RISK-EM",
            "IpRoutingMethod": "Undefined",
            "ScoreModelUsed": "default_lac",
            "CasePriority": 3,
            "ProviderTransactionId":"5220688414326697303008"
         }
      },
      "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
      "ProofOfSale": "20170510053219433",
      "AcquirerTransactionId": "0510053219433",
      "AuthorizationCode": "936403",
      "ReceivedDate": "2017-05-10 17:32:19",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 17:32:19",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "Status": 2,
      "ProviderReturnCode": "6",
      "ProviderReturnMessage": "Operation Successful",
      "Links": [{
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"
      }]
   }
}
```

|Property|Description|Type|
|:-|:-|:-|
|`MerchantOrderId`|Order ID number.|Text|
|`Customer.Name`|Shopper's full name.|Text|
|`Customer.Identity`|Shopper's identification number.|Text|
|`Customer.IdentityType`|Shopper's ID type.|Text|
|`Customer.Email`|Shopper's email.|Text|
|`Customer.Birthdate`|Shopper's date of birth.|Date|
|`Customer.Phone`|Shopper's phone number.|Text|
|`Customer.Address.Street`|Billing address street.|Text|
|`Customer.Address.Number`|Billing address number.|Text|
|`Customer.Address.Complement`|Billing address additional information.|Text|
|`Customer.Address.ZipCode`|Billing address postcode.|Text|
|`Customer.Address.City`|Billing address city.|Text|
|`Customer.Address.State`|Billing address state.|Text|
|`Customer.Address.Country`|Billing address country.|Text|
|`Customer.Address.District`|Billing address neighborhood.|Text|
|`Customer.DeliveryAddress.Street`|Delivery address street.|Text|
|`Customer.DeliveryAddress.Number`|Delivery address number.|Text|
|`Customer.DeliveryAddress.Complement`|Delivery address additional information.|Text|
|`Customer.DeliveryAddress.ZipCode`|Delivery address zip code.|Text|
|`Customer.DeliveryAddress.City`|Delivery address city.|Text|
|`Customer.DeliveryAddress.State`|Delivery address status.|Text |
|`Customer.DeliveryAddress.Country`|Delivery address country.|Text|
|`Customer.DeliveryAddress.District`|Delivery address neighborhood.|Text|
|`Payment.Provider`|Name of authorization provider.|Text|
|`Payment.Type`|Type of payment method.|Text|
|`Payment.Amount`|Transaction amount in cents.|Number|
|`Payment.ServiceTaxAmount`|Amount of authorization amount to be used for service charge.|Number|
|`Payment.Currency`|Currency in which the payment will be made.|Text|
|`Payment.Country`|Country in which the payment will be made.|Text|
|`Payment.Installments`|Number of installments.|Number |
|`Payment.Interest`|Installment type.|Text|
|`Payment.Capture`|Indicates if authorization will have automatic capture.|Boolean|
|`Payment.Authenticate`|Indicates if the transaction will be authenticated.|Boolean|
|`Payment.Recurrent`|Indicates if the transaction is of recurring type.|Boolean|
|`Payment.SoftDescriptor`|Text that will be printed on the invoice.|Text|
|`Payment.DoSplit`|Indicates if the transaction will be split among multiple participants.|Boolean|
|`Payment.ExtraDataCollection.Name`|Extra field identifier to be sent.|Text|
|`Payment.ExtraDataCollection.Value`|Extra field value to be sent.|Text|
|`Payment.Credentials.Code`|Affiliation generated by the acquirer.|Text|
|`Payment.Credentials.Key`|Affiliation key / token generated by the acquirer.|Text|
|`Payment.Credentials.Username`|User generated on accreditation with the Getnet acquirer.|Text|
|`Payment.Credentials.Password`|Password generated on accreditation with the Getnet acquirer.|Text|
|`Payment.Credentials.Signature`|Terminal ID in accreditation with the Global Payments acquirer.|Text|
|`Payment.CreditCard.CardNumber`|Credit card number.|Text|
|`Payment.CreditCard.Holder`|Holder's name printed on the credit card.|Text|
|`Payment.CreditCard.ExpirationDate`|Credit card expiration date.|Text|
|`Payment.CreditCard.SecurityCode`|Security code printed on the back of the credit card.|Text|
|`Payment.CreditCard.Brand`|Credit card brand.|Text|
|`Payment.CreditCard.SaveCard`|Indicates if the credit card data will be stored in *Cartão Protegido*.|Boolean|
|`Payment.CreditCard.Alias`|Credit card alias saved in *Cartão Protegido*.|Text |
|`Payment.CreditCard.CardToken`|Credit card identifier saved in *Cartão Protegido*.|GUID|
|`Payment.FraudAnalysis.Sequence`|Fraud analysis flow type.|Text|
|`Payment.FraudAnalysis.SequenceCriteria`|Fraud analysis flow criteria.|Text|
|`Payment.FraudAnalysis.Provider`|Anti-fraud analysis provider.|Text|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indicates if transaction will be captured after the fraud analysis.|Boolean|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indicates if the transaction will be canceled after the fraud analysis.|Boolean|
|`Payment.FraudAnalysis.TotalOrderAmount`|Total order value in cents.|Number|
|`Payment.FraudAnalysis.FingerPrintId`|Identifier used to crosscheck information obtained from the shopper's device.|Text|
|`Payment.FraudAnalysis.Browser.HostName`|Host name entered by the shopper's browser and identified through the HTTP header.|Text|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifies if the shopper's browser accepts cookies.|Boolean|
|`Payment.FraudAnalysis.Browser.Email`|Email registered in the shopper's browser. May differ from the store registration email (`Customer.Email`).|Text|
|`Payment.FraudAnalysis.Browser.Type`|Name of browser used by shopper and identified through the HTTP header.|Text|
|`Payment.FraudAnalysis.Browser.IpAddress`|Shopper's IP address. IPv4 or IPv6 format.|Text|
|`Payment.FraudAnalysis.Cart.IsGift`|Indicates if the order placed by the shopper is a gift.|Boolean|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indicates if the order placed by the shopper can be returned to the store.|Boolean|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Identifies the evaluation of the billing and delivery addresses for different cities, states or countries.|Text|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Importance level, in the fraud analysis, of the shopper's IP and email addresses.|Text|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Importance level, in the fraud analysis, of the meaningless shopper's data checks.|Text|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Importance level, in the fraud analysis, of the shopper's data checks with obscenity.|Text|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Importance level, in the fraud analysis, of the shopper's phone number checks.|Text|
|`Payment.FraudAnalysis.Cart.Items.Name`|Product name.|Text|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Product quantity.|Number|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (Stock Keeping Unit) of the product.|Text|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Unit price of the product.|Number|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Product risk level associated with the amount of chargebacks.|Text|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Importance level, in the fraud analysis, of time of the day in which the shopper placed the order.|Text|
|`Payment.FraudAnalysis.Cart.Items.Type`|Product category.|Text|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Importance level, in the fraud analysis, of shopper's purchase frequency within the previous 15 minutes.|Text|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|ID of the additional information to be sent.|Number|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Value of the additional information to be sent.|Text|
|`Payment.FraudAnalysis.Shipping.Addressee`|Full name of the responsible for receiving the product at the shipping address.|Text|
|`Payment.FraudAnalysis.Shipping.Method`|Order delivery.|Text|
|`Payment.FraudAnalysis.Shipping.Phone`|Phone number of the responsilbe for receiving the product at the shipping address.|Number|
|`Payment.FraudAnalysis.Travel.JourneyType`|Trip type.|Text|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Date and time of departure.|DateTime|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Passenger's full name.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Passenger's document number.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Airline classification.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Passenger type.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Passenger's email.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Passenger's phone.|Number|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Departure airport code.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Arrival airport code.|Text|
|`Payment.FraudAnalysis.Id`|Anti-fraud analysis transaction ID Braspag|GUID|
|`Payment.FraudAnalysis.Status`|Braspag anti-fraud analysis transaction status.<br/> [List of Values - Payment.FraudAnalysis.Status]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.status).|Number|
|`Payment.FraudAnalysis.FraudAnalysisReasonCode`|Cybersouce return code [  <br/> List of Values - Payment.FraudAnalysis.FraudAnalysisReasonCode]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.fraudanalysisreasoncode).|Number|
|`Payment.FraudAnalysis.ReplyData.AddressInfoCode`|Codes indicate incompatibilities between shopper's billing and delivery addresses. <br/> Codes are concatenated using a ^ character. E.g.: COR-BA^MM-BIN. <br/> [List of Payments - Payment. FraudAnalysis.ReplyData.AddressInfoCode]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.addressinfocode).|Text|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Codes that affected the analysis score. <br/> Codes are concatenated using the ^ character. E.g.: B^D^R^Z. <br/>[List of Values - ProviderAnalysisResult.AfsReply.FactorCode]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.factorcode).|Text|
|`Payment.FraudAnalysis.ReplyData.Score`|Score from the fraud analysis. Value between 0 and 100.|Number|
|`Payment.FraudAnalysis.ReplyData.BinCountry`|Card BIN country code used in the analysis. More information at [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Text|
|`Payment.FraudAnalysis.ReplyData.CardIssuer`|Name of the bank or credit card issuer.|Text|
|`Payment.FraudAnalysis.ReplyData.CardScheme`|Card brand.|Text|
|`Payment.FraudAnalysis.ReplyData.HostSeverity`|Shopper's email domain risk level, from 0 to 5, where 0 is undetermined risk and 5 represents the highest risk.|Number|
|`Payment.FraudAnalysis.ReplyData.InternetInfoCode`|Codes that indicate problems with the email address, IP address, or billing address. <br/> Codes are concatenated using the ^ character. E.g.: FREE-EM^RISK-EM <br/> [List of Payments - Payment.FraudAnalysis.ReplyData.InternetInfoCode]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.internetinfocode).|Text|
|`Payment.FraudAnalysis.ReplyData.IpRoutingMethod`|Shopper's routing method obtained from the IP address. <br/> [Value List - Payment.FraudAnalysis.ReplyData.IpRoutingMethod]({{site.baseurl_root}}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.iproutingmethod).|Text|
|`Payment.FraudAnalysis.ReplyData.ScoreModelUsed`|Name of the score model used in the analysis. In case you have no template defined, the default template from Cybersource is used.|Text|
|`Payment.FraudAnalysis.ReplyData.CasePriority`|Defines the priority level of merchant rules or profiles. The priority level ranges from 1 (highest) to 5 (lowest) and the default value is 3; and this will be assigned if you have not set the priority of rules or profiles. This field is only returned if the store subscribes to *Enhanced Case Management*.|Number|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Transaction ID in Cybersource.|Text|
|`Payment.PaymentId`|Transaction identifier in Pagador.|GUID|
|`Payment.AcquirerTransactionId`|Transaction identifier at the acquirer.|Text|
|`Payment.ProofOfSale`|Voucher number at the acquirer (NSU - Unique Transaction Sequence Number).|Text|
|`Payment.AuthorizationCode`|Authorization code at the acquirer.|Text|
|`Payment.ReceivedDate`|Date the transaction was received by Pagador. <br/> E.g.: 2018-01-16 16:38:19.|Datetime|
|`Payment.CapturedDate`|Date the transaction was captured at the acquirer.  <br/> E.g.: 2018-01-16 16:38:20.|Datetime|
|`Payment.CapturedAmount`|Amount captured in the transaction, in cents. <br/> E.g.: 123456 = $ 1,234.56.|Number|
|`Payment.ECI`|*Electronic Commerce Indicator*. Code generated in a credit transaction with external authentication.|Text|
|`Payment.ReasonCode`|Operation return code.|Text|
|`Payment.ReasonMessage`|Operation return message.|Text|
|`Payment.Status`|Transaction Status on Pagador. <br/> [Transaction Status List]({{site.baseurl_root}}manual/braspag-pagador#lista-de-status-transação).|Number|
|`Payment.ProviderReturnCode`|Code returned by acquirer or issuer.|Text|
|`Payment.ProviderReturnMessage`|Message returned by acquirer or issuer.|Text|

### Configuring Fingerprint

The *fingerprint* is an important component of the anti-fraud analysis. It is a script that must be added to your website in order to capture important data about the device being used for the transaction, such as the machine IP, browser version and operating system used.
Sometimes only the cart information is not enough to guarantee an assertive analysis. The data collected by the fingerprint adds on to the analysis, making sure your store is better protected.

This page describes how to integrate and set up fingerprint in your checkout and mobile page.

#### Checkout Integration

In order to integrate the fingerprint technology into your checkout page, you must add two tags to its source code: 

* the *script* tag, inside the *head* tag for an accurate performance;
* the *noscript* tag, inside the *body* tag, for collecting the device data even when the browser's Javascript is disabled. 

<aside class="warning">ATTENTION: If the 2 code snippets are not added to the checkout page, the fraud analysis results may not be accurate.</aside>

##### Filling in the URL

Two variables must be filled in the Javascript URL: the `org_id` and the` session_id`. The `org_id` variable has a preset value, while the `session_id` variable holds the concatenation of the `ProviderMerchantId` and `FraudAnalysis.FingerPrintId` parameters, as shown below:

|Variable|Description|
|:-|:-|
|`org_id`|for Sandbox = "1snn5n9w"  <br/> for Production = "k8vif92e"|
|`session_id`|`ProviderMerchantId`(Your store identifier at Cybersource. Contact Braspag in case you don't have one.) <br/> `FraudAnalysis.FingerPrintId` (Identifier used to crosscheck information obtained from the shopper's device.) <br/><br/>Note: This identifier can have any value or be the order number, but it must be unique for 48 hours.|

##### Applying the Script

This is the script template:

![Example Code](https://braspag.github.io/images/braspag/af/exemploscriptdfp.png)

After being properly filled in, the variables will provide a URL as in the example below:

![Url Example](https://braspag.github.io/images/braspag/af/urldfp-en-menor.png)

<aside class="notice">Make sure to copy all data accurately and have all the variables correctly replaced with their respective values.</aside>

#### Mobile Apps Integration

<aside class="notice">Use your integration ticket to request the SDKs (iOS and Android) and guidelines for this integration.</aside>

## Implementing ACI Worldwide Analysis

> In the fraud analysis request with ACI Worldwide, submit the `Payment.FraudAnalysis.Provider` field as "RedShield".

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"123456",
   "Customer":{  
      "Name":"Comprador Teste",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "mobile": "5511940028922",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":true,
      "SoftDescriptor":"Mensagem",
      "DoSplit":false,
      "CreditCard":{  
         "CardNumber":"455184******0181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2028",
         "SecurityCode":"***",
         "Brand":"Visa",
         "SaveCard":"true"
      },
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"RedShield",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":true,
            "IpAddress":"127.0.0.1"
         },
         "Cart":{  
            "IsGift":true,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "Name":"ItemTeste1",
                  "Quantity":2,
                  "Sku":"20170511",
                  "UnitPrice":20000
               },
               {  
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":26,
               "Value":"nomedousuario"
            },
            {  
               "Id":27,
               "Value":"120"
            },
            {  
               "Id":28,
               "Value":"12"
            },
            {  
               "Id":29,
               "Value":"WEB"
            }
         ],
         "Shipping":{
            "Addressee":"Nome do destinatario",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{  
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[  
               {  
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
         }
      }
   }
}
```

```shell
{  
   "MerchantOrderId":"123456",
   "Customer":{  
      "Name":"Comprador Teste",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "mobile": "5511940028922",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":true,
      "SoftDescriptor":"Mensagem",
      "DoSplit":false,
      "CreditCard":{  
         "CardNumber":"455184******0181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2028",
         "SecurityCode":"***",
         "Brand":"Visa",
         "SaveCard":"true"
      },
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"RedShield",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":true,
            "IpAddress":"127.0.0.1"
         },
         "Cart":{  
            "IsGift":true,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "Name":"ItemTeste1",
                  "Quantity":2,
                  "Sku":"20170511",
                  "UnitPrice":20000
               },
               {  
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":26,
               "Value":"nomedousuario"
            },
            {  
               "Id":27,
               "Value":"120"
            },
            {  
               "Id":28,
               "Value":"12"
            },
            {  
               "Id":29,
               "Value":"WEB"
            }
         ],
         "Shipping":{
            "Addressee":"Nome do destinatario",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{  
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[  
               {  
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
         }
      }
   }
}
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|----|-------|-----------|---------|
|`MerchantOrderId`|Order ID number.|Text|50|Yes|
|`Customer.Name`|Customer's name.|Text|120|Yes|
|`Customer.Identity`|Customer's ID number.|Text|16|Yes|
|`Customer.IdentityType`|Customer's ID document type (CPF or CNPJ).|Text|255|No|
|`Customer.Email`|Customer's email address.|Text|100|Yes|
|`Customer.Birthdate`|Customer's date of birth. <br/> E.g.: 1991-01-10.|Date|10|Yes|
|`Customer.Phone`|Customer's phone number. <br/> E.g.: 5521976781114.|Text|15|Yes|
|`Customer.Mobile`|Customer's mobile phone number. <br/> E.g.: 5521976781114.|Text|15|Yes|
|`Customer.Address.Street`|Customer's address street.|Text|54|Yes|
|`Customer.Address.Number`|Customer's address number.|Text|5|Yes|
|`Customer.Address.Complement`|Customer's address additional information.|Text|14|No|
|`Customer.Address.ZipCode`|Customer's address zip code.|Text|9|Yes|
|`Customer.Address.City`|Customer's address zip code.|Text|9|Yes|
|`Customer.Address.State`|Customer's address state.|Text|2|Yes|
|`Customer.Address.Country`|Customer's country<br/>More information in [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Text|2|Yes|
|`Customer.Address.District`|Customer's neighborhood.|Text|50|Yes|
|`Customer.DeliveryAddress.Street`|Delivery address street.|Text|255|No|
|`Customer.DeliveryAddress.Number`|Delivery address number.|Text|15|No|
|`Customer.DeliveryAddress.Complement`|Delivery address additional information.|Text|50|No|
|`Customer.DeliveryAddress.ZipCode`|Delivery address zip code.|Text|9|No|
|`Customer.DeliveryAddress.City`|Delivery address city.|Text|50|No|
|`Customer.DeliveryAddress.State`|Delivery address state.|Text|2|No|
|`Customer.DeliveryAddress.Country`|Delivery address country<br/>More information in [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Text|2|No|
|`Customer.DeliveryAddress.District`|Delivery address neighborhood.|Text|50|No|
|`Payment.Provider`|Name of payment method provider.|Text|15|Yes|
|`Payment.Type`|Payment method type.<br/>Note: Only "CreditCard" works with fraud analysis.|Text|100|Yes|
|`Payment.Amount`|Order amount in cents.|Number|15|Yes|
|`Payment.Currency`|Currency in which the payment will be made.<br> Possible values: BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP.|Text|3|No|
|`Payment.Country`|Country in which the payment will be made.|Text|3|No|
|`Payment.Installments`|Number of installments.|Number|2|Yes|
|`Payment.Interest`|Installment type - Store ("ByMerchant") or Issuer ("ByIssuer").|Text|10|No|
|`Payment.Capture`|Indicates whether the authorization will use automatic capture ("true") or not ("false"). <br/> 1st note:  Please check with acquirer about the availability of this feature. <br/> 2nd note: This field should be filled according to the fraud analysis flow. |Boolean|---|No|
|`Payment.Authenticate`|Indicates whether the transaction will be authenticated ("true") or not ("false"). <br/> 1st note:  Please check with acquirer about the availability of this feature.<br/> 2nd note: The `Payment.Recurrent` field should be "true" when this one is "false".|Boolean|---|No|
|`Payment.Recurrent`|Indicates whether the transaction is of recurring type ("true") or not ("false") <br/> 1st note: The "true" value will not set a new recurrence, it will only allow the execution of a transaction without the need to send CVV. <br/> 2nd note: Only for **Cielo** transactions. <br/> 3rd note:`Authenticate` must be "false" when `Recurrent` is "true".|Boolean|---|No|
|`Payment.SoftDescriptor`|Text to be printed on shopper's invoice. <br/> Note: The value of this field should make it easy for the cardholder to identify the establishment where the purchase was made, as it is one of the main offenders for chargeback.|Text|13|No|
|`Payment.DoSplit`|Indicates whether the transaction will be split between multiple accounts ("true") or not ("false"). <br/> To use the payment split functionality, it is necessary to contract the solution with Braspag.|Boolean|---|No|
|`Payment.CreditCard.CardNumber`|Customer's card number.|Text|19|Yes|
|`Payment.CreditCard.Holder`|Name of cardholder printed on the card. Note: The size of the field can change depending on the acquirer.|Text|25|Yes|
|`Payment.CreditCard.ExpirationDate`|Expiration date printed on the card.|Text|7|Yes|
|`Payment.CreditCard.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`Payment.CreditCard.Brand`|Card brand.|Text|10|Yes|
|`Payment.CreditCard.SaveCard`|Indicates if the credit card data will be stored in *Cartão Protegido*.|Boolean|---|No|
|`Payment.FraudAnalysis.Sequence`|Fraud analysis flow type.<br/> Possible values: "AnalyseFirst" / "AuthorizeFirst".|Text|14|Yes|
|`Payment.FraudAnalysis.SequenceCriteria`|Fraud analysis flow criteria.<br/> Possible values: "OnSuccess" / "Always".|Text|9|Yes|
|`Payment.FraudAnalysis.Provider`|Anti-fraud analysis provider.<br/> Possible value for ACI Worldwide: "RedShield"|Text|10|Yes|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indicates if the transaction will be captured after the fraud analysis.<br/> Possible values: "true" / "false" (default)<br/> Note: When sent as "true" and the fraud analysis returns it as low risk ("*Accept*") the previously authorized transaction will be captured.<br/>Note2: When sent as "true" and the fraud analysis returns it as "*Review*" the transaction will be authorized. It will be captured after Braspag receives notification of the status change to low risk ("*Accept*").<br/> Note: To use this parameter, the sequence of the risk analysis flow (`FraudAnalysis.Sequence`) must be "AuthorizeFirst".|Boolean|---|No|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indicates if the transaction will be captured after the fraud analysis. <br/> Possible values: "true" / "false" (default).<br/> Note: When sent as "true" and the fraud analysis returns it as of high risk ("*Reject*") the previously authorized transaction will be canceled.<br/>Note2: When sent as "true" and the fraud analysis returns it as "*Review*" the transaction will remain authorized. It will be cancelled after Braspag receives notification of the status change to high risk ("*Reject*").<br/> Note: To use this parameter, the sequence of the risk analysis flow (`FraudAnalysis.Sequence`) must be "AuthorizeFirst".|Boolean|---|No|
|`Payment.FraudAnalysis.TotalOrderAmount`|Order total value in cents.<br/> E.g.: 123456 = R $ 1,234.56|Number|15|Yes|
|`Payment.FraudAnalysis.FingerPrintId`|Identifier used to crosscheck information obtained from the shopper's device. This same identifier must be used to generate the value to be assigned to the `session_id` field of the script, which will be included in the checkout page. <br/> Note: This identifier can be any value or order number, but must be unique for 48 hours.|Text|100|Yes|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifies if the shopper's browser accepts cookies. <br/> Possible values: "true" / "false". (default)|Boolean|---|Yes|
|`Payment.FraudAnalysis.Browser.IpAddress`|Shopper's IP address. IPv4 or IPv6 formats.|Text|45|Yes|
|`Payment.FraudAnalysis.Cart.IsGift`|Indicates if the order made by the shopper is a gift.|Boolean|---|No|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indicates if the shopper's order can be returned to the store.<br/> Possible values: "true" / "false" (default).|Boolean|---|No|
|`Payment.FraudAnalysis.Cart.Items.Name`|Product Name|Text|255|Yes|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Product quantity.|Number|15|Yes|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (Stock Keeping Unit) of the product.|Text|255|Yes|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Unit price.<br/> E.g.: 10950 = $ 109.50.|Number|15|Yes|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|ID of additional information to be sent. <br/> [MDD Table](https://braspag.github.io//en/manual/braspag-pagador#mdd-table)|Number|2|Yes|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Value of additional information to be sent. <br/> [MDD Table](https://braspag.github.io//en/manual/braspag-pagador#mdd-table).|Text|255|Yes|
|`Payment.FraudAnalysis.Shipping.Addressee`|Full name of the responsible for receiving the product at the shipping address.|Text|120|No|
|`Payment.FraudAnalysis.Shipping.Method`|Shipping delivery method. <br/> [List of Values - Shipping Method](https://braspag.github.io//en/manual/braspag-pagador#value-list-payment.fraudanalysis.shipping.method).|Text|8|No|
|`Payment.FraudAnalysis.Shipping.Phone`|Phone number of the responsible for receiving the product at the shipping address. <br/> E.g.: 552121114700.|Text|15|No|
|`Payment.FraudAnalysis.Travel.JourneyType`|Trip type. <br/> [List of Values - Payment.FraudAnalysis.Travel.JourneyType](https://braspag.github.io//en/manual/braspag-pagador#list-of-values-payment.fraudanalysis.travel.journeytype)|Text|32|No|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Date and time of departure. <br/> E.g.: 2018-03-31 19:16:38.|DateTime|---|No|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Passenger's full name.|Text|120|No|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Passenger's document number.|Text|32|No|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Airline rating. <br/> [List of Values - Status](https://braspag.github.io//en/manual/braspag-pagador#value-list-payment.fraudanalysis.travel.passengers-[n].status).|Text|15|No|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Passenger type. <br/> [List of Values - Payment.FraudAnalysis.Travel.Passengers {n}.PassengerType](https://braspag.github.io//en/manual/braspag-pagador#value-list-payment.fraudanalysis.travel.passengers-[n].rating)|Text|13|No|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Passenger's email.|Text|255|No|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Passenger's phone number. <br/> E.g.: 552121114700|Text|15|No|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Departure airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Text|3|No|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|eparture airport code. More information at [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Text|3|No|

<aside class="warning">*The fields of the "FraudAnalysis.Travel" node become mandatory if your business segment is air travel.</aside>

### Response

```json
{
    "MerchantOrderId": "123456",
    "Customer": {
        "Name": "Comprador Teste",
        "Identity": "12345678910",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Phone": "5521976781114",
        "Birthdate": "1991-01-02",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "Mobile": "5511940028922"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": true,
        "CreditCard": {
            "CardNumber": "455184******0181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2028",
            "SaveCard": true,
            "Brand": "Visa"
        },
        "ProofOfSale": "836045",
        "AcquirerTransactionId": "0527060143139",
        "AuthorizationCode": "095614",
        "SoftDescriptor": "Mensagem",
        "SentOrderId": "20220527180141FEC711",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
            "Provider": "RedShield",
            "CaptureOnLowRisk": false,
            "VoidOnHighRisk": false,
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "26",
                    "Value": "nomedousuario"
                },
                {
                    "Id": "27",
                    "Value": "120"
                },
                {
                    "Id": "28",
                    "Value": "12"
                },
                {
                    "Id": "29",
                    "Value": "WEB"
                }
            ],
            "Cart": {
                "IsGift": true,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Name": "ItemTeste1",
                        "Sku": "20170511",
                        "UnitPrice": 20000,
                        "Quantity": 2
                    },
                    {
                        "Name": "ItemTeste2",
                        "Sku": "20170512",
                        "UnitPrice": 10000,
                        "Quantity": 1
                    }
                ]
            },
            "Travel": {
                "DepartureTime": "2018-01-09T18:00:00",
                "JourneyType": "OneWayTrip",
                "Passengers": [
                    {
                        "Name": "Passenger Test",
                        "Identity": "212424808",
                        "Status": "Gold",
                        "Rating": "Adult",
                        "Email": "email@mail.com",
                        "Phone": "5564991681074",
                        "TravelLegs": [
                            {
                                "Destination": "GIG",
                                "Origin": "AMS"
                            }
                        ]
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": true,
                "IpAddress": "127.0.0.1"
            },
            "Shipping": {
                "Addressee": "Nome do destinatario",
                "Phone": "551121840540",
                "Method": "LowCost"
            },
            "Id": "3c31b840-30f0-49a5-40c1-08da39ba639e",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "FactorCode": "000.000.000",
                "ProviderTransactionId": "153322379407",
                "ReturnMessage": "Transaction succeeded",
                "ProviderOrderId": "000591000001XAA20220527170142439",
                "ReturnCode": "0100"
            }
        },
        "DoSplit": false,
        "PaymentId": "b705b792-e5c0-4386-9f44-b07a791fb972",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2022-05-27 18:01:41",
        "CapturedAmount": 10000,
        "CapturedDate": "2022-05-27 18:01:43",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972/void"
            }
        ]
    }
}
```

```shell
{
    "MerchantOrderId": "123456",
    "Customer": {
        "Name": "Comprador Teste",
        "Identity": "12345678910",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Phone": "5521976781114",
        "Birthdate": "1991-01-02",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "Mobile": "5511940028922"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": true,
        "CreditCard": {
            "CardNumber": "455184******0181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2028",
            "SaveCard": true,
            "Brand": "Visa"
        },
        "ProofOfSale": "836045",
        "AcquirerTransactionId": "0527060143139",
        "AuthorizationCode": "095614",
        "SoftDescriptor": "Mensagem",
        "SentOrderId": "20220527180141FEC711",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
            "Provider": "RedShield",
            "CaptureOnLowRisk": false,
            "VoidOnHighRisk": false,
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "26",
                    "Value": "nomedousuario"
                },
                {
                    "Id": "27",
                    "Value": "120"
                },
                {
                    "Id": "28",
                    "Value": "12"
                },
                {
                    "Id": "29",
                    "Value": "WEB"
                }
            ],
            "Cart": {
                "IsGift": true,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Name": "ItemTeste1",
                        "Sku": "20170511",
                        "UnitPrice": 20000,
                        "Quantity": 2
                    },
                    {
                        "Name": "ItemTeste2",
                        "Sku": "20170512",
                        "UnitPrice": 10000,
                        "Quantity": 1,
                    }
                ]
            },
            "Travel": {
                "DepartureTime": "2018-01-09T18:00:00",
                "JourneyType": "OneWayTrip",
                "Passengers": [
                    {
                        "Name": "Passenger Test",
                        "Identity": "212424808",
                        "Status": "Gold",
                        "Rating": "Adult",
                        "Email": "email@mail.com",
                        "Phone": "5564991681074",
                        "TravelLegs": [
                            {
                                "Destination": "GIG",
                                "Origin": "AMS"
                            }
                        ]
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": true,
                "IpAddress": "127.0.0.1"
            },
            "Shipping": {
                "Addressee": "Nome do destinatario",
                "Phone": "551121840540",
                "Method": "LowCost"
            },
            "Id": "3c31b840-30f0-49a5-40c1-08da39ba639e",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "FactorCode": "000.000.000",
                "ProviderTransactionId": "153322379407",
                "ReturnMessage": "Transaction succeeded",
                "ProviderOrderId": "000591000001XAA20220527170142439",
                "ReturnCode": "0100"
            }
        },
        "DoSplit": false,
        "PaymentId": "b705b792-e5c0-4386-9f44-b07a791fb972",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2022-05-27 18:01:41",
        "CapturedAmount": 10000,
        "CapturedDate": "2022-05-27 18:01:43",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972/void"
            }
        ]
    }
}
```

|Property|Description|Type|
|---|---|---|
|`MerchantOrderId`|Order ID number.|Text|
|`Customer.Name`|Shopper's full name.|Text|
|`Customer.Identity`|Shopper's identification number.|Text|
|`Customer.IdentityType`|Shopper's ID type.|Text|
|`Customer.Email`|Shopper's ID type.|Text|
|`Customer.Birthdate`|Shopper's date of birth.|Date|
|`Customer.Phone`|Shopper's phone number.|Text|
|`Customer.Address.Street`|Billing address street.|Text|
|`Customer.Address.Number`|Billing address number.|Text|
|`Customer.Address.Complement`|Billing address additional information.|Text|
|`Customer.Address.ZipCode`|Billing address postcode.|Text|
|`Customer.Address.City`|Billing address city.|Text|
|`Customer.Address.State`|Billing address state.|Text|
|`Customer.Address.Country`|Billing address country.|Text|
|`Customer.Address.District`|Billing address neighborhood.|Text|
|`Customer.Address.AddressType`|Billing address type.|Text|
|`Customer.DeliveryAddress.Street`|Delivery address street.|Text|
|`Customer.DeliveryAddress.Number`|Delivery address number.|Text|
|`Customer.DeliveryAddress.Complement`|Delivery address number.|Text|
|`Customer.DeliveryAddress.ZipCode`|Delivery address zip code.|Text|
|`Customer.DeliveryAddress.City`|Delivery address city.|Text|
|`Customer.DeliveryAddress.State`|Delivery address state.|Text|
|`Customer.DeliveryAddress.Country`|Delivery address country.|Text|
|`Customer.DeliveryAddress.District`|Delivery address neighborhood.|Text|
|`Customer.DeliveryAddress.AddressType`|Delivery address type.|Texto|
|`Customer.Mobile`|Shopper's phone number.|Text|
|`Payment.ServiceTaxAmount`|Name of authorization provider.|Text|
|`Payment.Installments`|Number of installments.|Number|
|`Payment.Interest`|Installment type.|Text|
|`Payment.Capture`|Indicates if authorization will have automatic capture.|Boolean|
|`Payment.Authenticate`|Indicates if the transaction will be authenticated.|Boolean|
|`Payment.Recurrent`|Indicates if the transaction is of recurring type.|Boolean|
|`Payment.CreditCard.CardNumber`|Credit card number.|Text|
|`Payment.CreditCard.Holder`|Holder's name printed on the credit card.|Text|
|`Payment.CreditCard.ExpirationDate`|Credit card expiration date.|Text|
|`Payment.CreditCard.SaveCard`|Indicates if the credit card data will be stored in *Cartão Protegido*.|Boolean|
|`Payment.CreditCard.Brand`|Credit card brand.|Text|
|`Payment.ProofOfSale`|Receipt number (NSU - Número Sequencial Único).|Text|
|`Payment.AcquirerTransactionId`|Transaction identifier at acquirer.|Text|
|`Payment.AuthorizationCode`|Authorization code at acquirer.|Text|
|`Payment.SoftDescriptor`|Text that will be printed on the invoice.|Text|
|`Payment.SentOrderId`|Additional number to the MerchantOrderId generated for the order and used during the transaction. This number (SentOrderId) will only be different in case of compliance with the acquirer's rules or in case of repeated order identification numbers (MerchantOrderId).|Text|
|`Payment.FraudAnalysis.Sequence`|Fraud analysis flow type.|Text|
|`Payment.FraudAnalysis.SequenceCriteria`|Fraud analysis flow criteria.|Text|
|`Payment.FraudAnalysis.FingerPrintId`|Identifier used to cross information obtained from the shopper's device.|Text|
|`Payment.FraudAnalysis.Provider`|*Antifraude* provider.|Text|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indicates if transaction will be captured after the fraud analysis.|Boolean|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indicates if the transaction will be canceled after the fraud analysis.|Boolean|
|`Payment.FraudAnalysis.TotalOrderAmount`|Total order value in cents.|Number|
|`Payment.FraudAnalysis.IsRetryTransaction`|Retry of an analysis, and must be sent with a value equal to TRUE when the return code in the first attempt is equal to BP900.|Boolean|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|ID of the additional information to be sent.|Number
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Value of the additional information to be sent.|Text|
|`Payment.FraudAnalysis.Cart.IsGift`|Indicates whether the order placed by the shopper is for a gift.|Boolean|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indicates whether the order placed by the shopper can be returned to the store.|Boolean|
|`Payment.FraudAnalysis.Cart.Items.Name`|Product name.|Text|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (Stock Keeping Unit) of the product.|Text|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Unit price of the product.|Number|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Product quantity.|Number|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Date and time of departure.|DateTime|
|`Payment.FraudAnalysis.Travel.JourneyType`|Trip type.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Passenger's full name.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Passenger's document number.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Passenger's full name.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Passenger's document number.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Passenger's email.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Passenger's phone.|Number|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Arrival airport code.|Text|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Departure airport code.|Text|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifies if the shopper's browser accepts cookies.|Boolean|
|`Payment.FraudAnalysis.Browser.IpAddress`|Shopper's IP address. IPv4 or IPv6 format.|Text|
|`Payment.FraudAnalysis.Shipping.Addressee`|Full name of the responsible for receiving the product at the shipping address.|Text|
|`Payment.FraudAnalysis.Shipping.Phone`|Phone number of the responsilbe for receiving the product at the shipping address.|Number|
|`Payment.FraudAnalysis.Shipping.Method`|Order delivery.|Text|
|`Payment.FraudAnalysis.Id`|*Antifraude* analysis transaction ID Braspag|GUID|
|`Payment.FraudAnalysis.Status`|Braspag anti-fraud analysis transaction status.<br/> [List of Values - Payment.FraudAnalysis.Status](https://braspag.github.io//en/manual/braspag-pagador#list-of-values-payment.fraudanalysis.status).|Number|
|`Payment.FraudAnalysis.StatusDescription`|Status description.|Text|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Codes that affected the analysis score. <br/> Codes are concatenated using the ^ character. E.g.: B^D^R^Z. <br/>[List of Values - ProviderAnalysisResult.AfsReply.FactorCode](https://braspag.github.io//en/manual/braspag-pagador#value-list-payment.fraudanalysis.replydata.factorcode).|Text|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Transaction ID at ACI Worldwide.|Text|
|`Payment.FraudAnalysis.ReplyData.ReturnMessage`|Message returned by Antifraud provider|Text|
|`Payment.FraudAnalysis.ReplyData.ProviderOrderId`|Order ID at ACI Worldwide.|Text|
|`Payment.FraudAnalysis.ReplyData.ReturnCode`|Code returned by the payment method provider (acquirer or issuer).| Text|
|`Payment.DoSplit`|Indicates whether the transaction will be split between several participants.|Boolean|
|`Payment.PaymentId`|Transaction identifier in Pagador Braspag.|GUID|
|`Payment.Type`|Payment method type. Note: Only the “CreditCard” type works with fraud analysis.|Text|
|`Payment.Amount`|Financial transaction amount, in cents. Ex.: 150000 = BRL 1,500.00. |Text|
|`Payment.ReceivedDate`|Date on which the transaction was received at Pagador Braspag. <br/> E.g.: 2018-01-16 16:38:19.|Datetime|
|`Payment.CapturedAmount`|Amount captured from the transaction, in cents. <br/> E.g.: 123456 = BRL 1,234.56.|Number|
|`Payment.CapturedDate`|Date the transaction was captured at the acquirer. <br/> E.g.: 2018-01-16 16:38:20.|Datetime|
|`Payment.Currency`| Currency in which the payment will be made. Possible values: “BRL” / “USD” / “MXN” / “COP” / “CLP” / “ARS” / “PEN” / “EUR” / “PYN” / “UYU” / “VEB” / “VEF” / “GBP”.|No|
|`Payment.Country`|Country in which the payment will be made.|Text|
|`Payment.Provider`|Authorization provider name.|Text|
|`Payment.ReasonCode`|Operation return code.|Text|
|`Payment.ReasonMessage`|Operation return message.|Text|
|`Payment.Status`|Transaction status in Pagador. <br/> [Transaction Status List](https://braspag.github.io//en/manual/braspag-pagador#transaction-status-list).|Number|
|`Payment.ProviderReturnCode`|Code returned by acquirer or issuer.|Text|
|`Payment.ProviderReturnMessage`|Message returned by acquirer or issuer.|Text|

### Fingerprint with ACI

The Fingerprint is the digital identification of the shopper's device. This identification is made up of a series of data collected on the checkout page of the website or application. To set up Fingerprint with ACI, see the [Antifraud Gateway](https://braspag.github.io//manual/antifraude#fingerprint-com-a-aci-worldwide){:target="_blank"} manual.

# Queries

There are different ways to perform the query of a sale or transaction. Depending on its lifetime, here are the 3 forms:

|LIFETIME|FORM OF QUERY|
|---|---|
|Up to 3 months|Via API or Admin Braspag panel.|
|From 3 to 12 months|Via Admin Braspag panel with the “History” option selected.|
|Over 12 months|Contact your Braspag Commercial Executive directly.|

## Querying a Transaction via PaymentID

In order to include the `Chargeback` node in your response, Braspag must receive your store's chargebacks. You will be able to either accept or dispute the operations, and then track their progress in the Admin Braspag panel. Your store can be informed of the transactions with issued chargebacks through the Notification Post. The operations displayed in the Admin Braspag panel are also available in the [Risk Notification API](https://braspag.github.io//en/manual/risknotification){:target="_blank"}.

In order to include the `FraudAlert` node in your response, Braspag must receive your store's fraud alerts. They will be available in the Admin Braspag panel. Your store will be informed of the transactions with issued fraud alerts through the Notification Post.

### Credit Card Transaction

In order to query a credit card transaction via PaymentID, you must send an HTTP message through the GET method to the *Payment* resource, as in the example:

#### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales/{PaymentId}</span></aside>

```shell
--request GET "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`PaymentId`|Payment identification number.|Text|36|Yes (through endpoint)|

#### Response

```json
{
   "MerchantOrderId": "2017051001",
   "Customer": {
      "Name": "Nome do Cliente",
      "Identity": "01234567789",
      "Email": "cliente@email.com.br",
      "Address": {
         "Street": "GONCALO DA CUNHA",
         "Number": "111",
         "ZipCode": "04140040",
         "City": "SAO PAULO",
         "State": "SP",
         "Country": "BRA",
         "District": "CHACARA INGLESA"
      }
   },
   "Merchant": {
      "Id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "TradeName": "Lojas Teste"
   },
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardNumber": "455187******0181",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2021",
         "Brand": "Visa"
      },
      "ProofOfSale": "2539492",
      "AcquirerTransactionId": "0510042539492",
      "AuthorizationCode": "759497",
      "Eci": "0",
      "Refunds": [
         {
            "Amount": 10000,
            "Status": 3,
            "ReceivedDate": "2017-05-15 16:25:38"
         }
      ],
      "Chargebacks": [
         {
            "Amount": 10000,
            "CaseNumber": "123456",
            "Date": "2017-06-04",
            "ReasonCode": "104",
            "ReasonMessage": "Outras Fraudes - Cartao Ausente",
            "Status": "Received",
            "RawData": "Client did not participate and did not authorize transaction"
         }
      ],
      "FraudAlert": {
         "Date": "2017-05-20",
         "ReasonMessage": "Uso Ind Numeração",
         "IncomingChargeback": false
      },
      "VelocityAnalysis": {
         "Id": "f8078b32-be17-4c35-b164-ad74c3cd0725",
         "ResultMessage": "Accept",
         "Score": 0
      },
      "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-10 16:25:38",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 16:25:38",
      "VoidedAmount": 10000,
      "VoidedDate": "2017-05-15 16:25:38",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ProviderDescription": "Simulado",
      "ReasonCode": 0,
      "Status": 1,
      "Links": [
         {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
         },
         {
            "Method": "PUT",
            "Rel": "capture",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
         },
         {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
         }
      ]
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId": "2017051001",
   "Customer": {
      "Name": "Nome do Cliente",
      "Identity": "01234567789",
      "Email": "cliente@email.com.br",
      "Address": {
         "Street": "GONCALO DA CUNHA",
         "Number": "111",
         "ZipCode": "04140040",
         "City": "SAO PAULO",
         "State": "SP",
         "Country": "BRA",
         "District": "CHACARA INGLESA"
      }
   },
   "Merchant": {
      "Id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "TradeName": "Lojas Teste"
   },
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardNumber": "455187******0181",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2021",
         "Brand": "Visa"
      },
      "ProofOfSale": "2539492",
      "AcquirerTransactionId": "0510042539492",
      "AuthorizationCode": "759497",
      "Eci": "0",
      "Refunds": [
         {
            "Amount": 10000,
            "Status": 3,
            "ReceivedDate": "2017-05-15 16:25:38"
         }
      ],
      "Chargebacks": [
         {
            "Amount": 10000,
            "CaseNumber": "123456",
            "Date": "2017-06-04",
            "ReasonCode": "104",
            "ReasonMessage": "Outras Fraudes - Cartao Ausente",
            "Status": "Received",
            "RawData": "Client did not participate and did not authorize transaction"
         }
      ],
      "FraudAlert": {
         "Date": "2017-05-20",
         "ReasonMessage": "Uso Ind Numeração",
         "IncomingChargeback": false
      },
      "VelocityAnalysis": {
         "Id": "f8078b32-be17-4c35-b164-ad74c3cd0725",
         "ResultMessage": "Accept",
         "Score": 0
      },
      "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-10 16:25:38",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 16:25:38",
      "VoidedAmount": 10000,
      "VoidedDate": "2017-05-15 16:25:38",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ProviderDescription": "Simulado",
      "ReasonCode": 0,
      "Status": 1,
      "Links": [
         {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
         },
         {
            "Method": "PUT",
            "Rel": "capture",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
         },
         {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
         }
      ]
   }
}
```

|Property|Description|Type|Size|Format|
|--------|-----------|----|----|-------|
|`MerchantOrderId`|Order ID number.|Text|50|Alphanumeric|
|`Customer.Name`|Customer's name.|Text|255|Alphanumeric|
|`Customer.Identity`|Customer's ID.|Text|14|Alphanumeric text|
|`Customer.IdentityType`|Type of customer's ID document (CPF or CNPJ).|Text|255|"CPF" / "CNPJ"|
|`Customer.Email`|Customer's email.|Text|255|Alphanumeric|
|`Customer.Birthdate`|Customer's date of birth.|Date|10|format YYYY-MM-DD|
|`Customer.Address.Street`|Customer's contact address.|Text|255|Alphanumeric|
|`Customer.Address.Number`|Customer's contact number.|Text|15|Alphanumeric|
|`Customer.Address.Complement`|Customer's contact address additional information.|Text|50|Alphanumeric|
|`Customer.Address.ZipCode`|Customer's contact address zip code.|Text|9|Alphanumeric|
|`Customer.Address.City`| Customer's contact address city.|Text|50|Alphanumeric|
|`Customer.Address.State`|Customer's contact address status.|Text|2|Alphanumeric|
|`Customer.Address.Country`|Customer's contact address country.|Text|35|Alphanumeric|
|`Customer.Address.District`|Customer's contact address neighborhood.|Text|50|Alphanumeric|
|`Customer.DeliveryAddress.Street`|Order delivery address.|Text|255|Alphanumeric|
|`Customer.DeliveryAddress.Number`|Order delivery address number.|Text|15|Alphanumeric|
|`Customer.DeliveryAddress.Complement`|Order delivery address additional information.|Text|50|Alphanumeric|
|`Customer.DeliveryAddress.ZipCode`|Order delivery address zip code.|Text|9|Alphanumeric|
|`Customer.DeliveryAddress.City`|Order delivery address city.|Text|50|Alphanumeric|
|`Customer.DeliveryAddress.State`|Order delivery address status.|Text|2|Alphanumeric|
|`Customer.DeliveryAddress.Country`|Order delivery address country.|Text|35|Alphanumeric|
|`Customer.DeliveryAddress.District`|Orde delivery address neighborhood.|Text|50|Alphanumeric|
|`Merchant.Id`|MerchantID where the transaction was made.|GUID|36|"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"|
|`Merchant.TradeName`|Store name.|Text|50|Alphanumeric|
|`Payment.Provider`|Name of the payment provider.|Text|15|Check list of providers in the annexes.|
|`Payment.Country`|Country in which the payment will be made.|Text|3|"BRA"|
|`Payment.Type`|Payment method type.|Text|100|E.g.: "CreditCard"|
|`Payment.Amount`|Order value in cents.|Number|15|"10000"|
|`Payment.ServiceTaxAmount`|Amount of authorization amount to be used for service charge. Note: This value is not added to the authorization value.|Number|15|"10000"|
|`Payment.Currency`|Currency in which the payment will be made.|Text|3|BRL/USD/MXN/COP/PLC/ARS/PEN/EUR/PYN/UYU/VEB/VEF/GBP|
|`Payment.Installments`|Number of installments.|Number|2|"6"|
|`Payment.Interest`|Installment type.|Text|10|"ByMerchant" (store) / "ByIssuer" (issuer)|
|`Payment.Capture`|Indicates whether the authorization will have automatic capture or not. Note: Check with the acquirer for the availability of this feature.|Boolean|---|"true" / "false" (default)|
|`AcquirerTransactionId`|Transaction ID of the payment method provider.|Text|40|Alphanumeric|
|`Payment.Authenticate`|Indicates whether the transaction will be authenticated or not. Note: Check with the acquirer for the availability of this feature.|Boolean|---| "true" / "false" (default)|
|`Payment.Recurrent`|Indicates whether the transaction is recurring or not. Note: “true” will not create a recurrence, but only allow a transaction to continue without the need to send the CVV.<br/>Note2: For Cielo transactions only.<br/>Note3: The `Payment.Authenticate` field must be “false” when this one is “true”.|Boolean|---|"true" / "false" (default)|
|`Payment.SoftDescriptor`|Text to be printed on the invoice.|Text|13|Alphanumeric text|
|`Payment.ExtraDataCollection.Name`|Name of the extra data field.|Text|50|Alphanumeric text|
|`Payment.ExtraDataCollection.Value`|Value of the extra data field.|Text|1024|Alphanumeric text|
|`ProofOfSale`|Proof of sale number.|Text|20|Alphanumeric|
|`Payment.AuthorizationCode`|Authorization code.|Text|300|Alphanumeric text|
|`Payment.Refunds.Amount`|Refunded amount in cents.|Number|15|"10000"|
|`Payment.Refunds.Status`|Refund status.|Number|1|Received = "1", Sent = "2", Approved = "3", Denied = "4", Rejected = "5"|
|`Payment.Refunds.ReceivedDate`|Refund date. E.g.: "2018-06-19 01:45:57"|Text|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Chargebacks [n].Amount`|Chargeback amount.|Number|15|10000|
|`Payment.Chargebacks [n].CaseNumber`|Chargeback-related case number.|Text|16|Alphanumeric text|
|`Payment.Chargebacks [n].Date`|Chargeback date.|Date|10|YYYY-MM-DD|
|`Payment.Chargebacks [n].ReasonCode`|Chargeback reason code.|Text|10|Alphanumeric|
|`Payment.Chargebacks [n].ReasonMessage`|Chargeback reason message.|Text|512|Alphanumeric|
|`Payment.Chargebacks [n].Chargeback Status`|[Value List - Payment.Chargebacks {n}.Status]({{site.baseurl_root}}/manual/braspag-pagador#lista-de-valores-payment.chargebacks[n].status).|Text|32|Text|
|`Payment.Chargebacks [n].RawData`|Data sent by the acquirer (cardholder or other message).|Text|512|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"|
|`ReceivedDate`|Date the transaction was received by Braspag.|Text|19|YYYY-MM-DD HH:mm:SS|
|`Payment.ReasonCode`|Acquisition return code.|Text|32|Alphanumeric|
|`Payment.ReasonMessage`|Acquisition return message.|Text|512|Alphanumeric|
|`Payment.CapturedAmount`|Valor capturado.|Número|15|10000|
|`Payment.CapturedDate`|Data da captura. E.g.: "2018-06-19 01:45:57".|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.VoidedAmount`|Valor cancelado/estornado.|Número|15|10000|
|`Payment.VoidedDate`|Data do cancelamento/estorno. E.g.: "2018-06-19 01:45:57".|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Status`|Transaction status.|Byte|2|E.g.: "1"|
|`Payment.Provider`|Provider used.|Texto|32|"Simulado"|
|`Payment.ProviderDescription`|Name of the acquirer.|Texto|512|"Simulado"|
|`CreditCard.CardNumber`|Customer’s card number.|Text|19|---|
|`CreditCard.Holder`|Name of the cardholder printed on the card.|Text|25|---|
|`CreditCard.ExpirationDate`|Expiration date printed on the card.|Text|7|---|
|`CreditCard.Brand`|Card brand.|Text|10|---|
|`CreditCard.SaveCard`|Identifies whether the card will be saved to generate the token (*CardToken*).|Boolean|---|"true" / "false" (default)|

### Registered Boleto Transaction

In order to query a registered boleto transaction via PaymentID, you must send an HTTP message through the GET method to the *Payment* resource, as in the example:

#### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales/{PaymentId}</span></aside>

```shell
--request GET "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`PaymentId`|Payment identification number.|GUID|36|Yes (through endpoint)|

#### Response

```json
{
  "MerchantOrderId": "2017051001",
  "Customer":{
    "Name": "Customer Name",
    "Identity":"12345678909",
    "Address":{
        "Street": "GONCALO DA CUNHA",
        "Number": "111",
        "ZipCode": "04140040",
        "City": "SAO PAULO",
        "State":"SP",
        "Country":"BRA",
        "District": "CHACARA INGLESA"
     }
  },
  "Payment":{
     "Instructions": "",
     "ExpirationDate": "2018-06-27",
     "Demonstrative": "",
     "Url": "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX",
     "BoletoNumber": "123464",
     "BarCodeNumber": "9999990276000001234864001834099999999",
     "DigitableLine": "99999.39027 60000.012348 64001.834007 7 75680999999999",
     "Assignor": "RAZAO SOCIAL DA LOJA LTDA.",
     "Address": "",
     "Identification": "01234567000189",
     "CreditDate": "2018-06-28",
     "PaymentId": "99992279-1c45-4271-9656-ccbde4ea9999",
     "Type": "Boleto",
     "Amount": 182000,
     "ReceivedDate": "2018-06-26 23:33:07",
     "CapturedAmount": 182000,
     "CapturedDate": "2018-06-27 01:45:57",
     "Currency":"BRL",
     "Country":"BRA",
     "Provider": "Bradesco2",
     "ReturnUrl": "https://www.loja.com.br/notificacao",
     "ExtraDataCollection": [],
     "ReasonCode": 0,
     "Status": 2,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
      },
      {
        "Method": "PUT",
        "Rel": "capture",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
      }
    ]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "MerchantOrderId": "2017051001",
  "Customer":{
    "Name": "Customer Name",
    "Identity":"12345678909",
    "Address":{
        "Street": "GONCALO DA CUNHA",
        "Number": "111",
        "ZipCode": "04140040",
        "City": "SAO PAULO",
        "State":"SP",
        "Country":"BRA",
        "District": "CHACARA INGLESA"
     }
  },
  "Payment":{
     "Instructions": "",
     "ExpirationDate": "2018-06-27",
     "Demonstrative": "",
     "Url": "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX",
     "BoletoNumber": "123464",
     "BarCodeNumber": "9999990276000001234864001834099999999",
     "DigitableLine": "99999.39027 60000.012348 64001.834007 7 75680999999999",
     "Assignor": "RAZAO SOCIAL DA LOJA LTDA.",
     "Address": "",
     "Identification": "01234567000189",
     "CreditDate": "2018-06-28",
     "PaymentId": "99992279-1c45-4271-9656-ccbde4ea9999",
     "Type": "Boleto",
     "Amount": 182000,
     "ReceivedDate": "2018-06-26 23:33:07",
     "CapturedAmount": 182000,
     "CapturedDate": "2018-06-27 01:45:57",
     "Currency":"BRL",
     "Country":"BRA",
     "Provider": "Bradesco2",
     "ReturnUrl": "https://www.loja.com.br/notificacao",
     "ExtraDataCollection": [],
     "ReasonCode": 0,
     "Status": 2,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
      },
      {
        "Method": "PUT",
        "Rel": "capture",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
      }
    ]
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`MerchantOrderId`|Order ID number.|Text|50|Alphanumeric|
|`Customer.Name`|Customer's name.|Text|255|Alphanumeric|
|`Customer.Identity`|Customer's ID number (CPF or CNPJ).|Text|14|Alphanumeric text|
|`Customer.IdentityType`|Type of customer's ID document (CPF or CNPJ).|Text|255|"CPF" / "CNPJ"|
|`Customer.Email`|Customer's email.|Text|255|Alphanumeric|
|`Customer.Birthdate`|Customer's date of birth.|Date|10|format YYYY-MM-DD|
|`Customer.Address.Street`|Customer's contact address.|Text|255|Alphanumeric|
|`Customer.Address.Number`|Customer's contact number.|Text|15|Alphanumeric|
|`Customer.Address.Complement`|Customer's contact address additional information.|Text|50|Alphanumeric|
|`Customer.Address.ZipCode`|Customer's contact address zip code.|Text|9|Alphanumeric|
|`Customer.Address.City`|Customer's contact address city.|Text|50|Alphanumeric text|
|`Customer.Address.State`|Customer's contact address status.|Text|2|Alphanumeric|
|`Customer.Address.Country`|Customer's contact address country.|Text|35|Alphanumeric|
|`Customer.Address.District`|Customer's contact address neighborhood.|Text|50|Alphanumeric|
|`Customer.DeliveryAddress.Street`|Order delivery address.|Text|255|Alphanumeric|
|`Customer.DeliveryAddress.Number`|Order delivery address number.|Text|15|Alphanumeric|
|`Customer.DeliveryAddress.Complement`|Order delivery address additional information.|Text|50|Alphanumeric|
|`Customer.DeliveryAddress.ZipCode`|Order delivery address zip code.|Text|9|Alphanumeric|
|`Customer.DeliveryAddress.City`|Order delivery address city.|Text|50|Alphanumeric|
|`Customer.DeliveryAddress.State`|Order delivery address status.|Text|2|Alphanumeric|
|`Customer.DeliveryAddress.Country`|Order delivery address country.|Text|35|Alphanumeric|
|`Customer.DeliveryAddress.District`|Order delivery address neighborhood.|Text|50|Alphanumeric|
|`Payment.Provider`|Name of the payment provider.|Text|15|Check list of providers in the annexes.|
|`Payment.Type`|Payment method type.|Text|100|E.g.: Boleto|
|`Payment.Amount`|Order value in cents.|Number|15|"10000"|
|`Payment.CapturedAmount`|Boleto paid amount in cents.|Number|15|"10000"|
|`Payment.Instructions`|Any specific statement for the boleto.|Text|Check [Specific Rules by Issuer](#boleto-conciliation).|E.g.: "Do not pay after expiration date"|
|`Payment.Demonstrative`|Any specific information for the boleto.|Text|Check [Specific Rules by Issuer](#boleto-conciliation).|E.g: "Boleto for the Order #99999"|
|`Payment.Url`|URL for displaying the boleto.|Text|-|E.g.: "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX"|
|`Payment.BoletoNumber`|Our number.|Text|Check [Specific Rules by Issuer](#boleto-conciliation).|E.g.: "12345678"|
|`Payment.BarCodeNumber`|Boleto's bar code.|Text|44|E.g.: "99999390276000001234864001834007775680099999"|
|`Payment.DigitableLine`|Boleto's digitable line.|Text|54|E.g.: "99999.39027 60000.012348 64001.834007 7 75680000199999"|
|`Payment.Assignor`|Name of the assignor.|Text|200|E.g.: "SHOP LTDA SOCIAL REASON"|
|`Payment.Address`|Address of the assignor.|Text|160|E.g.: "Alameda Xingu 512"|
|`Payment.Identification`|CNPJ of the assignor.|Text|18|E.g.: "11.355.111/0001-11"|
|`Payment.ExpirationDate`|Boleto's expiration date.|Text|YYYY-MM-DD|E.g.: "2018-06-21"|
|`Payment.CreditDate`|Boleto's liquidation date.|Text|YYYY-MM-DD|E.g.: "2018-06-19"|
|`Payment.CapturedDate`|Bill payment date.|Text|YYYY-MM-DD HH:mm:SS|E.g.: "2018-06-19 01:45:57"|
|`Payment.ReceivedDate`|Date the transaction was received by Braspag.|Text|YYYY-MM-DD HH:mm:SS|"2018-06-19 01:45:57"|
|`Payment.ReturnUrl`|URL of the store to which the customer is redirected.|Text|-|E.g.: "https://www.loja.com.br"|
|`Payment.Currency`|Currency in which the payment will be made.|Text|3|BRL/USD/MXN/COP/PLC/ARS/PEN/EUR/PYN/UYU/VEB/VEF/GBP|
|`Payment.Country`|Country in which the payment will be made.|Text|3|"BRA"|
|`Payment.ExtraDataCollection.Name`|Name of the extra data field.|Text|50|Alphanumeric text|
|`Payment.ExtraDataCollection.Value`|Value of the extra data field.|Text|1024|Alphanumeric text|
|`PaymentId`|Order identifier field.|GUID|36|"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"|
|`Payment.ReasonCode`|Acquirer's return code.|Text|32|Alphanumeric|
|`Payment.Status`|Transaction status.|Byte|2|E.g.: 1|

## Querying a Sale by the Store Identifier

It is not possible to query a payment directly by the identifier submitted by the store (`MerchantOrderId`), but it is possible to obtain all `PaymentIds` associated with the identifier.

In order to query a sale by the store identifier, you must send an HTTP message through the GET method to the */sales* resource, as in the example:

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales?merchantOrderId = {merchantOrderId}</span></aside>

```shell
--request GET "https://apiquerysandbox.braspag.com.brv2/sales?merchantOrderId={merchantOrderId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`MerchantOrderId`|Order ID number.|Text|36|Yes (through endpoint)|

### Response

```json
{
    "Payment": [
        {
            "PaymentId": "5fb4d606-bb63-4423-a683-c966e15399e8",
            "ReceveidDate": "2015-04-06T10:13:39.42"
        },
        {
            "PaymentId": "6c1d45c3-a95f-49c1-a626-1e9373feecc2",
            "ReceveidDate": "2014-12-19T20:23:28.847"
        }
    ]
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    Payments: [
        {
            "PaymentId": "5fb4d606-bb63-4423-a683-c966e15399e8",
            "ReceveidDate": "2015-04-06T10:13:39.42"
        },
        {
            "PaymentId": "6c1d45c3-a95f-49c1-a626-1e9373feecc2",
            "ReceveidDate": "2014-12-19T20:23:28.847"
        }
    ]
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`PaymentId`|Order identifier field.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Querying a Recurring Order

In order to query a recurring order, you must send an HTTP message through the GET method as in the example:

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}</span></aside>

```shell
--request GET "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|API store identifier.|GUID|36|Yes (through header)|
|`MerchantKey`|Public key for dual authentication in API.|Text|40|Yes (through header)|
|`RequestId`|Store-defined request identifier used when the merchant uses different servers for each GET/POST/PUT.|GUID|36|No (through header)|
|`RecurrentPaymentId`|Recurrence identifier field.|Text|36|Yes (through endpoint)|

### Response

```json
{
  "Customer":{
    "Name": "Customer Name"
  },
  "RecurrentPayment": {
    "Installments":1,
    "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
    "NextRecurrency": "2017-06-11",
    "StartDate": "2017-05-11",
    "EndDate":"2019-12-31",
    "Interval": "Monthly",
    "Amount":10000,
    "Country":"BRA",
    "CreateDate": "2017-05-11T00:00:00",
    "Currency":"BRL",
    "CurrentRecurrencyTry": 1,
    "OrderNumber": "2017051120",
    "Provider":"Simulado",
    "RecurrencyDay": 11,
    "SuccessfulRecurrences": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/f5a83c14-0254-4e73-bdd3-9afba1007266"
      }
    ],
    "RecurrentTransactions": [
      {
        "PaymentNumber": 0,
        "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
        "TransactionId": "cd694ffb-c0c4-47db-9390-737df70a2012",
        "TryNumber": 1,
        "Links": [
          {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/cd694ffb-c0c4-47db-9390-737df70a2012"
          }
        ]
      }
    ],
    "Status": 1
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "Customer":{
    "Name": "Customer Name"
  },
  "RecurrentPayment": {
    "Installments":1,
    "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
    "NextRecurrency": "2017-06-11",
    "StartDate": "2017-05-11",
    "EndDate":"2019-12-31",
    "Interval": "Monthly",
    "Amount":10000,
    "Country":"BRA",
    "CreateDate": "2017-05-11T00:00:00",
    "Currency":"BRL",
    "CurrentRecurrencyTry": 1,
    "OrderNumber": "2017051120",
    "Provider":"Simulado",
    "RecurrencyDay": 11,
    "SuccessfulRecurrences": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/f5a83c14-0254-4e73-bdd3-9afba1007266"
      }
    ],
    "RecurrentTransactions": [
      {
        "PaymentNumber": 0,
        "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
        "TransactionId": "cd694ffb-c0c4-47db-9390-737df70a2012",
        "TryNumber": 1,
        "Links": [
          {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/cd694ffb-c0c4-47db-9390-737df70a2012"
          }
        ]
      }
    ],
    "Status": 1
  }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|Identifies the next recurrence.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`NextRecurrency`|Date of the next recurrence.|Text|7|05/2019 (MM/YYYY)|
|`StartDate`|Start date of recurrence.|Text|7|05/2019 (MM/YYYY)|
|`EndDate`|End date of the recurrence.|Text|7|05/2019 (MM/YYYY)|
|`Interval`|Interval between recurrences.|Text|10|<ul><li>Monthly</li><li>Bimonthly</li><li>Quarterly </li><li>SemiAnnual </li><li>Annual</li></ul>|
|`CurrentRecurrencyTry`|Indicates the current recurrency retry number.|Number|1|1|
|`OrderNumber`|Store order ID.|Text|50|2017051101|
|`Status`|Recurring order status.|Number|1|1- Active / 2- Finished / 3,4,5- Inactive|
|`RecurrencyDay`|The day of recurrence.|Number|2|22|
|`SuccessfulRecurrences`|Quantity of successful recurrences.|Number|2|5|
|`RecurrentTransactions.RecurrentPaymentId`|Recurrence ID.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RecurrentTransactions.TransactionId`|Payment transaction ID generated on recurrence.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RecurrentTransactions.PaymentNumber`|Recurrence number. The first one is zero.|Number|2|3|
|`RecurrentTransactions.TryNumber`|Number of the current attempt at a specific recurrence.|Number|2|1|

# Notification Post

To receive notifications of status changes, you must have configured the URL Status Payment field during registration of your store at Braspag. The parameters will be sent to the registered URL as shown in the example below.

<aside class="warning">As there is a possibility of intermittence between the client and server APIs, it is necessary to track pending (unpaid) transactions that have not yet been updated on the current day.</aside>

## Sent Notification

```json
{
   "RecurrentPaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "ChangeType": "2"
}
```

|Property|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`RecurrentPaymentId`|Identifier representing the recurring order (only applicable for `ChangeType` "2" or "4").|GUID|36|No|
|`PaymentId`|Identifier representing the transaction.|GUID|36|Yes|
|`ChangeType`|Specifies the notification type. Note: See table below.|Number|1|Yes|

|ChangeType|Description|
|----------|---------|
|"1"|Payment status change.|
|"2"|Recurrence created.|
|"3"|Anti-fraud status change.|
|"4"|Recurring payment status change (e.g.: automatic deactivation).|
|"5"|Refund denied (applicable to **Rede**).|
|"6"|Underpaid registered boleto.|
|"7"|Chargeback notification.<br/>For more details, refer to the [Risk Notification](https://braspag.github.io//manual/risknotification) guide.|
|"8"|Fraud alert.|

## Expected Response

The expected response from the store is: `HTTP Status Code 200 OK`.

If the above response is not returned, there will be two more attempts to send the Notification Post.

# ANNEXES

## List of Providers

The following lists refer to providers for the REST API integration:

### Providers for Credit Card

|Provider|Brand|Description|
|--------|-----|---------|
|Simulado|---|Sandbox Provider. [Click here](https://braspag.github.io//en/manual/braspag-pagador#test-cards-(simulado)){:target="_blank"} for more details about cards for tests.|
|Cielo30|Visa, Master, Amex, Elo, Aura, Jcb, Diners, Discover, Hipercard, Hiper|Provider for transactions on the Cielo 3.0 e-commerce platform.|
|Rede2|Visa, Master, Hipercard, Hyper, Diners, Link, Amex|Provider for transactions in e-commerce platform Rede (e-Rede) in REST version.|
|Getnet|Visa, Master, Elo, Amex|Provider for transactions on Getnet e-commerce platform.|
|GlobalPayments|Visa, Master, Elo, Hiper, Hipercard, Cabal, Amex|Provider for transactions on Global Payments e-commerce platform.|
|Stone|Visa, Master, Hipercard, Elo|Provider for transactions on e-commerce platform Stone.|
|Safra2|Visa, Master, Hipercard, Elo|Provider for transactions on new e-commerce platform Safra.|
|FirstData|Visa, Master, Elo, Hipercard, Cabal, Amex|Provider for Guarani (PYG), Argentine Pesos (ARG) and Real (BRL) transactions on the First Data e-commerce platform.|
|Sub1|Visa, Master, Diners, Amex, Discover, Cabal, Orange and Nevada|Provider for Argentine Peso (ARG) transactions on the Sub1 First Data legacy platform.|
|Banorte|Visa, Master, Carnet|Provider for Mexican Peso (MXN) transactions on Banorte e-commerce platform.|
|Credibanco|Visa, Master, Diners, Amex, Credential|Provider for Colombian Peso (COP) transactions on Credibanco e-commerce platform.|
|Transbank2|Visa, Master, Diners, Amex|Provider for Chilean pesos (CLP) transactions on Transbank e-commerce platform.|
|Banese|Banese|Provider for transaction with the BaneseCard network.|
|BrasilCard|BrasilCard|Provider for transaction with the BrasilCard network.|
|Credz|Credz|Private Label Brand System.|
|DMCard|---|Private Label Brand System.|

### Providers for Debit Card

|Provider|Brand|Description|
|--------|-----|---------|
|Cielo|Visa, Master|Provider for debit transactions on legacy platform Cielo 1.5.|
|Cielo30|Visa, Master|Provider for debit transactions on e-commerce platform Cielo 3.0.|
|Rede2|Visa, Master|Provider for transactions on Rede e-commerce platform.|
|Safra2|Visa, Master|Provider for debit transactions on e-commerce Safra platform.|
|Getnet|Visa, Master|Provider for transactions on Getnet e-commerce platform.|
|FirstData|Visa, Master|Provider for debit transactions on the First Data e-commerce platform.|
|GlobalPayments|Visa, Master|Provider for transactions on Global Payments e-commerce platform.|

### Providers for Voucher

|Provider|Brand|Description|
|--------|-----|---------|
|Alelo|Elo|Provider for voucher (meal and food) transactions on the Alelo platform.|
|Ticket|Ticket|Provider for voucher (meal and food) transactions on the Ticket platform.|

### Providers for Zero Auth via VerifyCard

|Provider|
|--------|
|Simulado, Cielo30 (Cielo 3.0), Rede2 (REST e-Rede), Getnet, FirstData, GlobalPayments|

### Providers for BIN Query via VerifyCard

|Provider|
|--------|
|Simulado, Cielo30 (Cielo 3.0)|

### Providers for Registered Boleto

|Provider|
|--------|
|Braspag, Bradesco2, BancoDoBrasil2, BancoDoBrasil3, ItauShopline, Itau2, Santander2, Caixa2, CitiBank2, BankOfAmerica|

### Providers for Electronic Transfer (Online Debit)

|Provider|
|--------|
|SafetyPay, PayMeeRedirectCheckout, PayMeeSemiTransparent|

### Providers for Pix

|Provider|
|--------|
|Cielo30, Bradesco2, BancoDoBrasil3|

## Transaction Status List

List of statuses returned by the API:

| Code | Payment status | Payment method                                                        | Description                                                                                                                                                                                                                                                                                                                                                                              |
| ------ | ------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0      | NotFinished         | All                                                                    | **Failed to process the payment**.<br>Possible causes: incorrect data, error in the request, acquirer _timeout_, some processing instability.<br>In case of debit transaction, the buyer may have abandoned the purchase.                                                                                                                                            |
| 1      | Authorized          | All                                                                    | **Payment methods able to be captured or paid (boleto)**.<br>For a boleto transaction, it means that the boleto was successfully generated.<br>For a card transaction, it means that there was approval by the issuing bank. However, this does not mean that the transaction has been completed - for this, a second step is required, capturing the transaction or making the payment. |
| 2      | PaymentConfirmed    | All                                                                    | Payment confirmed and completed.                                                                                                                                                                                                                                                                                                                                                     |
| 3      | Denied              | Credit and debit cards (electronic transfer) and e-wallets. | **Payment denied by authorizer**. <br>Possible causes: insufficient limit, lack of payment on the card, unavailable brand, blocking due to fraud, among others.<br>To find out the real reason for the denial, it is necessary to look at the return code generated during the transaction.                                                                                                    |
| 10     | Voided              | All, except boleto                                                    | **Payment canceled**.<br>It is the suspension of the transaction, exempting from fees or amounts charged. Pre-authorized transactions can be canceled even after 23:59 on the authorization date. Captured transactions can be canceled up to 11:59 pm on the same day of authorization, after which time the amount will be reversed.                                                     |
| 11     | Refunded            | Credit and debit cards and e-wallets.                                 | **Payment cancelled/reversed**.<br>Means that the cancellation of the transaction was requested, which may occur from 0:00 am on the day after the creation of the transaction. Regardless of the amount, it is only possible to make one reversal request per transaction. This can happen due to incorrect data or at the request of the shopper.                                  |
| 12     | Pending             | Credit and debit cards (electronic transfer), e-wallets and pix. | **Awaiting return from financial institution**. <br>Means that the transaction was sent to Cielo in the pre-authorization process, awaiting a response from the issuing bank to validate it.                                                                                                                                                                                        |
| 13     | Aborted             | All                                                                    | **Payment canceled due to processing failure**.<br>Means that the transaction was canceled due to processing failure. It can also be aborted if Anti-Fraud denies the transaction before authorization.                                                                                                                                                                         |
| 20     | Scheduled           |Credit card and e-wallets.                                           | **Scheduled recurrence**.<br>Means that the transaction will have a scheduled recurrence, that is, the purchase amount will be collected on the day it was scheduled by the store.                                                                                                                                                                                                                  |

## Pix Banco do Brasil transaction status list

|Code |Status | Description |
|---|---|---|
|06 | Settled |Shopper paid via barcode, the amount has already been cleared and credited to the beneficiary - effective settlement.|
|14 | Title in settlement | Shopper paid via QR Code Pix - can be considered effective settlement.|
|15 | Scheduled title |The shopper paid/scheduled the payment using the barcode, but the payment can still be canceled as the amount has not yet been cleared.|

## Anti-Fraud Status List

|Code|Description|
|--------|------------|
|0|Unknown|
|1|Accept|
|2|Reject|
|3|Review|
|4|Aborted|
|5|Unfinished|

## MerchantDefinedData Table

A risk strategy is designed in accordance with your business needs, taking into consideration the level of relevance of the Merchant Defined Data (MDD) fields. Even if those fields are not sent, they will still be charged during the validation of the test transactions. For this reason, we request that a prior analysis of the documentation is carried out and the store informs the fields that cannot be sent.

> The MDD fields **1**, **4**, **9**, **83** e **84** are required during the validation of the test transactions. If your ecommerce is unable to send one or more MDD fields, you must inform Braspag which fields will not be sent.

<aside class="warning">Do not send any empty fields. In case of any fields with no data to be sent, do not send the MDD.</aside>

**Level of Relevance of the MDD Fields**

1- Relevant <br/>
2- Very Relevant <br/>
3- Extremely Relevant <br/><br/>

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

## List of HTTP Status Code

|HTTP CODE|Mensage|
|---|---|
|200|Ok|
|201|Created|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|405|Method Not Allowed|
|500|Internal Server Error|
|502|Bad Gateway|
|503|Service Unavailable|

See some example scenarios for when each HTTP code may return:

**Successful responses**

* **200 Ok**: the request succeeded. E.g.: when creating an `AccessToken`;
* **201 Created**: the request succeeded and the transaction was created (for all payment methods: boleto, credit, debit, electronic transfer and e-wallet).

**Client error responses**

* **400 Bad Request**: the request is not valid. E.g: malformed JSON request syntax;
* **401 Unauthorized**: authentication error. E.g.: wrong `MerchantKey`;
* **403 Forbidden**: non-authorized due to IP restriction in the e-commerce;
* **404 Not Found**: The server can not find the requested resource. E.g.: wrong endpoint; for order search: the order does not exist, or was created by another merchant or the order is older than three months;
* **405 Method Not Allowed**: wrong HTTP method (POST, PUT, GET, PATCH, DELETE).

**Server error responses**

* **500 Internal Server Error, 502 Bad Gateway ou 503 Service Unavailable**: these errors responses can return due to some internal fail at Braspag, such as unavailable payment method or low speed. If you get any of these responses, we recommend contacting our Support for further information.

## Recurrence Status List

|Code|Description|
|--------|---------------------------|
|1|Active.|
|2|Finished.|
|3|DisabledByMerchant.|
|4|DisabledMaxAttempts.|
|5|DisabledExpiredCreditCard.|

## ReasonCode/ReasonMessage List

|Reason Code|Reason Message|
|-------------|------------------------------|
|0|Successful.|
|1|AffiliationNotFound.|
|2|IssuficientFunds.|
|3|CouldNotGetCreditCard.|
|4|ConnectionWithAcquirerFailed.|
|5|InvalidTransactionType.|
|6|InvalidPaymentPlan.|
|7|Denied.|
|8|Scheduled.|
|9|Waiting.|
|10|Authenticated.|
|11|NotAuthenticated.|
|12|ProblemsWithCreditCard.|
|13|CardCanceled.|
|14|BlockedCreditCard.|
|15|CardExpired.|
|16|AbortedByFraud.|
|17|CouldNotAntifraud.|
|18|TryAgain.|
|19|InvalidAmount.|
|20|ProblemsWithIssuer.|
|21|InvalidCardNumber.|
|22|TimeOut.|
|23|CardProtectedIsNotEnabled.|
|24|PaymentMethodIsNotEnabled.|
|98|InvalidRequest.|
|99|InternalError.|

## API Error Codes

Error codes returned, identifying the reason for the error and their respective messages.

|Code|Message|Description|
|------|--------|---------|
|0|Internal error|Data sent exceeds field size.|
|100|RequestId is required|Submitted field is empty or invalid.|
|101|MerchantId is required|Submitted field is empty or invalid.|
|102|Payment Type is required|Submitted field is empty or invalid.|
|103|Payment Type can only contain letters|Special characters not allowed.|
|104|Customer Identity is required|Submitted field is empty or invalid.|
|105|Customer Name is required|Submitted field is empty or invalid.|
|106|Transaction ID is required|Submitted field is empty or invalid.|
|107|OrderId is invalid or does not exist|Submitted field exceeds size or contains special characters.|
|108|Amount must be greater or equal to zero|Transaction value must be greater than "0".|
|109|Payment Type is required|Submitted field is empty or invalid.|
|110|Invalid Payment Currency|Submitted field is empty or invalid.|
|111|Payment Country is required|Submitted field is empty or invalid.|
|112|Invalid Payment Country|Submitted field is empty or invalid.|
|113|Invalid Payment Currency|Submitted field is empty or invalid.|
|114|The provided MerchantId is not in correct format|The submitted MerchantId is not a GUID.|
|115|The provided MerchantId was not found|MerchantID does not exist or belongs to another environment (EX: Sandbox).|
|116|The provided MerchantId is blocked|Shop locked, contact support Braspag.|
|117|Credit Card Holder is required|Submitted field is empty or invalid.|
|118|Credit Card Number is required|Submitted field is empty or invalid.|
|119|At least one Payment is required|"Payment" node not sent.|
|120|Request IP not allowed. Check your IP White List|IP blocked for security reasons.|
|121|Customer is required|"Customer" node not sent.|
|122|MerchantOrderId is required|Submitted field is empty or invalid.|
|123|Installations must be greater or equal to one|Number of installments must be greater than 1.|
|124|Credit Card Number is required|Submitted field is empty or invalid.|
|125|Credit Card Expiration Date is required|Submitted field is empty or invalid.|
|126|Credit Card Expiration Date is invalid|Submitted field is empty or invalid.|
|127|You must provide CreditCard Number|Credit Card Number is required.|
|128|Card Number length exceeded|Card number over 16 digits.|
|129|Affiliation not found|Non-store payment method or invalid Provider.|
|130|Could not get Credit Card|---|
|131|MerchantKey is required|Submitted field is empty or invalid.|
|132|MerchantKey is invalid|The submitted Merchantkey is not a valid.|
|133|Provider is not supported for this Payment Type|Provider submitted does not exist.|
|134|FingerPrint length exceeded|Data sent exceeds field size.|
|135|MerchantDefinedFieldValue length exceeded|Submitted data exceeds field size.|
|136|ItemDataName length exceeded|Submitted data exceeds field size.|
|137|ItemDataSKU length exceeded|Submitted data exceeds field size.|
|138|PassengerDataName length exceeded|Data sent exceeds field size.|
|139|PassengerDataStatus length exceeded|Data sent exceeds field size.|
|140|PassengerDataEmail length exceeded|Data sent exceeds field size.|
|141|PassengerDataPhone length exceeded|Data sent exceeds field size.|
|142|TravelDataRoute length exceeded|Submitted data exceeds field size.|
|143|TravelDataJourneyType length exceeded|Submitted data exceeds field size.|
|144|TravelLegDataDestination length exceeded|Submitted data exceeds field size.|
|145|TravelLegDataOrigin length exceeded|Submitted data exceeds field size.|
|146|SecurityCode length exceeded|Data sent exceeds field size.|
|147|Address Street length exceeded|Data sent exceeds field size.|
|148|Address Number length exceeded|Data sent exceeds field size.|
|149|Address Complement length exceeded|Data sent exceeds field size.|
|150|Address ZipCode length exceeded|Data sent exceeds field size.|
|151|Address City length exceeded|Data sent exceeds field size.|
|152|Address State length exceeded|Data sent exceeds field size.|
|153|Address Country length exceeded|Data sent exceeds field size.|
|154|Address District length exceeded|Data sent exceeds field size.|
|155|Customer Name length exceeded|Data sent exceeds field size.|
|156|Customer Identity length exceeded|Data sent exceeds field size.|
|157|Customer IdentityType length exceeded|Submitted data exceeds field size.|
|158|Customer Email length exceeded|Data sent exceeds field size.|
|159|ExtraData Name length exceeded|Data sent exceeds field size.|
|160|ExtraData Value length exceeded|Submitted data exceeds field size.|
|161|Boleto Instructions length exceeded|Data sent exceeds field size.|
|162|Boleto Demostrative length exceeded|Data sent exceeds field size.|
|163|Return Url is required|Return URL is not valid - Paging or extensions (E.g.:PHP) in the return URL.|
|166|AuthorizeNow is required|---|
|167|Antifraud not configured|Antifraud not linked to merchant registration.|
|168|Recurrent Payment not found|Recurrence not found.|
|169|Recurrent Payment is not active|Recurrence is not active. Paralyzed Execution.|
|170|Protected Card not configured|Protected Card not linked to merchant registration.|
|171|Affiliation data not sent|Order Processing Failed - Contact Braspag Support.|
|172|Credential Code is required|Validation of submitted credentials failed.|
|173|Payment method is not enabled|Payment method not linked to merchant registration.|
|174|Credit Card Number is required|Submitted field is empty or invalid.|
|175|EAN is required|Submitted field is empty or invalid.|
|176|Payment Currency is not supported|Submitted field is empty or invalid.|
|177|Card Number is invalid|Submitted field is empty or invalid.|
|178|EAN is invalid|Submitted field is empty or invalid.|
|179|The max number of installments allowed for recurring payment is 1|Submitted field is empty or invalid.|
|180|The provided Card PaymentToken was not found|Cartão Protegido's token not found.|
|181|The MerchantIdJustClick is not configured|Cartão Protegido's Token Locked.|
|182|Brand is required|Card brand not sent.|
|183|Invalid customer birthdate|Invalid or future date of birth.|
|184|Request could not be empty|Failed to form this request. Check the code sent.|
|185|Brand is not supported by selected provider|Flag not supported by API Braspag.|
|186|The selected provider does not support the options provided (Capture, Authenticate, Recurrent or Installments)|Payment method does not support the command sent.|
|187|ExtraData Collection contains one or more duplicated names|---|
|188|Avs with CPF invalid|---|
|189|Avs with length of street exceeded|Submitted data exceeds field size.|
|190|Avs with length of number exceeded|Data sent exceeds field size.|
|190|Avs with length of complement exceeded|Data sent exceeds field size.|
|191|Avs with length of district exceeded|Submitted data exceeds field size.|
|192|Avs with zip code invalid|Zip code sent is invalid.|
|193|Split Amount must be greater than zero|Value for SPLIT must be greater than 0.|
|194|Split Establishment is Required|SPLIT not enabled for store registration.|
|195|The PlataformId is required|Platform Not Validated.|
|196|DeliveryAddress is required|Required field not submitted.|
|197|Street is required|Required field not submitted.|
|198|Number is required|Required field not submitted.|
|199|ZipCode is required|Required field not submitted.|
|200|City is required|Required field not submitted.|
|201|State is required|Required field not submitted.|
|202|District is required|Required field not submitted.|
|203|Cart item Name is required|Required field not submitted.|
|204|Cart item Quantity is required|Required field not submitted.|
|205|Cart item type is required|Required field not submitted.|
|206|Cart item name length exceeded|Data sent exceeds field size.|
|207|Cart item description length exceeded|Data sent exceeds field size.|
|208|Cart item sku length exceeded|Data sent exceeds field size.|
|209|Shipping address sku length exceeded|Data sent exceeds field size.|
|210|Shipping data cannot be null|Required field not submitted.|
|213|Credit Card Number is invalid|Credit card sent is invalid.|
|214|Credit Card Holder Must Have Only Letters|Cardholder must not contain special characters.|
|215|Agency is required in Boleto Credential|Required Field Not Submitted.|
|216|Customer IP address is invalid|IP blocked for security.|
|300|MerchantId was not found|---|
|301|Request IP is not allowed|---|
|302|Sent MerchantOrderId is duplicated|---|
|303|Sent OrderId does not exist|---|
|304|Customer Identity is required|---|
|306|Merchant is blocked|---|
|307|Transaction not found|Transaction not found or missing in environment.|
|308|Transaction not available to capture|Transaction cannot be captured - Contact Braspag Support.|
|309|Transaction not available to void|Transaction cannot be canceled - Contact Support Braspag.|
|310|Payment method do not support this operation|Command sent not supported by payment method.|
|311|Refund is not enabled for this merchant|Cancellation after 24 hours not released to retailer.|
|312|Transaction not available to refund|Transaction does not allow cancellation after 24 hours.|
|313|Recurrent Payment not found|Recurring transaction not found or not available in the environment.|
|314|Invalid Integration|---|
|315|Cannot change NextRecurrency with pending payment|---|
|316|Cannot set NextRecurrency to past date|Not allowed to change recurrence data for a past date.|
|317|Invalid Recurrency Day|---|
|318|No transaction found|---|
|319|Smart recurrency is not enabled|Recurrence not linked to merchant registration.|
|320|Cannot Update Affiliation Because this Recurrency not Affiliation saved|---|
|321|Cannot set EndDate to before next recurrency|---|
|322|Zero Dollar Auth is not enabled|Zero Dollar not linked to merchant registration.|
|323|Bin Query is not enabled|Bins Query not linked to merchant registration.|

## Test Cards (Simulado)

"*Simulado*" is a payment method that emulates the use of Credit Card payments. With this payment method it is possible to simulate all *Authorization*, *Capture* and *Cancellation* flows.

For a better use of "Simulado" Payment Methods, you can use the provided test cards in the table below.

The transaction status will vary according to how each card is used.

|Transaction Status|Testing Cards|Return Code|Return Message|
|-------------------|----------------------------------|-----------------|-------------------|
|Authorized|0000.0000.0000.0000 / 0000.0000.0000.0001 / 0000.0000.0000.0004 |4|Operação realizada com sucesso|
|Not Authorized|0000.0000.0000.0002|05|Not Authorized|
|Not Authorized|0000.0000.0000.0003|57|Expired Card|
|Not Authorized|0000.0000.0000.0005|78|Bloqued Card|
|Not Authorized|0000.0000.0000.0006|99|Time Out|
|Not Authorized|0000.0000.0000.0007|77|Canceled Card|
|Not Authorized|0000.0000.0000.0008|70|Problems with the Credit Card|
|Random Authorization|0000.0000.0000.0009|4 / 99|Operation Successful/Time Out|

Security Code (CVV) and validity information can be random, preserving its size and format - "3 digits" (CVV) and "MM/YYYY" (Validity). Do not use dots or hyphens between the numbers in the card.

## List of Values - Payment.FraudAnalysis.Cart.Items [n].GiftCategory

|Value|Description|
|:-|:-|
|Yes|In case of divergence between billing and shipping addresses, assigns low risk to the order.|
|No|In case of divergence between billing and shipping addresses, assigns high risk to the order (default).|
|Off|Differences between billing and shipping addresses do not affect score.|

## List of Values - Payment.FraudAnalysis.Cart.Items [n].HostHedge

|Value|Description|
|:-|:-|
|Low|Low.|
|Normal|Normal (default).|
|High|High.
|Off|Does not affect the fraud analysis score.|

## List of Values - Payment.FraudAnalysis.Cart.Items [n].NonSensicalHedge

|Value|Description|
|:-|:-|
|Low|Low.|
|Normal|Normal (default).|
|High|High.|
|Off|Does not affect the fraud analysis score.|

## List of Values - Payment.FraudAnalysis.Cart.Items [n].ObscenitiesHedge

|Value|Description|
|:-|:-|
|Low|Low.|
|Normal|Normal (default).|
|High|High.|
|Off|Does not affect the fraud analysis score.|

## List of Values - Payment.FraudAnalysis.Cart.Items [n].TimeHedge

|Value|Description|
|:-|:-|
|Low|Low.|
|Normal|Normal (default).|
|High|High.|
|Off|Does not affect the fraud analysis score.|

## List of Values - Payment.FraudAnalysis.Cart.Items [n].PhoneHedge

|Value|Description|
|:-|:-|
|Low|Low.|
|Normal|Normal (default).|
|High|High.|
|Off|Does not affect the fraud analysis score.|

## List of Values - Payment.FraudAnalysis.Cart.Items [n].VelocityHedge

|Value|Description|
|:-|:-|
|Low|Low.|
|Normal|Normal (default).|
|High|High.|
|Off|Does not affect the fraud analysis score.|

## List of Values - Payment.FraudAnalysis.Cart.Items [n].Type

|Value|Description|
|:-|:-|
|AdultContent|Adult content.|
|Coupon|Coupon applied to any order.|
|Default|Default value for the product type. When no other value is sent, this type is assumed.|
|ElectronicGood|Electronic product other than software.|
|ElectronicSoftware|Software electronically distributed via download.|
|GiftCertificate|Gift certificate.|
|HandlingOnly|The fee you charge your customer to cover your sales administrative expenses. E.g.: Convenience fee / Installation fee.|
|Service|Service to be performed for the customer.|
|ShippingAndHandling|Shipping amount and fee you charge your customer to cover your sales administrative expenses.|
|ShippingOnly|Shipping cost.|
|Subscription|Subscription. E.g.: Video streaming / News subscription.|

## Value List - Payment.FraudAnalysis.Shipping.Method

|Value|Description|
|:-|:-|
|SameDay|Same day delivery.|
|OneDay|Next day delivery.|
|TwoDay|Two-day delivery.|
|ThreeDay|Three-day delivery.|
|LowCost|Low cost delivery.|
|Pickup|Pick up on the store.|
|Other|Other delivery method.|
|None|No delivery since it is a service or subscription.|

## List of Values - Payment.FraudAnalysis.Travel.JourneyType

|Value|Description|
|:-|:-|
|OneWayTrip|One way trip.|
|RoundTrip|Round Trip.|

## Value List - Payment.FraudAnalysis.Travel.Passengers [n].Rating

|Value|Description|
|:-|:-|
|Adult|Adult.|
|Child|Child.|
|Infant|Infant.|

## Value List - Payment.FraudAnalysis.Travel.Passengers [n].Status

|Value|Description|
|:-|:-|
|Standard| Standard type.|
|Gold| Gold type.|
|Platinum| Platinum type.|

## List of Values - Payment.FraudAnalysis.Status

|Value|Description|
|:-|:-|
|Accept|Transaction accepted after fraud analysis.|
|Review|Transaction under review after fraud analysis.|
|Reject|Transaction rejected after fraud analysis.|
|Pendent|Transaction pending, because there was a timeout in the response between Braspag and Cybersource during its submission to fraud analysis.|
|Unfinished|Transaction not finalized for any contract validation reason or internal error.|
|ProviderError|Transaction with a provider error during submission for analysis.|

## Value List - Payment.FraudAnalysis.FraudAnalysisReasonCode

|Value|Description|
|:-|:-|
|100|Operation successfully performed.|
|101|Transaction submitted for fraud analysis is missing one or more required fields. Check in response for the `ProviderAnalysisResult.Missing` field. Possible action: Resubmit the transaction with full information.|
|102|Transaction submitted for fraud analysis has one or more fields with invalid values. Check in response for the `ProviderAnalysisResult.Invalid` field. Possible action: Resubmit the transaction with the correct information.|
|150|Internal Error. Possible action: Wait a few minutes and try resubmitting the transaction.|
|151|The transaction was received, but timeout occurred on the server. This error does not include client-server timeout. Possible action: Please wait a few minutes and try resending the transaction.|
|152|The request was received but timeout occurred. Possible action: Please wait a few minutes and try resending the transaction.|
|202|Transaction declined because card has expired or expiration date does not match. Correct action: Request another card or other payment method.|
|231|Transaction declined because card is invalid. Possible action: Request another card or other payment method.|
|234|Cybersource store configuration issue possible. Action: Please contact support to fix the configuration issue.|
|400|Fraud score exceeds threshold. Possible action: Review shopper's transaction.|
|480|The transaction has been marked for review by the Decision Manager (DM).|
|481|The transaction was rejected by the Decision Manager (DM).|

## Value List - Payment.FraudAnalysis.ReplyData.AddressInfoCode

|Value|Description|
|:-|:-|
|COR-BA|Billing address can be standardized.|
|COR-SA|Shipping address can be standardized.|
|INTL-BA|Billing address country is outside the US.|
|INTL-SA|Shipping address country is outside the US.|
|MIL-USA|Military address in the USA.|
|MM-A|Billing and shipping addresses use different street names.|
|MM-BIN|Card BIN (first six digits of card number) does not match country.|
|MM-C|Billing and shipping addresses use different cities.|
|MM-CO|Billing and shipping addresses use different countries.|
|MM-ST|Billing and shipping addresses use different states.|
|MM-Z|Billing and shipping addresses use different postal codes.|
|UNV-ADDR|Address is unverifiable.|

## Value List - Payment.FraudAnalysis.ReplyData.FactorCode

|Value|Description|
|:-|:-|
|A|Excessive address change. Shopper has changed billing address two or more times in the last six months.|
|B|BIN of the card or risk authorization. Risk factors related to credit card BIN and/or card authorization checks.|
|C|High number of credit cards. Shopper has used more than six credit card numbers in the last six months.|
|D|Impact of email address. Shopper uses a free email provider or the email address is risky.|
|E|Positive list. Shopper is on your positive list.|
|F|Negative list. The account number, address, email address or IP address for this purpose appears in your negative list.|
|G|Geolocation inconsistencies. Shopper's email address or domain, phone number, billing address, shipping address, or IP address is suspicious.|
|H|Excessive name changes. Shopper has changed billing address two or more times in the past six months.|
|I|Internet inconsistencies. IP address and email domain are not consistent with billing address.|
|N|Meaningless input. Shopper's name and address fields contain meaningless words or language.|
|O|Obscenities. Shopper's data contains obscene words.|
|P|Identity morphing. Multiple values of an identity element are linked to a value of a different identity element. For example, multiple phone numbers are linked to a single account number.|
|Q|Phone inconsistencies. Shopper's phone number is suspicious.|
|R|Risky order. Transaction, shopper and merchant show high risk correlated information.|
|T|Time coverage. Shopper is attempting a late purchase.|
|U|Unverifiable address. Billing or shipping address cannot be verified.|
|V|Card has been used many times in the past 15 minutes.|
|W|Marked as suspicious. The billing or shipping address is similar to an address previously marked as suspicious.|
|Y|The address, city, state, or country of the billing and shipping addresses do not match.|
|Z|Invalid value. Because the request contains an unexpected value, a default value has been overridden. Although the transaction can still be processed, carefully examine the request for anomalies.|

## Value List - Payment.FraudAnalysis.ReplyData.InternetInfoCode

|Value|Description|
|:-|:-|
|FREE-EM|Shopper's email address is from a free email provider.|
|INTL-IPCO|Shopper's email address country is outside the US.|
|INV-EM|Shopper's email address is invalid.|
|MM-EMBCO|Shopper's email address domain is not consistent with billing address country.|
|MM-IPBC|Shopper's email address is not consistent with city of billing address.|
|MM-IPBCO|Shopper's email address is not consistent with billing address country.|
|MM-IPBST|Shopper's IP address is not consistent with the state in the billing address. However, this information code cannot be returned when the inconsistency is between immediately adjacent states.|
|MM-IPEM|Shopper's email address is not consistent with IP address.|
|RISK-EM|Shopper's email domain (for example, *mail.example.com*) is associated with high risk.|
|UNV-NID|Shopper's IP address is from an anonymous proxy. These entities completely hide IP address information.|
|UNV-RISK|IP address is from risk place.|
|UNV-EMBCO|Email address country does not match billing address country.|

## Value List - Payment.FraudAnalysis.ReplyData.IpRoutingMethod

|Value|Description|
|:-|:-|
|Anonymizer|IP addresses are hidden because the shopper is extremely cautious, either absolute privacy or fraudulent.|
|AOL, AOL dialup, AOL POP and AOL proxy|AOL members. In most cases, the country can be identified, but the state and city cannot.|
|Proxy cache|Proxy used through an internet accelerator or service content distribution. Shopper may be located in a country other than IP address.|
|Fixed|The IP address is near or in the same place as the shopper.|
|International proxy|Proxy that contains traffic from various countries. The shopper may be located in a country other than that indicated by the IP address. In many cases, corporate networks are routing international office traffic through a central hub, often corporate headquarters.|
|Mobile gateway|Gateway for connecting mobile devices to the internet. Many carriers, especially in Europe, serve more than one country and traffic occurs through centralized network hubs. Shopper may be located in a country other than IP address.|
|POP|Buyer dialing at a regional ISP probably near IP address location, but possibly across geographic boundaries.|
|Regional proxy|Proxy that contains multi-state traffic within a single country. The shopper may be located in a country other than that indicated by the IP address. In many cases, corporate networks are routing international office traffic through a central hub, often corporate headquarters.|
|Satellite|Satellite connections. If uplink and downlink are registered, the routing method is considered standard because the sender is known. However, if the downlink is not registered, the shopper may be anywhere within the standard satellite beam, which may span one continent or more.|
|SuperPOP|The shopper is dialing from a multi-state or multinational ISP that is unlikely to find the IP address location. Shopper may be dialing across geographic boundaries.|
|No value returned|Routing type is unknown.|

## Value List - Payment.Chargebacks [n].Status

|Value|Description|
|:-|:-|
|Received|Chargeback received from acquirer.|
|AcceptedByMerchant|Chargeback accepted by store. In this case the store understands that it has indeed suffered a chargeback and will not contest it.|
|ContestedByMerchant|Chargeback contested by store. In this case the store has sent the necessary documents to try to reverse the chargeback.|
