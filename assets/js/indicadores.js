const IndicadoresApp = {
    state: { year: '2025', month: 'all', tab: 'overview' },

    init() {
        this.renderMonthSlicer();
        this.renderContent();
    },

    filterByYear(year) {
        this.state.year = year;
        document.querySelectorAll('[id^="btn-year-"]').forEach(b => b.classList.remove('slicer-active'));
        document.getElementById('btn-year-' + year).classList.add('slicer-active');
        this.renderContent();
    },

    switchTab(tab) {
        this.state.tab = tab;
        document.querySelectorAll('.tab-btn-dash').forEach(b => b.classList.remove('active'));
        document.getElementById('tab-btn-' + tab).classList.add('active');
        this.renderContent();
    },

    renderMonthSlicer() {
        const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        let html = `<button class="slicer-btn slicer-active" onclick="IndicadoresApp.filterMonth('all', this)">Todos</button>`;
        months.forEach(m => {
            html += `<button class="slicer-btn" onclick="IndicadoresApp.filterMonth('${m}', this)">${m}</button>`;
        });
        document.getElementById('month-slicer').innerHTML = html;
    },

    filterMonth(month, btn) {
        this.state.month = month;
        document.querySelectorAll('#month-slicer .slicer-btn').forEach(b => b.classList.remove('slicer-active'));
        btn.classList.add('slicer-active');
        this.renderContent();
    },

    renderContent() {
        const container = document.getElementById('indicadores-content');
        const data = DB.indicadores[this.state.year];
        
        if(this.state.tab === 'overview') {
            const lastIdx = data.conformidade.values.length - 1;
            container.innerHTML = `
                <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-lg:tw-grid-cols-4 tw-gap-4 tw-mb-6">
                    ${this.kpiHtml('Conformidade', data.conformidade.values[lastIdx] + '%', 'ph-shield-check', 'tw-text-blue-600')}
                    ${this.kpiHtml('Obstruções', '8 Itens', 'ph-warning-circle', 'tw-text-orange-500')}
                    ${this.kpiHtml('Evacuação', '03:05', 'ph-timer', 'tw-text-emerald-500')}
                    ${this.kpiHtml('Brigada', '55/109', 'ph-users-three', 'tw-text-purple-500')}
                </div>
                <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
                    <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-slate-200 tw-shadow-sm">
                        <h3 class="tw-font-bold tw-text-slate-700 tw-mb-4">Evolução Mensal</h3>
                        <div class="tw-h-[300px]"><canvas id="chartConformidade"></canvas></div>
                    </div>
                    <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-slate-200 tw-shadow-sm">
                        <h3 class="tw-font-bold tw-text-slate-700 tw-mb-4">Insights</h3>
                        <div class="tw-space-y-3">
                            ${data.insights.all.map(i => `<div class="tw-bg-slate-50 tw-p-3 tw-rounded-lg tw-text-sm tw-text-slate-600 tw-flex tw-gap-2"><i class="ph-fill ph-lightbulb tw-text-yellow-500"></i> ${i}</div>`).join('')}
                        </div>
                    </div>
                </div>`;
            this.renderChart('chartConformidade', 'line', data.conformidade.labels, data.conformidade.values, '#2563eb');
        } else if (this.state.tab === 'conformidade') {
            container.innerHTML = `
                <div class="tw-grid tw-grid-cols-1 tw-gap-6">
                    <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-slate-200">
                        <h3 class="tw-font-bold tw-mb-4">Obstruções por Equipamento</h3>
                        <div class="tw-h-[350px]"><canvas id="chartObstrucoes"></canvas></div>
                    </div>
                </div>`;
            setTimeout(() => {
                const ctx = document.getElementById('chartObstrucoes').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.conformidade.labels,
                        datasets: [
                            { label: 'Extintores', data: data.obstrucoes.extintores, backgroundColor: '#ef4444' },
                            { label: 'Hidrantes', data: data.obstrucoes.hidrantes, backgroundColor: '#3b82f6' }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }, 50);
        } else {
            container.innerHTML = `
                <div class="tw-bg-white tw-p-6 tw-rounded-xl tw-border tw-border-slate-200">
                    <div class="tw-flex tw-justify-between tw-mb-4">
                        <h3 class="tw-font-bold">Histórico de Tempos (Segundos)</h3>
                        <span class="badge-success">Meta: 180s</span>
                    </div>
                    <div class="tw-h-[350px]"><canvas id="chartEvac"></canvas></div>
                </div>`;
            this.renderChart('chartEvac', 'line', data.evacuacao.labels, data.evacuacao.tempos, '#10b981');
        }
    },

    kpiHtml(label, value, icon, color) {
        return `
            <div class="tw-bg-white tw-p-5 tw-rounded-xl tw-border tw-border-slate-200 tw-shadow-sm tw-flex tw-justify-between tw-items-start">
                <div>
                    <p class="tw-text-xs tw-font-bold tw-text-slate-400 tw-uppercase">${label}</p>
                    <h4 class="tw-text-2xl tw-font-bold tw-text-slate-800 tw-mt-1">${value}</h4>
                </div>
                <i class="ph-fill ${icon} tw-text-3xl ${color}"></i>
            </div>`;
    },

    renderChart(id, type, labels, dataPoints, color) {
        setTimeout(() => {
            const ctx = document.getElementById(id);
            if(!ctx) return;
            const existing = Chart.getChart(id);
            if(existing) existing.destroy();

            new Chart(ctx.getContext('2d'), {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Dados',
                        data: dataPoints,
                        borderColor: color,
                        backgroundColor: color + '20',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }, 50);
    }
};
