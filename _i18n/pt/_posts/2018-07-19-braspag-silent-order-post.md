---
layout: manual
title: Manual de Integração - Silent Order Post
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manualp
sort_order: 2
tags:
  - 1. Pagador
language_tabs:
  shell: cURL
  json: JSON
  
---

# Silent Order Post

O Silent Order Post (SOP) é um serviço que oferece mais segurança ao comprador e controle sobre a experiência do checkout; é ideal para a loja que não possui estrutura para cumprir todos os requisitos de segurança do PCI DSS no uso de cartões de crédito.

O Silent Order Post possibilita o envio de dados do pagamento do seu cliente de forma segura, diretamente em nosso sistema. Os dados do cartão do comprador, tais como número do cartão e data de validade, não trafegam pelo ambiente da loja e são armazenados de forma criptografada (token) no ambiente da Braspag, que conta com a certificação PCI DSS 3.2.

> **O que é a certificação PCI DSS?**<br>
> É um padrão global de segurança de dados de cartões. O PCI DSS foi desenvolvido para incentivar e aprimorar a segurança de dados de pagamento e facilitar a ampla adoção de medidas consistentes de segurança de dados.
> A certificação é obrigatória para que um e-commerce possa receber, tratar e armazenar dados de cartão.

## Principais benefícios

* **Coleta direta dos dados**: a coleta dos dados do pagamento é feita diretamente para os sistemas da Braspag por um script, através dos campos definidos no seu checkout;
* **Total compatibilidade**: a solução é compatível com todos os meios de pagamento disponibilizados no Gateway (nacionais e internacionais);
* **Certificação PCI DSS 3.2**: a certificação da Braspag garante total conformidade com as normas da indústria de cartões, reduzindo o escopo de PCI DSS;
* **Checkout personalizado**: a personalização oferece controle total sobre a experiência de checkout e elementos da sua marca.

## Meios de pagamento suportados

O Silent Order Post é capaz de criptografar cartões de crédito, débito, voucher e múltiplo, desde que atendam ao formato *mod10*.

## Como funciona

A loja integra o script do **Silent Order Post** na página de checkout (*client-side*). Quando o comprador insere os dados do cartão no checkout, esses dados passam diretamente para o ambiente Braspag por meio do script instalado. A Braspag gera um token temporário para o cartão do comprador, o `PaymentToken`, que deverá ser usado pela loja para solicitar a autorização da transação. Assim, os dados sensíveis de cartão não passam pelo ambiente do seu e-commerce.

![Fluxo Silent Order Post]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/sop-pt.png)

1. O comprador acessa a tela de checkout da loja;
2. O script da página de checkout solicita o `access_token` para o autenticador OAuth2;
3. O OAuth2 retorna o `access_token`;
4. O script da página de checkout solicita o `AccessToken` do Silent Order Post (`AccessToken` SOP), informando o `access_token` obtido na etapa anterior;
5. O Silent Order Post retorna o `AccessToken` SOP;
6. O comprador preenche os dados de pagamento na tela de checkout;
7. O script da página de checkout envia os dados do cartão para o Silent Order Post, informando o `AccessToken` SOP;
8. O Silent Order Post retorna o `PaymentToken` (cartão criptografado);
9. O script da página de checkout envia o `PaymentToken` para o servidor da loja, e o servidor envia a requisição de autorização da transação para a API do Gateway, informando o `PaymentToken`;
10. O Gateway retorna a resposta da autorização;
11. A loja confirma o pedido do comprador, se desejar.

> O Silent Order Post permite mais segurança, sem interferir no layout da sua página.

### Silent Order Post com VerifyCard

É possível habilitar o VerifyCard (verificação de cartão) junto com o Silent Order Post. Assim, a sua loja pode verificar se o cartão é válido antes de solicitar uma autorização.

O VerifyCard é composto por dois serviços: Zero Auth e Consulta BIN.

* **Zero Auth**: é um serviço que identifica se um cartão é válido ou não, através de uma operação semelhante a uma autorização, porém com valor R$ 0,00. O Zero Auth simula uma autorização sem afetar o limite de crédito ou alertar o portador do cartão sobre o teste;
* **Consulta BIN**: é um serviço disponível exclusivamente para clientes Cielo que retorna informações do cartão a partir do BIN (seis primeiros dígitos do cartão), tais como bandeira do cartão, se o cartão é de débito, crédito ou múltiplo, se é nacional ou internacional, se é cartão corporativo, banco emissor e se é cartão pré-pago.

