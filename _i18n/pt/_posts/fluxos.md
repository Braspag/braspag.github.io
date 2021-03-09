# Fluxos Transacionais

Além do fluxo transacional **padrão**, existem também os que são modificados pela ação da **análise de fraude** e/ou do **cartão protegido**.

## Fluxos com Antifraude

1. Fluxo AuthorizeFirst: (com opção de revisão manual)
![Antifraude 1](https://braspag.github.io/images/fluxo-trans1-pt.png)

**Loja** – **Pagador** – **Adquirente** – **Pagador** – **Antifraude** – **Loja** (com pré-autorização)

Neste fluxo, a loja (plataforma) envia a requisição para a API Pagador, que então envia a transação para autorização na adquirente cadastrada na loja. Se autorizada, ocorre a pré-autorização da transação. O valor da venda ainda não terá sido cobrado no cartão.
Com a pré-autorização, o Pagador faz a chamada para o Antifraude, onde ocorre a análise de risco do pedido.<br/>
Caso seja aceita pelo antifraude, a transação é então capturada e a cobrança é realizada no cartão. Caso seja rejeitada pelo antifraude, a loja é informada e fica responsável por desfazer a pré-autorização e cancelar o pedido, para que o valor bloqueado no cartão retorne 100% para o cliente final.

**Loja** – **Pagador** – **Adquirente** – **Pagador** – **Antifraude** – **Loja** (com captura automática)

Este fluxo é similar ao primeiro, com a diferença da captura automática no lugar da pré-autorização. Neste caso, se o Antifraude rejeita o pedido que já foi autorizado pela Adquirente e cobrado no cartão do cliente, a transação terá que passar por uma requisição de cancelamento, para que o valor cobrado seja estornado ao cliente.

2. Fluxo AnalyseFirst:
![Antifraude 2](https://braspag.github.io/images/fluxo-trans2-pt.png)

**Loja** – **Antifraude** – **Loja**<br/>
**Loja** – **Pagador** – **Adquirente** – **Pagador** - **Loja**

Neste fluxo, a loja (plataforma) envia a requisição para o Antifraude, que analisa o risco da transação, tendo a chance de rejeitá-la antes mesmo da tentativa de autorização do pagamento.
Caso o pedido seja aceito pelo antifraude, a loja envia uma requisição de autorização da transação para o Pagador, que encaminha essa solicitação para a Adquirente. Sendo autorizada pela Adquirente, a transação é capturada automaticamente e o fluxo é finalizado.

## Fluxos com Cartão Protegido

1. Fluxos 1:
![Cartão Protegido 1](https://braspag.github.io/images/fluxo-trans3-pt.png)

**Loja** – **Cartão Protegido**<br/>
**Loja** – **Pagador** - **Adquirente**

Neste fluxo, a loja (plataforma) solicita a tokenização do cartão antes mesmo da compra de fato ocorrer. Ex.: quando o comprador escolhe salvar os dados do seu cartão no momento do checkout de pagamento, a plataforma aciona a API do Cartão Protegido solicitando a tokenização do cartão do comprador, para efetuação da “Compra por 1 Clique”. Após o processo de tokenização, é enviado à loja o CardToken gerado.

PS: A loja pode optar pela utilização do serviço VerifyCard (Zero Auth) em conjunto com o serviço de tokenização do cartão. Com o VerifyCard, a API do Cartão Protegido primeiramente recebe a requisição do Zero Auth e faz a validação com a adquirente, que responde se o cartão é válido ou não. A API envia então este retorno à loja, que irá escolher fazer ou não a requisição de tokenização do cartão. 

2. Fluxo 2:
![Cartão Protegido 2](https://braspag.github.io/images/fluxo-trans4-pt.png)

**Loja** – **Pagador** - **Loja**

Neste fluxo, a loja (plataforma) utiliza o cartão protegido dentro da requisição de autorização de uma compra à própria API do Pagador. Ex.: quando o comprador autoriza, geralmente na primeira vez que utiliza um app ou site, que seu cartão seja salvo para futuras “compras com 1 clique”. 

