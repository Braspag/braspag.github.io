---
layout: manual
title: Split de Pagamentos - LIO (Piloto)
description: Manual integração do Split de Pagamentos em terminais LIO
search: true
toc_footers: false
categories: manual
sort_order: 3
hub_visible: false
tags:
---

# Split de Pagamentos - LIO

## Introdução

O **Split de Pagamentos** permite a divisão de uma transação entre diferentes participantes de uma venda.

Para maiores detalhes e informações sobre a plataforma, consulte [Split de Pagamentos](https://braspag.github.io//manual/split-pagamentos-braspag){:target="_blank"}.

> Esta documentação é confidencial. Não divulgue-a sem prévia autorização.

## Configuração

Para que seja possível realizar as liquidações para cada participante de uma venda realizada nos terminais LIO, o terminal deverá ser cadastrado na plataforma previamente. O mesmo deverá ser associado a um Subordinado, indicando onde o mesmo estará presente fisicamente.

Com isso, no momento da configuração de um terminal, é necessário informar o seu numero lógico para que seja possível a correta configuração e operação da plataforma.

> Para que seja possível operar com o Split utilizando terminais LIO, entre em contato com a equipe comercial Cielo/Braspag.

## Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/){:target="_blank"}, onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais, que deverá posteriormente ser enviado à API Cielo e-Commerce e à API do Split.

Consulte [Split de Pagamentos - Autenticação](https://braspag.github.io//manual/split-pagamentos-braspag-lio#autentica%C3%A7%C3%A3o){:target="_blank"} para detalhes técnicos.

## Integração

### Criando uma transação  

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/transactions</span></aside>

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
| `Installments`                          | Número de Parecelas da transação.                                                                       | Inteiro | -       | Sim         |
| `Product`                               | Tipo da transação [CreditCard | DebitCard].                                                             | String  | -       | Sim         |
| `Brand`                                 | Bandeira do cartão utilizado na transação [Visa | Master | Elo | Amex | Diners | Discover].             | String  | -       | Sim         |
| `PaymentaDateils.AffiliationCode`       | Código do estabelecimento Cielo configurada na LIO e utilizado na transação.                            | String  | 10      | Sim         |
| `PaymentaDateils.Nsu`                   | Número Sequencial Único da transação.                                                                   | String  | max(10) | Sim         |
| `PaymentaDateils.AuthorizationCode`     | Código de Autorização da transação.                                                                     | String  | max(10) | Sim         |
| `PaymentaDateils.TerminalLogicNumber`   | Número lógico do terminal LIO onde ocorreu a transação.                                                 | String  | max(10) | Sim         |
| `PaymentaDateils.AuthorizationDate`     | Data de autorização da transação [YYYY-MM-DD].                                                          | Date    | -       | Sim         |
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

| Propriedade                                  | Descrição                                                                                   | Tipo   | Tamanho | Obrigatório |
|----------------------------------------------|---------------------------------------------------------------------------------------------|--------|---------|-------------|
| `Id`                                         | Identificador da transação.                                                                 | Guid   | 36      | Sim         |
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **Subordinado** ou **Marketplace**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Marketplace**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |

#### Transação existente

Durante o processo transacional na LIO, poderá ocorrer algum problema, de comunicação, por exemplo, impedindo que a LIO consiga invocar o Split para criação da transação. 

Caso isso ocorra e a transação não seja criada no Split no dia em que a mesma ocorreu, a plataforma automaticamente cria esta transação e direciona todo o valor da da transação para o Subordinado ao qual está associado o terminal LIO.

Caso tente-se criar a transação no Split de Pagamentos após a plataforma já tê-la criado, o Split retornará um erro (Http Staus Code 409 - Conflict) juntamente com os dados transacionais, caso o Marketplace seja o dono da transação. Com isso, o Marketplace pode redividir a transação de acordo com suas regras através do Split Pós Transacional, [Split de Pagamentos - Pós Transacional](https://braspag.github.io//manual/split-pagamentos-braspag-lio#p%C3%B3s-transacional){:target="_blank"}. 

**Request**

Para o exemplo abaixo, considerou-se que o terminal LIO está associado ao Subordinado 7c7e5e7b-8a5d-41bf-ad91-b346e077f769.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/transactions</span></aside>

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
      "AffiliationCode":"1101505998",
      "Nsu":1234567891,
      "AuthorizationCode":"123456",
      "TerminalLogicNumber":"78350767",
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

Caso a transação não pertença ao Marketplace, será retornado um erro (Http Staus Code 400 - Bad Request) informando qua a transação já existe.

**Response**

> HTTP Staus Code: 409 - Conflict

```json
{
    "Message": "Transacrion already exists."
}
```

### Modelos de Split

O Split de Pagamentos disponibiliza dois modelos para divisão da transação entre os participantes:

| Tipo                       | Descrição                                                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Split Transacional**     | O **Marketplace** envia na autorização (captura automática) ou no momento de captura as regras de divisão.                         |
| **Split Pós-Transacional** | O **Marketplace** envia as regras de divisão após a captura da transação.

> No Split de Pagamentos a divisão é realizada somente para transações capturadas, ou seja, as regras de divisão só serão consideradas para autorizações com captura automática e no momento da captura de uma transação. Caso seja informado no momento de uma autorização sem captura automática, as regras de divisão serão desconsideradas.

#### Transacional

No Split Transacional é necessário que o Marketplace envie um "nó" adicional na integração da API Cielo E-Commerce, como apresentado em exemplos anteriores, informando as regras de divisão da transação.

```json
"SplitPayments":[
    {
        "SubordinateMerchantId" :"MID Subordinate 01",
        "Amount":10000,
        "Fares":{
            "Mdr":5,
            "Fee":0
        }
    }
]
```



Como resposta, A API Cielo E-Commerce retornará um nó contento as regras de divisão enviadas e os valores a serem recebidos pelo Marketplace e seus Subordinados:

```json
"SplitPayments": [
    {
        "SubordinateMerchantId": "MID Subordinate 01",
        "Amount": 10000,
        "Fares": {
            "Mdr": 5,
            "Fee": 0
        },
        "Splits": [                
            {
                "MerchantId": "MID do Marketplace",
                "Amount": 500,
            },
            {
                "MerchantId": "MID Subordinate 01",
                "Amount": 9500,
            }
        ]
    }
]
```

| Propriedade                                  | Descrição                                                                                   | Tipo   | Tamanho | Obrigatório |
|----------------------------------------------|---------------------------------------------------------------------------------------------|--------|---------|-------------|
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **Subordinado** ou **Marketplace**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Marketplace**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |

**Exemplo 3)**  

Transação no valor de **R$100,00** com o nó contendo as regras de divisão e o Marketplace participando da venda.

**Taxa Braspag**: 2% MDR + R$0,30 Tarifa Fixa.  
**Taxa Marketplace com o Subordinado 01**: 5% MDR, já embutindo os 2% do MDR Braspag + 0,30 Tarifa Fixa.  
**Taxa Marketplace com o Subordinado 02**: 4% MDR, já embutindo os 2% do MDR Braspag + 0,15 Tarifa Fixa.  

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
  "MerchantOrderId":"2014111701",
  "Customer":{
      "Name":"Comprador"
   },
  "Payment":{
      "Type":"SplittedCreditCard",
      "Amount":10000,
      "Installments":1,
      "SoftDescriptor":"Marketplace",
      "Capture": true,
      "CreditCard":{
          "CardNumber":"4551870000000181",
          "Holder":"Teste Holder",
          "ExpirationDate":"12/2021",
          "SecurityCode":"123",
          "Brand":"Visa"
      },
      "SplitPayments": [
        {
            "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "Amount": 4500,
            "Fares": {
              "Mdr": 5,
              "Fee": 30
            }
        },
        {
            "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "Amount": 3000,
            "Fares": {
              "Mdr": 4,
              "Fee": 15
            }
        },
        {
            "SubordinateMerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
            "Amount": 2500
        }
    ]
  }
}
```

**Response**

```json
{
    "MerchantOrderId": "2014111701",
    "Customer": {
        "Name": "Comprador"
    },
    "Payment": {
        "SplitPayments": [
            {
                "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                "Amount": 4500,
                "Fares": {
                    "Mdr": 5,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                        "Amount": 4245
                    },
                    {
                        "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                        "Amount": 255
                    }
                ]
            },
            {
                "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                "Amount": 3000,
                "Fares": {
                    "Mdr": 4,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                        "Amount": 2865
                    },
                    {
                        "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                        "Amount": 135
                    }
                ]
            },
            {
                "SubordinateMerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                "Amount": 2500,
                "Fares": {
                    "Mdr": 2,
                    "Fee": 0
                },
                "Splits": [
                    {
                        "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                        "Amount": 2500
                    }
                ]
            }
        ],
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "455187******0181",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "1210035540764",
        "ProofOfSale": "20171210035540764",
        "AuthorizationCode": "859182",
        "SoftDescriptor": "Marketplace",
        "Provider": "Simulado",
        "Amount": 10000,
        "ReceivedDate": "2017-12-10 15:55:38",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-12-10 15:55:40",
        "Status": 2,
        "IsSplitted": true,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "6",
        "PaymentId": "34895364-e269-47ad-b779-7e122ed40a9a",
        "Type": "SplittedCreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "PUT",
                "Rel": "split",
                "Href": "https://splitsandbox.braspag.com.br/api/transactions/34895364-e269-47ad-b779-7e122ed40a9a/split"
            },
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/34895364-e269-47ad-b779-7e122ed40a9a"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/34895364-e269-47ad-b779-7e122ed40a9a/void"
            }
        ]
    }
}
```

Neste exemplo, onde o Marketplace também participa da venda, não é necessário informar as taxas a serem descontadas sobre o valor da venda referente ao próprio marketplace. O Split indentifica que o valor informado é do próprio Marketplace, através do seu identificador, e realiza os cálculos corretamente.

![SplitSample004](https://developercielo.github.io/images/split/split004.png)

#### Pós-Transacional

Neste modelo o Marketplace poderá enviar as regras de divisão da transação após a mesma ser capturada.

A divisão pós-transacional é possível somente para transações com **Cartão de Crédito** e poderá ser realizada dentro de um intervalo de tempo determinado a partir da data de captura da transação.

Para transações com **Cartão de Crédito**, este período é de **25 dias** se o Marketplace possuir um regime padrão de pagamentos. Caso tenha um regime personalizado, o período deverá ser acordado entre as partes (Marketplace e Braspag (Facilitador)).

### Consulta

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/transactions/{PaymentId}</span></aside>

```x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

