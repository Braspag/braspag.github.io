---
layout: manual
title: Manual de integração Verify Card
description: Integração técnica Gateway Braspag
search: true
translated: true
categories: manual
tags:
  - Pagador
language_tabs:
  json: JSON
  shell: cURL
  html: HTML
---

# Consultando dados de um cartão via Zero Auth e Consulta BIN

Para consultar dados de um cartão, é necessário fazer um POST no serviço VerifyCard. O VerifyCard é composto por dois serviços: Zero Auth e Consulta BIN. O Zero Auth é um serviço que indentifica se um cartão é válido ou não, através de uma operação semelhante a uma autorização, porém com valor de R$ 0,00. A Consulta BIN é um serviço disponível para clientes Cielo 3.0 que retorna as características do BIN tais como bandeira e tipo do cartão, a partir do BIN (6 primeiros dígitos do cartão). Os dois serviços podem ser consumidos simultaneamente através do VerifyCard, conforme o exemplo baixo. Também é possível que o processo de autorização seja condicionado automaticamente a um retorno de sucesso do ZeroAuth. Para habilitar este fluxo, por favor, entre em contato com nosso time de suporte.

## Requisição

<aside class="request"><span class="method get">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
   "Provider":"Cielo30",
   "Card" :
   {
       "CardNumber":"999999******9999",
       "Holder":"Joao da Silva",
       "ExpirationDate":"03/2026",
       "SecurityCode":"***",
       "Brand":"Visa",
       "Type":"CreditCard",
       "CardToken":""
   }
}
```

```shell
curl
--request GET "https://apihomolog.braspag.com.br/v2/verifycard"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
{
   "Provider":"Cielo30",
   "Card" :
   {
       "CardNumber":"999999******9999",
       "Holder":"Joao da Silva",
       "ExpirationDate":"03/2026",
       "SecurityCode":"***",
       "Brand":"Visa",
       "Type":"CreditCard",
       "CardToken":""
   }
}
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave Publica para Autenticação Dupla na Braspag|
|`RequestId`|Guid|36|Não|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Card.CardNumber`|Texto|16|Sim|Número do Cartão do comprador para Zero Auth e Consulta BIN. Caso seja uma somente requisição de Consulta BIN, enviar somente o BIN|
|`Card.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`Card.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`Card.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`Card.Brand`|Texto|10|Sim |Bandeira do cartão|
|`Card.Type`|Texto|CreditCard ou DebitCard|Sim|Tipo do cartão a ser consultado. Este campo é particularmente importante devido aos cartões com funções múltiplas.|
|`Card.CardToken`|Guid|36|Não|Token do Cartão Protegido. Caso seja enviado o token, não é necessário enviar os dados do cartão.|

## Resposta

```json
{
    "Status": 1,
    "ProviderReturnCode": "85",
    "ProviderReturnMessage": "Transacao autorizada",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada"
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "Status": 1,
    "ProviderReturnCode": "85",
    "ProviderReturnMessage": "Transacao autorizada",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada"
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`Status`|Status do Zero Auth|Número|1 |<UL><LI>0-Consulta Zero Auth com sucesso</LI><LI>1-Falha na consulta ao Zero Auth</LI><LI>99-Consulta com sucesso, porém o status do cartão é inconclusivo</LI></UL> |
|`ProviderReturnCode`|Código da consulta Zero Auth retornado pelo provedor. |Número|2|Esse é o mesmo código retornado pelo provedor durante uma autorização padrão. Ex: código 82-cartão inválido|
|`ProviderReturnMessage`|Mensagem da consulta Zero Auth retornado pelo provedor. |Texto|512 |Ex. "Transacao Autorizada"|
|`BinData.Provider`|Provedor do serviço|Texto|15 |Ex. Cielo30|
|`BinData.CardType`|Tipo do Cartão retornado da Consulta BIN|Texto|15 |Ex. Crédito, Débito ou Múltiplo|
|`BinData.ForeignCard`|Indicação se é um cartão emitido fora do Brasil|booleano|- |Ex. true ou false |
|`BinData.Code`|Código de retorno da Consulta BIN|Número|2 |Ex. Para provedor Cielo30, 00 significa consulta realizada com sucesso.  |
|`BinData.Message`|Mensagem de retorno da Consulta BIN |Texto|512 |Ex. Para provedor Cielo30, "Analise autorizada" significa consulta realizada com sucesso. |
