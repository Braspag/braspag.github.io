---
layout: manual
title: Manual de integração API Rest
description: Integração técnica Gateway Braspag
search: true
translated: true
categories: manual
tags:
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

É possível verificar se uma transação possui risco de ser uma fraude ou não durante uma autorização.

|Tipo de Integração|Descrição|Parâmetros necessários|
|-|-|-|
|Análise antes da autorização|Antes da transação ser enviada para a autorização, o Antifraude avalia se ela tem alto risco ou não. Dessa forma, evita-se o envio de transações arriscadas para autorização|`FraudAnalysis.Sequence` igual a _AnalyseFirst_|
|Análise após a autorização|Antes da transação ser enviada para o Antifraude, a mesma será enviada para a autorização|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_|
|Análise de risco somente se a transação for autorizada|O Antifraude será acionado apenas para analisar transações com o staus _autorizada_. Dessa forma evita-se o custo com análises de transações que não seriam autorizadas|`FraudAnalysis.SequenceCriteria` igual a _OnSuccess_|
|Análise de risco em qualquer hipótese|Independente do status da transação após a autorização, o Antifraude analisará o risco|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_ e `FraudAnalysis.SequenceCriteria` como _Always_|
|Autorização em qualquer hipótese|Independente do score de fraude da transação, ela sempre será enviada para a autorização|`FraudAnalysis.Sequence` como _AnalyseFirst_ e `FraudAnalysis.SequenceCriteria` como _Always_|
|Capturar apenas se uma transação for segura|Após a análise de fraude, captura automaticamente uma transação já autorizada se definido baixo risco. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Braspag receber a notificação do novo status e for igual a aceita, a transação será capturada automaticamente|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_, `FraudAnalysis.CaptureOnLowRisk` igual a _true_ e `Payment.Capture` igual a _false_| |
|Cancelar uma transação comprometida|Caso a análise de fraude retorne um alto risco para uma transação já autorizada ou capturada, ela será imediamente cancelada ou estornada. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Braspag receber a notificação do novo status e for igual a rejeitada, a transação será cancelada ou estornada automaticamente|`FraudAnalysis.Sequence` como _AuthorizeFirst_ e `FraudAnalysis.VoidOnHighRisk` igual a _true_|

Se não for especificado o contrário durante a autorização, A Braspag processará sua transação pelo fluxo `FraudAnalysis.Sequence` _AuthorizeFirst_, `FraudAnalysis.SequenceCriteria` _OnSuccess_, `FraudAnalysis.VoidOnHighRisk` _false_ e `FraudAnalysis.CaptureOnLowRisk` _false_.

## Criando uma transação com Análise de Fraude Cybersource

Para que a análise de fraude via Cybersource seja efetuada durante uma transação de cartão de crédito, é necessário complementar o contrato de autorização com os nós "FraudAnalysis", "Cart", "MerchantDefinedFields" e "Travel (somente para venda de passagens aéreas)".

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
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
         "SaveCard":"false"
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
      ],
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
                  "Name":"ItemTeste1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
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
               "Id":2,
               "Value":"100"
            },
            {  
               "Id":4,
               "Value":"Web"
            },
            {  
               "Id":9,
               "Value":"SIM"
            }
         ],
         "Shipping":{  
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
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
                  "Phone":"5564991681074",
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
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
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
         "SaveCard":"false"
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
      ],
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
                  "Name":"ItemTeste1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
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
               "Id":2,
               "Value":"100"
            },
            {  
               "Id":4,
               "Value":"Web"
            },
            {  
               "Id":9,
               "Value":"SIM"
            }
         ],
         "Shipping":{  
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
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
                  "Phone":"5564991681074",
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
|`MerchantId`|Guid|36|Sim|Identificador da loja na Braspag|
|`MerchantKey`|Texto|40|Sim|Chave pública para autenticação dupla na Braspag|
|`RequestId`|Guid|36|Não|Identificador do request definido pela loja|
|`MerchantOrderId`|Texto|50|Sim|Número do pedido da loja|
|`Customer.Name`|Texto|120|Sim|Nome completo do comprador|
|`Customer.Identity`|Texto|16|Sim|Número do documento de identificação do comprador| 
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador <br/> Possíveis valores: CPF ou CNPJ|
|`Customer.Email`|Texto|100|Sim|E-mail do comprador|
|`Customer.Birthdate`|Date|10|Sim|Data de nascimento do comprador <br/> Ex.: 1991-01-10|
|`Customer.Phone`|Texto|15|Sim|Número do telefone do comprador <br/> Ex.: 5521976781114|
|`Customer.Address.Street`|Texto|54|Sim|Logradouro do endereço de cobrança|
|`Customer.Address.Number`|Texto|5|Sim|Número do endereço de cobrança|
|`Customer.Address.Complement`|Texto|14|Não|Complemento do endereço de cobrança|
|`Customer.Address.ZipCode`|Texto|9|Sim|Código postal do endereço de cobrança|
|`Customer.Address.City`|Texto|50|Sim|Cidade do endereço de cobrança|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço de cobrança|
|`Customer.Address.Country`|Texto|2|Sim|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Customer.Address.District`|Texto|45|Sim|Bairro do endereço de cobrança|
|`Customer.DeliveryAddress.Street`|Texto|54|Não|Logradouro do endereço de entrega|
|`Customer.DeliveryAddress.Number`|Texto|5|Não|Número do endereço de entrega|
|`Customer.DeliveryAddress.Complement`|Texto|14|Não|Complemento do endereço de entrega|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não|Código postal do endereço de entrega|
|`Customer.DeliveryAddress.City`|Texto|50|Não|Cidade do endereço de entrega|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega|
|`Customer.DeliveryAddress.Country`|Texto|2|Não|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Customer.DeliveryAddress.District`|Texto|45|Não|Bairro do endereço de entrega|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora da autorização|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de magamento. <br/> Obs.: Somente o tipo _CreditCard_ funciona com análise de fraude|
|`Payment.Amount`|Número|15|Sim|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|
|`Payment.ServiceTaxAmount`|Número|15|Não|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço <br/> Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Currency`|Texto|3|Não|Moeda na qual o pagamento será feito <br/> Possíveis valores: BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|Texto|3|Não|País na qual o pagamento será realizado|
|`Payment.Installments`|Número|2|Sim|Número de parcelas|
|`Payment.Interest`|Texto|10|Não|Tipo de parcelamento <br/> Possíveis valores: ByMerchant / ByIssuer|
|`Payment.Capture`|Booleano|---|Não|Indica se a autorização deverá ser com captura automática <br/> Possíveis valores: true / false (default) <br/> Obs.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade <br/> Obs2.: Este campo deverá ser preenchido de acordo com o fluxo da análise de fraude|
|`Payment.Authenticate`|Booleano|---|Não|Indica se a transação deve ser autenticada <br/> Possíveis valores: true / false (default) <br/> Obs.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.Recurrent`|Booleano|---|Não|Indica se a transação é do tipo recorrente <br/> Possíveis valores: true / false (default) <br/> Obs.: Este campo igual a _true_ não irá criar uma recorrência, apenas permitirá a realização de uma transação sem a necessidade de envio do CVV e servindo de indicação para a adquirente que é a cobrança de uma transação de uma recorrência <br/> Obs2.: Somente para transações Cielo <br/> Obs3.: O campo `Payment.Authenticate` deve ser igual a _false_ quando este for igual a _true_|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador <br/> Obs.: O valor deste campo tem que ser claro e fácil de identificar pelo portador o estabelecimento onde foi realizada a compra, pois é um dos principais ofensores para chargeback|
|`Payment.DoSplit`|Booleano|---|Não|Indica se a transação será dividida entre vários participantes <br/> Possíveis valores: true / false (default) <br/> Para utilizar a funcionalidade de split de pagamentos, é necessário a contratação da solução junto a Braspag|
|`Payment.ExtraDataCollection.Name`|Texto|50|Não|Identificador do campo extra que será enviado|
|`Payment.ExtraDataCollection.Value`|Texto|1024|Não|Valor do campo extra que será enviado|
|`Payment.Credentials.Code`|Texto|100|Sim|Afiliação gerada pela adquirente|
|`Payment.Credentials.Key`|Texto|100|Sim|Chave de afiliação/token gerado pela adquirente|
|`Payment.Credentials.Username`|Texto|50|Não|Usuário gerado no credenciamento com a adquirente GetnNet <br/> Obs.: O campo deve ser obrigatoriamente enviado se a transação é direcionada para GetNet|
|`Payment.Credentials.Password`|Texto|50|Não|Senha gerada no credenciamento com a adquirente GetnNet <br/> Obs.: O campo deve ser obrigatoriamente enviado se a transação é direcionada para GetNet|
|`Payment.Credentials.Signature`|Texto|3|Não|ID do terminal no credenciamento com a adquirente Global Payments <br/> Obs.: O campo deve ser obrigatoriamente enviado se a transação é direcionada para Global Payments|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão de crédito|
|`Payment.CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão de crédito|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão de crédito|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança no verso do cartão de crédito|
|`Payment.CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão de crédito|
|`Payment.CreditCard.SaveCard`|Booleano|---|Não|Indica se os dados do cartão de crédito serão armazenados no Cartão Protegido|
|`Payment.CreditCard.Alias`|Texto|64|Não|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|
|`Payment.FraudAnalysis.Sequence`|Texto|14|Sim|Tipo de fluxo da análise de fraude <br/> Possíveis valores: AnalyseFirst / AuthorizeFirst|
|`Payment.FraudAnalysis.SequenceCriteria`|Texto|9|Sim|Critério do fluxo da análise de fraude <br/> Possíveis valores: OnSuccess / Always|
|`Payment.FraudAnalysis.Provider`|Texto|10|Sim|Provedor de antifraude <br/> Possíveis valores: Cybersource|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será capturada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de baixo risco (Accept) a transação anteriormente autorizada será capturada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será capturada após a Braspag receber a notificação da alteração de status e esta for baixo risco (Accept) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será cancelada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de alto risco (Reject) a transação anteriormente autorizada será cancelada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será cancelada após a Braspag receber a notificação da alteração de status e esta for alto risco (Reject) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.TotalOrderAmount`|Número|15|Sim|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|
|`Payment.FraudAnalysis.FingerPrintId`|Texto|100|Sim|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas|
|`Payment.FraudAnalysis.Browser.HostName`|Texto|60|Não|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Booleano|---|Sim|Identifica se o browser do comprador aceita cookies <br/> Possíveis valores: true / false (default)|
|`Payment.FraudAnalysis.Browser.Email`|Texto|100|Não|E-mail registrado no browser do comprador. Pode diferenciar do e-mail de cadastro na loja(`Customer.Email`)|
|`Payment.FraudAnalysis.Browser.Type`|Texto|40|Não|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP <br/> Ex.: Google Chrome, Mozilla Firefox, Safari, etc|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|45|Sim|Endereço de IP do comprador. Formato IPv4 ou IPv6|
|`Payment.FraudAnalysis.Cart.IsGift`|Booleano|---|Não|Indica se o pedido realizado pelo comprador é para presente|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Booleano|---|Não|Indica se o pedido realizado pelo comprador pode ser devolvido a loja <br/> Possíveis valores: true / false (default)|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Texto|9|Não|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países <br/> [Lista de Valores - Payment.Fraudanalysis.Cart.Items{n}.GiftCategory]({{ site.baseurl_root }}manual/antifraude#tabela-8-cartitem[n].addressriskverify)|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Texto|6|Não|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude <br/> [Lista de Valores - Payment.Fraudanalysis.Cart.Items{n}.HostHedge]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].hosthedge)|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Texto|6|Não|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude <br/> [Lista de Valores - Cart.Items{n}.NonSensicalHedge]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].nonsensicalhedge)|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Texto|6|Não|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude <br/> [Lista de Valores - Payment.Fraudanalysis.Cart.Items{n}.ObscenitiesHedge]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].obscenitieshedge)|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Texto|6|Não|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude <br/> [Lista de Valores - Payment.Fraudanalysis.Cart.Items{n}.PhoneHedge]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].phonehedge)|
|`Payment.FraudAnalysis.Cart.Items.Name`|Texto|255|Sim|Nome do Produto|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Número|15|Sim|Quantidade do produto|
|`Payment.FraudAnalysis.Cart.Items.Sku`|Texto|255|Sim|SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Número|15|Sim|Preço unitário do produto <br/> Ex: 10950 = r$ 109,50|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Texto|6|Não|Nível de risco do produto associado a quantidade de chargebacks <br/> [Lista de Valores - Payment.Fraudanalysis.CartI.tems{n}.Risk]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].risk)|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Texto|6|Não|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido <br/> [Lista de Valores - Payment.Fraudanalysis.Cart.Items{n}.TimeHedge]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].timehedge)|
|`Payment.FraudAnalysis.Cart.Items.Type`|Texto|19|Não|Categoria do produto <br/> [Lista de Valores - Payment.Fraudanalysis.Cart.Items{n}.Type]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].type)|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Texto|6|Não|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores <br/> [Lista de Valores - Payment.Fraudanalysis.Cart.Items{n}.VelocityHedge]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].velocityhedge)|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Número|2|Sim|ID das informações adicionais a serem enviadas <br/> [Tabela de MDDs]({{ site.baseurl_root }}manual/braspag-pagador#tabela-de-mdds)|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Texto|255|Sim|Valor das informações adicionais a serem enviadas <br/> [Tabela de MDDs]({{ site.baseurl_root }}manual/braspag-pagador#tabela-de-mdds)|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|120|Não|Nome completo do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Shipping.Method`|Texto|8|Não|Meio de entrega do pedido <br/> [Lista de Valores - Payment.Fraudanalysis.ShippingMethod.Shipping]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.shipping.shippingmethod)|
|`Payment.FraudAnalysis.Shipping.Phone`|Texto|15|Não|Número do telefone do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114700|
|`Payment.FraudAnalysis.Travel.JourneyType`|Texto|32|Não|Tipo de viagem <br/> [Lista de Valores - Payment.FraudAnalysis.Travel.JourneyType]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.journeytype)|
|`Payment.FraudAnalysis.Travel.DepartureDateTime`|DateTime|---|Não|Data e hora de partida <br/> Ex.: 2018-03-31 19:16:38|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Texto|120|Não|Nome completo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Texto|32|Não|Número do documento do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Texto|15|Não|Classificação da empresa aérea <br/> [Lista de Valores - Payment.FraudAnalysis.Travel.Passengers{n}.Status]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].status)|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Texto|13|Não|Tipo do passageiro <br/> [Lista de Valores - Payment.FraudAnalysis.Travel.Passengers{n}.PassengerType]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].rating)|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Texto|255|Não|E-mail do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Texto|15|Não|Telefone do passageiro <br/> Ex.: 552121114700|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Texto|3|Não|Código do aeroporto de partida. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Texto|3|Não|Código do aeroporto de chegada. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm)|

> Os campos do nó `FraudAnalysis.Travel` se tornam obrigatórios caso o segmento do seu negócio seja aéreas.

