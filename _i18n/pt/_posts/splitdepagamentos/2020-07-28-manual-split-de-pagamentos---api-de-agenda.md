---
layout: manual
title: Manual Split de Pagamentos - API de Agenda
description: Manual integração do Split de Pagamentos para agenda financeira
search: true
toc_footers: false
categories: manual
sort_order: 8
hub_visible: false
tags:

---

# Split de Pagamentos - API de Agenda

## Introdução
Para facilitar sua conciliação, disponibilizamos endpoints para que sejam obtidos os dados relevantes para o seu negócio.

Todos os eventos exibidos nesses endpoints já passaram pelo processo de agendamento, ou seja, todos os lançamentos relativos já foram registrados na agenda financeira dos participantes.

Os endpoints de conciliação para transações, cancelamentos e chargebacks suportam os seguintes parâmetros:

| Filtro                       | Descrição                                                                                               | Tipo    |
|------------------------------|---------------------------------------------------------------------------------------------------------|---------|
| `InitialScheduledAt`         | Data inicial em que uma transação foi agendada.                                                         | Date    |  
| `FinalScheduledAt`           | Data que será utilizada como limite durante a busca                                                     | Data    |
| `Reversed`                   | Utilizado para indicar se o consumidor deseja pesquisar eventos que foram revertidos.                   | Bool    |
| `PageIndex`                  | Página a ser consultada.                                                                                | Int     |
| `PageSize`                   | Quantidade máxima de items por página. Valores possíveis: 25,50,100                                     | Int     |

## Conciliação de Cancelamentos
O endpoint de conciliação de cancelamentos permite consultar dados relativos ao cancelamento de uma transação e também da reversão de um cancelamento.

A reversão de um cancelamento ocorre em cenários onde o lojista efetuou um cancelamento por engano e deseja anular o mesmo.

## Exemplos de consultas no endpoint de conciliação de cancelamentos
**Exemplo 1** - Efetuando a consulta de todos os cancelamentos agendados no período entre 01/01/2020 e 02/01/2020 que não foram revertidos.

**Request:**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{{apiSplitSchedule}}/voids?InitialScheduledAt=2020-01-01&FinalScheduledAt=2020-01-02&Reversed=False</span></aside>

**Response:**

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
**Exemplo 2** - Efetuando a consulta de todas as reversões de cancelamento agendadas no período entre 01/01/2020 e 02/01/2020.

**Request:**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{{apiSplitSchedule}}/voids?InitialScheduledAt=2020-01-01&FinalScheduledAt=2020-01-02&Reversed=True</span></aside>

**Response:**

```json
{ 
   "PageCount":1,
   "PageIndex":1,
   "PageSize":25,
   "Items":[ 
      { 
         "Id":"5198f7a7-2345-443e-9743-221fd383c564",
         "Amount":1000,
         "Status":"Successful",
         "CreatedAt":"2019-11-13",
         "EventDate":"2019-11-13",
         "Reversed":true,
         "ScheduledAt":"2020-01-02",
         "TransactionFares":{ 
            "DiscountedAmount":40,
            "AppliedMdr":3.70
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
            "TotalGrossAmount":1000,
            "TotalNetAmount":960
         },
         "Splits":[ 
            { 
               "Id":"c6e1296f-9517-4ebe-e6e8-08d767a1e99a",
               "NetAmount":960,
               "GrossAmount":1000,
               "Fares":{ 
                  "Mdr":3.70,
                  "Fee":0,
                  "DiscountedMdrAmount":40
               },
               "Merchant":{ 
                  "Id":"eba3b4ee-4266-4898-84c7-c4b2b8213169",
                  "Type":"Master",
                  "FancyName":"Operacoes Split",
                  "CorporateName":"Operacoes Split"
               },
               "Schedules":[ 
                  { 
                     "Id":"1df7f2af-6550-4051-b102-dabba9c2080a",
                     "ForecastedDate":"2020-08-13",
                     "InstallmentNumber":9,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"c6e19c85-4974-4ed1-ae9c-2caac7435968",
                     "ForecastedDate":"2020-07-13",
                     "InstallmentNumber":8,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"a66eb419-9c70-4962-a216-dfe888c61298",
                     "ForecastedDate":"2020-06-15",
                     "InstallmentNumber":7,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"e8afd028-50d7-4d5e-967b-3fad7b46576c",
                     "ForecastedDate":"2020-05-13",
                     "InstallmentNumber":6,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"48d7a48e-400b-4595-bcdb-45d28aa8e5ac",
                     "ForecastedDate":"2020-04-13",
                     "InstallmentNumber":5,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"3dd26db5-c590-4580-a908-3e4fe72f35a3",
                     "ForecastedDate":"2020-03-13",
                     "InstallmentNumber":4,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"c9cf5742-1a69-474d-8366-96d8b0d8c7f8",
                     "ForecastedDate":"2020-02-13",
                     "InstallmentNumber":3,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"7b6bf1db-f1c1-49f8-b12f-dce5e3384f63",
                     "ForecastedDate":"2020-01-13",
                     "InstallmentNumber":2,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"f7c54a66-ff16-47dc-85b8-fc78b5509b1b",
                     "ForecastedDate":"2019-12-13",
                     "InstallmentNumber":1,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"f2ca0afe-8185-4999-aa7e-e89b55da71eb",
                     "ForecastedDate":"2020-09-14",
                     "InstallmentNumber":10,
                     "InstallmentAmount":96,
                     "EventId":6,
                     "Event":"RefundDebit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"ff636b79-94e3-4a0d-82b7-51349d65b098",
                     "ForecastedDate":"2019-12-13",
                     "InstallmentNumber":1,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"722a7f1f-7ba3-4646-af2f-8b4c5be09eb5",
                     "ForecastedDate":"2020-01-13",
                     "InstallmentNumber":2,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"f0bbb658-3dbd-400e-809a-6e2c9345a34b",
                     "ForecastedDate":"2020-02-13",
                     "InstallmentNumber":3,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"cba824fb-3e3b-4933-832a-b2ae983fe709",
                     "ForecastedDate":"2020-03-13",
                     "InstallmentNumber":4,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"59e58b37-aca1-4a0e-8f04-a4cb6af0d5e8",
                     "ForecastedDate":"2020-04-13",
                     "InstallmentNumber":5,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"4ae4eaf4-810e-4551-bcc4-f488a3edcf15",
                     "ForecastedDate":"2020-05-13",
                     "InstallmentNumber":6,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"1ec4fbdf-1114-4103-beed-866737a1e405",
                     "ForecastedDate":"2020-06-15",
                     "InstallmentNumber":7,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"952b52b4-fff8-4006-bfa3-e92a021da006",
                     "ForecastedDate":"2020-07-13",
                     "InstallmentNumber":8,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"7df2bfe9-8936-4c7e-bb95-9661f1d79627",
                     "ForecastedDate":"2020-08-13",
                     "InstallmentNumber":9,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
                     "EventStatusId":1,
                     "EventStatus":"Scheduled"
                  },
                  { 
                     "Id":"d35c3735-086d-472b-a900-cff3ad0d5ee8",
                     "ForecastedDate":"2020-09-14",
                     "InstallmentNumber":10,
                     "InstallmentAmount":96,
                     "EventId":24,
                     "Event":"RefundReversalCredit",
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

## **Propriedades contidas no response de uma consulta de cancelamento.**

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