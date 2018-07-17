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

O **Split de Pagamentos** liquidada os valores referentes a cada particpante de uma transação de acordo com o regime padrão de cada arranjo de pagamento.

Como exemplo, para uma transação de crédito realizada em 3x e envolvendo 2 Subordinados, cada participante, inclusive o Master, receberá os valores referente a cada parcela da transação citada em 30, 60 e 90 dias.

Com a Antecipação, é possível o Master antecipar seus recebíveis ou dos seus subordinados.

## Integração

A antecipação de recebíveis deve ser realizada através de uma requisição informando os dias que se deseja antecipar e quando se deseja receber.

Como Master, é possível antecipar os recebíceis de um subordinado e informar o percentual a ser descontado do subordinado pela operação.

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-api}/schedule-api/{merchantId}/anticipation</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
	AnticipateTo: "2018-04-01",
    ReceivablesToAnticipate: [
        {
            Date: "2018-04-22",
            Amount: 5567890,
            Percent: 5.00
        },
        {
            Date: "2018-04-23",
            Amount: 2354600
            Percent:5.01
        },
        {
            Date: "2018-04-24",
            Amount: 150000
            Percent: 5.05
        }
    ]
}
```

### Response

```json
{
    AtecipateId: 1CC958F0-B02B-4F66-B5B1-F857AEF4BE1D,
	AnticipateTo: "2018-04-01",
    ReceivablesToAnticipate: [
        {
            Date: "2018-04-22",
            Amount: 5567890
            Percent: 5.00
        },
        {
            Date: "2018-04-23",
            Amount: 2354600,
            Percent:5.01
        },
        {
            Date: "2018-04-24",
            Amount: 150000,
            Percent: 5.05
        }
    ]
}
```