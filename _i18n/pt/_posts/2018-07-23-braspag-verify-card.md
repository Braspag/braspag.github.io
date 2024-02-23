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

O **VerifyCard** é composto por dois serviços: **Zero Auth** e **Consulta BIN**.

![VerifyCard]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/verifycard.png)
 
O **Zero Auth** é um serviço que identifica se um cartão é válido ou não, através de uma operação semelhante a uma autorização, porém com valor R$ 0,00.

O Zero Auth simula uma autorização sem afetar o limite de crédito ou alertar o portador do cartão sobre o teste.

![Fluxo ZeroAuth]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/zeroauth.png)

> **Atenção**: As transações Zero Auth também estão sujeitas às regras definidas nos programas de retentativas das bandeiras. O excesso de tentativas pode implicar em tarifas. Leia mais em [Programa de Retentativa das Bandeiras](https://developercielo.github.io/tutorial/programa-retentativa-bandeiras){:target="_blank"}.

Já o Consulta BIN é um serviço disponível exclusivamente para clientes Cielo que retorna informações do cartão a partir do BIN (seis primeiros dígitos do cartão):

![Consulta BIN]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/consultabin.png)

* **Bandeira do cartão**: nome da bandeira;
* **Tipo de cartão**: crédito, débito ou múltiplo (crédito e débito);
* **Nacionalidade do cartão**: internacional ou nacional;
* **Cartão corporativo**: se o cartão é corporativo ou não;
* **Banco emissor**: código e nome do emissor;
* **Cartão pré-pago**: se o cartão é pré-pago ou não.

<aside class="warning">Para habilitar o Zero Auth e/ou Consulta Bin, entre em contato com a equipe de suporte da Cielo.</aside>

## Benefícios do VerifyCard

Os retornos do VerifyCard sobre a validade e informações do cartão permitem que a sua loja crie personalizações na sua aplicação e/ou checkout. Veja exemplos de uso:

* **Solicitar autorização apenas se o cartão estiver válido**: você pode criar uma condição em sua aplicação para apenas enviar a solicitação de autorização se houver retorno de sucesso no ZeroAuth;

<aside class="notice"> Para habilitar este fluxo, entre em contato com nosso time de suporte.</aside>

* **Solicitar a tokenização apenas se o cartão estiver válido**: você pode criar uma condição em sua aplicação para apenas solicitar a tokenização de um cartão se ele estiver válido. Saiba mais no tópico Usando o VerifyCard com Cartão Protegido;
* **Evitar erros relacionados ao tipo do cartão ou bandeira**: se o seu checkout exige a seleção manual da bandeira ou tipo do cartão, você desenvolver uma mensagem de alerta para quando, por exemplo, a pessoa está usando um cartão de débito quando na verdade deveria usar um de crédito;
* **Oferecer a recuperação do carrinho**: você pode desenvolver um fluxo no seu checkout para que, caso o cartão informado o seja múltiplo (crédito e débito), a sua loja pode reter os dados do cartão e, caso a transação de crédito falhe, oferecer automaticamente ao consumidor uma transação de débito com o mesmo cartão;
* **Alertar sobre cartões internacionais ou pré-pagos**: se a sua loja não deseja receber pagamentos internacionais ou de cartões pré-pagos, por exemplo, você pode configurar o seu checkout para informar ao consumidor que a loja não aceita o cartão informado.

## Usando o VerifyCard com o Cartão Protegido

O VerifyCard pode ser utilizada em conjunto com o serviço de tokenização do cartão (Cartão Protegido).

Neste caso, a API do VerifyCard primeiro recebe a requisição do serviço Zero Auth e faz a validação com a adquirente, que responde se o cartão é válido ou não. A API do VerifyCard envia então este retorno à loja, que poderá escolher fazer ou não a requisição de tokenização do cartão para a API do Cartão Protegido.

Abaixo veja a representação desse **fluxo transacional**, usando o **VerifyCard** em conjunto com o **Cartão Protegido**:

![VerifyCard com Cartão Protegido]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans3b-pt.png)

## VerifyCard em sandbox

### Respostas programadas Zero Auth

