---
layout: manual
title: Manual de Integração - Cartão Protegido
description: Integração Técnica de Tokenização via REST API Braspag
search: true
translated: true
categories: manual
tags:
  - 3. Cartão Protegido
language_tabs:
  json: JSON
  shell: cURL
  
---

# Cartão Protegido

O **Cartão Protegido** é uma plataforma que permite o armazenamento seguro de cartões de crédito e débito. Contamos com ambiente totalmente certificado pelo respeitado conselho de padrão de segurança PCI Security Standards Council, que assegura que a Braspag segue plenamente os rígidos requisitos e normas determinadas pelo mesmo.

A plataforma é compatível com o gateway [Pagador](https://braspag.github.io//manual/braspag-pagador), também da Braspag, facilitando o processamento de transações de cartão de crédito e débito via token.

## Principais Benefícios

* **Atualiza Fácil**: qualquer atualização no número do cartão que tenha sofrido bloqueio ou cancelamento por parte do emissor é automaticamente informado à Braspag, que por sua vez associa o novo cartão ao token já existente. Através da tecnologia das bandeiras, tudo isso é realizado de forma totalmente transparente para os estabelecimentos e portadores. Esta feature, interessante principalmente para quem trabalha no modelo de recorrência, está disponível para cartões Mastercard e deve ser solicitada através do [canal de suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672) da Braspag.

* **Maior taxa de conversão**: as transações tokenizadas e processadas na Braspag via Pagador podem resultar em uma taxa de conversão maior que a média do mercado. Isso porque os cartões tokenizados nas bandeiras são autorizadas junto com o criptograma, que provê maior segurança no processo. Com isso, os emissores tendem a aprovar mais facilmente. Esta feature está disponível para cartões Mastercard processando via Cielo 3.0 e deve ser solicitada através do [canal de suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672) da Braspag.

* **Ambiente seguro PCI DSS**: a Braspag conta com ambiente certificado PCI DSS, que assegura a integridade e segurança de dados sensíveis como os de cartões de crédito.

* **Garantia da utilização de cartões válidos**: o Cartão Protegido só aceitará salvar cartões que passarem pela checagem do Algorítimo de Luhn, também conhecido como "mod10". Isso dará maior segurança e certeza de que os cartões salvos tenham o mínimo de validação de sua veracidade. Conheça esse processo em nosso artigo [Como Validar um Cartão?](https://suporte.braspag.com.br/hc/pt-br/articles/360050638051).

## Casos de Uso

A plataforma tem como propósito ajudar estabelecimentos em diferentes casos de uso. Entre eles, estão:

* **Cobrança Recorrente Agendada (Scheduled Recurring Payments)**: estabelecimentos que já possuam uma solução interna de gerenciamento de recorrências podem utilizar a plataforma para armazenar os dados de cartão de crédito e processar através de tokens de pagamento. Exemplo: assinatura de serviços. 

* **Cobrança Recorrente não Agendada (Unscheduled Recurring Payments)**: estabelecimentos que cobram seus clientes já cadastrados, mas sem uma periodicidade definida. Exemplo: aplicativos de transporte. 

* **Compra com um Clique (Just Click Payments)**: a “compra com um clique” permite que um pagamento online, via cartão de crédito, seja feito pulando a etapa de preenchimento dos dados para pagamento ou até mesmo de todo o processo do carrinho de compras, pois os dados do cartão já foram previamente informados pelo comprador em compras passadas e serão replicados em futuras compras mediante sua autorização.

* **Recuperação de Vendas**: estabelecimentos podem entrar novamente em contato com os clientes que eventualmente tenham tido problemas na compra, oferecendo uma nova tentativa de cobrança. 

## Arquitetura da Integração

A integração é realizada através de serviços disponibilizados como web services. O modelo empregado é simples: através do endpoint serão enviadas todas as requisições relativas a esse serviço. A URL (base + endpoint) receberá as mensagens HTTP através dos métodos POST, GET ou DEL:

| Ambiente | Endpoint | 
| --- | --- |
| Sandbox | https://cartaoprotegidoapisandbox.braspag.com.br/ |
| Produção | https://cartaoprotegidoapi.braspag.com.br/ |

|Método HTTP|Descrição|
|---|---|
|**GET**|Utilizado para consultas de recursos já existentes, ex.: consulta de tokens já criados.|
|**POST**|Utilizado na criação do token.|
|**DEL**|Utilizado para remoção de token.|

# Integrando a Solução

## Coleção do Postman

Para quem quiser experimentar as APIs diretamente via Postman, seguem os links para baixar a coleção:

* Coleção do Postman: [https://bit.ly/2YX3YwE](https://bit.ly/2YX3YwE)
* Variáveis do Sandbox: [https://bit.ly/2YX3YwE](https://bit.ly/2YX3YwE)

## Etapa de Autenticação

Para consumir os métodos da API, é necessário obter o AccessToken no padrão OAuth 2.0:

|Ambiente | URL | Authorization |
|---|---|---|
| **SANDBOX** | https://authsandbox.braspag.com.br/oauth2/token | "Basic *{base64}*"|
| **PRODUÇÃO** | https://auth.braspag.com.br/oauth2/token | Solicite os dados "ClientID" e "ClientSecret" à equipe de suporte após concluir o desenvolvimento em sandbox. |

O valor do "**Basic _{base64}_**" deve ser obtido da seguinte forma:

1. Concatene o ClientId e o ClientSecret: "**ClientId:ClientSecret**". 
3. Codifique o resultado da concatenação em Base64.
4. Realize uma requisição ao servidor de autorização utilizando o código alfanumérico gerado.

Para efeitos de **teste**, utilize os seguintes dados no ambiente SANDBOX:

ClientID - "b4c14ad4-5184-4ca0-8d1a-d3a7276cead9"<br>ClientSecret - "qYmZNOSo/5Tcjq7Nl2wTfw8wuC6Z8gqFAzc/utxYjfs="

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

``` shell
--request POST "https://authsandbox.braspag.com.br/oauth2/token"
--header "Authorization: Basic {base64}"
--header "Content-Type: application/x-www-form-urlencoded" 
--body "grant_type=client_credentials"
```

|Parâmetros|Formato|Envio|
|---|---|---|
|`Authorization`|"Basic *{base64}*"|Envio no header.|
|`Content-Type`|"application/x-www-form-urlencoded"|Envio no header.|
|`grant_type`|"client_credentials"|Envio no body.|

### Resposta

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

```shell
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

|Propriedades da Resposta|Descrição|
|---|---|
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido.|
|`token_type`|Indica o valor do tipo de token.|
|`expires_in`|Expiração do token de acesso, em segundos. Quando o token expira, é necessário obter um novo.|

## Criando o Token Reference

O objetivo deste método é salvar um cartão e obter como resposta a referência do token (Token Reference).

### Requisição

<aside class="request"><span class="method post">POST</span><span class="endpoint">/v1/Token</span></aside>

```json
{
    "Alias":"5R2O4042YP",
    "Card": {
        "Number": "4551870000000183",
        "Holder": "Joao da Silva",
        "ExpirationDate": "12/2021",
        "SecurityCode": "123"
    }
}
```

```shell
--request POST "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
{
    "Alias":"5R2O4042YP",
    "Card": {
        "Number": "4551870000000183",
        "Holder": "Joao da Silva",
        "ExpirationDate": "12/2021",
        "SecurityCode": "123"
    }
}
```

|Parâmetros|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
|`Content-Type`|"application/json"|Texto|-|Sim (envio no header)|
|`MerchantID`|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção).|GUID|-|Sim (envio no header)|
|`Authorization`|Token de acesso gerado no passo anterior ("Bearer {access_token}").|Texto|-|Sim (envio no header)|
|`Alias`|Alias do cartão. O valor desta informação deve ser único (não pode ser repetido).|Texto|64|Não |
|`Card.Number`|Número do cartão do comprador.|Número|16|Sim|
|`Card.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`Card.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`Card.SecurityCode`|Código de segurança impresso no verso do cartão.|Número|4|Sim|

### Resposta

```json
{
    "Alias": "5R2O4042YP",
    "TokenReference": "c2e0d46e-6a78-409b-9ad4-75bcb3985762",
    "ExpirationDate": "2021-12-31",
    "Card": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Joao da Silva",
        "SecurityCode": "***"
    },
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762/suspend"
        }
    ]
}
```

```shell
--request POST "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token"
--header "Content-Type: application/json"
--data-binary
{
    "Alias": "5R2O4042YP",
    "TokenReference": "c2e0d46e-6a78-409b-9ad4-75bcb3985762",
    "ExpirationDate": "2021-12-31",
    "Card": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Joao da Silva",
        "SecurityCode": "***"
    },
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/c2e0d46e-6a78-409b-9ad4-75bcb3985762/suspend"
        }
    ]
}
```

|Propriedades|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`Alias`|Alias do cartão de crédito.|Texto|64|Qualquer texto, que seja único na base de tokens do estabelecimento|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ExpirationDate`|Data de expiração do token, no formato MM/AAAA.|Texto|7|MM/AAAA|
|`Card.Number`|Número do cartão mascarado.|Número|16|Sim|
|`Card.Holder`|Nome do portador impresso no cartão.|Texto|25|Sim|
|`Card.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`Card.SecurityCode`|Código de segurança impresso no verso do cartão mascarado.|Número|4|Sim|

## Obtendo Informações do Token Reference

O objetivo deste método é obter as informações relacionadas a uma referência de token, tais como Status, Cartão Mascarado, Data de Validade e Nome do Portador.

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v1/Token/{TokenReference}</span></aside>

```shell
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
```

|Parâmetros|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|GUID|36|Sim (envio no endpoint)|
|`Content-Type`|"application/json"|Texto|-|Sim (envio no header)|
|`MerchantID`|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção).|GUID|-|Sim (envio no header)|
|`Authorization`|Token de acesso gerado no passo anterior. ("Bearer {access_token}").|Texto|-|Sim (envio no header)|

### Resposta

```json
{
    "TokenReference": "1fdb4ef8-17f3-4f26-87e9-3a5f34bca8a0",
    "Status": "Active",
    "Provider": "Braspag",
    "Account": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Runscope Teste"
    }
}
```

```shell
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "1fdb4ef8-17f3-4f26-87e9-3a5f34bca8a0",
    "Status": "Active",
    "Provider": "Braspag",
    "Account": {
        "Number": "************0183",
        "ExpirationDate": "12/2021",
        "Holder": "Runscope Teste"
    }
}
```

|Propriedades|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Status atual do token no Cartão Protegido.|-|Valores possíveis: Active, Removed, Suspended|Texto|
|`Provider`|Indica o provedor que armazenou o cartão.|-|Valores possíveis: Braspag ou Master|Texto|
|`Account.Number`|Número do cartão mascarado do comprador.|Texto|16|-|
|`Account.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Exemplo: 12/2021|
|`Account.Holder`|Nome do comprador impresso no cartão, sem caracteres acentuados.|Texto|25|Exemplo: Jose Olimpio|

