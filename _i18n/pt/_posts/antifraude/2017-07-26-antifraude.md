---
layout: manual
title: Manual de integração
description: Integração técnica API Antifraude Gateway Braspag
search: true
categories: manual
tags:
  - AntiFraude
language_tabs:
  json: JSON
  curl: CURL
  html: HTML
---

# Visão Geral

Antifraude Gateway é uma plataforma desenvolvida pelo time de Risco da Braspag para facilitar a integração dos clientes que desejam realizar análises de fraude com provedores distintos e com tecnologias distintas, ou seja, o Antifraude Gateway é responsável por realizar a interconexão entre o cliente que utiliza JSON na mensageria e o provedor que utiliza XML na mensageria, por exemplo.

A plataforma é baseada em arquitetura REST, que trocam dados em formato JSON seguindo fluxos de autorização definidos pelo protocolo OAuth 2, onde todos os padrões são amplamente utilizados pelo mercado e suportado pelas comunidades técnicas.

> Para saber mais sobre OAuth 2, consulte [https://oauth.net/2/](https://oauth.net/2/)

A plataforma foi construída utilizando um dos principais produtos da Braspag, o Cartão Protegido, para tokenização de cartões e análises de fraude através dos tokens.

# Objetivo

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a API Antifraude Gateway Braspag, gateway de provedores de soluções de antifraude de mercado, descrevendo as operações disponíveis com exemplos de requisições e respostas.

Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

# Autenticação

## Tokens de Acesso

A API Antifraude Gateway Braspag utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, que são: **Sandbox** e **Produção**.

Esta sessão descreve o fluxo necessário para que aplicações cliente obtenham tokens de acesso válidos para uso na plataforma.

## Obtenção do token de acesso  

* O token de acesso é obtido através do fluxo oauth **client_credentials**. O diagrama abaixo, ilustra, em ordem cronológica, a comunicação que se dá entre a **Aplicação Cliente**, a **API BraspagAuth** e a **API Antifraude Gateway**.

![Obtenção de Tokens de Acesso]({{ site.baseurl_root }}/images/braspag/af/antifraudeauthentication.png){: .centerimg }{:title="Fluxo para obtenção do Token de Acesso "}

1. A **Aplicação Cliente**, informa à API **BraspagAuth** sua credencial.

2. O **BraspagAuth** valida a credencial recebida. Se for válida, retorna o token de acesso para a **Aplicação Cliente**.

3. A **Aplicação Cliente** informa o token de acesso no cabeçalho das requisições HTTP feitas à **API Antifraude Gateway Braspag**.

4. Se o token de acesso for válido, a requisição é processada e os dados são retornados para a **Aplicação Cliente**.

> Solicite uma credencial abrindo um ticket através da nossa ferramenta de suporte, enviando o(s) IP(s) de saída dos seus servidores de homologação e produção.  
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
|-|-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no corpo (Body)**

|Key|Value|
|-|-|
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

|Parâmetro|Descrição|
|-|-|
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido, no caso a API Antifraude Gateway|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/>O token quando expirar, é necessário obter um novo|

# Análise de fraude

A Braspag ao receber os dados do pedido, encaminha para o provedor analisá-los. Os provedores utilizam tecnologias como identificação de máquina, geolocalização de IP, análise de redes sociais, detecção de proxy e contadores de velocidade. Em tempo real receberá um recomendação da análise e poderá tomar uma ação.

## Analisando uma transação na ReDShield

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "RedShield",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "SplitingPaymentMethod": "None",
  "IsRetryTransaction": false,
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA",
    "EciThreeDSecure": "5"
  },
  "Billing": {
    "Street": "Rua Neturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Saturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "Email": "emailentrega@dominio.com.br",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silvao",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Comment": "Em frente ao 322"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silva",
    "BirthDate": "1983-10-01",
    "Gender": "Male",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Ip": "127.0.0.1",
    "BrowserFingerprint": "04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw==",
    "Status": "NEW"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "6500",
      "MerchantItemId": "4",
      "Sku": "abc123",
      "Quantity": 1,
      "OriginalPrice": "7000",
      "GiftMessage": "Te amo!",
      "Description": "Uma description do Mouse",
      "ShippingInstructions": "Proximo ao 546",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "123456"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "7500",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "OriginalPrice": "8000",
      "GiftMessage": "Te odeio!",
      "Description": "Uma description do Teclado",
      "ShippingInstructions": "Proximo ao 123",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "987654"
    }
  ],
  "CustomConfiguration": {
    "MerchantWebsite": "www.test.com"
  },
  "MerchantDefinedData": [
    {
      "Key": "USER_DATA4",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "Segment",
      "Value": "8999"
    },
    {
      "Key": "MerchantId",
      "Value": "Seller123456"
    }
  ]
}
```

``` shell
curl
--request POST "https://{antifraude endpoint}/analysis/v2"
--header "Authorization: Bearer {access_token}"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "RequestId: wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww
--header "Content-Type: application/json"
--data-binary
{
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "RedShield",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "SplitingPaymentMethod": "None",
  "IsRetryTransaction": false,
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA",
    "EciThreeDSecure": "5"
  },
  "Billing": {
    "Street": "Rua Neturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Saturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "Email": "emailentrega@dominio.com.br",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silvao",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Comment": "Em frente ao 322"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silva",
    "BirthDate": "1983-10-01",
    "Gender": "Male",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Ip": "127.0.0.1",
    "BrowserFingerprint": "04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw==",
    "Status": "NEW"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "6500",
      "MerchantItemId": "4",
      "Sku": "abc123",
      "Quantity": 1,
      "OriginalPrice": "7000",
      "GiftMessage": "Te amo!",
      "Description": "Uma description do Mouse",
      "ShippingInstructions": "Proximo ao 546",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "123456"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "7500",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "OriginalPrice": "8000",
      "GiftMessage": "Te odeio!",
      "Description": "Uma description do Teclado",
      "ShippingInstructions": "Proximo ao 123",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "987654"
    }
  ],
  "CustomConfiguration": {
    "MerchantWebsite": "www.test.com"
  },
  "MerchantDefinedData": [
    {
      "Key": "USER_DATA4",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "Segment",
      "Value": "8999"
    },
    {
      "Key": "MerchantId",
      "Value": "Seller123456"
    }
  ]
}
--verbose
```

### Request

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`MerchantOrderId`|Número do pedido da loja|string|sim|100|
|`TotalOrderAmount`|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|long|sim|-|
|`TransactionAmount`|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|long|sim|-|
|`Currency`|Moeda - Tabela 1|enum|-|-|
|`Provider`|Provedor da solução de antifraude - Tabela 2|enum|-|-|
|`OrderDate`|Data do pedido <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Obs.: Caso não envie seja enviada, uma data será gerada pela Braspag|datetime|sim|-|
|`BraspagTransactionId`|Id da transação no Pagador da Braspag.|guid|não|-|
|`SplitingPaymentMethod`|Identifica se a autorização da transação é com um ou mais cartões ou com mais de um meio de pagamento - Tabela 3|enum|-|-|
|`IsRetryTransaction`|Retentativa de uma análise, e deverá ser enviado com valor igual a TRUE quando o código de retorno na primeira tentativa for igual a BP900|bool|não|-|
|`Card.Number`|Número do cartão de crédito|string|sim|19|
|`Card.Holder`|Nome do cartão de crédito|string|sim|50|
|`Card.ExpirationDate`|Data de expiração do cartão de crédito <br/> Ex.: 01/2023|string|sim|7|
|`Card.Cvv`|Código de segurança do cartão de crédito|string|sim|4|
|`Card.Brand`|Bandeira do cartão de crédito - Tabela 4|enum|-|-|
|`Card.EciThreeDSecure`|Código do ECI (Eletronic Commerce Indicator) de autenticação|string|não|1|
|`Card.Save`|Indica se os dados do cartão de crédito serão armazenados no Cartão Protegido|bool|não|-|
|`Card.Token`|Identificador do cartão de crédito salvo no Cartão Protegido|guid|não|-|
|`Card.Alias`|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|string|não|64|
|`Billing.Street`|Logradouro do endereço de cobrança|string|não|24|
|`Billing.Number`|Número do endereço de cobrança|string|não|5|
|`Billing.Complement`|Complemento do endereço de cobrança|string|não|14|
|`Billing.Neighborhood`|Bairro do endereço de cobrança|string|não|15|
|`Billing.City`|Cidade do endereço de cobrança|string|não|20|
|`Billing.State`|Estado do endereço de cobrança|string|não|2|
|`Billing.Country`|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|
|`Billing.ZipCode`|Código postal do endereço de cobrança|string|não|9|
|`Shipping.Street`|Logradouro do endereço de entrega|string|não|24|
|`Shipping.Number`|Número do endereço de entrega|string|não|5|
|`Shipping.Complement`|Complemento do endereço de entrega|string|não|14|
|`Shipping.Neighborhood`|Bairro do endereço de entrega|string|não|15|
|`Shipping.City`|Cidade do endereço de entrega|string|não|20|
|`Shipping.State`|Estado do endereço de entrega|string|não|2|
|`Shipping.Country`|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|
|`Shipping.ZipCode`|Código postal do endereço de entrega|string|não|9|
|`Shipping.Email`|E-mail do responsável a receber o produto no endereço de entrega|string|não|60|
|`Shipping.FirstName`|Primeiro nome do responsável a receber o produto no endereço de entrega|string|não|30|
|`Shipping.MiddleName`|Primeira letra do nome do meio do responsável a receber o produto no endereço de entrega|string|não|1|
|`Shipping.LastName`|Último do nome do responsável a receber o produto no endereço de entrega|string|não|30|
|`Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114700|string|não|19|
|`Shipping.WorkPhone`|Número do telefone de trabalho do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114701|string|não|19|
|`Shipping.Mobile`|Número do celular do responsável a receber o produto no endereço de entrega <br/> Ex.: 5521987654321|string|não|19|
|`Shipping.ShippingMethod`|Meio de entrega do pedido - Tabela 5|enum|-|-|
|`Shipping.Comment`|Referências do endereço de entrega|string|não|160|
|`Customer.MerchantCustomerId`|Número do documento de identificação do comprador - Tabela 6|string|sim|16|
|`Customer.FirstName`|Primeiro nome do comprador|string|sim|30|
|`Customer.MiddleName`|Primeira letra do nome do comprador|string|não|1|
|`Customer.LastName`|Último nome do comprador|string|sim|30|
|`Customer.BirthDate`|Data de nascimento do comprador <br/> Ex.: 1983-10-01|date|sim|-|
|`Customer.Gender`|Sexo do comprador - Tabela 7|string|não|6|
|`Customer.Email`|E-mail do comprador|string|não|60|
|`Customer.Ip`|Endereço de IP do comprador|string|não|15|
|`Customer.Phone`|Número do telefone do comprador <br/> Ex.: 552121114700|string|não|19|
|`Customer.WorkPhone`|Número do telefone do comprador <br/> Ex.: 552121114701|string|não|19|
|`Customer.Mobile`|Número do celular do comprador <br/> Ex.: 5521987654321|string|não|19|
|`Customer.Status`|Status do comprador na loja - Tabela 8|string|não|8|
|`Customer.BrowserFingerPrint`|Impressão digital de dispositivos e geolocalização real do IP do comprador - LINK PARA CONFIG FINGERPRINT|string|sim|6005|
|`CartItem[n].ProductName`|Nome do produto|string|não|50|
|`CartItem[n].UnitPrice`|Preço unitário do produto <br/> Ex: 10950 = r$ 109,50|long|não|-|
|`CartItem[n].OriginalPrice`|Preço original do produto <br/> Ex: 11490 = r$ 114,90|long|não|-|
|`CartItem[n].MerchantItemId`|ID do produto na loja|string|não|30|
|`CartItem[n].Sku`|Sku do produto|string|não|12|
|`CartItem[n].Quantity`|Quantidade do produto|int|não|-|
|`CartItem[n].GiftMessage`|Mensagem de presente|string|não|160|
|`CartItem[n].Description`|Descrição do produto|string|não|76|
|`CartItem[n].ShippingInstructions`|Instruções de entrega do produto|string|não|160|
|`CartItem[n].ShippingMethod`|Meio de entrega do produto - Tabela 10|enum|-|-|
|`CartItem[n].ShippingTranckingNumber`|Número de rastreamento do produto|string|não|19|
|`CustomConfiguration.MerchantWebsite`|Website da loja|string|não|60|
|`MerchantDefinedData.Key`|Campo definido junto ao provedor de antifraude|int|Consultar o anexo XPTO para mais informações||
|`MerchantDefinedData.Value`|Campo definido junto ao provedor de antifraude|int|Consultar o anexo XPTO para mais informações||

