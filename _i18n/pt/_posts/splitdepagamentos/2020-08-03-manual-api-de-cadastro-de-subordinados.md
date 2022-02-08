---
layout: manual
title: Split de Pagamentos - Cadastro de Subordinados
description: Split de Pagamentos - Onboarding
search: true
toc_footers: false
categories: manual
sort_order: 3
hub_visible: false
tags:
  - 6. Soluções para Marketplace
---

# Introdução

O **Split de Pagamentos** fornece uma **API de onboarding** para possibilitar ao master o gerenciamento de seus subordinados na plataforma. O master deverá coletar as informações do subordinado para usar no processo de onboarding.

> O cadastro de subordinados também pode ser feito pelo backoffice Split. [Saiba mais neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360055405011-Cadastro-de-subordinados-do-Split-via-Backoffice).

Assim como o master, os subordinados também irão passar pelo processo de KYC (Know Your Customer) do Split de Pagamentos, com objetivo de identificar o cliente (subordinado). Por este motivo, alguns documentos do subordinado serão necessários.

O processo de KYC é uma medida obrigatória exigida pelas instituições reguladoras de pagamento.

O onboarding do subordinado no Split de Pagamentos ocorre da seguinte forma:

1. O master solicita o cadastro do subordinado;
2. O subordinado será criado com status "Em análise" e estará bloqueado para participar da transação, até que o processo de KYC seja finalizado;
3. Ao final da análise, o master será notificado com o resultado do processo de KYC, juntamente com a identificação do subordinado.

# Ambientes

## Sandbox

**API Onboarding**: https://splitonboardingsandbox.braspag.com.br

## Produção

**API Onboarding**: https://splitonboarding.braspag.com.br

# Cadastro de Subordinados

A solicitação de cadastro deve ser realizada através de uma requisição pelo **master** informando os dados do subordinado.

Para a definição de acordos entre o master e seus subordinados, o **Split de Pagamentos** dispõe de duas possibilidades:

1. É possível definir a porcentagem do MDR (Merchant Discount Rate) cobrado por transação por Arranjos de Pagamento e intervalo de parcelas.
2. Caso o master não queira definir a porcentagem do MDR para cada Arranjo de Pagamento e intervalo de parcelas, o **Split de Pagamentos** irá replicar os mesmos acordos do master com a Subadquirente (Braspag), para o master com o Subordinado. Dessa forma, o master deverá informar apenas um MDR único, que será aplicado para todos os acordos.

**Exemplo:**

**MDR do master com subordinado igual a 4%**

| ACORDO SUBADQUIRENTE e MASTER | Visa  | Master | Elo   | Diners  | Amex  | Hiper  |
|-------------------------------|----------------------------------------------------|
| Débito                        | 2.00% | 2.00%  | 2.00% |    -    |   -   |    -    |  
| Crédito a Vista               | 2.50% | 2.50%  | 2.50% | 2.50%   | 2.50% |  2.50%  |
| Crédito 2x a 6x               | 3.00% | 3.00%  | 3.00% | 3.00%   | 3.00% |  3.00%  |
| Crédito 7x a 12x              | 3.50% | 3.50%  | 3.50% | 3.50%   | 3.50% |  3.50%  |

| ACORDO MASTER e SUBORDINADO  | Visa  | Master | Elo   | Diners  | Amex   | Hiper  |
|------------------------------|----------------------------------------------------|
| Débito                       | 4.00% | 4.00%  | 4.00% |    -    |   -    |    -   |  
| Crédito a Vista              | 4.00% | 4.00%  | 4.00% | 4.00%   | 4.00%  |  4.00% |
| Crédito 2x a 6x              | 4.00% | 4.00%  | 4.00% | 4.00%   | 4.00%  |  4.00% |
| Crédito 7x a 12x             | 4.00% | 4.00%  | 4.00% | 4.00%   | 4.00%  |  4.00% |

