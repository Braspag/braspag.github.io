---
layout: manual
title: Autorização com Autenticação
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
sort_order: 5
tags:
  - 5. EMV 3DS (3DS 2.0)
language_tabs:
  json: JSON
  shell: cURL
  
---

# Autorização com Autenticação

Após a autenticação do emissor do cartão ser concluída, submete-se a transação ao processo de autorização, enviando os dados de autenticação no modelo de "autenticação externa" (nó `ExternalAuthentication`).
Este procedimento é válido também para estabelecimentos que realizaram a autenticação fora da Cielo (MPI Externo).

Para maiores detalhes sobre o processo de autenticação 3DS 2.0, [acesse o manual da solução](https://braspag.github.io//manualp/emv3ds){:target="_blank"}.

Veja abaixo um exemplo de envio de dados de autenticação da requisição de autorização da API Pagador, utilizando o método POST:

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales</span></aside>

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":
   {  
     (...)
   },
   "Payment":
   {  
     (...)
     "Provider":"Cielo30",
     "Authenticate":true,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{  
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
       "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
       "Eci":"5",
       "Version":"2",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
     }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--header "MerchantKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--data-binary
--verbose
{  
   "MerchantOrderId":"2017051002",
   "Customer":
   {  
     (...)
   },
   "Payment":
   {  
     (...)
     "Provider":"Cielo30",
     "Authenticate":true,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{  
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
       "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
       "Eci":"5",
       "Version":"2",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"
     }
   }
}
```

| Campo | Descrição | Tipo/Tamanho | Obrigatório |
| --- | --- | --- | --- |
|`Payment.Provider`| Nome do provedor do meio de pagamento: Cielo30, Getnet ou Rede. | Texto / 15 | Sim. |
|`Payment.Authenticate`| Define se o comprador será direcionado ao emissor para autenticação do cartão. | Booleano ("true" / "false") | Sim, caso a autenticação seja validada.|
|`Payment.ExternalAuthentication.ReturnUrl`| URL de retorno aplicável somente se a versão for "1". | Alfanumérico / 1024 posições | Sim. |
|`Payment.ExternalAuthentication.Cavv`| Assinatura retornada nos cenários de sucesso na autenticação. | Texto | Sim, caso a autenticação seja validada. |
|`Payment.ExternalAuthentication.Xid`| XID retornado no processo de autenticação. | Texto | Sim, quando a versão do 3DS for "1".|
|`Payment.ExternalAuthentication.Eci`| *Electronic Commerce Indicator* retornado no processo de autenticação. | Numérico / 1 posição | Sim. |
|`Payment.ExternalAuthentication.Version`| Versão do 3DS utilizado no processo de autenticação. | Alfanumérico / 1 posição | Sim, quando a versão do 3DS for "2".|
|`Payment.ExternalAuthentication.ReferenceID`| RequestID retornado no processo de autenticação. | GUID / 36 posições | Sim, quando a versão do 3DS for "2". |

### Response

Consulte o [Manual do Pagador](https://braspag.github.io//manual/braspag-pagador#autenticando-uma-transa%C3%A7%C3%A3o){:target="_blank"} para exemplos detalhados de response de autorização com autenticação.

# Autorização para Transações Data Only

Após ter sido realizada a etapa de autenticação no modelo Data Only (enviando-se o campo `bpmpi_auth_notifyonly` como "true") submete-se a transação ao processo de autorização, enviando-se os dados de autenticação no modelo de "autenticação externa" (nó `ExternalAuthentication`).

Veja abaixo um exemplo de envio de dados de autenticação da requisição de autorização da API Pagador, utilizando o método POST:

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales</span></aside>

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":
   {  
     (...)
   },
   "Payment":
   {  
     (...)
     "Authenticate":false,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{  
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Eci":"4",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6",
       "dataonly":true
     }
   }
}
```

```shell
--request POST "https://apisandbox.cieloecommerce.cielo.com.br/1/sales"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--header "MerchantKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--data-binary
--verbose
{  
   "MerchantOrderId":"2017051002",
   "Customer":
   {  
     (...)
   },
   "Payment":
   {  
     (...)
     "Authenticate":false,
     "ReturnUrl":"http://www.loja.com.br",
     "CreditCard":{  
         "CardNumber":"4000000000001000",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false"
     },
     "ExternalAuthentication":{
       "Eci":"4",
       "ReferenceID":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6",
       "dataonly":true
     }
   }
}
```

| **Campo** | **Descrição** | **Tipo/Tamanho** | **Obrigatório** |
| --- | --- | --- | --- |
|`Payment.Authenticate`| Define se o comprador será direcionado ao emissor para autenticação do cartão.| Booleano ("true" / "false") | Sim. No caso de transação *Data Only*, é obrigatório enviar como "false". |
|`Payment.ExternalAuthentication.Eci`| *E-Commerce Indicator* retornado no processo de autenticação. | Numérico [1 posição] | Sim. |
|`Payment.ExternalAuthentication.ReferenceId`| RequestID retornado no processo de autenticação. | GUID [36 posições] | Sim. |
|`Payment.ExternalAuthentication.DataOnly`| Define se é uma transação *Data Only*. |Booleano ("true" / "false")| Sim. No caso de transação *Data Only*, é obrigatório enviar como "true".|

### Response

Consulte o [Manual do Pagador](https://braspag.github.io//manual/braspag-pagador#autenticando-uma-transa%C3%A7%C3%A3o){:target="_blank"} para exemplos detalhados de response de autorização com autenticação.

# Tabela de ECI

O ECI (Electronic Commerce Indicator) é um código retornado pelas bandeiras e indica o resultado da autenticação 3DS do portador do cartão junto ao emissor ou bandeira. Confira na tabela a seguir os ECIs correspondentes à cada bandeira e o resultado da autenticação.

> Posteriormente, o valor do ECI deverá ser enviado na requisição da transação no campo `Payment.ExternalAuthentication.Eci`

|Mastercard                 |Visa                |Elo                  |Amex                |Resultado da autenticação|A transação foi autenticada?|
|---------------------------|--------------------|---------------------|--------------------|-------------------------|--------------------------|
| 02                        |05                  |05                   |05                  |Autenticada pelo emissor – risco de chargeback passa a ser do emissor.|Sim|
| 01                        |06                  |06                   |06                  |Autenticada pela bandeira – risco de chargeback passa a ser do emissor.|Sim|
| Diferente de 01, 02 e 04  |Diferente de 05 e 06|Diferente de 05 e 06 |Diferente de 05 e 06|Não autenticada – risco de chargeback permanece com o estabelecimento.|Não|
| 04                        |-                   |-                    |-                   |Não autenticada, transação caracterizada como *Data Only* – risco de chargeback permanece com o estabelecimento.|Não|
