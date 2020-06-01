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

> Solicite suas credenciais para o ambiente de teste em nosso portal de suporte https://suporte.braspag.com.br ou pelo telefone 4003-3058

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

### Sandbox

* **API Transacional Pagador**: https://apisandbox.braspag.com.br/
* **API para Serviços de Consultas Pagador**: https://apiquerysandbox.braspag.com.br/
* **API Split**: https://splitsandbox.braspag.com.br/
* **Braspag OAUTH2 Server**: https://authsandbox.braspag.com.br/

### Produção

* **API Transacional Pagador**: https://api.braspag.com.br/
* **API para Serviços de Consultas Pagador**: https://apiquery.braspag.com.br/
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

É possível verificar se uma transação possui risco de ser uma fraude ou não durante uma autorização.

|Tipo de Integração|Descrição|Parâmetros necessários|
|-|-|-|
|Análise antes da autorização|Antes da transação ser enviada para a autorização, o AntiFraude avalia se ela tem alto risco ou não. Dessa forma, evita-se o envio de transações arriscadas para autorização|`FraudAnalysis.Sequence` igual a _AnalyseFirst_|
|Análise após a autorização|Antes da transação ser enviada para o AntiFraude, a mesma será enviada para a autorização|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_|
|Análise de risco somente se a transação for autorizada|O AntiFraude será acionado apenas para analisar transações com o staus _autorizada_. Dessa forma evita-se o custo com análises de transações que não seriam autorizadas|`FraudAnalysis.SequenceCriteria` igual a _OnSuccess_|
|Autorização com captura automática após a análise de risco|O AntiFraude será acionado para realizar a análise de risco e se o status for aceito a autorização com captura automática poderá ser realizada|`FraudAnalysis.Sequence` igual a _AnalyseFirst_, `FraudAnalysis.SequenceCriteria` igual a _OnSuccess_ e `Payment.Capture` igual a _true_|
|Capturar apenas se uma transação for segura|Após a análise de fraude, captura automaticamente uma transação já autorizada se definido baixo risco. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Braspag receber a notificação do novo status e for igual a aceita, a transação será capturada automaticamente|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_, `FraudAnalysis.CaptureOnLowRisk` igual a _true_ e `Payment.Capture` igual a _false_| |
|Cancelar uma transação comprometida|Caso a análise de fraude retorne um alto risco para uma transação já autorizada ou capturada, ela será imediamente cancelada ou estornada. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Braspag receber a notificação do novo status e for igual a rejeitada, a transação será cancelada ou estornada automaticamente|`FraudAnalysis.Sequence` como _AuthorizeFirst_ e `FraudAnalysis.VoidOnHighRisk` igual a _true_|

Se não for especificado o contrário durante a autorização, o Split processará sua transação pelo fluxo `FraudAnalysis.Sequence` _AnalyseFirst_, `FraudAnalysis.SequenceCriteria` _OnSuccess_, `FraudAnalysis.VoidOnHighRisk` _false_ e `FraudAnalysis.CaptureOnLowRisk` _false_.

Para utilizar o sistema de antifraude, é necessário incluir o bloco `Payment.FraudAnalysis`. Em casos de uma compra remota ou com entrega, também deverão ser incluidos os blocos `Customer.DeliveryAddress` e/ou `Customer.BillingAddress`.

Para que a análise de fraude via Cybersource seja efetuada durante uma transação de cartão de crédito, é necessário complementar o contrato de autorização com os nós "FraudAnalysis", "Cart", "MerchantDefinedFields" e "Travel (somente para venda de passagens aéreas)".

#### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "DoSplit":true,
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ],
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"Cybersource",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":false,
            "Email":"comprador@braspag.com.br",
            "HostName":"Teste",
            "IpAddress":"127.0.0.1",
            "Type":"Chrome"
         },
         "Cart":{  
            "IsGift":false,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":2,
               "Value":"100"
            },
            {  
               "Id":4,
               "Value":"Web"
            },
            {  
               "Id":9,
               "Value":"SIM"
            }
         ],
         "Shipping":{  
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{  
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[  
               {  
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
         }
      }
   }
}

