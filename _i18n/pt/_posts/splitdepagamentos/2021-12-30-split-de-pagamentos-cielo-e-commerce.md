---
layout: manual
title: Split de Pagamentos - Cielo E-commerce
description: Manual de Integração do Split de Pagamentos
search: true
translated: true
toc_footers: false
categories: manual
sort_order: 1
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

Com o Split de Pagamentos, você tem acesso a um pacote de soluções para a segurança do comprador, do seu e-commerce e dos seus vendedores:
* **VerifyCard**: composto pelo Zero Auth, que identifica se um cartão é válido, e pelo Consulta BIN, que retorna características do cartão, como tipo e bandeira;
* **Autenticação 3DS 2.0**: é um modelo de autenticação que permite determinar se um comprador é, de fato, o portador do cartão;
* **Antifraude***: permite a análise de fraude de cada transação em parceria com a Cybersource;
* **Cartão Protegido**: permite o armazenamento seguro de cartões de crédito e débito, de acordo com as normas do PCI, e contribui para melhorar a taxa de conversão do seu e-commerce;
* **Silent Order Post**: possibilita o envio de dados do pagamento do cliente de forma segura, armazenando os dados no ambiente do Split, que conta com a certificação PCI DSS 3.2. O Silent Order Post é ideal para a empresa que não possui estrutura para cumprir todos os requisitos de segurança do PCI DSS no uso de cartões de crédito ou, também, para o lojista que prefira concentrar seus esforços em outros elementos do negócio.
<br/>
> O Antifraude está sujeito à uma taxa por transação analisada. Consulte a área [Comercial do Split](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"} para saber mais.

# Como funciona

Os possíveis participantes de uma venda são: master, subordinado e Split de Pagamentos.

|PARTICIPANTES|DESCRIÇÃO|
|---|---|
|**Master**| É o responsável pelo carrinho.<br>Possui acordos com subordinados que fornecem os produtos presentes no carrinho.<br>Define as taxas a serem descontadas sobre a venda de cada subordinado.<br>Pode participar de uma venda fornecendo seus próprios produtos.|
|**Subordinado**| É o fornecedor dos produtos que compõem o carrinho.<br>Recebe parte do valor da venda, descontadas as taxas acordadas com o master.|
|**Split de Pagamentos**| É responsável pelo fluxo transacional, funcionando como uma subadquirente.<br>Define as taxas a serem descontadas sobre o valor total da venda realizada pelo master.<br>É responsável pela liquidação dos pagamentos para os subordinados e master.|

Ao contratar o Split de Pagamentos, você (usuário master) receberá as credenciais para integração com as nossas APIs (`MerchantId`, `MerchantKey` e `ClientSecret`), além do seu login no portal Backoffice Split.

> Nesta documentação, mostramos o passo a passo da integração via API. Para saber como usar o Backoffice Split, consulte os [artigos na nossa página de Suporte](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}.

Antes de começar a transacionar, você precisa cadastrar os seus subordinados. Para isso, leia a documentação Cadastro de Subordinados.

Como master, o primeiro passo é fazer a sua integração com a API Cielo E-commerce 3.0.

Para cada transação, você poderá informar como será a divisão entre cada participante, podendo ser no momento de captura (Split transacional) ou em um momento posterior (Split pós-transacional).

Com a transação capturada, o Split calcula o valor destinado a cada participante e repassa esses valores para cada envolvido na transação. O **Regime de Pagamento** é o prazo estabelecido para liquidação de acordo com o produto (crédito ou débito) e bandeira.

>**Crédito**: em até 31 dias.<br>
>**Crédito Parcelado**: 1ª parcela em até 31 dias, demais a cada 30 dias.<br>
>**Débito**: em até 2 dias úteis.<br>
>**Boleto**: em até 2 dias úteis após a confirmação do pagamento.

<br/>Na divisão de uma transação, você deve informar:

* Os **identificadores (MerchantId) dos subordinados e do master**, caso também participe da venda;
* Os **valores correspondentes a cada participante**. O somatório deverá ser igual ao valor total da transação;
* As **taxas** a serem aplicadas sobre o valor de cada subordinado destinadas ao master. Essas taxas deverão ser acordadas previamente entre master e subordinado.

Quando o master participa da divisão, passa a ter também o papel de subordinado e a ter seus próprios produtos no carrinho.

## Taxas

As taxas acordadas entre os participantes podem ser um MDR (%) e/ou uma Tarifa Fixa (R$), e devem ser definidas no momento do cadastro do master e dos seus subordinados junto ao Split.

As taxas podem ser enviadas no momento transacional (captura) ou pós-transacional. Caso não sejam enviadas, o Split vai considerar as taxas cadastradas e acordadas previamente entre os participantes.

>**MDR (Merchant Discount Rate)**: percentual a ser descontado do valor de uma transação, definido por produto (crédito/débito/boleto), bandeira e faixa de parcelamento.<br>
>**Tarifa fixa**: também chamada de fee transacional. Valor em centavos a ser cobrado por transação capturada. É descontado no momento da “montagem” da agenda financeira.

### Split

O Split acordará um MDR e/ou uma Tarifa Fixa com o master, que serão descontadas do valor total de cada transação. 

O master, de conhecimento destas taxas, negociará também um MDR e/ou uma Tarifa Fixa com cada Subordinado. Se desejar, pode embutir o MDR e/ou Tarifa acordados junto ao Split.

![SplitExTaxas]({{ site.baseurl_root }}/images/braspag/split/split3-taxas.png)
 
* A Tarifa Fixa acordada entre o master e o Split não é aplicada no valor total da transação, ou seja, não entra no cálculo da divisão, e é debitada diretamente do montante que o master tem para receber junto ao Split. 
* O MDR entra no cálculo de divisão da transação, considerando o valor total da transação, já que o MDR deve estar embutido no MDR acordado entre o master e seus subordinados.

> **Taxa Split**: MDR Split (%) + Tarifa Fixa Split (R$)

### Master

O master é responsável por acordar as taxas a serem cobradas dos seus subordinados, definindo um MDR maior ou igual ao MDR definido com o Split, e uma Tarifa Fixa, que é opcional.

> Taxa Master: MDR Master (%) + Tarifa Fixa (R$), na qual o MDR Master (%) pode embutir o MDR Split (%).

### Exemplo da divisão e taxas

Uma transação de R$100,00, realizada por um master com participação do subordinado A.

![SplitExemplo1]({{ site.baseurl_root }}/images/braspag/split/split4-exemplo1-taxas.png)
 
Neste exemplo, foram assumidos os seguintes acordos:

>**Taxa Split**: 2% de MDR + R$0,10 de Tarifa Fixa.<br>
>**Taxa Master**: 4% de MDR (embutindo os 2% de MDR do Split) + R$0,30 de Tarifa Fixa.

Após a divisão, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado:**

* Crédito de R$96,00 (R$100,00 da transação menos R$4,00 de MDR); 
* Débito de R$0,30 de Tarifa Fixa.

<br/>O **total a receber** pelo subordinado será **R$95,70**.

**Master:**

* Crédito de R$2,30 (R$4,00 de MDR mais R$0,30 de Tarifa Fixa do subordinado, menos R$2,00 de MDR do Split);
* Débito de R$0,10 (Tarifa Fixa acordada com o Split).

<br/>O **total a receber** pelo master será **R$2,20**.

**Split:**

* Crédito de R$2,10 (R$2,00 de MDR aplicado sobre o valor total da transação mais R$0,10 de Tarifa Fixa acordada com o Master).

<br/>O **total a receber** pelo Split será **R$2,10**.

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

Solicite suas credenciais para o ambiente de teste com o nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}.

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

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/){:target="_blank"}, no qual é necessário primeiramente obter um token de acesso utlizando suas credenciais, e posteriormente enviar o token de acesso à API Cielo E-Commerce e à API do Split.

