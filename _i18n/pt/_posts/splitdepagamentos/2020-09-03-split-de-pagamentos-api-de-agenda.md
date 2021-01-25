---
layout: manual
title: Split de Pagamentos API de Agenda
description: Manual integração do Split de Pagamentos
search: true
toc_footers: false
categories: manual
sort_order: 6
hub_visible: false
tags:

---

# Split de Pagamentos - API de Agenda

## Introdução

Para facilitar sua conciliação, disponibilizamos endpoints para que sejam obtidos os dados relevantes para o seu negócio.
Todos os eventos exibidos nesses endpoints já passaram pelo processo de agendamento, ou seja, todos os lançamentos relativos já foram registrados na agenda financeira dos participantes.

## Ambientes

**Sandbox**
- **apiSplitSchedule**: https://splitsandbox.braspag.com.br/schedule-api

**Produção**
- **apiSplitSchedule**: https://split.braspag.com.br/schedule-api

## Parâmetros

Os endpoints de conciliação para transações, cancelamentos e chargebacks suportam os seguintes parâmetros:

| Filtro                       | Descrição                                                                                               | Tipo    |
|------------------------------|---------------------------------------------------------------------------------------------------------|---------|
| `InitialScheduledAt`         | Data inicial em que uma transação foi agendada.                                                         | Date    |
| `FinalScheduledAt`           | Data que será utilizada como limite durante a busca                                                     | Data    |
| `Reversed`                   | Utilizado para indicar se o consumidor deseja pesquisar eventos que foram revertidos.                   | Bool    |
| `PageIndex`                  | Página a ser consultada.                                                                                | Int     |
| `PageSize`                   | Quantidade máxima de items por página. Valores possíveis: 25,50,100                                     | Int     |

## Conciliação de Vendas

O endpoint de conciliação de vendas permite consultar os dados relativo as transações conciliadas que ocorreram em determinado range de data. 

### Consulta por PaymentId

#### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{apiSplitSchedule}/v2/{PaymentId}</span></aside>

#### Response

```json
{

"PaymentId":  "e575da46-8b85-43fb-b28b-f48bfc61860b",

"Amount":  20000,

"Installments":  2,

"ChannelId":  2,

"Channel":  "PointOfSale",

"ScheduledAt":  "2020-01-24",

"Reversed":  false,

"TransactionFares":  {

"Fee":  0,

"Schedules":  [],

"DiscountedAmount":  620,

"AppliedMdr":  3.10

},

"PaymentArrangement":  {

"BrandId":  1,

"Brand":  "Visa",

"ProductId":  1,

"Product":  "CreditCard"

},

"TransactionDetails":  {

"CaptureDate":  "0001-01-01",

"Nsu":  "1043557",

"AuthorizationCode":  "78654328",

"AuthorizationDate":  "2019-11-25",

"StatusId":  12,

"Status":  "Pendente",

"TerminalLogicNumber":  "22222222"

},

"MasterRateDiscountTypeId":  "1",

"MasterRateDiscountType":  "Commission",

"Merchant":  {

"Id":  "247d032d-f917-4a52-8e7a-d850945f065e",

"Type":  "Master",

"FancyName":  "Operacoes Split",

"CorporateName":  "Operacoes Split"

},

"MasterSummary":  {

"TotalGrossAmount":  20000,

"TotalNetAmount":  19380

},

"Splits":  [

{

"PayoutBlocked":  false,

"Id":  "853473be-cd93-46c8-a81f-cd3a5222d0ab",

"NetAmount":  19380,

"GrossAmount":  20000,

"Fares":  {

"Mdr":  3.10,

"Fee":  0,

"DiscountedMdrAmount":  620

},

"Merchant":  {

"Id":  "247d032d-f917-4a52-8e7a-d850945f065e",

"Type":  "Master",

"FancyName":  "Operacoes Split",

"CorporateName":  "Operacoes Split"

},

"Schedules":  [

{

"Id":  "51faaf33-ac9e-4eed-b5fc-87260ac8ae75",

"ForecastedDate":  "2020-02-14",

"InstallmentNumber":  1,

"InstallmentAmount":  9690,

"EventId":  1,

"Event":  "Credit",

"EventStatusId":  2,

"EventStatus":  "Pending"

},

{

"Id":  "22bc889d-fc21-40b3-8a8a-09d71a2a036f",

"ForecastedDate":  "2020-03-16",

"InstallmentNumber":  2,

"InstallmentAmount":  9690,

"EventId":  1,

"Event":  "Credit",

"EventStatusId":  6,

"EventStatus":  "Anticipated"

}

]

}

]

}
```

