---
layout: manual
title: Cartão Protegido Manual integration
description: Technical integration Tokenization via REST API Braspag
search: true
translated: true
categories: manual
tags:
  - Cartão Protegido
language_tabs:
  json: JSON
  shell: cURL
---

# What is Cartão Protegido?

The **Cartão Protegido** is a platform that enables secure storage of credit and debit cards. We have a fully certified environment by the respected PCI Security Standards Council, which ensures that Braspag fully follows the strict requirements and standards determined by it.

The platform is compatible with Braspag's Pagador gateway, facilitating the processing of credit and debit card transactions via token.

## Main benefits

* **Atualiza Fácil**: The platform has _Atualiza Fácil_, which is a very interesting feature especially for those working on the recurrence model. Through the brand's technology, any update to the card number that has been blocked or canceled by the issuer is automatically informed to Braspag, which in turn associates the new card with the existing token, all of which is fully transparent to merchants and shoppers. This feature is available for Mastercard and Visa cards and you should request to enable it through Braspsag's support channel.

* **Higher conversion rate**: Tokenized transactions processed at Braspag via Pagador may result in a higher than average market conversion rate. This is because tokenized cards in the flags are allowed along with the cryptogram, which provides greater security in the process, so issuers tend to approve more easily. This feature is available for Mastercard cards processing via Cielo 3.0. Request the activation through Braspsag's support channel.

* **PCI DSS Secure Environment**: Braspag has a PCI DSS certified environment, which ensures the integrity and security of sensitive data such as credit card data.

* **Guaranteed use of valid cards**: Cartão Protegido will only accept saving cards that pass the Luhn Algorithm check, also known as "mod10". This will give you greater security and certainty that saved cards have the least validation of their veracity.

## Use Cases

The purpose of the platform is to help establishments that have several use cases, including:

* **Scheduled Recurring Payments**: Merchants that already have an internal recurrence management solution can use the platform to store credit card data and process through payment tokens. Example: Subscription Services.

* **Unscheduled Recurring Payments**: Establishments that charge their registered customers, but without a defined periodicity. Example: Car ride Applications.

* **One Click Payment**: _One Click Payment_ allows an online credit card payment to be made by skipping the step of filling in payment details or even the entire payment process. shopping cart process, as the card details have been previously informed by the shopper on past purchases and will be replicated on future purchases upon their authorization.

* **Sales Recovery**: Merchants can contact customers again who may have had problems purchasing, offering a new billing attempt.

## Architecture

Integration is made through services as Web Services. The model used is quite simple: Through the endpoint https://cartaoprotegidoapisandbox.braspag.com.br/v1/ all requests related to this service will be sent. This URL will receive HTTP messages via POST, GET, or DEL methods. Each type of message must be sent to an address identified through "path".

* **POST** - The HTTP POST method is used to create the token.
* **DEL** - The HTTP DEL method is used for token removal.
* **GET** - The HTTP GET method is used for querying existing resources. For example, query for tokens already created.

# How does it integrate?

## Postman Collection

For those who want to try out the APIs directly via Postman, follow the link to download the collection:

