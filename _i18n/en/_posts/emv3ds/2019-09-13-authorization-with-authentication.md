---
layout: manual
title: 3. Authorization with Authentication
description: Gateway Braspag technical integration
search: true
translated: true
categories: manual
tags:
  - 3DS 2.0 Authentication
language_tabs:
  json: JSON
  shell: cURL
---

# Authorization with Authentication

After authentication is completed, it undergoes the authorization process by submitting the authentication data in the & quot; external authentication & quot; (node **ExternalAuthentication**).
This procedure is also valid for establishments that performed authentication outside Cielo (External MPI).

For more details about 3DS 2.0, please visit: [https://braspag.github.io/manualp/emv3ds#o-que-%C3%A9-3ds-2.0?] (https://braspag.github.io/manualp/emv3ds#o-que-%C3%A9-3ds-2.0?)

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
|Payment.Authenticate|Boolean defines if the buyer will be directed to the issuing Bank for card authentication|Boolean (true or false)|Yes, when authentication was a success|
|Payment.ExternalAuthentication.ReturnUrl|Return URL only applicable if version is "1"|Alphanumeric [1024 positions]|Yes|
|Payment.ExternalAuthentication.Cavv|Signature that is returned in successful authentication scenarios|Alphanumeric [28 positions]|Yes, when authentication was a success|
|Payment.ExternalAuthentication.Xid|XID returned in authentication process|Alphanumeric [28 positions]|Yes, when the 3DS version is "1"|
|Payment.ExternalAuthentication.Eci|E-Commerce Indicator Returned in Authentication Process|Numeric [1 position]|Yes
|Payment.ExternalAuthentication.Version|3DS version used in authentication process|Alphanumeric [1 position]|Yes, when the version of 3DS is "2"|
|Payment.ExternalAuthentication.ReferenceID|RequestID Returned in Authentication Process|GUID [36 positions]|Yes, when the version of 3DS is "2"|

### Response

See https://braspag.github.io/manual/braspag-pagador
