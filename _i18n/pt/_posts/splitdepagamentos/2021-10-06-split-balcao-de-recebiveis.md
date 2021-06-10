---
layout: manual
title: Split de Pagamentos - Estrutura Balcao de Recebiveis
description: Manual de Integração do Split de Pagamentos
search: true
translated: true
toc_footers: false
categories: manual
sort_order: 1
hub_visible: true
tags:
  
---

# Introdução

O **Split de Pagamentos** permite a divisão de uma transação entre diferentes participantes de uma venda.

> Solicite suas credenciais para o ambiente de teste em nosso portal de suporte https://suporte.braspag.com.br ou pelo telefone 3003-6554

Muito utilizado em Marketplaces, onde **o carrinho é composto por produtos de diferentes fornecedores e o valor total da venda deve ser dividido entre todos os participantes**.

| **Participantes** | **Descrição** |
|-----------|---------- |
| **Marketplace** | Responsável pelo carrinho (Master). <br> Possui acordos com **Subordinados** que fornecem os produtos presentes no carrinho.<br> Define as taxas a serem descontadas sobre a venda de cada **Subordinado**.<br> Pode participar de uma venda fornecendo seus próprios produtos. |
| **Subordinado** | Fornecedor dos produtos que compõem o carrinho.<br>Recebe parte do valor da venda, descontadas as taxas acordadas com o **Marketplace**.|
| **Braspag (Facilitador)** | Responsável pelo fluxo transacional.<br> Define as taxas a serem descontadas sobre o valor total da venda realizada pelo **Marketplace**.<br> Responsável pela liquidação dos pagamentos para os **Subordinados** e **Marketplace**.|

No Split de Pagamentos o responsável pelo fluxo transacional é a Braspag (facilitador).

O Marketplace se integra à Braspag para transacionar e informa como será dividida a transação entre cada participante, podendo ser no momento de captura ou em um momento posterior, conhecido como Split pós-transacional, desde que seja dentro de um limite de tempo pré-estabelecido.

Com a transação capturada, a Braspag calcula o valor destinado a cada participante e repassa esses valores, no prazo estabelecido de acordo com cada produto (regime de pagamento\*), para cada envolvido na transação.

> **Regime de Pagamento**: Prazo estabelecido para liquidação de acordo com o produto (crédito ou débito) e bandeira.
> <br>
> **Crédito**: Em até 31 dias. <br>
> **Crédito Parcelado**: 1º parcela em até 31 dias, demais a cada 30.<br>
> **Débito**: Em até 2 dias úteis.

Para utilizar o Split de Pagamentos, o Marketplace deverá se cadastrar na Braspag juntamente com seus Subordinados. Após este processo, tanto o Marketplace quanto seus Subordinados possuirão um identificador único, conhecido como **MerchantId (MID)**, que deverá ser utlizado ao informar as regras de divisão de uma transação.

Na divisão de uma transação, devem ser informados:

* Os **identificadores dos Subordinados**.
* Os **valores de participação de cada Subordinado**. O somatório deverá ser igual ao valor total da transação.
* **Taxas** a serem aplicadas sobre o valor de cada Subordinado destinadas ao Marketplace. Estas deverão ser acordadas previamente entre o Marketplace e o Subordinado.

O Marketplace também pode ser um participante da divisão, bastando informar seu identificador, passando o mesmo a ter também o papel de **Subordinado** e ter seus próprios produtos no carrinho.

## Taxas

As taxas acordadas entre os participantes, podendo ser um **MDR(%)** e/ou uma **Taxa Fixa(R$)**, devem ser definidas no momento do cadastro do Marketplace e dos seus Subordinados junto à Braspag (Facilitador).

As mesmas poderão ser enviadas no momento transacional (captura) ou pós-transacional. Caso não sejam enviadas, serão consideradas as taxas cadastradas e acordadas previamente entre o participantes.

> **MDR (*Merchant Discount Rate*):** Percentual a ser descontado do valor de uma transação, definido por produto (Crédito / Débito), Bandeira e Faixa de Parcelamento. <br>
> **Fee:** Taxa fixa. Valor em centavos a ser cobrado por transação capturada.

### Braspag (Facilitador)

