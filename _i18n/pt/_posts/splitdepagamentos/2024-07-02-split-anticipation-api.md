---
layout: manual
title: Split de Pagamentos - Antecipação de Recebíveis
description: Split de Pagamentos - Onboarding
search: true
toc_footers: false
categories: manual
sort_order: 6
hub_visible: false
tags:
  - 6. Soluções para Marketplace
language_tabs:
  json: JSON
---

# Antecipação de recebíveis

A API de Antecipação de Recebíveis do Split de Pagamentos é mais um canal para que o master solicite a antecipação de valores, sem precisar entrar em contato com a Braspag.

**Quem pode solicitar a antecipação de recebíveis via API?**

Qualquer usuário com perfil master pode solicitar antecipação dos recebíveis do próprio master ou dos seus sellers.

**Quais são os requisitos para que a antecipação seja aprovada?**

O master ou seller precisa ter saldo livre disponível em agenda na data do pedido de antecipação.

**Qual é o prazo para receber o valor da antecipação?**

O prazo de liquidação é de **até dois dias úteis** a partir da data da solicitação da antecipação (D+2). É importante considerar que o horário de operação da mesa de antecipação de recebíveis é de segunda à sexta, das 8h às 16h30. Assim, se o pedido de antecipação for feito após às 16h30, o pedido será processado somente no próximo dia útil.

# Ambientes

## Sandbox

| API | URL | DESCRIÇÃO |
|-|-|-|
| `Braspag OAUTH2 Server` | https://authsandbox.braspag.com.br/ | Autenticação |
| `split-anticipation-api` | https://splitsandbox.braspag.com.br/anticipation-api | Simular, criar e consultar antecipação. |

## Produção

| API | URL | DESCRIÇÃO |
|-|-|-|
| `Braspag OAUTH2 Server` | https://auth.braspag.com.br/ | Autenticação  |
| `split-anticipation-api` | https://split.braspag.com.br/anticipation-api | Simular, criar e consultar antecipação. |

# Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), no qual é necessário primeiro obter um token de acesso por meio das suas credenciais, e posteriormente enviar o token de acesso à API de de Antecipação de Recebíveis.

Para obter um token de acesso:

1. Concatene o `MerchantId` e `ClientSecret`: `MerchantId:ClientSecret`;  
2. Codifique o resultado da concatenação em Base64;  
3. Realize uma requisição ao servidor de autorização.

![SplitAuth]({{ site.baseurl_root }}/images/braspag/split/split5-auth.png)

## Requisição  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

## Resposta

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O `MerchantId` é o mesmo utilizado na integração com a API Cielo E-Commerce ou com a API do Pagador. O `ClientSecret` deve ser obtido junto ao Split.

Use o token retornado (`access_token`) em toda requisição à API de Antecipação de Recebíveis como uma chave de autorização. O token de acesso possui uma validade de 20 minutos e é necessário gerar um novo token toda vez que a validade expirar.

# Simular antecipação

Simula o cadastro de antecipações para o master.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{`split-anticipation-api`}/merchants/{merchantId}/receivable-anticipations/simulation</span></aside>

