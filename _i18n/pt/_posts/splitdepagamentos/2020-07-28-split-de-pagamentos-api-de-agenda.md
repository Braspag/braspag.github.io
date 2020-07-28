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

### Exemplos de consultas no endpoint de conciliação de cancelamentos 

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/api/transactions</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{  
   "Amount":10000,
   "Installments":2,
   "Product":"CreditCard",
   "Brand":"Visa",
   "PaymentDetails":{  
      "AffiliationCode":"1010101010",
      "Nsu":123456,
      "AuthorizationCode":"654321",
      "TerminalLogicNumber":"12345678",
      "AuthorizationDate":"2018-05-30"
   },
   "SplitPayments":[  
      {  
         "SubordinateMerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
         "Amount":6000,
         "Fares":{  
            "Mdr":5,
            "Fee":30
         }
      },
      {  
         "SubordinateMerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
         "Amount":4000,
         "Fares":{  
            "Mdr":4,
            "Fee":15
         }
      }
   ]
}
```

| Propriedade                             | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `Amount`                                | Valor da transação em centavos.                                                                         | Inteiro | -       | Sim         | 
| `Installments`                          | Número de Parcelas da transação.                                                                        | Inteiro | -       | Sim         |
| `Product`                               | Tipo da transação [CreditCard - DebitCard].                                                             | String  | -       | Sim         |
| `Brand`                                 | Bandeira do cartão utilizado na transação [Visa - Master - Elo - Amex - Diners - Discover].             | String  | -       | Sim         |
| `PaymentDetails.AffiliationCode`        | Código do estabelecimento Cielo configurado na LIO e utilizado na transação.                            | String  | 10      | Sim         |
| `PaymentDetails.Nsu`                    | Número Sequencial Único da transação.                                                                   | String  | max(10) | Sim         |
| `PaymentDetails.AuthorizationCode`      | Código de Autorização da transação.                                                                     | String  | max(10) | Sim         |
| `PaymentDetails.TerminalLogicNumber`    | Número lógico do terminal LIO onde ocorreu a transação.                                                 | String  | max(10) | Sim         |
| `PaymentDetails.AuthorizationDate`      | Data de autorização da transação [YYYY-MM-DD].                                                          | Date    | -       | Sim         |
| `SplitPayments`                         | Nó contendo a informação de divisão da transação.                                                       | -       | -       | Não         |

| Propriedade                             | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `SplitPayments.SubordinateMerchantId`   | **MerchantId** (Identificador) do **Subordinado**.                                                      | Guid    | 36      | Sim         |
| `SplitPayments.Amount`                  | Parte do valor total da transação referente a participação do **Subordinado**, em centavos.             | Inteiro | -       | Sim         |
| `SplitPayments.Fares.Mdr`               | **MDR(%)** do **Marketplace** a ser descontado do valor referente a participação do **Subordinado**.    | Decimal | -       | Não         |
| `SplitPayments.Fares.Fee`               | **Tarifa Fixa(R$)** a ser descontada do valor referente a participação do **Subordinado**, em centavos. | Inteiro | -       | Não         |

**Response**

```json
{  
   "Id":"e718dc1e-fe8e-497e-9019-6aa48dee6306",
   "Amount":10000,
   "Installments":2,
   "Product":"CreditCard",
   "Brand":"Visa",
   "PaymentDetails":{  
      "AffiliationCode":"1010101010",
      "Nsu": "123456",
      "AuthorizationCode":"654321",
      "TerminalLogicNumber":"12345678",
      "AuthorizationDate":"2018-05-30"
   },
   "SplitPayments":[  
      {  
         "SubordinateMerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
         "Amount":6000,
         "Fares":{  
            "Mdr":5,
            "Fee":30
         },
         "Splits":[  
            {  
               "MerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
               "Amount":5670
            },
            {  
               "MerchantId":"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
               "Amount":330
            }
         ]
      },
      {  
         "SubordinateMerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
         "Amount":4000,
         "Fares":{  
            "Mdr":4,
            "Fee":15
         },
         "Splits":[  
            {  
               "MerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
               "Amount":3825
            },
            {  
               "MerchantId":"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
               "Amount":175
            }
         ]
      }
   ]
}
```

| Propriedade                                  | Descrição                                                                                   | Tipo   | Tamanho | Obrigatório |
|----------------------------------------------|---------------------------------------------------------------------------------------------|--------|---------|-------------|
| `Id`                                         | Identificador da transação.                                                                 | Guid   | 36      | Sim         |
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **Subordinado** ou **Marketplace**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Marketplace**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |

#### Transação existente

Durante o processo transacional na LIO, poderá ocorrer alguma falha impedindo que a LIO consiga invocar o Split para criação da transação. 

Caso isso ocorra e a transação não seja criada no Split no dia em que a mesma ocorreu, a plataforma automaticamente criará esta transação e direcionará todo o valor da transação para o Subordinado ao qual está associado o terminal LIO.

Caso tente-se criar a transação no Split de Pagamentos após a plataforma já tê-la criado, o Split retornará um erro (Http Staus Code 409 - Conflict) juntamente com os dados transacionais, caso o Marketplace seja o dono da transação. Com isso, o Marketplace pode redividir a transação de acordo com suas regras através do [Split de Pagamentos - Pós Transacional](https://braspag.github.io//manual/split-pagamentos-braspag#p%C3%B3s-transacional){:target="_blank"}. 

**Request**

Para o exemplo abaixo, considerou-se que o terminal LIO está associado ao Subordinado 7c7e5e7b-8a5d-41bf-ad91-b346e077f769.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/api/transactions</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{  
   "Amount":10000,
   "Installments":2,
   "Product":"CreditCard",
   "Brand":"Visa",
   "PaymentDetails":{  
      "AffiliationCode":"1010101010",
      "Nsu": "123456",
      "AuthorizationCode":"654321",
      "TerminalLogicNumber":"12345678",
      "AuthorizationDate":"2018-05-30"
   },
   "SplitPayments":[  
      {  
         "SubordinateMerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
         "Amount":6000,
         "Fares":{  
            "Mdr":5,
            "Fee":30
         }
      },
      {  
         "SubordinateMerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
         "Amount":4000,
         "Fares":{  
            "Mdr":4,
            "Fee":15
         }
      }
   ]
}
```