```

|Campo|Tipo|Tamanho|Obrigatório|Descrição|
|:-|:-|:-|:-|:-|
|`MerchantOrderId`|Texto|50|Sim|Número do pedido da loja|
|`Customer.Name`|Texto|120|Sim|Nome completo do comprador|
|`Customer.Identity`|Texto|16|Sim|Número do documento de identificação do comprador|
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador <br/> Possíveis valores: CPF ou CNPJ|
|`Customer.Email`|Texto|100|Sim|E-mail do comprador|
|`Customer.Birthdate`|Date|10|Sim|Data de nascimento do comprador <br/> Ex.: 1991-01-10|
|`Customer.Phone`|Texto|15|Sim|Número do telefone do comprador <br/> Ex.: 5521976781114|
|`Customer.Address.Street`|Texto|54|Sim|Logradouro do endereço de cobrança|
|`Customer.Address.Number`|Texto|5|Sim|Número do endereço de cobrança|
|`Customer.Address.Complement`|Texto|14|Não|Complemento do endereço de cobrança|
|`Customer.Address.ZipCode`|Texto|9|Sim|Código postal do endereço de cobrança|
|`Customer.Address.City`|Texto|50|Sim|Cidade do endereço de cobrança|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço de cobrança|
|`Customer.Address.Country`|Texto|2|Sim|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Customer.Address.District`|Texto|45|Sim|Bairro do endereço de cobrança|
|`Customer.DeliveryAddress.Street`|Texto|54|Não|Logradouro do endereço de entrega|
|`Customer.DeliveryAddress.Number`|Texto|5|Não|Número do endereço de entrega|
|`Customer.DeliveryAddress.Complement`|Texto|14|Não|Complemento do endereço de entrega|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não|Código postal do endereço de entrega|
|`Customer.DeliveryAddress.City`|Texto|50|Não|Cidade do endereço de entrega|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega|
|`Customer.DeliveryAddress.Country`|Texto|2|Não|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Customer.DeliveryAddress.District`|Texto|45|Não|Bairro do endereço de entrega|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora da autorização|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. <br/> Obs.: Somente o tipo _CreditCard_ funciona com análise de fraude|
|`Payment.Amount`|Número|15|Sim|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|
|`Payment.ServiceTaxAmount`|Número|15|Não|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço <br/> Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Currency`|Texto|3|Não|Moeda na qual o pagamento será feito <br/> Possíveis valores: BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|Texto|3|Não|País na qual o pagamento será realizado|
|`Payment.Installments`|Número|2|Sim|Número de parcelas|
|`Payment.Interest`|Texto|10|Não|Tipo de parcelamento <br/> Possíveis valores: ByMerchant / ByIssuer|
|`Payment.Capture`|Booleano|---|Não|Indica se a autorização deverá ser com captura automática <br/> Possíveis valores: true / false (default) <br/> Obs.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade <br/> Obs2.: Este campo deverá ser preenchido de acordo com o fluxo da análise de fraude|
|`Payment.Authenticate`|Booleano|---|Não|Indica se a transação deve ser autenticada <br/> Possíveis valores: true / false (default) <br/> Obs.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.Recurrent`|Booleano|---|Não|Indica se a transação é do tipo recorrente <br/> Possíveis valores: true / false (default) <br/> Obs.: Este campo igual a _true_ não irá criar uma recorrência, apenas permitirá a realização de uma transação sem a necessidade de envio do CVV e servindo de indicação para a adquirente que é a cobrança de uma transação de uma recorrência <br/> Obs2.: Somente para transações Cielo <br/> Obs3.: O campo `Payment.Authenticate` deve ser igual a _false_ quando este for igual a _true_|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador <br/> Obs.: O valor deste campo tem que ser claro e fácil de identificar pelo portador o estabelecimento onde foi realizada a compra, pois é um dos principais ofensores para chargeback|
|`Payment.DoSplit`|Booleano|---|Não|Indica se a transação será dividida entre vários participantes <br/> Possíveis valores: true / false (default)|
|`Payment.ExtraDataCollection.Name`|Texto|50|Não|Identificador do campo extra que será enviado|
|`Payment.ExtraDataCollection.Value`|Texto|1024|Não|Valor do campo extra que será enviado|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão de crédito|
|`Payment.CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão de crédito|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão de crédito|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança no verso do cartão de crédito|
|`Payment.CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão de crédito|
|`Payment.CreditCard.SaveCard`|Booleano|---|Não|Indica se os dados do cartão de crédito serão armazenados no Cartão Protegido|
|`Payment.CreditCard.Alias`|Texto|64|Não|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|
|`Payment.FraudAnalysis.Sequence`|Texto|14|Sim|Tipo de fluxo da análise de fraude <br/> Possíveis valores: AnalyseFirst / AuthorizeFirst|
|`Payment.FraudAnalysis.SequenceCriteria`|Texto|9|Sim|Critério do fluxo da análise de fraude <br/> Possíveis valores: OnSuccess|
|`Payment.FraudAnalysis.Provider`|Texto|10|Sim|Provedor de AntiFraude <br/> Possíveis valores: Cybersource|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será capturada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de baixo risco (Accept) a transação anteriormente autorizada será capturada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será capturada após a Braspag receber a notificação da alteração de status e esta for baixo risco (Accept) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será cancelada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de alto risco (Reject) a transação anteriormente autorizada será cancelada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será cancelada após a Braspag receber a notificação da alteração de status e esta for alto risco (Reject) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.TotalOrderAmount`|Número|15|Sim|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|
|`Payment.FraudAnalysis.FingerPrintId`|Texto|100|Sim|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas|
|`Payment.FraudAnalysis.Browser.HostName`|Texto|60|Não|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Booleano|---|Sim|Identifica se o browser do comprador aceita cookies <br/> Possíveis valores: true / false (default)|
|`Payment.FraudAnalysis.Browser.Email`|Texto|100|Não|E-mail registrado no browser do comprador. Pode diferenciar do e-mail de cadastro na loja(`Customer.Email`)|
|`Payment.FraudAnalysis.Browser.Type`|Texto|40|Não|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP <br/> Ex.: Google Chrome, Mozilla Firefox, Safari, etc|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|45|Sim|Endereço de IP do comprador. Formato IPv4 ou IPv6|
|`Payment.FraudAnalysis.Cart.IsGift`|Booleano|---|Não|Indica se o pedido realizado pelo comprador é para presente|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Booleano|---|Não|Indica se o pedido realizado pelo comprador pode ser devolvido a loja <br/> Possíveis valores: true / false (default)|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Texto|9|Não|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países <br/> [Tabela 1 - Payment.Fraudanalysis.Cart.Items{n}.GiftCategory]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-1-payment.fraudanalysis.cart.tems[n].giftcategory)|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Texto|6|Não|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude <br/> [Tabela 2 - Payment.Fraudanalysis.Cart.Items{n}.HostHedge]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-2-payment.fraudanalysis.cart.items[n].hosthedge)|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Texto|6|Não|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude <br/> [Tabela 3 - Cart.Items{n}.NonSensicalHedge]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-3-payment.fraudanalysis.cart.items[n].nonsensicalhedge)|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Texto|6|Não|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude <br/> [Tabela 4 - Payment.Fraudanalysis.Cart.Items{n}.ObscenitiesHedge]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-4-payment.fraudanalysis.cart.items[n].obscenitieshedge)|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Texto|6|Não|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude <br/> [Tabela 5 - Payment.Fraudanalysis.Cart.Items{n}.PhoneHedge]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-5-payment.fraudanalysis.cart.items[n].phonehedge)|
|`Payment.FraudAnalysis.Cart.Items.Name`|Texto|255|Sim|Nome do Produto|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Número|15|Sim|Quantidade do produto|
|`Payment.FraudAnalysis.Cart.Items.Sku`|Texto|255|Sim|SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Número|15|Sim|Preço unitário do produto <br/> Ex: 10950 = r$ 109,50|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Texto|6|Não|Nível de risco do produto associado a quantidade de chargebacks <br/> [Tabela 6 - Payment.Fraudanalysis.CartI.tems{n}.Risk]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-6-payment.fraudanalysis.cart.items[n].risk)|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Texto|6|Não|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido <br/> [Tabela 7 - Payment.Fraudanalysis.Cart.Items{n}.TimeHedge]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-7-payment.fraudanalysis.cart.items[n].timehedge)|
|`Payment.FraudAnalysis.Cart.Items.Type`|Texto|19|Não|Categoria do produto <br/> [Tabela 8 - Payment.Fraudanalysis.Cart.Items{n}.Type]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-8-payment.fraudanalysis.cart.items[n].type)|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Texto|6|Não|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores <br/> [Tabela 9 - Payment.Fraudanalysis.Cart.Items{n}.VelocityHedge]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-9-payment.fraudanalysis.cart.items[n].velocityhedge)|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Número|2|Sim|ID das informações adicionais a serem enviadas <br/> [Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-20-payment.fraudanalysis.merchantdefinedfields)|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Texto|255|Sim|Valor das informações adicionais a serem enviadas <br/> [Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-20-payment.fraudanalysis.merchantdefinedfields)|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|120|Não|Nome completo do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Shipping.Method`|Texto|8|Não|Meio de entrega do pedido <br/> [Tabela 10 - Payment.Fraudanalysis.Shipping.Method]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-10-payment.fraudanalysis.shipping.method)|
|`Payment.FraudAnalysis.Shipping.Phone`|Texto|15|Não|Número do telefone do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114700|
|`Payment.FraudAnalysis.Travel.JourneyType`|Texto|32|Não|Tipo de viagem <br/> [Tabela 11 - Payment.FraudAnalysis.Travel.JourneyType]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-11-payment.fraudanalysis.travel.journeytype)|
|`Payment.FraudAnalysis.Travel.DepartureTime`|DateTime|---|Não|Data e hora de partida <br/> Ex.: 2018-03-31 19:16:38|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Texto|120|Não|Nome completo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Texto|32|Não|Número do documento do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Texto|15|Não|Classificação da empresa aérea <br/> [Tabela 12 - Payment.FraudAnalysis.Travel.Passengers{n}.Status]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-12-payment.fraudanalysis.travel.passengers[n].status)|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Texto|13|Não|Tipo do passageiro <br/> [Tabela 13 - Payment.FraudAnalysis.Travel.Passengers{n}.PassengerType]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-13-payment.fraudanalysis.travel.passengers[n].rating)|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Texto|255|Não|E-mail do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Texto|15|Não|Telefone do passageiro <br/> Ex.: 552121114700|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Texto|3|Não|Código do aeroporto de partida. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Texto|3|Não|Código do aeroporto de chegada. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|

> Os campos do nó `FraudAnalysis.Travel` se tornam obrigatórios caso o segmento do seu negócio seja aéreas.

#### Response

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114"
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "DoSplit":true,
      "CreditCard":{  
         "CardNumber":"455187******0181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ],
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"Cybersource",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":false,
            "Email":"comprador@braspag.com.br",
            "HostName":"Teste",
            "IpAddress":"127.0.0.1",
            "Type":"Chrome"
         },
         "Cart":{  
            "IsGift":false,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":2,
               "Value":"100"
            },
            {  
               "Id":4,
               "Value":"Web"
            },
            {  
               "Id":9,
               "Value":"SIM"
            }
         ],
         "Shipping":{  
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
         },
         "Travel":{  
            "JourneyType":"OneWayTrip",
            "DepartureTime":"2018-01-09 18:00",
            "Passengers":[  
               {  
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"5564991681074",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
        },
        "Id":"0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
        "Status":1,
        "FraudAnalysisReasonCode":100,
        "ReplyData":{  
            "AddressInfoCode":"COR-BA^MM-BIN",
            "FactorCode":"B^D^R^Z",
            "Score":42,
            "BinCountry":"us",
            "CardIssuer":"FIA CARD SERVICES, N.A.",
            "CardScheme":"VisaCredit",
            "HostSeverity":1,
            "InternetInfoCode":"FREE-EM^RISK-EM",
            "IpRoutingMethod":"Undefined",
            "ScoreModelUsed":"default_lac",
            "CasePriority":3,
            "ProviderTransactionId":"5220688414326697303008"
         }
      },
      "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
      "ProofOfSale": "20170510053219433",
      "AcquirerTransactionId": "0510053219433",
      "AuthorizationCode": "936403",
      "ReceivedDate": "2017-05-10 17:32:19",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 17:32:19",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "Status": 2,
      "ProviderReturnCode": "6",
      "ProviderReturnMessage": "Operation Successful",
      "Links": [{
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"
      }]
   }
}
```

