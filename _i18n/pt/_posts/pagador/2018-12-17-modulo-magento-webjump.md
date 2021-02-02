---
layout: tutorial
title:  Módulo Magento 2.0 Webjump
description: Como Integrar sua Loja Magento com o Módulo de Pagamentos Braspag na Webjump
toc_footers: true
categories: tutorial
translated: true
sort_order: 6
tags:
  - 1. Pagador
---

# Instalação

## Pré-Requisitos Técnicos

Para saber quais os requisitos técnicos de infraestrutura para instalação do módulo Magento, consulte o [Guia de Instalação](https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html) na documentação oficial do Magento.

<aside class="notice">A versão do Magento recomendada é a 2.4.0, mas são suportadas as versões a partir da 2.3.0.</aside>

## Instalação do Módulo Base

### Instalação via Composer

1. Acessar o servidor via SSH.
2. Localizar a raiz do projeto e executar os seguintes comandos:

```
composer require webjump/magento2-module-braspagpagador
composer update
bin/magento module:enable Webjump_BraspagPagador
bin/magento setup:upgrade
bin/magento setup:di:compile
```

## Instalação para Integração com a Unirgy Marketplace

A instalação descrita nos próximos passos só é necessária caso o módulo **Marketplace Unirgy** seja adquirido. 

### Instalação via Composer

1. Acessar o servidor via SSH.
2. Localizar a raiz do projeto. No arquivo *composer.json*, adicionar as seguintes informações:
```
"repositories": {
    "webjump/magento2-module-braspag-unirgy": {
        "type": "vcs",
        "url": "https://github.com/webjump/magento2-module-braspag-unirgy.git"
    }
},
"require": {
    "webjump/magento2-module-braspag-unirgy": "1.0.0",
    ...
},
```
3. Ainda na raiz do projeto, executar os seguintes comandos:
```
composer update
bin/magento module:enable Braspag_Unirgy
bin/magento setup:upgrade
bin/magento setup:di:compile
```

# Configurações

## Configurações Gerais - Acesso 

Seguem instruções de acesso para as configurações gerais do módulo Braspag. 

1. Fazer login no admin do Magento;
2. No menu, acessar `Lojas` > `Configurações`;
3. Acessar a aba `Vendas` > `Métodos de Pagamento`;
4. Na lista de Métodos de Pagamento, clicar em `Braspag`.

## Configurações Globais

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Global Settings" do plugin Braspag:
![Global Settings]({{ site.baseurl_root }}/images/braspag/pagador/magento-global-settings.png)

|Campo|Descrição|
|---|---|
|**Merchant ID**|ID da loja, disponibilizado pela Braspag.|
|**Merchant Key**|Chave da loja, disponibilizada pela Braspag.|
|**Merchant Name**|Nome da loja, disponibilizado pela Braspag.|
|**Establishment Code**|Código de estabelecimento da loja, disponibilizado pela Braspag.|
|**MCC**|*Merchant Category Code* da loja, disponibilizado pela Braspag.|
|**Test Mode Active**|Ativa ou desativa o modo de testes no plugin. Quando ativado, as transações serão efetuadas no ambiente Sandbox.|
|**Return URL**|URL de retorno após a finalização da autenticação do método de pagamento Débito.|

## Autenticação OAuth

Seguem instruções para configuração da autenticação **OAuth**. Essa autenticação é utilizada para a criação do token em requisições na Braspag.

1. No menu, acessar `Lojas` > `Configurações`;
2. Acessar a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clicar em `Braspag` > `OAuth2 - Config`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "OAuth Config":
![OAuth2 - Config]({{ site.baseurl_root }}/images/braspag/pagador/magento-oauth.png)

|Campo|Descrição|
|---|---|
|**Client ID**|ID do cliente, disponibilizado pela Braspag.|
|**Client Secret**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Antifraude

Seguem as instruções de acesso para ativação do **Anti Fraud**:

1. No menu, acessar `Lojas` > `Configurações`;
2. Acessar a aba `Braspag` > `Anti Fraud`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "General":
![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/magento-antifraud-general.png)

