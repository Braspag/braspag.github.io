---
layout: manual
title: Integration Manual Silent Order Post
description: Integração técnica Gateway Braspag
search: true
categories: manual
translated: true
tags:
  - Pagador
language_tabs:
  shell: cURL
---

# Silent Order Post

The main objective of this document is to guide your implementation with the PagadorButton, for Pagador platform.

The PagadorButton is another way to implement the Authorization process with Pagador platform. Using the JavaScript© as a script to do this and show a button in your checkout, you only needs to set-up the next steps in your checkout.

# How To

Follow below the way to implement the Silent Order Post:

![Fluxo Silent Order Post]({{ site.baseurl_root }}/images/fluxo-sop-br.jpg)

**STEP 1**

The customer finishes to checkout, and go to payment process.

**STEP 2**

a) The merchant must request a ticket (server to server) sending a POST to the following URL:

**https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid={mid_loja}**

For example: https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000

## Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v1/accesstoken?merchantid={mid_loja}</span></aside>

```shell
curl
--request POST "https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000"
--header "Content-Type: application/json"
--data-binary
--verbose
```

|PROPERTY|DESCRIPTION|TYPE|SIZE|MANDATORY|
|-----------|---------|----|-------|-----------|
|`mid_loja`|API store identifier |Guid |36 |Yes|

## Response

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantId": "{5ed36d2f-65f2-e411-9408-000af7120b62}",
    "AccessToken": "NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==",
    "Issued": "2018-07-23T11:09:32",
    "ExpiresIn": "2018-07-23T11:29:32"
}
```

|PROPERTY|DESCRIPTION|TYPE|SIZE|MANDATORY|
|-----------|---------|----|-------|-------|
|`MerchantId`|API store identifier |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`AccessToken`|Access Token |Text|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Date and time of the generation |Text|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Date and time of the expiration |Text|--|AAAA-MM-DDTHH:MM:SS|

b) In order to use this resource, for security reasons, it will be mandatory for Braspag to require, **at least a valid IP of the establishment**. Otherwise the requisition will not be authorized (**HTTP 401 NotAuthorized**).

**STEP 3**

a) As answer the establishment will receive a json (HTTP 201 Created) having among other information the ticket (AccessToken), as for example:

![Response Ticket]({{ site.baseurl_root }}/images/response-ticket.jpg)

For matters of safety, this ticket will give permissions to the establishment to save only 1 card in the deadline already established on the answer, through the attribute Expiresln (for default 20 minutes). What happens first will invalidate this same ticket for future usage.

**STEPS 4 ao 6**

a) The establishment will have to download a script provided by Braspag and attach it on the checkout page. This script will allow Braspag to process all of the card information without the establishment intervention

The download may be made from the following URL: **https://www.pagador.com.br/post/scripts/silentorderpost-1.0.min.js**

b) The establishment will have to decorate the inputs from the form with the following classes:

* For the credit/debit card holder: **bp-sop-cardholdername** 
* For credit/debit card number: **bp-sop-cardnumber** 
* For credit/debit card expiration date: **bp-sop-cardexpirationdate** 
* For the credit/debit card security code: **bp-sop-cardcvvc**

c) The script provided by Braspag present three events for the establishment’s manipulation and treatment which are: **onSuccess** (where will be returned the **PaymentToken** after the card data is processed), **onError** (in case there is any error in the consumption of Braspag services) and **onInvalid** (where the result of the validation of the inputs will be returned).

* On the input validation, the establishment may use the entire card data validation layer realized by Braspag in order to simplify the treatment on the checkout form. The returned messages on the validation result are available on the following languages: Portuguese (default) English and Spanish.

* The **PaymentToken** will be the token that will represent every card data provided by the buyer. It will be utilized by the establishment so there will not be the necessity of treating and processing the card data on your side. This token may be used both in transactions using Hosted Page or SOAP / REST implementations of Pagador.

**For matters of safety this PaymentToken may be used for only 1 authorization on Braspag. After the token processing, it will be invalid.**

Example of setup to be carried out by the establishment on the checkout page:

![Pagina Checkout]({{ site.baseurl_root }}/images/pagina-checkout.jpg)
