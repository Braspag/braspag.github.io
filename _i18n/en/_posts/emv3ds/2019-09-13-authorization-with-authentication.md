---
layout: manual
title: Authorization with Authentication
description: Gateway Braspag Technical Integration
search: true
translated: true
categories: manualp
sort_order: 5
tags:
  - 4. EMV 3DS (3DS 2.0)
language_tabs:
  json: JSON
  shell: cURL
  
---

# Authorization with Authentication

After authentication is completed, the transaction undergoes the authorization process by submitting the authentication data in the "external authentication" (node **ExternalAuthentication**).
This procedure is also valid for establishments that performed authentication outside Cielo (External MPI).

For more details about 3DS 2.0, please visit: [https://braspag.github.io//en/manualp/emv3ds](https://braspag.github.io//en/manualp/emv3ds)

See example below, describing the submission of authentication data from the Pagador API authorization request.

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
     "Provider":"Cielo30",
     "Authenticate":true,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
       "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
       "Eci":"5",
       "Version":"2",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
     }
   }
}
```

```shell
curl
--request POST "https://apisandbox.braspag.com.br/v2/sales"
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
     "Provider":"Cielo30",
     "Authenticate":true,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
       "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
       "Eci":"5",
       "Version":"2",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
     }
   }
}
```

|**Field**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|`Payment.Authenticate`|Defines if the buyer will be directed to the issuing Bank for card authentication|Boolean (true or false)|Yes, when authentication was a success|
|`Payment.ExternalAuthentication.ReturnUrl`|Return URL only applicable if version is "1"|Alphanumeric [1024 positions]|Yes|
|`Payment.ExternalAuthentication.Cavv`|Signature that is returned in successful authentication scenarios| Text |Yes, when authentication was a success|
|`Payment.ExternalAuthentication.Xid`|XID returned in authentication process| Text |Yes, when the 3DS version is "1"|
|`Payment.ExternalAuthentication.Eci`|E-commerce Indicator Returned in Authentication Process|Numeric [1 position]|Yes
|`Payment.ExternalAuthentication.Version`|3DS version used in authentication process|Alphanumeric [1 position]|Yes, when the version of 3DS is "2"|
|`Payment.ExternalAuthentication.ReferenceID`|RequestID Returned in Authentication Process|GUID [36 positions]|Yes, when the version of 3DS is "2"|

### Response

See response at [API REST Integration Guide](https://braspag.github.io//en/manual/braspag-pagador#authenticating-a-transaction)  

# Authorization for Data Only Transactions

After the authentication step in Data Only model is completed (field `bpmpi_auth_notifyonly` set as "true"), the transaction undergoes the authorization process by sending the authentication data in the “external authentication” model (node `ExternalAuthentication`).
See example below, describing the submission of authentication data from the Pagador API authorization request, using POST:

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales</span></aside>

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
     "Authenticate":false,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{  
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Eci":"4",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6",
       "dataonly":true
     }
   }
}
```

```shell
--request POST "https://apisandbox.cieloecommerce.cielo.com.br/1/sales"
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
     "Authenticate":false,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{  
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Eci":"4",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6",
       "dataonly":true
     }
   }
}
```

| **FIELD** | **DESCRIPTION** | **TYPE/SIZE** | **REQUIRED** |
| --- | --- | --- | --- |
|`Payment.Authenticate`|Defines if the buyer will be directed to the issuing Bank for card authentication|Boolean (true or false)|Yes. For Data Only transactions the value must be "false"| 
|`Payment.ExternalAuthentication.Eci`|*E-commerce Indicator* returned in authentication process|Numeric [1 position]|Yes|
|`Payment.ExternalAuthentication.ReferenceId`|RequestID returned in authentication process|GUID [36 positions]|Yes|
|`Payment.ExternalAuthentication.DataOnly`|Defines if transaction is *Data Only*|Boolean (true or false)|Yes. For Data Only transactions the value must be "true"|

### Response

See [API Rest Integration Guide](https://braspag.github.io//en/manualp/authorization-with-authentication?json#authorization-with-authentication) for detailed examples of Authorization with Authentication response.

# ECI Table

|**BRAND**|**ECI**|**TRANSACTION MEANING**|
|---|---|---|
|Visa|06|Authenticated by the card brand – chargeback risk is held by the issuer|
|Visa|05|Authenticated by the issuer – chargeback risk is held by the issuer|
|Visa|Different from 05 and 06|Non-authenticated – chargeback risk is held by the merchant|
|Mastercard|01|Authenticated by the card brand – chargeback risk is held by the issuer|
|Mastercard|02|Authenticated by the issuer – chargeback risk is held by the issuer|
|Mastercard|03|Non-authenticated, Data Only transaction – chargeback risk is held by the merchant|
|Mastercard|Different from 01, 02, and 04|Non-authenticated – chargeback risk is held by the merchant|