A Braspag acordará um MDR e/ou uma Tarifa Fixa com o Marketplace a serem descontadas do valor total de cada transação.

O Marketplace, de conhecimento destas taxas, negociará também um MDR e/ou uma Tarifa Fixa juntamente com cada Subordinado, embutindo o MDR e/ou Tarifa acordados junto à Braspag (Facilitador).

O desconto da Tarifa Fixa, acordada entre o Marketplace e a Braspag, não é aplicado no valor total da transação, ou seja, a mesma não entra no cálculo da divisão e sim é debitada diretamente do montante que o Marketplace tem para receber junto à Braspag (Facilitador). O MDR entra no cálculo de divisão da transação, já que o mesmo deve estar embutido no MDR acordado entre o Marketplace e seus Subordinados.

> **Custo Marketplace:** MDR Braspag (%) + Tarifa Fixa Braspag (R$)

### Marketplace

O Marketplace é responsável por acordar as taxas a serem cobradas dos seus Subordinados, onde deve ser defindo um MDR maior ou igual ao MDR definido entre a Braspag (Facilitador) e o Marketplace, e uma Tarifa Fixa, que é opcional.

> **Custo Subordinado:** MDR Marketplace (%) + Tarifa Fixa (R$), onde o MDR Marketplace (%) considera o MDR Braspag (%).

### Exemplo

Uma transação de **R$100,00**, realizada por um **Marketplace** com participação do **Subordinado 01**.

![SplitSample001](https://developercielo.github.io/images/split/split001.png)

Neste exemplo, foram assumidos os seguintes acordos:

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.  
**Taxa Marketplace**: 3,5% MDR (embutindo os 2% do MDR Braspag) + 0,30 Tarifa Fixa.

Após o split, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado**:  
Crédito: R$96,20 [Descontados o MDR e a Tarifa Fixa acordados com o Marketplace]

**Marketplace**:  
Crédito: R$1,80 [MDR aplicado sobre o valor do subordinado descontando o MDR acordado com a Braspag (Facilitador)]
Débito: R$0,10 [Tarifa Fixa acordada com a Braspag (Facilitador)]

**Braspag (Facilitador)**:  
Crédito: R$2,00 [MDR aplicado sobre o valor total da transação]
Crédito: R$0,10 [Tarifa Fixa acordada com o Marketplace]

## Bandeiras

As bandeiras suportadas pelo Split são:

* Visa
* MasterCard
* Elo
* Amex
* Hipercard
* Diners
* Discover

# Ambientes

O Split de Pagamentos é parte da API Cielo E-Commerce. As operações transacionais continuam sendo realizadas pela API Cielo, sendo necessárias poucas alterações para utlização do Split de Pagamentos.

## Sandbox

* **API Cielo E-Commerce**: https://apisandbox.cieloecommerce.cielo.com.br/
* **API Cielo E-Commerce (Consultas)**: https://apiquerysandbox.cieloecommerce.cielo.com.br/
* **API Split**: https://splitsandbox.braspag.com.br/
* **Braspag OAUTH2 Server**: https://authsandbox.braspag.com.br/

## Produção

* **API Cielo E-Commerce**: https://api.cieloecommerce.cielo.com.br/
* **API Cielo E-Commerce (Consultas)**: https://apiquery.cieloecommerce.cielo.com.br/
* **API Split**: https://split.braspag.com.br/
* **Braspag OAUTH2 Server**: https://auth.braspag.com.br/

# Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais, que deverá posteriormente ser enviado a API Cielo e-Commerce e a API do Split.

Para obter um token de acesso:

1. Concatene o ClientId e ClientSecret: `ClientId:ClientSecret`.  
2. Codifique o resultado da concatenação em Base64.  
3. Realize uma requisição ao servidor de autorização:  

**Request**  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

**Response**

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O ClientId é o mesmo utilizado na integração com a API Cielo E-Commerce, conhecido como MerchantId. O ClientSecret deve ser obtido junto à Braspag.

O token retornado (access_token) deverá ser utilizado em toda requisição à API Cielo e-Commerce ou à API Split como uma chave de autorização. O mesmo possui uma validade de 20 minutos e deverá ser obtido um novo token toda vez que o mesmo expirar.  

