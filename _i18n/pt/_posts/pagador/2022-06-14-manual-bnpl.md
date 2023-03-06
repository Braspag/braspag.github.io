---
layout: manual
title: Manual de Integração - BNPL
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
sort_order: 5
hub_visible: false
tags:
    - 1. Pagador
language_tabs:
  json: JSON
  shell: cURL
  
---

# Buy Now, Pay Later (BNPL)

**O que é Buy Now, Pay Later?**

*Buy Now, Pay Later*, mais conhecido pela sigla BNPL, é um tipo de financiamento de curto prazo, com ou sem taxas para o comprador, que considera uma avaliação de crédito instantânea permitindo o parcelamento de compras sem o uso de cartão de crédito. Esse meio de pagamento é uma oferta complementar que pode impulsionar a conversão de vendas e aumentar o ticket médio de estabelecimentos comerciais, oferecendo maior poder de compra aos consumidores.

**Exemplos de aplicação do BNPL**

* Oferecer ao comprador a opção do BNPL em seu checkout quando uma autorização de venda com cartão de crédito foi recusada;
* Atender a parcela de clientes que não têm conta bancária ou acesso ao crédito convencional, uma vez que o BNPL independe de cartões ou bancos.
<br/>
Veja a representação do **fluxo transacional** do **BNPL** da empresa **Koin** nos fluxos de Aprovação Imediata e Aprovação Posterior:

## Aprovação Imediata

![Fluxo BPNL Koin Aprovação Imediata]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/bnpl-koin-aprovacaoimediata100.png)

## Aprovação Posterior

![Fluxo BPNL Koin Aprovação Posterior]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/bnpl-koin-aprovacaoposterior100.png)

> Para ambos os fluxos é importante que você tenha uma URL de Notificação configurada em sua loja do Pagador, para que possamos informar que a transação teve seu status alterado. Saiba como configurar essa URL na documentação do [Post de Notificação](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o){:target="_blank"}.

# Koin

A Koin é uma empresa de meios de pagamento que oferece a solução **Boleto Parcelado**. O Boleto Parcelado permite que os compradores realizem pagamentos em lojas virtuais usando a experiência do BNPL.

# Ambientes e APIs