|PROPRIEDADE|DESCRIÇÃO|TIPO|
|--------|---------------------------------|------|
|PaymentId|Identificador único da transação|GUID|
|Amount|Valor bruto da transação|Inteiro|
|Installments|Quantidade de parcelas da transação|Inteiro|
|ChannelId|Identificador do canal onde a transação ocorreu|Inteiro|
|hannel|Descrição do cancal onde a transação ocorreu|Texto|
|ScheduledAt|Data de agendamento da transação|Data|
|Reversed|Indica se a operação consultada foi revertida. (Transação, Cancelamento, Chargeback)|Booleano|
|TransactionFares.Fee|Tarifa fixa aplicada pela Braspag|Inteiro|
|TransactionFares.DiscountedAmount|Valor ganho pela Braspag em relação a transação. Em um cancelamento, esse valor também é cancelado.|Inteiro|
|TransactionFares.AppliedMdr|Mdr aplicado pela Braspag|Decimal|
|PaymentArrangement.BrandId|Id da Bandeira|Inteiro|
|PaymentArrangement.Brand|Descrição da Bandeira|Texto|
|PaymentArrangement.ProductId|Id do Produto|Inteiro|
|PaymentArrangement.Product|Descrição do Produto|Texto|
|TransactionDetails.CaptureDate|Data de captura da transação|Data|
|TransactionDetails.Nsu|Identificador NSU|Inteiro|
|TransactionDetails.AuthorizationCode|Código de autorização|Texto|
|TransactionDetails.AuthorizationDate|Data de autorização|Data|
|TransactionDetails.StatusId|Id do status|Inteiro|
|TransactionDetails.Status|Descrição do Status|Texto|
|TransactionDetails.TerminalLogicNumber|Número lógico do terminal em que a transação ocorreu|Texto|
|MasterRateDiscountTypeId|Tipo de desconto aplicado pela Braspag|Inteiro|
|MasterRateDiscountType|Descrição do desconto aplicado pela Braspag|Texto|
|Merchant.Id|MerchantId do Master da transação|GUID|
|Merchant.Type|Tipo do Merchant|Texto|
|Merchant.FancyName|Nome Fantasia do Master|Texto|
|Merchant.CorporateName|Razão social do Master|Texto|
|MasterSummary.TotalGrossAmount|Valor Bruto ganho pelo Master na transação|Inteiro|
|MasterSummary.TotalNetAmount|Valor Líquido ganho pelo Master na transação|Inteiro|
|Splits.[].PayoutBlocked|Identificador se a agenda está bloqueada para liquidação|Booleano|
|Splits.[].NetAmount|Valo líquido da venda referente ao participante|Inteiro|
|Splits.[].GrossAmount|Valor bruto da venda referente ao participante|Inteiro|
|Splits.[].Fares.Mdr|MDR aplicado sobre a venda do participante|Decimal|
|Splits.[].Fares.Fee|Tarifa aplicada sobre a venda do participante|Inteiro|
|Splits.[].Fares.DiscountedAmount|Valor discontado sobre a venda do participante|Inteiro|
|Splits.[].Merchant.Id|Identificador único (MerchantId) do participante da transação|GUID|
|Splits.[].Merchant.Type|Tipo do Merchant|Texto|
|Splits.[].Merchant.FancyName|Nome Fantasia do Participante|Texto|
|Splits.[].Merchant.CorporateName|Razão social do participante|Texto|
|Splits.[].Schedules.[].Id|Identificador único da agenda|GUID|
|Splits.[].Schedules.[].ForecastedDate|Data prevista para a liquidação da agenda|Data|
|Splits.[].Schedules.[].InstallmentNumber|Número da parcela a qual a agenda se refere|Inteiro|
|Splits.[].Schedules.[].InstallmentAmount|Valor líquido da agenda|Inteiro|
|Splits.[].Schedules.[].EventId|Identificador do Evento da agenda|Inteiro|
|Splits.[].Schedules.[].Event|Descrição do evento da agenda|Texto|
|Splits.[].Schedules.[].EventStatusId|Identificador do status da agenda|Inteiro|
|Splits.[].Schedules.[].EventStatus|Descrição do status da agenda|Texto|

### Consulta por data de agendamento

#### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{apiSplitSchedule}/v2/transactions?initialScheduledAt=2020-09-03&finalScheduledAt=2020-09-04&Reversed=False</span></aside>