* Postman Collection: [https://bit.ly/2YX3YwE[(https://bit.ly/2YX3YwE)
* Sandbox Variables: [https://bit.ly/2YX3YwE[(https://bit.ly/2YX3YwE)

## Authentication Step

To consume API methods, you must get AccessToken in the OAuth 2.0 standard.

|Environment|Endpoint|Authorization|
|---|---|---|
|**SANDBOX**|https://authsandbox.braspag.com.br/oauth2/token|**Basic _(Authorization)_**<br><br>The Authorization value must be obtained by concatenating the value of the "ClientID", colon (":"), and "ClientSecret"<br><br>E.g.: b4c14ad4-5184-4ca0-8d1a-d3a7276cead9:qYmZNOSo/5Tcjq7Nl2wTfw8wuC6Z8gqFAzc/utxYjfs=<br><br>and then encode the result in base 64. <br>This will generate an alphanumeric access code that will be used in the access token. For testing purposes, use the following data: ClientID<br><br>: ** b4c14ad4-5184-4ca0-8d1a-d3a7276cead9**<br>ClientSecret:**qYmZNOSo/5Tcjq7Nl2wTfw8wuC6Z8gqFAzc/utxYjfs=**|
|---|---|
|**PRODUCTION**|https://auth.braspag.com.br/oauth2/token|Request the "ClientID" and "ClientSecret" data from the support team after completing sandbox development.|

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

```shell
--request POST "https://authsandbox.braspag.com.br/oauth2/token"
--header "Authorization: Basic _(Authorization)_"
--header "Content-Type: application/x-www-form-urlencoded"
--body "grant_type=client_credentials"
```

|Parameters|Description|
|---|---|
|`Authorization`|Basic _(Authorization)_|
|`Content-Type`|application/x-www-form-urlencoded|
|`grant_type`|client_credentials|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

```shell
curl
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

|Response|Properties|Description|
|---|---|
|`access_token`|The requested access token. The application can use this token to authenticate with the protected resource|
|`token_type`|Indicates the value of the token type|
|`expires_in`|Expiration of the access token, in seconds <br/> The token when expiring, it is necessary to get a new|

## Create Token Reference

The purpose of this method is to save a card and get the token reference (Token Reference) as a response.

### Request

<aside class="request"><span class="method post">POST</span><span class="endpoint">/v1/Token</span></aside>

```json
{
    "Alias":"5R2O4042YP",
    "Card": {
        "Number": "4551870000000183",
        "Holder": "Joao da Silva",
        "ExpirationDate": "12/2021",
        "SecurityCode": "123"
    }
}
```

```shell
curl
--request POST "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
{
    "Alias":"5R2O4042YP",
    "Card": {
        "Number": "4551870000000183",
        "Holder": "Joao da Silva",
        "ExpirationDate": "12/2021",
        "SecurityCode": "123"
    }
}
```

|Parameters|Type|Size|Required|Description|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Yes|Cartão Protegido's Merchant ID in their environment (Sandbox / Production)|
|`Authorization`|Text|-|Yes|** Bearer ** _ (Authorization) _<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes|application / json|
|`Alias`|Text|64|No|Card Alias. The value of this information must be unique (cannot repeat).|
|`Card.Number`|Number|16|Yes|Shopper Card Number|
|`Card.Holder`|Text|25|Yes|Shopper's Name Printed on Card|
|`Card.ExpirationDate`|Text|7|Yes|Expiration date printed on card in MM / YYYY format|
|`Card.SecurityCode`|Number|4|Yes|Security code printed on back of card|

### Response

```json
{
    "Alias": "5R2O4042YP",
    "TokenReference": "c2e0d46e-6a78-409b-9ad4-75bcb3985762",
    "ExpirationDate": "2021-12-31",
    "Card": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Joao da Silva",
        "SecurityCode": "***"
    },
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762/suspend"
        }
    ]
}
```

```shell
curl
--request POST "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token"
--header "Content-Type: application/json"
--data-binary
{
    "Alias": "5R2O4042YP",
    "TokenReference": "c2e0d46e-6a78-409b-9ad4-75bcb3985762",
    "ExpirationDate": "2021-12-31",
    "Card": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Joao da Silva",
        "SecurityCode": "***"
    },
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762/suspend"
        }
    ]
}
```

|Properties|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`Alias`|Credit Card Alias|Text|64|Any text that is unique to the establishment's token base|
|`TokenReference`|Token on Cartão Protegido representing card data|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ExpirationDate`|Token Expiration Date, format MM/YYYY|Text|7|MM/YYYY|
|`Card.Number`|Número|16|Sim|Masked card number|
|`CreditCard.Holder`|Text|25|Yes|Name of cardholder printed on card|
|`Card.ExpirationDate`|Text|7|Yes|Expiration date printed on card in MM/YYYY format|
|`Card.SecurityCode`|Number|4|Yes|Security code printed on back of masked card|

## Get Token Reference Information

The purpose of this method is to obtain information related to a token reference, such as Status, Masked Card, Expiration Date, and Card Holder Name.

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v1/Token/{TokenReference}</span></aside>

```shell
curl
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
```

|Parameters|Type|Size|Required|Description|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Yes|Cartão Protegido's Merchant ID in their environment (Sandbox / Production)|
|`Authorization`|Text|-|Yes|**Bearer** _ (Authorization) _<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes|application/json|
|`TokenReference`|GUID|36|Yes|Token on Protected Card representing card data|

### Response

```json
{
    "TokenReference": "1fdb4ef8-17f3-4f26-87e9-3a5f34bca8a0",
    "Status": "Active",
    "Provider": "Braspag",
    "Account": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Runscope Teste"
    }
}
```

```shell
curl
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "1fdb4ef8-17f3-4f26-87e9-3a5f34bca8a0",
    "Status": "Active",
    "Provider": "Braspag",
    "Account": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Runscope Teste"
    }
}
```

|Properties|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token on Cartão Protegido representing card data|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Text|10|No|Current Cartão Protegido token status||-|Possible values: Active, Removed, Suspended|Text|
|`Provider`|Indicates the provider that stored the card.|-|Possible values: Braspag or Master|Text|
|`Account.Number`|Masked Buyer Card Number|Text|16|-|
|`Account.Holder`|Shopper's Name printed on card, without accented characters|Text|25|Example: Jose da Silva|
|`Account.ExpirationDate`|Expiration date printed on card in MM / YYYY format|Text|7|Example: 12/2021|

## Get Token Reference

The purpose of this method is to get the token reference from a previously entered alias.

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v1/Alias/_{Alias}_/TokenReference</span></aside>

### Request

```shell
curl
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Alias/_{Alias}_/TokenReference"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
```

|Parameters|Type|Size|Required|Description|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Yes|Cartão Protegido's Merchant ID in their environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes|**Bearer** _(Authorization)_<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes|application/json|
|`Alias`|Text|64|No|Alias of credit card previously used in Create Token method|

### Response

```json
{
    "TokenReference": "a36ffc37-e472-4d85-af2a-6f64c52bcccf"
}
```