**Response**

```json
{
    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
    "MerchantOrderId": "2014111701",
    "IsSplitted": true,
    "Customer": {
        "Name": "Comprador",
        "Address": {}
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "CreditCard": {
            "CardNumber": "455187******0181",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "Brand": "Visa"
        },
        "ProofOfSale": "20171210061821319",
        "Tid": "1210061821319",
        "AuthorizationCode": "379918",
        "PaymentId": "507821c5-7067-49ff-928f-a3eb1e256148",
        "Type": "SplittedCreditCard",
        "Amount": 10000,
        "ReceivedDate": "2017-12-10 18:18:18",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-12-10 18:18:21",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "Status": 2,
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/507821c5-7067-49ff-928f-a3eb1e256148"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/507821c5-7067-49ff-928f-a3eb1e256148/void"
            },
            {
                "Method": "PUT",
                "Rel": "sales.split",
                "Href": "https://splitsandbox.braspag.com.br/api/transactions507821c5-7067-49ff-928f-a3eb1e256148/split"
            }
        ],
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
                "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                "Amount": 4000,
                "Fares": {
                    "Mdr": 4,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                        "Amount": 3825
                    },
                    {
                        "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                        "Amount": 175
                    }
                ]
            }
        ]
    }
}
```

### Cancelamento

