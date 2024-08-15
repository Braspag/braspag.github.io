---
layout: manual
title: Split de Pagamentos - Conciliação
description: Manual de Integração API Split de Pagamentos
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

<aside class="warning"> O conteúdo deste manual foi descontinuado e não é atualizado desde 14/08/2024. Acesse o novo portal.</aside>

# As documentações do Split de Pagamentos estão em um novo portal

[![Novo portal de desenvolvedores e-commerce Braspag e Cielo]({{ site.baseurl_root }}/images/novo-docs.cielo.com.br.png)](https://docs.cielo.com.br/split/docs/conciliacao-split)

Acesse o novo portal de desenvolvedores E-commerce **[docs.cielo.com.br](https://docs.cielo.com.br/split/docs/conciliacao-split)**.

> **Atenção**: O conteúdo desta página está sendo descontinuado e não receberá atualizações a partir de 14/08/2024. Visite a nova documentação em [docs.cielo.br](https://docs.cielo.com.br/split/docs/conciliacao-split).

--------------------------------------------------------------------------------------------------------------------------

<aside class="warning"> O conteúdo a seguir não é atualizado desde 14/08/2024.</aside>

# Conciliação no Split de Pagamentos

A API do Split permite consultar a agenda e as **unidades de recebíveis** para vendas que passaram pelo Split de Pagamentos. 

> Em breve a consulta de transações também estará disponível.

# Glossário

Para que você possa aproveitar melhor todos os recursos disponíveis em nossa API, é importante conhecer alguns termos envolvidos no processo de conciliação:

|TERMO|DEFINIÇÃO|
|---|---|
|Transação|É o evento que representa uma venda.|
|Evento transacional|São eventos que podem ocorrer no processo de uma transação, como a transação, cancelamento, estorno e chargeback.|
|Agenda|A agenda apresenta uma previsão de data para execução do pagamento ou cobrança dos eventos de agenda.|
|Evento de agenda| É aquilo que discrimina o valor que vai ser creditado ou debitado na agenda. São eventos de agenda: créditos de transação, débitos de taxa de antifraude, débitos de estorno e chargeback, entre outros.|
|Arranjo de pagamento|É a combinação entre o **produto** (cartão de crédito, cartão de débito ou boleto) e a **bandeira**.|
|Chargeback|Ocorre quando o portador do cartão contesta uma compra junto ao emissor.|
|Unidade de Recebível (UR)|É a soma de todos os valores que um CPF ou CNPJ tem a receber em determinado dia por arranjo de pagamento.|

# Fluxo da transação até o pagamento

A captura de uma transação é a confirmação de que aquela venda foi realizada com sucesso. Assim, após a captura, uma agenda é gerada para cada evento transacional e para cada um de seus participantes (master e sellers).

A agenda apresenta a previsão de pagamento de eventos de crédito e débito. A agenda é atualizada de acordo com os eventos transacionais.

Para fins de pagamento (liquidação) são geradas as Unidade de Recebíveis (URs), compostas pelo CPF/CNPJ do recebedor, arranjo de pagamento e data da previsão de pagamento.

![Exemplo Fluxo Conciliação]({{ site.baseurl_root }}/images/braspag/split/exemplo-api-conciliacao.png)

> A partir das URs, é possível consultar a agenda que foi gerada para aquele dia e identificar as transações que originaram o valor da UR.

## Transação

Veja a seguir um exemplo do fluxo transacional no Split de Pagamentos:

![Fluxo Transacional Split]({{ site.baseurl_root }}/images/braspag/split/fluxo-transacional-split-pq.png)

O exemplo mostra uma transação que foi aprovada e capturada. No entanto, uma transação está sujeita a diversos eventos, tais como:

* Cancelamento;
* Estorno;
* Chargeback.

Os eventos que ocorrem com uma transação irão afetar a previsão de pagamento e o valor pago. 

A tabela a seguir apresenta três transações com diferentes arranjos de pagamento. Essas transações serão usadas como exemplo nas seções Agenda e Unidades de Recebíveis.

![Exemplo Transação]({{ site.baseurl_root }}/images/braspag/split/exemplo-transacao.png)

## Agenda

A Agenda apresenta a previsão diária de créditos e débitos para cada participante da transação (master e sellers), levando em conta o regime de pagamento para cada tipo de meio de pagamento:

* **Crédito:** em até 31 dias.
* **Crédito parcelado:** primeira parcela em 31 dias e demais a cada 30 dias.
* **Débito:** em até dois dias úteis.
* **Boleto:** em até dois dias úteis após a confirmação do pagamento.

<aside class="warning">O pagamento ocorre somente em dia de expediente bancário. Os prazos do regime de pagamento podem sofrer alterações por questões operacionais da adquirente ou da Braspag.</aside>

Considere uma transação de crédito no valor de R$90,00 dividida em três parcelas. O exemplo a seguir apresenta qual seria o ciclo dessa transação, da data de captura até a data de previsão de pagamento da última parcela.

![Exemplo Agenda]({{ site.baseurl_root }}/images/braspag/split/exemplo-agenda.png)

<aside class="notice">A consulta de eventos transacionais estará disponível em breve.</aside>

## Unidades de Recebíveis

As Unidades de Recebíveis (URs) estão em vigor desde 07/06/2021, com a resolução nº 4.734/2019 do Conselho Monetário Nacional (CMN) e a Circular nº 3.952/2019 do Banco Central do Brasil. Com isso, as credenciadoras e subcredenciadoras, como o Split, precisam registrar as URs dos estabelecimentos em uma entidade registradora que será responsável por disponibilizar as informações dos recebíveis entre instituições financeiras.

Cada UR é composta por:

* CPF ou CNPJ do recebedor;
* Arranjo de pagamento e 
* Data de pagamento.

Considere que uma loja teve três transações no dia **31 de maio**:

![Exemplo Transação]({{ site.baseurl_root }}/images/braspag/split/exemplo-transacao.png)

Os valores correspondentes a essas transações serão agrupados em Unidades de Recebíveis, respeitando as regras dos regimes de pagamento. Veja a seguir como as URs oriundas dos valores da tabela seriam compostas*:

![Exemplo UR]({{ site.baseurl_root }}/images/braspag/split/exemplo-ur-v2.png)

*O exemplo da tabela não considerou débitos referentes a taxas.

As próximas seções deste manual apresentarão as instruções para acessar o ambiente de teste e fazer as requisições de autenticação e consulta de URs.

# Ambientes

Para executar uma operação:

1. Combine a **base** da URL do ambiente com o **_endpoint_** da operação desejada. Ex.: https://split.braspag.com.br/*oauth2/token*.
2. Envie a requisição para a URL utilizando o método HTTP (GET ou POST) adequado à operação.

## Sandbox

Na API Split, você pode usar o ambiente **Sandbox** para homologação e testes da sua integração.

|Tipo|URL Base|Descrição|
|---|---|---|
|**Braspag OAUTH2 Server**|https://authsandbox.braspag.com.br/| Para requisição de autenticação.|
|**API Split**|https://splitsandbox.braspag.com.br| Para requisições de consulta de agenda e unidade de recebíveis.|

> Solicite suas credenciais para o ambiente de teste com o nosso [Suporte](https://suporte.braspag.com.br){:target="_blank"}.

## Produção

|Tipo|URL Base|Descrição|
|----|--------|---------|
|**Braspag OAUTH2 Server**|https://auth.braspag.com.br/| Para requisição de autenticação.|
|**API Split**|https://split.braspag.com.br/| Para requisições de consulta de agenda e unidade de recebíveis.|

<aside class="notice">As credenciais de acesso (recebidas durante o onboarding) são utilizadas para autenticar todas as requisições feitas para os endpoints da API.</aside>
<aside class="warning">Por segurança, essas credenciais não devem ser indevidamente compartilhadas ou expostas.</aside>

# Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAuth 2.0](https://oauth.net/2/){:target="_blank"}. Primeiro, você deverá obter um token de acesso, utilizando suas credenciais. 

Para obter um token de acesso:

1. Concatene o `MerchantId` e o `ClientSecret`: `MerchantId:ClientSecret`;
2. Codifique o resultado da concatenação em Base64;  
3. Faça uma requisição ao servidor de autorização utilizando o código alfanumérico gerado.

Veja um exemplo de requisição de autenticação:

## Requisição  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/oauth2/token</span></aside>

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

<aside class="notice">O `MerchantId` é o identificador dentro do Split. O `ClientSecret` é a chave utilizada na autenticação.</aside>

Você deverá enviar token de acesso retornado pela API de autenticação (`access_token`) em toda requisição à API Split como uma chave de autorização. O `access_token` possui uma validade de 20 minutos, e é necessário gerar um novo token toda vez que a validade expirar.

# Consulta de Agenda

A API Split permite consultar a agenda de acordo com os parâmetros data prevista de pagamento, data de lançamento na agenda, bandeira, produto, `MerchantId`, `ReceivableId` e índice paginação.

## Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/schedule-api/v1/ReconciliationSchedules</span></aside>

| Parâmetro               | Descrição | Tipo | Obrigatório |
|---|---|---|---|
| `DocumentNumber` | Número de documento (CPF ou CNPJ) do participante. | String   | Não        |
| `TransactionId` | Número da transação. | Guid   | Não        |
| `InitialForecastedDate` | Data inicial prevista de pagamento para busca. | Date   | Não*        |
| `FinalForecastedDate`   | Data final prevista de pagamento para busca.   | Date   | Não*        |
| `InitialScheduleDate`   | Data inicial de lançamento de informação na agenda.    | Date   | Não*        |
| `FinalScheduleDate`     | Data final de lançamento de informação na agenda.    | Date   | Não*        |
| `Brand`                 | Bandeira  que deve ser considerada na consulta. Por padrão, o saldo é consultado em todas as bandeiras na qual o solicitante possui agenda. | String | Não         |
| `Product`               | Produto que deve ser considerado na consulta ("CreditCard" para cartão de crédito, "DebitCard" para cartão de débito ou "BankSlip" para boleto). Por padrão, são retornadas informações de todos os produtos na qual o solicitante possui agenda. | String | Não         |
| `MerchantId`           | Id do Merchant que deseja consultar as informações. Serão retornadas informações referentes ao número de documento do cadastro. |Guid| Não |
| `ScheduleEvent`            | Ids dos Eventos de Agenda que se deseja consultar - consulte os Ids no anexo [Eventos de Agenda](https://braspag.github.io//manual/split-pagamentos-nova-api-conciliacao#eventos-de-agenda).| Int (Array)   | Não         |
|`ReceivableId`            | Id do Receivable que deseja consultar as informações. Serão retornadas informações referentes ao identificador do recebível.| Guid  | Não|
| `PageIndex`             | Índice da paginação. É necessário para percorrer as páginas do resultado. | Número | Não         |

*É obrigatório passar pelo menos um intervalo de datas, com no máximo 31 dias entre a data inicial e a data final.

<aside class="notice">Ao passar o parâmetro `ReceivableId`, não será necessário passar nenhum outro parâmetro.</aside>

## Resposta

```json
{   
    "PageCount": 1,
    "PageIndex": 1,
    "PageSize": 50,
    "TotalItems": 2,
    "TotalItemSchedules": 2,
    "Items": [
        {
            "DocumentNumber": "000000000000",
            "ForecastedDate": "2021-11-16",
            "Product": "CreditCard",
            "Brand": "Visa",
            "ForecastedNetAmount": 500,
            "ItemSchedules": [
                {
                    "ScheduleId": "b3f1253e-0c42-442b-9280-358814d2e0fa",
                    "MerchantDetails": {
                        "MerchantId": "d910543a-d8e7-4af5-82ea-69c6ef3c53c6",
                        "MerchantType": "master",
                        "CorporateName": "Razão Social Ltda",
                        "FancyName": "Nome Fantasia da Minha Loja",
                        "DocumentType": "CPF"
                    },
                    "ScheduleType": "Credit",
                    "TransactionalEventType": "Transaction",
                    "TransactionalEventId":"9dcda2a1-7be7-4493-be13-6f438e950ba1",
                    "InstallmentNumber": 1,
                    "InstalmentNetAmount": -100,
                    "PaymentDetails": {
                        "PaymentId": "26052f1c-78c7-4199-9768-0548cf99de66",
                        "Installments": 10,
                        "CaptureDate": "2021-01-01",
                        "AuthorizationDate": "2021-01-01 00:00:00",
                        "Nsu": "123456",
                        "AffiliationCode": "1234567890",
                        "OrderId": "12356ABCDE"
                    }
                }
            ]
        },
        {
            "DocumentNumber": "99999999999",
            "ForecastedDate": "2021-11-16",
            "Product": "CreditCard",
            "Brand": "Visa",
            "ForecastedNetAmount": 500,
            "ItemSchedules": [
                {
                    "ScheduleId": "33f1253e-0c42-442b-9280-358814d2e0fb",
                    "MerchantDetails": {
                        "MerchantId": "d910543a-d8e7-4af5-82ea-69c6ef3c53c7",
                        "MerchantType": "Subordinate",
                        "CorporateName": "Razão Social Ltda",
                        "FancyName": "Nome Fantasia da Minha Loja",
                        "DocumentType": "CPF"
                    },
                    "ScheduleType": "Credit",
                    "TransactionalEventType": "Transaction",
                    "TransactionalEventId":"9dcda2a1-7be7-4493-be13-6f438e950ba1",
                    "InstallmentNumber": 1,
                    "InstalmentNetAmount": -100,
                    "PaymentDetails": {
                        "PaymentId": "26052f1c-78c7-4199-9768-0548cf99de66",
                        "Installments": 10,
                        "CaptureDate": "2021-01-01",
                        "AuthorizationDate": "2021-01-01 00:00:00",
                        "Nsu": "123456",
                        "AffiliationCode": "1234567890",
                        "OrderId": "12356ABCDE"
                    }
                }
            ]
        }
    ]
}
```

| Propriedade  | Tipo      | Descrição |
|---|---|---|
| `PageCount`  | Número    | Quantidade de páginas.  |
| `PageIndex`  | Número    | Página atual. |
| `PageSize`   | Número    | Quantidade máxima de itens por página.  |
| `TotalItems` | Número    | Quantidade total de URs para o filtro solicitado.  |
| `TotalItemSchedules`       | Número  | Quantidade total de `ItemSchedules` para o filtro solicitado.|  
| `Items`      | Array[ScheduleReport] | Lista de objetos contendo informações de agenda, separada por produto e bandeira.  |
| `Items[].DocumentNumber`   | string     | Número do documento (CPF/CNPJ) do lojista.   |
| `Items[].ForecastedDate`   | Date   | Data prevista de pagamento. Formato YYYY-dd-MM. Ex: 2021-11-01.   |
| `Items[].Product`   | String   | Produto. Tipos possíveis: "CreditCard" para cartão de crédito, "DebitCard" para cartão de débito ou "BankSlip" para boleto. |
| `Items[].Brand`     | String   | Bandeira do cartão ou banco emissor do boleto. Tipos possíveis: *Visa, Master, Amex, Elo, Diners e Hipercard.*  |
| `Items[].ForecastedNetAmount`  | Número   | Valor em centavos, podendo ser negativo. Ex R$1,00 = 100,  referente ao somatório dos valores líquidos de agenda.  |
| `Items[].ItemSchedules`   | Array[Schedule]  | Lista de objeto contendo informações de cada agenda individual. |
| `Items[].ItemSchedules[].ScheduleId`                       | GUID                  | Id de identificação do evento da agenda.  |
| `Items[].ItemSchedules[].MerchantDetails`                  | MerchantDetails       | Objeto contendo os detalhes da loja envolvida na agenda.  |
| `Items[].ItemSchedules[].MerchantDetails.MasterMerchantId` | GUID                  | Id do Master. Retornado quando o Merchant for um sellers. |
| `Items[].ItemSchedules[].MerchantDetails.MerchantId`       | GUID                  | Id da loja.  |
| `Items[].ItemSchedules[].MerchantDetails.MerchantType`     | String                | Tipo da loja. Valores possíveis: *Master* ou *Subordinate* |
| `Items[].ItemSchedules[].MerchantDetails.CorporateName`    | String                | Razão social da loja.  |
| `Items[].ItemSchedules[].MerchantDetails.FancyName`        | String                | Nome fantasia da loja. |
| `Items[].ItemSchedules[].MerchantDetails.DocumentType`     | String                | Tipo de documento da loja. Tipos possíveis: *CNPJ* ou *CPF*.   |
| `Items[].ItemSchedules[].ScheduleType`                     | String                | Tipo de Evento da Agenda. Valores possíveis:<br><br>**Crédito:**<br><br>*Credit<br>FeeCredit<br>RefundCredit<br>ChargebackCredit<br>AntiFraudFeeCredit<br>AdjustmentCredit<br>ChargebackReversalCredit<br>AnticipationCredit<br>AnticipationCommissionCredit<br>AnticipatedInstallmentsCredit<br>RefundReversalCredit<br>ReversalFeeCredit<br>BankSlipFeeCredit<br>BalanceCompensationCredit<br>ReversalAntiFraudFeeCredit<br>ReversalBankSlipFeeCredit<br>ScheduleBalanceCredit*<br><br>**Débito:**<br><br>*Debit<br>FeeDebit<br>RefundDebit<br>ChargebackDebit<br>AntiFraudFeeDebit<br>AdjustmentDebit<br>ChargebackReversalDebit<br>AnticipationCommissionDebit<br>AnticipatedInstallmentsDebit<br>RefundReversalDebit<br>ReversalPayoutDebit<br>ReversalFeeDebit<br>BankSlipFeeDebit<br>BalanceCompensationDebit<br>ReversalAntiFraudFeeDebit<br>ReversalBankSlipFeeDebit<br>AnticipationDebit<br>CompensationBetweenSamePaymentArrangementDebit<br>ScheduleBalanceDebit* |  
| `Items[].ItemSchedules[].TransactionalEventType`           | string                | Tipo do evento transacional de agenda. Valores possíveis :<br>*Adjustment<br>Anticipation<br>Antifraud<br>Chargeback<br>ChargebackReversal<br>DebitBalanceAccounts<br>Refund<br>RefundReversal<br>Transaction<br>TransactionReversal*<br>|
| `Items[].ItemSchedules[].TransactionalEventId`             | GUID                  |Id do Evento transacional.    |
| `Items[].ItemSchedules[].InstallmentNumber`                | Número                | Número da parcela agendada.  |
| `Items[].ItemSchedules[].InstalmentNetAmount`              | Número                | Valor líquido da parcela, podendo ser negativo. Ex: -R$100 =-100.   |
| `Items[].ItemSchedules[].PaymentDetails`                   | PaymentDetails        | Objeto contendo detalhes do pagamento (transação ou pedido) ao qual a agenda se refere.  |
| `Items[].ItemSchedules[].PaymentDetails.PaymentId`         | GUID                  | Id do pagamento (transação) devolvido pelo split.  |
| `Items[].ItemSchedules[].PaymentDetails.Installments`      | Número                | Número total de parcelas da transação.   |
| `Items[].ItemSchedules[].PaymentDetails.CaptureDate`       | Data                  | Data em que a transação foi capturada, isto é, o dia em que o dinheiro foi debitado do cartão/conta do comprador; ou em que o pagamento do boleto foi confirmado. Ex: 2021-01-01.   |
| `Items[].ItemSchedules[].PaymentDetails.AuthorizationDate` | DateTime              | Data e hora em que a transação foi autorizada. Significa o momento em que a operadora do cartão reservou o saldo do cartão do comprador, mas esse valor não necessariamente foi debitado (o débito acontece na captura como explicado no campo anterior). Ex: 2021-01-01 00:00:00.  |
| `Items[].ItemSchedules[].PaymentDetails.Nsu`               | String                | Número sequencial único retornado pela adquirente após a autorização da transação.  |
| `Items[].ItemSchedules[].PaymentDetails.AffiliationCode`   | String                | Número de filiação da loja junto à adquirente.  |
| `Items[].ItemSchedules[].PaymentDetails.OrderId`           | String                | Número do pedido da loja. |

# Consulta de Unidade de Recebíveis

A API Split permite consultar as **unidades de recebíveis** de acordo com alguns parâmetros, como intervalo de data prevista de pagamento, intervalo de data de pagamento efetivo, bandeira, produto, MerchantId, antecipação, todos os sellers e número da página.

## Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/schedule-api/v1/receivables</span></aside>

| Parâmetro                      | Descrição                                                                             | Tipo    | Obrigatório|  
|--------------------------------|---------------------------------------------------------------------------------------|---------|------------|  
| `InitialForecastedDate`        | Intervalo de data previsto de pagamento inicial para busca.                          | Data    | Não*       |  
| `FinalForecastedDate`          | Intervalo de data previsto de pagamento final para busca.                            | Data    | Não*       | 
| `InitialSettlementDate`        | Intervalo de data de pagamento efetivo inicial para busca.                           | Data    | Não*       |  
| `FinalSettlementDate`          | Intervalo data de pagamento efetivo final para busca.                                | Data    | Não*       | 
| `Brand`                        | Bandeira que deve ser considerada na consulta. Por padrão, o saldo é consultado em todas as bandeiras na qual o solicitante possui recebíveis. Valores possíveis:<br>Visa;<br>Master;<br>Amex;<br>Elo;<br>Diners;<br>Hipercard.| String  | Não        | 
| `Product`                      | Produto que deve ser considerado na consulta (CreditCard, DebitCard ou BankSlip). Por padrão, são retornadas informações de todas as bandeiras na qual o solicitante possui recebíveis.                                                                    | String  | Não        |
| `MerchantId`                   | Id do Merchant que deseja consultar as informações. Serão retornadas informações referentes ao número de documento do cadastro| Guid   | Não|  
| `Anticipation`                 | Flag para informar se deseja consultar apenas informações referentes à antecipação    | Boolean    | Não        |  
| `IncludeAllSubordinates`       | Determina se serão incluídas informações dos sellers que realizaram o *optin* para o master consultar as informações.| Boolean | Não |  
|`PageIndex`                     |Índice da paginação. Necessário para percorrer as páginas do resultado                 | Inteiro     | Não        |

***O intervalo de datas para utilização da conciliação de URs deve seguir as seguintes regras:**

* É obrigatório passar pelo menos um intervalo de datas;
* O intervalo entre a data inicial e final deve ser de no máximo 31 dias;
* A data atual não pode estar entre o intervalo da busca;
* A data inicial precisa ser um dia útil;
* A data final precisa ser no máximo D-1 dia útil em relação a data atual ou maior que a data atual.

## Resposta

```json
{
    "PageIndex": 1,
    "PageSize": 100,
    "PageCount": 5,
    "Items": [
        {   
            "ReceivableId": "d1ece5e7-f996-40eb-8825-8e3f7decba41",
            "DocumentNumber": "000000000000",
            "ForecastDate": "2021-11-16",
            "Product": "CreditCard",
            "Brand": "Visa",
            "TotalAmount": 15055,
            "ReceivableAmount": 0,
            "AnticipatedAmount": 450,
            "Settlements": [
                {
                    "ReceivableSettlementType": "Braspag",
                    "SettlementStatus": "Scheduled",                 
                    "Anticipated": false,
                    "Amount": 4055,
                    "Instruction": {
                        "Ispb": "1",
                        "CompeCode": "001",
                        "AgencyNumber": "00001",
                        "AgencyDigit": "1",
                        "AccountNumber": "353535",
                        "AccountDigit": "1",
                        "AccountType": "CheckingAccount",
                        "BankAccountDocumentNumber": "000000000000", 
                        "BankAccountHolderName": "Nome do Beneficiario"
                    }
                },
                {
                    "ReceivableSettlementType": "Braspag",
                    "SettlementStatus": "Scheduled",                   
                    "Anticipated": false,
                    "Amount": 100,
                    "Instruction": {
                        "Ispb": 1,
                        "CompeCode": "001",
                        "AgencyNumber": "00001",
                        "AgencyDigit": "1",
                        "AccountNumber": "353535",
                        "AccountDigit": "1",
                        "AccountType": "CheckingAccount", 
                        "BankAccountDocumentNumber": "000000000000",
                        "BankAccountHolderName": "Nome do Beneficiario"
                    }
                },
                {
                    "ReceivableSettlementType": "Braspag",
                    "Anticipated": true,
                    "SettlementDate": "2021-11-10",
                    "Amount": 450,
                    "AnticipationDetails": {
                        "GrossAmount": 500,
                        "AnticipatedFee": 50
                    },
                    "SettlementStatus": "Settled",        
                    "Instruction": {
                        "Ispb": 1,
                        "CompeCode": "001",
                        "AgencyNumber": "00001",
                        "AgencyDigit": "1",
                        "AccountNumber": "353535",
                        "AccountDigit": "1",
                        "AccountType": "CheckingAccount",
                        "BankAccountDocumentNumber": "000000000000",
                        "BankAccountHolderName": "Nome do Beneficiario"
                    }
                },
                {
                    "ReceivableSettlementType": "ChangeOfOwnership",
                    "Amount": 10000,
                    "ChangeOfOwnershipDetails":{
                        "BeneficiaryDocumentNumber": "000000000",
                        "Protocol":"0c486baa-872a-4dcd-a514-b5258cbc564d" 
                    }
                },
                {
                    "ReceivableSettlementType": "LienFiduciaryAssignment", 
                    "Anticipated": true,
                    "SettlementDate": "2021-11-10",
                    "Amount": 450,
                    "AnticipationDetails": {
                        "GrossAmount": 500,
                        "AnticipatedFee": 50
                    },
                    "SettlementStatus": "Settled",         
                    "Instruction": {
                        "Ispb": 1,
                        "CompeCode": "001",
                        "AgencyNumber": "00001",
                        "AgencyDigit": "1",
                        "AccountNumber": "353535",
                        "AccountDigit": "1",
                        "AccountType": "CheckingAccount", 
                        "BankAccountDocumentNumber": "000000000000",
                        "BankAccountHolderName": "Nome do Beneficiario"
                    }
                }
            ]
        }
    ]
}
```

| Propriedade   | Tipo               | Descrição                                             |
|---------------|--------------------|-------------------------------------------------------|
| `PageIndex`   | Número                | Página atual.                                         |
| `PageSize`    | Número                | Quantidade de itens máximo por página.                |
| `PageCount`   | Número                | Quantidade de páginas.                                |
| `Items`       | Array[Receivable]  | Lista de objetos contendo informações dos recebíveis. |
| `Items[].ReceivableId`   | GUID           | Identificador único da UR.|
| `Items[].DocumentNumber`   | String            | Número de documento (CPF ou CNPJ) do proprietário da unidade de recebível.|
| `Items[].ForecastDate`     | Data              | Data prevista de pagamento. Formato YYYY-DD-MM. Ex: 2021-11-01.          |
| `Items[].Product`          | String            | Produto. Tipos possíveis: "CreditCard", "DebitCard", "BankSlip" (boleto).|
| `Items[].Brand`            | String            | Bandeira do cartão ou banco emissor do boleto.                           |
| `Items[].TotalAmount` | decimal           | Valor Total das liquidações da UR. Ex R$1,00 = 100.                           |
| `Items[].ReceivableAmount` | Número           | Valor em centavos, podendo ser negativo. Ex.: R$1,00 = 100.               |
| `Items[].AnticipatedAmount`| Número           | Valor em centavos antecipado líquido da Unidade de Recebível.             |
| `Items[].Settlements`      | Array[Settlement] | Lista de objeto contendo informações de pagamento dos recebíveis.        |
| `Items[].Settlements[].ReceivableSettlementType`                           | String  | Tipo de pagamento. Valores previstos: <br>0-Braspag<br>1-ChangeOfOwnership<br>2-LienFiduciaryAssignment<br>3-LienOthers<br>4-JudicialBlockade<br>Veja a descrição na tabela [Tipos de pagamento](https://braspag.github.io//manual/split-pagamentos-nova-api-conciliacao#tipos-de-pagamento).  |
| `Items[].Settlements[].SettlementStatus`                                   | String  | Status do pagamento. Valores previstos: <br>1-Scheduled<br>2-pending<br>3-Settled<br>4-Error<br>Veja a descrição na tabela [Status do Pagamento](https://braspag.github.io//manual/split-pagamentos-nova-api-conciliacao#status-do-pagamento).                  |
| `Items[].Settlements[].Anticipated`                                        | Boolean    | Flag para indicar informações referentes à antecipação.                                 |
| `Items[].Settlements[].Amount`                                             | String  | Valor líquido a ser pago.                                                                            |
| `Items[].Settlements[].Instruction`                                        | Instruction  | Objeto contendo as informações de pagamento efetivado ou previsto. Retorno obrigatório quando `ReceivableSettlementType` for diferente de ChangeOfOwnership (troca de titularidade).|
| `Items[].Settlements[].Instruction.Ispb`                                   | String  | Código Ispb do banco.                                                                                     |
| `Items[].Settlements[].Instruction.CompeCode`                              | String  | Código COMPE do banco.|
| `Items[].Settlements[].Instruction.AgencyDigit`                            | String  | Dígito da agência bancária.                                                                               |
| `Items[].Settlements[].Instruction.AccountNumber`                          | String  | Número da conta.                                                                                          |
| `Items[].Settlements[].Instruction.AccountDigit`                           | String  | Dígito da conta                                                                                           |
| `Items[].Settlements[].Instruction.AccountType`                            | String  | Tipo de conta. Valores possíveis:<br>1-CheckingAccount<br>2-SavingsAccount<br>3-PaymentAccount<br>4-DepositAccount<br>5-GuaranteedAccount<br>6-InvestmentAccount |
| `Items[].Settlements[].Instruction.BankAccountDocumentNumber`              | String  | Número de documento do titular da conta (CPF ou CNPJ).                                                    |
| `Items[].Settlements[].Instruction.BankAccountHolderName`                  | String  | Nome do titular da conta                                                                                  |
| `Items[].Settlements[].AnticipationDetails`                                | AnticipationDetails  | Detalhes da antecipação. Obrigatório caso Anticipated= true.                                              |
| `Items[].Settlements[].AnticipationDetails.GrossAmount`                    | Número | Valor em centavos do total bruto resultado das antecipações em centavos.                                  |
| `Items[].Settlements[].AnticipationDetails.AnticipatedFee`                 | Número | Valor em centavos do total da taxa descontado referente as antecipações.                                  |
| `Items[].Settlements[].ChangeOfOwnershipDetails`                           | ChangeOfOwnershipDetails  | Detalhes da troca de titularidade. Obrigatório caso  ReceivableSettlementType = ChangeOfOwnership                   |
| `Items[].Settlements[].ChangeOfOwnershipDetails.BeneficiaryDocumentNumber` | String  | Número do documento do titular que vai receber o valor cedido na troca de titularidade.                   |
| `Items[].Settlements[].ChangeOfOwnershipDetails.Protocol`                  | GUID    | Identificador do efeito de protocolo recebido da registradora que informou a troca de titularidade.       |
| `Items[].Settlements[].SettlementDate`                                     | Data    | Data de pagamento.|

# ANEXOS

## Eventos de Agenda

|Id| Evento Da Agenda|
|---|---|
|0| Unknown|
|1| Credit|
|2| Debit|
|3| FeeCredit|
|4| FeeDebit|
|5| RefundCredit|
|6| RefundDebit|
|7| ChargebackCredit|
|8| ChargebackDebit|
|9| UndoChargebackCredit|
|10| UndoChargebackDebit|
|11| AntiFraudFeeCredit|
|12| AntiFraudFeeDebit|
|13| AntiFraudFeeWithReviewCredit|
|14| AntiFraudFeeWithReviewDebit|
|15| AdjustmentCredit|
|16| AdjustmentDebit|
|17| ChargebackReversalCredit|
|18| ChargebackReversalDebit|
|19| AnticipationCredit|
|20| AnticipationCommissionCredit|
|21| AnticipatedInstallmentsCredit|
|22| AnticipationCommissionDebit|
|23| AnticipatedInstallmentsDebit|
|24| RefundReversalCredit|
|25| RefundReversalDebit|
|26| ReversalPayoutCredit|
|27| ReversalPayoutDebit|
|28| ReversalFeeCredit|
|29| ReversalFeeDebit|
|30| BankSlipFeeCredit|
|31| BankSlipFeeDebit|
|32| BalanceCompensationCredit|
|33| BalanceCompensationDebit|
|34| MasterBalanceCompensationCredit|
|35| MasterBalanceCompensationDebit|
|36| ReversalAntiFraudFeeCredit|
|37| ReversalAntiFraudFeeDebit|
|38| ReversalBankSlipFeeCredit|
|39| ReversalBankSlipFeeDebit|
|40| AnticipationDebit|
|41| CompensationBetweenSamePaymentArrangementDebit|
|42| ScheduleBalanceCredit|
|43| ScheduleBalanceDebit|
|44| CompensationBetweenDifferentArrangementsDebit|
|45| DebitBalanceCompensationVoid|
|46| DebitBalanceCompensationChargeback|

## Tipos de pagamento

|Valor                | Descrição |
|---------------------|-----------|
| 0-Split           | Pagamento padrão. Definido no cadastro do estabelecimento como domicílio padrão para pagamento.
| 1-ChangeOfOwnership | Troca de titularidade. Caso tenha ocorrido negociação do contrato. |
| 2-LienFiduciaryAssignment | Caso o pagamento seja resultado de aplicação de efeito de contrato do tipo "Ônus - Cessão Fiduciária"|
| 3-LienOthers        | Caso o pagamento seja resultado de aplicação de efeito de contrato do tipo "Ônus - Outros" |
| 4-JudicialBlockade  | Caso o pagamento seja resultado de aplicação de efeito de contrato do tipo "Bloqueio judicial".|

## Status do pagamento

| Valor       | Descrição |
|-------------|-----------|
| 1-Scheduled | Agendado. |
| 2-Pending   | Pendente. |
| 3-Settled   | Pago.|
| 4-Error     | Erro.     |