|Propriedade|Tipo|Descrição|
|:-|:-|:-|
|`MerchantOrderId`|Texto|Número do pedido da loja|
|`Customer.Name`|Texto|Nome completo do comprador|
|`Customer.Identity`|Texto|Número do documento de identificação do comprador|
|`Customer.IdentityType`|Texto|Tipo de documento de identificação do comprador|
|`Customer.Email`|Texto|E-mail do comprador|
|`Customer.Birthdate`|Date|Data de nascimento do comprador|
|`Customer.Phone`|Texto|Número do telefone do comprador|
|`Customer.Address.Street`|Texto|Logradouro do endereço de cobrança|
|`Customer.Address.Number`|Texto|Número do endereço de cobrança|
|`Customer.Address.Complement`|Texto|Complemento do endereço de cobrança|
|`Customer.Address.ZipCode`|Texto|Código postal do endereço de cobrança|
|`Customer.Address.City`|Texto|Cidade do endereço de cobrança|
|`Customer.Address.State`|Texto|Estado do endereço de cobrança|
|`Customer.Address.Country`|Texto|País do endereço de cobrança|
|`Customer.Address.District`|Texto|Bairro do endereço de cobrança|
|`Customer.DeliveryAddress.Street`|Texto|Logradouro do endereço de entrega|
|`Customer.DeliveryAddress.Number`|Texto|Número do endereço de entrega|
|`Customer.DeliveryAddress.Complement`|Texto|Complemento do endereço de entrega|
|`Customer.DeliveryAddress.ZipCode`|Texto|Código do endereço de entrega|
|`Customer.DeliveryAddress.City`|Texto|Cidade do endereço de entrega|
|`Customer.DeliveryAddress.State`|Texto|Estado do endereço de entrega|
|`Customer.DeliveryAddress.Country`|Texto|País do endereço de entrega|
|`Customer.DeliveryAddress.District`|Texto|Bairro do endereço de entrega|
|`Payment.Provider`|Texto|Nome da provedora da autorização|
|`Payment.Type`|Texto|Tipo do meio de pagamento|
|`Payment.Amount`|Número|Valor da transação financeira em centavos|
|`Payment.ServiceTaxAmount`|Número|Montante do valor da autorização que deve ser destinado à taxa de serviço|
|`Payment.Currency`|Texto|Moeda na qual o pagamento será feito|
|`Payment.Country`|Texto|País na qual o pagamento será realizado|
|`Payment.Installments`|Número|Número de parcelas|
|`Payment.Interest`|Texto|Tipo de parcelamento|
|`Payment.Capture`|Booleano|Indica se a autorização deverá ser com captura automática|
|`Payment.Authenticate`|Booleano|Indica se a transação deve ser autenticada|
|`Payment.Recurrent`|Booleano|Indica se a transação é do tipo recorrente|
|`Payment.SoftDescriptor`|Texto|Texto que será impresso na fatura do portador|
|`Payment.DoSplit`|Booleano|Indica se a transação será dividida entre vários participantes|
|`Payment.ExtraDataCollection.Name`|Texto|Identificador do campo extra que será enviado|
|`Payment.ExtraDataCollection.Value`|Texto|Valor do campo extra que será enviado|
|`Payment.Credentials.Code`|Texto|Afiliação gerada pela adquirente|
|`Payment.Credentials.Key`|Texto|Chave de afiliação/token gerado pela adquirente|
|`Payment.Credentials.Username`|Texto|Usuário gerado no credenciamento com a adquirente Getnet|
|`Payment.Credentials.Password`|Texto|Senha gerada no credenciamento com a adquirente Getnet|
|`Payment.Credentials.Signature`|Texto|ID do terminal no credenciamento com a adquirente Global Payments|
|`Payment.CreditCard.CardNumber`|Texto|Número do cartão de crédito truncado|
|`Payment.CreditCard.Holder`|Texto|Nome do portador impresso no cartão de crédito|
|`Payment.CreditCard.ExpirationDate`|Texto|Data de validade do cartão de crédito|
|`Payment.CreditCard.SecurityCode`|Texto|Código de segurança no verso do cartão de crédito|
|`Payment.CreditCard.Brand`|Texto|Bandeira do cartão de crédito|
|`Payment.CreditCard.SaveCard`|Booleano|Indica se os dados do cartão de crédito foram armazenados no Cartão Protegido|
|`Payment.CreditCard.Alias`|Texto|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|
|`Payment.CreditCard.CardToken`|GUID|Identificador do cartão de crédito salvo no Cartão Protegido|
|`Payment.FraudAnalysis.Sequence`|Texto|Tipo de fluxo da análise de fraude|
|`Payment.FraudAnalysis.SequenceCriteria`|Texto|Critério do fluxo da análise de fraude|
|`Payment.FraudAnalysis.Provider`|Texto|Provedor de AntiFraude|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|Indica se a transação após a análise de fraude será capturada|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Booleano|Indica se a transação após a análise de fraude será cancelada|
|`Payment.FraudAnalysis.TotalOrderAmount`|Número|Valor total do pedido em centavos|
|`Payment.FraudAnalysis.FingerPrintId`|Texto|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador|
|`Payment.FraudAnalysis.Browser.HostName`|Texto|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Booleano|Identifica se o browser do comprador aceita cookies|
|`Payment.FraudAnalysis.Browser.Email`|Texto|E-mail registrado no browser do comprador. Pode diferenciar do e-mail de cadastro na loja(`Customer.Email`)|
|`Payment.FraudAnalysis.Browser.Type`|Texto|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|Endereço de IP do comprador. Formato IPv4 ou IPv6|
|`Payment.FraudAnalysis.Cart.IsGift`|Booleano|Indica se o pedido realizado pelo comprador é para presente|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Booleano|Indica se o pedido realizado pelo comprador pode ser devolvido a loja|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Texto|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Texto|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Texto|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Texto|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Texto|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.Name`|Texto|Nome do Produto|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Número|Quantidade do produto|
|`Payment.FraudAnalysis.Cart.Items.Sku`|Texto|SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Número|Preço unitário do produto|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Texto|Nível de risco do produto associado a quantidade de chargebacks|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Texto|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido|
|`Payment.FraudAnalysis.Cart.Items.Type`|Texto|Categoria do produto|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Texto|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Número|ID das informações adicionais a serem enviadas|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Texto|Valor das informações adicionais a serem enviadas|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|Nome completo do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Shipping.Method`|Texto|Meio de entrega do pedido|
|`Payment.FraudAnalysis.Shipping.Phone`|Número|Número do telefone do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Travel.JourneyType`|Texto|Tipo de viagem|
|`Payment.FraudAnalysis.Travel.DepartureTime`|DateTime|Data e hora de partida|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Texto|Nome completo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Texto|Número do documento do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Texto|Classificação da empresa aérea|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Texto|Tipo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Texto|E-mail do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Número|Telefone do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Texto|Código do aeroporto de partida|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Texto|Código do aeroporto de chegada|
|`Payment.FraudAnalysis.Id`|GUID|Id da transação no AntiFraude Braspag|
|`Payment.FraudAnalysis.Status`|Número|Status da transação no AntiFraude Braspag <br/> [Tabela 14 - Payment.FraudAnalysis.Status]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-14-payment.fraudanalysis.status)|
|`Payment.FraudAnalysis.FraudAnalysisReasonCode`|Número|Código de retorno da Cybersouce <br/> [Tabela 15 - Payment.FraudAnalysis.FraudAnalysisReasonCode]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-15-payment.fraudanalysis.fraudanalysisreasoncode)|
|`Payment.FraudAnalysis.ReplyData.AddressInfoCode`|Texto|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador <br/> Os códigos são concatenados usando o caracter ^ Ex.: COR-BA^MM-BIN <br/> [Tabela 16 - Payment.FraudAnalysis.ReplyData.AddressInfoCode]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-16-payment.fraudanalysis.replydata.addressinfocode)|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Texto|Códigos que afetaram a pontuação da análise <br/> Os códigos são concatenados usando o caracter ^. Ex.: B^D^R^Z <br/>[Tabela 17 - ProviderAnalysisResult.AfsReply.FactorCode]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-17-payment.fraudanalysis.replydata.factorcode)|
|`Payment.FraudAnalysis.ReplyData.Score`|Número|Score da análise de fraude. Valor entre 0 e 100|
|`Payment.FraudAnalysis.ReplyData.BinCountry`|Texto|Código do país do BIN do cartão usado na análise. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Payment.FraudAnalysis.ReplyData.CardIssuer`|Texto|Nome do banco ou entidade emissora do cartão de crédito|
|`Payment.FraudAnalysis.ReplyData.CardScheme`|Texto|Bandeira do cartão|
|`Payment.FraudAnalysis.ReplyData.HostSeverity`|Número|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto|
|`Payment.FraudAnalysis.ReplyData.InternetInfoCode`|Texto|Códigos que indicam problemas com o endereço de e-mail, o endereço IP ou o endereço de cobrança <br/> Os códigos são concatenados usando o caracter ^. Ex.: FREE-EM^RISK-EM <br/> [Tabela 18 - Payment.FraudAnalysis.ReplyData.InternetInfoCode]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-18-payment.fraudanalysis.replydata.internetinfocode)|
|`Payment.FraudAnalysis.ReplyData.IpRoutingMethod`|Texto|Método de roteamento do comprador obtido a partir do endereço de IP <br/> [Tabela 19 - Payment.FraudAnalysis.ReplyData.IpRoutingMethod]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-19-payment.fraudanalysis.replydata.iproutingmethod)|
|`Payment.FraudAnalysis.ReplyData.ScoreModelUsed`|Texto|Nome do modelo de score utilizado na análise. Caso não tenha nenhum modelo definido, o modelo padrão da Cybersource foi o utilizado|
|`Payment.FraudAnalysis.ReplyData.CasePriority`|Número|Define o nível de prioridade das regras ou perfis do lojista. O nível de prioridade varia de 1 (maior) a 5 (menor) e o valor padrão é 3, e este será atribuído caso não tenha definido a prioridade das regras ou perfis. Este campo somente será retornado se a loja for assinante do Enhanced Case Management|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Texto|Id da transação na Cybersource|
|`Payment.PaymentId`|GUID|Identificador da transação no Pagador Braspag|
|`Payment.AcquirerTransactionId`|Texto|Identificador da transação na adquirente|
|`Payment.ProofOfSale`|Texto|Número do comprovante de venda na adquirente (NSU - Número sequencial único da transação)|
|`Payment.AuthorizationCode`|Texto|Código de autorização na adquirente|
|`Payment.ReceivedDate`|Datetime|Data em que a transação foi recebida no Pagador Braspag <br/> Ex.: 2018-01-16 16:38:19|
|`Payment.CapturedDate`|Datetime|Data em que a transação foi capturada na adquirente <br/> Ex.: 2018-01-16 16:38:20|
|`Payment.CapturedAmount`|Número|Valor capturado da transação <br/> Ex.: 123456 = r$ 1.234,56|
|`Payment.ECI`|Texto|Eletronic Commerce Indicator. Código gerado em uma transação de crédito com autenticação externa|
|`Payment.ReasonCode`|Texto|Código de retorno da operação|
|`Payment.ReasonMessage`|Texto|Mensagem de retorno da operação|
|`Payment.Status`|Número|Status da transação no Pagador <br/> [Tabela 21 - Payment.Status]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-21-payment.status)|
|`Payment.ProviderReturnCode`|Texto|Código retornado pela adquirente ou banco|
|`Payment.ProviderReturnMessage`|Texto|Mensagem retornada pela adquirente ou banco|

