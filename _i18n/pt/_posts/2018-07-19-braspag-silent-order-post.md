---
layout: manual
title: Manual de Integração - Silent Order Post
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manualp
sort_order: 2
tags:
  - 1. Pagador
language_tabs:
  shell: cURL
  json: JSON
  
---

# Silent Order Post

Esta é uma integração que a Braspag oferece aos lojistas com o intuito de oferecer maior segurança e controle sobre a experiência de checkout.<br/>O **Silent Order Post** é ideal para a empresa que não possui estrutura para cumprir todos os requisitos de segurança do PCI DSS no uso de cartões de crédito; ou, também, para o lojista que prefira concentrar seus esforços em outros elementos do negócio.

Este método possibilita o envio de dados do pagamento do seu cliente de forma segura, diretamente em nosso sistema. Os dados do pagamento, tais como número do cartão e data de validade, são armazenados no ambiente da Braspag, que conta com a certificação PCI DSS 3.2.

Por permitir total personalização na página de checkout da loja, essa solução é ideal para lojistas que exigem um alto grau de segurança, sem perder a identidade de sua página.

# Principais Benefícios

* **Captura direta**: a captura dos dados do pagamento é feita diretamente para os sistemas da Braspag por um script, através dos campos definidos no seu checkout.
* **Total compatibilidade**: a solução é compatível com todos os meios de pagamento disponibilizados no Gateway Pagador (Nacional e Internacional).
* **Certificação PCI DSS 3.2**: a certificação garante total conformidade com as normas da indústria de cartões, reduzindo o escopo de PCI DSS.
* **Checkout personalizado**: a personalização oferece controle total sobre a experiência de checkout, mantendo o *look & feel* de sua marca.

# Fluxo Transacional

![Fluxo Silent Order Post]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans7-pt.png)

# Integrando a Solução

## 1. Obtendo o AccessToken OAuth2

Quando o comprador acessa o checkout, o estabelecimento deve gerar o `AccessToken` a partir da API de autenticação da Braspag (**OAuth2**). Em caso de sucesso, a API retornará um `AccessToken` que deverá ser utilizado na próxima camada de autenticação da ferramenta.