### Resposta

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114"
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
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
         "SaveCard":"false"
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
      ],
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
                  "Name":"ItemTeste1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
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
               "Id":2,
               "Value":"100"
            },
            {  
               "Id":4,
               "Value":"Web"
            },
            {  
               "Id":9,
               "Value":"SIM"
            }
         ],
         "Shipping":{  
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
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
                  "Phone":"5564991681074",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
        },
        "Id":"0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
        "Status":1,
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
      },
      "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
      "ProofOfSale": "20170510053219433",
      "AcquirerTransactionId": "0510053219433",
      "AuthorizationCode": "936403",
      "ReceivedDate": "2017-05-10 17:32:19",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 17:32:19",
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
      }]
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017051002",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114"
      "Address":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
         "District":"Alphaville"
      },
      "DeliveryAddress":{  
         "Street":"Alameda Xingu",
         "Number":"512",
         "Complement":"27 andar",
         "ZipCode":"12345987",
         "City":"São Paulo",
         "State":"SP",
         "Country":"BR",
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
         "SaveCard":"false"
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
      ],
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
                  "Name":"ItemTeste1",
                  "Quantity":1,
                  "Sku":"20170511",
                  "UnitPrice":10000,
                  "Risk":"High",
                  "TimeHedge":"Normal",
                  "Type":"AdultContent",
                  "VelocityHedge":"High"
               },
               {  
                  "GiftCategory":"Undefined",
                  "HostHedge":"Off",
                  "NonSensicalHedge":"Off",
                  "ObscenitiesHedge":"Off",
                  "PhoneHedge":"Off",
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
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
               "Id":2,
               "Value":"100"
            },
            {  
               "Id":4,
               "Value":"Web"
            },
            {  
               "Id":9,
               "Value":"SIM"
            }
         ],
         "Shipping":{  
            "Addressee":"João das Couves",
            "Method":"LowCost",
            "Phone":"551121840540"
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
                  "Phone":"5564991681074",
                  "TravelLegs":[  
                     {  
                        "Origin":"AMS",
                        "Destination":"GIG"
                     }
                  ]
               }
            ]
        },
        "Id":"0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
        "Status":1,
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
      },
      "PaymentId": "c374099e-c474-4916-9f5c-f2598fec2925",
      "ProofOfSale": "20170510053219433",
      "AcquirerTransactionId": "0510053219433",
      "AuthorizationCode": "936403",
      "ReceivedDate": "2017-05-10 17:32:19",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 17:32:19",
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
      }]
   }
}
```

|Propriedade|Tipo|Descrição
|:-|:-|:-|
|`MerchantOrderId`|Texto|Número do pedido da loja|
|`Customer.Name`|Texto|Nome completo do comprador|
|`Customer.Identity`|Texto|Número do documento de identificação do comprador| 
|`Customer.IdentityType`|Texto|Tipo de documento de identificação do comprador|
|`Customer.Email`|Texto|E-mail do comprador|
|`Customer.Birthdate`|Date|Data de nascimento do comprador|
|`Customer.Phone`|Texto|Número do telefone do comprador|
|`Customer.Address.Street`|Texto|Logradouro do endereço de cobrança|
|`Customer.Address.Number`|Texto|Número do endereço de cobrança|
|`Customer.Address.Complement`|Texto|Complemento do endereço de cobrança|
|`Customer.Address.ZipCode`|Texto|Código postal do endereço de cobrança|
|`Customer.Address.City`|Texto|Cidade do endereço de cobrança|
|`Customer.Address.State`|Texto|Estado do endereço de cobrança|
|`Customer.Address.Country`|Texto|País do endereço de cobrança|
|`Customer.Address.District`|Texto|Bairro do endereço de cobrança|
|`Customer.DeliveryAddress.Street`|Texto|Logradouro do endereço de entrega|
|`Customer.DeliveryAddress.Number`|Texto|Número do endereço de entrega|
|`Customer.DeliveryAddress.Complement`|Texto|Complemento do endereço de entrega|
|`Customer.DeliveryAddress.ZipCode`|Texto|Código do endereço de entrega|
|`Customer.DeliveryAddress.City`|Texto|Cidade do endereço de entrega|
|`Customer.DeliveryAddress.State`|Texto|Estado do endereço de entrega|
|`Customer.DeliveryAddress.Country`|Texto|País do endereço de entrega|
|`Customer.DeliveryAddress.District`|Texto|Bairro do endereço de entrega|
|`Payment.Provider`|Texto|Nome da provedora da autorização|
|`Payment.Type`|Texto|Tipo do meio de magamento|
|`Payment.Amount`|Número|Valor da transação financeira em centavos|
|`Payment.ServiceTaxAmount`|Número|Montante do valor da autorização que deve ser destinado à taxa de serviço|
|`Payment.Currency`|Texto|Moeda na qual o pagamento será feito|
|`Payment.Country`|Texto|País na qual o pagamento será realizado|
|`Payment.Installments`|Número|Número de parcelas|
|`Payment.Interest`|Texto|Tipo de parcelamento|
|`Payment.Capture`|Booleano|Indica se a autorização deverá ser com captura automática|
|`Payment.Authenticate`|Booleano|Indica se a transação deve ser autenticada|
|`Payment.Recurrent`|Booleano|Indica se a transação é do tipo recorrente|
|`Payment.SoftDescriptor`|Texto|Texto que será impresso na fatura do portador|
|`Payment.DoSplit`|Booleano|Indica se a transação será dividida entre vários participantes|
|`Payment.ExtraDataCollection.Name`|Texto|Identificador do campo extra que será enviado|
|`Payment.ExtraDataCollection.Value`|Texto|Valor do campo extra que será enviado|
|`Payment.Credentials.Code`|Texto|Afiliação gerada pela adquirente|
|`Payment.Credentials.Key`|Texto|Chave de afiliação/token gerado pela adquirente|
|`Payment.Credentials.Username`|Texto|Usuário gerado no credenciamento com a adquirente GetnNet|
|`Payment.Credentials.Password`|Texto|Senha gerada no credenciamento com a adquirente GetnNet|
|`Payment.Credentials.Signature`|Texto|ID do terminal no credenciamento com a adquirente Global Payments|
|`Payment.CreditCard.CardNumber`|Texto|Número do cartão de crédito truncado|
|`Payment.CreditCard.Holder`|Texto|Nome do portador impresso no cartão de crédito|
|`Payment.CreditCard.ExpirationDate`|Texto|Data de validade do cartão de crédito|
|`Payment.CreditCard.SecurityCode`|Texto|Código de segurança no verso do cartão de crédito|
|`Payment.CreditCard.Brand`|Texto|Bandeira do cartão de crédito|
|`Payment.CreditCard.SaveCard`|Booleano|Indica se os dados do cartão de crédito foram armazenados no Cartão Protegido|
|`Payment.CreditCard.Alias`|Texto|Alias (apelido) do cartão de crédito salvo no Cartão Protegido|
|`Payment.CreditCard.CardToken`|Guid|Identificador do cartão de crédito salvo no Cartão Protegido|
|`Payment.FraudAnalysis.Sequence`|Texto|Tipo de fluxo da análise de fraude|
|`Payment.FraudAnalysis.SequenceCriteria`|Texto|Critério do fluxo da análise de fraude|
|`Payment.FraudAnalysis.Provider`|Texto|Provedor de antifraude|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|Indica se a transação após a análise de fraude será capturada|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Booleano|Indica se a transação após a análise de fraude será cancelada|
|`Payment.FraudAnalysis.TotalOrderAmount`|Número|Valor total do pedido em centavos|
|`Payment.FraudAnalysis.FingerPrintId`|Texto|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador|
|`Payment.FraudAnalysis.Browser.HostName`|Texto|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Booleano|Identifica se o browser do comprador aceita cookies|
|`Payment.FraudAnalysis.Browser.Email`|Texto|E-mail registrado no browser do comprador. Pode diferenciar do e-mail de cadastro na loja(`Customer.Email`)|
|`Payment.FraudAnalysis.Browser.Type`|Texto|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|Endereço de IP do comprador. Formato IPv4 ou IPv6|
|`Payment.FraudAnalysis.Cart.IsGift`|Booleano|Indica se o pedido realizado pelo comprador é para presente|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Booleano|Indica se o pedido realizado pelo comprador pode ser devolvido a loja|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Texto|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Texto|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Texto|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Texto|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Texto|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude|
|`Payment.FraudAnalysis.Cart.Items.Name`|Texto|Nome do Produto|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Número|Quantidade do produto|
|`Payment.FraudAnalysis.Cart.Items.Sku`|Texto|SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Número|Preço unitário do produto|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Texto|Nível de risco do produto associado a quantidade de chargebacks|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Texto|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido|
|`Payment.FraudAnalysis.Cart.Items.Type`|Texto|Categoria do produto|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Texto|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Número|ID das informações adicionais a serem enviadas|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Texto|Valor das informações adicionais a serem enviadas|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|Nome completo do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Shipping.Method`|Texto|Meio de entrega do pedido|
|`Payment.FraudAnalysis.Shipping.Phone`|Número|Número do telefone do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Travel.JourneyType`|Texto|Tipo de viagem|
|`Payment.FraudAnalysis.Travel.DepartureDateTime`|DateTime|Data e hora de partida|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Texto|Nome completo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Texto|Número do documento do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Texto|Classificação da empresa aérea|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Texto|Tipo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Texto|E-mail do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Número|Telefone do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Texto|Código do aeroporto de partida|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Texto|Código do aeroporto de chegada|
|`Payment.FraudAnalysis.Id`|Guid|Id da transação no Antifraude Braspag|
|`Payment.FraudAnalysis.Status`|Número|Status da transação no Antifraude Braspag <br/> [Lista de Vaores - Payment.FraudAnalysis.Status]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.status)|
|`Payment.FraudAnalysis.FraudAnalysisReasonCode`|Número|Código de retorno da Cybersouce <br/> [Lista de Valores - Payment.FraudAnalysis.FraudAnalysisReasonCode]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.fraudanalysisreasoncode)|
|`Payment.FraudAnalysis.ReplyData.AddressInfoCode`|Texto|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador <br/> Os códigos são concatenados usando o caracter ^ Ex.: COR-BA^MM-BIN <br/> [Lista de Valores - Payment.FraudAnalysis.ReplyData.AddressInfoCode]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.addressinfocode)|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Texto|Códigos que afetaram a pontuação da análise <br/> Os códigos são concatenados usando o caracter ^. Ex.: B^D^R^Z <br/>[Lista de Valores - ProviderAnalysisResult.AfsReply.FactorCode]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.factorcode)|
|`Payment.FraudAnalysis.ReplyData.Score`|Número|Score da análise de fraude. Valor entre 0 e 100|
|`Payment.FraudAnalysis.ReplyData.BinCountry`|Texto|Código do país do BIN do cartão usado na análise. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui)|
|`Payment.FraudAnalysis.ReplyData.CardIssuer`|Texto|Nome do banco ou entidade emissora do cartão de crédito|
|`Payment.FraudAnalysis.ReplyData.CardScheme`|Texto|Bandeira do cartão|
|`Payment.FraudAnalysis.ReplyData.HostSeverity`|Número|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto|
|`Payment.FraudAnalysis.ReplyData.InternetInfoCode`|Texto|Códigos que indicam problemas com o endereço de e-mail, o endereço IP ou o endereço de cobrança <br/> Os códigos são concatenados usando o caracter ^. Ex.: FREE-EM^RISK-EM <br/> [Lista de Valores - Payment.FraudAnalysis.ReplyData.InternetInfoCode]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.internetinfocode)|
|`Payment.FraudAnalysis.ReplyData.IpRoutingMethod`|Texto|Método de roteamento do comprador obtido a partir do endereço de IP <br/> [Lista de Valores - Payment.FraudAnalysis.ReplyData.IpRoutingMethod]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.iproutingmethod)|
|`Payment.FraudAnalysis.ReplyData.ScoreModelUsed`|Texto|Nome do modelo de score utilizado na análise. Caso não tenha nenhum modelo definido, o modelo padrão da Cybersource foi o utilizado|
|`Payment.FraudAnalysis.ReplyData.CasePriority`|Número|Define o nível de prioridade das regras ou perfis do lojista. O nível de prioridade varia de 1 (maior) a 5 (menor) e o valor padrão é 3, e este será atribuído caso não tenha definido a prioridade das regras ou perfis. Este campo somente será retornado se a loja for assinante do Enhanced Case Management|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Texto|Id da transação na Cybersource| 
|`Payment.PaymentId`|Guid|Identificador da transação no Pagador Braspag|
|`Payment.AcquirerTransactionId`|Texto|Identificador da transação na adquirente|
|`Payment.ProofOfSale`|Texto|Número do comprovante de venda na adquirente (NSU - Número sequencial único da transação)|
|`Payment.AuthorizationCode`|Texto|Código de autorização na adquirente|
|`Payment.ReceivedDate`|Datetime|Data em que a transação foi recebida no Pagador Brapag <br/> Ex.: 2018-01-16 16:38:19|
|`Payment.CapturedDate`|Datetime|Data em que a transação foi capturada na adquirente <br/> Ex.: 2018-01-16 16:38:20|
|`Payment.CapturedAmount`|Número|Valor capturado da transação <br/> Ex.: 123456 = r$ 1.234,56|
|`Payment.ECI`|Texto|Eletronic Commerce Indicator. Código gerado em uma transação de crédito com autenticação externa|
|`Payment.ReasonCode`|Texto|Código de retorno da operação|
|`Payment.ReasonMessage`|Texto|Mensagem de retorno da operação|
|`Payment.Status`|Número|Status da transação no Pagador <br/> [Lista de Status da Transação]({{ site.baseurl_root }}manual/braspag-pagador#lista-de-status-transação)|
|`Payment.ProviderReturnCode`|Texto|Código retornado pela adquirente ou banco|
|`Payment.ProviderReturnMessage`|Texto|Mensagem retornada pela adquirente ou banco|

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

![Exemplo Url](https://braspag.github.io/images/braspag/af/urldfp.png)

<aside class="warning">Certifique-se de copiar todos os dados corretamente e de ter substituído as variáveis corretamente pelos respectivos valores.</aside>

**Configurando seu Servidor Web**

Todos os objetos se referem a h.online-metrix.net, que é o DNS do servidor de fingerprint. Quando você estiver pronto para produção, você deve alterar o nome do servidor para uma URL local, e configurar no seu servidor Web um redirecionamento de URL para h.online-metrix.net.

<aside class="warning">Se você não completar essa seção, você não receberá resultados corretos, e o domínio (URL) do fornecedor de fingerprint ficará visível, sendo mais provável que seu consumidor o bloqueie.</aside>

### Integração em aplicativos mobile

**Baixando o SDK**
Se você ainda não baixou o SDK do iOS ou do Android, deve fazê-lo antes de continuar. Para isso acesse um dos links abaixo de acordo com o desejado.<br/> [Download Deviceprint SDK iOS]({{ site.baseurl_root }}/files/braspag/antifraude/cybersource-iossdk-fingerprint-v5.0.32.zip) <br/> [Download Deviceprint SDK Android]({{ site.baseurl_root }}/files/braspag/antifraude/cybersource-androidsdk-fingerprint-v5.0.96.zip)

# Split de Pagamentos

## Introdução

O **Split de Pagamentos** permite a divisão de uma transação entre diferentes participantes de uma venda.

Muito utilizado em Marketplaces, onde **o carrinho é composto por produtos de diferentes fornecedores e o valor total da venda deve ser dividido entre todos os participantes**.

| **Participantes** | **Descrição** |
|-----------|---------- |
| **Marketplace** | Responsável pelo carrinho (Master). <br> Possui acordos com **Subordinados** que fornecem os produtos presentes no carrinho.<br> Define as taxas a serem descontadas sobre a venda de cada **Subordinado**.<br> Pode participar de uma venda fornecendo seus próprios produtos. |
| **Subordinado** | Fornecedor dos produtos que compõem o carrinho.<br>Recebe parte do valor da venda, descontadas as taxas acordadas com o **Marketplace**.|
| **Braspag (Facilitador)** | Responsável pelo fluxo transacional.<br> Define as taxas a serem descontadas sobre o valor total da venda realizada pelo **Marketplace**.<br> Responsável pela liquidação dos pagamentos para os **Subordinados** e **Marketplace**.|

No Split de Pagamentos o responsável pelo fluxo transacional é a Braspag (facilitador).

O Marketplace se integra à Braspag para transacionar e informa como será dividida a transação entre cada participante, podendo ser no momento de captura ou em um momento posterior, conhecido como Split pós-transacional, desde que seja dentro de um limite de tempo pré-estabelecido.

Com a transação capturada, a Braspag calcula o valor destinado a cada participante e repassa esses valores, no prazo estabelecido de acordo com cada produto (regime de pagamento\*), para cada envolvido na transação.

> **Regime de Pagamento**: Prazo estabelecido para liquidação de acordo com o produto (crédito ou débito) e bandeira.
> <br>
> **Crédito**: Em até 31 dias. <br>
> **Crédito Parcelado**: 1º parcela em até 31 dias, demais a cada 30.<br>
> **Débito**: Em até 2 dias úteis.

Para utilizar o Split de Pagamentos, o Marketplace deverá se cadastrar na Braspag juntamente com seus Subordinados. Após este processo, tanto o Marketplace quanto seus Subordinados possuirão um identificador único, conhecido como **MerchantId (MID)**, que deverá ser utlizado ao informar as regras de divisão de uma transação.

Na divisão de uma transação, devem ser informados:

* Os **identificadores dos Subordinados**.
* Os **valores de participação de cada Subordinado**. O somatório deverá ser igual ao valor total da transação.
* **Taxas** a serem aplicadas sobre o valor de cada Subordinado destinadas ao Marketplace. Estas deverão ser acordadas previamente entre o Marketplace e o Subordinado.

O Marketplace também pode ser um participante da divisão, bastando informar seu identificador, passando o mesmo a ter também o papel de **Subordinado** e ter seus próprios produtos no carrinho.

### Taxas

As taxas acordadas entre os participantes, podendo ser um **MDR(%)** e/ou uma **Taxa Fixa(R$)**, devem ser definidas no momento do cadastro do Marketplace e dos seus Subordinados junto à Braspag (Facilitador).

As mesmas poderão ser enviadas no momento transacional (captura) ou pós-transacional. Caso não sejam enviadas, serão consideradas as taxas cadastradas e acordadas previamente entre o participantes.

> **MDR (*Merchant Discount Rate*):** Percentual a ser descontado do valor de uma transação, definido por produto (Crédito / Débito), Bandeira e Faixa de Parcelamento. <br>
> **Fee:** Taxa fixa. Valor em centavos a ser cobrado por transação capturada.

#### Braspag (Facilitador)

A Braspag acordará um MDR e/ou uma Tarifa Fixa com o Marketplace a serem descontadas do valor total de cada transação.

O Marketplace, de conhecimento destas taxas, negociará também um MDR e/ou uma Tarifa Fixa juntamente com cada Subordinado, embutindo o MDR e/ou Tarifa acordados junto à Braspag (Facilitador).

O desconto da Tarifa Fixa, acordada entre o Marketplace e a Braspag, não é aplicado no valor total da transação, ou seja, a mesma não entra no cálculo da divisão e sim é debitada diretamente do montante que o Marketplace tem para receber junto à Braspag (Facilitador). O MDR entra no cálculo de divisão da transação, já que o mesmo deve estar embutido no MDR acordado entre o Marketplace e seus Subordinados.

> **Custo Marketplace:** MDR Braspag (%) + Tarifa Fixa Braspag (R$)

#### Marketplace

O Marketplace é responsável por acordar as taxas a serem cobradas dos seus Subordinados, onde deve ser defindo um MDR maior ou igual ao MDR definido entre a Braspag (Facilitador) e o Marketplace, e uma Tarifa Fixa, que é opcional.

> **Custo Subordinado:** MDR Marketplace (%) + Tarifa Fixa (R$), onde o MDR Marketplace (%) considera o MDR Braspag (%).

#### Exemplo

Uma transação de **R$100,00**, realizada por um **Marketplace** com participação do **Subordinado 01**.

![SplitSample001](https://developercielo.github.io/images/split/split001.png)

Neste exemplo, foram assumidos os seguintes acordos:

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.  
**Taxa Marketplace**: 3,5% MDR (embutindo os 2% do MDR Braspag) + 0,30 Tarifa Fixa.

Após o split, cada participante terá sua agenda sensibilizada com os seguintes eventos:

**Subordinado**:  
Crédito: R$96,20 [Descontados o MDR e a Tarifa Fixa acordados com o Marketplace]

**Marketplace**:  
Crédito: R$1,80 [MDR aplicado sobre o valor do subordinado descontando o MDR acordado com a Braspag (Facilitador)]
Débito: R$0,10 [Tarifa Fixa acordada com a Braspag (Facilitador)]

**Braspag (Facilitador)**:  
Crédito: R$2,00 [MDR aplicado sobre o valor total da transação]
Crédito: R$0,10 [Tarifa Fixa acordada com o Marketplace]

### Bandeiras

As bandeiras suportadas pelo Split são:

* Visa
* MasterCard 
* Elo
* Amex
* Hipercard
* Diners
* Discover

## Ambientes

É possível dividir uma venda enviada para o Pagador em várias liquidações para contas diferentes através do Split Braspag. Para utilizar o Split, é necessário contratar o serviço com seu executivo comercial.

> Embora não seja necessário integrar-se com a API 3.0 da Cielo, é mandatório uma afiliação à Cielo para transacionar com o Split através do Pagador.

### Sandbox

* **API Split**: https://splitsandbox.braspag.com.br/
* **Braspag OAUTH2 Server**: https://authsandbox.braspag.com.br/

### Produção

* **API Split**: https://split.braspag.com.br/
* **Braspag OAUTH2 Server**: https://auth.braspag.com.br/

## QuickStart

O request de crédito do Split é composto por 4 campos obrigatórios: **MerchantOrderId**, **Customer**, **Payment** e **Payment.FraudAnalysis**.

Abaixo montaremos um request simples. O suficiente para enviarmos a nossa primeira transação, sem nos preocuparmos muito com detalhes. **Esse exemplo é o básico para entendimento e não deve ser utilizado em produção**.

### MerchantOrderId

Esse campo é onde informamos o número do pedido que existe na loja do cliente.

```json
{
    "MerchantOrderId":"201904150001"
}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|**MerchantOrderId**|Texto|50|Sim|Número de identificação do pedido|

