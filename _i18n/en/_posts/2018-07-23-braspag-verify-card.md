---
layout: manual
title: VerifyCard Integration Guide 
description: VerifyCard Technical Integration
search: true
translated: true
categories: manual
sort_order: 3
tags:
  - 1. Pagador
language_tabs:
  json: JSON
  shell: cURL
  
---

# VerifyCard

**VerifyCard** is composed of two services: *Zero Auth* and *Consulta BIN*.

**Zero Auth** is a service that identifies whether a card is valid or not, through an operation similar to an authorization, but with a value of $ 0.00.<br/>**Consulta BIN** is a service that uses a card's BIN (first 6 digits of a card) to return features such as brand and card type. It is available to Cielo 3.0 customers.

Both services can be consumed simultaneously through VerifyCard. It is also possible to condition the authorization process to automatically follow a successful return of ZeroAuth. To enable this flow, please contact our support team.

To query data from a card, send a request through the POST HTTP verb to the VerifyCard service, as in the example:

## Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
   "Provider": "Cielo30",
   "Card" :
   {
       "CardNumber": "999999 ****** 9999",
       "Holder": "Joao da Silva",
       "ExpirationDate": "03/2026",
       "SecurityCode": "***"
       "Brand": "Visa",
       "Type": "CreditCard"
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/verifycard"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
{
   "Provider": "Cielo30",
   "Card":
   {
       "CardNumber": "999999 ****** 9999",
       "Holder": "Joao da Silva",
       "ExpirationDate": "03/2026",
       "SecurityCode": "***",
       "Brand": "Visa",
       "Type": "CreditCard"
   }
}
```

|Property|Description|Type|Size|Mandatory|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Store identifier at Braspag.|Guid|36|Yes|
|`MerchantKey`|Public key for dual authentication at Braspag.|Text|40|Yes|
|`Payment.Provider`|Name of payment method's provider.|Text|15|Yes|
|`Card.CardNumber`|Buyer's card number for Zero Auth and Consulta BIN. If it is a Consulta BIN request only, send only BIN (6 or 9 digits).|Text|16|Yes|
|`Card.Holder`|Buyer's name printed on the card.|Text|25|Yes|
|`Card.ExpirationDate`|Expiration date printed on the card in the MM/YYYY format.|Text|7|Yes|
|`Card.SecurityCode`|Security code printed on the back of the card.|Number|4|Yes|
|`Card.Brand`|Card brand.|Text|10|Yes|
|`Card.Type`|Type of card to be consulted ("CreditCard" / "DebitCard"). This field is particularly important due to multi-function cards.|Text|10|Yes|

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
|`Status`|Zero Auth status.|Number|1|"0" - Failed Zero Auth query<br/>"1" - Successful Zero Auth query<br/>"99" - Successful consultation, but card status is inconclusive|
|`ProviderReturnCode`|Zero Auth query code returned by the provider. This is the same code returned by the provider during a standard authorization. E.g.: "82" - invalid card (for the Cielo30 provider)|
|`ProviderReturnMessage`|Zero Auth query message returned by the provider.|Text|512|E.g.: “Authorized Transaction”|
|`BinData.Provider`|Service provider.|Text|15|E.g.: "Cielo30"|
|`BinData.CardType`|Card type returned from Consulta BIN.|Text|15|E.g.: "Credit" / "Debit" / "Multiple"|
|`BinData.ForeignCard`|Indicates if it is a card issued outside Brazil.|boolean|-|E.g.: "true" / "false"|
|`BinData.Code`|BIN query return code.|Number|2|E.g.: "00" - successful consultation (for the Cielo30 provider)|
|`BinData.Message`|BIN Query Return Message|Text|512|E.g.: "Analise autorizada" means successful consultation (for the Cielo30 provider)|
|`BinData.CorporateCard`|Indicates whether it is a corporate card.|boolean|-|E.g.: "true" / "false"|
|`BinData.Issuer`|Name of the card issuer.|Text|512|E.g.: "Bank Name" (subject to mapping by the acquirer)|
|`BinData.IssuerCode`|Card issuer code.|Number|3|E.g.: "000" (subject to mapping by the acquirer)|

# Programmed Responses

You are able test VerifyCard (Zero Auth) returns in sandbox environment using the provider "Simulado". Use the test cards in the table below to simulate scenarios for autorized and not authorized consultation and operation failure. 

| Card number | Status | Return | Message |
|---|---|---|---|
| 4532117080573788 | 0 | 70 | Not authorized |
| 4532117080573799 | 99 | BP900 | Operation failure |
| 4532117080573701 | 1 | 4 | Authorized |

If you want to test Consulta BIN return scenarios in sandbox, see [Cielo documentation](https://developercielo.github.io/manual/'?json#consulta-bin-sandbox).
