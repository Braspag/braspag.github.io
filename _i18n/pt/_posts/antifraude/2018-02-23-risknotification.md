---
layout: manual
title: Risk Notification - Manual de integração
description: Integração técnica Risk Notification API Braspag
search: true
categories: manual
tags:
  - Gestão de Risco
language_tabs:
  json: JSON
  html: HTML
---

# Visão Geral

Risk Notification API foi desenvolvida pelo time de Risco da Braspag para os que clientes possam consultar alertas de fraudes, chargebacks, realizar envio de arquivos para contestação de chargebacks e acatar chargebacks.

A API é baseada em arquitetura REST, que trocam dados em formato JSON seguindo fluxos de autorização definidos pelo protocolo OAuth 2, onde todos os padrões são amplamente utilizados pelo mercado e suportado pelas comunidades técnicas.

> Para saber mais sobre OAuth 2, consulte [https://oauth.net/2/](https://oauth.net/2/)

# Objetivo

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a Risk Notification API, descrevendo as operações disponíveis com exemplos de requisições e respostas.

Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

# Hosts

## BraspagAuth API

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\authsandbox.braspag.com.br\\\|
|`Produção`|https:\\\\auth.braspag.com.br\\\|

## Risk Notification API

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\risknotificationsandbox.braspag.com.br\\\|
|`Produção`|https:\\\\risknotification.braspag.com.br\\\|

# Autenticação

## Tokens de Acesso

A Risk Notification API utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, que são: **Sandbox** e **Produção**.

Esta sessão descreve o fluxo necessário para que aplicações cliente obtenham tokens de acesso válidos para uso na API.

## Obtenção do token de acesso  

O token de acesso é obtido através do fluxo oauth **client_credentials**. O diagrama abaixo, ilustra, em ordem cronológica, a comunicação que se dá entre a **Aplicação Cliente**, a **API BraspagAuth** e a **Risk Notification API**.

1. A **Aplicação Cliente**, informa à API **BraspagAuth** sua credencial.

2. O **BraspagAuth** valida a credencial recebida. Se for válida, retorna o token de acesso para a **Aplicação Cliente**.

3. A **Aplicação Cliente** informa o token de acesso no cabeçalho das requisições HTTP feitas à **Risk Notification API**.

4. Se o token de acesso for válido, a requisição é processada e os dados são retornados para a **Aplicação Cliente**.

> Solicite uma credencial abrindo um ticket através da nossa ferramenta de suporte, enviando o(s) IP(s) de saída dos seus servidores de homologação e produção.
[Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br)

## Como obter o token

Uma vez em posse da credencial, será necessário "codificá-la" em Base64, utilizando a convenção **client_id:client_secret**, e enviar o resultado no cabeçalho através do campo **Authorization**.

Exemplo:
* client_id: **braspagtestes**
* client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* String a ser codificada em Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* Resultado após a codificação: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**

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

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido, no caso a Risk Notification API|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/>O token quando expirar, é necessário obter um novo|

# Aceitação

## Aceitando um chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|condicional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|condicional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "CaseNumber": "000001",
    "Status": 2,
    "StatusDescription": "AcceptedByMerchant"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`CaseNumber`|Número do caso do chargeback|
|`Status`|Status do chargeback - [Tabela 3 - Chargebacks{n}.Status]({{ site.baseurl_root }}manual/chargeback#tabela-4-status)|
|`StatusDescription`|Descrição do status do chargeback|

## Aceitando um chargeback inexistente

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|condicional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|condicional|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback não foi encontrado|
|`Message`|Mensagem que o chargeback não foi encontrado|

## Aceitando um chargeback aceito anteriormente

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
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
|`Code`|Código que o chargeback foi aceito ou contestado anteriomente|
|`Message`|Mensagem que o chargeback foi aceito ou contestado anteriormente|

# Contestação

## Contestando um chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

**Parâmetros no corpo (Body)**

|Key|Value|Obrigatório|
|:-|:-|:-|
|`Content-Type`|form-data <br/> Arquivo extensão jpeg, jpg ou png <br/> Obs.: A soma de todos arquivos deve ter no máximo 7mb de tamanho <br/> Obs2.: O prazo para enviar a contestação são de 7 dias corridos, ou seja, chargeback de 13/02/2019 é possível enviar a contestação até 19/02/2019|sim|

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

## Contestando um chargeback inexistente

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback não foi encontrado|
|`Message`|Mensagem que o chargeback não foi encontrado|

## Contestando um chargeback contestado anteriormente

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
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
|`Code`|Código que o chargeback foi contestado ou aceito anteriomente|
|`Message`|Mensagem que o chargeback foi contestado ou aceito anteriormente|

## Contestando um chargeback e não enviando o arquivo de contestação

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

### Response

``` json
{
    "Code": "FileNotFound",
    "Message": "File not found"
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
|`Code`|Código que não foi enviado com o arquivo de contestação|
|`Message`|Mensagem que não foi enviado com o arquivo de contestação|

## Contestando um chargeback enviando o arquivo de contestação com extensão diferente de jpeg, pfg ou png

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

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
|`Code`|Código que o arquivo de contestação foi enviado com extensão inválida, diferente de jpeg, pfg ou png|
|`Message`|Mensagem que o arquivo de contestação foi enviado com extensão inválida, diferente de jpeg, pfg ou png|

## Contestando um chargeback enviando o arquivo de contestação com tamanho maior que 7mb

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|
|`RequestId`|rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

### Response

``` json
{
    "Code": "InvalidFileLength",
    "Message": "Invalid file length"
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
|`Code`|Código que o arquivo de contestação foi enviado com tamanho superior a 7mb|
|`Message`|Mensagem que o arquivo de contestação foi enviado com tamanho superior a 7mb|

# Consultas

### Request

<aside class="request"><span class="method get">GET</span><span class="endpoint">Chargeback?StartDate={StartDate}&EndDate={EndDate}&PageIndex={PageIndex}&PageSize={PageSize}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
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