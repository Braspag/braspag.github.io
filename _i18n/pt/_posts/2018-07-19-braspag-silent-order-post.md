---
layout: manual
title: Manual de Integração Silent Order Post
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manualp
tags:
  - Pagador
language_tabs:
  shell: cURL
---

# Silent Order Post

Esta é uma integração que a Braspag oferece aos lojistas com o intuito de oferecer maior segurança e controle sobre a experiência de checkout. Ela é ideal para a empresa que não possui estrutura para cumprir todos os requisitos de segurança do PCI DSS no uso de cartões de crédito; ou, também, para o lojista que prefira concentrar seus esforços em outros elementos do negócio.

Este método possibilita o envio de dados do pagamento do seu cliente de forma segura, diretamente em nosso sistema. Os dados do pagamento, tais como número do cartão e data de validade, são armazenados no ambiente da Braspag, que conta com a certificação PCI DSS 3.2.

Por permitir total personalização na página de checkout da loja, essa solução é ideal para lojistas que exigem um alto grau de segurança, sem perder a identidade de sua página.

# Características

* Captura de dados do pagamento diretamente para os sistemas da Braspag, por meio dos campos definidos no seu checkout, através de um script (javascript).
* Compatibilidade com todos os meios de pagamentos disponibilizados no Gateway Pagador (Nacional e Internacional).
* Redução do escopo de PCI DSS.
* Controle total sobre a experiência de checkout, mantendo o *look & feel* de sua marca.

# Fluxo Transacional

![Fluxo Silent Order Post]({{ site.baseurl_root }}/images/fluxo-sop-br.jpg)

# Integração

## 1. Obtendo *AccessToken*

Quando o comprador acessar o checkout, o estabelecimento deve gerar o *AccessToken* a partir da API de autenticação da Braspag (*oAuth*). Em caso de sucesso, a API retornará um *AccessToken* que deverá ser preenchido no script a ser carregado na página. 

Para solicitar o *AccessToken*, o estabelecimento deve realizar um envio de requisição utilizando o VERBO HTTP **POST** para o seguinte endpoint no modelo server-to-server:

| Endpoint | Ambiente |
| --- | --- |
| https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid={mid} | Sandbox |
| https://transaction.pagador.com.br/post/api/public/v1/accesstoken?merchantid={mid} | Produção |

No lugar do **{mid}** deve-se preencher o MerchantID de sua loja na plataforma Pagador da Braspag. 

*Exemplo: https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000*

### Requisição

<aside class="request"><span class="method post">POST</span><span class="endpoint">/v1/accesstoken?merchantid={mid}</span></aside>