### Customer

Esse campo contém os dados do comprador. Possui diversos subcampos que devem ser analisados cuidadosamente.

```json
{
    "Customer":{
        "Name": "João da Silva Accept",
        "Identity":"12345678900",
        "IdentityType":"CPF"
    }
}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`Customer`|-|-|Sim|Dados do comprador|
|`Customer.Name`|Texto|61|Sim|Nome do comprador (No ambiente de Sandbox, o último nome do comprador deverá ser **ACCEPT**. Ex.: "João da Silva Accept")|
|`Customer.Identity`|Texto|18|Sim|Número de documento do comprador|
|`Customer.IdentityType`|Texto|4|Sim|Tipo de documento de identificação do comprador. Ex.: `CPF` ou `CNPJ`|


### Payment

Esse campo possui os elementos da transação, assim como o antifraude (**Payment.FraudAnalysis**), que será explicado separadamente.

Aqui é possível especificar se uma transação será efetuada como crédito ou débito, se utilizará um token de cartão, o número de parcelas e etc.

```json
{
    "Payment":{
        "Provider": "Simulado",
        "Type":"CreditCard",
        "Amount":10000,
        "Capture": true,
        "DoSplit": true,
        "Installments":1,
        "SoftDescriptor":"LojaDoJoao",
        "CreditCard":{
            "CardNumber":"4481530710186111",
            "Holder":"Yamilet Taylor",
            "ExpirationDate":"12/2022",
            "SecurityCode":"693",
            "Brand":"Visa"
        }
    }

}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`Payment`|-|-|Sim|Campos refente ao pagamento e antifraude|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `CreditCard` ou `DebitCard`|
|`Payment.Amount`|Inteiro|15|Sim|Valor do pedido em centavos. Ex.: R$ 1.559,85 = 155985|
|`Payment.Capture`|Boleano|-|Sim|Parâmetro para capturar a transação. Caso o valor seja `False` a transação será apenas autorizada. Se for `True`, a captura será realizada automaticamente após a autorização.|
|`Payment.DoSplit`|Booleano|-|Não (Default false)|Booleano que indica se a transação será dividida entre várias contas (true) ou não (false)|
|`Payment.Installments`|Inteiro|2|Sim|Número de parcelas do pedido|
|`Payment.SoftDescriptor`|Texto|13|Sim|Texto que será impresso na fatura do cartão de crédito do portador|
|`Payment.CreditCard`|-|-|Sim|Nó contendo as informações do cartão|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão do comprador|
|`Payment.CreditCard.Holder`|Texto|50|Sim|Nome do comprador impresso no cartão|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão composta por MM/AAAA|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`Payment.CreditCard.Brand`|Texto|10|Sim|Bandeira do cartão  |Possíveis valores: Visa / Master / Amex / Elo / Aura / JCB / Diners / Discover|

### Payment.FraudAnalysis

Esse campo é referente ao sistema de antifraude. 
O antifraude é obrigatório no Split de Pagamentos. E para esse sistema utilizamos o nosso parceiro [CyberSource](https://www.cybersource.com/) do Grupo [Visa](https://www.visa.com.br/).
A fim de exemplificar uma transação da forma mais simples possível, alguns campos obrigatórios para o ambiente de produção não foram passados.


Mais a frente explicaremos como utilizar o campo **Browser** e **MerchantDefinedFields**.

```json
{
    "Payment":{
        "FraudAnalysis":{
            "Provider":"Cybersource",
            "TotalOrderAmount":10000
        }
    }
}
```


|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`Payment.FraudAnalysis`|-|-|-|Nó contendo as informações para Análise de Fraude|
|`Payment.FraudAnalysis.Provider`|Texto|12|Sim|Identifica o provedor da solução de análise de fraude  |Possíveis valores: `Cybersource`|
|`Payment.FraudAnalysis.TotalOrderAmount`|Inteiro|15|Não|Valor total do pedido em centavos, podendo ser diferente do valor da transação  |Ex.: Valor do pedido sem a taxa de entrega|

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

--header "Authorization: Bearer {access_token}"
--header "Content-Type: application/json"

--body
{
    "MerchantOrderId":"201904150001",
    "Customer":{
        "Name": "João da Silva Accept",
        "Identity":"12345678900",
        "IdentityType":"CPF"
    },
    "Payment":{
        "Provider": "Simulado",
        "Type":"CreditCard",
        "DoSplit": true,
        "Amount":10000,
        "Capture": true,
        "Installments":1,
        "SoftDescriptor":"LojaDoJoao",
        "CreditCard":{
            "CardNumber":"4481530710186111",
            "Holder":"Yamilet Taylor",
            "ExpirationDate":"12/2022",
            "SecurityCode":"693",
            "Brand":"Visa"
        },
        "SplitPayments":[
            {
                "SubordinateMerchantId" :"{{ MerchanId do Subordinado }}",
                "Amount":10000,
                "Fares":{
                    "Mdr":5,
                    "Fee":0
                    }
            }
            ],
        "FraudAnalysis":{
            "Provider":"Cybersource",
            "TotalOrderAmount":10000
        }
    }
}
```

|Campos|Tipo|Tamanho|Obrigatório|Descrição|
|-----|----|-------|-----------|---------|
|`SplitPayments.SubordinateMerchantId`|Guid|36|Sim|Identificador do Seller na Braspag|
|`SplitPayments.Amount`|Número|15|Sim|Total da venda do Seller específico. R$ 100,00 = 10000|
|`SplitPayments.Fares.Mdr`|Decimal|3,2|Não|Taxa aplicada pela loja Master sobre o Seller para desconto|
|`SplitPayments.Fares.Fee`|Número|15|Não|Tarifa aplicada pela loja Master sobre o Seller para desconto|

**Response**

```json
{
    "MerchantOrderId": "201904150001",
    "Customer": {
        "Name": "João da Silva Accept",
        "Identity": "12345678900",
        "IdentityType": "CPF"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2022",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190829030409594",
        "AcquirerTransactionId": "0829030409594",
        "AuthorizationCode": "046879",
        "SoftDescriptor": "LojaDoJoao",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "Id": "b7211f65-87ca-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H",
                "Score": 38,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-HIST",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME",
                "CasePriority": 3,
                "ProviderTransactionId": "5671018489636116404007"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "{{ MerchanId do Subordinado }}",
                "Amount": 10000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 0
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchanId do Subordinado }}",
                        "Amount": 9500
                    },
                    {
                        "MerchantId": "{{ MerchanId do Master }}",
                        "Amount": 500
                    }
                ]
            }
        ],
        "PaymentId": "536b8e54-6d44-4b84-86e2-0d7d01cf4935",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-29 15:04:02",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-29 15:04:09",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/536b8e54-6d44-4b84-86e2-0d7d01cf4935"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/536b8e54-6d44-4b84-86e2-0d7d01cf4935/void"
            }
        ]
    }
}
```

**Esse é apenas um request de exemplo bem básico e não deve ser utilizado em produção. Para facilitar o entendimento, não foi aplicado nenhum campo que fortalece a segurança da transação.**

Nos próximos exemplos explicaremos como aumentar a segurança e manipular os campos da nossa transação entre crédito e débito.

## Integração

### Autorização  

Para submeter uma transação do Pagador ao Split, basta enviar o Parâmetro Payment.DoSplit como true e adicionar o nó Payment.SplitPayments, conforme exemplo:

**Request - Transação de Crédito**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
    "merchantorderid": "23082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
        "payment": {
            "Provider": "Simulado",
            "type": "Creditcard",
            "DoSplit": "True",
            "amount": 10000,
            "capture": true,
            "installments": 1,
            "softdescriptor": "teste",
            "CreditCard": {
                "cardNumber": "4481530710186111",
                "holder": "Yamilet Taylor",
                "ExpirationDate": "12/2019",
                "SecurityCode": "693",
                "Brand": "Visa",
                "SaveCard": "false"
            },
            "fraudanalysis": {
                "provider": "cybersource",
                "Shipping": {
                    "Addressee": "Teste Accept"
                },
                "FingerPrintId": "23082019",
                "browser": {
                    "ipaddress": "179.221.103.151"
                },
                "totalorderamount": 10000,
                "cart": {
                    "isgift": false,
                    "returnsaccepted": true,
                    "items": [
                        {
                            "name": "Produto teste",
                            "quantity": 1,
                            "sku": 563,
                            "unitprice": 100
                        }
                    ]
                },
                "MerchantDefinedFields": [
                    {
                        "Id": 1,
                        "Value": "Guest"
                    },
                    {
                        "Id": 2,
                        "Value": "146"
                    },
                    {
                        "Id": 3,
                        "Value": "1"
                    },
                    {
                        "Id": 4,
                        "Value": "Web"
                    }
                ]
            },
            "splitpayments": [
                {
                    "subordinatemerchantid": "{{ MerchantId do Subordinado 01 }}",
                    "amount": 5000,
                    "fares": {
                        "mdr": 20,
                        "fee": 25
                    }
                },
                {
                    "subordinatemerchantid": "{{ MerchantId do Subordinado 02 }}",
                    "amount": 5000,
                    "fares": {
                        "mdr": 10,
                        "fee": 15
                    }
                }
            ]
        }
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "23082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190829042727956",
        "AcquirerTransactionId": "0829042727956",
        "AuthorizationCode": "164843",
        "SoftDescriptor": "teste",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "23082019",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "1",
                    "Value": "Guest"
                },
                {
                    "Id": "2",
                    "Value": "146"
                },
                {
                    "Id": "3",
                    "Value": "1"
                },
                {
                    "Id": "4",
                    "Value": "Web"
                }
            ],
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": "Undefined",
                        "Name": "Produto teste",
                        "Risk": "Undefined",
                        "Sku": "563",
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": "Undefined",
                        "NonSensicalHedge": "Undefined",
                        "ObscenitiesHedge": "Undefined",
                        "PhoneHedge": "Undefined",
                        "TimeHedge": "Undefined",
                        "VelocityHedge": "Undefined",
                        "GiftCategory": "Undefined",
                        "OriginalPrice": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151"
            },
            "Shipping": {
                "Addressee": "Teste Accept",
                "Method": "Undefined"
            },
            "Id": "8ec21c08-93ca-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H^P",
                "Score": 43,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST",
                "InternetInfoCode": "INTL-IPCO^RISK-EM",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME^VELL-FP^VELL-TIP^VELS-CC^VELS-EM",
                "CasePriority": 3,
                "FingerPrint": {
                    "CookiesEnabledField": "true",
                    "FlashEnabledField": "false",
                    "HashField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "ImagesEnabledField": "true",
                    "JavascriptEnabledField": "true",
                    "TrueIpAddressField": "200.142.125.158",
                    "TrueIpAddressCityField": "rio de janeiro",
                    "TrueIpAddressCountryField": "BR",
                    "SmartIdField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "SmartIdConfidenceLevelField": "100.00",
                    "ScreenResolutionField": "1920x1080",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5671068469196615904011"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 20.0,
                    "Fee": 25
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                        "Amount": 3975
                    },
                    {
                        "MerchantId": "{{ MerchantId do Master }}",
                        "Amount": 1025
                    }
                ]
            },
            {
                "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 10.0,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                        "Amount": 4485
                    },
                    {
                        "MerchantId": "{{ MerchantId do Master }}",
                        "Amount": 515
                    }
                ]
            }
        ],
        "PaymentId": "4437f73c-8c13-46ea-937f-494dc878109d",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-29 16:27:18",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-29 16:27:27",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/4437f73c-8c13-46ea-937f-494dc878109d"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/4437f73c-8c13-46ea-937f-494dc878109d/void"
            }
        ]
    }
}
```