```shell
curl
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Alias/_{Alias}_/TokenReference"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "a36ffc37-e472-4d85-af2a-6f64c52bcccf"
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token on Cartão Protegido representing card data|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Delete Token Reference

The purpose of this method is to remove the base token reference permanently. The Token Reference removed by this method does not allow it to be recovered in the future.

<aside class="request"><span class="method delete">DELETE</span> <span class="endpoint">/v1/Token/{TokenReference}</span></aside>

### Request

```json
{
     "RemovedBy":"Merchant",
     "Reason":"Other"
}
```

```shell
curl
--request DELETE "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
{
     "RemovedBy":"Merchant",
     "Reason":"Other"
}
```

|Parameters|Type|Size|Required|Description|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Yes|Cartão Protegido's Merchant ID in their environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes|** Bearer ** _(Authorization)_<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes|application/json|
|`RemovedBy`|Text|10|Yes|Who requested the removal. Possible values: 'Merchant' or 'CardHolder'|
|`Reason`|Text|10|Yes|Reason for token removal. Possible values: 'FraudSuspicion' or 'Other'|

### Response

```json
{
    "TokenReference": "26eb7cb4-c2b4-4409-8d2e-810215c42eee",
    "Status": "Removed",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/26eb7cb4-c2b4-4409-8d2e-810215c42eee"
        }
    ]
}
```

```shell
curl
--request DELETE "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "26eb7cb4-c2b4-4409-8d2e-810215c42eee",
    "Status": "Removed",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/26eb7cb4-c2b4-4409-8d2e-810215c42eee"
        }
    ]
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token on Cartão Protegido representing card data|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Text|10|No|Current Cartão Protegido token status|

## Suspend Token Reference

The purpose of this method is to suspend a token reference temporarily. Token Reference suspended by this method can be reactivated via the Unsuspend Token Reference method.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/suspend</span></aside>

### Request

```json
{
     "RemovedBy":"Merchant",
     "Reason":"FraudSuspicion"
}
```

```shell
curl
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/suspend"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
{
     "RemovedBy":"Merchant",
     "Reason":"FraudSuspicion"
}
```

|Parameters|Type|Size|Required|Description|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Yes|Cartão Protegido's Merchant ID in their environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes|**Bearer** _(Authorization)_<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes|application/json|
|`RemovedBy`|Text|10|Yes|Who requested the removal. Possible values: 'Merchant' or 'CardHolder'|
|`Reason`|Text|10|Yes|Reason for token removal. Possible values: 'FraudSuspicion' or 'Other'|

### Response

```json
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Suspended",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        }
    ]
}
```

```shell
curl
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/suspend"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Suspended",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        }
    ]
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token on Cartão Protegido representing card data|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Text|10|No|Current Cartão Protegido token status|

## Unsuspend Token Reference

The purpose of this method is to reactivate a token reference.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/unsuspend</span></aside>

### Request

```shell
curl
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/unsuspend"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
```

|Parameters|Type|Size|Required|Description|
|---|---|---|
|`MerchantID`|GUID|-|Yes|Cartão Protegido's Merchant ID in their environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes|**Bearer** _(Authorization)_<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes|application/json|

### Response

```json
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Active",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9/suspend"
        }
    ]
}
```

```shell
curl
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/unsuspend"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Active",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9/suspend"
        }
    ]
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token on Cartão Protegido representing card data|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Text|10|No|Current Cartão Protegido token status||

# Error codes

In case of error in the request, the error codes and their description will be informed, as the example.

### Response

```json
{
    "Errors": [
        {
            "Code": "CP903",
            "Message": "Token alias already exists"
        }
    ]
}
```

```shell
curl
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token"
--header "Content-Type: application/json"
--data-binary
{
    "Errors": [
        {
            "Code": "CP903",
            "Message": "Token alias already exists"
        }
    ]
}
```

|Code|Message|Description|
|------|--------|---------|
|CP903|Token alias already exists|Happens when Alias has been previously used.|
|CP990|'XXXXX' must not be empty.|Happens when any field is invalid.|

# Implementation Tips

## Card Security Code

The security code is required for an authorization to be accepted by the card issuing bank. It is another security mechanism in the anti-fraud process, where it seeks to validate that the person who is using the card is in fact its owner.
For this reason, PCI rules allow you to store the card number and validity, but never the security code, not even the PCI certified Braspag.
The recommendation is that the CVV is always requested at the time of purchase.

<aside class="notice">Establishments that have the recurrence-based business model, such as service subscriptions, must request from the contracted acquirer the release of transactions without CVV.</aside>

## One click payment

A tip to improve your conversion is to save the masked card number to show the customer which card they have enabled for the “1 click payment” on the site;

* Optionally also save the expiration date, to actively communicate to the customer that the card they have stored has expired and suggest the exchange;
* Always ask if the buyer wants to store the card details for next purchase;
* Security of login and password of users of the site - very weak passwords are easily discovered and the fraudster can make a purchase even without the card (in case of not requesting CVV by the site);
* Control session variables to prevent the user (customer login) from being logged in to the site and someone else accessing it later by making “one click payments” with this login (E.g.: users logged into lan houses).
