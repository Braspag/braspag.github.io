---
layout: manual
title: 3. Autorização com Autenticação
description: Integração técnica Gateway Braspag
search: true
translated: true
categories: manual
tags:
  - Autenticação 3DS 2.0
language_tabs:
  json: JSON
  shell: cURL
---

# Autorização com Autenticação

Após autenticação ser concluída, submete-se ao processo de autorização, enviando os dados de autenticação no modelo de &quot;autenticação externa&quot; (nó **ExternalAuthentication** ).
Este procedimento é válido também para estabelecimentos que realizaram a autenticação fora da Cielo (MPI Externo).

Para maiores detalhes sobre o processo de autenticação 3DS 2.0, acesse:[https://braspag.github.io/manualp/emv3ds#o-que-%C3%A9-3ds-2.0?](https://braspag.github.io/manualp/emv3ds#o-que-%C3%A9-3ds-2.0?)

Veja exemplo abaixo, descrito o envio dos dados de autenticação da requisição de autorização da API Pagador:

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales</span></aside>

### Request

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
curl
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

| **Campo** | **Descrição** | **Tipo/Tamanho** | **Obrigatório** |
| --- | --- | --- | --- |
| Payment.Authenticate | Booleano que define se o comprador será direcionado ao Banco emissor para autenticação do cartão | Booleano (true ou false) | Sim, quando a autenticação foi um sucesso |
| Payment.ExternalAuthentication.ReturnUrl | URL de Retorno aplicável somente se a versão for &quot;1&quot; | Alfanumérico [1024 posições] | Sim |
| Payment.ExternalAuthentication.Cavv | Assinatura que é retornada nos cenários de sucesso na autenticação | Alfanumérico [28 posições] | Sim, quando a autenticação foi um sucesso |
| Payment.ExternalAuthentication.Xid | XID retornado no processo de autenticação | Alfanumérico [28 posições] | Sim, quando a versão do 3DS for &quot;1&quot; |
| Payment.ExternalAuthentication.Eci | E-Commerce Indicator retornado no processo de autenticação | Numérico [1 posição] | Sim |
| Payment.ExternalAuthentication.Version | Versão do 3DS utilizado no processo de autenticação | Alfanumérico [1 posição] | Sim, quando a versão do 3DS for &quot;2&quot; |
| Payment.ExternalAuthentication.ReferenceID | RequestID retornado no processo de autenticação | GUID [36 posições] | Sim, quando a versão do 3DS for &quot;2&quot; |

### Response

Vide https://braspag.github.io/manual/braspag-pagador
