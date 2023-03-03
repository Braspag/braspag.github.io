---
layout: manual
title: Split de Pagamentos - Balcão de Recebiveis
description: Manual sobre a Estrutura do Balcao de Recebiveis
search: true
toc_footers: false
categories: manual
sort_order: 7
hub_visible: false
tags:
  - 6. Soluções para Marketplace
---

# Introdução

Devido a Resolução nº 4.734/2019 e a Circular nº 3.952/2019 publicadas pelo Conselho Monetário Nacional (CMN) e Banco Central do Brasil, que entrou em vigor na data de 07/06/2021, nossos sistemas de conciliação foram restruturados visando atender estas normas.

Em resumo, a circular e a resolução definem que as Credenciadoras e Subcredenciadoras devem assegurar que as agendas financeiras dos estabelecimentos comerciais, contendo a previsão de liquidação dos recebíveis originados através de transações com cartão de crédito ou cartão de débito, estejam registradas em Sistema de Registro operado por entidades autorizadas a funcionar pelo Banco Central do Brasil para este fim, permitindo com que os estabelecimentos comerciais possam realizar operações de desconto de recebíveis ou operações de crédito garantidas pelos recebíveis.

A ideia desta documentação é explicar as principais mudanças que ocorreram na estrutura de **Conciliação da Plataforma do Split de Pagamentos**.

## Fluxo de conciliação - Antes

O Split de Pagamentos possuía uma estrutura de agenda financeira dividida por merchants, na qual no dia previsto eram geradas grades de pagamento para serem liquidadas.

No exemplo abaixo, temos o Merchant A que possui duas transações agendadas para serem liquidadas no dia 09/06. É gerada uma grade contendo o valor total que o Merchant tem para receber, onde é enviado para o Banco realizar a liquidação no dia previsto.

