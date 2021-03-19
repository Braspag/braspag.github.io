---
layout: manual
title: Split de Pagamentos - Agenda Financeira / Conciliação
description: Manual de Integração API Split de Pagamentos
search: true
toc_footers: false
categories: manual
sort_order: 6
hub_visible: false
tags:
  - 6. Soluções para Marketplace
---

# Introdução

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar sua plataforma a API do Split de Pagamentos, descrevendo os serviços disponíveis com exemplos de requisição e resposta.  

O Split de Pagamentos se divide em **Transacional** e **Agenda Financeira / Conciliação**.  

## Transacional

As operações transacionais serão responsáveis pela criação de novas transações e manipulação, permitindo que sejam capturas, canceladas ou estornadas de acordo com seus prazos.  
Possuímos duas maneiras de integração com as API transacionais, são elas:  

>[**Pagador Braspag**](https://braspag.github.io//manual/split-de-pagamentos-pagador)  
>[**Cielo 3.0**](https://braspag.github.io//manual/split-de-pagamentos-cielo-e-commerce)

## Agenda Financeira / Conciliação

As operações de gerenciamento do Split de Pagamento serão exploradas nessa documentação, elas lhe permitem acessar serviços como:  

* Pós Transacional
* Agenda Financeira
* Chargeback (Divisão)
* Liquidação (Trava)
* Antecipação (Liberação)

## Ambientes

Disponibilizamos de dois ambientes para a integração com a API, com o ambiente de Sandbox é possível realizar a homologação e testes de sua integração, no ambiente de Produção serão realizadas as transações reais.  

### Sandbox

* **API Split**: https://splitsandbox.braspag.com.br/
* **Braspag OAUTH2 Server**: https://authsandbox.braspag.com.br/  

> Solicite suas credenciais para o ambiente de teste em nosso portal de suporte https://suporte.braspag.com.br ou pelo telefone 3003-6554

### Produção

* **API Split**: https://split.braspag.com.br/
* **Braspag OAUTH2 Server**: https://auth.braspag.com.br/  

<aside class="notice">Credenciais de acesso são utilizadas para autenticar todas as requisições feitas para os endpoints da API.</aside>
<aside class="warning">Por segurança, essas credenciais não devem ser indevidamente compartilhadas ou expostas.</aside>

## Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais, que deverá posteriormente ser enviado a API do Split.

Para obter um token de acesso:

1. Concatene o ClientId e ClientSecret: `ClientId:ClientSecret`.  
2. Codifique o resultado da concatenação em Base64.  
3. Realize uma requisição ao servidor de autorização:  

**Request**  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

**Response**

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O ClientId é o identificador dentro da Braspag, conhecido também como MerchantId.  
> O ClientSecret é a chave utilizada na autenticação.

O token retornado (`access_token`) deverá ser utilizado em toda requisição à API Split como uma chave de autorização. O mesmo possui uma validade de 20 minutos e deverá ser obtido um novo token toda vez que o mesmo expirar.  

# Pós Transacional

O Split de Pagamentos disponibiliza dois modelos para divisão da transação entre os participantes:

| Tipo                       | Descrição                                                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Split Transacional**     | O **Marketplace** envia na autorização (captura automática) ou no momento de captura as regras de divisão. Utilizado nas APIs transacionais.|
| **Split Pós-Transacional** | O **Marketplace** envia as regras de divisão após a captura da transação. Utilizado na API Split.|

> No Split de Pagamentos a divisão é realizada somente para transações capturadas, ou seja, as regras de divisão só serão consideradas para autorizações com captura automática e no momento da captura de uma transação. Caso seja informado no momento de uma autorização sem captura automática, as regras de divisão serão desconsideradas.  

No modelo **Pós Transacional** o Marketplace poderá enviar as regras de divisão da transação após a mesma ser capturada.

Para transações com **Cartão de Crédito** este período é de **20 dias** e para as transações com **Cartão de Débito** este período é de **1 dia**, se o Marketplace possuir um regime padrão de pagamentos. Caso tenha um regime personalizado, o período deverá ser acordado entre as partes (Marketplace e Braspag (Facilitador)).

> O período para redividir uma transação poderá ser alterado pela Braspag (Facilitador).

**Request**

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{api-split}/api/transactions/{PaymentId}/split</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
        "Amount": 6000,
        "Fares": {
            "Mdr": 5,
            "Fee": 30
        }
    },
    {
        "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
        "Amount":4000,
        "Fares":{
            "Mdr":4,
            "Fee":15
        }
    }
]
```

| Propriedade                             | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `SplitPayments.SubordinateMerchantId`   | **MerchantId** (Identificador) do **Subordinado**.                                                      | Guid    | 36      | Sim         |
| `SplitPayments.Amount`                  | Parte do valor total da transação referente a participação do **Subordinado**, em centavos.             | Inteiro | -       | Sim         |
| `SplitPayments.Fares.Mdr`               | **MDR(%)** do **Marketplace** a ser descontado do valor referente a participação do **Subordinado**     | Decimal | -       | Não         |
| `SplitPayments.Fares.Fee`               | **Tarifa Fixa(R$)** a ser descontada do valor referente a participação do **Subordinado**, em centavos. | Inteiro | -       | Não         |

**Response**

```json
{
    "PaymentId": "c96bf94c-b213-44a7-9ea3-0ee2865dc57e",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                    "Amount": 5670
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
            "Amount": 4000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                    "Amount": 3825
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "Amount": 175
                }
            ]
        }
    ]
}
```

| Propriedade                                  | Descrição                                                                                   | Tipo   | Tamanho | Obrigatório |
|----------------------------------------------|---------------------------------------------------------------------------------------------|--------|---------|-------------|
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **Subordinado** ou **Marketplace**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Marketplace**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         | 

# Agenda Financeira

No Split de Pagamentos, o responsável por realizar o repasse dos valores (liquidação) a cada um dos participantes de uma venda é a Braspag (Facilitador).

A Braspag irá gerar uma agenda financeira que poderá ser consultada a qualquer momento pelo Marketplace e/ou Subordinados.

A agenda é composta por eventos de Crédito e Débito que são gerados de acordo com as operações efetuadas e o regime de pagamento acordado.

Eventos de **Crédito**:

| Id | Evento                         | Descrição                                                                                               |
|----|--------------------------------|---------------------------------------------------------------------------------------------------------|
| 1  | `Credit`                       | Lançamento de crédito das parcelas de uma transação.                                                    |
| 3  | `FeeCredit`                    | Lançamento de crédito da Tarifa Fixa acordada entre o Marketplace e a Braspag (Facilitador).            |
| 5  | `RefundCredit`                 | Lançamento de crédito devido a um cancelamento.                                                         |
| 7  | `ChargebackCredit`             | Lançamento de crédito devido a um chargeback.                                                           |
| 9  | `UndoChargebackCredit`         | Lançamento de crédito para reversão de um chargeback.                                                   |
| 11 | `AntiFraudFeeCredit`           | Lançamento de crédito referente à transação de antifraude.                                              |
| 13 | `AntiFraudFeeWithReviewCredit` | Lançamento de crédito referente à transação de antifraude com revisão manual.                           |
| 15 | `AdjustmentCredit`             | Lançamento de um crédito como ajuste.                                                                   |
| 17 | `ChargebackReversalCredit`     | Lançamento de crédito referente a reversão de um chargeback.                                            |
| 19 | `AnticipationCredit`           | Lançamento de crédito referente a antecipação.                                                          |
| 20 | `AnticipationCommissionCredit` | Lançamento de crédito referente a comissão de uma antecipação.                                          |

Eventos de **Débito**:

| Id | Evento                        | Descrição                                                                                               |
|----|-------------------------------|---------------------------------------------------------------------------------------------------------|
| 2  | `Debit`                       | Lançamento de débito das parcelas de uma transação.                                                     |
| 4  | `FeeDebit`                    | Lançamento de débito da Tarifa Fixa acordada entre o Marketplace e a Braspag (Facilitador).             |
| 6  | `RefundDebit`                 | Lançamento de débito devido a um cancelamento.                                                          |
| 8  | `ChargebackDebit`             | Lançamento de débito devido a um chargeback.                                                            |
| 10 | `UndoChargebackDebit`         | Lançamento de débito para reversão de um chargeback.                                                    |
| 12 | `AntiFraudFeeDebit`           | Lançamento de débito referente à transação de antifraude.                                               |
| 14 | `AntiFraudFeeWithReviewDebit` | Lançamento de débito referente à transação de antifraude com revisão manual.                            |
| 16 | `AdjustmentDebit`             | Lançamento de um débito como ajuste.                                                                    |
| 18 | `ChargebackReversalDebit`    | Lançamento de débito referente a reversão de um chargeback.                                             |
| 22 | `AnticipationCommissionDebit` | Lançamento de débito referente a comissão de uma antecipação.                                           |

Um evento poderá estar em um dos seguintes status na agenda financeira:

* **Scheduled**: Agendado.
* **Pending**: Aguardando confirmação de liquidação.
* **Settled**: Liquidado.
* **Error**: Erro de liquidação na instituição financeira.
* **WaitingForAdjustementDebit**: Aguardando liquidação do ajuste de débito associado.
* **Anticipated**: Evento antecipado.

## Consultar Eventos

A API Split permite consultar o que uma loja tem a receber dentro de um intervalo de datas.

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialForecastedDate={initialDate}&finalForecastedDate={finalDate}&pageIndex={pageIndex}&pageSize={pageSize}&eventStatus={eventStatus}&merchantIds={merchantId}</span></aside>

| Parâmetro                  | Descrição                                                                            | Tipo    | Formato    | Obrigatório | Valor Padrão          |
|----------------------------|--------------------------------------------------------------------------------------|---------|------------|-------------|-----------------------|
| `InitialForecastedDate`    | Data de pagamento prevista inicial a ser consultada.                                 | Data    | YYYY-MM-DD | Não         | CurrentDate           |
| `FinalForecastedDate`      | Data de pagamento prevista final a ser consultada.                                   | Data    | YYYY-MM-DD | Não         | InitialForecastedDate |
| `InitialPaymentDate`       | Data de pagamento inicial a ser consultada.                                          | Data    | YYYY-MM-DD | Não         | -                     |
| `FinalPaymentDate`         | Data de pagamento final a ser consultada.                                            | Data    | YYYY-MM-DD | Não         | InitialPaymentDate    |
| `PageIndex`                | Página a ser consultada.                                                             | Inteiro | -          | Não         | 1                     |
| `PageSize`                 | Tamanho da página. Valores possíveis: 25, 50, 100.                                   | Inteiro | -          | Não         | 25                    |
| `EventStatus`              | Status do evento [Scheduled - Pending - Settled - Error - WaitingFoAdjustementDebit - Anticipated].| String  | -          | Não         | Todos                 |
| `IncludeAllSubordinates`   | Inclui todos os subordinados na consulta.                                            | Boolean | -          | Não         | false                 | 
| `MerchantIds`              | Lojas a serem consideradas na consulta.                                              | Guid    | -          | Não         | -                     |

**Resquest**

### Por Data Prevista de Pagamento

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialForecastedDate=2017-12-01&finalForecastedDate=2018-12-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

### Por Data de Pagamento

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialPaymentDate=2018-08-22&finalPaymentDate=2018-08-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"
```

