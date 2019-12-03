---
layout: manual
title: Split de Pagamentos - Pagador
description: Manual integração do Split de Pagamentos
search: true
toc_footers: false
categories: manual
sort_order: 4
hub_visible: false
tags:
  - Soluções para Marketplace
---

# Split de Pagamentos

**[Solicite sua credencial para o ambiente de teste em nosso portal de suporte https://suporte.braspag.com.br ou pelo telefone 4003-3058]**

## Introdução

O **Split de Pagamentos** permite a divisão de uma transação entre diferentes participantes de uma venda.

Muito utilizado em Marketplaces, onde **o carrinho é composto por produtos de diferentes fornecedores e o valor total da venda deve ser dividido entre todos os participantes**.

| **Participantes** | **Descrição** |
|-----------|---------- |
| **Marketplace** | Responsável pelo carrinho (Master). <br> Possui acordos com **Subordinados** que fornecem os produtos presentes no carrinho.<br> Define as taxas a serem descontadas sobre a venda de cada **Subordinado**.<br> Pode participar de uma venda fornecendo seus próprios produtos. |
| **Subordinado** | Fornecedor dos produtos que compõem o carrinho.<br>Recebe parte do valor da venda, descontadas as taxas acordadas com o **Marketplace**.|
| **Braspag (Facilitador)** | Responsável pelo fluxo transacional.<br> Define as taxas a serem descontadas sobre o valor total da venda realizada pelo **Marketplace**.<br> Responsável pela liquidação dos pagamentos para os **Subordinados** e **Marketplace**.|

No Split de Pagamentos o responsável pelo fluxo transacional é a Braspag (facilitador).

O Marketplace se integra à Braspag para transacionar e informa como será dividida a transação entre cada participante, podendo ser no momento de captura ou em um momento posterior, conhecido como Split pós-transacional, desde que seja dentro de um limite de tempo pré-estabelecido.

Com a transação capturada, a Braspag calcula o valor destinado a cada participante e repassa esses valores, no prazo estabelecido de acordo com cada produto (regime de pagamento\*), para cada envolvido na transação.

> **Regime de Pagamento**: Prazo estabelecido para liquidação de acordo com o produto (crédito ou débito) e bandeira.
> <br>
> **Crédito**: Em até 31 dias. <br>
> **Crédito Parcelado**: 1º parcela em até 31 dias, demais a cada 30.<br>
> **Débito**: Em até 2 dias úteis.

Para utilizar o Split de Pagamentos, o Marketplace deverá se cadastrar na Braspag juntamente com seus Subordinados. Após este processo, tanto o Marketplace quanto seus Subordinados possuirão um identificador único, conhecido como **MerchantId (MID)**, que deverá ser utlizado ao informar as regras de divisão de uma transação.

Na divisão de uma transação, devem ser informados:

* Os **identificadores dos Subordinados**.
* Os **valores de participação de cada Subordinado**. O somatório deverá ser igual ao valor total da transação.
* **Taxas** a serem aplicadas sobre o valor de cada Subordinado destinadas ao Marketplace. Estas deverão ser acordadas previamente entre o Marketplace e o Subordinado.

O Marketplace também pode ser um participante da divisão, bastando informar seu identificador, passando o mesmo a ter também o papel de **Subordinado** e ter seus próprios produtos no carrinho.

### Taxas

As taxas acordadas entre os participantes, podendo ser um **MDR(%)** e/ou uma **Taxa Fixa(R$)**, devem ser definidas no momento do cadastro do Marketplace e dos seus Subordinados junto à Braspag (Facilitador).

As mesmas poderão ser enviadas no momento transacional (captura) ou pós-transacional. Caso não sejam enviadas, serão consideradas as taxas cadastradas e acordadas previamente entre o participantes.

> **MDR (*Merchant Discount Rate*):** Percentual a ser descontado do valor de uma transação, definido por produto (Crédito / Débito), Bandeira e Faixa de Parcelamento. <br>
> **Fee:** Taxa fixa. Valor em centavos a ser cobrado por transação capturada.

#### Braspag (Facilitador)

A Braspag acordará um MDR e/ou uma Tarifa Fixa com o Marketplace a serem descontadas do valor total de cada transação.

O Marketplace, de conhecimento destas taxas, negociará também um MDR e/ou uma Tarifa Fixa juntamente com cada Subordinado, embutindo o MDR e/ou Tarifa acordados junto à Braspag (Facilitador).

O desconto da Tarifa Fixa, acordada entre o Marketplace e a Braspag, não é aplicado no valor total da transação, ou seja, a mesma não entra no cálculo da divisão e sim é debitada diretamente do montante que o Marketplace tem para receber junto à Braspag (Facilitador). O MDR entra no cálculo de divisão da transação, já que o mesmo deve estar embutido no MDR acordado entre o Marketplace e seus Subordinados.

> **Custo Marketplace:** MDR Braspag (%) + Tarifa Fixa Braspag (R$)

#### Marketplace

O Marketplace é responsável por acordar as taxas a serem cobradas dos seus Subordinados, onde deve ser defindo um MDR maior ou igual ao MDR definido entre a Braspag (Facilitador) e o Marketplace, e uma Tarifa Fixa, que é opcional.

> **Custo Subordinado:** MDR Marketplace (%) + Tarifa Fixa (R$), onde o MDR Marketplace (%) considera o MDR Braspag (%).

#### Exemplo

Uma transação de **R$100,00**, realizada por um **Marketplace** com participação do **Subordinado 01**.

![SplitSample001](https://developercielo.github.io/images/split/split001.png)

Neste exemplo, foram assumidos os seguintes acordos:

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.  
**Taxa Marketplace**: 3,5% MDR (embutindo os 2% do MDR Braspag) + 0,30 Tarifa Fixa.

Após o split, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado**:  
Crédito: R$96,20 [Descontados o MDR e a Tarifa Fixa acordados com o Marketplace]

**Marketplace**:  
Crédito: R$1,80 [MDR aplicado sobre o valor do subordinado descontando o MDR acordado com a Braspag (Facilitador)]
Débito: R$0,10 [Tarifa Fixa acordada com a Braspag (Facilitador)]

**Braspag (Facilitador)**:  
Crédito: R$2,00 [MDR aplicado sobre o valor total da transação]
Crédito: R$0,10 [Tarifa Fixa acordada com o Marketplace]

### Bandeiras

As bandeiras suportadas pelo Split são:

* Visa
* MasterCard 
* Elo
* Amex
* Hipercard
* Diners
* Discover

## Ambientes

É possível dividir uma venda enviada para o Pagador em várias liquidações para contas diferentes através do Split Braspag. Para utilizar o Split, é necessário contratar o serviço com seu executivo comercial.

> Embora não seja necessário integrar-se com a API 3.0 da Cielo, é mandatório uma afiliação à Cielo para transacionar com o Split através do Pagador.

### Sandbox

* **API Split**: https://splitsandbox.braspag.com.br/
* **Braspag OAUTH2 Server**: https://authsandbox.braspag.com.br/

### Produção

* **API Split**: https://split.braspag.com.br/
* **Braspag OAUTH2 Server**: https://auth.braspag.com.br/

## QuickStart

O request de crédito do Split é composto por 4 campos obrigatórios: **MerchantOrderId**, **Customer**, **Payment** e **Payment.FraudAnalysis**.

Abaixo montaremos um request simples. O suficiente para enviarmos a nossa primeira transação, sem nos preocuparmos muito com detalhes. **Esse exemplo é o básico para entendimento e não deve ser utilizado em produção**.

### MerchantOrderId

Esse campo é onde informamos o número do pedido que existe na loja do cliente.

```json
{
    "MerchantOrderId":"201904150001"
}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|**MerchantOrderId**|Texto|50|Sim|Número de identificação do pedido|

### Customer

Esse campo contém os dados do comprador. Possui diversos subcampos que devem ser analisados cuidadosamente.

```json
{
    "Customer":{
        "Name": "João da Silva Accept",
        "Identity":"12345678900",
        "IdentityType":"CPF"
    }
}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`Customer`|-|-|Sim|Dados do comprador|
|`Customer.Name`|Texto|61|Sim|Nome do comprador (No ambiente de Sandbox, o último nome do comprador deverá ser **ACCEPT**. Ex.: "João da Silva Accept")|
|`Customer.Identity`|Texto|18|Sim|Número de documento do comprador|
|`Customer.IdentityType`|Texto|4|Sim|Tipo de documento de identificação do comprador. Ex.: `CPF` ou `CNPJ`|

### Payment

Esse campo possui os elementos da transação, assim como o antifraude (**Payment.FraudAnalysis**), que será explicado separadamente.

Aqui é possível especificar se uma transação será efetuada como crédito ou débito, se utilizará um token de cartão, o número de parcelas e etc.

```json
{
    "Payment":{
        "Provider": "Simulado",
        "Type":"CreditCard",
        "Amount":10000,
        "Capture": true,
        "DoSplit": true,
        "Installments":1,
        "SoftDescriptor":"LojaDoJoao",
        "CreditCard":{
            "CardNumber":"4481530710186111",
            "Holder":"Yamilet Taylor",
            "ExpirationDate":"12/2022",
            "SecurityCode":"693",
            "Brand":"Visa"
        }
    }

}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`Payment`|-|-|Sim|Campos refente ao pagamento e antifraude|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `CreditCard` ou `DebitCard`|
|`Payment.Amount`|Inteiro|15|Sim|Valor do pedido em centavos. Ex.: R$ 1.559,85 = 155985|
|`Payment.Capture`|Boleano|-|Sim|Parâmetro para capturar a transação. Caso o valor seja `False` a transação será apenas autorizada. Se for `True`, a captura será realizada automaticamente após a autorização.|
|`Payment.DoSplit`|Booleano|-|Não (Default false)|Booleano que indica se a transação será dividida entre várias contas (true) ou não (false)|
|`Payment.Installments`|Inteiro|2|Sim|Número de parcelas do pedido|
|`Payment.SoftDescriptor`|Texto|13|Sim|Texto que será impresso na fatura do cartão de crédito do portador|
|`Payment.CreditCard`|-|-|Sim|Nó contendo as informações do cartão|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão do comprador|
|`Payment.CreditCard.Holder`|Texto|50|Sim|Nome do comprador impresso no cartão|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão composta por MM/AAAA|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`Payment.CreditCard.Brand`|Texto|10|Sim|Bandeira do cartão  |Possíveis valores: Visa / Master / Amex / Elo / Aura / JCB / Diners / Discover|

### Payment.FraudAnalysis

Esse campo é referente ao sistema de antifraude. 
O antifraude é obrigatório no Split de Pagamentos. E para esse sistema utilizamos o nosso parceiro [CyberSource](https://www.cybersource.com/) do Grupo [Visa](https://www.visa.com.br/).
A fim de exemplificar uma transação da forma mais simples possível, alguns campos obrigatórios para o ambiente de produção não foram passados.

Mais a frente explicaremos como utilizar o campo **Browser** e **MerchantDefinedFields**.

```json
{
    "Payment":{
        "FraudAnalysis":{
            "Provider":"Cybersource",
            "TotalOrderAmount":10000
        }
    }
}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`Payment.FraudAnalysis`|-|-|-|Nó contendo as informações para Análise de Fraude|
|`Payment.FraudAnalysis.Provider`|Texto|12|Sim|Identifica o provedor da solução de análise de fraude  |Possíveis valores: `Cybersource`|
|`Payment.FraudAnalysis.TotalOrderAmount`|Inteiro|15|Não|Valor total do pedido em centavos, podendo ser diferente do valor da transação  |Ex.: Valor do pedido sem a taxa de entrega|

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

--body
{
    "MerchantOrderId":"201904150001",
    "Customer":{
        "Name": "João da Silva Accept",
        "Identity":"12345678900",
        "IdentityType":"CPF"
    },
    "Payment":{
        "Provider": "Simulado",
        "Type":"CreditCard",
        "DoSplit": true,
        "Amount":10000,
        "Capture": true,
        "Installments":1,
        "SoftDescriptor":"LojaDoJoao",
        "CreditCard":{
            "CardNumber":"4481530710186111",
            "Holder":"Yamilet Taylor",
            "ExpirationDate":"12/2022",
            "SecurityCode":"693",
            "Brand":"Visa"
        },
        "SplitPayments":[
            {
                "SubordinateMerchantId" :"f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount":10000,
                "Fares":{
                    "Mdr":5,
                    "Fee":0
                    }
            }
            ],
        "FraudAnalysis":{
            "Provider":"Cybersource",
            "TotalOrderAmount":10000
        }
    }
}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`SplitPayments.SubordinateMerchantId`|Guid|36|Sim|Identificador do Seller na Braspag|
|`SplitPayments.Amount`|Número|15|Sim|Total da venda do Seller específico. R$ 100,00 = 10000|
|`SplitPayments.Fares.Mdr`|Decimal|3,2|Não|Taxa aplicada pela loja Master sobre o Seller para desconto|
|`SplitPayments.Fares.Fee`|Número|15|Não|Tarifa aplicada pela loja Master sobre o Seller para desconto|

**Response**

```json
{
    "MerchantOrderId": "201904150001",
    "Customer": {
        "Name": "João da Silva Accept",
        "Identity": "12345678900",
        "IdentityType": "CPF"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2022",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190829030409594",
        "AcquirerTransactionId": "0829030409594",
        "AuthorizationCode": "046879",
        "SoftDescriptor": "LojaDoJoao",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "Id": "b7211f65-87ca-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H",
                "Score": 38,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-HIST",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME",
                "CasePriority": 3,
                "ProviderTransactionId": "5671018489636116404007"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount": 10000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 0
                },
                "Splits": [
                    {
                        "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                        "Amount": 9500
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 500
                    }
                ]
            }
        ],
        "PaymentId": "536b8e54-6d44-4b84-86e2-0d7d01cf4935",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-29 15:04:02",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-29 15:04:09",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/536b8e54-6d44-4b84-86e2-0d7d01cf4935"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/536b8e54-6d44-4b84-86e2-0d7d01cf4935/void"
            }
        ]
    }
}
```

**Esse é apenas um request de exemplo bem básico e não deve ser utilizado em produção. Para facilitar o entendimento, não foi aplicado nenhum campo que fortalece a segurança da transação.**

Nos próximos exemplos explicaremos como aumentar a segurança e manipular os campos da nossa transação entre crédito e débito.

## Integração

### Autorização  

Para submeter uma transação do Pagador ao Split, basta enviar o Parâmetro Payment.DoSplit como true e adicionar o nó Payment.SplitPayments, conforme exemplo:

**Request - Transação de Crédito**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
    "merchantorderid": "23082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
        "payment": {
            "Provider": "Simulado",
            "type": "Creditcard",
            "DoSplit": "True",
            "amount": 10000,
            "capture": true,
            "installments": 1,
            "softdescriptor": "teste",
            "CreditCard": {
                "cardNumber": "4481530710186111",
                "holder": "Yamilet Taylor",
                "ExpirationDate": "12/2019",
                "SecurityCode": "693",
                "Brand": "Visa",
                "SaveCard": "false"
            },
            "fraudanalysis": {
                "provider": "cybersource",
                "Shipping": {
                    "Addressee": "Teste Accept"
                },
                "FingerPrintId": "23082019",
                "browser": {
                    "ipaddress": "179.221.103.151"
                },
                "totalorderamount": 10000,
                "cart": {
                    "isgift": false,
                    "returnsaccepted": true,
                    "items": [
                        {
                            "name": "Produto teste",
                            "quantity": 1,
                            "sku": 563,
                            "unitprice": 100
                        }
                    ]
                },
                "MerchantDefinedFields": [
                    {
                        "Id": 1,
                        "Value": "Guest"
                    },
                    {
                        "Id": 2,
                        "Value": "146"
                    },
                    {
                        "Id": 3,
                        "Value": "1"
                    },
                    {
                        "Id": 4,
                        "Value": "Web"
                    }
                ]
            },
            "splitpayments": [
                {
                    "subordinatemerchantid": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                    "amount": 5000,
                    "fares": {
                        "mdr": 20,
                        "fee": 25
                    }
                },
                {
                    "subordinatemerchantid": "9140ca78-3955-44a5-bd44-793370afef94",
                    "amount": 5000,
                    "fares": {
                        "mdr": 10,
                        "fee": 15
                    }
                }
            ]
        }
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "23082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190829042727956",
        "AcquirerTransactionId": "0829042727956",
        "AuthorizationCode": "164843",
        "SoftDescriptor": "teste",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "23082019",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "1",
                    "Value": "Guest"
                },
                {
                    "Id": "2",
                    "Value": "146"
                },
                {
                    "Id": "3",
                    "Value": "1"
                },
                {
                    "Id": "4",
                    "Value": "Web"
                }
            ],
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": "Undefined",
                        "Name": "Produto teste",
                        "Risk": "Undefined",
                        "Sku": "563",
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": "Undefined",
                        "NonSensicalHedge": "Undefined",
                        "ObscenitiesHedge": "Undefined",
                        "PhoneHedge": "Undefined",
                        "TimeHedge": "Undefined",
                        "VelocityHedge": "Undefined",
                        "GiftCategory": "Undefined",
                        "OriginalPrice": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151"
            },
            "Shipping": {
                "Addressee": "Teste Accept",
                "Method": "Undefined"
            },
            "Id": "8ec21c08-93ca-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H^P",
                "Score": 43,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST",
                "InternetInfoCode": "INTL-IPCO^RISK-EM",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME^VELL-FP^VELL-TIP^VELS-CC^VELS-EM",
                "CasePriority": 3,
                "FingerPrint": {
                    "CookiesEnabledField": "true",
                    "FlashEnabledField": "false",
                    "HashField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "ImagesEnabledField": "true",
                    "JavascriptEnabledField": "true",
                    "TrueIpAddressField": "200.142.125.158",
                    "TrueIpAddressCityField": "rio de janeiro",
                    "TrueIpAddressCountryField": "BR",
                    "SmartIdField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "SmartIdConfidenceLevelField": "100.00",
                    "ScreenResolutionField": "1920x1080",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5671068469196615904011"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 20.0,
                    "Fee": 25
                },
                "Splits": [
                    {
                        "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                        "Amount": 3975
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 1025
                    }
                ]
            },
            {
                "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 10.0,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                        "Amount": 4485
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 515
                    }
                ]
            }
        ],
        "PaymentId": "4437f73c-8c13-46ea-937f-494dc878109d",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-29 16:27:18",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-29 16:27:27",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/4437f73c-8c13-46ea-937f-494dc878109d"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/4437f73c-8c13-46ea-937f-494dc878109d/void"
            }
        ]
    }
}
```

Ao informar um tipo de pagamento referente ao Split, a API do Pagador automaticamente identifica que a transação é referente ao Split de Pagamentos e realiza o fluxo transacional através da Braspag (Facilitador).

Caso a transação enviada seja marcada para captura automática, o nó contendo as regras de divisão deverá ser enviado, caso contrário a transação será dividida entre a Braspag (Facilitador) e o Marketplace. Posteriormente é permitido que o Marketplace envie novas regras de divisão para a transação através da API Split, desde que esteja dentro do período de tempo permitido.

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido|
|`Customer.Email`|Texto|255|Não|Email do comprador|
|`Customer.Name`|Texto|255|Sim|Nome do comprador|
|`Customer.Identity`|Texto |14 |Não|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Mobile`|Texto|14|Não*|Celular do comprador|
|`Customer.Phone`|Texto|14|Não*|Telefone do comprador|
|`Customer.DeliveryAddress.Street`|Texto|255|Não*|Endereço do comprador|
|`Customer.DeliveryAddress.Number`|Texto|15|Não*|Número do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Complement`|Texto|50|Não*|Complemento do endereço de entrega do pedido|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não*|CEP do endereço de entrega do pedido|
|`Customer.DeliveryAddress.City`|Texto|50|Não*|Cidade do endereço de entrega do pedido|
|`Customer.DeliveryAddress.State`|Texto|2|Não*|Estado do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Country`|Texto|35|Não*|Pais do endereço de entrega do pedido|
|`Customer.DeliveryAddress.District`|Texto |50|Não*|Bairro do Comprador. |
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `CreditCard` ou `DebitCard`|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.Capture`|Booleano|---|Não (Default false)|Booleano que indica se a autorização deve ser com captura automática (true) ou não (false). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.SaveCard`|Booleano|---|Não (Default false)|Booleano que identifica se o cartão será salvo para gerar o token (CardToken)|

