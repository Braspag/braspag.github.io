---
layout: manual
title: Google Pay E-Wallet
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
sort_order: 4
tags:
  - 1. Pagador
language_tabs:
  json: JSON
---

# Google Pay

Google Pay is an e-wallet. It allows shoppers to make payments in e-commerce stores and apps using their credit and debit cards stored in their Google Account and Android devices in a safe and easy way.

# Requirements

1. Agree to Google’s terms of service
2. Integrate Google Pay into your app ([https://developers.google.com/pay/api/android/overview](https://developers.google.com/pay/api/android/overview))
3. Contrat the Braspag's payment gateway service (API REST)
4. Contrat the Cielo 3.0 as payment acquier
5. Integrate Braspag's payment gateway Pagador API REST ([https://braspag.github.io/manual/braspag-pagador](https://braspag.github.io/manual/braspag-pagador))

# Step 1: Integrating Google Pay into you Android app

## Action 1 - Configure your project

[https://developers.google.com/pay/api/android/guides/setup](https://developers.google.com/pay/api/android/guides/setup)

In these steps, the following points should be observed:

- Project Configuration
- Modify your _Manifest_

## Action 2 - Google Pay Implementation

To integrate Google Play into your app, follow all the steps in the Google Pay documentation:

[https://developers.google.com/pay/api/android/guides/tutorial](https://developers.google.com/pay/api/android/guides/tutorial)

For the correct integration of Google Play using Braspag's payment gateway, it is necessary to observe the following points:

### Gateway Definition

In the "_Step 2: Choose a payment tokenization method_", follow the "GATEWAY" integration model and send the "type" as " **PAYMENT\_GATEWAY**" and " **gateway**" as " **cielo**", according to the example:

```json
private static JSONObject getTokenizationSpecification() {
  JSONObject tokenizationSpecification = new JSONObject();
  tokenizationSpecification.put("type", "PAYMENT\_GATEWAY");
  tokenizationSpecification.put(
      "parameters",
      new JSONObject()
          .put("gateway", "cielo")
          .put("gatewayMerchantId", "exampleMerchantId"));
  return tokenizationSpecification;
}
```

To the field " **gatewayMerchantId**", send your application code registered at Google Pay. To test purpose, use "18045945416119260263"

### Definition of brands

In the "_Step 3: Define supported payment card networks_", use these brands: "VISA", "MASTERCARD", "AMEX", "DISCOVER" E "JCB"

### Definition of environment

In the "_Step 5: Create a PaymentsClient instance_", use the vaue "WalletConstants.ENVIRONMENT\_TEST" for test purpose.

### Definition of shopping data

In the "_Step 7: Create a PaymentDataRequest object_", use the value "BRL" for " **currencyCode**". The field " **merchantName**" is the name that shopper will see during Google Pay payment process, then, the recomendation is the use of friendly name.

### Payment Data Recovery

In the "_Step 9: Handle the response object_", the "Activity.RESULT\_OK" event is described, which is returned a object with all the payment data, including payment tokens.

The _PaymentData_ contains the object _PaymentMethodToken_. To get this object, use the **getPaymentMethodToken()** method.

(to see more details: [https://developers.google.com/android/reference/com/google/android/gms/wallet/PaymentData](https://developers.google.com/android/reference/com/google/android/gms/wallet/PaymentData))

After getting the PaymentMethodToken, you shold get the _string_ that contains the payment tokens. To get the string, use the **GetToken()** method from _PaymentMethodToken_ object.

(to see more details: [https://developers.google.com/android/reference/com/google/android/gms/wallet/PaymentMethodToken](https://developers.google.com/android/reference/com/google/android/gms/wallet/PaymentMethodToken))

The string obtained will be similar as follows:

```json
{
  "protocolVersion": "ECv1",
  "signature": "TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
  "signedMessage": "{\"encryptedMessage\":
  \"ZW5jcnlwdGVkTWVzc2FnZQ==\",\"ephemeralPublicKey\":
  \"ZXBoZW1lcmFsUHVibGljS2V5\",\"tag\": \"c2lnbmF0dXJl\"}"
}
```

| **Parâmetro** | **Type** | **Descrição** |
| --- | --- | --- |
| encryptedMessage | string | Base64-encoded encrypted message containing payment information and some additional security fields. |
| ephemeralPublicKey | string | Base64-encoded ephemeral public key associated with the private key to encrypt the message in uncompressed point format. |

(to see more details: [https://developers.google.com/pay/api/android/guides/resources/payment-data-cryptography](https://developers.google.com/pay/api/android/guides/resources/payment-data-cryptography))

Keep the values "_encryptedMessage_" and "_ephemeralPublicKey_". They will be requested in the Braspag's authorization process in the next step (Step 2: Authorization with Google Pay)

# Step 2: Authorization with Google Pay

The authorization with the Google Pay token must be performed as the same way as a standard authorization for a credit card, but providing token in place of the open card data, as following example:

## Request

```json
{
  "MerchantOrderId": "2014111708",
  "Customer": {
    (…)
  },
  "Payment": {
    "Type": "CreditCard",
    "Amount": 100,
    "Provider": "Cielo30",
    "Installments": 1,
    "Wallet": {
      "Type": "AndroidPay",
      "WalletKey": "ZW5jcnlwdGVkTWVzc2FnZQ==",
      "AdditionalData": {
        "EphemeralPublicKey": "ZXBoZW1lcmFsUHVibGljS2V5"
      }
    }
  }
}
```

| **Parâmetro** | **Type** | **Descrição** |
| --- | --- | --- |
| MerchantOrderId | String (50) | Order identification number |
| Customer | Node with shopper data| See [https://braspag.github.io/manual/braspag-pagador?json#criando-uma-transa%C3%A7%C3%A3o-com-dados-do-comprador](https://braspag.github.io/manual/braspag-pagador?json#criando-uma-transa%C3%A7%C3%A3o-com-dados-do-comprador)   |
| Payment.Type | String (100) | Payment method type. Possible values: "CreditCard" ou "DebitCard" |
| Payment.Amount | Número (15) | Transaction amount in cents |
| Payment.Provider | String (15) | Payment method provider name. For Google Pay, use "Cielo30" |
| Payment.Installments | Número (2) | Number of installments |
| Payment.Wallet.Type | String (15) | Wallet provider name. For Google Pay, use "AndroidPay" |
| Payment.Wallet.WalletKey | String | Provide the "encryptedMessage" received from Google Pay |
| Payment.Wallet.AdditionalData. EphemeralPublicKey | String | Provide the "ephemeralPublicKey" received from Google Pay |

For more information: [https://braspag.github.io/manual/braspag-pagador](https://braspag.github.io/manual/braspag-pagador)

## Response

Vide [https://braspag.github.io/manual/braspag-pagador?json#resposta](https://braspag.github.io/manual/braspag-pagador?json#resposta)
