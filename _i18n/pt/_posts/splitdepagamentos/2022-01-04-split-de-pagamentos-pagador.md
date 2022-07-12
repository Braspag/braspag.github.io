---
layout: manual
title: Split de Pagamentos - Pagador Braspag
description: Manual Integração do Split de Pagamentos
search: true
toc_footers: false
categories: manual
sort_order: 2
hub_visible: false
tags:
  - 6. Soluções para Marketplace
language_tabs:
  json: JSON
  shell: cURL
---

# Visão geral

![FluxoSplit]({{ site.baseurl_root }}/images/braspag/split/split1-fluxo-geral.png)

O **Split de Pagamentos** é um serviço de subadquirência para marketplaces e outros modelos de negócio que precisam dividir o valor de uma venda entre diferentes participantes. Funciona tanto para e-commerce quanto para mundo físico.

O Split de Pagamentos atua em todo o fluxo de venda e pagamento:

![SplitSubadquirenciaGeral]({{ site.baseurl_root }}/images/braspag/split/split2-subadquirencia.png)

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
<br/>
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

>**Crédito**: em até 31 dias.<br>
>**Crédito Parcelado**: 1ª parcela em até 31 dias, demais a cada 30 dias.<br>
>**Débito**: em até 2 dias úteis.<br>
>**Boleto**: em até 2 dias úteis após a confirmação do pagamento.

Na divisão de uma transação, você deve informar:

* Os **identificadores (MerchantId) dos subordinados e do master**, caso também participe da venda;
* Os **valores correspondentes a cada participante**. O somatório deverá ser igual ao valor total da transação;
* As **taxas** a serem aplicadas sobre o valor de cada subordinado destinadas ao master. Essas taxas deverão ser acordadas previamente entre master e subordinado.

<br/>Quando o master participa da divisão, passa a ter também o papel de subordinado e a ter seus próprios produtos no carrinho.

## Taxas

As taxas acordadas entre os participantes podem ser um MDR (%) e/ou uma Tarifa Fixa (R$), e devem ser definidas no momento do cadastro do master e dos seus subordinados junto à Braspag.

As taxas podem ser enviadas no momento transacional (captura) ou pós-transacional. Caso não sejam enviadas, o Split vai considerar as taxas cadastradas e acordadas previamente entre os participantes.

>**MDR (Merchant Discount Rate)**: percentual a ser descontado do valor de uma transação, definido por produto (crédito/débito/boleto), bandeira e faixa de parcelamento.<br>
>**Tarifa fixa**: também chamada de fee transacional. Valor em centavos a ser cobrado por transação capturada. É descontado no momento da “montagem” da agenda financeira.

### Braspag

A Braspag acordará um MDR e/ou uma Tarifa Fixa com o master, que serão descontadas do valor total de cada transação. 

O master, de conhecimento destas taxas, negociará também um MDR e/ou uma Tarifa Fixa com cada Subordinado. Se desejar, pode embutir o MDR e/ou Tarifa acordados junto à Braspag.

![SplitExTaxas]({{ site.baseurl_root }}/images/braspag/split/split3-taxas.png)
 
* A Tarifa Fixa acordada entre o master e a Braspag não é aplicada no valor total da transação, ou seja, não entra no cálculo da divisão, e é debitada diretamente do montante que o master tem para receber junto à Braspag. 
* O MDR entra no cálculo de divisão da transação, considerando o valor total da transação, já que o MDR deve estar embutido no MDR acordado entre o master e seus subordinados.

> **Taxa Braspag**: MDR Braspag (%) + Tarifa Fixa Braspag (R$)

### Master

O master é responsável por acordar as taxas a serem cobradas dos seus subordinados, definindo um MDR maior ou igual ao MDR definido com a Braspag, e uma Tarifa Fixa, que é opcional.

> Taxa Master: MDR Master (%) + Tarifa Fixa (R$), na qual o MDR Master (%) pode embutir o MDR Braspag (%).

### Exemplo da divisão e taxas

Uma transação de R$100,00, realizada por um master com participação do subordinado A.

![SplitExemplo1]({{ site.baseurl_root }}/images/braspag/split/split4-exemplo1-taxas.png)
 
Neste exemplo, foram assumidos os seguintes acordos:

>**Taxa Braspag**: 2% de MDR + R$0,10 de Tarifa Fixa.<br>
>**Taxa Master**: 4% de MDR (embutindo os 2% de MDR da Braspag) + R$0,30 de Tarifa Fixa.

Após a divisão, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado:**

* Crédito de R$96,00 (R$100,00 da transação menos R$4,00 de MDR); 
* Débito de R$0,30 de Tarifa Fixa.

<br/>O **total a receber** pelo subordinado será **R$95,70**.

**Master:**

* Crédito de R$2,30 (R$4,00 de MDR mais R$0,30 de Tarifa Fixa do subordinado, menos R$2,00 de MDR da Braspag);
* Débito de R$0,10 (Tarifa Fixa acordada com a Braspag).

<br/>O **total a receber** pelo master será **R$2,20**.

**Braspag:**

* Crédito de R$2,10 (R$2,00 de MDR aplicado sobre o valor total da transação mais R$0,10 de Tarifa Fixa acordada com o Master).

<br/>O **total a receber** pela Braspag será **R$2,10**.

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

É possível dividir uma venda enviada para o Pagador em várias liquidações para contas diferentes através do Split Braspag. Para utilizar o Split, é necessário contratar o serviço com seu [executivo comercial](https://www.braspag.com.br/contato/).

## Sandbox

> Solicite suas credenciais para o ambiente de teste com o nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br).

|API|URL|DESCRIÇÃO|
|---|---|---|
|**Braspag OAUTH2 Server**|https://authsandbox.braspag.com.br/| Autenticação.|
|**API Transacional Pagador**|https://apisandbox.braspag.com.br/|Envio das requisições de transações de crédito, débito e boleto, com ou sem o nó da divisão.|
|**API para Serviços de Consultas Pagador**|https://apiquerysandbox.braspag.com.br/| Consulta de transações.|
|**API Split**|https://splitsandbox.braspag.com.br/|Divisão da transação e desconto de taxas no momento pós-transacional.|

## Produção

> Você receberá as credenciais para o ambiente de produção durante o onboarding.

|API|URL|DESCRIÇÃO|
|---|---|---|
|**Braspag OAUTH2 Server**|https://auth.braspag.com.br/|Autenticação.|
|**API Transacional Pagador**|https://api.braspag.com.br/|Envio das requisições de transações de crédito, débito e boleto, com ou sem o nó da divisão.|
|**API para Serviços de Consultas Pagador**|https://apiquery.braspag.com.br/| Consulta de transações.|
|**API Split**|https://split.braspag.com.br/|Divisão da transação e desconto de taxas no momento pós-transacional.|

# Integração

# Autorização  

Para submeter uma transação do Pagador ao Split, basta enviar o Parâmetro `Payment.DoSplit` como true e adicionar o nó `Payment.SplitPayments`.

# Fluxo transacional padrão

Veja um exemplo do fluxo transacional padrão no Split de Pagamentos.

![FluxoTransacionalSplit]({{ site.baseurl_root }}/images/braspag/split/split6-fluxo-transacional-padrao.png)

A próxima seção apresentará exemplos de transações de crédito, débito e boleto. É importante lembrar que nas respostas das requisições das transações, o Split retornará a divisão do valor da venda, MDR e taxa fixa, mas o desconto das taxas será feito posteriormente, na agenda financeira.

> Em todos os exemplos a seguir a divisão da transação segue o modelo de Split Transacional, ou seja, a divisão é solicitada no momento da captura.

## Transação de Crédito

Ao informar um tipo de pagamento referente ao Split, a API do Pagador automaticamente identifica que a transação é referente ao Split de Pagamentos e realiza o fluxo transacional através da Braspag.

Caso a transação enviada seja marcada para captura automática, é necessário enviar o nó contendo as regras de divisão; caso contrário a transação será dividida entre a Braspag e o master. Posteriormente é permitido que o master envie novas regras de divisão para a transação através da API Split, desde que esteja dentro do período de tempo permitido.

> Para transações **com análise de fraude**, siga a requisição do capítulo [**Antifraude**](https://braspag.github.io//manual/split-de-pagamentos-pagador#antifraude) deste manual.

### Transação de crédito sem o nó da divisão  

Neste caso, o master recebe o valor da transação descontado o MDR acordado com a Braspag. Como apresentado anteriormente, a Tarifa Fixa acordada entre o master e a Braspag é sensibilizada diretamente na agenda de ambas as partes.

![SplitEx2]({{ site.baseurl_root }}/images/braspag/split/split7-exemplo2-sem-no.png)

> **Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.

**Master:**

* Crédito de R$98,00 (R$100,00 da transação menos R$2,00 de MDR da Braspag);
* Débito de R$0,10 (Tarifa Fixa acordada com a Braspag).

<br/>O **total a receber** pelo master será **R$97,90**.
 
**Braspag:**

* Crédito: R$2,10 (MDR aplicado sobre o valor total da transação mais R$0,10 (Tarifa Fixa acordada com o Master).

<br/>O **total a receber** pela Braspag será **R$2,10**.

Veja a requisição dessa transação no valor de R$100,00, com captura automática, sem o nó contendo as regras de divisão.

#### Requisição

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
            ]
        }
    }
}
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantId`|GUID|36|Sim (envio no *header*)|Identificador da loja na Braspag.|
|`MerchantKey`|Texto|40|Sim (envio no *header*)|Chave pública para autenticação dupla na Braspag.|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido|
|`Customer.Email`|Texto|255|Não|Email do comprador|
|`Customer.Name`|Texto|255|Sim|Nome do comprador|
|`Customer.Identity`|Texto |14 |Não|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Mobile`|Texto|14|Não*|Celular do comprador|
|`Customer.Phone`|Texto|14|Não*|Telefone do comprador|
|`Customer.DeliveryAddress.Street`|Texto|255|Não*|Endereço do comprador|
|`Customer.DeliveryAddress.Number`|Texto|15|Não*|Número do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Complement`|Texto|50**|Não*|Complemento do endereço de entrega do pedido|
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
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador. Na fatura, o sofdescriptor pode ser encurtado de acordo com as regras da adquirente e bandeira.|
|`CreditCard.CardNumber`|Texto|19|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.SaveCard`|Booleano|---|Não (Default false)|Booleano que identifica se o cartão será salvo para gerar o token (CardToken)|

