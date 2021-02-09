---
layout: tutorial
title:  Módulo WooCommerce 2.2.4
description: Como Integrar sua Loja WooCommerce com o Módulo de Pagamentos Braspag
toc_footers: false
categories: tutorial
translated: true
sort_order: 8
tags:
  - 1. Pagador

---

# Integração do Módulo WooCommerce 2.2.4

# Pré-Instalação e Instalação

## Requisitos Mínimos

* **Espaço no disco rígido:** 1GB+
* **Web Server:** Apache ou Nginx.
* **Database:** MySQL versão 5.0. 15 ou superior ou qualquer versão do MariaDB.
* **RAM:** 512MB+
* **PHP:** Versão 7.3 ou superior
* **Processador:** 1.0GHz+

## Versões Suportadas

* **Wordpress:** > 5.3.2
* **WooCommerce:** > 4.0.0

## Plugin Requerido

É necessária a instalação do plugin [Brazilian Market on WooCommerce](https://wordpress.org/plugins/woocommerce-extra-checkout-fields-for-brazil), da WordPress, para adicionar recursos de preenchimento de informações pessoais do cliente. 

## Instalação no WordPress

### Download do Plugin

Primeiramente deve-se acessar [este endereço](https://github.com/Braspag) e fazer o donwload do plugin.
<br/>

### Instalação do Plugin

1. Faça login no admin do WordPress;
2. No menu, acesse `Plugins` > `Add New`;
![Add New]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-add-new-plugin.png)
3. Na parte superior, clique em `Upload Plugin`;
![Upload Plugin]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-upload-plugin.png)
4. Clique em `Choose File`;
![Add New]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-choose-file.png)
5. Localize o arquivo baixado e clique em `Install Now`.

### Ativação do Plugin

1. No menu, acesse `Plugins` > `Installed Plugins`;
2. Localize o plugin "Gateway for Braspag on WooCommerce"
3. Caso exista o link "Activate" logo abaixo do nome do plugin, clique no mesmo.

# Configuração

## Configurações Gerais

Seguem instruções de acesso para as configurações gerais do módulo Braspag:

1. Faça login no admin do WordPress;
2. No menu, acesse `WooCommerce` > `Settings`;
3. Acesse a aba `Payments`;
4. Na lista de Métodos de Pagamento, clique em `Braspag`.

## Configurações Globais

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Global Settings" do plugin Braspag.
![Configurações Gerais]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-global-settings.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ou desativa o plugin.|
|**Test Mode**|Ativa ou desativa o modo de testes no plugin. Quando ativado, as transações serão efetuadas no ambiente Sandbox.|
|**Debug**|Ativa ou desativa a gravação dos logs das transações em arquivo físico.|
|**Merchant ID**|ID da loja, disponibilizado pela Braspag.|
|**Merchant Key**|Chave da loja, disponibilizada pela Braspag.|
|**Merchant Name**|Nome da loja, disponibilizado pela Braspag.|
|**Establishment Code**|Código de estabelecimento da loja, disponibilizado pela Braspag.|
|**MCC**|*Merchant Category Code* da loja, disponibilizado pela Braspag.|

## Autenticação OAuth

Essa autenticação é utilizada para a criação do token em requisições na Braspag.<br/>
A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "OAuth Authentication" do plugin Braspag.
![Autenticação OAuth]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-oauth-authentication.png)

