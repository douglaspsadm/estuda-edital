// ============================================================================
// BASE DE DADOS DO EDITAL Nº 1 - DPDF, DE 26 DE OUTUBRO DE 2026
// Cargo 4: Analista de Apoio à Assistência Judiciária - Informática: Desenvolvimento de Sistemas
// Banca: Instituto ACCESS
// ============================================================================

window.EDITAL_DATA = {
  metadata: {
    concurso: "Defensoria Pública do Distrito Federal (DPDF)",
    edital: "Edital Nº 1 - DPDF, de 26 de outubro de 2026",
    banca: "Instituto ACCESS",
    cargo: "Cargo 4: Analista de Apoio à Assistência Judiciária — Especialidade: Informática — Área de Atuação: Desenvolvimento de Sistemas",
    remuneracao: {
      vencimentoBasico: 8731.96,
      gratificacaoJudiciaria: 600.00,
      gadp: 2182.99,
      remuneracaoBrutaEdital: 11514.95,
      auxilioAlimentacao: 1701.41,
      totalMensal: 13216.36,
      cargaHorariaSemanal: 35
    },
    vagas: {
      imediataAC: 1,
      cadastroReservaTotal: 50,
      crAC: 24,
      crPcD: 11,
      crNPP: 10,
      crHipo: 5,
      redacoesCorrigidasTotal: 85,
      redacoesAC: 42,
      redacoesPcD: 17,
      redacoesNPP: 17,
      redacoesHipo: 9
    },
    provas: {
      dataProva: "2027-02-21",
      inscricoesInicio: "2026-12-03",
      inscricoesFim: "2027-01-07",
      taxaInscricao: 110.00,
      objetiva: {
        turno: "Manhã",
        duracaoHoras: 4.5,
        tipo: "Múltipla Escolha (5 alternativas: A, B, C, D, E)",
        totalQuestoes: 70,
        totalPontos: 119.0,
        corteMinimoGeral: 59.5,
        corteMinimoBasicos: 10.5,
        corteMinimoEspecificos: 49.0,
        regraPortugues: "Não pode zerar Língua Portuguesa"
      },
      discursiva: {
        turno: "Tarde",
        duracaoHoras: 3.0,
        totalPontos: 50.0,
        dissertacao: {
          tema: "Tema da Atualidade",
          maxLinhas: 30,
          valorMaximo: 20.0,
          notaMinima: 10.0,
          formula: "ND = NC - (4 × NE ÷ TL)"
        },
        questoesTecnicas: {
          quantidade: 3,
          tema: "Conhecimentos Específicos de Desenvolvimento de Sistemas",
          maxLinhasPorQuestao: 20,
          valorPorQuestao: 10.0,
          valorTotal: 30.0,
          notaMinimaSoma: 15.0,
          formula: "NQi = NCi - (2 × NEi ÷ TLi)"
        }
      },
      titulos: {
        valorMaximo: 6.0,
        doutorado: 1.5,
        mestrado: 1.0,
        especializacao: 1.0,
        aprovacaoConcurso: 0.5,
        experienciaProfissional: 2.0
      }
    }
  },

  cronograma: [
    { ordem: 1, evento: "Publicação do Edital de Abertura", data: "26/10/2026" },
    { ordem: 2, evento: "Período de impugnação ao Edital", data: "27/10 a 04/11/2026" },
    { ordem: 4, evento: "Solicitação de isenção da taxa de inscrição", data: "10 a 12/11/2026" },
    { ordem: 8, evento: "Período de inscrições (www.access.org.br) + Upload Nada-Consta Criminal e Foto", data: "03/12/2026 a 07/01/2027" },
    { ordem: 9, evento: "Último dia para pagamento da taxa (R$ 110,00)", data: "08/01/2027" },
    { ordem: 14, evento: "Divulgação dos locais de prova (Cartão de Confirmação)", data: "15/02/2027" },
    { ordem: 15, evento: "REALIZAÇÃO DAS PROVAS OBJETIVA E DISCURSIVA", data: "21/02/2027", destaque: true },
    { ordem: 16, evento: "Gabaritos preliminares e Padrão de respostas preliminar", data: "22/02/2027" },
    { ordem: 19, evento: "Gabaritos definitivos e resultado preliminar da objetiva", data: "23/03/2027" },
    { ordem: 27, evento: "Resultado preliminar da prova discursiva", data: "05/05/2027" },
    { ordem: 30, evento: "Envio de títulos", data: "01 a 04/06/2027" },
    { ordem: 36, evento: "Resultado definitivo do Concurso Público", data: "23/07/2027" }
  ],

  disciplinas: [
    // ========================================================================
    // CONHECIMENTOS BÁSICOS (21 Questões | Peso 1 | 21,0 Pontos)
    // ========================================================================
    {
      id: "bas_port",
      codigo: "BAS-01",
      nome: "Língua Portuguesa",
      categoria: "basicos",
      questoesProva: 5,
      peso: 1,
      pontosProva: 5.0,
      prioridade: "Alta (Proibido Zerar!)",
      cor: "#3b82f6",
      icone: "book-open",
      descricao: "Compreensão textual, coesão, morfossintaxe, pontuação, concordância, regência, crase, colocação pronominal e reescrita de períodos.",
      topicos: [
        {
          id: "bas_port_1",
          numero: "1 e 2",
          titulo: "Compreensão, Interpretação e Tipologia/Gêneros Textuais",
          subitens: "1 Compreensão e interpretação de textos de gêneros variados. 2 Reconhecimento de tipos e gêneros textuais.",
          resumoChave: "Distinção entre inferência (dedução autorizada pelo texto) e extrapolação (ir além do texto). Tipos textuais (narrativo, descritivo, dissertativo-argumentativo, expositivo, injuntivo) vs. Gêneros textuais (editorial, notícia, crônica, ofício)."
        },
        {
          id: "bas_port_2",
          numero: "3 e 4",
          titulo: "Ortografia Oficial, Coesão Textual, Conectores e Tempos Verbais",
          subitens: "3 Domínio da ortografia oficial. 4 Domínio dos mecanismos de coesão textual. 4.1 Referenciação, substituição, repetição e conectores. 4.2 Tempos e modos verbais.",
          resumoChave: "Coesão anafórica (retoma termo anterior) vs. catafórica (antecipa termo posterior). Valor semântico das conjunções coordenativas e subordinativas (concessivas vs. adversativas vs. causais vs. consecutivas)."
        },
        {
          id: "bas_port_3",
          numero: "5.1 a 5.4",
          titulo: "Morfossintaxe, Coordenação, Subordinação e Pontuação",
          subitens: "5 Estrutura morfossintática do período. 5.1 Classes de palavras. 5.2 Coordenação. 5.3 Subordinação. 5.4 Emprego dos sinais de pontuação.",
          resumoChave: "Funções do 'QUE' e do 'SE' (partícula apassivadora vs. índice de indeterminação do sujeito). Vírgula obrigatória em orações adverbiais deslocadas e distinção entre orações adjetivas restritivas (sem vírgula) e explicativas (com vírgula)."
        },
        {
          id: "bas_port_4",
          numero: "5.5 a 5.8 e 6",
          titulo: "Concordância, Regência, Crase, Próclise/Ênclise e Reescrita",
          subitens: "5.5 Concordância verbal e nominal. 5.6 Regência verbal e nominal. 5.7 Crase. 5.8 Colocação dos pronomes átonos. 6 Reescrita de frases e parágrafos.",
          resumoChave: "Verbos impessoais (Haver no sentido de existir e Fazer indicando tempo decorrido ficam no singular). Regência de assistir, aspirar, visar, implicar, preferir. Crase proibida antes de verbo, masculino e pronomes em geral; facultativa em 'até a', nomes próprios femininos e pronomes possessivos femininos."
        }
      ]
    },
    {
      id: "bas_lodf",
      codigo: "BAS-02",
      nome: "Lei Orgânica do DF (LODF) e LC Distrital nº 828/2010 (DPDF)",
      categoria: "basicos",
      questoesProva: 4,
      peso: 1,
      pontosProva: 4.0,
      prioridade: "Alta (Custo-Benefício Excelente)",
      cor: "#10b981",
      icone: "scale",
      descricao: "Organização do DF e dos Poderes, Administração Pública, arts. 114 a 116 da LODF e Lei Orgânica da DPDF (LC 828/2010 e alterações).",
      topicos: [
        {
          id: "bas_lodf_1",
          numero: "1.1 a 1.4",
          titulo: "Lei Orgânica do DF (LODF): Organização, Poderes e Defensoria (Arts. 114-116)",
          subitens: "1 LODF. 1.1 Organização do DF. 1.2 Organização dos poderes. 1.3 Administração pública. 1.4 Das funções essenciais à justiça: arts. 114 a 116 da LODF (Da Defensoria Pública).",
          resumoChave: "Fundamentos do DF, soberania popular, Regiões Administrativas (criação/extinção por lei aprovada pela maioria absoluta dos deputados distritais). Arts. 114-116 da LODF (Emenda 61/2012): DPDF como instituição permanente e essencial, autonomia funcional, administrativa e iniciativa de sua proposta orçamentária."
        },
        {
          id: "bas_lodf_2",
          numero: "2.1 a 2.3",
          titulo: "LC Distrital nº 828/2010: Princípios, Funções, Estrutura da DPDF e Assistidos",
          subitens: "2 LC Distrital nº 828/2010 e alterações (LC 908/2016). 2.1 Princípios institucionais e funções da DPDF. 2.2 Estrutura orgânica. 2.3 Assistência jurídica integral e gratuita: destinatários, direitos dos assistidos e hipóteses de atuação.",
          resumoChave: "Princípios: unidade, indivisibilidade e independência funcional. Estrutura: Administração Superior (Defensoria Pública-Geral, Subdefensoria, Conselho Superior, Corregedoria-Geral), Atuação (Núcleos de Assistência Jurídica - NAJs), Execução (Defensores) e Apoio/Órgãos Auxiliares (Ouvidoria-Geral, EASJUR). Prerrogativas: intimação pessoal com vista dos autos e prazo em dobro."
        }
      ]
    },
    {
      id: "bas_lc840",
      codigo: "BAS-03",
      nome: "Regime Jurídico dos Servidores do DF (LC nº 840/2011)",
      categoria: "basicos",
      questoesProva: 3,
      peso: 1,
      pontosProva: 3.0,
      prioridade: "Média-Alta",
      cor: "#f59e0b",
      icone: "briefcase",
      descricao: "Lei Complementar Distrital nº 840/2011: provimento, vacância, direitos, vantagens, deveres, infrações e regime disciplinar.",
      topicos: [
        {
          id: "bas_lc840_1",
          numero: "1.1 e 1.2",
          titulo: "Carreiras, Provimento, Posse, Exercício, Jornada e Direitos (LC 840/2011)",
          subitens: "1 LC nº 840/2011. 1.1 Carreiras, regime e jornada de trabalho. 1.2 Direitos.",
          resumoChave: "Formas de provimento: nomeação, reversão, aproveitamento, reintegração, recondução. Prazos fatais: Posse em até 30 dias da publicação da nomeação; Exercício em até 5 dias úteis da posse. Estágio probatório e estabilidade: 3 anos. Reserva de 20% das vagas para PcD na LC 840."
        },
        {
          id: "bas_lc840_2",
          numero: "1.3 e 1.4",
          titulo: "Deveres, Infrações Leves/Médias/Graves, Sanções e PAD (LC 840/2011)",
          subitens: "1.3 Deveres. 1.4 Regime disciplinar.",
          resumoChave: "Classificação inovadora da LC 840: infrações leves, médias (Grupo I e II) e graves (Grupo I e II). Penalidades: advertência, suspensão (até 90 dias), demissão, cassação de aposentadoria, destituição de cargo em comissão. Abandono de cargo (>30 dias consecutivos) vs. Inassiduidade habitual (60 dias interpolados em 12 meses). Prazos de prescrição: 5 anos (demissão), 2 anos (suspensão), 1 ano (advertência)."
        }
      ]
    },
    {
      id: "bas_df_mulher",
      codigo: "BAS-04",
      nome: "Conhecimentos sobre o DF, RIDE e Política para Mulheres (Lei 7.462/2024)",
      categoria: "basicos",
      questoesProva: 2,
      peso: 1,
      pontosProva: 2.0,
      prioridade: "Média",
      cor: "#ec4899",
      icone: "globe",
      descricao: "Realidade do DF e RIDE (LC 94/1998 e Decreto 7.469/2011), Plano Distrital de Política para Mulheres e Lei Distrital nº 7.462/2024.",
      topicos: [
        {
          id: "bas_df_1",
          numero: "1",
          titulo: "Realidade Histórica, Geográfica, Econômica do DF e RIDE (LC 94/1998)",
          subitens: "1 Domínio de tópicos atuais e relevantes acerca da realidade étnica, social, histórica, geográfica, cultural, política e econômica do DF e da RIDE (LC Federal nº 94/1998 e Decreto Federal nº 7.469/2011).",
          resumoChave: "História de Brasília (JK, Lúcio Costa, Oscar Niemeyer, Patrimônio Cultural da Humanidade UNESCO 1987). Geografia: Planalto Central, bioma Cerrado, bacias hidrográficas (Paranoá, São Bartolomeu, Preto, Descoberto, Maranhão). RIDE-DF (LC 94/1998 alterada pela LC 163/2018): DF + 29 municípios de GO + 4 municípios de MG (Unaí, Buritis, Arinos, Cabeceira Grande) = 33 municípios + DF."
        },
        {
          id: "bas_df_2",
          numero: "2 e 3",
          titulo: "Plano Distrital de Política para Mulheres e Lei Distrital nº 7.462/2024",
          subitens: "2 Plano Distrital de Política para Mulheres. 3 Lei Distrital nº 7.462/2024: políticas de proteção à mulher e de igualdade de gênero no âmbito da administração pública do DF.",
          resumoChave: "Lei Distrital nº 7.462/2024: cursos obrigatórios nas escolas de governo sobre violência de gênero (atualização anual, oferta semestral), programas sigilosos de apoio psicológico a servidoras vítimas e seus filhos, exigência de certidão de nada-consta de violência doméstica em concursos do DF (com ressalva do STF RE 1.563.184/DF e decurso de 5 anos após extinção da pena)."
        }
      ]
    },
    {
      id: "bas_maria_penha",
      codigo: "BAS-05",
      nome: "Lei Maria da Penha (Lei Federal nº 11.340/2006)",
      categoria: "basicos",
      questoesProva: 3,
      peso: 1,
      pontosProva: 3.0,
      prioridade: "Alta (3 questões em lei curta!)",
      cor: "#a855f7",
      icone: "shield-alert",
      descricao: "Conceito e formas de violência doméstica, atendimento policial, medidas protetivas de urgência e atuação da Defensoria Pública.",
      topicos: [
        {
          id: "bas_mp_1",
          numero: "1.1 a 1.3",
          titulo: "Conceito, Âmbito (Unidade Doméstica/Familiar/Afetiva) e 5 Formas de Violência",
          subitens: "1 Lei nº 11.340/2006. 1.1 Disposições preliminares; conceito e formas de violência doméstica e familiar contra a mulher. 1.2 Assistência. 1.3 Atendimento pela autoridade policial.",
          resumoChave: "As 5 formas de violência (Art. 7º): Física, Psicológica, Sexual, Patrimonial e Moral (mnemônico: F-P-S-P-M). Independe de orientação sexual. Afastamento imediato do agressor do lar: em regra pelo Juiz; pelo Delegado (se o Município não for sede de comarca); pelo Policial (se não for sede de comarca e não houver delegado no momento, comunicando o juiz em 24h). Vedada entrega de intimação pela mulher ao agressor."
        },
        {
          id: "bas_mp_2",
          numero: "1.4 a 1.7",
          titulo: "Medidas Protetivas de Urgência, Atuação da Defensoria e Disposições Finais",
          subitens: "1.4 Medidas protetivas de urgência. 1.5 Atuação do Ministério Público e da Defensoria Pública; assistência judiciária. 1.6 Equipe multidisciplinar. 1.7 Disposições finais.",
          resumoChave: "Prazo de 48h para a polícia remeter expediente ao juiz e 48h para o juiz decidir sobre medidas protetivas. É VEDADA a aplicação da Lei 9.099/1995 (Juizados Especiais / cestas básicas / multas isoladas) aos crimes praticados com violência doméstica contra a mulher (Art. 41 e Art. 17). A mulher deve estar acompanhada de advogado ou Defensor Público em todos os atos processuais (Art. 27); renúncia à representação (quando cabível) só perante o Juiz em audiência especial antes do recebimento da denúncia (Art. 16). Súmula 542 STJ: lesão corporal doméstica é ação pública incondicionada."
        }
      ]
    },
    {
      id: "bas_info",
      codigo: "BAS-06",
      nome: "Noções de Informática",
      categoria: "basicos",
      questoesProva: 2,
      peso: 1,
      pontosProva: 2.0,
      prioridade: "Média (Pontos Garantidos para TI)",
      cor: "#06b6d4",
      icone: "monitor",
      descricao: "Sistemas operacionais, suítes de escritório, navegadores, segurança básica, SEI/assinatura eletrônica e noções da LGPD.",
      topicos: [
        {
          id: "bas_info_1",
          numero: "1 a 7",
          titulo: "Windows/Linux, Office/LibreOffice, Segurança, Processo Eletrônico e LGPD",
          subitens: "1 Sistemas operacionais. 2 Edição de textos, planilhas e apresentações. 3 Navegadores e e-mail. 4 Arquivos. 5 Cópias de segurança, códigos maliciosos e phishing. 6 Processo administrativo eletrônico (SEI) e assinatura eletrônica (Lei 14.063/2020). 7 LGPD (Lei 13.709/2018).",
          resumoChave: "Funções de planilha (PROCV/PROCX, SE, CONT.SE, SOMASE). Assinaturas eletrônicas na Lei 14.063/2020: Simples, Avançada e Qualificada (usa certificado ICP-Brasil). Níveis de acesso de processos no SEI-GDF: Público, Restrito e Sigiloso."
        }
      ]
    },
    {
      id: "bas_socorros",
      codigo: "BAS-07",
      nome: "Noções de Primeiros Socorros",
      categoria: "basicos",
      questoesProva: 2,
      peso: 1,
      pontosProva: 2.0,
      prioridade: "Média (Estudo Rápido e Objetivo)",
      cor: "#ef4444",
      icone: "heart-pulse",
      descricao: "Avaliação da cena e vítima, Suporte Básico de Vida (SBV/RCP), engasgo (Heimlich), hemorragias, queimaduras, fraturas e convulsões.",
      topicos: [
        {
          id: "bas_soc_1",
          numero: "1 a 5",
          titulo: "Protocolo XABCDE, RCP/DEA, Manobra de Heimlich e Atendimento a Emergências",
          subitens: "1 Princípios básicos e procedimentos iniciais. 2 Avaliação e segurança da vítima. 3 Suporte básico de vida. 4 Desmaios, engasgos, hemorragias, ferimentos, queimaduras, fraturas, convulsões, intoxicações e acidentes. 5 Acionamento de emergência (192 SAMU / 193 Bombeiros).",
          resumoChave: "Regra nº 1: Segurança da cena em primeiro lugar. RCP em adultos (AHA): 100 a 120 compressões/minuto, profundidade de 5 a 6 cm, proporção 30 compressões : 2 ventilações. Engasgo (OVACE) grave em adulto consciente: Manobra de Heimlich (compressões abdominais em J para dentro e para cima); em gestantes/obesos: compressões torácicas; em lactentes (<1 ano): 5 golpes nas costas + 5 compressões torácicas. Convulsão: proteger a cabeça, lateralizar, NUNCA colocar nada na boca ou segurar a língua. Queimaduras: resfriar com água corrente em temperatura ambiente (nunca usar gelo, pasta de dente ou manteiga)."
        }
      ]
    },

    // ========================================================================
    // CONHECIMENTOS ESPECÍFICOS — DESENVOLVIMENTO DE SISTEMAS (49 Questões | Peso 2 | 98,0 Pontos)
    // ========================================================================
    {
      id: "esp_1",
      codigo: "ESP-01",
      nome: "Engenharia de Software e Engenharia de Requisitos",
      categoria: "especificos",
      questoesProva: 6,
      peso: 2,
      pontosProva: 12.0,
      prioridade: "Altíssima (12 Pontos!)",
      cor: "#6366f1",
      icone: "layers",
      descricao: "Ciclo de vida, requisitos, casos de uso, User Stories, POO, UML, SOLID, Design Patterns (GoF), Scrum, Kanban e documentação.",
      topicos: [
        {
          id: "esp_1_1",
          numero: "1, 1.1 e 1.2",
          titulo: "Ciclos de Vida, Engenharia de Requisitos, Casos de Uso e Histórias de Usuário",
          subitens: "1 Conceitos, princípios, ciclo de vida e processos. 1.1 Levantamento, análise, especificação, validação e gerenciamento de requisitos funcionais e não funcionais. 1.2 Casos de uso, histórias de usuário, critérios de aceitação, rastreabilidade e prototipação.",
          resumoChave: "Modelos de processo: Cascata, Incremental, Espiral (Boehm — focado em análise de riscos!), RUP (4 fases: Concepção, Elaboração, Construção, Transição). Requisitos Funcionais (o que o sistema faz) vs. Não Funcionais (desempenho, segurança, usabilidade). Casos de Uso UML: <<include>> (obrigatório, seta tracejada aponta para o caso incluído) vs. <<extend>> (opcional/condicional, seta tracejada aponta para o caso base!). User Stories: critério INVEST e estrutura Dado-Quando-Então (Given-When-Then) para critérios de aceitação."
        },
        {
          id: "esp_1_2",
          numero: "1.3, 1.4 e 1.5",
          titulo: "Análise OO, UML 2.5, Princípios SOLID e Padrões de Projeto (GoF)",
          subitens: "1.3 Análise e projeto orientados a objetos. 1.4 UML e principais diagramas. 1.5 Princípios SOLID e padrões de projeto (design patterns).",
          resumoChave: "Diagramas UML Estruturais (Classes, Componentes, Implantação, Objetos, Pacotes, Estrutura Composta, Perfil) vs. Comportamentais (Casos de Uso, Sequência, Atividades, Máquina de Estados, Comunicação, Tempo, Interação). SOLID: SRP, OCP, LSP, ISP, DIP. Padrões GoF: Criacionais (Singleton, Factory Method, Abstract Factory, Builder, Prototype), Estruturais (Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy), Comportamentais (Strategy, Observer, Command, Iterator, State, Template Method, Chain of Responsibility, Mediator, Memento, Visitor, Interpreter)."
        },
        {
          id: "esp_1_3",
          numero: "1.6 e 1.7",
          titulo: "Métodos Ágeis (Scrum Guide 2020 e Kanban) e Documentação de Software",
          subitens: "1.6 Métodos ágeis: Scrum e Kanban. 1.7 Documentação técnica, funcional e de usuários.",
          resumoChave: "Scrum Guide 2020: 3 Pilares (Transparência, Inspeção, Adaptação); 3 Responsabilidades na Scrum Team (Product Owner, Scrum Master, Developers — até 10 pessoas no total, sem subtimes ou hierarquia); 5 Eventos com timebox para Sprint de 1 mês (Sprint <= 1 mês, Sprint Planning 8h, Daily Scrum 15min, Sprint Review 4h, Sprint Retrospective 3h); 3 Artefatos e seus Compromissos (Product Backlog -> Meta do Produto; Sprint Backlog -> Meta da Sprint; Increment -> Definição de Pronto / DoD). Kanban: visualizar fluxo, limitar WIP (Work in Progress), gerenciar fluxo (Lead Time vs Cycle Time), políticas explícitas."
        }
      ]
    },
    {
      id: "esp_2",
      codigo: "ESP-02",
      nome: "Desenvolvimento de Sistemas",
      categoria: "especificos",
      questoesProva: 8,
      peso: 2,
      pontosProva: 16.0,
      prioridade: "Máxima (Maior Peso da Prova: 16 Pontos!)",
      cor: "#2563eb",
      icone: "code-2",
      descricao: "POO, Plataforma Java (Java SE LTS, Jakarta EE, JPA/Hibernate, JDBC, Spring/Spring Boot), Web (HTML5, CSS3, JS/TS, SPA, UX/UI, Acessibilidade), APIs RESTful, Mensageria e Manutenção.",
      topicos: [
        {
          id: "esp_2_1",
          numero: "1 e 2",
          titulo: "POO e Ecossistema Java (Java SE LTS 11/17/21, Jakarta EE, JPA/Hibernate, Spring Boot)",
          subitens: "1 Fundamentos de programação e orientação a objetos. 2 Plataforma Java: Java SE em versões LTS suportadas, Jakarta EE, JPA, Hibernate, JDBC, Spring Framework e Spring Boot.",
          resumoChave: "Pilares POO: Abstração, Encapsulamento, Herança, Polimorfismo (Sobrecarga/Overload em tempo de compilação vs. Sobrescrita/Override em tempo de execução). Novidades Java LTS: Streams API, Optional, Records (Java 16/17), Sealed Classes (Java 17), Pattern Matching e Virtual Threads - Project Loom (Java 21). JPA/Hibernate: ciclo de vida da entidade (Transient, Managed, Detached, Removed), FetchType.LAZY (padrão para @OneToMany e @ManyToMany) vs. FetchType.EAGER (padrão para @ManyToOne e @OneToOne), problema da consulta N+1 (resolvido com JOIN FETCH ou @EntityGraph). Spring Boot: IoC/DI, @Component/@Service/@Repository/@Controller/@RestController, escopos de Bean (Singleton é padrão!), @Transactional."
        },
        {
          id: "esp_2_2",
          numero: "3",
          titulo: "Desenvolvimento Web: HTML5, CSS3, JavaScript, TypeScript, SPA, UX/UI e Acessibilidade",
          subitens: "3 Desenvolvimento web: HTML5, CSS3, JavaScript, TypeScript, aplicações SPA, desenvolvimento responsivo, noções de UX e UI, usabilidade, acessibilidade e prototipação de interfaces.",
          resumoChave: "HTML5 semântico (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>) e Web Storage (localStorage vs sessionStorage). CSS3: Flexbox (unidimensional) vs Grid (bidimensional), Media Queries, Box Model (box-sizing: border-box). JS/TS: Event Loop, Promises, async/await, closures, tipagem estática no TypeScript (interfaces, generics, union types). Usabilidade (10 Heurísticas de Nielsen) e Acessibilidade Web (WCAG 2.1/2.2 — 4 princípios POUR: Perceptível, Operável, Compreensível, Robusto; atributos WAI-ARIA)."
        },
        {
          id: "esp_2_3",
          numero: "4, 5 e 6",
          titulo: "APIs RESTful, OAuth2/JWT, Mensageria e Manutenção/Refatoração de Sistemas",
          subitens: "4 Desenvolvimento e integração de APIs e serviços: HTTP/HTTPS, REST, APIs RESTful, JSON, XML, autenticação, autorização, versionamento e documentação de APIs. 5 Integração: serviços web, mensageria e comunicação síncrona e assíncrona. 6 Manutenção e evolução: corretiva, adaptativa, perfectiva e preventiva, refatoração.",
          resumoChave: "Métodos HTTP e Idempotência: GET, HEAD, OPTIONS, PUT e DELETE são idempotentes (GET, HEAD, OPTIONS são também seguros/safe); POST não é idempotente nem seguro; PATCH modifica parcialmente. Modelo de Maturidade de Richardson: Nível 0 (POX), Nível 1 (Recursos/URIs), Nível 2 (Verbos HTTP + Status Codes), Nível 3 (HATEOAS). Mensageria: Filas (Point-to-Point) vs. Tópicos (Publish/Subscribe), RabbitMQ (AMQP, exchanges Direct/Fanout/Topic/Headers) vs. Apache Kafka (Event Streaming, partições, consumer groups). Manutenção (ISO/IEC 14764): Corretiva (corrige defeito ocorrido), Adaptativa (adapta a novo SO/lei/ambiente), Perfectiva (melhora desempenho/novas features para usuário), Preventiva (refatoração preventiva para evitar falhas futuras)."
        }
      ]
    },
    {
      id: "esp_3",
      codigo: "ESP-03",
      nome: "Arquitetura de Software",
      categoria: "especificos",
      questoesProva: 5,
      peso: 2,
      pontosProva: 10.0,
      prioridade: "Alta (10 Pontos)",
      cor: "#7c3aed",
      icone: "cpu",
      descricao: "Estilos arquiteturais (Camadas, MVC, SOA, Microsserviços, EDA), Proxy Reverso/Load Balancer, Coesão/Acoplamento, Cloud (IaaS/PaaS/SaaS), Docker e Kubernetes.",
      topicos: [
        {
          id: "esp_3_1",
          numero: "1, 2, 3 e 4",
          titulo: "Estilos Arquiteturais (MVC, SOA, Microsserviços, EDA), Proxy Reverso e Princípios",
          subitens: "1 Arquiteturas cliente-servidor, em camadas, MVC, SOA, microsserviços e orientada a eventos. 2 Servidores web/aplicação, proxy reverso e balanceamento de carga. 3 Integração, APIs e mensageria. 4 Coesão, acoplamento, escalabilidade, resiliência e tolerância a falhas.",
          resumoChave: "Alta Coesão (módulo focado em uma única responsabilidade) e Baixo Acoplamento (baixa dependência entre módulos). Proxy Direto (Forward Proxy — protege/representa o cliente) vs. Proxy Reverso (Nginx/HAProxy — protege/representa os servidores de backend, faz terminação SSL, cache e Load Balancing). Microsserviços: Database per Service, API Gateway, Circuit Breaker (fechado = normal; aberto = falha rápida sem chamar serviço fora; meio-aberto = teste de recuperação), Padrão Saga (Coreografia via eventos vs. Orquestração via orquestrador central) para transações distribuídas (em vez de 2PC bloqueante)."
        },
        {
          id: "esp_3_2",
          numero: "5, 6 e 7",
          titulo: "Tuning de Aplicações, Computação em Nuvem (IaaS, PaaS, SaaS), Docker e Kubernetes",
          subitens: "5 Monitoramento e tuning. 6 Computação em nuvem: IaaS, PaaS e SaaS. 7 Contêineres e orquestração: Docker e conceitos de Kubernetes.",
          resumoChave: "Cloud (NIST SP 800-145): IaaS (EC2, VPC — usuário gerencia do SO para cima), PaaS (RDS, Elastic Beanstalk, App Engine — usuário gerencia apenas aplicação e dados), SaaS (Google Workspace, M365 — usuário apenas consome). Docker: Dockerfile vs. Imagem (imutável, em camadas) vs. Contêiner (instância em execução com camada R/W), Volumes (persistência). Kubernetes (K8s): Pod (menor unidade implantável, 1+ contêineres compartilhando IP e armazenamento), Deployment (gerencia ReplicaSets e rolling updates), Service (ClusterIP, NodePort, LoadBalancer), ConfigMap e Secret, Ingress."
        }
      ]
    },
    {
      id: "esp_4",
      codigo: "ESP-04",
      nome: "Banco de Dados e Gestão de Dados",
      categoria: "especificos",
      questoesProva: 4,
      peso: 2,
      pontosProva: 8.0,
      prioridade: "Alta (8 Pontos)",
      cor: "#059669",
      icone: "database",
      descricao: "Modelagem (MER, Relacional), Normalização (1FN a BCNF), SQL completo (DDL, DML, DCL, TCL, Joins, Triggers), ACID, Índices, NoSQL e Governança de Dados.",
      topicos: [
        {
          id: "esp_4_1",
          numero: "1 e 2",
          titulo: "Modelagem (Conceitual, Lógica, Física), Normalização e SQL (DDL, DML, DCL, TCL)",
          subitens: "1 Modelagem conceitual, lógica e física. MER, modelo relacional, normalização e integridade. 2 SQL: DDL, DML, DCL e TCL; consultas, junções, subconsultas, funções, visões, stored procedures e triggers.",
          resumoChave: "Modelagem: Conceitual (MER/DER — independente de SGBD), Lógica (Relacional — tabelas, PK, FK), Física (scripts SQL específicos do SGBD, índices, tablespaces). Normalização: 1FN (atributos atômicos, sem grupos repetitivos), 2FN (1FN + sem dependência funcional parcial da chave primária composta), 3FN (2FN + sem dependência funcional transitiva de atributos não-chave), BCNF. Subconjuntos SQL: DDL (CREATE, ALTER, DROP, TRUNCATE), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE), TCL (COMMIT, ROLLBACK, SAVEPOINT). Atenção: WHERE filtra linhas antes do GROUP BY; HAVING filtra grupos após o GROUP BY."
        },
        {
          id: "esp_4_2",
          numero: "3, 4, 5 e 6",
          titulo: "Transações ACID, Isolamento, Índices, ORM, NoSQL e Governança de Dados (DAMA-DMBOK)",
          subitens: "3 Transações, concorrência, índices e otimização. 4 Persistência: JDBC, ORM, JPA, Hibernate. 5 Noções de NoSQL. 6 Gestão de dados: modelo corporativo, governança, qualidade, metadados, catálogo e dicionário de dados.",
          resumoChave: "ACID: Atomicidade (tudo ou nada), Consistência (regras/constraints preservadas), Isolamento (transações concorrentes não interferem), Durabilidade (efeito persiste após commit). Fenômenos de leitura: Dirty Read, Non-Repeatable Read, Phantom Read. Níveis de isolamento SQL: Read Uncommitted, Read Committed, Repeatable Read, Serializable. NoSQL (Teorema CAP: Consistência, Disponibilidade, Tolerância a Partição): Documentos (MongoDB), Chave-Valor (Redis), Colunar (Cassandra), Grafos (Neo4j). Dicionário de Dados (metadados técnicos de tabelas/colunas de um banco) vs. Catálogo de Dados (inventário corporativo amplo com contexto de negócio, linhagem e descoberta)."
        }
      ]
    },
    {
      id: "esp_5",
      codigo: "ESP-05",
      nome: "Qualidade e Testes de Software",
      categoria: "especificos",
      questoesProva: 4,
      peso: 2,
      pontosProva: 8.0,
      prioridade: "Alta (8 Pontos)",
      cor: "#0d9488",
      icone: "check-circle-2",
      descricao: "Clean Code, Refatoração, Dívida Técnica, SonarQube, Níveis e Tipos de Teste, Pirâmide de Testes, TDD/BDD, JUnit e Cobertura.",
      topicos: [
        {
          id: "esp_5_1",
          numero: "1, 2, 3, 4 e 5",
          titulo: "Clean Code, SonarQube, Tipos de Teste, Automação com JUnit 5 e Cobertura",
          subitens: "1 Métricas, Clean Code, refatoração, dívida técnica, revisão e análise estática. 2 SonarQube. 3 Testes: unitários, integração, funcionais, sistema, regressão, aceitação, desempenho e segurança. 4 Automação, JUnit, testes de APIs e cobertura. 5 Planejamento e documentação de testes.",
          resumoChave: "SonarQube: Bugs (erro no código que gera falha em execução), Vulnerabilidades (ponto fraco de segurança), Security Hotspots (código sensível que requer revisão humana), Code Smells (problema de manutenibilidade / dívida técnica), Quality Gates (condições de aprovação do código no pipeline). Pirâmide de Testes (Mike Cohn): Base = Testes Unitários (rápidos, isolados, muitos); Meio = Testes de Integração/Serviço; Topo = Testes E2E/UI (lentos, caros, poucos). Caixa-Branca (estrutural: cobertura de comandos, ramos/decisões, caminhos; complexidade ciclomática de McCabe V(G) = E - N + 2P ou Predicados + 1) vs. Caixa-Preta (funcional: particionamento de equivalência e análise de valor limite). JUnit 5: @Test, @BeforeEach, @AfterEach, @BeforeAll, @AfterAll, @ParameterizedTest, Mockito (@Mock, @InjectMocks)."
        }
      ]
    },
    {
      id: "esp_6",
      codigo: "ESP-06",
      nome: "DevOps e Entrega de Software",
      categoria: "especificos",
      questoesProva: 5,
      peso: 2,
      pontosProva: 10.0,
      prioridade: "Alta (10 Pontos)",
      cor: "#ea580c",
      icone: "git-branch",
      descricao: "Controle de versão com Git (branching, merging, rebase), CI/CD, Pipelines, DevSecOps e Observabilidade (Logs, Métricas, Traces).",
      topicos: [
        {
          id: "esp_6_1",
          numero: "1, 2, 3, 4 e 5",
          titulo: "Git Avançado, CI/CD, Estratégias de Deploy, DevSecOps e os 3 Pilares da Observabilidade",
          subitens: "1 Controle de versão com Git: repositórios, branching, merging e revisão de código. 2 CI/CD. 3 Pipelines de construção, testes e implantação. 4 DevOps e DevSecOps. 5 Observabilidade: logs, métricas, rastreamento e monitoramento.",
          resumoChave: "Git: git merge (preserva histórico cronológico e cria commit de merge) vs. git rebase (reescreve histórico linearizando commits), git cherry-pick (aplica commit específico), git revert (cria novo commit desfazendo alterações com segurança em branches públicas) vs. git reset (move ponteiro HEAD; --soft mantém staged, --mixed mantém no working dir, --hard apaga alterações). Fluxos: GitFlow (main, develop, feature, release, hotfix) vs. Trunk-Based Development. CI (Integração Contínua) vs. Continuous Delivery (Entrega Contínua — pronto para produção, deploy manual por decisão de negócio) vs. Continuous Deployment (Implantação Contínua — deploy em produção 100% automático). Estratégias de Deploy: Blue-Green (dois ambientes idênticos, chaveamento total de tráfego), Canary (liberação gradual para % pequena de usuários), Rolling Update. 3 Pilares da Observabilidade: Logs (eventos discretos), Métricas (valores numéricos agregáveis no tempo — Prometheus/Grafana) e Rastreamento Distribuído / Traces (jornada da requisição entre microsserviços — OpenTelemetry/Jaeger)."
        }
      ]
    },
    {
      id: "esp_7",
      codigo: "ESP-07",
      nome: "Segurança da Informação e Desenvolvimento Seguro",
      categoria: "especificos",
      questoesProva: 4,
      peso: 2,
      pontosProva: 8.0,
      prioridade: "Alta (8 Pontos)",
      cor: "#dc2626",
      icone: "lock",
      descricao: "CID + Autenticidade, IAM/MFA, Criptografia e PKI, SSDLC, OWASP Top 10 (2021), OWASP ASVS, SAST/DAST/SCA e Gestão de Riscos.",
      topicos: [
        {
          id: "esp_7_1",
          numero: "1, 2 e 3",
          titulo: "Princípios da Segurança (CID), Controle de Acesso, Criptografia, Hash e Certificados Digitais",
          subitens: "1 Confidencialidade, integridade, disponibilidade, autenticidade, ameaças, vulnerabilidades, riscos e controles. 2 Identificação, autenticação, autorização e controle de acesso. 3 Criptografia, certificados digitais e protocolos seguros.",
          resumoChave: "Pilares: Confidencialidade (acesso apenas a autorizados — criptografia), Integridade (não alteração indevida — hash), Disponibilidade (acesso sempre que necessário — redundância/backup), Autenticidade (garantia da origem) e Não-Repúdio/Irretratabilidade (assinatura digital). Criptografia Simétrica (mesma chave: AES, 3DES, ChaCha20 — rápida) vs. Assimétrica (par de chaves pública/privada: RSA, ECC — usada em troca de chaves e assinatura digital). Assinatura Digital: assina com a Chave PRIVADA do remetente e verifica com a Chave PÚBLICA do remetente! Confidencialidade assimétrica: cifra com a Chave PÚBLICA do destinatário e decifra com a Chave PRIVADA do destinatário!"
        },
        {
          id: "esp_7_2",
          numero: "4, 5, 6, 7 e 8",
          titulo: "SSDLC, OWASP Top 10 (2021), OWASP ASVS e Ferramentas SAST, DAST e SCA",
          subitens: "4 SSDLC, validação de entradas, credenciais/segredos, segurança de APIs. 5 Vulnerabilidades web e APIs. 6 OWASP Top 10 e OWASP ASVS. 7 SAST, DAST e SCA. 8 Gestão de segurança, riscos e continuidade.",
          resumoChave: "OWASP Top 10 (2021) — Ordem exata: A01 Broken Access Control (1º lugar!), A02 Cryptographic Failures, A03 Injection (inclui SQLi e XSS!), A04 Insecure Design (Novo!), A05 Security Misconfiguration, A06 Vulnerable and Outdated Components, A07 Identification and Authentication Failures, A08 Software and Data Integrity Failures (Novo!), A09 Security Logging and Monitoring Failures, A10 Server-Side Request Forgery - SSRF (Novo!). OWASP ASVS (Application Security Verification Standard): 3 níveis de verificação de segurança (Nível 1: oportunista/totalmente testável por penetração; Nível 2: padrão para maioria das aplicações com dados sensíveis; Nível 3: crítico/militar/financeiro de alto valor). Testes de Segurança no Pipeline: SAST (Static Application Security Testing — caixa-branca, analisa código-fonte sem executar), DAST (Dynamic Application Security Testing — caixa-preta, testa a aplicação em execução de fora para dentro), SCA (Software Composition Analysis — verifica vulnerabilidades conhecidas/CVEs em bibliotecas e dependências de terceiros)."
        }
      ]
    },
    {
      id: "esp_8",
      codigo: "ESP-08",
      nome: "Documentação, Manutenção e Suporte de Sistemas",
      categoria: "especificos",
      questoesProva: 4,
      peso: 2,
      pontosProva: 8.0,
      prioridade: "Média-Alta (8 Pontos)",
      cor: "#0284c7",
      icone: "file-text",
      descricao: "Documentação técnica e funcional (OpenAPI/Swagger, C4 Model, ADRs), Gestão de artefatos/repositórios, Diagnóstico, Suporte e Pareceres Técnicos.",
      topicos: [
        {
          id: "esp_8_1",
          numero: "1, 2, 3, 4 e 5",
          titulo: "Documentação de Arquitetura e APIs, Repositórios de Artefatos, Suporte e Pareceres Técnicos",
          subitens: "1 Documentação técnica e funcional de sistemas, arquitetura, APIs, implantação, operação e manutenção. 2 Gestão de componentes reutilizáveis, bibliotecas, dependências e repositórios de software. 3 Manutenção, diagnóstico, correção e avaliação de desempenho. 4 Suporte técnico e treinamento. 5 Elaboração de relatórios, pareceres e documentação técnica.",
          resumoChave: "Documentação de APIs: OpenAPI Specification (OAS / Swagger) em YAML/JSON. Documentação de Arquitetura: Modelo C4 (Contexto, Contêineres, Componentes e Código) e ADRs (Architecture Decision Records — registros leves de decisões arquiteturais com contexto, decisão e consequências). Gestão de Dependências e Artefatos: SemVer (Versionamento Semântico MAJOR.MINOR.PATCH: MAJOR = quebra de compatibilidade; MINOR = nova funcionalidade retrocompatível; PATCH = correção de bug retrocompatível), repositórios corporativos (Nexus, JFrog Artifactory, Maven Central). Parecer Técnico na Administração Pública: documento opinativo/fundamentado emitido pelo Analista de TI para subsidiar decisões de gestores ou recebimento de sistemas."
        }
      ]
    },
    {
      id: "esp_9",
      codigo: "ESP-09",
      nome: "Gestão e Governança de Tecnologia da Informação",
      categoria: "especificos",
      questoesProva: 5,
      peso: 2,
      pontosProva: 10.0,
      prioridade: "Alta (10 Pontos)",
      cor: "#d97706",
      icone: "award",
      descricao: "PETI/PDTI, PMBOK 7ª Edição, ITIL 4, COBIT 2019, LAI Federal (12.527/2011), LAI Distrital (4.990/2012) e LGPD (13.709/2018).",
      topicos: [
        {
          id: "esp_9_1",
          numero: "1, 2, 3 e 4",
          titulo: "PETI/PDTI, PMBOK 7ª Edição, ITIL 4 e COBIT 2019",
          subitens: "1 PETI, PDTI e indicadores. 2 PMBOK 7ª edição: princípios, domínios de desempenho e conceitos. 3 ITIL 4: conceitos, princípios orientadores, SVS, incidentes, problemas, mudanças, configuração, disponibilidade, capacidade e continuidade. 4 COBIT 2019: conceitos, princípios, componentes, objetivos de governança e gestão.",
          resumoChave: "PETI (longo prazo, estratégico) vs. PDTI (médio/curto prazo, tático-operacional, desdobra o PETI em plano de metas, pessoas, investimentos e riscos). PMBOK 7: 12 Princípios e 8 Domínios de Desempenho (Partes Interessadas, Equipe, Abordagem de Desenvolvimento e Ciclo de Vida, Planejamento, Trabalho do Projeto, Entrega, Medição, Incerteza). ITIL 4: 7 Princípios Orientadores, 4 Dimensões, SVS (5 componentes) e Cadeia de Valor (6 atividades). Diferença clássica ITIL: Incidente (interrupção não planejada — foco em restaurar o serviço o mais rápido possível, mesmo com solução de contorno/workaround) vs. Problema (causa de um ou mais incidentes — foco em investigar a causa-raiz/erro conhecido e eliminar definitivamente). COBIT 2019: 6 Princípios do Sistema de Governança + 3 do Framework; 7 Componentes; 40 Objetivos divididos em Governança (EDM — 5 objetivos: Avaliar, Dirigir e Monitorar) e Gestão (APO, BAI, DSS, MEA — 35 objetivos: Planejar, Construir, Executar e Monitorar)."
        },
        {
          id: "esp_9_2",
          numero: "5, 6, 7 e 8",
          titulo: "LAI Federal (Lei 12.527/2011), LAI Distrital (Lei 4.990/2012) e LGPD Completa (Lei 13.709/2018)",
          subitens: "5 Segurança da informação e proteção de dados. 6 Lei Federal nº 12.527/2011 (LAI). 7 Lei Distrital nº 4.990/2012 (LAI-DF). 8 Lei Federal nº 13.709/2018 (LGPD): princípios, tratamento, direitos dos titulares, segurança e incidentes.",
          resumoChave: "LAI (12.527/2011 e 4.990/2012): Publicidade é o preceito geral e o sigilo é a exceção. Prazo para resposta ao pedido de acesso: imediato ou em até 20 dias (prorrogáveis por +10 dias mediante justificativa expressa). Prazos de sigilo: Ultrassecreto (25 anos), Secreto (15 anos), Reservado (5 anos), Informação Pessoal (até 100 anos, independe de classificação de sigilo!). LGPD (13.709/2018): Atores (Titular, Controlador — quem toma as decisões sobre o tratamento, Operador — quem realiza o tratamento em nome do controlador; juntos são os Agentes de Tratamento! O Encarregado/DPO NÃO é agente de tratamento, é o canal de comunicação!). 10 Bases legais para dados comuns (Art. 7º) vs. 8 Bases para dados sensíveis (Art. 11 — Atenção: Legítimo Interesse e Proteção do Crédito NÃO se aplicam a dados sensíveis!)."
        }
      ]
    },
    {
      id: "esp_10",
      codigo: "ESP-10",
      nome: "Fiscalização de Contratos de Tecnologia da Informação",
      categoria: "especificos",
      questoesProva: 4,
      peso: 2,
      pontosProva: 8.0,
      prioridade: "Altíssima (8 Pontos em 3 Normas!)",
      cor: "#4f46e5",
      icone: "file-check",
      descricao: "Lei de Licitações (Lei 14.133/2021), Instrução Normativa SGD/ME nº 94/2022 (Contratação de TIC) e IN SEGES/ME nº 65/2021 (Pesquisa de Preços).",
      topicos: [
        {
          id: "esp_10_1",
          numero: "1 e 2.2",
          titulo: "IN SGD/ME nº 94/2022: Fases da Contratação de TIC, Papéis, Artefatos e Vedações",
          subitens: "1 Planejamento, gestão e fiscalização de contratações de soluções de TIC. 1.1 Planejamento. 1.2 Seleção do fornecedor. 1.3 Gestão e fiscalização contratual. 1.4 Gerenciamento de riscos. 1.5 Acordos de níveis de serviço (ANS/SLA) e indicadores. 2.2 Instrução Normativa SGD/ME nº 94/2022.",
          resumoChave: "As 3 Fases da Contratação de TIC (Art. 8º da IN 94/2022): 1) Planejamento da Contratação (PCTI), 2) Seleção do Fornecedor (SFTI) e 3) Gestão do Contrato (GCTI), com o Gerenciamento de Riscos (MGR) ocorrendo em TODAS as fases! Equipe de Planejamento da Contratação: Integrante Requisitante + Integrante Técnico + Integrante Administrativo. Etapas do Planejamento: Instituição da Equipe -> Elaboração do Estudo Técnico Preliminar (ETP) -> Elaboração do Termo de Referência (TR). Equipe de Fiscalização do Contrato: Gestor do Contrato + Fiscal Técnico (servidor da área de TIC!) + Fiscal Requisitante + Fiscal Administrativo. Recebimento Provisório (a cargo do Fiscal Técnico, Administrativo e Setorial) vs. Recebimento Definitivo (a cargo do Gestor do Contrato!)."
        },
        {
          id: "esp_10_2",
          numero: "2.1 e 2.3",
          titulo: "Lei nº 14.133/2021 (Nova Lei de Licitações) e IN SEGES/ME nº 65/2021 (Pesquisa de Preços)",
          subitens: "2.1 Lei Federal nº 14.133/2021 (Lei de Licitações e Contratos Administrativos). 2.3 Instrução Normativa SEGES/ME nº 65/2021.",
          resumoChave: "Lei 14.133/2021: 5 Modalidades de Licitação (Pregão, Concorrência, Concurso, Leilão e Diálogo Competitivo — NÃO existem mais Tomada de Preços nem Convite!). Contratação de bens e serviços comuns de TIC: obrigatoriamente por Pregão; serviços técnicos especializados de natureza predominantemente intelectual ou soluções complexas: Concorrência ou Diálogo Competitivo. IN SEGES/ME nº 65/2021 (Pesquisa de Preços): 5 Parâmetros (I - Painel de Preços/Custos unitários; II - Contratações similares de outros entes públicos até 1 ano antes; III - Mídia especializada/sites de domínio amplo; IV - Pesquisa direta com no mínimo 3 fornecedores, de até 6 meses; V - Base nacional de notas fiscais eletrônicas até 1 ano). Priorizar os parâmetros I e II! Métodos de cálculo: média, mediana ou menor dos valores obtidos."
        }
      ]
    }
  ]
};
