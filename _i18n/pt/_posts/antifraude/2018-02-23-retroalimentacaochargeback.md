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

Chargeback API foi desenvolvida pelo time de Risco da Braspag para os clientes informarem os chargebacks de transações analisadas pelo antifraude, consultar chargeback, realizar envio de arquivos para disputa de chargeback e acatar um chargeback.

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
|`Sandbox`|https:\\\\authsandbox.braspag.com.br|
|`Produção`|https:\\\\auth.braspag.com.br|

## Chargeback API Braspag

|Ambiente|URL|
|:-|:-|
|`Sandbox`|https:\\\\chargebacksandbox.braspag.com.br|
|`Produção`|https:\\\\chargeback.braspag.com.br|

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
|`Chargebacks[n].NegativeValues`|Parâmetros que deseja incluir na lista negativa <br/> Os parâmetros que serão incluídos devem ser acordados com o analista de risco da Cybersource, pois pode impactar diretamente na estratégia de risco - [Tabela 1]({{ site.baseurl_root }}manual/retroalimentacaochargeback#tabela-1)|enum|não|-|
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
|`Result.ProcessingStatus`|Status do processamento do chargeback - [Tabela 2]({{ site.baseurl_root }}manual/retroalimentacaochargeback#tabela-2-result.processingstatus)|enum|
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
|`NegativeValues`|Parâmetros que deseja incluir na lista negativa <br/> Os parâmetros que serão incluídos devem ser acordados com o analista de risco da Cybersource, pois pode impactar diretamente na estratégia de risco - [Tabela 1]({{ site.baseurl_root }}manual/retroalimentacaochargeback#tabela-1-chargebacks[n].negativevalues)|enum|não|-|
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

## Consultando uma transação

### Request

<aside class="request"><span class="method get">GET</span><span class="endpoint">chargeback?CaseNumber={CaseNumber}&AcquirerTransactionId={AcquirerTransactionId}&BraspagTransactionId={BraspagTransactionId}&StartDate={StartDate}&EndDate={EndDate}&PageIndex={PageIndex}&PageSize={PageSize}</span></aside>

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|não|
|`AcquirerTransactionId`|Identificador da transação na adquirente (TID)|não|
|`BraspagTransactionId`|Identificador da transação na Braspag|não|
|`StartDate`|Data início da consulta|não|
|`EndDate`|Data fim da consulta|não|
|`PageIndex`|Número da página desejada|sim|
|`PageSize`|Quantidade de itens desejado na página|sim|

### Response

```json
{
    "PageIndex": 1,
    "PageSize": 250,
    "Total": 1
    "Chargebacks":
    [
        {
            "Id": "fd14e3fb-cf2a-4228-b690-1338660afc54",
            "AcquirerType": "Cielo",
            "EstablishmentCode": "TesteAffiliationBp",
            "CaseNumber": "000001",
            "Amount": 10000,
            "PurchaseAmount": 10000,
            "PurchaseDate": "2018-09-13",
            "AuthorizationCode": "384910",
            "AcquirerTransactionId": "0913050523453",
            "ProofOfSale": "523453",
            "Brand": "Master",
            "CardHolder": "José das Couves",
            "MaskedCardNumber": "123456******7890",
            "ReasonCode": "28",
            "ReasonMessage": "Consumidor nao reconhece a compra",
            "Status": "Received",
            "ReceivedDate": "2018-09-14",
            "BraspagTransactionId": "f9518dd7-76a8-400b-b7cf-b8c09731d71d",
            "AntifraudTransactionId": "4e9dd957-90b7-e811-bce7-0003ff21d4d7"
        }
    ]
}
```

### Response

|Parâmetro|Descrição|Tipo|
|:-|:-|:-:|
|`Id`|Id do chargeback na Chargeback API Braspag|guid|
|`AcquirerType`|Tipo da adquirente|string|
|`EstablishmentCode`|Código do estabelecimento|long|
|`CaseNumber`|Número do caso relacionado ao chargeback|guid|
|`Amount`|Valor do chargeback em centavos <br/> Ex: 123456 = r$ 1.234,56|long|
|`TransactionAmount`|Valor da transação em centavos <br/> Ex: 150000 = r$ 1.500,00|long|
|`SaleDate`|Data da autorização da transação da transação na adquirente <br/> Ex.: 2018-03-01|date|
|`AuthorizationCode`|Código de autorização da transação na adquirente|string|
|`AcquirerTransactionId`|Id da transação na adquirente|string|
|`ProofOfSale`|Número sequencial único da transação na adquirente|string|
|`CardHolder`|Nome do cartão de crédito|string|
|`MaskedCardNumber`|Número do cartão de crédito mascarado|string|
|`ReasonCode`|Código do motivo do chargeback|string|
|`ReasonMessage`|Mensagem do motivo do chargeback|string|
|`Status`|Status do charegabck na Braspag - [Tabela 3]({{ site.baseurl_root }}manual/retroalimentacaochargeback#tabela-3-chargebacks[n].status)|string|
|`ReceivedDate`|Data de recebimento do chargeback na Braspag|date|
|`BraspagTransactionId`|Id da transação na Braspag|guid|
|`AntifraudTransactionId`|Id da transação de antifraude na Braspag|guid|

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

**Parâmetros no corpo (Body)**

## Consultando uma transação inexistente

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|404 Not Found|

# Aceitação

## Aceitando um chargeback

<aside class="request"><span class="method post">POST</span><span class="endpoint">/{CaseNumber}/Acceptance</span></aside>

### Request

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Authorization`|Bearer {access_token}|
|`MerchantId`|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`RequestId`|nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn|

**Parâmetros na querystring**

|Parâmetro|Descrição|Obrigatório|
|:-|:-|:-:|
|`CaseNumber`|Número do caso relacionado ao chargeback|sim|

### Response

**Parâmetros no cabeçalho (Header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/json|
|`Status`|200 OK|

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
|NotFound|Transação na encontrada na base de dados para os valores enviados nos campos do nó Transaction|

## Tabela 3 - Chargebacks[n].Status

Possíveis valores do chargeback.

|Valor|Descrição|
|:-|:-|
|Received|Chargeback recebido da adquirente|
|AcceptedByMerchant|Chargeback aceito pela loja. Neste caso a loja entende que sofreu de fato um chargeback e não irá realizar a disputa|
|ContestedByMerchant|Chargeback contestado pela loja. Neste caso a loja enviou os documentos necessários para tentar reverter o chargeback|