**Response**

```json
{
    "PageCount": 1,
    "PageSize": 25,
    "PageIndex": 1,
    "Schedules": [
        {
            "Id": "b579fafb-8271-4a1d-a657-00e5fd9b9f83",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 6,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "2f110f0d-82c9-4a1f-8df5-08203348d160",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 9,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "01d9b78f-b287-4376-a5e4-12d91cde1938",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 2,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "e30760d7-01e2-4b2b-9a43-2b252fcfbd84",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9262,
            "InstallmentNumber": 10,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "90ea1e11-568f-49ee-bc3f-7ab2a225a1e1",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 1,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        }
    ]
}
```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `Schedules[].Id`                  | Identificador do evento na agenda financiera.                                                           | Guid    | 36      |
| `Schedules[].PaymentId`           | Identificador da transação.                                                                             | Guid    | 36      |
| `Schedules[].MerchantId`          | Identificador da loja.                                                                                  | Guid    | 36      |
| `Schedules[].PaymentDate`         | Data de liquidação. Retornada somente quando pagamento realizado (EventStatus = Settled)                | Data    | -       |
| `Schedules[].ForecastedDate`      | Data de liquidação prevista.                                                                            | Data    | -       |
| `Schedules[].Installments`        | Número de parcelas da transação.                                                                        | Inteiro | -       |
| `Schedules[].InstallmentAmount`   | Valor, em centavos, da parcela a liquidar.                                                              | Inteiro | -       |
| `Schedules[].InstallmentNumber`   | Número da parcela a liquidar.                                                                           | Inteiro | -       |
| `Schedules[].Event`               | Identificador do evento.                                                                                | Inteiro | -       |
| `Schedules[].EventDescription`    | Descrição do evento.                                                                                    | String  | -       |
| `Schedules[].EventStatus`         | Status do evento. [Scheduled - Pending - Settled - Error - WaitingForAdjustementDebit]                  | String  | -       |

