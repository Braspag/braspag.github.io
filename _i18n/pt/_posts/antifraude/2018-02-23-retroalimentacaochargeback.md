---
layout: manual
title: Retroalimentação de Chargeback - Manual de integração
description: Integração técnica API Retroalimentação de Chargeback Braspag
search: true
categories: manual
tags:
  - Gestão de Risco
language_tabs:
  json: JSON
  html: HTML
---

# Visão Geral

Retroalimentação de Chargeback é uma API desenvolvida pelo time de Risco da Braspag para que os clientes informarem os chargebacks de transações analisadas proporcionando um maior índice de assertividade em análises futuras.

A API é baseada em arquitetura REST, que trocam dados em formato JSON seguindo fluxos de autorização definidos pelo protocolo OAuth 2, onde todos os padrões são amplamente utilizados pelo mercado e suportado pelas comunidades técnicas.

> Para saber mais sobre OAuth 2, consulte [https://oauth.net/2/](https://oauth.net/2/)

# Objetivo

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a API Retroalimentação de Chargeback Braspag, descrevendo as operações disponíveis com exemplos de requisições e respostas.

Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

# Hosts

## API BraspagAuth

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\authhomolog.braspag.com.br|
|`Produção`|https:\\\\auth.braspag.com.br|

## API Retroalimentação de Chargeback

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\chargebacksandbox.braspag.com.br|
|`Produção`|https:\\\\chargeback.braspag.com.br|

# Autenticação

## Tokens de Acesso

A API Retroalimentação de Charegabck Braspag utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, que são: **Sandbox** e **Produção**.

Esta sessão descreve o fluxo necessário para que aplicações cliente obtenham tokens de acesso válidos para uso na API.

## Obtenção do token de acesso  

O token de acesso é obtido através do fluxo oauth **client_credentials**. O diagrama abaixo, ilustra, em ordem cronológica, a comunicação que se dá entre a **Aplicação Cliente**, a **API BraspagAuth** e a **API Retroalimentação de Chargeback**.

1. A **Aplicação Cliente**, informa à API **BraspagAuth** sua credencial.

2. O **BraspagAuth** valida a credencial recebida. Se for válida, retorna o token de acesso para a **Aplicação Cliente**.

3. A **Aplicação Cliente** informa o token de acesso no cabeçalho das requisições HTTP feitas à **API Retroalimentação de Charegack**.

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
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido, no caso a API Retroalimentação de Chargeback|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/>O token quando expirar, é necessário obter um novo|

# Retroalimentando chargeback via API

### Request

<aside class="request"><span class="method post">POST</span><span class="endpoint">chargeback</span></aside>

``` json
{
   "Chargebacks":
   [
      {
         "Amount": "1000",
         "Date": "2017-12-02",
         "Comment": "Esta transação sofreu chargeback relacionada a não reconhecimento de compra por parte do portador do cartão.",
         "ReasonCode": "123",
         "ReasonMessage": "DEB NAO REC DE COMPRA",
         "IsFraud": "true"
         "NegativeValues":
         [
            "CustomerEmail",
            "CardNumber"
         ],
         "Transaction":
         {
            "Id" : "fb647240-824f-e711-93ff-000d3ac03bed",
            "Tid": "123456789012345678AB",
            "Nsu": "12345678",
            "AuthorizationCode": "123456",
            "SaleDate": "2017-10-15",
            "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
         }
      }
   ]
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`Chargebacks[n].Amount`|Valor do chargeback <br/> Ex.: 150000 Ex: 123456 = r$ 1.234,56|long|sim|-|
|`Chargebacks[n].Date`|Data da confirmação do chargeback <br/> Ex.: 2017-12-02|date|sim|-|
|`Chargebacks[n].Comment`|Comentário que deseja associar ao chargeback que ficará visível no Admin Braspag <br/> Se chargeback de transação Cybersource, este comentário ficará visível no backoffice da Cybersource|string|não|512|
|`Chargebacks[n].ReasonCode`|Código do motivo do chargeback|string|sim|8|
|`Chargebacks[n].ReasonMessage`|Mensagem do motivo do chargeback|string|sim|128|
|`Chargebacks[n].IsFraud`|Identifica se o chargeback foi por motivo de fraude|bool|não|-|
|`Chargebacks[n].NegativeValues`|Parâmetros que deseja incluir na lista negativa <br/> Os parâmetros que serão incluídos devem ser acordados com o analista de risco da Cybersource, pois pode impactar diretamente na estratégia de risco - [Tabela 1](https://braspag.github.io//manual/retroalimentacaochargeback#tabela-1)|enum|não|-|
|`Chargebacks[n].Transaction.Id`|Id da transação no Antifraude <br/> Este campo se torna obrigatório se o campo `BraspagTransactionId` não for enviado e se os campos `Tid`, `Nsu`, `AuthorizationCode` e `SaleDate` (todos juntos) não forem enviados|Guid|não|-|
|`Chargebacks[n].Transaction.Tid`|Identificador da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Nsu`, `AuthorizationCode` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|20|
|`Chargebacks[n].Transaction.Nsu`|Número sequencial único da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Tid`, `AuthorizationCode` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|10|
|`Chargebacks[n].Transaction.AuthorizationCode`|Código de autorização da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Tid`, `Nsu` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|10|
|`Chargebacks[n].Transaction.SaleDate`|Data da venda da transação <br/> Ex.: 2017-10-15 <br/> Este campo se torna obrigatório juntamente com `Tid`, `Nsu` e `AuthorizationCode` se os campos `Id` e `BraspagTransactionId` não forem enviados|date|não|-|

### Response

``` json
{
   "Chargebacks":
   [
      {
         "Amount": "1000",
         "Date": "2017-12-02",
         "Comment": "Esta transação sofreu chargeback relacionada a não reconhecimento de compra por parte do portador do cartão.",
         "ReasonCode": "123",
         "ReasonMessage": "DEB NAO REC DE COMPRA",
         "IsFraud": "true"
         "NegativeValues":
         [
            "CustomerEmail",
            "CardNumber"
         ],
         "Transaction":
         {
            "Id" : "fb647240-824f-e711-93ff-000d3ac03bed",
            "Tid": "123456789012345678AB",
            "Nsu": "12345678",
            "AuthorizationCode": "123456",
            "SaleDate": "2017-10-15",
            "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
         },
         "Result":
         {
            "ProcessingStatus": "Success",
            "": ""
         }
      }
   ]
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|300 Multiple Choices|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|`Result.ProcessingStatus`|Status do processamento do chargeback - [Tabela 2](https://braspag.github.io//manual/retroalimentacaochargeback#tabela-2)|enum|
|`Result.ErrorMessages`|Mensagens de erro para chargebacks não processados|string|

# Retroalimentando chargeback via Admin Braspag



# Tabelas

## Tabela 1

Possíveis valores a serem inseridos na lista negativa na Cybersource.

|Valor|Descrição|
|CardNumber|Número do cartão|
|CustomerDocumentNumber|Número do documento do comprador, CPF ou CNPJ|
|CustomerEmail|E-mail do comprador|
|CustomerIpAddress|Endereço de IP do comprador|
|CustomerPhone|Número de telefone do comprador|
|ShippingStreet|Logradouro do endereço de entrega|
|DeviceFingerprint|Fingerprint do dispositivo do comprador|
|DeviceFingerprintSmartId|Fingerprint do dispositivo do comprador|

## Tabela 2

Possíveis retornos do chargeback enviado.

|Valor|Descrição|
|Success|Chargeback foi processado com sucesso|
|AlreadyExist|Transação já marcada com chargeback anteriormente|
|Remand|Chargeback deverá ser reenviado|
|NotFound|Transação na encontrada na base de dados para os valores enviados nos campos do nó Transaction|