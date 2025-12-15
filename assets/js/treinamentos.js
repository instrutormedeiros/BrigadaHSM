const TreinamentosApp = {
    completed: [],

    init() {
        this.completed = JSON.parse(localStorage.getItem('hsm_2026_data')) || [];
        this.renderContent(DB.treinamentos);
        this.updateProgress();
    },

    toggleCard(id) {
        const card = document.getElementById(`card-${id}`);
        if(card) card.classList.toggle('active');
    },

    toggleStatus(e, id) {
        e.stopPropagation(); 
        const index = this.completed.indexOf(id);
        if (index > -1) this.completed.splice(index, 1);
        else this.completed.push(id);
        
        localStorage.setItem('hsm_2026_data', JSON.stringify(this.completed));
        this.renderContent(DB.treinamentos); 
        this.updateProgress();
    },

    filter(cat, btn) {
        document.querySelectorAll('.training-filters .slicer-btn').forEach(b => b.classList.remove('slicer-active'));
        btn.classList.add('slicer-active');
        const container = document.getElementById('training-grid-container');
        container.style.opacity = '0';
        setTimeout(() => {
            if (cat === 'todos') this.renderContent(DB.treinamentos);
            else this.renderContent(DB.treinamentos.filter(m => m.category.includes(cat)));
            container.style.opacity = '1';
        }, 200);
    },

    updateProgress() {
        const count = this.completed.length;
        const total = DB.treinamentos.length;
        const pct = Math.round((count/total)*100);
        document.getElementById('prog-percent').innerText = `${pct}%`;
        document.getElementById('fill').style.width = `${pct}%`;
    },

    renderContent(data) {
        const container = document.getElementById('training-grid-container');
        container.innerHTML = '';

        data.forEach(m => {
            const isDone = this.completed.includes(m.id);
            let badgeClass = m.type === 'lid' ? 'badge-info' : (m.type === 'tec' ? 'badge-warning' : 'badge-success');

            const html = `
                <div class="module-card ${isDone ? 'done-border' : ''}" id="card-${m.id}">
                    <div class="card-header" onclick="TreinamentosApp.toggleCard(${m.id})">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <div class="status-dot-t ${isDone ? 'done' : ''}"><i class="fas fa-check"></i></div>
                            <div>
                                <h3 style="font-weight:600; font-size:1.05rem;" contenteditable="true" id="mod_${m.id}_t" onblur="GlobalManager.save(this)">${m.title}</h3>
                                <span style="font-size:0.85rem; color:#64748b;" contenteditable="true" id="mod_${m.id}_s" onblur="GlobalManager.save(this)">${m.subtitle}</span>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:15px;">
                            <span class="badge-dash ${badgeClass}">${m.category}</span>
                            <i class="fas fa-chevron-down expand-icon" style="color:#94a3b8;"></i>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="content-wrapper">
                            <div>
                                <h4 style="font-size:0.8rem; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:10px;"><i class="fas fa-book-open"></i> Teoria</h4>
                                <ul style="list-style:none; padding-left:10px; border-left:2px solid #e2e8f0;">
                                    ${m.theory.map((t, i) => `<li style="margin-bottom:8px; font-size:0.9rem; color:#475569;"><span contenteditable="true" id="mod_${m.id}_th_${i}" onblur="GlobalManager.save(this)">${t}</span></li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <div style="background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0; margin-top:10px;">
                                    <strong style="color:#1e293b; display:block; margin-bottom:5px;">Dinâmica</strong>
                                    <p style="font-size:0.9rem; color:#64748b; font-style:italic;" contenteditable="true" id="mod_${m.id}_d" onblur="GlobalManager.save(this)">${m.drill}</p>
                                </div>
                                <button class="action-btn ${isDone ? 'completed' : ''}" onclick="TreinamentosApp.toggleStatus(event, ${m.id})">
                                    <i class="fas ${isDone ? 'fa-check-circle' : 'fa-circle'}"></i>
                                    ${isDone ? 'Concluído' : 'Marcar Conclusão'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
        GlobalManager.init();
    }
};
