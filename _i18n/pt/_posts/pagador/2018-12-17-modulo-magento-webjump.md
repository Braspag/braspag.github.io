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

# Configuração

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
3. Na lista de Métodos de Pagamento, clicar em `Braspag` > `OAuth2 Config`.

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

A imagem a seguir mostra o campo de configuração a ser preenchido na seção "General":
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
|**Use Order ID to Fingerprint**|Ativa ("Yes") ou desativa ("No") a utilização do ID do pedido na composição do fingerprint.|

### Options

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Options":
![Options]({{ site.baseurl_root }}/images/braspag/pagador/magento-antifraud-options.png)

|Campo|Descrição|
|---|---|
|**Sequence**|Sequência do processamento do antifraude.<br>"Analyse First" - é efetuada a análise de fraude e depois a autorização. / "Authorize First" - é efetuada a autorização e depois a análise de fraude.|
|**Sequence Criteria**|Critério da sequência do processamento.<br>"On Success" - realiza a análise apenas quando a transação é efetuada com sucesso. / "Always" - a análise sempre será efetuada.|
|**Capture On Low Risk**|Ativa ("Yes") ou desativa ("No") a captura em caso de baixo risco na transação.|
|**Void On High Risk**|Ativa ("Yes") ou desativa ("No") o estorno automático em caso de alto risco na transação.|

