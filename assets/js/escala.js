const EscalaApp = {
    currentMonth: 0,
    teams: {}, 

    init() {
        const now = new Date();
        if(now.getFullYear() === DB.config.year) this.currentMonth = now.getMonth();
        
        const saved = localStorage.getItem('hsm_teams_data_fix_v2');
        if (saved) {
            this.teams = JSON.parse(saved);
        } else {
            this.teams = JSON.parse(JSON.stringify(DB.defaultTeam));
        }
        this.expandPatterns(this.teams.day);
        this.expandPatterns(this.teams.night);
        this.render();
        this.initDashboardWidget(); 
    },

    expandPatterns(teamList) {
        teamList.forEach(member => {
            if (member.ptr.length < 28) {
                const newPtr = [];
                for (let i = 0; i < 32; i++) {
                    newPtr.push(member.ptr[i % member.ptr.length]);
                }
                member.ptr = newPtr;
            }
        });
    },

    saveData() {
        localStorage.setItem('hsm_teams_data_fix_v2', JSON.stringify(this.teams));
        this.initDashboardWidget();
    },

    toggle(type, memberIdx, dayIdx) {
        const currentCode = this.teams[type][memberIdx].ptr[dayIdx];
        const nextCode = (currentCode + 1) % 5;
        this.teams[type][memberIdx].ptr[dayIdx] = nextCode;
        this.saveData();
        this.render(); 
    },

    updateName(type, memberIdx, newName) {
        this.teams[type][memberIdx].name = newName;
        this.saveData();
    },

    changeMonth(dir) {
        this.currentMonth += dir;
        if(this.currentMonth < 0) this.currentMonth = 0;
        if(this.currentMonth > 11) this.currentMonth = 11;
        this.render();
    },

    resetMonth() {
        if(confirm("Resetar escala para o padrão?")) {
            localStorage.removeItem('hsm_teams_data_fix_v2');
            location.reload();
        }
    },

    render() {
        const m = this.currentMonth;
        const daysTotal = new Date(DB.config.year, m + 1, 0).getDate();
        const startDay = new Date(DB.config.year, m, 1).getDay();

        document.getElementById('displayMonth').innerText = `${DB.config.months[m]} ${DB.config.year}`;

        let htmlHead = `<tr class="th-days"><th colspan="2" style="text-align:left; padding-left:15px;">BRIGADA DE INCÊNDIO</th>`;
        for(let i=1; i<=daysTotal; i++) htmlHead += `<th>${i}</th>`;
        htmlHead += `</tr><tr class="th-week"><th class="col-sticky">NOME</th><th class="col-id">MATR.</th>`;
        
        let wd = startDay;
        for(let i=1; i<=daysTotal; i++) {
            const isWeekend = (wd===0 || wd===6);
            htmlHead += `<th class="${isWeekend ? 'weekend-th' : ''}">${DB.config.weekDays[wd]}</th>`;
            wd = (wd+1)%7;
        }
        htmlHead += `</tr>`;
        document.getElementById('tableHead').innerHTML = htmlHead;

        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = "";

        const createRow = (person, type, pIdx) => {
            let html = `<tr>
                <td class="col-sticky" contenteditable="true" onblur="EscalaApp.updateName('${type}', ${pIdx}, this.innerText)">${person.name}</td>
                <td class="col-id">${person.id}</td>`;
            
            let currentWd = startDay;
            for(let i=0; i<daysTotal; i++) {
                const code = person.ptr[i] !== undefined ? person.ptr[i] : 2;
                const st = DB.config.status.find(s => s.code === code) || DB.config.status[2];
                const isWeekend = (currentWd===0 || currentWd===6);
                html += `<td class="cell-status ${st.class} ${isWeekend && code !== 3 ? 'weekend-col' : ''}"
                             onclick="EscalaApp.toggle('${type}', ${pIdx}, ${i})">
                             ${st.label}
                         </td>`;
                currentWd = (currentWd+1)%7;
            }
            html += "</tr>";
            return html;
        };

        tbody.innerHTML += `<tr><td colspan="${daysTotal+2}" class="section-header-row">EQUIPE DIURNA (DIA)</td></tr>`;
        this.teams.day.forEach((p, i) => tbody.innerHTML += createRow(p, 'day', i));
        tbody.innerHTML += `<tr><td colspan="${daysTotal+2}" class="section-header-row">EQUIPE NOTURNA (NOITE)</td></tr>`;
        this.teams.night.forEach((p, i) => tbody.innerHTML += createRow(p, 'night', i));

        this.renderFooter();
    },

    renderFooter() {
        const tasksDefault = ["Hidrantes","Bombas","Portas Emerg.","Aterramento","Portas","Hidrantes","Aterramento","Luminárias","Bombas"];
        const allStaff = [...this.teams.day, ...this.teams.night];
        
        const createList = (listId, withTask) => {
            const container = document.getElementById(listId);
            container.innerHTML = allStaff.map((p, i) => `
                <div class="task-row">
                    <span class="task-name">${p.name}</span>
                    <span class="task-desc" contenteditable="true" id="${listId}_t_${p.id}" onblur="GlobalManager.save(this)">${withTask ? (tasksDefault[i] || "") : ""}</span>
                </div>
            `).join("");
        };
        createList("listCheck1", true);
        createList("listCheck2", false);
        createList("listCheck3", false);
        GlobalManager.init();
    },

    // Widget do Dashboard Inicial
    initDashboardWidget() {
        const now = new Date();
        const day = now.getDate();
        const monthIdx = now.getMonth();
        const weekNames = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
        
        document.getElementById('dashboardDate').innerHTML = `HOSPITAL SANTA MARTA<br><span style="color:#1e293b; font-size:14px;">${weekNames[now.getDay()]}, ${day} DE ${DB.config.months[monthIdx].substring(0,3)}</span>`;
        document.getElementById('shiftLabel').innerText = `Equipe do dia ${day}/${monthIdx+1}`;

        const dayIndex = day - 1;
        const activeTeam = [];
        
        // Função auxiliar para checar status
        const check = (list, role) => {
            list.forEach(m => {
                const s = m.ptr[dayIndex] !== undefined ? m.ptr[dayIndex] : 2;
                if(s === 0 || s === 1) activeTeam.push({...m, role});
            });
        };
        
        check(this.teams.day, "Brigadista (Dia)");
        check(this.teams.night, "Brigadista (Noite)");

        const container = document.getElementById('teamListContainer');
        container.innerHTML = "";
        if(activeTeam.length === 0) container.innerHTML = "<div style='text-align:center; font-size:12px; opacity:0.7;'>Ninguém escalado.</div>";
        else {
            activeTeam.forEach(p => {
                const initials = p.name.split(" ").map(n=>n[0]).join("").substring(0,2);
                container.innerHTML += `
                    <div class="team-member">
                        <img src="https://ui-avatars.com/api/?name=${initials}&background=random&color=fff">
                        <div style="line-height:1.2;"><h6 style="font-size:13px; font-weight:600;">${p.name.split(" ")[0]}</h6><span style="font-size:10px; opacity:0.7;">${p.role}</span></div>
                    </div>`;
            });
        }
    }
};
