---
layout: tutorial
title:  Módulo Adobe Commerce - Marketplace
description: Como Integrar sua Loja Adobe Commerce com o Módulo de Pagamentos Braspag na Webjump
toc_footers: false
categories: tutorial
translated: true
sort_order: 2
tags:
    - 2. Módulos

---

# Integração do Módulo Adobe Commerce 2.0 para Marketplace

A plataforma Magento agora se chama Adobe Commerce. Para mais informações, consulte o site [Adobe Commerce](https://business.adobe.com/br/products/magento/magento-commerce.html){:target="_blank"}.

# Instalação

## Pré-Requisitos Técnicos

Para saber quais os requisitos técnicos de infraestrutura para a instalação do módulo Adobe Commerce, consulte o [Guia de Instalação](https://experienceleague.adobe.com/docs/commerce-operations/installation-guide/system-requirements.html){:target="_blank"} na documentação oficial do Adobe Commerce.

<aside class="notice">A versão 3.18 do módulo é compatível com a versão 2.4.3, 2.4.4 e 2.4.5 do Adobe Commerce. Versões superiores do Adobe Commerce necessitam de atualização no módulo.</aside>

<aside class="warning">As versões Adobe Commerce entre 2.3.0. e 2.4.2 não estão recebendo atualizações no módulo Braspag. </aside>

## Instalação do Módulo Base

### Instalação via Composer

1. Acesse o servidor via SSH.
2. Localize a raiz do projeto e execute os seguintes comandos:

```
composer require braspag/magento2-module-braspagpagador
composer update
bin/magento module:enable Braspag_BraspagPagador
bin/magento setup:upgrade
```

> Você também pode fazer o download do conector direto no nosso [GitHub](https://github.com/Braspag/pagador-module-magento){:target="_blank"}.

# Post de Notificação

O módulo Adobe Commerce possui um endpoint criado e preparado para receber as notificações de atualização de status da transação, como um boleto que foi pago, por exemplo. Assim, são feitas atualizações dos pedidos na loja.

<br/>Para configurar a URL de sua loja na Braspag, entre em contato conosco informando o seu `MerchantID` e a "URL de Notificação".

<aside class="notice">https://URL_DA_LOJA/rest/V1/braspag/notification/save (URL de Notificação para o Módulo Adobe Commerce).</aside>

Consulte o [Manual do Pagador](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o){:target="_blank"} para mais informações sobre o Post de Notificação.

# Configuração

Siga as instruções de acesso para as configurações gerais do módulo Braspag:

1. Faça login no admin do Adobe Commerce;
2. No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag**.

## Configurações Globais

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção Global Settings do plugin Braspag:
![Global Settings]({{ site.baseurl_root }}/images/braspag/pagador/magento/001-geral.png)

|Campo|Descrição|
|---|---|
|**ID do Comerciante**|ID da loja, disponibilizado pela Braspag.|
|**Merchant Key**|Chave da loja, disponibilizada pela Braspag.|
|**Merchant Name**|Nome da loja, disponibilizado pela Braspag.|
|**Establishment Code**|Código de estabelecimento da loja, disponibilizado pela Braspag.|
|**MCC**|*Merchant Category Code* da loja, disponibilizado pela Braspag.|
|**Test Mode Active**|Ativa ou desativa o modo de testes no plugin. Quando ativado, as transações serão efetuadas no ambiente Sandbox.|
|**Return URL**|URL de retorno após a finalização da autenticação do método de pagamento cartão de débito.|

## Autenticação OAuth

Essa autenticação irá criar o token que deve ser enviado nas requisições para a Braspag.  

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **OAuth2 - Config**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "OAuth2 - Config":
![OAuth2 - Config]({{ site.baseurl_root }}/images/braspag/pagador/magento/002-oauth.png)

|Campo|Descrição|
|---|---|
|**`Client ID`**|ID do cliente, disponibilizado pela Braspag.|
|**`Client Secret`**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Autenticação 3DS 2.0

A autenticação 3DS 2.0 é utilizada para a criação do token em requisições na Braspag. Consulte o nosso [Manual 3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"} e conheça suas vantagens.
<br/>Para obter mais informações sobre como utilizar a Autenticação 3DS 2.0 em sua loja, entre em contato com o nosso Comercial (comercial@braspag.com.br).

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Authentication 3DS 2.0 Config**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Authentication 3DS 2.0 - Config**:
![Authentication 3DS 2.0 Config]({{ site.baseurl_root }}/images/braspag/pagador/magento/003-3ds.png)

|Campo|Descrição|
|---|---|
|**Client ID**|ID do cliente, disponibilizado pela Braspag.|
|**Client Secret**|Chave secreta do cliente, disponibilizada pela Braspag.|

## Clientes

Seguem instruções para configuração de **Dados do Cliente**:

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Customer Config**.

A imagem a seguir mostra os campos de configuração com os respectivos valores a serem utilizados na seção **Address**:
![Address]({{ site.baseurl_root }}/images/braspag/pagador/adobe-commerce-customer-config.png)

|Campo|Descrição|Valor|
|---|---|---|
|**Should we sanitize address data?**|Ativa ("Yes") ou desativa ("No") a formatação do campo "bairro" do endereço do cliente.|"Yes"|
|**District Dictionary**|Palavras a serem substituídas durante a formatação do campo "bairro" do endereço do cliente.|"Neighborhood-Nb.;Housing-Hs"|
|**Street Attribute**|Atributo utilizado no campo "logradouro" do endereço do cliente.|"street_1"|
|**Number Attribute**|Atributo utilizado no campo "número" do endereço do cliente.|"street_2"|
|**Complement Attribute**|Atributo utilizado no campo "complemento" do endereço do cliente.|"street_3"|
|**District Attribute**|Atributo utilizado no campo "bairro" do endereço do cliente.|"street_4"|
|**Customer Identity (CPF/CNPJ) Attribute**|Atributo utilizado no campo "CPF/CNPJ" do cliente.|**Valores possíveis**:<br> - "vat_id": se deseja configurar CPF endereço;<br>- "customer_taxvat": se deseja configurar CPF cadastro.|

## Boleto

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Pagador Transaction** > **Boleto**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Boleto**:
![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/magento/006a-boleto.png)

|Campo|Descrição|
|---|---|
|**Habilitado**|Ativa ("Yes") ou desativa ("No") o método de pagamento boleto.|
|**Título**|Título do método de pagamento boleto exibido no checkout.|
|**Tipo**|*Provider* utilizado para o método de pagamento boleto.|
|**Demonstrative**|Instruções de pagamento no boleto para o cliente.|
|**Instruções**|Instruções de pagamento no boleto para o banco.|
|**Assignor**|Nome do cedente para o método de pagamento boleto.|
|**Assignor Address**|Endereço do cedente para o método de pagamento boleto.|
|**Identificaçãp**|CNPJ do cedente para o método de pagamento boleto.|
|**Expirations Day**|Dias para a expiração do boleto.|
|**Novo status do pedido**|Status padrão de um novo pedido para o método de pagamento boleto.|
|**Ordenação**|Ordem de exibição do método de pagamento boleto no front da loja.|

**Visualização Final**

A visão do método de pagamento boleto, após a configuração na loja, será a seguinte:
![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/magento-boleto-transaction.png)

## Cartão de Crédito

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Pagador Transaction** > **Credit Card**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Credit Card**:
![Credit Card]({{ site.baseurl_root }}/images/braspag/pagador/magento/006b-credito.png)

|Campo|Descrição|
|---|---|
|**Habilitado**|Ativa ("Yes") ou desativa ("No") o método de pagamento cartão de crédito.|
|**Título**|Título do método de pagamento cartão de crédito exibido no checkout.|
|**Decimal Grand Total**|Decimais permitidos no valor total do pedido para o método de pagamento cartão de crédito.|
|**Ação de Pagamento**|Ação do pagamento.<br>"Authorize Only" - apenas autorização. / "Authorize and Capture" - autoriza e captura a transação.|
|**Novo status do pedido**|Status padrão de um novo pedido para o método de pagamento cartão de crédito.|
|**Review Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito quando o mesmo fica com o status “Em revisão” na Braspag. **ANTI FRAUD***|
|**Reject Order Status**|Status padrão de um novo pedido para o método de pagamento cartão de crédito quando o mesmo fica com o status “Rejeitado” na Braspag. **ANTI FRAUD***|
|**Create Invoice on Notification Return Captured Status**|Ativa ("Yes") ou desativa ("No") a criação de fatura após notificação de captura no método de pagamento cartão de crédito.|
|**Ordenação**|Ordem de exibição do método de pagamento cartão de crédito no front da loja.|

### Types

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Types**:
![Types]({{ site.baseurl_root }}/images/braspag/pagador/magento/006b1-creditotype.png)

|Campo|Descrição|
|---|---|
|**Types**|Adquirentes e bandeiras disponíveis para o método de pagamento cartão de crédito.|

#### Número de Parcelas

A imagem a seguir mostra os campos de configuração a serem preenchidos para cartão de crédito na seção **Installments**:
![Installments]({{ site.baseurl_root }}/images/braspag/pagador/magento/006b2-creditoparcelas.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Ativa ("Yes") ou inativa ("No") o parcelamento para o método de pagamento cartão de crédito.|
|**Número**|Número de parcelamentos para o método de pagamento cartão de crédito.|
|**Min Amount**|Valor mínimo para ativar o parcelamento para o método de pagamento cartão de crédito.|
|**Interest by Issuer**|Ativa os juros de parcelamento para o método de pagamento cartão de crédito.|

### Silent Order Post

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Silent Order Post**:
![Silent Order Post]({{ site.baseurl_root }}/images/braspag/pagador/magento/006b3-creditosilent.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Ativa ("Yes") ou inativa ("No") a tokenização do cartão para o método de pagamento cartão de crédito.|

### Autenticação 3DS 2.0

A imagem a seguir mostra os campos de configuração a serem preenchidos para cartão de crédito na seção **Authentication 3DS 2.0**:
![Authentication 3DS 2.0]({{ site.baseurl_root }}/images/braspag/pagador/magento/006b4-credito3ds.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Ativa ("Yes") ou desativa ("No") a Autenticação 3DS 2.0 para o método de pagamento cartão de crédito.|
|**Master Card - Notify Only**|Ativa ("Yes") ou desativa ("No") a notificação para a autenticação 3DS 2.0 caso a bandeira do cartão seja MasterCard.|
|**Authorization On Error**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de erro na Autenticação 3DS 2.0.|
|**Authorization On Failure**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falha na Autenticação 3DS 2.0.|
|**Authorization On Unenrolled**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de não inscrição na Autenticação 3DS 2.0.|
|**Authorization On Unsupported Brand**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falta de suporte para a bandeira do cartão na Autenticação 3DS 2.0.|

### AVS (Address Verification Service)

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Avs**:
![AVS]({{ site.baseurl_root }}/images/braspag/pagador/magento/006b6-creditoavs.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Ativa ("Yes") ou desativa ("No") o Serviço de Verificação do Endereço para o método de pagamento cartão de crédito. Quando ativado, a informação do endereço será relevante para a autorização da transação. Será feita a comparação do endereço salvo no banco emissor do cartão com o informado no momento da compra.|

### Checkout Card View

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Checkout Card View**:
![Checkout Card View]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-checkout.png)

|Campo|Descrição|
|---|---|
|**Active**|Ativa ("Yes") ou desativa ("No") a exibição da animação com a imagem do cartão de crédito no checkout para o método de pagamento cartão de crédito.|

### Dois Cartões

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de crédito na seção **Dois Cartões**:

![Dois Cartoes View]({{ site.baseurl_root }}/images/braspag/pagador/magento/magento-creditcard-doiscartoes.png)

|Campo|Descrição|
|---|---|
|**Habilitado**|Ativa (“Sim”) ou desativa (“Não”) realizar o pagamento com dois cartões.|

**Visualização Final**

A visão do método de pagamento cartão de crédito, após a configuração na loja, será a seguinte:
![Cartão de Crédito]({{ site.baseurl_root }}/images/braspag/pagador/magento-creditcard-transaction.png)

## Cartão Salvo (Just Click)

A função "JustClick" funcionará apenas com a contratação do serviço do Cartão Protegido da Braspag. Entre em contato conosco através do email "comercial@braspag.com.br" para mais detalhes.

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Credit Card JustClick**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Credit Card JustClick (Token)**:
![Credit Card JustClick]({{ site.baseurl_root }}/images/braspag/pagador/magento/006c-cartaoprotegido.png)

<aside class="warning">Quando ativado o JustClick, todas as configurações informadas para o método cartão de crédito serão aplicadas, com exceção das configurações abaixo, que irão sobrescrevê-las.</aside>

|Campo|Descrição|
|---|---|
|**Habilitado**|Ativa ("Yes") ou desativa ("No") o método de pagamento cartão de crédito JustClick.|
|**Título**|Título do método de pagamento cartão de crédito JustClick exibido no checkout.|
|**Ação de pagamento**|Ação do pagamento, no momento de fechamento do pedido no checkout da loja.<br>"Authorize Only" - apenas autorização. / "Authorize and Capture" - autoriza e captura a transação.|
|**Novo status do pedido**|Status padrão de um novo pedido para o método de pagamento cartão de crédito JustClick.|
|**Ordenação**|Ordem de exibição do método de pagamento cartão de crédito no front da loja.|
|**Automatically Disable previously saved cards when saving a new card**|Desabilitar automaticamente o cartão salvo anteriormente ao salvar novo cartão. Default: Não|

### Número de Parcelas

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Installments**:
![Installments]({{ site.baseurl_root }}/images/braspag/pagador/magento/006c1-cartaoprotegidoparcela.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Adquirentes e bandeiras disponíveis para o método de pagamento cartão de crédito JustClick.|
|**Número**|Número de parcelamentos para o método de pagamento cartão de crédito JustClick.|
|**Min Amount**|Valor mínimo para ativar o parcelamento para o método de pagamento cartão de crédito JustClick.|
|**Interest by Issuer**|Ativa os juros de parcelamento para o método de pagamento cartão de crédito JustClick.|

## Cartão de Débito

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Debit Card**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Debit Card**:
![Debit Card]({{ site.baseurl_root }}/images/braspag/pagador/magento/006d-debito.png)

|Campo|Descrição|
|---|---|
|**Habilitado**|Ativa ("Yes") ou desativa ("No") o método de pagamento cartão de débito.|
|**Título**|Título do método de pagamento cartão de débito exibido no checkout.|
|**Novo status do pedido**|Status padrão de um novo pedido para o método de pagamento cartão de débito.|
|**Super Débito**|Ativa ("Yes") ou desativa ("No") o super débito para o método de pagamento cartão de débito.|
|**Ordenação**|Ordem de exibição do método de pagamento cartão de débito no front da loja.|
|**Redirect After Place Order?**|Ativa ("Yes") ou desativa ("No") o redirecionamento para a autenticação após a finalização do pedido para o método de pagamento cartão de débito.|

### Types

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de débito na seção **Types**:
![Types]({{ site.baseurl_root }}/images/braspag/pagador/magento/006d1-debitotypes.png)

|Campo|Descrição|
|---|---|
|**Types**|Adquirentes e bandeiras disponíveis para o método de pagamento cartão de débito.|

### Autenticação 3DS 2.0

A imagem a seguir mostra os campos de configuração a serem preenchidos para cartão de débito na seção **Authentication 3DS 2.0**:
![Authentication 3DS 2.0]({{ site.baseurl_root }}/images/braspag/pagador/magento/006d2-debito3ds.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Ativa ("Yes") ou desativa ("No") a Autenticação 3DS 2.0 para o método de pagamento cartão de débito.|
|**Master Card - Notify Only**|Ativa ("Yes") ou desativa ("No") a notificação para a autenticação 3DS 2.0 caso a bandeira do cartão seja MasterCard.|
|**Authorization On Error**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de erro na Autenticação 3DS 2.0.|
|**Authorization On Failure**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falha na Autenticação 3DS 2.0.|
|**Authorization On Unenrolled**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de não inscrição na Autenticação 3DS 2.0.|
|**Authorization On Unsupported Brand**|Ativa ("Yes") ou desativa ("No") a autorização da transação em caso de falta de suporte para a bandeira do cartão na Autenticação 3DS 2.0.|

### AVS (Address Verification Service)

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de débito na seção **Avs**:
![AVS]({{ site.baseurl_root }}/images/braspag/pagador/magento/006d3-debitocheckout-view.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Ativa ("Yes") ou desativa ("No") o Serviço de Verificação do Endereço para o método de pagamento cartão de crédito. Quando ativado, a informação do endereço será relevante para a autorização da transação. Será feita a comparação do endereço salvo no banco emissor do cartão com o informado no momento da compra.|

### Checkout Card View

A imagem a seguir mostra o campo de configuração a ser preenchido para cartão de débito na seção **Checkout Card View**:
![Checkout Card View]({{ site.baseurl_root }}/images/braspag/pagador/magento/006d3-debitocheckout-view.png)

|Campo|Descrição|
|---|---|
|**Ativo**|Ativa ("Yes") ou desativa ("No") a exibição de animação com a imagem do cartão de débito no checkout para o método de pagamento cartão de débito.|

A visão do método de pagamento cartão de débito, após a configuração na loja, será a seguinte:
![Cartão de Débito]({{ site.baseurl_root }}/images/braspag/pagador/magento/006d4-debitoview.png)

## Pix

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Pagador Transaction**  > **Pix**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Pix**:

![Pix]({{ site.baseurl_root }}/images/braspag/pagador/magento/006d5-pix.png)

|Campo|Descrição|
|---|---|
|**Habilitado**|Habilita (“Sim”) ou não (“Não”) o tipo de pagamento Pix.|
|**Título**|Título exibido no método de pagamento da tela de checkout|
|**Tipo**|Nome do provedor do meio de pagamento. Neste caso, “Cielo30” ou “Bradesco2”. “Simulado” é o provedor para o ambiente sandbox e deve ser utilizado com as credenciais de sandbox.|
|**Demonstrative**|Mensagem informativa exibida na tela de checkout da loja.|
|**Identificação**|Título exibido no aplicativo bancário.|
|**Expirations Time**|Tempo de expiração do QR Code, em minutos. Este tempo varia de acordo com o provedor.|
|**Novo status do pedido**|Configura a situação do pedido para novo pedido. As opções são exibidas conforme configurado no menu Lojas > Situação do Pedido. Default: ‘Pending’.|
|**Captured Order Status**|Configura a situação do pedido para pedido capturado. As opções são exibidas conforme configurado no menu Lojas > Situação do Pedido. Default: ‘Processing’.|
|**Ordenação***|Ordem de exibição do método de pagamento na tela de checkout da loja.|
|**Automatic canceling of expired orders**|Habilita (“Sim”) ou não (“Não”) o cancelamento de pedidos que tiveram o QR Code expirado.|
|**Logo**|Imagem para ser exibida ao lado do QR Code.|
|**Display Title next to Logo**|Título exibido ao lado da imagem.|

## Voucher

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Pagador Transaction**  > **Voucher**.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção **Voucher**:

![Voucher]({{ site.baseurl_root }}/images/braspag/pagador/magento/magento-voucher.png)

|Campo|Descrição|
|---|---|
|**Habilitado**|Ativa (“Sim”) ou desativa (“Não”) o método de pagamento voucher.|
|**Título**|Título do método de pagamento cartão de crédito exibido no checkout.|
|**Tipo**|Adquirentes e bandeiras disponíveis para o método de pagamento voucher.|

# Antifraude

Seguem as instruções de acesso para ativação do **Anti Fraud**:

No menu, acesse **Lojas** > **Configuração** > **Vendas** > **Formas de Pagamento** > **Outros meios de pagamento** > **Braspag** > **Anti Fraud**.

A imagem a seguir mostra o campo de configuração a ser preenchido na seção **General**:
![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/magento/007a-antifraudegeral.png)

|Campo|Descrição|
|---|---|
|**Habilitado**|Ativa ("Yes") ou desativa ("No") o antifraude.|

Além da ativação do antifraude, nesta aba são também configurados o Fingerprint, as opções de sequência e captura do antifraude e os MDDs (Merchant Defined Data).

## FingerPrint

O FingerPrint é uma funcionalidade utilizada para identificar o dispositivo do comprador.

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "FingerPrint":
![Fingerprint]({{ site.baseurl_root }}/images/braspag/pagador/magento/007a-antifraude-fingerprint.png)

|Campo|Descrição|
|---|---|
|**Org ID**|Fingerprint Org ID, disponibilizado pela Braspag.|
|**ID do Comerciante**|Fingerprint Merchant ID, disponibilizado pela Braspag.|
|**Use Order ID to Fingerprint**|Ativa ("Yes") ou desativa ("No") a utilização do ID do pedido na composição do fingerprint.|

## Options

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "Options":
![Options]({{ site.baseurl_root }}/images/braspag/pagador/magento/007a-antifraude-opcoes.png)

|Campo|Descrição|
|---|---|
|**Sequence**|Sequência do processamento do antifraude.<br>"Analyse First" - é efetuada a análise de fraude e depois a autorização. / "Authorize First" - é efetuada a autorização e depois a análise de fraude. <br> Obs.: Clientes utilizando revisão manual devem operar no fluxo "Authorize First".|
|**Sequence Criteria**|Critério da sequência do processamento.<br>"On Success" - realiza a análise apenas quando a transação é efetuada com sucesso. / "Always" - a análise sempre será efetuada.|
|**Capture On Low Risk**|Ativa ("Yes") ou desativa ("No") a captura em caso de baixo risco na transação.|
|**Void On High Risk**|Ativa ("Yes") ou desativa ("No") o estorno automático em caso de alto risco na transação.|

## MDDs

A imagem a seguir mostra os campos de configuração a serem preenchidos na seção "MDD's":
![MDD's]({{ site.baseurl_root }}/images/braspag/pagador/magento/007b-antifraudemdd.png)

|Campo|Descrição|
|---|---|
|**Customer fetch self Shipping Method**|Método de entrega do cliente.|
|**Store Code From Customer Fetch Self**|Código da loja do cliente.|
|**Vertical Segment**|Segmento da loja.|
|**Store Identity (CNPJ)**|CNPJ da loja.|
|**Category Attribute Code**|Código do atributo da categoria.|

# Split de Pagamentos 

<aside class="warning">ATENÇÃO! O Split de Pagamentos para o módulo Adobe Commerce está em processo de homologação. Portanto, o conteúdo abaixo referente à sua configuração está passível de alterações.</aside>

## Split (Adobe Commerce)

Seguem instruções para acesso e configurações de algumas funcionalidades do **Split de Pagamentos** disponibilizadas no Adobe Commerce:

1. Faça login no admin do Adobe Commerce;
2. No menu, acesse `Vendas` > `Braspag` > `Payment Splits`.

### Trava do Split

Para efetuar uma trava no pagamento de split, acesse as transações seguindo os passos 1 e 2 acima. Na lista, localize a transação em que deseja efetuar a trava e selecione a ação “Lock”, em Actions, na parte superior da grid:
![Trava do Split]({{ site.baseurl_root }}/images/braspag/pagador/magento-split-paymentsplit.png)

### Envio Manual Pós-Transacional

Para efetuar o envio do split pós transacional manualmente, é necessário acessar o pedido no admin do Adobe Commerce (`Vendas` > `Pedidos` > `Visualizar`) e, caso o pós transacional esteja ativado mas ainda não tenha sido efetuado, será possível clicar no botão **Send Payment Split**.

## Split (Adobe Commerce + Unirgy)

A seguir, algumas funcionalidades do split de pagamentos disponibilizadas de forma customizada na Unirgy:

### Vínculo do Seller ao Master

Existem duas formas de um seller ser vinculado a um master:

* **Configuração Default do Seller**
   1. Para acessar esta configuração, vá até o menu `Vendas` > `Dropship` > `Vendors` e selecione o seller pretendido na grid, clicando em **Editar**.
   2. Localize o campo “Braspag Subordinate Merchant ID” e insira a informação do MerchantID do seller cadastrado na Braspag.
   
* **Configuração do Produto**
   1. Para acessar esta configuração, vá até o menu `Catálogo` > `Produtos` e selecione o produto pretendido na grid, clicando em **Editar**.
   2. Localize o atributo “Braspag Subordinate Merchant ID” e insira a informação do MerchantID do seller cadastrado na Braspag.

<aside class="warning">O vínculo do seller deve ser feito diretamente no produto somente quando não mais que 1 seller vá fazer a venda do mesmo. Caso contrário, a recomendação é que o vínculo seja feito diretamente nas configurações do seller.</aside>

### Cadastro de Taxas e Descontos de Comissão do Seller (Unirgy)

Existem três formas de se cadastrar as taxas e descontos de comissões para um seller:

* **Configuração Default do Seller** (para quando o seller irá ter taxas e descontos padrões que poderão ser sobrescritos por configurações de taxas e descontos de comissões efetuadas dentro de produtos - itens 2 e 3 abaixo)
   1. Para acessar esta configuração, vá até o menu `Vendas` > `Dropship` > `Vendors` e selecione o seller pretendido na grid, clicando em **Editar**.
   2. Localize os campos “Braspag Subordinate MDR” e “Braspag Subordinate Fee” e insira as informações de taxas default para o seller.
   
* **Configuração do Produto** (para quando apenas um seller irá fazer a comercialização do produto)
   1. Para acessar esta configuração, vá até o menu `Catálogo` > `Produtos` e selecione o produto pretendido na grid, clicando em **Editar**.
   2. Localize os atributos “Braspag Subordinate MDR” e “Braspag Subordinate Fee” e insira as informações de taxas e desconto de comissões default para o seller.
   
<aside class="warning">O vínculo das taxas do seller deve ser feito diretamente no produto somente quando não mais que 1 seller vá fazer a venda do mesmo. Caso contrário, a recomendação é que o vínculo seja feito diretamente nas configurações do seller ao produto Unirgy, seguindo os passos descritos na opção abaixo.</aside>

<aside class="warning">A configuração descrita logo a seguir irá sobrescrever a configuração acima caso o produto seja comercializado por mais de um seller.</aside>

* **Configuração do Vínculo de Produtos a Sellers** (para quando mais de um seller irá fazer a comercialização do produto)

   1. Para acessar esta configuração, vá até o menu `Catálogo` > `Produtos` e selecione o produto pretendido na grid, clicando em **Editar**.
   2. Localize a aba `Dropship Vendors`. Adicione o seller ao produto (é importante que o mesmo já tenha um `MerchantID` Braspag vinculado, como demonstrado no item [Vínculo do Seller ao Subordinado](https://braspag.github.io//tutorial/modulo-magento-webjump#split-(magento-+-unirgy)), e nos campos “Braspag Subordinate MDR” e “Braspag Subordinate Fee”, adicione as informações de taxas e descontos de comissões a serem aplicadas para o Seller na venda do produto que está sendo editado.

## Split (Adobe Commerce + Webkul)

A seguir, algumas funcionalidades do Split de Pagamentos disponibilizadas de forma customizada na Webkul:

### Vínculo do Seller ao Master

Existem duas formas de um seller ser vinculado a um master:

* **Configuração Default do Seller**
1. Para acessar esta configuração, é necessário ir até o Menu `Marketplace
Management` > `Manage Seller` e selecionar o seller pretendido na grid clicando no nome do seller.
2. Na tela de edição do perfil do seller, localize a aba “Seller Account Information”
e clique nela.
3. Localize o campo “Braspag Subordinate Merchant ID” e insira a informação do
MerchantID do Seller cadastrado na Braspag.
* **Configuração do Produto**
1. Para acessar esta configuração, vá até o Menu `Marketplace
Management` > `Manage Product` e selecione o produto pretendido na grid clicando no nome do
produto.
2. Localize o atributo “Braspag Subordinate Merchant ID” e insira a informação do
MerchantID do seller cadastrado na Braspag.

### Cadastro de taxas e descontos de comissão do Seller (Webkul)

Existem duas formas de cadastrar as taxas e descontos de comissões para um seller:

* **Configuração Default do Seller** (para quando o seller terá taxas e descontos
padrões que poderão ser sobrescritas por configurações de taxas e descontos de comissões efetuadas
dentro de produtos (item 2 abaixo).
1. Para acessar esta configuração, vá até o Menu `Marketplace
Management` > `Manage Seller` e selecione o seller pretendido na grid clicando no nome do
seller.
2. Na tela de edição do perfil do seller, localize a aba “Seller Account Information”
e clique nela.
3. Localize os campos “Braspag Subordinate MDR” e “Braspag Subordinate Fee”, e
insira as informações de taxas default para o seller.

* **Configuração do Produto** (para quando existirem taxas e descontos de
comissões diferentes por produtos)
1. Para acessar esta configuração, vá até o Menu `Marketplace
Management` > `Manage Product` e selecione o produto pretendido na grid clicando no nome
do produto.
2. Localize os atributos “Braspag Subordinate MDR” e “Braspag Subordinate Fee”, e
insira as informações de taxas e desconto de comissões default para o seller.

