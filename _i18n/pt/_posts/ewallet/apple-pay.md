---
layout: manual
title: E-Wallet Apple Pay
description: Integração Técnica Gateway Braspag
search: true
translated: true
categories: manual
sort_order:
tags:
language_tabs:
  json: JSON
  
---

# Apple Pay ™

O Apple Pay é uma carteira virtual. Ele permite que o comprador realize pagamentos em lojas virtuais e apps utilizando, de forma prática e segura, seus cartões de crédito e débito armazenados em suas contas e dispositivos Apple.

# Pré-Requisitos

Para utilização do Apple Pay, é necessário que a loja já esteja cadastrada no programa AppleID. Além disso, você deve:

1. Realizar o cadastro, acessando [esta URL](https://developer.apple.com/programs/enroll/) e seguindo todos os passos requeridos pela Apple.
2. Seguir os passos dessa documentação para completar a integração junto à Apple.
3. Contratar o Pagador API REST como gateway de pagamento.
4. Contratar a Cielo 3.0 como adquirência.
5. Integrar com o [Pagador API REST](https://braspag.github.io/manual/braspag-pagador).

# ETAPA 1 - Configuração do Merchant Identifier

Nesta etapa inicial, você deverá criar um **merchant identifier** para sua loja. Após criado, o merchant identifier deverá ser enviado à Braspag em solicitação a um certificado ".CSR". O certificado ".CSR" criado pela Braspag deverá ser utilizado na criação de um novo certificado junto à Apple, o ".CER", que irá servir no seguimento à segunda etapa do processo.

## Passo 1 - Criar o Merchant Identifier

A criação do merchant identifier deve ser feita através do [Portal de Desenvolvedores da Apple](https://developer.apple.com/account/resources), da seguinte maneira:

1. Na seção **"Certificates, Identifiers & Profiles"**, selecione **"Identifiers"** no menu lateral, e então clique no botão (+) no canto superior esquerdo:
![Step1.1]({{ site.baseurl_root }}/images/braspag/pagador/applepay01.png)
2. Selecione **"Merchant IDs"**, e então clique em **"Continue"**:
![Step1.2]({{ site.baseurl_root }}/images/braspag/pagador/applepay02.png)
3. Coloque um valor nos campos **"Description"** e **"Identifier"**, seguindo suas especificações, e clique em **"Continue"**:
![Step1.3]({{ site.baseurl_root }}/images/braspag/pagador/applepay03.png)
4. Clique em **"Register"**:
![Step1.4]({{ site.baseurl_root }}/images/braspag/pagador/applepay04.png)

## Passo 2 - Solicitar o Certificado ".CSR"

Para solicitar à Braspag a geração do certificado no formato ".CSR", entre em contato com o nosso [Time de Atendimento](https://suporte.braspag.com.br/hc/pt-br/requests/new) e informe:

1. O **Merchant Identifier** criado no passo 1;
2. O **Merchant ID** de sua loja na Braspag em produção.

Nossa equipe irá retornar com o arquivo ".CSR" em até 48 horas úteis.

## Passo 3 - Criar o Certificado ".CER"

Para criar um certificado de processamento de pagamento (".CER"), que será utilizado em sua loja virtual ou aplicativo, é necessário acessar o [Portal de Desenvolvedores da Apple](https://developer.apple.com/account/resources) e seguir os passos abaixo:

1. Na seção **"Certificates, Identifier & Profiles"**, selecione **"Identifiers"**, no menu lateral.
2. Utilizando o filtro localizado à direita superior (**"App IDs"**), encontre o item **"Merchant IDs"**:
![Step2.1]({{ site.baseurl_root }}/images/braspag/pagador/applepay05.png)
3. À direita, selecione o identifier criado anteriormente:
![Step2.2]({{ site.baseurl_root }}/images/braspag/pagador/applepay06.png)
4. No bloco **"Apple Pay Payment Processing Certificate"**, clique em **"Create Certificate"** logo abaixo do texto explicativo:
![Step2.3]({{ site.baseurl_root }}/images/braspag/pagador/applepay07.png)
5. Escolha a opção "No" em **"Edit or Configure Merchant ID"**:
![Step2.4]({{ site.baseurl_root }}/images/braspag/pagador/applepay08.png)
6. Na caixa de diálogo, escolha o certificado ".CSR" enviado pela Braspag:
![Step2.5]({{ site.baseurl_root }}/images/braspag/pagador/applepay09.png)
7. Clique em **"Continue"**:
![Step2.6]({{ site.baseurl_root }}/images/braspag/pagador/applepay10.png)
8. Clique em **"Download"** para baixar o arquivo ".CER":
![Step2.7]({{ site.baseurl_root }}/images/braspag/pagador/applepay11.png)

Para mais detalhes, acesse a [Developer Account Help](https://help.apple.com/developer-account/#/devb2e62b839) da Apple.

# ETAPA 2. Integração com Apple Pay

Boa parte do processo para disponibilização do botão "Pagar com Apple Pay" no seu app ou site será realizado na sua integração junto à wallet. Por isso, recomendamos que siga as orientações disponíveis no site de [Documentação da Apple](https://developer.apple.com/documentation) para a implementação, que é totalmente self-service.

Ao final do processo realizado na API da Apple, você receberá um JSON contendo dois campos importantes que deverão ser utilizados no próximo passo. São os campos `paymentData.data` e `ephemeralPublicKey.header.EphemeralPublicKey`.

```json
{
   "applePayData": {
      "paymentData": {
         "version": "EC_v1",
         "data": "as01vRj+n9crY2vome7zc+u7Tz0+qg2La/8IUHpJIjFN6ThhUqLnSrskQHTrEbcYPiMksFK0+ddo9sZu70uJQJH1I+44N6PrVhilNDem97vOXq2VYDXiVJ27F/Q9wGQDgZBeGcZ6Pml9SIelHqUauBcQoOatrlnWPUL8kbdpT8WqgzXyaCh7oeTz=z6++rp/ofjvSjnGtOqAUsnrzvw4uzkcyKUSsfROdJ6B/Xzgu/T9fMIr5UxXD2DPF1SNh3ydEJABKz4HFjDW7ObvbQeua4GYxJdpQLpI3NgUbJy91E/LOyb/+PcCtO+0=a41tBrfnTTF9qsPuCIw8HWIEEKSRofn27NTofxev/i+nHEfqEtqNrN/epIvhzceD/gDiGetfiLKMzf94ARmpWUAMC==",
         "signature": "(…)",
         "header": {
            "ephemeralPublicKey": "MFkwEwZJKoZIzj0CAQYIKo12zj0DAQcDQgAEo+ReGClSmQ4hDJD1yh9nci3V4l7kPm2AQtKZMMvuNS0iK5sn/1A9l3kw1B1xCqOycZmnPSng7p5hpTvrei1BCA==",
            "publicKeyHash": "KXN06+BtJu6yEfF9zDhr7f4M/2HwVybnx0FGfC520gB=",
            "transactionId": "71c5b61c3791546e94d2b4893a6c69aaac2ab86b5c113c83a7d89057906a9b5f"
         }
      },
      "paymentMethod": {
         "displayName": "MasterCard 1212",
         "network": "MasterCard",
         "type": "credit"
      },
      "transactionIdentifier": "81C5B61C3791646E94D2B4893A6C69BBBC2AB86B5C363C83A7D89057906A9BAC"
   },
   "x_document": "24562608994",
   "x_name": "João da Silva"
}
```

## Nota Importante

<aside class="warning">Durante a implementação da Apple, haverá uma referência ao certificado ".CER", gerado durante a ETAPA 1, para criptografar os dados durante a comunicação com a Apple. No fluxo de integração não se deve realizar a implementação do processo de descriptografia dos dados retornados pela Apple pois, para clientes Braspag, este trabalho será realizado por nossa solução de gateway, o Pagador.</aside>

# ETAPA 3. Integração com o Pagador (descriptografia e autorização)

A autorização com o token do Apple Pay acontece da mesma forma que a autorização padrão de um cartão de crédito. Porém, ao invés de se fornecer os dados do cartão abertamente, deverá ser fornecido o token recebido pelo Apple Pay, conforme o exemplo abaixo:

### Requisição

```json
{
   "MerchantOrderId": "2017051002",
   "Customer": {
     (…)
   },
   "Payment": {
      "Type": "CreditCard",
      "Amount": 1000,
      "Provider": "Cielo30",
      "Installments": 1,
      "Currency": "BRL",
      "Wallet": {
         "Type": "ApplePay",
         "WalletKey":"['paymentData.data']",
         "AdditionalData": {
            "EphemeralPublicKey": "['ephemeralPublicKey.header.EphemeralPublicKey']"
         }
      }
   }
}
```

| Parâmetros do Header|Descrição|Tipo e Tamanho|
| --- | --- | --- |
| MerchantId |ID do estabelecimento no Pagador.| GUID (36) | 
| MerchantKey | Chave da API para o Pagador.| String (24) |

|Parâmetro|Descrição|Tipo e Tamanho|
| --- | --- | --- |
| MerchantOrderId | Número de identificação do pedido. | String (50) |
| Customer |  Nó com dados do comprador. |Consulte o [Manual do Pagador](https://braspag.github.io/manual/braspag-pagador?json#requisi%C3%A7%C3%A3o). |
| Payment.Type |Tipo do meio de pagamento. Possibilidades: "CreditCard" / "DebitCard". | String (100) | 
| Payment.Amount |Valor do pedido, em centavos.| Número (15) | 
| Payment.Provider |Nome do provedor do meio de pagamento. Para transações Apple Pay, utilize "Cielo30".| String (15) | 
| Payment.Installments | Número de parcelas. | Número (2) |
| Payment.Wallet.Type | Nome do provedor do meio de pagamento. Para transações Apple Pay, utilize "ApplePay". |String (15) | 
| Payment.Wallet.WalletKey |Preencher com o valor do parâmetro `paymentData.data` retornado pelo Apple Pay. | String | 
| Payment.Wallet.AdditionalData.EphemeralPublicKey |Preencher com o valor do parâmetro `ephemeralPublicKey.header.EphemeralPublicKey` retornado pelo Apple Pay. | String | 

### Resposta

```json
{
    "MerchantOrderId": "2017051002",
    "Customer": {(…)
    },
    "Payment": {
        (…)
        "CreditCard": {
            (…)
        },
        (…)
        "Wallet": {
            "Type": "ApplePay",
            "WalletKey": "as01vRj+n9crY2vome7zc+u7Tz0+qg2La/8IUHpJIjFN6ThhUqLnSrskQHTrEbcYPiMksFK0+ddo9sZu70uJQJH1I+44N6PrVhilNDem97vOXq2VYDXiVJ27F/Q9wGQDgZBeGcZ6Pml9SIelHqUauBcQoOatrlnWPUL8kbdpT8WqgzXyaCh7oeTz=z6++rp/ofjvSjnGtOqAUsnrzvw4uzkcyKUSsfROdJ6B/Xzgu/T9fMIr5UxXD2DPF1SNh3ydEJABKz4HFjDW7ObvbQeua4GYxJdpQLpI3NgUbJy91E/LOyb/+PcCtO+0=a41tBrfnTTF9qsPuCIw8HWIEEKSRofn27NTofxev/i+nHEfqEtqNrN/epIvhzceD/gDiGetfiLKMzf94ARmpWUAMC==",
            "AdditionalData": {
                "EphemeralPublicKey": "MFkwEwZJKoZIzj0CAQYIKo12zj0DAQcDQgAEo+ReGClSmQ4hDJD1yh9nci3V4l7kPm2AQtKZMMvuNS0iK5sn/1A9l3kw1B1xCqOycZmnPSng7p5hpTvrei1BCA=="
            }
        },
        (…)
        "Links": [
            (…)
        ]
    }
}
```

A resposta de autorização da wallet terá os mesmos campos apresentados em nossa documentação do [Pagador](https://braspag.github.io//manual/braspag-pagador#resposta), porém com a adição do nó `Payment.Wallet` repetindo os mesmos campos utilizados na autorização, como descrito acima.
