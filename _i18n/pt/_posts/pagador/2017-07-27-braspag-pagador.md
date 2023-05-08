---
layout: manual
title: Manual de Integração - API Rest
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
sort_order: 1
hub_visible: false
tags:
    - 1. Pagador
language_tabs:
  json: JSON
  shell: cURL
  
---

# Introdução à API do Pagador

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar o seu e-commerce com a API do Pagador, gateway de pagamentos da Braspag, descrevendo os serviços disponíveis com exemplos de requisição e resposta.

## Principais Benefícios

A solução [API Pagador](https://suporte.braspag.com.br/hc/pt-br/articles/360013153791-O-que-%C3%A9-o-Pagador-){:target="_blank"} foi desenvolvida com a tecnologia REST, que é padrão de mercado e independe da tecnologia utilizada por nossos clientes. Desta forma, é possível integrar-se utilizando as mais variadas linguagens de programação, tais como: *ASP, ASP.Net, Java, PHP, Ruby* e *Python*.

Conheça alguns dos atributos que se destacam no Gateway de Pagamentos:

* **Ausência de aplicativos proprietários**: não é necessário instalar aplicativos no ambiente da loja virtual em nenhuma hipótese.
* **Simplicidade**: o protocolo utilizado é puramente o HTTPS.
* **Facilidade de testes**: a plataforma Braspag oferece um ambiente Sandbox publicamente acessível, que permite ao desenvolvedor a criação de uma conta de testes sem a necessidade de credenciamento, facilitando e agilizando o início da integração.
* **Credenciais**: as credenciais do cliente (número de afiliação e chave de acesso) trafegam no cabeçalho da requisição HTTP.
* **Segurança**: a troca de informações se dá sempre entre o servidor da loja e o servidor da Braspag, ou seja, sem o browser do comprador.
* **Integração multiplataforma**: a integração é realizada através de APIs REST, que permitem a utilização de diferentes aplicações.

## Arquitetura da Integração

O modelo empregado na integração das APIs é simples e se baseia na utilização de duas URLs:
* URL transacional - específica para operações como autorização, captura e cancelamento de transações.
* URL de consulta - para operações consultivas, como uma pesquisa de transações.

<br/>Para executar uma operação:

1. Combine a **base** da URL do ambiente com o **_endpoint_** da operação desejada. Ex.: https://api.braspag.com.br/*v2/sales/*.
2. Envie a requisição para a URL utilizando o método HTTP adequado à operação.

|Método HTTP|Descrição|
|---|---|
|**GET**|Retorna recursos já existentes, ex.: consulta de transações.|
|**POST**|Cria um novo recurso, ex.: criação de uma transação.|
|**PUT**|Atualiza um recurso existente, ex.: captura ou cancelamento de uma transação previamente autorizada.|

Todas a operações requerem as credenciais de acesso **"Merchant ID"** e **"Merchant Key"**, que devem ser enviadas no cabeçalho (*header*) da requisição.<br>
<br>Cada envio de requisição irá retornar um código de [Status HTTP](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code){:target="_blank"}, indicando se ela foi realizada com sucesso ou não.

## Ambientes de Teste e Produção

Utilize o ambiente **Sandbox** para realizar testes dos nossos produtos e serviços antes de disponibilizar sua solução no ambiente de **Produção**.

<aside class="notice">Credenciais de acesso são utilizadas para autenticar todas as requisições feitas para os endpoints da API.</aside>
<aside class="warning">Por segurança, essas credenciais não devem ser indevidamente compartilhadas ou expostas.</aside>

### Ambiente Sandbox

Para a fase de testes, crie uma conta em nosso sandbox e experimente as nossas APIs sem compromisso.

|Informação|Descrição|
|----|----|
|Credenciais de acesso|`MerchantId` e `MerchantKey` recebidos após criação da conta de testes em [Cadastro do Sandbox](https://cadastrosandbox.braspag.com.br/){:target="_blank"}.|
|Base da URL transacional|https://apisandbox.braspag.com.br/|
|Base da URL para consultas|https://apiquerysandbox.braspag.com.br/|

### Ambiente de Produção

Realizados os testes, disponibilize sua solução em ambiente de produção.

|Informação|Descrição|
|---|---|
|Credenciais de acesso|`MerchantId` e `MerchantKey` fornecidos pela Braspag. Envie um email para *comercial@braspag.com.br* para mais informações.|
|Base da URL transacional|https://api.braspag.com.br/|
|Base da URL para consultas|https://apiquery.braspag.com.br/|

## Termos Transacionais

Para que possa aproveitar melhor todos os recursos disponíveis em nossa API, é importante você antes conhecer os seguintes conceitos envolvidos no processamento de uma transação de cartão de crédito:

|Etapa|Descrição|
|---|---|
|**Autorização**|Operação que viabiliza o processamento de uma venda com um cartão de crédito. A autorização (também chamada pré-autorização) irá sensibilizar o limite do cliente, mas ainda não irá gerar cobrança em sua fatura|
|**Captura**|Confirmação necessária para que a cobrança seja efetivada. O tempo limite para capturar uma transação pré-autorizada varia entre adquirentes, mas pode ser de até 5 dias após a data da pré-autorização.|
|**Captura Automática**|Opção que permite que a transação possa ser **autorizada** e **capturada** num mesmo momento, isentando o lojista de enviar a confirmação.|
|**Cancelamento**|Recurso de cancelamento de compra aplicável no dia em que a transação foi autorizada/capturada. No caso de uma transação apenas **autorizada**, o cancelamento irá liberar o limite do cartão que foi sensibilizado. Se a transação já tiver sido **capturada**, o cancelamento irá desfazer a venda, mas somente quando executado até às 23:59:59 da data da autorização/captura.|
|**Estorno**|Recurso de cancelamento de compra aplicável no dia seguite ao da captura da transação. Neste caso, a transação será submetida ao processo de estorno pela adquirente.|

<aside class="warning">Uma transação autorizada somente gera o crédito para o lojista depois de capturada.</aside>
<br><br>
Os seguintes recursos são oferecidos, podendo ser aplicados em diferentes momentos do seu fluxo transacional:

|Termo|Descrição|
|---|---|
|**Antifraude**|Plataforma de prevenção à fraude que fornece uma análise de risco detalhada das compras on-line. Este processo é totalmente transparente para o portador do cartão. De acordo com os critérios preestabelecidos, o pedido pode ser automaticamente aceito, recusado ou encaminhado para análise manual. Leia mais na seção [Pagamentos com Análise de Fraude](#pagamentos-com-análise-de-fraude) ou consulte o manual [Antifraude](https://braspag.github.io//manual/antifraude){:target="_blank"}.|
|**Autenticação**|Processo que possibilita passagem da venda por autenticação do emissor do cartão, trazendo com isso mais segurança para a venda e transferindo para o emissor o risco de fraude. Leia mais na seção [Autenticando uma Transação](#autenticando-uma-transação) ou consulte o manual [Autenticação 3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"}.|
|**Cartão Protegido**|Plataforma que permite o armazenamento seguro de dados sensíveis de cartão de crédito no formato de *token*. Com a plataforma, a loja poderá oferecer recursos como "*Compra com 1 clique*" e "*Retentativa*" de envio de transação, sempre preservando a integridade e a confidencialidade das informações. Leia mais na seção [Salvando e Reutilizando Cartões](#salvando-e-reutilizando-cartões) ou consulte o manual [Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest){:target="_blank"}.|

## Suporte Braspag

<aside class="notice">A Braspag oferece suporte de alta disponibilidade. Atendemos de segunda a sexta, das 9h às 19h, através de telefone de emergência 24 horas por dia e de ferramenta via web. Contamos com equipe que poderá atender em português, inglês e espanhol.</aside>

Acesse nossa ferramenta de atendimento web [Zendesk](http://suporte.braspag.com.br/){:target="_blank"} e consulte o nosso artigo [Atendimento Braspag](https://suporte.braspag.com.br/hc/pt-br/articles/360006721672-Atendimento-Braspag){:target="_blank"} para mais informações sobre nosso serviço de suporte. 

# Meios de Pagamento

A API do Pagador trabalha com transações referentes às seguintes formas de pagamento: cartão de crédito, cartão de débito, pix, QR Code, boleto bancário, transferência eletrônica, *Buy Now Pay Later* (BNPL), e-wallet e voucher. O fluxo da transação depende dos serviços utilizados e das configurações escolhidas pela loja.

Veja abaixo a representação de um **fluxo transacional** padrão seguida de uma pequena descrição das principais partes envolvidas:

![Fluxo Transacional]({{ site.baseurl_root }}/images/fluxo-transacional-pt-menor.png)

* **Plataforma de e-commerce:** provê solução técnica para lojistas construírem toda a infraestrutura e processos necessários para sua operação de e-commerce.
* **Gateway:** conecta e-commerces com os serviços de pagamento (adquirente, boleto, emissor), facilitando a gestão dos fornecedores de pagamento pelos lojistas.
* **Adquirente:** faz a conexão da transação com as bandeiras e liquida a transação para os lojistas.
* **Bandeira:** faz a comunicação com o emissor do cartão da transação e liquida a transação para os adquirentes.
* **Emissor:** dá crédito e armazena o dinheiro do comprador. Na transação, aprova ou nega por razões de saldo, validade do cartão ou fraude. Liquida a transação para a bandeira.

<br/>**Nota:** Para evitar que a duplicidade de pedidos ocorra durante uma transação, o Pagador possui a opção de bloqueio de pedidos duplicados que, quando habilitado, retorna o código de erro "302", informando que o `MerchantOrderId` enviado está duplicado. Para saber mais detalhes sobre essa feature, consulte [este artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360030183991){:target="_blank"}.

## Cartões de Crédito e Débito

### Criando uma Transação de Crédito

Veja abaixo a representação de um **fluxo transacional** padrão na criação de uma transação de crédito:
![Fluxo Cartão de Crédito]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/cartao-de-credito.png)

Ao solicitar a **autorização** de uma transação de crédito, é necessário seguir o contrato abaixo. Os dados referentes à sua afiliação são enviados no nó `Payment.Credentials` e devem ser enviados sempre que uma nova requisição de autorização for submetida para aprovação.

Caso a sua loja utilize os serviços de *Retentativa* ou *Loadbalance*, as afiliações devem ser cadastradas pela equipe de suporte ao cliente. Para solicitar o cadastro de afiliações, [clique aqui](https://suporte.braspag.com.br/hc/pt-br/requests/new){:target="_blank"} e envie sua requisição.

<aside class="warning">IMPORTANTE: O número de identificação do pedido (MerchantOrderId) não sofre alteração, se mantendo o mesmo ao longo de todo o fluxo transacional. Contudo, um número adicional (SentOrderId) pode ser gerado para o pedido e utilizado durante a transação. Esse número (SentOrderId) só será diferente em caso de adequação a regras da adquirente ou em caso de números de identificação do pedido (MerchantOrderId) repetidos.</aside>

Os parâmetros contidos dentro dos nós `Address` e `DeliveryAddress` são de preenchimento **obrigatório** quando a transação é submetida ao [Antifraude](https://braspag.github.io//manual/antifraude){:target="_blank"} ou à análise do [Velocity](https://braspag.github.io//manual/velocity){:target="_blank"}. Na tabela de parâmetros, mais abaixo, esses parâmetros aparecem marcados com um * na coluna de obrigatoriedade.

Seguem exemplos de envio de requisição e resposta para criar uma transação de crédito:

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
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|GUID|36|Não (envio no *header*)|
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
|`Payment.Provider`|Nome do provedor do meio de pagamento. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-providers) para acessar a lista de provedores.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "CreditCard".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.ServiceTaxAmount`|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização.|Número|15|Não|
|`Payment.Currency`|Moeda em que o pagamento será feito (BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP).|Texto|3|Não|
|`Payment.Country`|País em que o pagamento será feito.|Texto|3|Não|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.Interest`|Tipo de parcelamento - Loja ("ByMerchant") ou Emissor ("ByIssuer").|Texto|10|Não|
|`Payment.Capture`|Indica se a autorização deve ser com captura automática ("true") ou não ("false"). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|Não (default "false")|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada ("true") ou não ("false"). Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|Não (default "false")|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente ("true") ou não ("false"). O valor "true" não originará uma nova recorrência, apenas permitirá a realização de uma transação sem a necessidade de envio do CVV. `Authenticate` deve ser "false" quando `Recurrent` é "true". **Somente para transações Cielo, Cielo30 e Rede2.**|Booleano|---|Não (default "false")|
|`Payment.SoftDescriptor`|Valor que será concatenado com o valor de cadastro na adquirente para identificação na fatura.|Texto|13|Não|
|`Payment.DoSplit`|Indica se a transação será dividida entre várias contas ("true") ou não ("false").|Booleano|---|Não (default "false")|
|`Payment.ExtraDataCollection.Name`|Nome do campo que será gravado como dado extra.|Texto|50|Não|
|`Payment.ExtraDataCollection.Value`|Valor do campo que será gravado como dado extra.|Texto|1024|Não|
|`Payment.Credentials.Code`|Afiliação gerada pela adquirente.|Texto|100|Condicional**|
|`Payment.Credentials.Key`|Chave de afiliação/token gerado pela adquirente.|Texto|100|Condicional**|
|`Payment.Credentials.Username`|Usuário gerado no credenciamento com a adquirente **Getnet** (envio obrigatório se a transação é direcionada para Getnet).|Texto|50|Condicional**|
|`Payment.Credentials.Password`|Senha gerada no credenciamento com a adquirente **Getnet** (envio obrigatório se a transação é direcionada para Getnet).|Texto|50|Condicional**|
|`Payment.Credentials.Signature`|Envio do *TerminalID* da adquirente **Global Payments**, ex.: "001". Para **Safra** colocar o nome do estabelecimento, cidade e o estado concatenados com ponto-e-vírgula (;), ex.: "NomedaLoja;São Paulo;SP".|Texto|--|Condicional**|
|`Payment.CreditCard.CardNumber`|Número do cartão do comprador.|Texto|19|Sim|
|`Payment.CreditCard.Holder`|Nome do portador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`Payment.CreditCard.ExpirationDate`|Data de validade impressa no cartão.|Texto|7|Sim|
|`Payment.CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`Payment.CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim|
|`Payment.CreditCard.SaveCard`|Identifica se o cartão será salvo para gerar o token (*CardToken*).|Booleano|---|Não (default "false")|
|`Payment.CreditCard.Alias`|Nome atribuído pelo lojista ao cartão salvo como *CardToken*.|Texto|64|Não|
|`Payment.CreditCard.CardOnFile.Usage`|"First" se o cartão foi armazenado e é seu primeiro uso.<br>"Used" se o cartão foi armazenado e já utilizado em outra transação.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto|-|Não|
|`Payment.CreditCard.CardOnFile.Reason`|Indica o propósito de armazenamento de cartões, caso o campo `Usage` seja "Used".<br>"Recurring" - Compra recorrente programada, ex.: assinaturas.<br>"Unscheduled" - Compra recorrente sem agendamento, ex.: aplicativos de serviços.<br>"Installments" - Parcelamento através da recorrência.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto|-|Condicional|

***Obrigatório caso não estejam pré configurados nos meios de pagamento do MerchantID utilizado.*

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
      "Credentials": {
         "Code": "9999999",
         "Key": "D8888888",
         "Password": "LOJA9999999",
         "Username": "#Braspag2018@NOMEDALOJA#"
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
        "Payment.MerchantAdviceCode":"1",
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
        "Credentials": {
            "Code": "9999999",
            "Key": "D8888888",
            "Password": "LOJA9999999",
            "Username": "#Braspag2018@NOMEDALOJA#"
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
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|
|`Payment.MerchantAdviceCode`|Código de retorno da bandeira que define período para retentativa. *Válido para bandeira Mastercard*. Saiba mais em [Programa de Retentativa das Bandeiras](https://developercielo.github.io/tutorial/programa-retentativa-bandeiras){:target="_blank"}|Texto| 2 | Numérico|

### Criando uma Transação de Débito

Uma transação com cartão de débito se efetua de forma semelhante à com cartão de crédito. É obrigatório, porém, submetê-la ao processo de autenticação.

Todas as transações de débito devem ser autenticadas por exigência dos bancos emissores e bandeiras, com o objetivo de promover maior segurança. Para autenticar uma transação de débito, usamos o protocolo [EMV 3DS 2.0](https://www.emvco.com/emv-technologies/3-d-secure/){:target="_blank"}. Esse protocolo é um script integrado ao website do e-commerce que verifica a identidade do portador do cartão enquanto mantém uma boa experiência de compra ao consumidor e reduz o risco de fraude.

Para integrar o método de autenticação, consulte a documentação do [3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"}.

Veja abaixo a representação de um **fluxo transacional** padrão na criação de uma transação de débito, com as etapas de autenticação e autorização:
![Fluxo 3DS 2.0]({{ site.baseurl_root }}/images/3ds.png)

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{
   "MerchantOrderId":"202301131052",
   "Customer":{
      "Name":"Nome do Comprador",
      "Identity":"12345678900",
      "IdentityType":"CPF",
      "Email":"comprador@email.com.br",
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
      "DebitCard":{
         "CardNumber":"************1106",
         "Holder":"NOME DO TITULAR DO CARTÃO",
         "ExpirationDate":"12/2030",
         "SaveCard":false,
         "Brand":"Master"      },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"https://braspag.com.br",
      "ProofOfSale":"20230113",
      "AcquirerTransactionId":"0510053219433",
      "AuthorizationCode":"936403",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"5",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
      ]
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--header "MerchantKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
--data-binary
--verbose
{
   "MerchantOrderId":"202301131052",
   "Customer":{
      "Name":"Nome do Comprador",
      "Identity":"12345678900",
      "IdentityType":"CPF",
      "Email":"comprador@email.com.br",
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
      "DebitCard":{
         "CardNumber":"************1106",
         "Holder":"NOME DO TITULAR DO CARTÃO",
         "ExpirationDate":"12/2030",
         "SaveCard":false,
         "Brand":"Master"      },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"https://braspag.com.br",
      "ProofOfSale":"20230113",
      "AcquirerTransactionId":"0510053219433",
      "AuthorizationCode":"936403",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"5",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "ExtraDataCollection":[  
         {  
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"
      ]
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-providers) para acessar a lista de provedores. Obs.: Atualmente somente a **Cielo** suporta esta forma de pagamento via Pagador.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "DebitCard".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim do pagamento.|Texto |1024|Sim|
|`DebitCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`DebitCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`DebitCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`DebitCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`DebitCard.Brand`|Bandeira do cartão.|Texto|10|Sim|
|`DebitCard.CardOnFile.Usage`|"First" se o cartão foi armazenado e é seu primeiro uso.<br>"Used" se o cartão foi armazenado e já utilizado em outra transação.<br><br>**Aplicável somente para Cielo.**|Texto|-|Não|
|`DebitCard.CardOnFile.Reason`|Indica o propósito de armazenamento de cartões, caso o campo `Usage` seja "Used".<br>"Recurring" - Compra recorrente programada, ex.: assinaturas.<br>"Unscheduled" - Compra recorrente sem agendamento, ex.: aplicativos de serviços.<br>"Installments" - Parcelamento através da recorrência.<br><br>**Aplicável somente para Cielo.**|Texto|-|Condicional|
|`Payment.Authenticate`|Define se o comprador será direcionado ao emissor para autenticação do cartão. | Booleano ("true" / "false") | - | Sim, caso a autenticação seja validada.|
|`Payment.ExternalAuthentication.ReturnUrl`| URL de retorno aplicável somente se a versão for "1". | Alfanumérico | 1024 | Sim. |
|`Payment.ExternalAuthentication.Cavv`| Assinatura retornada nos cenários de sucesso na autenticação. | Texto | 28 | Sim, caso a autenticação seja validada. |
|`Payment.ExternalAuthentication.Xid`| XID retornado no processo de autenticação. | Texto | 28 | Sim, quando a versão do 3DS for "1".|
|`Payment.ExternalAuthentication.Eci`| *Electronic Commerce Indicator* retornado no processo de autenticação. | Número | 1 | Sim. |
|`Payment.ExternalAuthentication.Version`| Versão do 3DS utilizado no processo de autenticação. | Alfanumérico | 1 posição | Sim, quando a versão do 3DS for "2".|
|`Payment.ExternalAuthentication.ReferenceId`| RequestID retornado no processo de autenticação. | GUID | 36 | Sim, quando a versão do 3DS for "2". |

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
       "DebitCard": {
          "CardNumber": "455187******0181",
          "Holder": "NOME DO TITULAR DO CARTÃO",
          "ExpirationDate": "12/2031",
          "SaveCard": false,
          "Brand": "Visa"     },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"http://www.braspag.com.br",
      "ProofOfSale":"20230115053219433",
      "AcquirerTransactionId":"10069930690009D366FA",
      "AuthorizationCode":"936403",
      "SentOrderId":"10045146",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"02",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "PaymentId":"21423fa4-6bcf-448a-97e0-e683fa2581b",
      "Type":"DebitCard",
      "Amount":10000,
      "ReceivedDate":"2023-01-09 16:24:14",
      "CapturedAmount":10000,
      "CapturedDate":"2023-01-09 16:24:15",
      "Currency":"BRL",
      "Country":"BRA",
      "Provider":"Cielo",
      "ExtraDataCollection":[
         {
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"         }
      ],
      "ReasonCode":0,
      "ReasonMessage":"Successful",
      "Status":2,
      "ProviderReturnCode":"00",
      "ProviderReturnMessage":"Successful",
      "Links":[
         {
            "Method":"GET",
            "Rel":"self",
            "Href":"https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"         },
         {
            "Method":"PUT",
            "Rel":"void",
            "Href":"https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"         }
      ]
   }
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
       "DebitCard": {
          "CardNumber": "455187******0181",
          "Holder": "NOME DO TITULAR DO CARTÃO",
          "ExpirationDate": "12/2031",
          "SaveCard": false,
          "Brand": "Visa"     },
      "Authenticate":true,
      "Recurrent":false,
      "ReturnUrl":"http://www.braspag.com.br",
      "ProofOfSale":"20230115053219433",
      "AcquirerTransactionId":"10069930690009D366FA",
      "AuthorizationCode":"936403",
      "SentOrderId":"10045146",
      "ExternalAuthentication":{
         "Cavv":"AAABB2gHA1B5EFNjWQcDAAAAAAB=",
         "Xid":"Uk5ZanBHcWw2RjRCbEN5dGtiMTB=",
         "Eci":"02",
         "Version":"2",
         "ReferenceId":"a24a5d87-b1a1-4aef-a37b-2f30b91274e6"      },
      "PaymentId":"21423fa4-6bcf-448a-97e0-e683fa2581b",
      "Type":"DebitCard",
      "Amount":10000,
      "ReceivedDate":"2023-01-09 16:24:14",
      "CapturedAmount":10000,
      "CapturedDate":"2023-01-09 16:24:15",
      "Currency":"BRL",
      "Country":"BRA",
      "Provider":"Cielo",
      "ExtraDataCollection":[
         {
            "Name":"NomeDoCampo",
            "Value":"ValorDoCampo"         }
      ],
      "ReasonCode":0,
      "ReasonMessage":"Successful",
      "Status":2,
      "ProviderReturnCode":"00",
      "ProviderReturnMessage":"Successful",
      "Links":[
         {
            "Method":"GET",
            "Rel":"self",
            "Href":"https://apiquerysandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925"         },
         {
            "Method":"PUT",
            "Rel":"void",
            "Href":"https://apisandbox.braspag.com.br/v2/sales/c374099e-c474-4916-9f5c-f2598fec2925/void"         }
      ]
   }
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
|`Status`|Status da transação. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação) para ver lista de status.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|Ex.: 57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Ex.: Transação Aprovada|
|`Payment.MerchantAdviceCode`|Código de retorno da bandeira que define período para retentativa. *Válido para bandeira Mastercard*.|Texto| 2 | Numérico|
|`Payment.ExternalAuthentication.Cavv`|Valor Cavv submetido na requisição de autorização.| Texto | 28 | kBMaEAEAbV3FcwnExrXh4phhmpIj |
|`Payment.ExternalAuthentication.Xid`|Valor Xid submetido na requisição de autorização.| Texto | 28 | ZGUzNzgwYzQxM2ZlMWMxMzVkMjc= |
|`Payment.ExternalAuthentication.Eci`|Valor ECI submetido na requisição de autorização.| Número | 1 | Ex. 5 |
|`Payment.ExternalAuthentication.Version`|Versão do 3DS utilizado no processo de autenticação.| Alfanumérico | 1  | Ex: 2 |
|`Payment.ExternalAuthentication.ReferenceId`|RequestID retornado no processo de autenticação.| GUID | 36 | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |

### Criando uma Transação de Débito sem Autenticação

É possível processar um cartão de débito sem a necessidade de submeter o comprador ao processo de autenticação. Confira o artigo [Débito sem Senha (Autenticação)](https://suporte.braspag.com.br/hc/pt-br/articles/360013285531){:target="_blank"} para mais detalhes a respeito desse tipo de transação.
<br>Este é o caso do auxílio emergencial "Coronavoucher", disponibilizado pelo governo, que pode ser consumido através do cartão de débito virtual da Caixa Econômica Federal. Desta forma, a requisição deverá ser do tipo Cartão de Débito, porém **sem autenticação**, conforme o exemplo abaixo. 

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
            "CardOnFile":{
              "Usage": "Used",
              "Reason":"Unscheduled"
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
         "CardOnFile":{
           "Usage": "Used",
           "Reason":"Unscheduled"         
      },
      [...]
   }
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento. Obs.: Disponível apenas para **Cielo30**.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "DebitCard".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas. Fixo "1" para o cartão de débito.|Número|2|Sim|
|`DebitCard.CardNumber`|Número do cartão do comprador.|Texto|16|Sim|
|`DebitCard.Holder`|Nome do comprador impresso no cartão.|Texto|25|Sim|
|`DebitCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`DebitCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`DebitCard.Brand`|Bandeira do cartão. Para este tipo de transação, sempre "Elo".|Texto|10|Sim|
|`DebitCard.CardOnFile.Usage`|"First" se o cartão foi armazenado e é seu primeiro uso.<br>"Used" se o cartão foi armazenado e já utilizado em outra transação.<br><br>**Aplicável somente para Cielo.**|Texto|-|Não|
|`DebitCard.CardOnFile.Reason`|Indica o propósito de armazenamento de cartões, caso o campo `Usage` seja "Used".<br>"Recurring" - Compra recorrente programada, ex.: assinaturas.<br>"Unscheduled" - Compra recorrente sem agendamento, ex.: aplicativos de serviços.<br>"Installments" - Parcelamento através da recorrência.<br><br>**Aplicável somente para Cielo.**|Texto|-|Condicional|

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
      "CardOnFile":{
        "Usage": "Used",
        "Reason":"Unscheduled"
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
    "Payment.MerchantAdviceCode":"1",
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
      "CardOnFile":{
        "Usage": "Used",
        "Reason":"Unscheduled"
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
    "Payment.MerchantAdviceCode":"1",
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
|`Status`|Status da transação. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação) para ver lista de status.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|Ex.: 57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Ex.: Transação Aprovada|
|`Payment.MerchantAdviceCode`|Código de retorno da bandeira que define período para retentativa. *Válido para bandeira Mastercard*.|Texto| 2 | Numérico|

### Capturando uma Transação

Quando uma transação é submetida com o parâmetro `Payment.Capture` igual a "false", é necessário que seja feita, posteriormente, uma solicitação de captura para confirmar a transação.

Transações que não são capturadas até a [data limite](https://suporte.braspag.com.br/hc/pt-br/articles/360028661812-Prazos-de-captura-e-estorno){:target="_blank"} são automaticamente desfeitas pelas adquirentes. Clientes podem ter negociações específicas com as adquirentes para que alterem esse prazo limite de captura.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/capture?amount=xxxx</span></aside>

```json


```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/capture?amount=xxx&serviceTaxAmount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. | GUID | 36 | Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API. | Texto | 40 | Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`PaymentId`|Campo identificador do pedido. | GUID | 36 | Sim (envio no *endpoint*)|
|`Amount`|Valor a ser capturado, em centavos. Verificar se a adquirente utilizada suporta uma captura parcial. Caso não seja especificado um valor, a captura será total.| Número | 15 | Não|
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
|`Status`|Status da transação. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação) para ver lista de status.| Byte | 2 | Ex.: 1 |
|`ReasonCode`|Código de retorno da adquirente. | Texto | 32 | Texto alfanumérico |
|`ReasonMessage`|Mensagem de retorno da adquirente. | Texto | 512 |Texto alfanumérico|

### Autenticando uma Transação

Com o processo de autenticação, é possível fazer uma análise de risco considerando uma quantidade maior de dados do usuário e do vendedor, auxiliando assim no processo de validação da compra online. Quando validado corretamente, o risco de *chargeback* (contestação de compra efetuada por cartão de crédito ou débito) da transação passa a ser do emissor; ou seja, a loja não receberá contestações.

O padrão mais atual do autenticador é o [3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"}, sendo que a versão 3DS 1.0 está em vias de descontinuação.

<aside class="notice">A utilização da versão 3DS 2.0 é indicada para autenticação no ambiente mobile, que não suporta a versão 1.0.</aside>
<aside class="warning">O 3DS 1.0 deverá ser descontinuado a partir de Outubro de 2021 e não recomendamos, portanto, sua integração.</aside>

#### 3DS 2.0

Além de ser compatível com os diferentes tipos de dispositivos (desktop, tablet ou smartphone), a versão [3DS 2.0](https://braspag.github.io//manualp/emv3ds){:target="_blank"} possui recursos que proporcionam uma melhor experiência de compra online para o seu cliente.

Durante o fluxo da transação, a etapa de autorização pode ser realizada separada ou juntamente com a autenticação. Para conhecer sobre o segundo fluxo, confira a documentação da [Autorização com Autenticação](https://braspag.github.io/manual/autorizacao-com-autenticacao#autoriza%C3%A7%C3%A3o-com-autentica%C3%A7%C3%A3o){:target="_blank"} do 3DS 2.0.  

#### 3DS 1.0 Padrão

A autenticação padrão com o 3DS 1.0 é utilizada pelo lojista que não possui uma conexão direta com um autenticador. Neste caso, ele utiliza a solução integrada ao Pagador, que conta com um Merchant Plug-in (MPI) interno. Neste fluxo, o meio de pagamento redireciona o cliente para o ambiente do emissor, onde deverá realizar a confirmação de seus dados para a autenticação. O parâmetro `Payment.Authenticate` deverá ser enviado como "true", como no exemplo abaixo:

##### Requisição

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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.Authenticate`|Define se o comprador será direcionado ao emissor para autenticação do cartão. Para transações autenticadas, neste campo, deve-se enviar o valor "true". Obs.: Deve ser verificada junto à adquirente a disponibilidade desta funcionalidade.|Booleano|---|Não (default "false")|
|`Payment.ReturnUrl`|URL para onde o usuário será redirecionado após o fim da autenticação.|Texto|1024|Sim (quando `Authenticate` é "true")|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|19|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
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
    "Payment.MerchantAdviceCode":"1",
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
    "Payment.MerchantAdviceCode":"1",
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
|`Payment.MerchantAdviceCode`|Código de retorno da bandeira que define período para retentativa. *Válido para bandeira Mastercard*.|Texto| 2 | Numérico|
|`Status`|Status da transação. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação) para ver lista de status.|Byte|2|Ex.: 1|
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|Ex.: 57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Ex.: Transação Aprovada|
|`AuthenticationUrl`|URL para o qual o portador será redirecionado para autenticação.|Texto|256|https://qasecommerce.cielo.com.br/web/index.cbmp?id=5f177203bf524c78982ad28f7ece5f08|

#### 3DS 1.0 Externa

Na autenticação externa com o 3DS 1.0, o lojista que possui um autenticador (MPI) próprio não precisa que o meio de pagamento redirecione seu consumidor para o ambiente de autenticação. Este fluxo é suportado pelas adquirentes **Cielo**, **Global Payments** e **Banorte**.

Adicione o nó `Payment.ExternalAuthentication` ao contrato padrão, conforme exemplo.

##### Requisição

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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.ExternalAuthentication.Cavv`|Valor Cavv retornado pelo mecanismo de autenticação externa.|Texto | - |Sim|
|`Payment.ExternalAuthentication.Xid`|Valor Xid retornado pelo mecanismo de autenticação externa.|Texto| - |Sim|
|`Payment.ExternalAuthentication.Eci`|Valor Eci retornado pelo mecanismo de autenticação externa.|Número|1|Sim|

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

### Cancelando/Estornando uma Transação

A disponibilidade do serviço de estorno varia de adquirente para adquirente. Cada adquirente tem seus prazos-limites para permitir o estorno de uma transação. [Neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360028661812-Prazos-de-captura-e-estorno){:target="_blank"} você poderá conferir cada um deles.

Para cancelar uma transação de cartão de crédito, é necessário o envio de mensagem HTTP através do método PUT para o recurso *Payment*, conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/void?amount=xxx</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/void?amount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API. |Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.| GUID | 36 |Não (envio no *header*)|
|`PaymentId`|Campo identificador do pedido.|GUID |36 |Sim (envio no *endpoint*)|
|`Amount`|Valor, em centavos, a ser cancelado/estornado.<br>*Observações*.:<br>1. Verifique se a adquirente contratada suporta a operação de cancelamento ou estorno.<br>2. Caso o valor de `Amount` seja informado como "0" (zero), ou esse parâmetro não seja enviado, será considerado um estorno total do valor capturado.|Número |15 |Não (envio no *endpoint*)|

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
|`Status`|Status da transação. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação) para ver lista de status.|Byte | 2 | Ex.: 1 |
|`ReasonCode`|Código de retorno da adquirência. |Texto |32 |Texto alfanumérico
|`ReasonMessage`|Mensagem de retorno da adquirência. |Texto |512 |Texto alfanumérico

### Analisando com Velocity Check

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
|`VelocityAnalysis.ResultMessage`|Resultado da análise feita ("Accept" / "Reject").|Texto|25|
|`VelocityAnalysis.Score`|Número de pontos dado à operação. Ex.: 100.|Número|10|
|`VelocityAnalysis.RejectReasons.RuleId`|Código da regra que rejeitou.|Número|10|
|`VelocityAnalysis.RejectReasons.Message`|Descrição da regra que rejeitou.|Texto|512|

### Utilizando o DCC (Conversor de Moedas)

O DCC (Dynamic Currency Conversion) é um conversor de moedas da adquirente **Global Payments** que permite que o portador de um cartão estrangeiro escolha entre pagar em reais ou em sua moeda local, convertendo o valor do pedido no momento da compra com total transparência para o comprador.
A solução é indicada para estabelecimentos que recebem pagamentos com cartões emitidos no exterior como hotéis, pousadas, polos comerciais e comércios em pontos turísticos.

<aside class="notice">Para utilizar esta funcionalidade com a autenticação padrão, o lojista deverá entrar em contato com a adquirente Global Payments e solicitar a ativação do DCC em seu estabelecimento.</aside>

<aside class="warning">Esta funcionalidade não é compatível com transações com MPI externo.</aside>

Quando o estabelecimento possui o produto DCC habilitado, o processo de autorização é realizado em 3 etapas, explicadas a seguir:

#### ETAPA 1 - Autorização

Na primeira etapa, quando é solicitada uma autorização com um cartão internacional, a Global Payments identifica o país do cartão e aplica a conversão de moeda seguindo os cálculos específicos de cada bandeira, retornando as informações de conversão em seguida.

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
| `AcquirerTransactionId` | Id da transação no provedor de meio de pagamento.                           | Texto | 40      | Texto alfanumérico                   |
| `ProofOfSale`           | Número do comprovante de venda.                                             | Texto | 20      | Texto alfanumérico                   |
| `AuthorizationCode`     | Código de autorização.                                                      | Texto | 300     | Texto alfanumérico                   |
| `PaymentId`             | Campo identificador do pedido.                                              | GUID  | 36      | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `ReceivedDate`          | Data em que a transação foi recebida pela Braspag.                          | Texto | 19      | AAAA-MM-DD HH:mm:SS                  |
| `ReasonCode`            | Código de retorno da operação.                                              | Texto | 32      | Texto alfanumérico                   |
| `ReasonMessage`         | Mensagem de retorno da operação.                                            | Texto | 512     | Texto alfanumérico                   |
| `Status`                | Status da transação.                                                        | Byte  | 2       | Ex.: 12                              |
| `ProviderReturnCode`    | Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).   | Texto | 32      | 57                                   |
| `ProviderReturnMessage` | Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor). | Texto | 512     | Transação Aprovada                   |
| `CurrencyExchangeData.Id` | Id da ação da troca de moeda. | Texto | 50     | 1b05456446c116374005602dcbaf8db8879515a0                   |
| `CurrencyExchangeData.CurrencyExchanges.Currency` | Moeda local do comprador/cartão de crédito. | Numérico | 4     | EUR                   |
| `CurrencyExchangeData.CurrencyExchanges.ConvertedAmount` | Valor convertido. | Numérico | 12     | 23                   |
| `CurrencyExchangeData.CurrencyExchanges.ConversionRate` | Taxa de conversão. | Numérico | 9     | 3.218626                   |
| `CurrencyExchangeData.CurrencyExchanges.ClosingDate` | Data de finalização da transação. | Texto | 19     | AAAA-MM-DD HH:mm:SS                  |
| `CurrencyExchangeData.CurrencyExchanges.Currency` | Código da moeda "real". | Texto | 3     | BRA                   |
| `CurrencyExchangeData.CurrencyExchanges.ConvertedAmount` | Valor do pedido em reais. | Numérico | 12     | 100                   |

#### ETAPA 2 - Opção de Pagamento

Na segunda etapa, o sistema da loja apresenta ao comprador as opções de pagar em reais ou com a moeda de seu país (moeda do cartão de crédito), seguindo as melhores práticas solicitadas pela bandeira. O texto é apresentado em inglês e o layout do site não precisa ser alterado, desde que as opções de escolha da moeda tenham as mesmas características de fonte, cor e dimensões.

Na tela da Global Payments são exibidas as opções de pagamento (em reais ou na moeda do cartão), ao lado de um resumo com os dados da compra.

#### ETAPA 3 - Confirmação

Na terceira etapa, o sistema da loja envia a confirmação da transação com as informações da moeda escolhida pelo comprador. Neste ponto é retornada a resposta da autorização.

Segue um exemplo de confirmação da transação com a moeda escolhida pelo comprador:

##### Requisição

<aside class="request"><span class="method put">PUT</span><span class="endpoint">/v2/sales/{PaymentId}/confirm</span></aside>

```json
{  
  "Id":"1b05456446c116374005602dcbaf8db8879515a0",
  "Currency":"EUR",
  "Amount":23
}
```

```shell
--request PUT " https://apisandbox.braspag.com.br/v2/sales/{PaymentId}/confirm"
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Id`|Id da ação da troca de moeda.|Text|50|Sim|
|`Currency`|Moeda selecionada pelo comprador.|Numérico|4|Sim|
|`Amount`|Valor convertido.|Numérico|12|Sim|

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
| `ProviderReturnCode`    | Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).   | Texto | 32      | 57                                   |
| `ProviderReturnMessage` | Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor). | Texto | 512     | Transação Aprovada                   |

### Facilitadores de Pagamento

Todos os clientes de E-Commerce que são **Facilitadores de Pagamento**, por **obrigatoriedade das bandeiras e do Banco Central** devem enviar campos específicos na **mensageria transacional**. A Braspag transmitirá as informações para as bandeiras por meio da mensageria transacional no momento da autorização.

Os campos específicos estão contidos dentro do nó `PaymentFacilitator`. Além dos campos deste nó, os facilitadores também precisam enviar obrigatoriamente o campo `SoftDescriptor` do nó `Payment`. Veja a seguir o exemplo do envio e da resposta.

> **Atenção:** As bandeiras, ao identificarem inconformidade devido ao não envio dos dados obrigatórios na mensageria transacional, aplicarão multas ao Facilitador responsável pelo envio dos dados transacionais.

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
      "PaymentFacilitator":{
         "EstablishmentCode":"1234",
         "SubEstablishment":{
            "EstablishmentCode":"1234",
            "Identity":"11111111000100",
            "Mcc":"1234",
            "Address":"Alameda Grajau, 512",
            "City":"Barueri",
            "State":"SP",
            "CountryCode":"076",
            "PostalCode":"06455914",
            "PhoneNumber":"1155855585"
         }
      }
   }
}
```

```shell
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
      "PaymentFacilitator":{
         "EstablishmentCode":"1234",
         "SubEstablishment":{
            "EstablishmentCode":"1234",
            "Identity":"11111111000100",
            "Mcc":"1234",
            "Address":"Alameda Grajau, 512",
            "City":"Barueri",
            "State":"SP",
            "CountryCode":"076",
            "PostalCode":"06455914",
            "PhoneNumber":"1155855585"
         }
      }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
`Payment.PaymentFacilitator.EstablishmentCode`|Código do estabelecimento do facilitador. “Facilitator ID” (cadastro do facilitador com as bandeiras).<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|11|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.EstablishmentCode`|Código do estabelecimento do sub-merchant. “Sub-Merchant ID” (cadastro do subcredenciado com o facilitador).<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|15|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.Mcc`|MCC do sub-merchant.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|4|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.Address`|Endereço do sub-merchant.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|22|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.City`|Cidade do sub-merchant.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|13|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.State`|Estado do sub-merchant.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|2|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.PostalCode`|Código postal do sub-merchant.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|9|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.PhoneNumber`|Número de telefone do sub-merchant.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|13|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.Identity`|CNPJ ou CPF do sub-merchant.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|14|Sim para facilitadores|
|`Payment.PaymentFacilitator.SubEstablishment.CountryCode`|Código do país do sub-merchant com base no ISO 3166.<br><br>**Aplicável para Cielo30 e Rede2.**|Texto*|3|Sim para facilitadores|

**Evite usar acentos pois eles são considerados como dois caracteres.*

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
      "Credentials": {
         "Code": "9999999",
         "Key": "D8888888",
         "Password": "LOJA9999999",
         "Username": "#Braspag2018@NOMEDALOJA#"
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
        "Payment.MerchantAdviceCode":"1",
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
        "Credentials": {
            "Code": "9999999",
            "Key": "D8888888",
            "Password": "LOJA9999999",
            "Username": "#Braspag2018@NOMEDALOJA#"
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

## Pix

No Pix, a transmissão da ordem de pagamento e a disponibilidade de fundos para o usuário recebedor ocorrem em tempo real, 24 horas por dia e sem a necessidade de intermediários. Sendo assim, é um meio que viabiliza pagamentos rápidos e com menores custos de transação.

<aside class="notice">As especificações do Pix poderão sofrer mudanças e adequações até a data oficial de lançamento da funcionalidade pela Braspag.</aside>
<aside class="warning">No momento, a habilitação do Pix está disponível para as adquirentes Cielo 3.0 e Bradesco. É necessário entrar em contato primeiramente com esses fornecedores para a liberação do meio de pagamento.</aside>

Conheça o ciclo de vida de uma transação Pix:

| SEQUÊNCIA | RESPONSÁVEL | DESCRIÇÃO | STATUS DA TRANSAÇÃO |
|--------------|------------|------------|------------|
|1| Loja | Geração do QR code. | 12 - Pendente |
|2| Comprador | Pagamento do QR code. | 2 - Pago |
|3| Loja | Recebimento da notificação de confirmação do pagamento. | 2 - Pago |
|4| Loja | Consulta ao status da transação. | 2 - Pago |
|5| Loja | Liberação do pedido. | 2 - Pago |
|6| Loja | Caso necessário, solicitação da devolução da transação Pix (semelhante ao estorno do cartão). | 2 - Pago |
|7| Loja | Recebimento da notificação de confirmação de devolução. | 11 - Estornado |
|8| Loja | Consulta ao status da transação. | 11 - Estornado |

### Criando uma Transação com QR Code Pix

Para gerar um QR code Pix através da API Pagador, basta realizar a integração conforme a especificação abaixo.

Entre os campos de envio obrigatório, destacam-se dois: `Type`, que deve ser enviado como "Pix"; e `Provider`, que deve ser "Cielo30" ou "Bradesco2". Na resposta da requisição será retornado o *código base64* da imagem do QR code Pix, que deve ser disponibilizado ao comprador.

Veja abaixo a representação do **fluxo transacional** na geração do QR code Pix:
![Fluxo Geração QR Code Pix]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/pix.png)

O comprador então realiza a leitura do QR code através de um dos aplicativos habilitados para o pagamento Pix e efetiva o pagamento. Nesta etapa não há participação da loja nem da Braspag, como demonstrado abaixo:
![Fluxo Pagamento QR Code Pix]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/pix2.png)

Seguem exemplos de envio de requisição e resposta para a geração do QR code Pix:

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{ 
   "MerchantOrderId":"2020102601",
   "Customer":{
      "Name":"Nome do Pagador",
      "Identity":"12345678909",
      "IdentityType":"CPF"
   },
   "Payment":{ 
      "Type":"Pix",
      "Provider":"Bradesco2",
      "Amount":100,
      "QrCodeExpiration":36000
   }    
}
```

```shell
--request POST "https://(...)/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{ 
   "MerchantOrderId":"2020102601",
   "Customer":{
      "Name":"Nome do Pagador",
      "Identity":"12345678909",
      "IdentityType":"CPF"
   },
   "Payment":{ 
      "Type":"Pix",
      "Provider":"Bradesco2",
      "Amount":100,
      "QrCodeExpiration":36000
   }    
}
--verbose
```

| PROPRIEDADE| DESCRIÇÃO| TIPO| TAMANHO | OBRIGATÓRIO?|
| --- | --- | --- | --- | --- |
| `MerchantOrderId` | Número de identificação do pedido.| Texto | 50 | Sim |
| `Customer.Name` | Nome do pagador. | Texto | 255 | Sim |
| `Customer.Identity` | Número do CPF ou CNPJ do cliente. | Texto | 14 | Sim |
| `Customer.IdentityType` | Tipo de documento de identificação do comprador (CPF ou CNPJ). | Texto | 255 | Sim |
| `Payment.Type` | Tipo do meio de pagamento. Neste caso, "Pix". | Texto | - | Sim |
| `Payment.Provider` |Nome do provedor do meio de pagamento. Neste caso, "Cielo30" ou "Bradesco2". | Texto | - | Sim |
| `Payment.Amount` | Valor do pedido, em centavos.| Número | 15 | Sim |
| `Payment.QrCodeExpiration` | Tempo de expiração do QR Code, em segundos. Ex: 24 horas = 86400.<br> **Para provider Cielo30**: o tempo de expiração é de 24 horas e não é parametrizavel.<br>**Para provider Bradesco**: o tempo de expiração do QR Code pode ser configurado no painel Shopfácil ou no momento da autorização pelo parâmetro `Payment.QrCodeExpiration`.| Número | 3600 | Não |

#### Resposta

```json
{
   "MerchantOrderId":"2020102601",
   "Customer":{
        "Name": "Luis Henrique",
        "Identity": "21844718933",
        "IdentityType": "CPF"
   },
   "Payment":{
      (...)   
      "PaymentId":"1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type":"Pix",
      "Provider":"Bradesco2",
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "QrcodeBase64Image":"rfhviy64ak+zse18cwcmtg==[...]",
      "QrCodeString":"00020101021226880014br.gov.bcb.pix2566qrcodes-h.cielo.com.br/pix-qr/d05b1a34-ec52-4201-ba1e-d3cc2a43162552040000530398654041.005802BR5918Merchant Teste HML6009Sao Paulo62120508000101296304031C",
      "QrCodeExpiration": 86400,
      "SentOrderId": "10045146",
      "Amount":100,
      "ReceivedDate":"2020-10-15 18:53:20",
      "Status":12,
      "ProviderReturnCode":"0",
      "ProviderReturnMessage":"Pix gerado com sucesso",
      (...)
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId":"2020102601",
   "Customer":{
        "Name": "Luis Henrique",
        "Identity": "21844718933",
        "IdentityType": "CPF"
   },
   "Payment":{
      (...)   
      "Paymentid":"1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type":"Pix",
      "Provider":"Bradesco2",
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "QrcodeBase64Image":"rfhviy64ak+zse18cwcmtg==[...]",
      "QrCodeString":"00020101021226880014br.gov.bcb.pix2566qrcodes-h.cielo.com.br/pix-qr/d05b1a34-ec52-4201-ba1e-d3cc2a43162552040000530398654041.005802BR5918Merchant Teste HML6009Sao Paulo62120508000101296304031C",
      "QrCodeExpiration": 36000,
      "SentOrderId": "10045146",
      "Amount":100,
      "ReceivedDate":"2020-10-15 18:53:20",
      "Status":12,
      "ProviderReturnCode":"0",
      "ProviderReturnMessage":"Pix gerado com sucesso",
      (...)
   }
}
--verbose
```

| PROPRIEDADE | DESCRIÇÃO| TIPO | TAMANHO | FORMATO |
| --- | --- | --- | --- | --- |
| `Payment.PaymentId` | Campo identificador do pedido. | GUID | 40 | Texto |
| `Payment.AcquirerTransactionId` | Id da transação no provedor de meio de pagamento.| GUID | 36 | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| `Payment.ProofOfSale` | NSU Pix. |Texto|20|Texto alfanumérico|
| `Payment.SentOrderId` | Número único enviado ao emissor Pix para representar o número do pedido. Utilizado para realizar a conciliação financeira. | Número | 8 | 10045146 |
| `Payment.QrcodeBase64Image` | Código em base64 da imagem do QR code. | Texto | - | Texto |
| `Payment.QrCodeString`|Texto codificado para o comprador "copiar" e "colar" no campo do internet banking em pagamentos feitos no ambiente mobile.|Texto|Variável|Texto alfanumérico|
| `Payment.Status` | Status da transação. Em caso de sucesso, o status inicial é “12” (*Pendente*). [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transa%C3%A7%C3%A3o) para ver lista de status.| Número | - | 12 |
| `Payment.ProviderReturnCode` | Código retornado pelo provedor do meio de pagamento. | Texto | 32 | 0 |
| `Payment.ProviderReturnMessage` | Mensagem retornada pelo provedor do meio de pagamento. | Texto | 512 |"Pix gerado com sucesso" |

### Solicitando uma Devolução Pix

Caso o lojista precise "cancelar" uma transferência Pix, é possível realizar uma operação chamada de "devolução". É importante ressaltar que a devolução não é uma operação instantânea, podendo ser acatada ou não pelo provedor Pix. Quando uma devolução é acatada, uma [notificação](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o) é recebida pela loja.<br/>

![Fluxo Cancelamento Pix]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/pix3.png)

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/sales/{PaymentId}/void?amount=xxx</span></aside>

```shell
--request PUT "https://(...)/sales/{PaymentId}/void?Amount=xxx"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim|
|`MerchantKey`|Chave pública para autenticação dupla na API. |Texto |40 |Sim|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não|
|`PaymentId`|Campo identificador do pedido. |GUID |36 |Sim|
|`Amount`|Valor a ser cancelado/estornado, em centavos. Verifique se a adquirente contratada suporta a operação de cancelamento ou estorno.|Número |15 |Não|

#### Resposta

```json
{
   "Status": 12,
   "ReasonCode": 0,
   "ReasonMessage": "Successful",
   "ProviderReturnCode": "0",
   "ProviderReturnMessage": "Reembolso solicitado com sucesso",
   "Links": [
      {
         "Method": "GET",
         "Rel": "self",
         "Href": "https://(...)/sales/{PaymentId}"
      }
   ]
}
```

```shell
{
   "Status": 12,
   "ReasonCode": 0,
   "ReasonMessage": "Successful",
   "ProviderReturnCode": "0",
   "ProviderReturnMessage": "Reembolso solicitado com sucesso",
   "Links": [
      {
         "Method": "GET",
         "Rel": "self",
         "Href": "https://(...)/sales/{PaymentId}"
      }
   ]
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`Status`|Status da transação. |Byte | 2 | Ex.: "1" |
|`ReasonCode`|Código de retorno da adquirência. |Texto |32 |Texto alfanumérico|
|`ReasonMessage`|Mensagem de retorno da adquirência. |Texto |512 |Texto alfanumérico|

## QR Code

### Criando uma Transação com QR Code

Veja abaixo a representação de um **fluxo transacional** padrão na criação de uma transação com QR code:
![Fluxo QR Code]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/qr-code.png)

Uma transação com QR code se efetua com o envio de uma requisição através do método POST conforme o exemplo abaixo. Essa requisição irá criar a transação, que ficará com o status *Pendente* na Braspag, e gerar o QR code para realizar o pagamento. Usando um dos aplicativos compatíveis, o comprador efetua o pagamento e a transação muda de status (ex.: *Pago*, *Não pago* ou *Não autorizado*).

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantOrderId`|Número de identificação do pedido.|Texto|50|Sim|
|`Customer.Name`|Nome do comprador.|Texto|255|Não|
|`Payment.Provider`|Nome do provedor do meio de pagamento. Obs.: Atualmente somente disponível para **Cielo30**.|Texto|15|Sim|
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
|`QrCodeBase64Image`|QR code codificado em base64. A imagem do QR code poderá ser apresentada na página utilizando um código HTML como este:<br><br> &lt;img src="data:image/png;base64,{código da imagem em base64}"&gt;.|Texto|Variável|Texto alfanumérico|
|`PaymentId`|Campo identificador do pedido. Necessário para operações como consulta, captura e cancelamento.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Status`|Status da transação. No caso da transação de geração com QR code, o status inicial é "12" (*Pendente*). [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação) para ver lista de status.|Byte|-|2|
|`ReturnCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`ReturnMessage`|Mensagem de retorno da adquirência.|Texto|512|Texto alfanumérico|

## Boleto

### Boleto Registrado

Com o objetivo de promover maior controle e segurança ao transacional de boletos no e-commerce e garantir mais confiabilidade e comodidade aos usuários, a FEBRABAN em conjunto com os bancos lançou a **Nova Plataforma de Cobrança**.

Desde 21 de julho de 2018 todos os boletos emitidos no e-commerce, obrigatoriamente, precisam ser registrados. [Clique aqui](https://portal.febraban.org.br/pagina/3150/1094/pt-br/servicos-novo-plataforma-boletos){:target="_blank"} para acessar o comunicado completo.   

Abaixo seguem os procedimentos de configuração de boletos em cada banco:

* [Bradesco](https://suporte.braspag.com.br/hc/pt-br/articles/360002949031-Como-fa%C3%A7o-para-configurar-o-Boleto-Registrado-Bradesco-){:target="_blank"}
* [Banco do Brasil](https://suporte.braspag.com.br/hc/pt-br/articles/360002987111-Como-fa%C3%A7o-para-configurar-o-Boleto-Registrado-Banco-do-Brasil-){:target="_blank"}
* [Itaú API](https://suporte.braspag.com.br/hc/pt-br/articles/360002986111-Como-fa%C3%A7o-para-configurar-o-Boleto-Registrado-Ita%C3%BA-API-){:target="_blank"}
* [Itaú Shopline](https://suporte.braspag.com.br/hc/pt-br/articles/360002968392-Como-fa%C3%A7o-para-configurar-o-Boleto-Registrado-Ita%C3%BA-Shopline-){:target="_blank"}
* [Santander](https://suporte.braspag.com.br/hc/pt-br/articles/360002970552-Como-fa%C3%A7o-para-configurar-o-Boleto-Registrado-Santander-){:target="_blank"}
* [Caixa Econômica](https://suporte.braspag.com.br/hc/pt-br/articles/360002969812-Como-fa%C3%A7o-para-configurar-o-Boleto-Registrado-Caixa-){:target="_blank"}

### Criando uma Transação de Boleto

Veja abaixo a representação de um **fluxo transacional** padrão na criação de uma transação com boleto:
![Fluxo Boleto]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/boleto.png)

Para gerar um boleto, inclusive em ambiente Sandbox, é necessário fornecer dados do comprador como CPF ou CNPJ e endereço. Abaixo temos um exemplo de como criar um pedido com este meio de pagamento.

Os parâmetros `Payment.FineRate` e `Payment.FineAmount` não devem ser utilizados em conjunto. A mesma regra se aplica aos parâmetros `Payment.InterestRate` e `Payment.InterestAmount`. Esses parâmetros, apresentados na tabela mais abaixo, estão marcados com um * na coluna de obrigatoriedade.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017091101",
   "Customer":{  
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
   "Payment":{  
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
      "InterestAmount": 500,
      "DiscountAmount": 100,
      "DiscountLimitDate": "2017-12-31",
      "DiscountRate": 5.00000
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017091101",
   "Customer":{  
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
   "Payment":{  
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
      "InterestAmount": 500,
      "DiscountAmount": 100,
      "DiscountLimitDate": "2017-12-31",
      "DiscountRate": 5.00000
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.|GUID|36|Não (envio no *header*)|
|`MerchantOrderId`|Número de identificação do pedido. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Name`|Nome do comprador. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Identity`|Número do RG, CPF ou CNPJ do cliente.|Texto |14 |Sim|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador (CPF ou CNPJ).|Texto|255|Sim|
|`Customer.Address.Street`|Endereço de contato do comprador. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Address.Number`|Número do endereço de contato do comprador. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Address.Complement`|Complemento do endereço de contato do comprador. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Não|
|`Customer.Address.ZipCode`|CEP do endereço de contato do comprador.|Texto|8|Sim|
|`Customer.Address.District`|Bairro do endereço de contato do comprador. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim
|`Customer.Address.City`|Cidade do endereço de contato do comprador. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto|Veja a [tabela](#conciliação-de-boletos)|Sim|
|`Customer.Address.State`|Estado do endereço de contato do comprador.|Texto|2|Sim|
|`Customer.Address.Country`|País do endereço de contato do comprador.|Texto|35|Sim|
|`Payment.Provider`|Nome do provedor do meio de pagamento do boleto. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#providers-para-consulta-bin-via-verifycard) para acessar a lista de provedores.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "Boleto".|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.BoletoNumber`|Número do boleto ("Nosso Número"). Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Número |Veja a [tabela](#conciliação-de-boletos)|Não|
|`Payment.Assignor`|Nome do cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento.|Texto |200|Não|
|`Payment.Demonstrative`|Texto de demonstrativo. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)).|Texto |Veja a [tabela](#conciliação-de-boletos)|Não|
|`Payment.ExpirationDate`|Data de vencimento do boleto. Caso não esteja previamente cadastrado no meio de pagamento, o envio deste campo é obrigatório. Se enviado na requisição, sobrepõe o valor configurado no meio de pagamento.|Date |AAAA-MM-DD|Não|
|`Payment.Identification`|CNPJ do Cedente. Caso preenchido, sobrepõe o valor configurado no meio de pagamento.|Texto |14 |Não|
|`Payment.Instructions`|Instruções do boleto. Caso preenchido, sobrepõe o valor configurado no meio de pagamento. A regra varia de acordo com o provedor utilizado (consulte a [tabela](#conciliação-de-boletos)). Para quebra de linhas no texto utilize sempre a notação em HTML `<br>`.|Texto |Veja a [tabela](#conciliação-de-boletos)|Não|
|`Payment.NullifyDays`|Prazo para baixa automática do boleto. O cancelamento automático do boleto acontecerá após o número de dias estabelecido neste campo, contado a partir da data de vencimento. Ex.: um boleto com vencimento para 15/12 que tenha em seu registro o prazo para baixa de 5 dias, poderá ser pago até 20/12; após esta data o título é cancelado. Obs.: Recurso válido somente para boletos registrados do Banco Santander.|Número |2 |Não|
|`Payment.DaysToFine`|Opcional e somente para o provedor Bradesco2. Quantidade de dias após o vencimento para cobrar o valor da multa, em número inteiro. Ex.: 3.|Número |15 |Não|
|`Payment.FineRate`|Opcional e somente para o provedor Bradesco2. Valor da multa após o vencimento, em percentual, com base no valor do boleto (%). Permitido decimal com até 5 casas decimais. Não utilizar em conjunto com `FineAmount`. Ex: 10.12345 = 10.12345%.|Número |15 |Não*|
|`Payment.FineAmount`|Opcional e somente para o provedor Bradesco2. Valor da multa após o vencimento em valor absoluto em centavos. Não utilizar em conjunto com `FineRate`. Ex.: 1000 = R$ 10,00.|Número |15 |Não*|
|`Payment.DaysToInterest`|Opcional e somente para o provedor Bradesco2. Quantidade de dias após o vencimento para início da cobrança de juros por dia sobre o valor do boleto, em número inteiro. Ex.: 3.|Número |15 |Não|
|`Payment.InterestRate`|Opcional e somente para o provedor Bradesco2. Valor de juros mensal após o vencimento em percentual, com base no valor do boleto (%). O valor de juros é cobrado proporcionalmente por dia (mensal dividido por 30). Permitido decimal com até 5 casas decimais. Não utilizar em conjunto com `InterestAmount`. Ex.: 10.12345.|Número |15 |Não*|
|`Payment.InterestAmount`|Opcional e somente para o provedor Bradesco2. Valor absoluto de juros diários após o vencimento, em centavos. Não utilizar em conjunto com `InterestRate`. Ex.: 1000 = R$ 10,00.|Número |15 |Não*|
|`Payment.DiscountAmount`|Opcional e somente para o provedor Bradesco2.  Valor do desconto até a data limite estipulada pelo Payment.DiscountLimitDate. Em valor absoluto em centavos. Não utilizar em conjunto com "Payment.DiscountRate". Ex.: 1000 = R$ 10,00.|Número |15 |Não*|
|`Payment.DiscountLimitDate`|Opcional e somente para o provedor Bradesco2. Data limite para conceder o desconto|Date|AAAA-MM-DD|Não*|
|`Payment.DiscountRate`|Opcional e somente para o provedor Bradesco2. Valor de desconto após o vencimento em percentual, com base no valor do boleto (%). Não utilizar em conjunto com "Payment.DiscountAmount".|Número |15 |Não* |

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
|`PaymentId`|Campo identificador do pedido. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`ExpirationDate`|Data de expiração. |Texto |10 |2014-12-25 |
|`Url`|URL do boleto gerado. |string |256 |https://.../pagador/reenvia.asp/8464a692-b4bd-41e7-8003-1611a2b8ef2d |
|`BoletoNumber`|"NossoNumero" gerado. |Número|50 |2017091101 |
|`BarCodeNumber`|Representação numérica do código de barras. |Texto |44 |00091628800000157000494250100000001200656560 |
|`DigitableLine`|Linha digitável. |Texto |256 |00090.49420 50100.000004 12006.565605 1 62880000015700 |
|`Address`|Endereço da loja cadastrada no banco emissor. |Texto |256 |Ex.: Av. Teste, 160 |
|`Status`|Status da transação. [Clique aqui](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação) para ver lista de status.|Byte | 2 | Ex.: 1 |

### Conciliação de Boletos

Para atualizar o status de um boleto para *Pago*, o Pagador deve receber dos bancos os arquivos CNAB com as liquidações referentes. Para habilitar sua loja a receber os arquivos bancários, basta seguir o procedimento descrito [neste link](https://suporte.braspag.com.br/hc/pt-br/articles/360007068352-Como-funciona-a-Concilia%C3%A7%C3%A3o-via-Nexxera-){:target="_blank"}.

### Regras Específicas por Banco Emissor

Segue uma lista de propriedades e suas especificações de tamanho, relativas a regras distintas de cada banco emissor e seus respectivos *providers*:

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
|`*3`|O valor deve ser único, ou seja, o banco emissor não permite a repetição de valores previamente utilizados. |
|`*4`|Quando enviado acima de 9 posições, a API considera os últimos 9 dígitos. |
|`*5`|Deverá ser sempre igual ao número de pedido (`MerchantOrderId`). |
|`*6`|A API concatena automaticamente o valor “14” + 12 dígitos livres + dígito verificador, antes de mandar para o banco emissor. Caso o total ultrapasse os 14 dígitos, a API considera os últimos 14 dígitos. |
|`*7`|Quando enviado mais que o permitido, a API gera um número aleatório. |
|`*8`|São aceitos como caracteres válidos: números, letras de A a Z (MAIÚSCULAS) e caracteres especiais de conjunção (hífen "-" e apóstrofo "‘"). Quando utilizados, não pode haver espaços entre as letras. Exemplos corretos: D’EL-REI / D’ALCORTIVO / SANT’ANA. Exemplos incorretos: D’EL - REI / um espaço em branco entre palavras.|
|`*9`|Caracteres especiais e acentuações são removidos automaticamente. |

## Buy Now, Pay Later (BNPL)

**Buy Now, Pay Later (BNPL)** é um tipo de financiamento de curto prazo, com ou sem taxas para o comprador, que considera uma avaliação de crédito instantânea permitindo o parcelamento de compras sem o uso de cartão de crédito. 

A Braspag oferece a integração com o provider Koin para o meio de pagamento BPNL. Para fazer essa integração, [consulte o nosso manual de BNPL](https://braspag.github.io//manual/manual-bnpl){:target="_blank"}.

## Transferência Eletrônica

Semelhante ao pagamento com cartão de débito, a transferência eletrônica conecta o consumidor ao seu emissor para autenticar uma venda em débito. A diferença entre ambos é que as transferências não são submetidas à adquirente nem dependem de dados de cartão.

### Criando uma Transação de Transferência Eletrônica

Para criar uma venda, é necessário o envio de mensagem HTTP através do método POST para o recurso *Payment*, conforme o exemplo:

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017051109",
   "Customer":{  
      "Name":"Nome do Comprador",
      "Identity": "12345678909",
      "IdentityType": "CPF",
      "Email": "comprador@braspag.com.br",
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
   "Payment":{  
      "Provider":"Simulado",
      "Type":"EletronicTransfer",
      "Amount":10000,
      "ReturnUrl":"http://www.braspag.com.br",
      "Beneficiary":{
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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
    "MerchantOrderId":"2017051109",
    "Customer":{  
       "Name":"Nome do Comprador",
       "Identity": "12345678909",
       "IdentityType": "CPF",
       "Email": "comprador@braspag.com.br",
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
    "Payment":{  
       "Provider":"Simulado",
       "Type":"EletronicTransfer",
       "Amount":10000,
       "ReturnUrl":"http://www.braspag.com.br",
       "Beneficiary":{
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API. |Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
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
|`Payment.Type`|Tipo do meio de pagamento. Neste caso, "EletronicTransfer".|Texto |100 |Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número |15 |Sim|
|`Payment.Provider`|Nome do provedor do meio de pagamento. [Clique aqui](https://braspag.github.io//manual/braspag-pagador##providers-para-transferência-eletrônica-(débito-online)) para acessar a lista de provedores.|Texto |15 |---|
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

## E-Wallet (Carteira Digital)

E-wallets são cofres (repositórios) de cartões e dados de pagamento destinados a consumidores do e-commerce e do mundo físico. As carteiras digitais permitem que um consumidor realize o cadastro de seus dados de pagamento, tornando o processo de compra mais conveniente e seguro.

<aside class="warning">Para utilizar carteiras no Pagador, o lojista deverá possuir as carteiras integradas em seu checkout.</aside>

Entre em contato com o provedor de sua preferência para maiores informações sobre como contratar o serviço.

### E-Wallets Disponíveis

O Pagador possui suporte para as principais carteiras digitais disponíveis no mercado, listadas a seguir:

* [*Apple Pay*](https://www.apple.com/br/apple-pay/){:target="_blank"}
* [*Samsung Pay*](https://www.samsung.com.br/samsungpay/){:target="_blank"}
* [*Google Pay*](https://pay.google.com/intl/pt-BR_br/about/){:target="_blank"}
* [*PayPal*](https://www.paypal.com/br/business){:target="_blank"}

<aside class="warning">Quando o nó “Wallet” é enviado na requisição, o nó “CreditCard” passa a ser opcional.</aside>
<aside class="warning">Quando o nó "Wallet" é enviado na requisição, para o cartão de débito é necessário o envio do nó “DebitCard” contendo a “ReturnUrl”.</aside>

### Integração da E-Wallet

Consulte nosso manual [E-Wallets](https://braspag.github.io//manual/ewallets){:target="_blank"} e saiba mais detalhes sobre a integração dessas e-wallets em seu checkout.

Com a e-wallet já totalmente integrada, o seu **fluxo transacional** de pagamento será o seguinte:
![Fluxo E-Wallet]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/e-wallet2.png)

## Voucher

### Criando uma Transação com Voucher

Veja abaixo a representação de um **fluxo transacional** padrão na criação de uma transação com voucher:
![Fluxo Voucher]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/voucher.png)

Uma transação com cartão voucher se efetua de forma semelhante à com cartão de débito; porém, sem o processo de autenticação.
Atualmente, suportamos os providers *Alelo* e *Ticket* nessa modalidade.

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
   "Payment": {
      "Provider": "Alelo",
      "Type": "DebitCard",
      "Amount": 10,
      "Installments": 1,
      "Authenticate": false,
      "ReturnUrl": "http://www.braspag.com.br"
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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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
   "Payment": {
      "Provider": "Alelo",
      "Type": "DebitCard",
      "Amount": 10,
      "Installments": 1,
      "Authenticate":false,
      "ReturnUrl": "http://www.braspag.com.br"
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento. [Clique aqui](https://braspag.github.io//manual/braspag-pagador#providers-para-voucher) para acessar a lista de provedores.|Texto|15|Sim|
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
        "Authenticate": false,
        "ReturnUrl": "http://www.braspag.com.br"
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
        "Authenticate": false,
        "ReturnUrl": "http://www.braspag.com.br"
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
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|
|`AuthenticationUrl`|URL para o qual o portador será redirecionado para autenticação. |Texto |56 |https://qasecommerce.cielo.com.br/web/index.cbmp?id=13fda1da8e3d90d3d0c9df8820b96a7f|

# Recorrência

Diferente dos pagamentos com cartão de crédito ou boleto tradicionais, os pagamentos recorrentes se repetem automaticamente por períodos e em intervalos determinados, cobrando sempre o mesmo valor de um mesmo cartão ou conta.

É muito utilizado para assinaturas de revistas, mensalidades, licenças de software, entre outros. **Além da integração técnica, é necessário que o seu estabelecimento comercial esteja habilitado na adquirente para receber pagamentos recorrentes**.

A sua loja conta com recursos diferenciados para modelar a cobrança de acordo com o seu negócio, tais como: parametrização e alteração de periodicidade, data de início e fim, quantidade de tentativas e intervalo entre tentativas. Para saber mais detalhes, leia nosso artigo sobre [Recorrência](https://suporte.braspag.com.br/hc/pt-br/articles/360013311991){:target="_blank"}.

> Vendas recorrentes com cartão de crédito [não exigem CVV](https://suporte.braspag.com.br/hc/pt-br/articles/6758664323611){:target="_blank"}.

<aside class="warning">A recorrência não está disponível para transações de e-wallets devido à necessidade de utilização de chaves temporárias para realizar operações de crédito.</aside>

<aside class="warning">Por questões de segurança, a recorrência só é possível para cartões que passem pela checagem do Algoritmo de Luhn, também conhecido como "mod10".</aside>

## Autorização de Recorrência

### Autorizando Recorrência com Cartão de Crédito

Adicione o nó `RecurrentPayment` ao nó `Payment` para agendar as recorrências futuras ao autorizar uma transação pela primeira vez na série de recorrências.

Os parâmetros `Payment.RecurrentPayment.Interval` e `Payment.RecurrentPayment.DailyInterval`, marcados com um "\*" na coluna "OBRIGATÓRIO", não devem ser utilizados em conjunto.

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
   "Payment": {
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount": 10000,
      "Installments": 1,
      "CreditCard": {
         "CardNumber":"5412217070050381",
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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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
   "Payment": {
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount": 10000,
      "Installments": 1,
      "CreditCard": {
         "CardNumber":"5412217070050381",
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência. Não utilizar em conjunto com `DailyInterval`.<br><br>Monthly (default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não*|
|`Payment.RecurrentPayment.DailyInterval`|Padrão da recorrência em dias. Não utilizar em conjunto com `Interval`.|Número|2|Não*|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|19|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |

*Não use os parâmetros `Payment.RecurrentPayment.Interval` e `Payment.RecurrentPayment.DailyInterval` em conjunto.

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
|`NextRecurrency`|Data de quando acontecerá a próxima recorrência. |Texto |10|2019-12-11 (YYYY-MM-DD) |
|`EndDate`|Data do fim da recorrência. |Texto |10|2019-12-31 (YYYY-MM-DD) |
|`Interval`|Intervalo entre as recorrências. |Texto |10 |Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |"true" ou "false" |

## Agendamento de Recorrência

### Agendando uma Autorização

Diferente da recorrência anterior, este exemplo não autoriza imediatamente, mas agenda uma autorização futura.

Para programar a primeira transação da série de recorrências, passe o parâmetro `Payment.RecurrentPayment.AuthorizeNow` como "false" e adicione o parâmetro `Payment.RecurrentPayment.StartDate`.

#### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"2017091101",
   "Customer":{  
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
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Installments":1,
      "CreditCard":{
         "CardNumber":"5412217070050381",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment":{
         "AuthorizeNow":false,
         "StartDate":"2017-12-31",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
```

```shell
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{  
   "MerchantOrderId":"2017091101",
   "Customer":{  
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
   "Payment":{
      "Provider":"Simulado",
      "Type":"CreditCard",
      "Amount":10000,
      "Installments":1,
      "CreditCard":{
         "CardNumber":"5412217070050381",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa"
      },
      "RecurrentPayment":{
         "AuthorizeNow":false,
         "StartDate":"2017-12-31",
         "EndDate":"2019-12-31",
         "Interval":"Monthly"
      }
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.RecurrentPayment.StartDate`|Data para início da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.EndDate`|Data para término da recorrência.|Texto |10 |Não|
|`Payment.RecurrentPayment.Interval`|Intervalo da recorrência.<br>Monthly (default) / Bimonthly / Quarterly / SemiAnnual / Annual|Texto |10 |Não|
|`Payment.RecurrentPayment.DailyInterval`|Padrão da recorrência em dias. Não utilizar em conjunto com `Interval`.|Número|2|Não*|
|`Payment.RecurrentPayment.AuthorizeNow`|"true" - autoriza no momento da requisição. "false" - para agendamento futuro.|Booleano |--- |Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|19|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
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
|`Interval`|Intervalo entre as recorrências. |Texto |10 |Monthly / Bimonthly / Quarterly / SemiAnnual / Annual|
|`AuthorizeNow`|Define se a primeira recorrência já irá ser autorizada ou não. |Booleano |--- |true ou false |

## Alteração de Dados

### Alterando Dados do Comprador

Para alterar os dados do comprador de uma recorrência existente, basta fazer uma chamada PUT para o endpoint especificado.<br>Em **resposta**, a API irá retornar o código do [Status HTTP](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code), informando se a operação foi realizada com sucesso ou não.

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`Name`|Nome do comprador. |Texto |255|Sim|
|`Email`|Email do comprador. |Texto |255|Não|
|`Birthdate`|Data de nascimento do comprador. |Date |10 |Não|
|`Identity`|Número do RG, CPF ou CNPJ do cliente. |Texto |14 |Não|
|`IdentityType`|Tipo do documento de identificação do comprador (CFP/CNPJ).|Texto|255|Não|
|`Address.Street`|Endereço do comprador. |Texto |255 |Não|
|`Address.Number`|Número do endereço do comprador. |Texto |15 |Não|
|`Address.Complement`|Complemento do endereço do comprador.|Texto |50 |Não|
|`Address.ZipCode`|CEP do endereço do comprador. |Texto |9 |Não|
|`Address.City`|Cidade do endereço do comprador. |Texto |50 |Não|
|`Address.State`|Estado do endereço do comprador. |Texto |2 |Não|
|`Address.Country`|País do endereço do comprador. |Texto |35 |Não|
|`Address.District`|Bairro do endereço do comprador. |Texto |50 |Não|
|`DeliveryAddress.Street`|Endereço de entrega do comprador. |Texto |255 |Não|
|`DeliveryAddress.Number`|Número do endereço de entrega do comprador. |Texto |15 |Não|
|`DeliveryAddress.Complement`|Complemento do endereço de entrega do comprador. |Texto |50 |Não|
|`DeliveryAddress.ZipCode`|CEP do endereço de entrega do comprador. |Texto |9 |Não|
|`DeliveryAddress.City`|Cidade do endereço de entrega do comprador. |Texto |50 |Não|
|`DeliveryAddress.State`|Estado do endereço de entrega do comprador. |Texto |2 |Não|
|`DeliveryAddress.Country`|País do endereço de entrega do comprador. |Texto |35 |Não|
|`DeliveryAddress.District`|Bairro do endereço de entrega do comprador. |Texto |50 |Não|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando a Data Final da Recorrência

Para alterar a data final da recorrência já existente, basta fazer um PUT conforme o exemplo.

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate</span></aside>

```json
"2021-01-09"
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/EndDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2021-01-09"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`EndDate`|Data para término da recorrência.|Texto |10 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Intervalo da Recorrência

Para alterar o intervalo de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Interval</span></aside>

```json
{
  "Interval":"Annual"
}
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Interval"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"Interval":"Annual"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`Interval`|Intervalo da recorrência. <br>Monthly / Bimonthly / Quarterly / SemiAnnual / Annual.|Texto |10 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Dia da Recorrência

Ao efetuar a alteração do dia da recorrência, devem ser levadas em consideração as seguintes regras utilizadas para execução da atualização na API:

1- Se o novo dia informado for depois do dia atual, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 10, a data da próxima recorrência será dia 10/05.
<br/><br/>2- Se o novo dia informado for antes do dia atual, iremos atualizar o dia da recorrência, mas este só terá efeito depois que a próxima recorrência for executada com sucesso. <br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/05. Quando atualizado para o dia 03, a data da próxima recorrência permanecerá dia 25/05. Após sua execução, a recorrência seguinte será agendada para o dia 03/06.
<br/><br/>3- Se o novo dia informado for antes do dia atual, mas a próxima recorrência for em outro mês, iremos atualizar o dia da recorrência com efeito na próxima recorrência.<br>Ex.: Hoje é dia 05/05 e a próxima recorrência é dia 25/09. Quando atualizado para o dia 03, a data da próxima recorrência será 03/09.

<br/>Para modificar o dia de vencimento de uma recorrência já existente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay</span></aside>

```json
16
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/RecurrencyDay"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
16
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`RecurrencyDay`|Dia da recorrência.|Número |2 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando o Valor da Transação da Recorrência

Para modificar o valor da transação de uma recorrência já existente, basta fazer um PUT conforme o exemplo.

<aside class="warning">Essa alteração só afeta a data de pagamento da recorrência seguinte.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Amount</span></aside>

```json
156
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Amount"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
156
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API.|GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT.| GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência.|Texto |50 |Sim (envio no *endpoint*)|
|`Amount`|Valor do pedido, em centavos. Ex.: 156 equivale a R$ 1,56.|Número|15|Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando a Data do Próximo Pagamento

Para alterar somente a data do pagamento seguinte, basta fazer um PUT conforme o exemplo abaixo.

<aside class="warning">Esta operação modifica somente a data do pagamento seguinte, ou seja, as recorrências futuras permanecerão com as características originais.</aside>

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate</span></aside>

```json
"2017-06-15"
```

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/NextPaymentDate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
"2016-06-15"
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`NextPaymentDate`|Data de pagamento da próxima recorrência.|Texto |10 |Sim|

#### Resposta

```json


```

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

### Alterando os Dados de Pagamento da Recorrência

Durante o ciclo de vida de uma recorrência, é possível alterar:

* Adquirente (ex.: de Rede para Cielo);
* Cartão (em caso de cartão vencido);

<br/>Para alterar os dados de pagamento, basta fazer um PUT conforme o exemplo.

<aside class="warning">ATENÇÃO: Essa alteração afeta a todos os dados do nó "Payment". Para manter os dados anteriores, você deve informar esses campos utilizando os valores já salvos a serem mantidos.</aside>

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
      "CardNumber":"5412217070050381",
      "ExpirationDate":"05/2019"
   },
   "Credentials": {
      "Code": "9999999",
      "Key": "D8888888",
      "Password": "LOJA9999999",
      "Username": "#Braspag2018@NOMEDALOJA#",
      "Signature": "001"
   }
}
```

```shell
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
      "CardNumber":"5412217070050381",
      "ExpirationDate":"05/2019"
   },
   "Credentials": {
      "Code": "9999999",
      "Key": "D8888888",
      "Password": "LOJA9999999",
      "Username": "#Braspag2018@NOMEDALOJA#",
      "Signature": "001"
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|
|`Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Type`|Tipo do meio de pagamento. |Texto |100|Sim|
|`Amount`|Valor do pedido, em centavos.|Número |15 |Sim|
|`Installments`|Número de parcelas.|Número |2 |Sim|
|`SoftDescriptor`|Texto que será impresso na fatura do portador.|Texto |13|Não|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto |19|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto |25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão.|Texto |7 |Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto |4 |Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim|
|`Credentials.Code`|Afiliação gerada pela adquirente.|Texto|100|Sim|
|`Credentials.Key`|Chave de afiliação/token gerado pela adquirente.|Texto|100|Sim|
|`Credentials.Username`|Usuário gerado no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado).|Texto|50|Não|
|`Credentials.Password`|Senha gerada no credenciamento com a adquirente (provedores como Rede e Getnet utilizam usuário e senha nas comunicações, logo o campo deve obrigatoriamente ser enviado).|Texto|50|Não|
|`Credentials.Signature`|Enviar o *TerminalID* da adquirente **Global Payments** Ex.: 001. Para **Safra**, colocar nome do estabelecimento, cidade e estado concatenados com ponto-e-vírgula ";". Ex.: NomedaLoja;São Paulo;SP.|Texto|--|Não|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Desabilitação de Pedido

### Desabilitando um Pedido Recorrente

Para desabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Deactivate</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Deactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Reabilitação de Pedido

### Reabilitando um Pedido Recorrente

Para reabilitar um pedido recorrente, basta fazer um PUT conforme o exemplo:

#### Requisição

<aside class="request"><span class="method put">PUT</span> <span class="endpoint">/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate</span></aside>

```shell
--request PUT "https://apisandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}/Reactivate"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Número de identificação da recorrência. |Texto |50 |Sim (envio no *endpoint*)|

#### Resposta

```shell
HTTP Status 200
```

Consulte o anexo [HTTP Status Code](https://braspag.github.io//manual/braspag-pagador?json#lista-de-http-status-code) para ver a lista com todos os códigos de status HTTP possivelmente retornados pela API.

## Transação com Renova Fácil

O *Renova Fácil* é um serviço desenvolvido pela Cielo em conjunto com os emissores cujo objetivo é aumentar a taxa de conversão de vendas recorrentes com **cartão de crédito**.

Através da identificação de cartões vencidos no momento da transação, é feita a autorização com um novo cartão, que é então retornado para armazenagem.

<aside class="notice">Emissores participantes: Bradesco, Banco do Brasil, Santander, Panamericano, Citibank.</aside>

Para utilizar o Renova Fácil, é necessário que o serviço esteja habilitado na Cielo. Não é necessário enviar nenhuma informação extra na requisição de autorização, porém a resposta terá o nó `NewCard`.

Veja a seguir o exemplo de resposta de uma transação de crédito com o nó `NewCard`.

### Resposta

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

|Propriedade|Descrição|Tipo|Tamanho|
|-----------|---------|----|-------|
|`NewCard.CardNumber`|Novo número do cartão do comprador.|Texto|16|
|`NewCard.Holder`|Nome do portador impresso no novo cartão.|Texto|25|
|`NewCard.ExpirationDate`|Data de validade impressa no novo cartão.|Texto|7|
|`NewCard.SecurityCode`|Código de segurança impresso no verso do novo cartão.|Texto|4|
|`NewCard.Brand`|Bandeira do novo cartão.|Texto|10 |

<aside class="notice">Para simular o retorno do node "NewCard" em Sandbox utilize um cartão com final 3 e o "ExpirationDate" vencido.</aside>

### Resposta para clientes Cartão Protegido e Renova Fácil

Para clientes Cartão Protegido e Renova Fácil, o nó `NewCard` irá retornar o número mascarado do cartão e um novo token do cartão atualizado. Dessa forma o lojista pode submeter uma nova cobrança, usando o retorno do Renova Fácil de uma forma segura.

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
         "CardToken":"19077eb8-5d84-352f-10cd-6a4280b8c089"
         "SaveCard": false,
         "Brand": "Visa"
      },
      "AcquirerTransactionId": "0512105630844",
      "NewCard": {
         "CardNumber": "455187******4731",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2028",
         "SaveCard": false,
         "CardToken": "be7fg5a8-3ac8-59bc-dgf2-344516e20b68",
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
         "CardToken":"19077eb8-5d84-352f-10cd-6a4280b8c089"
         "SaveCard": false,
         "Brand": "Visa"
      },
      "AcquirerTransactionId": "0512105630844",
      "NewCard": {
         "CardNumber": "455187******4731",
         "Holder": "Nome do Portador",
         "ExpirationDate": "12/2028",
         "SaveCard": false,
         "CardToken": "be7fg5a8-3ac8-59bc-dgf2-344516e20b68",
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

|Propriedade|Descrição|Tipo|Tamanho|
|-----------|---------|----|-------|
|`NewCard.CardNumber`|BIN e 4 últimos dígitios do novo número do cartão do comprador.|Texto|16|
|`NewCard.Holder`|Nome do portador impresso no novo cartão.|Texto|25|
|`NewCard.ExpirationDate`|Data de validade impressa no novo cartão.|Texto|7|
|`NewCard.SecurityCode`|Código de segurança impresso no verso do novo cartão.|Texto|4|
|`NewCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão. OBS.: Se a origem da transação for do *Silent Order Post* então o retorno será `NewCard.PaymentToken`|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`NewCard.Brand`|Bandeira do novo cartão.|Texto|10|

# Salvando e Reutilizando Cartões

Ao contratar o [Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest){:target="_blank"}, é possível salvar um cartão de forma segura e de acordo com as normas PCI. A Braspag salva e criptografa os dados do cartão (nome do portador, número, bandeira e data de validade) em um token, que chamamos de `CardToken`. 

O token viabiliza o envio e processamento de transações e garante a integridade dos cartões armazenados. Além disso, geramos um novo token a cada transação do mesmo comprador.

Além da geração do `CardToken`, é possível associar um nome (um identificador em formato de texto) ao cartão salvo. Esse identificador será o `Alias`.

> **ATENÇÃO**: O Cartão Protegido não salva o CVV do cartão. Sendo assim:<br/>
> * O comprador deverá preencher o CVV a cada transação; ou<br/> 
> * A sua loja pode realizar transações sem o CVV desde que esteja autorizada pela adquirente.

<aside class="warning">Por questões de segurança, o cartão protegido só aceita salvar cartões que passem pela checagem do Algoritmo de Luhn, também conhecido como "mod10".</aside>

## Salvando um Cartão Durante uma Autorização

Para salvar um cartão de crédito utilizado em uma transação, basta enviar o parâmetro `Payment.SaveCard` como "true" na requisição padrão de autorização. A numeração do cartão utilizado pode ser validada através da técnica do mod10, explicada [neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360050638051){:target="_blank"}.

Abaixo veja a representação do **fluxo transacional** com a solicitação do token pela API do Pagador:

![Cartão Protegido - Pagador]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans4-pt.png)

Consulte também os fluxos de tokenização direta com a [API do Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest){:target="_blank"}, com a opção dos serviços da [API do VerifyCard](https://braspag.github.io//manual/braspag-verify-card){:target="_blank"}.

### Requisição

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
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":true,
         "Alias":"",
       },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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
      "CreditCard":{  
         "CardNumber":"4551870000000181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2021",
         "SecurityCode":"123",
         "Brand":"Visa",
         "SaveCard":true,
         "Alias":"",
       },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Sim|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|Sim|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|19|Sim|
|`CreditCard.Holder`|Nome do comprador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`CreditCard.ExpirationDate`|Data de validade impressa no cartão, no formato MM/AAAA.|Texto|7|Sim|
|`CreditCard.SecurityCode`|Código de segurança impresso no verso do cartão.|Texto|4|Sim|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|Sim |
|`CreditCard.SaveCard`|"true" - para salvar o cartão. / "false" - para não salvar o cartão.|Booleano|10|Não (default "false") |
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
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|
|`CreditCard.CardToken`|Token no *Cartão Protegido* que representa os dados do cartão.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Criando uma Transação com CardToken

Este é um exemplo de como utilizar o `CardToken`, previamente salvo, para criar uma transação.

Por questões de segurança, um `CardToken` não armazena o Código de Segurança (CVV). Desta forma, a sua aplicação precisa solicitar esta informação ao portador para cada nova transação e enviar o CVV no campo `CreditCard.SecurityCode`.

Caso seu estabelecimento tenha autorização da adquirente para submeter transações sem o CVV, o campo `CreditCard.SecurityCode` passa a ser opcional.

> Para [transacionar sem o CVV](https://suporte.braspag.com.br/hc/pt-br/articles/6758664323611){:target="_blank"}, solicite autorização à sua adquirente.

O nó `CreditCard` dentro do nó `Payment` enviará o `CardToken` conforme exemplo a seguir:

### Requisição

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
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
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
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|

## Criando uma Transação com Alias

Este é um exemplo de como utilizar o `Alias`, previamente salvo, para criar uma transação. O `Alias` é um nome (identificador em formato de texto) associado ao cartão salvo.

Por questões de segurança, um `Alias` não armazena o Código de Segurança (CVV). Desta forma, a sua aplicação precisa solicitar esta informação ao portador para cada nova transação e enviar o CVV no campo `CreditCard.SecurityCode`.

Caso seu estabelecimento tenha autorização da adquirente para submeter transações sem o CVV, o campo `CreditCard.SecurityCode` passa a ser opcional.

> Para [transacionar sem o CVV](https://suporte.braspag.com.br/hc/pt-br/articles/6758664323611){:target="_blank"}, solicite autorização à sua adquirente.

O nó `CreditCard` dentro do nó `Payment` enviará o `Alias` conforme exemplo a seguir:

### Requisição

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
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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
--request POST "https://apisandbox.braspag.com.br/v2/sales/"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
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
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15|Sim|
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
|`ProviderReturnCode`|Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|32|57|
|`ProviderReturnMessage`|Mensagem retornada pelo provedor do meio de pagamento (adquirente ou emissor).|Texto|512|Transação Aprovada|

# Pagamentos com Análise de Fraude

Ao efetuar um pagamento, é possível verificar qual o risco de uma transação ser fraudulenta. Essa verificação pode ocorrer antes ou depois da autorização da transação, de acordo com as regras definidas pelo cliente.

## Fluxo AuthorizeFirst

A sequência mais comum, em que acontece a **autorização antes da análise**, pode ocorrer com ou sem a **captura automática** da transação.

<br/>**Com Autorização**

Neste fluxo, a loja (plataforma) envia a requisição para a API do Pagador, que então envia a transação para autorização na Adquirente cadastrada na loja. Uma vez autorizada, o valor da venda estará sensibilizado, mas ainda não terá sido cobrado no cartão.<br/>
O Pagador faz a chamada para o Antifraude, onde ocorre a análise de risco do pedido.<br/>
Caso seja aceita pelo Antifraude, a transação é então capturada e a cobrança é realizada no cartão. Caso seja rejeitada pelo Antifraude, a API do Pagador solicita o cancelamento da transação à Adquirente e informa a loja. O valor bloqueado no cartão deverá retornar 100% para o cliente final.

![Antifraude 1a]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans1a-pt.png)

<br/>**Com Captura Automática**

Este fluxo é similar ao primeiro, com a diferença da captura automática no lugar da autorização. Se o Antifraude rejeita o pedido, que foi previamente autorizado pela Adquirente e já cobrado no cartão do cliente, a API do Pagador irá solicitar o cancelamento da transação à Adquirente e informar a loja. Neste caso, o valor já cobrado no cartão deverá igualmente ser estornado 100% para o cliente final.

![Antifraude 1b]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans1b-pt.png)

## Fluxo AnalyseFirst

Para maiores detalhes sobre o fluxo em que acontece a **análise antes da autorização**, consulte o [Manual do Antifraude](https://braspag.github.io//manual/antifraude?json#realizando-uma-an%C3%A1lise-de-fraude){:target="_blank"}.

## AuthorizeFirst x AnalyseFirst

Confira a seguir o comportamento da análise de risco de acordo com cada tipo de integração:

|Tipo de Integração|Descrição|Parâmetros Necessários|
|-|-|-|
|Autorização antes|A transação é enviada para a autorização e então analisada pelo Antifraude.|`FraudAnalysis.Sequence` igual a "AuthorizeFirst"|
|Análise antes|A transação é analisada pelo Antifraude e então enviada para autorização. Dessa forma, evita-se o envio de transações de alto risco para autorização.|`FraudAnalysis.Sequence` igual a "AnalyseFirst"|
|Análise das transações autorizadas|O Antifraude é acionado apenas para analisar transações autorizadas, evitando-se o custo com análises de transações que não receberiam autorização.|`FraudAnalysis.SequenceCriteria` igual a "OnSuccess"|
|Análise em qualquer hipótese|O Antifraude é acionado independentemente do status da transação após a autorização.|`FraudAnalysis.Sequence` igual a "AuthorizeFirst" e `FraudAnalysis.SequenceCriteria` igual a "Always"|
|Autorização em qualquer hipótese|A transação será enviada para autorização independentemente de seu score de fraude.|`FraudAnalysis.Sequence` igual a "AnalyseFirst" e `FraudAnalysis.SequenceCriteria` igual a "Always"|
|Captura de transações seguras|Após a análise de fraude, a captura será automática para transações autorizadas definidas como de baixo risco. Para a loja que utiliza revisão manual, a transação será capturada automaticamente assim que a Braspag receber notificação do novo status "_Accept_".|`FraudAnalysis.Sequence` igual a "AuthorizeFirst", `FraudAnalysis.CaptureOnLowRisk` igual a "true" e `Payment.Capture` igual a "false"|
|Cancelamento de transações comprometidas|Caso a análise de fraude retorne um alto risco para uma transação já autorizada ou capturada, ela será imediamente cancelada ou estornada. Para a loja que utiliza revisão manual, a transação será cancelada ou estornada automaticamente assim que a Braspag receber notificação do novo status "_Reject_".|`FraudAnalysis.Sequence` igual a "AuthorizeFirst" e `FraudAnalysis.VoidOnHighRisk` igual a "true"|

Caso não seja especificado durante a autorização, a Braspag irá processar sua transação pelo seguinte fluxo:
* `FraudAnalysis.Sequence` igual a "AuthorizeFirst",
* `FraudAnalysis.SequenceCriteria` igual a "OnSuccess",
* `FraudAnalysis.VoidOnHighRisk` igual a "false",
* `FraudAnalysis.CaptureOnLowRisk` igual a "false". 

## Implementando a Análise Cybersource

Para que a análise de fraude via Cybersource seja efetuada durante uma transação de cartão de crédito, é necessário complementar o contrato de autorização com os nós `FraudAnalysis`, `Cart`, `MerchantDefinedFields` e `Travel` (este somente para venda de passagens aéreas).

Durante implantação do Cybersource, informações adicionais podem ser armazenadas através de MDDs (Merchand Defined Data), que são campos numerados de 0 a N utilizados para armazenar informações exclusivas do merchant. Confira [este artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360004822532-Implanta%C3%A7%C3%A3o-Cybersource-MDD-s-Geral){:target="_blank"} com detalhes sobre o preenchimento desses campos.

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
         "SaveCard":false
      },
      "Credentials":{  
         "Code":"9999999",
         "Key":"D8888888",
         "Password":"LOJA9999999",
         "Username":"#Braspag2018@NOMEDALOJA#",
         "Signature":"001"
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
         "SaveCard":false
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`MerchantId`|Identificador da loja na Braspag.|GUID|36|Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na Braspag.|Texto|40|Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja.|GUID|36|Não (envio no *header*)|
|`MerchantOrderId`|Número do pedido da loja.|Texto|50|Sim|
|`Customer.Name`|Nome completo do comprador.|Texto|120|Sim|
|`Customer.Identity`|Número do documento de identificação do comprador.|Texto|14|Sim|
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
|`Customer.Address.Country`|País do endereço de cobrança.<br/>Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Texto|2|Sim|
|`Customer.Address.District`|Bairro do endereço de cobrança.|Texto|45|Sim|
|`Customer.DeliveryAddress.Street`|Logradouro do endereço de entrega.|Texto|54|Não|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega.|Texto|5|Não|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega.|Texto|14|Não|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega.|Texto|9|Não|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega.|Texto|50|Não|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega.|Texto|2|Não|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega.<br/>Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Texto|2|Não|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega.|Texto|45|Não|
|`Payment.Provider`|Nome do provedor da autorização.|Texto|15|Sim|
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
|`Payment.CreditCard.CardNumber`|Número do cartão de crédito.|Texto|19|Sim|
|`Payment.CreditCard.Holder`|Nome do portador impresso no cartão de crédito. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`Payment.CreditCard.ExpirationDate`|Data de validade do cartão de crédito.|Texto|7|Sim|
|`Payment.CreditCard.SecurityCode`|Código de segurança no verso do cartão de crédito.|Texto|4|Sim|
|`Payment.CreditCard.Brand`|Bandeira do cartão de crédito.|Texto|10|Sim |
|`Payment.CreditCard.SaveCard`|Indica se os dados do cartão de crédito serão armazenados no *Cartão Protegido*.|Booleano|---|Não|
|`Payment.CreditCard.Alias`|Alias (apelido) do cartão de crédito salvo no *Cartão Protegido*.|Texto|64|Não|
|`Payment.FraudAnalysis.Sequence`|Tipo de fluxo da análise de fraude. <br/> Possíveis valores: "AnalyseFirst" / "AuthorizeFirst".|Texto|14|Sim|
|`Payment.FraudAnalysis.SequenceCriteria`|Critério do fluxo da análise de fraude. <br/> Possíveis valores: "OnSuccess" / "Always".|Texto|9|Sim|
|`Payment.FraudAnalysis.Provider`|Provedor de *Antifraude*. <br/> Possível valor: "Cybersource".|Texto|10|Sim|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indica se a transação após a análise de fraude será capturada. <br/> Possíveis valores: "true" / "false" (default) <br/> Obs1.: Quando enviado igual a "true" e o retorno da análise de fraude for de baixo risco ("*Accept*"), a transação anteriormente autorizada será capturada. <br/> Obs2.: Quando enviado igual a "true" e o retorno da análise de fraude for revisão ("*Review*"), a transação ficará autorizada, sendo capturada após a Braspag receber notificação de alteração do status para baixo risco ("*Accept*"). <br/> Obs3.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco (`FraudAnalysis.Sequence`) deve ser obrigatoriamente "AuthorizeFirst".|Booleano|---|Não|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indica se a transação após a análise de fraude será cancelada. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Quando enviado igual a "true" e o retorno da análise de fraude for de alto risco ("*Reject*"), a transação anteriormente autorizada será cancelada. <br/> Obs2.: Quando enviado igual a "true" e o retorno da análise de fraude for revisão ("*Review*"), a transação ficará autorizada, sendo cancelada após a Braspag receber notificação de alteração do status para alto risco ("*Reject*"). <br/> Obs3.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco (`FraudAnalysis.Sequence`) deve ser obrigatoriamente "AuthorizeFirst".|Booleano|---|Não|
|`Payment.FraudAnalysis.TotalOrderAmount`|Valor total do pedido, em centavos. <br/> Ex.: 123456 = R$ 1.234,56.|Número|15|Sim|
|`Payment.FraudAnalysis.FingerPrintId`|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas.|Texto|88|Sim|
|`Payment.FraudAnalysis.Browser.HostName`|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP.|Texto|60|Não|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifica se o browser do comprador aceita cookies. <br/> Possíveis valores: "true" / "false" (default).|Booleano|---|Sim|
|`Payment.FraudAnalysis.Browser.Email`|E-mail registrado no browser do comprador. Pode ser diferente do e-mail de cadastro na loja (`Customer.Email`).|Texto|100|Não|
|`Payment.FraudAnalysis.Browser.Type`|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP. <br/> Ex.: "Google Chrome", "Mozilla Firefox", "Safari", etc.|Texto|40|Não|
|`Payment.FraudAnalysis.Browser.IpAddress`|Endereço de IP do comprador. Formato IPv4 ou IPv6.|Texto|45|Sim|
|`Payment.FraudAnalysis.Cart.IsGift`|Indica se o pedido realizado pelo comprador é para presente.|Booleano|---|Não|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser devolvido à loja. <br/> Possíveis valores: "true" / "false" (default).|Booleano|---|Não|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Identifica a avaliação dos endereços de cobrança e entrega para diferentes cidades, estados ou países. <br/> [Lista de Valores - GiftCategory](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].giftcategory). |Texto|9|Não| 
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude. <br/> [Lista de Valores - HostHedge](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].hosthedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude. <br/> [Lista de Valores - NonSensicalHedge](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].nonsensicalhedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude. <br/> [Lista de Valores - ObscenitiesHedge](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].obscenitieshedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Nível de importância das verificações sobre os números de telefone do comprador na análise de fraude. <br/> [Lista de Valores - PhoneHedge](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].phonehedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.Name`|Nome do produto.|Texto|255|Sim|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Quantidade do produto.|Número|15|Sim|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (*Stock Keeping Unit* - Unidade de Controle de Estoque) do produto.|Texto|255|Sim|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Preço unitário do produto, em centavos. <br/> Ex.: 10950 = R$ 109,50.|Número|15|Sim|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Nível de risco do produto associado a quantidade de chargebacks.|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Nível de importância, na análise de fraude, da hora do dia em que o comprador realizou o pedido. <br/> [Lista de Valores - TimeHedge](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].timehedge).|Texto|6|Não|
|`Payment.FraudAnalysis.Cart.Items.Type`|Categoria do produto. <br/> [Lista de Valores - Type](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].type).|Texto|19|Não|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Nível de importância, na análise de fraude, da frequência de compra do comprador dentro dos 15 minutos anteriores. <br/> [Lista de Valores - VelocityHedge](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.cart.items[n].velocityhedge).|Texto|6|Não|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Id das informações adicionais a serem enviadas. <br/> [Tabela de MDDs](#tabela-de-mdds).|Número|2|Sim|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Valor das informações adicionais a serem enviadas. <br/> [Tabela de MDDs](#tabela-de-mdds).|Texto|255|Sim|
|`Payment.FraudAnalysis.Shipping.Addressee`|Nome completo do responsável a receber o produto no endereço de entrega.|Texto|120|Não|
|`Payment.FraudAnalysis.Shipping.Method`|Meio de entrega do pedido. <br/> [Lista de Valores - Method](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.shipping.method).|Texto|8|Não|
|`Payment.FraudAnalysis.Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega. <br/> Ex.: 552121114700.|Texto|15|Não|
|`Payment.FraudAnalysis.Travel.JourneyType`|Tipo de viagem. <br/> [Lista de Valores - JourneyType](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.journeytype).|Texto|32|Não|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Data e hora de partida. <br/> Ex.: 2018-03-31 19:16:38.|DateTime|---|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Nome completo do passageiro.|Texto|120|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Número do documento do passageiro.|Texto|32|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Classificação da empresa aérea. <br/> [Lista de Valores - Status](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].status).|Texto|15|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Tipo do passageiro. <br/> [Lista de Valores - Rating](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].rating).|Texto|13|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|E-mail do passageiro.|Texto|255|Não|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Telefone do passageiro. <br/> Ex.: 552121114700.|Texto|15|Não|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Código do aeroporto de partida.<br/> Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Texto|3|Não|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Código do aeroporto de chegada.<br/> Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Texto|3|Não|

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
         "SaveCard":false
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
         "SaveCard":false
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
|`Payment.Provider`|Nome do provedor da autorização.|Texto|
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
|`Payment.FraudAnalysis.Provider`|Provedor de *Antifraude*.|Texto|
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
|`Payment.FraudAnalysis.Id`|Id da transação no *Antifraude* Braspag.|GUID|
|`Payment.FraudAnalysis.Status`|Status da transação no *Antifraude* Braspag. <br/> [Lista de Valores - Status](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.status){:target="_blank"}.|Número|
|`Payment.FraudAnalysis.FraudAnalysisReasonCode`|Código de retorno da Cybersouce. <br/> [Lista de Valores - FraudAnalysisReasonCode](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.fraudanalysisreasoncode){:target="_blank"}.|Número|
|`Payment.FraudAnalysis.ReplyData.AddressInfoCode`|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador. <br/> Os códigos são concatenados usando o caractere "^". Ex.: COR-BA^MM-BIN. <br/> [Lista de Valores - AddressInfoCode](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.addressinfocode){:target="_blank"}.|Texto|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Códigos que afetaram a pontuação da análise. <br/> Os códigos são concatenados usando o caractere "^". Ex.: B^D^R^Z. <br/>[Lista de Valores - FactorCode](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.factorcode){:target="_blank"}.|Texto|
|`Payment.FraudAnalysis.ReplyData.Score`|Score da análise de fraude. Valor entre 0 e 100.|Número|
|`Payment.FraudAnalysis.ReplyData.BinCountry`|Código do país do BIN do cartão usado na análise.<br/> Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Texto|
|`Payment.FraudAnalysis.ReplyData.CardIssuer`|Nome do banco ou entidade emissora do cartão de crédito.|Texto|
|`Payment.FraudAnalysis.ReplyData.CardScheme`|Bandeira do cartão.|Texto|
|`Payment.FraudAnalysis.ReplyData.HostSeverity`|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto.|Número|
|`Payment.FraudAnalysis.ReplyData.InternetInfoCode`|Códigos que indicam problemas com o endereço de e-mail, endereço IP ou endereço de cobrança. <br/> Os códigos são concatenados usando o caractere "^". Ex.: FREE-EM^RISK-EM <br/> [Lista de Valores - InternetInfoCode](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.internetinfocode){:target="_blank"}.|Texto|
|`Payment.FraudAnalysis.ReplyData.IpRoutingMethod`|Método de roteamento do comprador obtido a partir do endereço de IP. <br/> [Lista de Valores - IpRoutingMethod](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.iproutingmethod){:target="_blank"}.|Texto|
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
|`Payment.Status`|Status da transação no Pagador. <br/> [Lista de Status da Transação](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação){:target="_blank"}.|Número|
|`Payment.ProviderReturnCode`|Código retornado pela adquirente ou emissor.|Texto|
|`Payment.ProviderReturnMessage`|Mensagem retornada pela adquirente ou emissor.|Texto|

### Fingerprint com a Cybersource

O Fingerprint é a identificação digital do dispositivo do comprador. Essa identificação é composta por uma série de dados coletados na página de checkout do site ou aplicativo. Para configurar o Fingerprint com a Cybersource, consulte o manual do [Antifraude Gateway](https://braspag.github.io//manual/antifraude#fingerprint-com-a-cybersource){:target="_blank"}.

## Implementando a Análise ACI Worldwide

> Na requisição de análise de fraude com a ACI Worldwide, envie o campo `Payment.FraudAnalysis.Provider` como "RedShield".

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales/</span></aside>

```json
{  
   "MerchantOrderId":"123456",
   "Customer":{  
      "Name":"Comprador Teste",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "mobile": "5511940028922",
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
      "Recurrent":true,
      "SoftDescriptor":"Mensagem",
      "DoSplit":false,
      "CreditCard":{  
         "CardNumber":"455184******0181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2028",
         "SecurityCode":"***",
         "Brand":"Visa",
         "SaveCard":"true"
      },
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"RedShield",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":true,
            "IpAddress":"127.0.0.1"
         },
         "Cart":{  
            "IsGift":true,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "Name":"ItemTeste1",
                  "Quantity":2,
                  "Sku":"20170511",
                  "UnitPrice":20000
               },
               {  
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":26,
               "Value":"nomedousuario"
            },
            {  
               "Id":27,
               "Value":"120"
            },
            {  
               "Id":28,
               "Value":"12"
            },
            {  
               "Id":29,
               "Value":"WEB"
            }
         ],
         "Shipping":{
            "Addressee":"Nome do destinatario",
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
{  
   "MerchantOrderId":"123456",
   "Customer":{  
      "Name":"Comprador Teste",
      "Identity":"12345678910",
      "IdentityType":"CPF",
      "Email":"comprador@braspag.com.br",
      "Birthdate":"1991-01-02",
      "Phone": "5521976781114",
      "mobile": "5511940028922",
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
      "Recurrent":true,
      "SoftDescriptor":"Mensagem",
      "DoSplit":false,
      "CreditCard":{  
         "CardNumber":"455184******0181",
         "Holder":"Nome do Portador",
         "ExpirationDate":"12/2028",
         "SecurityCode":"***",
         "Brand":"Visa",
         "SaveCard":"true"
      },
      "FraudAnalysis":{  
         "Sequence":"AnalyseFirst",
         "SequenceCriteria":"OnSuccess",
         "Provider":"RedShield",
         "CaptureOnLowRisk":false,
         "VoidOnHighRisk":false,
         "TotalOrderAmount":10000,
         "FingerPrintId":"074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
         "Browser":{  
            "CookiesAccepted":true,
            "IpAddress":"127.0.0.1"
         },
         "Cart":{  
            "IsGift":true,
            "ReturnsAccepted":true,
            "Items":[  
               {  
                  "Name":"ItemTeste1",
                  "Quantity":2,
                  "Sku":"20170511",
                  "UnitPrice":20000
               },
               {  
                  "Name":"ItemTeste2",
                  "Quantity":1,
                  "Sku":"20170512",
                  "UnitPrice":10000
               }
            ]
         },
         "MerchantDefinedFields":[  
            {  
               "Id":26,
               "Value":"nomedousuario"
            },
            {  
               "Id":27,
               "Value":"120"
            },
            {  
               "Id":28,
               "Value":"12"
            },
            {  
               "Id":29,
               "Value":"WEB"
            }
         ],
         "Shipping":{
            "Addressee":"Nome do destinatario",
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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|----|-------|-----------|---------|
|`MerchantOrderId`|Número do pedido da loja.|Texto|50|Sim|
|`Customer.Name`|Nome completo do comprador.|Texto|120|Sim|
|`Customer.Identity`|Número do documento de identificação do comprador.|Texto|16|Sim|
|`Customer.IdentityType`|Tipo de documento de identificação do comprador. <br/> Possíveis valores: "CPF" ou "CNPJ".|Texto|255|Não|
|`Customer.Email`|E-mail do comprador.|Texto|100|Sim|
|`Customer.Birthdate`|Data de nascimento do comprador. <br/> Ex.: 1991-01-10.|Date|10|Sim|
|`Customer.Phone`|Número do telefone do comprador. <br/> Ex.: 5521976781114.|Texto|15|Sim|
|`Customer.Mobile`|Número do telefone celular do comprador. <br/> Ex.: 5521976781114.|Texto|15|Sim|
|`Customer.Address.Street`|Logradouro do endereço de cobrança.|Texto|54|Sim|
|`Customer.Address.Number`|Número do endereço de cobrança.|Texto|5|Sim|
|`Customer.Address.Complement`|Complemento do endereço de cobrança.|Texto|14|Não|
|`Customer.Address.ZipCode`|CEP do endereço de cobrança.|Texto|9|Sim|
|`Customer.Address.City`|Cidade do endereço de cobrança.|Texto|50|Sim|
|`Customer.Address.State`|Estado do endereço de cobrança.|Texto|2|Sim|
|`Customer.Address.Country`|País do endereço de cobrança.<br/>Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Texto|2|Sim|
|`Customer.Address.District`|Bairro do endereço de cobrança.|Texto|45|Sim|
|`Customer.DeliveryAddress.Street`|Logradouro do endereço de entrega.|Texto|54|Não|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega.|Texto|5|Não|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega.|Texto|14|Não|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega.|Texto|9|Não|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega.|Texto|50|Não|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega.|Texto|2|Não|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega.<br/>Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}.|Texto|2|Não|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega.|Texto|45|Não|
|`Payment.Provider`|Nome do provedor da autorização.|Texto|15|Sim|
|`Payment.Type`|Tipo do meio de pagamento.<br/>Obs.: Somente o tipo "CreditCard" funciona com análise de fraude.|Texto|100|Sim|
|`Payment.Amount`|Valor da transação financeira, em centavos. <br/> Ex.: 150000 = R$ 1.500,00.|Número|15|Sim|
|`Payment.Currency`|Moeda na qual o pagamento será feito. <br/> Possíveis valores: "BRL" / "USD" / "MXN" / "COP" / "CLP" / "ARS" / "PEN" / "EUR" / "PYN" / "UYU" / "VEB" / "VEF" / "GBP".|Texto|3|Não|
|`Payment.Country`|País na qual o pagamento será realizado.|Texto|3|Não|
|`Payment.Installments`|Número de parcelas.|Número|2|Sim|
|`Payment.Interest`|Tipo de parcelamento. <br/> Possíveis valores: "ByMerchant" (loja) / "ByIssuer" (emissor).|Texto|10|Não|
|`Payment.Capture`|Indica se a autorização deverá ser com captura automática. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade. <br/> Obs2.: Este campo deverá ser preenchido de acordo com o fluxo da análise de fraude.|Booleano|---|Não|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Deverá verificar junto à adquirente a disponibilidade desta funcionalidade.<br/> Obs2. O campo `Payment.Recurrent` deve ser igual a "true" quando este for igual a "false".|Booleano|---|Não|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Este campo igual a "true" não irá criar uma recorrência; apenas permitirá a realização de uma transação sem a necessidade de envio do CVV, indicando para a adquirente que é a cobrança de uma transação de uma recorrência. <br/> Obs2.: Somente para transações **Cielo**. <br/> Obs3.: O campo `Payment.Authenticate` deve ser igual a "false" quando este for igual a "true".|Booleano|---|Não|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador. <br/> Obs.: O valor deste campo deve tornar fácil para o portador a identificação do estabelecimento onde foi realizada a compra, pois é um dos principais ofensores para chargeback.|Texto|13|Não|
|`Payment.DoSplit`|Indica se a transação será dividida entre vários participantes. <br/> Possíveis valores: "true" / "false" (default). <br/> Para utilizar a funcionalidade de split de pagamentos, é necessário a contratação da solução junto à Braspag.|Booleano|---|Não|
|`Payment.CreditCard.CardNumber`|Número do cartão de crédito.|Texto|19|Sim|
|`Payment.CreditCard.Holder`|Nome do portador impresso no cartão de crédito. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|Sim|
|`Payment.CreditCard.ExpirationDate`|Data de validade do cartão de crédito.|Texto|7|Sim|
|`Payment.CreditCard.SecurityCode`|Código de segurança no verso do cartão de crédito.|Texto|4|Sim|
|`Payment.CreditCard.Brand`|Bandeira do cartão de crédito.|Texto|10|Sim |
|`Payment.CreditCard.SaveCard`|Indica se os dados do cartão de crédito serão armazenados no *Cartão Protegido*.|Booleano|---|Não|
|`Payment.FraudAnalysis.Sequence`|Tipo de fluxo da análise de fraude. <br/> Possíveis valores: "AnalyseFirst" / "AuthorizeFirst".|Texto|14|Sim|
|`Payment.FraudAnalysis.SequenceCriteria`|Critério do fluxo da análise de fraude. <br/> Possíveis valores: "OnSuccess" / "Always".|Texto|9|Sim|
|`Payment.FraudAnalysis.Provider`|Provedor de *Antifraude*. <br/> Valor possível para o provedor ACI Worldwide: "RedShield".|Texto|10|Sim|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indica se a transação após a análise de fraude será capturada. <br/> Possíveis valores: "true" / "false" (default) <br/> Obs1.: Quando enviado igual a "true" e o retorno da análise de fraude for de baixo risco ("*Accept*"), a transação anteriormente autorizada será capturada. <br/> Obs2.: Quando enviado igual a "true" e o retorno da análise de fraude for revisão ("*Review*"), a transação ficará autorizada, sendo capturada após a Braspag receber notificação de alteração do status para baixo risco ("*Accept*"). <br/> Obs3.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco (`FraudAnalysis.Sequence`) deve ser obrigatoriamente "AuthorizeFirst".|Booleano|---|Não|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indica se a transação após a análise de fraude será cancelada. <br/> Possíveis valores: "true" / "false" (default). <br/> Obs1.: Quando enviado igual a "true" e o retorno da análise de fraude for de alto risco ("*Reject*"), a transação anteriormente autorizada será cancelada. <br/> Obs2.: Quando enviado igual a "true" e o retorno da análise de fraude for revisão ("*Review*"), a transação ficará autorizada, sendo cancelada após a Braspag receber notificação de alteração do status para alto risco ("*Reject*"). <br/> Obs3.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco (`FraudAnalysis.Sequence`) deve ser obrigatoriamente "AuthorizeFirst".|Booleano|---|Não|
|`Payment.FraudAnalysis.TotalOrderAmount`|Valor total do pedido, em centavos. <br/> Ex.: 123456 = R$ 1.234,56.|Número|15|Sim|
|`Payment.FraudAnalysis.FingerPrintId`|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas.|Texto|88|Sim|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifica se o browser do comprador aceita cookies. <br/> Possíveis valores: "true" / "false" (default).|Booleano|---|Sim|
|`Payment.FraudAnalysis.Browser.IpAddress`|Endereço de IP do comprador. Formato IPv4 ou IPv6.|Texto|45|Sim|
|`Payment.FraudAnalysis.Cart.IsGift`|Indica se o pedido realizado pelo comprador é para presente.|Booleano|---|Não|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser devolvido à loja. <br/> Possíveis valores: "true" / "false" (default).|Booleano|---|Não|
|`Payment.FraudAnalysis.Cart.Items.Name`|Nome do produto.|Texto|255|Sim|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Quantidade do produto.|Número|15|Sim|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (*Stock Keeping Unit* - Unidade de Controle de Estoque) do produto.|Texto|255|Sim|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Preço unitário do produto, em centavos. <br/> Ex.: 10950 = R$ 109,50.|Número|15|Sim|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Id das informações adicionais a serem enviadas. <br/> [Tabela de MDDs](#tabela-de-mdds).|Número|2|Sim|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Valor das informações adicionais a serem enviadas. <br/> [Tabela de MDDs](#tabela-de-mdds).|Texto|255|Sim|
|`Payment.FraudAnalysis.Shipping.Addressee`|Nome completo do responsável a receber o produto no endereço de entrega.|Texto|120|Não|
|`Payment.FraudAnalysis.Shipping.Method`|Meio de entrega do pedido. <br/> [Lista de Valores - Method](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.shipping.method).|Texto|8|Não|
|`Payment.FraudAnalysis.Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega. <br/> Ex.: 552121114700.|Texto|15|Não|
|`Payment.FraudAnalysis.Travel.JourneyType`|Tipo de viagem. <br/> [Lista de Valores - JourneyType](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.journeytype).|Texto|32|Não*|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Data e hora de partida. <br/> Ex.: 2018-03-31 19:16:38.|DateTime|---|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Nome completo do passageiro.|Texto|120|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Número do documento do passageiro.|Texto|32|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Classificação da empresa aérea. <br/> [Lista de Valores - Status](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].status).|Texto|15|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Tipo do passageiro. <br/> [Lista de Valores - Rating](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.travel.passengers[n].rating).|Texto|13|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|E-mail do passageiro.|Texto|255|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Telefone do passageiro. <br/> Ex.: 552121114700.|Texto|15|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Código do aeroporto de partida.<br/> Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Texto|3|Não*|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Código do aeroporto de chegada.<br/> Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}.|Texto|3|Não*|

<aside class="warning">*Os campos do nó "FraudAnalysis.Travel" se tornam obrigatórios caso o segmento do seu negócio seja o aéreo.</aside>

### Resposta

```json
{
    "MerchantOrderId": "123456",
    "Customer": {
        "Name": "Comprador Teste",
        "Identity": "12345678910",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Phone": "5521976781114",
        "Birthdate": "1991-01-02",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "Mobile": "5511940028922"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": true,
        "CreditCard": {
            "CardNumber": "455184******0181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2028",
            "SaveCard": true,
            "Brand": "Visa"
        },
        "ProofOfSale": "836045",
        "AcquirerTransactionId": "0527060143139",
        "AuthorizationCode": "095614",
        "SoftDescriptor": "Mensagem",
        "SentOrderId": "20220527180141FEC711",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
            "Provider": "RedShield",
            "CaptureOnLowRisk": false,
            "VoidOnHighRisk": false,
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "26",
                    "Value": "nomedousuario"
                },
                {
                    "Id": "27",
                    "Value": "120"
                },
                {
                    "Id": "28",
                    "Value": "12"
                },
                {
                    "Id": "29",
                    "Value": "WEB"
                }
            ],
            "Cart": {
                "IsGift": true,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Name": "ItemTeste1",
                        "Sku": "20170511",
                        "UnitPrice": 20000,
                        "Quantity": 2
                    },
                    {
                        "Name": "ItemTeste2",
                        "Sku": "20170512",
                        "UnitPrice": 10000,
                        "Quantity": 1
                    }
                ]
            },
            "Travel": {
                "DepartureTime": "2018-01-09T18:00:00",
                "JourneyType": "OneWayTrip",
                "Passengers": [
                    {
                        "Name": "Passenger Test",
                        "Identity": "212424808",
                        "Status": "Gold",
                        "Rating": "Adult",
                        "Email": "email@mail.com",
                        "Phone": "5564991681074",
                        "TravelLegs": [
                            {
                                "Destination": "GIG",
                                "Origin": "AMS"
                            }
                        ]
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": true,
                "IpAddress": "127.0.0.1"
            },
            "Shipping": {
                "Addressee": "Nome do destinatario",
                "Phone": "551121840540",
                "Method": "LowCost"
            },
            "Id": "3c31b840-30f0-49a5-40c1-08da39ba639e",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "FactorCode": "000.000.000",
                "ProviderTransactionId": "153322379407",
                "ReturnMessage": "Transaction succeeded",
                "ProviderOrderId": "000591000001XAA20220527170142439",
                "ReturnCode": "0100"
            }
        },
        "DoSplit": false,
        "PaymentId": "b705b792-e5c0-4386-9f44-b07a791fb972",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2022-05-27 18:01:41",
        "CapturedAmount": 10000,
        "CapturedDate": "2022-05-27 18:01:43",
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
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972/void"
            }
        ]
    }
}
```

```shell
{
    "MerchantOrderId": "123456",
    "Customer": {
        "Name": "Comprador Teste",
        "Identity": "12345678910",
        "IdentityType": "CPF",
        "Email": "comprador@braspag.com.br",
        "Phone": "5521976781114",
        "Birthdate": "1991-01-02",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": "NotInformed"
        },
        "Mobile": "5511940028922"
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": "ByMerchant",
        "Capture": true,
        "Authenticate": false,
        "Recurrent": true,
        "CreditCard": {
            "CardNumber": "455184******0181",
            "Holder": "Nome do Portador",
            "ExpirationDate": "12/2028",
            "SaveCard": true,
            "Brand": "Visa"
        },
        "ProofOfSale": "836045",
        "AcquirerTransactionId": "0527060143139",
        "AuthorizationCode": "095614",
        "SoftDescriptor": "Mensagem",
        "SentOrderId": "20220527180141FEC711",
        "FraudAnalysis": {
            "Sequence": "AnalyseFirst",
            "SequenceCriteria": "OnSuccess",
            "FingerPrintId": "074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2074c1ee676ed4998ab66491013c565e2",
            "Provider": "RedShield",
            "CaptureOnLowRisk": false,
            "VoidOnHighRisk": false,
            "TotalOrderAmount": 10000,
            "IsRetryTransaction": false,
            "MerchantDefinedFields": [
                {
                    "Id": "26",
                    "Value": "nomedousuario"
                },
                {
                    "Id": "27",
                    "Value": "120"
                },
                {
                    "Id": "28",
                    "Value": "12"
                },
                {
                    "Id": "29",
                    "Value": "WEB"
                }
            ],
            "Cart": {
                "IsGift": true,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Name": "ItemTeste1",
                        "Sku": "20170511",
                        "UnitPrice": 20000,
                        "Quantity": 2
                    },
                    {
                        "Name": "ItemTeste2",
                        "Sku": "20170512",
                        "UnitPrice": 10000,
                        "Quantity": 1,
                    }
                ]
            },
            "Travel": {
                "DepartureTime": "2018-01-09T18:00:00",
                "JourneyType": "OneWayTrip",
                "Passengers": [
                    {
                        "Name": "Passenger Test",
                        "Identity": "212424808",
                        "Status": "Gold",
                        "Rating": "Adult",
                        "Email": "email@mail.com",
                        "Phone": "5564991681074",
                        "TravelLegs": [
                            {
                                "Destination": "GIG",
                                "Origin": "AMS"
                            }
                        ]
                    }
                ]
            },
            "Browser": {
                "CookiesAccepted": true,
                "IpAddress": "127.0.0.1"
            },
            "Shipping": {
                "Addressee": "Nome do destinatario",
                "Phone": "551121840540",
                "Method": "LowCost"
            },
            "Id": "3c31b840-30f0-49a5-40c1-08da39ba639e",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "FactorCode": "000.000.000",
                "ProviderTransactionId": "153322379407",
                "ReturnMessage": "Transaction succeeded",
                "ProviderOrderId": "000591000001XAA20220527170142439",
                "ReturnCode": "0100"
            }
        },
        "DoSplit": false,
        "PaymentId": "b705b792-e5c0-4386-9f44-b07a791fb972",
        "Type": "CreditCard",
        "Amount": 10000,
        "ReceivedDate": "2022-05-27 18:01:41",
        "CapturedAmount": 10000,
        "CapturedDate": "2022-05-27 18:01:43",
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
                "Href": "https://apiquerysandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.braspag.com.br/v2/sales/b705b792-e5c0-4386-9f44-b07a791fb972/void"
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|
|---|---|---|
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
|`Customer.Address.AddressType`|Tipo do endereço de cobrança.|Texto|
|`Customer.DeliveryAddress.Street`|Logradouro do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.Number`|Número do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.Complement`|Complemento do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.ZipCode`|CEP do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.City`|Cidade do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.State`|Estado do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.Country`|País do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.District`|Bairro do endereço de entrega.|Texto|
|`Customer.DeliveryAddress.AddressType`|Tipo do endereço de entrega.|Texto|
|`Customer.Mobile`|Número do telefone celular do comprador.|Texto|
|`Payment.ServiceTaxAmount`|Montante do valor da autorização que deve ser destinado à taxa de serviço.|Número|
|`Payment.Installments`|Número de parcelas.|Número|
|`Payment.Interest`|Tipo de parcelamento.|Texto|
|`Payment.Capture`|Indica se a autorização deverá ser com captura automática.|Booleano|
|`Payment.Authenticate`|Indica se a transação deve ser autenticada.|Booleano|
|`Payment.Recurrent`|Indica se a transação é do tipo recorrente.|Booleano|
|`Payment.CreditCard.CardNumber`|Número do cartão de crédito truncado.|Texto|
|`Payment.CreditCard.Holder`|Nome do portador impresso no cartão de crédito.|Texto|
|`Payment.CreditCard.ExpirationDate`|Data de validade do cartão de crédito.|Texto|
|`Payment.CreditCard.SaveCard`|Indica se os dados do cartão de crédito foram armazenados no *Cartão Protegido*.|Booleano|
|`Payment.CreditCard.Brand`|Bandeira do cartão de crédito.|Texto|
|`Payment.ProofOfSale`|Número do comprovante de venda na adquirente (NSU - Número Sequencial Único).|Texto|
|`Payment.AcquirerTransactionId`|Identificador da transação na adquirente.|Texto|
|`Payment.AuthorizationCode`|Código de autorização na adquirente.|Texto|
|`Payment.SoftDescriptor`|Texto que será impresso na fatura do portador.|Texto|
|`Payment.SentOrderId`| Número adicional ao MerchantOrderId gerado para o pedido e utilizado durante a transação. Esse número (SentOrderId) só será diferente em caso de adequação a regras da adquirente ou em caso de números de identificação do pedido (MerchantOrderId) repetidos. |Texto|
|`Payment.FraudAnalysis.Sequence`|Tipo de fluxo da análise de fraude.|Texto|
|`Payment.FraudAnalysis.SequenceCriteria`|Critério do fluxo da análise de fraude.|Texto|
|`Payment.FraudAnalysis.FingerPrintId`|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador.|Texto|
|`Payment.FraudAnalysis.Provider`|Provedor de *Antifraude*.|Texto|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Indica se a transação após a análise de fraude será capturada.|Booleano|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Indica se a transação após a análise de fraude será cancelada.|Booleano|
|`Payment.FraudAnalysis.TotalOrderAmount`|Valor total do pedido, em centavos.|Número|
|`Payment.FraudAnalysis.IsRetryTransaction`|Retentativa de uma análise, e deverá ser enviado com valor igual a TRUE quando o código de retorno na primeira tentativa for igual a BP900| Booleano|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Id das informações adicionais a serem enviadas.|Número|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Valor das informações adicionais a serem enviadas.|Texto|
|`Payment.FraudAnalysis.Cart.IsGift`|Indica se o pedido realizado pelo comprador é para presente.|Booleano|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Indica se o pedido realizado pelo comprador pode ser devolvido à loja.|Booleano|
|`Payment.FraudAnalysis.Cart.Items.Name`|Nome do produto.|Texto|
|`Payment.FraudAnalysis.Cart.Items.Sku`|SKU (*Stock Keeping Unit* - Unidade de Controle de Estoque) do produto.|Texto|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Preço unitário do produto.|Número|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Quantidade do produto.|Número|
|`Payment.FraudAnalysis.Travel.DepartureTime`|Data e hora de partida.|DateTime|
|`Payment.FraudAnalysis.Travel.JourneyType`|Tipo de viagem.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Nome completo do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Número do documento do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Classificação da empresa aérea.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Tipo do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|E-mail do passageiro.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Telefone do passageiro.|Número|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Código do aeroporto de chegada.|Texto|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Código do aeroporto de partida.|Texto|
`Payment.FraudAnalysis.Browser.CookiesAccepted`|Identifica se o browser do comprador aceita cookies.|Booleano|
|`Payment.FraudAnalysis.Browser.IpAddress`|Endereço de IP do comprador. Formato IPv4 ou IPv6.|Texto|
|`Payment.FraudAnalysis.Shipping.Addressee`|Nome completo do responsável a receber o produto no endereço de entrega.|Texto|
|`Payment.FraudAnalysis.Shipping.Phone`|Número do telefone do responsável a receber o produto no endereço de entrega.|Número|
|`Payment.FraudAnalysis.Shipping.Method`|Meio de entrega do pedido.|Texto|
|`Payment.FraudAnalysis.Id`|Id da transação no *Antifraude* Braspag.|GUID|
|`Payment.FraudAnalysis.Status`|Status da transação no *Antifraude* Braspag. <br/> [Lista de Valores - Status](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.status){:target="_blank"}.|Número|
|`Payment.FraudAnalysis.StatusDescription`|Descrição do status| Texto|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Códigos que afetaram a pontuação da análise. <br/> Os códigos são concatenados usando o caractere "^". Ex.: B^D^R^Z. <br/>[Lista de Valores - FactorCode](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.fraudanalysis.replydata.factorcode){:target="_blank"}.|Texto|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Id da transação na ACI Worldwide.|Texto|
|`Payment.FraudAnalysis.ReplyData.ReturnMessage`|Mensagem retornada pelo provedor de Antifraude|Texto|
|`Payment.FraudAnalysis.ReplyData.ProviderOrderId`| Id do pedido na ACI Worldwide| Texto|
|`Payment.FraudAnalysis.ReplyData.ReturnCode`| Código retornado pelo provedor do meio de pagamento (adquirente ou emissor).| Texto|
|`Payment.DoSplit`|Indica se a transação será dividida entre vários participantes.|Booleano|
|`Payment.PaymentId`|Identificador da transação no Pagador Braspag.|GUID|
|`Payment.Type`|Tipo do meio de pagamento. Obs.: Somente o tipo “CreditCard” funciona com análise de fraude.| Texto|
|`Payment.Amount`|Valor da transação financeira, em centavos. Ex.: 150000 = R$ 1.500,00.| Texto|
|`Payment.ReceivedDate`|Data em que a transação foi recebida no Pagador Braspag. <br/> Ex.: 2018-01-16 16:38:19.|Datetime|
|`Payment.CapturedAmount`|Valor capturado da transação, em centavos. <br/> Ex.: 123456 = R$ 1.234,56.|Número|
|`Payment.CapturedDate`|Data em que a transação foi capturada na adquirente. <br/> Ex.: 2018-01-16 16:38:20.|Datetime|
|`Payment.Currency`| Moeda na qual o pagamento será feito. Possíveis valores: “BRL” / “USD” / “MXN” / “COP” / “CLP” / “ARS” / “PEN” / “EUR” / “PYN” / “UYU” / “VEB” / “VEF” / “GBP”.|Não|
|`Payment.Country`|País no qual o pagamento será realizado.| Texto|
|`Payment.Provider`|Nome do provedor da autorização.|Texto|
|`Payment.ReasonCode`|Código de retorno da operação.|Texto|
|`Payment.ReasonMessage`|Mensagem de retorno da operação.|Texto|
|`Payment.Status`|Status da transação no Pagador. <br/> [Lista de Status da Transação](https://braspag.github.io/manual/braspag-pagador#lista-de-status-da-transação){:target="_blank"}.|Número|
|`Payment.ProviderReturnCode`|Código retornado pela adquirente ou emissor.|Texto|
|`Payment.ProviderReturnMessage`|Mensagem retornada pela adquirente ou emissor.|Texto|

### Fingerprint com a ACI

O Fingerprint é a identificação digital do dispositivo do comprador. Essa identificação é composta por uma série de dados coletados na página de checkout do site ou aplicativo. Para configurar o Fingerprint com a ACI, consulte o manual do [Antifraude Gateway](https://braspag.github.io//manual/antifraude#fingerprint-com-a-aci-worldwide){:target="_blank"}.

# Consultas

As formas de consultar uma transação ou venda dependem de quanto tempo ela tem de vida, como especificado na tabela abaixo:

|TEMPO DE VIDA|FORMA DE CONSULTA|
|---|---|
|Até 3 meses|Pela API ou pelo painel Admin Braspag.|
|De 3 a 12 meses|Pelo painel Admin Braspag com a opção “Histórico” selecionada.|
|Acima de 12 meses|Por contato direto com seu Executivo Comercial Braspag.|

A consulta deve ser feita através de requisição diretamente à API de Consulta, como mostrado na figura:

![Consulta]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans6-pt.png)

## Consultando uma Transação via PaymentID

Para que o nó `Chargeback` esteja contido no retorno, a Braspag deverá passar a receber os chargebacks da sua loja. Você poderá então acatar ou contestar as operações, acompanhando os resultados das contestações no Painel Admin Braspag. Através do [Post de Notificação](https://braspag.github.io//manual/braspag-pagador#post-de-notifica%C3%A7%C3%A3o), sua loja poderá ser informada da transação que sofreu o chargeback.
As operações contidas no Painel Admin Braspag também estão disponíveis na [API Risk Notification](https://braspag.github.io//manual/risknotification){:target="_blank"}.

Para que o nó `FraudAlert` esteja contido no retorno, a Braspag deverá passar a receber os alertas de fraude da sua loja, que ficarão disponíveis no Painel Admin Braspag. Através do Post de Notificação, a sua loja será informada da transação que sofreu o alerta de fraude.

### Transações de Crédito, Débito ou Pix

Para consultar uma transação de cartão de crédito, cartão de débito ou Pix via `PaymentID`, é necessário o envio de mensagem HTTP através do método GET para o recurso *Payment*, conforme o exemplo:

#### Requisição

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

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`PaymentId`|Número de identificação do pagamento. |Texto |36 |Sim (envio no *endpoint*)|

#### Resposta

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
      "RecurrentPayment": {
        "RecurrentPaymentId": "1069a2c8-83cb-4268-8b62-0a9dc5038665"
        },
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
|`Merchant.TradeName`|Nome da loja.|Texto|50|Texto alfanumérico|
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15| Consulte os [anexos](#anexos).|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Ex.: "CreditCard"|
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
|`Payment.AcquirerTransactionId`|Id da transação no provedor do meio de pagamento.|Texto|40|Texto alfanumérico|
|`Payment.ProofOfSale`|Número do comprovante de venda.|Texto|20|Texto alfanumérico|
|`Payment.AuthorizationCode`|Código de autorização.|Texto|300|Texto alfanumérico|
|`Payment.Refunds.Amount`|Valor reembolsado, em centavos.|Número|15|10000|
|`Payment.Refunds.Status`|Status do reembolso.|Número|1|Received = 1<br/>Sent = 2<br/>Approved = 3<br/>Denied = 4<br/>Rejected = 5|
|`Payment.Refunds.ReceivedDate`|Data de recebimento do reembolso.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Chargebacks[n].Amount`|Valor do chargeback, em centavos.|Número|15|10000|
|`Payment.Chargebacks[n].CaseNumber`|Número do caso relacionado ao chargeback.|Texto|16|Texto alfanumérico|
|`Payment.Chargebacks[n].Date`|Data do chargeback.|Date|10|AAAA-MM-DD|
|`Payment.Chargebacks[n].ReasonCode`|Código do motivo do chargeback.<br/>[Lista de Valores - ReasonCode](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.chargebacks[n].reasoncode-e-payment.chargebacks[n].reasonmessage).|Texto|10|Texto alfanumérico|
|`Payment.Chargebacks[n].ReasonMessage`|Mensagem de motivo do chargeback.<br/>[Lista de Valores - ReasonMessage](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.chargebacks[n].reasoncode-e-payment.chargebacks[n].reasonmessage).|Texto|512|Texto alfanumérico|
|`Payment.Chargebacks[n].Status`|Status do chargeback. <br/> [Lista de Valores - Status](https://braspag.github.io//manual/braspag-pagador#lista-de-valores-payment.chargebacks[n].status).|Texto|32|Texto|
|`Payment.Chargebacks[n].RawData`|Dado enviado pela adquirente, podendo ser o titular do cartão ou outra mensagem.|Texto|512|Texto alfanumérico|
|`Payment.FraudAlert.Date`|Data do alerta de fraude.|Date|10|AAAA-MM-DD|
|`Payment.FraudAlert.ReasonMessage`|Mensagem de motivo do alerta de fraude.|Texto|512|Texto alfanumérico|
|`Payment.FraudAlert.IncomingChargeback`|Flag que identifica se a transação possui um chargeback ocorrido antes do alerta de fraude.|Booleano|5|Texto|
|`Payment.PaymentId`|Campo identificador do pedido.|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.ReasonCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`Payment.ReasonMessage`|Mensagem de retorno da adquirência.|Texto|512|Texto alfanumérico|
|`Payment.CapturedAmount`|Valor capturado.|Número|15|10000|
|`Payment.CapturedDate`|Data da captura.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.VoidedAmount`|Valor cancelado/estornado, em centavos.|Número|15|10000|
|`Payment.VoidedDate`|Data do cancelamento/estorno.|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.Status`|Status da transação.|Byte|2| Ex.: "1"|
|`RecurrentPayment.RecurrentPaymentID`|Caso a transação tenha surgido de um pedido recorrente, retorna o RecurrentPaymentID desse pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.Provider`|Provedor utilizado.|Texto|32|Simulado|
|`Payment.ProviderDescription`|Nome do adquirente que processou a transação.|Texto|512|Simulado|
|`CreditCard.CardNumber`|Número do cartão do comprador.|Texto|19|---|
|`CreditCard.Holder`|Nome do portador impresso no cartão. Obs.: Regras de tamanho do campo podem variar de acordo com a adquirente.|Texto|25|---|
|`CreditCard.ExpirationDate`|Data de validade impresso no cartão.|Texto|7|MM/AAAA|
|`CreditCard.Brand`|Bandeira do cartão.|Texto|10|---|
|`CreditCard.SaveCard`|Identifica se o cartão será salvo para gerar o token (*CardToken*).|Booleano|---|true / false (default)|

### Transação de Boleto Registrado

Para consultar uma transação de boleto registrado via PaymentID, é necessário o envio de mensagem HTTP do método GET para o recurso *Payment*, conforme o exemplo:

#### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales/{PaymentId}</span></aside>

```shell
--request GET "https://apiquerysandbox.braspag.com.br/v2/sales/{PaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`PaymentId`|Número de identificação do pagamento. |GUID |36 |Sim (envio no *endpoint*)|

#### Resposta

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
     "RecurrentPayment": {
        "RecurrentPaymentId": "1069a2c8-83cb-4268-8b62-0a9dc5038665"
        },
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
|`Payment.Provider`|Nome do provedor do meio de pagamento.|Texto|15| Consulta os provedores disponíveis nos anexos|
|`Payment.Type`|Tipo do meio de pagamento.|Texto|100|Ex.: Boleto|
|`Payment.Amount`|Valor do pedido, em centavos.|Número|15|10000|
|`Payment.CapturedAmount`|Valor pago do boleto, em centavos.|Número|15|10000|
|`Payment.Instructions`|Texto sobre alguma instrução específica para o boleto.|Texto|Veja as [Regras Específicas por Banco](#conciliação-de-boletos).|Ex.: "Não pagar após o vencimento"|
|`Payment.Demonstrative`|Texto sobre alguma informação específica para o boleto.|Texto|Veja as [Regras Específicas por Banco](#conciliação-de-boletos).|Ex.: "Boleto referente ao pedido número 99999"|
|`Payment.Url`|URL para apresentação do boleto.|Texto|-|Ex.: "https://www.pagador.com.br/post/pagador/reenvia.asp/3fda2279-1c45-4271-9656-XXXXXXXXXX"|
|`Payment.BoletoNumber`|Nosso número.|Número|Veja as [Regras Específicas por Banco](#conciliação-de-boletos).|Ex.: "12345678"|
|`Payment.BarCodeNumber`|Código de barras do boleto.|Texto|44|Ex.: "99999390276000001234864001834007775680099999"|
|`Payment.DigitableLine`|Linha digitável do boleto.|Texto|54|Ex.: "99999.39027 60000.012348 64001.834007 7 75680000199999"|
|`Payment.Assignor`|Nome do cedente do boleto.|Texto|200|Ex.: "RAZAO SOCIAL DA LOJA LTDA"|
|`Payment.Address`|Endereço do cedente do boleto.|Texto|160|Ex.: "Alameda Xingu 512"|
|`Payment.Identification`|CNPJ do cedente.|Texto|18|Ex.: "11.355.111/0001-11"|
|`Payment.ExpirationDate`|Data de vencimento do boleto.|Texto|AAAA-MM-DD|Ex.: "2018-06-21"|
|`Payment.CreditDate`|Data de crédito do valor pago do boleto.|Texto|AAAA-MM-DD|Ex.: "2018-06-19"|
|`Payment.CapturedDate`|Data de pagamento do boleto.|Texto|AAAA-MM-DD HH:mm:SS|Ex.: "2018-06-19 01:45:57"|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Braspag.|Texto|AAAA-MM-DD HH:mm:SS|Ex.: "2018-06-19 01:45:57"|
|`Payment.ReturnUrl`|URL da loja para onde o cliente é redirecionado.|Texto|-|Ex.: "https://www.loja.com.br"|
|`Payment.Currency`|Moeda na qual o pagamento será feito.|Texto|3|BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|País na qual o pagamento será feito.|Texto|3|BRA|
|`Payment.ExtraDataCollection.Name`|Nome do campo em que será gravado o dado extra.|Texto|50|Texto alfanumérico|
|`Payment.ExtraDataCollection.Value`|Valor do campo em que será gravado o dado extra.|Texto|1024|Texto alfanumérico|
|`Payment.PaymentId`|Campo identificador do pedido.|GUID|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`Payment.ReasonCode`|Código de retorno da adquirência.|Texto|32|Texto alfanumérico|
|`Payment.Status`|Status da transação.|Byte|2| Ex.: 1|
|`RecurrentPayment.RecurrentPaymentID`|Caso a transação tenha surgido de um pedido recorrente, retorna o RecurrentPaymentID desse pedido|Guid|36|xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|

## Consultando uma Venda pelo Identificador da Loja

Não é possível consultar um pagamento diretamente pelo identificador enviado pela loja (`MerchantOrderId`), mas é possível obter todos os `PaymentIds` associados ao identificador.

Para consultar uma venda pelo identificador da loja, é necessário o envio de mensagem HTTP do método GET para o recurso */sales*, conforme o exemplo:

### Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">/v2/sales?merchantOrderId={merchantOrderId}</span></aside>

```shell
--request GET "https://apiquerysandbox.braspag.com.brv2/sales?merchantOrderId={merchantOrderId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`MerchantOrderId`|Campo identificador do pedido na loja. |Texto |36 |Sim (envio no *endpoint*)|

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
--request GET "https://apiquerysandbox.braspag.com.br/v2/RecurrentPayment/{RecurrentPaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: 0123456789012345678901234567890123456789"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API. |GUID |36 |Sim (envio no *header*)|
|`MerchantKey`|Chave pública para autenticação dupla na API.|Texto |40 |Sim (envio no *header*)|
|`RequestId`|Identificador do request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | GUID | 36 |Não (envio no *header*)|
|`RecurrentPaymentId`|Campo identificador da recorrência. |Texto |36 |Sim (envio no *endpoint*)|

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
|`Status`|Status do pedido recorrente. |Número|1 |1- Ativo / 2- Finalizado / 3- Desativado pelo Usuário / 4- Desativado por Número Máximo de Tentativas / 5- Desativado por Cartão de Crédito Expirado|
|`RecurrencyDay`|Dia da recorrência.|Número|2 |22 |
|`SuccessfulRecurrences`|Quantidade de recorrências realizadas com sucesso.|Número|2 |5|
|`RecurrentTransactions.RecurrentPaymentId`|Id da recorrência.|GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`RecurrentTransactions.TransactionId`|Payment ID da transação gerada na recorrência.|GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
|`RecurrentTransactions.PaymentNumber`|Número da recorrência. A primeira é zero. |Número|2 |3 |
|`RecurrentTransactions.TryNumber`|Número da tentativa atual na recorrência específica. |Número|2 |1 |

# Post de Notificação

Para receber a notificação de alteração de status da transação (ex.: confirmação de pagamento ou devolução), configure o campo "URL de Notificação" durante o cadastro de sua loja na Braspag. O endereço deve ser HTTPS e não se deve utilizar uma porta fora do padrão HTTPS (443).

Veja o fluxo percorrido pelo post de notificação:

![Post de Notificação]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/fluxo-trans5-pt.png)

<aside class="warning">Como existe a possibilidade de ocorrerem intermitências entre as APIs de envio e de recebimento, é necessário fazer a consulta (sondagem) das transações pendentes (não pagas) que ainda não tenham sido atualizadas no dia.</aside>

Os parâmetros serão enviados à URL cadastrada, conforme demonstrado no exemplo abaixo.

## Notificação Enviada

```json
{
   "RecurrentPaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "ChangeType": "2"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`RecurrentPaymentId`|Identificador que representa o pedido recorrente (aplicável somente para `ChangeType` "2" ou "4").|GUID|36|Não|
|`PaymentId`|Identificador que representa a transação.|GUID|36|Sim|
|`ChangeType`|Especifica o tipo de notificação. Obs.: Consulte a tabela abaixo. | Número | 1 |Sim|

|ChangeType|Descrição|
|----------|---------|
|"1"|Mudança de status do pagamento.|
|"2"|Recorrência criada.|
|"3"|Mudança de status do *Antifraude*.|
|"4"|Mudança de status do pagamento recorrente (Ex.: desativação automática).|
|"5"|Estorno negado (aplicável para **Rede**).|
|"6"|Boleto registrado pago a menor.|
|"7"|Notificação de chargeback. Exclusivo para clientes integrados à [Risk Notification API](https://braspag.github.io//manual/risknotification){:target="_blank"}.|
|"8"|Alerta de fraude.|

## Resposta Esperada

É esperado o retorno da loja com a seguinte resposta: `HTTP Status Code 200 OK`.

<aside class="notice">Caso não seja retornada a resposta acima, haverá mais três tentativas de envio do Post de Notificação.</aside>
<aside class="warning">Cada tentativa terá o espaço de 2 horas entre cada uma delas.</aside>

# ANEXOS

## Lista de Providers

No caso da integração SOAP, consulte a lista de provedores (*providers*) e seus correspondentes meios de pagamento listados [neste artigo](https://suporte.braspag.com.br/hc/pt-br/articles/360026794092-Lista-de-Payment-Method){:target="_blank"}.<br/>
As listas a seguir se referem a provedores na integração REST:  

### Providers para Crédito

|Provider|Brand|Descrição|
|--------|-----|---------|
|Simulado|---|Provider de Sandbox. [Clique aqui](https://braspag.github.io//manual/braspag-pagador#cartões-para-teste-(simulado)) para mais detalhes sobre cartões para teste.|
|Cielo30|Visa, Master, Amex, Elo, Aura, Jcb, Diners, Discover, Hipercard, Hiper, Sorocred|Provider para transações na plataforma de e-commerce Cielo 3.0.|
|Getnet|Visa, Master, Elo, Amex, Hipercard|Provider para transações na plataforma de e-commerce Getnet.|
|Rede2|Visa, Master, Hipercard, Hiper, Diners, Elo, Amex, Sorocred|Provider para transações na plataforma de e-commerce da Rede (e-Rede) na versão REST.|
|GlobalPayments|Visa, Master, Elo, Hiper, Hipercard, Cabal, Amex|Provider para transações na plataforma de e-commerce Global Payments.|
|Stone|Visa, Master, Hipercard, Elo|Provider para transações na plataforma de e-commerce Stone.|
|Safra2|Visa, Master, Hipercard, Elo, Amex|Provider para transações na plataforma de e-commerce Safra.|
|PagSeguro|Visa, Master, Hipercard, Elo, Hiper, Diners, Amex|Provider para transações na plataforma de e-commerce PagSeguro.|
|FirstData|Visa, Master, Elo, Hipercard, Cabal, Amex|Provider para transações em guaranis (PYG), pesos argentinos (ARG) e reais (BRL) na plataforma de e-commerce First Data.|
|Sub1|Visa, Master, Diners, Amex, Discover, Cabal, Naranja e Nevada|Provider para transações em pesos argentinos (ARG) na plataforma legado Sub1 First Data.|
|Banorte|Visa, Master, Carnet|Provider para transações em pesos mexicanos (MXN) na plataforma de e-commerce Banorte.|
|Credibanco2|Visa, Master, Diners, Amex, Credential|Provider para transações em pesos colombianos (COP) na plataforma de e-commerce Credibanco.|
|Transbank2|Visa, Master, Diners, Amex|Provider para transações em pesos chilenos (CLP) na plataforma de e-commerce Transbank.|
|Banese|Banese|Provider para transações com a bandeira BaneseCard.|
|BrasilCard|BrasilCard|Provider para transações com a bandeira BrasilCard.|
|CredSystem|CredSystem|Sistema de cartões em regime de bandeira privativa (Private Label Brand).|
|Credz|Credz|Sistema de cartões em regime de bandeira privativa (Private Label Brand).|
|DMCard|DMCard|Sistema de cartões em regime de bandeira privativa (Private Label Brand).|

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
|Simulado, Cielo30 (Cielo 3.0), Rede2, Getnet, FirstData, GlobalPayments e Safra2.|

### Providers para Consulta BIN via VerifyCard

|Provider|
|--------|
|Simulado, Cielo30 (Cielo 3.0)|

### Providers para Boleto com Registro

|Provider|
|--------|
|Braspag, Bradesco2, BancoDoBrasil2, BancoDoBrasil3, ItauShopline, Itau2, Santander2, Caixa2, CitiBank2|

### Providers para Transferência Eletrônica (Débito Online)

|Provider|
|--------|
|SafetyPay, PayMeeRedirectCheckout, PayMeeSemiTransparent|

### Providers para Pix

|Provider|
|--------|
|Cielo30, Bradesco2|

## Lista de Status da Transação

Lista de status retornados pela API:

|Código|Status do Pagamento|Meio de pagamento|Descrição|
|------|-------------------|-----------------|---------|
|0|NotFinished|Todos|**Falha ao processar o pagamento**.<br>Possíveis causas: dados incorretos, erro na requisição, *timeout* da adquirente, alguma instabilidade no processamento.<br>Em caso de transação de débito, o comprador pode ter abandonado a compra.|
|1|Authorized|Todos|**Meio de pagamento apto a ser capturado ou pago (boleto)**.<br>Para transação de boleto, significa que o boleto foi gerado com sucesso.<br>Para transação com cartão, significa que houve a aprovação pelo banco emissor. Contudo, isso não significa que a transação foi concluída - para isso, é necessário uma segunda etapa, a captura da transação ou a efetivação do pagamento.|
|2|PaymentConfirmed|Todos|Pagamento confirmado e finalizado.|
|3|Denied|Cartões de crédito e débito (transferência eletrônica) e e-wallets.|**Pagamento negado por autorizador**. <br>Possíveis causas: limite insuficiente, falta de pagamento do cartão, bandeira indisponível, bloqueio por fraude, entre outros.<br>Para saber o real motivo da negação é necessário olhar o código de retorno gerado durante a transação.|
|10|Voided|Todos, exceto boleto.|**Pagamento cancelado**.<br>É a [suspensão da transação](https://suporte.braspag.com.br/hc/pt-br/articles/360003150692-Qual-a-diferen%C3%A7a-entre-cancelamento-e-estorno-){:target="_blank"}, isentando de taxa ou valores cobrados. As transações pré-autorizadas podem ser canceladas mesmo após às 23h59 da data de autorização. Já as transações capturadas podem ser canceladas até às 23h59 do mesmo dia da autorização, após esse horário o valor será estornado.|
|11|Refunded|Cartões de crédito e débito e e-wallets.|**Pagamento cancelado/estornado**.<br>Significa que foi solicitado o cancelamento da transação, podendo ocorrer a partir das 0h00 do dia após a criação da transação. Independentemente do valor, só é possível realizar uma solicitação de estorno por transação. Isso pode acontecer por conta de dados incorretos ou por solicitação do comprador.|
|12|Pending|Cartões de crédito e débito (transferência eletrônica), e-wallets e pix.|**Esperando retorno da instituição financeira**. <br>Significa que a transação foi enviada para a Braspag em processo de pré-autorização, esperando uma resposta do banco emissor para validá-la. |
|13|Aborted|Todos|**Pagamento cancelado por falha no processamento**.<br>Significa que a transação foi cancelada por falha de processamento. Também pode ser abortada, caso o Antifraude negue a transação antes da autorização. |
|20|Scheduled|Cartão de crédito e e-wallets.|**Recorrência agendada**.<br>Significa que a transação terá uma recorrência agendada, ou seja, o valor da compra será recolhido no dia em que foi agendado pela loja. |

## Lista de Status do Antifraude

| Código | Descrição  |
|:-------|:-----------|
| 0      | Unknown    |
| 1      | Accept     |
| 2      | Reject     |
| 3      | Review     |
| 4      | Aborted    |
| 5      | Unfinished |

## Tabela de MDDs

De acordo com a necessidade do seu negócio, é desenhada uma estratégia de risco considerando o nível de relevância dos campos MDD (Merchant Defined Data). Caso não sejam enviados, esses campos ainda serão cobrados durante a validação das transações de testes. Por esse motivo, solicitamos que seja feita uma análise prévia da documentação e que seja feita sinalização, por parte da loja, dos campos cujo envio não será possível realizar.

<aside class="warning">Não faça o envio de campos vazios. Caso não possua algum dos dados para enviar, simplesmente ignore o campo correspondente.</aside>

**Nível de Relevância dos Campos MDD**

1- Relevante <br/>
2- Muito Relevante <br/>
3- Extremamente Relevante <br/><br/>

|ID|Valor|Tipo|Nível de Relevância|Segmento|
|--|-----|----|-------------------|--------|
|1|Cliente que efetua o login. Possíveis valores: "{*login_do_cliente*}" (caso o cliente final efetue login no site para comprar) / "Guest" (caso o cliente final faça a compra como visitante). Obs.: **Não enviar** o campo caso um terceiro (ex.: um agente) realize a venda diretamente.|string|2|Todos|
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
|74|Identifica se é um passageiro frequente (frequent flyer). Possíveis valores: "SIM" / "NAO".|string|2|Aéreo|
|75|Identificação do passageiro frequente (frequent flyer number).|string|2|Aéreo|
|76|Categoria do passageiro frequente (frequent flyer). Esta categoria pode variar de acordo com a companhia aérea.|int|2|Aéreo|
|77|Dia da semana do embarque. Possíveis valores: "Sunday" (Domingo) / "Monday" (Segunda-feira) / "Tuesday" (Terça-feira) / "Wednesday" (Quarta-feira) / "Thursday" (Quinta-feira) / "Friday" (Sexta-feira) / "Saturday" (Sábado).|string|2|Aéreo|
|78|Código da companhia aérea. Ex.: "JJ" / "LA" / "AA" / "UA" / "G3" etc.|string|1|Aéreo|
|79|Classe tarifária da passagem. Ex.: "W" / "Y" / "N" etc.|string|2|Aéreo|
|80|Número do celular do passageiro. Formato: DDIDDDNúmero - Ex.: 5521976781114.|string|2|Aéreo|
|81|Identifica se o dono do cartão de crédito irá viajar. Possíveis valores: "SIM" / "NAO".|string|3|Aéreo|
|82|Identifica se o seller (vendedor) irá trabalhar com revisão manual ou não. Possíveis valores: "SIM" / "NAO".|string|1|Todos|
|83|Segmento de negócio. Ex.: Varejo.|string|2|Todos|
|84|Nome da plataforma integrada à API Antifraude Gateway Braspag. Caso seja uma integração direta entre a loja e a Braspag, enviar valor igual a "PROPRIA".|string|3|Todos|
|85 a 89|Campos livres e definidos junto ao provedor de Antifraude, conforme as regras de negócio.|---|---|---|
|90 a 100|Reservados.|---|---|---|

## Lista de HTTP Status Code

|Código HTTP|Mensagem|
|---|---|
|200|Ok|
|201|Created|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|405|Method Not Allowed|
|500|Internal Server Error|
|502|Bad Gateway|
|503|Service Unavailable|

Para cada status teremos diferentes cenários, veja alguns exemplos de situações em que cada código pode retornar:

**Respostas de sucesso**

* **200 Ok**: status informando que a solicitação foi atendida. Pode ser retornado ao obter um `AccessToken`, por exemplo;
* **201 Created**: status informando que a criação da transação ocorreu corretamente (para todos os tipos de pagamentos: boleto, crédito, débito, transferência eletrônica e e-wallet).

**Respostas de erro do Cliente**

* **400 Bad Request**: indica alguma falha na requisição (sintaxe JSON inválida);
* **401 Unauthorized**: indica erro de autenticação. Pode ocorrer caso use o `MerchantKey` errado, por exemplo;
* **403 Forbidden**: não autorizado por conta de restrição de IP na loja;
* **404 Not Found**: o servidor não pode encontrar o recurso solicitado. O endpoint pode estar errado ou, no caso de consulta de pedidos, o pedido pode não existir, pode ter sido criado por outra loja (diferente da loja que você está usando) ou pode ter mais de três meses (período máximo para consultar pedidos na API);
* **405 Method Not Allowed**: o método HTTP está incorreto (POST, PUT, GET, PATCH, DELETE).

**Respostas de erro do Servidor**

* **500 Internal Server Error, 502 Bad Gateway ou 503 Service Unavailable**: podem ser retornados em alguma falha interna na Braspag, como por exemplo indisponibilidade de algum meio de pagamento ou lentidão.Caso observe um desses retornos, recomendamos contatar o suporte para entender o real motivo.

## Lista de Status da Recorrência

| Código | Descrição                 |
|--------|---------------------------|
| 1      | Active.                   |
| 2      | Finished.                 |
| 3      | DisabledByMerchant.       |
| 4      | DisabledMaxAttempts.      |
| 5      | DisabledExpiredCreditCard.|
| 6      | BoletoWaitingConciliation.|

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
|167|Antifraud not configured|Antifraude não vinculado ao cadastro do lojista.|
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
|213|Credit Card Number is invalid|Cartão de crédito enviado é invalido.|
|214|Credit Card Holder Must Have Only Letters|Portador do cartão não deve conter caracteres especiais.|
|215|Agency is required in Boleto Credential|Campo obrigatório não enviado.|
|216|Customer IP address is invalid|IP bloqueado por questões de segurança.|
|300|MerchantId was not found|---|
|301|Request IP is not allowed|---|
|302|Sent MerchantOrderId is duplicated|Houve duplicidade do pedido.|
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
|Autorizado|0000000000000000 / 0000000000000001 / 0000000000000004|6|Operação realizada com sucesso|
|Não Autorizado|0000000000000002|05|Não Autorizada|
|Não Autorizado|0000000000000003|57|Cartão Expirado|
|Não Autorizado|0000000000000005|78|Cartão Bloqueado|
|Não Autorizado|0000000000000006|99|Time Out|
|Não Autorizado|0000000000000007|77|Cartão Cancelado|
|Não Autorizado|0000000000000008|70|Problemas com o Cartão de Crédito|
|Autorização Aleatória|0000000000000009|4 a 99|Operation Successful / Time Out|

As informações de código de segurança (CVV) e validade podem ser aleatórias, mantendo o seu formato - "3 dígitos" (CVV) e "MM/YYYY" (Validade). Não utilize pontos ou separadores entre os números do cartão utilizado.

> **Nota**: Se o objetivo for testar uma transação no Pagador salvando o número do cartão, é recomendado usar um gerador de cartões para atender a regra do mod10 (Algoritimo de Luhn), que é empregada nos ambientes Sandbox e de Produção do Cartão Protegido.

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
|SameDay|Entrega no mesmo dia.|
|OneDay|Entrega no próximo dia.|
|TwoDay|Entrega em dois dias.|
|ThreeDay|Entrega em três dias.|
|LowCost|Entrega de baixo custo.|
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

|Valor|Descrição|
|:-|:-|
|Standard|Tipo Standard.|
|Gold|Tipo Gold.|
|Platinum|Tipo Platinum.|

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
|P|Mutação de identidade. Vários valores de um elemento de identidade estão ligados ao valor de um elemento de identidade diferente. Por exemplo, vários números de telefones estão ligados a um número de conta única.|
|Q|Inconsistências do telefone. O número de telefone do comprador é suspeito.|
|R|Ordem arriscada. A transação, o comprador e o lojista mostram informações correlacionadas de alto risco.|
|T|Cobertura de horário. O comprador está tentanto uma compra fora do horário esperado.|
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
|4863|Portador não reconhece a transação.|Master|Sim|
|4831|Valor da transação é diferente.|Master|Não|
|4854|Contestação do portador de cartão (EUA).|Master|Sim|
|4860|Crédito não processado.|Master|Não|
|4834|Erro de processamento.|Master|Não|
|4862|Transação falsificada por fraude da tarja magnética.|Master|Sim|
|4835|Cartão inválido ou vencido.|Master|Não|
|4554|Bens e serviços não recebidos.|Amex|Não|
|4515|Pagamento por outros meios.|Amex|Não|
|4527|Ausência de impressão.|Amex|Sim|
|4523|Número de conta de associado do cartão não atribuído.|Amex|Não|
|4517|Cópia atendida ilegível/incompleta.|Amex|Não|
|4752|Erro de apresentação de crédito/débito.|Amex|Não|
|4530|Discrepância de moeda.|Amex|Não|
|4516|Cópia não atendida.|Amex|Não|
|4799|Transferência de responsabilidade por fraude/perda/roubo não reconhecida.|Amex|Sim|
|4536|Apresentação tardia.|Amex|Não|
|4750|Débito de aluguel de carro não qualificado.|Amex|Não|
|4755|Sem autorização válida.|Amex|Não|
|4553|Mercadoria defeituosa ou não conforme descrita.|Amex|Não|
|4754|Contestação regulatória/legal local.|Amex|Não|
|4540|Cartão não presente.|Amex|Sim|
|4544|Cancelamento de bens/serviços recorrentes.|Amex|Não|
|4513|Crédito não processado.|Amex|Não|
|4534|ROCs múltiplos.|Amex|Não|
|4763|Direito de regresso integral por fraude.|Amex|Sim|
|4507|Valor da transação incorreto ou número de conta.|Amex|Não|
|4798|Transferência de responsabilidade por fraude.|Amex|Sim|
|4521|Autorização inválida.|Amex|Não|
|4512|Múltiplos processamentos.|Amex|Não|
|41|Transação recorrente cancelada.|Elo|Não|
|71|Autorização negada.|Elo|Não|
|74|Apresentação tardia.|Elo|Não|
|75|Portador não se lembra da transação.|Elo|Sim|
|62|Transação falsificada (transferência de responsabilidade).|Elo|Sim|
|82|Duplicidade de processamento.|Elo|Não|
|53|Mercadoria com defeito ou em desacordo.|Elo|Não|
|83|Fraude em ambiente de cartão não presente.|Elo|Sim|
|80|Valor da transação ou número de cartão incorreto.|Elo|Não|
|76|Moeda inválida.|Elo|Não|
|30|Serviço não prestado ou mercadoria não recebida.|Elo|Não|
|72|Sem autorização.|Elo|Não|
|85|Crédito não processado.|Elo|Não|
|73|Cartão vencido.|Elo|Não|
|81|Fraude em ambiente de cartão presente.|Elo|Sim|
|70|Cartão em boletim.|Elo|Não|
|86|Pagamentos por outros meios.|Elo|Não|
|4812|Número da conta não consta no arquivo (inexistente).|Diners|Não|
|4841|Transação recorrente cancelada.|Diners|Não|
|4850|Portador não reconhece.|Diners|Sim|
|4846|Código correto da moeda da transação não fornecido.|Diners|Não|
|4847|Excede o limite de piso - transação não autorizada.|Diners|Não|
|4859|Serviços não prestados.|Diners|Não|
|4831|Valor da transação é diferente.|Diners|Não|
|4849|Estabelecimento comercial de atividades suspeitas.|Diners|Sim|
|4835|Cartão inválido ou vencido.|Diners|Não|
|4842|Apresentação tardia.|Diners|Não|
|4807|Arquivo boletim de advertência.|Diners|Não|
|4871|Transferência de responsabilidade do chip/senha (Europa).|Diners|Sim|
|4855|Mercadoria não recebida.|Diners|Não|
|4808|Autorização requerida não obtida.|Diners|Não|
|4837|Sem autorização do portador do cartão.|Diners|Sim|
|4840|Processamento fraudulento da transação.|Diners|Sim|
|4853|Desacordo comercial.|Diners|Não|
|4834|Erro de processamento.|Diners|Não|
|4808|Autorização requerida não obtida.|Hipercard|Não|
|4834|Erro de processamento.|Hipercard|Não|
|4860|Crédito não processado.|Hipercard|Não|
|4857|Transação telefônica ativada por cartão.|Hipercard|Não|
|4850|Portador não reconhece.|Hipercard|Sim|
|4807|Arquivo boletim de advertência.|Hipercard|Não|
|4859|Serviços não prestados.|Hipercard|Não|
|4862|Transação falsificada por fraude da tarja magnética.|Hipercard|Sim|
|4849|Estabelecimento comercial de atividades suspeitas.|Hipercard|Sim|
|4853|Desacordo comercial.|Hipercard|Não|
|4837|Sem autorização do portador do cartão.|Hipercard|Sim|
|4847|Excede o limite de piso - transação não autorizada.|Hipercard|Não|
|4871|Transferência de responsabilidade do chip/senha (Europa).|Hipercard|Sim|
|4812|Número da conta não consta no arquivo (inexistente).|Hipercard|Não|
|4831|Valor da transação é diferente.|Hipercard|Não|
|4840|Processamento fraudulento da transação.|Hipercard|Sim|
|4841|Transação recorrente cancelada.|Hipercard|Não|
|4870|Transferência de responsabilidade do chip.|Hipercard|Sim|
|4863|Portador não reconhece a transação.|Hipercard|Sim|
|4842|Apresentação tardia.|Hipercard|Não|
|4854|Contestação do portador de cartão (EUA).|Hipercard|Sim|
|4855|Mercadoria não recebida.|Hipercard|Não|
|4835|Cartão inválido ou vencido.|Hipercard|Não|
|4846|Código correto da moeda da transação não fornecido.|Hipercard|Não|