#### Response

```json
{
    "PageCount": 1,
    "PageIndex": 1,
    "PageSize": 25,
    "Items": [
        {
            "PaymentId": "eaeb0522-1430-4f6e-91a5-492bf613a912",
            "Amount": 10000,
            "Installments": 1,
            "ChannelId": 1,
            "Channel": "ECommerce",
            "ScheduledAt": "2020-09-03",
            "Reversed": false,
            "TransactionFares": {
                "Fee": 23,
                "Schedules": [
                    {
                        "Id": "9e8e0150-70c5-4c74-abae-1eead76c1100",
                        "ForecastedDate": "2020-10-05",
                        "InstallmentNumber": 1,
                        "InstallmentAmount": 23,
                        "EventId": 3,
                        "Event": "FeeCredit",
                        "EventStatusId": 1,
                        "EventStatus": "Scheduled"
                    },
                    {
                        "Id": "dbab53e6-f49b-465c-b693-b954e6610430",
                        "ForecastedDate": "2020-10-05",
                        "InstallmentNumber": 1,
                        "InstallmentAmount": 23,
                        "EventId": 4,
                        "Event": "FeeDebit",
                        "EventStatusId": 1,
                        "EventStatus": "Scheduled"
                    }
                ],
                "DiscountedAmount": 100,
                "AppliedMdr": 1.00
            },
            "PaymentArrangement": {
                "BrandId": 1,
                "Brand": "Visa",
                "ProductId": 1,
                "Product": "CreditCard"
            },
            "TransactionDetails": {
                "CaptureDate": "2020-09-03",
                "Nsu": "301817",
                "AuthorizationCode": "855208",
                "AuthorizationDate": "2020-09-03",
                "StatusId": 2,
                "Status": "Pago",
                "CardNumber": "448153******6111",
                "OrderId": "2589631247"
            },
            "MasterRateDiscountTypeId": "1",
            "MasterRateDiscountType": "Commission",
            "Merchant": {
                "Id": "4f522430-0e1b-41c7-baaa-9599a32d8307",
                "Type": "Master",
                "FancyName": "LOJAWEB",
                "CorporateName": "LOJAWEB"
            },
            "MasterSummary": {
                "Commission": {
                    "SplitId": "012988ad-8c3b-4192-ae1a-8cfb589e13e0",
                    "NetAmount": 400,
                    "GrossAmount": 500,
                    "Schedules": [
                        {
                            "Id": "cd20d20c-e857-4d22-aadc-89bc82433906",
                            "ForecastedDate": "2020-10-05",
                            "InstallmentNumber": 1,
                            "InstallmentAmount": 400,
                            "EventId": 1,
                            "Event": "Credit",
                            "EventStatusId": 1,
                            "EventStatus": "Scheduled"
                        }
                    ]
                },
                "TotalGrossAmount": 500,
                "TotalNetAmount": 400
            },
            "Splits": [
                {
                    "PayoutBlocked": false,
                    "Id": "51685fdf-8346-472e-98e7-c415246f7caa",
                    "NetAmount": 9500,
                    "GrossAmount": 10000,
                    "Fares": {
                        "Mdr": 5.00,
                        "Fee": 0,
                        "DiscountedMdrAmount": 500
                    },
                    "Merchant": {
                        "Id": "ea344bea-ce13-4b58-951f-49ff78fff44b",
                        "Type": "Subordinate",
                        "FancyName": "LOJAWEBSubordinado02",
                        "CorporateName": "LOJAWEBSubordinado02"
                    },
                    "Schedules": [
                        {
                            "Id": "01521cdc-35b2-4bd0-b381-dab95e3b2cde",
                            "ForecastedDate": "2020-10-05",
                            "InstallmentNumber": 1,
                            "InstallmentAmount": 9500,
                            "EventId": 1,
                            "Event": "Credit",
                            "EventStatusId": 1,
                            "EventStatus": "Scheduled"
                        }
                    ]
                }
            ]
        }
    ]
}
```