<aside class="warning">**Em uma transação com análise de fraude os campos podem ter tamanhos diferentes, como é o caso do campo `Customer.DeliveryAddress.Complement`. Nesse caso, consulte a requisição do capítulo Antifraude neste mesmo manual.</aside>

#### Resposta

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

### Transação de crédito com o nó da divisão  

![SplitEx3]({{ site.baseurl_root }}/images/braspag/split/split8-exemplo3-com-no.png)

O próximo exemplo corresponde a uma transação no valor de R$100,00 com o nó contendo as regras de divisão. Neste exemplo foram assumidas as seguintes taxas:

>**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.<br>
>**Taxa Master com o Subordinado A**: 5% MDR (embutindo os 2% do MDR Braspag) + 0,30 Tarifa Fixa.<br>
>**Taxa Master com o Subordinado B**: 4% MDR (embutindo os 2% do MDR Braspag) + 0,15 Tarifa Fixa.

**Subordinado A:**

* Crédito de R$57,00 (R$60,00 da transação menos R$3,00 de MDR);
* Débito de R$0,30 de Tarifa Fixa.

<br/>O **total a receber** pelo subordinado A será **R$56,70**.

**Subordinado B:**

* Crédito de R$38,40 (R$40,00 da transação menos R$1,60 de MDR);
* Débito de R$0,15 de Tarifa Fixa.

<br/>O total a receber pelo subordinado B será **R$38,25**.

**Master:**

Crédito de R$3,05 (R$3,00 de MDR + R$0,30 de Tarifa Fixa do subordinado A, somados com R$1,60 de MDR + R$0,15 de Tarifa Fixa do subordinado B, menos R$2,00 de MDR Braspag);
Débito de R$0,10 (Tarifa Fixa acordada com a Braspag).

<br/>O **total a receber** pelo Master será **R$2,95**.

**Braspag:**

* Crédito de R$2,10 (R$2,00 de MDR aplicado sobre o valor total da transação mais R$0,10 de Tarifa Fixa acordada com o Master).

<br/>O **total a receber** pela Braspag será **R$2,10**.

Veja a requisição dessa transação no valor de **R$100,00** com o nó contendo as regras de divisão.

#### Requisição

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

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantId`|GUID|36|Sim (envio no *header*)|Identificador da loja na Braspag.|
|`MerchantKey`|Texto|40|Sim (envio no *header*)|Chave pública para autenticação dupla na Braspag.|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido|
|`Customer.Email`|Texto|255|Não|Email do comprador|
|`Customer.Name`|Texto|255|Sim|Nome do comprador|
|`Customer.Identity`|Texto |14 |Não|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Mobile`|Texto|14|Não*|Celular do comprador|
|`Customer.Phone`|Texto|14|Não*|Telefone do comprador|
|`Customer.DeliveryAddress.Street`|Texto|255|Não*|Endereço do comprador|
|`Customer.DeliveryAddress.Number`|Texto|15|Não*|Número do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Complement`|Texto|50**|Não*|Complemento do endereço de entrega do pedido|
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
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador. Na fatura, o sofdescriptor pode ser encurtado de acordo com as regras da adquirente e bandeira.|
|`CreditCard.CardNumber`|Texto|19|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.SaveCard`|Booleano|---|Não (Default false)|Booleano que identifica se o cartão será salvo para gerar o token (CardToken)|

<aside class="warning">**Em uma transação com análise de fraude os campos podem ter tamanhos diferentes, como é o caso do campo `Customer.DeliveryAddress.Complement`. Nesse caso, consulte a requisição do capítulo Antifraude neste mesmo manual.</aside>

#### Resposta

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

## Transação de Débito

Uma transação com um cartão de débito é semelhante à de cartão de crédito, mas há duas diferenças:

* O nó `Payment.FraudAnalysis` não deve ser informado, pois a transação não necessita de análise de fraude;
* É obrigatório submeter a transação de débito à autenticação. Para isso, é necessário incluir o nó `Payment.ExternalAuthentication`. A autenticação é feita pela integração 3DS 2.0. 

> Para saber mais sobre a integração 3DS 2.0, acesse o [Manual de Autenticação 3DS 2.0](https://braspag.github.io//manualp/emv3ds).

### Requisição

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
        "ExternalAuthentication":{
            "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
            "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
            "Eci":"5",
            "Version":"2",
            "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
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

| Propriedade | Descrição | Tipo/Tamanho | Obrigatório |
| --- | --- | --- | --- |
|`Payment.Authenticate`| Define se o comprador será direcionado ao emissor para autenticação do cartão. | Booleano ("true" / "false") | Sim, caso a autenticação seja validada.|
|`Payment.ExternalAuthentication.ReturnUrl`| URL de retorno aplicável somente se a versão for "1". | Alfanumérico / 1024 posições | Sim. |
|`Payment.ExternalAuthentication.Cavv`| Assinatura retornada nos cenários de sucesso na autenticação. | Texto | Sim, caso a autenticação seja validada. |
|`Payment.ExternalAuthentication.Xid`| XID retornado no processo de autenticação. | Texto | Sim, quando a versão do 3DS for "1".|
|`Payment.ExternalAuthentication.Eci`| *Electronic Commerce Indicator* retornado no processo de autenticação. | Numérico / 1 posição | Sim. |
|`Payment.ExternalAuthentication.Version`| Versão do 3DS utilizado no processo de autenticação. | Alfanumérico / 1 posição | Sim, quando a versão do 3DS for "2".|
|`Payment.ExternalAuthentication.ReferenceID`| RequestID retornado no processo de autenticação. | GUID / 36 posições | Sim, quando a versão do 3DS for "2". |

### Resposta

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
        "ExternalAuthentication":{
            "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
            "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
            "Eci":"5",
            "Version":"2",
            "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
        },
        "ReturnUrl": "https://www.UrlDeRetornoDoLojista.com.br/",        
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

## Transação de Boleto

**Boleto Registrado** 

Desde 21 de julho de 2018, todos os boletos emitidos no e-commerce, obrigatoriamente, têm que ser registrados. O registro dos boletos é feito na Nova Plataforma de Cobrança, criada
pela Febraban em conjunto com os bancos, para promover maior controle e segurança às transações de boletos no e-commerce e garantir mais confiabilidade e comodidade aos usuários.

Para gerar um boleto, inclusive em ambiente Sandbox, é necessário fornecer dados do comprador como CPF ou CNPJ e endereço. A seguir temos um exemplo de como criar um pedido com este
tipo de meio de pagamento.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
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
        "Provider": "Braspag",
        "Bank": "BancoDoBrasil",
        "Type": "Boleto",
        "Amount": 10000,
        "BoletoNumber": "2017091101",
        "Assignor": "Empresa Teste",
        "Demonstrative": "Desmonstrative Teste",
        "ExpirationDate": "2017-12-31",
        "Identification": "12346578909",
        "Instructions": "Aceitar somente até a data de vencimento.",
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

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave Publica para Autenticação Dupla na Braspag|
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
|`Payment.BoletoNumber`|Texto |9 (**) |Não|Número do Boleto ("Nosso Número"). Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Assignor`|Texto |200|Não|Nome do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Demonstrative`|Texto |N/A|Não|Texto de Demonstrativo. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.ExpirationDate`|Date |AAAA-MM-DD|Não|Dias para vencer o boleto. Caso não esteja previamente cadastrado no meio de pagamento, o envio deste campo é obrigatório. Se enviado na requisição, sobrepõe o valor configurado no meio de pagamento.|
|`Payment.Identification`|Texto |14 |Não|CNPJ do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Instructions`|Texto |450|Não|Instruções do Boleto. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|

>(*) São aceitos como caracteres válidos: números, letras de A a Z (MAIÚSCULAS) e caracteres especiais de conjunção (hífen “-“ e apóstrofo “‘”). Quando utilizados, não pode haver espaços entre as letras. Exemplos corretos: D’EL-REI / D’ALCORTIVO / SANT’ANA. Exemplos incorretos: D’EL - REI / um espaço em branco entre palavras.<BR> 
>(**) Caracteres especiais e acentuações são removidos automaticamente.

### Resposta

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

# Modelos de Split

O Split de Pagamentos disponibiliza dois modelos para divisão da transação entre os participantes:

| Tipo                       | Descrição                                                                                          |
| **Split Transacional**     | O **master** envia as regras de divisão na autorização (captura automática) ou no momento de captura. |
| **Split Pós-Transacional** | O **master** envia as regras de divisão após a captura da transação, até 01h00 do dia posterior à captura. |

O nó referente ao split (divisão), tanto no contrato de requisição quanto de resposta, é o mesmo para os dois modelos. 

> No Split de Pagamentos a divisão é realizada somente para transações capturadas, ou seja, as regras de divisão só serão consideradas para autorizações com captura automática e no momento da captura de uma transação. Caso as regras de divisão sejam informadas no momento de uma autorização sem captura automática, elas serão desconsideradas.

## Split Transacional

No Split Transacional é necessário que o master envie um "nó" adicional na integração da API do Pagador, como apresentado em exemplos anteriores, informando as regras de divisão da transação.

### Requisição

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
| `SplitPayments.SubordinateMerchantId`   | **MerchantId** (Identificador) do **subordinado**.                                                      | Guid    | 36      | Sim         |
| `SplitPayments.Amount`                  | Parte do valor total da transação referente a participação do **subordinado**, em centavos.             | Inteiro | -       | Sim         |
| `SplitPayments.Fares.Mdr`               | **MDR(%)** do **Master** a ser descontado do valor referente a participação do **subordinado**     | Decimal | -       | Não         |
| `SplitPayments.Fares.Fee`               | **Tarifa Fixa(R$)** a ser descontada do valor referente a participação do **subordinado**, em centavos. | Inteiro | -       | Não         |

### Resposta

Como resposta, A API retornará um nó contendo as regras de divisão enviadas e os valores a serem recebidos pelo master e seus subordinados:

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
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **Subordinado** ou **Master**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Master**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |

## Split Pós-Transacional

Neste modelo, o Master poderá enviar as regras de divisão da transação após a captura.

Para transações de crédito e débito o prazo para envio da requisição de Split Pós-Transacional é até 01h00 do dia posterior à captura.

**Autenticação**

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais.

Para obter um token de acesso:

1. Concatene o MerchantId e ClientSecret: `MerchantId:ClientSecret`.  
2. Codifique o resultado da concatenação em Base64.  
3. Realize uma requisição ao servidor de autorização:  

### Requisição de autenticação 

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

```json
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

### Resposta

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O `ClientSecret` deve ser obtido junto à Braspag. <br>
> O token retornado (`access_token`) deverá ser utilizado em toda requisição à API Split como uma chave de autorização. O token de acesso possui uma validade de 20 minutos e é necessário gerar deverá um novo token toda vez que a validade expirar.  

### Requisição de Split Pós-Transacional  

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

### Resposta

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

> O master poderá informar as regras de divisão da transação mais de uma vez desde que esteja dentro do período de tempo permitido, que é até 01h00 do dia posterior à captura, se estiver enquadrado no regime de pagamento padrão.  

# Salvando e Reutilizando Cartões

Ao contratar o [Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest), é possível salvar um cartão de forma segura e de acordo com as normas PCI. Os dados do cartão são salvos em formato de um token (excluindo o CVV do cartão), o que facilita o envio e processamento de transações, garantindo a integridade dos cartões armazenados e substituindo seus dados numa próxima transação do mesmo comprador.

Além da geração do `CardToken`, é possível associar um nome (um identificador em formato de texto) ao cartão salvo. Esse identificador será o `Alias`.

<aside class="warning">Por questões de segurança, o Cartão Protegido só aceita salvar cartões que passem pela checagem do Algoritmo de Luhn, também conhecido como "mod10".</aside>

## Fluxo da transação com Cartão Protegido

Na transação com Cartão Protegido, a solicitação de tokenização é feita na própria requisição de autorização.

![FluxoSplitCP]({{ site.baseurl_root }}/images/braspag/split/split9-fluxo-transacional-cp.png)

## Salvando um Cartão Durante uma Autorização

Para salvar um cartão de crédito utilizado em uma transação, basta enviar o parâmetro `Payment.SaveCard` como "true" na requisição padrão de autorização. A numeração do cartão utilizado pode ser validada através da técnica do mod10, explicada [neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360050638051).

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
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
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":true,
         "Alias":"",
       }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
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
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":true,
         "Alias":"",
       }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`CreditCard.SaveCard`|"true" - para salvar o cartão. / "false" - para não salvar o cartão.|Booleano|10|Não (default "false") |
|`CreditCard.Alias`|Alias (apelido) do cartão de crédito.|Texto|64|Não |

### Resposta

O parâmetro `CreditCard.CardToken` retornará o token a ser salvo para transações futuras com o mesmo cartão.

```json
{
  [...]
  },
    "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": true,
      "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
      "Brand": "Visa",
      "Alias": "Cliente1"
    },
    "ProofOfSale": "3519928",
    "AcquirerTransactionId": "0511023519928",
    "AuthorizationCode": "536934",
    "PaymentId": "3af00b2d-dbd0-42d6-a669-d4937f0881da",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 14:35:19",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  },
    "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": true,
      "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
      "Brand": "Visa",
      "Alias": "Cliente1"
    },
    "ProofOfSale": "3519928",
    "AcquirerTransactionId": "0511023519928",
    "AuthorizationCode": "536934",
    "PaymentId": "3af00b2d-dbd0-42d6-a669-d4937f0881da",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 14:35:19",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor do meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Criando uma Transação com CardToken