```shell
curl
--request POST "https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000"
--header "Content-Type: application/json"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`mid`|Identificador da loja no Pagador |Guid |36 |Sim|

### Resposta

Como resposta, o estabelecimento receberá um json (*HTTP 201 Created*) contendo, entre outras informações, o ticket (*AccessToken*).

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
|`AccessToken`|Token de Acesso. Por questões de segurança, este ticket dará permissão para o estabelecimento salvar apenas 1 cartão dentro de um prazo já estipulado na resposta, através do atributo *ExpiresIn* (por padrão, 20 minutos). O que acontecer primeiro invalidará esse mesmo ticket para um uso futuro.|Texto|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Data e hora da geração. |Texto|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Data e hora da expiração. |Texto|--|AAAA-MM-DDTHH:MM:SS|

<aside class="warning">Por questões de segurança, será requerido obrigatoriamente o cadastro de um IP válido do estabelecimento na Braspag. Caso contrário, a requisição não será autorizada (*HTTP 401 NotAuthorized*).</aside>

Por favor, identifique qual será o IP de saída que acessará a API e na sequência solicite o cadastro do mesmo através do canal de atendimento Braspag: [https://suporte.braspag.com.br/hc/pt-br](https://suporte.braspag.com.br/hc/pt-br).

## 2. Implementando o Script

### Mapeando Classes

O estabelecimento deverá fazer o [download do script](https://www.pagador.com.br/post/scripts/silentorderpost-1.0.min.js) disponibilizado pela Braspag e anexá-lo à sua página de checkout. Esse script permitirá à Braspag processar todas as informações de cartão sem intervenção do estabelecimento.

O estabelecimento deverá parametrizar os elementos formulário com as seguintes classes:

|Propriedade|Nome da Classe|
|-----------|---------|
|Nome do portador do cartão de crédito/débito|**bp-sop-cardholdername** |
|Número do cartão de crédito/débito|**bp-sop-cardnumber** |
|Data de validade do cartão de crédito/débito|**bp-sop-cardexpirationdate** |
|Código de segurança do cartão de crédito/débito|**bp-sop-cardcvvc**|

### Definindo Parâmetros

**PARÂMETROS DO SCRIPT**

|Propriedade|Descrição|
|-----------|---------|
|accessToken| Token de acesso obtido via API de autenticação da Braspag.|
|environment| *sandbox* ou *production*.|
|language| *pt* ou *en* ou *es*. |
|enableBinQuery| *true* se quiser habilitar o Consulta BIN (retorna as características do cartão). *false* caso contrário. Obs.: Disponível somente para Cielo 3.0.|
|enableVerifyCard| *true* se quiser habilitar o ZeroAuth (retorna se o cartão é válido ou não). *false* caso contrário. |
|enableTokenize| *true* se quiser salvar o cartão diretamente no Cartão Protegido (retorna um *cardToken* ao invés de um *paymentToken*). *false* caso contrário. |
|cvvRequired| *false* se quiser desligar a obrigatoriedade de envio do CVV. *true* caso contrário. |

**RETORNOS DO SCRIPT**

|Propriedade|Descrição|Condição|
|-----------|---------|---------|
|PaymentToken| Token efêmero utilizado para pagamento no formato de um GUID (36). |---|
|CardToken| Token permanente utilizado para pagamento no formato de um GUID (36). |Quando *enableTokenize* for *true*. |
|brand| Nome da bandeira do cartão (Visa, Master, Elo, Amex, Diners, JCB, Hipercard). |Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|binQueryReturnCode| "00" se a análise do BIN for um sucesso. |Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|binQueryReturnMessage| Ex. “Transacao Autorizada” se a análise do BIN for um sucesso. |Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|CardBin| Ex: “455187”.|Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|CardLast4Digits| Ex: “0181”.|Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|foreignCard| O campo retorna *true* se é um cartão emitido fora do Brasil. *false* caso contrário. |Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|VerifyCardReturnCode| Esse é o mesmo código retornado pelo provedor durante uma autorização padrão. Ex: provedor Cielo30 código "00" significa sucesso na validação. |Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|VerifyCardReturnMessage| Ex. “Transacao Autorizada”. |Quando *enableBinQuery* for *true*. Disponível somente para Cielo 3.0. |
|VerifyCardStatus| 0-Cartão Inválido; 1-Cartão Válido; 99-Situação Desconhecida. |Quando *enableVerifyCard* for *true*. |

### Implementando Eventos

O script fornecido pela Braspag fornece os três seguintes eventos para manipulação e tratamento por parte do estabelecimento: 

|Evento|Descrição|
|-----------|---------|
|**onSuccess**| Evento em caso de sucesso. Será retornado o *PaymentToken* e também os dados do cartão, caso tenha solicitado realizar a verificação do cartão. Por questões de segurança, esse *PaymentToken* poderá ser usado apenas para uma única autorização. Após seu processamento ele será invalidado. |
|**onError**| Evento em caso de erro. Será retornado o código e a descrição do erro. |
|**onInvalid**| Evento em caso de fornecimento de dados incorretos. Serão retornados detalhes de campos com erro. As mensagens retornadas no resultado da validação são disponibilizadas nas seguintes linguagens: português (default), inglês e espanhol. |

<aside class="warning">Por questões de segurança, o PaymentToken poderá ser usado apenas para uma única autorização. Após seu processamento, ele será invalidado.</aside>

### Exemplo

Exemplo de uma parametrização na página de checkout:

Para baixar o código, clique [aqui](https://github.com/Braspag/braspag.github.io/blob/docs/_i18n/pt/_posts/silent-order-post-example.html)

![Pagina Checkout]({{ site.baseurl_root }}/images/consulta-bin.jpg)

## 3. Autorizando com PaymentToken

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
     "Card":{  
         "PaymentToken":"eedcb896-40e1-465b-b34c-6d1119dbb6cf"
     }
   }
}
```

| **Campo** | **Descrição** | **Tipo/Tamanho** | **Obrigatório** |
| --- | --- | --- | --- |
| Payment.Card.PaymentToken | Fornece o PaymentToken gerado através do script. Esta informação substitui os dados do cartão. | GUID (36) | Sim |

### Response

Vide https://braspag.github.io/manual/braspag-pagador
