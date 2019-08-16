---
layout: manual
title: Risk Notification - Integration Manual
description: Technical integration API Risk Notification Braspag
search: true
categories: manual
tags:
  - Risk Management
language_tabs:
  json: JSON    
---

# Overview

**Risk Notification API** was developed by Braspag's Risk team for clients to consult fraud alerts, chargebacks, submit files for chargeback contestation and accept chargebacks.

The API is based on REST architecture, which exchange data in JSON format following authorization flows defined by the OAuth 2 protocol, where all standards are widely used by the industry and supported by the technical communities.

> To learn more about OAuth 2, see [https://oauth.net/2/](https://oauth.net/2/)

# Objective

The purpose of this documentation is to guide the developer on how to integrate with the Risk Notification API by describing the operations available with examples of requests and responses.

To perform an operation, combine the base endpoint of the environment with the endpoint of the desired operation and send using the HTTP VERB as described in the operation.

# Hosts

## BraspagAuth API

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\authsandbox.braspag.com.br\\\|
|`Produção`|https:\\\\auth.braspag.com.br\\\|

## Chargeback API Braspag

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\risknotificationsandbox.braspag.com.br\\\|
|`Produção`|https:\\\\risknotification.braspag.com.br\\\|

# Authentication

## Access Token

Risk Notification API Braspag uses the industry standard OAuth 2.0 protocol to authorize access to its environment-specific resources, which are: **Sandbox** and **Production**.

This session describes the flow required for client applications to obtain valid access tokens for use in the API.

## Obtaining the access token  

The access token is obtained through the oauth **client_credentials**. The diagram below illustrates, in chronological order, the communication between **Client Application**, **BraspagAuth API** and **Risk Notification API**.

1. The **Client Application**, informs the **BraspagAuth API** your credential.

2. The **BraspagAuth API** validates the credential received. If valid, returns the access token for **Client Application**.

3. The **Client Application** informs the access token in the header of the HTTP requests made to the **Risk Notification API**.

4. If the access token is valid, the request is processed and the data is returned to the **Client Application**

> Request a credential by opening a ticket through our support tool, sending the exit IP (s) of your homologation and production servers. <br/>
[Support Braspag](https://suporte.braspag.com.br/hc/en-us)

## How to get the token

Once in possession of the credential, you will need to "encrypt" it in Base64, using the **client_id:client_secret** convention, and send the result in the header through the **Authorization** field.

Exemple:
* client_id: **braspagtestes**
* client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* String to be encoded in Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* Result after encoding: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no corpo (Body)**

|Key|Value|
|:-|:-|
|`scope`|ChargebackApp|
|`grant_type`|client_credentials|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

**Parameters in the body (Body)**

|Parameter|Description|
|:-|:-|
|`access_token`|The access token requested. The application can use this token to authenticate itself to the protected resource, in this case the Antifraud Gateway API|
|`token_type`|Indicates the value of the token type|
|`expires_in`|Expiry of the access token, in seconds <br/> The token when it expires, it is necessary to get a new one|

# Acceptance

## Accepting a chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "CaseNumber": "000001",
    "Status": 2,
    "StatusDescription": "AcceptedByMerchant"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`CaseNumber`|Chargeback case number|
|`Status`|Chargeback status - [Table 3 - Chargebacks{n}.Status]({{ site.baseurl_root }}manual/chargeback#table-4-status)|
|`StatusDescription`|Chargeback status description|

## Accepting a nonexistent chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was not found|
|`Message`|Message that chargeback was not found|

## Accepting a previously accepted or contested chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was previously accepted or contested|
|`Message`|Message that chargeback was previously accepted or contested|

# Contestation

## Contesting a chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

**Parameters in the body (Body)**

|Key|Value|Obrigatório|
|:-|:-|:-|
|`Content-Type`|form-data||
||Arquivo extensão tif <br/> Obs.: O arquivo deve possuir como nome o número do caso do chargeback <br/> Ex.: `CaseNumber` = 0000001 -> `File` = 0000001.tif <br/> Obs2.: O arquivo deverá ser multi-page com extensão tif de no máximo 7mb de tamanho <br/> Obs3.: O prazo para enviar a contestação são de 7 dias corridos, ou seja, chargeback de 13/02/2019 é possível enviar a contestação até 19/02/2019|Sim|

### Response

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

## Contesting a nonexistent chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was not found|
|`Message`|Message that chargeback was not found|

## Contesting a previously contested or accepted chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that chargeback was previously contested or accepted|
|`Message`|Message that chargeback was previously contested or accepted|

## Contesting a chargeback and not sending the contestation files

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "FileNotFound",
    "Message": "File not found"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parameters in the body (Body)**

|Key|Value|
|:-|:-|
|`Code`|Code that contestation file was not sent|
|`Message`|Message that contestation file was not sent|

## Contesting a chargeback by submitting the contestation file with an extension different than jpeg, jpg or png

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "InvalidFileExtension",
    "Message": "Invalid file extension"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Code that the contestation file was sent with an invalid extension, different than jpeg, jpg or png|
|`Message`|Message that the contestation file was sent with an invalid extension, different than jpeg, jpg or png|

## Contesting a chargeback by submitting contest files larger than 7mb

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parameters in the header (Header)**

|Key|Value|Description|Required|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Request content type|yes|
|`Authorization`|Bearer {access_token}|Authorization type|yes|
|`EstablishmentCode`|xxxxxxxxxx|Establishment Code <br/> Note: If this Key was not sent, `MerchantId` must be sent|conditional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|MerchantID <br/> Note: If this Key was not sent, `EstablishmentCode` must be sent|conditional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Request identifier|yes|

**Parameters in the querystring**

|Parameter|Description|Required|
|:-|:-|:-:|
|`CaseNumber`|Chargeback related case number|yes|

### Response

``` json
{
    "Code": "InvalidFileLength",
    "Message": "Invalid file length"
}
```

**Parameters in the header (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Code that contest files exceeded 7mb in size|
|`Message`|Message that contest files exceeded 7mb in size|

# Queries

### Request

<aside class="request"><span class="method get">GET</span><span class="endpoint">Chargeback?StartDate={StartDate}&EndDate={EndDate}&PageIndex={PageIndex}&PageSize={PageSize}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`StartDate`|Data início da consulta|sim|
|`EndDate`|Data fim da consulta|sim|
|`PageIndex`|Número da página desejada|sim|
|`PageSize`|Quantidade de itens desejado na página. Máximo 250 itens.|sim|
|`MerchantIds`|Id(s) da(s) loja(s) a ser utilizado na consulta <br/> Obs.: Caso não seja enviado, a consulta será realizada levando em consideração o(s) MerchantId(s) associado(s) ao ClientId|não|
|`EstablishmentCodes`|Número(s) do(s) estabelecimento(s) ou afiliação(ões) na adquirente a ser utilizado na consulta <br/> Obs.: Caso não seja enviado, a consulta será realizada levando em consideração o(s) número(s) do(s) estabelecimento(s) ou afiliação(ões) na adquirente associado(s) ao ClientId|não|
|`CaseNumber`|Número do caso do chargeback|não|
|`AcquirerTransactionId`|Identificador da transação na adquirente (TID)|não|
|`BraspagTransactionId`|Id da transação na plataforma Pagador Braspag ou Cielo 3.0 (PaymentId)|não|

### Response

```json
{
    "PageIndex": 1,
    "PageSize": 250,
    "Total": 500,
    "Chargebacks":
    [
        {
            "Id": "fd14e3fb-cf2a-4228-b690-1338660afc54",
            "CreatedDate": "2018-09-01 09:51:25",
            "Date": "2018-08-30",
            "CaseNumber": "000001",
            "Amount": 10000,
            "ReasonCode": "28",
            "ReasonMessage": "Consumidor nao reconhece a compra",
            "Status": "Received",
            "Comment": "Cliente enviou documentos inválidos",
            "IsFraud": true,
            "Transaction":
            {
                "AcquirerType": "Cielo",
                "EstablishmentCode": "1234567890",
                "MerchantOrderId": "abc123efg",
                "Tid": "1234567890BA2018XPTO",
                "Nsu": "258654",
                "AuthorizationCode": "T85245",
                "SaleDate": "2018-08-15",
                "PagadorMerchantId": "a1052460-92b2-49c3-a929-fc985df0ba2f",
                "BraspagTransactionId": "bb33b5c5-82fe-4254-9f1d-b9c97297b0d5",
                "Amount": 10000,
                "CardHolder": "JOAO D COUVES",
                "MaskedCardNumber": "453906******8385",
                "Brand": "Visa",
                "AntifraudMerchantId": "4b1b017a-a8b5-4e83-ae36-19c69f11845e",
                "AntifraudTransactionId": "9f6ec028-b55d-4605-b655-164ce62aeaef",
                "AntifraudSourceApplication": "Gateway",
                "ProviderTransactionId": "5446494501496896403073",
                "NegativeValues": [
                    "CustomerDocumentNumber",
                    "ShippingStreet"
                ], 
                "ProviderChargebackMarkingEvent": {
                    "Id": "5446495589216876903021",
                    "Status": "ACCEPT",
                    "Code": "100",
                }
            }
        }
    ]
}
```

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`Id`|Id do chargeback na Chargeback API Braspag|guid|
|`CreatedDate`|Data de criação do chargeback na Chargeback API Braspag <br/> Ex.: 2018-09-01 09:51:25|date|
|`Date`|Data do chargeback <br/> Ex.: 2018-08-30|date|
|`CaseNumber`|Número do caso relacionado ao chargeback|guid|
|`Amount`|Valor do chargeback em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`ReasonCode`|Código do motivo do chargeback|string|
|`ReasonMessage`|Descrição do motivo do chargeback|string|
|`Status`|Status do charegabck na Braspag - [Tabela 3]({{ site.baseurl_root }}manual/chargeback#tabela-3-chargebacks[n].status)|string|
|`Comment`|Comentário que deseja associar ao chargeback e que ficará visível no Backoffice Braspag <br/> Se chargeback de transação Cybersource, este comentário ficará visível no backoffice da Cybersource|string|
|`IsFraud`|Identifica se o chargeback é de fraude|bool|
|`Transaction.AcquirerType`|Identificador da adquirentre|string|
|`Transaction.EstablishmentCode`|Número do estabelecimento ou afiliação na adquirente|string|
|`Transaction.MerchantOrderId`|Número do pedido da loja|string|
|`Transaction.Tid`|Id da transação na adquirente|string|
|`Transaction.Nsu`|Número sequencial único da transação na adquirente|string|
|`Transaction.AuthorizationCode`|Código de autorização da transação na adquirente|string|
|`Transaction.SaleDate`|Data da autorização da transação na adquirente <br/> Ex.: 2018-08-15|date|
|`Transaction.PagadorMerchantId`|Identificador da loja na plataforma Pagador Braspag ou Cielo 3.0|guid|
|`Transaction.BraspagTransactionId`|Id da transação na plataforma Pagador Braspag ou Cielo 3.0 (PaymentId)|guid|
|`Transaction.Amount`|Valor da transação em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`Transaction.CardHolder`|Nome do cartão de crédito|string|
|`Transaction.MaskedCardNumber`|Número do cartão de crédito mascarado|string|
|`Transaction.Brand`|Bandeira do cartão de crédito|string|
|`Transaction.AntifraudMerchantId`|Identificador da loja na plataforma Antifraude Legado ou Antifraude Gateway|guid|
|`Transaction.AntifraudTransactionId`|Identificador da transação na plataforma Antifraude Legado ou Antifraude Gateway|guid|
|`Transaction.AntifraudSourceApplication`|Origem da plataforma de antifraude - [Tabela 6]({{ site.baseurl_root }}manual/chargeback#tabela-6-chargebacks[n].transaction.antifraudsourceapplication)|string|
|`Transaction.ProviderTransactionId`|Id da transação no provedor de antifraude|
|`Transaction.NegativeValues`|Parâmetros que foram incluídos na lista negativa quando transação de antifraude for Cybersource <br/> Os parâmetros são concatenados usando o caracter , <br/> Ex.: CustomerDocumentNumber, ShippingStreet <br> - [Tabela 1]({{ site.baseurl_root }}manual/chargeback#tabela-1-chargebacks[n].negativevalues)|string|
|`Transaction.ProviderChargebackMarkingEvent.Id`|Id do evento de marcação da transação que sofreu o chargeback. Apenas Cybersource|string|
|`Transaction.ProviderChargebackMarkingEvent.Status`|Status do evento de marcação da transação que chargeback. Apenas Cybersource - [Tabela 4]({{ site.baseurl_root }}manual/chargeback#tabela-4-chargebacks[n].transaction.providerchargebackmarkingevent.status)|string|
|`Transaction.ProviderChargebackMarkingEvent.Code`|Código de retorno do evento de marcação da transação que sofreu chargeback. Apenas Cybersouce - [Tabela 5]({{ site.baseurl_root }}manual/chargeback#tabela-5-chargebacks[n].transaction.providerchargebackmarkingevent.code)|string|

# Tabelas

## Tabela 1 - Chargebacks[n].NegativeValues

Possíveis valores a serem inseridos na lista negativa na Cybersource.

|Valor|Descrição|
|:-|:-|
|CustomerDocumentNumber|Número do documento do comprador, CPF ou CNPJ|
|CustomerIpAddress|Endereço de IP do comprador|
|CustomerPhone|Número de telefone do comprador|
|ShippingStreet|Logradouro do endereço de entrega|
|DeviceFingerprintSmartId|Fingerprint do dispositivo do comprador|

## Tabela 2 - Result.ProcessingStatus

Possíveis retornos do chargeback enviado.

|Valor|Descrição|
|:-|:-|
|AlreadyExist|Transação já marcada com chargeback anteriormente|
|Remand|Chargeback deverá ser reenviado|
|NotFound|Transação na encontrada na base de dados para os valores enviados nos campos do nó `Transaction`|

## Tabela 3 - Chargebacks[n].Status

Possíveis valores do chargeback.

|Valor|Descrição|
|:-|:-|
|Received|Chargeback recebido da adquirente|
|AcceptedByMerchant|Chargeback aceito pela loja. Neste caso a loja entende que sofreu de fato um chargeback e não irá realizar a disputa|
|ContestedByMerchant|Chargeback contestado pela loja. Neste caso a loja enviou os documentos necessários para tentar reverter o chargeback|

## Tabela 4 - Chargebacks[n].Transaction.ProviderChargebackMarkingEvent.Status

|Valor|Descrição|Provider|
|:-|:-|:-|
|ACCEPT|Marcação de chargeback aceita no provedor|Cybersource|
|REJECT|Marcação de chargeback rejeitada no provedor|Cybesource|

## Tabela 5 - Chargebacks[n].Transaction.ProviderChargebackMarkingEvent.Code

|Valor|Descrição|Provider|
|:-|:-|:-|
|100|Operação realizada com sucesso|Cybersource|
|150|Erro interno <br/> Possível ação: Aguarde alguns minutos e tente reenviar a marcação de chargeback|Cybersource|
|151|A marcação de chargeback foi recebida, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor <br/> Possível ação: Aguarde alguns minutos e tente reenviar|Cybersource|
|152|A marcação de chargeback foi recebida, mas ocorreu time-out <br/> Possível ação: Aguarde alguns minutos e tente reenviar|Cybersource|
|234|Problema com a configuração da loja na Cybersource <br/> Possível ação: Entre em contato com o suporte para corrigir o problema de configuração|Cybersource|

## Tabela 6 - Chargebacks[n].Transaction.AntifraudSourceApplication

|Valor|Descrição|Provider|
|:-|:-|
|Gateway|Antifraude Gateway|
|Legacy|Antifraude Legado|

# Matriz

## Matriz 1 - Documentos

|Segmento\Motivo|Documentos Padrão|Portador não Reconhece a Transação|Mercadoria não Recebida|Serviços não Prestados|Mercadoria com Defeito/Não Confere|Crédito Não Processado|Processamento Duplicado/Pagamentos por Outros Meios|
|Locadora de Veículos|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular)<br/> 3) Nota fiscal <br/> 4) Contrato de locação devidamente assinado constando política de seguro <br/> 5) Documento de assinatura em arquivo (autorização débito)|6) Notificação de infração de trânsito paga (se houver) <br/> 7) Termo de responsabilidade (danos futuros) <br/> 8) Boletim de ocorrência (se houver) <br/> 9) Três orçamentos para reparos em caso de acidentes e danos ao veículo (se houver) <br/> 10) Aviso prévio ao portador das cobranças de avarias/multas|-|6) Comprovante de checkout|-|6) Política de cancelamento|6) Dois ou mais comprovantes comprovando que houve duas ou mais transações, informar o código de autorização das duas transações|
|Hotéis|1)Cópia do comprovante de venda <br/> 2) Cadastro do portador (nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota Fiscal <br/> 4) Documento de assinatura em arquivo (autorização débito)|5) Descritivo dos serviços prestados (chekin e checkout)|-|5) Descritivo dos serviços prestados (chekin e checkout)|-|5) Política de cancelamento (no show) com a cópia da tela de opção de cancelamento no site pelo portador comprovando a data|5) Dois ou mais comprovantes comprovando que houve duas ou mais transações, informar o código de autorização das duas transações|
|Agência de Turismo|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (Nome do titular do cartão, Nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota fiscal <br/> 4) Contrato prestação de serviço de viagens (se houver)|5) Documento oficial que comprove a identidade do portador (frente e verso) <br/> 6) Documento de assinatura em arquivo (autorização débito)|-|5) Cópia dos bilhetes/voucher's emitidos|-|5) Política de cancelamento|5) Dois ou mais comprovantes comprovando que houve duas ou mais transações, informar o código de autorização das duas transações|
|Cias Aéreas|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota fiscal <br/> 4) Contrato prestação de serviço de viagens (se houver)|5) Documento oficial que comprove a identidade do portador (frente e verso) <br/> 6) Documento de assinatura em arquivo (autorização débito)|-|5) Cópia dos bilhetes/voucher's emitidos <br/> 6) Checkin (se houver)|-|5) Política de cancelamento|5) Dois ou mais comprovantes comprovando que houve duas ou mais transações, informar o código de autorização das duas transações|
|Serviço de Processamento de Dados <br/> Serviços Online|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota fiscal <br/> 4) Autorização débito <br/> 5) Pedido da compra para transações via internet <br/> 6) Cópia da tela com os dados do meio de pagamento|7) Descritivo dos serviços prestados <br/> 8) Cadastro do portador (Nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular|-|7) Contrato com detalhes da prestação de serviços <br/> 8) Protocolo dos serviços prestados|-|-|-|
|Supermercado ou Varejo|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (ome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota fiscal <br/> 4) Autorização débito <br/> 5) Pedido da compra para transações via internet <br/> 6) Cópia da tela com os dados do meio de pagamento|7) Descritivo dos serviços prestados|7) Comprovação da entrega do produto e/ou protocolo assinado <br/> 8) Aceite eletrônico (se houver)|7) Contrato com detalhes da prestação de serviços <br/> 8) Protocolo do serviços prestados|7) Política de devolução e troca com aceite eletrônico (se houver)|7) Política de cancelamento|7) Dois ou mais comprovantes comprovando que houve duas ou mais transações, informar o código de autorização das duas transações|
|Ingressos|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (Nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota fiscal <br/> 4) Autorização débito <br/> 5) Pedido da compra para transações via internet <br/> 6) Cópia da tela com os dados do meio de pagamento|-|7) Comprovação da entrega do produto e/ou protocolo assinado <br/> 8) Aceite eletrônico (se houver)|-|7) Política de devolução e troca com aceite eletrônico (se houver)|-|-|
|Editora ou Livraria|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (Nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo /celular) <br/> 3) Nota fiscal <br/> 4) Autorização débito <br/> 5) Pedido da compra para transações via internet <br/> 6) Cópia da tela com os dados do meio de pagamento|-|7) Comprovação da entrega do produto e/ou protocolo assinado <br/> 8) Aceite eletrônico (se houver)|-|7) Política de devolução e troca com aceite eletrônico (se houver)|-|-|
|Cias de Seguros|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota fiscal <br/> 4) Autorização débito <br/> 5) Pedido da compra para transações via internet <br/> 6) Cópia da tela com os dados do meio de pagamento|-|-|7) Política de devolução e troca com aceite eletrônico (se houver)|-|-|
|Demais Segmentos|1) Cópia do comprovante de venda <br/> 2) Cadastro do portador (nome do titular do cartão, nome cadastrado no site, CPF, e-mail, endereço, telefone fixo/celular) <br/> 3) Nota fiscal <br/> 4) Autorização débito <br/> 5) Pedido da compra para transações via internet <br/> 6) Cópia da tela com os dados do meio de pagamento|7) Comprovação da entrega do produto e/ou protocolo assinado <br/> 8) Carta do verdadeiro portador reconhecendo a despesa|7) Comprovação da entrega do produto e/ou protocolo assinado <br/> 8) Aceite eletrônico (se houver)|7) Contrato com detalhes da prestação de serviços <br/> 8) Protocolo dos serviços prestados|7) Política de devolução e troca com aceite eletrônico (se houver)|7) Política de cancelamento|7) Dois ou mais comprovantes comprovando que houve duas ou mais transações, informar o código de autorização das duas transações|