## Obtendo o Token Reference

O objetivo deste método é obter a referência de token a partir de um alias previamente informado.

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v1/Alias/_{Alias}_/TokenReference</span></aside>

```shell
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Alias/_{Alias}_/TokenReference"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
```

|Parâmetros|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Sim|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção)|
|`Authorization`|Texto|-|Sim|**Bearer** _(Authorization)_<BR>(é o token de acesso gerado no passo anterior)|
|`Content-Type`|Texto|-|Sim|application/json|
|`Alias`|Texto|64|Não |Alias (Apelido) do cartão de crédito utilizado anteriormente no método Create Token|

### Resposta

```json
{
    "TokenReference": "a36ffc37-e472-4d85-af2a-6f64c52bcccf"
}
```

```shell
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Alias/_{Alias}_/TokenReference"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "a36ffc37-e472-4d85-af2a-6f64c52bcccf"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Deletando o Token Reference

O objetivo deste método é remover a referência do token da base definitivamente. O Token Reference removido através deste método não permite que seja recuperado futuramente.

<aside class="request"><span class="method patch">DELETE</span> <span class="endpoint">/v1/Token/{TokenReference}</span></aside>

### Requisição

```json
{
     "RemovedBy":"Merchant",
     "Reason":"Other"
}
```

```shell
--request DELETE "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
{
     "RemovedBy":"Merchant",
     "Reason":"Other"
}
```

|Parâmetros|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Sim|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção)|
|`Authorization`|Texto|-|Sim|**Bearer** _(Authorization)_<BR>(é o token de acesso gerado no passo anterior)|
|`Content-Type`|Texto|-|Sim|application/json|
|`RemovedBy`|Texto|10|Sim|Quem solicitou a remoção. Valores possíveis: 'Merchant' ou 'CardHolder'|
|`Reason`|Texto|10|Sim|Motivo da remoção do token. Valores possíveis: 'FraudSuspicion' ou 'Other'|

### Resposta

```json
{
    "TokenReference": "26eb7cb4-c2b4-4409-8d2e-810215c42eee",
    "Status": "Removed",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/26eb7cb4-c2b4-4409-8d2e-810215c42eee"
        }
    ]
}
```

```shell
--request DELETE "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "26eb7cb4-c2b4-4409-8d2e-810215c42eee",
    "Status": "Removed",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/26eb7cb4-c2b4-4409-8d2e-810215c42eee"
        }
    ]
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Texto|10|Não |Status atual do token no Cartão Protegido|

