const GlobalManager = {
    // Carrega e salva edições de texto (contenteditable)
    init() {
        const saved = localStorage.getItem('hsm_global_edits');
        if(saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(id => {
                const el = document.getElementById(id);
                if(el) el.innerText = data[id];
            });
        }
    },
    save(element) {
        if(!element.id) return;
        const saved = JSON.parse(localStorage.getItem('hsm_global_edits') || '{}');
        saved[element.id] = element.innerText;
        localStorage.setItem('hsm_global_edits', JSON.stringify(saved));
    },
    // Navegação entre abas
    switchView(viewName, element) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById('view-' + viewName).classList.add('active');
        
        if(element) {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
        }

        // Inicializadores on-demand para performance
        if(viewName === 'escala') EscalaApp.render();
        if(viewName === 'treinamentos') TreinamentosApp.init();
        if(viewName === 'indicadores') setTimeout(() => IndicadoresApp.init(), 100);
    }
};