|PROPRIEDADE|DESCRIÇÃO|TIPO|
|--------|---------------------------------|------|
|PageCount|Total de páginas retornadas na consulta|Inteiro|
|PageIndex|Página atual da consulta|Inteiro|
|PageSize|Quantidade de itens retornados por página|Inteiro|
|Items.[].PaymentId|Identificador único da transação|GUID|
|Items.[].Amount|Valor bruto da transação|Inteiro|
|Items.[].Installments|Quantidade de parcelas da transação|Inteiro|
|Items.[].ChannelId|Identificador do canal onde a transação ocorreu|Inteiro|
|Items.[]Channel|Descrição do cancal onde a transação ocorreu|Texto|
|Items.[].ScheduledAt|Data de agendamento da transação|Data|
|Items.[].Reversed|Indica se a operação consultada foi revertida. (Transação, Cancelamento, Chargeback)|Booleano|
|Items.[].TransactionFares.Fee|Tarifa fixa aplicada pela Braspag|Inteiro|
|Items.[].TransactionFares.DiscountedAmount|Valor ganho pela Braspag em relação a transação. Em um cancelamento, esse valor também é cancelado.|Inteiro|
|Items.[].TransactionFares.AppliedMdr|Mdr aplicado pela Braspag|Decimal|
|Items.[].PaymentArrangement.BrandId|Id da Bandeira|Inteiro|
|Items.[].PaymentArrangement.Brand|Descrição da Bandeira|Texto|
|Items.[].PaymentArrangement.ProductId|Id do Produto|Inteiro|
|Items.[].PaymentArrangement.Product|Descrição do Produto|Texto|
|Items.[].TransactionDetails.CaptureDate|Data de captura da transação|Data|
|Items.[].TransactionDetails.Nsu|Identificador NSU|Inteiro|
|Items.[].TransactionDetails.AuthorizationCode|Código de autorização|Texto|
|Items.[].TransactionDetails.AuthorizationDate|Data de autorização|Data|
|Items.[].TransactionDetails.StatusId|Id do status|Inteiro|
|Items.[].TransactionDetails.Status|Descrição do Status|Texto|
|Items.[].TransactionDetails.TerminalLogicNumber|Número lógico do terminal em que a transação ocorreu|Texto|
|Items.[].MasterRateDiscountTypeId|Tipo de desconto aplicado pela Braspag|Inteiro|
|Items.[].MasterRateDiscountType|Descrição do desconto aplicado pela Braspag|Texto|
|Items.[].Merchant.Id|MerchantId do Master da transação|GUID|
|Items.[].Merchant.Type|Tipo do Merchant|Texto|
|Items.[].Merchant.FancyName|Nome Fantasia do Master|Texto|
|Items.[].Merchant.CorporateName|Razão social do Master|Texto|
|Items.[].MasterSummary.TotalGrossAmount|Valor Bruto ganho pelo Master na transação|Inteiro|
|Items.[].MasterSummary.TotalNetAmount|Valor Líquido ganho pelo Master na transação|Inteiro|
|Items.[].Splits.[].PayoutBlocked|Identificador se a agenda está bloqueada para liquidação|Booleano|
|Items.[].Splits.[].NetAmount|Valo líquido da venda referente ao participante|Inteiro|
|Items.[].Splits.[].GrossAmount|Valor bruto da venda referente ao participante|Inteiro|
|Items.[].Splits.[].Fares.Mdr|MDR aplicado sobre a venda do participante|Decimal|
|Items.[].Splits.[].Fares.Fee|Tarifa aplicada sobre a venda do participante|Inteiro|
|Items.[].Splits.[].Fares.DiscountedAmount|Valor discontado sobre a venda do participante|Inteiro|
|Items.[].Splits.[].Merchant.Id|Identificador único (MerchantId) do participante da transação|GUID|
|Items.[].Splits.[].Merchant.Type|Tipo do Merchant|Texto|
|Items.[].Splits.[].Merchant.FancyName|Nome Fantasia do Participante|Texto|
|Items.[].Splits.[].Merchant.CorporateName|Razão social do participante|Texto|
|Items.[].Splits.[].Schedules.[].Id|Identificador único da agenda|GUID|
|Items.[].Splits.[].Schedules.[].ForecastedDate|Data prevista para a liquidação da agenda|Data|
|Items.[].Splits.[].Schedules.[].InstallmentNumber|Número da parcela a qual a agenda se refere|Inteiro|
|Items.[].Splits.[].Schedules.[].InstallmentAmount|Valor líquido da agenda|Inteiro|
|Items.[].Splits.[].Schedules.[].EventId|Identificador do Evento da agenda|Inteiro|
|Items.[].Splits.[].Schedules.[].Event|Descrição do evento da agenda|Texto|
|Items.[].Splits.[].Schedules.[].EventStatusId|Identificador do status da agenda|Inteiro|
|Items.[].Splits.[].Schedules.[].EventStatus|Descrição do status da agenda|Texto|

