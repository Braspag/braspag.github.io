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

## Ambientes

**API Onboarding**: https://splitonboarding.braspag.com.br

## Cadastro de Subordinados

A solicitação de cadastro deve ser realizada através de uma requisição pelo **Master** informando os dados do subordinado.

O subordinado será criado com status "Em análise" e estará bloqueado para participar transação, até que o processo de sua análise seja finalizado. 

O Master receberá a notificação com o resultado da análise, juntamente com as informações do subordinado, ao final do processo.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{split-onboarding-api}/api/v2/masters/{master-merchant-id}/subordinates</span></aside>

```json
--header "Authorization: Bearer {access_token}"
{
    "Merchant": {
        "ContactName":"Nome do Contato do Subordinado",
        "ContactPhone":"11987654321",
        "CorporateName":"Subordinado Corporativo Ltda",
        "DocumentNumber":"01131432000190",
        "DocumentType":"CNPJ",
        "FancyName":"Subordinado Nome Fantasia",
        "MerchantCategoryCode":"5719",
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
        }
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
        "Type": "ProofOfBankDomicile",
        "File": {
            "Name": "comprovante_bancario",
            "Type": "jpg",
            "Data": "ZWZxZWZxd2VmcXdlZnF3ZWZxd2VmcXdlZnF3ZWZxd2VmcXdlZnF3ZWZxdzM0ZndlZndlcXdlZnF3ZWZxd2VmcXdlZnF3ZWZ3cQ=="
        }
    }]
}
```

**Response**
```json
--header "Authorization: Bearer {access_token}"
{
    "MasterMerchantId": "665a33c5-0022-4a40-a0bd-daad04eb3236",
    "Merchant": {
        "MerchantId": "b8ccc729-a874-4b51-a5a9-ffeb5bd98878",
        "ContactName":"Nome do Contato do Subordinado",
        "ContactPhone":"11987654321",
        "CorporateName":"Subordinado Corporativo Ltda",
        "DocumentNumber":"01131432000190",
        "DocumentType":"CNPJ",
        "FancyName":"Subordinado Nome Fantasia",
        "MerchantCategoryCode":"5719",
        "MailAddress":"addres@email.mail.com",
        "Website":"https://www.website.com.br",
        "Blocked": true,
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
        }
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
        "Type": "ProofOfBankDomicile",
        "File": {
            "Name": "comprovante_bancario",
            "Type": "jpg"
        }
    }]
}
```

