---
layout: manual
title: Manual de Utilização do POS
description: Como Utilizar o POS-Virtual Braspag
search: true
categories: manual
translated: true
tags:
  - 7. POS Virtual
---
# POS Virtual

O POS Virtual é uma plataforma da Braspag destinada a lojistas que necessitam realizar vendas digitadas (ex.: operação de call center, empresas do segmento de turismo, etc), sem a necessidade do desenvolvimento de uma loja virtual. Você pode executar todo gerenciamento de suas vendas apenas acessando o Painel Administrativo Braspag.

# Criação de Grupos

É necessário criar pelo menos um grupo para que as vendas sejam realizadas no POS Virtual. O grupo determina quais são as permissões que um determinado operador possui.

Para criar um grupo, acesse `Configurações` > `Grupos` e preencha corretamente os campos identificados abaixo:
![]({{ site.baseurl_root }}/images/braspag/posvirtual/criargrupos.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Nome|Nome do grupo.|SIM|
|Permissões|Permissões que este grupo poderá ter.|SIM|

<br/>As permissões são as seguintes:

|Permissão|
|---------|
|Alterar data da próxima cobrança da recorrência.|
|Alterar data fim da recorrência.|
|Alterar dia da recorrência.|
|Alterar periodicidade da recorrência.|
|Alterar valor da recorrência.|
|Ativar/Desativar pedido de recorrência.|
|Cancelar transação.|
|Cancelar transação via relatório.|
|Cancelar transações de todos usuários.|
|Capturar transação.|
|Capturar transação via relatório.|
|Criar transação.|
|Estornar transação via relatório.|
|Visualizar pedidos de recorrência.|
|Visualizar suas transações.|
|Visualizar transações recorrentes.|

# Criação de Operadores

Através do usuário "gerente", é possível criar usuários operadores, que terão permissão para realizar novas vendas.

Acesse `Configurações` > `Operadores` e preencha corretamente o formulário abaixo. Assim que os dados forem submetidos, um e-mail com as instruções será enviado no endereço cadastrado.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/cadastraroperador.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Usuário|*Username* a ser utilizado para acessar o POS.|SIM|
|Nome|Nome do operador.|SIM|
|E-mail|E-mail do operador.|SIM|
|Grupo|Grupo de permissão a que o operador pertence.|SIM|
|Lojas|Lojas para as quais o operador fará as vendas.|SIM|

# Realização de Venda

Para a criação de um novo pedido, o usuário deverá acessar a tela através do menu: `POS Virtual` > `Realizar Venda`.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/menucriarpedido.png)

## Passo a Passo

A tela de criação de um novo pedido pelo POS Virtual é dividida em blocos com campos obrigatórios e não obrigatórios.

Alguns blocos são opcionais de serem exibidos na tela e, para os mesmos ficarem disponíveis, é necessário configurá-los no momento do setup do seu POS Virtual.

A seguir iremos explicar passo a passo quais os blocos disponíveis com seus campos e a obrigatoriedade de cada campo referente ao bloco que pertence.

### Dados do Pedido

Neste passo é possível informar os dados do pedido.
<br/>O campo de e-mail é opcional, e pode ser configurado para ser exibido na tela de criação de um novo pedido no momento do setup do seu POS Virtual.
<br/>Abaixo a descrição e obrigatoriedade de cada campo.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/camposdadosdopedido.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Número do Pedido|Identificador do pedido da loja.|SIM|
|Nome|Nome do cliente.|SIM|
|CPF/CNPJ|CPF/CNPJ do cliente.|SIM|
|E-mail|E-mail do cliente.|NÃO|

### Endereço de Entrega

Neste passo é possível informar os dados do endereço de entrega do pedido.
<br/>Os campos com os dados de endereço de entrega são opcionais, e podem ser configurados para serem exibidos na tela de criação de um novo pedido no momento do setup do seu POS Virtual.  
<br/>Abaixo a descrição e obrigatoriedade de cada campo.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/camposdadosendereco.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Rua|Nome da rua do endereço de entrega do cliente.|NÃO|
|Número|Número do endereço de entrega do cliente.|NÃO|
|Complemento|Complemento do endereço de entrega do cliente.|NÃO|
|Cidade|Cidade do endereço de entrega do cliente.|NÃO|
|Estado|Estado do endereço de entrega do cliente.|NÃO|
|Bairro|Bairro do endereço de entrega do cliente.|NÃO|
|CEP|CEP do endereço de entrega do cliente.|NÃO|
|País|País do endereço de entrega do cliente.|NÃO|