Este é um exemplo de como utilizar o `CardToken`, previamente salvo, para criar uma transação. Por questões de segurança, um `CardToken` não armazena o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Para transacionar com a opção *recorrente* (que permite transacionar sem utilizar o CVV), entre em contato como nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag).

O nó `CreditCard` dentro do nó `Payment` será alterado conforme exemplo a seguir:

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
         "SecurityCode":"123",
         "Brand":"Visa"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
         "SecurityCode":"123",
         "Brand":"Visa"
      }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão. Para processar vendas sem o CVV, é necessário solicitar liberação na adquirente.|Texto|4|Não|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

### Resposta

```json
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
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
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|

## Criando uma Transação com Alias

Este é um exemplo de como utilizar o *Alias*, previamente salvo, para criar uma transação. Por questões de segurança, um *Alias* não armazena o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Para transacionar com a opção *recorrente* (que permite transacionar sem utilizar o CVV), entre em contato atráves de nossos [canais de atendimento](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag).

O nó `CreditCard` dentro do nó `Payment` será alterado, conforme exemplo a seguir:

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "Alias":"Cliente1",
         "SecurityCode":"123",
         "Brand":"Visa"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "CreditCard",
      "Amount": 10000,
      "Currency": "BRL",
      "Country": "BRA",
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "SoftDescriptor": "Mensagem",
      "CreditCard": {
         "Alias":"Cliente1",
         "SecurityCode":"123",
         "Brand":"Visa"
      }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão. Para processar vendas sem o CVV, é necessário solicitar liberação na adquirente.|Texto|4|Não|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`CreditCard.Alias`|Alias (apelido) do cartão de crédito.|Texto|64|Não |

### Resposta

```json
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "Alias":"Cliente1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
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
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "Alias":"Cliente1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|

# Consulta, Captura e Cancelamento

## Consulta

