---
layout: manual
title: Velocity Check - Manual de integração
description: Integração técnica API Velocity Check Braspag
search: true
categories: manual
tags:
  
language_tabs:
  json: JSON
  html: HTML
---

# Visão Geral

Para estabelecimentos comerciais que atuam no mercado de comércio eletrônico e eventualmente recebem transações fraudulentas, o Velocity Check é um produto que identificará os comportamentos suspeitos de fraude. A ferramenta tem o intuito de auxiliar na análise de fraude por um custo bem menor que uma ferramenta mais tradicional de mercado. Ela é uma aliada na avaliação de comportamentos suspeitos de compra, pois os cálculos serão baseados em variáveis.

A API é baseada em arquitetura REST, que trocam dados em formato JSON seguindo fluxos de autorização definidos pelo protocolo OAuth 2, onde todos os padrões são amplamente utilizados pelo mercado e suportado pelas comunidades técnicas.

> Para saber mais sobre OAuth 2, consulte [https://oauth.net/2/](https://oauth.net/2/)

# Objetivo

## Velocity Check

- Auxiliar na detecção de suspeitas de fraude
- Aliado para bloquear ataques em rajada (testes de cartão, por exemplo), bem como avaliações de comportamentos suspeitos de compra
- Cálculos baseados em análise de velocidade de variáveis e a incidência das mesmas em determinados intervalos de tempo

## Documentação

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a API Velocity Check Braspag, descrevendo as operações disponíveis com exemplos de requisições e respostas.

Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

# Funcionamento

## Análise de regras

O Velocity Check realiza análises em cima de regras habilitadas para os tipos de variáveis abaixo:

|Variáveis|
|:-|
|Número do cartão de crédito|
|12 primeiros dígitos do cartão de crédito|
|Nome do portador do cartão de crédito|
|Documento do comprador|
|E-mail do comprador|
|Endereço de IP do comprador|
|CEP do endereço de entrega|
|CEP do endereço de cobrança|
|Número do pedido|

A análise ocorre em cima de cada variável (V), contando quantas vezes (H) a mesma passou na Braspag para a sua loja dentro de um determinado período (P).

- V = Variável
- H = Hits (Quantidade)
- P = Período

Com estes 3 elementos, teríamos a seguinte regra, **Máximo de 5 Hits de Número do Cartão em 12 Hora(s)**, onde:

- V = Número do cartão de crédito
- H = 5
- P = 12 Horas

Com isso, o Velocity Check ao receber a 6ª transação com o mesmo número de cartão (V) das outras 5 anteriores, a regra acima ao ser executada e detectar que a quantidade (H) excedeu as 5 permitidas no período (P) entre a data da primeira transação e a data da 6ª recebida, esta terá o status de rejeitada, o número do cartão poderá ir quarentena e a resposta terá o conteúdo de que a transação foi rejeitada devido a regra.

## Quarentena

Ao cadastrar uma regra é possível especificar quanto tempo o valor de uma determinada variável irá ser levado em consideração nas próximas análises, ou seja, se o cliente quiser identificar a quantidade de vezes que o mesmo número de cartão se repetiu para um período de 12 horas dentro de um intervalo de 2 dias, não será necessário o Velocity Check realizar esta contagem retroativa agrupando por período. Neste cenário por exemplo, a aplicação teria que realizar a contagem para os seguintes intervalos:

- D-2 = 0h as 12h
- D-2 = 12h as 0h
- D-1 = 0h as 12h
- D-1 = 12h as 0h

Com a quarentena configurada, a aplicação não irá realizar essa contagem retroativa por período, pois na análise é verificado se existe o valor da variável número de cartão em quarentena. Por exemplo: para a regra mostrada acima (**Máximo de 5 Hits de Número do Cartão em 12 Hora(s)**), o tempo de expiração se definido em 2 dias, a regra será analisada apenas para o período configurado, ou seja, 12 horas para traz e irá verificar durante 2 dias para traz se número do cartão se encontra em quarentena.

Uma transação analisada, não rejeitada pela regra, mas rejeitada pela quarentena, terá o retorno informando que a mesma foi rejeitada pela quarentena.

## Blacklist

Uma transação a ser analisada, e o número do cartão enviado para análise estiver na blacklist, a mesma será rejeitada, independente de existir regra cadastra para este tipo de variável ou não e as demais regras para outrostipos de variáveis serão ignoradas.

Uma transação analisada e rejeitada pela blacklist, terá o retorno informando que a mesma foi rejeitada pela blacklist.

## Whitelist

Uma transação a ser analisada, e o número do cartão enviado para análise estiver na whitelist, a mesma será aceita, independente de existir regra cadastra para este tipo de variável ou não e as demais regras para outros tipos de variáveis serão ignoradas.

Uma transação analisada e aceita pela whitelist, terá o retorno informando que a mesma foi aceita pela whitelist.

## Emailage

O e-mail é o identificador chave para todos os seus perfir online, como conta de lojas e-commerce, redes sociais, provedores de e-mails, etc. Com isso a Emailage usa o histórico de um endereço de e-mail e comportamentos para avaliar o risco da transação. Com um hub global de inteligência de e-mail, conectam todo o mundo na luta contra a fraude. Por meio de uma pontuação preditiva, é possível realizar a automação e o dimensionamento de esforços para a prevenção de fraude.

Os dados abaixo são obrigatórios para análise na Emailage:

- Nome do comprador
- IP do comprador
- E-mail do comprador
- Documento do comprador (CPF ou CNPJ)
- Telefone do comprador
- Endereço de cobrança do comprador

Uma transação a ser analisada e ter passado nas análises de regras, quarentena e blacklist, os dados do comprador serão enviados para a Emailage. Na resposta da Emailage o score for de alto risco, o retorno terá que a transação foi rejeitada pela análise na Emailage.

Caracteriza-se alto risco quando o score retornado pela Emailage for acima de 900 e baixo risco menor que 10.

## Análise com Credilink

Uma transação a ser analisada e ter passado nas análises de regras, quarentena, blacklist e Emailage, este se estiver habilitado, os dados do comprador serão enviados para a Credilink. Após a análise na Credilink, não for encontrado nenhuma ocorrência, no retorno terá que a transação foi rejeitada pela na Credilink.

Os dados abaixo são obrigatórios para análise na Credilink:

- Nome do comprador
- Documento do comprador (CPF ou CNPJ)
- Data de nascimento do comprador
- Telefone do comprador
- Endereço de cobrança do comprador

# Hosts

## API BraspagAuth

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\authsandbox.braspag.com.br|
|`Produção`|https:\\\\auth.braspag.com.br|

## API Velocity Check Braspag

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\velocitysandbox.braspag.com.br|
|`Produção`|https:\\\\velocity.braspag.com.br|

# Autenticação

## Tokens de Acesso

A API Velocity Check Braspag utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, que são: **Sandbox** e **Produção**.

Esta sessão descreve o fluxo necessário para que aplicações cliente obtenham tokens de acesso válidos para uso na API.

## Obtenção do token de acesso  

O token de acesso é obtido através do fluxo oauth **client_credentials**. O diagrama abaixo, ilustra, em ordem cronológica, a comunicação que se dá entre a **Aplicação Cliente**, a **API BraspagAuth** e a **API Velocity Check**.

1. A **Aplicação Cliente**, informa à API **BraspagAuth** sua credencial.

2. O **BraspagAuth** valida a credencial recebida. Se for válida, retorna o token de acesso para a **Aplicação Cliente**.

3. A **Aplicação Cliente** informa o token de acesso no cabeçalho das requisições HTTP feitas à **API Velocity Check**.

4. Se o token de acesso for válido, a requisição é processada e os dados são retornados para a **Aplicação Cliente**.

> Solicite uma credencial abrindo um ticket através da nossa ferramenta de suporte, enviando o(s) IP(s) de saída dos seus servidores de homologação e produção.  
[Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br)

## Como obter o token

Uma vez em posse da credencial, será necessário "codificá-la" em Base64, utilizando a convenção **client_id:client_secret**, e enviar o resultado no cabeçalho através do campo **Authorization**.

Exemplo:
* client_id: **braspagtestes**
* client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* String a ser codificada em Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* Resultado após a codificação: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no corpo (Body)**

|Key|Value|
|:-|:-|
|`scope`|ChargebackApp|
|`grant_type`|client_credentials|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido, no caso a API Retroalimentação de Chargeback|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/> O token quando expirar, é necessário obter um novo|

# Realizando uma análise

A Braspag ao receber os dados do pedido, o mesmo será analisado de acordo com o descrito no tópico Funcionamento. <br/> 

**Importante**

- Os campos são opcionais e as regras serão disparadas somente se o valor no campo correspondente a regra for enviado, ou seja, se existir uma regra relacionada ao campo documento do comprador e o campo `Customer.Identity` não for enviado, esta regra não será disparada na análise.

- Os valores dos campos devem ser enviados sempre no mesmo formato, por exemplo: Número do documento do comprador, enviar **SEMPRE** uma das opções entre valor com formatação e sem formatação.

## Analisando uma transação no Velocity Check

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "Transaction": {
    "OrderId": "123456789AB",
    "Date": "2018-02-18 13:51:56.854",
    "Amount": "96385"
  },
  "Card": {
    "Holder": "Joao C Silva",
    "Number": "4444555566667777",
    "Expiration": "12/2023",
    "Brand": "visa"
  },
  "Customer": {
    "Name": "Joao Couves da Silva",
    "Identity": "12345678910",
    "IpAddress": "127.0.0.1",
    "BirthDate":"1983-10-01",
    "Email": "joaocouvessilva@email.com",
    "Phones": [ 
    {
      "Type": "Phone",
      "DDI": "55",
      "DDD": "21",
      "Number": "21114700",
      "Extension": "4720"
    },
    {
      "Type": "Workphone",
      "DDI": "55",
      "DDD": "21",
      "Number": "25899600",
      "Extension": "9612" 
    },
    {
      "Type": "Cellphone",
      "DDI": "55",
      "DDD": "21",
      "Number": "987654321"
    }
    ],
    "Billing": {
      "Street": "Rua do Escorrega",
      "Number": "171",
      "Complement": "Casa 71",
      "Neighborhood": "Piratininga",
      "City": "Niterói",
      "State": "RJ",
      "ZipCode": "24355-350",
      "Country": "BR"
    },
    "Shipping": {
      "Street": "Rua do Equilibra",
      "Number": "171",
      "Complement": "Casa 2",
      "Neighborhood": "Centro",
      "City": "Rio de Janeiro",
      "State": "RJ",
      "ZipCode": "24355-351",
      "Country": "BR"
    }
  }
}
```

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-|:-|-:|
|`Transaction.OrderId`|Número do pedido da loja|string|sim|100|
|`Transaction.Date`|Data do pedido <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Obs.: Caso não envie seja enviada, uma data será gerada pela Braspag|datetime|não|-|
|`Transaction.Amount`|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|long|sim|100|
|`Card.Holder`|Nome do cartão de crédito|string|sim|100|
|`Card.Number`|Número do cartão de crédito|string|sim|19|
|`Card.Expiration`|Data de expiração do cartão de crédito <br/> Ex.: 01/2023|string|sim|7|
|`Card.Brand`|Bandeira do cartão de crédito|string|sim|100|
|`Customer.Name`|Nome do comprador|string|sim|100|
|`Customer.Identity`|Número do documento de identificação do comprador <br/> [Tabela 1 - Customer.Identity]({{ site.baseurl_root }}manual/antifraude#tabela-1-customer.identity)|string|sim|100|
|`Customer.IpAddress`|Endereço de IP do comprador|string|sim|15|
|`Customer.BirthDate`|Data de nascimento do comprador <br/> Ex.: 1983-10-01|string|não|10|
|`Customer.Email`|E-mail do comprador|string|sim|100|
|`Customer.Phones[n].Type`|Tipo do telefone do comprador <br/> [Tabela 2 - Customer.Phones{n}.Type]({{ site.baseurl_root }}manual/antifraude#customer.phones[n].type)|enum|não|-|
|`Customer.Phones[n].DDI`|Código DDI do país. Mais informações em [Códigos DDI](http://www.ddi-ddd.com.br/Codigos-Telefone-Internacional)|string|não|10|
|`Customer.Phones[n].DDD`|Código DDD do estado. Mais informações em [Códigos DDD](http://www.ddi-ddd.com.br/Codigos-Telefone-Brasil/)|int|não|-|
|`Customer.Phones[n].Number`|Número do telefone|string|não|19|
|`Customer.Phones[n].Extension`|Número do ramal|int|não|-|
|`Customer.Billing.Street`|Logradouro do endereço de cobrança|string|não|100|
|`Customer.Billing.Number`|Número do endereço de cobrança|string|não|15|
|`Customer.Billing.Complement`|Complemento do endereço de cobrança|string|não|30|
|`Customer.Billing.Neighborhood`|Bairro do endereço de cobrança|string|não|100|
|`Customer.Billing.City`|Cidade do endereço de cobrança|string|não|100|
|`Customer.Billing.State`|Estado do endereço de cobrança|string|não|2|
|`Customer.Billing.ZipCode`|Código postal do endereço de cobrança|string|não|9|
|`Customer.Billing.Country`|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|
|`Customer.Shipping.Street`|Logradouro do endereço de entrega|string|não|100|
|`Customer.Shipping.Number`|Número do endereço de entrega|string|não|15|
|`Customer.Shipping.Complement`|Complemento do endereço de entrega|string|não|30|
|`Customer.Shipping.Neighborhood`|Bairro do endereço de entrega|string|não|100|
|`Customer.Shipping.City`|Cidade do endereço de entrega|string|não|100|
|`Customer.Shipping.State`|Estado do endereço de entrega|string|não|2|
|`Customer.Shipping.ZipCode`|Código postal do endereço de entrega|string|não|9|
|`Customer.Shipping.Country`|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|

### Response

## Analisando uma transação no Velocity Check com Emailage

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "Transaction": {
    "OrderId": "123456789AB",
    "Date": "2018-02-18 13:51:56.854",
    "Amount": "96385"
  },
  "Card": {
    "Holder": "Joao C Silva",
    "Number": "4444555566667777",
    "Expiration": "12/2023",
    "Brand": "visa"
  },
  "Customer": {
    "Name": "Joao Couves da Silva",
    "Identity": "12345678910",
    "IpAddress": "127.0.0.1",
    "BirthDate":"1983-10-01",
    "Email": "joaocouvessilva@email.com",
    "Phones": [ 
    {
      "Type": "Phone",
      "DDI": "55",
      "DDD": "21",
      "Number": "21114700",
      "Extension": "4720"
    },
    {
      "Type": "Workphone",
      "DDI": "55",
      "DDD": "21",
      "Number": "25899600",
      "Extension": "9612" 
    },
    {
      "Type": "Cellphone",
      "DDI": "55",
      "DDD": "21",
      "Number": "987654321"
    }
    ],
    "Billing": {
      "Street": "Rua do Escorrega",
      "Number": "171",
      "Complement": "Casa 71",
      "Neighborhood": "Piratininga",
      "City": "Niterói",
      "State": "RJ",
      "ZipCode": "24355-350",
      "Country": "BR"
    },
    "Shipping": {
      "Street": "Rua do Equilibra",
      "Number": "171",
      "Complement": "Casa 2",
      "Neighborhood": "Centro",
      "City": "Rio de Janeiro",
      "State": "RJ",
      "ZipCode": "24355-351",
      "Country": "BR"
    }
  }
}
```

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-|:-|-:|
|`Transaction.OrderId`|Número do pedido da loja|string|sim|100|
|`Transaction.Date`|Data do pedido <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Obs.: Caso não envie seja enviada, uma data será gerada pela Braspag|datetime|não|-|
|`Transaction.Amount`|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|long|sim|100|
|`Card.Holder`|Nome do cartão de crédito|string|sim|100|
|`Card.Number`|Número do cartão de crédito|string|sim|19|
|`Card.Expiration`|Data de expiração do cartão de crédito <br/> Ex.: 01/2023|string|sim|7|
|`Card.Brand`|Bandeira do cartão de crédito|string|sim|100|
|`Customer.Name`|Nome do comprador|string|sim|100|
|`Customer.Identity`|Número do documento de identificação do comprador <br/> [Tabela 1 - Customer.Identity]({{ site.baseurl_root }}manual/antifraude#tabela-1-customer.identity)|string|sim|100|
|`Customer.IpAddress`|Endereço de IP do comprador|string|sim|15|
|`Customer.BirthDate`|Data de nascimento do comprador <br/> Ex.: 1983-10-01|string|não|10|
|`Customer.Email`|E-mail do comprador|string|sim|100|
|`Customer.Phones[n].Type`|Tipo do telefone do comprador <br/> [Tabela 2 - Customer.Phones{n}.Type]({{ site.baseurl_root }}manual/antifraude#customer.phones[n].type)|enum|sim|-|
|`Customer.Phones[n].DDI`|Código DDI do país. Mais informações em [Códigos DDI](http://www.ddi-ddd.com.br/Codigos-Telefone-Internacional)|string|sim|10|
|`Customer.Phones[n].DDD`|Código DDD do estado. Mais informações em [Códigos DDD](http://www.ddi-ddd.com.br/Codigos-Telefone-Brasil/)|int|sim|-|
|`Customer.Phones[n].Number`|Número do telefone|string|sim|19|
|`Customer.Phones[n].Extension`|Número do ramal|int|não|-|
|`Customer.Billing.Street`|Logradouro do endereço de cobrança|string|sim|100|
|`Customer.Billing.Number`|Número do endereço de cobrança|string|sim|15|
|`Customer.Billing.Complement`|Complemento do endereço de cobrança|string|não|30|
|`Customer.Billing.Neighborhood`|Bairro do endereço de cobrança|string|sim|100|
|`Customer.Billing.City`|Cidade do endereço de cobrança|string|sim|100|
|`Customer.Billing.State`|Estado do endereço de cobrança|string|sim|2|
|`Customer.Billing.ZipCode`|Código postal do endereço de cobrança|string|sim|9|
|`Customer.Billing.Country`|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|sim|2|
|`Customer.Shipping.Street`|Logradouro do endereço de entrega|string|não|100|
|`Customer.Shipping.Number`|Número do endereço de entrega|string|não|15|
|`Customer.Shipping.Complement`|Complemento do endereço de entrega|string|não|30|
|`Customer.Shipping.Neighborhood`|Bairro do endereço de entrega|string|não|100|
|`Customer.Shipping.City`|Cidade do endereço de entrega|string|não|100|
|`Customer.Shipping.State`|Estado do endereço de entrega|string|não|2|
|`Customer.Shipping.ZipCode`|Código postal do endereço de entrega|string|não|9|
|`Customer.Shipping.Country`|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|

### Response

## Analisando uma transação no Velocity Check e Credilink

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "Transaction": {
    "OrderId": "123456789AB",
    "Date": "2018-02-18 13:51:56.854",
    "Amount": "96385"
  },
  "Card": {
    "Holder": "Joao C Silva",
    "Number": "4444555566667777",
    "Expiration": "12/2023",
    "Brand": "visa"
  },
  "Customer": {
    "Name": "Joao Couves da Silva",
    "Identity": "12345678910",
    "IpAddress": "127.0.0.1",
    "BirthDate":"1983-10-01",
    "Email": "joaocouvessilva@email.com",
    "Phones": [ 
    {
      "Type": "Phone",
      "DDI": "55",
      "DDD": "21",
      "Number": "21114700",
      "Extension": "4720"
    },
    {
      "Type": "Workphone",
      "DDI": "55",
      "DDD": "21",
      "Number": "25899600",
      "Extension": "9612" 
    },
    {
      "Type": "Cellphone",
      "DDI": "55",
      "DDD": "21",
      "Number": "987654321"
    }
    ],
    "Billing": {
      "Street": "Rua do Escorrega",
      "Number": "171",
      "Complement": "Casa 71",
      "Neighborhood": "Piratininga",
      "City": "Niterói",
      "State": "RJ",
      "ZipCode": "24355-350",
      "Country": "BR"
    },
    "Shipping": {
      "Street": "Rua do Equilibra",
      "Number": "171",
      "Complement": "Casa 2",
      "Neighborhood": "Centro",
      "City": "Rio de Janeiro",
      "State": "RJ",
      "ZipCode": "24355-351",
      "Country": "BR"
    }
  }
}
```

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-|:-|-:|
|`Transaction.OrderId`|Número do pedido da loja|string|sim|100|
|`Transaction.Date`|Data do pedido <br/> Ex.: 2016-12-09 19:16:38.155 <br/> Obs.: Caso não envie seja enviada, uma data será gerada pela Braspag|datetime|não|-|
|`Transaction.Amount`|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|long|sim|100|
|`Card.Holder`|Nome do cartão de crédito|string|sim|100|
|`Card.Number`|Número do cartão de crédito|string|sim|19|
|`Card.Expiration`|Data de expiração do cartão de crédito <br/> Ex.: 01/2023|string|sim|7|
|`Card.Brand`|Bandeira do cartão de crédito|string|sim|100|
|`Customer.Name`|Nome do comprador|string|sim|100|
|`Customer.Identity`|Número do documento de identificação do comprador <br/> [Tabela 1 - Customer.Identity]({{ site.baseurl_root }}manual/antifraude#tabela-1-customer.identity)|string|sim|100|
|`Customer.IpAddress`|Endereço de IP do comprador|string|sim|15|
|`Customer.BirthDate`|Data de nascimento do comprador <br/> Ex.: 1983-10-01|string|sim|10|
|`Customer.Email`|E-mail do comprador|string|sim|100|
|`Customer.Phones[n].Type`|Tipo do telefone do comprador <br/> [Tabela 2 - Customer.Phones{n}.Type]({{ site.baseurl_root }}manual/antifraude#customer.phones[n].type)|enum|sim|-|
|`Customer.Phones[n].DDI`|Código DDI do país. Mais informações em [Códigos DDI](http://www.ddi-ddd.com.br/Codigos-Telefone-Internacional)|string|sim|10|
|`Customer.Phones[n].DDD`|Código DDD do estado. Mais informações em [Códigos DDD](http://www.ddi-ddd.com.br/Codigos-Telefone-Brasil/)|int|sim|-|
|`Customer.Phones[n].Number`|Número do telefone|string|sim|19|
|`Customer.Phones[n].Extension`|Número do ramal|int|não|-|
|`Customer.Billing.Street`|Logradouro do endereço de cobrança|string|sim|100|
|`Customer.Billing.Number`|Número do endereço de cobrança|string|sim|15|
|`Customer.Billing.Complement`|Complemento do endereço de cobrança|string|não|30|
|`Customer.Billing.Neighborhood`|Bairro do endereço de cobrança|string|sim|100|
|`Customer.Billing.City`|Cidade do endereço de cobrança|string|sim|100|
|`Customer.Billing.State`|Estado do endereço de cobrança|string|sim|2|
|`Customer.Billing.ZipCode`|Código postal do endereço de cobrança|string|sim|9|
|`Customer.Billing.Country`|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|sim|2|
|`Customer.Shipping.Street`|Logradouro do endereço de entrega|string|não|100|
|`Customer.Shipping.Number`|Número do endereço de entrega|string|não|15|
|`Customer.Shipping.Complement`|Complemento do endereço de entrega|string|não|30|
|`Customer.Shipping.Neighborhood`|Bairro do endereço de entrega|string|não|100|
|`Customer.Shipping.City`|Cidade do endereço de entrega|string|não|100|
|`Customer.Shipping.State`|Estado do endereço de entrega|string|não|2|
|`Customer.Shipping.ZipCode`|Código postal do endereço de entrega|string|não|9|
|`Customer.Shipping.Country`|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|string|não|2|

### Response

# Tabelas

## Tabela 1 - Customer.Identity

|Valor|
|:-|
|CPF|
|CNPJ|

## Tabela 2 - Customer.Phones[n].Type

|Valor|Descrição|
|:-|:-|
|Phone|Telefone residencial|
|Workphone|Telefonecomercial|
|Cellphone|Celular|