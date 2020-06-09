---
layout: manual
title: Manual de integração Cartão Protegido
description: Integração técnica Tokenização via REST API Braspag
search: true
translated: true
categories: manual
tags:
  - Cartão Protegido
language_tabs:
  json: JSON
  shell: cURL
---

# O que é Cartão Protegido?

O **Cartão Protegido** é uma plataforma que permite o armazenamento seguro de cartões de crédito e débito. Contamos com ambiente totalmente certificado pelo respeitado conselho de padrão de segurança PCI Security Standards Council, que assegura que a Braspag segue plenamente os rígidos requisitos e normas determinadas pelo mesmo.

A plataforma é compatível com o gateway Pagador, também da Braspag, facilitando o processamento de transações de cartão de crédito e débito via token.

## Principais benefícios

* **Atualiza Fácil**: a plataforma conta com _Atualiza Fácil_, que é uma funcionalidade bastante interessante principalmente para quem trabalha no modelo de recorrência. Através da tecnologia das bandeiras, qualquer atualização no número de cartõe que sofreu bloqueio ou cancelamento por parte do emissor, é automaticamente informado à Braspag que por sua vez associa o novo cartão ao token já existente, tudo isso de forma totalmente transparente para os estabelecimentos e portadores. Esta feature está disponível para para cartões Mastercard e deve solicitar a habilitação da mesma através do canal de suporte da Braspsag.

* **Maior taxa de conversão**: as transações tokenizadas e processadas na Braspag via Pagador podem resultar em uma taxa de conversão maior que a média do mercado. Isso é porque os cartões tokenizados nas bandeiras são autorizadas junto com o criptograma, que provê maior segurança no processo, com isso, os emissores tendem a aprovar mais facilmente. Esta feature está disponível para para cartões Mastercard processando via Cielo 3.0. Solicitar a habilitação da mesma através do canal de suporte da Braspsag.

* **Ambiente Seguro PCI DSS**: a Braspag conta com ambiente certificado PCI DSS, que assegura a integridade e segurança de dados sensíveis como os de cartão de crédito.

* **Garantia da utilização de cartões válidos**: o Cartão Protegido só aceitará salvar cartões que passarem pela checagem do Algorítimo de Luhn, também conhecido como "mod10". Isso dará maior segurança e certeza de que os cartões salvos tenham o mínimo de validação de sua veracidade.

## Casos de Uso

A plataforma tem como propósito ajudar os estabelecimentos que possuem diversos casos de usos, entre eles:

* **Cobrança Recorrente Agendada (Scheduled Recurring Payments)**: Estabelecimentos que já possuam uma solução interna de gerenciamento de recorrências podem utilizar a plataforma para armazenar os dados de cartão de crédito e processar através de tokens de pagamento. Exmeplo: assinatura de serviços. 

* **Cobrança Recorrente não Agendada (Unscheduled Recurring Payments)**: Estabelecimentos que cobram seus clientes já cadastrados, mas sem uma periodicidade definida. Exemplo: aplicativos de transporte. 

* **Compra com um clique (Just Click Payments)**: A “compra com um clique” permite que um pagamento online, via cartão de crédito, seja feito pulando a etapa de preenchimento dos dados para pagamento ou até mesmo de todo o processo do carrinho de compras, pois os dados do cartão já foram previamente informados pelo comprador em compras passadas e serão replicados em futuras compras mediante sua autorizaçãol.

* **Recuperação de vendas**: Estabelecimentos podem entrar novamente em contato com os clientes que eventualmente tiveram problemas na compra, oferecer uma nova tentativa de cobrança. 

## Arquitetura

A integração é realizada através de serviços disponibilizados como Web Services. O modelo empregado é bastante simples: Através do endpoint serão enviadas todas as requisições relativas à esse serviço. Essa URL recebera as mensagens HTTP através dos métodos POST, GET ou DEL. Cada tipo de mensagem deve ser enviada para um endereço identificado através do "path".

