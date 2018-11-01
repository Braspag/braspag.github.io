---
layout: manual
title: Integration Manual Verify Card
description: Integração técnica Gateway Braspag
search: true
categories: manual
translated: true
tags:
  - Pagador
language_tabs:
  json: JSON
  shell: cURL
---

# Querying data from a card via Zero Auth and BIN Query Service

To query card data, a POST request is required on the VerifyCard service. The VerifyCard consists of two services: Zero Auth and BIN Query Service. Zero Auth is a service that identifies if a card is valid or not, through an operation similar to an authorization, but sending zero as transaction amount. The BIN Query Service is a service available for merchats that use Cielo 3.0 and it returns card BIN information such as brand and card type. Both services can be consumed simultaneously through the VerifyCard, as shown in the example below. It is also possible that the authorization process is automatically conditioned to a successful return of ZeroAuth. To enable this feature, please contact our support team.

## Request

<aside class="request"><span class="method get">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
   "Provider":"Cielo30",
   "Card" :
   {
       "CardNumber":"999999******9999",
       "Holder":"Joao da Silva",
       "ExpirationDate":"03/2026",
       "SecurityCode":"***",
       "Brand":"Visa",
       "Type":"CreditCard",
       "CardToken":""
   }
}
```

```shell
curl
--request GET "https://apihomolog.braspag.com.br/v2/verifycard"
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
       "CardNumber":"999999******9999",
       "Holder":"Joao da Silva",
       "ExpirationDate":"03/2026",
       "SecurityCode":"***",
       "Brand":"Visa",
       "Type":"CreditCard",
       "CardToken":""
   }
}
```

|Property|Type|Size|Mandatory|Description|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Guid|36|Yes|Merchant ID|
|`MerchantKey`|Text|40|Yes|Merchant Key|
|`RequestId`|Guid|36|No|Request Identifier defined by merchant, applicable to any operation GET/POST/PUT|
|`Payment.Provider`|Text|15|Yes|Payment Method Provider’s name|
|`Card.CardNumber`|Text|16|Yes|Credit Card number. In case of doing just BIN Query Service, put the first six digits of card (BIN)|
|`Card.Holder`|Text|25|Yes|Cardholder name|
|`Card.ExpirationDate`|Text|7|Yes|Expiration Date (MM/YYYY)|
|`Card.SecurityCode`|Text|4|Yes|Security Code (CVV2)|
|`Card.Brand`|Text|10|Yes |Card’s Brand|
|`Card.Type`|Text|CreditCard ou DebitCard|Yes|Identify the cart type to be queried. This information is relevant for multiple function card.|
|`Card.CardToken`|Guid|36|No|Card Token that represents the card information.|

## Response

```json
{
    "Status": 1,
    "ProviderReturnCode": "85",
    "ProviderReturnMessage": "Transacao autorizada",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada"
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "Status": 1,
    "ProviderReturnCode": "85",
    "ProviderReturnMessage": "Transacao autorizada",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada"
    }
}
```

|Property|Description|Type|Size|Format|
|---|---|---|---|---|
|`Status`|Zero Auth status|Number|1 |<UL><LI>0-Failed Zero Auth response;&nbsp;</LI><LI>1-Success Zero Auth response;&nbsp;</LI><LI>99-The query was succeeded but the card status is inconclusive;</LI></UL> |
|`ProviderReturnCode`|Zero Auth query response code returned by the provider. |Number|2|The same code returned by the provider upon authorization. Ex: provider Cielo30 code 82-cartão invalido|
|`ProviderReturnMessage`|Zero Auth query response message returned by the provider. |Text|512 |Ex. "Transacao Autorizada"|
|`BinData.Provider`|Service provider|Text|15 |Ex. Cielo30|
|`BinData.CardType`|Card Type|Text|15 |Ex. Crédito, Débito, Múltiplo|
|`BinData.ForeignCard`|Identify if the card was issues in Brazil or not|booleano|- |Ex. true ou false |
|`BinData.Code`|BIN query service return code|Number|2 |Ex. For provider Cielo30, 00 means that the query was succeeded  |
|`BinData.Message`|query service return message|Text|512 |Ex. For provider Cielo30, "Analise autorizada" means that the query was succeeded. |
