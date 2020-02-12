---
layout: manual
title: Verify Card Integration Guide
description: Gateway Braspag technical integration
search: true
translated: true
categories: manual
tags:
  - Pagador
language_tabs:
  json: JSON
  shell: cURL
  html: HTML
---

# Querying Card Data via Zero Auth and BIN Query

To query data from a card, you need to make a POST on the VerifyCard service. VerifyCard consists of two services: Zero Auth and Consulta BIN . Zero Auth is a service that identifies whether a card is valid or not, through an operation similar to an authorization, but with a value of $ 0.00. Consulta BIN is a service available to Cielo 3.0 customers that returns BIN features such as brand and card type from BIN (first 6 digits of card). Both services can be consumed simultaneously through VerifyCard, as shown below. It is also possible that the authorization process will be automatically conditioned to a successful return of ZeroAuth. To enable this flow, please contact our support team.

## Request

<aside class="request"><span class="method get">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
   "Provider":"Cielo30",
   "Card" :
   {
       "CardNumber": "999999 ****** 9999",
       "Holder":"Joao da Silva",
       "ExpirationDate":"03/2026",
       "SecurityCode": "***"
       "Brand":"Visa",
       "Type":"CreditCard"
   }
}
```

```shell
curl
--request GET "https://apisandbox.braspag.com.br/v2/verifycard"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
{
   "Provider":"Cielo30",
   "Card" :
   {
       "CardNumber": "999999 ****** 9999",
       "Holder":"Joao da Silva",
       "ExpirationDate":"03/2026",
       "SecurityCode":"***",
       "Brand":"Visa",
       "Type":"CreditCard"
   }
}
```

|Property|Type|Size|Mandatory|Description|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Guid|36|Yes|Store identifier at Braspag|
|`MerchantKey`|Text|40|Yes|Public Key for Dual Authentication at Braspag|
|`Payment.Provider`|Text|15|Yes|Name of Payment Method's Provider|
|`Card.CardNumber`|Text|16|Yes|Shopper's Card Number for Zero Auth and Consulta BIN. If it is a Consulta BIN request only, send only the BIN|
|`Card.Holder`|Text|25|Yes|Shopper's Name Printed on Card|
|`Card.ExpirationDate`|Text|7|Yes|Expiration date printed on card in MM/YYYY format|
|`Card.SecurityCode`|Number|4|Yes|Security code printed on back of card|
|`Card.Brand`|Text|10|Yes|Card Brand|
|`Card.Type`|Text|CreditCard or DebitCard|Yes|Type of card to be consulted. This field is particularly important due to multi-function cards.|

## Response

```json
{
    "Status": 1,
    "ProviderReturnCode": "00",
    "ProviderReturnMessage": "Authorized Transaction",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada",
        "CorporateCard": false,
        "Issuer": "Bank Name",
        "IssuerCode": "001"
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "Status": 1,
    "ProviderReturnCode": "00",
    "ProviderReturnMessage": "Transacao autorizada",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada",
        "CorporateCard": false,
        "Issuer": "Bank Name",
        "IssuerCode": "000"
    }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`Status`|Zero Auth Status|Number|1|<ul><li>0-Zero Auth query failed</li><li>1-Query Zero Auth successfully;</li><li>99-Successful consultation, but card status is inconclusive</li></ul>|
|`ProviderReturnCode`|Zero Auth query code returned by the provider. This is the same code returned by the provider during a standard authorization. E.g.: Cielo30 Provider Code 82-Invalid Card|
|`ProviderReturnMessage`|Query message Zero Auth returned by the provider.|Text|512|E.g.: “Authorized Transaction”|
|`BinData.Provider`|Service Provider|Text|15|Ex. Cielo30|
|`BinData.CardType`|Card Type returned from Consulta BIN|Text|15|E.g.: Credit, Debit or Multiple|
|`BinData.ForeignCard`|Indicates if it is a card issued outside Brazil|boolean|-|Ex. true or false|
|`BinData.Code`|BIN Query Return Code|Number|2|Ex. For provider Cielo30, 00 means successful consultation|
|`BinData.Message`|BIN Query Return Message|Text|512|E.g.: For Cielo30 provider, "Analise autorizada" means successful consultation.|
|`BinData.CorporateCard`|Indicates whether the card is corporate|boolean|-|Ex. true or false|
|`BinData.Issuer`|Name of card issuer|Text|512|Ex. "Bank Name" (Subject to acquirer's mapping)|
|`BinData.IssuerCode`|Card issuer code|Number|3|Ex. 000 (Subject to acquirer mapping)|