### MDDs

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "MDD's":
![MDD's]({{ site.baseurl_root }}/images/braspag/pagador/magento-antifraud-mdds.png)

|Campo|Descrição|
|---|---|
|**Customer Fetch Self Shipping Method**| Método de entrega do cliente.|
|**Store Code From Customer Fetch Self**|Código da loja do cliente.|
|**Vertical Segment**|Segmento da loja.|
|**Store Identity (CNPJ)**|CNPJ da loja.|
|**Category Attribute Code**|Código do atributo da categoria.|

## Autenticação 3DS 2.0

Seguem instruções para configuração da autenticação **OAuth** para a **Autenticação 3DS 2.0**. Essa autenticação é utilizada para a criação do token em requisições na Braspag.

1. No menu, acessar `Lojas` > `Configurações`;
2. Acessar a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clicar em `Braspag` > `Authentication 3DS 2.0 Config`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Authentication 3DS 2.0 Config":
![Authentication 3DS 2.0 Config]({{ site.baseurl_root }}/images/braspag/pagador/magento-authentication.png)

|Campo|Descrição|
|---|---|
|**Client ID**|ID do cliente, disponibilizado pela Braspag.|
|**Client Secret**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Post de Notificação

Informações sobre a URL da loja que deverá ser cadastrada na Braspag para que o webhook atualize as informações dos pedidos na loja. Para mais informações, consulte o [Manual do Pagador](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o).

<aside class="notice">URL de notificação para o Módulo Magento: http://{URL_DA_LOJA}/braspag-pagador/post/notification</aside>

## Split de Pagamentos

Seguem instruções para configuração do **Split de Pagamentos**.

1. No menu, acessar `Lojas` > `Configurações`;
2. Acessar a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clicar em `Braspag` > `Payment Split - Config`.

### Marketplace Vendor

A imagem a seguir mostra o campo de configuração a ser preenchido na seção "Marketplace Vendor":
![Marketplace Vendor]({{ site.baseurl_root }}/images/braspag/pagador/magento-marketplace-vendor.png)

|Campo|Descrição|
|---|---|
|**Vendor**|Fornecedor que irá gerenciar o marketplace.|

### Marketplace Credentials

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Marketplace Credentials":
![Marketplace Credentials]({{ site.baseurl_root }}/images/braspag/pagador/magento-marketplace-credentials.png)

|Campo|Descrição|
|---|---|
|**Merchant ID**|ID da loja habilitado para split de pagamentos, disponibilizado pela Braspag.|
|**Client ID**|Client ID da loja habilitado para split de pagamentos, disponibilizado pela Braspag.|
|**Client Secret**|Client secret da loja habilitado para split de pagamentos, disponibilizado pela Braspag.|

### Marketplace General Config

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Marketplace General Config":
![Marketplace General Config]({{ site.baseurl_root }}/images/braspag/pagador/magento-marketplace-generalconfig.png)

|Campo|Descrição|
|---|---|
|**Does the Marketplace participate in sales?**|Ativa ("Yes") ou inativa ("No") a participação da loja nas vendas.|
|**Marketplace sales participation type**|Seleciona o tipo de participação da loja nas vendas.<br>"Fixed Value" - valor fixo. / "Percent" - em porcentagem.|
|**Fixed value in sales participation**|Valor fixo que será direcionado à loja durante o split de pagamentos caso a loja participe das vendas no tipo de participação "Fixed value".|
|**Percent value in sales participation**|Percentual que será direcionado à loja durante o split de pagamentos caso a loja participe das vendas no tipo de participação "Percent".|

# Clientes

Seguem instruções para configuração de **Dados do Cliente**.

1. No menu, acessar `Lojas` > `Configurações`;
2. Acessar a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clicar em `Braspag` > `Customer Config`.

## Address

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Address":
![Address]({{ site.baseurl_root }}/images/braspag/pagador/magento-customer-config.png)

|Campo|Descrição|
|---|---|
|**Should we sanitize address data?**|Ativa ("Yes") ou desativa ("No") a formatação do campo "bairro" do endereço do cliente.|
|**District Dictionary**|Palavras a serem substituídas durante a formatação do campo "bairro" do endereço do cliente.|
|**Street Attribute**|Atributo utilizado no campo "logradouro" do endereço do cliente.|
|**Number Attribute**|Atributo utilizado no campo "número" do endereço do cliente.|
|**Complement Attribute**|Atributo utilizado no campo "complemento" do endereço do cliente.|
|**District Attribute**|Atributo utilizado no campo "bairro" do endereço do cliente.|
|**Customer Identity (CPF/CNPJ) Attribute**|Atributo utilizado no campo "CPF/CNPJ" do cliente.|

# Boleto

Seguem instruções para acesso e configurações específicas para o método de pagamento **boleto**.

1. No menu, acessar `Lojas` > `Configurações`;
2. Acessar a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clicar em `Braspag` > `Pagador Transaction` > `Boleto`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Boleto":
![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/magento-boleto-config.png)

|Campo|Descrição|
|---|---|
|**Enabled**|Ativa ("Yes") ou desativa ("No") o método de pagamento boleto.|
|**Title**|Título do método de pagamento boleto exibido no checkout.|
|**Type**|*Provider* utilizado para o método de pagamento boleto.|
|**Demonstrative**|Instruções de pagamento no boleto para o cliente.|
|**Instructions**|Instruções de pagamento no boleto para o banco.|
|**Assignor**|Nome do cedente para o método de pagamento boleto.|
|**Assignor Address**|Endereço do cedente para o método de pagamento boleto.|
|**Identification**|CNPJ do cedente para o método de pagamento boleto.|
|**Expiration Day**|Dias para a expiração do boleto.|
|**New Order Status**|Status padrão de um novo pedido para o método de pagamento boleto.|
|**Sort Order**|Ordem de exibição do método de pagamento boleto no front da loja.|

## Payment Split

A imagem a seguir mostra os campos de configuração a serem preenchidos para boletos na seção "Payment Split":
![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/magento-boleto-config.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou desativa ("No") o split de pagamento para o método de pagamento boleto.|
|**Split Type**|Tipo do split de pagamento para o método de pagamento boleto.<br>"Transactional" - o split de pagamento é enviado no momento da finalização do pedido. / "Transactional Post" - o split de pagamento é enviado em um momento posterior ao da finalização do pedido. Esse momento é determinado nas configurações abaixo.|
|**Transactional Post Sends Request Automatically?**|Ativa ("Yes") ou desativa ("No") o envio do split de pagamento via CRON, de forma automática, ao invés do envio manual. Este campo só é exibido quando o tipo de split de pagamento é "Transactional Post".|
|**Transactional Post Sends Request Automatically After (Days)**|Após quantos dias da finalização do pedido o split de pagamento deverá ser enviado de forma automática (CRON). Este campo só é exibido quando o tipo de split de pagamento é "Transactional Post". De acordo com a documentação, a Braspag permite "20 dias" (campo numérico) como valor máximo.|
|**Default Store MDR**|Valor padrão da loja para MDR. Esse valor será enviado quando não existir nenhum valor padrão de MDR vinculado ao vendedor ou aos itens de venda.|
|**Default Store Fee**|Valor padrão da loja para Fee. Esse valor será enviado quando não existir nenhum valor padrão de Fee vinculado ao vendedor ou aos itens de venda.|

## Visão do Método de Pagamento após a Configuração na Loja

![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/magento-boleto-transaction.png)

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