| Endpoint | Ambiente |
| --- | --- |
| https://cartaoprotegidoapisandbox.braspag.com.br/ | Sandbox |
| https://cartaoprotegidoapi.braspag.com.br/ | Produção |

* **POST** - O método HTTP POST é utilizado na criação do token.
* **DEL** - O método HTTP DEL é utilizado para remoção de token.
* **GET** - O método HTTP GET é utilizado para consultas de recursos já existentes. Por exemplo, consulta de tokens já criados.

# Como se integra?

## Coleção do Postman

Para quem quiser experimentar as APIs diretamente via Postman, segue o link para baixar a coleção:

* Coleção do Postman: [https://bit.ly/2YX3YwE](https://bit.ly/2YX3YwE)
* Variáveis do Sandbox: [https://bit.ly/2YX3YwE](https://bit.ly/2YX3YwE)

## Etapa de Autenticação

Para consumir os métodos da API, é necessário obter o AccessToken no padrão OAuth 2.0

|Ambiente | Endpoint | Authorization |
|---|---|---|
| **SANDBOX** | https://authsandbox.braspag.com.br/oauth2/token | **Basic _(Authorization)_**<br><br>O valor do Authorization deve ser obtido concatenando-se o valor do "ClientID", sinal de dois-pontos (":") e "ClientSecret"<br><br>Ex. b4c14ad4-5184-4ca0-8d1a-d3a7276cead9:qYmZNOSo/5Tcjq7Nl2wTfw8wuC6Z8gqFAzc/utxYjfs=<br><br>e na sequência, codificar o resultado na base 64. <br>Com isso, será gerado um código alphanumérico que será utilizado na requisição de access token. Para efeitos de teste, utilize os dados abaixo:<br><br>ClientID: **b4c14ad4-5184-4ca0-8d1a-d3a7276cead9**<br>ClientSecret: **qYmZNOSo/5Tcjq7Nl2wTfw8wuC6Z8gqFAzc/utxYjfs=**|
| **PRODUÇÃO** | https://auth.braspag.com.br/oauth2/token | Solicite os dados "ClientID" e "ClientSecret" à equipe de suporte após concluir o desenvolvimento em sandbox. |

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

``` shell
--request POST "https://authsandbox.braspag.com.br/oauth2/token"
--header "Authorization: Basic _(Authorization)_"
--header "Content-Type: application/x-www-form-urlencoded" 
--body "grant_type=client_credentials"
```

|Parâmetros|Descrição|
|---|---|
|`Authorization`|Basic _(Authorization)_|
|`Content-Type`|application/x-www-form-urlencoded|
|`grant_type`|client_credentials|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

```shell
curl
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

|Propriedades do Response|Descrição|
|---|---|
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/> O token quando expirar, é necessário obter um novo|

## Create Token Reference

O objetivo deste método é salvar um cartão e obter como resposta a referência do token (Token Reference).

### Request

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
curl
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

|Parâmetros|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|`MerchantID`|GUID|-|Sim|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção)|
|`Authorization`|Texto|-|Sim|**Bearer** _(Authorization)_<BR>(é o token de acesso gerado no passo anterior)|
|`Content-Type`|Texto|-|Sim|application/json|
|`Alias`|Texto|64|Não |Alias do cartão. O valor desta informação deve ser único (não pode repetir).|
|`Card.Number`|Número|16|Sim|Número do Cartão do comprador|
|`Card.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`Card.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`Card.SecurityCode`|Número|4|Sim|Código de segurança impresso no verso do cartão|

### Response

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
curl
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
|`Alias`|Alias do cartão de crédito|Texto|64|Qualquer texto, que seja único na base de tokens do estabelecimento|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ExpirationDate`|Data de expiração do token, no formato MM/AAAA|Texto|7|MM/AAAA|
|`Card.Number`|Número|16|Sim|Número do cartão mascarado|
|`Card.Holder`|Texto|25|Sim|Nome do portador impresso no cartão|
|`Card.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`Card.SecurityCode`|Número|4|Sim|Código de segurança impresso no verso do cartão mascarado|

## Get Token Reference Information

O objetivo deste método é obter as informações relacionadas a uma referência de token, tais como Status, Cartão Mascarado, Data de Validade e Nome do Portador.

### Request

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v1/Token/{TokenReference}</span></aside>

```shell
curl
--request GET "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}"
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
|`TokenReference`|GUID|36|Sim|Token no Cartão Protegido que representa os dados do cartão|

### Response

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
curl
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
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Status atual do token no Cartão Protegido.|-|Valores possíveis: Active, Removed, Suspended|Texto|
|`Provider`|Indica o provedor que armazenou o cartão.|-|Valores possíveis: Braspag ou Master|Texto|
|`Account.Number`|Número do Cartão do comprador mascarado|Texto|16|-|
|`Account.Holder`|Nome do Comprador impresso no cartão, sem caraceteres acentuados|Texto|25|Exemplo: Jose da Silva|
|`Account.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA|Texto|7|Exemplo: 12/2021|

## Get Token Reference

O objetivo deste método é obter a referência de token a partir de um alias previamente informado.

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v1/Alias/_{Alias}_/TokenReference</span></aside>

### Request

```shell
curl
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

### Response

```json
{
    "TokenReference": "a36ffc37-e472-4d85-af2a-6f64c52bcccf"
}
```

```shell
curl
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

## Delete Token Reference

O objetivo deste método é remover a referência do token da base definitivamente. O Token Reference removido através deste método não permite que seja recuperado futuramente.

<aside class="request"><span class="method delete">DELETE</span> <span class="endpoint">/v1/Token/{TokenReference}</span></aside>

### Request

```json
{
     "RemovedBy":"Merchant",
     "Reason":"Other"
}
```

```shell
curl
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

### Response

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
curl
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

## Suspend Token Reference

O objetivo deste método é suspender uma referência do token temporariamente. O Token Reference suspenso através deste método pode ser reativado via método Unsuspend Token Reference.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/suspend</span></aside>

### Request

```json
{
     "RemovedBy":"Merchant",
     "Reason":"FraudSuspicion"
}
```

```shell
curl
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

### Response

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
curl
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

## Unsuspend Token Reference

O objetivo deste método é reativar uma referência do token.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/unsuspend</span></aside>

### Request

```shell
curl
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

### Response

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
curl
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

# Códigos de erro

Em casos de erro na requisição, serão informados os códos de erro e sua descrição, conforme o exemplo.

### Response

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
curl
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

# Dicas de implementação

## Código de segurança do cartão

O código de segurança é obrigatório para que uma autorização seja aceita pelo banco emissor do cartão. Ele é mais um mecanismo de segurança no processo anti-fraude, onde busca-se validar que a pessoa que está utilizando o cartão seja de fato a dona dele. 
Por esta razão, as regras do PCI permitem que se armazene o número do cartão e a validade, mas nunca o código de segurança, nem mesmo a Braspag, certificada PCI.
A recomendação é que o CVV seja sempre solicitado no ato da compra. 

<aside class="notice">Estabelecimentos que possuem o modelo de negócio baseado em recorrência, como, por exemplo, assinaturas de serviços, devem solicitar junto à adquirência contratada a liberação de transações sem CVV.</aside>

## Compra com um clique

Uma dica para melhorar sua conversão é salvar o número do cartão mascarado para apresentar ao cliente qual cartão ele tem habilitado para “a compra com 1 clique” no site;

* Opcionalmente, também salvar a data de validade, para ativamente comunicar ao cliente que o cartão que ele tem armazenado expirou e sugerir a troca;
* Sempre perguntar se o comprador deseja armazenar os dados do cartão para próxima compra;
* Segurança do login e senha dos usuarios do site – senhas muito fracas são facilmente descobertas e o fraudador consegue fazer uma compra mesmo sem ter o cartão (no caso de não solicitação do CVV pelo site);
* Controlar variáveis de sessão para evitar que o usuário (login do cliente) permaneça logado no site e outra pessoa acesse depois fazendo “compras via 1 clique” com este login (ex: usuários conectados em lan houses).
