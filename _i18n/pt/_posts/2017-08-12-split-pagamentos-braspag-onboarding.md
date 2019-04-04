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

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                              |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MasterMerchantId`                                              | Guid    | 36      | Sim         | Identificação do master do subordinado                                                                                                                 |
| `MerchantId`                                                    | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                           |
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                           |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                          |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                    |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento                                                                                                                                      |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                            |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Sem formatação)                                                                                             |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                     |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                    |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                         |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC                                                                                                                   |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco                                                                                                                         |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo da conta                                                                                                                                          |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                        |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                      |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                            |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                      |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência                                                                                                                                      |
| `BankAccount.DocumentNumber`                                    | String  | 14      | Sim         | Número do documento da conta                                                                                                                           |
| `BankAccount.DocumentType`                                      | String  | -       | Sim         | Tipo do documento da conta                                                                                                                             |
| `Address.Street`                                                | String  | 100     | Sim         | Rua do endereço                                                                                                                                        |
| `Address.Number`                                                | String  | 15      | Sim         | Número do endereço                                                                                                                                     |
| `Address.Complement`                                            | String  | 80      | Não         | Complemento do endereço                                                                                                                                |
| `Address.Neighborhood`                                          | String  | 50      | Sim         | Bairro                                                                                                                                                 |
| `Address.City`                                                  | String  | 50      | Sim         | Cidade                                                                                                                                                 |
| `Address.State`                                                 | String  | 2       | Sim         | Sigla do estado                                                                                                                                        |
| `Address.ZipCode`                                               | String  | 9       | Sim         | CEP                                                                                                                                                    |
| `Agreement.Fee`                                                 | Int     | -       | Sim         | Taxa fixa por transação                                                                                                                                |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | Guid    | 36      | Sim         | Identificação da taxa de desconto do subordinado                                                                                                       |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | String  | -       | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | String  | -       | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado                                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Int     | -       | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado                                                                             |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Int     | -       | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado                                                                               |
| `Agreement.MerchantDiscountRates[].Percent`                     | Decimal | -       | Sim         | Porcentagem da taxa de desconto do subordinado                                                                                                         |
| `Notification.Url`                                              | String  | 200     | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                  |
| `Notification.Headers[].Key`                                    | String  | 100     | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                    |
| `Notification.Headers[].Value`                                  | String  | 100     | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                    |
| `Attachments[].AttachmentType`                                  | String  | -       | Sim         | Tipo do documento em anexo do subordinado                                                                                                              |
| `Attachments[].File.Name`                                       | String  | 50      | Sim         | Nome do arquivo do documento em anexo do subordinado                                                                                                   |
| `Attachments[].File.FileType`                                   | String  | -       | Sim         | Tipo do arquivo do documento em anexo do subordinado                                                                                                   |
| `Attachments[].File.Data`                                       | String  | -       | Sim         | Documento convertido para **Base64**                                                                                                                   |

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

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                              |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MasterMerchantId`                                              | Guid    | 36      | Sim         | Identificação do master do subordinado                                                                                                                 |
| `MerchantId`                                                    | Guid    | 36      | Sim         | Identificação do subordinado                                                                                                                           |
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                           |
| `FancyName`                                                     | Guid    | 36      | Sim         | Nome fantasia                                                                                                                                          |
| `DocumentNumber`                                                | Guid    | 36      | Sim         | Número do documento                                                                                                                                    |
| `DocumentType`                                                  | Guid    | 36      | Sim         | Tipo do documento                                                                                                                                      |
| `MerchantCategoryCode`                                          | Guid    | 36      | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços |
| `ContactName`                                                   | Guid    | 36      | Sim         | Nome do contato responsável                                                                                                                            |
| `ContactPhone`                                                  | Guid    | 36      | Sim         | Número do telefone do contato responsável                                                                                                              |
| `MailAddress`                                                   | Guid    | 36      | Sim         | Endereço de e-mail                                                                                                                                     |
| `Website`                                                       | Guid    | 36      | Sim         | Endereço do website                                                                                                                                    |
| `Blocked`                                                       | Guid    | 36      | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                         |
| `Analysis.Status`                                               | Guid    | 36      | Sim         | Status da análise do processo de KYC                                                                                                                   |
| `BankAccount.Bank`                                              | Guid    | 36      | Sim         | Código de compensação do banco                                                                                                                         |
| `BankAccount.BankAccountType`                                   | Guid    | 36      | Sim         | Tipo da conta                                                                                                                                          |
| `BankAccount.Number`                                            | Guid    | 36      | Sim         | Número da conta                                                                                                                                        |
| `BankAccount.Operation`                                         | Guid    | 36      | Sim         | Operação da conta                                                                                                                                      |
| `BankAccount.VerifierDigit`                                     | Guid    | 36      | Sim         | Dígito verificador da conta                                                                                                                            |
| `BankAccount.AgencyNumber`                                      | Guid    | 36      | Sim         | Número da agência                                                                                                                                      |
| `BankAccount.AgencyDigit`                                       | Guid    | 36      | Sim         | Dígito da agência                                                                                                                                      |
| `BankAccount.DocumentNumber`                                    | Guid    | 36      | Sim         | Número do documento da conta                                                                                                                           |
| `BankAccount.DocumentType`                                      | Guid    | 36      | Sim         | Tipo do documento da conta                                                                                                                             |
| `Address.Street`                                                | Guid    | 36      | Sim         | Rua do endereço                                                                                                                                        |
| `Address.Number`                                                | Guid    | 36      | Sim         | Número do endereço                                                                                                                                     |
| `Address.Complement`                                            | Guid    | 36      | Sim         | Complemento do endereço                                                                                                                                |
| `Address.Neighborhood`                                          | Guid    | 36      | Sim         | Bairro                                                                                                                                                 |
| `Address.City`                                                  | Guid    | 36      | Sim         | Cidade                                                                                                                                                 |
| `Address.State`                                                 | Guid    | 36      | Sim         | Sigla do estado                                                                                                                                        |
| `Address.ZipCode`                                               | Guid    | 36      | Sim         | CEP                                                                                                                                                    |
| `Agreement.Fee`                                                 | Guid    | 36      | Sim         | Taxa fixa por transação                                                                                                                                |
| `Agreement.MerchantDiscountRates[].MerchantDiscountRateId`      | Guid    | 36      | Sim         | Identificação da taxa de desconto do subordinado                                                                                                       |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Product`  | Guid    | 36      | Sim         | Produto do arranjo de pagamento da taxa de desconto do subordinado                                                                                     |
| `Agreement.MerchantDiscountRates[].PaymentArrangement.Brand`    | Guid    | 36      | Sim         | Bandeira do arranjo de pagamento da taxa de desconto do subordinado                                                                                    |
| `Agreement.MerchantDiscountRates[].InitialInstallmentNumber`    | Guid    | 36      | Sim         | Número inicial do intervalo de parcelas da taxa de desconto do subordinado                                                                             |
| `Agreement.MerchantDiscountRates[].FinalInstallmentNumber`      | Guid    | 36      | Sim         | Número final do intervalo de parcelas da taxa de desconto do subordinado                                                                               |
| `Agreement.MerchantDiscountRates[].Percent`                     | Guid    | 36      | Sim         | Porcentagem da taxa de desconto do subordinado                                                                                                         |
| `Notification.Url`                                              | Guid    | 36      | Sim         | Url de notificação de mudança de status da análise do processo de KYC                                                                                  |
| `Notification.Headers[].Key`                                    | Guid    | 36      | Sim         | Chave do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                    |
| `Notification.Headers[].Value`                                  | Guid    | 36      | Sim         | Valor do header da requisição para a notificação de mudança de status da análise do processo de KYC                                                    |
| `Attachments[].AttachmentType`                                  | Guid    | 36      | Sim         | Tipo do documento em anexo do subordinado                                                                                                              |
| `Attachments[].File.Name`                                       | Guid    | 36      | Sim         | Nome do arquivo do documento em anexo do subordinado                                                                                                   |
| `Attachments[].File.FileType`                                   | Guid    | 36      | Sim         | Tipo do arquivo do documento em anexo do subordinado                                                                                                   |
| `Attachments[].File.Data`                                       | Guid    | 36      | Sim         | Documento convertido para **Base64**                                                                                                                   |

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