## Suspendendo o Token Reference

O objetivo deste método é suspender uma referência do token temporariamente. O Token Reference suspenso através deste método pode ser reativado via método Unsuspend Token Reference.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/suspend</span></aside>

### Requisição

```json
{
     "RemovedBy":"Merchant",
     "Reason":"FraudSuspicion"
}
```

```shell
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/suspend"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
{
     "RemovedBy":"Merchant",
     "Reason":"FraudSuspicion"
}
```

|Parâmetros|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Sim|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção)|
|`Authorization`|Texto|-|Sim|**Bearer** _(Authorization)_<BR>(é o token de acesso gerado no passo anterior)|
|`Content-Type`|Texto|-|Sim|application/json|
|`RemovedBy`|Texto|10|Sim|Quem solicitou a remoção. Valores possíveis: 'Merchant' ou 'CardHolder'|
|`Reason`|Texto|10|Sim|Motivo da remoção do token. Valores possíveis: 'FraudSuspicion' ou 'Other'|

### Resposta

```json
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Suspended",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        }
    ]
}
```

```shell
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/suspend"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Suspended",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        }
    ]
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Texto|10|Não |Status atual do token no Cartão Protegido|

## Reativação do Token Reference

O objetivo deste método é reativar uma referência do token.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/unsuspend</span></aside>

### Requisição

```shell
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/unsuspend"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
```

|Parâmetros|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|
|`MerchantID`|GUID|-|Sim|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção)|
|`Authorization`|Texto|-|Sim|**Bearer** _(Authorization)_<BR>(é o token de acesso gerado no passo anterior)|
|`Content-Type`|Texto|-|Sim|application/json|

### Resposta

```json
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Active",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9/suspend"
        }
    ]
}
```

```shell
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/unsuspend"
--header "Content-Type: application/json"
--data-binary
{
    "TokenReference": "0a69a878-e50a-4252-bccc-24942a6225a9",
    "Status": "Active",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "DELETE",
            "Rel": "remove",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9"
        },
        {
            "Method": "PUT",
            "Rel": "suspend",
            "HRef": "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/0a69a878-e50a-4252-bccc-24942a6225a9/suspend"
        }
    ]
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Texto|10|Não |Status atual do token no Cartão Protegido.|

