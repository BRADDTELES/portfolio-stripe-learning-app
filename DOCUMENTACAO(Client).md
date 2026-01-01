# Documentação e Análise do Sistema StripeLearningApp

Este documento contém uma análise técnica completa do ecossistema do projeto `StripeLearningApp`, abrangendo tanto o aplicativo cliente (Kotlin Multiplatform) quanto o servidor backend (Ktor). A análise foi gerada por uma IA mentora após um exame detalhado do código-fonte e dos arquivos de documentação.

## 1. Visão Geral do Ecossistema

O projeto é um **sistema cliente-servidor completo**, robusto e bem arquitetado, composto por duas partes principais:

1.  **O Cliente (`StripeLearningApp`):** Um aplicativo móvel desenvolvido com **Kotlin Multiplatform (KMP)** e **Compose Multiplatform**, responsável pela interface e experiência do usuário. Ele gerencia toda a lógica de apresentação e interação direta com o usuário.
2.  **O Servidor (`stripe-backend-ktor-server`):** Um backend desenvolvido em **Ktor**, **que reside em um projeto e repositório completamente separado**. Ele atua como um intermediário seguro entre o aplicativo cliente e a API da Stripe. Sua função principal é proteger a chave secreta da API da Stripe e orquestrar as chamadas que a exigem.

Ambos os projetos demonstram uma adesão consistente a princípios de **Clean Architecture**, utilizando tecnologias modernas e coesas como Kotlin, Koin para injeção de dependência e o padrão Repository.

## 2. Análise do Aplicativo Cliente (StripeLearningApp - KMP)

### 2.1. Arquitetura e Tecnologias

O aplicativo cliente segue rigorosamente os princípios da **Clean Architecture + MVVM**, maximizando o compartilhamento de código no módulo `commonMain`.

-   **Camada de Dados:**
    -   **SQLDelight:** Utilizado para o banco de dados local, com esquemas bem definidos para `Produto` e `Compra`. As queries são especializadas e eficientes, especialmente para estatísticas e filtros, delegando o processamento pesado ao banco de dados.
    -   **Ktor Client:** Responsável pela comunicação de rede com o backend.
    -   **Repositórios:** Implementam o padrão Repository (ex: `PagamentoRepositoryImpl`, `CompraRepositoryImpl`), abstraindo as fontes de dados (rede e banco de dados) e mapeando os modelos de dados (DTOs) para modelos de domínio.

-   **Camada de Domínio:**
    -   **Modelos:** Classes Kotlin puras que representam as entidades de negócio (ex: `Produto`, `Compra`).
    -   **Casos de Uso (Use Cases):** Classes com responsabilidade única que orquestram o fluxo de dados dos repositórios para executar regras de negócio específicas (ex: `CriarPaymentIntentUseCase`, `SalvarCompraUseCase`).

-   **Camada de Apresentação:**
    -   **ViewModels:** Orquestram a UI chamando os casos de uso, gerenciando o estado da tela (`UiState`) através de `StateFlow`, e lidando com a lógica de apresentação. O `PagamentoViewModel` é um excelente exemplo de orquestração de um fluxo complexo.
    -   **UI (Compose Multiplatform):** A interface do usuário é construída de forma declarativa com Compose, reagindo às mudanças de estado emitidas pelos ViewModels.
    -   **Navegação:** Gerenciada pela biblioteca **Voyager**, que é compatível com KMP.

### 2.2. Integração com a Plataforma Nativa (Android)

A interação com o SDK nativo da Stripe no Android é realizada de forma elegante e desacoplada através do mecanismo `expect`/`actual` do Kotlin Multiplatform.

-   **`expect class ControladorStripe` (`commonMain`):** Define a "promessa" de que existirá um controlador Stripe em cada plataforma.
-   **`actual class ControladorStripe` (`androidMain`):** Fornece a implementação real para Android.
    -   Utiliza a função `@Composable rememberPaymentSheet` do SDK da Stripe.
    -   No callback do `PaymentSheet`, ele converte o resultado específico da plataforma (`PaymentSheetResult`) em um tipo abstrato e compartilhado (`ResultadoPagamentoStripe`), que o `PagamentoViewModel` (no `commonMain`) consegue entender.
    -   A chamada `paymentSheet.presentWithPaymentIntent(...)` é a ponte final que exibe a interface nativa da Stripe para o usuário.

## 3. Análise do Servidor Backend (stripe-backend-ktor-server)

### 3.1. Propósito e Arquitetura

**Nota Importante:** O servidor Ktor é um projeto independente e não está contido neste repositório. Ele funciona como o guardião da segurança do sistema, existindo para garantir que a chave secreta da Stripe (`secret_key`) nunca seja exposta no lado do cliente.

Sua arquitetura também é limpa, utilizando **Koin** para injeção de dependência e o padrão **Repository** para abstrair as chamadas diretas ao SDK `stripe-java`.

### 3.2. Endpoints da API