### Tabelas

#### Tabela 1 - Payment.FraudAnalysis.Cart.Items[n].GiftCategory

|Valor|Descrição|
|:-|:-|
|Yes|Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido|
|No|Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)|
|Off|Diferenças entre os endereços de cobrança e entrega não afetam a pontuação|

#### Tabela 2 - Payment.FraudAnalysis.Cart.Items[n].HostHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

#### Tabela 3 - Payment.FraudAnalysis.Cart.Items[n].NonSensicalHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

#### Tabela 4 - Payment.FraudAnalysis.Cart.Items[n].ObscenitiesHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

#### Tabela 5 - Payment.FraudAnalysis.Cart.Items[n].PhoneHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

#### Tabela 7 - Payment.FraudAnalysis.Cart.Items[n].TimeHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

#### Tabela 8 - Payment.FraudAnalysis.Cart.Items[n].Type

|Valor|Descrição|
|:-|:-|
|AdultContent|Conteúdo adulto|
|Coupon|Cupom aplicado para todo o pedido|
|Default|Valor default para o tipo do produto. Quando não enviado nenhum outro valor, assume-se o tipo sendo este|
|EletronicGood|Produto eletônico diferente de software|
|EletronicSoftware|Softwares distribuídos eletronicamente via download|
|GiftCertificate|Vale presente|
|HandlingOnly|Taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda. Ex.: Taxa de conveniência / Taxa de instalação|
|Service|Serviço que será realizado para o cliente|
|ShippingAndHandling|Valor do frete e e taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda|
|ShippingOnly|Valor do frete|
|Subscription|Assinatura. Ex.: Streaming de vídeos / Assinatura de notícias|

