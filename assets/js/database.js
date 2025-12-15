const DB = {
    config: {
        year: 2026,
        months: ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"],
        weekDays: ["D","S","T","Q","Q","S","S"],
        status: [
            { code: 0, label: "SD", class: "st-sd" },
            { code: 1, label: "SN", class: "st-sn" },
            { code: 2, label: "F", class: "st-f" },
            { code: 3, label: "FÉRIAS", class: "st-ferias" },
            { code: 4, label: "FS", class: "st-fs" }
        ]
    },
    // Dados Padrão da Equipe (usados se não houver LocalStorage)
    defaultTeam: {
        day: [
            { name: "JOSIVALDO ROGÉRIO",   id: "4360", ptr: [0,2,0,2,0,2] },
            { name: "JOEL CARNEIRO",       id: "8187", ptr: [3,3,3,3,3,3] },
            { name: "ELLEN MARCIELI",      id: "9268", ptr: [2,0,2,0,2,0] },
            { name: "AGMAR HENRIQUE",      id: "2483", ptr: [0,2,0,2,0,2] },
            { name: "ANTONIETA MARIA",     id: "9267", ptr: [0,2,4,2,0,2] }
        ],
        night: [
            { name: "DANILO ROCHA",        id: "9252", ptr: [2,1,2,4] },
            { name: "ROSA APARECIDA",      id: "0971", ptr: [1,2,1,2] },
            { name: "PETERSON PEVIDOR",    id: "7189", ptr: [1,2,1,2] },
            { name: "JULLYANDERSON RIBEIRO",id: "9351", ptr: [1,2,4,2] }
        ]
    },
    // Dados dos Indicadores (Gráficos)
    indicadores: {
        '2025': {
            conformidade: { labels: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], values: [95.9, 82.9, 69.7, 80.0, 97.1, 96.3] },
            obstrucoes: { extintores: [10, 7, 6, 1, 12, 5], hidrantes: [10, 4, 3, 5, 8, 3] },
            evacuacao: { labels: ['Fev', 'Abr', 'Mai', 'Jul', 'Set', 'Nov'], tempos: [361, 194, 188, 199, 192, 185] },
            insights: { all: ['Variação: 69.7% a 97.1%.', 'Tendência de recuperação.', 'Brigada: 50.5% treinada.'] }
        },
        '2026': {
            conformidade: { labels: ['Jan', 'Fev', 'Mar'], values: [98, 99, 0] },
            obstrucoes: { extintores: [2, 1, 0], hidrantes: [0, 0, 0] },
            evacuacao: { labels: [], tempos: [] },
            insights: { all: ['Ano fiscal iniciado.', 'Metas reajustadas.'] }
        }
    },
    // Dados de Treinamento
    treinamentos: [
        { id: 1, title: "Competências Essenciais", subtitle: "Fundamentos e Postura", category: "Comportamental", type: "comp", theory: ["Alça Fechada (Closed Loop)", "O Saca-Rolha (Checklist)", "Disciplina Sonora"], drill: "Exercício 'Cego' com rádio.", mistakes: "Correr sem rádio; Gritar.", key: "Na dúvida, não corra. Pare e pense." },
        { id: 2, title: "Liderança Situacional", subtitle: "Comando de Crise", category: "Liderança", type: "lid", theory: ["Comando do Primeiro", "Método START", "Delegação Direta"], drill: "Simulação 'Estátua'.", mistakes: "Líder tentar apagar fogo sozinho.", key: "Quem faz a tarefa não comanda." },
        { id: 3, title: "Gestão de Conflitos", subtitle: "Controle de Pânico", category: "Comportamental", type: "comp", theory: ["Líder Negativo", "Disco Arranhado", "Validação Emocional"], drill: "Role-Play invasão.", mistakes: "Debater com pânico.", key: "Gerencie o espaço da vítima." },
        { id: 4, title: "Resiliência Operacional", subtitle: "Saúde Mental", category: "Comportamental", type: "comp", theory: ["Box Breathing", "Visão de Túnel", "Foco na Tarefa"], drill: "Polichinelos + Tarefa fina.", mistakes: "Negar o medo.", key: "Se travou, respira." },
        { id: 5, title: "Equipe Multidisciplinar", subtitle: "Interface Assistencial", category: "Técnico", type: "tec", theory: ["Respeito de Competência", "Prioridade Paciente", "Comunicação Unificada"], drill: "Table Top UTI.", mistakes: "Palpite médico.", key: "Sincronia salva vidas." },
        { id: 6, title: "Ética e Sigilo", subtitle: "Proteção Institucional", category: "Liderança", type: "lid", theory: ["LGPD", "Sigilo de Ocorrência", "Postura Uniforme"], drill: "Estudo Vazamento Foto.", mistakes: "Fofoca.", key: "Reputação demora 20 anos." },
        { id: 7, title: "Gestão do Tempo", subtitle: "Golden Minutes", category: "Técnico", type: "tec", theory: ["Curva do Fogo", "Prontidão", "Triagem"], drill: "Pit Stop < 60s.", mistakes: "Discutir causa.", key: "Lento é suave, suave é rápido." },
        { id: 8, title: "Gestão de Mudanças", subtitle: "Adaptação Cenário", category: "Liderança", type: "lid", theory: ["Mapa Mental Dinâmico", "Plano B", "Líder Positivo"], drill: "Bloqueio Surpresa.", mistakes: "Forçar porta.", key: "O plano nunca sobrevive." },
        { id: 9, title: "Feedback Operacional", subtitle: "Debriefing", category: "Liderança", type: "lid", theory: ["Hot Wash", "Foco no Processo", "Sanduíche"], drill: "Simulação Feedback.", mistakes: "Humilhar colega.", key: "Sem feedback, erro vira hábito." },
        { id: 10, title: "Cultura de Transparência", subtitle: "Relato de Falhas", category: "Comportamental", type: "comp", theory: ["Quase-Acidente", "Honestidade Técnica", "Cultura Justa"], drill: "Roda da Verdade.", mistakes: "Esconder falha.", key: "Equipe que esconde trabalha cega." }
    ]
};