### Response

``` json
{
  "Id": "5f8a661c-00e0-e711-80c2-000d3a70dd7b",
  "ProviderAnalysisResult": {
    "ProviderRequestId": "8a82944a6045a46f01604fd26814233b",
    "Result": {
        "ProviderCode": "000.000.000",
        "ProviderDescription": "Transaction succeeded"
    },
    "ResultDetails": {
        "CSITransactionLink": "https://{redshield endpoint}/index.red#transactiondetail/000548000001XCJ20171213072118102",
        "Status": "ACCEPT",
        "ProviderTransactionId": "322066985634",
        "ProviderResponseCode": "0150",
        "ProviderOrderId": "000548000001XCJ20171213072118102"
    },
    "Ndc": "8a82941859d5969a0159db3f6ecc1418_5b9d6472570843d6b7e261d92827d361"
  },
  "Links": [{
    "Method": "GET",
    "Href": "https://{antifraude endpoint}/analysis/v2/5f8a661c-00e0-e711-80c2-000d3a70dd7b",
    "Rel": "Self"
  }],
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "RedShield",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "SplitingPaymentMethod": "None",
  "IsRetryTransaction": false,
  "Card": {
    "Number" : "4444555566667777",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA",
    "EciThreeDSecure": "5"
  },
  "Billing": {
    "Street": "Rua Neturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Saturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "Email": "emailentrega@dominio.com.br",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silvao",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Comment": "Em frente ao 322"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silva",
    "BirthDate": "1983-10-01",
    "Gender": "Male",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Ip": "127.0.0.1",
    "BrowserFingerprint": "04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw==",
    "Status": "NEW"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "6500",
      "MerchantItemId": "4",
      "Sku": "abc123",
      "Quantity": 1,
      "OriginalPrice": "7000",
      "GiftMessage": "Te amo!",
      "Description": "Uma description do Mouse",
      "ShippingInstructions": "Proximo ao 546",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "123456"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "7500",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "OriginalPrice": "8000",
      "GiftMessage": "Te odeio!",
      "Description": "Uma description do Teclado",
      "ShippingInstructions": "Proximo ao 123",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "987654"
    }
  ],
  "CustomConfiguration": {
    "MerchantWebsite": "www.test.com"
  },
  "MerchantDefinedData": [
    {
      "Key": "USER_DATA4",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "Segment",
      "Value": "8999"
    },
    {
      "Key": "MerchantId",
      "Value": "Seller123456"
    }
  ]
}
```

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`Id`|Id da transação no Antifraude Gateway Braspag|guid|
|`ProviderAnalysisResult.ProviderRequestId`|Id do request da transação na ReDShield|string|
|`ProviderAnalysisResult.Result.ProviderCode`|Código de retorno da ReDShield|string|
|`ProviderAnalysisResult.Result.ProviderDescription`|Mensagem de retorno da ReDShield|string|
|`ProviderAnalysisResult.ResultDetails.CSITransactionLink`|Link para visualizar os detalhes da transação no portal CSI da ReDShield|string|
|`ProviderAnalysisResult.ResultDetails.Status`|Status da transação no Antifraude Gateway Braspag após a análise - Tabela 1|enum|
|`ProviderAnalysisResult.ResultDetails.ProviderTransactionId`|Id da transação na ReDShield|string|
|`ProviderAnalysisResult.ResultDetails.ProviderOrderId`|Id do pedido da ReDShield|string|
|`ProviderAnalysisResult.Ndc`|Id único e exclusivo da requisição da ReDShield|string|

