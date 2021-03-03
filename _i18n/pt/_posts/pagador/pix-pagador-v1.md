# Pix

<aside class="notice">As especificações do Pix poderão sofrer mudanças e adequações até a data oficial de lançamento da funcionalidade pela Braspag.</aside>
<aside class="warning">No momento, a habilitação do Pix só está disponível para a Cielo e deve ser efetuada diretamente com a mesma.</aside>

No Pix, a transmissão da ordem de pagamento e a disponibilidade de fundos para o usuário recebedor ocorrem em tempo real, 24 horas por dia e sem a necessidade de intermediários. Sendo assim, é um meio que viabiliza pagamentos rápidos e com custos de transação menores.

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

Para gerar um QR code Pix através da API Pagador, basta realizar a integração conforme a especificação abaixo. Entre os campos de envio obrigatório, destacam-se dois: `Type`, que deve ser enviado como "Pix"; e `Provider`, que deve ser "Cielo30". Na resposta da requisição será retornado o *código base 64* da imagem do QR code Pix, que deve ser disponibilizado ao comprador, que irá efetuar o pagamento.

![Fluxo de Geração do QR Code Pix](https://braspag.github.io/images/braspag/pagador/pix/1-pix-geracao-qrcode.jpg)

A segunda etapa é quando o comprador realiza a leitura do QRCode através de um dos aplicativos habilitados para o pagamento Pix, e efetiva o pagamento. Nesta etapa não há participação da loja nem da Braspag.

![Fluxo de Pagamento](https://braspag.github.io/images/braspag/pagador/pix/2-pix-pagamento.jpg)

A seguir, a especificação da requisição de geração do QRCode através da API Pagador.

#### Requisição de Geração QRCode Pix

| **ENDPOINT** | **MÉTODO** |
|--------------|------------|
| `/v2/sales` | `POST` |

```json
{ 
   "MerchantOrderId":"2020102601",
   "Customer":{
      "Name":"Nome do Pagador"
   },
   "Payment":{ 
      "Type":"Pix",
      "Provider":"Cielo30",
      "Amount":100
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
      "Name":"Nome do Pagador"
   },
   "Payment":{ 
      "Type":"Pix",
      "Provider":"Cielo30",
      "Amount":100
   }    
}
--verbose
```

| **PROPRIEDADE** | **TIPO** | **TAMANHO** | **OBRIGATÓRIO** | **DESCRIÇÃO** |
| --- | --- | --- | --- | --- |
| `MerchantOrderId` | Texto | 50 | Sim | Código de identificação do pedido do lojista |
| `Customer.Name` | Texto | 255 | Não | Nome do pagador |
| `Payment.Type` | Texto | - | Sim | Fixo "Pix" |
| `Payment.Provider` | Texto | - | Sim | Fixo "Cielo30" |
| `Payment.Amount` | Número | 15 | Sim | Valor do Pedido (ser enviado em centavos) |

#### Resposta

```json
{
   "MerchantOrderId":"2020102601",
   "Customer":{
      "Name":"Nome do Pagador"
   },
   "Payment":{
      (...)   
      "Paymentid":"1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type":"Pix",
      "Provider":"Cielo30",
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "QrcodeBase64Image":"rfhviy64ak+zse18cwcmtg==",
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
      "Name":"Nome do Pagador"
   },
   "Payment":{
      (...)
      "Paymentid":"1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type":"Pix",
      "Provider":"Cielo30",
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "QrcodeBase64Image":"rfhviy64ak+zse18cwcmtg==",
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

| **PROPRIEDADE** | **DESCRIÇÃO** | **TIPO** | **TAMANHO** | **FORMATO** |
| --- | --- | --- | --- | --- |
| Payment.Paymentid | Campo Identificador do Pedido | GUID | 40 | Texto |
| Payment.AcquirerTransactionId | Identificador do Provedor| GUID | 36 | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| Payment.ProofOfSale | NSU Pix |Texto|20|Texto alfanumérico|
| Payment.QrcodeBase64Image | Código em base 64 da imagem do QRCode | Texto | - | Texto |
| Payment.Status | Status da transação. Para transações Pix, em caso de sucesso, retornará inicialmente como 12 (Pendente) | Número | - | 12 |
| Payment.ProviderReturnCode | Código retornado pelo provedor do meio de pagamento | Texto | 32 | 0 |
| Payment.ProviderReturnMessage | Mensagem retornada pelo provedor do meio de pagamento | Texto | 512 | Pix gerado com sucesso |

### 2. Implementar a solicitação de uma devolução Pix

Caso o lojista precise "cancelar" uma transferência Pix, é possível realizar uma operação chamada de "devolução". A devolução é realizada através da operação "void", disponível na API Pagador. 
É importante ressaltar que a devolução não é uma operação instantânea, ou seja, a loja ao enviar uma requisiçaõ "void", apenas está solicitando uma devolução que poderá ser acatado ou não pelo Provedor Pix. 
Quando uma devolução é acatada, terá uma notificação sobre o fato, que deve ser devidamente recebido pela loja. Sobre o fluxo de notificação, ler o próximo capítulo.

![Fluxo de Devolução](https://braspag.github.io/images/braspag/pagador/pix/3-pix-devolucao.jpg)

#### Requisição de solicitação de Devolução

| **ENDPOINT** | **MÉTODO** |
|--------------|------------|
| `/v2/sales/{PaymentId}/void?Amount={Amount}` | `PUT` |

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
|`MerchantKey`|Chave Publica para Autenticação Dupla na API. |Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | GUID | 36 |Não|
|`PaymentId`|Campo Identificador do Pedido. |GUID |36 |Sim|
|`Amount`|Valor a ser cancelado/estornado (ser enviado em centavos). Verifique se a adquirente contratada suporta a operação de cancelamento ou estorno|Número |15 |Não|

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
|`Status`|Status da Transação. |Byte | 2 | Ex. 1 |
|`ReasonCode`|Código de retorno da Adquirência. |Texto |32 |Texto alfanumérico
|`ReasonMessage`|Mensagem de retorno da Adquirência. |Texto |512 |Texto alfanumérico

### 3. Preparar a URL para receber o Post de Notificação

Para receber a notificação de alteração de Status (ex. confirmação de pagamento ou devolução, deve-se ter configurado no cadastro de sua loja na Braspag.
O endereço deve ser HTTPS e não utilizar uma porta fora do padrão HTTPS (443). 
Conforme o diagrama abaixo, ao receber a notificação, a loja deve realizar uma consulta à API Pagador, para que de fato confirme o real Status da transação.

![Fluxo de Notificação](https://braspag.github.io/images/braspag/pagador/pix/4-pix-notificacao.jpg)

Ao enviar a notificação, a Cielo espera a resposta HTTP da Loja Status Code 200
Caso não seja retornado o HTTP Status Code 200 será tentado mais duas vezes enviar o Post de Notificação.

```json
{
   "PaymentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
   "ChangeType": "1"
}
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`PaymentId`|Identificador que representa a transação|GUID|36|Sim|
|`ChangeType`|Especifica o tipo de notificação, no caso será sermpre 1 para alteração de Status da transação | Número | 1 |Sim|

### 4. Implementar a consulta 

Como uma parte importante para a implementação do ciclo de vida, é necessário desenvolver a consulta de uma transação Pix através de uma requisição GET, conforme o exemplo.

| **ENDPOINT** | **MÉTODO** |
|--------------|------------|
| `/v2/sales/{PaymentId}` | `GET` |

```shell
--request GET "https://(...)/sales/{PaymentId}"
--header "Content-Type: application/json"
--header "MerchantId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--header "MerchantKey: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Obrigatório|
|-----------|---------|----|-------|-----------|
|`MerchantId`|Identificador da loja na API |GUID |36 |Sim|
|`MerchantKey`|Chave Publica para Autenticação Dupla na API|Texto |40 |Sim|
|`RequestId`|Identificador do Request definido pela loja, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT | GUID | 36 |Não|
|`PaymentId`|Numero de identificação do Pagamento. |Texto |36 |Sim|

### Resposta

```json
{
   "MerchantOrderId": "2020102701",
   "Customer": {
      "Name": "Nome do Pagador"
   },
   "Payment": {
      (...)
      "Provider": "Cielo30",
      "PaymentId": "1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type": "Pix",
      "Amount": 100,
      "Status": 2,
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "ReceivedDate": "2020-10-28 16:25:38",
      "CapturedAmount": 100,
      "CapturedDate": "2020-10-28 17:25:38",
      "VoidedAmount": 100,
      "VoidedDate": "2020-10-31 16:25:38",
      (...)
   }
}
```

```shell
--header "Content-Type: application/json"
--header "RequestId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
--data-binary
{
   "MerchantOrderId": "2020102701",
   "Customer": {
      "Name": "Nome do Pagador"
   },
   "Payment": {
      (...)
      "Provider": "Cielo30",
      "PaymentId": "1997be4d-694a-472e-98f0-e7f4b4c8f1e7",
      "Type": "Pix",
      "Amount": 100,
      "Status": 2,
      "AcquirerTransactionId":"86c200c7-7cdf-4375-92dd-1f62dfa846ad",
         "ProofOfSale":"123456",
      "ReceivedDate": "2020-10-28 16:25:38",
      "CapturedAmount": 100,
      "CapturedDate": "2020-10-28 17:25:38",
      "VoidedAmount": 100,
      "VoidedDate": "2020-10-31 16:25:38",
      (...)
   }
}
--verbose
```

|Propriedade|Descrição|Tipo|Tamanho|Formato|
|-----------|---------|----|-------|-------|
|`MerchantOrderId`|Numero de identificação do Pedido|Texto|50|Texto alfanumérico|
|`Customer.Name`|Nome do comprador|Texto|255|Texto alfanumérico|
|`Payment.Provider`|Nome da provedora de Meio de Pagamento|Texto|15| Consulta os provedores disponíveis nos anexos|
|`Payment.Type`|Tipo do Meio de Pagamento|Texto|100|Ex. CreditCard|
|`Payment.Amount`|Valor do Pedido (ser enviado em centavos)|Número|15|10000|
|`Payment.AcquirerTransactionId`|Id da transação no provedor Pix|Texto|40|Texto alfanumérico|
|`Payment.ProofOfSale`|NSU Pix|Texto|20|Texto alfanumérico|
|`Payment.ReceivedDate`|Data em que a transação foi recebida pela Brapag|Texto|19|AAAA-MM-DD HH:mm:SS|
|`Payment.CapturedAmount`|Valor Pago|Número|15|10000|
|`Payment.CapturedDate`|Data do pagamento Pix|Texto|19|AAAA-MM-DD HH:mm:SS|Ex. "2018-06-19 01:45:57"|
|`Payment.VoidedAmount`|Valor devolvido|Número|15|10000|
|`Payment.VoidedDate`|Data da devolução|Texto|19|AAAA-MM-DD HH:mm:SS|Ex. "2018-06-19 01:45:57"|
|`Payment.Status`|Status da transação. |Byte|2| Ex. 12|