Para obter o `AccessToken` no padrão [OAuth 2.0](https://oauth.net/2/), realize um envio de requisição utilizando o VERBO HTTP **POST** para a seguinte URL, formada pela "URL base do ambiente + endpoint", no modelo server-to-server:

|Ambiente | URL base + endpoint | Authorization |
|---|---|---|
| **SANDBOX** | https://authsandbox.braspag.com.br/oauth2/token | "Basic *{base64}*"|
| **PRODUÇÃO** | https://auth.braspag.com.br/oauth2/token |"Basic *{base64}*"|

**Nota:** O valor "_{base64}_" para a autorização do tipo "Basic" deve ser obtido da seguinte forma:

1. Concatene o "ClientId" e o "ClientSecret" (`ClientId:ClientSecret`). 
2. Codifique o resultado da concatenação em base64.
3. Realize uma requisição ao servidor de autorização utilizando o código alfanumérico gerado.

Solicite à equipe de suporte a criação do "ClientID" e do "ClientSecret" de sua loja para utilização nos ambientes SANDBOX e de PRODUÇÃO.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

``` shell
--request POST "https://authsandbox.braspag.com.br/oauth2/token"
--header "Authorization: Basic {base64}"
--header "Content-Type: application/x-www-form-urlencoded" 
--data-binary "grant_type=client_credentials"
```

|Parâmetros|Formato|Envio|
|---|---|---|
|`Authorization`|"Basic *{base64}*"|Envio no header.|
|`Content-Type`|"application/x-www-form-urlencoded"|Envio no header.|
|`grant_type`|"client_credentials"|Envio no body.|

### Resposta

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

```shell
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

|Propriedades da Resposta|Descrição|
|---|---|
|`access_token`|O token de autenticação solicitado. Ele será utilizado no próximo passo.|
|`token_type`|Indica o valor do tipo de token.|
|`expires_in`|Expiração do token de acesso, em segundos. Quando o token expira, é necessário obter um novo.|

## 2. Obtendo AccessToken SOP

Após a obtenção do AccessToken OAuth2, o estabelecimento deverá realiza um envio de requisição utilizando o VERBO HTTP **POST** para a seguinte URL:

| Ambiente | URL base + endpoint|
| --- | --- |
| Sandbox | https://transactionsandbox.pagador.com.br/post/api/public/v2/accesstoken|
| Produção | https://transaction.pagador.com.br/post/api/public/v2/accesstoken|

### Requisição

```shell
--request POST "https://transactionsandbox.pagador.com.br/post/api/public/v2/accesstoken"
--header "Content-Type: application/json"
--header "MerchantId: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
--header "Authorization: Bearer faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`mid`|Identificador da loja no Pagador.|GUID |36 |Sim|
|`Authorization`|Bearer [AccessToken OAuth2]|Texto |36 |Sim|

### Resposta

Como resposta, o estabelecimento receberá um json ("HTTP 201 Created") contendo, entre outras informações, o token (AccessToken SOP).

```json
{
    "MerchantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2021-05-05T08:50:04",
    "ExpiresIn": "2021-05-05T09:10:04"
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2021-05-05T08:50:04",
    "ExpiresIn": "2021-05-05T09:10:04"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`MerchantId`|Identificador da loja no Pagador. |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`AccessToken`|Token de acesso (AccessToken SOP). Por questões de segurança, este token dará permissão para o estabelecimento salvar apenas 1 cartão dentro de um prazo já estipulado na resposta, através do atributo *ExpiresIn* (por padrão, 20 minutos). O que acontecer primeiro invalidará esse mesmo token para impedir um uso futuro.|Texto|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Data e hora da geração. |Texto|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Data e hora da expiração. |Texto|--|AAAA-MM-DDTHH:MM:SS|

<aside class="warning">Para consultar sobre o processo legado de autenticação, com geração do `AccessToken` utilizando MerchantID e IP do comprador, [clique aqui](#anexo).</aside>

## 3. Implementando o Script

### Mapeando Classes

O estabelecimento deverá fazer o [download do script](https://www.pagador.com.br/post/scripts/silentorderpost-1.0.min.js) disponibilizado pela Braspag e anexá-lo à sua página de checkout. Esse script permitirá à Braspag processar todas as informações de cartão sem intervenção do estabelecimento.

O estabelecimento deverá parametrizar os elementos de formulário com as seguintes classes:

|Propriedade|Nome da Classe|
|-----------|---------|
|Nome do portador do cartão de crédito/débito|"bp-sop-cardholdername" |
|Número do cartão de crédito/débito|"bp-sop-cardnumber" |
|Data de validade do cartão de crédito/débito|"bp-sop-cardexpirationdate" |
|Código de segurança do cartão de crédito/débito|"bp-sop-cardcvvc"|

### Definindo Parâmetros

**PARÂMETROS DO SCRIPT**

|Propriedade|Descrição|
|-----------|---------|
|`accessToken`| Token de acesso obtido via API de autenticação da Braspag (AccessToken SOP).|
|`environment`| Tipo de ambiente: "sandbox" / "production".|
|`language`| Idioma: "pt" / "en" / "es". |
|`enableBinQuery`| "true" (habilita o *Consulta BIN*, retornando as características do cartão) / "false" (caso contrário). Obs.: Disponível somente para Cielo 3.0.|
|`enableVerifyCard`| "true" (habilita o *ZeroAuth*, retornando se o cartão é válido ou não) / "false" (caso contrário). |
|`enableTokenize`| "true" (salva o cartão diretamente no Cartão Protegido, retornando um *cardToken* ao invés de um *paymentToken*) / "false" (caso contrário). |
|`cvvRequired`| "false" (desliga a obrigatoriedade de envio do CVV) / "true" (caso contrário). |

**RETORNOS DO SCRIPT**

|Propriedade|Descrição|Condição|
|-----------|---------|---------|
|`PaymentToken`| Token efêmero utilizado para pagamento no formato de um GUID (36). |---|
|`CardToken`| Token permanente utilizado para pagamento no formato de um GUID (36). |Quando *enableTokenize* for "true". |
|`brand`| Nome da bandeira do cartão (Visa, Master, Elo, Amex, Diners, JCB, Hipercard). |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`binQueryReturnCode`| "00" se a análise do BIN for um sucesso. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`binQueryReturnMessage`| Ex.: “Transacao Autorizada” se a análise do BIN for um sucesso. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`CardBin`| Ex.: “455187”.|Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`CardLast4Digits`| Ex.: “0181”.|Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`foreignCard`| O campo retorna "true" se é um cartão emitido fora do Brasil. "false" caso contrário. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`VerifyCardReturnCode`| Esse é o mesmo código retornado pelo provedor durante uma autorização padrão. Ex: provedor Cielo30 código "00" significa sucesso na validação. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`VerifyCardReturnMessage`| Ex.: “Transacao Autorizada”. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`VerifyCardStatus`| "0"- Cartão Inválido; "1"- Cartão Válido; "99"- Situação Desconhecida. |Quando *enableVerifyCard* for "true". |

### Implementando Eventos

O script fornecido pela Braspag oferece os três seguintes eventos para manipulação e tratamento por parte do estabelecimento: 

|Evento|Descrição|
|-----------|---------|
|**onSuccess**| Evento em caso de sucesso. Será retornado o *PaymentToken* e também os dados do cartão, caso tenha solicitado realizar a verificação do cartão. Por questões de segurança, esse *PaymentToken* poderá ser usado para uma única autorização. Após seu processamento, ele será invalidado. |
|**onError**| Evento em caso de erro. Será retornado o código e a descrição do erro. |
|**onInvalid**| Evento em caso de fornecimento de dados incorretos. Serão retornados detalhes de campos com erro. As mensagens retornadas no resultado da validação são disponibilizadas nas seguintes linguagens: português (default), inglês e espanhol. |

<aside class="warning">Por questões de segurança, o PaymentToken poderá ser usado para uma única autorização. Após seu processamento, ele será invalidado.</aside>

### Exemplo

Para baixar o código, clique [aqui](https://github.com/Braspag/braspag.github.io/blob/docs/_i18n/pt/_posts/silent-order-post-example.html).
Exemplo de uma parametrização na página de checkout:

![Pagina Checkout]({{ site.baseurl_root }}/images/consulta-bin.jpg)

## 4. Autorizando com PaymentToken

Após a obtenção do *PaymentToken* através do script, execute o processo de autorização, enviando o *PaymentToken* no lugar de dados do cartão. 

Veja o exemplo abaixo, descrevendo o envio dos dados de autenticação da requisição de autorização da API do Pagador. 
Para maiores detalhes sobre a implementação, acesse o [Manual da API do Pagador](https://braspag.github.io//manual/braspag-pagador).

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
     "Card":{  
         "PaymentToken":"eedcb896-40e1-465b-b34c-6d1119dbb6cf"
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
     "Card":{  
         "PaymentToken":"eedcb896-40e1-465b-b34c-6d1119dbb6cf"
     }
   }
}
```

| Campo | Descrição | Tipo/Tamanho | Obrigatório? |
| --- | --- | --- | --- |
| `Payment.Card.PaymentToken` | Fornece o PaymentToken gerado através do script. Esta informação substitui os dados do cartão. | GUID / 36 | Sim |

### Response

Consulte o [Manual da API do Pagador](https://braspag.github.io//manual/braspag-pagador) para exemplos de resposta a requisições de autorização.

# ANEXO

## Autenticação Legada

Veja abaixo o fluxo legado de obtenção do **_AccessToken_** para autenticação.

O estabelecimento realiza um envio de requisição utilizando o VERBO HTTP **POST** para a seguinte URL, formada pela URL "base do ambiente + endpoint", no modelo server-to-server:

| Ambiente | URL base + endpoint|
| --- | --- |
| Sandbox | https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=**_{mid}_**|
| Produção | https://transaction.pagador.com.br/post/api/public/v1/accesstoken?merchantid=**_{mid}_**|

No lugar de **_{mid}_** preencha o `MerchantID` de sua loja na plataforma Pagador da Braspag, no seguinte formato: 

"https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=**_00000000-0000-0000-0000-000000000000_**"

### Requisição

<aside class="request"><span class="method post">POST</span><span class="endpoint">/v1/accesstoken?merchantid={mid}</span></aside>

```shell
--request POST "https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000"
--header "Content-Type: application/json"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`mid`|Identificador da loja no Pagador.|Guid |36 |Sim|

### Resposta

Como resposta, o estabelecimento receberá um json ("HTTP 201 Created") contendo, entre outras informações, o ticket (AccessToken).

```json
{
    "MerchantId": "B898E624-EF0F-455C-9509-3FAE12FB1F81",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2019-12-09T17:47:14",
    "ExpiresIn": "2019-12-09T18:07:14"
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantId": "B898E624-EF0F-455C-9509-3FAE12FB1F81",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2019-12-09T17:47:14",
    "ExpiresIn": "2019-12-09T18:07:14"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`MerchantId`|Identificador da loja no Pagador. |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`AccessToken`|Token de acesso. Por questões de segurança, este ticket dará permissão para o estabelecimento salvar apenas 1 cartão dentro de um prazo já estipulado na resposta, através do atributo *ExpiresIn* (por padrão, 20 minutos). O que acontecer primeiro invalidará esse mesmo ticket para impedir um uso futuro.|Texto|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Data e hora da geração. |Texto|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Data e hora da expiração. |Texto|--|AAAA-MM-DDTHH:MM:SS|

<aside class="warning">Por questões de segurança, será requerido obrigatoriamente o cadastro de um IP válido do estabelecimento na Braspag. Caso contrário, a requisição não será autorizada ("HTTP 401 NotAuthorized").</aside>

Identifique qual será o IP de saída que acessará a API e, na sequência, solicite o cadastro do mesmo através do [Canal de Atendimento](https://suporte.braspag.com.br/hc/pt-br) Braspag.
