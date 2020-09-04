---
layout: manual
title: Split de Pagamentos - Cielo E-Commerce
description: Manual integração do Split de Pagamentos
search: true
toc_footers: false
categories: manual
sort_order: 3
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

O Split de Pagamentos é parte da API Cielo E-Commerce. As operações transacionais continuam sendo realizadas pela API Cielo, sendo necessárias poucas alterações para utlização do Split de Pagamentos.

### Sandbox

* **API Cielo E-Commerce**: https://apisandbox.cieloecommerce.cielo.com.br/
* **API Cielo E-Commerce (Consultas)**: https://apiquerysandbox.cieloecommerce.cielo.com.br/
* **API Split**: https://splitsandbox.braspag.com.br/
* **Braspag OAUTH2 Server**: https://authsandbox.braspag.com.br/

### Produção

* **API Cielo E-Commerce**: https://api.cieloecommerce.cielo.com.br/
* **API Cielo E-Commerce (Consultas)**: https://apiquery.cieloecommerce.cielo.com.br/
* **API Split**: https://split.braspag.com.br/
* **Braspag OAUTH2 Server**: https://auth.braspag.com.br/

## Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais, que deverá posteriormente ser enviado a API Cielo e-Commerce e a API do Split.

Para obter um token de acesso:

1. Concatene o ClientId e ClientSecret: `ClientId:ClientSecret`.  
2. Codifique o resultado da concatenação em Base64.  
3. Realize uma requisição ao servidor de autorização:  

**Request**  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
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

> O ClientId é o mesmo utilizado na integração com a API Cielo E-Commerce, conhecido como MerchantId. O ClientSecret deve ser obtido junto à Braspag.

O token retornado (access_token) deverá ser utilizado em toda requisição à API Cielo e-Commerce ou à API Split como uma chave de autorização. O mesmo possui uma validade de 20 minutos e deverá ser obtido um novo token toda vez que o mesmo expirar.  

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
        "Type":"SplittedCreditCard",
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
        }
    }

}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`Payment`|-|-|Sim|Campos refente ao pagamento e antifraude|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `SplittedCreditCard` ou `SplittedDebitCard`|
|`Payment.Amount`|Inteiro|15|Sim|Valor do pedido em centavos. Ex.: R$ 1.559,85 = 155985|
|`Payment.Capture`|Boleano|-|Sim|Parâmetro para capturar a transação. Caso o valor seja `False` a transação será apenas autorizada. Se for `True`, a captura será realizada automaticamente após a autorização.|
|`Payment.Installments`|Inteiro|2|Sim|Número de parcelas do pedido|
|`Payment.SoftDescriptor`|Texto|13|Sim|Texto que será impresso na fatura do cartão de crédito do portador. Na fatura, o sofdescriptor pode ser encurtado de acordo com as regras da adquirente e bandeira.|
|`Payment.CreditCard`|-|-|Sim|Nó contendo as informações do cartão|
|`Payment.CreditCard.CardNumber`|Texto|19|Sim|Número do cartão do comprador|
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

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json

--header "Authorization: Bearer {access_token}"
--header "Content-Type: application/json"

