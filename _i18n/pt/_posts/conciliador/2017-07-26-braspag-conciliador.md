---
layout: manual
title: Manual Agiliza
description: Integração Técnica
search: true
categories: manual
tags:
  - 7. Conciliador
language_tabs:
  xml: XML
---

# Visão Geral

O Agiliza é a ferramenta de conciliação da Braspag criada para que você possa conferir o fluxo financeiro das vendas do seu estabelecimento. Nele, é possível cruzar o seu registro de vendas com o os valores pagos pela credenciadora dos pagamentos das transações de cartão de crédito, débito e voucher.

O Agiliza é a mais completa solução para o controle das transações feitas com cartão de crédito, débito e voucher, independente se o canal é e-commerce, call center ou mundo físico. O Agiliza funciona baseado em três pilares principais: importação de vendas, processamento do extrato e arquivo de saída.

![FluxoAgiliza]({{ site.baseurl_root }}/images/braspag/conciliador/agiliza1-fluxo-geral.png)

## Importação de Vendas

Ao importar suas vendas, você fornece para a Braspag as vendas processadas em seu sistema de pedidos. Se você processa suas transações com o Pagador Braspag (nosso gateway de pagamentos) ou com a API Cielo E-commerce, a importação é feita automaticamente.

Se você não é cliente do Pagador Braspag ou da API Cielo E-commerce, é necessário configurar a importação do Arquivo de Vendas da sua loja para o Agiliza. Você pode fazer essa configuração através da integração com a nossa API ou manualmente via portal do cliente Agiliza.

## Processamento do Extrato

A sua credenciadora enviará para o Agiliza os extratos das vendas da sua loja. Após receber o seu arquivo de vendas e o extrato da credenciadora, o Agiliza começará o processo de conciliação.

Conciliar uma transação é o processo de identificação de uma venda registrada pela sua loja dentro do extrato da credenciadora, o que indica o processamento correto da transação dentro da credenciadora e serve para conferência do que a sua loja receberá em sua conta corrente, bem como todos os eventos possíveis para aquela venda, como antecipações, estornos e chargebacks, entre outros.

O Agiliza hoje suporta as principais credenciadoras do mercado:

