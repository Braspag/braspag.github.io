---
layout: manual
title: Manual de Integração - Verify Card
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
tags:
  - 1. API do Pagador
language_tabs:
  json: JSON
  shell: cURL
  html: HTML
---

# Consultando Dados de um Cartão via Zero Auth e Consulta BIN

 O *VerifyCard* é composto por dois serviços: **Zero Auth** e **Consulta BIN**.<br/>O Zero Auth é um serviço que identifica se um cartão é válido ou não, através de uma operação semelhante a uma autorização, porém com valor de R$ 0,00.<br/>A Consulta BIN é um serviço disponível para clientes Cielo 3.0 que retorna as características do BIN tais como bandeira e tipo do cartão, a partir do BIN (6 primeiros dígitos do cartão).<br/>Os dois serviços podem ser consumidos simultaneamente através do VerifyCard, conforme o exemplo abaixo. Também é possível que o processo de autorização seja condicionado automaticamente a um retorno de sucesso do ZeroAuth. Para habilitar este fluxo, por favor, entre em contato com nosso time de suporte.
 
Para consultar dados de um cartão, é necessário enviar requisição utilizando o VERBO HTTP POST no serviço *VerifyCard*, de acordo com o modelo a seguir:

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
       "Type":"CreditCard"
   }
}
```

```shell
curl
--request GET "https://apisandbox.braspag.com.br/v2/verifycard"
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
       "Type":"CreditCard"
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|Guid|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`Payment.Provider`|Nome da provedora de meio de pagamento.|Texto|15|Sim|
|`Card.CardNumber`|Número do cartão do comprador para Zero Auth e Consulta BIN. Caso seja somente requisição de Consulta BIN, enviar somente o BIN (de 6 ou 9 dígitos).|Texto|16|Sim|
|`Card.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`Card.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`Card.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`Card.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`Card.Type`|Tipo do cartão a ser consultado. Este campo é particularmente importante devido aos cartões com funções múltiplas.|Texto|CreditCard ou DebitCard|Sim|

## Resposta

```json
{
    "Status": 1,
    "ProviderReturnCode": "00",
    "ProviderReturnMessage": "Transacao autorizada",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada",
        "CorporateCard": false,
        "Issuer": "Banco da Praça",
        "IssuerCode": "001"
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "Status": 1,
    "ProviderReturnCode": "00",
    "ProviderReturnMessage": "Transacao autorizada",
    "BinData": {
        "Provider": "Master",
        "CardType": "Crédito",
        "ForeignCard": false,
        "Code": "00",
        "Message": "Analise autorizada",
        "CorporateCard": false,
        "Issuer": "Banco da Praça",
        "IssuerCode": "000"
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`Status`|Status do Zero Auth.|Número|1 |"0" - Falha na consulta ao Zero Auth<br/>"1" - Consulta Zero Auth com sucesso<br/>"99" - Consulta com sucesso, porém o status do cartão é inconclusivo|
|`ProviderReturnCode`|Código da consulta Zero Auth retornado pelo provedor.|Número|2|Esse é o mesmo código retornado pelo provedor durante uma autorização padrão. Ex.: "82" - cartão inválido (para provedor Cielo30)|
|`ProviderReturnMessage`|Mensagem da consulta Zero Auth retornado pelo provedor. |Texto|512 |Ex.: "Transacao Autorizada"|
|`BinData.Provider`|Provedor do serviço.|Texto|15 |Ex.: "Cielo30"|
|`BinData.CardType`|Tipo do cartão retornado da Consulta BIN.|Texto|15 |Ex.: "Crédito" / "Débito" / "Múltiplo"|
|`BinData.ForeignCard`|Indica se é um cartão emitido fora do Brasil.|booleano|- |Ex.: "true" / "false" |
|`BinData.Code`|Código de retorno da Consulta BIN.|Número|2 |Ex.: "00" - consulta realizada com sucesso (para provedor Cielo30)|
|`BinData.Message`|Mensagem de retorno da Consulta BIN.|Texto|512 |Ex.: "Analise autorizada" - consulta realizada com sucesso (para provedor Cielo30)  |
|`BinData.CorporateCard`|Indica se o cartão é corporativo.|booleano|--- |Ex.: "true" ou "false"|
|`BinData.Issuer`|Nome do emissor do cartão.|Texto|512 |Ex.: "Banco da Praça" (sujeito a mapeamento do adquirente)|
|`BinData.IssuerCode`|Código do emissor do cartão.|Número|3 |Ex.: "000" (sujeito a mapeamento do adquirente)|
