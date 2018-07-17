---
layout: manual
title: Split de Pagamentos - Antecipação
description: Split de Pagamentos - Antecipação
search: true
toc_footers: false
categories: manual
sort_order: 3
hub_visible: false
tags:
---

# Split de Pagamentos - Antecipação

## Introdução

O **Split de Pagamentos** liquida os valores referentes a cada particpante de uma transação de acordo com o regime padrão de cada arranjo de pagamento.

Como exemplo, para uma transação de crédito realizada em 3x e envolvendo 2 Subordinados, cada participante, inclusive o Master, receberá os valores referentes a cada parcela da transação citada em 30, 60 e 90 dias.

Com a Antecipação, é possível que o Master antecipe os seus recebíveis e/ou dos seus subordinados.

Para consultar a agenda financeira com a previsão dos recebíveis futuros, consulte o manual [Split de Pagamentos](https://braspag.github.io//manual/split-pagamentos-braspag#agenda-financeira){:target="_blank"}.

## Regras

A antecipação dos recebíveis de vendas no Split é baseada nas seguintes regras:

* Somente o Master pode solicitar antecipação.
* É permitido somente antecipar o valor cheio de uma parcela, não sendo possível antecipar metade de uma parcela, por exemplo.
* O percentual informado no momento da solicitação só é aplicável quando o Master está solicitando a antecipação para um dos seus subordinados. A Braspag irá desconsiderar este percentual caso a antecipação seja para o próprio Master.
* A solicitação de antecipação não é aceita imediatamente. A mesma é recebida, analisada e poderá ser aceita ou recusada.
* Ao realizar a antecipação de recebíveis de uma data, são antecipados tanto os créditos quanto os débitos.
* A data para antecipar deverá ser maior ou igual a data da solicitação acrescida em 3 dias.

## Integração

### Solicitar uma Antecipação

A antecipação de recebíveis deve ser realizada através de uma requisição informando os dias que se deseja antecipar e quando se deseja receber.

Como Master, é possível antecipar os recebíveis de um subordinado e informar o percentual a ser descontado do subordinado pela operação.

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-api}/schedule-api/{merchantId}/anticipation</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "AnticipateTo": "2018-04-01",
    "ReceivablesToAnticipate": [
        {
            "Date": "2018-04-22",
            "Amount": 5567890,
            "Percent": 5.00
        },
        {
            "Date": "2018-04-23",
            "Amount": 2354600
            "Percent": 5.01
        },
        {
            "Date": "2018-04-24",
            "Amount": 150000
            "Percent": 5.05
        }
    ]
}
```

| Parâmetro                          | Descrição                                                                            | Tipo    | Formato    | Obrigatório |
|------------------------------------|--------------------------------------------------------------------------------------|---------|------------|-------------|
| `AnticipateTo`                     | Data para qual se deseja antecipar os recebíveis.                                    | Data    | YYYY-MM-DD | Sim         |
| `ReceivablesToAnticipat[].Date`    | Data prevista de recebíveis futuros que se deseja antecipar.                         | Data    | YYYY-MM-DD | Sim         |
| `ReceivablesToAnticipat[].Amount`  | Valor, em centavos, que se deseja antecipar.                                         | Inteiro | -          | Sim         |
| `ReceivablesToAnticipat[].Percent` | Percentual, destinado ao Master, sobre o valor ser antecipado.                       | Decimal | YYYY-MM-DD | Não         |

#### Response

```json
-- "202 Accepted"
{
    "AnticipationId": "1CC958F0-B02B-4F66-B5B1-F857AEF4BE1D",
    "AnticipateTo": "2018-04-01",
    "Status": "Received",
    "ReceivablesToAnticipate": [
        {
            "Date": "2018-04-22",
            "Amount": 5567890
            "Percent": 5.00
        },
        {
            "Date": "2018-04-23",
            "Amount": 2354600,
            "Percent": 5.01
        },
        {
            "Date": "2018-04-24",
            "Amount": 150000,
            "Percent": 5.05
        }
    ]
}
```

| Parâmetro                          | Descrição                                                                            | Tipo    | Formato    | Obrigatório |
|------------------------------------|--------------------------------------------------------------------------------------|---------|------------|-------------|
| `AnticipateId`                     | Identificador da atencipação.                                                        | Guid    | -          | Sim         |
| `Status`                           | Status da antecipação. [Received - Accepted - Rejected]                              | String  | -          | Sim         |

### Consultar uma Antecipação

#### Request

<aside class="request"><span class="method post">GET</span> <span class="endpoint">{split-api}/schedule-api/{merchantId}/anticipation/{anticipationid}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

#### Response

```json
{
    "AnticipationId": "1CC958F0-B02B-4F66-B5B1-F857AEF4BE1D",
    "AnticipateTo": "2018-04-01",
    "Status": "Received",
    "ReceivablesToAnticipate": [
        {
            "Date": "2018-04-22",
            "Amount": 5567890
            "Percent": 5.00
        },
        {
            "Date": "2018-04-23",
            "Amount": 2354600,
            "Percent": 5.01
        },
        {
            "Date": "2018-04-24",
            "Amount": 150000,
            "Percent": 5.05
        }
    ]
}
```

## Agenda Financeira

Caso a atencipação seja aceita, a agenda do estabelciment, para a qual a antecipação foi solicitada, será sensibilizada com eventos indicando as datas previstas para pagamento.

Eventos de Crédito:

| Evento                         | Descrição                                                                                               |
|--------------------------------|---------------------------------------------------------------------------------------------------------|
| `UndoToAnticipationCredit`     | Lançamento de crédito para desfazimento de eventos futuros antecipados.                                 |
| `AnticipationCredit`           | Lançamento de crédito de antecipação.                                                                   |

Eventos de Débito:

| Evento                         | Descrição                                                                                               |
|--------------------------------|---------------------------------------------------------------------------------------------------------|
| `UndoToAnticipationDebit `     | Lançamento de débito para desfazimento de eventos futuros antecipados.                                  |
| `AnticipationDebit`            | Lançamento de débito de antecipação.                                                                    |

## Notificação

Quando a antecipação for analisada, a mesma poderá ser aceita ou recusada e uma notificação pode ser enviada para um URL previamente cadastrada na Braspag.

| Propriedade         | Descrição                                                                                               |
|---------------------|---------------------------------------------------------------------------------------------------------|
| `Id `               | Identificador da anteciapção.                                                                           |
| `ChangeType`        | 10 - Analise da antecipação realizada.                                                                  |

Ao receber a notificação, consulte a antecipação para obter o status.