Para consultar uma transação, use o serviço de consulta da API do Pagador, informando o `PaymentId` da transação. Você pode consultar uma transação para verificar todos os dados dessa transação ou para saber o seu status. Caso queira receber atualizações de status de uma transação, recomendamos usar o [Post de Notificação](https://braspag.github.io//manual/split-de-pagamentos-pagador#post-de-notifica%C3%A7%C3%A3o).

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales/{PaymentId}</span></aside>

```shell
--request GET "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`PaymentId`|Número de identificação do pagamento. |Texto |36 |Sim (envio no *endpoint*)|

### Resposta

```json
{
   "MerchantOrderId": "2017051001",
   "Customer": {
      "Name": "Nome do Cliente",
      "Identity": "01234567789",
      "Email": "cliente@email.com.br",
      "Address": {
         "Street": "GONCALO DA CUNHA",
         "Number": "111",
         "ZipCode": "04140040",
         "City": "SAO PAULO",
         "State": "SP",
         "Country": "BRA",
         "District": "CHACARA INGLESA"
      }
   },
   "Merchant": {
      "Id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "TradeName": "Lojas Teste"
   },
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardNumber": "455187******0181",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2021",
         "Brand": "Visa"
      },
      "ProofOfSale": "2539492",
      "AcquirerTransactionId": "0510042539492",
      "AuthorizationCode": "759497",
      "Eci": "0",
      "Refunds": [
         {
            "Amount": 10000,
            "Status": 3,
            "ReceivedDate": "2017-05-15 16:25:38"
         }
      ],
      "Chargebacks": [
         {
            "Amount": 10000,
            "CaseNumber": "123456",
            "Date": "2017-06-04",
            "ReasonCode": "104",
            "ReasonMessage": "Outras Fraudes - Cartao Ausente",
            "Status": "Received",
            "RawData": "Client did not participate and did not authorize transaction"
         }
      ],
      "FraudAlert": {
         "Date": "2017-05-20",
         "ReasonMessage": "Uso Ind Numeração",
         "IncomingChargeback": false
      },
      "VelocityAnalysis": {
         "Id": "f8078b32-be17-4c35-b164-ad74c3cd0725",
         "ResultMessage": "Accept",
         "Score": 0
      },
      "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-10 16:25:38",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 16:25:38",
      "VoidedAmount": 10000,
      "VoidedDate": "2017-05-15 16:25:38",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ProviderDescription": "Simulado",
      "ReasonCode": 0,
      "Status": 1,
      "Links": [
         {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
         },
         {
            "Method": "PUT",
            "Rel": "capture",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
         },
         {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
         }
      ]
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId": "2017051001",
   "Customer": {
      "Name": "Nome do Cliente",
      "Identity": "01234567789",
      "Email": "cliente@email.com.br",
      "Address": {
         "Street": "GONCALO DA CUNHA",
         "Number": "111",
         "ZipCode": "04140040",
         "City": "SAO PAULO",
         "State": "SP",
         "Country": "BRA",
         "District": "CHACARA INGLESA"
      }
   },
   "Merchant": {
      "Id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "TradeName": "Lojas Teste"
   },
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardNumber": "455187******0181",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2021",
         "Brand": "Visa"
      },
      "ProofOfSale": "2539492",
      "AcquirerTransactionId": "0510042539492",
      "AuthorizationCode": "759497",
      "Eci": "0",
      "Refunds": [
         {
            "Amount": 10000,
            "Status": 3,
            "ReceivedDate": "2017-05-15 16:25:38"
         }
      ],
      "Chargebacks": [
         {
            "Amount": 10000,
            "CaseNumber": "123456",
            "Date": "2017-06-04",
            "ReasonCode": "104",
            "ReasonMessage": "Outras Fraudes - Cartao Ausente",
            "Status": "Received",
            "RawData": "Client did not participate and did not authorize transaction"
         }
      ],
      "FraudAlert": {
         "Date": "2017-05-20",
         "ReasonMessage": "Uso Ind Numeração",
         "IncomingChargeback": false
      },
      "VelocityAnalysis": {
         "Id": "f8078b32-be17-4c35-b164-ad74c3cd0725",
         "ResultMessage": "Accept",
         "Score": 0
      },
      "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-10 16:25:38",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 16:25:38",
      "VoidedAmount": 10000,
      "VoidedDate": "2017-05-15 16:25:38",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ProviderDescription": "Simulado",
      "ReasonCode": 0,
      "Status": 1,
      "Links": [
         {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
         },
         {
            "Method": "PUT",
            "Rel": "capture",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
         },
         {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
         }
      ]
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Texto alfanumérico|
|`Customer.Name`|Nome do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do cliente.|Texto |14 |Texto alfanumérico|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ).|Texto|255|CPF ou CNPJ|
|`Customer.Email`|Email do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Birthdate`|Data de nascimento do comprador.|Date|10|formato AAAA-MM-DD|
|`Customer.Address.Street`|Endereço de contato do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Address.Number`|Número do endereço de contato do comprador.|Texto|15|Texto alfanumérico|
|`Customer.Address.Complement`|Complemento do endereço de contato do comprador.|Texto|50|Texto alfanumérico|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador.|Texto|9|Texto alfanumérico|
|`Customer.Address.City`|Cidade do endereço de contato do comprador.|Texto|50|Texto alfanumérico|
|`Customer.Address.State`|Estado do endereço de contato do comprador.|Texto|2|Texto alfanumérico|
|`Customer.Address.Country`|Pais do endereço de contato do comprador|Texto|35|Texto alfanumérico|
|`Customer.Address.District`|Bairro do endereço de contato do comprador.|Texto |50 |Texto alfanumérico|
|`Customer.DeliveryAddress.Street`|Endereço de entrega do pedido.|Texto|255|Texto alfanumérico|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega do pedido.|Texto|15|Texto alfanumérico|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega do pedido.|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega do pedido.|Texto|9|Texto alfanumérico|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega do pedido.|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega do pedido.|Texto|2|Texto alfanumérico|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega do pedido.|Texto|35|Texto alfanumérico|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega do pedido. |Texto |50|Texto alfanumérico|
|`Merchant.Id`|Identificador da loja que efetuou essa transação.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Merchant.TradeName`|Nome da loja.|Texto|50|Texto alfanumérico|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15| Texto alfanumérico|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Ex.: "CreditCard"|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|10000|
|`Payment.ServiceTaxAmount`|Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização.|Número|15|10000|
|`Payment.Currency`|Moeda na qual o pagamento será feito.|Texto|3|BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|País na qual o pagamento será feito.|Texto|3|BRA|
|`Payment.Installments`|Número de parcelas.|Número|2|6|
|`Payment.Interest`|Tipo de parcelamento.|Texto|10|Loja ("ByMerchant") ou Emissor ("ByIssuer")|
|`Payment.Capture`|Indica se a autorização deve ser com captura automática ou não. Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|true / false (default)|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada ou não. Deverá verificar junto à adquirente a disponibilidade desta funcionalidade. `Authenticate` deve ser "false" quando `Recurrent` é "true".|Booleano|---|true / false (default)|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente ou não. Obs.: Este campo igual a "true" não irá originar uma nova recorrência; apenas permitirá a realização de uma transação sem a necessidade de envio do CVV. Somente para transações **Cielo**. `Authenticate` deve ser "false" quando `Recurrent` é "true".|Booleano|---|true / false (default)|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador.|Texto|13|Texto alfanumérico|
|`Payment.ExtraDataCollection.Name`|Nome do campo em que será gravado o dado extra.|Texto|50|Texto alfanumérico|
|`Payment.ExtraDataCollection.Value`|Valor do campo em que será gravado o dado extra.|Texto|1024|Texto alfanumérico|
|`Payment.AcquirerTransactionId`|Id da transação no provedor do meio de pagamento.|Texto|40|Texto alfanumérico|
|`Payment.ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`Payment.AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`Payment.Refunds.Amount`|Valor reembolsado, em centavos.|Número|15|10000|
|`Payment.Refunds.Status`|Status do reembolso.|Número|1|Received = 1<br/>Sent = 2<br/>Approved = 3<br/>Denied = 4<br/>Rejected = 5|
|`Payment.Refunds.ReceivedDate`|Data de recebimento do reembolso.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Chargebacks[n].Amount`|Valor do chargeback, em centavos.|Número|15|10000|
|`Payment.Chargebacks[n].CaseNumber`|Número do caso relacionado ao chargeback.|Texto|16|Texto alfanumérico|
|`Payment.Chargebacks[n].Date`|Data do chargeback.|Date|10|AAAA-MM-DD|
|`Payment.Chargebacks[n].ReasonCode`|Código do motivo do chargeback.<br/>[Lista de Valores - ReasonCode](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.chargebacks[n].reasoncode-e-payment.chargebacks[n].reasonmessage).|Texto|10|Texto alfanumérico|
|`Payment.Chargebacks[n].ReasonMessage`|Mensagem de motivo do chargeback.<br/>[Lista de Valores - ReasonMessage](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.chargebacks[n].reasoncode-e-payment.chargebacks[n].reasonmessage).|Texto|512|Texto alfanumérico|
|`Payment.Chargebacks[n].Status`|Status do chargeback. <br/> [Lista de Valores - Status](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.chargebacks[n].status).|Texto|32|Texto|
|`Payment.Chargebacks[n].RawData`|Dado enviado pela adquirente, podendo ser o titular do cartão ou outra mensagem.|Texto|512|Texto alfanumérico|
|`Payment.FraudAlert.Date`|Data do alerta de fraude.|Date|10|AAAA-MM-DD|
|`Payment.FraudAlert.ReasonMessage`|Mensagem de motivo do alerta de fraude.|Texto|512|Texto alfanumérico|
|`Payment.FraudAlert.IncomingChargeback`|Flag que identifica se a transação possui um chargeback ocorrido antes do alerta de fraude.|Booleano|5|Texto|
|`Payment.PaymentId`|Campo identificador do pedido.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.ReasonCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`Payment.ReasonMessage`|Mensagem de retorno da adquirência.|Texto|512|Texto alfanumérico|
|`Payment.CapturedAmount`|Valor capturado.|Número|15|10000|
|`Payment.CapturedDate`|Data da captura.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.VoidedAmount`|Valor cancelado/estornado, em centavos.|Número|15|10000|
|`Payment.VoidedDate`|Data do cancelamento/estorno.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Status`|Status da transação.|Byte|2| Ex.: "1"|
|`Payment.Provider`|Provedor utilizado.|Texto|32|Simulado|
|`Payment.ProviderDescription`|Nome do adquirente que processou a transação.|Texto|512|Simulado|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|---|
|`CreditCard.Holder`|Nome do portador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|---|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão.|Texto|7|MM/AAAA|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|---|
|`CreditCard.SaveCard`|Identifica se o cartão será salvo para gerar o token (*CardToken*).|Booleano|---|true / false (default)|

## Captura

Ao capturar uma transação do Split de Pagamentos, o master precisa informar as regras de divisão da transação. Caso as regras não sejam informadas, o Split interpretará que todo o valor é referente ao próprio master.

### Captura Total

Na captura total de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total da transação enviado no momento da autorização.

#### Requisição

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

### Captura Parcial

Na captura parcial de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total a ser capturado. Caso nenhuma divisão seja informada, o Split interpretará que todo o valor é referente ao próprio master.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture?amount={amount}</span></aside>

O exemplo abaixo captura parcialmente o valor de R$80,00 de uma transação realizada no valor de R$100,00, sendo que R$ 50,00 serão capturados do subordinado A e R$ 30,00 serão capturados do subordinado B.

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

> Como explicitado anteriormente, se a requisição de captura total ou parcial não informar as regras de divisão, o Split interpreta que todo o valor é destinado ao próprio master.

**Requisição**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture/capture?amount=8000</span></aside>

**Resposta**

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

## Cancelamento

Ao cancelar uma transação do Split de Pagamentos o master deve informar, para um cancelamento parcial, qual o valor que deve ser cancelado de cada participante da transação. Para um cancelamento total, esta informação não é necessária, já que será cancelado o valor total e, consequentemente, o valor total de cada subordinado.

> O prazo de estorno de uma transação é de 300 dias, devido a regra definida pela adquirente, bancos e bandeiras.

### Cancelamento Total

No cancelamento total de uma transação, será cancelado o valor total da transação e, consequentemente, o valor total de cada subordinado e as comissões de todos os participantes.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void</span></aside>

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

### Cancelamento Parcial

No cancelamento parcial, o somatório dos valores cancelados definidos para cada subordinado deve ser igual ao valor do cancelamento parcial.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void?amount={amount}</span></aside>

No exemplo a seguir, a requisição informa o cancelamento do valor de R$25,00 de uma transação capturada no valor de R$100,00.

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

Não é obrigatório informar todos os subordinados no cancelamento parcial. Você pode informar apenas os subordinados para os quais deseja cancelar totalmente ou cancelar parte do valor destinado a cada um na transação, conforme exemplo a seguir:

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

> Ao cancelar parcialmente parte de um valor destinado a um subordinado, a Tarifa Fixa que o master tem a receber também é cancelada proporcionalmente.

# Opções de Configuração da Transação

Em uma transação do Split, existem configurações opcionais que podem ser utilizadas para controlar alguns aspectos.

## Tipo do Desconto das Taxas

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

<br/>No caso de uma transação criada com um tipo de desconto das taxas, esse tipo será usado em todas as requisições posteriores. É possível mudar o tipo de desconto através da redivisão
(pelo Split Pós-Transacional), informando o tipo desejado. Uma vez que o tipo é mudado, o novo tipo é usado em todas as requisições posteriores ou até que seja mudado novamente.

> Só é possível mudar o tipo de desconto enquanto ainda for possível redividir a transação.

### No Momento Transacional

A seguir vamos apresentar exemplos de uma transação com o desconto aplicado sobre a comissão e com o desconto aplicado sobre a venda.

A transação tem valor de **R$100,00** com o nó contendo as regras de divisão e o master participando da venda.