--body
{
    "MerchantOrderId":"201904150001",
    "Customer":{
        "Name": "João da Silva",
        "Identity":"12345678900",
        "IdentityType":"CPF"
    },
    "Payment":{
        "Type":"SplittedCreditCard",
        "Amount":10000,
        "Capture":True,
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
        "Interest": 0,
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
        "Tid": "0415043705142",
        "ProofOfSale": "20190415043705142",
        "AuthorizationCode": "910636",
        "SoftDescriptor": "LojaDoJoao",
        "Provider": "Simulado",
        "FraudAnalysis": {
            "Id": "ebc340d8-b55f-e911-b49e-0003ff358dcf",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "FactorCode": "F^H",
                "Score": 40,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-HIST",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME",
                "CasePriority": 3,
                "ProviderTransactionId": "5553570245616166304007"
            },
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "TotalOrderAmount": 10000,
            "TransactionAmount": 0,
            "FraudAnalysisReasonCode": 100,
            "Provider": "Cybersource",
            "IsRetryTransaction": false
        },
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
        "IsQrCode": false,
        "Amount": 10000,
        "ReceivedDate": "2019-04-15 16:37:01",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-04-15 16:37:05",
        "Status": 2,
        "IsSplitted": true,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "6",
        "PaymentId": "c8e05b4e-10ce-4f3f-ab64-6a9e8cc06b9a",
        "Type": "SplittedCreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "PUT",
                "Rel": "split",
                "Href": "https://splitsandbox.braspag.com.br/api/transactions/c8e05b4e-10ce-4f3f-ab64-6a9e8cc06b9a/split"
            },
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/c8e05b4e-10ce-4f3f-ab64-6a9e8cc06b9a"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/c8e05b4e-10ce-4f3f-ab64-6a9e8cc06b9a/void"
            }
        ]
    }
}
```

**Esse é apenas um request de exemplo bem básico e não deve ser utilizado em produção. Para facilitar o entendimento, não foi aplicado nenhum campo que fortalece a segurança da transação.**

Nos próximos exemplos explicaremos como aumentar a segurança e manipular os campos da nossa transação entre crédito e débito.

## Integração

### Autorização  

A autorização de uma transação no Split de Pagamentos deve ser realizada através da API Cielo E-Commerce seguindo os mesmos contratos descritos na documentação da plataforma.

Exemplo:

#### Request - Transação de Crédito

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{  
   "merchantorderid":"23082019",
   "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "12750233713",
        "identitytype": "CPF",
        "Mobile": "5521996660078"
    },
    "payment": {
        "type": "splittedcreditcard",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "CreditCard": {
            "cardNumber": "4481530710186111",
            "holder": "Oswaldo Soares",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "fraudanalysis": {
            "provider": "cybersource", 
            "Shipping": {
                "Addressee": "Comprador Accept"
            },
            "browser": {
                "ipaddress": "179.221.103.151",
                "browserfingerprint": "22082019"
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
                        "unitprice": 100.00
                    }
                ]
            },
            "MerchantDefinedFields": [
                {
                    "Id": 1,
                    "Value": "Guest"
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
        "Identity": "12750233713",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521996660078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Oswaldo Soares",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "0823032122562",
        "ProofOfSale": "20190823032122562",
        "AuthorizationCode": "329269",
        "SoftDescriptor": "teste",
        "Provider": "Simulado",
        "FraudAnalysis": {
            "Id": "f74824ce-d2c5-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "FactorCode": "F^H^P",
                "Score": 44,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST",
                "InternetInfoCode": "INTL-IPCO^RISK-EM",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME^VELI-TIP^VELL-TIP",
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
                    "ScreenResolutionField": "1366x768",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5665844815656968804011"
            },
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "TotalOrderAmount": 10000,
            "TransactionAmount": 0,
            "MerchantDefinedFields": [
                {
                    "Id": "1",
                    "Value": "Guest"
                }
            ],
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": 0,
                        "Name": "Produto teste",
                        "Risk": 0,
                        "Sku": "563",
                        "OriginalPrice": 0,
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": 0,
                        "NonSensicalHedge": 0,
                        "ObscenitiesHedge": 0,
                        "PhoneHedge": 0,
                        "TimeHedge": 0,
                        "VelocityHedge": 0,
                        "GiftCategory": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151",
                "BrowserFingerPrint": "23082019"
            },
            "Shipping": {
                "Addressee": "Comprador Accept",
                "Method": 0
            },
            "FraudAnalysisReasonCode": 100,
            "Provider": "Cybersource",
            "IsRetryTransaction": false
        },
        "SplitPayments": [
            {
                "SubordinateMerchantId": "247d032d-f917-4a52-8e7a-d850945f065e",
                "Amount": 10000,
                "Fares": {
                    "Mdr": 2.50,
                    "Fee": 0
                },
                "Splits": [
                    {
                        "MerchantId": "247d032d-f917-4a52-8e7a-d850945f065e",
                        "Amount": 10000
                    }
                ]
            }
        ],
        "IsQrCode": false,
        "Amount": 10000,
        "ReceivedDate": "2019-08-23 15:21:12",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-23 15:21:22",
        "Status": 2,
        "IsSplitted": true,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "6",
        "PaymentId": "ffba7a99-94cb-4397-be83-d125c2933ed5",
        "Type": "SplittedCreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "PUT",
                "Rel": "split",
                "Href": "https://splitsandbox.braspag.com.br/api/transactions/ffba7a99-94cb-4397-be83-d125c2933ed5/split"
            },
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/ffba7a99-94cb-4397-be83-d125c2933ed5"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/ffba7a99-94cb-4397-be83-d125c2933ed5/void"
            }
        ]
    }
}
```

Ao informar um tipo de pagamento referente ao Split, a API Cielo e-Commerce automaticamente identifica que a transação é referente ao Split de Pagamentos e realiza o fluxo transacional através da Braspag (Facilitador).

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
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.Capture`|Booleano|---|Não (Default false)|Booleano que indica se a autorização deve ser com captura automática (true) ou não (false). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador. Na fatura, o sofdescriptor pode ser encurtado de acordo com as regras da adquirente e bandeira.|
|`CreditCard.CardNumber`|Texto|19|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.SaveCard`|Booleano|---|Não (Default false)|Booleano que identifica se o cartão será salvo para gerar o token (CardToken)|

**Exemplo 1)**  

