---
layout: manual
title: Manual Split de Pagamentos - API de Cancelamento
description: Manual integração do Split de Pagamentos para transações
search: true
toc_footers: false
categories: manual
sort_order: 6
hub_visible: false
tags:
---

# Split de Pagamentos - API de Cancelamento

## Introdução

O **Split de Pagamentos** permite o cancelamento de transações realizadas através de terminais físicos (POS, LIO, TEF), conhecidas como transações de cartão presente, ou eCommerce, conhecidas como transações de cartão não presente.

Para transações de eCommerce, as mesmas devem ser canceladas pelo mesmo canal onde a transação ocorreu, sendo o Pagador Braspag ([Split de Pagamentos - Pagador Braspag](https://braspag.github.io//manual/split-pagamentos-braspag-pagador){:target="_blank"}) ou a API eCommerce Cielo ([Split de Pagamentos - API eCommerce Cielo](https://braspag.github.io//manual/split-pagamentos-braspag){:target="_blank"}).

## Ambientes

### Sandbox

* **API Split**: https://splitsandbox.braspag.com.br/api
* **Braspag OAUTH2 Server**: https://authsandbox.braspag.com.br/

### Produção

* **API Split**: https://split.braspag.com.br/api
* **Braspag OAUTH2 Server**: https://auth.braspag.com.br/

## Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/){:target="_blank"}, onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais, que deverá posteriormente ser enviado à API do Split.

Consulte [Split de Pagamentos - Autenticação](https://braspag.github.io//manual/split-pagamentos-braspag#autentica%C3%A7%C3%A3o){:target="_blank"} para detalhes técnicos.

## Integração

### Premissas

* Deve-se utilizar o identificador da transação no Split de Pagamentos ao realizar o cancelamento.
* Os status possíveis do cancelameno são:
    * **Undefined**: cancelamento criado no Split mas ainda não enviado para processamento.
    * **Pending**: cancelamento foi enviado para processamento.
    * **Approved**: cancelamento aprovado, mas ainda necessidta de efetivação.
    * **Successful**: cancelamento concluído.
    * **Unsuccessful**: cancelamento não pôde ser concluído.
* O acesso à esta API ocorre mediante aprovação da Braspag e somente poderá ser liberada para Masters. Entre em contato através do e-mail split.risco@braspag.com.br informando os seus dados (MerchantId, CNPJ e Razão Social).

#### Cancelamento Total

No cancelamento total de uma transação, será cancelado o valor total da transação e consequentemente o valor total de cada Subordinado e as comissões de todos os participantes.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-split}/transactions/{TransactionId}/void?amount={amount}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

No exemplo abaixo é cancelado o valor total de uma transação capturada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-split}/transactions/fb6271ae-57f8-48f1-87df-4e5667dd91e1/void?amount=10000</span></aside>

**Response**

```json
{
    "Id": "d7f1d440-a563-45e8-927b-7b7a913bd745",
    "StatusId": 4,
    "StatusDescription": "Pending",
    "Amount": 2500,
    "VoidSplitPayments": [
        {
            "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
            "VoidedAmount": 4000,
            "VoidedSplits": [
                {
                    "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                    "VoidedAmount": 3825
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "VoidedAmount": 175
                }
            ]
        },
        {
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "VoidedAmount": 6000,
            "VoidedSplits": [
                {
                    "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                    "VoidedAmount": 5670
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "VoidedAmount": 330
                }
            ]
        }
    ],
    "Date": "2020-07-23"
}
```

| Propriedade| Descrição | Tipo | Tamanho |
|-|-|-|-|-|
| `Id`| Identificador do cancelamento.| Guid | 36 |
| `StatusId`| Identificador do status. | Inteiro | - |
| `StatusDescription`| Descrição do Status| String| 50 |
| `Amount`| Valor do cancelamento em centavos. | Inteiro | - |
| `Date`| Data de criação do cancelamento. | Date | YYYY-MM-DD |
| `VoidSplitPayments[].SubordinateMerchantId`| **MerchantId** (Identificador) do **Subordinado**. | Guid | 36 |
| `VoidSplitPayments[].VoidedAmount`| Total ou parte do valor destinado ao **Subordinado** a ser cancelado, em centavos. | Inteiro | - |
| `VoidSplitPayments[].VoideSplits[].MerchantId`| **MerchantId** do master ou subordinado. | Guid | 36 |
| `VoidSplitPayments[].VoideSplits[].VoidedAmount`| Valor referente ao split do cancelamento, em centavos. | Guid | 36 |

#### Cancelamento Parcial

No cancelamento parcial, o somatório dos valores cancelados definidos para cada Subordinado deve ser igual ao valor do cancelamento.

No exemplo abaixo é cancelado o valor de R$25,00 de uma transação capturada no valor de R$100,00.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-split}/transactions/1acdb9ab-1d5b-4722-9e91-a488217cd32d/void?amount=2500</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
        "VoidedAmount": 1500
    },
    {
        "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
        "VoidedAmount": 1000
    }
]
```

| Propriedade                  | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `[].SubordinateMerchantId`   | **MerchantId** (Identificador) do **Subordinado**.                                                      | Guid    | 36      | Sim         |
| `[].VoidedAmount`            | Total ou parte do valor destinado ao **Subordinado** a ser cancelado, em centavos.                      | Inteiro | -       | Sim         |

**Response**

```json
{
    "Id": "1acdb9ab-1d5b-4722-9e91-a488217cd32d",
    "StatusId": 4,
    "StatusDescription": "Pending",
    "Amount": 2500,
    "VoidSplitPayments": [
        {
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "VoidedAmount": 1500,
            "VoidedSplits": [
                {
                    "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                    "VoidedAmount": 1417
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "VoidedAmount": 83
                }
            ]
        },
        {
            "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
            "VoidedAmount": 1000,
            "VoidedSplits": [
                {
                    "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                    "VoidedAmount": 956
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "VoidedAmount": 44
                }
            ]
        }
    ],
    "Date": "2020-07-23"
}
```

| Propriedade| Descrição | Tipo | Tamanho |
|-|-|-|-|-|
| `Id`| Identificador do cancelamento.| Guid | 36 |
| `StatusId`| Identificador do status. | Inteiro | - |
| `StatusDescription`| Descrição do Status| String| 50 |
| `Amount`| Valor do cancelamento em centavos. | Inteiro | - |
| `Date`| Data de criação do cancelamento. | Date | YYYY-MM-DD |
| `VoidSplitPayments[].SubordinateMerchantId`| **MerchantId** (Identificador) do **Subordinado**. | Guid | 36 |
| `VoidSplitPayments[].VoidedAmount`| Total ou parte do valor destinado ao **Subordinado** a ser cancelado, em centavos. | Inteiro | - |
| `VoidSplitPayments[].VoideSplits[].MerchantId`| **MerchantId** do **Master** ou **Subordinado**. | Guid | 36 |
| `VoidSplitPayments[].VoideSplits[].VoidedAmount`| Valor referente ao split do cancelamento, em centavos. | Guid | 36 |

Não é obrigatório informar todos os Subordinados no cancelamento parcial. Pode-se informar apenas os subordinados para os quais se deseja cancelar totalmente ou parte do valor destinado aos mesmos na transação. No exemplo acima poderia ser informado, por exemplo, apenas o segundo subordinado, conforme exemplo abaixo:

```json
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
            "VoidedAmount": 2500
        }
     ]
}
```

> Ao cancelar parcialmente parte de um valor destinado a um Subordinado, é cancelada proporcionalmente também a Tarifa Fixa que o Marketplace tem a receber.

### Consultando um cancelamento

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/transactions/{TransactionId}/void/{id}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

**Response**

```json
{
    "Id": "fb6271ae-57f8-48f1-87df-4e5667dd91e1",
    "StatusId": 4,
    "StatusDescription": "Pending",
    "Amount": 101,
    "VoidSplitPayments": [
        {
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "VoidedAmount": 1500,
            "VoidedSplits": [
                {
                    "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                    "VoidedAmount": 1417
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "VoidedAmount": 83
                }
            ]
        },
        {
            "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
            "VoidedAmount": 1000,
            "VoidedSplits": [
                {
                    "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                    "VoidedAmount": 956
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "VoidedAmount": 44
                }
            ]
        }
    ],
    "Date": "2020-07-23"
}
```

| Propriedade| Descrição | Tipo | Tamanho |
|-|-|-|-|-|
| `Id`| Identificador do cancelamento.| Guid | 36 |
| `StatusId`| Identificador do status. | Inteiro | - |
| `StatusDescription`| Descrição do Status| String| 50 |
| `Amount`| Valor do cancelamento em centavos. | Inteiro | - |
| `Date`| Data de criação do cancelamento. | Date | YYYY-MM-DD |
| `VoidSplitPayments[].SubordinateMerchantId`| **MerchantId** (Identificador) do **Subordinado**. | Guid | 36 |
| `VoidSplitPayments[].VoidedAmount`| Total ou parte do valor destinado ao **Subordinado** a ser cancelado, em centavos. | Inteiro | - |
| `VoidSplitPayments[].VoideSplits[].MerchantId`| **MerchantId** do **Master** ou **Subordinado**. | Guid | 36 |