## Consultar Transações

O Split de Pgamentos permite consultar a agenda financeira de várias transações ou de uma transação específica.

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/transactions?initialCaptureDate={initialDate}&finalCaptureDate={finalDate}&pageIndex={pageIndex}&pageSize={pageSize}&eventStatus={eventStatus}&merchantIds={merchantId}</span></aside>

| Parâmetro               | Descrição                                                                     | Tipo    | Formato    | Obrigatório | Valor Padrão       |
|-------------------------|-------------------------------------------------------------------------------|---------|------------|-------------|--------------------|
| `InitialCaptureDate`    | Data inicial a ser consultada, considerando a data de captura das transações. | Data    | YYYY-MM-DD | Não         | CurrentDate        |
| `FinalCaptureDate`      | Data final a ser consultada, considerando a data de captura das transações.   | Data    | YYYY-MM-DD | Não         | InitialCaptureDate |
| `PageIndex`             | Página a ser consultada.                                                      | Inteiro | -          | Não         | 1                  |
| `PageSize`              | Tamanho da página.  Valores possíveis: 25, 50, 100.                           | Inteiro | -          | Não         | 25                 |
| `EventStatus`           | Status do evento [Scheduled - Pending - Settled - Error - Anticipated].                     | String  | -          | Não         | Todos              |
| `IncludeAllSubordinates`| Inclui todos os subordinados na consulta.                                     | Boolean | -          | Não         | false              |
| `MerchantIds`           | Lojas a serem consideradas na consulta.                                       | Guid    | -          | Não         | -                  |