> **Taxa Braspag:** 2% de MDR + R$0,30 de Tarifa Fixa.<br>
> **Taxa Master com o Subordinado A:** 5% de MDR, já embutindo os 2% do MDR Braspag + R$0,30 de Tarifa Fixa.<br> 
> **Taxa Master com o Subordinado B:** 4% MDR, já embutindo os 2% do MDR Braspag + R$ 0,15 de Tarifa Fixa.

Após a divisão, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado A:**

* Crédito de R$42,75 (R$45,00 da transação menos R$2,25 de MDR);
* Débito de R$0,30 de Tarifa Fixa.

<br/>O **total a receber** pelo subordinado A será **R$42,45**.

**Subordinado B:**

* Crédito de R$28,80 (R$30,00 da transação menos R$1,20 de MDR);
* Débito de R$0,15 de Tarifa Fixa.

<br/>O **total a receber** pelo subordinado B será **R$28,65**.

**Master:**

* Crédito de R$ 26,90 (R$25,00 da transação somados com R$2,25 de MDR e R$0,30 de Tarifa Fixa do subordinado A, e com R$1,20 de MDR e R$0,15 de Tarifa Fixa do subordinado B; menos R$2,00 de MDR da Braspag);
* Débito de R$0,30 (Tarifa Fixa acordada com a Braspag).

<br/>O **total a receber** pelo master será **R$26,60**.
 
**Braspag:**

* Crédito de R$2,30 (MDR aplicado sobre o valor total da transação mais R$0,30 de Tarifa Fixa acordada com o master).

<br/>O **total a receber** pela Braspag será **R$2,30**.

As divisões e o valor total a receber de cada participante estão na figura a seguir.

![SplitEx4]({{ site.baseurl_root }}/images/braspag/split/split10-exemplo4-tipo-de-desconto.png)

#### Desconto sendo aplicado sobre a comissão

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
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

##### Resposta

