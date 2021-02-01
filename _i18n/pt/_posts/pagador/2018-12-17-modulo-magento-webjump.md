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

Para saber quais requisitos técnicos de infraestrutura são necessários para instalação do módulo Magento, consulte o [Guia de Instalação](https://devdocs.magento.com/guides/v2.4/install-gde/system-requirements.html) na documentação oficial da Magento.

<aside class="notice">A versão do Magento recomendada é a 2.4.0, mas são suportadas as versões a partir da 2.3.0.</aside>

## Instalação do Módulo Base

### Instalação do Módulo via Composer

1. Acessar o servidor via SSH.
2. Localizar a raiz do projeto e executar os seguintes comandos:

```
composer require webjump/magento2-module-braspagpagador
composer update
bin/magento module:enable Webjump_BraspagPagador
bin/magento setup:upgrade
bin/magento setup:di:compile
```

## Instalação do Módulo para a Integração com a Unirgy Marketplace

Esta instalação só é necessária caso o módulo **Marketplace Unirgy** seja adquirido. 

### Instalação do Módulo via Composer

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

# Configurações Gerais

## Acesso às Configurações Gerais

## Configurações Globais

## Autenticação OAuth

## Antifraude

### Configurações Gerais

### FingerPrint

### Options

### MDDs

## Autenticação 3DS 2.0

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
