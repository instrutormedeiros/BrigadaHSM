const Treinamentos = {
    completed: [],

    init() {
        this.completed = JSON.parse(localStorage.getItem('hsm_train_progress') || '[]');
        this.render();
        this.updateStats();
    },

    toggle(id) {
        const idx = this.completed.indexOf(id);
        if(idx > -1) this.completed.splice(idx, 1);
        else this.completed.push(id);
        
        localStorage.setItem('hsm_train_progress', JSON.stringify(this.completed));
        this.render();
        this.updateStats();
    },

    filter(cat, btn) {
        document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active', 'bg-slate-800', 'text-white'));
        btn.classList.add('active', 'bg-slate-800', 'text-white');
        this.render(cat);
    },

    updateStats() {
        const total = DB.treinamentos.length;
        const done = this.completed.length;
        const pct = Math.round((done / total) * 100);

        // Update in Treinamentos View
        const bar = document.getElementById('train-total-bar');
        const txt = document.getElementById('train-total-pct');
        if(bar) bar.style.width = `${pct}%`;
        if(txt) txt.innerText = `${pct}%`;

        // Update in Dashboard Home
        const dashBar = document.getElementById('dash-train-bar');
        const dashTxt = document.getElementById('dash-train-pct');
        if(dashBar) dashBar.style.width = `${pct}%`;
        if(dashTxt) dashTxt.innerText = `${pct}%`;
    },

    render(filterCat = 'todos') {
        const container = document.getElementById('training-grid');
        let list = DB.treinamentos;
        if(filterCat !== 'todos') list = list.filter(m => m.category.includes(filterCat));

        container.innerHTML = list.map(m => {
            const isDone = this.completed.includes(m.id);
            const badgeColor = m.type === 'lid' ? 'bg-blue-100 text-blue-700' : (m.type === 'tec' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700');
            
            return `
                <div class="module-card ${isDone ? 'completed' : ''} group">
                    <div class="card-header" onclick="this.parentElement.querySelector('.card-body').classList.toggle('hidden')">
                        <div class="flex items-center gap-4">
                            <div class="w-8 h-8 rounded-full ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'} flex items-center justify-center transition-colors">
                                <i class="ph-bold ph-check"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800">${m.title}</h3>
                                <p class="text-xs text-slate-500">${m.subtitle}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${badgeColor}">${m.category}</span>
                            <i class="ph-bold ph-caret-down text-slate-400 group-hover:text-slate-600"></i>
                        </div>
                    </div>
                    <div class="card-body hidden bg-slate-50 p-6 border-t border-slate-100">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="text-xs font-bold text-slate-400 uppercase mb-3">Conceitos Chave</h4>
                                <ul class="space-y-2">
                                    ${m.theory.map(t => `<li class="text-sm text-slate-600 flex gap-2"><i class="ph-fill ph-dot text-slate-300"></i> ${t}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="flex flex-col justify-between">
                                <div class="bg-white p-4 rounded-lg border border-slate-200">
                                    <div class="text-xs font-bold text-slate-800 uppercase mb-1">Prática</div>
                                    <p class="text-sm text-slate-600 italic">"${m.drill}"</p>
                                </div>
                                <button onclick="Treinamentos.toggle(${m.id})" class="mt-4 w-full py-2 rounded-lg font-bold text-sm transition-colors ${isDone ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-800 text-white hover:bg-slate-700'}">
                                    ${isDone ? 'Concluído' : 'Marcar como Concluído'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};