## Analisando uma transação na Cybersource

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "Cybersource",
  "OrderDate": "2016-12-09 12:35:58.852",
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
  }
}
```

### Request

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`MerchantOrderId` |Número do pedido da loja <br/> Obs.: Este mesmo valor deve ser passado na variável SESSIONID do script do fingerprint|string|sim|100|
|`TotalOrderAmount`|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|long|sim|-|
|`TransactionAmount`|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|long|sim|-|
|`Currency`|Moeda - Tabela 1|enum|-|-|
|`Provider`|Provedor da solução de antifraude - Tabela 2|enum|-|-|
|`OrderDate`|Data do pedido <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Obs.: Caso não envie seja enviada, uma data será gerada pela Braspag|datetime|sim|-|
|`BraspagTransactionId`|Id da transação no Pagador da Braspag.|guid|não|-|
|`Card.Number`|Número do cartão de crédito|string|sim|20|
|`Card.Holder`|Nome do cartão de crédito|string|sim|50|
|`Card.ExpirationDate`|Data de expiração do cartão de crédito <br/> Ex.: 01/2023|string|sim|7|
|`Card.Brand`|Bandeira do cartão de crédito - Tabela 4|enum|-|-|
|`Card.Save`|Indica se os dados do cartão de crédito serão armazenados no Cartão Protegido|bool|não|-|
|`Card.Token`|Identificador do cartão de crédito salvo no Cartão Protegido|guid|não|-|
|`Card.Alias`|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|string|não|64|
|`Billing.Street`|Logradouro do endereço de cobrança|string|sim|54|
|`Billing.Number`|Número do endereço de cobrança|string|não|5|
|`Billing.Complement`|Complemento do endereço de cobrança|string|não|14|
|`Billing.Neighborhood`|Bairro do endereço de cobrança|string|não|45|
|`Billing.City`|Cidade do endereço de cobrança|string|sim|50|
|`Billing.State`|Estado do endereço de cobrança|string|não|2|
|`Billing.Country`|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|sim|2|
|`Billing.ZipCode`|Código postal do endereço de cobrança|string|não|9|
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
|`Shipping.ShippingMethod`|Meio de entrega do pedido - Tabela 5|enum|-|-|
|`Customer.MerchantCustomerId`|Número do documento de identificação do comprador - Tabela 6|string|sim|16|
|`Customer.FirstName`|Primeiro nome do comprador|string|sim|60|
|`Customer.LastName`|Último nome do comprador|string|sim|60|
|`Customer.BirthDate`|Data de nascimento do comprador <br/> Ex.: 1983-10-01|date|sim|-|
|`Customer.Email`|E-mail do comprador|string|sim|100|
|`Customer.Ip`|Endereço de IP do comprador|string|não|15|
|`Customer.Phone`|Número do telefone do comprador <br/> Ex.: 552121114700|string|não|15|
|`Customer.BrowserHostName`|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|string|não|60|
|`Customer.BrowserCookiesAccepted`|Identifica se o browser do comprador aceita cookies ou não|bool|-|-|
|`Customer.BrowserEmail`|E-mail registrado no browser do comprador. Pode diferenciar do e-mail cadastrado (`Customer.Email`)|string|não|100|
|`Customer.BrowserType`|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP (`Customer.Email`)|string|não|40|
|`CartItem[n].ProductName`|Nome do produto|string|sim|255|
|`CartItem[n].Risk`|Nível de risco do produto associado a quantidade de chargebacks - Tabela 9|enum|-|-|
|`CartItem[n].UnitPrice`|Preço unitário do produto <br/> Ex: 10950 = r$ 109,50|long|sim|-|
|`CartItem[n].Sku`|Sku do produto|string|não|255|
|`CartItem[n].Quantity`|Quantidade do produto|int|não|-|
|`CartItem[n].AddressRiskVerify`|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países - Tabela 11|enum|-|-|
|`CartItem[n].HostHedge`|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude - Tabela 12|enum|-|-|
|`CartItem[n].NonSensicalHedge`|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude - Tabela 13|enum|-|-|
|`CartItem[n].ObscenitiesHedge`|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude - Tabela 14|enum|-|-|
|`CartItem[n].TimeHedge`|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido - Tabela 15|enum|-|-|
|`CartItem[n].PhoneHedge`|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude - Tabela 16|enum|-|-|
|`CartItem[n].VelocityHedge`|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores - Tabela 17|enum|-|-|
|`CustomConfiguration.Comments`|Comentários que a loja poderá associar a análise de fraude|string|não|255|
|`CustomConfiguration.ScoreThreshold`|Nível aceitável de risco para cada produto|int|-|-|
|`MerchantDefinedData.Key`|Campo definido junto ao provedor de antifraude|int|Consultar o anexo XPTO para mais informações||||
|`MerchantDefinedData.Value`|Campo definido junto ao provedor de antifraude|int|Consultar o anexo XPTO para mais informações||||
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
|`Invoice.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser desvolvido a loja|bool|não|-|
|`Invoice.Tender`|Forma de pagamento utilizada pelo comprador. - Tabela 18|enum|não|-|

### Response

