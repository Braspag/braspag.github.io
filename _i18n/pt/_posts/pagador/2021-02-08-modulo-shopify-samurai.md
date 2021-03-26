---
layout: tutorial
title:  Módulo Shopify
description: Como Integrar sua Loja Shopify com o Módulo de Pagamentos Braspag
toc_footers: false
categories: tutorial
translated: true
sort_order: 2
tags:
  - 2. Módulos e SDKs

---

# Integração do Módulo Shopify

Para realizar a integração do módulo Shopify, deve-se primeiramente instalar o app na loja.

# Instalação e Configuração

## Instalando

A URL a ser acessada para instalação do módulo deve seguir o seguinte padrão:

> https://cielo.azurewebsites.net/AppSetup/CreateApp?shop=**_loja_**.myshopify.com

A palavra **_loja_** deve ser substituída pelo nome da loja (presente em sua URL myshopify) onde será instalado o app.

1. Ao instalar o app, a seguinte tela irá aparecer:
![Instalação]({{ site.baseurl_root }}/images/braspag/pagador/shopify/inicial.png)
2. Clique em `Instalar Gateway` para iniciar a instalação. Se a loja estiver online, esta ação deverá ser a última a ser tomada. Se a loja não estiver online, esta ação poderá ser executada a qualquer momento.
3. Clique em `Configurações`.

## Configurando

Em "Configurações", preencha os campos com dados referentes a provedores de pagamentos, utilização das funções Antifraude e Split, entre outros detalhes.

### URL

![URL]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-general.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`URL do Logo`|URL do logo a ser futuramente usada no boleto (ainda indisponível).|
|`MerchantID Braspag`|Merchant Id enviado pela Braspag (diferente da credencial de afiliação Cielo).|
|`MerchantKey Braspag`|Merchant Key enviado pela Braspag (diferente da credencial de afiliação Cielo).|
|`Email da Conta da Braspag`|Email relacionado à conta Braspag.|
|`URL do WebHook`|URL de webhook a ser cadastrada pelo cliente/suporte junto à Braspag, conforme instruções [neste link](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o).|

### Antifraude