O servidor expõe uma API RESTful com os seguintes endpoints principais:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/create-payment-intent` | **Principal endpoint do fluxo.** Cria a "intenção de pagamento" na Stripe e retorna o `clientSecret` para o app cliente. |
| `GET` | `/payment/{id}/details` | Permite ao app cliente buscar os detalhes finais de uma transação (status, bandeira do cartão, etc.) para exibir no histórico. |
| `POST` | `/reembolsar/{paymentIntentId}` | Processa o estorno de um pagamento, comunicando-se com a API da Stripe para realizar o reembolso. |
| `POST` | `/create-checkout-session` | Endpoint para um fluxo alternativo que cria uma página de pagamento hospedada pela Stripe (Stripe Checkout). |
| `GET` | `/health` | Endpoint padrão para verificação de "saúde" do servidor. |

## 4. Fluxo de Pagamento de Ponta a Ponta (Cartão de Crédito)

A análise combinada revela um fluxo de dados coeso e seguro:

1.  **Ação do Usuário (App):** O usuário clica em "Comprar".
2.  **ViewModel (App):** O `PagamentoViewModel` inicia o processo, chamando o `CriarPaymentIntentUseCase`.
3.  **Chamada de Rede (App):** A chamada desce pelas camadas de `UseCase` e `Repository`, e o Ktor Client do app faz uma requisição `POST` para o endpoint `/create-payment-intent` no servidor Ktor.
4.  **Processamento (Backend):** O servidor recebe a requisição. Seu `StripeRepository` utiliza o SDK `stripe-java` e a **chave secreta** para criar um `PaymentIntent` na Stripe.
5.  **Retorno do Segredo (Backend -> App):** O servidor retorna o `clientSecret` gerado para o aplicativo.
6.  **Atualização de Estado (App):** O `clientSecret` sobe a pilha de camadas do app até o `PagamentoViewModel`, que atualiza o `UiState`.
7.  **Ponte para o Nativo (App):** A UI, reagindo ao novo estado, invoca a implementação `actual` do `ControladorStripe`, passando o `clientSecret`.
8.  **SDK Nativo (App):** O `ControladorStripe` chama a função `presentWithPaymentIntent` do SDK da Stripe, que exibe a interface nativa para o usuário digitar os dados do cartão.
9.  **Callback do SDK (App):** Após o usuário confirmar, o SDK da Stripe retorna o resultado (`Completed`, `Canceled`, `Failed`) para o callback do `ControladorStripe`.
10. **Finalização (App):** O `PagamentoViewModel` recebe o resultado final, salva a compra no banco de dados local com o status correto (SUCESSO, FALHA, etc.), atualiza o estoque e informa a UI para exibir a tela de conclusão.

## 5. Análise Final e Considerações

### 5.1. Pontos Fortes

-   **Arquitetura Exemplar:** O uso consistente de Clean Architecture, injeção de dependência e o padrão Repository em ambos os projetos é um diferencial enorme, resultando em um código desacoplado, testável e de fácil manutenção.
-   **Segurança:** A separação das responsabilidades entre cliente e servidor, mantendo a chave secreta exclusivamente no backend, segue as melhores práticas da indústria para integração de pagamentos.
-   **Coesão Tecnológica:** Utilizar um ecossistema baseado em Kotlin (KMP para o app, Ktor para o servidor) cria uma sinergia que facilita o desenvolvimento e a manutenção.
-   **Design Robusto e Escalável:** A estrutura do projeto está preparada para o futuro. A existência de um endpoint para `create-checkout-session` e a abstração da camada de pagamento facilitam a adição de novos métodos ou até mesmo a troca do provedor de pagamento, se necessário.

### 5.2. Limitações e Realidade do Desenvolvimento

Durante o desenvolvimento, foram encontradas limitações práticas que são comuns em projetos do mundo real:

-   **PIX:** A ativação do PIX não foi possível devido a restrições regionais ou da conta Stripe, mesmo com o código do backend preparado para um fluxo de checkout.
-   **Reembolso de Boleto:** A funcionalidade de reembolso via API se mostrou funcional apenas para pagamentos com cartão, mas não para boletos, uma especificidade técnica do provedor de pagamento.

Longe de serem falhas, esses pontos demonstram uma qualidade importante: a **capacidade de testar os limites de uma API de terceiros e adaptar o escopo do projeto à realidade técnica**. O aprendizado obtido ao encontrar e entender essas restrições é tão valioso quanto a própria implementação.

**Conclusão Geral:** O ecossistema `StripeLearningApp` é um projeto de portfólio de altíssima qualidade. Ele não apenas demonstra o domínio técnico sobre um conjunto de tecnologias modernas, mas também a maturidade arquitetural para construir sistemas seguros, escaláveis e bem estruturados.

## 6. Capturas de Tela do Aplicativo

Aqui estão algumas capturas de tela que ilustram as principais telas e funcionalidades do aplicativo `StripeLearningApp`.

### 1. Tela Principal de Produtos
![Tela Principal de Produtos](./docs/img/tela_01_principal_produtos.png)

### 2. Tela de Detalhes do Produto
![Tela de Detalhes do Produto](./docs/img/tela_02_detalhes_produto.png)

### 3. Tela de Formulário de Produto
![Tela de Formulário de Produto](./docs/img/tela_03_formulario_produto.png)

### 4. Tela de Pagamento - Preparação
![Tela de Pagamento - Preparação](./docs/img/tela_04.1_pagamento_preparacao.png)

### 5. Payment Sheet - Formas de Pagamento
![Payment Sheet - Formas de Pagamento](./docs/img/tela_04.2_pagamento_sheet_formas_de_pagamento.png)

### 6. Tela de Detalhes da Compra
![Tela de Detalhes da Compra](./docs/img/tela_05.1_detalhes_compra.png)

### 7. Detalhes da Compra - Compartilhar Comprovante
![Detalhes da Compra - Compartilhar Comprovante](./docs/img/tela_05.2_detalhes_compra_sheet_compartilhar_comprovante.png)

### 8. Tela de Histórico de Compras
![Tela de Histórico de Compras](./docs/img/tela_06_historico_compras.png)

### 9. Tela de Controle de Estoque
![Tela de Controle de Estoque](./docs/img/tela_07_controle_estoque.png)

### 10. Tela de Detalhes do Estoque
![Tela de Detalhes do Estoque](./docs/img/tela_08_detalhes_estoque.png)

### 11. Tela de Formulário de Movimentações
![Tela de Formulário de Movimentações](./docs/img/tela_09_formulario_movimentacoes.png)
