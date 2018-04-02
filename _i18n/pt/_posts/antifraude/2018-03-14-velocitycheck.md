---
layout: manual
title: Velocity - Manual de integração
description: Integração técnica API Velocity Braspag
search: true
categories: manual
tags:
  
language_tabs:
  json: JSON
  html: HTML
---

# Visão Geral

Para estabelecimentos comerciais que atuam no mercado de comércio eletrônico e eventualmente recebem transações fraudulentas, o Velocity é um produto que identificará os comportamentos suspeitos de fraude. A ferramenta tem o intuito de auxiliar na análise de fraude por um custo bem menor que uma ferramenta mais tradicional de mercado. Ela é uma aliada na avaliação de comportamentos suspeitos de compra, pois os cálculos serão baseados em variáveis.

A API é baseada em arquitetura REST, que trocam dados em formato JSON seguindo fluxos de autorização definidos pelo protocolo OAuth 2, onde todos os padrões são amplamente utilizados pelo mercado e suportado pelas comunidades técnicas.

> Para saber mais sobre OAuth 2, consulte [https://oauth.net/2/](https://oauth.net/2/)

# Objetivo

## Velocity

- Auxiliar na detecção de suspeitas de fraude
- Aliado para bloquear ataques em rajada (testes de cartão, por exemplo), bem como avaliações de comportamentos suspeitos de compra
- Cálculos baseados em análise de velocidade de variáveis e a incidência das mesmas em determinados intervalos de tempo

## Documentação

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a API Velocity Braspag, descrevendo as operações disponíveis com exemplos de requisições e respostas.

Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

# Funcionamento

## Análise de regras

O Velocity realiza análises em cima de regras habilitadas para os tipos de variáveis abaixo:

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

Com isso, o Velocity ao receber a 6ª transação com o mesmo número de cartão (V) das outras 5 anteriores, a regra acima ao ser executada e detectar que a quantidade (H) excedeu as 5 permitidas no período (P) entre a data da primeira transação e a data da 6ª recebida, esta terá o status de rejeitada, o número do cartão poderá ir quarentena e a resposta terá o conteúdo de que a transação foi rejeitada devido a regra.

## Quarentena

Ao cadastrar uma regra é possível especificar quanto tempo o valor de uma determinada variável irá ser levado em consideração nas próximas análises, ou seja, se o cliente quiser identificar a quantidade de vezes que o mesmo número de cartão se repetiu para um período de 12 horas dentro de um intervalo de 2 dias, não será necessário o Velocity realizar esta contagem retroativa agrupando por período. Neste cenário por exemplo, a aplicação teria que realizar a contagem para os seguintes intervalos:

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

## API Velocity Braspag

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\velocitysandbox.braspag.com.br|
|`Produção`|https:\\\\velocity.braspag.com.br|

# Autenticação

## Tokens de Acesso

A API Velocity Braspag utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, que são: **Sandbox** e **Produção**.

Esta sessão descreve o fluxo necessário para que aplicações cliente obtenham tokens de acesso válidos para uso na API.

## Obtenção do token de acesso  

O token de acesso é obtido através do fluxo oauth **client_credentials**. O diagrama abaixo, ilustra, em ordem cronológica, a comunicação que se dá entre a **Aplicação Cliente**, a **API BraspagAuth** e a **API Velocity Braspag**.

1. A **Aplicação Cliente**, informa à API **BraspagAuth** sua credencial.

2. O **BraspagAuth** valida a credencial recebida. Se for válida, retorna o token de acesso para a **Aplicação Cliente**.

3. A **Aplicação Cliente** informa o token de acesso no cabeçalho das requisições HTTP feitas à **API Velocity Braspag**.

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
|`scope`|VelocityApp|
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
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido, no caso a API Velocity Braspag|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/> O token quando expirar, é necessário obter um novo|

# Realizando uma análise

A Braspag ao receber os dados do pedido, o mesmo será analisado de acordo com o descrito no tópico Funcionamento. <br/> 

**Importante**

- Os campos são opcionais e as regras serão disparadas somente se o valor no campo correspondente a regra for enviado, ou seja, se existir uma regra relacionada ao campo documento do comprador e o campo `Customer.Identity` não for enviado, esta regra não será disparada na análise.

- Os valores dos campos devem ser enviados sempre no mesmo formato, por exemplo: Número do documento do comprador, enviar **SEMPRE** uma das opções entre valor com formatação e sem formatação.

## Analisando uma transação no Velocity

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "Transaction": {
    "OrderId": "123456789AB",
    "Date": "2018-02-02 13:51:56.854",
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
|`Transaction.Date`|Data do pedido <br/> Ex.: 2018-02-02 13:51:56.854 <br/> Obs.: Caso não seja informada, uma data será gerada pela Braspag|datetime|não|-|
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

```json
{
    "AnalysisResult": {
        "Score": 100,
        "Status": "Reject",
        "RejectReasons": [
            {
                "RuleId": 408,
                "Message": "Bloqueado pela regra Identification. Name: Máximo de 1 Hits de Identificação em 1 Hora(s). HitsQuantity: 1. HitsTimeRangeInSeconds: 3600. ExpirationBlockTimeInSeconds: 0"
            },
            {
                "RuleId": 8,
                "Message": "Bloqueado pela regra Identification. Name: Máximo de 2 Hits de Identificação em 1 Minuto(s). HitsQuantity: 2. HitsTimeRangeInSeconds: 60. ExpirationBlockTimeInSeconds: 60"
            }
        ],
        "AcceptByWhiteList": false,
        "RejectByBlackList": false
    },
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://velocitysandbox.braspag.com.br/Analysis/80832037-97b4-4952-8ae7-c37be13cce7a"
        }
    ],
    "Transaction": {
        "Id": "b88a8b60-9e7d-4064-8413-059e0a896aef",
        "Date": "2018-02-02T13:51:56.854"
    },
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`AnalysisResult.Score`|Score calculado para o pedido <br/> Na atual versão será retornado 0 (zero) para status igual a Accept e 100 (cem) para status igual a Reject|int|
|`AnalysisResult.Status`|Status da transação no Velocity Braspag <br/> [Tabela 3 - AnalysisResult.Status]({{ site.baseurl_root }}manual/antifraude#tabela-3-analysisresult.status)|int|
|`AnalysisResult.RejectReasons[n].RuleId`|Id da regra disparada a qual a transação foi rejeitada|int|
|`AnalysisResult.RejectReasons[n].Message`|Descrição do bloqueio, contendo: <br/> Tipo de bloqueio - Ex.: Bloqueado pela regra Identification <br/> Nome da regra - Ex.: Máximo de 1 Hits de Identificação em 1 Hora(s) <br/> Quantidade de repetições no período analisado - Ex.: HitsQuantity: 1 <br/> Período analisado - HitsTimeRangeInSeconds: 3600 <br> Tempo de expiração da quarentena - Ex.: ExpirationBlockTimeInSeconds: 0|string|
|`AnalysisResult.AcceptByWhiteList`|Indica se a transação foi automaticamente aceita por algum valor de alguma whitelist referente a alguma variável|bool|
|`AnalysisResult.RejectByBlackList`|Indica se a transação foi automaticamente rejeitada por algum valor de alguma blacklist referente a alguma variável|bool|
|`Transaction.Id`|Id da transação no Velocity Braspag|guid|
|`Transaction.Date`|Data do pedido <br/> Ex.: 2018-02-02 13:51:56.854|datetime|

## Analisando uma transação no Velocity com Emailage

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "Transaction": {
    "OrderId": "123456789AB",
    "Date": "2018-02-02 13:51:56.854",
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
|`Transaction.Date`|Data do pedido <br/> Ex.: 2018-02-02 13:51:56.854 <br/> Obs.: Caso não seja informada, uma data será gerada pela Braspag|datetime|não|-|
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

```json
{
    "AnalysisResult": {
        "Score": 100,
        "Status": "Reject",
        "RejectReasons": [
            {
                "RuleId": 408,
                "Message": "Bloqueado pela regra Identification. Name: Máximo de 1 Hits de Identificação em 1 Hora(s). HitsQuantity: 1. HitsTimeRangeInSeconds: 3600. ExpirationBlockTimeInSeconds: 0"
            },
            {
                "RuleId": 8,
                "Message": "Bloqueado pela regra Identification. Name: Máximo de 2 Hits de Identificação em 1 Minuto(s). HitsQuantity: 2. HitsTimeRangeInSeconds: 60. ExpirationBlockTimeInSeconds: 60"
            }
        ],
        "AcceptByWhiteList": false,
        "RejectByBlackList": false
    },
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://velocitysandbox.braspag.com.br/Analysis/80832037-97b4-4952-8ae7-c37be13cce7a"
        }
    ],
    "Transaction": {
        "Id": "b88a8b60-9e7d-4064-8413-059e0a896aef",
        "Date": "2018-02-02T13:51:56.854"
    },
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`AnalysisResult.Score`|Score calculado para o pedido <br/> Na atual versão será retornado 0 (zero) para status igual a Accept e 100 (cem) para status igual a Reject|int|
|`AnalysisResult.Status`|Status da transação no Velocity Braspag <br/> [Tabela 3 - AnalysisResult.Status]({{ site.baseurl_root }}manual/antifraude#tabela-3-analysisresult.status)|int|
|`AnalysisResult.RejectReasons[n].RuleId`|Id da regra disparada a qual a transação foi rejeitada|int|
|`AnalysisResult.RejectReasons[n].Message`|Descrição do bloqueio, contendo: <br/> Tipo de bloqueio - Ex.: Bloqueado pela regra Identification <br/> Nome da regra - Ex.: Máximo de 1 Hits de Identificação em 1 Hora(s) <br/> Quantidade de repetições no período analisado - Ex.: HitsQuantity: 1 <br/> Período analisado - HitsTimeRangeInSeconds: 3600 <br> Tempo de expiração da quarentena - Ex.: ExpirationBlockTimeInSeconds: 0|string|
|`AnalysisResult.AcceptByWhiteList`|Indica se a transação foi automaticamente aceita por algum valor de alguma whitelist referente a alguma variável|bool|
|`AnalysisResult.RejectByBlackList`|Indica se a transação foi automaticamente rejeitada por algum valor de alguma blacklist referente a alguma variável|bool|
|`Transaction.Id`|Id da transação no Velocity Braspag|guid|
|`Transaction.Date`|Data do pedido <br/> Ex.: 2018-02-02 13:51:56.854|datetime|
|`EmailageResult.EmailExist`|Indica se o e-mail existe <br/> [Tabela 4 - EmailageResult.EmailExist]({{ site.baseurl_root }}manual/antifraude#tabela-4-emailageresult.emailexist)|string|
|`EmailageResult.FirstVerificationDate`|Data em que o e-mail foi visto pela primeira vez pela Emailage. Caso esta consulta seja a primeira, será retornada a data corrente|datetime|
|`EmailageResult.Score`|Score da transação na Emailage, podendo variar de 1 a 1000 de acordo com as bandas de risco|int|
|`EmailageResult.ScoreDescription`|Descrição do score da transação na Emailage|string|
|`EmailageResult.ReasonId`|Id do motivo para o cálculo do score <br/> [Tabela 5 - EmailageResult.Reason]({{ site.baseurl_root }}manual/antifraude#tabela-5-emailageresult.reason)|string|
|`EmailageResult.ReasonDescription`|Descrição do motivo para o cálculo do score <br/> [Tabela 5 - EmailageResult.Reason]({{ site.baseurl_root }}manual/antifraude#tabela-5-emailageresult.reason)|string|
|`EmailageResult.RiskBandId`|Id da banda de risco em relação ao score calculado <br/> [Tabela 6 - EmailageResult.RiskBand]({{ site.baseurl_root }}manual/antifraude#tabela-6-emailageresult.riskband)|string|
|`EmailageResult.RiskBandDescription`|Descrição da banda de risco em relação ao score calculado <br/> [Tabela 6 - EmailageResult.RiskBand]({{ site.baseurl_root }}manual/antifraude#tabela-6-emailageresult.riskband)|string|

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|

## Analisando uma transação no Velocity e Credilink

<aside class="request"><span class="method post">POST</span> <span class="endpoint">analysis/v2/</span></aside>

``` json
{
  "Transaction": {
    "OrderId": "123456789AB",
    "Date": "2018-02-02 13:51:56.854",
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
|`Transaction.Date`|Data do pedido <br/> Ex.: 2018-02-02 13:51:56.854 <br/> Obs.: Caso não seja informada, uma data será gerada pela Braspag|datetime|não|-|
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

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|201 Created|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|

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
|Workphone|Telefone comercial|
|Cellphone|Celular|

## Tabela 3 - AnalysisResult.Status

|Valor|Descrição|
|:-|:-|
|Accept|Aceita|
|Reject|Rejeitada|

## Tabela 4 - EmailageResult.EmailExist

|Valor|Descrição|
|:-|:-|
|Yes|Sim|
|No|Não|
|No anymore|Não existe mais|
|No sure|Não tem certeza|

## Tabela 5 - EmailageResult.Reason

|Valor|Descrição|
|:-|:-|
|1|Fraud Level X| 
|2|Email does not exist|
|3|Domain does not exist|
|4|Risky Domain|
|5|Risky Country|
|6|Risky Email Name|
|7|Numeric Email|
|8|Limited History for Email|
|9|Email Recently Created|
|10|Email linked to High Risk Account|
|11|Good Level X|
|12|Low Risk Domain|
|13|Email Created X Years Ago|
|14|Email Created at least X Years Ago|
|15|Email Linked to Low Risk Account|
|16|InvalidEmailSyntax|
|17|Mailbox is Full|
|18|Mailbox is Inactive|
|19|Corporate Link|
|20|Mailbox is Expired|
|21|User Defined Risk Domain|
|22|User Defined Low Risk Domain|
|23|Velocity Level X|
|24|Risk Domain Category|
|25|Low Risk Domain Category|
|26|High Risk Email Account|
|27|Email Created at least X Months Ago|
|28|Valid Email From X Country Domain|
|29|Valid Domain From X Country|
|30|Potentially Breached Email|
|31|Fraud Emails Linked X|
|32|Good Email Linked Level X|
|33|Fraud IP Level X|
|34|Good IP Level X|
|35|Risky Proxy IP|
|36|Risk IP Behavior|
|37|Risky IP Country|
|38|IP Not Found|
|39|IP Invalid Syntax Format|
|40|High Risk IP|
|51|Good Popularity|
|52|Risk Domain Category Review|
|53|Tumbling Abuse|
|54|Email Enumeration for Company|
|55|Email Enumeration for Industry|
|56|Creation Date Velocity|
|61|Customer Email not Provided|
|62|Risk Email Pattern|
|63|Suspected Fraud|
|64|Limited Email Information|
|65|Domain Recently Created|
|66|VelocityOther|
|67|Valid Email From Domain|
|68|Valid Domain|
|101|Low Risk Email Domain for Company|
|102|Low Risk IP for Company|
|103|Low Risk IP Geolocation for Company|
|104|Low Risk Email Domain for Industry|
|105|Low Risk IP for Industry|
|106|Low Risk IP Geolocation for Industry|
|107|Low Risk Email Domain for Network|
|108|Low Risk IP for Network|
|109|Low Risk IP Geolocation for Network|
|110|Very Low Risk Email Domain for Company|
|111|Very Low Risk IP for Company|
|112|Very Low Risk IP Geolocation for Company|
|113|Very Low Risk Email Domain for Industry|
|114|Very Low Risk IP for Industry|
|115|Very Low Risk IP Geolocation for Industry|
|116|Very Low Risk Email Domain for Network|
|117|Very Low Risk IP for Network|
|118|Very Low Risk IP Geolocation for Network|
|121|High Risk Email Domain for Company|
|122|High Risk IP for Company|
|123|High Risk IP Geolocation for Company|
|124|High Risk Email Domain for Industry|
|125|High Risk IP for Industry|
|126|High Risk IP Geolocation for Industry|
|127|High Risk Email Domain for Network|
|128|High Risk IP for Network|
|129|High Risk IP Geolocation for Network|
|130|Very High Risk Email Domain for Company|
|131|Very High Risk IP for Company|
|132|Very High Risk IP Geolocation for Company|
|133|Very High Risk Email Domain for Industry|
|134|Very High Risk IP for Industry|
|135|Very High Risk IP Geolocation for Industry|
|136|Very High Risk Email Domain for Network|
|137|Very High Risk IP for Network|
|138|Very High Risk IP Geolocation for Network|
|139|High Risk Phone for Company|
|140|High Risk Ship Address for Company|
|141|High Risk Phone for Industry|
|142|High Risk Ship Address for Industry|
|143|High Risk Phone for Network|
|144|High Risk Ship Address for Network|
|145|Very High Risk Phone for Company|
|146|Very High Risk Ship Address for Company|
|147|Very High Risk Phone for Industry|
|148|Very High Risk Ship Address for Industry|
|149|Very High Risk Phone for Network|
|150|Very High Risk Ship Address for Network|
|151|High Risk Bill Address For Company|
|152|High Risk Customer ID For Company|
|153|High Risk Service Location For Company|
|154|High Risk Bill Address For Industry|
|155|High Risk Customer ID For Industry|
|156|High Risk Service Location For Industry|
|157|High Risk Bill Address For Network|
|158|High Risk Customer ID For Network|
|159|High Risk Service Location For Network|
|160|Very High Risk Bill Address For Company|
|161|Very High Risk Customer ID For Company|
|162|Very High Risk Service Location For Company|
|163|Very High Risk Bill Address For Industry|
|164|Very High Risk Customer ID For Industry|
|165|Very High Risk Service Location For Industry|
|166|Very High Risk Bill Address For Network|
|167|Very High Risk Customer ID For Network|
|168|Very High Risk Service Location For Network|

## Tabela 6 - EmailageResult.RiskBand

|Valor|Score|Descrição|
|:-|:-|:-|
|1|1 a 100|Risco muito baixo|
|2|101 a 300|Risco baixo|
|3|301 a 600|Risco moderado|
|4|601 a 800|Risco indicado a revisão|
|5|801 a 900|Risco alto|
|6|901 a 1000|Risco muito alto|