![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-antifraud.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`Utilizar Anti-Fraude`|Habilita a utilização do [Antifraude da Braspag](https://braspag.github.io//manual/braspag-pagador#pagamentos-com-an%C3%A1lise-de-fraude). Possível apenas após a homologação da loja pela Braspag.|
|`MID Cybersource`|MID da loja informado pela Braspag após homologação.|
|`Utilizar Auto-Captura`|Habilita a [captura automática](https://braspag.github.io//manual/braspag-pagador#termos-transacionais) das transações, não sendo aplicada a [pré-autorização](https://braspag.github.io//manual/braspag-pagador#termos-transacionais) (bloqueio do valor no cartão de crédito). Para clientes que utilizam o fluxo transacional com o antifraude incluso, deve-se atentar que esta opção **não** deve ser habilitada caso opte por receber o retorno da análise de antifraude antes da captura da transação. Consulte a Braspag caso tenha dúvidas se deve utilizá-lo ou não durante a implantação.|
|`Utilizar parâmetros captureOnLowRisk e voidOnHighRisk`|Habilita as opções `captureOnLowRisk` e `voidOnHighRisk` para as transações, após a análise do antifraude.|
|`Utilizar captureOnLowRisk`|Habilita a captura do valor bloqueado (pré-autorizado) caso o antifraude defina a transação como sendo de baixo risco. A cobrança na fatura do cartão é efetivada.|
|`Utilizar voidOnHighRisk`|Habilita o cancelamento automático da transação caso o antifraude defina a transação como sendo de alto risco. A cobrança na fatura é cancelada ou estornada.|

### Loja e Provedores de Pagamento

![Provedores]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-bp.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`Tipo de Loja Braspag`| Dentre os disponíveis, o tipo que mais se encaixa naquela loja.|
|`Provedor de Boleto Braspag`|Provedor de boleto do cliente, caso a loja deseje utilizar boleto. Se desconhecido pelo cliente, entre em contato com a Braspag.|
|`Provedor de Crédito Braspag`|Provedor de crédito do cliente. Configure o meio de pagamento que está cadastrado em sua loja de produção junto à Braspag.|
|`Provedor de Débito Braspag`|Provedor de débito do cliente. Configure o meio de pagamento que está cadastrado em sua loja de produção junto à Braspag. Obs.: A funcionalidade de débito ainda não foi testada em produção.|
|`Id Cielo (3DS)`|Id da Cielo para autenticação 3DS (não requerido caso não tenha split).|
|`Secret Cielo (3DS)`|Secret da Cielo para autenticação 3DS (não requerido caso não tenha split).|
|`Nome do Estab. na Braspag`|Nome do estabelecimento na Braspag/Cielo para autenticação 3DS.|
|`Cod. do Estab. na Braspag`|Código do estabelecimento na Braspag/Cielo, numérico, para autenticação 3DS.|
|`MCC (Cód. Categoria) Braspag`|MCC do estabelecimento na Braspag/Cielo, numérico, 4 dígitos, para autenticação 3DS.|
|`CNPJ Habilitado`|Se a loja aceita vender para CNPJ.|

### Boleto

![Boleto]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-boleto.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`Validade do boleto em dias`|Validade do boleto, em dias.|
|`1ª/2ª/3ª linhas de instrução do boleto`|Instruções do boleto.|

### Split

Caso sua opção de utilização da função split seja "Sim", as seguintes opções serão habilitadas:
![Com Split]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-split-yes.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`Usar split`|Opção de utilizar a função de split. Se "Sim", as opções seguintes são habilitadas. Obs.: Essa funcionalidade foi homologada, porém não foi testada em uma situação real em produção.|
|`Porcentagem do split (%)`|Porcentagem ganha pela loja no split.|
|`Taxa fixa (R$)`|Valor em reais caso a loja ganhe uma taxa fixa na venda.| 
|`Id Braspag`|Merchant Id da Braspag da conta do fornecedor.|
|`Atualizar fornecedores`|Botão utilizado para carregar os fornecedores (vendors) do lojista, dos quais as configurações de split dependem.|

<br/>Caso sua opção de utilização da função split seja "Não", siga para o preenchimento das configurações de parcela:
![Sem Split]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-split-no.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`Usar Split`|Opção de utilizar a função de split. Se "Não", as opções seguintes são habilitadas. Obs.: Essa funcionalidade foi homologada, porém não foi testada em uma situação real em produção.|
|`Parcela mínima`|Insira o valor em reais da parcela mínima da loja, caso exista.|
|`Número máximo de parcelas`|Número máximo de parcelas.|
|`Taxa de juros por parcela`|Indica se o acordo da loja com a Braspag tem taxa de juros para algum tipo de parcela.|
|`Número de parcelas/Taxa de juros (%)`|A taxa de juros da parcela correspondente, de acordo com o que já existe na Braspag.|

### Formas de Pagamento

Preencha os seguintes campos referentes à customização das formas de pagamento:
![Pagamento]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-custom.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`Enviar email com boleto`|Indica se o lojista deseja que o comprador receba um email com o boleto. Neste caso, é necessário preencher todas as opções de remetente (título, email, senha, smtp e porta), mostradas na imagem acima.|
|`Desabilitar boleto`|Desabilita a opção de boleto como pagamento.|
|`Desabilitar cartão de crédito`|Desabilita a opção de cartão de crédito como pagamento.|
|`Desabilitar cartão de débito`|Desabilita a opção de cartão de débito como pagamento. Obs.: Opção ainda não disponível no momento. Débito não irá aparecer, independente da marcação.|

#### Envio do Boleto

 Caso opte pelo envio do boleto por email ao comprador, preencha também a sessão seguinte e, ao final, clique em `Salvar`:

![Envio de Boleto]({{ site.baseurl_root }}/images/braspag/pagador/shopify/config-rem.png)

|CAMPO|DESCRIÇÃO|
|---|---|
|`Título e-mail para envio de boletos`|Texto a ser enviado como título/assunto do email.|
|`E-mail para envio de boletos`|Endereço de e-mail a aparecer como remetente do mesmo.|
|`Senha do e-mail para envio de boletos`|Senha de autenticação do e-mail.|
|`SMTP do provedor de e-mail para envio de boletos`|Servidor SMTP a ser utilizado para o envio.|
|`Porta do SMTP do e-mail para envio de boletos`|Porta do servidor SMTP a ser utilizado para o envio.|

# Finalização da Compra

Após digitar todas as informações de endereço e frete no checkout, o usuário deverá clicar em `Finalizar a compra`:
![Pagamento]({{ site.baseurl_root }}/images/braspag/pagador/shopify/shopify-pagamento.png)

Ao clicar em `Finalizar a compra`, o usuário será redirecionado ao gateway para a página **Dados de pagamento**, mostrada na imagem abaixo.
<br/>Basta efetuar o preenchimento dos dados e clicar em `Realizar Pagamento` para realizar uma compra pagando com a Braspag:
![Endereço de Faturamento]({{ site.baseurl_root }}/images/braspag/pagador/shopify/shopify-pagamentodados.png)