Durante o onboarding, você receberá as credenciais `MerchantId` e `ClientSecret`. Caso não tenha recebido a credencial, solicite ao [Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}.

**1.** Concatene as credenciais no formato `MerchantId:ClientSecret`;<br/>
**2.** Converta o resultado em base 64, gerando uma string;

> **Exemplo:**<br/>
> * merchant_id: **braspagtestes**<br/>
> * client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * String a ser codificada em Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * Resultado após a codificação: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**<br/>

**3.** Envie a string em base 64 na requisição de Autenticação (POST);<br/>

![SplitAuth]({{ site.baseurl_root }}/images/braspag/split/split5-auth.png)

#### Requisição  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://authsandbox.braspag.com.br/oauth2/token</span></aside>

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

> O MerchantId é o mesmo utilizado na integração com a API Cielo E-Commerce. O ClientSecret deve ser obtido junto ao Split.

O token retornado (access_token) deverá ser utilizado em toda requisição à API Cielo E-commerce ou à API Split como uma chave de autorização. O token de acesso possui uma validade de 20 minutos e é necessário gerar um novo token toda vez que a validade expirar.  

# Criando transações

A autorização de uma transação no Split de Pagamentos deve ser realizada através da API Cielo E-Commerce, seguindo as mesmas requisições do [Manual de Integração API Cielo E-commerce](https://developercielo.github.io/manual/cielo-ecommerce){:target="_blank"}.

**Fluxo transacional padrão**

Veja um exemplo do fluxo transacional padrão no Split de Pagamentos.

![FluxoTransacionalSplit]({{ site.baseurl_root }}/images/braspag/split/split6-fluxo-transacional-padrao.png)

A próxima seção apresentará exemplos de transações de crédito, débito e boleto. É importante lembrar que nas respostas das requisições das transações, o Split retornará a divisão do valor da venda, MDR e taxa fixa, mas o desconto das taxas será feito posteriormente, na agenda financeira.

> Em todos os exemplos a seguir a divisão da transação segue o modelo de Split Transacional, ou seja, a divisão é solicitada no momento da captura.

## Transação de Crédito

Ao informar um tipo de pagamento referente ao Split, a API Cielo E-Commerce automaticamente identifica que a transação é referente ao Split de Pagamentos e realiza o fluxo 
transacional através do Split.

Caso a transação enviada seja marcada para captura automática, é necessário enviar o nó contendo as regras de divisão; caso contrário, a transação será dividida entre o Split e o 
master. Posteriormente, é permitido que o master envie novas regras de divisão para a transação através da API Split, desde que esteja dentro do período permitido.

Veja a seguir exemplos de requisições e respostas para transações de crédito.

### Transação de crédito sem subordinado

Veja uma requisição de transação no valor de R$100,00, com captura automática, sem o nó contendo as regras de divisão.

> **Taxa Split**: 2% MDR + R$0,10 Tarifa Fixa.

Neste caso, o master recebe o valor da transação descontado o MDR acordado com o Split. Como apresentado anteriormente, a Tarifa Fixa acordada entre o master e o Split é sensibilizada diretamente na agenda de ambas as partes.

**Master:**

* Crédito de R$98,00 (R$100,00 da transação menos R$2,00 de MDR do Split);
* Débito de R$0,10 (Tarifa Fixa acordada com o Split).

<br/>O **total a receber** pelo master será **R$97,90**.
 
**Split:**

* Crédito: R$2,10 (MDR aplicado sobre o valor total da transação mais R$0,10 (Tarifa Fixa acordada com o Master).

<br/>O **total a receber** pela Split será **R$2,10**.

O valor total a receber pelo master está representado na figura a seguir.

![SplitEx2]({{ site.baseurl_root }}/images/braspag/split/split7-exemplo2-sem-no.png)

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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
|`Customer.DeliveryAddress.Complement`|Texto|50**|Não*|Complemento do endereço de entrega do pedido|
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

<aside class="warning">**Em uma transação com análise de fraude os campos podem ter tamanhos diferentes, como é o caso do campo `Customer.DeliveryAddress.Complement`. Nesse caso, consulte a requisição do capítulo Antifraude neste mesmo manual.</aside>

#### Resposta

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

### Transação de crédito com subordinado 

A próxima requisição corresponde a uma transação no valor de R$100,00 com o nó contendo as regras de divisão. Neste exemplo foram assumidas as seguintes taxas:

>**Taxa Split**: 2% MDR + R$0,10 Tarifa Fixa.<br>
>**Taxa Master com o Subordinado A**: 5% MDR (embutindo os 2% do MDR Split) + 0,30 Tarifa Fixa.<br>
>**Taxa Master com o Subordinado B**: 4% MDR (embutindo os 2% do MDR Split) + 0,15 Tarifa Fixa.

**Subordinado A:**

* Crédito de R$57,00 (R$60,00 da transação menos R$3,00 de MDR);
* Débito de R$0,30 de Tarifa Fixa.

O **total a receber** pelo subordinado A será **R$56,70**.

**Subordinado B:**

* Crédito de R$38,40 (R$40,00 da transação menos R$1,60 de MDR);
* Débito de R$0,15 de Tarifa Fixa.

O total a receber pelo subordinado B será **R$38,25**.

**Master:**

Crédito de R$3,05 (R$3,00 de MDR + R$0,30 de Tarifa Fixa do subordinado A, somados com R$1,60 de MDR + R$0,15 de Tarifa Fixa do subordinado B, menos R$2,00 de MDR Split);
Débito de R$0,10 (Tarifa Fixa acordada com a Split).

O **total a receber** pelo Master será **R$2,95**.

**Split:**

* Crédito de R$2,10 (R$2,00 de MDR aplicado sobre o valor total da transação mais R$0,10 de Tarifa Fixa acordada com o Master).

O **total a receber** pelo Split será **R$2,10**.

As divisões e o valor total a receber de cada participante estão na figura a seguir.

![SplitEx3]({{ site.baseurl_root }}/images/braspag/split/split8-exemplo3-com-no.png)

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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
|`Customer.DeliveryAddress.Complement`|Texto|50**|Não*|Complemento do endereço de entrega do pedido|
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

<aside class="warning">**Em uma transação com análise de fraude os campos podem ter tamanhos diferentes, como é o caso do campo `Customer.DeliveryAddress.Complement`. Nesse caso, consulte a requisição do capítulo Antifraude neste mesmo manual.</aside>

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

### Transação de crédito com MCC do subordinado

Alguns ramos de atividades exercidos pelos subordinado exigem o envio de informações especificas para a autorização da transação. Neste caso, o subordinado é considerado o **Participante Principal** da transação.

Para casos que necessitam utilizar um ramo específico para autorização da transação, solicite análise ao Suporte do Split para atuar com o **Subordinado Principal**.

Após ter a funcionalidade habilitada, é necessário enviar a propriedade `MainSubordinateMerchantId` no nó `SplitTransaction`.

> Esse tipo de transação só pode ter um subordinado.

Confira um exemplo de requisição com **Subordinado Principal**:

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

```json
{
    "MerchantOrderId": "30082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "Provider": "Simulado",
        "Type": "SplittedCreditcard",
        "DoSplit": "True",
        "Amount": 10000,
        "Capture": true,
        "Installments": 1,
        "Softdescriptor": "teste",
        "CreditCard": {
            "CardNumber": "4481530710186111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "SplitPayments": [
            {
                "SubordinateMerchantId": "3320c690-11cf-4eb1-a89f-c3529424da0d",
                "Amount": 10000,
                "Fares": {
                    "Mdr": 5,
                    "Fee": 30
                }
            }
        ],
        "SplitTransaction":{
           "MainSubordinateMerchantId": "3320c690-11cf-4eb1-a89f-c3529424da0d"
       }
    }
}
```

|PROPRIEDADE|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|---|---|---|---|---|
| `SplitTransaction.MainSubordinateMerchantId` | GUID | 36 | Não | Identificação do subordinado principal. É o mesmo valor do `SubordinateMerchantId`.|

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
                "SubordinateMerchantId": "3320c690-11cf-4eb1-a89f-c3529424da0d",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "3320c690-11cf-4eb1-a89f-c3529424da0d",
                        "Amount": 4720
                    },
                    {
                        "MerchantId": "f43fca07-48ec-46b5-8b93-ce79b75a8f63",
                        "Amount": 280
                    }
                ]
            }
        ],
        "SplitTransaction":{
            "MainSubordinateMerchantId": "3320c690-11cf-4eb1-a89f-c3529424da0d"
        },
        "PaymentId": "f1333ea6-8cb9-420f-9674-d66031903080",
        "Type": "SplittedCreditCard",
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