**Exemplo 1)**  

Transação no valor de **R$100,00**, com captura automática, sem o nó contendo as regras de divisão.

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.

**Request**

```json
{
    "merchantorderid": "30082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
    "payment": {
        "Provider": "Simulado",
        "type": "Creditcard",
        "DoSplit": "True",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "CreditCard": {
            "cardNumber": "4481530710186111",
            "holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "fraudanalysis": {
            "provider": "cybersource",
            "Shipping": {
                "Addressee": "Teste Accept"
            },
            "FingerPrintId": "30082019",
            "browser": {
                "ipaddress": "179.221.103.151"
            },
            "totalorderamount": 10000,
            "cart": {
                "isgift": false,
                "returnsaccepted": true,
                "items": [
                    {
                        "name": "Produto teste",
                        "quantity": 1,
                        "sku": 563,
                        "unitprice": 100
                    }
                ]
            },
            "MerchantDefinedFields": [
                {
                    "Id": 1,
                    "Value": "Guest"
                },
                {
                    "Id": 2,
                    "Value": "146"
                },
                {
                    "Id": 3,
                    "Value": "1"
                },
                {
                    "Id": 4,
                    "Value": "Web"
                }
            ]
        }
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "30082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190830104433081",
        "AcquirerTransactionId": "0830104433081",
        "AuthorizationCode": "042693",
        "SoftDescriptor": "teste",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "30082019",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "1",
                    "Value": "Guest"
                },
                {
                    "Id": "2",
                    "Value": "146"
                },
                {
                    "Id": "3",
                    "Value": "1"
                },
                {
                    "Id": "4",
                    "Value": "Web"
                }
            ],
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": "Undefined",
                        "Name": "Produto teste",
                        "Risk": "Undefined",
                        "Sku": "563",
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": "Undefined",
                        "NonSensicalHedge": "Undefined",
                        "ObscenitiesHedge": "Undefined",
                        "PhoneHedge": "Undefined",
                        "TimeHedge": "Undefined",
                        "VelocityHedge": "Undefined",
                        "GiftCategory": "Undefined",
                        "OriginalPrice": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151"
            },
            "Shipping": {
                "Addressee": "Teste Accept",
                "Method": "Undefined"
            },
            "Id": "b6f7f24a-2ccb-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H^P",
                "Score": 42,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST",
                "InternetInfoCode": "INTL-IPCO^RISK-EM",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME^VELL-FP^VELL-TIP",
                "CasePriority": 3,
                "FingerPrint": {
                    "CookiesEnabledField": "true",
                    "FlashEnabledField": "false",
                    "HashField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "ImagesEnabledField": "true",
                    "JavascriptEnabledField": "true",
                    "TrueIpAddressField": "200.142.125.158",
                    "TrueIpAddressCityField": "rio de janeiro",
                    "TrueIpAddressCountryField": "BR",
                    "SmartIdField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "SmartIdConfidenceLevelField": "100.00",
                    "ScreenResolutionField": "1920x1080",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5671726720836914704008"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                "Amount": 10000,
                "Fares": {
                    "Mdr": 2.00,
                    "Fee": 10
                },
                "Splits": [
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 10000
                    }
                ]
            }
        ],
        "PaymentId": "5b01552e-bf38-430e-bd38-8517c36a1ca2",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-30 10:44:13",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-30 10:44:33",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/5b01552e-bf38-430e-bd38-8517c36a1ca2"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/5b01552e-bf38-430e-bd38-8517c36a1ca2/void"
            }
        ]
    }
}
```

