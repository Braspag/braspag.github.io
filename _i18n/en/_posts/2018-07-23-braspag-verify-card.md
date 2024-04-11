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

**VerifyCard** comprises two services: **Zero Auth** and **BIN Query**.

![VerifyCard]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/verifycard-en.png)
 
**Zero Auth** is a service that identifies whether a card is valid or not, through an operation similar to an authorization, but with a value of R$0.00.

Zero Auth simulates an authorization without affecting the credit limit or alerting the cardholder to the test.

![Fluxo ZeroAuth]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/zeroauth-en.png)

> **Notice**: Zero Auth transactions are subject to the rules established in Card Brands Retry Program. Fees may be charged due to excessive attempts. Please refer to [Card Brands Retry Program](https://developercielo.github.io/en/tutorial/programa-retentativa-bandeiras){:target="_blank"} for details.

BIN Query is a service available exclusively to Cielo customers that returns card information based on the BIN (first six digits of the card):

![Consulta BIN]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/consultabin.png)

* **Card brand**: name of the brand;
* **Type of card**: credit, debit or multiple (credit and debit);
* **Card nationality**: international or national;
* **Corporate card**: if the card is corporate or not;
* **Issuing bank**: code and name of the issuer;
* **Prepaid card**: whether the card is prepaid or not.

<aside class="warning">To enable Zero Auth and Bin Query, contact Cielo's support team.</aside>

## Benefits of VerifyCard

VerifyCard's responses on expiration and card information allows your store to create customizations in your application and/or checkout. See usage examples:

* **Request authorization only if the card is valid**: you can create a condition in your application to only send the authorization request if you get a successful response from ZeroAuth;

<aside class="notice"> To enable this flow, contact our support team.</aside>

* **Request tokenization only if the card is valid**: you can create a condition in your application to only request the tokenization of a card if it is valid. Learn more in the topic Using VerifyCard with Cartão Protegido;
* **Avoid errors related to the type of card or brand**: if your checkout requires manual selection of the brand or card type, you develop an alert message for when, for example, the person is using a debit card when they really should be using a credit;
* **Offer cart recovery**: you can develop a flow at your checkout so that, if the card entered is multiple (credit and debit), your store can retain the card data and, if the credit transaction fails, automatically offer the consumer a debit transaction with the same card;
* **Alert about international or prepaid cards**: if your store does not want to receive international payments or prepaid cards, for example, you can configure your checkout to inform the consumer that the store does not accept the card informed.

## Using VerifyCard with Cartão Protegido

VerifyCard can be used in conjunction with the card tokenization service (Cartão Protegido).

In this case, the VerifyCard API first receives the Zero Auth service request and validates it with the acquirer, which responds whether the card is valid or not. The VerifyCard API then sends this return to the store, which can choose whether or not to request tokenization of the card to the Protected Card API.

See below the representation of this **transactional flow**, using **VerifyCard** in conjunction with **Cartão Protegido**:

![VerifyCard com Cartão Protegido]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans3b-en.png)

## VerifyCard in sandbox

### Zero Auth programmed responses

It is possible to test the VerifyCard (Zero Auth) returns in a sandbox environment using the "Simulado" provider. For this, you can use the test cards in the table below to simulate the scenarios of authorized, unauthorized and operation failure.

| Card number | Status | Returns | Message |
|---|---|---|---|
| 4929751832037988 | 0 | 70 | Not authorized |
| 4485845528427499 | 99 | BP900 | Operation failure |
| 4556839012717881 | 1 | 4 | Authorized |

### Programmed Responses BIN Query

In the simulation of the BIN Query in a sandbox environment, each of the first six digits will return a simulated result. It is possible to set up a test card numbering and observe the expected return according to different scenarios.

