// ============================================================================
// LEITOR DE PDF NO NAVEGADOR (pdf.js) & EXTRATOR DE EDITAL / PROVAS COM IA
// ============================================================================
// 100% client-side, custo zero de servidor:
// - Carrega pdf.js sob demanda via CDN apenas quando o usuário sobe um PDF.
// - Filtra páginas relevantes de editais longos e divide em chunks seguros.
// - Extrai provas em lotes pequenos (5–8 questões por chamada) para não
//   estourar limites de tokens nem truncar JSON.
// - Inclui parser heurístico local (funciona mesmo sem API Key).
// ============================================================================

(function () {
  "use strict";

  const PDFJS_SOURCES = [
    {
      lib: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
      worker: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
    },
    {
      lib: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
      worker: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
    }
  ];

  let pdfjsReadyPromise = null;

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${url}"]`);
      if (existing) {
        if (window.pdfjsLib) return resolve(window.pdfjsLib);
        existing.addEventListener("load", () => resolve(window.pdfjsLib));
        existing.addEventListener("error", () => reject(new Error("Falha ao carregar " + url)));
        return;
      }
      const s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.onload = () => resolve(window.pdfjsLib);
      s.onerror = () => reject(new Error("Falha ao carregar " + url));
      document.head.appendChild(s);
    });
  }

  async function ensurePdfJs() {
    if (window.pdfjsLib && window.pdfjsLib.getDocument) return window.pdfjsLib;
    if (pdfjsReadyPromise) return pdfjsReadyPromise;

    pdfjsReadyPromise = (async () => {
      let lastErr = null;
      for (const src of PDFJS_SOURCES) {
        try {
          const lib = await loadScript(src.lib);
          if (lib && lib.getDocument) {
            lib.GlobalWorkerOptions.workerSrc = src.worker;
            return lib;
          }
        } catch (err) {
          lastErr = err;
        }
      }
      pdfjsReadyPromise = null;
      throw lastErr || new Error("Não foi possível carregar o leitor de PDF (verifique sua conexão).");
    })();

    return pdfjsReadyPromise;
  }

  /**
   * Extrai texto página por página de um arquivo File (.pdf) no navegador.
   */
  async function extractPdfPages(file, onProgress) {
    if (!file) throw new Error("Nenhum arquivo PDF selecionado.");
    const pdfjsLib = await ensurePdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const pages = [];

    for (let i = 1; i <= numPages; i++) {
      if (typeof onProgress === "function") {
        onProgress(`Lendo página ${i} de ${numPages}...`, Math.round((i / numPages) * 100));
      }
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      let lastY = null;
      const lines = [];
      let currentLine = "";

      textContent.items.forEach(item => {
        const str = item.str || "";
        const y = item.transform ? Math.round(item.transform[5]) : null;
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 4) {
          if (currentLine.trim()) lines.push(currentLine.trim());
          currentLine = str;
        } else {
          currentLine += (currentLine && str && !currentLine.endsWith(" ") && !str.startsWith(" ") ? " " : "") + str;
        }
        if (y !== null) lastY = y;
      });
      if (currentLine.trim()) lines.push(currentLine.trim());

      pages.push({
        pageNum: i,
        text: lines.join("\n")
      });
    }

    return {
      fileName: file.name,
      numPages,
      pages,
      fullText: pages.map(p => `--- PÁGINA ${p.pageNum} ---\n${p.text}`).join("\n\n")
    };
  }

  /**
   * Interpreta intervalo de páginas como "18-26" ou "1, 2, 18-24".
   */
  function parsePageRange(rangeStr, maxPages) {
    if (!rangeStr || !String(rangeStr).trim()) return null;
    const set = new Set();
    String(rangeStr)
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .forEach(part => {
        const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
        if (m) {
          const a = Math.max(1, Number(m[1]));
          const b = Math.min(maxPages, Number(m[2]));
          for (let i = a; i <= b; i++) set.add(i);
        } else {
          const n = Number(part);
          if (n >= 1 && n <= maxPages) set.add(n);
        }
      });
    return set.size ? set : null;
  }

  /**
   * Filtra páginas relevantes de um edital longo (Metadados/Provas/Cronograma/Conteúdo Programático)
   * para economizar tokens e melhorar precisão da IA.
   */
  function smartFilterEditalPages(pages, pageRangeStr) {
    if (!Array.isArray(pages) || !pages.length) return "";
    const manualSet = parsePageRange(pageRangeStr, pages.length);
    if (manualSet) {
      return pages
        .filter(p => manualSet.has(p.pageNum))
        .map(p => `[Pág. ${p.pageNum}]\n${p.text}`)
        .join("\n\n");
    }

    // Se o PDF for curto (<= 10 páginas), envia tudo
    if (pages.length <= 10) {
      return pages.map(p => `[Pág. ${p.pageNum}]\n${p.text}`).join("\n\n");
    }

    const keywords = [
      "conteudo programatico", "objetos de avaliacao", "conhecimentos basicos",
      "conhecimentos especificos", "prova objetiva", "prova discursiva",
      "cronograma", "data da prova", "nota minima", "pontuacao", "peso", "anexo"
    ];
    const normalize = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const selected = new Set([1, 2]); // Capa e informações gerais
    pages.forEach(p => {
      const norm = normalize(p.text);
      const hits = keywords.reduce((acc, kw) => acc + (norm.includes(kw) ? 1 : 0), 0);
      if (hits >= 1) selected.add(p.pageNum);
    });

    const filtered = pages.filter(p => selected.has(p.pageNum));
    return filtered.map(p => `[Pág. ${p.pageNum}]\n${p.text}`).join("\n\n");
  }

  /**
   * Divide texto grande em chunks seguros respeitando quebras de linha.
   */
  function chunkText(text, maxChars) {
    const limit = maxChars || 12000;
    const clean = String(text || "").trim();
    if (!clean) return [];
    if (clean.length <= limit) return [clean];

    const lines = clean.split("\n");
    const chunks = [];
    let current = "";
    for (const line of lines) {
      if ((current.length + line.length + 1) > limit && current.trim()) {
        chunks.push(current.trim());
        current = line;
      } else {
        current += (current ? "\n" : "") + line;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  function slugify(str) {
    return String(str || "item")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 32) || "item";
  }

  /**
   * Parser heurístico 100% local (sem precisar de API Key!) para texto colado de edital.
   * Reconhece disciplinas em linhas curtas/maiúsculas ou prefixadas (ex: "LÍNGUA PORTUGUESA:", "1. Direito...")
   * e seus tópicos abaixo.
   */
  function structureEditalHeuristic(rawText, metaHints) {
    const hints = metaHints || {};
    const lines = String(rawText || "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    const disciplinas = [];
    let currentDisc = null;
    let currentCategoria = "basicos";

    function pushDisc(nome) {
      const cleanName = nome.replace(/^[\d.\-–•*]+\s*/, "").replace(/[:;.\-]+$/, "").trim();
      if (!cleanName || cleanName.length < 3) return;
      const id = `${currentCategoria === "especificos" ? "esp" : "bas"}_${slugify(cleanName)}_${disciplinas.length + 1}`;
      currentDisc = {
        id,
        nome: cleanName,
        categoria: currentCategoria,
        questoesProva: 10,
        peso: currentCategoria === "especificos" ? 2 : 1,
        descricao: "",
        topicos: []
      };
      disciplinas.push(currentDisc);
    }

    for (const line of lines) {
      const upper = line.toUpperCase();
      if (/^CONHECIMENTOS\s+ESPEC[IÍ]FICOS/.test(upper)) {
        currentCategoria = "especificos";
        continue;
      }
      if (/^CONHECIMENTOS\s+B[ÁA]SICOS|^CONHECIMENTOS\s+GERAIS/.test(upper)) {
        currentCategoria = "basicos";
        continue;
      }

      const isAllCapsHeader =
        line.length >= 4 &&
        line.length <= 75 &&
        line === upper &&
        /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,}/.test(line) &&
        !/^\d+[\.\)]\s/.test(line);

      const isColonHeader =
        line.length <= 85 &&
        line.endsWith(":") &&
        !/^\d+\.\d+/.test(line);

      const isBulletDisc =
        /^##?\s+/.test(line) ||
        /^DISCIPLINA\s*\d*\s*[:\-]/i.test(line);

      if (isAllCapsHeader || isColonHeader || isBulletDisc) {
        pushDisc(line.replace(/^##?\s+/, "").replace(/^DISCIPLINA\s*\d*\s*[:\-]\s*/i, ""));
      } else {
        if (!currentDisc) {
          pushDisc("Conhecimentos do Edital");
        }
        // Divide tópicos numerados na mesma linha (ex: "1 Compreensão... 2 Ortografia...")
        const subParts = line.split(/(?=(?:^|\s)\d{1,2}\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/).map(s => s.trim()).filter(Boolean);
        subParts.forEach(part => {
          const m = part.match(/^(\d+(?:\.\d+)*)\s*[\.\-\)]?\s*(.+)$/);
          const numero = m ? m[1] : String(currentDisc.topicos.length + 1);
          const tituloFull = m ? m[2] : part;
          const titulo = tituloFull.length > 90 ? tituloFull.slice(0, 87).trim() + "..." : tituloFull;
          currentDisc.topicos.push({
            id: `${currentDisc.id}_t${currentDisc.topicos.length + 1}`,
            numero,
            titulo,
            subitens: tituloFull,
            resumoChave: ""
          });
        });
      }
    }

    if (!disciplinas.length) {
      disciplinas.push({
        id: "bas_geral_1",
        nome: "Conhecimentos Gerais",
        categoria: "basicos",
        questoesProva: 20,
        peso: 1,
        descricao: "Conteúdo inicial da trilha",
        topicos: [{ id: "bas_geral_1_t1", numero: "1", titulo: "Tópico 1", subitens: rawText.slice(0, 300) }]
      });
    }

    const rawEdital = {
      metadata: {
        concurso: hints.concurso || "Meu Concurso",
        edital: hints.edital || "Edital Importado",
        banca: hints.banca || "A definir",
        cargo: hints.cargo || "Cargo",
        provas: {
          dataProva: hints.dataProva || "",
          objetiva: {
            totalQuestoes: Number(hints.totalQuestoes) || disciplinas.reduce((s, d) => s + d.questoesProva, 0),
            duracaoHoras: Number(hints.duracaoHoras) || 4.0
          }
        }
      },
      cronograma: [],
      disciplinas
    };

    return window.TracksManager ? window.TracksManager.normalizeEdital(rawEdital) : rawEdital;
  }

  /**
   * Usa a IA BYOK do usuário para estruturar o texto do Edital em JSON no formato EDITAL_DATA.
   * Suporta textos grandes dividindo em chunks seguros (~12.000 caracteres).
   */
  async function structureEditalWithAi(rawText, metaHints, onProgress) {
    if (!window.AI_TUTOR || !window.AI_TUTOR.isConfigured()) {
      throw new Error("Configure sua API Key de IA primeiro ou use o modo rápido sem IA.");
    }

    const hints = metaHints || {};
    const chunks = chunkText(rawText, 12000).slice(0, 6); // Máx 6 chunks (~72k chars) para proteger cota gratuita
    if (!chunks.length) throw new Error("O texto do edital está vazio.");

    let mergedMeta = {
      concurso: hints.concurso || "",
      edital: hints.edital || "",
      banca: hints.banca || "",
      cargo: hints.cargo || "",
      provas: {
        dataProva: hints.dataProva || "",
        objetiva: {
          totalQuestoes: Number(hints.totalQuestoes) || 0,
          duracaoHoras: Number(hints.duracaoHoras) || 4.0,
          corteMinimoGeral: 0,
          regraPortugues: ""
        }
      }
    };
    const discMap = new Map();
    const cronogramaMap = new Map();

    for (let i = 0; i < chunks.length; i++) {
      if (typeof onProgress === "function") {
        onProgress(`Estruturando edital com IA (parte ${i + 1} de ${chunks.length})...`, Math.round(((i + 1) / chunks.length) * 100));
      }

      const prompt = [
        "Você é um especialista em editais de concursos públicos brasileiros.",
        "Extraia os dados estruturados do trecho de edital abaixo e retorne APENAS um JSON válido (sem markdown, sem comentários).",
        hints.cargo ? `Foque especialmente no cargo/área: "${hints.cargo}".` : "",
        "",
        "Formato JSON obrigatório:",
        "{",
        '  "metadata": {',
        '    "concurso": "Nome do órgão/concurso",',
        '    "edital": "Número/identificação do edital",',
        '    "banca": "Nome da banca organizadora",',
        '    "cargo": "Nome do cargo/especialidade",',
        '    "dataProva": "YYYY-MM-DD ou vazio se não constar",',
        '    "totalQuestoes": 60,',
        '    "duracaoHoras": 4.0,',
        '    "corteMinimoGeral": 30,',
        '    "regraPortugues": "Ex: Não pode zerar Português (ou vazio)"',
        "  },",
        '  "cronograma": [',
        '    { "ordem": 1, "evento": "Descrição do evento", "data": "DD/MM/AAAA", "destaque": false }',
        "  ],",
        '  "disciplinas": [',
        "    {",
        '      "nome": "Nome exato da disciplina",',
        '      "categoria": "basicos ou especificos",',
        '      "questoesProva": 10,',
        '      "peso": 1,',
        '      "descricao": "Resumo em 1 linha",',
        '      "topicos": [',
        '        { "numero": "1", "titulo": "Título curto do tópico", "subitens": "Texto completo do item do edital" }',
        "      ]",
        "    }",
        "  ]",
        "}",
        "",
        "Regras:",
        "- Não invente disciplinas que não estejam no texto.",
        "- Agrupe subitens muito longos em tópicos limpos (máx 12 tópicos por disciplina).",
        "- Se este trecho não contiver cronograma ou metadados, retorne arrays/strings vazios nesses campos.",
        "",
        `=== TRECHO ${i + 1}/${chunks.length} DO EDITAL ===`,
        chunks[i]
      ].filter(Boolean).join("\n");

      const parsed = await window.AI_TUTOR.askJson(prompt, { temperature: 0.15, maxOutputTokens: 8192 });

      if (parsed && parsed.metadata) {
        const m = parsed.metadata;
        if (!mergedMeta.concurso && m.concurso) mergedMeta.concurso = m.concurso;
        if (!mergedMeta.edital && m.edital) mergedMeta.edital = m.edital;
        if (!mergedMeta.banca && m.banca) mergedMeta.banca = m.banca;
        if (!mergedMeta.cargo && m.cargo) mergedMeta.cargo = m.cargo;
        if (!mergedMeta.provas.dataProva && m.dataProva && /^\d{4}-\d{2}-\d{2}$/.test(m.dataProva)) {
          mergedMeta.provas.dataProva = m.dataProva;
        }
        if (!mergedMeta.provas.objetiva.totalQuestoes && Number(m.totalQuestoes) > 0) {
          mergedMeta.provas.objetiva.totalQuestoes = Number(m.totalQuestoes);
        }
        if (Number(m.duracaoHoras) > 0) mergedMeta.provas.objetiva.duracaoHoras = Number(m.duracaoHoras);
        if (Number(m.corteMinimoGeral) > 0) mergedMeta.provas.objetiva.corteMinimoGeral = Number(m.corteMinimoGeral);
        if (m.regraPortugues) mergedMeta.provas.objetiva.regraPortugues = m.regraPortugues;
      }

      if (parsed && Array.isArray(parsed.cronograma)) {
        parsed.cronograma.forEach(c => {
          if (c && c.evento) {
            const key = slugify(c.evento);
            if (!cronogramaMap.has(key)) cronogramaMap.set(key, c);
          }
        });
      }

      if (parsed && Array.isArray(parsed.disciplinas)) {
        parsed.disciplinas.forEach(d => {
          if (!d || !d.nome) return;
          const key = slugify(d.nome);
          if (!discMap.has(key)) {
            discMap.set(key, Object.assign({ topicos: [] }, d, { id: `${d.categoria === "especificos" ? "esp" : "bas"}_${key}` }));
          } else {
            const existing = discMap.get(key);
            const existingTopics = new Set((existing.topicos || []).map(t => slugify(t.titulo)));
            (d.topicos || []).forEach(t => {
              if (t && t.titulo && !existingTopics.has(slugify(t.titulo))) {
                existing.topicos.push(t);
                existingTopics.add(slugify(t.titulo));
              }
            });
          }
        });
      }
    }

    const rawEdital = {
      metadata: mergedMeta,
      cronograma: Array.from(cronogramaMap.values()),
      disciplinas: Array.from(discMap.values())
    };

    return window.TracksManager ? window.TracksManager.normalizeEdital(rawEdital) : rawEdital;
  }

  /**
   * Divide o texto de uma prova em lotes de ~5-8 questões para extração segura pela IA.
   */
  function splitExamIntoBatches(examText, questionsPerBatch) {
    const batchSize = questionsPerBatch || 6;
    const clean = String(examText || "").replace(/\r\n/g, "\n").trim();
    if (!clean) return [];

    // Tenta detectar inícios de questões (ex: "QUESTÃO 01", "Questão 1", "01.", "1)")
    const parts = clean.split(/(?=(?:^|\n)\s*(?:QUEST[ÃA]O\s+\d{1,3}\b|\d{1,3}\s*[\.\-\)]\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ(]))/i)
      .map(s => s.trim())
      .filter(s => s.length > 30);

    if (parts.length >= 2) {
      const batches = [];
      for (let i = 0; i < parts.length; i += batchSize) {
        const group = parts.slice(i, i + batchSize).join("\n\n");
        if (group.length > 9000) {
          batches.push(...chunkText(group, 7000));
        } else {
          batches.push(group);
        }
      }
      return batches;
    }

    // Fallback por tamanho (~6.500 chars)
    return chunkText(clean, 6500);
  }

  /**
   * Extrai, casa com gabarito, filtra/classifica pelo edital da trilha ativa e
   * gera explicação + micro-aula cirúrgica em lotes pequenos com IA BYOK.
   */
  async function extractQuestionsFromExamWithAi(examText, gabaritoText, edital, meta, onProgress) {
    if (!window.AI_TUTOR || !window.AI_TUTOR.isConfigured()) {
      throw new Error("Configure sua API Key de IA primeiro para extrair questões de PDF/texto.");
    }
    const batches = splitExamIntoBatches(examText, 6);
    if (!batches.length) throw new Error("Nenhum texto de prova encontrado.");

    const disciplinasList = (edital && Array.isArray(edital.disciplinas) ? edital.disciplinas : [])
      .map(d => `- ${d.id}: ${d.nome} (tópicos: ${(d.topicos || []).map(t => `${t.id}=${t.titulo}`).slice(0, 6).join("; ")})`)
      .join("\n");

    const validSubjectIds = new Set((edital && edital.disciplinas ? edital.disciplinas : []).map(d => d.id));
    const fallbackSubjectId = (edital && edital.disciplinas && edital.disciplinas[0]) ? edital.disciplinas[0].id : "geral";

    const bancaHint = (meta && meta.banca) || (edital && edital.metadata && edital.metadata.banca) || "Prova Oficial";
    const yearHint = Number(meta && meta.year) || new Date().getFullYear();
    const orgaoHint = (meta && meta.orgao) || (edital && edital.metadata && edital.metadata.concurso) || "Concurso";
    const filterByEdital = meta && meta.filterByEdital !== false;

    const extracted = [];
    const gabSlice = String(gabaritoText || "").trim().slice(0, 6000);

    for (let i = 0; i < batches.length; i++) {
      if (typeof onProgress === "function") {
        onProgress(
          `Processando lote ${i + 1} de ${batches.length} (${extracted.length} questões extraídas)...`,
          Math.round(((i) / batches.length) * 100)
        );
      }

      const prompt = [
        "Você é um extrator e professor especialista de questões reais de concursos públicos.",
        "Extraia TODAS as questões válidas do lote abaixo, preservando fielmente o enunciado e as alternativas (nunca invente questões).",
        filterByEdital
          ? "Classifique cada questão na disciplina (subjectId) e tópico (topicId) mais adequado do edital abaixo. Se uma questão for claramente fora do edital, marque outOfScope: true."
          : "Classifique cada questão na disciplina (subjectId) mais próxima do edital abaixo.",
        "",
        "=== DISCIPLINAS DO EDITAL ATIVO ===",
        disciplinasList || "- geral: Conhecimentos Gerais",
        "",
        gabSlice ? "=== GABARITO OFICIAL FORNECIDO ===\n" + gabSlice + "\n" : "Nenhum gabarito separado foi fornecido: identifique a resposta correta com rigor técnico.\n",
        "Retorne APENAS um JSON válido neste formato:",
        "{",
        '  "questions": [',
        "    {",
        '      "numero": "1",',
        '      "outOfScope": false,',
        '      "subjectId": "id_exato_da_disciplina_acima",',
        '      "topicId": "id_do_topico_ou_vazio",',
        '      "statement": "Enunciado completo e limpo",',
        '      "options": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],',
        '      "correctIndex": 0,',
        '      "explanation": "Explicação objetiva de por que a correta está certa e as demais estão erradas.",',
        '      "remediationLesson": {',
        '        "title": "Micro-aula do tópico",',
        '        "coreConcept": "Regra de ouro em 2-3 frases",',
        '        "accessTrap": "Pegadinha clássica da banca",',
        '        "mnemonic": "Macete ou dica de memorização"',
        "      }",
        "    }",
        "  ]",
        "}",
        "",
        "Nota: para questões estilo Certo/Errado (Cebraspe), use options: [\"Certo\", \"Errado\"] e correctIndex 0 (Certo) ou 1 (Errado).",
        "",
        `=== LOTE ${i + 1}/${batches.length} DA PROVA ===`,
        batches[i]
      ].join("\n");

      try {
        const res = await window.AI_TUTOR.askJson(prompt, { temperature: 0.15, maxOutputTokens: 8192 });
        const list = Array.isArray(res) ? res : (res && Array.isArray(res.questions) ? res.questions : []);
        list.forEach((q, idx) => {
          if (!q || !q.statement || !Array.isArray(q.options) || q.options.length < 2) return;
          if (filterByEdital && q.outOfScope === true) return;
          const subjectId = validSubjectIds.has(q.subjectId) ? q.subjectId : fallbackSubjectId;
          const correctIndex = Number(q.correctIndex);
          if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex >= q.options.length) return;

          extracted.push({
            id: `IMP-${Date.now()}-${i + 1}-${q.numero || idx + 1}`,
            sourceType: "real",
            banca: q.banca || bancaHint,
            year: Number(q.year) || yearHint,
            orgao: q.orgao || orgaoHint,
            subjectId,
            topicId: q.topicId || "",
            statement: String(q.statement).trim(),
            options: q.options.map(o => String(o).trim()),
            correctIndex,
            explanation: String(q.explanation || "Questão importada da prova do aluno.").trim(),
            remediationLesson: q.remediationLesson && typeof q.remediationLesson === "object"
              ? q.remediationLesson
              : {
                  title: "Revisão do Tópico",
                  coreConcept: String(q.explanation || "").slice(0, 220),
                  accessTrap: "Releia com atenção os termos restritivos do enunciado.",
                  mnemonic: ""
                }
          });
        });
      } catch (err) {
        console.warn(`Erro no lote ${i + 1}:`, err);
        if (batches.length === 1) throw err;
      }
    }

    if (typeof onProgress === "function") {
      onProgress(`Concluído! ${extracted.length} questões válidas extraídas.`, 100);
    }

    return extracted;
  }

  function parseQuestionsJson(rawJson, edital) {
    const parsed = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;
    const list = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.questions) ? parsed.questions : []);
    const validSubjectIds = new Set((edital && edital.disciplinas ? edital.disciplinas : []).map(d => d.id));
    const fallbackSubjectId = (edital && edital.disciplinas && edital.disciplinas[0]) ? edital.disciplinas[0].id : "geral";

    return list
      .filter(q => q && q.statement && Array.isArray(q.options) && q.options.length >= 2 && typeof q.correctIndex === "number")
      .map((q, idx) => Object.assign(
        {
          id: q.id || `JSON-${Date.now()}-${idx + 1}`,
          sourceType: "real",
          banca: q.banca || "Importada",
          year: q.year || new Date().getFullYear(),
          orgao: q.orgao || ""
        },
        q,
        {
          subjectId: validSubjectIds.size && !validSubjectIds.has(q.subjectId) ? fallbackSubjectId : (q.subjectId || fallbackSubjectId)
        }
      ));
  }

  window.PdfImporter = {
    ensurePdfJs,
    extractPdfPages,
    parsePageRange,
    smartFilterEditalPages,
    chunkText,
    structureEditalHeuristic,
    structureEditalWithAi,
    splitExamIntoBatches,
    extractQuestionsFromExamWithAi,
    parseQuestionsJson
  };
})();
