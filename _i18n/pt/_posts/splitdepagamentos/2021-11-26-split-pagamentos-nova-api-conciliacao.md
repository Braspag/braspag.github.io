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
---

# Conciliação no Split de Pagamentos

A API do Split permite consultar as **unidades de recebíveis** para vendas que passaram pelo Split de Pagamentos. 

> Em breve a consulta de transações e de agenda também estarão disponíveis.

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

# Fluxo da transação até a liquidação

A captura de uma transação é a confirmação de que aquela venda foi realizada com sucesso. Assim, após a captura, uma agenda é gerada para cada evento transacional e para cada um de seus participantes (master e subordinados).

A agenda apresenta a previsão de liquidação de eventos de crédito e débito. A agenda é atualizada de acordo com os eventos transacionais.

Para fins de liquidação são geradas as Unidade de Recebíveis (URs), compostas pelo CPF/CNPJ do recebedor, arranjo de pagamento e data da previsão de liquidação.

![Exemplo Fluxo Conciliação]({{ site.baseurl_root }}/images/braspag/split/exemplo-api-conciliacao.png)

> A partir das URs, é possível consultar a agenda que foi gerada para aquele dia e identificar as transações que originaram o valor da UR.

## Transação

Veja a seguir um exemplo do fluxo transacional no Split de Pagamentos:

![Fluxo Transacional Split]({{ site.baseurl_root }}/images/braspag/split/fluxo-transacional-split.png)

O exemplo mostra uma transação que foi aprovada e capturada. No entanto, uma transação está sujeita a diversos eventos, tais como:

* Cancelamento;
* Estorno;
* Chargeback.

Os eventos que ocorrem com uma transação irão afetar a previsão de pagamento e o valor liquidado. 

A tabela a seguir apresenta três transações com diferentes arranjos de pagamento. 

![Exemplo Transação]({{ site.baseurl_root }}/images/braspag/split/exemplo-transacao.png)

## Agenda

A Agenda apresenta a previsão diária de créditos e débitos para cada participante da transação (master e subordinados), levando em conta o regime de pagamento para cada tipo de meio de pagamento:

* Crédito: em até 31 dias.
* Crédito parcelado: primeira parcela em 31 dias e demais a cada 30 dias.
* Débito: em até dois dias úteis.
* Boleto: em até dois dias úteis após a confirmação do pagamento.

> O pagamento ocorre somente em dia de expediente bancário. Os prazos do regime de pagamento podem sofrer alterações por questões operacionais da adquirente ou da Braspag.

Considere uma transação de crédito no valor de R$90,00 dividida em três parcelas. O exemplo a seguir apresenta qual seria o ciclo dessa transação, da data de captura até a data de previsão de liquidação da última parcela.

![Exemplo Agenda]({{ site.baseurl_root }}/images/braspag/split/exemplo-agenda.png)

<aside class="notice">As consultas de transações e de agenda estarão disponíveis em breve.</aside>

## Unidades de Recebíveis

As Unidades de Recebíveis (URs) estão em vigor desde 07/06/2021, com a resolução nº 4.734/2019 do Conselho Monetário Nacional (CNM) e a Circular nº 3.952/2019 do Banco Central do Brasil. Com isso, as credenciadoras e subcredenciadoras, como a Braspag, precisam registrar as URs dos estabelecimentos em uma entidade registradora que será responsável por disponibilizar as informações dos recebíveis entre instituições financeiras.

Cada UR é composta por:

* CPF ou CNPJ do recebedor;
* Arranjo de pagamento e 
* Data da liquidação.

Considere que uma loja teve três transações no dia **31 de maio**:

![Exemplo Transação]({{ site.baseurl_root }}/images/braspag/split/exemplo-transacao.png)

Os valores correspondentes a essas transações serão agrupados em Unidades de Recebíveis, respeitando as regras dos regimes de pagamento. Veja a seguir como as URs oriundas dos valores da tabela seriam compostas*:

![Exemplo UR]({{ site.baseurl_root }}/images/braspag/split/exemplo-ur.png)

*O exemplo da tabela não considerou débitos referentes a taxas.

As próximas seções deste manual apresentarão as instruções para acessar o ambiente de teste e fazer as requisições de autenticação e consulta de URs.

# Ambiente

Na API do Split, você pode usar o ambiente **Sandbox** para homologação e testes da sua integração.

Para executar uma operação:

1. Combine a **base** da URL do ambiente com o **_endpoint_** da operação desejada. Ex.: https://authsandbox.braspag.com.br/oauth2/token*.
2. Envie a requisição para a URL utilizando o método HTTP (GET, POST ou PUT) adequado à operação.