**Parâmetros no cabeçalho (header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Authorization`| Bearer {`access_token`}|

**Parâmetros na rota (path)**

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|-|-|-|-|-|
| `MerchantId` | GUID | - | Sim | Código do master merchant |

**Parâmetros no corpo (body)**

```json
{
    "Amount": 10,
    "SettlementDate": "2024-05-27",
    "RecipientDocumentNumber": "61817215000194",
    "RequesterEmail": "requester@company.com"
}
```

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|-|-|-|-|-|
| `Amount` | long | - | Sim | Valor a antecipar |
| `SettlementDate` | DateTime | - | Sim | Data de liquidação |
| `RecipientDocumentNumber` | String | - | Sim | Número de documento do recebedor. Pode ser o documento do próprio master ou o documento do seller para o qual a antecipação está sendo solicitada. |
| `RequesterEmail` | string | - | Sim | E-mail do master |

### Resposta

```json
{
    "Id": "2106498e-5569-4c39-a778-8e3aafd740b3",
    "Amount": 10,
    "AmountToAnticipate": 35619733,
    "AnticipationNetAmount": "271928",
    "PrecificationDate": "2024-05-28",
    "SettlementDate": "2024-05-31",
    "Status": "EmProcessamento",
    "Details": {
       "SubAcquirerAnticipationRate": "23145",
       "MasterAnticipationRate": "12312",
     },
    "LegalEntity": {
        "RecipientDocumentNumber": "93719314000120",
        "RecipientCorporateName": "alexsander alterado",
        "RecipientFancyName": "alexsander alterado"
    },
    "BankAccount": {
        "AccountNumber": "1234",
        "AccountDigit": "1",
        "AgencyNumber": "1234",
        "AgencyDigit": "1",
        "DocumentNumber": "93719314000120",
        "DocumentType": "Cnpj",
        "BankAccountType": "CheckingAccount",
        "CompeCode": "002"
    },
    "Links": [
        {
            "Href": "https://splitblobstr.blob.core.windows.net/anticipation-precification-sandbox/20240531/alexsander%20alterado%20(93719314000120)%20-%2020240531%20-%20v7.xlsx?sv=2018-03-28&sr=b&sig=fRVy6pA2vpK9Ln4Y2TVkrs2SGRXi7SytbPSAC6cHjJ0%3D&st=2024-05-28T18%3A34%3A46Z&se=2024-05-28T23%3A59%3A59Z&sp=r"
        }
    ],
}
```

| PROPRIEDADE | TIPO | DESCRIÇÃO |
|-|-|-|
| `Id` | GUID | Identificador da antecipação. |
| `Amount` | long | Valor de antecipação solicitado.|
| `AmountToAnticipate` | long | Valor bruto alcançado para antecipação. |
| `AnticipateNetAmount` | long | Valor líquido a receber. |
| `PrecificationDate` | string | Data de precificação. |
| `SettlementDate` | string | Data de liquidação. |
| `AverageTerm` | long | Prazo médio em dias. |
| `SubAcquirerAnticipationRate` | long | Taxa do subadquirente. |
| `MasterAnticipationRate` | long | Taxa de comissão do master. |
| `Status` | string | Situação da antecipação. |
| `RecipientDocumentNumber` | string | Número de documento da pessoa física/jurídica recebedora. Pode ser o documento do próprio master ou o documento do seller para o qual a antecipação está sendo solicitada. |
| `RecipientCoporateName` | string | Nome da corporação da pessoa física/jurídica. |
| `RecipientFancyName` | string | Nome comum da pessoa física/jurídica. |
| `AccountNumber` | string | Número da conta. |
| `AccountDigit` | char | Dígito da conta. |
| `AgencyNumber` | string | Número da agência. |
| `AgencyDigit` | char | Dígito da agência. |
| `DocumentNumber` | string | Número de documento da conta. |
| `DocumentType` | string | Tipo de documento. |
| `BankAccountType` | string | Tipo de conta bancária. |
| `CompeCode` | string | Código de compensação do banco. [Lista de código de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o)|
| `Href` | string | link de download de planilha dos recebíveis antecipados |

# Criar antecipação de recebíveis

Solicita a antecipação de recebíveis para o master.

## Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{`split-anticipation-api`}/merchants/{merchantId}/receivable-anticipations</span></aside>

**Parâmetros no cabeçalho (header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Authorization`| Bearer {`access_token`}|

**Parâmetros na rota (path)**

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|-|-|-|-|-|
| `MerchantId` | GUID | - | Sim | Código do master merchant |

**Parâmetros no corpo (body)**

```json
{
    "Amount": 10,
    "SettlementDate": "2024-05-27",
    "RecipientDocumentNumber": "61817215000194",
    "RequesterEmail": "requester@company.com"
}
```

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|-|-|-|-|-|
| `MerchantId` | GUID | - | Sim | Código do master merchant. |
| `Amount` | long | - | Sim | Valor a antecipar. |
| `SettlementDate` | DateTime | - | Sim | Data de liquidação. |
| `RecipientDocumentNumber` | String | - | Sim | Número de documento do recebedor. Pode ser o documento do próprio master ou o documento do seller para o qual a antecipação está sendo solicitada. |
| `RequesterEmail` | String | - | Sim | E-mail do master. |

## Resposta

```json
{
    "Id": "2106498e-5569-4c39-a778-8e3aafd740b3",
    "Amount": 10,
    "AmountToAnticipate": 35619733,
    "AnticipationNetAmount": "271928",
    "PrecificationDate": "2024-05-28",
    "SettlementDate": "2024-05-31",
    "Status": "EmProcessamento",
    "Details": {
       "SubAcquirerAnticipationRate": "23145",
       "MasterAnticipationRate": "12312",
     },
    "LegalEntity": {
        "RecipientDocumentNumber": "93719314000120",
        "RecipientCorporateName": "alexsander alterado",
        "RecipientFancyName": "alexsander alterado"
    },
    "BankAccount": {
        "AccountNumber": "1234",
        "AccountDigit": "1",
        "AgencyNumber": "1234",
        "AgencyDigit": "1",
        "DocumentNumber": "93719314000120",
        "DocumentType": "Cnpj",
        "BankAccountType": "CheckingAccount",
        "CompeCode": "002"
    },
    "Links": [
        {
            "Href": "https://splitblobstr.blob.core.windows.net/anticipation-precification-sandbox/20240531/alexsander%20alterado%20(93719314000120)%20-%2020240531%20-%20v7.xlsx?sv=2018-03-28&sr=b&sig=fRVy6pA2vpK9Ln4Y2TVkrs2SGRXi7SytbPSAC6cHjJ0%3D&st=2024-05-28T18%3A34%3A46Z&se=2024-05-28T23%3A59%3A59Z&sp=r"
        }
    ],
}
```

| PROPRIEDADE | TIPO | DESCRIÇÃO |
|-|-|-|
| `Id` | GUID | Identificador da antecipação. |
| `Amount` | long | Valor de antecipação solicitado. |
| `AmountToAnticipate` | long | Valor bruto alcançado para antecipação. |
| `AnticipateNetAmount` | long | Valor líquido a receber. |
| `PrecificationDate` | string | Data de precificação. |
| `SettlementDate` | string | Data de liquidação. |
| `AverageTerm` | long | Prazo médio em dias. |
| `SubAcquirerAnticipationRate` | long | Taxa do subadquirente. |
| `MasterAnticipationRate` | long | Taxa de comissão do master. |
| `Status` | string | Situação da antecipação. |
| `RecipientDocumentNumber` | string | Número de documento da pessoa física/jurídica recebedora. Pode ser o documento do próprio master ou o documento do seller para o qual a antecipação está sendo solicitada. |
| `RecipientCorporateName` | string | Nome da corporação da pessoa física/jurídica. |
| `RecipientFancyName` | string | Nome comum da pessoa física/jurídica. |
| `AccountNumber` | string | Número da conta. |
| `AccountDigit` | char | Dígito da conta. |
| `AgencyNumber` | string | Número da agência. |
| `AgencyDigit` | char | Dígito da agência. |
| `DocumentNumber` | string | Número de documento da conta. |
| `DocumentType` | string | Tipo de documento. |
| `BankAccountType` | string | Tipo de conta bancária. |
| `CompeCode` | string | Código de compensação do banco. [Lista de código de compensação](https://braspag.github.io//manual/manual-api-de-cadastro-de-sellers#lista-de-c%C3%B3digos-de-compensa%C3%A7%C3%A3o)|
| `Href` | string | Link de download de planilha dos recebíveis antecipados. |

# Consultar antecipação

Consulta uma antecipação pelo identificador da antecipação e do merchant.

## Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{split-anticipation-api}merchants/{{merchantId}}/receivable-anticipations/{{AnticipationId}}</span></aside>

**Parâmetros no cabeçalho (header)**

|KEY|VALUE|
|---|---|
|`Content-Type`|application/json|
|`Authorization`| Bearer {`access_token`}|

**Parâmetros na rota (path)**

| PROPRIEDADE | TIPO | TAMANHO | OBRIGATÓRIO | DESCRIÇÃO |
|-|-|-|-|-|
| `MerchantId` | GUID | - | Sim | Código do master merchant |
| `Id` | GUID| -| Sim | Identificador da antecipação.|

## Resposta

```json
{
    "Id": "4d1f9698-a9bb-44f6-be03-6e0d258df2b8",
    "Amount": 10,
    "AmountToAnticipate": 35288571,
    "AnticipationNetAmount": 271928,
    "PrecificationDate": "2024-05-28",
    "TargetDate": "2024-06-03",
    "LastReceivableDate": "2025-05-15",
    "CreatedAt": "2024-06-03T14:56:19.85",
    "AverageTerm": 67,
    "Status": "Canceled",
    "Recipient":{
        "DocumentNumber": "12345678912345",
        "FancyName": "Fancy Name",
        "CorporateName": "CorporateName"
    },
    "RateDetails": { 
        "SubAcquirerAnticipationRate": 0.35,
        "MasterAnticipationRate": 0.00
    },
    "BankAccount": {
        "BankId": 2,
        "BankName": "Banco Simulado",
        "AccountNumber": "1234",
        "AccountDigit": "1",
        "AgencyNumber": "1234",
        "AgencyDigit": "1",
        "DocumentNumber": "12345678912345",
        "DocumentType": "Cnpj",
        "BankAccountType": "CheckingAccount"
    }
}
```

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|-|-|-|-|
| `Id` | GUID| - | Identificador da Antecipação |
| `Amount` | Long | -| Valor requerido da antecipação |
| `AmountToAnticipate` | Long| - |  Valor que será antecipado |
| `PrecificationDate` | Date| - | Data de quando foi feito a precificação da antecipação, não necessariamente a data que será antecipado. |
| `TargetDate` | Date| - | Data da antecipação |
| `LastReceivableDate` | Date| - | Data do ultimo recebível |
| `CreatedAt` | Date| - | Data da  criação da antecipação |
| `AverageTerm` | Int| - | Valor médio em dias  do pagamento da antecipação |
| `Status` | String| - | Status indicado da antecipação ("Undefined", "Processing", "Processed", "Canceled", "Settled")|
| `Recipient` | Object| - | Objeto com os detalhes do recebedor |
| `Recipient.DocumentNumber` | String | - | Número de documento do recebedor. Pode ser o documento do próprio master ou o documento do seller para o qual a antecipação está sendo solicitada.  |
| `Recipient.FancyName` | String | - | Nome comum da pessoa física/jurídica. |
| `Recipient.CorporateName` | String| - | Nome da corporação da pessoa física/jurídica. |
| `RateDetails` | Object| - | Objeto com os valores das porcentagens da antecipação |
| `SubAcquirerAnticipationRate` | Long| - | Taxa do Sub adquirente |
| `MasterAnticipationRate` | Long | - | Taxa do master |
| `BankAccount` | Object | - | Objeto com as informações da conta bancária |
| `BankId` | Long | - | Identificador do Banco |
| `BankName` | String | - | Valor da taxa de exceção atual |
| `AccountNumber` | String | - | Número da conta |
| `AccountDigit` | Char | - | Dígito da conta |
| `AgencyNumber` | String| - | Número da agência |
| `DocumentNumber` | String| - | Número de documento da conta|
| `DocumentType` | Decimal | - | Tipo de documento |
| `BankAccountType` | string| - | Tipo de conta bancária |

### Validações e retornos possíveis

1. Caso o **merchantId** informado na rota não seja do cliente logado e o usuário seja do tipo master

    > Status Code = 400

    Mensagem: *Not possible to consult an anticipation for {merchantId} master merchant id.*

2. Caso a antecipação informada não faça parte do merchant informado

    > Status Code = 400

    Mensagem: *User hasn't permission for this anticipation or anticipation doesn't exist*

3. Caso a antecipação informada não seja encontrada

    > Status Code = 404

# Notificação da antecipação

> A configuração da URL de notificação é **opcional**.

Para receber a notificação o tipo POST é necessário configurar a `URL de Notificação` durante o cadastro do master na Braspag. O endereço deve ser HTTPS e não se deve utilizar uma porta fora do padrão HTTPS (443).

Quando houver alteração no status da antecipação, o Split enviará uma notificação com os parâmetros do identificador da antecipação (`AnticipationId`) e o novo `Status`.

**Exemplo de notificação de mudança de Status:**

```json
{
    "AnticipationId" : "96ffb8be-6693-4f9b-bf8e-925b555b3207",
    "Status" : 2
}
```

| PROPRIEDADE | TIPO | TAMANHO | DESCRIÇÃO |
|-|-|-|-|
| `AnticipationId` | GUID | - | Identificador da antecipação. |
| `Status` | int ou string | Descrição Enum Status ou Id do Enum de Status| Identificador do Status. Valores possíveis:<br>*Undefined = 0<br>Processing = 1<br>Processed = 2<br>Canceled = 3<br>Settled = 4*  |