Para informar várias lojas na consulta, basta repetir o parâmetro "merchantIds". Caso não seja informada nenhuma loja, será considerada a loja utilizada na autenticação à API Split.

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/transactions?initialCaptureDate=2017-12-01&finalCaptureDate=2017-12-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

**Response**

```json
{
    "PageCount": 1,
    "PageSize": 25,
    "PageIndex": 1,
    "Transactions": [
        {
            "PaymentId": "24afaaaf-f2a1-40a5-bb25-f914fa623c4c",
            "CapturedDate": "2017-12-01",
            "Schedules": [
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 24357,
                    "InstallmentNumber": 1,
                    "Event": "Credit",
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 1450,
                    "InstallmentNumber": 1,
                    "Event": "Credit",
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 38480,
                    "InstallmentNumber": 1,
                    "Event": "Credit",
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 5,
                    "InstallmentNumber": 1,
                    "Event": "FeeDebit",
                    "EventDescription": "FeeDebit",
                    "EventStatus": "Scheduled"
                },
            ]
        }
    ]
}
```

| Propriedade                                      | Descrição                                                                                               | Tipo    | Tamanho |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `Transactions[].PaymentId`                       | Identificador da transação.                                                                             | Guid    | 36      |
| `Transactions[].CaptureDate`                     | Data de captura da transação.                                                                           | Data    | -       |
| `Transactions[].Schedules[].MerchantId`          | Identificador da loja.                                                                                  | Guid    | 36      |
| `Transactions[].Schedules[].PaymentDate`         | Data de liquidação. Retornada somente quando pagamento realizado (EventStatus = Settled)                | Data    | -       |
| `Transactions[].Schedules[].ForecastedDate`      | Data de liquidação prevista.                                                                            | Data    | -       |
| `Transactions[].Schedules[].Installments`        | Número de parcelas a liquidar.                                                                          | Inteiro | -       |
| `Transactions[].Schedules[].InstallmentsAmount`  | Valor, em centavos, da parcela a liquidar.                                                              | Inteiro | -       |
| `Transactions[].Schedules[].InstallmentNumber`   | Número da parcela a liquidar.                                                                           | Inteiro | -       |
| `Transactions[].Schedules[].Event`               | Identificador do evento.                                                                                | Inteiro | -       |
| `Transactions[].Schedules[].EventDescription`    | Descrição do evento.                                                                                    | String  | -       |
| `Transactions[].Schedules[].EventStatus`         | Status do evento. [Scheduled - Pending - Settled - Error - Anticipated]                                               | String  | -       |

