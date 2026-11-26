// ============================================================================
// BASE DE DADOS DA PROVA DISCURSIVA E FLASHCARDS DE REVISÃO ESPAÇADA
// Edital Nº 1 - DPDF / Instituto ACCESS (Seção 11 do Edital)
// ============================================================================

window.DISCURSIVE_AND_FLASHCARDS = {
  formulasEdital: {
    dissertacao: {
      titulo: "Dissertação — Tema da Atualidade",
      maxLinhas: 30,
      ncMax: 20.0,
      notaMinimaEliminatoria: 10.0,
      formulaTexto: "ND = NC - (4 × NE ÷ TL)",
      explicacao: "ND = Nota da Dissertação | NC = Nota de Conteúdo/Estrutura (até 20,0 pts) | NE = Número de Erros gramaticais | TL = Total de Linhas efetivamente escritas (máx. 30)."
    },
    questaoTecnica: {
      titulo: "3 Questões Discursivas — Conhecimentos Específicos (Desenvolvimento de Sistemas)",
      maxLinhasPorQuestao: 20,
      ncMaxPorQuestao: 10.0,
      somaMaxima: 30.0,
      notaMinimaSomaEliminatoria: 15.0,
      formulaTexto: "NQi = NCi - (2 × NEi ÷ TLi)",
      explicacao: "NQi = Nota da Questão i | NCi = Nota de Conteúdo da Questão i (até 10,0 pts) | NEi = Número de Erros na questão i | TLi = Total de Linhas efetivamente escritas na questão i (máx. 20)."
    }
  },

  temasDissertacao: [
    {
      id: "DISS-01",
      titulo: "Inteligência Artificial, Transformação Digital no Sistema de Justiça e o Combate à Exclusão Digital de Grupos Vulneráveis",
      categoria: "Atualidades / Acesso à Justiça",
      maxLinhas: 30,
      valorMaximo: 20.0,
      proposta: "Considerando que o avanço acelerado da Inteligência Artificial Generativa e a virtualização integral dos processos judiciais trazem ganhos expressivos de celeridade, mas podem acentuar o 'abismo digital' para populações hipossuficientes atendidas pela Defensoria Pública, redija um texto dissertativo-argumentativo (de até 30 linhas) abordando:\n1) Os benefícios da transformação digital e da automação na prestação jurisdicional e assistencial (6,0 pontos);\n2) Os riscos da exclusão digital e de vieses algorítmicos contra grupos historicamente vulneráveis (7,0 pontos);\n3) Medidas concretas que órgãos do sistema de justiça (como a DPDF) devem adotar para aliar inovação tecnológica, atendimento humanizado/itinerante e inclusão social (7,0 pontos).",
      espelhoNotaMaxima: `A revolução tecnológica contemporânea, impulsionada pela inteligência artificial e pela virtualização processual, reconfigurou profundamente a administração da justiça no Brasil. Nesse cenário, a modernização tecnológica atua como instrumento indispensável para concretizar o princípio constitucional da razoável duração do processo, exigindo, contudo, salvaguardas que impeçam a conversão da tecnologia em barreira de exclusão social.

Em primeiro plano, cumpre destacar que a digitalização de autos e o emprego de sistemas inteligentes de triagem e apoio à decisão elevam substancialmente a eficiência estatal. No âmbito das Defensorias Públicas, ferramentas modernas permitem gerenciar grandes volumes de demandas, automatizar tarefas repetitivas e integrar bases de dados, liberando os agentes públicos para o atendimento estratégico das causas mais sensíveis.

Por outro lado, a informatização desacompanhada de políticas inclusivas agrava o chamado abismo digital. Parcela expressiva dos destinatários da assistência jurídica integral e gratuita — como idosos, pessoas em situação de rua, populações rurais e famílias de baixa renda — carece de conectividade adequada e de letramento digital. Ademais, sistemas automatizados treinados sem governança rigorosa podem reproduzir vieses discriminatórios, violando garantias fundamentais e a proteção de dados pessoais prevista na Lei nº 13.709/2018 (LGPD).

Portanto, para conciliar inovação e justiça social, cabe às instituições como a Defensoria Pública do Distrito Federal adotar uma transformação digital humanizada. Isso requer o desenvolvimento de interfaces acessíveis (padrão WCAG), a manutenção de canais presenciais e de atendimento itinerante, a supervisão humana obrigatória sobre ferramentas de inteligência artificial e a promoção da educação digital cidadã, garantindo que a tecnologia sirva como ponte, e jamais como obstáculo, à dignidade humana.`,
      pontosChaveAvaliacao: [
        "Abordou celeridade, eficiência e automação de fluxos na justiça (Item 1)",
        "Discutiu exclusão digital de hipossuficientes e riscos de vieses/LGPD (Item 2)",
        "Propôs atendimento híbrido/itinerante, acessibilidade (WCAG) e supervisão humana (Item 3)",
        "Estrutura dissertativo-argumentativa clara (Introdução, 2 parágrafos de desenvolvimento e Conclusão) próxima a 28-30 linhas"
      ]
    },
    {
      id: "DISS-02",
      titulo: "Enfrentamento à Violência Doméstica contra a Mulher no Distrito Federal: Políticas Públicas, Lei Maria da Penha e Tecnologia Social",
      categoria: "Atualidades / Direitos Humanos e DF",
      maxLinhas: 30,
      valorMaximo: 20.0,
      proposta: "O enfrentamento à violência doméstica e familiar contra a mulher constitui prioridade constitucional e eixo estruturante no Distrito Federal, reforçado pela Lei Federal nº 11.340/2006 (Lei Maria da Penha) e pela Lei Distrital nº 7.462/2024. Redija uma dissertação em até 30 linhas abordando:\n1) As múltiplas dimensões da violência doméstica (física, psicológica, sexual, patrimonial e moral) e o impacto social do problema (6,0 pontos);\n2) O papel da rede de proteção, das medidas protetivas de urgência e da Defensoria Pública na defesa integral da mulher (7,0 pontos);\n3) A importância da educação continuada no serviço público (Lei Distrital nº 7.462/2024) e de soluções tecnológicas seguras (como canais digitais de denúncia e monitoramento) na prevenção ao feminicídio (7,0 pontos).",
      espelhoNotaMaxima: `A persistência da violência doméstica e familiar contra a mulher no Brasil representa uma grave violação dos direitos humanos que exige resposta estatal articulada, célere e multidisciplinar. Mais do que agressões físicas visíveis, esse fenômeno manifesta-se em ciclos complexos de violência psicológica, moral, sexual e patrimonial, corroendo a autonomia feminina e desestruturando núcleos familiares.

Nesse contexto, a Lei Federal nº 11.340/2006 (Lei Maria da Penha) consolidou um microssistema protetivo exemplar ao afastar a aplicação banalizadora da Lei nº 9.099/1995 e instituir medidas protetivas de urgência de concessão imediata. Na efetivação dessas garantias, a Defensoria Pública desempenha função vital, assegurando assistência jurídica integral, gratuita e especializada à mulher em todos os atos processuais cíveis e criminais, além de promover o acolhimento por equipe multidisciplinar.

No âmbito do Distrito Federal, o compromisso institucional foi fortalecido pela Lei Distrital nº 7.462/2024, que instituiu programas obrigatórios de capacitação contínua dos servidores públicos sobre igualdade de gênero e acolhimento psicológico sigiloso às servidoras vítimas. Aliada à educação em direitos, a tecnologia da informação emerge como ferramenta estratégica de proteção à vida: aplicativos com botão de pânico, solicitações eletrônicas de medidas protetivas e monitoramento eletrônico de agressores reduzem o tempo de resposta estatal.

Conclui-se, assim, que a erradicação da violência de gênero e do feminicídio demanda a união indissociável entre rigor normativo, assistência jurídica acessível pela Defensoria Pública, transformação cultural no serviço público e inovação tecnológica voltada à proteção integral da mulher.`,
      pontosChaveAvaliacao: [
        "Citou as 5 formas de violência da Lei Maria da Penha (física, psicológica, sexual, patrimonial e moral)",
        "Destacou a vedação da Lei 9.099/95, as medidas protetivas e o papel da Defensoria Pública (Art. 27/28)",
        "Mencionou a Lei Distrital nº 7.462/2024 (capacitação de servidores) e recursos tecnológicos de proteção"
      ]
    }
  ],

  questoesTecnicasDiscursivas: [
    {
      id: "QTEC-01",
      disciplina: "Arquitetura de Software e Desenvolvimento de Sistemas",
      titulo: "Migração para Microsserviços, Transações Distribuídas (Saga) e Resiliência (Circuit Breaker)",
      maxLinhas: 20,
      valorMaximo: 10.0,
      comando: "A Defensoria Pública do Distrito Federal planeja desmembrar seu sistema monolítico legado de atendimento em uma arquitetura baseada em microsserviços independentes, adotando o padrão 'Database per Service'. Em até 20 linhas, responda de forma técnica e objetiva:\na) Compare a arquitetura monolítica e a de microsserviços quanto ao acoplamento, escalabilidade e implantação (3,0 pontos);\nb) Explique como o padrão SAGA soluciona o problema de transações de negócio distribuídas entre múltiplos bancos de dados, diferenciando suas abordagens por Coreografia e por Orquestração (4,0 pontos);\nc) Descreva o funcionamento do padrão Circuit Breaker e seus três estados operacionais na prevenção de falhas em cascata (3,0 pontos).",
      espelhoNotaMaxima: `a) Na arquitetura monolítica, todos os módulos compartilham o mesmo processo e banco de dados, gerando maior acoplamento, implantação única de todo o sistema e escalabilidade predominantemente global. Já nos microsserviços, o sistema é decomposto em serviços autônomos e fracamente acoplados, permitindo implantação independente (CI/CD ágil) e escalabilidade horizontal granular apenas dos serviços sob maior carga.

b) Como o padrão Database per Service inviabiliza transações ACID locais e o protocolo Two-Phase Commit (2PC) gera bloqueio síncrono excessivo, o padrão Saga gerencia transações distribuídas por meio de uma sequência de transações locais independentes. Caso uma etapa falhe, o Saga executa transações compensatórias para desfazer semanticamente as etapas anteriores (consistência eventual). Na abordagem por Coreografia, não há coordenador central: cada serviço publica eventos em um broker de mensageria e os demais reagem. Na abordagem por Orquestração, um componente orquestrador central comanda explicitamente cada serviço participante e gerencia as compensações.

c) O padrão Circuit Breaker impede que a falha ou lentidão de um serviço remoto esgote os recursos do serviço chamador (falha em cascata). Ele opera em três estados: Fechado (Closed), em que as requisições fluem normalmente e falhas são contabilizadas; Aberto (Open), acionado quando o limite de falhas é atingido, bloqueando chamadas imediatamente (fail-fast) com resposta de fallback; e Meio-Aberto (Half-Open), que após um timeout permite a passagem de requisições de teste para verificar se o serviço se recuperou (voltando para Fechado) ou se permanece instável (retornando para Aberto).`,
      checklistCorrecao: [
        "Item a (3,0 pts): Contrastou acoplamento, deploy independente e escalabilidade granular",
        "Item b (4,0 pts): Explicou transações locais + transações compensatórias + Coreografia (eventos) vs. Orquestração (coordenador central)",
        "Item c (3,0 pts): Explicou os 3 estados do Circuit Breaker: Closed (normal), Open (bloqueio rápido/fallback) e Half-Open (teste de recuperação)"
      ]
    },
    {
      id: "QTEC-02",
      disciplina: "Segurança da Informação e Desenvolvimento Seguro",
      titulo: "OWASP Top 10 (2021) e Ferramentas de Segurança no Pipeline DevSecOps (SAST, DAST e SCA)",
      maxLinhas: 20,
      valorMaximo: 10.0,
      comando: "Para elevar a maturidade de segurança das aplicações web e APIs da DPDF, a equipe de Desenvolvimento de Sistemas decidiu implantar um pipeline DevSecOps alinhado ao OWASP Top 10 (2021). Redija um texto técnico (até 20 linhas) respondendo aos seguintes itens:\na) Explique as vulnerabilidades 'A01:2021 - Broken Access Control' e 'A03:2021 - Injection', indicando uma medida técnica eficaz de prevenção no código para cada uma (4,0 pontos);\nb) Diferencie tecnicamente as ferramentas de análise SAST, DAST e SCA, indicando em qual etapa do ciclo DevSecOps cada uma atua (6,0 pontos).",
      espelhoNotaMaxima: `a) A vulnerabilidade A01:2021 (Broken Access Control — Quebra de Controle de Acesso) ocorre quando restrições sobre o que usuários autenticados estão autorizados a fazer não são devidamente validadas no servidor, permitindo acesso indevido a registros de terceiros (como IDOR) ou elevação de privilégio. Sua prevenção exige validação de autorização no lado do servidor em cada endpoint, negação por padrão (deny by default) e princípio do menor privilégio. Já a categoria A03:2021 (Injection — que engloba SQL Injection e XSS) ocorre quando dados não confiáveis fornecidos pelo usuário são enviados a um interpretador como parte de um comando ou consulta. Previne-se utilizando consultas parametrizadas (Prepared Statements / ORM com bind parameters), validação estrita de entrada (allowlist) e codificação/sanitização de saída.

b) No pipeline DevSecOps, o SAST (Static Application Security Testing) realiza análise estática de Caixa-Branca diretamente sobre o código-fonte ou bytecode, sem executar a aplicação, atuando nas fases iniciais de codificação e build para achar falhas estruturais. O SCA (Software Composition Analysis) inspeciona os arquivos de manifesto e árvores de dependências (bibliotecas open-source e de terceiros) durante o build para identificar pacotes desatualizados com vulnerabilidades públicas conhecidas (CVEs). Por fim, o DAST (Dynamic Application Security Testing) realiza testes dinâmicos de Caixa-Preta contra a aplicação em execução (em ambiente de homologação/staging), simulando ataques externos HTTP para descobrir falhas de configuração e de tempo de execução.`,
      checklistCorrecao: [
        "Item a (4,0 pts): Definiu A01 Broken Access Control (mitigação: checagem server-side/menor privilégio) e A03 Injection (mitigação: Prepared Statements/parametrização e sanitização)",
        "Item b (6,0 pts): Diferenciou SAST (estático/caixa-branca/código-fonte), SCA (dependências/bibliotecas/CVEs) e DAST (dinâmico/caixa-preta/aplicação em execução)"
      ]
    },
    {
      id: "QTEC-03",
      disciplina: "Fiscalização de Contratos de TI e Governança",
      titulo: "Contratação e Fiscalização de Soluções de TIC (IN SGD/ME nº 94/2022 e Lei nº 14.133/2021)",
      maxLinhas: 20,
      valorMaximo: 10.0,
      comando: "Na condição de Analista de TI da DPDF responsável pela contratação de uma solução de desenvolvimento e sustentação de sistemas sob a égide da Lei nº 14.133/2021 e da Instrução Normativa SGD/ME nº 94/2022, responda em até 20 linhas:\na) Quais são as fases da contratação de soluções de TIC e como se compõe a Equipe de Planejamento da Contratação (3,0 pontos)?\nb) Diferencie as atribuições do Fiscal Técnico, do Fiscal Administrativo e do Gestor do Contrato na fase de Gestão do Contrato, especificando quem realiza o recebimento provisório e o definitivo (4,0 pontos);\nc) Explique por que é vedada a remuneração por mera disponibilidade de postos de trabalho e como deve ser aferida a qualidade da entrega (3,0 pontos).",
      espelhoNotaMaxima: `a) Conforme o art. 8º da IN SGD/ME nº 94/2022, as contratações de soluções de TIC dividem-se em três fases: Planejamento da Contratação, Seleção do Fornecedor e Gestão do Contrato, com o Gerenciamento de Riscos ocorrendo de forma contínua em todas elas. A Equipe de Planejamento da Contratação é composta por três perfis: Integrante Requisitante (área de negócio demandante), Integrante Técnico (área de TIC) e Integrante Administrativo (área administrativo-licitatória).

b) Na fase de Gestão do Contrato, o Fiscal Técnico (servidor de TIC) avalia a execução técnica do objeto e o cumprimento dos níveis de serviço; o Fiscal Administrativo verifica a regularidade fiscal, trabalhista e previdenciária da contratada; e o Gestor do Contrato coordena todo o processo de fiscalização e as decisões gerenciais. Nos termos da norma, o Recebimento Provisório é realizado pelos Fiscais (Técnico, Administrativo e Setorial), ao passo que o Recebimento Definitivo é atribuição exclusiva do Gestor do Contrato, após verificação da conformidade integral da entrega.

c) O art. 5º da IN nº 94/2022 veda o pagamento pela mera disponibilidade de mão de obra ou horas sem vinculação a resultados (evitando o paradoxo do lucro-incompetência). Por isso, os pagamentos em contratos de software devem ser vinculados a entregas mensuráveis (ex.: pontos de função ou histórias prontas) e aferidos mediante Acordos de Nível de Serviço (ANS) ou Instrumentos de Medição de Resultado (IMR), aplicando-se glosas proporcionais caso os indicadores mínimos de qualidade e prazo não sejam atingidos.`,
      checklistCorrecao: [
        "Item a (3,0 pts): Citou as 3 fases + Riscos em todas + Equipe de Planejamento (Requisitante, Técnico e Administrativo)",
        "Item b (4,0 pts): Distinguiu Fiscal Técnico, Administrativo e Gestor + Recebimento Provisório (Fiscais) vs. Definitivo (Gestor)",
        "Item c (3,0 pts): Explicou a vedação ao pagamento por mera hora/posto de trabalho e a obrigatoriedade de vinculação a resultados e ANS/IMR"
      ]
    }
  ],

  flashcards: [
    { id: "FC-01", disciplina: "Língua Portuguesa", frente: "Qual a diferença entre CONQUANTO e PORQUANTO?", verso: "CONQUANTO = Conjunção Concessiva (= Embora, Ainda que).\nPORQUANTO = Conjunção Causal/Explicativa (= Porque, Visto que)." },
    { id: "FC-02", disciplina: "Língua Portuguesa", frente: "Quando o 'SE' é Partícula Apassivadora (PA) vs. Índice de Indeterminação do Sujeito (IIS)?", verso: "- PA: Verbo Transitivo Direto (VTD/VTDI) + SE -> Tem sujeito paciente e o verbo CONCORDA no plural (Ex: 'Criaram-se novas vagas').\n- IIS: Verbo Transitivo Indireto (VTI), Intransitivo (VI) ou de Ligação (VL) + SE -> Sujeito indeterminado e verbo TRAVADO na 3ª pessoa do singular (Ex: 'Precisa-se de analistas', 'Trata-se de falhas')." },
    { id: "FC-03", disciplina: "LODF e LC 828/2010", frente: "Quais órgãos compõem a Administração Superior da DPDF segundo a LC 828/2010?", verso: "1. Defensoria Pública-Geral\n2. Subdefensoria Pública-Geral\n3. Conselho Superior da Defensoria Pública\n4. Corregedoria-Geral da Defensoria Pública\n*(Atenção: NAJs são órgãos de Atuação; Ouvidoria-Geral é órgão Auxiliar chefiado por cidadão NÃO integrante da carreira!).*" },
    { id: "FC-04", disciplina: "LC 840/2011 (DF)", frente: "Quais são os prazos de Posse, Exercício e Prescrição Disciplinar na LC 840/2011?", verso: "- Posse: até 30 dias corridos da nomeação (se perder -> nomeação sem efeito).\n- Exercício: até 5 dias úteis da posse (se perder -> exoneração de ofício).\n- Prescrição Disciplinar: 5 anos (Demissão), 2 anos (Suspensão) e 1 ANO (Advertência)." },
    { id: "FC-05", disciplina: "DF e Mulheres", frente: "Quantos municípios compõem a RIDE-DF (LC 94/1998) e quais são os 4 de Minas Gerais?", verso: "Total: DF + 33 municípios (29 de Goiás + 4 de Minas Gerais).\nOs 4 de MG (U.B.C.A.): Unaí, Buritis, Cabeceira Grande e Arinos." },
    { id: "FC-06", disciplina: "Lei Maria da Penha", frente: "Quem pode determinar o afastamento imediato do agressor do lar na Lei Maria da Penha (Art. 12-C)?", verso: "1º Autoridade Judicial (Juiz).\n2º Delegado de Polícia (quando o Município NÃO for sede de comarca).\n3º Policial (quando o Município NÃO for sede de comarca E não houver delegado disponível no momento).\n*(Nos casos 2º e 3º, o Juiz deve ser comunicado em até 24h e decidir em 24h!).*" },
    { id: "FC-07", disciplina: "Engenharia de Software", frente: "Qual a direção da seta em <<include>> e <<extend>> no Diagrama de Casos de Uso UML?", verso: "- <<include>> (Obrigatório): Caso Base ---> Caso Incluído.\n- <<extend>> (Opcional/Condicional): Caso Estendido ---> Caso Base!" },
    { id: "FC-08", disciplina: "Desenvolvimento Java", frente: "Qual o FetchType padrão do JPA para @OneToMany/@ManyToMany vs. @ManyToOne/@OneToOne?", verso: "- Terminados em '...ToMany' (@OneToMany, @ManyToMany) -> FetchType.LAZY.\n- Terminados em '...ToOne' (@ManyToOne, @OneToOne) -> FetchType.EAGER." },
    { id: "FC-09", disciplina: "Desenvolvimento de Sistemas", frente: "Quais são os 4 tipos de Manutenção de Software (ISO/IEC 14764)?", verso: "1. Corretiva: corrige bug ocorrido.\n2. Adaptativa: adapta a novo ambiente, SO, hardware ou legislação.\n3. Perfectiva: adiciona novas funcionalidades de negócio ou melhora performance.\n4. Preventiva: refatora preventivamente para evitar falhas futuras." },
    { id: "FC-10", disciplina: "Segurança da Informação", frente: "No OWASP Top 10 (2021), qual é a vulnerabilidade A01 (1º lugar), onde está o XSS e quais são as 3 novas categorias?", verso: "- 1º Lugar (A01:2021): Broken Access Control (Quebra de Controle de Acesso).\n- XSS: Foi incorporado dentro de A03:2021 - Injection.\n- 3 Novas Categorias de 2021: A04 Insecure Design, A08 Software and Data Integrity Failures e A10 Server-Side Request Forgery (SSRF)." },
    { id: "FC-11", disciplina: "Governança de TI", frente: "Diferencie Governança e Gestão no COBIT 2019 e seus domínios (total de 40 objetivos).", verso: "- Governança (Alta Direção): Avaliar, Dirigir e Monitorar -> Domínio EDM (5 objetivos).\n- Gestão (Corpo Executivo): Planejar, Construir, Executar e Monitorar -> Domínios APO, BAI, DSS e MEA (35 objetivos)." },
    { id: "FC-12", disciplina: "Fiscalização de Contratos TI", frente: "Na IN SGD/ME nº 94/2022, quem faz o Recebimento Provisório e quem faz o Recebimento Definitivo?", verso: "- Recebimento PROVISÓRIO: Fiscais do Contrato (Técnico, Administrativo, Setorial).\n- Recebimento DEFINITIVO: Gestor do Contrato!" }
  ]
};
