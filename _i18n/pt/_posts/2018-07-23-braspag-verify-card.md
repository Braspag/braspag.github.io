---
layout: manual
title: Manual de Integração - VerifyCard
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
sort_order: 3
tags:
  - 1. Pagador
language_tabs:
  json: JSON
  shell: cURL
  
---

# VerifyCard

O **VerifyCard** é composto por dois serviços: *Zero Auth* e *Consulta BIN*.
 
O **Zero Auth** é um serviço que identifica se um cartão é válido ou não, através de uma operação semelhante a uma autorização, porém com valor R$ 0,00.<br/>A **Consulta BIN** é um serviço disponível para clientes Cielo 3.0 que retorna, a partir do BIN (6 primeiros dígitos do cartão), características tais como bandeira e tipo do cartão. 
 
Os dois serviços podem ser consumidos simultaneamente através do VerifyCard. Também é possível condicionar o processo de autorização automaticamente a um retorno de sucesso do ZeroAuth. Para habilitar este último fluxo, entre em contato com nosso time de suporte.

A funcionalidade VerifyCard pode ser utilizada em conjunto com o serviço de tokenização do cartão. Neste caso, a API do VerifyCard primeiramente recebe a requisição do serviço Zero Auth e faz a validação com a adquirente, que responde se o cartão é válido ou não. A API do VerifyCard envia então este retorno à loja, que poderá escolher fazer ou não a requisição de tokenização do cartão para a API do Cartão Protegido. 

Abaixo veja a representação desse **fluxo transacional**, utilizando-se o **VerifyCard** em conjunto com o **Cartão Protegido**:

![VerifyCard com Cartão Protegido]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans3b-pt.png)

## Ambientes

|Amnbiente|Base da URL transacional|
|---|---|
|Sandbox|https://apisandbox.braspag.com.br/|
|Produção|https://api.braspag.com.br/|

<br/>Para consultar dados de um cartão, envie uma requisição utilizando o verbo HTTP POST para o serviço VerifyCard, de acordo com os exemplos deste manual. A consulta pode ser feita pelo número ou pelo token do cartão.

# Consulta pelo Número do Cartão

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
   "Provider":"Cielo30",
   "Card":
   {
       "CardNumber": "999999******9999",
       "Holder": "Joao da Silva",
       "ExpirationDate": "03/2026",
       "SecurityCode": "***",
       "Brand": "Visa",
       "Type": "CreditCard"
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/verifycard"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
{
   "Provider": "Cielo30",
   "Card" :
   {
       "CardNumber": "999999******9999",
       "Holder": "Joao da Silva",
       "ExpirationDate": "03/2026",
       "SecurityCode": "***",
       "Brand": "Visa",
       "Type": "CreditCard"
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|Guid|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Card.CardNumber`|Número do cartão do comprador para Zero Auth e Consulta BIN. Caso seja somente requisição de Consulta BIN, enviar somente o BIN (de 6 ou 9 dígitos).|Texto|16|Sim|
|`Card.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`Card.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`Card.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim (Não, se tiver autorização do adquirente)|
|`Card.Brand`|Bandeira do cartão.|Texto|10|Não |
|`Card.Type`|Tipo do cartão a ser consultado ("CreditCard" / "DebitCard"). Este campo é particularmente importante devido aos cartões com funções múltiplas.|Texto|10|Sim|

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
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
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
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
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
|`BinData.ForeignCard`|Indica se é um cartão emitido fora do Brasil.|Booleano|--- |Ex.: true/false |
|`BinData.Code`|Código de retorno da Consulta BIN.|Número|2 |Ex.: "00" - consulta realizada com sucesso (para provedor Cielo30)|
|`BinData.Message`|Mensagem de retorno da Consulta BIN.|Texto|512 |Ex.: "Analise autorizada" - consulta realizada com sucesso (para provedor Cielo30)  |
|`BinData.CorporateCard`|Indica se o cartão é corporativo.|Booleano|--- |Ex.: true/false|
|`BinData.Issuer`|Nome do emissor do cartão.|Texto|512 |Ex.: "Banco da Praça" (sujeito a mapeamento do adquirente)|
|`BinData.IssuerCode`|Código do emissor do cartão.|Número|3 |Ex.: "000" (sujeito a mapeamento do adquirente)|
|`BinData.CardBin`|Código do emissor do cartão.|Número|6 |Ex.: "999999"|
|`BinData.CardLast4Digits`|Código do emissor do cartão.|Número|4 |Ex.: "9999"|
|`BinData.Prepaid`|Indica se o cartão é pré-pago ou não|Booleano|---|Ex.: "000" (sujeito a mapeamento do adquirente)|

# Consulta pelo Token do Cartão

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/verifycard</span></aside>

```json
{
    "Provider": "Cielo30",
    "Card": {
        "CardToken": "af1ffa95-e4a6-4ed9-9270-a9cb4c586c4a",
        "SecurityCode": "939",
        "Brand": "Visa",
        "Type": "CreditCard"
    }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/verifycard"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
{
   "Provider": "Cielo30",
   "Card" :
   {
       "CardToken": "af1ffa95-e4a6-4ed9-9270-a9cb4c586c4a",
        "SecurityCode": "939",
        "Brand": "Visa",
        "Type": "CreditCard"
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|Guid|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Card.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|Texto|16|Sim|
|`Card.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`Card.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`Card.Type`|Tipo do cartão a ser consultado ("CreditCard"/"DebitCard"). Este campo é particularmente importante devido aos cartões com funções múltiplas.|Texto|10|Sim|

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
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
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
        "IssuerCode": "001",
        "CardBin": "999999",
        "CardLast4Digits": "9999",
        "Prepaid": false
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
|`BinData.CorporateCard`|Indica se o cartão é corporativo.|booleano|--- |Ex.: "true" / "false"|
|`BinData.Issuer`|Nome do emissor do cartão.|Texto|512 |Ex.: "Banco da Praça" (sujeito a mapeamento do adquirente)|
|`BinData.IssuerCode`|Código do emissor do cartão.|Número|3 |Ex.: "000" (sujeito a mapeamento do adquirente)|
|`BinData.CardBin`|Código do emissor do cartão.|Número|6 |Ex.: "999999"|
|`BinData.CardLast4Digits`|Código do emissor do cartão.|Número|4 |Ex.: "9999"|
|`BinData.Prepaid`|Indica se o cartão é pré-pago ou não|Booleano|---|Ex.: "000" (sujeito a mapeamento do adquirente)|

# Respostas Programadas

É possível testar os retornos do VerifyCard (Zero Auth) em ambiente sandbox usando o provider "Simulado". Para isso, você pode usar os cartões de teste da tabela a seguir para simular os cenários de consulta autorizada, não autorizada e falha na operação.

| Número do cartão | Status | Retorno | Mensagem |
|---|---|---|---|
| 4532117080573788 | 0 | 70 | Não autorizado |
| 4532117080573799 | 99 | BP900 | Falha na operação |
| 4532117080573701 | 1 | 4 | Autorizado |

Para testar os cenários de retorno da Consulta BIN em sandbox, acesse a [documentação da Cielo](https://developercielo.github.io/manual/cielo-ecommerce#consulta-bin-sandbox){:target="_blank"}.