Transação no valor de **R$100,00**, com captura automática, sem o nó contendo as regras de divisão.

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{  
   "merchantorderid":"22082019v1",
   "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "12750233713",
        "identitytype": "CPF",
        "Mobile": "5521996660078",
        "Phone": "552125553669",
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        }
    },
    "payment": {
        "type": "splittedcreditcard",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "CreditCard": {
            "cardNumber": "4481530710186111",
            "holder": "Oswaldo Soares",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "fraudanalysis": {
            "provider": "cybersource", 
            "Shipping": {
                "Addressee": "Comprador Accept"
            },
            "browser": {
                "ipaddress": "179.221.103.151",
                "browserfingerprint": "22082019v1"
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
                        "unitprice": 100.00
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
    "MerchantOrderId": "22082019v3",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "12750233713",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        },
        "Phone": "552125553669",
        "Mobile": "5521996660078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Oswaldo Soares",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "0823032853370",
        "ProofOfSale": "20190823032853370",
        "AuthorizationCode": "023609",
        "SoftDescriptor": "teste",
        "Provider": "Simulado",
        "FraudAnalysis": {
            "Id": "eddf8cda-d3c5-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "AddressInfoCode": "COR-SA",
                "FactorCode": "F^H",
                "Score": 92,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST^NEG-SA",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default_lac",
                "VelocityInfoCode": "VEL-NAME^VELI-TIP^VELL-TIP^VELS-CC^VELS-EM",
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
                    "ScreenResolutionField": "1366x768",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5665849323716897904012"
            },
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "TotalOrderAmount": 10000,
            "TransactionAmount": 0,
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
                        "Type": 0,
                        "Name": "Produto teste",
                        "Risk": 0,
                        "Sku": "563",
                        "OriginalPrice": 0,
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": 0,
                        "NonSensicalHedge": 0,
                        "ObscenitiesHedge": 0,
                        "PhoneHedge": 0,
                        "TimeHedge": 0,
                        "VelocityHedge": 0,
                        "GiftCategory": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151",
                "BrowserFingerPrint": "22082019v3"
            },
            "Shipping": {
                "Addressee": "Comprador Accept",
                "Method": 0
            },
            "FraudAnalysisReasonCode": 100,
            "Provider": "Cybersource",
            "IsRetryTransaction": false
        },
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
        "IsQrCode": false,
        "Amount": 10000,
        "ReceivedDate": "2019-08-23 15:28:44",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-23 15:28:53",
        "Status": 2,
        "IsSplitted": true,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "6",
        "PaymentId": "6b355eb8-d3bd-428d-ba4a-506f299a425f",
        "Type": "SplittedCreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "PUT",
                "Rel": "split",
                "Href": "https://splitsandbox.braspag.com.br/api/transactions/6b355eb8-d3bd-428d-ba4a-506f299a425f/split"
            },
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/6b355eb8-d3bd-428d-ba4a-506f299a425f"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/6b355eb8-d3bd-428d-ba4a-506f299a425f/void"
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

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{  
   "merchantorderid":"22082019v4",
   "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "12750233713",
        "identitytype": "CPF",
        "Mobile": "5521996660078",
        "Phone": "552125553669",
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        }
    },
    "payment": {
        "type": "splittedcreditcard",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "CreditCard": {
            "cardNumber": "4481530710186111",
            "holder": "Oswaldo Soares",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "fraudanalysis": {
            "provider": "cybersource", 
            "Shipping": {
                "Addressee": "Comprador Accept"
            },
            "browser": {
                "ipaddress": "179.221.103.151",
                "browserfingerprint": "22082019v4"
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
                        "unitprice": 100.00
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
      "splitpayments":[  
         {  
            "subordinatemerchantid":"f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "amount":5000,
            "fares":{  
               "mdr":5,
               "fee":30
            }
         },
         {  
            "subordinatemerchantid":"9140ca78-3955-44a5-bd44-793370afef94",
            "amount":5000,
            "fares":{  
               "mdr":4,
               "fee":15
            }
         }
      ]
   }
}
```

**Response**

```json
{
    "MerchantOrderId": "22082019v5",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "12750233713",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        },
        "Phone": "552125553669",
        "Mobile": "5521996660078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Oswaldo Soares",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "0823033923354",
        "ProofOfSale": "20190823033923354",
        "AuthorizationCode": "664803",
        "SoftDescriptor": "teste",
        "Provider": "Simulado",
        "FraudAnalysis": {
            "Id": "d61abb4d-d5c5-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "AddressInfoCode": "COR-SA",
                "FactorCode": "F^H",
                "Score": 92,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST^NEG-SA",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default_lac",
                "VelocityInfoCode": "VEL-NAME^VELI-FP^VELI-TIP^VELL-FP^VELL-TIP^VELS-CC^VELS-EM^VELS-FP^VELS-TIP",
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
                    "ScreenResolutionField": "1366x768",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5665855625556351904011"
            },
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "TotalOrderAmount": 10000,
            "TransactionAmount": 0,
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
                        "Type": 0,
                        "Name": "Produto teste",
                        "Risk": 0,
                        "Sku": "563",
                        "OriginalPrice": 0,
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": 0,
                        "NonSensicalHedge": 0,
                        "ObscenitiesHedge": 0,
                        "PhoneHedge": 0,
                        "TimeHedge": 0,
                        "VelocityHedge": 0,
                        "GiftCategory": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151",
                "BrowserFingerPrint": "22082019v5"
            },
            "Shipping": {
                "Addressee": "Comprador Accept",
                "Method": 0
            },
            "FraudAnalysisReasonCode": 100,
            "Provider": "Cybersource",
            "IsRetryTransaction": false
        },
        "SplitPayments": [
            {
                "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount": 6000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                        "Amount": 5670
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 330
                    }
                ]
            },
            {
                "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount": 4000,
                "Fares": {
                    "Mdr": 4.0,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                        "Amount": 3825
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 175
                    }
                ]
            }
        ],
        "IsQrCode": false,
        "Amount": 10000,
        "ReceivedDate": "2019-08-23 15:39:15",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-23 15:39:23",
        "Status": 2,
        "IsSplitted": true,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "6",
        "PaymentId": "bc0758ca-245b-4c35-9b13-20e48417667e",
        "Type": "SplittedCreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "PUT",
                "Rel": "split",
                "Href": "https://splitsandbox.braspag.com.br/api/transactions/bc0758ca-245b-4c35-9b13-20e48417667e/split"
            },
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/bc0758ca-245b-4c35-9b13-20e48417667e"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/bc0758ca-245b-4c35-9b13-20e48417667e/void"
            }
        ]
    }
}
```

Abaixo, como ficaram as divisões e como foram sensibilizadas as agendas de cada participante.

![SplitSample003](https://developercielo.github.io/images/split/split003.png)

#### Request - Transação de Débito

Uma transação com um Cartão de Débito se efetua de uma forma semelhante a um Cartão de Crédito, porém, é obrigatório submetê-la ao processo de autenticação do banco correspondente e o nó referente a análise de fraude não deve ser informado.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "merchantorderid": "22082019v5",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "12750233713",
        "identitytype": "CPF",
        "Mobile": "5521996660078",
        "Phone": "552125553669",
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        }
    },
    "payment": {
        "type": "splitteddebitcard",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "ReturnUrl": "https://www.UrlDeRetornoDoLojista.com.br/",
        "debitcard": {
            "cardnumber": "5485904549811361",
            "holder": "yamilet taylor",
            "expirationdate": "12/2019",
            "securitycode": "756",
            "brand": "Visa",
            "savecard": "false"
        },
        "SplitPayments": [
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
```