Neste caso, o Marketplace recebe o valor da transação descontado o MDR acordado com a Braspag (Facilitador). Como apresentado anteriormente, a Tarifa Fixa acordada entre o Marketplace e a Braspag é sensibilizada diretamente na agenda de ambas as partes.

![SplitSample002](https://developercielo.github.io/images/split/split002.png)

**Exemplo 2)**  

Transação no valor de **R$100,00** com o nó contendo as regras de divisão.

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.  
**Taxa Marketplace com o Subordinado 01**: 5% MDR (embutindo os 2% do MDR Braspag) + 0,30 Tarifa Fixa.  
**Taxa Marketplace com o Subordinado 02**: 4% MDR (embutindo os 2% do MDR Braspag) + 0,15 Tarifa Fixa.  

**Request**

```json
{
    "merchantorderid": "30082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
    "payment": {
        "Provider": "Simulado",
        "type": "Creditcard",
        "DoSplit": "True",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "CreditCard": {
            "cardNumber": "4481530710186111",
            "holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "fraudanalysis": {
            "provider": "cybersource",
            "Shipping": {
                "Addressee": "Teste Accept"
            },
            "FingerPrintId": "30082019",
            "browser": {
                "ipaddress": "179.221.103.151"
            },
            "totalorderamount": 10000,
            "cart": {
                "isgift": false,
                "returnsaccepted": true,
                "items": [
                    {
                        "name": "Produto teste",
                        "quantity": 1,
                        "sku": 563,
                        "unitprice": 100
                    }
                ]
            },
            "MerchantDefinedFields": [
                {
                    "Id": 1,
                    "Value": "Guest"
                },
                {
                    "Id": 2,
                    "Value": "146"
                },
                {
                    "Id": 3,
                    "Value": "1"
                },
                {
                    "Id": 4,
                    "Value": "Web"
                }
            ]
        },
        "splitpayments": [
            {
                "subordinatemerchantid": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "amount": 5000,
                "fares": {
                    "mdr": 5,
                    "fee": 30
                }
            },
            {
                "subordinatemerchantid": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "amount": 5000,
                "fares": {
                    "mdr": 4,
                    "fee": 15
                }
            }
        ]
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "30082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190830104950554",
        "AcquirerTransactionId": "0830104950554",
        "AuthorizationCode": "149867",
        "SoftDescriptor": "teste",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "30082019",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "1",
                    "Value": "Guest"
                },
                {
                    "Id": "2",
                    "Value": "146"
                },
                {
                    "Id": "3",
                    "Value": "1"
                },
                {
                    "Id": "4",
                    "Value": "Web"
                }
            ],
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": "Undefined",
                        "Name": "Produto teste",
                        "Risk": "Undefined",
                        "Sku": "563",
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": "Undefined",
                        "NonSensicalHedge": "Undefined",
                        "ObscenitiesHedge": "Undefined",
                        "PhoneHedge": "Undefined",
                        "TimeHedge": "Undefined",
                        "VelocityHedge": "Undefined",
                        "GiftCategory": "Undefined",
                        "OriginalPrice": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151"
            },
            "Shipping": {
                "Addressee": "Teste Accept",
                "Method": "Undefined"
            },
            "Id": "93324008-2dcb-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H^P",
                "Score": 49,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST",
                "InternetInfoCode": "INTL-IPCO^RISK-EM",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME^VELI-FP^VELI-TIP^VELL-FP^VELL-TIP^VELS-FP^VELS-TIP",
                "CasePriority": 3,
                "FingerPrint": {
                    "CookiesEnabledField": "true",
                    "FlashEnabledField": "false",
                    "HashField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "ImagesEnabledField": "true",
                    "JavascriptEnabledField": "true",
                    "TrueIpAddressField": "200.142.125.158",
                    "TrueIpAddressCityField": "rio de janeiro",
                    "TrueIpAddressCountryField": "BR",
                    "SmartIdField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "SmartIdConfidenceLevelField": "100.00",
                    "ScreenResolutionField": "1920x1080",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5671729896416618104007"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                        "Amount": 4720
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 280
                    }
                ]
            },
            {
                "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 4.0,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                        "Amount": 4785
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 215
                    }
                ]
            }
        ],
        "PaymentId": "f1333ea6-8cb9-420f-9674-d66031903080",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-30 10:49:40",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-30 10:49:50",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f1333ea6-8cb9-420f-9674-d66031903080"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/f1333ea6-8cb9-420f-9674-d66031903080/void"
            }
        ]
    }
}
```

