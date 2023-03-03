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

O Cartão Protegido é uma plataforma que permite o armazenamento seguro de cartões de crédito e débito. Contamos com ambiente totalmente certificado pelo respeitado conselho de padrão de segurança *PCI Security Standards Council*, que assegura que a Braspag siga plenamente os rígidos requisitos e normas determinadas pelo mesmo.

A plataforma é compatível com o gateway [Pagador](https://braspag.github.io//manual/braspag-pagador){:target="_blank"}, também da Braspag, facilitando o processamento de transações de cartão de crédito e débito via token.

## Principais Benefícios

* **Atualiza Fácil**: qualquer atualização no número do cartão que tenha sofrido bloqueio ou cancelamento por parte do emissor é automaticamente informado à Braspag, que por sua vez associa o novo cartão ao token já existente. Através da tecnologia das bandeiras, tudo isso é realizado de forma totalmente transparente para os estabelecimentos e portadores. Esta feature, interessante principalmente para quem trabalha no modelo de recorrência, está disponível para cartões Elo, Mastercard e Visa, e deve ser solicitada através do [canal de suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672){:target="_blank"} da Braspag.

* **Maior taxa de conversão**: as transações tokenizadas e processadas na Braspag via Pagador podem resultar em uma taxa de conversão maior que a média do mercado. Isso porque os cartões tokenizados nas bandeiras são autorizados junto com o criptograma, que provê maior segurança no processo. Com isso, os emissores tendem a aprovar mais facilmente.O Cartão Protegido está preparado para a tokenização de cartões Visa, Mastercard e Elo processando via Cielo 3.0; consulte a disponibilidade da bandeira e solicite esta feature no [canal de suporte](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672){:target="_blank"} da Braspag.

* **Ambiente seguro PCI DSS**: a Braspag conta com ambiente certificado PCI DSS, que assegura a integridade e segurança de dados sensíveis como os de cartões de crédito.

* **Garantia da utilização de cartões válidos**: o Cartão Protegido só aceitará salvar cartões que passem pela checagem do Algorítimo de Luhn, também conhecido como "mod10". Isso dará maior segurança e certeza de que os cartões salvos tenham o mínimo de validação de sua veracidade. Para saber mais sobre esse processo, consulte o nosso artigo "[Como Validar um Cartão?](https://suporte.braspag.com.br/hc/pt-br/articles/360050638051){:target="_blank"}".

## Casos de Uso

A plataforma tem como propósito ajudar estabelecimentos em diferentes casos de uso. Entre eles, estão:

* **Cobrança Recorrente Agendada (Scheduled Recurring Payments)**: permite que estabelecimentos que já possuem uma solução interna de gerenciamento de recorrências possam utilizar a plataforma para armazenar os dados de cartão de crédito e processar através de tokens de pagamento. Exemplo: assinatura de serviços. 

* **Cobrança Recorrente não Agendada (Unscheduled Recurring Payments)**: permite que estabelecimentos que cobram seus clientes já cadastrados, mas sem uma periodicidade definida, possam utilizar a plataforma. Exemplo: aplicativos de transporte. 

* **Compra com 1 Clique (Just Click Payments)**: permite que um pagamento online, via cartão de crédito, seja feito pulando-se a etapa de preenchimento dos dados para pagamento ou até mesmo de todo o processo do carrinho de compras. Os dados do cartão já foram previamente informados em compras anteriores e serão replicados em futuras compras mediante a autorização do comprador.

* **Recuperação de Vendas**: permite que estabelecimentos possam entrar novamente em contato com clientes que eventualmente tenham tido problemas na compra, oferecendo uma nova tentativa de cobrança. 

## Arquitetura da Integração

A integração é realizada através de serviços disponibilizados como web services. O modelo empregado é simples: através do endpoint devem ser enviadas todas as requisições relativas ao serviço em questão. A URL (base + endpoint) receberá as mensagens HTTP através dos métodos POST, GET ou DEL:

| Ambiente | URL base | 
| --- | --- |
|**SANDBOX**| https://cartaoprotegidoapisandbox.braspag.com.br/ |
|**PRODUÇÃO**| https://cartaoprotegidoapi.braspag.com.br/ |

|Método HTTP|Descrição|
|---|---|
|**GET**|Utilizado para consultas de recursos existentes, como tokens já criados.|
|**POST**|Utilizado na criação do token.|
|**DEL**|Utilizado para remoção do token.|

# Integrando a Solução

## Fluxo da Transação

O serviço do Cartão Protegido pode ser consumido de duas formas:

1. Durante um processo de autorização, através da [API do Pagador](https://braspag.github.io//manual/braspag-pagador#salvando-um-cart%C3%A3o-durante-uma-autoriza%C3%A7%C3%A3o){:target="_blank"};
2. Antes mesmo de se efetuar a compra, acionando-se diretamente a API do Cartão Protegido.

Veja a representação do **fluxo transacional** quando o token é solicitado diretamente à **API do Cartão Protegido**:

![Cartão Protegido]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans3a-pt.png)

Consulte também sobre a utilização da funcionalidade [VerifyCard](https://braspag.github.io//manual/braspag-verify-card){:target="_blank"} em conjunto com o serviço de tokenização do cartão.

## Testes no Postman

Experimente as APIs diretamente via Postman. [Clique aqui](https://www.postman.com/collections/e21ffab28a8e54972c9d){:target="_blank"} e baixe a coleção.

## Etapa de Autenticação

O `AccessToken` é um recurso que autoriza o acesso a dados específicos de um cliente, como os dados de seu cartão de crédito. Para consumir os métodos da API Cartão Protegido, é necessário obter o `AccessToken` no padrão [OAuth 2.0](https://oauth.net/2/){:target="_blank"}:

|Ambiente | URL base + endpoint | Authorization |
|---|---|---|
| **SANDBOX** | https://authsandbox.braspag.com.br/_oauth2/token_ |"Basic *{base64}*"|
| **PRODUÇÃO** | https://auth.braspag.com.br/_oauth2/token_ |"Basic *{base64}*"|

O valor _"{base64}"_ para a autorização do tipo "Basic" deve ser obtido da seguinte forma:

1. Concatene o "ClientId" e o "ClientSecret" (`ClientId:ClientSecret`). 
2. Codifique o resultado da concatenação em base64.
3. Realize uma requisição ao servidor de autorização utilizando o código alfanumérico gerado.

Solicite à equipe de suporte a criação do "ClientID" e do "ClientSecret" de sua loja para utilização nos ambientes SANDBOX e de PRODUÇÃO.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

``` shell
--request POST "https://authsandbox.braspag.com.br/oauth2/token"
--header "Authorization: Basic {base64}"
--header "Content-Type: application/x-www-form-urlencoded" 
--data-binary "grant_type=client_credentials"
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

## Criação do TokenReference

O objetivo deste método é salvar um cartão e obter como resposta o `TokenReference` (referência do token).

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
|`Authorization`|Token de acesso gerado no passo anterior ("Bearer *{access_token}*").|Texto|-|Sim (envio no header)|
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
|`Alias`|Alias do cartão de crédito.|Texto|64|Texto único para o token|
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ExpirationDate`|Data de expiração do token, no formato MM/AAAA.|Texto|7|MM/AAAA|
|`Card.Number`|Número do cartão mascarado.|Número|16|Sim|
|`Card.Holder`|Nome do portador impresso no cartão.|Texto|25|Sim|
|`Card.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`Card.SecurityCode`|Código de segurança impresso no verso do cartão mascarado.|Número|4|Sim|

## Obtenção de Informações do Token

O objetivo deste método é obter informações relacionadas a uma referência de token, tais como *Status*, *Cartão Mascarado*, *Data de Validade* e *Nome do Portador*.

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
|`Authorization`|Token de acesso gerado no passo anterior ("Bearer *{access_token}*").|Texto|-|Sim (envio no header)|

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
|`Status`|Status atual do token no Cartão Protegido.|Texto|-|Valores possíveis: "Active" / "Removed" / "Suspended"|
|`Provider`|Indica o provedor que armazenou o cartão.|Texto|-|Valores possíveis: "Braspag" / "Master"|
|`Account.Number`|Número do cartão mascarado do comprador.|Texto|16|-|
|`Account.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Exemplo: 12/2021|
|`Account.Holder`|Nome do comprador impresso no cartão, sem acentos.|Texto|25|Exemplo: Jose Olimpio|

## Obtenção do Token

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

|Parâmetros|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
|`Alias`|Alias (apelido) do cartão de crédito utilizado anteriormente no método **Criação do Token**.|Texto|64|Não (envio no endpoint)|
|`Content-Type`|"application/json"|Texto|-|Sim (envio no header)|
|`MerchantID`|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção).|GUID|-|Sim (envio no header)|
|`Authorization`|Token de acesso gerado no passo anterior ("Bearer" *{access_token}*").|Texto|-|Sim (envio no header)|

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
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Remoção do Token

O objetivo deste método é remover a referência do token da base definitivamente. O `TokenReference` removido através deste método não pode ser recuperado.

### Requisição

<aside class="request"><span class="method delete">DELETE</span> <span class="endpoint">/v1/Token/{TokenReference}</span></aside>

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

|Parâmetros|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
|`Content-Type`|"application/json"|Texto|-|Sim (envio no header)|
|`MerchantID`|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção).|GUID|-|Sim (envio no header)|
|`Authorization`|Token de acesso gerado no passo anterior ("Bearer" *{access_token}*").|Texto|-|Sim (envio no header)|
|`RemovedBy`|Quem solicitou a remoção. Valores possíveis: "Merchant" / "CardHolder".|Texto|10|Sim|
|`Reason`|Motivo da remoção do token. Valores possíveis: "FraudSuspicion" / "Other".|Texto|10|Sim|

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
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Status atual do token no Cartão Protegido.|Texto|10|Não|

## Suspensão do Token

O objetivo deste método é suspender uma referência do token temporariamente. O `TokenReference` suspenso através deste método pode ser reativado via método **Reativação do Token**.

### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/suspend</span></aside>

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

|Parâmetros|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
|`Content-Type`|"application/json"|Texto|-|Sim (envio no header)|
|`MerchantID`|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção).|GUID|-|Sim (envio no header)|
|`Authorization`|Token de acesso gerado no passo anterior ("Bearer" *{access_token}*").|Texto|-|Sim (envio no header)|
|`RemovedBy`|Quem solicitou a remoção. Valores possíveis: "Merchant" / "CardHolder".|Texto|10|Sim|
|`Reason`|Motivo da remoção do token. Valores possíveis: "FraudSuspicion" / "Other".|Texto|10|Sim|

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
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Status atual do token no Cartão Protegido.|Texto|10|Não|

## Reativação do Token

O objetivo deste método é reativar uma referência do token.

### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v1/Token/{TokenReference}/unsuspend</span></aside>

```shell
--request PUT "https://cartaoprotegidoapisandbox.braspag.com.br/v1/Token/{TokenReference}/unsuspend"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "Authorization: Bearer {access_token}"
--data-binary
```

|Parâmetros|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|
|`Content-Type`|"application/json"|Texto|-|Sim (envio no header)|
|`MerchantID`|Merchant ID do estabelecimento para plataforma Cartão Protegido no respectivo ambiente (Sandbox/Produção).|GUID|-|Sim (envio no header)|
|`Authorization`|Token de acesso gerado no passo anterior ("Bearer" *{access_token}*").|Texto|-|Sim (envio no header)|

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
|`TokenReference`|Token no Cartão Protegido que representa os dados do cartão.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Status atual do token no Cartão Protegido.|Texto|10|Não|

# Códigos de Erro

Em casos de erro na requisição, serão informados os códigos dos erros e suas descrições, conforme o exemplo.

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

|Código|Descrição|Mensagem|
|------|--------|---------|
|CP903|Acontece quando o Alias já foi utilizado anteriormente.|"Token alias already exists"|
|CP990|Acontece quando algum campo está inválido.|"XXXXX must not be empty"|

# Dicas de Implementação

## Código de Segurança do Cartão

O código de segurança é obrigatório para que uma autorização seja aceita pelo emissor do cartão. Ele é mais um mecanismo de segurança no processo antifraude, em que busca-se validar que a pessoa utilizando o cartão é de fato a dona dele.

Por esta razão, as regras do PCI permitem que se armazene o número do cartão e a validade, mas nunca o código de segurança, nem mesmo tendo-se a certificação PCI, como no caso da Braspag. A recomendação é que o CVV seja sempre solicitado no ato da compra. 

<aside class="warning">Estabelecimentos que possuam o modelo de negócio baseado em recorrência (ex.: assinaturas de serviços) devem solicitar junto à adquirência contratada a liberação de transações sem CVV.</aside>

## Compra com 1 Clique

Algumas dicas para impulsionar sua conversão:

* Salve o número do cartão mascarado. Assim, você poderá apresentar ao cliente os cartões habilitados para “compra com 1 clique”; 
* Salve a data de validade do cartão mascarado. Assim, você poderá comunicar ao cliente quando o cartão armazenado expirar, sugerindo sua troca;
* Pergunte se o comprador deseja armazenar os dados do cartão para uma próxima compra;
* Garanta a segurança de login e senha dos usuarios do site. Senhas fracas são facilmente descobertas e o fraudador consegue realizar uma compra mesmo sem ter o cartão (em caso de não solicitação do CVV pelo site);
* Controle variáveis de sessão para evitar que o usuário permaneça logado no site e que outra pessoa acesse depois, fazendo “compras via 1 clique” com este login (ex.: usuários conectados em LAN houses).
