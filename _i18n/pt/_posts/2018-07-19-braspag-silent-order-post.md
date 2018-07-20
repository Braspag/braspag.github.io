---
layout: manual
title: Manual de integração Silent Order Post
description: Integração técnica Gateway Braspag
search: true
translated: true
categories: manual
tags:
  - Pagador
language_tabs:
  json: JSON
  shell: cURL
  html: HTML
---

# Introdução ao Silent Order Post

**O objetivo desta documentação é orientar o desenvolvedor sobre implementação com o Silent Order Post**

Integração que a Braspag oferece aos lojistas, onde os dados de pagamentos são trafegue de forma segura, mantendo o controle total sobre a experiência de Ckeck Out.

Esse método possibilita o envio dos dados do pagamento do seu cliente final de forma segura diretamente em nosso sistema. Os campos de pagamento são guardados do lado da Braspag, que conta com a certificação PCI DSS 3.1.

É ideal para lojistas que exigem um alto nível de segurança, sem perder a identidade de sua página. Esse método permite um alto nível de personalização na sua página de checkout.

## Características

* Captura de dados de pagamento diretamente para os sistemas da Braspag por meio dos campos hospedados na sua página através de um script (javascript).
* Compatibilidade com todos os meios de pagamentos disponibilizados ao Gateway (Nacional e Internacional)
* Autenticação do comprador (disponível)
* Redução do escopo de PCI DSS
* Mantenha controle total sobre a experiência de check-out e elementos de gestão da sua marca.

## Fluxo

![Fluxo Silent Order Post]({{ site.baseurl_root }}/images/fluxo-sop-br.jpg)

**PASSO 1**

O cliente acaba o checkout, e vai para o processamento do pagamento.

**PASSO 2**

a) O estabelecimento deverá solicitar um ticket (server to server) enviando um POST para a seguinte URL:
https://www.pagador.com.br/post/api/public/v1/accesstoken?merchantid={mid_loja}

Exemplo: https://www.pagador.com.br/post/api/public/v1/accesstoken?merchantid=00000000-0000-0000-0000-000000000000

b) Para uso este recurso, por questões de segurança, obrigatoriamente será requerido do lado da Braspag, no mínimo um IP válido do estabelecimento. Caso contrário a requisição não será autorizada (HTTP 401 NotAuthorized).

**PASSO 3**

a) Como resposta, o estabelecimento receberá um json (HTTP 201 Created) contendo entre outras informações o ticket (AccessToken), como por exemplo:

IMAGEM

Por questões de segurança, este ticket dará permissão para o estabelecimento salvar apenas 1 cartão dentro de um prazo de já estipulado na resposta, através do atributo ExpiresIn (por padrão, 20 minutos). O que acontecer primeiro invalidará esse mesmo ticket para um uso futuro.

**PASSO 4 ao 6**

a) O estabelecimento deverá fazer o download de um script fornecido pela Braspag, e anexá-lo a sua página de checkout. Esse script permitirá à Braspag processar todas as informações de cartão sem intervenção do estabelecimento.
O download poderá ser realizado a partir da seguinte URL: https://www.pagador.com.br/post/scripts/silentorderpost-1.0.min.js

b) O estabelecimento deverá decorar seus inputs do formulário com as seguintes classes:

* Para o portador do cartão de crédito/débito: bp-sop-cardholdername 
* Para o número do cartão de crédito/débito: bp-sop-cardnumber 
*Para a validade do cartão de crédito/débito: bp-sop-cardexpirationdate 
*Para o código de segurança do cartão de crédito/débito: bp-sop-cardcvvc

c) O script fornecido pela Braspag fornece três eventos para manipulação e tratamento por parte do estabelecimento. São eles: onSuccess (onde será retornado o “PaymentToken” após processar os dados do cartão), onError (caso haja algum erro no consumo dos serviços da Braspag) e onInvalid (onde será retornado o resultado da validação dos inputs).

* Na validação dos inputs, o estabelecimento poderá utilizar toda a camada de validação sobre os dados de cartão realizada pela Braspag e assim simplificar o tratamento no seu formulário de checkout. As mensagens retornadas no resultado da validação são disponibilizadas nas seguintes linguagens: português (default), inglês e espanhol.

* O PaymentToken será o token que representará todos os dados de cartão fornecido pelo comprador. O mesmo será utilizado pelo estabelecimento para não haver necessidade de tratar e processar dados de cartão do seu lado.

Por questões de segurança esse PaymentToken poderá ser usado apenas para 1 autorização na Braspag. Após o processamento do mesmo, este será invalidado.

Exemplo de setup a ser realizado pelo estabelecimento na página de checkout:

IMAGEM