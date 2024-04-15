---
layout: manual
title: Manual de Integração E-commerce Cielo com Antifraude Braspag
description: Manual integração técnica de Antifraude via API
search: true
translated: true
categories: manual
sort_order: 2
tags:
  - 4. Gestão de Risco
language_tabs:
  json: JSON
  shell: cURL
  
---

# Visão geral - API E-commerce Cielo com Antifraude Braspag

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a **API E-commerce Cielo** com a funcionalidade **Antifraude Braspag**. Para que o Antifraude funcione em conjunto com a API E-Commerce, é necessária a contratação através do telefone 3003-6554 ou [Site da Braspag](https://www.braspag.com.br/contato/){:target="_blank"}.

|                 | SandBox                                             | Produção                                      |
|:----------------|:---------------------------------------------------:|:---------------------------------------------:|
| **Requisições** | https://apisandbox.cieloecommerce.cielo.com.br      | https://api.cieloecommerce.cielo.com.br/      |
| **Consultas**   | https://apiquerysandbox.cieloecommerce.cielo.com.br | https://apiquery.cieloecommerce.cielo.com.br/ |

Para executar uma operação, combine a URL base do ambiente com a URL da operação desejada e envie utilizando o verbo HTTP conforme descrito na operação.

> [Faça o download do tutorial](https://github.com/DeveloperCielo/developercielo.github.io/blob/docs/attachment/merchantid-merchantkey-cielo.pdf) para saber como gerar seu **MerchantId** e **MerchantKey** no [portal da Cielo](https://www.cielo.com.br/){:target="_blank"}.

# Análise de Fraude

A API E-commerce Cielo oferece um serviço de análise de risco de fraudes em transações online. A Cielo se integra a empresas de analise de risco, como CyberSource e ClearSale, que realizam uma validação dos dados transacionais e do histórico de compras do portador do cartão. Essa análise retorna fatores de risco e permite que a loja decida se irá prosseguir com a venda.

<aside class="warning">A análise de fraude oferecida pela Cielo avalia o risco de uma transação, mas não vincula o resultado da análise com a cobertura de chargebacks. A Cielo não realiza transações garantidas.</aside>

> A análise de fraude está disponível apenas para transações de cartão de crédito.

# Fluxos da análise de fraude

|Tipo de Integração|Descrição|Parâmetros necessários|
|-|-|-|
|Análise antes da autorização|Antes da transação ser enviada para a autorização, o Antifraude avalia se ela tem alto risco ou não. Dessa forma, evita-se o envio de transações arriscadas para autorização|`FraudAnalysis.Sequence` igual a _AnalyseFirst_|
|Análise após a autorização|Antes da transação ser enviada para o Antifraude, a mesma será enviada para a autorização|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_|
|Análise de risco somente se a transação for autorizada|O Antifraude será acionado apenas para analisar transações com o staus _autorizada_. Dessa forma evita-se o custo com análises de transações que não seriam autorizadas|`FraudAnalysis.SequenceCriteria` igual a _OnSuccess_|
|Análise de risco em qualquer hipótese|Independente do status da transação após a autorização, o AntiFraude analisará o risco|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_ e `FraudAnalysis.SequenceCriteria` como _Always_|
|Autorização em qualquer hipótese|Independente do score de fraude da transação, ela sempre será enviada para a autorização|`FraudAnalysis.Sequence` como _AnalyseFirst_ e `FraudAnalysis.SequenceCriteria` como _Always_|
|Capturar apenas se uma transação for segura|Após a análise de fraude, captura automaticamente uma transação já autorizada se definido baixo risco. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Cielo receber a notificação do novo status e for igual a aceita, a transação será capturada automaticamente|`FraudAnalysis.Sequence` igual a _AuthorizeFirst_, `FraudAnalysis.CaptureOnLowRisk` igual a _true_ e `Payment.Capture` igual a _false_|
|Cancelar uma transação comprometida|Caso a análise de fraude retorne um alto risco para uma transação já autorizada ou capturada, ela será imediamente cancelada ou estornada. Este mesmo parâmetro serve para você que irá trabalhar com revisão manual, que após a Cielo receber a notificação do novo status e for igual a rejeitada, a transação será cancelada automaticamente|`FraudAnalysis.Sequence` como _AuthorizeFirst_ , `FraudAnalysis.VoidOnHighRisk` igual a _true_ e `Payment.Capture` igual a _false_|

# Analisando uma transação na Cybersource

Para que a análise de fraude via Cybersource seja efetuada durante uma transação de cartão de crédito, é necessário complementar o contrato de autorização com os nós "FraudAnalysis", "Cart", "MerchantDefinedFields" e "Travel (somente para venda de passagens aéreas)".

## Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
{  
    "MerchantOrderId":"2017051002",
    "Customer":{  
        "Name":"Nome do Comprador",
        "Identity":"12345678910",
        "IdentityType":"CPF",
        "Email":"comprador@provedor.com.br",
        "Birthdate":"1991-01-02",
        "Phone": "5521976781114",
        "BillingAddress":{  
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
        "Type":"CreditCard",
        "Amount":10000,
        "Currency":"BRL",
        "Country":"BRA",
        "ServiceTaxAmount":0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":false,
        "Authenticate":false,
        "SoftDescriptor":"Mensagem",
        "CreditCard":{  
            "CardNumber":"4551870000000181",
            "Holder":"Nome do Portador",
            "ExpirationDate":"12/2021",
            "SecurityCode":"123",
            "Brand":"Visa",
            "SaveCard":"false"
        },
        "FraudAnalysis":{  
            "Provider":"Cybersource",
            "Sequence":"AuthorizeFirst",
            "SequenceCriteria":"OnSuccess",
            "CaptureOnLowRisk":false,
            "VoidOnHighRisk":false,
            "TotalOrderAmount":10000,
            "Browser":{  
                "BrowserFingerprint":"074c1ee676ed4998ab66491013c565e2",
                "CookiesAccepted":false,
                "Email":"comprador@test.com.br",
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

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|:-|:-|:-|:-|:-|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Cielo|
|`MerchantKey`|Texto|40|Sim|Chave pública para autenticação dupla na Cielo|
|`RequestId`|Guid|36|Não|Identificador do request definido pela loja|
|`MerchantOrderId`|Texto|50|Sim|Número do pedido da loja|
|`Customer.Name`|Texto|120|Sim|Nome completo do comprador|
|`Customer.Identity`|Texto|16|Sim|Número do documento de identificação do comprador|
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador <br/> Possíveis valores: CPF ou CNPJ|
|`Customer.Email`|Texto|100|Sim|E-mail do comprador|
|`Customer.Birthdate`|Date|10|Sim|Data de nascimento do comprador <br/> Ex.: 1991-01-10|
|`Customer.Phone`|Texto|15|Sim|Número do telefone do comprador <br/> Ex.: 5521976781114|
|`Customer.BillingAddress.Street`|Texto|54|Sim|Logradouro do endereço de cobrança|
|`Customer.BillingAddress.Number`|Texto|5|Sim|Número do endereço de cobrança|
|`Customer.BillingAddress.Complement`|Texto|14|Não|Complemento do endereço de cobrança|
|`Customer.BillingAddress.ZipCode`|Texto|9|Sim|Código postal do endereço de cobrança|
|`Customer.BillingAddress.City`|Texto|50|Sim|Cidade do endereço de cobrança|
|`Customer.BillingAddress.State`|Texto|2|Sim|Estado do endereço de cobrança|
|`Customer.BillingAddress.Country`|Texto|2|Sim|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|
|`Customer.BillingAddress.District`|Texto|45|Sim|Bairro do endereço de cobrança|
|`Customer.DeliveryAddress.Street`|Texto|54|Não|Logradouro do endereço de entrega|
|`Customer.DeliveryAddress.Number`|Texto|5|Não|Número do endereço de entrega|
|`Customer.DeliveryAddress.Complement`|Texto|14|Não|Complemento do endereço de entrega|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não|Código postal do endereço de entrega|
|`Customer.DeliveryAddress.City`|Texto|50|Não|Cidade do endereço de entrega|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega|
|`Customer.DeliveryAddress.Country`|Texto|2|Não|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|
|`Customer.DeliveryAddress.District`|Texto|45|Não|Bairro do endereço de entrega|
|`Payment.Provider`|Texto|15|Não|Define comportamento do meio de pagamento (ver Anexo) <br/> Obs.: Não obrigatório para `Payment.Type` igual a _CreditCard_|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. <br/> Obs.: Somente o tipo _CreditCard_ funciona com análise de fraude|
|`Payment.Amount`|Número|15|Sim|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|
|`Payment.Currency`|Texto|3|Não|Moeda na qual o pagamento será feito <br/> Possíveis valores: BRL / USD / MXN / COP / CLP / ARS / PEN / EUR / PYN / UYU / VEB / VEF / GBP|
|`Payment.Country`|Texto|3|Não|País na qual o pagamento será realizado|
|`Payment.ServiceTaxAmount`|Número|15|Não|Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço <br/> Obs.: Esse valor não é adicionado ao valor da autorização|
|`Payment.Installments`|Número|2|Sim|Número de parcelas|
|`Payment.Interest`|Texto|10|Não|Tipo de parcelamento <br/> Possíveis valores: ByMerchant (parcelado loja) <br/> ByIssuer (parcelado emissor)|
|`Payment.Capture`|Booleano|---|Não|Indica se a autorização deverá ser com captura automática <br/> Possíveis valores: true / false (default)|
|`Payment.Authenticate`|Booleano|---|Não|Indica se a transação deve ser autenticada junto ao emissor<br/> Possíveis valores: true / false (default)|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador <br/> Obs.: O valor deste campo tem que ser claro e fácil de identificar pelo portador o estabelecimento onde foi realizada a compra, pois é um dos principais ofensores para chargeback|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão de crédito|
|`Payment.CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão de crédito|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão de crédito|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança no verso do cartão de crédito|
|`Payment.CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão de crédito|
|`Payment.CreditCard.SaveCard`|Booleano|---|Não|Booleano que identifica se o cartão será salvo para gerar o token (CardToken) <br/> Possíveis valores: true / false (default)|
|`Payment.FraudAnalysis.Sequence`|Texto|14|Sim|Tipo de fluxo da análise de fraude <br/> Possíveis valores: AnalyseFirst / AuthorizeFirst|
|`Payment.FraudAnalysis.SequenceCriteria`|Texto|9|Sim|Critério do fluxo da análise de fraude <br/> Possíveis valores: OnSuccess / Always|
|`Payment.FraudAnalysis.Provider`|Texto|10|Sim|Provedor de AntiFraude <br/> Possíveis valores: Cybersource|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será capturada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de baixo risco (Accept) a transação anteriormente autorizada será capturada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será capturada após a Cielo receber o novo status da análise manual e este for de baixo risco (Accept) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será cancelada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de alto risco (Reject) a transação anteriormente autorizada será cancelada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será cancelada após a Cielo receber o novo status da análise manual e este for alto risco (Reject) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.TotalOrderAmount`|Número|15|Sim|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|
|`Payment.FraudAnalysis.Browser.BrowserFingerprint`|Texto|100|Sim|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script ou utilizando os SDKs (iOS ou Android) que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas|
|`Payment.FraudAnalysis.Browser.CookiesAccepted`|Booleano|---|Sim|Identifica se o browser do comprador aceita cookies <br/> Possíveis valores: true / false (default)|
|`Payment.FraudAnalysis.Browser.Email`|Texto|100|Não|E-mail registrado no browser do comprador. Pode diferenciar do e-mail de cadastro na loja(`Customer.Email`)|
|`Payment.FraudAnalysis.Browser.HostName`|Texto|60|Não|Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP|
|`Payment.FraudAnalysis.Browser.IpAddress`|Texto|45|Sim|Endereço de IP do comprador. Formato IPv4 ou IPv6|
|`Payment.FraudAnalysis.Browser.Type`|Texto|40|Não|Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP <br/> Ex.: Google Chrome, Mozilla Firefox, Safari, etc|
|`Payment.FraudAnalysis.Cart.IsGift`|Booleano|---|Não|Indica se o pedido realizado pelo comprador é para presente|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Booleano|---|Não|Indica se o pedido realizado pelo comprador pode ser devolvido a loja <br/> Possíveis valores: true / false (default)|
|`Payment.FraudAnalysis.Cart.Items.GiftCategory`|Texto|9|Não|Identifica que avaliará os endereços de cobrança e entrega para diferentes cidades, estados ou países <br/> [Tabela 1 - Payment.Fraudanalysis.Cart.Items{n}.GiftCategory]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-1-payment.fraudanalysis.cart.tems[n].giftcategory)|
|`Payment.FraudAnalysis.Cart.Items.HostHedge`|Texto|6|Não|Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude <br/> [Tabela 2 - Payment.Fraudanalysis.Cart.Items{n}.HostHedge]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-2-payment.fraudanalysis.cart.items[n].hosthedge)|
|`Payment.FraudAnalysis.Cart.Items.NonSensicalHedge`|Texto|6|Não|Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude <br/> [Tabela 3 - Cart.Items{n}.NonSensicalHedge]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-3-payment.fraudanalysis.cart.items[n].nonsensicalhedge)|
|`Payment.FraudAnalysis.Cart.Items.ObscenitiesHedge`|Texto|6|Não|Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude <br/> [Tabela 4 - Payment.Fraudanalysis.Cart.Items{n}.ObscenitiesHedge]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-4-payment.fraudanalysis.cart.items[n].obscenitieshedge)|
|`Payment.FraudAnalysis.Cart.Items.PhoneHedge`|Texto|6|Não|Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude <br/> [Tabela 5 - Payment.Fraudanalysis.Cart.Items{n}.PhoneHedge]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-5-payment.fraudanalysis.cart.items[n].phonehedge)|
|`Payment.FraudAnalysis.Cart.Items.Name`|Texto|255|Sim|Nome do Produto|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Número|15|Sim|Quantidade do produto|
|`Payment.FraudAnalysis.Cart.Items.Sku`|Texto|255|Sim|SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Número|15|Sim|Preço unitário do produto <br/> Ex: 10950 = r$ 109,50|
|`Payment.FraudAnalysis.Cart.Items.Risk`|Texto|6|Não|Nível de risco do produto associado a quantidade de chargebacks <br/> [Tabela 6 - Payment.Fraudanalysis.CartI.tems{n}.Risk]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-6-payment.fraudanalysis.cart.items[n].risk)|
|`Payment.FraudAnalysis.Cart.Items.TimeHedge`|Texto|6|Não|Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido <br/> [Tabela 7 - Payment.Fraudanalysis.Cart.Items{n}.TimeHedge]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-7-payment.fraudanalysis.cart.items[n].timehedge)|
|`Payment.FraudAnalysis.Cart.Items.Type`|Texto|19|Não|Categoria do produto <br/> [Tabela 8 - Payment.Fraudanalysis.Cart.Items{n}.Type]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-8-payment.fraudanalysis.cart.items[n].type)|
|`Payment.FraudAnalysis.Cart.Items.VelocityHedge`|Texto|6|Não|Nível de importância da frequência de compra do comprador na análise de fraude dentros dos 15 minutos anteriores <br/> [Tabela 9 - Payment.Fraudanalysis.Cart.Items{n}.VelocityHedge]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-9-payment.fraudanalysis.cart.items[n].velocityhedge)|
|`Payment.FraudAnalysis.MerchantDefinedFields.Id`|Número|2|Sim|ID das informações adicionais a serem enviadas <br/> [Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-20-payment.fraudanalysis.merchantdefinedfields)|
|`Payment.FraudAnalysis.MerchantDefinedFields.Value`|Texto|255|Sim|Valor das informações adicionais a serem enviadas <br/> [Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-20-payment.fraudanalysis.merchantdefinedfields)|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|120|Não|Nome completo do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Shipping.Method`|Texto|8|Não|Meio de entrega do pedido <br/> [Tabela 10 - Payment.Fraudanalysis.Shipping.Method]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-10-payment.fraudanalysis.shipping.method)|
|`Payment.FraudAnalysis.Shipping.Phone`|Texto|15|Não|Número do telefone do responsável a receber o produto no endereço de entrega <br/> Ex.: 552121114700|
|`Payment.FraudAnalysis.Travel.JourneyType`|Texto|32|Não|Tipo de viagem <br/> [Tabela 11 - Payment.FraudAnalysis.Travel.JourneyType]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-11-payment.fraudanalysis.travel.journeytype)|
|`Payment.FraudAnalysis.Travel.DepartureTime`|DateTime|---|Não|Data e hora de partida <br/> Ex.: 2018-03-31 19:16:38|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Texto|120|Não|Nome completo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Identity`|Texto|32|Não|Número do documento do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Status`|Texto|15|Não|Classificação da empresa aérea <br/> [Tabela 12 - Payment.FraudAnalysis.Travel.Passengers{n}.Status]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-12-payment.fraudanalysis.travel.passengers[n].status)|
|`Payment.FraudAnalysis.Travel.Passengers.Rating`|Texto|13|Não|Tipo do passageiro <br/> [Tabela 13 - Payment.FraudAnalysis.Travel.Passengers{n}.Rating]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-13-payment.fraudanalysis.travel.passengers[n].rating)|
|`Payment.FraudAnalysis.Travel.Passengers.Email`|Texto|255|Não|E-mail do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.Phone`|Texto|15|Não|Telefone do passageiro <br/> Ex.: 552121114700|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Texto|3|Não|Código do aeroporto de partida. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Texto|3|Não|Código do aeroporto de chegada. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|

## Resposta

```json
{
    "MerchantOrderId":"2017051002",
    "Customer":{  
        "Name":"Nome do Comprador",
        "Identity":"12345678910",
        "IdentityType":"CPF",
        "Email":"comprador@provedor.com.br",
        "Birthdate":"1991-01-02",
        "Phone": "5521976781114",
        "BillingAddress":{  
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
    "Payment": {
        "Type":"CreditCard",
        "Amount":10000,
        "Currency":"BRL",
        "Country":"BRA",
        "ServiceTaxAmount":0,
        "Installments":1,
        "Interest":"ByMerchant",
        "Capture":false,
        "Authenticate":false,
        "SoftDescriptor":"Mensagem",
        "CreditCard": {
            "CardNumber":"455187******0181",
            "Holder":"Nome do Portador",
            "ExpirationDate":"12/2021",
            "Brand": "Visa",
            "SaveCard": false
        },
        "FraudAnalysis": {
            "Provider":"Cybersource",
            "Sequence": "AuthorizeFirst",
            "SequenceCriteria": "OnSuccess",
            "CaptureOnLowRisk":false,
            "VoidOnHighRisk":false,
            "TotalOrderAmount":10000,
            "Browser":{  
                "BrowserFingerprint":"074c1ee676ed4998ab66491013c565e2",
                "CookiesAccepted":false,
                "Email":"comprador@test.com.br",
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
            "Id": "0e4d0a3c-e424-4fa5-a573-4eabbd44da42",
            "Status": 1,
            "ReplyData": {
                "AddressInfoCode": "COR-BA^MM-BIN",
                "FactorCode": "B^D^R^Z",
                "Score": 42,
                "BinCountry": "us",
                "CardIssuer": "FIA CARD SERVICES, N.A.",
                "CardScheme": "VisaCredit",
                "HostSeverity": 1,
                "InternetInfoCode": "FREE-EM^RISK-EM",
                "IpRoutingMethod": "Undefined",
                "ScoreModelUsed": "default_lac",
                "CasePriority": 3
            }
        },
        "ProofOfSale": "492115",
        "Tid": "12345678902606D31001",
        "AuthorizationCode": "123456",
        "PaymentId": "04096cfb-3f0a-4ece-946c-3b7dc5d38f19",
        "ExtraDataCollection": [],
        "Status": 1,
        "ReturnCode": "4",
        "ReturnMessage": "Transação autorizada",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}"
            },
            {
                "Method": "PUT",
                "Rel": "capture",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/capture"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/{PaymentId}/void"
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|Tamanho|
|:-|:-|:-|:-|
|`Payment.ProofOfSale`|Número do comprovante de venda na Cielo (NSU - Número sequencial único da transação)|Texto|6|
|`Payment.Tid`|Identificador da transação na Cielo|Texto|20|
|`Payment.AuthorizationCode`|Código de autorização na adquirente|Texto|6|
|`Payment.PaymentId`|Identificador da transação na API 3.0|Guid|36|
|`Payment.FraudAnalysis.Id`|Id da transação no AntiFraude|Guid|36|
|`Payment.FraudAnalysis.Status`|Status da transação no AntiFraude <br/> [Tabela 14 - Payment.FraudAnalysis.Status]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-14-payment.fraudanalysis.status)|Número|-|
|`Payment.FraudAnalysis.FraudAnalysisReasonCode`|Código de retorno da Cybersouce <br/> [Tabela 15 - Payment.FraudAnalysis.FraudAnalysisReasonCode]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-15-payment.fraudanalysis.fraudanalysisreasoncode)|Número|-|
|`Payment.FraudAnalysis.ReplyData.AddressInfoCode`|Códigos indicam incompatibilidades entre os endereços de cobrança e entrega do comprador <br/> Os códigos são concatenados usando o caracter ^ Ex.: COR-BA^MM-BIN <br/> [Tabela 16 - Payment.FraudAnalysis.ReplyData.AddressInfoCode]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-16-payment.fraudanalysis.replydata.addressinfocode)|Texto|512|
|`Payment.FraudAnalysis.ReplyData.FactorCode`|Códigos que afetaram a pontuação da análise <br/> Os códigos são concatenados usando o caracter ^. Ex.: B^D^R^Z <br/>[Tabela 17 - ProviderAnalysisResult.AfsReply.FactorCode]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-17-payment.fraudanalysis.replydata.factorcode)|Texto|512|
|`Payment.FraudAnalysis.ReplyData.Score`|Score da análise de fraude. Valor entre 0 e 100|Número|-|
|`Payment.FraudAnalysis.ReplyData.BinCountry`|Código do país do BIN do cartão usado na análise. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|Texto|2|
|`Payment.FraudAnalysis.ReplyData.CardIssuer`|Nome do banco ou entidade emissora do cartão de crédito|Texto|256|
|`Payment.FraudAnalysis.ReplyData.CardScheme`|Bandeira do cartão|Texto|128|
|`Payment.FraudAnalysis.ReplyData.HostSeverity`|Nível de risco do domínio de e-mail do comprador, de 0 a 5, onde 0 é risco indeterminado e 5 representa o risco mais alto|Número|-|
|`Payment.FraudAnalysis.ReplyData.InternetInfoCode`|Códigos que indicam problemas com o endereço de e-mail, o endereço IP ou o endereço de cobrança <br/> Os códigos são concatenados usando o caracter ^. Ex.: FREE-EM^RISK-EM <br/> [Tabela 18 - Payment.FraudAnalysis.ReplyData.InternetInfoCode]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-18-payment.fraudanalysis.replydata.internetinfocode)|Texto|512|
|`Payment.FraudAnalysis.ReplyData.IpRoutingMethod`|Método de roteamento do comprador obtido a partir do endereço de IP <br/> [Tabela 19 - Payment.FraudAnalysis.ReplyData.IpRoutingMethod]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-19-payment.fraudanalysis.replydata.iproutingmethod)|Texto|512|
|`Payment.FraudAnalysis.ReplyData.ScoreModelUsed`|Nome do modelo de score utilizado na análise. Caso não tenha nenhum modelo definido, o modelo padrão da Cybersource foi o utilizado|Texto|256|
|`Payment.FraudAnalysis.ReplyData.CasePriority`|Define o nível de prioridade das regras ou perfis do lojista. O nível de prioridade varia de 1 (maior) a 5 (menor) e o valor padrão é 3, e este será atribuído caso não tenha definido a prioridade das regras ou perfis. Este campo somente será retornado se a loja for assinante do Enhanced Case Management|Número|-|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`|Id da transação na Cybersource|Texto|64|

## Configurando o Fingerprint

O Fingerprint é a identificação digital do dispositivo do comprador. Essa identificação é composta por uma série de dados coletados na página de checkout do site ou aplicativo. Para configurar o Fingerprint com a Cybersource, consulte o manual do [Antifraude Gateway](https://braspag.github.io//manual/antifraude#fingerprint-com-a-cybersource){:target="_blank"}.

# Analisando uma transação na ClearSale

Na requisição de análise de fraude com a ClearSale, envie o campo `Payment.FraudAnalysis.Provider` como "ClearSale".

## Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/1/sales/</span></aside>

```json
{
    "MerchantOrderId": 9094008,
    "Customer": {
        "Name": "Bruno Silva",
        "Identity": "11111111111",
        "IdentityType": "CPF",
        "Email": "nome@email.com.br",
        "Birthdate": "1996-11-14",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "21 andar",
            "ZipCode": "06455030",
            "City": "Barueri",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        },
        "DeliveryAddress": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "06455030",
            "City": "Barueri",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville"
        }
    },
    "Payment": {
        "Type": "CreditCard",
        "Provider": "Simulado",
        "Amount": 45500,
        "Installments": 1,
        "Capture": false,
        "Recurrent": false,
        "SoftDescriptor": "Nome fantasia da loja",
        "CreditCard": {
            "CardNumber": "4000021231111111",
            "Holder": "Guilherme Silva",
            "ExpirationDate": "08/2033",
            "SaveCard": false,
            "Brand": "Visa"
        },
        "FraudAnalysis": {
            "Provider": "ClearSale",            
            "Sequence": "AuthorizeFirst",
            "SequenceCriteria": "OnSuccess",
            "CaptureOnLowRisk": false,
            "VoidOnHighRisk": false,
            "TotalOrderAmount": 46000
            },
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Name": "Mouse",
                        "Quantity": 1,
                        "Sku": "100010",
                        "UnitPrice": 532400,
                        "Type": "EletronicGood"
                    },
                    {
                        "Name": "Windows 11 Professional",
                        "Quantity": 2,
                        "Sku": "100011",
                        "UnitPrice": 85515,
                        "Type": "EletronicSoftware"
                    }
                ]
            },
            "Travel": {
                "Passengers": [
                    {
                        "Name": "Bruno Silva",
                        "TravelLegs": [
                            {
                                "Origin": "SDU",
                                "Destination": "CGH",
                                "DepartureDate": "2023-10-09T18:30:00",
                                "Boarding": "2023-10-09T18:45:00",
                                "Arriving": "2023-10-09T20:00:00"
                            }
                        ]
                    },
                    {
                        "Name": "Guilherme Silva",
                        "TravelLegs": [
                            {
                                "Origin": "SDU",
                                "Destination": "CGH",
                                "DepartureDate": "2023-10-09T18:30:00",
                                "Boarding": "2023-10-09T18:45:00",
                                "Arriving": "2023-10-09T20:00:00"
                            }
                        ]
                    }
                ]
            }
        }
    }
}
```

**Parâmetros no cabeçalho (header)**

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|:-|:-|:-|:-|:-|
|`MerchantId`|Guid|36|Sim|Identificador da loja na Cielo|
|`MerchantKey`|Texto|40|Sim|Chave pública para autenticação dupla na Cielo|
|`RequestId`|Guid|36|Não|Identificador do request definido pela loja|

**Parâmetros no corpo (body)**

|Propriedade|Tipo|Tamanho|Obrigatório|Descrição|
|:-|:-|:-|:-|:-|
|`MerchantOrderId`|Texto|50|Sim|Número do pedido da loja|
|`Customer.Name`|Texto|120|Sim|Nome completo do comprador|
|`Customer.Identity`|Texto|16|Sim|Número do documento de identificação do comprador|
|`Customer.IdentityType`|Texto|255|Não|Tipo de documento de identificação do comprador <br/> Possíveis valores: CPF ou CNPJ|
|`Customer.Email`|Texto|100|Sim|E-mail do comprador|
|`Customer.Birthdate`|Date|10|Sim|Data de nascimento do comprador <br/> Ex.: 1991-01-10|
|`Customer.Address.Street`|Texto|54|Sim|Logradouro do endereço de cobrança|
|`Customer.Address.Number`|Texto|5|Sim|Número do endereço de cobrança|
|`Customer.Address.Complement`|Texto|14|Não|Complemento do endereço de cobrança|
|`Customer.Address.ZipCode`|Texto|9|Sim|Código postal do endereço de cobrança|
|`Customer.Address.City`|Texto|50|Sim|Cidade do endereço de cobrança|
|`Customer.Address.State`|Texto|2|Sim|Estado do endereço de cobrança|
|`Customer.Address.Country`|Texto|2|Sim|País do endereço de cobrança. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|
|`Customer.Address.District`|Texto|45|Sim|Bairro do endereço de cobrança|
|`Customer.DeliveryAddress.Street`|Texto|54|Não|Logradouro do endereço de entrega|
|`Customer.DeliveryAddress.Number`|Texto|5|Não|Número do endereço de entrega|
|`Customer.DeliveryAddress.Complement`|Texto|14|Não|Complemento do endereço de entrega|
|`Customer.DeliveryAddress.ZipCode`|Texto|9|Não|Código postal do endereço de entrega|
|`Customer.DeliveryAddress.City`|Texto|50|Não|Cidade do endereço de entrega|
|`Customer.DeliveryAddress.State`|Texto|2|Não|Estado do endereço de entrega|
|`Customer.DeliveryAddress.Country`|Texto|2|Não|País do endereço de entrega. Mais informações em [ISO 2-Digit Alpha Country Code](https://www.iso.org/obp/ui){:target="_blank"}|
|`Customer.DeliveryAddress.District`|Texto|45|Não|Bairro do endereço de entrega|
|`Payment.Type`|Texto|100|Sim|Tipo do meio de pagamento. <br/> Obs.: Somente o tipo _CreditCard_ funciona com análise de fraude|
|`Payment.Provider`|Texto|15|Não|Define comportamento do meio de pagamento (ver Anexo) <br/> Obs.: Não obrigatório para `Payment.Type` igual a _CreditCard_|
|`Payment.Amount`|Número|15|Sim|Valor da transação financeira em centavos <br/> Ex: 150000 = r$ 1.500,00|
|`Payment.Installments`|Número|2|Sim|Número de parcelas|
|`Payment.Capture`|Booleano|---|Não|Indica se a autorização deverá ser com captura automática.<br>Possíveis valores: “true” / “false” (default).<br>**Obs. 1**: Verifique junto à adquirente a disponibilidade desta funcionalidade.<br>**Obs. 2**: Este campo deverá ser preenchido de acordo com o fluxo da análise de fraude.|
|`Payment.Recurrent`|Booleano|---|Não|Indica se a transação é do tipo recorrente.<br>Possíveis valores: “true” / “false” (default).<br>**Obs. 1**: Este campo igual a “true” não irá criar uma recorrência; apenas permitirá a realização de uma transação sem a necessidade de envio do CVV, indicando para a adquirente que é a cobrança de uma transação de uma recorrência.<br>**Obs. 2**: Somente para transações Cielo.<br>**Obs. 3**: O campo `Payment.Authenticate` deve ser igual a “false” quando  `Payment.Recurrent`  for igual a “true”.|
|`Payment.SoftDescriptor`|Texto|13|Não|Texto que será impresso na fatura do portador <br/> Obs.: O valor deste campo tem que ser claro e fácil de identificar pelo portador o estabelecimento onde foi realizada a compra, pois é um dos principais ofensores para chargeback|
|`Payment.CreditCard.CardNumber`|Texto|16|Sim|Número do cartão de crédito|
|`Payment.CreditCard.Holder`|Texto|25|Sim|Nome do portador impresso no cartão de crédito|
|`Payment.CreditCard.ExpirationDate`|Texto|7|Sim|Data de validade do cartão de crédito|
|`Payment.CreditCard.SecurityCode`|Texto|4|Sim|Código de segurança no verso do cartão de crédito|
|`Payment.CreditCard.SaveCard`|Booleano|---|Não|Booleano que identifica se o cartão será salvo para gerar o token (CardToken) <br/> Possíveis valores: true / false (default)|
|`Payment.CreditCard.Brand`|Texto|10|Sim |Bandeira do cartão de crédito|
|`Payment.FraudAnalysis.Provider`|Texto|10|Sim|Provedor de AntiFraude <br/> Neste caso, use "ClearSale"|
|`Payment.FraudAnalysis.Sequence`|Texto|14|Sim|Tipo de fluxo da análise de fraude. Possíveis valores: AnalyseFirst / AuthorizeFirst. <br> Saiba mais em [Fluxos da análise de fraude](https://braspag.github.io//manual/api-ecommerce-cielo-af#fluxos-da-an%C3%A1lise-de-fraude)|
|`Payment.FraudAnalysis.SequenceCriteria`|Texto|9|Sim|Critério do fluxo da análise de fraude <br/> Possíveis valores: OnSuccess / Always. <br> Saiba mais em [Fluxos da análise de fraude](https://braspag.github.io//manual/api-ecommerce-cielo-af#fluxos-da-an%C3%A1lise-de-fraude)|
|`Payment.FraudAnalysis.CaptureOnLowRisk`|Booleano|---|Não|Indica se a transação após a análise de fraude será capturada <br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a _true_ e o retorno da análise de fraude for de baixo risco (Accept) a transação anteriormente autorizada será capturada <br/> Obs2.: Quando enviado igual a _true_ e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A mesma será capturada após a Cielo receber o novo status da análise manual e este for de baixo risco (Accept) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente _AuthorizeFirst_|
|`Payment.FraudAnalysis.VoidOnHighRisk`|Booleano|---|Não|Indica se a transação será cancelada após a análise de fraude se o retorno for alto risco.<br/> Possíveis valores: true / false (default) <br/> Obs.: Quando enviado igual a *true* e o retorno da análise de fraude for de alto risco (Reject) a transação anteriormente autorizada será cancelada <br/> Obs2.: Quando enviado igual a *true* e o retorno da análise de fraude for revisão (Review) a transação ficará autorizada. A transação será cancelada após a Cielo receber o novo status da análise manual e este for alto risco (Reject) <br/> Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de risco deve ser obrigatoriamente *AuthorizeFirst*|
|`Payment.FraudAnalysis.TotalOrderAmount`|Número|15|Sim|Valor total do pedido em centavos <br/> Ex: 123456 = r$ 1.234,56|
|`Payment.FraudAnalysis.Browser.BrowserFingerprint`|Texto|100|Sim|Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído ao campo `session_id` do script ou utilizando os SDKs (iOS ou Android) que será incluído na página de checkout. <br/> Obs.: Este identificador poderá ser qualquer valor ou o número do pedido, mas deverá ser único durante 48 horas|
|`Payment.FraudAnalysis.Shipping.Addressee`|Texto|120|Não|Nome completo do responsável a receber o produto no endereço de entrega|
|`Payment.FraudAnalysis.Shipping.Method`|Texto|8|Não|Meio de entrega do pedido <br/> [Tabela 10 - Payment.Fraudanalysis.Shipping.Method]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-10-payment.fraudanalysis.shipping.method)|
|`Payment.FraudAnalysis.Cart.IsGift`|Booleano|---|Não|Indica se o pedido realizado pelo comprador é para presente.|
|`Payment.FraudAnalysis.Cart.ReturnsAccepted`|Booleano|---|Não|Indica se o pedido realizado pelo comprador pode ser devolvido a loja <br/> Possíveis valores: true / false (default).|
|`Payment.FraudAnalysis.Cart.Items.Name`|Texto|255|Sim|Nome do Produto.|
|`Payment.FraudAnalysis.Cart.Items.Quantity`|Número|15|Sim|Quantidade do produto.|
|`Payment.FraudAnalysis.Cart.Items.Sku`|Texto|255|Sim|SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto.|
|`Payment.FraudAnalysis.Cart.Items.UnitPrice`|Número|15|Sim|Preço unitário do produto <br/> Ex: 10950 = R$109,50|
|`Payment.FraudAnalysis.Cart.Items.Type`|Texto|19|Não|Categoria do produto <br/> [Tabela 8 - Payment.Fraudanalysis.Cart.Items{n}.Type]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-8-payment.fraudanalysis.cart.items[n].type)|
|`Payment.FraudAnalysis.Travel.Passengers.Name`|Texto|120|Não|Nome completo do passageiro|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Origin`|Texto|3|Não|Código do aeroporto de partida. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Destination`|Texto|3|Não|Código do aeroporto de chegada. Mais informações em [IATA 3-Letter Codes](http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm){:target="_blank"}|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.DepartureDate`|datetime|---|Não|Data e hora de partida. <br/> Formato: "2023-10-09T18:30:00".|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Boarding`|datetime|---|Não|Data e hora de embarque. Formato: "2023-10-09T18:30:00".|
|`Payment.FraudAnalysis.Travel.Passengers.TravelLegs.Arriving`|datetime|---|Não|Data e hora de chegada. Formato: "2023-10-09T18:30:00".|

## Resposta

```json
{
    "MerchantOrderId": "9094008",
    "Customer": {
        "Name": "Bruno Silva",
        "Identity": "11111111111",
        "IdentityType": "CPF",
        "Email": "homolog@cielo.com.br",
        "Birthdate": "1996-11-14",
        "Address": {
            "Street": "Alameda Xingu",
            "Number": "512",
            "Complement": "21 andar",
            "ZipCode": "06455030",
            "City": "Barueri",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": 0
        },
        "DeliveryAddress": {
            "Street": "Alameda Blablacar",
            "Number": "512",
            "Complement": "27 andar",
            "ZipCode": "12345987",
            "City": "São Paulo",
            "State": "SP",
            "Country": "BR",
            "District": "Alphaville",
            "AddressType": 0
        }
    },
    "Payment": {
        "ServiceTaxAmount": 0,
        "Installments": 1,
        "Interest": 0,
        "Capture": false,
        "Authenticate": false,
        "Recurrent": false,
        "CreditCard": {
            "CardNumber": "400002******1111",
            "Holder": "Guilherme Silva",
            "ExpirationDate": "08/2033",
            "SaveCard": false,
            "Brand": "Visa",
            "PaymentAccountReference": "2UKZQRDOXLRMGW3B41E8IB5KZOH8V"
        },
        "Tid": "1020115320892",
        "ProofOfSale": "039771",
        "AuthorizationCode": "616672",
        "SoftDescriptor": "Nome fantasia da loja",
        "Provider": "Simulado",
        "FraudAnalysis": {
            "Id": "7bc9a7ea-25a9-483c-1f61-08dbbaaa0d60",
            "Status": 1,
            "StatusDescription": "Accept",
            "ReplyData": {
                "ProviderTransactionId": "7BC9A7EA-25A9-483C-1F61-08DBBAAA0D60"
            },            
            "Sequence": "AuthorizeFirst",
            "SequenceCriteria": "OnSuccess",
            "TotalOrderAmount": 46000,
            "TransactionAmount": 0,
            "Cart": {
                "IsGift": false,
                "ReturnsAccepted": true,
                "Items": [
                    {
                        "Type": 4,
                        "Name": "Notebook Dell Inspiron",
                        "Risk": 0,
                        "Sku": "100010",
                        "OriginalPrice": 0,
                        "UnitPrice": 532400,
                        "Quantity": 1,
                        "GiftCategory": 0,
                        "Weight": 0,
                        "CartType": 0
                    },
                    {
                        "Type": 5,
                        "Name": "Windows 11 Professional",
                        "Risk": 0,
                        "Sku": "100011",
                        "OriginalPrice": 0,
                        "UnitPrice": 85515,
                        "Quantity": 2,
                        "GiftCategory": 0,
                        "Weight": 0,
                        "CartType": 0
                    }
                ]
            },
            "Travel": {
                "Passengers": [
                    {
                        "Name": "Bruno Silva",
                        "Rating": 0,
                        "PassengerType": "Undefined",
                        "TravelLegs": [
                            {
                                "Destination": "CGH",
                                "Origin": "SDU",
                                "DepartureDate": "2023-10-09T18:30:00",
                                "Boarding": "2023-10-09T18:45:00",
                                "Arriving": "2023-10-09T20:00:00"
                            }
                        ]
                    },
                    {
                        "Name": "Guilherme Silva",
                        "Rating": 0,
                        "PassengerType": "Undefined",
                        "TravelLegs": [
                            {
                                "Destination": "CGH",
                                "Origin": "SDU",
                                "DepartureDate": "2023-10-09T18:30:00",
                                "Boarding": "2023-10-09T18:45:00",
                                "Arriving": "2023-10-09T20:00:00"
                            }
                        ]
                    }
                ]
            },
            "Shipping": {
                "Addressee": "Nome Comprador",
                "Phone": "+55 11 5555-1001",
                "Method": 5,
                "Email": "nome@email.com.br",
                "WorkPhone": "+55 11 5555-1002",
                "Mobile": "+55 11 5555-1003",
                "Identity": "99988877711",
                "IdentityType": "CPF"
            },
            "CaptureOnLowRisk": false,
            "VoidOnHighRisk": false,
            "FraudAnalysisReasonCode": 1,
            "Provider": "ClearSale",
            "IsRetryTransaction": false
        },
        "IsQrCode": false,
        "Amount": 45500,
        "ReceivedDate": "2023-10-20 11:53:18",
        "Status": 1,
        "IsSplitted": false,
        "ReturnMessage": "Operation Successful",
        "ReturnCode": "4",
        "PaymentId": "d0109922-2cd3-4a3f-89fc-4c69230d3438",
        "Type": "CreditCard",
        "Currency": "BRL",
        "Country": "BRA",
        "Links": [
            {
                "Method": "GET",
                "Rel": "self",
                "Href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/d0109922-2cd3-4a3f-89fc-4c69230d3438"
            },
            {
                "Method": "PUT",
                "Rel": "capture",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/d0109922-2cd3-4a3f-89fc-4c69230d3438/capture"
            },
            {
                "Method": "PUT",
                "Rel": "void",
                "Href": "https://apisandbox.cieloecommerce.cielo.com.br/1/sales/d0109922-2cd3-4a3f-89fc-4c69230d3438/void"
            }
        ]
    }
}
```

|Propriedade|Descrição|Tipo|
|---|---|---
|`Payment.FraudAnalysis.IsRetryTransaction`|  Retentativa de uma análise, e deverá ser enviado com valor igual a "true" quando o código de retorno na primeira tentativa for igual a BP900 | booleano  |
|`Payment.FraudAnalysis.Id`| Identificação transação no Antifraude|GUID|
|`Payment.FraudAnalysis.Status`|Status da transação no AntiFraude.<br/>[Tabela 14 - Payment.FraudAnalysis.Status]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-14-payment.fraudanalysis.status)|número|
|`Payment.FraudAnalysis.StatusDescription`|Descrição do status do Antifraude.<br/>[Tabela 14 - Payment.FraudAnalysis.Status]({{ site.baseurl_root }}/manual/cielo-ecommerce#tabela-14-payment.fraudanalysis.status)|texto|
|`Payment.FraudAnalysis.ReplyData.ProviderTransactionId`| Id da transação na ClearSale|string |

## Fingerprint com a ClearSale

O Fingerprint é a identificação digital do dispositivo do comprador. Essa identificação é composta por uma série de dados coletados na página de checkout do site ou aplicativo.

Na integração da API do Pagador com análise de fraude ClearSale, o valor do `session_id` deve ser enviado no parâmetro `Payment.FraudAnalisys.FingerPrintId`.

Para configurar o Fingerprint com a ClearSale, consulte o manual do [Antifraude Gateway](https://braspag.github.io/manual/antifraude#integra%C3%A7%C3%A3o-com-a-clearsale){:target="_blank"}.

# Tabelas

## Tabela 1 - Payment.FraudAnalysis.Cart.Items[n].GiftCategory

|Valor|Descrição|
|:-|:-|
|Yes|Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido|
|No|Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)|
|Off|Diferenças entre os endereços de cobrança e entrega não afetam a pontuação|

## Tabela 2 - Payment.FraudAnalysis.Cart.Items[n].HostHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Tabela 3 - Payment.FraudAnalysis.Cart.Items[n].NonSensicalHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Tabela 4 - Payment.FraudAnalysis.Cart.Items[n].ObscenitiesHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Tabela 5 - Payment.FraudAnalysis.Cart.Items[n].PhoneHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Tabela 7 - Payment.FraudAnalysis.Cart.Items[n].TimeHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Tabela 8 - Payment.FraudAnalysis.Cart.Items[n].Type

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

## Tabela 9 - Payment.FraudAnalysis.Cart.Items[n].VelocityHedge

|Valor|Descrição|
|:-|:-|
|Low|Baixa|
|Normal|Normal (default)|
|High|Alta|
|Off|Não irá afetar o score da análise de fraude|

## Tabela 10 - Payment.FraudAnalysis.Shipping.Method

|Valor|Descrição|
|:-|:-|
|SameDay|Meio de entrega no mesmo dia|
|OneDay|Meio de entrega no próximo dia|
|TwoDay|Meio de entrega em dois dias|
|ThreeDay|Meio de entrega em três dias|
|LowCost|Meio de entrega de baixo custo|
|Pickup|Retirada na loja|
|Other|Outro meio de entrega|
|None|Sem meio de entrega, pois é um serviço ou assinatura|

## Tabela 11 - Payment.FraudAnalysis.Travel.JourneyType

|Valor|Descrição|
|:-|:-|
|OneWayTrip|Viagem somente de ida|
|RoundTrip|Viagem de ida e volta|

## Tabela 12 - Payment.FraudAnalysis.Travel.Passengers[n].Status

|Valor|
|:-|
|Standard|
|Gold|
|Platinum|

## Tabela 13 - Payment.FraudAnalysis.Travel.Passengers[n].Rating

|Valor|Descrição|
|:-|:-|
|Adult|Adulto|
|Child|Criança|
|Infant|Infantil|

## Tabela 14 - Payment.FraudAnalysis.Status

|Código|Descrição|
|:-|:-|
|0|Unknown|
|1|Accept|
|2|Reject|
|3|Review|
|4|Aborted|
|5|Unfinished|

## Tabela 15 - Payment.FraudAnalysis.FraudAnalysisReasonCode

|Valor|Descrição|
|:-|:-|
|100|Operação realizada com sucesso|
|101|A transação enviada para análise de fraude está faltando um ou mais campos necessários <br/> Verificar no response o campo `ProviderAnalysisResult.Missing` <br/> Possível ação: Reenviar a transação com a informação completa|
|102|A transação enviada para análise de fraude possui um ou mais campos com valores inválidos <br/> Verificar no response o campo `ProviderAnalysisResult.Invalid` <br/> Possível ação: Reenviar a transação com a informação correta|
|150|Erro interno <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|151|A transação foi recebida, mas ocorreu time-out no servidor. Este erro não inclui time-out entre o cliente e o servidor <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|152|O pedido foi recebido, mas ocorreu time-out <br/> Possível ação: Aguarde alguns minutos e tente reenviar a transação|
|202|Transação recusada pois o cartão expirou ou a data de validade não coincide com a correta <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|
|231|Transação recusada pois o cartão é inválido <br/> Possível ação: Solicite outro cartão ou outra forma de pagamento|
|234|Problema com a configuração da loja na Cybersource <br/> Possível ação: Entre em contato com o suporte para corrigir o problema de configuração|
|400|A pontuação de fraude ultrapassa o seu limite <br/> Possível ação: Reveja a transação do comprador|
|480|A transação foi marcada como revisão pelo DM (Decision Manager)|
|481|A transação foi rejeitada pelo DM (Decision Manager)|

## Tabela 16 - Payment.FraudAnalysis.ReplyData.AddressInfoCode

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

## Tabela 17 - Payment.FraudAnalysis.ReplyData.FactorCode

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

## Tabela 18 - Payment.FraudAnalysis.ReplyData.InternetInfoCode

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

## Tabela 19 - Payment.FraudAnalysis.ReplyData.IpRoutingMethod

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

## Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields (Cybersource)

> Nível de Relevância <br/> 1 - Relevante <br/> 2 - Muito Relevante <br/> 3 - Extremamente Relevante <br/><br/>
> Conforme nível de relevância dos campos e possibilidade de desenho da estratégia de risco de acordo com a necessidade do seu negócio, na validação das transações de testes os mesmos serão cobrados caso não sejam enviaos. Com isso, solicitamos uma análise prévia da documentação e sinalização dos campos que não serão possíveis de serem enviados.<br/><br/>
> No caso de não possuir o dado para enviar, pedimos a gentileza de não enviar o campo correspondente como vazio, ou seja, apenas não enviar.

|ID|Valor|Tipo|Nível de Relevância|Segmento|
|--|-----|----|-------------------|--------|
|1|Cliente efetuou Login <br/> Se o cliente final logou no site para comprar, enviar: o login dele <br/> Se fez compra como visitante, enviar: Guest <br/> Se a venda foi feita direto por um terceiro, um agente por exemplo, não enviar o campo|Texto|2|Todos|
|2|Quantidade em dias que o cliente é seu cliente <br/> Ex.: 314|int|3|Todos|
|3|Quantidade de parcelas do pedido|int|3|Todos|
|4|Canal de Venda <br/> Possíveis valores: <br/> Call Center -> compra pelo telefone <br/> Web -> compra pela web <br/> Portal -> um agente fazendo a compra para o cliente <br/> Quiosque -> compras em quiosques <br/> Movel -> compras feitas em celulares ou tablets|string|3|Todos|
|5|Enviar o código do cupom/desconto caso o cliente utilize na compra|Texto|1|Todos|
|6|Quantidade em dias desde a última compra realizada pelo cliente <br/> Ex.: 55|int|3|Todos|
|7|Código ou nome do seller (vendedor)|Texto|1|Todos|
|8|Tentativas realizadas pelo cliente de efetuar o pagamento do mesmo pedido, podendo ser com diferentes cartões de créditos e/ou através de outros meios de pagamentos|int|2|Todos|
|9|Identifica se cliente irá retirar o produto na loja <br/> Possíveis valores: SIM ou NAO|Texto|3|Varejo ou Cosméticos|
|10|Identifica se o pagamento será realizado por outra pessoa que não esteja presente na viagem ou pacote <br/> Possíveis valores: SIM ou NAO|Texto|3|Aéreo ou Turismo|
|11|Categoria do hotel (quantas estrelas) <br/> Possíveis valores: <br/> 1 -> Simples <br/> 2 -> Econômico <br> 3 -> Turismo <br/> 4 -> Superior <br/> 5 -> Luxo|int|3|Turismo|
|12|Quantidade em dias desde a data da compra até a data do checkin no hotel <br/> Ex.: 123|int|3|Turismo|
|13|Quantidade de diárias no hotel <br/> Ex.: 5|int|3|Turismo|
|14|Categoria da viagem ou pacote <br> Possíveis valores: Nacional ou Internacional ou Nacional/Internacional|Texto|3|Aéreo ou Turismo|
|15|Nome da companhia áerea / locadora de carro / hotel <br/> Enviar o nome de cada uma das empresas, separado por /|Texto|2|Aéreo ou Turismo|
|16|Código PNR da reserva <br/> Quando houver uma alteração da reserva para este PNR, com antecipação da data de voo, é importante fazer uma nova análise de fraude enviando este PNR novamente|Texto|3|Aérea|
|17|Identifica se houve antecipação de reserva <br/> Possíveis valores: SIM ou NAO <br/> Se sim, fundamental o envio também do campo 16 - Código PNR da reserva|Texto|3|Aéreo|
|18|Categoria do veículo alugado <br/> Possíveis valores: <br/> 1 - Básico <br/> 2 - Esportivo <br/> 3 - Prime <br/> 4 - Utilitário <br/> 5 - Blindado|Texto|3|Turismo|
|19|Identifica se o pacote refere-se a cruzeiro <br/> Possíveis valores: SIM ou NAO|Texto|2|Turismo|
|20|Decisão da análise de fraude referente a última compra <br/> Possíveis valores: ACEITA ou REJEITADA|Texto|3|Todos|
|21|Valor do frete <br/> Ex.: 10599 = r$ 105,99|long|1|Varejo ou Cosméticos|
|22|Código da loja onde o produto será retirado <br/> Este campo deverá ser enviado quando o campo 9 for enviado igual a SIM|Texto|3|Varejo ou Cosméticos|
|23|Sufixo (4 últimos dígitos) do cartão de crédito|int|1|Todos|
|24|Quantidade de dias desde a primeira compra realizada pelo cliente <br/> Ex.: 150|int|3|Todos|
|25|Sexo do cliente <br/> Possíveis valores: <br/> F -> Feminino <br/> M -> Masculino|Texto|2|Todos|
|26|Bin (6 primeiros dígitos) do cartão de crédito|int|1|Todos|
|27|Tipo do logradouro do endereço de entrega <br/> Possíveis valores: <br/> R -> Residencial <br/> C -> Comercial|Texto|2|Todos|
|28|Tempo médio em minutos que o cliente levou para realizar a compra|int|2|Todos|
|29|Quantidade de tentativas que o cliente realizou para efetuar login|int|2|Todos|
|30|Quantidade de páginas web que o cliente visitou anteriormente a compra referente a 30 minutos passados|int|2|Todos|
|31|Quantidade de trocas de números de cartão de crédito que o cliente efetuou para realizar o pagamento do pedido|int|2|Todos|
|32|Identifica se o e-mail foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|Texto|3|Todos|
|33|Identifica se o número do cartão de crédito foi colado ou digitado <br/> Possíveis valores: Digitado ou Colado|Texto|3|Todos|
|34|Identifica se o e-mail foi confirmado para ativação de conta <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|35|Identifica o tipo de cliente <br/> Possíveis valores: Local ou Turista|Texto|2|Turismo|
|36|Identifica se foi utilizado cartão presente (GiftCard) na compra como forma de pagamento <br/> Possíveis valores: SIM ou NAO|Texto|1|Todos|
|37|Meio de envio do pedido <br/> Possíveis valores: Sedex <br/> Sedex 10 <br/> 1 Dia <br/> 2 Dias <br/> Motoboy <br/> Mesmo Dia <br/>|Texto|3|Varejo ou Cosméticos|
|38|Número do telefone do cliente identificado através da bina quando venda realizada através do canal de venda igual a Call Center <br/> Formato: DDIDDDNúmero - Ex.: 552121114720|Texto|3|Todos|
|39|Nome de usuário do Call Center <br/> Este campo deverá ser enviado quando campo 4 for enviado igual a Call Center|Texto|1|Todos|
|40|Comentários inseridos quando pedido for presente|Texto|1|Todos|
|41|Tipo do documento <br/> Possíveis valores: CPF ou CNPJ ou Passaporte|Texto|2|Todos|
|42|Idade do cliente|int|2|Todos|
|43|Faixa de rendimento do cliente <br/> Ex.: 100000 = r$ 1.000,00|long|2|Todos|
|44|Quantidade histórica de compras realizadas pelo cliente|int|3|Todos|
|45|Identifica se é uma compra realizada por funcionário <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|46|Nome impresso (portador) no cartão de crédito|Texto|3|Todos|
|47|Identifica se o cartão é private label <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|48|Quantidade de meios de pagamentos utilizados para efetuar a compra|int|2|Todos|
|49|Média das compras realizadas nos últimos 6 meses <br/> Ex.: 159050 = r$ 1.590,99|long|3|Todos|
|50|Fator de desvio de valor da compra atual sobre a média dos últimos 6 meses|3|Todos|
|51|Identifica se é um cliente VIP com tratamento de risco diferenciado ou lista positiva <br/> Possíveis valores: SIM ou NAO|Texto|3|Todos|
|52|Categoria do produto <br/> Possíveis valores: <br/> Animais e Bichos de Estimação <br/> Roupas e Acessórios <br/> Negócios e Indústria <br/> Câmeras e Óticas <br/> Eletrônicos <br/> Comidas, Bebidas e Cigarro <br/> Móveis <br/> Ferramentas <br/> Saúde e Beleza <br/> Casa e Jardim <br/> Malas e Bagagens <br/> Adulto <br/> Armas e Munição <br/> Materiais de Escritório <br/> Religião e Cerimoniais <br/> Software <br/> Equipamentos de Esporte <br/> Brinquedos e Jogos <br/> Veículos e Peças <br/> Livros <br/> DVDs e Vídeos <br/> Revistas e Jornais <br/> Música <br/> Outras Categorias Não Especificadas|Texto|2|Todos|
|53|Identifica se existe rotina de confirmação de celular por SMS <br/> Possíveis valores: SIM ou NAO|Texto|2|Todos|
|54|Qual a 2ª forma de pagamento|Texto|2|Todos|
|55|Qual a 3ª forma de pagamento|Texto|2|Todos|
|56|Se 2ª forma de pagamento for cartão de crédito, enviar a bandeira|Texto|1|Todos|
|57|Se 3ª forma de pagamento for cartão de crédito, enviar a bandeira|Texto|1|Todos|
|58|Se 2ª forma de pagamento, informar o valor pago <br/> Ex.: 128599 = r$ 1.285,99|long|2|Todos|
|59|Se 3ª forma de pagamento, informar o valor pago <br/> Ex.: 59089 = r$ 590,89|long|2|Todos|
|60|Quantidade em dias desde a data da última alteração <br/> Ex.: 57|int|3|Todos|
|61|Identifica se houve alteração cadastral|Texto|1|Todos|
|62|Quantidade de pontos trocados na última compra|long|3|Fidelidade|
|63|Quantidade de pontos restantes no saldo|long|2|Fidelidade|
|64|Quantidade de dias desde a última troca de pontos|long|2|Fidelidade|
|65|Identificador do cliente no programa de fidelidade|Texto|2|Fidelidade|
|66|Quantidade de minutos recarregados nos últimos 30 dias|long|2|Digital Goods|
|67|Quantidade de recargas realizadas nos últimos 30 dias|long|2|Digital Goods|
|68|Quantidade em dias entre a data de partida e a data de retorno|int|2|Aéreo|
|69|Quantidade de passageiros viajando independente da faixa etária|int|2|Aéreo|
|70|Identificador do voô|Texto|1|Aéreo|
|71|Número de infants viajando|int|2|Aéreo|
|72|Número de crianças viajando|int|2|Aéreo|
|73|Número de adultos viajando|int|2|Aéreo|
|74|Identifica se é um passageiro frequente (Frequently Flyer) <br/> Possíveis valores: SIM ou NAO|Texto|2|Aéreo|
|75|Identificar do passageiro frequente (Frequently Flyer Number)|Texto|2|Aéreo|
|76|Categoria do passageiro frequente (Frequently Flyer) <br/> Esta categoria pode variar de acordo com a companhia aérea|int|2|Aéreo|
|77|Dia da semana do embarque <br/> Possíveis valores: Sunday (Domingo) <br/> Monday (Segunda-feira) <br/> Tuesday (Terça-feira) <br/> Wednesday (Quarta-feira) <br/> Thursday (Quinta-feira) <br/> Friday (Sexta-feira) <br/> Saturday (Sábado)|Texto|2|Aéreo|
|78|Código da companhia aérea <br/> Ex.: JJ ou LA ou AA ou UA ou G3 e etc|Texto|1|Aéreo|
|79|Classe tarifária da passagem <br/> Ex.: W ou Y ou N e etc|Texto|2|Aéreo|
|80|Número do celular do passageiro <br/> Ex.: Formato: DDIDDDNúmero - Ex.: 5521976781114|Texto|2|Aéreo|
|81|Identifica se o dono do cartão de crédito irá viajar <br/> Possíveis valores: SIM ou NAO|Texto|3|Aéreo|
|82|Identifica se o seller (vendedor) irá trabalhar com revisão manual ou não <br/> Possíveis valores: SIM ou NAO|Texto|1|Todos|
|83|Segmento de negócio <br/> Ex.: Varejo|Texto|2|Todos|
|84|Nome da plataforma integrada a API 3.0 <br/> Caso seja uma integração direta entre a loja e Cielo, enviar valor igual a PROPRIA|Texto|3|Todos|
|85 a 89|Campos livres e definidos junto ao provedor de AntiFraude, conforme as regras de negócio|-|-|-|
|90 a 100|Reservados|-|-|-|
