---
layout: manual
title: Split de Pagamentos - Antifraude
description: Integração técnica com a Plataforma Antifraude
search: true
toc_footers: false
categories: manual
sort_order: 7
hub_visible: false
tags:
---

# Split de Pagamentos - Antifraude

O Split de Pagamentos é composto por uma plataforma antifraude cujo objetivo é minimizar as fraudes e as ocorrências de chargebacks nos estabelecimentos que o utilizam.

No modelo de negócio do Split, todo chargeback é repassado ao Marketplace, que pode ou não repassá-lo para os seus subordinados. Portanto, é de suma importância que a plataforma de antifraude esteja corretamente integrada e configurada.

A plataforma de antifraude conta com duas importantes ferramentas:

**Velocity** - Analisa a transação através de regras de velocidade. Ex: 5 Hits de Cartão em 2 horas.

**Antifraude** - Analisa a transação utilizando algoritmos de inteligência artificial.

## Fluxo transacional

A integração com as ferramentas de antifraude se dá através do próprio fluxo transacional, na mesma requisição para criar uma transação, não sendo necessário realizar um nova requisição a um outro serviço. 

## Integrando o Velocity

Para que a análise de velocidade seja efetuada em tempo transacional, é necessário complementar a requisição com novos dados.

Se a análise de fraude recomendar **Rejeitar** a transação, o fluxo transacional é interrompido e na resposta retornarão os seguites campos:

**Payment.Status**: 0 - Transação Não Finalizada.

**Payment.ReturnCode**: BP171 - Código de retorno identificando que a transação foi interrompida por recomendação do Velocity devido a suspeita de fraude.
        
**Payment.ReturnMessage**: Rejected by fraud risk (velocity) - Código de retorno identificando que a transação foi interrompida por recomendação do Velocity devido a suspeita de fraude.

## Requisição