* Cielo
* Rede
* Getnet
* GlobalPayments
* PagSeguro
* SafraPay
* Stone
* VR
* Valecard
* Banrisul
* BIN
* Mercado Pago
* Alelo
<br/>
> Cada credenciadora possui layouts e eventos específicos em seu extrato. As especificidades de cada credenciadora podem ser conferidas em Informações sobre as adquirentes, tanto para [CSV](https://braspag.github.io//manual/braspag-conciliador#informa%C3%A7%C3%B5es-sobre-as-adquirentes49) quanto para [XML](https://braspag.github.io//manual/braspag-conciliador#informa%C3%A7%C3%B5es-sobre-as-adquirentes).

## Arquivo de Saída

Por último, uma vez que todas as vendas importadas foram conciliadas corretamente com base no extrato da credenciadora, é possível gerar um arquivo de saída, em layout próprio da Braspag, para ser importado em ERPs ou quaisquer outros sistemas de gestão de vendas. Assim, é possível ter todo o ciclo de vida de uma transação atualizado diariamente, melhorando o controle financeiro da sua empresa. 

# Glossário

|TERMO                  |DEFINIÇÃO|
|---|---|
|**Aceleração**         | Existia até maio de 2021, antes do Registro de Recebíveis. Se você consultar um extrato anterior a esse período, é possível existir o evento aceleração em seu extrato. A aceleração é um procedimento feito para adiantamento de parcelas futuras oriundas de um estorno, chargeback ou antecipação.|
|**Afiliação**          |Código responsável pela identificação de uma loja (cliente Agiliza) com a credenciadora. Durante a criação de uma venda, ainda no fluxo transacional (Pagador ou outro processador de pagamentos), esse dado é enviado como credencial da loja. Esta credencial também é usada também como chave do extrato e para identificar a loja, cruzando o dado transacional com o dado do extrato.|
|**Ajuste**             | É qualquer evento no extrato de cobranças "não previstas" pelo lojista. Ela pode ter relação com as vendas da loja ou não; por exemplo, tanto estorno quanto chargebacks são também ajustes. Ajustes não relacionados à venda podem ser aluguel de POS, cobranças específicas da credenciadora ou serviços solicitados on demand. Não há conciliação nestes casos, apenas o impacto desses valores dentro da agenda financeira da loja.|
|**Antecipação**        | É um evento no extrato da credenciadora. Esta operação indica que o lojista solicitou o recebimento antecipado de um valor ainda a receber de uma venda. Por exemplo, quando uma loja vende um produto por R$100,00 parcelado em 10 vezes sem juros, ela vai receber mensalmente a liquidação de cada parcela paga daquele pedido. Contudo, o lojista pode solicitar à credenciadora o recebimento do valor integral daquele pedido em troca de uma taxa acordada entre eles. Quando isso acontece, a previsão de pagamento das parcelas pendentes é acelerada e a liquidação ocorre integralmente no pagamento da antecipação.|
|**Cancelamento**       | É um evento no extrato da credenciadora, mas que não gera evento no Agiliza. Ocorre quando o lojista precisa desfazer uma transação já realizada. Esta operação pode ocorrer por cobrança indevida ao portador, insatisfação e devolução do produto/serviço adquirido, dentre outros. O cancelamento ocorre no mesmo dia da venda, o que faz com que aquele pedido não apareça no extrato e que o portador do cartão não seja sensibilizado em sua fatura, porque não houve captura. |
|**Chargeback**         | É um evento no extrato da credenciadora. Ocorre quando o portador do cartão usado numa venda contesta essa venda direto com o banco. Essa contestação é investigada e, caso o lojista não consiga garantir que aquela transação foi gerada a partir do portador, a transação sofrerá o chargeback, no qual o lojista é responsável por devolver o valor da transação ao portador.|
|**Credenciadora**      | Antes chamada de adquirente, a credenciadora é uma instituição de pagamento que realiza a captura, o processamento e a liquidação das transações e o registro dos recebíveis de uma loja perante a registradora.|
|**Estorno**            | É um evento no extrato da credenciadora. Ocorre quando o lojista precisa desfazer uma transação já realizada. Esta operação pode ocorrer por cobrança indevida ao portador, insatisfação e devolução do produto/serviço adquirido, dentre outros. Diferente do cancelamento, o estorno ocorre quando a solicitação de desfazimento de uma venda ocorre em no dia seguinte à venda (D+1 da venda). Com isso, o comprador terá um registro da venda e um registro do cancelamento da venda na sua fatura e o lojista também terá os dois eventos no seu extrato.|
|**Eventos**            | São os registros do extrato da credenciadora que indicam toda a movimentação de uma transação desde a sua criação. Há eventos de diversos tipos, variando para cada credenciadora. No entanto, existem alguns padrões, como: antecipações, vendas, ajustes, chargebacks e pagamentos.|
|**Extrato**            | Arquivo posicional que as credenciadoras enviam para o Agiliza com as informações das vendas de um cliente. Nós recebemos o extrato diariamente e, em geral, ele é dividido pelo tipo de evento: um arquivo para vendas, outro arquivo para pagamentos e assim sucessivamente. A ausência do arquivo de um tipo de evento específico pode acarretar falha no processamento de um cliente.|
|**Filial**             | Costuma ser uma loja secundária, ligada à loja principal (matriz). A matriz pode acompanhar a conciliação de suas lojas em dois formatos:<br><br>**Visão geral**: a matriz visualiza os dados de conciliação de todas as filiais em um único relatório.<br>**Visão por filial**: a matriz acessa cada filial (loja) no Agiliza e emite um relatório individual para cada uma.<br><br>*Importante: qualquer loja que utilize o Pagador para importação das vendas deverá ter pelo menos uma filial, para fazer o link entre a loja no Pagador e a loja no Agiliza, ainda que não haja distinção entre as afiliações*.|
|**Número do Pedido**   | É o dado enviado à credenciadora durante a criação da venda para identificar essa venda. Este número é utilizado para controle dos pedidos pela loja. A política para unicidade deste número fica a critério de cada lojista, podendo ser único, único apenas no dia corrente, ou com livre repetição.|
|**Número Sequencial Único (NSU)**| É o identificador de uma transação, que conecta uma venda com o CNPJ da loja. O NSU é gerado tanto no mundo físico quanto no e-commerce.|
|**Produto**            | É o tipo de meio de pagamento utilizado em uma compra.|
|**Recebimento**        | É a liquidação/pagamento. É um evento no extrato da credenciadora. Indica que um pedido já processado foi devidamente pago à loja, em sua conta corrente indicada. Cada credenciadora possui prazos para liquidação próprios.|
|**Registradora**       | As registradoras são entidades autorizadas pelo Banco Central do Brasil, responsáveis pela organização, segurança e visibilidade dos recebíveis de cartões. As informações compiladas pelas registradoras são reportadas ao Banco Central.|
|**Registro de recebíveis**| É uma norma que estabelece diretrizes sobre registro e antecipação de recebíveis de cartão. Dessa forma, desde 07 de junho, credenciadoras e subcredenciadoras passaram a registrar as transações de cartões junto às Registradoras.|
|**Rollback de processamento**| É o procedimento conhecido no Agiliza para desfazer o processamento já realizado de um extrato da credenciadora. Pode ser usado em caso de inconsistências dos extratos recebidos. Isto é necessário para não criar furos na sua agenda financeira.|
|**Transação**          | É o processo que ocorre entre o pedido e a confirmação da venda. A transação abrange o pedido, a autorização e a captura. Quando confirmada, a transação irá gerar a venda criada pela loja na credenciadora e registrada na registradora, utilizando um gateway de pagamento (como o Pagador Braspag), subcredenciadora ou integração direta. |
|**TransactionId (TId)**| É o identificador único de uma venda de uma loja na credenciadora. Ele é retornado na resposta da requisição de venda enviada à credenciadora e deve ser armazenado para futuras operações com a venda criada. É a chave mais forte para cruzamento das informações de uma venda no extrato com a informação da venda presente no gateway, ERP ou qualquer outra ferramenta de gestão de pedidos, além de ser utilizada como chave para pedidos futuros de estorno.|
|**Unidade de Recebíveis (UR)**| É um ativo financeiro proveniente das vendas a serem recebidas pelos clientes. A UR é caracterizada pelo seguinte conjunto de informações: data de liquidação + produto/bandeira + credenciadora (ou subcredenciadora) + CPF ou CNPJ do recebedor.|
|**Valor Bruto da Venda**| É o valor total de uma venda processada com uma credenciadora, sem o desconto das taxas.|
|**Valor Líquido da Venda**| É o valor que será recebido pelo lojista por uma venda processada com uma credenciadora, já descontadas as taxas contratuais entre loja e credenciadora.|
|**Venda/Previsão de Pagamento**| É um evento no extrato da credenciadora. Indica que o pedido de um comprador foi aprovado pelas instituições financeiras participantes do processo de captura (credenciadora, bandeira e emissor), gerando uma previsão para que aquele pedido seja pago para a loja que o vendeu, baseado nas regras de liquidação específicas de cada credenciadora.|

# Registro de Recebíveis

O **Registro de Recebíveis** trouxe uma mudança na forma como os valores que uma loja tem a receber são liquidados e antecipados. Com isso, a conciliação financeira passa a ser feita entre as suas vendas e os valores de recebíveis registrados para o seu CPF ou CNPJ.

## O que é o Registro de Recebíveis?

O Registro de Recebíveis está em vigor desde 07/06/2021, com a resolução [nº 4.734/2019 do Conselho Monetário Nacional (CNM)](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o&numero=4734){:target="_blank"} e a [Circular nº 3.952/2019 do Banco Central do Brasil](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Circular&numero=3952){:target="_blank"}.

Com isso, as credenciadoras e subcredenciadoras precisam registrar os recebíveis de cartão dos estabelecimentos em uma entidade registradora, que é responsável por disponibilizar as informações dos recebíveis entre financiadores.

O objetivo do registro é dar mais transparência e segurança para as operações de crédito e de antecipação de recebíveis. A UR registrada garante o valor que o estabelecimento tem disponível para negociação e permite, por exemplo, um contrato com uma instituição financeira com a qual não tenha relacionamento.

### Qual é o papel das credenciadoras e subcredenciadoras?

As instituições credenciadoras devem registrar as agendas de recebíveis e os contratos de recebíveis negociados de seus usuários nas registradoras.

### Quem são as registradoras?

São as entidades responsáveis pela organização, segurança e visibilidade dos recebíveis de cartões. As registradoras compõem o sistema de registro e disponibilizam as informações dos recebíveis para financiadores e credenciadoras, mediante autorização do usuário final recebedor (*opt-in*).

### Financiadores

São instituições financeiras e não financeiras que podem comprar os recebíveis.

### URs: as Unidades de Recebíveis

![FluxoAgiliza]({{ site.baseurl_root }}/images/braspag/conciliador/agiliza2-ur.png)

As URs são os valores que uma loja tem a receber por suas vendas. As URs são o resultado do agrupamento das seguintes informações:

* Data de liquidação;
* Arranjo de pagamento, que é a combinação entre o produto (crédito e débito) e a bandeira;
* Credenciadora (ou subcredenciadora);
* CPF ou CNPJ do recebedor.

## O que mudou com o Registro de Recebíveis?

As principais novidades são a forma como sua loja visualiza o valor que tem para receber e a antecipação de recebíveis.

Antes, era possível acompanhar o ciclo de uma transação desde a captura até a liquidação. Hoje, as antecipações e gravames não são acompanhados individualmente até a liquidação, porque os valores que uma loja tem para receber são agrupados nas Unidades de Recebíveis.

Também antes do registro, a antecipação de recebíveis era feita pela antecipação de parcelas que seriam liquidadas no futuro. Mas desde o início do Registro de Recebíveis a antecipação é feita por valores (URs) que uma loja tem a receber. Além disso, é possível antecipar recebíveis com qualquer credenciadora.

## Como visualizar os seus recebíveis 

### Gravame

O gravame  é um registro que informa que um recebível foi dado como garantia em algum contrato ou negociação, por exemplo, a contratação de linhas de crédito num banco. O valor gravamado impede que o mesmo recebível seja dado em garantia em mais de uma operação. A liquidação do gravame é feita na conta do estabelecimento.

**Crédito de gravame**: é o valor dado como garantia pelo estabelecimento comercial e que será liquidado conforme a instrução do banco com o qual negociou.

**Débito de gravame**: é o lançamento na agenda do estabelecimento que corresponde a um saldo que estava livre de negociação e que agora foi negociado. Sinaliza que o valor não será liquidado pela credenciadora, mas sim pela instituição com a qual os recebíveis foram negociados.

### Cessão

É a negociação de antecipação de recebíveis por troca de titularidade, ou seja, a UR de um estabelecimento passa a pertencer ao financiador. Com isso, a liquidação será feita no domicílio bancário do financiador.

### Cessão fumaça

É uma cessão a constituir. Quando a loja não possui agenda futura de URs, a cessão será baseada no histórico de URs da loja e as URs que a vier a construir estarão comprometidas com essa cessão.

# Funcionamento do Agiliza

O processo de conciliação de transações consiste no cruzamento dos dados enviados pela credenciadora com os dados das vendas informados pela loja. A Braspag recebe todos os eventos relativos a cada transação, como pagamentos, parcelamentos, estornos, chargebacks e antecipações, entre outros. Fazemos a conciliação tanto da venda como um todo, quanto dos eventos.

> Uma transação pode estar conciliada, porém ter um ou mais eventos não conciliados. É preciso ter atenção à conciliação de todo o ciclo de vida de uma transação.

Assim, montamos a sua agenda financeira, com tudo o que sua loja vendeu, recebeu e irá receber, ao longo do tempo.

## Tipos de eventos de um extrato

Veja abaixo a lista com todos os eventos que podem ser exibidos no seu extrato.
 
* Pagamentos em transações;
* Pagamentos em lote;
* Ajuste;
* Tarifa de serviços;
* Desagendamentos;
* Estornos;
* Chargebacks;
* Acelerações;
* Débito de cessão;
* Débito de gravame;
* Cessão fumaça;
* Crédito de cessão;
* Crédito de gravame;
* Débito compensação de valores;
* Crédito compensação de valores;
* Estorno débito de cessão;
* Estorno crédito de cessão;
* Estorno débito de gravame;
* Estorno crédito de gravame;
* Débito devido a compensação de cancelamento de transação em operação;
* Crédito devido a compensação de cancelamento de transação em operação;
* Débito de penhora;
* Crédito de penhora;
* Estorno de débito de penhora;
* Estorno de crédito de penhora;
* Débito devido a compensação de cancelamento em operação;
* Crédito devido a compensação de cancelamento em operação;
* Pagamentos de valores retidos;
* Débitos de valores retidos;
* Pagamentos de vendas antecipadas;
* Débitos de antecipação de vendas.

<br/>Agora, acompanhe o detalhamento dos principais eventos do seu extrato.

### Vendas

Quando uma venda é realizada, via maquininha de cartão (POS), e-commerce, TEF ou outro canal, essa venda será informada no extrato da credenciadora com uma previsão de pagamento. Os dados gerais de uma venda serão informados, tais como:

* Valor bruto; 
* Valor líquido (já descontada a taxa da credenciadora); 
* Identificadores da venda (utilizados para cruzarmos a venda do lojista com o registro da credenciadora); 
* Parcelas; 
* Data prevista para realização de cada um dos eventos financeiros daquela venda.

### Recebimento

É o evento que ocorre na data em que o pagamento de uma venda ou parcela de uma venda é creditado na conta do lojista, também conhecido como realização de pagamento. Normalmente é a confirmação de uma previsão já existente.

### Antecipações

No processo de antecipação, o lojista solicita à credenciadora para antecipar os recebíveis que ele possui em sua agenda financeira. Por exemplo, caso você tenha uma venda que foi parcelada em 10 vezes, e você já recebeu o pagamento da primeira parcela, você poderá solicitar a antecipação do pagamento das nove parcelas restantes, pagando uma taxa para a realização desta operação.

### Ajustes

Ajustes são eventos que ocorrem numa venda já finalizada. Dentre os ajustes possíveis, temos:

* **Estornos**: quando o lojista solicita a devolução ao comprador de uma venda já realizada;
* **Chargebacks**: quando o comprador não reconhece uma cobrança em seu cartão e a contesta diretamente no seu banco;
* **Reagendamento**: quando uma venda tem previsão de pagamento para uma data e, por algum motivo, será necessário mudar esta previsão.

### Aceleração

Aceleração de parcela ocorre quando é realizada uma manutenção no plano parcelado, como cancelamento, chargeback ou alteração na quantidade de parcelas da venda. A mesma movimentação ocorre para os débitos de antecipação. Como exemplo, quando uma venda parcelada sofre chargeback, a credenciadora irá acelerar todas as parcelas ainda pendentes antes de realizar o chargeback. Isto impede que exista um furo na agenda financeira do cliente. Não está disponível para todas as credenciadoras.

### Tarifa e Taxa

A tarifa é uma variação da taxa. Ambos são valores acordados entre o lojista e a credenciadora que serão cobrados a cada transação, e podem diferir entre crédito, débito e boleto, compra à vista ou parcelada e bandeira. A taxa é uma porcentagem, enquanto a tarifa é um valor fixo. Se a credenciadora oferece a tarifa, todas as transações terão o desconto de um valor fixo; se for a taxa, a cobrança será de uma porcentagem.

### Mensalidade

Corresponde ao aluguel e manutenção da maquininha (POS) cobrado pela credenciadora e é considerado um ajuste. No Agiliza, a mensalidade é recorrente e tem data determinada para acontecer.

### Valor Retido

Se um estabelecimento antecipa todo o valor que tem para receber é possível que, devido a estornos e chargebacks, fique com valor de crédito inferior aos débitos agendados. Para evitar essa situação, chamada de debit balance, a credenciadora pode reter um valor em uma operação de antecipação.

## Importação das Vendas

Para que a conciliação funcione corretamente, é importante que as suas vendas sejam carregadas para o Agiliza.

### Cliente Braspag e Cielo

Se você é cliente do gateway de pagamento **Pagador Braspag** ou usa a **API Cielo E-commerce** ou possui as maquininhas da Cielo (mundo físico), as suas vendas são importadas automaticamente pelo Agiliza mediante aceite do termo de concessão, durante a contratação do serviço. Neste manual, você pode ir direto para os tópicos sobre o arquivo de fluxo de caixa (arquivo de saída) em [XML](https://braspag.github.io//manual/braspag-conciliador#arquivos-fluxo-de-caixa-2.0-xml) ou [CSV](https://braspag.github.io//manual/braspag-conciliador#arquivos-fluxo-de-caixa-2.0-csv).

### Cliente de outros gateways e credenciadoras

Se você é cliente de outros gateways ou possui a maquininha (POS) de outras credenciadoras (que não sejam Cielo), você deverá fazer a importação das suas vendas. O carregamento das vendas para o Agiliza pode ser feito na [Edição de Loja](https://reconciliation.braspag.com.br/WebSite/Login.aspx?ReturnUrl=%2fWebSite%2fBackOffice%2fEditMerchant.aspx){:target="_blank"} no portal do cliente Agiliza, por integração com a API Agiliza, transferência via SFTP ou transferência via webservice SOAP.

#### Importação via portal do cliente Agiliza

O layout está disponível em [Manual de Arquivos de Vendas Externas](https://reconciliation.braspag.com.br/WebSite/Login.aspx?ReturnUrl=%2fWebSite%2fBackOffice%2fEditMerchant.aspx){:target="_blank"} e o formato deste arquivo deve ser CSV. Atente-se para os dados obrigatórios neste tipo de integração. Alguns campos que sempre devem ser enviados:

* Afiliação;
* Credenciadora (adquirente);
* Identificador da Filial;
* Valor da Venda;
* Quantidade de parcelas;
* NSU/DOC.

<br/>Campos que identificam a transação não são obrigatórios completos, porém existem alguns campos que permitem o cruzamento de uma venda com o registro que virá no extrato da credenciadora.

#### Importação via API Agiliza

Para saber mais sobre a importação via API, disponibilizamos o manual de integração no Postman. Veja mais em [API do Agiliza](https://braspag.github.io//manual/braspag-conciliador#api-do-agiliza).

#### Outras formas de importação

Você também pode fazer a transferência do arquivo de vendas via:

* [Transferência automática: configuração de SFTP]( https://braspag.github.io//manual/braspag-conciliador#transfer%C3%AAncia-autom%C3%A1tica-configura%C3%A7%C3%A3o-de-sftp);
* [Transferência de arquivos automática via webservice](https://braspag.github.io//manual/braspag-conciliador#transfer%C3%AAncia-de-arquivos-autom%C3%A1tica-via-webservice:).

## Arquivo de saída

É o arquivo conciliado, também chamado de arquivo de fluxo de caixa, que contém todas as vendas, pagamentos, estornos e cancelamentos, enfim, todos os movimentos que uma loja possui para determinada data.

O arquivo de saída é um meio de integração, e você poderá fazer o upload do arquivo conciliado para o seu ERP ou sistema de gestão para gerar um "contas a receber" e realizar as baixas das contas que receber dentro do seu sistema.

Nesse manual, você pode consultar a configuração de dois formatos de arquivo de saída, XML e CSV:

* [Arquivos Fluxo de Caixa 2.0 – XML](https://braspag.github.io//manual/braspag-conciliador#arquivos-fluxo-de-caixa-2.0-xml);
* [Arquivos Fluxo de Caixa 2.0 – CSV](https://braspag.github.io//manual/braspag-conciliador#arquivos-fluxo-de-caixa-2.0-csv).

# API do Agiliza

Para fazer a integração com a API do Agiliza Braspag, [veja a documentação no Postman](https://documenter.getpostman.com/view/2956778/T1Dv8EVZ?version=latest){:target="_blank"}.

# Arquivos de vendas Externas - CSV

## Arquivo de Transações para Upload

O arquivo de transações para upload é um arquivo de texto, mais especificamente um arquivo de valores separados por ponto-e-vírgula (CSV).
As informações são guardadas em três tipos de registros, Header, Transação e Trailer.

## Registro Header

Apenas um registro deste tipo é permitido por arquivo. O registro header deve estar na primeira linha do arquivo. O registro segue o seguinte padrão:

> [Tipo de Registro];[Versão do Layout];[Período Inicial];[Período Final]

| Campo            | Tamanho | Descrição                                                                                                      |
|------------------|---------|----------------------------------------------------------------------------------------------------------------|
| Tipo de Registro | 1       | Tipo de registro. Para o Header, este valor será sempre 0.                                                     |
| Versão do layout | 3       | Identifica qual a versão do layout do arquivo. A versão mais atual é 001.                                      |
| Período Inicial  | 8       | Identifica a data que corresponde à data da transação mais antiga contemplada no arquivo. Formato “yyyyMMdd”.  |
| Período Final    | 8       | Identifica a data que corresponde à data da transação mais recente contemplada no arquivo. Formato “yyyyMMdd”. |

## Registro Transação

Cada transação feita pela loja será demonstrada nesse registro, que se repetirá quantas vezes forem necessárias, a partir da linha 2 (logo após o Header).

<aside class="warning">Atenção: o número de identificação do pedido (MerchantOrderId) não sofre alteração, se mantendo o mesmo até o final do fluxo transacional. Contudo, um número adicional (SentOrderId) pode ser gerado para o pedido e utilizado durante a transação. Esse número (SentOrderId) só será diferente em caso de adequação a regras da adquirente ou em caso de números de identificação do pedido (MerchantOrderId) repetidos.</aside>

O registro segue o seguinte padrão:

> [Tipo de Registro];[Pedido];[Afiliação];[Adquirente];[TID];[NSU/DOC];[Código de Autorização] ; [Número do Cartão];[Valor];[Quantidade de Parcelas];[Data da Venda];[Hora da venda] ; [Identificador da filial]

| Campo                    | Tipo           | Tamanho | Descrição                                                                                           |
|--------------------------|----------------|---------|-----------------------------------------------------------------------------------------------------|
| Tipo de Registro         | Domínio2       | N/A     | Tipo de registro. Para a transação, este valor será sempre 1.                                       |
| Pedido                   | Texto          | 0~64    | Número do pedido.                                                                                   |
| Afiliação1               | Inteiro3       | N/A     | Código de afiliação na adquirente.                                                                  |
| Adquirente1              | Domínio2       | N/A     | Identificador da adquirente. <br>1 = Cielo<br>2 = Redecard<br>3 = Amex<br>4 = Losango<br>5 = GetNet |
| TID                      | Texto          | 0~20    | TID da transação.                                                                                   |
| NSU/DOC1                 | Inteiro longo4 | N/A     | NSU/DOC da transação.                                                                               |
| Código de autorização    | Texto          | 0~6     | Código de autorização da transação.                                                                 |
| Número do cartão         | Texto          | 0~24    | Número do cartão utilizado na transação (mascarado conforme normas PCI).                            |
| Valor1                   | Inteiro3       | N/A     | Valor da transação em centavos.                                                                     |
| Quantidade de parcelas1  | Byte5          | N/A     | Quantidade de parcelas em que a transação foi dividida. 1 = Transações à vista                      |
| Data da venda1           | Domínio2       | 8       | Data da venda da transação. Formato “yyyyMMdd”.                                                     |
| Hora da venda1           | Domínio2       | 8       | Hora da venda da transação. Formato “HH:mm:ss”.                                                     |
| Identificador da filial1 | Texto          | 0~256   | Identificador da filial da loja.                                                                    |
| Documento do cliente     | Texto          | 0~32    | Numero do documento de identificação do cliente.                                                    |
| Nome do cliente          | Texto          | 0~256   | Nome do cliente.                                                                                    |
| Email do cliente         | Texto          | 0~256   | Email de contato do cliente.                                                                        |

**Legenda:**

1. Campo obrigatório.
2. O tipo de dados deste campo deve seguir restritamente o formato expresso na descrição.
3. O tipo inteiro aceita como um número válido qualquer valor entre -2.147.483.648 e 2.147.483.647. Entretanto, regras de domínio adicionais podem existir para os campos (o código de afiliação deve ser válido na adquirente, por exemplo).
4. O tipo inteiro longo aceita como um número válido qualquer valor entre – 9.223.372.036.854.775.808 e 9.223.372.036.854.775.807. Entretanto, regras de domínioadicionais podem existir para os campos (o NSU da transação deve ser válido na adquirente, por exemplo).
5. O tipo byte aceita como um número válido qualquer valor entre 0 e 255. Entretanto, regras de domínio adicionais podem existir para os campos (a parcela da transação deve ser no mínimo 1, por exemplo).

**Informações Adicionais:**

* **Campo NSU** - Quando não informado, este campo deve ser vazio.
* **Campo TID** - Quando não informado, este campo deve ser vazio.
* **Campo Hora** – Caso não tenha o valor exato, informar a hora como 00:00:00.

## Registro Trailer

Apenas um registro deste tipo é permitido por arquivo. O registro trailer deve estar na última linha do arquivo. O registro segue o seguinte padrão:

> [Tipo de Registro];[Quantidade de registros]

| Campo                   | Tamanho | Descrição                                                     |
|-------------------------|---------|---------------------------------------------------------------|
| Tipo de Registro        | 1       | Tipo de registro. Para o Trailer, este valor será sempre 2.   |
| Quantidade de registros | N/A     | Quantidade de registros (exceto Header e Trailer) no arquivo. |

## Formas de envio

Atualmente o conciliador Braspag oferece 3 (três) formas de envios para os arquivos de vendas:

* Upload Manual pela aplicação
* Transferência via SFTP
* Transferência via webservice

### Transferência Manual: Upload de arquivos na aplicação.

Pre-Requisitos:

* Acesso à internet, usuário e senha com permissão para upload habilitada.
* Acessando a URL: https://reconciliation.braspag.com.br/WebSite
* No menu superior, localize a funcionalidade: **“Área do lojista”**
* Após clicar no botão **“Área do lojista”** aparecerá um menu na lateral esquerda do backoffice:
* Localize o botão **“Upload de arquivos de Transações”**, ao clicar, aparecerá a seguinte tela:

![]({{ site.baseurl_root }}/images/braspag/conciliador/upload.png)

Agora basta selecionar a loja, e realizar o upload escolhendo o arquivo que deseja transmitir de sua máquina. Para iniciar a transmissão click em “Efetuar upload”.

### Transferência automática: Configuração de SFTP

É possivel alimentar o conciliador com os dados de vendas, através desse protocolo de rede que fornece acesso a arquivos , transferência de arquivos e gerenciamento de arquivos sobre qualquer fluxo de dados confiável.
Porém para que seja possível a realização da automação, esse processo exige alguns pré-requisitos:

* O Ambiente deverá ser configurado nos domínios do lojista.
* O lojista disponibilizará diariamente os arquivos de vendas no layout Braspag nesse domínio.
* A Braspag terá acesso liberado para se conectar e realizar as baixas

![]({{ site.baseurl_root }}/images/braspag/conciliador/fluxo.png)

### Transferência de arquivos automática via Webservice:

> URL: [https://reconciliation.braspag.com.br/WebServices/ReconciliationFilesWebservice.asmx](https://reconciliation.braspag.com.br/WebServices/ReconciliationFilesWebservice.asmx){:target="_blank"}

**Método:** SendTransactionFile

| Parâmetro          | Tipo   | Descrição                        | Condição          |
|--------------------|--------|----------------------------------|-------------------|
| RequestId          | Guid   | Identificador da requisição      | Campo obrigatório |
| MerchantId         | Int    | Identificador da loja            | Campo obrigatório |
| RequestingUserName | String | Nome do usuário vinculado a loja | Campo obrigatório |
| RequestingPassword | String | Senha do usuário                 | Campo obrigatório |
| FileContent        | String | Conteúdo do arquivo em binário   | Campo obrigatório |

**OBS**: Os dados desse arquivo são codificados como um "array" de bytes, ou seja, deverá ser enviado os bytes do arquivo.

A solução para isso é utilizar a codificação Base64. Esse tipo de codificação é o padrão usado quando se deseja fazer transferência de dados binários utilizando texto como a fonte do meio de comunicação. Em outras palavras, essa codificação é capaz de representar conteúdo de texto em forma de binário.

Para gerar o conteúdo do FileContent, é preciso primeiro saber codificar um dado textual em Base64. Existem documentos na internet explicando todo o processo conversão. A maioria das linguagens de programação atualmente já possuem algum framework integrado com alguma função que faça a codificação/decodificação.

**Referência:**
Caso o cliente queira codificar/decodificar um conteúdo como teste, ele pode acessar este site:

> [http://www.base64decode.org/](http://www.base64decode.org/){:target="_blank"}

#### Request

![]({{ site.baseurl_root }}/images/braspag/conciliador/request.png)

#### Response

![]({{ site.baseurl_root }}/images/braspag/conciliador/response.png)

## Tipos de erro

Quando o valor da TAG `<Sucess>` for igual a false, a coleção de `<ErrorReport>` será retornada de acordo com um ou mais códigos de erros. Vide tabela abaixo.

| Código | Descrição                                                                                                |
|--------|----------------------------------------------------------------------------------------------------------|
| 24     | RequestId inválido.                                                                                      |
| 26     | Arquivo de transações de loja inválido. (Qualquer erro no conteúdo do arquivo.)                          |
| 39     | Erro interno do sistema.                                                                                 |
| 42     | Um MerchantId válido não foi especificado. É necessário especificar o identificador da loja.             |
| 43     | Um conteúdo válido não foi especificado para o aruqivo. É necessário especificar o valor de FileContent. |
| 44     | Acesso não autorizado no IP para a loja fornecida na requisição.                                         |
| 46     | O usuário é inválido ou não tem acesso à loja especificada.                                              |

### Exemplo

![]({{ site.baseurl_root }}/images/braspag/conciliador/error.png)

# Arquivos Fluxo de Caixa 2.0 - XML

## Introdução

Este manual tem como objetivo orientar o desenvolvimento do Arquivo de Fluxo de Caixa da plataforma conciliador no formato XML, e a extração do seu conteúdo através do Webservice

## Legenda para os tipos de formato

### Tipos de Formato (Tabela II)

| Descritor | Significado                                     | Exemplo                            |
|-----------|-------------------------------------------------|------------------------------------|
| N         | Um ou mais algarismos (0 a 9)                   | 243                                |
| A         | Um ou mais caracteres alfanuméricos             | Texto                              |
| {N}       | Um  único algarismo (0 a 9)                     | 2                                  |
| {A}       | Identificador Único Global (GUID)1              | B                                  |
| G         | Hora em campo data/hora (0 a 23)                | 4749e676-2507-442da1c6c25c08e2d2af |
| DT        | Data e hora, representados no formato ISO 86012 | 2015-06-09T10:08:19.1748259-03:00  |
| D         | Data, representada no formato ISO 86012         | 2015-06-09                         |

1. Um Identificador Único Global ou GUID (do inglês, Globally Unique IDentifier) é um tipo especial de identificador utilizado em aplicações de software para providenciar um número de referência padrão mundial. Como, por exemplo, em uma definição de referência interna para um tipo de ponto de acesso em uma aplicação de software ou para a criação de chaves únicas em um banco de dados. O número total de chaves únicas (2128 ou ~3.4×1038) é tão grande que a probabilidade do mesmo número se repetir é muito pequena. Considerando que o Universo Observável contém 5x1022 estrelas, cada estrela poderia ter ~6.8×1015 dos seus próprios GUIDs. Caso seu sistema não reconheça o formato GUID, poderá trata-lo como texto.

2. O formato ISO 8601 é o formato de data padrão existente na recomendação oficial para Schemas XML
[http://www.w3.org/TR/xmlschema-2/#dateTime](http://www.w3.org/TR/xmlschema-2/#dateTime){:target="_blank"}.  Ele consiste na representação da data no formato yyyy-MM-dd. Caso o campo também tenha a informação de hora, a data vem seguida da letra “T” para separa-la da hora, no formato HH:mm:ss:mmmmmmm, seguida finalmente pela diferença de fuso horário. Para mais informações da ISO 8601 podem ser consultadas em:

> [http://en.wikipedia.org/wiki/ISO_8601](http://en.wikipedia.org/wiki/ISO_8601){:target="_blank"}.   

## Informações sobre as adquirentes

O principal insumo do Conciliador são os extratos eletrônicos gerados pelas adquirentes. Devido a isso, podem existir particularidades entre cada uma.   
Abaixo a estimativa de dias em que a adquirente envia os eventos no extrato eletrônico:

### Prazo de registro no extrato eletrônico (Tabela II)

| Adquirente     | Captura                                         | Pagamento       | Observação                                                                                                                                                  |
|----------------|-------------------------------------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cielo          | D+1                                             | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Rede           | D+1                                             | D -1            | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Amex           | Entre D+1 à  D+2                                | Entre D-4 à D-6 | *Desconsiderar do prazo a segunda feira, pois os extratos  não são gerados. Nestes dias o arquivo do Conciliador será disponibilizado somente com o header. |
| Getnet         | D+1                                             | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Ticket         | D+30 ajustada ao dia de recebimento do cliente  | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Sodexo         | D+30 ajustada ao dia de recebimento do cliente  | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Stone          | Cartão de Débito: D+1 - Cartão de Crédito: D+30 | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Global Collect | Cartão de Débito: D+1 - Cartão de Crédito: D+30 | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| First Data     | Cartão de Débito: D+1 - Cartão de Crédito: D+30 | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |

### Registro Header (Tabela III)

| Campo              | Nome                                   | Tipo               | Formato | Descrição                                                                                                                              |
|--------------------|----------------------------------------|--------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------|
| MerchantId         | Identificador da Loja                  | Numérico (Inteiro) | N       | Contém o identificador único da loja no Conciliador                                                                                    |
| AcquirerId         | Identificador da Adquirente            | Numérico (Inteiro) | {N}     | 1 = Cielo<br>2 = Redecard<br>3 = Amex<br>5 = Getnet<br>6 = Ticket<br>7 = Stone<br>8 = Sodexo<br>9 = Global Payments<br>10 = First Data |
| GenerationDateTime | Geração do arquivo                     | Data/Hora          | DT      | Contém a data e a hora da geração do arquivo pelo Conciliador                                                                          |
| StartPeriod        | Período inicial                        | Data               | D       | Data inicial do período de conciliação contemplado pelo arquivo                                                                        |
| EndPeriod          | Período final                          | Data               | D       | Data final do período de conciliação contemplado pelo arquivo                                                                          |
| SequentialNumber   | Número sequencial                      | Numérico (Inteiro) | N       | Número sequencial que indica a ordem de processamento dos arquivos diários                                                             |
| ProcessingTypeId   | Identificador do tipo de processamento | Numérico (Inteiro) | {N}     | 1 = Arquivo diário <br> 2 = Arquivo reprocessado                                                                                       |
| ProcessingType     | Descrição do tipo de processamento     | Alfanumérico       | A       | “Daily” ou “Reprocessed” (Diário ou reprocessado)                                                                                      |
| Version            | Versão do arquivo                      | Alfanumérico       | A       | Versão do arquivo (“2.0”)                                                                                                              |

### Registro de Transação Conciliada (Tabela IV)

| Campo              | Nome                                 | Tipo               | Formato | Descrição                                      |
|--------------------|--------------------------------------|--------------------|---------|------------------------------------------------|
| ConciliationTypeId | Identificador do tipo de conciliação | Numérico (Inteiro) | {N}     | 1   = Automática <br> 2   = Manual             |
| ConciliationType   | Descrição do tipo de conciliação     | Alfanumérico       | A       | “Automatic” ou “Manual” (Automática ou manual) |

### Registro de Conciliação Manual (Tabela V)

| Campo                | Nome                              | Tipo         | Formato | Descrição                                                         |
|----------------------|-----------------------------------|--------------|---------|-------------------------------------------------------------------|
| ConciliationUserName | Usuário da conciliação manual     | Alfanumérico | A       | Login do usuário que efetuou a conciliação manual                 |
| ConciliationDateTime | Data e hora da conciliação manual | Data/Hora    | DT      | Data e hora em que a conciliação manual foi efetuada pelo usuário |

### Registro de Informação de Venda

| Campo                          | Nome                                            | Tipo                               | Formato | Descrição                                                                             |
|--------------------------------|-------------------------------------------------|------------------------------------|---------|---------------------------------------------------------------------------------------|
| TransactionId                  | Identificador Único da  Venda no Conciliador    | Identificador Único  Global (GUID) | G       | Identificador único do Conciliador para as informações de venda1                      |
| ExternalId                     | Identificador da Venda no  Sistema Transacional | Alfanumérico                       | A       | Identificador da Venda obtido a partir do Sistema Transacional no qual a Transação foi processada com a Adquirente-2                               |
| BranchId                       | Identificador da Filial                         | Alfanumérico                       | A       | Identificador da Filial da loja que processou a venda-3                                |
| AffiliationCode                | Código de Afiliação                             | Alfanumérico                       | A       | O código de afiliação da adquirente, informado nos dados da venda do cliente          |
| OrderId                        | Número do Pedido                                | Alfanumérico                       | A       | O número do pedido associado à venda no lojista-4                                      |
| AuthorizationCode              | Código de Autorização                           | Alfanumérico                       | A       | O Código de Autorização da transação que o Lojista recebeu da Adquirente              |
| SaleDate                       | Data da Venda                                   | Data                               | D       | A data em que foi realizada a venda no Lojista                                        |
| CaptureDate                    | Data da Captura                                 | Data                               | D       | A data da captura recebida pelo lojista da Adquirente                                 |
| TransactionAmount              | Valor da transação                              | Numérico (Inteiro)                 | N       | O valor da transação em centavos5                                                     |
| InstallmentCount               | Número de parcelas                              | Numérico (Inteiro)                 | N       | A quantidade de parcelas na qual a transação foi dividida                             |
| CustomerName                   | Nome do comprador                               | Alfanumérico                       | A       | O nome do comprador do produto                                                        |
| CustomerDocument               | Documento do comprador                          | Alfanumérico                       | A       | Documento de identificador do comprador (RG, CPF, etc.)                               |
| CustomerEmail                  | E-mail do comprador                             | Alfanumérico                       | A       | Endereço de e-mail do comprador                                                       |
| CardNumber                     | Número do cartão                                | Alfanumérico                       | A       | Número do cartão (crédito ou débito) utilizado na venda                               |
| Tid                            | TID                                             | Alfanumérico                       | A       | Identificador da transação ecommerce na Cielo, recebido pelo lojista                  |
| Nsu                            | NSU                                             | Número                             | N       | Número sequencial da transação na  Adquirente, recebido pelo lojista                  |
| IataAmount                     | Valor da taxa IATA                              | Número                             | N       | Valor da taxa IATA (apenas para setor aéreo), em centavos                             |
| PaymentMethodName              | Tipo de Integração                              | Alfanumérico                       | A       | Nome do meio de pagamento utilizado no caso da transação efetuada no  gateway Pagador |

1. As informações de venda são as transações enviadas pelo cliente do mundo físico, ou do  gateway/sistema transacional utilizado para efetuar as transações. São a primeira parte da conciliação. O Identificador Único da Venda pode ser utilizado para visualizar a venda no WebSite do Conciliador, preenchendo a URL:

> https://reconciliation.braspag.com.br/WebSite/Reports/TransactionDetails.aspx?SaleTransactionId=[ID]  

**OBS:**Onde o texto [ID] deve ser substituído pelo identificador informado no registro.   

2. O identificador da Venda no Sistema Transacional é o Identificador da Transação que é utilizado pelo sistema que efetuou a venda, seja ele um Gateway ou Sistema de Caixa/POS. Este valor pode ou não ser fornecido durante a importação da venda para o Conciliador. É de responsabilidade do cliente a decisão de informá-lo ou não.   
3. O identificador da Filial deve ser fornecido pelo cliente toda vez que a importação de uma venda é realizada para o Conciliador. Apesar de não haver restrições para o formato do identificador da filial (campo Alfanumérico), é obrigatório que cada Filial possua um identificador único.   
4. O Gerenciamento do Número do Pedido é de inteira responsabilidade do lojista. O Conciliador apenas armazena esta informação, mas nenhum tipo de validação é feito.   
5. O Valor da Transação não é o valor das parcelas. O valor informado aqui é o valor integral da mesma, da forma como informado pelo cliente/gateway.

### Registro de Informação da Adquirente

| Campo                          | Nome                                                               | Tipo                              | Formato | Descrição                                                                                                           |
|--------------------------------|--------------------------------------------------------------------|-----------------------------------|---------|---------------------------------------------------------------------------------------------------------------------|
| TransactionId                  | Identificador Único da Transação no Conciliador                    | Identificador Único Global (GUID) | G       | Identificador Único das Informações da Adquirente1                                                                  |
| AffiliationCode                | Código de Afiliação                                                | Numérico                          | N       | O Código de Afiliação informado na venda do Extrato                                                                 |
| SummaryNumber                  | Número do Lote                                                     | Numérico (Inteiro)                | N       | O número do Lote (Resumo de Vendas) ao qual a transação pertence na Adquirente                                      |
| CardNumber                     | Número do Cartão                                                   | Alfanumérico                      | A       | O número do cartão usado na compra2                                                                                 |
| SaleDate                       | Data da Venda                                                      | Data                              | D       | A data em que a venda foi efetuada, segundo as informações do extrato                                               |
| TransactionGrossAmount         | Valor bruto da Transação                                           | Numérico (Inteiro)                | N       | Valor bruto da transação em centavos                                                                                |
| TransactionTaxAmount           | Valor da taxa de adquirência deduzido da transação                 | Numérico (Inteiro)                | N       | Valor deduzido do valor bruto da transação como taxa de adquirência, em centavos                                    |
| TransactionNetAmount           | Valor líquido da transação                                         | Numérico (Inteiro)                | N       | Valor que será recebido pelo lojista, após a dedução da taxa de Adquirência sobre o valor bruto, em centavos        |
| RoundingInstallmentGrossAmount | Valor bruto da parcela de arredondamento                           | Numérico (Inteiro)                | N       | Valor bruto da parcela de arredondamento, em centavos3                                                              |
| RoundingInstallmentTaxAmount   | Valor da taxa de adquirência deduzido da parcela de arredondamento | Numérico (Inteiro)                | N       | Valor deduzido do valor bruto da parcela de arredondamento como taxa de adquirência, em centavos                    |
| RoundingInstallmentNetAmount   | Valor líquido da parcela de arredondamento                         | Numérico (Inteiro)                | N       | Valor que será recebido pelo lojista como valor da parcela de arredondamento, após a dedução da taxa de adquirência |
| InstallmentsGrossAmount        | Valor bruto das demais parcelas                                    | Numérico (Inteiro)                | N       | Valor bruto das demais parcelas da transação,  em centavos                                                          |
| InstallmentsTaxAmount          | Valor da taxa de adquirência deduzido das demais parcelas          | Numérico (Inteiro)                | N       | Valor deduzido do valor bruto das demais parcelas como taxa de adquirência, em centavos                             |
| InstallmentsNetAmount          | Valor líquido das demais parcelas                                  | Numérico (Inteiro)                | N       | Valor que será recebido pelo lojista como valor das demais parcelas, após a dedução da taxa de  adquirência         |
| Tax                            | Taxa de adquirência                                                | Numérico (Inteiro)                | N       | A taxa de adquirência sobre a transação4                                                                            |
| Tid                            | TID                                                                | Alfanumérico                      | A       | O identificador da transação ecommerce na adquirente Cielo                                                          |
| Nsu                            | NSU                                                                | Numérico (Inteiro)                | N       | O número sequencial da transação na Adquirente                                                                      |
| IataAmount                     | Valor da taxa IATA                                                 | Numérico (Inteiro)                | N       | O valor da taxa IATA (apenas para setor aéreo), cobrado sobre a transação, em centavos                              |
| OrderId                        | Número do Pedido                                                   | Alfanumérico                      | A       | O Número do Pedido recebido pela adquirente durante a concretização da transação                                    |
| OrderCode                      | Código da operação                                                 | Alfanumérico                      | A       | O código da operação                                                                                                |
| TerminalLogicNumber            | Número lógico do Terminal                                          | Alfanumérico                      | A       | O número do terminal utilizado para efetuar a transação                                                             |
| CaptureDate                    | Data de Captura                                                    | Data                              | D       | A data da captura da transação na Adquirente                                                                        |
| SummaryIdentifierNumber        | Identificador Único do Lote                                        | Numérico (Inteiro  Longo)         | N       | O identificador único do Lote (Resumo de Vendas) na adquirente Cielo                                                |
| InstallmentCount               | Quantidade de Parcelas                                             | Númerico (Inteiro)                | N       | A quantidade de parcelas na qual a transação foi dividida na Adquirente                                             |
| AuthorizationCode              | Código de Autorização                                              | Alfanumérico                      | A       | O código de autorização da transação informado pela adquirente                                                      |
| CaptureMethodId                | Identificador do Meio de  Captura                                  | Numérico (Inteiro)                | N       | O identificador do meio tecnológico utilizado para capturar a transação na Adquirente5                              |
| CaptureMethodDescription       | Descrição do Meio de Captura                                       | Alfanumérico                      | A       | A descrição do meio tecnológico utilizado para capturar a transação na   Adquirente5                                |
| CardBrandId                    | Identificador da Bandeira                                          | Numérico (Inteiro)                | N       | O identificador da bandeira do cartão utilizado para efetuar a  transação6                                          |
| CardBrand                      | Nome da Bandeira                                                   | Alfanumérico                      | A       | O nome da bandeira do cartão utilizado para efetuar a transação6                                                    |
| CardTypeId                     | Identificador do tipo do cartão                                    | Numérico (Inteiro)                | N       | O identificador do tipo do cartão: - 1: Debit - 2: Credit                                                           |
| CardType                       | Tipo de cartão                                                     | Alfanumérico                      | A       | O nome do tipo do cartão utilizado para efetuar a transação                                                         |
| ProductIdentifierCode          | Código de Identificação do   Produto na Cielo                      | Numérico (Inteiro)                | N       | O código que identifica o   Produto da Adquirente Cielo utilizado para efetuar a transação7                         |
| ProductIdentifierDescription   | Descrição do Produto na Cielo                                      | Alfanumérico                      | A       | A descrição do Produto na Adquirente Cielo utilizado para efetuar a  transação7                                     |

1. As informações da adquirente são os dados da venda que o Conciliador recebe dos extratos eletrônicos, o meio de integração da adquirente com os sistemas externos. São a segunda parte da conciliação. O Identificador Único da Transação pode ser utilizado para visualizar a venda no WebSite do Conciliador, preenchendo a URL:   

> https://reconciliation.braspag.com.br/WebSite/Reports/TransactionDetails.aspx?AcquirerTransactionId=[ID]   

Onde o texto [ID] deve ser substituído pelo identificador informado no registro.   

2. Devido à restrições de segurança, o número do cartão será informado de forma mascarada.   
3. Quando uma transação é dividida em uma quantidade de parcelas onde o valor não pode ser distribuído igualmente entre as parcelas, surge a necessidade de colocar um valor extra em uma parcela específica. Esta parcela é chamada de parcela de arredondamento. Como exemplo, podemos adotar uma transação de R$ 100,00 dividida em três parcelas. Se a primeira parcela for a parcela de arredondamento, ela terá o valor de R$ 33,34 – enquanto as duas outras parcelas terão o valor de R$ 33,33.   
4. A taxa de adquirência normalmente é expressa em porcentagem. O campo demonstra essa porcentagem multiplicada por 100. Portanto, se o valor deste campo for expresso como 275, isto indica uma taxa de adquirência de 2,75%.   
5. Tabelas com os meios de captura informados estão disponíveis no Apêndice do Manual.   
6. Uma tabela com as bandeiras disponíveis está disponível no Apêndice do Manual.   
7. Uma tabela com os tipos de produto está disponível no Apêndice do Manual.   

### Registro de Evento

| Campo                       | Nome                                        | Tipo               | Formato | Descrição                                                                                                             |
|-----------------------------|---------------------------------------------|--------------------|---------|-----------------------------------------------------------------------------------------------------------------------|
| EventId                     | Identficador Único do Evento no Conciliador | Identificador Único Global  (GUID)     | G       | O identificador único do do  Evento no Conciliador2                                               |
| EventDate                   | Data do evento                              | Data               | D       | A data em que o evento está previsto para ser realizado, ou a data em que foi realizado (no caso de evento realizado) |
| CategoryId                  | Identificador da Categoria de  Evento       | Numérico (Inteiro) | N       | O identificador da categoria do evento3                                                                               |
| Category                    | Descrição da Categoria de  Evento           | Alfanumérico       | A       | A descrição da categoria do evento3                                                                                   |
| TypeId                      | Identificador do Tipo de Evento             | Numérico (Inteiro) | {N}     | 1 = Realizado<br>2 = Previsto<br>3 = Pendente                                                                         |
| Type                        | Descrição do Tipo de Evento                 | Alfanumérico       | A       | “Preview”, “Realized” ou “Pending” (Previsto, realizado ou pendente)                                                  |
| AffiliationCode             | Código de Afiliação                         | Numérico           | N       | O código de afiliação do estabelecimento no qual o evento foi executado                                               |
| TransactionInstallment      | Parcela da Transação                        | Numérico           | N       | A parcela da transação a qual o evento se refere4                                                                     |
| GrossAmount                 | Valor Bruto                                 | Numérico           | N       | O valor financeiro do evento contemplado, antes da dedução da taxa de adquirência, em centavos                        |
| NetAmount                   | Valor Líquido                               | Numérico           | N       | O valor líquido do evento, após a redução da taxa de adquirência, em centavos                                         |
| TaxAmount                   | Valor da Taxa                               | Numérico           | N       | O valor da taxa de adquirência sobre o evento, em centavos                                                            |
| Bank                        | Banco                                       | Numérico           | N       | O código do banco do domicílio bancário sobre o qual o evento financeiro é ou será lançado                            |
| Agency                      | Agência                                     | Numérico           | N       | O código da agência do domicílio bancário sobre o qual o evento financeiro é ou será lançado                          |
| Account                     | Número da Conta                             | Alfanumérico       | A       | O número da conta do domicílio bancário sobre o qual o evento financeiro é ou será lançado                            |
| AcquirerAdjustCode          | Código do Ajuste                            | Alfanumérico       | A       | O código que identifica o tipo de ajuste (apenas para eventos de ajustes)                                             |
| AcquirerAdjustDescription   | Descrição do Ajuste                         | Alfanumérico       | A       | A descrição do ajuste (apenas para eventos de ajustes)                                                                |
| AnticipationOperationNumber | Número da Operação de  Antecipação na Cielo | Numérico           | N       | O número da Operação de Antecipação (apenas para eventos derivados de antecipações na Cielo)                          |
| OriginalPaymentDate         | Data original de pagamento                  | Data               | D       | A data original para a qual o evento de pagamento estava previsto (apenas para eventos de antecipações)               |
| OriginalPixId|Identificador original gerado|Alfanumérico|A|O identificador inicial gerado no momento da transação.|
|PixId|Identificador secundário gerado|Alfanumérico|A|Identificador gerado, caso ocorra alguma mudança no identificador do Pix.|

## Meios de Captura

### Cielo

| Código/Identificador | Descrição           |
|----------------------|---------------------|
| 1                    | POS                 |
| 2                    | PDV/TEF             |
| 3                    | E-Commerce          |
| 4                    | EDI                 |
| 5                    | ADP/BSP             |
| 6                    | Manual              |
| 7                    | URA/CVA             |
| 8                    | Mobile              |
| 9                    | Moedeiro Eletrônico |

### Amex

| Código/Identificador | Descrição                           |
|----------------------|-------------------------------------|
| 1                    | Rede AE – Manual                    |
| 2                    | Rede AE – EDI                       |
| 3                    | Rede AE – BSP                       |
| 4                    | Rede AE – TEF                       |
| 11                   | Cielo – POS                         |
| 12                   | Cielo – TEF                         |
| 13                   | Cielo – Autorização Manual          |
| 14                   | Cielo – URA                         |
| 15                   | Cielo – EDI                         |
| 16                   | Cielo – GDS                         |
| 17                   | Cielo – E-Commerce                  |
| 18                   | Cielo – Mobile                      |
| 99                   | Legado – Versão anterior do extrato |

### Rede

| Código/Identificador | Descrição        |
|----------------------|------------------|
| 1                    | Manual           |
| 2                    | POS              |
| 3                    | PDV              |
| 4                    | TO               |
| 5                    | Internet         |
| 6                    | Leitor de Trilha |
| 9                    | Outros           |

### GetNet

| Código/Identificador | Descrição |
|----------------------|-----------|
| 0                    | TEF       |
| 1                    | POS       |
| 2                    | Manual    |
| 3                    | Internet  |

### Outros

A tabela abaixo é valida para:

* Stone
* Global Payments
* First Data
* Ticket
* Sodexo

**Observação:** Para a adquirente Losango o campo é enviado “vazio"

| Código/Identificador | Descrição  |
|----------------------|------------|
| 0                    | N/D        |
| 1                    | N/A        |
| 2                    | POS        |
| 3                    | PDV/TEF    |
| 4                    | E-Commerce |
| 5                    | EDI        |
| 6                    | Manual     |
| 7                    | Mobile     |
| 8                    | Outros     |

## Bandeiras

| Código/Identificador | Descrição               |
|----------------------|-------------------------|
| 0                    | Desconhecido/Indefinido |
| 1                    | VISA                    |
| 2                    | Mastercard              |
| 3                    | ELO                     |
| 4                    | Diners                  |
| 5                    | Cabal                   |
| 6                    | Hipercard               |
| 7                    | Amex                    |
| 8                    | Sicred                  |
| 9                    | Cup                     |
| 10                   | Agiplan                 |
| 11                   | Banesecard              |
| 12                   | SoroCred                |
| 13                   | CredSystem              |
| 14                   | Esplanada               |
| 15                   | CredZ                   |
| 16                   | Losango                 |
| 17                   | AVista                  |
| 18                   | Hiper                   |
| 19                   | JCB                     |
| 20                   | Aura                    |
| 21                   | Alelo                   |
| 22                   | Ticket                  |
| 23                   | Sodexo                  |

## Tipos de Produtos

### Cielo

| Código/Identificador | Descrição                          |
|----------------------|------------------------------------|
| 1                    | Agiplan crédito à vista            |
| 2                    | Agiplan parcelado loja             |
| 3                    | Banescard crédito à vista          |
| 4                    | Banescard parcelado loja           |
| 5                    | Esplanada crédito à vista          |
| 6                    | CredZ crédito à vista              |
| 7                    | Esplanada parcelado loja           |
| 8                    | Credz parcelado loja               |
| 9                    | Elo Crediário                      |
| 10                   | MasterCard crédito à vista         |
| 11                   | Maestro                            |
| 12                   | MasterCard parcelado loja          |
| 13                   | Elo Construcard                    |
| 14                   | Elo Agro Débito                    |
| 15                   | Elo Agro Custeio                   |
| 16                   | Elo Agro Investimento              |
| 17                   | Elo Agro Custeio + Débito          |
| 18                   | Elo Agro Investimento + Débito     |
| 19                   | Discover crédito à vista           |
| 20                   | Diners crédito à vista             |
| 21                   | Diners parcelado loja              |
| 22                   | Agro Custeio + Electron            |
| 23                   | Agro Investimento + Electron       |
| 24                   | FCO Investimento                   |
| 25                   | Agro Electron                      |
| 26                   | Agro Custeio                       |
| 27                   | Agro Investimento                  |
| 28                   | FCO Giro                           |
| 29                   | Visa crediário no crédito          |
| 30                   | Visa parcelado cliente             |
| 31                   | Pré-pago Visa Débito               |
| 32                   | Pré-pago Visa Crédito              |
| 33                   | JCB                                |
| 35                   |Pré-pago Visa Carnê                 |
| 36                   | Saque com cartão de Débito VISA    |
| 37                   | Flex Car Visa Vale                 |
| 38                   | CredSystem crédito à vista         |
| 39                   | CredSystem parcelado loja          |
| 40                   | Visa Crédito à Vista               |
| 41                   | Visa Electron Débito à Vista       |
| 42                   | Visa Pedágio                       |
| 43                   | Visa Parcelado Loja                |
| 44                   | Visa Electron Pré-Datado           |
| 45                   | Alelo Refeição (Bandeira Visa/Elo) |
| 46                   |Alelo Alimentação (Visa)            |
| 58                   | Alelo Multibenefícios              |
| 59                   | Alelo Auto                         |
| 60                   | Sorocred débito à vista            |
| 61                   | Sorocred crédito à vista           |
| 62                   | Sorocred parcelado loja            |
| 64                   | Visa Crediário                     |
| 65                   | Alelo Refeição (Elo)               |
| 66                   | Alelo Alimentação (Elo)            |
| 67                   | Visa Capital de Giro               |
| 68                   | Visa Crédito Imobiliário           |
| 69                   | Alelo Cultura                      |
| 70                   | Elo crédito a vista                |
| 71                   | Elo débito à vista                 |
| 72                   | Elo parcelado loja                 |
| 73                   | Pré-pago Visa Cash                 |
| 79                   | Pagamento Carnê Visa Electron      |
| 80                   | Visa Crédito Conversor de Moeda    |
| 81                   | Mastercard Crédito Especializado (*)|
| 82                   | Amex crédito à vista               |
| 83                   | Amex parcelado loja                |
| 84                   | Amex parcelado banco               |
| 89                   | Elo Crédito Imobiliário            |
| 91                   | Elo Crédito Especializado (*)      |
| 94                   | Banescard Débito                   |
| 96                   | Cabal crédito à vista              |
| 97                   | Cabal débito à vista               |
| 98                   | Cabal parcelado loja               |
| 107                  | Pré-pago Master Carnê              |
| 110                  | Pré-pago Master Crédito            |
| 111                  | Pré-pago Master Débito             |
| 161                  | Hiper crédito à vista              |
| 162                  | Hiper débito à vista               |
| 163                  | Hiper parcelado loja|
| 164                  | Hipercard crédito à vista|
| 165                  | Hipercard parcelado loja|
| 200                  | Verdecard crédito a vista|
| 201                  | Verdecard parcelado loja|
| 202                  | Nutricash Alimentação|
| 203                  | Nutricash Refeição|
| 204                  | Nutricash Multibenefícios|
| 205                  | Nutricash Combustível|
| 206                  | Ben Alimentação|
| 207                  | Ben Refeição|
| 269                  | Pré-pago Elo Carnê|
| 270                  | Pré-pago Elo Crédito|
| 271                  | Pré-pago Elo Débito|
| 314                  | Ourocard Agro débito|
| 315                  | Ourocard Agro custeio|
| 316                  | Ourocard Agro investimento|
| 317                  | Ourocard Agro custeio + débito|
| 318                  | Ourocard Agro investimento + débito|
| 321                  | Mastercard crediário no crédito|
| 322                  | Mastercard parcelado cliente|
| 324                  | Elo parcelado cliente|
| 330                  | Elo crediário no crédito|
| 342                  | Mastercard Pedágio|
| 377                  | Elo Carnê|
| 378                  | Mastercard Carnê|
| 380                  | Mastercard Crédito Conversor de Moeda|
| 433                  | JCB parcelado loja|

### Getnet

| Código/Identificador | Descrição                        |
|----------------------|----------------------------------|
| 1                    | Título                           |
| 2                    | Convênio                         |
| 3                    | Crédito Digital                  |
| 9 | Elo crediário |
| 11 | Mastercard débito |
| 12 | Mastercard crédito |
| 41 | Visa débito |
| 43 | Visa crédito |
| 64 | Visa crediário |
| 71 | Elo débito |
| 72 | Elo crédito |
| 83 | Amex crédito |
| 165 | Hiper/Hipercard crédito |
| 321 | Mastercard crediário |
| 378 | Mastercard débito - Pagamento carnê |
| 507 | Hiper/Hipercard crediário |
| 509 | Visa débito - Pagamento carnê |
| 510 | Elo débito - Pagamento carnê |
| 511 | Mastercard crédito BNDES |
| 512 | Visa crédito BNDES |
| 513 | Amex crediário |
| 10074 | Titulo |
| 10075 | Convênio |
| 10076 | Crédito Digital |
| 10077 | Cupom Eletrônico |
| 10078 | Cupom Papel |
| 10079 | Pagamento Recorrente|
| 00/CE                | Cupom Eletrônico                 |
| CP                   | Cupom Papel                      |
| SM                   | Cartão de Crédito MASTERCARD     |
| SV                   | Cartão de Crédito VISA           |
| SR                   | Cartão de Débito MAESTRO         |
| SE                   | Cartão de Débito VISA ELECTRON   |
| PV                   | Pagamento Carnê – Débito VISAELECTRON |
| PM                   | Pagamento Carnê – Débito MAESTRO |
| PR                   | Pagamento Recorrente             |

### Redecard

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 3 | EEVC Banescard crédito à vista |
| 3 | EEFI Banescard crédito à vista |
| 4 | EEVC Banescard parcelado loja |
| 4 | EEFI Banescard parcelado loja |
| 6 | EEVC Credz crédito à vista |
| 6 | EEFI Credz crédito à vista |
| 8 | EEVC Credz parcelado loja |
| 8 | EEFI Credz parcelado loja |
| 10 | EEFI Mastercard crédito à vista |
| 10 | EEVC Mastercard crédito à vista |
| 11 | EEVD Maestro débito |
| 11 | EEVD Maestro |
| 12 | EEFI Mastercard parcelado loja |
| 12 | EEVC Mastercard parcelado loja |
| 20 | EEVC Diners crédito à vista |
| 20 | EEFI Diners crédito à vista |
| 21 | EEFI Diners parcelado loja |
| 21 | EEVC Diners parcelado loja |
| 33 | EEFI JCB |
| 33 | EEVD JCB |
| 33 | EEVC JCB |
| 38 | EEVC Credsystem crédito à vista |
| 38 | EEFI Credsystem crédito à vista |
| 39 | EEVC Credsystem parcelado loja |
| 39 | EEFI Credsystem parcelado loja |
| 40 | EEFI Visa crédito à vista |
| 40 | EEVC Visa crédito à vista |
| 41 | EEVD Visa débito |
| 42 | EEFI Visa parcelado loja |
| 43 | EEVC Visa parcelado loja |
| 60 | EEVC Sorocred crédito à vista |
| 60 | EEFI Sorocred crédito à vista |
| 62 | EEVC Sorocred parcelado loja |
| 62 | EEFI Sorocred parcelado loja |
| 70 | EEVC Elo crédito a vista |
| 70 | EEFI Elo crédito a vista |
| 71 | EEVD Elo débito à vista |
| 72 | EEVC Elo parcelado loja |
| 72 | EEFI Elo parcelado loja |
| 82 | EEVC Amex crédito à vista |
| 82 | EEFI Amex crédito à vista |
| 83 | EEVC Amex parcelado loja |
| 83 | EEFI Amex parcelado loja |
| 94 | EEVD Banescard Débito |
| 96 | EEFI Cabal crédito à vista |
| 96 | EEVC Cabal crédito à vista |
| 97 | EEVD Cabal débito |
| 98 | EEVC Cabal parcelado loja |
| 98 | EEFI Cabal parcelado loja |
| 161 | EEVC Hiper crédito à vista |
| 161 | EEFI Hiper crédito à vista |
| 162 | EEVD Hiper débito à vista |
| 163 | EEVC Hiper parcelado loja |
| 163 | EEFI Hiper parcelado loja |
| 164 | EEFI Hipercard crédito à vista |
| 164 | EEVC Hipercard crédito à vista |
| 165 | EEVC Hipercard parcelado loja |
| 165 | EEFI Hipercard parcelado loja |
| 433 | EEFI JCB |
| 433 | EEVC JCB |
| 501 | EEVD Hipercard débito |
| 506 | EEVD Diners débito |

### Stone

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 1                    | Crédito Visa       |
| 2                    | Crédito Master     |
| 4                    | Crédito Elo        |
| 10                   | Mastercard crédito à vista |
| 11                   | Mastercard débito |
| 12                   | Mastercard crédito parcelado |
| 15                   | Crédito Hipercard  |
| 29                   | Visa Crediário
| 30                   | Visa parcelado cliente
| 35                   | Mastercard Maestro |
| 36                   | Visa Electron      |
| 38                   | Débito Elo         |
| 39                   | Débito Hipercard   |
| 40                   | Visa crédito à vista |
| 41                   | Visa débito |
| 43                   | Visa crédito parcelado |
| 70                   | Elo crédito à vista |
| 71                   | Elo débito |
| 72                   | Elo crédito parcelado |
| 82                   | Amex crédito à vista |
| 83                   | Amex crédito parcelado |
| 84                   | Amex parcelado banco |
| 96                   | Cabal crédito à vista |
| 97                   | Cabal débito |
| 98                   | Cabal crédito parcelado |
| 164                  | Hipercard crédito à vista |
| 165                  | Hipercard crédito parcelado |
| 321                  | Mastercard crediário |
| 322                  | Mastercard parcelado cliente |
| 324                  | Elo parcelado cliente |
| 330                  | Elo Crediário |
| 501                  | Hipercard débito |
| 502                  | Amex débito |
| 503                  | Cabal débito |
| 504                  | Cabal crédito parcelado |
| 505                  | Cabal crédito à vista |
| 507                  | Hipercard crediário |
| 513                  | Amex crediário |

### Global Payments

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 1                    | Crédito Visa       |
| 2                    | Crédito Master     |
| 35                   | Mastercard Maestro |
| 36                   | Visa Electron      |

### First Data

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 1                    | Crédito Visa       |
| 2                    | Crédito Master     |
| 4                    | Crédito Elo        |
| 11                   | Crédito Cabal      |
| 35                   | Mastercard Maestro |
| 36                   | Visa Electron      |
| 37                   | Débito Cabal       |
| 38                   | Débito Elo         |

### Ticket

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 24                   | Ticket Refeição    |
| 25                   | Ticket Alimentação |
| 26                   | Ticket Parceiro    |
| 27                   | Ticket Cultura     |

### Sodexo

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 28                   | Sodexo Refeição    |
| 29                   | Sodexo Alimentação |
| 30                   | Sodexo Gift        |
| 31                   | Sodexo Premium     |
| 32                   | Sodexo Cultura     |

## Categorias de Evento

|Identificador| Descrição|
|:-----------:|---|
|1| Ajuste|
|2| POS|
|3| Captura|
|4| Pagamento|
|5| Pgto. Lote|
|6| Aceleração|
|7| Desagendamento|
|8| Estorno|
|9| Chargeback|
|10| Antecipação|
|11| Antecip. Lote|
|12| Ajuste Lote|
|13| Reagendamento|
|14| Custo de Operação de Antecipação|
|15| Valor Retido|
|16| Pagamento de Valor Retido|
|17| Débito de Valor Retido|
|18| Ajustes Antecipados|
|19| Arredondamento de Parcelas|
|20| Estorno Antecipado|
|21| Ajuste Indefinido|
|22| Débito Acumulado|
|23| Pagamento de Vendas Antecipadas|
|24| Débito de Antecipação de Vendas|
|25| Pagamento de Aceleração Antecipada|
|26| Débito de Antecipação de Aceleração|
|27| Credit Voucher|
|28| Antecipação de Credit Voucher|
|29| Antecipação de Chargeback|
|30| Antecipação de Aluguel de POS|
|31| Antecipação de Ajustes Lote|
|32| Antecipação de Estornos Lote|
|33| Antecipação de Chargeback Lote|
|34| Débito de Cessão|
|35| Débito de Gravame|
|36| Cessão fumaça|
|37| Crédito de Cessão|
|38| Débito/crédito compensação de valores|
|39| Estorno débito/crédito de cessão|
|40| Estorno débito/crédito de gravame|
|41| Débito/crédito compensação cancelamento de transação em operação|
|42| Débito/crédito de penhora|
|43| Estorno de crédito/débito de penhora|
|44| Débito/crédito compensação cancelamento em operação|
|45| Crédito de Gravame|

## Webservice Conciliador    

Webservice é uma solução para integrar aplicações.
Por meio dele, qualquer sistema pode se conectar para consultar ou inserir dados. Atualmente no Webservice do Conciliador é possível enviar o arquivo de vendas externas e baixar o conteúdo dos Arquivos de Fluxo de Caixa.    

Inicialmente o acesso deverá ser liberado pela equipe de operações, através do e-mail, senha e o cadastro dos IPs informados pelo estabelecimento.    

O Webservice está disponível através da URL:

> https://reconciliation.braspag.com.br/WebServices/ReconciliationFilesWebService.asmx   

**Método:** GetExportedFileV2

### Request

``` xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rec="https://reconciliation.braspag.com.br">   
   <soapenv:Header/>   
   <soapenv:Body>   
      <rec:GetReconciliationFile>   
         <rec:request>   
            <rec:RequestId>[Guid aleatório]</rec:RequestId>   
            <rec:RequestingUserName>[Login do usuário da loja]</rec:RequestingUserName>   
            <rec:MerchantId>[Identificador da loja, fornecido pela Braspag]</rec:MerchantId>   
            <rec:AcquirerId>[Identificador da adquirente]</rec:AcquirerId>   
            <rec:RequestingPassword>[Senha do usuário da loja]</rec:RequestingPassword>   
            <rec:ReferenceDate>[Data de referência do arquivo]</rec:ReferenceDate>   
            <rec:FileExtensionType>[Extensão do arquivo]</rec:FileExtensionType>   
            <rec:FileType>[Tipo do arquivo]</rec:FileType>   
         </rec:request>   
      </rec:GetReconciliationFile>   
   </soapenv:Body>  
```

| Descritor          | Significado                                | Exemplo                                              |
|--------------------|--------------------------------------------|------------------------------------------------------|
| RequestId          | Identificador Único Global (GUID)          | 4749e676-2507-442da1c6c25c08e2d2af                   |
| RequestingUserName | Login do usuário da loja                   | user@braspag.com.br                                  |
| MerchantId         | Identificador da loja no Conciliador       | 123                                                  |
| AcquirerId         | Identificador da adquirente                | 1=Cielo<br>2=Rede<br>3=Amex<br>4=Losango<br>5=Getnet |
| RequestingPassword | Senha do usuário da loja                   | Braspag@2015                                         |
| ReferenceDate      | Data de referência do Arquivo (yyyy-mm-dd) | 12/06/2015                                           |
| FileExtensionType  | Formato do Arquivo                         | 1=CSV <br> 2=XML                                     |
| FileType           | Tipo de Arquivo                            | 1=Arquivo de Conciliação                             |

### Response

``` xml

--Bem sucedido

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchemainstance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">    <soap:Body>   
      <GetReconciliationFileResponse xmlns="https://reconciliation.braspag.com.br">   
         <GetReconciliationFileResult>   
            <CorrelatedId>124be5db-a809-47e1-b456-1f2e103caa17</CorrelatedId>   
            <Success>true</Success>               <ErrorReportCollection/>   
            <FileContent> QXJxdWl2byBkZSB0ZXN0ZSBjb25jaWxpYWRvcg==</FileContent>   
         </GetReconciliationFileResult>   
      </GetReconciliationFileResponse>   
   </soap:Body>   
</soap:Envelope>   
```

``` xml

-- Mal Sucedida   

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchemainstance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">    <soap:Body>   
      <GetReconciliationFileResponse xmlns="https://reconciliation.braspag.com.br">   
         <GetReconciliationFileResult>   
            <CorrelatedId>124be5db-a809-47e1-b456-1f2e103caa17</CorrelatedId>   
            <Success>false</Success>   
            <ErrorReportCollection>   
               <ErrorReport>   
                  <Code>44</Code>   
                  <Message>Acesso não autorizado do IP para a loja fornecida na requisição.</Message></ErrorReport>   
            </ErrorReportCollection>   
         </GetReconciliationFileResult>   
      </GetReconciliationFileResponse>   
   </soap:Body>   
</soap:Envelope>   
```

| Descritor             | Descrição                                                                                      | Exemplo                                                                                                                               |
|-----------------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| CorrelatedId          | GUID enviado na requisição                                                                     | 4749e676-2507-442d-a1c6-c25c08e2d2af                                                                                                  |
| Success               | Indica se a operação foi concluída.                                                            | false/true                                                                                                                            |
| ErrorReportCollection | Coleção de erros que será  retornada em caso de Sucess="false"                                 | ErrorReport.Code = 39,ErrorReport.Message  = “Erro interno do sistema”.                                                               |
| ErrorReport.Code      | Código de erros para  Sucess="false"                                                           | 39/44/46                                                                                                                              |
| ErrorReport.Message   | Mensagem de erro correspondente ao código informado                                            | 39 - Erro interno do sistema.<br>44 - Acesso não autorizado, IP não cadastrado<br>46 - Usuário incorreto, e/ou não tem acesso a loja. |
| FileContent           | Para requisições com Sucess="true", será enviado o conteúdo binário codificado na base64 UTF-8 | QXJxdWl2byBkZSB0ZXN0ZSBjb25jaWxpYWRvcg==                                                                                              |

## Apêndice

### Utilizando o arquivo de Schema Definition (XSD)   

Uma forma de integração com o Arquivo de Fluxo de Caixa do Conciliador no formato XML de maneira programada ou automática, é feita através do arquivo de definição de esquema, ou `XML Schema Definition File`.   

O XML Schema é uma linguagem baseada no formato XML para definição de regras de validação ("esquemas") em documentos no formato XML. Foi a primeira linguagem de esquema para XML que obteve recomendação por parte do **W3C**. Esta linguagem é uma alternativa ao **DTD**, cuja sintaxe não é baseada no formato XML.   
Foi amplamente utilizado para desenvolvimento da NF-e (Nota Fiscal Eletrônica) Brasileira.   

Um arquivo contendo as definições na linguagem XML Schema é chamado de **XSD (XML Schema Definition)**, este descreve a estrutura de um documento XML.   

O conciliador possui arquivos XSD para cada um de seus arquivos em XML. Desta forma, é possível, programaticamente compreender a estrutura do XML, supondo que o arquivo XSD seja corretamente interpretado pela ferramenta.   

Neste manual, não serão citadas todas as formas de se trabalhar com o arquivo, entretanto, podemos demonstrar, através da utilização de uma ferramenta provida pela IDE de desenvolvimento Visual Studio, como gerar, programaticamente uma Classe em código-fonte que pode representar o conteúdo do arquivo.   

Desta forma, será possível deserializar o conteúdo de qualquer arquivo dentro desta classe, e com isto utilizar os arquivos de conciliação em um sistema com código orientado a objetos.   

Criando a classe do arquivo por meio do arquivo de definição de esquema   
Com os arquivos de definição de esquema, você deverá utilizar uma ferramenta que pode ser acessada à partir da linha de comando da IDE do Visual Studio (Visual Studio Command Prompt). O nome do executável é “xsd” (sem aspas).   

O executável possui uma série de parâmetros para customizar a geração da sua classe a partir do arquivo de definição de esquema. Caso você queira ver todas as opções, consulte a URL https://msdn.microsoft.com/en-us/library/x6c1kb0s(v=VS.100).aspx.   
No exemplo abaixo, utilizamos o comando para gerar a classe da forma mais básica. Acesse o diretório onde os arquivos de esquemas estão salvos(normalmente são dois arquivos, “ConciliationFile.xsd” e “Guid.xsd”), usando o comando CD do DOS.   Uma vez dentro deste diretório, basta executar o comando conforme abaixo:
xsd  

ConciliationFile.xsd Guid.xsd /classes   

Um exemplo do efeito disto na linha de commando é demonstrado na imagem abaixo. A classe gerada terá o nome
**“ConciliationFile_Guid.cs”**.
Esta classe pode ser inserida em um projeto na linguagem C#, e com algumas alterações pode representar o conteúdo do arquivo por meio de deserialização.   
Consulte o suporte de sua linguagem de desenvolvimento para verificar se a mesma possui algum tipo de automatização para interpretar a leitura do arquivo em XML. Isto pode facilitar seu processo de desenvolvimento e aprendizado do layout do mesmo

![]({{ site.baseurl_root }}/images/braspag/conciliador/xml20.png)

# Arquivos Fluxo de Caixa 2.0 - CSV

Este manual tem como objetivo orientar o desenvolvimento do Arquivo de Fluxo de Caixa da plataforma conciliador no formato CSV, e a extração do seu conteúdo através do Webservice.

## Legenda para os tipos de formato

| Descritor | Significado                         | Exemplo                              |
|-----------|-------------------------------------|--------------------------------------|
| N         | Um ou mais algarismos (0 a 9)       | 243                                  |
| A         | Um ou mais caracteres alfanuméricos | Texto                                |
| {N}       | Um  único algarismo (0 a 9)         | 2                                    |
| {A}       | Um único caractere alfanumérico     | B                                    |
| HH        | Hora em campo data/hora (0 a 23)    | 22                                   |
| mm        | Minuto em campo data/hora (0 a 59)  | 23                                   |
| ss        | Segundo em campo data/hora (0 a 59) | 35                                   |
| dd        | Dia em campo data/hora (1 a 31)     | 28                                   |
| MM        | Mês em campo data/hora (1 a 12)     | 10                                   |
| yyyyy     | Ano em campo data/hora              | 2015                                 |
| G         | Identificador Único Global (GUID)1  | 4749e676-2507-442d-a1c6-c25c08e2d2af |

1. Um Identificador Único Global ou GUID (do inglês, Globally Unique IDentifier) é um tipo especial de identificador utilizado em aplicações de software para providenciar um número de referência padrão mundial. Como, por exemplo, em uma definição de referência interna para um tipo de ponto de acesso em uma aplicação de software ou para a criação de chaves únicas em um banco de dados. O número total de chaves únicas (2128 ou ~3.4×1038) é tão grande que a probabilidade do mesmo número se repetir é muito pequena. Considerando que o Universo Observável contém 5x1022 estrelas, cada estrela poderia ter ~6.8×1015 dos seus próprios GUIDs. Caso seu sistema não reconheça o formato GUID, poderá trata-lo como texto

## Informações sobre as adquirentes

O principal insumo do Conciliador são os extratos eletrônicos gerados pelas adquirentes. Devido a isso, podem existir particularidades entre cada uma.      
Abaixo a estimativa de dias em que a adquirente envia os eventos no extrato eletrônico.    

### Prazo de registro no extrato eletrônico (Tabela II)

| Adquirente    | Captura                                         | Pagamento       | Observação                                                                                                                                                  |
|---------------|-------------------------------------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cielo         | D+1                                             | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Rede          | D+1                                             | D -1            | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Amex          | Entre D+1 à  D+2                                | Entre D-4 à D-6 | *Desconsiderar do prazo a segunda feira, pois os extratos  não são gerados. Nestes dias o arquivo do Conciliador será disponibilizado somente com o header. |
| GetNet        | D+1                                             | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Ticket        | D+30 ajustada ao dia de recebimento do cliente  | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Sodexo        | D+30 ajustada ao dia de recebimento do cliente  | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| Stone         | Cartão de Débito: D+1 - Cartão de Crédito: D+30 | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| GlobalCollect | Cartão de Débito: D+1 - Cartão de Crédito: D+30 |                 | Pagamentos são realizados de Segunda à Sexta                                                                                                                |
| FirstData     | Cartão de Débito: D+1 - Cartão de Crédito: D+30 | D               | Pagamentos são realizados de Segunda à Sexta                                                                                                                |

### Registro Header (Tabela III)   

| Campo                                  | Tipo               | Formato        | Descrição                                                                                                                              |
|----------------------------------------|--------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Identificador do Registro              | Numérico (Inteiro) | N              | Constante com valor 1                                                                                                                  |
| Identificador da Loja                  | Numérico (Inteiro) | N              | Contém o identificador único da loja no Conciliador                                                                                    |
| Identificador da Adquirente            | Numérico (Inteiro) | {N}            | 1 = Cielo<br>2 = Redecard<br>3 = Amex<br>5 = Getnet<br>6 = Ticket<br>7 = Stone<br>8 = Sodexo<br>9 = Global Payments<br>10 = First Data |
| Geração do arquivo                     | Data/Hora          | ddMMyyyyHHmmss | Contém a data e a hora da geração do arquivo pelo Conciliador                                                                          |
| Período inicial                        | Data               | ddMMyyyy       | Data inicial do período de conciliação contemplado pelo arquivo                                                                        |
| Período final                          | Data               | ddMMyyyy       | Data final do período de conciliação contemplado pelo arquivo                                                                          |
| Número sequencial                      | Numérico (Inteiro) | N              | Número sequencial que indica a ordem de processamento dos arquivos diários                                                             |
| Identificador do tipo de processamento | Numérico (Inteiro) | {N}            | 1 = Arquivo diário  <br> 2 = Arquivo reprocessado                                                                                      |
| Descrição do tipo de processamento     | Alfanumérico       | A              | “Daily” ou “Reprocessed” (Diário ou reprocessado)                                                                                      |
| Versão do arquivo                      | Alfanumérico       | A              | Versão do arquivo (“2.0”)                                                                                                              |

### Registro de Transação Conciliada (Tabela IV)

| Campo                                | Tipo               | Formato | Descrição                          |
|--------------------------------------|--------------------|---------|------------------------------------|
| Identificador do Registro            | Numérico (Inteiro) | N       | Constante com valor  2             |
| Identificador do tipo de conciliação | Numérico (Inteiro) | {N}     | 1   = Automática  <br>2   = Manual |
| Descrição do tipo de conciliação     | Alfanumérico       | A       | “Automatic” ou  “Manual”           |

### Registro de Conciliação Manual (Tabela V)

| Campo                                | Tipo               | Formato | Descrição                          |
|--------------------------------------|--------------------|---------|------------------------------------|
| Identificador do Registro            | Numérico (Inteiro) | N       | Constante com valor  9             |
| Usuario de conciliação manual        | Alfanumérico)      | A       | Login do usuario que efetuou a conciliação manual |
| Data e hora da conciliação manual    | Data/hora          | ddmmyyyyhhmmss       | Data e hora sm que a conciliação manual foi efeturada pelo usuário  |

### Registro de Informação de Venda (Tabela VI)

| Campo                                           | Tipo                               | Formato  | Descrição                                                                                                           |
|-------------------------------------------------|------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------|
| Identificador do Registro                       | Numérico (Inteiro)                 | N        | Constante com valor 3                                                                                               |
| Identificador Único da  Venda no Conciliador    | Identificador Único  Global (GUID) | G        | Identificador único do Conciliador para as informações de venda1                                                    |
| Identificador da Venda no  Sistema Transacional | Alfanumérico                       | A        | Identificador da Venda obtido a partir do Sistema transacional no qual a transação foi processada com a Adquirente² |
| Identificador da Filial                         | Alfanumérico                       | A        | Identificador da Filial da loja que processou a venda3                                                              |
| Código de Afiliação                             | Alfanumérico                       | A        | O código de afiliação da adquirente, informado nos dados da venda do cliente                                        |
| Número do Pedido                                | Alfanumérico                       | A        | O número do pedido associado à venda no lojista4                                                                    |
| Código de Autorização                           | Alfanumérico                       | A        | O Código de Autorização da transação que o Lojista recebeu da Adquirente                                            |
| Data da Venda                                   | Data                               | ddMMyyyy | A data em que foi realizada a venda no lojista                                                                      |
| Data da Captura                                 | Data                               | ddMMyyyy | A data da captura recebida pelo lojista                                                                             |
| Valor da transação                              | Numérico (Inteiro)                 | N        | O valor da transação em centavos5                                                                                   |
| Número de parcelas                              | Numérico (Inteiro)                 | N        | A quantidade de parcelas na qual a transação foi dividida                                                           |
| Nome do comprador                               | Alfanumérico                       | A        | O nome do comprador do produto                                                                                      |
| Documento do comprador                          | Alfanumérico                       | A        | Documento de identificador do comprador (RG, CPF, etc.)                                                             |
| E-mail do comprador                             | Alfanumérico                       | A        | Endereço de e-mail do comprador                                                                                     |
| Número do cartão                                | Alfanumérico                       | A        | Número do cartão (crédito ou débito) utilizado na venda                                                             |
| TID                                             | Alfanumérico                       | A        | Identificador da transação e-commerce na Cielo, recebido pelo lojista                                               |
| NSU                                             | Número                             | N        | Número sequencial da transação na  Adquirente, recebido pelo lojista                                                |
| Valor da taxa IATA                              | Número                             | N        | Valor da taxa IATA (apenas para setor aéreo), em centavos                                                           |
| Tipo de Integração                              | Alfanumérico                       | A        | Nome do meio de pagamento utilizado no caso da transação efetuada no  gateway Pagador                               |

1. As informações de venda são as transações enviadas pelo cliente do mundo físico, ou do  gateway/sistema transacional utilizado para efetuar as transações. São a primeira parte da conciliação. O Identificador Único da Venda pode ser utilizado para visualizar a venda no WebSite do Conciliador, preenchendo a URL:   

> https://reconciliation.braspag.com.br/WebSite/Reports/TransactionDetails.aspx?SaleTransactionId=[ID]

Onde o texto [ID] deve ser substituído pelo identificador informado no registro.   

2. O identificador da Venda no Sistema Transacional é o Identificador da Transação que é utilizado pelo sistema que efetuou a venda, seja ele um Gateway ou Sistema de Caixa/POS. Este valor pode ou não ser fornecido durante a importação da venda para o Conciliador. É de responsabilidade do cliente a decisão de informá-lo ou não.   
3. O identificador da Filial deve ser fornecido pelo cliente toda vez que a importação de uma venda é realizada para o Conciliador. Apesar de não haver restrições para o formato do identificador da filial (campo Alfanumérico), é obrigatório que cada Filial possua um identificador único.   
4. O Gerenciamento do Número do Pedido é de inteira responsabilidade do lojista. O Conciliador apenas armazena esta informação, mas nenhum tipo de validação é feito.   
5. O Valor da Transação não é o valor das parcelas. O valor informado aqui é o valor integral da mesma, da forma como informado pelo cliente/gateway.   

### Registro de Informação da Adquirente (Tabela VII)

| Campo                                                              | Tipo                               | Formato  | Descrição                                                                                                            |
|--------------------------------------------------------------------|------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------|
| Identificador do Registro                                          | Numérico (Inteiro)                 | N        | Constante com valor 4                                                                                                |
| Identificador Único da  Transação no Conciliador                   | Identificador Único  Global (GUID) | G        | Identificador Único das  informações da Adquirente                                                                   |
| Código de Afiliação                                                | Numérico                           | N        | O Código de Afiliação informado na venda do Extrato.                                                                 |
| Número do Lote                                                     | Numérico (Inteiro)                 | N        | O número do Lote (Resumo de Vendas) ao qual a transação pertence na Adquirente.                                      |
| Número do Cartão                                                   | Alfanumérico                       | A        | O número do cartão usado na compra2                                                                                  |
| Data da Venda                                                      | Data                               | ddMMyyyy | A data em que a venda foi efetuada, segundo as informações do extrato.                                               |
| Valor bruto da Transação                                           | Numérico (Inteiro)                 | N        | Valor bruto da transação em centavos.                                                                                |
| Valor da taxa de adquirência deduzido da transação                 | Numérico (Inteiro)                 | N        | Valor deduzido do valor bruto da transação como taxa de adquirência, em centavos.                                    |
| Valor líquido da transação                                         | Numérico (Inteiro)                 | N        | Valor que será recebido pelo lojista, após a dedução da taxa de Adquirência sobre o valor bruto, em centavos.        |
| Valor bruto da parcela de arredondamento                           | Numérico (Inteiro)                 | N        | Valor bruto da parcela de arredondamento, em centavos3                                                               |
| Valor da taxa de adquirência deduzido da parcela de arredondamento | Numérico (Inteiro)                 | N        | Valor deduzido do valor bruto da parcela de arredondamento como taxa de adquirência, em centavos.                    |
| Valor líquido da parcela de arredondamento                         | Numérico (Inteiro)                 | N        | Valor que será recebido pelo lojista como valor da parcela de arredondamento, após a dedução da taxa de adquirência. |
| Valor bruto das demais parcelas                                    | Numérico (Inteiro)                 | N        | Valor bruto das demais parcelas da transação, em centavos.                                                           |
| Valor da taxa de adquirência deduzido das demais parcelas          | Numérico (Inteiro)                 | N        | Valor deduzido do valor bruto das demais parcelas como taxa de adquirência, em centavos.                             |
| Valor líquido das demais parcelas                                  | Numérico (Inteiro)                 | N        | Valor que será recebido pelo lojista como valor das demais parcelas, após a dedução da taxa de adquirência.          |
| Taxa de adquirência                                                | Numérico (Inteiro)                 | N        | A taxa de adquirência sobre a transação                                                                              |
| TID                                                                | Alfanumérico                       | A        | O identificador da transação ecommerce na adquirente Cielo.                                                          |
| NSU                                                                | Numérico (Inteiro)                 | N        | O número sequencial da transação na Adquirente                                                                       |
| Valor da taxa IATA                                                 | Numérico (Inteiro)                 | N        | O valor da taxa IATA (apenas para setor aéreo), cobrado sobre a transação, em centavos.                              |
| Número do Pedido                                                   | Alfanumérico                       | A        | O Número do Pedido recebido pela adquirente durante a concretização da transação.                                    |
| Número lógico do Terminal                                          | Alfanumérico                       | A        | O número do terminal utilizado para efetuar a transação.                                                             |
| Código da operação                                                 | Alfanumérico                      | A       | O código da operação                                                                                                |
| Data de Captura                                                    | Data                               | ddMMyyyy | A data da captura da transação na Adquirente.                                                                        |
| Identificador Único do Lote                                        | Numérico (Inteiro  Longo)          | N        | O identificador único do Lote (Resumo de Vendas) na adquirente Cielo                                                 |
| Quantidade de Parcelas                                             | Númerico (Inteiro)                 | N        | A quantidade de parcelas na qual a transação foi dividida na Adquirente.                                             |
| Código de Autorização                                              | Alfanumérico                       | A        | O código de autorização da transação informado pela adquirente.                                                      |
| Identificador do Meio de  Captura                                  | Numérico (Inteiro)                 | N        | O identificador do meio  tecnológico utilizado para capturar a transação na   Adquirente5                            |
| Descrição do Meio de Captura                                       | Alfanumérico                       | A        | A descrição do meio tecnológico utilizado para capturar a transação na  Adquirente5                                  |
| Identificador da Bandeira                                          | Numérico (Inteiro)                 | N        | O identificador da bandeira do cartão utilizado para efetuar a transação6                                            |
| Nome da Bandeira                                                   | Alfanumérico                       | A        | O nome da bandeira do cartão utilizado para efetuar a transação6                                                     |
| Identificador do tipo de cartão                                    | Numérico (Inteiro)                 | N        | O identificador do tipo do cartão: - 1: Debit  - 2: Credit                                                           |
| Nome do tipo de cartão                                             | Tipo de cartão                     | A        | O nome do tipo do cartão utilizado para efetuar a transação                                                          |
| Código de Identificação do  Produto na Cielo                       | Numérico (Inteiro)                 | N        | O código que identifica o   Produto da Adquirente Cielo utilizado para efetuar a transação7                          |
| Descrição do Produto na Cielo                                      | Alfanumérico                       | A        | A descrição do Produto na Adquirente Cielo utilizado para efetuar a transação7                                       |
| Identificador PIX | Alfanumérico | A | O identificador inicial gerado no momento da transação. |
| Identificador PIX Original | Alfanumérico | A | Gerado para identificar a transação original. |

1. As informações da adquirente são os dados da venda que o Conciliador recebe dos extratos eletrônicos, o meio de integração da adquirente com os sistemas externos. São a segunda parte da conciliação. O Identificador Único da Transação pode ser utilizado para visualizar a venda no WebSite do Conciliador, preenchendo a URL:   

> https://reconciliation.braspag.com.br/WebSite/Reports/TransactionDetails.aspx?AcquirerTransactionId=[ID]   

Onde o texto [ID] deve ser substituído pelo identificador informado no registro.   

2. Devido à restrições de segurança, o número do cartão será informado de forma mascarada.   
3. Quando uma transação é dividida em uma quantidade de parcelas onde o valor não pode ser distribuído igualmente entre as parcelas, surge a necessidade de colocar um valor extra em uma parcela específica. Esta parcela é chamada de parcela de arredondamento. Como exemplo, podemos adotar uma transação de R$ 100,00 dividida em três parcelas. Se a primeira parcela for a parcela de arredondamento, ela terá o valor de R$ 33,34 – enquanto as duas outras parcelas terão o valor de R$ 33,33.   
4. A taxa de adquirência normalmente é expressa em porcentagem. O campo demonstra essa porcentagem multiplicada por 100. Portanto, se o valor deste campo for expresso como 275, isto indica uma taxa de adquirência de 2,75%.   
5. Tabelas com os meios de captura informados estão disponíveis no Apêndice do Manual.   
6. Uma tabela com as bandeiras disponíveis está disponível no Apêndice do Manual.   
7. Uma tabela com os tipos de produto está disponível no Apêndice do Manual.  

### Registro de Evento

| Campo                                         | Tipo                               | Formato  | Descrição                                                                                                                                                          |
|-----------------------------------------------|------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Identificador do Registro                     | Numérico (Inteiro)                 | N        | 5 = Evento Financeiro de Transação <br> 6 = Evento Informativo de Transação <br> 7 = Eventos financeiros de Afiliação <br> 8 = Eventos  informativos de Afiliação1 |
| Identificador Único do Evento no  Conciliador | Identificador Único  Global (GUID) | G        | O identificador único do do  Evento no Conciliador2                                                                                                                |
| Data do evento                                | Data                               | ddMMyyyy | A data em que o evento está previsto para ser realizado, ou a data em que foi realizado (no caso de evento realizado)                                              |
| Identificador da Categoria de Evento          | Numérico (Inteiro)                 | N        | O identificador da categoria do evento3                                                                                                                            |
| Descrição da Categoria de Evento              | Alfanumérico                       | A        | A descrição da categoria do evento3                                                                                                                                |
| Identificador do Tipo de Evento               | Numérico (Inteiro)                 | {N}      | 1   = Realizado <br> 2 = Previsto <br> 3 = Pendente                                                                                                                |
| Descrição do Tipo de Evento                   | Alfanumérico                       | A        | “Preview”, “Realized” ou “Pending”                                                                                                                                 |
| Código de Afiliação                           | Numérico                           | N        | O código de afiliação do estabelecimento no qual o evento foi executado                                                                                            |
| Parcela da Transação                          | Numérico                           | N        | A parcela da transação a qual o evento se refere4                                                                                                                  |
| Valor Bruto                                   | Numérico                           | N        | O valor financeiro do evento contemplado, antes da dedução da taxa de adquirência, em centavos.                                                                    |
| Valor Líquido                                 | Numérico                           | N        | O valor líquido do evento, após a redução da taxa de adquirência, em centavos.                                                                                     |
| Valor da Taxa                                 | Numérico                           | N        | O valor da taxa de adquirência sobre o evento, em centavos                                                                                                         |
| Banco                                         | Numérico                           | N        | O código do banco do domicílio bancário sobre o qual o evento financeiro é ou será lançado                                                                         |
| Agência                                       | Numérico                           | N        | O código da agência do domicílio bancário sobre o qual o evento financeiro é ou será lançado                                                                       |
| Número da Conta                               | Alfanumérico                       | A        | O número da conta do domicílio bancário sobre o qual o evento financeiro é ou será lançado                                                                         |
| Código do Ajuste                              | Alfanumérico                       | A        | O código que identifica o tipo de ajuste (apenas para eventos de ajustes)                                                                                          |
| Descrição do Ajuste                           | Alfanumérico                       | A        | A descrição do ajuste (apenas para eventos de ajustes)                                                                                                             |
| Número da Operação de Antecipação na Cielo    | Numérico                           | N        | O número da Operação de Antecipação (apenas para eventos derivados de antecipações na Cielo)                                                                       |
| Data original de pagamento                    | Data                               | ddMMyyyy | A data original para a qual o evento de pagamento estava previsto (apenas para eventos de antecipações)                                                            |
|Número do Lote                                 | Numérico                           | N        | O número do Lote (Resumo de Vendas) ao qual o evento pertence (Somente disponível no CSV a partir do dia 16/04/2018)

1. Os eventos são divididos em 2 tipos: Eventos financeiros são eventos que informam cobranças ou pagamentos na agenda financeira da adquirente com o lojista. Eventos informacionais são avisos de alterações na agenda (reagendamentos de eventos financeiros) ou outras informações não financeiras (captura de transação). Além disso, eles podem estar ligados à transações ou não. Caso estejam ligados à transações, eles aparecerão logo abaixo dos registros de transações aos quais se referem. Caso contrário, serão mencionados no final do arquivo. Utilize corretamente o identificador do registro para saber como tratar estes eventos pela sua ligação.   
2. O Identificador Único do Evento pode ser utilizado para visualizar os dados do evento no WebSite do Conciliador, preenchendo a URL:  https://reconciliation.braspag.com.br/WebSite/Reports/EventDetails.aspx?Id=[ID] Onde o texto [ID] deve ser substituído pelo identificador informado no registro.   
3. Uma tabela com as categorias de evento está disponível no apêndice do Manual.   
4. Certos eventos podem não se referir à uma parcela da transação, como Estornos ou Chargebacks.   
Nesses casos, o campo Parcela da Transação ficará vazio.   

## Meios de Captura

### Cielo

| Código/Identificador | Descrição           |
|----------------------|---------------------|
| 1                    | POS                 |
| 2                    | PDV/TEF             |
| 3                    | E-Commerce          |
| 4                    | EDI                 |
| 5                    | ADP/BSP             |
| 6                    | Manual              |
| 7                    | URA/CVA             |
| 8                    | Mobile              |
| 9                    | Moedeiro Eletrônico |

### Amex

| Código/Identificador | Descrição                           |
|----------------------|-------------------------------------|
| 1                    | Rede AE – Manual                    |
| 2                    | Rede AE – EDI                       |
| 3                    | Rede AE – BSP                       |
| 4                    | Rede AE – TEF                       |
| 11                   | Cielo – POS                         |
| 12                   | Cielo – TEF                         |
| 13                   | Cielo – Autorização Manual          |
| 14                   | Cielo – URA                         |
| 15                   | Cielo – EDI                         |
| 16                   | Cielo – GDS                         |
| 17                   | Cielo – E-Commerce                  |
| 18                   | Cielo – Mobile                      |
| 99                   | Legado – Versão anterior do extrato |

### Rede

| Código/Identificador | Descrição        |
|----------------------|------------------|
| 1                    | Manual           |
| 2                    | POS              |
| 3                    | PDV              |
| 4                    | TO               |
| 5                    | Internet         |
| 6                    | Leitor de Trilha |
| 9                    | Outros           |

### GetNet

| Código/Identificador | Descrição |
|----------------------|-----------|
| 0                    | TEF       |
| 1                    | POS       |
| 2                    | Manual    |
| 3                    | Internet  |

### Outros

A tabela abaixo é valida para:

* Stone
* Global Payments
* First Data
* Ticket
* Sodexo

**Observação:** Para a adquirente Losango o campo é enviado “vazio"

| Código/Identificador | Descrição  |
|----------------------|------------|
| 0                    | N/D        |
| 1                    | N/A        |
| 2                    | POS        |
| 3                    | PDV/TEF    |
| 4                    | E-Commerce |
| 5                    | EDI        |
| 6                    | Manual     |
| 7                    | Mobile     |
| 8                    | Outros     |

## Bandeiras

| Código/Identificador | Descrição               |
|----------------------|-------------------------|
| 0                    | Desconhecido/Indefinido |
| 1                    | VISA                    |
| 2                    | Mastercard              |
| 3                    | ELO                     |
| 4                    | Diners                  |
| 5                    | Cabal                   |
| 6                    | Hipercard               |
| 7                    | Amex                    |
| 8                    | Sicred                  |
| 9                    | Cup                     |
| 10                   | Agiplan                 |
| 11                   | Banesecard              |
| 12                   | SoroCred                |
| 13                   | CredSystem              |
| 14                   | Esplanada               |
| 15                   | CredZ                   |
| 16                   | Losango                 |
| 17                   | AVista                  |
| 18                   | Hiper                   |
| 19                   | JCB                     |
| 20                   | Aura                    |
| 21                   | Alelo                   |
| 22                   | Ticket                  |
| 23                   | Sodexo                  |

## Tipos de Produtos

### Cielo

| Código/Identificador | Descrição                          |
|----------------------|------------------------------------|
| 1                    | Agiplan crédito à vista            |
| 2                    | Agiplan parcelado loja             |
| 3                    | Banescard crédito à vista          |
| 4                    | Banescard parcelado loja           |
| 5                    | Esplanada crédito à vista          |
| 6                    | CredZ crédito à vista              |
| 7                    | Esplanada parcelado loja           |
| 8                    | Credz parcelado loja               |
| 9                    | Elo Crediário                      |
| 10                   | MasterCard crédito à vista         |
| 11                   | Maestro                            |
| 12                   | MasterCard parcelado loja          |
| 13                   | Elo Construcard                    |
| 14                   | Elo Agro Débito                    |
| 15                   | Elo Agro Custeio                   |
| 16                   | Elo Agro Investimento              |
| 17                   | Elo Agro Custeio + Débito          |
| 18                   | Elo Agro Investimento + Débito     |
| 19                   | Discover crédito à vista           |
| 20                   | Diners crédito à vista             |
| 21                   | Diners parcelado loja              |
| 22                   | Agro Custeio + Electron            |
| 23                   | Agro Investimento + Electron       |
| 24                   | FCO Investimento                   |
| 25                   | Agro Electron                      |
| 26                   | Agro Custeio                       |
| 27                   | Agro Investimento                  |
| 28                   | FCO Giro                           |
| 29                   | Visa crediário no crédito          |
| 30                   | Visa parcelado cliente             |
| 31                   | Pré-pago Visa Débito               |
| 32                   | Pré-pago Visa Crédito              |
| 33                   | JCB                                |
| 35                   |Pré-pago Visa Carnê                 |
| 36                   | Saque com cartão de Débito VISA    |
| 37                   | Flex Car Visa Vale                 |
| 38                   | CredSystem crédito à vista         |
| 39                   | CredSystem parcelado loja          |
| 40                   | Visa Crédito à Vista               |
| 41                   | Visa Electron Débito à Vista       |
| 42                   | Visa Pedágio                       |
| 43                   | Visa Parcelado Loja                |
| 44                   | Visa Electron Pré-Datado           |
| 45                   | Alelo Refeição (Bandeira Visa/Elo) |
| 46                   |Alelo Alimentação (Visa)            |
| 58                   | Alelo Multibenefícios              |
| 59                   | Alelo Auto                         |
| 60                   | Sorocred débito à vista            |
| 61                   | Sorocred crédito à vista           |
| 62                   | Sorocred parcelado loja            |
| 64                   | Visa Crediário                     |
| 65                   | Alelo Refeição (Elo)               |
| 66                   | Alelo Alimentação (Elo)            |
| 67                   | Visa Capital de Giro               |
| 68                   | Visa Crédito Imobiliário           |
| 69                   | Alelo Cultura                      |
| 70                   | Elo crédito a vista                |
| 71                   | Elo débito à vista                 |
| 72                   | Elo parcelado loja                 |
| 73                   | Pré-pago Visa Cash                 |
| 79                   | Pagamento Carnê Visa Electron      |
| 80                   | Visa Crédito Conversor de Moeda    |
| 81                   | Mastercard Crédito Especializado (*)|
| 82                   | Amex crédito à vista               |
| 83                   | Amex parcelado loja                |
| 84                   | Amex parcelado banco               |
| 89                   | Elo Crédito Imobiliário            |
| 91                   | Elo Crédito Especializado (*)      |
| 94                   | Banescard Débito                   |
| 96                   | Cabal crédito à vista              |
| 97                   | Cabal débito à vista               |
| 98                   | Cabal parcelado loja               |
| 107                  | Pré-pago Master Carnê              |
| 110                  | Pré-pago Master Crédito            |
| 111                  | Pré-pago Master Débito             |
| 161                  | Hiper crédito à vista              |
| 162                  | Hiper débito à vista               |
| 163                  | Hiper parcelado loja|
| 164                  | Hipercard crédito à vista|
| 165                  | Hipercard parcelado loja|
| 200                  | Verdecard crédito a vista|
| 201                  | Verdecard parcelado loja|
| 202                  | Nutricash Alimentação|
| 203                  | Nutricash Refeição|
| 204                  | Nutricash Multibenefícios|
| 205                  | Nutricash Combustível|
| 206                  | Ben Alimentação|
| 207                  | Ben Refeição|
| 269                  | Pré-pago Elo Carnê|
| 270                  | Pré-pago Elo Crédito|
| 271                  | Pré-pago Elo Débito|
| 314                  | Ourocard Agro débito|
| 315                  | Ourocard Agro custeio|
| 316                  | Ourocard Agro investimento|
| 317                  | Ourocard Agro custeio + débito|
| 318                  | Ourocard Agro investimento + débito|
| 321                  | Mastercard crediário no crédito|
| 322                  | Mastercard parcelado cliente|
| 324                  | Elo parcelado cliente|
| 330                  | Elo crediário no crédito|
| 342                  | Mastercard Pedágio|
| 377                  | Elo Carnê|
| 378                  | Mastercard Carnê|
| 380                  | Mastercard Crédito Conversor de Moeda|
| 433                  | JCB parcelado loja|

### Getnet

| Código/Identificador | Descrição                        |
|----------------------|----------------------------------|
| 1                    | Título                           |
| 2                    | Convênio                         |
| 3                    | Crédito Digital                  |
| 9 | Elo crediário |
| 11 | Mastercard débito |
| 12 | Mastercard crédito |
| 41 | Visa débito |
| 43 | Visa crédito |
| 64 | Visa crediário |
| 71 | Elo débito |
| 72 | Elo crédito |
| 83 | Amex crédito |
| 165 | Hiper/Hipercard crédito |
| 321 | Mastercard crediário |
| 378 | Mastercard débito - Pagamento carnê |
| 507 | Hiper/Hipercard crediário |
| 509 | Visa débito - Pagamento carnê |
| 510 | Elo débito - Pagamento carnê |
| 511 | Mastercard crédito BNDES |
| 512 | Visa crédito BNDES |
| 513 | Amex crediário |
| 10074 | Titulo |
| 10075 | Convênio |
| 10076 | Crédito Digital |
| 10077 | Cupom Eletrônico |
| 10078 | Cupom Papel |
| 10079 | Pagamento Recorrente|
| 00/CE                | Cupom Eletrônico                 |
| CP                   | Cupom Papel                      |
| SM                   | Cartão de Crédito MASTERCARD     |
| SV                   | Cartão de Crédito VISA           |
| SR                   | Cartão de Débito MAESTRO         |
| SE                   | Cartão de Débito VISA ELECTRON   |
| PV                   | Pagamento Carnê – Débito VISA ELECTRON |
| PM                   | Pagamento Carnê – Débito MAESTRO |
| PR                   | Pagamento Recorrente             |

### Redecard

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 3 | EEVC Banescard crédito à vista |
| 3 | EEFI Banescard crédito à vista |
| 4 | EEVC Banescard parcelado loja |
| 4 | EEFI Banescard parcelado loja |
| 6 | EEVC Credz crédito à vista |
| 6 | EEFI Credz crédito à vista |
| 8 | EEVC Credz parcelado loja |
| 8 | EEFI Credz parcelado loja |
| 10 | EEFI Mastercard crédito à vista |
| 10 | EEVC Mastercard crédito à vista |
| 11 | EEVD Maestro débito |
| 11 | EEVD Maestro |
| 12 | EEFI Mastercard parcelado loja |
| 12 | EEVC Mastercard parcelado loja |
| 20 | EEVC Diners crédito à vista |
| 20 | EEFI Diners crédito à vista |
| 21 | EEFI Diners parcelado loja |
| 21 | EEVC Diners parcelado loja |
| 33 | EEFI JCB |
| 33 | EEVD JCB |
| 33 | EEVC JCB |
| 38 | EEVC Credsystem crédito à vista |
| 38 | EEFI Credsystem crédito à vista |
| 39 | EEVC Credsystem parcelado loja |
| 39 | EEFI Credsystem parcelado loja |
| 40 | EEFI Visa crédito à vista |
| 40 | EEVC Visa crédito à vista |
| 41 | EEVD Visa débito |
| 42 | EEFI Visa parcelado loja |
| 43 | EEVC Visa parcelado loja |
| 60 | EEVC Sorocred crédito à vista |
| 60 | EEFI Sorocred crédito à vista |
| 62 | EEVC Sorocred parcelado loja |
| 62 | EEFI Sorocred parcelado loja |
| 70 | EEVC Elo crédito a vista |
| 70 | EEFI Elo crédito a vista |
| 71 | EEVD Elo débito à vista |
| 72 | EEVC Elo parcelado loja |
| 72 | EEFI Elo parcelado loja |
| 82 | EEVC Amex crédito à vista |
| 82 | EEFI Amex crédito à vista |
| 83 | EEVC Amex parcelado loja |
| 83 | EEFI Amex parcelado loja |
| 94 | EEVD Banescard Débito |
| 96 | EEFI Cabal crédito à vista |
| 96 | EEVC Cabal crédito à vista |
| 97 | EEVD Cabal débito |
| 98 | EEVC Cabal parcelado loja |
| 98 | EEFI Cabal parcelado loja |
| 161 | EEVC Hiper crédito à vista |
| 161 | EEFI Hiper crédito à vista |
| 162 | EEVD Hiper débito à vista |
| 163 | EEVC Hiper parcelado loja |
| 163 | EEFI Hiper parcelado loja |
| 164 | EEFI Hipercard crédito à vista |
| 164 | EEVC Hipercard crédito à vista |
| 165 | EEVC Hipercard parcelado loja |
| 165 | EEFI Hipercard parcelado loja |
| 433 | EEFI JCB |
| 433 | EEVC JCB |
| 501 | EEVD Hipercard débito |
| 506 | EEVD Diners débito |

### Stone

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 1                    | Crédito Visa       |
| 2                    | Crédito Master     |
| 4                    | Crédito Elo        |
| 10                   | Mastercard crédito à vista |
| 11                   | Mastercard débito |
| 12                   | Mastercard crédito parcelado |
| 15                   | Crédito Hipercard  |
| 29                   | Visa Crediário
| 30                   | Visa parcelado cliente
| 35                   | Mastercard Maestro |
| 36                   | Visa Electron      |
| 38                   | Débito Elo         |
| 39                   | Débito Hipercard   |
| 40                   | Visa crédito à vista |
| 41                   | Visa débito |
| 43                   | Visa crédito parcelado |
| 70                   | Elo crédito à vista |
| 71                   | Elo débito |
| 72                   | Elo crédito parcelado |
| 82                   | Amex crédito à vista |
| 83                   | Amex crédito parcelado |
| 84                   | Amex parcelado banco |
| 96                   | Cabal crédito à vista |
| 97                   | Cabal débito |
| 98                   | Cabal crédito parcelado |
| 164                  | Hipercard crédito à vista |
| 165                  | Hipercard crédito parcelado |
| 321                  | Mastercard crediário |
| 322                  | Mastercard parcelado cliente |
| 324                  | Elo parcelado cliente |
| 330                  | Elo Crediário |
| 501                  | Hipercard débito |
| 502                  | Amex débito |
| 503                  | Cabal débito |
| 504                  | Cabal crédito parcelado |
| 505                  | Cabal crédito à vista |
| 507                  | Hipercard crediário |
| 513                  | Amex crediário |

### Global Payments

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 1                    | Crédito Visa       |
| 2                    | Crédito Master     |
| 35                   | Mastercard Maestro |
| 36                   | Visa Electron      |

### First Data

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 1                    | Crédito Visa       |
| 2                    | Crédito Master     |
| 4                    | Crédito Elo        |
| 11                   | Crédito Cabal      |
| 35                   | Mastercard Maestro |
| 36                   | Visa Electron      |
| 37                   | Débito Cabal       |
| 38                   | Débito Elo         |

### Ticket

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 24                   | Ticket Refeição    |
| 25                   | Ticket Alimentação |
| 26                   | Ticket Parceiro    |
| 27                   | Ticket Cultura     |

### Sodexo

| Código/Identificador | Descrição          |
|----------------------|--------------------|
| 28                   | Sodexo Refeição    |
| 29                   | Sodexo Alimentação |
| 30                   | Sodexo Gift        |
| 31                   | Sodexo Premium     |
| 32                   | Sodexo Cultura     |

## Categorias de Evento

|Identificador| Descrição|
|:-----------:|---|
|1| Ajuste|
|2| POS|
|3| Captura|
|4| Pagamento|
|5| Pgto. Lote|
|6| Aceleração|
|7| Desagendamento|
|8| Estorno|
|9| Chargeback|
|10| Antecipação|
|11| Antecip. Lote|
|12| Ajuste Lote|
|13| Reagendamento|
|14| Custo de Operação de Antecipação|
|15| Valor Retido|
|16| Pagamento de Valor Retido|
|17| Débito de Valor Retido|
|18| Ajustes Antecipados|
|19| Arredondamento de Parcelas|
|20| Estorno Antecipado|
|21| Ajuste Indefinido|
|22| Débito Acumulado|
|23| Pagamento de Vendas Antecipadas|
|24| Débito de Antecipação de Vendas|
|25| Pagamento de Aceleração Antecipada|
|26| Débito de Antecipação de Aceleração|
|27| Credit Voucher|
|28| Antecipação de Credit Voucher|
|29| Antecipação de Chargeback|
|30| Antecipação de Aluguel de POS|
|31| Antecipação de Ajustes Lote|
|32| Antecipação de Estornos Lote|
|33| Antecipação de Chargeback Lote|
|34| Débito de Cessão|
|35| Débito de Gravame|
|36| Cessão fumaça|
|37| Crédito de Cessão|
|38| Débito/crédito compensação de valores|
|39| Estorno débito/crédito de cessão|
|40| Estorno débito/crédito de gravame|
|41| Débito/crédito compensação cancelamento de transação em operação|
|42| Débito/crédito de penhora|
|43| Estorno de crédito/débito de penhora|
|44| Débito/crédito compensação cancelamento em operação|
|45| Crédito de Gravame|

## Webservice Conciliador    

Webservice é uma solução para integrar aplicações.
Por meio dele, qualquer sistema pode se conectar para consultar ou inserir dados. Atualmente no Webservice do Conciliador é possível enviar o arquivo de vendas externas e baixar o conteúdo dos Arquivos de Fluxo de Caixa.    

Inicialmente o acesso deverá ser liberado pela equipe de operações, através do e-mail, senha e o cadastro dos IPs informados pelo estabelecimento.    

O Webservice está disponível através da URL:

> https://reconciliation.braspag.com.br/WebServices/ReconciliationFilesWebService.asmx   

**Método:** GetExportedFileV2

### Request

``` xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rec="https://reconciliation.braspag.com.br">   
   <soapenv:Header/>   
   <soapenv:Body>   
      <rec:GetReconciliationFile>   
         <rec:request>   
            <rec:RequestId>[Guid aleatório]</rec:RequestId>   
            <rec:RequestingUserName>[Login do usuário da loja]</rec:RequestingUserName>   
            <rec:MerchantId>[Identificador da loja, fornecido pela Braspag]</rec:MerchantId>   
            <rec:AcquirerId>[Identificador da adquirente]</rec:AcquirerId>   
            <rec:RequestingPassword>[Senha do usuário da loja]</rec:RequestingPassword>   
            <rec:ReferenceDate>[Data de referência do arquivo]</rec:ReferenceDate>   
            <rec:FileExtensionType>[Extensão do arquivo]</rec:FileExtensionType>   
            <rec:FileType>[Tipo do arquivo]</rec:FileType>   
         </rec:request>   
      </rec:GetReconciliationFile>   
   </soapenv:Body>  
```

| Descritor          | Significado                                | Exemplo                                              |
|--------------------|--------------------------------------------|------------------------------------------------------|
| RequestId          | Identificador Único Global (GUID)          | 4749e676-2507-442da1c6c25c08e2d2af                   |
| RequestingUserName | Login do usuário da loja                   | user@braspag.com.br                                  |
| MerchantId         | Identificador da loja no Conciliador       | 123                                                  |
| AcquirerId         | Identificador da adquirente                | 1=Cielo<br>2=Rede<br>3=Amex<br>4=Losango<br>5=Getnet |
| RequestingPassword | Senha do usuário da loja                   | Braspag@2015                                         |
| ReferenceDate      | Data de referência do Arquivo (yyyy-mm-dd) | 12/06/2015                                           |
| FileExtensionType  | Formato do Arquivo                         | 1=CSV <br> 2=XML                                     |
| FileType           | Tipo de Arquivo                            | 1=Arquivo de Conciliação                             |

### Response

``` xml

--Bem sucedido

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchemainstance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">    <soap:Body>   
      <GetReconciliationFileResponse xmlns="https://reconciliation.braspag.com.br">   
         <GetReconciliationFileResult>   
            <CorrelatedId>124be5db-a809-47e1-b456-1f2e103caa17</CorrelatedId>   
            <Success>true</Success>               <ErrorReportCollection/>   
            <FileContent> QXJxdWl2byBkZSB0ZXN0ZSBjb25jaWxpYWRvcg==</FileContent>   
         </GetReconciliationFileResult>   
      </GetReconciliationFileResponse>   
   </soap:Body>   
</soap:Envelope>   
```

``` xml

-- Mal Sucedida   

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchemainstance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">    <soap:Body>   
      <GetReconciliationFileResponse xmlns="https://reconciliation.braspag.com.br">   
         <GetReconciliationFileResult>   
            <CorrelatedId>124be5db-a809-47e1-b456-1f2e103caa17</CorrelatedId>   
            <Success>false</Success>   
            <ErrorReportCollection>   
               <ErrorReport>   
                  <Code>44</Code>   
                  <Message>Acesso não autorizado do IP para a loja fornecida na requisição.</Message></ErrorReport>   
            </ErrorReportCollection>   
         </GetReconciliationFileResult>   
      </GetReconciliationFileResponse>   
   </soap:Body>   
</soap:Envelope>   
```

| Descritor             | Descrição                                                                                      | Exemplo                                                                                                                               |
|-----------------------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| CorrelatedId          | GUID enviado na requisição                                                                     | 4749e676-2507-442d-a1c6-c25c08e2d2af                                                                                                  |
| Success               | Indica se a operação foi concluída.                                                            | false/true                                                                                                                            |
| ErrorReportCollection | Coleção de erros que será  retornada em caso de Sucess="false"                                 | ErrorReport.Code = 39,ErrorReport.Message  = “Erro interno do sistema”.                                                               |
| ErrorReport.Code      | Código de erros para  Sucess="false"                                                           | 39/44/46                                                                                                                              |
| ErrorReport.Message   | Mensagem de erro correspondente ao código informado                                            | 39 - Erro interno do sistema.<br>44 - Acesso não autorizado, IP não cadastrado<br>46 - Usuário incorreto, e/ou não tem acesso a loja. |
| FileContent           | Para requisições com Sucess="true", será enviado o conteúdo binário codificado na base64 UTF-8 | QXJxdWl2byBkZSB0ZXN0ZSBjb25jaWxpYWRvcg== | |

## Apêndice:

### Utilizando o arquivo de Schema Definition (XSD)   

Uma forma de integração com o Arquivo de Fluxo de Caixa do Conciliador no formato XML de maneira programada ou automática, é feita através do arquivo de definição de esquema, ou `XML Schema Definition File`.   

O XML Schema é uma linguagem baseada no formato XML para definição de regras de validação ("esquemas") em documentos no formato XML. Foi a primeira linguagem de esquema para XML que obteve recomendação por parte do **W3C**. Esta linguagem é uma alternativa ao **DTD**, cuja sintaxe não é baseada no formato XML.   
Foi amplamente utilizado para desenvolvimento da NF-e (Nota Fiscal Eletrônica) Brasileira.   

Um arquivo contendo as definições na linguagem XML Schema é chamado de **XSD (XML Schema Definition)**, este descreve a estrutura de um documento XML.   

O conciliador possui arquivos XSD para cada um de seus arquivos em XML. Desta forma, é possível, programaticamente compreender a estrutura do XML, supondo que o arquivo XSD seja corretamente interpretado pela ferramenta.   

Neste manual, não serão citadas todas as formas de se trabalhar com o arquivo, entretanto, podemos demonstrar, através da utilização de uma ferramenta provida pela IDE de desenvolvimento Visual Studio, como gerar, programaticamente uma Classe em código-fonte que pode representar o conteúdo do arquivo.   

Desta forma, será possível deserializar o conteúdo de qualquer arquivo dentro desta classe, e com isto utilizar os arquivos de conciliação em um sistema com código orientado a objetos.   

Criando a classe do arquivo por meio do arquivo de definição de esquema   
Com os arquivos de definição de esquema, você deverá utilizar uma ferramenta que pode ser acessada à partir da linha de comando da IDE do Visual Studio (Visual Studio Command Prompt). O nome do executável é “xsd” (sem aspas).   

O executável possui uma série de parâmetros para customizar a geração da sua classe a partir do arquivo de definição de esquema. Caso você queira ver todas as opções, consulte a URL https://msdn.microsoft.com/en-us/library/x6c1kb0s(v=VS.100).aspx.   
No exemplo abaixo, utilizamos o comando para gerar a classe da forma mais básica. Acesse o diretório onde os arquivos de esquemas estão salvos(normalmente são dois arquivos, “ConciliationFile.xsd” e “Guid.xsd”), usando o comando CD do DOS.   Uma vez dentro deste diretório, basta executar o comando conforme abaixo:
xsd  

ConciliationFile.xsd Guid.xsd /classes   

Um exemplo do efeito disto na linha de commando é demonstrado na imagem abaixo. A classe gerada terá o nome
**“ConciliationFile_Guid.cs”**.
Esta classe pode ser inserida em um projeto na linguagem C#, e com algumas alterações pode representar o conteúdo do arquivo por meio de deserialização.   
Consulte o suporte de sua linguagem de desenvolvimento para verificar se a mesma possui algum tipo de automatização para interpretar a leitura do arquivo em XML. Isto pode facilitar seu processo de desenvolvimento e aprendizado do layout do mesmo

![]({{ site.baseurl_root }}/images/braspag/conciliador/xml20.png)
