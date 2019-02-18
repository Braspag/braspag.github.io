---
layout: manual
title: Manual de integração API Rest
description: Integração técnica Gateway Braspag
search: true
translated: true
categories: manual
tags:
  - Pagador
language_tabs:
  json: JSON
  shell: cURL
  html: HTML
---

# Introdução ao Pagador API

**O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com o API do Pagador, gateway de pagamentos da Braspag, descrevendo os serviços disponíveis com exemplos de requisição e respostas.**

Todas as operações requerem credenciais de acesso (Merchant ID e Merchant Key) específicos para respectivos ambientes: **Sandbox** e **Produção**. [Para executar](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md) uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie utilizando o VERBO HTTP conforme descrito na operação.

## Ambientes

### Ambiente Sandbox

Experimente as nossas APIs sem compromisso!

|Informação|Descrição|
|----|----|
|Credenciais de Acesso à API|Acesse o [Cadastro do Sandbox](https://cadastrosandbox.braspag.com.br/) e crie uma conta de testes.<BR>Ao fim do cadastro você receberá um `MerchantId` e um `MerchantKey`,<BR> que deverão ser utilizados para autenticar todas as requisições feitas para os endpoints da API|
|Endpoint Transacional|https://apisandbox.braspag.com.br/|
|Endpoint para Serviços de Consultas|https://apiquerysandbox.braspag.com.br/|

### Ambiente de Produção

Já estou pronto para entrar em Produção!

|Informação|Descrição|
|---|---|
|Credenciais de Acesso à API|Envie um email para comercial@braspag.com.br para mais informações sobre a Braspag e sobre como podemos ajudar no seu negócio!|
|Endpoint Transacional|https://api.braspag.com.br/|
|Endpoint para Serviços de Consultas|https://apiquery.braspag.com.br/|

## Suporte Braspag

<aside class="notice">A Braspag oferece suporte de alta disponibilidade, com atendimento de segunda à sexta, das 9h às 19h, e telefone de emergência 24×7, através de ferramenta via web. Contamos com a equipe que poderá atender em português, inglês e espanhol</aside>

* Atendimento Web: [Zendesk](http://suporte.braspag.com.br/)

## Características da Solução

A solução API Pagador foi desenvolvida com a tecnologia REST, que é padrão de mercado e independe da tecnologia utilizada por nossos clientes. Desta forma, é possível integrar-se utilizando as mais variadas linguagens de programação, tais como: ASP, ASP. Net, Java, PHP, Ruby, Python, entre outras.

Entre outras características, os atributos que mais se destacam na plataforma Braspag eCommerce:

* **Ausência de aplicativos proprietários**: não é necessário instalar aplicativos no ambiente da loja virtual em nenhuma hipótese.
* **Simplicidade**: o protocolo utilizado é puramente o HTTPS.
* **Facilidade de testes**: a plataforma Braspag oferece um ambiente Sandbox publicamente acessível, que permite ao desenvolvedor a criação de uma conta de testes sem a necessidade de credenciamento, facilitando e agilizando o início da integração.
* **Credenciais**: o tratamento das credenciais do cliente (número de afiliação e chave de acesso) trafega no cabeçalho da requisição HTTP da mensagem.
* **Segurança**: a troca de informações se dá sempre entre o Servidor da Loja e da Braspag, ou seja, sem o browser do comprador.
* **Multiplataforma**: a integração é realizada através de Web Service REST.

## Arquitetura

A integração é realizada através de serviços disponibilizados como Web Services. O modelo empregado é bastante simples: Existem duas URLs (endpoints), uma específica para autorização, captura e cancelamento de transações, e uma outra para operações como pesquisa de transações. Essas duas URLs receberão as mensagens HTTP através dos métodos POST, GET ou PUT. Cada tipo de mensagem deve ser enviada para um endereço identificado através do "path".

* **POST** - O método HTTP POST é utilizado na criação de uma transação.
* **PUT** - O método HTTP PUT é utilizado para atualização de um recurso já existente. Por exemplo, captura ou cancelamento de uma transação previamente autorizada.
* **GET** - O método HTTP GET é utilizado para consultas de recursos já existentes. Por exemplo, consulta de transações.

Para que você possa desfrutar de todos os recursos disponíveis em nossa API, é importante que antes você conheça os conceitos envolvidos no processamento de uma transação de cartão de crédito.

* **Autorização**: A autorização (ou pré-autorização) é uma operação que viabiliza o processamento de uma venda com um cartão de crédito.A pré-autorização apenas sensibiliza o limite do cliente, mas ainda não gera cobrança na fatura para o consumidor. Desta forma, é necessário uma segunda operação, chamada 'captura'.
* **Captura**: Ao realizar uma pré-autorização, é necessário confirmá-la para que a cobrança seja efetivada. O tempo limite para capturar uma transação pré-autorizada varia de adquirente para adquirente, que pode ser por exemplo, de até 5 dias após a data da pré-autorização.
* **Captura Automática**: É quando uma transação é autorizada e capturada no mesmo momento, isentando do lojista enviar uma confirmação posterior.

<aside class="warning">Uma transação autorizada somente gera o crédito para o lojista se ela for capturada.</aside>

* **Cancelamento**: O cancelamento é necessário quando, por algum motivo, não se quer mais efetivar uma venda. No caso de uma pré-autorização, o cancelamento irá liberar o limite do cartão que foi sensibilizado em uma pré-autorização. Quando a transação já estiver sido capturada, o cancelamento irá desfazer a venda, mas deve ser executado até às 23:59:59 da data da autorização/captura.
* **Estorno**: O estorno é aplicável quando uma transação criada no dia anterior ou antes já estiver capturada. Neste caso, a transação será submetida no processo de 'chargeback' pela adquirente. 
* **Autenticação**: O processo de autenticação possibilita realizar uma venda a qual passará pelo processo de autenticação do banco emissor do cartão, assim trazendo mais segurança para a venda e transferindo para o banco, o risco de fraude.
* **Cartão Protegido**: É uma plataforma que permite o armazenamento seguro de dados sensíveis de cartão de crédito. Estes dados são transformados em um código criptografrado chamado de "token”, que poderá ser armazenado em banco de dados. Com a plataforma, a loja poderá oferecer recursos como "Compra com 1 clique” e "Retentativa de envio de transação”, sempre preservando a integridade e a confidencialidade das informações.
* **Antifraude**: É uma plataforma de prevenção à fraude que fornece uma análise de risco detalhada das compras on-line. Este processo é totalmente transparente para o portador do cartão. De acordo com os critérios preestabelecidos, o pedido pode ser automaticamente aceito, recusado ou encaminhado para análise manual.

# Pagamentos

## Cartão de Crédito e Débito

### Criando uma transação

Para autoriazar uma transação de crédito, é necessário seguir o contrato abaixo. Os dados referentes à sua afiliação são enviados no nó `Payment.Credentials`, e devem ser enviados sempre que uma nova requisição de autorização for submetida para aprovação.

Caso a sua loja utilize os serviços de Retentaiva ou Loadbalance, as afiliações devem ser cadastradas pela equipe de suporte ao cliente. Para requisitar o cadastro de afiliações, clique [Aqui](http://suporte.braspag.com.br/).

<aside class="notice">Os parâmetros contidos nos nós Address e DeliveryAddress são obrigatórios quando a transação é submetida ao Antifraude ou análise do Velocity. Na tabela de parâmetros abaixo, eles estão marcados com um * na coluna de obrigatoriedade.</aside>

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "DoSplit":false,
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false",
         "Alias":""
      },
      "Credentials":{  
         "code":"9999999",
         "key":"D8888888",
         "password":"LOJA9999999",
         "username":"#Braspag2018@NOMEDALOJA#",
         "signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BRA",
         "District":"Alphaville"
      }
   },
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "DoSplit":false,
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false",
         "Alias":""
      },
      "Credentials":{  
         "code":"9999999",
         "key":"D8888888",
         "password":"LOJA9999999",
         "username":"#Braspag2018@NOMEDALOJA#",
         "signature":"001"
      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
         }
      ]
   }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave Publica para Autenticação Dupla na Braspag|
|`RequestId`|Guid|36|Não|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido|
|`Customer.Name`|Texto|255|Sim|Nome do comprador|
|`Customer.Identity`|Texto |14 |Não|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Email`|Texto|255|Não|Email do comprador|
|`Customer.Birthdate`|Date|10|Não|Data de nascimento do Comprador no formato AAAA-MM-DD|
|`Customer.Address.Street`|Texto|255|Não*|Endereço de contato do comprador|
|`Customer.Address.Number`|Texto|15|Não*|Número endereço de contato do comprador|
|`Customer.Address.Complement`|Texto|50|Não*|Complemento do endereço de contato do Comprador|
|`Customer.Address.ZipCode`|Texto|9|Não*|CEP do endereço de contato do comprador|
|`Customer.Address.City`|Texto|50|Não*|Cidade do endereço de contato do comprador|
|`Customer.Address.State`|Texto|2|Não*|Estado do endereço de contato do comprador|
|`Customer.Address.Country`|Texto|35|Não*|Pais do endereço de contato do comprador|
|`Customer.Address.District`|Texto |50 |Não*|Bairro do Comprador. |
|`Customer.DeliveryAddress.Street`|Texto|255|Não*|Endereço do comprador|
|`Customer.DeliveryAddress.Number`|Texto|15|Não*|Número do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Complement`|Texto|50|Não*|Complemento do endereço de entrega do pedido|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não*|CEP do endereço de entrega do pedido|
|`Customer.DeliveryAddress.City`|Texto|50|Não*|Cidade do endereço de entrega do pedido|
|`Customer.DeliveryAddress.State`|Texto|2|Não*|Estado do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Country`|Texto|35|Não*|Pais do endereço de entrega do pedido|
|`Customer.DeliveryAddress.District`|Texto |50|Não*|Bairro do Comprador. |
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.ServiceTaxAmount`|Número|15|Não|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Currency`|Texto|3|Não|Moeda na qual o pagamento será feito (BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP)|
|`Payment.Country`|Texto|3|Não|País na qual o pagamento será feito|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.Interest`|Texto|10|Não|Tipo de parcelamento - Loja (ByMerchant) ou Emissor (ByIssuer)|
|`Payment.Capture`|Booleano|---|Não (Default false)|Booleano que indica se a autorização deve ser com captura automática (true) ou não (false). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.Authenticate`|Booleano|---|Não (Default false)|Booleano que indica se a transação deve ser autenticada (true) ou não (false). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.Recurrent`|Booleano|---|Não (Default false)|Booleano que indica se a transação é do tipo recorrente (true) ou não (false). Este com valor true não originará uma nova Recorrência, apenas permitirá a realização de uma transação sem a necessidade de envio do CVV. Somente para transações Cielo. Authenticate deve ser false quando Recurrent é true|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador|
|`Payment.DoSplit`|Booleano|---|Não (Default false)|Booleano que indica se a transação será dividida entre várias contas (true) ou não (false)|
|`Payment.ExtraDataCollection.Name`|Texto|50|Não|Nome do campo que será gravado o Dado Extra|
|`Payment.ExtraDataCollection.Value`|Texto|1024|Não|Valor do campo que será gravado o Dado Extra|
|`Payment.Credentials.Code`|Texto|100|Sim|afiliação gerada pela adquirente|
|`Payment.Credentials.Key`|Texto|100|Sim|chave de afiliação/token gerado pela adquirente|
|`Payment.Credentials.Username`|Texto|50|Não|usuário gerado no credenciamento com a adquirente GetnNet (o campo deve obrigatoriamente ser enviado se a transação é direcionada para GetNet)|
|`Payment.Credentials.Password`|Texto|50|Não|senha gerada no credenciamento com a adquirente GetnNet (o campo deve obrigatoriamente ser enviado se a transação é direcionada para GetNet)|
|`Payment.Credentials.Signature`|Texto|3|Não|Enviar o TerminalID da adquirete Global Payments (aplicável para lojistas filiados a esta adquirente). Ex.: 001|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.SaveCard`|Booleano|---|Não (Default false)|Booleano que identifica se o cartão será salvo para gerar o token (CardToken)|
|`CreditCard.Alias`|Texto|64|Não|Nome atribuído pelo lojista ao cartão salvo como CardToken|

#### Resposta

```json

