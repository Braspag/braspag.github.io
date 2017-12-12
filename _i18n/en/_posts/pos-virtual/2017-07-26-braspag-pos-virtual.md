---
layout: manual
title: User Manual
description: User Manual POS-Virtual Braspag
search: true
categories: manual
translated: true
tags:
  - POS-Virtual
---

# Creating a group

It is mandatory to create at least one group before inicitate the sales using virtual POS. The group determinates the operator's access level. 

To create a group, access Configuration > Groups, and fill the fields correctly:

![]({{ site.baseurl_root }}/images/braspag/posvirtual/criargrupos.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Nome|Nome do grupo|Yes|
|Permissões|selecione as permissões que este grupo poderá ter|Yes|

The list of permissions:

|Permission|
|----------|
|Change the next recurrence date|
|Change the recurrence end date|
|Change the day of recurrency|
|Change the interval of recurrency|
|Change the recurrency payment amount|
|Enable or Disable a recurrency|
|Void a transaction created by user|
|Void a transaction created by user using report interface|
|Void any transactions|
|Capture a transaction created by user|
|Capture a transaction created by user using report interface|
|Create an order|
|Refund a transaction using report interface|
|View recurrent orders|
|View transactions created by user|
|View recurrent transactions|

# Creating Operators

The "managers" are able to create other users called "operators", that have permissions to create an order.

Access Configuration > Operators, and fill the all mandatory fields below. When the information is submitted, an e-mail will be sent to the registered address.

![]({{ site.baseurl_root }}/images/braspag/posvirtual/cadastraroperador.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Username|username to be used to access the POS|Yes|
|Name|Operator's name|Yes|
|E-mail|Operator's E-mail|Yes|
|Group|Operator's group|Yes| 
|Stores|Stores that operator will perform an order|Yes| 

# Perform an order

To create a new order, the operator has to access to the order form: Virtual POS -> Sell Form 

![]({{ site.baseurl_root }}/images/braspag/posvirtual/menucriarpedido.png)

## Step by Step

The form has some group of information with mandatory and optional fields.

You can configure the form to show just some groups you need to you business. 

Below, you will see the details of each possible block of information. 

### Order

This group requires the informations about the order.

![]({{ site.baseurl_root }}/images/braspag/posvirtual/camposdadosdopedido.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Order Number|merchant's order number|Yes|
|Nome|Customer's Name|Yes|
|CPF/CNPJ|Customer's CPF/CNPJ. In case of foreigner customer, fill zeros|Yes|
|E-mail|Customer's E-mail|No| 

### Delivery Address

This group requires the informations about the delivery address

![]({{ site.baseurl_root }}/images/braspag/posvirtual/camposdadosendereco.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Street|Customer's delivery address street name|No|
|Number|Customer's delivery address street building number|No|
|Complement|Customer's delivery address complement|No|
|City|Customer's delivery address city|No|
|State|Customer's delivery address state|No|
|District|Customer's delivery address district|No|
|Zip Code|Customer's delivery address zip code|No|
|Country|Customer's delivery address country|No| 

### Recurrency

This part defines recurrency configuration to an order. There are three possibilities: 

* Just schedule the further payments
* Charge now and schedule the further payments to the same day
* Charge now and schedule the further payments to the other day

*Option 1: Just schedule the further payments*

In this option, the recurrency will be scheduled accordint to the informations provided below. In this case, the customer will be charged just when the first recurrency occurs (start date). 

If the end date is not informed, the recurrency will never end. 
 
![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadosdarecorrencia1.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Interval|Interval of recurrency. Default: Monthly|Yes|
|Start Date|Recurrency start date|Yes|
|End date|recurrency end date|No|

*Option 2: Charge now and schedule the further payments to the same day*

In this option, the recurrency payment will be created and the first chage will occur immediately. The further recurrences always will occur in the same day of first charge.

If the end date is not informed, the recurrency will never end. 

![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadosdarecorrencia2.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Interval|Interval of recurrency. Default: Monthly|Yes|
|Start Date|Recurrency start date. Fixed value|Yes|
|Recurrence Day|The day that occurs further charges. Fixed Value.|Yes|
|End date|recurrency end date|No|

*Option 3: Charge now and schedule the further payments to the other day*

In this option, the recurrency payment will be created and the first chage will occur immediately. The further recurrences always will occur in the day selected in the form.

If the end date is not informed, the recurrency will never end. 

![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadosdarecorrencia3.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Intervalo 	Interval of recurrency. Default: Monthly|Yes| 
|Start Date|Recurrency start date. Fixed value|Yes|
|Recurrence Day|The day that occurs further charges|Yes|
|End date|recurrency end date|No|

### Billing Address

This group requires the informations about the billing address

![]({{ site.baseurl_root }}/images/braspag/posvirtual/camposdadosenderecocobranca.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Street|Customer's billing address street name|No|
|Number|Customer's billing address street building number|No|
|Complement|Customer's billing address complement|No|
|City|Customer's billing address city|No|
|State|Customer's billing address state|No|
|District|Customer's billing address district|No|
|Zip Code|Customer's billing address zip code|No|
|Country|Customer's billing address country|No| 

### Payment Data 

This group requires the informations about the payment data

![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadospagamento.png)

|Field|Description|Mandatory|
|-----|-----------|---------|
|Payment Method|The brand of credit card|Yes|
|Card holder|Card Holder name|Yes|
|Card Number|Credit card number|Yes|
|Card Security Code|Card Security Code|Yes|
|Expiration Date|Card expiration date|Yes|
|Amount|Transaction's amount|Yes|
|Installments|Installment number. In case of recurrency transaction, this field will not be showed. |Yes|

## Submit or Clean

The Submit button will submit the order to authorization process.

If you configured the option "automatic capture", the order will be authorized and captured immediately. Else, the transaction will be captured only if you access the report and capture manually. 

The Clean button will clean the filled information.

![]({{ site.baseurl_root }}/images/braspag/posvirtual/btnpagarlimpar.png)

# Order Report

Access the Virtual POS > Transactions to see the orders performed previously

![]({{ site.baseurl_root }}/images/braspag/posvirtual/listapedidos.png)

Abote the order list, there are two labels about amounts. One represents the captured Amount, and other, the partial amount to be captured. 

* Captured amoun - the total amount already captured 
* Amount to be captured - total amount that could be captured 

The action column has links to take an one of actions:

## Capture 

This action will be available to the Virtual POS if you not choosed to make automatic capture. 
All the orders just authorized must be captured here. When the capture process is successfully completed, the order status will change from "Not Paid" to "Paid".
 	 
### Partial Capture

This action must be used when you need to partially capture the amount. Ex. 
 
* Authorized amount: R$ 100,00 
* Partial Capture of R$ 50,00 

The Virtual POS will show a field to input the partial amount. 

![]({{ site.baseurl_root }}/images/braspag/posvirtual/capturar.png)

<aside class="notice">Note: the partial capture must be used just once. The remaining amount after a partial capture will be released automatically.</aside>

### Total Capture

This action must be used when you need to capture all the amount. Ex. 

* Authorized amount: R$ 100,00 
* Total Capture of R$ 100,00 

<aside class="notice">If you are using automatic capture configuration, this option will not be available. </aside>

## Void 

This action is destinated to void a transaction. 

You need to confirm the action, as show below.

![]({{ site.baseurl_root }}/images/braspag/posvirtual/cancelar.png)

## Print 

This action will show you a print version of an order. 

See the example below.

![]({{ site.baseurl_root }}/images/braspag/posvirtual/imprimir.png)