Para consultar a agenda de uma transação específica basta informar o identificador da transação na requisição.

Neste caso poderão ser utilizados os filtros MarchantIds e EventStatus.

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/transactions/{PaymentId}?merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"
```

**Response**

```json
{
    "PageCount": 1,
    "PageSize": 25,
    "PageIndex": 1,
    "Transactions": [
        {
            "PaymentId": "cd2309d3-3fec-4816-aec7-bcb6d51a0988",
            "CapturedDate": "2017-12-11",
            "Schedules": [
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "ForecastedDate": "2018-01-11",
                    "Installments": 1,
                    "InstallmentAmount": 5790,
                    "InstallmentNumber": 1,
                    "Event": 1,
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "ForecastedDate": "2018-01-11",
                    "Installments": 1,
                    "InstallmentAmount": 3790,
                    "InstallmentNumber": 1,
                    "Event": 1,
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                }
            ]
        }
    ]
}
```

## Ajustes

O Split de Pagamentos permite que sejam lançados ajustes à crédito e à débito nas agendas dos Subordinados.

Um ajuste somente será efetivamente liquidado para os evolvidos caso o participante a ser debitado possua saldo positivo na data prevista informada para efetivação do ajuste. Caso contrário, a liquidação do ajuste será postergada, para ambos os envolvidos, até que o participante a ser debitado tenha saldo positivo para cobrir o valor do ajuste.

**Ex:** Marketplace lança um ajuste a débito de R$100,00 para o Subordinado A com data prevista de cobrança em 17/10/2018.

**Caso 1)** Subordinado possui saldo positivo na data prevista informada.

![SplitSampleadjustment001](https://braspag.github.io/images/braspag/split/adjustment001.png)

Os valores até o dia 16/10/2018 foram liquidados normalmente.

Como o subordinado tinha R$150,00 para receber no dia 17/10/2018, o ajuste foi lançado na agenda financeira na data prevista informada e o mesmo receberá R$50,00 devido ao débito do ajuste.

O participante a ser creditado terá a efetivação do crédito na mesma data de efetivação do débito, ou seja, receberá R$150,00 no dia 17/10/2018.

**Caso 2)** Subordinado não possui saldo positivo na data prevista informada.

![SplitSampleadjustment002](https://braspag.github.io/images/braspag/split/adjustment002.png)

Os valores até o dia 16/10/2018 foram liquidados normalmente.

O Subordinado tinha a receber apenas R$60,00 no dia 17/10/2018, o que não cobre o valore do ajuste a ser debitado do mesmo.

Neste cenário, os pagamentos do subordinado serão retidos até que o mesmo tenha saldo para cobrir o ajuste, o que ocorre no dia 19/10/2018, onde o acumulado retido é de R$130,00. Com isso, o subordinado receberá R$30,00.

O participante a ser creditado terá a efetivação do crédito na mesma data de efetivação do débito, ou seja, receberá R$150,00 no dia 19/10/2018.

### Criar Ajuste

A criação de um novo ajuste na agenda financeira deve ser realizado como o exemplo abaixo:

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/adjustment-api/adjustments/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
--header "Accept: application/json"
{
    "merchantIdToDebit": "EA4DB25A-F981-4849-87FF-026897E006C6",
    "merchantIdToCredit": "44F68284-27CF-43CB-9D14-1B1EE3F36838",
    "forecastedDate": "2018-09-17",
    "amount": 1000,
    "description": "Multa por não cumprimento do prazo de entrega no pedido XYZ",
    "transactionId": "717A0BD0-3D92-43DB-9D1E-9B82DFAFA392"
}
```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------| 
| `merchantIdToDebit`               | Merchant do qual o valor será debitado.                                                                 | GUID    | -       | Sim         |
| `merchantIdToCredit`              | Merchant para o qual o valor será creditado.                                                            | GUID    | -       | Sim         |
| `forecastedDate`                  | Data prevista para lançamento do ajuste na agenda financeira.                                           | String  | -       | Sim         |
| `amount`                          | Valor em centavos do ajuste.                                                                            | Inteiro | -       | Sim         |
| `description`                     | Decrição do ajuste.                                                                                     | String  | 500     | Sim         |
| `transactionId`                   | Identificador da transação para qual o ajuste está sendo lançado.                                       | Guid    | -       | Não         |