É possível testar os retornos do VerifyCard (Zero Auth) em ambiente sandbox usando o provider "Simulado". Para isso, você pode usar os cartões de teste da tabela a seguir para simular os cenários de consulta autorizada, não autorizada e falha na operação.

| Número do cartão | Status | Retorno | Mensagem |
|---|---|---|---|
| 4532117080573788 | 0 | 70 | Não autorizado |
| 4532117080573799 | 99 | BP900 | Falha na operação |
| 4532117080573701 | 1 | 4 | Autorizado |

### Respostas Programadas Consulta BIN

Na simulação da Consulta BIN em ambiente sandbox, cada um dos seis primeiros dígitos vai reger um resultado simulado. É possível montar uma numeração de cartão para teste e observar o retorno esperado de acordo com diferentes cenários.

|   Dígito  | O que indica                             | Retorno |
|-----------|------------------------------------------|---------|
| 1º dígito | Bandeira.                       | Se for '**3**' retorna "**AMEX**"<br>Se for '**5**' retorna "**MASTERCARD**"<br>Se for '**6**' retorna "**DISCOVER**"<br>Qualquer outro número retorna "**VISA**".|
| 2º dígito | Tipo do cartão.                 | Se for '**3**' retorna "**Débito**"<br>Se for '**5**' retorna "**Crédito**"<br>Se for '**7**' retorna "**Crédito**" e retorna o campo `Prepaid`como "**true**"<br>Qualquer outro número retorna"**Múltiplo**".|
| 3º dígito | Nacionalidade do cartão.        | Se for '**1**' retorna "**true**" (cartão nacional)<br>Qualquer número diferente de '**1**' retorna "**false**" (cartão internacional).|
| 4º dígito | Se o cartão é corporativo ou não. | Se for '**1**' retorna "**true**" (é cartão corporativo)<br>Qualquer número diferente de '**1**' retorna "**false**" (não é cartão corporativo).|
| 5º dígito | Retorno da análise.             | Se for '**2**' retorna "**01 - Bandeira não suportada**"<br>Se for '**3**' retorna "**02 - Voucher - Não suportado na consulta de bins**"<br>Qualquer outro número retorna "**00 - Analise autorizada**"|
| 6º dígito | Banco emissor.                  | Se for '**1**' retorna "**104**" e "**Caixa**"<br>Se for '**2**' retorna "**001**" e "**Banco do Brasil**"<br>Qualquer outro número retorna "**237**" e "**Bradesco**"|

# Ambientes

|Ambiente|Base da URL transacional|
|---|---|
|Sandbox|https://apisandbox.braspag.com.br/|
|Produção|https://api.braspag.com.br/|

# Integração

Para consultar um cartão, envie uma requisição utilizando o verbo HTTP POST para o serviço VerifyCard, de acordo com os exemplos deste manual. A consulta do VerifyCard pode ser feita pelo número ou pelo token do cartão.

Na requisição ao VerifyCard, você enviará o `Provider` junto com os dados do cartão (número ou cartão tokenizado).

> Nas transações em ambiente sandbox, use o provider Simulado.

Na resposta, a verificação do ZeroAuth será exibida nas propriedades `Status`, `ProviderReturnCode` e `ProviderReturnMessage`. O retorno da Consulta BIN estará nas propriedades do nó `BinData`.

# VerifyCard pelo número do cartão

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
|`BinData.CardBin`|São os seis primeiros dígitos do cartão.|Número|6 |Ex.: "999999"|
|`BinData.CardLast4Digits`|Quatro últimos dígitos do cartão.|Número|4 |Ex.: "9999"|
|`BinData.Prepaid`|Indica se o cartão é pré-pago ou não|Booleano|---|Ex.: "000" (sujeito a mapeamento do adquirente)|

# VerifyCard pelo token do cartão

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
|`BinData.CardBin`|São os seis primeiros dígitos do cartão.|Número|6 |Ex.: "999999"|
|`BinData.CardLast4Digits`|Quatro últimos dígitos do cartão.|Número|4 |Ex.: "9999"|
|`BinData.Prepaid`|Indica se o cartão é pré-pago ou não|Booleano|---|Ex.: "000" (sujeito a mapeamento do adquirente)|