**Response**

> HTTP Staus Code: 409 - Conflict

```json
{  
   "Id":"e718dc1e-fe8e-497e-9019-6aa48dee6306",
   "Amount":10000,
   "Installments":2,
   "Product":"CreditCard",
   "Brand":"Visa",
   "PaymentDetails":{  
      "AffiliationCode":"1010101010",
      "Nsu":123456,
      "AuthorizationCode":"654321",
      "TerminalLogicNumber":"12345678",
      "AuthorizationDate":"2018-05-30"
   },
   "SplitPayments":[  
      {  
         "SubordinateMerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
         "Amount":10000,
         "Fares":{  
            "Mdr":5,
            "Fee":30
         },
         "Splits":[  
            {  
               "MerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
               "Amount":9470
            },
            {  
               "MerchantId":"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
               "Amount":530
            }
         ]
      }
   ]
}
```

### Consulta

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/api/transactions/{Id}</span></aside>

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/api/transactions/e718dc1e-fe8e-497e-9019-6aa48dee6306</span></aside>

```x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

**Response**

```json
{  
   "Id":"e718dc1e-fe8e-497e-9019-6aa48dee6306",
   "Amount":10000,
   "Installments":2,
   "Product":"CreditCard",
   "Brand":"Visa",
   "PaymentDetails":{  
      "AffiliationCode":"1101505998",
      "Nsu":1234567891,
      "AuthorizationCode":"123456",
      "TerminalLogicNumber":"78350767",
      "AuthorizationDate":"2018-05-30"
   },
   "SplitPayments":[  
      {  
         "SubordinateMerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
         "Amount":6000,
         "Fares":{  
            "Mdr":5,
            "Fee":30
         },
         "Splits":[  
            {  
               "MerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
               "Amount":5670
            },
            {  
               "MerchantId":"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
               "Amount":330
            }
         ]
      },
      {  
         "SubordinateMerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
         "Amount":4000,
         "Fares":{  
            "Mdr":4,
            "Fee":15
         },
         "Splits":[  
            {  
               "MerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
               "Amount":3825
            },
            {  
               "MerchantId":"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
               "Amount":175
            }
         ]
      }
   ]
}
```

### Cancelamento

Os cancelamentos serão processados automaticamente pelo Split de Pagamentos.

## Agenda Financeira

Utilize as informações publicadas em [Split de Pagamentos - Agenda Financeira](https://braspag.github.io//manual/split-pagamentos-braspag#p%C3%B3s-transacional){:target="_blank"} para consultar as previsões e realizações de liquidação das transações.
