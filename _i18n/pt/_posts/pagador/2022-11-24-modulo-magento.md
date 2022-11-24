---
layout: tutorial
title:  Módulo Magento 2.0
description: Como Integrar sua Loja Magento com o Módulo de Pagamentos Braspag
toc_footers: false
categories: tutorial
translated: true
sort_order: 1
tags:
    - 2. Módulos e SDKs
 
---

# Integração do Módulo Magento 2.0

# Instalação

## Pré-Requisitos Técnicos

Para saber quais os requisitos técnicos de infraestrutura para a instalação do módulo Magento, consulte o [Guia de Instalação](https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html) na documentação oficial do Magento.

<aside class="notice">A versão recomendada do Magento é 2.4.3 ou superior.</aside>

<aside class="warning">As versões Magento entre 2.3.0. e 2.4.2 não estão recebendo atualizações no módulo Braspag. </aside>

## Instalação do Módulo Base

### Instalação via Composer

1. Acesse o servidor via SSH.
2. Localize a raiz do projeto e execute os seguintes comandos:

```
composer require braspag/pagador-module-magento
composer update
bin/magento module:enable Braspag_BraspagPagador
bin/magento setup:upgrade
bin/magento setup:di:compile
```

> Você também pode fazer o download do conector direto no nosso [GitHub](https://github.com/Braspag/pagador-module-magento){:target="_blank"}.

# Configuração

## Configurações Gerais

Seguem instruções de acesso para as configurações gerais do módulo Braspag:

1. Faça login no admin do Magento;
2. No menu, acesse `Lojas` > `Configurações`;
3. Acesse a aba `Vendas` > `Métodos de Pagamento`;
4. Na lista de Métodos de Pagamento, clique em `Braspag`.

## Configurações Globais

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Global Settings** do plugin Braspag:
![Global Settings]({{ site.baseurl_root }}/images/braspag/pagador/magento-global-settings.png)

|Campo|Descrição|
|---|---|
|**Merchant ID**|ID da loja, disponibilizado pela Braspag.|
|**Merchant Key**|Chave da loja, disponibilizada pela Braspag.|
|**Merchant Name**|Nome da loja, disponibilizado pela Braspag.|
|**Establishment Code**|Código de estabelecimento da loja, disponibilizado pela Braspag.|
|**MCC**|*Merchant Category Code* da loja, disponibilizado pela Braspag.|
|**Test Mode Active**|Ativa ou desativa o modo de testes no plugin. Quando ativado, as transações serão efetuadas no ambiente Sandbox.|
|**Return URL**|URL de retorno após a finalização da autenticação do método de pagamento cartão de débito.|

## Autenticação OAuth

Essa autenticação irá criar o token que deve ser enviado nas requisições para a Braspag. Seguem instruções para configuração da autenticação **OAuth**: 

1. No menu, acesse `Lojas` > `Configurações`;
2. Acesse a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clique em `Braspag` > `OAuth2 - Config`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "OAuth2 - Config":
![OAuth2 - Config]({{ site.baseurl_root }}/images/braspag/pagador/magento-oauth.png)

|Campo|Descrição|
|---|---|
|**`Client ID`**|ID do cliente, disponibilizado pela Braspag.|
|**`Client Secret`**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Antifraude

Seguem as instruções de acesso para ativação do **Anti Fraud**:

1. No menu, acesse `Lojas` > `Configurações`;
2. Acesse a aba `Braspag` > `Anti Fraud`.

A imagem a seguir mostra o campo de configuração a ser preenchido na seção **General**:
![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/magento-antifraud-general.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ("Yes") ou desativa ("No") o antifraude.|

Além da ativação do antifraude, nesta aba são também configurados o Fingerprint, as opções de sequência e captura do antifraude e os MDDs (Merchant Defined Data).

### FingerPrint

O FingerPrint é uma funcionalidade utilizada para identificar o dispositivo do comprador.

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
|**Sequence**|Sequência do processamento do antifraude.<br>"Analyse First" - é efetuada a análise de fraude e depois a autorização. / "Authorize First" - é efetuada a autorização e depois a análise de fraude. <br> Obs.: Clientes utilizando revisão manual devem operar no fluxo "Authorize First".|
|**Sequence Criteria**|Critério da sequência do processamento.<br>"On Success" - realiza a análise apenas quando a transação é efetuada com sucesso. / "Always" - a análise sempre será efetuada.|
|**Capture On Low Risk**|Ativa ("Yes") ou desativa ("No") a captura em caso de baixo risco na transação.|
|**Void On High Risk**|Ativa ("Yes") ou desativa ("No") o estorno automático em caso de alto risco na transação.|

### MDDs

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "MDD's":
![MDD's]({{ site.baseurl_root }}/images/braspag/pagador/magento-antifraud-mdds.png)

|Campo|Descrição|
|---|---|
|**Customer Fetch Self Shipping Method**|Método de entrega do cliente.|
|**Store Code From Customer Fetch Self**|Código da loja do cliente.|
|**Vertical Segment**|Segmento da loja.|
|**Store Identity (CNPJ)**|CNPJ da loja.|
|**Category Attribute Code**|Código do atributo da categoria.|

## Autenticação 3DS 2.0

A autenticação 3DS 2.0 é utilizada para a criação do token em requisições na Braspag. Consulte o nosso [Manual 3DS 2.0](https://braspag.github.io//manualp/emv3ds) e conheça suas vantagens.
<br/>Para obter mais informações sobre como utilizar a Autenticação 3DS 2.0 em sua loja, entre em contato com o nosso Comercial (comercial@braspag.com.br).

Seguem instruções para configuração da autenticação OAuth para a **Autenticação 3DS 2.0**:

1. No menu, acesse `Lojas` > `Configurações`;
2. Acesse a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clique em `Braspag` > `Authentication 3DS 2.0 Config`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Authentication 3DS 2.0 - Config**:
![Authentication 3DS 2.0 Config]({{ site.baseurl_root }}/images/braspag/pagador/magento-authentication.png)

|Campo|Descrição|
|---|---|
|**Client ID**|ID do cliente, disponibilizado pela Braspag.|
|**Client Secret**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Post de Notificação

O módulo Magento possui um endpoint criado e preparado para receber as notificações de atualização de status da transação, como um boleto que foi pago, por exemplo. Assim, são feitas atualizações dos pedidos na loja.
<br/>Para configurar a URL de sua loja aqui na Braspag, entre em contato conosco informando o seu `MerchantID` e a "URL de Notificação".

<aside class="notice">http://URL_DA_LOJA/braspag-pagador/post/notification (URL de Notificação para o Módulo Magento).</aside>

Consulte o [Manual do Pagador](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o) para mais informações sobre o Post de Notificação.

# Clientes

Seguem instruções para configuração de **Dados do Cliente**:

1. No menu, acesse `Lojas` > `Configurações`;
2. Acesse a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clique em `Braspag` > `Customer Config`.

## Address

A imagem a seguir mostra os campos de configuração com os respectivos valores a serem utilizados na seção **Address**:
![Address]({{ site.baseurl_root }}/images/braspag/pagador/magento-customer-config.png)

|Campo|Descrição|Valor|
|---|---|---|
|**Should we sanitize address data?**|Ativa ("Yes") ou desativa ("No") a formatação do campo "bairro" do endereço do cliente.|"Yes"|
|**District Dictionary**|Palavras a serem substituídas durante a formatação do campo "bairro" do endereço do cliente.|"Neighborhood-Nb.;Housing-Hs"|
|**Street Attribute**|Atributo utilizado no campo "logradouro" do endereço do cliente.|"street_1"|
|**Number Attribute**|Atributo utilizado no campo "número" do endereço do cliente.|"street_2"|
|**Complement Attribute**|Atributo utilizado no campo "complemento" do endereço do cliente.|"street_3"|
|**District Attribute**|Atributo utilizado no campo "bairro" do endereço do cliente.|"street_4"|
|**Customer Identity (CPF/CNPJ) Attribute**|Atributo utilizado no campo "CPF/CNPJ" do cliente.|"customer_taxvat"|

# Boleto

Seguem instruções para acesso e configurações específicas para o método de pagamento **Boleto**:

1. No menu, acesse `Lojas` > `Configurações`;
2. Acesse a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clique em `Braspag` > `Pagador Transaction` > `Boleto`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Boleto**:
![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/magento-boleto-config.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ("Yes") ou desativa ("No") o método de pagamento boleto.|
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

## Visualização Final

A visão do método de pagamento boleto, após a configuração na loja, será a seguinte:
![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/magento-boleto-transaction.png)

# Cartão de Crédito

Seguem instruções para acesso e configurações específicas para o método de pagamento **Cartão de Crédito**:

1. No menu, acesse `Lojas` > `Configurações`;
2. Acesse a aba `Vendas` > `Métodos de Pagamento`;
3. Na lista de Métodos de Pagamento, clique em `Braspag` > `Pagador Transaction` > `Credit Card`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Credit Card**:
![Credit Card]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-config.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ("Yes") ou desativa ("No") o método de pagamento cartão de crédito.|
|**Title**|Título do método de pagamento cartão de crédito exibido no checkout.|
|**Description**|Descrição do método de pagamento cartão de crédito exibido no checkout.|
|**Decimal Grand Total**|Decimais permitidos no valor total do pedido para o método de pagamento cartão de crédito.|
|**Payment Action**|Ação do pagamento.<br>"Authorize Only" - apenas autorização. / "Authorize and Capture" - autoriza e captura a transação.|
|**New Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito.|
|**Review Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito quando o mesmo fica com o status “Em revisão” na Braspag. **ANTI FRAUD***|
|**Reject Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito quando o mesmo fica com o status “Rejeitado” na Braspag. **ANTI FRAUD***|
|**Create Invoice on Notification Return Captured Status**|Ativa ("Yes") ou desativa ("No") a criação de fatura após notificação de captura no método de pagamento cartão de crédito.|
|**Sort Order**|Ordem de exibição do método de pagamento cartão de crédito no front da loja.|

## Types

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Types**:
![Types]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-types.png)

|Campo|Descrição|
|---|---|
|**Types**|Adquirentes e bandeiras disponíveis para o método de pagamento cartão de crédito.|

## Installments

A imagem a seguir mostra os campos de configuração a serem preenchidos para cartão de crédito na seção **Installments**:
![Installments]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-installments.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou inativa ("No") o parcelamento para o método de pagamento cartão de crédito.|
|**Number**|Número de parcelamentos para o método de pagamento cartão de crédito.|
|**Min Amount**|Valor mínimo para ativar o parcelamento para o método de pagamento cartão de crédito.|
|**Interest by Issuer**|Ativa os juros de parcelamento para o método de pagamento cartão de crédito.|
|**Interest Rate (%)**|Porcentagem dos juros para o método de pagamento cartão de crédito.|
|**Max Without Interest**|Determina a partir de qual número de parcelamentos os juros serão adicionados para o método de pagamento cartão de crédito.|

## Silent Order Post

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Silent Order Post**:
![Silent Order Post]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-sop.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou inativa ("No") a tokenização do cartão para o método de pagamento cartão de crédito.|

## Autenticação 3DS 2.0

A imagem a seguir mostra os campos de configuração a serem preenchidos para cartão de crédito na seção **Authentication 3DS 2.0**:
![Authentication 3DS 2.0]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-authentication.png)

|Campo|Descrição|
|---|---|
|**Enable**|Ativa ("Yes") ou desativa ("No") a Autenticação 3DS 2.0 para o método de pagamento cartão de crédito.|
|**MasterCard - Notify Only**|Ativa ("Yes") ou desativa ("No") a notificação para a autenticação 3DS 2.0 caso a bandeira do cartão seja MasterCard.|
|**Authorization On Error**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de erro na Autenticação 3DS 2.0.|
|**Authorization On Failure**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falha na Autenticação 3DS 2.0.|
|**Authorization On Unenrolled**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de não inscrição na Autenticação 3DS 2.0.|
|**Authorization On Unsupported Brand**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falta de suporte para a bandeira do cartão na Autenticação 3DS 2.0.|

## AVS (Address Verification Service)

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Avs**:
![AVS]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-avs.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou desativa ("No") o Serviço de Verificação do Endereço para o método de pagamento cartão de crédito. Quando ativado, a informação do endereço será relevante para a autorização da transação. Será feita a comparação do endereço salvo no banco emissor do cartão com o informado no momento da compra.|

## Checkout Card View

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Checkout Card View**:
![Checkout Card View]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-checkout.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou desativa ("No") a exibição da animação com a imagem do cartão de crédito no checkout para o método de pagamento cartão de crédito.|

## Visualização Final

A visão do método de pagamento cartão de crédito, após a configuração na loja, será a seguinte:
![Cartão de Crédito]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-transaction.png)

# Cartão Salvo (Just Click)

A função "JustClick" funcionará apenas com a contratação do serviço do Cartão Protegido da Braspag. Entre em contato conosco através do email "comercial@braspag.com.br" para mais detalhes.

Seguem instruções para acesso e configurações específicas para o método de pagamento **Cartão de Crédito Salvo (JustClick)**:

1. Faça login no admin do Magento;
2. No menu, acesse `Lojas` > `Configurações`;
3. Acesse a aba `Vendas` > `Métodos de Pagamento`;
4. Na lista de Métodos de Pagamento, clique em `Braspag` > `Credit Card JustClick`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Credit Card JustClick (Token)**:
![Credit Card JustClick]({{ site.baseurl_root }}/images/braspag/pagador/magento-justclick-token.png)

<aside class="warning">Quando ativado o JustClick, todas as configurações informadas para o método cartão de crédito serão aplicadas, com exceção das configurações abaixo, que irão sobrescrevê-las.</aside>

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ("Yes") ou desativa ("No") o método de pagamento cartão de crédito JustClick.|
|**Title**|Título do método de pagamento cartão de crédito JustClick exibido no checkout.|
|**Payment Action**|Ação do pagamento, no momento de fechamento do pedido no checkout da loja.<br>"Authorize Only" - apenas autorização. / "Authorize and Capture" - autoriza e captura a transação.|
|**New Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito JustClick.|
|**Sort Order**|Ordem de exibição do método de pagamento cartão de crédito no front da loja.|

## Installments

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Installments**:
![Installments]({{ site.baseurl_root }}/images/braspag/pagador/magento-justclick-installments.png)

|Campo|Descrição|
|---|---|
|**Active**|Adquirentes e bandeiras disponíveis para o método de pagamento cartão de crédito JustClick.|
|**Number**|Número de parcelamentos para o método de pagamento cartão de crédito JustClick.|
|**Min Amount**|Valor mínimo para ativar o parcelamento para o método de pagamento cartão de crédito JustClick.|
|**Interest by Issuer**|Ativa os juros de parcelamento para o método de pagamento cartão de crédito JustClick.|
|**Interest Rate (%)**|Porcentagem dos juros para o método de pagamento cartão de crédito JustClick.|
|**Max Without Interest**|Determina a partir de qual número de parcelamentos os juros serão adicionados para o método de pagamento cartão de crédito JustClick.|

## Visualização Final

A visão do método de pagamento cartão de crédito JustClick, após a configuração na loja, será a seguinte:
![Cartão de Crédito JustClick]({{ site.baseurl_root }}/images/braspag/pagador/magento-justclick-transaction.png)

# Cartão de Débito

Seguem instruções para acesso e configurações específicas para o método de pagamento **Cartão de Débito**:

1. Faça login no admin do Magento;
2. No menu, acesse `Lojas` > `Configurações`;
3. Acesse a aba `Vendas` > `Métodos de Pagamento`;
4. Na lista de Métodos de Pagamento, clique em `Braspag` > `Debit Card`.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Debit Card**:
![Debit Card]({{ site.baseurl_root }}/images/braspag/pagador/magento-debitcard-config.png)

|Campo|Descrição|
|---|---|
|**Enable/Disable**|Ativa ("Yes") ou desativa ("No") o método de pagamento cartão de débito.|
|**Title**|Título do método de pagamento cartão de débito exibido no checkout.|
|**New Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de débito.|
|**Super Débito**|Ativa ("Yes") ou desativa ("No") o super débito para o método de pagamento cartão de débito.|
|**Sort Order**|Ordem de exibição do método de pagamento cartão de débito no front da loja.|
|**Redirect After Place Order?**|Ativa ("Yes") ou desativa ("No") o redirecionamento para a autenticação após a finalização do pedido para o método de pagamento cartão de débito.|

## Types

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de débito na seção **Types**:
![Types]({{ site.baseurl_root }}/images/braspag/pagador/magento-debitcard-types.png)

|Campo|Descrição|
|---|---|
|**Types**|Adquirentes e bandeiras disponíveis para o método de pagamento cartão de débito.|

## Autenticação 3DS 2.0

A imagem a seguir mostra os campos de configuração a serem preenchidos para cartão de débito na seção **Authentication 3DS 2.0**:
![Authentication 3DS 2.0]({{ site.baseurl_root }}/images/braspag/pagador/magento-debitcard-authentication.png)

|Campo|Descrição|
|---|---|
|**Enable**|Ativa ("Yes") ou desativa ("No") a Autenticação 3DS 2.0 para o método de pagamento cartão de débito.|
|**MasterCard - Notify Only**|Ativa ("Yes") ou desativa ("No") a notificação para a autenticação 3DS 2.0 caso a bandeira do cartão seja MasterCard.|
|**Authorization On Error**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de erro na Autenticação 3DS 2.0.|
|**Authorization On Failure**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falha na Autenticação 3DS 2.0.|
|**Authorization On Unenrolled**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de não inscrição na Autenticação 3DS 2.0.|
|**Authorization On Unsupported Brand**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falta de suporte para a bandeira do cartão na Autenticação 3DS 2.0.|

## AVS (Address Verification Service)

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de débito na seção **Avs**:
![AVS]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-avs.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou desativa ("No") o Serviço de Verificação do Endereço para o método de pagamento cartão de crédito. Quando ativado, a informação do endereço será relevante para a autorização da transação. Será feita a comparação do endereço salvo no banco emissor do cartão com o informado no momento da compra.|

## Checkout Card View

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de débito na seção **Checkout Card View**:
![Checkout Card View]({{ site.baseurl_root }}/images/braspag/pagador/magento-debitcard-checkout.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou desativa ("No") a exibição de animação com a imagem do cartão de débito no checkout para o método de pagamento cartão de débito.|

## Visualização Final

A visão do método de pagamento cartão de débito, após a configuração na loja, será a seguinte:
![Cartão de Débito]({{ site.baseurl_root }}/images/braspag/pagador/magento-debitcard-transaction.png)