|   Digit  | Meaning                             | Returns |
|-----------|------------------------------------------|---------|
| 1st digit | Brand.                       | If it's '**3**', it returns "**AMEX**"<br>If it's '**5**', it returns "**MASTERCARD**"<br>If it's '**6**', it returns "**DISCOVER**"<br>Any other number returns "**VISA**".|
|2nd digit|Card type.                 | If it's '**3**', it returns "**Debit**"<br>If it's '**5**', it returns "**Credit**"<br>If it's '**7**', it returns "**Credit**" and returns the `Prepaid` field as "**true**"<br>Any other number returns "**Multiple**".|
| 3rd digit | Card nationality.        | If '**1**' returns "**true**" (domestic card)<br>Any number other than '**1**' returns "**false**" (international card).|
| 4th digit | Whether the card is corporate or not. | If it's '**1**', it returns "**true**" (it's a corporate card)<br>Any number other than '**1**' returns "**false**" (it's not a corporate card).|
| 5th digit | Analysis return.             | If it is '**2**' it returns "**01 - Flag not supported**"<br>If it is '**3**' it returns "**02 - Voucher - Not supported in the bin query**" <br>Any other number returns "**00 - Analysis authorized**"|
| 6th digit | Issuer bank.                  | If it's '**1**', it returns "**104**" and "**Cashier**"<br>If it's '**2**', it returns "**001**" and "**Bank do Brasil**"<br>Any other number returns "**237**" and "**Bradesco**"|

# Environments

|Environment|Transactional URL Basis|
|---|---|
|Sandbox|https://apisandbox.braspag.com.br/|
|Production|https://api.braspag.com.br/|

# Integrating

To query a card, send a request using the HTTP POST verb to the VerifyCard service, following the examples in this manual. The VerifyCard query can be done by card number or token.

In the request to VerifyCard, you will send the `Provider` together with the card data (number or tokenized card).

In the response, the ZeroAuth check will be displayed on the `Status`, `ProviderReturnCode` and `ProviderReturnMessage` properties. O retorno da Consulta BIN estará nas propriedades do nó `BinData`.

# VerifyCard by card number

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
   "Provider":"Cielo30",
   "Card":
   {
       "CardNumber": "999999******9999",
       "Holder": "Joao da Silva",
       "ExpirationDate": "03/2026",
       "SecurityCode": "***",
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
   "Card" :
   {
       "CardNumber": "999999******9999",
       "Holder": "Joao da Silva",
       "ExpirationDate": "03/2026",
       "SecurityCode": "***",
       "Brand": "Visa",
       "Type": "CreditCard"
   }
}
```

|Property|Description|Type|Size|Required|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Braspag store identifier.|Guid|36|Yes|
|`MerchantKey`|Public key for double authentication on Braspag.|Text|40|Yes|
|`Payment.Provider`|Name of the payment method provider.|Text|15|Yes
|`Card.CardNumber`|Shopper's card number for Zero Auth and BIN Query. If it is just a BIN Query request, send only the BIN (6 or 9 digits).|Text|16|Yes|
|`Card.Holder`|Shopper's name printed on card.|Text|25|Yes|
|`Card.ExpirationDate`|Expiration date printed on the card, in MM/YYYY format.|Text|7|Yes|
|`Card.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes (No, if authorized by the purchaser)|
|`Card.Brand`|Card brand.|Text|10|No|
|`Card.Type`|Type of card to be consulted ("CreditCard" / "DebitCard"). This field is particularly important due to cards with multiple functions.|Text|10|Yes|

## Response

```json
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
        "Issuer": "Banco da Praça",
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
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
        "Issuer": "Banco da Praça",
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
    }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`Status`|Zero Auth Status.|Number|1 |"0" - Zero Auth query failed<br/>"1" - Zero Auth query was successful<br/>"99" - Query was successful, but the card status is inconclusive|
|`ProviderReturnCode`|Zero Auth query code returned by the provider.|Number|2|This is the same code returned by the provider during a standard authorization. Ex.: "82" - invalid card (for Cielo30 provider)|
|`ProviderReturnMessage`|Zero Auth query message returned by provider.|Text|512 |Eg.: "Transacao Autorizada" (Authorized Transaction)|
|`BinData.Provider`|Service provider.|Text|15 |Eg.: "Cielo30"|
|`BinData.CardType`|Card type returned from the BIN Query.|Text|15 |Eg.: "Crédito" / "Débito" / "Múltiplo" (Credit / Debit / Multiple)|
|`BinData.ForeignCard`|Indicates whether it is a card issued outside Brazil.|Boolean|--- |Eg.: true/false |
|`BinData.Code`|BIN Query return code.|Number|2 |Ex.: "00" - successful query (for Cielo30 provider)|
|`BinData.Message`|BIN Query return message.|Text|512 |Ex.: "Analise autorizada" (Analysis authorized) - query performed successfully (for Cielo30 provider)  |
|`BinData.CorporateCard`|Indicates whether the card is corporate.|Boolean|--- |Eg.: true/false|
|`BinData.Issuer`|Card issuer name.|Text|512 |Eg.: "Banco da Praça" (subject to mapping by the acquirer)|
|`BinData.IssuerCode`|Card issuer code.|Number|3 |Eg.: "000" (subject to acquirer mapping)|
|`BinData.CardBin`|The first six digits of the card.|Number|6 |Eg.: "999999"|
|`BinData.CardLast4Digits`|Last 4 digits of the card number.|Number|4 |Eg.: "9999"|
|`BinData.Prepaid`|Indicates whether the card is prepaid or not|Boolean|---|Eg.: "000" (subject to acquirer mapping)|

# VerifyCard by card token

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
    "Provider": "Cielo30",
    "Card": {
        "CardToken": "af1ffa95-e4a6-4ed9-9270-a9cb4c586c4a",
        "SecurityCode": "939",
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
   "Card" :
   {
       "CardToken": "af1ffa95-e4a6-4ed9-9270-a9cb4c586c4a",
        "SecurityCode": "939",
        "Brand": "Visa",
        "Type": "CreditCard"
   }
}
```

|Property|Description|Type|Size|Required|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Braspag store identifier.|Guid|36|Yes|
|`MerchantKey`|Public key for double authentication on Braspag.|Text|40|Yes|
|`Payment.Provider`|Name of the payment method provider.|Text|15|Yes|
|`Card.CardToken`|Token on the *Cartão Protegido* that represents card data.|Text|16|Yes|
|`Card.SecurityCode`|Security code printed on the back of the card.|Text|4|Yes|
|`Card.Brand`|Card brand.|Text|10|Yes |
|`Card.Type`|Type of card to be queried ("CreditCard"/"DebitCard"). This field is particularly important due to cards with multiple functions.|Text|10|Yes|

## Response

```json
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
        "Issuer": "Banco da Praça",
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
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
        "Issuer": "Banco da Praça",
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
    }
}
```

|Property|Description|Type|Size|Format|
|-----------|---------|----|-------|-------|
|`Status`|Zero Auth Status.|Number|1 |"0" - Zero Auth query failed<br/>"1" - Zero Auth query was successful<br/>"99" - Query was successful, but the card status is inconclusive|
|`ProviderReturnCode`|Zero Auth query code returned by the provider.|Number|2|This is the same code returned by the provider during a standard authorization. Ex.: "82" - invalid card (for Cielo30 provider)|
|`ProviderReturnMessage`|Zero Auth query message returned by provider.|Text|512 |Eg.: "Transacao Autorizada" (Authorized Transaction)|
|`BinData.Provider`|Service provider.|Text|15 |Eg.: "Cielo30"|
|`BinData.CardType`|Card type returned from the BIN Query.|Text|15 |Eg.: "Crédito" / "Débito" / "Múltiplo" (Credit / Debit / Multiple)|
|`BinData.ForeignCard`|Indicates whether it is a card issued outside Brazil.|Boolean|--- |Eg.: true/false |
|`BinData.Code`|BIN Query return code.|Number|2 |Ex.: "00" - successful query (for Cielo30 provider)|
|`BinData.Message`|BIN Query return message.|Text|512 |Ex.: "Analise autorizada" (Analysis authorized) - query performed successfully (for Cielo30 provider)  |
|`BinData.CorporateCard`|Indicates whether the card is corporate.|Boolean|--- |Eg.: true/false|
|`BinData.Issuer`|Card issuer name.|Text|512 |Eg.: "Banco da Praça" (subject to mapping by the acquirer)|
|`BinData.IssuerCode`|Card issuer code.|Number|3 |Eg.: "000" (subject to acquirer mapping)|
|`BinData.CardBin`|The first six digits of the card.|Number|6 |Eg.: "999999"|
|`BinData.CardLast4Digits`|Last 4 digits of the card number.|Number|4 |Eg.: "9999"|
|`BinData.Prepaid`|Indicates whether the card is prepaid or not|Boolean|---|Eg.: "000" (subject to acquirer mapping)|
