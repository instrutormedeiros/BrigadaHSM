const Escala = {
    data: {},
    currentMonth: 0, // 0 = Jan

    init() {
        const d = new Date();
        if(d.getFullYear() === DB.config.year) this.currentMonth = d.getMonth();
        
        // Load or Default
        const saved = localStorage.getItem('hsm_escala_v4');
        if(saved) this.data = JSON.parse(saved);
        else this.data = JSON.parse(JSON.stringify(DB.teamTemplate)); // Deep copy

        // Fix: Expand arrays to avoid repetition bugs
        this.expand(this.data.day);
        this.expand(this.data.night);
        
        this.render();
        this.updateDashboardWidget();
    },

    expand(list) {
        list.forEach(m => {
            if(m.ptr.length < 32) {
                // Preenche até 32 dias baseado no padrão inicial
                let expanded = [];
                for(let i=0; i<32; i++) expanded.push(m.ptr[i % m.ptr.length]);
                m.ptr = expanded;
            }
        });
    },

    render() {
        const m = this.currentMonth;
        const year = DB.config.year;
        const daysInMonth = new Date(year, m + 1, 0).getDate();
        const startDay = new Date(year, m, 1).getDay(); // 0=Dom

        // Update Header
        document.getElementById('escala-month-display').innerText = `${DB.config.months[m]} ${year}`;

        // Build Table Head
        let theadHtml = `<tr><th class="col-fixed w-48 text-left pl-4">NOME</th><th class="col-fixed w-16 text-center left-48">MATR.</th>`;
        for(let i=1; i<=daysInMonth; i++) {
            theadHtml += `<th class="text-center w-10">${i}</th>`;
        }
        theadHtml += `</tr><tr><th class="col-fixed bg-white"></th><th class="col-fixed bg-white left-48"></th>`; // Spacer row for days of week
        
        // Days of week row
        let wd = startDay;
        for(let i=1; i<=daysInMonth; i++) {
            const isWeekend = (wd===0 || wd===6);
            theadHtml += `<th class="text-center ${isWeekend ? 'bg-slate-100 text-red-500' : ''}">${DB.config.weekDays[wd]}</th>`;
            wd = (wd+1)%7;
        }
        theadHtml += `</tr>`;
        document.getElementById('escala-head').innerHTML = theadHtml;

        // Build Body
        const tbody = document.getElementById('escala-body');
        tbody.innerHTML = '';

        const buildRows = (list, type) => {
            return list.map((p, idx) => {
                let html = `<tr class="hover:bg-slate-50">
                    <td class="col-fixed font-bold text-slate-700 text-xs border-b border-r px-2 py-1 bg-white" contenteditable="true" onblur="Escala.saveName('${type}',${idx},this.innerText)">${p.name}</td>
                    <td class="col-fixed text-slate-500 font-mono text-xs border-b border-r text-center bg-white left-48">${p.id}</td>`;
                
                let cwd = startDay;
                for(let i=0; i<daysInMonth; i++) {
                    const statusVal = p.ptr[i]; // Direct index access (safe due to expand)
                    const statusObj = DB.config.status.find(s => s.code === statusVal) || DB.config.status[2];
                    const isWeekend = (cwd===0 || cwd===6);
                    
                    html += `<td class="border-b border-r text-center p-1 ${isWeekend ? 'bg-slate-50' : ''}">
                        <div class="${statusObj.class} w-full h-full flex items-center justify-center text-[10px]" 
                             onclick="Escala.toggle('${type}', ${idx}, ${i})">
                             ${statusObj.label}
                        </div>
                    </td>`;
                    cwd = (cwd+1)%7;
                }
                return html + '</tr>';
            }).join('');
        };

        tbody.innerHTML += `<tr><td colspan="${daysInMonth+2}" class="bg-blue-900 text-white font-bold text-xs px-4 py-1 uppercase tracking-wider">Equipe Diurna (Dia)</td></tr>`;
        tbody.innerHTML += buildRows(this.data.day, 'day');
        
        tbody.innerHTML += `<tr><td colspan="${daysInMonth+2}" class="bg-slate-800 text-white font-bold text-xs px-4 py-1 uppercase tracking-wider">Equipe Noturna (Noite)</td></tr>`;
        tbody.innerHTML += buildRows(this.data.night, 'night');

        this.renderChecklists();
    },

    toggle(type, memberIdx, dayIdx) {
        // Cycle status: 0->1->2->3->4->0
        let val = this.data[type][memberIdx].ptr[dayIdx];
        val = (val + 1) % 5;
        this.data[type][memberIdx].ptr[dayIdx] = val;
        this.save();
        this.render();
    },

    saveName(type, idx, val) {
        this.data[type][idx].name = val;
        this.save();
    },

    save() {
        localStorage.setItem('hsm_escala_v4', JSON.stringify(this.data));
        this.updateDashboardWidget();
    },

    changeMonth(dir) {
        this.currentMonth += dir;
        if(this.currentMonth < 0) this.currentMonth = 0;
        if(this.currentMonth > 11) this.currentMonth = 11;
        this.render();
    },

    reset() {
        if(confirm('Restaurar escala padrão?')) {
            localStorage.removeItem('hsm_escala_v4');
            location.reload();
        }
    },

    renderChecklists() {
        const all = [...this.data.day, ...this.data.night];
        const tasks = ["Hidrantes","Bombas","Portas","Aterramento","Luz","Extintores","Alarmes","Rota","Hidrantes"];
        
        const makeList = (t) => all.map((p,i) => `
            <div class="flex justify-between border-b border-slate-50 py-1">
                <span class="font-bold text-slate-700">${p.name.split(' ')[0]}</span>
                <span class="text-slate-400">${t ? (tasks[i]||'') : ''}</span>
            </div>`).join('');

        document.getElementById('footer-list-1').innerHTML = makeList(true);
        document.getElementById('footer-list-2').innerHTML = makeList(false);
        document.getElementById('footer-list-3').innerHTML = makeList(false);
    },

    updateDashboardWidget() {
        // Logic to update the home screen "Plantão Hoje"
        const d = new Date();
        const todayIdx = d.getDate() - 1; // 0-based
        
        let active = [];
        const check = (list, role) => list.forEach(m => {
            if(m.ptr[todayIdx] === 0 || m.ptr[todayIdx] === 1) active.push({...m, role});
        });
        check(this.data.day, "Dia");
        check(this.data.night, "Noite");

        const el = document.getElementById('dash-team-list');
        const countEl = document.getElementById('dash-plantao-count');
        
        if(el) {
            el.innerHTML = active.map(p => `
                <div class="flex items-center gap-3 bg-slate-800 p-2 rounded">
                    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">${p.name.substring(0,2)}</div>
                    <div>
                        <div class="font-bold text-sm leading-none">${p.name}</div>
                        <div class="text-[10px] text-slate-400">${p.role}</div>
                    </div>
                </div>
            `).join('') || '<div class="text-slate-500 italic text-sm">Ninguém escalado.</div>';
        }
        if(countEl) countEl.innerText = active.length;
        
        const teamNames = active.map(p => p.name.split(' ')[0]).join(', ');
        const teamLabel = document.getElementById('dash-plantao-team');
        if(teamLabel) teamLabel.innerText = teamNames || 'Sem escala hoje';
    }
};
