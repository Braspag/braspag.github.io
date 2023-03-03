---
layout: manual
title: Silent Order Post Integration Guide
description: Gateway Braspag Technical Integration
search: true
translated: true
categories: manual
sort_order: 2
tags:
  - 1. Pagador
language_tabs:
  shell: cURL
---

# Silent Order Post

Integration that Braspag offers to retailers, where payment data is securely trafficked, maintaining complete control over the checkout experience.

This method enables you to securely send your customer payment data directly to our system. Payment data such as card number and expiration date are stored in the Braspag environment, which is PCI DSS 3.2 certified.

It is ideal for retailers who demand a high degree of security without losing the identity of their page, allowing full customization on their checkout page.

# Features

* Capture payment data directly to Braspag systems through the fields defined in your checkout using a javascript script.
* Compatibility with all payment methods available at the Pagador's gateway (National and International)
* PCI DSS scope reduction
* Maintain full control over the checkout experience while maintaining your brand's look & feel.

# Transactional Flow

![Silent Order Post Flux]({{ site.baseurl_root }}/images/fluxo-sop-br.jpg)

# Integration

## 1. Getting Access Token OAuth2

When the shopper accesses the checkout, the merchant must generate the AccessToken from Braspag Authentication API (oAuth). On success, the API will return an AccessToken that must be populated in the script to load on the page.

To request AccessToken, send a request (POST) to the following endpoint in the server-to-server template:

|Environment | base URL + endpoint | Authorization |
|---|---|---|
| **SANDBOX** | https://authsandbox.braspag.com.br/oauth2/token | "Basic *{base64}*"|
| **PRODUCTION** | https://auth.braspag.com.br/oauth2/token |"Basic *{base64}*"|

How to obtain the Base64 value:

1. Concatenate "ClientId" and "ClientSecret" (`ClientId:ClientSecret`). 
2. Code the result in base64.
3. Send a request to the authorization server with the alphanumeric code you just created.

> To request your "ClientID" and "ClientSecret", please contact our [Support](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}:
* MerchantId;
* Describe that you need the credentials "ClientID" e o "ClientSecret" to use Silent Order Post.

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

``` shell
--request POST "https://authsandbox.braspag.com.br/oauth2/token"
--header "Authorization: Basic {base64}"
--header "Content-Type: application/x-www-form-urlencoded" 
--data-binary "grant_type=client_credentials"
```

|Parameters|Format|Where to send|
|---|---|---|
|`Authorization`|"Basic *{base64}*"|Header.|
|`Content-Type`|"application/x-www-form-urlencoded"|Header.|
|`grant_type`|"client_credentials"|Body.|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

