---
layout: manual
title: Cartão Protegido Integration Guide
description: Technical Integration Tokenization via REST API Braspag
search: true
translated: true
categories: manual
tags:
  - 2. Cartão Protegido
language_tabs:
  json: JSON
  shell: cURL
---

# Cartão Protegido

**Cartão Protegido** is a platform that enables secure storage of credit and debit cards. Braspag is PCI Security Standards Council compliant, which ensures that Braspag enironment fully follows the strict requirements and standards determined by PCI.

Cartão Protegido is compatible with Braspag's Pagador Gateway, facilitating the processing of credit and debit card transactions via token.

## Main benefits

![Cartão Protegido Benefícios]({{ site.baseurl_root }}/images/braspag/cartaoprotegido/cp-en.png)

* **Renova Fácil***: interesting feature especially for merchants working on the recurrence model. Through the card brand's technology, any update to the card number that has been blocked or canceled by the issuer is automatically informed to Braspag, which in turn associates the new card with the existing token, all of which is fully transparent to merchants and shoppers. This feature is available for Elo, Mastercard, and Visa cards.

* **Higher conversion rate***: tokenized transactions processed at Braspag via Pagador may result in a higher than average market conversion rate. This is because card brand tokenized cards improve security in the process, so issuers tend to approve the transaction more easily. Cartão Protegido is available for Visa and Mastercard cards processing via Cielo 3.0.

* **PCI DSS Secure Environment**: Braspag has a PCI DSS certified environment, which ensures the integrity and security of sensitive data such as credit card data.

* **Valid card use guaranteed***: Cartão Protegido will only accept saving cards that pass the Luhn Algorithm check, also known as "mod10". This will give you greater security and certainty that saved cards have the least validation of their veracity.

*Check availability and enable the feature with [Braspag Support](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672){:target="_blank"}.

## Use Cases

The purpose of the platform is to help merchants in several use cases, including:

* **Scheduled Recurring Payments**: merchants that already have an internal recurrence management solution can use the platform to store credit card data and process through payment tokens. Example: Subscription Services.

* **Unscheduled Recurring Payments**: merchants that charge their registered customers, but without a defined periodicity. Example: car ride services apps.

* **One Click Payment**: allows an online credit card payment to be completed by skipping the step of filling in payment details or even the entire payment process. Card details previously informed by the shopper on past purchases will be replicated on future purchases upon their authorization.

* **Sales Recovery**: merchants can contact customers who may have had problems during the purchase, offering a new billing attempt.

## Architecture

Integration is made through services as Web Services. The model used is quite simple: Through the endpoint all requests related to this service will be sent. This URL will receive HTTP messages via POST, GET, or DEL methods. Each type of message must be sent to an address identified through "path".

| Endpoint | Environment |
| --- | --- |
| https://cartaoprotegidoapisandbox.braspag.com.br/ | Sandbox |
| https://cartaoprotegidoapi.braspag.com.br/ | Production |

* **POST** - The HTTP POST method is used to create the token.
* **DEL** - The HTTP DEL method is used for token removal.
* **GET** - The HTTP GET method is used for querying existing resources. For example, query for tokens already created.

# Integration

## Transaction flow

You can integrate with Cartão Protegido with one of the options:

1. Simouteneously to the authorization process, through Pagador API. Check [Pagador documentation] for more information.
2. Before the authorization (sale), sending a tokenization request direct to Cartão Protegido API.

Check the transactional flow representation for when the tokenization is requested directly to Cartão Protegido API:

![Cartão Protegido fluxo]({{ site.baseurl_root }}/images/braspag/cartaoprotegido/fluxo-cp-en.png)

> Please, also refer to using [VerifyCard]() with Cartão Protegido.

## Postman Collection - **ver se a coleção está igual ao PT**

For those who want to try out the APIs directly via Postman, follow the link to download the collection:

* Postman Collection: [https://bit.ly/2YX3YwE[(https://bit.ly/2YX3YwE){:target="_blank"}
* Sandbox Variables: [https://bit.ly/2YX3YwE[(https://bit.ly/2YX3YwE){:target="_blank"}

## Authentication

In order to consume API methods, you must get `AccessToken` in the OAuth 2.0 standard.

|Environment|URL + Endpoint|Authorization|
|---|---|---|
|**SANDBOX**|https://authsandbox.braspag.com.br/oauth2/token|"Basic {base64}"|
|**PRODUCTION**|https://auth.braspag.com.br/oauth2/token|"Basic {base64}"|

**How to get the "{base64}" value for "Basic" authorization:**

During onboarding, you will receive the `ClientId` and `ClientSecret` credentials. If you have not received the credentials, contact [Braspag Support]().

1. Concatenate `ClientId` and `ClientSecret` (`ClientId`:`ClientSecret`).
2. Encode the concatenation result in base64, creating a string.
3. Send a request to the authorization server using the alphanumeric code created (string) - see example below.
4. The authentication API will validate the string and return the `access_token`.

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
|`access_token`|The requested access token. The application can use this token to authenticate with the protected resource.|
|`token_type`|Indicates the value of the token type.|
|`expires_in`|Access token expiration, in seconds <br/> After the token expires, you need to generate a new token.|

## Create card token

Save a card and get the `TokenReference` as a response. The response will also return the card data as a token.

### Request

<aside class="request"><span class="method post">POST</span><span class="endpoint">/v1/Token</span></aside>

```json
{
    "Alias":"5R2O4042YP",
    "Card": {
        "Number": "4551870000000183",
        "Holder": "Joao da Silva",
        "ExpirationDate": "12/2030",
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
        "ExpirationDate": "12/2030",
        "SecurityCode": "123"
    }
}
```

|Parameters|Type|Size|Required|Description|
|---|---|---|---|---|
|`Content-Type`|Text| - | Yes (header) | "application/json"|
|`MerchantID`|GUID|-|Yes|Cartão Protegido's Merchant ID for the environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes|** Bearer ** _ (access-token) _<BR>(the access token generated in the previous step).|
|`Alias`|Text|64|No|Card Alias. The value of this information must be unique (cannot repeat).|
|`Card.Number`|Number|16|Yes|Shopper card number.|
|`Card.Holder`|Text|25|Yes|Shopper's name printed on the card.|
|`Card.ExpirationDate`|Text|7|Yes|Expiration date printed on the card in MM/YYYY format.|
|`Card.SecurityCode`|Number|4|Yes|Security code printed on the back of the card.|

### Response

```json
{
    "Alias": "5R2O4042YP",
    "TokenReference": "c2e0d46e-6a78-409b-9ad4-75bcb3985762",
    "ExpirationDate": "2025-12-31",
    "Card": {
        "Number": "************0183",
        "ExpirationDate": "12/2030",
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
    "ExpirationDate": "2025-12-31",
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
|`Alias`|Credit card alias|Text|64|Any text that is unique to the merchant's token base.|
|`TokenReference`|Token on Cartão Protegido representing card data.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ExpirationDate`|Token expiration date, in format MM/YYYY.|Text|7|MM/YYYY|
|`Card.Number`|Number|16|Yes|Masked card number.|
|`CreditCard.Holder`|Text|25|Yes|Name of cardholder printed on card|
|`Card.ExpirationDate`|Text|7|Yes|Expiration date printed on card in MM/YYYY format|
|`Card.SecurityCode`|Number|4|Yes|Security code printed on back of masked card|

## Get token information

Obtain information related to a token reference, such as status, masked crd, expiration date, and cardholder name.

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
|`MerchantID`|GUID|-|Yes (header)|Cartão Protegido's Merchant ID in their environment (Sandbox / Production)|
|`Authorization`|Text|-|Yes (header)|**Bearer** _ (Authorization) _<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes (header) |application/json|
|`TokenReference`|GUID|36|Yes (path)|Cartão Protegido token representing card data.|

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
|`TokenReference`|Cartão Protegido token representing card data.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Text|10|No|Current Cartão Protegido token status.||-|Possible values: Active, Removed, Suspended.|Text|
|`Provider`|Indicates the provider that stored the card.|-|Possible values: "Braspag" / "Master" / "Visa"|Text|
|`Account.Number`|Masked card number|Text|16|-|
|`Account.Holder`|Shopper's name printed on card, without accented characters.|Text|25|Example: Jose da Silva|
|`Account.ExpirationDate`|Expiration date printed on card in MM/YYYY format|Text|7|Example: 12/2021|

## Get token using alias

Get the token reference from a previously informed alias.

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
|`MerchantID`|GUID|-|Yes (header)|Cartão Protegido's Merchant ID for the environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes (header) |**Bearer** _(Authorization)_<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes (header) |application/json|
|`Alias`|Text|64|Yes (path) |Alias of credit card previously used in Create Token method|

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
|`TokenReference`|Cartão Protegido token representing card data.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Delete token

Delete token reference permanently from data base. 

> The `TokenReference` deleted by this method cannot be recovered in the future.

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
|`MerchantID`|GUID|-|Yes (header) |Cartão Protegido's Merchant ID in their environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes (header) |** Bearer ** _(Authorization)_<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes (header) |application/json|
|`RemovedBy`|Text|10|Yes (body)|Who requested the removal. Possible values: 'Merchant' or 'CardHolder'|
|`Reason`|Text|10|Yes (body) |Reason for token removal. Possible values: 'FraudSuspicion' or 'Other'|

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

## Suspend token

Suspend a token reference temporarily.

> The `TokenReference` suspended by this method can be reactivated via the [Unsuspend Token Reference] method.

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
|`MerchantID`|GUID|-|Yes (header) |Cartão Protegido's Merchant ID in their environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes (header) |**Bearer** _(Authorization)_<BR>(`access_token` generated in the previous step)|
|`Content-Type`|Text|-|Yes (header) |application/json|
|`RemovedBy`|Text|10|Yes (body)|Who requested the removal. Possible values: "Merchant" or "CardHolder".|
|`Reason`|Text|10|Yes (body)|Reason for token removal. Possible values: "FraudSuspicion" or "Other".|

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

## Unsuspend token

Reactivate a token reference that was temporarily suspended.

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
|`MerchantID`|GUID|-|Yes (header)|Cartão Protegido's Merchant ID in their environment (Sandbox/Production)|
|`Authorization`|Text|-|Yes (header)|**Bearer** _(Authorization)_<BR>(is the access token generated in the previous step)|
|`Content-Type`|Text|-|Yes (header)|application/json|

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
|`TokenReference`|Cartão Protegido token representing card data|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Text|10|No|Current Cartão Protegido token status.|

# Error codes

In case of error in the request, the error codes and their description will be returned as shown below.

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
|CP903|Token alias already exists|Alias has been previously used.|
|CP990|'XXXXX' must not be empty.|Any field is invalid.|

# Implementation tips

## Card security code

The card security code is required for an authorization to be accepted by the card issuing bank. The security code is one of the security mechanisms in fraud analysis, seeking to validate that the person who is using the card is in fact its owner.

For this reason, PCI rules allow you to store the card number and expiration date but never the security code, not even if PCI certified like Braspag.
 
The recommendation is that the security is always requested in the moment of the purchase.

<aside class="notice">Merchants that operate the recurrence-based business model, such as service subscriptions, must request the acquirer for permission of transactions without the security code.</aside>

## One click payment

Here we present a few tips to improve your conversion rate:

* **Save the masked card number** to show the shopper which card they have enabled for the “one click payment” on your website.
* **Save the expiration date**, to actively communicate to the customer that the card they have stored has expired and suggest the exchange.
* **Always ask the shopper** if they want to store the card details for next purchase.
* **Secure login and password of website users** - very weak passwords are easily discovered and the fraudster can make a purchase even without the card (if security card is not required).
* **Control session variables** to prevent the user (customer login) from being logged in to the website and someone else accessing it later and making “one click payments” with this login (e.g.: users logged into lan houses).