Abaixo, como ficaram as divisões e como foram sensibilizadas as agendas de cada participante.

![SplitSample003](https://developercielo.github.io/images/split/split003.png)

**Request - Transação de Débito**

Uma transação com um Cartão de Débito se efetua de uma forma semelhante a um Cartão de Crédito, porém, é obrigatório submetê-la ao processo de autenticação do banco correspondente e o nó referente a análise de fraude não deve ser informado.

```json
{
    "merchantorderid": "30082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
    "payment": {
        "Provider": "Simulado",
        "type": "Debitcard",
        "DoSplit": "True",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "ReturnUrl": "https://www.UrlDeRetornoDoLojista.com.br/",
        "DebitCard": {
            "cardNumber": "4481530710186111",
            "holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "splitpayments": [
            {
                "subordinatemerchantid": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "amount": 5000,
                "fares": {
                    "mdr": 5,
                    "fee": 30
                }
            },
            {
                "subordinatemerchantid": "9140ca78-3955-44a5-bd44-793370afef94",
                "amount": 5000,
                "fares": {
                    "mdr": 4,
                    "fee": 15
                }
            }
        ]
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "30082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "DebitCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Authenticate": true,
        "ReturnUrl": "https://www.UrlDeRetornoDoLojista.com.br/",
        "AuthenticationUrl": "https://transactionsandbox.pagador.com.br/post/mpi/auth/5bb92d7c-4f3e-40dc-9f83-bd09c02fea38",
        "ProofOfSale": "439387",
        "AcquirerTransactionId": "0830110439387",
        "SoftDescriptor": "teste",
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                        "Amount": 4720
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 280
                    }
                ]
            },
            {
                "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 4.0,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                        "Amount": 4785
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 215
                    }
                ]
            }
        ],
        "PaymentId": "5bb92d7c-4f3e-40dc-9f83-bd09c02fea38",
        "Type": "DebitCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-30 11:04:33",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 9,
        "ReasonMessage": "Waiting",
        "Status": 0,
        "ProviderReturnCode": "1",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/5bb92d7c-4f3e-40dc-9f83-bd09c02fea38"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/5bb92d7c-4f3e-40dc-9f83-bd09c02fea38/void"
            }
        ]
    }
}
```

| Propriedade                             | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `AuthenticationUrl`   | URL para qual o Lojista deve redirecionar o Cliente para o fluxo de Débito.                                                      | Texto    | 56      | Sim         |
| `ReturnUrl`                  | Url de retorno do lojista. URL para onde o lojista vai ser redirecionado no final do fluxo.             | Texto | 1024       | Sim         |

### Modelos de Split

O Split de Pagamentos disponibiliza dois modelos para divisão da transação entre os participantes:

| Tipo                       | Descrição                                                                                          |
| **Split Transacional**     | O **Marketplace** envia na autorização (captura automática) ou no momento de captura as regras de divisão. |
| **Split Pós-Transacional** | O **Marketplace** envia as regras de divisão após a captura da transação. |

> No Split de Pagamentos a divisão é realizada somente para transações capturadas, ou seja, as regras de divisão só serão consideradas para autorizações com captura automática e no momento da captura de uma transação. Caso seja informado no momento de uma autorização sem captura automática, as regras de divisão serão desconsideradas.

#### Transacional

No Split Transacional é necessário que o Marketplace envie um "nó" adicional na integração da API do Pagador, como apresentado em exemplos anteriores, informando as regras de divisão da transação.

```json
"SplitPayments":[
    {
        "SubordinateMerchantId" :"5a1a61f0-1630-4873-bf69-a6ff9ae664e9",
        "Amount":10000,
        "Fares":{
            "Mdr":5,
            "Fee":0
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

Como resposta, A API retornará um nó contento as regras de divisão enviadas e os valores a serem recebidos pelo Marketplace e seus Subordinados:

```json
"SplitPayments": [
    {
        "SubordinateMerchantId": "5a1a61f0-1630-4873-bf69-a6ff9ae664e9",
        "Amount": 10000,
        "Fares": {
            "Mdr": 5,
            "Fee": 0
        },
        "Splits": [                
            {
                "MerchantId": "95506357-f4c7-475f-a6b8-cf4618b9d721",
                "Amount": 500,
            },
            {
                "MerchantId": "5a1a61f0-1630-4873-bf69-a6ff9ae664e9",
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

#### Pós-Transacional

Neste modelo o Marketplace poderá enviar as regras de divisão da transação após a mesma ser capturada.

Para transações com **Cartão de Crédito** este período é de **20 dias** e para as transações com **Cartão de Débito** este período é de **1 dia**, se o Marketplace possuir um regime padrão de pagamentos. Caso tenha um regime personalizado, o período deverá ser acordado entre as partes (Marketplace e Braspag (Facilitador)).

> O período para redividir uma transação poderá ser alterado pela Braspag (Facilitador).

**Autenticação**

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais.

Para obter um token de acesso:

1. Concatene o ClientId e ClientSecret: `ClientId:ClientSecret`.  
2. Codifique o resultado da concatenação em Base64.  
3. Realize uma requisição ao servidor de autorização:  

**Request**  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

```json
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

> O ClientSecret deve ser obtido junto à Braspag. <br>
> O token retornado (access_token) deverá ser utilizado em toda requisição à API Split como uma chave de autorização. O mesmo possui uma validade de 20 minutos e deverá ser obtido um novo token toda vez que o mesmo expirar.  

**Request**  

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{api-split}/api/transactions/{PaymentId}/split</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
        "Amount": 6000,
        "Fares": {
            "Mdr": 5,
            "Fee": 30
        }
    },
    {
        "SubordinateMerchantId" :"f1531485-adb3-4320-9b14-dbc07eea2b3e",
        "Amount":4000,
        "Fares":{
            "Mdr":4,
            "Fee":15
        }
    }
]
```

**Response**

```json
{
    "PaymentId": "c96bf94c-b213-44a7-9ea3-0ee2865dc57e",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
                    "Amount": 5670
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
            "Amount": 4000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
                    "Amount": 3825
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "Amount": 175
                }
            ]
        }
    ]
}
```

O nó referente ao Split no Split Pós-transacional, tanto no contrato de request quanto de response, é o mesmo retornado na divisão no Split Transacional, apresentado anteriormente.

> O Marketplace poderá informar as regras de divisão da transação mais de uma vez desde que esteja dentro do período de tempo permitido, que é de **20 dias** para **Cartão de Crédito** se estiver enquadrado no regime de pagamento padrão. 

### Captura

Ao capturar uma transação do Split de Pagamentos, deve-se informar as regras de divisão da transação. Caso as regras não sejam informadas, o Split interpretará que todo o valor é referente ao próprio Marketplace.

#### Captura Total

Na captura total de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total da transação enviado no momento da autorização.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture</span></aside>

```json
{
    "SplitPayments":[
        {
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            }
        },
        {
            "SubordinateMerchantId" :"f1531485-adb3-4320-9b14-dbc07eea2b3e",
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

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "6",
    "ReturnMessage": "Operation Successful",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
                    "Amount": 5670
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
            "Amount": 4000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
                    "Amount": 3825
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "Amount": 175
                }
            ]
        }
    ],
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/db14bf98-5ebd-43b5-8ba6-205c30ec1c16"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/db14bf98-5ebd-43b5-8ba6-205c30ec1c16/void"
        }
    ]
}
```

#### Captura Parcial

Na captura parcial de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total a ser capturado. Caso nenhuma divisão seja informada, o Split interpretará que todo o valor é referente ao próprio Marketplace.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture?amount={amount}</span></aside>

O exemplo abaixo captura parcialmente o valor de R$80,00 de uma transação realizada no valor de R$100,00.

```json
{
    "SplitPayments":[
        {
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "Amount": 5000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            }
        },
        {
            "SubordinateMerchantId" :"f1531485-adb3-4320-9b14-dbc07eea2b3e",
            "Amount":3000,
            "Fares":{
                "Mdr":4,
                "Fee":15
            }
        }
     ]
}
```

**Response**

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "6",
    "ReturnMessage": "Operation Successful",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "Amount": 5000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
                    "Amount": 4720
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "Amount": 280
                }
            ]
        },
        {
            "SubordinateMerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
            "Amount": 3000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
                    "Amount": 2865
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "Amount": 135
                }
            ]
        }
    ],
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/7bd7fc3a-4385-45cf-8a45-ec0349716b68"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/7bd7fc3a-4385-45cf-8a45-ec0349716b68/void"
        }
    ]
}
```

Como explicitado anteriormente, se realizada uma captura total ou parcial sem informar as regras de divisão, o Split interpreta que todo o valor é destinado ao próprio Marketplace.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture/capture?amount=8000</span></aside>

**Response**

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "6",
    "ReturnMessage": "Operation Successful",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
            "Amount": 8000,
            "Fares": {
                "Mdr": 2,
                "Fee": 0
            },
            "Splits": [
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "Amount": 8000
                }
            ]
        }
    ],
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/ee849761-d758-4f12-80bf-6ceae3a751ec"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/ee849761-d758-4f12-80bf-6ceae3a751ec/void"
        }
    ]
}
```

