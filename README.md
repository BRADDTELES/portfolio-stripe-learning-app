# Stripe Learning App (Compose Multiplatform)

Este é um projeto de aprendizado desenvolvido em Compose Multiplatform (CMP), rodando o KMP por trás embutido, com o objetivo principal de estudar e implementar a integração de pagamentos utilizando o SDK da Stripe em um ambiente compartilhado entre Android e iOS.

A arquitetura do projeto segue os princípios de <span>Clean Architecture + MVVM</span>, com a lógica de negócio e o estado da UI centralizados no módulo compartilhado (`commonMain`).

### Parceria no Desenvolvimento

Este projeto será guiado e construído com o auxílio de uma Inteligência Artificial Generativa, que atuará como um Professor, Instrutor e Mentor de Desenvolvimento Sênior. O objetivo é aprender do zero, passo a passo, como configurar e desenvolver um aplicativo em Compose Multiplatform e integrar a API de pagamentos da Stripe, documentando cada etapa do processo.

### Regras e Proibições

A **Inteligência Artificial Generativa** está Proíbida de alterar arquivos, modificar qualquer códigos, sem que eu Danillo autorize.

Outras Regras a serem cumpridas pela a Inteligência Artificial Generativa:
- Falará comigo sempre em Português Brasil;
- Toda vez que for administrar uma aula para me ensinar, terá que examinar os arquivos que participará da aula, para verificar se o arquivo existe ou o conteúdo mais recente dentro dos arquivos;
- Ao sugerir a criação de implementações de códigos, os nomes das funções, métodos, classes, objetos, propriedades deverão ser em português e não em inglês;
- A **Inteligência Artificial Generativa da sigla IAG** deverá tirar minhas dúvidas, após me mostrar os códigos a serem usados em cada implemetação;
- A cada 5 tarefas concluídas, a **IAG** deverá atualizar o arquivo REAMDE.md como re-desenhar a Estrutura do Projeto, adicionar mais Seção de tarefas executadas e a seção de Proximas tarefas.

## 📄 Documentação Detalhada

Para uma análise técnica aprofundada da arquitetura e dos fluxos de dados deste projeto, consulte a nossa [Documentação Detalhada](./DOCUMENTACAO(Client).md).

## 🛠️ Tecnologias e Bibliotecas

Este projeto utiliza um conjunto moderno de ferramentas e bibliotecas para desenvolvimento KMP:

- **[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform-get-started.html)**: Framework principal que permite compartilhar código de lógica de negócio, acesso a dados e apresentação entre diferentes plataformas (Android e iOS).
- **[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)**: Toolkit de UI declarativo e compartilhado para construir a interface do usuário uma única vez para múltiplas plataformas.
- **[Stripe Android SDK](https://stripe.com/docs/mobile/android)**: Biblioteca nativa (versão 22.4.0) para processamento de pagamentos no Android, integrada ao projeto KMP através do `androidMain`.
- **[Koin](https://insert-koin.io/)**: Framework leve para injeção de dependência, compatível com KMP.
- **[Voyager](https://voyager.adriel.cafe/)**: Biblioteca de navegação (versão 1.0.1) para Compose Multiplatform, permitindo gerenciar o fluxo de telas de forma compartilhada.
- **[Ktor Client](https://ktor.io/docs/getting-started-ktor-client.html)**: Cliente HTTP assíncrono e multiplataforma para chamadas a APIs REST.
- **[Ktor Server](https://ktor.io/)**: Framework de servidor usado no backend para criar a API REST de pagamentos.
- **[SQLDelight](https://cashapp.github.io/sqldelight/)**: Gera interfaces Kotlin type-safe a partir de statements SQL, permitindo um banco de dados local compartilhado.
- **[Kamel](https://kamel-media.github.io/)**: Biblioteca Multiplatform para carregamento e exibição de imagens, incluindo suporte a SVG e GIFs animados.
- **[Peekaboo](https://github.com/nicktorres/peekaboo)**: Biblioteca Kotlin Multiplatform para seleção de imagens da galeria do dispositivo.

## 📁 Estrutura do Projeto

A estrutura do projeto é organizada em módulos, separando o código compartilhado (`commonMain`) das implementações específicas de cada plataforma (`androidMain` e `iosMain`).

```
composeApp/src/
├── androidMain/
│   ├── kotlin/.../stripelearningapp/
│   │   ├── data/
│   │   │   └── local/
│   │   │        └── DatabaseDriverFactory.android.kt # para o driver do DB
│   │   ├── di/
│   │   │   ├── DatabaseModule.kt # Módulo Koin específico do Android
│   │   │   └── PlatformModule.kt
│   │   ├── platform/
│   │   │   ├── AbrirTelefone.android.kt     # 'actual' com a implementação do Stripe SDK
│   │   │   ├── AppContextHolder.kt
│   │   │   ├── AudioPlayer.android.kt
│   │   │   ├── ContextProvider.kt
│   │   │   ├── ControladorStripe.android.kt # 'actual' com a implementação do Stripe SDK
│   │   │   ├── GeradorComprovante.android.kt # 'actual' com a implementação do Stripe SDK
│   │   │   └── GerenciadorImagem.android.kt
│   │   ├── AppPreview.android.kt
│   │   ├── MainActivity.kt       # Ponto de entrada (Activity) do app Android
│   │   ├── Platform.android.kt   # 'actual' para informações da plataforma
│   │   └── StripeApplication.kt  # Classe Application (setup do Koin no Android)
│   │
│   ├── res/                      # Recursos do Android (ícones, strings, temas)
│   └── AndroidManifest.xml       # Manifesto do aplicativo
│
├── commonMain/
│   └── kotlin/.../stripelearningapp/
│   │   └──org/
│   │       └──danilloteles/
│   │           └──stripelearningapp/
│   │               ├── App.kt                # UI principal compartilhada com Compose
│   │               ├── Greeting.kt
│   │               ├── Platform.kt
│   │               ├── data/                 # Camada de Dados (Repositórios, Mappers)
│   │               │   ├── mapper/
│   │               │   │   ├── CompraMapper.kt
│   │               │   │   ├── EstoqueMapper.kt
│   │               │   │   ├── MovimentacaoEstoqueMapper.kt
│   │               │   │   └── ProdutoMapper.kt
│   │               │   ├── remote/
│   │               │   │   ├── dto/
│   │               │   │   │   ├── DetalhesPagamentoResponse.kt
│   │               │   │   │   ├── PaymentIntentRequest.kt
│   │               │   │   │   ├── PaymentIntentResponse.kt
│   │               │   │   │   ├── PaymentIntentStatusResponse.kt
│   │               │   │   │   ├── PaymentSheetRequest.kt
│   │               │   │   │   └── PaymentSheetResponse.kt
│   │               │   │   └── StripeApiClient.kt
│   │               │   └── repository/
│   │               │       ├── CompraRepositoryImpl.kt
│   │               │       ├── EstoqueRepositoryImpl.kt
│   │               │       ├── MovimentacaoEstoqueRepositoryImpl.kt
│   │               │       ├── PagamentoRepositoryImpl.kt
│   │               │       └── ProdutoRepositoryImpl.kt
│   │               ├── di/                   # Injeção de Dependência compartilhada (Koin)
│   │               │   ├── MapperModule.kt
│   │               │   ├── NetworkModule.kt
│   │               │   ├── RepositoryModule.kt
│   │               │   ├── UseCaseModule.kt
│   │               │   └── ViewModelModule.kt
│   │               ├── domain/               # Camada de Domínio (Modelos, Repositórios e Casos de Uso)
│   │               │   ├── model/
│   │               │   │   ├── Compra.kt
│   │               │   │   ├── DadosComprovante.kt
│   │               │   │   ├── DetalhesPagamento.kt
│   │               │   │   ├── Estoque.kt
│   │               │   │   ├── HistoricoFiltro.kt
│   │               │   │   ├── MovimentacaoEstoque.kt
│   │               │   │   ├── Produto.kt
│   │               │   │   └── ResultadoPagamento.kt
│   │               │   ├── repository/
│   │               │   │   ├── CompraRepository.kt
│   │               │   │   ├── EstoqueRepository.kt
│   │               │   │   ├── MovimentacaoEstoqueRepository.kt
│   │               │   │   ├── PagamentoRepository.kt
│   │               │   │   └── ProdutoRepository.kt
│   │               │   └── usecase/
│   │               │       ├── compra/
│   │               │       │   ├── ObterCompraPorIdUseCase.kt
│   │               │       │   ├── ObterComprasFiltradasUseCase.kt
│   │               │       │   ├── ObterEstatisticasComprasFiltradasUseCase.kt
│   │               │       │   ├── ObterEstatisticasComprasUseCase.kt
│   │               │       │   ├── ObterTodasAsComprasUseCase.kt
│   │               │       │   ├── SalvarCompraUseCase.kt
│   │               │       │   └── SincronizarStatusComprasUseCase.kt
│   │               │       ├── estoque/
│   │               │       │   ├── InserirOuAtualizarEstoqueUseCase.kt
│   │               │       │   ├── ObterEstoquePorProdutoIdUseCase.kt
│   │               │       │   ├── ObterEstoquesBaixosUseCase.kt
│   │               │       │   ├── ObterTodosOsEstoquesUseCase.kt
│   │               │       │   └── VerificarDisponibilidadeEstoqueUseCase.kt
│   │               │       ├── movimentacao/
│   │               │       │   ├── ObterMovimentacaoPorCompraUseCase.kt
│   │               │       │   ├── ObterMovimentacoesPorProdutoUseCase.kt
│   │               │       │   ├── ObterTodasAsMovimentacoesUseCase.kt
│   │               │       │   ├── RegistrarEntradaEstoqueUseCase.kt
│   │               │       │   ├── RegistrarEstornoCompraUseCase.kt
│   │               │       │   ├── RegistrarSaidaEstoqueUseCase.kt
│   │               │       │   └── RegistrarSaidaPorVendaUseCase.kt
│   │               │       ├── pagamento/
│   │               │       │   ├── CriarPaymentIntentUseCase.kt
│   │               │       │   ├── ObterDetalhesPagamentoUseCase.kt
│   │               │       │   ├── ObterStatusPagamentoUseCase.kt
│   │               │       │   └── ProcessarPagamentoUseCase.kt
│   │               │       └── produto/
│   │               │           ├── DeletarProdutoPorIdUseCase.kt
│   │               │           ├── InserirOuAtualizarProdutoUseCase.kt
│   │               │           ├── ObterProdutoPorIdUseCase.kt
│   │               │           └── ObterProdutosUseCase.kt
│   │               ├── platform/             # Abstrações de plataforma (expect)
│   │               │   ├── AbrirTelefone.kt
│   │               │   ├── AudioPlayer.kt
│   │               │   ├── ControladorStripe.kt
│   │               │   ├── GeradorComprovante.kt
│   │               │   └── GerenciadorImagem.kt
│   │               └── presentation/         # Camada de Apresentação (ViewModels)
│   │                   ├── componentes/
│   │                   │   ├── m3expressive/ # Componentes do Material 3 Expressive
│   │                   │   │   ├── ButtonWithAnimatedShapeSample.kt
│   │                   │   │   ├── LargeRoundUniformOutlinedIconButtonSample.kt
│   │                   │   │   ├── OutlinedButtonWithAnimatedShapeSample.kt
│   │                   │   │   └── TextButtonWithAnimatedShapeSample.kt
│   │                   │   ├── AlertDialogSuporte.kt
│   │                   │   ├── AlertDialogSuporteTelefone.kt
│   │                   │   ├── BotaoExpressivoPersonalizado.kt
│   │                   │   ├── BotaoSalvarProdutoAnimado.kt
│   │                   │   ├── CaixaPuxarParaAtualizar.kt
│   │                   │   ├── CampoPreco.kt
│   │                   │   ├── CardExpressivoPersonalizado.kt
│   │                   │   ├── CarregamentoExpressivoPersonalizado.kt
│   │                   │   ├── HistoricoComprasFiltroToggleGroup.kt
│   │                   │   ├── IconeExpressivoPersonalizado.kt
│   │                   │   ├── ImagemExpressivaPersonalizada.kt
│   │                   │   ├── ImagemIconPng.kt
│   │                   │   ├── OutlinedButtonExpressivoPersonalizado.kt
│   │                   │   ├── OutlinedButtonExpressivoPersonalizado.kt
│   │                   │   ├── TextButtonExpressivoPersonalizado.kt
│   │                   │   └── TextoExpressivoPersonalizadov.kt
│   │                   ├── telas/
│   │                   │   ├── compras/
│   │                   │   │   └── HistoricoComprasTela.kt 
│   │                   │   ├── detalhes/
│   │                   │   │   ├── DetalhesCompraTela.kt
│   │                   │   │   ├── DetalhesEstoqueTela.kt
│   │                   │   │   └── DetalhesProdutoTela.kt
│   │                   │   ├── estoque/
│   │                   │   │   └── ListaEstoqueTela.kt
│   │                   │   ├── formulario/
│   │                   │   │   ├── FormularioMovimentacaoTela.kt
│   │                   │   │   └── FormularioProdutoTela.kt  
│   │                   │   ├── pagamento/
│   │                   │   │   └── PagamentoTela.kt
│   │                   │   ├── produtos/
│   │                   │   │   └── ListaProdutosTela.kt 
│   │                   │   └── splash/
│   │                   │       ├── SplashScreenContent.kt
│   │                   │       └── SplashTela.kt
│   │                   ├── theme/
│   │                   │   └── AppTheme.kt
│   │                   ├── util/
│   │                   │   ├── ErroAmigavel.kt
│   │                   │   └── FormatadorMoeda.kt
│   │                   └── viewmodel/
│   │                       ├── compras/
│   │                       │   └── HistoricoComprasViewModel.kt
│   │                       ├── detalhes/
│   │                       │   ├── DetalhesCompraViewModel.kt
│   │                       │   ├── DetalhesEstoqueViewModel.kt
│   │                       │   └── DetalhesProdutoViewModel.kt
│   │                       ├── estoque/
│   │                       │   └── ListaEstoqueViewModel.kt
│   │                       ├── formulario/
│   │                       │   ├── FormularioMovimentacaoViewModel.kt
│   │                       │   └── FormularioProdutoViewModel.kt
│   │                       ├── pagamento/
│   │                       │  └── PagamentoViewModel.kt
│   │                       └── produtos/
│   │                           └── ListaProdutosViewModel.kt
│   │ 
│   └── sqldelight/
│       └── org/                                                                               
│          └── danilloteles/                                                                  
│              └── stripelearningapp/                                                         
│                  └── db/
│                      ├── Compra.sq                # Definições do banco de dados SQLDelight                                                     
│                      ├── Estoque.sq               # Definições do banco de dados SQLDelight                                                     
│                      ├── MovimentacaoEstoque.sq   # Definições do banco de dados SQLDelight                                                     
│                      ├── Produto.sq               # Definições do banco de dados SQLDelight                                                        
│                      └── migrations/              # Migrações
│                           ├── 1.sqm
│                           ├── 2.sqm
│                           ├── 3.sqm
│                           ├── 4.sqm
│                           ├── 5.sqm
│                           ├── 6.sqm
│                           └── 7.sqm
│
└── iosMain/
    └── kotlin/.../stripelearningapp/
        ├── platform/
        │   ├── AbrirTelefone.ios.kt     # 'actual' (placeholder) para iOS
        │   ├── ControladorStripe.ios.kt # 'actual' (placeholder) para iOS
        │   ├── GeradorComprovante.ios.kt # 'actual' (placeholder) para iOS
        │   └── GerenciadorImagem.ios.kt
        ├── MainViewController.kt # Ponto de entrada do app iOS
        └── Platform.ios.kt       # 'actual' para informações da plataforma            

```

## ✅ Tarefas Concluídas

### Ciclo 1 — Fundação do Projeto

1.  **`expect`/`actual` para Pagamento (Lições 1, 2 e 3):**
    *   Definimos a "promessa" com `expect class ControladorStripe` no `commonMain`.
    *   Entregamos a implementação real no `androidMain`, usando o `rememberPaymentSheet` do SDK da Stripe para Compose.
    *   Criamos um placeholder no `iosMain` para garantir a compilação multiplataforma.

2.  **Criação do ViewModel (Lição 4):**
    *   Estruturamos a camada de apresentação (`presentation`) criando o `DetalhesProdutoViewModel`.
    *   Usamos `ScreenModel` da biblioteca Voyager, a alternativa multiplataforma ao ViewModel do Android.

3.  **Injeção de Dependência para ViewModel (Lição 5):**
    *   Configuramos o `DetalhesProdutoViewModel` no módulo Koin (`viewModelModule`), ensinando o Koin a criar instâncias do ViewModel sob demanda (`factory`) e a injetar suas dependências (`get()`).

### Ciclo 2 — Telas e Fluxo de Produtos

4.  **Tela de Lista de Produtos:**
    *   Criamos `ListaProdutosTela` com `LazyColumn` para exibir os produtos.
    *   Implementamos `ListaProdutosViewModel` com estados `Carregando`, `Sucesso` e `Erro`.
    *   Adicionamos navegação para detalhes ao clicar em um produto.

5.  **Tela de Detalhes do Produto:**
    *   Desenvolvemos `DetalhesProdutoTela` exibindo nome, descrição, preço e botão "Comprar".
    *   Integramos com `DetalhesProdutoViewModel` para carregar dados do produto.

6.  **Tela de Formulário (Criar Produto):**
    *   Criamos `FormularioProdutoTela` com campos: nome, descrição, preço e URL da imagem.
    *   Implementamos `FormularioProdutoViewModel` com validação de campos.
    *   Adicionamos FAB na lista para navegar ao formulário.

7.  **Funcionalidade de Edição de Produto:**
    *   Adaptamos `FormularioProdutoTela` para suportar modo edição.
    *   Adicionamos botão de editar (ícone ✏️) na `DetalhesProdutoTela`.
    *   Implementamos recarregamento automático ao voltar da edição.

8.  **Funcionalidade de Remoção de Produto:**
    *   Implementamos `SwipeToDismissBox` na lista para arrastar e remover.
    *   Adicionamos `AlertDialog` de confirmação antes de excluir.
    *   Exibimos `Snackbar` com feedback após remoção.

9.  **Melhorias de UX no Formulário:**
    *   Adicionamos limite de caracteres: Nome (50) e Descrição (200).
    *   Implementamos contador visual de caracteres com cor dinâmica.

### Ciclo 3 — Imagens Locais

10. **Sistema de Imagens com Armazenamento Local:**
    *   Criamos `GerenciadorImagem` com `expect/actual` para salvar e carregar imagens.
    *   Implementamos `salvarImagem()`, `carregarImagem()`, `deletarImagem()` e `imagemExiste()`.
    *   Integramos biblioteca Peekaboo para seleção de imagens da galeria.
    *   Atualizamos `FormularioProdutoTela` com seletor de imagem e preview.
    *   Atualizamos `FormularioProdutoViewModel` para salvar bytes da imagem localmente.
    *   Exibimos imagens na `ListaProdutosTela` (thumbnail no card).
    *   Exibimos imagens na `DetalhesProdutoTela` (imagem grande).

### Ciclo 4 — Integração Backend e Stripe API ✅

11. **Backend com Ktor Server (Repositório Separado):**
    *   Criamos projeto backend separado: `stripe-backend-ktor-server`.
    *   Configuramos rotas REST:
        - `POST /create-payment-intent` → Cria PaymentIntent na Stripe
        - `GET /health` → Health check do servidor
    *   Integramos SDK da Stripe para Java/Kotlin (server-side).
    *   Configuramos variáveis de ambiente (`STRIPE_SECRET_KEY`).
    *   **Deploy no Render** com URL pública funcionando.

12. **Ktor Client no App (Comunicação com Backend):**
    *   Adicionamos dependências do Ktor Client no `build.gradle.kts`.
    *   Criamos `StripeApiClient` no módulo `data/remote`.
    *   Configuramos URL base para produção (Render).
    *   Implementamos chamada `POST /create-payment-intent`.
    *   Configuramos timeout de 60 segundos para cold start do Render.
    *   Adicionamos logs de debug para troubleshooting.

13. **Integração App ↔ Backend ↔ Stripe:**
    *   Criamos `NetworkModule` para injeção do `StripeApiClient`.
    *   Atualizamos `ResultadoPagamento` com estado `PagamentoPronto`.
    *   Atualizamos `PagamentoRepository` e `PagamentoRepositoryImpl`.
    *   Criamos `CriarPaymentIntentUseCase`.
    *   Atualizamos `PagamentoViewModel` com máquina de estados.
    *   Atualizamos `PagamentoTela` com UI completa (Loading, Pronto, Erro, Sucesso).

14. **Validação da Integração:**
    *   ✅ PaymentIntent sendo criado com sucesso na Stripe.
    *   ✅ `clientSecret` sendo recebido no app.
    *   ✅ Transações aparecendo no Dashboard Stripe (Modo Teste).
    *   ✅ Tela "Pagamento Pronto" exibindo informações corretamente.

### Ciclo 5 — Fluxo Completo de Pagamento ✅

15. **Integração com Stripe Payment Sheet (Android):**
    *   Configuramos `PaymentSheet` com o `clientSecret` recebido do backend.
    *   Implementamos apresentação do formulário de cartão nativo da Stripe.
    *   Testamos com cartões de teste:
        - `4242 4242 4242 4242` → ✅ Sucesso
        - `4000 0000 0000 9995` → ✅ Cartão recusado
        - `4000 0025 0000 3155` → ✅ 3D Secure (COMPLETE/FAIL)
    *   Tratamos callbacks de sucesso/erro/cancelamento.
    *   Status atualizado corretamente no Dashboard Stripe.

16. **Histórico de Compras:**
    *   Criamos tabela `Compra` no SQLDelight com campos: id, produtoId, produtoNome, valor, dataCompra, status.
    *   Implementamos `CompraRepository` e `CompraRepositoryImpl`.
    *   Criamos Use Cases: `SalvarCompraUseCase`, `ObterTodasAsComprasUseCase`, `ObterEstatisticasComprasUseCase`.
    *   Desenvolvemos `HistoricoComprasViewModel` com estatísticas.
    *   Criamos `HistoricoComprasTela` com:
        - Card de estatísticas (total de compras, valor total)
        - Lista de compras com status visual (✅ Sucesso / ❌ Falha)
        - Formatação de data/hora brasileira
    *   Adicionamos ícone de histórico na TopAppBar da lista de produtos.

17. **Salvamento Automático de Compras:**
    *   Integração do salvamento no fluxo de pagamento.
    *   Compras com sucesso salvam com `StatusCompra.SUCESSO`.
    *   Compras com falha salvam com `StatusCompra.FALHA`.

18. **Tratamento de Erros Amigáveis:**
    *   Criamos `ErroAmigavel` com categorização de tipos de erro.
    *   Implementamos `MapeadorErros` para traduzir erros técnicos.
    *   Mensagens amigáveis em português para:
        - Sem conexão com internet
        - Timeout do servidor
        - Erro no servidor
        - Erro genérico
    *   Ícones visuais diferenciados por tipo de erro (WifiOff, CloudOff, Error).

19. **Botão "Contatar Suporte":**
    *   Criamos `AlertDialogSuporte` com informações de contato.
    *   Implementamos `AbrirTelefone` com `expect/actual` para Android e iOS.
    *   Criamos `AppContextHolder` para acesso ao Context fora de Composables.
    *   Configuração centralizada em `ConfiguracaoSuporte` (placeholder para dados reais).
    *   Botão aparece apenas em erros de servidor ou genéricos.

20. **Teste de Cenários:**
    *   ✅ Pagamento com cartão válido
    *   ✅ Pagamento com cartão recusado
    *   ✅ Pagamento com 3D Secure (sucesso e falha)
    *   ✅ Pagamento sem conexão (modo avião)
    *   ✅ Histórico funcionando offline (dados locais)

### Ciclo 6 — Detalhes da Compra e Integração Stripe Avançada ✅

21. **Tela de Detalhes da Compra:**
    *   Criamos `DetalhesCompraTela` com navegação a partir do histórico.
    *   Implementamos `DetalhesCompraViewModel` para carregar compra por ID.
    *   Exibimos informações completas: produto, valor, data formatada, status com cor.
    *   Criamos `ObterCompraPorIdUseCase` para busca individual.
    *   Adicionamos card de identificadores com IDs copiáveis (`SelectionContainer`).

22. **Salvamento do PaymentIntent ID:**
    *   Adicionamos coluna `paymentIntentId` na tabela `compraEntidade` (nullable para retrocompatibilidade).
    *   Criamos migração `2.sqm` para adicionar coluna em bancos existentes.
    *   Atualizamos `Compra.kt` (domain model) com novo campo.
    *   Atualizamos `CompraMapper` para mapear o novo campo.
    *   Implementamos extração do ID a partir do `clientSecret` no `PagamentoViewModel`.

23. **Exibição do ID da Transação Stripe:**
    *   Adicionamos linha "ID da Transação (Stripe)" no card de identificadores.
    *   Tratamento de `null` para compras antigas (exibe "Não disponível").
    *   ID copiável para consulta no Dashboard Stripe.

24. **Tratamento de Pagamento Cancelado:**
    *   Criamos novo status `StatusCompra.CANCELADA`.
    *   Implementamos `onPagamentoCancelado()` no `PagamentoViewModel`.
    *   Adicionamos estado `pagamentoCancelado` no `PagamentoUiState`.
    *   Criamos `CanceladoContent` na `PagamentoTela` com opções de retry.
    *   Compras canceladas são salvas para métricas de abandono.

25. **Correção das Estatísticas do Histórico:**
    *   Criamos queries filtradas: `contarComprasSucesso` e `somarValorComprasSucesso`.
    *   Adicionamos métodos na interface `CompraRepository`.
    *   Atualizamos `ObterEstatisticasComprasUseCase` para contar apenas SUCESSO.
    *   Estatísticas agora ignoram compras canceladas/com falha.

### Ciclo 7 — Melhorias e Novas Funcionalidades ✅

26. **Exportar Comprovante (PDF):**
    *   Gerado o PDF com dados da compra.
    *   Implementamos a incluição: produto, valor, data, ID da transação.
    *   Implementamos o compartilhamento via Intent (Android).

27. **Filtros no Histórico:**
    *   Criamos componente Grupo de Botões para Filtrar por período (Recentes, Concluído, Cancelado).

28. **Pull-to-Refresh no Histórico de Compras:**
    *   Criamos componente reutilizável `CaixaPuxarParaAtualizar` em `commonMain`.
    *   Implementamos indicador de loading com `PullToRefreshDefaults.LoadingIndicator`.
    *   Implementamos animação "bouncy" (pulinhos) com `PullToRefreshState` custom usando `spring(Spring.DampingRatioHighBouncy)`.
    *   Integramos na `HistoricoComprasTela` cobrindo:
        - Lista com compras
        - Estado vazio (sem compras)
    *   Atualizamos `HistoricoComprasViewModel` com `isRefreshing` para controlar feedback visual durante atualização.

### Ciclo 8 - Funcionalidade de Reembolso ✅

29. **Refund (reembolso):**
    *   Endpoint **POST** `/reembolsar/:paymentIntentId` (ou charge).
    *   Atualizado status da compra para “REEMBOLSADA” e “REEMBOLSO_PARCIAL” (novo status), mas somente para cartão, não funcionou para boleto.

## 🍎 Roadmap iOS (quando houver Mac)

Futuros passos, focará em **implementações, melhorias e novas funcionalidades**:

### 1. Implementação iOS (Opcional/Futuro)
- Implementar `ControladorStripe.ios.kt` com Stripe iOS SDK
- Testar em simulador iOS (requer macOS)

## 🔗 Repositórios Relacionados

| Repositório | Descrição | URL |
|-------------|-----------|-----|
| **App (KMP)** | Aplicativo Compose Multiplatform | (este repositório) |
| **Backend** | Servidor Ktor no Render | [stripe-backend-ktor-server](https://github.com/seu-usuario/stripe-backend-ktor-server) |

## 🧪 Cartões de Teste da Stripe

| Número do Cartão      | Cenário                      | Bandeira | cred/deb/pre-pago |
|-----------------------|------------------------------| ---------|-------------------| 
| `4242 4242 4242 4242` | ✅ Sucesso                    | Visa | crédito           |
| `4000 0566 5566 5556` | ✅ Sucesso                    | Visa | débito            |
| `4000 0000 0000 9995` | ❌ Cartão recusado            | Visa | crédito           |
| `4000 0025 0000 3155` | 🔐 Requer 3D Secure          | Visa | crédito           |
| `4000 0000 0000 0002` | ❌ Cartão recusado (genérico) | Visa | crédito           |
| `5555 5555 5555 4444` | ✅ Sucesso | Mastercard | crédito           |
| `5200 8282 8282 8210` | ✅ Sucesso | Mastercard | débito           |
| `5105 1051 0510 5100` | ✅ Sucesso | Mastercard | pre-pago           |

> Use qualquer data futura (ex: 12/34) e qualquer CVC (ex: 123)

## 🧪 Boleto de Teste da Stripe

| CPF/CNPJ              | Cenário      | Bandeira   | Endereço    | Cidade     | Estado | CEP         |
|-----------------------|--------------|------------|-------------|------------|-------|-------------|
| `111.444.777-35`      | ✅ Sucesso    | CPF        | Rua C 262   | Goiânia    | GO  | `74000-000` |
| `11.222.333/0001-81`  | ✅ Sucesso    | CNPJ       | Praça da Sé | São Paulo  | SP  | `01001-000` |

> Use qualquer nome completo e qualquer e-mail (ex: pessoal ou corporativo)

## 🚀 Build e Execução

### Android

Para compilar e executar a versão de desenvolvimento do aplicativo Android:

- No Windows:
  ```shell
  .\gradlew.bat :composeApp:assembleDebug
- No macOS/Linux:
  ```shell
  ./gradlew :composeApp:assembleDebug
  ```

### iOS

O alvo (target) para iOS está configurado no `build.gradle.kts`, mas está comentado para permitir o desenvolvimento em máquinas que não são macOS. Para compilar para iOS, é necessário um ambiente macOS com Xcode instalado.