---
layout: tutorial
title:  Integração VTEX
description: Integração VTEX
toc_footers: false
categories: tutorial
translated: true
sort_order: 4
tags:
    - 2. Módulos

---

# Integração VTEX

A Cielo desenvolveu um conector na plataforma de e-commerce VTEX para realização do pagamento através das APIs de pagamento online da Cielo.  A usabilidade da plataforma deve ser consultada no [tutorial da VTEX](https://help.vtex.com/tutorial/){:target="_blank"}.

# Configuração

Para a configuração estar completa é preciso cadastrar **Afiliação de pagamento** para posteriormente vincular a uma **Condição de pagamento**.

Para mais informações, visite os artigos de suporte da VTEX: [Cadastrar afiliações de gateway](https://help.vtex.com/pt/tutorial/afiliacoes-de-gateway--tutorials_444){:target="_blank"} e [Configurar condições de pagamento](https://help.vtex.com/pt/tutorial/condicoes-de-pagamento--tutorials_455){:target="_blank"}.

## Afiliação de Pagamento

### 1. Acessando o Painel VTEX

Acesse o painel **ADMIN VTEX** (https://*nomedaloja*.myvtex.com/admin) e comece a navegação por **Transações** > **Pagamentos** > **Configurações** > **Afiliações de gateways** > **+**

![Afiliação]({{ site.baseurl_root }}/images/braspag/pagador/vtex/00-afiliacao.png)

### 2. Selecionando o Conector

> Apenas o conector CieloEcommerce receberá manutenção e atualização. Não é recomendada a configuração com outros conectores. [Veja como migrar entre conectores](https://suporte.braspag.com.br/hc/pt-br/articles/18072079824155-Como-fazer-a-migra%C3%A7%C3%A3o-entre-conectores-VTEX-){:target="_blank"}.

<aside class="notice">O número do pedido que é exibido na tela do comprador é registrado na VTEX como informação "orderId" para o conector CieloEcommerce e como "reference" para o conector Braspag. Portanto, preste atenção ao migrar de um conector para o outro.</aside>

Selecione o conector **CieloEcommerce** e insira as informações conforme recebidas após a contratação da solução.
 
![CieloEcommerce]({{ site.baseurl_root }}/images/braspag/pagador/vtex/01-cieloecommerce.jpeg)

Veja as diferenças entre conectores legados e o novo conector **CieloEcommerce**:

|Meios de Pagamento|Braspag|Braspag V2|Cielo V3|Cielo V4|CieloEcommerce|
|-|-|-|-|-|-|
|Boleto|**Gateway**:<br>- BancoDoBrasil2<br>- Bradesco2|Não se aplica|**Adquirência**:<br>- BancoDoBrasil2<br>- Bradesco2|Não se aplica|Não se aplica|
|Boleto Registrado|**Gateway**:<br>- BancoDoBrasil2<br>- Bradesco2|Não se aplica|**Adquirência**:<br>- BancoDoBrasil2<br>- Bradesco2|Não se aplica|**Adquirência**:<br>- Bradesco2<br>- BancoDoBrasil2<br>- BancoDoBrasil3<br>**Gateway**:<br>- Bradesco2<br>- BancoDoBrasil2<br>- BancoDoBrasil3<br>- Braspag<br> - ItauShopline<br>- Caixa2 <br>- CitiBank2<br>- Santander2|
|Crédito|**Gateway**:<br>- Banorte<br>- Redecard<br>- Ditef<br>- Amex 2P <br>- PagosOnLine<br>- PayVision<br>- Sitef<br>- GetNet<br>- Sub1 <br>- Credibanco<br>- E-rede2<br>- E-rede<br>- SafraPay| **Gateway**:<br>- Cielo30<br>- Rede2|**Adquirência**:<br> - Cielo|**Adquirência**:<br>- Cielo|**Adquirência**:<br>- Cielo<br> **Gateway**:<br>- Cielo30<br>- Getnet<br>- Rede2 <br>- Safra2<br>- Sub1<br>- Banorte<br>- Credibanco2<br>- FirstData<br>- GlobalPayment<br>- Stone<br>- Transbank2<br>- Banese* <br> - BrasilCard* <br>- Carrefour* <br>- CredSystem* <br>- Credz* <br>- Dmcard*|
|Débito|**Gateway**:<br>- Cielo3.0<br>- GetNet<br>- Rede2|**Gateway**:<br>- Cielo3.0<br>- Rede2|**Gateway**:<br>- Cielo|**Gateway**:<br>- Cielo|**Adquirência**:<br>- Cielo<br>**Gateway**:<br>- Cielo30<br>- FirstData<br>- Getnet<br>- GlobalPayment<br>- Rede2<br>- Safra2|
|Pix|Não se aplica|Não se aplica|Não se aplica|Não se aplica|**Adquirência**:<br>- Bradesco2<br>- Cielo <br>**Gateway**:<br> - Cielo30<br>- Bradesco2|
|Voucher|Não se aplica|**Gateway**:<br>- Ticket|**Adquirência**:<br>- Alelo|Não se aplica|**Adquirência**:<br> - Alelo<br>**Gateway**:<br>- Ticket<br>- Alelo|

*Bandeira própria

> * A solução **Antifraude Braspag** é oferecida por todos os conectores.<br>
> * As soluções **3DS 2.0** e **Split de Pagamentos** são oferecidas apenas pelo conector CieloEcommerce.

### 3. Escolhendo o Nome da Afiliação

Insira o Nome da Afiliação:

> É preciso configurar o mesmo conector com cada tipo de pagamento desejado, por isso preste atenção ao Nome da Afiliação utilizado. Sugerimos incluir no nome o provedor e meio de pagamento configurado, para facilitar o reconhecimento. Veja o exemplo:

![Nome da Afiliação]({{ site.baseurl_root }}/images/braspag/pagador/vtex/02-nome-afiliacao-ticket.jpeg)

#### Exemplos de Nome da Afiliação

|Exemplo|Definição|
|-|-|
|CieloEcommerce - Ticket|Nesse exemplo o título relembra que qualquer condição de pagamento que utilizar essa afiliação vai utilizar Ticket como o provider.|
|CieloEcommerce - Cielo30 c/ 3DS c/ SPLIT|Nesse exemplo o título relembra que qualquer condição de pagamento que utilizar essa afiliação vai utilizar Cielo30 como o provider, fazer a autenticação com 3DS (se compatível) e realizar SPLIT de pagamento (se compatível).

### 4. Preenchendo Dados Necessários

Preencha os campos com os dados requisitados. A imagem a seguir é um **exemplo** do preenchimento para o conector **CieloEcommerce**; consulte a tabela [Dados da Afiliação](https://braspag.github.io//tutorial/integracao-vtex#dados-da-afilia%C3%A7%C3%A3o) para verificar quais são os campos correspondentes ao conector desejado.

![1Dados Afiliação]({{ site.baseurl_root }}/images/braspag/pagador/vtex/03a-dados.jpg)
![2Dados Afiliação]({{ site.baseurl_root }}/images/braspag/pagador/vtex/03b-dados.jpg)

#### Dados da Afiliação

|Campo|Descrição|Conector|
|-|-|-|
|**Nome da Afiliação**|Insira nome identificador da afiliação.|Todos.|
|**Application Key**|Insira o MerchantID.| Todos.|
|**Application Token**|Insira o MerchantKey.| Todos. |
|**Integration**|Selecione **Adquirência** se o seu contrato é somente com a adquirência Cielo. <br>Selecione **Gateway** se o seu contrato é para utilização de outros provedores.|CieloEcommerce|
|**Provider**|Selecione o provedor  que deseja configurar a afiliação conforme o tipo de pagamento. <br>Exemplo: Se o seu provedor de Boleto é o Bradesco e o seu provedor de Crédito, Débito e Pix é o Cielo será necessário adicionar duas afiliações. <br>O provedor **Simulado** deve ser utilizado para transaçãoes de teste.<br>O provedor **Cielo** deve ser configurado para Integração **Adquirência**. <br>O provedor **Cielo30** deve ser configurado para Integração **Gateway**.|Todos.<br>Obs. 1: Braspag e CieloV3 possuem o provedor listado em cada tipo de pagamento.<br>Obs. 2: Cada conector possui uma lista de provedores aptos para seleção.|
|**UseSPLIT**|Insira “Sim” ou “Não” se deseja utilizar o SPLIT de pagamentos. Disponível para os tipos de pagamento crédito, débito e boleto.|BraspagV2, CieloEcommerce e CieloV4.|
|**UseMPI**|Insira “Sim” ou “Não” se deseja utilizar a **Autenticação 3DS 2.0**. Este campo é **obrigatório para o tipo de pagamento débito**.|BraspagV2, CieloEcommerce e CieloV4.|
|**MpiClientId**|ID do MPI, disponibilizado para o cliente pela Cielo. *Campo relacionado à autenticação 3DS***.|BraspagV2, CieloEcommerce e CieloV4.|
|**MpiClientSecret**|Chave secreta do MPI, disponibilizada para o cliente pela Cielo. *Campo relacionado à autenticação 3DS***.|BraspagV2, CieloEcommerce e CieloV4.|
|**MpiMerchantName**|Nome da loja, disponibilizado pela Cielo. *Campo relacionado à autenticação 3DS***.|BraspagV2, CieloEcommerce e CieloV4.|
|**MpiMCC**|Merchant Category Code da loja, disponibilizado pela Cielo. *Campo relacionado à autenticação 3DS***.|BraspagV2, CieloEcommerce e CieloV4.|
|**MpiEstablishmentCode**|Código de estabelecimento da loja, disponibilizado pela Cielo. *Campo relacionado à autenticação 3DS***.|BraspagV2, CieloEcommerce e CieloV4.|
|**SoftDescriptor**|Valor que será concatenado com o valor de cadastro na adquirente para identificação na fatura. Permite no máximo 13 caracteres.|CieloEcommerce.|
|**Captura**|Tempo em horas em que será enviada a solicitação de captura. Em **Padrão** ou **Desativado**, a captura será será realizada 4 dias após a autorização. Em **Imediatamente** a captura será realizada imeadiatamente após a autorização. Não configura Capture = ‘True’.|Braspag, CieloV3 e CieloEcommerce.|
|**Alterar tempo máximo para captura automática**|Tempo (em dias) em que a capatura deve ser solicitada. |Braspag e CieloV3.|
|**Ativar Divisão e tempos de captura**|Selecione **Sim** se for ativar divisão entre Marketplace e Seller. Selecione **Não** se não possuir divisão entre Marketplace e Seller.|BraspagV2, CieloEcommerce e CieloV4|
|**Responsabilidade pelas tarifas de pagamento. Essa configuração será enviada para o seu processador de pagamentos**|Selecione **Marketplace**, **Marketplace + Sellers** ou **Sellers**. Só será exibido se **Ativar Divisão** estiver preenchido com “Sim”.|BraspagV2, CieloEcommerce e CieloV4|
|**Responsabilidade pelos estornos. Essa configuração será enviada para o seu processador de pagamentos**|Selecione **Marketplace** ou **Marketplace + Sellers** ou **Sellers**. Só será exibido se **Ativar Divisão** estiver preenchido com “Sim”.|BraspagV2, CieloEcommerce e CieloV4|

* O preenchimento dos campos relacionados ao MPI é opcional; você pode escolher preencher os dados de MPI e deixar a opção **UseMpi** desativada ("No") e, mais tarde, caso deseje ativar o 3DS para esta afiliação, apenas altere a opção **UseMpi** para "Yes".

Após salvar o conector, ele irá aparecer na lista **Processar com afiliação** da tela de configuração da **Condição de Pagamento**. 

## Condição de Pagamento

### 1. Adicionando Nova Condição de Pagamento

Acesse **Transações** > **Configurações** > **Condições de Pagamento** > **+**

![Condições de pagamento]({{ site.baseurl_root }}/images/braspag/pagador/vtex/04-condicao.jpeg)

### 2. Configurando o Tipo de Pagamento

Selecione o tipo de pagamento que deseja configurar e insira as informações necessárias:

![Nome Condição]({{ site.baseurl_root }}/images/braspag/pagador/vtex/05-nome-condicao.jpeg)
 
|Campo|Descrição|
|-|-|
|Nome da Condição|Insira nome identificador da condição de pagamento. |
|Processar com a afiliação|Selecione a afiliação existente na lista conforme previamente cadastrada na seção Afiliação de Pagamento.|
|Usar solução antifraude|Esta opção apenas será exibida se houver Antifraude previamente cadastrado Afiliação de Pagamento.|

Da mesma forma que a Afiliação de Pagamento, é preciso configurar a condição de pagamento quantas vezes necessárias de acordo com o tipo de pagamento desejado, por isso fique atento ao Nome da Condição utilizada. O nome do conector é exibido e o tipo de pagamento também. Então sugerimos inserir somente as soluções que foram configuradas na afiliação selecionada.

### Exemplos de Nome da Condição

|Exemplo|Definição|
|-|-|
|Ticket|Nesse exemplo o título relembra que a condição de pagamento vai utilizar a afiliação configurada com Ticket como provider.|
|Cielo30 c/ 3DS c/ SPLIT|Nesse exemplo o título relembra que qualquer condição de pagamento vai utilizar a afiliação configurada com Cielo30 como provider, fazer a autenticação com 3DS (se compatível) e realizará SPLIT de Pagamento (se compatível)|

Após essas duas etapas concluídas com todas as condições de pagamento criadas, as opções de pagamento serão exibidas na tela de checkout da loja.

## Meios de Pagamento

### Boleto

Selecione a Condição de Pagamento desejada e configure conforme o passo a passo em [Condição de Pagamento](https://braspag.github.io//tutorial/integracao-vtex#condi%C3%A7%C3%A3o-de-pagamento).

### Crédito

Selecione a Condição de Pagamento desejada e configure conforme o passo a passo em [Condição de Pagamento](https://braspag.github.io//tutorial/integracao-vtex#condi%C3%A7%C3%A3o-de-pagamento).

### Débito

Selecione a Condição de Pagamento desejada e configure conforme o passo a passo em [Condição de Pagamento](https://braspag.github.io//tutorial/integracao-vtex#condi%C3%A7%C3%A3o-de-pagamento).

### Pix

Selecione a Condição de Pagamento desejada e configure conforme o passo a passo em [Condição de Pagamento](https://braspag.github.io//tutorial/integracao-vtex#condi%C3%A7%C3%A3o-de-pagamento).

> Caso o pagamento seja realizado em tempo superior a 60 segundos após a geração do QRCode, o status do pagamento será atualizado na plataforma VTEX a cada três horas.

### Voucher

Este meio de pagamento deve seguir a seção de [Pagamentos Customizados](https://braspag.github.io//tutorial/integracao-vtex#pagamentos-customizados) para que a opção seja exibida na Condição de Pagamento. Posteriormente, selecione a Condição de Pagamento desejada e configure conforme o passo a passo em [Condição de Pagamento](https://braspag.github.io//tutorial/integracao-vtex#condi%C3%A7%C3%A3o-de-pagamento).

## Pagamentos Customizados

Para configurar pagamentos customizados, acesse **Transações** > **Configurações** > **Pagamentos Customizados** > **Cartão da Loja – Bandeira Própria** > **Configurar**

Nesta seção configure os dados para Private Label, Ticket e Alelo:

![1Pagamento Customizado]({{ site.baseurl_root }}/images/braspag/pagador/vtex/06a-pagamento-customizado.jpg)
![2Pagamento Customizado]({{ site.baseurl_root }}/images/braspag/pagador/vtex/06b-pagamento-customizado.jpg)

|Campo|Descrição|
|-|-|
|**Name**|**Valores Possíveis:** <br>Banese<br>BrasilCard<br>Carrefour<br>Credz<br>CredSystem<br>DMCard<br>Ticket|
|**Descrição**|**Valores Possíveis:** <br>banese<br>BrasilCard<br>Carrefour<br>Credz<br>CredSystem<br>DMCard<br>Ticket|
|**Intervalos de BIN**|100000-999999|
|**Código de pagamento do adquirente**|**Valores Possíveis:** <br>577<br>621<br>580<br>565<br>550<br>564<br>634|
|**Usar nome do titular do cartão**|Sim|
|**Quantidade de dígitos do CVV**|[1]999|
|**Usar data de validade do cartão?**|Não|
|**Usar endereço de cobrança?**|Não|
|**Máscara do cartão**|9999 9999 9999 9999|
|**Validade do pagamento**|Não|
|**Autorizar automaticamente**|Não|
|**Ativar divisão de pagamento**|Não|

## 3DS

As credenciais recebidas para utilização da solução devem ser inseridas conforme o tópico [Afiliação de Pagamento](https://braspag.github.io//tutorial/integracao-vtex#afilia%C3%A7%C3%A3o-de-pagamento).

Para utilizar esta solução, é necessário instalar o aplicativo 3DS. Com o usuário logado, acesse a seguinte URL e substitua o *nome_da_loja* pelo nome de sua loja.

<aside class="notice">https://[nome_da_loja].myvetex.com/admin/apps/braspag.braspag-3ds-payment-app@3.0.1/setup/</aside>

Ao concluir a instalação, verifique se o aplicativo aparece em **Aplicativos** > **Meus Aplicativos**:

![3DS]({{ site.baseurl_root }}/images/braspag/pagador/vtex/09-3ds.png)

> Caso não use a solução 3DS, selecione o campo **UseMpi** como "No" em [Preenchendo os Dados Necessário](https://braspag.github.io//tutorial/integracao-vtex#4.-preenchendo-dados-necess%C3%A1rios).

## Split de Pagamentos

Para que o Split seja utilizado corretamente, os sellers de um marketplace devem estar previamente cadastrados na plataforma VTEX e deve ser informado ao time de implantação os dados de cadastro da VTEX juntamente com o CNPJ. Caso essa informação seja editada na VTEX, o time Cielo deve ser informado dos novos dados.

<aside class="notice">A plataforma VTEX não possui cadastramento de seller do tipo pessoa física. </aside>

> Para ativação do recurso Split abra um chamado no [suporte Cielo](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"} e informe ao time de implantação os dados de seller cadastrados na plataforma VTEX. 

Para fazer o cadastro de um seller, acesse **Marketplace** > **Sellers** > **Gerenciamento**:

![Split1]({{ site.baseurl_root }}/images/braspag/pagador/vtex/07a-split.jpg)
![Split2]({{ site.baseurl_root }}/images/braspag/pagador/vtex/07b-split.jpg)

## Antifraude

Para que as transações sejam validadas pelo Antifraude é necessário que o conector de Antifraude **Braspag** esteja configurado previamente em Afiliação de Pagamento antes da etapa de Condição de Pagamento.

Para configurar, acesse **Transações** > **Configurações** > **Afiliações de gateways** > **+**

Selecione o conector **Braspag** (Soluções Antifraude) e insira as informações conforme recebidas após a contratação das soluções desejadas.

![Antifraude]({{ site.baseurl_root }}/images/braspag/pagador/vtex/08-antifraude.jpg)

|Campo|Descrição|
|-|-|
|**Id do Merchant**|Merchant ID do antifraude, disponibilizado pela Cielo.|
|**FingerPrint_OrgId**|Fingerprint Org ID, disponibilizado pela Cielo para validação na Cybersource.<br>Indica o ambiente na Threatmetrix: Sandbox ou Produção.|
|**FingerPrint_MerchantId**|Fingerprint Merchant ID, disponibilizado pela Cielo para validação na Cybersource.<br>Identificador da sua loja ou operação.<br> **É diferente do MerchantId**.|
|**Moeda**|Selecionar a moeda da transação Brasil Real (BRL)|
|**Versão de dados definidos da loja**|Utilizar sempre Retail_V4|
|**Enviar transações autenticadas**|Sim|