{
"MerchantOrderId": "2017051002",
    "Customer": {
        "Name": "Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Birthdate": "1991-01-02",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BRA",
            "District": "Alphaville"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BRA",
            "District": "Alphaville"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "DoSplit":false,
        "CreditCard": {
            "CardNumber": "455187******0181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SaveCard": false,
            "Brand": "Visa"
            "Alias": ""
        },
        "credentials": {
            "code": "9999999",
            "key": "D8888888",
            "password": "LOJA9999999",
            "username": "#Braspag2018@NOMEDALOJA#"
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor": "Mensagem",
        "VelocityAnalysis": {
            "Id": "c374099e-c474-4916-9f5c-f2598fec2925",
            "ResultMessage": "Accept",
            "Score": 0
        },
        "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ExtraDataCollection": [{
            "Name": "NomeDoCampo",
            "Value": "ValorDoCampo"
        }],
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [{
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"
            }
        ]
    }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
"MerchantOrderId": "2017051002",
    "Customer": {
        "Name": "Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Birthdate": "1991-01-02",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BRA",
            "District": "Alphaville"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BRA",
            "District": "Alphaville"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "DoSplit":false,
        "CreditCard": {
            "CardNumber": "455187******0181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SaveCard": false,
            "Brand": "Visa"
            "Alias": ""
        },
        "credentials": {
            "code": "9999999",
            "key": "D8888888",
            "password": "LOJA9999999",
            "username": "#Braspag2018@NOMEDALOJA#"
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor": "Mensagem",
        "VelocityAnalysis": {
            "Id": "c374099e-c474-4916-9f5c-f2598fec2925",
            "ResultMessage": "Accept",
            "Score": 0
        },
        "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ExtraDataCollection": [{
            "Name": "NomeDoCampo",
            "Value": "ValorDoCampo"
        }],
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [{
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`CapturedDate`|Data em que a transação foi capturada a transação|Texto|19|AAAA-MM-DD HH:mm:SS|
|`CapturedAmount`|Valor capturado (sem pontuação)|Número|15|100 equivale a R$ 1,00|
|`ECI`|Eletronic Commerce Indicator. Representa o resultado da autenticação|Texto|2|Exemplos: 5|
|`ReasonCode`|Código de retorno da Operação|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da Operação|Texto|512|Texto alfanumérico|
|`Status`|Status da Transação|Byte|2|Ex. 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|

### Capturando uma transação

Uma transação submetida com o parâmetro `Payment.Capture` igual a _false_ necessita de uma operação PUT de "Captura" para confirmar a transação posteriormente.

Transações que não forem capturadas em até 15 dias são automaticamente desfeitas pelas Processadoras. Clientes podem ter negociações específicas com as Processadoras que aumentam esse prazo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture</span></aside>

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/capture?amount=xxx&serviceTaxAmount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. | Guid | 36 | Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API. | Texto | 40 | Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`PaymentId`|Campo Identificador do Pedido. | Guid | 36 | Sim|
|`Amount`|Valor a ser capturado (em centavos). Verificar se a adquirente utilizada suporta uma captura parcial | Número | 15 | Não|
|`ServiceTaxAmount`|Aplicável para companhias aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização. | Número | 15 | Não|

#### Resposta

```json

{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReasonCode": "6",
    "ProviderReasonMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/void"
        }
    ]
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReasonCode": "6",
    "ProviderReasonMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/void"
        }
    ]
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`Status`|Status da Transação. | Byte | 2 | Ex. 1 |
|`ReasonCode`|Código de retorno da adquirente. | Texto | 32 | Texto alfanumérico |
|`ReasonMessage`|Mensagem de retorno da adquirente. | Texto | 512 | Texto alfanumérico |

### Transação com autenticação

Quando uma transação é submetida ao processo de autenticação, o portador será redirecionado ao ambiente do emissor, onde deverá realizar a confirmação de seus dados. Quando validado corretamente, o risco de chargeback da transação passa a ser do emissor, ou seja, a loja não receberá contestações.

Existem duas maneiras para autenticar transações na Braspag: **Padrão** quando o lojista não possui uma conexão direta com um autenticador (MPI), e espera que o meio de pagamento redirecione o cliente para o ambiente de autenticação. **Externa** quando o lojista possui um autenticador próprio (MPI) e não espera que o meio de pagamento redirecione seu consumidor para o ambiente de autenticação.  

#### Autenticação Padrão

##### Requisição

O Parâmetro `Payment.Authenticate` deverá ser enviado como *true* conforme exemplo abaixo

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": "false",
            "Alias": ""
        },
        [...]
    }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": "false",
            "Alias": ""
        },
        [...]
    }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.Authenticate`|Booleano|---|Não (Default false)|Define se o comprador será direcionado ao Banco emissor para autenticação do cartão. Para transaçõe autenticadas, neste campo, deve-se enviar o valor "True". *Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.ReturnUrl`|Texto|1024|Sim (quando Autenticate é true)|URL para onde o usuário será redirecionado após o fim da autenticação|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|

##### Resposta

Uma transação com autenticação padrão receberá, além do retorno padrão da transação de autorização, o parâmetro `Payment.AuthenticationUrl`.

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": "false",
            "Alias": ""
        [...]
    },
    "AuthenticationUrl": "https://qasecommerce.cielo.com.br/web/index.cbmp?id=9e61c78c0b0ca3e5db41fa7e31585eab",
    "AcquirerTransactionId": "10069930690009D2A47A",
    "ReturnUrl": "http://www.braspag.com.br",
    "PaymentId": "b125109f-681b-4338-8450-f3e38bc71b32",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 11:09:49",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo",
    "ReasonCode": 9,
    "ReasonMessage": "Waiting",
    "Status": 0,
    "ProviderReturnCode": "0",
   [...]
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": "false",
            "Alias": ""
        [...]
    },
    "AuthenticationUrl": "https://qasecommerce.cielo.com.br/web/index.cbmp?id=9e61c78c0b0ca3e5db41fa7e31585eab",
    "AcquirerTransactionId": "10069930690009D2A47A",
    "ReturnUrl": "http://www.braspag.com.br",
    "PaymentId": "b125109f-681b-4338-8450-f3e38bc71b32",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 11:09:49",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo",
    "ReasonCode": 9,
    "ReasonMessage": "Waiting",
    "Status": 0,
    "ProviderReturnCode": "0",
   [...]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da Operação|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da Operação|Texto|512|Texto alfanumérico|
|`Status`|Status da Transação|Byte|2|Ex. 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|
|`AuthenticationUrl`|URL para qual o Lojista deve redirecionar o Cliente para o fluxo de autenticação|Texto|256|https://qasecommerce.cielo.com.br/web/index.cbmp?id=5f177203bf524c78982ad28f7ece5f08|

#### Autenticação Externa

##### Requisição

Adicione o nó `Payment.ExternalAuthentication` ao contrato padrão conforme exemplo. Este fluxo é suportado pelas adquirentes Cielo, Global Payments e Banorte.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{
  [...]
 "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": "false",
            "Alias": ""
        },
        "ExternalAuthentication":{
        "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
        "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
        "Eci":"5"
        },
     [...]
   }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
 "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": "false",
            "Alias": ""
        },
        "ExternalAuthentication":{
        "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
        "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
        "Eci":"5"
        },
     [...]
   }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.ExternalAuthentication.Cavv`| Texto | 28 | Sim | O valor Cavv é retornado pelo mecanismo de autenticação externa |
|`Payment.ExternalAuthentication.Xid`|Texto|28|Sim|O valor Xid é retornado pelo mecanismo de autenticação externa|
|`Payment.ExternalAuthentication.Eci`|Número|1|Sim|O valor Eci é retornado pelo mecanismo de autenticação externa|

##### Resposta

Uma transação com autenticação externa receberá, além do retorno padrão da transação de autorização, o nó `Payment.ExternalAuthentication` com as mesmas informações envidas na requisição.

```json

{
  [...]
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "ProofOfSale": "20170510053219433",
    "AcquirerTransactionId": "0510053219433",
    "AuthorizationCode": "936403",
    "SoftDescriptor": "Mensagem",
    "VelocityAnalysis": {
      "Id": "c374099e-c474-4916-9f5c-f2598fec2925",
      "ResultMessage": "Accept",
      "Score": 0
    },
    "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-10 17:32:19",
    "CapturedAmount": 10000,
    "CapturedDate": "2017-05-10 17:32:19",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ExternalAuthentication":{
       "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
       "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
       "Eci":"5",
     },
     [...]
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "ProofOfSale": "20170510053219433",
    "AcquirerTransactionId": "0510053219433",
    "AuthorizationCode": "936403",
    "SoftDescriptor": "Mensagem",
    "VelocityAnalysis": {
      "Id": "c374099e-c474-4916-9f5c-f2598fec2925",
      "ResultMessage": "Accept",
      "Score": 0
    },
    "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-10 17:32:19",
    "CapturedAmount": 10000,
    "CapturedDate": "2017-05-10 17:32:19",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ExternalAuthentication":{
       "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
       "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
       "Eci":"5",
     },
     [...]
  }
}

```

|Propriedade|Tipo|Tamanho|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.ExternalAuthentication.Cavv`| Texto | 28 |Valor Cavv submetido na requisição de autorização|
|`Payment.ExternalAuthentication.Xid`|Texto|28|Valor Xid submetido na requisição de autorização|
|`Payment.ExternalAuthentication.Eci`|Número|1|Valor ECI submetido na requisição de autorização|

### Transação com cartão de débito

Uma transação com um Cartão de Débito se efetua de uma forma semelhante a um Cartão de Crédito, porém, é obrigatório submetê-la ao processo de autenticação.

#### Requisição

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "DebitCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "DebitCard":{
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
        },
        [...]
    }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "DebitCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "DebitCard":{
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
        },
        [...]
    }
}

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento. Atualmente somente a "Cielo" suporta esta forma de pagamento via Pagador|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento. No caso do cartão de débito (DebitCard)|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim do pagamento|Texto |1024 |Sim|
|`DebitCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`DebitCard.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`DebitCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`DebitCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`DebitCard.Brand`|Texto|10|Sim |Bandeira do cartão|

#### Resposta

```json

{
 [...]
  "Payment": {
    "DebitCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "AuthenticationUrl": "https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f",
    "AcquirerTransactionId": "10069930690009D366FA",
    "PaymentId": "21423fa4-6bcf-448a-97e0-e683fa2581ba",
    "Type": "DebitCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:19:58",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo",
    "ReturnUrl": "http://www.braspag.com.br",
    "ReasonCode": 9,
    "ReasonMessage": "Waiting",
    "Status": 0,
    "ProviderReturnCode": "0",
    [...]
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
 [...]
  "Payment": {
    "DebitCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "AuthenticationUrl": "https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f",
    "AcquirerTransactionId": "10069930690009D366FA",
    "PaymentId": "21423fa4-6bcf-448a-97e0-e683fa2581ba",
    "Type": "DebitCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:19:58",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo",
    "ReturnUrl": "http://www.braspag.com.br",
    "ReasonCode": 9,
    "ReasonMessage": "Waiting",
    "Status": 0,
    "ProviderReturnCode": "0",
    [...]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da Operação|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da Operação|Texto|512|Texto alfanumérico|
|`Status`|Status da Transação|Byte|2|Ex. 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|
|`AuthenticationUrl`|URL para o qual o portador será redirecionado para autenticação |Texto |56 |https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f|

### Cancelando/Estornando uma transação

Para cancelar uma transação que utilizou cartão de crédito, é necessário fazer um PUT para o recurso Payment conforme o exemplo.

Abaixo segue a lista de adquirentes com as quais temos integração para solicitações de estorno: 

|Adquirente|Prazo Máximo para Solicitação de Estorno|
|-----------|----|
|Cielo|300 dias|
|Rede| Tecnologia Komerci: 90 dias; Tecnologia eRede: 60 dias|
|Getnet|90 dias|
|Transbank|90 dias| 
|Banorte|30 dias|
|First Data|90 dias|
|Alelo|300 dias|

<aside class="warning">A disponibilidade do serviço de Estorno varia de adquirente para adquirente.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/void?amount=xxx</span></aside>

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/void?amount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API. |Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`PaymentId`|Campo Identificador do Pedido. |Guid |36 |Sim|
|`Amount`|Valor a ser cancelado/estornado (ser enviado em centavos). Verifique se a adquirente contratada suporta a operação de cancelamento ou estorno|Número |15 |Não|

#### Resposta

```json

{
    "Status": 10,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReasonCode": "9",
    "ProviderReasonMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        }
    ]
}

```

```shell

{
    "Status": 10,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReasonCode": "9",
    "ProviderReasonMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
        }
    ]
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`Status`|Status da Transação. |Byte | 2 | Ex. 1 |
|`ReasonCode`|Código de retorno da Adquirência. |Texto |32 |Texto alfanumérico 
|`ReasonMessage`|Mensagem de retorno da Adquirência. |Texto |512 |Texto alfanumérico 

### Transação com Velocity Check

O Velocity Check é uma ferramenta de combate à fraudes massivas, que disparam rajadas de transações com dados de pagamento repetidos.  Ele analisa a frequência de elementos de rastreabilidade tais como Número do Cartão, CPF, CEP de entrega, entre outros, e bloqueia transações suspeitas. 

A funcionalidade deve ser contratada à parte, e posteriormente habilitada em sua loja via painel. Quando o Velocity está ativo, a resposta da transação trará um nó específico chamado "Velocity", com os detalhes da análise.

No caso da rejeição pela regra de Velocity, o ProviderReasonCode será BP 171 - Rejected by fraud risk (velocity, com ReasonCode 16 - AbortedByFraud).

#### Resposta

```json
{
    [...]
    "VelocityAnalysis": {
        "Id": "2d5e0463-47be-4964-b8ac-622a16a2b6c4",
        "ResultMessage": "Reject",
        "Score": 100,
        "RejectReasons": [
        {
            "RuleId": 49,
            "Message": "Bloqueado pela regra CardNumber. Name: Máximo de 3 Hits de Cartão em 1 dia. HitsQuantity: 3. HitsTimeRangeInSeconds: 1440. ExpirationBlockTimeInSeconds: 1440"
        }]
    [...]
  }
}

```

```shell

{
    [...]
    "VelocityAnalysis": {
        "Id": "2d5e0463-47be-4964-b8ac-622a16a2b6c4",
        "ResultMessage": "Reject",
        "Score": 100,
        "RejectReasons": [
        {
            "RuleId": 49,
            "Message": "Bloqueado pela regra CardNumber. Name: Máximo de 3 Hits de Cartão em 1 dia. HitsQuantity: 3. HitsTimeRangeInSeconds: 1440. ExpirationBlockTimeInSeconds: 1440"
        }]
    [...]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`VelocityAnalysis.Id`|Identificador da análise efetuada|GUID|36|
|`VelocityAnalysis.ResultMessage`|Accept ou Reject|Texto|25|
|`VelocityAnalysis.Score`|100|Número|10|
|`VelocityAnalysis.RejectReasons.RuleId`|Código da Regra que rejeitou|Número|10|
|`VelocityAnalysis.RejectReasons.Message`|Descrição da Regra que rejeitou|Texto|512|

## Boletos

### Boleto Registrado

Com o objetivo de promover maior controle e segurança ao transacional de boletos no e-commerce e garantir mais confiabilidade e comodidade aos usuários, a Febraban em conjunto com os Bancos lançou a Nova Plataforma de Cobrança. 

A partir de 21 de julho de 2018 todos os boletos emitidos no e-commerce, obrigatoriamente, terão de ser registrados. [Clique aqui](https://portal.febraban.org.br/pagina/3150/1094/pt-br/servicos-novo-plataforma-boletos) para acessar o comunicado completo.   

Abaixo seguem os procedimentos de migração/filiação de cada banco: 

[Bradesco](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/24157160-4da2-46d4-a119-60d8f614a842/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Bradesco.pdf)<BR>[Banco do Brasil](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/0f4644c6-da10-42ab-b647-09786d5db5cb/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Banco_do_Brasil.pdf)<BR>[Itaú](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/de2e95e8-441a-4fa2-be01-9b89463477d0/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Ita%C3%BA_v1.1.pdf)<BR>[Santander](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/a8661c34-6341-466a-86cf-078fb5e19626/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Santander.pdf)<BR>[Caixa Econômica](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/fee80b87-2b37-4f19-b293-bb43389025de/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Caixa_v1.1.pdf)

### Criando uma transação de Boleto

Para gerar um boleto em Sandbox, é necessário fornecer dados do comprador como CPF e endereço. Abaixo temos um exemplo de como criar um pedido com o meio de pagamento boleto. 

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{  
    "MerchantOrderId":"2017091101",
    "Customer":
    {  
        "Name":"Nome do Comprador",
        "Identity":"12345678909",
        "IdentityType":"CPF",
        "Address":{  
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27 andar",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
        }
    },
    "Payment":
    {  
     "Provider":"Simulado",
     "Type":"Boleto",
     "Amount":10000,
     "BoletoNumber":"2017091101",
     "Assignor": "Empresa Teste",
     "Demonstrative": "Desmonstrative Teste",
     "ExpirationDate": "2017-12-31",
     "Identification": "12346578909",
     "Instructions": "Aceitar somente até a data de vencimento.",
     "DaysToFine": 1,
     "FineRate": 10.00000,
     "FineAmount": 1000,
     "DaysToInterest": 1,
     "InterestRate": 5.00000,
     "InterestAmount": 500
    }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
    "MerchantOrderId":"2017091101",
    "Customer":
    {  
        "Name":"Nome do Comprador",
        "Identity":"12345678909",
        "IdentityType":"CPF",
        "Address":{  
            "Street":"Alameda Xingu",
            "Number":"512",
            "Complement":"27 andar",
            "ZipCode":"12345987",
            "City":"São Paulo",
            "State":"SP",
            "Country":"BRA",
            "District":"Alphaville"
        }
    },
    "Payment":
    {  
     "Provider":"Simulado",
     "Type":"Boleto",
     "Amount":10000,
     "BoletoNumber":"2017091101",
     "Assignor": "Empresa Teste",
     "Demonstrative": "Desmonstrative Teste",
     "ExpirationDate": "2017-12-31",
     "Identification": "12346578909",
     "Instructions": "Aceitar somente até a data de vencimento.",
     "DaysToFine": 1,
     "FineRate": 10.00000,
     "FineAmount": 1000,
     "DaysToInterest": 1,
     "InterestRate": 5.00000,
     "InterestAmount": 500
    }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave Publica para Autenticação Dupla na Braspag|
|`RequestId`|Guid|36|Não|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT|
|`MerchantOrderId`|Texto|vide tabela abaixo|Sim|Numero de identificação do Pedido. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Name`|Texto|vide tabela abaixo|Sim|Nome do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Identity`|Texto |14 |Sim|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Sim|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Address.Street`|Texto|vide tabela abaixo|Sim|Endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.Number`|Texto|vide tabela abaixo|Sim|Número endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.Complement`|Texto|vide tabela abaixo|Não|Complemento do endereço de contato do Comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.ZipCode`|Texto|8|Sim|CEP do endereço de contato do comprador|
|`Customer.Address.District`|Texto|vide tabela abaixo|Sim|Bairro do endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.City`|Texto|vide tabela abaixo|Sim|Cidade do endereço de contato do comprador. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço de contato do comprador|
|`Customer.Address.Country`|Texto|35|Sim|Pais do endereço de contato do comprador|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento de Boleto. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#providers-para-boleto-com-registro) para acessar a lista de provedoras. |
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento. No caso "Boleto"|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (deve ser enviado em centavos)|
|`Payment.BoletoNumber`|Texto |vide tabela abaixo|Não|Número do Boleto ("Nosso Número"). Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o Provider utilizado (vide tabela abaixo|
|`Payment.Assignor`|Texto |200|Não|Nome do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Demonstrative`|Texto |vide tabela abaixo|Não|Texto de Demonstrativo. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Payment.ExpirationDate`|Date |AAAA-MM-DD|Não|Dias para vencer o boleto. Caso não esteja previamente cadastrado no meio de pagamento, o envio deste campo é obrigatório. Se enviado na requisição, sobrepõe o valor configurado no meio de pagamento.|
|`Payment.Identification`|Texto |14 |Não|CNPJ do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento|
|`Payment.Instructions`|Texto |vide tabela abaixo|Não|Instruções do Boleto. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o Provider utilizado (vide tabela abaixo)|
|`Payment.NullifyDays`|Número |2 |Não|Prazo para baixa automática do boleto. O cancelamento automático do boleto acontecerá após o número de dias estabelecido neste campo contado a partir da data do vencimento. Ex.: um boleto com vencimento para 15/12 que tenha em seu registro o prazo para baixa de 5 dias, poderá ser pago até 20/12, após esta data o título é cancelado. *Recurso válido somente para boletos registrados do Banco Santander.|
|`Payment.DaysToFine`|Número |15 |Não|Opcional e somente para provider Bradesco2. Quantidade de dias após o vencimento para cobrar o valor da multa, em número inteiro. Ex: 3|
|`Payment.FineRate`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor da multa após o vencimento em percentual, com base no valor do boleto (%). Permitido decimal com até 5 casas decimais. Não enviar se utilizar FineAmount. Ex: 10.12345 = 10.12345%|
|`Payment.FineAmount`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor da multa após o vencimento em valor absoluto em centavos. Não enviar se utilizar FineRate.  Ex: 1000 = R$ 10,00|
|`Payment.DaysToInterest`|Número |15 |Não|Opcional e somente para provider Bradesco2.Quantidade de dias após o vencimento para iniciar a cobrança de juros por dia sobre o valor do boleto, em número inteiro. Ex: 3|
|`Payment.InterestRate`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor de juros mensal após o vencimento em percentual, com base no valor do boleto (%). O valor de juros é cobrado proporcionalmente por dia (Mensal dividido por 30). Permitido decimal com até 5 casas decimais. Não enviar se utilizar InterestAmount. Ex: 10.12345|
|`Payment.InterestAmount`|Número |15 |Não|Opcional e somente para provider Bradesco2. Valor absoluto de juros diário após o vencimento em centavos. Não enviar se utilizar InterestRate. Ex: 1000 = R$ 10,00|

#### Resposta

```json

{
  "MerchantOrderId": "2017091101",
  "Customer": {
    "Name": "Nome do Comprador",
    "Identity": "12345678909",
    "IdentityType": "CPF",
    "Address": {
      "Street": "Alameda Xingu",
      "Number": "512",
      "Complement": "27 andar",
      "ZipCode": "12345987",
      "City": "São Paulo",
      "State": "SP",
      "Country": "BRA"
    }
  },
  "Payment": {
    "Instructions": "Aceitar somente até a data de vencimento.",
    "ExpirationDate": "2017-12-31",
    "Demonstrative": "Desmonstrative Teste",
    "Url": "https://homologacao.pagador.com.br/post/pagador/reenvia.asp/d24b0aa4-21c9-449d-b85c-6279333f070f",
    "BoletoNumber": "2017091101",
    "BarCodeNumber": "00091739000000100000494250000000263400656560",
    "DigitableLine": "00090.49420 50000.000260 34006.565609 1 73900000010000",
    "Assignor": "Empresa Teste",
    "Address": "Av. Brigadeiro Faria Lima, 160",
    "Identification": "12346578909",
    "PaymentId": "d24b0aa4-21c9-449d-b85c-6279333f070f",
    "Type": "Boleto",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 16:42:55",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "InterestAmount": 1,
    "FineAmount": 5,
    "DaysToFine": 1,
    "DaysToInterest": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/d24b0aa4-21c9-449d-b85c-6279333f070f"
      }
    ]
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "MerchantOrderId": "2017091101",
  "Customer": {
    "Name": "Nome do Comprador",
    "Identity": "12345678909",
    "IdentityType": "CPF",
    "Address": {
      "Street": "Alameda Xingu",
      "Number": "512",
      "Complement": "27 andar",
      "ZipCode": "12345987",
      "City": "São Paulo",
      "State": "SP",
      "Country": "BRA",
     "District":"Alphaville"
    }
  },
  "Payment": {
    "Instructions": "Aceitar somente até a data de vencimento.",
    "ExpirationDate": "2017-12-31",
    "Demonstrative": "Desmonstrative Teste",
    "Url": "https://homologacao.pagador.com.br/post/pagador/reenvia.asp/d24b0aa4-21c9-449d-b85c-6279333f070f",
    "BoletoNumber": "2017091101",
    "BarCodeNumber": "00091739000000100000494250000000263400656560",
    "DigitableLine": "00090.49420 50000.000260 34006.565609 1 73900000010000",
    "Assignor": "Empresa Teste",
    "Address": "Av. Brigadeiro Faria Lima, 160",
    "Identification": "12346578909",
    "PaymentId": "d24b0aa4-21c9-449d-b85c-6279333f070f",
    "Type": "Boleto",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 16:42:55",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "InterestAmount": 1,
    "FineAmount": 5,
    "DaysToFine": 1,
    "DaysToInterest": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/d24b0aa4-21c9-449d-b85c-6279333f070f"
      }
    ]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`PaymentId`|Campo Identificador do Pedido. |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`ExpirationDate`|Data de expiração. |Texto |10 |2014-12-25 |
|`Url`|URL do Boleto gerado |string |256 |https://.../pagador/reenvia.asp/8464a692-b4bd-41e7-8003-1611a2b8ef2d |
|`BoletoNumber`|"NossoNumero" gerado. |Texto|50 |2017091101 |
|`BarCodeNumber`|Representação numérica do código de barras. |Texto |44 |00091628800000157000494250100000001200656560 |
|`DigitableLine`|Linha digitável. |Texto |256 |00090.49420 50100.000004 12006.565605 1 62880000015700 |
|`Address`|Endereço do Loja cadastrada no banco |Texto |256 |Av. Teste, 160 |
|`Status`|Status da Transação. |Byte | 2 | Ex. 1 |

### Conciliação de Boletos

Para atualizar o status de um Boleto para Pago, o Pagador deve receber dos bancos os arquivos CNAB com as liquidações referentes. Para habilitar sua loja a receber os arquivos bancários, basta seguir o procedimento descrito [aqui](https://suporte.braspag.com.br/hc/pt-br/articles/360007068352-Como-funciona-a-Concilia%C3%A7%C3%A3o-via-Nexxera-)

### Tabela de Especificação de quantidade de caracteres do campo por Provider

| Propriedade | Bradesco | BancoBanco do Brasil | Itaú Shopline | Santander | Caixa Econômica | Citibank |
|:-|:-:|:-:|:-:|:-:|:-:|:-:|
| Provider | Bradesco2 | BancoDoBrasil2 | ItauShopline | Santander2 | Caixa2 | Citibank2 |
| `MerchantOrderId` | 27 (OBS 1) | 50 (OBS 1) | 8 | 50 (OBS 1) | 11 (OBS 1) | 10 (OBS 1) |
| `Payment.BoletoNumber` | 11 (OBS 2) | 9 (OBS 2) | 8 (OBS 1) | 13 (OBS 2) | 14 (OBS 2) | 11 (OBS 2) |
| `Customer.Name` | 34 (OBS 3) | 60 (OBS,3) | 30 | 40 (OBS 3) | 40 (OBS 3) | 50 (OBS 3) |
| `Customer.Address.Street`; `Customer.Address.Number`; `Customer.Address.Complement`; `Customer.Address.District` | Street: 70 (OBS 4); Number: 10 (OBS 4); Complement: 20 (OBS 4); District: 50 (OBS 4) | Os campos devem totalizar até 60 caracteres / OBS 3 | Street, Number e Complement devem totalizar até 40 caracteres;  District: 15 | Street, Number e Complement devem totalizar até 40 caracteres (OBS 3); District: 15 (OBS 3) | Street, Number e Complement devem totalizar até 40 caracteres (OBS 3); District: 15 (OBS 3) | Street, Number e Complement devem totalizar até 40 caracteres (OBS 3); District: 50 (OBS 3) |
| `Customer.Address.City` | 50 (OBS 4) | 18 (OBS 3) | 15 | 30 (OBS 3) | 15 (OBS 3) | 50 (OBS 4) |
| `Payment.Instructions` | 450 | 450 | não é enviado ao banco | 450 | 450 | 450 |
| `Payment.Demonstrative` | 255 | não é enviado ao banco | não é enviado ao banco | 255 | 255 | 255 |
| >>>>>>>>>>>>>>>>>>>>>> |  |  |  |  |  |  |
| Particularidades e Observações: | OBS 1: letras, números e caracteres como "_" e "$" | OBS 1: não é enviado ao banco | OBS geral: o Pagador trunca automaticamente os campos | OBS 1: não é enviado ao banco | OBS 1: quando ultrapassa os 11 dígitos, o pagador considera o número incremental cadastrado no admin | OBS geral: o Pagador não valida os campos, porém é truncado automaticamente pelo Banco |
|  | OBS 2: o valor é presistido no banco | OBS 2: quando enviado acima de 9 posições, o Pagador trunca automaticamente, considerando os últimos 9 dígitos | OBS 1: o nosso número será sempre igual ao Order ID, sendo que o pagador valida o tamanho do campo | OBS 2: o dado é validado pelo banco | OBS 2: inicia-se com "14" + 14 dígitos + dígito verificador gerado automaticamente. Quando maior que 14, o Pagador trunca pegando os últimos 14 digitos | OBS 1: quando fora do limite, o pagador gera um número incremental configurado a partir do Admin |
|  | OBS 3: o Pagador trunca automaticamente | OBS 3: são aceitos como caracteres válidos: as letras de A a Z (MAIÚSCULAS); caracteres especiais de conjunção: hífen (-), apóstrofo ('). Quando utilizados não pode conter espaços entre as letras; Exemplos corretos: D'EL-REI, D'ALCORTIVO, SANT'ANA. Exemplos incorretos: D'EL - REI; até um espaço em branco entre palavras |  | OBS 3: o dado é validado pelo Pagador | OBS 3: o dado é validado pelo Pagador | OBS 2: quando fora do limite, o pagador gera um número aleatório |
|  | OBS 4: o dado é validado pelo Pagador |  |  |  |  | OBS 3: o Pagador trunca até o limite permitido e remove os caracteres especiais e acentuados |
|  |  |  |  |  |  | OBS 4: não é enviado para banco |

## Recorrência

Diferente dos pagamentos com cartão de crédito ou boleto tradicionais, os pagamentos recorrentes se repetem automaticamente por períodos e em intervalos determinados, cobrando sempre o mesmo valor de um mesmo cartão ou conta. 

É muito utilizado para assinaturas de revistas, mensalidades, licenças de software, entre outros. Além da integração técnica, é necessário que o estabelecimento comercial do cliente esteja habilitado na processadora para receber pagamentos recorrentes.

O lojista conta com recursos diferenciados para modelar sua cobrança de acordo com o seu negócio, tais como: parametrização e alteração de periodicidade, data de início e fim, quantidade de tentativas, intervalo entre elas, entre outros.

Vendas recorrentes com cartão de crédito não exigem CVV.

### Autorizar uma transação recorrente

Adicione o nó `RecurrentPayment` ao nó `Payment` para agendar as recorrência futuras ao autorizar uma transação pela primeira vez na série de recorrências.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{
    [...]
    "Payment": {
        "Provider":"Simulado",
        "Type":"CreditCard",
        "Amount": 10000,
        "Installments": 1,
        "CreditCard": {
            "CardNumber":"4551870000000181",
            "Holder":"Nome do Portador",
            "ExpirationDate":"12/2021",
            "SecurityCode":"123",
            "Brand":"Visa"
        },
        "RecurrentPayment": {
            "AuthorizeNow":"true",
            "EndDate":"2019-12-31",
            "Interval":"Monthly"
        }
    }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    [...]
    "Payment": {
        "Provider":"Simulado",
        "Type":"CreditCard",
        "Amount": 10000,
        "Installments": 1,
        "CreditCard": {
            "CardNumber":"4551870000000181",
            "Holder":"Nome do Portador",
            "ExpirationDate":"12/2021",
            "SecurityCode":"123",
            "Brand":"Visa"
        },
        "RecurrentPayment": {
            "AuthorizeNow":"true",
            "EndDate":"2019-12-31",
            "Interval":"Monthly"
        }
    }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.RecurrentPayment.EndDate`|Texto |10 |Não|Data para termino da recorrência|
|`Payment.RecurrentPayment.Interval`|Texto |10 |Não|Intervalo da recorrência.<br /><ul><li>Monthly (Default) </li><li>Bimonthly </li><li>Quarterly </li><li>SemiAnnual </li><li>Annual</li></ul> |
|`Payment.RecurrentPayment.AuthorizeNow`|Booleano |--- |Sim|Se true, autoriza no momento da requisição. false para agendamento futuro|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|

#### Resposta

```json

{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "ProofOfSale": "5646418",
    "AcquirerTransactionId": "0511045646418",
    "AuthorizationCode": "100024",
    "PaymentId": "067f73ce-62fb-4d76-871d-0bcbb88fbd22",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 16:56:46",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    "RecurrentPayment": {
      "RecurrentPaymentId": "808d3631-47ca-43b4-97f5-bd29ab06c271",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-06-11",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
    }
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "ProofOfSale": "5646418",
    "AcquirerTransactionId": "0511045646418",
    "AuthorizationCode": "100024",
    "PaymentId": "067f73ce-62fb-4d76-871d-0bcbb88fbd22",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 16:56:46",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    "RecurrentPayment": {
      "RecurrentPaymentId": "808d3631-47ca-43b4-97f5-bd29ab06c271",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-06-11",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
    }
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|ID que representa a recorrência, utilizada para consultas e alterações futuras |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data de quando acontecerá a próxima recorrência |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrência. |Texto |10 |<ul><li>Monthly</li><li>Bimonthly </li><li>Quarterly </li><li>SemiAnnual </li><li>Annual</li></ul> |
|`AuthorizeNow`|Booleano para saber se a primeira recorrencia já vai ser Autorizada ou não. |Booleano |--- |true ou false |

### Agendamento de uma recorrência

Diferente da recorrência anterior, este exemplo não autoriza imediatamente, mas agenda uma autorização futura. 

Para programar a primeira transação da série de recorrência, passe o parâmetro `Payment.RecurrentPayment.AuthorizeNow` como _"false"_ e adicione o parâmetro `Payment.RecurrentPayment.StartDate`.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{
   [...]
   "Payment":{
     "Provider":"Simulado",
     "Type":"CreditCard",
     "Amount":10000,
     "Installments":1,
     "CreditCard":{
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
     },
     "RecurrentPayment":{
       "AuthorizeNow":"false",
       "StartDate":"2017-12-31",
       "EndDate":"2019-12-31",
       "Interval":"Monthly"
     }
   }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   [...]
   "Payment":{
     "Provider":"Simulado",
     "Type":"CreditCard",
     "Amount":10000,
     "Installments":1,
     "CreditCard":{
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
     },
     "RecurrentPayment":{
       "AuthorizeNow":"false",
       "StartDate":"2017-12-31",
       "EndDate":"2019-12-31",
       "Interval":"Monthly"
     }
   }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.RecurrentPayment.StartDate`|Texto |10 |Não|Data para início da recorrência|
|`Payment.RecurrentPayment.EndDate`|Texto |10 |Não|Data para termino da recorrência|
|`Payment.RecurrentPayment.Interval`|Texto |10 |Não|Intervalo da recorrência.<br /><ul><li>Monthly (Default) </li><li>Bimonthly </li><li>Quarterly </li><li>SemiAnnual </li><li>Annual</li></ul> |
|`Payment.RecurrentPayment.AuthorizeNow`|Booleano |--- |Sim|Se true, autoriza no momento da requisição. false para agendamento futuro|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|

#### Resposta

```json

{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Undefined"
    },
    "Type": "CreditCard",
    "Amount": 10000,
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "Status": 20,
    "RecurrentPayment": {
      "RecurrentPaymentId": "32703035-7dfb-4369-ac53-34c7ff7b84e8",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-12-31",
      "StartDate": "2017-12-31",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
      "AuthorizeNow": false
    }
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Undefined"
    },
    "Type": "CreditCard",
    "Amount": 10000,
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "Status": 20,
    "RecurrentPayment": {
      "RecurrentPaymentId": "32703035-7dfb-4369-ac53-34c7ff7b84e8",
      "ReasonCode": 0,
      "ReasonMessage": "Successful",
      "NextRecurrency": "2017-12-31",
      "StartDate": "2017-12-31",
      "EndDate": "2019-12-31",
      "Interval": "Monthly",
      [...]
      "AuthorizeNow": false
    }
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|Campo Identificador da próxima recorrência. |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data da próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`StartDate`|Data do inicio da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrência. |Texto |10 |<ul><li>Monthly</li><li>Bimonthly </li><li>Quarterly </li><li>SemiAnnual </li><li>Annual</li></ul> |
|`AuthorizeNow`|Booleano para saber se a primeira recorrencia já vai ser Autorizada ou não. |Booleano |--- |true ou false |

### Alterar dados do comprador

Para alterar os dados do comprador em uma recorrência já existente, basta fazer um PUT conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Customer</span></aside>

```json

{  
  "Name":"Outro nome do Comprador",
  "Email":"outrocomprador@braspag.com.br",
  "Birthdate":"1999-12-12",
  "Identity":"0987654321",
  "IdentityType":"CPF",
  "Address":{
      "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      },
   "DeliveryAddress":{  
      "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      }
    }
}

```

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Customer"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{   
    "Name":"Outro nome do Comprador",
    "Email":"outrocomprador@braspag.com.br",
    "Birthdate":"1999-12-12",
    "Identity":"0987654321",
    "IdentityType":"CPF",
    "Address":{  
    "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
   },
   "DeliveryAddress":{  
    "Street":"Avenida Brigadeiro Faria Lima",
      "Number":"1500",
      "Complement":"AP 201",
      "ZipCode":"05426200",
      "City":"São Paulo",
      "State":"SP",
      "Country":"BRA",
      "District":"Alphaville"
      }
}
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|
|`Customer.Name`|Nome do Comprador. |Texto |255|Sim|
|`Customer.Email`|Email do Comprador. |Texto |255|Não|
|`Customer.Birthdate`|Data de nascimento do Comprador. |Date |10 |Não|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do Cliente. |Texto |14 |Não|
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador (CFP/CNPJ)|
|`Customer.Address.Street`|Endereço do Comprador. |Texto |255 |Não|
|`Customer.Address.Number`|Número do endereço do Comprador. |Texto |15 |Não|
|`Customer.Address.Complement`|Complemento do endereço do comprador|Texto |50 |Não|
|`Customer.Address.ZipCode`|CEP do endereço do Comprador. |Texto |9 |Não|
|`Customer.Address.City`|Cidade do endereço do Comprador. |Texto |50 |Não|
|`Customer.Address.State`|Estado do endereço do Comprador. |Texto |2 |Não|
|`Customer.Address.Country`|Pais do endereço do Comprador. |Texto |35 |Não|
|`Customer.Address.District`|Bairro do Comprador. |Texto |50 |Não|
|`Customer.DeliveryAddress.Street`|Endereço do Comprador. |Texto |255 |Não|
|`Customer.DeliveryAddress.Number`|Número do endereço do Comprador. |Texto |15 |Não|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço do Comprador. |Texto |50 |Não|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço do Comprador. |Texto |9 |Não|
|`Customer.DeliveryAddress.City`|Cidade do endereço do Comprador. |Texto |50 |Não|
|`Customer.DeliveryAddress.State`|Estado do endereço do Comprador. |Texto |2 |Não|
|`Customer.DeliveryAddress.Country`|Pais do endereço do Comprador. |Texto |35 |Não|
|`Customer.DeliveryAddress.District`|Bairro do Comprador. |Texto |50 |Não|

#### Resposta

```shell

HTTP Status 200

```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar a data final da recorrência

Para alterar a data final da recorrência já existente, basta fazer um PUT conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate</span></aside>

```json

"2021-01-09"

```

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2021-01-09"
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|
|`EndDate`|Data para termino da recorrência|Texto |10 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar o intervalo da recorrência

Para alterar o Intervalo de uma recorrência já existente, basta fazer um PUT conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Interval</span></aside>

```json

6

```

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Interval"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
6
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|
|`Interval`|Intervalo da recorrência. <ul><li>Monthly</li><li>Bimonthly </li><li>Quarterly </li><li>SemiAnnual </li><li>Annual</li></ul>|Texto |2 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar o dia da recorrência

Para modificar o dia de vencimento de uma recorrência já existente, basta fazer um PUT conforme o exemplo.

<aside class="notice"><strong>Regra:</strong> Se o novo dia informado for depois do dia atual, iremos atualizar o dia da recorrência com efeito na próxima recorrência Ex.: Hoje é dia 5, e a próxima recorrência é dia 25/05. Quando eu atualizar para o dia 10, a data da próxima recorrência será dia10/05. Se o novo dia informado for antes do dia atual, iremos atualizar o dia da recorrência, porém este só terá efeito depois que a próxima recorrência for executada com sucesso. Ex.: Hoje é dia 5, e a próxima recorrência é dia 25/05. Quando eu atualizar para o dia 3, a data da próxima recorrência permanecerá dia 25/05, e após ela ser executada, a próxima será agendada para o dia 03/06. Se o novo dia informado for antes do dia atual, mas a próxima recorrência for em outro mês, iremos atualizar o dia da recorrência com efeito na próxima recorrência. Ex.: Hoje é dia 5, e a próxima recorrência é dia 25/09. Quando eu atualizar para o dia 3, a data da próxima recorrência será 03/09</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay</span></aside>

```json

16

```

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
16
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|
|`RecurrencyDay`|Dia da Recorrência|Número |2 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar o valor da transação da recorrência

Para modificar o valor da transação de uma recorrência já existente, basta fazer um PUT conforme o exemplo.

#### Requsição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Amount</span></aside>

```json

156

```

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Amount"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
156
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|
|`Payment.Amount`|Valor do Pedido em centavos: 156 equivale a R$ 1,56|Número|15|Sim|

<aside class="warning">Essa alteração só afeta a data de pagamento da próxima recorrência.</aside>

#### Resposta

```shell

HTTP Status 200

```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar a data do próximo Pagamento

Para alterar somente a data do próximo pagamento, basta fazer um PUT conforme o exemplo. 

Esta operação modifica somente a data do próximo pagamento, ou seja, a recorrências futuras permanecerão com as características originais.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate</span></aside>

```json

"2017-06-15"

```

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2016-06-15"
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|
|`NextPaymentDate`|Data de pagamento da próxima recorrência|Texto |10 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar os dados de Pagamento da recorrência

Durante o ciclo de vida de uma recorrência, é possível alterar:

* Processadora (de Rede para Cielo, por exemplo)
* Cartão (em caso de cartão vencido)
* Meio de pagamento (de Cartão para Boleto e vice e versa)
 
Para alterar os dados de pagamento, basta fazer um PUT conforme o exemplo.

<aside class="notice"><strong>Atenção:</strong> Essa alteração afeta a todos os dados do nó Payment. Então para manter os dados anteriores você deve informar os campos que não vão sofrer alterações com os mesmos valores que já estavam salvos.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Payment</span></aside>

```json

{  
   "Type":"CreditCard",
   "Amount":"20000",
   "Installments":3,
   "Country":"USA",
   "Currency":"USD",
   "SoftDescriptor":"Mensagem",
   "Provider":"Simulado",
   "CreditCard":{  
      "Brand":"Master",
      "Holder":"Nome do Portador",
      "CardNumber":"4111111111111111",
      "ExpirationDate":"05/2019"
      },
   "Credentials": {
      "code": "9999999",
      "key": "D8888888",
      "password": "LOJA9999999",
      "username": "#Braspag2018@NOMEDALOJA#",
      "signature": "001"
      }
}

```

```shell

curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Payment"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "Type":"CreditCard",
   "Amount":"20000",
   "Installments":3,
   "Country":"USA",
   "Currency":"USD",
   "SoftDescriptor":"Mensagem",
   "Provider":"Simulado",
   "CreditCard":{  
      "Brand":"Master",
      "Holder":"Nome do Portador",
      "CardNumber":"4111111111111111",
      "ExpirationDate":"05/2019"
      },
   "Credentials": {
      "code": "9999999",
      "key": "D8888888",
      "password": "LOJA9999999",
      "username": "#Braspag2018@NOMEDALOJA#",
      "signature": "001"
      }
}
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|
|`Payment.Provider`|Nome da provedora de Meio de Pagamento|Texto|15|Sim|
|`Payment.Type`|Tipo do Meio de Pagamento. |Texto |100|Sim|
|`Payment.Amount`|Valor do Pedido (ser enviado em centavos)|Número |15 |Sim|
|`Payment.Installments`|Número de Parcelas|Número |2 |Sim|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador|Texto |13|Não|
|`CreditCard.CardNumber`|Número do Cartão do comprador|Texto |16|Sim|
|`CreditCard.Holder`|Nome do Comprador impresso no cartão|Texto |25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão|Texto |7 |Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão|Texto |4 |Sim|
|`CreditCard.Brand`|Bandeira do cartão|Texto|10|Sim|
|`Payment.Credentials.Code`|afiliação gerada pela adquirente|Texto|100|Sim|
|`Payment.Credentials.Key`|chave de afiliação/token gerado pela adquirente|Texto|100|Sim|
|`Payment.Credentials.Username`|usuário gerado no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado.)|Texto|50|Não|
|`Payment.Credentials.Password`|senha gerada no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado.)|Texto|50|Não|
|`Payment.Credentials.Signature`|Enviar o TerminalID da adquirete Global Payments (aplicável para lojistas filiados a esta adquirente). Ex.: 001|Texto|3|Não|

#### Resposta

```shell
HTTP Status 200
```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Desabilitando um Pedido recorrente

Para desabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Deactivate</span></aside>

```shell
curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Deactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|

#### Resposta

```shell
HTTP Status 200
```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Reabilitando um Pedido recorrente

Para Reabilitar um pedido recorrente, basta fazer um Put conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate</span></aside>

```shell
curl
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Numero de identificação da Recorrência. |Texto |50 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Veja o Anexo HTTP Status Code para a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Transação com Renova Fácil

O Renova fácil é um serviço desenvolvido pela CIELO junto com os bancos emissores, cujo objetivo é aumentar a taxa de conversão de vendas recorrentes com cartão de crédito. 

Através da identificação de cartões vencidos no momento da transação, é feita a autorização com um novo cartão e é retornado o novo cartão para armazenagem.

Para utilizar o Renova Fácil, é necessário que o serviço esteja habilitado na CIELO. Não é necessário enviar nenhuma informação extra na requisição de autorização, porém a resposta terá um nó a mais conforme exemplo abaixo.

Bancos Emissores participantes: Bradesco, Banco do Brasil, Santander, Panamericano, Citibank

#### Resposta

```json
{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0183",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2016",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "AcquirerTransactionId": "0512105630844",
    "NewCard": {
      "CardNumber": "4551870000512353",
      "Holder": "Nome do Portador",
      "ExpirationDate": "05/2020",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-12 10:56:30",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 15,
    "ReasonMessage": "CardExpired",
    "Status": 3,
    "ProviderReturnCode": "57",
    "ProviderReturnMessage": "Card Expired",
    [...]
  }
}

```

```shell

{
  [...]
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0183",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2016",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "AcquirerTransactionId": "0512105630844",
    "NewCard": {
      "CardNumber": "4551870000512353",
      "Holder": "Nome do Portador",
      "ExpirationDate": "05/2020",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "PaymentId": "ca81c3c9-2dfa-4e6e-9c77-37e33a77ac84",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-12 10:56:30",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 15,
    "ReasonMessage": "CardExpired",
    "Status": 3,
    "ProviderReturnCode": "57",
    "ProviderReturnMessage": "Card Expired",
    [...]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`NewCard.CardNumber`|Novo Número do Cartão do comprador|Texto|16|
|`NewCard.Holder`|Nome do portador impresso no novo cartão|Texto|25|
|`NewCard.ExpirationDate`|Data de validade impresso no novo cartão|Texto|7|
|`NewCard.SecurityCode`|Código de segurança impresso no verso do novo cartão|Texto|4|
|`NewCard.Brand`|Bandeira do novo cartão|Texto|10 |

## Transferência Eletrônica

Semelhante ao Pagamento com Cartão de Débito, a Transferência Eletrônica conecta o consumidor ao seu banco para autenticar uma venda à débito. A diferença entre ambos é que as Transferências não são submetidas à processadora nem dependem de dados de cartão.

### Criando uma transação

Para criar uma venda, é necessário fazer um POST para o recurso Payment conforme o exemplo.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
    "MerchantOrderId":"2017051109",
    "Customer":
    {  
        "Name":"Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Address":
        {
             "Street":"Alameda Xingu",
             "Number":"512",
             "Complement":"27 andar",
             "ZipCode":"12345987",
             "City":"São Paulo",
             "State":"SP",
             "Country":"BRA",
             "District":"Alphaville"
         }
  },
    "Payment":
    {  
        "Provider":"Bradesco",
        "Type":"EletronicTransfer",
        "Amount":10000,
        "ReturnUrl":"http://www.braspag.com.br"
    }
}
```

```shell
curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
    "MerchantOrderId":"2017051109",
    "Customer":
    {  
        "Name":"Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Address":
        {
             "Street":"Alameda Xingu",
             "Number":"512",
             "Complement":"27 andar",
             "ZipCode":"12345987",
             "City":"São Paulo",
             "State":"SP",
             "Country":"BRA",
             "District":"Alphaville"
        }
    },
    "Payment":
    {  
        "Provider":"Bradesco",
        "Type":"EletronicTransfer",
        "Amount":10000,
        "ReturnUrl":"http://www.braspag.com.br"
    }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API. |Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`MerchantOrderId`|Numero de identificação do Pedido. |Texto |50 |Sim|
|`Customer.Name`|Nome do comprador|Texto|255|Sim|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do Cliente| Texto |14 |Sim|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ)|Texto|255|Não|
|`Customer.Email`|Email do comprador|Texto|255|Não|
|`Customer.Address.Street`|Endereço de contato do comprador|Texto|255|Sim|
|`Customer.Address.Number`|Número endereço de contato do comprador|Texto|15|Sim|
|`Customer.Address.Complement`|Complemento do endereço de contato do Comprador|Texto|50|Sim|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador|Texto|9|Sim|
|`Customer.Address.City`|Cidade do endereço de contato do comprador|Texto|50|Sim|
|`Customer.Address.State`|Estado do endereço de contato do comprador|Texto|2|Sim|
|`Customer.Address.Country`|Pais do endereço de contato do comprador|Texto|35|Sim|
|`Customer.Address.District`|Bairro do endereço de contato do comprador|Texto|35|Sim|
|`Payment.Type`|Tipo do Meio de Pagamento. |Texto |100 |Sim|
|`Payment.Amount`|Valor do Pedido (ser enviado em centavos)|Número |15 |Sim|
|`Payment.Provider`|Nome da provedora de Meio de Pagamento|Texto |15 |---|

#### Resposta

```json
{
    "MerchantOrderId": "2017051109",
    "Customer": {
        "Name":"Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Address":
        {"Street":"Alameda Xingu",
        "Number":"512",
        "Complement":"27 andar",
        "ZipCode":"12345987",
        "City":"São Paulo",
        "State":"SP",
             "Country":"BRA",
             "District":"Alphaville"
            }
    },
    "Payment": {
        "Url": "https://xxx.xxxxxxx.xxx.xx/post/EletronicTransfer/Redirect/{PaymentId}",
        "PaymentId": "765548b6-c4b8-4e2c-b9b9-6458dbd5da0a",
        "Type": "EletronicTransfer",
        "Amount": 10000,
        "ReceivedDate": "2015-06-25 09:37:55",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Bradesco",
        "ReturnUrl": "http://www.braspag.com.br",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 0,
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
            }
        ]
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantOrderId": "2017051109",
    "Customer": {
        "Name": "Comprador Teste",
    },
    "Payment": {
        "Url": "https://xxx.xxxxxxx.xxx.xx/post/EletronicTransfer/Redirect/{PaymentId}",
        "PaymentId": "765548b6-c4b8-4e2c-b9b9-6458dbd5da0a",
        "Type": "EletronicTransfer",
        "Amount": 10000,
        "ReceivedDate": "2015-06-25 09:37:55",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Bradesco",
        "ReturnUrl": "http://www.braspag.com.br",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 0,
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Url`|URL para a qual o comprador deverá ser redirecionado para autenticação da Transferência Eletrônica |Texto |256 |Url de Autenticação|
|`Status`|Status da Transação|Byte|2|Ex. 1|

## E-Wallets

### O que são e-Wallets (Carteiras Digitais)

São repositórios de cartões e dados de pagamentos para consumidores do e-commerce e mundo físico. As Carteiras digitais permitem que um consumidor realize o cadastro de seus dados de pagamento, tornando o processo de compra mais conveniente e seguro.

> *Para utilizar carteiras no Pagador, o lojista deverá possuir as carteiras integradas em seu checkout*. 

Para maiores informações, entre em contato com o provedor de sua preferência para contratar o serviço. 

### E-Wallets Disponíveis

O Pagador possui suporte para:

|| Carteira                                                           | | 
|-|:------------------------------------------------------------------:|-|
|| [*Apple Pay*](https://www.apple.com/br/apple-pay/)                 | |
|| [*Samsung Pay*](https://www.samsung.com.br/samsungpay/)            | |
|| [*Android Pay*](https://www.android.com/intl/pt-BR_br/pay/)        | | 
|| [*VisaCheckout*](https://vaidevisa.visa.com.br/site/visa-checkout) | | 
|| [*MasterPass*](https://masterpass.com/pt-br/)                      | | 

<aside class="notice"><strong>Atenção:</strong> Quando o nó “Wallet” for enviado na requisição, o nó “CreditCard” passa a ser opcional.</aside>

<aside class="notice"><strong>Atenção:</strong> Para o cartão de débito, quando for enviado na requisição o nó “Wallet”, será necessário o nó “DebitCard” contendo a “ReturnUrl”.</aside>

### Integração

#### Requisição Padrão

```json
{
  "MerchantOrderId": "2014111708",
  "Customer": {
    "Name": "Exemplo Wallet Padrão",
    "Identity": "11225468954",
    "IdentityType": "CPF"
  },
  "Payment": {
    "Type": "CreditCard",
    "Amount": 100,
    "Provider": "Cielo",
    "Installments": 1,
    "Currency": "BRL",
    "Wallet": {
      "Type": "TIPO DE WALLET",
      "WalletKey": "IDENTIFICADOR DA LOJA NA WALLET",
      "AdditionalData": {
        "EphemeralPublicKey": "TOKEN INFORMADO PELA WALLET"
      }
    }
  }
}

```

| Propriedade                | Tipo   | Tamanho | Obrigatório | Descrição                                                                                               |
|----------------------------|--------|---------|-------------|---------------------------------------------------------------------------------------------------------|
| `MerchantId`               | Guid   | 36      | Sim         | Identificador da loja na Braspag                                                                        |
| `MerchantKey`              | Texto  | 40      | Sim         | Chave Publica para Autenticação Dupla na Braspag                                                        |
| `RequestId`                | Guid   | 36      | Não         | Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.  |
| `MerchantOrderId`          | Texto  | 50      | Sim         | Numero de identificação do Pedido.                                                                      |
| `Customer.Name`            | Texto  | 255     | Não         | Nome do Comprador.                                                                                      |
| `Customer.Status`          | Texto  | 255     | Não         | Status de cadastro do comprador na loja (NEW / EXISTING)                                                |
| `Payment.Type`             | Texto  | 100     | Sim         | Tipo do Meio de Pagamento.                                                                              |
| `Payment.Amount`           | Número | 15      | Sim         | Valor do Pedido (ser enviado em centavos).                                                              |
| `Payment.Provider`         | Texto  | 15      | Sim         | Somente providers Cielo (`Cielo` / `Cielo30`)                                                           |
| `Payment.Installments`     | Número | 2       | Sim         | Número de Parcelas.                                                                                     |
| `Wallet.Type`              | Texto  | --     | Sim         | indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass` |
| `Wallet.Walletkey`         | Texto  | --     | Sim         | Chave criptografica que identifica lojas nas Wallets - Ver tabela WalletKey para mais informações       |
| `Wallet.AdditionalData.EphemeralPublicKey`| Texto  | --    | Sim  | Token retornado pela Wallet. Deve ser enviado em Integrações: `ApplePay`                          |
| `Wallet.AdditionalData.capturecode`       | Texto  | --    | Sim  | Código informado pela `MasterPass` ao lojista                                                    |                                                      
| `Wallet.AdditionalData.Signature`| Texto  | --    | Sim  | Token retornado pela Wallet. Deve ser enviado em Integrações: `AndroidPay`                          |

##### Walletkey

Formato de `WalletKeys` que devem ser repassados ao Pagador API

| Carteira       | Exemplo        |.|
|----------------|----------------|-|
| *Apple Pay*    | 9zcCAciwoTS+qBx8jWb++64eHT2QZTWBs6qMVJ0GO+AqpcDVkxGPNpOR/D1bv5AZ62+5lKvucati0+eu7hdilwUYT3n5swkHuIzX2KO80Apx/SkhoVM5dqgyKrak5VD2/drcGh9xqEanWkyd7wl200sYj4QUMbeLhyaY7bCdnnpKDJgpOY6J883fX3TiHoZorb/QlEEOpvYcbcFYs3ELZ7QVtjxyrO2LmPsIkz2BgNm5f+JaJUSAOectahgLZnZR+easdhghrsa/E9A6DwjMd0fDYnxjj0bQDfaZpBPeGGPFLu5YYn1IDc   |.|
| *Samsung Pay*  | eyJhbGciOiJSU0ExXzUiLCJraWQiOiIvam1iMU9PL2hHdFRVSWxHNFpxY2VYclVEbmFOUFV1ZUR5M2FWeHBzYXVRPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.cCsGbqgFdzVb1jhXNR--gApzoXH-fdafddfa-Bo_utsmDN_DuGm69Kk2_nh6txa7ML9PCI59LFfOMniAf7ZwoZUBDCY7Oh8kx3wsZ0kxNBwfyLBCMEYzET0qcIYxePezQpkNcaZ4oogmdNSpYY-KbZGMcWpo1DKhWphDVp0lZcLxA6Q25K78e5AtarR5whN4HUAkurQ.CFjWpHkAVoLCG8q0.NcsTuauebemJXmos_mLMTyLhEHL-p5Wv6J88WkgzyjAt_DW7laiPMYw2sqRXkOiMJLwhifRzbSp8ZgJBM25IX05dKKSS4XfFjJQQjOBHw6PYtEF5pUDMLHML3jcddCrX07abfef_DuP41PqOQYsjwesLZ8XsRj-R0TH4diOZ_GQop8_oawjRIo9eJr9Wbtho0h8kAzHYpfuhamOPT718EaGAY6SSrR7t6nBkzGNkrKAmHkC7aRwe.AbZG53wRqgF0XRG3wUK_UQ`   |.|
| *Android Pay*  | {\"encryptedMessage\":\"0mXBb94Cy9JZhMuwtrBhMjXb8pDslrNsN5KhcEqnowOINqJgjXHD36KcCuzpQQ4cDAe64ZLmk2N3UBGXsN9hMMyeMakXlidVmteE+QMaNZIor048oJqlUIFPD54B/ic8zCdqq3xnefUmyKQe0I03x57TcEA9xAT/E4x3rYfyqLFUAEtu2lT0GwTdwgrsT8pKoTldHIgP+wVNTjrKvJrB4xM/Bhn6JfcSmOzFyI6w37mBU71/TK761nYOSxt7z1bNWSLZ4b8xBu1dlRgen2BSlqdafuQjV3UZjr6ubSvaJ8NiCh5FD/X013kAwLuLALMS2uAFS9j8cZ6R6zNIi13fK6Fe4ACbFTHwLzSNZjQiaRDb6MlMnY8/amncPIOXzpirb5ScIz8EZUL05xd+3YWVTVfpqgFo1eaaS+wZdUyRG0QEgOsr6eLBoH8d5lfV9Rx6XdioorUuT7s1Yqc0OJZO+fhBt6X0izE9hBGTexdZyg\\u003d\\u003d\",\"ephemeralPublicKey\":\"BMdwrkJeEgCOtLevYsN3MbdP8xbOItXiTejoB6vXy0Kn0ZM10jy4Aasd6jTSxtoxoTpFydLhj5kzoOhbw2OzZu0\\u003d\",\"tag\":\"yAQIjWZ0VuCC7SWyYwc4eXOzpSUKhZduF9ip0Ji+Gj8\\u003d\"}  |.|
| *VisaCheckout* | 1140812334225873901   |.|
| *Masterpass* | a561da1c18a89cfdafas875f9d43fc46cd9bf3e1   |.|

##### EphemeralPublicKey

Formato de `EphemeralPublicKey` que devem ser repassados ao Pagador API

| Carteira       | Exemplo                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------|
| *Apple Pay*    | `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEoedz1NqI6hs9hEO6dBsnn0X0xp5/DKj3gXirjEqxNIJ8JyhGxVB3ITd0E+6uG4W6Evt+kugG8gOhCBrdUU6JwQ==`   |

Formato de `Signature` que devem ser repassados ao Pagador API

| Carteira       | Exemplo                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------|
| *Android Pay*  | `MEUCIQCGQLOmwxe5eFMSuTcr4EcwSZu35fB0KlCWcVop6ZxxhgIgbdtNHThSlynOopfxMIxkDs0cLh2NFh5es+J5uDmaViA\u003d`                                       |

#### Respostas

```json
{
    "MerchantOrderId": "2014111703",
    "Customer": {
        "Name": "[Guest]"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "453211******1521",
            "Holder": "BJORN IRONSIDE",
            "ExpirationDate": "08/2020",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "0319040817883",
        "ProofOfSale": "817883",
        "AuthorizationCode": "027795",
        "Wallet": {
            "Type": "TIPO DE WALLET",
            "WalletKey": "IDENTIFICADOR DA LOJA NA WALLET",
            "Eci": 0,
            "AdditionalData": {
                "EphemeralPublicKey": "TOKEN INFORMADO PELA WALLET"
            },                
        },
        "SoftDescriptor": "123456789ABCD",
        "Amount": 100,
        "ReceivedDate": "2018-03-19 16:08:16",
        "Status": 1,
        "IsSplitted": false,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "4",
        "PaymentId": "e57b09eb-475b-44b6-ac71-01b9b82f2491",
        "Type": "CreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491"
            },
            {
                "Method": "PUT",
                "Rel": "capture",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/capture"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/void"
            }
        ]
    }
}
```

| Propriedade         | Descrição                                                                                                                      | Tipo  | Tamanho | Formato                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------|-------|---------|--------------------------------------|
| `ProofOfSale`       | Número da autorização, identico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Id da transação na adquirente.                                                                                                 | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancaria do portador - Disponivel apenas para VISA/MASTER - nao permite caracteres especiais | Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo Identificador do Pedido.                                                                                                 | Guid  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | Eletronic Commerce Indicator. Representa o quão segura é uma transação.                                                        | Texto | 2       | Exemplos: 7                          |
| `Status`            | Status da Transação.                                                                                                           | Byte  | 2       | Ex. 1                                |
| `ReturnCode`        | Código de retorno da Adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da Adquirência.                                                                                            | Texto | --     | Texto alfanumérico                   |
| `Type`              |  indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass`                       | Texto | --     | Texto alfanumérico                   |
| `Walletkey`         | Chave criptografica que identifica lojas nas Wallets - Ver tabela WalletKey para mais informações                              | Texto | --     | Ver tabela `WalletKey`               |       
| `AdditionalData.EphemeralPublicKey` | Token retornado pela Wallet. Deve ser enviado em Integrações: `ApplePay`                                       | Texto | --     | Ver Tabela `EphemeralPublicKey`      |  
| `AdditionalData.capturecode`        | Código informado pela `MasterPass` ao lojista                                                                  | Texto | --     | 3                                    | 
| `AdditionalData.Signature` | Token retornado pela Wallet. Deve ser enviado em Integrações: `AndroidPay`                                               | Texto | --     | Ver Tabela `Signature`      |  

### Exemplos

#### Apple Pay

<aside class="notice"><strong>Pré-requisitos:</strong> Para utilização da Apple Pay é necessário que a loja já esteja cadastrada junto à Apple e possua um MerchantIdentifier. Também é necessário o upload de um certificado CSR no formato PEM fornecido pela Braspag. Abaixo segue o passo a passo para disponibilizar a Apple Pay em sua loja.</aside>

##### Passo 1. Contratação na Apple

É necessário que a Apple Pay seja contratada na Apple através do contato comercial abaixo (o contato deve ser feito em inglês):

*Shawn Munyon (smunyon@apple.com)*

##### Passo 2. Obtenção do MerchantIdentifier

Uma vez que a contratação estiver efetivada, receberá acesso ao painel "Apple Developer", e será necessária a criação do `MerchantIdentifier`. Para tanto, realize os passos abaixo: 
1. Faça login em [Apple Developer](https://developer.apple.com/)
2. Selecione **Certificate, IDs & Profile**
3. Dentro da área "Identifiers" clique em "Merchant IDs"
4. Clique no **+** no canto direito, abaixo do "Registering a Merchant ID"
5. Defina a descrição do MerchantID e o identificador. Exemplo.: "merchant.com.BRASPAG.merchantAccount"
6. Clique em "continuar" e verifique se as informações inseridas estão corretas
7. Finalize o processo. 

<P>O `MerchantIdentifier` deve ser enviado à Braspag por meio do [canal de suporte](https://suporte.braspag.com.br/hc/pt-br/restricted?return_to=https%3A%2F%2Fsuporte.braspag.com.br%2Fhc%2Fpt-br) para criação de um **Certificado CSR no formato PEM**. 

##### Passo 3. Upload do Certificado CSR

Após enviar o `MerchantIdentifier` para a equipe da Braspag, a loja receberá o certificado de extensão `PEM` e deverá seguir os seguintes passos: 

1. Faça login em [Apple Developer](https://developer.apple.com/)
2. Selecione **Certificate, IDs & Profiles**
![Aplle Pay]({{ site.baseurl_root }}/images/apple-paymid.jpg)
3. Realize o upload do certificado
![Aplle Pay]({{ site.baseurl_root }}/images/apple-pay.jpg)
4. Finalize o processo 

<P>O Certificado PEM contém o código CSR solicitado pela Apple. 

<P>Formato de um PEM:

<P>-----BEGIN CERTIFICATE REQUEST-----

<P>MIHyMIGYAgEAMDgxCzAJBgNVBAYTAkJSMRAwDgYDVQQKDAdicmFzcGFnMRcwFQYDVQQDDA5icmFzcGFnLmNvbS5icjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABFUL1F/ue9/T5SrEyE1wTPQxk5x3ZHEelB7VHObDTW7pjauFrE88J25w7iRCKNP6u2fPmBtM9nY30/xQCgBH9aUwCgYIKoZIzj0EAwIDSQAwRgIhAPyF47xmfy+9czlr0a94eSd/YG27G8akujpkIUd56qWmAiEAqV6aSVISmH9NveOKGJdZ6VvkbELK2uqu2yCpg/lfYc8=

<P>-----END CERTIFICATE REQUEST---

##### Passo 4. Integração com Apple Pay

A integração requer dois passos: o primeiro é a integração direta com a solução da Apple, para disponibilizar o botão "Pagar com Apple Pay" em seu site ou aplicativo. Para tanto, a equipe da Apple fará um acompanhamento de perto. [Clique aqui](https://developer.apple.com/apple-pay/) para acessar a documentação técnica da Apple.  

<P>Nesta etapa, não é preciso realizar o processo de criptografia de dados retornados pela Apple. Este trabalho será realizado pela Braspag, através dos procedimentos descritos na próxima etapa.  

##### Passo 5. Integração com Pagador (decriptografia e autorização)

O segundo passo de integração é efetivar o fluxo de autorização via gateway da Braspag (Pagador). Para tanto, é necessário fornecer os dados recebidos no fluxo com a Apple Pay, inclusive WalletKey e EphemeralPublicKey.

##### Requisição

Exemplo de Requisição padrão *Apple Pay*

> É necessário que a loja ja possua cadastro e uma integração Apple Pay, caso contrario não será possivel a integração com a API

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
{
  "MerchantOrderId": "6242-642-723",
  "Customer": {
    "Name": "Exemplo Wallet Padrão",
    "Identity": "11225468954",
    "IdentityType": "CPF"
  },
  "Payment": {
    "Type": "CreditCard",
    "Amount": 1100,
    "Provider": "Cielo",
    "Installments": 1,
    "Currency": "BRL",
    "Wallet": {
      "Type": "ApplePay",
      "WalletKey": "9zcCAciwoTS+qBx8jWb++64eHT2QZTWBs6qMVJ0GO+AqpcDVkxGPNpOR/D1bv5AZ62+5lKvucati0+eu7hdilwUYT3n5swkHuIzX2KO80Apx/SkhoVM5dqgyKrak5VD2/drcGh9xqEanWkyd7wl200sYj4QUMbeLhyaY7bCdnnpKDJgpOY6J883fX3TiHoZorb/QlEEOpvYcbcFYs3ELZ7QVtjxyrO2LmPsIkz2BgNm5f+JaJUSAOectahgLZnZR+sRXTDtqLOJQAprs0MNTkPzF95nXGKCCnPV2mfR7z8FHcP7AGqO7aTLBGJLgxFOnRKaFnYlY2E9uTPBbB5JjZywlLIWsPKur5G4m1/E9A6DwjMd0fDYnxjj0bQDfaZpBPeGGPFLu5YYn1IDc",
      "AdditionalData": {
        "EphemeralPublicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEoedz1NqI6hs9hEO6dBsnn0X0xp5/DKj3gXirjEqxNIJ8JyhGxVB3ITd0E+6uG4W6Evt+kugG8gOhCBrdUU6JwQ=="
      }
    }
  }
}
```

| Propriedade                | Tipo   | Tamanho | Obrigatório | Descrição                                                                                               |
|----------------------------|--------|---------|-------------|---------------------------------------------------------------------------------------------------------|
| `MerchantId`               | Guid   | 36      | Sim         | Identificador da loja na Braspag                                                                        |
| `MerchantKey`              | Texto  | 40      | Sim         | Chave Publica para Autenticação Dupla na Braspag                                                        |
| `RequestId`                | Guid   | 36      | Não         | Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.  |
| `MerchantOrderId`          | Texto  | 50      | Sim         | Numero de identificação do Pedido.                                                                      |
| `Customer.Name`            | Texto  | 255     | Não         | Nome do Comprador.                                                                                      |
| `Customer.Status`          | Texto  | 255     | Não         | Status de cadastro do comprador na loja (NEW / EXISTING)                                                |
| `Payment.Type`             | Texto  | 100     | Sim         | Tipo do Meio de Pagamento.                                                                              |
| `Payment.Amount`           | Número | 15      | Sim         | Valor do Pedido (ser enviado em centavos).                                                              |
| `Payment.Provider`         | Texto  | 15      | Sim         | Somente providers Cielo (`Cielo` / `Cielo30`)                                                           |
| `Payment.Installments`     | Número | 2       | Sim         | Número de Parcelas.                                                                                     |
| `Wallet.Type`              | Texto  | 255     | Sim         | indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass` |
| `Wallet.Walletkey`         | Texto  | 255     | Sim         | Chave criptografica que representa os dados do cartão - Ver tabela WalletKey para mais informações       |
| `Wallet.AdditionalData.EphemeralPublicKey`| Texto  | 255    | Sim  | Token retornado pela Wallet. Deve ser enviado em Integrações: `ApplePay`                         |

##### Resposta

```json
{
    "MerchantOrderId": "2014111703",
    "Customer": {
        "Name": "[Guest]"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "453211******1521",
            "Holder": "BJORN IRONSIDE",
            "ExpirationDate": "08/2020",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "0319040817883",
        "ProofOfSale": "817883",
        "AuthorizationCode": "027795",
        "Wallet": {
            "Type": "ApplePay",
            "WalletKey": "9zcCAciwoTS+qBx8jWb++64eHT2QZTWBs6qMVJ0GO+AqpcDVkxGPNpOR/D1bv5AZ62+5lKvucati0+eu7hdilwUYT3n5swkHuIzX2KO80Apx/SkhoVM5dqgyKrak5VD2/drcGh9xqEanWkyd7wl200sYj4QUMbeLhyaY7bCdnnpKDJgpOY6J883fX3TiHoZorb/QlEEOpvYcbcFYs3ELZ7QVtjxyrO2LmPsIkz2BgNm5f+JaJUSAOectahgLZnZR+sRXTDtqLOJQAprs0MNTkPzF95nXGKCCnPV2mfR7z8FHcP7AGqO7aTLBGJLgxFOnRKaFnYlY2E9uTPBbB5JjZywlLIWsPKur5G4m1/E9A6DwjMd0fDYnxjj0bQDfaZpBPeGGPFLu5YYn1IDc",
            "Eci": 0,
            "AdditionalData": {
                "EphemeralPublicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEoedz1NqI6hs9hEO6dBsnn0X0xp5/DKj3gXirjEqxNIJ8JyhGxVB3ITd0E+6uG4W6Evt+kugG8gOhCBrdUU6JwQ=="
            },                
        },
        "SoftDescriptor": "123456789ABCD",
        "Amount": 100,
        "ReceivedDate": "2018-03-19 16:08:16",
        "Status": 1,
        "IsSplitted": false,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "4",
        "PaymentId": "e57b09eb-475b-44b6-ac71-01b9b82f2491",
        "Type": "CreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491"
            },
            {
                "Method": "PUT",
                "Rel": "capture",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/capture"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/void"
            }
        ]
    }
}
```

| Propriedade         | Descrição                                                                                                                      | Tipo  | Tamanho | Formato                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------|-------|---------|--------------------------------------|
| `ProofOfSale`       | Número da autorização, identico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Id da transação na adquirente.                                                                                                 | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancaria do portador - Disponivel apenas para VISA/MASTER - nao permite caracteres especiais | Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo Identificador do Pedido.                                                                                                 | Guid  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | Eletronic Commerce Indicator. Representa o quão segura é uma transação.                                                        | Texto | 2       | Exemplos: 7                          |
| `Status`            | Status da Transação.                                                                                                           | Byte  | 2       | Ex. 1                                |
| `ReturnCode`        | Código de retorno da Adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da Adquirência.                                                                                            | Texto | 512     | Texto alfanumérico                   |
| `Type`              |  indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass`                       | Texto | 255     | Texto alfanumérico                   |
| `Walletkey`         | Chave criptografica que identifica lojas nas Wallets - Ver tabela WalletKey para mais informações                              | Texto | 255     | Ver tabela `WalletKey`               |       
| `AdditionalData.EphemeralPublicKey` | Token retornado pela Wallet. Deve ser enviado em Integrações: `ApplePay`                         | Texto | 255     | Ver Tabela `EphemeralPublicKey`      |

#### Samsung Pay

##### Requisição

Exemplo de Requisição padrão *Samsung Pay*

> É necessário que a loja ja possua cadastro e uma integração Samsung Pay, caso contrario não será possivel a integração com a API

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
{
  "MerchantOrderId":"6242-642-723",
  "Customer":{
     "Name":"Exemplo Wallet Padrão",
     "Identity":"11225468954",
      "IdentityType":"CPF"
  },
  "Payment":{
     "Type":"CreditCard",
     "Amount":1,
     "Provider":"Cielo",
     "Installments":1,
     "Currency":"BRL",
     "Wallet":{
       "Type":"SamsungPay",
       "WalletKey":"eyJhbGciOiJSU0ExXzUiLCJraWQiOiIvam1iMU9PL2hHdFRVSWxHNFpxY2VYclVEbmFOUFV1ZUR5M2FWeHBzYXVRPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.cCsGbqgFdzVb1jhXNR--gApzoXH-LldMArSoG59x6i0BbI7jttqxyAdcriSy8q_77VAp3854P9kekjj54RKLrP6APDIr46DI97kjG9E99ONXImnEyamHj95ZH_AW8lvkfa09KAr4537RM8GEXyZoys2vfIW8zqjjicZ8EKIpAixNlmrFJu6-Bo_utsmDN_DuGm69Kk2_nh6txa7ML9PCI59LFfOMniAf7ZwoZUBDCY7Oh8kx3wsZ0kxNBwfyLBCMEYzET0qcIYxePezQpkNcaZ4oogmdNSpYY-KbZGMcWpo1DKhWphDVp0lZcLxA6Q25K78e5AtarR5whN4HUAkurQ.CFjWpHkAVoLCG8q0.NcsTuauebemJXmos_mLMTyLhEHL-p5Wv6J88WkgzyjAt_DW7laiPMYw2sqRXkOiMJLwhifRzbSp8ZgJBM25IX05dKKSS4XfFjJQQjOBHw6PYtEF5pUDMLHML3jcddCrX07abfef_DuP41PqOQYsjwesLZ8XsRj-R0TH4diOZ_GQop8_oawjRIo9eJr9Wbtho0h8kAzHYpfuhamOPT718EaGAY6SSrR7t6nBkzGNkrKAmHkC7aRwe.AbZG53wRqgF0XRG3wUK_UQ"
    }
  }
}

```

| Propriedade                | Tipo   | Tamanho | Obrigatório | Descrição                                                                                               |
|----------------------------|--------|---------|-------------|---------------------------------------------------------------------------------------------------------|
| `MerchantId`               | Guid   | 36      | Sim         | Identificador da loja na Braspag                                                                        |
| `MerchantKey`              | Texto  | 40      | Sim         | Chave Publica para Autenticação Dupla na Braspag                                                        |
| `RequestId`                | Guid   | 36      | Não         | Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.  |
| `MerchantOrderId`          | Texto  | 50      | Sim         | Numero de identificação do Pedido.                                                                      |
| `Customer.Name`            | Texto  | 255     | Não         | Nome do Comprador.                                                                                      |
| `Customer.Status`          | Texto  | 255     | Não         | Status de cadastro do comprador na loja (NEW / EXISTING)                                                |
| `Payment.Type`             | Texto  | 100     | Sim         | Tipo do Meio de Pagamento.                                                                              |
| `Payment.Amount`           | Número | 15      | Sim         | Valor do Pedido (ser enviado em centavos).                                                              |
| `Payment.Provider`         | Texto  | 15      | Sim         | Somente providers Cielo (`Cielo` / `Cielo30`)                                                           |
| `Payment.Installments`     | Número | 2       | Sim         | Número de Parcelas.                                                                                     |
| `Wallet.Type`              | Texto  | 255     | Sim         | indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass` |
| `Wallet.Walletkey`         | Texto  | 255     | Sim         | Chave criptografica que representa os dados do cartão - Ver tabela WalletKey para mais informações       |

##### Resposta

```json
{
    "MerchantOrderId": "2014111703",
    "Customer": {
        "Name": "[Guest]"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "453211******1521",
            "Holder": "BJORN IRONSIDE",
            "ExpirationDate": "08/2020",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "0319040817883",
        "ProofOfSale": "817883",
        "AuthorizationCode": "027795",
        "Wallet": {
            "Type": "SamsungPay",
            "WalletKey": "eyJhbGciOiJSU0ExXzUiLCJraWQiOiIvam1iMU9PL2hHdFRVSWxHNFpxY2VYclVEbmFOUFV1ZUR5M2FWeHBzYXVRPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.cCsGbqgFdzVb1jhXNR--gApzoXH-LldMArSoG59x6i0BbI7jttqxyAdcriSy8q_77VAp3854P9kekjj54RKLrP6APDIr46DI97kjG9E99ONXImnEyamHj95ZH_AW8lvkfa09KAr4537RM8GEXyZoys2vfIW8zqjjicZ8EKIpAixNlmrFJu6-Bo_utsmDN_DuGm69Kk2_nh6txa7ML9PCI59LFfOMniAf7ZwoZUBDCY7Oh8kx3wsZ0kxNBwfyLBCMEYzET0qcIYxePezQpkNcaZ4oogmdNSpYY-KbZGMcWpo1DKhWphDVp0lZcLxA6Q25K78e5AtarR5whN4HUAkurQ.CFjWpHkAVoLCG8q0.NcsTuauebemJXmos_mLMTyLhEHL-p5Wv6J88WkgzyjAt_DW7laiPMYw2sqRXkOiMJLwhifRzbSp8ZgJBM25IX05dKKSS4XfFjJQQjOBHw6PYtEF5pUDMLHML3jcddCrX07abfef_DuP41PqOQYsjwesLZ8XsRj-R0TH4diOZ_GQop8_oawjRIo9eJr9Wbtho0h8kAzHYpfuhamOPT718EaGAY6SSrR7t6nBkzGNkrKAmHkC7aRwe.AbZG53wRqgF0XRG3wUK_UQ",
            "Eci": 0
        },
        "SoftDescriptor": "123456789ABCD",
        "Amount": 100,
        "ReceivedDate": "2018-03-19 16:08:16",
        "Status": 1,
        "IsSplitted": false,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "4",
        "PaymentId": "e57b09eb-475b-44b6-ac71-01b9b82f2491",
        "Type": "CreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491"
            },
            {
                "Method": "PUT",
                "Rel": "capture",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/capture"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/void"
            }
        ]
    }
}
```

| Propriedade         | Descrição                                                                                                                      | Tipo  | Tamanho | Formato                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------|-------|---------|--------------------------------------|
| `ProofOfSale`       | Número da autorização, identico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Id da transação na adquirente.                                                                                                 | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancaria do portador - Disponivel apenas para VISA/MASTER - nao permite caracteres especiais | Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo Identificador do Pedido.                                                                                                 | Guid  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | Eletronic Commerce Indicator. Representa o quão segura é uma transação.                                                        | Texto | 2       | Exemplos: 7                          |
| `Status`            | Status da Transação.                                                                                                           | Byte  | 2       | Ex. 1                                |
| `ReturnCode`        | Código de retorno da Adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da Adquirência.                                                                                            | Texto | 512     | Texto alfanumérico                   |
| `Type`              |  indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass`                       | Texto | 255     | Texto alfanumérico                   |
| `Walletkey`         | Chave criptografica que representa os dados do cartão - Ver tabela WalletKey para mais informações                              | Texto | 255     | Ver tabela `WalletKey`               |

#### Android Pay

##### Requisição

Exemplo de Requisição padrão *Android Pay*

> É necessário que a loja ja possua cadastro e uma integração Android Pay, caso contrario não será possivel a integração com a API

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
{
  "MerchantOrderId":"6242-642-723",
  "Customer":{
    "Name":"Exemplo Wallet Padrão",
    "Identity":"11225468954",
    "IdentityType":"CPF"
  },
  "Payment":{
     "Type":"CreditCard",
     "Amount":1,
     "Provider":"Cielo",
     "Installments":1,
     "Currency":"BRL",
     "Wallet":{
       "Type":"AndroidPay",
       "WalletKey":"{\"encryptedMessage\":\"0mXBb94Cy9JZhMuwtrBhMjXb8pDslrNsN5KhcEqnowOINqJgjXHD36KcCuzpQQ4cDAe64ZLmk2N3UBGXsN9hMMyeMakXlidVmteE+QMaNZIor048oJqlUIFPD54B/ic8zCdqq3xnefUmyKQe0I03x57TcEA9xAT/E4x3rYfyqLFUAEtu2lT0GwTdwgrsT8pKoTldHIgP+wVNTjrKvJrB4xM/Bhn6JfcSmOzFyI6w37mBU71/TK761nYOSxt7z1bNWSLZ4b8xBu1dlRgen2BSlqdafuQjV3UZjr6ubSvaJ8NiCh5FD/X013kAwLuLALMS2uAFS9j8cZ6R6zNIi13fK6Fe4ACbFTHwLzSNZjQiaRDb6MlMnY8/amncPIOXzpirb5ScIz8EZUL05xd+3YWVTVfpqgFo1eaaS+wZdUyRG0QEgOsr6eLBoH8d5lfV9Rx6XdioorUuT7s1Yqc0OJZO+fhBt6X0izE9hBGTexdZyg\\u003d\\u003d\",\"ephemeralPublicKey\":\"BMdwrkJeEgCOtLevYsN3MbdP8xbOItXiTejoB6vXy0Kn0ZM10jy4Aasd6jTSxtoxoTpFydLhj5kzoOhbw2OzZu0\\u003d\",\"tag\":\"yAQIjWZ0VuCC7SWyYwc4eXOzpSUKhZduF9ip0Ji+Gj8\\u003d\"}",
       "AdditionalData":{
           "Signature":"MEUCIQCGQLOmwxe5eFMSuTcr4EcwSZu35fB0KlCWcVop6ZxxhgIgbdtNHThSlynOopfxMIxkDs0cLh2NFh5es+J5uDmaViA\u003d"
       }
    }
  }
}
```

| Propriedade                | Tipo   | Tamanho | Obrigatório | Descrição                                                                                               |
|----------------------------|--------|---------|-------------|---------------------------------------------------------------------------------------------------------|
| `MerchantId`               | Guid   | 36      | Sim         | Identificador da loja na Braspag                                                                        |
| `MerchantKey`              | Texto  | 40      | Sim         | Chave Publica para Autenticação Dupla na Braspag                                                        |
| `RequestId`                | Guid   | 36      | Não         | Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.  |
| `MerchantOrderId`          | Texto  | 50      | Sim         | Numero de identificação do Pedido.                                                                      |
| `Customer.Name`            | Texto  | 255     | Não         | Nome do Comprador.                                                                                      |
| `Customer.Status`          | Texto  | 255     | Não         | Status de cadastro do comprador na loja (NEW / EXISTING)                                                |
| `Payment.Type`             | Texto  | 100     | Sim         | Tipo do Meio de Pagamento.                                                                              |
| `Payment.Amount`           | Número | 15      | Sim         | Valor do Pedido (ser enviado em centavos).                                                              |
| `Payment.Provider`         | Texto  | 15      | Sim         | Somente providers Cielo (`Cielo` / `Cielo30`)                                                           |
| `Payment.Installments`     | Número | 2       | Sim         | Número de Parcelas.                                                                                     |
| `Wallet.Type`              | Texto  | 255     | Sim         | indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass` |
| `Wallet.Walletkey`         | Texto  | 255     | Sim         | Chave criptografica que representa os dados do cartão - Ver tabela WalletKey para mais informações       |
| `Wallet.AdditionalData.Signature`| Texto  | 255    | Sim  | Token retornado pela Wallet. Deve ser enviado em Integrações: `AndroidPay`                                 |

##### Resposta

```json
{
    "MerchantOrderId": "2014111703",
    "Customer": {
        "Name": "[Guest]"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "453211******1521",
            "Holder": "BJORN IRONSIDE",
            "ExpirationDate": "08/2020",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "0319040817883",
        "ProofOfSale": "817883",
        "AuthorizationCode": "027795",
        "Wallet": {
            "Type": "AndroidPay",
            "WalletKey": "{\"encryptedMessage\":\"0mXBb94Cy9JZhMuwtrBhMjXb8pDslrNsN5KhcEqnowOINqJgjXHD36KcCuzpQQ4cDAe64ZLmk2N3UBGXsN9hMMyeMakXlidVmteE+QMaNZIor048oJqlUIFPD54B/ic8zCdqq3xnefUmyKQe0I03x57TcEA9xAT/E4x3rYfyqLFUAEtu2lT0GwTdwgrsT8pKoTldHIgP+wVNTjrKvJrB4xM/Bhn6JfcSmOzFyI6w37mBU71/TK761nYOSxt7z1bNWSLZ4b8xBu1dlRgen2BSlqdafuQjV3UZjr6ubSvaJ8NiCh5FD/X013kAwLuLALMS2uAFS9j8cZ6R6zNIi13fK6Fe4ACbFTHwLzSNZjQiaRDb6MlMnY8/amncPIOXzpirb5ScIz8EZUL05xd+3YWVTVfpqgFo1eaaS+wZdUyRG0QEgOsr6eLBoH8d5lfV9Rx6XdioorUuT7s1Yqc0OJZO+fhBt6X0izE9hBGTexdZyg\\u003d\\u003d\",\"ephemeralPublicKey\":\"BMdwrkJeEgCOtLevYsN3MbdP8xbOItXiTejoB6vXy0Kn0ZM10jy4Aasd6jTSxtoxoTpFydLhj5kzoOhbw2OzZu0\\u003d\",\"tag\":\"yAQIjWZ0VuCC7SWyYwc4eXOzpSUKhZduF9ip0Ji+Gj8\\u003d\"}",
            "Eci": 0,
            "AdditionalData": {
                "Signature":"MEUCIQCGQLOmwxe5eFMSuTcr4EcwSZu35fB0KlCWcVop6ZxxhgIgbdtNHThSlynOopfxMIxkDs0cLh2NFh5es+J5uDmaViA\u003d"
            }
        },
        "SoftDescriptor": "123456789ABCD",
        "Amount": 100,
        "ReceivedDate": "2018-03-19 16:08:16",
        "Status": 1,
        "IsSplitted": false,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "4",
        "PaymentId": "e57b09eb-475b-44b6-ac71-01b9b82f2491",
        "Type": "CreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491"
            },
            {
                "Method": "PUT",
                "Rel": "capture",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/capture"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/e57b09eb-475b-44b6-ac71-01b9b82f2491/void"
            }
        ]
    }
}
```

| Propriedade         | Descrição                                                                                                                      | Tipo  | Tamanho | Formato                              |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------|-------|---------|--------------------------------------|
| `ProofOfSale`       | Número da autorização, identico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Id da transação na adquirente.                                                                                                 | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancaria do portador - Disponivel apenas para VISA/MASTER - nao permite caracteres especiais | Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo Identificador do Pedido.                                                                                                 | Guid  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | Eletronic Commerce Indicator. Representa o quão segura é uma transação.                                                        | Texto | 2       | Exemplos: 7                          |
| `Status`            | Status da Transação.                                                                                                           | Byte  | 2       | Ex. 1                                |
| `ReturnCode`        | Código de retorno da Adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da Adquirência.                                                                                            | Texto | 512     | Texto alfanumérico                   |
| `Type`              |  indica qual o tipo de carteira: `ApplePay` / `SamsungPay` / `AndroidPay` / `VisaCheckout`/ `Masterpass`                       | Texto | 255     | Texto alfanumérico                   |
| `Walletkey`         | Chave criptografica que representa os dados do cartão - Ver tabela WalletKey para mais informações                              | Texto | 255     | Ver tabela `WalletKey`               |       
| `AdditionalData.Signature` | Token retornado pela Wallet. Deve ser enviado em Integrações: `AndroidPay`                                               | Texto | 255     | Ver Tabela `Signature`      |  

#### MasterPass

Para utilizar o MasterPass é necessário a contratação do serviço através do contato diretamente com a Mastercard, selecionando a Braspag como service provider

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2014111708",
   "Customer":{  
      "Name":"Comprador MasterPass"     
   },
   "Payment":{  
     "Type":"CreditCard",
     "Amount":15700,
     "Installments":1,
     "Wallet":{
         "Type":"MasterPass",
         "WalletKey":"a561da1c18a89cfdafas875f9d43fc46cd9bf3e1",
         "AdditionalData":{
               "CaptureCode": "103"
         }
     }
   }
}

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave Publica para Autenticação Dupla na Braspag|
|`RequestId`|Guid|36|Não|Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido.|
|`Customer.Name`|Texto|255|Não|Nome do Comprador.|
|`Customer.Status`|Texto|255|Não|Status de cadastro do comprador na loja (NEW / EXISTING)|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento.|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos).|
|`Payment.Provider`|Texto|15|Sim|Somente providers Cielo (`Cielo` / `Cielo30`)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas.|
|`Wallet.Type`|Texto|255|Sim|indica qual o tipo de carteira: "Masterpass"|
|`Wallet.Walletkey`|Texto|255|Sim|Chave criptografica que representa os dados do cartão - Ver tabela WalletKey para mais informações|
|`Wallet.AdditionalData`|---|---|---|Instancia para dados extras informados pela MasterPass. Obrigatório apenas se TYPE = "MasterPass"|
|`Wallet.capturecode`|Texto|255|Sim|Código informado pela MasterPass ao lojista|

##### Resposta

```json
{
  "MerchantOrderId": "2014111708",
  "Customer": {
    "Name": "comprador Masterpass"
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": 0,
    "Capture": false,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "453211******3703",
      "Holder": "Teste Holder",
      "ExpirationDate": "12/2016",
      "SaveCard": false,
      "Brand": "Visa"
    },
    "Tid": "0915052536103",
    "Provider": "Simulado",
    "Wallet": {
      "Type": "Masterpass",
      "Eci": 0,
      "AdditionalData": {
        "CaptureCode": "103"
      }
    },
    "PaymentId": "689da793-fc99-4900-89f1-9e7fdaa06ef8",
    "Type": "CreditCard",
    "Amount": 15700,
    "ReceivedDate": "2016-09-15 17:25:35",
    "Currency": "BRL",
    "Country": "BRA",
    "ReturnCode": "57",
    "ReturnMessage": "Card Expired",
    "Status": 3,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/689da793-fc99-4900-89f1-9e7fdaa06ef8"
      }
    ]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|---|---|---|---|---|
|`ProofOfSale`|Número da autorização, identico ao NSU.|Texto|6|Texto alfanumérico|
|`Tid`|Id da transação na adquirente.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|6|Texto alfanumérico|
|`SoftDescriptor`|Texto que será impresso na fatura bancaria do portador - Disponivel apenas para VISA/MASTER - nao permite caracteres especiais|Texto|13|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ECI`|Eletronic Commerce Indicator. Representa o quão segura é uma transação.|Texto|2|Exemplos: 7|
|`Status`|Status da Transação.|Byte| 2 | Ex. 1 |
|`ReturnCode`|Código de retorno da Adquirência.|Texto|32|Texto alfanumérico|
|`ReturnMessage`|Mensagem de retorno da Adquirência.|Texto|512|Texto alfanumérico|
|`Type`|indica qual o tipo de carteira: "VisaCheckout" ou "Masterpass"|Texto|255|Sim|
|`Capturecode`|Código informado pela MasterPass ao lojista|Texto|255|Sim|

#### Visa Checkout

Para utilizar o Visa Checkout é necessário a contratação do serviço através do contato diretamente com a Visa.

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2014111703",
   "Customer":{  
      "Name":"Comprador Teste"
   },
   "Payment":{  
      "Type":"CreditCard",
      "Amount":15700,
      "Installments":1,
      "SoftDescriptor":"123456789ABCD",
      "CreditCard":{  
         "SecurityCode":"123"
      },
      "Wallet":{  
         "Type":"VisaCheckout",
         "WalletKey":"1140814777695873901"
      }
   }
}

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|---|---|---|---|---|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave Publica para Autenticação Dupla na Braspag|
|`RequestId`|Guid|36|Não|Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido.|
|`Customer.Name`|Texto|255|Não|Nome do Comprador.|
|`Customer.Status`|Texto|255|Não|Status de cadastro do comprador na loja (NEW / EXISTING)|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento.|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos).|
|`Payment.Provider`|Texto|15|Sim|Somente providers Cielo (`Cielo` / `Cielo30`)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas.|
|`Payment.ReturnUrl`|Texto|1024|---|Obrigatório para cartão de débito|
|`CreditCard.SecurityCode`|Texto|4|Não|Código de segurança impresso no verso do cartão - Ver Anexo.|
|`Wallet.Type`|Texto|255|Sim|indica qual o tipo de carteira: "VisaCheckout"|
|`Wallet.Walletkey`|Texto|255|---|Chave criptografica enviada pelo VisaCheckout. Obrigatoria se TYPE =  "Visa Checkout"|

##### Resposta

```json
{
  "MerchantOrderId": "2014111708",
  "Customer": {
    "Name": "Comprador VisaCheckout"
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": 0,
    "Capture": false,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "SaveCard": false,
      "Brand": "Undefined"
    },
    "Tid": "0915052340115",
    "Provider": "Simulado",
    "Wallet": {
      "Type": "VisaCheckout",
      "WalletKey": "1140814777695873901",
      "Eci": 0
    },
    "PaymentId": "efdb3338-9c8f-445a-8836-2cc93d8beacf",
    "Type": "CreditCard",
    "Amount": 15700,
    "ReceivedDate": "2016-09-15 17:23:39",
    "Currency": "BRL",
    "Country": "BRA",
    "ReturnCode": "77",
    "ReturnMessage": "Card Canceled",
    "Status": 3,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/efdb3338-9c8f-445a-8836-2cc93d8beacf"
      }
    ]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|---|---|---|---|---|
|`ProofOfSale`|Número da autorização, identico ao NSU.|Texto|6|Texto alfanumérico|
|`Tid`|Id da transação na adquirente.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|6|Texto alfanumérico|
|`SoftDescriptor`|Texto que será impresso na fatura bancaria do portador - Disponivel apenas para VISA/MASTER - nao permite caracteres especiais|Texto|13|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ECI`|Eletronic Commerce Indicator. Representa o quão segura é uma transação.|Texto|2|Exemplos: 7|
|`Status`|Status da Transação.|Byte| 2 | Ex. 1 |
|`ReturnCode`|Código de retorno da Adquirência.|Texto|32|Texto alfanumérico|
|`ReturnMessage`|Mensagem de retorno da Adquirência.|Texto|512|Texto alfanumérico|
|`Type`|indica qual o tipo de carteira: "VisaCheckout" ou "Masterpass"|Texto|255|Sim|
|`Capturecode`|Código informado pela MasterPass ao lojista|Texto|255|Sim|

## Voucher

### Criando uma transação com voucher Alelo

Uma transação com um Cartão Alelo se efetua de uma forma semelhante a um Cartão de Débito, porém, sem o processo de autenticação. <BR><BR>Atualmente, somente o Provider "Alelo" suporta processamento desta modalidade.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{
   [...]
    "Payment": {
        "Provider": "Alelo",
        "Type": "DebitCard",
        "Amount": 10,
        "Installments": 1,
        "DebitCard": {
            "CardNumber": "****4903",
            "Holder": "TesteBraspag",
            "ExpirationDate": "02/2019",
            "SecurityCode": "***",
            "Brand": "Elo"
        },
        [...]
    }
}

```

```shell
curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   [...]
    "Payment": {
        "Provider": "Alelo",
        "Type": "DebitCard",
        "Amount": 10,
        "Installments": 1,
        "DebitCard": {
            "CardNumber": "****4903",
            "Holder": "TesteBraspag",
            "ExpirationDate": "02/2019",
            "SecurityCode": "***",
            "Brand": "Elo"
        },
        [...]
    }
}
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento. Atualmente somente a "Cielo" suporta esta forma de pagamento via Pagador|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento. No caso do cartão de débito (DebitCard)|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim do pagamento|Texto |1024 |Sim|
|`DebitCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`DebitCard.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`DebitCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`DebitCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`DebitCard.Brand`|Texto|10|Sim |Bandeira do cartão|

#### Resposta

```json
{
    [...]
    "Payment": {
        "DebitCard": {
            "CardNumber": "527637******4903",
            "Holder": "TesteBraspag",
            "ExpirationDate": "02/2019",
            "SaveCard": false,
            "Brand": "Elo"
        },
        "ProofOfSale": "004045",
        "AcquirerTransactionId": "c63fb9f7-02ad-42b3-a182-c56e26238a00",
        "AuthorizationCode": "128752",
        "Eci": "0",
        "PaymentId": "562a8563-9181-4f12-bee8-0ccc89c8f931",
        "Type": "DebitCard",
        "Amount": 10,
        "ReceivedDate": "2018-02-21 10:59:57",
        "CapturedAmount": 10,
        "CapturedDate": "2018-02-21 11:00:48",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Alelo",
        "ReturnUrl": "http://www.braspag.com.br",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "00",
        "ProviderReturnMessage": "Transacao capturada com sucesso",
        [...]
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    [...]
    "Payment": {
        "DebitCard": {
            "CardNumber": "527637******4903",
            "Holder": "TesteBraspag",
            "ExpirationDate": "02/2019",
            "SaveCard": false,
            "Brand": "Elo"
        },
        "ProofOfSale": "004045",
        "AcquirerTransactionId": "c63fb9f7-02ad-42b3-a182-c56e26238a00",
        "AuthorizationCode": "128752",
        "Eci": "0",
        "PaymentId": "562a8563-9181-4f12-bee8-0ccc89c8f931",
        "Type": "DebitCard",
        "Amount": 10,
        "ReceivedDate": "2018-02-21 10:59:57",
        "CapturedAmount": 10,
        "CapturedDate": "2018-02-21 11:00:48",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Alelo",
        "ReturnUrl": "http://www.braspag.com.br",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "00",
        "ProviderReturnMessage": "Transacao capturada com sucesso",
        [...]
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da Operação|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da Operação|Texto|512|Texto alfanumérico|
|`Status`|Status da Transação|Byte|2|Ex. 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|
|`AuthenticationUrl`|URL para o qual o portador será redirecionado para autenticação |Texto |56 |https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f|

## Pagamentos com DCC (conversor de moedas da adquirente Global Payments)

Exemplo de uma transação com DCC (Dynamic Currency Conversion), conversor de moedas da adquirente Global Payments que permite que o portador de um cartão estrangeiro escolha entre pagar em Reais ou em sua moeda Local, convertendo o valor do pedido no momento da compra com total transparência para o comprador.
A solução é indicada para estabelecimentos que recebem pagamentos com cartões emitidos no exterior como hotéis, pousadas, polos comerciais e comércios em pontos turísticos.

<aside class="notice"><strong>Autenticação:</strong> Para utilizar esta funcionalidade, o lojista deverá entrar em contato com a adquirente Global Payments e solicitar a ativação do DCC em seu estabelecimento.</aside>

<aside class="warning">Esta funcionalidade não é compatível com transações com MPI Externo.</aside>

#### Processo de autorização com DCC

Quando o estabelecimento possui o produto DCC habilitado, o processo de autorização é realizado em 3 etapas.

Na primeira etapa, quando é solicitada uma autorização com um cartão internacional, a Global Payments identifica o país do cartão e aplica a conversão de moeda seguindo os cálculos específicos de cada bandeira, em seguida retorna as informações de conversão.

Na segunda etapa, o sistema da loja deverá apresentar ao comprador as opções de pagar em Reais ou com a moeda de seu país (moeda do cartão de crédito), seguindo as melhores práticas solicitadas pela bandeira, onde:

* Texto apresentado em Inglês, conforme exemplo a seguir.
* O layout do site não precisa ser alterado, desde que as opções de escolha da moeda tenham as mesmas características de fonte, cor e dimensões, como o exemplo que segue.

![DCC Global Payments]({{ site.baseurl_root }}/images/dcc-globalpayments.jpg)

Exemplo disponibilizado pela Global Payments

Na terceira etapa, o sistema da loja envia a confirmação da transação com as informações da moeda escolhida pelo comprador. A resposta da autorização será retornada neste ponto. 

**PASSO 1** - Solicitação de autorização da transação: 

##### Requisição

Não há diferença entre uma requisição de autorização padrão e uma de DCC.

##### Resposta

```json

{
    [...]
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "123412******1234",
            "Holder": "Comprador Teste",
            "ExpirationDate": "12/2022",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ReturnUrl": "http://www.braspag.com.br/",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type": "CreditCard",
        "Amount": 100,
        "ReceivedDate": "2018-08-23 10:46:25",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 12,
        "ProviderReturnCode": "0",
        "ProviderReturnMessage": "Transação autorizada",
        "CurrencyExchangeData": {
            "Id": "fab6f3a752d700af1d50fdd19987b95df497652b",
            "CurrencyExchanges": [{
                    "Currency": "EUR",
                    "ConvertedAmount": 31,
                    "ConversionRate": 3.218626,
                    "ClosingDate": "2017-03-09T00:00:00"
                },
                {
                    "Currency": "BRL",
                    "ConvertedAmount": 100
                }
            ]
        },
        [...]
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    [...]
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "123412******1234",
            "Holder": "Comprador Teste",
            "ExpirationDate": "12/2022",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ReturnUrl": "http://www.braspag.com.br/",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type": "CreditCard",
        "Amount": 100,
        "ReceivedDate": "2018-08-23 10:46:25",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 12,
        "ProviderReturnCode": "0",
        "ProviderReturnMessage": "Transação autorizada",
        "CurrencyExchangeData": {
            "Id": "fab6f3a752d700af1d50fdd19987b95df497652b",
            "CurrencyExchanges": [{
                    "Currency": "EUR",
                    "ConvertedAmount": 31,
                    "ConversionRate": 3.218626,
                    "ClosingDate": "2017-03-09T00:00:00"
                },
                {
                    "Currency": "BRL",
                    "ConvertedAmount": 100
                }
            ]
        }
        [...]
}

```

| Propriedade             | Descrição                                                                   | Tipo  | Tamanho | Formato                              |
|-------------------------|-----------------------------------------------------------------------------|-------|---------|--------------------------------------|
| `AcquirerTransactionId` | Id da transação no provedor de meio de pagamento                            | Texto | 40      | Texto alfanumérico                   |
| `ProofOfSale`           | Número do Comprovante de Venda                                              | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode`     | Código de autorização                                                       | Texto | 300     | Texto alfanumérico                   |
| `PaymentId`             | Campo Identificador do Pedido                                               | Guid  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ReceivedDate`          | Data em que a transação foi recebida pela Brapag                            | Texto | 19      | AAAA-MM-DD HH:mm:SS                  |
| `ReasonCode`            | Código de retorno da Operação                                               | Texto | 32      | Texto alfanumérico                   |
| `ReasonMessage`         | Mensagem de retorno da Operação                                             | Texto | 512     | Texto alfanumérico                   |
| `Status`                | Status da Transação                                                         | Byte  | 2       | Ex.                                  |
| `ProviderReturnCode`    | Código retornado pelo provedor do meio de pagamento (adquirente e bancos)   | Texto | 32      | 57                                   |
| `ProviderReturnMessage` | Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos) | Texto | 512     | Transação Aprovada                   |
| `CurrencyExchangeData.Id` | Id da ação da troca de Moeda | Texto | 50     | 1b05456446c116374005602dcbaf8db8879515a0                   |
| `CurrencyExchangeData.CurrencyExchanges.Currency` | Moeda local do comprador/cartão de crédito. | Numérico | 4     | EUR                   |
| `CurrencyExchangeData.CurrencyExchanges.ConvertedAmount` | Valor convertido. | Numérico | 12     | 23                   |
| `CurrencyExchangeData.CurrencyExchanges.ConversionRate` | Taxa de conversão. | Numérico | 9     | 3.218626                   |
| `CurrencyExchangeData.CurrencyExchanges.ClosingDate` | Data de finalização da transação. | Texto | 19     | AAAA-MM-DD HH:mm:SS                  |
| `CurrencyExchangeData.CurrencyExchanges.Currency` | Código da moeda Real | Texto | 3     | BRA                   |
| `CurrencyExchangeData.CurrencyExchanges.ConvertedAmount` | Valor do pedido em Reais. | Numérico | 12     | 100                   |

**PASSO 2** - Exibição das opções de pagamento (pagar em Reais ou na moeda do cartão):

![DCC Global Payments]({{ site.baseurl_root }}/images/dcc-globalpayments.jpg)

Exemplo disponibilizado pela Global Payments

**PASSO 3** - Confirmação da transação com a moeda escolhida pelo comprador: 

##### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/{PaymentId}/confirm</span></aside>

```json

{  
  "Id":"1b05456446c116374005602dcbaf8db8879515a0",
  "Currency":"EUR",
  "Amount":23
}

```

```shell

curl
--request POST " https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/confirm"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
  "Id":"1b05456446c116374005602dcbaf8db8879515a0",
  "Currency":"EUR",
  "Amount":23
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Id`|Text|50|Sim|Id da ação da troca de Moeda|
|`Currency`|Numérico|4|Sim|Moeda selecionada pelo comprador|
|`Amount`|Numérico|12|Sim|Valor convertido|

##### Resposta

```json

{
   [...]
   "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "123412******1234",
            "Holder": "TerteDcc",
            "ExpirationDate": "12/2022",
            "SecurityCode": "***",
            "Brand": "Visa"
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor": "Mensagem",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type": "CreditCard",
        "Amount": 23,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 23,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        [...]
    }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   [...]
   "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "123412******1234",
            "Holder": "TerteDcc",
            "ExpirationDate": "12/2022",
            "SecurityCode": "***",
            "Brand": "Visa"
        },
        "ProofOfSale": "20170510053219433",
        "AcquirerTransactionId": "0510053219433",
        "AuthorizationCode": "936403",
        "SoftDescriptor": "Mensagem",
        "PaymentId": "fa0c3119-c730-433a-123a-a3b6dfaaad67",
        "Type": "CreditCard",
        "Amount": 23,
        "ReceivedDate": "2017-05-10 17:32:19",
        "CapturedAmount": 23,
        "CapturedDate": "2017-05-10 17:32:19",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "GlobalPayments",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        [...]
    }
}

```

| Propriedade             | Descrição                                                                   | Tipo  | Tamanho | Formato                              |
|-------------------------|-----------------------------------------------------------------------------|-------|---------|--------------------------------------|
| `AcquirerTransactionId` | Id da transação no provedor de meio de pagamento                            | Texto | 40      | Texto alfanumérico                   |
| `ProofOfSale`           | Número do Comprovante de Venda                                              | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode`     | Código de autorização                                                       | Texto | 300     | Texto alfanumérico                   |
| `PaymentId`             | Campo Identificador do Pedido                                               | Guid  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ReceivedDate`          | Data em que a transação foi recebida pela Brapag                            | Texto | 19      | AAAA-MM-DD HH:mm:SS                  |
| `ReasonCode`            | Código de retorno da Operação                                               | Texto | 32      | Texto alfanumérico                   |
| `ReasonMessage`         | Mensagem de retorno da Operação                                             | Texto | 512     | Texto alfanumérico                   |
| `Status`                | Status da Transação                                                         | Byte  | 2       | Ex.                                  |
| `ProviderReturnCode`    | Código retornado pelo provedor do meio de pagamento (adquirente e bancos)   | Texto | 32      | 57                                   |
| `ProviderReturnMessage` | Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos) | Texto | 512     | Transação Aprovada                   |

# Salvando e reutilizando cartões

Caso você tenha contratado o Cartão Protegido, é possível salvar um cartão no formato de um Token para substituir os dados do cartão numa próxima transação do mesmo comprador. É importante ressaltar que por questões de segurança, o CVV (Código de Segurança) não é tokenizado.

Além da geração do Card Token, é possível associar um nome, um identificador em formato de texto, ao cartão salvo. Esse identificador será o Alias.

## Salvando um cartão durante uma autorização

### Requisição

Para salvar um cartão de crédito utilizado em uma transação, basta enviar o parâmetro `Payment.SaveCard` como _true_ na requisição padrão de autorização.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": true,
            "Alias": ""
        },
        [...]
    }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardNumber": "4551870000000181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2021",
            "SecurityCode": "123",
            "Brand": "Visa",
            "SaveCard": true,
            "Alias": ""
        },
        [...]
    }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do Comprador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão, no formato MM/AAAA|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.SaveCard`|Booleano|10|Não (Default false) |true para salvar o cartão e false para não salvar|
|`CreditCard.Alias`|Texto|64|Não |Alias (Apelido) do cartão de crédito|

### Resposta

O parâmetro `CreditCard.CardToken` retornará o token a ser salvo para transações futuras com o mesmo cartão.

```json

{
  [...]
  },
    "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": true,
      "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
      "Brand": "Visa",
      "Alias": "Cliente1"
    },
    "ProofOfSale": "3519928",
    "AcquirerTransactionId": "0511023519928",
    "AuthorizationCode": "536934",
    "PaymentId": "3af00b2d-dbd0-42d6-a669-d4937f0881da",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 14:35:19",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  [...]
  },
    "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "Recurrent": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": true,
      "CardToken": "250e7c7c-5501-4a7c-aa42-a33d7ad61167",
      "Brand": "Visa",
      "Alias": "Cliente1"
    },
    "ProofOfSale": "3519928",
    "AcquirerTransactionId": "0511023519928",
    "AuthorizationCode": "536934",
    "PaymentId": "3af00b2d-dbd0-42d6-a669-d4937f0881da",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 14:35:19",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da Operação|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da Operação|Texto|512|Texto alfanumérico|
|`Status`|Status da Transação|Byte|2|Ex. 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|
|`CreditCard.CardToken`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Criando uma transação com Card Token

Este é um exemplo de como utilizar o Card Token, previamente salvo, para criar uma transação. Por questão de segurança, um Card Token não tem guardado o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Caso seu estabelecimento junto à adquirente esteja configurado como Recorrente, você poderá submeter transações sem o CVV.

#### Requisição

O nó `CreditCard` dentro do nó `Payment` será alterado conforme exemplo a seguir.

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
        [...]
    }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
        [...]
    }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`CreditCard.CardToken`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Texto|4|Não|Código de segurança impresso no verso do cartão. Para processar vendar sem o CVV, é necessário solicitar liberação na adquirente. |
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|

### Resposta

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "CardToken":"250e7c7c-5501-4a7c-aa42-a33d7ad61167",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da Operação|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da Operação|Texto|512|Texto alfanumérico|
|`Status`|Status da Transação|Byte|2|Ex. 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|

## Criando uma transação com Alias

Este é um exemplo de como utilizar o Alias, previamente salvo, para criar uma transação. Por questão de segurança, um Alias não tem guardado o Código de Segurança. Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Caso seu estabelecimento junto à adquirente esteja configurado como Recorrente, você poderá submeter transações sem o CVV.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "Alias":"Cliente1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
        [...]
    }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "Alias":"Cliente1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
        [...]
    }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do Meio de Pagamento|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`CreditCard.CardToken`|Token no Cartão Protegido que representa os dados do cartão|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Texto|4|Não|Código de segurança impresso no verso do cartão. Para processar vendar sem o CVV, é necessário solicitar liberação na adquirente.|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.Alias`|Texto|64|Não |Alias (Apelido) do cartão de crédito|

### Resposta

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "Alias":"Cliente1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
   },
     "Payment": {
        "Provider": "Simulado",
        "Type": "CreditCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "SoftDescriptor": "Mensagem",
        "CreditCard": {
            "Alias":"Cliente1",
            "SecurityCode":"123",
            "Brand":"Visa"
            },
    "ProofOfSale": "124305",
    "AcquirerTransactionId": "0511030124305",
    "AuthorizationCode": "065964",
    "PaymentId": "23cd8bf5-2251-4991-9042-533ff5608788",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:01:24",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 1,
    "ProviderReturnCode": "4",
    "ProviderReturnMessage": "Operation Successful",
   [...]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da Operação|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da Operação|Texto|512|Texto alfanumérico|
|`Status`|Status da Transação|Byte|2|Ex. 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|

# Pagamentos com Análise de Fraude

É possível verificar se uma transação possui risco de ser uma fraude ou não durante uma autorização. O Antifraude é contratado separadamente, e pode conversar com o Gateway de Pagamento das seguintes formas:

|Tipo de Integração|Descrição|Parâmetros necessários|
|-|-|-|
|Análise antes da autorização|Antes da transação ser enviada para a processadora, o Antifraude avalia se ela tem alto risco ou não. Dessa forma, evita-se o envio de transações arriscadas para autorização|`FraudAnalysis.Sequence` como _AnalyseFirst_|
|Análise após a autorização|O Antifraude analisa o risco da transação antes da captura, após o envio para autorização da processadora|`FraudAnalysis.Sequence` como _AuthorizeFirst_|
|Análise de risco somente se a transação for autorizada|O Antifraude será acionado apenas para analisar transações com o staus _autorizada_. Dessa forma evita-se o custo com análises de transações que não seriam autorizadas|`FraudAnalysis.SequenceCriteria` como _OnSuccess_|
|Análise de risco em qualquer hipótese|Independente do status da transação após a autorização, o Antifraude analisará o risco dela|`FraudAnalysis.Sequence` como _AuthorizeFirst_ e `FraudAnalysis.SequenceCriteria` como _Always_|
|Autorização em qualquer hipótese|Independente do score de fraude da transação, ela sempre será enviada para autorização da processadora|`FraudAnalysis.Sequence` como _AnalyseFirst_ e `FraudAnalysis.SequenceCriteria` como _Always_|
|Capturar apenas se uma transação for segura|Após a análise de fraude, captura automaticamente uma transação já autorizada se definido baixo risco|`FraudAnalysis.Sequence` como _AuthorizeFirst_, `FraudAnalysis.CaptureOnLowRisk` igual a _true_ e `Payment.Capture` igual a _false_| |
|Cancelar uma transação comprometida|Caso a análise de fraude retorne um alto risco para uma transação já autorizada ou capturada, ela será imediamente estornada|`FraudAnalysis.Sequence` como _AuthorizeFirst_ e `FraudAnalysis.VoidOnHighRisk` igual a _true_|

Se não for especificado o contrário durante a autorização, A Braspag processará sua transação pelo fluxo `FraudAnalysis.Sequence` _AuthorizeFirst_, `FraudAnalysis.SequenceCriteria` _OnSuccess_, `FraudAnalysis.VoidOnHighRisk` _false_ e `FraudAnalysis.CaptureOnLowRisk` _false_.

## Criando uma transação com Análise de Fraude Cybersource

Para que a análise de fraude via Cybersource seja efetuada durante uma transação de cartão de crédito, é necessário complementar o contrato de autorização com os nós "FraudAnalysis", "Cart", "MerchantDefinedFields" e (somente para venda de passagens aéreas) "Travel".

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{  
   [...]
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"Always",
         "Provider":"Cybersource",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":false,
            "Email":"comprador@braspag.com.br",
            "HostName":"Teste",
            "IpAddress":"127.0.0.1",
            "Type":"Chrome"
         },
         "Cart":{  
            "IsGift":false,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High",
                  "Passenger":{  
                     "Email":"comprador@braspag.com.br",
                     "Identity":"1234567890",
                     "Name":"Nome do Comprador",
                     "Rating":"Adult",
                     "Phone":"999994444",
                     "Status":"Accepted"
                  }
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":95,
               "Value":"Dado Definido pela Loja"
            }
         ],
         "Shipping":{  
            "Addressee":"Alameda Xingu, 512",
            "Method":"LowCost",
            "Phone":"1121840540"
         },
         "Travel":{  
            "JourneyType":"OneWayTrip",
            "DepartureDateTime":"2018-01-09 18:00",
            "Passengers":[  
               {  
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"1234567890",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
         }
      }
   }
}

```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"Always",
         "Provider":"Cybersource",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":false,
            "Email":"comprador@braspag.com.br",
            "HostName":"Teste",
            "IpAddress":"127.0.0.1",
            "Type":"Chrome"
         },
         "Cart":{  
            "IsGift":false,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":95,
               "Value":"Dado Definido pela Loja"
            }
         ],
         "Shipping":{  
            "Addressee":"Alameda Xingu, 512",
            "Method":"LowCost",
            "Phone":"1121840540"
         },
         "Travel":{  
            "JourneyType":"OneWayTrip",
            "DepartureDateTime":"2018-01-09 18:00",
            "Passengers":[  
               {  
                  "Name":"Passenger Test",
                  "Identity":"212424808",
                  "Status":"Gold",
                  "Rating":"Adult",
                  "Email":"email@mail.com",
                  "Phone":"1234567890",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
         }
      }
   }
}
--verbose