```json
{
    "MerchantOrderId": "201904150001",
    "Customer": {
        "Name": "João da Silva Accept",
        "Identity": "12345678900",
        "IdentityType": "CPF"
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

#### Desconto sendo aplicado sobre a venda

Com a mesma transação:

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
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

##### Resposta

```json
{
    "MerchantOrderId": "201904150001",
    "Customer": {
        "Name": "João da Silva Accept",
        "Identity": "12345678900",
        "IdentityType": "CPF"
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

### No Momento Pós-Transacional

Veja uma requisição no modelo Split Pós-transacional com o desconto aplicado sobre a venda.

#### Requisição

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

#### Resposta

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

# Recorrência

Diferente dos pagamentos com cartão de crédito ou boleto tradicionais, os pagamentos recorrentes se repetem automaticamente por períodos e em intervalos determinados, cobrando sempre o mesmo valor de um mesmo cartão ou conta.

A recorrência é muito usada para assinaturas de revistas, mensalidades, licenças de software, entre outros. Além da integração técnica, é necessário que seu estabelecimento comercial esteja habilitado na adquirente para receber pagamentos recorrentes.

O lojista conta com recursos diferenciados para modelar sua cobrança de acordo com o seu negócio, tais como: parametrização e alteração de periodicidade, data de início e fim, quantidade de tentativas e intervalo entre tentativas. Para saber mais detalhes, leia nosso artigo sobre [Recorrência](https://suporte.braspag.com.br/hc/pt-br/articles/360013311991){:target="_blank"}.

<aside class="notice">Vendas recorrentes com cartão de crédito não exigem CVV.</aside>

<aside class="warning">Por questões de segurança, a recorrência só é possível para cartões que passem pela checagem do Algoritmo de Luhn, também conhecido como "mod10".</aside>

**Para submeter uma transação recorrente**, envie a requisição conforme as orientações desta seção. A solicitação de **split de uma transação com recorrência** deve acontecer no momento **pós-transacional**.

<aside class="warning">Não é possível solicitar o split de uma transação recorrente no momento transacional.</aside>

## Autorização de Recorrência

### Autorizando Recorrência com Cartão de Crédito

Adicione o nó `RecurrentPayment` ao nó `Payment` para agendar as recorrências futuras ao autorizar uma transação pela primeira vez na série de recorrências.

Os parâmetros `Payment.RecurrentPayment.Interval` e `Payment.RecurrentPayment.DailyInterval`, marcados com um "\*" na coluna "OBRIGATÓRIO", não devem ser utilizados em conjunto.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount": 10000,
      "Installments": 1,
      "CreditCard": {
         "CardNumber":"5412217070050381",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment": {
         "AuthorizeNow":"true",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount": 10000,
      "Installments": 1,
      "CreditCard": {
         "CardNumber":"5412217070050381",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment": {
         "AuthorizeNow":"true",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência. Não utilizar em conjunto com `DailyInterval`.<br><br>Monthly (default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não*|
|`Payment.RecurrentPayment.DailyInterval`|Padrão da recorrência em dias. Não utilizar em conjunto com `Interval`.|Número|2|Não*|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

#### Resposta

```json
{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "ProofOfSale": "5646418",
    "AcquirerTransactionId": "0511045646418",
    "AuthorizationCode": "100024",
    "PaymentId": "067f73ce-62fb-4d76-871d-0bcbb88fbd22",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 16:56:46",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    "RecurrentPayment": {
      "RecurrentPaymentId": "808d3631-47ca-43b4-97f5-bd29ab06c271",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-06-11",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
    }
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "ProofOfSale": "5646418",
    "AcquirerTransactionId": "0511045646418",
    "AuthorizationCode": "100024",
    "PaymentId": "067f73ce-62fb-4d76-871d-0bcbb88fbd22",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 16:56:46",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    "RecurrentPayment": {
      "RecurrentPaymentId": "808d3631-47ca-43b4-97f5-bd29ab06c271",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-06-11",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
    }
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|ID que representa a recorrência, utilizada para consultas e alterações futuras. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data de quando acontecerá a próxima recorrência. |Texto |10|2019-12-11 (YYYY-MM-DD) |
|`EndDate`|Data do fim da recorrência. |Texto |10|2019-12-31 (YYYY-MM-DD) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |"true" ou "false" |

### Autorizando Recorrência com Boleto Bancário

O pedido de requisição de uma transação recorrente com boleto bancário é o mesmo da criação de um boleto tradicional. Adicione o nó `RecurrentPayment` ao nó `Payment` para agendar as recorrências futuras ao autorizar uma transação pela primeira vez na série de recorrências.

A data de vencimento dos boletos recorrentes será criada baseando-se na data do próximo pedido recorrente adicionado do valor que estiver configurado no meio de pagamento na Braspag.

Ex.: Dia da próxima cobrança: 01/01/2021 + 5 dias. Vencimento do boleto criado automaticamente: 06/01/2021.

Entre em contato com o [time de suporte](https://suporte.braspag.com.br/hc/pt-br/requests/new){:target="_blank"} para definir em quantos dias você quer que seus boletos gerados via recorrência vençam.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
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
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider": "Simulado",
      "Type": "Boleto",
      "Amount": 1000,
      "Instructions": "Aceitar somente até a data de vencimento.",
      "RecurrentPayment": {
         "AuthorizeNow": true,
         "StartDate": "2020-01-01",
         "EndDate": "2020-12-31",
         "Interval": "Monthly"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment": {
      "Provider":"Simulado",
      "Type":"Boleto",
      "Amount":1000,
      "Instructions":"Aceitar somente até a data de vencimento.",
      "RecurrentPayment":{
         "AuthorizeNow":true,
         "StartDate":"2020-01-01",
         "EndDate":"2020-12-31",
         "Interval":"Monthly"
      }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.RecurrentPayment.StartDate`|Data para início da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência.<br>Monthly (default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|

#### Resposta

```json
{
   "MerchantOrderId": "teste001",
   "Customer": {
      "Name": "Nome do Comprador",
      "Identity": "12345678909",
      "IdentityType": "CPF",
      "Address": {
         "Street": "Alameda Xingu",
         "Number": "512",
         "Complement": "27 andar",
         "ZipCode": "06455914",
         "City": "São Paulo",
         "State": "SP",
         "Country": "BRA",
         "District": "Alphaville"
      }
   },
   "Payment": {
      "Instructions": "Aceitar somente até a data de vencimento.",
      "ExpirationDate": "2020-08-15",
      "Url": "https://transactionsandbox.pagador.com.br/post/pagador/reenvia.asp/58e4bde3-1abc-4aef-a58a-741f4c53940d",
      "BoletoNumber": "100031-0",
      "BarCodeNumber": "00096834800000129001234270000010003105678900",
      "DigitableLine": "00091.23423 40000.010004 31056.789008 6 83480000012900",
      "Address": "N/A, 1",
      "IsRecurring": false,
      "PaymentId": "58e4bde3-1abc-4aef-a58a-741f4c53940d",
      "Type": "Boleto",
      "Amount": 1000,
      "ReceivedDate": "2020-01-01 00:00:01",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "Status": 1,
      "RecurrentPayment": {
         "RecurrentPaymentId": "a08a622b-71f2-4553-9345-5f3c4fbbacb0",
         "ReasonCode": 0,
         "ReasonMessage": "Successful",
         "NextRecurrency": "2020-02-01",
         "StartDate": "2020-01-01",
         "EndDate": "2020-12-31",
         "Interval": "Monthly",
         "Link": {
            "Method": "GET",
            "Rel": "recurrentPayment",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/a08a622b-71f2-4553-9345-5f3c4fbbacb0"
         },
         "AuthorizeNow": true,
         },
         "Links": [
            {
               "Method": "GET",
               "Rel": "self",
               "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/58e4bde3-1abc-4aef-a58a-741f4c53940d"
            }
         ]
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId": "teste001",
   "Customer": {
      "Name": "Nome do Comprador",
      "Identity": "12345678909",
      "IdentityType": "CPF",
      "Address": {
         "Street": "Alameda Xingu",
         "Number": "512",
         "Complement": "27 andar",
         "ZipCode": "06455914",
         "City": "São Paulo",
         "State": "SP",
         "Country": "BRA",
         "District": "Alphaville"
      }
   },
   "Payment": {
      "Instructions": "Aceitar somente até a data de vencimento.",
      "ExpirationDate": "2020-08-15",
      "Url": "https://transactionsandbox.pagador.com.br/post/pagador/reenvia.asp/58e4bde3-1abc-4aef-a58a-741f4c53940d",
      "BoletoNumber": "100031-0",
      "BarCodeNumber": "00096834800000129001234270000010003105678900",
      "DigitableLine": "00091.23423 40000.010004 31056.789008 6 83480000012900",
      "Address": "N/A, 1",
      "IsRecurring": false,
      "PaymentId": "58e4bde3-1abc-4aef-a58a-741f4c53940d",
      "Type": "Boleto",
      "Amount": 1000,
      "ReceivedDate": "2020-01-01 00:00:01",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "Status": 1,
      "RecurrentPayment": {
         "RecurrentPaymentId": "a08a622b-71f2-4553-9345-5f3c4fbbacb0",
         "ReasonCode": 0,
         "ReasonMessage": "Successful",
         "NextRecurrency": "2020-02-01",
         "StartDate": "2020-01-01",
         "EndDate": "2020-12-31",
         "Interval": "Monthly",
         "Link": {
            "Method": "GET",
            "Rel": "recurrentPayment",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/a08a622b-71f2-4553-9345-5f3c4fbbacb0"
         },
         "AuthorizeNow": true,
         },
         "Links": [
            {
               "Method": "GET",
               "Rel": "self",
               "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/58e4bde3-1abc-4aef-a58a-741f4c53940d"
            }
         ]
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|Campo identificador da próxima recorrência. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data da próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`StartDate`|Data do início da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |true ou false |

## Agendamento de Recorrência

### Agendando uma Autorização

Diferente da recorrência anterior, este exemplo não autoriza imediatamente, mas agenda uma autorização futura.

Para programar a primeira transação da série de recorrências, passe o parâmetro `Payment.RecurrentPayment.AuthorizeNow` como "false" e adicione o parâmetro `Payment.RecurrentPayment.StartDate`.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
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
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Installments":1,
      "CreditCard":{
         "CardNumber":"5412217070050381",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment":{
         "AuthorizeNow":false,
         "StartDate":"2017-12-31",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Installments":1,
      "CreditCard":{
         "CardNumber":"5412217070050381",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment":{
         "AuthorizeNow":false,
         "StartDate":"2017-12-31",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.RecurrentPayment.StartDate`|Data para início da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência.<br>Monthly (default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não|
|`Payment.RecurrentPayment.DailyInterval`|Padrão da recorrência em dias. Não utilizar em conjunto com `Interval`.|Número|2|Não*|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

#### Resposta

```json

{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Undefined"
    },
    "Type": "CreditCard",
    "Amount": 10000,
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "Status": 20,
    "RecurrentPayment": {
      "RecurrentPaymentId": "32703035-7dfb-4369-ac53-34c7ff7b84e8",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-12-31",
      "StartDate": "2017-12-31",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
      "AuthorizeNow": false
    }
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Undefined"
    },
    "Type": "CreditCard",
    "Amount": 10000,
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "Status": 20,
    "RecurrentPayment": {
      "RecurrentPaymentId": "32703035-7dfb-4369-ac53-34c7ff7b84e8",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-12-31",
      "StartDate": "2017-12-31",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
      "AuthorizeNow": false
    }
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|Campo identificador da próxima recorrência. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data da próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`StartDate`|Data do início da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |true ou false |

## Alteração de Dados

### Alterando Dados do Comprador

Para alterar os dados do comprador de uma recorrência existente, basta fazer uma chamada PUT para o endpoint especificado.<br>Em **resposta**, a API irá retornar o código do [Status HTTP](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"}, informando se a operação foi realizada com sucesso ou não.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Customer</span></aside>

```json
{  
   "Name":"Outro nome do Comprador",
   "Email":"outrocomprador@braspag.com.br",
   "Birthdate":"1999-12-12",
   "Identity":"0987654321",
   "IdentityType":"CPF",
   "Address":{
      "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      },
   "DeliveryAddress":{  
      "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      }
   }
}
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Customer"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{   
   "Name":"Outro nome do Comprador",
   "Email":"outrocomprador@braspag.com.br",
   "Birthdate":"1999-12-12",
   "Identity":"0987654321",
   "IdentityType":"CPF",
   "Address":{  
   "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
   },
   "DeliveryAddress":{  
      "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`Name`|Nome do comprador. |Texto |255|Sim|
|`Email`|Email do comprador. |Texto |255|Não|
|`Birthdate`|Data de nascimento do comprador. |Date |10 |Não|
|`Identity`|Número do RG, CPF ou CNPJ do cliente. |Texto |14 |Não|
|`IdentityType`|Tipo do documento de identificação do comprador (CFP/CNPJ).|Texto|255|Não|
|`Address.Street`|Endereço do comprador. |Texto |255 |Não|
|`Address.Number`|Número do endereço do comprador. |Texto |15 |Não|
|`Address.Complement`|Complemento do endereço do comprador.|Texto |50 |Não|
|`Address.ZipCode`|CEP do endereço do comprador. |Texto |9 |Não|
|`Address.City`|Cidade do endereço do comprador. |Texto |50 |Não|
|`Address.State`|Estado do endereço do comprador. |Texto |2 |Não|
|`Address.Country`|País do endereço do comprador. |Texto |35 |Não|
|`Address.District`|Bairro do endereço do comprador. |Texto |50 |Não|
|`DeliveryAddress.Street`|Endereço de entrega do comprador. |Texto |255 |Não|
|`DeliveryAddress.Number`|Número do endereço de entrega do comprador. |Texto |15 |Não|
|`DeliveryAddress.Complement`|Complemento do endereço de entrega do comprador. |Texto |50 |Não|
|`DeliveryAddress.ZipCode`|CEP do endereço de entrega do comprador. |Texto |9 |Não|
|`DeliveryAddress.City`|Cidade do endereço de entrega do comprador. |Texto |50 |Não|
|`DeliveryAddress.State`|Estado do endereço de entrega do comprador. |Texto |2 |Não|
|`DeliveryAddress.Country`|País do endereço de entrega do comprador. |Texto |35 |Não|
|`DeliveryAddress.District`|Bairro do endereço de entrega do comprador. |Texto |50 |Não|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando a Data Final da Recorrência

Para alterar a data final da recorrência já existente, basta fazer um PUT conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate</span></aside>

```json
"2021-01-09"
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2021-01-09"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`EndDate`|Data para término da recorrência.|Texto |10 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Intervalo da Recorrência

Para alterar o intervalo de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Interval</span></aside>

```json
{
  "Interval":"Annual"
}
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Interval"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"Interval":"Annual"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`Interval`|Intervalo da recorrência. <br>Monthly / Bimonthly / Quarterly / SemiAnnual / Annual.|Texto |10 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Dia da Recorrência

Ao efetuar a alteração do dia da recorrência, devem ser levadas em consideração as seguintes regras utilizadas para execução da atualização na API:

1- Se o novo dia informado for depois do dia atual, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 10, a data da próxima recorrência será dia 10/05.
<br/><br/>2- Se o novo dia informado for antes do dia atual, iremos atualizar o dia da recorrência, mas este só terá efeito depois que a próxima recorrência for executada com sucesso. <br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 03, a data da próxima recorrência permanecerá dia 25/05. Após sua execução, a recorrência seguinte será agendada para o dia 03/06.
<br/><br/>3- Se o novo dia informado for antes do dia atual, mas a próxima recorrência for em outro mês, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/09. Quando atualizado para o dia 03, a data da próxima recorrência será 03/09.

<br/>Para modificar o dia de vencimento de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay</span></aside>

```json
16
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
16
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`RecurrencyDay`|Dia da recorrência.|Número |2 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Valor da Transação da Recorrência

Para modificar o valor da transação de uma recorrência já existente, basta fazer um PUT conforme o exemplo.

<aside class="warning">Essa alteração só afeta a data de pagamento da recorrência seguinte.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Amount</span></aside>

```json
156
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Amount"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
156
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API.|GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.| GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência.|Texto |50 |Sim (envio no *endpoint*)|
|`Amount`|Valor do pedido, em centavos. Ex.: 156 equivale a R$ 1,56.|Número|15|Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando a Data do Próximo Pagamento

Para alterar somente a data do pagamento seguinte, basta fazer um PUT conforme o exemplo abaixo.

<aside class="warning">Esta operação modifica somente a data do pagamento seguinte, ou seja, as recorrências futuras permanecerão com as características originais.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate</span></aside>

```json
"2017-06-15"
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2016-06-15"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`NextPaymentDate`|Data de pagamento da próxima recorrência.|Texto |10 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando os Dados de Pagamento da Recorrência

Durante o ciclo de vida de uma recorrência, é possível alterar:

* Adquirente (ex.: de Rede para Cielo);
* Cartão (em caso de cartão vencido);
* Meio de pagamento (de cartão para boleto e vice-e-versa).

<br/>Para alterar os dados de pagamento, basta fazer um PUT conforme o exemplo.

<aside class="warning">ATENÇÃO: Essa alteração afeta a todos os dados do nó "Payment". Para manter os dados anteriores, você deve informar esses campos utilizando os valores já salvos a serem mantidos.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Payment</span></aside>

```json
{  
   "Type":"CreditCard",
   "Amount":"20000",
   "Installments":3,
   "Country":"USA",
   "Currency":"USD",
   "SoftDescriptor":"Mensagem",
   "Provider":"Simulado",
   "CreditCard":{  
      "Brand":"Master",
      "Holder":"Nome do Portador",
      "CardNumber":"5412217070050381",
      "ExpirationDate":"05/2019"
   },
   "Credentials": {
      "Code": "9999999",
      "Key": "D8888888",
      "Password": "LOJA9999999",
      "Username": "#Braspag2018@NOMEDALOJA#",
      "Signature": "001"
   }
}
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Payment"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "Type":"CreditCard",
   "Amount":"20000",
   "Installments":3,
   "Country":"USA",
   "Currency":"USD",
   "SoftDescriptor":"Mensagem",
   "Provider":"Simulado",
   "CreditCard":{  
      "Brand":"Master",
      "Holder":"Nome do Portador",
      "CardNumber":"5412217070050381",
      "ExpirationDate":"05/2019"
   },
   "Credentials": {
      "Code": "9999999",
      "Key": "D8888888",
      "Password": "LOJA9999999",
      "Username": "#Braspag2018@NOMEDALOJA#",
      "Signature": "001"
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Type`|Tipo do meio de pagamento. |Texto |100|Sim|
|`Amount`|Valor do pedido, em centavos.|Número |15 |Sim|
|`Installments`|Número de parcelas.|Número |2 |Sim|
|`SoftDescriptor`|Texto que será impresso na fatura do portador.|Texto |13|Não|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto |16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto |25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão.|Texto |7 |Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto |4 |Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim|
|`Credentials.Code`|Afiliação gerada pela adquirente.|Texto|100|Sim|
|`Credentials.Key`|Chave de afiliação/token gerado pela adquirente.|Texto|100|Sim|
|`Credentials.Username`|Usuário gerado no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado).|Texto|50|Não|
|`Credentials.Password`|Senha gerada no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado).|Texto|50|Não|
|`Credentials.Signature`|Enviar o *TerminalID* da adquirente **Global Payments** Ex.: 001. Para **Safra**, colocar nome do estabelecimento, cidade e estado concatenados com ponto-e-vírgula ";". Ex.: NomedaLoja;São Paulo;SP.|Texto|--|Não|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Desabilitação de Pedido

### Desabilitando um Pedido Recorrente

Para desabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Deactivate</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Deactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Reabilitação de Pedido

### Reabilitando um Pedido Recorrente

Para reabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Transação com Renova Fácil

O *Renova Fácil* é um serviço desenvolvido pela Cielo em conjunto com os emissores cujo objetivo é aumentar a taxa de conversão de vendas recorrentes com cartão de crédito e débito.

Através da identificação de cartões vencidos no momento da transação, é feita a autorização com um novo cartão, que é então retornado para armazenagem.

<aside class="notice">Emissores participantes: Bradesco, Banco do Brasil, Santander, Panamericano, Citibank.</aside>

Para utilizar o Renova Fácil, é necessário que o serviço esteja habilitado na Cielo. Não é necessário enviar nenhuma informação extra na requisição de autorização, porém a resposta terá o nó `NewCard`, tanto para transação de crédito quanto para transação de débito.

Veja a seguir o exemplo de resposta de uma transação de crédito.

### Resposta

```json
{
   [...]
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardNumber": "455187******0183",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2016",
         "SaveCard": false,
         "Brand": "Visa"
      },
      "AcquirerTransactionId": "0512105630844",
      "NewCard": {
         "CardNumber": "4551870000512353",
         "Holder": "Nome do Portador",
         "ExpirationDate": "05/2020",
         "SaveCard": false,
         "Brand": "Visa"
      },
      "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-12 10:56:30",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ReasonCode": 15,
      "ReasonMessage": "CardExpired",
      "Status": 3,
      "ProviderReturnCode": "57",
      "ProviderReturnMessage": "Card Expired",
      [...]
   }
}
```

```shell
{
   [...]
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardNumber": "455187******0183",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2016",
         "SaveCard": false,
         "Brand": "Visa"
      },
      "AcquirerTransactionId": "0512105630844",
      "NewCard": {
         "CardNumber": "4551870000512353",
         "Holder": "Nome do Portador",
         "ExpirationDate": "05/2020",
         "SaveCard": false,
         "Brand": "Visa"
      },
      "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-12 10:56:30",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ReasonCode": 15,
      "ReasonMessage": "CardExpired",
      "Status": 3,
      "ProviderReturnCode": "57",
      "ProviderReturnMessage": "Card Expired",
      [...]
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|
|-----------|---------|----|-------|
|`NewCard.CardNumber`|Novo número do cartão do comprador.|Texto|16|
|`NewCard.Holder`|Nome do portador impresso no novo cartão.|Texto|25|
|`NewCard.ExpirationDate`|Data de validade impressa no novo cartão.|Texto|7|
|`NewCard.SecurityCode`|Código de segurança impresso no verso do novo cartão.|Texto|4|
|`NewCard.Brand`|Bandeira do novo cartão.|Texto|10 |

<aside class="notice">Para simular o retorno do node "NewCard" em Sandbox utilize um cartão com final 3 e o "ExpirationDate" vencido.</aside>

### Resposta para clientes Cartão Protegido e Renova Fácil

Para clientes Cartão Protegido e Renova Fácil, o nó `NewCard` irá retornar o número mascarado do cartão e um novo token do cartão atualizado. Dessa forma o lojista pode submeter uma nova cobrança, usando o retorno do Renova Fácil de uma forma segura.

```json
{
   [...]
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardToken":"19077eb8-5d84-352f-10cd-6a4280b8c089"
         "SaveCard": false,
         "Brand": "Visa"
      },
      "AcquirerTransactionId": "0512105630844",
      "NewCard": {
         "CardNumber": "455187******4731",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2028",
         "SaveCard": false,
         "CardToken": "be7fg5a8-3ac8-59bc-dgf2-344516e20b68",
         "Brand": "Visa"
      },
      "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-12 10:56:30",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ReasonCode": 15,
      "ReasonMessage": "CardExpired",
      "Status": 3,
      "ProviderReturnCode": "57",
      "ProviderReturnMessage": "Card Expired",
      [...]
   }
}
```

```shell
{
   [...]
   "Payment": {
      "ServiceTaxAmount": 0,
      "Installments": 1,
      "Interest": "ByMerchant",
      "Capture": true,
      "Authenticate": false,
      "Recurrent": false,
      "CreditCard": {
         "CardToken":"19077eb8-5d84-352f-10cd-6a4280b8c089"
         "SaveCard": false,
         "Brand": "Visa"
      },
      "AcquirerTransactionId": "0512105630844",
      "NewCard": {
         "CardNumber": "455187******4731",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2028",
         "SaveCard": false,
         "CardToken": "be7fg5a8-3ac8-59bc-dgf2-344516e20b68",
         "Brand": "Visa"
      },
      "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-12 10:56:30",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ReasonCode": 15,
      "ReasonMessage": "CardExpired",
      "Status": 3,
      "ProviderReturnCode": "57",
      "ProviderReturnMessage": "Card Expired",
      [...]
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|
|-----------|---------|----|-------|
|`NewCard.CardNumber`|BIN e 4 últimos dígitios do novo número do cartão do comprador.|Texto|16|
|`NewCard.Holder`|Nome do portador impresso no novo cartão.|Texto|25|
|`NewCard.ExpirationDate`|Data de validade impressa no novo cartão.|Texto|7|
|`NewCard.SecurityCode`|Código de segurança impresso no verso do novo cartão.|Texto|4|
|`NewCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão. OBS.: Se a origem da transação for do *Silent Order Post* então o retorno será `NewCard.PaymentToken`|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`NewCard.Brand`|Bandeira do novo cartão.|Texto|10|

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

![FluxoSplitAF]({{ site.baseurl_root }}/images/braspag/split/split11-fluxo-transacional-af.png)

É possível verificar se uma transação possui risco de ser uma fraude ou não durante uma autorização.

|Tipo de Integração|Descrição|Parâmetros necessários|
|-|-|-|
|Análise antes da autorização|Antes da transação ser enviada para a autorização, o AntiFraude avalia se ela tem alto risco ou não. Dessa forma, evita-se o envio de transações arriscadas para autorização|`FraudAnalysis.Sequence` igual a _AnalyseFirst_|
|Análise após a autorização|Antes da transação ser enviada para o AntiFraude, a mesma será enviada para a autorização|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_|
|Análise de risco somente se a transação for autorizada|O AntiFraude será acionado apenas para analisar transações com o staus _autorizada_. Dessa forma evita-se o custo com análises de transações que não seriam autorizadas|`FraudAnalysis.SequenceCriteria` igual a _OnSuccess_|
|Autorização com captura automática após a análise de risco|O AntiFraude será acionado para realizar a análise de risco e se o status for aceito a autorização com captura automática poderá ser realizada|`FraudAnalysis.Sequence` igual a _AnalyseFirst_, `FraudAnalysis.SequenceCriteria` igual a _OnSuccess_ e `Payment.Capture` igual a _true_|
|Capturar apenas se uma transação for segura|Após a análise de fraude, captura automaticamente uma transação já autorizada se definido baixo risco. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Braspag receber a notificação do novo status e for igual a aceita, a transação será capturada automaticamente|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_, `FraudAnalysis.CaptureOnLowRisk` igual a _true_ e `Payment.Capture` igual a _false_| |
|Cancelar uma transação comprometida|Caso a análise de fraude retorne um alto risco para uma transação já autorizada ou capturada, ela será imediamente cancelada ou estornada. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Braspag receber a notificação do novo status e for igual a rejeitada, a transação será cancelada ou estornada automaticamente|`FraudAnalysis.Sequence` como _AuthorizeFirst_|

Se não for especificado o contrário durante a autorização, o Split processará sua transação pelo fluxo `FraudAnalysis.Sequence` _AnalyseFirst_, `FraudAnalysis.SequenceCriteria` _OnSuccess_, `FraudAnalysis.VoidOnHighRisk` _false_ e `FraudAnalysis.CaptureOnLowRisk` _false_.

Para que a análise de fraude via Cybersource seja efetuada durante uma transação de cartão de crédito, é necessário complementar o contrato de autorização com os nós `FraudAnalysis`, `Cart`, `MerchantDefinedFields` e `Travel` (somente para venda de passagens aéreas).

### Requisição

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
|`MerchantId`|GUID|36|Sim (envio no *header*)|Identificador da loja na Braspag.|
|`MerchantKey`|Texto|40|Sim (envio no *header*)|Chave pública para autenticação dupla na Braspag.|
|`MerchantOrderId`|Texto|50|Sim|Número do pedido da loja|
|`Customer.Name`|Texto|120|Sim|Nome completo do comprador|
|`Customer.Identity`|Texto|16|Sim|Número do documento de identificação do comprador|
|`Customer.IdentityType`|Texto|255|Sim|Tipo de documento de identificação do comprador <br/> Possíveis valores: CPF ou CNPJ|
|`Customer.Email`|Texto|100|Sim|E-mail do comprador|
|`Customer.Birthdate`|Date|10|Não|Data de nascimento do comprador <br/> Ex.: 1991-01-10|
|`Customer.Phone`|Texto|15|Sim|Número do telefone do comprador <br/> Ex.: 5521976781114|
|`Customer.Address.Street`|Texto|54|Sim|Logradouro do endereço de cobrança|
|`Customer.Address.Number`|Texto|5|Sim|Número do endereço de cobrança|
|`Customer.Address.Complement`|Texto|14|Não|Complemento do endereço de cobrança|
|`Customer.Address.ZipCode`|Texto|9|Sim|Código postal do endereço de cobrança|
|`Customer.Address.City`|Texto|50|Sim|Cidade do endereço de cobrança|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço de cobrança|
|`Customer.Address.Country`|Texto|2|Sim|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Customer.Address.District`|Texto|45|Sim|Bairro do endereço de cobrança|
|`Customer.DeliveryAddress.Street`|Texto|54|Obrigatório caso faça entrega|Logradouro do endereço de entrega|
|`Customer.DeliveryAddress.Number`|Texto|5|Obrigatório caso faça entrega|Número do endereço de entrega|
|`Customer.DeliveryAddress.Complement`|Texto|14|Obrigatório caso faça entrega|Complemento do endereço de entrega|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Obrigatório caso faça entrega|Código postal do endereço de entrega|
|`Customer.DeliveryAddress.City`|Texto|50|Obrigatório caso faça entrega|Cidade do endereço de entrega|
|`Customer.DeliveryAddress.State`|Texto|2|Obrigatório caso faça entrega|Estado do endereço de entrega|
|`Customer.DeliveryAddress.Country`|Texto|2|Obrigatório caso faça entrega|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Customer.DeliveryAddress.District`|Texto|45|Obrigatório caso faça entrega|Bairro do endereço de entrega|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora da autorização|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. <br/> Obs.: Somente o tipo _CreditCard_ funciona com análise de fraude|
|`Payment.Amount`|Número|15|Sim|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|
|`Payment.ServiceTaxAmount`|Número|15|Não|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço <br/> Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Currency`|Texto|3|Não|Moeda na qual o pagamento será feito <br/> Possíveis valores: BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|Texto|3|Não|País na qual o pagamento será realizado|
|`Payment.Installments`|Número|2|Sim|Número de parcelas|
|`Payment.Interest`|Texto|10|Não|Tipo de parcelamento <br/> Possíveis valores: ByMerchant / ByIssuer|
|`Payment.Capture`|Booleano|---|Não|Indica se a autorização deverá ser com captura automática <br/> Possíveis valores: "true"/"false" (default) <br/> Obs.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade <br/> Obs2.: Caso use o fluxo AuthorizeFirst, é obrigatório enviar o campo `PaymentCapture` como "false".|
|`Payment.Authenticate`|Booleano|---|Não|Indica se a transação deve ser autenticada <br/> Possíveis valores: true / false (default) <br/> Obs.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.Recurrent`|Booleano|---|Não|Indica se a transação é do tipo recorrente <br/> Possíveis valores: true / false (default) <br/> Obs.: Este campo igual a _true_ não irá criar uma recorrência, apenas permitirá a realização de uma transação sem a necessidade de envio do CVV e servindo de indicação para a adquirente que é a cobrança de uma transação de uma recorrência <br/> Obs2.: Somente para transações Cielo <br/> Obs3.: O campo `Payment.Authenticate` deve ser igual a _false_ quando este for igual a _true_|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador <br/>. Na fatura, o sofdescriptor pode ser encurtado de acordo com as regras da adquirente e bandeira.|
|`Payment.DoSplit`|Booleano|---|Não|Indica se a transação será dividida entre vários participantes <br/> Possíveis valores: true / false (default)|
|`Payment.ExtraDataCollection.Name`|Texto|50|Não|Identificador do campo extra que será enviado|
|`Payment.ExtraDataCollection.Value`|Texto|1024|Não|Valor do campo extra que será enviado|
|`Payment.CreditCard.CardNumber`|Texto|19|Sim|Número do cartão de crédito|
|`Payment.CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão de crédito|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão de crédito|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança no verso do cartão de crédito|
|`Payment.CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão de crédito|
|`Payment.CreditCard.SaveCard`|Booleano|---|Não|Indica se os dados do cartão de crédito serão armazenados no Cartão Protegido|
|`Payment.CreditCard.Alias`|Texto|64|Não|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|
|`Payment.FraudAnalysis.Provider`|Texto|10|Sim|Provedor de AntiFraude <br/> Possíveis valores: Cybersource|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será capturada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de baixo risco (Accept) a transação anteriormente autorizada será capturada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será capturada após a Braspag receber a notificação da alteração de status e esta for baixo risco (Accept) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.TotalOrderAmount`|Número|15|Sim|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|
|`Payment.FraudAnalysis.FingerPrintId`|Texto|88|Sim|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas <br/> [Saiba como configurar o Fingerprint](https://braspag.github.io/manual/antifraude#fingerprint-com-a-cybersource){:target="_blank"}no manual do Antifraude|
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
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|120|Obrigatório caso faça entrega|Nome completo do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Shipping.Method`|Texto|8|Não|Meio de entrega do pedido <br/> [Tabela 10 - Payment.Fraudanalysis.Shipping.Method]({{ site.baseurl_root }}manual/split-pagamentos-braspag-pagador#tabela-10-payment.fraudanalysis.shipping.method)|
|`Payment.FraudAnalysis.Shipping.Phone`|Texto|15|Obrigatório caso faça entrega|Número do telefone do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114700|
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

### Resposta

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
|`Payment.SoftDescriptor`|Texto|Texto que será impresso na fatura do portador. Na fatura, o sofdescriptor pode ser encurtado de acordo com as regras da adquirente e bandeira.|
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

## Integração em checkout - Fingerprint

É necessário integrar o Fingerprint no seu checkout para permitir a **identificação digital do dispositivo do comprador**. O Fingerprint consiste na implementação de um script na sua página de checkout (front-end), na parte onde o comprador preenche os dados cadastrais.

Confira no manual do Antifraude [como configurar o Fingerprint](https://braspag.github.io//manual/antifraude#fingerprint-com-a-cybersource){:target="_blank"} para web e mobile e qual valor será enviado no campo `Payment.FraudAnalysis.FingerPrintId`.

## Tabelas

### Tabela 1 - Payment.FraudAnalysis.Cart.Items[n].GiftCategory

|Valor|Descrição|
|:-|:-|
|Yes|Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido|
|No|Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)|
|Off|Diferenças entre os endereços de cobrança e entrega não afetam a pontuação|

### Tabela 2 - Payment.FraudAnalysis.Cart.Items[n].HostHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

### Tabela 3 - Payment.FraudAnalysis.Cart.Items[n].NonSensicalHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

### Tabela 4 - Payment.FraudAnalysis.Cart.Items[n].ObscenitiesHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

### Tabela 5 - Payment.FraudAnalysis.Cart.Items[n].PhoneHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

### Tabela 7 - Payment.FraudAnalysis.Cart.Items[n].TimeHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

### Tabela 8 - Payment.FraudAnalysis.Cart.Items[n].Type

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

### Tabela 9 - Payment.FraudAnalysis.Cart.Items[n].VelocityHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

### Tabela 10 - Payment.FraudAnalysis.Shipping.Method

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

### Tabela 11 - Payment.FraudAnalysis.Travel.JourneyType

|Valor|Descrição|
|:-|:-|
|OneWayTrip|Viagem somente de ida|
|RoundTrip|Viagem de ida e volta|

### Tabela 12 - Payment.FraudAnalysis.Travel.Passengers[n].Status

|Valor|
|:-|
|Standard|
|Gold|
|Platinum|

### Tabela 13 - Payment.FraudAnalysis.Travel.Passengers[n].Rating

|Valor|Descrição|
|:-|:-|
|Adult|Adulto|
|Child|Criança|
|Infant|Infantil|

### Tabela 14 - Payment.FraudAnalysis.Status

|Código|Descrição|
|:-|:-|
|0|Unknown|
|1|Accept|
|2|Reject|
|3|Review|
|4|Aborted|
|5|Unfinished|

### Tabela 15 - Payment.FraudAnalysis.FraudAnalysisReasonCode

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

### Tabela 16 - Payment.FraudAnalysis.ReplyData.AddressInfoCode

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

### Tabela 17 - Payment.FraudAnalysis.ReplyData.FactorCode

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

### Tabela 18 - Payment.FraudAnalysis.ReplyData.InternetInfoCode

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

### Tabela 19 - Payment.FraudAnalysis.ReplyData.IpRoutingMethod

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

### Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields

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

### Tabela 21 - Payment.Status

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

# Post de Notificação

Para receber a notificação de alteração de status da transação (ex.: confirmação de pagamento ou devolução), deve-se ter configurado o campo "URL de Notificação" durante o cadastro de sua loja na Braspag. O endereço deve ser HTTPS e não se deve utilizar uma porta fora do padrão HTTPS (443).

Veja o fluxo percorrido pelo post de notificação:

![SplitPostNotificacao]({{ site.baseurl_root }}/images/braspag/split/split12-post-notificacao.png)

<aside class="warning">Como existe a possibilidade de ocorrerem intermitências entre as APIs de envio e de recebimento, faz-se necessária a sondagem das transações pendentes (não pagas) que ainda não tenham sido atualizadas no dia.</aside>

Os parâmetros serão enviados à URL cadastrada, conforme demonstrado no exemplo a seguir.

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
