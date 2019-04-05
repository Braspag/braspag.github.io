---
layout: manual
title: Split de Pagamentos - Onboarding
description: Split de Pagamentos - Onboarding
search: true
toc_footers: false
categories: manual
sort_order: 3
hub_visible: false
tags:
---

# Split de Pagamentos - Onboarding

## Introdução

O **Split de Pagamentos** fornece uma API de Onboarding para possibilitar ao Master o gerenciamento de seus subordinados na plataforma.
O Master deverá coletar as informações do subordinado, para utilizar no processo de Onboarding.

Assim como o Master, os subordinados também irão passar pelo processo de KYC (Know Your Customer) do Split de Pagamentos, com objetivo de indentificar o cliente (subordinado). Por este motivo, alguns documentos do subordinado serão necessários.

O processo de KYC é uma medida obrigatória exigida pelas instituições de reguladoras de pagamento.

O Onboarding do subordinado no Split de Pagamentos ocorre da seguinte forma:

1. O Master solicita o cadastro do subordinado.
2. O subordinado será criado com status "Em análise" e estará bloqueado para participar transação, até que o processo de KYC seja finalizado.
3. Ao final da análise, o Master será notificado com o resultado do processo de KYC, jutamento com a identificação do subordinado.

## Ambientes

**API Onboarding**: https://splitonboarding.braspag.com.br

## Cadastro de Subordinados

A solicitação de cadastro deve ser realizada através de uma requisição pelo **Master** informando os dados do subordinado.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/v2/masters/{master-merchant-id}/subordinates</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"01131432000190",
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
        "DocumentNumber":"01131432000190",
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
        "MerchantDiscountRates":[{
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
            "Name": "comprovante_bancario",
            "FileType": "jpg",
            "Data": "ZWZxZWZxd2VmcXdlZnF3ZWZxd2VmcXdlZnF3ZWZxd2VmcXdlZnF3ZWZxdzM0ZndlZndlcXdlZnF3ZWZxd2VmcXdlZnF3ZWZ3cQ=="
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento (Sem formatação)                                                                                                                                                                                                 |     
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://oauth.net/2/){:target="_blank"}   |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Sem formatação)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco                                                                                                                                                                                                       |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingAccount` (Conta poupança)                                                                                                                   |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência                                                                                                                                                                                                                    |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta (Sem formatação)                                                                                                                                                                                        |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP (Sem formatação)                                                                                                                                                                                                                 |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação                                                                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners`, `Discover` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado                                                                                                                                                           |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado                                                                                                                                                             |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado                                                                                                                                                                                       |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Sim         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Sim         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Sim         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |
| `Attachments[].File.Data`                                       | String  | -       | Sim         | Documento convertido para **Base64**                                                                                                                                                                                                 |

**Response**

```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"01131432000190",
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
        "DocumentNumber":"01131432000190",
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
        "MerchantDiscountRates":[{
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
            "Name": "comprovante_bancario",
            "FileType": "jpg"
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MasterMerchantId`                                              | Guid    | 36      | Sim         | Identificação do master do subordinado                                                                                                                                                                                               |
| `MerchantId`                                                    | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                                                                                                         |
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://oauth.net/2/){:target="_blank"}   |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Sem formatação)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Reject`                                                                                                                         |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco                                                                                                                                                                                                       |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingAccount` (Conta poupança)                                                                                                                   |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência                                                                                                                                                                                                                    |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta                                                                                                                                                                                                         |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP                                                                                                                                                                                                                                  |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação                                                                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | Guid    | 36      | Sim         | Identificação da taxa de desconto do subordinado                                                                                                                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners`, `Discover` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado                                                                                                                                                           |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado                                                                                                                                                             |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado                                                                                                                                                                                       |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Sim         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Sim         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Sim         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

## Consulta de Subordinados

A API de Onboarding do Split de Pagamentos permite a consulta de um subordinado específico através de sua identificação.

<aside class="request"><span class="method post">GET</span> <span class="endpoint">{split-onboarding-api}/api/masters/{master-merchant-id}/subordinates/{subordinate-merchant-id}</span></aside>

**Response**

```json
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
    "CorporateName":"Subordinado Corporativo Ltda",
    "FancyName":"Subordinado Nome Fantasia",
    "DocumentNumber":"01131432000190",
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
        "DocumentNumber":"01131432000190",
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
        "MerchantDiscountRates":[{
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
            "Name": "comprovante_bancario",
            "FileType": "jpg"
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MasterMerchantId`                                              | Guid    | 36      | Sim         | Identificação do master do subordinado                                                                                                                                                                                               |
| `MerchantId`                                                    | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                                                                                                         |
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://oauth.net/2/){:target="_blank"}   |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Sem formatação)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Reject`                                                                                                                         |
| `Analysis.Score`                                                | Int     | -       | Não         | Score da análise do processo de KYC                                                                                                                                                                                                  |
| `Analysis.DenialReason`                                         | String  | -       | Não         | Motivo de reprovação do subordinado                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco                                                                                                                                                                                                       |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingAccount` (Conta poupança)                                                                                                                   |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência                                                                                                                                                                                                                    |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta                                                                                                                                                                                                         |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                | 
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                                                                                                      |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                                                                                                   |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                                                                                              |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                                                                                               |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                                                                                               |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                                                                                                      |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP                                                                                                                                                                                                                                  |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação                                                                                                                                                                                                              |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | Guid    | 36      | Sim         | Identificação da taxa de desconto do subordinado                                                                                                                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado. Os produtos válidos são `CreditCard` e `DebitCard`                                                                                                               |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado. As bandeiras válidas são `Visa`, `Master`, `Amex`, `Elo`, `Diners`, `Discover` e `Hipercard`                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado                                                                                                                                                           |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado                                                                                                                                                             |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado                                                                                                                                                                                       |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                                                                                                |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                                                                                                  |
| `Attachments[].AttachmentType`                                  | String  | -       | Sim         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Sim         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Sim         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

## Notificação

Ao final do processo de KYC, o Master receberá a notificação com o resultado da análise. Será feito uma requisição com os cabeçalhos na URL de notificação informados na criação do subordinado.

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
| `Analysis.Status`           | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Reject`                                                                                                                         |
| `Analysis.Score`            | Int     | -       | Não         | Score da análise do processo de KYC                                                                                                                                                                                                  |
| `Analysis.DenialReason`     | String  | -       | Não         | Motivo de reprovação do subordinado                                                                                                                                                                                                  |