Para a integração com a Koin, você irá usar os endpoints da **[API do Pagador](https://braspag.github.io//manual/braspag-pagador#ambientes-de-teste-e-produ%C3%A7%C3%A3o){:target="_blank"}**, e da **API de Consulta de Parcelas**. 

**Sandbox**

|Base da URL|Descrição|
|----|----|
|API do Pagador (transacional)|https://apisandbox.braspag.com.br|
|API de Consulta de Parcelas|https://paymentinstallmentoptionsapisandbox.braspag.com.br|

**Produção**

|Base da URL|Descrição|
|----|----|
|API do Pagador (transacional)|https://api.braspag.com.br|
|API de Consulta de Parcelas|https://paymentinstallmentoptionsapi.braspag.com.br|

# Integração com a KOIN

A integração com a Koin consiste em três passos:

1. Configuração do checkout;
2. Obtenção das parcelas;
3. Solicitação da autorização.

## Cenários de Teste

Confira os números de CPF disponíveis para os testes de solicitação, para que possa simular alguns tipos de retorno em ambiente sandbox:

| **CPF**                                                                                | **ProviderReturnCode** | **ProviderReturnMessage**     |
|:--------------------------------------------------------------------------------------:|:----------------------:|:-----------------------------:|
| 354.574.310-10<br>731.143.850-01<br>054.920.250-15<br>555.030.660-30<br>486.269.590-60 |         200.3          |   *Aprovado automaticamente*  |
| 898.914.640-24<br>451.625.980-03<br>420.003.140-07<br>192.236.580-71<br>983.579.360-32 |         304.1          |   *Reprovado automaticamente* |                  
| 546.723.960-02<br>133.588.530-71<br>943.303.990-40<br>121.190.460-18<br>585.587.770-12 |         312.23         |   *Análise Manual*            |

## Passo 1 - Configurando o checkout

A Koin necessita de algumas informações sobre o comprador para consultar as parcelas disponíveis e finalizar o pedido. Para isso, você deverá incluir em seu checkout os **Termos e Condições da Koin** e o script para obtenção do `FraudID`. 

### Termos e Condições Koin

A sua página de checkout precisa **exibir** ou **oferecer acesso** aos **Termos e Condições da Koin** para que o comprador fique ciente sobre como funciona essa política de crédito. 

O link para o Termos de Condições da Koin é: **[https://www.koin.com.br/termos-e-condicoes/](https://www.koin.com.br/termos-e-condicoes/){:target="_blank"}**.

Você deve configurar o seu checkout de forma que a transação só possa prosseguir após o aceite dos termos.

### Obtendo o FraudID

O `FraudID` é a identificação digital do dispositivo do comprador, e é composto por uma série de dados coletados na página de checkout. O `FraudID` deverá ser informado na requisição de autorização à API do Pagador no campo `FingerprintId` (passo 3). Cada requisição de autorização deverá conter um `FraudID` diferente.

A Koin usa as informações contidas no `FraudID` para analisar o comprador e oferecer a melhor condição de parcelamento.

Para gerar o `FraudID`, você deve inserir um script em JavaScript com a URL da Koin:

![script-fraudid-koin]({{ site.baseurl_root }}/images/braspag/pagador/script-js-koin.png)

> [Acesse o nosso GitHub](https://github.com/Braspag/braspag.github.io/blob/f28ec76a58a5ff58dba23e0e6cb90c0b132f60f5/_i18n/pt/_posts/pagador/script-js-koin.html){:target="_blank"} para visualizar e copiar o modelo JavaScript.

## Passo 2 - Obtendo as Parcelas

Para que você possa exibir a opção de parcelamento em seu checkout é necessário que a sua aplicação faça uma requisição à **API de Consulta de Parcelas**. 

A resposta da requisição apresentará as opções de parcelamento, identificadas pelo campo `Options.Id`. Cada opção irá apresentar o número de parcelas disponíveis, o valor de cada parcela, a data de vencimento da primeira parcela e taxas.

> **Como o comprador vai visualizar as parcelas?**<br/>
> Uma opção é inserir em seu checkout um botão para exibição de parcelas, como "Consultar parcelas".

Caso qualquer um dos itens da requisição seja alterado pelo comprador será necessário realizar uma nova consulta.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{API de Consulta de Parcelas}/v1/authorize</span></aside>

### Requisição

```json
{
    "Provider": "koin",
    "Customer": {
        "Email": "teste@braspag.com.br",
        "IpAddress": "127.0.0.1",
        "Identity": "05492025015"
    },
    "UseDate": "2022-04-07",
    "Amount": 10010,
    "AcceptedTerms": true
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|Guid|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Customer.Email`|Email do comprador.|Texto|255|Sim|
|`Customer.IpAddress`|Endereço de IP do comprador. Suporte a IPv4|Texto|45|Sim|
|`Customer.Identity`|Número do CPF ou CNPJ do cliente.|Texto|14|Sim|
|`UseDate`|Previsão de entrega do produto ou de utilização do serviço. Formato AAAA-MM-DD.|Data|10|Sim|
|`Amount`|Valor do pedido, em centavos.|Número|15|Sim |
|`AcceptedTerms`|Indica se houve o aceite dos termos de uso da Koin.|Booleano|-|Sim|

### Resposta

```json
{
    "ReturnCode": "12200",
    "ReturnMessage": "Autorizado",
    "Status": 1,
    "Installments": 2,
    "Options": [
        {
            "Id": "Q5a9i65h7pA34TdAoVcX1lZYvWXZghXvst/UpfjnankRA+drdpRTzDdzIrUKiEyN",
            "Installment": 1,
            "Description": "À Vista",
            "OriginalAmount": 10010,
            "TotalAmount": 10010,
            "FirstExpirationDate": "2022-05-11"
        },
        {
            "Id": "CqEQjSgSB0w34TdAoVcX1lZYvWXZghXvst/UpfjnankRA+drdpRTzDdzIrUKiEyN",
            "Installment": 2,
            "Description": "2 x de R$ 51,40",
            "OriginalAmount": 10010,
            "TotalAmount": 10280,
            "FirstExpirationDate": "2022-05-11",
            "InstallmentAmount": 5140,
            "Rates": 3.89,
            "Iof": 0.53,
            "DailyIof": 0.0082,
            "AdditionalIof": 0.38,
            "Cet": 70.07
        }
    ]
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|----|-------|-----------|---------|
|`ReturnCode`|Código retornado pelo provedor do meio de pagamento.|Texto|32|Ex.: "12200"|
|`ReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento.|Texto|512|"Autorizado"|
|`Status`|Status da transação.|Byte|02|Ex.: 1|
|`Installments`|Quantidade máxima de parcelas possíveis para o estabelecimento.|Número|2|Ex.: 12|
|`Options.Id`|Código que informará a opção de parcelamento no próximo passo, de geração do pedido. Cada opção de parcelamento retornada terá um código diferente e único.|Texto|65| - |
|`Options.Installment`|Quantidade de Parcelas da opção.|Número|2|Ex.: 12|
|`Options.Description`|Descrição por extenso da quantidade de parcelas e do valor de cada uma delas.|Texto|25|2 x de R$ 51,35|
|`Options.OriginalAmount`|Valor original do pedido.|Número|10|10010|
|`Options.TotalAmount`|Valor total do pedido.|Número|10|10280|
|`Options.FirstExpirationDate`|Data de expiração do primeiro pagamento.|Data|10|AAAA-MM-DD|
|`Options.InstallmentAmount`|Valor de cada parcela.|Número|10|5140|
|`Options.Rates`|Valor das taxas cobradas pela operação.|Texto|10|3.89|
|`Options.Iof`|Imposto sobre Operações Financeiras.|Texto|10|0.53|
|`Options.DailyIof`|Valor do IOF diário.|Texto|10|0.0082|
|`Options.AdditionalIof`|Valor adicional do IOF.|Texto|10|0.38|
|`Options.Cet`|Custo Efetivo Total, isto é, encargos, tributos, taxas e despesas dessa transação.|Texto|10|70.07|

> Após o comprador escolher a opção de parcelamento, envie o valor do `Options.Id` correspondente à opção escolhida na requisição de autorização no campo `InstallmentOptionId`, conforme detalharemos no passo 3.

## Passo 3 - Solicitando Autorização

Após o aceite dos Termos e Condições, da obtenção do `FraudId` e da consulta das opções de parcelamento, chegou a hora de submeter os dados da transação para a criação da transação em si e para a solicitação de autorização da Koin.

Para essa autorização, o `Payment.Type` será "BuyNowPayLater" e o `Payment.Provider` será "Koin".

Nessa etapa, você deverá enviar dois valores obtidos no passos anteriores:

* Envie o valor do `FraudID` obtido no passo 1 no campo `FingerprintId`;
* Envie o valor do `OptionsId` (obtido no passo 2) escolhido pelo comprador no campo `InstallmentOptionId`.
<br/>
> **Aplicando multas e descontos**<br/>
> Você pode informar valores de sua escolha para multas e descontos em campos opcionais. 
> Você pode informar valores de sua escolha para multas e descontos em campos opcionais.<br/> 
> **Multas:** envie o campo `Payment.FineRate` para multa sobre o valor da transação **ou** envie o campo `Payment.FineAmount` para multa sobre o valor total. *Atenção: você deve enviar apenas um dos campos referentes à multa*.<br/>
> **Descontos:**envie o campo `Payment.DiscountRate` para desconto sobre o valor da transação **ou** envie o campo `Payment.DiscountAmount` para desconto sobre o valor total. *Atenção: você deve enviar apenas um dos campos referentes ao desconto*.<br/>

Para submeter à autorização, envie a requisição da transação para a API do Pagador.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{API Pagador}/v2/sales</span></aside>

### Requisição

```json
{
    "MerchantOrderId": "401904531",
    "Customer": {
        "Name": "Cliente Teste",
        "Identity": "054.920.250-15",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "PhoneAreaCode": "11",
        "Phone": "5521976781114",
        "Birthdate": "1991-01-02",
        "IpAddress": "127.0.0.1",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "Business"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "Business"
        },
    },
    "Payment": {
        "Type": "BuyNowPayLater",
        "Amount": 10280,
        "Provider": "Koin",
        "FingerprintId": "9a6ce08d275bj4106396f2aa982fc2158254k",
        "InstallmentOptionId": "CqEQjSgSB0w34TdAoVcX1lZYvWXZghXvst/UpfjnankRA+drdpRTzDdzIrUKiEyN",
        "FineRate": 0,
        "FineAmount": 0,
        "DiscountRate": 0,
        "DiscountAmount": 0,
        "MerchantIdentification": "12.456.789/0001-01",
        "MerchantCorporateName": "BP Tests",
        "Shipping": {
            "Amount": 1098,
            "DeliveryEstimateDate": "2022-11-04"
        },
        "Cart": [
            {
                "Reference": "1234568",
                "Description": "Tenis Preto Tamanho 42",
                "Quantity": 1,
                "UnitPrice": 9128
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|Guid|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`Payment.Type`|Nome do tipo do meio de pagamento.|Texto|15|Sim|
|`Payment.Amount`|Valor total da transação (`Options.TotalAmount` do passo anterior) para ser submentido para a aprovação (em centavos).|Número|10|Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.MerchantIdentification`|CNPJ da loja.|Texto|18|Não|
|`Payment.MerchantCorporateName`|Nome fantasia da loja.|Texto|50|Não|
|`Payment.FingerprintId`|'FraudID' obtido junto à Koin via JavaScript (Passo 1 desse manual).|Texto|255|Sim|
|`Payment.InstallmentOptionId`|'Options.ID' escolhido como o plano a ser autorizado obtido na consulta (Passo 2 desse manual)|Texto|255|Sim|
|`Payment.FineRate`|Valor da multa após o vencimento, em percentual, com base no valor da transação(%)*Não envie junto com `Payment.FineAmount`*.|Número|2|Não|
|`Payment.FineAmount`|Valor da multa após o vencimento sobre o valor total. *Não envie junto com `Payment.FineRate`*.|Número|10|Não|
|`Payment.DiscountRate`|Valor do desconto, em percentual, com base no valor da transação(%). *Não envie junto com `Payment.DiscountAmount`*. |Número|2|Não|
|`Payment.DiscountAmount`|Valor do desconto sobre o valor total. *Não envie junto com `Payment.DiscountRate`*.|Número|10|Não|
|`Shipping.Amount`|Valor estimado para a entrega (em centavos).|Número|10|Sim|
|`Shipping.DeliveryEstimateDate`|Data estimado para a entrega. Formato: YYYY-MM-DD|Data|10|Sim|
|`Cart.Reference`|SKU do produto ou serviço.|Texto|50|Sim|
|`Cart.Description`|Descrição do produto ou serviço.|Texto|50|Sim|
|`Cart.Quantity`|Quantidade comprada daquele produto.|Número|100|Sim|
|`Cart.UnitPrice`|Preço unitário do produto (em centavos).|Número|100|Sim|

### Resposta

```json
{
    "MerchantOrderId": "401904531",
    "Customer": {
        "Name": "Cliente Teste",
        "Identity": "054.920.250-15",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "PhoneAreaCode": "11",
        "Phone": "5521976781114",
        "Birthdate": "1991-01-02",
        "IpAddress": "127.0.0.1",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "Business"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "Business"
        },
    },
    "Payment": {
        "FingerprintId": "9a6ce08d275bj4106396f2aa982fc2158254k",
        "InstallmentOptionId": "CqEQjSgSB0w34TdAoVcX1lZYvWXZghXvst/UpfjnankRA+drdpRTzDdzIrUKiEyN",
        "AcquirerTransactionId": "977162",
        "Shipping": {
            "Amount": 1098,
            "DeliveryEstimateDate": "2022-11-04"
        },
        "Cart": [
            {
                "Reference": "1234568",
                "Description": "Tenis Preto Tamanho 42",
                "Quantity": 1,
                "UnitPrice": 9128
            }
        ],
        "PaymentId": "3c814db0-a10e-4363-ab2d-91df83c57304",
        "Type": "BuyNowPayLater",
        "Amount": 10280,
        "ReceivedDate": "2022-05-11 12:03:06",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Koin",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "200",
        "ProviderReturnMessage": "Sua compra foi APROVADA! Obrigado por comprar com a KOIN.",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/3c814db0-a10e-4363-ab2d-91df83c57304"
            }
        ]
    }
},
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|----|-------|-----------|---------|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReturnCode`|Código retornado pelo provedor do meio de pagamento.|Texto|32|Ex.: "200"|
|`ReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento.|Texto|512|"Sua compra foi APROVADA! Obrigado por comprar com a KOIN."|
|`Status`|Status da transação.|Byte|02|Ex.: 2|

# Segmentos

Visando aumentar a segurança e a conversão das aprovações de suas transações, a Koin disponibiliza formas de enviar mais detalhes da transação que você está submetendo para autorização. São diversas informações disponíveis sobre os produtos vendidos e/ou serviços prestados, como educação, aluguel de carros e hospedagem. Para cada um dos segmentos é necessário incluir as informações inerentes àquela transação.

## Exemplo Multisegmentos

<aside class="warning">Permitimos o envio de informações multisegmento numa mesma transação. Basta apontar os segmentos no nó `ProductTypes` e incluir as chaves relativas à cada segmento daquela autorização que está submentendo à Koin.</aside>

Utilize os nós concatenávies `ProductTypes` e `AdditionalData` para indicar os segmentos que irá submeter e que estão envolvidos nesse pedido de autorização.

```json
{
    "MerchantOrderId": "2017166516111329",
    "Customer": {
        "Name": "Cliente Teste",
        "Identity": "054.920.250-15",
        "IdentityType": "CPF",
        "Email": "milton@braspag.com.br",
        "PhoneAreaCode": "11",
        "Phone": "5521976781114",
        "Birthdate": "1991-01-02",
        "IpAddress": "127.0.0.1",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "Business"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "Business"
        },
    },
    "Payment": {
        "Type": "BuyNowPayLater",
        "Amount": 10000,
        "Provider": "Koin",
        "FingerprintId": "9a6ce08d275bj4106396f2aa982fc2158254k",
        "InstallmentOptionId": "CqEQjSgSB0w34TdAoVcX1lZYvWXZghXvst/UpfjnankRA+drdpRTzDdzIrUKiEyN",
        "ProductTypes": [
            "Segmento1",
            "Segmento2",
            "Segmento3"
        ],
        "OfferExpirationDate": "2022-11-07 12:00:00",
        "ShippingData": {
            "Amount": 10000,
            "DeliveryEstimateDate": "2020-11-04"
        },
        "Cart": [
            {
                "Reference": "1234568",
                "Description": "Tenis Preto Tamanho 42",
                "Quantity": 1,
                "UnitPrice": 9128
            }
        ],
        "AdditionalData": {
            "Segmento1": [...],
            "Segmento2": [...],
            "Segmento3": [...]
        }
    }
}
```

**ProductTypes** disponíveis atualmente:

|Nome do Segmento|Valor Esperado|
|------------|------------------|
|Dados do usuário|"UserAccountData" * |
|Educação|Class|
|Aluguel de Carros|CarRental|
|Passagens aéreas|Airline|
|Hospedagem|Lodging|
|Serviços no Destino|DestinationService|
|Seguro de telefone|CellphoneInsurance|
|Débitos Veiculares|CarPenaltyFee|

<aside class="warning">*É recomendável utilizar "UserAccountData" junto com o outro segmento toda vez que o usuário logado em seu sistema não for o mesmo que estiver efetuando a compra, por exemplo, uma pessoa comprando uma passagem no nome de outra pessoa.</aside>

## Dados do Usuário

```json
"UserAccountData": {
    "Name": "Nome Usuário Logado",
    "Email": "account_user@koin.com.br",
    "Document": {
        "Key": "CPF",
        "Value": "36264448800"
    },
    "Phone": {
        "AreaCode": 11,
        "Number": "98588-8888",
        "PhoneType": 4
    },
    "Address": {
        "Country": "BRA",
        "State": "SP",
        "City": "São Paulo",
        "District": "Jd, Matarazzo",
        "ZipCode": "03813310",
        "Street": "Rua, Japichaua",
        "Number": "100",
        "Complement": "Casa casa",
        "AddressType": 1
    }
},
```

| Propriedade                           | Descrição                                                                 | Tipo  | Tamanho |Obrigatório  |
|---------------------------------------|---------------------------------------------------------------------------|-------|---------|-------------|
| UserAccountData.Name                  | Nome do usuário logado na loja.                                           | Texto |   100   | Sim         |
| UserAccountData.Email                 | E-mail do usuário logado na loja.                                         | Texto |   300   | Sim         |
| UserAccountData.Document.Key          | Documento do usuário logado.                                              | Texto |    14   | Sim         |
| UserAccountData.Document.Value        | Número do CPF do usuário logado.                                          | Texto |    14   | Sim         |
| UserAccountData.Phone.AreaCode        | Código de área.                                                           | Número|    -    | Sim         |
| UserAccountData.Phone.Number          | Número de telefone.                                                       | Texto |    10   | Sim         |
| UserAccountData.Phone.PhoneType       | Tipo de telefone do pagador: 2 = Residencial / 3= Comercial / 4= Celular. | Número|    -    | Sim         |
| UserAccountData.Address.ZipCode       | CEP do usuário logado.                                                    | Texto |    10   | Não         |
| UserAccountData.Address.Street        | Rua do endereço.                                                          | Texto |   100   | Não         |
| UserAccountData.Address.Number        | Número do endereço.                                                       | Texto |    10   | Não         |
| UserAccountData.Address.Complement    | Complemento do endereço.                                                  | Texto |   300   | Não         |
| UserAccountData.Address.District      | Bairro do endereço.                                                       | Texto |    50   | Sim         |
| UserAccountData.Address.City          | Cidade do endereço.                                                       | Texto |    50   | Não         |
| UserAccountData.Address.State         | Estado do endereço.                                                       | Texto |    2    | Não         |
| UserAccountData.Address.Country       | País do endereço.                                                         | Texto |    50   | Não         |
| UserAccountData.Address.AdressType    | Tipo do endereço: 1 = Residencial / 2 = Comercial.                        | Texto |     1   | Não         |

## Educação

```json
"ClassData": {
    "ClassDetails": [
        {
            "ClassName": "Nome do Curso",
            "ClassFinanceType": "1",
            "ClassSchoolName": "Nome da Escola",
            "ClassCourseLoad": "1800",
            "ClassSchoolCampus": "Campus Mooca",
            "ClassSchoolCampusCity": "Campus Mooca",
            "ClassStartDate": "2020-07-27",
            "ClassEndDate": "2021-07-27",
            "ClassIsPresential": "Y",
            "ClassPeriod": "3",
            "ClassType": {
                "Category": "1",
                "SubCategory": "2",
                "Segment": "Administração de Empre"
            },
            "ClassMonthlyFee": "2000.99",
            "ClassScholarship": "25"
        }
    ],
    "Students": [
        {
            "StudentName": "Nome Completo do Aluno",
            "StudentId": "123456789",
            "StudentRegistration": "123456789",
            "StudentBondPayer": "1",
            "StudentEmail": "caio.moniro@braspag.com.br",
            "StudentPhone": "552133665591",
            "StudentBirthDate": "1988-07-27",
            "StudentDocuments": {
                "Key": "CPF",
                "Value": "00234638625"
            },
            "StudentRegisterDate": "1988-07-27",
            "StudentAddress": {
                "ZipCode": "03813310",
                "Country": "BRA",
                "State": "SP",
                "City": "São Paulo",
                "District": "Jd, Matarazzo",
                "Street": "Rua, Japichaua",
                "Number": "100",
                "Complement": "Casa casa"
            }
        }
    ]
}
```

| Propriedade                                  | Descrição                                | Tipo | Tamanho | Obrigatório     |
|----------------------------------------------|------------------------------------------|------|---------|-----------------|
| ClassData.ClassDetails.ClassName             | Nome do Curso.                           | Texto | 100 | Sim             |
| ClassData.ClassDetails.ClassFinanceType      | ClassData.ClassDetails.ClassFinanceType | Número | 1 | Sim             |
| ClassData.ClassDetails.ClassSchoolName       | Instituição de Ensino.                   | Texto | 100 | Sim             |
| ClassData.ClassDetails.ClassCourseLoad       | Carga Horária do Curso (em horas).       | Número | 20 | Sim             |
| ClassData.ClassDetails.ClassSchoolCampus     | Nome do campus/local do curso.           | Texto | 100 |Não             |
| ClassData.ClassDetails.ClassSchoolCampusCity | Cidade do campus/local do curso.         | Texto | 100 | Não             |
| ClassData.ClassDetails.ClassStartDate        | Data de início do curso.                 | Data (formato: yyyy-MM-dd)| 10 | Sim             |
| ClassData.ClassDetails.ClassEndDate          | Data prevista para finalização do curso. | Data (formato: yyyy-MM-dd) | 10 | Sim             |
| ClassData.ClassDetails.ClassIsPresential     | Aulas são presenciais.                   | Texto (Y) | 1 | Sim             |
| ClassData.ClassDetails.ClassPeriod           | Período do curso.                        | Número | 1 | Não             |
| ClassData.ClassDetails.ClassType.Category    | Categoria do curso.                      | Número | 10 |Sim             |
| ClassData.ClassDetails.ClassType.SubCategory | Subcategoria do curso.                  | Número | 10 | Sim             |
| ClassData.ClassDetails.ClassType.Segment     | Segmento do curso.                       | Número | 100 | Não             |
| ClassData.ClassDetails.ClassMonthlyFee       | Mensalidade do curso.                   | Decimal (0000.00)| 7 | Não             |
| ClassData.ClassDetails.ClassScholarship      | Porcentagem da bolsa.                    | Número | 10 | Não             |
| ClassData.Students.StudentName               | Nome do aluno.                           | Texto | 100 | Sim             |
| ClassData.Students.StudentId                 | ID do estudande no MEC.                  | Texto | 50 | Não             |
| ClassData.Students.StudentRegistration       | RA do aluno (registro na instituição).   | Texto  | 100 | Sim             |
| ClassData.Students.StudentBondPayer          | Vínculo do aluno com o comprador.          | Número | 1 | Sim             |
| ClassData.Students.StudentEmail              | E-mail do aluno.                         | Texto | 255 | Sim             |
| ClassData.Students.StudentPhone              | Telefone do aluno.                       | Texto | 15 | Sim             |
| ClassData.Students.StudentBirthDate          | Data de nascimento do aluno.            | Data yyyy-MM-dd| 10 | Sim             |
| ClassData.Students.StudentDocuments.Type     | Tipo de documento do aluno.              | Texto | 14 | Sim             |
| ClassData.Students.StudentDocuments.Number   | Número do documento do aluno.            | Texto | 14 | Sim             |
| ClassData.Students.StudentRegisterDate       | Data da matrícula do aluno.             | Data yyyy-MM-dd| 10 | Não             |
| ClassData.Students.ZipCode                   | CEP do endereço do aluno.                | Texto | 20 | Sim             |
| ClassData.Students.Country                   | País do endereço do aluno.               | Texto | 20 | Sim             |
| ClassData.Students.State                     | Estado do endereço do aluno.             | Texto | 2 | Sim             |
| ClassData.Students.City                      | Cidade do endereço do aluno.             | Texto | 20 | Sim             |
| ClassData.Students.District                  | Bairro do endereço do aluno.             | Texto | 20 | Sim             |
| ClassData.Students.Street                    | Rua do endereço do aluno.                | Texto | 20 | Sim             |
| ClassData.Students.Number                    | Número da casa do aluno.                 | Texto | 10 | Sim             |
| ClassData.Students.Complement                | Complemento do endereço do aluno.       | Texto | 200 | Não             |

## Aluguel de Carros

```json
"CarRentalData": [
    {
        "CarRentalCompany": "Unidas",
        "CarDescription": "Volkswagen T-Cross Automática",
        "CarCategory": "CA",
        "PickUpDateTime": "2019-12-25 16:30:00",
        "ReturnDateTime": "2019-12-27 16:30:00",
        "PickUpLocation": {
            "ZipCode": "01310-300",
            "Street": "Av. Paulista",
            "Number": "2421",
            "Complement": "",
            "District": "Bela Vista",
            "City": "São Paulo",
            "State": "SP",
            "Country": "Brasil"
        },
        "ReturnLocation": {
            "ZipCode": "01310-300",
            "Street": "Av. Paulista",
            "Number": "2421",
            "Complement": "",
            "District": "Bela Vista",
            "City": "São Paulo",
            "State": "SP",
            "Country": "Brasil"
        },
        "Drivers": [
            {
                "DriverName": "Nome do Condutor Principal",
                "DriverEmail": "email_condutor_principal@dominio.com.br",
                "DriverBirthDate": "1988-07-27",
                "DriverPhone": "552133665591",
                "DriverGender": "2",
                "DriverDocuments": {
                    "Key": "CPF",
                    "Value": "00132618605"
                }
            },
            {
                "DriverName": "Nome do Segundo Condutor ",
                "DriverEmail": "email__segundo_condutor@dominio.com.br",
                "DriverBirthDate": "1985-02-15",
                "DriverPhone": "552133665577",
                "DriverGender": "1",
                "DriverDocuments": {
                    "Key": "CPF",
                    "Value": "00234638625"
                }
            }
        ]
    }
]
```

| Propriedade                                  | Descrição                                     | Tipo | Tamanho |Obrigatório      |
|----------------------------------------------|-----------------------------------------------|------|---------|------------------|
| CarRentalData.CarRentalCompany               | Nome da locadora.                              | Texto | 300 | Sim              |
| CarRentalData.CarDescription                 | Descrição do veículo.                         | Texto | 300 | Sim              |
| CarRentalData.CarCategory                    | Categoria do veículo.                         | Texto | 50 | Sim              |
| CarRentalData.PickUpDateTime                 | Data e hora da retirada do veículo.            | Data (yyyy-MM-dd HH:mm:ss)| 10 | Sim              |
| CarRentalData.ReturnDateTime                 | Data e hora da devolução do veículo.           | Data (yyyy-MM-dd HH:mm:ss)| 10 | Sim              |
| CarRentalData.PickUpLocation.ZipCode         | CEP do endereço de retirada.                   | Texto  | 10 | Não              |
| CarRentalData.PickUpLocation.Street          | Rua do endereço de retirada.                   | Texto  | 100 | Sim              |
| CarRentalData.PickUpLocation.Number          | Número do endereço de retirada.                | Texto | 10 | Não              |
| CarRentalData.PickUpLocation.Complement      | Complemento do endereço de retirada.           | Texto | 300 | Não              |
| CarRentalData.PickUpLocation.District        | Bairro do endereço de retirada.                | Texto | 100 | Não              |
| CarRentalData.PickUpLocation.City            | Cidade do endereço de retirada.                | Texto | 100 | Sim              |
| CarRentalData.PickUpLocation.State           | Estado do endereço de retirada.                | Texto | 2 | Sim              |
| CarRentalData.PickUpLocation.Country         | País do endereço de retirada.                  | Texto | 100 | Sim              |
| CarRentalData.ReturnLocation.ZipCode         | CEP do endereço de devolução.                  | Texto | 10 | Não              |
| CarRentalData.ReturnLocation.Street          | Rua do endereço de devolução.                  | Texto | 100 | Sim              |
| CarRentalData.ReturnLocation.Number          | Número do endereço de devolução.               | Texto | 10 | Não              |
| CarRentalData.ReturnLocation.Complement      | Complemento do endereço de devolução.          | Texto | 300 | Não              |
| CarRentalData.ReturnLocation.District        | Bairro do endereço de devolução.               | Texto | 100 | Não              |
| CarRentalData.ReturnLocation.City            | Cidade do endereço de devolução.               | Texto | 100 | Sim              |
| CarRentalData.ReturnLocation.State           | Estado do endereço de devolução.               | Texto | 2 | Sim              |
| CarRentalData.ReturnLocation.Country         | País do endereço de devolução.                 | Texto | 100 | Sim              |
| CarRentalData.Drivers.DriverName             | Nome do condutor.                              | Texto | 100 | Sim              |
| CarRentalData.Drivers.DriverEmail            | E-mail do condutor.                            | Texto | 300 | Sim              |
| CarRentalData.Drivers.DriverBirthDate        | Data de nascimento do condutor.               | Data (formato: yyyy-MM-dd)| 10 | Sim              |
| CarRentalData.Drivers.DriverPhone            | Telefone do condutor.                          | Texto | 15 | Não              |
| CarRentalData.Drivers.DriverGender           | Sexo do condutor (1= Feminino / 2= Masculino). | Número | 1 | Não              |
| CarRentalData.Drivers.DriverDocuments.Type   | Tipo do documento do condutor.                 | Texto | 14 | Sim              |
| CarRentalData.Drivers.DriverDocuments.Number | Número do documento do condutor.               | Texto | 14 | Sim              |

## Linhas Aéreas

```json
"AirlineData": {
    "Legs": [
        {
            "LegNumber": "1",
            "Origin": "CGH",
            "Destination": "REC",
            "FlightNumber": "1063",
            "DepartureTime": "2019-04-06 06:20:00",
            "StopOverAllowed": "Y",
            "IdClass": "F",
            "AirlineRefund": "N"
        }
    ],
    "Passengers": [
        {
            "PassengerName": "Nome Completo do Passageiro 1",
            "PassengerEmail": "caio.monteiro@braspag.com.br",
            "PassengerPhone": "552133665591",
            "PassengerBirthDate": "1958-12-22",
            "PassengerRating": "Adult",
            "PassengerStatus": "Gold",
            "PassengerNationality": "Brasil",
            "PassengerDocuments": [
                {
                    "Key": "CPF",
                    "Value": "396.469.778-80"
                }
            ]
        },
        {
            "PassengerName": "Nome Completo do Passageiro 2",
            "PassengerEmail": "caio.monteiro2@braspag.com.br",
            "PassengerPhone": "552133665599",
            "PassengerBirthDate": "1988-12-22",
            "PassengerRating": "Adult",
            "PassengerStatus": "Gold",
            "PassengerNationality": "Brasil",
            "PassengerDocuments": [
                {
                    "Key": "CPF",
                    "Value": "463.109.140-14"
                }
            ]
        }
    ]
}
```

| Propriedade                                      | Descrição                                | Tipo                       | Tamanho | Obrigatório |
|--------------------------------------------------|------------------------------------------|----------------------------|---------|-------------|
| AirlineData.Legs.LegNumber                       | Identificação sequencial da leg.          | Número                     | 2       | Sim         |
| AirlineData.Legs.Origin                          | Sigla do aeroporto de origem do voo.        | Texto                      | 3       | Sim         |
| AirlineData.Legs.Destination                     | Sigla do aeroporto de destino do voo.        | Texto                      | 3       | Sim         |
| AirlineData.Legs.FlightNumber                    | Numero do voo.                            | Texto                      | 10      | Sim         |
| AirlineData.Legs.DepartureTime                   | Data e hora da partida do voo.           | Data (yyyy-MM-dd HH:mm:ss) | 10      | Sim         |
| AirlineData.Legs.IdClass                         | Id da classe da viagem.                   | Texto - F / J / Y / W      | 1       | Sim         |
| AirlineData.Legs.StopOverAllowed                 | *Stop Over* é permitido?                 | Texto - Y = Yes / N = No   | 1       | Sim         |
| AirlineData.Legs.AirlineRefund                   | Indica se passagem é reembolsável.        | Texto - Y = Yes / N = No   | 1       | Não         |
| AirlineData.Passengers.PassengerName             | Nome do passageiro.                       | Texto                      | 100     | Sim         |
| AirlineData.Passengers.PassengerEmail            | E-mail do passageiro.                     | Texto                      | 300     | Sim         |
| AirlineData.Passengers.PassengerPhone            | Telefone do passageiro.                   | Texto                      | 15      | Sim         |
| AirlineData.Passengers.PassengerBirthDate        | Data de nascimento do passageiro.         | Data (yyyy-MM-dd HH:mm:ss) | 10      | Sim         |
| AirlineData.Passengers.PassengerRating           | Classificação do passageiro.              | Texto                      | 10      | Não         |
| AirlineData.Passengers.PassengerStatus           | Classificação do passageiro na companhia aérea. | Texto                      | 10      | Não         |
| AirlineData.Passengers.PassengerNationality      | Nacionalidade do passageiro.              | Texto                      | 50      | Não         |
| AirlineData.Passengers.PassengerDocuments.Type   | Tipo do documento do passageiro.          | Texto                      | 14      | Sim         |
| AirlineData.Passengers.PassengerDocuments.Number | Número do documento do passageiro.        | Texto                      | 50      | Sim         |

## Hospedagem

```json
    "LodgingData": {
    "Lodgings": [
        {
            "LodgingName": "Pousada Porto Mar",
            "CheckInDate": "2019-04-06",
            "CheckOutDate": "2019-04-13",
            "Duration": "7",
            "LodgingRefund": "N",
            "LodgingAddress": {
                "ZipCode": "01311-300",
                "Street": "Av. Paulista",
                "Number": "1728",
                "Complement": "7 andar",
                "District": "Bela Vista",
                "City": "São Paulo",
                "State": "SP",
                "Country": "Brasil",
                "Type": "1"
            }
        },
        {
            "LodgingName": "Pousada Recanto do Mar",
            "CheckInDate": "2019-04-06",
            "CheckOutDate": "2019-04-13",
            "Duration": "7",
            "LodgingRefund": "N",
            "LodgingAddress": {
                "ZipCode": "01311-300",
                "Street": "Av. Paulista",
                "Number": "1728",
                "Complement": "7 andar",
                "District": "Bela Vista",
                "City": "São Paulo",
                "State": "SP",
                "Country": "Brasil",
                "Type": "1"
            }
        }
    ],
    "Lodgers": [
        {
            "LodgerName": "Nome Completo do Passageiro 1",
            "LodgerEmail": "caio.montediro@braspag.com.br",
            "LodgerPhone": "552133665591",
            "LodgerDocuments": [
                {
                    "Key": "CPF",
                    "Value": "396.469.778-80"
                }
            ]
        }
    ]
}
```

| Propriedade                              | Descrição                                      | Tipo                      | Tamanho | Obrigatório |
|------------------------------------------|------------------------------------------------|---------------------------|---------|-------------|
| LodgingData.LodgingName                  | Nome do hotel/pousada.                         | Texto                     | 100     | Sim         |
| LodgingData.CheckInDate                  | Data de checkin.                               | Data (yyyy-MM-dd)         | 10      | Sim         |
| LodgingData.CheckOutDate                 | Data de checkout.                              | Data(yyyy-MM-dd)          | 10      | Sim         |
| LodgingData.Duration                     | Duração da hospedagem (noites).                | Texto                     | 5       | Não         |
| LodgingData.LodgingRefund                | Indica se hospedagem é reembolsável.           | Texto  - Y = Yes / N = No | 1       | Sim         |
| LodgingData.Address.ZipCode              | CEP do hotel/pousada.                          | Texto                     | 10      | Sim         |
| LodgingData.Address.Street               | Rua do hotel/pousada.                          | Texto                     | 100     | Sim         |
| LodgingData.Address.Number               | Número do hotel/pousada.                       | Texto                     | 10      | Sim         |
| LodgingData.Address.Complement           | Complemento do hotel/pousada.                  | Texto                     | 100     | Sim         |
| LodgingData.Address.District             | Bairro do hotel/pousada.                       | Texto                     | 100     | Sim         |
| LodgingData.Address.City                 | Cidade do hotel/pousada.                       | Texto                     | 100     | Sim         |
| LodgingData.Address.State                | Estado do hotel/pousada.                       | Texto                     | 2       | Sim         |
| LodgingData.Address.Country              | País do hotel/pousada.                         | Texto                     | 100     | Sim         |
| LodgingData.Lodger.LodgerName            | Nome do hóspede.                               | Texto                     | 100     | Sim         |
| LodgingData.Lodger.LodgerEmail           | E-mail do hóspede.                             | Texto                     | 300     | Não         |
| LodgingData.Lodger.LodgerPhone           | Telefone do hóspede.                           | Texto                     | 15      | Não         |
| LodgingData.Lodger.LodgerDocument.Type   | Tipo de documento do hóspede.                  | Texto                     | 14      | Sim         |
| LodgingData.Lodger.LodgerDocument.Number | Número de documento hóspede.                   | Texto                     | 14      | Sim         |
| CarData.CarOwnerDocument.Key             | Documento do proprietário do veículo.          | Texto                     | 14      | Sim         |
| CarData.CarOwnerDocument.Value           | Número do documento do proprietário do veículo.| Texto                     | 14      | Sim         |
| CarData.CarMake                          | Marca do veículo.                              | Texto                     | 50      | Não         |
| CarData.CarModel                         | Modelo do veículo.                             | Texto                     | 50      | Não         |
| CarData.CarModelYear                     | Ano do modelo do veículo.                      | Data (formato: YYYY)      | 10      | Não         |
| CarPendencies.PenaltyValue               | Somatória do valor das multas.                 | Número                    | 12      | Sim         |
| CarPendencies.LicensingValue             | Somatória do valor do licenciamento.           | Número                    | 12      | Sim         |
| CarPendencies.IpvaValue                  | Somatória do valor das parcelas do IPVA.       | Número                    | 12      | Sim         |
| CarPendencies.InsuranceValue             | Somatória do valor do seguro.                  | Número                    | 12      | Sim         |
| CarPendencies.PendenciesReferenceYear    | Ano de referência de cada pendência.           | Data (formato: YYYY)      | 4       | Sim         |

## Serviços no Destino

```json
"DestinationServiceData": {
    "DSDetails": [
        {
            "DSId": "",
            "DSType": "1",
            "DSName": "P.172 INDISSIMA CLASICA, TRINAGULO DE ORO",
            "DSDescription": "DELHIJAIPURAGRA",
            "DSDateStart": "2020-07-27",
            "DSDateEnd": "2020-09-27",
            "DSDuration": "2",
            "DSOrigin": "DELHI",
            "DSDestination": "AGRA",
            "DSPenaltyDate": "2020-07-10",
            "DSQtPax": "1"
        }
    ],
    "PaxDetails": [
        {
            "PaxName": "Nome Completo do Passageiro",
            "PaxBirthDate": "1988-07-27",
            "PaxEmail": "",
            "PaxPhone": "",
            "PaxDocuments": {
                "Key": "CPF",
                "Value": "00234638625"
            },
            "PaxAddress": {
                "ZipCode": "03813310",
                "Country": "BRA",
                "State": "SP",
                "City": "São Paulo",
                "District": "Jd, Matarazzo",
                "Street": "Rua, Japichaua",
                "Number": "100",
                "Complement": "Casa casa"
            }
        }
    ]
}
```

| Propriedade                              | Descrição                           | Tipo                     | Tamanho | Obrigatório |
|------------------------------------------|-------------------------------------|--------------------------|---------|-------------|
| LodgingData.LodgingName                  | Nome do hotel/pousada.              | Texto                    | 100     | Sim         |
| LodgingData.CheckInDate                  | Data do checkin.                    | Data (YYYY-MM-DD)        | 10      | Sim         |
| LodgingData.CheckOutDate                 | Data do checkout.                   | Data (YYYY-MM-DD)        | 10      | Sim         |
| LodgingData.Duration                     | Duração da hospedagem (noites).     | Texto                    | 5       | Não         |
| LodgingData.LodgingRefund                | Indica se hospedagem é reembolsável.| Texto - Y = Yes / N = No | 1       | Sim         |
| LodgingData.Address.ZipCode              | CEP do hotel/pousada.               | Texto                    | 10      | Sim         |
| LodgingData.Address.Street               | Rua do hotel/pousada.               | Texto                    | 100     | Sim         |
| LodgingData.Address.Number               | Número do hotel/pousada.            | Texto                    | 10      | Sim         |
| LodgingData.Address.Complement           | Complemento do hotel/pousada.       | Texto                    | 100     | Sim         |
| LodgingData.Address.District             | Bairro do hotel/pousada.            | Texto                    | 100     | Sim         |
| LodgingData.Address.City                 | Cidade do hotel/pousada.            | Texto                    | 100     | Sim         |
| LodgingData.Address.State                | Estado do hotel/pousada.            | Texto                    | 2       | Sim         |
| LodgingData.Address.Country              | País do hotel/pousada.              | Texto                    | 100     | Sim         |
| LodgingData.Lodger.LodgerName            | Nome do hóspede.                    | Texto                    | 100     | Sim         |
| LodgingData.Lodger.LodgerEmail           | E-mail do hóspede.                  | Texto                    | 300     | Não         |
| LodgingData.Lodger.LodgerPhone           | Telefone do hóspede.                | Texto                    | 15      | Não         |
| LodgingData.Lodger.LodgerDocument.Type   | Tipo de documento do hóspede.       | Texto                    | 14      | Sim         |
| LodgingData.Lodger.LodgerDocument.Number | Número de documento hóspede.        | Texto                    | 14      | Sim         |

## Débitos Veiculares

```json
"CarPenaltyFeeData": {
    "CarData": {
        "CarDocument": "987",
        "LicensePlate": "ABC1234",
        "Renavam": 12345678910,
        "CarOwnerName": "Dono do Carro",
        "CarOwnerDocument": {
            "Key": "CPF",
            "Value": "362.644.488-00"
        },
        "CarMake": "Toyota",
        "CarModel": "Corolla",
        "CarModelYear": "2008"
    },
    "CarPendencies": [
        {
            "PenaltyValue": 09876,
            "LicensingValue": 20,
            "IpvaValue": 100,
            "InsuranceValue": 1000,
            "PendenciesReferenceYear": "2020"
        },
        {
            "PenaltyValue": 50,
            "LicensingValue": 50,
            "IpvaValue": 50,
            "InsuranceValue": 50,
            "PendenciesReferenceYear": "2013"
        }
    ]
}
```

| Propriedade                           | Descrição                                      | Tipo                 | Tamanho | Obrigatório |
|---------------------------------------|------------------------------------------------|----------------------|---------|-------------|
| CarData.LicensePlate                  | Placa do carro.                                | Texto                | 15      | Sim         |
| CarData.Renavam                       | Número RENAVAM.                                | Texto                | 15      | Sim         |
| CarData.CarOwnerName                  | Nome do proprietário do veículo.               | Texto                | 100     | Sim         |
| CarData.CarOwnerDocument.Key          | Documento do proprietário do veículo.          | Texto                | 14      | Sim         |
| CarData.CarOwnerDocument.Value        | Número do documento do proprietário do veículo.| Texto                | 14      | Sim         |
| CarData.CarMake                       | Marca do veículo.                              | Texto                | 50      | Não         |
| CarData.CarModel                      | Modelo do veículo.                             | Texto                | 50      | Não         |
| CarData.CarModelYear                  | Ano do modelo do veículo.                      | Data (formato: YYYY) | 4       | Não         |
| CarPendencies.PenaltyValue            | Somatória do valor das multas.                 | Número               | 12      | Sim         |
| CarPendencies.LicensingValue          | Somatória do valor do licenciamento.           | Número               | 12      | Sim         |
| CarPendencies.IpvaValue               | Somatória do valor das parcelas do IPVA.       | Número               | 12      | Sim         |
| CarPendencies.InsuranceValue          | Somatória do valor do seguro.                  | Número               | 12      | Sim         |
| CarPendencies.PendenciesReferenceYear | Ano de referência de cada pendência.           | Data (formato: YYYY) | 4       | Sim         |

## Seguro de Celular

```json
    "CellphoneInsuranceData": {
        "Imei": "123456789123456",
        "DeviceModel": "Iphone XR",
        "DeviceCode": "XR125152",
        "SubscriptionDate": "2020-10-21",
        "InsuranceInstallment": 315.4,
        "ExpirationDate": "2021-10-21",
        "Type": "Seguro anti furto"
    },
```

| Propriedade          | Descrição                               | Tipo              | Tamanho | Obrigatório |
|----------------------|-----------------------------------------|-------------------|---------|-------------|
| IMEI                 | IMEI do celular segurado.               | Número            | 15      | Sim         |
| DevideModel          | Nome do modelo do celular.              | Texto             | 80      | Sim         |
| DeviceCode           | Código do celular.                      | Texto             | 80      | Sim         |
| SubscriptionDate     | Data de aquisição do seguro.            | Data (YYYY-MM-DD) | 10      | Sim         |
| InsuranceInstallment | valor da parcela do seguro.             | Decimal           | 3       | Sim         |
| ExpirationDate       | Data de expiração do seguro.            | Data (YYYY-MM-DD) | 10      | Sim         |
| Type                 | Tipo do seguro (Ex.: Seguro anti-furto).| Texto             | 100     | Sim         |

# Estorno

Para facilitar e automatizar eventuais estornos nós disponbilizamos a conexão com a funcionalidade de estorno direto ao comprador via API do Pagador. Para conseguir efetuar estornos parciais ou completos, envie a requisão a seguir:

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{{API Pagador}}/v2/sales/{PaymentId}/void?amount=xxx</span></aside>

## Requisição

```json
{
    "Reason": "Desistencia da compra",
    "AdditionalData": {
        "NonCompliance": false,
        "ValuePenalty": 15000,
        "BankData": {
            "BankCode": "001",
            "BankName": "Banco do Brasil",
            "Agency": "1234-5",
            "Account": "678901-2",
            "AccountType": "1"
        }
    }
}
```

| Propriedade                          | Descrição                                                               | Tipo   | Tamanho | Obrigatório |
|--------------------------------------|-------------------------------------------------------------------------|--------|---------|-------------|
| Amount                               | Valor em centavos a ser cancelado/estornado.                            | Número | 10      | Sim         |
| Reason                               | Motivo do cancelamento.                                                 | Texto  | 255     | Sim         |
| AdditionalData.ValuePenalty          | Valor da multa (este será o novo valor cobrado do cliente).             | Texto  | 255     | Não         |
| AdditionalData.NonCompliance         | Indica se houve cancelamento por inadimplência (Y = sim /N = não).       | Texto  | 255     | Sim         |
| AdditionalData.BankData.BankCode     | Código do banco.                                                        | Texto  | 10      | Sim         |
| AdditionalData.BankData.BankName     | Nome do banco.                                                          | Texto  | 100     | Sim         |
| AdditionalData.BankData.Agency       | Número de agência bancária.                                             | Texto  | 50      | Sim         |
| AdditionalData.BankData.Account      | Número da conta bancária.                                               | Texto  | 50      | Sim         |
| AdditionalData.BankData.AcccountType | Tipo da Conta Bancária. Sendo: 1 = Conta Corrente e 2 = Conta Poupança. | Número | 1       | Sim         |

## Resposta

```json
{
    "Status": 11,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "12100",
    "ProviderReturnMessage": "Processamento realizado com sucesso.",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/97289024-fbd7-438f-a76b-b5b22c7ef29e"
        }
    ]
}
```

| Propriedade           | Descrição                        | Tipo  | Tamanho |
|-----------------------|----------------------------------|-------|---------|
| Status                | Status da transação.             | Byte  | 2       |
| ReasonCode            | Código de retorno da operação.   | Texto | 32      |
| ReasonMessage         | Mensagem de retorno da operação. | Texto | 512     |
| ProviderReturnCode    | Código retornado pela Koin.      | Texto | 255     |
| ProviderReturnMessage | Mensagem retornada pela Koin.    | Texto | 512     |
