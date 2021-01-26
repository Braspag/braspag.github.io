---
layout: manual
title: Apple Pay E-Wallet
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

# Apple Pay ™

Apple Pay is a digital wallet. It allows shoppers to make payments in e-commerce stores and apps in a safe and easy way, using credit and debit cards stored in their Apple account and devices.

# Prerequisites

In order to use Apple Pay, your store must be previously registered in the AppleID program. In addition to that, you must also:

1. Enroll your store through [this URL](https://developer.apple.com/programs/enroll/), following all steps required by Apple.
2. Follow the procedure set out in this document, in order to complete your integration with Apple.
3. Hire Pagador API REST as the payment gateway.
4. Hire Cielo 3.0 as the acquirer.
5. Integrate with [Pagador API REST](https://braspag.github.io//en/manual/braspag-pagador).

# PART 1 - Configuring the Merchant Identifier

To begin with, you must create a **merchant identifier** for your store. After that, the merchant identifier must be sent to Braspag in request for a "**.CSR**" certificate. The ".CSR" certificate created by Braspag must be used to create the new "**.CER**" certificate, in Apple. This ".CER" certificate will be used to proceed to the second step of the process.

## Step 1 - Creating a Merchant Identifier

The merchant identifier must be created through the [Apple Developer](https://developer.apple.com/account/resources) website as follows:

1. In the **"Certificates, Identifiers & Profiles"** section, select **"Identifiers"** on the side menu, and click the **"(+)"** button on the top right corner:
![Step1.1]({{ site.baseurl_root }}/images/braspag/pagador/applepay01.png)
2. Select **"Merchant IDs"**, then click **"Continue"**:
![Step1.2]({{ site.baseurl_root }}/images/braspag/pagador/applepay02.png)
3. Insert values in the **"Description"** and **"Identifier"** fields, in accordance with each specification, and click **"Continue"**:
![Step1.3]({{ site.baseurl_root }}/images/braspag/pagador/applepay03.png)
4. Click **"Register"**:
![Step1.4]({{ site.baseurl_root }}/images/braspag/pagador/applepay04.png)

## Step 2 - Applying for a ".CSR" Certificate 

To send Braspag a request for a certificate in the ".CSR" format, contact our [Support Team](https://suporte.braspag.com.br/hc/pt-br/requests/new) informing the following:

1. The **Merchant Identifier** created in step 1;
2. Your store "in production" **Merchant ID** at Braspag.

Our team will get back to you with the ".CSR" file in up to 48 working hours.

## Step 3 - Creating a ".CER" Certificate

To create a payment processing certificate (".CER") to be used in your virtual store or app, you must enter the [Apple Developer](https://developer.apple.com/account/resources)  website and follow the procedure below:

1. In the **"Certificates, Identifier & Profiles"** section, select **"Identifiers"** on the side menu.
2. Use the filter on the top right corner (**"App IDs"**), to locate the **"Merchant IDs"** item:
![Step2.1]({{ site.baseurl_root }}/images/braspag/pagador/applepay05.png)
3. On the right, select the recently created identifier:
![Step2.2]({{ site.baseurl_root }}/images/braspag/pagador/applepay06.png)
4. In the **"Apple Pay Payment Processing Certificate"** block, click the **"Create Certificate"** button right after the text short description:
![Step2.3]({{ site.baseurl_root }}/images/braspag/pagador/applepay07.png)
5. Choose "No" in **"Edit or Configure Merchant ID"**:
![Step2.4]({{ site.baseurl_root }}/images/braspag/pagador/applepay08.png)
6. In the dialog box, choose the ".CSR" certificate sent by Braspag:
![Step2.5]({{ site.baseurl_root }}/images/braspag/pagador/applepay09.png)
7. Click **"Continue"**:
![Step2.6]({{ site.baseurl_root }}/images/braspag/pagador/applepay10.png)
8. Click **"Download"** and save the ".CER" file:
![Step2.7]({{ site.baseurl_root }}/images/braspag/pagador/applepay11.png)

For more details on the process, access Apple's [Developer Account Help](https://help.apple.com/developer-account/#/devb2e62b839).

# PART 2. Integrating with Apple Pay

Most of the process when enabling the "Pay with Apple Pay" button in your app or site is performed during your wallet integration. For that reason, we recommend you to follow the instructions available in the [Apple Developer Documentation](https://developer.apple.com/documentation) website for their self-service implementation.

At the end of the process performed in the Apple API, you will receive a JSON containing two important fields that will be used in the next step: the `paymentData.data` and the `ephemeralPublicKey.header.EphemeralPublicKey` fields.

```json
{
   "applePayData": {
      "paymentData": {
         "version": "EC_v1",
         "data": "as01vRj+n9crY2vome7zc+u7Tz0+qg2La/8IUHpJIjFN6ThhUqLnSrskQHTrEbcYPiMksFK0+ddo9sZu70uJQJH1I+44N6PrVhilNDem97vOXq2VYDXiVJ27F/Q9wGQDgZBeGcZ6Pml9SIelHqUauBcQoOatrlnWPUL8kbdpT8WqgzXyaCh7oeTz=z6++rp/ofjvSjnGtOqAUsnrzvw4uzkcyKUSsfROdJ6B/Xzgu/T9fMIr5UxXD2DPF1SNh3ydEJABKz4HFjDW7ObvbQeua4GYxJdpQLpI3NgUbJy91E/LOyb/+PcCtO+0=a41tBrfnTTF9qsPuCIw8HWIEEKSRofn27NTofxev/i+nHEfqEtqNrN/epIvhzceD/gDiGetfiLKMzf94ARmpWUAMC==",
         "signature": "(…)",
         "header": {
            "ephemeralPublicKey": "MFkwEwZJKoZIzj0CAQYIKo12zj0DAQcDQgAEo+ReGClSmQ4hDJD1yh9nci3V4l7kPm2AQtKZMMvuNS0iK5sn/1A9l3kw1B1xCqOycZmnPSng7p5hpTvrei1BCA==",
            "publicKeyHash": "KXN06+BtJu6yEfF9zDhr7f4M/2HwVybnx0FGfC520gB=",
            "transactionId": "71c5b61c3791546e94d2b4893a6c69aaac2ab86b5c113c83a7d89057906a9b5f"
         }
      },
      "paymentMethod": {
         "displayName": "MasterCard 1212",
         "network": "MasterCard",
         "type": "credit"
      },
      "transactionIdentifier": "81C5B61C3791646E94D2B4893A6C69BBBC2AB86B5C363C83A7D89057906A9BAC"
   },
   "x_document": "24562608994",
   "x_name": "João da Silva"
}
```

## Important Note

<aside class="warning">During the Apple Pay implementation, there will be a reference to the ". CER" certificate, generated in PART 1, to encrypt the data while communicating with Apple. The decryption process of the data returned by Apple must not be implemented at this point as, for Braspag customers, this task will be carried out by our gateway solution, Pagador.</aside>

# PART 3. Integrating with Pagador (decryption and authorization)

Authorization with the Apple Pay token happens in the same way as standard credit card authorization. However, instead of transmitting the card data openly, you must provide the token received from Apple Pay, as shown in the example below:

### Request

```json
{
   "MerchantOrderId": "2017051002",
   "Customer": {
     (…)
   },
   "Payment": {
      "Type": "CreditCard",
      "Amount": 1000,
      "Provider": "Cielo30",
      "Installments": 1,
      "Currency": "BRL",
      "Wallet": {
         "Type": "ApplePay",
         "WalletKey":"['paymentData.data']",
         "AdditionalData": {
            "EphemeralPublicKey": "['ephemeralPublicKey.header.EphemeralPublicKey']"
         }
      }
   }
}
```

| Header Parameters |Description|Type and Size|
| --- | --- | --- |
| `MerchantId` |Store ID in Pagador.| GUID (36) | 
| `MerchantKey`| API key in Pagador.| String (24) |

|Parameter|Description|Type and Size|
| --- | --- | --- |
| `MerchantOrderId` | Order ID number. | String (50) |
| `Customer` |  Node with customer's data. |Refer to the [Pagador Guide](https://braspag.github.io//en/manual/braspag-pagador#request). |
| `Payment.Type` |Payment method type. Possibilities: "CreditCard" / "DebitCard". | String (100) | 
| `Payment.Amount` |Order amount in cents.| Number (15) | 
| `Payment.Provider` |Name of payment method provider. For Apple Pay transactions, use "Cielo30".| String (15) | 
| `Payment.Installments` | Number of installments. | Number (2) |
| `Payment.Wallet.Type` | Name of payment method provider. For Apple Pay transactions, use "ApplePay". |String (15) | 
| `Payment.Wallet.WalletKey` |Fill with the `paymentData.data` parameter value returned by Apple Pay. | String | 
| `Payment.Wallet.AdditionalData.EphemeralPublicKey` |Fill with the `ephemeralPublicKey.header.EphemeralPublicKey` parameter value returned by Apple Pay. | String | 

### Response

```json
{
    "MerchantOrderId": "2017051002",
    "Customer": {(…)
    },
    "Payment": {
        (…)
        "CreditCard": {
            (…)
        },
        (…)
        "Wallet": {
            "Type": "ApplePay",
            "WalletKey": "as01vRj+n9crY2vome7zc+u7Tz0+qg2La/8IUHpJIjFN6ThhUqLnSrskQHTrEbcYPiMksFK0+ddo9sZu70uJQJH1I+44N6PrVhilNDem97vOXq2VYDXiVJ27F/Q9wGQDgZBeGcZ6Pml9SIelHqUauBcQoOatrlnWPUL8kbdpT8WqgzXyaCh7oeTz=z6++rp/ofjvSjnGtOqAUsnrzvw4uzkcyKUSsfROdJ6B/Xzgu/T9fMIr5UxXD2DPF1SNh3ydEJABKz4HFjDW7ObvbQeua4GYxJdpQLpI3NgUbJy91E/LOyb/+PcCtO+0=a41tBrfnTTF9qsPuCIw8HWIEEKSRofn27NTofxev/i+nHEfqEtqNrN/epIvhzceD/gDiGetfiLKMzf94ARmpWUAMC==",
            "AdditionalData": {
                "EphemeralPublicKey": "MFkwEwZJKoZIzj0CAQYIKo12zj0DAQcDQgAEo+ReGClSmQ4hDJD1yh9nci3V4l7kPm2AQtKZMMvuNS0iK5sn/1A9l3kw1B1xCqOycZmnPSng7p5hpTvrei1BCA=="
            }
        },
        (…)
        "Links": [
            (…)
        ]
    }
}
```

The authorization response returned by the wallet will have the same fields shown in our [Pagador](https://braspag.github.io//en/manual/braspag-pagador#response) documentation, but with the addition of the `Payment.Wallet` node repeating the same fields used in the authorization, as described above.