#### Tabela 9 - Payment.FraudAnalysis.Cart.Items[n].VelocityHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

#### Tabela 10 - Payment.FraudAnalysis.Shipping.Method

|Valor|Descrição|
|:-|:-|
|SameDay|Meio de entrega no mesmo dia|
|OneDay|Meio de entrega no próximo dia|
|TwoDay|Meio de entrega em dois dias|
|ThreeDay|Meio de entrega em três dias|
|LowCost|Meio de entrega de baixo custo|
|Pickup|Retirada na loja|
|Other|Outro meio de entrega|
|None|Sem meio de entrega, pois é um serviço ou assinatura|

#### Tabela 11 - Payment.FraudAnalysis.Travel.JourneyType

|Valor|Descrição|
|:-|:-|
|OneWayTrip|Viagem somente de ida|
|RoundTrip|Viagem de ida e volta|

#### Tabela 12 - Payment.FraudAnalysis.Travel.Passengers[n].Status

|Valor|
|:-|
|Standard|
|Gold|
|Platinum|

#### Tabela 13 - Payment.FraudAnalysis.Travel.Passengers[n].Rating

|Valor|Descrição|
|:-|:-|
|Adult|Adulto|
|Child|Criança|
|Infant|Infantil|

#### Tabela 14 - Payment.FraudAnalysis.Status

|Código|Descrição|
|:-|:-|
|0|Unknown|
|1|Accept|
|2|Reject|
|3|Review|
|4|Aborted|
|5|Unfinished|

#### Tabela 15 - Payment.FraudAnalysis.FraudAnalysisReasonCode

|Valor|Descrição|
|:-|:-|
|100|Operação realizada com sucesso|
|101|A transação enviada para análise de fraude está faltando um ou mais campos necessários <br/> Verificar no response o campo `ProviderAnalysisResult.Missing` <br/> Possível ação: Reenviar a transação com a informação completa|
|102|A transação enviada para análise de fraude possui um ou mais campos com valores inválidos <br/> Verificar no response o campo `ProviderAnalysisResult.Invalid` <br/> Possível ação: Reenviar a transação com a informação correta|
|150|Erro interno <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|151|A transação foi recebida, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|152|O pedido foi recebido, mas ocorreu time-out <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|202|Transação recusada pois o cartão expirou ou a data de validade não coincide com a correta <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|
|231|Transação recusada pois o cartão é inválido <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|
|234|Problema com a configuração da loja na Cybersource <br/> Possível ação: Entre em contato com o suporte para corrigir o problema de configuração|
|400|A pontuação de fraude ultrapassa o seu limite <br/> Possível ação: Reveja a transação do comprador|
|480|A transação foi marcada como revisão pelo DM (Decision Manager)|
|481|A transação foi rejeitada pelo DM (Decision Manager)|

#### Tabela 16 - Payment.FraudAnalysis.ReplyData.AddressInfoCode

|Valor|Descrição
|:-|:-|
|COR-BA|O endereço de cobrança pode ser normalizado|
|COR-SA|O endereço de entrega pode ser normalizado|
|INTL-BA|O país do endereço de cobrança está fora dos EUA|
|INTL-SA|O país do endereço de entrega está fora dos EUA|
|MIL-USA|Endereço militar nos EUA|
|MM-A|Os endereços de cobrança e entrega usam nomes de ruas diferentes|
|MM-BIN|O BIN do cartão (os seis primeiros dígitos do número do cartão) não corresponde ao país|
|MM-C|Os endereços de cobrança e entrega usam cidades diferentes|
|MM-CO|Os endereços de cobrança e entrega usam países diferentes|
|MM-ST|Os endereços de cobrança e entrega usam estados diferentes|
|MM-Z|Os endereços de cobrança e entrega usam códidos postais diferentes|
|UNV-ADDR|O endereço é inverificável|

#### Tabela 17 - Payment.FraudAnalysis.ReplyData.FactorCode

