---
layout: manual
title: Risk Notification - Integration Manual
description: Technical integration API Risk Notification Braspag
search: true
categories: manual
tags:
  - Risk Management
language_tabs:
  json: JSON    
---

# Overview

**Risk Notification API** was developed by Braspag's Risk team for clients to consult fraud alerts, chargebacks, submit files for chargeback contestation and accept chargebacks.

The API is based on REST architecture, which exchange data in JSON format following authorization flows defined by the OAuth 2 protocol, where all standards are widely used by the industry and supported by the technical communities.

> To learn more about OAuth 2, see [https://oauth.net/2/](https://oauth.net/2/)

# Objective

The purpose of this documentation is to guide the developer on how to integrate with the Risk Notification API by describing the operations available with examples of requests and responses.

To perform an operation, combine the base endpoint of the environment with the endpoint of the desired operation and send using the HTTP VERB as described in the operation.

# Hosts

## BraspagAuth API

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https://authsandbox.braspag.com.br/|
|`Produção`|https://auth.braspag.com.br/|

## Chargeback API Braspag

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https://risknotificationsandbox.braspag.com.br/|
|`Produção`|https://risknotification.braspag.com.br/|

# Authentication

## Access Token

Risk Notification API Braspag uses the industry standard OAuth 2.0 protocol to authorize access to its environment-specific resources, which are: **Sandbox** and **Production**.

This session describes the flow required for client applications to obtain valid access tokens for use in the API.

## Obtaining the access token  

The access token is obtained through the oauth **client_credentials**. The diagram below illustrates, in chronological order, the communication between **Client Application**, **BraspagAuth API** and **Risk Notification API**.

1. The **Client Application**, informs the **BraspagAuth API** your credential.

2. The **BraspagAuth API** validates the credential received. If valid, returns the access token for **Client Application**.

3. The **Client Application** informs the access token in the header of the HTTP requests made to the **Risk Notification API**.

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

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no corpo (Body)**

|Key|Value|
|:-|:-|
|`scope`|Chargeback|
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

# Simulating Chargeback

> Through this option you will be able to create chargeback for transactions only in the sandbox environment. To do this, perform a POST according to the guidelines below.

<aside class="request"><span class="method post">POST</span><span class="endpoint">chargeback/test</span></aside>

## Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

``` json
{
    "ChargebackBrandGroups": [{
        "Brand": "Visa",
        "Details": [{
            "Acquirer": "Cielo",
            "AcquirerCaseNumber": "2020052301",
            "AcquirerTransactionId": "0523103051968",
            "Amount": 100,
            "AuthorizationCode": "433946",
            "CardHolder": "Teste Holder",
            "EstablishmentCode": "TestAffiliation",
            "MaskedCardNumber": "402400******2931",
            "ReasonCode": "101",
            "ReasonMessage": "Responsabilidade EMV - Falsifcação",
            "SaleDate": "2020-05-23",
            "TransactionAmount": 100,
            "ProofOfSale": "3051968"
        }]
    },
    {
        "Brand": "Master",
        "Details": [{
            "Acquirer": "Cielo",
            "AcquirerCaseNumber": "2020052302",
            "AcquirerTransactionId": "0523103114691",
            "Amount": 100,
            "AuthorizationCode": "722134",
            "CardHolder": "Teste Holder",
            "EstablishmentCode": "TestAffiliation",
            "MaskedCardNumber": "402400******2931",
            "ReasonCode": "101",
            "ReasonMessage": "Responsabilidade EMV - Falsifcação",
            "SaleDate": "2020-05-23",
            "TransactionAmount": 100,
            "ProofOfSale": "3114691"
        }]
    }]
}
```

|Parameter|Description|Type|Required|Size|
|:-|:-|:-|
|`ChargebackBrandGroups[n].Brand`|Brand <br/> Informar o mesmo valor informado no campo `Payment.CreditCard.Brand` na criação da transação|string|yes|32|
|`ChargebackBrandGroups[n].Details[n].Acquirer`|Acquirer identifier <br/> Send fixed Cielo|string|yes|16|
|`ChargebackBrandGroups[n].Details[n].AcquirerCaseNumber`|Chargeback case number <br/> This value will be used to carry out the `Acceptance` and `Contestation` operations|string|yes|10|
|`ChargebackBrandGroups[n].Details[n].AcquirerTransactionId`|Acquirer transaction ID <br/> If a transaction was created using Pagador Braspag API, inform the same value received in the field `Payment.AcquirerTransactionId` of the response <br/> If a transaction was created using the Cielo 3.0 API or the Split Braspag API, inform the same value received in the `Payment.Tid` field of the response|string|yes|20| 
|`ChargebackBrandGroups[n].Details[n].Amount`|Chargeback amount in cents <br/> Ex: 123456 = r$ 1.234,56|long|yes|-|
|`ChargebackBrandGroups[n].Details[n].AuthorizationCode`|Acquirer authorization code <br/> Inform the same value received in the `Payment.AuthorizationCode` field of the response of the creation of the transaction|string|yes|8|
|`ChargebackBrandGroups[n].Details[n].CardHolder`|Card holder <br/> Inform the same value informed in the field `Payment.CrediCard.Holder` when creating the transaction <br/> In production, this field may be empty or may contain information other than the card holder|string|no|100|
|`ChargebackBrandGroups[n].Details[n].EstablishmentCode`|Establishment code or affiliation code <br/> Inform the same value informed in the field `Payment.Credentials.Code` when creating the transaction|string|yes|10|
|`ChargebackBrandGroups[n].Details[n].MaskedCardNumber`|Masked card number <br/> Inform the same value received in the `Payment.CreditCard.Number` field of the response of the creation of the transaction|string|yes|16|
|`ChargebackBrandGroups[n].Details[n].ReasonCode`|Chargeback reason code <br/> Inform the code according to the table XXXXXXX|string|yes|5|
|`ChargebackBrandGroups[n].Details[n].ReasonMessage`|Chargeback reason nessage <br/> Inform the message according to the table XXXXXXX|string|yes|128|
|`ChargebackBrandGroups[n].Details[n].SaleDate`|Acquirer authorization date <br/> Format: YYYY-MM-DD|date|yes|10|
|`ChargebackBrandGroups[n].Details[n].TransactionAmount`|Transaction amount in cents <br/> Inform the same value informed in the field `Payment.Amount` when creating the transaction <br/> Ex: 123456 = r$ 1.234,56|long|yes|-|
|`ChargebackBrandGroups[n].Details[n].ProofOfSale`|Acquirer unique sequential number (NSU) <br/> Inform the same value received in the `Payment.ProofOfSale` field of the response of the creation of the transaction|string|yes|20|

## Response

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

# Acceptance

## Accepting a chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "CaseNumber": "000001",
    "Status": 2,
    "StatusDescription": "AcceptedByMerchant"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`CaseNumber`|Chargeback case number|
|`Status`|Chargeback status - [Table 3 - Chargebacks{n}.Status]({{ site.baseurl_root }}manual/chargeback#table-4-status)|
|`StatusDescription`|Chargeback status description|

## Accepting a nonexistent chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was not found|
|`Message`|Message that chargeback was not found|

## Accepting a previously accepted or contested chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was previously accepted or contested|
|`Message`|Message that chargeback was previously accepted or contested|

# Contestation

## Contesting a chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

**Parameters in the body (Body)**

|Key|Value|Required|
|:-|:-|:-|
|`Content-Type`|form-data <br/> File extension jpeg, jpg or png <br/> Note: All files must add up to a maximum of 7mb in size. <br/> Note2: The deadline to submit the appeal is 7 calendar days, ie. chargeback from 2019-02-13 is possible to send the contestation until 2019-02-19|yes|

### Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

## Contesting a nonexistent chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was not found|
|`Message`|Message that chargeback was not found|

## Contesting a previously contested or accepted chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was previously contested or accepted|
|`Message`|Message that chargeback was previously contested or accepted|

## Contesting a chargeback and not sending the contestation files

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "FileNotFound",
    "Message": "File not found"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that contestation file was not sent|
|`Message`|Message that contestation file was not sent|

## Contesting a chargeback by submitting the contestation file with an extension different than jpeg, jpg or png

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "InvalidFileExtension",
    "Message": "Invalid file extension"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Code that the contestation file was sent with an invalid extension, different than jpeg, jpg or png|
|`Message`|Message that the contestation file was sent with an invalid extension, different than jpeg, jpg or png|

## Contesting a chargeback by submitting contest files larger than 7mb

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "InvalidFileLength",
    "Message": "Invalid file length"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Code that contest files exceeded 7mb in size|
|`Message`|Message that contest files exceeded 7mb in size|

# Queries

### Request

<aside class="request"><span class="method get">GET</span><span class="endpoint">Chargeback?StartDate={StartDate}&EndDate={EndDate}&PageIndex={PageIndex}&PageSize={PageSize}</span></aside>

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`StartDate`|Query start date|sim|
|`EndDate`|Quer end date|sim|
|`PageIndex`|Page number|yes|
|`PageSize`|Number of items per page <br/> Maximum 250 items|yes|
|`MerchantIds`|MerchantId(s) to be used in the query <br/> Note: If not submitted, the query will be performed taking into account the MerchantId(s) associated with ClientId|no|
|`EstablishmentCodes`|Establishment code(s) to be used in the query <br/> Note: If not submitted, the query will be performed taking into account the Establishment code(s) associated with ClientId|no|
|`CaseNumber`|Chargeback case number|no|
|`AcquirerTransactionId`|Acquirer transaction ID (TID)|no|
|`BraspagTransactionId`|Pagador transaction ID or PaymentId (Cielo 3.0)|no|

### Response

```json
{
    "PageIndex": 1,
    "PageSize": 250,
    "Total": 500,
    "Chargebacks":
    [
        {
            "Id": "fd14e3fb-cf2a-4228-b690-1338660afc54",
            "CreatedDate": "2018-09-01 09:51:25",
            "Date": "2018-08-30",
            "CaseNumber": "000001",
            "Amount": 10000,
            "ReasonCode": "28",
            "ReasonMessage": "Consumidor nao reconhece a compra",
            "Status": "Received",
            "Comment": "Cliente enviou documentos inválidos",
            "IsFraud": true,
            "Transaction":
            {
                "AcquirerType": "Cielo",
                "EstablishmentCode": "1234567890",
                "MerchantOrderId": "abc123efg",
                "Tid": "1234567890BA2018XPTO",
                "Nsu": "258654",
                "AuthorizationCode": "T85245",
                "SaleDate": "2018-08-15",
                "PagadorMerchantId": "a1052460-92b2-49c3-a929-fc985df0ba2f",
                "BraspagTransactionId": "bb33b5c5-82fe-4254-9f1d-b9c97297b0d5",
                "Amount": 10000,
                "RawData": "JOAO D COUVES",
                "MaskedCardNumber": "453906******8385",
                "Brand": "Visa",
                "AntifraudMerchantId": "4b1b017a-a8b5-4e83-ae36-19c69f11845e",
                "AntifraudTransactionId": "9f6ec028-b55d-4605-b655-164ce62aeaef",
                "AntifraudSourceApplication": "Gateway",
                "ProviderTransactionId": "5446494501496896403073",
                "NegativeValues": [
                    "CustomerDocumentNumber",
                    "ShippingStreet"
                ], 
                "ProviderChargebackMarkingEvent": {
                    "Id": "5446495589216876903021",
                    "Status": "ACCEPT",
                    "Code": "100",
                }
            }
        }
    ]
}
```

|Parameter|Description|Type|
|:-|:-|:-:|
|`Id`|Chargeback ID at Risk Notification API |guid|
|`CreatedDate`|Chargeback creation date at Risk Notification API<br/> Ex.: 2018-09-01 09:51:25|date|
|`Date`|Chargeback date <br/> Ex.: 2018-08-30|date|
|`CaseNumber`|Chargeback case number|string|
|`Amount`|Chargeback amount in cents <br/> Ex: 123456 = r$ 1.234,56|long|
|`ReasonCode`|Chargeback reason code|string|
|`ReasonMessage`|Chargeback reason nessage|string|
|`Status`|Chargeback status at Risk Notification API - [Table 3]({{ site.baseurl_root }}manual/chargeback#table-3-chargebacks[n].status)|string|
|`Comment`|Comment associated with chargeback <br/> If Cybersource transaction chargeback, this comment will be visible on Cybersource backoffice|string|
|`IsFraud`|Identifies if chargeback is fraud|bool|
|`Transaction.AcquirerType`|Acquirer identifier|string|
|`Transaction.EstablishmentCode`|Establishment code|string|
|`Transaction.MerchantOrderId`|Order ID|string|
|`Transaction.Tid`|Acquirer transaction ID|string|
|`Transaction.Nsu`|Acquirer unique sequential number (NSU)|string|
|`Transaction.AuthorizationCode`|Acquirer authorization code|string|
|`Transaction.SaleDate`|Acquirer authorization date <br/> Ex.: 2018-08-15|date|
|`Transaction.PagadorMerchantId`|Merchant ID at Pagador or Cielo 3.0|guid|
|`Transaction.BraspagTransactionId`|Transaction ID at Pagador or Cielo 3.0 (PaymentId)|guid|
|`Transaction.Amount`|Transaction amount in cents <br/> Ex: 123456 = r$ 1.234,56|long|
|`Transaction.RawData`|Data sent by acquirer and may be the card holder or other message|string|
|`Transaction.MaskedCardNumber`|Masked card number|string|
|`Transaction.Brand`|Brand|string|
|`Transaction.AntifraudMerchantId`|Merchant ID at Antifraud|guid|
|`Transaction.AntifraudTransactionId`|Transaction Id at Antifraud|guid|
|`Transaction.AntifraudSourceApplication`|Origin of the antifraud platform - [Table 6]({{ site.baseurl_root }}manual/chargeback#table-6-chargebacks[n].transaction.antifraudsourceapplication)|string|
|`Transaction.ProviderTransactionId`|Transaction ID at antifraud provider|
|`Transaction.NegativeValues`|Parameters that were included in negative list when antifraud transaction for Cybersource <br/> Parameters are concatenated using the character , <br/> Ex.: CustomerDocumentNumber, ShippingStreet <br> - [Table 1]({{ site.baseurl_root }}manual/chargeback#table-1-chargebacks[n].negativevalues)|string|
|`Transaction.ProviderChargebackMarkingEvent.Id`|ID of the chargeback transaction markup event. Cybersource only|string|
|`Transaction.ProviderChargebackMarkingEvent.Status`|Status of the chargeback transaction markup event. Cybersource only - [Table 4]({{ site.baseurl_root }}manual/chargeback#table-4-chargebacks[n].transaction.providerchargebackmarkingevent.status)|string|
|`Transaction.ProviderChargebackMarkingEvent.Code`|Code of the chargeback transaction markup event. Cybersource only - [Table 5]({{ site.baseurl_root }}manual/chargeback#table-5-chargebacks[n].transaction.providerchargebackmarkingevent.code)|string|

# Tables

## Table 1 - Chargebacks[n].NegativeValues

Possible values to be entered in the negative list in Cybersource

|Value|Description|
|:-|:-|
|CustomerDocumentNumber|Customer document number: CPF or CNPJ|
|CustomerIpAddress|Customer IP address|
|CustomerPhone|Customer phonenumber|
|ShippingStreet|Shipping address street|
|DeviceFingerprintSmartId|Customer device fingerprint|

## Table 2 - Result.ProcessingStatus

Possible returns of the sent chargeback

|Value|Description|
|:-|:-|
|AlreadyExist|Transaction already marked with chargeback previously|
|Remand|Chargeback to be resent|
|NotFound|Transaction found in database for values sent in `Transaction` node fields|

## Table 3 - Chargebacks[n].Status

Possible chargeback values

|Value|Description|
|:-|:-|
|Received|Chargeback received from acquirer|
|AcceptedByMerchant|Chargeback accepted by merchant. In this case the store understands that it has indeed suffered a chargeback and will not hold the dispute|
|ContestedByMerchant|Chargeback contested by merchant. In this case the store has sent the necessary documents to try to reverse the chargeback|

## Table 4 - Chargebacks[n].Transaction.ProviderChargebackMarkingEvent.Status

|Value | Description | Provider |
|:-|:-|:-|
|ACCEPT|Chargeback markup accepted on provider|Cybersource|
|REJECT|Chargeback markup rejected on provider|Cybersource|

## Table 5 - Chargebacks[n].Transaction.ProviderChargebackMarkingEvent.Code

|Value|Description|Provider|
|:-|:-|:-|
|100|Operation successfully performed|Cybersource|
|150|Internal Error <br/> Possible Action: Wait a few minutes and try resubmitting the chargeback tag|Cybersource|
|151|The chargeback flag was received, but timeout occurred on the server. This error does not include client-server time-out <br/> Possible Action: Please wait a few minutes and try resubmitting|Cybersource|
|152|Chargeback markup received, but timeout occurred <br/> Possible action: Please wait a few minutes and try resubmitting|Cybersource|
|234|Cybersource Store Configuration Issue <br/> Possible Action: Contact support to fix configuration issue|Cybersource|

## Table 6 - Chargebacks[n].Transaction.AntifraudSourceApplication

|Value|Description|Provider|
|:-|:-|
|Gateway|Gateway Antifraud|
|Legacy|Legacy Antifraud|

# Matrix

## Matrix 1 - Documents

|Segment\Reason|Standard Documents|Bearer Does Not Recognize Transaction|Product Not Received|Services Not Provided|Product Defective/Does not Check|Unprocessed Credit|Duplicate Processing/Payments by Other Methods|
|Rental Company|1) Copy of Proof of Sale <br/> 2) Cardholder Registration (name of cardholder, name registered on the website, Social Security Number, email, address, landline / mobile) <br/> 3) Invoice <br/> 4) Duly signed rental agreement stating insurance policy <br/> 5) Signature document on file (debit authorization)|6) Notification of paid traffic violation (if any) <br/> 7) Disclaimer (future damage) <br/> 8) Event report (if any) <br/> 9) Three accident and vehicle repair budgets (if any) <br/> 10 ) Notice to the bearer of damage / penalty charges|-|6) Proof of checkout|-|6) Cancellation policy|6) Two or more vouchers proving that there have been two or more transactions, inform the authorization code of the two transactions|
|Hotels|1) Copy of proof of sale <br/> 2) Holder's registration (cardholder name, website name, social security number, email, address, landline / mobile phone) <br/> 3) Invoice <br/> 4) File signature document (debit authorization)|5) Description of services provided (chekin and checkout)|-|5) Description of services provided (chekin and checkout)|-|5) cancellation (no show) with a copy of the cancellation option screen on the website by the carrier proving the date|5) Two or more vouchers proving that there were two or more transactions, inform the authorization code of the two transactions|
| Tourist Agency | 1) Copy of proof of sale <br/> 2) Holder's registration (Cardholder Name, Website Name, Social Security Number, Email, Address, Landline / Mobile) <br/> 3) Invoice <br/> 4) Travel Service Agreement (if any) | 5) Official document certifying bearer's identity (double-sided) <br/> 6) Signature document on file (debit authorization) ) | - | 5) Copy of issued tickets / voucher's | - | 5) Cancellation policy | 5) Two or more vouchers showing that there have been two or more transactions, inform the authorization code of the two transactions|
|Cias Aereas|1) Copy of proof of sale <br/> 2) Cardholder registration (name of cardholder, name registered on the website, social security number, email, address, landline / mobile phone) <br/> 3 ) Invoice <br/> 4) Travel service agreement (if any)|5) Official document certifying bearer's identity (double-sided) <br/> 6) Signature document on file (debit authorization)|-| 5) Copy of issued tickets / voucher's <br/> 6) Checkin (if any)|-|5) Cancellation policy|5) Two or more vouchers showing that there have been two or more transactions, enter authorization code of the two transactions|
|Data Processing Service <br/> Online Services |1) Copy of Proof of Sale <br/> 2) Cardholder Registration (name of cardholder, name registered on the website, Social Security Number, email, address, phone number) fixed / mobile) <br/> 3) Invoice <br/> 4) Debit authorization <br/> 5) Purchase order for internet transactions <br/> 6) Copy of payment details screen|7) Description of the Services Provided <br/> 8) Cardholder Registration (Name of cardholder, Name registered on the website, Social Security number, Email, Address, Landline / Mobile|-|7) Contract with details of the provision of services <br/> 8) Protocol on services provided|-|-|-|
|Supermarket or Retail|1) Copy of Proof of Sale <br/> 2) Cardholder Registration (Cardholder's Name, Website Name, Social Security Number, Email, Address, Landline / Mobile) <br/> 3) Invoice <br/> 4) Debit authorization <br/> 5) Purchase order for internet transactions <br/> 6) Copy of payment details screen 7) Description of services provided <br/> 7) Proof of delivery of product and / or signed protocol <br/> 8) Electronic acceptance (if any)|7) Contract with details of service provision <br/> 8) Protocol of services provided|7) Return policy and exchange with electronic acceptance (if any)|7) Cancellation policy|7) Two or more vouchers proving that there have been two or more transactions, inform the authorization code of the two transactions|
|Tickets|1) Copy of Proof of Sale <br/> 2) Cardholder Registration (Cardholder's Name, Website Name, Social Security Number, Email, Address, Landline / Mobile) <br/> 3) Invoice <br/> 4) Debit Authorization <br/> 5) Purchase Order for Internet Transactions <br/> 6) Copy of Means of Payment Screen |-|7) Proof of Product Delivery and / or signed protocol <br/> 8) Electronic accept (if any)|-|7) Return and exchange policy with electronic accept (if any)|-|-|
|Publisher or Bookstore|1) Copy of Proof of Sale <br/> 2) Cardholder Registration (Cardholder's Name, Website Name, Social Security Number, Email, Address, Landline / Mobile) <br/> 3) Invoice <br/> 4) Debit Authorization <br/> 5) Purchase Order for Internet Transactions <br/> 6) Copy of Means of Payment Screen|-|7) Proof of Delivery product and / or signed protocol <br/> 8) Electronic accept (if any)|-|7) Return and exchange policy with electronic accept (if any)|-|-|
|Insurance Companies|1) Copy of proof of sale <br/> 2) Cardholder registration (name of cardholder, name registered on the website, social security number, email, address, landline / mobile) <br/> 3) Invoice <br/> 4) Debit authorization <br/> 5) Purchase order for internet transactions <br/> 6) Copy of payment method screen|-|-|7) return and exchange with electronic acceptance (if any)|-|-|
|Other Segments|1) Copy of proof of sale <br/> 2) Cardholder registration (name of cardholder, name registered on the website, social security number, email, address, landline / mobile) <br/> 3 ) Invoice <br/> 4) Debit Authorization <br/> 5) Purchase Order for Internet Transactions <br/> 6) Copy of Means of Payment Screen|7) Proof of Product Delivery and / or signed protocol <br/> 8) Letter from the true bearer acknowledging the expense|7) Proof of delivery of the product and / or signed protocol <br/> 8) Electronic acceptance (if any)|7) Contract with delivery details Services <br/> 8) Service Protocol|7) Return and Exchange Policy with Electronic Acceptance (if any)|7) Cancellation Policy|7) Two or more vouchers showing that there were two or more transactions, enter code of authorization of the two transactions|