<aside class="warning">Ao associar o ajuste a uma transação, os envolvidos devem ser participantes da transação.</aside>

**Response**

```json
-- 201 - Created
{
    "id": "68465ddd-451a-4194-abca-be1ed71fb2ea",
    "merchantIdToDebit": "EA4DB25A-F981-4849-87FF-026897E006C6",
    "merchantIdToCredit": "44F68284-27CF-43CB-9D14-1B1EE3F36838",
    "forecastedDate": "2018-09-19",
    "amount": 1000,
    "description": "Multa por não cumprimento do prazo de entrega no pedido",
    "transactionId": "717A0BD0-3D92-43DB-9D1E-9B82DFAFA392",
    "status": "Created"
}
```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `id`                              | Identificador do ajuste.                                                                                | Guid    | 36      | -           |
| `status`                          | Status do ajustes [Created - Scheduled - Processed - Canceled ].                                        | String  | -       | -           |  

### Consulta de Ajustes

É possível realizar consulta de ajustes com base em um período.

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/adjustment-api/adjustments/?Status=Created&InitialCreationDate=2020-08-20&Page=1&PageSize=25</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"
```

| Parâmetro | Descrição | Tipo | Tamanho | Obrigatório |
|-----------|-----------|------|---------|-------------|
| `Status` | Status do ajuste [ `Created`, `Scheduled`, `Processed`, `Canceled`] | String | - | Sim |
| `InitialCreationDate` | Data de criação do ajuste | YYYY-MM-DD | - | Sim |
| `Page` | Índice da página | Inteiro | - | Não |
| `PageSize` | Quantidade total de itens por página | Inteiro | - | Não |  

**Response**

```json
-- 200 - OK
{
    "pagination": {
        "total": 1,
        "pageSize": 25,
        "currentPage": 1,
        "pageCount": 1,
        "lastPage": true
    },
    "items": [
        {
            "id": "61166084-eaa0-4b7f-9e48-0cf14653c872",
            "createdAt": "2021-03-19 15:18:18",
            "createdBy": "249c0073-94ac-4a1e-9931-8ca4efba8907",
            "merchantIdToDebit": "249c0073-94ac-4a1e-9931-8ca4efba8907",
            "merchantIdToCredit": "f5d3eeab-9fc8-4a6e-ba66-d676d5c1a5cb",
            "forecastedDate": "2021-03-30",
            "amount": 1000,
            "transactionId": "fa6633aa-ee0f-4b14-a558-0e15f2df2388",
            "description": "Bonificação",
            "status": "Created"
        }
    ]
}
```  

| Propriedade | Descrição | Tipo | Tamanho | Formato |
|----------|-----------|------|---------|-------------|
| `Pagination.Total` | Total de páginas | Inteiro | - | Número |
| `Pagination.PageSize` | Quantidade total de itens por página | Inteiro | - | Número |
| `Pagination.CurrentPage` | Página atual | Inteiro | - | Número |
| `Pagination.PageCount` | Quantidade de itens na página atual | Inteiro | - | Número |
| `Pagination.LastPage` | Última página | Booleano | - | `true` ou `false` |
| `Items[].Id` | Id do ajuste | GUID | - | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `Items[].CreatedAt` | Data de criação | String | - | yyyy-MM-dd hh:mm:ss |
| `Items[].MerchantIdToDebit` | Merchant do qual o valor será debitado | GUID | - | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `Items[].MerchantIdToCredit` | Merchant para o qual o valor será creditado | GUID | - | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `Items[].ForecastedDate` | Data de previsão | String | - | yyyy-MM-dd |
| `Items[].Amount` | Valor do ajuste em centavos | Inteiro | - | Número |
| `Items[].TransactionId` | Id da transação | GUID | - | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `Items[].Description` | Descrição do ajuste | String | 500 | Texto alfanumérico |

# Chargeback

No Split de Pagamentos o Marketplace pode definir se assumirá o chargeback ou o repassará para seus Subordinados, desde que acordado previamente entre as partes.

Se o Marketplace optar por repassar para os Subordinados, o Chargeback Total é sensibilizado automaticamente na agenda dos mesmos. Caso contrário o chargeback será sensibilizado automaticamente na agenda do Marketplace, como acontece com um Charback Parcial.

O Marketplace pode decidir ainda repassar o Chargeback para seus subordinados. Para isso a API Split disponibiliza um serviço onde o Marketplace pode informar como dividir o valor do chargeback entre os subordinados, caso seja um Chargeback Parcial.  

> É possível solicitar que todo chargeback seja repassado para o subordinado por padrão, mediante abertura de chamado.

No exemplo abaixo ocorreu um Chargeack Parcial no valor de R$60,00 de uma transação com valor capturado de R$100,00.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/api/chargebacks/{ChargebackId}/splits</span></aside>

```json
[
  {
    "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
    "ChargebackAmount": 4000
  },
  {
    "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
    "ChargebackAmount": 2000
  }
]