![Fluxo SOP com VerifyCard]({{ site.baseurl_root }}/images/braspag/pagador/fluxos/sop-verifycard-pt.png)

1. O comprador acessa a tela de checkout da loja;
2. O script da página de checkout solicita o `access_token` para o autenticador OAuth2;
3. O OAuth2 retorna o `access_token`;
4. O script da página de checkout solicita o `AccessToken` do Silent Order Post (`AccessToken` SOP), informando o `access_token` obtido na etapa anterior;
5. O Silent Order Post retorna o `AccessToken` SOP;
6. O comprador preenche os dados de pagamento na tela de checkout;
7. O script da página de checkout envia os dados do cartão para o Silent Order Post, informando o `AccessToken` SOP;
8. O Silent Order Post solicita a validação do cartão ao VerifyCard;
9. O VerifyCard retorna o resultado do ZeroAuth e da Consulta BIN;
10. O Silent Order Post retorna o `PaymentToken` (cartão criptografado);
11. O script da página de checkout envia o `PaymentToken` para o servidor da loja, e o servidor envia a requisição de autorização da transação para a API do Gateway, informando o `PaymentToken`;
12. O Gateway retorna a resposta da autorização;
13. A loja confirma o pedido do comprador, se desejar.

# Integrando o Silent Order Post

O funcionamento do **SilentOrderPost** ocorre em quatro etapas:

1. Autenticação da loja por meio da criação do `access_token` OAuth2 para acesso à API do Silent Order Post;
2. Criação do `AccessToken` do SOP na API do Silent Order Post para integrar o script;
3. Execução do script;
4. Envio da requisição de autorização da transação à API do Pagador informando o `PaymentToken`.

## 1. Obtendo o AccessToken OAuth2

Quando o comprador acessa o checkout, a loja deve gerar o `access_token` a partir da API de autenticação da Braspag (**OAuth2**). Em caso de sucesso, a API retornará um `access_token` que deverá ser utilizado na próxima camada de autenticação da ferramenta.

