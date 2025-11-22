# ✅ **CHECKLIST COMPLETO DE TESTES DE EVENTO**

## **1. EVENTO SEM RECORRÊNCIA**

### **1.1 Evento de 1 dia**

* [X] (Inválido) Criar evento com 1 dia **sem lotes** → deve dar erro
* [X] Criar evento com 1 lote, **sem tipos**
* [X] Criar evento com 1 lote **com tipos**
* [X] Criar evento com 1 dia com **preço geral por dia** (`hasSpecificPrice = true`)
* [X] Criar evento com 1 dia com **preço por tipo por dia**

---

### **1.2 Evento com múltiplos dias**

* [X] Criar evento com 2+ dias, **sem preço por dia** (usar preço do lote)
* [X] Criar evento com 2+ dias com **preço geral por dia**
* [ ] Criar evento com 2+ dias com **preço por tipo por dia**
* [ ] Misturar dias com e sem preço específico:
  * [ ] Dia 1 usa preço do lote
  * [ ] Dia 2 usa preço geral do dia
  * [ ] Dia 3 usa preço por tipo do dia

---

### **1.3 Evento com múltiplos lotes**

* [ ] Criar 2 lotes  **sem tipos** , testar mudança por data
* [ ] Criar 2 lotes  **com tipos** , testar estoque por tipo
* [ ] Lotes + preço por dia: validar que o preço do dia **sempre domina**
* [ ] Testar `accumulateUnsold = true`
* [ ] Testar `accumulateUnsold = false`
* [ ] Testar `autoActivateNext = true`
* [ ] Testar `autoActivateNext = false`

---

## **2. EVENTO COM RECORRÊNCIA**

### **2.1 Recorrência semanal**

* [ ] Criar evento toda sexta 3 meses, sem preços por dia
* [ ] Criar evento toda sexta com **preço geral por dia**
* [ ] Criar evento toda sexta com **preço por tipo por dia**
* [ ] Criar evento misturando dias com e sem preço por dia
* [ ] Criar evento semanal com **2 lotes**
* [ ] Validar que lote ativo é aplicado por occurrence

---

### **2.2 Recorrência diária**

* [ ] Criar evento diário por 10 dias sem preço específico
* [ ] Criar evento diário com preço geral por dia
* [ ] Criar evento diário com preço por tipo por dia
* [ ] Criar evento diário com múltiplos lotes

---

### **2.3 Recorrência customizada**

(dias selecionados: seg + qua + sáb)

* [ ] Criar evento recorrente customizado sem preços por dia
* [ ] Criar evento recorrente customizado com preços por dia
* [ ] Misturar dias com e sem preço específico
* [ ] Validar que apenas os dias selecionados são criados

---

## **3. ESTOQUE**

* [ ] Estoque por tipo por lote: vender até esgotar corretamente
* [ ] Vender acima do estoque deve falhar
* [ ] Testar estoque com `autoActivateNext = true`
* [ ] Testar estoque sem auto ativação
* [ ] Evento multi-day: criar múltiplas entradas em `EventBatchTicketTypeDate`
* [ ] Ingresso válido para vários dias cria múltiplas linhas corretamente
* [ ] Ingresso válido para 1 dia cria apenas 1 linha

---

## **4. TIPOS DE INGRESSO**

* [ ] Evento com **um único tipo genérico**
* [ ] Evento com 2+ tipos
* [ ] Preço por tipo no lote funcionando
* [ ] Preço por tipo no dia funcionando
* [ ] Validar precedência completa:
  * [ ] 1️⃣ Preço por tipo no dia
  * [ ] 2️⃣ Preço geral no dia
  * [ ] 3️⃣ Preço por tipo no lote
  * [ ] Deve ignorar preço do lote se dia tiver preço

---

## **5. VALIDAÇÕES**

* [ ] Criar evento sem lotes → deve falhar
* [ ] Criar lote sem tipos (quando evento tem tipos) → falhar
* [ ] Dia com `hasSpecificPrice` mas sem preço → falhar
* [ ] ticketTypeId inexistente → falhar
* [ ] Data sem `hourStart` → falhar

---

## **6. CHECKOUT**

* [ ] Comprar ingresso para um único dia
* [ ] Comprar ingresso para vários dias
* [ ] Preço multi-day deve ser soma dos preços dos dias
* [ ] Estoque multi-day deve validar todos os dias envolvidos
* [ ] Comprar ingresso em evento com 1 dia sem selecionar dia
* [ ] Comprar ingresso em evento recorrente → occurrence correta
* [ ] Testar mudanças de lote no checkout (data e estoque)

---

## **7. E2E COMPLETO**

* [ ] Criar evento completo:
  * [ ] com lotes
  * [ ] com tipos
  * [ ] com múltiplos dias
  * [ ] com preços por dia
  * [ ] com recorrência
* [ ] Criar → Listar → Comprar → Gerar ticket → Validar check-in