### Cancelamento

Ao cancelar uma transação do Split de Pagamentos o Marketplace deve informar, para um cancelamento parcial, qual o valor deve ser cancelado de cada participante da transação. Para um cancelamento total, esta informação não é necessária, já que será cancelado o valor total e consequentemente o valor total de cada Subordinado.

#### Cancelamento Total

No cancelamento total de uma transação, será cancelado o valor total da transação e consequentemente o valor total de cada Subordinado e as comissões de todos os participantes.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void</span></aside>

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
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "VoidedAmount": 4000,
            "VoidedSplits": [
                {
                    "MerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
                    "VoidedAmount": 3825
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "VoidedAmount": 175
                }
            ]
        },
        {
            "SubordinateMerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
            "VoidedAmount": 6000,
            "VoidedSplits": [
                {
                    "MerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
                    "VoidedAmount": 5670
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void?amount={amount}</span></aside>

No exempo abaixo é cancelado o valor de R$25,00 de uma transação capturada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void?amount=2500</span></aside>

```json
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "VoidedAmount": 1500
        },
        {
            "SubordinateMerchantId" :"f1531485-adb3-4320-9b14-dbc07eea2b3e",
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
            "SubordinateMerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
            "VoidedAmount": 1500,
            "VoidedSplits": [
                {
                    "MerchantId": "e5147542-0c0e-45d4-b6a8-a5a7167e6ae7",
                    "VoidedAmount": 1417
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
                    "VoidedAmount": 83
                }
            ]
        },
        {
            "SubordinateMerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
            "VoidedAmount": 1000,
            "VoidedSplits": [
                {
                    "MerchantId": "f1531485-adb3-4320-9b14-dbc07eea2b3e",
                    "VoidedAmount": 956
                },
                {
                    "MerchantId": "4b3f216c-69d7-44cf-a2d1-dbd1439429c3",
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
            "SubordinateMerchantId" :"f1531485-adb3-4320-9b14-dbc07eea2b3e",
            "VoidedAmount":1000
        }
     ]
}
```

> Ao cancelar parcialmente parte de um valor destinado a um Subordinado, é cancelada proporcionalmente também a Tarifa Fixa que o Marketplace tem a receber.

## Antifraude

O Split de Pagamentos possui uma plataforma de antifraude que utiliza inteligência artificial para minimizar os riscos de fraude e chargeback.

> No modelo de negócio do Split, todo chargeback é repassado ao Marketplace, que pode ou não repassá-lo para os seus subordinados. Portanto, é de suma importância que a plataforma de antifraude esteja corretamente integrada e configurada.

### Fluxo transacional

A integração com o antifraude se dá através do próprio fluxo transacional, na mesma requisição da transação.

-Cliente realiza uma transação.
-A anállise de fraude é realizada.
-Caso a análise de fraude recomende rejeitar a transação, o fluxo é interrompido.
-A transação é executada normalmente.

Para utilizar o sistema de antifraude, é necessário incluir o bloco `Payment.FraudAnalysis`. Em casos de uma compra remota ou com entrega, também deverão ser incluidos os blocos `Customer.DeliveryAddress` e/ou `Customer.BillingAddress`.

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`MerchantOrderId`|Texto|50|Sim|Número de identificação do pedido no sistema do lojista|
|`Customer`|-|-|Sim|Dados do comprador|
|`Customer.Name`|Texto|61|Sim|Nome do comprador|
|`Customer.Identity`|Texto|18|Sim|Número de documento do comprador|
|`Customer.IdentityType`|Texto|4|Sim|Tipo de documento de identificação do comprador. Ex.: `CPF` ou `CNPJ`|
|`Customer.Email`|Texto|60|Não|E-mail do comprador|
|`Customer.Phone`|Texto|15|Não|Telefone do comprador. Ex.: `552121114700`|
|`Customer.Mobile`|Texto|15|Não|Telefone celular do comprador. Ex.: `5521987654321`|
|`Customer.DeliveryAddress`| - | - |Não|Enviado quando a transação é referente a algum produto com entrega|
|`Customer.DeliveryAddress.Street`|Texto|24|Não|Endereço de entrega do comprador.|
|`Customer.DeliveryAddress.Number`|Texto|5|Não|Número do endereço de entrega do comprador|
|`Customer.DeliveryAddress.Complement`|Texto|14|Não|Complemento do endereço de entrega do comprador|
|`Customer.DeliveryAddress.District`|Texto|15|Não|Distrito ou Bairro do endereço de entrega do comprador|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não|CEP do endereço de entrega do comprador|
|`Customer.DeliveryAddress.City`|Texto|20|Não|Cidade do endereço de entrega do comprador|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega do comprador|
|`Customer.DeliveryAddress.Country`|Texto|2|Não|País do endereço de entrega do comprador|
|`Customer.BillingAddress`|-|-|Não|-|
|`Customer.BillingAddress.Street`|Texto|24|Sim|Endereço de cobrança do comprador|
|`Customer.BillingAddress.Number`|Texto|5|Sim|Número do endereço de cobrança do comprador|
|`Customer.BillingAddress.Complement`|Texto|14|Não|Complemento do endereço de cobrança do comprador|
|`Customer.BillingAddress.District`|Texto|15|Sim|Distrito ou Bairro do endereço de cobrança do comprador|
|`Customer.BillingAddress.ZipCode`|Texto|9|Sim|CEP do endereço de cobrança do comprador|
|`Customer.BillingAddress.City`|Texto|20|Sim|Cidade do endereço de cobrança do comprador|
|`Customer.BillingAddress.State`|Texto|2|Sim|Estado do endereço de cobrança do comprador|
|`Customer.BillingAddress.Country`|Texto|2|Sim|País do endereço de cobrança do comprador|
|`Payment`|-|-|Sim|Campos refente ao pagamento e antifraude|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `CreditCard` ou `DebitCard`|
|`Payment.Amount`|Inteiro|15|Sim|Valor do pedido em centavos. Ex.: r$ 1.559,85 = 155985|
|`Payment.Capture`|Boleano|-|Sim|Parâmetro para capturar a transação. Caso o valor seja `False` a transação será apenas autorizada. Se for `True`, a captura será realizada automaticamente após a autorização.|
|`Payment.ServiceTaxAmount`|Inteiro|15|Não|Exclusivo para companhias aéreas - Montante do valor da autorização que deve ser destinado à taxa de serviço  |Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Installments`|Inteiro|2|Sim|Número de parcelas do pedido|
|`Payment.SoftDescriptor`|Texto|13|Sim|Texto que será impresso na fatura do cartão de crédito do portador|
|`Payment.CreditCard`|-|-|Sim|Nó contendo as informações do cartão|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão do comprador|
|`Payment.CreditCard.Holder`|Texto|50|Sim|Nome do comprador impresso no cartão|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão composta por MM/AAAA|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`Payment.CreditCard.Brand`|Texto|10|Sim|Bandeira do cartão  |Possíveis valores: Visa / Master / Amex / Elo / Aura / JCB / Diners / Discover|
|`Payment.SaveCard`|Boleano|-|Não|Parâmetro para salvar os dados do cartão como token. Caso seja passado com o valor `True`, O parâmetro `CardToken` será retornado no `Response` sendo seu valor o token gerado que poderá ser utilizado em futuras transações.|
|`Payment.FraudAnalysis`|-|-|-|Nó contendo as informações para Análise de Fraude|
|`Payment.FraudAnalysis.Provider`|Texto|12|Sim|Identifica o provedor da solução de análise de fraude  |Possíveis valores: `Cybersource`|
|`Payment.FraudAnalysis.TotalOrderAmount`|Inteiro|15|Não|Valor total do pedido em centavos, podendo ser diferente do valor da transação  |Ex.: Valor do pedido sem a taxa de entrega|
|`Payment.FraudAnalysis.FingerPrintId`|Texto|6010|Sim|Impressão digital de dispositivos e geolocalização real do IP do comprador [Configuração do Fingerprint](https://braspag.github.io//manual/antifraude#cybersource)|
|`Payment.FraudAnalisys.Browser`|-|-|Sim|-|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|255|Sim|Ip do comprador|
|`Payment.FraudAnalysis.Cart`|Lista|-|Não|Nó contendo as informações do carrinho de compras para análise de fraude|
|`Payment.FraudAnalysis.Cart.Items[].Name`|Texto|50|Não|Nome do produto|
|`Payment.FraudAnalysis.Cart.Items[].Sku`|Texto|12|Não|Sku do produto|
|`Payment.FraudAnalysis.Cart.Items[].UnitPrice`|Inteiro|15|Não|Preço original do produto em centavos  |Ex.: R$ 1.559,85 = 155985|
|`Payment.FraudAnalysis.Cart.Items[].Quantity`|Inteiro|-|Não|Quantidade do produto|
|`Payment.FraudAnalysis.MerchantDefinedFields`|Lista|-|Sim|Nó contendo dados |adicionais para análise de fraude [Tabela de Merchant Defined Data](https://braspag.github.io//manual/antifraude#tabela-31-merchantdefineddata-(cybersource))|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Id`|Inteiro|-|Sim|Identificador de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Value`|Texto|255|Sim|Valor de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.Shipping`|-|-|Não|Nó contendo informações adicionais da entrega do pedido para análise de fraude|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|61|Não|Nome e sobrenome do destinatário|

## Agenda Financeira

No Split de Pagamentos, o responsável por realizar o repasse dos valores (liquidação) a cada um dos participantes de uma venda é a Braspag (Facilitador).

A Braspag irá gerar uma agenda financeira que poderá ser consultada a qualquer momento pelo Marketplace e/ou Subordinados.

A agenda é composta por eventos de Crédito e Débito que são gerados de acordo com as operações efetuadas e o regime de pagamento acordado.

Eventos de Crédito:

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

Eventos de Débito:

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

### Consultar Eventos

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

**Por Data Prevista de Pagamento**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialForecastedDate=2017-12-01&finalForecastedDate=2018-12-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

**Por Data de Pagamento**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialPaymentDate=2018-08-22&finalPaymentDate=2018-08-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

```json
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

### Consultar Transações

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

```json
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

```json
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

### Ajustes

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
| `merchantIdToDebit`               | Merchant do qual o valor será debitado.                                                                 | Guid    | 36      | Sim         |
| `merchantIdToCredit`              | Merchant para o qual o valor será creditado.                                                            | Inteiro | -       | Sim         |
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

## Chargeback

No Split de Pagamentos o Marketplace pode definir se assumirá o chargeback ou o repassará para seus Subordinados, desde que acordado previamente entre as partes.

Se o Marketplace optar por repassar para os Subordinados, o Chargeback Total é sensibilizado automaticamente na agenda dos mesmos. Caso contrário o chargeback será sensibilizado automaticamente na agenda do Marketplace, como acontece com um Charback Parcial.

O Marketplace pode decidir ainda repassar o Chargeback para seus subordinados. Para isso A API Split disponibiliza um serviço onde o Marketplace pode informar como dividir o valor do chargeback entre os subordinados, caso seja um Chargeback Parcial.  

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

## Liquidação

A plataforma permite que o Master bloqueie temporariamente a liquidação para um Subordinado para garantia da entrega do produto/serviço, funcionalidade conhecida como Escrow.

### Trava

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
