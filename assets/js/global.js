const Global = {
    // Sistema de Edição de Texto (Salva LocalStorage)
    init() {
        const saved = JSON.parse(localStorage.getItem('hsm_edits') || '{}');
        for(let id in saved) {
            const el = document.getElementById(id);
            if(el) el.innerText = saved[id];
        }
    },
    save(el) {
        if(!el.id) return;
        const saved = JSON.parse(localStorage.getItem('hsm_edits') || '{}');
        saved[el.id] = el.innerText;
        localStorage.setItem('hsm_edits', JSON.stringify(saved));
    },
    
    // Roteador de Views
    router(viewName) {
        // UI Updates
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        document.getElementById('view-' + viewName).classList.remove('hidden');
        document.getElementById('view-' + viewName).classList.add('fade-enter');
        
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active', 'bg-slate-800', 'text-white'));
        // Find button that called this (approximated) or logic to highlight
        // (Simplificado: add active class via JS logic is harder without passing element, 
        //  but styling handles it via CSS mostly. We can improve if needed).
        
        // Update Title
        const titles = {
            'dashboard': 'Visão Geral',
            'escala': 'Gerenciamento de Escala',
            'indicadores': 'KPI & Indicadores',
            'treinamentos': 'Plano de Ensino'
        };
        document.getElementById('page-title').innerText = titles[viewName] || 'Painel';

        // Loaders específicos
        if(viewName === 'indicadores') setTimeout(() => Indicadores.init(), 50);
        if(viewName === 'treinamentos') Treinamentos.init();
        if(viewName === 'escala') Escala.render();
    }
};