```json
{  
   "MerchantOrderId":"2014111701",
   "Customer":{  
      "Name":"Comprador Teste",
      "Identity":"11225468954",
      "IdentityType":"CPF",
      "Email":"compradorteste@teste.com",
      "IpAddress":"222.237.207.155",
      "Address":{  
         "Street":"Rua Teste",
         "Number":"123",
         "Complement":"AP 123",
         "District":"BairroXYZ",
         "ZipCode":"12345987",
         "City":"Rio de Janeiro",
         "State":"RJ",
         "Country":"BRA"
      },
      "DeliveryAddress":{  
         "Street":"Rua Teste",
         "Number":"123",
         "Complement":"AP 123",
         "District":"BairroXYZ",
         "ZipCode":"12345987",
         "City":"Rio de Janeiro",
         "State":"RJ",
         "Country":"BRA"
      }
   },
   "Payment":{  
      "Type":"SplittedCreditCard",
      "Amount":15700,
      "Provider":"Simulado",
      "Installments":1,
      "Capture":false,
      "SoftDescriptor":"SOFTTESTE",
      "CreditCard":{  
         "CardNumber":"4024007197692931",
         "Holder":"Teste Holder",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      }
   }
}
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido|
|`Customer.Name`|Texto|255|Sim|Nome do comprador|
|`Customer.Identity`|Texto |14 |Sim|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Sim|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Email`|Texto|255|Sim|Email do comprador|
|`Customer.IpAddress`|Texto|255|Sim|Ip do comprador|
|`Customer.Address.Street`|Texto|255|Não|Endereço de contato do comprador|
|`Customer.Address.Number`|Texto|15|Não|Número endereço de contato do comprador|
|`Customer.Address.Complement`|Texto|50|Não|Complemento do endereço de contato do Comprador|
|`Customer.Address.ZipCode`|Texto|9|Sim|CEP do endereço de contato do comprador|
|`Customer.Address.City`|Texto|50|Não|Cidade do endereço de contato do comprador|
|`Customer.Address.State`|Texto|2|Não|Estado do endereço de contato do comprador|
|`Customer.Address.Country`|Texto|35|Não|Pais do endereço de contato do comprador|
|`Customer.Address.District`|Texto |50 |Não|Bairro do Comprador. |
|`Customer.DeliveryAddress.Street`|Texto|255|Não|Endereço do comprador|
|`Customer.DeliveryAddress.Number`|Texto|15|Não|Número do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Complement`|Texto|50|Não|Complemento do endereço de entrega do pedido|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Sim|CEP do endereço de entrega do pedido|
|`Customer.DeliveryAddress.City`|Texto|50|Não|Cidade do endereço de entrega do pedido|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Country`|Texto|35|Não|Pais do endereço de entrega do pedido|
|`Customer.DeliveryAddress.District`|Texto |50 |Não|Bairro do Comprador. |
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento (Simulado ou Cielo)|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento (SplittedCreditCard)|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (deve ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|

## Resposta

```json
{
    "MerchantOrderId": "2014111701",
    "Customer": {
        "Name": "Comprador Teste",
        "Identity": "11225468954",
        "IdentityType": "CPF",
        "Email": "compradorteste@teste.com",
        "Address": {
            "Street": "Rua Teste",
            "Number": "123",
            "Complement": "AP 123",
            "ZipCode": "12345987",
            "City": "Rio de Janeiro",
            "State": "RJ",
            "Country": "BRA",
            "District": "BairroXYZ"
        },
        "DeliveryAddress": {
            "Street": "Rua Teste",
            "Number": "123",
            "Complement": "AP 123",
            "ZipCode": "12345987",
            "City": "Rio de Janeiro",
            "State": "RJ",
            "Country": "BRA",
            "District": "BairroXYZ"
        },
        "IpAddress": "222.237.207.155"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "402400******2931",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "SoftDescriptor": "SOFTTESTE",
        "Provider": "Simulado",
        "VelocityAnalysis": {
            "Id": "b02c8c4a-a32c-4c37-bf6a-10f80d2be5f6",
            "ResultMessage": "Reject",
            "Score": 100,
            "RejectReasons": [
                {
                    "RuleId": 38,
                    "Message": "Bloqueado pela regra CardNumber. Name: Máximo de 5 Hits de Número do Cartão em 12 hora(s). HitsQuantity: 5. HitsTimeRangeInSeconds: 43200. ExpirationBlockTimeInSeconds: 86400"
                }
            ]
        },
        "Amount": 15700,
        "Status": 0,
        "IsSplitted": true,
        "ReturnMessage": "Rejected by fraud risk (velocity)",
        "ReturnCode": "BP171",
        "PaymentId": "b02c8c4a-a32c-4c37-bf6a-10f80d2be5f6",
        "Type": "CreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquery.cieloecommerce.cielo.com.br/1/sales/b02c8c4a-a32c-4c37-bf6a-10f80d2be5f6"
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`VelocityAnalysis.Id`|Identificador da análise efetuada|GUID|36|
|`VelocityAnalysis.ResultMessage`|Accept ou Reject|Texto|25|
|`VelocityAnalysis.Score`|100|Número|10|
|`VelocityAnalysis.RejectReasons[].RuleId`|Código da Regra que rejeitou|Número|10|
|`VelocityAnalysis.RejectReasons[].Message`|Descrição da Regra que rejeitou|Texto|512|

## Integrando o Antifraude

Para que a *análise de fraude* seja efetuada em tempo de transação, é necessário complementar a mensagem com os dados mencionados no nó "FraudAnalysis".

### Requisição

> Na análise de AF, os padrões de siglas para países utilizados nos campos `Country` devem seguir o modelo da ISO 3166-1 ALPHA 2 - https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

``` json
{
   "MerchantOrderId":"2014111457673454307",
   "Customer":{
      "Name":"Comprador Teste",
      "Identity":"10050665740",
      "IdentityType":"CPF",
      "Email":"compradorteste@live.com",
      "Birthdate":"1991-01-02",
      "Phone":"552121114740",
      "WorkPhone":"552121114740",
      "Mobile":"552121114740",
      "Address": {
         "Street": "Rua Neturno",
         "Number": "12345",
         "Complement": "Sala 123",
         "District": "Centro",
         "City": "Rio de Janeiro",
         "State": "RJ",
         "Country": "BR",
         "ZipCode": "20080123"
      },
      "DeliveryAddress":{
         "Street": "Rua Saturno",
         "Number": "30000",
         "Complement": "sl 123",
         "Neighborhood": "Centro",
         "City": "Rio de Janeiro",
         "State": "RJ",
         "Country": "BR",
         "ZipCode": "123456789"
      },
      "BillingAddress": {
         "Street": "Rua Neturno",
         "Number": "12345",
         "Complement": "Sala 123",
         "District": "Centro",
         "City": "Rio de Janeiro",
         "State": "RJ",
         "Country": "BR",
         "ZipCode": "20080123"
      },
      "Status":"NEW"
   },
   "Payment":{
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Provider":"Simulado",
      "ServiceTaxAmount":0,
      "Installments":1,
      "SoftDescriptor":"123456789ABCD",
      "Interest":"ByMerchant",
      "Capture":false,
      "Authenticate":false,
      "CreditCard":{
         "CardNumber":"6011000000000111",
         "Holder":"Teste accept",
         "ExpirationDate":"12/2019",
         "SecurityCode":"023",
         "Brand":"Discover",
         "EciThreeDSecure":"05"
      },
      "FraudAnalysis":{
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"RedShield",
         "CaptureOnLowRisk":true,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":"150000",
         "OrderDate":"2016-12-09",
         "IsRetryTransaction":false,
         "SplitingPaymentMethod":"SINGLE-PAY",
         "Browser":{
            "IpAddress":"187.32.163.105",
            "BrowserFingerPrint":"04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw=="
         },
         "Cart":{
            "Items":[
               {
                  "ProductName": "Celuclar XYZ",
                  "UnitPrice": "6500",
                  "MerchantItemId": "4",
                  "Sku": "abc123",
                  "Quantity": 1,
                  "OriginalPrice": "7000",
                  "Description": "Celuclar XYZ, Wi-Fi, 4G, Câmera 8MP",
                  "ShippingInstructions": "Fragil",
                  "ShippingMethod": "SameDay",
                  "ShippingTrackingNumber": "123456"
               },
               {
                  "ProductName": "TV XPTO Full HD",
                  "UnitPrice": "4000",
                  "MerchantItemId": "5",
                  "Sku": "abc456",
                  "Quantity": 1,
                  "OriginalPrice": "500",
                  "Description": "TV Full HD, 8 Entradas HDMI, Smart TV",
                  "ShippingInstructions": "Televissao - Cuidado",
                  "ShippingMethod": "SameDay",
                  "ShippingTrackingNumber": "987654"
               }
            ]
         },
         "MerchantDefinedFields":[
            {
               "Id":95,
               "Value":"Eu defini isso"
            },
            {
               "Id":96,
               "Value":"Outra informação"
            }
         ],
         "Shipping":{
            "Addressee":"Sr Comprador Teste",
            "Email":"rschueler@braspag.com.br",
            "Method":"LowCost",
            "Phone":"552121114740",
            "WorkPhone":"552121114705",
            "Mobile":"5521987654321",
            "Comment":"Em frente a mesa 80"
         },
      }
   }
}
```

```shell

curl
--header "Content-Type: application/json"
--header "Authorization: Bearer {token}"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId":"2014111457673454307",
   "Customer":{
      "Name":"Comprador Teste",
      "Identity":"10050665740",
      "IdentityType":"CPF",
      "Email":"compradorteste@live.com",
      "Birthdate":"1991-01-02",
      "Phone":"552121114740",
      "WorkPhone":"552121114740",
      "Mobile":"552121114740",
      "Address": {
         "Street": "Rua Neturno",
         "Number": "12345",
         "Complement": "Sala 123",
         "District": "Centro",
         "City": "Rio de Janeiro",
         "State": "RJ",
         "Country": "BR",
         "ZipCode": "20080123"
      },
      "DeliveryAddress":{
         "Street": "Rua Saturno",
         "Number": "30000",
         "Complement": "sl 123",
         "Neighborhood": "Centro",
         "City": "Rio de Janeiro",
         "State": "RJ",
         "Country": "BR",
         "ZipCode": "123456789"
      },
      "BillingAddress": {
         "Street": "Rua Neturno",
         "Number": "12345",
         "Complement": "Sala 123",
         "District": "Centro",
         "City": "Rio de Janeiro",
         "State": "RJ",
         "Country": "BR",
         "ZipCode": "20080123"
      },
      "Status":"NEW"
   },
   "Payment":{
      "Type":"CreditCard",
      "Amount":100,
      "Currency":"BRL",
      "Country":"BRA",
      "Provider":"Simulado",
      "ServiceTaxAmount":0,
      "Installments":1,
      "SoftDescriptor":"123456789ABCD",
      "Interest":"ByMerchant",
      "Capture":false,
      "Authenticate":false,
      "CreditCard":{
         "CardNumber":"6011000000000111",
         "Holder":"Teste accept",
         "ExpirationDate":"12/2019",
         "SecurityCode":"023",
         "Brand":"Discover",
         "EciThreeDSecure":"05"
      },
      "FraudAnalysis":{
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"Onsuccess",
         "Provider":"RedShield",
         "CaptureOnLowRisk":true,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":"150000",
         "OrderDate":"2016-12-09",
         "IsRetryTransaction":false,
         "SplitingPaymentMethod":"SINGLE-PAY",
         "Browser":{
            "IpAddress":"187.32.163.105",
            "BrowserFingerPrint":"04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw=="
         },
         "Cart":{
            "Items":[
               {
                  "ProductName": "Celuclar XYZ",
                  "UnitPrice": "6500",
                  "MerchantItemId": "4",
                  "Sku": "abc123",
                  "Quantity": 1,
                  "OriginalPrice": "7000",
                  "Description": "Celuclar XYZ, Wi-Fi, 4G, Câmera 8MP",
                  "GiftMessage": "Te Amo!",
                  "ShippingInstructions": "Mesa 51",
                  "ShippingMethod": "SameDay",
                  "ShippingTrackingNumber": "123456"
               },
               {
                  "ProductName": "TV XPTO Full HD",
                  "UnitPrice": "4000",
                  "MerchantItemId": "5",
                  "Sku": "abc456",
                  "Quantity": 1,
                  "OriginalPrice": "500",
                  "Description": "TV Full HD, 8 Entradas HDMI, Smart TV",
                  "ShippingInstructions": "Televisao - Cuidado",
                  "ShippingMethod": "SameDay",
                  "ShippingTrackingNumber": "987654"
               }
            ]
         },
         "MerchantDefinedFields":[
            {
               "Id":95,
               "Value":"Eu defini isso"
            },
            {
               "Id":96,
               "Value":"Outra informação"
            }
         ],
         "Shipping":{
            "Addressee":"Sr Comprador Teste",
            "Email":"rschueler@braspag.com.br",
            "Method":"LowCost",
            "Phone":"552121114740",
            "WorkPhone":"552121114705",
            "Mobile":"5521987654321",
            "Comment":"Em frente a mesa 80"
         }
      }
   }
}
--verbose