Ao informar um tipo de pagamento referente ao Split, a API do Pagador automaticamente identifica que a transação é referente ao Split de Pagamentos e realiza o fluxo transacional através da Braspag (Facilitador).

Caso a transação enviada seja marcada para captura automática, o nó contendo as regras de divisão deverá ser enviado, caso contrário a transação será dividida entre a Braspag (Facilitador) e o Marketplace. Posteriormente é permitido que o Marketplace envie novas regras de divisão para a transação através da API Split, desde que esteja dentro do período de tempo permitido.

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`MerchantOrderId`|Texto|50|Sim|Numero de identificação do Pedido|
|`Customer.Email`|Texto|255|Não|Email do comprador|
|`Customer.Name`|Texto|255|Sim|Nome do comprador|
|`Customer.Identity`|Texto |14 |Não|Número do RG, CPF ou CNPJ do Cliente| 
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador (CPF ou CNPJ)|
|`Customer.Mobile`|Texto|14|Não*|Celular do comprador|
|`Customer.Phone`|Texto|14|Não*|Telefone do comprador|
|`Customer.DeliveryAddress.Street`|Texto|255|Não*|Endereço do comprador|
|`Customer.DeliveryAddress.Number`|Texto|15|Não*|Número do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Complement`|Texto|50|Não*|Complemento do endereço de entrega do pedido|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não*|CEP do endereço de entrega do pedido|
|`Customer.DeliveryAddress.City`|Texto|50|Não*|Cidade do endereço de entrega do pedido|
|`Customer.DeliveryAddress.State`|Texto|2|Não*|Estado do endereço de entrega do pedido|
|`Customer.DeliveryAddress.Country`|Texto|35|Não*|Pais do endereço de entrega do pedido|
|`Customer.DeliveryAddress.District`|Texto |50|Não*|Bairro do Comprador. |
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `CreditCard` ou `DebitCard`|
|`Payment.Amount`|Número|15|Sim|Valor do Pedido (ser enviado em centavos)|
|`Payment.Installments`|Número|2|Sim|Número de Parcelas|
|`Payment.Capture`|Booleano|---|Não (Default false)|Booleano que indica se a autorização deve ser com captura automática (true) ou não (false). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador|
|`CreditCard.CardNumber`|Texto|16|Sim|Número do Cartão do comprador|
|`CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão|
|`CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade impresso no cartão|
|`CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão|
|`CreditCard.SaveCard`|Booleano|---|Não (Default false)|Booleano que identifica se o cartão será salvo para gerar o token (CardToken)|

**Exemplo 1)**  

Transação no valor de **R$100,00**, com captura automática, sem o nó contendo as regras de divisão.

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.

**Request**

```json
{
    "merchantorderid": "30082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
    "payment": {
        "Provider": "Simulado",
        "type": "Creditcard",
        "DoSplit": "True",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "CreditCard": {
            "cardNumber": "4481530710186111",
            "holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "fraudanalysis": {
            "provider": "cybersource",
            "Shipping": {
                "Addressee": "Teste Accept"
            },
            "FingerPrintId": "30082019",
            "browser": {
                "ipaddress": "179.221.103.151"
            },
            "totalorderamount": 10000,
            "cart": {
                "isgift": false,
                "returnsaccepted": true,
                "items": [
                    {
                        "name": "Produto teste",
                        "quantity": 1,
                        "sku": 563,
                        "unitprice": 100
                    }
                ]
            },
            "MerchantDefinedFields": [
                {
                    "Id": 1,
                    "Value": "Guest"
                },
                {
                    "Id": 2,
                    "Value": "146"
                },
                {
                    "Id": 3,
                    "Value": "1"
                },
                {
                    "Id": 4,
                    "Value": "Web"
                }
            ]
        }
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "30082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190830104433081",
        "AcquirerTransactionId": "0830104433081",
        "AuthorizationCode": "042693",
        "SoftDescriptor": "teste",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "30082019",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "1",
                    "Value": "Guest"
                },
                {
                    "Id": "2",
                    "Value": "146"
                },
                {
                    "Id": "3",
                    "Value": "1"
                },
                {
                    "Id": "4",
                    "Value": "Web"
                }
            ],
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": "Undefined",
                        "Name": "Produto teste",
                        "Risk": "Undefined",
                        "Sku": "563",
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": "Undefined",
                        "NonSensicalHedge": "Undefined",
                        "ObscenitiesHedge": "Undefined",
                        "PhoneHedge": "Undefined",
                        "TimeHedge": "Undefined",
                        "VelocityHedge": "Undefined",
                        "GiftCategory": "Undefined",
                        "OriginalPrice": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151"
            },
            "Shipping": {
                "Addressee": "Teste Accept",
                "Method": "Undefined"
            },
            "Id": "b6f7f24a-2ccb-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H^P",
                "Score": 42,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST",
                "InternetInfoCode": "INTL-IPCO^RISK-EM",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME^VELL-FP^VELL-TIP",
                "CasePriority": 3,
                "FingerPrint": {
                    "CookiesEnabledField": "true",
                    "FlashEnabledField": "false",
                    "HashField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "ImagesEnabledField": "true",
                    "JavascriptEnabledField": "true",
                    "TrueIpAddressField": "200.142.125.158",
                    "TrueIpAddressCityField": "rio de janeiro",
                    "TrueIpAddressCountryField": "BR",
                    "SmartIdField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "SmartIdConfidenceLevelField": "100.00",
                    "ScreenResolutionField": "1920x1080",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5671726720836914704008"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "{{ MerchantId do Master }}",
                "Amount": 10000,
                "Fares": {
                    "Mdr": 2.00,
                    "Fee": 10
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchantId do Master }}",
                        "Amount": 10000
                    }
                ]
            }
        ],
        "PaymentId": "5b01552e-bf38-430e-bd38-8517c36a1ca2",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-30 10:44:13",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-30 10:44:33",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/5b01552e-bf38-430e-bd38-8517c36a1ca2"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/5b01552e-bf38-430e-bd38-8517c36a1ca2/void"
            }
        ]
    }
}
```

Neste caso, o Marketplace recebe o valor da transação descontado o MDR acordado com a Braspag (Facilitador). Como apresentado anteriormente, a Tarifa Fixa acordada entre o Marketplace e a Braspag é sensibilizada diretamente na agenda de ambas as partes.

![SplitSample002](https://developercielo.github.io/images/split/split002.png)

**Exemplo 2)**  

Transação no valor de **R$100,00** com o nó contendo as regras de divisão.

**Taxa Braspag**: 2% MDR + R$0,10 Tarifa Fixa.  
**Taxa Marketplace com o Subordinado 01**: 5% MDR (embutindo os 2% do MDR Braspag) + 0,30 Tarifa Fixa.  
**Taxa Marketplace com o Subordinado 02**: 4% MDR (embutindo os 2% do MDR Braspag) + 0,15 Tarifa Fixa.  

**Request**

```json
{
    "merchantorderid": "30082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
    "payment": {
        "Provider": "Simulado",
        "type": "Creditcard",
        "DoSplit": "True",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "CreditCard": {
            "cardNumber": "4481530710186111",
            "holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "fraudanalysis": {
            "provider": "cybersource",
            "Shipping": {
                "Addressee": "Teste Accept"
            },
            "FingerPrintId": "30082019",
            "browser": {
                "ipaddress": "179.221.103.151"
            },
            "totalorderamount": 10000,
            "cart": {
                "isgift": false,
                "returnsaccepted": true,
                "items": [
                    {
                        "name": "Produto teste",
                        "quantity": 1,
                        "sku": 563,
                        "unitprice": 100
                    }
                ]
            },
            "MerchantDefinedFields": [
                {
                    "Id": 1,
                    "Value": "Guest"
                },
                {
                    "Id": 2,
                    "Value": "146"
                },
                {
                    "Id": 3,
                    "Value": "1"
                },
                {
                    "Id": 4,
                    "Value": "Web"
                }
            ]
        },
        "splitpayments": [
            {
                "subordinatemerchantid": "{{ MerchantId do Subordinado 01 }}",
                "amount": 5000,
                "fares": {
                    "mdr": 5,
                    "fee": 30
                }
            },
            {
                "subordinatemerchantid": "{{ MerchantId do Subordinado 01 }}",
                "amount": 5000,
                "fares": {
                    "mdr": 4,
                    "fee": 15
                }
            }
        ]
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "30082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "ProofOfSale": "20190830104950554",
        "AcquirerTransactionId": "0830104950554",
        "AuthorizationCode": "149867",
        "SoftDescriptor": "teste",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "30082019",
            "Provider": "Cybersource",
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "1",
                    "Value": "Guest"
                },
                {
                    "Id": "2",
                    "Value": "146"
                },
                {
                    "Id": "3",
                    "Value": "1"
                },
                {
                    "Id": "4",
                    "Value": "Web"
                }
            ],
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": "Undefined",
                        "Name": "Produto teste",
                        "Risk": "Undefined",
                        "Sku": "563",
                        "UnitPrice": 100,
                        "Quantity": 1,
                        "HostHedge": "Undefined",
                        "NonSensicalHedge": "Undefined",
                        "ObscenitiesHedge": "Undefined",
                        "PhoneHedge": "Undefined",
                        "TimeHedge": "Undefined",
                        "VelocityHedge": "Undefined",
                        "GiftCategory": "Undefined",
                        "OriginalPrice": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": false,
                "IpAddress": "179.221.103.151"
            },
            "Shipping": {
                "Addressee": "Teste Accept",
                "Method": "Undefined"
            },
            "Id": "93324008-2dcb-e911-a40a-0003ff21cf74",
            "Status": 1,
            "StatusDescription": "Accept",
            "FraudAnalysisReasonCode": 100,
            "ReplyData": {
                "FactorCode": "F^H^P",
                "Score": 49,
                "HostSeverity": 1,
                "HotListInfoCode": "NEG-AFCB^NEG-CC^NEG-EM^NEG-HIST",
                "InternetInfoCode": "INTL-IPCO^RISK-EM",
                "IpCity": "goiania",
                "IpCountry": "br",
                "IpRoutingMethod": "fixed",
                "IpState": "goias",
                "ScoreModelUsed": "default",
                "VelocityInfoCode": "VEL-NAME^VELI-FP^VELI-TIP^VELL-FP^VELL-TIP^VELS-FP^VELS-TIP",
                "CasePriority": 3,
                "FingerPrint": {
                    "CookiesEnabledField": "true",
                    "FlashEnabledField": "false",
                    "HashField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "ImagesEnabledField": "true",
                    "JavascriptEnabledField": "true",
                    "TrueIpAddressField": "200.142.125.158",
                    "TrueIpAddressCityField": "rio de janeiro",
                    "TrueIpAddressCountryField": "BR",
                    "SmartIdField": "d04c4463c5e84fb5ba1993a0482a6c24",
                    "SmartIdConfidenceLevelField": "100.00",
                    "ScreenResolutionField": "1920x1080",
                    "BrowserLanguageField": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                "ProviderTransactionId": "5671729896416618104007"
            }
        },
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                        "Amount": 4720
                    },
                    {
                        "MerchantId": "{{ MerchantId do Master }}",
                        "Amount": 280
                    }
                ]
            },
            {
                "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 4.0,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                        "Amount": 4785
                    },
                    {
                        "MerchantId": "{{ MerchantId do Master }}",
                        "Amount": 215
                    }
                ]
            }
        ],
        "PaymentId": "f1333ea6-8cb9-420f-9674-d66031903080",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-30 10:49:40",
        "CapturedAmount": 10000,
        "CapturedDate": "2019-08-30 10:49:50",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 2,
        "ProviderReturnCode": "6",
        "ProviderReturnMessage": "Operation Successful",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/f1333ea6-8cb9-420f-9674-d66031903080"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/f1333ea6-8cb9-420f-9674-d66031903080/void"
            }
        ]
    }
}
```

Abaixo, como ficaram as divisões e como foram sensibilizadas as agendas de cada participante.

