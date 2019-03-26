---
layout: manual
title: Split de Pagamentos - Liquidação em Ciclo
description: Split de Pagamentos - Liquidação em Ciclo
search: true
toc_footers: false
categories: manual
sort_order: 3
hub_visible: false
tags:
---

# Split de Pagamentos - Liquidação em Ciclo

## Introdução

O **Split de Pagamentos** liquida os valores referentes a cada participante de uma transação de acordo com o regime padrão de cada arranjo de pagamento.

Como exemplo, para uma transação de crédito realizada em 4x e envolvendo 2 Subordinados, cada participante, inclusive o Master, receberá os valores referentes a cada parcela da transação citada em 30, 60, 90 e 120 dias.

![RegimeLiquidacaoPadrao](https://braspag.github.io/images/braspag/split/regime-pagamento-padrao.png)

Com a Liquidação em Ciclo, é possível que o Master solicite que um ou mais subordinados recebam em ciclo, podendo escolher até duas datas fixas no mês.

![RegimeLiquidacaoCiclo](https://braspag.github.io/images/braspag/split/regime-pagamento-ciclo.png)

Para consultar a agenda financeira com a previsão dos recebíveis futuros, consulte o manual [Split de Pagamentos](https://braspag.github.io//manual/split-pagamentos-braspag#agenda-financeira){:target="_blank"}.

## Cálculo

Na liquidação em ciclo, o **Split de Pagamentos** aplica um fator percentual sobre a participação do subordinado na venda.

Supondo uma transação de R$1.000,00, em 4 parcelas, e os seguintes parâmetros:

**Mdr Braspag:** 3.00%  
**Mdr Master / Subordinado A:** 20.00%  
**Mdr Master / Subordinado B:** 5.00%  
**Participação Subordinado A:** R$600,00  
**Participação Subordinado B:** R$400,00  

O cáculo ocorrerá da seguinte forma:

**Mdr Braspag:** R$1.000,00 * 3.00% = R$30,00  
**[Bruto] Master / Subordinado A:** R$600,00 * 20.00% = R$120,00  
**[Bruto][Líquido] Subordinado A:** R$600,00 - R$120,00 = R$480,00  
**[Bruto] Master / Subordinado B:** R$400,00 * 5.00% = R$20,00  
**[Bruto][Líquido] Subordinado B:** R$400,00 - R$20,00 = R$380,00  
**[Líquido] Master:** R$140,00 - R$30,00 = R$110,00  

Considerando que o Subordinado A tenha optado por receber, todas as parcelas serão liquidadas na data fixa escolhida. Com isso, considerando os novos parâmetros abaixo o cálculo ocorrerá da seguinte forma:

**Mdr Braspag:** 3.00%  
**Fator por Parcela Braspag:** 1.00%  
**Fator Total Braspag:** 4.00% (fator x número de parcelas)  
  
**Mdr Master / Subordinado A:** 20.00%  
**Fator por Parcela Master:** 2.50%  
**Fator Total Master:** 10.00% (fator x número de parcelas)  
**Desconto Total Master / Subordinado A:** 20.00% + 10.00% = 30.00%  
  
**Mdr Master / Subordinado B:** 5.00%  
  
**Participação Subordinado A:** R$600,00  
**Participação Subordinado B:** R$400,00  

O cáculo ocorrerá da seguinte forma:
  
**Mdr Braspag:** R$1.000,00 * 3.00% = R$30,00  
**[Bruto] Master / Subordinado A:** R$600,00 * 30.00% = R$180,00  
**[Bruto][Líquido] Subordinado A:** R$600,00 - R$180,00 = R$420,00   
**Braspag / Valor Subordinado A:** R$600,00 * 4.00% = R$24,00  
**[Bruto] Master / Subordinado B:** R$400,00 * 5.00% = R$20,00  
**[Bruto][Líquido] Subordinado B:** R$400,00 - R$20,00 = R$380,00  
**Braspag Total:** R$30,00 + R$24,00 = R$54,00  
**[Bruto] Master:** R$180,00 + R$20,00 = R$200,00  
**[Líquido] Master:** R$200,00 - R$54,00 = R$146,00  

## Regras

A liquidação em ciclo de vendas no Split é baseada nas seguintes regras:

* Somente os subordinados podem receber em ciclos.
* Somente o Master pode solicitar que um subordinado passe a receber no ciclo.
* É possível escolher até duas datas fixas para liquidação.
* Serão liquidadas nas datas escolhidas as transações que forem capturadas em até 2 dias antes da data fixa escolhida.
* Transações que, por algum motivo, sofrerem atraso e não puderem ser liquidadas nas datas escolhidas, serão liquidadas no dia útil imediatamente após o processamento da mesma.
* A liquidação é realizada com base na data de captura da transação.
* Transações que tenham participantes no ciclo poderão ter sua divisão alterada em 1 dia após a data de captura.
* Transações que não tenham participantes no ciclo poderão ter sua divisão alterada, incluindo um participante no ciclo, em até 1 dia após a data de captura.  

<br>  
Supondo que um subordinado deseje receber em dois fixos no mês, 15 e 25, e que a adoção da liquidação em ciclo tenha sido realizada no dia 18:

* Todas as transações que ocorrerem do dia 19 ao 23 serão liquidadas no dia 25.  
* As transação que ocorrerem do dia 24 ao 13 do mês subsequente serão liquidadas no dia 15.   
* O ciclo se repete com as liquidações realizadas do dia 14 ao 23 sendo liquidadas no dia 25.  

<br>  
Caso ocorra atraso na liquidação de alguma transação, a mesma será liquidada no dia útil imediatamente após ter seu processamento concluído.