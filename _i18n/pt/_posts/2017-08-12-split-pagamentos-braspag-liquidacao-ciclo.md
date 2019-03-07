---
layout: manual
title: Split de Pagamentos - Liquicação em Ciclo
description: Split de Pagamentos - Liquicação em Ciclo
search: true
toc_footers: false
categories: manual
sort_order: 3
hub_visible: false
tags:
---

# Split de Pagamentos - Liquicação em Ciclo

## Introdução

O **Split de Pagamentos** liquida os valores referentes a cada participante de uma transação de acordo com o regime padrão de cada arranjo de pagamento.

Como exemplo, para uma transação de crédito realizada em 3x e envolvendo 2 Subordinados, cada participante, inclusive o Master, receberá os valores referentes a cada parcela da transação citada em 30, 60 e 90 dias.

![RegimeLiquidacaoPadrao](https://braspag.github.io/images/braspag/split/regime-pagamento-padrao.png)

Com a Liquidação em Ciclo, é possível que o Master solicite que um ou mais subordinados recebam em ciclo, podendo escolher até duas datas fixas no mês.

![RegimeLiquidacaoCiclo](https://braspag.github.io/images/braspag/split/regime-pagamento-ciclo.png)

Para consultar a agenda financeira com a previsão dos recebíveis futuros, consulte o manual [Split de Pagamentos](https://braspag.github.io//manual/split-pagamentos-braspag#agenda-financeira){:target="_blank"}.

## Cálculo

Na liquidação em ciclo, o **Split de Pagamentos** aplica um fator percentual sobre a participação do subordinado na venda.

Supondo uma transação de R$1.000,00 em 4 parcelas e os seguintes parâmetros:

**Mdr Braspag:** 3%
**Mdr Master / Subordinado A:** 20%
**Mdr Master / Subordinado B:** 5%

**Participação Subordinado A:** R$600,00
**Participação Subordinado B:** R$400,00

O cáculo ocorre da seguinte forma:

**[Bruto] Braspag:** R$1.000,00 * 3% = R$30,00
**[Bruto] Master / Subordinado A:** R$600,00 *  



## Regras

A antecipação dos recebíveis de vendas no Split é baseada nas seguintes regras:

* Somente o Master pode solicitar antecipação.
* É permitido somente antecipar o valor cheio de uma parcela, não sendo possível antecipar metade de uma parcela, por exemplo.
* O percentual informado no momento da solicitação só é aplicável quando o Master está solicitando a antecipação para um dos seus subordinados. A Braspag irá desconsiderar este percentual caso a antecipação seja para o próprio Master.
* A solicitação de antecipação não é aceita imediatamente. A mesma é recebida, analisada e poderá ser aceita ou recusada.
* Ao realizar a antecipação de recebíveis de uma data, são antecipados tanto os créditos quanto os débitos.
* A data a receber os valores referentes à antecipação deverá ser maior ou igual a data da solicitação acrescida em 2 dias úteis.



## Integração

### Solicitar uma Antecipação

A antecipação de recebíveis deve ser realizada através de uma requisição informando se deseja antecipar parte ou total dos recebíveis futuros e a data que deseja receber.

Como Master, é possível antecipar os recebíveis de um subordinado e informar o percentual a ser descontado do mesmo pela operação.

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-api}/anticipation-api/anticipations</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "ScheduleToAnticipate": "Partial",
    "AmountToAnticipate": 5567890,
    "MerchantId": "0a757dc0-836f-4fdd-9220-8098b415ee03",
    "MasterCdiPercent": 187.00,
    "PaymentDate": "2018-12-28",
    "Notification": {
        "Url": "https://mynotification.com.br/notification",
        "Headers": [{
            "Key": "mykey",
            "Value": "4F66B5B1B02B"
        }]
    }
}
```

| Parâmetro                              | Descrição                                                                               | Tipo    | Formato    | Obrigatório |
|----------------------------------------|-----------------------------------------------------------------------------------------|---------|------------|-------------|
| `ScheduleToAnticipate`                 | Parte da agenda a ser antecipada [Partial - Total].                                     | String  | -          | Sim         |
| `AmountToAnticipate`                   | Valor, em centavos, que deseja antecipar. Obrigatório se ScheduleToAnticipate = Partial | Inteiro | -          | Não         |
| `MerchantId`                           | Loja para a qual antecipar, podendo ser um Subordinado ou Master                        | Guid    | 36         | Sim         |
| `MasterCdiPercent`                     | Percentual CDI cobrado pelo Master. Obrigatório se MerchantId for um Subordinado        | Decimal | -          | Não         |
| `PaymentDate`                          | Data que se deseja antecipar, deve ser maior que data da solicitação + 2 dias úteis     | Date    | YYYY-MM-DD | Sim         |
| `Notification.Url`                     | Url que receberá a notificação sobre a mudança de status da antecipação.                | String  | -          | Sim         |
| `Notification.Headers[].Key`           | Chave de autenticação do endpoint de notificação do status da antecipação.              | String  | -          | Sim         |
| `Notification.Headers[].Value`         | Valor de autenticação do endpoint de notificação do status da antecipação.              | String  | -          | Sim         |

#### Response

```json
-- "201 Created"
{
    "Id": "1CC958F0-B02B-4F66-B5B1-F857AEF4BE1D",
    "Status": "Created",
    "ScheduleToAnticipate": "Partial",
    "AmountToAnticipate": 5567890,
    "MerchantId": "0a757dc0-836f-4fdd-9220-8098b415ee03",
    "MasterCdiPercent": 187.00,
    "PaymentDate": "2018-12-28",
    "Notification": {
        "Url": "https://mynotification.com.br/notification",
        "Headers": [{
            "Key": "mykey",
            "Value": "4F66B5B1B02B"
        }]
    }
}
```

| Parâmetro                          | Descrição                                                                            | Tipo    | Formato    | Obrigatório |
|------------------------------------|--------------------------------------------------------------------------------------|---------|------------|-------------|
| `Id`                               | Identificador da antecipação.                                                        | Guid    | 36         | Sim         |
| `Status`                           | Status da antecipação. [Created - InAnalysis - Approved - Reproved - Processed]      | String  | -          | Sim         |

### Consultar uma Antecipação

Para consultar uma antecipação específica basta informar o identificador da antecipação na requisição.

#### Request

<aside class="request"><span class="method post">GET</span> <span class="endpoint">{split-api}/anticipation-api/anticipations/{anticipationId}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

#### Response

```json
-- "200 OK"
{
    "Id": "1CC958F0-B02B-4F66-B5B1-F857AEF4BE1D",
    "Status": "Processed",
    "ScheduleToAnticipate": "Partial",
    "AmountToAnticipate": 5567890,
    "MerchantId": "0a757dc0-836f-4fdd-9220-8098b415ee03",
    "MasterCdiPercent": 187.00,
    "MasterAnticipationRate": 1.07,
    "BraspagCdiPercent": 128.00,
    "BraspagAnticipationRate": 0.68,
    "PaymentDate": "2018-12-28",
    "AnticipatedGrossAmount": 5867890,
    "AnticipatedNetAmount": 5567890,
    "MasterComissionAmount": 125470,
    "Notification": {
        "Url": "https://mynotification.com.br/notification",
        "Headers": [{
            "Key": "mykey",
            "Value": "4F66B5B1B02B"
        }]
    }
}
```

| Parâmetro                          | Descrição                                                                                | Tipo    | Formato    | Obrigatório |
|------------------------------------|------------------------------------------------------------------------------------------|---------|------------|-------------|
| `Id`                               | Identificador da antecipação.                                                            | Guid    | 36         | Sim         |
| `Status`                           | Status da antecipação. [Created - InAnalysis - Approved - Reproved - Processed].         | String  | -          | Sim         |
| `ScheduleToAnticipate`             | Parte da agenda a ser antecipada [Partial - Total].                                      | String  | -          | Sim         |
| `AmountToAnticipate`               | Valor, em centavos, que deseja antecipar. Obrigatório se ScheduleToAnticipate = Partial. | Inteiro | -          | Não         |
| `MerchantId`                       | Loja para a qual antecipar, podendo ser um Subordinado ou Master.                        | Guid    | 36         | Sim         |
| `MasterCdiPercent`                 | Percentual CDI cobrado pelo Master. Obrigatório se MerchantId for um Subordinado.        | Decimal | -          | Não         |
| `MasterAnticipationRate`           | Taxa efetiva da antecipação do Master (Se Status for Approved | Processed).              | Decimal | -          | Não         |
| `BraspagCdiPercent`                | Percentual do CDI cobrado pela Braspag (Se Status for Approved | Processed).             | Decimal | -          | Não         |
| `BraspagAnticipationRate`          | Taxa efetiva da antecipação da Braspag (Se Status for Approved | Processed).             | Decimal | -          | Não         |
| `AnticipatedGrossAmount`           | Valor da agenda antecipada (Se Status for  Processed).                                   | Decimal | -          | Não         |
| `AnticipatedNetAmount`             | Valor antecipado após processamento (Se Status for  Processed).                          | Decimal | -          | Não         |
| `MasterComissionAmount`            | Valor de comissão do master após processamento (Se Status for  Processed).               | Decimal | -          | Não         |
| `PaymentDate`                      | Data que se deseja antecipar, deve ser maior que data da solicitação + 2 dias úteis.     | Date    | YYYY-MM-DD | Sim         |
| `Notification.Url`                 | Url que receberá a notificação sobre a mudança de status da antecipação.                 | String  | -          | Sim         |
| `Notification.Headers[].Key`       | Chave de autenticação do endpoint de notificação do status da antecipação.               | String  | -          | Sim         |
| `Notification.Headers[].Value`     | Valor de autenticação do endpoint de notificação do status da antecipação.               | String  | -          | Sim         |

Para consultar várias antecipações poderá ser utilizado como filtro o PaymentDate e o MerchantId para qual a antecipação foi solicitada.

#### Request

<aside class="request"><span class="method post">GET</span> <span class="endpoint">{split-api}/anticipation-api/anticipations?PaymentDate=2018-12-28&MerchantId=0a757dc0-836f-4fdd-9220-8098b415ee03</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

#### Response

```json
-- "200 OK"
{
    "PageCount": 1,
    "PageSize": 25,
    "PageIndex": 1,
    "Anticipations": [{
        "Id": "1CC958F0-B02B-4F66-B5B1-F857AEF4BE1D",
        "Status": "Processed",
        "ScheduleToAnticipate": "Partial",
        "AmountToAnticipate": 5567890,
        "MerchantId": "0a757dc0-836f-4fdd-9220-8098b415ee03",
        "MasterCdiPercent": 187.00,
        "MasterAnticipationRate": 1.07,
        "BraspagCdiPercent": 128.00,
        "BraspagAnticipationRate": 0.68,
        "PaymentDate": "2018-12-28",
        "AnticipatedGrossAmount": 5867890,
        "AnticipatedNetAmount": 5567890,
        "MasterComissionAmount": 125470,
        "Notification": {
            "Url": "https://mynotification.com.br/notification",
            "Headers": [{
                "Key": "mykey",
                "Value": "4F66B5B1B02B"
            }]
        }
    }, 
    {
        "Id": "4a16e1d9-f1c9-48b9-9545-0ccf6c4a3d3e",
        "Status": "Processed",
        "ScheduleToAnticipate": "Total",
        "MerchantId": "0a757dc0-836f-4fdd-9220-8098b415ee03",
        "MasterCdiPercent": 200.00,
        "MasterAnticipationRate": 1.09,
        "BraspagCdiPercent": 143.00,
        "BraspagAnticipationRate": 0.70,
        "PaymentDate": "2018-12-28",
        "AnticipatedGrossAmount": 58778,
        "AnticipatedNetAmount": 55678,
        "MasterComissionAmount": 8953,
        "Notification": {
            "Url": "https://mynotification.com.br/notification",
            "Headers": [{
                "Key": "mykey",
                "Value": "4F66B5B1B02B"
            }]
        }
    }]
}
```

| Parâmetro                  | Descrição                                                     | Tipo    | Formato    | Obrigatório |
|----------------------------|--------------------------------------------------------------------------------------|-------------|
| `PageIndex`                | Página a ser consultada.                                      | Inteiro | -          | Sim         |
| `PageSize`                 | Tamanho da página. Valores possíveis: 25, 50, 100.            | Inteiro | -          | Sim         |
| `PageCount`                | Quantidade de páginas                                         | Inteiro | -          | Sim         |

## Agenda Financeira

Caso a antecipação seja aceita, a agenda do estabelecimento, para a qual a antecipação foi solicitada, será sensibilizada com eventos indicando as datas previstas para pagamento.

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
| `Id `               | Identificador da antecipação.                                                                           |
| `ChangeType`        | 10 - Análise da antecipação realizada.                                                                  |

Ao receber a notificação, consulte a antecipação para obter o status.