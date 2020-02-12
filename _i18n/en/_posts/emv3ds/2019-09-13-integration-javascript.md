---
layout: manual
title: 2.1. Integration via Javascript
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

# What is 3DS 2.0?

For more details about 3DS 2.0, please visit: [https://braspag.github.io/manualp/emv3ds#o-que-%C3%A9-3ds-2.0?] (https://braspag.github.io/manualp/emv3ds#o-que-%C3%A9-3ds-2.0?)

# Step 1 - Access Token Request

The solution consists of the API access token request step and Java Script authentication request step.

|Environment|Endpoint|Authorization|
|---|---|---|
|**SANDBOX**|https://authsandbox.braspag.com.br/oauth2/token|**Basic _(Authorization)_**<br><br>The Authorization value must be obtained by concatenating the value of the "ClientID", colon (":"), and "ClientSecret"<br><br>E.g.: b4c14ad4-5184-4ca0-8d1a-d3a7276cead9:qYmZNOSo/5Tcjq7Nl2wTfw8wuC6Z8gqFAzc/utxYjfs=<br><br>and then encode the result in base 64. <br>This will generate an alphanumeric access code that will be used in the access token. For testing purposes, use the following data: ClientID<br><br>: **dba3a8db-fa54-40e0-8bab-7bfb9b6f2e2e**<br>ClientSecret:**D/ilRsfoqHlSUChwAMnlyKdDNd7FMsM7cU/vo02REag=**|
|---|---|
|**PRODUCTION**|https://auth.braspag.com.br/oauth2/token|Request the "ClientID" and "ClientSecret" data from the support team after completing sandbox development.|

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/auth/token</span></aside>

```json
{
     "EstablishmentCode":"1006993069",
     "MerchantName": "Example Store Ltda",
     "MCC": "5912"
}
```

```shell
curl
--request POST "https://mpisandbox.braspag.com.br/v2/auth/token"
--header "Content-Type: application/json"
--header "Authorization: Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--data-binary
--verbose
{
     "EstablishmentCode":"1006993069",
     "MerchantName": "Example Store Ltda",
     "MCC": "5912"
}
```

|**Field**|**Description**|**Type/Size**|**Required**|
|---|---|---|
|EstablishmentCode|Cielo E-Commerce 3.0 Establishment Code|Numeric [10 positions]|
|MerchantName|Name of registered establishment in Cielo|Alphanumeric [up to 25 positions]|
|MCC|Merchant Category Code|Numeric [4 positions]|

### Response

```json
{
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfbmFtZSI6IlFBXzNEU19BdXRoZW50aWNhdG9yIiwiY2xpZW50X2lkIjoiZGJhM2E4ZGItZmE1NC00MGUwLThiYWItN2JmYjliNmYyZTJlIiwic2NvcGVzIjoie1wiU2NvcGVcIjpcIjNEU0F1dGhlbnRpY2F0b3JcIixcIkNsYWltc1wiOlt7XCJOYW1lXCI6XCJNZXJjaGFudE5hbWVcIixcIlZhbHVlc1wiOFwiVmFsdWVzXCI6W1wiNTU1NVwiXX0se1wiTmFtZVwiOlwiUmVmZXJlbmNlSWRcIixcIlZhbHVlc1wiOltcImY3MjE1YmQ3LWM0OTQtNGQ5Yi1NzEyfQ.daMqXko3dZOV0TzNFQ2vSsVSKqOsrwuswg7RB82ecAASSSSSSSSSSSSFFFFFFFFFFFFFGGGGGGGGGGGGGGGGGGGGGGGG",
      "token_type": "bearer",
      "expires_in": "2018-07-23T11:29:32"
}
```

```shell
--header "Content-Type: application/json"
--data-binary
{
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfbmFtZSI6IlFBXzNEU19BdXRoZW50aWNhdG9yIiwiY2xpZW50X2lkIjoiZGJhM2E4ZGItZmE1NC00MGUwLThiYWItN2JmYjliNmYyZTJlIiwic2NvcGVzIjoie1wiU2NvcGVcIjpcIjNEU0F1dGhlbnRpY2F0b3JcIixcIkNsYWltc1wiOlt7XCJOYW1lXCI6XCJNZXJjaGFudE5hbWVcIixcIlZhbHVlc1wiOFwiVmFsdWVzXCI6W1wiNTU1NVwiXX0se1wiTmFtZVwiOlwiUmVmZXJlbmNlSWRcIixcIlZhbHVlc1wiOltcImY3MjE1YmQ3LWM0OTQtNGQ5Yi1NzEyfQ.daMqXko3dZOV0TzNFQ2vSsVSKqOsrwuswg7RB82ecAASSSSSSSSSSSSFFFFFFFFFFFFFGGGGGGGGGGGGGGGGGGGGGGGG",
      "token_type": "bearer",
      "expires_in": "2018-07-23T11:29:32"
}
```

|**Field**|**Description**|**Type/Size**|**Required**|
|---|---|---|
|access\_token|Token required to perform authentication.|Alphanumeric [variable size]|
|token\_type|Fixed "bearer"|Alphanumeric|
|expires\_in|Time in minutes to expire token|Numeric|

# Step 2 - Script Implementation

In this step, is implemented _script_ and mapping of _classes_ are responsible for communicating with the flag and sender authentication platforms. Follow the example below, which demonstrates the basic implementation. It is recommended that the snippet be placed at the end of your checkout HTML code:

To download the code, [go here] (https://github.com/Braspag/braspag.github.io/blob/docs/_i18n/pt/_posts/emv3ds/example.html)

![3DS 2.0 Flux]({{ site.baseurl_root }}/images/exemplo-html.jpg)

Description of Events

|**Event**|**Description**|
|---|---|
|onReady|Triggers when all solution script loading procedures have completed successfully, which includes access token validation, indicating that the checkout is ready to start authentication|
|onSuccess|It is triggers when the card is eligible and has successfully completed the authentication process. In this case, the CAVV, XID, and ECI variables will be returned. This data must be sent in the request at the time of authorization. In this scenario, if the transaction is authorized, the liability shift is transferred to the issuer.|
|onFailure|It is triggers when the card is eligible but has not had the authentication process failed for some reason. In this case, only the ECI variable will be returned. If there is a decision to proceed with the authorization anyway, the ECI must be sent at the time of the request. In this scenario, if the transaction is authorized, the liability shift remains with the establishment.|
|onUnenrolled|It is triggered when the card is not eligible, ie the holder and / or issuer does not participate in the authentication program. In this case, only the ECI variable will be returned. If there is a decision to proceed with the authorization anyway, the ECI must be sent at the time of the request. In this scenario, if the transaction is authorized, the liability shift remains with the establishment.|
|onDisabled|It is triggers when the merchant has chosen not to subject the bearer to the authentication process (class "bpmpi\_auth" as false). In this scenario, if the transaction is authorized, the liability shift remains with the establishment.|
|onError|It is triggered when the authentication process has received a systemic error. In this scenario, if the transaction is authorized, the liability shift remains with the establishment.|
|onUnsupportedBrand|Triggers when card brand is not supported by 3DS 2.0|

Description of Input Parameters

|**Parameter**|**Description**|**Type/Size**|
|---|---|---|
|Environment|Indicates the environment to use (Sandbox or Production)|SDB - Sandbox (test environment) PRD - Production (production environment)|
|Debug|Boolean indicating whether debug mode is enabled or not. When true, the platform will report on the browser debug engine.|Boolean true - debug mode enabled false - debug mode disabled|

**IMPORTANT!**

The JavaScript file must be saved on the server where the store application is located. To download the file, go to:

[https://bit.ly/2CSOp2n](https://bit.ly/2CSOp2n)

Description of outputs

|**Exit**|**Description**|**Type/Size**|
|---|---|---|
|Cavv|Data representing authentication signature|Alphanumeric [28 positions]|
|Xid|ID representing the authentication request|Alphanumeric [28 positions]|
|Eci|E-commerce indicator code, which represents the result of authentication|Numeric [up to 2 positions]|
|Version|3DS Version Applied|Numeric [1 position] 1 - 3DS 1.02 - 3DS 2.0|
|ReferenceID|ID representing the authentication request|GUID [36 positions]|
|ReturnCode|Authentication Request Return Code|Alphanumeric [up to 5 positions]|
|ReturnMessage|Authentication Request Return Message|Alphanumeric [variable]|

# Step 3 - Class Mapping

The solution provides dozens of classes that must be mapped in your HTML code.

Once the class is mapped in a given field, the script is able to retrieve the value contained in the field and submit it to compose the authentication request.

<aside class="warning">The greater the number of parameterized fields, the greater the chance of having transparent authentication, as the issuer will have greater subsidy for risk analysis</aside>.

<aside class="notice">The # character indicated in the field must be replaced by a number representing the index of the item. Example: bpmpi_item_1_productName represents the name of cart item 1</aside>

|**Parameterization Data**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_auth|Boolean indicating whether the transaction is submitted to or not for the authentication process|Boolean:<br>true - submit to authentication<br>false - do not submit to authentication|Yes|
|bpmpi_auth_notifyonly|Boolean indicating whether the card transaction will be submitted in "notification only" mode. In this mode, the authentication process will not be triggered, however, the data will be flagged. ** VALID ONLY FOR MASTERCARD CARDS **|Boolean: <br>true - notification only mode; <br>false - mode with authentication|No|
|bpmpi_auth_suppresschallenge|Boolean indicating whether or not to ignore the challenge when it exists. If a transaction authorized after ignoring the challenge, liability remains with the establishment. |Boolean: <br>true - ignore challenges if any; <br>false - present challenge if any|No|
|bpmpi_accesstoken|Token generated by the Access Token API (step 1)|Alphanumeric [variable]|Yes|

|**Ordering Information**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_ordernumber|Order code at establishment|Alphanumeric [up to 50 positions]|Yes|
|bpmpi_currency|Currency Code|Fixed "BRL"|Yes|
|bpmpi_totalamount|Total transaction amount, sent in cents|Numeric [up to 15 positions]|Yes|
|bpmpi_installments|Number of Installments|Numeric [up to 2 positions]|Yes|
|bpmpi_paymentmethod|Type of card to be authenticated. In the case of a multiple card, you must specify either Credit or Debit|Credit - Credit<br>CardDebit - Debit Card|Yes|
|bpmpi_cardnumber|Card Number|Numeric [up to 19 positions]|Yes|
|bpmpi_cardexpirationmonth|Month of Card Expiration|Numeric [2 positions]|Yes|
|bpmpi_cardexpirationyear|Year of card expiration|Numeric [4 positions]|Yes|
|bpmpi_cardalias|Card Alias|Alphanumeric [up to 128 positions]|No|
|bpmpi_default_card|Indicates if it is a standard customer card in store|Boolean <br>true - yes<br>false - no|No|

|**Order characteristics data**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_recurring_enddate|Identifies recurrence end date|Text (YYYY-MM-DD)|No|
|bpmpi_recurring_frequency|Indicates frequency of recurrence|Number<br>1 - Monthly<br>2 - Bimonthly<br>3 - Quarterly<br>4 - Four-month period<br>6 - Half-yearly<br>12 - Annual|No|
|bpmpi_recurring_originalpurchasedate|Identifies the date of the 1st transaction that originated the recurrence|Text (YYYY-MM-DD)|No|
|bpmpi_order_recurrence|Indicates if it is an order that generates future recurrences|Boolean<br>true<br>false|No|
|bpmpi_order_productcode|Purchase type|ACC: Hospitality<br>ACF: Financing check<br>CHA: Check acceptance<br>DIG: Digital Goods<br>DSP: Money Dispensing<br>GAS: Fuel<br>GEN: General Retailer<br>LUX: Luxury Goods<br>PAL: recharges<br>PHY: Gods purchase<br>QCT: Almost-money transactions<br>REN: Car Rental<br>RES: Restaurant<br>SVC: Services<br>TBD: Outers<br>TRA: Turism|No|
|bpmpi_order_countlast24hours|Quantity of orders placed by this shopper in the last 24h|Numeric [up to 3 positions]|No|
|bpmpi_order_countlast6months|Number of orders placed by this shopper in the last 6 months|Numeric [up to 4 positions]|No|
|bpmpi_order_countlast1year|Number of orders placed by this shopper in the last year|Numeric [up to 3 positions]|No|
|bpmpi_order_cardattemptslast24hours|Number of same card transactions in last 24h|Numeric [up to 3 positions]|No|
|bpmpi_order_marketingoptin|Indicates if the buyer has accepted to receive marketing offers|Boolean<br>true – yes<br>false – no |No|
|bpmpi_order_marketingsource|Identifies the origin of the marketing campaign|Alphanumeric [up to 40 positions]|No|
|bpmpi_transactionMode|Identifies the channel that originated the transaction|M: MOTO<br>R: Varejo<br>S: E-Commerce<br>P: Mobile<br>T: Tablet|No|
|bpmpi_merchant_url|Establishment Website Address|Alphanumeric [100] Example: http://www.example.com|Yes|

|**Specific data for Gift Card (prepaid)**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_giftcard_amount|The total amount of the purchase for rounded prepaid gift cards|Numeric [up to 15 positions],<br>example: $ 125.54 = 12554|No|
|bpmpi_giftcard_currency|Prepaid Card Payment Transaction Currency Code|Fixed "BRL"|No|

|**Billing Address Data**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_billto_customerid|Identifies the shopper CPF/CNPJ|Numeric [11 to 14 positions]<br>99999999999999|No|
|bpmpi_billto_contactname|Billing Address Contact Name|Alphanumeric [up to 120]|Yes|
|bpmpi_billTo_phonenumber|Billing Address Contact Phone|Numeric [up to 15 positions], in the format: 5511999999999|Yes|
|bpmpi_billTo_email|Billing Address Contact Email|Alphanumeric [up to 255], in the format [name@example.com] (mailto: name@example.com)|Yes|
|bpmpi_billTo_street1|Address and Billing Address Number|Alphanumeric [up to 60]|Yes|
|bpmpi_billTo_street2|Billing Address Supplement and Neighborhood|Alphanumeric [up to 60]|Yes|
|bpmpi_billTo_city|Billing Address City|Alphanumeric [up to 50]|Yes|
|bpmpi_billTo_state|Billing Address State Acronym|Text [2 positions]|Yes|
|bpmpi_billto_zipcode|Billing Address Zip Code|Alphanumeric [up to 8 positions], in the format: 99999999|Yes|
|country|Billing Address Country|Text [2 positions] E.g: BR|Yes|

|**Shipping Address Data**|**Description**|**Type / Size**|**Required**|
|---|---|---|---|
|bpmpi_shipto_sameasbillto|Indicates whether to use the same address provided for billing address|Boolean<br>true<br>false|No|
|bpmpi_shipto_addressee|Contact Name of Shipping Address|Alphanumeric [up to 60]|No|
|bpmpi_shipTo_phonenumber|Contact address of shipping address|Numeric [up to 15 positions], in the format: 5511999999999|No|
|bpmpi_shipTo_email|Shipping Address Contact Email|Alphanumeric [up to 255], in the format [name@example.com] (mailto: name@example.com)|No|
|bpmpi_shipTo_street1|Address and Delivery Address Number|Alphanumeric [up to 60]|No|
|bpmpi_shipTo_street2|Delivery Address Complement and Neighborhood|Alphanumeric [up to 60]|No|
|bpmpi_shipTo_city|City of delivery address|Alphanumeric [up to 50]|No|
|bpmpi_shipTo_state|Shipping Address State Acronym|Text [2 positions]|No|
|bpmpi_shipto_zipcode|Shipping Address ZIP Code|Alphanumeric [up to 8 positions], in the format: 99999999|No|
|bpmpi_shipto_country|Billing Address Country|Text [2 positions] E.g.: BR|No|
|bpmpi_shipTo_shippingmethod|Shipping Method Type|LOWCOST: Economical Shipping <br> SAMEDAY: Same shipping<br> ONEDAY: Next day shipping <br> TWODAY: Two days shipping<br>THREEDAY: Three days shipping<br> PICKUP: Delivery at the store<br>OTHER: There is no shippment|No|
|bpmpi_shipto_firstusagedate|Indicates the date when the shipping address was first used|Text<br>YYYY-MM-DD - Date Created|No|

|**Shopping Cart Details**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_cart_#_description|Item Description|Alphanumeric [up to 255 positions]|No|
|bpmpi_cart_#_name|Item Name|Alphanumeric [up to 255 positions]|No|Yes||
|bpmpi_cart_#_sku|Item SKU|Alphanumeric [up to 255 positions]|No|
|bpmpi_cart_#_quantity|Item Quantity in Cart|Numeric [up to 10 positions]|No|
|bpmpi_cart_#_unitprice|Cart item unit value in cents|Numeric [up to 10 positions]|No|

|**User Data**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_useraccount_guest|Indicates if the buyer is a buyer without login (guest)|Boolean<br>true – yes<br>false – no |No|
|bpmpi_useraccount_createddate|Indicates the date when the buyer account was created|Text<br>YYYY-MM-DD - Date Created|No|
|bpmpi_useraccount_changeddate|Indicates the date when the last buyer account change|Text<br>YYYY-MM-DD - date of last change|No|
|bpmpi_useraccount_passwordchangeddate|Indicates the date when the buyer account password was changed|Text<br>YYYY-MM-DD - Last Password Change Date|No|
|bpmpi_useraccount_authenticationmethod|Authentication Method of the shopper in the store|01- Does not happen authentication<br>02- Login at the own store<br>03- Login at federated ID<br>04- Login with FIDO authenticator|No|
|bpmpi_useraccount_authenticationprotocol|This represents the store login protocol|Alphanumeric [up to 2048 positions]|No|
|bpmpi_useraccount_authenticationtimestamp|The date and time the store was logged in|Text [19 positions] _YYYY-MM-ddTHH: mm: SS_|No|
|bpmpi_merchant_newcustomer|Identifies if a new buyer in the store|Boolean<br>true – yes<br>false – no |No|

|**Data of device used for purchase**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_device_ipaddress|Shopper's Machine IP Address|Alphanumeric [up to 45]|No|
|bpmpi_device_#_fingerprint|Id returned by Device Finger Print|Alphanumeric [without limitation]|No|
|bpmpi_device_#_provider|Device Finger Print Provider Name|Alphanumeric [up to 32 positions] cardinal<br>inauth<br>threatmetrix|No|

|**Specific airline data**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_airline_travelleg _ # _ carrier|IATA code for the stretch|Alphanumeric [2 positions]|No|
|bpmpi_useraccount_createddate|Indicates the date when the buyer account was created|Text<br>YYYY-MM-DD - Date Created|No|
|bpmpi_airline_travelleg_#_origin|IATA code of origin airport|Alphanumeric [5 positions]|No|
|bpmpi_airline_travelleg_#_destination|IATA code of destination airport|Alphanumeric [5 positions]|No|
|bpmpi_airline_passenger_#_name|Passenger Name|Alphanumeric [up to 60 positions]|No|
|bpmpi_airline_passenger_#_ticketprice|The ticket value in Numeric cents [up to 15 positions],<br>example: $ 125.54 = 12554|No|
|bpmpi_airline_numberofpassengers|Number of Passengers|Numeric [3 positions]|No|
|bpmpi_airline_billto_passportcountry|Passport country code (ISO Standard Country Codes)|Text [2 positions]|No|
|bpmpi_airline_billto_passportnumber|Passport Number|Alphanumeric [40 positions]|No|

|**Extra property data (if applicable)**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|
|bpmpi_mdd1|Extra data defined by the shopkeeper|Alphanumeric [up to 255 positions]|No|
|bpmpi_mdd2|Extra data defined by the shopkeeper|Alphanumeric [up to 255 positions]|No|
|bpmpi_mdd3|Extra data defined by the shopkeeper|Alphanumeric [up to 255 positions]|No|
|bpmpi_mdd4|Extra data defined by the shopkeeper|Alphanumeric [up to 255 positions]|No|
|bpmpi_mdd5|Extra data defined by the shopkeeper|Alphanumeric [up to 255 positions]|No|

# Step 4 - Implementing the Authentication Event Request

The event **bpmpi_Authenticate()**" must be called at checkout (checkout). See the example below:

|||UNTRANSLATED_CONTENT_START|||&lt;input type=&quot;button&quot;onclick=&quot;bpmpi_authenticate()&quot; /&gt;|||UNTRANSLATED_CONTENT_END|||

# Test Cards

Use the **test** cards below to simulate various scenarios in the **SANDBOX** environment

|**Cards**|**Result**|**Description**|
|Visa: 4000000000001000<br>Mastercard: 5200000000001005|SUCCESS|Silent Authentication and card holder successfully authenticated|
|Visa: 4000000000001018<br>Mastercard: 5200000000001013|FAILURE|Silent and card holder authentication terminated with failure|
|Visa: 4000000000001034<br>Mastercard: 5200000000001039|UNENROLLED|Card not eligible for authentication|
|Visa:4000000000001091<br>Mastercard: 5200000000001096|SUCCESS|Challenging and card holder authentication successfully authenticated|
|Visa:4000000000001109<br>Mastercard: 5200000000001104|FAILURE|Challenge authentication and card holder failed authentication|

## Authorization with Authentication

After authentication is completed, it undergoes the authorization process by submitting the authentication data in the & quot; external authentication & quot; (node **ExternalAuthentication**).
See more details at: [https://braspag.github.io/manual/aautizacao-com-autenticacao[(https://braspag.github.io/manual/autorizacao-com-autenticacao)

# Last updates

To view the latest manual updates, [click here] (https://github.com/Braspag/braspag.github.io/commits/docs/_i18n/en/_posts/emv3ds/2019-09-13-integracao-javascript .md)
