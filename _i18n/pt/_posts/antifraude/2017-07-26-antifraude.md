---
layout: manual
title: Antifraude - Manual de integração
description: Integração técnica API Antifraude Gateway Braspag
search: true
categories: manual
tags:
  - Gestão de Risco
language_tabs:
  json: JSON    
---

# Visão Geral

**Antifraude Gateway** é uma plataforma desenvolvida pelo time de Risco da Braspag para facilitar a integração dos clientes que desejam realizar análises de fraude com provedores distintos e com tecnologias distintas, ou seja, o Antifraude Gateway é responsável por realizar a interconexão entre o cliente que utiliza JSON na mensageria e o provedor que utiliza XML na mensageria, por exemplo.

A plataforma é baseada em arquitetura REST, que trocam dados em formato JSON seguindo fluxos de autorização definidos pelo protocolo OAuth 2, onde todos os padrões são amplamente utilizados pelo mercado e suportado pelas comunidades técnicas.

> Para saber mais sobre OAuth 2, consulte [https://oauth.net/2/](https://oauth.net/2/)

A plataforma foi construída utilizando um dos principais produtos da Braspag, o Cartão Protegido, para tokenização de cartões e análises de fraude através dos tokens.

# Objetivo

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a API Antifraude Gateway Braspag, gateway de provedores de soluções de antifraude de mercado, descrevendo as operações disponíveis com exemplos de requisições e respostas.

Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

# Hosts

## API BraspagAuth

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https://authsandbox.braspag.com.br|
|`Produção`|https://auth.braspag.com.br|

## API Antifraude Gateway

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https://risksandbox.braspag.com.br|
|`Produção`|https://risk.braspag.com.br|

# Autenticação

## Tokens de Acesso

A API Antifraude Gateway Braspag utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, que são: **Sandbox** e **Produção**.

Esta sessão descreve o fluxo necessário para que aplicações cliente obtenham tokens de acesso válidos para uso na plataforma.

## Obtenção do token de acesso  

O token de acesso é obtido através do fluxo oauth **client_credentials**. O diagrama abaixo, ilustra, em ordem cronológica, a comunicação que se dá entre a **Aplicação Cliente**, a **API BraspagAuth** e a **API Antifraude Gateway**.

1. A **Aplicação Cliente**, informa à API **BraspagAuth** sua credencial.

2. O **BraspagAuth** valida a credencial recebida. Se for válida, retorna o token de acesso para a **Aplicação Cliente**.

3. A **Aplicação Cliente** informa o token de acesso no cabeçalho das requisições HTTP feitas à **API Antifraude Gateway Braspag**.

4. Se o token de acesso for válido, a requisição é processada e os dados são retornados para a **Aplicação Cliente**.

> Caso não tenha recebido a credencial, solicite-a abrindo um ticket através da nossa ferramenta de suporte.
[Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br)

## Como obter o token

Uma vez em posse da credencial, será necessário "codificá-la" em Base64, utilizando a convenção **client_id:client_secret**, e enviar o resultado no cabeçalho através do campo **Authorization**.

Exemplo:
* client_id: **braspagtestes**
* client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* String a ser codificada em Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* Resultado após a codificação: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no corpo (Body)**

|Key|Value|
|:-|:-|
|`scope`|AntifraudGatewayApp|
|`grant_type`|client_credentials|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido, no caso a API Antifraude Gateway|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/>O token quando expirar, é necessário obter um novo|

# Realizando uma análise de fraude

A Braspag ao receber os dados do pedido, encaminha para o provedor analisá-los. Os provedores utilizam tecnologias como identificação de máquina, geolocalização de IP, análise de redes sociais, detecção de proxy e contadores de velocidade. Em tempo real receberá um recomendação da análise e poderá tomar uma ação.

## Analisando uma transação na Cybersource

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "Cybersource",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "Tid": "12345678910111216AB8",
  "Nsu": "951852",
  "AuthorizationCode":"T12345",
  "SaleDate": "2016-12-09 10:01:55.662",
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA"
  },
  "Billing": {
    "Street": "Rua Saturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Neturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "FirstName": "João",
    "LastName": "Silva",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "LastName": "Silva",
    "BirthDate": "2016-12-09",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "Ip": "127.0.0.1",
    "BrowserHostName":"www.dominiobrowsercomprador.com.br",
    "BrowserCookiesAccepted":true,
    "BrowserEmail":"emailbrowsercomprador@dominio.com.br",
    "BrowserType":"Chrome 58 on Windows 10",
    "BrowserFingerprint":"braspag123456789"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "Category": "EletronicGood"
      "UnitPrice": "12000",
      "Sku": "abc123",
      "Quantity": 1,
      "Risk":"Low",
      "AddressRiskVerify":"No",
      "HostHedge":"Low",
      "NonSensicalHedge":"Normal",
      "ObscenitiesHedge":"High",
      "TimeHedge":"Low",
      "PhoneHedge":"Normal",
      "VelocityHedge":"High"
    },
    {
      "ProductName": "Teclado",
      "Category": "EletronicGood"
      "UnitPrice": "96385",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "Risk": "High"
    }
  ],
  "MerchantDefinedData": [
    {
      "Key": "1",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "2",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "3",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    }
  ],
  "Bank":{
    "Address": "Rua Marte, 29",
    "Code": "237",
    "Agency": "987654",
    "City": "Rio de Janeiro",
    "Country": "BR",
    "Name": "Bradesco",
    "SwiftCode": "789"
  },
  "FundTransfer":{
    "AccountNumber":"159753",
    "AccountName":"Conta particular",
    "BankCheckDigit":"51",
    "Iban":"123456789"
  },
  "Invoice":{
    "IsGift": false,
    "ReturnsAccept": true,
    "Tender": "Consumer"
  },
  "Airline": {
    "JourneyType": "OneWayTrip",
    "DepartureDateTime": "2018-01-09 18:00",
    "Passengers": [
    {
        "FirstName": "Fulano",
        "LastName": "Tal",
        "PassangerId": "",
        "PassengerType": "Adult",
        "Email": "email@mail.com",
        "Phone": "1234567890",
        "Status": "Gold",
        "Legs" : [
        {
            "ArrivalAirport": "AMS",
            "DepartureAirport": "GIG"
        }]
    }]
  }
}
```

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`MerchantOrderId` |Número do pedido da loja|string|sim|100|
|`TotalOrderAmount`|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|long|sim|-|
|`TransactionAmount`|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|long|sim|-|
|`Currency`|Moeda. Maiores informações em [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)|string|sim|3|
|`Provider`|Provedor da solução de antifraude <br/> [Tabela 1 - Provider]({{ site.baseurl_root }}manual/antifraude#tabela-1-provider)|enum|-|-|
|`BraspagTransactionId`|Id da transação no Pagador da Braspag|guid|não|-|
|`Tid`|Id da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Nsu`, `AuthorizationCode` e `SaleDate`, além deste em questão|string|não|20|
|`Nsu`|Número sequencial único da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Tid`, `AuthorizationCode` e `SaleDate`, além deste em questão|string|não|10|
|`AuthorizationCode`|Código de autorização da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Tid`, `Nsu` e `SaleDate`, além deste em questão|string|não|10|
|`SaleDate`|Data da autorização da transação da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Tid`, `Nsu` e `AuthorizationCode`, além deste em questão|datetime|não|-|
|`Card.Number`|Número do cartão de crédito|string|sim|20|
|`Card.Holder`|Nome do portador impresso no cartão de crédito|string|sim|50|
|`Card.ExpirationDate`|Data de expiração do cartão de crédito <br/> Ex.: 01/2023|string|sim|7|
|`Card.Brand`|Bandeira do cartão de crédito <br/> [Tabela 2 - Card.Brand]({{ site.baseurl_root }}manual/antifraude#tabela-2-card.brand)|enum|sim|-|
|`Card.Save`|Indica se os dados do cartão de crédito serão armazenados no Cartão Protegido|bool|não|-|
|`Card.Token`|Identificador do cartão de crédito salvo no Cartão Protegido|guid|não|-|
|`Card.Alias`|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|string|não|64|
|`Billing.Street`|Logradouro do endereço de cobrança|string|sim|54|
|`Billing.Number`|Número do endereço de cobrança|string|sim|5|
|`Billing.Complement`|Complemento do endereço de cobrança|string|não|14|
|`Billing.Neighborhood`|Bairro do endereço de cobrança|string|sim|45|
|`Billing.City`|Cidade do endereço de cobrança|string|sim|50|
|`Billing.State`|Estado do endereço de cobrança|string|sim|2|
|`Billing.Country`|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|sim|2|
|`Billing.ZipCode`|Código postal do endereço de cobrança|string|sim|9|
|`Shipping.Street`|Logradouro do endereço de entrega|string|não|54|
|`Shipping.Number`|Número do endereço de entrega|string|não|5|
|`Shipping.Complement`|Complemento do endereço de entrega|string|não|14|
|`Shipping.Neighborhood`|Bairro do endereço de entrega|string|não|45|
|`Shipping.City`|Cidade do endereço de entrega|string|não|50|
|`Shipping.State`|Estado do endereço de entrega|string|não|2|
|`Shipping.Country`|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|
|`Shipping.ZipCode`|Código postal do endereço de entrega|string|não|9|
|`Shipping.FirstName`|Primeiro nome do responsável a receber o produto no endereço de entrega|string|não|60|
|`Shipping.LastName`|Último do nome do responsável a receber o produto no endereço de entrega|string|não|60|
|`Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114700|string|não|15|
|`Shipping.ShippingMethod`|Meio de entrega do pedido <br/> [Tabela 3 - ShippingMethod]({{ site.baseurl_root }}manual/antifraude#tabela-3-shippingmethod)|enum|-|-|
|`Customer.MerchantCustomerId`|Número do documento de identificação do comprador, CPF ou CNPJ|string|sim|16|
|`Customer.FirstName`|Primeiro nome do comprador|string|sim|60|
|`Customer.LastName`|Último nome do comprador|string|sim|60|
|`Customer.BirthDate`|Data de nascimento do comprador <br/> Ex.: 1983-10-01|date|sim|-|
|`Customer.Email`|E-mail do comprador|string|sim|100|
|`Customer.Ip`|Endereço de IP do comprador. Formato IPv4 ou IPv6|string|sim|45|
|`Customer.Phone`|Número do telefone do comprador <br/> Ex.: 552121114700|string|sim|15|
|`Customer.BrowserHostName`|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|string|não|60|
|`Customer.BrowserCookiesAccepted`|Identifica se o browser do comprador aceita cookies <br/> Possíveis valores: true / false (default)|bool|-|-|
|`Customer.BrowserEmail`|E-mail registrado no browser do comprador. Pode diferenciar do e-mail de cadastro na loja(`Customer.Email`)|string|não|100|
|`Customer.BrowserType`|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP <br/> Ex.: Google Chrome, Mozilla Firefox, Safari, etc|string|não|40|
|`Customer.BrowserFingerprint`|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas. <br/> [Configuração do Fingerprint]({{ site.baseurl_root }}/manual/antifraude#cybersource)|string|sim|100|
|`CartItem[n].ProductName`|Nome do produto|string|sim|255|
|`CartItem[n].Category`|Categoria do produto <br/> [Tabela 32 - CartItem{n}.Category]({{ site.baseurl_root }}manual/antifraude#tabela-32-cartitem[n].category)|enum|-|-|
|`CartItem[n].Risk`|Nível de risco do produto associado a quantidade de chargebacks <br/> [Tabela 7 - CartItem{n}.Risk]({{ site.baseurl_root }}manual/antifraude#tabela-7-cartitem[n].risk)|enum|-|-|
|`CartItem[n].UnitPrice`|Preço unitário do produto <br/> Ex: 10950 = r$ 109,50|long|sim|-|
|`CartItem[n].Sku`|SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto|string|sim|255|
|`CartItem[n].Quantity`|Quantidade do produto|int|sim|-|
|`CartItem[n].AddressRiskVerify`|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países <br/> [Tabela 8 - CartItem{n}.AddressRiskVerify]({{ site.baseurl_root }}manual/antifraude#tabela-8-cartitem[n].addressriskverify)|enum|-|-|
|`CartItem[n].HostHedge`|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude <br/> [Tabela 9 - CartItem{n}.HostHedge]({{ site.baseurl_root }}manual/antifraude#tabela-9-cartitem[n].hosthedge)|enum|-|-|
|`CartItem[n].NonSensicalHedge`|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude <br/> [Tabela 10 - CartItem{n}.NonSensicalHedge]({{ site.baseurl_root }}manual/antifraude#tabela-14-cartitem[n].nonsensicalhedge)|enum|-|-|
|`CartItem[n].ObscenitiesHedge`|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude <br/> [Tabela 11 - CartItem{n}.ObscenitiesHedge]({{ site.baseurl_root }}manual/antifraude#tabela-11-cartitem[n].obscenitieshedge)|enum|-|-|
|`CartItem[n].TimeHedge`|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido <br/> [Tabela 12 - CartItem{n}.TimeHedge]({{ site.baseurl_root }}manual/antifraude#tabela-12-cartitem[n].timehedge)|enum|-|-|
|`CartItem[n].PhoneHedge`|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude <br/> [Tabela 13 - CartItem{n}.PhoneHedge]({{ site.baseurl_root }}manual/antifraude#tabela-17-cartitem[n].phonehedge)|enum|-|-|
|`CartItem[n].VelocityHedge`|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores <br/> [Tabela 14 - CartItem{n}.VelocityHedge]({{ site.baseurl_root }}manual/antifraude#tabela-18-cartitem[n].velocityhedge)|enum|-|-|
|`Bank.Name`|Nome do banco do comprador|string|não|40|
|`Bank.Code`|Código do banco do comprador|string|não|15|
|`Bank.Agency`|Agência do banco do comprador|string|não|15|
|`Bank.Address`|Endereço do banco do comprador|string|não|255|
|`Bank.City`|Cidade onde está localizado o banco do comprador|string|não|15|
|`Bank.Country`|País onde está localizado o banco do comprador <br/> Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|
|`Bank.SwiftCode`|Código identificador único do banco do comprador|string|não|30|
|`FundTransfer.AccountName`|Nome vinculado a conta bancária|string|não|30|
|`FundTransfer.AccountNumber`|Número da conta bancária do comprador|string|não|30|
|`FundTransfer.BankCheckDigit`|Código utilizado para validar a conta bancária do comprador|string|não|2|
|`FundTransfer.Iban`|Número internacional da conta bancária do comprador (IBAN)|string|não|30|
|`Invoice.IsGift`|Indica se o pedido realizado pelo comprador é para presente|bool|não|-|
|`Invoice.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser devolvido a loja|bool|não|-|
|`Invoice.Tender`|Forma de pagamento utilizada pelo comprador <br/> [Tabela 15 - Invoice.Tender]({{ site.baseurl_root }}manual/antifraude#tabela-19-invoice.tender)|enum|não|-|
|`Airline.JourneyType`|Tipo de viagem <br/> [Tabela 4 - Airline.JourneyType]({{ site.baseurl_root }}manual/antifraude#tabela-4-airline.journeytype)|enun|não|-|
|`Airline.DepartureDateTime`|Data e hora de partida <br/> Ex.: 2018-03-31 19:16:38|datetime|não|-|
|`Airline.Passengers[n].FirstName`|Primeiro nome do passageiro|string|não|60|
|`Airline.Passengers[n].LastName`|Último nome do passageiro|string|não|60|
|`Airline.Passengers[n].PassengerId`|Identificador do passageiro a quem a passagem foi emitida|string|não|32|
|`Airline.Passengers[n].PassengerType`|Tipo do passageiro <br/> [Tabela 5 - Airline.Passengers{n}.PassengerType]({{ site.baseurl_root }}manual/antifraude#tabela-5-airline.passengers[n].passengertype)|enum|não|-|
|`Airline.Passengers[n].Phone`|Telefone do passageiro <br/> Ex.: 552121114700|string|não|15|
|`Airline.Passengers[n].Email`|E-mail do passageiro|string|não|255|
|`Airline.Passengers[n].Status`|Classificação da empresa aérea <br/> [Tabela 6 - Airline.Passengers{n}.Status]({{ site.baseurl_root }}manual/antifraude#tabela-6-airline.passengers[n].status)|enum|não|60|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Código do aeroporto de partida. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|não|3|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Código do aeroporto de chegada. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|não|3|
|`CustomConfiguration.Comments`|Comentários que a loja poderá associar a análise de fraude|string|não|255|
|`CustomConfiguration.ScoreThreshold`|Nível aceitável de risco para cada produto|int|-|-|
|`MerchantDefinedData[n].Key`|Chave do campo definido junto ao provedor de antifraude <br/> [Tabela 31 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}manual/antifraude#tabela-31-merchantdefineddata-(cybersource))|int|não|-|
|`MerchantDefinedData[n].Value`|Valor do campo definido junto ao provedor de antifraude <br/> [Tabela 31 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}manual/antifraude#tabela-31-merchantdefineddata-(cybersource))|var|não|-|

``` json
{
   "TransactionId": "1eae3d39-a723-e811-80c3-0003ff21d83f",
   "Status": "Accept",
   "ProviderAnalysisResult": {
       "ProviderTransactionId": "5206061832306553904009",
       "ProviderStatus": "ACCEPT",
       "ProviderCode": "100",
       "ProviderRequestTransactionId": "AhjzbwSTGjifFZXHYduJEAFReTUyEoftDpA9+Ehk0kv9Atj2YEBMmAL2",
       "AfsReply": {
           "reasonCode": "100",
           "afsResult": "99",
           "hostSeverity": "3",
           "consumerLocalTime": "11:36:23",
           "afsFactorCode": "D^F^Z",
           "addressInfoCode": "COR-BA",
           "hotlistInfoCode": "NEG-AFCB^NEG-BA^NEG-CC^NEG-EM^NEG-PEM^NEG-SA^REV-PPH^REV-SUSP",
           "internetInfoCode": "FREE-EM^RISK-EM",
           "suspiciousInfoCode": "RISK-TB",
           "velocityInfoCode": "VEL-NAME",
           "scoreModelUsed": "default_lac"
       },
       "DecisionReply": {
           "casePriority": "3",
           "activeProfileReply": {},
           "velocityInfoCode": "GVEL-R1^GVEL-R2^GVEL-R4^GVEL-R6^GVEL-R7^GVEL-R9"
       }
   },
   "Links": [
       {
           "Method": "GET",
           "Href": "http://localhost:1316/Analysis/v2/1eae3d39-a723-e811-80c3-0003ff21d83f",
           "Rel": "Self"
       }
   ]
}
```

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`TransactionId`|Id da transação no Antifraude Gateway Braspag|guid|
|`Status`|Status da transação no Antifraude Gateway Braspag <br/> [Tabela 16 - Status]({{ site.baseurl_root }}manual/antifraude#tabela-16-status)|enum|
|`ProviderAnalysisResult.ProviderTransactionId`|Id da transação na Cybersource|string|
|`ProviderAnalysisResult.ProviderStatus`|Status da transação na Cybersource <br/> [Tabela 17 - ProviderStatus]({{ site.baseurl_root }}manual/antifraude#tabela-17-providerstatus)|enum|
|`ProviderAnalysisResult.ProviderCode`|Código de retorno da Cybersouce <br/> [Tabela 18 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}manual/antifraude#tabela-18-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.ProviderRequestTransactionId`|Id do request da transação na Cybersource|string|
|`ProviderAnalysisResult.Missing`|Campos faltantes na requisição enviada a Cybersource|string|
|`ProviderAnalysisResult.Invalid`|Campos com valores inválidos enviado a Cybersource|string|
|`ProviderAnalysisResult.AfsReply.AddressInfoCode`|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador <br/> Os códigos são concatenados usando o caracter ^ Ex.: MM-A^MM-Z <br/>[Tabela 19 - ProviderAnalysisResult.AfsReply.AddressInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-19-provideranalysisresult.afsreply.addressinfocode)|string|
|`ProviderAnalysisResult.AfsReply.AfsFactorCode`|Códigos que afetaram a pontuação da análise <br/> Os códigos são concatenados usando o caracter ^. Ex.: F^P <br/>[Tabela 20 - ProviderAnalysisResult.AfsReply.AfsFactorCode]({{ site.baseurl_root }}manual/antifraude#tabela-20-provideranalysisresult.afsreply.afsfactorcode)|string|
|`ProviderAnalysisResult.AfsReply.AfsResult`|Score total calculado para o pedido|int|
|`ProviderAnalysisResult.AfsReply.BinCountry`|Código do país do BIN do cartão usado na análise. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`ProviderAnalysisResult.AfsReply.CardAccountType`|Tipo do cartão do comprador <br/>[Tabela 21 - ProviderAnalysisResult.AfsReply.CardAccountType]({{ site.baseurl_root }}manual/antifraude#tabela-21-provideranalysisresult.afsreply.cardaccounttype)|string|
|`ProviderAnalysisResult.AfsReply.CardIssuer`|Nome do banco ou entidade emissora do cartão|string|
|`ProviderAnalysisResult.AfsReply.CardScheme`|Bandeira do cartão|string|
|`ProviderAnalysisResult.AfsReply.ConsumerLocalTime`|Horário local do comprador, calculado a partir da data da solicitação e do endereço de cobrança|string|
|`ProviderAnalysisResult.AfsReply.HostSeverity`|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto|int|
|`ProviderAnalysisResult.AfsReply.HotListInfoCode`|Códigos que indicam que os dados do comprador estão associados em listas de positivas ou negativas <br/> Os códigos são concatenados usando o caracter ^. Ex.: NEG-AFCB^NEG-CC <br/>[Tabela 22 - ProviderAnalysisResult.AfsReply.HotListInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-22-provideranalysisresult.afsreply.hotlistinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IdentityInfoCode`|Códigos que indicam mudanças de identidade excessivas <br/> Os códigos são concatenados usando o caracter ^. Ex.: COR-BA^MM-BIN <br/> [Tabela 23 - ProviderAnalysisResult.AfsReply.IdentityInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-23-provideranalysisresult.afsreply.identityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.InternetInfoCode`|Códigos que indicam problemas com o endereço de e-mail, o endereço IP ou o endereço de cobrança <br/> Os códigos são concatenados usando o caracter ^. Ex.: FREE-EM^RISK-EM <br/> [Tabela 24 - ProviderAnalysisResult.AfsReply.InternetInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-24-provideranalysisresult.afsreply.internetinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IpCity`|Nome da cidade do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.IpCountry`|Nome do país do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.IpRoutingMethod`|Método de roteamento do comprador obtido a partir do endereço de IP <br/> [Tabela 28 - ProviderAnalysisResult.AfsReply.IpRoutingMethod]({{ site.baseurl_root }}manual/antifraude#tabela-28-provideranalysisresult.afsreply.iproutingmethod)|string|
|`ProviderAnalysisResult.AfsReply.IpState`|Nome do estado do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.PhoneInfoCode`|Códigos que indicam um problema com o número de telefone do comprador <br/> Os códigos são concatenados usando o caracter ^. Ex.: UNV-AC^RISK-AC <br/> [Tabela 25 - ProviderAnalysisResult.AfsReply.PhoneInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-25-provideranalysisresult.afsreply.phoneinfocode)|string|
|`ProviderAnalysisResult.AfsReply.ReasonCode`|Código de retorno da Cybersouce <br/> [Tabela 18 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}manual/antifraude#tabela-18-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.AfsReply.ScoreModelUsed`|Nome do modelo de score utilizado na análise. Caso não tenha nenhum modelo definido, o modelo padrão da Cybersource foi o utilizado|string|
|`ProviderAnalysisResult.AfsReply.SuspiciousInfoCode`|Códigos que indicam que o comprador forneceu potencialmente informações suspeitas <br/> Os códigos são concatenados usando o caracter ^. Ex.: RISK-TB^RISK-TS <br/> [Tabela 26 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-26-provideranalysisresult.afsreply.suspiciousinfocode)|string|
|`ProviderAnalysisResult.AfsReply.VelocityInfoCode`|Códigos que indicam que o comprador tem uma alta frequência de compras <br/> Os códigos são concatenados usando o caracter ^. Ex.: VELV-SA^VELI-CC^VELSIP <br/> [Tabela 27 - ProviderAnalysisResult.AfsReply.VelocityInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-27-provideranalysisresult.afsreply.velocityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.BrowserLanguage`|Linguagem do browser utilizado pelo comprador no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ScreenResolution`|Resolução da tela do comprador no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.CookiesEnabled`|Flag identificando que o browser do comprador estava habilitado para armazenar cookies temporariamente no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.FlashEnabled`|Flag identificando que o browser do comprador habilitado a execução de conteúdos em Flash no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.Hash`|Hash gerado a partir dos dados coletados pelo script de fingerprint|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ImagesEnabled`|Flag identificando que o browser do comprador estava com cache de imagens habilitado no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.JavascriptEnabled`|Flag identificando que o browser do comprador estava com a execução de sripts em Javascript habilitada no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddress`|Flag identificando que o IP do comprador é real|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCity`|Flag identificando que o IP do comprador é de fato da cidade que deveria ser mesmo|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCountry`|Flag identificando que o IP do comprador é de fato do país que deveria ser mesmo|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartId`|Identificador do dispositivo do comprador|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartIdConfidenceLevel`|Identificador do dispositivo do comprador|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.DestinationQueue`|Quando modo verbose ativado, nome da fila para onde as transações não aceitas automaticamente são enviadas|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.Name`|Quando modo verbose ativado, nome do perfil selecionado na análise. Se não tiver nenhum, o perfil padrão foi selecionado|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.SelectedBy`|Quando modo verbose ativado, nome do seletor de regras que seleciona o perfil de regras|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].RuleId`|Quando modo verbose ativado, id da regra|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision`|Quando modo verbose ativado, decisão tomada pela regra <br/> [Tabela 29 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Decision]({{ site.baseurl_root }}manual/antifraude#tabela-29-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].decision)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation`|Quando modo verbose ativado, avaliação da regra <br/> [Tabela 30 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Evaluation]({{ site.baseurl_root }}manual/antifraude#tabela-34-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].evaluation)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Name`|Quando modo verbose ativado, nome da regra|string|
|`ProviderAnalysisResult.DecisionReply.CasePriority`|Define o nível de prioridade das regras ou perfis do lojista. O nível de prioridade varia de 1 (maior) a 5 (menor) e o valor padrão é 3, e este será atribuído caso não tenha definido a prioridade das regras ou perfis. Este campo somente será retornado se a loja for assinante do Enhanced Case Management|int|
|`ProviderAnalysisResult.DecisionReply.VelocityInfoCode`|Códigos de informação disparados pela análise. Estes códigos foram gerados no momento da criação das regras|string|

## Indicando erros de integração

``` json
{
  "Message": "The request is invalid.",
  "ModelState": {
    "request.Customer.Gender": [
      "Error converting value \"M\" to type 'Antifraude.Domain.Enums.GenderType'. Path 'Customer.Gender', line 51, position 17."
    ],
    "FraudAnalysisRequestError": [
      "The Card.EciThreeDSecure lenght is gratter than 1",
      "The Shipping.Complement lenght is gratter than 14",
      "The Shipping.MiddleName lenght is gratter than 1",
      "The Customer.MerchantCustomerId lenght is gratter than 16",
      "The Customer.MiddleName lenght is gratter than 1"
    ]
  }
}
```

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`Message`|Mensagem informando que o request é inválido|
|`ModelState`|Coleção que conterá mensagens com os campos que não estejam de acordo com o tipo ou domínio conforme especificado no manual|
|`FraudAnalysisRequestError`|Coleção que conterá mensagens com os campos que não estejam de acordo com o tamanho especificado no manual|

# Consultas

## Consultando uma transação Cybersource

``` json
{
   "TransactionId": "1eae3d39-a723-e811-80c3-0003ff21d83f",
   "Status": "Accept",
   "ProviderAnalysisResult": {
       "ProviderTransactionId": "5206061832306553904009",
       "ProviderStatus": "ACCEPT",
       "ProviderCode": "100",
       "ProviderRequestTransactionId": "AhjzbwSTGjifFZXHYduJEAFReTUyEoftDpA9+Ehk0kv9Atj2YEBMmAL2",
       "AfsReply": {
           "reasonCode": "100",
           "afsResult": "99",
           "hostSeverity": "3",
           "consumerLocalTime": "11:36:23",
           "afsFactorCode": "D^F^Z",
           "addressInfoCode": "COR-BA",
           "hotlistInfoCode": "NEG-AFCB^NEG-BA^NEG-CC^NEG-EM^NEG-PEM^NEG-SA^REV-PPH^REV-SUSP",
           "internetInfoCode": "FREE-EM^RISK-EM",
           "suspiciousInfoCode": "RISK-TB",
           "velocityInfoCode": "VEL-NAME",
           "scoreModelUsed": "default_lac"
       },
       "DecisionReply": {
           "casePriority": "3",
           "activeProfileReply": {},
           "velocityInfoCode": "GVEL-R1^GVEL-R2^GVEL-R4^GVEL-R6^GVEL-R7^GVEL-R9"
       }
   },
   "Links": [
       {
           "Method": "GET",
           "Href": "http://localhost:1316/Analysis/v2/1eae3d39-a723-e811-80c3-0003ff21d83f",
           "Rel": "Self"
       }
   ],
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "Cybersource",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA"
  },
  "Billing": {
    "Street": "Rua Saturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Neturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "FirstName": "João",
    "LastName": "Silva",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "LastName": "Silva",
    "BirthDate": "2016-12-09",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "Ip": "127.0.0.1",
    "BrowserHostName":"www.dominiobrowsercomprador.com.br",
    "BrowserCookiesAccepted":true,
    "BrowserEmail":"emailbrowsercomprador@dominio.com.br",
    "BrowserType":"Chrome 58 on Windows 10"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "Category": "EletronicGood",
      "UnitPrice": "12000",
      "Sku": "abc123",
      "Quantity": 1,
      "Risk":"Low",
      "AddressRiskVerify":"No",
      "HostHedge":"Low",
      "NonSensicalHedge":"Normal",
      "ObscenitiesHedge":"High",
      "TimeHedge":"Low",
      "PhoneHedge":"Normal",
      "VelocityHedge":"High"
    },
    {
      "ProductName": "Teclado",
      "Category": "EletronicGood",
      "UnitPrice": "96385",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "Risk": "High"
    }
  ],
  "MerchantDefinedData": [
    {
      "Key": "1",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "2",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "3",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    }
  ],
  "Bank":{
    "Address": "Rua Marte, 29",
    "Code": "237",
    "Agency": "987654",
    "City": "Rio de Janeiro",
    "Country": "BR",
    "Name": "Bradesco",
    "SwiftCode": "789"
  },
  "FundTransfer":{
    "AccountNumber":"159753",
    "AccountName":"Conta particular",
    "BankCheckDigit":"51",
    "Iban":"123456789"
  },
  "Invoice":{
    "IsGift": false,
    "ReturnsAccept": true,
    "Tender": "Consumer"
  },
  "Airline": {
    "JourneyType": "OneWayTrip",
    "DepartureDateTime": "2018-01-09 18:00",
    "Passengers": [
    {
        "FirstName": "Fulano",
        "LastName": "Tal",
        "PassangerId": "",
        "PassengerType": "Adult",
        "Email": "email@mail.com",
        "Phone": "1234567890",
        "Status": "Gold",
        "Legs" : [
        {
            "ArrivalAirport": "AMS",
            "DepartureAirport": "GIG"
        }]
    }]
  }
}
```

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">analysis/v2/{Id}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`TransactionId`|Id da transação no Antifraude Gateway Braspag|guid|
|`Status`|Status da transação no Antifraude Gateway Braspag <br/> [Tabela 16 - Status]({{ site.baseurl_root }}manual/antifraude#tabela-16-status)|enum|
|`ProviderAnalysisResult.ProviderTransactionId`|Id da transação na Cybersource|string|
|`ProviderAnalysisResult.ProviderStatus`|Status da transação na Cybersource <br/> [Tabela 17 - ProviderStatus]({{ site.baseurl_root }}manual/antifraude#tabela-17-providerstatus)|enum|
|`ProviderAnalysisResult.ProviderCode`|Código de retorno da Cybersouce <br/> [Tabela 18 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}manual/antifraude#tabela-18-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.ProviderRequestTransactionId`|Id do request da transação na Cybersource|string|
|`ProviderAnalysisResult.Missing`|Campos faltantes na requisição enviada a Cybersource|string|
|`ProviderAnalysisResult.Invalid`|Campos com valores inválidos enviado a Cybersource|string|
|`ProviderAnalysisResult.AfsReply.AddressInfoCode`|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador <br/> Os códigos são concatenados usando o caracter ^ Ex.: MM-A^MM-Z <br/>[Tabela 19 - ProviderAnalysisResult.AfsReply.AddressInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-19-provideranalysisresult.afsreply.addressinfocode)|string|
|`ProviderAnalysisResult.AfsReply.AfsFactorCode`|Códigos que afetaram a pontuação da análise <br/> Os códigos são concatenados usando o caracter ^. Ex.: F^P <br/>[Tabela 20 - ProviderAnalysisResult.AfsReply.AfsFactorCode]({{ site.baseurl_root }}manual/antifraude#tabela-20-provideranalysisresult.afsreply.afsfactorcode)|string|
|`ProviderAnalysisResult.AfsReply.AfsResult`|Score total calculado para o pedido|int|
|`ProviderAnalysisResult.AfsReply.BinCountry`|Código do país do BIN do cartão usado na análise. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`ProviderAnalysisResult.AfsReply.CardAccountType`|Tipo do cartão do comprador <br/>[Tabela 21 - ProviderAnalysisResult.AfsReply.CardAccountType]({{ site.baseurl_root }}manual/antifraude#tabela-21-provideranalysisresult.afsreply.cardaccounttype)|string|
|`ProviderAnalysisResult.AfsReply.CardIssuer`|Nome do banco ou entidade emissora do cartão|string|
|`ProviderAnalysisResult.AfsReply.CardScheme`|Bandeira do cartão|string|
|`ProviderAnalysisResult.AfsReply.ConsumerLocalTime`|Horário local do comprador, calculado a partir da data da solicitação e do endereço de cobrança|string|
|`ProviderAnalysisResult.AfsReply.HostSeverity`|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto|int|
|`ProviderAnalysisResult.AfsReply.HotListInfoCode`|Códigos que indicam que os dados do comprador estão associados em listas de positivas ou negativas <br/> Os códigos são concatenados usando o caracter ^. Ex.: NEG-AFCB^NEG-CC <br/>[Tabela 22 - ProviderAnalysisResult.AfsReply.HotListInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-22-provideranalysisresult.afsreply.hotlistinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IdentityInfoCode`|Códigos que indicam mudanças de identidade excessivas <br/> Os códigos são concatenados usando o caracter ^. Ex.: COR-BA^MM-BIN <br/> [Tabela 23 - ProviderAnalysisResult.AfsReply.IdentityInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-23-provideranalysisresult.afsreply.identityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.InternetInfoCode`|Códigos que indicam problemas com o endereço de e-mail, o endereço IP ou o endereço de cobrança <br/> Os códigos são concatenados usando o caracter ^. Ex.: COR-BA^MM-BIN <br/> [Tabela 24 - ProviderAnalysisResult.AfsReply.InternetInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-24-provideranalysisresult.afsreply.internetinfocode)|string|
|`ProviderAnalysisResult.AfsReply.IpCity`|Nome da cidade do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.IpCountry`|Nome do país do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.IpRoutingMethod`|Método de roteamento do comprador obtido a partir do endereço de IP <br/> [Tabela 28 - ProviderAnalysisResult.AfsReply.IpRoutingMethod]({{ site.baseurl_root }}manual/antifraude#tabela-32-provideranalysisresult.afsreply.iproutingmethod)|string|
|`ProviderAnalysisResult.AfsReply.IpState`|Nome do estado do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.PhoneInfoCode`|Códigos que indicam um problema com o número de telefone do comprador <br/> Os códigos são concatenados usando o caracter ^. Ex.: UNV-AC^RISK-AC <br/> [Tabela 25 - ProviderAnalysisResult.AfsReply.PhoneInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-25-provideranalysisresult.afsreply.phoneinfocode)|string|
|`ProviderAnalysisResult.AfsReply.ReasonCode`|Código de retorno da Cybersouce <br/> [Tabela 18 - ProviderAnalysisResult.ProviderCode]({{ site.baseurl_root }}manual/antifraude#tabela-18-provideranalysisresult.providercode)|int|
|`ProviderAnalysisResult.AfsReply.ScoreModelUsed`|Nome do modelo de score utilizado na análise. Caso não tenha nenhum modelo definido, o modelo padrão da Cybersource foi o utilizado|string|
|`ProviderAnalysisResult.AfsReply.SuspiciousInfoCode`|Códigos que indicam que o comprador forneceu potencialmente informações suspeitas <br/> Os códigos são concatenados usando o caracter ^. Ex.: RISK-TB^RISK-TS <br/> [Tabela 26 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-26-provideranalysisresult.afsreply.suspiciousinfocode)|string|
|`ProviderAnalysisResult.AfsReply.VelocityInfoCode`|Códigos que indicam que o comprador tem uma alta frequência de compras <br/> Os códigos são concatenados usando o caracter ^. Ex.: VELV-SA^VELI-CC^VELSIP <br/> [Tabela 27 - ProviderAnalysisResult.AfsReply.VelocityInfoCode]({{ site.baseurl_root }}manual/antifraude#tabela-27-provideranalysisresult.afsreply.velocityinfocode)|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.BrowserLanguage`|Linguagem do browser utilizado pelo comprador no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ScreenResolution`|Resolução da tela do comprador no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.CookiesEnabled`|Flag identificando que o browser do comprador estava habilitado para armazenar cookies temporariamente no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.FlashEnabled`|Flag identificando que o browser do comprador habilitado a execução de conteúdos em Flash no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.Hash`|Hash gerado a partir dos dados coletados pelo script de fingerprint|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.ImagesEnabled`|Flag identificando que o browser do comprador estava com cache de imagens habilitado no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.JavascriptEnabled`|Flag identificando que o browser do comprador estava com a execução de sripts em Javascript habilitada no momento da compra|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddress`|Flag identificando que o IP do comprador é real|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCity`|Flag identificando que o IP do comprador é de fato da cidade que deveria ser mesmo|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.TrueIPAddressCountry`|Flag identificando que o IP do comprador é de fato do país que deveria ser mesmo|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartId`|Identificador do dispositivo do comprador|string|
|`ProviderAnalysisResult.AfsReply.DeviceFingerprint.SmartIdConfidenceLevel`|Identificador do dispositivo do comprador|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.DestinationQueue`|Quando modo verbose ativado, nome da fila para onde as transações não aceitas automaticamente são enviadas|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.Name`|Quando modo verbose ativado, nome do perfil selecionado na análise. Se não tiver nenhum, o perfil padrão foi selecionado|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.SelectedBy`|Quando modo verbose ativado, nome do seletor de regras que seleciona o perfil de regras|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].RuleId`|Quando modo verbose ativado, id da regra|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision`|Quando modo verbose ativado, decisão tomada pela regra <br/> [Tabela 29 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Decision]({{ site.baseurl_root }}manual/antifraude#tabela-29-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].decision)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation`|Quando modo verbose ativado, avaliação da regra <br/> [Tabela 30 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered{n}.Evaluation]({{ site.baseurl_root }}manual/antifraude#tabela-34-provideranalysisresult.decisionreply.activeprofilereply.rulestriggered[n].evaluation)|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Name`|Quando modo verbose ativado, nome da regra|string|
|`ProviderAnalysisResult.DecisionReply.CasePriority`|Define o nível de prioridade das regras ou perfis do lojista. O nível de prioridade varia de 1 (maior) a 5 (menor) e o valor padrão é 3, e este será atribuído caso não tenha definido a prioridade das regras ou perfis. Este campo somente será retornado se a loja for assinante do Enhanced Case Management|string|
|`ProviderAnalysisResult.DecisionReply.VelocityInfoCode`|Códigos de informação disparados pela análise. Estes códigos foram gerados no momento da criação das regras|string|
|`MerchantOrderId` |Número do pedido da loja|string|
|`TotalOrderAmount`|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`TransactionAmount`|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|long|
|`Currency`|Moeda. Maiores informações em [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)|string|
|`Provider`|Provedor da solução de antifraude <br/> [Tabela 1 - Provider]({{ site.baseurl_root }}//manual/antifraude#tabela-1-provider)|enum|
|`BraspagTransactionId`|Id da transação no Pagador da Braspag|guid|
|`Tid`|Id da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Nsu`, `AuthorizationCode` e `SaleDate`, além deste em questão|string|
|`Nsu`|Número sequencial único da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Tid`, `AuthorizationCode` e `SaleDate`, além deste em questão|string|
|`AuthorizationCode`|Código de autorização da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Tid`, `Nsu` e `SaleDate`, além deste em questão|string|
|`SaleDate`|Data da autorização da transação da transação na adquirente <br/> Obs.: Caso você não possua integração com o Pagador Braspag, não terá como enviar o campo `BraspagTransactionId`, com isso é necessário o envio dos campos `Tid`, `Nsu` e `AuthorizationCode`, além deste em questão|datetime|
|`Card.Number`|Número do cartão de crédito|string|
|`Card.Holder`|Nome do cartão de crédito|string|
|`Card.ExpirationDate`|Data de expiração do cartão de crédito <br/> Ex.: 01/2023|string|
|`Card.Brand`|Bandeira do cartão de crédito <br/> [Tabela 2 - Card.Brand]({{ site.baseurl_root }}manual/antifraude#tabela-2-card.brand)|enum|
|`Card.Save`|Indica se os dados do cartão de crédito serão armazenados no Cartão Protegido|bool|
|`Card.Token`|Identificador do cartão de crédito salvo no Cartão Protegido|guid|
|`Card.Alias`|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|string|
|`Billing.Street`|Logradouro do endereço de cobrança|string|
|`Billing.Number`|Número do endereço de cobrança|string|
|`Billing.Complement`|Complemento do endereço de cobrança|string|
|`Billing.Neighborhood`|Bairro do endereço de cobrança|string|
|`Billing.City`|Cidade do endereço de cobrança|string|
|`Billing.State`|Estado do endereço de cobrança|string|
|`Billing.Country`|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Billing.ZipCode`|Código postal do endereço de cobrança|string|
|`Shipping.Street`|Logradouro do endereço de entrega|string|
|`Shipping.Number`|Número do endereço de entrega|string|
|`Shipping.Complement`|Complemento do endereço de entrega|string|
|`Shipping.Neighborhood`|Bairro do endereço de entrega|string|
|`Shipping.City`|Cidade do endereço de entrega|string|
|`Shipping.State`|Estado do endereço de entrega|string|
|`Shipping.Country`|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Shipping.ZipCode`|Código postal do endereço de entrega|string|
|`Shipping.FirstName`|Primeiro nome do responsável a receber o produto no endereço de entrega|string|
|`Shipping.LastName`|Último do nome do responsável a receber o produto no endereço de entrega|string|
|`Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114700|string|
|`Shipping.ShippingMethod`|Meio de entrega do pedido <br/> [Tabela 3 - ShippingMethod]({{ site.baseurl_root }}manual/antifraude#tabela-3-shippingmethod)|enum|
|`Customer.MerchantCustomerId`|Número do documento de identificação do comprador, CPF ou CNPJ|string|
|`Customer.FirstName`|Primeiro nome do comprador|string|
|`Customer.LastName`|Último nome do comprador|string|
|`Customer.BirthDate`|Data de nascimento do comprador <br/> Ex.: 1983-10-01|date|
|`Customer.Email`|E-mail do comprador|string|
|`Customer.Ip`|Endereço de IP do comprador|string|
|`Customer.Phone`|Número do telefone do comprador <br/> Ex.: 552121114700|string|
|`Customer.BrowserHostName`|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|string|
|`Customer.BrowserCookiesAccepted`|Identifica se o browser do comprador aceita cookies ou não|bool|
|`Customer.BrowserEmail`|E-mail registrado no browser do comprador. Pode diferenciar do e-mail cadastrado (`Customer.Email`)|string|
|`Customer.BrowserType`|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP|string|
|`CartItem[n].ProductName`|Nome do produto|string|
|`CartItem[n].Category`|Categoria do produto <br/> [Tabela 32 - CartItem{n}.Category]({{ site.baseurl_root }}manual/antifraude#tabela-32-cartitem[n].category)|enum|
|`CartItem[n].Risk`|Nível de risco do produto associado a quantidade de chargebacks <br/> [Tabela 7 - CartItem{n}.Risk]({{ site.baseurl_root }}manual/antifraude#tabela-7-cartitem[n].risk)|enum|
|`CartItem[n].UnitPrice`|Preço unitário do produto <br/> Ex: 10950 = r$ 109,50|long|
|`CartItem[n].Sku`|Sku do produto|string|
|`CartItem[n].Quantity`|Quantidade do produto|int|
|`CartItem[n].AddressRiskVerify`|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países <br/> [Tabela 8 - CartItem{n}.AddressRiskVerify]({{ site.baseurl_root }}manual/antifraude#tabela-8-cartitem[n].addressriskverify)|enum|
|`CartItem[n].HostHedge`|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude <br/> [Tabela 9 - CartItem{n}.HostHedge]({{ site.baseurl_root }}manual/antifraude#tabela-9-cartitem[n].hosthedge)|enum|
|`CartItem[n].NonSensicalHedge`|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude <br/> [Tabela 10 - CartItem{n}.NonSensicalHedge]({{ site.baseurl_root }}manual/antifraude#tabela-14-cartitem[n].nonsensicalhedge)|enum|
|`CartItem[n].ObscenitiesHedge`|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude <br/> [Tabela 11 - CartItem{n}.ObscenitiesHedge]({{ site.baseurl_root }}manual/antifraude#tabela-11-cartitem[n].obscenitieshedge)|enum|
|`CartItem[n].TimeHedge`|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido <br/> [Tabela 12 - CartItem{n}.TimeHedge]({{ site.baseurl_root }}manual/antifraude#tabela-12-cartitem[n].timehedge)|enum|
|`CartItem[n].PhoneHedge`|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude <br/> [Tabela 13 - CartItem{n}.PhoneHedge]({{ site.baseurl_root }}manual/antifraude#tabela-17-cartitem[n].phonehedge)|enum|
|`CartItem[n].VelocityHedge`|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores <br/> [Tabela 14 - CartItem{n}.VelocityHedge]({{ site.baseurl_root }}manual/antifraude#tabela-18-cartitem[n].velocityhedge)|enum|
|`Bank.Name`|Nome do banco do comprador|string|
|`Bank.Code`|Código do banco do comprador|string|
|`Bank.Agency`|Agência do banco do comprador|string|
|`Bank.Address`|Endereço do banco do comprador|string|
|`Bank.City`|Cidade onde está localizado o banco do comprador|string|
|`Bank.Country`|País onde está localizado o banco do comprador <br/> Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`Bank.SwiftCode`|Código identificador único do banco do comprador|string|
|`FundTransfer.AccountName`|Nome vinculado a conta bancária|string|
|`FundTransfer.AccountNumber`|Número da conta bancária do comprador|string|
|`FundTransfer.BankCheckDigit`|Código utilizado para validar a conta bancária do comprador|string|
|`FundTransfer.Iban`|Número internacional da conta bancária do comprador (IBAN)|string|
|`Invoice.IsGift`|Indica se o pedido realizado pelo comprador é para presente|bool|
|`Invoice.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser devolvido a loja|bool|
|`Invoice.Tender`|Forma de pagamento utilizada pelo comprador <br/> [Tabela 15 - Invoice.Tender]({{ site.baseurl_root }}manual/antifraude#tabela-19-invoice.tender)|enum|
|`Airline.JourneyType`|Tipo de viagem <br/> [Tabela 4 - Airline.JourneyType]({{ site.baseurl_root }}manual/antifraude#tabela-4-airline.journeytype)|enun|
|`Airline.DepartureDateTime`|Data e hora de partida <br/> Ex.: 2018-03-31 19:16:38|datetime|
|`Airline.Passengers[n].FirstName`|Primeiro nome do passageiro|string|
|`Airline.Passengers[n].LastName`|Último nome do passageiro|string|
|`Airline.Passengers[n].PassengerId`|Identificador do passageiro a quem a passagem foi emitida|string|
|`Airline.Passengers[n].PassengerType`|Tipo do passageiro <br/> [Tabela 5 - Airline.Passengers{n}.PassengerType]({{ site.baseurl_root }}manual/antifraude#tabela-5-airline.passengers[n].passengertype)|enum|
|`Airline.Passengers[n].Phone`|Telefone do passageiro <br/> Ex.: 552121114700|string|
|`Airline.Passengers[n].Email`|E-mail do passageiro|string|
|`Airline.Passengers[n].Status`|Classificação da empresa aérea <br/> [Tabela 6 - Airline.Passengers{n}.Status]({{ site.baseurl_root }}manual/antifraude#tabela-6-airline.passengers[n].status)|enum|
|`Airline.Passengers[n].Legs[n].DepartureAirport`|Código do aeroporto de partida. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`Airline.Passengers[n].Legs[n].ArrivalAirport`|Código do aeroporto de chegada. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|string|
|`CustomConfiguration.Comments`|Comentários que a loja poderá associar a análise de fraude|string|
|`CustomConfiguration.ScoreThreshold`|Nível aceitável de risco para cada produto|int|
|`MerchantDefinedData[n].Key`|Chave do campo definido junto ao provedor de antifraude <br/> [Tabela 31 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}manual/antifraude#tabela-31-merchantdefineddata-(cybersource))|int|não|-|
|`MerchantDefinedData[n].Value`|Valor do campo definido junto ao provedor de antifraude <br/> [Tabela 31 - MerchantDefinedData(Cybersource)]({{ site.baseurl_root }}manual/antifraude#tabela-31-merchantdefineddata-(cybersource))|var|não|-|

## Consultando uma transação inexistente 

<aside class="request"><span class="method get">GET</span> <span class="endpoint">analysis/v2/{Id}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

# Post de Notificação

Esta sessão descreve o serviço de POST de Notificação, que envia uma notificação para a loja, caso haja alguma alteração de status na transação de revisão para aceita/rejeita ou aceita para rejeita.

* No processo de onboarding da sua loja, é necessário solicitar ao Time de Implementação da Braspag o cadastramento da URL de mudança de status da sua loja.

* Quando estimulada pelo servidor da Braspag, enviando um POST, a URL cadastrada para receber a notificação da mudança de status, deverá retornar o código HTTP 200 (OK), indicando que a mensagem foi recebida e processada com sucesso pelo servidor da loja. Caso contrário, serão realizadas mais 3 tentativas de envio.

* A URL de mudança de status somente pode utilizar a porta 80 (padrão para http) ou a porta 443 (padrão para https). Recomendamos que a loja trabalhe sempre com SSL para esta URL, ou seja, sempre HTTPS.

* Após a loja receber a notificação de mudança de status, deverá realizar um GET através da URL https://{antifraude endpoint}/analysis/v2/{Id}, enviando o Id da transação que foi recebido na notficação da mudança de status para obter o novo status da transação.

## Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{url loja}</span></aside>

``` json
{  
   "Id":"tttttttt-tttt-tttt-tttt-tttttttttttt"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`Id`|Id da transação no Antifraude Gateway Braspag|guid|

## Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

# Associar transação

Esta sessão descreve como associar uma transação do Pagador Braspag ou outra solução de autorização à uma transação do Antifraude Gateway Braspag.

> Você deverá realizar esta chamada quando estiver utilizando o fluxo abaixo: <br/>
> 1 - Realiza análise através do Antifraude Gateway Braspag <br/>
> 2 - Realiza a autorização através do Pagador Braspag ou outra solução de autorização <br/>
> 3 - Chamada a este serviço para associar a transação do Pagador Braspag ou outra solução de autorização à transação do Antifraude Gateway Braspag

## Antifraude e Pagador

<aside class="request"><span class="method patch">PATCH</span> <span class="endpoint">transaction/{id}</span></aside>

### Request

``` json
{
    "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`BraspagTransactionId`|Id da transação no Pagador Braspag|guid|sim|-|

### Response

**Parâmetros no cabeçalho (Header)**

* Quando a transação do Pagador for associada corretamente com a transação do Antifraude Gateway

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

* Quando a transação do Pagador não for informada na requisição

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* Quando a transação do Antifraude Gateway não for encontrada na base de dados

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

* Quando a transação do Pagador já estiver associada a outra transação do Antifraude Gateway

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|409 Conflict|

## Antifraude e Outra Solução de Autorização

<aside class="request"><span class="method patch">PUT</span> <span class="endpoint">transaction/{id}</span></aside>

### Request

``` json
{
    "Tid": "12345678910111216AB8",
    "Nsu": "951852",
    "AuthorizationCode":"T12345",
    "SaleDate": "2016-12-09 10:01:55.662"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`Tid`|Id da transação na adquirente|string|sim|20|
|`Nsu`|Número sequencial único da transação na adquirente|string|sim|10|
|`AuthorizationCode`|Código de autorização da transação na adquirente|string|sim|10|
|`SaleDate`|Data da autorização da transação da transação na adquirente|datetime|sim|-|

### Response

**Parâmetros no cabeçalho (Header)**

* Quando a transação de outra solução de autorização for associada corretamente com a transação do Antifraude Gateway

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

* Quando um dos campos do contrato (Tid, Nsu, Código de autorização e Data da venda) não for informada na requisição

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* Quando a transação do Antifraude Gateway não for encontrada na base de dados

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

* Quando a transação de outra solução de autorização já estiver associada a outra transação do Antifraude Gateway

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|409 Conflict|

# Update de Status Cybersource

Esta sessão descreve como alterar o status de transações em revisão (review) para aceita (accept) ou rejeita (reject) ou aceita (accept) para rejeita (reject).

## Request

<aside class="request"><span class="method patch">PATCH</span> <span class="endpoint">analysis/v2/{id}</span></aside>

``` json
{
    "Status": "Accept",
    "Comments": "Dados do cliente OK"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`Status`|Novo status da transação. Accept ou Reject|string|sim|-|
|`Comments`|Comentário associado a mudança de status|string|não|255|

## Response

* Quando a transação for recebida para processamento

``` json
{
    "Status": "Accept",
    "ChangeStatusResponse": {
        "Status": "OK",
        "Message": "Change Status request successfully received. New status: Accept."
    }
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`Status`|Novo status da transação|string|
|`ChangeStatusResponse.Status`|Identifica que a Cybersource recebeu a solicitação de alteração de status|string|
|`ChangeStatusResponse.Message`|Mensagem contendo conteúdo da operação realizada|string|

* Quando a transação não for encontrada na base de dados.
<br/>
**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

* Quando a transação não estiver elegivel para alteração de status.

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* Quando o novo status enviado for diferente de Accept ou Reject.

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

* Quando o tipo ou tamanho de algum campo não for enviado conforme especificado no manual.

``` json
{
    "Message": "The request is invalid.",
    "ModelState": {
        "request.Status": [
            "Error converting value \"Review\" to type 'Antifraude.Domain.Enums.StatusType'. Path 'Status', line 2, position 16."
        ],
        "request.Comments": [
            "The field Comments must be a string or array type with a maximum length of '255'."
        ]
    }
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`Message`|Mensagem informando que o request é inválido|
|`ModelState`|Coleção que conterá mensagens com os campos que não estejam de acordo com o tipo, domínio ou tamanho conforme especificado no manual|

# Configuração do Fingerprint

Importante componente da análise de fraude, o Fingerprint é um Javascript que deve ser inserido no seu site para capturar dados importantes como: IP do comprador, versão do browser, sistema operacional etc.
Muitas vezes, somente os dados do carrinho não são suficientes para garantir uma análise assertiva. Os dados coletados pelo Fingerprint complementam a análise e garantem que sua loja está mais protegida.

Será necessário adicionar duas tags, a *script* dentro da tag *head* para uma performance correta e a *noscript* dentro da tag *body*, para que a coleta dos dados do dispositivo seja realizada mesmo se o Javascript do browser estiver desabilitado.

<aside class="warning">Se os 2 segmentos de código não forem colocados na página de checkout, os resultados da análise de fraude podem não ser precisos.</aside>

**Domain**

|Ambiente|Descrição|
|:-|:-|
|`Testing`|Use h.online-metrix.net, que é o DNS do servidor de fingerprint, como apresentado no exemplo de HTML abaixo|
|`Production`|Altere o domínio para uma URL local, e configure seu servidor Web para redirecionar esta URL para h.online-metrix.net|

**Variáveis**
Existem duas variáveis a serem preenchidas na URL do Javascript. O `org_id` e o `session_id`. O `org_id` é um valor predefinido conforme tabela abaixo, já o `session_id` é composto pela concatenação dos parâmetros `ProviderMerchantId` e `Customer.BrowserFingerprint`, conforme exemplo abaixo:

|Variável|Descrição|
|:-|:-|
|`org_id`|para Sandbox = 1snn5n9w <br/> para Produção = k8vif92e|
|`session_id`|Concatenação das variáveis `ProviderMerchantId` e `Customer.BrowserFingerprint` <br/> `ProviderMerchantId` = Identificador da sua loja na Cybersource. Caso não possua, entre em contato com a Braspag <br/> `Customer.BrowserFingerprint` = Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas.|

**Aplicação**

O modelo do Javascript é o seguinte:

![Exemplo Código]({{ site.baseurl_root }}/images/braspag/af/exemploscriptdfp.png)

As variáveis, quando devidamente preenchidas, forneceriam uma URL semelhante ao exemplo abaixo:

![Exemplo Url](https://braspag.github.io/images/braspag/af/urldfpaf.png)

<aside class="warning">Certifique-se de copiar todos os dados corretamente e de ter substituído as variáveis corretamente pelos respectivos valores.</aside>

**Configurando seu Servidor Web**

Todos os objetos se referem a h.online-metrix.net, que é o DNS do servidor de fingerprint. Quando você estiver pronto para produção, você deve alterar o nome do servidor para uma URL local, e configurar no seu servidor Web um redirecionamento de URL para h.online-metrix.net.

<aside class="warning">Se você não completar essa seção, você não receberá resultados corretos, e o domínio (URL) do fornecedor de fingerprint ficará visível, sendo mais provável que seu consumidor o bloqueie.</aside>

## Integração em aplicativos mobile

**Baixando o SDK**
Se você ainda não baixou o SDK do iOS ou do Android, deve fazê-lo antes de continuar. Para isso acesse um dos links abaixo de acordo com o desejado: <br/> [Download Deviceprint SDK iOS]({{ site.baseurl_root }}/files/braspag/antifraude/cybersource-iossdk-fingerprint-v5.0.32.zip) <br/> [Download Deviceprint SDK Android]({{ site.baseurl_root }}/files/braspag/antifraude/cybersource-androidsdk-fingerprint-v5.0.96.zip)

# Tabelas

## Tabela 1 - Provider

|Valor|
|:-|
|Cybersource|

## Tabela 2 - Card.Brand

|Valor|Provider|Observação|
|:-|:-|:-|
|Amex|Cybersource|-|
|Diners|Cybersource|-|
|Discover|Cybersource|-|
|JCB|Cybersource|-|
|Master|Cybersource|-|
|Dankort|Cybersource|-|
|Cartebleue|Cybersource|-|
|Maestro|Cybersource|-|
|Visa|Cybersource|-|
|Elo|Cybersource|-|
|Hipercard|Cybersource|Será enviado para a Cybersource como Private Label|
|Aura|Cybersource|Será enviado para a Cybersource como Private Label|
|Hiper|Cybersource|Será enviado para a Cybersource como Private Label|
|Naranja|Cybersource|Será enviado para a Cybersource como Private Label|
|Nevada|Cybersource|Será enviado para a Cybersource como Private Label|
|Cabal|Cybersource|Será enviado para a Cybersource como Private Label|
|Credz|Cybersource|Será enviado para a Cybersource como Private Label|
|Credsystem|Cybersource|Será enviado para a Cybersource como Private Label|
|Banese|Cybersource|Será enviado para a Cybersource como Private Label|
|Riachuelo|Cybersource|Será enviado para a Cybersource como Private Label|
|Carnet|Cybersource|Será enviado para a Cybersource como Private Label|
|Other|Cybersource|Será enviado para a Cybersource como Private Label|

## Tabela 3 - ShippingMethod

|Valor|Descrição|Provider|
|:-|:-|:-|
|SameDay|Meio de entrega no mesmo dia|Cybersource|
|NextDay|Meio de entrega no próximo dia|Cybersource|
|TwoDay|Meio de entrega em dois dias|Cybersource|
|ThreeDay|Meio de entrega em três dias|Cybersource|
|LowCost|Meio de entrega de baixo custo|Cybersource|
|Pickup|Retirada na loja|Cybersource|
|Other|Outro meio de entrega|Cybersource|
|None|Sem meio de entrega, pois é um serviço ou assinatura|Cybersource|

## Tabela 4 - Airline.JourneyType

|Valor|Descrição|Provider|
|:-|:-|:-|
|OneWayTrip|Viagem somente de ida|Cybersource|
|RoundTrip|Viagem de ida e volta|Cybersource|

## Tabela 5 - Airline.Passengers[n].PassengerType

|Valor|Descrição|Provider|
|:-|:-|:-|
|Adult|Adulto|Cybersource|
|Child|Criança|Cybersource|
|Infant|Infantil|Cybersource|

## Tabela 6 - Airline.Passengers[n].Status

|Valor|Provider|
|:-|:-|
|Standard|Cybersource|
|Gold|Cybersource|
|Platinum|Cybersource|

## Tabela 7 - CartItem[n].Risk

|Valor|Descrição|Provider|
|:-|:-|:-|
|Low|Produto associado com pouco chargebacks (default)|Cybersource|
|Normal|Produto associado com a quantidade normal de chargebacks|Cybersource|
|High|Produto associado com muito chargebacks|Cybersource|

## Tabela 8 - CartItem[n].AddressRiskVerify

|Valor|Descrição|Provider|
|:-|:-|:-|
|Yes|Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido|Cybersource|
|No|Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)|Cybersource|
|Off|Diferenças entre os endereços de cobrança e entrega não afetam a pontuação|Cybersource|

## Tabela 9 - CartItem[n].HostHedge

|Valor|Descrição|Provider|
|:-|:-|:-|
|Low|Baixa|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|Alta|Cybersource|
|Off|Não irá afetar o score da análise de fraude|Cybersource|

## Tabela 10 - CartItem[n].NonSensicalHedge

|Valor|Descrição|Provider|
|:-|:-|:-|
|Low|Baixa|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|Alta|Cybersource|
|Off|Não irá afetar o score da análise de fraude|Cybersource|

## Tabela 11 - CartItem[n].ObscenitiesHedge

|Valor|Descrição|Provider|
|:-|:-|:-|
|Low|Baixa|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|Alta|Cybersource|
|Off|Não irá afetar o score da análise de fraude|Cybersource|

## Tabela 12 - CartItem[n].TimeHedge

|Valor|Descrição|Provider|
|:-|:-|:-|
|Low|Baixa|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|Alta|Cybersource|
|Off|Não irá afetar o score da análise de fraude|Cybersource|

## Tabela 13 - CartItem[n].PhoneHedge

|Valor|Descrição|Provider|
|:-|:-|:-|
|Low|Baixa|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|Alta|Cybersource|
|Off|Não irá afetar o score da análise de fraude|Cybersource|

## Tabela 14 - CartItem[n].VelocityHedge

|Valor|Descrição|Provider|
|:-|:-|:-|
|Low|Baixa|Cybersource|
|Normal|Normal (default)|Cybersource|
|High|Alta|Cybersource|
|Off|Não irá afetar o score da análise de fraude|Cybersource|

## Tabela 15 - Invoice.Tender

|Valor|Descrição|Provider|
|:-|:-|:-|
|Consumer|Cartão de crédito pessoal (default)|Cybersource|
|Corporate|Cartão de crédito corporativo|Cybersource|
|Debit|Cartão de débito|Cybersource|
|CollectDelivery|Cobrança na entrega|Cybersource|
|EletronicCheck|Cheque eletrônico|Cybersource|
|PaymentP2P|Pagamento de pessoa para pessoa|Cybersource|
|PrivateLabel|Pagamento com cartão de crédito privado|Cybersource|
|Other|Pagamentos com outros métodos|Cybersource|

## Tabela 16 - Status

|Valor|Descrição|Provider|
|:-|:-|:-|
|Accept|Transação aceita após análise de fraude|Cybersource|
|Review|Transação em revisão após análise de fraude|Cybersource|
|Reject|Transação rejeitada após análise de fraude|Cybersource|
|Pendent|Transação pendente, pois ao enviar a mesma para análise de fraude ocorreu um timeout na resposta entre Braspag e Cybersource|Cybersource|
|Unfinished|Transação não finalizada por algum motivo de validação de contrato ou erro interno <br/> Uma transação analisada na Cybersource, no response da análise o campo `ProviderAnalysisResult.ProviderStatus` for igual a **REJECT** e o campo `ProviderAnalysisResult.ProviderCode` diferente de **481**, o status da transação será **Unfinished**|Cybersource|
|ProviderError|Transação com erro no provedor ao ser enviada para análise|Cybersource|

## Tabela 17 - ProviderStatus

|Valor|Descrição|Provider|De-Para com o campo `Status` (Status da transação no Antifraude Gateway Braspag)|
|:-|:-|:-|:-|
|ACCEPT|Transação aceita no provedor|Cybersource|Accept|
|REVIEW|Transação em revisão no provedor|Cybersource|Review|
|REJECT|Transação rejeitada no provedor|Cybesource|Reject|
|ERROR|Transação com erro no provedor|Cybersource|ProviderError|

## Tabela 18 - ProviderAnalysisResult.ProviderCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|100|Operação realizada com sucesso|Cybersource|
|101|A transação enviada para análise de fraude está faltando um ou mais campos necessários <br/> Verificar no response o campo `ProviderAnalysisResult.Missing` <br/> Possível ação: Reenviar a transação com a informação completa|Cybersource|
|102|A transação enviada para análise de fraude possui um ou mais campos com valores inválidos <br/> Verificar no response o campo `ProviderAnalysisResult.Invalid` <br/> Possível ação: Reenviar a transação com as informações corretas|Cybersource|
|150|Erro interno <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|Cybersource|
|151|A transação foi recebida, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|Cybersource|
|152|O pedido foi recebido, mas ocorreu time-out <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|Cybersource|
|202|Transação recusada pois o cartão expirou ou a data de validade não coincide com a correta <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|Cybersource|
|231|Transação recusada pois o cartão é inválido <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|Cybersource|
|234|Problema com a configuração da loja na Cybersource <br/> Possível ação: Entre em contato com o suporte para corrigir o problema de configuração|Cybersource|
|400|A pontuação de fraude ultrapassa o seu limite <br/> Possível ação: Reveja a transação do comprador|Cybersource|
|480|A transação foi marcada como revisão pelo DM (Decision Manager)|Cybersource|
|481|A transação foi rejeitada pelo DM (Decision Manager)|Cybersource|

## Tabela 19 - ProviderAnalysisResult.AfsReply.AddressInfoCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|COR-BA|O endereço de cobrança pode ser normalizado|Cybersource|
|COR-SA|O endereço de entrega pode ser normalizado|Cybersource|
|INTL-BA|O país do endereço de cobrança está fora dos EUA|Cybersource|
|INTL-SA|O país do endereço de entrega está fora dos EUA|Cybersource|
|MIL-USA|Endereço militar nos EUA|Cybersource|
|MM-A|Os endereços de cobrança e entrega usam nomes de ruas diferentes|Cybersource|
|MM-BIN|O BIN do cartão (os seis primeiros dígitos do número do cartão) não corresponde ao país|Cybersource|
|MM-C|Os endereços de cobrança e entrega usam cidades diferentes|Cybersource|
|MM-CO|Os endereços de cobrança e entrega usam países diferentes|Cybersource|
|MM-ST|Os endereços de cobrança e entrega usam estados diferentes|Cybersource|
|MM-Z|Os endereços de cobrança e entrega usam códidos postais diferentes|Cybersource|
|UNV-ADDR|O endereço é inverificável|Cybersource|

## Tabela 20 - ProviderAnalysisResult.AfsReply.AfsFactorCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|A|Mudança de endereço excessiva. O comprador mudou o endereço de cobrança duas ou mais vezes nos últimos seis meses|Cybersource|
|B|BIN do cartão ou autorização de risco. Os fatores de risco estão relacionados com BIN de cartão de crédito e/ou verificações de autorização do cartão|Cybersource|
|C|Elevado números de cartões de créditos. O comprador tem usado mais de seis números de cartões de créditos nos últimos seis meses|Cybersource|
|D|Impacto do endereço de e-mail. O comprador usa um provedor de e-mail gratuito ou o endereço de email é arriscado|Cybersource|
|E|Lista positiva. O comprador está na sua lista positiva|Cybersource|
|F|Lista negativa. O número da conta, endereço, endereço de e-mail ou endereço IP para este fim aparece sua lista negativa|Cybersource|
|G|Inconsistências de geolocalização. O domínio do comprador de e-mail, número de telefone, endereço de cobrança, endereço de envio ou endereço IP é suspeito|Cybersource|
|H|Excessivas mudanças de nome. O comprador mudou o nome duas ou mais vezes nos últimos seis meses|Cybersource|
|I|Inconsistências de internet. O endereço IP e de domínio de e-mail não são consistentes com o endereço de cobrança|Cybersource|
|N|Entrada sem sentido. O nome do comprador e os campos de endereço contém palavras sem sentido ou idioma|Cybersource|
|O|Obscenidades. Dados do comprador contém palavras obscenas|Cybersource|
|P|Identidade morphing. Vários valores de um elemento de identidade estão ligados a um valor de um elemento de identidade diferentes. Por exemplo, vários números de telefones estão ligados a um número de conta única|Cybersource|
|Q|Inconsistências do telefone. O número de telefone do comprador é suspeito|Cybersource|
|R|Ordem arriscada. A transação, o comprador e o lojista mostram informações correlacionadas de alto risco|Cybersource|
|T|Cobertura Time. O comprador está a tentar uma compra fora do horário esperado|Cybersource|
|U|Endereço não verificável. O endereço de cobrança ou de entrega não pode ser verificado|Cybersource|
|V|O cartão foi usado muitas vezes nos últimos 15 minutos|Cybersource|
|W|Marcado como suspeito. O endereço de cobrança ou de entrega é semelhante a um endereço previamente marcado como suspeito|Cybersource|
|Y|O endereço, cidade, estado ou país dos endereços de cobrança e entrega não se correlacionam|Cybersource|
|Z|Valor inválido. Como a solicitação contém um valor inesperado, um valor padrão foi substituído. Embora a transação ainda possa ser processada, examinar o pedido com cuidado para detectar anomalias|Cybersource|

## Tabela 21 - ProviderAnalysisResult.AfsReply.CardAccountType

|Valor|Descrição|Provider|
|:-|:-|:-|
|CN|Cartão privado|Cybersource|
|CP|Cartão corporativo|Cybersource|

## Tabela 22 - ProviderAnalysisResult.AfsReply.HotListInfoCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|CON-POSNEG|A ordem disparada bate tanto com a lista positiva e negativa. O resultado da lista positiva sobrescreve a lista negativa|Cybersource|
|NEG-BA|O endereço de cobrança está na lista negativa|Cybersource|
|NEG-BCO|O país do endereço de cobrança está na lista negativa|Cybersource|
|NEG-BIN|O BIN do cartão de crédito (os seis primeiros dígitos do número do cartão) está na lista negativa|Cybersource|
|NEG-BINCO|O país em que o cartão de crédito foi emitido está na lista negativa|Cybersource|
|NEG-BZC|O código postal do endereço de cobrança está na lista negativa|Cybersource|
|NEG-CC|O número de cartão de crédito está na lista negativa|Cybersource|
|NEG-EM|O endereço de e-mail está na lista negativa|Cybersource|
|NEG-EMCO|O país em que o endereço de e-mail está localizado na lista negativa|Cybersource|
|NEG-EMDOM|O domínio de e-mail (por exemplo, mail.example.com) está na lista negativa|Cybersource|
|NEG-FP|O device fingerprint está na lista negativa|Cybersource|
|NEG-HIST|A transação foi encontrada na lista negativa|Cybersource|
|NEG-ID|Identificador do comprador (CPF ou CNPJ) está na lista negativa|Cybersource|
|NEG-IP|O endereço IP (por exemplo, 10.1.27.63) está na lista negativa|Cybersource|
|NEG-IP3|O endereço IP de rede (por exemplo, 10.1.27.63) está na lista negativa. Um endereço de IP da rede inclui até 256 endereços IP|Cybersource|
|NEG-IPCO|O país em que o endereço IP está localizado está na lista negativa|Cybersource|
|NEG-PEM|O endereço de e-mail do passageiro está na lista negativa|Cybersource|
|NEG-PH|O número do telefone está na lista negativa|Cybersource|
|NEG-PID|Identificador do passageiro está na lista negativa|Cybersource|
|NEG-PPH|O número do telefone do passageiro está na lista negativa|Cybersource|
|NEG-SA|O endereço de entrega está na lista negativa|Cybersource|
|NEG-SCO|O país do endereço de entrega está na lista negativa|Cybersource|
|NEG-SZC|O código postal do endereço de entrega está na lista negativa|Cybersource|
|POS-TEMP|O comprador está temporariamente na lista positiva|Cybersource|
|POS-PERM|O comprador está permanente na lista positiva|Cybersource|
|REV-BA|O endereço de cobrança esta na lista de revisão|Cybersource|
|REV-BCO|O país do endereço de cobrança está na lista de revisão|Cybersource|
|REV-BIN|O BIN do cartão de crédito (os seis primeiros dígitos do número do cartão) está na lista de revisão|Cybersource|
|REV-BINCO|O país em que o cartão de crédito foi emitido está na lista de revisão|Cybersource|
|REV-BZC|O código postal do endereço de cobrança está na lista de revisão|Cybersource|
|REV-CC|O número do cartão de crédito está na lista de revisão|Cybersource|
|REV-EM|O endereço de e-mail está na lista de revisão|Cybersource|
|REV-EMCO|O país em que o endereço de e-mail está localizado está na lista de revisão|Cybersource|
|REV-EMDOM|O domínio de e-mail (por exemplo, mail.example.com) está na lista de revisão|Cybersource|
|REV-FP|O device fingerprint está na lista de revisão|Cybersource|
|REV-ID|Identificador do comprador (CPF ou CNPJ) está na lista de revisão|Cybersource|
|REV-IP|O endereço IP (por exemplo, 10.1.27.63) está na lista de revisão|Cybersource|
|REV-IP3|O endereço IP de rede (por exemplo, 10.1.27.63) está na lista de revisão. Um endereço de IP da rede inclui até 256 endereços IP|Cybersource|
|REV-IPCO|O país em que o endereço IP está localizado está na lista de revisão|Cybersource|
|REV-PEM|O endereço de e-mail do passageiro está na lista de revisão|Cybersource|
|REV-PH|O número do telefone está na lista de revisão|Cybersource|
|REV-PID|Identificador do passageiro está na lista de revisão|Cybersource|
|REV-PPH|O número do telefone do passageiro está na lista de revisão|Cybersource|
|REV-SA|O endereço de entrega está na lista de revisão|Cybersource|
|REV-SCO|O país do endereço de entrega está na lista de revisão|Cybersource|
|REV-SZC|O código postal do endereço de entrega está na lista de revisão|Cybersource|

## Tabela 23 - ProviderAnalysisResult.AfsReply.IdentityInfoCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|MORPH-B|O mesmo endereço de cobrança tem sido utilizado várias vezes com identidades de múltiplos compradores|Cybersource|
|MORPH-C|O mesmo cartão de crédito tem sido utilizado várias vezes com identidades de múltiplos compradores|Cybersource|
|MORPH-E|O mesmo endereço de e-mail tem sido utilizado várias vezes com identidades de múltiplos compradores|Cybersource|
|MORPH-I|O mesmo endereço IP tem sido utilizado várias vezes com identidades de múltiplos compradores|Cybersource|
|MORPH-P|O mesmo número de telefone tem sido usado várias vezes com identidades de múltiplos compradores|Cybersource|
|MORPH-S|O mesmo endereço de entrega tem sido utilizado várias vezes com identidades de múltiplos compradores|Cybersource|

## Tabela 24 - ProviderAnalysisResult.AfsReply.InternetInfoCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|FREE-EM|O endereço de e-mail do comprador é de um provedor de e-mail gratuito|Cybersource|
|INTL-IPCO|O país do endereço de e-mail do comprador está fora dos EUA|Cybersource|
|INV-EM|O endereço de e-mail do comprador é inválido|Cybersource|
|MM-EMBCO|O domínio do endereço de e-mail do comprador não é consistente com o país do endereço de cobrança|Cybersource|
|MM-IPBC|O endereço de e-mail do comprador não é consistente com a cidade do endereço de cobrança|Cybersource|
|MM-IPBCO|O endereço de e-mail do comprador não é consistente com o país do endereço de cobrança|Cybersource|
|MM-IPBST|O endereço IP do comprador não é consistente com o estado no endereço de cobrança. No entanto, este código de informação não pode ser devolvido quando a inconsistência é entre estados imediatamente  adjacentes|Cybersource|
|MM-IPEM|O endereço de e-mail do comprador não é consistente com o endereço IP|Cybersource|
|RISK-EM|O domínio do e-mail do comprador (por exemplo, mail.example.com) está associado com alto risco|Cybersource|
|UNV-NID|O endereço IP do comprador é de um proxy anônimo. Estas entidades escondem completamente informações sobre o endereço de IP|Cybersource|
|UNV-RISK|O endereço IP é de origem de risco|Cybersource|
|UNV-EMBCO|O país do endereço de e-mail não corresponde ao país do endereço de cobrança|Cybersource|

## Tabela 25 - ProviderAnalysisResult.AfsReply.PhoneInfoCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|MM-ACBST|O número de telefone do comprador não é consistente com o estado no endereço de cobrança|Cybersource|
|RISK-AC|O código de área do comprador está associado com risco alto|Cybersource|
|RISK-PH|O número de telefone dos EUA. ou do Canadá é incompleto, ou uma ou mais partes do número são arriscadas|Cybersource|
|TF-AC|O número do telefone utiliza um código de área toll-free (grátis)|Cybersource|
|UNV-AC|O código de área é inválido|Cybersource|
|UNV-OC|O código de área e/ou o prefixo de telefone são/é inválido|Cybersource|
|UNV-PH|O número do telefone é inválido|Cybersource|

## Tabela 26 - ProviderAnalysisResult.AfsReply.SuspiciousInfoCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|BAD-FP|O dispositivo é arriscado|Cybersource|
|INTL-BIN|O cartão de crédito foi emitido fora dos EUA|Cybersource|
|MM-TZTLO|Fuso horário do dispositivo é incompatível com os fusos horários do país|Cybersource|
|MUL-EM|O comprador tem usado mais de quatro endereços de e-mail diferentes|Cybersource|
|NON-BC|A cidade do endereço de cobrança é sem sentido|Cybersource|
|NON-FN|O primeiro nome do comprador é sem sentido|Cybersource|
|NON-LN|O último nome do comprador é sem sentido|Cybersource|
|OBS-BC|A cidade do endereço de cobrança contem obscenidades|Cybersource|
|OBS-EM|O endereço de e-mail contem obscenidades|Cybersource|
|RISK-AVS|O resultado do combinado do teste AVS e endereço de cobrança normalizado são arriscados, o resultado AVS indica uma correspondência exata, mas o endereço de cobrança não é entregável|Cybersource|
|RISK-BC|A cidade do endereço de cobrança possui caracteres repetidos|Cybersource|
|RISK-BIN|No passado, este BIN do cartão de crédito (os seis primeiros dígitos do número do cartão) mostrou uma elevada incidência de fraude|Cybersource|
|RISK-DEV|Algumas das características do dispositivo são arriscadas|Cybersource|
|RISK-FN|Nome e último nome do comprador contêm combinações de letras improváveis|Cybersource|
|RISK-LN|Nome do meio ou último nome do comprador contêm combinações de letras improváveis|Cybersource|
|RISK-PIP|O endereço IP do proxy é arriscado|Cybersource|
|RISK-SD|A inconsistência nos países dos endereços cobrança e entrega é arriscada|Cybersource|
|RISK-TB|O dia e a hora da ordem associada ao endereço de cobrança é arriscado|Cybersource|
|RISK-TIP|O verdadeiro endereço IP é arriscado|Cybersource|
|RISK-TS|O dia e a hora da ordem associada ao endereço de entrega é arriscado|Cybersource|

## Tabela 27 - ProviderAnalysisResult.AfsReply.VelocityInfoCode

|Valor|Descrição|Provider|
|:-|:-|:-|
|VEL-ADDR|Diferente estados dos endereços de cobrança e/ou entrega (EUA e Canadá apenas) têm sido usadas várias vezes com o número do cartão de crédito e/ou endereço de email|Cybersource|
|VEL-CC|Diferentes números de cartões de créditos foram usados várias vezes com o mesmo nome ou endereço de email|Cybersource|
|VEL-NAME|Diferentes nomes foram usados várias vezes com o mesmo número do cartão de crédito e/ou endereço de email|Cybersource|
|VELS-CC|O número do cartão de crédito tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-CC|O número do cartão de crédito tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-CC|O número do cartão de crédito tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-CC|O número do cartão de crédito tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-EM|O endereço de e-mail tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-FP|O device fingerprint tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-IP|O endereço IP tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo longo|Cybersource|
|VELV-SA|O endereço de entrega tem sido utilizado várias vezes durante um intervalo muito longo|Cybersource|
|VELS-TIP|O endereço IP verdadeiro tem sido utilizado várias vezes durante um intervalo curto|Cybersource|
|VELI-TIP|O endereço IP verdadeiro tem sido utilizado várias vezes durante um intervalo médio|Cybersource|
|VELL-TIP|O endereço IP verdadeiro tem sido utilizado várias vezes durante um intervalo longo|Cybersource|

## Tabela 28 - ProviderAnalysisResult.AfsReply.IpRoutingMethod

|Valor|Descrição|Provider|
|:-|:-|:-|
|Anonymizer|Endereços de IP estão escondidos porque o comprador é extremamente cauteloso, quer privacidade absoluta ou é fraudulento|Cybersource|
|AOL, AOL dialup, AOL POP and AOL proxy|Membros da AOL. Na maioria dos casos, o país pode ser identificado, mas o estado e cidade não podem|Cybersource|
|Cache proxy|Proxy usado através de um acelerador da Internet ou de uma distribuição de conteúdo de serviço. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|Cybersource|
|Fixed|O endereço de IP está próximo ou no mesmo local que o comprador|Cybersource|
|International proxy|Proxy que contém tráfego de vários países. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|Cybersource|
|Mobile gateway|Gateway para conectar dispositivos móveis à internet. Muitas operadoras, especialmente na Europa, atendem mais do que um país e tráfego ocorre através de hubs de rede centralizados. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|Cybersource|
|POP|Discagem do comprador em um ISP regional provavelmente perto da localização do endereço de IP, mas possivelmente através de limites geográficos|Cybersource|
|Regional proxy|Proxy que contém tráfego de vários estados dentro de um único país. O comprador pode estar localizado em um estado diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|Cybersource|
|Satellite|Conexões por satélite. Se o uplink e o downlink estiverem cadastrados, o método roteamento é considerado padrão porque o remetente é conhecido. No entanto, se o downlink não está registrado, o comprador pode estar em qualquer lugar dentro do feixe padrão do satélite, que pode abranger um continente ou mais|Cybersource|
|SuperPOP|O comprador está discando em um ISP multi-estatal ou multinacional que provavelmente não é provável a localização do endereço de IP. O comprador pode estar discando através de limites geográficos|Cybersource|
|No value returned|O tipo de roteamento é desconhecido|Cybersource|

## Tabela 29 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision

|Valor|Provider|
|:-|:-|
|ACCEPT|Cybersource|
|REVIEW|Cybersource|
|REJECT|Cybersource|
|ERROR|Cybersource|

## Tabela 30 - ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation

|Valor|Descrição|Provider|
|:-|:-|:-|
|T|A regra é verdadeira|Cybersource|
|F|A regra é falsa|Cybersource|
|N|A regra não pode ser avaliada porque os dados são insuficientes|Cybersource|
|E|A regra não pode ser avaliada porque ocorreu um erro|Cybersource|

## Tabela 31 - MerchantDefinedData (Cybersource)

> Nível de Relevância <br/> 1 - Relevante <br/> 2 - Muito Relevante <br/> 3 - Extremamente Relevante <br/><br/>
> Conforme nível de relevância dos campos e possibilidade de desenho da estratégia de risco de acordo com a necessidade do seu negócio, na validação das transações de testes os mesmos serão cobrados caso não sejam enviaos. Com isso, solicitamos uma análise prévia da documentação e sinalização dos campos que não serão possíveis de serem enviados.<br/><br/>
> No caso de não possuir o dado para enviar, pedimos a gentileza de não enviar o campo correspondente como vazio, ou seja, apenas não enviar.

|Key|Value|Tipo|Nível de Relevância|Segmento|
|:-|:-|:-|:-:|:-|
|1|Cliente efetuou Login <br/> Se o cliente final logou no site para comprar, enviar: o login dele <br/> Se fez compra como visitante, enviar: Guest <br/> Se a venda foi feita direto por um terceiro, um agente por exemplo, não enviar o campo|string|2|Todos|
|2|Quantidade em dias que o cliente é seu cliente <br/> Ex.: 314|int|3|Todos|
|3|Quantidade de parcelas do pedido|int|3|Todos|
|4|Canal de Venda <br/> Possíveis valores: <br/> Call Center -> compra pelo telefone <br/> Web -> compra pela web <br/> Portal -> um agente fazendo a compra para o cliente <br/> Quiosque -> compras em quiosques <br/> Movel -> compras feitas em celulares ou tablets|string|3|Todos|
|5|Enviar o código do cupom/desconto caso o cliente utilize na compra|string|1|Todos|
|6|Quantidade em dias desde a última compra realizada pelo cliente <br/> Ex.: 55|int|3|Todos|
|7|Código ou nome do seller (vendedor)|string|1|Todos|
|8|Tentativas realizadas pelo cliente de efetuar o pagamento do mesmo pedido, podendo ser com diferentes cartões de créditos e/ou através de outros meios de pagamentos|int|2|Todos|
|9|Identifica se cliente irá retirar o produto na loja <br/> Possíveis valores: SIM ou NAO|string|3|Varejo ou Cosméticos|
|10|Identifica se o pagamento será realizado por outra pessoa que não esteja presente na viagem ou pacote <br/> Possíveis valores: SIM ou NAO|string|3|Aéreo ou Turismo|
|11|Categoria do hotel (quantas estrelas) <br/> Possíveis valores: <br/> 1 -> Simples <br/> 2 -> Econômico <br> 3 -> Turismo <br/> 4 -> Superior <br/> 5 -> Luxo|int|3|Turismo|
|12|Quantidade em dias desde a data da compra até a data do checkin no hotel <br/> Ex.: 123|int|3|Turismo|
|13|Quantidade de diárias no hotel <br/> Ex.: 5|int|3|Turismo|
|14|Categoria da viagem ou pacote <br> Possíveis valores: Nacional ou Internacional ou Nacional/Internacional|string|3|Aéreo ou Turismo|
|15|Nome da companhia áerea / locadora de carro / hotel <br/> Enviar o nome de cada uma das empresas, separado por /|string|2|Aéreo ou Turismo|
|16|Código PNR da reserva <br/> Quando houver uma alteração da reserva para este PNR, com antecipação da data de voo, é importante fazer uma nova análise de fraude enviando este PNR novamente|string|3|Aérea|
|17|Identifica se houve antecipação de reserva <br/> Possíveis valores: SIM ou NAO <br/> Se sim, fundamental o envio também do campo 16 - Código PNR da reserva|string|3|Aéreo|
|18|Categoria do veículo alugado <br/> Possíveis valores: <br/> 1 - Básico <br/> 2 - Esportivo <br/> 3 - Prime <br/> 4 - Utilitário <br/> 5 - Blindado|string|3|Turismo|
|19|Identifica se o pacote refere-se a cruzeiro <br/> Possíveis valores: SIM ou NAO|string|2|Turismo|
|20|Decisão da análise de fraude referente a última compra <br/> Possíveis valores: ACEITA ou REJEITADA|string|3|Todos|
|21|Valor do frete <br/> Ex.: 10599 = r$ 105,99|long|1|Varejo ou Cosméticos|
|22|Código da loja onde o produto será retirado <br/> Este campo deverá ser enviado quando o campo 9 for enviado igual a SIM|string|3|Varejo ou Cosméticos|
|23|Sufixo (4 últimos dígitos) do cartão de crédito|int|1|Todos|
|24|Quantidade de dias desde a primeira compra realizada pelo cliente <br/> Ex.: 150|int|3|Todos|
|25|Sexo do cliente <br/> Possíveis valores: <br/> F -> Feminino <br/> M -> Masculino|string|2|Todos|
|26|Bin (6 primeiros dígitos) do cartão de crédito|int|1|Todos|
|27|Tipo do logradouro do endereço de entrega <br/> Possíveis valores: <br/> R -> Residencial <br/> C -> Comercial|string|2|Todos|
|28|Tempo médio em minutos que o cliente levou para realizar a compra|int|2|Todos|
|29|Quantidade de tentativas que o cliente realizou para efetuar login|int|2|Todos|
|30|Quantidade de páginas web que o cliente visitou anteriormente a compra referente a 30 minutos passados|int|2|Todos|
|31|Quantidade de trocas de números de cartão de crédito que o cliente efetuou para realizar o pagamento do pedido|int|2|Todos|
|32|Identifica se o e-mail foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|3|Todos|
|33|Identifica se o número do cartão de crédito foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|3|Todos|
|34|Identifica se o e-mail foi confirmado para ativação de conta <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|35|Identifica o tipo de cliente <br/> Possíveis valores: Local ou Turista|string|2|Turismo|
|36|Identifica se foi utilizado cartão presente (GiftCard) na compra como forma de pagamento <br/> Possíveis valores: SIM ou NAO|string|1|Todos|
|37|Meio de envio do pedido <br/> Possíveis valores: Sedex <br/> Sedex 10 <br/> 1 Dia <br/> 2 Dias <br/> Motoboy <br/> Mesmo Dia <br/>|string|3|Varejo ou Cosméticos|
|38|Número do telefone do cliente identificado através da bina quando venda realizada através do canal de venda igual a Call Center <br/> Formato: DDIDDDNúmero - Ex.: 552121114720|string|3|Todos|
|39|Nome de usuário do Call Center <br/> Este campo deverá ser enviado quando campo 4 for enviado igual a Call Center|string|1|Todos|
|40|Comentários inseridos quando pedido for presente|string|1|Todos|
|41|Tipo do documento <br/> Possíveis valores: CPF ou CNPJ ou Passaporte|string|2|Todos|
|42|Idade do cliente|int|2|Todos|
|43|Faixa de rendimento do cliente <br/> Ex.: 100000 = r$ 1.000,00|long|2|Todos|
|44|Quantidade histórica de compras realizadas pelo cliente|int|3|Todos| 
|45|Identifica se é uma compra realizada por funcionário <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|46|Nome impresso (portador) no cartão de crédito|string|3|Todos|
|47|Identifica se o cartão é private label <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|48|Quantidade de meios de pagamentos utilizados para efetuar a compra|int|2|Todos|
|49|Média das compras realizadas nos últimos 6 meses <br/> Ex.: 159050 = r$ 1.590,99|long|3|Todos|
|50|Fator de desvio de valor da compra atual sobre a média dos últimos 6 meses|3|Todos|
|51|Identifica se é um cliente VIP com tratamento de risco diferenciado ou lista positiva <br/> Possíveis valores: SIM ou NAO|string|3|Todos|
|52|Categoria do produto <br/> Possíveis valores: <br/> Animais e Bichos de Estimação <br/> Roupas e Acessórios <br/> Negócios e Indústria <br/> Câmeras e Óticas <br/> Eletrônicos <br/> Comidas, Bebidas e Cigarro <br/> Móveis <br/> Ferramentas <br/> Saúde e Beleza <br/> Casa e Jardim <br/> Malas e Bagagens <br/> Adulto <br/> Armas e Munição <br/> Materiais de Escritório <br/> Religião e Cerimoniais <br/> Software <br/> Equipamentos de Esporte <br/> Brinquedos e Jogos <br/> Veículos e Peças <br/> Livros <br/> DVDs e Vídeos <br/> Revistas e Jornais <br/> Música <br/> Outras Categorias Não Especificadas|string|2|Todos|
|53|Identifica se existe rotina de confirmação de celular por SMS <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|54|Qual a 2ª forma de pagamento|string|2|Todos|
|55|Qual a 3ª forma de pagamento|string|2|Todos|
|56|Se 2ª forma de pagamento for cartão de crédito, enviar a bandeira|string|1|Todos|
|57|Se 3ª forma de pagamento for cartão de crédito, enviar a bandeira|string|1|Todos|
|58|Se 2ª forma de pagamento, informar o valor pago <br/> Ex.: 128599 = r$ 1.285,99|long|2|Todos|
|59|Se 3ª forma de pagamento, informar o valor pago <br/> Ex.: 59089 = r$ 590,89|long|2|Todos|
|60|Quantidade em dias desde a data da última alteração <br/> Ex.: 57|int|3|Todos|
|61|Identifica se houve alteração cadastral|string|1|Todos|
|62|Quantidade de pontos trocados na última compra|long|3|Fidelidade|
|63|Quantidade de pontos restantes no saldo|long|2|Fidelidade|
|64|Quantidade de dias desde a última troca de pontos|long|2|Fidelidade|
|65|Identificador do cliente no programa de fidelidade|string|2|Fidelidade|
|66|Quantidade de minutos recarregados nos últimos 30 dias|long|2|Digital Goods|
|67|Quantidade de recargas realizadas nos últimos 30 dias|long|2|Digital Goods|
|68|Quantidade em dias entre a data de partida e a data de retorno|int|2|Aéreo|
|69|Quantidade de passageiros viajando independente da faixa etária|int|2|Aéreo|
|70|Identificador do voô|string|1|Aéreo|
|71|Número de infants viajando|int|2|Aéreo|
|72|Número de crianças viajando|int|2|Aéreo|
|73|Número de adultos viajando|int|2|Aéreo|
|74|Identifica se é um passageiro frequente (Frequently Flyer) <br/> Possíveis valores: SIM ou NAO|string|2|Aéreo|
|75|Identificar do passageiro frequente (Frequently Flyer Number)|string|2|Aéreo|
|76|Categoria do passageiro frequente (Frequently Flyer) <br/> Esta categoria pode variar de acordo com a companhia aérea|int|2|Aéreo|
|77|Dia da semana do embarque <br/> Possíveis valores: Sunday (Domingo) <br/> Monday (Segunda-feira) <br/> Tuesday (Terça-feira) <br/> Wednesday (Quarta-feira) <br/> Thursday (Quinta-feira) <br/> Friday (Sexta-feira) <br/> Saturday (Sábado)|string|2|Aéreo|
|78|Código da companhia aérea <br/> Ex.: JJ ou LA ou AA ou UA ou G3 e etc|string|1|Aéreo|
|79|Classe tarifária da passagem <br/> Ex.: W ou Y ou N e etc|string|2|Aéreo|
|80|Número do celular do passageiro <br/> Ex.: Formato: DDIDDDNúmero - Ex.: 5521976781114|string|2|Aéreo|
|81|Identifica se o dono do cartão de crédito irá viajar <br/> Possíveis valores: SIM ou NAO|string|3|Aéreo|
|82|Identifica se o seller (vendedor) irá trabalhar com revisão manual ou não <br/> Possíveis valores: SIM ou NAO|string|1|Todos|
|83|Segmento de negócio <br/> Ex.: Varejo|string|2|Todos|
|84|Nome da plataforma integrada a API Antifraude Gateway Braspag <br/> Caso seja uma integração direta entre a loja e Braspag, enviar valor igual a PROPRIA|string|3|Todos|
|85 a 89|Campos livres e definidos junto ao provedor de antifraude, conforme as regras de negócio|-|-|-|
|90 a 100|Reservados|-|-|-|

## Tabela 32 - CartItem[n].Category

Valor|Descrição|Provider|
|:-|:-|:-|
|AdultContent|Conteúdo adulto|Cybersource|
|Coupon|Cupom aplicado para todo o pedido|Cybersource|
|Default|Valor default para o tipo do produto. Quando não enviado nenhum outro valor, assume-se o a categoria senda esta|Cybersource|
|EletronicGood|Produto eletônico diferente de software|Cybersource|
|EletronicSoftware|Softwares distribuídos eletronicamente via download|Cybersource|
|GiftCertificate|Vale presente|Cybersource|
|HandlingOnly|Taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda. Ex.: Taxa de conveniência / Taxa de instalação|Cybersource|
|Service|Serviço que será realizado para o cliente|Cybersource|
|ShippingAndHandling|Valor do frete e e taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda|Cybersource|
|ShippingOnly|Valor do frete|Cybersource|
|Subscription|Assinatura. Ex.: Streaming de vídeos / Assinatura de notícias|Cybersource|