**Response**

```json
{
    "MerchantOrderId": "22082019v5",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "12750233713",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        },
        "Phone": "552125553669",
        "Mobile": "5521996660078"
    },
    "Payment": {
        "DebitCard": {
            "CardNumber": "548590******1361",
            "Holder": "yamilet taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Provider": "Simulado",
        "AuthenticationUrl": "https://authenticationmocksandbox.cieloecommerce.cielo.com.br/CardAuthenticator/Receive/ae887a0c-5a6c-45ce-b196-029c419c9210",
        "SoftDescriptor": "teste",
        "Tid": "0823034725144",
        "ProofOfSale": "4725144",
        "Authenticate": true,
        "Recurrent": false,
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
        "Amount": 10000,
        "ReceivedDate": "2019-08-23 15:47:12",
        "ReturnUrl": "https://www.UrlDeRetornoDoLojista.com.br/",
        "Status": 0,
        "IsSplitted": true,
        "ReturnCode": "1",
        "PaymentId": "ae887a0c-5a6c-45ce-b196-029c419c9210",
        "Type": "SplittedDebitCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/ae887a0c-5a6c-45ce-b196-029c419c9210"
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
        "SubordinateMerchantId" :"f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
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

Como resposta, A API Cielo E-Commerce retornará um nó contento as regras de divisão enviadas e os valores a serem recebidos pelo Marketplace e seus Subordinados:

```json
"SplitPayments": [
    {
        "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
        "Amount": 10000,
        "Fares": {
            "Mdr": 5,
            "Fee": 0
        },
        "Splits": [                
            {
                "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                "Amount": 500,
            },
            {
                "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
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

**Request**  

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{api-split}/api/transactions/{PaymentId}/split</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
        "Amount": 6000,
        "Fares": {
            "Mdr": 5,
            "Fee": 30
        }
    },
    {
        "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
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
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                    "Amount": 5670
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
            "Amount": 4000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                    "Amount": 3825
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "Amount": 175
                }
            ]
        }
    ]
}
```

O nó referente ao Split no Split Pós-transacional, tanto no contrato de request quanto de response, é o mesmo retornado na divisão no Split Transacional, apresentado anteriormente.

> O Marketplace poderá informar as regras de divisão da transação mais de uma vez desde que esteja dentro do período de tempo permitido, que é de **20 dias** para **Cartão de Crédito** se estiver enquadrado no regime de pagamento padrão. 

### Consulta

Para consultar uma transação, utilize o próprio serviço de consulta da API Cielo E-Commerce.

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-cielo-ecommerce-consulta}/1/sales/{PaymentId}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

**Response**

```json
{
    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
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
                "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "Amount": 6000,
                "Fares": {
                    "Mdr": 5,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                        "Amount": 5670
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 330
                    }
                ]
            },
            {
                "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                "Amount": 4000,
                "Fares": {
                    "Mdr": 4,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                        "Amount": 3825
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 175
                    }
                ]
            }
        ]
    }
}
```

### Captura

Ao capturar uma transação do Split de Pagamentos, deve-se informar as regras de divisão da transação. Caso as regras não sejam informadas, o Split interpretará que todo o valor é referente ao próprio Marketplace.

#### Captura Total

Na captura total de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total da transação enviado no momento da autorização.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/capture</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "SplitPayments":[
        {
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            }
        },
        {
            "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
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
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                    "Amount": 5670
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
            "Amount": 4000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                    "Amount": 3825
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/capture?amount={amount}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

O exemplo abaixo captura parcialmente o valor de R$80,00 de uma transação realizada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/capture?amount=8000</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "SplitPayments":[
        {
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "Amount": 5000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            }
        },
        {
            "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
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
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "Amount": 5000,
            "Fares": {
                "Mdr": 5,
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
            "Amount": 3000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "9140ca78-3955-44a5-bd44-793370afef94",
                    "Amount": 2865
                },
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/capture?amount=8000</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
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
            "SubordinateMerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
            "Amount": 8000,
            "Fares": {
                "Mdr": 2,
                "Fee": 0
            },
            "Splits": [
                {
                    "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/void</span></aside>

```shell
x-www-form-urlencoded
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
    ]
}
```

#### Cancelamento Parcial

No cancelamento parcial, o somatório dos valores cancelados definidos para cada Subordinado deve ser igual ao valor do cancelamento parcial.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/void?amount={amount}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

No exempo abaixo é cancelado o valor de R$25,00 de uma transação capturada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce/1/sales/{PaymentId}/void?amount=2500</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
            "VoidedAmount": 1500
        },
        {
            "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
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
    ]
}
```

Não é obrigatório informar todos os Subordinados no cancelamento parcial. Pode-se informar apenas os subordinados para os quais se deseja cancelar totalmente ou parte do valor destinado aos mesmos na transação. No exemplo acima poderia ser informado, por exemplo, apenas o segundo subordinado, conforme exemplo abaixo:

```json
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId" :"9140ca78-3955-44a5-bd44-793370afef94",
            "VoidedAmount":1000
        }
     ]
}
```

> Ao cancelar parcialmente parte de um valor destinado a um Subordinado, é cancelada proporcionalmente também a Tarifa Fixa que o Marketplace tem a receber.

### Opções de Configuração da Transação