### Dados da Recorrência

Neste passo é possível informar os dados do pedido criando uma recorrência com uma das 3 opções:

* Agendar para uma data futura
* Cobrar agora e agendar as demais recorrências para o mesmo dia
* Cobrar agora e agendar as demais recorrências para um dia diferente

<br/>Os campos com os dados para criação de um pedido de recorrência são opcionais, e podem ser configurados para serem exibidos na tela de criação de um novo pedido no momento do setup do seu POS Virtual.

Para cada opção de recorrência abaixo os campos têm comportamentos de obrigatoriedade diferentes.

<br/>
**Opção 1: Agendar para uma Data Futura**

Nesta opção uma recorrência será agendada de acordo com as informações fornecidas nos campos exibidos abaixo. Neste caso o cliente só será cobrado quando a primeira recorrência ocorrer, ou seja, no dia da data início informada.

O fim de uma recorrência dependerá da data fim informada. Caso não seja informada nenhuma data, a mesma tem o perfil de uma recorrência “infinita”.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadosdarecorrencia1.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Intervalo|Intervalo da recorrência. Obs.: por padrão, "Mensal".|SIM|
|Data Início|Data para início da recorrência.|SIM|
|Data Fim|Data para término da recorrência.|NÃO|

<br/>
**Opção 2: Cobrar Agora e Agendar as Demais Recorrências para o Mesmo Dia**

Nesta opção uma recorrência será criada e a primeira recorrência será cobrada de imediato. As demais recorrências sempre irão ocorrer no mesmo dia da data de início da recorrência.

O fim de uma recorrência dependerá da data fim informada. Caso não seja informada nenhuma data, a mesma tem o perfil de uma recorrência “infinita”.

![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadosdarecorrencia2.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Intervalo|Intervalo da recorrência. Obs.: por padrão, "Mensal".|SIM
|Data Início|Data para início da recorrência. Obs.: Não é possível alterar.|SIM
|Dia das demais recorrências|Dia em que as demais recorrências irão acontecer. Ex.: a próxima neste exemplo será em 02/10/2016. Obs.: Não é possível alterar.|SIM|
|Data Fim|Data para término da recorrência.|NÃO|

<br/>
**Opção 3: Cobrar agora e agendar as demais recorrências para um dia diferente**

Nesta opção uma recorrência será criada e a primeira recorrência será cobrada de imediato. As demais recorrências sempre irão ocorrer no dia definido para o campo “Dia das demais recorrências”.

O fim de uma recorrência dependerá da data fim informada. Caso não seja informada nenhuma data, a mesma tem o perfil de uma recorrência “infinita”.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadosdarecorrencia3.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Intervalo|Intervalo da recorrência. Obs.: por padrão, "Mensal".|SIM|
|Data Início|Data para início da recorrência. Obs.: Não é possível alterar.|SIM|
|Dia das demais recorrências|Dia em que as demais recorrências irão acontecer. Ex.: a próxima poderá ser em 15/10/2016, por exemplo.|SIM|
|Data Fim|Data para término da recorrência.|NÃO|

### Endereço de Cobrança

Neste passo é possível informar os dados do endereço de cobrança do pedido.

Os campos com os dados de endereço de cobrança são opcionais, e podem ser configurados para serem exibidos na tela de criação de um novo pedido no momento do setup do seu POS Virtual.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/camposdadosenderecocobranca.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Rua|Nome da rua do endereço de cobrança do cliente.|NÃO|
|Número|Número do endereço de cobrança do cliente.|NÃO|
|Complemento|Complemento do endereço de cobrança do cliente.|NÃO|
|Cidade|Cidade do endereço de cobrança do cliente.|NÃO|
|Estado |Estado do endereço de cobrança do cliente.|NÃO|
|Bairro|Bairro do endereço de cobrança do cliente.|NÃO|
|CEP|CEP do endereço de cobrança do cliente.|NÃO|
|País|País do endereço de cobrança do cliente.|NÃO|

### Dados de Pagamento

Neste passo é possível informar os dados do pagamento do pedido.

Para o campo "Meio de Pagamento", as bandeiras estarão disponíveis de acordo com as opções de meios de pagamentos configurados para o seu POS Virtual.

![]({{ site.baseurl_root }}/images/braspag/posvirtual/dadospagamento.png)

|Campo|Descrição|Obrigatório?|
|-----|---------|------------|
|Meio de Pagamento|Bandeira do cartão de crédito.|SIM|
|Portador|Nome do portador do cartão de crédito.|SIM|
|Número do Cartão|Número do cartão de crédito do cliente.|SIM|
|Código de Segurança|Código de segurança do cartão de crédito.|SIM|
|Validade|Validade do cartão de crédito.|SIM|
|Valor|Valor do pedido.|SIM|
|Número de Parcelas|Quantidade de parcelas do pedido. Obs.: Caso seja um pedido de recorrência, este campo não é obrigatório e o mesmo é ocultado na tela.|SIM|

## Pagar ou Limpar

Através do botão `Pagar`, o pedido será criado de acordo com os dados preenchidos nos campos citados acima.

Caso o seu POS Virtual esteja configurado com a opção de “captura automática”, ao clicar em pagar, o pedido será autorizado e capturado imediatamente. Caso contrário, o pedido será somente autorizado e, através da opção “capturar” em “Ações” na lista de pedidos, será possível realizar a captura do pedido.  

O botão `Limpar` limpa todos os campos da tela de criação de um novo pedido.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/btnpagarlimpar.png)

