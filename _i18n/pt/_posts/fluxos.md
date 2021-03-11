# Fluxos Transacionais

Além do fluxo transacional **padrão**, existem também os que são modificados pela ação da **análise de fraude** e/ou do **cartão protegido**.

## Fluxos com Antifraude

### 1. Fluxo AuthorizeFirst:

**Com Pré-Autorização**

Neste fluxo, a loja (plataforma) envia a requisição para a API Pagador, que então envia a transação para autorização na adquirente cadastrada na loja. Se autorizada, ocorre a pré-autorização da transação. O valor da venda ainda não terá sido cobrado no cartão.
Com a pré-autorização, o Pagador faz a chamada para o Antifraude, onde ocorre a análise de risco do pedido.<br/>
Caso seja aceita pelo antifraude, a transação é então capturada e a cobrança é realizada no cartão. Caso seja rejeitada pelo antifraude, a loja é informada e fica responsável por desfazer a pré-autorização e cancelar o pedido, para que o valor bloqueado no cartão retorne 100% para o cliente final.

![Antifraude 1a](https://braspag.github.io/images/fluxo-trans1a-mod-pt.png)

<br/>**Com Captura Automática**

Este fluxo é similar ao primeiro, com a diferença da captura automática no lugar da pré-autorização. Neste caso, se o Antifraude rejeita um pedido que já foi autorizado pela Adquirente e cobrado no cartão do cliente, a transação terá que passar posteriormente por uma requisição de cancelamento, para que o valor cobrado seja estornado ao cliente.

![Antifraude 1b](https://braspag.github.io/images/fluxo-trans1b-pt.png)

### 2. Fluxo AnalyseFirst:

Neste fluxo, a loja (plataforma) envia a requisição para o Antifraude, que analisa o risco da transação, tendo a chance de rejeitá-la antes mesmo da tentativa de autorização do pagamento.
Caso o pedido seja aceito pelo antifraude, a loja envia uma requisição de autorização da transação para o Pagador, que encaminha essa solicitação para a Adquirente. Sendo autorizada pela Adquirente, a transação é capturada automaticamente e o fluxo é finalizado.

![Antifraude 2](https://braspag.github.io/images/fluxo-trans2-pt.png)

## Fluxos com Cartão Protegido

### 1. Pela API do Cartão Protegido:

Neste fluxo, a loja (plataforma) solicita a tokenização do cartão antes mesmo da compra de fato ocorrer. Ex.: quando o comprador escolhe salvar os dados do seu cartão no momento do checkout de pagamento, a plataforma aciona a API do Cartão Protegido solicitando a tokenização do cartão do comprador, para efetuação da “Compra por 1 Clique”. Após o processo de tokenização, é enviado à loja o CardToken gerado.

![Cartão Protegido 1](https://braspag.github.io/images/fluxo-trans3a-pt.png)

<br/>**Com VerifyCard**

Nota: A loja pode optar pela utilização da funcionalidade *VerifyCard* em conjunto com o serviço de tokenização do cartão. Neste caso, a API do VerifyCard primeiramente recebe a requisição do serviço Zero Auth e faz a validação com a adquirente, que responde se o cartão é válido ou não. A API do VerifyCard envia então este retorno à loja, que irá escolher fazer ou não a requisição de tokenização do cartão para a API do Cartão Protegido. 

![Cartão Protegido 1](https://braspag.github.io/images/fluxo-trans3b-pt.png)

### 2. Pela API do Pagador:

Neste fluxo, a loja (plataforma) utiliza o cartão protegido dentro da própria requisição de autorização de compra feita à API do Pagador. Ex.: quando o comprador autoriza, geralmente na primeira vez que utiliza um app ou site, que seu cartão seja salvo para futuras “compras com 1 clique”. 

![Cartão Protegido 2](https://braspag.github.io/images/fluxo-trans4-pt.png)
