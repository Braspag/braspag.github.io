---
layout: manual
title: Split de Pagamentos - Extrato Eletrônico
description: Manual Extrato Eletrônico
search: true
toc_footers: false
categories: manual
sort_order: 7
hub_visible: false
tags:
  - 6. Soluções para Marketplace
language_tabs:
  json: JSON
  
---

<aside class="warning"> O conteúdo deste manual foi descontinuado e não é atualizado desde 14/08/2024. Acesse o novo portal.</aside>

# As documentações do Split de Pagamentos estão em um novo portal

[![Novo portal de desenvolvedores e-commerce Braspag e Cielo]({{ site.baseurl_root }}/images/novo-docs.cielo.com.br.png)](https://docs.cielo.com.br/split/docs/extrato-eletronico)

Acesse o novo portal de desenvolvedores E-commerce **[docs.cielo.com.br/split/docs/extrato-eletronico](https://docs.cielo.com.br/split/docs/extrato-eletronico)**.

> **Atenção**: O conteúdo desta página está sendo descontinuado e não receberá atualizações a partir de 14/08/2024. Visite a nova documentação em [docs.cielo.br](https://docs.cielo.com.br/split/docs/extrato-eletronico).

--------------------------------------------------------------------------------------------------------------------------

<aside class="warning"> O conteúdo a seguir não é atualizado desde 14/08/2024.</aside>

# Introdução ao Extrato Eletrônico

O Extrato Eletrônico é um produto disponibilizado aos clientes que necessitam de automatização no processo de conciliação. Nele, as informações são transmitidas de forma padronizada sem intervenção, proporcionando agilidade e segurança no tráfego das informações. 

Os principais benefícios deste produto são:

* Realização da conciliação contábil e financeira de forma automatizada;
* Maior agilidade e eficiência operacional;
* Integração com a automação comercial de vendas;
* Segurança no recebimento das informações;
* Atendimento especializado.

# Ambientes

## Sandbox

|Ambiente|URL base|Descrição|
|:-|:-|:-|
|**Braspag OAUTH2 Server**|https://authsandbox.braspag.com.br | Autenticação.|
|**API Split**|https://splitsandbox.braspag.com.br/ | Para requisição dos arquivos do Extrato Eletrônico. |

## Produção

|Ambiente|URL base|Descrição|
|:-|:-|:-|
|**Braspag OAUTH2 Server**|https://auth.braspag.com.br/ | Autenticação.|
|**API Split**|https://split.braspag.com.br/ | Para requisição dos arquivos do Extrato Eletrônico. |

# Autenticação

Durante o onboarding, você receberá as credenciais `ClientId` e `ClientSecret`. Caso não tenha recebido a credencial, solicite ao [Suporte Braspag](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}.

**1.** Concatene as credenciais no formato `ClientId:ClientSecret`;<br/>
**2.** Converta o resultado em base 64, gerando uma string;

> **Exemplo:**<br/>
> * client_id: **braspagtestes**<br/>
> * client_secret: **1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * String a ser codificada em Base64: **braspagtestes:1q2w3e4r5t6y7u8i9o0p0q9w8e7r6t5y4u3i2o1p**<br/>
> * Resultado após a codificação: **YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==**<br/>

**3.** Envie a string em base 64 na requisição de Autenticação (POST);<br/>
**4.** A API de Autenticação irá validar a string e retornará o `access_token` (token de acesso). 

O token retornado (`access_token`) deverá ser utilizado em toda requisição à API do Split como uma chave de autorização. O `access_token` possui uma validade de 20 minutos e é necessário gerar um novo toda vez que a validade expirar.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">oauth2/token</span></aside>

**Parâmetros no Cabeçalho (header)**

|Key|Value|
|:-|:-|
|`Content-Type`|application/x-www-form-urlencoded|
|`Authorization`|Basic YnJhc3BhZ3Rlc3RlczoxcTJ3M2U0cg==|

**Parâmetros no Corpo (body)**

|Key|Value|
|:-|:-|
|`grant_type`|client_credentials|

### Resposta

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

**Parâmetros no corpo (body)**

|Parâmetro|Descrição|
|:-|:-|
|`access_token`|O token de acesso solicitado.|
|`token_type`|Indica o valor do tipo de token.|
|`expires_in`|Expiração do token de acesso, em segundos. <br/>Após expirar, é necessário obter um novo.|

# Obtendo arquivos de Extrato Eletrônico

Para obter os arquivos de Extrato Eletrônico, faça a seguinte requisição:

## Requisição

<aside class="request"><span class="method get">GET</span> <span class="endpoint">schedule-api/v2/electronic-statement?DocumentNumber=00000000000000&ReconciliationType=Forecast&Date=0000-00-00</span></aside>

**Parâmetros da requisição**

|Parâmetros|Definição|Tipo|Obrigatório|
|-|-|-|-|
|`DocumentNumber`|Número do documento (CPF ou CNPJ) o qual está buscando as informações.|string|Sim|
|`Date`|Informar a data base pretendida|data|Não*|
|`ReconciliationType`|Valores possíveis:<br>**Forecast**: Será retornado o arquivo referente aos eventos transacionais e previsões de liquidação.<br>**Settlement**: Será retornado o arquivo referente às liquidações realizadas.<br>**SellerForecast****: Será retornado o arquivo para o Seller referente ao MerchantId informado.<br>**SellerSettlement**\**: Será retornado o arquivo referente às liquidações realizadas para o Seller de acordo com o MerchantId informado.|string|Sim|
|`MerchantId`|Id do Merchant que deseja consultar as informações. Serão retornadas informações referentes ao número de documento do cadastro.|GUID|Será obrigatório apenas se o `ReconciliationType` for do tipo SellerForecast.|

*Se o campo `Date` não for preenchido, o endpoint retornará o último arquivo gerado para o número de documento informado.<br>
**Extrato seller não está disponível para consumo.

**Parâmetros no cabeçalho (header)**

|Key|Value|Descrição|
|-|-|-|
|`Authorization`|Bearer {access_token}|Use o `acess_token` retornado anteriormente.
|`Content-Type`|application/json|Tipo de mídia.

# Tipos de arquivos

## Arquivo de Previsão

Com o Arquivo de Previsão você consegue conferir se todas as vendas realizadas foram recebidas e as previsões de pagamento geradas, com as seguintes informações:

* As vendas concluídas (capturadas) no dia anterior, ajustes, cancelamentos, chargebacks com agenda de previsão de pagamento;
* Todo o plano parcelado da venda realizada no dia anterior;
* Como a transação foi dividida no Split das Transações.

## Arquivo de Liquidação

Com o Arquivo de Liquidação você consegue conferir a origem do pagamento recebido, com as seguintes informações:

* Informações de liquidação de D-1;
* Efeitos de  contrato liquidados.

# Layout dos Arquivos

O layout dos Arquivos segue o seguinte padrão:

![Layout dos Arquivos]({{ site.baseurl_root }}/images/braspag/split/split-extrato-edi.png)

## Layout do Arquivo de Previsão

### Registro 0 - Cabeçalho

Identifica o cabeçalho do Arquivo de Previsão:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo de Registro|Identifica o tipo de registro header (início do arquivo). <br> 0 - Cabeçalho|Sim|número|2|0|
|2|Versão do layout|Versão do layout em que o arquivo foi gerado.|Sim|número|3|1|
|3|Número Documento|Número do documento (CNPJ/CPF).|Sim|alfanumérico|14|0000000000|
|4|Data Geração|Informa a data de geração do arquivo.|Sim|datetime|17|20220119 09:43:10|
|5|Sequência|Número sequencial do arquivo.|Sim|número|2|1|
|6|Tipo do Arquivo|Tipo de Extrato. <br> Ex.: Arquivo de Previsão|Sim|número|2|1|
|7|Data Mínima Processada*|Data mínima de agendamento das operações dentro do arquivo - Tratamento interno|Sim|datetime|17|20220118 09:43:10|
|8|Data Máxima Processada*|Data máxima de agendamento das operações dentro do arquivo - Tratamento interno|Sim|datetime|17|20220118 09:43:10|
|9|Data Mínima Evento Transacional*|Data inicial de captura dos itens presentes no arquivo.|Sim|data|17|20220118|
|10|Data Máxima de Evento Transacional*|Data final de captura dos itens presentes no arquivo.|Sim|data|17|20220118|
|11|Reprocessado|Informa se o arquivo foi gerado através do fluxo de reprocessamento.|Sim|número|1|0 (Falso) ou 1 (Verdadeiro)|

*Não obrigatórios, poderão vir vazios na ausência de movimento no dia.

### Registro 1 - Estabelecimento

Identifica os dados do estabelecimento:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo Registro|Indica o tipo de registro.<br>1 - Estabelecimento|Sim|número|2|1|
|2|Identificador do estabelecimento| Número identificador do estabelecimento onde a venda foi realizada.|Sim|GUID|36|1B917293-8B8D-4180-B2D8-C514A1F8512D|
|3|Tipo Estabelecimento|Tipo do estabelecimento. Veja a [Tabela I](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-i-tipos-de-estabelecimento).|Sim|número|2|3|

### Registro 2 - Eventos Transacionais

Identifica os eventos transacionais:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo do registro|Indica o tipo de registro. <br>2 - Eventos Transacionais|Sim|número|2|2|
|2|Tipo de Evento Transacional|Tipo de Eventos transacionais. Veja a [Tabela II](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-ii-eventos-transacionais). |Sim|número|2|1|
|3|Identificador do Evento Transacional|Identificador único do evento lançado na agenda financeira.|Sim|GUID|36|D6CDD768-CDFE-479A-B090-CD03253EEE2B|
|4|Data do Evento Transacional|Data em que a operação ocorreu. Para a transação, representa a data de autorização, para os demais, representa a data em que a operação ocorreu.|Sim|datetime|17|20220119 09:43:10|
|5|Data de Confirmação|Data em que a operação foi efetivada. <br> - Transação: data de captura; <br>- Outros eventos: data da confirmação.|Sim|data|8|20220119|
|6|Data de Agendamento|Data em que o evento foi processado em agenda financeira.|Sim|datetime|17|20220119 09:43:10|
|7|Valor da Operação|Valor da operação em centavos. Podendo ser um valor positivo ou negativo.|Não|número|20|R$100,01 = 10001 ou -10001|
|8|Taxa Administrativa (MDR)|Percentual aplicado ao valor bruto da operação.|Não|número|20|1,55% = 1,55|
|9|Valor Taxa Administrativa (MDR)|Valor calculado da taxa admnistrativa em centavos sobre o evento transacional.|Não|número|20|R$100,01 = 10001|
|10|Tarifa Administrativa (Fee)|Tarifa fixa cobrada por transação. Valor cobrado separadamente em agenda financeira.|Não|número|20|R$100,01 = 10001|
|11|Valor Taxa Receba Rápido*|Valor descontado para adiantamento dos sellers pelo Receba Rápido|Não|número|20|R$100,01 = 10001|
|12|Tarifa Boleto*|Tarifa cobrada pelo boleto emitido ou pago para transações de boleto.|Não|número|20|R$100,01 = 10001|
|13|Valor Bruto Venda Direta*|Valor bruto de venda direta do Master, caso o mesmo seja um participante da transação.|Não|número|20|R$100,01 = 10001|
|14|Valor Taxa Administrativa Venda Direta*|Valor calculado da taxa administrativa, em centavos, sobre a venda direta.|Não|número|20|R$100,01 = 10001|
|15|Valor Líquido Venda Direta*|Valor líquido da venda direta.|Não|número|20|R$100,01 = 10001|
|16|Valor Bruto Comissão*|Valor bruto de comissão recebido pelo Master.|Não|número|20|R$100,01 = 10001|
|17|Valor Taxa Administrativa Comissão*|Valor calculado da taxa administrativa, em centavos, sobre a comissão, incluindo a taxa de receba rápido.|Não|número|20|R$100,01 = 10001|
|18|Valor Líquido Comissão*|Valor líquido da comissão recebido dos sellers.|Não|número|20|R$100,01 = 10001|
|19|Identificador da Transação|Identificador da transação.|Sim|GUID|36|ED6C8828-F92B-42F4-B6B3-6CA276830733|
|20|Data de Autorização|Data da venda.|Sim|datetime|17|20220119 09:43:10|
|21|Código do Ajuste|Código que identifica o ajuste financeiro lançado em agenda. Veja a [Tabela VII](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-vii-ajustes-financeiros).|Sim|alfanumérico|4|A001|
|22|Data de captura|Data de confirmação da transação.|Sim||data|8|20220119|
|23|Valor da Transação|Valor da transação em centavos.|Sim|número|20|R$100,01 = 10001|
|24|Código do Produto|Código que identifica o produto. Veja a [Tabela III](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iii-produtos).|Sim|número|2|1|
|25|Código da Bandeira|Código que identifica a bandeira ou o banco. Veja a [Tabela IV](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iv-bandeiras).|Sim|número|2|2|
|26|Código de Autorização|Código de autorização da transação. Este número não é único e pode se repetir.|Sim|alfanúmerico|10|251411|
|27|NSU/DOC|Número sequencial da transação, também conhecido como DOC (número do documento), que identifica a transação no dia em que ela foi realizada. Este número e pode se repetir.|Sim|alfanumérico|8|053181|
|28|Total de Parcelas|Total de parcelas da transação.|Sim|número|2|10|
|29|Número do Pedido|Número do pedido informado pelo estabelecimento na transação.|Sim|número|50|Pedido123456|
|30|Número do cartão truncado|Número truncado do cartão que efetuou a compra.|Sim|alfanumérico|19|111111*******1111|
|31|Identificador Transação Adquirente|Identificador da transação na adquirente para transações de e-commerce (TID)|.Sim|alfanumérico|20|99999999111Q1A2A3A4A|
|32|Número Lógico do Terminal|Número lógico do terminal em que ocorreu a transação.|Sim|alfanumérico|50|99999999|
|33|Meio de Captura|Meio pelo qual a transação foi capturada. Veja a [Tabela V](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-v-meios-de-captura).|Sim|número|2|1|

*Não obrigatórios.

### Registro 3 - Participantes do Evento Transacional

Identifica os participantes (Master e Sellers) do Evento Transacional:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo Registro|Indica o tipo de registro. <br>3 - Participantes da Transação|Sim|número|2|3|
|2|Identificador da Divisão|Identificador da divisão.|Sim|GUID|36|CCC2E1DD-C47D-4722-A8A2-4DC51746CB0C|
|3|Identificador do Estabelecimento|Identifica o estabelecimento participante da divisão.|Sim|GUID|36|AAA2E1DD-C47D-4722-A8A2-4DC51746CB0C|
|4|Número do documento|Identifica o número do CPF/CNPJ do participante.|Sim|alfanumérico|17|00000000000|
|5|Tipo Estabelecimento|Identifica o tipo de participante. Veja a [Tabela I](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-i-tipos-de-estabelecimento).|Sim|número|2|3|
|6|Valor Bruto Participante|Valor bruto da operação alocado para o participante.|Sim|número|2|R$100,01 = 10001|
|7|Percentual Desconto|Percentual descontado do valor bruto do participante.|Sim|número|20|20% = 20|
|8|Valor Desconto|Valor calculado em centavos do percentual de desconto aplicado sobre o valor bruto.|Sim|número|20|R$100,01 = 10001|
|9|Taxa Fixa Desconto|Valor fixo descontado do valor bruto do participante.|Sim|número|20|R$100,01 = 10001|
|10|Valor Líquido Participante|Valor líquido da operação a ser recebido pelo participante.|Sim|número|20|R$100,01 = 10001|
|11|Indicador Comissão|Indica se a divisão refere-se a comissão do master ou não. <br>0 – Não; 1 - Sim|Sim|número|1|0|
|12|Percentual Parcela Receba Rápido*|Percentual por parcela do Receba Rápido.|Sim|número|20|20% = 20|
|13|Percentual Total Receba Rápido*|Percentual total do Receba Rápido.|Sim|número|20|20% = 20|
|14|Valor Calculado Receba Rápido*|Valor calculado do Receba Rápido.|Sim|número|20|R$100,01 = 10001|

*Não obrigatórios.

### Registro 4 - Agenda Financeira

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo Registro|Indica o tipo de registro.<br>4 - Agenda Financeira|Sim|número|2|4|
|2|Identificador do Evento Financeiro|Identificador originador do evento lançado na agenda financeira.|Sim|GUID|36|4717A632-D6C4-4B74-9422-235905D1857D|
|3|Identificador Origem|Identificador da agenda financeira. Identificador do evento transacional.|Sim|GUID|36|D8D26880-7BBB-4761-A2A7-B4C835B4923C|
|4|Identificador Estabelecimento|Identifica o estabelecimento.|Sim|GUID|36|5CB61E99-1B4D-4E7A-886F-6BFB4FF71219|
|5|Número do documento|Identifica o número do CPF/CNPJ do participante.|Sim|alfanumérico|17|00000000000|
|6|Número da Parcela|Identifica a parcela a ser liquidada.|Sim|número|2|10|
|7|Tipo do Evento|Identifica o tipo de evento lançado na agenda financeira. (linkar tabela)|Sim|número|2|23|
|8|Tipo de Evento Transacional|Identifica o tipo de evento transacional originador do lançamento em agenda.|Sim|número|2|1|
|9|Data Prevista Liquidação|Data prevista da liquidação.|Sim|data|8|AAAAMMDD|
|10|Valor Líquido|Valor líquido a ser liquidado.|Sim|número|20|R$100,01 = 10001|
|11|Indicador de Comissão|Indica se o lançamento em agenda  refere-se a comissão do master ou não. <br> 0 - Não; 1 – Sim|Não|número|1|0|

### Registro 9 - Rodapé

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo de registro|Indica o tipo de registro. <br> 9- Rodapé (fim do arquivo)|Sim|número|2|9|
|2|Quantidade de Registros|Quantidade de registros do arquivo excluindo o "cabeçalho" e o "rodapé".|Sim|número|20|1000|

## Layout do Arquivo de Liquidação

### Registro 0 - Cabeçalho

Identifica o cabeçalho do Arquivo de Liquidação:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo de Registro|Identifica o tipo de registro header (início do arquivo). <br> 0 - Cabeçalho|Sim|número|2|0|
|2|Versão do Layout|Versão do Layout em que o arquivo foi gerado.|Sim|número|2|1|
|3|Número Documento|Número do documento (CNPJ/CPF).|Sim|alfanumérico|14|0000000000|
|4|Data Geração|Informa a data de geração do arquivo.|Sim|datetime|17|20220119 09:43:10|
|5|Sequência|Número sequencial do arquivo.|Sim|número|2|1|
|6|Tipo do Arquivo|Tipo de Extrato. <br> Ex.: Arquivo de Liquidação|Sim|número|2|2|
|7|Data Mínima Liquidação*|Menor data de liquidação dos recebíveis.|Sim|date|8|20220118|
|8|Data Máxima Liquidação*|Maior data de liquidação dos recebíveis.|Sim|date|8|20220118|
|9|Data Mínima Prevista*|Menor data prevista dos recebíveis liquidados no dia.|Sim|date|8|20220118|
|10|Data Máxima Prevista*|Maior data prevista dos recebíveis liquidados no dia.|Sim|date|8|20220118|
|11|Reprocessado|Informa se o arquivo foi gerado através do fluxo de reprocessamento.|Sim|número|1|0 (Falso) ou 1 (Verdadeiro)|

*Não obrigatórios, poderão vir vazios na ausência de movimento no dia.

### Registro 1 - Recebível

Identifica o recebível e sua liquidação:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo de Registro|Indica o tipo de registro. <br>1 - Recebível|Sim|número|2|1|
|2|Identificador do Recebível|Identificador único da Unidade de Recebível.|Sim|GUID|36|1B917293-8B8D-4180-B2D8-C514A1F8512D|
|3|Data Prevista de Liquidação|Data prevista de Liquidação.|Sim|date|8|20220110|
|4|Código do Produto|Identificador do tipo de produto. Veja a [Tabela III](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iii-produtos)|Sim|número|2|1|
|5|Código da Bandeira|Identificador da bandeira ou banco. Veja a [Tabela IV](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iv-bandeiras).|Sim|número|2|1|
|6|Valor Total da UR|Valor acumulado da Unidade de Recebível.|Sim|número|20|R$ 10000,00 = 1000000|
|7|Valor Total Previamente Liquidado|Valor total já liquidado da UR informados em arquivos anteriores.|Sim|número|20|R$ 10000,00 = 1000000|
|8|Valor Liquidado|Valor liquidado da UR no arquivo atual.|Sim|número|20|R$ 10000,00 = 1000000|

### Registro 2 - Grupos de Pagamento

Identifica detalhes da liquidação do recebível:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo de Registro|Identifica o tipo de registro. <br> 2 - Grupo de Pagamento|Sim|número|1|2|
|2|Tipo de Liquidação|Informa o tipo de liquidação. Veja a [Tabela VIII](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-viii-tipos-de-liquida%C3%A7%C3%A3o).|Sim|número|2|1|
|3|Status da Liquidação*|Informa o status da liquidação. Veja a [Tabela X](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-x-status-da-liquida%C3%A7%C3%A3o).|Sim|número|2|1|
|4|Valor Liquidado*|Valor pago do grupo de pagamento.|Sim|número|2|R$ 1000,00 = 100000|
|5|Data de Liquidação*|Data na qual ocorreu o pagamento.|Sim|date|8|20220118|
|6|ISPB*|Código ISPB (Identificador Sistema de Pagamentos Brasileiro) do banco.|Sim|alfanumérico|8|01027058|
|7|CompeCode*|Código COMPE do banco.|Sim|alfanumérico|3|362|
|8|Número da Agência*|Número da agência bancária.|Sim|alfanumérico|15|3452|
|9|Dígito da Agência*|Dígito da agência bancária.|Sim|alfanumérico|1|1|
|10|Número da conta*|Número da conta bancária.|Sim|alfanúmérico|20|256545|
|11|Dígito da conta*|Dígito da conta.|Sim|alfanumérico|1|1|
|12|Tipo de conta*|Tipo de conta. Veja a [Tabela IX](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-ix-tipos-de-contas).|Sim|alfanumérico|2|3|
|13|Nome do titular da conta*|Nome do titular da conta.|Sim|alfanumérico|200|NOME TITULAR|
|14|Número do Documento do Titular da Conta*|Número de documento do titular da conta (CPF ou CNPJ).|Sim|alfanumérico|14|234|
|15|Beneficiário da troca de titularidade**|Número do documento do beneficiário da troca de titularidade (CPF ou CNPJ).|Sim|alfanumérico|14|0000000000|
|16|Número do Protocolo do Contrato***|Identificador do efeito de protocolo recebido da registradora que informou a troca de titularidade.|Sim|GUID|36|485BDD77-BA55-4447-AC10-AA38F97CFC49|

\*Obrigatórios se o tipo de liquidação for diferente de troca de titularidade.<br>
\**Obrigatório se o tipo de liquidação for troca de titularidade.<br>
\***Obrigatório se o tipo de liquidação for diferente de Braspag.

### Registro 3 - Agenda Financeira/Evento Transacional

Identifica os lançamentos na agenda financeira com base no eventro transacional:

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo Registro|Indica o tipo de registro. <br> 3 - Agenda Financeira |Sim|número|2|3|
|2|Identificador do Evento|Identificador único do evento lançado na agenda financeira.|Sim|GUID|36|4717A632-D6C4-4B74-9422-235905D1857D|
|3|Identificador Origem|Identificador originador da agenda financeira, identificador do evento transacional.|Sim|GUID|36|D8D26880-7BBB-4761-A2A7-B4C835B4923C|
|4|Identificador Estabelecimento|Identificador do estabelecimento.|Sim|GUID|36|5CB61E99-1B4D-4E7A-886F-6BFB4FF71219|
|5|Número do Documento|Identifica o número do CPF/CNPJ do participante.|Sim|alfanumérico|17|00000000000|
|6|Número da Parcela|Identifica a parcela a ser liquidada.|Sim|número|2|10|
|7|Tipo do Evento|Identifica o tipo de evento lançado na agenda financeira. Veja a [Tabela VI](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-vi-eventos-financeiros).|Sim|número|2|23|
|8|Tipo de Evento Transacional|Identifica o tipo de evento transacional originador do lançamento em agenda.|Sim|número|2|1|
|9|Data Prevista Liquidação|Data prevista da liquidação.|Sim|número|8|AAAAMMDD|
|10|Valor Líquido Agenda|Valor líquido a ser liquidado.|Sim|número|20|R$100,01 = 10001|
|11|Identificador do Evento Transacional|Identificador do evento transacional. Quando é uma transação, este campo é igual ao Identificador da Transação.|Sim|GUID|36|D6CDD768-CDFE-479A-B090-CD03253EEE2B|
|12|Data do Evento Transacional|Data em que a operação ocorreu. Para a transação, representa a data de autorização. Para os demais, representa a data em que a operação ocorreu.|Sim|datetime|17|20220119 09:43:10|
|13|Data de Confirmação|Data em que a operação foi efetivada.<br>Transação - Captura<br>Cancelamento - Confirmação do cancelamento.|Sim|date|17|20220119|
|14|Data de Agendamento|Data em que o evento foi processado em agenda financeira.|Sim|datetime|17|20220119 09:43:10|
|15|Valor da Operação|Valor da operação em centavos. Podendo ser um valor positivo ou negativo.|Não|número|20|R$100,01 = 10001|
|16|Taxa Administrativa (MDR)|Percentual aplicado ao valor bruto da operação.|Não|número|20|R$100,01 = 10001|
|17|Valor Taxa Administrativa|Valor calculado da traxa administrativa em centavos sobre o evento transacional.|Não|número|20|R$100,01 = 10001|
|18|Tarifa Administrativa (Fee)|Tarifa fixa cobrada por transação. Valor cobrado separadamente em agenda financeira.|Não|número|20|R$100,01 = 10001|
|19|Valor Taxa Receba Rápido|Valor descontado para adiantamento dos sellers pelo Receba Rápido.|Não|número|20|R$100,01 = 10001|
|20|Tarifa Boleto|Tarifa cobrada pelo boleto emitido ou pago para transações de boleto.|Não|número|20|R$100,01 = 10001|
|21|Valor Bruto Venda Direta|Valor bruto de venda direta do Master, caso o mesmo seja um participante da transação vendendo um produto.|Não|20|R$100,01 = 10001|
|22|Valor Taxa Admnistrativa Venda Direta**|Valor calculado da taxa administrativa, em centavos, sobre a venda direta.|Não|número|20|R$100,01 = 10001|
|23|Valor Líquido Venda Direta|Valor líquido da venda direta.|Não|número|20|R$100,01 = 10001|
|24|Valor Bruto Comissão|Valor bruto de comissão recebido pelo Master.|Não|número|20|R$100,01 = 10001|
|25|Valor Taxa Administrativa Comissão|Valor calculado da taxa administrativa, em centavos, sobre a comissão, incluindo a taxa de Receba Rápido.|Não|número|20|R$100,01 = 10001|
|26|Valor Líquido Comissão|Valor líquido da comissão recebido dos sellers.|Não|número|20|R$100,01 = 10001|
|27|Identificador da Transação|Identificador da transação.|Sim|GUID|36|D6CDD768-CDFE-479A-B090-CD03253EEE2B|
|28|Data de Autorização|Data da venda.|Sim|datetime|17|20220119 09:43:10|
|29|Código do Ajuste|Código que identifica o ajuste financeiro lançado em agenda. Veja a [Tabela VII](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-vii-ajustes-financeiros).|Sim|alfanumérico|4|A001|
|30|Data de Captura|Data de confirmação da transação.|Sim|date|8|20220119|
|31|Valor da Transação|Valor da transação em centavos.|Sim|número|20|R$100,01 = 10001|
|32|Código do Produto|Código que identifica o produto. Veja a [Tabela III](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iii-produtos).|Sim|número|2|2|
|33|Código da Bandeira|Código que identifica a bandeira ou banco. Veja a [Tabela IV](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iv-bandeiras).|Sim|número|2|1|
|34|Código de Autorização|Código de autorização da transação. Este número não é único e pode se repetir.|Sim|alfanumérico|10|251411|
|35|NSU/DOC|Número sequencial da transação, também conhecido como DOC (número do documento), que identifica a transação no dia em que ela foi realizada. Este número não é único e pode se repetir.|Sim|alfanumérico|8|053181|
|36|Total de Parcelas|Total de pacelas da transação.|Sim|número|2|10|
|37|Número do Pedido|Número do pedido informado pelo estabelecimento na transação.|Sim|número|50|1234567891011|
|38|Número do cartão truncado|Número truncado do cartão que efetuou a compra.|Sim|alfanumérico|19|111111*******1111|
|39|Identificador Transação Adquirente|Identificador da transação na adquirente para transações de e-commerce (TID).|Sim|alfanumérico|20|99999999111Q1A2A3A4A|
|40|Número Lógico do Terminal|Número Lógico do Terminal em que ocorreu a transação.|Sim|alfanumérico|50|99999999|
|41|Meio de Captura|Meio pelo qual a transação foi capturada. Veja a [Tabela V](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-v-meios-de-captura).|Sim|número|2|1|
|42|Indicador de Comissão|Indica se o lançamento em agenda refere-se à comissão do Master ou não.<br>0 - Não;<br>1- Sim|Não|número|1|0|

<aside class="notice">Os campos compreendidos entre a posição 11 e 41 não serão exibidos caso o Tipo do Evento seja igual a 41, 42 ou 43.</aside>

### Registro 4 - Balanceamento de Saldo

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo Registro|Indica o tipo de registro.<br>4 - Balanceamento de Saldo|Sim|número|2|4|
|2|Data da Posição|Data da posição do saldo negativo.|Sim|date|8|20220119|
|3|Código do Produto|Código que identifica o produto. Veja a [Tabela III](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iii-produtos).|Sim|número|2|1|
|4|Código da Bandeira|Código que identifica a bandeira ou banco. Veja a [Tabela IV](https://braspag.github.io//manual/split-de-pagamentos-extrato-eletronico#tabela-iv-bandeiras).|Sim|número|2|1|
|5|Valor Inicial|Valor inicial do saldo negativo.|Sim|número|20|R$100,01 = 10001|
|6|Valor Lançado|Valor lançado no processo de balanceamento.|Sim|número|20|R$100,01 = 10001|
|7|Valor Final|Valor final do saldo negativo após balanceamento.|Sim|número|20|R$100,01 = 10001|

### Registro 5 - Balanceamento de Saldo por Estabelecimento

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo Registro|Indica o tipo de registro.<br>5 - Balanceamento de Saldo por Estabelecimento|Sim|número|2|5|
|2|Identificador Estabelecimento|Identifica o estabelecimento.|Sim|GUID|36|5CB61E99-1B4D-4E7A-886F-6BFB4FF71219|
|3|Valor Inicial|Valor inicial do saldo negativo.|Sim|número|20|R$100,01 = 10001|
|4|Valor Lançado|Valor lançado no processo de balanceamento.|Sim|número|20|R$100,01 = 10001|
|5|Valor Final|Valor final do saldo negativo após balanceamento.|Sim|número|20|R$100,01 = 10001|

### Registro 9 - Rodapé

|Posição|Campo|Descrição|Extrato Seller|Tipo|Tamanho|Exemplo|
|-|-|-|-|-|-|-|
|1|Tipo do registro|Indica o tipo de registro.<br>9 - Rodapé (Fim do arquivo)|Sim|número|2|9|
|2|Quantidade de Registros|Quantidade de registros do arquivo excluindo o cabeçalho e o rodapé.|Sim|número|20|1000|

# Tabelas Adicionais

## Tabela I - Tipos de Estabelecimento

|Código|Descrição|
|-|-|
|3|Master|
|4|Seller|

## Tabela II - Eventos Transacionais

|Código|Tipo do Evento|Descrição|
|-|-|-|
|1|Transação|É o evento que representa uma venda de cartão de crédito ou débito.|
|2|Reversão da Transação|É o evento interno que realiza a reversão de uma transação e com isso lança valores na agenda revertendo e debitando os lançamentos da transação original.|
|3|Cancelamento|É o evento que representa o cancelamento/estorno de uma venda.|
|4|Reversão do Cancelamento|É o evento interno que realiza a reversão de um cancelamento e com isso lança valores na agenda revertendo e compensando os lançamentos da transação original.|
|5|Chargeback|É o evento que representa o chargeback de uma compra.|
|6|Reversão do Chargeback|É o evento interno que realiza a reversão de um cancelamento e com isso lança valores na agenda revertendo e compensando os lançamentos da transação original.|
|10|Cobrança Antifraude|É o evento que representa a cobrança da taxa de antifraude em uma venda.|
|11|Boleto Emitido|É o evento que representa a taxa sobre o boleto emitido.|
|12|Boleto Pago|É o evento que representa a venda e a taxa sobre o boleto que foi pago.|
|13|Ajuste Financeiro|É o evento que faz um lançamento financeiro na agenda com objetivo de regularizar compensação de valores.|
|14|Ajuste Debit Balance|É o evento que faz um lançamento financeiro na agenda com objetivo de compensar valores.|

## Tabela III - Produtos

|Código|Descrição|
|-|-|
|1|Cartão de Crédito|
|2|Cartão de Débito|
|3|Boleto|

## Tabela IV - Bandeiras

|Código|Descrição|
|-|-|
|1|Visa|
|2|Mastercard|
|3|Amex|
|4|Elo|
|7|Diners|
|9|Hipercard|
|19|Boleto|

## Tabela V - Meios de Captura

|Código|Descrição|
|-|-|
|1|E-commerce|
|2|POS|
|3|Captura Única|
|4|TEF|

## Tabela VI - Eventos Financeiros

|Código|Tipo do Evento|Descrição|
|-|-|-|
|1|Credit|Evento de crédito de parcelas de uma transação.|
|2|Debit|Evento de débito de parcelas de uma transação.|
|4|FeeDebit|Evento de débito da tarifa transacional.|
|5|RefundCredit|Evento de crédito devido a um cancelamento.|
|6|RefundDebit|Evento de débito devido a um cancelamento.|
|7|ChargebackCredit|Evento de crédito devido a um chargeback.|
|8|ChargebackDebit|Evento de débito devido a um chargeback.
|9|UndoChargebackCredit|Evento de crédito devido a um desfazimento de chargeback.|
|10|UndoChargebackDebit|Evento de débito devido a um desfazimento de chargeback.|
|12|AntiFraudFeeDebit|Evento de débito da tarifa de antifraude.|
|15|AdjustmentCredit|Evento de ajuste a crédito em agenda financeira.|
|16|AdjustmentDebit|Evento de ajuste a débito em agenda financeira.|
|17|ChargebackReversalCredit|Evento de crédito devido a uma reversão de chargeback.|
|18|ChargebackReversalDebit|Evento de débito devido a uma reversão de chargeback.|
|24|RefundReversalCredit|Evento de rédito devido a uma reversão de cancelamento.|
|25|RefundReversalDebit|Evento de débito devido a uma reversão de cancelamento.|
|26|ReversalPayoutCredit|Evento de crédito devido a reversão de agendamento de uma transação.|
|27|ReversalPayoutDebit|Evento de débito devido a reversão de um agendamento de uma transação.|
|28|ReversalFeeCredit|Evento de crédito devido a reversão de agendamento da tarifa transacional.|
|31|BankSlipFeeDebit|Evetno de débito da tarifa de cobrança de boleto.|
|36|ReversalAntiFraudFeeCredit|Evento de crédito devido a reversão da cobrança da tarifa de antifraude.|
|38|ReversalBankSlipFeeCredit|Evento de crédito devido a reversão da cobrança da tarifa do boleto.|
|41|CompensationBetweenSamePaymentArrangementDebit|Evento de débito para balanceamento de saldo dentro do mesmo arranjo de pagamento.|
|42|ScheduleBalanceCredit|Evento de crédito para balanceamento de saldo dentro do mesmo arranjo de pagamento e estabelecimentos de mesmo CNPJ/CPF.|
|43|ScheduleBalanceDebit|Evento de débito para balanceamento de saldo dentro do mesmo arranjo de pagamento e estabelecimentos de mesmo CNPJ/CPF.|
|45|DebitBalanceCompensationVoid| Evento de crédito devido a compensação de saldo devedor em agenda quando a cobrança do valor do cancelamento da transação já liquidada não pode ser feita nos casos em que a transação não conste na Unidade de Recebíveis ou seu negócio não tenha saldo disponível nela.|
|46|DebitBalanceCompensationChargeback|Evento de crédito devido a compensação de saldo devedor em agenda quando a cobrança do valor do chargeback efetivado não pode ser feita nos casos em que a transação não conste na Unidade de Recebíveis ou seu negócio não tenha saldo disponível nela.|

## Tabela VII - Ajustes Financeiros

|Código|Descrição|Tipo|
|-|-|-|
|A001|Ajuste para compensação de saldo negativo.|Balanceamento de Saldo|
|A002|Ajuste para correção de lançamentos.|Correção|
|A003|Ajuste de valores lançados/cobrados indevidamente.|Acerto|
|A004|Multa por excesso de chargeback.|Acerto|
|A005|Tarifa por retentativa de transações (bandeiras).|Acerto|

## Tabela VIII - Tipos de Liquidação

|Código|Descrição|
|-|-|
|0|Braspag*|
|1|Troca de Titularidade|
|2|Ônus - Cessão Fiduciária|
|3|Ônus - Outros|
|4|Bloqueio Judicial|

<aside class="notice">Tipo de Liquidação Braspag indica que os valores foram liquidados para o domicílio cadastrado na plataforma e sobre este valor não ocorreu qualquer efeito de contrato.  Os demais tipos indicam que a liquidação ocorreu em um domicílio conforme instrução enviada nos efeitos de contrato recebidos das registradoras.</aside>

## Tabela IX - Tipos de Contas

|Código|Descrição|
|-|-|
|1|Conta Corrente|
|2|Conta Poupança|
|3|Conta de Pagamento|
|4|Conta de Depósito|
|5|Conta Garantida|
|6|Conta Investimento|

## Tabela X - Status da Liquidação

|Código|Status|Descrição|
|---|---|---|
|1|Agendado|Indica que o recebível está agendado para liquidação de acordo com sua data prevista.|
|2|Pendente|Indica que a Braspag enviou os recebíveis para liquidação e está aguardando a resposta.|
|3|Liquidado|Indica que a liquidação ocorreu com sucesso.|
|4|Erro|Indica que a liquidação não foi realizada com sucesso.|
