---
layout: manual
title: Manual de Integração - Risk Notification
description: Integração Técnica Risk Notification API Braspag
search: true
translated: true
categories: manual
tags:
    - 4. Gestão de Risco
language_tabs:
  json: JSON

---

# Sobre essa documentação

Esta documentação apresenta a integração com a Risk Notification API, trazendo exemplos de requisições e respostas sobre a notificação, consulta, aceitação e disputa de chargebacks.

Se você tem interesse na ferramenta de análise de fraude da Braspag, acesse a documentação do [Antifraude Gateway](https://braspag.github.io//manual/antifraude){:target="_blank"}.                          

# Visão geral    

Os chargebacks são comuns em qualquer operação de e-commerce e geram impactos na agenda financeira de uma loja. A Risk Notification API oferece uma forma fácil e simplificada de saber quando um chargeback ocorreu e por qual motivo; assim, a loja pode decidir se irá aceitar ou disputar o chargeback.

## Requisitos

Você pode integrar a Risk Notification API se a sua loja cria transações usando a [**API do Pagador**](https://www.braspag.com.br/pagamentos/){:target="_blank"}  (tendo a Cielo como adquirente) ou a [**API E-commerce Cielo**](https://www.cielo.com.br/e-commerce){:target="_blank"}.

Para contratar a Risk Notification API, fale com o time [Comercial da Braspag](https://www.braspag.com.br/contato/){:target="_blank"}.

> Clientes da API Cielo E-commerce que desejam usar a Risk Notification API precisam contratar este serviço com a Braspag. Para isso, solicite para o canal de chargeback do seu segmento (por e-mail) ou para seu gestor comercial.

## Benefícios da Risk Notification API

A Risk Notification API permite:

* Notificação da ocorrência de chargeback na API Transacional (Pagador ou API E-commerce Cielo);
* Consulta de detalhes sobre o chargeback;
* Automatização do processo de notificação, aceitação e disputa;
* Retroalimentação das ocorrências de chargeback para a análise de fraude na Cybersource*.
<br>
**Exclusivo para lojas integradas ao Antifraude Gateway Braspag com o provedor Cybersource.*

## Glossário

Confira a seguir alguns conceitos básicos sobre chargebacks.

|TERMO|DEFINIÇÃO|
|---|---|
| **Chargeback** | É a contestação de uma compra pelo portador do cartão diretamente com o emissor.|
| **Fraude** | É o uso do cartão de crédito por terceiros não autorizados pelo portador do cartão.|
| **Aceitação** | É o processo de aceite do chargeback pela loja.|
| **Disputa** | É o processo que ocorre quando a loja não concorda com o chargeback e apresenta sua defesa na credenciadora.|
| **Retroalimentação de chargeback** | Quando o motivo do chargeback é fraude, essa informação é levada à Cybersource para retroalimentação do motor de análise de fraude.<br>*Função exclusiva para clientes do Antifraude Gateway Braspag com o provider Cybersource.*|

## O que é chargeback?

É o processo no qual o portador do cartão contesta uma compra com o emissor do cartão. Essa contestação pode ser feita pelo portador do cartão até **180 dias depois da data da compra**.

O chargeback pode ocorrer em transações de e-commerce ou mundo físico, e a loja tem o direito de [disputar](https://braspag.github.io//manual/risknotification#disputando-um-chargeback) o chargeback em um fluxo regulamentado pelas bandeiras.

> Conheça as orientações da Cielo para [**Prevenção de Fraudes e Chargeback**](https://developercielo.github.io/manual/prevencao-fraudes){:target="_blank"}.

## Por que ocorre um chargeback?

Os motivos da ocorrência de chargeback são:

* **Fraude**: o portador do cartão não reconhece a compra;
* **Desacordo comercial**: o portador do cartão reconhece a compra, porém alega que algum termo da venda não foi cumprido (mercadoria não entregue ou com defeito, por exemplo);
* **Erro de processamento**: o portador do cartão identifica algum erro na cobrança (duplicidade, valor cobrado incorretamente, pagamento por outros meios etc.).
<br/>
<br/>
> As transações que passam por autenticação 3DS são de responsabilidade do emissor e, por isso, não podem receber chargeback de fraude.

# Notificação de chargeback

Ao integrar o seu e-commerce à Risk Notification API, você pode optar por receber a notificação de chargeback pelo **Post de Notificação**.

O **Post de Notificação** é o webhook configurado na API que você usa para as suas transações (Pagador ou API E-commerce Cielo).

Para receber as notificações, você deve informar uma URL de Notificação à nossa equipe de [Suporte](https://suporte.braspag.com.br/hc/pt-br)
{:target="_blank"}. Saiba mais no manual do [Pagador](https://braspag.github.io//manual/braspag-pagador){:target="_blank"} ou no manual da [API E-commerce Cielo](https://developercielo.github.io/manual/cielo-ecommerce){:target="_blank"}.

> * A ativação do Post de Notificação é opcional, mas recomendamos o uso dessa funcionalidade;<br/>
> * O endereço (URL) deve ser HTTPS;<br/>
> * É possível adicionar chaves nos cabeçalhos (headers) como medida de segurança.

**Estrutura da notificação do webhook**

Enviaremos uma notificação em JSON contendo o `PaymentId` e o [`ChangeType`](https://braspag.github.io//manual/braspag-pagador#notifica%C3%A7%C3%A3o-enviada){:target="_blank"} com o valor “7”, que indica a ocorrência de chargeback.

```json
{ 
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", 
   "ChangeType": "7" 
}
```

A notificação de chargeback informa apenas que um chargeback ocorreu e envia o `PaymentId` da transação. Para saber mais detalhes como valor e motivo do chargeback, faça uma [Consulta](https://braspag.github.io//manual/risknotification#consultando-um-chargeback) na Risk Notification API.

Após a [consulta](https://braspag.github.io//manual/risknotification#consultando-um-chargeback), você deve decidir por [aceitar](https://braspag.github.io//manual/risknotification#aceitando-um-chargeback) ou [disputar](https://braspag.github.io//manual/risknotification#disputando-um-chargeback) o chargeback, conforme ilustrado no diagrama a seguir:

![Notificação de chargeback]({{ site.baseurl_root }}/images/braspag/af/risknotificationapi-notificacao.png)

# Integração

# Ambientes

## Sandbox

|API|URL BASE|FUNÇÃO|
|---|---|---|
|Braspag OAUTH2 Server|https://authsandbox.braspag.com.br/|Autenticação.|
|Risk Notification API|https://risknotificationsandbox.braspag.com.br/|Consulta, aceitação e disputa de chargebacks.|

## Produção

|API |URL BASE|FUNÇÃO|
|---|---|---|
|Braspag OAUTH2 Server|https://auth.braspag.com.br/|Autenticação.|
|Risk Notification API|https://risknotification.braspag.com.br/|Consulta, aceitação e disputa de chargebacks.|

> Para simular um chargeback, você deverá criar uma transação no ambiente sandbox da API do Pagador ou da API E-commerce Cielo; saiba mais em [Simulando um Chargeback](https://braspag.github.io//manual/risknotification#simulando-um-chargeback){:target="_blank"}.

# Autenticação

A Risk Notification API utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, **Sandbox** e **Produção**.

## Obtendo o token de acesso

Durante o onboarding, você receberá as credenciais `ClientId` e `ClientSecret`. Caso não tenha recebido a credencial, solicite ao [Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}.

**1.** Concatene as credenciais no formato `ClientId:ClientSecret`;<br/>
**2.** Converta o resultado em base 64, gerando uma string;

> **Exemplo:**<br/>
> * client_id: **braspagtestes**<br/>
> * client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * String a ser codificada em Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * Resultado após a codificação: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**<br/>

**3.** Envie a string em base 64 na requisição de Autenticação (POST);<br/>
**4.** A API de Autenticação irá validar a string e retornará o `access_token` (token de acesso). 

O token retornado (`access_token`) deverá ser utilizado em toda requisição à Risk Notification API como uma chave de autorização. O `access_token` possui uma validade de 20 minutos e é necessário gerar um novo toda vez que a validade expirar.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{BraspagAuth API}oauth2/token</span></aside>

**Parâmetros no Cabeçalho (header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no Corpo (body)**

|Key|Value|
|:-|:-|
|`scope`|ChargebackApiApp|
|`grant_type`|client_credentials|

### Resposta

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

**Parâmetros no corpo (body)**

|Parâmetro|Descrição|
|:-|:-|
|`access_token`|O token de acesso solicitado.|
|`token_type`|Indica o valor do tipo de token.|
|`expires_in`|Expiração do token de acesso, em segundos. <br/>Após expirar, é necessário obter um novo.|

# Simulando um chargeback

Você pode simular um chargeback para testar a consulta, aceitação e disputa de chargebacks.

Para simular chargeback, o primeiro passo é criar uma transação de teste; em seguida, você poderá enviar a requisição de simulação de chargeback. Depois disso, o fluxo segue conforme um chargeback real:

![Simular chargeback]({{ site.baseurl_root }}/images/braspag/af/risknotificationapi-simulacao.png)

1. **Crie uma transação de teste** no ambiente sandbox da **API transacional** usada pela sua loja ([API do Pagador](https://braspag.github.io//manual/braspag-pagador){:target="_blank"} ou [API E-commerce Cielo](https://developercielo.github.io/manual/cielo-ecommerce){:target="_blank"});
2. **Crie uma simulação de chargeback na Risk Notification API**, conforme requisição de simulação;
3. A Risk Notification API informará a ocorrência de chargeback para a API transacional;
4. A API transacional enviará um Post de Notificação com o ChangeType igual a “7”, informando o PaymentId da transação;
5. Faça uma consulta na Risk Notification API usando o PaymentId. A consulta vai retornar o CaseNumber;
6. Você pode decidir se irá testar o fluxo de aceitação ou disputa, seguindo as requisições padrões dessa documentação, em ambiente sandbox. Tanto para a requisição de aceitação quanto de disputa, você deverá informar o CaseNumber recebido na etapa 5.

## Requisição

Depois de criar uma transação de teste na API do Pagador ou API E-commerce Cielo, envie a requisição de simulação para criar um chargeback em ambiente sandbox.

Confira a correspondência entre os parâmetros das APIs transacionais e da Risk Notification API:

|API PAGADOR |API E-COMMERCE CIELO |SIMULAÇÃO NA RISK NOTIFICATION API|
|---|---|---|
|-|-| `ChargebackBrandGroups[n].Details[n].AcquirerCaseNumber` |
| `Payment.AcquirerTransactionId` | `Payment.Tid` | `ChargebackBrandGroups[n].Details[n].AcquirerTransactionId` |
| `Payment.AuthorizationCode` | `Payment.AuthorizationCode` | `ChargebackBrandGroups[n].Details[n].AuthorizationCode` |
| `Payment.ProofOfSale` | `Payment.ProofOfSale` | `ChargebackBrandGroups[n].Details[n].ProofOfSale` |

> **Importante**:<br/>
> * Para a simulação, você precisa criar um valor fictício para o CaseNumber no parâmetro `ChargebackBrandGroups[n].Details[n].AcquirerCaseNumber`;<br/>
> * Na simulação de chargeback, use a data da transação em `ChargebackBrandGroups[n].Details[n].SaleDate`.

<aside class="request"><span class="method post">POST</span><span class="endpoint">{Risk Notification API}chargeback/test</span></aside>

``` json
{
    "ChargebackBrandGroups": [{
        "Brand": "Visa",
        "Details": [{
            "Acquirer": "Cielo",
            "AcquirerCaseNumber": "2020052301",
            "AcquirerTransactionId": "0523103051968",
            "Amount": 100,
            "AuthorizationCode": "433946",
            "CardHolder": "Teste Holder",
            "EstablishmentCode": "TestAffiliation",
            "MaskedCardNumber": "402400******2931",
            "ReasonCode": "101",
            "ReasonMessage": "Responsabilidade EMV - Falsifcação",
            "SaleDate": "2020-05-23",
            "TransactionAmount": 100,
            "ProofOfSale": "3051968"
        }]
    },
    {
        "Brand": "Master",
        "Details": [{
            "Acquirer": "Cielo",
            "AcquirerCaseNumber": "2020052302",
            "AcquirerTransactionId": "0523103114691",
            "Amount": 100,
            "AuthorizationCode": "722134",
            "CardHolder": "Teste Holder",
            "EstablishmentCode": "TestAffiliation",
            "MaskedCardNumber": "402400******2931",
            "ReasonCode": "101",
            "ReasonMessage": "Responsabilidade EMV - Falsifcação",
            "SaleDate": "2020-05-23",
            "TransactionAmount": 100,
            "ProofOfSale": "3114691"
        }]
    }]
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização. Insira "Bearer" com B maiúsculo.|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|condicional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|condicional|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-|
|`ChargebackBrandGroups[n].Brand`|Nome da bandeira <br/> Informar o mesmo valor informado no campo `Payment.CreditCard.Brand` na criação da transação|string|sim|32|
|`ChargebackBrandGroups[n].Details[n].Acquirer`|Nome da adquirente <br/> Enviar fixo Cielo|string|sim|16|
|`ChargebackBrandGroups[n].Details[n].AcquirerCaseNumber`|Número do caso do chargeback <br/> Este valor será usado para realizar as operações de [**Aceitação**](https://braspag.github.io//manual/risknotification#aceitando-um-chargeback) e [**Disputa**](https://braspag.github.io//manual/risknotification#disputando-um-chargeback)|string|sim|10|
|`ChargebackBrandGroups[n].Details[n].AcquirerTransactionId`|Id da transação na adquirente <br/> Se transação criada a partir do Pagador Braspag, informar o mesmo valor recebido no campo `Payment.AcquirerTransactionId` do response <br/> Se transação criada a partir da API Cielo 3.0 ou API Split Braspag, informar o mesmo valor recebido no campo `Payment.Tid` do response|string|sim|20| 
|`ChargebackBrandGroups[n].Details[n].Amount`|Valor do chargeback em centavos <br/> Ex: 123456 = r$ 1.234,56|long|sim|-|
|`ChargebackBrandGroups[n].Details[n].AuthorizationCode`|Código de autorização da transação na adquirente <br/> Informar o mesmo valor recebido no campo `Payment.AuthorizationCode` do response da criação da transação|string|sim|8|
|`ChargebackBrandGroups[n].Details[n].CardHolder`|Nome do portador do cartão <br/> Informar o mesmo valor informado no campo `Payment.CrediCard.Holder` na criação da transação <br/> Em produção, este campo pode estar vazio ou contendo outra informação diferente da do nome do portador|string|não|100|
|`ChargebackBrandGroups[n].Details[n].EstablishmentCode`|Número do estabelecimento ou código de afiliação <br/> Informar o mesmo valor informado no campo `Payment.Credentials.Code` na criação da transação|string|sim|10|
|`ChargebackBrandGroups[n].Details[n].MaskedCardNumber`|Cartão mascarado <br/> Informar o mesmo valor recebido no campo `Payment.CreditCard.Number` do response da criação da transação|string|sim|16|
|`ChargebackBrandGroups[n].Details[n].ReasonCode`|Código do motivo do chargeback <br/> Informar o código de acordo - [Tabela 7 - ReasonCode e ReasonMessage]({{ site.baseurl_root }}manual/risknotification#tabela-7-reasoncode-e-reasonmessage)|string|sim|5|
|`ChargebackBrandGroups[n].Details[n].ReasonMessage`|Mensagem do motivo do chargeback <br/> Informar a mensagem de acordo - [Tabela 7 - ReasonCode e ReasonMessage]({{ site.baseurl_root }}manual/risknotification#tabela-7-reasoncode-e-reasonmessage)|string|sim|128|
|`ChargebackBrandGroups[n].Details[n].SaleDate`|Data de autorização da transação de teste. <br/> Formato: YYYY-MM-DD|date|sim|10|
|`ChargebackBrandGroups[n].Details[n].TransactionAmount`|Valor da transação em centavos <br/> Informar o mesmo valor informado no campo `Payment.Amount` na criação da transação <br/> Ex: 123456 = r$ 1.234,56|long|sim|-|
|`ChargebackBrandGroups[n].Details[n].ProofOfSale`|Comprovante de venda ou NSU <br/> Informar o mesmo valor recebido no campo `Payment.ProofOfSale` do response da criação da transação|string|sim|20|

## Resposta

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

# Consultando um chargeback

Após receber a notificação de chargeback, use o `PaymentId` para consultar mais detalhes do chargeback, como motivo e valor.

Há dois tipos de consultas:

* **Consulta por `PaymentId`**: você deve inserir o `PaymentId` recebido na notificação;
* **Consulta por data ou página**: você deve buscar um intervalo de datas ou de páginas e localizar o `PaymentId` de interesse na lista de resultados.

## Consulta por PaymentId

### Requisição

<aside class="request"><span class="method get">GET</span><span class="endpoint">{Risk Notification API}Chargeback/GetByBraspagTransactionId/{PaymentId}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|

### Resposta

```json
{
    "Id": "fd14e3fb-cf2a-4228-b690-1338660afc54",
    "CreatedDate": "2022-06-24T20:45:55.2",
    "Date": "2022-06-24T00:00:00",
    "CaseNumber": "000001",
    "Amount": 10000,
    "ReasonCode": "28",
    "ReasonMessage": "Consumidor nao reconhece a compra",
    "Status": "Received",
    "IsFraud": true,
    "Transaction": {
        "AcquirerType": "Cielo",
        "EstablishmentCode": "1234567890",
        "MerchantOrderId": "abc123efg",
        "Tid": "1234567890BA2018XPTO",
        "Nsu": "258654",
        "AuthorizationCode": "T85245",
        "SaleDate": "2022-06-06T00:00:00",
        "PagadorMerchantId": "a1052460-92b2-49c3-a929-fc985df0ba2f",
        "BraspagTransactionId": "bb33b5c5-82fe-4254-9f1d-b9c97297b0d5",
        "Amount": 10000,
        "RawData": "JOAO D SOUZA",
        "MaskedCardNumber": "453906******8385",
        "Brand": "Visa",
        "AntifraudSourceApplication": "Gateway"
    }
}
```

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`Id`|Id do chargeback na Chargeback API Braspag|guid|
|`CreatedDate`|Data de criação do chargeback na Chargeback API Braspag <br/> Ex.: 2018-09-01 09:51:25|date|
|`Date`|Data do chargeback <br/> Ex.: 2018-08-30|date|
|`CaseNumber`|Número do caso relacionado ao chargeback|string|
|`Amount`|Valor do chargeback em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`ReasonCode`|Código do motivo do chargeback - [Tabela 5 - Motivo do chargeback](https://braspag.github.io//manual/risknotification#tabela-5-motivo-do-chargeback)|string|
|`ReasonMessage`|Descrição do motivo do chargeback - [Tabela 5 - Motivo do chargeback](https://braspag.github.io//manual/risknotification#tabela-5-motivo-do-chargeback)|string|
|`Status`|Status do chargegback na Braspag - [Tabela 2 - Status do chargeback](https://braspag.github.io//manual/risknotification#tabela-2-status-do-chargeback)|string|
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
|`Transaction.RawData`|Dado enviado pela adquirente, podendo ser o titular do cartão ou outra mensagem|string|
|`Transaction.MaskedCardNumber`|Número do cartão de crédito mascarado|string|
|`Transaction.Brand`|Bandeira do cartão de crédito|string|
|`Transaction.AntifraudSourceApplication`|Origem da plataforma de antifraude - [Tabela 4 - API de Antifraude](https://braspag.github.io//manual/risknotification#tabela-4-api-de-antifraude)|string|

## Consulta por data ou página

### Requisição

<aside class="request"><span class="method get">GET</span><span class="endpoint">{Risk Notification API}Chargeback?StartDate={StartDate}&EndDate={EndDate}&PageIndex={PageIndex}&PageSize={PageSize}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`StartDate`|Data início da consulta.|sim|
|`EndDate`|Data fim da consulta.|sim|
|`PageIndex`|Número da página desejada. Numa primeira consulta, sempre use o valor "1".|sim|
|`PageSize`|Quantidade de itens desejados na página. Máximo 250 itens.|sim|
|`MerchantIds`|Id(s) da(s) loja(s) a ser utilizado na consulta <br/> Obs.: Caso não seja enviado, a consulta será realizada levando em consideração o(s) MerchantId(s) associado(s) ao ClientId.|não|
|`EstablishmentCodes`|Número(s) do(s) estabelecimento(s) ou afiliação(ões) na adquirente a ser utilizado na consulta <br/> Obs.: Caso não seja enviado, a consulta será realizada levando em consideração o(s) número(s) do(s) estabelecimento(s) ou afiliação(ões) na adquirente associado(s) ao ClientId.|não|
|`CaseNumber`|Número do caso do chargeback.|não|
|`AcquirerTransactionId`|Identificador da transação na adquirente (TID).|não|
|`BraspagTransactionId`|É o `PaymentId`, identificador da transação na plataforma Pagador Braspag ou Cielo 3.0.|não|
|`BrandIds`| Bandeira do cartão.|não|
|`ReasonCode`| Código do motivo do chargeback.|não|
|`ChargebackTypes`| Tipo de chargeback.|não|
|`SaleDate`| Data de autorização da transação. Formato: YYYY-MM-DD.|não|
|`ProofOfSale`|É o NSU (número sequencial único) da transação na adquirente.|não|
|`MerchantOrderId`| Número do pedido.|não|
|`AuthorizationCode`| Código de autorização da transação na adquirente.|não|
|`Status`|Status do chargeback na Braspag. Esse parâmetro só será retornado após a aceitação ou disputa. [Tabela 2 - Status do chargeback](https://braspag.github.io//manual/risknotification#tabela-2-status-do-chargeback)|não|

### Resposta

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
                "RawData": "JOAO D COUVES",
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
|`Id`|Id do chargeback na Risk Notification API |guid|
|`CreatedDate`|Data de criação do chargeback na Risk Notification API. <br/> Ex.: 2018-09-01 09:51:25|date|
|`Date`|Data do chargeback <br/> Ex.: 2018-08-30|date|
|`CaseNumber`|Número do caso relacionado ao chargeback|string|
|`Amount`|Valor do chargeback em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`ReasonCode`|Código do motivo do chargeback - [Tabela 5 - Motivo do chargeback](https://braspag.github.io//manual/risknotification#tabela-5-motivo-do-chargeback)|string|
|`ReasonMessage`|Descrição do motivo do chargeback - [Tabela 5 - Motivo do chargeback](https://braspag.github.io//manual/risknotification#tabela-5-motivo-do-chargeback)|string|
|`Status`|Status do chargeback na Braspag - [Tabela 2 - Status do chargeback](https://braspag.github.io//manual/risknotification#tabela-2-status-do-chargeback)|string|
|`IsFraud`|Identifica se o chargeback é de fraude|bool|
|`Transaction.AcquirerType`|Identificador da adquirente|string|
|`Transaction.EstablishmentCode`|Número do estabelecimento ou afiliação na adquirente|string|
|`Transaction.MerchantOrderId`|Número do pedido da loja|string|
|`Transaction.Tid`|Id da transação na adquirente|string|
|`Transaction.Nsu`|Número sequencial único da transação na adquirente|string|
|`Transaction.AuthorizationCode`|Código de autorização da transação na adquirente|string|
|`Transaction.SaleDate`|Data da autorização da transação na adquirente <br/> Ex.: 2018-08-15|date|
|`Transaction.PagadorMerchantId`|Identificador da loja na plataforma Pagador Braspag ou Cielo 3.0|guid|
|`Transaction.BraspagTransactionId`|Id da transação na plataforma Pagador Braspag ou Cielo 3.0 (PaymentId)|guid|
|`Transaction.Amount`|Valor da transação em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`Transaction.RawData`|Dado enviado pela adquirente, podendo ser o titular do cartão ou outra mensagem|string|
|`Transaction.MaskedCardNumber`|Número do cartão de crédito mascarado|string|
|`Transaction.Brand`|Bandeira do cartão de crédito|string|
|`Transaction.AntifraudMerchantId`|Identificador da loja na plataforma Antifraude Legado ou Antifraude Gateway|guid|
|`Transaction.AntifraudTransactionId`|Identificador da transação na plataforma Antifraude Legado ou Antifraude Gateway|guid|
|`Transaction.AntifraudSourceApplication`|Origem da plataforma de antifraude - [Tabela 4 - API de Antifraude](https://braspag.github.io//manual/risknotification#tabela-4-api-de-antifraude)|string|
|`Transaction.ProviderTransactionId`|Id da transação no provedor de antifraude|
|`Transaction.NegativeValues`|Parâmetros que foram incluídos na lista negativa quando transação de antifraude for Cybersource <br/> Os parâmetros são concatenados usando o caracter , <br/> Ex.: CustomerDocumentNumber, ShippingStreet <br> - [Tabela 1 - Lista Negativa da Cybersource](https://braspag.github.io//manual/risknotification#tabela-1-lista-negativa-da-cybersource)|string|
|`Transaction.ProviderChargebackMarkingEvent.Id`|Id do evento de marcação da transação que sofreu o chargeback. Apenas Cybersource. Indica se a marcação/retroalimentação de chargeback na Cybersource foi aceita ou não. Valores possíveis: "Accept" para aceita ou "Reject" para rejeitada. |string|
|`Transaction.ProviderChargebackMarkingEvent.Status`|Status do evento de marcação da transação que chargeback. Apenas Cybersource - [Tabela 3 - Marcação de chargeback no provedor de Antifraude](https://braspag.github.io//manual/risknotification#tabela-3-marca%C3%A7%C3%A3o-de-chargeback-no-provedor-de-antifraude)|string|
|`Transaction.ProviderChargebackMarkingEvent.Code`|Código que indica os detalhes do status da marcação/retroalimentação de chargeback. Apenas Cybersouce. [Tabela 3 - Marcação de chargeback no provedor de Antifraude](https://braspag.github.io//manual/risknotification#tabela-3-marca%C3%A7%C3%A3o-de-chargeback-no-provedor-de-antifraude)|string|

# Aceitando um chargeback

A funcionalidade de aceitar um chargeback está disponível para lojas que desejam:

* Sinalizar para a Cielo que não disputarão o chargeback e, assim, antecipar em alguns dias o débito do chargeback;
* Criar regras para aceitação automática de determinados tipos de chargeback, conforme `ReasonCode` e valor, por exemplo.
<br>
<aside class="notice">A aceitação de um chargeback via API não é obrigatória, uma vez que quando o prazo para envio da disputa expira o chargeback é automaticamente considerado aceito.</aside>

Confira no diagrama a seguir o fluxo da aceitação de um chargeback:

![Aceitar chargeback]({{ site.baseurl_root }}/images/braspag/af/risknotificationapi-aceitacao.png)

## Requisição

<aside class="request"><span class="method post">POST</span><span class="endpoint">{Risk Notification API}acceptance/{CaseNumber}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|condicional|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|condicional|

**Parâmetros na rota**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

## Resposta

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
|`Status`|Status do chargeback - [Tabela 3 - Chargebacks{n}.Status]({{ site.baseurl_root }}manual/risknotification#tabela-3-chargebacks[n].status)|
|`StatusDescription`|Descrição do status do chargeback|

# Disputando um chargeback

Para disputar um chargeback via API, você deve enviar os documentos de defesa em até 7 dias corridos a partir da data do chargeback.

**Quais documentos são enviados para disputa?**

Depende do segmento de mercado e do motivo do chargeback. É possível enviar contratos e comprovantes de entrega assinados, comprovante de cancelamento ou reembolso da venda e cartões de embarque, entre outros.

Confira nos anexos a lista completa de documentos de defesa por segmento.

**Como enviar os documentos de disputa via API?**

Você deve converter os arquivos dos documentos em imagem ou PDF para *base64* e enviar o código *base64* na requisição de [Disputa](https://braspag.github.io//manual/risknotification#disputando-um-chargeback).

**Qual o tipo e tamanho máximo dos arquivos?**

* As extensões permitidas são PDF, PNG, JPG ou JPEG convertidos em base64 (encoded);
* A soma de todos os arquivos deve ter no máximo 7MB de tamanho.
<br>
A Risk Notification API encaminhará a documentação para a Cielo, que submeterá a disputa para análise da bandeira e do emissor.

> **Importante**:<br/>
> * O envio da documentação para disputa não garante que não ocorrerá débito do chargeback na agenda financeira. Os documentos são o requisito mínimo estipulado pelas bandeiras para negociação;<br/>
> * Quando o prazo para envio da disputa expira o chargeback é automaticamente considerado aceito.

Consulte sua agenda financeira para acompanhar o resultado da disputa.

Confira no diagrama a seguir o fluxo da disputa de um chargeback:

![Disputar chargeback]({{ site.baseurl_root }}/images/braspag/af/risknotificationapi-disputa.png)

## Requisição

<aside class="request"><span class="method post">POST</span><span class="endpoint">{Risk Notification API}v2/contestation/{CaseNumber}</span></aside>

``` json
{
    "Files":
    [{
        "FileName": "file1.png",
        "Content": "asdfghjkle ********** lkjhgfdsa"
    },
    {
        "FileName": "file2.jpg",
        "Content": "zxcvbnmasd ********** qwertyuio"
    },
    {
        "FileName": "file3.jpg",
        "Content": "qwertyuiop ********** asdfghjkl"
    }]
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo da autorização|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `MerchantId` deverá ser enviada|sim|
|`MerchantId`|mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm|Id da loja na Braspag <br/> Obs.: Caso esta Key não seja enviada, obrigatoriamente a `EstablishmentCode` deverá ser enviada|sim|

**Parâmetros na rota**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso do chargeback|sim|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-|:-|
|`Files[n].FileName`|Nome do arquivo com extensão <br/> Obs.: Extensões permitidas: pdf, png, jpg ou jpeg <br/> Obs2.: A soma de todos arquivos deve ter no máximo 7mb de tamanho <br/> Obs3.: O prazo para realizar a contestação são de 7 dias corridos, ou seja, chargeback de 13/02/2019 é possível enviar a realizar a mesma até 19/02/2019|string|sim|100|
|`Files[n].Content`|Conteúdo do arquivo em base64|string|sim|-|

## Resposta

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

# Erros de integração

## Erros na aceitação ou disputa de chargeback

Confira as respostas possíveis para os seguintes cenários de erros no envio da requisição de aceitação ou disputa:

* **Chargeback inexistente**: o CaseNumber não existe;
* **Chargeback repetido**: o CaseNumber já foi aceito ou disputado anteriormente.

### Chargeback inexistente

Ocorre quando o `CaseNumber` informado não existe.

```json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parâmetros no cabeçalho (Header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parâmetros no body (Corpo)**

|KEY|VALUE|
|---|---|
|`Code`|Código que o chargeback não foi encontrado.|
|`Message`|Mensagem que o chargeback não foi encontrado.|

### Chargeback repetido

Ocorre quando o `CaseNumber` informado já foi aceito ou disputado anteriormente.

```json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
}
```

**Parâmetros no cabeçalho (Header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|KEY|VALUE|
|---|---|
|`Code`|Código que o chargeback foi aceito ou contestado anteriormente.|
|`Message`|Mensagem que o chargeback foi aceito ou contestado anteriormente.|

## Erros na disputa de chargeback

### Arquivo de disputa não enviado

Ocorre quando a requisição de disputa é enviada sem o nome e/ou conteúdo do arquivo.

```json
{
    "Message": "The request is invalid.",
    "ModelState": {
        "contestationRequest.Files[0].FileName": [
        "FileName can not be null or empty."
    ],
    "contestationRequest.Files[0].Content": [
        "Content can not be null or empty."
    ]}
}
```

**Parâmetros no cabeçalho (Header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|PARÂMETRO|DESCRIÇÃO|
|---|---|
|`Message`|Mensagem informando que a requisição é inválida.|
|`Message.ModelState.ContestationRequest.Files[n].FileName`|Mensagem informando que o nome do arquivo não foi enviado.|
|`Message.ModelState.ContestationRequest.Files[n].Content`|Mensagem informando que o conteúdo do arquivo não foi enviado.|

### Arquivo com extensão inválida 

O arquivo de contestação deve ter extensão JPEG, JPG, PNG ou PDF. Caso a extensão do arquivo enviado seja diferente das mencionadas, o retorno será o erro a seguir:

```json
{
    "Message": "The request is invalid.",
    "ModelState": {
    "contestationRequest.Files[0].FileName": [
        "The file extension must be sent. The accepted extensions are: '.png', '.jpg', '.jpeg'"
    ]}
}
```

**Parâmetros no cabeçalho (Header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|PARÂMETRO|DESCRIÇÃO|
|---|---|
|`Message`|Mensagem informando que a requisição é inválida.|
|`Message.ModelState.ContestationRequest.Files[n].FileName`|Mensagem informando que o arquivo foi enviado com a extensão inválida.|

### Arquivo com tamanho acima do permitido

Ocorre quando o arquivo enviado ou a soma dos arquivos enviados for superior à 7MB.

**Mensagem para arquivo superior à 7MB**

```json
{
    "Message": "File(s) file1.png, file2.png has length bigger than the size limit of 7MB."
}
```

**Mensagem para soma de arquivos superior à 7MB**

```json
{
    "Message": "Files has length bigger than the size limit of 7MB.",
}
```

**Parâmetros no cabeçalho (Header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|PARÂMETRO|DESCRIÇÃO|
|---|---|
|`Message`|Mensagem informando qual(is) arquivo(s) possuem tamanho superior a 7MB<br>ou<br>mensagem informando que a soma de tamanho de todos os arquivos enviados é superior a 7MB.|

# Tabelas

## Tabela 1 - Lista Negativa da Cybersource

Valores que podem ser retornados na lista negativa da Cybersource para retroalimentação de chargeback. Esses valores são retornados na resposta da consulta, no campo `Chargebacks.Transaction.NegativeValues`.

Válidos apenas para clientes integrados à API Antifraude Gateway com a Cybersource como provedor do Antifraude.

|Retornos possíveis|Descrição|
|:-|:-|
|Endereço IP do cliente|Endereço de IP do comprador.|
|Telefone|Número de telefone do comprador.|
|Endereço de entrega|Logradouro do endereço de entrega.|
|Fingerprint|Identificação do dispositivo do comprador.|
|E-mail|E-mail do comprador.|
|Cartão de crédito|Número mascarado do cartão de crédito do comprador.|

## Tabela 2 - Status do chargeback

Possíveis valores do chargeback retornados no campo `Chargebacks.Status` na Consulta.

|Status|Valor|Descrição|
|:-|:-|:-|
|1|Received|Chargeback recebido da adquirente|
|2|AcceptedByMerchant|Chargeback aceito pela loja. Neste caso a loja entende que sofreu de fato um chargeback e não irá realizar a disputa|
|3|ContestedByMerchant|Chargeback disputado pela loja. Neste caso a loja enviou os documentos necessários para tentar reverter o chargeback.|

## Tabela 3 - Marcação de chargeback no provedor de Antifraude

Quando há tentativa de retroalimentação de chargeback na Cybersource, este provedor de Antifraude retorna se a marcação de chargeback foi aceita ou não.

O resultado da marcação retorna na resposta da Consulta, no campo `Chargebacks[n].Transaction.ProviderChargebackMarkingEvent.Status`.

|Valor|Descrição|Provider|
|:-|:-|:-|
|ACCEPT|Marcação de chargeback aceita no provedor.|Cybersource|
|REJECT|Marcação de chargeback rejeitada no provedor.|Cybesource|

## Tabela 4 - API de Antifraude

Indica qual é a API de Antifraude usada pela loja. Os valores são retornados na resposta da Consulta, no campo `Chargebacks[n].Transaction.AntifraudSourceApplication`.

|Valor|Descrição|
|:-|:-|
|Gateway|Antifraude Gateway|
|Legacy|Antifraude Legado|

## Tabela 5 - Motivo do chargeback

A tabela a seguir apresenta o `ReasonCode` e o `ReasonMessage` retornados na resposta da Consulta de Chargeback, e que compõem o motivo do chargeback.

|REASON CODE|DESCRIÇÃO|Bandeira|Fraude?|
|:-|:-|:-|:-|
|137|Mercadoria / Serviço Cancelado|Visa|Não|
|127|Dados inválidos|Visa|Não|
|113|Não Autorizada|Visa|Não|
|136|Crédito não processado|Visa|Não|
|125|Valor incorreto|Visa|Não|
|132|Recorrência Cancelada|Visa|Não|
|123|Moeda Incorreta|Visa|Não|
|133|Mercadoria / Serviço defeituoso ou diferente do descrito|Visa|Não|
|112|Autorização Recusada|Visa|Não|
|134|Mercadoria falsificada|Visa|Não|
|135|Venda Enganosa|Visa|Não|
|102|Responsabilidade EMV - Sem Falsificação|Visa|Sim|
|101|Responsabilidade EMV - Falsificação|Visa|Sim|
|122|Código de transação incorreto|Visa|Não|
|105|Programa Visa de Monitoramento de Fraude|Visa|Sim|
|126|Processamento duplicado / pago por outros meios|Visa|Não|
|131|Mercadoria / Serviços não recebidos|Visa|Não|
|103|Outras Fraudes - Cartão Presente|Visa|Sim|
|121|Apresentação Tardia|Visa|Não|
|111|Boletim de recuperação de cartões|Visa|Não|
|138|Transação de crédito original não aceita|Visa|Não|
|104|Outras Fraudes - Cartão Ausente|Visa|Sim|
|124|Número de conta incorreto|Visa|Não|
|4846|Código Correto da Moeda da Transação Não Fornecido|Master|Não|
|4857|Transação Telefônica Ativada por Cartão|Master|Não|
|4859|Serviços Não Prestados|Master|Não|
|4812|Número da Conta Não Consta no Arquivo (inexistente)|Master|Não|
|4807|Arquivo Boletim de Advertência|Master|Não|
|4808|Autorização requerida não Obtida|Master|Não|
|4870|Transferência de Responsabilidade do Chip|Master|Sim|
|4853|Desacordo Comercial|Master|Não|
|4847|Excede o Limite de Piso - Transação Não Autorizada|Master|Não|
|4837|Sem Autorização do Portador do Cartão|Master|Sim|
|4871|Transf. de Responsabilidade do Chip/Senha (Europa)|Master|Sim|
|4849|Estabelecimento Comercial de Atividades Suspeitas|Master|Sim|
|4841|Transação Recorrente Cancelada|Master|Não|
|4842|Apresentação Tardia|Master|Não|
|4855|Mercadoria Não Recebida|Master|Não|
|4850|Portador Não Reconhece|Master|Sim|
|4840|Processamento Fraudulento da Transação|Master|Sim|
|4863|Portador Não Reconhece a Transação  Potencial de|Master|Sim|
|4831|Valor da Transação é diferente|Master|Não|
|4854|Contestação do Portador de Cartão (EUA)|Master|Sim|
|4860|Crédito Não Processado|Master|Não|
|4834|Erro de processamento|Master|Não|
|4862|Transação Falsificada por Fraude da Tarja Magnética|Master|Sim|
|4835|Cartão Inválido ou Vencido|Master|Não|
|4554|Bens e Serviços Não Recebidos|Amex|Não|
|4515|Pagamento por outros meios|Amex|Não|
|4527|Ausência de Impressão|Amex|Sim|
|4523|Número de Conta de Associado do Cartão Não Atribuído|Amex|Não|
|4517|Cópia atendida ilegível/incompleta|Amex|Não|
|4752|Erro de Apresentação de Crédito/Débito|Amex|Não|
|4530|Discrepância de Moeda|Amex|Não|
|4516|Cópia não atendida|Amex|Não|
|4799|Trans. de Resp. por Fraude Perda Roubo não rec.|Amex|Sim|
|4536|Apresentação Tardia|Amex|Não|
|4750|Débito de Aluguel de Carro Não Qualificado|Amex|Não|
|4755|Sem Autorização Válida|Amex|Não|
|4553|Mercadoria Defeituosa ou Não Conforme Descrita|Amex|Não|
|4754|Contestação Regulatória/Legal Local|Amex|Não|
|4540|Cartão não presente|Amex|Sim|
|4544|Cancelamento de Bens/Serviços Recorrentes|Amex|Não|
|4513|Crédito não processado|Amex|Não|
|4534|ROCs Múltiplos|Amex|Não|
|4763|Direito de Regresso Integral por Fraude|Amex|Sim|
|4507|Valor da Transação Incorreto ou Número de Conta|Amex|Não|
|4798|Transferência de Responsabilidade por Fraude|Amex|Sim|
|4521|Autorização inválida|Amex|Não|
|4512|Múltiplos processamentos|Amex|Não|
|41|Transação Recorrente Cancelada|Elo|Não|
|71|Autorização Negada|Elo|Não|
|74|Apresentação Tardia|Elo|Não|
|75|Portador não se lembra da transação|Elo|Sim|
|62|Transação falsificada (Transferência de Responsabilidade)|Elo|Sim|
|82|Duplicidade de Processamento|Elo|Não|
|53|Mercadoria com defeito ou em desacordo|Elo|Não|
|83|Fraude em Ambiente de Cartão Não Presente|Elo|Sim|
|80|Valor da Transação ou número de cartão incorreto|Elo|Não|
|76|Moeda inválida|Elo|Não|
|30|Serviço Não Prestado ou Mercadoria Não recebida|Elo|Não|
|72|Sem Autorização|Elo|Não|
|85|Crédito Não Processado|Elo|Não|
|73|Cartão Vencido|Elo|Não|
|81|Fraude em Ambiente de Cartão Presente|Elo|Sim|
|70|Cartão em Boletim|Elo|Não|
|86|Pagamentos por outros Meios|Elo|Não|
|4812|Número da Conta Não Consta no Arquivo (inexistente)|Diners|Não|
|4841|Transação Recorrente Cancelada|Diners|Não|
|4850|Portador Não Reconhece|Diners|Sim|
|4846|Código Correto da Moeda da Transação Não Fornecido|Diners|Não|
|4847|Excede o Limite de Piso - Transação Não Autorizada|Diners|Não|
|4859|Serviços Não Prestados|Diners|Não|
|4831|Valor da Transação é diferente|Diners|Não|
|4849|Estabelecimento Comercial de Atividades Suspeitas|Diners|Sim|
|4835|Cartão Inválido ou Vencido|Diners|Não|
|4842|Apresentação Tardia|Diners|Não|
|4807|Arquivo Boletim de Advertência|Diners|Não|
|4871|Transf. de Responsabilidade do Chip/Senha (Europa)|Diners|Sim|
|4855|Mercadoria Não Recebida|Diners|Não|
|4808|Autorização requerida não Obtida|Diners|Não|
|4837|Sem Autorização do Portador do Cartão|Diners|Sim|
|4840|Processamento Fraudulento da Transação|Diners|Sim|
|4853|Desacordo Comercial|Diners|Não|
|4834|Erro de processamento|Diners|Não|
|4808|Autorização requerida não Obtida|Hipercard|Não|
|4834|Erro de processamento|Hipercard|Não|
|4860|Crédito Não Processado|Hipercard|Não|
|4857|Transação Telefônica Ativada por Cartão|Hipercard|Não|
|4850|Portador Não Reconhece|Hipercard|Sim|
|4807|Arquivo Boletim de Advertência|Hipercard|Não|
|4859|Serviços Não Prestados|Hipercard|Não|
|4862|Transação Falsificada por Fraude da Tarja Magnética|Hipercard|Sim|
|4849|Estabelecimento Comercial de Atividades Suspeitas|Hipercard|Sim|
|4853|Desacordo Comercial|Hipercard|Não|
|4837|Sem Autorização do Portador do Cartão|Hipercard|Sim|
|4847|Excede o Limite de Piso - Transação Não Autorizada|Hipercard|Não|
|4871|Transf. de Responsabilidade do Chip/Senha (Europa)|Hipercard|Sim|
|4812|Número da Conta Não Consta no Arquivo (inexistente|Hipercard|Não|
|4831|Valor da Transação é diferente|Hipercard|Não|
|4840|Processamento Fraudulento da Transação|Hipercard|Sim|
|4841|Transação Recorrente Cancelada|Hipercard|Não|
|4870|Transferência de Responsabilidade do Chip|Hipercard|Sim|
|4863|Portador Não Reconhece a Transação|Hipercard|Sim|
|4842|Apresentação Tardia|Hipercard|Não|
|4854|Contestação do Portador de Cartão (EUA)|Hipercard|Sim|
|4855|Mercadoria Não Recebida|Hipercard|Não|
|4835|Cartão Inválido ou Vencido|Hipercard|Não|
|4846|Código Correto da Moeda da Transação Não Fornecido|Hipercard|Não|

# Matriz

## Matriz 1 - Documentos

|Segmento/Motivo|Documentos Padrão|Portador não Reconhece a Transação|Mercadoria não Recebida|Serviços não Prestados|Mercadoria com Defeito/Não Confere|Crédito Não Processado|Processamento Duplicado/Pagamentos por Outros Meios|
|---|---|---|---|---|---|---|---|
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