Ao cancelar uma transação do Split de Pagamentos o Marketplace deve informar, para um cancelamento parcial, qual o valor deve ser cancelado de cada participante da transação. Para um cancelamento total, esta informação não é necessária, já que será cancelado o valor total e consequentemente o valor total de cada Subordinado.

#### Cancelamento Total

No cancelamento total de uma transação, será cancelado o valor total da transação e consequentemente o valor total de cada Subordinado.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/void</span></aside>

```x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

**Response**

```json
{
    "Status": 10,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "0",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "0",
    "ReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/019efd18-c69a-4107-b5d7-e86564460cc4"
        }
    ],
    "VoidSplitPayments": [
        {
            "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "VoidedAmount": 4000,
            "VoidedSplits": [
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "VoidedAmount": 3825
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "VoidedAmount": 175
                }
            ]
        },
        {
            "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "VoidedAmount": 6000,
            "VoidedSplits": [
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "VoidedAmount": 5670
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "VoidedAmount": 330
                }
            ]
        }
    ]
}
```

#### Cancelamento Parcial

No cancelamento parcial, o somatório dos valores cancelados definidos para cada Subordinado deve ser igual ao valor do cancelamento parcial.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/void?amount={amount}</span></aside>

```x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

No exempo abaixo é cancelado o valor de R$25,00 de uma transação capturada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce/1/sales/{PaymentId}/void?amount=2500</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "VoidedAmount": 1500
        },
        {
            "SubordinateMerchantId" :"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "VoidedAmount":1000
        }
     ]
}
```

| Propriedade                                 | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `VoidSplitPayments.SubordinateMerchantId`   | **MerchantId** (Identificador) do **Subordinado**.                                                      | Guid    | 36      | Sim         |
| `VoidedAmount.Amount`                       | Total ou parte do valor destinado ao **Subordinado** a ser cancelado, em centavos.                      | Inteiro | -       | Sim         |

**Response**

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "0",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "0",
    "ReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/c10ee5e5-6179-424c-bbf2-1a2319a8f7c3"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/c10ee5e5-6179-424c-bbf2-1a2319a8f7c3/void"
        }
    ],
    "VoidSplitPayments": [
        {
            "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "VoidedAmount": 1500,
            "VoidedSplits": [
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "VoidedAmount": 1417
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "VoidedAmount": 83
                }
            ]
        },
        {
            "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "VoidedAmount": 1000,
            "VoidedSplits": [
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "VoidedAmount": 956
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "VoidedAmount": 44
                }
            ]
        }
    ]
}
```

Não é obrigatório informar todos os Subordinados no cancelamento parcial. Pode-se informar apenas os subordinados para os quais se deseja cancelar totalmente ou parte do valor destinado aos mesmos na transação. No exemplo acima poderia ser informado, por exemplo, apenas o segundo subordinado, conforme exemplo abaixo:

```json
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId" :"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "VoidedAmount":1000
        }
     ]
}
```

> Ao cancelar parcialmente parte de um valor destinado a um Subordinado, é cancelada proporcionalmente também a Tarifa Fixa que o Marketplace tem a receber.

## Agenda Financeira