> **Observações:**<br/>
> <br/>
> * Para este tipo de transação, o subordinado não pode ser removido da transação através do Split Pós-transacional;<br/>
> * A transação só pode ter um subordinado;<br/>
> * Caso use autorização com captura posterior, o subordinado informado na captura deve ser o mesmo enviado na autorização como participante principal da transação;<br/>
> * Cancelamentos podem ocorrer normalmente, desde que o participante principal continue participando da transação.

## Transação de Débito  

Uma transação com um cartão de débito é semelhante à de cartão de crédito, mas há duas diferenças:

* O nó `Payment.FraudAnalysis` não deve ser informado, pois a transação não necessita de análise de fraude;
* É obrigatório submeter a transação de débito à autenticação. Para isso, é necessário incluir o nó `Payment.ExternalAuthentication`. A autenticação é feita pela integração 3DS 2.0. 

>Para saber mais sobre a integração 3DS 2.0, acesse o [Manual de Autenticação 3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"}.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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

### Resposta

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

## Transação de Boleto

### Boleto Registrado

Desde 21 de julho de 2018, todos os boletos emitidos no e-commerce, obrigatoriamente, têm que ser registrados. O registro dos boletos é feito na Nova Plataforma de Cobrança, criada
pela Febraban em conjunto com os bancos, para promover maior controle e segurança às transações de boletos no e-commerce e garantir mais confiabilidade e comodidade aos usuários.

Para gerar um boleto, inclusive em ambiente Sandbox, é necessário fornecer dados do comprador como CPF ou CNPJ e endereço. A seguir temos um exemplo de como criar um pedido com este
tipo de meio de pagamento.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

```json
--header "Content-Type: application/json"
--header "Authorization: Bearer Token"
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

#### Resposta

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

| Tipo                       | Descrição                                                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Split Transacional**     | O **master** envia as regras de divisão na autorização (captura automática) ou no momento de captura.                         |
| **Split Pós-Transacional** | O **master** envia as regras de divisão após a captura da transação, até 01h00 do dia posterior à captura..|

O nó referente ao split (divisão)), tanto no contrato de requisição quanto de resposta, é o mesmo para os dois modelos. 

> No Split de Pagamentos, a divisão é realizada somente para transações capturadas, ou seja, as regras de divisão só serão consideradas para autorizações com captura automática e no momento da captura de uma transação. Caso as regras de divisão sejam informadas no momento de uma autorização sem captura automática, as regras de divisão serão desconsideradas.

## Split Transacional

No Split Transacional é necessário que o master envie um "nó" adicional na integração da API Cielo E-Commerce, como apresentado em exemplos anteriores, informando as regras de divisão da transação.

### Requisição

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

### Resposta

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

## Split Pós-Transacional

Neste modelo, o master poderá enviar as regras de divisão da transação após a captura.

> Para transações de crédito e débito o prazo para envio da requisição de Split Pós-Transacional é até 01h00 do dia posterior à captura.

### Requisição  

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">https://splitsandbox.braspag.com.br/api/transactions/{PaymentId}/split</span></aside>

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

### Resposta

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

# Salvando e Reutilizando Cartões

Ao contratar o [Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest){:target="_blank"}, é possível salvar um cartão de forma segura e de acordo com as normas PCI. Os dados do cartão são salvos em formato de um token (excluindo o CVV do cartão), o que facilita o envio e processamento de transações, garantindo a integridade dos cartões armazenados e substituindo seus dados numa próxima transação do mesmo comprador.

Além da geração do `CardToken`, é possível associar um nome (um identificador em formato de texto) ao cartão salvo. Esse identificador será o `Alias`.

<aside class="warning">Por questões de segurança, o Cartão Protegido só aceita salvar cartões que passem pela checagem do Algoritmo de Luhn, também conhecido como "mod10".</aside>

## Fluxo da transação com Cartão Protegido

Na transação com Cartão Protegido, a solicitação de tokenização é feita na própria requisição de autorização.

![FluxoSplitCP]({{ site.baseurl_root }}/images/braspag/split/split9-fluxo-transacional-cp.png)

## Salvando um Cartão Durante uma Autorização

Para salvar um cartão de crédito utilizado em uma transação, basta enviar o parâmetro `Payment.SaveCard` como "true" na requisição padrão de autorização. A numeração do cartão usado pode ser validada através da técnica do mod10, explicada [neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360050638051){:target="_blank"}.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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

### Resposta

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
|`ReceivedDate`|Data em que a transação foi recebida pelo Split.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.Alias`| Alias (apelido) do cartão de crédito. | Texto | 64 | Texto alfanumérico

## Criando uma Transação com CardToken

Este é um exemplo de como utilizar o `CardToken`, previamente salvo, para criar uma transação. Por questões de segurança, um `CardToken` não armazena o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Para transacionar com a opção *recorrente* (que permite transacionar sem utilizar o CVV), entre em contato com o nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag){:target="_blank"}.

