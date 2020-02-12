---
layout: tutorial
title: Integration Manual
description: Integração técnica Tokenização Braspag
search: true
categories: tutorial
translated: true
tags:
  - Cartão Protegido
---

# Card Tokenization Overview

CARTÃO PROTEGIDO (card tokenization) is a safe credit card information storage platform. The data stored at the Protected Card Platform follows PCI standards that ensure the integrity of the card information stored.

The CARTÃO PROTEGIDO (card tokenization) integrates with gateway PAGADOR (BRASPAG), facilitating the submission and processing of credit card transactions via token. 

## ABOUT THE PRODUCT 

While product, CARTÃO PROTEGIDO (card tokenization), as a solution to the problem of secure data storage of credit card can be used for various purposes such as: 

* **1 Click Shop:** “1 Click Shop” allows an online payment (via credit card) be made skipping the step of filling in the payment details or even the whole process of the shopping cart, since card data were previously reported by the buyer in past purchases and will be replicated in future purchases through its authorization.
* **Recurrent Billing:** Establishments that already have an internal solution for managing recurrences can use the platform just to the sensitive part: storing data and credit card processing via PAGADOR, charges in Acquirers by using only the token.
* **Retry sending transaction (sale):** For establishments that store data sale to pass in a second time, and to re-try sending a credit card transaction for a Purchaser or to any internal procedure before authorizing the sale (inventory validation, analysis of fraud), the platform perfectly serves this purpose. The establishment needs to understand and manipulate just one token, remaining adherent to the security rules of the industry of credit cards.
* Or for any other purpose, which is necessary to store data from a credit card safely, even temporarily. 

The "One Click Shop" enables online payments via credit card skipping the step of filling out payment details or even the whole shopping basket process, since all card details have previously been informed by the purchaser on past purchases and will be automatically replicated in new purchases upon the purchaser's authorization. 

## ABOUT THIS MANUAL 

This manual aims to guide the Merchant's developer on the integration with the CARTÃO PROTEGIDO platform, describing existing functions and methods to be used, listing information to be sent and received, and providing examples. 

<aside class="warning">To get the production URL, please ask our implementation team through our support tool. </aside>

## integration Guide

Please see the graphics for the sales process flows in the sections below. There are 3 ways to integrate the product:

* Directly via CARTÃO PROTEGIDO platform
* Via PAGADOR platform - through Web services.
* Via PAGADOR platform - through Data Posts. 

The following data is required to store a credit card in the platform: Customer's CPF (Taxpayer ID), Customer's Name, Cardholder's Name, Card Number, and Expiration Date. The security code is not stored (please refer to the Security Code section

<aside class="notice">The CARTÃO PROTEGIDO platform safely stores credit card data, with 100% PCI Compliance.</aside>

<aside class="warning">Since the transaction authorization is carried via PAGADOR, all other functions for transaction confirmation - Second Post (confirmation post), and Third Post (probe) - continue to work the same way.</aside>

<aside class="notice">For enhanced security, only previously registered IPs of the Merchant will be allowed to query credit card numbers or authorize transactions using the CARTÃO PROTEGIDO (PROTECTED CARD) key (JustClickKey).  </aside>

# PARAMETER JustClickAlias 

This parameter is intended to facilitate the storage, by the customer, of information related to a Secured Card The customer may at the time of the rescue card, create an alias (name) will identify the card in Platform CARTÃO PROTEGIDO.

Another advantage is the fact that this alias can be associated with a new JustClickKey, which facilitates the exchange of a card when, for example, its validity expires.

Para isso, o lojista deveria indicar que o JustClickKey está desabilitado. Dessa forma, o Alias associado a ele ficaria liberado para ser utilizado com um novo JustClickKey. 

## Right Way of Association 

An Alias can be associated with a new token, since before being disassociated from the old Token as shown in the example below: 

|Merchant Id|JustClickKey (Token)|Alias|Enabled|
|-----------|--------------------|-----|-------|
|LOJA A|Token 1|XPTO|0|
|LOJA A|Token 2|XPTO|0|
|LOJA A|Token 3|XPTO|1|

<aside class="notice">Note: Disassociation occurs after the execution of the method InvalidateCreditCard</aside>

## Form not accepted of Association 

An Alias can be associated with a new token, since before being disassociated Token old, in the example below is shown a way that would not allow this association because the Alias will only be released to a new association that is disconnected from a particular Token: 

|Merchant Id|JustClickKey (Token)|Alias|Enabled|
|-----------|--------------------|-----|-------|
|LOJA A|Token 1|XPTO|1|
|LOJA A|Token 2|XPTO|1|
|LOJA A|Token 3|XPTO|1|

# AUTHORIZATION PROCESS VIA CARTÃO PROTEGIDO PLATFORM 

Below is the process of request for saving customer card details during a sale transaction, followed by another process in which the same customer makes a purchase via CARTÃO PROTEGIDO

After having the customer's permission to save his/her card details, the merchant should: 

1. Submit the purchase authorization request via Gateway. Standard process already adopted today
2. Receive the authorization result
3. Submit the card details for storage in the CARTÃO PROTEGIDO (PROTECTED CARD) platform
4. Receive and store the “JustClickKey”, which is the key representing the pair “credit card-customer” for future “One Click Shops”. 

When the customer returns to the site for a new purchase and logs in, the site can offer the “One Click Shop” option and the flow will be: 

1. To invoke the transaction authorization directly from the CARTÃO PROTEGIDO platform, passing the customer's “JustClickKey” and, optionally, the CVV (please refer to the Security Code section)
2. Receive the authorization result 

![]({{ site.baseurl_root }}/images/braspag/cartaoprotegido/autorizacaocomopcaosalvarcartao.png)

# AUTHORIZATION PROCESS VIA PAGADOR

Below are the processes of request for saving a customer card during a sale transaction and a purchase via CARTÃO PROTEGIDO (PROTECTED CARD) platform, both using the PAGADOR/CARTÃO PROTEGIDO integration
