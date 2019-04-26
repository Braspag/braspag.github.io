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

Assim como o Master, os subordinados também irão passar pelo processo de KYC (Know Your Customer) do Split de Pagamentos, com objetivo de identificar o cliente (subordinado). Por este motivo, alguns documentos do subordinado serão necessários.

O processo de KYC é uma medida obrigatória exigida pelas instituições reguladoras de pagamento.

O Onboarding do subordinado no Split de Pagamentos ocorre da seguinte forma:

1. O Master solicita o cadastro do subordinado.
2. O subordinado será criado com status "Em análise" e estará bloqueado para participar da transação, até que o processo de KYC seja finalizado.
3. Ao final da análise, o Master será notificado com o resultado do processo de KYC, juntamente com a identificação do subordinado.

## Ambientes

### Sandbox

**API Onboarding**: https://splitonboardingsandbox.braspag.com.br

### Produção

**API Onboarding**: https://splitonboarding.braspag.com.br

## Cadastro de Subordinados

A solicitação de cadastro deve ser realizada através de uma requisição pelo **Master** informando os dados do subordinado.

Para a definição de acordos entre o Master e seus subordinados, o **Split de Pagamentos** dispõe de duas possibilidades:

1. É possível definir a porcentagem do MDR (Merchant Discount Rate) cobrado por transação por Arranjos de Pagamento e intervalo de parcelas.
2. Caso o Master não queira definir a porcetagem do MDR para cada Arranjo de Pagamento e intervalor de parcelas, o **Split de Pagamentos** irá replicar os mesmos acordos do Master com a Subadquirente, para o Master com o Subordinado. Dessa forma, o Master deverá informar apenas um MDR único, que erá aplicado para todos os acordos.
**Exemplo:**

**MDR do Master com Subordinado: 4%**

| ACORDO SUBADQUIRENTE - MASTER | Visa  | Master | Elo   | Diners | Amex  | Hiper  |
|-------------------------------|--------------------------------------------------|
| Débito                        | 2.00% | 2.00%  | 2.00% |        |       |        |  
| Crédito a Vista               | 2.50% | 2.50%  | 2.50% | 2.50%  | 2.50% |  2.50% |
| Crédito 2x a 6x               | 3.00% | 3.00%  | 3.00% | 3.00%  | 3.00% |  3.00% |
| Crédito 7x a 12x              | 3.50% | 3.50%  | 3.50% | 3.50%  | 3.50% |  3.50% |

| ACORDO MASTER - SUBORDINADO  | Visa  | Master | Elo   | Diners | Amex  | Hiper  |
|------------------------------|--------------------------------------------------|
| Débito                       | 4.00% | 4.00%  | 4.00% |        |       |        |  
| Crédito a Vista              | 4.00% | 4.00%  | 4.00% | 4.00%  | 4.00% |  4.00% |
| Crédito 2x a 6x              | 4.00% | 4.00%  | 4.00% | 4.00%  | 4.00% |  4.00% |
| Crédito 7x a 12x             | 4.00% | 4.00%  | 4.00% | 4.00%  | 4.00% |  4.00% |

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/subordinates</span></aside>

### Informando a porcentagem do MDR por Arranjos de Pagamento  e intervalo de parcelas

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
            "Data": "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"
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento (Apenas números)                                                                                                                                                                                                 |     
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://www.web-payment-software.com/online-merchant-accounts/mcc-codes/){:target="_blank"} |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o numeral 0                                                                                                                                                             |
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
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://www.web-payment-software.com/online-merchant-accounts/mcc-codes/){:target="_blank"} |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o numeral 0                                                                                                                                                             |
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
| `Attachments[].AttachmentType`                                  | String  | -       | Sim         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Sim         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Sim         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