``` json
{
  "Id": "3671aafd-09e0-e711-80c2-000d3a70dd7b",
  "ProviderAnalysisResult": {
    "ProviderTransactionId": "5131719190516173203009",
    "Status": "ACCEPT",
    "ProviderCode": "100",
    "ProviderRequestTransactionId": "AhjzbwSTFjDo9sLLoWZBEAFReTFX1NHtDuphyzhk0kv9Atj2YEFgc0RA",
    "AfsReply": {
        "reasonCode": "100",
        "afsResult": "99",
        "hostSeverity": "1",
        "consumerLocalTime": "11:31:59",
        "afsFactorCode": "F^P^Y^Z",
        "addressInfoCode": "MM-A^MM-Z^UNV-ADDR",
        "hotlistInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-SA^REV-IP^REV-SUSP",
        "suspiciousInfoCode": "RISK-TB^RISK-TS",
        "velocityInfoCode": "VEL-NAME",
        "scoreModelUsed": "default_lac"
    },
    "DecisionReply": {
        "casePriority": "3",
        "activeProfileReply": {},
        "velocityInfoCode": "GVEL-R2^GVEL-R3^GVEL-R6^GVEL-R7^GVEL-R8"
    }
  },
  "Links": [{
        "Method": "GET",
        "Href": "https://risksandbox.braspag.com.br/Analysis/v2/3671aafd-09e0-e711-80c2-000d3a70dd7b",
        "Rel": "Self"
  }],
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 15000,
  "TransactionAmount": 14000,
  "Currency": "BRL",
  "Provider": "Cybersource",
  "OrderDate": "2016-12-09 12:35:58.852",
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
  }
}
```

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`Id`|Id da transação no Antifraude Gateway Braspag|guid|
|`ProviderAnalysisResult.ProviderTransactionId`|Id da transação na Cybersource|string|
|`ProviderAnalysisResult.Status`|Status da transação no Antifraude Gateway Braspag após a análise - Tabela 1|enum|
|`ProviderAnalysisResult.ProviderCode`|Código de retorno da Cybersouce - Tabela 2|int|
|`ProviderAnalysisResult.ProviderRequestId`|Id do request da transação na Cybersource|string|
|`ProviderAnalysisResult.AfsReply.AddressInfoCode`|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador. Ex.: MM-A^MM-Z - Tabela 3|string|
|`ProviderAnalysisResult.AfsReply.AfsFactorCode`|Códigos que afetaram a pontuação da análise. Os códigos são concatenados usando o caractere ^. Ex.: F^P - Tabela 4|string|
|`ProviderAnalysisResult.AfsReply.AfsResult`|Score total calculado para o pedido|int|
|`ProviderAnalysisResult.AfsReply.BinCountry`|Código do país do BIN do cartão usado na análise. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|
|`ProviderAnalysisResult.AfsReply.CardAccountType`|Tipo do cartão do comprador - Tabela 5|string|
|`ProviderAnalysisResult.AfsReply.CardIssuer`|Nome do banco ou entidade emissora do cartão|string|
|`ProviderAnalysisResult.AfsReply.CardScheme`|Bandeira do cartão - Tabela 6|string|
|`ProviderAnalysisResult.AfsReply.ConsumerLocalTime`|Horário local do comprador, calculado a partir da data da solicitação e do endereço de cobrança|string|
|`ProviderAnalysisResult.AfsReply.HostSeverity`|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto|int|
|`ProviderAnalysisResult.AfsReply.HotListInfoCode`|Códigos que indicam que os dados do comprador estão associados em listas de positivas ou negativas. Ex.: NEG-AFCB^NEG-CC - Tabela 7|string|
|`ProviderAnalysisResult.AfsReply.IdentityInfoCode`|Códigos que indicam mudanças de identidade excessivas. Ex.: COR-BA^MM-BIN - Tabela 8|string|
|`ProviderAnalysisResult.AfsReply.InternetInfoCode`|Códigos que indicam problemas com o endereço de e-mail, o endereço IP ou o endereço de cobrança. Ex.: COR-BA^MM-BIN - Tabela 9|string|
|`ProviderAnalysisResult.AfsReply.IpCity`|Nome da cidade do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.IpCountry`|Nome do país do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.IpRoutingMethod`|Método de roteamento obtido a partir do endereço de IP para envio da transação - Tabela 10|string|
|`ProviderAnalysisResult.AfsReply.IpState`|Nome do estado do comprador obtido a partir do endereço de IP|string|
|`ProviderAnalysisResult.AfsReply.PhoneInfoCode`|Códigos que indicam um problema com o número de telefone do comprador. Ex.: UNV-AC^RISK-AC - Tabela 11|string|
|`ProviderAnalysisResult.AfsReply.ReasonCode`|Código do motivo retornado pela Cybersource - Tabela 2|int|
|`ProviderAnalysisResult.AfsReply.ScoreModelUsed`|Nome do modelo de score utilizado na análise. Caso não tenha nenhum modelo definido, o modelo padrão da Cybersource foi o utilizado|string|
|`ProviderAnalysisResult.AfsReply.SuspiciousInfoCode`|Códigos que indicam que o comprador forneceu potencialmente informações suspeitas. Ex.: RISK-TB^RISK-TS - Tabela 12|string|
|`ProviderAnalysisResult.AfsReply.VelocityInfoCode`|Códigos que indicam que o comprador tem uma alta frequência de compras. Ex.: VELV-SA^VELI-CC^VELSIP - Tabela 13|string|
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
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.DestinationQueue`|Quando modo verbose ativado, nome da fila para onde as transações não aceitas automaticamente são enviadas|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.Name`|Quando modo verbose ativado, nome do perfil selecionado na análise. Se não tiver nenhum, o perfil padrão foi selecionado|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.SelectedBy`|Quando modo verbose ativado, nome do seletor de regras que seleciona o perfil de regras|string|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].RuleId`|Quando modo verbose ativado, id da regra|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Decision`|Quando modo verbose ativado, decisão tomada pela regra - Tabela 14|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Evaluation`|Quando modo verbose ativado, avaliação da regra - Tabela 15|enum|
|`ProviderAnalysisResult.DecisionReply.ActiveProfileReply.RulesTriggered[n].Name`|Quando modo verbose ativado, nome da regra|string|
|`ProviderAnalysisResult.DecisionReply.CasePriority`|Define o nível de prioridade das regras ou perfis do lojista. O nível de prioridade varia de 1 (maior) a 5 (menor) e o valor padrão é 3, e este será atribuído caso não tenha definido a prioridade das regras ou perfis. Este campo somente será retornado se a loja for assinante do Enhanced Case Management|string|
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

``` shell
curl
--header "StatusCode: 400 Bad Request"
--header "Content-Type: application/json"
--data-binary
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
--verbose
}
```

### Response

|Parâmetro|Descrição
|`Message`|Mensagem informando que o request é inválido|
|`ModelState`|Coleção que conterá mensagens com os campos que não estejam de acordo com o tipo ou domínio conforme especificado no manual|
|`FraudAnalysisRequestError`|Coleção que conterá mensagens com os campos que não estejam de acordo com o tamanho especificado no manual|

### `GET`{:.http-get} Obtenção dos Detalhes da Análise

**PARÂMETROS:**  

``` csharp
Id: Guid  // Id da Transação no Antifraude

```

**REQUEST:**  

``` http
GET https://riskhomolog.braspag.com.br/Analysis/{Id} HTTP/1.1
Host: riskhomolog.braspag.com.br
Authorization: Bearer {access_token}
Content-Type: application/json
```

**RESPONSE:**  

* Quando a transação não for encontrada na base de dados.  

``` http
HTTP/1.1 404 Not Found
Content-Type: application/json;charset=UTF-8
```

* Quando a transação for encontrada na base de dados.

**REDSHIELD**

``` http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
```

``` json
{
  "Id": "22b5e829-edf1-e611-9414-0050569318a7",
  "AnalysisResult": {
    "Status": "Review",
    "Message": "Payment void and transaction challenged by ReD Shield",
    "ProviderCode": "100.400.148",
    "ProviderTransactionId": "487931363026",
    "ProviderRequestTransactionId": "8a8394865a353cc4015a37947c5f7e35"
  },
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 1500,
  "TransactionAmount": 1000,
  "Currency": "BRL",
  "Provider": "RedShield",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "SplitingPaymentMethod": "None",
  "IsRetryTransaction": false,
  "Card": {
    "Number" : "4000111231110112",
    "Holder": "Holder Name",
    "ExpirationDate": "12/2023",
    "Cvv": "999",
    "Brand": "VISA",
    "EciThreeDSecure": "5"
  },
  "Billing": {
    "Street": "Rua Neturno",
    "Number": "12345",
    "Complement": "Sala 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "20080123"
  },
  "Shipping": {
    "Street": "Rua Saturno",
    "Number": "30000",
    "Complement": "sl 123",
    "Neighborhood": "Centro",
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Country": "BR",
    "ZipCode": "123456789",
    "Email": "emailentrega@dominio.com.br",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silvao",
    "ShippingMethod": "SameDay",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Comment": "Em frente ao 322"
  },
  "Customer": {
    "MerchantCustomerId": "10050665740",
    "FirstName": "João",
    "MiddleName": "P",
    "LastName": "Silva",
    "BirthDate": "2016-12-09",
    "Gender": "Male",
    "Email": "emailcomprador@dominio.com.br",
    "Phone": "552121114700",
    "WorkPhone": "552121114721",
    "Mobile": "5521998765432",
    "Ip": "127.0.0.1",
    "BrowserFingerprint": "04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw==",
    "Status": "NEW"
  },
  "CartItems": [
    {
      "ProductName": "Mouse",
      "UnitPrice": "12000",
      "MerchantItemId": "4",
      "Sku": "abc123",
      "Quantity": 1,
      "OriginalPrice": "12000",
      "GiftMessage": "Te amo!",
      "Description": "Uma description do Mouse",
      "ShippingInstructions": "Proximo ao 546",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "123456"
    },
    {
      "ProductName": "Teclado",
      "UnitPrice": "96385",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "OriginalPrice": "96385",
      "GiftMessage": "Te odeio!",
      "Description": "Uma description do Teclado",
      "ShippingInstructions": "Proximo ao 123",
      "ShippingMethod": "SameDay",
      "ShippingTrackingNumber": "987654"
    }
  ],
  "CustomConfiguration": {
    "MerchantWebsite": "www.test.com"
  },
  "MerchantDefinedData": [
    {
      "Key": "USER_DATA4",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "Segment",
      "Value": "8999"
    },
    {
      "Key": "MerchantId",
      "Value": "Seller123456"
    }
  ]
}
```

**CYBERSOURCE**

``` http
HTTP/1.1 201 Created
Content-Type: application/json;charset=UTF-8
```