# Lista de Pedidos

Nesta sessão serão exibidos todos os pedidos realizados pelo operador.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/listapedidos.png)

Acima da lista de pedidos, existem duas legendas com informações dos totais. Estas representam o valor total pago e o valor total pendente de captura.

* Total pago - valor total de pedidos capturados na lista de pedidos.
* Total pendente de captura - valor total de pedidos que foram apenas autorizados, ou seja, estão passíveis de serem capturados.
<br/>
A coluna “Ações” possui links onde o usuário poderá tomar a ação desejada dentre as apresentadas a seguir.

## Capturar

Esta ação ficará disponível para o usuário caso o seu POS Virtual no momento do setup não desejar que a forma de pagamento seja com captura automática. Ou seja, ao realizar o passo 7 clicando no botão `Pagar`, o pedido será autorizado apenas, necessitando da ação de clicar no link “Capturar” do usuário para mudar o status de “Não Pago” para “Pago”. <br/>Para esta opção, no momento do setup do seu POS Virtual, é possível escolher por captura parcial ou total.

### Captura Parcial

É a ação de capturar um determinado valor menor que o valor autorizado. Ex.:

* Transação autorizada de R$ 100,00
* Captura parcial de R$ 50,00
<br/>
Caso a opção seja por captura parcial no setup do seu POS Virtual, ao clicar no link “Capturar”, a tela abaixo será exibida ao usuário, permitindo assim a escolha do valor a ser capturado.
![]({{ site.baseurl_root }}/images/braspag/posvirtual/capturar.png)

<aside class="warning">A ação de capturar só poderá ocorrer uma única vez. Portanto, caso seja realizada uma captura parcial conforme exemplo acima, os R$ 50,00 restantes não poderão mais ser capturados, disponibilizando novamente esses R$ 50,00 no limite do cliente. </aside>

### Captura Total

É a ação de capturar o valor total autorizado. Ex.:

* Transação autorizada de R$ 100,00
* Captura total de R$ 100,00

<aside class="warning">Caso no momento do setup do seu POS Virtual a configuração seja de pagamento com captura automática, o link “Capturar” não será exibido como uma das possíveis ações a serem tomadas na lista de pedidos. Ao realizar o passo 7, clicando no botão “Pagar”, o pedido será autorizado e capturado no mesmo instante. </aside>

## Cancelar

Esta ação poderá ser tomada para o usuário cancelar um pedido. Sendo assim, o limite do cliente ficará disponível novamente em seu cartão.

Será exibida uma tela de confirmação do cancelamento conforme imagem abaixo:

![]({{ site.baseurl_root }}/images/braspag/posvirtual/cancelar.png)

## Imprimir

Esta ação poderá ser tomada para o usuário imprimir um comprovante com os dados do pedido.

A impressão terá os detalhes do pedido conforme imagem abaixo:

![]({{ site.baseurl_root }}/images/braspag/posvirtual/imprimir.png)
