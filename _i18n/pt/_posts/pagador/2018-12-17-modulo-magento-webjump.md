---
layout: tutorial
title:  Módulo Magento 2.0 Webjump
description: Como Integrar sua loja Magento com o módulo de pagamentos Braspag na Webjump
toc_footers: true
categories: tutorial
translated: true
sort_order: 5
tags:
  - Pagador
---

# Antes de começar:

Faça sempre um backup de sua loja antes de iniciar a instalação do módulo.
Nunca realize testes em módulos no seu ambiente de produção.
Sempre faça os testes em um ambiente de testes isolado.
Quando subir o módulo na loja em produção, sempre faça um backup completo dos arquivos e banco de dados.

# Requisitos Técnicos

* Para utilizar o módulo o servidor deve conter os seguintes componentes PHP

* Extensão Ioncube Loader 8.3 ou superior (http://www.ioncube.com/loaders.php)

 PHP SOAP
 PHP cURL

# Instalação

1. Desabilite a compilação, caso esteja ativa em Sistema > Ferramentas > Compilação.
2. Desabilite o Cache do Magento.
3. Faça o logout do backend.
4. Copie os arquivos do módulo em sua loja.
5. Faça o login no backend.
6. Vá em Sistema > Configurações.
7. Clique em Braspag > Payment General Configuration
8. Acesse o link _"click here to request"_ no campo Serial key e siga as instruções na página para solicitar o número de série.
9. Cadastre o número de série enviado para o e-mail selecionado no campo apropriado.
10. Acesse as abas de opções da integração que será utilizada em sua loja (Transacion, Post Index ou Post Passthrough) e faça as devidas configurações.

# Importante

* Não se esqueça de solicitar a liberação do endereço IP do seu servidor junto a Braspag.
* Para utilizar o recurso de confirmação automática do pagamento de boleto e cartão de débito (recurso 2.o post), é necessário solicitar a configuração da URL na Braspag. O endereço está disponível em Sistema > Configuração > Braspag by Webjump > Payment - General Configuratio >Status Update.
* Será necessário gerar um novo número de série sempre que o alterar a url, informações da loja (Sistema->Configuração->Geral->Informações sobre a Loja) ou atualizar o módulo.
* Caso seu acesso às configurações seja negado ou em caso de erro 404, Faça o logout e depois acesse novamente o backend.