```

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`MerchantOrderId`|Texto|50|Sim|Número de identificação do pedido|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Customer`|-|-|-|Nó contendo os dados do cliente|
|`Customer.Name`|Texto|61|Sim|Nome do comprador|
|`Customer.Identity`|Texto|18|Sim|Número de documento do comprador. CPF ou CNPJ|
|`Customer.IdentityType`|Texto|4|Sim|Tipo de documento de identificação do comprador. CPF ou CNPJ|
|`Customer.Email`|Texto|60|Sim|E-mail do comprador|
|`Customer.Phone`|Texto|15|Não|Telefone do comprador <br/> Ex.: 552121114700|
|`Customer.WorkPhone`|Texto|15|Não|Telefone de trabalho do comprador <br/> Ex.: 552121114700|
|`Customer.Mobile`|Texto|15|Não|Telefone celular do comprador <br/> Ex.: 5521987654321|
|`Customer.Birthdate`|Date|10|Não|Data de nascimento do comprador <br/> Ex.: 1983-10-01|
|`Customer.Status`|Texto|8|Não|Status de cadastro do comprador na loja <br >NEW - Comprador novo efetuando a primeira compra <br/> EXISTING - Comprador existente|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Customer.Address`|-|-|-|Nó contendo dados do endereço do comprador|
|`Customer.Address.Street`|Texto|24|Sim|Endereço do comprador|
|`Customer.Address.Number`|Texto|5|Sim|Número do endereço do comprador|
|`Customer.Address.Complement`|Texto|14|Não|Complemento do endereço do comprador|
|`Customer.Address.District`|Texto|15|Sim|Distrito ou Bairro do endereço do comprador|
|`Customer.Address.ZipCode`|Texto|9|Sim|CEP do endereço do comprador|
|`Customer.Address.City`|Texto|20|Sim|Cidade do endereço do comprador|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço do comprador|
|`Customer.Address.Country`|Texto|2|Sim|País do endereço do comprador|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Customer.DeliveryAddress`|-|-|-|Nó contendo dados do endereço de entrega do comprador|
|`Customer.DeliveryAddress.Street`|Texto|24|Não|Endereço de entrega do comprador|
|`Customer.DeliveryAddress.Number`|Texto|5|Não|Número do endereço de entrega do comprador|
|`Customer.DeliveryAddress.Complement`|Texto|14|Não|Complemento do endereço de entrega do comprador|
|`Customer.DeliveryAddress.District`|Texto|15|Não|Distrito ou Bairro do endereço de entrega do comprador|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não|CEP do endereço de entrega do comprador|
|`Customer.DeliveryAddress.City`|Texto|20|Não|Cidade do endereço de entrega do comprador|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega do comprador|
|`Customer.DeliveryAddress.Country`|Texto|2|Não|País do endereço de entrega do comprador|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Customer.BillingAddress`|-|-|-|Nó contendo dados do endereço de cobrança do comprador|
|`Customer.BillingAddress.Street`|Texto|24|Sim|Endereço de cobrança do comprador|
|`Customer.BillingAddress.Number`|Texto|5|Sim|Número do endereço de cobrança do comprador|
|`Customer.BillingAddress.Complement`|Texto|14|Não|Complemento do endereço de cobrança do comprador|
|`Customer.BillingAddress.District`|Texto|15|Sim|Distrito ou Bairro do endereço de cobrança do comprador|
|`Customer.BillingAddress.ZipCode`|Texto|9|Sim|CEP do endereço de cobrança do comprador|
|`Customer.BillingAddress.City`|Texto|20|Sim|Cidade do endereço de cobrança do comprador|
|`Customer.BillingAddress.State`|Texto|2|Sim|Estado do endereço de cobrança do comprador|
|`Customer.BillingAddress.Country`|Texto|2|Sim|País do endereço de cobrança do comprador|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment`|-|-|Sim|Nó contendo as informações de pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento <br/> Possíveis Valores: CreditCard / DebitCard / EletronicTransfer / Boleto|
|`Payment.Amount`|Número|15|Sim|Valor do pedido em centavos <br/> Ex.: r$ 1.559,85 = 155985|
|`Payment.Currency`|Texto|3|Não|Moeda na qual o pagamento será realizado <br/> Valor default: BRL|
|`Payment.Country`|Text|3|Não|País no qual o pagamento será realizado <br/> Valor default: BR|
|`Payment.Provider`|Texto|15|Sim|Nome do meio de pagamento <br/> Obs.: Não obrigatório para cartão de crédito|
|`Payment.ServiceTaxAmount`|Número|15|Não|Exclusivo para companhias aéreas - Montante do valor da autorização que deve ser destinado à taxa de serviço <br/> Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Installments`|Número|2|Sim|Número de parcelas do pedido|
|`Payment.Interest`|Texto|10|Não|Tipo de parcelamento <br/> Pela loja = ByMerchant (valor default) <br/> Pelo cartão = ByIssuer|
|`Payment.SoftDescriptor`|Texto|13|Sim|Texto que será impresso na fatura do cartão de crédito do portador <br/> Disponível apenas para VISA / MASTER <br/> Não permite caracteres
especiais|
|`Payment.Capture`|Booleano|-|Não|Define se a autorização deve ser capturada automaticamente <br/> Valor default: false|
|`Payment.Authenticate`|Booleano|-|Não|Define se o comprador será direcionado ao Banco emissor para autenticação do cartão <br/> Valor default: false|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment.CreditCard`|-|-|Sim|Nó contendo as informações do cartão|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão do comprador|
|`Payment.CreditCard.Holder`|Texto|50|Sim|Nome do comprador impresso no cartão|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`Payment.CreditCard.SaveCard`|Booleano|-|Não|Identifica se o cartão será salvo para gerar o CardToken <br/> Valor default: false|
|`Payment.CreditCard.Brand`|Texto|10|Sim|Bandeira do cartão <br/> Possíveis valores: Visa / Master / Amex / Elo / Aura / JCB / Diners / Discover|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment.FraudAnalysis`|-|-|-|Nó contendo as informações para Análise de Fraude|
|`Payment.FraudAnalysis.Provider`|Texto|12|Sim|Identifica o provedor da solução de análise de fraude <br/> Possíveis valores: CyberSource (default) / RedShield|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|-|Não|Captura a transação se a análise de fraude retornar "Accept" <br/> Valor default: false|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Booleano|-|Não|Cancela a transação se a análise de fraude retornar "Reject" <br/> Valor default: false|
|`Payment.TotalOrderAmount`|Número|15|Não|Valor total do pedido em centavos, podendo ser diferente do valor da transação <br/> Ex.: Valor do pedido sem a taxa de entrega|
|`Payment.OrderDate`|Date|-|Não|Data do pedido <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Obs.: Caso não seja informada, uma data será gerada pela Braspag|
|`Payment.FraudAnalysis.IsRetryTransaction`|Booleano|-|Não|Indica se é uma retentativa de análise de fraude|
|`Payment.FraudAnalysis.SplitingPaymentMethod`|Texto|-|Não|Indica se o pagamento esta sendo dividido. Ex: Pagamento com dois cartões <br/> Possíveis valores: SINGLE-PAY e SPLIT-PAY|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment.FraudAnalysis.Browser.BrowserFingerPrint`|Texto|6010|Sim|Impressão digital de dispositivos e geolocalização real do IP do comprador <br/> [Configuração do Fingerprint](https://braspag.github.io/manual/antifraude#redshield)

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment.FraudAnalysis.Cart`|-|-|-|Nó contendo as informações do carrinho para análise de fraude|
|`Payment.FraudAnalysis.Cart.Items[].Name`|Texto|50|Não|Nome do produto|
|`Payment.FraudAnalysis.Cart.Items[].Sku`|Texto|12|Não|Sku do produto|
|`Payment.FraudAnalysis.Cart.Items[].MerchantItemId`|Texto|30|Não|ID do produto na loja|
|`Payment.FraudAnalysis.Cart.Items[].UnitPrice`|Número|15|Não|Preço unitário do produto em centavos <br/> Ex.: r$ 1.559,85 = 155985|
|`Payment.FraudAnalysis.Cart.Items[].OriginalPrice`|Número|15|Não|Preço original do produto em centavos <br/> Ex.: r$ 1.559,85 = 155985|
|`Payment.FraudAnalysis.Cart.Items[].Quantity`|Número|-|Não|Quantidade do produto|
|`Payment.FraudAnalysis.Cart.Items[].GiftMessage`|Texto|160|Não|Mensagem de presente|
|`Payment.FraudAnalysis.Cart.Items[].Description`|Texto|76|Não|Descrição do produto|
|`Payment.FraudAnalysis.Cart.Items[].ShippingInstructions`|Texto|160|Não|Instruções para entrega do item do carrinho|
|`Payment.FraudAnalysis.Cart.Items[].ShippingMethod`|Texto|-|Não|Método de entrega do item do carrinho <br/> Possíveis valores: <br/> ReDShield: None / SameDay / NextDay / TwoDay / ThreeDay / LowCost / CarrierDesignatedByCustomer / Pickup / International / Military / Other <br/> CyberSource: None / SameDay / OneDay / TwoDay / ThreeDay / LowCost / Pickup / Other|
|`Payment.FraudAnalysis.Cart.Items[].ShippingTrackingNumber`|Texto|19|Não|Número de rastreamento da entrega do item do carrinho|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment.FraudAnalysis.MerchantDefinedFields[]`|-|-|-|Nó contendo dados adicionais para análise de fraude|
|`Payment.FraudAnalysis.MerchantDefinedFields[].Id`|Número|-|Não|Identificador de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.MerchantDefinedFields[].Value`|Texto|255|Não|Valor de uma informação adicional a ser enviada|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment.FraudAnalysis.CustomConfiguration.MerchantWebsite`|Texto|60|Não|Endereço website da loja|

|CAMPOS|TIPO|TAMANHO|OBRIGATÓRIO|DESCRIÇÃO|
|:-|:-|:-|:-|:-|
|`Payment.FraudAnalysis.Shipping`|-|-|-|Nó contendo informações adicionais da entrega do pedido para análise de fraude|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|61|Não|Nome e sobrenome do destinatário|
|`Payment.FraudAnalysis.Shipping.Email`|Texto|60|Não|E-mail do destinatário|
|`Payment.FraudAnalysis.Shipping.Phone`|Texto|19|Não|Telefone do destinatário|
|`Payment.FraudAnalysis.Shipping.WorkPhone`|Texto|19|Não|Telefone de trabalho do destinatário|
|`Payment.FraudAnalysis.Shipping.Mobile`|Texto|19|Não|Celular do destinatário|
|`Payment.FraudAnalysis.Shipping.Comment`|Texto|160|Não|Referência do endereço de entrega do destinatário|
|`Payment.FraudAnalysis.ShippingMethod`|Texto|-|Não|Método de entrega do pedido <br/> Possíveis valores: <br/> RedShield = None / SameDay / NextDay / TwoDay / ThreeDay / LowCost / CarrierDesignatedByCustomer / Pickup / International / Military / Other <br/> CyberSource = None / SameDay / OneDay / TwoDay / ThreeDay / LowCost / Pickup / Other / Opcional|

### Resposta

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId":"2014111457673454307",
   "Customer":{
      "Name":"Comprador Teste",
      "Identity":"13987441747",
      "IdentityType":"CPF",
      "Email":"compradorteste@live.com",
      "Birthdate":"1991-01-02",
      "Phone":"21114740",
      "WorkPhone":"21114740",
      "Mobile":"21114740",
      "Address":{
         "Street":"Rua Júpter",
         "Number":"174",
         "Complement":"AP 201",
         "District":"Centro",
         "ZipCode":"21241140",
         "City":"Rio de Janeiro",
         "State":"RJ",
         "Country":"BRASIL"
      },
      "DeliveryAddress":{
         "Street":"Rua Júpter",
         "Number":"174",
         "Complement":"AP 201",
         "District":"Centro",
         "ZipCode":"21241140",
         "City":"Rio de Janeiro",
         "State":"RJ",
         "Country":"BR"
      },
      "BillingAddress":{
         "Street":"Rua Júpter",
         "Number":"174",
         "Complement":"AP 201",
         "ZipCode":"21241140",
         "City":"Rio de Janeiro",
         "State":"RJ",
         "Country":"BR",
         "Neighborhood":"Centro"
      },
      "Status":"NEW"
   },
   "Payment":{
      "Type":"CreditCard",
      "Amount":100,
      "Currency":"BRL",
      "Country":"BRA",
      "Provider":"Simulado",
      "ServiceTaxAmount":0,
      "Installments":1,
      "SoftDescriptor":"123456789ABCD",
      "Interest":"ByMerchant",
      "Capture":false,
      "Authenticate":false,
      "CreditCard":{
         "CardNumber":"6011000000000111",
         "Holder":"Teste accept",
         "ExpirationDate":"12/2019",
         "SecurityCode":"023",
         "Brand":"Discover",
         "EciThreeDSecure":"05"
      },
      "FraudAnalysis":{
         "Id": "236bd8b5-8e15-e711-93fe-000d3ac03bed",
         "Status": 2,
         "StatusDescription": "Reject",
         "ReplyData": {
             "FactorCode": "100.400.147",
             "ReturnMessage": "Payment void and transaction denied by ReD Shield",
             "ProviderTransactionId": "958567039650"
         }
         
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"RedShield",
         "CaptureOnLowRisk":true,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":"150000",
         "OrderDate":"2016-12-09",
         "IsRetryTransaction":false,
         "SplitingPaymentMethod":"SINGLE-PAY",
         "Browser":{
            "IpAddress":"187.32.163.105",
            "BrowserFingerPrint":"04003hQUMXGB0poNf94lis1ztuLYRFk+zJ17aP79a9O8mWOBmEnKs6ziAo94ggAtBvKEN6/FI8Vv2QMAyHLnc295s0Nn8akZzRJtHwsEilYx1P+NzuNQnyK6+7x2OpjJZkl4NlfPt7h9d96X/miNlYT65UIY2PeH7sUAh9vKxMn1nlPu2MJCSi12NBBoiZbfxP1Whlz5wlRFwWJi0FRulruXQQGCQaJkXU7GWWZGI8Ypycnf7F299GIR12G/cdkIMFbm6Yf0/pTJUUz1vNp0X2Zw8QydKgnOIDKXq4HnEqNOos1c6njJgQh/4vXJiqy0MXMQOThNipDmXv9I185O+yC2f3lLEO0Tay66NZEyiLNePemJKSIdwO9O5ZtntuUkG6NTqARuHStXXfwp8cyGF4MPWLuvNvEfRkJupBy3Z8hSEMEK7ZWd2T2HOihQxRh4qp+NANqYKBTl3v6fQJAEKikeSQVeBN8sQqAL0BZFaIMzbrnMivi6m6JRQUIdvEt+MbJEPFc0LjRycC5ApUmJO+Aoo9VKL1B8ftMSQ1iq1uTKn16ZOmDpzZrZhMPbH83aV0rfB2GDXcjpghm9klVFOw7EoYzV7IDBIIRtgqG9KZ+8NH/z6D+YNUMLEUuK1N2ddqKbS5cKs2hplVRjwSv7x8lMXWE7VDaOZWB8+sD1cMLQtEUC0znzxZ4bpRaiSy4dJLxuJpQYAFUrDlfSKRv/eHV3QiboXLuw9Lm6xVBK8ZvpD5d5olGQdc+NgsqjFnAHZUE+OENgY4kVU9wB84+POrI4MkoD4iHJ5a1QF8AZkZDFo1m1h9Bl+J2Ohr6MkBZq8DG5iVaunHfxUdHou5GL7lS1H7r+8ctfDXi8AfOPjzqyODJQ74Aiel35TKTOWG8pq1WO6yzJ1GNmMuMWZBamlGXoG/imnjwHY9HQtQzpGfcm0cR8X2Fd1ngNFGLDGZlWOX0jWtOwU6XVGT37JFD9W/cx4kzI+mPNi65X5WFPYlDG9N0Lbh5nOj3u3DXqRCiKCUrsEkMt8z9fxO9pLLGVQUKIYR2wTw53CiWK96FOpPevDWtH2XR0QkfOd02D73n81x6hEMCy0s3hRLn08Th9FlNHDMJBqLj+Tz8rG2TtNki3mJC7Ass1MT2qnKBI77n6vsQkAp59TfbZm/tBXwAoYdLJXge8F/numhd5AvQ+6I8ZHGJfdN3qWndvJ2I7s5Aeuzb8t9//eNsm73fIa05XreFsNyfOq1vG2COftC6EEsoJWe5h5Nwu1x6PIKuCaWxLY+npfWgM0dwJPmSgPx7TNM31LyVNS65m83pQ+qMTRH6GRVfg7HAcS5fnS/cjdbgHxEkRmgkRq1Qs48sbX9QC8nOTD0ntb6FcJyEOEOVzmJtDqimkzDq+SXR1/63AYe4LEj+ogRgN+Z8HAFhGFzd/m6snVviELfRqJ4LLQIk9Y/fzqnsF6I5OGxfdT2sxxK2Vokpi3jWhCcEknw7dYlHYpOnCHZO7QVgjQTngF2mzKf4GeOF4ECFsWTgLy6HFEitfauYJt1Xh1NfZZerBMwXLFzdhzoTQxGlcXc8lZIoEG1BLYv/ScICf8Ft9PEtpEa+j0cDSlU99UoH2xknwR1W9MRGc5I/euE63/IMJTqguZ3YcnJpjSVnAGSpyz/0gKjypJ3L86rHFRGXt0QbmaXtSl2UmmjI0p0LCCdx7McatCFEVI6FwPpPV0ZSMv/jM75eBid1X/lTV4XNzjowzR/iFlKYMzHZtVO9hCBPKlTwblRXNn4MlvNm/XeSRQ+Mr0YV5w5CL5Z/tGyzqnaLPj/kOVdyfj8r2m5Bcrz4g/ieUIo8qRFv2T2mET46ydqaxi27G4ZYHj7hbiaIqTOxWaE07qMCkJw=="
         },
         "Cart":{
            "Items":[
               {
                  "ProductName": "Celuclar XYZ",
                  "UnitPrice": "6500",
                  "MerchantItemId": "4",
                  "Sku": "abc123",
                  "Quantity": 1,
                  "OriginalPrice": "7000",
                  "Description": "Celuclar XYZ, Wi-Fi, 4G, Câmera 8MP",
                  "ShippingInstructions": "Mesa 51",
                  "ShippingMethod": "SameDay",
                  "ShippingTrackingNumber": "123456"
               },
               {
                  "ProductName": "TV XPTO Full HD",
                  "UnitPrice": "4000",
                  "MerchantItemId": "5",
                  "Sku": "abc456",
                  "Quantity": 1,
                  "OriginalPrice": "500",
                  "Description": "TV Full HD, 8 Entradas HDMI, Smart TV",
                  "ShippingInstructions": "Televisao - Cuidado",
                  "ShippingMethod": "SameDay",
                  "ShippingTrackingNumber": "987654"
               }
            ]
         },
         "MerchantDefinedFields":[
            {
               "Id":95,
               "Value":"Eu defini isso"
            },
            {
               "Id":96,
               "Value":"Outra informação"
            }
         ],
         "Shipping":{
            "Addressee":"Sr Comprador Teste",
            "Email":"rschueler@braspag.com.br",
            "Method":"LowCost",
            "Phone":"552121114740",
            "WorkPhone":"552121114705",
            "Mobile":"5521987654321",
            "Comment":"Em frente a mesa 80"
         }
      }
   }
}