## Sandbox

|Tipo|URL Base|Descrição|
|---|---|---|
|**Braspag OAUTH2 Server**|https://authsandbox.braspag.com.br/| Para requisição de autenticação.|
|**API Split**|https://splitsandbox.braspag.com.br| Para requisições de consulta de unidade de recebíveis.|

> Solicite suas credenciais para o ambiente de teste com o nosso [Suporte](https://suporte.braspag.com.br).

<aside class="warning">Por segurança, essas credenciais não devem ser indevidamente compartilhadas ou expostas.</aside>

# Autenticação

O Split de Pagamentos utiliza como segurança o protocolo [OAuth 2.0](https://oauth.net/2/). Primeiro, você deverá obter um token de acesso, utilizando suas credenciais. 

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

<aside class="notice">O `MerchantId` é o identificador dentro da Braspag. O `ClientSecret` é a chave utilizada na autenticação.</aside>

Você deverá enviar token de acesso retornado pela API de autenticação (`access_token`) em toda requisição à API Split como uma chave de autorização. O `access_token` possui uma validade de 20 minutos, e é necessário gerar um novo token toda vez que a validade expirar.

# Consulta de Unidade de Recebíveis

A API Split permite consultar as **unidades de recebíveis** de acordo com alguns parâmetros, como intervalo de data prevista de liquidação, intervalo de data de liquidação efetiva, bandeira, produto, MerchantId, antecipação, todos os subordinados e número da página.

## Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/schedule-api/v1/receivables</span></aside>

| Parâmetro                      | Descrição                                                                             | Tipo    | Obrigatório|  
|--------------------------------|---------------------------------------------------------------------------------------|---------|------------|  
| `InitialForecastedDate`        | Intervalo de data prevista de liquidação inicial para busca.                          | Data    | Não*       |  
| `FinalForecastedDate`          | Intervalo de data prevista de liquidação final para busca.                            | Data    | Não*       | 
| `InitialSettlementDate`        | Intervalo de data de liquidação efetiva inicial para busca.                           | Data    | Não*       |  
| `FinalSettlementDate`          | Intervalo data de liquidação efetiva final para busca.                                | Data    | Não*       | 
| `Brand`                        | Bandeira que deve ser considerada na consulta (Exemplo: Visa). Por padrão, o saldo é consultado em todas as bandeiras na qual o solicitante possui recebíveis. *Consulte as bandeiras aceitas na tabela [Bandeiras](https://braspag.github.io//manual/split-pagamentos-nova-api-conciliacao#bandeiras)*                      | String  | Não        |  
| `Product`                      | Produto que deve ser considerado na consulta (CreditCard, DebitCard ou BankSlip). Por padrão, são retornadas informações de todas as bandeiras na qual o solicitante possui recebíveis.                                                                    | String  | Não        |
| `MerchantId`                   | Id do Merchant que deseja consultar as informações. Serão retornadas informações referentes ao número de documento do cadastro| Guid   | Não|  
| `Anticipation`                 | Flag para informar se deseja consultar apenas informações referentes à antecipação    | Boolean    | Não        |  
| `IncludeAllSubordinates`       | Determina se serão incluídas informações dos subordinados que realizaram o *optin* para o master consultar as informações.| Boolean | Não |  
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
            "DocumentNumber": "000000000000",
            "ForecastDate": "2021-11-16",
            "Product": "CreditCard",
            "Brand": "Visa",
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
                        "Ispb": "1",
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
                        "Ispb": "1",
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
                        "Ispb": "1",
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
| `Items[].DocumentNumber`   | String            | Número de documento (CPF ou CNPJ) do proprietário da unidade de recebível |
| `Items[].ForecastDate`     | Data              | Data prevista de liquidação. Formato YYYY-DD-MM. Ex: 2021-11-01.          |
| `Items[].Product`          | String            | Produto. Tipos possíveis: "CreditCard", "DebitCard", "BankSlip" (boleto). |
| `Items[].Brand`            | String            | Bandeira do cartão ou banco emissor do boleto.                            |
| `Items[].ReceivableAmount` | Número           | Valor em centavos, podendo ser negativo. Ex R$1,00 = 100                  |
| `Items[].AnticipatedAmount`| Número           | Valor em centavos antecipado líquido da Unidade de Recebível.             |
| `Items[].Settlements`      | Array[Settlement] | Lista de objeto contendo informações de liquidação dos recebíveis.        |
| `Items[].Settlements[].ReceivableSettlementType`                           | String  | Tipo de liquidação. Valores previstos: <br>0-Braspag<br>1-ChangeOfOwnership<br>2-LienFiduciaryAssignment<br>3-LienOthers<br>4-JudicialBlockade<br>Veja a descrição na tabela [Tipos de liquidação](https://braspag.github.io//manual/split-pagamentos-nova-api-conciliacao#tipos-de-liquida%C3%A7%C3%A3o).  |
| `Items[].Settlements[].SettlementStatus`                                   | String  | Status da liquidação. Valores previstos: <br>1-Scheduled<br>2-pending<br>3-Settled<br>4-Error<br>Veja a descrição na tabela [Status da liquidação](https://braspag.github.io//manual/split-pagamentos-nova-api-conciliacao#status-da-liquida%C3%A7%C3%A3o).                  |
| `Items[].Settlements[].Anticipated`                                        | Boolean    | Flag para indicar informações referentes à antecipação.                                 |
| `Items[].Settlements[].Amount`                                             | String  | Valor líquido a ser liquidado.                                                                            |
| `Items[].Settlements[].Instruction`                                        | Objeto  | Objeto contendo as informações de liquidação efetivada ou prevista. Retorno obrigatório quando `ReceivableSettlementType` for diferente de ChangeOfOwnership (troca de titularidade).|
| `Items[].Settlements[].Instruction.Ispb`                                   | String  | Código Ispb do banco.                                                                                     |
| `Items[].Settlements[].Instruction.AgencyDigit`                            | String  | Dígito da agência bancária.                                                                               |
| `Items[].Settlements[].Instruction.AccountNumber`                          | String  | Número da conta.                                                                                          |
| `Items[].Settlements[].Instruction.AccountDigit`                           | String  | Dígito da conta                                                                                           |
| `Items[].Settlements[].Instruction.AccountType`                            | String  | Tipo de conta. Valores possíveis:<br>1-CheckingAccount<br>2-SavingsAccount<br>3-PaymentAccount<br>4-DepositAccount<br>5-GuaranteedAccount<br>6-InvestmentAccount |
| `Items[].Settlements[].Instruction.BankAccountDocumentNumber`              | String  | Número de documento do titular da conta (CPF ou CNPJ).                                                    |
| `Items[].Settlements[].Instruction.BankAccountHolderName`                  | String  | Nome do titular da conta                                                                                  |
| `Items[].Settlements[].AnticipationDetails`                                | Objeto  | Detalhes da antecipação. Obrigatório caso Anticipated= true.                                              |
| `Items[].Settlements[].AnticipationDetails.GrossAmount`                    | Número | Valor em centavos do total bruto resultado das antecipações em centavos.                                  |
| `Items[].Settlements[].AnticipationDetails.AnticipatedFee`                 | Número | Valor em centavos do total da taxa descontado referente as antecipações.                                  |
| `Items[].Settlements[].ChangeOfOwnershipDetails`                           | Objeto  | Detalhes da troca de titularidade. Obrigatório caso  ReceivableSettlementType = ChangeOfOwnership                   |
| `Items[].Settlements[].ChangeOfOwnershipDetails.BeneficiaryDocumentNumber` | String  | Número do documento do titular que vai receber o valor cedido na troca de titularidade.                   |
| `Items[].Settlements[].ChangeOfOwnershipDetails.Protocol`                  | GUID    | Identificador do efeito de protocolo recebido da registradora que informou a troca de titularidade.       |
| `Items[].Settlements[].SettlementDate`                                     | Data    | Data de liquidação.|

# ANEXOS

## Bandeiras para consulta

|Bandeiras|
|---|
|Visa, Master, Amex, Elo, Diners, Discover e Hipercard.|

## Tipos de Liquidação

|Valor                | Descrição |
|---------------------|-----------|
| 0-Braspag           | Liquidação padrão. Definida no cadastro do estabelecimento como domicílio padrão para liquidação.
| 1-ChangeOfOwnership | Troca de titularidade. Caso tenha ocorrido negociação do contrato. |
| 2-LienFiduciaryAssignment | Caso a liquidação seja resultado de aplicação de efeito de contrato do tipo "Ônus - Cessão Fiduciária"|
| 3-LienOthers        | Caso a liquidação seja resultado de aplicação de efeito de contrato do tipo "Ônus - Outros" |
| 4-JudicialBlockade  | Caso a liquidação seja resultado de aplicação de efeito de contrato do tipo "Bloqueio judicial".|

## Status da Liquidação

| Valor       | Descrição |
|-------------|-----------|
| 1-Scheduled | Agendado. |
| 2-Pending   | Pendente. |
| 3-Settled   | Liquidado.|
| 4-Error     | Erro.     |