```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `SubordinateMerchantId`           | Identificador do Subordinado.                                                                           | Guid    | 36      |
| `ChargebackAmount`                | Valor do chargeback que deverá ser repassado ao Subordinado, em centavos.                               | Inteiro | -       |

**Response**

```json
{
    "ChargebackSplitPayments": [
        {
            "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "ChargebackAmount": 4000,
            "ChargebackSplits": [
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "ChargebackAmount": 3780
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ChargebackAmount": 220
                }
            ]
        },
        {
            "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "ChargebackAmount": 2000,
            "ChargebackSplits": [
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "ChargebackAmount": 1912
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ChargebackAmount": 88
                }
            ]
        }
    ]
}
```

> O Marketplace tem 1 dia, contado a partir da data de efetivação do chargeback, para informar como deseja repassar os valores aos subordinados.

| Propriedade                                | Descrição                                                                                               | Tipo    | Tamanho |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `ChargebackSplitPayments.ChargebackSplits` | Lista contendo a divisão do chargeback para cada participante.                                          | Guid    | 36      |

# Liquidação

A plataforma permite que o Master bloqueie temporariamente a liquidação para um Subordinado para garantia da entrega do produto/serviço, funcionalidade conhecida como Escrow.

## Trava

Este bloqueio, conhecido como custódia, pode durar até 180 dias. Após este prazo, a Braspag liquidará o valor para o subordinado independentemente do bloqueio.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{splitApi}/api/transactions/{paymentid}/settlements</span></aside>

**Request**

```json
[
    {
        "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
        "Locked": [true | false]
    },
    {
        "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
        "Locked": [true | false]
    },
]
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`SubordinateMerchantId`|Texto|36|Sim|Merchantid identificador do subordinado|
|`Locked`|Booleano|---|Sim|Booleano que identifica se o a liquidação será travada para o subordinado ou não|