|Valor|Descrição|
|:-|:-|
|A|Mudança de endereço excessiva. O comprador mudou o endereço de cobrança duas ou mais vezes nos últimos seis meses|
|B|BIN do cartão ou autorização de risco. Os fatores de risco estão relacionados com BIN de cartão de crédito e/ou verificações de autorização do cartão|
|C|Elevado números de cartões de créditos. O comprador tem usado mais de seis números de cartões de créditos nos últimos seis meses|
|D|Impacto do endereço de e-mail. O comprador usa um provedor de e-mail gratuito ou o endereço de email é arriscado|
|E|Lista positiva. O comprador está na sua lista positiva|
|F|Lista negativa. O número da conta, endereço, endereço de e-mail ou endereço IP para este fim aparece sua lista negativa|
|G|Inconsistências de geolocalização. O domínio do comprador de e-mail, número de telefone, endereço de cobrança, endereço de envio ou endereço IP é suspeito|
|H|Excessivas mudanças de nome. O comprador mudou o nome duas ou mais vezes nos últimos seis meses|
|I|Inconsistências de internet. O endereço IP e de domínio de e-mail não são consistentes com o endereço de cobrança|
|N|Entrada sem sentido. O nome do comprador e os campos de endereço contém palavras sem sentido ou idioma|
|O|Obscenidades. Dados do comprador contém palavras obscenas|
|P|Identidade morphing. Vários valores de um elemento de identidade estão ligados a um valor de um elemento de identidade diferentes. Por exemplo, vários números de telefones estão ligados a um número de conta única|
|Q|Inconsistências do telefone. O número de telefone do comprador é suspeito|
|R|Ordem arriscada. A transação, o comprador e o lojista mostram informações correlacionadas de alto risco|
|T|Cobertura Time. O comprador está a tentar uma compra fora do horário esperado|
|U|Endereço não verificável. O endereço de cobrança ou de entrega não pode ser verificado|
|V|O cartão foi usado muitas vezes nos últimos 15 minutos|
|W|Marcado como suspeito. O endereço de cobrança ou de entrega é semelhante a um endereço previamente marcado como suspeito|
|Y|O endereço, cidade, estado ou país dos endereços de cobrança e entrega não se correlacionam|
|Z|Valor inválido. Como a solicitação contém um valor inesperado, um valor padrão foi substituído. Embora a transação ainda possa ser processada, examinar o pedido com cuidado para detectar anomalias|

#### Tabela 18 - Payment.FraudAnalysis.ReplyData.InternetInfoCode

|Valor|Descrição|
|:-|:-|
|FREE-EM|O endereço de e-mail do comprador é de um provedor de e-mail gratuito|
|INTL-IPCO|O país do endereço de e-mail do comprador está fora dos EUA|
|INV-EM|O endereço de e-mail do comprador é inválido|
|MM-EMBCO|O domínio do endereço de e-mail do comprador não é consistente com o país do endereço de cobrança|
|MM-IPBC|O endereço de e-mail do comprador não é consistente com a cidade do endereço de cobrança|
|MM-IPBCO|O endereço de e-mail do comprador não é consistente com o país do endereço de cobrança|
|MM-IPBST|O endereço IP do comprador não é consistente com o estado no endereço de cobrança. No entanto, este código de informação não pode ser devolvido quando a inconsistência é entre estados imediatamente  adjacentes|
|MM-IPEM|O endereço de e-mail do comprador não é consistente com o endereço IP|
|RISK-EM|O domínio do e-mail do comprador (por exemplo, mail.example.com) está associado com alto risco|
|UNV-NID|O endereço IP do comprador é de um proxy anônimo. Estas entidades escondem completamente informações sobre o endereço de IP|
|UNV-RISK|O endereço IP é de origem de risco|
|UNV-EMBCO|O país do endereço de e-mail não corresponde ao país do endereço de cobrança|

#### Tabela 19 - Payment.FraudAnalysis.ReplyData.IpRoutingMethod

|Valor|Descrição|
|:-|:-|
|Anonymizer|Endereços de IP estão escondidos porque o comprador é extremamente cauteloso, quer privacidade absoluta ou é fraudulento|
|AOL, AOL dialup, AOL POP and AOL proxy|Membros da AOL. Na maioria dos casos, o país pode ser identificado, mas o estado e cidade não podem|
|Cache proxy|Proxy usado através de um acelerador da Internet ou de uma distribuição de conteúdo de serviço. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|
|Fixed|O endereço de IP está próximo ou no mesmo local que o comprador|
|International proxy|Proxy que contém tráfego de vários países. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|
|Mobile gateway|Gateway para conectar dispositivos móveis à internet. Muitas operadoras, especialmente na Europa, atendem mais do que um país e tráfego ocorre através de hubs de rede centralizados. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|
|POP|Discagem do comprador em um ISP regional provavelmente perto da localização do endereço de IP, mas possivelmente através de limites geográficos|
|Regional proxy|Proxy que contém tráfego de vários estados dentro de um único país. O comprador pode estar localizado em um estado diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|
|Satellite|Conexões por satélite. Se o uplink e o downlink estiverem cadastrados, o método roteamento é considerado padrão porque o remetente é conhecido. No entanto, se o downlink não está registrado, o comprador pode estar em qualquer lugar dentro do feixe padrão do satélite, que pode abranger um continente ou mais|
|SuperPOP|O comprador está discando em um ISP multi-estatal ou multinacional que provavelmente não é provável a localização do endereço de IP. O comprador pode estar discando através de limites geográficos|
|No value returned|O tipo de roteamento é desconhecido|

#### Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields

> Nível de Relevância <br/> 1 - Relevante <br/> 2 - Muito Relevante <br/> 3 - Extremamente Relevante <br/><br/>
> Conforme nível de relevância dos campos e possibilidade de desenho da estratégia de risco de acordo com a necessidade do seu negócio, na validação das transações de testes os mesmos serão cobrados caso não sejam enviaos. Com isso, solicitamos uma análise prévia da documentação e sinalização dos campos que não serão possíveis de serem enviados.<br/><br/>
> No caso de não possuir o dado para enviar, pedimos a gentileza de não enviar o campo correspondente como vazio, ou seja, apenas não enviar.

