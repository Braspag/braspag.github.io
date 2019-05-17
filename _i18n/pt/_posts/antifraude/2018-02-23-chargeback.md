---
layout: manual
title: Chargeback API - Manual de integração
description: Integração técnica Chargeback API Braspag
search: true
categories: manual
tags:
  - Gestão de Risco
language_tabs:
  json: JSON
  html: HTML
---

# Visão Geral

Chargeback API foi desenvolvida pelo time de Risco da Braspag para os clientes informarem os chargebacks de transações analisadas pelo antifraude, consultar chargeback, realizar envio de arquivos para contestação de chargeback e acatar um chargeback.

A retroalimentação de chargeback ao provedor de antifraude, proporciona:

- Melhoria na performance das decisões automáticas - Uma vez que dados marcados na transação em que ocorreu o chargeback são adicionados à lista negativa, é possível realizar regras mais rigorosas provendo um ganho na estratégia;
- Maior assertividade para equipes de revisão manual - Quando uma transação é marcada como chargeback, ela recebe um rótulo que fica visível para pesquisas posteriores que incluem pesquisas por “transações similares” (recurso bastante utilizado por equipes de revisão manual de transações tanto da Cybersource quanto próprias).  

A API é baseada em arquitetura REST, que trocam dados em formato JSON seguindo fluxos de autorização definidos pelo protocolo OAuth 2, onde todos os padrões são amplamente utilizados pelo mercado e suportado pelas comunidades técnicas.

