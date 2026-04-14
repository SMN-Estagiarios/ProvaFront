# Prova Tecnica: Projeto MeuBolso (Frontend)

## 1. Contexto e Objetivo

O MeuBolso e um sistema de gestao financeira pessoal.

O objetivo desta prova e construir o frontend da aplicacao consumindo endpoints do proprio projeto MVC (backend acoplado), seguindo o mesmo padrao de consumo usado no Liceu.

O foco principal da avaliacao e:

- TypeScript
- Manipulacao de DOM com jQuery
- Padrao de organizacao do Liceu
- UX responsiva

Importante: o backend ja esta pronto. Nao e necessario implementar controller, service, repository ou banco para concluir a prova.

---

## 2. Requisitos Tecnicos Obrigatorios

- Linguagem: TypeScript
- Bibliotecas: jQuery e UIKit (CSS/JS)
- Estrutura: seguir o padrao de paginas com `init(params)` e separacao de logica por pagina/componente
- Sem frameworks SPA: proibido React, Vue e Angular
- Tratamento de dados: validacao de formularios no front e tratamento de erro com feedback visual (loading + toast)

---

## 3. Escopo Das Telas e Funcionalidades

### A. Dashboard (Home)

- Cards com:
  - Receitas do mes
  - Despesas do mes
  - Saldo atual
- Visualizacao de despesas por categoria (grafico simples ou barras com UIKit)
- Lista de proximos vencimentos (lancamentos pendentes com data futura)

### B. Gestao de Lancamentos (Principal da Prova)

- Listagem semantica obrigatoria com `ul` e `li`
- Comportamento responsivo da listagem:
  - Desktop (largura maior que 960px): layout em linha, estilo tabela
  - Mobile (largura menor ou igual a 960px): cada `li` deve virar card
- Filtros:
  - Periodo (mes/ano)
  - Tipo (entrada/saida)
  - Categoria
- Acoes:
  - Listar
  - Criar
  - Editar
  - Excluir

### C. Cadastros Auxiliares

- Categorias:
  - Listagem
  - Cadastro rapido (ex.: Alimentacao, Lazer, Aluguel)
- Contas/Carteiras:
  - Listagem
  - Cadastro de origem/destino financeiro (ex.: Nubank, Carteira Fisica)

---

## 4. Padrao de Consumo (Cenario MVC Acoplado - Igual ao Liceu)

Nao usar cliente REST desacoplado com base fixa `/api` como regra principal.

No padrao do Liceu, as URLs sao montadas na View Razor com `@Url.Action(...)` e passadas no `init(params)` da pagina.

### Como deve funcionar

1. A View carrega o bundle da pagina (entry.js).
2. A View injeta um objeto `urls` com todas as actions necessarias.
3. O TypeScript consome `model.urls.*` com `$.get`, `$.post` e `$.postFormData`.
4. Erros devem usar `Toast.error(...)`.
5. Loading global e automatico via configuracao do `components/jquery`.

### Exemplo de inicializacao esperado na View

```html
<script>
         ProvaFront.home.init({
            message: {
                error: '@TempData["ErrorMessage"]',
                success: '@TempData["SuccessMessage"]'
            },
            urls: {
                index: '@Url.Action(nameof(OrdemServicoController.Index).ActionName(), nameof(OrdemServicoController).ControllerName())',
                removerOrdemServico: '@Url.Action(nameof(OrdemServicoController.Excluir).ActionName(), nameof(OrdemServicoController).ControllerName())',
                getModalCriarOrdemServico: '@Url.Action(nameof(OrdemServicoController.GetModalCriar).ActionName(), nameof(OrdemServicoController).ControllerName())',
                adicionarOrdemServico: '@Url.Action(nameof(OrdemServicoController.Adicionar).ActionName(), nameof(OrdemServicoController).ControllerName())',
                buscarItens: '@Url.Action(nameof(EstoqueController.BuscarItens).ActionName(), nameof(EstoqueController).ControllerName())',
                getModalEditarOrdemServico: '@Url.Action(nameof(OrdemServicoController.GetModalEditar).ActionName(), nameof(OrdemServicoController).ControllerName())',
                editarOrdemServico: '@Url.Action(nameof(OrdemServicoController.Editar).ActionName(), nameof(OrdemServicoController).ControllerName())',
                obterDetalhes: '@Url.Action(nameof(OrdemServicoController.ObterDetalhes).ActionName(), nameof(OrdemServicoController).ControllerName())',
                atualizarStatus: '@Url.Action(nameof(OrdemServicoController.AtualizarStatus).ActionName(), nameof(OrdemServicoController).ControllerName())',
                getModalImpressao: '@Url.Action(nameof(OrdemServicoController.GetModalImpressao).ActionName(), nameof(OrdemServicoController).ControllerName())'
            }
        });
    </script>
 
```

### Contrato minimo de actions para a prova (MVC)

| Metodo HTTP | Action (sugestao) | Uso no front |
|---|---|---|
| GET | Index | Renderizar tela principal com lista/filtros |
| GET | Cadastro | Buscar parcial do modal/form de cadastro |
| POST | Cadastro | Enviar criacao |
| GET | Editar | Buscar parcial do modal/form de edicao |
| POST | Editar | Enviar alteracao |
| POST | Excluir | Excluir registro |

Observacao importante: no Liceu, mesmo operacoes de exclusao e edicao frequentemente usam POST em actions MVC.

---

## 5. Regras De Implementacao No Front

- Seguir padrao de pasta e uso adotado no template
- Cada pagina deve expor inicializacao via `init(params)`
- Integrar com Razor no padrao do projeto (script da pagina + chamada do namespace global + urls injetadas por `Url.Action`)
- Exibir loading durante requisicoes
- Exibir toast de sucesso/erro em operacoes
- Seguir o comportamento do Liceu para fluxo de tela: quando fizer sentido, pode usar redirecionamento para `model.urls.index` apos sucesso

---