![SplitSample003](https://developercielo.github.io/images/split/split003.png)



**Request - Transação de Débito**

Uma transação com um Cartão de Débito se efetua de uma forma semelhante a um Cartão de Crédito, porém, é obrigatório submetê-la ao processo de autenticação do banco correspondente e o nó referente a análise de fraude não deve ser informado.


```json
{
    "merchantorderid": "30082019",
    "customer": {
        "Name": "Comprador Accept",
        "email": "comprador@teste.com.br",
        "Identity": "18160361106",
        "identitytype": "CPF",
        "Mobile": "5521995760078"
    },
    "payment": {
        "Provider": "Simulado",
        "type": "Debitcard",
        "DoSplit": "True",
        "amount": 10000,
        "capture": true,
        "installments": 1,
        "softdescriptor": "teste",
        "ReturnUrl": "https://www.UrlDeRetornoDoLojista.com.br/",
        "DebitCard": {
            "cardNumber": "4481530710186111",
            "holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SecurityCode": "693",
            "Brand": "Visa",
            "SaveCard": "false"
        },
        "splitpayments": [
            {
                "subordinatemerchantid": "{{ MerchantId do Subordinado 01 }}",
                "amount": 5000,
                "fares": {
                    "mdr": 5,
                    "fee": 30
                }
            },
            {
                "subordinatemerchantid": "{{ MerchantId do Subordinado 02 }}",
                "amount": 5000,
                "fares": {
                    "mdr": 4,
                    "fee": 15
                }
            }
        ]
    }
}
```

**Response**

```json
{
    "MerchantOrderId": "30082019",
    "Customer": {
        "Name": "Comprador Accept",
        "Identity": "18160361106",
        "IdentityType": "CPF",
        "Email": "comprador@teste.com.br",
        "Mobile": "5521995760078"
    },
    "Payment": {
        "DebitCard": {
            "CardNumber": "448153******6111",
            "Holder": "Yamilet Taylor",
            "ExpirationDate": "12/2019",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "Authenticate": true,
        "ReturnUrl": "https://www.UrlDeRetornoDoLojista.com.br/",
        "AuthenticationUrl": "https://transactionsandbox.pagador.com.br/post/mpi/auth/5bb92d7c-4f3e-40dc-9f83-bd09c02fea38",
        "ProofOfSale": "439387",
        "AcquirerTransactionId": "0830110439387",
        "SoftDescriptor": "teste",
        "DoSplit": true,
        "SplitPayments": [
            {
                "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 5.0,
                    "Fee": 30
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                        "Amount": 4720
                    },
                    {
                        "MerchantId": "{{ MerchantId do Master }}",
                        "Amount": 280
                    }
                ]
            },
            {
                "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
                "Amount": 5000,
                "Fares": {
                    "Mdr": 4.0,
                    "Fee": 15
                },
                "Splits": [
                    {
                        "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                        "Amount": 4785
                    },
                    {
                        "MerchantId": "{{ MerchantId do Master }}",
                        "Amount": 215
                    }
                ]
            }
        ],
        "PaymentId": "5bb92d7c-4f3e-40dc-9f83-bd09c02fea38",
        "Type": "DebitCard",
        "Amount": 10000,
        "ReceivedDate": "2019-08-30 11:04:33",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 9,
        "ReasonMessage": "Waiting",
        "Status": 0,
        "ProviderReturnCode": "1",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/5bb92d7c-4f3e-40dc-9f83-bd09c02fea38"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/5bb92d7c-4f3e-40dc-9f83-bd09c02fea38/void"
            }
        ]
    }
}
```

| Propriedade                             | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `AuthenticationUrl`   | URL para qual o Lojista deve redirecionar o Cliente para o fluxo de Débito.                                                      | Texto    | 56      | Sim         |
| `ReturnUrl`                  | Url de retorno do lojista. URL para onde o lojista vai ser redirecionado no final do fluxo.             | Texto | 1024       | Sim         |


### Modelos de Split

O Split de Pagamentos disponibiliza dois modelos para divisão da transação entre os participantes:

| Tipo                       | Descrição                                                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Split Transacional**     | O **Marketplace** envia na autorização (captura automática) ou no momento de captura as regras de divisão.                         |
| **Split Pós-Transacional** | O **Marketplace** envia as regras de divisão após a captura da transação.

> No Split de Pagamentos a divisão é realizada somente para transações capturadas, ou seja, as regras de divisão só serão consideradas para autorizações com captura automática e no momento da captura de uma transação. Caso seja informado no momento de uma autorização sem captura automática, as regras de divisão serão desconsideradas.

#### Transacional

No Split Transacional é necessário que o Marketplace envie um "nó" adicional na integração da API do Pagador, como apresentado em exemplos anteriores, informando as regras de divisão da transação.

```json
"SplitPayments":[
    {
        "SubordinateMerchantId" :"{{ MerchantId do Subordinado 01 }}",
        "Amount":10000,
        "Fares":{
            "Mdr":5,
            "Fee":0
        }
    }
]
```

| Propriedade                             | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `SplitPayments.SubordinateMerchantId`   | **MerchantId** (Identificador) do **Subordinado**.                                                      | Guid    | 36      | Sim         |
| `SplitPayments.Amount`                  | Parte do valor total da transação referente a participação do **Subordinado**, em centavos.             | Inteiro | -       | Sim         |
| `SplitPayments.Fares.Mdr`               | **MDR(%)** do **Marketplace** a ser descontado do valor referente a participação do **Subordinado**     | Decimal | -       | Não         |
| `SplitPayments.Fares.Fee`               | **Tarifa Fixa(R$)** a ser descontada do valor referente a participação do **Subordinado**, em centavos. | Inteiro | -       | Não         |

Como resposta, A API retornará um nó contento as regras de divisão enviadas e os valores a serem recebidos pelo Marketplace e seus Subordinados:

```json
"SplitPayments": [
    {
        "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
        "Amount": 10000,
        "Fares": {
            "Mdr": 5,
            "Fee": 0
        },
        "Splits": [                
            {
                "MerchantId": "{{ MerchantId do Master }}",
                "Amount": 500,
            },
            {
                "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                "Amount": 9500,
            }
        ]
    }
]
```

| Propriedade                                  | Descrição                                                                                   | Tipo   | Tamanho | Obrigatório |
|----------------------------------------------|---------------------------------------------------------------------------------------------|--------|---------|-------------|
| `SplitPayments.Splits.SubordinateMerchantId` | **MerchantId** (Identificador) do **Subordinado** ou **Marketplace**.                       | Guid   | 36      | Sim         |
| `SplitPayments.Splits.Amount`                | Parte do valor calculado da transação a ser recebido pelo **Subordinado** ou **Marketplace**, já descontando todas as taxas (MDR e Tarifa Fixa) | Inteiro | -      | Sim         |


#### Pós-Transacional

Neste modelo o Marketplace poderá enviar as regras de divisão da transação após a mesma ser capturada.

Para transações com **Cartão de Crédito** este período é de **20 dias** e para as transações com **Cartão de Débito** este período é de **1 dia**, se o Marketplace possuir um regime padrão de pagamentos. Caso tenha um regime personalizado, o período deverá ser acordado entre as partes (Marketplace e Braspag (Facilitador)).


> O período para redividir uma transação poderá ser alterado pela Braspag (Facilitador).


**Autenticação**

O Split de Pagamentos utiliza como segurança o protocolo [OAUTH2](https://oauth.net/2/), onde é necessário primeiramente obter um token de acesso, utlizando suas credenciais.

Para obter um token de acesso:

1. Concatene o ClientId e ClientSecret: `ClientId:ClientSecret`.  
2. Codifique o resultado da concatenação em Base64.  
3. Realize uma requisição ao servidor de autorização:  

**Request**  

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{braspag-oauth2-server}/oauth2/token</span></aside>

``` shell
x-www-form-urlencoded
--header "Authorization: Basic {base64}"  
--header "Content-Type: application/x-www-form-urlencoded"  
grant_type=client_credentials
```

**Response**

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbG.....WE1igNAQRuHAs",
    "token_type": "bearer",
    "expires_in": 1199
}
```

> O ClientSecret deve ser obtido junto à Braspag. <br>
> O token retornado (access_token) deverá ser utilizado em toda requisição à API Split como uma chave de autorização. O mesmo possui uma validade de 20 minutos e deverá ser obtido um novo token toda vez que o mesmo expirar.  

**Request**  

<aside class="request"><span class="method post">PUT</span> <span class="endpoint">{api-split}/api/transactions/{PaymentId}/split</span></aside>

```json
--header "Authorization: Bearer {access_token}"
[
    {
        "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
        "Amount": 6000,
        "Fares": {
            "Mdr": 5,
            "Fee": 30
        }
    },
    {
        "SubordinateMerchantId" :"{{ MerchantId do Subordinado 02 }}",
        "Amount":4000,
        "Fares":{
            "Mdr":4,
            "Fee":15
        }
    }
]
```

**Response**

```json
{
    "PaymentId": "c96bf94c-b213-44a7-9ea3-0ee2865dc57e",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                    "Amount": 5670
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
            "Amount": 4000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                    "Amount": 3825
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "Amount": 175
                }
            ]
        }
    ]
}
```

O nó referente ao Split no Split Pós-transacional, tanto no contrato de request quanto de response, é o mesmo retornado na divisão no Split Transacional, apresentado anteriormente.

> O Marketplace poderá informar as regras de divisão da transação mais de uma vez desde que esteja dentro do período de tempo permitido, que é de **20 dias** para **Cartão de Crédito** se estiver enquadrado no regime de pagamento padrão. 

### Captura

Ao capturar uma transação do Split de Pagamentos, deve-se informar as regras de divisão da transação. Caso as regras não sejam informadas, o Split interpretará que todo o valor é referente ao próprio Marketplace.

#### Captura Total

Na captura total de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total da transação enviado no momento da autorização.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture</span></aside>

```json
{
    "SplitPayments":[
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            }
        },
        {
            "SubordinateMerchantId" :"{{ MerchantId do Subordinado 02 }}",
            "Amount":4000,
            "Fares":{
                "Mdr":4,
                "Fee":15
            }
        }
     ]
}
```

**Response**

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "6",
    "ReturnMessage": "Operation Successful",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "Amount": 6000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                    "Amount": 5670
                },
                {
                    "MerchantId": "{{ MerchantId do Master}}",
                    "Amount": 330
                }
            ]
        },
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
            "Amount": 4000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                    "Amount": 3825
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "Amount": 175
                }
            ]
        }
    ],
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/db14bf98-5ebd-43b5-8ba6-205c30ec1c16"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/db14bf98-5ebd-43b5-8ba6-205c30ec1c16/void"
        }
    ]
}
```

#### Captura Parcial

Na captura parcial de uma transação, o somatório dos valores de participação de cada subordinado deverá ser igual ao valor total a ser capturado. Caso nenhuma divisão seja informada, o Split interpretará que todo o valor é referente ao próprio Marketplace.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture?amount={amount}</span></aside>

O exemplo abaixo captura parcialmente o valor de R$80,00 de uma transação realizada no valor de R$100,00.

```json
{
    "SplitPayments":[
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "Amount": 5000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            }
        },
        {
            "SubordinateMerchantId" :"{{ MerchantId do Subordinado 02 }}",
            "Amount":3000,
            "Fares":{
                "Mdr":4,
                "Fee":15
            }
        }
     ]
}
```

**Response**

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "6",
    "ReturnMessage": "Operation Successful",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "Amount": 5000,
            "Fares": {
                "Mdr": 5,
                "Fee": 30
            },
            "Splits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                    "Amount": 4720
                },
                {
                    "MerchantId": "{{ MerchantId do Master}}",
                    "Amount": 280
                }
            ]
        },
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
            "Amount": 3000,
            "Fares": {
                "Mdr": 4,
                "Fee": 15
            },
            "Splits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                    "Amount": 2865
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "Amount": 135
                }
            ]
        }
    ],
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/7bd7fc3a-4385-45cf-8a45-ec0349716b68"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/7bd7fc3a-4385-45cf-8a45-ec0349716b68/void"
        }
    ]
}
```

Como explicitado anteriormente, se realizada uma captura total ou parcial sem informar as regras de divisão, o Split interpreta que todo o valor é destinado ao próprio Marketplace.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture/capture?amount=8000</span></aside>


**Response**

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "6",
    "ReturnMessage": "Operation Successful",
    "SplitPayments": [
        {
            "SubordinateMerchantId": "{{ MerchantId do Master }}",
            "Amount": 8000,
            "Fares": {
                "Mdr": 2,
                "Fee": 0
            },
            "Splits": [
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "Amount": 8000
                }
            ]
        }
    ],
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/ee849761-d758-4f12-80bf-6ceae3a751ec"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/ee849761-d758-4f12-80bf-6ceae3a751ec/void"
        }
    ]
}
```

### Cancelamento

Ao cancelar uma transação do Split de Pagamentos o Marketplace deve informar, para um cancelamento parcial, qual o valor deve ser cancelado de cada participante da transação. Para um cancelamento total, esta informação não é necessária, já que será cancelado o valor total e consequentemente o valor total de cada Subordinado.

#### Cancelamento Total

No cancelamento total de uma transação, será cancelado o valor total da transação e consequentemente o valor total de cada Subordinado e as comissões de todos os participantes.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void</span></aside>

**Response**

```json
{
    "Status": 10,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "0",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "0",
    "ReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/019efd18-c69a-4107-b5d7-e86564460cc4"
        }
    ],
    "VoidSplitPayments": [
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "VoidedAmount": 4000,
            "VoidedSplits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                    "VoidedAmount": 3825
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "VoidedAmount": 175
                }
            ]
        },
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
            "VoidedAmount": 6000,
            "VoidedSplits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                    "VoidedAmount": 5670
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "VoidedAmount": 330
                }
            ]
        }
    ]
}
```

#### Cancelamento Parcial

No cancelamento parcial, o somatório dos valores cancelados definidos para cada Subordinado deve ser igual ao valor do cancelamento parcial.

**Request**

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void?amount={amount}</span></aside>

No exempo abaixo é cancelado o valor de R$25,00 de uma transação capturada no valor de R$100,00.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">v2/sales/{PaymentId}/void?amount=2500</span></aside>

```json
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "VoidedAmount": 1500
        },
        {
            "SubordinateMerchantId" :"{{ MerchantId do Subordinado 02 }}",
            "VoidedAmount":1000
        }
     ]
}
```

| Propriedade                                 | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------|
| `VoidSplitPayments.SubordinateMerchantId`   | **MerchantId** (Identificador) do **Subordinado**.                                                      | Guid    | 36      | Sim         |
| `VoidedAmount.Amount`                       | Total ou parte do valor destinado ao **Subordinado** a ser cancelado, em centavos.                      | Inteiro | -       | Sim         |

**Response**

```json
{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "0",
    "ProviderReturnMessage": "Operation Successful",
    "ReturnCode": "0",
    "ReturnMessage": "Operation Successful",
    "Links": [
        {
            "Method": "GET",
            "Rel": "self",
            "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/c10ee5e5-6179-424c-bbf2-1a2319a8f7c3"
        },
        {
            "Method": "PUT",
            "Rel": "void",
            "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/c10ee5e5-6179-424c-bbf2-1a2319a8f7c3/void"
        }
    ],
    "VoidSplitPayments": [
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 01 }}",
            "VoidedAmount": 1500,
            "VoidedSplits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 01 }}",
                    "VoidedAmount": 1417
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "VoidedAmount": 83
                }
            ]
        },
        {
            "SubordinateMerchantId": "{{ MerchantId do Subordinado 02 }}",
            "VoidedAmount": 1000,
            "VoidedSplits": [
                {
                    "MerchantId": "{{ MerchantId do Subordinado 02 }}",
                    "VoidedAmount": 956
                },
                {
                    "MerchantId": "{{ MerchantId do Master }}",
                    "VoidedAmount": 44
                }
            ]
        }
    ]
}
```

Não é obrigatório informar todos os Subordinados no cancelamento parcial. Pode-se informar apenas os subordinados para os quais se deseja cancelar totalmente ou parte do valor destinado aos mesmos na transação. No exemplo acima poderia ser informado, por exemplo, apenas o segundo subordinado, conforme exemplo abaixo:

```json
{
    "VoidSplitPayments":[
        {
            "SubordinateMerchantId" :"{{ MerchantId do Subordinado 02 }}",
            "VoidedAmount":1000
        }
     ]
}
```

> Ao cancelar parcialmente parte de um valor destinado a um Subordinado, é cancelada proporcionalmente também a Tarifa Fixa que o Marketplace tem a receber.

## Antifraude


O Split de Pagamentos possui uma plataforma de antifraude que utiliza inteligência artificial para minimizar os riscos de fraude e chargeback.

>  No modelo de negócio do Split, todo chargeback é repassado ao Marketplace, que pode ou não repassá-lo para os seus subordinados. Portanto, é de suma importância que a plataforma de antifraude esteja corretamente integrada e configurada.


### Fluxo transacional

A integração com o antifraude se dá através do próprio fluxo transacional, na mesma requisição da transação.

-   Cliente realiza uma transação.
-   A anállise de fraude é realizada.
	- Caso a análise de fraude recomende rejeitar a transação, o fluxo é interrompido.
-   A transação é executada normalmente.

Para utilizar o sistema de antifraude, é necessário incluir o bloco `Payment.FraudAnalysis`. Em casos de uma compra remota ou com entrega, também deverão ser incluidos os blocos `Customer.DeliveryAddress` e/ou `Customer.BillingAddress`.

