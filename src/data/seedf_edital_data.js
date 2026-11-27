// ============================================================================
// SEEDF 2026/2027 — PRÉ-EDITAL MULTI-CARGO (INSTITUTO QUADRIX)
// Cruzamento: Edital nº 23/2016 (CESPE) + Edital nº 31/2022 (Quadrix)
// + Termo de Referência nº 3/2026 (DODF nº 199, 26/10/2026 — 10.604 vagas)
// + Atualizações legislativas 2023–2026.
// Editável pelo usuário sem perder progresso via "Atualizar Edital".
// ============================================================================
(function () {
  "use strict";

  const CRONOGRAMA = [
    { ordem: "1", evento: "Autorização do concurso (Portaria SEEC nº 825/2025 — 10.604 vagas)", data: "2025", destaque: false },
    { ordem: "2", evento: "Contratação do Instituto Quadrix (DODF nº 199 — Contrato nº 146/2026)", data: "26/10/2026", destaque: true },
    { ordem: "3", evento: "Publicação prevista do Edital normativo", data: "Em breve (use 'Atualizar Edital' quando sair)", destaque: true },
    { ordem: "4", evento: "Provas Objetiva (120 itens C/E) + Discursiva (Estudo de Caso)", data: "A definir no Edital", destaque: false }
  ];

  function buildBasicos() {
    return [
      {
        id: "seedf_bas_port",
        codigo: "BAS-01",
        nome: "Língua Portuguesa",
        categoria: "basicos",
        peso: 1,
        questoesProva: 10,
        pontosProva: 10,
        descricao: "Base comum 2016 + 2022 Quadrix: compreensão textual, coesão, morfossintaxe, crase e reescrita.",
        topicos: [
          {
            id: "seedf_port_1",
            numero: "1.1",
            titulo: "Compreensão, interpretação e gêneros textuais",
            subitens: "Compreensão e interpretação de textos de gêneros variados; reconhecimento de tipos e gêneros textuais.",
            resumoChave: "Na Quadrix, diferencie inferência válida de extrapolação ou restrição indevida do texto."
          },
          {
            id: "seedf_port_2",
            numero: "1.2",
            titulo: "Ortografia, coesão, tempos verbais e figuras de linguagem",
            subitens: "Ortografia oficial; referenciação, substituição, conectores; emprego de tempos e modos verbais; significação das palavras.",
            resumoChave: "Atenção ao valor semântico de conjunções (concessivas vs. adversativas) e retomada pronominal."
          },
          {
            id: "seedf_port_3",
            numero: "1.3",
            titulo: "Morfossintaxe, pontuação, concordância, regência, crase e reescrita",
            subitens: "Coordenação e subordinação; pontuação; concordância verbal e nominal; regência; crase; colocação pronominal; reescrita.",
            resumoChave: "Reescrita só está certa se mantiver correção gramatical E sentido original simultaneamente."
          }
        ]
      },
      {
        id: "seedf_bas_info",
        codigo: "BAS-02",
        nome: "Tecnologia na Educação e Informática Básica",
        categoria: "basicos",
        peso: 1,
        questoesProva: 7,
        pontosProva: 7,
        descricao: "Base 2022 + tendência 2026 (Lei 14.533/2023 Educação Digital): Google Workspace, Windows, Segurança e Nuvem.",
        topicos: [
          {
            id: "seedf_info_1",
            numero: "2.1",
            titulo: "Plataforma Google Educacional e Produtividade",
            subitens: "Google Sala de Aula (Classroom), Google Documentos, Google Planilhas, Google Drive; edição de textos/planilhas no Windows.",
            resumoChave: "Diferencie permissões de leitura, comentário e edição no Drive e funções básicas de planilhas."
          },
          {
            id: "seedf_info_2",
            numero: "2.2",
            titulo: "Segurança da informação, backup e Internet",
            subitens: "Vírus, ransomware, phishing e pragas virtuais; procedimentos de backup; conceitos de redes, navegadores e gerenciamento de arquivos.",
            resumoChave: "Backup 3-2-1, phishing (engenharia social) e diferença entre vírus, worm e cavalo de troia."
          },
          {
            id: "seedf_info_3",
            numero: "2.3",
            titulo: "Educação Digital e IA na Educação (Previsão 2026)",
            subitens: "Política Nacional de Educação Digital (Lei nº 14.533/2023), cultura digital, LGPD no ambiente escolar e uso ético de ferramentas digitais.",
            resumoChave: "Tendência forte para 2026/2027 com a incorporação da Lei nº 14.533/2023 e proteção de dados de estudantes."
          }
        ]
      },
      {
        id: "seedf_bas_adm",
        codigo: "BAS-03",
        nome: "Direito Administrativo e LC nº 840/2011",
        categoria: "basicos",
        peso: 1,
        questoesProva: 7,
        pontosProva: 7,
        descricao: "Base 2016/2022 + atualização provável da Lei nº 14.133/2021 (Nova Lei de Licitações) e Lei nº 14.230/2021.",
        topicos: [
          {
            id: "seedf_adm_1",
            numero: "3.1",
            titulo: "Princípios, Organização, Agentes e Poderes Administrativos",
            subitens: "LIMPE; administração direta e indireta (autarquias, fundações, EP, SEM); agentes públicos; poderes vinculado, discricionário, hierárquico, disciplinar e de polícia.",
            resumoChave: "Descentralização (criação de entidades) vs. desconcentração (órgãos internos sem personalidade jurídica)."
          },
          {
            id: "seedf_adm_2",
            numero: "3.2",
            titulo: "Atos Administrativos, Controle e Responsabilidade Civil",
            subitens: "Requisitos (COFIFOMOB), atributos (PATI), anulação vs. revogação, controle administrativo/judicial/legislativo e responsabilidade objetiva (art. 37, §6º).",
            resumoChave: "Anulação = ilegalidade (ex tunc); Revogação = conveniência e oportunidade (ex nunc)."
          },
          {
            id: "seedf_adm_3",
            numero: "3.3",
            titulo: "LC nº 840/2011 (Regime Jurídico dos Servidores do DF) e Atualizações",
            subitens: "Títulos I, II, V, VI e VII da LC 840/2011 (cargos, deveres, proibições, penalidades e PAD) + previsão de Lei 14.133/2021 (Licitações) e LAI.",
            resumoChave: "Na LC 840/2011, atenção aos prazos de posse (30d), exercício (5d úteis) e prescrição disciplinar."
          }
        ]
      },
      {
        id: "seedf_bas_df",
        codigo: "BAS-04",
        nome: "Conhecimentos sobre o Distrito Federal e RIDE",
        categoria: "basicos",
        peso: 1,
        questoesProva: 6,
        pontosProva: 6,
        descricao: "Base obrigatória por lei distrital: realidade étnica, social, histórica, geográfica e RIDE (LC nº 94/1998).",
        topicos: [
          {
            id: "seedf_df_1",
            numero: "4.1",
            titulo: "História, Geografia, Cultura e Regiões Administrativas do DF",
            subitens: "Construção de Brasília, Cerrado, hidrografia, perfil socioeconômico das RAs, cultura e patrimônio.",
            resumoChave: "Memorize as bacias hidrográficas do DF, as RAs mais recentes e os eixos de ocupação urbana."
          },
          {
            id: "seedf_df_2",
            numero: "4.2",
            titulo: "RIDE-DF (Lei Complementar nº 94/1998 e alterações)",
            subitens: "Municípios goianos e mineiros integrantes da Região Integrada de Desenvolvimento do DF e Entorno, competências e gestão.",
            resumoChave: "Atenção à lista de municípios ampliada pela LC nº 163/2018 (33 municípios + DF)."
          }
        ]
      }
    ];
  }

  function buildComplementares(isMagisterio) {
    const leg = {
      id: "seedf_comp_leg",
      codigo: "COMP-01",
      nome: "Legislação Educacional e Normas do DF (Atualizada 2026)",
      categoria: "complementares",
      peso: 1,
      questoesProva: isMagisterio ? 20 : 40,
      pontosProva: isMagisterio ? 20 : 40,
      descricao: "CF/88, LDB (c/ Lei 14.945/2024), ECA (c/ Lei 14.811/2024), LBI, LODF, Regimento Escolar, PDE/PNE (Lei 14.934/2024) e Currículo em Movimento.",
      topicos: [
        {
          id: "seedf_leg_1",
          numero: "1.1",
          titulo: "CF/88 (arts. 205–214) e LDB (Lei nº 9.394/1996 + Leis 14.533/2023 e 14.945/2024)",
          subitens: "Princípios do ensino, dever do Estado, gestão democrática, etapas da Educação Básica, Novo Ensino Médio (Lei 14.945/2024 — retorno das 2.400h na FGB) e Educação Digital.",
          resumoChave: "ATUALIZAÇÃO 2026: A Lei 14.945/2024 alterou a LDB para fixar 2.400h mínimas na Formação Geral Básica do Ensino Médio."
        },
        {
          id: "seedf_leg_2",
          numero: "1.2",
          titulo: "ECA (Lei nº 8.069/1990 + Lei nº 14.811/2024) e LBI (Lei nº 13.146/2015)",
          subitens: "Direitos fundamentais, medidas aos pais, Conselho Tutelar, combate ao bullying e cyberbullying (Lei 14.811/2024) e Educação Inclusiva (AEE).",
          resumoChave: "ATUALIZAÇÃO 2026: Bullying e intimidação sistemática passaram a integrar o Código Penal (Lei 14.811/2024), reforçando deveres escolares."
        },
        {
          id: "seedf_leg_3",
          numero: "1.3",
          titulo: "Normas do DF: LODF, Regimento Escolar, Resolução 2/2020-CEDF e Leis 5.105/5.106/7.142",
          subitens: "LODF (Título VI Ordem Social), Regimento Escolar (Portaria 15/2015), Currículo em Movimento, PDE/PNE (prorrogado até 2025/2026 pela Lei 14.934/2024) e planos de carreira.",
          resumoChave: "Para Assistência/PPGE, confira a nova nomenclatura da Lei nº 7.142/2022 (Gestor PPGE e Analista PPGE)."
        }
      ]
    };

    if (!isMagisterio) return [leg];

    const ped = {
      id: "seedf_comp_ped",
      codigo: "COMP-02",
      nome: "Temas Educacionais e Pedagógicos",
      categoria: "complementares",
      peso: 1,
      questoesProva: 20,
      pontosProva: 20,
      descricao: "Tendências pedagógicas, didática histórico-cultural, planejamento, PPP, avaliação, interdisciplinaridade e gestão democrática.",
      topicos: [
        {
          id: "seedf_ped_1",
          numero: "2.1",
          titulo: "Planejamento, PPP, Currículo e Avaliação Escolar",
          subitens: "Planejamento participativo, planos de escola/ensino/aula, Projeto Político-Pedagógico, avaliação diagnóstica, formativa e somativa.",
          resumoChave: "Na SEEDF, a avaliação formativa (para a aprendizagem) e o PPP como instrumento de gestão democrática são campeões de cobrança."
        },
        {
          id: "seedf_ped_2",
          numero: "2.2",
          titulo: "Tendências Pedagógicas, Didática Histórico-Cultural e Relação Professor-Aluno",
          subitens: "Pedagogia liberal vs. progressista (libertadora, libertária, crítico-social dos conteúdos), Saviani, Libâneo, Vigotski e interdisciplinaridade.",
          resumoChave: "Saiba diferenciar pedagogia histórico-crítica (Saviani) e abordagem histórico-cultural (Vigotski)."
        },
        {
          id: "seedf_ped_3",
          numero: "2.3",
          titulo: "Educação Integral, EJA, Educação Especial, Campo e Direitos Humanos",
          subitens: "DCNs da Educação Infantil, Fundamental e Médio, EJA (Res. CNE/CEB 1/2021), educação das relações étnico-raciais, gênero e diversidade.",
          resumoChave: "Funções da EJA (reparadora, equalizadora e qualificadora) e princípios da educação inclusiva."
        }
      ]
    };

    return [leg, ped];
  }

  const ROLES = [
    {
      id: "seedf_2026_prof_atividades",
      code: "PEB-ATIV",
      nome: "Professor — Atividades (Pedagogia)",
      vagas: "624 vagas + 1.872 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "atividades",
      espPack: "pack_seedf_esp_atividades",
      espTitulo: "Alfabetização, Letramento, Ludicidade e Ensino Fundamental (Anos Iniciais)",
      espDesc: "BNCC, Currículo em Movimento (Educação Infantil e Anos Iniciais), alfabetização, letramento, psicogênese da língua escrita e didática multidisciplinar."
    },
    {
      id: "seedf_2026_prof_portugues",
      code: "PEB-PORT",
      nome: "Professor — Língua Portuguesa",
      vagas: "208 vagas + 624 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "lingua-portuguesa",
      espPack: "pack_seedf_esp_lingua-portuguesa",
      espTitulo: "Linguística, Literatura Brasileira, Análise Textual e Ensino de Língua Portuguesa",
      espDesc: "Linguística aplicada, gêneros discursivos, análise morfossintática aprofundada, literatura brasileira e metodologias de ensino (BNCC/Currículo DF)."
    },
    {
      id: "seedf_2026_prof_matematica",
      code: "PEB-MAT",
      nome: "Professor — Matemática",
      vagas: "283 vagas + 849 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "matematica",
      espPack: "pack_seedf_esp_matematica",
      espTitulo: "Álgebra, Geometria, Cálculo, Probabilidade, Estatística e Educação Matemática",
      espDesc: "Conjuntos, funções, matrizes, geometria plana/espacial/analítica, combinatória, probabilidade, matemática financeira e resolução de problemas."
    },
    {
      id: "seedf_2026_prof_ed_fisica",
      code: "PEB-EDF",
      nome: "Professor — Educação Física",
      vagas: "198 vagas + 594 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "educacao-fisica",
      espPack: "pack_seedf_esp_educacao-fisica",
      espTitulo: "Cultura Corporal de Movimento, Fisiologia, Metodologias e Esportes",
      espDesc: "Abordagens pedagógicas da Educação Física, desenvolvimento motor, fisiologia do exercício, jogos, lutas, danças, ginásticas e inclusão."
    },
    {
      id: "seedf_2026_prof_artes",
      code: "PEB-ART",
      nome: "Professor — Artes",
      vagas: "160 vagas + 480 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "artes",
      espPack: "pack_seedf_esp_artes",
      espTitulo: "Artes Visuais, Teatro, Dança, Música e Abordagem Triangular",
      espDesc: "História da Arte no Brasil e no mundo, linguagens artísticas integradas, Abordagem Triangular (Ana Mae Barbosa) e mediação cultural."
    },
    {
      id: "seedf_2026_prof_biologia",
      code: "PEB-BIO",
      nome: "Professor — Biologia / Ciências Naturais",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "biologia",
      espPack: "pack_seedf_esp_biologia",
      espTitulo: "Citologia, Genética, Ecologia, Evolução, Fisiologia e Ensino de Biologia",
      espDesc: "Biologia celular e molecular, genética mendeliana, ecologia e biodiversidade do Cerrado, fisiologia humana e metodologias laboratoriais."
    },
    {
      id: "seedf_2026_prof_historia",
      code: "PEB-HIST",
      nome: "Professor — História",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "historia",
      espPack: "pack_seedf_esp_historia",
      espTitulo: "História do Brasil, História Geral, Historiografia e Ensino de História",
      espDesc: "Brasil Colônia, Império e República, História Contemporânea, história afro-brasileira e indígena (Leis 10.639/03 e 11.645/08)."
    },
    {
      id: "seedf_2026_prof_geografia",
      code: "PEB-GEO",
      nome: "Professor — Geografia",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "geografia",
      espPack: "pack_seedf_esp_geografia",
      espTitulo: "Geografia Física, Humana, Geopolítica, Cartografia e Ensino de Geografia",
      espDesc: "Climatologia, geomorfologia, urbanização, globalização, questões ambientais e cartografia escolar."
    },
    {
      id: "seedf_2026_prof_fisica",
      code: "PEB-FIS",
      nome: "Professor — Física",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "fisica",
      espPack: "pack_seedf_esp_fisica",
      espTitulo: "Mecânica, Termodinâmica, Eletromagnetismo, Óptica e Física Moderna",
      espDesc: "Cinemática, dinâmica, leis de conservação, termologia, ondulatória, eletrodinâmica e ensino experimental de Física."
    },
    {
      id: "seedf_2026_prof_quimica",
      code: "PEB-QUIM",
      nome: "Professor — Química",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "quimica",
      espPack: "pack_seedf_esp_quimica",
      espTitulo: "Química Geral, Físico-Química, Química Orgânica e Ensino de Química",
      espDesc: "Estrutura atômica, estequiometria, equilíbrio químico, termoquímica, eletroquímica, funções orgânicas e experimentação."
    },
    {
      id: "seedf_2026_prof_ingles",
      code: "PEB-ING",
      nome: "Professor — LEM / Inglês",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "lem-ingles",
      espPack: "pack_ingles",
      espTitulo: "Língua Inglesa, Leitura Crítica, Morfossintaxe e Ensino de LEM",
      espDesc: "Compreensão textual em inglês, estrutura gramatical, multiletramentos e abordagens comunicativas no ensino público."
    },
    {
      id: "seedf_2026_prof_espanhol",
      code: "PEB-ESP",
      nome: "Professor — LEM / Espanhol",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "lem-espanhol",
      espPack: "pack_seedf_esp_lem-espanhol",
      espTitulo: "Língua Espanhola, Variação Linguística e Didática de Espanhol",
      espDesc: "Interpretação de textos em espanhol, falsos cognatos, morfossintaxe e metodologias de ensino de língua espanhola."
    },
    {
      id: "seedf_2026_prof_informatica",
      code: "PEB-INFO",
      nome: "Professor — Informática",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "informatica",
      espPack: "pack_ti_dev",
      espTitulo: "Algoritmos, Banco de Dados, Redes, Segurança e Ensino de Computação",
      espDesc: "Programação, engenharia de software, banco de dados SQL, redes TCP/IP, segurança da informação e metodologias de ensino técnico."
    },
    {
      id: "seedf_2026_prof_adm",
      code: "PEB-ADM",
      nome: "Professor — Administração",
      vagas: "Magistério Público (40h)",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "administracao",
      espPack: "pack_cofen_adm",
      espTitulo: "Administração Geral, Administração Pública, AFO e Ensino Técnico",
      espDesc: "Planejamento estratégico, gestão de pessoas, processos, projetos, governança pública, orçamento público e didática profissional."
    },
    {
      id: "seedf_2026_pedagogo",
      code: "PED-OE",
      nome: "Pedagogo — Orientador Educacional",
      vagas: "50 vagas + 150 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: true,
      areaSlug: "atividades",
      espPack: "pack_seedf_esp_atividades",
      espTitulo: "Orientação Educacional, Mediação de Conflitos e Projeto de Vida",
      espDesc: "Atuação do orientador educacional na rede pública do DF, mediação escolar, inclusão, evasão escolar e articulação família-escola."
    },
    {
      id: "seedf_2026_gestor_adm",
      code: "GPPGE-ADM",
      nome: "Gestor PPGE — Administração",
      vagas: "171 vagas (geral) + 516 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: false,
      areaSlug: "administracao",
      espPack: "pack_cofen_adm",
      espTitulo: "Administração Geral e Pública, Licitações (14.133/2021), AFO e Gestão de Pessoas",
      espDesc: "Carreira PPGE (Lei 7.142/2022): gestão pública, planejamento estratégico, compras governamentais, AFO e políticas educacionais."
    },
    {
      id: "seedf_2026_gestor_ti",
      code: "GPPGE-TI",
      nome: "Gestor PPGE — Tecnologia da Informação",
      vagas: "171 vagas (geral) + 516 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: false,
      areaSlug: "informatica",
      espPack: "pack_ti_dev",
      espTitulo: "Engenharia de Software, Dados, Segurança, Governança de TIC e Redes",
      espDesc: "Carreira PPGE (Lei 7.142/2022): arquitetura de sistemas, bancos de dados, DevSecOps, LGPD, IN SGD 94/2022 e redes."
    },
    {
      id: "seedf_2026_gestor_direito",
      code: "GPPGE-DIR",
      nome: "Gestor PPGE — Direito e Legislação",
      vagas: "171 vagas (geral) + 516 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: false,
      areaSlug: "direito",
      espPack: "pack_cofen_juridico",
      espTitulo: "Direito Constitucional, Administrativo, Civil, Processo Civil e Trabalhista",
      espDesc: "Carreira PPGE (Lei 7.142/2022): controle da administração, contratos (14.133/2021), responsabilidade civil e contencioso."
    },
    {
      id: "seedf_2026_gestor_contab",
      code: "GPPGE-CONT",
      nome: "Gestor PPGE — Contabilidade",
      vagas: "171 vagas (geral) + 516 CR",
      remuneracao: 6749.10,
      jornada: 40,
      magisterio: false,
      areaSlug: "contbilidade",
      espPack: "pack_cofen_contabilidade",
      espTitulo: "Contabilidade Pública (MCASP/NBCASP), AFO, LRF e Auditoria",
      espDesc: "Carreira PPGE (Lei 7.142/2022): contabilidade aplicada ao setor público, demonstrações contábeis, orçamento e prestação de contas."
    },
    {
      id: "seedf_2026_analista_apoio",
      code: "APPGE-AA",
      nome: "Analista PPGE / Técnico de Gestão Educacional — Apoio Administrativo",
      vagas: "550 vagas + 1.650 CR",
      remuneracao: 4500.00,
      jornada: 40,
      magisterio: false,
      areaSlug: "administracao",
      espPack: "pack_cofen_adm",
      espTitulo: "Rotinas Administrativas, Atendimento, Redação Oficial, Gestão Escolar e Documental",
      espDesc: "Carreira PPGE (Lei 7.142/2022): apoio administrativo escolar, protocolo/SEI, atendimento ao público e organização escolar."
    }
  ];

  function buildEditalForRole(role) {
    const basicos = buildBasicos();
    const comp = buildComplementares(role.magisterio);
    const espec = {
      id: `seedf_esp_${role.areaSlug}`,
      codigo: "ESP-01",
      nome: `Conhecimentos Específicos — ${role.nome}`,
      categoria: "especificos",
      peso: 1,
      questoesProva: 50,
      pontosProva: 50,
      descricao: role.espDesc,
      topicos: [
        {
          id: `seedf_${role.code.toLowerCase()}_t1`,
          numero: "1.1",
          titulo: role.espTitulo,
          subitens: role.espDesc,
          resumoChave: "Base montada a partir dos Editais 2016/2022 e TR 3/2026. Assim que sair o novo edital, use 'Atualizar Edital' nesta aba."
        }
      ]
    };

    return {
      metadata: {
        concurso: `SEEDF 2026/2027 — ${role.nome}`,
        edital: "Pré-Edital SEEDF 2026/2027 (Cruzamento 2016 + 2022 + TR nº 3/2026 — Banca Quadrix)",
        banca: "Instituto Quadrix",
        cargo: `${role.nome} (${role.vagas} • ${role.jornada}h)`,
        remuneracao: {
          remuneracaoBrutaEdital: role.remuneracao,
          totalMensal: role.remuneracao,
          cargaHorariaSemanal: role.jornada
        },
        provas: {
          dataProva: "",
          objetiva: {
            turno: "A definir",
            duracaoHoras: 4.5,
            tipo: "Certo ou Errado (120 itens — TR nº 3/2026)",
            totalQuestoes: 120,
            totalPontos: 120.0,
            corteMinimoGeral: 36.0,
            corteMinimoBasicos: 9.0,
            corteMinimoComplementares: 12.0,
            corteMinimoEspecificos: 15.0,
            regraPortugues: "TR nº 3/2026: 30 Básicos + 40 Complementares + 50 Específicos (com penalização por erro)"
          },
          discursiva: {
            turno: "Junto com a Objetiva",
            duracaoHoras: 4.5,
            totalPontos: 40.0,
            dissertacao: {
              tema: `Estudo de Caso — ${role.nome}`,
              maxLinhas: 30,
              valorMaximo: 40.0,
              notaMinima: 20.0,
              formula: "Estudo de caso com até 4 itens (máx. 30 linhas, mín. 20/40 pts — TR nº 3/2026)"
            }
          }
        }
      },
      cronograma: CRONOGRAMA,
      disciplinas: [...basicos, ...comp, espec]
    };
  }

  function buildTracks() {
    return ROLES.map(role => {
      const enabledSharedPacks = [
        "pack_portugues",
        "pack_informatica",
        "pack_administrativo",
        "pack_seedf_df",
        "pack_seedf_educacao"
      ];
      const packMapping = {
        pack_portugues: "seedf_bas_port",
        pack_informatica: "seedf_bas_info",
        pack_administrativo: "seedf_bas_adm",
        pack_seedf_df: "seedf_bas_df",
        pack_seedf_educacao: role.magisterio ? "seedf_comp_ped" : "seedf_comp_leg"
      };

      if (role.espPack) {
        enabledSharedPacks.push(role.espPack);
        packMapping[role.espPack] = `seedf_esp_${role.areaSlug}`;
      }

      return {
        id: role.id,
        groupId: "seedf_2026",
        groupName: "SEEDF 2026/2027 (Pré-Edital Quadrix • 10.604 vagas)",
        roleCode: role.code,
        roleName: role.nome,
        roleVagas: role.vagas,
        builtin: true,
        badge: "SEE",
        shortName: `SEEDF — ${role.nome}`,
        subtitle: `${role.vagas} • Quadrix (Pré-Edital 120 C/E)`,
        description: `Pré-edital baseado nos Editais 2016/2022 e Termo de Referência nº 3/2026 (${role.nome}). Atualizável com 1 clique quando sair o edital.`,
        edital: buildEditalForRole(role),
        enabledSharedPacks,
        packMapping,
        lessons: {},
        discursive: {
          temasDissertacao: [
            {
              id: `SEEDF-DISS-${role.code}`,
              titulo: `Estudo de Caso (TR nº 3/2026) — ${role.nome}`,
              categoria: `Pré-Edital SEEDF • ${role.code}`,
              maxLinhas: 30,
              valorMaximo: 40.0,
              proposta: `No Termo de Referência nº 3/2026 (SEEDF/Quadrix), a prova discursiva será um Estudo de Caso (até 30 linhas, 40 pontos, mínimo 20) com até 4 itens sobre conhecimentos complementares ou específicos de ${role.nome}.\n\nSituação hipotética para treino:\nEm uma Coordenação Regional de Ensino do Distrito Federal, identificou-se queda no desempenho escolar, alta taxa de evasão no Ensino Médio e necessidade de adequação às diretrizes de educação inclusiva e digital.\n\nConsiderando a LDB (com as atualizações recentes), o Currículo em Movimento do DF, a gestão democrática e as atribuições de ${role.nome}, redija um texto atendendo aos seguintes tópicos:\n1) Diagnóstico dos desafios pedagógicos/administrativos envolvidos;\n2) Normas aplicáveis (LDB, LBI, Regimento Escolar ou normas da área);\n3) Plano de ação concreto e indicadores de acompanhamento.`,
              espelhoNotaMaxima: "1) Abordar todos os itens do comando na ordem proposta; 2) Citar corretamente normas educacionais/administrativas vigentes (LDB, ECA, LBI, Currículo em Movimento, LC 840/2011); 3) Propor ações exequíveis respeitando entre 20 e 30 linhas.",
              pontosChaveAvaliacao: [
                "Atendimento objetivo a todos os quesitos do estudo de caso",
                "Embasamento legal e pedagógico atualizado",
                "Extensão entre 20 e 30 linhas",
                "Coesão, coerência e norma culta"
              ]
            }
          ],
          questoesTecnicasDiscursivas: [],
          flashcards: []
        }
      };
    });
  }

  window.SEEDF_TRACKS = buildTracks();
})();
