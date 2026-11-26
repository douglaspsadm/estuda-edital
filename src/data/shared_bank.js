// ============================================================================
// BANCO COMPARTILHADO DE QUESTÕES REAIS (REAPROVEITÁVEL EM QUALQUER CONCURSO)
// ============================================================================
// Unifica as 805 questões reais originais (CEBRASPE, FGV, FCC, IADES, ACCESS,
// IBEST, Quadrix) + 1.919 questões reais Quadrix (COREN, CRF, CRM, CORE, CRP)
// em pacotes temáticos universais ligáveis em qualquer trilha/edital.
// ============================================================================

(function () {
  "use strict";

  const PACK_DEFINITIONS = [
    {
      id: "pack_portugues",
      nome: "Língua Portuguesa",
      categoria: "basicos",
      universal: true,
      cor: "#3b82f6",
      descricao: "Compreensão e interpretação de texto, coesão, morfossintaxe, crase, regência, concordância, pontuação e reescrita.",
      sourceSubjectIds: ["bas_port"],
      keywords: [
        "lingua portuguesa", "portugues", "interpretacao de texto", "compreensao textual",
        "gramatica", "redacao oficial", "morfossintaxe", "ortografia", "crase"
      ]
    },
    {
      id: "pack_rlm",
      nome: "Raciocínio Lógico e Matemática",
      categoria: "basicos",
      universal: true,
      cor: "#f59e0b",
      descricao: "Lógica proposicional, porcentagem, razão/proporção, combinatória, probabilidade, estatística básica e matemática financeira.",
      sourceSubjectIds: ["bas_rlm"],
      keywords: [
        "raciocinio logico", "matematica", "logica", "probabilidade", "porcentagem",
        "estatistica", "matematica financeira", "combinatoria"
      ]
    },
    {
      id: "pack_informatica",
      nome: "Noções de Informática",
      categoria: "basicos",
      universal: true,
      cor: "#06b6d4",
      descricao: "Sistemas operacionais, suítes de escritório, redes, internet, navegadores, nuvem, IA e segurança básica.",
      sourceSubjectIds: ["bas_info"],
      keywords: [
        "informatica", "nocoes de informatica", "computacao", "windows", "linux",
        "excel", "word", "libreoffice", "redes de computadores", "internet", "microsoft 365"
      ]
    },
    {
      id: "pack_ingles",
      nome: "Língua Inglesa (Geral e Técnica TI)",
      categoria: "basicos",
      universal: true,
      cor: "#0ea5e9",
      descricao: "Compreensão de textos em língua inglesa, vocabulário profissional/técnico e gramática aplicada.",
      sourceSubjectIds: ["bas_ingles"],
      keywords: ["lingua inglesa", "ingles", "english", "textos em lingua inglesa"]
    },
    {
      id: "pack_constitucional",
      nome: "Direito Constitucional",
      categoria: "basicos",
      universal: true,
      cor: "#10b981",
      descricao: "Princípios fundamentais, direitos e garantias, organização do Estado e Poderes, controle e Ordem Social.",
      sourceSubjectIds: ["comp_const"],
      keywords: [
        "direito constitucional", "constituicao federal", "direitos fundamentais",
        "organizacao do estado", "poderes", "ordem social"
      ]
    },
    {
      id: "pack_administrativo",
      nome: "Direito Administrativo & Conselhos Profissionais",
      categoria: "basicos",
      universal: true,
      cor: "#ec4899",
      descricao: "Princípios, atos e poderes administrativos, Conselhos de Fiscalização Profissional, empregado público, Lei 9.784/99 e LIA.",
      sourceSubjectIds: ["comp_adm"],
      keywords: [
        "direito administrativo", "conselhos de fiscalizacao", "atos administrativos",
        "poderes administrativos", "empregado publico", "improbidade", "9.784", "5.905"
      ]
    },
    {
      id: "pack_lai_lgpd",
      nome: "LAI, LGPD & Governança / Gestão",
      categoria: "basicos",
      universal: true,
      cor: "#8b5cf6",
      descricao: "Lei de Acesso à Informação (12.527/2011), LGPD (13.709/2018), governança, gestão de processos, projetos e compliance.",
      sourceSubjectIds: ["esp_9"],
      keywords: [
        "lgpd", "lai", "acesso a informacao", "protecao de dados", "13.709", "12.527",
        "governanca", "gestao de projetos", "pmbok", "scrum", "itil", "cobit", "compliance"
      ]
    },
    {
      id: "pack_lei_14133",
      nome: "Licitações e Contratos (Lei 14.133/2021)",
      categoria: "basicos",
      universal: true,
      cor: "#d97706",
      descricao: "Nova Lei de Licitações e Contratos Administrativos (Lei 14.133/2021), fiscalização de contratos e contratações públicas.",
      sourceSubjectIds: ["esp_10"],
      keywords: [
        "14.133", "14133", "licitacao", "licitacoes", "contratos administrativos",
        "fiscalizacao de contratos", "in 94", "contratacoes"
      ]
    },
    {
      id: "pack_maria_penha",
      nome: "Lei Maria da Penha (Lei 11.340/2006)",
      categoria: "basicos",
      universal: true,
      cor: "#db2777",
      descricao: "Violência doméstica e familiar contra a mulher, medidas protetivas de urgência e jurisprudência.",
      sourceSubjectIds: ["bas_maria_penha"],
      keywords: [
        "maria da penha", "11.340", "11340", "violencia domestica", "direitos das mulheres",
        "direitos humanos"
      ]
    },
    {
      id: "pack_socorros",
      nome: "Noções de Primeiros Socorros",
      categoria: "basicos",
      universal: true,
      cor: "#ef4444",
      descricao: "Suporte básico de vida, RCP, engasgo, hemorragias, queimaduras e fraturas.",
      sourceSubjectIds: ["bas_socorros"],
      keywords: [
        "primeiros socorros", "socorros", "suporte basico", "emergencia", "saude", "seguranca do trabalho"
      ]
    },
    {
      id: "pack_legislacao_df",
      nome: "Legislação do DF (LODF, LC 840/2011 e RIDE/DF)",
      categoria: "basicos",
      universal: false,
      cor: "#059669",
      descricao: "Lei Orgânica do Distrito Federal (LODF), Regime Jurídico dos Servidores do DF (LC 840/2011) e Conhecimentos sobre o DF/RIDE.",
      sourceSubjectIds: ["bas_lodf", "bas_lc840", "bas_df_mulher"],
      keywords: [
        "lodf", "lei organica do distrito federal", "lc 840", "840/2011",
        "distrito federal", "ride", "realidade do df", "politica para mulheres"
      ]
    },
    {
      id: "pack_ti_dev",
      nome: "TI & Desenvolvimento de Sistemas (Completo)",
      categoria: "especificos",
      universal: false,
      cor: "#6366f1",
      descricao: "Engenharia de Software, Desenvolvimento, Arquitetura/Cloud/Redes, Banco de Dados, Testes, DevOps e Segurança da Informação.",
      sourceSubjectIds: ["esp_1", "esp_2", "esp_3", "esp_4", "esp_5", "esp_6", "esp_7", "esp_8"],
      keywords: [
        "engenharia de software", "desenvolvimento de sistemas", "programacao", "arquitetura de software",
        "banco de dados", "sql", "devops", "docker", "kubernetes", "seguranca da informacao",
        "qualidade de software", "testes de software", "tecnologia da informacao", "analise de sistemas",
        "suporte tecnico", "infraestrutura"
      ]
    },
    {
      id: "pack_cofen_enfermagem",
      nome: "Enfermagem & Sistema COFEN/CORENs",
      categoria: "especificos",
      universal: false,
      cor: "#14b8a6",
      descricao: "Questões reais Quadrix de CORENs sobre Legislação da Enfermagem, Resoluções COFEN, Fiscalização, Ética e SUS.",
      sourceSubjectIds: ["cofen_esp_enf"],
      keywords: ["enfermagem", "enfermeiro", "coren", "cofen", "fiscalizacao", "sus", "7.498"]
    },
    {
      id: "pack_cofen_juridico",
      nome: "Direito & Advocacia Pública (Conselhos)",
      categoria: "especificos",
      universal: false,
      cor: "#7c3aed",
      descricao: "Questões reais Quadrix para Advogado e Assistente Jurídico (Civil, Processo Civil, Trabalho, Tributário e Público).",
      sourceSubjectIds: ["cofen_esp_jur"],
      keywords: ["advogado", "juridico", "processo civil", "direito do trabalho", "direito civil"]
    },
    {
      id: "pack_cofen_adm",
      nome: "Administração Pública, RH & Gestão",
      categoria: "especificos",
      universal: false,
      cor: "#f97316",
      descricao: "Questões reais Quadrix para Administrador, Gestão de Pessoas, RH, Secretário Executivo e Analista Técnico.",
      sourceSubjectIds: ["cofen_esp_adm"],
      keywords: ["administracao publica", "gestao de pessoas", "recursos humanos", "analista tecnico", "secretario"]
    },
    {
      id: "pack_cofen_comunicacao",
      nome: "Comunicação Social & Redação Institucional",
      categoria: "especificos",
      universal: false,
      cor: "#0284c7",
      descricao: "Questões reais Quadrix de Comunicação Social, Assessoria de Imprensa e Redação Institucional.",
      sourceSubjectIds: ["cofen_esp_com"],
      keywords: ["comunicacao", "jornalismo", "redacao", "letras", "assessoria"]
    }
  ];

  function normalizeText(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9.\s/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getAllRealQuestions() {
    const base = Array.isArray(window.QUESTIONS_REAIS) ? window.QUESTIONS_REAIS : [];
    const quadrix = Array.isArray(window.QUESTIONS_QUADRIX) ? window.QUESTIONS_QUADRIX : [];
    return [...base, ...quadrix];
  }

  function belongsToPack(q, pack) {
    if (!q || !pack) return false;
    if (q.sharedPackId) return q.sharedPackId === pack.id;
    return pack.sourceSubjectIds.includes(q.subjectId);
  }

  function getPackQuestions(packId) {
    const pack = PACK_DEFINITIONS.find(p => p.id === packId);
    if (!pack) return [];
    return getAllRealQuestions().filter(q => belongsToPack(q, pack));
  }

  function listPacks() {
    const all = getAllRealQuestions();
    return PACK_DEFINITIONS.map(pack => {
      const count = all.filter(q => belongsToPack(q, pack)).length;
      return Object.assign({}, pack, { questionCount: count });
    });
  }

  /**
   * Analisa as disciplinas de um edital arbitrário e sugere automaticamente
   * quais pacotes do Banco Compartilhado combinam com cada disciplina.
   */
  function matchPacksToEdital(edital) {
    const disciplinas = (edital && Array.isArray(edital.disciplinas)) ? edital.disciplinas : [];
    const packs = listPacks();
    const matches = [];

    packs.forEach(pack => {
      if (!pack.questionCount) return;
      let bestDisc = null;
      let bestScore = 0;

      disciplinas.forEach(d => {
        const haystack = normalizeText(
          [
            d.nome,
            d.descricao,
            ...(Array.isArray(d.topicos) ? d.topicos.map(t => `${t.titulo || ""} ${t.subitens || ""}`) : [])
          ].join(" ")
        );
        let score = 0;
        pack.keywords.forEach(kw => {
          const nkw = normalizeText(kw);
          if (nkw && haystack.includes(nkw)) {
            score += nkw.length > 8 ? 3 : 2;
          }
        });
        const nameNorm = normalizeText(d.nome);
        pack.keywords.forEach(kw => {
          const nkw = normalizeText(kw);
          if (nkw && nameNorm.includes(nkw)) {
            score += 4;
          }
        });

        if (score > bestScore) {
          bestScore = score;
          bestDisc = d;
        }
      });

      if (bestDisc && bestScore >= 2) {
        matches.push({
          packId: pack.id,
          packName: pack.nome,
          questionCount: pack.questionCount,
          targetSubjectId: bestDisc.id,
          targetSubjectName: bestDisc.nome,
          score: bestScore
        });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Retorna as questões dos pacotes selecionados, remapeando o subjectId para
   * a disciplina correspondente do edital da trilha.
   */
  function buildMappedQuestionsForTrack(enabledPacks, packMapping) {
    const selectedIds = Array.isArray(enabledPacks) ? enabledPacks : [];
    const mapping = packMapping && typeof packMapping === "object" ? packMapping : {};
    const result = [];
    const seen = new Set();

    selectedIds.forEach(packId => {
      const qs = getPackQuestions(packId);
      const targetSubjectId = mapping[packId] || null;
      qs.forEach(q => {
        if (!q || !q.id || seen.has(q.id)) return;
        seen.add(q.id);
        result.push(
          Object.assign({}, q, {
            id: q.id,
            originalSubjectId: q.subjectId,
            subjectId: targetSubjectId || q.subjectId,
            sharedPackId: packId,
            sourceType: "real"
          })
        );
      });
    });

    return result;
  }

  window.SHARED_BANK = {
    PACK_DEFINITIONS,
    normalizeText,
    getAllRealQuestions,
    listPacks,
    getPackQuestions,
    matchPacksToEdital,
    buildMappedQuestionsForTrack
  };
})();