|Campo|Descrição|
|---|---|
|**Client ID**|ID do cliente, disponibilizado pela Braspag.|
|**Client Secret**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Antifraude

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção “Anti Fraud”:
![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-antifraud.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ou desativa o antifraude.|
|**Send with Pagador Transaction**|Ativa ou desativa o envio das informações de antifraude junto com a transação do Pagador.|
|**Finger Print Org ID**|Fingerprint Org ID, disponibilizado pela Braspag.|
|**Finger Print Merchant ID**|Fingerprint Merchant ID, disponibilizado pela Braspag.|
|**Finger Print Use Order ID**|Ativa ou desativa a utilização do ID do pedido na composição do fingerprint.|
|**Options Sequence**|Sequência do processamento do antifraude.<br>"Analyse First" - é efetuada a análise de fraude e depois a autorização. / "Authorize First" - é efetuada a autorização e depois a análise de fraude. / "Analyse Only" - é efetuada apenas a análise de fraude na Braspag.<br> Obs.: Clientes utilizando revisão manual devem operar no fluxo "Authorize First".|
|**Options Sequence Criteria**|Critério da sequência do processamento.<br>"On Success" - realiza a análise apenas quando a transação é efetuada com sucesso. / "Always" - a análise sempre será efetuada.|
|**Options Capture On Low Risk**|Ativa ou desativa a captura em caso de baixo risco na transação.|
|**Options Void On High Risk**|Ativa ou desativa o estorno automático em caso de alto risco na transação.|

## Autenticação 3DS 2.0

A autenticação 3DS 2.0 é utilizada para a criação do token em requisições na Braspag. Consulte o nosso [Manual 3DS 2.0](https://braspag.github.io//manualp/emv3ds) e conheça suas vantagens.
<br/>Para obter mais informações sobre como utilizar a Autenticação 3DS 2.0 em sua loja, entre em contato com o nosso Comercial (comercial@braspag.com.br).

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção “Authentication 3DS 2.0”:
![Authentication 3DS 2.0]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-authentication-3ds.png)

|Campo|Descrição|
|---|---|
|**Client ID**|ID do cliente, disponibilizado pela Braspag.|
|**Client Secret**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Post de Notificação

Cadastre o endpoint **http://wordpress.local/_?wc-api=wc_braspag_** na URL da sua loja na Braspag, para que o webhook atualize os status de cobrança dos pedidos na loja.
<br/>Consulte o [Manual do Pagador](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o) para mais informações sobre o Post de Notificação.

# Clientes

## Plugin "Brazilian Market on WooCommerce"

Para o correto funcionamento do plugin WooCommerce, é necessário que seja instalado o plugin [Brazilian Market on WooCommerce](https://wordpress.org/plugins/woocommerce-extra-checkout-fields-for-brazil).
<br/>Com ele, as informações pessoais como CPF, bairro e número no endereço do cliente podem ser configuradas corretamente.

# Boleto

Seguem instruções para acesso e configurações específicas para o método de pagamento **Boleto**:

1. Faça login no admin do WordPress;
2. No menu, acesse `WooCommerce` > `Settings`;
3. Acesse a aba `Payments`;
4. Na lista de Métodos de Pagamento, clique em `Braspag Boleto`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Braspag Boleto":
![Braspag Boleto]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-braspag-boleto.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ou desativa o método de pagamento boleto.|
|**Title**|Título do método de pagamento boleto exibido no checkout.|
|**Description**|Descrição do método de pagamento boleto exibido no chekout.|
|**New Order Status**|Status padrão de um novo pedido para o método de pagamento boleto.|
|**Available Type**|*Provider* utilizado para o método de pagamento boleto.|
|**Demonstrative**|Instruções de pagamento no boleto para o cliente.|
|**Payment Instructions for Customer**|Instruções de pagamento no boleto para o cliente.|
|**Payment Instructions for Bank**|Instruções de pagamento no boleto para o banco.|
|**Label Print Button**|Título do botão de pagamento para o método de pagamento boleto.|
|**Days to Expire**|Dias para a expiração do boleto.|

## Visualização Final

A visão do método de pagamento do boleto, após a configuração na loja, será a seguinte:
![Visão Final Boleto]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-visao-boleto.png)

# Cartão de Crédito

Seguem instruções para acesso e configurações específicas para o método de pagamento **Cartão de Crédito**:

1. Faça login no admin do WordPress;
2. No menu, acesse `WooCommerce` > `Settings`;
3. Acesse a aba `Payments`;
4. Na lista de Métodos de Pagamento, clique em `Braspag Credit Card`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Braspag Credit Card":
![Braspag Cartão de Crédito]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-braspag-credit.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ou desativa o método de pagamento cartão de crédito.|
|**Title**|Título do método de pagamento cartão de crédito exibido no checkout.|
|**Description**|Descrição do método de pagamento cartão de crédito exibido no checkout.|
|**Payment Action**|Ação do pagamento.<br>"Authorize Only" - apenas autorização. / "Authorize and Capture" - autoriza e captura a transação.|
|**Save Credit Card Token**|Ativa ou desativa a possibilidade de salvar os dados do cartão de crédito. A ser autorizado por usuário no checkout.|
|**New Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito.|
|**Minimum Amount of Installments**|Quantidade mínima de parcelamento da compra.|
|**Maximum Installments**|Quantidade máxima de parcelamento da compra.|
|**Available Types**|*Providers* e bandeiras utilizados para o método de pagamento cartão de crédito.|

## Antifraude

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Anti Fraud":
![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-antifraud-credit.png)

|Campo|Descrição|
|---|---|
|Reject Order Status|Determina o status do pedido na loja, em caso de rejeição, após a análise de fraude.|
|Review Order Status|Determina o status do pedido na loja durante a análise de fraude.|

## Autenticação 3DS 2.0

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Authentication 3DS 2.0 for Credit Card":
![Autenticação 3DS 2.0]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-authentication-3ds-credit.png)

|Campo|Descrição|
|---|---|
|**Enable**|Ativa ou desativa a Autenticação 3DS 2.0 para o método de pagamento cartão de crédito.|
|**MasterCard - Notify Only**|Ativa ou desativa a notificação para a autenticação 3DS 2.0 caso a bandeira do cartão seja MasterCard.|
|**Authorization On Error**|Ativa ou desativa a autorização da transação em caso de erro na Autenticação 3DS 2.0.|
|**Authorization On Failure**|Ativa ou desativa a autorização da transação em caso de falha na Autenticação 3DS 2.0.|
|**Authorization On Unenrolled**|Ativa ou desativa a autorização da transação em caso de não inscrição na Autenticação 3DS 2.0.|
|**Authorization On Unsupported Brand**|Ativa ou desativa a autorização da transação em caso de falta de suporte para a bandeira do cartão na Autenticação 3DS 2.0.|