## Informando a porcentagem do MDR por Arranjos de Pagamento e intervalo de parcelas

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/subordinates</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Subordinado",
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
| `CorporateName`                                                 | String  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento (Apenas números)                                                                                                                                                                                                 |     
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                             |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta (Apenas números)                                                                                                                                                                                        |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP (Apenas números)                                                                                                                                                                                                                 |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners`, `Discover` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                 |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado. Valor com até duas casas decimais                                                                                                                                                    |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Não         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Não         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Não         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |
| `Attachments[].File.Data`                                       | String  | -       | Não         | Documento convertido para **Base64**                                                                                                                                                                                                 |

### Resposta

```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Subordinado",
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
| `MasterMerchantId`                                              | Guid    | 36      | Sim         | Identificação do master do subordinado                                                                                                                                                                                               |
| `MerchantId`                                                    | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                                                                                                         |
| `CorporateName`                                                 | String  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                            |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta                                                                                                                                                                                                         |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP                                                                                                                                                                                                                                  |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | Guid    | 36      | Sim         | Identificação da taxa de desconto do subordinado                                                                                                                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners`, `Discover` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                 |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado. Valor com até duas casas decimais                                                                                                                                                    |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Não         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Não         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Não         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

## Informando a porcentagem do MDR único aplicado para todos os acordos

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/subordinates</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Subordinado",
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
| `CorporateName`                                                 | String  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento (Apenas números)                                                                                                                                                                                                 |     
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                             |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta (Apenas números)                                                                                                                                                                                        |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP (Apenas números)                                                                                                                                                                                                                 |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MdrPercentage`                                       | Decimal | -       | Sim         | Porcentagem da taxa de desconto única que será aplicada para todos os acordos entre Master e Subordinado. Valor com até duas casas decimais                                                                                        |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Não         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Não         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Não         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |
| `Attachments[].File.Data`                                       | String  | -       | Não         | Documento convertido para **Base64**                                                                                                                                                                                                 |

### Resposta

```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Subordinado",
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
| `MasterMerchantId`                                              | Guid    | 36      | Sim         | Identificação do master do subordinado                                                                                                                                                                                               |
| `MerchantId`                                                    | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                                                                                                         |
| `CorporateName`                                                 | String  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `BirthdayDate`                                                  | Data    | 10      | Sim*<br>* *Obrigatório apenas caso `DocumentType` seja `Cpf`*|Data de nascimento (apenas para cadastro de pessoa física - CPF). Formato: yyyy-MM-dd                                                                                               |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                             |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta                                                                                                                                                                                                         |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP                                                                                                                                                                                                                                  |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | Guid    | 36      | Sim         | Identificação da taxa de desconto do subordinado                                                                                                                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners`, `Discover` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                 |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado. Valor com até duas casas decimais                                                                                                                                                    |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Não         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Não         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Não         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

# Consulta de Subordinados

A API de onboarding do Split de Pagamentos permite a consulta de um subordinado específico através do `MerchantId` do subordinado.

<aside class="request"><span class="method post">GET</span> <span class="endpoint">{split-onboarding-api}/api/subordinates/{subordinate-merchant-id}</span></aside>

## Resposta

```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"96462142000140",
    "DocumentType":"CNPJ",
    "MerchantCategoryCode":"5719",
    "ContactName":"Nome do Contato do Subordinado",
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

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MasterMerchantId`                                              | Guid    | 36      | Sim         | Identificação do master do subordinado                                                                                                                                                                                               |
| `MerchantId`                                                    | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                                                                                                         |
| `CorporateName`                                                 | String  | 100     | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços.|
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `Analysis.Score`                                                | Int     | -       | Não         | Score da análise do processo de KYC. Range de 1 a 100                                                                                                                                                                                |
| `Analysis.DenialReason`                                         | String  | -       | Não         | Motivo de reprovação do subordinado                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 10      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o valor x                                                                                                                                                             |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta                                                                                                                                                                                                         |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP                                                                                                                                                                                                                                  |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação. Valor em centavos. Ex: R$ 1,00 = `"Fee" : 100`                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | Guid    | 36      | Sim         | Identificação da taxa de desconto do subordinado                                                                                                                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners`, `Discover` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                 |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado. O número de parcelas deverá ser **maior do que 0 e menor ou igual a 12**                                                                                   |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado. Valor com até duas casas decimais                                                                                                                                                    |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Não         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Não         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Não         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

# Notificação

Ao final do processo de KYC, o master receberá a notificação com o resultado da análise.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{url-notificacao-master}</span></aside>

```json
{
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "Status": "Approved",
    "Score", 89,
    "DenialReason": null
}
```

| Propriedade                 | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MerchantId`                | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                                                                                                         |
| `Analysis.Status`           | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `Analysis.Score`            | Int     | -       | Não         | Score da análise do processo de KYC. Range de 1 a 100                                                                                                                                                                                |
| `Analysis.DenialReason`     | String  | -       | Não         | Motivo de reprovação do subordinado                |

**Criação de usuário para o subordinado**

Caso ache necessário, o master pode permitir o acesso do subordinado ao backoffice do Split. Para isso, o master precisa enviar para o [suporte Braspag](https://suporte.braspag.com.br/hc/pt-br):

* O MerchantId do subordinado;
* O e-mail do subordinado e
* O nome de usuário do subordinado.

# ANEXO

## Lista de Códigos de Compensação

|Código de Compensação	|Banco|
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
|756|Bancoob - Banco Cooperativo do Brasil|
|757|BCO KEB HANA DO BRASIL S.A.|