## Conciliação de Cancelamentos

O endpoint de conciliação de cancelamentos permite consultar dados relativos ao cancelamento de uma transação e também da reversão de um cancelamento.

A reversão de um cancelamento ocorre em cenários onde o lojista efetuou um cancelamento por engano e deseja anular o mesmo.

### Exemplos de consultas no endpoint de conciliação de cancelamentos 

**Exemplo** - Efetuando a consulta de todos os cancelamentos agendados no período entre 01/01/2020 e 02/01/2020 que não foram revertidos.

#### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{apiSplitSchedule}/voids?InitialScheduledAt=2020-01-01&FinalScheduledAt=2020-01-02&Reversed=False</span></aside>

#### Response

```json
{ 
   "PageCount":1,
   "PageIndex":1,
   "PageSize":25,
   "Items":[ 
      { 
         "Id":"7cafa9b0-f59c-4a52-81ce-9e52ffa96c84",
         "Amount":10000,
         "Status":"Successful",
         "CreatedAt":"2019-05-14",
         "EventDate":"2019-05-14",
         "Reversed":false,
         "ScheduledAt":"2019-05-14",
         "TransactionFares":{ 
            "DiscountedAmount":250,
            "AppliedMdr":2.50
         },
         "MasterRateDiscountTypeId":"1",
         "MasterRateDiscountType":"Commission",
         "Merchant":{ 
            "Id":"eba3b4ee-4266-4898-84c7-c4b2b8213169",
            "Type":"Master",
            "FancyName":"Operacoes Split",
            "CorporateName":"Operacoes Split"
         },
         "MasterSummary":{ 
            "Commission":{ 
               "SplitId":"47964623-82dd-4932-fc54-08d6d8b619f1",
               "NetAmount":150,
               "GrossAmount":400
            },
            "TotalGrossAmount":400,
            "TotalNetAmount":150
         },
         "Splits":[ 
            { 
               "Id":"f68134f9-47a8-42a0-fc55-08d6d8b619f1",
               "NetAmount":4800,
               "GrossAmount":5000,
               "Fares":{ 
                  "Mdr":4.00,
                  "Fee":0,
                  "DiscountedMdrAmount":200
               },
               "Merchant":{ 
                  "Id":"06b7a6cc-903b-4156-8b0b-aa5d730b9301",
                  "Type":"Subordinate",
                  "FancyName":"Operacoes Split Subordinado02",
                  "CorporateName":"Operacoes Split Subordinado02"
               },
               "Schedules":[ 
                  { 
                     "Id":"1f76d2b3-9eb8-407f-82b3-cd452feb8b64",
                     "ForecastedDate":"2020-02-02",
                     "InstallmentNumber":1,
                     "InstallmentAmount":4800,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  }
               ]
            }
         ]
      }
   ]
}
```
| Propriedade| Descrição | Tipo |
|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `Id` | Identificador do cancelamento. | Guid |
| `Amount` | Valor do cancelamento. | Long |
| `Status` | Status da solicitação de cancelamento. | Guid |
| `CreatedAt` | Data de criação do cancelamento na Braspag. | Date |
| `EventDate` | Data de criação do cancelamento na Cielo. | Date |
| `Reversed` | Indica se o cancelamento foi revertido. | Bool |
| `ScheduledAt` | Data em que o cancelamento foi conciliado na Braspag e foram geradas as agendas com eventos de cancelamento. | Date |
| `TransactionFares.DiscountedAmount` | Valor ganho pela Braspag em relação a transação. Em um cancelamento, esse valor também é cancelado. | Long |
| `TransactionFares.AppliedMdr` | Mdr aplicado pela Braspag. | Decimal |
| `MasterRateDiscountTypeId` | 1 - Commision ou 2 - Sale. | String |
| `MasterRateDiscountType` | Informação sobre o tipo de recebivel do master durante a transação. Sale indica que o master vendeu um produto proprio, já commission aponta que o master recebeu uma comissão em uma venda de terceiros. | String |
| `Merchant.Id` | Identificador do merchant. | Guid |
| `Merchant.Type` | Tipo do merchant. | Int |
| `Merchant.FancyName` | Nome fantasia do merchant. | String |
| `Merchant.CorporateName` | Razão social do merchant. | String |
| `MasterSummary.Commision.SplitId` | Identificador da divisão para o master. | Guid |
| `MasterSummary.Commision.NetAmount` | Valor liquido do master após o desconto das taxas. | Long |
| `MasterSummary.Commision.GrossAmount` | Valor bruto direcionado ao master. | Long |
| `MasterSummary.TotalGrossAmount` | Valor bruto total. | Long |
| `MasterSummary.TotalNetAmount` | Valor liquido total. | Long |
| `Splits[].Id` | Identificador da divisão para o subordinado. | Guid |
| `Splits[].NetAmount` | Valor liquido direcionado ao subordinado. | Long |
| `Splits[].GrossAmount` | Valor bruto direcionado ao subordinado. | Long |
| `Splits[].Fares.Mdr` | Mdr aplicado pelo master. | Decimal |
| `Splits[].Fares.Fee` | Fee aplicado pelo master. | Int |
| `Splits[].Fares.DiscountedMdrAmount` | Valor de mdr que o master descontou do subordinado | Long |
| `Splits[].Merchant.Id` | Identificador do merchant. | Guid |
| `Splits[].Merchant.Type` | Tipo do merchant. | Int |
| `Splits[].Merchant.FancyName` | Nome fantasia do merchant. | String |
| `Splits[].Merchant.CorporateName` | Razão social do merchant. | String |
| `Splits[].Schedules[].Id` | Identificador da agenda. | Guid |
| `Splits[].Schedules[].ForecastedDate` | Data prevista de pagamento. | Date |
| `Splits[].Schedules[].InstallmentNumber` | Identifica a qual parcela a agenda responde. | Int |
| `Splits[].Schedules[].InstallmentAmount` | Valor da agenda.| Long |
| `Splits[].Schedules[].EventId` | Identificador do evento. | Int |
| `Splits[].Schedules[].Event` | Evento por extenso. | String  |
| `Splits[].Schedules[].EventStatusId` | Identificador de status do evento. | Int |
| `Splits[].Schedules[].EventStatus` | Status do evento por extenso. | String |