|ID|Valor|Tipo|Nível de Relevância|Segmento|
|--|-----|----|-------------------|--------|
|1|Cliente efetuou Login <br/> Se o cliente final logou no site para comprar, enviar: o login dele <br/> Se fez compra como visitante, enviar: Guest <br/> Se a venda foi feita direto por um terceiro, um agente por exemplo, não enviar o campo|Texto|2|Todos|
|2|Quantidade em dias que o cliente é seu cliente <br/> Ex.: 314|int|3|Todos|
|3|Quantidade de parcelas do pedido|int|3|Todos|
|4|Canal de Venda <br/> Possíveis valores: <br/> Call Center -> compra pelo telefone <br/> Web -> compra pela web <br/> Portal -> um agente fazendo a compra para o cliente <br/> Quiosque -> compras em quiosques <br/> Movel -> compras feitas em celulares ou tablets|string|3|Todos|
|5|Enviar o código do cupom/desconto caso o cliente utilize na compra|Texto|1|Todos|
|6|Quantidade em dias desde a última compra realizada pelo cliente <br/> Ex.: 55|int|3|Todos|
|7|Código ou nome do seller (vendedor)|Texto|1|Todos|
|8|Tentativas realizadas pelo cliente de efetuar o pagamento do mesmo pedido, podendo ser com diferentes cartões de créditos e/ou através de outros meios de pagamentos|int|2|Todos|
|9|Identifica se cliente irá retirar o produto na loja <br/> Possíveis valores: SIM ou NAO|Texto|3|Varejo ou Cosméticos|
|10|Identifica se o pagamento será realizado por outra pessoa que não esteja presente na viagem ou pacote <br/> Possíveis valores: SIM ou NAO|Texto|3|Aéreo ou Turismo|
|11|Categoria do hotel (quantas estrelas) <br/> Possíveis valores: <br/> 1 -> Simples <br/> 2 -> Econômico <br> 3 -> Turismo <br/> 4 -> Superior <br/> 5 -> Luxo|int|3|Turismo|
|12|Quantidade em dias desde a data da compra até a data do checkin no hotel <br/> Ex.: 123|int|3|Turismo|
|13|Quantidade de diárias no hotel <br/> Ex.: 5|int|3|Turismo|
|14|Categoria da viagem ou pacote <br> Possíveis valores: Nacional ou Internacional ou Nacional/Internacional|Texto|3|Aéreo ou Turismo|
|15|Nome da companhia áerea / locadora de carro / hotel <br/> Enviar o nome de cada uma das empresas, separado por /|Texto|2|Aéreo ou Turismo|
|16|Código PNR da reserva <br/> Quando houver uma alteração da reserva para este PNR, com antecipação da data de voo, é importante fazer uma nova análise de fraude enviando este PNR novamente|Texto|3|Aérea|
|17|Identifica se houve antecipação de reserva <br/> Possíveis valores: SIM ou NAO <br/> Se sim, fundamental o envio também do campo 16 - Código PNR da reserva|Texto|3|Aéreo|
|18|Categoria do veículo alugado <br/> Possíveis valores: <br/> 1 - Básico <br/> 2 - Esportivo <br/> 3 - Prime <br/> 4 - Utilitário <br/> 5 - Blindado|Texto|3|Turismo|
|19|Identifica se o pacote refere-se a cruzeiro <br/> Possíveis valores: SIM ou NAO|Texto|2|Turismo|
|20|Decisão da análise de fraude referente a última compra <br/> Possíveis valores: ACEITA ou REJEITADA|Texto|3|Todos|
|21|Valor do frete <br/> Ex.: 10599 = r$ 105,99|long|1|Varejo ou Cosméticos|
|22|Código da loja onde o produto será retirado <br/> Este campo deverá ser enviado quando o campo 9 for enviado igual a SIM|Texto|3|Varejo ou Cosméticos|
|23|Sufixo (4 últimos dígitos) do cartão de crédito|int|1|Todos|
|24|Quantidade de dias desde a primeira compra realizada pelo cliente <br/> Ex.: 150|int|3|Todos|
|25|Sexo do cliente <br/> Possíveis valores: <br/> F -> Feminino <br/> M -> Masculino|Texto|2|Todos|
|26|Bin (6 primeiros dígitos) do cartão de crédito|int|1|Todos|
|27|Tipo do logradouro do endereço de entrega <br/> Possíveis valores: <br/> R -> Residencial <br/> C -> Comercial|Texto|2|Todos|
|28|Tempo médio em minutos que o cliente levou para realizar a compra|int|2|Todos|
|29|Quantidade de tentativas que o cliente realizou para efetuar login|int|2|Todos|
|30|Quantidade de páginas web que o cliente visitou anteriormente a compra referente a 30 minutos passados|int|2|Todos|
|31|Quantidade de trocas de números de cartão de crédito que o cliente efetuou para realizar o pagamento do pedido|int|2|Todos|
|32|Identifica se o e-mail foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|Texto|3|Todos|
|33|Identifica se o número do cartão de crédito foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|Texto|3|Todos|
|34|Identifica se o e-mail foi confirmado para ativação de conta <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|35|Identifica o tipo de cliente <br/> Possíveis valores: Local ou Turista|Texto|2|Turismo|
|36|Identifica se foi utilizado cartão presente (GiftCard) na compra como forma de pagamento <br/> Possíveis valores: SIM ou NAO|Texto|1|Todos|
|37|Meio de envio do pedido <br/> Possíveis valores: Sedex <br/> Sedex 10 <br/> 1 Dia <br/> 2 Dias <br/> Motoboy <br/> Mesmo Dia <br/>|Texto|3|Varejo ou Cosméticos|
|38|Número do telefone do cliente identificado através da bina quando venda realizada através do canal de venda igual a Call Center <br/> Formato: DDIDDDNúmero - Ex.: 552121114720|Texto|3|Todos|
|39|Nome de usuário do Call Center <br/> Este campo deverá ser enviado quando campo 4 for enviado igual a Call Center|Texto|1|Todos|
|40|Comentários inseridos quando pedido for presente|Texto|1|Todos|
|41|Tipo do documento <br/> Possíveis valores: CPF ou CNPJ ou Passaporte|Texto|2|Todos|
|42|Idade do cliente|int|2|Todos|
|43|Faixa de rendimento do cliente <br/> Ex.: 100000 = r$ 1.000,00|long|2|Todos|
|44|Quantidade histórica de compras realizadas pelo cliente|int|3|Todos|
|45|Identifica se é uma compra realizada por funcionário <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|46|Nome impresso (portador) no cartão de crédito|Texto|3|Todos|
|47|Identifica se o cartão é private label <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|48|Quantidade de meios de pagamentos utilizados para efetuar a compra|int|2|Todos|
|49|Média das compras realizadas nos últimos 6 meses <br/> Ex.: 159050 = r$ 1.590,99|long|3|Todos|
|50|Fator de desvio de valor da compra atual sobre a média dos últimos 6 meses|3|Todos|
|51|Identifica se é um cliente VIP com tratamento de risco diferenciado ou lista positiva <br/> Possíveis valores: SIM ou NAO|Texto|3|Todos|
|52|Categoria do produto <br/> Possíveis valores: <br/> Animais e Bichos de Estimação <br/> Roupas e Acessórios <br/> Negócios e Indústria <br/> Câmeras e Óticas <br/> Eletrônicos <br/> Comidas, Bebidas e Cigarro <br/> Móveis <br/> Ferramentas <br/> Saúde e Beleza <br/> Casa e Jardim <br/> Malas e Bagagens <br/> Adulto <br/> Armas e Munição <br/> Materiais de Escritório <br/> Religião e Cerimoniais <br/> Software <br/> Equipamentos de Esporte <br/> Brinquedos e Jogos <br/> Veículos e Peças <br/> Livros <br/> DVDs e Vídeos <br/> Revistas e Jornais <br/> Música <br/> Outras Categorias Não Especificadas|Texto|2|Todos|
|53|Identifica se existe rotina de confirmação de celular por SMS <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|54|Qual a 2ª forma de pagamento|Texto|2|Todos|
|55|Qual a 3ª forma de pagamento|Texto|2|Todos|
|56|Se 2ª forma de pagamento for cartão de crédito, enviar a bandeira|Texto|1|Todos|
|57|Se 3ª forma de pagamento for cartão de crédito, enviar a bandeira|Texto|1|Todos|
|58|Se 2ª forma de pagamento, informar o valor pago <br/> Ex.: 128599 = r$ 1.285,99|long|2|Todos|
|59|Se 3ª forma de pagamento, informar o valor pago <br/> Ex.: 59089 = r$ 590,89|long|2|Todos|
|60|Quantidade em dias desde a data da última alteração <br/> Ex.: 57|int|3|Todos|
|61|Identifica se houve alteração cadastral|Texto|1|Todos|
|62|Quantidade de pontos trocados na última compra|long|3|Fidelidade|
|63|Quantidade de pontos restantes no saldo|long|2|Fidelidade|
|64|Quantidade de dias desde a última troca de pontos|long|2|Fidelidade|
|65|Identificador do cliente no programa de fidelidade|Texto|2|Fidelidade|
|66|Quantidade de minutos recarregados nos últimos 30 dias|long|2|Digital Goods|
|67|Quantidade de recargas realizadas nos últimos 30 dias|long|2|Digital Goods|
|68|Quantidade em dias entre a data de partida e a data de retorno|int|2|Aéreo|
|69|Quantidade de passageiros viajando independente da faixa etária|int|2|Aéreo|
|70|Identificador do voô|Texto|1|Aéreo|
|71|Número de infants viajando|int|2|Aéreo|
|72|Número de crianças viajando|int|2|Aéreo|
|73|Número de adultos viajando|int|2|Aéreo|
|74|Identifica se é um passageiro frequente (Frequently Flyer) <br/> Possíveis valores: SIM ou NAO|Texto|2|Aéreo|
|75|Identificar do passageiro frequente (Frequently Flyer Number)|Texto|2|Aéreo|
|76|Categoria do passageiro frequente (Frequently Flyer) <br/> Esta categoria pode variar de acordo com a companhia aérea|int|2|Aéreo|
|77|Dia da semana do embarque <br/> Possíveis valores: Sunday (Domingo) <br/> Monday (Segunda-feira) <br/> Tuesday (Terça-feira) <br/> Wednesday (Quarta-feira) <br/> Thursday (Quinta-feira) <br/> Friday (Sexta-feira) <br/> Saturday (Sábado)|Texto|2|Aéreo|
|78|Código da companhia aérea <br/> Ex.: JJ ou LA ou AA ou UA ou G3 e etc|Texto|1|Aéreo|
|79|Classe tarifária da passagem <br/> Ex.: W ou Y ou N e etc|Texto|2|Aéreo|
|80|Número do celular do passageiro <br/> Ex.: Formato: DDIDDDNúmero - Ex.: 5521976781114|Texto|2|Aéreo|
|81|Identifica se o dono do cartão de crédito irá viajar <br/> Possíveis valores: SIM ou NAO|Texto|3|Aéreo|
|82|Identifica se o seller (vendedor) irá trabalhar com revisão manual ou não <br/> Possíveis valores: SIM ou NAO|Texto|1|Todos|
|83|Segmento de negócio <br/> Ex.: Varejo|Texto|2|Todos|
|84|Nome da plataforma integrada a API 3.0 <br/> Caso seja uma integração direta entre a loja e Cielo, enviar valor igual a PROPRIA|Texto|3|Todos|
|85 a 89|Campos livres e definidos junto ao provedor de AntiFraude, conforme as regras de negócio|-|-|-|
|90 a 100|Reservados|-|-|-|

