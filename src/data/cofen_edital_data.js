// ============================================================================
// EDITAL Nº 1/2026 — CONSELHO FEDERAL DE ENFERMAGEM (COFEN)
// Banca: Instituto Quadrix | 13 Cargos de Nível Superior | Prova: 28/02/2027
// Extraído diretamente do PDF oficial (Edital nº 1, de 25 de novembro de 2026)
// ============================================================================

(function () {
  "use strict";

  const RAW = {
  "basicos": {
    "portugues": [
      {
        "id": "cofen_bas_port_t1",
        "numero": "1",
        "titulo": "Compreensão e Interpretação de Textos",
        "subitens": "1.1 Análise de textos variados, incluindo digitais (e-mails, redes sociais) e multimodais (gráficos, tabelas). 1.2 Identificação de tipos textuais, figuras de linguagem, denotação e conotação."
      },
      {
        "id": "cofen_bas_port_t2",
        "numero": "2",
        "titulo": "Análise Linguística e Semântica",
        "subitens": "2.1 Ortografia oficial. 2.2 Significado de palavras (sinônimos, antônimos, etc.). 2.3 Emprego das classes de palavras e colocação de pronomes."
      },
      {
        "id": "cofen_bas_port_t3",
        "numero": "3",
        "titulo": "Estruturação Textual",
        "subitens": "3.1 Coesão, coerência e uso de conectores. 3.2 Emprego correto de tempos e modos verbais."
      },
      {
        "id": "cofen_bas_port_t4",
        "numero": "4",
        "titulo": "Sintaxe",
        "subitens": "4.1 Estrutura de orações e períodos. 4.2 Relações de coordenação e subordinação. 4.3 Concordância verbal e nominal. 4.4 Regência verbal e nominal e uso da crase."
      },
      {
        "id": "cofen_bas_port_t5",
        "numero": "5",
        "titulo": "Pontuação",
        "subitens": "5.1 Uso correto dos sinais de pontuação."
      },
      {
        "id": "cofen_bas_port_t6",
        "numero": "6",
        "titulo": "Reescrita e Produção Textual",
        "subitens": "6.1 Reescrita de frases e textos. 6.2 Adequação da linguagem a diferentes contextos. 7 Redação oficial."
      }
    ],
    "rlm": [
      {
        "id": "cofen_bas_rlm_t1",
        "numero": "1",
        "titulo": "Matemática Básica",
        "subitens": "1.1 Operações com conjuntos numéricos. 1.2 Razão, proporção, porcentagem e regra de três (simples e composta). 1.3 Funções e equações (1º e 2º graus). 1.4 Progressões (aritmética e geométrica)."
      },
      {
        "id": "cofen_bas_rlm_t2",
        "numero": "2",
        "titulo": "Análise Combinatória e Probabilidade",
        "subitens": "2.1 Princípios de contagem (arranjos, combinações, permutações). 2.2 Noções de probabilidade."
      },
      {
        "id": "cofen_bas_rlm_t3",
        "numero": "3",
        "titulo": "Raciocínio Lógico",
        "subitens": "3.1 Estruturas lógicas e argumentação (dedução, indução). 3.2 Diagramas lógicos. 3.3 Proposições e conectivos."
      },
      {
        "id": "cofen_bas_rlm_t4",
        "numero": "4",
        "titulo": "Raciocínio Analítico e Espacial",
        "subitens": "4.1 Raciocínio verbal, matemático e sequencial. 4.2 Orientação no espaço e no tempo."
      },
      {
        "id": "cofen_bas_rlm_t5",
        "numero": "5",
        "titulo": "Análise de Dados",
        "subitens": "5.1 Estatística básica (média, moda, mediana). 5.2 Interpretação de gráficos e tabelas."
      },
      {
        "id": "cofen_bas_rlm_t6",
        "numero": "6",
        "titulo": "Matemática Financeira",
        "subitens": "6.1 Juros simples e compostos. 6.2 Descontos e taxas."
      }
    ],
    "informatica": [
      {
        "id": "cofen_bas_info_t1",
        "numero": "1",
        "titulo": "Conceitos Fundamentais",
        "subitens": "1.1 Hardware, software e periféricos."
      },
      {
        "id": "cofen_bas_info_t2",
        "numero": "2",
        "titulo": "Aplicativos de Escritório e Comunicação",
        "subitens": "2.1 Editores de texto, planilhas e apresentações (Microsoft 365, Google Workspace). 2.2 Ferramentas de comunicação (Teams, Meet)."
      },
      {
        "id": "cofen_bas_info_t3",
        "numero": "3",
        "titulo": "Sistemas Operacionais",
        "subitens": "3.1 Noções de Windows (10 e 11). 3.2 Sistemas móveis (Android e iOS)."
      },
      {
        "id": "cofen_bas_info_t4",
        "numero": "4",
        "titulo": "Redes e Internet",
        "subitens": "4.1 Conceitos básicos de redes, internet e intranet. 4.2 Navegadores (Chrome, Firefox, Edge). 4.3 Uso de e-mail (Outlook, webmail) e sites de busca."
      },
      {
        "id": "cofen_bas_info_t5",
        "numero": "5",
        "titulo": "Gerenciamento e Segurança da Informação",
        "subitens": "5.1 Organização de arquivos e pastas. 5.2 Armazenamento em nuvem (OneDrive, Google Drive). 5.3 Segurança (vírus, antivírus, firewall). 5.4 Procedimentos de backup."
      },
      {
        "id": "cofen_bas_info_t6",
        "numero": "6",
        "titulo": "Transformação Digital",
        "subitens": "6.1 Conceitos básicos de Inteligência Artificial e computação em nuvem."
      }
    ],
    "ingles": [
      {
        "id": "cofen_bas_ingles_t1",
        "numero": "1",
        "titulo": "Compreensão de textos escritos em língua inglesa",
        "subitens": "1.1 Textos de gêneros variados, incluindo textos técnicos da área de tecnologia. 1.2 Identificação de ideias principais e secundárias. 1.3 Interpretação de gráficos, tabelas e recursos visuais."
      },
      {
        "id": "cofen_bas_ingles_t2",
        "numero": "2",
        "titulo": "Vocabulário",
        "subitens": "2.1 Vocabulário geral e profissional. 2.2 Terminologia básica de tecnologia da informação. 2.3 Expressões idiomáticas comuns."
      },
      {
        "id": "cofen_bas_ingles_t3",
        "numero": "3",
        "titulo": "Aspectos gramaticais para compreensão textual",
        "subitens": "3.1 Substantivos e artigos. 3.2 Adjetivos e advérbios. 3.3 Pronomes. 3.4 Verbos e tempos verbais. 3.5 Verbos modais. 3.6 Preposições e conjunções."
      },
      {
        "id": "cofen_bas_ingles_t4",
        "numero": "4",
        "titulo": "Estrutura textual",
        "subitens": "4.1 Elementos de coesão e coerência. 4.2 Conectivos lógicos."
      },
      {
        "id": "cofen_bas_ingles_t5",
        "numero": "5",
        "titulo": "Aplicação prática",
        "subitens": "5.1 Compreensão de manuais técnicos. 5.2 Interpretação de comunicações profissionais. 5.3 Entendimento de instruções e procedimentos em inglês."
      }
    ]
  },
  "complementares": {
    "legislacao": [
      {
        "id": "cofen_comp_leg_t1",
        "numero": "1",
        "titulo": "CRFB/1988",
        "subitens": "artigo 5º e artigos 196 a 200. 2 Lei nº 5.905/1973. 3 Decreto nº 94.406/1987. 4 Lei nº 14.133/2021. 5 Resoluções COFEN nº 507/2016, nº 726/2023 e nº 751/2024, incluindo suas alterações e as normas que as substituam. 6 Lei nº 8.429/1992 e alterações da Lei nº 14.230/2021. 7 Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD). 8 Lei nº 9.784/1999. 9 Lei nº 12.846/2013."
      }
    ],
    "constitucional": [
      {
        "id": "cofen_comp_const_t1",
        "numero": "1",
        "titulo": "Supremacia da Constituição Federal e hierarquia das normas",
        "subitens": "Supremacia da Constituição Federal e hierarquia das normas."
      },
      {
        "id": "cofen_comp_const_t2",
        "numero": "2",
        "titulo": "Princípios fundamentais",
        "subitens": "Princípios fundamentais."
      },
      {
        "id": "cofen_comp_const_t3",
        "numero": "3",
        "titulo": "Direitos e garantias fundamentais",
        "subitens": "Direitos e garantias fundamentais. 3.1 Direitos e deveres individuais e coletivos. 3.2 Direitos sociais."
      },
      {
        "id": "cofen_comp_const_t4",
        "numero": "4",
        "titulo": "Organização do Estado",
        "subitens": "Organização do Estado. 4.1 Administração Pública."
      },
      {
        "id": "cofen_comp_const_t5",
        "numero": "5",
        "titulo": "Organização dos Poderes",
        "subitens": "Organização dos Poderes. 5.1 Princípio da separação dos Poderes. 5.2 Estrutura e competências básicas dos Poderes Legislativo, Executivo e Judiciário."
      },
      {
        "id": "cofen_comp_const_t6",
        "numero": "6",
        "titulo": "Funções Essenciais à Justiça",
        "subitens": "Funções Essenciais à Justiça."
      },
      {
        "id": "cofen_comp_const_t7",
        "numero": "7",
        "titulo": "Controle da Administração Pública",
        "subitens": "Controle da Administração Pública."
      },
      {
        "id": "cofen_comp_const_t8",
        "numero": "8",
        "titulo": "Relação entre os Poderes e os órgãos de controle",
        "subitens": "Relação entre os Poderes e os órgãos de controle."
      },
      {
        "id": "cofen_comp_const_t9",
        "numero": "9",
        "titulo": "Ordem Social",
        "subitens": "Ordem Social. 9.1 Saúde."
      }
    ],
    "administrativo": [
      {
        "id": "cofen_comp_adm_t1",
        "numero": "1",
        "titulo": "Conceito, características e fontes do Direito Administrativo",
        "subitens": "Conceito, características e fontes do Direito Administrativo. 1.1 Relação com outros ramos do Direito."
      },
      {
        "id": "cofen_comp_adm_t2",
        "numero": "2",
        "titulo": "Princípios da Administração Pública",
        "subitens": "Princípios da Administração Pública."
      },
      {
        "id": "cofen_comp_adm_t3",
        "numero": "3",
        "titulo": "Organização Administrativa",
        "subitens": "Organização Administrativa. 3.1 Órgãos públicos. 3.2 Hierarquia. 3.3 Descentralização e desconcentração administrativa. 3.4 Administração direta e indireta."
      },
      {
        "id": "cofen_comp_adm_t4",
        "numero": "4",
        "titulo": "Conselhos de Fiscalização Profissional",
        "subitens": "Conselhos de Fiscalização Profissional. 4.1 Natureza jurídica, competências, poder de polícia administrativa, autonomia administrativa e financeira e controle do Tribunal de Contas da União."
      },
      {
        "id": "cofen_comp_adm_t5",
        "numero": "5",
        "titulo": "Atos administrativos",
        "subitens": "Atos administrativos. 5.1 Definição, classificação e requisitos dos atos administrativos. 5.2 Atributos dos atos administrativos. 5.3 Vícios, invalidação e controle dos atos da Administração Pública. 5.4 Anulação, revogação e autotutela."
      },
      {
        "id": "cofen_comp_adm_t6",
        "numero": "6",
        "titulo": "Poderes administrativos",
        "subitens": "Poderes administrativos. 6.1 Conceito, características, espécies, limites, abuso de poder e controle dos poderes administrativos."
      },
      {
        "id": "cofen_comp_adm_t7",
        "numero": "7",
        "titulo": "Empregado público",
        "subitens": "Empregado público. 7.1 Espécies, cargos, empregos e funções públicas. 7.2 Regime jurídico dos empregados públicos dos Conselhos de Fiscalização Profissional."
      },
      {
        "id": "cofen_comp_adm_t8",
        "numero": "8",
        "titulo": "Sindicância e processo administrativo disciplinar",
        "subitens": "Sindicância e processo administrativo disciplinar."
      }
    ]
  },
  "roles": [
    {
      "codigo": "400",
      "id": "cofen_2026_400",
      "nome": "Advogado",
      "requisitos": "Direito + OAB",
      "vagas": "1 + 39 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_400_esp_t1",
          "numero": "1",
          "titulo": "Direito Constitucional",
          "subitens": "1.1 Constituição: conceito, objeto, elementos e classificações. 1.2 Supremacia da Constituição e aplicabilidade das normas constitucionais. 1.3 Princípios fundamentais. 1.4 Direitos e garantias fundamentais. 1.4.1 Direitos e deveres individuais e coletivos. 1.4.2 Habeas corpus, mandado de segurança, mandado de injunção e habeas data. 1.4.3 Direitos sociais. 1.5 Organização do Estado. 1.5.1 Organização político-administrativa. 1.5.2 Administração Pública: princípios e servidores públicos. 1.6 Organização dos poderes. 1.6.1 Poder Legislativo. 1.6.2 Poder Executivo. 1.6.3 Poder Judiciário. 1.7 Funções essenciais à Justiça. 1.7.1 Ministério Público. 1.7.2 Advocacia Pública. 1.8 Controle de constitucionalidade. 1.8.1 Sistemas de controle. 1.8.2 Ação direta de inconstitucionalidade e ação declaratória de constitucionalidade. 1.8.3 Arguição de descumprimento de preceito fundamental."
        },
        {
          "id": "cofen_400_esp_t2",
          "numero": "2",
          "titulo": "Direito Administrativo",
          "subitens": "2.1 Regime jurídico-administrativo. 2.1.1 Princípios expressos e implícitos da administração pública. 2.2 Organização administrativa. 2.2.1 Centralização, descentralização, concentração e desconcentração. 2.2.2 Administração direta e indireta. 2.2.3 Autarquias, fundações, empresas públicas e sociedades de economia mista. 2.3 Atos administrativos. 2.3.1 Conceito, requisitos, elementos, atributos e classificação. 2.3.2 Extinção, revogação, anulação e convalidação. 2.4 Processo administrativo. 2.4.1 Lei nº 9.784/1999. 2.4.2 Princípios e fases do processo administrativo. 2.5 Licitações e contratos administrativos. 2.5.1 Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos Administrativos). 2.5.2 Princípios, modalidades e tipos de licitação. 2.5.3 Contratação direta: dispensa e inexigibilidade. 2.5.4 Contratos administrativos: conceito, características, cláusulas exorbitantes. 2.5.5 Alteração, execução e inexecução contratual. 2.5.6 Fiscalização de contratos administrativos. 2.6 Agentes públicos. 2.6.1 Espécies e classificação. 2.6.2 Cargo, emprego e função pública. 2.6.3 Direitos e deveres. 2.6.4 Responsabilidade administrativa, civil e penal. 2.7 Responsabilidade civil do Estado. 2.7.1 Teorias da responsabilidade civil do Estado. 2.7.2 Responsabilidade por ato comissivo e por omissão. 2.7.3 Causas excludentes e atenuantes."
        },
        {
          "id": "cofen_400_esp_t3",
          "numero": "3",
          "titulo": "Direito Civil",
          "subitens": "3.1 Lei de Introdução às Normas do Direito Brasileiro. 3.1.1 Vigência, aplicação, interpretação e integração das leis. 3.1.2 Conflito das leis no tempo e no espaço. 3.2 Pessoas naturais e jurídicas. 3.2.1 Personalidade, capacidade e direitos da personalidade. 3.2.2 Domicílio. 3.2.3 Associações, fundações e sociedades. 3.3 Bens: diferentes classes. 3.4 Fatos jurídicos. 3.4.1 Negócio jurídico: elementos, representação, condição, termo e encargo. 3.4.2 Defeitos do negócio jurídico. 3.4.3 Invalidade do negócio jurídico. 3.5 Prescrição e decadência. 3.6 Obrigações. 3.6.1 Modalidades. 3.6.2 Adimplemento e extinção das obrigações. 3.6.3 Inadimplemento das obrigações. 3.7 Contratos. 3.7.1 Princípios e classificação. 3.7.2 Formação, efeitos e extinção dos contratos. 3.7.3 Espécies de contratos regulados no Código Civil."
        },
        {
          "id": "cofen_400_esp_t4",
          "numero": "4",
          "titulo": "Direito Processual Civil",
          "subitens": "4.1 Lei nº 13.105/2015 – Código de Processo Civil. 4.1.1 Normas processuais civis. 4.1.2 Função jurisdicional. 4.1.3 Sujeitos do processo. 4.1.4 Atos processuais. 4.1.5 Tutela provisória. 4.1.6 Formação, suspensão e extinção do processo. 4.2 Processo de conhecimento. 4.2.1 Procedimento comum. 4.2.2 Petição inicial, contestação e reconvenção. 4.2.3 Provas. 4.2.4 Sentença e coisa julgada. 4.3 Cumprimento de sentença. 4.4 Processos nos tribunais e meios de impugnação das decisões judiciais. 4.4.1 Recursos: teoria geral e espécies. 4.5 Processo Judicial Eletrônico."
        },
        {
          "id": "cofen_400_esp_t5",
          "numero": "5",
          "titulo": "Direito do Trabalho e Processual do Trabalho",
          "subitens": "5.1 Princípios e fontes do direito do trabalho. 5.2 Relação de trabalho e relação de emprego. 5.3 Contrato individual de trabalho. 5.3.1 Alteração, suspensão e interrupção. 5.3.2 Rescisão. 5.4 Duração do trabalho e períodos de descanso. 5.5 Salário e remuneração. 5.6 Férias, 13º salário e FGTS. 5.7 Organização da Justiça do Trabalho. 5.8 Competência da Justiça do Trabalho. 5.9 Procedimentos nos dissídios individuais. 5.10 Recursos no processo do trabalho."
        },
        {
          "id": "cofen_400_esp_t6",
          "numero": "6",
          "titulo": "Legislação e ética na administração pública",
          "subitens": "6.1 Ética no Setor Público: 6.1.1 Conceito de ética na função pública. 6.1.2 Princípios fundamentais da Administração Pública. 6.2 Improbidade Administrativa: 6.2.1 Noções da Lei nº 8.429/1992. 6.3 Processo Administrativo: 6.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 6.4 Transparência e Acesso à Informação: 6.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 6.5 Proteção de Dados Pessoais: 6.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        },
        {
          "id": "cofen_400_esp_t7",
          "numero": "7",
          "titulo": "Legislação institucional",
          "subitens": "7.1 Conselhos de fiscalização profissional. 7.1.1 Natureza jurídica das autarquias corporativas. 7.1.2 Regime jurídico aplicável. 7.1.3 Competência normativa, fiscalizatória, disciplinar e tributária. 7.1.4 Poder de polícia administrativa. 7.1.5 Prerrogativas institucionais. 7.1.6 Processo ético- disciplinar. 7.1.7 Processo administrativo no âmbito dos conselhos profissionais. 7.1.8 Responsabilidade dos agentes públicos e dos profissionais inscritos. 7.1.9 Controle interno e externo. 7.1.10 Judicialização da atividade fiscalizatória. 7.1.11 Jurisprudência dos tribunais superiores aplicada aos conselhos profissionais."
        },
        {
          "id": "cofen_400_esp_t8",
          "numero": "8",
          "titulo": "Redação jurídica e prática institucional",
          "subitens": "8.1 Elaboração de pareceres jurídicos. 8.2 Elaboração de notas técnicas. 8.3 Elaboração de estudos jurídicos. 8.4 Elaboração de contratos, convênios e termos aditivos. 8.5 Elaboração de minutas de atos normativos. 8.6 Elaboração de petições e recursos. 8.7 Elaboração de manifestações em processos administrativos. 8.8 Elaboração de defesas e informações processuais. 8.9 Respostas a órgãos de controle. 8.10 Consultas jurídicas e peças técnico-jurídicas. 8.11 Técnica legislativa. 8.12 Redação oficial. 8.13 Fundamentação legal, doutrinária e jurisprudencial."
        }
      ]
    },
    {
      "codigo": "401",
      "id": "cofen_2026_401",
      "nome": "Analista de Comunicação II",
      "requisitos": "Letras / Português",
      "vagas": "30 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_401_esp_t1",
          "numero": "1",
          "titulo": "Fundamentos da Comunicação",
          "subitens": "1.1 Conceitos básicos de comunicação social. 1.2 Principais veículos de comunicação no Brasil. 1.3 Características da comunicação impressa, eletrônica e digital. 1.4 Princípios básicos de redação para comunicação. 1.5 Ética na comunicação."
        },
        {
          "id": "cofen_401_esp_t2",
          "numero": "2",
          "titulo": "Comunicação Institucional",
          "subitens": "2.1 Conceito e importância da comunicação institucional. 2.2 Estrutura básica da notícia institucional. 2.3 O papel do assistente de comunicação. 2.4 Relacionamento com a imprensa. 2.5 Elaboração de releases e comunicados. 2.6 Organização de entrevistas. 2.7 Comunicação interna e externa. 2.8 Publicações institucionais."
        },
        {
          "id": "cofen_401_esp_t3",
          "numero": "3",
          "titulo": "Técnicas de Redação",
          "subitens": "3.1 Principais gêneros textuais: notícia, reportagem, entrevista, comunicado, release. 3.2 Técnicas básicas de redação jornalística. 3.3 Critérios de seleção e edição de conteúdo. 3.4 Noções de editoração e diagramação. 3.5 Redação para diferentes públicos. 3.6 Revisão e edição de textos."
        },
        {
          "id": "cofen_401_esp_t4",
          "numero": "4",
          "titulo": "Redação Oficial",
          "subitens": "4.1 Características da redação oficial. 4.2 Pronomes de tratamento. 4.3 Notas oficiais e comunicados institucionais. 4.4 Correspondência oficial básica."
        },
        {
          "id": "cofen_401_esp_t5",
          "numero": "5",
          "titulo": "Comunicação Digital",
          "subitens": "5.1 Redação para web e redes sociais. 5.2 Principais plataformas de mídias sociais. 5.3 Produção de conteúdo para ambiente digital. 5.4 Monitoramento básico de redes sociais. 5.5 Noções de marketing de conteúdo. 6 Produção, revisão e edição textual. 6.1 Produção de textos em norma-padrão. 6.2 Reescrita de frases, períodos e textos. 6.3 Revisão ortográfica. 6.4 Revisão gramatical. 6.5 Revisão sintática e semântica. 6.6 Revisão estilística. 6.7 Padronização textual. 6.8 Uniformização terminológica. 6.9 Adequação vocabular e sintática. 6.10 Clareza, concisão, correção e precisão textual. 6.11 Preparação, tratamento e finalização de textos para circulação institucional. 6.12 Edição e consolidação de conteúdo. 6.13 Adaptação textual para diferentes públicos, suportes e finalidades. 6.14 Revisão de documentos administrativos, técnicos e institucionais. 6.15 Controle de qualidade textual e consistência editorial. 6.16 Reescrita de textos técnicos em linguagem clara e acessível."
        },
        {
          "id": "cofen_401_esp_t7",
          "numero": "7",
          "titulo": "Gêneros discursivos e práticas de escrita institucional",
          "subitens": "7.1 Gêneros textuais da administração pública e da comunicação institucional. 7.2 Gêneros informativos, expositivos, argumentativos e instrucionais. 7.3 Produção de textos de divulgação institucional. 7.4 Produção de conteúdo para portais e ambientes digitais institucionais. 7.5 Escrita para web. 7.6 Produção textual para redes institucionais. 7.7 Síntese, resumo, adaptação e condensação textual. 7.8 Construção de títulos, subtítulos, chamadas e textos de apoio. 7.9 Curadoria e organização de conteúdo textual. 7.10 Hierarquização de informações. 7.11 Consistência discursiva e identidade institucional. 7.12 Linguagem cidadã, acessível e inclusiva. 7.13 Noções de acessibilidade comunicacional aplicadas ao texto."
        },
        {
          "id": "cofen_401_esp_t8",
          "numero": "8",
          "titulo": "Campanhas de Comunicação",
          "subitens": "8.1 Noções de planejamento de comunicação. 8.2 Apoio na elaboração de campanhas institucionais. 8.3 Divulgação de campanhas nos diferentes canais. 8.4 Técnicas básicas de storytelling. 8.5 Acompanhamento de resultados de campanhas."
        },
        {
          "id": "cofen_401_esp_t9",
          "numero": "9",
          "titulo": "Legislação e ética na administração pública",
          "subitens": "9.1 Ética no Setor Público: 9.1.1 Conceito de ética na função pública. 9.1.2 Princípios fundamentais da Administração Pública. 9.2 Improbidade Administrativa: 9.2.1 Noções da Lei nº 8.429/1992. 9.3 Processo Administrativo: 9.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 9.4 Transparência e Acesso à Informação: 9.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 9.5 Proteção de Dados Pessoais: 9.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        }
      ]
    },
    {
      "codigo": "402",
      "id": "cofen_2026_402",
      "nome": "Analista de Gestão de Pessoas",
      "requisitos": "Adm, Pedagogia, Psicologia ou RH",
      "vagas": "30 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_402_esp_t1",
          "numero": "1",
          "titulo": "Administração Geral",
          "subitens": "1.1 Noções de planejamento estratégico. 1.2 Noções de gestão de projetos. 1.2.1 Etapas básicas de projetos. 1.3 Gestão de processos. 1.3.1 Conceitos fundamentais. 1.3.2 Técnicas de mapeamento de processos. 1.4 Qualidade e Produtividade. 1.4.1 Conceitos básicos. 1.4.2 Ferramentas da qualidade. 1.4.3 Melhoria contínua. 1.4.4 Indicadores de desempenho."
        },
        {
          "id": "cofen_402_esp_t2",
          "numero": "2",
          "titulo": "Administração Pública",
          "subitens": "2.1 Princípios da Administração Pública. 2.2 Organização administrativa: administração direta e indireta. 2.3 Poderes e deveres do administrador público. 2.4 Atos administrativos: conceito, requisitos, atributos, classificação, espécies, invalidação. 2.5 Processo administrativo no âmbito da Administração Pública Federal (Lei nº 9.784/1999). 2.6 Controle da Administração Pública. 2.7 Regime jurídico-administrativo. 2.8 Serviços públicos: conceito, características, classificação, titularidade, princípios."
        },
        {
          "id": "cofen_402_esp_t3",
          "numero": "3",
          "titulo": "Fundamentos da Administração de Recursos Humanos",
          "subitens": "3.1 Evolução histórica da gestão de pessoas. 3.2 Gestão estratégica de pessoas. 3.3 Modelos de gestão de pessoas. 3.4 Planejamento estratégico da gestão de pessoas. 3.5 Indicadores de gestão de recursos humanos. 3.6 Gestão do conhecimento. 3.7 Tendências em gestão de pessoas. 3.8 Competências organizacionais e individuais."
        },
        {
          "id": "cofen_402_esp_t4",
          "numero": "4",
          "titulo": "Processos Gerais de Gestão de Pessoas",
          "subitens": "4.1 Recrutamento e seleção – noções gerais. 4.2 Cargos e salários – conceitos fundamentais. 4.3 Treinamento e desenvolvimento – fundamentos. 4.4 Avaliação de desempenho – princípios e métodos básicos."
        },
        {
          "id": "cofen_402_esp_t5",
          "numero": "5",
          "titulo": "Administração de Pessoal",
          "subitens": "5.1 Consolidação das Leis do Trabalho (CLT). 5.2 Contratos de trabalho: tipos, direitos e obrigações. 5.3 Registro, documentação e obrigações legais. 5.4 Folha de pagamento: conceitos gerais, cálculos básicos, encargos e obrigações. 5.5 Benefícios legais e espontâneos. 5.6 Jornada de trabalho: controle, horas extras, banco de horas e escalas."
        },
        {
          "id": "cofen_402_esp_t6",
          "numero": "6",
          "titulo": "Qualidade de Vida no Trabalho",
          "subitens": "6.1 Conceitos e modelos de QVT. 6.2 Ergonomia e saúde ocupacional – noções gerais. 6.3 Segurança do trabalho – noções básicas. 6.4 Saúde mental no trabalho. 6.5 Prevenção de assédio moral e sexual. 6.6 Inclusão e diversidade no ambiente organizacional."
        },
        {
          "id": "cofen_402_esp_t7",
          "numero": "7",
          "titulo": "Relações do Trabalho",
          "subitens": "7.1 Relações sindicais – noções gerais. 7.2 Negociações coletivas: conceitos e aplicação. 7.3 Acordos e convenções coletivas. 7.4 Comunicação interna e clima organizacional."
        },
        {
          "id": "cofen_402_esp_t8",
          "numero": "8",
          "titulo": "Sistemas de Informação em Recursos Humanos",
          "subitens": "8.1 Sistemas integrados de gestão (ERP). 8.2 Sistemas específicos de RH. 8.3 Folha de pagamento informatizada – noções gerais. 8.4 Controle eletrônico de ponto. 8.5 Relatórios gerenciais e indicadores de RH (turnover, absenteísmo, produtividade)."
        },
        {
          "id": "cofen_402_esp_t9",
          "numero": "9",
          "titulo": "Legislação Específica Aplicada ao RH",
          "subitens": "9.1 Reforma Trabalhista (Lei nº 13.467/2017). 9.2 Lei Geral de Proteção de Dados (LGPD) aplicada ao RH. 9.3 Legislação de inclusão de pessoas com deficiência. 9.4 Normas Regulamentadoras – noções gerais. 9.5 Legislação sobre terceirização. 9.6 Legislação sobre trabalho remoto e teletrabalho."
        },
        {
          "id": "cofen_402_esp_t10",
          "numero": "10",
          "titulo": "Desenvolvimento Organizacional",
          "subitens": "10.1 Elaboração de programas e projetos de benefícios e qualidade de vida no trabalho. 10.2 Gestão de clima e cultura organizacional, incluindo diagnóstico e intervenções. 10.3 Formulação e revisão de políticas internas de gestão de pessoas."
        },
        {
          "id": "cofen_402_esp_t11",
          "numero": "11",
          "titulo": "Treinamento, Desenvolvimento e Educação Corporativa",
          "subitens": "11.1 Levantamento de necessidades de treinamento e elaboração de programas de capacitação. 11.2 Técnicas de ensino, aprendizagem e andragogia aplicadas ao ambiente corporativo. 11.3 Avaliação de eficácia de treinamentos e desenvolvimento de lideranças."
        },
        {
          "id": "cofen_402_esp_t12",
          "numero": "12",
          "titulo": "Gestão Estratégica de Pessoas",
          "subitens": "12.1 Recrutamento e seleção para perfis estratégicos, entrevistas estruturadas e elaboração de perfis profissionais. 12.2 Métodos de avaliação de desempenho, feedback e planos de desenvolvimento individual (PDI). 12.3 Gestão de remuneração e carreira, incluindo manutenção do plano de cargos e salários e estudos de remuneração."
        },
        {
          "id": "cofen_402_esp_t13",
          "numero": "13",
          "titulo": "Legislação e ética na administração pública",
          "subitens": "13.1 Ética no Setor Público: 13.1.1 Conceito de ética na função pública. 13.1.2 Princípios fundamentais da Administração Pública. 13.2 Improbidade Administrativa: 13.2.1 Noções da Lei nº 8.429/1992. 13.3 Processo Administrativo: 13.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 13.4 Transparência e Acesso à Informação: 13.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 13.5 Proteção de Dados Pessoais: 13.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        }
      ]
    },
    {
      "codigo": "403",
      "id": "cofen_2026_403",
      "nome": "Analista de Pessoal",
      "requisitos": "Administração ou RH (CRA)",
      "vagas": "30 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_403_esp_t1",
          "numero": "1",
          "titulo": "Administração Geral",
          "subitens": "1.1 Noções de planejamento estratégico. 1.2 Noções de gestão de projetos. 1.2.1 Etapas básicas de projetos. 1.3 Gestão de processos. 1.3.1 Conceitos fundamentais. 1.3.2 Técnicas de mapeamento de processos. 1.4 Qualidade e Produtividade. 1.4.1 Conceitos básicos. 1.4.2 Ferramentas da qualidade. 1.4.3 Melhoria contínua. 1.4.4 Indicadores de desempenho."
        },
        {
          "id": "cofen_403_esp_t2",
          "numero": "2",
          "titulo": "Administração Pública",
          "subitens": "2.1 Princípios da Administração Pública. 2.2 Organização administrativa: administração direta e indireta. 2.3 Poderes e deveres do administrador público. 2.4 Atos administrativos: conceito, requisitos, atributos, classificação, espécies, invalidação. 2.5 Processo administrativo no âmbito da Administração Pública Federal (Lei nº 9.784/1999). 2.6 Controle da Administração Pública. 2.7 Regime jurídico-administrativo. 2.8 Serviços públicos: conceito, características, classificação, titularidade, princípios."
        },
        {
          "id": "cofen_403_esp_t3",
          "numero": "3",
          "titulo": "Fundamentos da Administração de Recursos Humanos",
          "subitens": "3.1 Evolução histórica da gestão de pessoas. 3.2 Gestão estratégica de pessoas. 3.3 Modelos de gestão de pessoas. 3.4 Planejamento estratégico da gestão de pessoas. 3.5 Indicadores de gestão de recursos humanos. 3.6 Gestão do conhecimento. 3.7 Tendências em gestão de pessoas. 3.8 Competências organizacionais e individuais."
        },
        {
          "id": "cofen_403_esp_t4",
          "numero": "4",
          "titulo": "Processos Gerais de Gestão de Pessoas",
          "subitens": "4.1 Recrutamento e seleção – noções gerais. 4.2 Cargos e salários – conceitos fundamentais. 4.3 Treinamento e desenvolvimento – fundamentos. 4.4 Avaliação de desempenho – princípios e métodos básicos."
        },
        {
          "id": "cofen_403_esp_t5",
          "numero": "5",
          "titulo": "Administração de Pessoal",
          "subitens": "5.1 Consolidação das Leis do Trabalho (CLT). 5.2 Contratos de trabalho: tipos, direitos e obrigações. 5.3 Registro, documentação e obrigações legais. 5.4 Folha de pagamento: conceitos gerais, cálculos básicos, encargos e obrigações. 5.5 Benefícios legais e espontâneos. 5.6 Jornada de trabalho: controle, horas extras, banco de horas e escalas."
        },
        {
          "id": "cofen_403_esp_t6",
          "numero": "6",
          "titulo": "Qualidade de Vida no Trabalho",
          "subitens": "6.1 Conceitos e modelos de QVT. 6.2 Ergonomia e saúde ocupacional – noções gerais. 6.3 Segurança do trabalho – noções básicas. 6.4 Saúde mental no trabalho. 6.5 Prevenção de assédio moral e sexual. 6.6 Inclusão e diversidade no ambiente organizacional."
        },
        {
          "id": "cofen_403_esp_t7",
          "numero": "7",
          "titulo": "Relações do Trabalho",
          "subitens": "7.1 Relações sindicais – noções gerais. 7.2 Negociações coletivas: conceitos e aplicação. 7.3 Acordos e convenções coletivas. 7.4 Comunicação interna e clima organizacional."
        },
        {
          "id": "cofen_403_esp_t8",
          "numero": "8",
          "titulo": "Sistemas de Informação em Recursos Humanos",
          "subitens": "8.1 Sistemas integrados de gestão (ERP). 8.2 Sistemas específicos de RH. 8.3 Folha de pagamento informatizada – noções gerais. 8.4 Controle eletrônico de ponto. 8.5 Relatórios gerenciais e indicadores de RH (turnover, absenteísmo, produtividade)."
        },
        {
          "id": "cofen_403_esp_t9",
          "numero": "9",
          "titulo": "Legislação Específica Aplicada ao RH",
          "subitens": "9.1 Reforma Trabalhista (Lei nº 13.467/2017). 9.2 Lei Geral de Proteção de Dados (LGPD) aplicada ao RH. 9.3 Legislação de inclusão de pessoas com deficiência. 9.4 Normas Regulamentadoras – noções gerais. 9.5 Legislação sobre terceirização. 9.6 Legislação sobre trabalho remoto e teletrabalho."
        },
        {
          "id": "cofen_403_esp_t10",
          "numero": "10",
          "titulo": "Administração de Pessoal",
          "subitens": "10.1 Rotinas de admissão e desligamento, incluindo documentação funcional, prazos legais e atualização cadastral. 10.2 Execução de folha de pagamento, compreendendo cálculos básicos de salários, férias, 13º salário, rescisões e encargos trabalhistas e previdenciários. 10.3 Obrigações trabalhistas, previdenciárias e fiscais relacionadas à administração de pessoal: eSocial, EFD-Reinf, DCTFWeb e FGTS Digital; substituição das obrigações anteriormente cumpridas por meio da RAIS, do CAGED e da DIRF."
        },
        {
          "id": "cofen_403_esp_t11",
          "numero": "11",
          "titulo": "Jornada de Trabalho, Frequência e Benefícios",
          "subitens": "11.1 Controle de ponto e registro de jornada, incluindo horas extras, adicional noturno, escalas e banco de horas. 11.2 Administração operacional de benefícios, como vale-transporte, vale-alimentação/refeição e benefícios conveniados. 11.3 Procedimentos de concessão, alteração, suspensão e cancelamento de benefícios."
        },
        {
          "id": "cofen_403_esp_t12",
          "numero": "12",
          "titulo": "Relações Trabalhistas e Procedimentos Internos",
          "subitens": "12.1 Atuação como preposto em audiências trabalhistas e preparação de documentação para processos judiciais. 12.2 Elaboração, atualização e padronização de rotinas e fluxos de departamento pessoal. 12.3 Apoio à Divisão de Pessoal na produção de relatórios técnico-administrativos, atendimento a empregados e acompanhamento de indicadores de folha e frequência."
        },
        {
          "id": "cofen_403_esp_t13",
          "numero": "13",
          "titulo": "Legislação e ética na administração pública",
          "subitens": "13.1 Ética no Setor Público: 13.1.1 Conceito de ética na função pública. 13.1.2 Princípios fundamentais da Administração Pública. 13.2 Improbidade Administrativa: 13.2.1 Noções da Lei nº 8.429/1992. 13.3 Processo Administrativo: 13.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 13.4 Transparência e Acesso à Informação: 13.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 13.5 Proteção de Dados Pessoais: 13.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        }
      ]
    },
    {
      "codigo": "404",
      "id": "cofen_2026_404",
      "nome": "Analista de Sistemas",
      "requisitos": "TI / Computação / Eng. Software",
      "vagas": "30 CR",
      "isTI": true,
      "especificosTopicos": [
        {
          "id": "cofen_404_esp_t1",
          "numero": "1",
          "titulo": "Fundamentos de Computação",
          "subitens": "1.1 Organização e arquitetura de computadores. 1.2 Hardware, software e periféricos. 1.3 Sistemas operacionais: conceitos gerais, gerenciamento de processos, memória, arquivos e usuários (Windows e Linux). 1.4 Conceitos fundamentais de Internet, Intranet e protocolos básicos. 1.5 Conceitos introdutórios de computação em nuvem."
        },
        {
          "id": "cofen_404_esp_t2",
          "numero": "2",
          "titulo": "Redes de Computadores",
          "subitens": "2.1 Conceitos básicos de redes: LAN, WAN, WLAN, topologias, meios físicos. 2.2 Modelos de referência OSI e TCP/IP. 2.3 Protocolos: IPv4, IPv6, TCP, UDP, HTTP, HTTPS, DNS, SMTP, FTP. 2.4 Equipamentos de rede: switches, roteadores, access points e firewalls. 2.5 Conceitos gerais de VPN e segurança de redes."
        },
        {
          "id": "cofen_404_esp_t3",
          "numero": "3",
          "titulo": "Segurança da Informação",
          "subitens": "3.1 Princípios fundamentais: confidencialidade, integridade, disponibilidade e autenticidade. 3.2 Políticas de segurança da informação. 3.3 Conceitos básicos de criptografia, certificados digitais e assinatura digital. 3.4 Principais ameaças, ataques e vulnerabilidades. 3.5 Backup, restauração e continuidade de negócios. 3.6 Noções sobre normas ISO/IEC 27001 e 27002."
        },
        {
          "id": "cofen_404_esp_t4",
          "numero": "4",
          "titulo": "Banco de Dados",
          "subitens": "4.1 Conceitos básicos de bancos de dados. 4.2 Modelagem relacional e normalização. 4.3 Linguagem SQL: manipulação e consulta de dados. 4.4 Noções de administração básica de SGBDs."
        },
        {
          "id": "cofen_404_esp_t5",
          "numero": "5",
          "titulo": "Engenharia de Software",
          "subitens": "5.1 Conceitos fundamentais de engenharia de software. 5.2 Ciclos de vida e modelos de desenvolvimento. 5.3 Metodologias ágeis: Scrum e Kanban. 5.4 Conceitos gerais de UML (casos de uso, classes, atividades). 5.5 Princípios básicos de teste de software."
        },
        {
          "id": "cofen_404_esp_t6",
          "numero": "6",
          "titulo": "Governança e Gestão de TI",
          "subitens": "6.1 Conceitos gerais de ITIL e COBIT. 6.2 Gerenciamento de serviços de TI. 6.3 Gestão de riscos. 6.4 Conceitos de SLA e indicadores."
        },
        {
          "id": "cofen_404_esp_t7",
          "numero": "7",
          "titulo": "Legislação e Ética na Administração Pública",
          "subitens": "7.1 Ética no Setor Público: 7.1.1 Conceito de ética na função pública. 7.1.2 Princípios fundamentais da Administração Pública. 7.2 Improbidade Administrativa: 7.2.1 Noções da Lei nº 8.429/1992. 7.3 Processo Administrativo: 7.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 7.4 Transparência e Acesso à Informação: 7.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 7.5 Proteção de Dados Pessoais: 7.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        },
        {
          "id": "cofen_404_esp_t8",
          "numero": "8",
          "titulo": "Análise e Desenvolvimento de Sistemas",
          "subitens": "8.1 Levantamento e análise de requisitos. 8.2 Análise estruturada e orientada a objetos. 8.3 Especificação de requisitos funcionais e não funcionais. 8.4 Técnicas de modelagem de processos (BPMN). 8.5 Análise de viabilidade técnica e funcional."
        },
        {
          "id": "cofen_404_esp_t9",
          "numero": "9",
          "titulo": "Linguagens de Programação e Desenvolvimento",
          "subitens": "9.1 Conceitos fundamentais de programação: algoritmos, estruturas de dados, modularização. 9.2 Programação orientada a objetos. 9.3 Conceitos gerais de desenvolvimento web (HTML, CSS, JavaScript). 9.4 APIs e serviços: conceitos de REST e SOAP. 9.5 Integração entre sistemas e interoperabilidade."
        },
        {
          "id": "cofen_404_esp_t10",
          "numero": "10",
          "titulo": "Arquitetura e Engenharia de Software",
          "subitens": "10.1 Arquiteturas em camadas, MVC e microserviços (noções gerais). 10.2 Padrões de projeto (design patterns) – conceitos. 10.3 Qualidade e métricas de software. 10.4 Testes de software: unidade, integração, sistema e aceitação. 10.5 Integração e entrega contínua (CI/CD) – fundamentos."
        },
        {
          "id": "cofen_404_esp_t11",
          "numero": "11",
          "titulo": "Gestão e Acompanhamento de Projetos de Sistemas",
          "subitens": "11.1 PMBOK – conceitos essenciais. 11.2 Metodologias ágeis na prática: papéis, artefatos, cerimônias. 11.3 Acompanhamento, inspeção e auditoria de projetos de software. 11.4 Documentação técnica e manuais de sistemas."
        },
        {
          "id": "cofen_404_esp_t12",
          "numero": "12",
          "titulo": "Infraestrutura Aplicada ao Desenvolvimento",
          "subitens": "12.1 Versionamento de código (Git – conceitos básicos). 12.2 Ambientes de desenvolvimento, testes e produção. 12.3 Noções de containers e virtualização aplicados a sistemas."
        }
      ]
    },
    {
      "codigo": "405",
      "id": "cofen_2026_405",
      "nome": "Analista de Suporte Técnico",
      "requisitos": "TI / Computação / Sistemas",
      "vagas": "30 CR",
      "isTI": true,
      "especificosTopicos": [
        {
          "id": "cofen_405_esp_t1",
          "numero": "1",
          "titulo": "Fundamentos de Computação",
          "subitens": "1.1 Organização e arquitetura de computadores. 1.2 Hardware, software e periféricos. 1.3 Sistemas operacionais: conceitos gerais, gerenciamento de processos, memória, arquivos e usuários (Windows e Linux). 1.4 Conceitos fundamentais de Internet, Intranet e protocolos básicos. 1.5 Conceitos introdutórios de computação em nuvem."
        },
        {
          "id": "cofen_405_esp_t2",
          "numero": "2",
          "titulo": "Redes de Computadores",
          "subitens": "2.1 Conceitos básicos de redes: LAN, WAN, WLAN, topologias, meios físicos. 2.2 Modelos de referência OSI e TCP/IP. 2.3 Protocolos: IPv4, IPv6, TCP, UDP, HTTP, HTTPS, DNS, SMTP, FTP. 2.4 Equipamentos de rede: switches, roteadores, access points e firewalls. 2.5 Conceitos gerais de VPN e segurança de redes."
        },
        {
          "id": "cofen_405_esp_t3",
          "numero": "3",
          "titulo": "Segurança da Informação",
          "subitens": "3.1 Princípios fundamentais: confidencialidade, integridade, disponibilidade e autenticidade. 3.2 Políticas de segurança da informação. 3.3 Conceitos básicos de criptografia, certificados digitais e assinatura digital. 3.4 Principais ameaças, ataques e vulnerabilidades. 3.5 Backup, restauração e continuidade de negócios. 3.6 Noções sobre normas ISO/IEC 27001 e 27002."
        },
        {
          "id": "cofen_405_esp_t4",
          "numero": "4",
          "titulo": "Banco de Dados",
          "subitens": "4.1 Conceitos básicos de bancos de dados. 4.2 Modelagem relacional e normalização. 4.3 Linguagem SQL: manipulação e consulta de dados. 4.4 Noções de administração básica de SGBDs."
        },
        {
          "id": "cofen_405_esp_t5",
          "numero": "5",
          "titulo": "Engenharia de Software",
          "subitens": "5.1 Conceitos fundamentais de engenharia de software. 5.2 Ciclos de vida e modelos de desenvolvimento. 5.3 Metodologias ágeis: Scrum e Kanban. 5.4 Conceitos gerais de UML (casos de uso, classes, atividades). 5.5 Princípios básicos de teste de software."
        },
        {
          "id": "cofen_405_esp_t6",
          "numero": "6",
          "titulo": "Governança e Gestão de TI",
          "subitens": "6.1 Conceitos gerais de ITIL e COBIT. 6.2 Gerenciamento de serviços de TI. 6.3 Gestão de riscos. 6.4 Conceitos de SLA e indicadores."
        },
        {
          "id": "cofen_405_esp_t7",
          "numero": "7",
          "titulo": "Legislação e Ética na Administração Pública",
          "subitens": "7.1 Ética no Setor Público: 7.1.1 Conceito de ética na função pública. 7.1.2 Princípios fundamentais da Administração Pública. 7.2 Improbidade Administrativa: 7.2.1 Noções da Lei nº 8.429/1992. 7.3 Processo Administrativo: 7.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 7.4 Transparência e Acesso à Informação: 7.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 7.5 Proteção de Dados Pessoais: 7.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        },
        {
          "id": "cofen_405_esp_t8",
          "numero": "8",
          "titulo": "Atendimento e Suporte ao Usuário",
          "subitens": "8.1 Classificação, registro, priorização e acompanhamento de chamados. 8.2 Boas práticas de service desk. 8.3 ITIL – processos diretamente ligados a suporte (Incident, Request, Problem). 8.4 Procedimentos de troubleshooting."
        },
        {
          "id": "cofen_405_esp_t9",
          "numero": "9",
          "titulo": "Sistemas Operacionais e Ambientes Corporativos",
          "subitens": "9.1 Administração básica de Windows e Linux. 9.2 Gerenciamento de usuários, permissões e perfis. 9.3 Configurações de rede em estações e servidores. 9.4 Instalação, configuração e atualização de softwares."
        },
        {
          "id": "cofen_405_esp_t10",
          "numero": "10",
          "titulo": "Bancos de Dados – Apoio e Manutenção",
          "subitens": "10.1 Projetos simples de estruturação de banco de dados. 10.2 Manipulação e consulta SQL aplicada ao suporte. 10.3 Rotinas de manutenção, backup e restauração. 10.4 Configurações básicas de instâncias de SGBDs."
        },
        {
          "id": "cofen_405_esp_t11",
          "numero": "11",
          "titulo": "Infraestrutura e Soluções Técnicas",
          "subitens": "11.1 Noções de servidores, storages e serviços de rede. 11.2 Diagnóstico e solução de falhas de hardware. 11.3 Instalação e configuração de impressoras, scanners e dispositivos correlatos. 11.4 Suporte a aplicações corporativas e sistemas internos."
        },
        {
          "id": "cofen_405_esp_t12",
          "numero": "12",
          "titulo": "Monitoramento e Melhoria Contínua",
          "subitens": "12.1 Acompanhamento de desempenho de estações e serviços. 12.2 Identificação e proposição de melhorias tecnológicas. 12.3 Relatórios técnicos e indicadores de atendimento."
        }
      ]
    },
    {
      "codigo": "406",
      "id": "cofen_2026_406",
      "nome": "Analista Técnico",
      "requisitos": "Qualquer Nível Superior",
      "vagas": "1 + 39 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_406_esp_t1",
          "numero": "1",
          "titulo": "Noções de Direito Constitucional",
          "subitens": "1.1 Direitos e garantias fundamentais: direitos e deveres individuais e coletivos; direito à vida, à liberdade, à igualdade e à segurança. 1.2 Direitos humanos na Constituição Federal. 1.3 Declaração Universal dos Direitos Humanos. 1.4 Convenção Americana sobre Direitos Humanos."
        },
        {
          "id": "cofen_406_esp_t2",
          "numero": "2",
          "titulo": "Noções de Direito Administrativo",
          "subitens": "2.1 Administração direta e indireta. 2.1.1 Autarquias, fundações, empresas públicas e sociedades de economia mista. 2.2 Ato administrativo. 2.2.1 Conceito, requisitos, atributos, classificação e espécies. 2.3 Agentes públicos. 2.3.1 Legislação pertinente. 2.3.2 Disposições doutrinárias. 2.3.2.1 Conceito. 2.3.2.2 Espécies. 2.3.2.3 Cargo, emprego e função pública."
        },
        {
          "id": "cofen_406_esp_t3",
          "numero": "3",
          "titulo": "Noções de Administração Pública",
          "subitens": "3.1 Características básicas das organizações formais modernas: tipos de estrutura organizacional; natureza; finalidades; e critérios de departamentalização. 3.2 Processo organizacional: planejamento; direção; comunicação; controle; e avaliação. 3.3 Gestão de processos. 3.4 Gestão da qualidade. 3.5 Gestão de projetos."
        },
        {
          "id": "cofen_406_esp_t4",
          "numero": "4",
          "titulo": "Contratos Administrativos",
          "subitens": "4.1 Características e particularidades. 4.2 Cláusulas necessárias e exorbitantes. 4.3 Elaboração e formalização de contratos. 4.4 Duração e prorrogação dos contratos. 4.5 Alterações contratuais: quantitativas e qualitativas. 4.6 Equilíbrio econômico-financeiro: reajuste, repactuação e reequilíbrio. 4.7 Execução e inexecução contratual. 4.8 Sanções administrativas e rescisão contratual."
        },
        {
          "id": "cofen_406_esp_t5",
          "numero": "5",
          "titulo": "Gestão de Contratos",
          "subitens": "5.1 Designação e atribuições de gestores e fiscais. 5.2 Fiscalização técnica e administrativa. 5.3 Recebimento do objeto. 5.4 Acompanhamento da execução contratual. 5.5 Procedimentos para pagamento. 5.6 Aditamentos contratuais. 5.7 Aplicação de penalidades. 5.8 Processos de rescisão. 5.9 Boas práticas na gestão de contratos públicos."
        },
        {
          "id": "cofen_406_esp_t6",
          "numero": "6",
          "titulo": "Gestão de Projetos",
          "subitens": "6.1 Conceitos e fundamentos. 6.2 Ciclo de vida de projetos. 6.3 Elaboração, análise e avaliação de projetos. 6.4 Gerenciamento de escopo, tempo, custos e recursos. 6.5 Gerenciamento de riscos. 6.6 Gerenciamento da qualidade. 6.7 Monitoramento e controle de projetos. 6.8 Ferramentas de gestão de projetos."
        },
        {
          "id": "cofen_406_esp_t7",
          "numero": "7",
          "titulo": "Organização e Controle de Documentos",
          "subitens": "7.1 Noções de arquivologia. 7.2 Tipos de arquivos e métodos de arquivamento. 7.3 Gestão eletrônica de documentos. 7.4 Digitalização de documentos."
        },
        {
          "id": "cofen_406_esp_t8",
          "numero": "8",
          "titulo": "Legislação e Ética na Administração Pública",
          "subitens": "8.1 Ética no Setor Público: 8.1.1 Conceito de ética na função pública. 8.1.2 Princípios fundamentais da Administração Pública. 8.2 Improbidade Administrativa: 8.2.1 Noções da Lei nº 8.429/1992. 8.3 Processo Administrativo: 8.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 8.4 Transparência e Acesso à Informação: 8.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 8.5 Proteção de Dados Pessoais: 8.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        }
      ]
    },
    {
      "codigo": "407",
      "id": "cofen_2026_407",
      "nome": "Analista de Tecnologia da Informação e Comunicação",
      "requisitos": "TI / Sistemas / Computação",
      "vagas": "1 + 39 CR",
      "isTI": true,
      "especificosTopicos": [
        {
          "id": "cofen_407_esp_t1",
          "numero": "1",
          "titulo": "Fundamentos de Computação",
          "subitens": "1.1 Organização e arquitetura de computadores. 1.2 Hardware, software e periféricos. 1.3 Sistemas operacionais: conceitos gerais, gerenciamento de processos, memória, arquivos e usuários (Windows e Linux). 1.4 Conceitos fundamentais de Internet, Intranet e protocolos básicos. 1.5 Conceitos introdutórios de computação em nuvem."
        },
        {
          "id": "cofen_407_esp_t2",
          "numero": "2",
          "titulo": "Redes de Computadores",
          "subitens": "2.1 Conceitos básicos de redes: LAN, WAN, WLAN, topologias, meios físicos. 2.2 Modelos de referência OSI e TCP/IP. 2.3 Protocolos: IPv4, IPv6, TCP, UDP, HTTP, HTTPS, DNS, SMTP, FTP. 2.4 Equipamentos de rede: switches, roteadores, access points e firewalls. 2.5 Conceitos gerais de VPN e segurança de redes."
        },
        {
          "id": "cofen_407_esp_t3",
          "numero": "3",
          "titulo": "Segurança da Informação",
          "subitens": "3.1 Princípios fundamentais: confidencialidade, integridade, disponibilidade e autenticidade. 3.2 Políticas de segurança da informação. 3.3 Conceitos básicos de criptografia, certificados digitais e assinatura digital. 3.4 Principais ameaças, ataques e vulnerabilidades. 3.5 Backup, restauração e continuidade de negócios. 3.6 Noções sobre normas ISO/IEC 27001 e 27002."
        },
        {
          "id": "cofen_407_esp_t4",
          "numero": "4",
          "titulo": "Banco de Dados",
          "subitens": "4.1 Conceitos básicos de bancos de dados. 4.2 Modelagem relacional e normalização. 4.3 Linguagem SQL: manipulação e consulta de dados. 4.4 Noções de administração básica de SGBDs."
        },
        {
          "id": "cofen_407_esp_t5",
          "numero": "5",
          "titulo": "Engenharia de Software",
          "subitens": "5.1 Conceitos fundamentais de engenharia de software. 5.2 Ciclos de vida e modelos de desenvolvimento. 5.3 Metodologias ágeis: Scrum e Kanban. 5.4 Conceitos gerais de UML (casos de uso, classes, atividades). 5.5 Princípios básicos de teste de software."
        },
        {
          "id": "cofen_407_esp_t6",
          "numero": "6",
          "titulo": "Governança e Gestão de TI",
          "subitens": "6.1 Conceitos gerais de ITIL e COBIT. 6.2 Gerenciamento de serviços de TI. 6.3 Gestão de riscos. 6.4 Conceitos de SLA e indicadores."
        },
        {
          "id": "cofen_407_esp_t7",
          "numero": "7",
          "titulo": "Legislação e Ética na Administração Pública",
          "subitens": "7.1 Ética no Setor Público: 7.1.1 Conceito de ética na função pública. 7.1.2 Princípios fundamentais da Administração Pública. 7.2 Improbidade Administrativa: 7.2.1 Noções da Lei nº 8.429/1992. 7.3 Processo Administrativo: 7.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 7.4 Transparência e Acesso à Informação: 7.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 7.5 Proteção de Dados Pessoais: 7.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        },
        {
          "id": "cofen_407_esp_t8",
          "numero": "8",
          "titulo": "Governança e Gestão de TIC",
          "subitens": "8.1 Planejamento, acompanhamento e controle de ações de TIC. 8.2 Indicadores, métricas e elaboração de relatórios técnicos. 8.3 Modelos de governança (ITIL, COBIT) – aplicação gerencial. 8.4 Gestão de riscos em TIC."
        },
        {
          "id": "cofen_407_esp_t9",
          "numero": "9",
          "titulo": "Políticas, Normas e Auditorias",
          "subitens": "9.1 Elaboração e manutenção de políticas, padrões e normas técnicas. 9.2 Auditoria de TIC – princípios gerais. 9.3 Gestão de riscos, controles internos e conformidade. 9.4 Segurança da informação aplicada a processos institucionais."
        },
        {
          "id": "cofen_407_esp_t10",
          "numero": "10",
          "titulo": "Gestão e Fiscalização de Contratos",
          "subitens": "10.1 Etapas da contratação de soluções de TIC (planejamento, seleção e gestão). 10.2 Elaboração e análise de Termo de Referência. 10.3 Fiscalização técnica e administrativa de contratos. 10.4 Indicadores de desempenho e SLA em contratos."
        },
        {
          "id": "cofen_407_esp_t11",
          "numero": "11",
          "titulo": "Atendimento Técnico Estratégico",
          "subitens": "11.1 Suporte avançado a sistemas e serviços do Sistema Cofen/Corens. 11.2 Respostas técnicas, pareceres, manifestações e notas técnicas. 11.3 Atendimento a demandas externas (inclusive Ouvidoria). 11.4 Condução de treinamentos e palestras."
        },
        {
          "id": "cofen_407_esp_t12",
          "numero": "12",
          "titulo": "Infraestrutura de TIC",
          "subitens": "12.1 Acompanhamento da operação de servidores, redes, serviços e segurança. 12.2 Gestão de ativos de TIC. 12.3 Preservação e integridade das informações institucionais. 12.4 Acompanhamento de processos de implantação e migração de sistemas."
        }
      ]
    },
    {
      "codigo": "408",
      "id": "cofen_2026_408",
      "nome": "Arquivista",
      "requisitos": "Arquivologia",
      "vagas": "1 + 39 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_408_esp_t1",
          "numero": "1",
          "titulo": "Conhecimentos Técnicos",
          "subitens": "1.1 Arquivística. 1.1.1 Princípios e conceitos. 1.2 Políticas públicas de arquivo, legislação arquivística. 1.3 Normas nacionais e internacionais de arquivo. 1.4 Sistemas e redes de arquivo. 1.5 Gestão de documentos: implementação de programas de gestão de documentos. 1.6 Diagnóstico da situação arquivística e realidade arquivística brasileira. 1.7 Protocolo. 1.7.1 Recebimento, registro, distribuição, tramitação e expedição de documentos. 1.8 Funções arquivísticas. 1.8.1 Criação de documentos. 1.8.2 Aquisição de documentos. 1.8.3 Classificação de documentos. 1.8.4 Avaliação de documentos. 1.8.5 Difusão de documentos. 1.8.6 Arranjo e Descrição arquivística. 1.8.7 Preservação de documentos. 1.9 Análise tipológica dos documentos de arquivo. 1.10 Políticas de acesso aos documentos de arquivo. 1.11 Sistemas informatizados de gestão arquivística de documentos. 1.11.1 Documentos digitais. 1.11.2 Requisitos de sistemas de informação. 1.11.3 Metadados. 1.12 Microfilmagem de documentos de arquivo. 1.13 Terminologia arquivística. 1.14 Direito à informação: transparência pública e acesso à informação. 1.15 Princípios éticos do arquivista. 1.16 Estudos de usuários. 1.17 Preservação digital de documentos. 1.17.1 Curadoria digital. 1.18 Dados de pesquisa. 1.19 Repositórios digitais. 1.20 Cadeia de custódia. 1.21 Tabela de temporalidade. 1.22 Classificação de documentos. 1.23. Modelo Hipátia de Preservação Digital."
        },
        {
          "id": "cofen_408_esp_t2",
          "numero": "2",
          "titulo": "Legislação e Ética na Administração Pública",
          "subitens": "2.1 Ética no Setor Público: 2.1.1 Conceito de ética na função pública. 2.1.2 Princípios fundamentais da Administração Pública. 2.2 Improbidade Administrativa: 2.2.1 Noções da Lei nº 8.429/1992. 2.3 Processo Administrativo: 2.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 2.4 Transparência e Acesso à Informação: 2.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 2.5 Proteção de Dados Pessoais: 2.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        }
      ]
    },
    {
      "codigo": "409",
      "id": "cofen_2026_409",
      "nome": "Bibliotecário",
      "requisitos": "Biblioteconomia (CRB)",
      "vagas": "30 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_409_esp_t1",
          "numero": "1",
          "titulo": "Conhecimentos Técnicos",
          "subitens": "1.1 Documentação. 1.1.1 Conceitos básicos e finalidades da documentação geral. 1.2 Biblioteconomia e Ciência da Informação. 1.2.1 Conceitos básicos e finalidades. 1.2.2 As cinco leis da Biblioteconomia. 1.3 Identificação e conhecimento das principais fontes jurídicas de informação. 1.4 Normas técnicas para a área de documentação. 1.4.1 Referência bibliográfica (de acordo com a norma da ABNT NBR 6023), resumos, abreviação de títulos de periódicos e publicações seriadas, sumário, preparação de índices de publicações, preparação de guias de bibliotecas, centros de informação e de documentação. 1.5 Indexação. 1.5.1 Conceito, definição, linguagens, descritores, processos e tipos de indexação. 1.6 Resumos e índices. 1.6.1 Tipos e funções. 1.7 Classificação Decimal Universal (CDU). 1.7.1 Sistemas de classificação. 1.7.2 Estrutura, princípios e índices principais e emprego das tabelas auxiliares da CDU. 1.8 Catalogação. 1.8.1 Catalogação descritiva, entradas e cabeçalhos; catalogação de multimeios. 1.9 Catálogos. 1.9.1 Tipos e funções. 1.9.2 Dados bibliográficos e de autoridade em AACR2r, RDA e MARC21. 1.10 Organização e administração de bibliotecas. 1.10.1 Princípios e funções administrativos em bibliotecas, estrutura organizacional, as grandes áreas funcionais da biblioteca, marketing da informação, divulgação e promoção. 1.11 Centros de documentação e serviços de informação. 1.11.1 Planejamento, redes e sistemas. 1.12 Metabuscador. 1.13 Metadados. 1.13.1 Padrões de metadados. 1.13.2 Conversão de dados. 1.13.3 Interoperabilidade de dados bibliográficos e de autoridade. 1.14 Tesauro. 1.14.1 princípios e métodos. 1.15 Desenvolvimento de coleções. 1.15.1 Políticas de seleção e de aquisição, avaliação de coleções, fontes de informação. 1.16 Serviço de referência. 1.16.1 Organização de serviços de notificação corrente (serviços de alerta), disseminação seletiva da informação (DSI) — estratégia de busca de informação, planejamento e etapas de elaboração, atendimento ao usuário. 1.16.2 Banco de dados e base de dados. 1.17 Estudos de usuários. 1.18 Automação. 1.18.1 Formato de intercâmbio, formato US MARC, linguagem de marcação XML. 1.18.2 Planejamento da automação. 1.18.3 Sistemas de informação automatizados nacionais e internacionais. 1.18.4 Catálogos online (OPACs). 1.18.5 Gerenciamento de documentos eletrônicos. 1.19 Bibliografia. 1.19.1 Conceituação, teorias, classificação, histórico e objetivos. 1.20 Bibliotecas digitais. 1.20.1 Conceitos e definições; requisitos para implementação; softwares para construção. 1.21 Segurança da informação. 1.22 Web Semântica e Ontologias. 1.23 Catálogo Pinakes. 1.24 BRCris. 1.25 Biblioteca Digital Brasileira de Teses e Dissertações (BDTD). 1.26 Repositórios institucionais. 1.27 Rede Cariniana."
        },
        {
          "id": "cofen_409_esp_t2",
          "numero": "2",
          "titulo": "Legislação e Ética na Administração Pública",
          "subitens": "2.1 Ética no Setor Público: 2.1.1 Conceito de ética na função pública. 2.1.2 Princípios fundamentais da Administração Pública. 2.2 Improbidade Administrativa: 2.2.1 Noções da Lei nº 8.429/1992. 2.3 Processo Administrativo: 2.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 2.4 Transparência e Acesso à Informação: 2.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 2.5 Proteção de Dados Pessoais: 2.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        }
      ]
    },
    {
      "codigo": "410",
      "id": "cofen_2026_410",
      "nome": "Contador",
      "requisitos": "Ciências Contábeis (CRC)",
      "vagas": "30 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_410_esp_t1",
          "numero": "1",
          "titulo": "Legislação",
          "subitens": "1.1 Constituição Federal de 1988 (Título I; Título II - Capítulo I; Título III - Capítulo VII; Título IV - Capítulo I - Seção IX). 1.2 Lei nº 10.303/2001. 1.3 Lei Complementar nº 123/2006. 1.4 Lei nº 14.133/2021. 1.5 Lei nº 4.320/1964. 1.6 Lei Complementar nº 101/2000. 1.7 Lei nº 11.941/2009."
        },
        {
          "id": "cofen_410_esp_t2",
          "numero": "2",
          "titulo": "Orçamento e Contabilidade Pública",
          "subitens": "2.1 Orçamento público: 2.1.1 Disposições constitucionais. 2.1.2 Plano Plurianual. 2.1.3 Lei de Diretrizes Orçamentárias. 2.1.4 Lei Orçamentária Anual. 2.1.5 Princípios orçamentários. 2.1.6 Processo orçamentário. 2.1.7 Estrutura do orçamento público. 2.1.8 Classificação funcional programática. 2.2 Receita e despesa pública: 2.2.1 Disposições constitucionais. 2.2.2 Classificação. 2.2.3 Estágios. 2.3 Programação e execução orçamentária e financeira: 2.3.1 Exercício financeiro. 2.3.2 Créditos adicionais. 2.3.3 Restos a pagar. 2.3.4 Despesas de exercícios anteriores. 2.3.5 Descentralização de créditos. 2.3.6 Suprimento de fundos. 2.4 Sistema orçamentário, financeiro, patrimonial e de compensação. 2.5 Regimes Contábeis. 2.6 Balanços orçamentário, financeiro e patrimonial e demonstração das variações patrimoniais. 2.7 Manual de Contabilidade Aplicada ao Setor Público (MCASP). 2.8 Plano de Contas Aplicado ao Setor Público (PCASP)."
        },
        {
          "id": "cofen_410_esp_t3",
          "numero": "3",
          "titulo": "Contabilidade Geral",
          "subitens": "3.1 Campo de Atuação. Objeto da Contabilidade. 3.2 O patrimônio: estrutura e variação. 3.3 Registros contábeis. 3.4 Despesas e receitas. 3.5 Plano de contas. 3.6 Operações com mercadorias e controle de estoques. 3.7 Demonstrações Contábeis: 3.7.1 Balanço Patrimonial. 3.7.2 Demonstração de resultados do exercício. 3.7.3 Demonstração dos fluxos de caixa. 3.7.4 Demonstração das Mutações do Patrimônio Líquido. 3.7.5 Demonstração do Valor Adicionado. 3.8 Análise de Demonstrações Financeiras: 3.8.1 Conceitos e objetivos da análise de demonstrações financeiras. 3.8.2 Análise vertical e horizontal. 3.8.3 Análise por meio de índices: 3.8.3.1 Índices de liquidez. 3.8.3.2 Índices de endividamento. 3.8.3.3 Índices de rentabilidade. 3.8.3.4 Índices de atividade. 3.9 Adequação às IFRS. 3.10 Pronunciamentos do CPC."
        },
        {
          "id": "cofen_410_esp_t4",
          "numero": "4",
          "titulo": "Auditoria",
          "subitens": "4.1 Conceitos, princípios, origens e classificações. 4.2 Papéis de trabalho: 4.2.1 Conceito. 4.2.2 Pontos essenciais dos papéis de trabalho. 4.2.3 Técnicas de elaboração e arquivamento dos papéis de trabalho. 4.3 Testes e procedimentos de auditoria: conceito, modalidades e execução. 4.4 Revisão analítica: conceito e modalidades. 4.5 Tipos de auditoria. 4.6 Normas Brasileiras para o Exercício da Auditoria Interna (CFC). 4.7 Técnicas de auditoria analítica. 4.8 Auditoria interna: conceitos, objetivos, riscos e controles internos."
        },
        {
          "id": "cofen_410_esp_t5",
          "numero": "5",
          "titulo": "Legislação Tributária e Obrigações Fiscais",
          "subitens": "5.1 Legislação tributária aplicável às autarquias federais. 5.2 Tributos federais, estaduais e municipais. 5.3 Retenções na fonte: 5.3.1 IRRF - Imposto de Renda Retido na Fonte. 5.3.2 INSS - Contribuição Previdenciária. 5.3.3 PIS/COFINS/CSLL - Lei nº 10.833/2003. 5.3.4 ISS - Imposto Sobre Serviços. 5.4 Obrigações acessórias: 5.4.1 DCTF: obrigações relativas aos períodos anteriores à sua substituição pela DCTFWeb. 5.4.2 Declaração de Débitos e Créditos Tributários Federais (DCTFWeb) e Módulo de Inclusão de Tributos (MIT). 5.4.3 DIRF: substituição pelo eSocial e pela EFD-Reinf. 5.4.4 Escrituração Fiscal Digital de Retenções e Outras Informações Fiscais (EFD-Reinf)."
        },
        {
          "id": "cofen_410_esp_t6",
          "numero": "6",
          "titulo": "Elaboração e Análise de Relatórios Contábeis e Financeiros",
          "subitens": "6.1 Técnicas de elaboração de relatórios gerenciais. 6.2 Interpretação e análise crítica de demonstrações contábeis. 6.3 Análise de tendências e projeções financeiras. 6.4 Avaliação de desempenho financeiro. 6.5 Técnicas de apresentação de informações financeiras. 6.6 Relatórios para tomada de decisão."
        },
        {
          "id": "cofen_410_esp_t7",
          "numero": "7",
          "titulo": "Contabilidade e Governança em Conselhos Profissionais",
          "subitens": "7.1 Estrutura e funcionamento contábil de conselhos profissionais. 7.2 Prestação de contas em conselhos profissionais. 7.3 Normas específicas de contabilidade aplicáveis aos conselhos profissionais. 7.4 Transparência e accountability em conselhos profissionais. 7.5 Elaboração e publicação de balanços e demonstrativos financeiros em conselhos profissionais. 7.6 Controle e fiscalização pelo Tribunal de Contas da União."
        },
        {
          "id": "cofen_410_esp_t8",
          "numero": "8",
          "titulo": "Conciliação e Análise de Contas",
          "subitens": "8.1 Técnicas de conciliação contábil. 8.2 Análise de inconsistências contábeis. 8.3 Conciliação de contas bancárias e contábeis. 8.4 Metodologias de análise e solução de problemas contábeis. 8.5 Elaboração de relatórios de conciliação e análise."
        },
        {
          "id": "cofen_410_esp_t9",
          "numero": "9",
          "titulo": "Folha de Pagamento e Encargos Sociais",
          "subitens": "9.1 Contabilização da folha de pagamento. 9.2 Provisões de férias e 13º salário. 9.3 Cálculo e contabilização de encargos sociais. 9.4 Obrigações acessórias relacionadas à folha de pagamento. 9.5 eSocial - Sistema de Escrituração Digital das Obrigações Fiscais, Previdenciárias e Trabalhistas."
        },
        {
          "id": "cofen_410_esp_t10",
          "numero": "10",
          "titulo": "Legislação e ética na administração pública",
          "subitens": "10.1 Ética no Setor Público: 10.1.1 Conceito de ética na função pública. 10.1.2 Princípios fundamentais da Administração Pública. 10.2 Improbidade Administrativa: 10.2.1 Noções da Lei nº 8.429/1992. 10.3 Processo Administrativo: 10.3.1 Noções da Lei nº 9.784/1999, direitos e deveres. 10.4 Transparência e Acesso à Informação: 10.4.1 Noções da Lei nº 12.527/2011 e seus decretos. 10.5 Proteção de Dados Pessoais: 10.5.1 Noções da Lei Geral de Proteção de Dados - LGPD (Lei nº 13.709/2018)."
        }
      ]
    },
    {
      "codigo": "411",
      "id": "cofen_2026_411",
      "nome": "Enfermeiro",
      "requisitos": "Enfermagem (COREN) + 6 meses exp.",
      "vagas": "1 + 39 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_411_esp_t1",
          "numero": "1",
          "titulo": "Legislação Aplicada à Enfermagem e ao Sistema Cofen/Conselhos Regionais de Enfermagem",
          "subitens": "1.1 Decreto-Lei nº 2.848/1940. 1.2 Lei nº 2.604/1955. 1.3 Lei nº 5.172/1966 (art. 78 e parágrafo único). 1.4 Lei nº 5.905/1973. 1.5 Lei nº 7.498/1986. 1.6 Lei nº 8.080/1990. 1.7 Lei nº 8.142/1990. 1.8 Lei nº 8.429/1992. 1.9 Lei nº 9.784/1999. 1.10 Lei nº 11.788/2008. 1.11 Lei nº 12.514/2011. 1.12 Lei nº 15.378/2026. 1.13 Decreto nº 94.406/1987. 1.14 Resolução da Diretoria Colegiada (RDC) nº 63/2011 - Anvisa. 1.15 Portaria GM/MS nº 11.527/2026."
        },
        {
          "id": "cofen_411_esp_t2",
          "numero": "2",
          "titulo": "Normas do Sistema Cofen/Conselhos Regionais de Enfermagem",
          "subitens": "2.1 Resoluções COFEN: nº 139/1992; nº 195/1997; nº 514/2016; nº 545/2017; nº 554/2017; nº 564/2017; nº 568/2018; nº 581/2018; nº 598/2018; nº 606/2019; nº 609/2019; nº 645/2020; nº 649/2020; nº 665/2021; nº 696/2022; nº 706/2022; nº 707/2022; nº 716/2023; nº 717/2023; nº 721/2023; nº 736/2024; nº 744/2024; nº 754/2024; nº 758/2024; nº 768/2024; nº 769/2024; nº 774/2025; nº 778/2025; nº 782/2025; nº 785/2025; nº 796/2025; nº 798/2025. 2.2 Decisões COFEN: nº 100/2024 e nº 103/2025. 2.3 Pareceres Normativos COFEN: nº 003/2017 e nº 01/2024. 2.4 Consideram-se incluídas, quando aplicável, as alterações das normas relacionadas e as normas que as substituam ou sucedam, desde que tenham entrado em vigor até a data de publicação deste edital."
        },
        {
          "id": "cofen_411_esp_t3",
          "numero": "3",
          "titulo": "Conhecimentos Técnicos e Institucionais Aplicados à Enfermagem",
          "subitens": "3.1 Ética, responsabilidade e exercício profissional da Enfermagem. 3.2 Sistema Único de Saúde e políticas públicas de saúde. 3.3 Regularidade inscricional. 3.4 Registro de empresa. 3.5 Anotação de Responsabilidade Técnica. 3.6 Consultório de Enfermagem. 3.7 Processo de Enfermagem. 3.8 Registros de Enfermagem. 3.9 Segurança do paciente. 3.10 Planejamento da força de trabalho de Enfermagem. 3.11 Educação permanente em saúde. 3.12 Portal da Transparência. 3.13 Fundamentos técnicos de Enfermagem. 3.14 Biossegurança. 3.15 Assistência de Enfermagem nos diferentes níveis de atenção à saúde. 3.16 Assistência de Enfermagem nos ciclos de vida. 3.17 Controle de infecção relacionado à assistência à saúde. 3.18 Gerenciamento de resíduos de serviços de saúde. 3.19 Segurança e Saúde no Trabalho em Serviços de Saúde. 3.20 Gerenciamento de Enfermagem em serviços de saúde. 3.21 Política Nacional de Atenção Básica. 3.22 Política Nacional de Imunização. 3.23 Política Nacional de Vigilância em Saúde. 3.24 Rede de Atenção Psicossocial. 3.25 Rede de Urgência e Emergência. 3.26 Política Nacional de Atenção Integral à Saúde da Mulher. 3.27 Política Nacional de Humanização. 3.28 Elaboração de protocolos, fluxos, relatórios, pareceres e documentos técnicos. 3.29 Compliance e governança no setor público. 3.30 Atendimento técnico a demandas de Ouvidoria."
        }
      ]
    },
    {
      "codigo": "412",
      "id": "cofen_2026_412",
      "nome": "Enfermeiro Fiscal",
      "requisitos": "Enfermagem (COREN) + 3 anos + CNH B",
      "vagas": "1 + 39 CR",
      "isTI": false,
      "especificosTopicos": [
        {
          "id": "cofen_412_esp_t1",
          "numero": "1",
          "titulo": "Legislação Aplicada à Enfermagem e ao Sistema Cofen/Conselhos Regionais de Enfermagem",
          "subitens": "1.1 Decreto-Lei nº 2.848/1940. 1.2 Lei nº 2.604/1955. 1.3 Lei nº 5.172/1966 (art. 78 e parágrafo único). 1.4 Lei nº 5.905/1973. 1.5 Lei nº 7.498/1986. 1.6 Lei nº 8.080/1990. 1.7 Lei nº 8.142/1990. 1.8 Lei nº 11.788/2008. 1.9 Lei nº 15.378/2026. 1.10 Decreto nº 94.406/1987. 1.11 Resolução da Diretoria Colegiada (RDC) nº 63/2011. 1.12 Portaria GM/MS nº 2.048/2002. 1.13 Portaria GM/MS nº 11.527/2026. 1.14 Norma Regulamentadora nº 04 (NR-4). 1.15 Norma Regulamentadora nº 32 (NR-32)."
        },
        {
          "id": "cofen_412_esp_t2",
          "numero": "2",
          "titulo": "Normas do Sistema Cofen/Conselhos Regionais de Enfermagem",
          "subitens": "2.1 Resoluções COFEN: nº 139/1992; nº 195/1997; nº 514/2016; nº 545/2017; nº 554/2017; nº 564/2017; nº 565/2017; nº 568/2018; nº 581/2018; nº 606/2019; nº 609/2019; nº 645/2020; nº 649/2020; nº 653/2020; nº 665/2021; nº 679/2021; nº 696/2022; nº 706/2022; nº 707/2022; nº 716/2023; nº 717/2023; nº 721/2023; nº 725/2023 e anexo; nº 736/2024; nº 739/2024; nº 744/2024; nº 754/2024; nº 755/2024; nº 758/2024; nº 768/2024; nº 769/2024; nº 774/2025; nº 778/2025; nº 782/2025; nº 784/2025; nº 785/2025; nº 798/2025; nº 801/2026; nº 805/2026; nº 810/2026. 2.2 Decisões COFEN: nº 100/2024; nº 101/2024; nº 103/2025. 2.3 Pareceres Normativos COFEN: nº 003/2017 e nº 01/2024. 2.4 Consideram-se incluídas, quando aplicável, as alterações das normas relacionadas e as normas que as substituam ou sucedam, desde que tenham entrado em vigor até a data de publicação deste edital."
        },
        {
          "id": "cofen_412_esp_t3",
          "numero": "3",
          "titulo": "Conhecimentos Técnicos e Institucionais Aplicados à Fiscalização de Enfermagem",
          "subitens": "3.1 Ética, responsabilidade e exercício profissional da Enfermagem. 3.2 Fiscalização do exercício profissional da Enfermagem. 3.3 Sistema Único de Saúde e políticas públicas de saúde. 3.4 Força Nacional de Fiscalização e Ações Estratégicas. 3.5 Regularidade inscricional. 3.6 Registro de empresa. 3.7 Anotação de Responsabilidade Técnica. 3.8 Consultório de Enfermagem. 3.9 Processo de Enfermagem. 3.10 Registros de Enfermagem. 3.11 Segurança do paciente. 3.12 Planejamento da força de trabalho. 3.13 Educação corporativa aplicada à fiscalização profissional. 3.14 Portal da Transparência. 3.15 Fundamentos técnicos da Enfermagem. 3.16 Biossegurança. 3.17 Assistência de Enfermagem nos diferentes níveis de atenção à saúde. 3.18 Assistência de Enfermagem nos ciclos de vida. 3.19 Controle de infecção relacionada à assistência à saúde. 3.20 Gerenciamento de resíduos de serviços de saúde. 3.21 Segurança e Saúde no Trabalho em Serviços de Saúde. 3.22 Gerenciamento de Enfermagem em serviços de saúde. 3.23 Política Nacional de Atenção Básica. 3.24 Política Nacional de Imunização. 3.25 Política Nacional de Vigilância em Saúde. 3.26 Rede de Atenção Psicossocial. 3.27 Rede de Urgência e Emergência. 3.28 Política Nacional de Atenção Integral à Saúde da Mulher. 3.29 Política Nacional de Humanização. 3.30 Elaboração de protocolos, fluxos, relatórios, pareceres e documentos técnicos. 3.31 Compliance e governança no setor público. 3.32 Atendimento técnico a demandas de Ouvidoria relacionadas à área de atuação. Dr. MANOEL CARLOS NERI DA SILVA Presidente"
        }
      ]
    }
  ]
};

  const CRONOGRAMA = [
    { ordem: 1, evento: "Publicação do Edital Normativo nº 1/2026", data: "25/11/2026" },
    { ordem: 4, evento: "Solicitação de isenção da taxa (CadÚnico / Doador de Medula)", data: "26 e 27/11/2026" },
    { ordem: 8, evento: "Período de inscrições (www.quadrix.org.br/login) — Taxa R$ 100,00", data: "26/11/2026 a 11/01/2027" },
    { ordem: 11, evento: "Último dia para pagamento do boleto / PIX", data: "12/01/2027" },
    { ordem: 14, evento: "Resultado definitivo das inscrições homologadas", data: "03/02/2027" },
    { ordem: 16, evento: "Divulgação dos locais e horários de prova (Brasília/DF)", data: "23/02/2027" },
    { ordem: 17, evento: "APLICAÇÃO DAS PROVAS OBJETIVA (120 itens C/E) E DISCURSIVA (Tarde)", data: "28/02/2027", destaque: true },
    { ordem: 18, evento: "Gabarito preliminar da objetiva e padrão preliminar da discursiva", data: "01/03/2027" },
    { ordem: 20, evento: "Gabarito definitivo e resultado preliminar da prova objetiva", data: "23/03/2027" },
    { ordem: 23, evento: "Resultado definitivo da objetiva e convocados para correção da discursiva", data: "02/04/2027" },
    { ordem: 24, evento: "Resultado preliminar da prova discursiva", data: "12/04/2027" }
  ];

  function buildEditalForRole(role) {
    const disciplinas = [
      {
        id: "cofen_bas_port",
        codigo: "BAS-01",
        nome: "Língua Portuguesa",
        categoria: "basicos",
        questoesProva: 16,
        peso: 1,
        pontosProva: 16.0,
        prioridade: "Alta (Bloco Básicos — mín. 10/40 pts)",
        cor: "#3b82f6",
        descricao: "Compreensão textual, análise linguística, coesão, sintaxe, concordância, regência, crase, pontuação, reescrita e redação oficial.",
        topicos: RAW.basicos.portugues
      },
      {
        id: "cofen_bas_rlm",
        codigo: "BAS-02",
        nome: "Raciocínio Lógico e Matemática",
        categoria: "basicos",
        questoesProva: 12,
        peso: 1,
        pontosProva: 12.0,
        prioridade: "Média (Bloco Básicos)",
        cor: "#f59e0b",
        descricao: "Matemática básica, combinatória, probabilidade, lógica proposicional, estatística básica e matemática financeira.",
        topicos: RAW.basicos.rlm
      },
      role.isTI
        ? {
            id: "cofen_bas_ingles",
            codigo: "BAS-03",
            nome: "Língua Inglesa (Exclusivo TI)",
            categoria: "basicos",
            questoesProva: 12,
            peso: 1,
            pontosProva: 12.0,
            prioridade: "Média (Substitui Informática nos cargos de TI)",
            cor: "#06b6d4",
            descricao: "Compreensão de textos técnicos de TI, vocabulário profissional, gramática aplicada e manuais técnicos em inglês.",
            topicos: RAW.basicos.ingles
          }
        : {
            id: "cofen_bas_info",
            codigo: "BAS-03",
            nome: "Noções de Informática",
            categoria: "basicos",
            questoesProva: 12,
            peso: 1,
            pontosProva: 12.0,
            prioridade: "Média (Bloco Básicos)",
            cor: "#06b6d4",
            descricao: "Hardware/software, Microsoft 365, Google Workspace, Windows 10/11, redes, nuvem, segurança e noções de IA.",
            topicos: RAW.basicos.informatica
          },
      {
        id: "cofen_comp_leg",
        codigo: "COMP-01",
        nome: "Legislação Específica (COFEN, Lei 14.133, LGPD, LIA)",
        categoria: "basicos",
        questoesProva: 12,
        peso: 1,
        pontosProva: 12.0,
        prioridade: "Alta (Bloco Complementares — mín. 8/30 pts)",
        cor: "#8b5cf6",
        descricao: "CF/88 (art. 5º e 196–200), Lei 5.905/73, Dec. 94.406/87, Lei 14.133/21, Res. COFEN 507/16, 726/23 e 751/24, LGPD, Lei 9.784/99, LIA e Anticorrupção.",
        topicos: RAW.complementares.legislacao
      },
      {
        id: "cofen_comp_const",
        codigo: "COMP-02",
        nome: "Noções de Direito Constitucional",
        categoria: "basicos",
        questoesProva: 9,
        peso: 1,
        pontosProva: 9.0,
        prioridade: "Média (Bloco Complementares)",
        cor: "#10b981",
        descricao: "Supremacia constitucional, princípios, direitos fundamentais, organização do Estado e Poderes, controle e Saúde na Ordem Social.",
        topicos: RAW.complementares.constitucional
      },
      {
        id: "cofen_comp_adm",
        codigo: "COMP-03",
        nome: "Noções de Direito Administrativo",
        categoria: "basicos",
        questoesProva: 9,
        peso: 1,
        pontosProva: 9.0,
        prioridade: "Alta (Conselhos Profissionais & Empregado Público)",
        cor: "#ec4899",
        descricao: "Princípios, organização administrativa, Conselhos de Fiscalização Profissional, atos, poderes, empregado público e PAD.",
        topicos: RAW.complementares.administrativo
      },
      {
        id: `cofen_${role.codigo}_esp`,
        codigo: `ESP-${role.codigo}`,
        nome: `Conhecimentos Específicos — ${role.nome}`,
        categoria: "especificos",
        questoesProva: 50,
        peso: 1,
        pontosProva: 50.0,
        prioridade: "Máxima (50 itens — mín. 12 pts + tema da Discursiva!)",
        cor: "#6366f1",
        descricao: `Conteúdo específico do Cargo ${role.codigo} (${role.nome}) • Requisitos: ${role.requisitos}.`,
        topicos: role.especificosTopicos
      }
    ];

    return {
      metadata: {
        concurso: `COFEN 2026 — ${role.nome}`,
        edital: "Edital Nº 1, de 25 de novembro de 2026 (COFEN)",
        banca: "Instituto Quadrix",
        cargo: `Código ${role.codigo}: ${role.nome} (${role.vagas} • ${role.requisitos})`,
        remuneracao: {
          remuneracaoBrutaEdital: 18950.52,
          totalMensal: 18950.52,
          cargaHorariaSemanal: 40
        },
        provas: {
          dataProva: "2027-02-28",
          inscricoesInicio: "2026-11-26",
          inscricoesFim: "2027-01-11",
          taxaInscricao: 100.00,
          objetiva: {
            turno: "Tarde",
            duracaoHoras: 4.0,
            tipo: "Certo ou Errado (120 itens — 1 errada anula 1 certa)",
            totalQuestoes: 120,
            totalPontos: 120.0,
            corteMinimoGeral: 34.0,
            corteMinimoBasicos: 10.0,
            corteMinimoComplementares: 8.0,
            corteMinimoEspecificos: 12.0,
            regraPortugues: "Mínimos: 10 pts Básicos, 8 pts Complementares, 12 pts Específicos e 34 pts no total"
          },
          discursiva: {
            turno: "Tarde (junto com a Objetiva)",
            duracaoHoras: 4.0,
            totalPontos: 10.0,
            dissertacao: {
              tema: `Conhecimentos Específicos de ${role.nome}`,
              maxLinhas: 30,
              valorMaximo: 10.0,
              notaMinima: 5.0,
              formula: "NPD = NC - (NE ÷ TL)"
            }
          }
        }
      },
      cronograma: CRONOGRAMA,
      disciplinas
    };
  }

  function buildTracks() {
    return RAW.roles.map(role => {
      const enabledSharedPacks = ["pack_portugues", "pack_lei_14133", "pack_lai_lgpd"];
      const packMapping = {
        pack_portugues: "cofen_bas_port",
        pack_lei_14133: "cofen_comp_leg",
        pack_lai_lgpd: "cofen_comp_leg"
      };

      if (role.isTI) {
        enabledSharedPacks.push("pack_ti_dev");
        packMapping.pack_ti_dev = `cofen_${role.codigo}_esp`;
      } else {
        enabledSharedPacks.push("pack_informatica");
        packMapping.pack_informatica = "cofen_bas_info";
      }

      return {
        id: role.id,
        groupId: "cofen_2026",
        groupName: "COFEN 2026 (Instituto Quadrix)",
        roleCode: role.codigo,
        roleName: role.nome,
        roleVagas: role.vagas,
        builtin: true,
        badge: "COF",
        shortName: `COFEN — ${role.nome}`,
        subtitle: `Cód. ${role.codigo} • ${role.vagas} • Quadrix (C/E)`,
        description: `Edital Nº 1/2026 COFEN (${role.nome} — R$ 18.950,52). 120 itens Certo/Errado + Discursiva em 28/02/2027.`,
        edital: buildEditalForRole(role),
        enabledSharedPacks,
        packMapping,
        lessons: {},
        discursive: {
          temasDissertacao: [
            {
              id: `COFEN-DISS-${role.codigo}`,
              titulo: `Estudo de Caso / Dissertação — ${role.nome} (COFEN 2026)`,
              categoria: `Conhecimentos Específicos • Cód. ${role.codigo}`,
              maxLinhas: 30,
              valorMaximo: 10.0,
              proposta: `A prova discursiva do COFEN 2026 (Instituto Quadrix) vale 10,00 pontos (mínimo 5,00), exige entre 20 e 30 linhas e cobra tema diretamente ligado aos Conhecimentos Específicos de ${role.nome}.

Proposta de treino: Redija um texto dissertativo-argumentativo abordando o papel institucional do Sistema Cofen/Conselhos Regionais de Enfermagem e os desafios técnicos da atuação do(a) ${role.nome} à luz da governança pública, da legalidade (Lei nº 14.133/2021 e LGPD) e da eficiência administrativa.`,
              espelhoNotaMaxima: "1) Introdução contextualizando a natureza autárquica sui generis do COFEN (Lei nº 5.905/1973); 2) Desenvolvimento articulando atribuições técnicas do cargo com governança, LGPD e controle pelo TCU; 3) Conclusão propositiva respeitando 20 a 30 linhas.",
              pontosChaveAvaliacao: [
                "Extensão obrigatória entre 20 e 30 linhas",
                "Domínio técnico dos Conhecimentos Específicos do cargo",
                "Articulação com normas do Sistema Cofen/Corens e Administração Pública",
                "Coesão, coerência e norma culta da Língua Portuguesa"
              ]
            }
          ],
          questoesTecnicasDiscursivas: [],
          flashcards: []
        }
      };
    });
  }

  window.COFEN_2026_DATA = {
    roles: RAW.roles.map(r => ({ codigo: r.codigo, id: r.id, nome: r.nome, vagas: r.vagas, requisitos: r.requisitos, isTI: r.isTI })),
    buildTracks
  };
})();
