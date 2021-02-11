---
layout: manual
title: E-Wallet Google Pay
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
sort_order:
tags:
language_tabs:
  json: JSON
  
---

# Google Pay ™

O Google Pay é uma carteira virtual. Ele permite que os compradores realizem pagamentos em lojas virtuais e apps utilizando, de forma prática e segura, seus cartões de crédito e débito armazenados em suas contas "Google Account" e dispositivos Android.

# Pré-Requisitos

Para utilização do Google Pay, é necessário que a loja já possua cadastro e integração Google Pay. Além disso, você deve:

1. Concordar com os termos de serviço do Google Pay.
2. Seguir os passos dessa documentação para completar a integração junto à [Google Pay](https://developers.google.com/pay/api/android/overview).
3. Contratar o Pagador API REST como gateway de pagamento.
4. Contratar o Cielo 3.0 como adquirência.
5. Integrar com o [Pagador API REST](https://braspag.github.io/manual/braspag-pagador).

# ETAPA 1: Integração com Google Pay

Nesta etapa inicial, você deverá configurar seu projeto e implementar o Google Pay em seu aplicativo Android.

## Passo 1 - Configuração do Projeto

Para configurar seu projeto, siga as instruções descritas no [Guia de Configuração](https://developers.google.com/pay/api/android/guides/setup) do Google Pay.<br>
Neste passo, você deverá importar a biblioteca do Google Play Services ou então escolher as APIs que deseja compilar. E então, para ativar o Google Pay no seu aplicativo Android, o arquivo "*AndroidManifest.xml*" do seu projeto deverá ser editado de acordo com as instruções dadas na página.

## Passo 2 - Implementação do Google Pay

Para integrar o Google Pay em seu aplicativo, siga todos os passos indicados no [Tutorial de Implementação](https://developers.google.com/pay/api/android/guides/tutorial) do Google Pay.
<br/><br/>
Para a correta integração do Google Pay via Braspag, é necessário se atentar aos pontos abaixo:

### Definição do Gateway

No passo "_Step 2: Choose a payment tokenization method_", siga o modelo indicado como "GATEWAY" e preencha o valor para o parâmetro `type` como "**PAYMENT\_GATEWAY**"  e o parâmetro `gateway` como "**cielo**", conforme o exemplo dado:

```json
private static JSONObject getTokenizationSpecification() {
  JSONObject tokenizationSpecification = new JSONObject();
  tokenizationSpecification.put("type", "PAYMENT_GATEWAY");
  tokenizationSpecification.put(
      "parameters",
      new JSONObject()
          .put("gateway", "cielo")
          .put("gatewayMerchantId", "exampleMerchantId"));
  return tokenizationSpecification;
}
```

No parâmetro `gatewayMerchantId`, preencha o identificador de sua loja gerado pelo gateway. O identificador da loja tem o formato "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" (isto é, Tipo *GUID* / Tamanho *36*).

### Definição das Bandeiras

No passo "_Step 3: Define supported payment card networks_", seguir com as bandeiras aceitas: "VISA", "MASTERCARD", "AMEX", "DISCOVER" E "JCB".

### Definição do Ambiente

No passo "_Step 5: Create a PaymentsClient instance_", utilize o valor "WalletConstants.ENVIRONMENT_TEST" para utilizar o ambiente de teste.

### Definição dos Dados de Compra

No passo "_Step 7: Create a PaymentDataRequest object_", utilize o valor "BRL" para o parâmetro `currencyCode`. O campo `merchantName` é o nome que o comprador visualizará durante o pagamento com Google Pay e recomenda-se, desta forma, colocar-se um nome amigável e reconhecido.

### Recuperação dos Dados de Pagamento

No passo "_Step 9: Handle the response object_", está descrito o evento "Activity.RESULT_OK", onde é retornado um objeto com todos os dados referentes ao dados de pagamento, inclusive o token de pagamento.

A partir do _PaymentData,_ obtém-se o objeto _PaymentMethodToken_, através da chamada do método `getPaymentMethodToken()`. [Clique aqui](https://developers.google.com/android/reference/com/google/android/gms/wallet/PaymentData) para mais informações.

Na sequência, deve-se obter a _string_ que contém tokens de pagamento a partir do método `GetToken()` do objeto _PaymentMethodToken_. [Clique aqui](https://developers.google.com/android/reference/com/google/android/gms/wallet/PaymentMethodToken) para mais informações.

O token obtido no passo anterior possui uma estrutura como a mostrada a seguir. [Clique aqui](https://developers.google.com/pay/api/android/guides/resources/payment-data-cryptography) para mais informações.

```json
{
  "protocolVersion": "ECv1",
  "signature": "TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
  "signedMessage": "{\"encryptedMessage\":
  \"ZW5jcnlwdGVkTWVzc2FnZQ==\",\"ephemeralPublicKey\":
  \"ZXBoZW1lcmFsUHVibGljS2V5\",\"tag\": \"c2lnbmF0dXJl\"}"
}
```

|Parâmetro|Type|Descrição|
|---|---|---|
|`signedMessage`|string|Mensagem assinada.|
|`signature`|string|Assinatura da mensagem.|

Guarde os dados `signedMessage` e `signature`, que serão requisitados na autorização via Pagador da Braspag na Etapa 2, descrita a seguir.

# Etapa 2: Autorização com Token

A autorização com o token do Google Pay acontece da mesma forma que a autorização padrão de um cartão de crédito. Porém, ao invés de se fornecer os dados do cartão abertamente, deverá ser fornecido o token recebido pelo Google Pay, conforme o exemplo abaixo:

## Request

```json
{
  "MerchantOrderId": "2014111708",
  "Customer": {
    (…)
  },
  "Payment": {
    "Type": "CreditCard",
    "Amount": 100,
    "Provider": "Cielo30",
    "Installments": 1,
    "Wallet": {
      "Type": "AndroidPay",
      "WalletKey": "{\"encryptedMessage\": \"ZW5jcnlwdGVkTWVzc2FnZQ==\",\"ephemeralPublicKey\": \"ZXBoZW1lcmFsUHVibGljS2V5\",\"tag\": \"c2lnbmF0dXJl\"}",
      "AdditionalData": {
        "Signature": "ZXBoZW1lcmFsUHVibGljS2V5"
      }
    }
  }
}
```

| Parâmetros do Header | Descrição | Tipo e tamanho |
| --- | --- | --- |
| MerchantId | ID do estabelecimento na Cielo 3.0. Para ambiente Sandbox, utilize 63D6ACCB-2734-4236-AB5D-843A9DAC44C7.| GUID (36) |
| MerchantKey | Chave da API para Cielo 3.0. Para ambiente Sandbox, utilize ZCVHDJWKTGOZXADDYJFURIDIKHEMRYQAQDYEJMQK.| String (24) |

| Parâmetro | Descrição | Tipo e tamanho |
| --- | --- | --- |
| MerchantOrderId | Número de identificação do pedido. | String (50) |
| Customer | Nó com dados do comprador. | Consulte o [Manual do Pagador](https://braspag.github.io/manual/braspag-pagador?json#requisi%C3%A7%C3%A3o).|
| Payment.Type | Tipo do meio de pagamento. Possibilidades: "CreditCard" / "DebitCard". | String (100) |
| Payment.Amount | Valor do pedido, em centavos. | Número (15) |
| Payment.Provider | Nome do provedor de meio de pagamento. Para transações Google Pay, utilize "Cielo30". | String (15) |
| Payment.Installments | Número de parcelas. | Número (2) |
| Payment.Wallet.Type | Nome do provedor de meio de pagamento. Para transações Google Pay, utilize "AndroidPay". | String (15) |
| Payment.Wallet.WalletKey | Preencher com o valor do parâmetro `signedMessage` retornado pelo Google Pay. | String |
| Payment.Wallet.AdditionalData.Signature | Preencher com o valor do parâmetro `signature` retornado pelo Google Pay. | String |

Para mais informações, consulte o [Manual do Pagador](https://braspag.github.io/manual/braspag-pagador).

## Response

A resposta de autorização da wallet terá os mesmos campos apresentados em nossa documentação do [Pagador](https://braspag.github.io/manual/braspag-pagador?json#resposta), porém com a adição do nó `Payment.Wallet` repetindo os mesmos campos utilizados na autorização, como descrito acima.

# Etapa 3: Solicitação de Dados de Produção

## Passo 1 - Branding Guideline

Verifique se todas as diretrizes de branding foram seguidas conforme descrito no [Guia Diretrizes de Marca](https://developers.google.com/pay/api/android/guides/brand-guidelines).

## Passo 2 - Checklist e Solicitação de Credenciais

Verifique se todos os itens do [checklist de integração](https://developers.google.com/pay/api/android/guides/test-and-deploy/integration-checklist) foram atendidos. Após tudo validado, solicite os dados de acesso produtivos.