#### Tabela 21 - Payment.Status

|Código|Status do Pagamento|Meio de pagamento|Descrição|
|------|-------------------|-----------------|---------|
|0|NotFinished|Todos|Falha ao processar o pagamento|
|1|Authorized|Todos|Meio de pagamento apto a ser capturado ou pago(Boleto)|
|2|PaymentConfirmed|Todos|Pagamento confirmado e finalizado|
|3|Denied|Cartão de Crédito e Débito (Transferência eletrônica) |
|10|Voided|Todos|Pagamento cancelado|
|11|Refunded|Cartão de crédito e Débito|Pagamento Cancelado/Estornado|
|12|Pending|Cartão de Crédito e Débito  (Transferência eletrônica) |Esperando retorno da instituição financeira|
|13|Aborted|Todos|Pagamento cancelado por falha no processamento|

## Configuração do Fingerprint

Importante componente da análise de fraude, o Fingerprint é um Javascript que deve ser inserido no seu site para capturar dados importantes como: IP do comprador, versão do browser, sistema operacional etc.
Muitas vezes, somente os dados do carrinho não são suficientes para garantir uma análise assertiva. Os dados coletados pelo Fingerprint complementam a análise e garantem que sua loja está mais protegida.

Esta página descreve como funciona e como configurar o fingerprint em sua página de checkout e mobiles.

### Integração em checkout

Será necessário adicionar duas tags, a *script* dentro da tag *head* para uma performance correta e a *noscript* dentro da tag *body*, para que a coleta dos dados do dispositivo seja realizada mesmo se o Javascript do browser estiver desabilitado.

<aside class="warning">Se os 2 segmentos de código não forem colocados na página de checkout, os resultados da análise de fraude podem não ser precisos.</aside>

**Variáveis**
Existem duas variáveis a serem preenchidas na URL do Javascript. O `org_id` e o `session_id`. O `org_id` é um valor predefinido conforme tabela abaixo, já o `session_id` é composto pela concatenação dos parâmetros `ProviderMerchantId` e `FraudAnalysis.FingerPrintId`, conforme exemplo abaixo:

|Variável|Descrição|
|:-|:-|
|`org_id`|para Sandbox = 1snn5n9w <br/> para Produção = k8vif92e|
|`session_id`|`ProviderMerchantId` = Identificador da sua loja na Cybersource. Caso não possua, entre em contato com a Braspag <br/> `FraudAnalysis.FingerPrintId` = Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas.|

**Aplicação**

O modelo do Javascript é o seguinte:

![Exemplo Código]({{ site.baseurl_root }}/images/braspag/af/exemploscriptdfp.png)

As variáveis, quando devidamente preenchidas, forneceriam uma URL semelhante ao exemplo abaixo:

![Exemplo Url](https://braspag.github.io/images/braspag/af/urldfp.png)

<aside class="warning">Certifique-se de copiar todos os dados corretamente e de ter substituído as variáveis corretamente pelos respectivos valores.</aside>

### Integração em aplicativos mobile

> Solicite junto ao chamado de integração os SDKs (iOS e Android) e os manuais.

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

## Post de Notificação

Para receber a notificação de alteração de status deve-se ter configurado no cadastro de sua loja na Braspag, o campo URL Status Pagamento para receber os parametros conforme o exemplo ao lado.

Resposta esperada da Loja: HTTP Status Code 200 OK

Caso não seja retornado o HTTP Status Code 200 OK será tentado mais duas vezes enviar o Post de Notificação.

```json
{
   "RecurrentPaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "ChangeType": "2"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`RecurrentPaymentId`|Identificador que representa o pedido Recorrente (aplicável somente para ChangeType 2 ou 4|GUID|36|Não|
|`PaymentId`|Identificador que representa a transação|GUID|36|Sim|
|`ChangeType`|Especifica o tipo de notificação. Vide tabela abaixo | Número | 1 |Sim|

|ChangeType|Descrição|
|----------|---------|
|1|Mudança de status do pagamento|
|2|Recorrência criada|
|3|Mudança de status do AntiFraude|
|4|Mudança de status do pagamento recorrente (Ex. desativação automática)|
|5|Estorno negado (aplicável para Rede)|
|6|Boleto registrado pago a menor|
|7|Notificação de chargeback <br/> Para mais detalhes [Risk Notification](https://braspag.github.io//manual/risknotification)|
|8|Alerta de fraude|