Em uma transação do Split, existem configurações opcionais que podem ser utilizadas para controlar alguns aspectos.

#### Origem do Desconto das Taxas

Por padrão, as taxas e tarifas fixas do Split são descontadas do valor de comissão do Master, porém é possível que o desconto seja feito da parte da venda do Master.

> Para que a opção de desconto da parte da venda seja possível, o Master deve possuir venda na transação.

A opção pode ser utilizada no momento da divisão transacional e pós-transacional. Também é possível deixar pré-configurada a opção a ser utilizada. Para utilizar a pré-configuração, é necessário entrar em contato com o suporte do Split para que ela seja criada, removida ou atualizada. A pré-configuração só será utilizada caso nenhum valor seja informado na requisição.

No caso de uma transação criada com uma forma de desconto, o mesmo será utilizado em todas as requisições posteriores. É possível mudar a forma de desconto através da redivisão (divisão pós-transacional), informando o tipo desejado. Uma vez que o tipo é mudado, o novo tipo é usado em todas as requisições posteriores ou até que seja mudado novamente.

> Só é possível mudar o tipo de desconto enquanto ainda for possível redividir a transação.

##### Tipos de Desconto Possíveis

| Tipo | Descrição |
|-|-|
| `Commission` | Com esta opção, o desconto será feito sobre o valor de comissão que o Master tem a receber na transação. |
| `Sale` | Com esta opção, o desconto será feito sobre o valor de venda que o Master tem a receber na transação. |

##### No Momento Transacional

Transação no valor de **R$100,00** com o nó contendo as regras de divisão e o Marketplace participando da venda.

**Taxa Braspag**: 2% MDR + R$0,30 Tarifa Fixa.  
**Taxa Marketplace com o Subordinado 01**: 5% MDR, já embutindo os 2% do MDR Braspag + 0,30 Tarifa Fixa.
**Taxa Marketplace com o Subordinado 02**: 4% MDR, já embutindo os 2% do MDR Braspag + 0,15 Tarifa Fixa.

> Desconto sendo aplicado sobre a comissão.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "MerchantOrderId": "2014111701",
    "Customer": {
        "Name": "Comprador"
    },
    "Payment": {
        "Type": "SplittedCreditCard",
        "Amount": 10000,
        "Installments": 1,
        "SoftDescriptor": "Marketplace",
        "Capture": true,
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa"
        },
        "SplitTransaction": {
            "MasterRateDiscountType": "Commission"
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
        "SplitTransaction": {
            "MasterRateDiscountType": "Commission"
        },
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

Com a mesma transação:

> Desconto sendo aplicado sobre a venda.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "MerchantOrderId": "2014111701",
    "Customer": {
        "Name": "Comprador"
    },
    "Payment": {
        "Type": "SplittedCreditCard",
        "Amount": 10000,
        "Installments": 1,
        "SoftDescriptor": "Marketplace",
        "Capture": true,
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa"
        },
        "SplitTransaction": {
            "MasterRateDiscountType": "Sale"
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
        "SplitTransaction": {
            "MasterRateDiscountType": "Sale"
        },
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

##### No Momento Pós-Transacional

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{api-split}/api/transactions/{PaymentId}/split?masterRateDiscountType=Sale</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
        "Amount": 6000,
        "Fares": {
            "Mdr": 5,
            "Fee": 30
        }
    },
    {
        "SubordinateMerchantId" :"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
        "Amount": 4000
    }
]
```

**Response**

```json
{
    "PaymentId": "c96bf94c-b213-44a7-9ea3-0ee2865dc57e",
    "MasterRateDiscountType": "Sale",
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
            "SubordinateMerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
            "Amount": 4000,
            "Fares": {
                "Mdr": 2,
                "Fee": 0
            },
            "Splits": [
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "Amount": 4000
                }
            ]
        }
    ]
}
```

#### Liberação de Transação para Antecipação

No Split de Pagamentos, para os clientes que estejam habilitados e optem por fazer uso de antecipações, existe a possibilidade de determinar quais transações podem participar de operações de antecipação.

O comportamento padrão é que todas as transações possam fazer parte de operações de antecipação, porém o Master pode determinar quais transações e quando estarão disponíveis.

Existem 4 momentos em que se pode liberar uma transação para participar de operações de antecipação:
1. Na criação da transação, usando valor pré-configurado;
2. Na criação da transação, usando valor passado através do request;
3. Na redivisão pós-transacional da transação;
4. Através de endpoint específico para liberação de transação para antecipação.

> Uma vez que a transação está liberada para participar de operações de antecipação, a mesma não pode mais ser bloqueada!

##### Usando valor pré-configurado

Entre em contato com o suporte para criar, atualizar ou remover a configuração com o estado (liberado ou bloqueado) com o qual a transação deve ser criada caso nenhum valor seja passado no request.

##### Usando valor passado através do request

Nome do campo: ReleasedToAnticipation

| Valor | Descrição |
|-|-|
| **true** | Com esta opção, a transação ficará liberada para antecipação e não poderá mais ser bloqueada. |
| **false** | Com esta opção, a transação estará bloqueada para ser usada em operações de antecipação e poderá ser liberada em um momento posterior. |

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "MerchantOrderId": "2014111701",
    "Customer": {
        "Name": "Comprador"
    },
    "Payment": {
        "Type": "SplittedCreditCard",
        "Amount": 10000,
        "Installments": 1,
        "SoftDescriptor": "Marketplace",
        "Capture": true,
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa"
        },
        "SplitTransaction": {
            "ReleasedToAnticipation": false
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
        "SplitTransaction": {
            "ReleasedToAnticipation": false
        },
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

##### No Momento Pós-Transacional

**Request**

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{api-split}/api/transactions/{PaymentId}/split?releasedToAnticipation=true</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
        "Amount": 6000,
        "Fares": {
            "Mdr": 5,
            "Fee": 30
        }
    },
    {
        "SubordinateMerchantId" :"e4db3e1b-985f-4e33-80cf-a19d559f0f60",
        "Amount": 4000
    }
]
```

