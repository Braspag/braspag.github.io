---
layout: manual
title: Manual de integração Silent Order Post
description: Integração técnica Gateway Braspag
search: true
translated: true
categories: manualp
tags:
  - Pagador
language_tabs:
  shell: cURL
---

# Silent Order Post

Integração que a Braspag oferece aos lojistas, onde os dados de pagamentos são trafegados de forma segura, mantendo o controle total sobre a experiência de checkout.

Esse método possibilita o envio dos dados do pagamento do seu cliente de forma segura, diretamente em nosso sistema. Os dados de pagamento, tais como número do cartão e data de validade são armazenados no ambiente da Braspag, que conta com a certificação PCI DSS 3.2.

É ideal para lojistas que exigem um alto grau de segurança, sem perder a identidade de sua página, permitindo total personalização na sua página de checkout.

# Características

* Captura de dados de pagamento diretamente para os sistemas da Braspag por meio dos campos definidos no seu checkout através de um script (javascript).
* Compatibilidade com todos os meios de pagamentos disponibilizados no Gateway Pagador (Nacional e Internacional)
* Redução do escopo de PCI DSS
* Mantenha controle total sobre a experiência de checkout mantendo o look & feel de sua marca

# Fluxo Transacional

![Fluxo Silent Order Post]({{ site.baseurl_root }}/images/fluxo-sop-br.jpg)

# Obtendo AccessToken

Quando o comprador acessar o checkout, o estabelecimento deve gerar o AccessToken a partir da API de autenticação da Braspag (oAuth). Em caso de sucesso, a API retornará um AccessToken que deve ser preenchido no script a ser carregado na página. 

Para solicitar o AccessToken, o estabelecimento deve realizar um POST para a seguinte endpoint no modelo server-to-server:

**https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid={mid}**

No lugar do **{mid}** deve-se preencher o MerchantID de sua loja na plataforma Pagador da Braspag. 

Exemplo: https://transactionsandbox.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000

## Requisição

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

## Resposta

Como resposta, o estabelecimento receberá um json (HTTP 201 Created) contendo entre outras informações o ticket (AccessToken)

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
|`MerchantId`|Identificador da loja no Pagador |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`AccessToken`|Token de Acesso. Por questões de segurança, este ticket dará permissão para o estabelecimento salvar apenas 1 cartão dentro de um prazo de já estipulado na resposta, através do atributo ExpiresIn (por padrão, 20 minutos). O que acontecer primeiro invalidará esse mesmo ticket para um uso futuro.|Texto|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Data e hora da geração |Texto|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Data e hora da expiração |Texto|--|AAAA-MM-DDTHH:MM:SS|

<aside class="notice">Por questões de segurança, será requerido obrigatoriamente o cadastro de um IP válido do estabelecimento na Braspag. Caso contrário a requisição não será autorizada (HTTP 401 NotAuthorized). Por favor, identificar qual será o IP de saída que acessará a API e na sequência solicitar o cadastro do mesmo através do canal de atendimento Braspag: https://suporte.braspag.com.br/hc/pt-br</aside>

# Implementando o script

## Mapeando classes

O estabelecimento deverá fazer o download do script disponibilizado pela Braspag, e anexá-lo a sua página de checkout. Esse script permitirá à Braspag processar todas as informações de cartão sem intervenção do estabelecimento. O download poderá ser realizado a partir da seguinte URL: 

<aside class="notice">https://www.pagador.com.br/post/scripts/silentorderpost-1.0.min.js</aside>

O estabelecimento deverá parametrizar os elementos formulário com as seguintes classes:

|Propriedade|Nome da Classe|
|-----------|---------|
|Nome do portador do cartão de crédito/débito|**bp-sop-cardholdername** |
|Número do cartão de crédito/débito|**bp-sop-cardnumber** |
|Data de Validade do cartão de crédito/débito|**bp-sop-cardexpirationdate** |
|Código de Segurança do cartão de crédito/débito|**bp-sop-cardcvvc**|

## Implementando eventos

O script fornecido pela Braspag fornece três eventos para manipulação e tratamento por parte do estabelecimento. 

|Evento|Descrição|
|-----------|---------|
|**onSuccess**| Evento em caso de sucesso. Será retornado o PaymentToken, e também os dados do cartão caso tenha solicitado realizar a verificação do cartão. Por questões de segurança esse PaymentToken poderá ser usado apenas para uma autorização. Após o processamento do mesmo, este será invalidado. |
|**onError**| Evento em caso de erro. Será retornado o código e a descrição do erro |
|**onInvalid**| Evento em caso de fornecimento de dados incorretos. Serão retornados detalhes de campos com erro. As mensagens retornadas no resultado da validação são disponibilizadas nas seguintes linguagens: português (default), inglês e espanhol. |

<aside class="notice">Por questões de segurança esse PaymentToken poderá ser usado apenas para uma autorização. Após o processamento do mesmo, este será invalidado.</aside>

Exemplo de uma parametrização na página de checkout:

Para baixar o código, clique [aqui](https://github.com/Braspag/braspag.github.io/blob/docs/_i18n/pt/_posts/silent-order-post-example.html)

![Pagina Checkout]({{ site.baseurl_root }}/images/consulta-bin.jpg)

**PARÂMETROS DO SCRIPT**

|Propriedade|Descrição|
|-----------|---------|
|accessToken| Token de Acesso obtido via API de autenticação da Braspag|
|environment| **sandbox** ou **production**|
|language| **pt** ou **en** ou **es** |
|enableBinQuery| **true** se quiser habilitar o ZeroAuth e Consulta BIN. **false** caso contrário. |

**RETORNOS DO SCRIPT**

|Propriedade|Descrição|
|-----------|---------|
|PaymentToken| Token de Pagamento no formato de um GUID (36) |
|brand| Retornado quando a opção enableBinQuery for **true**. Nome da bandeira do cartão (Visa, Master, Elo, Amex, Diners, JCB, Hipercard) |
|forerignCard| Retornado quando a opção enableBinQuery for **true**. O campo retorna **true** se é um cartão emitido fora do brasil. **false** caso contrário |
|binQueryReturnCode| Retornado quando a opção enableBinQuery for **true**. Esse é o mesmo código retornado pelo provedor durante uma autorização padrão. Ex: provedor Cielo30 código 82-cartão inválido|
|binQueryReturnMessage| Retornado quando a opção enableBinQuery for **true**. Ex. “Transacao Autorizada”  |
