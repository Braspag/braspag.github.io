---
layout: redirect
redirect: https://docs.cielo.com.br/gateway-en/docs/what-is-3ds-22-authentication
title: Integration via JavaScript
description: Gateway Braspag Technical Integration
search: true
translated: true
categories: manualp
sort_order: 2
tags:
  - 4. EMV 3DS (3DS 2.0)
language_tabs:
  json: JSON
  shell: cURL
---

# What is 3DS 2.0?

For more details about 3DS 2.0, please visit: [https://braspag.github.io//en/manualp/emv3ds](https://braspag.github.io//en/manualp/emv3ds){:target="_blank"}

<aside class="warning">Warning: We do not offer support for the development and implementation of this SDK.</aside>

# Step 1 - Access Token Request

The solution consists of two steps, the API access token request and the JavaScript authentication request.

|Environment|Endpoint|Authorization|
|---|---|---|
|**SANDBOX**|https://authsandbox.braspag.com.br/oauth2/token|**Basic _(Authorization)_**<br><br>The Authorization value must be obtained by concatenating the value of the "ClientID", colon (":"), and "ClientSecret"<br><br>E.g.: b4c14ad4-5184-4ca0-8d1a-d3a7276cead9:qYmZNOSo/5Tcjq7Nl2wTfw8wuC6Z8gqFAzc/utxYjfs=<br><br>and then encode the result in base 64. <br>This will generate an alphanumeric access code that will be used in the access token. For testing purposes, use the following data: <br>ClientID: **dba3a8db-fa54-40e0-8bab-7bfb9b6f2e2e**<br>ClientSecret:**D/ilRsfoqHlSUChwAMnlyKdDNd7FMsM7cU/vo02REag=**|
|---|---|
|**PRODUCTION**|https://auth.braspag.com.br/oauth2/token|Request the "ClientID" and "ClientSecret" data to the Support team after completing sandbox development.|

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

|**Field**|**Description**|**Type/Size**|
|---|---|---|
|EstablishmentCode|Establishment Code in Cielo E-Commerce 3.0 or Getnet, or PV at Rede|Numeric [10 positions]|
|MerchantName|Name of registered establishment in the acquirer|Alphanumeric [up to 25 positions]|
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

|**Field**|**Description**|**Type/Size**|
|---|---|---|
|access\_token|Token required to perform authentication.|Alphanumeric [variable size]|
|token\_type|Fixed "bearer"|Alphanumeric|
|expires\_in|Time in minutes to expire token|Numeric|

# Step 2 - Script Implementation

In this step we implement the _script_ and mapping of _classes_, responsible for communicating with the brand and issuer authentication platforms. Follow the example below, which demonstrates the basic implementation. It is recommended that the snippet be placed at the end of your checkout HTML code:

> To download the code, [go here](https://github.com/Braspag/braspag.github.io/blob/docs/_i18n/pt/_posts/emv3ds/exemplo.html){:target="_blank"}

![3DS 2.0 Flux]({{ site.baseurl_root }}/images/exemplo-html.jpg)

## Description of Events

The events are actions that the script considers as a response for following the authentication process, but do not indicate if the transaction was successfully authenticated.

The ECI (E-commerce Indicator) is what indicates if the transaction was authenticated or not and the liability in case of chargeback. In order to sumbit a transaction for authorization, please consider the ECI value and use the events only as a complemenatry information for decision-making.

<aside class="warning">Submitting a non-authenticated transaction for authorization is allowed; however, the liability shift in case of chargeback remains with the merchant.</aside>

|**Event**|**Description**|
|---|---|
|onReady|Triggers when all solution script loading procedures have completed successfully, which includes access token validation, indicating that the checkout is ready to start authentication|
|onSuccess|Triggers when the card is eligible and has successfully completed the authentication process. In this case, the CAVV, XID, and ECI variables will be returned. This data must be sent in the request at the time of authorization. In this scenario, if the transaction is authorized, the liability shift is transferred to the issuer.|
|onFailure|Triggers when the card is eligible but the authentication process failed for some reason. In this case, only the ECI variable will be returned. If there is a decision to proceed with the authorization anyway, the ECI must be sent at the time of the request. In this scenario, if the transaction is authorized, the liability shift remains with the merchant.|
|onUnenrolled|It is triggered when the card is not elegible, in other words, the cardholder and/or issuer does not support the authentication program. In this case, guide the shopper to check with the issuer if the card is enabled to perform authentication in e-commerce. Only the ECI variable is returned. If the merchant decides to proceed with the authorization, the ECI must be sent together with the authorization. If the transaction is authorized, the liability shift remains with the merchant.|
|onDisabled|Triggers when the merchant has chosen not to subject the bearer to the authentication process (class "bpmpi\_auth" as false). In this scenario, if the transaction is authorized, the liability shift remains with the merchant.|
|onError|Triggers when the authentication process has received a systemic error. In this scenario, if the transaction is authorized, the liability shift remains with the merchant.|
|onUnsupportedBrand|Triggers when card brand is not supported by 3DS 2.0|

## Description of Input Parameters

|**Parameter**|**Description**|**Type/Size**|
|---|---|---|
|Environment|Indicates the environment to use (Sandbox or Production)|SDB - Sandbox (test environment)<br>PRD - Production (production environment)|
|Debug|Boolean indicating whether debug mode is enabled or not. When true, the platform will report on the browser debug engine.|Boolean true - debug mode enabled<br>false - debug mode disabled|

**IMPORTANT!**

The JavaScript file must be saved on the server where the store application is located. To download the file, go to:

[https://bit.ly/2CSOp2n](https://bit.ly/2CSOp2n)

## Description of outputs

|**Exit**|**Description**|**Type/Size**|
|---|---|---|
|Cavv|Data representing authentication signature|Text|
|Xid|ID representing the authentication request|Text|
|Eci|E-commerce indicator code, which represents the result of authentication|Numeric [up to 2 positions]|
|Version|3DS Version Applied|Numeric [1 position] 1 - 3DS 1.02 - 3DS 2.0|
|ReferenceID|ID representing the authentication request|GUID [36 positions]|
|ReturnCode|Authentication Request Return Code|Alphanumeric [up to 5 positions]|
|ReturnMessage|Authentication Request Return Message|Alphanumeric [variable]|

### Examples for script output

**Example for event `OnSuccess`**

```json
{
  Cavv: 'Y2FyZGluYWxjb21tZXJjZWF1dGg=',
  Xid: null,
  Eci: '01',
  Version: '2',
  ReferenceId: '973cf83d-b378-43d5-84b6-ce1531475f2a'
}
```

**Example for event `OnFailure`**

```json
{
  Xid: null,
  Eci: null,
  ReturnCode: '231',
  ReturnMessage: 'Unexpected error ocurred',
  ReferenceId: null
}
```

**Example when card brand is not supported for authentication**

When tha card brand is not supported for 3DS, the MPI returns the code "MPI600" and the message *"Brand not supported for authentication".*

```json
{
  Xid: null,
  Eci: null,
  ReturnCode: 'MPI600',
  ReturnMessage: 'Brand not supported for authentication',
  ReferenceId: null
}
```

Please refer to the full list of [ReturnCodes](https://braspag.github.io//en/manualp/integration-javascript#annex){:target="_blank"} for more information. 

# Step 3 - Class Mapping

The solution provides dozens of classes that must be mapped in your HTML code.

Once the class is mapped in a given field, the script is able to retrieve the value contained in the field and submit it to compose the authentication request.

<aside class="warning">The greater the number of parameterized fields, the greater the chance of having transparent authentication, as the issuer will have greater subsidy for risk analysis</aside>

<aside class="notice">The # character indicated in the field must be replaced by a number representing the index of the item. Example: bpmpi_item_1_productName represents the name of cart item 1</aside>

| **Data category** |**Field**|**Description**|**Type/Size**|**Required**|
|---|---|---|---|---|
| **Parametrization**|`bpmpi_auth`|Boolean indicating whether the transaction is submitted to or not for the authentication process|Boolean:<br>true - submit to authentication<br>false - do not submit to authentication|Yes|
| **Parametrization**|`bpmpi_auth_notifyonly`|Boolean indicating whether the card transaction will be submitted in "notification only" mode. In this mode, the authentication process will not be triggered, however, the data will be submitted to the brand. **VALID ONLY FOR MASTERCARD CARDS**|Boolean: <br>true - notification only mode; <br>false - mode with authentication|No|
| **Parametrization**|`bpmpi_auth_suppresschallenge`|Boolean indicating whether or not to ignore the challenge when it exists. If a transaction authorized after ignoring the challenge, liability remains with the establishment. |Boolean: <br>true - ignore challenges if any; <br>false - present challenge if any|No|
| **Parametrization**|`bpmpi_accesstoken`|Token generated by the Access Token API (step 1)|Alphanumeric [variable]|Yes|
|**Order Information** |`bpmpi_ordernumber`|Order code at establishment|Alphanumeric [up to 50 positions]|Yes|
|**Order Information**|`bpmpi_currency`|Currency Code|Fixed "BRL"|Yes|
|**Order Information**|`bpmpi_totalamount`|Total transaction amount, sent in cents|Numeric [up to 15 positions]|Yes|
|**Order Information**|`bpmpi_installments`|Number of Installments|Numeric [up to 2 positions]|Yes|
|**Order Information**|`bpmpi_paymentmethod`|Type of card to be authenticated. In the case of a multiple card, you must specify either Credit or Debit|Credit - Credit<br>CardDebit - Debit Card|Yes|
|**Order Information**|`bpmpi_cardnumber`|Card Number|Numeric [up to 19 positions]|Yes|
|**Order Information**|`bpmpi_cardexpirationmonth`|Card expiration month|Numeric [2 positions]|Yes|
|**Order Information**|`bpmpi_cardexpirationyear`|Card expiration year|Numeric [4 positions]|Yes|
|**Order Information**|`bpmpi_cardalias`|Card Alias|Alphanumeric [up to 128 positions]|No|
|**Order Information**|`bpmpi_default_card`|Indicates if it is a standard customer card in store|Boolean <br>true - yes<br>false - no|No|
|**Order characteristics**|`bpmpi_recurring_enddate`|Identifies recurrence end date|Text (YYYY-MM-DD)|No|
|**Order characteristics**|`bpmpi_recurring_frequency`|Indicates frequency of recurrence|Number<br>1 - Monthly<br>2 - Bimonthly<br>3 - Quarterly<br>4 - Four-month period<br>6 - Half-yearly<br>12 - Annual|No|
|**Order characteristics**|`bpmpi_recurring_originalpurchasedate`|Identifies the date of the 1st transaction that originated the recurrence|Text (YYYY-MM-DD)|No|
|**Order characteristics**|`bpmpi_order_recurrence`|Indicates if it is an order that generates future recurrences|Boolean<br>true<br>false|No|
|**Order characteristics**| `bpmpi_order_productcode` | Product Type | **PHY**: purchase Goods<br>**CHA**: Check acceptance<br>**ACF**: Account financing<br>**QCT**: Quasi-Cash Transaction <br>**PAL**: Prepaid Activation and Load<br>| Yes |
|**Order characteristics**|`bpmpi_order_countlast24hours`|Quantity of orders placed by this shopper in the last 24h|Numeric [up to 3 positions]|No|
|**Order characteristics**|`bpmpi_order_countlast6months`|Number of orders placed by this shopper in the last 6 months|Numeric [up to 4 positions]|No|
|**Order characteristics**|`bpmpi_order_countlast1year`|Number of orders placed by this shopper in the last year|Numeric [up to 3 positions]|No|
|**Order characteristics**|`bpmpi_order_cardattemptslast24hours`|Number of same card transactions in last 24h|Numeric [up to 3 positions]|No|
|**Order characteristics**|`bpmpi_order_marketingoptin`|Indicates if the buyer has accepted to receive marketing offers|Boolean<br>true – yes<br>false – no |No|
|**Order characteristics**|`bpmpi_order_marketingsource`|Identifies the origin of the marketing campaign|Alphanumeric [up to 40 positions]|No|
|**Order characteristics**|`bpmpi_transactionMode`|Identifies the channel that originated the transaction|M: MOTO<br>R: Varejo<br>S: E-Commerce<br>P: Mobile<br>T: Tablet|No|
|**Order characteristics**|`bpmpi_merchant_url`|Establishment Website Address|Alphanumeric [100] Example: http://www.example.com|Yes|
|**Gift Card (prepaid)**|`bpmpi_giftcard_amount`|The total amount of the purchase for rounded prepaid gift cards|Numeric [up to 15 positions],<br>example: $ 125.54 = 12554|No|
|**Gift Card (prepaid)**|`bpmpi_giftcard_currency`|Prepaid Card Payment Transaction Currency Code|Fixed "BRL"|No|
|**Billing Address** |`bpmpi_billto_customerid`|Identifies the shopper CPF/CNPJ|Numeric [11 to 14 positions]<br>99999999999999|No|
|**Billing Address** |`bpmpi_billto_contactname`|Billing Address Contact Name|Alphanumeric [up to 120]|Yes|
|**Billing Address** |`bpmpi_billto_phonenumber`|Billing Address Contact Phone|Numeric [up to 15 positions], in the format: 5511999999999|Yes|
|**Billing Address** |`bpmpi_billto_email`|Billing Address Contact Email|Alphanumeric [up to 255], in the format [name@example.com] (mailto: name@example.com)|Yes|
|**Billing Address** |`bpmpi_billto_street1`|Address and Billing Address Number|Alphanumeric [up to 60]|Yes|
|**Billing Address** |`bpmpi_billto_street2`|Billing Address Supplement and Neighborhood|Alphanumeric [up to 60]|Yes|
|**Billing Address** |`bpmpi_billto_city`|Billing Address City|Alphanumeric [up to 50]|Yes|
|**Billing Address** |`bpmpi_billto_state`|Billing Address State Acronym|Text [2 positions]|Yes|
|**Billing Address** |`bpmpi_billto_zipcode`|Billing Address Zip Code|Alphanumeric [up to 8 positions], in the format: 99999999|Yes|
|**Billing Address** |`bpmpi_billto_country`|Billing Address Country|Text [2 positions] E.g: BR|Yes|
|**Shipping Address** |`bpmpi_shipto_sameasbillto`|Indicates whether to use the same address provided for billing address|Boolean<br>true<br>false|No|
|**Shipping Address** |`bpmpi_shipto_addressee`|Contact Name of Shipping Address|Alphanumeric [up to 60]|No|
|**Shipping Address** |`bpmpi_shipTo_phonenumber`|Contact address of shipping address|Numeric [up to 15 positions], in the format: 5511999999999|No|
|**Shipping Address** |`bpmpi_shipTo_email`|Shipping Address Contact Email|Alphanumeric [up to 255], in the format [name@example.com] (mailto: name@example.com)|No|
|**Shipping Address** |`bpmpi_shipTo_street1`|Address and Delivery Address Number|Alphanumeric [up to 60]|No|
|**Shipping Address** |`bpmpi_shipTo_street2`|Delivery Address Complement and Neighborhood|Alphanumeric [up to 60]|No|
|**Shipping Address** |`bpmpi_shipTo_city`|City of delivery address|Alphanumeric [up to 50]|No|
|**Shipping Address** |`bpmpi_shipTo_state`|Shipping Address State Acronym|Text [2 positions]|No|
|**Shipping Address** |`bpmpi_shipto_zipcode`|Shipping Address ZIP Code|Alphanumeric [up to 8 positions], in the format: 99999999|No|
|**Shipping Address** |`bpmpi_shipto_country`|Billing Address Country|Text [2 positions] E.g.: BR|No|
|**Shipping Address** |`bpmpi_shipTo_shippingmethod`|Shipping Method Type|LOWCOST: Economical Shipping <br> SAMEDAY: Same shipping<br> ONEDAY: Next day shipping <br> TWODAY: Two days shipping<br>THREEDAY: Three days shipping<br> PICKUP: Delivery at the store<br>OTHER: There is no shippment|No|
|**Shipping Address** |`bpmpi_shipto_firstusagedate`|Indicates the date when the shipping address was first used|Text<br>YYYY-MM-DD - Date Created|No|
|**Shopping Cart Details**|`bpmpi_cart_#_description`|Item Description|Alphanumeric [up to 255 positions]|No|
|**Shopping Cart Details**|`bpmpi_cart_#_name`|Item Name|Alphanumeric [up to 255 positions]|No|Yes||
|**Shopping Cart Details**|`bpmpi_cart_#_sku`|Item SKU|Alphanumeric [up to 255 positions]|No|
|**Shopping Cart Details**|`bpmpi_cart_#_quantity`|Item Quantity in Cart|Numeric [up to 10 positions]|No|
|**Shopping Cart Details**|`bpmpi_cart_#_unitprice`|Cart item unit value in cents|Numeric [up to 10 positions]|No|
|**User**|`bpmpi_useraccount_guest`|Indicates if the buyer is a buyer without login (guest)|Boolean<br>true – yes<br>false – no |No|
|**User**|`bpmpi_useraccount_createddate`|Indicates the date when the buyer account was created|Text<br>YYYY-MM-DD - Date Created|No|
|**User**|`bpmpi_useraccount_changeddate`|Indicates the date when the last buyer account change|Text<br>YYYY-MM-DD - date of last change|No|
|**User**|`bpmpi_useraccount_passwordchangeddate`|Indicates the date when the buyer account password was changed|Text<br>YYYY-MM-DD - Last Password Change Date|No|
|**User**|`bpmpi_useraccount_authenticationmethod`|Authentication Method of the shopper in the store|01- Does not happen authentication<br>02- Login at the own store<br>03- Login at federated ID<br>04- Login with FIDO authenticator|No|
|**User**|`bpmpi_useraccount_authenticationprotocol`|This represents the store login protocol|Alphanumeric [up to 2048 positions]|No|
|**User**|`bpmpi_useraccount_authenticationtimestamp`|The date and time the store was logged in|Text [19 positions] _YYYY-MM-ddTHH: mm: SS_|No|
|**User**|`bpmpi_merchant_newcustomer`|Identifies if a new buyer in the store|Boolean<br>true – yes<br>false – no |No|
|**Device** |`bpmpi_device_ipaddress`|Shopper's Machine IP Address|Alphanumeric [up to 45]|Conditional - required only for Visa|
|**Device** |`bpmpi_device_#_fingerprint`|Id returned by Device Finger Print|Alphanumeric [without limitation]|No|
|**Device** |`bpmpi_device_#_provider`|Device Finger Print Provider Name|Alphanumeric [up to 32 positions] cardinal<br>inauth<br>threatmetrix|No|
|**Device**|`bpmpi_device_#_channel`| Channel from which the transaction came from. Possible values:<br>-Browser<br>-SDK<br>-3RI| Alphanumeric [up to 7 positions]|Yes|
|**Recurrence**| `bpmpi_recurring_type` | Recurring payment type. | Number<br>1 - First transaction <br>2 - Subsequent transaction <br>3 - Modification <br>4-Cancellation|No|
|**Recurrence**| `bpmpi_recurring_validationIndicator` |Indicates whether the recurring payment transaction was validated or not.| Number<br>0 - Not validated <br>1 - Validated|No|
|**Recurrence**| `bpmpi_recurring_maximumAmount` |Maximum amount agreed by the cardholder.|numeric [up to 12 positions]|No|
|**Recurrence**|`bpmpi_recurring_referenceNumber`|Unique reference number for the recurring payment transaction.|Alphanumeric [up to 35 positions]|No|
|**Recurrence**| `bpmpi_recurring_occurrence`|Indicates how often a recurring payment occurs.|Number<br>01 - Daily<br>02 - Twice a week<br>03 - Weekly<br>04 - Every ten days<br>05 - Fortnightly <br>06- Monthly<br>07 - Bimonthly<br>08 - Every three months<br>09 - Every four months<br>10 - Every six months<br>11 - Annually <br>12 - Unscheduled.|No|
|**Recurrence**|`bpmpi_recurring_numberOfPayments`|Total number of payments during the recurring subscription. |Number [up to 2 positions]|No|
|**Recurrence**|`bpmpi_recurring_amountType`|Indicates the type of recurring amount agreed by the cardholder.| Supported values:<br>1 - Recurring payment of fixed value<br>2 - Recurring payment with maximum value.|No|
|**Airline**|`bpmpi_airline_travelleg _ # _ carrier`|IATA code for the stretch|Alphanumeric [2 positions]|No|
|**Airline**|`bpmpi_useraccount_createddate`|Indicates the date when the buyer account was created|Text<br>YYYY-MM-DD - Date Created|No|
|**Airline**|`bpmpi_airline_travelleg_#_origin`|IATA code of origin airport|Alphanumeric [5 positions]|No|
|**Airline**|`bpmpi_airline_travelleg_#_destination`|IATA code of destination airport|Alphanumeric [5 positions]|No|
|**Airline**|`bpmpi_airline_passenger_#_name`|Passenger Name|Alphanumeric [up to 60 positions]|No|
|**Airline**|`bpmpi_airline_passenger_#_ticketprice`|The ticket value in Numeric cents [up to 15 positions],<br>example: $ 125.54 = 12554|No|
|**Airline**|`bpmpi_airline_numberofpassengers`|Number of Passengers|Numeric [3 positions]|No|
|**Airline**|`bpmpi_airline_billto_passportcountry`|Passport country code (ISO Standard Country Codes)|Text [2 positions]|No|
|**Airline**|`bpmpi_airline_billto_passportnumber`|Passport Number|Alphanumeric [40 positions]|No|
|**Merchant-defined data**|`bpmpi_mdd1`|Extra data defined by the merchant|Alphanumeric [up to 255 positions]|No|
|**Merchant-defined data**|`bpmpi_mdd2`|Extra data defined by the merchant|Alphanumeric [up to 255 positions]|No|
|**Merchant-defined data**|`bpmpi_mdd3`|Extra data defined by the merchant|Alphanumeric [up to 255 positions]|No|
|**Merchant-defined data**|`bpmpi_mdd4`|Extra data defined by the merchant|Alphanumeric [up to 255 positions]|No|
|**Merchant-defined data**|`bpmpi_mdd5`|Extra data defined by the merchant|Alphanumeric [up to 255 positions]|No|
| **Establishment** | `bpmpi_brand_establishment_code` | Amex Establishment Code (EC) | Text [10 positions] | Required on Amex authentications |

# Step 4 - Implementing the Authentication Event Request

The event **bpmpi_Authenticate()**" must be called at checkout. See the example below:

<input type="button"onclick="bpmpi_authenticate()" />

# Test Cards

Use the **test** cards below to simulate various scenarios in the **SANDBOX** environment

## Test cards with challenge

|**CARD**|**BRAND**|**RESULT**|**DESCRIPTION**|  
|---|---|---|---|     
|4000000000001091<br>5200000000001096<br>6505290000001234|VISA<br>MASTER<br>ELO|SUCCESS|Authentication with challenge and cardholder successfully authenticated|  
|4000000000001109<br>5200000000001104<br>6505050000001109|VISA<br>MASTER<br>ELO|FAILURE|Authentication with challenge and cardholder authentication terminated with failure|  
|4000000000001117<br>5200000000001112<br>6505050000001117|VISA<br>MASTER<br>ELO|UNENROLLED|Authentication with challenge currently not available|  
|4000000000001125<br>5200000000001120<br>6505050000001125|VISA<br>MASTER<br>ELO|UNENROLLED|System error during authentication|  

## Test cards without challenge

|**CARD**|**BRAND**|**RESULT**|**DESCRIPTION**|  
|---|---|---|---|     
|4000000000001000<br>5200000000001005<br>6505050000001000|VISA<br>MASTER<br>ELO|SUCCESS|Authentication without challenge and cardholder successfully authenticated|  
|4000000000001018<br>5200000000001013<br>6505050000001018|VISA<br>MASTER<br>ELO|FAILURE|Authentication without challenge and cardholder authentication terminated with failure| 

## Authorization with Authentication

After authentication is completed, it undergoes the authorization process by submitting the authentication data in the "external authentication" (node **ExternalAuthentication**).
See more details at: [https://braspag.github.io//en/manualp/authorization-with-authentication](https://braspag.github.io//en/manualp/authorization-with-authentication){:target="_blank"}

# Last updates

To see the manual's latest updates, [click here](https://github.com/Braspag/braspag.github.io/commits/docs/_i18n/en/_posts/emv3ds/2019-09-13-integration-javascript.md){:target="_blank"}.

# ANNEX

## Reason Codes List

See the reason codes that Cybersource returns with the response.

| Reason Code |Description|
|---|---|
|     100     | Successful transaction.|
|     101     | The request is missing one or more required fields.<br> Possible action: See the response fields **missingField_0** through **missingField_N** for the missing fields. Resend the request with the complete information.
|     102     | One or more fields in the request contains invalid data. <br>Possible action: See the response fields **invalidField_0** through **invalidField_N** for the invalid fields. Resend the request with the correct information.|
|     150     | Error: General system failure.<br>Possible action: Wait a few minutes and resend the request.|
|     151     | Error: The request was received, but a server time-out occurred. This error does not include time-outs between the client and the server.<br>Possible action: Wait a few minutes and resend the request.|
|     152     | Error: The request was received, but a service time-out occurred. <br>Possible action: Wait a few minutes and resend the request.|
|     234     | A problem exists with your merchant configuration.<br>Possible action: Do not resend the request. Contact Braspag Support to correct the configuration problem.|
|     475     | The customer is enrolled in payer authentication. Authenticate the cardholder before continuing with the transaction.|
|     476     | The customer cannot be authenticated.<br> Possible action: Review the customer’s order.|
|   MPI901    |Unexpected error.|
|   MPI902    |Unexpected authentication response.|
|   MPI900    |An error has occurred.|
|   MPI601    |Challenge suppressed.|
|   MPI600    |Brand not supported for authentication.|