|Campo|Descrição|
|---|---|
|**Enabled**|Ativa ("Yes") ou desativa ("No") o Antifraude.|

 Além da ativação do antifraude, nesta aba são também configurados o Fingerprint, as opções de sequência e captura do antifraude e os MDDs (Merchant Defined Data).
 
### FingerPrint

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "FingerPrint":
![Fingerprint]({{ site.baseurl_root }}/images/braspag/pagador/magento-fingerprint.png)

|Campo|Descrição|
|---|---|
|**Org ID**|Fingerprint Org ID, disponibilizado pela Braspag.|
|**Merchant ID**|Fingerprint Merchant ID, disponibilizado pela Braspag.|
|**Use Order ID to Fingerprint**|Ativa ou desativa a utilização do ID do pedido na composição do fingerprint.|

### Options

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Options":
![Options]({{ site.baseurl_root }}/images/braspag/pagador/magento-antifraud-options.png)

|Campo|Descrição|
|---|---|
|**Sequence**|Sequência do processamento do antifraude.<br>"Analyse First" - é efetuada a análise de fraude e depois a autorização. / "Authorize First" - é efetuada a autorização e depois a análise de fraude.|
|**Sequence Criteria**|Critério da sequência do processamento.<br>"On Success" - realiza a análise apenas quando a transação é efetuada com sucesso. / "Always" - a análise sempre será efetuada.|
|**Capture On Low Risk**|Ativa ou desativa a captura em caso de baixo risco na transação.|
|**Void On High Risk**|Ativa ou desativa o estorno automático em caso de alto risco na transação.|

### MDDs

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "MDD's":
![MDD's]({{ site.baseurl_root }}/images/braspag/pagador/magento-antifraud-mdds.png)

|Campo|Descrição|
|---|---|
|**Customer fetch self Shipping Method**| Método de entrega do cliente.|
|**Store Code From Customer Fetch Self**|Código da loja do cliente.|
|**Vertical Segment**|Segmento da loja.|
|**Store Identity (CNPJ)**|CNPJ da loja.|
|**Category Attribute Code**|Código do atributo da categoria.|

## Autenticação 3DS 2.0

Seguem instruções para configuração da autenticação **OAuth** para a **Autenticação 3DS 2.0**. Essa autenticação é utilizada para a criação do token em requisições na Braspag.

1. No menu, acessar `Lojas` > `Configurações`;
2. Acessar a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clicar em `Braspag` > `Authentication 3DS 2.0 - Config`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Authentication 3DS 2.0 Config":
![Authentication 3DS 2.0 Config]({{ site.baseurl_root }}/images/braspag/pagador/magento-authentication.png)

|Campo|Descrição|
|---|---|
|**Client ID**|ID do cliente, disponibilizado pela Braspag.|
|**Client Secret**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Post de Notificação

## Split de Pagamentos

### Marketplace Vendor

### Marketplace Credentials

### Marketplace General Config

# Clientes

## Configurações

### Address

# Boleto

## Acesso às Configurações Gerais

## Configurações Gerais

## Payment Split

## Visão do Método de Pagamento após a Configuração na Loja

# Cartão de Crédito

## Acesso às Configurações Gerais

## Configurações Gerais

## Types

## Installments

## Silent Order Post

## Autenticação 3DS 2.0

## Payment Split

## AVS

## Checkout Card View

## Visão do Método de Pagamento após a Configuração na Loja

# Cartão de Crédito - Cartão Salvo (Just Click)

## Acesso às Configurações Gerais

## Configurações Gerais

## Installments

## Visão do Método de Pagamento após a Configuração na Loja

# Cartão de Débito

## Acesso às Configurações Gerais

## Configurações Gerais

## Types

## Autenticação 3DS 2.0

## Payment Split

## Checkout Card View

## Visão do Método de Pagamento após a Configuração na Loja

# Split de Pagamentos (Magento)

## Acesso às Transações

## Trava do Split

## Envio Manual do Split Pós-Transacional

# Split de Pagamentos (Magento + Unirgy)

## Vínculo do Seller (Unirgy) ao Subordinado (Braspag)

## Cadastro de Taxas e Descontos de Comissão do Seller (Unirgy)