```shell
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

|Properties|Description|
|---|---|
|`access_token`|The requested authentication token, that will be used in the next step.|
|`token_type`|Indicates the token type value.|
|`expires_in`|Access Token expiration, in seconds. When the token expires, you must request a new one.|

## 2. Getting the SOP AccessToken**

After obtaining AccessToken OAuth2, you should send a new request (POST) to the following URL:

| Environment | base URL + endpoint|
| --- | --- |
| Sandbox | https://transactionsandbox.pagador.com.br/post/api/public/v2/accesstoken|
| Production | https://transaction.pagador.com.br/post/api/public/v2/accesstoken|

### Request

```shell
--request POST "https://transactionsandbox.pagador.com.br/post/api/public/v2/accesstoken"
--header "Content-Type: application/json"
--header "MerchantId: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
--header "Authorization: Bearer faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw"
--data-binary
--verbose
```

|Properties|Description|Type|Size|Required?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Merchant identifier at Pagador.|GUID |36 |Yes|
|`Authorization`|Bearer [AccessToken OAuth2]|Text |36 |Yes|

### Response

As a response, you will receive a JSON ("HTTP 201 Created") with the SOP AccessToken and some other data. 

```json
{
    "MerchantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2021-05-05T08:50:04",
    "ExpiresIn": "2021-05-05T09:10:04"
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2021-05-05T08:50:04",
    "ExpiresIn": "2021-05-05T09:10:04"
}
```

|Properties|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`MerchantId`|Merchant identifier at Pagador. |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`AccessToken`|AccessToken SOP. For safety reasons, this token will allow the merchant to save only one card within the deadline determined in the response, through the attribute *Expires In*. The default is 20 minutes. Whatever happens first will invalidate the token to prevent it from being used again.|Texto|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Token creation date and hour. |Texto|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Token expiration date and hour. |Texto|--|AAAA-MM-DDTHH:MM:SS|

<aside class="warning">To see the legacy authentication process, which used the MerchantId and shopper IP address to create the `AccessToken`, [click here](https://braspag.github.io//en/manual/silentorderpost#legacy-authentication){:target="_blank"}.</aside>

## 3. Implementing the script

### Mapping Classes

The establishment must download the script provided by Braspag, and attach it to their checkout page. This script will allow Braspag to process all card information without merchant intervention. The download can be done from the following URL:

<aside class="notice">https://www.pagador.com.br/post/scripts/silentorderpost-1.0.min.js</aside>

The establishment shall parameterize the form elements with the following classes:

|Property|Class Name|
|-----------|---------|
|Credit/Debit Cardholder Name|**bp-sop-cardholdername**|
|Credit/Debit Card Number|**bp-sop-cardnumber**|
|Credit/Debit Card Expiration Date|**bp-sop-cardexpirationdate**|
|Credit/Debit Card Security Code|**bp-sop-cardcvvc**|

### Setting Parameters

**SCRIPT PARAMETERS**

|Property|Description|
|-----------|---------|
|`accessToken`|Access Token obtained via Braspag Authentication API|
|`environment`|**sandbox** or **production**|
|`language`|**PT** or **EN** or **ES**|
|`enableBinQuery`|**true** if you want to enable BIN Query (returns card characteristics). **false** otherwise.|
|`enableVerifyCard`|**true** if you want to enable ZeroAuth (returns if the card is valid or not). **false** otherwise.|
|`enableTokenize`| **true** if you want to save the card directly on your vault in the Cartão Protegido (retorn a 'cardToken' instead of a 'paymentToken'). **false** otherwise.|
|`cvvRequired`| "false" (unables CVV as required) / "true" (CVV is required). |

**SCRIPT RESPONSE**

|Property|Description|
|-----------|---------|
|`PaymentToken`|Payment Token in the Format of a GUID (36)|
|`CardToken`| Permanent token to be used on a payment request on a GUID format (36) Obs.: Only works if 'enableTokenize' is **true**|
|`brand`|Returned when enableBinQuery option is **true**. Card Brand Name (Visa, Master, Bond, Amex, Diners, JCB, Hipercard)|
|`forerignCard`|Returned when enableBinQuery option is **true**. The field returns **true** if it is a card issued outside Brazil. **false** otherwise|
|`binQueryReturnCode`|Returned when enableBinQuery option is **true**. "00" if BIN parsing is successful.|
|`binQueryReturnMessage`|Returned when enableBinQuery option is **true**. E.g. “Authorized Transaction” if BIN analysis succeeds|
|`VerifyCardStatus`|Returned when enableVerifyCard option is **true**. Invalid Card 0; 1-Valid Card; 99-Unknown Situation|
|`VerifyCardReturnCode`|Returned when enableVerifyCard option is **true**. Zero Auth query code returned by the provider.|
|`BinQueryReturnMessage`|Returned when enableBinQuery option is **true**. This is the same code returned by the provider during a standard authorization. E.g.: Cielo30 provider code "00" means validation success|
|`BinQueryReturnMessage`|Returned when enableBinQuery option is **true**. E.g. “Authorized Transaction”|
|`CardBin`|Returned when enableBinQuery option is **true**. E.g. “455187”|
|`CardLast4Digits`|Returned when enableBinQuery option is **true**. E.g. “0181”|
|`Issuer`| Returns the card issuer. |Returned when *enableBinQuery* is "true". Available for Cielo 3.0 only. |
|`IssuerCode`| Returns the card issuer code. |Returned when *enableBinQuery* is "true". Available for Cielo 3.0 only. |
|`CardType`| Returns the card type, E.g.: Credit, Debit, Multiple, Voucher etc. |Returned when *enableBinQuery* is "true". Available for Cielo 3.0 only. |
|`VerifyCardReturnCode`| It is the same code returned by the provider during a standard authorization. E.g.: code "00" for provider Cielo30 means succesful validation. |Returned when *enableBinQuery* is "true". Available for Cielo 3.0 only.  |
|`VerifyCardReturnMessage`| E.g.: “Transacao Autorizada”/"Authorized Transaction". |Returned when *enableBinQuery* is "true". Available for Cielo 3.0 only.  |
|`VerifyCardStatus`| "0"- Invalid Card; "1"- Valid Card; "99"- Unknown Situation. |Returned when *enableBinQuery* is "true".|

### Implementing Events

The script provided by Braspag provides three events for handling and managed by the merchant.

|Event|Description|
|-----------|---------|
|**onSuccess**|Event on success. PaymentToken will be returned, as well as card details if you have requested to verify the card. For security reasons this PaymentToken may only be used for authorization. After processing it will be invalidated.|
|**onError**|Event on error. Error code and description will be returned|
|**onInvalid**|Event in case of incorrect data supply. Error field details will be returned. Messages returned in the validation result are available in the following languages: Portuguese (default), English and Spanish.|

<aside class="notice">For security reasons this PaymentToken may only be used for authorization. After processing it will be invalidated.</aside>

### Example

Example of a parameterization on the checkout page:

To download the code, click [here](https://github.com/Braspag/braspag.github.io/blob/docs/_i18n/pt/_posts/silent-order-post-example.html){:target="_blank"}

![Checkout Page]({{ site.baseurl_root }}/images/consulta-bin.jpg)

## 4. Authorizing with PaymentToken

After obtaining PaymentToken through the script, the authorization process is performed by sending PaymentToken in place of card data.

See example below, describing the submission of authentication data from the Pagador API authorization request.
For more details on implementation, please visit: [Pagador API](https://braspag.github.io//manual/braspag-pagador){:target="_blank"}:

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales</span></aside>

### Request

```json
{
   "MerchantOrderId":"2017051002",
   "Customer":
   {
     (...)
   },
   "Payment":
   {
     (...)
     "Card":{
         "PaymentToken":"eedcb896-40e1-465b-b34c-6d1119dbb6cf"
     }
   }
}
```

```shell
curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--header "MerchantKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--data-binary
--verbose
{
   "MerchantOrderId":"2017051002",
   "Customer":
   {
     (...)
   },
   "Payment":
   {
     (...)
     "Card":{
         "PaymentToken":"eedcb896-40e1-465b-b34c-6d1119dbb6cf"
     }
   }
}
```

|Field|Description|Type|Size|Required|
|---|---|---|---|---|
|`Payment.Card.PaymentToken`|Provide the PaymentToken generated through the script. This information replaces the card data|GUID|36|Yes|

### Response

See https://braspag.github.io/manual/braspag-pagador{:target="_blank"}

# ANNEX

## Legacy Authentication

### Getting AccessToken**

When the shopper accesses the checkout, the merchant must generate AccessToken from the Braspag Authentication API (oAuth). On success, the API will return an AccessToken that must be populated in the script to load on the page.

To request AccessToken, the establishment must POST to the following endpoint in the server-to-server template:

| Endpoint | Environment |
| --- | --- |
| https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid={mid} | Sandbox |
| https://transaction.pagador.com.br/post/api/public/v1/accesstoken?merchantid={mid} | Production |

In place of **{mid}** you must fill in the MerchantID of your store in Braspag's Pagador platform.

Example: https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000

#### Request

<aside class="request"><span class="method post">POST</span><span class="endpoint">/v1/accesstoken?merchantid={mid}</span></aside>

```shell
curl
--request POST "https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000"
--header "Content-Type: application/json"
--data-binary
--verbose
```

|Property|Description|Type|Size|Required|
|-----------|---------|----|-------|-----------|
|`mid`|Payer Store Identifier|GUID|36|Yes|

#### Response

In response, the establishment will receive a json (HTTP 201 Created) containing among other information the ticket (AccessToken)

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantId": "B898E624-EF0F-455C-9509-3FAE12FB1F81",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2019-12-09T17:47:14",
    "ExpiresIn": "2019-12-09T18:07:14"
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`MerchantId`|Pagador Store Identifier|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`AccessToken`|Access Token. For security reasons, this ticket will give the merchant permission to save only 1 card within the time limit stipulated in the response via the ExpiresIn attribute (by default 20 minutes). Whatever happens first will invalidate this same ticket for future use.|Text|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Date and time of generation|Text|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Expiration Date and Time|Text|-|YYYY-MM-DDTHH:MM:SS|

<aside class="notice">For security reasons, registration of a valid IP of the establishment in Braspag will be required. Otherwise the request will not be authorized (HTTP 401 NotAuthorized). Please identify which will be the outgoing IP that will access the API and then request the registration through the Braspag service channel: https://suporte.braspag.com.br/hc/en{:target="_blank"}</aside>