| Campos | Tipo | Tamanho | Obrigatório | Descrição|
|--|--|--|--|--|
|`MerchantOrderId`|Texto|50|Sim|Número de identificação do pedido no sistema do lojista|
|`Customer`|-|-|Sim|Dados do comprador|
|`Customer.Name`|Texto|61|Sim|Nome do comprador|
|`Customer.Identity`|Texto|18|Sim|Número de documento do comprador|
|`Customer.IdentityType`|Texto|4|Sim|Tipo de documento de identificação do comprador. Ex.: `CPF` ou `CNPJ`|
|`Customer.Email`|Texto|60|Não|E-mail do comprador|
|`Customer.Phone`|Texto|15|Não|Telefone do comprador. Ex.: `552121114700`|
|`Customer.Mobile`|Texto|15|Não|Telefone celular do comprador. Ex.: `5521987654321`|1`|
|`Customer.DeliveryAddress`| - | - |Não|Enviado quando a transação é referente a algum produto com entrega|
|`Customer.DeliveryAddress.Street`|Texto|24|Não|Endereço de entrega do comprador.|
|`Customer.DeliveryAddress.Number`|Texto|5|Não|Número do endereço de entrega do comprador|
|`Customer.DeliveryAddress.Complement`|Texto|14|Não|Complemento do endereço de entrega do comprador|
|`Customer.DeliveryAddress.District`|Texto|15|Não|Distrito ou Bairro do endereço de entrega do comprador|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não|CEP do endereço de entrega do comprador|
|`Customer.DeliveryAddress.City`|Texto|20|Não|Cidade do endereço de entrega do comprador|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega do comprador|
|`Customer.DeliveryAddress.Country`|Texto|2|Não|País do endereço de entrega do comprador|
|`Customer.BillingAddress`|-|-|Não|-|
|`Customer.BillingAddress.Street`|Texto|24|Sim|Endereço de cobrança do comprador|
|`Customer.BillingAddress.Number`|Texto|5|Sim|Número do endereço de cobrança do comprador|
|`Customer.BillingAddress.Complement`|Texto|14|Não|Complemento do endereço de cobrança do comprador|
|`Customer.BillingAddress.District`|Texto|15|Sim|Distrito ou Bairro do endereço de cobrança do comprador|
|`Customer.BillingAddress.ZipCode`|Texto|9|Sim|CEP do endereço de cobrança do comprador|
|`Customer.BillingAddress.City`|Texto|20|Sim|Cidade do endereço de cobrança do comprador|
|`Customer.BillingAddress.State`|Texto|2|Sim|Estado do endereço de cobrança do comprador|
|`Customer.BillingAddress.Country`|Texto|2|Sim|País do endereço de cobrança do comprador|
|`Payment`|-|-|Sim|Campos refente ao pagamento e antifraude|
|`Payment.Provider`|Texto|15|Sim|Nome da provedora de Meio de Pagamento|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. Possíveis Valores: `CreditCard` ou `DebitCard`|
|`Payment.Amount`|Inteiro|15|Sim|Valor do pedido em centavos. Ex.: r$ 1.559,85 = 155985|
|`Payment.Capture`|Boleano|-|Sim|Parâmetro para capturar a transação. Caso o valor seja `False` a transação será apenas autorizada. Se for `True`, a captura será realizada automaticamente após a autorização.|
|`Payment.ServiceTaxAmount`|Inteiro|15|Não|Exclusivo para companhias aéreas - Montante do valor da autorização que deve ser destinado à taxa de serviço  |Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Installments`|Inteiro|2|Sim|Número de parcelas do pedido|
|`Payment.SoftDescriptor`|Texto|13|Sim|Texto que será impresso na fatura do cartão de crédito do portador|
|`Payment.CreditCard`|-|-|Sim|Nó contendo as informações do cartão|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão do comprador|
|`Payment.CreditCard.Holder`|Texto|50|Sim|Nome do comprador impresso no cartão|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão composta por MM/AAAA|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança impresso no verso do cartão|
|`Payment.CreditCard.Brand`|Texto|10|Sim|Bandeira do cartão  |Possíveis valores: Visa / Master / Amex / Elo / Aura / JCB / Diners / Discover|
|`Payment.SaveCard`|Boleano|-|Não|Parâmetro para salvar os dados do cartão como token. Caso seja passado com o valor `True`, O parâmetro `CardToken` será retornado no `Response` sendo seu valor o token gerado que poderá ser utilizado em futuras transações.|
|`Payment.FraudAnalysis`|-|-|-|Nó contendo as informações para Análise de Fraude
|`Payment.FraudAnalysis.Provider`|Texto|12|Sim|Identifica o provedor da solução de análise de fraude  |Possíveis valores: `Cybersource`
|`Payment.FraudAnalysis.TotalOrderAmount`|Inteiro|15|Não|Valor total do pedido em centavos, podendo ser diferente do valor da transação  |Ex.: Valor do pedido sem a taxa de entrega|
|`Payment.FraudAnalysis.FingerPrintId`|Texto|6010|Sim|Impressão digital de dispositivos e geolocalização real do IP do comprador [Configuração do Fingerprint](https://braspag.github.io//manual/antifraude#cybersource)|
|`Payment.FraudAnalisys.Browser`|-|-|Sim|-|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|255|Sim|Ip do comprador|
|`Payment.FraudAnalysis.Cart`|Lista|-|Não|Nó contendo as informações do carrinho de compras para análise de fraude|
|`Payment.FraudAnalysis.Cart.Items[].Name`|Texto|50|Não|Nome do produto|
|`Payment.FraudAnalysis.Cart.Items[].Sku`|Texto|12|Não|Sku do produto|
|`Payment.FraudAnalysis.Cart.Items[].UnitPrice`|Inteiro|15|Não|Preço original do produto em centavos  |Ex.: R$ 1.559,85 = 155985|
|`Payment.FraudAnalysis.Cart.Items[].Quantity`|Inteiro|-|Não|Quantidade do produto|
|`Payment.FraudAnalysis.MerchantDefinedFields`|Lista|-|Sim|Nó contendo dados |adicionais para análise de fraude [Tabela de Merchant Defined Data](https://braspag.github.io//manual/antifraude#tabela-31-merchantdefineddata-(cybersource))|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Id`|Inteiro|-|Sim|Identificador de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.MerchantDefinedFields.Items[].Value`|Texto|255|Sim|Valor de uma informação adicional a ser enviada|
|`Payment.FraudAnalysis.Shipping`|-|-|Não|Nó contendo informações adicionais da entrega do pedido para análise de fraude|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|61|Não|Nome e sobrenome do destinatário|

## Agenda Financeira

No Split de Pagamentos, o responsável por realizar o repasse dos valores (liquidação) a cada um dos participantes de uma venda é a Braspag (Facilitador).

A Braspag irá gerar uma agenda financeira que poderá ser consultada a qualquer momento pelo Marketplace e/ou Subordinados.

A agenda é composta por eventos de Crédito e Débito que são gerados de acordo com as operações efetuadas e o regime de pagamento acordado.

Eventos de Crédito:

| Id | Evento                         | Descrição                                                                                               |
|----|--------------------------------|---------------------------------------------------------------------------------------------------------|
| 1  | `Credit`                       | Lançamento de crédito das parcelas de uma transação.                                                    |
| 3  | `FeeCredit`                    | Lançamento de crédito da Tarifa Fixa acordada entre o Marketplace e a Braspag (Facilitador).            |
| 5  | `RefundCredit`                 | Lançamento de crédito devido a um cancelamento.                                                         |
| 7  | `ChargebackCredit`             | Lançamento de crédito devido a um chargeback.                                                           |
| 9  | `UndoChargebackCredit`         | Lançamento de crédito para reversão de um chargeback.                                                   |
| 11 | `AntiFraudFeeCredit`           | Lançamento de crédito referente à transação de antifraude.                                              |
| 13 | `AntiFraudFeeWithReviewCredit` | Lançamento de crédito referente à transação de antifraude com revisão manual.                           |
| 15 | `AdjustmentCredit`             | Lançamento de um crédito como ajuste.                                                                   |
| 17 | `ChargebackReversalCredit`     | Lançamento de crédito referente a reversão de um chargeback.                                            |
| 19 | `AnticipationCredit`           | Lançamento de crédito referente a antecipação.                                                          |
| 20 | `AnticipationCommissionCredit` | Lançamento de crédito referente a comissão de uma antecipação.                                          |

Eventos de Débito:

| Id | Evento                        | Descrição                                                                                               |
|----|-------------------------------|---------------------------------------------------------------------------------------------------------|
| 2  | `Debit`                       | Lançamento de débito das parcelas de uma transação.                                                     |
| 4  | `FeeDebit`                    | Lançamento de débito da Tarifa Fixa acordada entre o Marketplace e a Braspag (Facilitador).             |
| 6  | `RefundDebit`                 | Lançamento de débito devido a um cancelamento.                                                          |
| 8  | `ChargebackDebit`             | Lançamento de débito devido a um chargeback.                                                            |
| 10 | `UndoChargebackDebit`         | Lançamento de débito para reversão de um chargeback.                                                    |
| 12 | `AntiFraudFeeDebit`           | Lançamento de débito referente à transação de antifraude.                                               |
| 14 | `AntiFraudFeeWithReviewDebit` | Lançamento de débito referente à transação de antifraude com revisão manual.                            |
| 16 | `AdjustmentDebit`             | Lançamento de um débito como ajuste.                                                                    |
| 18 | `ChargebackReversalDebit`    | Lançamento de débito referente a reversão de um chargeback.                                             |
| 22 | `AnticipationCommissionDebit` | Lançamento de débito referente a comissão de uma antecipação.                                           |

Um evento poderá estar em um dos seguintes status na agenda financeira:

* **Scheduled**: Agendado.
* **Pending**: Aguardando confirmação de liquidação.
* **Settled**: Liquidado.
* **Error**: Erro de liquidação na instituição financeira.
* **WaitingForAdjustementDebit**: Aguardando liquidação do ajuste de débito associado.
* **Anticipated**: Evento antecipado.

### Consultar Eventos

A API Split permite consultar o que uma loja tem a receber dentro de um intervalo de datas.

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialForecastedDate={initialDate}&finalForecastedDate={finalDate}&pageIndex={pageIndex}&pageSize={pageSize}&eventStatus={eventStatus}&merchantIds={merchantId}</span></aside>

| Parâmetro                  | Descrição                                                                            | Tipo    | Formato    | Obrigatório | Valor Padrão          |
|----------------------------|--------------------------------------------------------------------------------------|---------|------------|-------------|-----------------------|
| `InitialForecastedDate`    | Data de pagamento prevista inicial a ser consultada.                                 | Data    | YYYY-MM-DD | Não         | CurrentDate           |
| `FinalForecastedDate`      | Data de pagamento prevista final a ser consultada.                                   | Data    | YYYY-MM-DD | Não         | InitialForecastedDate |
| `InitialPaymentDate`       | Data de pagamento inicial a ser consultada.                                          | Data    | YYYY-MM-DD | Não         | -                     |
| `FinalPaymentDate`         | Data de pagamento final a ser consultada.                                            | Data    | YYYY-MM-DD | Não         | InitialPaymentDate    |
| `PageIndex`                | Página a ser consultada.                                                             | Inteiro | -          | Não         | 1                     |
| `PageSize`                 | Tamanho da página. Valores possíveis: 25, 50, 100.                                   | Inteiro | -          | Não         | 25                    |
| `EventStatus`              | Status do evento [Scheduled - Pending - Settled - Error - WaitingFoAdjustementDebit - Anticipated].| String  | -          | Não         | Todos                 |
| `IncludeAllSubordinates`   | Inclui todos os subordinados na consulta.                                            | Boolean | -          | Não         | false                 | 
| `MerchantIds`              | Lojas a serem consideradas na consulta.                                              | Guid    | -          | Não         | -                     |

**Resquest**

**Por Data Prevista de Pagamento**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialForecastedDate=2017-12-01&finalForecastedDate=2018-12-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

**Por Data de Pagamento**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/events?initialPaymentDate=2018-08-22&finalPaymentDate=2018-08-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"
```

**Response**

```json
{
    "PageCount": 1,
    "PageSize": 25,
    "PageIndex": 1,
    "Schedules": [
        {
            "Id": "b579fafb-8271-4a1d-a657-00e5fd9b9f83",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 6,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "2f110f0d-82c9-4a1f-8df5-08203348d160",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 9,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "01d9b78f-b287-4376-a5e4-12d91cde1938",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 2,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "e30760d7-01e2-4b2b-9a43-2b252fcfbd84",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9262,
            "InstallmentNumber": 10,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        },
        {
            "Id": "90ea1e11-568f-49ee-bc3f-7ab2a225a1e1",
            "PaymentId": "069ee5ef-ce7a-43ce-a9af-022f652e115a",
            "MerchantId": "ea4db25a-f981-4849-87ff-026897e006c6",
            "ForecastedDate": "2018-08-22",
            "Installments": 10,
            "InstallmentAmount": 9255,
            "InstallmentNumber": 1,
            "Event": 1,
            "EventDescription": "Credit",
            "EventStatus": "Settled",
            "SourceId": "e3efe82f-1eee-4c28-bb9f-8054fcd4ca3f",
            "Mdr": 3.2,
            "Commission": false
        }
    ]
}
```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `Schedules[].Id`                  | Identificador do evento na agenda financiera.                                                           | Guid    | 36      |
| `Schedules[].PaymentId`           | Identificador da transação.                                                                             | Guid    | 36      |
| `Schedules[].MerchantId`          | Identificador da loja.                                                                                  | Guid    | 36      |
| `Schedules[].PaymentDate`         | Data de liquidação. Retornada somente quando pagamento realizado (EventStatus = Settled)                | Data    | -       |
| `Schedules[].ForecastedDate`      | Data de liquidação prevista.                                                                            | Data    | -       |
| `Schedules[].Installments`        | Número de parcelas da transação.                                                                        | Inteiro | -       |
| `Schedules[].InstallmentAmount`   | Valor, em centavos, da parcela a liquidar.                                                              | Inteiro | -       |
| `Schedules[].InstallmentNumber`   | Número da parcela a liquidar.                                                                           | Inteiro | -       |
| `Schedules[].Event`               | Identificador do evento.                                                                                | Inteiro | -       |
| `Schedules[].EventDescription`    | Descrição do evento.                                                                                    | String  | -       |
| `Schedules[].EventStatus`         | Status do evento. [Scheduled - Pending - Settled - Error - WaitingForAdjustementDebit]                  | String  | -       |

### Consultar Transações

O Split de Pgamentos permite consultar a agenda financeira de várias transações ou de uma transação específica.

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/transactions?initialCaptureDate={initialDate}&finalCaptureDate={finalDate}&pageIndex={pageIndex}&pageSize={pageSize}&eventStatus={eventStatus}&merchantIds={merchantId}</span></aside>

| Parâmetro               | Descrição                                                                     | Tipo    | Formato    | Obrigatório | Valor Padrão       |
|-------------------------|-------------------------------------------------------------------------------|---------|------------|-------------|--------------------|
| `InitialCaptureDate`    | Data inicial a ser consultada, considerando a data de captura das transações. | Data    | YYYY-MM-DD | Não         | CurrentDate        |
| `FinalCaptureDate`      | Data final a ser consultada, considerando a data de captura das transações.   | Data    | YYYY-MM-DD | Não         | InitialCaptureDate |
| `PageIndex`             | Página a ser consultada.                                                      | Inteiro | -          | Não         | 1                  |
| `PageSize`              | Tamanho da página.  Valores possíveis: 25, 50, 100.                           | Inteiro | -          | Não         | 25                 |
| `EventStatus`           | Status do evento [Scheduled - Pending - Settled - Error - Anticipated].                     | String  | -          | Não         | Todos              |
| `IncludeAllSubordinates`| Inclui todos os subordinados na consulta.                                     | Boolean | -          | Não         | false              |
| `MerchantIds`           | Lojas a serem consideradas na consulta.                                       | Guid    | -          | Não         | -                  |

Para informar várias lojas na consulta, basta repetir o parâmetro "merchantIds". Caso não seja informada nenhuma loja, será considerada a loja utilizada na autenticação à API Split.

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/transactions?initialCaptureDate=2017-12-01&finalCaptureDate=2017-12-31&merchantIds=e4db3e1b-985f-4e33-80cf-a19d559f0f60&merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"  
```

**Response**

```json
{
    "PageCount": 1,
    "PageSize": 25,
    "PageIndex": 1,
    "Transactions": [
        {
            "PaymentId": "24afaaaf-f2a1-40a5-bb25-f914fa623c4c",
            "CapturedDate": "2017-12-01",
            "Schedules": [
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 24357,
                    "InstallmentNumber": 1,
                    "Event": "Credit",
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 1450,
                    "InstallmentNumber": 1,
                    "Event": "Credit",
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 38480,
                    "InstallmentNumber": 1,
                    "Event": "Credit",
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ForecastedDate": "2017-12-21",
                    "Installments": 2,
                    "InstallmentAmount": 5,
                    "InstallmentNumber": 1,
                    "Event": "FeeDebit",
                    "EventDescription": "FeeDebit",
                    "EventStatus": "Scheduled"
                },
            ]
        }
    ]
}
```

| Propriedade                                      | Descrição                                                                                               | Tipo    | Tamanho |
|--------------------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `Transactions[].PaymentId`                       | Identificador da transação.                                                                             | Guid    | 36      |
| `Transactions[].CaptureDate`                     | Data de captura da transação.                                                                           | Data    | -       |
| `Transactions[].Schedules[].MerchantId`          | Identificador da loja.                                                                                  | Guid    | 36      |
| `Transactions[].Schedules[].PaymentDate`         | Data de liquidação. Retornada somente quando pagamento realizado (EventStatus = Settled)                | Data    | -       |
| `Transactions[].Schedules[].ForecastedDate`      | Data de liquidação prevista.                                                                            | Data    | -       |
| `Transactions[].Schedules[].Installments`        | Número de parcelas a liquidar.                                                                          | Inteiro | -       |
| `Transactions[].Schedules[].InstallmentsAmount`  | Valor, em centavos, da parcela a liquidar.                                                              | Inteiro | -       |
| `Transactions[].Schedules[].InstallmentNumber`   | Número da parcela a liquidar.                                                                           | Inteiro | -       |
| `Transactions[].Schedules[].Event`               | Identificador do evento.                                                                                | Inteiro | -       |
| `Transactions[].Schedules[].EventDescription`    | Descrição do evento.                                                                                    | String  | -       |
| `Transactions[].Schedules[].EventStatus`         | Status do evento. [Scheduled - Pending - Settled - Error - Anticipated]                                               | String  | -       |

Para consultar a agenda de uma transação específica basta informar o identificador da transação na requisição.

Neste caso poderão ser utilizados os filtros MarchantIds e EventStatus.

**Request**

<aside class="request"><span class="method get">GET</span> <span class="endpoint">{api-split}/schedule-api/transactions/{PaymentId}?merchantIds=7c7e5e7b-8a5d-41bf-ad91-b346e077f769&merchantIds=2b9f5bea-5504-40a0-8ae7-04c154b06b8b</span></aside>

```shell
x-www-form-urlencoded
--header "Authorization: Bearer {access_token}"
```

**Response**

```json
{
    "PageCount": 1,
    "PageSize": 25,
    "PageIndex": 1,
    "Transactions": [
        {
            "PaymentId": "cd2309d3-3fec-4816-aec7-bcb6d51a0988",
            "CapturedDate": "2017-12-11",
            "Schedules": [
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "ForecastedDate": "2018-01-11",
                    "Installments": 1,
                    "InstallmentAmount": 5790,
                    "InstallmentNumber": 1,
                    "Event": 1,
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                },
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "ForecastedDate": "2018-01-11",
                    "Installments": 1,
                    "InstallmentAmount": 3790,
                    "InstallmentNumber": 1,
                    "Event": 1,
                    "EventDescription": "Credit",
                    "EventStatus": "Scheduled"
                }
            ]
        }
    ]
}
```

### Ajustes

O Split de Pagamentos permite que sejam lançados ajustes à crédito e à débito nas agendas dos Subordinados.

Um ajuste somente será efetivamente liquidado para os evolvidos caso o participante a ser debitado possua saldo positivo na data prevista informada para efetivação do ajuste. Caso contrário, a liquidação do ajuste será postergada, para ambos os envolvidos, até que o participante a ser debitado tenha saldo positivo para cobrir o valor do ajuste.

**Ex:** Marketplace lança um ajuste a débito de R$100,00 para o Subordinado A com data prevista de cobrança em 17/10/2018.

**Caso 1)** Subordinado possui saldo positivo na data prevista informada.

![SplitSampleadjustment001](https://braspag.github.io/images/braspag/split/adjustment001.png)

Os valores até o dia 16/10/2018 foram liquidados normalmente.

Como o subordinado tinha R$150,00 para receber no dia 17/10/2018, o ajuste foi lançado na agenda financeira na data prevista informada e o mesmo receberá R$50,00 devido ao débito do ajuste.

O participante a ser creditado terá a efetivação do crédito na mesma data de efetivação do débito, ou seja, receberá R$150,00 no dia 17/10/2018.

**Caso 2)** Subordinado não possui saldo positivo na data prevista informada.

![SplitSampleadjustment002](https://braspag.github.io/images/braspag/split/adjustment002.png)

Os valores até o dia 16/10/2018 foram liquidados normalmente.

O Subordinado tinha a receber apenas R$60,00 no dia 17/10/2018, o que não cobre o valore do ajuste a ser debitado do mesmo.

Neste cenário, os pagamentos do subordinado serão retidos até que o mesmo tenha saldo para cobrir o ajuste, o que ocorre no dia 19/10/2018, onde o acumulado retido é de R$130,00. Com isso, o subordinado receberá R$30,00.

O participante a ser creditado terá a efetivação do crédito na mesma data de efetivação do débito, ou seja, receberá R$150,00 no dia 19/10/2018.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/adjustment-api/adjustments/</span></aside>

```json
--header "Authorization: Bearer {access_token}"
--header "Accept: application/json"
{
    "merchantIdToDebit": "EA4DB25A-F981-4849-87FF-026897E006C6",
    "merchantIdToCredit": "44F68284-27CF-43CB-9D14-1B1EE3F36838",
    "forecastedDate": "2018-09-17",
    "amount": 1000,
    "description": "Multa por não cumprimento do prazo de entrega no pedido XYZ",
    "transactionId": "717A0BD0-3D92-43DB-9D1E-9B82DFAFA392"
}
```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------| 
| `merchantIdToDebit`               | Merchant do qual o valor será debitado.                                                                 | Guid    | 36      | Sim         |
| `merchantIdToCredit`              | Merchant para o qual o valor será creditado.                                                            | Inteiro | -       | Sim         |
| `forecastedDate`                  | Data prevista para lançamento do ajuste na agenda financeira.                                           | String  | -       | Sim         |
| `amount`                          | Valor em centavos do ajuste.                                                                            | Inteiro | -       | Sim         |
| `description`                     | Decrição do ajuste.                                                                                     | String  | 500     | Sim         |
| `transactionId`                   | Identificador da transação para qual o ajuste está sendo lançado.                                       | Guid    | -       | Não         |

<aside class="warning">Ao associar o ajuste a uma transação, os envolvidos devem ser participantes da transação.</aside>

**Response**

```json
-- 201 - Created
{
    "id": "68465ddd-451a-4194-abca-be1ed71fb2ea",
    "merchantIdToDebit": "EA4DB25A-F981-4849-87FF-026897E006C6",
    "merchantIdToCredit": "44F68284-27CF-43CB-9D14-1B1EE3F36838",
    "forecastedDate": "2018-09-19",
    "amount": 1000,
    "description": "Multa por não cumprimento do prazo de entrega no pedido",
    "transactionId": "717A0BD0-3D92-43DB-9D1E-9B82DFAFA392",
    "status": "Created"
}
```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho | Obrigatório |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|-------------| 
| `id`                              | Identificador do ajuste.                                                                                | Guid    | 36      | -           |
| `status`                          | Status do ajustes [Created - Scheduled - Processed - Canceled ].                                        | String  | -       | -           |

## Chargeback

No Split de Pagamentos o Marketplace pode definir se assumirá o chargeback ou o repassará para seus Subordinados, desde que acordado previamente entre as partes.

Se o Marketplace optar por repassar para os Subordinados, o Chargeback Total é sensibilizado automaticamente na agenda dos mesmos. Caso contrário o chargeback será sensibilizado automaticamente na agenda do Marketplace, como acontece com um Charback Parcial.

O Marketplace pode decidir ainda repassar o Chargeback para seus subordinados. Para isso A API Split disponibiliza um serviço onde o Marketplace pode informar como dividir o valor do chargeback entre os subordinados, caso seja um Chargeback Parcial.  

No exemplo abaixo ocorreu um Chargeack Parcial no valor de R$60,00 de uma transação com valor capturado de R$100,00.

**Request**

<aside class="request"><span class="method post">POST</span> <span class="endpoint">{api-split}/api/chargebacks/{ChargebackId}/splits</span></aside>

```json
[
  {
    "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
    "ChargebackAmount": 4000
  },
  {
    "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
    "ChargebackAmount": 2000
  }
]

```

| Propriedade                       | Descrição                                                                                               | Tipo    | Tamanho |
|-----------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `SubordinateMerchantId`           | Identificador do Subordinado.                                                                           | Guid    | 36      |
| `ChargebackAmount`                | Valor do chargeback que deverá ser repassado ao Subordinado, em centavos.                               | Inteiro | -       |

**Response**

```json
{
    "ChargebackSplitPayments": [
        {
            "SubordinateMerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
            "ChargebackAmount": 4000,
            "ChargebackSplits": [
                {
                    "MerchantId": "7c7e5e7b-8a5d-41bf-ad91-b346e077f769",
                    "ChargebackAmount": 3780
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ChargebackAmount": 220
                }
            ]
        },
        {
            "SubordinateMerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
            "ChargebackAmount": 2000,
            "ChargebackSplits": [
                {
                    "MerchantId": "2b9f5bea-5504-40a0-8ae7-04c154b06b8b",
                    "ChargebackAmount": 1912
                },
                {
                    "MerchantId": "e4db3e1b-985f-4e33-80cf-a19d559f0f60",
                    "ChargebackAmount": 88
                }
            ]
        }
    ]
}
```

> O Marketplace tem 1 dia, contado a partir da data de efetivação do chargeback, para informar como deseja repassar os valores aos subordinados.

| Propriedade                                | Descrição                                                                                               | Tipo    | Tamanho |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------|---------|---------|
| `ChargebackSplitPayments.ChargebackSplits` | Lista contendo a divisão do chargeback para cada participante.                                          | Guid    | 36      |

## Liquidação

A plataforma permite que o Master bloqueie temporariamente a liquidação para um Subordinado para garantia da entrega do produto/serviço, funcionalidade conhecida como Escrow.

### Trava

Este bloqueio, conhecido como custódia, pode durar até 180 dias. Após este prazo, a Braspag liquidará o valor para o subordinado independentemente do bloqueio.

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">{splitApi}/api/transactions/{paymentid}/settlements</span></aside>

**Request**

```json
[
    {
        "SubordinateMerchantId": "{{ Guid }}",
        "Locked": [true | false]
    },
    {
        "SubordinateMerchantId": "{{ Guid }}",
        "Locked": [true | false]
    },
]
```

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|-----------|----|-------|-----------|---------|
|`SubordinateMerchantId`|Texto|36|Sim|Merchantid identificador do subordinado|
|`Locked`|Booleano|---|Sim|Booleano que identifica se o a liquidação será travada para o subordinado ou não|






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
|7|Notificação de chargeback <br/> Para mais detalhes [Chargeback API](https://braspag.github.io//en/manual/chargeback)|

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

## Tabela de MDDs

> Nível de Relevância <br/> 1 - Relevante <br/> 2 - Muito Relevante <br/> 3 - Extremamente Relevante <br/><br/>
> Conforme nível de relevância dos campos e possibilidade de desenho da estratégia de risco de acordo com a necessidade do seu negócio, na validação das transações de testes os mesmos serão cobrados caso não sejam enviaos. Com isso, solicitamos uma análise prévia da documentação e sinalização dos campos que não serão possíveis de serem enviados.<br/><br/>
> No caso de não possuir o dado para enviar, pedimos a gentileza de não enviar o campo correspondente como vazio, ou seja, apenas não enviar.

|ID|Valor|Tipo|Nível de Relevância|Segmento|
|:-|:-|:-|:-:|:-|
|1|Cliente efetuou Login <br/> Se o cliente final logou no site para comprar, enviar: o login dele <br/> Se fez compra como visitante, enviar: Guest <br/> Se a venda foi feita direto por um terceiro, um agente por exemplo, não enviar o campo|string|2|Todos|
|2|Quantidade em dias que o cliente é seu cliente <br/> Ex.: 314|int|3|Todos|
|3|Quantidade de parcelas do pedido|int|3|Todos|
|4|Canal de Venda <br/> Possíveis valores: <br/> Call Center -> compra pelo telefone <br/> Web -> compra pela web <br/> Portal -> um agente fazendo a compra para o cliente <br/> Quiosque -> compras em quiosques <br/> Movel -> compras feitas em celulares ou tablets|string|3|Todos|
|5|Enviar o código do cupom/desconto caso o cliente utilize na compra|string|1|Todos|
|6|Quantidade em dias desde a última compra realizada pelo cliente <br/> Ex.: 55|int|3|Todos|
|7|Código ou nome do seller (vendedor)|string|1|Todos|
|8|Tentativas realizadas pelo cliente de efetuar o pagamento do mesmo pedido, podendo ser com diferentes cartões de créditos e/ou através de outros meios de pagamentos|int|2|Todos|
|9|Identifica se cliente irá retirar o produto na loja <br/> Possíveis valores: SIM ou NAO|string|3|Varejo ou Cosméticos|
|10|Identifica se o pagamento será realizado por outra pessoa que não esteja presente na viagem ou pacote <br/> Possíveis valores: SIM ou NAO|string|3|Aéreo ou Turismo|
|11|Categoria do hotel (quantas estrelas) <br/> Possíveis valores: <br/> 1 -> Simples <br/> 2 -> Econômico <br> 3 -> Turismo <br/> 4 -> Superior <br/> 5 -> Luxo|int|3|Turismo|
|12|Quantidade em dias desde a data da compra até a data do checkin no hotel <br/> Ex.: 123|int|3|Turismo|
|13|Quantidade de diárias no hotel <br/> Ex.: 5|int|3|Turismo|
|14|Categoria da viagem ou pacote <br> Possíveis valores: Nacional ou Internacional ou Nacional/Internacional|string|3|Aéreo ou Turismo|
|15|Nome da companhia áerea / locadora de carro / hotel <br/> Enviar o nome de cada uma das empresas, separado por /|string|2|Aéreo ou Turismo|
|16|Código PNR da reserva <br/> Quando houver uma alteração da reserva para este PNR, com antecipação da data de voo, é importante fazer uma nova análise de fraude enviando este PNR novamente|string|3|Aérea|
|17|Identifica se houve antecipação de reserva <br/> Possíveis valores: SIM ou NAO <br/> Se sim, fundamental o envio também do campo 16 - Código PNR da reserva|string|3|Aéreo|
|18|Categoria do veículo alugado <br/> Possíveis valores: <br/> 1 - Básico <br/> 2 - Esportivo <br/> 3 - Prime <br/> 4 - Utilitário <br/> 5 - Blindado|string|3|Turismo|
|19|Identifica se o pacote refere-se a cruzeiro <br/> Possíveis valores: SIM ou NAO|string|2|Turismo|
|20|Decisão da análise de fraude referente a última compra <br/> Possíveis valores: ACEITA ou REJEITADA|string|3|Todos|
|21|Valor do frete <br/> Ex.: 10599 = r$ 105,99|long|1|Varejo ou Cosméticos|
|22|Código da loja onde o produto será retirado <br/> Este campo deverá ser enviado quando o campo 9 for enviado igual a SIM|string|3|Varejo ou Cosméticos|
|23|Sufixo (4 últimos dígitos) do cartão de crédito|int|1|Todos|
|24|Quantidade de dias desde a primeira compra realizada pelo cliente <br/> Ex.: 150|int|3|Todos|
|25|Sexo do cliente <br/> Possíveis valores: <br/> F -> Feminino <br/> M -> Masculino|string|2|Todos|
|26|Bin (6 primeiros dígitos) do cartão de crédito|int|1|Todos|
|27|Tipo do logradouro do endereço de entrega <br/> Possíveis valores: <br/> R -> Residencial <br/> C -> Comercial|string|2|Todos|
|28|Tempo médio em minutos que o cliente levou para realizar a compra|int|2|Todos|
|29|Quantidade de tentativas que o cliente realizou para efetuar login|int|2|Todos|
|30|Quantidade de páginas web que o cliente visitou anteriormente a compra referente a 30 minutos passados|int|2|Todos|
|31|Quantidade de trocas de números de cartão de crédito que o cliente efetuou para realizar o pagamento do pedido|int|2|Todos|
|32|Identifica se o e-mail foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|3|Todos|
|33|Identifica se o número do cartão de crédito foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|string|3|Todos|
|34|Identifica se o e-mail foi confirmado para ativação de conta <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|35|Identifica o tipo de cliente <br/> Possíveis valores: Local ou Turista|string|2|Turismo|
|36|Identifica se foi utilizado cartão presente (GiftCard) na compra como forma de pagamento <br/> Possíveis valores: SIM ou NAO|string|1|Todos|
|37|Meio de envio do pedido <br/> Possíveis valores: Sedex <br/> Sedex 10 <br/> 1 Dia <br/> 2 Dias <br/> Motoboy <br/> Mesmo Dia <br/>|string|3|Varejo ou Cosméticos|
|38|Número do telefone do cliente identificado através da bina quando venda realizada através do canal de venda igual a Call Center <br/> Formato: DDIDDDNúmero - Ex.: 552121114720|string|3|Todos|
|39|Nome de usuário do Call Center <br/> Este campo deverá ser enviado quando campo 4 for enviado igual a Call Center|string|1|Todos|
|40|Comentários inseridos quando pedido for presente|string|1|Todos|
|41|Tipo do documento <br/> Possíveis valores: CPF ou CNPJ ou Passaporte|string|2|Todos|
|42|Idade do cliente|int|2|Todos|
|43|Faixa de rendimento do cliente <br/> Ex.: 100000 = r$ 1.000,00|long|2|Todos|
|44|Quantidade histórica de compras realizadas pelo cliente|int|3|Todos| 
|45|Identifica se é uma compra realizada por funcionário <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|46|Nome impresso (portador) no cartão de crédito|string|3|Todos|
|47|Identifica se o cartão é private label <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|48|Quantidade de meios de pagamentos utilizados para efetuar a compra|int|2|Todos|
|49|Média das compras realizadas nos últimos 6 meses <br/> Ex.: 159050 = r$ 1.590,99|long|3|Todos|
|50|Fator de desvio de valor da compra atual sobre a média dos últimos 6 meses|3|Todos|
|51|Identifica se é um cliente VIP com tratamento de risco diferenciado ou lista positiva <br/> Possíveis valores: SIM ou NAO|string|3|Todos|
|52|Categoria do produto <br/> Possíveis valores: <br/> Animais e Bichos de Estimação <br/> Roupas e Acessórios <br/> Negócios e Indústria <br/> Câmeras e Óticas <br/> Eletrônicos <br/> Comidas, Bebidas e Cigarro <br/> Móveis <br/> Ferramentas <br/> Saúde e Beleza <br/> Casa e Jardim <br/> Malas e Bagagens <br/> Adulto <br/> Armas e Munição <br/> Materiais de Escritório <br/> Religião e Cerimoniais <br/> Software <br/> Equipamentos de Esporte <br/> Brinquedos e Jogos <br/> Veículos e Peças <br/> Livros <br/> DVDs e Vídeos <br/> Revistas e Jornais <br/> Música <br/> Outras Categorias Não Especificadas|string|2|Todos|
|53|Identifica se existe rotina de confirmação de celular por SMS <br/> Possíveis valores: SIM ou NAO|string|2|Todos|
|54|Qual a 2ª forma de pagamento|string|2|Todos|
|55|Qual a 3ª forma de pagamento|string|2|Todos|
|56|Se 2ª forma de pagamento for cartão de crédito, enviar a bandeira|string|1|Todos|
|57|Se 3ª forma de pagamento for cartão de crédito, enviar a bandeira|string|1|Todos|
|58|Se 2ª forma de pagamento, informar o valor pago <br/> Ex.: 128599 = r$ 1.285,99|long|2|Todos|
|59|Se 3ª forma de pagamento, informar o valor pago <br/> Ex.: 59089 = r$ 590,89|long|2|Todos|
|60|Quantidade em dias desde a data da última alteração <br/> Ex.: 57|int|3|Todos|
|61|Identifica se houve alteração cadastral|string|1|Todos|
|62|Quantidade de pontos trocados na última compra|long|3|Fidelidade|
|63|Quantidade de pontos restantes no saldo|long|2|Fidelidade|
|64|Quantidade de dias desde a última troca de pontos|long|2|Fidelidade|
|65|Identificador do cliente no programa de fidelidade|string|2|Fidelidade|
|66|Quantidade de minutos recarregados nos últimos 30 dias|long|2|Digital Goods|
|67|Quantidade de recargas realizadas nos últimos 30 dias|long|2|Digital Goods|
|68|Quantidade em dias entre a data de partida e a data de retorno|int|2|Aéreo|
|69|Quantidade de passageiros viajando independente da faixa etária|int|2|Aéreo|
|70|Identificador do voô|string|1|Aéreo|
|71|Número de infants viajando|int|2|Aéreo|
|72|Número de crianças viajando|int|2|Aéreo|
|73|Número de adultos viajando|int|2|Aéreo|
|74|Identifica se é um passageiro frequente (Frequently Flyer) <br/> Possíveis valores: SIM ou NAO|string|2|Aéreo|
|75|Identificar do passageiro frequente (Frequently Flyer Number)|string|2|Aéreo|
|76|Categoria do passageiro frequente (Frequently Flyer) <br/> Esta categoria pode variar de acordo com a companhia aérea|int|2|Aéreo|
|77|Dia da semana do embarque <br/> Possíveis valores: Sunday (Domingo) <br/> Monday (Segunda-feira) <br/> Tuesday (Terça-feira) <br/> Wednesday (Quarta-feira) <br/> Thursday (Quinta-feira) <br/> Friday (Sexta-feira) <br/> Saturday (Sábado)|string|2|Aéreo|
|78|Código da companhia aérea <br/> Ex.: JJ ou LA ou AA ou UA ou G3 e etc|string|1|Aéreo|
|79|Classe tarifária da passagem <br/> Ex.: W ou Y ou N e etc|string|2|Aéreo|
|80|Número do celular do passageiro <br/> Ex.: Formato: DDIDDDNúmero - Ex.: 5521976781114|string|2|Aéreo|
|81|Identifica se o dono do cartão de crédito irá viajar <br/> Possíveis valores: SIM ou NAO|string|3|Aéreo|
|82|Identifica se o seller (vendedor) irá trabalhar com revisão manual ou não <br/> Possíveis valores: SIM ou NAO|string|1|Todos|
|83|Segmento de negócio <br/> Ex.: Varejo|string|2|Todos|
|84|Nome da plataforma integrada a API Antifraude Gateway Braspag <br/> Caso seja uma integração direta entre a loja e Braspag, enviar valor igual a PROPRIA|string|3|Todos|
|85 a 89|Campos livres e definidos junto ao provedor de antifraude, conforme as regras de negócio|-|-|-|
|90 a 100|Reservados|-|-|-|

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

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].GiftCategory

|Valor|Descrição|
|:-|:-|
|Yes|Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido|
|No|Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)|
|Off|Diferenças entre os endereços de cobrança e entrega não afetam a pontuação|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].HostHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].NonSensicalHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].ObscenitiesHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].TimeHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].PhoneHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].VelocityHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].Type