**Response**

```json
{
    "PaymentId": "c96bf94c-b213-44a7-9ea3-0ee2865dc57e",
    "MasterRateDiscountType": "Sale",
    "ReleasedToAnticipation": true,
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
            "SubordinateMerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
            "Amount": 4000,
            "Fares": {
                "Mdr": 2,
                "Fee": 0
            },
            "Splits": [
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "Amount": 4000
                }
            ]
        }
    ]
}
```

##### Usando endpoint de liberação para antecipação

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/anticipation-api/{PaymentId}/release-to-anticipation</span></aside>

**Response**

<aside class="request"><span class="method post">200 OK</span></aside>

## Boleto Braspag

### Boleto Registrado

Com o objetivo de promover maior controle e segurança ao transacional de boletos no e-commerce e garantir mais confiabilidade e comodidade aos usuários, a Febraban em conjunto com os Bancos lançou a Nova Plataforma de Cobrança.

A partir de 21 de julho de 2018 todos os boletos emitidos no e-commerce, obrigatoriamente, terão de ser registrados. [Clique aqui](https://portal.febraban.org.br/pagina/3150/1094/pt-br/servicos-novo-plataforma-boletos) para acessar o comunicado completo.

### Criando uma transação de Boleto

Para gerar um boleto em Sandbox, é necessár Tokenio fornecer dados do comprador como CPF e endereço. Abaixo temos um exemplo de como criar um pedido com o meio de pagamento boleto.

#### Criando uma transação  

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Content-Type: application/json"
--header "Authorization: Bearer Token"

{  
    "MerchantOrderId":"2017091101",
    "Customer":
    {  
        "Name":"Nome do Comprador",
        "Identity":"12345678909",
        "IdentityType":"CPF",
        "Address":{  
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27 andar",
            "ZipCode":"12345987",
            "City":"Sao Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
        }
    },
    "Payment":
    {  
     "Provider":"Braspag",
     "Bank": "BancoDoBrasil",
     "Type":"Boleto",
     "Amount":10000,
     "BoletoNumber":"2017091101",
     "Assignor": "Empresa Teste",
     "Demonstrative": "Desmonstrative Teste",
     "ExpirationDate": "2017-12-31",
     "Identification": "12346578909",
     "Instructions": "Aceitar somente até a data de vencimento.",
     "DaysToFine": 1,
     "FineRate": 10.00000,
     "FineAmount": 1000,
     "DaysToInterest": 1,
     "InterestRate": 5.00000,
     "InterestAmount": 500
    }
}
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave Publica para Autenticação Dupla na Braspag|
|`MerchantOrderId`|Texto|vide tabela abaixo|Sim|Numero de identificação do Pedido. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Name`|Texto|vide tabela abaixo|Sim|Nome do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Identity`|Texto |14 |Sim|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Sim|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Address.Street`|Texto|vide tabela abaixo|Sim|Endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.Number`|Texto|vide tabela abaixo|Sim|Número endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.Complement`|Texto|vide tabela abaixo|Não|Complemento do endereço de contato do Comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.ZipCode`|Texto|8|Sim|CEP do endereço de contato do comprador|
|`Customer.Address.District`|Texto|vide tabela abaixo|Sim|Bairro do endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.City`|Texto|vide tabela abaixo|Sim|Cidade do endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço de contato do comprador|
|`Customer.Address.Country`|Texto|35|Sim|Pais do endereço de contato do comprador|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento de Boleto (Braspag)|
|`Payment.Bank`|Texto|15|Sim|Nome do Banco que o boleto será emitido|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento. No caso "Boleto"|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (deve ser enviado em centavos)|
|`Payment.BoletoNumber`|Texto |vide tabela abaixo|Não|Número do Boleto ("Nosso Número"). Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o Provider utilizado (vide tabela abaixo|
|`Payment.Assignor`|Texto |200|Não|Nome do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Demonstrative`|Texto |vide tabela abaixo|Não|Texto de Demonstrativo. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Payment.ExpirationDate`|Date |AAAA-MM-DD|Não|Dias para vencer o boleto. Caso não esteja previamente cadastrado no meio de pagamento, o envio deste campo é obrigatório. Se enviado na requisição, sobrepõe o valor configurado no meio de pagamento.|
|`Payment.Identification`|Texto |14 |Não|CNPJ do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Instructions`|Texto |vide tabela abaixo|Não|Instruções do Boleto. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Payment.NullifyDays`|Número |2 |Não|Prazo para baixa automática do boleto. O cancelamento automático do boleto acontecerá após o número de dias estabelecido neste campo contado a partir da data do vencimento. Ex.: um boleto com vencimento para 15/12 que tenha em seu registro o prazo para baixa de 5 dias, poderá ser pago até 20/12, após esta data o título é cancelado. *Recurso válido somente para boletos registrados do Banco Santander.|
|`Payment.DaysToFine`|Número |15 |Não|Opcional e somente para provider Bradesco2. Quantidade de dias após o vencimento para cobrar o valor da multa, em número inteiro. Ex: 3|
|`Payment.FineRate`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor da multa após o vencimento em percentual, com base no valor do boleto (%). Permitido decimal com até 5 casas decimais. Não enviar se utilizar FineAmount. Ex: 10.12345 = 10.12345%|
|`Payment.FineAmount`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor da multa após o vencimento em valor absoluto em centavos. Não enviar se utilizar FineRate.  Ex: 1000 = R$ 10,00|
|`Payment.DaysToInterest`|Número |15 |Não|Opcional e somente para provider Bradesco2.Quantidade de dias após o vencimento para iniciar a cobrança de juros por dia sobre o valor do boleto, em número inteiro. Ex: 3|
|`Payment.InterestRate`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor de juros mensal após o vencimento em percentual, com base no valor do boleto (%). O valor de juros é cobrado proporcionalmente por dia (Mensal dividido por 30). Permitido decimal com até 5 casas decimais. Não enviar se utilizar InterestAmount. Ex: 10.12345|
|`Payment.InterestAmount`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor absoluto de juros diário após o vencimento em centavos. Não enviar se utilizar InterestRate. Ex: 1000 = R$ 10,00|

**Response**

```json
{
    "MerchantOrderId": "2017091101",
    "Customer": {
        "Name": "Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "Sao Paulo",
            "State": "SP",
            "Country": "BRA",
            "District": "Alphaville"
        }
    },
    "Payment": {
        "Instructions": "Aceitar somente até a data de vencimento.",
        "ExpirationDate": "2020-12-31",
        "Demonstrative": "Desmonstrative Teste",
        "Url": "https://transactionsandbox.pagador.com.br/post/pagador/reenvia.asp/4b97aa02-9bf2-4e06-8197-c099b861e226",
        "BoletoNumber": "0000000248",
        "BarCodeNumber": "",
        "DigitableLine": "",
        "Assignor": "Empresa Teste",
        "Address": "N/A, 1",
        "Identification": "12346578909",
        "ProviderReturnCode": "0",
        "ProviderReturnMessage": "Transação criada com sucesso",
        "Bank": 4,
        "Amount": 10000,
        "ReceivedDate": "2020-03-08 08:19:27",
        "Provider": "Braspag",
        "Status": 1,
        "IsSplitted": false,
        "ReturnMessage": "Transação criada com sucesso",
        "ReturnCode": "0",
        "PaymentId": "4b97aa02-9bf2-4e06-8197-c099b861e226",
        "Type": "Boleto",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/4b97aa02-9bf2-4e06-8197-c099b861e226"
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`PaymentId`|Campo Identificador do Pedido. |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`ExpirationDate`|Data de expiração. |Texto |10 |2014-12-25 |
|`Url`|URL do Boleto gerado |string |256 |https://.../pagador/reenvia.asp/8464a692-b4bd-41e7-8003-1611a2b8ef2d |
|`BoletoNumber`|"NossoNumero" gerado. |Texto|50 |2017091101 |
|`BarCodeNumber`|Representação numérica do código de barras. |Texto |44 |00091628800000157000494250100000001200656560 |
|`DigitableLine`|Linha digitável. |Texto |256 |00090.49420 50100.000004 12006.565605 1 62880000015700 |
|`Address`|Endereço do Loja cadastrada no banco |Texto |256 |Av. Teste, 160 |
|`Status`|Status da Transação. |Byte | 2 | Ex. 1 |

## Antifraude

O Split de Pagamentos possui uma plataforma de antifraude que utiliza inteligência artificial para minimizar os riscos de fraude e chargeback.

> No modelo de negócio do Split, todo chargeback é repassado ao Marketplace, que pode ou não repassá-lo para os seus subordinados. Portanto, é de suma importância que a plataforma de antifraude esteja corretamente integrada e configurada.

### Fluxo transacional

A integração com o antifraude se dá através do próprio fluxo transacional, na mesma requisição da transação.

* Cliente realiza uma transação.
* A anállise de fraude é realizada.
* Caso a análise de fraude recomende rejeitar a transação, o fluxo é interrompido.
* A transação é executada normalmente.

Para utilizar o sistema de antifraude, é necessário incluir o bloco `Payment.FraudAnalysis`. Em casos de uma compra remota ou com entrega, também deverão ser incluidos os blocos `Customer.DeliveryAddress` e/ou `Customer.BillingAddress`.

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|--|--|--|--|--|
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
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `SplittedCreditCard` ou `SplittedDebitCard`|
|`Payment.Amount`|Inteiro|15|Sim|Valor do pedido em centavos. Ex.: r$ 1.559,85 = 155985|
|`Payment.Capture`|Boleano|-|Sim|Parâmetro para capturar a transação. Caso o valor seja `False` a transação será apenas autorizada. Se for `True`, a captura será realizada automaticamente após a autorização.|
|`Payment.ServiceTaxAmount`|Inteiro|15|Não|Exclusivo para companhias aéreas - Montante do valor da autorização que deve ser destinado à taxa de serviço  |Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Installments`|Inteiro|2|Sim|Número de parcelas do pedido|
|`Payment.SoftDescriptor`|Texto|13|Sim|Texto que será impresso na fatura do cartão de crédito do portador. Na fatura, o sofdescriptor pode ser encurtado de acordo com as regras da adquirente e bandeira.|
|`Payment.CreditCard`|-|-|Sim|Nó contendo as informações do cartão|
|`Payment.CreditCard.CardNumber`|Texto|19|Sim|Número do cartão do comprador|
|`Payment.CreditCard.Holder`|Texto|50|Sim|Nome do comprador impresso no cartão|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão composta por MM/AAAA|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`Payment.CreditCard.Brand`|Texto|10|Sim|Bandeira do cartão  |Possíveis valores: Visa / Master / Amex / Elo / Aura / JCB / Diners / Discover|
|`Payment.SaveCard`|Boleano|-|Não|Parâmetro para salvar os dados do cartão como token. Caso seja passado com o valor `True`, O parâmetro `CardToken` será retornado no `Response` sendo seu valor o token gerado que poderá ser utilizado em futuras transações.|
|`Payment.FraudAnalysis`|-|-|-|Nó contendo as informações para Análise de Fraude|
|`Payment.FraudAnalysis.Provider`|Texto|12|Sim|Identifica o provedor da solução de análise de fraude  |Possíveis valores: `Cybersource`|
|`Payment.FraudAnalysis.TotalOrderAmount`|Inteiro|15|Não|Valor total do pedido em centavos, podendo ser diferente do valor da transação  |Ex.: Valor do pedido sem a taxa de entrega|
|`Payment.FraudAnalisys.Browser`|-|-|Sim|-|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|255|Sim|Ip do comprador|
|`Payment.FraudAnalysis.Browser.BrowserFingerPrint`|Texto|6010|Sim|Impressão digital de dispositivos e geolocalização real do IP do comprador [Configuração do Fingerprint](https://braspag.github.io//manual/antifraude#cybersource)|
|`Payment.FraudAnalysis.Cart`|Lista|-|Não|Nó contendo as informações do carrinho de compras para análise de fraude|
|`Payment.FraudAnalysis.Cart.Items[].Name`|Texto|50|Não|Nome do produto|
|`Payment.FraudAnalysis.Cart.Items[].Sku`|Texto|12|Não|Sku do produto|
|`Payment.FraudAnalysis.Cart.Items[].UnitPrice`|Inteiro|15|Não|Preço original do produto em centavos  |Ex.: R$ 1.559,85 = 155985|
|`Payment.FraudAnalysis.Cart.Items[].Quantity`|Inteiro|-|Não|Quantidade do produto|
|`Payment.FraudAnalysis.MerchantDefinedFields`|Lista|-|Sim|Nó contendo dados adicionais para análise de fraude [Tabela de Merchant Defined Data](https://braspag.github.io//manual/antifraude#tabela-31-merchantdefineddata-(cybersource))|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Id`|Inteiro|-|Sim|Identificador de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Value`|Texto|255|Sim|Valor de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.Shipping`|-|-|Não|Nó contendo informações adicionais da entrega do pedido para análise de fraude|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|61|Não|Nome e sobrenome do destinatário|

### Configuração do Fingerprint

Importante componente da análise de fraude, o Fingerprint é um Javascript que deve ser inserido no seu site para capturar dados importantes como: IP do comprador, versão do browser, sistema operacional etc.
Muitas vezes, somente os dados do carrinho não são suficientes para garantir uma análise assertiva. Os dados coletados pelo Fingerprint complementam a análise e garantem que sua loja está mais protegida.

Será necessário adicionar duas tags, a *script* dentro da tag *head* para uma performance correta e a *noscript* dentro da tag *body*, para que a coleta dos dados do dispositivo seja realizada mesmo se o Javascript do browser estiver desabilitado.

<aside class="warning">Se os 2 segmentos de código não forem colocados na página de checkout, os resultados da análise de fraude podem não ser precisos.</aside>

**Variáveis**
Existem duas variáveis a serem preenchidas na URL do Javascript. O `org_id` e o `session_id`. O `org_id` é um valor predefinido conforme tabela abaixo, já o `session_id` é composto pela concatenação dos parâmetros `ProviderMerchantId` e `Customer.BrowserFingerprint`, conforme exemplo abaixo:

|Variável|Descrição|
|:-|:-|
|`org_id`|para Sandbox = 1snn5n9w <br/> para Produção = k8vif92e|
|`session_id`|Concatenação das variáveis `ProviderMerchantId` e `Customer.BrowserFingerprint` <br/> `ProviderMerchantId` = Identificador da sua loja na Cybersource. Caso não possua, entre em contato com a Braspag <br/> `Customer.BrowserFingerprint` = Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas.|

**Aplicação**

O modelo do Javascript é o seguinte:

```html
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="https://h.online-metrix.net/fp/tags.js?org_id=1snn5n9w&session_id=braspag123456789"></script>
</head>
<body>
    <iframe style="width: 100px; height: 100px; border:0; position:absolute;top:-5000px;" src="https://h.online-metrix.net/fp/tags.js?org_id=1snn5n9w&session_id=braspag123456789"></iframe>
</body>
</html>
```

As variáveis, quando devidamente preenchidas, forneceriam uma URL semelhante ao exemplo abaixo:

![Exemplo Url](https://braspag.github.io/images/braspag/af/urldfpaf.png)

<aside class="warning">Certifique-se de copiar todos os dados corretamente e de ter substituído as variáveis corretamente pelos respectivos valores.</aside>

** Integração em aplicativos mobile **

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

```shell
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

```shell
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

```shell
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

> É possível solicitar que todo chargeback seja repassado para o subordinado por padrão, mediante abertura de chamado.

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

## Anexos

### Lista de Status da Transação

Status retornados pela API

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
|20|Scheduled|Cartão de crédito|Recorrência agendada|

### Lista de Status do AntiFraude

| Código | Descrição  |
|--------|------------|
| 0      | Unknown    |
| 1      | Accept     |
| 2      | Reject     |
| 3      | Review     |
| 4      | Aborted    |
| 5      | Unfinished |

### Lista de HTTP Status Code

| HTTP Status Code | Descrição             |
|------------------|-----------------------|
| 200              | OK                    |
| 400              | Bad Request           |
| 404              | Resource Not Found    |
| 500              | Internal Server Error |