```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
| `FraudAnalysis.Sequence` | Texto | 14 | Sim | Tipo de Fluxo para realização da análise de fraude. Primeiro Analise (AnalyseFirst) ou Primeiro Autorização (AuthorizeFirst) |
| `FraudAnalysis.SequenceCriteria` | Texto | 9 | Sim | Critério do fluxo: "OnSuccess" (Só realiza a analise se tiver sucesso na transação), "Always" (Sempre realiza a analise) |
| `FraudAnalysis.Provider` | Texto | 10 | Sim | Provedor de antifraude. Enviar: "Cybersource". |
| `FraudAnalysis.CaptureOnLowRisk` | Booleano | --- | Não | Quando true, a autorização deve ser com captura automática quando o risco de fraude for considerado baixo (Accept). Em casos de Reject ou Review, o fluxo permanece o mesmo, ou seja, a captura acontecerá conforme o valor especificado no parâmetro "Capture". Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente "AuthorizeFirst". Por depender do resutlado de análise de risco, este parâmetro só terá efeito quando o serviço de Antifraude for contratado |
| `FraudAnalysis.VoidOnHighRisk` | Booleano | --- | Não | Quando true, o estorno deve acontecer automaticamente quando o risco de fraude for considerado alto (Reject). Em casos de Accept ou Review, o fluxo permanece o mesmo, ou seja, o estorno deve ser feito manualmente. Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente "AuthorizeFirst". Por depender do resutlado de análise de risco, este parâmetro só terá efeito quando o serviço de Antifraude for contratado. |
| `FraudAnalysis.TotalOrderAmount` | Número | 15 | Sim | Valor total do pedido |
| `FraudAnalysis.FingerPrintId` | Texto | 100 | Sim | Identificador utilizado para cruzar informações obtidas do dispositivo do comprador.<BR>Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas. |
| `FraudAnalysis.Browser.HostName` | Texto | 60 | Não | Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP |
| `FraudAnalysis.Browser.CookiesAccepted` | Booleano | --- | Sim | Identifica se o browser do comprador aceita cookies ou não |
| `FraudAnalysis.Browser.Email` | Texto | 100 | Não | E-mail registrado no browser do comprador. Pode diferenciar do e-mail de cadastro na loja(Customer.Email) |
| `FraudAnalysis.Browser.Type` | Texto | 40 | Não | Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP. Ex.: Google Chrome, Mozilla Firefox, Safari, etc. |
| `FraudAnalysis.Browser.IpAddress` | Texto | 45 | Sim | Endereço IP do comprador. É altamente recomendável o envio deste campo |
| `FraudAnalysis.Cart.IsGift` | Booleano | --- | Não | Booleano que indica se o pedido é para presente ou não |
| `FraudAnalysis.Cart.ReturnsAccepted` | Booleano | --- | Não | Booleano que define se devoluções são aceitas para o pedido |
| `FraudAnalysis.Cart.Items.GiftCategory` | Texto | 9 | Não | Campo que avaliará os endereços de cobrança e entrega para difrentes cidades, estados ou países: "Yes" (Em caso de divergência entre endereços de cobrança e entrega, marca como risco pequeno), "No" (Em caso de divergência entre endereços de cobrança e entrega, marca com risco alto), "Off" (Ignora a análise de risco para endereços divergentes) |
| `FraudAnalysis.Cart.Items.HostHedge` | Texto | 6 | Não | Nível de importância do e-mail e endereços IP dos clientes em risco de pontuação. Possíveis Valores:<BR>Low (Baixa importância do e-mail e endereço IP na análise de risco)<BR>Normal (Média importância do e-mail e endereço IP na análise de risco)<BR>High (Alta importância do e-mail e endereço IP na análise de risco)<BR>Off (E-mail e endereço IP não afetam a análise de risco) |
| `FraudAnalysis.Cart.Items.NonSensicalHedge` | Texto | 6 | Não | Nível dos testes realizados sobre os dados do comprador com pedidos recebidos sem sentido. Possiveis Valores:<BR>Low (Baixa importância da verificação feita sobre o pedido do comprador, na análise de risco)<BR>Normal (Média importância da verificação feita sobre o pedido do comprador, na análise de risco)<BR>High (Alta importância da verificação feita sobre o pedido do comprador, na análise de risco)<BR>Off (Verificação do pedido do comprador não afeta a análise de risco) |
| `FraudAnalysis.Cart.Items.ObscenitiesHedge` | Texto | 6 | Não | Nível de obscenidade dos pedidos recebedidos. Possiveis Valores:<BR>Low (Baixa importância da verificação sobre obscenidades do pedido do comprador, na análise de risco)<BR>Normal (Média importância da verificação sobre obscenidades do pedido do comprador, na análise de risco)<BR>High (Alta importância da verificação sobre obscenidades do pedido do comprador, na análise de risco)<BR>Off (Verificação de obscenidade no pedido do comprador não afeta a análise de risco) |
| `FraudAnalysis.Cart.Items.PhoneHedge` | Texto | 6 | Não | Nível dos testes realizados com os números de telefones. Possiveis Valores:<BR>Low (Baixa importância nos testes realizados com números de telefone)<BR>Normal (Média importância nos testes realizados com números de telefone)<BR>High (Alta importância nos testes realizados com números de telefone)<BR>Off (Testes de números de telefone não afetam a análise de risco) |
| `FraudAnalysis.Cart.Items.Name` | Texto | 255 | Sim | Nome do Produto |
| `FraudAnalysis.Cart.Items.Quantity` | Número | 15 | Sim | Quantidade do produto a ser adquirido |
| `FraudAnalysis.Cart.Items.Sku` | Texto | 255 | Sim | Código comerciante identificador do produto |
| `FraudAnalysis.Cart.Items.UnitPrice` | Número | 15 | Sim | Preço unitário do produto. Ex.: 10950 = r$ 109,50 |
| `FraudAnalysis.Cart.Items.Risk` | Texto | 6 | Não | Nível do risco do produto. Possiveis Valores:<BR>Low (O produto tem um histórico de poucos chargebacks)<BR>Normal (O produto tem um histórico de chargebacks considerado normal)<BR>High (O produto tem um histórico de chargebacks acima da média) |
| `FraudAnalysis.Cart.Items.TimeHedge` | Texto | 6 | Não | Nível de importância da hora do dia do pedido do cliente. Possiveis Valores:<BR>Low (Baixa importância no horário do dia em que foi feita a compra, para a análise de risco)<BR>Normal (Média importância no horário do dia em que foi feita a compra, para a análise de risco)<BR>High (Alta importância no horário do dia em que foi feita a compra, para a análise de risco)<BR>Off (O horário da compra não afeta a análise de risco) |
| `FraudAnalysis.Cart.Items.Type` | Texto | 19 | Não | Tipo do produto. Possíveis Valores:<BR>AdultContent(Conteúdo adulto)<BR>Coupon(Cupon de desconto)<BR>Default(Opção padrão para análise na CyberSource quando nenhum outro valor é selecionado)<BR>EletronicGood(Produto eletrônico)<BR>EletronicSoftware(Softwares distribuídos eletronicamente via download)<BR>GiftCertificate(Vale presente)<BR>HandlingOnly(Taxa de instalação ou manuseio)<BR>Service(Serviço)<BR>ShippingAndHandling(Frete e taxa de instalação ou manuseio)\
<BR>ShippingOnly(Frete)<BR>Subscription(Assinatura) |
| `FraudAnalysis.Cart.Items.VelocityHedge` | Texto | 6 | Não | Nível de importância de frequência de compra do cliente. Possiveis Valores:<BR>Low (Baixa importância no número de compras realizadas pelo cliente nos últimos 15 minutos)<BR>Normal (Média importância no número de compras realizadas pelo cliente nos últimos 15 minutos)<BR>High (Alta importância no número de compras realizadas pelo cliente nos últimos 15 minutos)<BR>Off (A frequência de compras realizadas pelo cliente não afeta a análise de fraude) |
| `FraudAnalysis.MerchantDefinedFields.Id` | Número | 2 | Sim | ID das informações adicionais a serem enviadas: vide **Tabela de MDDs** na seção Anexos|
| `FraudAnalysis.MerchantDefinedFields.Value` | Texto | 255 | Sim | Valor das informações adicionais a serem enviadas: vide **Tabela de MDDs** na seção Anexos|
| `FraudAnalysis.Shipping.Addressee` | Texto | 120 | Não | Nome do destinatário da entrega (Nome e sobrenome) |
| `FraudAnalysis.Shipping.Method` | Texto | 8 | Não | Tipo de serviço de entrega do produto. Possíveis Valores:<BR>SameDay (Meio de entrega no mesmo dia) <BR>NextDay (Meio de entrega no próximo dia) <BR>TwoDay (Meio de entrega em dois dias) <BR>ThreeDay (Meio de entrega em três dias)<BR>LowCost (Meio de entrega de baixo custo)<BR>Pickup (Retirada na loja)<BR>Other (Outro meio de entrega)<BR>None (Sem meio de entrega, pois é um serviço ou assinatura) |
| `FraudAnalysis.Shipping.Phone` | Número | 15 | Não | Telefone do destinatário da entrega. Ex. 552133665599 (Código do Pais 55, Código da Cidade 21, Numero 33665599) |
| `FraudAnalysis.Travel.JourneyType` | Texto | 32 | Sim, caso o nó Travel seja enviado. | Tipo de viagem. Possiveis Valores:<BR>OneWayTrip (Viagem somente de ida)<BR>RoundTrip (Viagem de ida e volta) |
| `FraudAnalysis.Travel.DepartureDateTime` | DateTime | --- | Sim, caso o nó Travel seja enviado. | Data e hora de partida |
| `FraudAnalysis.Travel.Passengers.Name` | Texto | 120 | Sim, caso o nó Travel seja enviado. | Nome do passageiro. |
| `FraudAnalysis.Travel.Passengers.Identity` | Texto | 32 | Sim, caso o nó Travel seja enviado. | Número do RG, CPF ou CNPJ do passageiro. |
| `FraudAnalysis.Travel.Passengers.Status` | Texto | 15 | Sim, caso o nó Travel seja enviado. | Classificação da empresa aérea. Possiveis Valores: Standard | Gold | Platinum |
| `FraudAnalysis.Travel.Passengers.Rating` | Texto | 13 | Sim, caso o nó Travel seja enviado. | Classificação do Passageiro. Possiveis Valores:<BR>Adult (Passageiro adulto)<BR>Child (Passageiro criança)<BR>Infant (Passageiro infantil)<BR>Youth (Passageiro adolescente)<BR>Student (Passageiro estudante)<BR>SeniorCitizen (Passageiro idoso)<BR>Military (Passageiro militar) |
| `FraudAnalysis.Travel.Passengers.Email` | Texto | 255 | Sim, caso o nó Travel seja enviado. | E-mail do passageiro. |
| `FraudAnalysis.Travel.Passengers.Phone` | Número | 15 | Não | Número do telefone do passageiro. Ex.: 552133665599 (Código do Pais 55, Código da Cidade 21, Numero 33665599) |
| `FraudAnalysis.Travel.Passengers.TravelLegs.Origin` | Texto | 3 | Sim, caso o nó "Travel" seja enviado.| Código do aeroporto de partida |
| `FraudAnalysis.Travel.Passengers.TravelLegs.Destination` | Texto | 3 | Sim, caso o nó "Travel" seja enviado.| Código do aeroporto de chegada |

### Resposta

```json
{  
   [...]
      "Cart":{  
         "IsGift":false,
         "ReturnsAccepted":true,
         "Items":[  
            {  
               "Type":"AdultContent",
               "Name":"ItemTeste",
               "Risk":"High",
               "Sku":"201411170235134521346",
               "UnitPrice":123,
               "Quantity":1,
               "HostHedge":"Off",
               "NonSensicalHedge":"Off",
               "ObscenitiesHedge":"Off",
               "PhoneHedge":"Off",
               "TimeHedge":"Normal",
               "VelocityHedge":"High",
               "GiftCategory":"Undefined",
               "Passenger":{  
                  "Name":"Comprador accept",
                  "Identity":"1234567890",
                  "Status":"Accepted",
                  "Rating":"Adult",
                  "Email":"compradorteste@live.com",
                  "Phone":"999994444"
               }
            }
         ]
      },
      "Travel":{  
         "Route":"MAO-RJO",
         "DepartureTime":"2010-01-02T00:00:00",
         "JourneyType":"Ida",
         "Legs":[  
            {  
               "Destination":"GYN",
               "Origin":"VCP"
            }
         ]
      },
      "Browser":{  
         "HostName":"Teste",
         "CookiesAccepted":false,
         "Email":"compradorteste@live.com",
         "Type":"Chrome",
         "IpAddress":"200.190.150.350"
      },
      "Shipping":{  
         "Addressee":"Sr Comprador Teste",
         "Phone":"21114740",
         "Method":"LowCost"
      },
      "Id":"0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
      "Status":1,
      "CaptureOnLowRisk":false,
      "VoidOnHighRisk":false,
      "FraudAnalysisReasonCode":100,
      "ReplyData":{  
         "AddressInfoCode":"COR-BA^MM-BIN",
         "FactorCode":"B^D^R^Z",
         "Score":42,
         "BinCountry":"us",
         "CardIssuer":"FIA CARD SERVICES, N.A.",
         "CardScheme":"VisaCredit",
         "HostSeverity":1,
         "InternetInfoCode":"FREE-EM^RISK-EM",
         "IpRoutingMethod":"Undefined",
         "ScoreModelUsed":"default_lac",
         "CasePriority":3,
         "ProviderTransactionId":"5220688414326697303008"
      }
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   [...]
      "Cart":{  
         "IsGift":false,
         "ReturnsAccepted":true,
         "Items":[  
            {  
               "Type":"AdultContent",
               "Name":"ItemTeste",
               "Risk":"High",
               "Sku":"201411170235134521346",
               "UnitPrice":123,
               "Quantity":1,
               "HostHedge":"Off",
               "NonSensicalHedge":"Off",
               "ObscenitiesHedge":"Off",
               "PhoneHedge":"Off",
               "TimeHedge":"Normal",
               "VelocityHedge":"High",
               "GiftCategory":"Undefined",
               "Passenger":{  
                  "Name":"Comprador accept",
                  "Identity":"1234567890",
                  "Status":"Accepted",
                  "Rating":"Adult",
                  "Email":"compradorteste@live.com",
                  "Phone":"999994444"
               }
            }
         ]
      },
      "Travel":{  
         "Route":"MAO-RJO",
         "DepartureTime":"2010-01-02T00:00:00",
         "JourneyType":"Ida",
         "Legs":[  
            {  
               "Destination":"GYN",
               "Origin":"VCP"
            }
         ]
      },
      "Browser":{  
         "HostName":"Teste",
         "CookiesAccepted":false,
         "Email":"compradorteste@live.com",
         "Type":"Chrome",
         "IpAddress":"200.190.150.350"
      },
      "Shipping":{  
         "Addressee":"Sr Comprador Teste",
         "Phone":"21114740",
         "Method":"LowCost"
      },
      "Id":"0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
      "Status":1,
      "CaptureOnLowRisk":false,
      "VoidOnHighRisk":false,
      "FraudAnalysisReasonCode":100,
      "ReplyData":{  
         "AddressInfoCode":"COR-BA^MM-BIN",
         "FactorCode":"B^D^R^Z",
         "Score":42,
         "BinCountry":"us",
         "CardIssuer":"FIA CARD SERVICES, N.A.",
         "CardScheme":"VisaCredit",
         "HostSeverity":1,
         "InternetInfoCode":"FREE-EM^RISK-EM",
         "IpRoutingMethod":"Undefined",
         "ScoreModelUsed":"default_lac",
         "CasePriority":3,
         "ProviderTransactionId":"5220688414326697303008"
      }
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`FraudAnalysis.Id`|Indentificação da Transação no Antifraud|Texto|300|Texto alfanumérico|
|`FraudAnalysis.Status`|Status da Transação|Byte|1|Ex. 1|
|`FraudAnalysis.FraudAnalysisReasonCode`|Resultado da análise|Byte|---|<ul><li>100 - Operação bem sucedida.</li><li>101 - O pedido está faltando um ou mais campos necessários. Possível ação: Veja os campos que estão faltando na lista AntiFraudResponse.MissingFieldCollection. Reenviar o pedido com a informação completa.</li><li>102 - Um ou mais campos do pedido contêm dados inválidos. Possível ação: Veja os campos inválidos na lista AntiFraudResponse.InvalidFieldCollection. Reenviar o pedido com as informações corretas.</li><li>150 Falha no sistema geral. Possível ação: Aguarde alguns minutos e tente reenviar o pedido.</li><li>151 - O pedido foi recebido, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor. Possível ação: Aguarde alguns minutos e tente reenviar o pedido.</li><li>152 O pedido foi recebido, mas ocorreu time-out. Possível ação: Aguarde alguns minutos e reenviar o pedido.</li><li>202 – Prevenção à Fraude recusou o pedido porque o cartão expirou. Você também pode receber este código se a data de validade não coincidir com a data em arquivo do banco emissor. Se o processador de pagamento permite a emissão de créditos para cartões expirados, a CyberSource não limita essa funcionalidade. Possível ação: Solicite um cartão ou outra forma de pagamento.</li><li>231 O número da conta é inválido. Possível ação: Solicite um cartão ou outra forma de pagamento.</li><li>234 - Há um problema com a configuração do comerciante. Possível ação: Não envie o pedido. Entre em contato com o Suporte ao Cliente para corrigir o problema de configuração.</li><li>400 A pontuação de fraude ultrapassa o seu limite. Possível ação: Reveja o pedido do cliente.</li><li>480 O pedido foi marcado para revisão pelo Gerenciador de Decisão.</li><li>481 - O pedido foi rejeitado pelo Gerenciador de Decisão</li></ul>|
|`FraudAnalysis.ReplyData.AddressInfoCode`|Combinação de códigos que indicam erro no endereço de cobrança e/ou entrega. Os códigos são concatenados usando o caractere ^|Texto|255|Ex: COR-BA^MM-BIN<br /><ul><li>COR-BA - O endereço de cobrança pode ser normalizado.</li><li>COR-SA - O endereço de entrega pode ser normalizado.</li><li>INTL-BA - O país de cobrança é fora dos U.S.</li><li>INTL-SA - O país de entrega é fora dos U.S.</li><li>MIL-USA - Este é um endereço militar nos U.S.</li><li>MM-A - Os endereços de cobrança e entrega usam nomes de ruas diferentes.</li><li>MM-BIN - O BIN do cartão (os seis primeiros dígitos do número) não corresponde ao país.</li><li>MM-C - Os endereços de cobrança e entrega usam cidades diferentes.</li><li>MM-CO - Os endereços de cobrança e entrega usam países diferentes.</li><li>MM-ST - Os endereços de cobrança e entrega usam estados diferentes.</li><li>MM-Z - Os endereços de cobrança e entrega usam códidos postais diferentes.</li><li>UNV-ADDR - O endereço é inverificável.</li></ul>|
|`FraudAnalysis.ReplyData.FactorCode`|Combinação de códigos que indicam o score do pedido. Os códigos são concatenados usando o caractere ^|Texto|100|Ex: B^D^R^Z<br /><ul><li>A - Mudança de endereço excessiva. O cliente mudou o endereço de cobrança duas ou mais vezes nos últimos seis meses.</li><li>B - BIN do cartão ou autorização de risco. Os fatores de risco estão relacionados com BIN de cartão de crédito e/ou verificações de autorização do cartão.</li><li>C - Elevado números de cartões de créditos. O cliente tem usado mais de seis números de cartões de créditos nos últimos seis meses.</li><li>D - Impacto do endereço de e-mail. O cliente usa um provedor de e-mail gratuito ou o endereço de email é arriscado.</li><li>E - Lista positiva. O cliente está na sua lista positiva.</li><li>F - Lista negativa. O número da conta, endereço, endereço de e-mail ou endereço IP para este fim aparece sua lista negativa.</li><li>G - Inconsistências de geolocalização. O domínio do cliente de e-mail, número de telefone, endereço de cobrança, endereço de envio ou endereço IP é suspeito.</li><li>H - Excessivas mudanças de nome. O cliente mudou o nome duas ou mais vezes nos últimos seis meses.</li><li>I - Inconsistências de internet. O endereço IP e de domínio de e-mail não são consistentes com o endereço de cobrança.</li><li>N - Entrada sem sentido. O nome do cliente e os campos de endereço contém palavras sem sentido ou idioma.</li><li>O - Obscenidades. Dados do cliente contém palavras obscenas.</li><li>P - Identidade morphing. Vários valores de um elemento de identidade estão ligados a um valor de um elemento de identidade diferentes. Por exemplo, vários números de telefone estão ligados a um número de conta única.</li><li>Q - Inconsistências do telefone. O número de telefone do cliente é suspeito.</li><li>R - Ordem arriscada. A transação, o cliente e o lojista mostram informações correlacionadas de alto risco.</li><li>T - Cobertura Time. O cliente está a tentar uma compra fora do horário esperado.</li><li>U - Endereço não verificável. O endereço de cobrança ou de entrega não pode ser verificado.</li><li>V - Velocity. O número da conta foi usado muitas vezes nos últimos 15 minutos.</li><li>W - Marcado como suspeito. O endereço de cobrança ou de entrega é semelhante a um endereço previamente marcado como suspeito.</li><li>Y - O endereço, cidade, estado ou país dos endereços de cobrança e entrega não se correlacionam.</li><li>Z - Valor inválido. Como a solicitação contém um valor inesperado, um valor padrão foi substituído. Embora a transação ainda possa ser processada, examinar o pedido com cuidado para detectar anomalias.</li></ul>|
|`FraudAnalysis.ReplyData.Score`|Score total calculado para o pedido|Número|---|Número|
|`FraudAnalysis.ReplyData.BinCountry`|Sigla do país de origem da compra|Texto|2|us|
|`FraudAnalysis.ReplyData.CardIssuer`|Nome do banco ou entidade emissora do cartão|Texto|128|Bradesco|
|`FraudAnalysis.ReplyData.CardScheme`|Tipo da bandeira|Texto|20|<ul><li>MaestroInternational - Maestro International</li><li>MaestroUkDomestic - Maestro UK Domestic</li><li>MastercardCredit - MasterCard Credit</li><li>MastercardDebit - MasterCard Debit</li><li>VisaCredit - Visa Credit</li><li>VisaDebit - Visa Debit</li><li>VisaElectron - Visa Electron</li></ul>|
|`FraudAnalysis.ReplyData.HostSeverity`|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto|Número|---|5|
|`FraudAnalysis.ReplyData.InternetInfoCode`|Sequência de códigos que indicam que existe uma excessiva alteração de identidades do comprador. Os códigos são concatenados usando o caractere ^|Texto|255|Ex: <br /><ul><li>MORPH-B - O mesmo endereço de cobrança tem sido utilizado várias vezes com identidades de clientes múltiplos.</li><li>MORPH-C - O mesmo número de conta tem sido utilizado várias vezes com identidades de clientes múltiplos.</li><li>MORPH-E - O mesmo endereço de e-mail tem sido utilizado várias vezes com identidades de clientes múltiplos. MORPH-I O mesmo endereço IP tem sido utilizado várias vezes com identidades de clientes múltiplos.</li><li>MORPH-P - O mesmo número de telefone tem sido usado várias vezes com identidades de clientes múltiplos.</li><li>MORPH-S - O mesmo endereço de entrega tem sido utilizado várias vezes com identidades de clientes múltiplos.</li></ul>|
|`FraudAnalysis.ReplyData.IpRoutingMethod`|Tipo de roteamento de IP utilizado pelo computador|Texto|---|<ul><li>Anonymizer</li><li>AolBased</li><li>CacheProxy</li><li>Fixed</li><li>InternationalProxy</li><li>MobileGateway</li><li>Pop</li><li>RegionalProxy</li><li>Satellite</li><li>SuperPop</li></ul>|
|`FraudAnalysis.ReplyData.ScoreModelUsed`|Nome do modelo de score utilizado|Texto|20|Ex: default_lac|
|`FraudAnalysis.ReplyData.CasePriority`|Caso o lojista seja assinante do Enhanced Case Management, ele recebe este valor com o nível de prioridade, sendo 1 o mais alto e 5 o mais baixo|Número|---|3|
|`FraudAnalysis.ReplyData.ProviderTransactionId`|Identificador da transação no provedor de fraude. |Texto|100|Ex: "5206061832306553904009"| 

## Configuração do Fingerprint

Importante componente da análise de fraude, o Fingerprint é um Javascript que deve ser inserido no seu site para capturar dados importantes como: IP do comprador, versão do browser, sistema operacional etc.
Muitas vezes, somente os dados do carrinho não são suficientes para garantir uma análise assertiva. Os dados coletados pelo Fingerprint complementam a análise e garantem que sua loja está mais protegida.

Esta página descreve como funciona e como configurar o fingerprint em sua página de checkout e mobiles.

### Cybersource

Será necessário adicionar duas tags, a *script* dentro da tag *head* para uma performance correta e a *noscript* dentro da tag *body*, para que a coleta dos dados do dispositivo seja realizada mesmo se o Javascript do browser estiver desabilitado.

<aside class="warning">Se os 2 segmentos de código não forem colocados na página de checkout, os resultados da análise de fraude podem não ser precisos.</aside>

**Domain**

|Ambiente|Descrição|
|:-|:-|
|`Testing`|Use h.online-metrix.net, que é o DNS do servidor de fingerprint, como apresentado no exemplo de HTML abaixo|
|`Production`|Altere o domínio para uma URL local, e configure seu servidor Web para redirecionar esta URL para h.online-metrix.net|

**Variáveis**
Existem duas variáveis a serem preenchidas na URL do Javascript. O `org_id` e o `session_id`. O `org_id` é um valor predefinido conforme tabela abaixo, já o `session_id` é composto pela concatenação dos parâmetros `ProviderMerchantId` e `FraudAnalysis.FingerPrintId`, conforme exemplo abaixo:

|Variável|Descrição|
|:-|:-|
|`org_id`|para Sandbox = 1snn5n9w <br/> para Produção = k8vif92e|
|`session_id`|`ProviderMerchantId` = Identificador da sua loja na Cybersource. Caso não possua, entre em contato com a Braspag <br/> `FraudAnalysis.FingerPrintId` = Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas.|

**Aplicação**

O modelo do Javascript é o seguinte:

![Exemplo Código]({{ site.baseurl_root }}/images/braspag/af/exemploscriptdfp.png)

As variáveis, quando devidamente preenchidas, forneceriam uma URL semelhante ao exemplo abaixo:

![Exemplo URL](braspag.github.io/images/braspag/af/urldfp.jpg)

<aside class="warning">Certifique-se de copiar todos os dados corretamente e de ter substituído as variáveis corretamente pelos respectivos valores.</aside>

**Configurando seu Servidor Web**

Todos os objetos se referem a h.online-metrix.net, que é o DNS do servidor de fingerprint. Quando você estiver pronto para produção, você deve alterar o nome do servidor para uma URL local, e configurar no seu servidor Web um redirecionamento de URL para h.online-metrix.net.

<aside class="warning">Se você não completar essa seção, você não receberá resultados corretos, e o domínio (URL) do fornecedor de fingerprint ficará visível, sendo mais provável que seu consumidor o bloqueie.</aside>

### Integração em aplicativos mobile

**Baixando o SDK**
Se você ainda não baixou o SDK do iOS ou do Android, deve fazê-lo antes de continuar. Para isso acesse um dos links abaixo de acordo com o desejado.<br/> [Download Deviceprint SDK iOS]({{ site.baseurl_root }}/files/braspag/antifraude/cybersource-iossdk-fingerprint-v5.0.32.zip) <br/> [Download Deviceprint SDK Android]({{ site.baseurl_root }}/files/braspag/antifraude/cybersource-androidsdk-fingerprint-v5.0.96.zip)

# Pagamentos com Split de Pagamento

É possível dividir uma venda enviada para o Pagador em várias liquidações para contas diferentes através do Split Braspag. Para utilizar o Split, é necessário contratar o serviço com seu executivo comercial.

Para conhecer mais sobre o Split, entender o relacionamento entre Loja Master e Loja subordinada etc, leia a [documentação Split](https://braspag.github.io//manual/split-pagamentos-braspag#introdu%C3%A7%C3%A3o)

<aside class="notice">Embora não seja necessário integrar-se com a API 3.0 da Cielo, é mandatório uma afiliação à Cielo para transacionar com o Split através do Pagador.</aside>

## Requisição

Para submeter uma transação do Pagador ao Split, basta enviar o Parâmetro `Payment.DoSplit` como _true_ e adicionar o nó `Payment.SplitPayments` conforme exemplo:

```json
{  
   [...]
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "DoSplit":true,
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false",
         "Alias":""
      },
      "SplitPayments":[  
         {  
            "SubordinateMerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "Amount":6000,
            "Fares":{  
               "Mdr":5,
               "Fee":30
            }
         },
         {  
            "SubordinateMerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "Amount":4000,
            "Fares":{  
               "Mdr":4,
               "Fee":15
            }
         }
      ]
   [...]
   }
}
```

```shell

curl
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary

{  
   [...]
   "Payment":{  
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Currency":"BRL",
      "Country":"BRA",
      "Installments":1,
      "Interest":"ByMerchant",
      "Capture":true,
      "Authenticate":false,
      "Recurrent":false,
      "SoftDescriptor":"Mensagem",
      "DoSplit":true,
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":"false",
         "Alias":""
      },
      "SplitPayments":[  
         {  
            "SubordinateMerchantId":"7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "Amount":6000,
            "Fares":{  
               "Mdr":5,
               "Fee":30
            }
         },
         {  
            "SubordinateMerchantId":"2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "Amount":4000,
            "Fares":{  
               "Mdr":4,
               "Fee":15
            }
         }
      ]
   [...]
   }
}
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`Payment.DoSplit`|Booleano|---|Não (Default false)|Booleano que indica se a transação será dividida entre várias contas (true) ou não (false)|
|`SplitPayments.SubordinateMerchantId`|Guid|36|Sim|Identificador do Seller na Braspag|
|`SplitPayments.Amount`|Número|15|Sim|Total da venda do Seller específico. R$ 10,00 = 1000|
|`SplitPayments.Fares.Mdr`|Decimal|3,2|Sim|Taxa aplicada pela loja Master sobre o Seller para desconto|
|`SplitPayments.Fares.Fee`|Número|15|Não|Tarifa aplicada pela loja Master sobre o Seller para desconto|

## Resposta

```json
{
[...]
    },
    "Payment": {
        "SplitPayments": [
            {
                "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                "Amount": 6000,
                "Fares": {
                    "Mdr": 5,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                        "Amount": 5670
                    },
                    {
                        "MerchantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                        "Amount": 330
                    }
                ]
            },
            {
                "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                "Amount": 4000,
                "Fares": {
                    "Mdr": 4,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                        "Amount": 3825
                    },
                    {
                        "MerchantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                        "Amount": 175
                    }
                ]
            }
        ],
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "DoSplit":true,
        "CreditCard": {
            "CardNumber": "455187******0181",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "1210031135775",
        "ProofOfSale": "20171210031135775",
        "AuthorizationCode": "605861",
        "SoftDescriptor": "Marketplace",
        "Provider": "Simulado",
        "Amount": 10000,
        "ReceivedDate": "2017-12-10 15:11:34",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-12-10 15:11:35",
        "Status": 2,
        "IsSplitted": true,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "6",
        "PaymentId": "ef7a7cf9-b66b-4772-b022-052bdcf3e9b0",
        "Currency": "BRL",
        "Country": "BRA",
        [...]
    }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
[...]
    },
    "Payment": {
        "SplitPayments": [
            {
                "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                "Amount": 6000,
                "Fares": {
                    "Mdr": 5,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                        "Amount": 5670
                    },
                    {
                        "MerchantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                        "Amount": 330
                    }
                ]
            },
            {
                "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                "Amount": 4000,
                "Fares": {
                    "Mdr": 4,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                        "Amount": 3825
                    },
                    {
                        "MerchantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                        "Amount": 175
                    }
                ]
            }
        ],
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "DoSplit":true,
        "CreditCard": {
            "CardNumber": "455187******0181",
            "Holder": "Teste Holder",
            "ExpirationDate": "12/2021",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Tid": "1210031135775",
        "ProofOfSale": "20171210031135775",
        "AuthorizationCode": "605861",
        "SoftDescriptor": "Marketplace",
        "Provider": "Simulado",
        "Amount": 10000,
        "ReceivedDate": "2017-12-10 15:11:34",
        "CapturedAmount": 10000,
        "CapturedDate": "2017-12-10 15:11:35",
        "Status": 2,
        "IsSplitted": true,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "6",
        "PaymentId": "ef7a7cf9-b66b-4772-b022-052bdcf3e9b0",
        "Currency": "BRL",
        "Country": "BRA",
        [...]
    }
}
```

|Propriedade|Tipo|Tamanho|Descrição|
|-----------|----|-------|---------|
|`SplitPayments.Splits.MerchantId`|Guid|36|Identificador das lojas Master e seller na Braspag|
|`SplitPayments.Splits.Amount`|Número|15|Valor líquido da venda proporcional ao Master e ao seller após a aplicação de taxas e tarifas|

# Consultas

## Consultando uma transação via PaymentID

<aside class="notice"><strong>Regra:</strong>
<ul>
<li>Transação com vida até 3 meses – consulta via API ou  Painel Admin Braspag</a></li>
<li>Transação com vida de 3 meses a 12 meses - somente via consulta no  Painel Admin Braspag</a> com a opção “Histórico” selecionada</li>
<li>Transação com vida acima de 12 meses - entrar em contato com seu Executivo Comercial Braspag</li>
</ul>
</aside>

Para consultar uma transação de cartão de crédito, é necessário fazer um GET para o recurso Payment conforme o exemplo.

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales/{PaymentId}</span></aside>

```shell
curl
--request GET "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`PaymentId`|Numero de identificação do Pagamento. |Texto |36 |Sim|