O nó `CreditCard` dentro do nó `Payment` será alterado conforme exemplo a seguir:

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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

### Resposta

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
|`ReceivedDate`|Data em que a transação foi recebida pelo Split.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|

## Criando uma Transação com Alias

Este é um exemplo de como utilizar o *Alias*, previamente salvo, para criar uma transação. Por questões de segurança, um Alias não armazena o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Para transacionar com a opção *recorrente* (que permite transacionar sem utilizar o CVV), entre em contato com o nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag){:target="_blank"}.

O nó `CreditCard` dentro do nó `Payment` será alterado, conforme exemplo a seguir:

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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

### Resposta

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
|`ReceivedDate`|Data em que a transação foi recebida pelo Split.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|

# Consulta, Captura e Cancelamento

## Consulta

Para consultar uma transação, use o serviço de consulta da API Cielo E-Commerce. Você pode consultar uma transação para verificar todos os dados dessa transação ou para saber o seu
status. Caso queira receber atualizações de status de uma transação, recomendamos usar o [**Post de Notificação**](https://braspag.github.io//manual/split-de-pagamentos-cielo-e-commerce#post-de-notifica%C3%A7%C3%A3o){:target="_blank"}.

#### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}</span></aside>

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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/capture</span></aside>

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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/capture?amount={amount}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

O exemplo abaixo captura parcialmente o valor de R$80,00 de uma transação realizada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/capture?amount=8000</span></aside>

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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/void</span></aside>

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

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/void?amount={amount}</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

No exemplo a seguir, a requisição informa o cancelamento do valor de R$25,00 de uma transação capturada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/void?amount=2500</span></aside>

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

# Opções de Configuração da Transação

Em uma transação do Split, existem configurações opcionais para que o master possa definir de qual parte as taxas serão descontadas.

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
* **Pré-configurada**. Para pré-configurar, entre em contato com o [Suporte](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}, que irá criar, remover ou atualizar a
pré-configuração. A pré-configuração só será utilizada caso nenhum valor seja informado na requisição.

<br/>No caso de uma transação criada com um tipo de desconto das taxas, esse tipo será usado em todas as requisições posteriores. É possível mudar o tipo de desconto através da redivisão
(pelo Split Pós-Transacional), informando o tipo desejado. Uma vez que o tipo é mudado, o novo tipo é usado em todas as requisições posteriores ou até que seja mudado novamente.

> Só é possível mudar o tipo de desconto enquanto ainda for possível redividir a transação.

### No Momento Transacional

A seguir vamos apresentar exemplos de uma transação com o desconto aplicado sobre a comissão e com o desconto aplicado sobre a venda.

A transação tem valor de **R$100,00** com o nó contendo as regras de divisão e o master participando da venda.

> **Taxa Split:** 2% de MDR + R$0,30 de Tarifa Fixa.<br>
> **Taxa Master com o Subordinado A:** 5% de MDR, já embutindo os 2% do MDR Split + R$0,30 de Tarifa Fixa.<br> 
> **Taxa Master com o Subordinado B:** 4% MDR, já embutindo os 2% do MDR Split + R$ 0,15 de Tarifa Fixa.

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

* Crédito de R$ 26,90 (R$25,00 da transação somados com R$2,25 de MDR e R$0,30 de Tarifa Fixa do subordinado A, e com R$1,20 de MDR e R$0,15 de Tarifa Fixa do subordinado B; menos R$2,00 de MDR do Split);
* Débito de R$0,30 (Tarifa Fixa acordada com o Split).

<br/>O **total a receber** pelo master será **R$26,60**.
 
**Split:**

* Crédito de R$2,30 (MDR aplicado sobre o valor total da transação mais R$0,30 de Tarifa Fixa acordada com o master).

<br/>O **total a receber** pelo Split será **R$2,30**.

As divisões e o valor total a receber de cada participante estão na figura a seguir.

![SplitEx4]({{ site.baseurl_root }}/images/braspag/split/split10-exemplo4-tipo-de-desconto.png)

#### Desconto sendo aplicado sobre a comissão

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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

##### Resposta

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

#### Desconto sendo aplicado sobre a venda

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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

##### Resposta

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

### No Momento Pós-Transacional

Veja uma requisição no modelo Split Pós-transacional com o desconto aplicado sobre a venda.

#### Requisição

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">https://splitsandbox.braspag.com.br/api/transactions/{PaymentId}/split?masterRateDiscountType=Sale</span></aside>

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

É muito utilizado para assinaturas de revistas, mensalidades, licenças de software, entre outros. Além da integração técnica, é necessário que seu estabelecimento comercial esteja habilitado na adquirente para receber pagamentos recorrentes.

O lojista conta com recursos diferenciados para modelar sua cobrança de acordo com o seu negócio, tais como: parametrização e alteração de periodicidade, data de início e fim, quantidade de tentativas e intervalo entre tentativas.

<aside class="notice">Vendas recorrentes com cartão de crédito não exigem CVV.</aside>

<aside class="warning">A recorrência não está disponível para transações de e-wallets devido à necessidade de utilização de chaves temporárias para realizar operações de crédito.</aside>

<aside class="warning">Por questões de segurança, a recorrência só é possível para cartões que passem pela checagem do Algoritmo de Luhn, também conhecido como "mod10".</aside>

## Autorização de Recorrência

### Autorizando Recorrência com Cartão de Crédito

Adicione o nó `RecurrentPayment` ao nó `Payment` para agendar as recorrências futuras ao autorizar uma transação pela primeira vez na série de recorrências.

Os parâmetros `Payment.RecurrentPayment.Interval` e `Payment.RecurrentPayment.DailyInterval`, marcados com um "\*" na coluna "OBRIGATÓRIO", não devem ser utilizados em conjunto.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@cielo.com.br",
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
--request POST "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/"
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
      "Email":"comprador@cielo.com.br",
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

A data de vencimento dos boletos recorrentes será criada baseando-se na data do próximo pedido recorrente adicionado do valor que estiver configurado no meio de pagamento.

Ex.: Dia da próxima cobrança: 01/01/2021 + 5 dias. Vencimento do boleto criado automaticamente: 06/01/2021.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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
--request POST "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/"
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
      "Url": "https://apisandbox.cieloecommerce.cielo.com.br/post/pagador/reenvia.asp/a5f3181d-c2e2-4df9-a5b4-d8f6edf6bd51",
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
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}"
         },
         "AuthorizeNow": true,
         },
         "Links": [
            {
               "Method": "GET",
               "Rel": "self",
               "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}"
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
      "Url": "https://apisandbox.cieloecommerce.cielo.com.br/post/pagador/reenvia.asp/a5f3181d-c2e2-4df9-a5b4-d8f6edf6bd51",
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
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}"
         },
         "AuthorizeNow": true,
         },
         "Links": [
            {
               "Method": "GET",
               "Rel": "self",
               "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}"
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

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/sales/</span></aside>

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
--request POST "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/"
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

Para alterar os dados do comprador de uma recorrência existente, basta fazer uma chamada PUT para o endpoint especificado.<br>Em **resposta**, a API irá retornar o código do [Status HTTP](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"}, informando se a operação foi realizada com sucesso ou não.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Customer</span></aside>

```json
{  
   "Name":"Outro nome do Comprador",
   "Email":"outrocomprador@email.com.br",
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando a Data Final da Recorrência

Para alterar a data final da recorrência já existente, basta fazer um PUT conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/EndDate</span></aside>

```json
"2021-01-09"
```

```shell
--request PUT "https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/EndDate"
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Intervalo da Recorrência

Para alterar o intervalo de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Interval</span></aside>

```json
{
  "Interval":"Annual"
}
```

```shell
--request PUT "https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Interval"
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Dia da Recorrência

Ao efetuar a alteração do dia da recorrência, devem ser levadas em consideração as seguintes regras utilizadas para execução da atualização na API:

1- Se o novo dia informado for depois do dia atual, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 10, a data da próxima recorrência será dia 10/05.
<br/><br/>2- Se o novo dia informado for antes do dia atual, iremos atualizar o dia da recorrência, mas este só terá efeito depois que a próxima recorrência for executada com sucesso. <br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 03, a data da próxima recorrência permanecerá dia 25/05. Após sua execução, a recorrência seguinte será agendada para o dia 03/06.
<br/><br/>3- Se o novo dia informado for antes do dia atual, mas a próxima recorrência for em outro mês, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/09. Quando atualizado para o dia 03, a data da próxima recorrência será 03/09.

<br/>Para modificar o dia de vencimento de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay</span></aside>

```json
16
```

```shell
--request PUT "https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay"
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Valor da Transação da Recorrência

Para modificar o valor da transação de uma recorrência já existente, basta fazer um PUT conforme o exemplo.

<aside class="warning">Essa alteração só afeta a data de pagamento da recorrência seguinte.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Amount</span></aside>

```json
156
```

```shell
--request POST "https://apisandbox.cieloecommerce.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Amount"
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando a Data do Próximo Pagamento

Para alterar somente a data do pagamento seguinte, basta fazer um PUT conforme o exemplo abaixo.

<aside class="warning">Esta operação modifica somente a data do pagamento seguinte, ou seja, as recorrências futuras permanecerão com as características originais.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate</span></aside>

```json
"2017-06-15"
```

```shell
--request PUT "https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate"
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando os Dados de Pagamento da Recorrência

Durante o ciclo de vida de uma recorrência, é possível alterar:

* Adquirente (ex.: de Rede para Cielo);
* Cartão (em caso de cartão vencido);
* Meio de pagamento (de cartão para boleto e vice-e-versa).

<br/>Para alterar os dados de pagamento, basta fazer um PUT conforme o exemplo.

<aside class="warning">ATENÇÃO: Essa alteração afeta a todos os dados do nó "Payment". Para manter os dados anteriores, você deve informar esses campos utilizando os valores já salvos a serem mantidos.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Payment</span></aside>

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
      "Username": "#Username@NOMEDALOJA#",
      "Signature": "001"
   }
}
```

```shell
--request PUT "https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Payment"
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
      "Username": "#Username@NOMEDALOJA#",
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Desabilitação de Pedido

### Desabilitando um Pedido Recorrente

Para desabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Deactivate</span></aside>

```shell
--request PUT "https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Deactivate"
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Reabilitação de Pedido

### Reabilitando um Pedido Recorrente

Para reabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Reactivate</span></aside>

```shell
--request PUT "https://apisandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/{RecurrentPaymentId}/Reactivate"
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

Consulte o anexo [HTTP Status Code](https://developercielo.github.io/manual/cielo-ecommerce#http-status-code){:target="_blank"} para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Transação com Renova Fácil

O *Renova Fácil* é um serviço desenvolvido pela Cielo em conjunto com os emissores cujo objetivo é aumentar a taxa de conversão de vendas recorrentes com cartão de crédito e débito.

Através da identificação de cartões vencidos no momento da transação, é feita a autorização com um novo cartão, que é então retornado para armazenagem.

<aside class="notice">Emissores participantes: Bradesco, Banco do Brasil, Santander, Panamericano, Citibank.</aside>

Para utilizar o Renova Fácil, é necessário que o serviço esteja habilitado na Cielo. Não é necessário enviar nenhuma informação extra na requisição de autorização, porém a resposta terá o nó `NewCard`, tanto para transação de crédito quanto para transação de débito.

Veja a seguir o exemplo de resposta de uma transação de crédito.

### Resposta

```json
{
  "MerchantOrderId": "2014113245231706",
  "Customer": {
    "Name": "Comprador Renova facil"
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": 0,
    "Capture": false,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "123412******1231",
      "Holder": "Teste Holder",
      "ExpirationDate": "12/2030",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "Tid": "10447480685P4611AQ9B",
    "ProofOfSale": "087001",
    "SoftDescriptor": "123456789ABCD",
    "Provider": "Cielo",
    "Eci": "0",
    "NewCard": {
       "CardNumber": "40000000000000000",
       "ExpirationDate": "10/2020",
       "SaveCard": false,
        "Brand": "Visa"
    },
    "VelocityAnalysis": {
      "Id": "94f06657-c715-45d2-a563-63f7dbb19e08",
      "ResultMessage": "Accept",
      "Score": 0
    },
    "PaymentId": "94f06657-c715-45d2-a563-63f7dbb19e08",
    "Type": "CreditCard",
    "Amount": 1500,
    "ReceivedDate": "2016-12-26 14:14:21",
    "Currency": "BRL",
    "Country": "BRA",
    "ReturnCode": "KA",
    "ReturnMessage": "Autorizacao negada",
    "Status": 3,
    "RecurrentPayment": {
      "ReasonCode": 7,
      "ReasonMessage": "Denied",
      "EndDate": "2019-12-01",
      "Interval": 6,
      "AuthorizeNow": true
    },
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquery.cieloecommerce.cielo.com.br/1/sales/94f06657-c715-45d2-a563-63f7dbb19e08"
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
  "MerchantOrderId": "2014113245231706",
  "Customer": {
    "Name": "Comprador  Renova facil"
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": 0,
    "Capture": false,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "123412******1231",
      "Holder": "Teste Holder",
      "ExpirationDate": "12/2030",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "Tid": "10447480685P4611AQ9B",
    "ProofOfSale": "087001",
    "SoftDescriptor": "123456789ABCD",
    "Provider": "Cielo",
    "Eci": "0",
    "NewCard": {
       "CardNumber": "40000000000000000",
       "ExpirationDate": "10/2020",
       "SaveCard": false,
        "Brand": "Visa"
    },
    "VelocityAnalysis": {
      "Id": "94f06657-c715-45d2-a563-63f7dbb19e08",
      "ResultMessage": "Accept",
      "Score": 0
    },
    "PaymentId": "94f06657-c715-45d2-a563-63f7dbb19e08",
    "Type": "CreditCard",
    "Amount": 1500,
    "ReceivedDate": "2016-12-26 14:14:21",
    "Currency": "BRL",
    "Country": "BRA",
    "ReturnCode": "KA",
    "ReturnMessage": "Autorizacao negada",
    "Status": 3,
    "RecurrentPayment": {
      "ReasonCode": 7,
      "ReasonMessage": "Denied",
      "EndDate": "2019-12-01",
      "Interval": 6,
      "AuthorizeNow": true
    },
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquery.cieloecommerce.cielo.com.br/1/sales/94f06657-c715-45d2-a563-63f7dbb19e08"
      }
    ]
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
|`Payment.Capture`|Boleano|-|Sim|Parâmetro para capturar a transação. Caso o valor seja `False` a transação será apenas autorizada. Se for `True`, a captura será realizada automaticamente após a autorização.<br>Caso use o fluxo *AuthorizeFirst*, é obrigatório enviar o campo `PaymentCapture` como `False`.|
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
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|-|Não|Indica se a transação após a análise de fraude será capturada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de baixo risco (Accept) a transação anteriormente autorizada será capturada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será capturada após o Split receber a notificação da alteração de status e esta for baixo risco (Accept) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.TotalOrderAmount`|Inteiro|15|Não|Valor total do pedido em centavos, podendo ser diferente do valor da transação  |Ex.: Valor do pedido sem a taxa de entrega|
|`Payment.FraudAnalisys.Browser`|-|-|Sim|-|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|255|Sim|Ip do comprador|
|`Payment.FraudAnalysis.Browser.BrowserFingerPrint`|Texto|88|Sim|Impressão digital de dispositivos e geolocalização real do IP do comprador [Configuração do Fingerprint](https://braspag.github.io//manual/antifraude#cybersource){:target="_blank"}|
|`Payment.FraudAnalysis.Cart`|Lista|-|Não|Nó contendo as informações do carrinho de compras para análise de fraude|
|`Payment.FraudAnalysis.Cart.Items[].Name`|Texto|50|Não|Nome do produto|
|`Payment.FraudAnalysis.Cart.Items[].Sku`|Texto|12|Não|Sku do produto|
|`Payment.FraudAnalysis.Cart.Items[].UnitPrice`|Inteiro|15|Não|Preço original do produto em centavos  |Ex.: R$ 1.559,85 = 155985|
|`Payment.FraudAnalysis.Cart.Items[].Quantity`|Inteiro|-|Não|Quantidade do produto|
|`Payment.FraudAnalysis.MerchantDefinedFields`|Lista|-|Sim|Nó contendo dados adicionais para análise de fraude [Tabela de Merchant Defined Data](https://braspag.github.io//manual/antifraude#tabela-31-merchantdefineddata-(cybersource){:target="_blank"}|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Id`|Inteiro|-|Sim|Identificador de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Value`|Texto|255|Sim|Valor de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.Shipping`|-|-|Não|Nó contendo informações adicionais da entrega do pedido para análise de fraude|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|61|Não|Nome e sobrenome do destinatário|

# Post de Notificação

Para receber a notificação de alteração de status da transação (ex.: confirmação de pagamento ou devolução), é preciso configurar o campo "URL de Notificação" durante o cadastro de sua loja no Split. O endereço deve ser HTTPS e não se deve utilizar uma porta fora do padrão HTTPS (443).

Veja o fluxo percorrido pelo Post de Notificação:

![SplitPostNotificacao]({{ site.baseurl_root }}/images/braspag/split/split12-post-notificacao.png)

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
|"7"|Notificação de chargeback. Para mais detalhes, consulte o manual de [Risk Notification](https://braspag.github.io//manual/risknotification){:target="_blank"}.|
|"8"|Alerta de fraude.|

## Resposta Esperada

É esperado o retorno da loja com a seguinte resposta: `HTTP Status Code 200 OK`.

Caso não seja retornada a resposta acima, haverá mais duas tentativas de envio do Post de Notificação.

********************************************************************************************************************************************************************

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

## Programa de Retentativa das Bandeiras

Quando uma pessoa tenta fazer uma compra com cartão no e-commerce a transação pode ser negada devido a uma série de fatores. As **tentativas seguintes de concluir a transação** usando o **mesmo cartão** são o que chamamos de **retentativa**.

**Como funciona?**

As transações negadas são classificadas como:

* **Irreversíveis**: quando a retentativa não é permitida;
* **Reversíveis**: quando a retentativa é permitida mediante as regras de cada bandeira.

<br/>
As retentativas podem ser cobradas pela bandeira e a quantidade de vezes que uma transação pode ser retentada antes da cobrança também varia de acordo com a bandeira.

> Para ver as regras de retentativa de cada bandeira, acesse o manual [Programa de Retentativa das Bandeiras](https://developercielo.github.io/tutorial/programa-retentativa-bandeiras){:target="_blank"}

## Códigos de retorno ABECS

A Associação Brasileira das Empresas de Cartão de Crédito e Serviços (ABECS) é responsável pela padronização do **código de retorno das autorizações de vendas negadas** tanto para as soluções pagamento do mundo físico quanto de e-commerce do mercado brasileiro.

> Para ver a relação completa dos códigos de retorno das transações negadas, acesse a tabela [Códigos de retorno ABECS](https://developercielo.github.io/tutorial/abecs-e-outros-codigos){:target="_blank"}
