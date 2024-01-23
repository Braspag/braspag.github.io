---
layout: manual
title: Split de Pagamentos - Onboarding de Sellers
description: Split de Pagamentos - Onboarding
search: true
toc_footers: false
categories: manual
sort_order: 4
hub_visible: false
tags:
  - 6. Soluções para Marketplace
language_tabs:
  json: JSON
---

# Sobre essa documentação

Essa documentação apresenta a integração com a **API de Onboarding Split 2.0** para o cadastro de sellers pelo master no Split de Pagamentos. A versão anterior da API (1.0) pode ser consultada no tópico [Cadastro de Sellers 1.0](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#deprecated-cadastro-de-sellers-1.0){:target="_blank"}.

> Se você já possui integração com a API de Onboarding Split 1.0, **a migração para a API de Onboarding Split 2.0 será obrigatória para novos cadastros** de sellers a partir de agosto de 2023. Consulte as instruções para migração no [artigo da nossa página de suporte](https://suporte.braspag.com.br/hc/pt-br/articles/5786920191387){:target="_blank"}.

# Visão geral

A **API de Onboarding Split 2.0** do **Split de Pagamentos** permite que o master gerencie seus sellers na plataforma. O master deverá coletar as informações do seller para usar no processo de onboarding.

Na API de Onboarding 2.0 o master cadastra o seller e, em seguida, o Split submete o seller à análise de Know Your Customer (KYC) de forma automática e notifica o master com o resultado desse processo, de acordo com as configurações de notificação.

> O cadastro de sellers também pode ser feito pelo backoffice Split. [Saiba mais neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360055405011-Cadastro-de-subordinados-do-Split-via-Backoffice){:target="_blank"}.

Assim como o master, os sellers também irão passar pelo processo de Know Your Customer (KYC) do Split de Pagamentos, com objetivo de identificar o cliente (seller). Por este motivo, alguns documentos do seller serão necessários.

O processo de KYC é uma medida obrigatória exigida pelas instituições reguladoras de pagamento.

O onboarding do seller no Split de Pagamentos ocorre da seguinte forma:

1. O master solicita o cadastro do seller;
2. O seller será criado com status "Em análise" e estará bloqueado para participar da transação até que o processo de KYC seja finalizado;
3. Ao final da análise, o master será notificado com o resultado do processo de KYC, juntamente com a identificação do seller.

# Ambientes

## Sandbox

|API|URL|Descrição|
|---|---|---|
|**Braspag OAUTH2 Server**|https://authsandbox.braspag.com.br/| Autenticação.|
|**API de Onboarding Split 2.0**|https://splitonboardingapisandbox.braspag.com.br| Cadastro de sellers.|
|**API de Onboarding Split 1.0** |https://splitonboardingsandbox.braspag.com.br | Consulta de sellers.|

## Produção

|API|URL|Descrição|
|---|---|---|
|**Braspag OAUTH2 Server**|https://auth.braspag.com.br/| Autenticação.|
|**API de Onboarding Split 2.0**|https://splitonboardingapi.braspag.com.br| Cadastro de sellers.|
|**API de Onboarding Split 1.0** |https://splitonboarding.braspag.com.br | Consulta de sellers.|

# Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), no qual é necessário primeiro obter um token de acesso utlizando suas credenciais, e posteriormente enviar o token de acesso à API de Onboarding Split 2.0.

Para obter um token de acesso:

1. Concatene o `MerchantId` e `ClientSecret`: `MerchantId:ClientSecret`;  
2. Codifique o resultado da concatenação em Base64;  
3. Realize uma requisição ao servidor de autorização.

![SplitAuth]({{ site.baseurl_root }}/images/braspag/split/split5-auth.png)

#### Requisição  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

#### Resposta

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O `MerchantId` é o mesmo utilizado na integração com a API Cielo E-Commerce ou com a API do Pagador. O `ClientSecret` deve ser obtido junto ao Split.

Use o token retornado (access_token) em toda requisição à API de Onboarding Split 2.0 como uma chave de autorização. O token de acesso possui uma validade de 20 minutos e é necessário gerar um novo token toda vez que a validade expirar.  

# Cadastro de Sellers

## Cadastro de Sellers 2.0

Siga as instruções dessa seção para novas integrações.

O **master** deverá solicitar o **cadastro de seller** enviando uma requisição com os **dados do seller**:

* Dados de identificação e contato;
* Dados bancários (nó `BankAccount`);
* Endereço (nó `Address`);
* Acordos de taxas (nó `Agreements`);
* Documentos anexos (nó `Attachments`).

O seller pode ser cadastrado com um CPF ou CNPJ. Caso o documento seja um CPF, envie também os campos `BirthdayDate` e `BusinessActivity`, conforme descrito na tabela de propriedades da requisição.

Veja a seguir o exemplo de uma requisição completa para cadastro de um seller do tipo CNPJ:

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/merchants</span></aside>

```json
{
    "Type": "Subordinate",
    "MasterMerchantId": "f88cc14d-c796-4939-957e-de4dddcb2257",
    "ContactName": "Nome do Contato do Seller",
    "ContactPhone": "11987654321",
    "CorporateName": "Seller Corporativo Ltda",
    "DocumentNumber": "96462142000140",
    "DocumentType": "CNPJ",
    "FancyName": "Seller Nome Fantasia",
    "MailAddress": "address@email.mail.com",
    "Website": "https://www.website.com.br",
    "BankAccount": {
        "Bank": "001",
        "BankAccountType": "CheckingAccount",
        "Number": "0002",
        "Operation": "2",
        "VerifierDigit": "2",
        "AgencyNumber": "0002",
        "AgencyDigit": "2",
        "DocumentNumber": "96462142000140",
        "DocumentType": "CNPJ"
    },
    "Address": {
        "Street": "Rua Teste",
        "Number": "50",
        "Complement": "AP 255",
        "Neighborhood": "Centro",
        "City": "São Paulo",
        "State": "SP",
        "ZipCode": "12345687"
    },
    "Agreements": [
        {
            "Percent": 2.0,
            "Fee": 100
        }
    ],
    "Attachments": [
        {
            "AttachmentType": "ProofOfBankDomicile",
            "File": {
                "Name": "comprovante",
                "FileType": "png",
                "Data": "iVBORw0KGgoAAAANSUhEUgAAAH4AAAAsCAMAAACUu/xGAAAAq1BMVEUAAABlZVJlZVKsrJthYU+zs6Grq5ylpZazs6FlZVJfX01lZVJlZVKsrJurq5urq5xlZVKtrZ1lZVJlZVKvr52zs6GysqCoqJeqqpmzs6Grq5xlZVJgYE6zs6Gnp5mrq5yiopRjY1CRkX2rq5yzs6FlZVKRkX2goJKKineRkX2Pj3yrq5yIiHWRkX2RkX2RkX1lZVKRkX2rq5yzs6GoqJdfX02goJKHh3SHh3VrpzVsAAAAMHRSTlMAQIDHx3+Ax0Ag7qBgIA9AEFCPMLOgMO7bYKBQ24+zYNuzkY9wcAXu0oiocPFBMHYlVbK0AAAD3UlEQVRYw6SW7Y6qMBCGB0IkLfKdnB9ocFmjru7HERL03P+VnXY6bdmWjcF9f2inxjydvjMDcHy99zP693oEpTpQYjBR7W4VmzA81GoZCDn/ycrValVmYOJcKBWL1/4HnUEpupLGxOI47iQmDkfc4GEBEFyNQkClzYDKQQs3VmJBufu6G7zRWNMeUzEHUnLVWs/gy9vg4NNB4wUIPOG2h7e8NcV0HRt7QPDxfzTd4ptleB5F6ro3NtsIc7UnjMKKXyuN30ZS+PuLRMW7PN+l2vlhAZ6yqCZmcrm05stfOrwVpvEBaJWStIOpVk/gC8Rb62tjRj25Fx/fEsgqE27cluKB8GR9hDFzeX44CFbmJb9/Cn8w1ldA5tO9VD/gc8FpveTbxfi1LXWOl10Z80c0Yx7/jpyyjRtd9zuxU8ZL8FEYJjZFpg6yIfOpKsf1FJ+EUkzddKkabQ+o0zCcwMN/vZm+uLh4UmW7nptTCBVq5nUF4Y0CgBaNVip18jsPn370909cfX708/gusF3fkQfrKZHXHh45Wi8meRefvfVCfwGOZ9zx8TZ9TjWY2M6vVf4jm8e3WYrDJ1Vj4N3FHwVd6vKFCxefBMFmq7ub6UI7TMZw0SEv8ryPDVaoxPiWufhL/02zY0cm3ZH1VgxIIYa1U/nIibH/EZjjp4M/9w/x9FijbyuqdzOVH+BbWQJxHMupd4pjINhDPKVH1lslBl9g6OKb73j0wmoBHrMj691nsJ0QLn4l0/09nrIm6wv7nGdQqwjGucvPJSWjN4z8aXyBlkfK+i2gmDI/HENGjXA9uPhsUJ22p2OQFg3daaFx0/9qnWBRbOl9hHlvOw3OW/xs4Hf4rcnYzj+OeFOIHj4dtG7/2y+b3IhBGAqjUiQWQ9JI/ErDpop6gcei9z9ZIXHIhLaLSGRW8zYxIuaTZccxqsGfHDXvH4cf37Z4e3ihxVOTp5bf4E8N2u+3PWB2SP7tXsfsFl80rtOeZX/gvz6//7tmnFFzD2mkxnFgL710ToHH1eCcm/LU2aA9m027v+kBH8ipyHbACxAMWaV5I4v2ZgAzIxkUGXIqkn3xrhw4wVe8hoMmOwBmYJMiJy+lHPriNcSyrvgEgUS2h/vl1BcvSqgcZsPbbABrhgdgvhgvS6hIYsPP8MwTVR5SLZA4573xHMpCV7xGZBFmxyProfR64yNCgKh4hygjXIuvpdcbPyEayA2vsEpRHcgl6gtzr8A9ho0RlgQnBPoK4tV45gBfGQZ6KQBDqzRcjdeAqQwHUfYp+SohcQdc1/Ukm4Gw4dV6vqTkM+uQpRv8E2VPF/sPp9xSb2qlGH4AAAAASUVORK5CYII="
            }
        }
    ]
}
```

#### Propriedades do seller

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|---|---|---|---|---|
| `Type` | Texto | 15 | Sim | Tipo de merchant a ser criado (Subordinate). |
| `MasterMerchantId` | GUID | 36 | Sim | Identificação do master. |
| `ContactName` | Texto | 100 | Sim | Nome do contato responsável. |
| `ContactPhone` | Texto | 11 | Sim | Número do telefone do contato responsável (apenas números). |
| `CorporateName` | Texto | 100 | Sim | Razão social. |
| `DocumentNumber` | Texto | 14 | Sim | Número do documento (apenas números). |
| `DocumentType` | Texto | - | Sim | Tipo do documento. Os tipos válidos são "CPF" ou "CNPJ". |
| `FancyName` | Texto | 50 | Sim | Nome fantasia. |
| `MailAddress` | Texto | 50 | Sim | Endereço de e-mail. |
| `Website` | Texto | 200 | Não | Endereço do website .|
| `BirthdayDate`* | Data | 10 | Sim*, quando `DocumentType` for "CPF". | Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd |
| `BusinessActivityId`* | Número | - | Sim*, quando `DocumentType` for "CPF". | Ramo de atividade que o seller atua. (apenas para cadastro de pessoa física - CPF). Veja a [**Lista de Ramos de Atividades**](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-ramos-de-atividades). |

*Não é obrigatório quando `DocumentType` for "CNPJ".

#### Propriedades da conta bancária

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|---|---|---|---|---|
| `BankAccount.Bank` | Texto | 3 | Sim | Código de compensação do banco. [Lista de Códigos de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o) |
| `BankAccount.BankAccountType` | Texto | - | Sim | Tipo de conta bancária. Os tipos válidos são "CheckingAccount" (conta corrente) e "SavingsAccount" (conta poupança). |
| `BankAccount.Number` | Texto | 10 | Sim | Número da conta do seller. |
| `BankAccount.Operation` | Texto | 10 | Não | Operação da conta do seller. |
| `BankAccount.VerifierDigit` | Texto | 1 | Sim | Dígito verificador da conta do seller. |
| `BankAccount.AgencyNumber` | Texto | 15 | Sim | Número da agência do seller. *Atenção: Valores zerados como "0", "00", "000" são inválidos*. |
| `BankAccount.AgencyDigit` | Texto | 1 | Sim | Dígito da agência do seller. Caso a agência não tenha dígito, informar o valor "x". |
| `BankAccount.DocumentNumber` | Texto | 14 | Não | Número do documento da conta (apenas números) do seller. |
| `BankAccount.DocumentType` | Texto | - | Não | Tipo do documento. Os tipos válidos são "CPF" ou "CNPJ". |

#### Propriedades do endereço

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|---|---|---|---|---|
| `Address.Street` | Texto | 100 | Sim | Logradouro do endereço do seller. |
| `Address.Number` | Texto | 15 | Sim | Número do endereço do seller. |
| `Address.Complement` | Texto | 80 | Não | Complemento do endereço do seller. |
| `Address.Neighborhood` | Texto | 50 | Sim | Bairro do seller.|
| `Address.City` | Texto | 50 | Sim | Cidade do seller.|
| `Address.State` | Texto | 2 | Sim | Sigla do estado (UF) do seller.|
| `Address.ZipCode` | Texto | 9 | Sim | CEP (apenas números) do seller. |

#### Propriedades do acordo de taxas

No **Split de Pagamentos** há possibilidades de acordos de taxas entre o master e seus sellers:

1. **Não cadastrar taxa**: quando as taxas não são definidas no momento do cadastro do seller, você deverá informá-las **a cada transação**, no momento da captura da transação ou da emissão do boleto. Se não cadastrar taxas e não informar a taxa na transação, o Split vai replicar os mesmos acordos do master com o Split para o master com o seller;
2. **Taxa global**: configure uma única taxa para todos os acordos (MDR único);
3. **Taxa por meio de pagamento**: você deverá definir as taxas cobradas por transação por arranjos de pagamento e intervalo de parcelas.

Na seção Exemplos dos Acordos de Taxas, você pode visualizar os exemplos de requisições para os três cenários: [**Não cadastrar taxa**](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#n%C3%A3o-informar-taxas), [**Taxa global**](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#taxa-global) e [**Taxa por meio de pagamento**](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#taxa-por-meio-de-pagamento). 

> **ATENÇÃO**: Se não houver cobrança de MDR, basta não enviar o nó `Agreements`.<br>
> O campo `Agreements[].Percent` só deve ser enviado em caso de cadastro de seller com Taxa global.

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|---|---|---|---|---|
| `Agreements[].Percent` | Decimal | - | Sim, para requisições cujo acordo é com Taxa global. | Porcentagem da taxa de desconto única (MDR único) que será aplicada para todos os acordos entre master e seller. Valor com até duas casas decimais. |
| `Agreements[].Fee` | Número | - | Sim | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `Fee` : 100 |
| `Agreements[].MerchantDiscountRates[].PaymentArrangement.Product` | Texto | - | Não* | Produto do arranjo de pagamento da taxa de desconto do seller. Os produtos válidos são "CreditCard" e "DebitCard". |
| `Agreements[].MerchantDiscountRates[].PaymentArrangement.Brand` | Texto | - | Não* | Bandeira do arranjo de pagamento da taxa de desconto do seller. As bandeiras válidas são _Visa_, _Master_, _Amex_, _Elo_, _Diners_ e _Hipercard_. |
| `Agreements[].MerchantDiscountRates[].InitialInstallmentNumber` | Número | - | Não* | Número inicial do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**. |
| `Agreements[].MerchantDiscountRates[].FinalInstallmentNumber` | Número | - | Não* | Número final do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**. | 
| `Agreements[].MerchantDiscountRates[].Percent` | Decimal | - | Não* | Porcentagem da taxa de desconto do seller. Valor com até duas casas decimais. |

* Obrigatório apenas para o cenário de acordo de taxas *"3. Taxa por meio de pagamento"*.

### Resposta

```json
{
    "Id": "5dcee8e4-f432-42e4-a2a6-5a30c8ce2ca5",
    "Type": "Subordinate",
    "MasterMerchantId": "2b8e9c38-0d9e-4f30-adac-fef3601632e4",
    "CorporateName": "Corporate Name Seller",
    "FancyName": "Fancy Name Seller",
    "DocumentType": 1,
    "DocumentNumber": "64829167000142",
    "BirthdayDate": "2019-04-25",
    "WebSite": "https://www.website.com.br",
    "ContactName": "Joao Costa",
    "MailAddress": "address@email.mail.com",
    "ContactPhone": "2133333334",
    "Blocked": true,
    "Analysis": {
        "Status": 5
    },
    "Address": {
        "ZipCode": "20020081",
        "Street": "My street updated",
        "Number": "20",
        "Complement": "My Complement Seller",
        "City": "My City Master",
        "Neighborhood": "My Neighborhood Seller",
        "State": "RJ"
    },
    "BankAccount": {
        "BankId": 1,
        "Bank": "001",
        "BankAccountType": "CheckingAccount",
        "Number": "0002",
        "AgencyNumber": "0002",
        "AgencyDigit": "2",
        "VerifierDigit": "2",
        "Operation": "2"
    },
    "Agreements": [
        {
            "Fee": 100,
            "AntiFraudFee": 0,
            "AntiFraudFeeWithReview": 0,
            "MerchantDiscountRates": [
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Elo"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "BankSlip",
                        "Brand": "BancoDoBrasil"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "DebitCard",
                        "Brand": "Elo"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Visa"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Amex"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 12,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "DebitCard",
                        "Brand": "Visa"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Elo"
                    },
                    "InitialInstallmentNumber": 2,
                    "FinalInstallmentNumber": 6,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 2,
                    "FinalInstallmentNumber": 6,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Visa"
                    },
                    "InitialInstallmentNumber": 2,
                    "FinalInstallmentNumber": 6,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Elo"
                    },
                    "InitialInstallmentNumber": 7,
                    "FinalInstallmentNumber": 12,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Visa"
                    },
                    "InitialInstallmentNumber": 7,
                    "FinalInstallmentNumber": 8,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 7,
                    "FinalInstallmentNumber": 8,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Visa"
                    },
                    "InitialInstallmentNumber": 9,
                    "FinalInstallmentNumber": 12,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 9,
                    "FinalInstallmentNumber": 12,
                    "Percent": 2.0
                }
            ]
        }
    ],
    "Links": [
        {
            "Href": "http://splitonboardingapisandbox.braspag.com.br/api/merchants/5dcee8e4-f432-42e4-a2a6-5a30c8ce2ca5",
            "Rel": "self",
            "Method": "GET"
        }
    ]
}
```

#### Propriedades do seller

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|
| `Id` | GUID | 36 | Identificação do merchant (Subordinate) |
| `Type` | Texto | 15 | Tipo de merchant criado (Subordinate) |
| `MasterMerchantId` | GUID | 36 | Identificação do Master |
| `CorporateName` | Texto | 100 | Razão social |
| `FancyName` | Texto | 50 | Nome fantasia |
| `DocumentType` | Texto | - | Tipo do documento. Os tipos válidos são _Cpf_, _Cnpj_ |
| `DocumentNumber` | Texto | 14 | Número do documento |
| `BirthdayDate` | Data | 10 | Data de nascimento (apenas para cadastro de pessoa física - CPF) |
| `Website` | Texto | 200 | Endereço do website |
| `ContactName` | Texto | 100 | Nome do contato responsável |
| `MailAddress` | Texto | 50 | Endereço de e-mail |
| `ContactPhone` | Texto | 11 | Número do telefone do contato responsável |
| `Blocked` | Booleano | - | Flag para indicar se o seller está bloqueado para participar da transação |
| `Analysis.Status` | Texto| - | Status da análise do processo de KYC. Os Status válidos são _UnderAnalysis_, _Approved_, _ApprovedWithRestriction_ e _Rejected_ |

#### Propriedades do endereço

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|
| `Address.ZipCode` | Texto | 9 | CEP |
| `Address.Street` | Texto | 100 | Rua do endereço |
| `Address.Number` | Texto | 15 | Número do endereço |
| `Address.Complement` | Texto | 80 | Complemento do endereço |
| `Address.Neighborhood` | Texto | 50 | Bairro |
| `Address.City` | Texto | 50 | Cidade |
| `Address.State` | Texto | 2 | Sigla do estado |

#### Propriedades da conta bancária

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|
| `BankAccount.BankId` | Número | - | Identificação do banco. |
| `BankAccount.Bank` | Texto | 3 | Código de compensação do banco. [Lista de Códigos de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o) |
| `BankAccount.BankAccountType` | Texto | - | Tipo de conta bancária. Os tipos válidos são _CheckingAccount_ (Conta corrente) e _SavingsAccount_ (Conta poupança) |
| `BankAccount.Number` | Texto | 10 | Número da conta |
| `BankAccount.AgencyNumber` | Texto | 15 | Número da agência do seller. *Atenção: Valores zerados como "0", "00", "000" são inválidos*. |
| `BankAccount.AgencyDigit` | Texto | 1 | Dígito da agência |
| `BankAccount.DocumentNumber` | Texto | 14 | Número do documento da conta |
| `BankAccount.DocumentType` | Texto | - | Tipo do documento. Os tipos válidos são Cpf, Cnpj |
| `BankAccount.VerifierDigit` | Texto | 1 | Dígito verificador da conta |
| `BankAccount.Operation` | Texto | 10 | Operação da conta |

#### Propriedades do acordo de taxas

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|
| `Agreements[].Fee` | Número | - | Taxa fixa por transação |
| `Agreements[].AntiFraudFee` | Número | - | Taxa do anti-fraude |
| `Agreements[].AntiFraudFeeWithReview` | Número | - | Taxa do anti-fraude taxa com revisão manual |
| `Agreements[].MerchantDiscountRates[].PaymentArrangement.Product` | Texto | - | Produto do arranjo de pagamento da taxa de desconto do seller |
| `Agreements[].MerchantDiscountRates[].PaymentArrangement.Brand` | Texto | - | Bandeira do arranjo de pagamento da taxa de desconto do seller |
| `Agreements[].MerchantDiscountRates[].InitialInstallmentNumber` | Número | - | Número inicial do intervalo de parcelas da taxa de desconto do seller |
| `Agreements[].MerchantDiscountRates[].FinalInstallmentNumber` | Número | - | Número final do intervalo de parcelas da taxa de desconto do seller | 
| `Agreements[].MerchantDiscountRates[].Percent` | Decimal | - | Porcentagem da taxa de desconto do seller |
| `Links` | - | - | Links para navegação |

### Exemplos dos acordos de taxas

#### Não informar taxas

Quando não haverá cobrança de MDR, siga a requisição padrão excluindo o nó `Agreements`.

Veja a seguir o exemplo de uma requisição completa para cadastro de um seller do tipo CNPJ e ausência de cobrança de MDR:

**Requisição**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/merchants</span></aside>

```json
{
    "Type": "Subordinate",
    "MasterMerchantId": "f88cc14d-c796-4939-957e-de4dddcb2257",
    "ContactName": "Nome do Contato do Seller",
    "ContactPhone": "11987654321",
    "CorporateName": "Seller Corporativo Ltda",
    "DocumentNumber": "96462142000140",
    "DocumentType": "CNPJ",
    "FancyName": "Seller Nome Fantasia",
    "MailAddress": "address@email.mail.com",
    "Website": "https://www.website.com.br",
    "BankAccount": {
        "Bank": "001",
        "BankAccountType": "CheckingAccount",
        "Number": "0002",
        "Operation": "2",
        "VerifierDigit": "2",
        "AgencyNumber": "0002",
        "AgencyDigit": "2",
        "DocumentNumber": "96462142000140",
        "DocumentType": "CNPJ"
    },
    "Address": {
        "Street": "Rua Teste",
        "Number": "50",
        "Complement": "AP 255",
        "Neighborhood": "Centro",
        "City": "São Paulo",
        "State": "SP",
        "ZipCode": "12345687"
    },
        "Attachments": [
        {
            "AttachmentType": "ProofOfBankDomicile",
            "File": {
                "Name": "comprovante",
                "FileType": "png",
                "Data": "iVBORw0KGgoAAAANSUhEUgAAAH4AAAAsCAMAAACUu/xGAAAAq1BMVEUAAABlZVJlZVKsrJthYU+zs6Grq5ylpZazs6FlZVJfX01lZVJlZVKsrJurq5urq5xlZVKtrZ1lZVJlZVKvr52zs6GysqCoqJeqqpmzs6Grq5xlZVJgYE6zs6Gnp5mrq5yiopRjY1CRkX2rq5yzs6FlZVKRkX2goJKKineRkX2Pj3yrq5yIiHWRkX2RkX2RkX1lZVKRkX2rq5yzs6GoqJdfX02goJKHh3SHh3VrpzVsAAAAMHRSTlMAQIDHx3+Ax0Ag7qBgIA9AEFCPMLOgMO7bYKBQ24+zYNuzkY9wcAXu0oiocPFBMHYlVbK0AAAD3UlEQVRYw6SW7Y6qMBCGB0IkLfKdnB9ocFmjru7HERL03P+VnXY6bdmWjcF9f2inxjydvjMDcHy99zP693oEpTpQYjBR7W4VmzA81GoZCDn/ycrValVmYOJcKBWL1/4HnUEpupLGxOI47iQmDkfc4GEBEFyNQkClzYDKQQs3VmJBufu6G7zRWNMeUzEHUnLVWs/gy9vg4NNB4wUIPOG2h7e8NcV0HRt7QPDxfzTd4ptleB5F6ro3NtsIc7UnjMKKXyuN30ZS+PuLRMW7PN+l2vlhAZ6yqCZmcrm05stfOrwVpvEBaJWStIOpVk/gC8Rb62tjRj25Fx/fEsgqE27cluKB8GR9hDFzeX44CFbmJb9/Cn8w1ldA5tO9VD/gc8FpveTbxfi1LXWOl10Z80c0Yx7/jpyyjRtd9zuxU8ZL8FEYJjZFpg6yIfOpKsf1FJ+EUkzddKkabQ+o0zCcwMN/vZm+uLh4UmW7nptTCBVq5nUF4Y0CgBaNVip18jsPn370909cfX708/gusF3fkQfrKZHXHh45Wi8meRefvfVCfwGOZ9zx8TZ9TjWY2M6vVf4jm8e3WYrDJ1Vj4N3FHwVd6vKFCxefBMFmq7ub6UI7TMZw0SEv8ryPDVaoxPiWufhL/02zY0cm3ZH1VgxIIYa1U/nIibH/EZjjp4M/9w/x9FijbyuqdzOVH+BbWQJxHMupd4pjINhDPKVH1lslBl9g6OKb73j0wmoBHrMj691nsJ0QLn4l0/09nrIm6wv7nGdQqwjGucvPJSWjN4z8aXyBlkfK+i2gmDI/HENGjXA9uPhsUJ22p2OQFg3daaFx0/9qnWBRbOl9hHlvOw3OW/xs4Hf4rcnYzj+OeFOIHj4dtG7/2y+b3IhBGAqjUiQWQ9JI/ErDpop6gcei9z9ZIXHIhLaLSGRW8zYxIuaTZccxqsGfHDXvH4cf37Z4e3ihxVOTp5bf4E8N2u+3PWB2SP7tXsfsFl80rtOeZX/gvz6//7tmnFFzD2mkxnFgL710ToHH1eCcm/LU2aA9m027v+kBH8ipyHbACxAMWaV5I4v2ZgAzIxkUGXIqkn3xrhw4wVe8hoMmOwBmYJMiJy+lHPriNcSyrvgEgUS2h/vl1BcvSqgcZsPbbABrhgdgvhgvS6hIYsPP8MwTVR5SLZA4573xHMpCV7xGZBFmxyProfR64yNCgKh4hygjXIuvpdcbPyEayA2vsEpRHcgl6gtzr8A9ho0RlgQnBPoK4tV45gBfGQZ6KQBDqzRcjdeAqQwHUfYp+SohcQdc1/Ukm4Gw4dV6vqTkM+uQpRv8E2VPF/sPp9xSb2qlGH4AAAAASUVORK5CYII="
            }
        }
    ]
}
```

Veja as propriedades na [requisição padrão](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#requisi%C3%A7%C3%A3o10).

#### Taxa global

Quando o MDR é único para todos os acordos, envie apenas os campos `Agreements[].Percent` (porcentagem do MDR) e `Agreements[].Fee` (taxa fixa) no nó `Agreements`.

**Requisição**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/merchants</span></aside>

```json
{
    "Type": "Subordinate",
    "MasterMerchantId": "f88cc14d-c796-4939-957e-de4dddcb2257",
    "ContactName": "Nome do Contato do Seller",
    "ContactPhone": "11987654321",
    "CorporateName": "Seller Corporativo Ltda",
    "DocumentNumber": "96462142000140",
    "DocumentType": "CNPJ",
    "FancyName": "Seller Nome Fantasia",
    "MailAddress": "addres@email.mail.com",
    "Website": "https://www.website.com.br",
    "BankAccount": {
        "Bank": "001",
        "BankAccountType": "CheckingAccount",
        "Number": "0002",
        "Operation": "2",
        "VerifierDigit": "2",
        "AgencyNumber": "0002",
        "AgencyDigit": "2",
        "DocumentNumber": "96462142000140",
        "DocumentType": "CNPJ"
    },
    "Address": {
        "Street": "Rua Teste",
        "Number": "50",
        "Complement": "AP 255",
        "Neighborhood": "Centro",
        "City": "São Paulo",
        "State": "SP",
        "ZipCode": "12345687"
    },
    "Agreements": [
        {
            "Percent": 2.0,
            "Fee": 100
        }
    ],
    "Attachments": [
        {
            "AttachmentType": "ProofOfBankDomicile",
            "File": {
                "Name": "comprovante",
                "FileType": "png",
                "Data": "iVBORw0KGgoAAAANSUhEUgAAAH4AAAAsCAMAAACUu/xGAAAAq1BMVEUAAABlZVJlZVKsrJthYU+zs6Grq5ylpZazs6FlZVJfX01lZVJlZVKsrJurq5urq5xlZVKtrZ1lZVJlZVKvr52zs6GysqCoqJeqqpmzs6Grq5xlZVJgYE6zs6Gnp5mrq5yiopRjY1CRkX2rq5yzs6FlZVKRkX2goJKKineRkX2Pj3yrq5yIiHWRkX2RkX2RkX1lZVKRkX2rq5yzs6GoqJdfX02goJKHh3SHh3VrpzVsAAAAMHRSTlMAQIDHx3+Ax0Ag7qBgIA9AEFCPMLOgMO7bYKBQ24+zYNuzkY9wcAXu0oiocPFBMHYlVbK0AAAD3UlEQVRYw6SW7Y6qMBCGB0IkLfKdnB9ocFmjru7HERL03P+VnXY6bdmWjcF9f2inxjydvjMDcHy99zP693oEpTpQYjBR7W4VmzA81GoZCDn/ycrValVmYOJcKBWL1/4HnUEpupLGxOI47iQmDkfc4GEBEFyNQkClzYDKQQs3VmJBufu6G7zRWNMeUzEHUnLVWs/gy9vg4NNB4wUIPOG2h7e8NcV0HRt7QPDxfzTd4ptleB5F6ro3NtsIc7UnjMKKXyuN30ZS+PuLRMW7PN+l2vlhAZ6yqCZmcrm05stfOrwVpvEBaJWStIOpVk/gC8Rb62tjRj25Fx/fEsgqE27cluKB8GR9hDFzeX44CFbmJb9/Cn8w1ldA5tO9VD/gc8FpveTbxfi1LXWOl10Z80c0Yx7/jpyyjRtd9zuxU8ZL8FEYJjZFpg6yIfOpKsf1FJ+EUkzddKkabQ+o0zCcwMN/vZm+uLh4UmW7nptTCBVq5nUF4Y0CgBaNVip18jsPn370909cfX708/gusF3fkQfrKZHXHh45Wi8meRefvfVCfwGOZ9zx8TZ9TjWY2M6vVf4jm8e3WYrDJ1Vj4N3FHwVd6vKFCxefBMFmq7ub6UI7TMZw0SEv8ryPDVaoxPiWufhL/02zY0cm3ZH1VgxIIYa1U/nIibH/EZjjp4M/9w/x9FijbyuqdzOVH+BbWQJxHMupd4pjINhDPKVH1lslBl9g6OKb73j0wmoBHrMj691nsJ0QLn4l0/09nrIm6wv7nGdQqwjGucvPJSWjN4z8aXyBlkfK+i2gmDI/HENGjXA9uPhsUJ22p2OQFg3daaFx0/9qnWBRbOl9hHlvOw3OW/xs4Hf4rcnYzj+OeFOIHj4dtG7/2y+b3IhBGAqjUiQWQ9JI/ErDpop6gcei9z9ZIXHIhLaLSGRW8zYxIuaTZccxqsGfHDXvH4cf37Z4e3ihxVOTp5bf4E8N2u+3PWB2SP7tXsfsFl80rtOeZX/gvz6//7tmnFFzD2mkxnFgL710ToHH1eCcm/LU2aA9m027v+kBH8ipyHbACxAMWaV5I4v2ZgAzIxkUGXIqkn3xrhw4wVe8hoMmOwBmYJMiJy+lHPriNcSyrvgEgUS2h/vl1BcvSqgcZsPbbABrhgdgvhgvS6hIYsPP8MwTVR5SLZA4573xHMpCV7xGZBFmxyProfR64yNCgKh4hygjXIuvpdcbPyEayA2vsEpRHcgl6gtzr8A9ho0RlgQnBPoK4tV45gBfGQZ6KQBDqzRcjdeAqQwHUfYp+SohcQdc1/Ukm4Gw4dV6vqTkM+uQpRv8E2VPF/sPp9xSb2qlGH4AAAAASUVORK5CYII="
            }
        }
    ]
}
```

Veja as propriedades na [requisição padrão](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#requisi%C3%A7%C3%A3o10).

#### Taxa por meio de pagamento

Nesse caso, você deverá informar os campos referentes à taxa fixa, produto, bandeira, intervalo de parcelas e porcentagem do MDR.

> Os arranjos informados no cadastro do seller precisam ser iguais aos acordos entre master e Split.

**Exemplo**

MDR do master com seller igual a 4%.

| ACORDO SUBADQUIRENTE (SPLIT) E MASTER | VISA | MASTERCARD | ELO |
|---|---|---|---|
| **Débito** | 2.00% | 2.00% | 2.00% |
| **Crédito à vista** | 2.50% | 2.50% | 2.50% |
| **Crédito 2x a 6x** | 3.00% | 3.00% | 3.00% |
| **Crédito 7x a 12x** | 3.50% | 3.50% | 3.50% |

| ACORDO MASTER E SELLER | VISA | MASTERCARD | ELO |
|---|---|---|---|
| **Débito** | 4.00% | 4.00% | 4.00% |
| **Crédito à vista** | 4.00% | 4.00% | 4.00% |
| **Crédito 2x a 6x** | 4.00% | 4.00% | 4.00% |
| **Crédito 7x a 12x** | 4.00% | 4.00% | 4.00% |

**Requisição**

Veja a seguir o exemplo de requisição de cadastro de seller com CPF com acordo de taxas por arranjo de pagamento e intervalo de parcelas. 

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/merchants</span></aside>

```json
{
    "Type": "Subordinate",
    "MasterMerchantId": "f88cc14d-c796-4939-957e-de4dddcb2257",
    "BusinessActivityId" : 10,
    "ContactName": "Nome do Contato do Seller",
    "ContactPhone": "11987654321",
    "CorporateName": "Nome do Seller",
    "DocumentNumber": "91205046089",
    "DocumentType": "CPF",
    "FancyName": "Nome do Seller",
    "BirthdayDate": "1984-04-25",
    "MailAddress": "address@email.mail.com",
    "Website": "https://www.website.com.br",
    "BankAccount": {
        "Bank": "001",
        "BankAccountType": "CheckingAccount",
        "Number": "0002",
        "Operation": "2",
        "VerifierDigit": "2",
        "AgencyNumber": "0002",
        "AgencyDigit": "2",
        "DocumentNumber": "91205046089",
        "DocumentType": "CPF"
    },
    "Address": {
        "Street": "Rua Teste",
        "Number": "50",
        "Complement": "AP 255",
        "Neighborhood": "Centro",
        "City": "São Paulo",
        "State": "SP",
        "ZipCode": "12345687"
    },
    "Agreements": [
        {
            "Fee": 10,
            "MerchantDiscountRates": [
                {
                    "PaymentArrangement": {
                        "Product": "DebitCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 1.5
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 1,
                    "FinalInstallmentNumber": 1,
                    "Percent": 2.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 2,
                    "FinalInstallmentNumber": 6,
                    "Percent": 3.0
                },
                {
                    "PaymentArrangement": {
                        "Product": "CreditCard",
                        "Brand": "Master"
                    },
                    "InitialInstallmentNumber": 7,
                    "FinalInstallmentNumber": 12,
                    "Percent": 4.0
                }
            ]
        }
    ],
    "Attachments": [
        {
            "AttachmentType": "ProofBusinessActivity",
            "File": {
                "Name": "comprovante",
                "FileType": "png",
                "Data": "iVBORw0KGgoAAAANSUhEUgAAAH4AAAAsCAMAAACUu/xGAAAAq1BMVEUAAABlZVJlZVKsrJthYU+zs6Grq5ylpZazs6FlZVJfX01lZVJlZVKsrJurq5urq5xlZVKtrZ1lZVJlZVKvr52zs6GysqCoqJeqqpmzs6Grq5xlZVJgYE6zs6Gnp5mrq5yiopRjY1CRkX2rq5yzs6FlZVKRkX2goJKKineRkX2Pj3yrq5yIiHWRkX2RkX2RkX1lZVKRkX2rq5yzs6GoqJdfX02goJKHh3SHh3VrpzVsAAAAMHRSTlMAQIDHx3+Ax0Ag7qBgIA9AEFCPMLOgMO7bYKBQ24+zYNuzkY9wcAXu0oiocPFBMHYlVbK0AAAD3UlEQVRYw6SW7Y6qMBCGB0IkLfKdnB9ocFmjru7HERL03P+VnXY6bdmWjcF9f2inxjydvjMDcHy99zP693oEpTpQYjBR7W4VmzA81GoZCDn/ycrValVmYOJcKBWL1/4HnUEpupLGxOI47iQmDkfc4GEBEFyNQkClzYDKQQs3VmJBufu6G7zRWNMeUzEHUnLVWs/gy9vg4NNB4wUIPOG2h7e8NcV0HRt7QPDxfzTd4ptleB5F6ro3NtsIc7UnjMKKXyuN30ZS+PuLRMW7PN+l2vlhAZ6yqCZmcrm05stfOrwVpvEBaJWStIOpVk/gC8Rb62tjRj25Fx/fEsgqE27cluKB8GR9hDFzeX44CFbmJb9/Cn8w1ldA5tO9VD/gc8FpveTbxfi1LXWOl10Z80c0Yx7/jpyyjRtd9zuxU8ZL8FEYJjZFpg6yIfOpKsf1FJ+EUkzddKkabQ+o0zCcwMN/vZm+uLh4UmW7nptTCBVq5nUF4Y0CgBaNVip18jsPn370909cfX708/gusF3fkQfrKZHXHh45Wi8meRefvfVCfwGOZ9zx8TZ9TjWY2M6vVf4jm8e3WYrDJ1Vj4N3FHwVd6vKFCxefBMFmq7ub6UI7TMZw0SEv8ryPDVaoxPiWufhL/02zY0cm3ZH1VgxIIYa1U/nIibH/EZjjp4M/9w/x9FijbyuqdzOVH+BbWQJxHMupd4pjINhDPKVH1lslBl9g6OKb73j0wmoBHrMj691nsJ0QLn4l0/09nrIm6wv7nGdQqwjGucvPJSWjN4z8aXyBlkfK+i2gmDI/HENGjXA9uPhsUJ22p2OQFg3daaFx0/9qnWBRbOl9hHlvOw3OW/xs4Hf4rcnYzj+OeFOIHj4dtG7/2y+b3IhBGAqjUiQWQ9JI/ErDpop6gcei9z9ZIXHIhLaLSGRW8zYxIuaTZccxqsGfHDXvH4cf37Z4e3ihxVOTp5bf4E8N2u+3PWB2SP7tXsfsFl80rtOeZX/gvz6//7tmnFFzD2mkxnFgL710ToHH1eCcm/LU2aA9m027v+kBH8ipyHbACxAMWaV5I4v2ZgAzIxkUGXIqkn3xrhw4wVe8hoMmOwBmYJMiJy+lHPriNcSyrvgEgUS2h/vl1BcvSqgcZsPbbABrhgdgvhgvS6hIYsPP8MwTVR5SLZA4573xHMpCV7xGZBFmxyProfR64yNCgKh4hygjXIuvpdcbPyEayA2vsEpRHcgl6gtzr8A9ho0RlgQnBPoK4tV45gBfGQZ6KQBDqzRcjdeAqQwHUfYp+SohcQdc1/Ukm4Gw4dV6vqTkM+uQpRv8E2VPF/sPp9xSb2qlGH4AAAAASUVORK5CYII="
            }
        }
    ]
}
```

Veja as propriedades na [requisição padrão](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#requisi%C3%A7%C3%A3o10).

## DEPRECATED - Cadastro de sellers 1.0

Esta seção detalha a integração da API de Onboarding Split 1.0, que será descontinuada em breve.

> Para novas integrações, veja a seção [Cadastro de Sellers 2.0](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#cadastro-de-sellers-2.0){:target="_blank"}.<br>
> Para migração da versão 1.0 para a API de Onboarding Split 2.0, veja as instruções [neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/5786920191387){:target="_blank"}.

A solicitação de cadastro deve ser realizada através de uma requisição pelo **master** informando os dados do seller.

Para a definição de acordos entre o master e seus sellers, o **Split de Pagamentos** dispõe de duas possibilidades:

1. É possível definir a porcentagem do MDR (Merchant Discount Rate) cobrado por transação por Arranjos de Pagamento e intervalo de parcelas.
2. Caso o master não queira definir a porcentagem do MDR para cada Arranjo de Pagamento e intervalo de parcelas, o **Split de Pagamentos** irá replicar os mesmos acordos do master com a Subadquirente (Split), para o master com o seller. Dessa forma, o master deverá informar apenas um MDR único, que será aplicado para todos os acordos.

**Exemplo:**

**MDR do master com seller igual a 4%**

| ACORDO SUBADQUIRENTE e MASTER | Visa  | Master | Elo   | Diners  | Amex  | Hiper  |
|-------------------------------|----------------------------------------------------|
| Débito                        | 2.00% | 2.00%  | 2.00% |    -    |   -   |    -    |  
| Crédito a Vista               | 2.50% | 2.50%  | 2.50% | 2.50%   | 2.50% |  2.50%  |
| Crédito 2x a 6x               | 3.00% | 3.00%  | 3.00% | 3.00%   | 3.00% |  3.00%  |
| Crédito 7x a 12x              | 3.50% | 3.50%  | 3.50% | 3.50%   | 3.50% |  3.50%  |

| ACORDO MASTER e SELLER  | Visa  | Master | Elo   | Diners  | Amex   | Hiper  |
|------------------------------|----------------------------------------------------|
| Débito                       | 4.00% | 4.00%  | 4.00% |    -    |   -    |    -   |  
| Crédito a Vista              | 4.00% | 4.00%  | 4.00% | 4.00%   | 4.00%  |  4.00% |
| Crédito 2x a 6x              | 4.00% | 4.00%  | 4.00% | 4.00%   | 4.00%  |  4.00% |
| Crédito 7x a 12x             | 4.00% | 4.00%  | 4.00% | 4.00%   | 4.00%  |  4.00% |

### Informando a porcentagem do MDR por Arranjos de Pagamento e intervalo de parcelas

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/subordinates</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "CorporateName":"Seller Corporativo Ltda",
    "FancyName":"Seller Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Seller",
    "ContactPhone":"11987654321",
    "MailAddress":"addres@email.mail.com",
    "Website":"https://www.website.com.br",
    "BankAccount": {
        "Bank":"001",
        "BankAccountType":"CheckingAccount",
        "Number":"0002",
        "Operation":"2",
        "VerifierDigit":"2",
        "AgencyNumber":"0002",
        "AgencyDigit":"2",
        "DocumentNumber":"96462142000140",
        "DocumentType":"CNPJ"
    },
    "Address":{  
        "Street":"Rua Teste",
        "Number":"50",
        "Complement":"AP 255",
        "Neighborhood":"Centro",
        "City":"São Paulo",
        "State" : "SP",
        "ZipCode": "12345687"
    },
    "Agreement":{
        "Fee" : 10,
        "MerchantDiscountRates": [{
            "PaymentArrangement": {
                "Product": "DebitCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 1.5
        },
        {
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 2.0
        },
        {
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 2,
            "FinalInstallmentNumber" : 6,
            "Percent" : 3.0
        },
        {
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 7,
            "FinalInstallmentNumber" : 12,
            "Percent" : 4.0
        }]
    },
    "Notification": {
        "Url": "https://site.com.br/api/subordinados",
        "Headers": [{
            "Key": "key1",
            "Value": "value1"
        },
        {
            "Key": "key2",
            "Value": "value2"
        }]
    },
    "Attachments": [{
        "AttachmentType": "ProofOfBankDomicile",
        "File": {
            "Name": "comprovante",
            "FileType": "png",
            "Data": "iVBORw0KGgoAAAANSUhEUgAAAH4AAAAsCAMAAACUu/xGAAAAq1BMVEUAAABlZVJlZVKsrJthYU+zs6Grq5ylpZazs6FlZVJfX01lZVJlZVKsrJurq5urq5xlZVKtrZ1lZVJlZVKvr52zs6GysqCoqJeqqpmzs6Grq5xlZVJgYE6zs6Gnp5mrq5yiopRjY1CRkX2rq5yzs6FlZVKRkX2goJKKineRkX2Pj3yrq5yIiHWRkX2RkX2RkX1lZVKRkX2rq5yzs6GoqJdfX02goJKHh3SHh3VrpzVsAAAAMHRSTlMAQIDHx3+Ax0Ag7qBgIA9AEFCPMLOgMO7bYKBQ24+zYNuzkY9wcAXu0oiocPFBMHYlVbK0AAAD3UlEQVRYw6SW7Y6qMBCGB0IkLfKdnB9ocFmjru7HERL03P+VnXY6bdmWjcF9f2inxjydvjMDcHy99zP693oEpTpQYjBR7W4VmzA81GoZCDn/ycrValVmYOJcKBWL1/4HnUEpupLGxOI47iQmDkfc4GEBEFyNQkClzYDKQQs3VmJBufu6G7zRWNMeUzEHUnLVWs/gy9vg4NNB4wUIPOG2h7e8NcV0HRt7QPDxfzTd4ptleB5F6ro3NtsIc7UnjMKKXyuN30ZS+PuLRMW7PN+l2vlhAZ6yqCZmcrm05stfOrwVpvEBaJWStIOpVk/gC8Rb62tjRj25Fx/fEsgqE27cluKB8GR9hDFzeX44CFbmJb9/Cn8w1ldA5tO9VD/gc8FpveTbxfi1LXWOl10Z80c0Yx7/jpyyjRtd9zuxU8ZL8FEYJjZFpg6yIfOpKsf1FJ+EUkzddKkabQ+o0zCcwMN/vZm+uLh4UmW7nptTCBVq5nUF4Y0CgBaNVip18jsPn370909cfX708/gusF3fkQfrKZHXHh45Wi8meRefvfVCfwGOZ9zx8TZ9TjWY2M6vVf4jm8e3WYrDJ1Vj4N3FHwVd6vKFCxefBMFmq7ub6UI7TMZw0SEv8ryPDVaoxPiWufhL/02zY0cm3ZH1VgxIIYa1U/nIibH/EZjjp4M/9w/x9FijbyuqdzOVH+BbWQJxHMupd4pjINhDPKVH1lslBl9g6OKb73j0wmoBHrMj691nsJ0QLn4l0/09nrIm6wv7nGdQqwjGucvPJSWjN4z8aXyBlkfK+i2gmDI/HENGjXA9uPhsUJ22p2OQFg3daaFx0/9qnWBRbOl9hHlvOw3OW/xs4Hf4rcnYzj+OeFOIHj4dtG7/2y+b3IhBGAqjUiQWQ9JI/ErDpop6gcei9z9ZIXHIhLaLSGRW8zYxIuaTZccxqsGfHDXvH4cf37Z4e3ihxVOTp5bf4E8N2u+3PWB2SP7tXsfsFl80rtOeZX/gvz6//7tmnFFzD2mkxnFgL710ToHH1eCcm/LU2aA9m027v+kBH8ipyHbACxAMWaV5I4v2ZgAzIxkUGXIqkn3xrhw4wVe8hoMmOwBmYJMiJy+lHPriNcSyrvgEgUS2h/vl1BcvSqgcZsPbbABrhgdgvhgvS6hIYsPP8MwTVR5SLZA4573xHMpCV7xGZBFmxyProfR64yNCgKh4hygjXIuvpdcbPyEayA2vsEpRHcgl6gtzr8A9ho0RlgQnBPoK4tV45gBfGQZ6KQBDqzRcjdeAqQwHUfYp+SohcQdc1/Ukm4Gw4dV6vqTkM+uQpRv8E2VPF/sPp9xSb2qlGH4AAAAASUVORK5CYII="
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CorporateName`                                                 | Texto  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | Texto  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | Texto  | 14      | Sim         | Número do documento (Apenas números)                                                                                                                                                                                                 |     
| `DocumentType`                                                  | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | Texto  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | Texto  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | Texto  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | Texto  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | Texto  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | Texto  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o) |
| `BankAccount.BankAccountType`                                   | Texto  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | Texto  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | Texto  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Texto    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | Texto  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Texto    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                             |
| `BankAccount.DocumentNumber`                                    | Texto  | 14      | Sim         | Número do documento da conta (Apenas números)                                                                                                                                                                                        |
| `BankAccount.DocumentType`                                      | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | Texto  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | Texto  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | Texto  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | Texto  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | Texto  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | Texto  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | Texto  | 9       | Sim         | CEP (Apenas números)                                                                                                                                                                                                                 |
| `Agreement.Fee`                                                 | Número     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | Texto  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do seller. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | Texto  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do seller. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Número     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                 |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Número     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do seller. Valor com até duas casas decimais                                                                                                                                                    |
| `Notification.Url`                                              | Texto  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | Texto  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | Texto  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | Texto  | -       | Não         | Tipo do documento em anexo do seller. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | Texto  | 50      | Não         | Nome do arquivo do documento em anexo do seller                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | Texto  | -       | Não         | Tipo do arquivo do documento em anexo do seller. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |
| `Attachments[].File.Data`                                       | Texto  | -       | Não         | Documento convertido para **Base64**   |

#### Resposta

```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Seller Corporativo Ltda",
    "FancyName":"Seller Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Seller",
    "ContactPhone":"11987654321",
    "MailAddress":"addres@email.mail.com",
    "Website":"https://www.website.com.br",
    "Blocked": true,
    "Analysis": {
        "Status": "UnderAnalysis"
    },
    "BankAccount": {
        "Bank":"001",
        "BankAccountType":"CheckingAccount",
        "Number":"0002",
        "Operation":"2",
        "VerifierDigit":"2",
        "AgencyNumber":"0002",
        "AgencyDigit":"2",
        "DocumentNumber":"96462142000140",
        "DocumentType":"CNPJ"
    },
    "Address":{  
        "Street":"Rua Teste",
        "Number":"50",
        "Complement":"AP 255",
        "Neighborhood":"Centro",
        "City":"São Paulo",
        "State" : "SP",
        "ZipCode": "12345687"
    },
    "Agreement":{
        "Fee" : 10,
        "MerchantDiscountRates": [{
            "MerchantDiscountRateId": "662e340f-07f2-4827-816d-b1878eb03eae",
            "PaymentArrangement": {
                "Product": "DebitCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 1.5
        },
        {
            "MerchantDiscountRateId": "eb9d6357-7ad1-4fe0-90fe-364cff7ff0fd",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 2.0
        },
        {
            "MerchantDiscountRateId": "d09fe9d3-98c7-4c37-9bd3-7c1c91ee15de",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 2,
            "FinalInstallmentNumber" : 6,
            "Percent" : 3.0
        },
        {
            "MerchantDiscountRateId": "e2515c24-fd73-4b8e-92ad-cfe2b95239de",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 7,
            "FinalInstallmentNumber" : 12,
            "Percent" : 4.0
        }]
    },
    "Notification": {
        "Url": "https://site.com.br/api/subordinados",
        "Headers": [{
            "Key": "key1",
            "Value": "value1"
        },
        {
            "Key": "key2",
            "Value": "value2"
        }]
    },
    "Attachments": [{
        "AttachmentType": "ProofOfBankDomicile",
        "File": {
            "Name": "comprovante",
            "FileType": "png"
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MasterMerchantId`                                              | GUID    | 36      | Sim         | Identificação do master do seller                                                                                                                                                                                               |
| `MerchantId`                                                    | GUID    | 36      | Sim         | Identificação do seller                                                                                                                                                                                                         |
| `CorporateName`                                                 | Texto  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | Texto  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | Texto  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | Texto  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | Texto  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | Texto  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | Texto  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Booleano | -       | Sim         | Flag para indicar se o seller está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | Texto  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `BankAccount.Bank`                                              | Texto  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o) |
| `BankAccount.BankAccountType`                                   | Texto  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | Texto  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | Texto  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Texto    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | Texto  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Texto    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                            |
| `BankAccount.DocumentNumber`                                    | Texto  | 14      | Sim         | Número do documento da conta                                                                                                                                                                                                         |
| `BankAccount.DocumentType`                                      | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | Texto  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | Texto  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | Texto  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | Texto  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | Texto  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | Texto  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | Texto  | 9       | Sim         | CEP                                                                                                                                                                                                                                  |
| `Agreement.Fee`                                                 | Número     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | GUID    | 36      | Sim         | Identificação da taxa de desconto do seller                                                                                                                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | Texto  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do seller. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | Texto  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do seller. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Número     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                 |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Número     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do seller. Valor com até duas casas decimais                                                                                                                                                    |
| `Notification.Url`                                              | Texto  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | Texto  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | Texto  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | Texto  | -       | Não         | Tipo do documento em anexo do seller. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | Texto  | 50      | Não         | Nome do arquivo do documento em anexo do seller                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | Texto  | -       | Não         | Tipo do arquivo do documento em anexo do seller. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

### Informando a porcentagem do MDR único aplicado para todos os acordos

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/subordinates</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "CorporateName":"Seller Corporativo Ltda",
    "FancyName":"Seller Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Seller",
    "ContactPhone":"11987654321",
    "MailAddress":"addres@email.mail.com",
    "Website":"https://www.website.com.br",
    "BankAccount": {
        "Bank":"001",
        "BankAccountType":"CheckingAccount",
        "Number":"0002",
        "Operation":"2",
        "VerifierDigit":"2",
        "AgencyNumber":"0002",
        "AgencyDigit":"2",
        "DocumentNumber":"96462142000140",
        "DocumentType":"CNPJ"
    },
    "Address":{  
        "Street":"Rua Teste",
        "Number":"50",
        "Complement":"AP 255",
        "Neighborhood":"Centro",
        "City":"São Paulo",
        "State" : "SP",
        "ZipCode": "12345687"
    },
    "Agreement":{
        "Fee" : 10,
        "MdrPercentage": 4.00
    },
    "Notification": {
        "Url": "https://site.com.br/api/subordinados",
        "Headers": [{
            "Key": "key1",
            "Value": "value1"
        },
        {
            "Key": "key2",
            "Value": "value2"
        }]
    },
    "Attachments": [{
        "AttachmentType": "ProofOfBankDomicile",
        "File": {
            "Name": "comprovante",
            "FileType": "png",
            "Data": "iVBORw0KGgoAAAANSUhEUgAAAH4AAAAsCAMAAACUu/xGAAAAq1BMVEUAAABlZVJlZVKsrJthYU+zs6Grq5ylpZazs6FlZVJfX01lZVJlZVKsrJurq5urq5xlZVKtrZ1lZVJlZVKvr52zs6GysqCoqJeqqpmzs6Grq5xlZVJgYE6zs6Gnp5mrq5yiopRjY1CRkX2rq5yzs6FlZVKRkX2goJKKineRkX2Pj3yrq5yIiHWRkX2RkX2RkX1lZVKRkX2rq5yzs6GoqJdfX02goJKHh3SHh3VrpzVsAAAAMHRSTlMAQIDHx3+Ax0Ag7qBgIA9AEFCPMLOgMO7bYKBQ24+zYNuzkY9wcAXu0oiocPFBMHYlVbK0AAAD3UlEQVRYw6SW7Y6qMBCGB0IkLfKdnB9ocFmjru7HERL03P+VnXY6bdmWjcF9f2inxjydvjMDcHy99zP693oEpTpQYjBR7W4VmzA81GoZCDn/ycrValVmYOJcKBWL1/4HnUEpupLGxOI47iQmDkfc4GEBEFyNQkClzYDKQQs3VmJBufu6G7zRWNMeUzEHUnLVWs/gy9vg4NNB4wUIPOG2h7e8NcV0HRt7QPDxfzTd4ptleB5F6ro3NtsIc7UnjMKKXyuN30ZS+PuLRMW7PN+l2vlhAZ6yqCZmcrm05stfOrwVpvEBaJWStIOpVk/gC8Rb62tjRj25Fx/fEsgqE27cluKB8GR9hDFzeX44CFbmJb9/Cn8w1ldA5tO9VD/gc8FpveTbxfi1LXWOl10Z80c0Yx7/jpyyjRtd9zuxU8ZL8FEYJjZFpg6yIfOpKsf1FJ+EUkzddKkabQ+o0zCcwMN/vZm+uLh4UmW7nptTCBVq5nUF4Y0CgBaNVip18jsPn370909cfX708/gusF3fkQfrKZHXHh45Wi8meRefvfVCfwGOZ9zx8TZ9TjWY2M6vVf4jm8e3WYrDJ1Vj4N3FHwVd6vKFCxefBMFmq7ub6UI7TMZw0SEv8ryPDVaoxPiWufhL/02zY0cm3ZH1VgxIIYa1U/nIibH/EZjjp4M/9w/x9FijbyuqdzOVH+BbWQJxHMupd4pjINhDPKVH1lslBl9g6OKb73j0wmoBHrMj691nsJ0QLn4l0/09nrIm6wv7nGdQqwjGucvPJSWjN4z8aXyBlkfK+i2gmDI/HENGjXA9uPhsUJ22p2OQFg3daaFx0/9qnWBRbOl9hHlvOw3OW/xs4Hf4rcnYzj+OeFOIHj4dtG7/2y+b3IhBGAqjUiQWQ9JI/ErDpop6gcei9z9ZIXHIhLaLSGRW8zYxIuaTZccxqsGfHDXvH4cf37Z4e3ihxVOTp5bf4E8N2u+3PWB2SP7tXsfsFl80rtOeZX/gvz6//7tmnFFzD2mkxnFgL710ToHH1eCcm/LU2aA9m027v+kBH8ipyHbACxAMWaV5I4v2ZgAzIxkUGXIqkn3xrhw4wVe8hoMmOwBmYJMiJy+lHPriNcSyrvgEgUS2h/vl1BcvSqgcZsPbbABrhgdgvhgvS6hIYsPP8MwTVR5SLZA4573xHMpCV7xGZBFmxyProfR64yNCgKh4hygjXIuvpdcbPyEayA2vsEpRHcgl6gtzr8A9ho0RlgQnBPoK4tV45gBfGQZ6KQBDqzRcjdeAqQwHUfYp+SohcQdc1/Ukm4Gw4dV6vqTkM+uQpRv8E2VPF/sPp9xSb2qlGH4AAAAASUVORK5CYII="
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CorporateName`                                                 | Texto  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | Texto  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | Texto  | 14      | Sim         | Número do documento (Apenas números)                                                                                                                                                                                                 |     
| `DocumentType`                                                  | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | Texto  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | Texto  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | Texto  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | Texto  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | Texto  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | Texto  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o)   |
| `BankAccount.BankAccountType`                                   | Texto  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | Texto  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | Texto  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Texto    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | Texto  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Texto    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                             |
| `BankAccount.DocumentNumber`                                    | Texto  | 14      | Sim         | Número do documento da conta (Apenas números)                                                                                                                                                                                        |
| `BankAccount.DocumentType`                                      | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | Texto  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | Texto  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | Texto  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | Texto  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | Texto  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | Texto  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | Texto  | 9       | Sim         | CEP (Apenas números)                                                                                                                                                                                                                 |
| `Agreement.Fee`                                                 | Número     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MdrPercentage`                                       | Decimal | -       | Sim         | Porcentagem da taxa de desconto única que será aplicada para todos os acordos entre Master e Seller. Valor com até duas casas decimais                                                                                        |
| `Notification.Url`                                              | Texto  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | Texto  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | Texto  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | Texto  | -       | Não         | Tipo do documento em anexo do seller. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | Texto  | 50      | Não         | Nome do arquivo do documento em anexo do seller                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | Texto  | -       | Não         | Tipo do arquivo do documento em anexo do seller. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |
| `Attachments[].File.Data`                                       | Texto  | -       | Não         | Documento convertido para **Base64** |

#### Resposta

```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Seller Corporativo Ltda",
    "FancyName":"Seller Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Seller",
    "ContactPhone":"11987654321",
    "MailAddress":"addres@email.mail.com",
    "Website":"https://www.website.com.br",
    "Blocked": true,
    "Analysis": {
        "Status": "UnderAnalysis"
    },
    "BankAccount": {
        "Bank":"001",
        "BankAccountType":"CheckingAccount",
        "Number":"0002",
        "Operation":"2",
        "VerifierDigit":"2",
        "AgencyNumber":"0002",
        "AgencyDigit":"2",
        "DocumentNumber":"96462142000140",
        "DocumentType":"CNPJ"
    },
    "Address":{  
        "Street":"Rua Teste",
        "Number":"50",
        "Complement":"AP 255",
        "Neighborhood":"Centro",
        "City":"São Paulo",
        "State" : "SP",
        "ZipCode": "12345687"
    },
    "Agreement":{
        "Fee" : 10,
        "MerchantDiscountRates": [{
            "MerchantDiscountRateId": "662e340f-07f2-4827-816d-b1878eb03eae",
            "PaymentArrangement": {
                "Product": "DebitCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 4
        },
        {
            "MerchantDiscountRateId": "eb9d6357-7ad1-4fe0-90fe-364cff7ff0fd",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 4
        },
        {
            "MerchantDiscountRateId": "d09fe9d3-98c7-4c37-9bd3-7c1c91ee15de",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 2,
            "FinalInstallmentNumber" : 6,
            "Percent" : 4
        },
        {
            "MerchantDiscountRateId": "e2515c24-fd73-4b8e-92ad-cfe2b95239de",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 7,
            "FinalInstallmentNumber" : 12,
            "Percent" : 4
        }]
    },
    "Notification": {
        "Url": "https://site.com.br/api/subordinados",
        "Headers": [{
            "Key": "key1",
            "Value": "value1"
        },
        {
            "Key": "key2",
            "Value": "value2"
        }]
    },
    "Attachments": [{
        "AttachmentType": "ProofOfBankDomicile",
        "File": {
            "Name": "comprovante",
            "FileType": "png"
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MasterMerchantId`                                              | GUID    | 36      | Sim         | Identificação do master do seller                                                                                                                                                                                               |
| `MerchantId`                                                    | GUID    | 36      | Sim         | Identificação do seller                                                                                                                                                                                                         |
| `CorporateName`                                                 | Texto  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | Texto  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | Texto  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | Texto  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | Texto  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | Texto  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | Texto  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Booleano | -       | Sim         | Flag para indicar se o seller está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | Texto  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `BankAccount.Bank`                                              | Texto  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o)|
| `BankAccount.BankAccountType`                                   | Texto  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | Texto  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | Texto  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Texto    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | Texto  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Texto    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                             |
| `BankAccount.DocumentNumber`                                    | Texto  | 14      | Sim         | Número do documento da conta                                                                                                                                                                                                         |
| `BankAccount.DocumentType`                                      | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | Texto  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | Texto  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | Texto  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | Texto  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | Texto  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | Texto  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | Texto  | 9       | Sim         | CEP                                                                                                                                                                                                                                  |
| `Agreement.Fee`                                                 | Número     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | GUID    | 36      | Sim         | Identificação da taxa de desconto do seller                                                                                                                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | Texto  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do seller. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | Texto  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do seller. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Número     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                 |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Número     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do seller. Valor com até duas casas decimais                                                                                                                                                    |
| `Notification.Url`                                              | Texto  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | Texto  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | Texto  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | Texto  | -       | Não         | Tipo do documento em anexo do seller. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | Texto  | 50      | Não         | Nome do arquivo do documento em anexo do seller                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | Texto  | -       | Não         | Tipo do arquivo do documento em anexo do seller. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`  |

# Consulta de Sellers

Você pode consultar um seller específico através do `MerchantId` do seller. Essa consulta é feita pela [API de Onboarding Split 1.0](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#ambientes).

## Requisição

<aside class="request"><span class="method post">GET</span> <span class="endpoint">{split-onboarding-api}/api/subordinates/{subordinate-merchant-id}</span></aside>

## Resposta

```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Seller Corporativo Ltda",
    "FancyName":"Seller Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Seller",
    "ContactPhone":"11987654321",
    "MailAddress":"addres@email.mail.com",
    "Website":"https://www.website.com.br",
    "Blocked": false,
    "Analysis": {
        "Status": "Approved",
        "Score": 89,
        "DenialReason": null
    },
    "BankAccount": {
        "Bank":"001",
        "BankAccountType":"CheckingAccount",
        "Number":"0002",
        "Operation":"2",
        "VerifierDigit":"2",
        "AgencyNumber":"0002",
        "AgencyDigit":"2",
        "DocumentNumber":"96462142000140",
        "DocumentType":"CNPJ"
    },
    "Address":{  
        "Street":"Rua Teste",
        "Number":"50",
        "Complement":"AP 255",
        "Neighborhood":"Centro",
        "City":"São Paulo",
        "State" : "SP",
        "ZipCode": "12345687"
    },
    "Agreement":{
        "Fee" : 10,
        "MerchantDiscountRates": [{
            "MerchantDiscountRateId": "662e340f-07f2-4827-816d-b1878eb03eae",
            "PaymentArrangement": {
                "Product": "DebitCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 1.5
        },
        {
            "MerchantDiscountRateId": "eb9d6357-7ad1-4fe0-90fe-364cff7ff0fd",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 1,
            "FinalInstallmentNumber" : 1,
            "Percent" : 2.0
        },
        {
            "MerchantDiscountRateId": "d09fe9d3-98c7-4c37-9bd3-7c1c91ee15de",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 2,
            "FinalInstallmentNumber" : 6,
            "Percent" : 3.0
        },
        {
            "MerchantDiscountRateId": "e2515c24-fd73-4b8e-92ad-cfe2b95239de",
            "PaymentArrangement": {
                "Product": "CreditCard",
                "Brand": "Master"
            },
            "InitialInstallmentNumber" : 7,
            "FinalInstallmentNumber" : 12,
            "Percent" : 4.0
        }]
    },
    "Notification": {
        "Url": "https://site.com.br/api/subordinados",
        "Headers": [{
            "Key": "key1",
            "Value": "value1"
        },
        {
            "Key": "key2",
            "Value": "value2"
        }]
    },
    "Attachments": [{
        "AttachmentType": "ProofOfBankDomicile",
        "File": {
            "Name": "comprovante",
            "FileType": "png"
        }
    }]
}
```

| Propriedade  | Tipo    | Tamanho | Obrigatório | Descrição |
|-----------------------------------------------------------------|---------|---------|-------------|------------------------------------------------|
| `MasterMerchantId`                                              | GUID    | 36      | Sim         | Identificação do master do seller  |
| `MerchantId`                                                    | GUID    | 36      | Sim         | Identificação do seller  |
| `CorporateName`                                                 | Texto  | 100     | Sim         | Razão social  |
| `FancyName`                                                     | Texto  | 50      | Sim         | Nome fantasia  |
| `DocumentNumber`                                                | Texto  | 14      | Sim         | Número do documento   |
| `DocumentType`                                                  | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj` |
| `MerchantCategoryCode`                                          | Texto  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | Texto  | 100     | Sim         | Nome do contato responsável   |
| `ContactPhone`                                                  | Texto  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)  |
| `MailAddress`                                                   | Texto  | 50      | Sim         | Endereço de e-mail   |
| `Website`                                                       | Texto  | 200     | Não         | Endereço do website  |
| `Blocked`                                                       | Booleano | -       | Sim         | Flag para indicar se o seller está bloqueado para participar da transação  |
| `Analysis.Status`                                               | Texto  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`  |
| `Analysis.Score`                                                | Número     | -       | Não         | Score da análise do processo de KYC. Range de 1 a 100    |
| `Analysis.DenialReason`                                         | Texto  | -       | Não         | Motivo de reprovação do seller |
| `BankAccount.Bank`                                              | Texto  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"} |
| `BankAccount.BankAccountType`                                   | Texto  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)  |
| `BankAccount.Number`                                            | Texto  | 10      | Sim         | Número da conta  |
| `BankAccount.Operation`                                         | Texto  | 10      | Não         | Operação da conta |
| `BankAccount.VerifierDigit`                                     | Texto    | 1       | Sim         | Dígito verificador da conta  |
| `BankAccount.AgencyNumber`                                      | Texto  | 15      | Sim         | Número da agência |
| `BankAccount.AgencyDigit`                                       | Texto    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x    |
| `BankAccount.DocumentNumber`                                    | Texto  | 14      | Sim         | Número do documento da conta    |
| `BankAccount.DocumentType`                                      | Texto  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`  | 
| `Address.Street`                                                | Texto  | 100     | Sim         | Rua do endereço |
| `Address.Number`                                                | Texto  | 15      | Sim         | Número do endereço |
| `Address.Complement`                                            | Texto  | 80      | Não         | Complemento do endereço   |
| `Address.Neighborhood`                                          | Texto  | 50      | Sim         | Bairro |
| `Address.City`                                                  | Texto  | 50      | Sim         | Cidade  |
| `Address.State`                                                 | Texto  | 2       | Sim         | Sigla do estado  |
| `Address.ZipCode`                                               | Texto  | 9       | Sim         | CEP   |
| `Agreement.Fee`                                                 | Número     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`  |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | GUID    | 36      | Sim         | Identificação da taxa de desconto do seller  |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | Texto  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do seller. Os produtos válidos são `CreditCard` e `DebitCard`   |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | Texto  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do seller. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners` e `Hipercard`   |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Número     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**  |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Número     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do seller. Valor com até duas casas decimais   |
| `Notification.Url`                                              | Texto  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC   |
| `Notification.Headers[].Key`                                    | Texto  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC   |
| `Notification.Headers[].Value`                                  | Texto  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC  |
| `Attachments[].AttachmentType`                                  | Texto  | -       | Não         | Tipo do documento em anexo do seller. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)   |
| `Attachments[].File.Name`                                       | Texto  | 50      | Não         | Nome do arquivo do documento em anexo do seller  |
| `Attachments[].File.FileType`                                   | Texto  | -       | Não         | Tipo do arquivo do documento em anexo do seller. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg` |

# Alteração de Taxas em Lote

A API de Alteração de Taxas em Lote permite que o master realize a alteração das taxas entre ele e os seus sellers através de uma requisição. Atualmente, somente será possível informar o mesmo conjunto de taxas para todos os sellers.

> A alteração de taxas é feita pela [API de Onboarding Split 2.0](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#ambientes){:target="_blank"}.

## Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{split-onboarding-api}/api/agreements/batch</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{ 
    "MasterMerchantId": "2161acd0-3767-48d5-85c2-84d6dd412254", 
    "SubordinateIds": [ 
        "aab81d0c-88a8-43df-b15d-eee58d98a54e",
        "770d5796-25cf-4277-9a29-0b41cafd6d71",
        "4152723e-a693-458f-be78-6eacbaeb3966",
        "24654353-2035-4412-ae8f-4b7f31c65efb"
    ],
    "Aggrement": { 
        "InitialValidityDate": "2023-12-30", 
        "Fees": { 
            "Fee": 150
        }, 
        "MerchantDiscountRates": [ 
            { 
                "PaymentArrangement": { 
                    "Product": "CreditCard",
                     "Brand": "Visa"
                },
                "InitialInstallmentNumber": 9,
                "FinalInstallmentNumber": 12,
                "Percent": 1
             },
             { 
                "PaymentArrangement": {
                    "Product": "CreditCard",
                    "Brand": "Visa" 
                },
                "InitialInstallmentNumber": 1,    
                "FinalInstallmentNumber": 1,
                "Percent": 2
            },
            {
                "PaymentArrangement": {
                    "Product": "CreditCard", 
                    "Brand": "Visa"
                }, 
                "InitialInstallmentNumber": 7, 
                "FinalInstallmentNumber": 8, 
                "Percent": 3
            },
            {
                "PaymentArrangement": { 
                    "Product": "CreditCard", 
                    "Brand": "Master" 
                }, 
                "InitialInstallmentNumber": 2, 
                "FinalInstallmentNumber": 6, 
                "Percent": 6.00
            },
            {
                "PaymentArrangement": { 
                    "Product": "CreditCard",
                    "Brand": "Master"
                }, 
                "InitialInstallmentNumber": 9, 
                "FinalInstallmentNumber": 12, 
                "Percent": 7.00
            }
        ]
    }
} 
```

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO | 
|-|-|-|-|-| 
| `MasterMerchantId` | Guid | 36 | Sim | Identificação do master. | 
| `SubordinateIds` | Guid[] | - | Sim | Identificação dos sellers que terão o acordo alterado. | 
| `Aggrement.InitialValidityDate` | Data | 10 | Sim | Data de início da validade do acordo. Formato: yyyy-MM-dd | 
| `Aggrement.Fees.Fee` | Int | - | Sim | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = _"Fee" : 100_ | 
| `Aggrement.MerchantDiscountRates[].PaymentArrangement.Product` | String | - | Sim | Produto do arranjo de pagamento da taxa de desconto do seller. Os produtos válidos são _"CreditCard"_ e _"DebitCard"_ | 
| `Aggrement.MerchantDiscountRates[].PaymentArrangement.Brand` | String | - | Sim | Bandeira do arranjo de pagamento da taxa de desconto do seller. As bandeiras válidas são _Visa_, _Master_, _Amex_, _Elo_, _Diners_ e _Hipercard_ | 
| `Aggrement.MerchantDiscountRates[].InitialInstallmentNumber` | Int | - | Sim | Número inicial do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12** | 
| `Aggrement.MerchantDiscountRates[].FinalInstallmentNumber` | Int | - | Sim | Número final do intervalo de parcelas da taxa de desconto do seller. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12** | 
| `Aggrement.MerchantDiscountRates[].Percent` | Decimal | - | Sim | Porcentagem da taxa de desconto do seller. Valor com até duas casas decimais | 

## Resposta

```json
{    
    "initialValidityDate": "2024-06-02T00:00:00",     
    "fees": {         
        "fee": 150,     
    },     
    "merchantDiscountRates": [         
        {             
            "paymentArrangement": {
                 "product": "CreditCard",
                 "brand": "Visa"            
},
             "initialInstallmentNumber": 9,
             "finalInstallmentNumber": 12,
             "percent": 1
        },
         {
             "paymentArrangement": {
                 "product": "CreditCard",
                 "brand": "Visa"
            },

             "initialInstallmentNumber": 1,
             "finalInstallmentNumber": 1,
             "percent": 2
        },
         {
             "paymentArrangement": {
                 "product": "CreditCard",
                 "brand": "Visa"
            },
             "initialInstallmentNumber": 7,
             "finalInstallmentNumber": 8,
             "percent": 3
        },
         {
             "paymentArrangement": {
                 "product": "CreditCard",
                 "brand": "Master"
            },
             "initialInstallmentNumber": 2,
             "finalInstallmentNumber": 6,
             "percent": 6.00
        },
         {
             "paymentArrangement": {
                 "product": "CreditCard",
                 "brand": "Master"
            },
             "initialInstallmentNumber": 9,
             "finalInstallmentNumber": 12,
             "percent": 7.00
        }
    ]
} 
```

# Notificações do cadastro de sellers

Após o envio da requisição de cadastro de seller, a Braspag irá conduzir a análise de KYC e validação de domicílio bancário do seller. Ao final de cada análise, a Braspag enviará as seguintes notificações com o status de cada processo:

* Notificação de KYC;
* Notificação de validação de domicílio bancário;
* Notificação de onboarding.

> **IMPORTANTE**: **O seller estará apto a transacionar somente quando a notificação de onboarding retornar o status *Aprovado***.

Para receber as notificações de alteração de status, é necessário configurar o campo "URL de Notificação" durante o cadastro do master na Braspag para receber uma requisição do tipo "POST". O endereço deve ser HTTPS e não se deve utilizar uma porta fora do padrão HTTPS (443).

> É esperado que a loja retorne a seguinte resposta: `HTTP Status Code 200 OK`. Caso essa resposta não seja retornada, haverá mais duas tentativas de envio da notificação.

**Os prazos estimados para cada notificação são**:

* **Notificação de KYC**: alguns minutos a 15 dias;
* **Notificação de validação de domicílio bancário**: dois dias úteis;
* **Notificação de onboarding**: será enviada duas vezes, uma após a notificação de KYC e outra após a notificação de validação de domicílio bancário (na ordem que ocorrerem primeiro).

## Notificação de KYC

Quando houver alteração no status da análise de KYC, a Braspag enviará uma notificação com os parâmetros do tipo de notificação, identificação do master e do seller e status da análise de KYC.

**Exemplo de notificação enviada pela Braspag:**

```json
{
    "ChangeType": 20,
    "MasterMerchantId": "96ffb8be-6693-4f9b-bf8e-925b555b3207",
    "Data": {
        "SubordinateMerchantId": "4d76b525-e66d-402e-a318-5fd3ce1af7aa",
        "Status": 2
    }
}
```

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|
| `ChangeType` | Número | - | Identificador do tipo de notificação. **Para a notificação de KYC, o `ChangeType` é igual a "20"**.|
| `MasterMerchantId` | GUID | 36 | Identificação do master. |
| `Data.SubordinateMerchantId` | GUID | 36 | Identificação do seller. |
| `Data.Status` | Número | - | Status da análise do processo de KYC. Os status válidos são:<br>UnderAnalysis = 1;<br>Approved = 2;<br>ApprovedWithRestriction = 3 e<br>Rejected = 4|

<aside class="notice">Caso você tenha configurado headers personalizados durante o cadastro da sua URL de notificação na Braspag, a notificação também retornará os headers personalizados.</aside>

<aside class="warning">Se a análise de KYC retornar o status "Rejected", entre em contato com o Suporte para verificar se é possível realizar uma nova análise.</aside>

## Notificação de validação de domicílio bancário

Quando houver alteração no status da validação de domicílio bancário, a Braspag enviará uma notificação com os parâmetros do tipo de notificação, identificação do seller(MerchantId) e os dados do domicílio bancário.

**Exemplo de notificação de domicílio bancário enviada pela Braspag**:

```json
{
 "ChangeType": 21,
 "MasterMerchantId": "96ffb8be-6693-4f9b-bf8e-925b555b3207",
 "Data": {
    "MerchantId": "4d76b525-e66d-402e-a318-5fd3ce1af7aa",
    "MerchantType": "Subordinate",
    "Status": 3,
    "AccountNumber": "123",
    "AccountDigit": "1",
    "AgencyNumber": "3581",
    "AgencyDigit": "x",
    "CompeCode": "260",
    "BankAccountType": 1,
    "DocumentNumber": "45224563215",
    "DocumentType": 2
 }
}
```

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|
| `ChangeType` | Número | - | Número identificador do tipo de notificação. **Para a notificação de validação de domicílio bancário, o ChangeType é igual a “21”**. |
| `MasterMerchantId` | GUID| 36| Identificação do master. |
| `Data.MerchantId` | GUID| 36| Identificação do seller. |
| `Data.MerchantType` | Texto | 14 | Tipo do Merchant. Os tipos válidos são “Subordinate” ou “Master”.  |
| `Data.BankAccountValidationStatus` | Número| 1 | Status da análise do processo de domicílio bancário. Os status válidos são:<br>InternalError = 0;<br>Created = 1;<br>Processing =2;<br>Success= 3;<br>Error= 4;|
| `Data.CompeCode` | Texto| 3 | Código de compensação do banco. Ver [Lista de Códigos de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o).|
| `Data.BankAccountType` | Texto| 1 | Tipo de conta bancária. Os tipos válidos são:<br> 1 - “CheckingAccount” (conta corrente);<br>2 - “SavingsAccount” (conta poupança). |
| `Data.AccountNumber` | Texto| 10|Número da conta do seller. |
| `Data.AccountDigit` | Texto|1| Dígito verificador da conta do seller.|
| `Data.AgencyNumber` | Texto| 15 | Número da agência do seller. Atenção: Valores zerados como “0”, “00”, “000” são inválidos.|
| `Data.AgencyDigit` | Texto| 1| Dígito da agência do seller. Caso a agência não tenha dígito, informar o valor “x”.|
| `Data.DocumentNumber` | Texto| 14| Número do documento da conta (apenas números) do seller.|
| `Data.DocumentType` | Texto| -| Tipo do documento. Os tipos válidos são “CPF” ou “CNPJ”.|

## Notificação de onboarding

A notificação do status do onboarding sinaliza o status global do cadastro do seller e é enviada após cada uma das notificações anteriores. Atualmente, esse status é composto pela junção de duas validações (KYC e domicílio bancário). Assim, após a primeira notificação, o status de onboarding irá informar que o processo ainda está em análise; após a segunda notificação é que irá retornar o status "2" (considerando o cenário de aprovação em todas as análises).

A Braspag enviará uma notificação com os parâmetros do tipo de notificação, identificação do seller (`SubordinateMerchantId`) e as informações de todos os status. 

> * Quando o status de onboarding (`Data.OnboardingStatus`) apresentar o valor "2" significa que o seller já passou em todas as validações e está apto a transacionar;<br>
> * Quando o status de onboarding apresentar o valor "3", significa que o cadastro não foi bem sucedido em pelo menos uma validação e que o master precisa tomar alguma ação em relação a esse cadastro.

Confira todos os valores possíveis para o status de onboarding na tabela abaixo.

**Exemplo de notificação de onboarding enviada pela Braspag:**

```json
{
    "ChangeType": 23,
    "MasterMerchantId": "96ffb8be-6693-4f9b-bf8e-925b555b3207",
    "Data": {
        "SubordinateMerchantId":"4d76b525-e66d-402e-a318-5fd3ce1af7aa",
        "OnboardingStatus": 2,
        "KycAnalysisInfo": {
            "Status": 2
        },
        "BankAccountValidation": {
            "Status": 3
        }
    }
}
```

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|---|---|---|---|
| `ChangeType` | Número | - | Identificador do tipo de notificação. **Para a notificação do status do Onboarding, o ChangeType é igual a “23”**. |
| `MasterMerchantId` | GUID| 36| Identificação do master. |
| `Data.SubordinateMerchantId` | GUID| 36| Identificação do seller. |
| `Data.OnboardingStatus` | Número| 1| Status do processo de Onboarding. Os status válidos são:<br>UnderAnalysis = 1;<br>Approved = 2;<br>AwaitingMerchantAction = 3;<br>Unknown = 4;<br>Banned = 5|
| `Data.KycAnalysisInfo.Status` | Número| 1| Status da análise de KYC. Os status válidos são:<br>UnderAnalysis = 1;<br>Approved = 2;<br>ApprovedWithRestriction = 3;<br>Rejected = 4|
| `Data.BankAccountValidation.Status` | Número| 1| Status da análise do domicílio bancário. Os status válidos são:<br>InternalError = 0;<br>Created = 1;<br>Processing = 2;<br>Success = 3;<br>Error = 4|

# Criação de usuário para o seller

Caso ache necessário, o master pode permitir o acesso do seller ao backoffice do Split. Para isso, o master precisa enviar para o [suporte](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}:

* O `MerchantId` do seller;
* O e-mail do seller e
* O nome de usuário do seller.

# ANEXOS

## Lista de status do KYC

| Status | Nome do Status | Descrição |
|---|---|---|
| 1 | UnderAnalysis | Análise de KYC em andamento. | 
| 2 | Approved | Seller aprovado na análise de KYC. |
| 3 | ApprovedWithRestriction | Seller aprovado com restrições na análise de KYC. |
| 4 | Rejected | Seller não aprovado na análise de KYC. |

## Lista de Ramos de Atividades

| Código | Descrição |
|---|---|
| 1 | NÃO ENCONTRADO |
| 2 | SALÃO DE BELEZA BARBEARIA |
| 3 | DENTISTAS E ORTODONDISTAS |
| 4 | LANCHONETE |
| 5 | VENDAS DE ROUPAS |
| 6 | TAXI E LIMUSINE |
| 7 | MERCEARIAS E SUPERMERCADOS |
| 8 | LOJAS DE VARIEDADES |
| 9 | BARES DISCOTECAS CASAS NOTURNAS |
| 10 | EMPREITEIROS EM GERAL |
| 11 | COSMÉTICOS |
| 12 | CONVENIÊNCIA DELICATESSE |
| 13 | MEDICOS E CLINICAS |
| 14 | SERVIÇOS VETERINÁRIOS |
| 15 | LOJAS DE REPAROS E SERVIÇOS |
| 16 | COMIDA RÁPIDA (DOCES E SALGADOS) |
| 17 | DIVERSÃO E RECREAÇÃO |
| 18 | CRECHES |
| 19 | ALFAIATES / COSTUREIRAS (OS) |
| 20 | CLÍNICAS DE BELEZA - SPA |
| 21 | SERVIÇOS LEGAIS |
| 22 | FABRICAÇÃO DE MÁQUINAS, FERRAMENTAS, PEÇAS E ACESSÓRIOS |
| 23 | LOJAS DE UTENSILIOS |
| 24 | RESTAURANTES |
| 25 | PEÇAS E SERVIÇOS PARA VEICULOS |
| 26 | CORRETOR IMOBILIÁRIO |
| 27 | FORNECEDORES DE ALIMENTOS OU MANTIMENTOS |
| 28 | CONSERTO - RÁDIO,TV,APARELHO DE SOM |
| 29 | PRESENTES,CARTÕES,SOUVENIRS |
| 30 | LOJAS DE ACESSÓRIOS PARA VEICULOS |
| 31 | SERVIÇOS DE HORTICULTURA E JARDINAGEM |
| 32 | LOJAS DE MATERIAL DE CONSTRUÇÃO |
| 33 | LOJAS DE SAPATOS |
| 34 | JOALHERIAS E RELOJOARIAS |
| 35 | ATACADISTA |
| 36 | SERVIÇOS EDUCACIONAIS |
| 37 | PADARIAS |
| 38 | LOJAS DE BEBIDAS |
| 39 | EQUIPAMENTOS E PECAS ELETRÔNICAS |
| 40 | CONSERTOS ELÉTRICOS |
| 41 | BORRACHEIRO |
| 42 | DROGARIAS FARMÁCIAS |
| 43 | SERVIÇOS DE CARPINTARIA |
| 44 | LOJA DE ANIMAIS |
| 45 | CAMPO DE ESPORTES CLUBES |
| 46 | ESTUDIO FOTOGRÁFICO |
| 47 | ELETRICISTA |
| 48 | TRANSPORTES URBANOS |
| 49 | LABORATORIOS MEDICOS DENTARIOS |
| 50 | DOCERIAS E CONFEITARIAS |
| 51 | LAVA RAPIDO |
| 52 | MOBILIA E UTILIDADES PARA O LAR |
| 53 | LATICÍNIOS |
| 54 | DANÇA ACADEMIAS |
| 55 | SERVIÇOS DE MANUTENÇÃO E CONSERVAÇÃO |
| 56 | BRINQUEDOS E JOGOS |
| 57 | HOTEIS MOTEIS |
| 58 | SERVIÇOS DE ADMINISTRAÇÃO E CONSULTORIA |
| 59 | SERVIÇOS DE PESQUISA PARA ARQUITETURA E ENGENHARIA |
| 60 | BANCA DE JORNAIS |
| 61 | PEDICURE |
| 62 | LOJAS DE DEPARTAMENTO |
| 63 | FLORICULTURA |
| 64 | CONSERTO E MANUTENÇÃO DE COMPUTADORES |
| 65 | MATERIAIS DE CONSTRUÇÃO |
| 66 | OTICAS |
| 67 | SERVIÇOS ESCOLARES |
| 68 | CASAS DE MASSAGEM |
| 69 | FUNILARIA LANTERNAGEM |
| 70 | ARMARINHOS TECIDOS |
| 71 | REPARO E RESTAURAÇÃO DE MOVEIS |
| 72 | CENTROS DE SERVIÇOS E OFICINAS DE METAL |
| 73 | CONSERTO - JOIAS E RELÓGIOS |
| 74 | ARTIGOS DE SEGUNDA MÃO |
| 75 | SERVIÇOS DE PROCESSAMENTOS DE DADOS |
| 76 | CONSERTO DE CHAPEUS SAPATOS |
| 77 | LIVROS,PERIÓDICOS E JORNAIS |
| 78 | COPIAS FOTOCÓPIAS |
| 79 | ALUGUEL DE ROUPAS |
| 80 | LOJAS DE FERRAGENS |
| 81 | MATERIAIS DE ESCRITÓRIO |
| 82 | CASAS DE REPOUSO SERVIÇOS DE ENFERMAGEM |
| 83 | MATERIAL ESPORTIVOS |
| 84 | CLUBES ATLETISMO - SÓCIOS |
| 85 | BICICLETAS - VENDAS E SERVIÇOS |
| 86 | ESTACIONAMENTO DE AUTOMOVEIS |
| 87 | ESCOLA VOCAÇÃO E OCUPAÇÃO |
| 88 | LOJAS DE INFORMÁTICA - SOFTWARE |
| 89 | PAPELARIAS |
| 90 | ANUNCIOS CLASSIFICADOS PROPAGANDA |
| 91 | TAPECARIA CORTINAS |
| 92 | REDE DE COMPUTADORES PROVEDORES |
| 93 | ALUGUEL DE EQUIPAMENTOS E MOBILIAS |
| 94 | ORGANIZAÇÃO RELIGIOSA |
| 95 | CORRETOR DE SEGUROS |
| 96 | SERVIÇOS DE AUDITORIA E CONTABILIDADE |
| 97 | GALERIAS DE ARTE LEILÃO DE ARTE |
| 98 | SAPATARIA |
| 99 | TV A CABO,SATELITE,E OUTROS TIPOS DE TV |
| 100 | SERVIÇO DE FRETE |

## Lista de Códigos de Compensação

|Código de Compensação|Banco|
|---|---|
|001|Banco do Brasil|
|003|Amazônia - BASA|
|004|BNB|
|021|Est. ES - Banestes|
|025|Alfa|
|033|Santander|
|041|Est. RS - Banrisul|
|047|Est. SE - Banese|
|069|Banco Crefisa|
|070|BRB - Banco de Brasília|
|077|Banco Inter|
|084|CC Uniprime Norte do Paraná|
|085|CC Cecred|
|094|Banco Finaxis|
|097|CC Centralcredi|
|099|CC Uniprime Central|
|104|Caixa Econômica Federal|
|107|BBM|
|133|CRESOL CONFEDERAÇÃO|
|136|CC Unicred do Brasil|
|197|STONE PAGAMENTOS S.A|
|212|Banco Original|
|218|Banco BS2|
|237|Bradesco|
|246|ABC - Brasil|
|260|NU PAGAMENTOS S.A (NUBANK)|
|301|Bpp Instituição De Pagamentos S.A|
|318|BCO BMG S.A.|
|323|Mercado Pago|
|336|Banco C6 S.A|
|341|Itaú Unibanco|
|376|J. P. Morgan|
|389|Mercantil do Brasil|
|422|Safra|
|600|Luso Brasileiro|
|604|Indl. do Brasil|
|623|BANCO PAN|
|637|Sofisa|
|654|Banco Digimais|
|655|Votorantim|
|743|Semear|
|745|Citibank S. A.|
|748|Sicredi|
|755|Bank of America Merrill Lynch|
|756|Bancoob - Banco Cooperativo do Brasil (Sicoob)|
|757|BCO KEB HANA DO BRASIL S.A.|