```

> **Payment.FraudAnalysis** - Nó contendo as informações da Análise de Fraude

|CAMPOS|TIPO|DESCRIÇÃO|
|:-|:-|:-|
|`Payment.FraudAnalysis.Id`|Guid|-|Id da Transação no Antifraude|
|`Payment.FraudAnalysis.Status`|Número|"Status da Análise de Fraude. Possíveis valores: <br/> 0 - Unknown <br/> 1 - Accept  <br/> 2 - Reject <br/> 3 - Review<br/> 4 - Aborted <br/> 5 - Error|
|`Payment.FraudAnalysis.StatusDescription`|Texto|Descrição do status da Análise de Fraude. Possíveis valores: <br/> 0 - Unknown <br/> 1 - Accept <br/> 2 - Reject <br/> 3 - Review  <br/> 4 - Aborted <br/> 5 - Error|

> **Payment.FraudAnalysis.ReplyData** - Nó contendo as informações detalhadas da Análise de Fraude

|CAMPOS|TIPO|DESCRIÇÃO|
|:-|:-|:-|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Texto|Código retornado do provider indicando o faotres que influenciaram na Análise de Fraude|
|`Payment.FraudAnalysis.ReplyData.ReturnMessage`|Texto|Descrição do código retornado pelo provider|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Texto|Identificador da transação no provedor Antifraude|
