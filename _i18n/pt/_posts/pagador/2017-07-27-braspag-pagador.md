---
layout: manual
title: Manual de Integração API Rest
description: Integração Técnica Gateway Braspag
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

# Introdução à API do Pagador

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar sua plataforma de e-commerce com a **API do Pagador**, gateway de pagamentos da Braspag, descrevendo os serviços disponíveis com exemplos de requisição e resposta.

Todas as operações requerem credenciais de acesso ("Merchant ID" e "Merchant Key") específicos para os respectivos ambientes: Sandbox e Produção. Para executar uma operação, combine o endpoint base do ambiente com o endpoint da operação desejada e envie a requisição utilizando o VERBO HTTP (ex.: GET, POST, PUT) conforme descrito na operação.

## Ambientes

Utilize o **Ambiente Sandbox** para realizar testes dos nossos produtos e serviços antes de disponibilizar sua solução no **Ambiente de Produção**.

### Ambiente Sandbox

Experimente as nossas APIs sem compromisso!

|Informação|Descrição|
|----|----|
|Credenciais de acesso|Acesse o [Cadastro do Sandbox](https://cadastrosandbox.braspag.com.br/) e crie uma conta de testes. Ao fim do cadastro você receberá um `MerchantId` e um `MerchantKey`, que deverão ser utilizados para autenticar todas as requisições feitas para os endpoints da API.|
|Endpoint transacional|https://apisandbox.braspag.com.br/|
|Endpoint para serviços de consultas|https://apiquerysandbox.braspag.com.br/|

### Ambiente de Produção

Realizados os testes, disponibilize sua solução em ambiente de Produção.

|Informação|Descrição|
|---|---|
|Credenciais de acesso à API|Envie um email para *comercial@braspag.com.br* para mais informações sobre a Braspag e sobre como podemos ajudar no seu negócio.|
|Endpoint transacional|https://api.braspag.com.br/|
|Endpoint para serviços de consultas|https://apiquery.braspag.com.br/|

## Suporte Braspag

<aside class="notice">A Braspag oferece suporte de alta disponibilidade, com atendimento de segunda a sexta, das 9h às 19h, através de telefone de emergência 24 horas por dia e de ferramenta via web. Contamos com equipe que poderá atender em português, inglês e espanhol.</aside>

Acesse nossa ferramenta de atendimento web [Zendesk](http://suporte.braspag.com.br/) e consulte o nosso artigo [Atendimento Braspag](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag) para mais informações sobre nosso serviço de suporte. 

## Características da Solução

A solução API Pagador foi desenvolvida com a tecnologia REST, que é padrão de mercado e independe da tecnologia utilizada por nossos clientes. Desta forma, é possível integrar-se utilizando as mais variadas linguagens de programação, tais como: *ASP, ASP.Net, Java, PHP, Ruby* e *Python*.

Conheça alguns dos atributos que se destacam na plataforma Braspag eCommerce:

* **Ausência de aplicativos proprietários**: não é necessário instalar aplicativos no ambiente da loja virtual em nenhuma hipótese.
* **Simplicidade**: o protocolo utilizado é puramente o HTTPS.
* **Facilidade de testes**: a plataforma Braspag oferece um ambiente Sandbox publicamente acessível, que permite ao desenvolvedor a criação de uma conta de testes sem a necessidade de credenciamento, facilitando e agilizando o início da integração.
* **Credenciais**: o tratamento das credenciais do cliente (número de afiliação e chave de acesso) trafega no cabeçalho da requisição HTTP da mensagem.
* **Segurança**: a troca de informações se dá sempre entre o servidor da loja e o servidor da Braspag, ou seja, sem o browser do comprador.
* **Integração multiplataforma**: a integração é realizada através de APIs REST, que permitem a utilização de diferentes aplicações.

## Arquitetura

O modelo empregado na integração das APIs é simples e se baseia na utilização de duas URLs (endpoints). Uma é específica para operações como autorização, captura e cancelamento de transações. A outra, para operações consultivas, como uma pesquisa de transações. Essas duas URLs recebem as mensagens HTTP através dos métodos GET, POST ou PUT. Cada tipo de mensagem deve ser enviada para um endereço identificado através do *path*, que é o endereço do recurso.

|Método HTTP|Descrição|
|---|---|
|**GET**|Para consultas de recursos já existentes, ex.: consulta de transações.|
|**POST**|Para criação de uma transação.|
|**PUT**|Para atualização de um recurso já existente, ex.: captura ou cancelamento de uma transação previamente autorizada.|

## Termos Transacionais

Para que possa aproveitar melhor todos os recursos disponíveis em nossa API, é importante você antes conhecer os seguintes conceitos envolvidos no processamento de uma transação de cartão de crédito:

|Etapa|Descrição|
|---|---|
|**Autorização**|Operação que viabiliza o processamento de uma venda com um cartão de crédito. A autorização (também chamada pré-autorização) irá sensibilizar o limite do cliente, mas ainda não irá gerar cobrança na fatura para o consumidor.|
|**Captura**|Confirmação necessária para que a cobrança seja efetivada. O tempo limite para capturar uma transação pré-autorizada varia entre adquirentes, mas pode ser de até 5 dias após a data da pré-autorização.|
|**Captura Automática**|Opção que permite que a transação possa ser **autorizada** e **capturada** num mesmo momento, isentando o lojista de enviar a confirmação.|
|**Cancelamento**|Recurso necessário quando, por algum motivo, não se quer mais efetivar uma venda. No caso de uma transação apenas **autorizada**, o cancelamento irá liberar o limite do cartão que foi sensibilizado. Se a transação já tiver sido **capturada**, o cancelamento irá desfazer a venda, mas somente quando executado até às 23:59:59 da data da autorização/captura.|
|**Estorno**|Recurso de cancelamento de compra aplicável quando uma transação criada no dia anterior ou antes já estiver capturada. Neste caso, a transação será submetida ao processo de estorno pela adquirente.|

<aside class="warning">Lembre-se: Uma transação autorizada somente gera o crédito para o lojista depois de capturada.</aside>
<br><br>
Alguns recursos importantes que oferecemos para suas transações estão listados a seguir:

|Termo|Descrição|
|---|---|
|**AntiFraude**|Plataforma de prevenção à fraude que fornece uma análise de risco detalhada das compras on-line. Este processo é totalmente transparente para o portador do cartão. De acordo com os critérios preestabelecidos, o pedido pode ser automaticamente aceito, recusado ou encaminhado para análise manual.|
|**Autenticação**|Processo que possibilita realizar uma venda que passará por autenticação do banco emissor do cartão, trazendo com isso mais segurança para a venda e transferindo para o banco o risco de fraude.|
|**Cartão Protegido**|Plataforma que permite o armazenamento seguro de dados sensíveis de cartão de crédito. Estes dados são transformados em um código criptografrado chamado de *token*, que poderá ser armazenado em banco de dados. Com a plataforma, a loja poderá oferecer recursos como *Compra com 1 clique* e *Retentativa de envio de transação*, sempre preservando a integridade e a confidencialidade das informações.|

# Meios de Pagamento

A API do Pagador trabalha com transações referentes às seguintes formas de pagamento: cartão de crédito, cartão de débito, boleto bancário, transferência eletrônica, e-wallet e voucher.

## Cartão de Crédito e Débito

### Criando uma Transação

Ao requisitar a **autorização** de uma transação de crédito, é necessário seguir o contrato abaixo. Os dados referentes à sua afiliação são enviados no nó `Payment.Credentials`, e devem ser enviados sempre que uma nova requisição de autorização for submetida para aprovação.

Caso a sua loja utilize os serviços de *Retentativa* ou *Loadbalance*, as afiliações devem ser cadastradas pela equipe de suporte ao cliente. Para solicitar o cadastro de afiliações, [clique aqui](https://suporte.braspag.com.br/hc/pt-br/requests/new) e envie sua requisição.

Os parâmetros contidos dentro dos nós `Address` e `DeliveryAddress` são de preenchimento **obrigatório** quando a transação é submetida ao *AntiFraude* ou à análise do *Velocity*. Na tabela de parâmetros, mais abaixo, esses parâmetros aparecem marcados com um * na coluna de obrigatoriedade.

<aside class="warning">Atenção: o número de identificação do pedido (MerchantOrderId) não sofre alteração, se mantendo o mesmo até o final do fluxo transacional. Contudo, um número adicional (SentOrderId) pode ser gerado para o pedido e utilizado durante a transação. Esse número (SentOrderId) só será diferente em caso de adequação a regras da adquirente ou em caso de números de identificação do pedido (MerchantOrderId) repetidos.</aside>

A duplicidade de pedidos em sua loja pode ser evitada através do bloqueio desses pedidos duplicados. Para entender melhor sobre essa feature do Pagador, consulte [este artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360030183991-Bloquear-Pedidos-Duplicados-O-que-%C3%A9-e-como-funciona).

Seguem exemplos de envio de requisição e resposta:

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051001",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity":"12345678909",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "IpAddress":"127.0.0.1",
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
         "Alias":"",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
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
      "IpAddress":"127.0.0.1",
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
         "Alias":"",
         "CardOnFile":{
            "Usage":"Used",
            "Reason":"Unscheduled"
         }
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|GUID|36|Não|
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Sim|
|`Customer.Name`|Nome do comprador.|Texto|255|Sim|
|`Customer.Identity`|Número do CPF ou CNPJ do cliente.|Texto |14 |Não|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ).|Texto|255|Não|
|`Customer.Email`|Email do comprador.|Texto|255|Não|
|`Customer.Birthdate`|Data de nascimento do comprador no formato AAAA-MM-DD.|Date|10|Não|
|`Customer.IpAddress`|Endereço de IP do comprador. Suporte a IPv4 e IPv6.|Texto|45|Não|
|`Customer.Address.Street`|Endereço de contato do comprador.|Texto|255|Não*|
|`Customer.Address.Number`|Número do endereço de contato do comprador.|Texto|15|Não*|
|`Customer.Address.Complement`|Complemento do endereço de contato do comprador.|Texto|50|Não*|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador.|Texto|9|Não*|
|`Customer.Address.City`|Cidade do endereço de contato do comprador.|Texto|50|Não*|
|`Customer.Address.State`|Estado do endereço de contato do comprador.|Texto|2|Não*|
|`Customer.Address.Country`|País do endereço de contato do comprador.|Texto|35|Não*|
|`Customer.Address.District`|Bairro do endereço de contato do comprador.|Texto |50 |Não*|
|`Customer.DeliveryAddress.Street`|Endereço de entrega do comprador.|Texto|255|Não*|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega.|Texto|15|Não*|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega.|Texto|50|Não*|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega.|Texto|9|Não*|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega.|Texto|50|Não*|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega.|Texto|2|Não*|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega.|Texto|35|Não*|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega.|Texto|50|Não*|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "CreditCard".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.ServiceTaxAmount`|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização.|Número|15|Não|
|`Payment.Currency`|Moeda em que o pagamento será feito (BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP).|Texto|3|Não|
|`Payment.Country`|País em que o pagamento será feito.|Texto|3|Não|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.Interest`|Tipo de parcelamento - Loja ("ByMerchant") ou Emissor ("ByIssuer").|Texto|10|Não|
|`Payment.Capture`|Indica se a autorização deve ser com captura automática ("true") ou não ("false"). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|Não (default "false")|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada ("true") ou não ("false"). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|Não (default "false")|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente ("true") ou não ("false"). O valor "true" não originará uma nova recorrência, apenas permitirá a realização de uma transação sem a necessidade de envio do CVV. `Authenticate` deve ser "false" quando `Recurrent` é "true". **Somente para transações Cielo.**|Booleano|---|Não (default "false")|
|`Payment.SoftDescriptor`|Valor que será concatenado com o valor de cadastro na adquirente para identificação na fatura.|Texto|13|Não|
|`Payment.DoSplit`|Indica se a transação será dividida entre várias contas ("true") ou não ("false").|Booleano|---|Não (default "false")|
|`Payment.ExtraDataCollection.Name`|Nome do campo que será gravado como dado extra.|Texto|50|Não|
|`Payment.ExtraDataCollection.Value`|Valor do campo que será gravado como dado extra.|Texto|1024|Não|
|`Payment.Credentials.Code`|Afiliação gerada pela adquirente.|Texto|100|Sim|
|`Payment.Credentials.Key`|Chave de afiliação/token gerado pela adquirente.|Texto|100|Sim|
|`Payment.Credentials.Username`|Usuário gerado no credenciamento com a adquirente **Getnet** (envio obrigatório se a transação é direcionada para Getnet).|Texto|50|Não|
|`Payment.Credentials.Password`|Senha gerada no credenciamento com a adquirente **Getnet** (envio obrigatório se a transação é direcionada para Getnet).|Texto|50|Não|
|`Payment.Credentials.Signature`|Envio do *TerminalID* da adquirente **Global Payments**, ex.: "001". Para **Safra** colocar o nome do estabelecimento, cidade e o estado concatenados com ponto-e-vírgula (;), ex.: "NomedaLoja;São Paulo;SP".|Texto|--|Não|
|`Payment.PaymentFacilitator.EstablishmentCode`|Código do estabelecimento do facilitador. “Facilitator ID” (Cadastro do facilitador com as bandeiras).<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Número|11|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.EstablishmentCode`|Código do estabelecimento do sub-merchant. “Sub-Merchant ID” (Cadastro do subcredenciado com o facilitador).<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Número|15|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.Mcc`|MCC do sub-merchant.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Número|4|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.Address`|Endereço do sub-merchant.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Texto|22|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.City`|Cidade do sub-merchant.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Texto|13|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.State`|Estado do sub-merchant.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Texto|2|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.PostalCode`|Código postal do sub-merchant.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Número|9|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.PhoneNumber`|Número de telefone do sub-merchant.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Número|13|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.Identity`|CNPJ ou CPF do sub-merchant.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Número|14|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.CountryCode`|Código do país do sub-merchant com base no ISO 3166.<br><br>**Aplicável para `Provider` Cielo30 ou Rede2.**|Número|3|Sim para facilitadores|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do portador impresso no cartão.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim|
|`CreditCard.SaveCard`|Identifica se o cartão será salvo para gerar o token (*CardToken*).|Booleano|---|Não (default "false")|
|`CreditCard.Alias`|Nome atribuído pelo lojista ao cartão salvo como *CardToken*.|Texto|64|Não|
|`CreditCard.CardOnFile.Usage`|"First" se o cartão foi armazenado e é seu primeiro uso.<br>"Used" se o cartão foi armazenado e já utilizado em outra transação.<br><br>**Aplicável somente para `Provider` Cielo30.**|Texto|-|Não|
|`CreditCard.CardOnFile.Reason`|Indica o propósito de armazenamento de cartões, caso o campo `Usage` seja "Used".<br>"Recurring" - Compra recorrente programada, ex.: assinaturas.<br>"Unscheduled" - Compra recorrente sem agendamento, ex.: aplicativos de serviços.<br>"Installments" - Parcelamento através da recorrência.<br><br>**Aplicável somente para `Provider` Cielo30.**|Texto|-|Condicional|

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
            "Alias": "",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
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
            "Alias": "",
         "CardOnFile":{
            "Usage": "Used",
            "Reason":"Unscheduled"
         }
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
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`CapturedDate`|Data em que a transação foi capturada.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`CapturedAmount`|Valor capturado, sem pontuação.|Número|15|100 equivale a R$ 1,00|
|`ECI`|*Electronic Commerce Indicator*. Representa o resultado da autenticação.|Texto|2|Ex.: 5|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Transação Aprovada|

### Capturando uma Transação

Quando uma transação é submetida com o parâmetro `Payment.Capture` igual a "false", é necessário que seja feita, posteriormente, uma solicitação de captura para confirmar a transação.

Transações que não são capturadas até a [data limite](https://suporte.braspag.com.br/hc/pt-br/articles/360028661812-Prazos-de-captura-e-estorno) são automaticamente desfeitas pelas adquirentes. Clientes podem ter negociações específicas com as adquirentes para que alterem esse prazo limite de captura.

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
|`MerchantId`|Identificador da loja na API. | GUID | 36 | Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API. | Texto | 40 | Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`PaymentId`|Campo identificador do pedido. | GUID | 36 | Sim|
|`Amount`|Valor a ser capturado, em centavos. Verificar se a adquirente utilizada suporta uma captura parcial. | Número | 15 | Não|
|`ServiceTaxAmount`|Aplicável para companhias aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização. | Número | 15 | Não|

#### Resposta

```json

{
    "Status": 2,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
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
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
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
|`Status`|Status da transação. | Byte | 2 | Ex.: 1 |
|`ReasonCode`|Código de retorno da adquirente. | Texto | 32 | Texto alfanumérico |
|`ReasonMessage`|Mensagem de retorno da adquirente. | Texto | 512 | Texto alfanumérico |

### Transação com Autenticação

Com o processo de autenticação, é possível fazer uma análise de risco considerando uma quantidade maior de dados do usuário e do vendedor, auxiliando assim no processo de validação da compra online.

Através do Pagador, quando uma transação é submetida ao processo de autenticação, o portador será redirecionado ao ambiente do emissor (banco), onde deverá realizar a confirmação de seus dados. Quando validado corretamente, o risco de *chargeback* (contestação de compra efetuada por cartão de crédito ou débito) da transação passa a ser do emissor; ou seja, a loja não receberá contestações.

No ambiente mobile, indicamos a utilização da versão [3DS 2.0](https://braspag.github.io//manualp/emv3ds) para autenticação.

<aside class="warning">Importante: o 3DS 1.0 não funciona em ambiente mobile.</aside>

Existem duas maneiras de autenticar transações na Braspag:

* **Padrão** - quando o lojista não possui uma conexão direta com um autenticador (MPI)
* **Externa** - quando o lojista possui um autenticador próprio (MPI)

#### Autenticação Padrão

Na autenticação padrão, o lojista que não possui uma conexão direta com um autenticador (MPI) conta com que o meio de pagamento redirecione o cliente para o ambiente de autenticação.

##### Requisição

O parâmetro `Payment.Authenticate` deverá ser enviado como "true", como no exemplo abaixo:

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
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.Authenticate`|Define se o comprador será direcionado ao banco emissor para autenticação do cartão. Para transações autenticadas, neste campo, deve-se enviar o valor "true". Obs.: Deve ser verificada junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|Não (default "false")|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim da autenticação.|Texto|1024|Sim (quando `Authenticate` é "true")|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim|

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
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|Ex.: 57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Ex.: Transação Aprovada|
|`AuthenticationUrl`|URL para o qual o portador será redirecionado para autenticação.|Texto|256|https://qasecommerce.cielo.com.br/web/index.cbmp?id=5f177203bf524c78982ad28f7ece5f08|

#### Autenticação Externa

Na autenticação externa, o lojista que possui um autenticador próprio (MPI) não precisa que o meio de pagamento redirecione seu consumidor para o ambiente de autenticação.

##### Requisição

Adicione o nó `Payment.ExternalAuthentication` ao contrato padrão, conforme exemplo. Este fluxo é suportado pelas adquirentes **Cielo**, **Global Payments** e **Banorte**.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.ExternalAuthentication.Cavv`|Valor retornado pelo mecanismo de autenticação externa.|Texto | - |Sim|
|`Payment.ExternalAuthentication.Xid`|Valor retornado pelo mecanismo de autenticação externa.|Texto| - |Sim|
|`Payment.ExternalAuthentication.Eci`|Valor retornado pelo mecanismo de autenticação externa.|Número|1|Sim|

##### Resposta

Uma transação com autenticação externa receberá, além do retorno padrão da transação de autorização, o nó `Payment.ExternalAuthentication` com as mesmas informações enviadas na requisição.

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
|`Payment.ExternalAuthentication.Cavv`|Valor Cavv submetido na requisição de autorização.|Texto| - |
|`Payment.ExternalAuthentication.Xid`|Valor Xid submetido na requisição de autorização.|Texto| - |
|`Payment.ExternalAuthentication.Eci`|Valor ECI submetido na requisição de autorização.|Número|1|

### Transação com Cartão de Débito

Uma transação com cartão de débito se efetua de forma semelhante à com cartão de crédito. É obrigatório, porém, submetê-la ao processo de autenticação.

#### Requisição

```json

{  
   [...]
   },
     "Payment": {
        "Provider":"Simulado",
        "Type":"DebitCard",
        "Amount": 10000,
        "Currency":"BRL",
        "Country":"BRA",
        "Installments": 1,
        "Interest":"ByMerchant",
        "Capture": true,
        "Authenticate": true,
        "Recurrent": false,
        "SoftDescriptor":"Mensagem",
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento. Obs.: Atualmente somente a **Cielo** suporta esta forma de pagamento via Pagador.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "DebitCard".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim do pagamento.|Texto |1024|Sim|
|`DebitCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`DebitCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`DebitCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`DebitCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`DebitCard.Brand`|Bandeira do cartão.|Texto|10|Sim|

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
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|Ex.: 57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Ex.: Transação Aprovada|
|`AuthenticationUrl`|URL para o qual o portador será redirecionado para autenticação.|Texto |56 |https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f|

### Transação com "Coronavoucher"

O auxílio emergencial disponibilizado pelo governo pode ser consumido através do Cartão de Débito Virtual da Caixa Econômica Federal. Desta forma, a requisição deverá ser do tipo Cartão de Débito, porém **sem autenticação**, conforme o exemplo abaixo. 

#### Requisição

```json

{  
   [...]
   },
     "Payment": {
        "Provider": "Cielo30",
        "Type": "DebitCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Capture": true,
        "Authenticate": false,
        "DebitCard":{
         "CardNumber":"5067220000000001",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Elo"
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
        "Provider": "Cielo30",
        "Type": "DebitCard",
        "Amount": 10000,
        "Currency": "BRL",
        "Country": "BRA",
        "Installments": 1,
        "Capture": true,
        "Authenticate": false,
        "DebitCard":{
         "CardNumber":"5067220000000001",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Elo"
        },
        [...]
    }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento. Obs.: Atualmente, somente a **Cielo30** suporta esta forma de pagamento via Pagador.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "DebitCard".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas. Fixo "1" para o cartão de débito.|Número|2|Sim|
|`DebitCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`DebitCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`DebitCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`DebitCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`DebitCard.Brand`|Bandeira do cartão. Para este tipo de transação, sempre "Elo".|Texto|10|Sim|

#### Resposta

```json

{
 [...]
  "Payment": {
    "DebitCard": {
      "CardNumber": "506722******0001",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Elo"
    },
    "AcquirerTransactionId": "10069930690009D366FA",
    "PaymentId": "21423fa4-6bcf-448a-97e0-e683fa2581ba",
    "Type": "DebitCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:19:58",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo30",
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
    "DebitCard": {
      "CardNumber": "506722******0001",
      "Holder": "Nome do Portador",
      "ExpirationDate": "12/2021",
      "SaveCard": false,
      "Brand": "Elo"
    },
    "AcquirerTransactionId": "10069930690009D366FA",
    "PaymentId": "21423fa4-6bcf-448a-97e0-e683fa2581ba",
    "Type": "DebitCard",
    "Amount": 10000,
    "ReceivedDate": "2017-05-11 15:19:58",
    "Currency": "BRL",
    "Country": "BRA",
    "Provider": "Cielo30",
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "Status": 2,
    "ProviderReturnCode": "6",
    "ProviderReturnMessage": "Operation Successful",
    [...]
  }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|Ex.: 57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Ex.: Transação Aprovada|

### Transação com QR Code

Para criar uma transação com QR code é necessário enviar uma requisição utilizando o método POST conforme o exemplo abaixo. Essa requisição irá criar a transação, que ficará com o status *Pendente* na Braspag, e gerar o QR code para realizar o pagamento. Usando um dos aplicativos compatíveis, o comprador efetua o pagamento e a transação muda de status (ex.: *Pago*, *Não pago* ou *Não autorizado*).

O exemplo abaixo contempla o mínimo de campos necessários a serem enviados para a autorização:

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{  
 "MerchantOrderId":"20191123",
 "Customer":{  
  "Name":"QRCode Test"
  },
 "Payment":{
   "Provider":"Cielo30",
   "Type":"qrcode",
   "Amount":100,
   "Installments":1,
   "Capture":false
   }
}

```

```shell

--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
 "MerchantOrderId":"20191023",
 "Customer":{  
  "Name":"QRCode Test"
  },
 "Payment":{
   "Provider":"Cielo30",
   "Type":"qrcode",
   "Amount":500,
   "Installments":1,
   "Capture":false
   }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Sim|
|`Customer.Name`|Nome do comprador.|Texto|255|Não|
|`Payment.Provider`|Nome da provedora do meio de pagamento. Obs.: Atualmente somente disponível para **Cielo30**.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "qrcode".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido (maior que zero), em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.Capture`|Enviar "true" para uma transação de captura automática.|Booleano|-|Não|

#### Resposta

```json

{
 "MerchantOrderId":"20191023",
 "Customer": {
  "Name": "QRCode Test"
 },
 "Payment": {
  "Installments": 1,
  "Capture": false,
  "AcquirerTransactionId": "52d641fb-2880-4024-89f4-7b452dc5d9cd",
  "QrCodeBase64Image": "iVBORw0KGgoAAAA(...)",
  "PaymentId": "403dba6-23e3-468b-92f8-f9af56d3b9d7",
  "Type": "QrCode",
  "Amount": 100,
  "ReceivedDate": "2019-10-23 21:30:00",
  "Currency": "BRL",
  "Country": "BRA",
  "Provider": "Cielo30",
  "ReasonCode": 0,
  "ReasonMessage": "Successful",
  "Status": 12,
  "ProviderReturnCode": "0",
  "ProviderReturnMessage": "QRCode gerado com sucesso",
  "Links": [
   {
    "Method": "GET",
    "Rel": "self",
    "Href": "http://apiquerysandbox.braspag.com.br/v2/sales/4031dba6-23e3-468b-92f8-f9af56d3b9d7"
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
 "MerchantOrderId":"20191023",
 "Customer": {
  "Name": "QRCode Test"
 },
 "Payment": {
  "Installments": 1,
  "Capture": false,
  "AcquirerTransactionId": "52d641fb-2880-4024-89f4-7b452dc5d9cd",
  "QrCodeBase64Image": "iVBORw0KGgoAAAA(...)",
  "PaymentId": "403dba6-23e3-468b-92f8-f9af56d3b9d7",
  "Type": "QrCode",
  "Amount": 100,
  "ReceivedDate": "2019-10-23 21:30:00",
  "Currency": "BRL",
  "Country": "BRA",
  "Provider": "Cielo30",
  "ReasonCode": 0,
  "ReasonMessage": "Successful",
  "Status": 12,
  "ProviderReturnCode": "0",
  "ProviderReturnMessage": "QRCode gerado com sucesso",
  "Links": [
   {
    "Method": "GET",
    "Rel": "self",
    "Href": "http://apiquerysandbox.braspag.com.br/v2/sales/4031dba6-23e3-468b-92f8-f9af56d3b9d7"
   }
  ]
 }
}

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`QrCodeBase64Image`|QR code codificado em base 64. A imagem do QR code poderá ser apresentada na página utilizando um código HTML como este:<br><br> &lt;img src="data:image/png;base64,{código da imagem em base 64}"&gt;.|Texto|Variável|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido. Necessário para operações como consulta, captura e cancelamento.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Status da transação. No caso da transação de geração com QR code, o status inicial é "12" (*Pendente*).|Byte|-|2|
|`ReturnCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`ReturnMessage`|Mensagem de retorno da adquirência.|Texto|512|Texto alfanumérico|

### Cancelando/Estornando uma Transação

Para cancelar uma transação de cartão de crédito, é necessário o envio de mensagem HTTP através do método PUT para o recurso *Payment*, conforme o exemplo.

Cada adquirente tem seus prazos limites para permitir o estorno de uma transação. [Neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360028661812-Prazos-de-captura-e-estorno) você poderá conferir cada um deles.

A disponibilidade do serviço de estorno varia de adquirente para adquirente.

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API. |Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.| GUID | 36 |Não|
|`PaymentId`|Campo identificador do pedido.|GUID |36 |Sim|
|`Amount`|Valor, em centavos, a ser cancelado/estornado. Obs.: Verifique se a adquirente contratada suporta a operação de cancelamento ou estorno.|Número |15 |Não|

#### Resposta

```json

{
    "Status": 10,
    "ReasonCode": 0,
    "ReasonMessage": "Successful",
    "ProviderReturnCode": "9",
    "ProviderReturnMessage": "Operation Successful",
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
    "ProviderReturnCode": "9",
    "ProviderReturnMessage": "Operation Successful",
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
|`Status`|Status da transação. |Byte | 2 | Ex.: 1 |
|`ReasonCode`|Código de retorno da adquirência. |Texto |32 |Texto alfanumérico
|`ReasonMessage`|Mensagem de retorno da adquirência. |Texto |512 |Texto alfanumérico

### Transação com Velocity Check

O *Velocity Check* é uma ferramenta de combate a fraudes massivas, que disparam rajadas de transações com dados de pagamento repetidos. A ferramenta analisa a frequência de elementos de rastreabilidade, tais como Número do Cartão, CPF, CEP de entrega, entre outros, bloqueando transações suspeitas.

A funcionalidade deve ser contratada à parte, e posteriormente habilitada em sua loja via painel. Quando o Velocity está ativo, a resposta da transação traz o nó `Velocity` com os detalhes da análise.

No caso da rejeição pela regra de Velocity, o *ProviderReasonCode* será "BP 171 - Rejected by fraud risk" (Velocity, com "ReasonCode 16 - AbortedByFraud").

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

|Propriedade|Descrição|Tipo|Tamanho|
|-----------|---------|----|-------|
|`VelocityAnalysis.Id`|Identificador da análise efetuada.|GUID|36|
|`VelocityAnalysis.ResultMessage`|"Accept" ou "Reject".|Texto|25|
|`VelocityAnalysis.Score`|100|Número|10|
|`VelocityAnalysis.RejectReasons.RuleId`|Código da regra que rejeitou.|Número|10|
|`VelocityAnalysis.RejectReasons.Message`|Descrição da regra que rejeitou.|Texto|512|

## Boletos

### Boleto Registrado

Com o objetivo de promover maior controle e segurança ao transacional de boletos no e-commerce e garantir mais confiabilidade e comodidade aos usuários, a Febraban em conjunto com os bancos lançou a **Nova Plataforma de Cobrança**.

A partir de 21 de julho de 2018 todos os boletos emitidos no e-commerce, obrigatoriamente, terão de ser registrados. [Clique aqui](https://portal.febraban.org.br/pagina/3150/1094/pt-br/servicos-novo-plataforma-boletos) para acessar o comunicado completo.   

Abaixo seguem os procedimentos de migração/filiação de cada banco:

* [Bradesco](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/24157160-4da2-46d4-a119-60d8f614a842/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Bradesco.pdf)
* [Banco do Brasil](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/0f4644c6-da10-42ab-b647-09786d5db5cb/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Banco_do_Brasil.pdf)
* [Itaú](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/de2e95e8-441a-4fa2-be01-9b89463477d0/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Ita%C3%BA_v1.1.pdf)
* [Santander](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/a8661c34-6341-466a-86cf-078fb5e19626/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Santander.pdf)
* [Caixa Econômica](https://gallery.mailchimp.com/365fc3ca5e4f598460f07ecaa/files/fee80b87-2b37-4f19-b293-bb43389025de/Procedimento_de_Migra%C3%A7%C3%A3o_Boleto_Registrado_Caixa_v1.1.pdf)

### Criando uma Transação de Boleto

Para gerar um boleto, inclusive em ambiente Sandbox, é necessário fornecer dados do comprador como CPF ou CNPJ e endereço. Abaixo temos um exemplo de como criar um pedido com este meio de pagamento.

Os parâmetros `Payment.FineRate` e `Payment.FineAmount` não devem ser utilizados em conjunto. A mesma regra se aplica aos parâmetros `Payment.InterestRate` e `Payment.InterestAmount`. Esses parâmetros, apresentados na tabela mais abaixo, estão marcados com um * na coluna de obrigatoriedade.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|GUID|36|Não|
|`MerchantOrderId`|Número de identificação do pedido. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Name`|Nome do comprador. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do cliente.|Texto |14 |Sim|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ).|Texto|255|Sim|
|`Customer.Address.Street`|Endereço de contato do comprador. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Address.Number`|Número do endereço de contato do comprador. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Address.Complement`|Complemento do endereço de contato do comprador. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Não|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador.|Texto|8|Sim|
|`Customer.Address.District`|Bairro do endereço de contato do comprador. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim
|`Customer.Address.City`|Cidade do endereço de contato do comprador. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Address.State`|Estado do endereço de contato do comprador.|Texto|2|Sim|
|`Customer.Address.Country`|País do endereço de contato do comprador.|Texto|35|Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento do boleto. [Clique aqui](#providers-para-consulta-bin-via-verifycard) para acessar a lista de provedoras.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "Boleto".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.BoletoNumber`|Número do boleto ("Nosso Número"). Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto |Veja a [tabela](#conciliação-de-boletos)|Não|
|`Payment.Assignor`|Nome do cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento.|Texto |200|Não|
|`Payment.Demonstrative`|Texto de demonstrativo. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o Provider utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto |Veja a [tabela](#conciliação-de-boletos)|Não|
|`Payment.ExpirationDate`|Data de vencimento do boleto. Caso não esteja previamente cadastrado no meio de pagamento, o envio deste campo é obrigatório. Se enviado na requisição, sobrepõe o valor configurado no meio de pagamento.|Date |AAAA-MM-DD|Não|
|`Payment.Identification`|CNPJ do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento.|Texto |14 |Não|
|`Payment.Instructions`|Instruções do boleto. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o `Provider` utilizado (consulte a [tabela](#conciliação-de-boletos)). Para quebra de linhas no texto utilize sempre a notação em HTML `<br>`.|Texto |Veja a [tabela](#conciliação-de-boletos)|Não|
|`Payment.NullifyDays`|Prazo para baixa automática do boleto. O cancelamento automático do boleto acontecerá após o número de dias estabelecido neste campo, contado a partir da data de vencimento. Ex.: um boleto com vencimento para 15/12 que tenha em seu registro o prazo para baixa de 5 dias, poderá ser pago até 20/12; após esta data o título é cancelado. Obs.: Recurso válido somente para boletos registrados do Banco Santander.|Número |2 |Não|
|`Payment.DaysToFine`|Opcional e somente para `Provider` Bradesco2. Quantidade de dias após o vencimento para cobrar o valor da multa, em número inteiro. Ex.: 3.|Número |15 |Não|
|`Payment.FineRate`|Opcional e somente para `Provider` Bradesco2. Valor da multa após o vencimento, em percentual, com base no valor do boleto (%). Permitido decimal com até 5 casas decimais. Não utilizar em conjunto com `FineAmount`. Ex: 10.12345 = 10.12345%.|Número |15 |Não*|
|`Payment.FineAmount`|Opcional e somente para `Provider` Bradesco2. Valor da multa após o vencimento em valor absoluto em centavos. Não utilizar em conjunto com `FineRate`. Ex.: 1000 = R$ 10,00.|Número |15 |Não*|
|`Payment.DaysToInterest`|Opcional e somente para `Provider` Bradesco2. Quantidade de dias após o vencimento para início da cobrança de juros por dia sobre o valor do boleto, em número inteiro. Ex.: 3.|Número |15 |Não|
|`Payment.InterestRate`|Opcional e somente para `Provider` Bradesco2. Valor de juros mensal após o vencimento em percentual, com base no valor do boleto (%). O valor de juros é cobrado proporcionalmente por dia (mensal dividido por 30). Permitido decimal com até 5 casas decimais. Não utilizar em conjunto com `InterestAmount`. Ex.: 10.12345.|Número |15 |Não*|
|`Payment.InterestAmount`|Opcional e somente para `Provider` Bradesco2. Valor absoluto de juros diários após o vencimento, em centavos. Não utilizar em conjunto com `InterestRate`. Ex.: 1000 = R$ 10,00.|Número |15 |Não*|

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
|`PaymentId`|Campo Identificador do Pedido. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`ExpirationDate`|Data de expiração. |Texto |10 |2014-12-25 |
|`Url`|URL do boleto gerado. |string |256 |https://.../pagador/reenvia.asp/8464a692-b4bd-41e7-8003-1611a2b8ef2d |
|`BoletoNumber`|"NossoNumero" gerado. |Texto|50 |2017091101 |
|`BarCodeNumber`|Representação numérica do código de barras. |Texto |44 |00091628800000157000494250100000001200656560 |
|`DigitableLine`|Linha digitável. |Texto |256 |00090.49420 50100.000004 12006.565605 1 62880000015700 |
|`Address`|Endereço da loja cadastrada no banco. |Texto |256 |Ex.: Av. Teste, 160 |
|`Status`|Status da transação. |Byte | 2 | Ex.: 1 |

### Conciliação de Boletos

Para atualizar o status de um boleto para *Pago*, o Pagador deve receber dos bancos os arquivos CNAB com as liquidações referentes. Para habilitar sua loja a receber os arquivos bancários, basta seguir o procedimento descrito [neste link](https://suporte.braspag.com.br/hc/pt-br/articles/360007068352-Como-funciona-a-Concilia%C3%A7%C3%A3o-via-Nexxera-).

### Regras Específicas por Banco

Segue uma lista de propriedades e suas especificações, relativas a regras distintas de cada banco e seus respectivos *providers*:

| Propriedade | Bradesco | Banco do Brasil | Itaú Shopline | Santander | Caixa Econômica | Citibank |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `Provider` | Bradesco2 | BancoDoBrasil2 | ItauShopline | Santander2 | Caixa2 | Citibank2 |
| `MerchantOrderId` | 27 (`*1`)| 50 | 8 | 50 | 11 (`*2`) | 10 (`*2`) |
| `Payment.BoletoNumber` | 11 (`*3`) | 9 (`*4`) | 8 (`*5`) | 13 (`*3`) | 12 (`*6`) | 11 (`*7`) |
| `Customer.Name` | 34 | 60 (`*8`) | 30 | 40 | 40 | 50 (`*9`) |
| `Customer.Address.Street`;<br>`Customer.Address.Number`;<br>`Customer.Address.Complement`;<br>`Customer.Address.District` | Street: 70<br><br>Number: 10<br><br>Complement: 20<br><br>District: 50 | Totalizar até 60 caracteres (`*8`) | Street, Number e Complement devem totalizar até 40 caracteres<br><br>District: 15 | Street, Number e Complement devem totalizar até 40 caracteres<br><br>District: 15 | Street, Number e Complement devem totalizar até 40 caracteres<br><br>District: 15 | Street, Number e Complement devem totalizar até 40 caracteres<br><br>District: 50 (`*9`) |
| `Customer.Address.City` | 50 | 18 (`*8`) | 15 | 30 | 15 | 50 (`*9`) |
| `Payment.Instructions` | 450 | 450 | N/A | 450 | 450 | 450 |
| `Payment.Demonstrative` | 255 | N/A | N/A | 255 | 255 | 255 |

|Observações|Detalhes|
|---|---|
|`*1`|Apenas letras, números e caracteres como "\_" e "$".|
|`*2`|Caso passe dos 11 dígitos, a API gerará um número incremental a partir da configuração definida. |
|`*3`|O valor deve ser único, ou seja, o banco não permite a repetição de valores previamente utilizados. |
|`*4`|Quando enviado acima de 9 posições, a API considera os últimos 9 dígitos. |
|`*5`|Deverá ser sempre igual ao número de pedido (`MerchantOrderId`). |
|`*6`|A API concatena automaticamente o valor “14” + 12 dígitos livres + dígito verificador, antes de mandar para o banco. Caso o total ultrapasse os 14 dígitos, a API considera os últimos 14 dígitos. |
|`*7`|Quando enviado mais que o permitido, a API gera um número aleatório. |
|`*8`|São aceitos como caracteres válidos: números, letras de A a Z (MAIÚSCULAS) e caracteres especiais de conjunção (hífen "-" e apóstrofo "‘"). Quando utilizados, não pode haver espaços entre as letras. Exemplos corretos: D’EL-REI / D’ALCORTIVO / SANT’ANA. Exemplos incorretos: D’EL - REI / um espaço em branco entre palavras.|
|`*9`|Caracteres especiais e acentuações são removidos automaticamente. |

## Recorrência

Diferente dos pagamentos com cartão de crédito ou boleto tradicionais, os pagamentos recorrentes se repetem automaticamente por períodos e em intervalos determinados, cobrando sempre o mesmo valor de um mesmo cartão ou conta.

É muito utilizado para assinaturas de revistas, mensalidades, licenças de software, entre outros. Além da integração técnica, é necessário que o estabelecimento comercial do cliente esteja habilitado na adquirente para receber pagamentos recorrentes.

O lojista conta com recursos diferenciados para modelar sua cobrança de acordo com o seu negócio, tais como: parametrização e alteração de periodicidade, data de início e fim, quantidade de tentativas e intervalo entre elas, entre outros recursos.

Vendas recorrentes com cartão de crédito não exigem CVV.

### Autorizar uma Transação Recorrente

Adicione o nó `RecurrentPayment` ao nó `Payment` para agendar as recorrências futuras ao autorizar uma transação pela primeira vez na série de recorrências.

Os parâmetros `Payment.RecurrentPayment.Interval` e `Payment.RecurrentPayment.DailyInterval`, marcados com um * na coluna de obrigatoriedade, não devem ser utilizados em conjunto.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência. Não utilizar em conjunto com `DailyInterval`.<br><br>Monthly (default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não*|
|`Payment.RecurrentPayment.DailyInterval`|Padrão da recorrência em dias. Não utilizar em conjunto com `Interval`.|Número|2|Não*|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

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
|`RecurrentPaymentId`|ID que representa a recorrência, utilizada para consultas e alterações futuras. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data de quando acontecerá a próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |"true" ou "false" |

### Autorizar uma Transação Recorrente com Boleto Bancário

O pedido de requisição de uma transação recorrente com boleto bancário é o mesmo da criação de um boleto tradicional. Adicione o nó `RecurrentPayment` ao nó `Payment` para agendar as recorrências futuras ao autorizar uma transação pela primeira vez na série de recorrências.

A data de vencimento dos boletos recorrentes será criada baseando-se na data do próximo pedido recorrente adicionado do valor que estiver configurado no meio de pagamento na Braspag.

Ex.: Dia da próxima cobrança: 01/01/2021 + 5 dias. Vencimento do boleto criado automaticamente: 06/01/2021.

Entre em contato com o [time de suporte](https://suporte.braspag.com.br/hc/pt-br/requests/new) para definir em quantos dias você quer que seus boletos gerados via recorrência vençam.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json

{
    [...]
        "Payment": {
        "Provider": "Simulado",
        "Type": "Boleto",
        "Amount": 1000,
     
        "Instructions": "Aceitar somente até a data de vencimento.",
        "RecurrentPayment": {
            "AuthorizeNow": "true",
            "StartDate": "2020-01-01",
            "EndDate": "2020-12-31",
            "Interval": "Monthly"
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
        "Provider": "Simulado",
        "Type": "Boleto",
        "Amount": 1000,
     
        "Instructions": "Aceitar somente até a data de vencimento.",
        "RecurrentPayment": {
            "AuthorizeNow": "true",
            "StartDate": "2020-01-01",
            "EndDate": "2020-12-31",
            "Interval": "Monthly"
        }
    }
}
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.RecurrentPayment.StartDate`|Data para início da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência.<br>Monthly (Default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|

#### Resposta

```json

{
    "MerchantOrderId": "teste001",
    "Customer": {
        "Name": "Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "06455914",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BRA",
            "District": "Alphaville"
        }
    },
    "Payment": {
        "Instructions": "Aceitar somente até a data de vencimento.",
        "ExpirationDate": "2020-08-15",
        "Url": "https://transactionsandbox.pagador.com.br/post/pagador/reenvia.asp/58e4bde3-1abc-4aef-a58a-741f4c53940d",
        "BoletoNumber": "100031-0",
        "BarCodeNumber": "00096834800000129001234270000010003105678900",
        "DigitableLine": "00091.23423 40000.010004 31056.789008 6 83480000012900",
        "Address": "N/A, 1",
        "IsRecurring": false,
        "PaymentId": "58e4bde3-1abc-4aef-a58a-741f4c53940d",
        "Type": "Boleto",
        "Amount": 1000,
        "ReceivedDate": "2020-01-01 00:00:01",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 1,
        "RecurrentPayment": {
            "RecurrentPaymentId": "a08a622b-71f2-4553-9345-5f3c4fbbacb0",
            "ReasonCode": 0,
            "ReasonMessage": "Successful",
            "NextRecurrency": "2020-02-01",
            "StartDate": "2020-01-01",
            "EndDate": "2020-12-31",
            "Interval": "Monthly",
            "Link": {
                "Method": "GET",
                "Rel": "recurrentPayment",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/a08a622b-71f2-4553-9345-5f3c4fbbacb0"
            },
            "AuthorizeNow": true
        },
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/58e4bde3-1abc-4aef-a58a-741f4c53940d"
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
    "MerchantOrderId": "teste001",
    "Customer": {
        "Name": "Nome do Comprador",
        "Identity": "12345678909",
        "IdentityType": "CPF",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "06455914",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BRA",
            "District": "Alphaville"
        }
    },
    "Payment": {
        "Instructions": "Aceitar somente até a data de vencimento.",
        "ExpirationDate": "2020-08-15",
        "Url": "https://transactionsandbox.pagador.com.br/post/pagador/reenvia.asp/58e4bde3-1abc-4aef-a58a-741f4c53940d",
        "BoletoNumber": "100031-0",
        "BarCodeNumber": "00096834800000129001234270000010003105678900",
        "DigitableLine": "00091.23423 40000.010004 31056.789008 6 83480000012900",
        "Address": "N/A, 1",
        "IsRecurring": false,
        "PaymentId": "58e4bde3-1abc-4aef-a58a-741f4c53940d",
        "Type": "Boleto",
        "Amount": 1000,
        "ReceivedDate": "2020-01-01 00:00:01",
        "Currency": "BRL",
        "Country": "BRA",
        "Provider": "Simulado",
        "ReasonCode": 0,
        "ReasonMessage": "Successful",
        "Status": 1,
        "RecurrentPayment": {
            "RecurrentPaymentId": "a08a622b-71f2-4553-9345-5f3c4fbbacb0",
            "ReasonCode": 0,
            "ReasonMessage": "Successful",
            "NextRecurrency": "2020-02-01",
            "StartDate": "2020-01-01",
            "EndDate": "2020-12-31",
            "Interval": "Monthly",
            "Link": {
                "Method": "GET",
                "Rel": "recurrentPayment",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/a08a622b-71f2-4553-9345-5f3c4fbbacb0"
            },
            "AuthorizeNow": true
        },
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/58e4bde3-1abc-4aef-a58a-741f4c53940d"
            }
        ]
    }
}
--verbose

```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`RecurrentPaymentId`|Campo identificador da próxima recorrência. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data da próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`StartDate`|Data do início da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |<br>Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |true ou false |

### Agendamento de uma Recorrência

Diferente da recorrência anterior, este exemplo não autoriza imediatamente, mas agenda uma autorização futura.

Para programar a primeira transação da série de recorrências, passe o parâmetro `Payment.RecurrentPayment.AuthorizeNow` como "false" e adicione o parâmetro `Payment.RecurrentPayment.StartDate`.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.RecurrentPayment.StartDate`|Data para início da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência.<br>Monthly (Default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

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
|`RecurrentPaymentId`|Campo identificador da próxima recorrência. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data da próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`StartDate`|Data do início da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |<br>Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |true ou false |

### Alterar Dados do Comprador

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|
|`Customer.Name`|Nome do comprador. |Texto |255|Sim|
|`Customer.Email`|Email do comprador. |Texto |255|Não|
|`Customer.Birthdate`|Data de nascimento do comprador. |Date |10 |Não|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do cliente. |Texto |14 |Não|
|`Customer.IdentityType`|Tipo do documento de identificação do comprador (CFP/CNPJ).|Texto|255|Não|
|`Customer.Address.Street`|Endereço do comprador. |Texto |255 |Não|
|`Customer.Address.Number`|Número do endereço do comprador. |Texto |15 |Não|
|`Customer.Address.Complement`|Complemento do endereço do comprador.|Texto |50 |Não|
|`Customer.Address.ZipCode`|CEP do endereço do comprador. |Texto |9 |Não|
|`Customer.Address.City`|Cidade do endereço do comprador. |Texto |50 |Não|
|`Customer.Address.State`|Estado do endereço do comprador. |Texto |2 |Não|
|`Customer.Address.Country`|País do endereço do comprador. |Texto |35 |Não|
|`Customer.Address.District`|Bairro do endereço do comprador. |Texto |50 |Não|
|`Customer.DeliveryAddress.Street`|Endereço de entrega do comprador. |Texto |255 |Não|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega do comprador. |Texto |15 |Não|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega do comprador. |Texto |50 |Não|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega do comprador. |Texto |9 |Não|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega do comprador. |Texto |50 |Não|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega do comprador. |Texto |2 |Não|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega do comprador. |Texto |35 |Não|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega do comprador. |Texto |50 |Não|

#### Resposta

```shell

HTTP Status 200

```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar a Data Final da Recorrência

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|
|`EndDate`|Data para término da recorrência.|Texto |10 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar o Intervalo da Recorrência

Para alterar o intervalo de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|
|`Interval`|Intervalo da recorrência. <br>Monthly / Bimonthly / Quarterly / SemiAnnual / Annual.|Texto |10 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar o Dia da Recorrência

Ao efetuar a alteração do dia da recorrência, devem levar-se em consideração as seguintes regras utilizadas para execução da atualização na API:

1- Se o novo dia informado for depois do dia atual, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 10, a data da próxima recorrência será dia 10/05.
2- Se o novo dia informado for antes do dia atual, iremos atualizar o dia da recorrência, mas este só terá efeito depois que a próxima recorrência for executada com sucesso. <br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 03, a data da próxima recorrência permanecerá dia 25/05. Após sua execução, a recorrência seguinte será agendada para o dia 03/06.
3- Se o novo dia informado for antes do dia atual, mas a próxima recorrência for em outro mês, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/09. Quando atualizado para o dia 03, a data da próxima recorrência será 03/09.

Para modificar o dia de vencimento de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|
|`RecurrencyDay`|Dia da recorrência.|Número |2 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar o Valor da Transação da Recorrência

Para modificar o valor da transação de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API.|GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.| GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência.|Texto |50 |Sim|
|`Payment.Amount`|Valor do pedido, em centavos. Ex.: 156 equivale a R$ 1,56.|Número|15|Sim|

<aside class="warning">Essa alteração só afeta a data de pagamento da recorrência seguinte.</aside>

#### Resposta

```shell

HTTP Status 200

```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar a Data do Próximo Pagamento

Para alterar somente a data do pagamento seguinte, basta fazer um PUT conforme o exemplo abaixo.

<aside class="warning">Esta operação modifica somente a data do pagamento seguinte, ou seja, as recorrências futuras permanecerão com as características originais.</aside>

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|
|`NextPaymentDate`|Data de pagamento da próxima recorrência.|Texto |10 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterar os Dados de Pagamento da Recorrência

Durante o ciclo de vida de uma recorrência, é possível alterar:

* Adquirente, ex.: de Rede para Cielo;
* Cartão, em caso de cartão vencido;
* Meio de pagamento, de cartão para boleto e vice-e-versa.

Para alterar os dados de pagamento, basta fazer um PUT conforme o exemplo.

<aside class="warning">Atenção: Essa alteração afeta a todos os dados do nó "Payment". Então, para manter os dados anteriores, você deve informar os campos que não deverão sofrer alterações com os mesmos valores que já estavam salvos.</aside>

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. |Texto |100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número |15 |Sim|
|`Payment.Installments`|Número de parcelas.|Número |2 |Sim|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador.|Texto |13|Não|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto |16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão.|Texto |25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão.|Texto |7 |Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto |4 |Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim|
|`Payment.Credentials.Code`|Afiliação gerada pela adquirente.|Texto|100|Sim|
|`Payment.Credentials.Key`|Chave de afiliação/token gerado pela adquirente.|Texto|100|Sim|
|`Payment.Credentials.Username`|Usuário gerado no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado).|Texto|50|Não|
|`Payment.Credentials.Password`|Senha gerada no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado).|Texto|50|Não|
|`Payment.Credentials.Signature`|Enviar o *TerminalID* da adquirente **Global Payments** Ex.: 001. Para **Safra**, colocar nome do estabelecimento, cidade e estado concatenados com ponto-e-vírgula ";". Ex.: NomedaLoja;São Paulo;SP|Texto|--|Não|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Desabilitando um Pedido Recorrente

Para desabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Reabilitando um Pedido Recorrente

Para reabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim|

#### Resposta

```shell

HTTP Status 200

```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Transação com Renova Fácil

O *Renova Fácil* é um serviço desenvolvido pela CIELO em conjunto com os bancos emissores cujo objetivo é aumentar a taxa de conversão de vendas recorrentes com cartão de crédito.

Através da identificação de cartões vencidos no momento da transação, é feita a autorização com um novo cartão, que é então retornado para armazenagem.

<aside class="notice">Bancos emissores participantes: Bradesco, Banco do Brasil, Santander, Panamericano, Citibank.</aside>

Para utilizar o Renova Fácil, é necessário que o serviço esteja habilitado na CIELO. Não é necessário enviar nenhuma informação extra na requisição de autorização, porém a resposta terá um nó a mais conforme exemplo abaixo:

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
|`NewCard.CardNumber`|Novo número do cartão do comprador.|Texto|16|
|`NewCard.Holder`|Nome do portador impresso no novo cartão.|Texto|25|
|`NewCard.ExpirationDate`|Data de validade impressa no novo cartão.|Texto|7|
|`NewCard.SecurityCode`|Código de segurança impresso no verso do novo cartão.|Texto|4|
|`NewCard.Brand`|Bandeira do novo cartão.|Texto|10 |

## Transferência Eletrônica

Semelhante ao pagamento com cartão de débito, a transferência eletrônica conecta o consumidor ao seu banco para autenticar uma venda em débito. A diferença entre ambos é que as transferências não são submetidas à adquirente nem dependem de dados de cartão.

### Criando uma Transação

Para criar uma venda, é necessário o envio de mensagem HTTP através do método POST para o recurso *Payment*, conforme o exemplo:

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
        "ReturnUrl":"http://www.braspag.com.br",
        "Beneficiary":
            {
            "Bank":"Bradesco"
        },
        "Shopper":{
            "Branch":"1669",
            "Account":"19887-5"
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
        "ReturnUrl":"http://www.braspag.com.br",
        "Beneficiary":
            {
            "Bank":"Bradesco"
        },
        "Shopper":{
            "Branch":"1669",
            "Account":"19887-5"
        }
    }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API. |Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`MerchantOrderId`|Número de identificação do pedido. |Texto |50 |Sim|
|`Customer.Name`|Nome do comprador.|Texto|255|Sim|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do cliente.| Texto |14 |Sim|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ).|Texto|255|Não|
|`Customer.Email`|Email do comprador.|Texto|255|Não|
|`Customer.Address.Street`|Endereço de contato do comprador.|Texto|255|Sim|
|`Customer.Address.Number`|Número do endereço de contato do comprador.|Texto|15|Sim|
|`Customer.Address.Complement`|Complemento do endereço de contato do comprador.|Texto|50|Sim|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador.|Texto|9|Sim|
|`Customer.Address.City`|Cidade do endereço de contato do comprador.|Texto|50|Sim|
|`Customer.Address.State`|Estado do endereço de contato do comprador.|Texto|2|Sim|
|`Customer.Address.Country`|País do endereço de contato do comprador.|Texto|35|Sim|
|`Customer.Address.District`|Bairro do endereço de contato do comprador.|Texto|35|Sim|
|`Payment.Type`|Tipo do meio de pagamento. |Texto |100 |Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número |15 |Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto |15 |---|
|`Payment.Beneficiary.Bank`|Banco do pagador (obrigatório somente para transferência eletrônica com provider **PayMeeSemiTransparent**). |Texto |100 |Condicional|
|`Payment.Shopper.Branch`|Agência do pagador (obrigatório somente para transferência eletrônica com provider **PayMeeSemiTransparent**). Obs.: Suprimir esse nó para modalidade de *Depósito Identificado*. |Texto |100 |Condicional|
|`Payment.Shopper.Account`|Conta do pagador (obrigatório somente para transferência eletrônica com provider **PayMeeSemiTransparent**). Obs.: Suprimir esse nó para modalidade de *Depósito Identificado*. |Texto |100 |Condicional|

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
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Url`|URL para onde o usuário será redirecionado para autenticação da transferência eletrônica. |Texto |256 |Url de Autenticação|
|`Status`|Status da transação.|Byte|2|Ex.: 1|

## E-Wallets

### O Que São E-Wallets (Carteiras Digitais)

E-wallets são repositórios de cartões e dados de pagamentos destinados a consumidores do e-commerce e do mundo físico. As carteiras digitais permitem que um consumidor realize o cadastro de seus dados de pagamento, tornando o processo de compra mais conveniente e seguro.

<aside class="warning">Para utilizar carteiras no Pagador, o lojista deverá possuir as carteiras integradas em seu checkout.</aside>

Para maiores informações, entre em contato com o provedor de sua preferência para contratar o serviço.

### E-Wallets Disponíveis

O Pagador possui suporte para as seguintes carteiras digitais:

* [*Apple Pay*](https://www.apple.com/br/apple-pay/)
* [*Samsung Pay*](https://www.samsung.com.br/samsungpay/)
* [*Google Pay*](https://pay.google.com/intl/pt-BR_br/about/)
* [*VisaCheckout*](https://vaidevisa.visa.com.br/site/visa-checkout/)
* [*MasterPass*](https://masterpass.com/pt-br/)

<aside class="warning">Atenção: O nó “CreditCard” passa a ser opcional quando o nó “Wallet” é enviado na requisição; e, para o cartão de débito, é necessário o envio do nó “DebitCard”, contendo a “ReturnUrl”.</aside>

### Integração

Abaixo, um exemplo de requisição padrão para integração do e-wallet:

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
| `MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim|
| `MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
| `RequestId`|Identificador do request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|GUID|36|Não|
| `MerchantOrderId`|Número de identificação do pedido.|Texto|50|Sim|
| `Customer.Name`|Nome do comprador.|Texto|255|Não|
| `Customer.Status`|Status de cadastro do comprador na loja ("NEW" / "EXISTING").|Texto|255|Não|
| `Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
| `Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
| `Payment.Provider`|Nome da provedora do meio de pagamento. Obs.: Disponível somente para providers **Cielo** (Cielo e Cielo30).|Texto|15|Sim|
| `Payment.Installments`|Número de parcelas.|Número|2|Sim|
| `Wallet.Type`|Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass".|Texto|--|Sim|
| `Wallet.WalletKey`|Chave criptográfica que identifica lojas nas wallets. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.|Texto|--|Sim|
| `Wallet.AdditionalData.EphemeralPublicKey`|Token retornado pela wallet. Deve ser enviado em Integrações: "ApplePay".|Texto|--|Sim|
| `Wallet.AdditionalData.CaptureCode`|Código informado pela **MasterPass** ao lojista.| Texto|--|Sim|                  
| `Wallet.AdditionalData.Signature`|Token retornado pela wallet. Deve ser enviado em Integrações: "AndroidPay".|Texto|--|Sim|

##### Walletkey

O walletkey é o identificador utilizado pela Braspag para descriptografar payloads retornados pela wallet.
Seguem os formatos de `WalletKey` a serem repassados ao Pagador API:

| Carteira       | Exemplo        |
|----------------|----------------|
| *Apple Pay*    | 9zcCAciwoTS+qBx8jWb++64eHT2QZTWBs6qMVJ0GO+AqpcDVkxGPNpOR/D1bv5AZ62+5lKvucati0+eu7hdilwUYT3n5swkHuIzX2KO80Apx/SkhoVM5dqgyKrak5VD2/drcGh9xqEanWkyd7wl200sYj4QUMbeLhyaY7bCdnnpKDJgpOY6J883fX3TiHoZorb/QlEEOpvYcbcFYs3ELZ7QVtjxyrO2LmPsIkz2BgNm5f+JaJUSAOectahgLZnZR+easdhghrsa/E9A6DwjMd0fDYnxjj0bQDfaZpBPeGGPFLu5YYn1IDc   |
| *Samsung Pay*  | eyJhbGciOiJSU0ExXzUiLCJraWQiOiIvam1iMU9PL2hHdFRVSWxHNFpxY2VYclVEbmFOUFV1ZUR5M2FWeHBzYXVRPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.cCsGbqgFdzVb1jhXNR--gApzoXH-fdafddfa-Bo_utsmDN_DuGm69Kk2_nh6txa7ML9PCI59LFfOMniAf7ZwoZUBDCY7Oh8kx3wsZ0kxNBwfyLBCMEYzET0qcIYxePezQpkNcaZ4oogmdNSpYY-KbZGMcWpo1DKhWphDVp0lZcLxA6Q25K78e5AtarR5whN4HUAkurQ.CFjWpHkAVoLCG8q0.NcsTuauebemJXmos_mLMTyLhEHL-p5Wv6J88WkgzyjAt_DW7laiPMYw2sqRXkOiMJLwhifRzbSp8ZgJBM25IX05dKKSS4XfFjJQQjOBHw6PYtEF5pUDMLHML3jcddCrX07abfef_DuP41PqOQYsjwesLZ8XsRj-R0TH4diOZ_GQop8_oawjRIo9eJr9Wbtho0h8kAzHYpfuhamOPT718EaGAY6SSrR7t6nBkzGNkrKAmHkC7aRwe.AbZG53wRqgF0XRG3wUK_UQ|   |
| *Google Pay*  | {\"encryptedMessage\":\"0mXBb94Cy9JZhMuwtrBhMjXb8pDslrNsN5KhcEqnowOINqJgjXHD36KcCuzpQQ4cDAe64ZLmk2N3UBGXsN9hMMyeMakXlidVmteE+QMaNZIor048oJqlUIFPD54B/ic8zCdqq3xnefUmyKQe0I03x57TcEA9xAT/E4x3rYfyqLFUAEtu2lT0GwTdwgrsT8pKoTldHIgP+wVNTjrKvJrB4xM/Bhn6JfcSmOzFyI6w37mBU71/TK761nYOSxt7z1bNWSLZ4b8xBu1dlRgen2BSlqdafuQjV3UZjr6ubSvaJ8NiCh5FD/X013kAwLuLALMS2uAFS9j8cZ6R6zNIi13fK6Fe4ACbFTHwLzSNZjQiaRDb6MlMnY8/amncPIOXzpirb5ScIz8EZUL05xd+3YWVTVfpqgFo1eaaS+wZdUyRG0QEgOsr6eLBoH8d5lfV9Rx6XdioorUuT7s1Yqc0OJZO+fhBt6X0izE9hBGTexdZyg\\u003d\\u003d\",\"ephemeralPublicKey\":\"BMdwrkJeEgCOtLevYsN3MbdP8xbOItXiTejoB6vXy0Kn0ZM10jy4Aasd6jTSxtoxoTpFydLhj5kzoOhbw2OzZu0\\u003d\",\"tag\":\"yAQIjWZ0VuCC7SWyYwc4eXOzpSUKhZduF9ip0Ji+Gj8\\u003d\"}  |
| *VisaCheckout* | 1140812334225873901   |
| *Masterpass* | a561da1c18a89cfdafas875f9d43fc46cd9bf3e1   |

##### EphemeralPublicKey

Formato de `EphemeralPublicKey` que deve ser repassado ao Pagador API:

| Carteira       | Exemplo                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------|
| *Apple Pay*    | MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEoedz1NqI6hs9hEO6dBsnn0X0xp5/DKj3gXirjEqxNIJ8JyhGxVB3ITd0E+6uG4W6Evt+kugG8gOhCBrdUU6JwQ==   |

##### Signature

Formato de `Signature` que deve ser repassado ao Pagador API:

| Carteira       | Exemplo                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------|
| *Google Pay*  | MEUCIQCGQLOmwxe5eFMSuTcr4EcwSZu35fB0KlCWcVop6ZxxhgIgbdtNHThSlynOopfxMIxkDs0cLh2NFh5es+J5uDmaViA\u003d                                       |

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
| `ProofOfSale`       | Número da autorização, idêntico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Id da transação na adquirente.                                                                                                 | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancária do portador. Disponível apenas para VISA/MASTER - não permite caracteres especiais. | Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo identificador do pedido.                                                                                                 | GUID  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | *Electronic Commerce Indicator*. Representa o quão segura é uma transação.                                                        | Texto | 2       | Ex.: 7                          |
| `Status`            | Status da transação.                                                                                                           | Byte  | 2       | Ex.: 1                                |
| `ReturnCode`        | Código de retorno da adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da adquirência.                                                                                            | Texto | --     | Texto alfanumérico                   |
| `Type`              | Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass".                      | Texto | --     | Texto alfanumérico                   |
| `WalletKey`         | Chave criptográfica que identifica lojas nas wallets. Consulte a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.                              | Texto | --     | Ver [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey)               |       
| `AdditionalData.EphemeralPublicKey` | Token retornado pela wallet. Deve ser enviado em Integrações: "ApplePay".                                       | Texto | --     | Ver tabela [EphemeralPublicKey](https://braspag.github.io//manual/braspag-pagador#ephemeralpublickey)      |  
| `AdditionalData.CaptureCode`        | Código informado pela **MasterPass** ao lojista.                                                                  | Texto | --     | 3                                    |
| `AdditionalData.Signature` | Token retornado pela wallet. Deve ser enviado em Integrações: "AndroidPay".                                               | Texto | --     | Ver tabela [Signature](https://braspag.github.io//manual/braspag-pagador#signature)      |  

### Exemplos

#### Apple Pay

<aside class="warning">Pré-requisitos: Para utilização da Apple Pay é necessário que a loja já esteja cadastrada junto à Apple e possua um "MerchantIdentifier". Também é necessário o upload de um certificado CSR no formato PEM fornecido pela Braspag. Abaixo segue o passo a passo para disponibilizar a Apple Pay em sua loja.</aside>

##### Passo 1. Contratação na Apple

É necessário que a Apple Pay seja contratada na Apple através do seguinte contato comercial: *Shawn Munyon* (smunyon@apple.com). O contato deverá ser feito em inglês.

##### Passo 2. Obtenção do MerchantIdentifier

Uma vez que a contratação esteja efetivada, você receberá acesso ao painel **Apple Developer**, onde será necessária a criação do `MerchantIdentifier`. Para isso, realize os passos abaixo:
1. Faça login na página [Apple Developer](https://developer.apple.com/).
2. Selecione **Certificates, Identifiers & Profiles**.
3. Dentro do item **Identifiers**, no menu, clique em **Merchant IDs**.
4. Clique no **+** no canto superior direito, abaixo de **Registering a Merchant ID**.
5. Defina a descrição do MerchantID em **Merchant ID Description** e o identificador (ex.: "merchant.com.BRASPAG.merchantAccount") em **Identifier**.
6. Clique em **Continue** e verifique se as informações inseridas estão corretas.
7. Finalize o processo.

O `MerchantIdentifier` deve ser enviado à Braspag por meio do [canal de suporte](https://suporte.braspag.com.br/hc/pt-br/restricted?return_to=https%3A%2F%2Fsuporte.braspag.com.br%2Fhc%2Fpt-br) para a criação de um **Certificado CSR no formato PEM**.

##### Passo 3. Upload do Certificado CSR

Após enviar o `MerchantIdentifier` para a equipe da Braspag, a loja receberá o certificado de extensão "PEM" e deverá seguir os seguintes passos:

1. Faça login na página [Apple Developer](https://developer.apple.com/).
2. Selecione **Certificates, Identifiers & Profiles**.
![Apple Pay]({{ site.baseurl_root }}/images/apple-paymid.jpg)
<img src="{{ site.baseurl_root }}/images/apple-paymid.jpg" align="left" width="48">
<img src="{{ site.baseurl_root }}/images/apple-paymid.jpg" alt="Apple Pay" width="250"/>
3. Realize o upload do certificado.
![Apple Pay]({{ site.baseurl_root }}/images/apple-pay.jpg)
4. Finalize o processo.

O Certificado "PEM" contém o código CSR solicitado pela Apple.

Formato de um "PEM":

> 
> -----BEGIN CERTIFICATE REQUEST-----
> 
> MIHyMIGYAgEAMDgxCzAJBgNVBAYTAkJSMRAwDgYDVQQKDAdicmFzcGFnMRcwFQYDVQQDDA5icmFzcGFnLmNvbS5icjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABFUL1F/ue9/T5SrEyE1wTPQxk5x3ZHEelB7VHObDTW7pjauFrE88J25w7iRCKNP6u2fPmBtM9nY30/xQCgBH9aUwCgYIKoZIzj0EAwIDSQAwRgIhAPyF47xmfy+9czlr0a94eSd/YG27G8akujpkIUd56qWmAiEAqV6aSVISmH9NveOKGJdZ6VvkbELK2uqu2yCpg/lfYc8=
> 
> -----END CERTIFICATE REQUEST---

Após o upload do certificado CSR, vem a etapa da integração, que deverá acontecer em dois passos.

##### Passo 4. Integração com a Apple Pay

O primeiro passo da integração deve ser feito diretamente com a solução da Apple, para disponibilizar o botão "Pagar com Apple Pay" em seu site ou aplicativo. Para isso, a equipe da Apple fará um acompanhamento de perto. [Clique aqui](https://developer.apple.com/apple-pay/) para acessar a documentação técnica da Apple.  

<aside class="notice">Nesta etapa, não é preciso realizar o processo de criptografia de dados retornados pela Apple. Este trabalho será realizado pela Braspag, através dos procedimentos descritos na próxima etapa.</aside>

##### Passo 5. Integração com o Pagador (Decriptografia e Autorização)

O segundo passo da integração deverá efetivar o fluxo de autorização via gateway da Braspag (Pagador). Para isso, é necessário fornecer os dados recebidos no fluxo com a Apple Pay, inclusive `WalletKey` e `EphemeralPublicKey`.

##### Requisição

Exemplo de requisição padrão Apple Pay:

<aside class="warning">É necessário que a loja já possua cadastro e integração Apple Pay, caso contrário não será possível a integração com a API.</aside>

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

| Propriedade                | Descrição                                                                                               | Tipo   | Tamanho | Obrigatório |
|----------------------------|---------------------------------------------------------------------------------------------------------|--------|---------|-------------|
| `MerchantId`               | Identificador da loja na Braspag.                                                                       | GUID   | 36      | Sim         | 
| `MerchantKey`              | Chave pública para autenticação dupla na Braspag.                                                       | Texto  | 40      | Sim         | 
| `RequestId`                | Identificador do request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.  | GUID   | 36      | Não         | 
| `MerchantOrderId`          | Número de identificação do pedido.                                                                      | Texto  | 50      | Sim         | 
| `Customer.Name`            | Nome do comprador.                                                                                      | Texto  | 255     | Não         |
| `Customer.Status`          | Status de cadastro do comprador na loja ("NEW" / "EXISTING").                                           | Texto  | 255     | Não         |
| `Payment.Type`             | Tipo do meio de pagamento.                                                                              | Texto  | 100     | Sim         |
| `Payment.Amount`           | Valor do pedido, em centavos.                                                                           | Número | 15      | Sim         |
| `Payment.Provider`         | Nome da provedora do meio de pagamento. Obs.: Disponível somente para providers **Cielo** (Cielo / Cielo30)| Texto  | 15      | Sim         |
| `Payment.Installments`     | Número de parcelas.                                                                                     | Número | 2       | Sim         |
| `Wallet.Type`              | Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass".             | Texto  | 255     | Sim         |
| `Wallet.WalletKey`         | Chave criptográfica que representa os dados do cartão. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.      | Texto  | 255     | Sim         |
| `Wallet.AdditionalData.EphemeralPublicKey`| Token retornado pela wallet. Deve ser enviado em Integrações: "ApplePay".                 | Texto  | 255     | Sim         |

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
| `ProofOfSale`       | Número da autorização, idêntico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Identificador da transação na adquirente.                                                                                                 | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancária do portador. Obs.: Não permite caracteres especiais. Disponível apenas para VISA/MASTER.| Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo identificador do pedido.                                                                                                 | GUID  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | *Electronic Commerce Indicator*. Representa o quão segura é uma transação.                                                        | Texto | 2       | Ex.: 7                          |
| `Status`            | Status da transação.                                                                                                           | Byte  | 2       | Ex.: 1                                |
| `ReturnCode`        | Código de retorno da adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da adquirência.                                                                                            | Texto | 512     | Texto alfanumérico                   |
| `Type`              | Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass".                       | Texto | 255     | Texto alfanumérico                   |
| `WalletKey`         | Chave criptográfica que identifica lojas nas wallets. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.                              | Texto | 255     | Ver [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey).              |       
| `AdditionalData.EphemeralPublicKey` | Token retornado pela wallet. Deve ser enviado em Integrações: "ApplePay".                         | Texto | 255     | Ver tabela [EphemeralPublicKey](https://braspag.github.io//manual/braspag-pagador#ephemeralpublickey)|

#### Samsung Pay

##### Requisição

Exemplo de requisição padrão Samsung Pay:

<aside class="warning">É necessário que a loja já possua cadastro e integração Samsung Pay, caso contrário não será possível a integração com a API.</aside>

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

| Propriedade                | Descrição                                                                                               | Tipo   | Tamanho | Obrigatório |
|----------------------------|---------------------------------------------------------------------------------------------------------|--------|---------|-------------|
| `MerchantId`               | Identificador da loja na Braspag.                                                                        | GUID   | 36      | Sim         |
| `MerchantKey`              | Chave pública para autenticação dupla na Braspag.                                                        | Texto  | 40      | Sim         |
| `RequestId`                | Identificador do request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.  | GUID   | 36      | Não         |
| `MerchantOrderId`          | Número de identificação do pedido.                                                                      | Texto  | 50      | Sim         |
| `Customer.Name`            | Nome do comprador.                                                                                      | Texto  | 255     | Não         |
| `Customer.Status`          | Status de cadastro do comprador na loja ("NEW" / "EXISTING").                                                | Texto  | 255     | Não         |
| `Payment.Type`             | Tipo do meio de pagamento.                                                                              | Texto  | 100     | Sim         |
| `Payment.Amount`           | Valor do pedido, em centavos.                                                              | Número | 15      | Sim         |
| `Payment.Provider`         | Nome da provedora do meio de pagamento. Obs.: Disponível somente para providers **Cielo** (Cielo / Cielo30).  | Texto  | 15      | Sim         |
| `Payment.Installments`     | Número de parcelas.                                                                                     | Número | 2       | Sim         |
| `Wallet.Type`              | Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass". | Texto  | 255     | Sim         |
| `Wallet.WalletKey`         | Chave criptográfica que representa os dados do cartão. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.
| Texto  | 255     | Sim         |

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
| `ProofOfSale`       | Número da autorização, idêntico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Identificador da transação na adquirente.                                                                                                 | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancária do portador. Obs.: Não permite caracteres especiais. Disponível apenas para VISA/MASTER. | Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo identificador do pedido.                                                                                                 | GUID  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | *Electronic Commerce Indicator*. Representa o quão segura é uma transação.                                                        | Texto | 2       | Ex.: 7                          |
| `Status`            | Status da transação.                                                                                                           | Byte  | 2       | Ex.: 1                                |
| `ReturnCode`        | Código de retorno da adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da adquirência.                                                                                            | Texto | 512     | Texto alfanumérico                   |
| `Type`              | Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass.                      | Texto | 255     | Texto alfanumérico                   |
| `WalletKey`         | Chave criptográfica que representa os dados do cartão. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.                    | Texto | 255     | Ver a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey)              |

#### Android Pay

##### Requisição

Exemplo de requisição padrão Android Pay:

<aside class="warning">É necessário que a loja já possua cadastro e integração Android Pay, caso contrário não será possível a integração com a API.</aside)

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

| Propriedade                | Descrição                                                                                               | Tipo   | Tamanho | Obrigatório |
|----------------------------|--------|---------|-------------|---------------------------------------------------------------------------------------------------------|
| `MerchantId`               | Identificador da loja na Braspag.                                                                        | GUID   | 36      | Sim         |
| `MerchantKey`              | Chave pública para autenticação dupla na Braspag.                                                        | Texto  | 40      | Sim         | 
| `RequestId`                | Identificador do request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.  | GUID   | 36      | Não         |
| `MerchantOrderId`          | Número de identificação do pedido.                                                                      | Texto  | 50      | Sim         |
| `Customer.Name`            | Nome do comprador.                                                                                      |Texto  | 255     | Não         |
| `Customer.Status`          | Status de cadastro do comprador na loja ("NEW" / "EXISTING").                                           | Texto  | 255     | Não         |      
| `Payment.Type`             | Tipo do meio de pagamento.                                                                              | Texto  | 100     | Sim         |
| `Payment.Amount`           | Valor do pedido, em centavos.                                                                           | Número | 15      | Sim         |
| `Payment.Provider`         | Nome da provedora do meio de pagamento. Obs: Disponível somente para providers **Cielo** (Cielo / Cielo30).| Texto  | 15      | Sim         |
| `Payment.Installments`     | Número de parcelas.                                                                                     | Número | 2       | Sim         |       
| `Wallet.Type`              | Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass".             | Texto  | 255     | Sim         |
| `Wallet.WalletKey`         | Chave criptográfica que representa os dados do cartão. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.| Texto  | 255     | Sim         |
| `Wallet.AdditionalData.Signature`| Token retornado pela wallet. Deve ser enviado em Integrações: "AndroidPay".                                 | Texto  | 255    | Sim  |

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
| `ProofOfSale`       | Número da autorização, idêntico ao NSU.                                                                                        | Texto | 6       | Texto alfanumérico                   |
| `Tid`               | Identificador da transação na adquirente.                                                                                      | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode` | Código de autorização.                                                                                                         | Texto | 6       | Texto alfanumérico                   |
| `SoftDescriptor`    | Texto que será impresso na fatura bancária do portador. Obs.: Não permite caracteres especiais. Disponível apenas para VISA/MASTER. | Texto | 13      | Texto alfanumérico                   |
| `PaymentId`         | Campo identificador do pedido.                                                                                                 | GUID  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ECI`               | *Electronic Commerce Indicator*. Representa o quão segura é uma transação.                                                        | Texto | 2       | Ex.: 7                          |
| `Status`            | Status da transação.                                                                                                           | Byte  | 2       | Ex.: 1                                |
| `ReturnCode`        | Código de retorno da adquirência.                                                                                              | Texto | 32      | Texto alfanumérico                   |
| `ReturnMessage`     | Mensagem de retorno da adquirência.                                                                                            | Texto | 512     | Texto alfanumérico                   |
| `Type`              | Tipo de carteira: "ApplePay" / "SamsungPay" / "AndroidPay" / "VisaCheckout" / "Masterpass".                       | Texto | 255     | Texto alfanumérico                   |
| `WalletKey`         | Chave criptográfica que representa os dados do cartão. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.| Texto | 255     | Ver a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey).               |       
| `AdditionalData.Signature` | Token retornado pela wallet. Deve ser enviado em Integrações: "AndroidPay".                                               | Texto | 255     | Ver tabela [Signature](https://braspag.github.io//manual/braspag-pagador#signature)|  

#### MasterPass

Para utilizar o MasterPass é necessária a contratação do serviço através do contato diretamente com a Mastercard, selecionando a Braspag como *service provider*.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`RequestId`|Identificador do request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|GUID|36|Não|
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Sim|
|`Customer.Name`|Nome do comprador.|Texto|255|Não|
|`Customer.Status`|Status de cadastro do comprador na loja ("NEW" / "EXISTING").|Texto|255|Não|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento. Disponível somente para providers **Cielo** (Cielo / Cielo30).|Texto|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Wallet.Type`|Tipo de carteira: "MasterPass".|Texto|255|Sim|
|`Wallet.WalletKey`|Chave criptográfica que representa os dados do cartão. Consultar a [tabela WalletKey](https://braspag.github.io//manual/braspag-pagador#walletkey) para mais informações.|Texto|255|Sim|
|`Wallet.AdditionalData`|Instância para dados extras informados pela **MasterPass**. Obs.: Obrigatório apenas para `Wallet.Type` "MasterPass"|---|---|---|
|`Wallet.CaptureCode`|Código informado pela **MasterPass** ao lojista.|Texto|255|Sim|

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
|`ProofOfSale`|Número da autorização, idêntico ao NSU.|Texto|6|Texto alfanumérico|
|`Tid`|Identificador da transação na adquirente.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|6|Texto alfanumérico|
|`SoftDescriptor`|Texto que será impresso na fatura bancária do portador. Obs.: Não permite caracteres especiais. Disponível apenas para VISA/MASTER. |Texto|13|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ECI`|*Electronic Commerce Indicator*. Representa o quão segura é uma transação.|Texto|2|Ex.: 7|
|`Status`|Status da transação.|Byte| 2 | Ex.: 1 |
|`ReturnCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`ReturnMessage`|Mensagem de retorno da adquirência.|Texto|512|Texto alfanumérico|
|`Type`|Tipo de carteira: "VisaCheckout" / "MasterPass".|Texto|255|Sim|
|`CaptureCode`|Código informado pela **MasterPass** ao lojista.|Texto|255|Sim|

#### Visa Checkout

Para utilizar o Visa Checkout é necessária a contratação do serviço através do contato diretamente com a Visa.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|---|---|---|---|---|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`RequestId`|Identificador do request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|GUID|36|Não|
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Sim|
|`Customer.Name`|Nome do comprador.|Texto|255|Não|
|`Customer.Status`|Status de cadastro do comprador na loja ("NEW" / "EXISTING").|Texto|255|Não|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Provider`|Nome da provedora do meio de pagamento. Obs.: Disponível somente para providers **Cielo** (Cielo / Cielo30).|Texto|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim do pagamento. Obrigatório para cartão de débito.|Texto|1024|---|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Não|
|`Wallet.Type`|Tipo de carteira: "VisaCheckout".|Texto|255|Sim|
|`Wallet.WalletKey`|Chave criptográfica enviada pelo **VisaCheckout**. Obs.: Obrigatório apenas para `Wallet.Type` "Visa Checkout".|Texto|255|---|

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
|`ProofOfSale`|Número da autorização, idêntico ao NSU.|Texto|6|Texto alfanumérico|
|`Tid`|Identificador da transação na adquirente.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|6|Texto alfanumérico|
|`SoftDescriptor`|Texto que será impresso na fatura bancária do portador. Obs.: Não permite caracteres especiais. Disponível apenas para VISA/MASTER. |Texto|13|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ECI`|*Electronic Commerce Indicator*. Representa o quão segura é uma transação.|Texto|2|Ex.: 7|
|`Status`|Status da transação.|Byte| 2 | Ex.: 1 |
|`ReturnCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`ReturnMessage`|Mensagem de retorno da adquirência.|Texto|512|Texto alfanumérico|
|`Type`|Tipo de carteira: "VisaCheckout" / "Masterpass"|Texto|255|Sim|
|`CaptureCode`|Código informado pela **MasterPass** ao lojista.|Texto|255|Sim|

## Voucher

### Criando uma Transação com Voucher

Uma transação com cartão voucher se efetua de forma semelhante à com cartão de débito; porém, sem o processo de autenticação.
Atualmente, suportamos os providers *Alelo* e *Ticket* nessa modalidade.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "DebitCard".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim do pagamento.|Texto |1024 |Sim|
|`DebitCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`DebitCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`DebitCard.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA. Obs.: Vouchers "Ticket" não possuem data de validade impressa no cartão. Envie uma data posterior ao dia atual para que a transação seja processada.|Texto|7|Sim|
|`DebitCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`DebitCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

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
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Transação Aprovada|
|`AuthenticationUrl`|URL para o qual o portador será redirecionado para autenticação. |Texto |56 |https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f|

## Pagamentos com DCC (Conversor de Moedas da Adquirente Global Payments)

O DCC (Dynamic Currency Conversion) é um conversor de moedas da adquirente Global Payments que permite que o portador de um cartão estrangeiro escolha entre pagar em reais ou em sua moeda local, convertendo o valor do pedido no momento da compra com total transparência para o comprador.
A solução é indicada para estabelecimentos que recebem pagamentos com cartões emitidos no exterior como hotéis, pousadas, polos comerciais e comércios em pontos turísticos.

<aside class="warning">Atenção: Esta funcionalidade não é compatível com transações com MPI externo. Para utilizar esta funcionalidade com a autenticação padrão, o lojista deverá entrar em contato com a adquirente Global Payments e solicitar a ativação do DCC em seu estabelecimento. </aside>

Quando o estabelecimento possui o produto DCC habilitado, o processo de autorização é realizado em 3 etapas, explicadas a seguir:

#### Passo 1 - Solicitação de Autorização

Na primeira etapa, quando é solicitada uma autorização com um cartão internacional, a Global Payments identifica o país do cartão e aplica a conversão de moeda seguindo os cálculos específicos de cada bandeira, retornando as informações de conversão em seguida.

Segue um exemplo de solicitação de autorização da transação:

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
| `AcquirerTransactionId` | Id da transação no provedor de meio de pagamento.                            | Texto | 40      | Texto alfanumérico                   |
| `ProofOfSale`           | Número do comprovante de venda.                                              | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode`     | Código de autorização.                                                       | Texto | 300     | Texto alfanumérico                   |
| `PaymentId`             | Campo identificador do pedido.                                               | GUID  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ReceivedDate`          | Data em que a transação foi recebida pela Braspag.                            | Texto | 19      | AAAA-MM-DD HH:mm:SS                  |
| `ReasonCode`            | Código de retorno da operação.                                               | Texto | 32      | Texto alfanumérico                   |
| `ReasonMessage`         | Mensagem de retorno da operação.                                             | Texto | 512     | Texto alfanumérico                   |
| `Status`                | Status da transação.                                                         | Byte  | 2       | Ex.                                  |
| `ProviderReturnCode`    | Código retornado pelo provedor do meio de pagamento (adquirente e banco).   | Texto | 32      | 57                                   |
| `ProviderReturnMessage` | Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco). | Texto | 512     | Transação Aprovada                   |
| `CurrencyExchangeData.Id` | Id da ação da troca de moeda. | Texto | 50     | 1b05456446c116374005602dcbaf8db8879515a0                   |
| `CurrencyExchangeData.CurrencyExchanges.Currency` | Moeda local do comprador/cartão de crédito. | Numérico | 4     | EUR                   |
| `CurrencyExchangeData.CurrencyExchanges.ConvertedAmount` | Valor convertido. | Numérico | 12     | 23                   |
| `CurrencyExchangeData.CurrencyExchanges.ConversionRate` | Taxa de conversão. | Numérico | 9     | 3.218626                   |
| `CurrencyExchangeData.CurrencyExchanges.ClosingDate` | Data de finalização da transação. | Texto | 19     | AAAA-MM-DD HH:mm:SS                  |
| `CurrencyExchangeData.CurrencyExchanges.Currency` | Código da moeda "real". | Texto | 3     | BRA                   |
| `CurrencyExchangeData.CurrencyExchanges.ConvertedAmount` | Valor do pedido em reais. | Numérico | 12     | 100                   |

#### Etapa 2 - Opções de Pagamento

Na segunda etapa, o sistema da loja apresenta ao comprador as opções de pagar em reais ou com a moeda de seu país (moeda do cartão de crédito), seguindo as melhores práticas solicitadas pela bandeira. O texto é apresentado em inglês e o layout do site não precisa ser alterado, desde que as opções de escolha da moeda tenham as mesmas características de fonte, cor e dimensões.

Segue um exemplo de exibição das opções de pagamento (em reais ou na moeda do cartão), disponibilizado pela Global Payments:

![DCC Global Payments]({{ site.baseurl_root }}/images/dcc-globalpayments.jpg)

#### Etapa 3 - Confirmação da Transação

Na terceira etapa, o sistema da loja envia a confirmação da transação com as informações da moeda escolhida pelo comprador. Neste ponto é retornada a resposta da autorização.

Segue um exemplo de confirmação da transação com a moeda escolhida pelo comprador:

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
            "Holder": "TesteDcc",
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
            "Holder": "TesteDcc",
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
| `AcquirerTransactionId` | Id da transação no provedor de meio de pagamento.                            | Texto | 40      | Texto alfanumérico                   |
| `ProofOfSale`           | Número do comprovante de venda.                                              | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode`     | Código de autorização.                                                       | Texto | 300     | Texto alfanumérico                   |
| `PaymentId`             | Campo identificador do pedido.                                               | GUID  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ReceivedDate`          | Data em que a transação foi recebida pela Braspag.                            | Texto | 19      | AAAA-MM-DD HH:mm:SS                  |
| `ReasonCode`            | Código de retorno da operação.                                               | Texto | 32      | Texto alfanumérico                   |
| `ReasonMessage`         | Mensagem de retorno da operação.                                             | Texto | 512     | Texto alfanumérico                   |
| `Status`                | Status da transação.                                                         | Byte  | 2       | Ex.: 2                                  |
| `ProviderReturnCode`    | Código retornado pelo provedor do meio de pagamento (adquirente e banco).   | Texto | 32      | 57                                   |
| `ProviderReturnMessage` | Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco). | Texto | 512     | Transação Aprovada                   |

# Salvando e Reutilizando Cartões

Ao contratar o *Cartão Protegido*, é possível salvar um cartão de forma segura e de acordo com as normas PCI. Os dados do cartão são salvos em formato de um token, o que facilita o envio e processamento de transações, garantindo a integridade dos cartões armazenados e substituindo seus dados numa próxima transação do mesmo comprador.

<aside class="warning">Por questões de segurança, o CVV (Código de Segurança) não é tokenizado.</aside>

Além da geração do card token, é possível associar um nome (um identificador em formato de texto) ao cartão salvo. Esse identificador será o `Alias`.

## Salvando um Cartão Durante uma Autorização

Para salvar um cartão de crédito utilizado em uma transação, basta enviar o parâmetro `Payment.SaveCard` como "True" na requisição padrão de autorização.

### Requisição

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`CreditCard.SaveCard`|"true" - para salvar o cartão. "false" - para não salvar o cartão.|Booleano|10|Não (default "false") |
|`CreditCard.Alias`|Alias (apelido) do cartão de crédito.|Texto|64|Não |

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
|`AcquirerTransactionId`|Id da transação no provedor do meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Transação Aprovada|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Criando uma Tansação com Card Token

Este é um exemplo de como utilizar o *card token*, previamente salvo, para criar uma transação. Por questões de segurança, um card token não tem guardado o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Caso seu estabelecimento junto à adquirente esteja configurado como *recorrente*, você poderá submeter transações sem o CVV.

#### Requisição

O nó `CreditCard` dentro do nó `Payment` será alterado conforme exemplo a seguir:

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão. Para processar vendas sem o CVV, é necessário solicitar liberação na adquirente.|Texto|4|Não|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

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
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Transação Aprovada|

## Criando uma Transação com Alias

Este é um exemplo de como utilizar o Alias, previamente salvo, para criar uma transação. Por questões de segurança, um Alias não tem guardado o Código de Segurança (CVV). Desta forma, é preciso solicitar esta informação ao portador para cada nova transação. Caso seu estabelecimento junto à adquirente esteja configurado como *recorrente*, você poderá submeter transações sem o CVV.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão. Para processar vendas sem o CVV, é necessário solicitar liberação na adquirente.|Texto|4|Não|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`CreditCard.Alias`|Alias (apelido) do cartão de crédito.|Texto|64|Não |

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
|`AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`ReasonCode`|Código de retorno da operação.|Texto|32|Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da operação.|Texto|512|Texto alfanumérico|
|`Status`|Status da transação.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente e banco).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente e banco).|Texto|512|Transação Aprovada|

# Pagamentos com Análise de Fraude

Ao efetuar um pagamento, é possível verificar se a transação possui risco de ser uma fraude ou não durante sua autorização. Essa verificação pode ocorrer em momentos diferentes, de acordo com as regras definidas pelo cliente. Confira abaixo o comportamento da análise de risco de acordo com cada tipo de integração:

|Tipo de Integração|Descrição|Parâmetros Necessários|
|-|-|-|
|Análise antes da autorização|A transação é analisada pelo AntiFraude e então enviada para autorização. Dessa forma, evita-se o envio de transações de alto risco para autorização.|`FraudAnalysis.Sequence` igual a "AnalyseFirst"|
|Análise após a autorização|A transação é enviada para a autorização e então analisada pelo AntiFraude.|`FraudAnalysis.Sequence` igual a "AuthorizeFirst"|
|Análise das transações autorizadas|O AntiFraude é acionado apenas para analisar transações autorizadas, evitando-se o custo com análises de transações que não receberiam autorização.|`FraudAnalysis.SequenceCriteria` igual a "OnSuccess"|
|Análise em qualquer hipótese|O AntiFraude é acionado independentemente do status da transação após a autorização.|`FraudAnalysis.Sequence` igual a "AuthorizeFirst" e `FraudAnalysis.SequenceCriteria` igual a "Always"|
|Autorização em qualquer hipótese|A transação será enviada para autorização independentemente de seu score de fraude.|`FraudAnalysis.Sequence` igual a "AnalyseFirst" e `FraudAnalysis.SequenceCriteria` igual a "Always"|
|Captura para transações seguras|Após a análise de fraude, a captura será automática para transações autorizadas definidas como de baixo risco. Para a loja que utiliza revisão manual, a transação será capturada automaticamente assim que a Braspag receber notificação do novo status "_Accept_".|`FraudAnalysis.Sequence` igual a "AuthorizeFirst", `FraudAnalysis.CaptureOnLowRisk` igual a "true" e `Payment.Capture` igual a "false"|
|Cancelamento de transações comprometidas|Caso a análise de fraude retorne um alto risco para uma transação já autorizada ou capturada, ela será imediamente cancelada ou estornada. Para a loja que utiliza revisão manual, a transação será cancelada ou estornada automaticamente assim que a Braspag receber notificação do novo status "_Reject_".|`FraudAnalysis.Sequence` igual a "AuthorizeFirst" e `FraudAnalysis.VoidOnHighRisk` igual a "true"|

Caso não seja especificado durante a autorização, a Braspag irá processar sua transação pelo seguinte fluxo:
- `FraudAnalysis.Sequence` igual a "AuthorizeFirst",
- `FraudAnalysis.SequenceCriteria` igual a "OnSuccess",
- `FraudAnalysis.VoidOnHighRisk` igual a "false",
- `FraudAnalysis.CaptureOnLowRisk` igual a "false". 

## Criando uma Transação com Análise de Fraude Cybersource

Para que a análise de fraude via Cybersource seja efetuada durante uma transação de cartão de crédito, é necessário complementar o contrato de autorização com os nós `FraudAnalysis`, `Cart`, `MerchantDefinedFields` e `Travel` (somente para venda de passagens aéreas).

Durante implantação do Cybersource, informações adicionais podem ser armazenadas através de MDDs (Merchand Defined Data), que são campos numerados de 0 a N utilizados para armazenar informações exclusivas do merchant. Confira [este artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360004822532-Implanta%C3%A7%C3%A3o-Cybersource-MDD-s-Geral) com detalhes sobre o preenchimento desses campos.

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
            "DepartureTime":"2018-01-09 18:00",
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
            "DepartureTime":"2018-01-09 18:00",
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim|
|`RequestId`|Identificador do request definido pela loja.|GUID|36|Não|
|`MerchantOrderId`|Número do pedido da loja.|Texto|50|Sim|
|`Customer.Name`|Nome completo do comprador.|Texto|120|Sim|
|`Customer.Identity`|Número do documento de identificação do comprador.|Texto|16|Sim|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador. <br/> Possíveis valores: "CPF" ou "CNPJ".|Texto|255|Não|
|`Customer.Email`|E-mail do comprador.|Texto|100|Sim|
|`Customer.Birthdate`|Data de nascimento do comprador. <br/> Ex.: 1991-01-10.|Date|10|Sim|
|`Customer.Phone`|Número do telefone do comprador. <br/> Ex.: 5521976781114.|Texto|15|Sim|
|`Customer.Address.Street`|Logradouro do endereço de cobrança.|Texto|54|Sim|
|`Customer.Address.Number`|Número do endereço de cobrança.|Texto|5|Sim|
|`Customer.Address.Complement`|Complemento do endereço de cobrança.|Texto|14|Não|
|`Customer.Address.ZipCode`|CEP do endereço de cobrança.|Texto|9|Sim|
|`Customer.Address.City`|Cidade do endereço de cobrança.|Texto|50|Sim|
|`Customer.Address.State`|Estado do endereço de cobrança.|Texto|2|Sim|
|`Customer.Address.Country`|País do endereço de cobrança.<br/>Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui).|Texto|2|Sim|
|`Customer.Address.District`|Bairro do endereço de cobrança.|Texto|45|Sim|
|`Customer.DeliveryAddress.Street`|Logradouro do endereço de entrega.|Texto|54|Não|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega.|Texto|5|Não|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega.|Texto|14|Não|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega.|Texto|9|Não|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega.|Texto|50|Não|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega.|Texto|2|Não|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega.<br/>Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui).|Texto|2|Não|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega.|Texto|45|Não|
|`Payment.Provider`|Nome da provedora da autorização.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.<br/>Obs.: Somente o tipo "CreditCard" funciona com análise de fraude.|Texto|100|Sim|
|`Payment.Amount`|Valor da transação financeira, em centavos. <br/> Ex.: 150000 = R$ 1.500,00.|Número|15|Sim|
|`Payment.ServiceTaxAmount`|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço. <br/> Obs.: Esse valor não é adicionado ao valor da autorização.|Número|15|Não|
|`Payment.Currency`|Moeda na qual o pagamento será feito. <br/> Possíveis valores: "BRL" / "USD" / "MXN" / "COP" / "CLP" / "ARS" / "PEN" / "EUR" / "PYN" / "UYU" / "VEB" / "VEF" / "GBP".|Texto|3|Não|
|`Payment.Country`|País na qual o pagamento será realizado.|Texto|3|Não|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.Interest`|Tipo de parcelamento. <br/> Possíveis valores: "ByMerchant" (loja) / "ByIssuer" (emissor).|Texto|10|Não|
|`Payment.Capture`|Indica se a autorização deverá ser com captura automática. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade. <br/> Obs2.: Este campo deverá ser preenchido de acordo com o fluxo da análise de fraude.|Booleano|---|Não|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.<br/> Obs2. O campo `Payment.Recurrent` deve ser igual a "true" quando este for igual a "false".|Booleano|---|Não|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Este campo igual a "true" não irá criar uma recorrência; apenas permitirá a realização de uma transação sem a necessidade de envio do CVV, indicando para a adquirente que é a cobrança de uma transação de uma recorrência. <br/> Obs2.: Somente para transações **Cielo**. <br/> Obs3.: O campo `Payment.Authenticate` deve ser igual a "false" quando este for igual a "true".|Booleano|---|Não|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador. <br/> Obs.: O valor deste campo deve tornar fácil para o portador a identificação do estabelecimento onde foi realizada a compra, pois é um dos principais ofensores para chargeback.|Texto|13|Não|
|`Payment.DoSplit`|Indica se a transação será dividida entre vários participantes. <br/> Possíveis valores: "true" / "false" (default). <br/> Para utilizar a funcionalidade de split de pagamentos, é necessário a contratação da solução junto à Braspag.|Booleano|---|Não|
|`Payment.ExtraDataCollection.Name`|Identificador do campo extra que será enviado.|Texto|50|Não|
|`Payment.ExtraDataCollection.Value`|Valor do campo extra que será enviado.|Texto|1024|Não|
|`Payment.Credentials.Code`|Afiliação gerada pela adquirente.|Texto|100|Sim|
|`Payment.Credentials.Key`|Chave de afiliação/token gerado pela adquirente.|Texto|100|Sim|
|`Payment.Credentials.Username`|Usuário gerado no credenciamento com a adquirente **Getnet**. <br/> Obs.: O campo deve ser obrigatoriamente enviado se a transação é direcionada para Getnet.|Texto|50|Não|
|`Payment.Credentials.Password`|Senha gerada no credenciamento com a adquirente **Getnet**. <br/> Obs.: O campo deve ser obrigatoriamente enviado se a transação é direcionada para Getnet.|Texto|50|Não|
|`Payment.Credentials.Signature`|Id do terminal no credenciamento com a adquirente **Global Payments**. <br/> Obs.: O campo deve ser obrigatoriamente enviado se a transação é direcionada para Global Payments.|Texto|3|Não|
|`Payment.CreditCard.CardNumber`|Número do cartão de crédito.|Texto|16|Sim|
|`Payment.CreditCard.Holder`|Nome do portador impresso no cartão de crédito.|Texto|25|Sim|
|`Payment.CreditCard.ExpirationDate`|Data de validade do cartão de crédito.|Texto|7|Sim|
|`Payment.CreditCard.SecurityCode`|Código de segurança no verso do cartão de crédito.|Texto|4|Sim|
|`Payment.CreditCard.Brand`|Bandeira do cartão de crédito.|Texto|10|Sim |
|`Payment.CreditCard.SaveCard`|Indica se os dados do cartão de crédito serão armazenados no *Cartão Protegido*.|Booleano|---|Não|
|`Payment.CreditCard.Alias`|Alias (apelido) do cartão de crédito salvo no *Cartão Protegido*.|Texto|64|Não|
|`Payment.FraudAnalysis.Sequence`|Tipo de fluxo da análise de fraude. <br/> Possíveis valores: "AnalyseFirst" / "AuthorizeFirst".|Texto|14|Sim|
|`Payment.FraudAnalysis.SequenceCriteria`|Critério do fluxo da análise de fraude. <br/> Possíveis valores: "OnSuccess" / "Always".|Texto|9|Sim|
|`Payment.FraudAnalysis.Provider`|Provedor de *AntiFraude*. <br/> Possíveis valores: "Cybersource".|Texto|10|Sim|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indica se a transação após a análise de fraude será capturada. <br/> Possíveis valores: "true" / "false" (default) <br/> Obs1.: Quando enviado igual a "true" e o retorno da análise de fraude for de baixo risco ("*Accept*"), a transação anteriormente autorizada será capturada. <br/> Obs2.: Quando enviado igual a "true" e o retorno da análise de fraude for revisão ("*Review*"), a transação ficará autorizada, sendo capturada após a Braspag receber notificação de alteração do status para baixo risco ("*Accept*"). <br/> Obs3.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco (`FraudAnalysis.Sequence`) deve ser obrigatoriamente "AuthorizeFirst".|Booleano|---|Não|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indica se a transação após a análise de fraude será cancelada. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Quando enviado igual a "true" e o retorno da análise de fraude for de alto risco ("*Reject*"), a transação anteriormente autorizada será cancelada. <br/> Obs2.: Quando enviado igual a "true" e o retorno da análise de fraude for revisão ("*Review*"), a transação ficará autorizada, sendo cancelada após a Braspag receber notificação de alteração do status para alto risco ("*Reject*"). <br/> Obs3.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco (`FraudAnalysis.Sequence`) deve ser obrigatoriamente "AuthorizeFirst".|Booleano|---|Não|
|`Payment.FraudAnalysis.TotalOrderAmount`|Valor total do pedido, em centavos. <br/> Ex.: 123456 = R$ 1.234,56.|Número|15|Sim|
|`Payment.FraudAnalysis.FingerPrintId`|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas.|Texto|100|Sim|
|`Payment.FraudAnalysis.Browser.HostName`|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP.|Texto|60|Não|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifica se o browser do comprador aceita cookies. <br/> Possíveis valores: "true" / "false" (default).|Booleano|---|Sim|
|`Payment.FraudAnalysis.Browser.Email`|E-mail registrado no browser do comprador. Pode ser diferente do e-mail de cadastro na loja (`Customer.Email`).|Texto|100|Não|
|`Payment.FraudAnalysis.Browser.Type`|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP. <br/> Ex.: "Google Chrome", "Mozilla Firefox", "Safari", etc.|Texto|40|Não|
|`Payment.FraudAnalysis.Browser.IpAddress`|Endereço de IP do comprador. Formato IPv4 ou IPv6.|Texto|45|Sim|
|`Payment.FraudAnalysis.Cart.IsGift`|Indica se o pedido realizado pelo comprador é para presente.|Booleano|---|Não|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser devolvido à loja. <br/> Possíveis valores: "true" / "false" (default).|Booleano|---|Não|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Identifica a avaliação dos endereços de cobrança e entrega para diferentes cidades, estados ou países. <br/> [Lista de Valores - GiftCategory](#lista-de-valores-payment.fraudanalysis.cart.items[n].giftcategory). |Texto|9|Não| 
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude. <br/> [Lista de Valores - HostHedge](#lista-de-valores-payment.fraudanalysis.cart.items[n].hosthedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude. <br/> [Lista de Valores - NonSensicalHedge](#lista-de-valores-payment.fraudanalysis.cart.items[n].nonsensicalhedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude. <br/> [Lista de Valores - ObscenitiesHedge](#lista-de-valores-payment.fraudanalysis.cart.items[n].obscenitieshedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Nível de importância das verificações sobre os números de telefone do comprador na análise de fraude. <br/> [Lista de Valores - PhoneHedge](#lista-de-valores-payment.fraudanalysis.cart.items[n].phonehedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.Name`|Nome do produto.|Texto|255|Sim|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Quantidade do produto.|Número|15|Sim|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (*Stock Keeping Unit* - Unidade de Controle de Estoque) do produto.|Texto|255|Sim|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Preço unitário do produto, em centavos. <br/> Ex.: 10950 = R$ 109,50.|Número|15|Sim|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Nível de risco do produto associado a quantidade de chargebacks. <br/> [Lista de Valores - Risk](#lista-de-valores-payment.fraudanalysis.cart.items[n].risk).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Nível de importância, na análise de fraude, da hora do dia em que o comprador realizou o pedido. <br/> [Lista de Valores - TimeHedge](#lista-de-valores-payment.fraudanalysis.cart.items[n].timehedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.Type`|Categoria do produto. <br/> [Lista de Valores - Type](#lista-de-valores-payment.fraudanalysis.cart.items[n].type).|Texto|19|Não|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Nível de importância, na análise de fraude, da frequência de compra do comprador dentro dos 15 minutos anteriores. <br/> [Lista de Valores - VelocityHedge](#lista-de-valores-payment.fraudanalysis.cart.items[n].velocityhedge).|Texto|6|Não|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Id das informações adicionais a serem enviadas. <br/> [Tabela de MDDs](#tabela-de-mdds)|Número|2|Sim|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Valor das informações adicionais a serem enviadas. <br/> [Tabela de MDDs](#tabela-de-mdds)|Texto|255|Sim|
|`Payment.FraudAnalysis.Shipping.Addressee`|Nome completo do responsável a receber o produto no endereço de entrega.|Texto|120|Não|
|`Payment.FraudAnalysis.Shipping.Method`|Meio de entrega do pedido. <br/> [Lista de Valores - Method](#lista-de-valores-payment.fraudanalysis.shipping.method).|Texto|8|Não|
|`Payment.FraudAnalysis.Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega. <br/> Ex.: 552121114700.|Texto|15|Não|
|`Payment.FraudAnalysis.Travel.JourneyType`|Tipo de viagem. <br/> [Lista de Valores - JourneyType](#lista-de-valores-payment.fraudanalysis.travel.journeytype).|Texto|32|Não|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Data e hora de partida. <br/> Ex.: 2018-03-31 19:16:38.|DateTime|---|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Nome completo do passageiro.|Texto|120|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Número do documento do passageiro.|Texto|32|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Classificação da empresa aérea. <br/> [Lista de Valores - Status](#lista-de-valores-payment.fraudanalysis.travel.passengers[n].status).|Texto|15|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Tipo do passageiro. <br/> [Lista de Valores - Rating](#lista-de-valores-payment.fraudanalysis.travel.passengers[n].rating).|Texto|13|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|E-mail do passageiro.|Texto|255|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Telefone do passageiro. <br/> Ex.: 552121114700.|Texto|15|Não|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Código do aeroporto de partida.<br/> Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm).|Texto|3|Não|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Código do aeroporto de chegada.<br/> Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm).|Texto|3|Não|

<aside class="warning">Os campos do nó "FraudAnalysis.Travel" se tornam obrigatórios caso o segmento do seu negócio seja o aéreo.</aside>

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
         "CardNumber":"455187******0181",
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
            "DepartureTime":"2018-01-09 18:00",
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
            "DepartureTime":"2018-01-09 18:00",
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

|Propriedade|Descrição|Tipo|
|:-|:-|:-|
|`MerchantOrderId`|Número do pedido da loja.|Texto|
|`Customer.Name`|Nome completo do comprador.|Texto|
|`Customer.Identity`|Número do documento de identificação do comprador.|Texto|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador.|Texto|
|`Customer.Email`|E-mail do comprador.|Texto|
|`Customer.Birthdate`|Data de nascimento do comprador.|Date|
|`Customer.Phone`|Número do telefone do comprador.|Texto|
|`Customer.Address.Street`|Logradouro do endereço de cobrança.|Texto|
|`Customer.Address.Number`|Número do endereço de cobrança.|Texto|
|`Customer.Address.Complement`|Complemento do endereço de cobrança.|Texto|
|`Customer.Address.ZipCode`|CEP do endereço de cobrança.|Texto|
|`Customer.Address.City`|Cidade do endereço de cobrança.|Texto|
|`Customer.Address.State`|Estado do endereço de cobrança.|Texto|
|`Customer.Address.Country`|País do endereço de cobrança.|Texto|
|`Customer.Address.District`|Bairro do endereço de cobrança.|Texto|
|`Customer.DeliveryAddress.Street`|Logradouro do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega.|Texto|
|`Payment.Provider`|Nome da provedora da autorização.|Texto|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|
|`Payment.Amount`|Valor da transação financeira, em centavos.|Número|
|`Payment.ServiceTaxAmount`|Montante do valor da autorização que deve ser destinado à taxa de serviço.|Número|
|`Payment.Currency`|Moeda na qual o pagamento será feito.|Texto|
|`Payment.Country`|País na qual o pagamento será realizado.|Texto|
|`Payment.Installments`|Número de parcelas.|Número|
|`Payment.Interest`|Tipo de parcelamento.|Texto|
|`Payment.Capture`|Indica se a autorização deverá ser com captura automática.|Booleano|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada.|Booleano|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente.|Booleano|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador.|Texto|
|`Payment.DoSplit`|Indica se a transação será dividida entre vários participantes.|Booleano|
|`Payment.ExtraDataCollection.Name`|Identificador do campo extra que será enviado.|Texto|
|`Payment.ExtraDataCollection.Value`|Valor do campo extra que será enviado.|Texto|
|`Payment.Credentials.Code`|Afiliação gerada pela adquirente.|Texto|
|`Payment.Credentials.Key`|Chave de afiliação/token gerado pela adquirente.|Texto|
|`Payment.Credentials.Username`|Usuário gerado no credenciamento com a adquirente Getnet.|Texto|
|`Payment.Credentials.Password`|Senha gerada no credenciamento com a adquirente Getnet.|Texto|
|`Payment.Credentials.Signature`|Id do terminal no credenciamento com a adquirente Global Payments.|Texto|
|`Payment.CreditCard.CardNumber`|Número do cartão de crédito truncado.|Texto|
|`Payment.CreditCard.Holder`|Nome do portador impresso no cartão de crédito.|Texto|
|`Payment.CreditCard.ExpirationDate`|Data de validade do cartão de crédito.|Texto|
|`Payment.CreditCard.SecurityCode`|Código de segurança no verso do cartão de crédito.|Texto|
|`Payment.CreditCard.Brand`|Bandeira do cartão de crédito.|Texto|
|`Payment.CreditCard.SaveCard`|Indica se os dados do cartão de crédito foram armazenados no *Cartão Protegido*.|Booleano|
|`Payment.CreditCard.Alias`|Alias (apelido) do cartão de crédito salvo no *Cartão Protegido*.|Texto|
|`Payment.CreditCard.CardToken`|Identificador do cartão de crédito salvo no *Cartão Protegido*.|GUID|
|`Payment.FraudAnalysis.Sequence`|Tipo de fluxo da análise de fraude.|Texto|
|`Payment.FraudAnalysis.SequenceCriteria`|Critério do fluxo da análise de fraude.|Texto|
|`Payment.FraudAnalysis.Provider`|Provedor de *AntiFraude*.|Texto|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indica se a transação após a análise de fraude será capturada.|Booleano|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indica se a transação após a análise de fraude será cancelada.|Booleano|
|`Payment.FraudAnalysis.TotalOrderAmount`|Valor total do pedido, em centavos.|Número|
|`Payment.FraudAnalysis.FingerPrintId`|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador.|Texto|
|`Payment.FraudAnalysis.Browser.HostName`|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP.|Texto|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifica se o browser do comprador aceita cookies.|Booleano|
|`Payment.FraudAnalysis.Browser.Email`|E-mail registrado no browser do comprador. Pode ser diferente do e-mail de cadastro na loja (`Customer.Email`).|Texto|
|`Payment.FraudAnalysis.Browser.Type`|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP.|Texto|
|`Payment.FraudAnalysis.Browser.IpAddress`|Endereço de IP do comprador. Formato IPv4 ou IPv6.|Texto|
|`Payment.FraudAnalysis.Cart.IsGift`|Indica se o pedido realizado pelo comprador é para presente.|Booleano|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser devolvido à loja.|Booleano|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Identifica a avaliação dos endereços de cobrança e entrega para diferentes cidades, estados ou países.|Texto|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude.|Texto|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude.|Texto|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude.|Texto|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude.|Texto|
|`Payment.FraudAnalysis.Cart.Items.Name`|Nome do produto.|Texto|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Quantidade do produto.|Número|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (*Stock Keeping Unit* - Unidade de Controle de Estoque) do produto.|Texto|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Preço unitário do produto.|Número|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Nível de risco do produto associado à quantidade de chargebacks.|Texto|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Nível de importância, na análise de fraude, da hora do dia em que o comprador realizou o pedido.|Texto|
|`Payment.FraudAnalysis.Cart.Items.Type`|Categoria do produto.|Texto|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Nível de importância, na análise de fraude, da frequência de compra do comprador dentro dos 15 minutos anteriores.|Texto|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Id das informações adicionais a serem enviadas.|Número|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Valor das informações adicionais a serem enviadas.|Texto|
|`Payment.FraudAnalysis.Shipping.Addressee`|Nome completo do responsável a receber o produto no endereço de entrega.|Texto|
|`Payment.FraudAnalysis.Shipping.Method`|Meio de entrega do pedido.|Texto|
|`Payment.FraudAnalysis.Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega.|Número|
|`Payment.FraudAnalysis.Travel.JourneyType`|Tipo de viagem.|Texto|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Data e hora de partida.|DateTime|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Nome completo do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Número do documento do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Classificação da empresa aérea.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Tipo do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|E-mail do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Telefone do passageiro.|Número|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Código do aeroporto de partida.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Código do aeroporto de chegada.|Texto|
|`Payment.FraudAnalysis.Id`|Id da transação no *AntiFraude* Braspag.|GUID|
|`Payment.FraudAnalysis.Status`|Status da transação no *AntiFraude* Braspag. <br/> [Lista de Valores - Status](#lista-de-valores-payment.fraudanalysis.status).|Número|
|`Payment.FraudAnalysis.FraudAnalysisReasonCode`|Código de retorno da Cybersouce. <br/> [Lista de Valores - FraudAnalysisReasonCode](#lista-de-valores-payment.fraudanalysis.fraudanalysisreasoncode).|Número|
|`Payment.FraudAnalysis.ReplyData.AddressInfoCode`|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador. <br/> Os códigos são concatenados usando o caractere "^". Ex.: COR-BA^MM-BIN. <br/> [Lista de Valores - AddressInfoCode](#lista-de-valores-payment.fraudanalysis.replydata.addressinfocode).|Texto|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Códigos que afetaram a pontuação da análise. <br/> Os códigos são concatenados usando o caractere "^". Ex.: B^D^R^Z. <br/>[Lista de Valores - FactorCode](#lista-de-valores-payment.fraudanalysis.replydata.factorcode).|Texto|
|`Payment.FraudAnalysis.ReplyData.Score`|Score da análise de fraude. Valor entre 0 e 100.|Número|
|`Payment.FraudAnalysis.ReplyData.BinCountry`|Código do país do BIN do cartão usado na análise.<br/> Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui).|Texto|
|`Payment.FraudAnalysis.ReplyData.CardIssuer`|Nome do banco ou entidade emissora do cartão de crédito.|Texto|
|`Payment.FraudAnalysis.ReplyData.CardScheme`|Bandeira do cartão.|Texto|
|`Payment.FraudAnalysis.ReplyData.HostSeverity`|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto.|Número|
|`Payment.FraudAnalysis.ReplyData.InternetInfoCode`|Códigos que indicam problemas com o endereço de e-mail, endereço IP ou endereço de cobrança. <br/> Os códigos são concatenados usando o caractere "^". Ex.: FREE-EM^RISK-EM <br/> [Lista de Valores - InternetInfoCode](#lista-de-valores-payment.fraudanalysis.replydata.internetinfocode).|Texto|
|`Payment.FraudAnalysis.ReplyData.IpRoutingMethod`|Método de roteamento do comprador obtido a partir do endereço de IP. <br/> [Lista de Valores - IpRoutingMethod](#lista-de-valores-payment.fraudanalysis.replydata.iproutingmethod).|Texto|
|`Payment.FraudAnalysis.ReplyData.ScoreModelUsed`|Nome do modelo de score utilizado na análise. Caso não tenha nenhum modelo definido, o modelo padrão da Cybersource foi o utilizado.|Texto|
|`Payment.FraudAnalysis.ReplyData.CasePriority`|Define o nível de prioridade das regras ou perfis do lojista. O nível de prioridade varia entre 1 (maior) e 5 (menor). O valor padrão é 3, e é atribuído caso não se tenha definido a prioridade das regras ou perfis. Este campo será retornado somente se a loja for assinante do *Enhanced Case Management*.|Número|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Id da transação na Cybersource.|Texto|
|`Payment.PaymentId`|Identificador da transação no Pagador Braspag.|GUID|
|`Payment.AcquirerTransactionId`|Identificador da transação na adquirente.|Texto|
|`Payment.ProofOfSale`|Número do comprovante de venda na adquirente (NSU - Número Sequencial Único).|Texto|
|`Payment.AuthorizationCode`|Código de autorização na adquirente.|Texto|
|`Payment.ReceivedDate`|Data em que a transação foi recebida no Pagador Braspag. <br/> Ex.: 2018-01-16 16:38:19.|Datetime|
|`Payment.CapturedDate`|Data em que a transação foi capturada na adquirente. <br/> Ex.: 2018-01-16 16:38:20.|Datetime|
|`Payment.CapturedAmount`|Valor capturado da transação, em centavos. <br/> Ex.: 123456 = R$ 1.234,56.|Número|
|`Payment.ECI`|*Electronic Commerce Indicator*. Código gerado em uma transação de crédito com autenticação externa.|Texto|
|`Payment.ReasonCode`|Código de retorno da operação.|Texto|
|`Payment.ReasonMessage`|Mensagem de retorno da operação.|Texto|
|`Payment.Status`|Status da transação no Pagador. <br/> [Lista de Status da Transação](#lista-de-status-transação).|Número|
|`Payment.ProviderReturnCode`|Código retornado pela adquirente ou banco.|Texto|
|`Payment.ProviderReturnMessage`|Mensagem retornada pela adquirente ou banco.|Texto|

## Configuração do Fingerprint

Importante componente da análise de fraude, o *fingerprint* é um script (em Javascript) que deve ser inserido no seu site para capturar dados importantes do dispositivo utilizado pelo comprador, como IP da máquina, versão do browser e sistema operacional utilizados.
Muitas vezes, somente os dados do carrinho não são suficientes para garantir uma análise assertiva. Os dados coletados pelo fingerprint complementam a análise e garantem que sua loja esteja mais protegida.

Abaixo seguem as descrições de como configurar o fingerprint em sua página de checkout e mobiles. Para maiores detalhes, consulte [este artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360000212987-Detalhamento-da-implanta%C3%A7%C3%A3o-do-DeviceFingerPrint).

### Integração em Checkout

Ao integrar a tecnologia fingerprint em sua página de checkout, será necessário adicionar duas tags:

- a tag *script* dentro da tag *head* para uma performance correta;
- a tag *noscript* dentro da tag *body*, para que a coleta dos dados do dispositivo seja realizada mesmo se o Javascript do browser estiver desabilitado.

<aside class="warning">Se os 2 segmentos de código não forem colocados na página de checkout, os resultados da análise de fraude podem não ser precisos.</aside>

#### Variáveis

Existem duas variáveis a serem preenchidas na URL do Javascript. O `org_id` e o `session_id`. O `org_id` é um valor predefinido, de acordo com a tabela abaixo. Já o `session_id` é composto pela concatenação dos parâmetros `ProviderMerchantId` e `FraudAnalysis.FingerPrintId`, conforme exemplificado abaixo:

|Variável|Descrição|
|---|---|
|`org_id`|para Sandbox = "1snn5n9w" <br/> para Produção = "k8vif92e"|
|`session_id`|`ProviderMerchantId` = Identificador da sua loja na Cybersource. Caso não possua, entre em contato com a Braspag. <br/> `FraudAnalysis.FingerPrintId` = Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. <br/><br/> Obs.: Este identificador poderá ser qualquer valor ou então o número do pedido, mas deverá ser único durante 48 horas.|

#### Aplicação

O modelo do Javascript é o seguinte:

![Exemplo Código]({{ site.baseurl_root }}/images/braspag/af/exemploscriptdfp.png)

As variáveis, quando devidamente preenchidas, forneceriam uma URL semelhante ao exemplo abaixo:

![Exemplo Url](https://braspag.github.io/images/braspag/af/urldfp.png)

<aside class="warning">Certifique-se de copiar todos os dados corretamente e de ter substituído as variáveis pelos seus respectivos valores.</aside>

### Integração em Aplicativos Mobile

<aside class="notice">Solicite junto ao chamado de integração os SDKs (iOS e Android) e os manuais.</aside>

# Consultas

As formas de consultar uma transação ou venda dependem do seu tempo de vida, como especificado na tabela abaixo:

|TEMPO DE VIDA|FORMA DE CONSULTA|
|---|---|
|Até 3 meses|Pela API ou pelo Painel Admin Braspag.|
|De 3 a 12 meses|Pelo Painel Admin Braspag com a opção “Histórico” selecionada.|
|Acima de 12 meses|Por contato direto com seu Executivo Comercial Braspag.|

## Consultando uma Transação via PaymentID

Para que o nó `Chargeback` esteja contido no retorno, a Braspag deverá passar a receber os chargebacks da sua loja. Você poderá então acatar ou contestar as operações, acompanhando os resultados das contestações no Painel Admin Braspag. Através do Post de Notificação, sua loja poderá ser informada da transação que sofreu o chargeback.
As operações contidas no Painel Admin Braspag também estão disponíveis na [API Risk Notification](https://braspag.github.io//manual/risknotification).

Para que o nó `FraudAlert` esteja contido no retorno, a Braspag deverá passar a receber os alertas de fraude da sua loja, que ficarão disponíveis no Painel Admin Braspag. Através do Post de Notificação, a sua loja irá ser informada da transação que sofreu o alerta de fraude.

Para consultar uma transação de cartão de crédito, é necessário o envio de mensagem HTTP através do método GET para o recurso *Payment*, conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`PaymentId`|Número de identificação do pagamento. |Texto |36 |Sim|

### Resposta

```json
{
   "MerchantOrderId": "2017051001",
   "Customer": {
      "Name": "Nome do Cliente",
      "Identity": "01234567789",
      "Email": "cliente@email.com.br",
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
   "Merchant": {
      "Id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "TradeName": "Lojas Teste"
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
         "Brand": "Visa"
      },
      "ProofOfSale": "2539492",
      "AcquirerTransactionId": "0510042539492",
      "AuthorizationCode": "759497",
      "Eci": "0",
      "Refunds": [
         {
            "Amount": 10000,
            "Status": 3,
            "ReceivedDate": "2017-05-15 16:25:38"
         }
      ],
      "Chargebacks": [
         {
            "Amount": 10000,
            "CaseNumber": "123456",
            "Date": "2017-06-04",
            "ReasonCode": "104",
            "ReasonMessage": "Outras Fraudes - Cartao Ausente",
            "Status": "Received",
            "RawData": "Client did not participate and did not authorize transaction"
         }
      ],
      "FraudAlert": {
         "Date": "2017-05-20",
         "ReasonMessage": "Uso Ind Numeração",
         "IncomingChargeback": false
      },
      "VelocityAnalysis": {
         "Id": "f8078b32-be17-4c35-b164-ad74c3cd0725",
         "ResultMessage": "Accept",
         "Score": 0
      },
      "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-10 16:25:38",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 16:25:38",
      "VoidedAmount": 10000,
      "VoidedDate": "2017-05-15 16:25:38",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ProviderDescription": "Simulado",
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
      "Identity": "01234567789",
      "Email": "cliente@email.com.br",
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
   "Merchant": {
      "Id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "TradeName": "Lojas Teste"
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
         "Brand": "Visa"
      },
      "ProofOfSale": "2539492",
      "AcquirerTransactionId": "0510042539492",
      "AuthorizationCode": "759497",
      "Eci": "0",
      "Refunds": [
         {
            "Amount": 10000,
            "Status": 3,
            "ReceivedDate": "2017-05-15 16:25:38"
         }
      ],
      "Chargebacks": [
         {
            "Amount": 10000,
            "CaseNumber": "123456",
            "Date": "2017-06-04",
            "ReasonCode": "104",
            "ReasonMessage": "Outras Fraudes - Cartao Ausente",
            "Status": "Received",
            "RawData": "Client did not participate and did not authorize transaction"
         }
      ],
      "FraudAlert": {
         "Date": "2017-05-20",
         "ReasonMessage": "Uso Ind Numeração",
         "IncomingChargeback": false
      },
      "VelocityAnalysis": {
         "Id": "f8078b32-be17-4c35-b164-ad74c3cd0725",
         "ResultMessage": "Accept",
         "Score": 0
      },
      "PaymentId": "f8078b32-be17-4c35-b164-ad74c3cd0725",
      "Type": "CreditCard",
      "Amount": 10000,
      "ReceivedDate": "2017-05-10 16:25:38",
      "CapturedAmount": 10000,
      "CapturedDate": "2017-05-10 16:25:38",
      "VoidedAmount": 10000,
      "VoidedDate": "2017-05-15 16:25:38",
      "Currency": "BRL",
      "Country": "BRA",
      "Provider": "Simulado",
      "ProviderDescription": "Simulado",
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
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Texto alfanumérico|
|`Customer.Name`|Nome do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do cliente.|Texto |14 |Texto alfanumérico|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ).|Texto|255|CPF ou CNPJ|
|`Customer.Email`|Email do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Birthdate`|Data de nascimento do comprador.|Date|10|formato AAAA-MM-DD|
|`Customer.Address.Street`|Endereço de contato do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Address.Number`|Número do endereço de contato do comprador.|Texto|15|Texto alfanumérico|
|`Customer.Address.Complement`|Complemento do endereço de contato do comprador.|Texto|50|Texto alfanumérico|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador.|Texto|9|Texto alfanumérico|
|`Customer.Address.City`|Cidade do endereço de contato do comprador.|Texto|50|Texto alfanumérico|
|`Customer.Address.State`|Estado do endereço de contato do comprador.|Texto|2|Texto alfanumérico|
|`Customer.Address.Country`|Pais do endereço de contato do comprador|Texto|35|Texto alfanumérico|
|`Customer.Address.District`|Bairro do endereço de contato do comprador.|Texto |50 |Texto alfanumérico|
|`Customer.DeliveryAddress.Street`|Endereço de entrega do pedido.|Texto|255|Texto alfanumérico|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega do pedido.|Texto|15|Texto alfanumérico|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega do pedido.|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega do pedido.|Texto|9|Texto alfanumérico|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega do pedido.|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega do pedido.|Texto|2|Texto alfanumérico|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega do pedido.|Texto|35|Texto alfanumérico|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega do pedido. |Texto |50|Texto alfanumérico|
|`Merchant.Id`|Identificador da loja que efetuou essa transação.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Merchant.TradeName`|Nome da loja.|50|Texto alfanumérico|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15| Consulte os [anexos](#anexos).|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Ex.: CreditCard|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|10000|
|`Payment.ServiceTaxAmount`|Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização.|Número|15|10000|
|`Payment.Currency`|Moeda na qual o pagamento será feito.|Texto|3|BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|País na qual o pagamento será feito.|Texto|3|BRA|
|`Payment.Installments`|Número de parcelas.|Número|2|6|
|`Payment.Interest`|Tipo de parcelamento.|Texto|10|Loja ("ByMerchant") ou Emissor ("ByIssuer")|
|`Payment.Capture`|Indica se a autorização deve ser com captura automática ou não. Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|true / false (default)|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada ou não. Deverá verificar junto à adquirente a disponibilidade desta funcionalidade. `Authenticate` deve ser "false" quando `Recurrent` é "true".|Booleano|---|true / false (default)|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente ou não. Obs.: Este campo igual a "true" não irá originar uma nova recorrência; apenas permitirá a realização de uma transação sem a necessidade de envio do CVV. Somente para transações **Cielo**. `Authenticate` deve ser "false" quando `Recurrent` é "true".|Booleano|---|true / false (default)|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador.|Texto|13|Texto alfanumérico|
|`Payment.ExtraDataCollection.Name`|Nome do campo em que será gravado o dado extra.|Texto|50|Texto alfanumérico|
|`Payment.ExtraDataCollection.Value`|Valor do campo em que será gravado o dado extra.|Texto|1024|Texto alfanumérico|
|`Payment.AcquirerTransactionId`|Id da transação no provedor de meio de pagamento.|Texto|40|Texto alfanumérico|
|`Payment.ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`Payment.AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`Payment.Refunds.Amount`|Valor reembolsado, em centavos.|Número|15|10000|
|`Payment.Refunds.Status`|Status do reembolso.|Número|1|Received = 1<br/>Sent = 2<br/>Approved = 3<br/>Denied = 4<br/>Rejected = 5|
|`Payment.Refunds.ReceivedDate`|Data de recebimento do reembolso.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Chargebacks[n].Amount`|Valor do chargeback, em centavos.|Número|15|10000|
|`Payment.Chargebacks[n].CaseNumber`|Número do caso relacionado ao chargeback.|Texto|16|Texto alfanumérico|
|`Payment.Chargebacks[n].Date`|Data do chargeback.|Date|10|AAAA-MM-DD|
|`Payment.Chargebacks[n].ReasonCode`|Código do motivo do chargeback.<br/>[Lista de Valores - ReasonCode](#lista-de-valores-payment.chargebacks[n].reasoncode-e-payment.chargebacks[n].reasonmessage)|Texto|10|Texto alfanumérico|
|`Payment.Chargebacks[n].ReasonMessage`|Mensagem de motivo do chargeback.<br/>[Lista de Valores - ReasonMessage](#lista-de-valores-payment.chargebacks[n].reasoncode-e-payment.chargebacks[n].reasonmessage).|Texto|512|Texto alfanumérico|
|`Payment.Chargebacks[n].Status`|Status do chargeback. <br/> [Lista de Valores - Status](#lista-de-valores-payment.chargebacks[n].status)|Texto|32|Texto|
|`Payment.Chargebacks[n].RawData`|Dado enviado pela adquirente, podendo ser o titular do cartão ou outra mensagem.|Texto|512|Texto alfanumérico|
|`Payment.FraudAlert.Date`|Data do alerta de fraude.|Date|10|AAAA-MM-DD|
|`Payment.FraudAlert.ReasonMessage`|Mensagem de motivo do alerta de fraude.|Texto|512|Texto alfanumérico|
|`Payment.FraudAlert.IncomingChargeback`|Flag que identifica se a transação possui um chargeback ocorrido antes do alerta de fraude.|Booleano|5|Texto|
|`Payment.PaymentId`|Campo identificador do pedido.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Brapag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.ReasonCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`Payment.ReasonMessage`|Mensagem de retorno da adquirência.|Texto|512|Texto alfanumérico|
|`Payment.CapturedAmount`|Valor capturado.|Número|15|10000|
|`Payment.CapturedDate`|Data da captura.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.VoidedAmount`|Valor cancelado/estornado, em centavos.|Número|15|10000|
|`Payment.VoidedDate`|Data do cancelamento/estorno.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Status`|Status da transação.|Byte|2| Ex.: 1|
|`Payment.Provider`|Provider utilizado.|Texto|32|Simulado|
|`Payment.ProviderDescription`|Nome do adquirente que processou a transação.|Texto|512|Simulado|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|16|---|
|`CreditCard.Holder`|Nome do portador impresso no cartão.|Texto|25|---|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão.|Texto|7|MM/AAAA|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|---|
|`CreditCard.SaveCard`|Identifica se o cartão será salvo para gerar o token (*CardToken*).|Booleano|true / false (default)|

## Consultando uma Transação de Boleto via PaymentID

Para consultar uma transação de boleto registrado, é necessário o envio de mensagem HTTP do método GET para o recurso *Payment*, conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`PaymentId`|Número de identificação do pagamento. |GUID |36 |Sim|

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
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Texto alfanumérico|
|`Customer.Name`|Nome do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do cliente.|Texto |14 |Texto alfanumérico|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ).|Texto|255|CPF ou CNPJ|
|`Customer.Email`|E-mail do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Birthdate`|Data de nascimento do comprador.|Date|10|formato AAAA-MM-DD|
|`Customer.Address.Street`|Endereço de contato do comprador.|Texto|255|Texto alfanumérico|
|`Customer.Address.Number`|Número do endereço de contato do comprador.|Texto|15|Texto alfanumérico|
|`Customer.Address.Complement`|Complemento do endereço de contato do comprador.|Texto|50|Texto alfanumérico|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador.|Texto|9|Texto alfanumérico|
|`Customer.Address.City`|Cidade do endereço de contato do comprador.|Texto|50|Texto alfanumérico|
|`Customer.Address.State`|Estado do endereço de contato do comprador.|Texto|2|Texto alfanumérico|
|`Customer.Address.Country`|País do endereço de contato do comprador.|Texto|35|Texto alfanumérico|
|`Customer.Address.District`|Bairro do endereço de contato do comprador.|Texto |50 |Texto alfanumérico|
|`Customer.DeliveryAddress.Street`|Endereço de entrega do pedido.|Texto|255|Texto alfanumérico|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega do pedido.|Texto|15|Texto alfanumérico|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega do pedido.|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega do pedido.|Texto|9|Texto alfanumérico|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega do pedido.|Texto|50|Texto alfanumérico|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega do pedido.|Texto|2|Texto alfanumérico|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega do pedido.|Texto|35|Texto alfanumérico|
|`Customer.DeliveryAddress.District`|Bairro do comprador.|Texto |50 |Texto alfanumérico|
|`Payment.Provider`|Nome da provedora do meio de pagamento.|Texto|15| Consulta os provedores disponíveis nos anexos|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Ex.: Boleto|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|10000|
|`Payment.CapturedAmount`|Valor pago do boleto, em centavos.|Número|15|10000|
|`Payment.Instructions`|Texto sobre alguma instrução específica para o boleto.|Texto|Veja as [Regras Específicas por Banco](#conciliação-de-boletos).|Ex.: "Não pagar após o vencimento"|
|`Payment.Demonstrative`|Texto sobre alguma informação específica para o boleto.|Texto|Veja as [Regras Específicas por Banco](#conciliação-de-boletos).|Ex.: "Boleto referente ao pedido número 99999"|
|`Payment.Url`|URL para apresentação do boleto.|Texto|-|Ex.: "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX"|
|`Payment.BoletoNumber`|Nosso número.|Texto|Veja as [Regras Específicas por Banco](#conciliação-de-boletos).|Ex.: "12345678"|
|`Payment.BarCodeNumber`|Código de barras do boleto.|Texto|44|Ex.: "99999390276000001234864001834007775680099999"|
|`Payment.DigitableLine`|Linha digitável do boleto.|Texto|54|Ex.: "99999.39027 60000.012348 64001.834007 7 75680000199999"|
|`Payment.Assignor`|Nome do cedente do boleto.|Texto|200|Ex.: "RAZAO SOCIAL DA LOJA LTDA"|
|`Payment.Address`|Endereço do cedente do boleto.|Texto|160|Ex.: "Alameda Xingu 512"|
|`Payment.Identification`|CNPJ do cedente.|Texto|18|Ex.: "11.355.111/0001-11"|
|`Payment.ExpirationDate`|Data de vencimento do boleto.|Texto|AAAA-MM-DD|Ex.: "2018-06-21"|
|`Payment.CreditDate`|Data de crédito do valor pago do boleto.|Texto|AAAA-MM-DD|Ex.: "2018-06-19"|
|`Payment.CapturedDate`|Data de pagamento do boleto.|Texto|AAAA-MM-DD HH:mm:SS|Ex.: "2018-06-19 01:45:57"|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|AAAA-MM-DD HH:mm:SS|Ex.: "2018-06-19 01:45:57"|
|`Payment.ReturnUrl`|URL da loja para onde redireciona o cliente|Texto|-|Ex.: "https://www.loja.com.br"|
|`Payment.Currency`|Moeda na qual o pagamento será feito.|Texto|3|BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|País na qual o pagamento será feito.|Texto|3|BRA|
|`Payment.ExtraDataCollection.Name`|Nome do campo em que será gravado o dado extra.|Texto|50|Texto alfanumérico|
|`Payment.ExtraDataCollection.Value`|Valor do campo em que será gravado o dado extra.|Texto|1024|Texto alfanumérico|
|`Payment.PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.ReasonCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`Payment.Status`|Status da transação.|Byte|2| Ex.: 1|

## Consultando uma Venda pelo Identificador da Loja

Não é possível consultar um pagamento diretamente pelo identificador enviado pela loja (`MerchantOrderId`), mas é possível obter todos os `PaymentIds` associados ao identificador.

Para consultar uma venda pelo identificador da loja, é necessário o envio de mensagem HTTP do método GET para o recurso */sales*, conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`MerchantOrderId`|Campo identificador do pedido na loja. |Texto |36 |Sim|

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
|`PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Consultando um Pedido Recorrente

Para consultar um pedido de recorrência, é necessário o envio de mensagem HTTP do método GET conforme o exemplo:

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
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`RecurrentPaymentId`|Campo identificador da recorrência. |Texto |36 |Sim|

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
|`RecurrentPaymentId`|Campo identificador da próxima recorrência. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`NextRecurrency`|Data da próxima recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`StartDate`|Data do início da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`EndDate`|Data do fim da recorrência. |Texto |7 |05/2019 (MM/YYYY) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |"Monthly" / "Bimonthly" / "Quarterly" / "SemiAnnual" / "Annual"|
|`CurrentRecurrencyTry`|Número atual da tentativa de recorrência.|Número|1|1|
|`OrderNumber`|Identificação do pedido na loja. |Texto|50 |2017051101|
|`Status`|Status do pedido recorrente. |Número|1 |1 - Ativo / 2 - Finalizado / 3,4,5 - Inativo|
|`RecurrencyDay`|Dia da recorrência.|Número|2 |22 |
|`SuccessfulRecurrences`|Quantidade de recorrências realizadas com sucesso.|Número|2 |5|
|`RecurrentTransactions.RecurrentPaymentId`|Id da recorrência.|GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`RecurrentTransactions.TransactionId`|Payment ID da transação gerada na recorrência.|GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`RecurrentTransactions.PaymentNumber`|Número da recorrência. A primeira é zero. |Número|2 |3 |
|`RecurrentTransactions.TryNumber`|Número da tentativa atual na recorrência específica. |Número|2 |1 |

# Post de Notificação

Para receber a notificação de alteração de status, deve-se ter configurado o campo "URL Status Pagamento" durante o cadastro de sua loja na Braspag. Assim, você irá receber os parâmetros conforme demonstrado no exemplo:

> Resposta esperada da loja: `HTTP Status Code 200 OK`

Caso não seja retornada a resposta acima, haverá mais duas tentativas de envio do Post de Notificação.

<aside class="warning">Como existe a possibilidade de ocorrerem intermitências entre as APIs de envio e de recebimento, faz-se necessária a sondagem das transações pendentes (não pagas) que ainda não tenham sido atualizadas no dia.</aside>

```json
{
   "RecurrentPaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "ChangeType": "2"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`RecurrentPaymentId`|Identificador que representa o pedido recorrente (aplicável somente para `ChangeType` igual a 2 ou 4).|GUID|36|Não|
|`PaymentId`|Identificador que representa a transação.|GUID|36|Sim|
|`ChangeType`|Especifica o tipo de notificação. Obs.: Consulte a tabela abaixo. | Número | 1 |Sim|

|ChangeType|Descrição|
|----------|---------|
|1|Mudança de status do pagamento.|
|2|Recorrência criada.|
|3|Mudança de status do *AntiFraude*.|
|4|Mudança de status do pagamento recorrente (Ex.: desativação automática).|
|5|Estorno negado (aplicável para **Rede**).|
|6|Boleto registrado pago a menor.|
|7|Notificação de chargeback. <br/> Para mais detalhes, consulte o manual de [Risk Notification](https://braspag.github.io//manual/risknotification).|
|8|Alerta de fraude.|

# ANEXOS

## Lista de Providers

No caso da integração SOAP, consulte a lista de provedores (*providers*) com seus correspondentes meios de pagamento listados [neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360026794092-Lista-de-Payment-Method).<br/>
As listas a seguir se referem a provedores na integração REST:  

### Providers para Crédito

|Provider|Brand|Descrição|
|--------|-----|---------|
|Simulado|---|Provider de Sandbox|
|Cielo30|Visa, Master, Amex, Elo, Aura, Jcb, Diners, Discover, Hipercard, Hiper, Sorocred|Provider para transações na plataforma de e-commerce Cielo 3.0.|
|Getnet|Visa, Master, Elo, Amex, Hipercard|Provider para transações na plataforma de e-commerce Getnet.|
|Rede2|Visa, Master, Hipercard, Hiper, Diners, Elo, Amex, Sorocred|Provider para transações na plataforma de e-commerce da Rede (e-Rede) na versão REST.|
|GlobalPayments|Visa, Master, Elo, Hiper, Hipercard, Cabal, Amex|Provider para transações na plataforma de e-commerce Global Payments.|
|Stone|Visa, Master, Hipercard, Elo|Provider para transações na plataforma de e-commerce Stone.|
|Safra2|Visa, Master, Hipercard, Elo, Amex|Provider para transações na plataforma de e-commerce Safra.|
|FirstData|Visa, Master, Elo, Hipercard, Cabal, Amex|Provider para transações em guaranis (PYG), pesos argentinos (ARG) e reais (BRL) na plataforma de e-commerce First Data.|
|Sub1|Visa, Master, Diners, Amex, Discover, Cabal, Naranja e Nevada|Provider para transações em pesos argentinos (ARG) na plataforma legado Sub1 First Data.|
|Banorte|Visa, Master, Carnet|Provider para transações em pesos mexicanos (MXN) na plataforma de e-commerce Banorte.|
|Credibanco|Visa, Master, Diners, Amex, Credential|Provider para transações em pesos colombianos (COP) na plataforma de e-commerce Credibanco.|
|Transbank2|Visa, Master, Diners, Amex|Provider para transações em pesos chilenos (CLP) na plataforma de e-commerce Transbank.|
|Banese|Banese|Provider para transações com a bandeira BaneseCard.|
|BrasilCard|BrasilCard|Provider para transações com a bandeira BrasilCard.|
|Credz|Credz|Sistema de cartões em regime de bandeira privativa (Private Label Brand).|
|DMCard|---|Sistema de cartões em regime de bandeira privativa (Private Label Brand).|

### Providers para Débito

|Provider|Brand|Descrição|
|--------|-----|---------|
|Cielo|Visa, Master|Provider para transações de débito na plataforma legado Cielo 1.5.|
|Cielo30|Visa, Master|Provider para transações de débito na plataforma de e-commerce Cielo 3.0.|
|Getnet|Visa, Master|Provider para transações de débito na plataforma de e-commerce GetNet.|
|Rede2|Visa, Master|Provider para transações de débito na plataforma de e-commerce Rede.|
|Safra2|Visa, Master|Provider para transações de débito na plataforma de e-commerce Safra.|
|FirstData|Visa, Master|Provider para transações de débito na plataforma de e-commerce First Data.|
|GlobalPayments|Visa, Master|Provider para transações de débito na plataforma de e-commerce Global Payments.|

### Providers para Voucher

|Provider|Brand|Descrição|
|--------|-----|---------|
|Alelo|Elo|Provider para transações de voucher (vale refeição/alimentação) na plataforma Alelo.|
|Ticket|Ticket|Provider para transações de voucher (vale refeição/alimentação) na plataforma Ticket.|

### Providers para Zero Auth via VerifyCard

|Providers|
|--------|
|Simulado, Cielo30 (Cielo 3.0), Rede2 (e-Rede REST), Getnet, FirstData, GlobalPayments|

### Providers para Consulta BIN via VerifyCard

|Provider|
|--------|
|Simulado, Cielo30 (Cielo 3.0)|

### Providers para Boleto com Registro

|Provider|
|--------|
|Braspag, Bradesco2, BancoDoBrasil2, ItauShopline, Itau2, Santander2, Caixa2, CitiBank2, BankOfAmerica|

### Providers para Transferência Eletrônica (Débito Online)

|Provider|
|--------|
|Bradesco, BancoDoBrasil, SafetyPay, Itau, PayMeeRedirectCheckout, PayMeeSemiTransparent|

## Lista de Status da Transação

Lista de status retornados pela API:

|Código|Status do Pagamento|Meio de pagamento|Descrição|
|------|-------------------|-----------------|---------|
|0|NotFinished|Todos|Falha ao processar o pagamento.|
|1|Authorized|Todos|Meio de pagamento apto a ser capturado ou pago (boleto).|
|2|PaymentConfirmed|Todos|Pagamento confirmado e finalizado.|
|3|Denied|Cartões de crédito e débito (transferência eletrônica)|Pagamento negado por autorizador.|
|10|Voided|Todos|Pagamento cancelado.|
|11|Refunded|Cartões de crédito e débito|Pagamento cancelado/estornado.|
|12|Pending|Cartões de crédito e débito (transferência eletrônica). |Esperando retorno da instituição financeira.|
|13|Aborted|Todos|Pagamento cancelado por falha no processamento.|
|20|Scheduled|Cartão de crédito|Recorrência agendada.|

## Lista de Status do AntiFraude

| Código | Descrição  |
|:-------|:-----------|
| 0      | Unknown    |
| 1      | Accept     |
| 2      | Reject     |
| 3      | Review     |
| 4      | Aborted    |
| 5      | Unfinished |

## Tabela de MDDs

De acordo com a necessidade do seu negócio, é desenhada uma estratégia de risco considerando o nível de relevância dos campos MDD. Caso não sejam enviados, esses campos ainda serão cobrados durante a validação das transações de testes. Por esse motivo, solicitamos uma análise prévia da documentação e a sinalização dos campos cujo envio não será possível realizar.

<aside class="warning">Caso não possua algum dado, simplesmente ignore o campo correspondente; ou seja, não faça o envio do campo vazio.</aside>

**Nível de Relevância dos Campos MDD** <br/><br/>
1- Relevante <br/>
2- Muito Relevante <br/>
3- Extremamente Relevante <br/><br/>

|ID|Valor|Tipo|Nível de Relevância|Segmento|
|--|-----|----|-------------------|--------|
|1|Cliente efetua login. Possíveis valores: <*login_do_cliente*> (caso o cliente final efetue login no site para comprar) / "Guest" (caso o cliente final faça a compra como visitante). Obs.: **Não enviar** o campo caso um terceiro (ex.: um agente) realize a venda diretamente.|string|2|Todos|
|2|Quantidade de dias que a pessoa é cliente da loja. Ex.: 314.|int|3|Todos|
|3|Quantidade de parcelas do pedido.|int|3|Todos|
|4|Canal de venda. Possíveis valores: "Call Center" (compra pelo telefone) / "Web" (compra pela web) / "Portal" (compra através de agente) / "Quiosque" (compra em quiosque) / "Móvel" (compra por celular ou tablet). Obs.: Se "Call Center", fundamental o envio também do campo **39** - Nome de usuário do Call Center.|string|3|Todos|
|5|Código do cupom/desconto caso o cliente utilize na compra.|string|1|Todos|
|6|Quantidade em dias desde a última compra realizada pelo cliente. Ex.: 55.|int|3|Todos|
|7|Código ou nome do seller (vendedor).|string|1|Todos|
|8|Tentativas realizadas pelo cliente de efetuar o pagamento do mesmo pedido, podendo ser com diferentes cartões de créditos e/ou através de outros meios de pagamento.|int|2|Todos|
|9|Identifica se cliente irá retirar o produto na loja. Possíveis valores: "SIM" / "NAO". Obs.: Se "SIM", fundamental o envio também do campo **22** - Código da loja onde o produto será retirado.|string|3|Varejo ou Cosméticos|
|10|Identifica se o pagamento será realizado por outra pessoa que não esteja presente na viagem ou no pacote. Possíveis valores: "SIM" / "NAO".|string|3|Aéreo ou Turismo|
|11|Categoria do hotel (quantas estrelas). Possíveis valores: "1" (simples) / "2" (econômico) / "3" (turismo) / "4" (superior) / "5" (luxo).|int|3|Turismo|
|12|Quantidade em dias desde a data da compra até a data do checkin no hotel. Ex.: 123.|int|3|Turismo|
|13|Quantidade de diárias no hotel. Ex.: 5.|int|3|Turismo|
|14|Categoria da viagem ou pacote. Possíveis valores: "Nacional" / "Internacional" / "Nacional/Internacional".|string|3|Aéreo ou Turismo|
|15|Nome da companhia áerea / locadora de carro / hotel. Obs.: Enviar o nome de cada uma das empresas separado por "/".|string|2|Aéreo ou Turismo|
|16|Código PNR da reserva. Quando houver uma alteração da reserva para este PNR, com antecipação da data de voo, é importante fazer uma nova análise de fraude enviando este PNR novamente. Obs.: Este campo deverá ser enviado quando o campo **17** for igual a "SIM".|string|3|Aérea|
|17|Identifica se houve antecipação de reserva. Possíveis valores: "SIM" / "NAO". Obs.: Se "SIM", fundamental o envio também do campo **16** - Código PNR da reserva.|string|3|Aéreo|
|18|Categoria do veículo alugado. Possíveis valores: "1" (básico) / "2" (esportivo) / "3" (prime) / "4" (utilitário) / "5" (blindado).|string|3|Turismo|
|19|Identifica se o pacote refere-se a cruzeiro. Possíveis valores: "SIM" / "NAO".|string|2|Turismo|
|20|Decisão da análise de fraude referente à última compra. <br/> Possíveis valores: "ACEITA" / "REJEITADA".|string|3|Todos|
|21|Valor do frete. Ex.: 10599 = R$ 105,99.|long|1|Varejo ou Cosméticos|
|22|Código da loja onde o produto será retirado. Obs.: Este campo deverá ser enviado quando o campo **9** for igual a "SIM".|string|3|Varejo ou Cosméticos|
|23|Sufixo (4 últimos dígitos) do cartão de crédito.|int|1|Todos|
|24|Quantidade de dias desde a primeira compra realizada pelo cliente. Ex.: 150.|int|3|Todos|
|25|Sexo do cliente. Possíveis valores: "F" (feminino) / "M" (masculino).|string|2|Todos|
|26|Bin (6 primeiros dígitos) do cartão de crédito.|int|1|Todos|
|27|Tipo do logradouro do endereço de entrega. Possíveis valores: "R" (residencial) / "C" (comercial).|string|2|Todos|
|28|Tempo médio em minutos que o cliente levou para realizar a compra.|int|2|Todos|
|29|Quantidade de tentativas que o cliente realizou para efetuar login.|int|2|Todos|
|30|Quantidade de páginas web que o cliente visitou nos 30 minutos anteriores à compra.|int|2|Todos|
|31|Quantidade de trocas de número de cartão de crédito que o cliente efetuou para realizar o pagamento do pedido.|int|2|Todos|
|32|Identifica se o e-mail foi colado ou digitado. Possíveis valores: "Digitado" / "Colado".|string|3|Todos|
|33|Identifica se o número do cartão de crédito foi colado ou digitado. Possíveis valores: "Digitado" / "Colado".|string|3|Todos|
|34|Identifica se o e-mail foi confirmado para ativação de conta. Possíveis valores: "SIM" / "NAO".|string|2|Todos|
|35|Identifica o tipo de cliente. Possíveis valores: "Local" / "Turista".|string|2|Turismo|
|36|Identifica se foi utilizado cartão presente (GiftCard) na compra como forma de pagamento. Possíveis valores: "SIM" / "NAO".|string|1|Todos|
|37|Meio de envio do pedido. Possíveis valores: "Sedex" / "Sedex 10" / "1 Dia" / "2 Dias" / "Motoboy" / "Mesmo Dia".|string|3|Varejo ou Cosméticos|
|38|Número do telefone do cliente identificado através da bina quando venda é realizada através de Call Center. Formato: DDIDDDNúmero - Ex.: 552121114720. |string|3|Todos|
|39|Nome de usuário do Call Center. Obs.: Este campo deverá ser enviado quando o campo **4** for igual a "Call Center".|string|1|Todos|
|40|Comentários inseridos quando pedido é presente.|string|1|Todos|
|41|Tipo do documento. Possíveis valores: "CPF" / "CNPJ" / "Passaporte".|string|2|Todos|
|42|Idade do cliente.|int|2|Todos|
|43|Faixa de rendimento do cliente. Ex.: 100000 = R$ 1.000,00|long|2|Todos|
|44|Quantidade histórica de compras realizadas pelo cliente.|int|3|Todos|
|45|Identifica se é uma compra realizada por funcionário. Possíveis valores: "SIM" / "NAO".|string|2|Todos|
|46|Nome impresso (portador) no cartão de crédito.|string|3|Todos|
|47|Identifica se o cartão é *private label*. Possíveis valores: "SIM" / "NAO".|string|2|Todos|
|48|Quantidade de meios de pagamentos utilizados para efetuar a compra.|int|2|Todos|
|49|Valor médio das compras realizadas nos últimos 6 meses. <br/> Ex.: 159050 = R$ 1.590,99.|long|3|Todos|
|50|Fator de desvio de valor da compra atual sobre a média dos últimos 6 meses.|long|3|Todos|
|51|Identifica se é um cliente VIP com tratamento de risco diferenciado ou lista positiva. Possíveis valores: "SIM" / "NAO".|string|3|Todos|
|52|Categoria do produto. Possíveis valores: "Animais e Bichos de Estimação" / "Roupas e Acessórios" / "Negócios e Indústria" / "Câmeras e Óticas" / "Eletrônicos" / "Comidas, Bebidas e Cigarro" / "Móveis" / "Ferramentas" / "Saúde e Beleza" / "Casa e Jardim" / "Malas e Bagagens" / "Adulto" / "Armas e Munição" / "Materiais de Escritório" / "Religião e Cerimoniais" / "Software" / "Equipamentos de Esporte" / "Brinquedos e Jogos" / "Veículos e Peças" / "Livros" / "DVDs e Vídeos" / "Revistas e Jornais" / "Música" / "Outras Categorias Não Especificadas".|string|2|Todos|
|53|Identifica se existe rotina de confirmação de celular por SMS. Possíveis valores: "SIM" / "NAO".|string|2|Todos|
|54|2ª forma de pagamento.|string|2|Todos|
|55|3ª forma de pagamento.|string|2|Todos|
|56|Se a 2ª forma de pagamento for cartão de crédito, enviar a bandeira.|string|1|Todos|
|57|Se a 3ª forma de pagamento for cartão de crédito, enviar a bandeira.|string|1|Todos|
|58|Se 2ª forma de pagamento, informar o valor pago. Ex.: 128599 = R$ 1.285,99.|long|2|Todos|
|59|Se 3ª forma de pagamento, informar o valor pago. Ex.: 59089 = R$ 590,89.|long|2|Todos|
|60|Quantidade de dias desde a data da última alteração. Ex.: 57.|int|3|Todos|
|61|Identifica se houve alteração cadastral.|string|1|Todos|
|62|Quantidade de pontos trocados na última compra.|long|3|Fidelidade|
|63|Quantidade de pontos restantes no saldo.|long|2|Fidelidade|
|64|Quantidade de dias desde a última troca de pontos.|long|2|Fidelidade|
|65|Identificador do cliente no programa de fidelidade.|string|2|Fidelidade|
|66|Quantidade de minutos recarregados nos últimos 30 dias.|long|2|Digital Goods|
|67|Quantidade de recargas realizadas nos últimos 30 dias.|long|2|Digital Goods|
|68|Quantidade de dias entre a data de partida e a data de retorno.|int|2|Aéreo|
|69|Quantidade de passageiros viajando, independentemente da faixa etária.|int|2|Aéreo|
|70|Identificador do voô.|string|1|Aéreo|
|71|Número de infantes viajando.|int|2|Aéreo|
|72|Número de crianças viajando.|int|2|Aéreo|
|73|Número de adultos viajando.|int|2|Aéreo|
|74|Identifica se é um passageiro frequente (Frequent Flyer). Possíveis valores: "SIM" / "NAO".|string|2|Aéreo|
|75|Identificar do passageiro frequente (Frequent Flyer Number).|string|2|Aéreo|
|76|Categoria do passageiro frequente (Frequent Flyer). Esta categoria pode variar de acordo com a companhia aérea.|int|2|Aéreo|
|77|Dia da semana do embarque. Possíveis valores: "Sunday" (Domingo) / "Monday" (Segunda-feira) / "Tuesday" (Terça-feira) / "Wednesday" (Quarta-feira) / "Thursday" (Quinta-feira) / "Friday" (Sexta-feira) / "Saturday" (Sábado).|string|2|Aéreo|
|78|Código da companhia aérea. Ex.: "JJ" / "LA" / "AA" / "UA" / "G3" etc.|string|1|Aéreo|
|79|Classe tarifária da passagem. Ex.: "W" / "Y" / "N" etc.|string|2|Aéreo|
|80|Número do celular do passageiro. Formato: DDIDDDNúmero - Ex.: 5521976781114.|string|2|Aéreo|
|81|Identifica se o dono do cartão de crédito irá viajar. Possíveis valores: "SIM" / "NAO".|string|3|Aéreo|
|82|Identifica se o seller (vendedor) irá trabalhar com revisão manual ou não. Possíveis valores: "SIM" / "NAO".|string|1|Todos|
|83|Segmento de negócio. Ex.: Varejo.|string|2|Todos|
|84|Nome da plataforma integrada à API AntiFraude Gateway Braspag. Caso seja uma integração direta entre a loja e a Braspag, enviar valor igual a "PROPRIA".|string|3|Todos|
|85 a 89|Campos livres e definidos junto ao provedor de AntiFraude, conforme as regras de negócio.|---|---|---|
|90 a 100|Reservados.|---|---|---|

## Lista de HTTP Status Code

| HTTP Status Code | Descrição             |
|------------------|-----------------------|
| 200              | OK.                   |
| 400              | Bad Request.          |
| 404              | Resource Not Found.   |
| 500              | Internal Server Error.|

## Lista de Status da Recorrência

| Código | Descrição                 |
|--------|---------------------------|
| 1      | Active.                   |
| 2      | Finished.                 |
| 3      | DisabledByMerchant.       |
| 4      | DisabledMaxAttempts.      |
| 5      | DisabledExpiredCreditCard.|

## Lista de ReasonCode/ReasonMessage

| Reason Code | Reason Message               |
|-------------|------------------------------|
| 0           | Successful.                  |
| 1           | AffiliationNotFound.         |
| 2           | InsufficientFunds.           |
| 3           | CouldNotGetCreditCard.       |
| 4           | ConnectionWithAcquirerFailed.|
| 5           | InvalidTransactionType.      |
| 6           | InvalidPaymentPlan.          |
| 7           | Denied.                      |
| 8           | Scheduled.                   |
| 9           | Waiting.                     |
| 10          | Authenticated.               |
| 11          | NotAuthenticated.            |
| 12          | ProblemsWithCreditCard.      |
| 13          | CardCanceled.                |
| 14          | BlockedCreditCard.           |
| 15          | CardExpired.                 |
| 16          | AbortedByFraud.              |
| 17          | CouldNotAntifraud.           |
| 18          | TryAgain.                    |
| 19          | InvalidAmount.               |
| 20          | ProblemsWithIssuer.          |
| 21          | InvalidCardNumber.           |
| 22          | TimeOut.                     |
| 23          | CartaoProtegidoIsNotEnabled. |
| 24          | PaymentMethodIsNotEnabled.   |
| 98          | InvalidRequest.              |
| 99          | InternalError.               |

## Códigos de Erros da API

Códigos retornados em caso de erro, identificando o motivo do erro e suas respectivas mensagens.

|Código|Mensagem|Descrição|
|------|--------|---------|
|0|Internal error|Dado enviado excede o tamanho do campo.|
|100|RequestId is required|Campo enviado está vazio ou inválido.|
|101|MerchantId is required|Campo enviado está vazio ou inválido.|
|102|Payment Type is required|Campo enviado está vazio ou inválido.|
|103|Payment Type can only contain letters|Caracteres especiais não permitidos.|
|104|Customer Identity is required|Campo enviado está vazio ou inválido.|
|105|Customer Name is required|Campo enviado está vazio ou inválido.|
|106|Transaction ID is required|Campo enviado está vazio ou inválido.|
|107|OrderId is invalid or does not exist|Campo enviado excede o tamanho ou contém caracteres especiais. |
|108|Amount must be greater or equal to zero|Valor da transação deve ser maior que "0".|
|109|Payment Currency is required|Campo enviado está vazio ou inválido.|
|110|Invalid Payment Currency|Campo enviado está vazio ou inválido.|
|111|Payment Country is required|Campo enviado está vazio ou inválido.|
|112|Invalid Payment Country|Campo enviado está vazio ou inválido.|
|113|Invalid Payment Code|Campo enviado está vazio ou inválido.|
|114|The provided MerchantId is not in correct format|O MerchantId enviado não é um GUID.|
|115|The provided MerchantId was not found|O MerchantID não existe ou pertence a outro ambiente. (Ex.: Sandbox).|
|116|The provided MerchantId is blocked|Loja bloqueada, entre em contato com o suporte Braspag.|
|117|Credit Card Holder is required|Campo enviado está vazio ou inválido.|
|118|Credit Card Number is required|Campo enviado está vazio ou inválido.|
|119|At least one Payment is required|Nó `Payment` não enviado.|
|120|Request IP not allowed. Check your IP White List|IP bloqueado por questões de segurança.|
|121|Customer is required|Nó `Customer` não enviado.|
|122|MerchantOrderId is required|Campo enviado está vazio ou inválido.|
|123|Installments must be greater or equal to one|Número de parcelas deve ser superior a 1.|
|124|Credit Card is Required|Campo enviado está vazio ou inválido.|
|125|Credit Card Expiration Date is required|Campo enviado está vazio ou inválido.|
|126|Credit Card Expiration Date is invalid|Campo enviado está vazio ou inválido.|
|127|You must provide CreditCard Number|Número do cartão de crédito é obrigatório.|
|128|Card Number length exceeded|Número do cartão superior a 16 dígitos.|
|129|Affiliation not found|Meio de pagamento não vinculado à loja ou Provider inválido.|
|130|Could not get Credit Card|---|
|131|MerchantKey is required|Campo enviado está vazio ou inválido.|
|132|MerchantKey is invalid|O Merchantkey enviado não é válido.|
|133|Provider is not supported for this Payment Type|Provider enviado não existe.|
|134|FingerPrint length exceeded|Dado enviado excede o tamanho do campo.|
|135|MerchantDefinedFieldValue length exceeded|Dado enviado excede o tamanho do campo.|
|136|ItemDataName length exceeded|Dado enviado excede o tamanho do campo.|
|137|ItemDataSKU length exceeded|Dado enviado excede o tamanho do campo.|
|138|PassengerDataName length exceeded|Dado enviado excede o tamanho do campo.|
|139|PassengerDataStatus length exceeded|Dado enviado excede o tamanho do campo.|
|140|PassengerDataEmail length exceeded|Dado enviado excede o tamanho do campo.|
|141|PassengerDataPhone length exceeded|Dado enviado excede o tamanho do campo.|
|142|TravelDataRoute length exceeded|Dado enviado excede o tamanho do campo.|
|143|TravelDataJourneyType length exceeded|Dado enviado excede o tamanho do campo.|
|144|TravelLegDataDestination length exceeded|Dado enviado excede o tamanho do campo.|
|145|TravelLegDataOrigin length exceeded|Dado enviado excede o tamanho do campo.|
|146|SecurityCode length exceeded|Dado enviado excede o tamanho do campo.|
|147|Address Street length exceeded|Dado enviado excede o tamanho do campo.|
|148|Address Number length exceeded|Dado enviado excede o tamanho do campo.|
|149|Address Complement length exceeded|Dado enviado excede o tamanho do campo.|
|150|Address ZipCode length exceeded|Dado enviado excede o tamanho do campo.|
|151|Address City length exceeded|Dado enviado excede o tamanho do campo.|
|152|Address State length exceeded|Dado enviado excede o tamanho do campo.|
|153|Address Country length exceeded|Dado enviado excede o tamanho do campo.|
|154|Address District length exceeded|Dado enviado excede o tamanho do campo.|
|155|Customer Name length exceeded|Dado enviado excede o tamanho do campo.|
|156|Customer Identity length exceeded|Dado enviado excede o tamanho do campo.|
|157|Customer IdentityType length exceeded|Dado enviado excede o tamanho do campo.|
|158|Customer Email length exceeded|Dado enviado excede o tamanho do campo.|
|159|ExtraData Name length exceeded|Dado enviado excede o tamanho do campo.|
|160|ExtraData Value length exceeded|Dado enviado excede o tamanho do campo.|
|161|Boleto Instructions length exceeded|Dado enviado excede o tamanho do campo.|
|162|Boleto Demostrative length exceeded|Dado enviado excede o tamanho do campo.|
|163|Return Url is required|URL de retorno não é valida - Não são aceitas paginação ou extensões (EX.: PHP) na URL de retorno.|
|166|AuthorizeNow is required|---|
|167|Antifraud not configured|AntiFraude não vinculado ao cadastro do lojista.|
|168|Recurrent Payment not found|Recorrência não encontrada.|
|169|Recurrent Payment is not active|Recorrência não está ativa. Execução paralizada.|
|170|Cartão Protegido not configured|Cartão protegido não vinculado ao cadastro do lojista.|
|171|Affiliation data not sent|Falha no processamento do pedido, entre em contato com o suporte Braspag.|
|172|Credential Code is required|Falha na validação das credenciadas enviadas.|
|173|Payment method is not enabled|Meio de pagamento não vinculado ao cadastro do lojista.|
|174|Card Number is required|Campo enviado está vazio ou inválido.|
|175|EAN is required|Campo enviado está vazio ou inválido.|
|176|Payment Currency is not supported|Campo enviado está vazio ou inválido.|
|177|Card Number is invalid|Campo enviado está vazio ou inválido.|
|178|EAN is invalid|Campo enviado está vazio ou inválido.|
|179|The max number of installments allowed for recurring payment is 1|Campo enviado está vazio ou inválido.|
|180|The provided Card PaymentToken was not found|Token do cartão protegido não encontrado.|
|181|The MerchantIdJustClick is not configured|Token do cartão protegido bloqueado.|
|182|Brand is required|Bandeira do cartão não enviado.|
|183|Invalid customer bithdate|Data de nascimento inválida ou futura.|
|184|Request could not be empty|Falha no formato da requisição. Verifique o código enviado.|
|185|Brand is not supported by selected provider|Bandeira não suportada pela API Braspag.|
|186|The selected provider does not support the options provided (Capture, Authenticate, Recurrent or Installments)|Meio de pagamento não suporta o comando enviado.|
|187|ExtraData Collection contains one or more duplicated names|---|
|188|Avs with CPF invalid|---|
|189|Avs with length of street exceeded|Dado enviado excede o tamanho do campo.|
|190|Avs with length of number exceeded|Dado enviado excede o tamanho do campo.|
|190|Avs with length of complement exceeded|Dado enviado excede o tamanho do campo.|
|191|Avs with length of district exceeded|Dado enviado excede o tamanho do campo.|
|192|Avs with zip code invalid|CEP enviado é inválido.|
|193|Split Amount must be greater than zero|Valor para realização do SPLIT deve ser superior a 0.|
|194|Split Establishment is Required|SPLIT não habilitado para o cadastro da loja.|
|195|PlatformId is required|Validados de plataformas não enviado.|
|196|DeliveryAddress is required|Campo obrigatório não enviado.|
|197|Street is required|Campo obrigatório não enviado.|
|198|Number is required|Campo obrigatório não enviado.|
|199|ZipCode is required|Campo obrigatório não enviado.|
|200|City is required|Campo obrigatório não enviado.|
|201|State is required|Campo obrigatório não enviado.|
|202|District is required|Campo obrigatório não enviado.|
|203|Cart item name is required|Campo obrigatório não enviado.|
|204|Cart item quantity is required|Campo obrigatório não enviado.|
|205|Cart item type is required|Campo obrigatório não enviado.|
|206|Cart item name length exceeded |Dado enviado excede o tamanho do campo.|
|207|Cart item description length exceeded |Dado enviado excede o tamanho do campo.|
|208|Cart item sku length exceeded |Dado enviado excede o tamanho do campo.|
|209|Shipping addressee sku length exceeded |Dado enviado excede o tamanho do campo.|
|210|Shipping data cannot be null|Campo obrigatório não enviado.|
|211|WalletKey is invalid|Dados da Visa Checkout invalidos.|
|212|Merchant Wallet Configuration not found|Visa Checkout não vinculado a conta do lojista.|
|213|Credit Card Number is invalid|Cartão de crédito enviado é invalido.|
|214|Credit Card Holder Must Have Only Letters|Portador do cartão não deve conter caracteres especiais.|
|215|Agency is required in Boleto Credential|Campo obrigatório não enviado.|
|216|Customer IP address is invalid|IP bloqueado por questões de segurança.|
|300|MerchantId was not found|---|
|301|Request IP is not allowed|---|
|302|Sent MerchantOrderId is duplicated|---|
|303|Sent OrderId does not exist|---|
|304|Customer Identity is required|---|
|306|Merchant is blocked|---|
|307|Transaction not found|Transação não encontrada ou não existente no ambiente.|
|308|Transaction not available to capture|Transação não pode ser capturada - Entre em contato com o suporte Braspag.|
|309|Transaction not available to void|Transação não pode ser cancelada - Entre em contato com o suporte Braspag.|
|310|Payment method does not support this operation|Comando enviado não suportado pelo meio de pagamento.|
|311|Refund is not enabled for this merchant|Cancelamento após 24 horas não liberado para o lojista.|
|312|Transaction not available to refund|Transação não permite cancelamento após 24 horas.|
|313|Recurrent Payment not found|Transação recorrente não encontrada ou não disponivel no ambiente.|
|314|Invalid Integration|---|
|315|Cannot change NextRecurrency with pending payment|---|
|316|Cannot set NextRecurrency to past date|Não é permitido alterar a data da recorrência para uma data passada.|
|317|Invalid Recurrency Day|---|
|318|No transaction found|---|
|319|Smart Recurrency is not enabled|Recorrência não vinculada ao cadastro do lojista.|
|320|Cannot Update Affiliation because this recurrency has no affiliation saved|---|
|321|Cannot Set EndDate to before next recurrency|---|
|322|Zero Dollar Auth is not enabled|Zero Dollar não vinculado ao cadastro do lojista.|
|323|Bin Query is not enabled|Consulta de Bins não vinculada ao cadastro do lojista.|

## Cartões para Teste (Simulado)

O *Simulado* é um meio de pagamento que emula a utilização de pagamentos com cartão de crédito. Com esse meio de pagamento, é possível simular todos os fluxos de *Autorização*, *Captura* e *Cancelamento*.

Para melhor utilização do meio de pagamento simulado, estamos disponibilizando cartões de testes na tabela abaixo.

Os status das transações serão conforme a utilização de cada cartão.

|Status da Transação|Cartões para realização dos testes|Código de Retorno|Mensagem de Retorno|
|-------------------|----------------------------------|-----------------|-------------------|
|Autorizado|0000.0000.0000.0000 / 0000.0000.0000.0001 / 0000.0000.0000.0004|4|Operação realizada com sucesso|
|Não Autorizado|0000.0000.0000.0002|05|Não Autorizada|
|Não Autorizado|0000.0000.0000.0003|57|Cartão Expirado|
|Não Autorizado|0000.0000.0000.0005|78|Cartão Bloqueado|
|Não Autorizado|0000.0000.0000.0006|99|Time Out|
|Não Autorizado|0000.0000.0000.0007|77|Cartão Cancelado|
|Não Autorizado|0000.0000.0000.0008|70|Problemas com o Cartão de Crédito|
|Autorização Aleatória|0000.0000.0000.0009|4 / 99|Operation Successful / Time Out|

As informações de código de segurança (CVV) e validade podem ser aleatórias, mantendo o seu formato - "3 dígitos" (CVV) e "MM/YYYY" (Validade). Não utilize pontos ou separadores entre os números do cartão utilizado.

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].GiftCategory

|Valor|Descrição|
|:-|:-|
|Yes|Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido.|
|No|Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default).|
|Off|Diferenças entre os endereços de cobrança e entrega não afetam a pontuação.|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].HostHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa.|
|Normal|Normal (default).|
|High|Alta.|
|Off|Não irá afetar o score da análise de fraude.|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].NonSensicalHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa.|
|Normal|Normal (default).|
|High|Alta.|
|Off|Não irá afetar o score da análise de fraude.|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].ObscenitiesHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa.|
|Normal|Normal (default).|
|High|Alta.|
|Off|Não irá afetar o score da análise de fraude.|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].TimeHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa.|
|Normal|Normal (default).|
|High|Alta.|
|Off|Não irá afetar o score da análise de fraude.|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].PhoneHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa.|
|Normal|Normal (default).|
|High|Alta.|
|Off|Não irá afetar o score da análise de fraude.|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].VelocityHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa.|
|Normal|Normal (default).|
|High|Alta.|
|Off|Não irá afetar o score da análise de fraude.|

## Lista de Valores - Payment.FraudAnalysis.Cart.Items[n].Type

|Valor|Descrição|
|:-|:-|
|AdultContent|Conteúdo adulto.|
|Coupon|Cupom aplicado para todo o pedido.|
|Default|Valor padrão para o tipo do produto. Quando não enviado nenhum outro valor, assume-se o tipo sendo este.|
|ElectronicGood|Produto eletrônico diferente de software.|
|ElectronicSoftware|Softwares distribuídos eletronicamente via download.|
|GiftCertificate|Vale presente.|
|HandlingOnly|Taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda. Ex.: Taxa de conveniência / Taxa de instalação.|
|Service|Serviço que será realizado para o cliente.|
|ShippingAndHandling|Valor do frete e taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda.|
|ShippingOnly|Valor do frete.|
|Subscription|Assinatura. Ex.: Streaming de vídeos / Assinatura de notícias.|

## Lista de Valores - Payment.FraudAnalysis.Shipping.Method

|Valor|Descrição|
|:-|:-|
|SameDay|Meio de entrega no mesmo dia.|
|OneDay|Meio de entrega no próximo dia.|
|TwoDay|Meio de entrega em dois dias.|
|ThreeDay|Meio de entrega em três dias.|
|LowCost|Meio de entrega de baixo custo.|
|Pickup|Retirada na loja.|
|Other|Outro meio de entrega.|
|None|Sem meio de entrega, pois é um serviço ou assinatura.|

## Lista de Valores - Payment.FraudAnalysis.Travel.JourneyType

|Valor|Descrição|
|:-|:-|
|OneWayTrip|Viagem somente de ida.|
|RoundTrip|Viagem de ida e volta.|

## Lista de Valores - Payment.FraudAnalysis.Travel.Passengers[n].Rating

|Valor|Descrição|
|:-|:-|
|Adult|Adulto.|
|Child|Criança.|
|Infant|Infante.|

## Lista de Valores - Payment.FraudAnalysis.Travel.Passengers[n].Status

|Valor|
|:-|
|Standard|
|Gold|
|Platinum|

## Lista de Valores - Payment.FraudAnalysis.Status

|Valor|Descrição|
|:-|:-|
|Accept|Transação aceita após análise de fraude.|
|Review|Transação em revisão após análise de fraude.|
|Reject|Transação rejeitada após análise de fraude.|
|Pendent|Transação pendente, pois ao enviar a mesma para análise de fraude ocorreu um timeout na resposta entre Braspag e Cybersource.|
|Unfinished|Transação não finalizada por algum motivo de validação de contrato ou erro interno.|
|ProviderError|Transação com erro no provedor ao ser enviada para análise.|

## Lista de Valores - Payment.FraudAnalysis.FraudAnalysisReasonCode

|Valor|Descrição|
|:-|:-|
|100|Operação realizada com sucesso.|
|101|A transação enviada para análise de fraude necessita de um ou mais campos. Verificar no response o campo `ProviderAnalysisResult.Missing`. Possível ação: Reenviar a transação com a informação completa.|
|102|A transação enviada para análise de fraude possui um ou mais campos com valores inválidos. Verificar no response o campo `ProviderAnalysisResult.Invalid`. Possível ação: Reenviar a transação com as informações corretas.|
|150|Erro interno. Possível ação: Aguarde alguns minutos e tente reenviar a transação.|
|151|A transação foi recebida, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor. Possível ação: Aguarde alguns minutos e tente reenviar a transação.|
|152|O pedido foi recebido, mas ocorreu time-out. Possível ação: Aguarde alguns minutos e tente reenviar a transação.|
|202|Transação recusada pois o cartão expirou ou a data de validade não coincide com a correta. Possível ação: Solicite outro cartão ou outra forma de pagamento.|
|231|Transação recusada pois o cartão é inválido. Possível ação: Solicite outro cartão ou outra forma de pagamento.|
|234|Problema com a configuração da loja na Cybersource. Possível ação: Entre em contato com o suporte para corrigir o problema de configuração.|
|400|A pontuação de fraude ultrapassa o seu limite. Possível ação: Reveja a transação do comprador.|
|480|A transação foi marcada como revisão pelo DM (Decision Manager).|
|481|A transação foi rejeitada pelo DM (Decision Manager).|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.AddressInfoCode

|Valor|Descrição
|:-|:-|
|COR-BA|O endereço de cobrança pode ser normalizado.|
|COR-SA|O endereço de entrega pode ser normalizado.|
|INTL-BA|O país do endereço de cobrança está fora dos EUA.|
|INTL-SA|O país do endereço de entrega está fora dos EUA.|
|MIL-USA|Endereço militar nos EUA.|
|MM-A|Os endereços de cobrança e entrega usam nomes de ruas diferentes.|
|MM-BIN|O BIN do cartão (seis primeiros dígitos do número do cartão) não corresponde ao país.|
|MM-C|Os endereços de cobrança e entrega usam cidades diferentes.|
|MM-CO|Os endereços de cobrança e entrega usam países diferentes.|
|MM-ST|Os endereços de cobrança e entrega usam estados diferentes.|
|MM-Z|Os endereços de cobrança e entrega usam códidos postais diferentes.|
|UNV-ADDR|O endereço é inverificável.|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.FactorCode

|Valor|Descrição|
|:-|:-|
|A|Mudança de endereço excessiva. O comprador mudou o endereço de cobrança duas ou mais vezes nos últimos seis meses.|
|B|BIN do cartão ou autorização de risco. Os fatores de risco estão relacionados com BIN de cartão de crédito e/ou verificações de autorização do cartão.|
|C|Elevado número de cartões de créditos. O comprador tem usado mais de seis números de cartões de crédito nos últimos seis meses.|
|D|Impacto do endereço de e-mail. O comprador usa um provedor de e-mail gratuito ou o endereço de email é arriscado.|
|E|Lista positiva. O comprador está em sua lista positiva.|
|F|Lista negativa. O número da conta, endereço, endereço de e-mail ou endereço IP para este fim aparece em sua lista negativa.|
|G|Inconsistências de geolocalização. O domínio do comprador de e-mail, número de telefone, endereço de cobrança, endereço de envio ou endereço IP é suspeito.|
|H|Excessivas mudanças de nome. O comprador mudou o nome duas ou mais vezes nos últimos seis meses.|
|I|Inconsistências de internet. O endereço IP e de domínio de e-mail não são consistentes com o endereço de cobrança.|
|N|Entrada sem sentido. O nome do comprador e os campos de endereço contêm palavras sem sentido ou idioma.|
|O|Obscenidades. Dados do comprador contêm palavras obscenas.|
|P|Identidade *morphing*. Vários valores de um elemento de identidade estão ligados ao valor de um elemento de identidade diferente. Por exemplo, vários números de telefones estão ligados a um número de conta única.|
|Q|Inconsistências do telefone. O número de telefone do comprador é suspeito.|
|R|Ordem arriscada. A transação, o comprador e o lojista mostram informações correlacionadas de alto risco.|
|T|Cobertura *time*. O comprador está tentanto uma compra fora do horário esperado.|
|U|Endereço não verificável. O endereço de cobrança ou de entrega não pode ser verificado.|
|V|O cartão foi usado muitas vezes nos últimos 15 minutos.|
|W|Marcado como suspeito. O endereço de cobrança ou de entrega é semelhante a um endereço previamente marcado como suspeito.|
|Y|O endereço, cidade, estado ou país dos endereços de cobrança e entrega não se correlacionam.|
|Z|Valor inválido. Como a solicitação contém um valor inesperado, foi substituído por um valor padrão. Embora a transação ainda possa ser processada, examinar o pedido com cuidado para detectar anomalias.|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.InternetInfoCode

|Valor|Descrição|
|:-|:-|
|FREE-EM|O endereço de e-mail do comprador é de um provedor de e-mail gratuito.|
|INTL-IPCO|O país do endereço de e-mail do comprador está fora dos EUA.|
|INV-EM|O endereço de e-mail do comprador é inválido.|
|MM-EMBCO|O domínio do endereço de e-mail do comprador não é consistente com o país do endereço de cobrança.|
|MM-IPBC|O endereço de e-mail do comprador não é consistente com a cidade do endereço de cobrança.|
|MM-IPBCO|O endereço de e-mail do comprador não é consistente com o país do endereço de cobrança.|
|MM-IPBST|O endereço IP do comprador não é consistente com o estado no endereço de cobrança. No entanto, este código de informação não pode ser devolvido quando a inconsistência é entre estados imediatamente adjacentes.|
|MM-IPEM|O endereço de e-mail do comprador não é consistente com o endereço IP.|
|RISK-EM|O domínio do e-mail do comprador (por exemplo, *mail.example.com*) está associado com alto risco.|
|UNV-NID|O endereço IP do comprador é de um proxy anônimo. Estas entidades escondem completamente informações sobre o endereço de IP.|
|UNV-RISK|O endereço IP é de origem de risco.|
|UNV-EMBCO|O país do endereço de e-mail não corresponde ao país do endereço de cobrança.|

## Lista de Valores - Payment.FraudAnalysis.ReplyData.IpRoutingMethod

|Valor|Descrição|
|:-|:-|
|Anonymizer|Endereços de IP estão escondidos porque o comprador é extremamente cauteloso, quer privacidade absoluta ou é fraudulento.|
|AOL, AOL dialup, AOL POP and AOL proxy|Membros da AOL. Na maioria dos casos, o país pode ser identificado, mas o estado e cidade não.|
|Cache proxy|Proxy usado através de um acelerador da internet ou de uma distribuição de conteúdo de serviço. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP.|
|Fixed|O endereço de IP está próximo ou no mesmo local que o comprador.|
|International proxy|Proxy que contém tráfego de vários países. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa.|
|Mobile gateway|Gateway para conectar dispositivos móveis à internet. Muitas operadoras, especialmente na Europa, atendem a mais do que um país e o tráfego ocorre através de hubs de rede centralizados. O comprador pode estar localizado em um país diferente do indicado pelo endereço de IP.|
|POP|Discagem do comprador em um ISP regional provavelmente perto da localização do endereço de IP, mas possivelmente através de limites geográficos.|
|Regional proxy|Proxy que contém tráfego de vários estados dentro de um único país. O comprador pode estar localizado em um estado diferente do indicado pelo endereço de IP. Em muitos casos, redes corporativas estão roteando o tráfego de escritórios internacionais através de um ponto central, muitas vezes a sede corporativa.|
|Satellite|Conexões por satélite. Se o uplink e o downlink estiverem cadastrados, o método "roteamento" é considerado padrão porque o remetente é conhecido. No entanto, se o downlink não está registrado, o comprador pode estar em qualquer lugar dentro do feixe padrão do satélite, que pode abranger um continente ou mais.|
|SuperPOP|O comprador está discando em um ISP multi-estatal ou multinacional que provavelmente não é compativel à localização do endereço de IP. O comprador pode estar discando através de limites geográficos.|
|No value returned|O tipo de roteamento é desconhecido.|

## Lista de Valores - Payment.Chargebacks[n].Status

|Valor|Descrição|
|:-|:-|
|Received|Chargeback recebido da adquirente.|
|AcceptedByMerchant|Chargeback aceito pela loja. Neste caso a loja entende que sofreu de fato um chargeback e não irá realizar a contestação.|
|ContestedByMerchant|Chargeback contestado pela loja. Neste caso a loja enviou os documentos necessários para tentar reverter o chargeback.|

## Lista de Valores - Payment.Chargebacks[n].ReasonCode e Payment.Chargebacks[n].ReasonMessage

|Código|Descrição|Bandeira|Fraude?|
|:-|:-|:-|:-|
|137|Mercadoria / Serviço cancelado.|Visa|Não|
|127|Dados inválidos.|Visa|Não|
|113|Não autorizada.|Visa|Não|
|136|Crédito não processado.|Visa|Não|
|125|Valor incorreto.|Visa|Não|
|132|Recorrência cancelada.|Visa|Não|
|123|Moeda incorreta.|Visa|Não|
|133|Mercadoria / Serviço defeituoso ou diferente do descrito.|Visa|Não|
|112|Autorização recusada.|Visa|Não|
|134|Mercadoria falsificada.|Visa|Não|
|135|Venda enganosa.|Visa|Não|
|102|Responsabilidade EMV - Sem falsificação.|Visa|Sim|
|101|Responsabilidade EMV - Falsificação.|Visa|Sim|
|122|Código de transação incorreto.|Visa|Não|
|105|Programa Visa de Monitoramento de Fraude.|Visa|Sim|
|126|Processamento duplicado / pago por outros meios.|Visa|Não|
|131|Mercadoria / Serviços não recebidos.|Visa|Não|
|103|Outras Fraudes - cartão presente.|Visa|Sim|
|121|Apresentação tardia.|Visa|Não|
|111|Boletim de recuperação de cartões.|Visa|Não|
|137|Transação de crédito original não aceita.|Visa|Não|
|104|Outras fraudes - cartão ausente.|Visa|Sim|
|124|Número de conta incorreto.|Visa|Não|
|4846|Código correto da moeda da transação não fornecido.|Master|Não|
|4857|Transação telefônica ativada por cartão.|Master|Não|
|4859|Serviços não prestados.|Master|Não|
|4812|Número da conta não consta no arquivo (inexistente).|Master|Não|
|4807|Arquivo Boletim de Advertência.|Master|Não|
|4808|Autorização requerida não obtida.|Master|Não|
|4870|Transferência de responsabilidade do chip.|Master|Sim|
|4853|Desacordo comercial.|Master|Não|
|4847|Excede o limite de piso - transação não autorizada.|Master|Não|
|4837|Sem autorização do portador do cartão.|Master|Sim|
|4871|Transf. de responsabilidade do chip/senha (Europa).|Master|Sim|
|4849|Estabelecimento comercial de atividades suspeitas.|Master|Sim|
|4841|Transação recorrente cancelada.|Master|Não|
|4842|Apresentação tardia.|Master|Não|
|4855|Mercadoria não recebida.|Master|Não|
|4850|Portador não reconhece.|Master|Sim|
|4840|Processamento fraudulento da transação.|Master|Sim|
|4863|Portador Não Reconhece a Transação Potencial de|Master|Sim|
|4831|Valor da Transação é diferente|Master|Não|
|4854|Contestação do Portador de Cartão (EUA)|Master|Sim|
|4860|Crédito Não Processado|Master|Não|
|4834|Erro de processamento|Master|Não|
|4862|Transação Falsificada por Fraude da Tarja Magnética|Master|Sim|
|4835|Cartão Inválido ou Vencido|Master|Não|
|4554|Bens e Serviços Não Recebidos|Amex|Não|
|4515|Pagamento por outros meios|Amex|Não|
|4527|Ausência de Impressão|Amex|Sim|
|4523|Número de Conta de Associado do Cartão Não Atribuído|Amex|Não|
|4517|Cópia atendida ilegível/incompleta|Amex|Não|
|4752|Erro de Apresentação de Crédito/Débito|Amex|Não|
|4530|Discrepância de Moeda|Amex|Não|
|4516|Cópia não atendida|Amex|Não|
|4799|Trans. de Resp. por Fraude Perda Roubo não rec.|Amex|Sim|
|4536|Apresentação Tardia|Amex|Não|
|4750|Débito de Aluguel de Carro Não Qualificado|Amex|Não|
|4755|Sem Autorização Válida|Amex|Não|
|4553|Mercadoria Defeituosa ou Não Conforme Descrita|Amex|Não|
|4754|Contestação Regulatória/Legal Local|Amex|Não|
|4540|Cartão não presente|Amex|Sim|
|4544|Cancelamento de Bens/Serviços Recorrentes|Amex|Não|
|4513|Crédito não processado|Amex|Não|
|4534|ROCs Múltiplos|Amex|Não|
|4763|Direito de Regresso Integral por Fraude|Amex|Sim|
|4507|Valor da Transação Incorreto ou Número de Conta|Amex|Não|
|4798|Transferência de Responsabilidade por Fraude|Amex|Sim|
|4521|Autorização inválida|Amex|Não|
|4512|Múltiplos processamentos|Amex|Não|
|41|Transação Recorrente Cancelada|Elo|Não|
|71|Autorização Negada|Elo|Não|
|74|Apresentação Tardia|Elo|Não|
|75|Portador não se lembra da transação|Elo|Sim|
|62|Transação falsificada (Transferência de Responsabilidade)|Elo|Sim|
|82|Duplicidade de Processamento|Elo|Não|
|53|Mercadoria com defeito ou em desacordo|Elo|Não|
|83|Fraude em Ambiente de Cartão Não Presente|Elo|Sim|
|80|Valor da Transação ou número de cartão incorreto|Elo|Não|
|76|Moeda inválida|Elo|Não|
|30|Serviço Não Prestado ou Mercadoria Não recebida|Elo|Não|
|72|Sem Autorização|Elo|Não|
|85|Crédito Não Processado|Elo|Não|
|73|Cartão Vencido|Elo|Não|
|81|Fraude em Ambiente de Cartão Presente|Elo|Sim|
|70|Cartão em Boletim|Elo|Não|
|86|Pagamentos por outros Meios|Elo|Não|
|4812|Número da Conta Não Consta no Arquivo (inexistente)|Diners|Não|
|4841|Transação Recorrente Cancelada|Diners|Não|
|4850|Portador Não Reconhece|Diners|Sim|
|4846|Código Correto da Moeda da Transação Não Fornecido|Diners|Não|
|4847|Excede o Limite de Piso - Transação Não Autorizada|Diners|Não|
|4859|Serviços Não Prestados|Diners|Não|
|4831|Valor da Transação é diferente|Diners|Não|
|4849|Estabelecimento Comercial de Atividades Suspeitas|Diners|Sim|
|4835|Cartão Inválido ou Vencido|Diners|Não|
|4842|Apresentação Tardia|Diners|Não|
|4807|Arquivo Boletim de Advertência|Diners|Não|
|4871|Transf. de Responsabilidade do Chip/Senha (Europa)|Diners|Sim|
|4855|Mercadoria Não Recebida|Diners|Não|
|4808|Autorização requerida não Obtida|Diners|Não|
|4837|Sem Autorização do Portador do Cartão|Diners|Sim|
|4840|Processamento Fraudulento da Transação|Diners|Sim|
|4853|Desacordo Comercial|Diners|Não|
|4834|Erro de processamento|Diners|Não|
|4808|Autorização requerida não Obtida|Hipercard|Não|
|4834|Erro de processamento|Hipercard|Não|
|4860|Crédito Não Processado|Hipercard|Não|
|4857|Transação Telefônica Ativada por Cartão|Hipercard|Não|
|4850|Portador Não Reconhece|Hipercard|Sim|
|4807|Arquivo Boletim de Advertência|Hipercard|Não|
|4859|Serviços Não Prestados|Hipercard|Não|
|4862|Transação Falsificada por Fraude da Tarja Magnética|Hipercard|Sim|
|4849|Estabelecimento Comercial de Atividades Suspeitas|Hipercard|Sim|
|4853|Desacordo Comercial|Hipercard|Não|
|4837|Sem Autorização do Portador do Cartão|Hipercard|Sim|
|4847|Excede o Limite de Piso - Transação Não Autorizada|Hipercard|Não|
|4871|Transf. de Responsabilidade do Chip/Senha (Europa)|Hipercard|Sim|
|4812|Número da Conta Não Consta no Arquivo (inexistente|Hipercard|Não|
|4831|Valor da Transação é diferente|Hipercard|Não|
|4840|Processamento Fraudulento da Transação|Hipercard|Sim|
|4841|Transação Recorrente Cancelada|Hipercard|Não|
|4870|Transferência de Responsabilidade do Chip|Hipercard|Sim|
|4863|Portador Não Reconhece a Transação|Hipercard|Sim|
|4842|Apresentação Tardia|Hipercard|Não|
|4854|Contestação do Portador de Cartão (EUA)|Hipercard|Sim|
|4855|Mercadoria Não Recebida|Hipercard|Não|
|4835|Cartão Inválido ou Vencido|Hipercard|Não|
|4846|Código Correto da Moeda da Transação Não Fornecido|Hipercard|Não|
