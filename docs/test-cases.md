# Casos de Teste

## Casos manuais

| ID | Título | Pré-condição | Passos | Resultado esperado | Prioridade |
|---|---|---|---|---|---|
| CT-01 | Login com usuário válido | Estar na tela de login | 1. Informar standard_user / secret_sauce 2. Clicar em Login | Catálogo de produtos exibido | Alta |
| CT-02 | Login com senha incorreta | Estar na tela de login | 1. Informar standard_user e senha errada 2. Clicar em Login | Mensagem de usuário e senha não conferem | Alta |
| CT-03 | Login com usuário bloqueado | Estar na tela de login | 1. Informar locked_out_user / secret_sauce 2. Clicar em Login | Mensagem informando que o usuário está bloqueado | Média |
| CT-04 | Adicionar item ao carrinho | Usuário logado | 1. Clicar em Add to cart no primeiro produto | Contador do carrinho mostra 1 e o botão vira Remove | Alta |
| CT-05 | Remover item no carrinho | Item no carrinho | 1. Abrir o carrinho 2. Clicar em Remove | Carrinho vazio e contador some | Média |
| CT-06 | Checkout completo | Item no carrinho | 1. Clicar em Checkout 2. Preencher nome, sobrenome e CEP 3. Continue 4. Finish | Mensagem "Thank you for your order!" | Alta |
| CT-07 | Checkout sem nome | Item no carrinho | 1. Clicar em Checkout 2. Deixar o nome vazio 3. Continue | Erro "First Name is required" | Média |
| CT-08 | Logout | Usuário logado | 1. Abrir o menu 2. Clicar em Logout | Retorno à tela de login | Baixa |

## Cenários em Gherkin

```gherkin
# language: pt
Funcionalidade: Login

  Cenário: Login com usuário válido
    Dado que estou na tela de login
    Quando informo o usuário "standard_user" e a senha "secret_sauce"
    E clico em "Login"
    Então vejo a página de produtos

  Cenário: Login com senha incorreta
    Dado que estou na tela de login
    Quando informo o usuário "standard_user" e a senha "senha_errada"
    E clico em "Login"
    Então vejo a mensagem "Username and password do not match any user in this service"
```

```gherkin
# language: pt
Funcionalidade: Checkout

  Cenário: Compra concluída com sucesso
    Dado que estou logado como "standard_user"
    E adicionei o produto "Sauce Labs Backpack" ao carrinho
    Quando inicio o checkout e informo nome, sobrenome e CEP válidos
    E confirmo o pedido
    Então vejo a mensagem "Thank you for your order!"

  Cenário: Checkout sem informar o nome
    Dado que estou logado como "standard_user"
    E adicionei o produto "Sauce Labs Backpack" ao carrinho
    Quando inicio o checkout sem preencher o nome
    E clico em "Continue"
    Então vejo a mensagem "Error: First Name is required"
```

```gherkin
# language: pt
Funcionalidade: Reservas na API

  Cenário: Atualizar reserva sem token
    Dado que existe uma reserva criada
    Quando envio um PUT para a reserva sem o token de autenticação
    Então a API responde com status 403
```