|Valor|Descrição|
|:-|:-|
|AdultContent|Conteúdo adulto|
|Coupon|Cupom aplicado para todo o pedido|
|Default|Valor default para o tipo do produto. Quando não enviado nenhum outro valor, assume-se o tipo sendo este|
|EletronicGood|Produto eletônico diferente de software|
|EletronicSoftware|Softwares distribuídos eletronicamente via download|
|GiftCertificate|Vale presente|
|HandlingOnly|Taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda. Ex.: Taxa de conveniência / Taxa de instalação|
|Service|Serviço que será realizado para o cliente|
|ShippingAndHandling|Valor do frete e e taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda|
|ShippingOnly|Valor do frete|
|Subscription|Assinatura. Ex.: Streaming de vídeos / Assinatura de notícias|

## Lista de Valores - Payment.FraudAnalysis.Shipping.ShippingMethod

|Valor|Descrição|
|:-|:-|
|SameDay|Meio de entrega no mesmo dia|
|NextDay|Meio de entrega no próximo dia|
|TwoDay|Meio de entrega em dois dias|
|ThreeDay|Meio de entrega em três dias|
|LowCost|Meio de entrega de baixo custo|
|Pickup|Retirada na loja|
|Other|Outro meio de entrega|
|None|Sem meio de entrega, pois é um serviço ou assinatura|