``` json
{
  "AnalysisResult": {
    "Id": "0c72cb49-985d-e711-93ff-000d3ac03bed",
    "Status": "Reject",
    "Score": "99",
    "ProviderCode": "481",
    "ProviderTransactionId": "4988294363046705503011",
    "SuspiciousCode": "RISK-SD",
    "ScoreModelUsed": "travel",
    "FactorCode": "F^I^P^Y^Z",
    "VelocityCodeDetail": "GVEL-R7^GVEL-R2^GVEL-R6",
    "CasePriority": "3"
  },
  "MerchantOrderId": "4493d42c-8732-4b13-aadc-b07e89732c26",
  "TotalOrderAmount": 1500,
  "TransactionAmount": 1000,
  "Currency": "BRL",
  "Provider": "Cybersource",
  "OrderDate": "2016-12-09 12:35:58.852",
  "BraspagTransactionId":"a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
  "Card": {
    "Number" : "4000111231110112",
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
      "UnitPrice": "12000",
      "Sku": "abc123",
      "Quantity": 1,
      "Risk":"Low",
      "Passenger": {
        "FirstName": "João",
        "LastName": "Silva",
        "PassengerId": "1",
        "Status": "NEW",
        "PassengerType": "Adult",
        "Email": "emailpassageiro@dominio.com.br",
        "Phone" : "552121114700",
        "DateOfBirth": "1982-04-30"
      },
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
      "UnitPrice": "96385",
      "MerchantItemId": "3",
      "Sku": "abc456",
      "Quantity": 1,
      "Risk": "High"
    }
  ],
  "MerchantDefinedData": [
    {
      "Key": "USER_DATA4",
      "Value": "Valor definido com o Provedor a ser enviado neste campo."
    },
    {
      "Key": "Segment",
      "Value": "8999"
    },
    {
      "Key": "MerchantId",
      "Value": "Seller123456"
    }
  ],
  "Travel": {
    "CompleteRoute": "GIG-CGH-EZE:EZE-CGH-GIG",
    "DepartueTime": "2016-12-10 11:31:00.000",
    "JourneyType": "OneWayTrip",
    "TravelLegs": [
      {
        "Origin": "GIG",
        "Destination": "CGH"
      },
      {
        "Origin": "CGH",
        "Destination": "EZE"
      }
    ]
  },
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
  }  
}
```

# Post de notificação de Mudança de Status

Esta página descreve o serviço de POST de Notificação, que envia uma notificação para a loja, caso haja alguma alteração de Status na Transação de revisão para aceita/rejeita.

Serviço que envia um **post de notificação** ao cliente caso haja alguma alteração de status

* É necessário solicitar ao Time de Implementação ([implantacao.operacoes@braspag.com.br](mailto:implantacao.operacoes@braspag.com.br)) o cadastramento da URL de mudança de status.
Quando estimulada pelo servidor da Braspag, enviando um POST, a URL cadastrada para receber a notificação da mudança de status da transação, deverá retornar o código HTTP 200 (OK), indicando que a mensagem foi recebida e processada com sucesso pelo servidor da loja.  

* Se a URL de mudança de status da loja for acessada pelo servidor da Braspag e não retornar o código de confirmação HTTP 200 (OK) ou ocorrer uma falha na conexão, serão realizadas mais 3 tentativas de envio.  

* A URL de mudança de status somente pode utilizar a porta 80 (padrão para http) ou a porta 443 (padrão para https). Recomendamos que a loja trabalhe sempre com SSL para esta URL, ou seja, sempre HTTPS.  

* Após a loja receber a notificação de mudança de status, deverá realizar um GET através da URL https://riskhomolog.braspag.com.br/Analysis/{Id}, enviando Id da transação que foi recebido na notficação da mudança de status.  
Para maior detalhes de como realizar o GET, consultar em Análise a sessão **Obtenção dos Detalhes da Análise**

![Notificação de Mudança de Status]({{ site.baseurl_root }}/images/braspag/af/postnotification.png)

## Hosts

**Test** https://riskhomolog.braspag.com.br  
**Live** https://risk.braspag.com.br

#### `POST`{:.http-post} Notificação de Mudança de Status

Abaixo exemplo de mensagem que o servidor da Braspag enviará à URL cadastrada, e como deve ser a resposta enviada em caso de sucesso.

**REQUEST:**  

``` http
POST https://urlcadastrada.loja.com.br/Notification/ HTTP/1.1
Host: urlcadastrada.loja.com.br
Content-Type: application/json
```

``` json
{  
   "Id":"9004ba26-f1f1-e611-9400-005056970d6f"
}
```

**RESPONSE:**  

``` http
HTTP/1.1 200 Ok
```

# Configuração do Fingerprint

Esta página descreve como funciona e como configurar o fingerprint em sua página de checkout e mobiles.

## ReDShield

## Integração com sua página de checkout(site)

## Como funciona?

![Fluxo]({{ site.baseurl_root }}/images/braspag/af/fingerprint.png)

1 - A página de checkout da loja envia os atributos do dispositivo do comprador para a Iovation, criando assim a *caixa preta*  
2 - O lojista recebe a sequência de caracteres criptografados da Iovation e escreve o mesmo na página de checkout em um campo do tipo *hidden*  
3 - O lojista envia para a Braspag, junto com os demais dados da transação a ser analisada, a *caixa preta*  
4 - A Braspag recebe todos os dados, valida e envia para a ReD Shield  
5 - A ReD Shield recebe todos os dados, envia a *caixa preta* para a Iovation descriptografar  
6 - A Red Shield recebe da Iovation os atributos do dispositivo do comprador

## Como configurar?

1 - Inclua o javascript da Iovation em sua página de checkout  
2 - Adicione parâmetros de configuração no javascript  
3 - Crie um campo do tipo *hidden* em sua página para escrever a *caixa preta* nele e enviá-lo junto com os dados da transação a ser analisada  

**Obs.:** Não realize cache do script, pois pode ocorrer de vários dispositovos sejam identificados como sendo o mesmo.

* Incluindo o javascript da Iovation  

    Para incluir o javascript, adicione o seguinte elemento `<script>` na sua página de checkout. Esta é a URL da versão do snare.js do ambiente de produção da Iovation.  
    **Exemplo:** `<script type="text/javascript" src="https://mpsnare.iesnare.com/snare.js"></script>`  

* Parâmetros de configuração

    **io_install_flash**{:.custom-attrib} `optional`{:.custom-tag} `bool`{:.custom-tag} `DefaultValue=false`{:.custom-tag}  
    Determina se será solicitado ao usuário a instalação do Flash ou atualização da versão.  

    **io_flash_needs_handler**{:.custom-attrib} `optional`{:.custom-tag}  
    Este parâmetro só terá validade se o parâmetro *io_install_flash* estiver configurado como TRUE, caso contrário não será executado.  
    É possível aqui customizar sua própria mensagem caso o Flash não esteja instalado.  
    Ex.: var io_flash_needs_handler = "Alert('Instalar Flash');"

    **io_install_stm**{:.custom-attrib} `optional`{:.custom-tag} `bool`{:.custom-tag} `DefaultValue=false`{:.custom-tag}  
    Determina se será solicitado ao usuário a instalação do Active X, que ajuda a coletar informações do hardware.  
    Este controle está disponível somente para o Internet Explorer, e caso o Active X já se encontre instalado, esta configuração não terá efeito.

    **io_exclude_stm**{:.custom-attrib} `optional`{:.custom-tag} `bitmask`{:.custom-tag}  `DefaultValue=15`{:.custom-tag}   
    Determina se o Active X deverá ser executado quando instalado. É possível optar por desativar o controle para plataformas específicas.  
    Possíveis valores:  
        0 - executa em todas as plataformas  
        1 - não executa no Windows 9.x (incluindo as versões 3.1, 95, 98 e ME)  
        2 - não executa no Windows CE  
        4 - não executa no Windows XP (incluindo as versões NT, 2000, 2003 e 8)  
        8 - não executa no Windows Vista  

    Obs.: Os valores são combinação de somas dos valores acima, por exemplo: 12 - não executa no Windows XP (4) ou no Windows Vista (8).

    **io_bbout_element_id**{:.custom-attrib} `optional`{:.custom-tag}  
    Id do elemento HTML para preencher com a *caixa preta*. Se o parâmetro *io_bb_callback* for definido, este não terá efeito.  

    **io_enable_rip**{:.custom-attrib} `optional`{:.custom-tag} `bool`{:.custom-tag} `DefaultValue=true`{:.custom-tag}  
    Determina se tentará coletar informações para obter o IP real do usuário.  

    **io_bb_callback**{:.custom-attrib} `optional`{:.custom-tag}  
    Parâmetro para customizar a checagem da coleta da *caixa preta* foi concluída.  
    Ao utilizar, escrever a função conforme com a seguinte sintaxe:  
    *io_callback(bb, complete)*, onde:  
        bb - valor da caixa preta  
        complete - valor booleano que indica que a coleta foi concluída  

    **IMPORTANTE!**  
    Os parâmetros de configuração devem ser colocados antes da chamada da tag acima. Eles determinam como javascript do iovation funcionará, e podem ocorrer erros
    caso os mesmos sejam colocados antes da chamada do javascript.