## Visualização Final

A visão do método de pagamento do cartão de crédito, após a configuração na loja, será a seguinte:
![Visão Final Cartão de Crédito]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-visao-credit.png)

# Cartão de Crédito Salvo (JustClick)

A função “JustClick” funcionará apenas com a contratação do serviço do Cartão Protegido da Braspag. Entre em contato conosco através do email “comercial@braspag.com.br” para mais detalhes.

Seguem instruções para acesso e configurações específicas para o método de pagamento Cartão de Crédito Salvo (JustClick):

1. Faça login no admin do WordPress;
2. No menu, acesse `WooCommerce` > `Settings`;
3. Acesse a aba `Payments`;
4. Na lista de Métodos de Pagamento, clique em `Braspag Credit Card JustClick`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Braspag Credit Card JustClick":
![Braspag Credit Card JustClick]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-confgerais-justclick.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ou desativa o método de pagamento cartão de crédito.|
|**Title**|Título do método de pagamento cartão de crédito exibido no checkout.|
|**Description**|Descrição do método de pagamento cartão de crédito exibido no checkout.|
|**Payment Action**|Ação do pagamento.<br>"Authorize Only" - apenas autorização. / "Authorize and Capture" - autoriza e captura a transação.|
|**New Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito.|
|**Minimum Amount of Installments**|Quantidade mínima de parcelamento da compra.|
|**Maximum Installments**|Quantidade máxima de parcelamento da compra.|
|**Available Types**|*Providers* e bandeiras utilizados para o método de pagamento cartão de crédito.|

## Antifraude

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Anti Fraud":
![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-antifraud-justclick.png)

|Campo|Descrição|
|---|---|
|Reject Order Status|Determina o status do pedido na loja, em caso de rejeição, após a análise de fraude.|
|Review Order Status|Determina o status do pedido na loja durante a análise de fraude.|

## Autenticação 3DS 2.0

Utilize as mesmas configurações descritas no método de pagamento [Cartão de Crédito](#cartão-de-crédito).

## Visualização Final

A visão do método de pagamento do Cartão de Crédito JustClick, após a configuração na loja, será a seguinte:
![Visão Final Cartão de Crédito]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-visao-justclick.png)

# Cartão de Débito

Seguem instruções para acesso e configurações específicas para o método de pagamento **Cartão de Débito**:

1. Faça login no admin do WordPress;
2. No menu, acesse `WooCommerce` > `Settings`;
3. Acesse a aba `Payments`;
4. Na lista de Métodos de Pagamento, clique em `Braspag Debit Card`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Braspag Debit Card":
![Braspag Cartão de Débito]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-confgerais-debit.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ou desativa o método de pagamento cartão de débito.|
|**Title**|Título do método de pagamento cartão de débito exibido no checkout.|
|**Description**|Descrição do método de pagamento cartão de débito exibido no checkout.|
|**Available Type**|*Provider* utilizado para o método de pagamento cartão de débito.|
|**Label Pay Button**|Título do botão de pagamento para o método de pagamento cartão de débito.|
|**Automatic Redirect**|Ativa ou desativa o redirecionamento automático para a autenticação do banco no checkout.|
|**Bank Return URL**|Determina a URL a que o usuário será direcionado após a autenticação no banco.|

## Autenticação 3DS 2.0

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Authentication 3DS 2.0 for Debit Card":
![Autenticação 3DS 2.0]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-authentication-3ds-debit.png)

|Campo|Descrição|
|---|---|
|**Enable**|Ativa ou desativa a Autenticação 3DS 2.0 para o método de pagamento cartão de débito.|
|**MasterCard - Notify Only**|Ativa ou desativa a notificação para a autenticação 3DS 2.0 caso a bandeira do cartão seja MasterCard.|
|**Authorization On Error**|Ativa ou desativa a autorização da transação em caso de erro na Autenticação 3DS 2.0.|
|**Authorization On Failure**|Ativa ou desativa a autorização da transação em caso de falha na Autenticação 3DS 2.0.|
|**Authorization On Unenrolled**|Ativa ou desativa a autorização da transação em caso de não inscrição na Autenticação 3DS 2.0.|
|**Authorization On Unsupported Brand**|Ativa ou desativa a autorização da transação em caso de falta de suporte para a bandeira do cartão na Autenticação 3DS 2.0.|

## Visualização Final

A visão do método de pagamento do cartão de débito, após a configuração na loja, será a seguinte:
![Visão Final Cartão de Débito]({{ site.baseurl_root }}/images/braspag/pagador/woocommerce-visao-debit.png)