# Antecipação

No Split de Pagamentos, para os clientes que estejam habilitados e optem por fazer uso de antecipações, existe a possibilidade de determinar quais transações podem participar de operações de antecipação.

O comportamento padrão é que todas as transações possam fazer parte de operações de antecipação, porém o Master pode determinar quais transações e quando estarão disponíveis.

Existem 4 momentos em que se pode liberar uma transação para participar de operações de antecipação:  

1. Na criação da transação, usando valor pré-configurado;
2. Na criação da transação, usando valor passado através do request (API Transacional);
3. Na redivisão pós transacional da transação;
4. Através de endpoint específico para liberação de transação para antecipação.

> Uma vez que a transação está liberada para participar de operações de antecipação, a mesma não pode mais ser bloqueada!

## Valor configurado

Entre em contato com o suporte para criar, atualizar ou remover a configuração com o estado (liberado ou bloqueado) com o qual a transação deve ser criada caso nenhum valor seja passado no request.

## Configuração no Transacional

Incluir o campo `Payment.SplitTransaction.ReleasedToAnticipation` na API transacional, tanto Cielo 3.0 quanto Pagador Braspag.

| Valor | Descrição |
|-|-|
| **true** | Com esta opção, a transação ficará liberada para antecipação e não poderá mais ser bloqueada. |
| **false** | Com esta opção, a transação estará bloqueada para ser usada em operações de antecipação e poderá ser liberada em um momento posterior. |

## Configuração no Pós Transacional

**Request**

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{api-split}/api/transactions/{PaymentId}/split?releasedToAnticipation=true</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
        "Amount": 6000,
        "Fares": {
            "Mdr": 5,
            "Fee": 30
        }
    },
    {
        "SubordinateMerchantId" :"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
        "Amount": 4000
    }
]
```

**Response**

```json
{
    "PaymentId": "c96bf94c-b213-44a7-9ea3-0ee2865dc57e",
    "MasterRateDiscountType": "Sale",
    "ReleasedToAnticipation": true,
    "SplitPayments": [
        {
            "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "Amount": 5670
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
            "Amount": 4000,
            "Fares": {
                "Mdr": 2,
                "Fee": 0
            },
            "Splits": [
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "Amount": 4000
                }
            ]
        }
    ]
}
```

## Endpoint de Liberação

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/anticipation-api/{PaymentId}/release-to-anticipation</span></aside>

**Response**

<aside class="request"><span class="method post">200 OK</span></aside>  

# Anexos  

## Lista de HTTP Status Code

| HTTP Status Code | Descrição             |
|------------------|-----------------------|
| 200              | OK                    |
| 400              | Bad Request           |
| 404              | Resource Not Found    |
| 500              | Internal Server Error |