**Exemplo**  

``` xml

<html>
<head>
<script>
    var io_install_flash = false;
    var io_install_stm = false;
    var io_bbout_element_id = 'gatewayFingerprint';
</script>
</head>
<script type="text/javascript" src="https://mpsnare.iesnare.com/snare.js"></script>

<body>
    <form>
        <input type="hidden" name="gatewayFingerprint" id="gatewayFingerprint">
    </form>
</body>
</html>

```

## Integração em aplicativos mobile

**Visão Geral**  
Este tópico explica como integrar o mobile SDK da Iovation em seus aplicativos para iOS e Android.  

**Baixando o SDK**  
Se você ainda não baixou o SDK do iOS ou do Android, deve fazê-lo antes de continuar através do centro de ajuda da Iovation.  
[Download Mobile SDK](http://help.iovation.com/Downloads)

**Sobre a integração**  
Adicione o Iovation Mobile SDK aos seus aplicativos para coletar informações sobre os dispositivos dos usuários finais. Será gerada uma *caixa preta* que contém todas as informações do dispositivo disponíveis.

![Fluxo]({{ site.baseurl_root }}/images/braspag/af/fingerprintmobile.png){: .centerimg }{:title="Fluxo da coleta do fingerprint mobile"}  

* Integrando com aplicativos iOS  

Arquivos e requisitos de integração do iOS  
![Detalhes]({{ site.baseurl_root }}/images/braspag/af/fingerprintios1.png){: .left }{:title="Detalhes integração iOS"}  

Esta versão suporta iOS 5.1.1 ou superior nos seguintes dispositivos:  
        iPhone 3GS e posterior  
        iPod Touch 3ª geração ou posterior  
        Todos os iPads  

* Instalando o SDK no iOS  

    1 - Baixe e descompacte o SDK  
    2 - No Xcode, arraste *iovation.framework* na área de navegação do seu projeto  
![Detalhes]({{ site.baseurl_root }}/images/braspag/af/fingerprintios2.png){: .left }{:title="Detalhes instalação SDK"}  
    3 - Na caixa de diálogo que aparece:  
        Selecione *Copy items if needed* para copiar o framework para o diretório do projeto  
        Marque a caixa de seleção para os destinos nos quais você planeja usar o framework  
![Detalhes]({{ site.baseurl_root }}/images/braspag/af/fingerprintios3.png){: .left }{:title="Detalhes instalação SDK"}  
    4 - Clique em Finish  
    5 - Adicione os frameworks a seguir ao destino da aplicação no XCode:  
        - *ExternalAccessory.framework*. Se você verificar que o Wireless Accessory Configuration está ativado no Xcode 6 ou superior e não precisa, desativa e adicione novamente o ExternalAccessory.framework  
        - *CoreTelephony.framework*  
![Detalhes]({{ site.baseurl_root }}/images/braspag/af/fingerprintios4.png){: .left }{:title="Detalhes instalação SDK"}  
    6 - Opcionalmente, adicione esses frameworks se o seu aplicativo fizer uso deles:  
        - *AdSupport.framework*. Se o seu aplicativo exibe anúncios  
        Obs.: Não incluir se o seu aplicativo não utilizar anúncios, pois a App Store rejeita aplicativos que incluem o framework mas não usam anúncios  
        - *CoreLocation.framework*. Se o seu aplicativo usa monitoramento local  
        Obs.: Não incluir, a menos que seu aplicativo solicite permissão de geolocalização do usuário  

* Usando a função +ioBegin  

A função *+ioBegin* coleta informações sobre o dispositivo e gera uma *caixa preta*. Esta *caixa preta* deverá ser enviada através do campo *CustomerData.BrowserFingerPrint* em conjunto com os outros dados para análise.  

* Sintaxe  

> NSSstring * bbox = [iovation ioBegin]  

* Valores de retorno  

> bbox - string que contem a *caixa preta*  

**IMPORTANTE!**  
A *caixa preta* que retornou de *+ioBegin* nunca deve estar vazio. Uma *caixa preta* vazia indica que a proteção oferecida pelo sistema pode ter sido comprometida.  

* Exemplo  

``` html
#import "sampleViewController.h"
#import <iovation/iovation.h>
@implementation SampleViewController
@property (strong, nonatomic) UILabel *blackbox;
// Button press updates text field with blackbox value
- (IBAction)changeMessage:(id)sender
{
    self.blackbox.text = [iovation ioBegin];
}
@end

```

* Integrando com aplicativos Android  

Arquivos e requisitos de integração do Android  
![Detalhes]({{ site.baseurl_root }}/images/braspag/af/fingerprintandroid.png){: .left }{:title="Detalhes integração Android"}  

**NOTA**  
Se as permissões listadas não são necessárias pelo aplicativo, os valores obtidos obtidos utilizando essas permissões serão ignorados. As permissões não são necessárias para obter uma *caixa preta*, mas ajudam a obter mais informações do dispositivo.  

A versão 1.2.0 do Iovation Mobile SDK para Android suporta versões do Android 2.1 ou superior.  

* Instalando o SDK no Android  

    1 - Baixe e descompacte o deviceprint-lib-1.2.0.aar  
    2 - Inicie o IDE de sua escolha  
    3 - No Eclipse e Maven, faça o deploy do arquivo de extensão *.aar* no repositório Maven local, usando o maven-deploy.  
        Mais detalhes em: [Maven Guide](http://maven.apache.org/guides/mini/guide-3rd-party-jars-local.html)
    4 - No Android Studio, selecione *File -> New Module*. Expande *More Modules* e escolha *Import existing .jar or .aar package*
    5 - Selecione o arquivo deviceprint-lib-1.2.0.aar, e clique em *Finish*
    6 - Certifique-se de que o device-lib é uma dependência de compilação no arquivo build.gradle  
![Detalhes]({{ site.baseurl_root }}/images/braspag/af/fingerprintandroid1.png){: .left }{:title="Detalhes integração Android"}  

* Usando a função ioBegin  

A função *ioBegin* coleta informações sobre o dispositivo e gera uma *caixa preta*. Esta *caixa preta* deverá ser enviada através do campo *CustomerData.BrowserFingerPrint* em conjunto com os outros dados para análise.  

* Sintaxe  

> public static String ioBegin(Context context)

* Parâmetros

> context - uma instância da classe *android.content.Context* usado para acessar informações sobre o dispositivo

* Valores de retorno  

> string que contem a *caixa preta*  

**IMPORTANTE!**  
A *caixa preta* que retornou de *ioBegin* nunca deve estar vazio. Uma *caixa preta* vazia indica que contem apenas *0500* indica que a proteção oferecida pelo sistema pode ter sido comprometida.  

**IMPORTANTE!**  
O arquivo *device-lib-1.2.0.aar* deverá ser empacotado com o aplicativo.  

* Compilando o aplicativo de exemplo no Android Studio  

**IMPORTANTE!**  
Se a opção para executar o módulo não aparecer, selecione *File -> Project Structure* e abra o painel *Modules*. A partir disso, defina na lista a versão do Android SDK.

1 - Baixe e descompacte o deviceprint-lib-1.2.0.aar  
2 - No Android Studio, selecione *File -> Open* ou clique em *Open Project* através da opção *quick-start*  
3 - No diretório em que você descompactou o *deviceprint-lib-1.2.0.aar*, abra diretório *android-studio-sample-app* do aplicativo de exemplo  
4 - Abra o arquivo *DevicePrintSampleActivity*  
5 - Com algumas configurações, o Android Studio pode detectar um Android Framework no projeto e não configurá-lo. Neste caso, abra o *Event Log* e clique em *Configure*  
6 - Uma pop-up irá abrir para você selecionar o Android Framework. Clique em *OK* para corrigir os erros  
7 - No Android Studio, selecione *File -> New Module*. Expande *More Modules* e escolha *Import existing .jar or .aar package*  
8 - Selecione o arquivo deviceprint-lib-1.2.0.aar, e clique em *Finish*  
9 - Certifique-se de que o device-lib é uma dependência de compilação no arquivo build.gradle  
![Detalhes]({{ site.baseurl_root }}/images/braspag/af/fingerprintandroid1.png){: .left }{:title="Detalhes integração Android"}  
10 - Abra a pasta DevicePrintSampleActivity  
11 - Na opção de navegação do projeto, abra *src/main/java/com/iovation/mobile/android/sample/DevicePrintSampleActivity.java*  
12 - Clique com o botão direito e selecione *Run DevicePrintSampleAct*  
13 - Selecione um dispositivo físico conectado ou um Android virtual para executar o aplicativo  
14 - O aplicativo irá compilar e executar  

* Exemplo  

O exemplo a seguir é simples, onde o mesmo possui um botão e ao clicar uma caixa de texto é preenchida com a *caixa preta*. Para obter um exemplo mais rico, consulte o aplicativo de exemplo do Android Studio incluído no SDK.  

``` html
package com.iovation.mobile.android.sample;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import com.iovation.mobile.android.DevicePrint;
public class DevicePrintSampleActivity extends Activity
{
    /**
    * Called when the activity is first created.
    * @param savedInstanceState If the activity is being re-initialized after
    * previously being shut down then this Bundle contains the data it most
    * recently supplied in onSaveInstanceState(Bundle). <b>Note: Otherwise it is null.</b>
    */

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
    }

    public void printDevice(View target)
    {
        String bb = DevicePrint.ioBegin(getApplicationContext());
        TextView bbResult = (TextView) findViewById(R.id.bbResult);
        bbResult.setText(bb);
        bbResult.setVisibility(View.VISIBLE);
    }
}

```

## Cybersource

Será necessário adicionar uma imagem de 1-pixel, que não é mostrada na tela, e 2 segmentos de código à tag *<body>* da sua página de checkout, se certificando que serão necessários de 10 segundos entre a execução do código e a submissão da página para o servidor.  

**IMPORTANTE!**  
Se os 3 segmentos de código não forem colocados na página de checkout, os resultados podem não ser precisos.  

**Colocando os segmentos de código e substituindo os valores das variáveis**  

Coloque os segmentos de código imediatamente acima da tag *</body>* para garantir que a página Web será renderizada corretamente. Nunca adicione os segmentos de código em elementos HTML visíveis. Os segmentos de código precisam ser carregados antes que o comprador finalize o pedido de compra, caso contrário um erro será gerado.  

Em cada segmento abaixo, substitua as variáveis com os valores referentes a loja e número do pedido.  

* Domain:  
    Testing - Use h.online-metrix.net, que é o DNS do servidor de fingerprint, como apresentado no exemplo de HTML abaixo.  
    Production - Altere o domínio para uma URL local, e configure seu servidor Web para redirecionar esta URL para h.online-metrix.net.  

**ProviderOrgId** - Para obter este valor, entre em contato com a Braspag.  
**ProviderMerchantId** - Para obter este valor, entre em contato com a Braspag.  
**ProviderSessionId** - Prencha este campo com o mesmo valor do campo **MerchantOrderId** que será enviado na requisição da análise de fraude.  

* PNG Image  

``` html

<html>
<head></head>
<body>
    <form>
        <p style="background:url(https://h.online-metrix.net/fp/clear.png?org_id=ProviderOrgId&amp;session_id=ProviderMerchantIdProviderSessionId&amp;m=1)"></p>  
        <img src="https://h.online-metrix.net/fp/clear.png?org_id=ProviderOrgId&amp;session_id=ProviderMerchantIdProviderSessionId&amp;m=2" alt="">  
    </form>
</body>
</html>

```

* Flash Code  

``` html

<html>
<head></head>
<body>
    <form>
        <object type="application/x-shockwave-flash" data="https://h.online-metrix.net/fp/fp.swf?org_id=ProviderOrgId&amp;session_id=ProviderMerchantIdProviderSessionId" width="1" height="1" id="thm_fp">
            <param name="movie" value="https://h.online-metrix.net/fp/fp.swf?org_id=ProviderOrgId&amp;session_id=ProviderMerchantIdProviderSessionId" />
            <div></div>
        </object>
    </form>
</body>
</html>

```

* Javascript Code

``` html
<html>
<head></head>
<script src="https://h.online-metrix.net/fp/check.js?org_id=ProviderOrgId&amp;session_id=ProviderMerchantIdProviderSessionId" type="text/javascript"></script>
<body></body>
</html>
```

**IMPORTANTE!**  
Certifique-se de copiar todos os dados corretamente e de ter substituído as variáveis corretamente pelos respectivos valores.  

**Configurando seu Servidor Web**  

Na seção *Colocando os segmentos de código e substituindo os valores das variáveis (Domain)*, todos os objetos se referem a h.online-metrix.net, que é o DNS do servidor de fingerprint. Quando você estiver pronto para produção, você deve alterar o nome do servidor para uma URL local, e configurar no seu servidor Web um redirecionamento de URL para h.online-metrix.net.  

**IMPORTANTE!**  
Se você não completar essa seção, você não receberá resultados corretos, e o domínio (URL) do fornecedor de fingerprint ficará visível, sendo mais provável que seu consumidor o bloqueie.

# Retroalimentação de Chargeback

Esta página descreve como enviar para a Braspag as transações que já foram analisadas e sofreram chargeback pelos clientes. Essas informações são usadas para rastrear fraudes e a ACI / ReD Shield poder recomendar regras para evitar ataques de fraude subsequentes.

Serviço para enviar as transações para a Braspag que já foram analisadas e sofreram chargeback pelos clientes. Essas informações são usadas para rastrear fraudes e a
ACI / ReD Shield poder recomendar regras para evitar ataques de fraude subsequentes.

Obs.: O serviço aceita requisição POST com no máximo 100 itens na coleção.

## Hosts

**Test** https://riskhomolog.braspag.com.br  
**Live** https://risk.braspag.com.br

## Atributos

**Id**{:.custom-attrib}  `required`{:.custom-tag} `Guid`{:.custom-tag}  
Identificador da transação no Antifraude Gateway.

**BraspagTransactionId**{:.custom-attrib}  `optional`{:.custom-tag} `Guid`{:.custom-tag}  
Identificador da transação no Pagador.

**ChargebackAmount**{:.custom-attrib} `required`{:.custom-tag} `long`{:.custom-tag}  
Valor do chargeback.  
Ex.: 150000 (Valor equivalente a R$1.500,00)

**ChargebackDate**{:.custom-attrib} `required`{:.custom-tag} `date`{:.custom-tag}  
Data da confirmação do chargeback.  
Ex.: 2017-12-02

**ChargebackReasonCode**{:.custom-attrib} `required`{:.custom-tag} `5`{:.custom-tag} `string`{:.custom-tag}  
Código do motivo do chargeback.

**IsFraud**{:.custom-attrib} `required`{:.custom-tag} `bool`{:.custom-tag}  
Flag para identificar se o chargeback foi motivado por fraude ou não

## Operações HTTP

`POST`{:.http-post} [https://riskhomolog.braspag.com.br/Chargeback/]
Retroalimentação de chargeback  

#### `POST`{:.http-post} Retroalimentação de chargeback

**REQUEST:**  

``` html
POST https://riskhomolog.braspag.com.br/Chargeback/ HTTP/1.1
Host: {antifraude endpoint}
Authorization: Bearer {access_token}
Content-Type: application/json

```

``` json
{
    "Chargebacks":
    [
        {
            "Id" : "fb647240-824f-e711-93ff-000d3ac03bed",
            "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
            "ChargebackAmount" : "1000",
            "ChargebackDate" : "2017-12-02",
            "ChargebackReasonCode" : "1",
            "IsFraud" : "false"
        },
        {
            "Id": "9004ba26-f1f1-e611-9400-005056970d6f",
            "ChargebackAmount": "27580",
            "ChargebackDate": "2017-12-02",
            "ChargebackReasonCode": "54",
            "IsFraud": "true"
        },
        {
            "Id": "4493d42c-8732-4b13-aadc-b07e89732c26",
            "ChargebackAmount": "59960",
            "ChargebackDate": "2017-12-02",
            "ChargebackReasonCode": "54",
            "IsFraud": "true"
        },
        {
            "Id": "22b5e829-edf1-e611-9414-0050569318a7",
            "ChargebackAmount": "150000",
            "ChargebackDate": "2017-12-02",
            "ChargebackReasonCode": "54",
            "IsFraud": "true"
        }
    ]
}
```

**RESPONSE:**  

Quando todas as transações de chargeback enviadas forem processadas com sucesso

``` http

HTTP/1.1 200 Ok

```

Quando não ocorrer o processamento de todas as transações de chargeback enviadas, será retornado o identificador das transações com motivo através do campo "ChargebackProcessingStatus".  

    * Motivo igual a "Success", a transação de chargeback foi processada com sucesso.  
    * Motivo igual a "AlreadyExist", a transação de chargeback já está associada a transação original de análise de fraude.  
    * Motivo igual a "Remand", a transação de chargeback deverá ser reenviada.  
    * Motivo igual a "NotFound", a transação de chargeback não deverá ser reenviada, pois a origem desta vinculada a análise de fraude não foi encontrada na base de dados.  

``` http

HTTP/1.1 300 Multiple Choices

```

``` json
{
    "Chargebacks":
    [
         {
            "Id" : "fb647240-824f-e711-93ff-000d3ac03bed",
            "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b",
            "ChargebackAmount" : "1000",
            "ChargebackDate" : "2017-12-02",
            "ChargebackReasonCode" : "1",
            "IsFraud" : "false",
            "ChargebackProcessingStatus": "Success"
        },
        {
            "Id": "9004ba26-f1f1-e611-9400-005056970d6f",
            "ChargebackAmount": "27580",
            "ChargebackDate": "2017-12-02",
            "ChargebackReasonCode": "54",
            "IsFraud": "true",
            "ChargebackProcessingStatus": "AlreadyExist"
        },
        {
            "Id": "4493d42c-8732-4b13-aadc-b07e89732c26",
            "ChargebackAmount": "59960",
            "ChargebackDate": "2017-12-02",
            "ChargebackReasonCode": "54",
            "IsFraud": "true",
            "ChargebackProcessingStatus": "Remand"
        },
        {
            "Id": "22b5e829-edf1-e611-9414-0050569318a7",
            "ChargebackAmount": "150000",
            "ChargebackDate": "2017-12-02",
            "ChargebackReasonCode": "54",
            "IsFraud": "true",
            "ChargebackProcessingStatus": "NotFound"
        }
    ]
}
```

# Associar transação Pagador e Antifraude

Esta página descreve como associar transações do Pagador Braspag à transações do Antifraude Gateway Braspag.

Serviço que associa uma transação do Pagador Braspag à uma transação do Antifraude Gateway Braspag.

**O cliente deverá realizar esta chamada quando o mesmo estiver utilizando o fluxo abaixo:**

1 - Realiza a análise de fraude
2 - Realiza a autorização
3 - O 3º passo deverá ser a chamada ao a este serviço para associar a transação do Pagador à transação do Antifraude Gateway.

## Hosts

**Test** https://riskhomolog.braspag.com.br  
**Live** https://risk.braspag.com.br

## Atributos

**BraspagTransactionId**{:.custom-attrib}  `required`{:.custom-tag} `Guid`{:.custom-tag}  
Id da transação no Pagador da Braspag.  
Ex.: a3e08eb2-2144-4e41-85d4-61f1befc7a3b

## Operação HTTP

`PATCH`{:.http-patch} [https://riskhomolog.braspag.com.br/Transaction/{Id}]
Associa a transação do Pagador à transação do Antifraude Gateway

#### `PATCH`{:.http-patch} Associa a transação do Pagador à transação do Antifraude Gateway

**PARÂMETROS:**  

``` csharp
Id: Guid  // Id da Transação no Antifraude Gateway
```

**REQUEST:**  

``` http
GET https://riskhomolog.braspag.com.br/Transaction/{Id} HTTP/1.1
Host: riskhomolog.braspag.com.br
Authorization: Bearer {access_token}
Content-Type: application/json

```

``` json
{
    "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b"
}
```

**RESPONSE:**  

Quando a transação do Pagador for associada corretamente com a transação do Antifraude Gateway

``` http

HTTP/1.1 200 Ok

```

Quando a transação do Pagador não for informada na requisição

``` http
HTTP/1.1 400 Bad Request

```

Quando a transação do Antifraude Gateway não for encontrada na base de dados

``` http
HTTP/1.1 404 Not found

```

Quando a transação do Pagador já estiver associada a outra transação do Antifraude Gateway

``` http
HTTP/1.1 409 Conflict

```

# Update de Status

Serviço para alterar o status de transações em revisão (review) para aceita (accept) ou rejeita (reject), disponível somente para o provedor Cybersource.  

## Hosts

**Test** https://riskhomolog.braspag.com.br  
**Live** https://risk.braspag.com.br

## Atributos

**Status**{:.custom-attrib} `required`{:.custom-tag} `Guid`{:.custom-tag} `Cybersource`{:.custom-provider-cyber}  
Novo status da transação.  
Enum: Accept | Reject  

**Comments**{:.custom-attrib} `optional`{:.custom-tag} `255`{:.custom-tag}.`string`{:.custom-tag} `Cybersource`{:.custom-provider-cyber}  
Comentário associado a mudança de status.  

## Operação HTTP

`PATCH`{:.http-patch} [https://riskhomolog.braspag.com.br/Analysis/{Id}]
Altera o status da transação

#### `PATCH`{:.http-patch} Altera o status da transação

**PARÂMETROS:**  

``` http
Id: Guid  // Id da Transação no Antifraude Gateway
```

**REQUEST:**  

``` http
GET https://riskhomolog.braspag.com.br/Transaction/{Id} HTTP/1.1
Host: riskhomolog.braspag.com.br
Authorization: Bearer {access_token}
Content-Type: application/json
```

``` json
{
    "Status":"Accept",
    "Comments":"Transação aceita após contato com o cliente."
}
```

**RESPONSE:**  

Quando a transação for recebida para processamento.

``` http
HTTP/1.1 200 OK
```

``` json
{
    "Message": "Change status request successfully received. New status: Accept."
}
```

Quando a transação não for encontrada na base de dados.

``` http
HTTP/1.1 404 Not found
```

``` json
{
    "Message": "The transaction does not exist."
}
```

Quando a transação não estiver elegivel para alteração de status.

``` http
HTTP/1.1 400 Bad Request
```

``` json
{
    "Message": "The transaction is not able to update status. Actual status: Reject."
}
```

Quando o novo status enviado for diferente de Accept ou Reject.

``` http
HTTP/1.1 400 Bad Request
```

``` json
{
    "Message": "The new status is invalid to update transaction. Accepted status are: 'Accept' or 'Reject'."
}
```

Quando o tipo ou tamanho de algum campo não for enviado conforme especificado no manual.

``` http
HTTP/1.1 400 Bad Request
```

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