### Resposta

```json
{
  "MerchantOrderId": "2017051001",
  "Customer": {
    "Name": "Nome do Cliente",
    "Identity": "12345678909",
    "Address": {
        "Street": "GONCALO DA CUNHA",
        "Number": "111",
        "ZipCode": "04140040",
        "City": "SAO PAULO",
        "State": "SP",
        "Country": "BRA",
        "District": "CHACARA INGLESA"
     }
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "Brand": "Visa"
    },
    "ProofOfSale": "2539492",
    "AcquirerTransactionId": "0510042539492",
    "AuthorizationCode": "759497",
    "VelocityAnalysis": {
      "Id": "f8078b32-be17-4c35-b164-ad74c3cd0725",
      "ResultMessage": "Accept",
      "Score": 0
    },
    "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-10 16:25:38",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "Status": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
      },
      {
        "Method": "PUT",
        "Rel": "capture",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
      }
    ]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "MerchantOrderId": "2017051001",
  "Customer": {
    "Name": "Nome do Cliente",
    "Address": {}
  },
  "Payment": {
    "ServiceTaxAmount": 0,
    "Installments": 1,
    "Interest": "ByMerchant",
    "Capture": true,
    "Authenticate": false,
    "CreditCard": {
      "CardNumber": "455187******0181",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "Brand": "Visa"
    },
    "ProofOfSale": "2539492",
    "AcquirerTransactionId": "0510042539492",
    "AuthorizationCode": "759497",
    "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
    "Type": "CreditCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-10 16:25:38",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Simulado",
    "ReasonCode": 0,
    "Status": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
      },
      {
        "Method": "PUT",
        "Rel": "capture",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
      }
    ]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`MerchantOrderId`|Numero de identificação do Pedido|Texto|50|Texto alfanumérico|
|`Customer.Name`|Nome do comprador|Texto|255|Texto alfanumérico|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do Cliente|Texto |14 |Texto alfanumérico|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ)|Texto|255|CPF ou CNPJ|
|`Customer.Email`|Email do comprador|Texto|255|Texto alfanumérico|
|`Customer.Birthdate`|Data de nascimento do Comprador|Date|10|formato AAAA-MM-DD|
|`Customer.Address.Street`|Endereço de contato do comprador|Texto|255|Texto alfanumérico|
|`Customer.Address.Number`|Número endereço de contato do comprador|Texto|15|Texto alfanumérico|
|`Customer.Address.Complement`|Complemento do endereço de contato do Comprador|Texto|50|Texto alfanumérico|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador|Texto|9|Texto alfanumérico|
|`Customer.Address.City`|Cidade do endereço de contato do comprador|Texto|50|Texto alfanumérico|
|`Customer.Address.State`|Estado do endereço de contato do comprador|Texto|2|Texto alfanumérico|
|`Customer.Address.Country`|Pais do endereço de contato do comprador|Texto|35|Texto alfanumérico|
|`Customer.Address.District`|Bairro do Comprador|Texto |50 |Texto alfanumérico|
|`Customer.DeliveryAddress.Street`|Endereço do comprador|Texto|255|Texto alfanumérico|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega do pedido|Texto|15|Texto alfanumérico|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega do pedido|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega do pedido|Texto|9|Texto alfanumérico|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega do pedido|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega do pedido|Texto|2|Texto alfanumérico|
|`Customer.DeliveryAddress.Country`|Pais do endereço de entrega do pedido|Texto|35|Texto alfanumérico|
|`Customer.DeliveryAddress.District`|Bairro do Comprador. |Texto |50 |Texto alfanumérico|
|`Payment.Provider`|Nome da provedora de Meio de Pagamento|Texto|15| Consulta os provedores disponíveis nos anexos|
|`Payment.Type`|Tipo do Meio de Pagamento|Texto|100|Ex. CreditCard|
|`Payment.Amount`|Valor do Pedido (ser enviado em centavos)|Número|15|10000|
|`Payment.ServiceTaxAmount`|Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização|Número|15|10000|
|`Payment.Currency`|Moeda na qual o pagamento será feito|Texto|3|BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|País na qual o pagamento será feito|Texto|3|BRA|
|`Payment.Installments`|Número de Parcelas|Número|2|6|
|`Payment.Interest`|Tipo de parcelamento|Texto|10|Loja (ByMerchant) ou Emissor (ByIssuer)|
|`Payment.Capture`|Booleano que indica se a autorização deve ser com captura automática (true) ou não (false). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|Booleano|--- (Default false)|Booleano|
|`Payment.Authenticate`|Booleano que indica se a transação deve ser autenticada (true) ou não (false). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|Booleano|--- (Default false)|Booleano|
|`Payment.Recurrent`|Booleano que indica se a transação é do tipo recorrente (true) ou não (false). Este com valor true não originará uma nova Recorrência, apenas permitirá a realização de uma transação sem a necessidade de envio do CVV. Somente para transações Cielo. Authenticate deve ser false quando Recurrent é true|Booleano|--- (Default false)|Booleano|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador|Texto|13|Texto alfanumérico|
|`Payment.ExtraDataCollection.Name`|Nome do campo que será gravado o Dado Extra|Texto|50|Texto alfanumérico|
|`Payment.ExtraDataCollection.Value`|Valor do campo que será gravado o Dado Extra|Texto|1024|Texto alfanumérico|
|`Payment.AcquirerTransactionId`|Id da transação no provedor de meio de pagamento|Texto|40|Texto alfanumérico|
|`Payment.ProofOfSale`|Número do Comprovante de Venda|Texto|20|Texto alfanumérico|
|`Payment.AuthorizationCode`|Código de autorização|Texto|300|Texto alfanumérico|
|`Payment.PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.ReasonCode`|Código de retorno da Adquirência|Texto|32|Texto alfanumérico|
|`Payment.ReasonMessage`|Mensagem de retorno da Adquirência|Texto|512|Texto alfanumérico|
|`Payment.Status`|Status da Transação|Byte|2| Ex. 1|
|`Payment.ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e bancos)|Texto|32|57|
|`Payment.ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e bancos)|Texto|512|Transação Aprovada|
|`CreditCard.CardNumber`|Número do Cartão do comprador|Texto|16|
|`CreditCard.Holder`|Nome do portador impresso no cartão|Texto|25|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão|Texto|7|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão|Texto|4|
|`CreditCard.Brand`|Bandeira do cartão|Texto|10 |
|`CreditCard.SaveCard`|Booleano que identifica se o cartão será salvo para gerar o token (CardToken)|Booleano|--- (Default false)|

## Consultando uma transação de Boleto via PaymentID

<aside class="notice"><strong>Regra:</strong>
<ul>
<li>Transação com vida até 3 meses – consulta via API ou  Painel Admin Braspag</a></li>
<li>Transação com vida de 3 meses a 12 meses - somente via consulta no  Painel Admin Braspag</a> com a opção “Histórico” selecionada</li>
<li>Transação com vida acima de 12 meses - entrar em contato com seu Executivo Comercial Braspag</li>
</ul>
</aside>

Para consultar uma transação de boleto registrado, é necessário fazer um GET para o recurso Payment conforme o exemplo.

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales/{PaymentId}</span></aside>

```shell
curl
--request GET "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`PaymentId`|Numero de identificação do Pagamento. |Guid |36 |Sim|