Para obter o `access_token` no padrão [OAuth 2.0](https://oauth.net/2/){:target="_blank"}, envie requisição utilizando o VERBO HTTP **POST** para a seguinte URL, formada pela "URL base do ambiente + endpoint", no modelo server-to-server:

|Ambiente | URL base + endpoint | Authorization |
|---|---|---|
| **SANDBOX** | https://authsandbox.braspag.com.br/oauth2/token | "Basic *{base64}*"|
| **PRODUÇÃO** | https://auth.braspag.com.br/oauth2/token |"Basic *{base64}*"|

**Nota:** O valor "_{base64}_" para a autorização do tipo "Basic" deve ser obtido da seguinte forma:

1. Concatene o `ClientId` e o `ClientSecret` (`ClientId:ClientSecret`).
2. Codifique o resultado da concatenação em base64.
3. Realize uma requisição ao servidor de autenticação utilizando o código alfanumérico gerado.

> Solicite à equipe de suporte a criação do `ClientId` e do `ClientSecret` de sua loja para utilização nos ambientes **sandbox** e de **produção**. No chamado, informe que deseja realizar a integração do Silent Order Post e forneça seu `MerchantId`.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://auth.braspag.com.br/oauth2/token</span></aside>

``` shell
--request POST "https://authsandbox.braspag.com.br/oauth2/token"
--header "Authorization: Basic {base64}"
--header "Content-Type: application/x-www-form-urlencoded" 
--data-binary "grant_type=client_credentials"
```

|Parâmetros|Formato|Envio|
|---|---|---|
|`Authorization`|"Basic *{base64}*"|Envio no header.|
|`Content-Type`|"application/x-www-form-urlencoded"|Envio no header.|
|`grant_type`|"client_credentials"|Envio no body.|

### Resposta

``` json
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

```shell
{
  "access_token": "faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw",
  "token_type": "bearer",
  "expires_in": 599
}
```

|Propriedades da Resposta|Descrição|
|---|---|
|`access_token`|O token de autenticação solicitado. Ele será utilizado no passo de obtenção do `AccessToken` do SOP.|
|`token_type`|Indica o tipo de token.|
|`expires_in`|Expiração do token de acesso, em segundos. Quando o token expira, é necessário obter um novo.|

## 2. Obtendo o AccessToken SOP

Crie o `AccessToken` do **Silent Order Post (SOP)** enviando uma requisição **POST**. Informe o `access_token` **OAuth2** obtido na etapa anterior como o `Bearer` no cabeçalho da requisição.

> O `AccessToken` do SOP será informado no script na etapa 3.

| Ambiente | URL base + endpoint|
| --- | --- |
| Sandbox | https://transactionsandbox.pagador.com.br/post/api/public/v2/accesstoken|
| Produção | https://transaction.pagador.com.br/post/api/public/v2/accesstoken|

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">https://transaction.pagador.com.br/post/api/public/v2/accesstoken</span></aside>

```shell
--request POST "https://transactionsandbox.pagador.com.br/post/api/public/v2/accesstoken"
--header "Content-Type: application/json"
--header "MerchantId: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
--header "Authorization: Bearer faSYkjfiod8ddJxFTU3vti_ ... _xD0i0jqcw"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório?|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja no Pagador.|GUID |36 |Sim|
|`Authorization`|Bearer [`AccessToken OAuth2`]|texto |36 |Sim|

### Resposta

Como resposta, a loja receberá um JSON ("HTTP 201 Created") contendo, entre outras informações, o token (`AccessToken` SOP).

```json
{
    "MerchantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2023-08-05T08:50:04",
    "ExpiresIn": "2023-08-05T09:10:04"
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
    "MerchantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "AccessToken": "MzA5YWIxNmQtYWIzZi00YmM2LWEwN2QtYTg2OTZjZjQxN2NkMDIzODk5MjI3Mg==",
    "Issued": "2023-08-05T08:50:04",
    "ExpiresIn": "2023-08-05T09:10:04"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`MerchantId`|Identificador da loja no Pagador. |GUID |36 |xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|
|`AccessToken`|Token de acesso do Silent Order Post (`AccessToken` SOP). Por questões de segurança, este token dará permissão para o estabelecimento salvar apenas um cartão dentro de um prazo já estipulado na resposta, através do atributo *ExpiresIn* (por padrão, 20 minutos). O que acontecer primeiro invalidará esse mesmo token para impedir um uso futuro.|texto|--|NjBhMjY1ODktNDk3YS00NGJkLWI5YTQtYmNmNTYxYzhlNjdiLTQwMzgxMjAzMQ==|
|`Issued`|Data e hora da geração do `AccessToken`. |texto|--|AAAA-MM-DDTHH:MM:SS|
|`ExpiresIn`|Data e hora da expiração do `AccessToken`. |texto|--|AAAA-MM-DDTHH:MM:SS|

> Caso necessário, consulte o [processo legado de autenticação](https://braspag.github.io//manualp/braspag-silent-order-post#autentica%C3%A7%C3%A3o-legada){:target="_blank"}, com geração do `AccessToken` utilizando `MerchantId` e IP do comprador.

## 3. Implementando o script

### Mapeando classes

Faça o [download do script do Silent Order Post](https://www.pagador.com.br/post/scripts/silentorderpost-1.0.min.js){:target="_blank"} e insira o script no formato JavaScript na sua página de checkout. Esse script permitirá à Braspag processar todas as informações de cartão sem intervenção da loja.

Parametrize os elementos de formulário com as seguintes classes:

|Propriedade|Nome da Classe|Obrigatório?|
|-----------|---------|----------|
|Nome do portador do cartão de crédito/débito|`bp-sop-cardholdername` |Sim|
|Número do cartão de crédito/débito|`bp-sop-cardnumber` |Sim|
|Data de validade do cartão de crédito/débito|`bp-sop-cardexpirationdate` |Sim|
|Código de segurança do cartão de crédito/débito|`bp-sop-cardcvvc`|Sim|
|Modalidade do cartão a ser verificada ("debitCard" ou "creditCard").| `bp-sop-cardtype`|Não*|

*Se a classe `bp-sop-cardtype` não for informada, o script irá assumir que o cartão usado na compra é um cartão de crédito.

### Definindo parâmetros

#### Parâmetros do script

Os parâmetros do script devem ser inseridos no HTML da página de checkout para referenciar o script.

|Propriedade|Descrição|
|-----------|---------|
|`accessToken`| Token de acesso do Silent Order Post (`AccessToken` SOP).|
|`environment`| Tipo de ambiente: "sandbox" para teste / "production" para produção.|
|`language`| Idioma: "pt" para português/ "en" para inglês/ "es"para espanhol. |
|`enableBinQuery`| "true" (habilita o *Consulta BIN*, retornando as características do cartão) / "false" (caso contrário). Saiba mais sobre Consulta BIN no manual [VerifyCard](https://braspag.github.io//manual/braspag-verify-card){:target="_blank"}. Obs.: Disponível somente para Cielo 3.0.*|
|`enableVerifyCard`| "true" (habilita o *ZeroAuth*, retornando se o cartão é válido ou não) / "false" (caso contrário).* Saiba mais no manual [VerifyCard](https://braspag.github.io//manual/braspag-verify-card){:target="_blank"}.|
|`enableTokenize`| "true" (salva o cartão diretamente no Cartão Protegido, retornando um *CardToken* ao invés de um *PaymentToken*) / "false" (caso contrário).* |
|`cvvRequired`| "false" (desliga a obrigatoriedade de envio do CVV) / "true" (caso contrário). *A loja precisa ter autorização da adquirente para transacionar sem o CVV*.|
|`cardType` | Use "creditCard" ou "debitCard" para forçar a verificação da modalidade do cartão. Importante para validar cartões múltiplos. Se nada for enviado, o emissor considerará apenas a modalidade "Crédito".|

\* O serviço correspondente precisa estar habilitado. 

<aside class="notice">Para habilitar a Consulta BIN, VerifyCard ou o Cartão Protegido, entre em contato com o Suporte.</aside>

> **Usando o Silent Order Post com o Cartão Protegido**
> O Cartão Protegido é o serviço de armazenamento de cartões criptografados da Braspag. Você pode usar o **Silent Order Post** para trafegar os dados de cartão pela Braspag e o **Cartão protegido** para armazenar o cartão de forma segura e criptografada na Braspag, que conta com a certificação PCI DSS.
> Saiba mais no manual do [Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest){:target="_blank"}.

#### Retornos do script

O script irá retornar um JSON com o `PaymentToken` (cartão tokenizado que deverá ser enviado na autorização) e informações sobre o cartão.

**Exemplo de JSON de retorno do script**

```json
{
  "PaymentToken": "366f8470-54d0-43cb-95f5-c80a502afc27",
  "ForeignCard": false, 
  "BinQueryReturnCode": "00",
  "BinQueryReturnMessage": "Analise autorizada",
  "Brand": "Visa",
  "VerifyCardStatus": 1,
  "VerifyCardReturnCode": "00",
  "VerifyCardReturnMessage": "Transacao autorizada",
  "CardBin": "453202",
  "CardLast4Digits": "4044",
  "CardType": "Multiple",
  "Issuer": "Banco Santander",
  "IssuerCode": "033",
  "Prepaid": false   
}
```

**Propriedades do retorno do script**

|Propriedade|Descrição|Condição|
|-----------|---------|---------|
|`PaymentToken`*| Token efêmero utilizado para pagamento no formato de um GUID (36). Tem duração de 20 minutos e pode ser usado apenas uma vez. É o valor que deve ser enviado na requisição de autorização.|---|
|`CardToken`| Token permanente utilizado para pagamento no formato de um GUID (36). |Quando *enableTokenize* for "true". |
|`Brand`| Nome da bandeira do cartão (Visa, Master, Elo, Amex, Diners, JCB, Hipercard). |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`BinQueryReturnCode`| "00" se a análise do BIN for um sucesso. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`BinQueryReturnMessage`| Ex.: “Transacao Autorizada” se a análise do BIN for um sucesso. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`CardBin`| Ex.: “455187”.|Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`CardLast4Digits`| Ex.: “0181”.|Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`ForeignCard`| O campo retorna "true" se é um cartão emitido fora do Brasil. "false" caso contrário. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`Issuer`| O campo retorna nome do emissor do cartão. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`IssuerCode`| O campo retorna código do emissor do cartão. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`CardType`| Retorna o tipo do cartão, por exemplo: Crédito, Débito, Múltiplo, Voucher, etc. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`VerifyCardReturnCode`| Esse é o mesmo código retornado pelo provedor durante uma autorização padrão. Ex: provedor Cielo30 código "00" significa sucesso na validação. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`VerifyCardReturnMessage`| Ex.: “Transacao Autorizada”. |Quando *enableBinQuery* for "true". Disponível somente para Cielo 3.0. |
|`VerifyCardStatus`| "0"- Cartão Inválido; "1"- Cartão Válido; "99"- Situação Desconhecida. |Quando *enableVerifyCard* for "true". |
|`Prepaid`| Retorna “true” se é um cartão pré-pago e "false" se não for cartão pré-pago.|---|

*Em **Parâmetros do script**, se `enableTokenize` for *true*, o script irá retornar o `CardToken` em vez do `PaymentToken`. Saiba mais sobre `CardToken` no manual do [Cartão Protegido](https://braspag.github.io//manual/cartao-protegido-api-rest){:target="_blank"}.

### Implementando eventos

O script fornecido pela Braspag oferece os seguintes três eventos para manipulação e tratamento por parte da loja:

|Evento|Descrição|
|-----------|---------|
|**onSuccess**| Evento em caso de sucesso. Retorna o *PaymentToken* e também os dados do cartão, caso tenha solicitado realizar a verificação do cartão. Por questões de segurança, esse *PaymentToken* poderá ser usado para uma única autorização. Após seu processamento, ele será invalidado. |
|**onError**| Evento em caso de erro. Retorna o código e a descrição do erro. |
|**onInvalid**| Evento em caso de fornecimento de dados incorretos. Retorna detalhes de campos com erro. As mensagens retornadas no resultado da validação são disponibilizadas nas seguintes linguagens: português (default), inglês e espanhol. |

> **Características do `PaymentToken`**:
> Por questões de segurança, o `PaymentToken` poderá ser usado para uma única autorização e/ou dentro do período de 20 minutos. Após seu processamento, o `PaymentToken` será invalidado.

## 4. Autorizando com PaymentToken

Após a obtenção do *PaymentToken* através do script, execute o processo de autorização, enviando o *PaymentToken* no lugar de dados do cartão.

> **Para submeter uma transação de crédito**, envie o parâmetro `Payment.CreditCard.PaymentToken` em vez de `Payment.CreditCard`. Saiba mais no manual do [Pagador](https://braspag.github.io//manual/braspag-pagador#criando-uma-transa%C3%A7%C3%A3o-de-cr%C3%A9dito){:target="_blank"};
> **Para submeter uma transação de débito**, envie o parâmetro `Payment.DebitCard.PaymentToken` em vez de `Payment.DebitCard`. Saiba mais no manual do [Pagador](https://braspag.github.io//manual/braspag-pagador#criando-uma-transa%C3%A7%C3%A3o-de-d%C3%A9bito){:target="_blank"}.

Veja o exemplo abaixo, descrevendo o envio dos dados de autenticação da requisição de autorização da API do Pagador.

### Requisição

<aside class="request"><span class="method post">POST</span> <span class="endpoint">/v2/sales</span></aside>

```json
{  
   "MerchantOrderId":"2017051002",
   "Customer":
   {  
     (...)
   },
   "Payment":
   {  
     (...)
     "CreditCard":{  
         "PaymentToken":"eedcb896-40e1-465b-b34c-6d1119dbb6cf"
     }
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
   "MerchantOrderId":"2017051002",
   "Customer":
   {  
     (...)
   },
   "Payment":
   {  
     (...)
     "CreditCard":{  
         "PaymentToken":"eedcb896-40e1-465b-b34c-6d1119dbb6cf"
     }
   }
}
```

| Campo | Descrição | Tipo/Tamanho | Obrigatório? |
| --- | --- | --- | --- |
| `Payment.CreditCard.PaymentToken` | Fornece o PaymentToken gerado através do script. Esta informação substitui os dados do cartão. Substituir por `DebitCard` se for utilizar um cartão de débito | GUID / 36 | Sim |

### Resposta

Consulte o [Manual da API do Pagador](https://braspag.github.io//manual/braspag-pagador){:target="_blank"} para exemplos de resposta a requisições de autorização.

## Exemplo de integração

Compartilhamos no nosso GitHub um [exemplo prático](https://github.com/Braspag/silent-order-post){:target="_blank"} de como você deve mapear as classes e integrar o Silent Order Post ao seu checkout.
