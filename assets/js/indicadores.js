const Indicadores = {
    year: '2025',
    currentTab: 'overview',

    init() {
        this.render();
    },

    setYear(y) {
        this.year = y;
        this.render();
    },

    setTab(t, btn) {
        this.currentTab = t;
        // Update tabs visually
        document.querySelectorAll('.dash-tab').forEach(b => b.classList.remove('active', 'bg-slate-100', 'text-blue-600'));
        btn.classList.add('active', 'bg-slate-100', 'text-blue-600');
        this.render();
    },

    render() {
        const container = document.getElementById('indicadores-container');
        const data = DB.indicadores[this.year];
        
        if(this.currentTab === 'overview') {
            container.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div class="flex justify-between mb-4">
                            <h3 class="font-bold text-slate-700">Evolução Mensal (%)</h3>
                            <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">${this.year}</span>
                        </div>
                        <div class="h-[300px]"><canvas id="chartMain"></canvas></div>
                    </div>
                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2"><i class="ph-fill ph-lightbulb text-yellow-500"></i> Destaques</h3>
                        <div class="space-y-3 flex-1">
                            ${data.insights.all.map(i => `
                                <div class="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100 flex gap-3">
                                    <div class="w-1 bg-blue-500 rounded-full"></div>
                                    ${i}
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-400 uppercase">
                            <span>Status Anual</span>
                            <span class="text-emerald-500">Positivo</span>
                        </div>
                    </div>
                </div>
            `;
            setTimeout(() => this.drawChart('chartMain', 'line', data.conformidade.labels, data.conformidade.values, '#2563eb'), 50);
        }
        else if (this.currentTab === 'conformidade') {
            container.innerHTML = `
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                    <h3 class="font-bold text-slate-700 mb-4">Obstruções: Extintores vs Hidrantes</h3>
                    <div class="h-[350px]"><canvas id="chartObs"></canvas></div>
                </div>
            `;
            setTimeout(() => {
                const ctx = document.getElementById('chartObs').getContext('2d');
                if(window.myChart2) window.myChart2.destroy();
                window.myChart2 = new Chart(ctx, {
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
        }
        else {
            container.innerHTML = `
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                    <div class="flex justify-between mb-4">
                        <h3 class="font-bold text-slate-700">Tempo de Resposta (Segundos)</h3>
                        <span class="badge badge-success">Meta: 180s</span>
                    </div>
                    <div class="h-[350px]"><canvas id="chartEvac"></canvas></div>
                </div>
            `;
            setTimeout(() => this.drawChart('chartEvac', 'line', data.evacuacao.labels, data.evacuacao.tempos, '#10b981'), 50);
        }
    },

    drawChart(id, type, labels, dataPoints, color) {
        const ctx = document.getElementById(id).getContext('2d');
        if(window.myChart1 && id === 'chartMain') window.myChart1.destroy();
        if(window.myChart3 && id === 'chartEvac') window.myChart3.destroy();

        const chart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valor',
                    data: dataPoints,
                    borderColor: color,
                    backgroundColor: color + '20', // Opacity
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });

        if(id === 'chartMain') window.myChart1 = chart;
        if(id === 'chartEvac') window.myChart3 = chart;
    }
};
