---
layout: tutorial
title:  Integração Shopify
description: Integração Shopify
toc_footers: false
categories: tutorial
translated: false
sort_order: 5
tags:
    - 2. Módulos

---

# Integração Shopify

Para fazer a integração com a plataforma Shopify, o lojista deve instalar o aplicativo referente ao meio de pagamento desejado.

# Meios de Pagamento

* **Pix**: O aplicativo **Pix** da Cielo permite transações instantâneas e seguras. Usuários podem efetuar pagamentos e transferências a qualquer hora, com o dinheiro sendo transferido de forma imediata.
* **Boleto**: Os boletos são seguros e fáceis de gerenciar.
* **Cartão de crédito**: Com o aplicativo, o usuário pode ver suas vendas em tempo real, gerenciar pagamentos e antecipar recebimentos. Ele suporta mais de 80 bandeiras e oferece soluções digitais para vendas online.

## Instalação do Pix

Para instalar o aplicativo do meio de pagamento Pix, [acesse o portal](https://accounts.shopify.com/storelogin?redirect=%2Fadmin%2Fsettings%2Fpayments%2Falternativeproviders%2F45776897) e faça login em sua conta da Shopify.

Após fazer login, clique em **Instalar**:

![Tela instalação pix]({{ site.baseurl_root }}/images/braspag/pagador/instalacao-pix.jpg)

Em seguida, clique novamente em **Instalar**:

![Tela instalação pix segunda etapa]({{ site.baseurl_root }}/images/braspag/pagador/intalacao-pix-2.jpg)

Você será direcionado para a tela de login na Cielo. Caso você já tenha seu usuário e senha basta fazer login. Caso não tenha, entre em contato com a Cielo para gerar seu usuário e senha.

* **Atendimento via Telefone:** 3003-4346
* **Atendimento via WhatsApp:** (11)98541-0288

![Tela login]({{ site.baseurl_root }}/images/braspag/pagador/tela-login-nova.jpg)

Quando a Cielo fizer seu cadastro, você receberá um e-mail de confirmação. Clique em **Confirmar E-mail**:

![Confirmação e-mail]({{ site.baseurl_root }}/images/braspag/pagador/email-confirmacao-cadastro.png)

Crie uma senha de acesso para o seu painel admin da Cielo:

![Criar senha]({{ site.baseurl_root }}/images/braspag/pagador/confirmacao-email.png)

Agora que você tem acesso ao seu Painel Admin da Cielo, vamos configurar o meio de pagamento Pix.

Clique no aviso de configuração:

![aviso de configuração]({{ site.baseurl_root }}/images/braspag/pagador/notificacao-clicar.png)

Insira as suas credenciais `MerchantId` e `MerchantKey`. Para saber como acessar essas credenciais, [siga essas instruções](https://developercielo.github.io/attachment/merchantid-merchantkey-cielo-2023.pdf).

![Mid e Mk]({{ site.baseurl_root }}/images/braspag/pagador/configuracao-pix-3.jpg)

Preencha o campo **Provider** com `Cielo30` e informe o tempo de expiração desejado para o código Pix em segundos.

![salvar pix]({{ site.baseurl_root }}/images/braspag/pagador/configuracao-pix-4.jpg)

Clique em **SALVAR**. Em seguida, clique no aviso indicando para ativar o meio de pagamento na Shopify:

![salvar informações]({{ site.baseurl_root }}/images/braspag/pagador/salvar-pix-5.jpg)

Após ser redirecionado para a Shopify, clique em **Ativar**.

![ativar pix]({{ site.baseurl_root }}/images/braspag/pagador/ativar-pix-6.jpg)

Você receberá uma mensagem de confirmação indicando que o Pix Cielo foi ativado e está pronto para uso.

## Instalação de boleto

Para instalar o aplicativo do meio de pagamento boleto, [acesse o portal](https://accounts.shopify.com/store-login?redirect=%2Fadmin%2Fsettings%2Fpayments%2Falternativeproviders%2F46759937) e faça login em sua conta da Shopify.

Após fazer login, clique em **Instalar**:

![Instalar boleto]({{ site.baseurl_root }}/images/braspag/pagador/instalacao-boleto-1.jpg)

Em seguida, clique novamente em **Instalar**:

![Instalar boleto segunda parte]({{ site.baseurl_root }}/images/braspag/pagador/instalcao-boleto-2.jpg)

Você será direcionado para a tela de login na Cielo. Caso você já tenha seu usuário e senha basta fazer login. Caso não tenha, entre em contato com a Cielo para gerar seu usuário e senha.

* **Atendimento via Telefone:** 3003-4346
* **Atendimento via WhatsApp:** (11)98541-0288

![Login Cielo]({{ site.baseurl_root }}/images/braspag/pagador/tela-login-nova.jpg)

Quando a Cielo fizer seu cadastro, você receberá um e-mail de confirmação. Clique em **Confirmar E-mail**:

![Confirmar e-mail]({{ site.baseurl_root }}/images/braspag/pagador/email-confirmacao-cadastro.png)

Crie uma senha de acesso para o seu painel admin da Cielo:

![Criar senha]({{ site.baseurl_root }}/images/braspag/pagador/confirmacao-email.png)

Agora que você tem acesso ao seu Painel Admin da Cielo, vamos configurar o meio de pagamento boleto.

Clique no aviso de configuração.

![aviso de configuração]({{ site.baseurl_root }}/images/braspag/pagador/notificacao-clicar.png)

Preencha os campos necessários e clique em **Salvar**:

> **Nosso Número** é uma informação dada pela Cielo, se não souber como preencher, entre em contato com o Atendimento.

![Preencher campos]({{ site.baseurl_root }}/images/braspag/pagador/config-boleto-4.jpg)

Clique novamente na aba **Boletos**. Em seguida, clique no aviso indicando para ativar o meio de pagamento na Shopify:

![Ativar boleto]({{ site.baseurl_root }}/images/braspag/pagador/config-boleto-5.jpg)

Após ser redirecionado para a Shopify, clique em **Ativar**.

![Ativar boleto segunda parte]({{ site.baseurl_root }}/images/braspag/pagador/ativar-boleto-6.jpg)

Você receberá uma mensagem de confirmação indicando que o **Cielo Boleto** foi ativado e está pronto para uso.

![Boleto ativo]({{ site.baseurl_root }}/images/braspag/pagador/boleto-ativado.jpg)

## Instalação de cartão de crédito

Para instalar o aplicativo do meio de pagamento cartão de crédito, [acesse o portal](https://accounts.shopify.com/store-login?redirect=%2Fadmin%2Fsettings%2Fpayments%2Falternativeproviders%2F46792705) e faça login em sua conta da Shopify.

Após fazer login, clique em **Instalar**:

![Instalar cartão de crédito]({{ site.baseurl_root }}/images/braspag/pagador/instalacao-cartao-credito-1.jpg)

Em seguida, clique novamente em **Instalar**:

![Instalar cartão de crédito segunda parte]({{ site.baseurl_root }}/images/braspag/pagador/instalacao-cartao-credito-2.jpg)

Você será direcionado para a tela de login na Cielo. Caso você já tenha seu usuário e senha basta fazer login. Caso não tenha, entre em contato com a Cielo para gerar seu usuário e senha.

* **Atendimento via Telefone:** 3003-4346
* **Atendimento via WhatsApp:** (11)98541-0288

![Login Cielo]({{ site.baseurl_root }}/images/braspag/pagador/tela-login-nova.jpg)

Quando a Cielo fizer seu cadastro, você receberá um e-mail de confirmação. Clique em **Confirmar E-mail**:

![Confirmação e-mail]({{ site.baseurl_root }}/images/braspag/pagador/email-confirmacao-cadastro.png)

Crie uma senha de acesso para o seu painel admin da Cielo:

![Criar senha]({{ site.baseurl_root }}/images/braspag/pagador/confirmacao-email.png)

Agora que você tem acesso ao seu Painel Admin da Cielo, vamos configurar o meio de pagamento Pix.

Clique no aviso de configuração.

Preencha os campos:

![Preenchimento dos campos]({{ site.baseurl_root }}/images/braspag/pagador/config-cartao-credito-3.jpg)

Caso queira informar os juros por parcela, habilite o campo **Habilite parcelamento com juros**, preencha os campos relacionados e clique em **SALVAR**:

![Parcelamento juros]({{ site.baseurl_root }}/images/braspag/pagador/cartao-credito-juros-parcelado.jpg)

Clique novamente na aba **Cartão de Crédito**.Em seguida, clique no aviso indicando para ativar o meio de pagamento na Shopify:

![Ativar meio de pagamento]({{ site.baseurl_root }}/images/braspag/pagador/ativar-cartao-credito-5.jpg)

Após ser redirecionado para a Shopify, selecione quais bandeiras de cartão de crédito poderão ser utilizadas e clique em **Ativar**:

![Ativar bandeira]({{ site.baseurl_root }}/images/braspag/pagador/ativacao-cartao-credito-6.jpg)

Você receberá uma mensagem de confirmação indicando que o **Cielo Credicard** foi ativado e está pronto para uso.

### Antifraude

Para fazer uma análise de fraude nas transações de cartão de crédito, será necessário ter contratar nosso Antifraude com provedor **Cybersource**. Se já tiver contratado, [baixe o aplicativo](https://apps.shopify.com/cielo-fraud-analysis){:target="_blank"}:

![Aplicativo Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/instalacao-antifraude-1.jpg)

Em seguida, clique em **Instalar**:

![Instalar aplicativo]({{ site.baseurl_root }}/images/braspag/pagador/instalacao-antifraude-2.jpg)

A opção de análise de fraude já estará disponível na configuração de pagamentos com cartão de crédito. Escolha a sequência (`AuthorizeFirst` ou `AnalyzeFirst`) e o critério. Para saber mais sobre essas opções, veja nosso [manual Antifraude](https://braspag.github.io//manual/antifraude#fluxos-da-an%C3%A1lise-de-fraude). O provider será sempre Cybersource:

![Configuração antifraude]({{ site.baseurl_root }}/images/braspag/pagador/configuracao-antifraude.jpg)
