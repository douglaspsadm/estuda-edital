// ============================================================================
// BANCO COMPARTILHADO DE QUESTÕES REAIS (REAPROVEITÁVEL EM QUALQUER CONCURSO)
// ============================================================================
// Organiza as 805+ questões reais validadas (originárias de provas oficiais
// CEBRASPE, FGV, FCC, IADES, ACCESS, IBEST e Quadrix) em pacotes temáticos
// universais que podem ser ligados opcionalmente em qualquer trilha/edital.
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
      id: "pack_informatica",
      nome: "Noções de Informática",
      categoria: "basicos",
      universal: true,
      cor: "#06b6d4",
      descricao: "Sistemas operacionais, suítes de escritório, redes, internet, navegadores, nuvem e segurança básica.",
      sourceSubjectIds: ["bas_info"],
      keywords: [
        "informatica", "nocoes de informatica", "computacao", "windows", "linux",
        "excel", "word", "libreoffice", "redes de computadores", "internet"
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
      cor: "#f59e0b",
      descricao: "Nova Lei de Licitações e Contratos Administrativos (Lei 14.133/2021), fiscalização de contratos e contratações públicas.",
      sourceSubjectIds: ["esp_10"],
      keywords: [
        "14.133", "14133", "licitacao", "licitacoes", "contratos administrativos",
        "fiscalizacao de contratos", "direito administrativo", "in 94", "contratacoes"
      ]
    },
    {
      id: "pack_maria_penha",
      nome: "Lei Maria da Penha (Lei 11.340/2006)",
      categoria: "basicos",
      universal: true,
      cor: "#ec4899",
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
      descricao: "Suporte básico de vida, RCP, engasgo, hemorragias, queimaduras, fraturas e emergências.",
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
      cor: "#10b981",
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
      descricao: "Engenharia de Software, Desenvolvimento, Arquitetura/Cloud/Docker/K8s, Banco de Dados, Testes, DevOps e Segurança da Informação.",
      sourceSubjectIds: ["esp_1", "esp_2", "esp_3", "esp_4", "esp_5", "esp_6", "esp_7", "esp_8"],
      keywords: [
        "engenharia de software", "desenvolvimento de sistemas", "programacao", "arquitetura de software",
        "banco de dados", "sql", "devops", "docker", "kubernetes", "seguranca da informacao",
        "qualidade de software", "testes de software", "tecnologia da informacao", "analise de sistemas"
      ]
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
    return Array.isArray(window.QUESTIONS_REAIS) ? window.QUESTIONS_REAIS : [];
  }

  function getPackQuestions(packId) {
    const pack = PACK_DEFINITIONS.find(p => p.id === packId);
    if (!pack) return [];
    const allowed = new Set(pack.sourceSubjectIds);
    return getAllRealQuestions().filter(q => q && allowed.has(q.subjectId));
  }

  function listPacks() {
    const all = getAllRealQuestions();
    return PACK_DEFINITIONS.map(pack => {
      const allowed = new Set(pack.sourceSubjectIds);
      const count = all.filter(q => q && allowed.has(q.subjectId)).length;
      return Object.assign({}, pack, { questionCount: count });
    });
  }

  /**
   * Analisa as disciplinas de um edital arbitrário e sugere automaticamente
   * quais pacotes do Banco Compartilhado combinam com cada disciplina.
   * Retorna: [{ packId, packName, questionCount, targetSubjectId, targetSubjectName, score }]
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
        // Peso extra se bater diretamente no nome da disciplina
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
   * a disciplina correspondente do edital da trilha (ou criando disciplina virtual se não mapeado).
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
        const mappedId = `${packId}__${q.id}`;
        if (seen.has(mappedId)) return;
        seen.add(mappedId);
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
    listPacks,
    getPackQuestions,
    matchPacksToEdital,
    buildMappedQuestionsForTrack
  };
})();
