# Plano de Teste

## 1. Objetivo
Garantir que os fluxos críticos de compra (web) e o ciclo de reservas (API) funcionem, com feedback rápido a cada pull request e regressão completa à noite.

## 2. Escopo
**Dentro do escopo**
- Web (saucedemo): login, logout, carrinho, checkout e validação de campos obrigatórios.
- API (restful-booker): autenticação, criar, consultar, listar, atualizar e remover reservas; respostas 403 e 404; contrato de tipos.
- Integração: sessão autenticada reutilizada e checkout com dados originados na API.

## 3. Fora de escopo
- Performance e carga.
- Acessibilidade e testes visuais.
- Outros usuários do saucedemo (problem_user, performance_glitch_user).
- Compatibilidade com outros browsers e mobile.

## 4. Tipos de teste
| Tipo | Ferramenta | Frequência |
|---|---|---|
| Smoke (@smoke) | Playwright | cada pull request |
| Regressão (@regression) | Playwright | push na main e noturno |
| Funcional de API | Playwright request | cada execução |
| Exploratório manual | casos em `test-cases.md` | a cada mudança relevante |

## 5. Ambientes
- Web: https://www.saucedemo.com
- API: https://restful-booker.herokuapp.com
- Execução: máquina local (Node 18+) e GitHub Actions (ubuntu-latest, Chromium).

## 6. Critérios de entrada
- Alvos públicos acessíveis.
- Dependências instaladas (`npm ci`).
- Código de testes compilando (`npm run typecheck`).

## 7. Critérios de saída
- 100% dos testes @smoke aprovados para aceitar um pull request.
- Pelo menos 95% da regressão aprovada, sem falhas abertas em fluxos críticos (login e checkout).
- Defeitos críticos e altos resolvidos ou com aceite formal.

## 8. Riscos
| Risco | Impacto | Mitigação |
|---|---|---|
| Serviços públicos instáveis | falsos negativos | retries no CI e análise de trace |
| Dados compartilhados na API pública | testes interferirem entre si | massa única e cleanup por fixture |
| Mudança de seletores no saucedemo | quebra de testes web | Page Objects centralizam o ajuste |
| Comportamento da API mudar sem aviso | falhas de contrato | testes de contrato documentam o esperado |

## 9. Métricas
Taxa de aprovação por execução, tempo total da suíte, quantidade de testes instáveis (passam só no retry) e defeitos por severidade.