## Lista de Valores - Payment.FraudAnalysis.Travel.JourneyType

|Valor|Descrição|
|:-|:-|
|OneWayTrip|Viagem somente de ida|
|RoundTrip|Viagem de ida e volta|

## Lista de Valores - Payment.FraudAnalysis.Travel.Passengers[n].Rating

|Valor|Descrição|
|:-|:-|
|Adult|Adulto|
|Child|Criança|
|Infant|Infantil|

## Lista de Valores - Payment.FraudAnalysis.Travel.Passengers[n].Status

|Valor|
|:-|
|Standard|
|Gold|
|Platinum|

## Lista de Valores - Payment.FraudAnalysis.Status

|Valor|Descrição|
|:-|:-|
|Accept|Transação aceita após análise de fraude|
|Review|Transação em revisão após análise de fraude|
|Reject|Transação rejeitada após análise de fraude|
|Pendent|Transação pendente, pois ao enviar a mesma para análise de fraude ocorreu um timeout na resposta entre Braspag e Cybersource|
|Unfinished|Transação não finalizada por algum motivo de validação de contrato ou erro interno|
|ProviderError|Transação com erro no provedor ao ser enviada para análise|

## Lista de Valores - Payment.FraudAnalysis.FraudAnalysisReasonCode

|Valor|Descrição|
|:-|:-|
|100|Operação realizada com sucesso|
|101|A transação enviada para análise de fraude está faltando um ou mais campos necessários <br/> Verificar no response o campo `ProviderAnalysisResult.Missing` <br/> Possível ação: Reenviar a transação com a informação completa|
|102|A transação enviada para análise de fraude possui um ou mais campos com valores inválidos <br/> Verificar no response o campo `ProviderAnalysisResult.Invalid` <br/> Possível ação: Reenviar a transação com as informações corretas|
|150|Erro interno <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|151|A transação foi recebida, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|152|O pedido foi recebido, mas ocorreu time-out <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|202|Transação recusada pois o cartão expirou ou a data de validade não coincide com a correta <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|
|231|Transação recusada pois o cartão é inválido <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|
|234|Problema com a configuração da loja na Cybersource <br/> Possível ação: Entre em contato com o suporte para corrigir o problema de configuração|
|400|A pontuação de fraude ultrapassa o seu limite <br/> Possível ação: Reveja a transação do comprador|
|480|A transação foi marcada como revisão pelo DM (Decision Manager)|
|481|A transação foi rejeitada pelo DM (Decision Manager)|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.AddressInfoCode

|Valor|Descrição
|:-|:-|
|COR-BA|O endereço de cobrança pode ser normalizado|
|COR-SA|O endereço de entrega pode ser normalizado|
|INTL-BA|O país do endereço de cobrança está fora dos EUA|
|INTL-SA|O país do endereço de entrega está fora dos EUA|
|MIL-USA|Endereço militar nos EUA|
|MM-A|Os endereços de cobrança e entrega usam nomes de ruas diferentes|
|MM-BIN|O BIN do cartão (os seis primeiros dígitos do número do cartão) não corresponde ao país|
|MM-C|Os endereços de cobrança e entrega usam cidades diferentes|
|MM-CO|Os endereços de cobrança e entrega usam países diferentes|
|MM-ST|Os endereços de cobrança e entrega usam estados diferentes|
|MM-Z|Os endereços de cobrança e entrega usam códidos postais diferentes|
|UNV-ADDR|O endereço é inverificável|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.FactorCode

|Valor|Descrição|
|:-|:-|
|A|Mudança de endereço excessiva. O comprador mudou o endereço de cobrança duas ou mais vezes nos últimos seis meses|
|B|BIN do cartão ou autorização de risco. Os fatores de risco estão relacionados com BIN de cartão de crédito e/ou verificações de autorização do cartão|
|C|Elevado números de cartões de créditos. O comprador tem usado mais de seis números de cartões de créditos nos últimos seis meses|
|D|Impacto do endereço de e-mail. O comprador usa um provedor de e-mail gratuito ou o endereço de email é arriscado|
|E|Lista positiva. O comprador está na sua lista positiva|
|F|Lista negativa. O número da conta, endereço, endereço de e-mail ou endereço IP para este fim aparece sua lista negativa|
|G|Inconsistências de geolocalização. O domínio do comprador de e-mail, número de telefone, endereço de cobrança, endereço de envio ou endereço IP é suspeito|
|H|Excessivas mudanças de nome. O comprador mudou o nome duas ou mais vezes nos últimos seis meses|
|I|Inconsistências de internet. O endereço IP e de domínio de e-mail não são consistentes com o endereço de cobrança|
|N|Entrada sem sentido. O nome do comprador e os campos de endereço contém palavras sem sentido ou idioma|
|O|Obscenidades. Dados do comprador contém palavras obscenas|
|P|Identidade morphing. Vários valores de um elemento de identidade estão ligados a um valor de um elemento de identidade diferentes. Por exemplo, vários números de telefones estão ligados a um número de conta única|
|Q|Inconsistências do telefone. O número de telefone do comprador é suspeito|
|R|Ordem arriscada. A transação, o comprador e o lojista mostram informações correlacionadas de alto risco|
|T|Cobertura Time. O comprador está a tentar uma compra fora do horário esperado|
|U|Endereço não verificável. O endereço de cobrança ou de entrega não pode ser verificado|
|V|O cartão foi usado muitas vezes nos últimos 15 minutos|
|W|Marcado como suspeito. O endereço de cobrança ou de entrega é semelhante a um endereço previamente marcado como suspeito|
|Y|O endereço, cidade, estado ou país dos endereços de cobrança e entrega não se correlacionam|
|Z|Valor inválido. Como a solicitação contém um valor inesperado, um valor padrão foi substituído. Embora a transação ainda possa ser processada, examinar o pedido com cuidado para detectar anomalias|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.InternetInfoCode

|Valor|Descrição|
|:-|:-|
|FREE-EM|O endereço de e-mail do comprador é de um provedor de e-mail gratuito|
|INTL-IPCO|O país do endereço de e-mail do comprador está fora dos EUA|
|INV-EM|O endereço de e-mail do comprador é inválido|
|MM-EMBCO|O domínio do endereço de e-mail do comprador não é consistente com o país do endereço de cobrança|
|MM-IPBC|O endereço de e-mail do comprador não é consistente com a cidade do endereço de cobrança|
|MM-IPBCO|O endereço de e-mail do comprador não é consistente com o país do endereço de cobrança|
|MM-IPBST|O endereço IP do comprador não é consistente com o estado no endereço de cobrança. No entanto, este código de informação não pode ser devolvido quando a inconsistência é entre estados imediatamente  adjacentes|
|MM-IPEM|O endereço de e-mail do comprador não é consistente com o endereço IP|
|RISK-EM|O domínio do e-mail do comprador (por exemplo, mail.example.com) está associado com alto risco|
|UNV-NID|O endereço IP do comprador é de um proxy anônimo. Estas entidades escondem completamente informações sobre o endereço de IP|
|UNV-RISK|O endereço IP é de origem de risco|
|UNV-EMBCO|O país do endereço de e-mail não corresponde ao país do endereço de cobrança|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.IpRoutingMethod

|Valor|Descrição|
|:-|:-|
|Anonymizer|Endereços de IP estão escondidos porque o comprador é extremamente cauteloso, quer privacidade absoluta ou é fraudulento|
|AOL, AOL dialup, AOL POP and AOL proxy|Membros da AOL. Na maioria dos casos, o país pode ser identificado, mas o estado e cidade não podem|
|Cache proxy|Proxy usado através de um acelerador da Internet ou de uma distribuição de conteúdo de serviço. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|
|Fixed|O endereço de IP está próximo ou no mesmo local que o comprador|
|International proxy|Proxy que contém tráfego de vários países. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|
|Mobile gateway|Gateway para conectar dispositivos móveis à internet. Muitas operadoras, especialmente na Europa, atendem mais do que um país e tráfego ocorre através de hubs de rede centralizados. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP|
|POP|Discagem do comprador em um ISP regional provavelmente perto da localização do endereço de IP, mas possivelmente através de limites geográficos|
|Regional proxy|Proxy que contém tráfego de vários estados dentro de um único país. O comprador pode estar localizado em um estado diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa|
|Satellite|Conexões por satélite. Se o uplink e o downlink estiverem cadastrados, o método roteamento é considerado padrão porque o remetente é conhecido. No entanto, se o downlink não está registrado, o comprador pode estar em qualquer lugar dentro do feixe padrão do satélite, que pode abranger um continente ou mais|
|SuperPOP|O comprador está discando em um ISP multi-estatal ou multinacional que provavelmente não é provável a localização do endereço de IP. O comprador pode estar discando através de limites geográficos|
|No value returned|O tipo de roteamento é desconhecido|