![SplitSample001](https://braspag.github.io//images/braspag/split/s1.png)

# Novo fluxo de conciliação

No novo modelo, a agenda financeira nasce um novo conceito chamado Unidade de Recebíveis. Estas unidades são compostas pelo montante financeiro que o cliente possui para receber, data de pagamento e arranjo. As URs seguem uma estrutura parecida com a Grade, porém com a diferença que são agrupadas pelo número de documento do cliente (CPF / CNPJ) e não mais por Merchant.

![SplitSample002](https://braspag.github.io//images/braspag/split/s2.png)

## Conciliação com efeitos de contrato

Com o Registro de Recebíveis será permitido negociar as URs em aberto como operações de desconto ou operações de crédito garantidas. Com isso, uma UR total/parcial poderá ser direcionada para outra instituição. No exemplo abaixo, o cliente realizou uma negociação de Cessão com Troca de Titularidade com o Banco do Brasil, onde R$ 50,00 de uma UR foi utilizada como garantia. A UR é quebrada com o valor acordado com a instituição:

![SplitSample003](https://braspag.github.io//images/braspag/split/s3.png)

## Relatórios

Abaixo seguem as descrições das colunas contidas nos relatórios transacionais e de recebíveis. Você pode solicitar os relatórios com nosso [Suporte](https://suporte.braspag.com.br/hc/pt-br){:target="_blank"}.

### Relatório de transações

| Nome                   | Descrição                                                |
| ---------------------- | -------------------------------------------------------- |
| CorporateName          | Razão social do Master que realizou a transação          |
| FancyName              | Nome fantasia do Master que realizou a transação         |
| DocumentNumber         | Número de documento do Master que realizou a transação   |
| DocumentType           | Tipo de documento do Master que realizou a transação     |
| MerchantId             | Identificador único do Master que realizou a transação   |
| TransactionId          | Identificador único da transação                         |
| AuthorizationDate      | Data de autorização da transação                         |
| CaptureDate            | Data de captura da transação                             |
| Amount                 | Valor da transação em centavos                           |
| Installments           | Número de parcelas                                       |
| AuthorizationCode      | Código de autorização da transação                       |
| Nsu                    | Nsu da transação                                         |
| AcquirerTransactionId  | Identificador único da transação na Adquirente (TID)     |
| TerminalLogicNumber    | Número lógico do terminal em que ocorreu a transação     |
| AffiliationCode        | Código de afiliação (EC) onde ocorreu a transação        |
| CardNumber             | Número do cartão que realizou a transação                |
| Brand                  | Bandeira (Visa, Master, etc.)                            |
| Product                | Produto (Crédito, Débito, etc.)                          |
| OrderId                | Número de pedido estabelecido pelo lojista               |
| Status                 | Status da transação                                      |
| TransactionChannel     | Canal em que o ocorreu a transação (Físico ou E-comerce) |
| MasterRateDiscountType | Tipo de desconto taxas aplicado sobre a transação        |

### Relatório de Participantes

| Nome                   | Descrição                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| CorporateName          | Razão social do participante                                                                      |
| FancyName              | Nome fantasia do participante                                                                     |
| DocumentNumber         | Número de documento do participante                                                               |
| DocumentType           | Tipo de documento do participante                                                                 |
| MerchantType           | Tipo de Merchant do participante (Master ou Subordinado)                                          |
| MasterRateDiscountType | Tipo de desconto aplicado sobre o Merchant                                                        |
| TransactionId          | Identificador único da transação                                                                  |
| OrderId                | Número de pedido estabelecido pelo lojista                                                        |
| TransactionTotalAmount | Valor total da transação em centavos                                                              |
| MerchantGrossAmount    | Valor bruto de venda referente ao participante em centavos                                        |
| MerchantNetAmount      | Valor líquido referente ao participante em centavos                                               |
| Mdr                    | Taxa de MDR em % aplicada sobre o participante                                                    |
| Fee                    | Taxa de Fee em centavos aplicada sobre o participante                                             |
| BankSlipFee            | Tarifa de boleto em centavos (Em casos de transação de boleto)                                    |
| RRTotalRate            | Taxa em % que será aplicada pela Braspag sobre o valor a ser antecipado pelo Receba Rápido        |
| RRFee                  | Taxa em centavos que será aplicada pela Braspag sobre o valor a ser antecipado pelo Receba Rápido |

### Relatório de estornos

| Nome                   | Descrição                                                      |
| ---------------------- | -------------------------------------------------------------- |
| CorporateName          | Razão social do participante                                   |
| FancyName              | Nome fantasia do participante                                  |
| DocumentNumber         | Número de documento do participante                            |
| DocumentType           | Tipo de documento do participante                              |
| MerchantType           | Tipo de Merchant do participante (Master ou Subordinado)       |
| TransactionId          | Identificador único da transação                               |
| OrderId                | Número de pedido estabelecido pelo lojista                     |
| TransactionTotalAmount | Valor total da transação em centavos                           |
| VoidId                 | Identificador único do estorno                                 |
| EventDate              | Data de realização do estorno                                  |
| VoidTotalAmount        | Valor total estornado                                          |
| VoidGrossAmount        | Valor bruto de estorno aplicado sobre o Merchant em centavos   |
| VoidNetAmount          | Valor líquido de estorno aplicado sobre o Merchant em centavos |
| Reverted               | Se o estorno foi revertido (0 para não ou 1 para sim)          |

### Relatório de chargebacks

| Nome                   | Descrição                                                         |
| ---------------------- | ----------------------------------------------------------------- |
| CorporateName          | Razão social do participante                                      |
| FancyName              | Nome fantasia do participante                                     |
| DocumentNumber         | Número de documento do participante                               |
| DocumentType           | Tipo de documento do participante                                 |
| MerchantType           | Tipo de Merchant do participante (Master ou Subordinado)          |
| TransactionId          | Identificador único da transação                                  |
| OrderId                | Número de pedido estabelecido pelo lojista                        |
| TransactionTotalAmount | Valor total da transação em centavos                              |
| ChargebackId           | Identificador único do chargeback                                 |
| EventDate              | Data de realização do chargeback                                  |
| ChargebackTotalAmount  | Valor total do chargeback                                         |
| ChargebackGrossAmount  | Valor bruto de chargeback aplicado sobre o Merchant em centavos   |
| ChargebackNetAmount    | Valor líquido de chargeback aplicado sobre o Merchant em centavos |
| Reversed               | Se o chargeback foi revertido (0 para não ou 1 para sim)          |

### Relatório de agenda

| Nome                  | Descrição                                                |
| --------------------- | -------------------------------------------------------- |
| CorporateName         | Razão social do participante                             |
| FancyName             | Nome fantasia do participante                            |
| DocumentNumber        | Número de documento do participante                      |
| DocumentType          | Tipo de documento do participante                        |
| MerchantType          | Tipo de Merchant do participante (Master ou Subordinado) |
| MerchantId            | Identificador único do Master que realizou a transação   |
| AuthorizationDate     | Data de autorização da transação                         |
| CaptureDate           | Data de captura da transação                             |
| TransactionId         | Identificador único da transação                         |
| InstallmentNumber     | Número da parcela agendada                               |
| ForecastedPaymentDate | Data prevista para liquidação da agenda                  |
| Event                 | Evento referente a agenda                                |
| InstallmentNetAmount  | Valor do evento de agenda em centavos                    |
| Brand                 | Bandeira (Visa, Master, etc.)                            |
| Product               | Produto (Crédito, Débito, etc.)                          |
| OrderId               | Número de pedido estabelecido pelo lojista               |
| AuthorizationCode     | Código de autorização da transação                       |
| Nsu                   | Nsu da transação                                         |
| AffiliationCode       | Código de afiliação (EC) onde ocorreu a transação        |

### Relatório de recebíveis

| Nome                         | Descrição                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------- |
| CorporateName                | Razão social da entidade legal mantenedora da unidade de recebíves                |
| DocumentNumber               | Número de documento da entidade legal mantenedora da unidade de recebíves         |
| DocumentType                 | Tipo de documento da entidade legal mantenedora da unidade de recebíves           |
| ReceivableId                 | Identificador único da unidade de recebíveis                                      |
| URAmount                     | Valor total em centavos da unidade de recebíveis                                  |
| HolderDocumentNumber         | Número de documento da entidade legal mantenedora da unidade de recebíves         |
| HolderDocumentType           | Tipo de documento da entidade legal mantenedora da unidade de recebíves           |
| ForecastedPaymentDate        | Data prevista para liquidação do recebível                                        |
| PaymentDate                  | Data de liquidação do recebível                                                   |
| Brand                        | Bandeira do arranjo de pagamentos que compõe o recebível                          |
| Product                      | Produto do arranjo de pagamentos que compõe o recebível                           |
| PreContractedAmount          | Valor em centavos précontratado com o sistema de Receba Rápido no recebível       |
| ReceivablePaymentGroupType   | Tipo de recebível ( Livre-> ExemptedSchedule / Negociado -> DealedSchedule )      |
| ForecastedAmount             | Valor em centavos previsto para ser liquidado                                     |
| ReceivablePaymentGroupStatus | Status de liquidação do recebível                                                 |
| PosContractedAnticipation    | Informa se o recebível está reservado devido a uma antecipação (1-> Sim/ 0-> Não) |
| Bank                         | Nome do banco em que o recebível será liquidado                                   |
| CompeCode                    | Código do banco em que o recebível será liquidado                                 |
| BankAccountNumber            | Número da conta em que o recebível será liquidado                                 |
| BankAccountDigit             | Dígito verificador da conta em que o recebível será liquidado                     |
| BankAccountType              | Tipo de conta em que o recebível será liquidado                                   |
| AgencyNumber                 | Número da agência em que o recebível será liquidado                               |
| AgencyDigit                  | Dígito verificador da agência em que o recebível será liquidado                   |
| BankAccountDocumentNumber    | Número de documento da conta em que o recebível será liquidado                    |
| BankAccountDocumentType      | Tipo de documento da conta em que o recebível será liquidado                      |
| BankAccountHolderName        | Nome do mantenedor da conta em que o recebível será liquidado                     |
| ContractEffectProtocol       | Identificador único de contrato firmado para cessão de recebíves                  |