### Resposta

```json
{
  "MerchantOrderId": "2017051001",
  "Customer": {
    "Name": "Nome do Cliente",
    "Identity": "12345678909",
    "Address": {
        "Street": "GONCALO DA CUNHA",
        "Number": "111",
        "ZipCode": "04140040",
        "City": "SAO PAULO",
        "State": "SP",
        "Country": "BRA",
        "District": "CHACARA INGLESA"
     }
  },
  "Payment": {
     "Instructions": "",
     "ExpirationDate": "2018-06-27",
     "Demonstrative": "",
     "Url": "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX",
     "BoletoNumber": "123464",
     "BarCodeNumber": "9999990276000001234864001834099999999",
     "DigitableLine": "99999.39027 60000.012348 64001.834007 7 75680999999999",
     "Assignor": "RAZAO SOCIAL DA LOJA LTDA.",
     "Address": "",
     "Identification": "01234567000189",
     "CreditDate": "2018-06-28",
     "PaymentId": "99992279-1c45-4271-9656-ccbde4ea9999",
     "Type": "Boleto",
     "Amount": 182000,
     "ReceivedDate": "2018-06-26 23:33:07",
     "CapturedAmount": 182000,
     "CapturedDate": "2018-06-27 01:45:57",
     "Currency": "BRL",
     "Country": "BRA",
     "Provider": "Bradesco2",
     "ReturnUrl": "https://www.loja.com.br/notificacao",
     "ExtraDataCollection": [],
     "ReasonCode": 0,
     "Status": 2,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
      },
      {
        "Method": "PUT",
        "Rel": "capture",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
      }
    ]
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "MerchantOrderId": "2017051001",
  "Customer": {
    "Name": "Nome do Cliente",
    "Identity": "12345678909",
    "Address": {
        "Street": "GONCALO DA CUNHA",
        "Number": "111",
        "ZipCode": "04140040",
        "City": "SAO PAULO",
        "State": "SP",
        "Country": "BRA",
        "District": "CHACARA INGLESA"
     }
  },
  "Payment": {
     "Instructions": "",
     "ExpirationDate": "2018-06-27",
     "Demonstrative": "",
     "Url": "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX",
     "BoletoNumber": "123464",
     "BarCodeNumber": "9999990276000001234864001834099999999",
     "DigitableLine": "99999.39027 60000.012348 64001.834007 7 75680999999999",
     "Assignor": "RAZAO SOCIAL DA LOJA LTDA.",
     "Address": "",
     "Identification": "01234567000189",
     "CreditDate": "2018-06-28",
     "PaymentId": "99992279-1c45-4271-9656-ccbde4ea9999",
     "Type": "Boleto",
     "Amount": 182000,
     "ReceivedDate": "2018-06-26 23:33:07",
     "CapturedAmount": 182000,
     "CapturedDate": "2018-06-27 01:45:57",
     "Currency": "BRL",
     "Country": "BRA",
     "Provider": "Bradesco2",
     "ReturnUrl": "https://www.loja.com.br/notificacao",
     "ExtraDataCollection": [],
     "ReasonCode": 0,
     "Status": 2,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725"
      },
      {
        "Method": "PUT",
        "Rel": "capture",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/capture"
      },
      {
        "Method": "PUT",
        "Rel": "void",
        "Href": "https://apisandbox.braspag.com.br/v2/sales/f8078b32-be17-4c35-b164-ad74c3cd0725/void"
      }
    ]
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`MerchantOrderId`|Numero de identificação do Pedido|Texto|50|Texto alfanumérico|
|`Customer.Name`|Nome do comprador|Texto|255|Texto alfanumérico|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do Cliente|Texto |14 |Texto alfanumérico|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ)|Texto|255|CPF ou CNPJ|
|`Customer.Email`|Email do comprador|Texto|255|Texto alfanumérico|
|`Customer.Birthdate`|Data de nascimento do Comprador|Date|10|formato AAAA-MM-DD|
|`Customer.Address.Street`|Endereço de contato do comprador|Texto|255|Texto alfanumérico|
|`Customer.Address.Number`|Número endereço de contato do comprador|Texto|15|Texto alfanumérico|
|`Customer.Address.Complement`|Complemento do endereço de contato do Comprador|Texto|50|Texto alfanumérico|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador|Texto|9|Texto alfanumérico|
|`Customer.Address.City`|Cidade do endereço de contato do comprador|Texto|50|Texto alfanumérico|
|`Customer.Address.State`|Estado do endereço de contato do comprador|Texto|2|Texto alfanumérico|
|`Customer.Address.Country`|Pais do endereço de contato do comprador|Texto|35|Texto alfanumérico|
|`Customer.Address.District`|Bairro do Comprador|Texto |50 |Texto alfanumérico|
|`Customer.DeliveryAddress.Street`|Endereço do comprador|Texto|255|Texto alfanumérico|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega do pedido|Texto|15|Texto alfanumérico|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega do pedido|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega do pedido|Texto|9|Texto alfanumérico|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega do pedido|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega do pedido|Texto|2|Texto alfanumérico|
|`Customer.DeliveryAddress.Country`|Pais do endereço de entrega do pedido|Texto|35|Texto alfanumérico|
|`Customer.DeliveryAddress.District`|Bairro do Comprador. |Texto |50 |Texto alfanumérico|
|`Payment.Provider`|Nome da provedora de Meio de Pagamento|Texto|15| Consulta os provedores disponíveis nos anexos|
|`Payment.Type`|Tipo do Meio de Pagamento|Texto|100|Ex. Boleto|
|`Payment.Amount`|Valor do Pedido (em centavos)|Número|15|10000|
|`Payment.CapturedAmount`|Valor pago do boleto (em centavos)|Número|15|10000|
|`Payment.Instructions`|Texto sobre alguma instrução específica para o boleto|Texto|Vide Tabela dos bancos|Ex. "Não pagar após o vencimento"|
|`Payment.Demonstrative`|Texto sobre alguma informação específica para o boleto|Texto|Vide Tabela dos bancos|Ex. "Boleto referente ao pedido número 99999"|
|`Payment.Url`|URL para apresentação do boleto|Texto|-|Ex. "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX"|
|`Payment.BoletoNumber`|Nosso Número|Texto|Vide Tabela dos bancos|Ex. "12345678"|
|`Payment.BarCodeNumber`|Código de Barras do boleto|Texto|44|Ex. "99999390276000001234864001834007775680099999"|
|`Payment.DigitableLine`|Linha digitável do boleto|Texto|54|Ex. "99999.39027 60000.012348 64001.834007 7 75680000199999"|
|`Payment.Assignor`|Nome do cedente do boleto|Texto|200|Ex. "RAZAO SOCIAL DA LOJA LTDA"|
|`Payment.Address`|Endereço do cedente do boleto|Texto|160|Ex. "Alameda Xingu 512"|
|`Payment.Identification`|CNPJ do cedente|Texto|18|Ex. "11.355.111/0001-11"|
|`Payment.ExpirationDate`|Data de vencimento do boleto|Texto|AAAA-MM-DD|Ex. "2018-06-21"|
|`Payment.CreditDate`|Data de crédito do valor pago do boleto|Texto|AAAA-MM-DD|Ex. "2018-06-19"|
|`Payment.CapturedDate`|Data de pagamento do boleto|Texto|AAAA-MM-DD HH:mm:SS|Ex. "2018-06-19 01:45:57"|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|AAAA-MM-DD HH:mm:SS|Ex. "2018-06-19 01:45:57"|
|`Payment.ReturnUrl`|URL da loja para onde redireciona o cliente|Texto|-|Ex. "https://www.loja.com.br"|
|`Payment.Currency`|Moeda na qual o pagamento será feito|Texto|3|BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|País na qual o pagamento será feito|Texto|3|BRA|
|`Payment.ExtraDataCollection.Name`|Nome do campo que será gravado o Dado Extra|Texto|50|Texto alfanumérico|
|`Payment.ExtraDataCollection.Value`|Valor do campo que será gravado o Dado Extra|Texto|1024|Texto alfanumérico|
|`Payment.PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.ReasonCode`|Código de retorno da Adquirência|Texto|32|Texto alfanumérico|
|`Payment.Status`|Status da Transação|Byte|2| Ex. 1|

## Consultando uma venda pelo identificador da loja

<aside class="notice"><strong>Regra:</strong>
<ul>
<li>Transação com vida até 3 meses – consulta via API ou  Painel Admin Braspag</a></li>
<li>Transação com vida de 3 meses a 12 meses - somente via consulta no  Painel Admin Braspag</a> com a opção “Histórico” selecionada</li>
<li>Transação com vida acima de 12 meses - entrar em contato com seu Executivo Comercial Braspag</li>
</ul>
</aside>

Não é possível consultar diretamente uma pagamento pelo identificador enviado pela loja (MerchantOrderId), mas é possível obter todos os PaymentIds associados ao identificador.

Para consultar uma venda pelo identificador da loja, é necessário fazer um GET para o recuso sales conforme o exemplo.

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales?merchantOrderId={merchantOrderId}</span></aside>

```shell
curls
--request GET "https://apiquerysandbox.braspag.com.brv2/sales?merchantOrderId={merchantOrderId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`MerchantOrderId`|Campo Identificador do Pedido na Loja. |Texto |36 |Sim|

