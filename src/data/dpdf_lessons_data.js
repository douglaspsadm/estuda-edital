// ============================================================================
// MÓDULOS DE AULAS REMEDIAIS PROFUNDAS (ENSINO ADAPTATIVO PÓS-DIAGNÓSTICO)
// Quando o candidato vai mal (< 75%) ou erra questões de um tópico, o sistema
// exibe a Aula Completa do Tópico + as Aulas Cirúrgicas de cada questão errada.
// ============================================================================

window.LESSONS_DATA = {
  bas_port: {
    subjectId: "bas_port",
    titulo: "Domínio Completo de Língua Portuguesa para o Instituto ACCESS (5 Questões — Proibido Zerar!)",
    visaoGeral: "O Instituto ACCESS cobra 5 questões de Português (peso 1 = 5,0 pontos), mas existe uma regra eliminatória implícita crítica no item 10.14.4, alínea 'a' do Edital: quem obtiver nota ZERO em Língua Portuguesa está ELIMINADO do concurso! Além disso, o domínio da escrita formal garante sua nota na Prova Discursiva (50 pontos).",
    modulos: [
      {
        subtitulo: "1. Conectores (Conjunções) que Mais Caem na Banca ACCESS",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Classificação</th><th>Sentido</th><th>Principais Conectores Cobrados</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Adversativas</strong> (Coordenativas)</td><td>Oposição / Contraste (com verbo no Indicativo)</td><td>Mas, porém, contudo, todavia, entretanto, no entanto, não obstante.</td></tr>
                <tr><td><strong>Concessivas</strong> (Subordinativas)</td><td>Fato contrário que não impede a ação (com Subjuntivo)</td><td><strong>Conquanto</strong>, embora, ainda que, mesmo que, <strong>posto que</strong>, se bem que, apesar de (que).</td></tr>
                <tr><td><strong>Causais / Explicativas</strong></td><td>Causa / Motivo / Justificativa</td><td><strong>Porquanto</strong>, já que, visto que, uma vez que, como (no início da frase), porque, pois (antes do verbo).</td></tr>
                <tr><td><strong>Conclusivas</strong></td><td>Conclusão lógica</td><td>Logo, portanto, por conseguinte, destarte, dessarte, assim, pois (posposto ao verbo, entre vírgulas).</td></tr>
                <tr><td><strong>Condicionais</strong></td><td>Hipótese / Condição</td><td>Se, caso, contanto que, desde que (com subjuntivo), a menos que, salvo se.</td></tr>
                <tr><td><strong>Proporcionais</strong></td><td>Simultaneidade gradual</td><td>À medida que, à proporção que, ao passo que. <em>(Atenção: "Na medida em que" é CAUSAL = tendo em vista que!)</em></td></tr>
              </tbody>
            </table>
          </div>`
      },
      {
        subtitulo: "2. Morfossintaxe do 'SE', Concordância e Crase",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Partícula Apassivadora (PA) vs. Índice de Indeterminação do Sujeito (IIS):</strong>
              <ul>
                <li>Se o verbo for <strong>Transitivo Direto (VTD)</strong> + <code>SE</code> &rarr; <strong>Voz Passiva Sintética</strong>. O termo seguinte é o <em>Sujeito Paciente</em> e o verbo <strong>concorda no plural</strong>! Ex.: <em>"Validaram-se os arquivos"</em> (= Os arquivos foram validados).</li>
                <li>Se o verbo exigir preposição (<strong>VTI</strong>), for <strong>Intransitivo (VI)</strong> ou de <strong>Ligação (VL)</strong> + <code>SE</code> &rarr; <strong>Índice de Indeterminação do Sujeito</strong>. O verbo fica <strong>obrigatoriamente na 3ª pessoa do singular</strong>! Ex.: <em>"Trata-se de sistemas críticos"</em>, <em>"Necessita-se de desenvolvedores"</em>, <em>"confia-se nos servidores"</em>.</li>
              </ul>
            </li>
            <li><strong>Verbos Impessoais (Sempre no Singular):</strong> <code>Haver</code> (no sentido de existir ou tempo decorrido) e <code>Fazer</code> (indicando tempo decorrido ou clima) NUNCA vão para o plural, e contaminam o verbo auxiliar na locução verbal: <em>"Deve haver soluções"</em>, <em>"Faz dez anos"</em> (Jamais diga "Devem haver" ou "Fazem dez anos"!).</li>
            <li><strong>Crase Proibida vs. Facultativa:</strong>
              <ul>
                <li><strong>Proibida:</strong> Antes de verbo, antes de palavra masculina, entre palavras repetidas (<em>dia a dia, cara a cara, ponta a ponta</em>), antes de pronomes indefinidos/pessoais.</li>
                <li><strong>Facultativa (ATÉ MINHA MARIA):</strong> Depois da preposição <code>até</code>, antes de pronome possessivo feminino singular adjetivo (<em>minha, tua, sua, nossa, vossa</em>) e antes de nome próprio feminino.</li>
              </ul>
            </li>
          </ul>`
      }
    ]
  },

  bas_lodf: {
    subjectId: "bas_lodf",
    titulo: "Aula Completa: Lei Orgânica do DF (LODF) e Lei Complementar Distrital nº 828/2010 (DPDF)",
    visaoGeral: "São 4 questões garantidas na prova! Como o concurso é para a própria Defensoria Pública do Distrito Federal (DPDF), o Instituto ACCESS cobrará com certeza os artigos 114 a 116 da LODF e a estrutura orgânica da DPDF na LC nº 828/2010 (com as alterações da LC nº 908/2016).",
    modulos: [
      {
        subtitulo: "1. A DPDF na LODF (Arts. 114 a 116 — Emenda à LODF nº 61/2012)",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Natureza Constitucional:</strong> A DPDF é instituição permanente, essencial à função jurisdicional do Estado, incumbindo-lhe fundamentalmente, como expressão e instrumento do regime democrático, a orientação jurídica, a promoção dos direitos humanos e a defesa, em todos os graus, judicial e extrajudicial, dos direitos individuais e coletivos, de forma integral e gratuita, aos necessitados.</li>
            <li><strong>Autonomia Tríplice:</strong> À DPDF são asseguradas autonomia <strong>funcional</strong>, <strong>administrativa</strong> e a <strong>iniciativa de sua proposta orçamentária</strong> dentro dos limites estabelecidos na LDO.</li>
            <li><strong>Princípios Institucionais (U.I.I.):</strong> <strong>Unidade</strong>, <strong>Indivisibilidade</strong> e <strong>Independência Funcional</strong>.</li>
          </ul>`
      },
      {
        subtitulo: "2. Estrutura Orgânica da DPDF (LC Distrital nº 828/2010 e LC nº 908/2016)",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Nível / Categoria</th><th>Órgãos Integrantes</th><th>Observações e Pegadinhas de Prova</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Administração Superior</strong></td><td>1. Defensoria Pública-Geral<br>2. Subdefensoria Pública-Geral<br>3. Conselho Superior da DPDF<br>4. Corregedoria-Geral da DPDF</td><td>O <strong>Defensor Público-Geral</strong> é nomeado pelo Governador em lista tríplice dentre membros estáveis (>35 anos) para mandato de 2 anos (+1 recondução). O <strong>Conselho Superior</strong> exerce poder normativo e deliberativo interno.</td></tr>
                <tr><td><strong>Órgãos de Atuação</strong></td><td>Defensorias Públicas do DF e <strong>Núcleos de Assistência Jurídica (NAJs)</strong></td><td>Atenção: NAJ é órgão de <strong>Atuação</strong> (não é de Administração Superior!).</td></tr>
                <tr><td><strong>Órgãos de Execução</strong></td><td>Os <strong>Defensores Públicos</strong> do Distrito Federal</td><td>Possuem as prerrogativas de intimação pessoal com vista dos autos, contagem em <strong>dobro</strong> de todos os prazos e requisição de documentos a qualquer autoridade pública.</td></tr>
                <tr><td><strong>Órgãos Auxiliares / Apoio</strong></td><td><strong>Ouvidoria-Geral</strong>, Escola de Assistência Jurídica (EASJUR / Escola Superior - LC 1.071/2026), Comissões e Apoio Administrativo</td><td>O <strong>Ouvidor-Geral</strong> é escolhido pelo Conselho Superior dentre cidadãos de reputação ilibada <strong>NÃO integrantes da carreira</strong> (mandato de 2 anos + 1 recondução).</td></tr>
              </tbody>
            </table>
          </div>`
      }
    ]
  },

  bas_lc840: {
    subjectId: "bas_lc840",
    titulo: "Aula Completa: Regime Jurídico dos Servidores do DF — LC nº 840/2011",
    visaoGeral: "A Lei Complementar nº 840/2011 é o estatuto que regerá a sua vida funcional na DPDF! São 3 questões na prova focadas em provimento, prazos de posse/exercício, direitos e regime disciplinar.",
    modulos: [
      {
        subtitulo: "1. Prazos Fatais e Formas de Provimento na LC 840/2011",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Instituto</th><th>Prazo / Regra na LC 840/2011</th><th>Consequência do Descumprimento / Detalhe</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Validade do Concurso</strong></td><td>Até <strong>2 anos</strong>, prorrogável uma vez por igual período</td><td>Durante a validade, o aprovado tem prioridade sobre novos concursados. Reserva de <strong>20%</strong> para PcD.</td></tr>
                <tr><td><strong>Posse</strong></td><td>Até <strong>30 dias corridos</strong> da publicação da nomeação</td><td>Se não tomar posse no prazo: torna-se <strong>SEM EFEITO</strong> o ato de nomeação. Admite procuração específica!</td></tr>
                <tr><td><strong>Exercício</strong></td><td>Até <strong>5 dias úteis</strong> contados da data da posse</td><td>Se tomou posse e não entrou em exercício no prazo: servidor é <strong>EXONERADO de ofício</strong>.</td></tr>
                <tr><td><strong>Estágio Probatório e Estabilidade</strong></td><td><strong>3 anos</strong> (36 meses) de efetivo exercício</td><td>Pode exercer cargo em comissão ou função de confiança durante o estágio probatório. Se reprovado: exonerado (ou reconduzido se já era estável no DF).</td></tr>
              </tbody>
            </table>
          </div>`
      },
      {
        subtitulo: "2. Regime Disciplinar: Infrações, Penalidades e Prescrição",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Classificação das Infrações:</strong> Leves, Médias (Grupo I e Grupo II) e Graves (Grupo I e Grupo II).</li>
            <li><strong>Sindicância vs. PAD:</strong> Da sindicância pode resultar arquivamento, advertência ou suspensão de <strong>até 30 dias</strong>. Para suspensão superior a 30 dias (máximo de 90 dias), demissão, cassação de aposentadoria ou destituição de cargo em comissão, é <strong>obrigatório o PAD</strong>.</li>
            <li><strong>Abandono de Cargo vs. Inassiduidade Habitual:</strong>
              <ul>
                <li><strong>Abandono de Cargo:</strong> ausência intencional por <strong>mais de 30 dias consecutivos</strong>.</li>
                <li><strong>Inassiduidade Habitual:</strong> falta sem justa causa por <strong>60 dias interpolados</strong> durante o período de 12 meses.</li>
              </ul>
            </li>
            <li><strong>Prazos de Prescrição na LC 840 (Cuidado!):</strong> <strong>5 anos</strong> (Demissão/Cassação/Destituição), <strong>2 anos</strong> (Suspensão) e <strong>1 ANO</strong> (Advertência — lembre-se que no DF é 1 ano, e não 180 dias!).</li>
          </ul>`
      }
    ]
  },

  bas_df_mulher: {
    subjectId: "bas_df_mulher",
    titulo: "Aula Completa: Realidade do DF, RIDE (LC 94/1998) e Lei Distrital nº 7.462/2024",
    visaoGeral: "Disciplina enxuta com 2 questões garantidas. O segredo é dominar os números da RIDE-DF, a economia/geografia do DF e as regras específicas da Lei Distrital nº 7.462/2024.",
    modulos: [
      {
        subtitulo: "1. RIDE-DF (LC 94/1998, LC 163/2018 e Decreto 7.469/2011) e Geografia do DF",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Composição da RIDE-DF:</strong> Total de <strong>33 municípios + Distrito Federal</strong>, abrangendo 3 unidades da federação (DF, Goiás e Minas Gerais):
              <ul>
                <li><strong>Distrito Federal</strong></li>
                <li><strong>29 Municípios de Goiás</strong> (ex.: Águas Lindas, Luziânia, Valparaíso, Formosa, Planaltina-GO, Cristalina, Novo Gama, Cidade Ocidental, Pirenópolis, Goianésia, Alto Paraíso, Cavalcante...).</li>
                <li><strong>4 Municípios de Minas Gerais (U.B.C.A.):</strong> <strong>Unaí, Buritis, Cabeceira Grande e Arinos</strong>.</li>
              </ul>
            </li>
            <li><strong>Regra de Desmembramento:</strong> Municípios criados por desmembramento de município já integrante da RIDE passam a integrá-la <strong>automaticamente</strong>.</li>
            <li><strong>Natureza Jurídica:</strong> A RIDE <strong>NÃO é um ente federativo</strong>; é uma região administrativa de articulação de ações públicas (art. 43 da CF).</li>
            <li><strong>Realidade Econômica e Geográfica do DF:</strong> Bioma 100% inserido no <strong>Cerrado</strong>; relevo de chapadas/planaltos (ponto mais alto: Pico do Roncador, 1.341m); PIB concentrado em mais de 90% no <strong>Setor Terciário</strong> (Administração Pública, serviços e comércio).</li>
          </ul>`
      },
      {
        subtitulo: "2. Lei Distrital nº 7.462/2024 (Políticas de Proteção à Mulher na Administração do DF)",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Capacitação Obrigatória dos Servidores:</strong> As escolas de governo do DF devem manter programas educacionais sobre violência de gênero e direitos das mulheres, com <strong>atualização anual</strong>, <strong>veiculação semestral</strong> e <strong>participação obrigatória</strong> de todos os servidores públicos.</li>
            <li><strong>Apoio Psicológico Sigiloso:</strong> Cada órgão público deve dispor, em suas unidades de saúde, de programas <strong>sigilosos</strong> de acompanhamento psicológico e proteção a servidoras vítimas de violência e a seus filhos.</li>
            <li><strong>Reflexo nos Concursos do DF (Item 7.5 do Edital):</strong> Exigência de cobrança da matéria nas provas + apresentação de certidão de nada-consta criminal (com indeferimento em caso de condenação transitada em julgado por violência doméstica, assegurado o contraditório e ampla defesa, salvo se já decorridos <strong>5 anos da extinção da pena</strong>).</li>
          </ul>`
      }
    ]
  },

  bas_maria_penha: {
    subjectId: "bas_maria_penha",
    titulo: "Aula Completa: Lei Maria da Penha (Lei Federal nº 11.340/2006)",
    visaoGeral: "São 3 questões na prova sobre uma única lei curta! É uma das maiores oportunidades de gabaritar pontos nos Conhecimentos Básicos.",
    modulos: [
      {
        subtitulo: "1. As 5 Formas de Violência (Art. 7º) e Âmbito de Aplicação (Art. 5º)",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Forma de Violência</th><th>Definição Legal e Palavras-Chave de Prova</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>1. Física</strong></td><td>Qualquer conduta que ofenda a integridade ou saúde corporal da mulher.</td></tr>
                <tr><td><strong>2. Psicológica</strong></td><td>Dano emocional, diminuição da autoestima, humilhação, manipulação, isolamento, vigilância constante, perseguição contumaz, insulto, chantagem, violação da intimidade, ridicularização, limitar direito de ir e vir.</td></tr>
                <tr><td><strong>3. Sexual</strong></td><td>Constranger a presenciar, manter ou participar de relação sexual não desejada; impedir uso de método contraceptivo; forçar matrimônio, gravidez, aborto ou prostituição.</td></tr>
                <tr><td><strong>4. Patrimonial</strong></td><td>Retenção, subtração, destruição parcial ou total de seus objetos, <strong>instrumentos de trabalho, documentos pessoais</strong>, bens, valores e direitos ou recursos econômicos.</td></tr>
                <tr><td><strong>5. Moral</strong></td><td>Qualquer conduta que configure <strong>Calúnia, Difamação ou Injúria</strong>.</td></tr>
              </tbody>
            </table>
          </div>`
      },
      {
        subtitulo: "2. Medidas Protetivas, Afastamento do Lar e Atuação da Defensoria",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Afastamento Imediato do Agressor do Lar (Art. 12-C):</strong> Em caso de risco atual ou iminente à vida ou integridade da mulher, o agressor será imediatamente afastado:
              <ol>
                <li>Pela <strong>Autoridade Judicial (Juiz)</strong> — regra geral;</li>
                <li>Pelo <strong>Delegado de Polícia</strong> — quando o Município <strong>NÃO for sede de comarca</strong>;</li>
                <li>Pelo <strong>Policial</strong> — quando o Município <strong>NÃO for sede de comarca E não houver delegado disponível</strong> no momento da denúncia.</li>
              </ol>
              <em>(Nos casos 2 e 3, o Juiz deve ser comunicado no prazo máximo de <strong>24 horas</strong> e decidirá em igual prazo de <strong>24 horas</strong> sobre a manutenção ou revogação!).</em>
            </li>
            <li><strong>Vedações Absolutas (Arts. 17 e 41):</strong> É <strong>PROIBIDA</strong> a aplicação da Lei nº 9.099/1995 (Juizados Especiais Criminais) aos crimes e contravenções praticados com violência doméstica contra a mulher, independentemente da pena. É <strong>PROIBIDA</strong> a aplicação de penas de cesta básica ou multa isolada. E é <strong>PROIBIDO</strong> que a própria mulher entregue intimação ou notificação ao agressor!</li>
            <li><strong>Assistência Jurídica (Arts. 16, 27 e 28):</strong> Em todos os atos processuais (cíveis e criminais), a mulher deverá estar acompanhada de advogado ou <strong>Defensor Público</strong>. Eventual renúncia à representação (apenas em crimes condicionados, como ameaça) só vale perante o <strong>Juiz</strong>, em audiência especial designada para isso, <strong>antes do recebimento da denúncia</strong>.</li>
          </ul>`
      }
    ]
  },

  bas_info: {
    subjectId: "bas_info",
    titulo: "Aula Completa: Noções de Informática, Processo Eletrônico (SEI) e Assinatura Eletrônica",
    visaoGeral: "Para você que já é da área de TI, estas 2 questões são pontos obrigatórios, mas exigem atenção aos nomes exatos de funções de planilha em português, níveis de acesso do SEI e classificação da Lei nº 14.063/2020.",
    modulos: [
      {
        subtitulo: "1. Assinatura Eletrônica (Lei 14.063/2020) e SEI",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>3 Tipos de Assinatura Eletrônica (Lei 14.063/2020):</strong>
              <ul>
                <li><strong>Simples:</strong> permite identificar o signatário e anexa/associa dados a outros dados em formato eletrônico.</li>
                <li><strong>Avançada:</strong> utiliza certificados não emitidos pela ICP-Brasil ou outro meio de comprovação da autoria e integridade de forma unívoca (ex.: conta gov.br Nível Prata/Ouro, biometria), detectando qualquer modificação posterior.</li>
                <li><strong>Qualificada:</strong> utiliza obrigatoriamente <strong>certificado digital emitido no âmbito da ICP-Brasil</strong> (MP 2.200-2/2001).</li>
              </ul>
            </li>
            <li><strong>Níveis de Acesso no SEI:</strong> <strong>Público</strong> (acessível a todos), <strong>Restrito</strong> (visível apenas às unidades pelas quais o processo tramita) e <strong>Sigiloso</strong> (visível apenas aos usuários com credencial de acesso específica concedida sobre o processo).</li>
          </ul>`
      }
    ]
  },

  bas_socorros: {
    subjectId: "bas_socorros",
    titulo: "Aula Completa: Noções de Primeiros Socorros (2 Questões)",
    visaoGeral: "Com 15 minutos de leitura deste resumo você garante as 2 questões de Primeiros Socorros do edital!",
    modulos: [
      {
        subtitulo: "Resumo Tático de Emergências para a Prova",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Situação de Emergência</th><th>Conduta CORRETA na Prova</th><th>O que NUNCA fazer (Pegadinha)</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Parada Cardiorrespiratória (PCR / SBV)</strong></td><td>1º Segurança da cena &rarr; 2º Checar resposta e respiração &rarr; 3º Acionar 192 (SAMU) / 193 e pedir DEA &rarr; 4º RCP: <strong>30 compressões : 2 ventilações</strong>, ritmo de <strong>100 a 120/min</strong>, profundidade de <strong>5 a 6 cm</strong> no adulto.</td><td>Nunca iniciar atendimento sem antes avaliar a segurança do local para o socorrista.</td></tr>
                <tr><td><strong>Engasgo (OVACE)</strong></td><td>- <strong>Leve</strong> (tosse eficaz): incentivar a tossir.<br>- <strong>Grave em adulto consciente</strong>: <strong>Manobra de Heimlich</strong> (compressões abdominais em J).<br>- <strong>Gestantes/Obesos</strong>: compressões <strong>torácicas</strong>.<br>- <strong>Lactente (<1 ano)</strong>: 5 golpes nas costas + 5 compressões torácicas.</td><td>Nunca fazer varredura digital às cegas na garganta nem dar água para quem está engasgado.</td></tr>
                <tr><td><strong>Convulsão / Epilepsia</strong></td><td>Proteger a cabeça (apoio macio), afastar objetos ao redor, afrouxar roupas no pescoço, cronometrar e lateralizar a vítima quando cessarem os abalos.</td><td><strong>NUNCA</strong> colocar objetos/dedos na boca, nunca tentar puxar/segurar a língua e nunca imobilizar os membros à força.</td></tr>
                <tr><td><strong>Queimaduras</strong></td><td>Resfriar com <strong>água corrente em temperatura ambiente</strong> por 10 a 15 minutos; cobrir com pano limpo/gaze estéril úmida.</td><td><strong>NUNCA</strong> furar bolhas, nunca arrancar roupas coladas à pele e nunca passar gelo, pasta de dente, manteiga ou óleo.</td></tr>
                <tr><td><strong>Hemorragia e Amputação</strong></td><td>Compressão direta firme com gaze/pano limpo sobre o ferimento. Torniquete apenas em hemorragia exsanguinante em membros quando a compressão direta falhar ou for inviável.</td><td>Em objeto encravado/transfixado: NUNCA retirar o objeto (deve-se estabilizá-lo no local!).</td></tr>
              </tbody>
            </table>
          </div>`
      }
    ]
  },

  esp_1: {
    subjectId: "esp_1",
    titulo: "Aula Completa: Engenharia de Software e Engenharia de Requisitos (6 Questões = 12,0 Pontos!)",
    visaoGeral: "Representa mais de 10% de toda a nota da prova objetiva! Cobre Ciclos de Vida, Engenharia de Requisitos, Casos de Uso, UML 2.5, Princípios SOLID, Padrões de Projeto GoF, Scrum e Kanban.",
    modulos: [
      {
        subtitulo: "1. Engenharia de Requisitos, UML 2.5 e Casos de Uso",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Atividades da Engenharia de Requisitos (Sommerville / Pressman):</strong>
              <ol>
                <li><strong>Concepção / Elicitação (Levantamento):</strong> descobrir os requisitos com os stakeholders (entrevistas, JAD, brainstorming, etnografia, questionários, prototipação).</li>
                <li><strong>Análise e Negociação:</strong> classificar, resolver conflitos entre stakeholders, priorizar e avaliar viabilidade e riscos.</li>
                <li><strong>Especificação:</strong> documentar formalmente os requisitos funcionais e não funcionais (documento SRS, Casos de Uso, User Stories).</li>
                <li><strong>Validação:</strong> verificar junto ao cliente se os requisitos especificados constroem o "sistema certo" (revisões técnicas, inspeções, protótipos, geração de casos de teste).</li>
                <li><strong>Gerenciamento de Requisitos:</strong> controlar mudanças ao longo do projeto e manter a <strong>Matriz de Rastreabilidade</strong> (rastreabilidade para frente e para trás).</li>
              </ol>
            </li>
            <li><strong>Relacionamentos em Casos de Uso UML:</strong>
              <ul>
                <li><code>&lt;&lt;include&gt;&gt;</code>: Obrigatório! O caso base sempre executa o caso incluído. Seta: <strong>Base &rarr; Incluído</strong>.</li>
                <li><code>&lt;&lt;extend&gt;&gt;</code>: Opcional/Condicional! Só executa se a condição do Extension Point for atendida. Seta: <strong>Estendido &rarr; Base</strong>.</li>
              </ul>
            </li>
          </ul>`
      },
      {
        subtitulo: "2. Resumo Completo dos 23 Padrões de Projeto GoF (Gang of Four)",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Categoria</th><th>Padrão GoF</th><th>Palavra-Chave Matadora na Prova</th></tr>
              </thead>
              <tbody>
                <tr><td rowspan="5"><strong>Criacionais (5)</strong><br><em>(Abstraem a instanciação de objetos)</em></td><td><strong>Singleton</strong></td><td>Garante uma <strong>única instância</strong> de uma classe com ponto de acesso global.</td></tr>
                <tr><td><strong>Factory Method</strong></td><td>Define interface para criar objeto, mas deixa as <strong>subclasses decidirem</strong> qual classe instanciar.</td></tr>
                <tr><td><strong>Abstract Factory</strong></td><td>Cria <strong>famílias de objetos relacionados</strong> ou dependentes sem especificar suas classes concretas.</td></tr>
                <tr><td><strong>Builder</strong></td><td>Separa a construção de um <strong>objeto complexo</strong> da sua representação (construção passo a passo / fluente).</td></tr>
                <tr><td><strong>Prototype</strong></td><td>Cria novos objetos copiando/clonando uma instância existente (<strong>clone</strong>).</td></tr>
                <tr><td rowspan="7"><strong>Estruturais (7)</strong><br><em>(Composição de classes e objetos)</em></td><td><strong>Adapter (Wrapper)</strong></td><td>Converte a interface de uma classe em outra esperada pelos clientes (faz <strong>interfaces incompatíveis</strong> trabalharem juntas).</td></tr>
                <tr><td><strong>Facade (Fachada)</strong></td><td>Fornece uma <strong>interface unificada e simplificada</strong> para um conjunto de interfaces de um subsistema complexo.</td></tr>
                <tr><td><strong>Decorator</strong></td><td>Anexa <strong>responsabilidades adicionais a um objeto dinamicamente</strong> (alternativa flexível à herança).</td></tr>
                <tr><td><strong>Proxy</strong></td><td>Fornece um <strong>substituto (surrogate) ou representante</strong> de outro objeto para controlar o acesso a ele (lazy loading, segurança, remoto).</td></tr>
                <tr><td><strong>Composite</strong></td><td>Compõe objetos em <strong>estruturas de árvore</strong> para representar hierarquias <strong>parte-todo</strong> de maneira uniforme.</td></tr>
                <tr><td><strong>Bridge</strong></td><td><strong>Desacopla uma abstração da sua implementação</strong>, de modo que as duas possam variar independentemente.</td></tr>
                <tr><td><strong>Flyweight</strong></td><td>Usa <strong>compartilhamento</strong> para suportar eficientemente grandes quantidades de objetos de granularidade fina (estado intrínseco vs. extrínseco).</td></tr>
                <tr><td rowspan="6"><strong>Comportamentais (Principais de 11)</strong><br><em>(Algoritmos e atribuição de responsabilidades)</em></td><td><strong>Strategy</strong></td><td>Define uma <strong>família de algoritmos</strong>, encapsula cada um deles e os torna <strong>intercambiáveis</strong>.</td></tr>
                <tr><td><strong>Observer</strong></td><td>Dependência <strong>um-para-muitos</strong>: quando um objeto muda de estado, todos os seus dependentes são <strong>notificados e atualizados automaticamente</strong>.</td></tr>
                <tr><td><strong>Command</strong></td><td><strong>Encapsula uma solicitação como um objeto</strong>, permitindo parametrizar clientes, enfileirar ou suportar operações de <strong>desfazer (undo)</strong>.</td></tr>
                <tr><td><strong>Template Method</strong></td><td>Define o <strong>esqueleto de um algoritmo</strong> em uma operação na superclasse, postergando alguns passos para as subclasses.</td></tr>
                <tr><td><strong>State</strong></td><td>Permite que um objeto <strong>altere seu comportamento quando seu estado interno muda</strong> (parecerá ter mudado de classe).</td></tr>
                <tr><td><strong>Chain of Responsibility</strong></td><td>Evita acoplar o remetente ao receptor passando a solicitação ao longo de uma <strong>cadeia de objetos tratadores (handlers)</strong>.</td></tr>
              </tbody>
            </table>
          </div>`
      }
    ]
  },

  esp_2: {
    subjectId: "esp_2",
    titulo: "Aula Completa: Desenvolvimento de Sistemas — Java, Spring Boot, JPA, Web, REST e Manutenção (8 Questões = 16,0 Pontos!)",
    visaoGeral: "É a disciplina de MAIOR PESO de todo o concurso (8 questões = 16,0 pontos). Domine cada detalhe de Java SE LTS, JPA/Hibernate, Spring Boot, Web/TypeScript, REST e Manutenção de Sistemas.",
    modulos: [
      {
        subtitulo: "1. Plataforma Java SE LTS, JPA/Hibernate e Spring Boot",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Pilares da POO:</strong> Abstração, Encapsulamento, Herança e Polimorfismo (<em>Sobrecarga/Overload</em> = mesmo nome de método na mesma classe com assinaturas/parâmetros diferentes, resolvido em compilação; <em>Sobrescrita/Override</em> = redefinição na subclasse mantendo mesma assinatura, resolvido em execução).</li>
            <li><strong>JPA / Hibernate — Ciclo de Vida e FetchType:</strong>
              <ul>
                <li>Estados da Entidade: <code>Transient</code> (nova) &rarr; <code>Managed</code> (gerenciada pelo EntityManager) &rarr; <code>Detached</code> (desanexada) &rarr; <code>Removed</code> (removida).</li>
                <li>FetchType Padrão: <code>@OneToMany</code> e <code>@ManyToMany</code> = <strong>LAZY</strong>; <code>@ManyToOne</code> e <code>@OneToOne</code> = <strong>EAGER</strong>.</li>
                <li>Problema N+1: ocorre ao carregar coleções filhas em N queries extras após 1 query principal; resolve-se com <code>JOIN FETCH</code> ou <code>@EntityGraph</code>.</li>
              </ul>
            </li>
            <li><strong>Spring Framework / Spring Boot:</strong>
              <ul>
                <li>Escopo padrão de Bean: <strong>Singleton</strong>.</li>
                <li>Anotações de Estereótipo: <code>@Component</code> (genérico), <code>@Service</code> (regras de negócio), <code>@Repository</code> (acesso a dados + tradução automática de exceções SQL para <code>DataAccessException</code> do Spring!), <code>@Controller</code> (MVC web) e <code>@RestController</code> (<code>@Controller + @ResponseBody</code>).</li>
              </ul>
            </li>
          </ul>`
      },
      {
        subtitulo: "2. APIs RESTful, Mensageria e Manutenção de Sistemas (ISO/IEC 14764)",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Tipo de Manutenção (ISO 14764)</th><th>Quando Ocorre?</th><th>Objetivo Principal</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Corretiva</strong></td><td>Reativa (após falha)</td><td>Corrigir defeitos/bugs descobertos durante a operação do software em produção.</td></tr>
                <tr><td><strong>Adaptativa</strong></td><td>Mudança no ambiente</td><td>Manter o software funcionando diante de mudanças no ambiente externo (novo SO, novo banco, nova <strong>legislação</strong>).</td></tr>
                <tr><td><strong>Perfectiva</strong></td><td>Evolução funcional</td><td>Atender a novos requisitos do usuário, criar novas funcionalidades ou melhorar o desempenho (performance).</td></tr>
                <tr><td><strong>Preventiva</strong></td><td>Proativa (antes da falha)</td><td>Detectar e corrigir defeitos latentes (refatorar código complexo/legado) para evitar que se tornem falhas operacionais no futuro.</td></tr>
              </tbody>
            </table>
          </div>`
      }
    ]
  },

  esp_3: {
    subjectId: "esp_3",
    titulo: "Aula Completa: Arquitetura de Software, Microsserviços, Cloud, Docker e Kubernetes (5 Questões = 10,0 Pontos)",
    visaoGeral: "Foco total em estilos arquiteturais, padrões de resiliência e transações em microsserviços, proxy reverso, computação em nuvem e orquestração de contêineres.",
    modulos: [
      {
        subtitulo: "1. Estilos Arquiteturais, Microsserviços, Cloud e Kubernetes",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Princípios Fundamentais:</strong> Buscar sempre <strong>ALTA Coesão</strong> (módulo com responsabilidade única e focada) e <strong>BAIXO Acoplamento</strong> (mínima dependência entre módulos).</li>
            <li><strong>Proxy Direto vs. Proxy Reverso:</strong> O <strong>Proxy Reverso</strong> (Nginx, HAProxy, Traefik) fica à frente dos servidores de backend, protegendo sua identidade, realizando balanceamento de carga (Load Balancing), cache de conteúdo estático, compressão e terminação SSL/TLS.</li>
            <li><strong>Padrões de Microsserviços:</strong>
              <ul>
                <li><strong>Saga:</strong> Transações distribuídas via sequência de transações locais + transações compensatórias (<em>Coreografia</em> via eventos pub/sub vs. <em>Orquestração</em> via coordenador central).</li>
                <li><strong>Circuit Breaker:</strong> Evita falhas em cascata (Estados: <em>Closed</em> = tráfego normal; <em>Open</em> = falha rápida sem chamar o serviço instável; <em>Half-Open</em> = testa se o serviço voltou).</li>
                <li><strong>CQRS:</strong> Separa modelos de escrita (Command) e leitura (Query).</li>
              </ul>
            </li>
            <li><strong>Docker e Kubernetes:</strong>
              <ul>
                <li>No Dockerfile: <code>RUN</code> executa no build da imagem; <code>CMD</code> e <code>ENTRYPOINT</code> executam na inicialização do contêiner.</li>
                <li>No Kubernetes: <strong>Pod</strong> (menor unidade implantável), <strong>Deployment</strong> (gerencia réplicas e atualizações), <strong>Service</strong> (expõe Pods na rede), <strong>Ingress</strong> (roteamento HTTP/HTTPS externo), <strong>ConfigMap</strong> (configurações abertas) e <strong>Secret</strong> (credenciais/dados sensíveis).</li>
              </ul>
            </li>
          </ul>`
      }
    ]
  },

  esp_4: {
    subjectId: "esp_4",
    titulo: "Aula Completa: Banco de Dados, SQL, Transações ACID, NoSQL e Gestão de Dados (4 Questões = 8,0 Pontos)",
    visaoGeral: "Cobre Modelagem MER/Relacional, Formas Normais (1FN, 2FN, 3FN, BCNF), SQL (DDL, DML, DCL, TCL), Transações ACID, Níveis de Isolamento, NoSQL e Governança de Dados.",
    modulos: [
      {
        subtitulo: "1. Normalização, SQL e Controle de Concorrência (ACID)",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Formas Normais:</strong>
              <ul>
                <li><strong>1FN:</strong> Atributos atômicos, sem grupos repetitivos ou multivalorados.</li>
                <li><strong>2FN:</strong> Está na 1FN + sem dependência funcional <strong>parcial</strong> (nenhum atributo não-chave depende apenas de parte de uma PK composta).</li>
                <li><strong>3FN:</strong> Está na 2FN + sem dependência funcional <strong>transitiva</strong> (nenhum atributo não-chave depende de outro atributo não-chave).</li>
              </ul>
            </li>
            <li><strong>Subconjuntos SQL:</strong> <strong>DDL</strong> (<code>CREATE, ALTER, DROP, TRUNCATE</code>), <strong>DML</strong> (<code>SELECT, INSERT, UPDATE, DELETE</code>), <strong>DCL</strong> (<code>GRANT, REVOKE</code>), <strong>TCL</strong> (<code>COMMIT, ROLLBACK, SAVEPOINT</code>).</li>
            <li><strong>Níveis de Isolamento e Fenômenos de Leitura:</strong>
              <ul>
                <li><code>READ UNCOMMITTED</code>: Permite Dirty Read, Non-Repeatable Read e Phantom Read.</li>
                <li><code>READ COMMITTED</code>: Impede Dirty Read.</li>
                <li><code>REPEATABLE READ</code>: Impede Dirty Read e Non-Repeatable Read.</li>
                <li><code>SERIALIZABLE</code>: Impede todos os três fenômenos.</li>
              </ul>
            </li>
          </ul>`
      }
    ]
  },

  esp_5: {
    subjectId: "esp_5",
    titulo: "Aula Completa: Qualidade e Testes de Software — Clean Code, SonarQube e JUnit 5 (4 Questões = 8,0 Pontos)",
    visaoGeral: "Aborda qualidade de código, refatoração, dívida técnica, SonarQube, pirâmide de testes, técnicas caixa-branca/caixa-preta e automação com JUnit.",
    modulos: [
      {
        subtitulo: "1. SonarQube, Pirâmide de Testes e Caixa-Branca vs. Caixa-Preta",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>As 4 Dimensões do SonarQube:</strong>
              <ul>
                <li><strong>Bug (Confiabilidade):</strong> erro claro de programação que causará comportamento incorreto em execução.</li>
                <li><strong>Vulnerability (Segurança):</strong> ponto aberto a ataque externo (ex.: SQL Injection).</li>
                <li><strong>Security Hotspot (Revisão de Segurança):</strong> código sensível à segurança que requer revisão manual de um humano para saber se há risco real.</li>
                <li><strong>Code Smell (Manutenibilidade):</strong> código confuso ou mal estruturado que dificulta a manutenção e aumenta a Dívida Técnica.</li>
              </ul>
            </li>
            <li><strong>Pirâmide de Testes (Mike Cohn):</strong> Base = Testes Unitários (muitos, rápidos, isolados com Mocks); Meio = Testes de Integração/Serviços; Topo = Testes End-to-End / UI (poucos, mais lentos).</li>
            <li><strong>Complexidade Ciclomática de McCabe (Caixa-Branca):</strong> $V(G) = P + 1$ (número de decisões lógicas + 1) ou $V(G) = E - N + 2$. Determina o limite superior do número de casos de teste necessários para cobrir todos os caminhos linearmente independentes.</li>
          </ul>`
      }
    ]
  },

  esp_6: {
    subjectId: "esp_6",
    titulo: "Aula Completa: DevOps, Git, CI/CD e Observabilidade (5 Questões = 10,0 Pontos)",
    visaoGeral: "Domine os comandos de Git, a diferença entre Continuous Delivery e Continuous Deployment, estratégias de deploy (Blue-Green, Canary) e os 3 pilares da Observabilidade.",
    modulos: [
      {
        subtitulo: "1. Git, CI/CD, Estratégias de Deploy e Observabilidade",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Git Essencial:</strong>
              <ul>
                <li><code>git merge</code> (une branches preservando histórico real e criando commit de merge) vs. <code>git rebase</code> (move a base da branch reescrevendo o histórico de forma linear).</li>
                <li><code>git revert</code> (cria novo commit desfazendo alterações anteriores — seguro para branches públicas) vs. <code>git reset</code> (move ponteiro HEAD: <code>--soft</code> mantém staged; <code>--mixed</code> mantém no working tree; <code>--hard</code> descarta alterações).</li>
              </ul>
            </li>
            <li><strong>CI / CD:</strong>
              <ul>
                <li><strong>Continuous Integration (CI):</strong> commits frequentes na branch compartilhada com build e testes automatizados.</li>
                <li><strong>Continuous Delivery (Entrega Contínua):</strong> artefato sempre pronto para produção, mas o deploy final em produção exige aprovação manual.</li>
                <li><strong>Continuous Deployment (Implantação Contínua):</strong> passou na esteira de testes, vai automaticamente para produção sem intervenção manual.</li>
              </ul>
            </li>
            <li><strong>Os 3 Pilares da Observabilidade:</strong> <strong>Logs</strong> (registros de eventos), <strong>Métricas</strong> (séries temporais numéricas — ex.: Prometheus) e <strong>Traces / Rastreamento Distribuído</strong> (fluxo ponta a ponta da requisição entre microsserviços — ex.: OpenTelemetry / Jaeger).</li>
          </ul>`
      }
    ]
  },

  esp_7: {
    subjectId: "esp_7",
    titulo: "Aula Completa: Segurança da Informação, Criptografia, OWASP Top 10 (2021) e DevSecOps (4 Questões = 8,0 Pontos)",
    visaoGeral: "Cobre os princípios CID, Criptografia Simétrica/Assimétrica/Assinatura Digital, OWASP Top 10 (2021), OWASP ASVS e ferramentas SAST, DAST e SCA.",
    modulos: [
      {
        subtitulo: "1. OWASP Top 10 (2021) e Ferramentas SAST, DAST e SCA",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Posição OWASP 2021</th><th>Categoria</th><th>Resumo / Pegadinha de Prova</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>A01:2021</strong></td><td><strong>Broken Access Control</strong></td><td>1º lugar! Falha em restringir o que usuários autenticados podem acessar (ex.: IDOR, elevação de privilégio).</td></tr>
                <tr><td><strong>A02:2021</strong></td><td><strong>Cryptographic Failures</strong></td><td>Antiga "Exposição de Dados Sensíveis". Dados trafegados em texto claro ou uso de algoritmos fracos (MD5/SHA1).</td></tr>
                <tr><td><strong>A03:2021</strong></td><td><strong>Injection</strong></td><td>SQLi, NoSQLi, OS Command Injection e agora <strong>inclui o Cross-Site Scripting (XSS)</strong>! Mitigação: Prepared Statements.</td></tr>
                <tr><td><strong>A04:2021</strong></td><td><strong>Insecure Design (Nova!)</strong></td><td>Falhas de arquitetura/concepção por ausência de modelagem de ameaças (Threat Modeling).</td></tr>
                <tr><td><strong>A05 a A09</strong></td><td>Misconfiguration (A05), Outdated Components (A06), Auth Failures (A07), Software/Data Integrity (A08 - Nova!), Logging/Monitoring (A09)</td><td>A06 é combatida com ferramentas <strong>SCA</strong>; A08 envolve pipelines CI/CD inseguros e desserialização insegura.</td></tr>
                <tr><td><strong>A10:2021</strong></td><td><strong>Server-Side Request Forgery - SSRF (Nova!)</strong></td><td>O servidor web é induzido a fazer requisições HTTP para destinos internos não validados.</td></tr>
              </tbody>
            </table>
          </div>`
      }
    ]
  },

  esp_8: {
    subjectId: "esp_8",
    titulo: "Aula Completa: Documentação, Manutenção e Suporte de Sistemas (4 Questões = 8,0 Pontos)",
    visaoGeral: "Foco em documentação arquitetural (Modelo C4, ADRs), documentação de APIs (OpenAPI/Swagger), versionamento semântico (SemVer), gestão de artefatos e pareceres técnicos.",
    modulos: [
      {
        subtitulo: "1. Modelo C4, SemVer, OpenAPI e Gestão de Repositórios Binários",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Modelo C4 (Simon Brown):</strong> 4 níveis de abstração visual da arquitetura: 1) <strong>Contexto</strong> (visão macro do sistema e atores), 2) <strong>Contêineres</strong> (aplicações, bancos de dados, filas), 3) <strong>Componentes</strong> (módulos internos de cada contêiner) e 4) <strong>Código</strong> (classes/interfaces).</li>
            <li><strong>Versionamento Semântico (SemVer <code>MAJOR.MINOR.PATCH</code>):</strong>
              <ul>
                <li><code>MAJOR</code>: mudanças incompatíveis na API (breaking changes).</li>
                <li><code>MINOR</code>: adição de funcionalidade mantendo compatibilidade retroativa.</li>
                <li><code>PATCH</code>: correção de bugs mantendo compatibilidade retroativa.</li>
              </ul>
            </li>
            <li><strong>ADR (Architecture Decision Record):</strong> registro documental conciso de uma decisão arquitetural relevante (Contexto, Decisão, Status e Consequências).</li>
          </ul>`
      }
    ]
  },

  esp_9: {
    subjectId: "esp_9",
    titulo: "Aula Completa: Gestão e Governança de TI — PMBOK 7, ITIL 4, COBIT 2019, LAI e LGPD (5 Questões = 10,0 Pontos)",
    visaoGeral: "Disciplina de alto rendimento: reúne os 3 maiores frameworks de governança do mundo (PMBOK 7, ITIL 4 e COBIT 2019) mais a LAI (Federal e Distrital) e a LGPD.",
    modulos: [
      {
        subtitulo: "1. Comparativo PMBOK 7 vs. ITIL 4 vs. COBIT 2019",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Framework</th><th>Estrutura Central</th><th>Pontos Mais Cobrados pelo Instituto ACCESS</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>PMBOK 7ª Edição</strong></td><td><strong>12 Princípios</strong> + <strong>8 Domínios de Desempenho</strong> + Sistema de Entrega de Valor</td><td>8 Domínios: Partes Interessadas, Equipe, Abordagem de Desenvolvimento e Ciclo de Vida, Planejamento, Trabalho do Projeto, Entrega, Medição e Incerteza.</td></tr>
                <tr><td><strong>ITIL 4</strong></td><td><strong>7 Princípios Orientadores</strong> + <strong>4 Dimensões</strong> + <strong>SVS (5 componentes)</strong> + <strong>Cadeia de Valor (6 atividades)</strong> + <strong>34 Práticas</strong></td><td>Incidente (restaurar rápido a operação) vs. Problema (investigar e eliminar causa-raiz). RPO (perda máxima de dados / frequência de backup) vs. RTO (tempo máximo de parada para recuperar o serviço).</td></tr>
                <tr><td><strong>COBIT 2019</strong></td><td><strong>7 Componentes</strong> + <strong>40 Objetivos</strong> (5 de Governança + 35 de Gestão) + Fatores de Desenho</td><td><strong>Governança (EDM)</strong> = Alta Direção (Avaliar, Dirigir, Monitorar). <strong>Gestão (APO, BAI, DSS, MEA)</strong> = Corpo Executivo (Planejar, Construir, Executar, Monitorar).</td></tr>
              </tbody>
            </table>
          </div>`
      },
      {
        subtitulo: "2. LAI (12.527/2011 e 4.990/2012) e LGPD (13.709/2018)",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>LAI (Acesso à Informação):</strong> Prazo de resposta: imediato ou em <strong>até 20 dias</strong> (+ <strong>10 dias</strong> mediante justificativa). Sigilo: <strong>Ultrassecreto = 25 anos</strong>, <strong>Secreto = 15 anos</strong>, <strong>Reservado = 5 anos</strong>. Informações pessoais (intimidade/honra/imagem): restritas por até <strong>100 anos</strong> independentemente de classificação de sigilo.</li>
            <li><strong>LGPD:</strong> Agentes de Tratamento = apenas <strong>Controlador</strong> (decide) e <strong>Operador</strong> (executa em nome do controlador). O <strong>Encarregado (DPO)</strong> é o canal de comunicação (NÃO é agente de tratamento!). Para dados <strong>sensíveis</strong> (Art. 11), NÃO cabem as bases legais de Legítimo Interesse nem Proteção do Crédito!</li>
          </ul>`
      }
    ]
  },

  esp_10: {
    subjectId: "esp_10",
    titulo: "Aula Completa: Fiscalização de Contratos de TI — Lei 14.133/2021, IN SGD/ME 94/2022 e IN SEGES 65/2021 (4 Questões = 8,0 Pontos)",
    visaoGeral: "Apenas 3 normas respondem por 8,0 pontos inteiros da prova! É o maior retorno por página lida de todo o edital de Conhecimentos Específicos.",
    modulos: [
      {
        subtitulo: "1. IN SGD/ME nº 94/2022: Fases, Artefatos e Papéis na Contratação de TIC",
        conteudoHtml: `
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead>
                <tr><th>Fase da Contratação</th><th>Artefatos Principais</th><th>Atores Envolvidos e Regras de Prova</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>1. Planejamento da Contratação (PCTI)</strong></td><td>1. DFD (Documento de Formalização da Demanda)<br>2. ETP (Estudo Técnico Preliminar)<br>3. TR (Termo de Referência)</td><td><strong>Equipe de Planejamento da Contratação (EPC):</strong> Integrante Requisitante + Integrante Técnico + Integrante Administrativo.<br><em>(ETP é assinado por Requisitante e Técnico; TR é assinado pelos três!).</em></td></tr>
                <tr><td><strong>2. Seleção do Fornecedor (SFTI)</strong></td><td>Edital, Propostas, Julgamento e Habilitação</td><td>Pregão (bens/serviços comuns de TIC) ou Concorrência / Diálogo Competitivo.</td></tr>
                <tr><td><strong>3. Gestão do Contrato (GCTI)</strong></td><td>Plano de Inserção, Ordens de Serviço (OS), Termos de Recebimento Provisório e Definitivo</td><td><strong>Equipe de Fiscalização:</strong> Gestor do Contrato + Fiscal Técnico + Fiscal Requisitante + Fiscal Administrativo.<br>- <strong>Recebimento Provisório:</strong> Fiscais (Técnico/Adm/Setorial).<br>- <strong>Recebimento Definitivo:</strong> Gestor do Contrato!</td></tr>
                <tr><td><strong>Transversal (Em TODAS as fases)</strong></td><td><strong>MGR (Mapa de Gerenciamento de Riscos)</strong></td><td>O Gerenciamento de Riscos ocorre continuamente durante o Planejamento, a Seleção e a Gestão do Contrato!</td></tr>
              </tbody>
            </table>
          </div>`
      },
      {
        subtitulo: "2. IN SEGES/ME nº 65/2021 (Pesquisa de Preços)",
        conteudoHtml: `
          <ul class="lesson-list">
            <li><strong>Ordem de Prioridade (Art. 5º):</strong> Priorizar os incisos <strong>I (Painel de Preços)</strong> e <strong>II (Contratações similares de outros órgãos públicos até 1 ano antes)</strong>.</li>
            <li><strong>Pesquisa Direta com Fornecedores (Inciso IV):</strong> Mínimo de <strong>3 fornecedores</strong>, com orçamentos emitidos há no máximo <strong>6 meses</strong> da divulgação do edital, exigindo justificativa formal da escolha desses fornecedores.</li>
            <li><strong>Cálculo do Preço Estimado (Art. 6º):</strong> Pode usar <strong>média, mediana ou menor dos valores</strong> obtidos, expurgando valores inexequíveis, inconsistentes ou excessivamente elevados.</li>
          </ul>`
      }
    ]
  }
};
