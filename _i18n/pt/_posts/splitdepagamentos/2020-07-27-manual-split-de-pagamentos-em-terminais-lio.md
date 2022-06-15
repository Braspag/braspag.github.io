---
layout: manual
title: Split de Pagamentos - Cielo LIO
description: Manual de Integração do Split de Pagamentos em Terminais LIO
search: true
toc_footers: false
categories: manual
sort_order: 3
hub_visible: false
tags:
  - 6. Soluções para Marketplace
language_tabs:
  json: JSON
---

# Introdução

O **Split de Pagamentos** permite a divisão de uma transação entre diferentes participantes de uma venda.

Para maiores detalhes e informações sobre a plataforma, consulte [Split de Pagamentos](https://www.braspag.com.br/split-de-pagamentos/){:target="_blank"}.

# Configuração

Para utilização do Split de Pagamentos na LIO, o terminal deverá estar habilitado para transacionar com múltiplos estabelecimentos comerciais, e será necessário configurar o estabelecimento comercial da Braspag (Subadquirência) pelo qual serão realizadas as transações destinadas ao Split.  

Para que seja possível realizar as liquidações para cada participante de uma venda realizada nos terminais LIO, o terminal deverá ser previamente cadastrado na plataforma e associado a um subordinado.

Com isso, no momento da configuração de um terminal, é necessário informar o número de identificação do terminal LIO (número lógico) para que seja possível a correta configuração e operação da plataforma.

> Para que seja possível operar com o Split utilizando terminais LIO, entre em contato com a equipe comercial Cielo/Braspag.

# Ambientes

## Sandbox

| API | URL | Descrição  |
|---|---|---|
|**Braspag OAUTH2 Server**|https://authsandbox.braspag.com.br/| Autenticação |
|**API Split**|https://splitsandbox.braspag.com.br/ | Divisão da transação e desconto de taxas no momento pós-transacional.|

## Produção

| API | URL | Descrição  |
|---|---|---|
|**Braspag OAUTH2 Server**|https://auth.braspag.com.br/| Autenticação |
|**API Split**|https://split.braspag.com.br/ | Divisão da transação e desconto de taxas no momento pós-transacional.|

# Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/){:target="_blank"}, no qual é necessário primeiramente obter um token de acesso utlizando suas credenciais, e posteriormente enviar o token de acesso à API do Split.

Para obter um token de acesso:

1. Concatene o MerchantId e ClientSecret: `MerchantId:ClientSecret`; 
2. Codifique o resultado da concatenação em Base64;  
3. Realize uma requisição ao servidor de autorização.  

## Requisição  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

## Resposta

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O MerchantId é o identificador dentro da Braspag, conhecido como MerchantId. O ClientSecret deve ser obtido junto à Braspag.

O token retornado (access_token) deverá ser utilizado em toda requisição à API Split como uma chave de autorização. O token de acesso possui uma validade de 20 minutos e é necessário gerar um novo token toda vez que a validade expirar. 

# Integração

# Criando uma transação  

## Requisição

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
      "AuthorizationDate":"2021-05-30 12:09:00",
      "CaptureDate":"2021-12-30"
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
| `PaymentDetails.TerminalLogicNumber`    | Número lógico do terminal LIO onde ocorreu a transação sem o dígito verificador.                        | String  | max(10) | Sim         |
| `PaymentDetails.AuthorizationDate`      | Data de autorização da transação em horário local (Brasil) [yyyy-MM-dd hh:mm:ss]                        | Datetime| -       | Sim         |
| `PaymentDetails.CaptureDate`            |Data de captura da transação [yyyy-MM-dd].                                                               |Date     | -       |Sim|
| `SplitPayments`                         | Nó contendo a informação de divisão da transação.                                                       | -       | -       | Não         |
| `SplitPayments.SubordinateMerchantId`   | **MerchantId** (identificador) do **Subordinado**.                                                      | Guid    | 36      | Sim         |
| `SplitPayments.Amount`                  | Parte do valor total da transação referente a participação do **Subordinado**, em centavos.             | Inteiro | -       | Sim         |
| `SplitPayments.Fares.Mdr`               | **MDR(%)** do **Master** a ser descontado do valor referente a participação do **Subordinado**.    | Decimal | -       | Não         |
| `SplitPayments.Fares.Fee`               | **Tarifa Fixa(R$)** a ser descontada do valor referente a participação do **Subordinado**, em centavos. | Inteiro | -       | Não         |

## Resposta

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
      "AuthorizationDate":"2021-12-30 12:09:00",
      "CaptureDate":"2021-12-30"
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
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (identificador) do **Subordinado** ou **Master**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Master**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |

## Transação existente

Durante o processo de criação da transação no Split realizada pela LIO, pode ocorrer alguma falha impedindo a criação da transação.

Caso a transação não seja criada no Split ao ser autorizada pela Cielo, o sistema de conciliação do Split irá gerar automaticamente a transação ao receber a confirmação por parte da Cielo. Após a criação automática, se houver uma nova tentativa de criação dessa mesma transação, a API irá retornar o status "409 - Conflict" e os dados da transação, informando que ela já existe.  

### Requisição

Para o exemplo abaixo, considerou-se que o terminal LIO está associado ao subordinado 7c7e5e7b-8a5d-41bf-ad91-b346e077f769.

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
      "AuthorizationDate":"2021-12-30 12:09:00",
      "CaptureDate":"2021-12-30"
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

### Resposta

> HTTP Status Code: 409 - Conflict

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
      "AuthorizationDate":"2018-05-30 12:09:00",
      "CaptureDate":"2021-12-30"
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

# Consulta

É possível consultar todos os dados de uma transação e o resultado da divisão pelo método e endpoint a seguir.

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/api/transactions/{Id}</span></aside>

Veja um exemplo de consulta com o Id *e718dc1e-fe8e-497e-9019-6aa48dee6306*:

## Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/api/transactions/e718dc1e-fe8e-497e-9019-6aa48dee6306</span></aside>

```x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

## Resposta

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
      "AuthorizationDate":"2021-12-30 12:09:00",
      "CaptureDate":"2021-12-30"
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

# Consulta de transações pendentes

Este tipo de consulta é indicado para buscar as informações de **transações pendentes de criação** que apresentaram erro pelo canal físico da Cielo e que, consequentemente, ocasionaram algum problema na operação de divisão da transação (split).

## Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/api/v1/pending-creation-transactions</span></aside>

| Filtro            | Descrição                                             | Tipo    | Tamanho | Obrigatório|  
|-------------------|-------------------------------------------------------|---------|---------|------------| 
| `InitialCaptureDate`| Data de Captura inicial da transação para busca.    |Data     |    10   | Não*       |  
| `FinalCaptureDate`| Data de Captura final da transação para busca.        |Data     |    10   | Não*       | 
| `InitialCreatedDate`| Data de Criação inicial da transação para busca.    |DateTime |    19   | Não*       |  
| `FinalCreatedDate`| Data de Criação final da transação para busca.        |DateTime |    19   | Não*       | 
| `PageIndex`       |Índice da paginação. Necessário para percorrer as páginas do resultado| Inteiro| - | Não|

*É obrigatório passar pelo menos um intervalo de datas.

## Resposta

```json
{
    "PageCount": 1,
    "PageIndex": 1,
    "PageSize": 2,
    "TotalItems": 5,
    "Items": [
        {
            "Amount": 39980,
            "Installments": 2,
            "Brand": "Master",
            "Product": "CreditCard",
            "PaymentDetails": {
                "AffiliationCode": "1234567891",
                "Nsu": 140997,
                "AuthorizationCode": "000140996",
                "TerminalLogicNumber": "10031168",
                "AuthorizationDate": "2021-05-29T00:10:38",
                "CaptureDate": "2021-05-30"
            }
        },
        {
            "Amount": 3700,
            "Installments": 1,
            "Brand": "Amex",
            "Product": "DebitCard",
            "PaymentDetails": {
                "AffiliationCode": "1010101019",
                "Nsu": 423999,
                "AuthorizationCode": "000140997",
                "TerminalLogicNumber": "42006558",
                "AuthorizationDate": "2021-05-20T11:11:48",
                "CaptureDate": "2021-05-20"
            }
        }
    ]
}
```

| Propriedade   | Tamanho            |Tipo               | Descrição                                             |
|---------------|--------------------|--------------------|-------------------------------------------------------|
| `PageCount`   | - | Inteiro            | Quantidade de páginas.                                |
| `PageIndex`   | - | Inteiro            | Página atual.                                         |
| `PageSize`    | - | Inteiro            | Quantidade máxima de itens por página.                |
| `TotalItems`  | - | Inteiro            | Total de itens do retorno da consulta.                |
| `Items`       | - | Array[Payments]    | Lista de objetos contendo informações das transações de pagamento. |
| `Items[].Amount`   | 25 | Inteiro       | Valor vendido para o portador.                        |
| `Items[].Installments`   | 4 | Inteiro | Número de parcelas de pagamento.                      |
| `Items[].Brand`          | 12* | String  | Bandeira do cartão.                                   |  
| `Items[].Product`        | 9* | String  | Produto. Tipos possíveis: "CreditCard", "DebitCard".  | 
| `Items[].PaymentDetails` | - | PaymentDetails| Objeto contendo as informações de detalhes de pagamento. |      
| `Items[].PaymentDetails.AffiliationCode`   | 20* | string  |  Código de afiliação do multiEC.    |
| `Items[].PaymentDetails.Nsu`  | 15* | String  | Número Sequencial Único do cartão.               |                                                                     
| `Items[].PaymentDetails.AuthorizationCode`  | 10* | String  | Código de autorização.             |
| `Items[].PaymentDetails.TerminalLogicNumber`| 15 | String  | Número do terminal lógico. Obrigatoriamente 8 caracteres. Excluindo o dígito do terminal.|
| `Items[].PaymentDetails.AuthorizationDate`  | 19 | DateTime| Data de autorização do pagamento.  |
| `Items[].PaymentDetails.CaptureDate`        | 10 | Data    | Data de captura do pagamento.       |

*Tamanho máximo.

# Cancelamento

Os cancelamentos serão processados automaticamente pelo Split de Pagamentos.

# Agenda Financeira

Utilize as informações publicadas em [Split de Pagamentos - Conciliação](https://braspag.github.io//manual/split-pagamentos-nova-api-conciliacao){:target="_blank"} para consultar a agenda e as unidades de recebíveis.