### Resposta

```json
{
    "Payment": [
        {
            "PaymentId": "5fb4d606-bb63-4423-a683-c966e15399e8",
            "ReceveidDate": "2015-04-06T10:13:39.42"
        },
        {
            "PaymentId": "6c1d45c3-a95f-49c1-a626-1e9373feecc2",
            "ReceveidDate": "2014-12-19T20:23:28.847"
        }
    ]
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Payments": [
        {
            "PaymentId": "5fb4d606-bb63-4423-a683-c966e15399e8",
            "ReceveidDate": "2015-04-06T10:13:39.42"
        },
        {
            "PaymentId": "6c1d45c3-a95f-49c1-a626-1e9373feecc2",
            "ReceveidDate": "2014-12-19T20:23:28.847"
        }
    ]
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`PaymentId`|Campo Identificador do Pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Consultando um pedido Recorrente

Para consultar um pedido de Recorrência, é necessário fazer um GET conforme o exemplo.

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}</span></aside>

```shell
curl
--request GET "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |Guid |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | Guid | 36 |Não|
|`RecurrentPaymentId`|Campo Identificador da Recorrência. |Texto |36 |Sim|

### Resposta

```json
{
  "Customer": {
    "Name": "Nome do Cliente"
  },
  "RecurrentPayment": {
    "Installments": 1,
    "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
    "NextRecurrency": "2017-06-11",
    "StartDate": "2017-05-11",
    "EndDate": "2019-12-31",
    "Interval": "Monthly",
    "Amount": 10000,
    "Country": "BRA",
    "CreateDate": "2017-05-11T00:00:00",
    "Currency": "BRL",
    "CurrentRecurrencyTry": 1,
    "OrderNumber": "2017051120",
    "Provider": "Simulado",
    "RecurrencyDay": 11,
    "SuccessfulRecurrences": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/f5a83c14-0254-4e73-bdd3-9afba1007266"
      }
    ],
    "RecurrentTransactions": [
      {
        "PaymentNumber": 0,
        "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
        "TransactionId": "cd694ffb-c0c4-47db-9390-737df70a2012",
        "TryNumber": 1,
        "Links": [
          {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/cd694ffb-c0c4-47db-9390-737df70a2012"
          }
        ]
      }
    ],
    "Status": 1
  }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
  "Customer": {
    "Name": "Nome do Cliente"
  },
  "RecurrentPayment": {
    "Installments": 1,
    "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
    "NextRecurrency": "2017-06-11",
    "StartDate": "2017-05-11",
    "EndDate": "2019-12-31",
    "Interval": "Monthly",
    "Amount": 10000,
    "Country": "BRA",
    "CreateDate": "2017-05-11T00:00:00",
    "Currency": "BRL",
    "CurrentRecurrencyTry": 1,
    "OrderNumber": "2017051120",
    "Provider": "Simulado",
    "RecurrencyDay": 11,
    "SuccessfulRecurrences": 1,
    "Links": [
      {
        "Method": "GET",
        "Rel": "self",
        "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/f5a83c14-0254-4e73-bdd3-9afba1007266"
      }
    ],
    "RecurrentTransactions": [
      {
        "PaymentNumber": 0,
        "RecurrentPaymentId": "f5a83c14-0254-4e73-bdd3-9afba1007266",
        "TransactionId": "cd694ffb-c0c4-47db-9390-737df70a2012",
        "TryNumber": 1,
        "Links": [
          {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/cd694ffb-c0c4-47db-9390-737df70a2012"
          }
        ]
      }
    ],
    "Status": 1
  }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|Campo Identificador da próxima recorrência. |Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data da próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`StartDate`|Data do inicio da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrência. |Texto |10 |<ul><li>Monthly</li><li>Bimonthly </li><li>Quarterly </li><li>SemiAnnual </li><li>Annual</li></ul> |
|`CurrentRecurrencyTry`|Indica o número de tentativa da recorrência atual |Número|1|1|
|`OrderNumber`|Identificado do Pedido na loja |Texto|50 |2017051101|
|`Status`|Status do pedido recorrente |Número|1 |<UL><LI>1 - Ativo</LI><LI>2 - Finalizado</LI><LI>3,4,5 - Inativo</LI></UL> |
|`RecurrencyDay`|O dia da recorrência |Número|2 |22 |
|`SuccessfulRecurrences`|Quantidade de recorrência realizada com sucesso|Número|2 |5|
|`RecurrentTransactions.RecurrentPaymentId`|Id da Recorrência|Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`RecurrentTransactions.TransactionId`|Payment ID da transação gerada na recorrência|Guid |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`RecurrentTransactions.PaymentNumber`|Número da Recorrência. A primeira é zero |Número|2 |3 |
|`RecurrentTransactions.TryNumber`|Número da tentativa atual na recorrência específica |Número|2 |1 |

# Post de Notificação

Para receber a notificação de alteração de status deve-se ter configurado no cadastro de sua loja na Braspag, o campo URL Status Pagamento para receber os parametros conforme o exemplo ao lado.

Resposta esperada da Loja: HTTP Status Code 200 OK

Caso não seja retornado o HTTP Status Code 200 OK será tentado mais duas vezes enviar o Post de Notificação.

```json
{
   "RecurrentPaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "ChangeType": "2"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`RecurrentPaymentId`|Identificador que representa o pedido Recorrente (aplicável somente para ChangeType 2 ou 4|GUID|36|Não|
|`PaymentId`|Identificador que representa a transação|GUID|36|Sim|
|`ChangeType`|Especifica o tipo de notificação. Vide tabela abaixo | Número | 1 |Sim|

|ChangeType|Descrição|
|----------|---------|
|1|Mudança de status do pagamento|
|2|Recorrência criada|
|3|Mudança de status do Antifraude|
|4|Mudança de status do pagamento recorrente (Ex. desativação automática)|
|5|Estorno negado (aplicável para Rede)|
|6|Boleto registrado pago a menor|

# Anexos

## Lista de Providers

### Providers para Crédito

|Provider|Brand|Descrição|
|--------|-----|---------|
|Simulado|---|Provider de Sandbox|
|Cielo|Visa, Master, Amex, Elo, Aura, Jcb, Diners, Discover|Provider para transações na plataforma legado Cielo 1.5|
|Cielo30|Visa, Master, Amex, Elo, Aura, Jcb, Diners, Discover, Hipercard, Hiper|Provider para transações na plataforma de e-commerce Cielo 3.0|
|Redecard|Visa, Master, Hipercard, Hiper, Diners|Provider para transações na plataforma legado Rede Komerci|
|Rede|Visa, Master, Hipercard, Hiper, Diners, Elo, Amex|Provider para transações na plataforma de e-commerce Rede e-Rede na versão SOAP|
|Rede2|Visa, Master, Hipercard, Hiper, Diners, Elo, Amex|Provider para transações na plataforma de e-commerce Rede e-Rede na versão REST|
|Getnet|Visa, Master, Elo, Amex|Provider para transações na plataforma de e-commerce GetNet|
|GlobalPayments|Visa, Master|Provider para transações na plataforma de e-commerce Global Payments|
|Stone|Visa, Master, Hipercard, Elo|Provider para transações na plataforma de e-commerce Stone|
|FirstData|Visa, Master, Cabal|Provider para transações em guaranis (PYG), pesos argentinos (ARG) e reais (BRL) na plataforma de e-commerce First Data|
|Sub1|Visa, Master, Diners, Amex, Discover, Cabal, Naranja e Nevada|Provider para transações em pesos argentinos (ARG) na plataforma legado Sub1 First Data|
|Banorte|Visa, Master, Carnet|Provider para transações em pesos mexicanos (MXN) na plataforma de e-commerce Banorte|
|Credibanco|Visa, Master, Diners, Amex, Credential|Provider para transações em pesos colombianos (COP) na plataforma de e-commerce Credibanco|
|Transbank|Visa, Master, Diners, Amex|Provider para transações em pesos chilenos (CLP) na plataforma de e-commerce Transbank|
|RedeSitef|Visa, Master, Hipercard, Diners|Provider para transações na plataforma Rede com tecnologia TEF|
|CieloSitef|Visa, Master, Amex, Elo, Aura, Jcb, Diners, Discover|Provider para transações na plataforma Cielo com tecnologia TEF|
|SantanderSitef|Visa, Master|Provider para transações na plataforma GetNet com tecnologia TEF|
|DMCard|---|---|

### Providers pra Débito

|Provider|Brand|Descrição|
|--------|-----|---------|
|Cielo|Visa, Master|Provider para transações de débito na plataforma legado Cielo 1.5|
|Cielo30|Visa, Master|Provider para transações de débito na plataforma de e-commerce Cielo 3.0|
|Getnet|Visa, Master|Provider para transações de débito na plataforma de e-commerce GetNet|
|FirstData|Visa, Master|Provider para transações de débito na plataforma de e-commerce First Data|
|GlobalPayments|Visa, Master|Provider para transações de débito na plataforma de e-commerce Global Payments|

### Providers pra Voucher

|Provider|Brand|Descrição|
|--------|-----|---------|
|Alelo|Elo|Provider para transações de voucher (vale refeição/alimentação) na plataforma Alelo|

### Providers para Zero Auth via VerifyCard

|Provider|
|--------|
|Simulado|
|Cielo30 (Cielo 3.0)|
|Rede2 (e-Rede REST)|
|Getnet|
|FirstData|
|GlobalPayments|

### Providers para Consulta BIN via VerifyCard

|Provider|
|--------|
|Simulado|
|Cielo30 (Cielo 3.0)|

### Providers para Boleto com Registro

|Provider|
|--------|
|Bradesco2, BancoDoBrasil2, ItauShopline, Itau2, Santander2, Caixa2, CitiBank2, BankOfAmerica|

### Providers para Transferência Eletronica (Débito Online)

|Provider|
|--------|
|Bradesco, BancoDoBrasil, SafetyPay, Itau|

## Lista de Status da Transação

Status retornados pela API

|Código|Status do Pagamento|Meio de pagamento|Descrição|
|------|-------------------|-----------------|---------|
|0|NotFinished|Todos|Falha ao processar o pagamento|
|1|Authorized|Todos|Meio de pagamento apto a ser capturado ou pago(Boleto)|
|2|PaymentConfirmed|Todos|Pagamento confirmado e finalizado|
|3|Denied|Cartão de Crédito e Débito (Transferência eletrônica) |
|10|Voided|Todos|Pagamento cancelado|
|11|Refunded|Cartão de crédito e Débito|Pagamento Cancelado/Estornado|
|12|Pending|Cartão de Crédito e Débito  (Transferência eletrônica) |Esperando retorno da instituição financeira|
|13|Aborted|Todos|Pagamento cancelado por falha no processamento|
|20|Scheduled|Cartão de crédito|Recorrência agendada|

## Lista de Status do Antifraude

| Código | Descrição  |
|--------|------------|
| 0      | Unknown    |
| 1      | Accept     |
| 2      | Reject     |
| 3      | Review     |
| 4      | Aborted    |
| 5      | Unfinished |

## Tabela de MDDs (_merchant defined data_)

|ID|Valor|Tipo|
|:-|:-|:-|
|1|Cliente efetuou Login <br/> Se o cliente final logou no site para comprar, enviar: o login dele <br/> Se fez compra como visitante, enviar: Guest <br/> Se a venda foi feita direto por um terceiro, um agente por exemplo, não enviar o campo|string|
|2|Quantidade em dias que o cliente é seu cliente|int|
|3|Quantidade de parcelas do pedido|int|
|4|Canal de Venda <br/> Possíveis valores: <br/> Call Center -> compra pelo telefone <br/> Web -> compra pela web <br/> Portal -> um agente fazendo a compra para o cliente <br/> Quiosque -> compras em quiosques <br/> Movel -> compras feitas em celulares ou tablets|string|
|5|Enviar o código do cupom/desconto caso o cliente utilize na compra|string|
|6|Data da última compra realizada pelo cliente <br/> Formato: MM-DD-AAAA - Ex.: 12-15-2017|date|
|7|Código ou nome do seller (vendedor)|string|
|8|Tentativas realizada pelo cliente de efetuar o pagamento do mesmo pedido, podendo ser com diferentes cartões de créditos e/ou através de outros meios de pagamentos|int|
|9|Identifica se cliente irá retirar o produto na loja <br/> Possíveis valores: SIM ou NAO|string|
|10|Identifica se o pagamento será realizado por outra pessoa que não esteja presente na viagem ou pacote <br/> Possíveis valores: SIM ou NAO|string|
|11|Categoria do hotel (quantas estrelas) <br/> Possíveis valores: <br/> 1 -> Simples <br/> 2 -> Econômico <br> 3 -> Turismo <br/> 4 -> Superior <br/> 5 -> Luxo|int|
|12|Data de checkin no hotel <br/> Formato: MM-DD-AAAA - Ex.: 12-05-2018|date|
|13|Data de checkout no hotel <br/> Formato: MM-DD-AAAA - Ex.: 19-05-2018|date|
|14|Categoria da viagem ou pacote <br> Possíveis valores: Nacional ou Internacional ou Nacional/Internacional|string|
|15|Nome da companhia aérea / locadora de carro / hotel <br/> Enviar o nome de cada uma das empresas, separado por /|string|
|16|Código PNR da reserva <br/> Quando houver uma alteração da reserva para este PNR, com antecipação da data de voo, é importante fazer uma nova análise de fraude enviando este PNR novamente|string|
|17|Identifica se houve antecipação de reserva <br/> Possíveis valores: SIM ou NAO <br/> Se sim, fundamental o envio também do campo 16 - Código PNR da reserva|string
|18-25|Reservados para novos campos de turismo|-|
|26|Bin (6 primeiros dígitos) do cartão de crédito|string|
|27-30|Reservados para campos interno|-|
|31|Quantidade de trocas de números de cartão de crédito que o cliente efetuou para realizar o pagamento do pedido|int|
|32|Identifica se o e-mail foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|
|33|Identifica se o número do cartão de crédito foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|
|34|Identifica se o e-mail foi confirmado para ativação de conta <br/> Possível valor: SIM <br/> Caso não tenha sido confirmado ou não exista um processo de ativação de conta com confiração de e-mail, não enviar o campo|string|
|35|Identifica o tipo de cliente <br/> Possíveis valores: Local ou Turista <br/> Caso não possua esta informação, não enviar o campo|string|
|36|Identifica se foi utilizado cartão presente (GiftCard) na compra <br/> Possíveis valor: SIM <br/> Caso não tenho sido utilizado cartão presente na compra, não enviar o campo|string|
|37|Meio de envio do pedido <br/> Possíveis valores: Sedex ou Sedex 10 ou 1 Dia ou 2 Dias ou Motoboy ou Mesmo Dia <br/> Caso não tenha meio de envio, não enviar o campo|string|
|38|Número do telefone do cliente identificado através da bina quando venda realizada através do canal de venda igual a Call Center <br/> Formato: DDDNúmero - Ex.: 2121114720|string|
|39 a 40|Reservados|-|
|41|Tipo do documento <br/> Possíveis Valores: CPF ou CNPJ|string|
|42|Código do ramo de atividade - MCC (Merchant Code Category)|string|
|43|Faixa de rendimento do comprador <br/> Ex.: 100000 = r$ 1.000,00|long|
|44|Tipo de conta bancária <br/> Possíveis Valores: <br/> CC -> Conta Corrente <br/> CP -> Conta Poupança <br/> PP - Pré-Pago|string|
|45|Número do documento CPF ou CNPJ|string|
|46|Nome impresso no cartão de crédito|string|
|47 a 95|Campos livres e definidos junto ao provedor de antifraude, conforme as regras de negócio|-|
|96 a 100|Reservados|-|

## Lista de HTTP Status Code

| HTTP Status Code | Descrição             |
|------------------|-----------------------|
| 200              | OK                    |
| 400              | Bad Request           |
| 404              | Resource Not Found    |
| 500              | Internal Server Error |

## Lista de Status da Recorrência

| Código | Descrição                 |
|--------|---------------------------|
| 1      | Active                    |
| 2      | Finished                  |
| 3      | DisabledByMerchant        |
| 4      | DisabledMaxAttempts       |
| 5      | DisabledExpiredCreditCard |

## Lista de ReasonCode/ReasonMessage

| Reason Code | Reason Message               |
|-------------|------------------------------|
| 0           | Successful                   |
| 1           | AffiliationNotFound          |
| 2           | IssuficientFunds             |
| 3           | CouldNotGetCreditCard        |
| 4           | ConnectionWithAcquirerFailed |
| 5           | InvalidTransactionType       |
| 6           | InvalidPaymentPlan           |
| 7           | Denied                       |
| 8           | Scheduled                    |
| 9           | Waiting                      |
| 10          | Authenticated                |
| 11          | NotAuthenticated             |
| 12          | ProblemsWithCreditCard       |
| 13          | CardCanceled                 |
| 14          | BlockedCreditCard            |
| 15          | CardExpired                  |
| 16          | AbortedByFraud               |
| 17          | CouldNotAntifraud            |
| 18          | TryAgain                     |
| 19          | InvalidAmount                |
| 20          | ProblemsWithIssuer           |
| 21          | InvalidCardNumber            |
| 22          | TimeOut                      |
| 23          | CartaoProtegidoIsNotEnabled  |
| 24          | PaymentMethodIsNotEnabled    |
| 98          | InvalidRequest               |
| 99          | InternalError                |

## Códigos de Erros da API

Códigos retornados em caso de erro, identificando o motivo do erro e suas respectivas mensagens.

|Código|Mensagem|Descrição|
|------|--------|---------|
|0|Internal error|Dado enviado excede o tamanho do campo|
|100|RequestId is required|Campo enviado está vazio ou invalido|
|101|MerchantId is required|Campo enviado está vazio ou invalido|
|102|Payment Type is required|Campo enviado está vazio ou invalido|
|103|Payment Type can only contain letters|Caracteres especiais não permitidos|
|104|Customer Identity is required|Campo enviado está vazio ou invalido|
|105|Customer Name is required|Campo enviado está vazio ou invalido|
|106|Transaction ID is required|Campo enviado está vazio ou invalido|
|107|OrderId is invalid or does not exists|Campo enviado excede o tamanho ou contem caracteres especiais |
|108|Amount must be greater or equal to zero|Valor da transação deve ser maior que "0"|
|109|Payment Currency is required|Campo enviado está vazio ou invalido|
|110|Invalid Payment Currency|Campo enviado está vazio ou invalido|
|111|Payment Country is required|Campo enviado está vazio ou invalido|
|112|Invalid Payment Country|Campo enviado está vazio ou invalido|
|113|Invalid Payment Code|Campo enviado está vazio ou invalido|
|114|The provided MerchantId is not in correct format|O MerchantId enviado não é um GUID|
|115|The provided MerchantId was not found|O MerchantID não existe ou pertence a outro ambiente (EX: Sandbox)|
|116|The provided MerchantId is blocked|Loja bloqueada, entre em contato com o suporte Braspag|
|117|Credit Card Holder is required|Campo enviado está vazio ou invalido|
|118|Credit Card Number is required|Campo enviado está vazio ou invalido|
|119|At least one Payment is required|Nó "Payment" não enviado|
|120|Request IP not allowed. Check your IP White List|IP bloqueado por questões de segurança|
|121|Customer is required|Nó "Customer" não enviado|
|122|MerchantOrderId is required|Campo enviado está vazio ou invalido|
|123|Installments must be greater or equal to one|Numero de parcelas deve ser superior a 1|
|124|Credit Card is Required|Campo enviado está vazio ou invalido|
|125|Credit Card Expiration Date is required|Campo enviado está vazio ou invalido|
|126|Credit Card Expiration Date is invalid|Campo enviado está vazio ou invalido|
|127|You must provide CreditCard Number|Numero do cartão de crédito é obrigatório|
|128|Card Number length exceeded|Numero do cartão superiro a 16 digitos|
|129|Affiliation not found|Meio de pagamento não vinculado a loja ou Provider invalido|
|130|Could not get Credit Card|---|
|131|MerchantKey is required|Campo enviado está vazio ou invalido|
|132|MerchantKey is invalid|O Merchantkey enviado não é um válido|
|133|Provider is not supported for this Payment Type|Provider enviado não existe|
|134|FingerPrint length exceeded|Dado enviado excede o tamanho do campo|
|135|MerchantDefinedFieldValue length exceeded|Dado enviado excede o tamanho do campo|
|136|ItemDataName length exceeded|Dado enviado excede o tamanho do campo|
|137|ItemDataSKU length exceeded|Dado enviado excede o tamanho do campo|
|138|PassengerDataName length exceeded|Dado enviado excede o tamanho do campo|
|139|PassengerDataStatus length exceeded|Dado enviado excede o tamanho do campo|
|140|PassengerDataEmail length exceeded|Dado enviado excede o tamanho do campo|
|141|PassengerDataPhone length exceeded|Dado enviado excede o tamanho do campo|
|142|TravelDataRoute length exceeded|Dado enviado excede o tamanho do campo|
|143|TravelDataJourneyType length exceeded|Dado enviado excede o tamanho do campo|
|144|TravelLegDataDestination length exceeded|Dado enviado excede o tamanho do campo|
|145|TravelLegDataOrigin length exceeded|Dado enviado excede o tamanho do campo|
|146|SecurityCode length exceeded|Dado enviado excede o tamanho do campo|
|147|Address Street length exceeded|Dado enviado excede o tamanho do campo|
|148|Address Number length exceeded|Dado enviado excede o tamanho do campo|
|149|Address Complement length exceeded|Dado enviado excede o tamanho do campo|
|150|Address ZipCode length exceeded|Dado enviado excede o tamanho do campo|
|151|Address City length exceeded|Dado enviado excede o tamanho do campo|
|152|Address State length exceeded|Dado enviado excede o tamanho do campo|
|153|Address Country length exceeded|Dado enviado excede o tamanho do campo|
|154|Address District length exceeded|Dado enviado excede o tamanho do campo|
|155|Customer Name length exceeded|Dado enviado excede o tamanho do campo|
|156|Customer Identity length exceeded|Dado enviado excede o tamanho do campo|
|157|Customer IdentityType length exceeded|Dado enviado excede o tamanho do campo|
|158|Customer Email length exceeded|Dado enviado excede o tamanho do campo|
|159|ExtraData Name length exceeded|Dado enviado excede o tamanho do campo|
|160|ExtraData Value length exceeded|Dado enviado excede o tamanho do campo|
|161|Boleto Instructions length exceeded|Dado enviado excede o tamanho do campo|
|162|Boleto Demostrative length exceeded|Dado enviado excede o tamanho do campo|
|163|Return Url is required|URL de retorno não é valida - Não é aceito paginação ou extenções (EX .PHP) na URL de retorno|
|166|AuthorizeNow is required|---|
|167|Antifraud not configured|Antifraude não vinculado ao cadastro do lojista|
|168|Recurrent Payment not found|Recorrencia não encontrada|
|169|Recurrent Payment is not active|Recorrencia não está ativa. Execução paralizada|
|170|Cartão Protegido not configured|Cartão protegido não vinculado ao cadastro do lojista|
|171|Affiliation data not sent|Falha no processamento do pedido - Entre em contato com o suporte Braspag|
|172|Credential Code is required|Falha na validação das credenciadas enviadas|
|173|Payment method is not enabled|Meio de pagamento não vinculado ao cadastro do lojista|
|174|Card Number is required|Campo enviado está vazio ou invalido|
|175|EAN is required|Campo enviado está vazio ou invalido|
|176|Payment Currency is not supported|Campo enviado está vazio ou invalido|
|177|Card Number is invalid|Campo enviado está vazio ou invalido|
|178|EAN is invalid|Campo enviado está vazio ou invalido|
|179|The max number of installments allowed for recurring payment is 1|Campo enviado está vazio ou invalido|
|180|The provided Card PaymentToken was not found|Token do Cartão protegido não encontrado|
|181|The MerchantIdJustClick is not configured|Token do Cartão protegido bloqueado|
|182|Brand is required|Bandeira do cartão não enviado|
|183|Invalid customer bithdate|Data de nascimento invalida ou futura|
|184|Request could not be empty|Falha no formado ta requisição. Verifique o código enviado|
|185|Brand is not supported by selected provider|Bandeira não suportada pela API Braspag|
|186|The selected provider does not support the options provided (Capture, Authenticate, Recurrent or Installments)|Meio de pagamento não suporta o comando enviado|
|187|ExtraData Collection contains one or more duplicated names|---|
|188|Avs with CPF invalid|---|
|189|Avs with length of street exceeded|Dado enviado excede o tamanho do campo|
|190|Avs with length of number exceeded|Dado enviado excede o tamanho do campo|
|190|Avs with length of complement exceeded|Dado enviado excede o tamanho do campo|
|191|Avs with length of district exceeded|Dado enviado excede o tamanho do campo|
|192|Avs with zip code invalid|CEP enviado é invalido|
|193|Split Amount must be greater than zero|Valor para realização do SPLIT deve ser superior a 0|
|194|Split Establishment is Required|SPLIT não habilitado para o cadastro da loja|
|195|The PlataformId is required|Validados de plataformas não enviado|
|196|DeliveryAddress is required|Campo obrigatório não enviado|
|197|Street is required|Campo obrigatório não enviado|
|198|Number is required|Campo obrigatório não enviado|
|199|ZipCode is required|Campo obrigatório não enviado|
|200|City is required|Campo obrigatório não enviado|
|201|State is required|Campo obrigatório não enviado|
|202|District is required|Campo obrigatório não enviado|
|203|Cart item Name is required|Campo obrigatório não enviado|
|204|Cart item Quantity is required|Campo obrigatório não enviado|
|205|Cart item type is required|Campo obrigatório não enviado|
|206|Cart item name length exceeded |Dado enviado excede o tamanho do campo|
|207|Cart item description length exceeded |Dado enviado excede o tamanho do campo|
|208|Cart item sku length exceeded |Dado enviado excede o tamanho do campo|
|209|Shipping addressee sku length exceeded |Dado enviado excede o tamanho do campo|
|210|Shipping data cannot be null|Campo obrigatório não enviado|
|211|WalletKey is invalid|Dados da Visa Checkout invalidos|
|212|Merchant Wallet Configuration not found|Visa Checkout não vinculado a conta do lojista|
|213|Credit Card Number is invalid|Cartão de crédito enviado é invalido|
|214|Credit Card Holder Must Have Only Letters|Portador do cartão não deve conter caracteres especiais|
|215|Agency is required in Boleto Credential|Campo obrigatório não enviado|
|216|Customer IP address is invalid|IP bloqueado por questões de segurança|
|300|MerchantId was not found|---|
|301|Request IP is not allowed|---|
|302|Sent MerchantOrderId is duplicated|---|
|303|Sent OrderId does not exist|---|
|304|Customer Identity is required|---|
|306|Merchant is blocked|---|
|307|Transaction not found|Transação não encontrada ou não existente no ambiente|
|308|Transaction not available to capture|Transação não pode ser capturada - Entre em contato com o suporte Braspag|
|309|Transaction not available to void|Transação não pode ser Cancelada - Entre em contato com o suporte Braspag|
|310|Payment method doest not support this operation|Comando enviado não suportado pelo meio de pagamento|
|311|Refund is not enabled for this merchant|Cancelamento após 24 horas não liberado para o lojista|
|312|Transaction not available to refund|Transação não permite cancelamento após 24 horas|
|313|Recurrent Payment not found|Transação recorrente não encontrada ou não disponivel no ambiente|
|314|Invalid Integration|---|
|315|Cannot change NextRecurrency with pending payment|---|
|316|Cannot set NextRecurrency to past date|Não é permitido alterada dada da recorrencia para uma data passada|
|317|Invalid Recurrency Day|---|
|318|No transaction found|---|
|319|Smart recurrency is not enabled|Recorrencia não vinculada ao cadastro do lojista|
|320|Can not Update Affiliation Because this Recurrency not Affiliation saved|---|
|321|Can not set EndDate to before next recurrency|---|
|322|Zero Dollar Auth is not enabled|Zero Dollar não vinculado ao cadastro do lojista|
|323|Bin Query is not enabled|Consulta de Bins não vinculada ao cadastro do lojista|

## Cartões para Teste (Simulado)

O Simulado é um meio de pagamento que emula a utilizaçao de pagamentos com Cartão de Crétido. Com esse meio de pagamento é possivel simular todos os fluxos de Autorização, Captura e Cancelamento.

Para melhor utilização do Meio de Pagamento Simulado, estamos disponibilizando cartões de testes na tabela abaixo.

Os status das transações serão conforme a utilização de cada cartão.

|Status da Transação|Cartões para realização dos testes|Código de Retorno|Mensagem de Retorno|
|-------------------|----------------------------------|-----------------|-------------------|
|Autorizado|0000.0000.0000.0001 / 0000.0000.0000.0004|4|Operação realizada com sucesso|
|Não Autorizado|0000.0000.0000.0002|2|Não Autorizada|
|Autorização Aleatória|0000.0000.0000.0009|4 / 99|Operation Successful / Time Out|
|Não Autorizado|0000.0000.0000.0007|77|Cartão Cancelado|
|Não Autorizado|0000.0000.0000.0008|70|Problemas com o Cartão de Crédito|
|Não Autorizado|0000.0000.0000.0005|78|Cartão Bloqueado|
|Não Autorizado|0000.0000.0000.0003|57|Cartão Expirado|
|Não Autorizado|0000.0000.0000.0006|99|Time Out|

As informações de Cód.Segurança (CVV) e validade podem ser aleatórias, mantendo o formato - CVV (3 dígitos) Validade (MM/YYYY).