## Tabelas de Status

### Eventos de agenda

|ID|Descrição|Positivo|
|---|----|----|
|1|Credit|Sim|
|2|Debit|Não|
|3|FeeCredit|Sim|
|4|FeeDebit|Não|
|5|RefundCredit|Sim|
|6|RefundDebit|Não|
|7|ChargebackCredit|Sim|
|8|ChargebackDebit|Não|
|9|UndoChargebackCredit|Sim|
|10|UndoChargebackDebit|Não|
|12|AntiFraudFeeDebit|Não|
|14|AntiFraudFeeWithReviewDebit|Não|
|15|AdjustmentCredit|Sim|
|16|AdjustmentDebit|Não|
|17|ChargebackReversalCredit|Sim|
|18|ChargebackReversalDebit|Não|
|19|AnticipationCredit|Sim|
|20|AnticipationCommissionCredit|Sim|
|21|AnticipatedInstallmentsCredit|Sim|
|22|AnticipationCommissionDebit|Não|
|23|AnticipatedInstallmentsDebit|Não|
|24|RefundReversalCredit|Sim|
|25|RefundReversalDebit|Não|
|28|ReversalFeeCredit|Sim|
|29|ReversalFeeDebit|Não|
|30|BankSlipFeeCredit|Sim|
|31|BankSlipFeeDebit|Não|
|32|BalanceCompensationCredit|Sim|
|33|BalanceCompensationDebit|Não|
|36|ReversalAntiFraudFeeCredit|Sim|
|37|ReversalAntiFraudFeeDebit|Não|
|38|ReversalBankSlipFeeCredit|Sim|
|39|ReversalBankSlipFeeDebit|Não|

### Status de agenda

|Id|Description|
|---|---|
|1|Scheduled|
|2|Pending|
|3|Settled|
|4|Error|
|5|WaitingForAdjustmentDebit|
|6|Anticipated|

### Status de transação

|Id|Description|
|--|--|
|0|Não finalizado|
|1|Autorizado|
|2|Pago|
|3|Negado|
|10|Cancelado|
|11|Cancelado|
|12|Pendente|
|13|Abortado|
|20|Agendado|

### Bandeiras

|Id|Description|
|---|---|
|1|Visa|
|2|Master|
|3|Amex|
|4|Elo|
|7|Diners|
|9|Hipercard|
|19|BancoDoBrasil|

### Produtos

|Id|Description|
|---|---|
|1|CreditCard|
|2|DebitCard|
|3|BankSlip|

### Tipos de desconto (MasterRateDiscountType)

|Id|Description|
|---|---|
|1|Commission|
|2|Sale|
