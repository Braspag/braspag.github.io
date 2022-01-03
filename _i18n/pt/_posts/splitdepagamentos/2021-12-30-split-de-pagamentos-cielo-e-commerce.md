---
layout: manual
title: Split de Pagamentos - 3.0 Cielo
description: Manual de Integração do Split de Pagamentos
search: true
translated: true
toc_footers: false
categories: manual
sort_order: 1
hub_visible: false
tags:
---

# Visão geral

![FluxoGeralSplit](https://developercielo.github.io/images/split/split1-fluxo-geral.png)

O **Split de Pagamentos é um serviço de subadquirência para marketplaces e outros modelos de negócio que precisam dividir o valor de uma venda entre diferentes participantes. Funciona tanto para e-commerce quanto para mundo físico.

O Split de Pagamentos atua em todo o fluxo de venda e pagamento:

![SplitSubadquirencia](https://developercielo.github.io/images/split/split2-subadquirencia.png)

## Quais modelos de negócios podem usar o Split de Pagamentos?

* **Marketplaces**, que permitem que uma pessoa possa comprar produtos de vendedores diferentes em uma única compra (mesmo carrinho);
* **Franquias**, que permitem que um produto comprado pelo e-commerce da marca, por exemplo, seja oriundo do estoque de uma unidade franqueada;
* **Mundo físico**, que permite que uma venda paga pela máquina de cartão seja dividida entre diferentes fornecedores;
* Além de serviços de entrega, consultores porta a porta, agências de turismo, aplicativos e ticketeiras, entre outros.

## Principais Benefícios

* Comercializar produtos de diferentes vendedores em uma única compra;
* Participar ou não da venda;
* Ter um comissionamento flexível; 
* Ter controle de todo o fluxo da venda, da captura até a liquidação e conciliação;
* Antecipar seus recebíveis.

## Segurança para as suas transações

Com o Split de Pagamentos da Braspag, você tem acesso a um pacote de soluções para a segurança do comprador, do seu e-commerce e dos seus vendedores:
* **VerifyCard**: composto pelo Zero Auth, que identifica se um cartão é válido, e pelo Consulta BIN, que retorna características do cartão, como tipo e bandeira;
* **Autenticação 3DS 2.0**: é um modelo de autenticação que permite determinar se um comprador é, de fato, o portador do cartão;
* **Antifraude***: permite a análise de fraude de cada transação em parceria com a Cybersource;
* **Cartão Protegido**: permite o armazenamento seguro de cartões de crédito e débito, de acordo com as normas do PCI, e contribui para melhorar a taxa de conversão do seu e-commerce;
* **Silent Order Post**: possibilita o envio de dados do pagamento do cliente de forma segura, armazenando os dados no ambiente da Braspag, que conta com a certificação PCI DSS 3.2. O Silent Order Post é ideal para a empresa que não possui estrutura para cumprir todos os requisitos de segurança do PCI DSS no uso de cartões de crédito ou, também, para o lojista que prefira concentrar seus esforços em outros elementos do negócio.

> O Antifraude está sujeito à uma taxa por transação analisada. Consulte a área [Comercial da Braspag](https://suporte.braspag.com.br/hc/pt-br) para saber mais.

# Como funciona

Os possíveis participantes de uma venda são: master, subordinado e Split de Pagamentos.

|PARTICIPANTES|DESCRIÇÃO|
|---|---|
|**Master**| É o responsável pelo carrinho.<br>Possui acordos com subordinados que fornecem os produtos presentes no carrinho.<br>Define as taxas a serem descontadas sobre a venda de cada subordinado.<br>Pode participar de uma venda fornecendo seus próprios produtos.|
|Subordinado| É o fornecedor dos produtos que compõem o carrinho.<br>Recebe parte do valor da venda, descontadas as taxas acordadas com o master.|
|Split de Pagamentos| É responsável pelo fluxo transacional, funcionando como uma subadquirente.<br>Define as taxas a serem descontadas sobre o valor total da venda realizada pelo master.<br>É responsável pela liquidação dos pagamentos para os subordinados e master.|

Ao contratar o Split de Pagamentos, você (usuário master) receberá as credenciais para integração com as nossas APIs (`MerchantId`, `MerchantKey` e `ClientSecret`), além do seu login no portal Backoffice Split.

> Nesta documentação, mostramos o passo a passo da integração via API. Para saber como usar o Backoffice Split, consulte os [artigos na nossa página de Suporte](https://suporte.braspag.com.br/hc/pt-br).

Antes de começar a transacionar, você precisa cadastrar os seus subordinados. Para isso, leia a documentação Cadastro de Subordinados.

Como master, o primeiro passo é fazer a sua integração com a API Cielo E-commerce 3.0.

Para cada transação, você poderá informar como será a divisão entre cada participante, podendo ser no momento de captura (Split transacional) ou em um momento posterior (Split pós-transacional).

Com a transação capturada, a Braspag calcula o valor destinado a cada participante e repassa esses valores para cada envolvido na transação. O **Regime de Pagamento** é o prazo estabelecido para liquidação de acordo com o produto (crédito ou débito) e bandeira.

* **Crédito**: em até 31 dias.
* **Crédito Parcelado**: 1ª parcela em até 31 dias, demais a cada 30 dias.
* **Débito**: em até 2 dias úteis.
* **Boleto**: em até 2 dias úteis após a confirmação do pagamento.

Na divisão de uma transação, você deve informar:

* Os **identificadores (MerchantId) dos subordinados e do master**, caso também participe da venda;
* Os **valores correspondentes a cada participante**. O somatório deverá ser igual ao valor total da transação;
* As **taxas** a serem aplicadas sobre o valor de cada subordinado destinadas ao master. Essas taxas deverão ser acordadas previamente entre master e subordinado.

Quando o master participa da divisão, passa a ter também o papel de subordinado e a ter seus próprios produtos no carrinho.

## Taxas

As taxas acordadas entre os participantes podem ser um MDR (%) e/ou uma Tarifa Fixa (R$), e devem ser definidas no momento do cadastro do master e dos seus subordinados junto à Braspag.

As taxas podem ser enviadas no momento transacional (captura) ou pós-transacional. Caso não sejam enviadas, o Split vai considerar as taxas cadastradas e acordadas previamente entre os participantes.

>**MDR (Merchant Discount Rate)**: percentual a ser descontado do valor de uma transação, definido por produto (crédito/débito/boleto), bandeira e faixa de parcelamento.<br>
>**Tarifa fixa**: também chamada de fee transacional. Valor em centavos a ser cobrado por transação capturada. É descontado no momento da “montagem” da agenda financeira.

### Braspag

A Braspag acordará um MDR e/ou uma Tarifa Fixa com o master, que serão descontadas do valor total de cada transação. 

O master, de conhecimento destas taxas, negociará também um MDR e/ou uma Tarifa Fixa com cada Subordinado. Se desejar, pode embutir o MDR e/ou Tarifa acordados junto à Braspag.

![SplitTaxas](https://developercielo.github.io/images/split/split3-taxas.png)
 
* A Tarifa Fixa acordada entre o master e a Braspag não é aplicada no valor total da transação, ou seja, não entra no cálculo da divisão, e é debitada diretamente do montante que o master tem para receber junto à Braspag. 
* O MDR entra no cálculo de divisão da transação, considerando o valor total da transação, já que o MDR deve estar embutido no MDR acordado entre o master e seus subordinados.

> **Taxa Braspag**: MDR Braspag (%) + Tarifa Fixa Braspag (R$)

### Master

O master é responsável por acordar as taxas a serem cobradas dos seus subordinados, definindo um MDR maior ou igual ao MDR definido com a Braspag, e uma Tarifa Fixa, que é opcional.

> Taxa Master: MDR Master (%) + Tarifa Fixa (R$), na qual o MDR Master (%) pode embutir o MDR Braspag (%).

### Exemplo da divisão e taxas

Uma transação de R$100,00, realizada por um master com participação do subordinado A.

![SplitEx1](https://developercielo.github.io/images/split/split4-exemplo1-taxas.png)
 
Neste exemplo, foram assumidos os seguintes acordos:

* **Taxa Braspag**: 2% de MDR + R$0,10 de Tarifa Fixa. 
* **Taxa Master**: 4% de MDR (embutindo os 2% de MDR da Braspag) + R$0,30 de Tarifa Fixa.

Após a divisão, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado:**

* Crédito de R$96,00 (R$100,00 da transação menos R$4,00 de MDR); 
* Débito de R$0,30 de Tarifa Fixa.

O total a receber pelo subordinado será R$95,70.

**Master:**

* Crédito de R$2,30 (R$4,00 de MDR mais R$0,30 de Tarifa Fixa do subordinado, menos R$2,00 de MDR da Braspag);
* Débito de R$0,10 (Tarifa Fixa acordada com a Braspag).

O total a receber pelo Master será R$2,20.

**Braspag:**

* Crédito de R$2,10 (R$2,00 de MDR aplicado sobre o valor total da transação mais R$0,10 de Tarifa Fixa acordada com o Master).

O total a receber pela Braspag será R$2,10.

### Bandeiras

As bandeiras suportadas pelo Split são:

* Visa;
* Mastercard;
* Elo;
* Amex;
* Hipercard;
* Diners;
* Discover.

# Ambientes

O Split de Pagamentos é parte da API Cielo E-Commerce. As operações transacionais continuam sendo realizadas pela API Cielo E-commerce, sendo necessárias poucas alterações para integração do Split de Pagamentos.

## Sandbox

Solicite suas credenciais para o ambiente de teste com o nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br).

|API|URL|DESCRIÇÃO|
|---|---|---|
|Braspag OAUTH2 Server|https://authsandbox.braspag.com.br/| Autenticação.|
|API Cielo E-commerce|https://apisandbox.cieloecommerce.cielo.com.br/|Envio das requisições de transações de crédito, débito e boleto, com ou sem o nó da divisão.|
|API Cielo E-commerce (Consultas)|https://apiquerysandbox.cieloecommerce.cielo.com.br/| Consulta de transações.|
|API Split |https://splitsandbox.braspag.com.br/| Divisão da transação e desconto de taxas no momento pós-transacional.|

## Produção

Você receberá as credenciais para o ambiente de produção durante o onboarding.

|API|URL|DESCRIÇÃO|
|---|---|---|
|Braspag OAUTH2 Server|https://auth.braspag.com.br/|Autenticação.|
|API Cielo E-commerce|https://api.cieloecommerce.cielo.com.br/|Envio das requisições de transações de crédito, débito e boleto, com ou sem o nó da divisão.|
|API Cielo E-commerce (Consultas)|https://apiquery.cieloecommerce.cielo.com.br/| Consulta de transações.|
|API Split|https://split.braspag.com.br/|Divisão da transação e desconto de taxas no momento pós-transacional.|

# Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), no qual é necessário primeiramente obter um token de acesso utlizando suas credenciais, e posteriormente enviar o token de acesso à API Cielo E-Commerce e à API do Split.

Para obter um token de acesso:

1. Concatene o MerchantId e ClientSecret: `MerchantId:ClientSecret`;  
2. Codifique o resultado da concatenação em Base64;  
3. Realize uma requisição ao servidor de autorização.

![SplitBPAuth](https://developercielo.github.io/images/split/split5-auth.png)

#### Requisição  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

#### Resposta

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O MerchantId é o mesmo utilizado na integração com a API Cielo E-Commerce. O ClientSecret deve ser obtido junto à Braspag.

O token retornado (access_token) deverá ser utilizado em toda requisição à API Cielo E-commerce ou à API Split como uma chave de autorização. O token de acesso possui uma validade de 20 minutos e é necessário gerar um novo token toda vez que a validade expirar.  

# Integração

## Autorização

A autorização de uma transação no Split de Pagamentos deve ser realizada através da API Cielo E-Commerce, seguindo as mesmas requisições do [Manual de Integração API Cielo E-commerce](https://developercielo.github.io/manual/cielo-ecommerce).

## Fluxo transacional padrão

Veja um exemplo do fluxo transacional padrão no Split de Pagamentos.

![FluxoSplitPadrao](https://developercielo.github.io/images/split/split6-fluxo-transacional-padrao.png)

A próxima seção apresentará exemplos de transações de crédito, débito e boleto. É importante lembrar que nas respostas das requisições das transações, o Split retornará a divisão do valor da venda, MDR e taxa fixa, mas o desconto das taxas será feito posteriormente, na agenda financeira.

> Em todos os exemplos a seguir a divisão da transação segue o modelo de Split Transacional, ou seja, a divisão é solicitada no momento da captura.

### Transação de crédito

Ao informar um tipo de pagamento referente ao Split, a API Cielo E-Commerce automaticamente identifica que a transação é referente ao Split de Pagamentos e realiza o fluxo 
transacional através da Braspag.

Caso a transação enviada seja marcada para captura automática, é necessário enviar o nó contendo as regras de divisão; caso contrário, a transação será dividida entre a Braspag e o 
master. Posteriormente, é permitido que o master envie novas regras de divisão para a transação através da API Split, desde que esteja dentro do período permitido.

Veja a seguir exemplos de requisições e respostas para transações de crédito.

#### Transação de crédito com todos os campos possíveis

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

##### Requisição

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
                        "unitprice": 10000
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

##### Resposta

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

#### Transação de crédito sem o nó da divisão 

Veja uma requisição de transação no valor de R$100,00, com captura automática, sem o nó contendo as regras de divisão.

> **Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.

Neste caso, o master recebe o valor da transação descontado o MDR acordado com a Braspag. Como apresentado anteriormente, a Tarifa Fixa acordada entre o master e a Braspag é sensibilizada diretamente na agenda de ambas as partes.

**Master:**

* Crédito de R$98,00 (R$100,00 da transação menos R$2,00 de MDR da Braspag);
* Débito de R$0,10 (Tarifa Fixa acordada com a Braspag).

O **total a receber** pelo master será **R$97,90**.
 
**Braspag:**

* Crédito: R$2,10 (MDR aplicado sobre o valor total da transação mais R$0,10 (Tarifa Fixa acordada com o Master).

O **total a receber** pela Braspag será **R$2,10**.

O valor total a receber pelo master está representado na figura a seguir.

![SplitEx2](https://developercielo.github.io/images/split/split7-exemplo2-sem-no.png)

##### Requisição

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
                        "unitprice": 10000
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

##### Resposta

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

#### Transação de crédito com o nó da divisão  

A próxima requisição corresponde a uma transação no valor de R$100,00 com o nó contendo as regras de divisão. Neste exemplo foram assumidas as seguintes taxas:

>**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.<br>
>**Taxa Master com o Subordinado A**: 5% MDR (embutindo os 2% do MDR Braspag) + 0,30 Tarifa Fixa.<br>
>**Taxa Master com o Subordinado B**: 4% MDR (embutindo os 2% do MDR Braspag) + 0,15 Tarifa Fixa.

**Subordinado A:**

* Crédito de R$57,00 (R$60,00 da transação menos R$3,00 de MDR);
* Débito de R$0,30 de Tarifa Fixa.

O **total a receber** pelo subordinado A será **R$56,70**.

**Subordinado B:**

* Crédito de R$38,40 (R$40,00 da transação menos R$1,60 de MDR);
* Débito de R$0,15 de Tarifa Fixa.

O total a receber pelo subordinado B será **R$38,25**.

**Master:**

Crédito de R$3,05 (R$3,00 de MDR + R$0,30 de Tarifa Fixa do subordinado A, somados com R$1,60 de MDR + R$0,15 de Tarifa Fixa do subordinado B, menos R$2,00 de MDR Braspag);
Débito de R$0,10 (Tarifa Fixa acordada com a Braspag).

O **total a receber** pelo Master será **R$2,95**.

**Braspag:**

* Crédito de R$2,10 (R$2,00 de MDR aplicado sobre o valor total da transação mais R$0,10 de Tarifa Fixa acordada com o Master).

O **total a receber** pela Braspag será **R$2,10**.

As divisões e o valor total a receber de cada participante estão na figura a seguir.

![SplitEx3](https://developercielo.github.io/images/split/split8-exemplo3-com-no.png)

##### Requisição

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
                        "unitprice": 10000
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

##### Resposta

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

### Transação de Débito  

Uma transação com um cartão de débito é semelhante à de cartão de crédito, mas há duas diferenças:

* O nó `Payment.FraudAnalysis` não deve ser informado, pois a transação não necessita de análise de fraude;
* É obrigatório submeter a transação de débito à autenticação. Para isso, é necessário incluir o nó `Payment.ExternalAuthentication`. A autenticação é feita pela integração 3DS 2.0. 

>Para saber mais sobre a integração 3DS 2.0, acesse o [Manual de Autenticação 3DS 2.0](https://braspag.github.io//manualp/emv3ds).

#### Requisição

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
        "ExternalAuthentication":{
            "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
            "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
            "Eci":"5",
            "Version":"2",
            "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
        },
        "SplitPayments": [
            {
                "subordinatemerchantid": "f2d6eb34-2c6b-4948-8fff-51facdd2a28f",
                "amount": 6000,
                "fares": {
                    "mdr": 20,
                    "fee": 25
                }
            },
            {
                "subordinatemerchantid": "9140ca78-3955-44a5-bd44-793370afef94",
                "amount": 4000,
                "fares": {
                    "mdr": 10,
                    "fee": 15
                }
            }
        ]
    }
}
```

| Propriedade | Descrição | Tipo/Tamanho | Obrigatório |
| --- | --- | --- | --- |
|`Payment.Authenticate`| Define se o comprador será direcionado ao emissor para autenticação do cartão. | Booleano ("true" / "false") | Sim, caso a autenticação seja validada.|
|`Payment.ExternalAuthentication.ReturnUrl`| URL de retorno aplicável somente se a versão for "1". | Alfanumérico / 1024 posições | Sim. |
|`Payment.ExternalAuthentication.Cavv`| Assinatura retornada nos cenários de sucesso na autenticação. | Texto | Sim, caso a autenticação seja validada. |
|`Payment.ExternalAuthentication.Xid`| XID retornado no processo de autenticação. | Texto | Sim, quando a versão do 3DS for "1".|
|`Payment.ExternalAuthentication.Eci`| *Electronic Commerce Indicator* retornado no processo de autenticação. | Numérico / 1 posição | Sim. |
|`Payment.ExternalAuthentication.Version`| Versão do 3DS utilizado no processo de autenticação. | Alfanumérico / 1 posição | Sim, quando a versão do 3DS for "2".|
|`Payment.ExternalAuthentication.ReferenceID`| RequestID retornado no processo de autenticação. | GUID / 36 posições | Sim, quando a versão do 3DS for "2". |

#### Resposta

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
        "SoftDescriptor": "teste",
        "Tid": "0823034725144",
        "ProofOfSale": "4725144",
        "Authenticate": true,
        "ExternalAuthentication":{
            "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
            "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
            "Eci":"5",
            "Version":"2",
            "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
        },
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

### Transação de Boleto

#### Boleto Registrado

Desde 21 de julho de 2018, todos os boletos emitidos no e-commerce, obrigatoriamente, têm que ser registrados. O registro dos boletos é feito na Nova Plataforma de Cobrança, criada
pela Febraban em conjunto com os bancos, para promover maior controle e segurança às transações de boletos no e-commerce e garantir mais confiabilidade e comodidade aos usuários.

Para gerar um boleto, inclusive em ambiente Sandbox, é necessário fornecer dados do comprador como CPF ou CNPJ e endereço. A seguir temos um exemplo de como criar um pedido com este
tipo de meio de pagamento.

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
--header "Content-Type: application/json"
--header "Authorization: Bearer Token"

{
   "MerchantOrderId":"2017091101",
   "Customer":{
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
   "Payment":{
      "Provider":"Braspag",
      "Bank":"BancoDoBrasil",
      "Type":"Boleto",
      "Amount":10000,
      "BoletoNumber":"2017091101",
      "Assignor":"Empresa Teste",
      "Demonstrative":"Desmonstrative Teste",
      "ExpirationDate":"2017-12-31",
      "Identification":"12346578909",
      "Instructions":"Aceitar somente até a data de vencimento."
   }
}
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantOrderId`|Texto| 50 |Sim|Numero de identificação do Pedido|
|`Customer.Name`|Texto| 60(*) |Sim|Nome do comprador|
|`Customer.Identity`|Texto |14 |Sim|Número do RG, CPF ou CNPJ do Cliente|
|`Customer.IdentityType`|Texto|255|Sim|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Address.Street`|Texto|60(*)|Sim|Endereço de contato do comprador|
|`Customer.Address.Number`|Texto|60(*)|Sim|Número endereço de contato do comprador|
|`Customer.Address.Complement`|Texto|60(*)|Não|Complemento do endereço de contato do Comprador|
|`Customer.Address.ZipCode`|Texto|8|Sim|CEP do endereço de contato do comprador|
|`Customer.Address.District`|Texto|60(*)|Sim|Bairro do endereço de contato do comprador|
|`Customer.Address.City`|Texto|18(*)|Sim|Cidade do endereço de contato do comprador|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço de contato do comprador|
|`Customer.Address.Country`|Texto|35|Sim|Pais do endereço de contato do comprador|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento de Boleto `Braspag`|
|`Payment.Bank`|Texto|15|Sim|Nome do Banco que o boleto será emitido `BancoDoBrasil`|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento. No caso `Boleto`|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (deve ser enviado em centavos)|
|`Payment.BoletoNumber`|Texto |9(**)|Não|Número do Boleto ("Nosso Número"). Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Assignor`|Texto |200|Não|Nome do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Demonstrative`|Texto |N/A|Não|Texto de Demonstrativo. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.ExpirationDate`|Date |AAAA-MM-DD|Não|Dias para vencer o boleto. Caso não esteja previamente cadastrado no meio de pagamento, o envio deste campo é obrigatório. Se enviado na requisição, sobrepõe o valor configurado no meio de pagamento.|
|`Payment.Identification`|Texto |14 |Não|CNPJ do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Instructions`|Texto |450|Não|Instruções do Boleto. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|

>(*) São aceitos como caracteres válidos: números, letras de A a Z (MAIÚSCULAS) e caracteres especiais de conjunção (hífen “-“ e apóstrofo “‘”). Quando utilizados, não pode haver espaços entre as letras. Exemplos corretos: D’EL-REI / D’ALCORTIVO / SANT’ANA. Exemplos incorretos: D’EL - REI / um espaço em branco entre palavras.  

##### Resposta

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

## Modelos de Split

O Split de Pagamentos disponibiliza dois modelos para divisão da transação entre os participantes:

| Tipo                       | Descrição                                                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Split Transacional**     | O **master** envia as regras de divisão na autorização (captura automática) ou no momento de captura.                         |
| **Split Pós-Transacional** | O **master** envia as regras de divisão após a captura da transação, até 01h00 do dia posterior à captura..|

O nó referente ao split (divisão)), tanto no contrato de requisição quanto de resposta, é o mesmo para os dois modelos. 

> No Split de Pagamentos, a divisão é realizada somente para transações capturadas, ou seja, as regras de divisão só serão consideradas para autorizações com captura automática e no momento da captura de uma transação. Caso as regras de divisão sejam informadas no momento de uma autorização sem captura automática, as regras de divisão serão desconsideradas.

### Split Transacional

No Split Transacional é necessário que o master envie um "nó" adicional na integração da API Cielo E-Commerce, como apresentado em exemplos anteriores, informando as regras de divisão da transação.

#### Requisição

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
| `SplitPayments.Fares.Mdr`               | **MDR(%)** do **Master** a ser descontado do valor referente a participação do **Subordinado**     | Decimal | -       | Não         |
| `SplitPayments.Fares.Fee`               | **Tarifa Fixa(R$)** a ser descontada do valor referente a participação do **Subordinado**, em centavos. | Inteiro | -       | Não         |

#### Resposta

Como resposta, A API Cielo E-Commerce retornará um nó contendo as regras de divisão enviadas e os valores a serem recebidos pelo master e seus subordinados:

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
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **Subordinado** ou **Master**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Master**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |

### Split Pós-Transacional

Neste modelo, o master poderá enviar as regras de divisão da transação após a captura.

> Para transações de crédito e débito o prazo para envio da requisição de Split Pós-Transacional é até 01h00 do dia posterior à captura.

#### Requisição  

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

#### Resposta

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

| Propriedade                                  | Descrição                                                                              | Tipo   | Tamanho | Obrigatório |
|----------------------------------------------|----------------------------------------------------------------------------------------|--------|---------|-------------|
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **subordinado** ou **saster**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Master**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |

> O master poderá informar as regras de divisão da transação mais de uma vez desde que esteja dentro do período de tempo permitido, que é até 01h00 do dia posterior à captura, se estiver enquadrado no regime de pagamento padrão. 

## Salvando e Reutilizando Cartões

Ao contratar o [Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest), é possível salvar um cartão de forma segura e de acordo com as normas PCI. Os dados do cartão são salvos em formato de um token (excluindo o CVV do cartão), o que facilita o envio e processamento de transações, garantindo a integridade dos cartões armazenados e substituindo seus dados numa próxima transação do mesmo comprador.

Além da geração do `CardToken`, é possível associar um nome (um identificador em formato de texto) ao cartão salvo. Esse identificador será o `Alias`.

<aside class="warning">Por questões de segurança, o Cartão Protegido só aceita salvar cartões que passem pela checagem do Algoritmo de Luhn, também conhecido como "mod10".</aside>

### Fluxo da transação com Cartão Protegido

Na transação com Cartão Protegido, a solicitação de tokenização é feita na própria requisição de autorização.

![FluxoSplitCP](https://developercielo.github.io/images/split/split9-fluxo-transacional-cp.png)

### Salvando um Cartão Durante uma Autorização

Para salvar um cartão de crédito utilizado em uma transação, basta enviar o parâmetro `Payment.SaveCard` como "true" na requisição padrão de autorização. A numeração do cartão usado pode ser validada através da técnica do mod10, explicada [neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360050638051).

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
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
            "SaveCard": "true",
            "Alias": "Client1"
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
                        "unitprice": 10000
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

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "Authorization: Bearer {access_token}"
--data-binary
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
            "SaveCard": "true",
            "Alias": "Client1"
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
                        "unitprice": 10000
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
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`CreditCard.SaveCard`|"true" - para salvar o cartão. / "false" - para não salvar o cartão.|Booleano|10|Não (default "false") |
|`CreditCard.Alias`|Alias (apelido) do cartão de crédito.|Texto|64|Não |

#### Resposta

O parâmetro `CreditCard.CardToken` retornará o token a ser salvo para transações futuras com o mesmo cartão.

```json
{
  [...]
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
            "Brand": "Visa",
            "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "Alias": "Cliente1"
        },
        "Tid": "0823032122562",
        "ProofOfSale": "20190823032122562",
        "AuthorizationCode": "329269",
        "SoftDescriptor": "teste",
    [...]
  }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "Authorization: Bearer {access_token}"
--data-binary
{
  [...]
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
            "Brand": "Visa",
            "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "Alias": "Cliente1"
        },
        "Tid": "0823032122562",
        "ProofOfSale": "20190823032122562",
        "AuthorizationCode": "329269",
        "SoftDescriptor": "teste",
    [...]
  }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.Alias`| Alias (apelido) do cartão de crédito. | Texto | 64 | Texto alfanumérico

### Criando uma Transação com CardToken

Este é um exemplo de como utilizar o `CardToken`, previamente salvo, para criar uma transação. Por questões de segurança, um `CardToken` não armazena o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Para transacionar com a opção *recorrente* (que permite transacionar sem utilizar o CVV), entre em contato com o nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag).

O nó `CreditCard` dentro do nó `Payment` será alterado conforme exemplo a seguir:

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
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
            "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode": "693",
            "Brand": "Visa",
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
                        "unitprice": 10000
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

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "Authorization: Bearer {access_token}"
--data-binary
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
            "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode": "693",
            "Brand": "Visa",
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
                        "unitprice": 10000
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
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Não|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

#### Resposta

```json
{  
   [...]
   }"Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode": "693",
            "Brand": "Visa",
        },
        "Tid": "0823032122562",
        "ProofOfSale": "20190823032122562",
        "AuthorizationCode": "329269",
        "SoftDescriptor": "teste",
        "Provider": "Simulado",
   [...]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   }"Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode": "693",
            "Brand": "Visa",
        },
        "Tid": "0823032122562",
        "ProofOfSale": "20190823032122562",
        "AuthorizationCode": "329269",
        "SoftDescriptor": "teste",
        "Provider": "Simulado",
   [...]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|

### Criando uma Transação com Alias

Este é um exemplo de como utilizar o *Alias*, previamente salvo, para criar uma transação. Por questões de segurança, um Alias não armazena o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Para transacionar com a opção *recorrente* (que permite transacionar sem utilizar o CVV), entre em contato com o nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag).

O nó `CreditCard` dentro do nó `Payment` será alterado, conforme exemplo a seguir:

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/</span></aside>

```json
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
            "Alias": "Cliente1",
            "SecurityCode": "693",
            "Brand": "Visa",
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
                        "unitprice": 10000
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

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "Authorization: Bearer {access_token}"
--data-binary
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
            "Alias": "Cliente1",
            "SecurityCode": "693",
            "Brand": "Visa",
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
                        "unitprice": 10000
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
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Não|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`CreditCard.Alias`| Alias (apelido) do cartão de crédito. | Texto | 64 | Não

#### Resposta

```json
{  
   [...]
   }"Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "Alias": "Cliente1",
            "SecurityCode": "693",
            "Brand": "Visa",
        },
        "Tid": "0823032122562",
        "ProofOfSale": "20190823032122562",
        "AuthorizationCode": "329269",
        "SoftDescriptor": "teste",
        "Provider": "Simulado",
   [...]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   }"Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode": "693",
            "Brand": "Visa",
        },
        "Tid": "0823032122562",
        "ProofOfSale": "20190823032122562",
        "AuthorizationCode": "329269",
        "SoftDescriptor": "teste",
        "Provider": "Simulado",
   [...]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|

## Consulta

Para consultar uma transação, use o serviço de consulta da API Cielo E-Commerce. Você pode consultar uma transação para verificar todos os dados dessa transação ou para saber o seu
status. Caso queira receber atualizações de status de uma transação, recomendamos usar o [**Post de Notificação**](https://braspag.github.io//manual/split-de-pagamentos-cielo-e-commerce#post-de-notifica%C3%A7%C3%A3o).

#### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-cielo-ecommerce-consulta}/1/sales/{PaymentId}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

#### Resposta

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

## Captura

Ao capturar uma transação do Split de Pagamentos, o master precisa informar as regras de divisão da transação. Caso as regras não sejam informadas, o Split interpretará que todo o valor é referente ao próprio Master.

### Captura Total

Na captura total de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total da transação enviado no momento da autorização.

#### Requisição

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

#### Resposta

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

### Captura Parcial

Na captura parcial de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total a ser capturado. Caso nenhuma divisão seja informada, o Split interpretará que todo o valor é referente ao próprio master.

#### Requisição

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

#### Resposta

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

Como explicitado anteriormente, se as regras de divisão não forem informadas na requisição da captura total ou parcial, o Split interpreta que todo o valor é destinado ao próprio master.

## Cancelamento

Ao cancelar uma transação do Split de Pagamentos o master deve informar, para um cancelamento parcial, qual o valor que deve ser cancelado para cada participante da transação. Para um cancelamento total, esta informação não é necessária, já que o valor total será cancelado e, consequentemente, o valor total de cada subordinado.

> O prazo de estorno de uma transação é de 300 dias, devido a regra definida pela adquirente, bancos e bandeiras.

### Cancelamento Total

No cancelamento total de uma transação, será cancelado o valor total da transação e, consequentemente, o valor total de cada subordinado e as comissões de todos os participantes.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/void</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

#### Resposta

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

### Cancelamento Parcial

No cancelamento parcial, o somatório dos valores cancelados definidos para cada subordinado deve ser igual ao valor do cancelamento parcial.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{api-cielo-ecommerce}/1/sales/{PaymentId}/void?amount={amount}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

No exemplo a seguir, a requisição informa o cancelamento do valor de R$25,00 de uma transação capturada no valor de R$100,00.

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

#### Resposta

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

Não é obrigatório informar todos os subordinados no cancelamento parcial. Você pode informar apenas os subordinados para os quais deseja cancelar totalmente ou cancelar parte do valor destinado a cada um na transação, conforme exemplo a seguir:

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

> Ao cancelar parcialmente parte de um valor destinado a um subordinado, a Tarifa Fixa que o master tem a receber também é cancelada proporcionalmente.

## Opções de Configuração da Transação

Em uma transação do Split, existem configurações opcionais para que o master possa definir de qual parte as taxas serão descontadas.

### Tipo do Desconto das Taxas

Os descontos das taxas (MDR e tarifa fixa) do Split podem ser feitos de duas formas: sobre a comissão ou venda do master.

|TIPO|DESCRIÇÃO|
|---|---|
|`Commission`|O desconto será feito sobre o valor de comissão que o master tem a receber na transação. É o padrão adotado pelo Split.|
|`Sale`|O desconto será feito sobre o valor de venda que o master tem a receber na transação.|

> Para que a opção de desconto da parte da venda seja possível, o master deve possuir venda na transação.

A escolha do tipo de desconto das taxas pode ser feita:

* No momento do **Split Transacional** ou Pós-Transacional**;
* No momento do **Split Pós-Transacional** ou
* **Pré-configurada**. Para pré-configurar, entre em contato com o [Suporte](https://suporte.braspag.com.br/hc/pt-br), que irá criar, remover ou atualizar a
pré-configuração. A pré-configuração só será utilizada caso nenhum valor seja informado na requisição.

No caso de uma transação criada com um tipo de desconto das taxas, esse tipo será usado em todas as requisições posteriores. É possível mudar o tipo de desconto através da redivisão
(pelo Split Pós-Transacional), informando o tipo desejado. Uma vez que o tipo é mudado, o novo tipo é usado em todas as requisições posteriores ou até que seja mudado novamente.

> Só é possível mudar o tipo de desconto enquanto ainda for possível redividir a transação.

#### No Momento Transacional

A seguir vamos apresentar exemplos de uma transação com o desconto aplicado sobre a comissão e com o desconto aplicado sobre a venda.

A transação tem valor de **R$100,00** com o nó contendo as regras de divisão e o master participando da venda.

> **Taxa Braspag:** 2% de MDR + R$0,30 de Tarifa Fixa.<br>
> **Taxa Master com o Subordinado A:** 5% de MDR, já embutindo os 2% do MDR Braspag + R$0,30 de Tarifa Fixa.<br> 
> **Taxa Master com o Subordinado B:** 4% MDR, já embutindo os 2% do MDR Braspag + R$ 0,15 de Tarifa Fixa.

Após a divisão, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado A:**

* Crédito de R$42,75 (R$45,00 da transação menos R$2,25 de MDR);
* Débito de R$0,30 de Tarifa Fixa.

O **total a receber** pelo subordinado A será **R$42,45**.

**Subordinado B:**

* Crédito de R$28,80 (R$30,00 da transação menos R$1,20 de MDR);
* Débito de R$0,15 de Tarifa Fixa.

O **total a receber** pelo subordinado B será **R$28,65**.

**Master:**

* Crédito de R$ 26,90 (R$25,00 da transação somados com R$2,25 de MDR e R$0,30 de Tarifa Fixa do subordinado A, e com R$1,20 de MDR e R$0,15 de Tarifa Fixa do subordinado B; menos R$2,00 de MDR da Braspag);
* Débito de R$0,30 (Tarifa Fixa acordada com a Braspag).

O **total a receber** pelo master será **R$26,60**.
 
**Braspag:**

* Crédito de R$2,30 (MDR aplicado sobre o valor total da transação mais R$0,30 de Tarifa Fixa acordada com o master).

O **total a receber** pela Braspag será **R$2,30**.

As divisões e o valor total a receber de cada participante estão na figura a seguir.

![SplitEx4](https://developercielo.github.io/images/split/split10-exemplo4-tipo-de-desconto.png)

##### Desconto sendo aplicado sobre a comissão

###### Requisição

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

###### Resposta

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

##### Desconto sendo aplicado sobre a venda

###### Requisição

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

###### Resposta

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

#### No Momento Pós-Transacional

Veja uma requisição no modelo Split Pós-transacional com o desconto aplicado sobre a venda.

##### Requisição

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

##### Resposta

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

# Antifraude

O Split de Pagamentos possui uma plataforma de antifraude que utiliza inteligência artificial para minimizar os riscos de fraude e chargeback.

> No modelo de negócio do Split, todo chargeback é repassado ao master, que pode ou não repassá-lo para os seus subordinados. Portanto, é de suma importância que a plataforma de antifraude esteja corretamente integrada e configurada.

## Fluxo transacional com Antifraude

A integração com o antifraude se dá através do próprio fluxo transacional, na mesma requisição da transação.

1. O comprador faz um pedido com o master;
2. O master envia a requisição de autorização da transação com o nó `Payment.FraudAnalysis`;
3. O Split faz a autorização da transação e solicita a análise de fraude;
4. O Split retorna ao master a autorização da transação e o resultado da análise de fraude (que aceita ou rejeita a transação);
5. Se a transação foi autorizada pelo Split e aceita pela análise de fraude, o master confirma o pagamento ao comprador.

Caso a análise de fraude recomende rejeitar a transação, o fluxo é interrompido.

![FluxoSplitAF](https://developercielo.github.io/images/split/split11-fluxo-transacional-af.png)

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

# Post de Notificação

Para receber a notificação de alteração de status da transação (ex.: confirmação de pagamento ou devolução), é preciso configurar o campo "URL de Notificação" durante o cadastro de sua loja na Braspag. O endereço deve ser HTTPS e não se deve utilizar uma porta fora do padrão HTTPS (443).

Veja o fluxo percorrido pelo Post de Notificação:

![SplitPostNotificacao](https://developercielo.github.io/images/split/split12-post-notificacao.png)

Os parâmetros serão enviados à URL cadastrada, conforme o próximo exemplo.

## Notificação Enviada

```json
{
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "ChangeType": "1"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`PaymentId`|Identificador que representa a transação.|GUID|36|Sim|
|`ChangeType`|Especifica o tipo de notificação. Obs.: Consulte a tabela abaixo. | Número | 1 |Sim|

|ChangeType|Descrição|
|----------|---------|
|"1"|Mudança de status do pagamento.|
|"3"|Mudança de status do *Antifraude*.|
|"6"|Boleto registrado pago a menor.|
|"7"|Notificação de chargeback. Para mais detalhes, consulte o manual de [Risk Notification](https://braspag.github.io//manual/risknotification).|
|"8"|Alerta de fraude.|

## Resposta Esperada

É esperado o retorno da loja com a seguinte resposta: `HTTP Status Code 200 OK`.

Caso não seja retornada a resposta acima, haverá mais duas tentativas de envio do Post de Notificação.

# Anexos

## Lista de Status da Transação

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

## Lista de Status do AntiFraude

| Código | Descrição  |
|--------|------------|
| 0      | Unknown    |
| 1      | Accept     |
| 2      | Reject     |
| 3      | Review     |
| 4      | Aborted    |
| 5      | Unfinished |

## Lista de HTTP Status Code

| HTTP Status Code | Descrição             |
|------------------|-----------------------|
| 200              | OK                    |
| 400              | Bad Request           |
| 404              | Resource Not Found    |
| 500              | Internal Server Error |

## Códigos de retorno ABECS

A Associação Brasileira das Empresas de Cartão de Crédito e Serviços (ABECS) estabeleceu, a partir de 15 de Julho de 2020, a padronização do código de retorno das autorizações de vendas recusadas para as soluções pagamento do mundo físico e e-commerce do mercado brasileiro.

Essa medida normativa busca trazer benefícios para todo o mercado de pagamentos, proporcionando maior transparência no entendimento do motivo de recusa das transações, além de possibilitar maior assertividade na adoção de estratégias de retentativas de vendas.

<aside class="notice">Os códigos da bandeira AMEX sofreram um "de/para" de modo a manter dois dígitos. Reforçamos que essa medida não altera os motivos de retorno.</aside>

| Mensagem | Tipo de Código | ELO | VISA | MASTERCARD/HIPER | AMEX | AMEX - De/Para Cielo | Mensagem POS/Ecommerce |
|---|---|---|---|---|---|---|---|
| GENÉRICA | REVERSÍVEL | 05 | 05 | 05 | 100 | FA | CONTATE A CENTRAL DO SEU CARTÃO |   
| SALDO/LIMITE INSUFICIENTE | REVERSÍVEL | 51 | 51 | 51 | 116 | A5 | NÃO AUTORIZADA |
| SALDO/LIMITE INSUFICIENTE | REVERSÍVEL | 51 | 51 | 51 | 121 | A5 | NÃO AUTORIZADA |
| SENHA INVÁLIDA | REVERSÍVEL | 55 | 55 ou 86 | 55 | 117 | A6 | SENHA INVÁLIDA |
| TRANSAÇÃO NÃO PERMITIDA PARA O CARTÃO | IRREVERSÍVEL | 57 | 57 | 57 | 200 | FD | TRANSAÇÃO NÃO PERMITIDA PARA O CARTÃO- NÃO TENTE NOVAMENTE |
| NÚMERO CARTÃO NÃO PERTENCE AO EMISSOR \| NÚMERO CARTÃO INVÁLIDO | IRREVERSÍVEL | 14 ou 56 | 06 | 14 ou 01 | 122 | 08 | VERIFIQUE OS DADOS DO CARTÃO |
| VIOLAÇÃO DE SEGURANÇA | IRREVERSÍVEL | 63 | 06 | 14 | 122 | 08 | VERIFIQUE OS DADOS DO CARTÃO |
| SUSPEITA DE FRAUDE | REVERSÍVEL | 59 | 59 | 63 | 100 | FA | CONTATE A CENTRAL DO SEU CARTÃO |
| COMERCIANTE INVÁLIDO | IRREVERSÍVEL | 58 | SEM CÓDIGO CORRESPONDENTE | 03 | 109 | DA | TRANSAÇÃO NÃO PERMITIDA - NÃO TENTE NOVAMENTE |
| COMERCIANTE INVÁLIDO | REVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 03 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | TRANSAÇÃO NÃO PERMITIDA |
| REFAZER A TRANSAÇÃO (EMISSOR SOLICITA RETENTATIVA) | REVERSÍVEL | 4 | SEM CÓDIGO CORRESPONDENTE | SE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | REFAZER A TRANSAÇÃO |
| CONSULTAR CREDENCIADOR | REVERSÍVEL | 6 | SEM CÓDIGO CORRESPONDENTE | SE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | LOJISTA, CONTATE O ADQUIRENTE |
| PROBLEMA NO ADQUIRENTE | IRREVERSÍVEL | 19 | 19 | 30 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | ERRO NO CARTÃO – NÃO TENTE NOVAMENTE |
| ERRO NO CARTÃO | IRREVERSÍVEL | 12 | 06 | SEM CÓDIGO CORRESPONDENTE | 115 | A2 | VERIFIQUE OS DADOS DO CARTÃO |
| ERRO DE FORMATO (MENSAGERIA) | IRREVERSÍVEL | 30 | 12 | 30 | 181 | A3 | ERRO NO CARTÃO - NÃO TENTE NOVAMENTE |
| VALOR DA TRANSAÇÃO INVÁLIDA | IRREVERSÍVEL | 13 | 13 | 13 | 110 | JB | VALOR DA TRANSAÇÃO NÃO PERMITIDO - NÃO TENTE NOVAMENTE |
| VALOR DA PARCELA INVÁLIDA | IRREVERSÍVEL | 23 | SEM CÓDIGO CORRESPONDENTE | 12 | 115 | A2 | PARCELAMENTO INVÁLIDO - NÃO TENTE NOVAMENTE |
| EXCEDIDAS TENTATIVAS DE SENHA \| COMPRAS | REVERSÍVEL | 38 | 75 | 75 | 106 | A4 | EXCEDIDAS TENTATIVAS DE SENHA.CONTATE A CENTRAL DO SEU CARTÃO |
| CARTÃO PERDIDO | IRREVERSÍVEL | 41 | 41 | 41 | 200 | FD | TRANSAÇÃO NÃO PERMITIDA - NÃO TENTE NOVAMENTE |
| CARTÃO ROUBADO | IRREVERSÍVEL | 43 | 43 | 43 | 200 | FD | TRANSAÇÃO NÃO PERMITIDA - NÃO TENTE NOVAMENTE |
| CARTÃO VENCIDO / DT EXPIRAÇÃO INVÁLIDA | IRREVERSÍVEL | 54 | 06 | 54 | 101 | BV | VERIFIQUE OS DADOS DO CARTÃO |
| TRANSAÇÃO NÃO PERMITIDA \| CAPACIDADE DO TERMINAL | IRREVERSÍVEL | 57 | 58 | 58 | 116 | A5 | TRANSAÇÃO NÃO PERMITIDA - NÃO TENTE NOVAMENTE |
| VALOR EXCESSO \| SAQUE | REVERSÍVEL | 61 | 61 ou N4 | 61 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | VALOR EXCEDIDO. CONTATE A CENTRAL DO SEU CARTÃO |
| CARTÃO DOMÉSTICO - TRANSAÇÃO INTERNACIONAL | IRREVERSÍVEL | 62 | SEM CÓDIGO CORRESPONDENTE | 62 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CARTÃO NÃO PERMITE TRANSAÇÃO INTERNACIONAL|
| CARTÃO DOMÉSTICO - TRANSAÇÃO INTERNACIONAL | REVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 62 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CARTÃO NÃO PERMITE TRANSAÇÃO INTERNACIONAL|
| VALOR MÍNIMO DA TRANSAÇÃO INVÁLIDO | IRREVERSÍVEL | 64 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | VALOR DA TRANSAÇÃO NÃO PERMITIDO - NÃO TENTE NOVAMENTE |
| QUANT. DE SAQUES EXCEDIDO | REVERSÍVEL   | 65 | 65 | 65 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | QUANTIDADE DE SAQUES EXCEDIDA. CONTATE A CENTRAL DO SEU CARTÃO |
| SENHA VENCIDA / ERRO DE CRIPTOGRAFIA DE SENHA | IRREVERSÍVEL | 74 | 74 ou 81 | 88 | 180 | A7 | SENHA INVÁLIDA - NÃO TENTE NOVAMENTE |
| EXCEDIDAS TENTATIVAS DE SENHA \| SAQUE | REVERSÍVEL | 75 | 75 | 75 | 106 | A4 | EXCEDIDAS TENTATIVAS DE SENHA.CONTATE A CENTRAL DO SEU CARTÃO |
| CONTA DESTINO INVÁLIDA OU INEXISTENTE | IRREVERSÍVEL | 76 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTA DESTINO INVÁLIDA - NÃO TENTE NOVAMENTE |
| CONTA ORIGEM INVÁLIDA OU INEXISTENTE | IRREVERSÍVEL | 77 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTA ORIGEM INVÁLIDA - NÃO TENTE NOVAMENTE |
| CARTÃO NOVO SEM DESBLOQUEIO | REVERSÍVEL | 78 | 78 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | DESBLOQUEIE O CARTÃO |
| CARTÃO INVÁLIDO (criptograma) | IRREVERSÍVEL | 82 | 82 | 88 | 180 | A7 | ERRO NO CARTÃO - NÃO TENTE NOVAMENTE |
| EMISSOR FORA DO AR | REVERSÍVEL | 91 | 91 | 91 | 912 | A1 | FALHA DE COMUNICAÇÃO - TENTE MAIS TARDE |
| FALHA DO SISTEMA | REVERSÍVEL | 96 | 96 | 96 | 911 | AE | FALHA DE COMUNICAÇÃO - TENTE MAIS TARDE |
| DIFERENÇA - PRÉ AUTORIZAÇÃO | IRREVERSÍVEL | 99 | N8 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | VALOR DIFERENTE DA PRÉ AUTORIZAÇÃO - NÃO TENTE NOVAMENTE |
| FUNÇÃO INCORRETA (DÉBITO) | IRREVERSÍVEL | AB | 52 ou 53 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | UTILIZE FUNÇÃO CRÉDITO |
| FUNÇÃO INCORRETA (CRÉDITO) | IRREVERSÍVEL | AC | 39 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | UTILIZE FUNÇÃO DÉBITO |
| TROCA DE SENHA / DESBLOQUEIO | IRREVERSÍVEL | P5 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SENHA INVÁLIDA - NÃO TENTE NOVAMENTE |
| NOVA SENHA NÃO ACEITA | REVERSÍVEL | P6 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SENHA INVÁLIDA UTILIZE A NOVA SENHA |
| RECOLHER CARTÃO (NÃO HÁ FRAUDE) | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 04 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO - NÃO TENTE NOVAMENTE |
| ERRO POR MUDANÇA DE CHAVE DINÂMICA | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 06 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | ERRO NO CARTÃO - NÃO TENTE NOVAMENTE |
| FRAUDE CONFIRMADA | IRREVERSÍVEL | 57 | 07 | 04 | 200 | FD | TRANSAÇÃO NÃO PERMITIDA PARA O CARTÃO - NÃO TENTE NOVAMENTE |
| EMISSOR Ñ LOCALIZADO - BIN INCORRETO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 15 | 15 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | DADOS DO CARTÃO INVÁLIDO - NÃO TENTE NOVAMENTE |
| (negativa do adquirente) NÃO CUMPRIMENTO PELAS LEIS DE ANTE LAVAGEM DE DINHEIRO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 64 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO - NÃO TENTE NOVAMENTE |
| REVERSÃO INVÁLIDA | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 76 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO - NÃO TENTE NOVAMENTE |
| NÃO LOCALIZADO PELO ROTEADOR | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 92 | 92 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO - NÃO TENTE NOVAMENTE |
| TRANSAÇÃO NEGADA POR INFRAÇÃO DE LEI | IRREVERSÍVEL | 57 | SEM CÓDIGO CORRESPONDENTE | 57 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | TRANSAÇÃO NÃO PERMITIDA PARA O CARTÃO - NÃO TENTE NOVAMENTE |
| TRANSAÇÃO NEGADA POR INFRAÇÃO DE LEI | REVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 93 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | TRANSAÇÃO NÃO PERMITIDA PARA O CARTÃO|
| VALOR DO TRACING DATA DUPLICADO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | 94 | 94 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO - NÃO TENTENOVAMENTE |
| SURCHARGE NÃO SUPORTADO | REVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | B1 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO |
| SURCHARGE NÃO SUPORTADO PELA REDE DE DÉBITO | REVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | B2 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO |
| FORÇAR STIP | REVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | N0 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO |
| SAQUE NÃO DISPONÍVEL | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | N3 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SAQUE NÃO DISPONÍVEL - NÃO TENTE NOVAMENTE |
| SUSPENSÃO DE PAGAMENTO RECORRENTE PARA UM SERVIÇO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | R0 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SUSPENSÃO DE PAGAMENTO RECORRENTE PARA SERVIÇO - NÃO TENTE NOVAMENTE |
| SUSPENSÃO DE PAGAMENTO RECORRENTE PARA TODOS SERVIÇO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | R1 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SUSPENSÃO DE PAGAMENTO RECORRENTE PARA SERVIÇO - NÃO TENTE NOVAMENTE |
| TRANSAÇÃO NÃO QUALIFICADA PARA VISA PIN | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | R2 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | TRANSAÇÃO NÃO PERMITIDA PARA O CARTÃO - NÃO TENTE NOVAMENTE |
| SUSPENSÃO DE TODAS AS ORDENS DE AUTORIZAÇÃO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | R3 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | SUSPENSÃO DE PAGAMENTO RECORRENTE PARA SERVIÇO - NÃO TENTE NOVAMENTE |
| NÃO É POSSÍVEL LOCALIZAR O REGISTRO NO ARQUIVO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | 25 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO - NÃO TENTE NOVAMENTE |
| ARQUIVO NÃO DISPONÍVEL PARA ATUALIZAÇÃO | IRREVERSÍVEL | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | 28 | SEM CÓDIGO CORRESPONDENTE | SEM CÓDIGO CORRESPONDENTE | CONTATE A CENTRAL DO SEU CARTÃO - NÃO TENTE NOVAMENTE |

### Outros códigos de retorno

| Código Resposta | Definição    | Significado          | Ação            | Permite Retentativa |
|-----------------|--------------|----------------------|-----------------|---------------------|
|79|TRANSAÇÃO MASTERCARD NÃO PERMITIDA PARA O CARTÃO | Transação não autorizada. Não é possível processar a transação devido a erro relacionado ao cartão do portador. Solicite ao portador que entre em contato com o banco emissor. | Entre em contato com o seu banco. | Não |
|80|Transação não autorizada. Divergência na data de transação/pagamento.|Transação não autorizada. Data da transação ou data do primeiro pagamento inválida.|Transação não autorizada. Refazer a transação confirmando os dados.|Não|
|82|TRANSAÇÃO MASTERCARD NÃO AUTORIZADA. LIGUE PARA O EMISSOR|Transação não autorizada devido a regras do emissor. Oriente o portador a entrar em contato com o banco emissor.|Entre em contato com o seu banco.|Não|
|83|TRANSAÇÃO MASTERCARD SUSPEITA DE FRAUDE|Transação não autorizada. Suspeita de fraude pelo banco emissor.|Entre em contato com o seu banco.|Não|