# Códigos de Erro

Em casos de erro na requisição, serão informados os códos de erro e sua descrição, conforme o exemplo.

### Resposta

```json
{
    "Errors": [
        {
            "Code": "CP903",
            "Message": "Token alias already exists"
        }
    ]
}
```

```shell
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token"
--header "Content-Type: application/json"
--data-binary
{
    "Errors": [
        {
            "Code": "CP903",
            "Message": "Token alias already exists"
        }
    ]
}
```

|Code|Message|Descrição|
|------|--------|---------|
|CP903|Token alias already exists|Acontece quando o Alias já foi utilizado anteriormente.|
|CP990|'XXXXX' must not be empty.|Acontece quando algum campo está inválido.|

# Dicas de Implementação

## Código de Segurança do Cartão

O código de segurança é obrigatório para que uma autorização seja aceita pelo banco emissor do cartão. Ele é mais um mecanismo de segurança no processo anti-fraude, onde busca-se validar que a pessoa que está utilizando o cartão seja de fato a dona dele. 
Por esta razão, as regras do PCI permitem que se armazene o número do cartão e a validade, mas nunca o código de segurança, nem mesmo a Braspag, certificada PCI.
A recomendação é que o CVV seja sempre solicitado no ato da compra. 

<aside class="notice">Estabelecimentos que possuem o modelo de negócio baseado em recorrência, como, por exemplo, assinaturas de serviços, devem solicitar junto à adquirência contratada a liberação de transações sem CVV.</aside>

## Compra com Um Clique

Uma dica para melhorar sua conversão é salvar o número do cartão mascarado para apresentar ao cliente qual cartão ele tem habilitado para “a compra com 1 clique” no site;

* Opcionalmente, também salvar a data de validade, para ativamente comunicar ao cliente que o cartão que ele tem armazenado expirou e sugerir a troca;
* Sempre perguntar se o comprador deseja armazenar os dados do cartão para próxima compra;
* Segurança do login e senha dos usuarios do site – senhas muito fracas são facilmente descobertas e o fraudador consegue fazer uma compra mesmo sem ter o cartão (no caso de não solicitação do CVV pelo site);
* Controlar variáveis de sessão para evitar que o usuário (login do cliente) permaneça logado no site e outra pessoa acesse depois fazendo “compras via 1 clique” com este login (ex: usuários conectados em lan houses).