> Para saber mais sobre OAuth 2, consulte [https://oauth.net/2/](https://oauth.net/2/)

# Objetivo

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a Chargeback API Braspag, descrevendo as operações disponíveis com exemplos de requisições e respostas.

Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

# Hosts

## API BraspagAuth

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\authsandbox.braspag.com.br\\\|
|`Produção`|https:\\\\auth.braspag.com.br\\\|

## Chargeback API Braspag

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\chargebacksandbox.braspag.com.br\\\|
|`Produção`|https:\\\\chargeback.braspag.com.br\\\|

# Autenticação

## Tokens de Acesso

A Charegabck API Braspag utiliza o protocolo padrão de mercado OAuth 2.0 para autorização de acesso a seus recursos específicos por ambientes, que são: **Sandbox** e **Produção**.

Esta sessão descreve o fluxo necessário para que aplicações cliente obtenham tokens de acesso válidos para uso na API.

## Obtenção do token de acesso  

O token de acesso é obtido através do fluxo oauth **client_credentials**. O diagrama abaixo, ilustra, em ordem cronológica, a comunicação que se dá entre a **Aplicação Cliente**, a **API BraspagAuth** e a **Chargeback API**.

1. A **Aplicação Cliente**, informa à API **BraspagAuth** sua credencial.

2. O **BraspagAuth** valida a credencial recebida. Se for válida, retorna o token de acesso para a **Aplicação Cliente**.

3. A **Aplicação Cliente** informa o token de acesso no cabeçalho das requisições HTTP feitas à **Chargeback API**.

4. Se o token de acesso for válido, a requisição é processada e os dados são retornados para a **Aplicação Cliente**.

> Solicite uma credencial abrindo um ticket através da nossa ferramenta de suporte, enviando o(s) IP(s) de saída dos seus servidores de homologação e produção.
[Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br)

## Como obter o token

Uma vez em posse da credencial, será necessário "codificá-la" em Base64, utilizando a convenção **client_id:client_secret**, e enviar o resultado no cabeçalho através do campo **Authorization**.

Exemplo:
* client_id: **braspagtestes**
* client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* String a ser codificada em Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**
* Resultado após a codificação: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**

### Request

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no corpo (Body)**

|Key|Value|
|:-|:-|
|`scope`|ChargebackApp|
|`grant_type`|client_credentials|

### Response

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|
|:-|:-|
|`access_token`|O token de acesso solicitado. O aplicativo pode usar esse token para se autenticar no recurso protegido, no caso a Chargeback API|
|`token_type`|Indica o valor do tipo de token|
|`expires_in`|Expiração do o token de acesso, em segundos <br/>O token quando expirar, é necessário obter um novo|

# Retroalimentação

## Via API

### Request

<aside class="request"><span class="method post">POST</span><span class="endpoint">chargebacknotification</span></aside>

``` json
{
   "Chargebacks":
   [
      {
         "Amount": 1000,
         "Date": "2017-12-02",
         "Comment": "Esta transação sofreu chargeback relacionada a não reconhecimento de compra por parte do portador do cartão.",
         "ReasonCode": "123",
         "ReasonMessage": "DEB NAO REC DE COMPRA",
         "IsFraud": "true"
         "NegativeValues":
         [
            "CustomerIpAddress",
            "CustomerDocumentNumber"
         ],
         "Transaction":
         {
            "Id": "fb647240-824f-e711-93ff-000d3ac03bed",
            "Tid": "123456789012345678AB",
            "Nsu": "12345678",
            "AuthorizationCode": "123456",
            "SaleDate": "2017-10-15",
            "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b"
         }
      }
   ]
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`Chargebacks[n].Amount`|Valor do chargeback <br/> Ex.: 150000 Ex: 123456 = r$ 1.234,56|long|sim|-|
|`Chargebacks[n].Date`|Data da confirmação do chargeback <br/> Ex.: 2017-12-02|date|sim|-|
|`Chargebacks[n].Comment`|Comentário que deseja associar ao chargeback que ficará visível no Admin Braspag <br/> Se chargeback de transação Cybersource, este comentário ficará visível no backoffice da Cybersource|string|não|512|
|`Chargebacks[n].ReasonCode`|Código do motivo do chargeback|string|sim|8|
|`Chargebacks[n].ReasonMessage`|Mensagem do motivo do chargeback|string|sim|128|
|`Chargebacks[n].IsFraud`|Identifica se o chargeback foi por motivo de fraude|bool|não|-|
|`Chargebacks[n].NegativeValues`|Parâmetros que deseja incluir na lista negativa <br/> Os parâmetros que serão incluídos devem ser acordados com o analista de risco da Cybersource, pois pode impactar diretamente na estratégia de risco - [Tabela 1]({{ site.baseurl_root }}manual/chargeback#tabela-1)|enum|não|-|
|`Chargebacks[n].Transaction.Id`|Id da transação no Antifraude <br/> Este campo se torna obrigatório se o campo `BraspagTransactionId` não for enviado e se os campos `Tid`, `Nsu`, `AuthorizationCode` e `SaleDate` (todos juntos) não forem enviados <br/><br/> **IMPORTANTE** <br/> **SE A SUA INTEGRAÇÃO COM O ANTIFRAUDE É VIA SOAP E DIRETA, O CAMPO `Id` SE TORNA OBRIGATÓRIO, INDEPENDENTE DE QUALQUER OUTRO CAMPO QUE POSSA IDENTIFICAR A TRANSAÇÃO, COMO: `Tid`, `Nsu`, `AuthorizationCode` e `BraspagTransactionId`**<br/>|Guid|não|-|
|`Chargebacks[n].Transaction.Tid`|Identificador da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Nsu`, `AuthorizationCode` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|20|
|`Chargebacks[n].Transaction.Nsu`|Número sequencial único da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Tid`, `AuthorizationCode` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|10|
|`Chargebacks[n].Transaction.AuthorizationCode`|Código de autorização da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Tid`, `Nsu` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|10|
|`Chargebacks[n].Transaction.SaleDate`|Data da venda da transação <br/> Ex.: 2017-10-15 <br/> Este campo se torna obrigatório juntamente com `Tid`, `Nsu` e `AuthorizationCode` se os campos `Id` e `BraspagTransactionId` não forem enviados|date|não|-|
|`Chargebacks[n].Transaction.BraspagTransactionId`|Id da transação no Pagador Braspag <br/> Este campo se torna obrigatório se o campo `AntifraudTransactionId` não for enviado e se os campos `Tid`, `Nsu`, `AuthorizationCode` e `SaleDate` (todos juntos) não forem enviados|Guid|não|-|

### Response

``` json
{
   "Chargebacks":
   [
      {
         "Amount": 1000,
         "Date": "2017-12-02",
         "Comment": "Esta transação sofreu chargeback relacionada a não reconhecimento de compra por parte do portador do cartão.",
         "ReasonCode": "123",
         "ReasonMessage": "DEB NAO REC DE COMPRA",
         "IsFraud": "true"
         "NegativeValues":
         [
            "CustomerIpAddress",
            "CustomerDocumentNumber"
         ],
         "Transaction":
         {
            "Id": "fb647240-824f-e711-93ff-000d3ac03bed",
            "Tid": "123456789012345678AB",
            "Nsu": "12345678",
            "AuthorizationCode": "123456",
            "SaleDate": "2017-10-15",
            "BraspagTransactionId": "a3e08eb2-2144-4e41-85d4-61f1befc7a3b"
         },
         "Result":
         {
            "ProcessingStatus": "NotFound",
            "ErrorMessages":
            [
                "Could not find any transaction."
            ]
         }
      }
   ]
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|300 Multiple Choices|

**Parâmetros no corpo (Body)**

|Parâmetro|Descrição|Tipo|
|`Result.ProcessingStatus`|Status do processamento do chargeback - [Tabela 2]({{ site.baseurl_root }}manual/chargeback#tabela-2-result.processingstatus)|enum|
|`Result.ErrorMessages`|Mensagens de erro para chargebacks não processados|string|

## Via Admin Braspag

Nesta seção será explicado passo a passo como realizar o upload do arquivo de chargeback via Admin Braspag.

### Passo 1 - Acessando o Admin Braspag

Para acessar o Admin Braspag, digitar no browser de sua preferência a URL de acordo com o ambiente desejado, conforme abaixo:

|Ambiente|URL|
|Sandbox|https://adminsandbox.braspag.com.br|
|Produção|https://admin.braspag.com.br|

> Caso não possua um usuário para o ambiente desejado, solicite a criação do mesmo através da nossa ferramenta de suporte.
[Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br)

### Passo 2 - Acessando a tela de Upload de Arquivo de Chargeback

Para realizar o upload do arquivo de chargeback, você deverá acessar a tela através do menu: `Configurações -> Upload de Arquivo de Chargeback`

![Upload de Arquivo de Chargeback]({{ site.baseurl_root }}/images/braspag/af/acesso.png){: .centerimg }{:title="Acessando a tela de Upload de Arquivo de Chargeback"}  

### Passo 3 - Construindo o arquivo de chargeback no formato CSV

Neste passo será explicado como construir um arquivo no formato CSV (Comma-separated values - Valores separados por vírgula) com os dados do chargeback.

CSV é um formato de arquivo que contém valores separados por algum delimitador, vígula (,) por exemplo. Pode ser criado em qualquer editor de texto e lido em uma planilha de textos, como por exemplo, o excel. A planilha eletrônica irá dividir em linha/coluna cada item do arquivo separados por vírgula (,).

Você poderá realizar o download de um arquivo de template através da opção disponibilizada na tela de Upload de Arquivo de Chargeback, conforme print abaixo:
![Upload de Arquivo de Chargeback]({{ site.baseurl_root }}/images/braspag/af/teladownloadtemplatecbk.png){: .centerimg }{:title="Download template arquivo CSV"}

O CSV que será construído com dos dados de chargeback deverá ter o layout abaixo, seguindo o tipo e obrigatoriedade de cada campo.
> Amount,Date,Comment,ReasonCode,ReasonMessage,IsFraud,Id,Tid,Nsu,AuthorizationCode,SaleDate,BraspagTransactionId,NegativeValues

|Parâmetro|Descrição|Tipo|Obrigatório|Tamanho|
|:-|:-|:-:|:-:|-:|
|`Amount`|Valor do chargeback <br/> Ex.: 150000 Ex: 123456 = r$ 1.234,56|long|sim|-|
|`Date`|Data da confirmação do chargeback <br/> Ex.: 2017-12-02|date|sim|-|
|`Comment`|Comentário que deseja associar ao chargeback que ficará visível no Admin Braspag <br/> Se chargeback de transação Cybersource, este comentário ficará visível no backoffice da Cybersource|string|não|512|
|`ReasonCode`|Código do motivo do chargeback|string|sim|8|
|`ReasonMessage`|Mensagem do motivo do chargeback|string|sim|128|
|`IsFraud`|Identifica se o chargeback foi por motivo de fraude|bool|não|-|
|`NegativeValues`|Parâmetros que deseja incluir na lista negativa <br/> Os parâmetros que serão incluídos devem ser acordados com o analista de risco da Cybersource, pois pode impactar diretamente na estratégia de risco - [Tabela 1]({{ site.baseurl_root }}manual/chargeback#tabela-1-chargebacks[n].negativevalues)|enum|não|-|
|`Id`|Id da transação no Antifraude <br/> Este campo se torna obrigatório se o campo `BraspagTransactionId` não for enviado e se os campos `Tid`, `Nsu`, `AuthorizationCode` e `SaleDate` (todos juntos) não forem enviados <br/><br/> **IMPORTANTE** <br/> **SE A SUA INTEGRAÇÃO COM O ANTIFRAUDE É VIA SOAP E DIRETA, O CAMPO `Id` SE TORNA OBRIGATÓRIO, INDEPENDENTE DE QUALQUER OUTRO CAMPO QUE POSSA IDENTIFICAR A TRANSAÇÃO, COMO: `Tid`, `Nsu`, `AuthorizationCode` e `BraspagTransactionId`**<br/>|Guid|não|-|
|`Tid`|Identificador da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Nsu`, `AuthorizationCode` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|20|
|`Nsu`|Número sequencial único da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Tid`, `AuthorizationCode` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|10|
|`AuthorizationCode`|Código de autorização da transação na adquirente <br/> Este campo se torna obrigatório juntamente com `Tid`, `Nsu` e `SaleDate` se os campos `Id` e `BraspagTransactionId` não forem enviados|string|não|10|
|`SaleDate`|Data da venda da transação <br/> Ex.: 2017-10-15 <br/> Este campo se torna obrigatório juntamente com `Tid`, `Nsu` e `AuthorizationCode` se os campos `Id` e `BraspagTransactionId` não forem enviados|date|não|-|
|`BraspagTransactionId`|Id da transação no Pagador Braspag <br/> Este campo se torna obrigatório se o campo `AntifraudTransactionId` não for enviado e se os campos `Tid`, `Nsu`, `AuthorizationCode` e `SaleDate` (todos juntos) não forem enviados|Guid|não|-|

### Passo 4 - Enviando o arquivo de chargeback

Com o arquivo já construído, e realizando os passos 1 e 2, agora é selecionar o arquivo e enviá-lo, conforme print abaixo:

![Upload de Arquivo de Chargeback]({{ site.baseurl_root }}/images/braspag/af/tela.png){: .centerimg }{:title="Tela de Upload de Arquivo de Chargeback"}  

1 - Clique no botão `Choose File` para selecionar o arquivo na máquina local.  
2 - Com o arquivo selecionado, clique no botão `Enviar` para realizar o upload do arquivo.

### Passo 5 - Verificando o resultado do envio do arquivo de chargeback

Após realizar todos os passos acima, o arquivo será processado e através da seção Resultado será possível verificar o resultado do processamento.  

Em caso de sucesso, será apresentada a mensagem de **Operação realizada com sucesso** e um ID que é o comprovante do upload do arquivo.  

Em caso de alguma falha, será apresentada a mensagem de **Operação parciamente concluída. Favor verificar a seção Resultado** e também um ID que é o comprovante do upload do arquivo, conforme print abaixo:

![Upload de Arquivo de Chargeback]({{ site.baseurl_root }}/images/braspag/af/uploadparcial.png){: .centerimg }{:title="Upload parcialmente processado"}  

Neste caso, é possível verificar os erros encontrados em cada linha, tratar e reenviar o arquivo.

# Consultas

### Request

<aside class="request"><span class="method get">GET</span><span class="endpoint">chargeback?CaseNumber={CaseNumber}&AcquirerTransactionId={AcquirerTransactionId}&BraspagTransactionId={BraspagTransactionId}&StartDate={StartDate}&EndDate={EndDate}&PageIndex={PageIndex}&PageSize={PageSize}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|não|
|`AcquirerTransactionId`|Identificador da transação na adquirente (TID)|não|
|`BraspagTransactionId`|Id da transação na plataforma Pagador Braspag ou Cielo 3.0 (PaymentId)|não|
|`ProviderTransactionId`|Identificador da transação no provedor de Antifraude|não|
|`AntifraudeTransactionId`|Identificador da transação no Antifraude Braspag|não|
|`StartDate`|Data início da consulta|não|
|`EndDate`|Data fim da consulta|não|
|`PageIndex`|Número da página desejada|sim|
|`PageSize`|Quantidade de itens desejado na página. Máximo 250 itens.|sim|

### Response

```json
{
    "PageIndex": 1,
    "PageSize": 250,
    "Total": 500,
    "Chargebacks":
    [
        {
            "Id": "fd14e3fb-cf2a-4228-b690-1338660afc54",
            "CreatedDate": "2018-09-01 09:51:25",
            "Date": "2018-08-30",
            "CaseNumber": "000001",
            "Amount": 10000,
            "ReasonCode": "28",
            "ReasonMessage": "Consumidor nao reconhece a compra",
            "Status": "Received",
            "Comment": "Cliente enviou documentos inválidos",
            "IsFraud": true,
            "Transaction":
            {
                "AcquirerType": "Cielo",
                "EstablishmentCode": "1234567890",
                "MerchantOrderId": "abc123efg",
                "Tid": "1234567890BA2018XPTO",
                "Nsu": "258654",
                "AuthorizationCode": "T85245",
                "SaleDate": "2018-08-15",
                "PagadorMerchantId": "a1052460-92b2-49c3-a929-fc985df0ba2f",
                "BraspagTransactionId": "bb33b5c5-82fe-4254-9f1d-b9c97297b0d5",
                "Amount": 10000,
                "CardHolder": "JOAO D COUVES",
                "MaskedCardNumber": "453906******8385",
                "Brand": "Visa",
                "AntifraudMerchantId": "4b1b017a-a8b5-4e83-ae36-19c69f11845e",
                "AntifraudTransactionId": "9f6ec028-b55d-4605-b655-164ce62aeaef",
                "AntifraudSourceApplication": "Gateway",
                "ProviderTransactionId": "5446494501496896403073",
                "NegativeValues": [
                    "CustomerDocumentNumber",
                    "ShippingStreet"
                ], 
                "ProviderChargebackMarkingEvent": {
                    "Id": "5446495589216876903021",
                    "Status": "ACCEPT",
                    "Code": "100",
                }
            }
        }
    ]
}
```

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`Id`|Id do chargeback na Chargeback API Braspag|guid|
|`CreatedDate`|Data de criação do chargeback na Chargeback API Braspag <br/> Ex.: 2018-09-01 09:51:25|date|
|`Date`|Data do chargeback <br/> Ex.: 2018-08-30|date|
|`CaseNumber`|Número do caso relacionado ao chargeback|guid|
|`Amount`|Valor do chargeback em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`ReasonCode`|Código do motivo do chargeback|string|
|`ReasonMessage`|Descrição do motivo do chargeback|string|
|`Status`|Status do charegabck na Braspag - [Tabela 3]({{ site.baseurl_root }}manual/chargeback#tabela-3-chargebacks[n].status)|string|
|`Comment`|Comentário que deseja associar ao chargeback e que ficará visível no Backoffice Braspag <br/> Se chargeback de transação Cybersource, este comentário ficará visível no backoffice da Cybersource|string|
|`IsFraud`|Identifica se o chargeback é de fraude|bool|
|`Transaction.AcquirerType`|Identificador da adquirentre|string|
|`Transaction.EstablishmentCode`|Número do estabelecimento ou afiliação na adquirente|string|
|`Transaction.MerchantOrderId`|Número do pedido da loja|string|
|`Transaction.Tid`|Id da transação na adquirente|string|
|`Transaction.Nsu`|Número sequencial único da transação na adquirente|string|
|`Transaction.AuthorizationCode`|Código de autorização da transação na adquirente|string|
|`Transaction.SaleDate`|Data da autorização da transação na adquirente <br/> Ex.: 2018-08-15|date|
|`Transaction.PagadorMerchantId`|Identificador da loja na plataforma Pagador Braspag ou Cielo 3.0|guid|
|`Transaction.BraspagTransactionId`|Id da transação na plataforma Pagador Braspag ou Cielo 3.0 (PaymentId)|guid|
|`Transaction.Amount`|Valor da transação em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`Transaction.CardHolder`|Nome do cartão de crédito|string|
|`Transaction.MaskedCardNumber`|Número do cartão de crédito mascarado|string|
|`Transaction.Brand`|Bandeira do cartão de crédito|string|
|`Transaction.AntifraudMerchantId`|Identificador da loja na plataforma Antifraude Legado ou Antifraude Gateway|guid|
|`Transaction.AntifraudTransactionId`|Identificador da transação na plataforma Antifraude Legado ou Antifraude Gateway|guid|
|`Transaction.AntifraudSourceApplication`|Origem da plataforma de antifraude - [Tabela 6]({{ site.baseurl_root }}manual/chargeback#tabela-6-chargebacks[n].transaction.antifraudsourceapplication)|string|
|`Transaction.ProviderTransactionId`|Id da transação no provedor de antifraude|
|`Transaction.NegativeValues`|Parâmetros que foram incluídos na lista negativa quando transação de antifraude for Cybersource <br/> Os parâmetros são concatenados usando o caracter , <br/> Ex.: CustomerDocumentNumber, ShippingStreet <br> - [Tabela 1]({{ site.baseurl_root }}manual/chargeback#tabela-1-chargebacks[n].negativevalues)|string|
|`Transaction.ProviderChargebackMarkingEvent.Id`|Id do evento de marcação da transação que sofreu o chargeback. Apenas Cybersource|string|
|`Transaction.ProviderChargebackMarkingEvent.Status`|Status do evento de marcação da transação que chargeback. Apenas Cybersource - [Tabela 4]({{ site.baseurl_root }}manual/chargeback#tabela-4-chargebacks[n].transaction.providerchargebackmarkingevent.status)|string|
|`Transaction.ProviderChargebackMarkingEvent.Code`|Código de retorno do evento de marcação da transação que sofreu chargeback. Apenas Cybersouce - [Tabela 5]({{ site.baseurl_root }}manual/chargeback#tabela-5-chargebacks[n].transaction.providerchargebackmarkingevent.code)|string|

# Aceitação

## Aceitando um chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "CaseNumber": "000001",
    "Status": 2,
    "StatusDescription": "AcceptedByMerchant"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`CaseNumber`|Número do caso relacionado ao chargeback|
|`Status`|Status da aceitação do chargeback - Tabela 4|
|`StatusDescription`|Descrição do status da aceitação do chargeback|

## Aceitando um chargeback inexistente

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback não foi encontrado|
|`Message`|Mensagem que o chargeback não foi encontrado|

## Aceitando um chargeback aceito anteriormente

<aside class="request"><span class="method post">POST</span><span class="endpoint">acceptance/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Código do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback foi aceito ou contestado anteriomente|
|`Message`|Mensagem que o chargeback foi aceito ou contestado anteriormente|

# Contestação

## Contestando um chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

**Parâmetros no corpo (Body)**

|Key|Value|Obrigatório|
|:-|:-|:-|
|`Content-Type`|form-data||
||Arquivos extensão tif <br/> O arquivo deve possuir como nome o número do caso relacionado ao chargeback. Ex.: CaseNumber = 0000001 - File = 0000001.tif <br/> O arquivo deverá ser multi-page de no máximo 7mb de tamanho|Sim|

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

## Contestando um chargeback inexistente

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Número do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackNotFounded",
    "Message": "Chargeback not found"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback não foi encontrado|
|`Message`|Mensagem que o chargeback não foi encontrado|

## Contestando um chargeback contestado anteriormente

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Código do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "ChargebackAlreadyUpdated",
    "Message": "Chargeback already updated"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback foi contestado ou aceito anteriomente|
|`Message`|Mensagem que o chargeback foi contestado ou aceito anteriormente|

## Contestando um chargeback com nome do arquivo diferente do CaseNumber

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Código do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "InvalidFileName",
    "Message": "Invalid file name"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback está com nome inválido, diferente do CaseNumber|
|`Message`|Mensagem que o chargeback está com nome inválido, diferente do CaseNumber|

## Contestando um chargeback e não enviando o arquivo de contestação

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Código do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "FileNotFound",
    "Message": "File not found"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback não foi enviado o arquivo de contestação|
|`Message`|Mensagem que o chargeback não foi enviado o arquivo de contestação|

## Contestando um chargeback enviando o arquivo de contestação com extensão diferente de tif

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Código do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "InvalidFileExtension",
    "Message": "Invalid file extension"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback foi enviado o arquivo de contestação com extensão inválida, diferente de tif|
|`Message`|Mensagem que o chargeback foi enviado o arquivo de contestação com extensão inválida, diferente de tif|

## Contestando um chargeback enviando o arquivo de contestação com tamanho maior que 7mb

<aside class="request"><span class="method post">POST</span><span class="endpoint">contestation/{CaseNumber}</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|Descrição|Obrigatório|
|:-|:-|:-|:-|
|`Content-Type`|application/json|Tipo do conteúdo da requisição|sim|
|`Authorization`|Bearer {access_token}|Tipo do conteúdo da requisição|sim|
|`EstablishmentCode`|xxxxxxxxxx|Código do estabelecimento ou afiliação na adquirente|sim|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|Identificador da requisição|sim|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

``` json
{
    "Code": "InvalidFileLength",
    "Message": "Invalid file length"
}
```

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|400 Bad Request|

**Parâmetros no body (Corpo)**

|Key|Value|
|:-|:-|
|`Code`|Código que o chargeback foi enviado o arquivo de contestação com tamanho superior a 7mb|
|`Message`|Mensagem que o chargeback foi enviado o arquivo de contestação com tamanho superior a 7mb|

# Tabelas

## Tabela 1 - Chargebacks[n].NegativeValues

Possíveis valores a serem inseridos na lista negativa na Cybersource.

|Valor|Descrição|
|:-|:-|
|CustomerDocumentNumber|Número do documento do comprador, CPF ou CNPJ|
|CustomerIpAddress|Endereço de IP do comprador|
|CustomerPhone|Número de telefone do comprador|
|ShippingStreet|Logradouro do endereço de entrega|
|DeviceFingerprintSmartId|Fingerprint do dispositivo do comprador|

## Tabela 2 - Result.ProcessingStatus

Possíveis retornos do chargeback enviado.

|Valor|Descrição|
|:-|:-|
|AlreadyExist|Transação já marcada com chargeback anteriormente|
|Remand|Chargeback deverá ser reenviado|
|NotFound|Transação na encontrada na base de dados para os valores enviados nos campos do nó `Transaction`|

## Tabela 3 - Chargebacks[n].Status

Possíveis valores do chargeback.

|Valor|Descrição|
|:-|:-|
|Received|Chargeback recebido da adquirente|
|AcceptedByMerchant|Chargeback aceito pela loja. Neste caso a loja entende que sofreu de fato um chargeback e não irá realizar a disputa|
|ContestedByMerchant|Chargeback contestado pela loja. Neste caso a loja enviou os documentos necessários para tentar reverter o chargeback|

## Tabela 4 - Chargebacks[n].Transaction.ProviderChargebackMarkingEvent.Status

|Valor|Descrição|Provider|
|:-|:-|:-|
|ACCEPT|Marcação de chargeback aceita no provedor|Cybersource|
|REJECT|Marcação de chargeback rejeitada no provedor|Cybesource|

## Tabela 5 - Chargebacks[n].Transaction.ProviderChargebackMarkingEvent.Code

|Valor|Descrição|Provider|
|:-|:-|:-|
|100|Operação realizada com sucesso|Cybersource|
|150|Erro interno <br/> Possível ação: Aguarde alguns minutos e tente reenviar a marcação de chargeback|Cybersource|
|151|A marcação de chargeback foi recebida, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor <br/> Possível ação: Aguarde alguns minutos e tente reenviar|Cybersource|
|152|A marcação de chargeback foi recebida, mas ocorreu time-out <br/> Possível ação: Aguarde alguns minutos e tente reenviar|Cybersource|
|234|Problema com a configuração da loja na Cybersource <br/> Possível ação: Entre em contato com o suporte para corrigir o problema de configuração|Cybersource|

## Tabela 6 - Chargebacks[n].Transaction.AntifraudSourceApplication

|Valor|Descrição|Provider|
|:-|:-|
|Gateway|Antifraude Gateway|
|Legacy|Antifraude Legado|