### Informando a porcentagem do MDR único aplicado para todos os acordos

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
            "Data": "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"
        }
    }]
}
```

| Propriedade                                                     | Tipo    | Tamanho | Obrigatório | Descrição                                                                                                                                                                                                                            |
|-----------------------------------------------------------------|---------|---------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento (Apenas números)                                                                                                                                                                                                 |     
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://www.web-payment-software.com/online-merchant-accounts/mcc-codes/){:target="_blank"} |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o numeral 0                                                                                                                                                             |
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
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://www.web-payment-software.com/online-merchant-accounts/mcc-codes/){:target="_blank"} |
| `ContactName`                                                   | String  | 100     | Sim         | Nome do contato responsável                                                                                                                                                                                                          |
| `ContactPhone`                                                  | String  | 11      | Sim         | Número do telefone do contato responsável (Apenas números)                                                                                                                                                                           |
| `MailAddress`                                                   | String  | 50      | Sim         | Endereço de e-mail                                                                                                                                                                                                                   |
| `Website`                                                       | String  | 200     | Não         | Endereço do website                                                                                                                                                                                                                  |
| `Blocked`                                                       | Boolean | -       | Sim         | Flag para indicar se o subordinado está bloqueado para participar da transação                                                                                                                                                       |
| `Analysis.Status`                                               | String  | -       | Sim         | Status da análise do processo de KYC. Os Status válidos são `Approved`, `ApprovedWithRestriction` e `Rejected`                                                                                                                       |
| `BankAccount.Bank`                                              | String  | 3       | Sim         | Código de compensação do banco. [Lista de Códigos de compensação](https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf){:target="_blank"}                                                                                                  |
| `BankAccount.BankAccountType`                                   | String  | -       | Sim         | Tipo de conta bancária. Os tipos válidos são `CheckingAccount` (Conta corrente) e `SavingsAccount` (Conta poupança)                                                                                                                  |
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o numeral 0                                                                                                                                                             |
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
| `Attachments[].AttachmentType`                                  | String  | -       | Sim         | Tipo do documento em anexo do subordinado. Os tipos válidos são `ProofOfBankDomicile` (Comprovante de domicílio bancário) e `ModelOfAdhesionTerm` (Modelo de termo de adesão)                                                        |
| `Attachments[].File.Name`                                       | String  | 50      | Sim         | Nome do arquivo do documento em anexo do subordinado                                                                                                                                                                                 |
| `Attachments[].File.FileType`                                   | String  | -       | Sim         | Tipo do arquivo do documento em anexo do subordinado. Os tipos de arquivos válidos são `pdf`, `png`, `jpg` e `jpeg`                                                                                                                  |

## Consulta de Subordinados

A API de Onboarding do Split de Pagamentos permite a consulta de um subordinado específico através de sua identificação.

<aside class="request"><span class="method post">GET</span> <span class="endpoint">{split-onboarding-api}/api/subordinates/{subordinate-merchant-id}</span></aside>

**Response**

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
| `CorporateName`                                                 | Guid    | 36      | Sim         | Razão social                                                                                                                                                                                                                         |
| `FancyName`                                                     | String  | 50      | Sim         | Nome fantasia                                                                                                                                                                                                                        |
| `DocumentNumber`                                                | String  | 14      | Sim         | Número do documento                                                                                                                                                                                                                  |
| `DocumentType`                                                  | String  | -       | Sim         | Tipo do documento. Os tipos válidos são `Cpf`, `Cnpj`                                                                                                                                                                                |
| `MerchantCategoryCode`                                          | String  | 4       | Sim         | (MCC) número registrado na ISO 18245 para serviços financeiros de varejo, utilizado para classificar o negócio pelo tipo fornecido de bens ou serviços. [Lista de Merchant Category Codes](https://www.web-payment-software.com/online-merchant-accounts/mcc-codes/){:target="_blank"} |
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
| `BankAccount.Number`                                            | String  | 20      | Sim         | Número da conta                                                                                                                                                                                                                      |
| `BankAccount.Operation`                                         | String  | 10      | Não         | Operação da conta                                                                                                                                                                                                                    |
| `BankAccount.VerifierDigit`                                     | Char    | 1       | Sim         | Dígito verificador da conta                                                                                                                                                                                                          |
| `BankAccount.AgencyNumber`                                      | String  | 15      | Sim         | Número da agência                                                                                                                                                                                                                    |
| `BankAccount.AgencyDigit`                                       | Char    | 1       | Sim         | Dígito da agência. Caso a agência não tenha dígito, informar o numeral 0                                                                                                                                                             |
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
| `Analysis.Score`            | Int     | -       | Não         | Score da análise do processo de KYC. Range de 1 a 100                                                                                                                                                                                |
| `Analysis.DenialReason`     | String  | -       | Não         | Motivo de reprovação do subordinado                                                                                                                                                                                                  |