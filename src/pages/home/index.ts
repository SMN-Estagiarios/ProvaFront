import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from "components/jquery";
import Toast from "components/toast";

UIkit.use(Icons);

interface IModelHome {
    message?: {
        error?: string;
        success?: string;
    };
    urls: {
        resumo: string;
        proximosVencimentos: string;
        listarLancamentos: string;
        buscarLancamento: string;
        cadastrarLancamento: string;
        editarLancamento: string;
        excluirLancamento: string;
        listarCategorias: string;
        buscarCategoria: string;
        cadastrarCategoria: string;
        editarCategoria: string;
        excluirCategoria: string;
        listarContas: string;
        buscarConta: string;
        cadastrarConta: string;
        editarConta: string;
        excluirConta: string;
    };
}

let model: IModelHome;

export function init(params: IModelHome) {
    model = params;
    configurarFiltrosIniciais();
    carregarDashboard();
    listarLancamentos();
    configurarEventos();
}

function configurarFiltrosIniciais() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();

    $('#filtro-periodo').val(`${ano}-${mes}`);
}

function obterPeriodo() {
    const valor = String($('#filtro-periodo').val() || '');
    const partes = valor.split('-');

    if (partes.length === 2) {
        return {
            ano: partes[0],
            mes: partes[1]
        };
    }

    const hoje = new Date();

    return {
        ano: String(hoje.getFullYear()),
        mes: String(hoje.getMonth() + 1).padStart(2, '0')
    };
}

function carregarDashboard() {
    const { ano, mes } = obterPeriodo();

    carregarResumo(ano, mes);
    carregarVencimentos();
}

function carregarResumo(ano: string, mes: string) {
    $.get(model.urls.resumo, { ano, mes }, (data) => {
        atualizarCardsResumo(data);
        carregarDespesasPorCategoria(ano, mes);
    }).fail((xhr) => Toast.error(xhr.responseText || 'Erro ao carregar resumo'));
}

function carregarDespesasPorCategoria(ano: string, mes: string) {
    $.get(model.urls.listarLancamentos, { ano, mes, tipo: 'Saida' }, (lancamentos) => {
        const despesasPorCategoria = agruparDespesasPorCategoria(lancamentos);
        renderizarCategorias({ despesasPorCategoria, totalSaidas: calcularTotalDespesas(lancamentos) });
    }).fail((xhr) => Toast.error(xhr.responseText || 'Erro ao carregar despesas por categoria'));
}

function agruparDespesasPorCategoria(lancamentos: any[]): any[] {
    const agrupado: { [key: string]: number } = {};

    lancamentos.forEach((l: any) => {
        const categoria = l?.categoriaNome || 'Sem categoria';
        const valor = l?.valor || 0;
        agrupado[categoria] = (agrupado[categoria] || 0) + valor;
    });

    return Object.keys(agrupado).map(nome => ({
        nome,
        valor: agrupado[nome]
    }));
}

function calcularTotalDespesas(lancamentos: any[]): number {
    return lancamentos.reduce((total, l) => total + (l?.valor || 0), 0);
}

function atualizarCardsResumo(data: any) {
    $('#resumo-receitas').text(formatarMoeda(data?.totalEntradas || 0));
    $('#resumo-despesas').text(formatarMoeda(data?.totalSaidas || 0));
    $('#resumo-saldo').text(formatarMoeda(data?.saldo || 0));
    console.log("dados no atualizarCardsResumo", data);
    
}

function renderizarCategorias(data: any) {
    console.log("Dados que chegam na renderizarCategorias", data);
    
    const categorias = data?.despesasPorCategoria || [];
    const total = data?.totalSaidas || 0;

    if (!categorias.length) {
        $('#container-categorias-grafico').html(
            '<p class="uk-text-muted uk-text-small">Sem despesas registradas.</p>'
        );
        return;
    }

    if (total === 0) {
        $('#container-categorias-grafico').html(
            '<p class="uk-text-muted uk-text-small">Sem valores para exibir.</p>'
        );
        return;
    }

    let html = '';

    categorias.forEach((cat: any) => {
        const valor = cat?.valor || 0;
        const percentual = (valor / total) * 100;

        html += criarItemCategoria(cat?.nome, valor, percentual);
    });

    $('#container-categorias-grafico').html(html);
}

function criarItemCategoria(nome: string, valor: number, percentual: number) {
    return `
        <div class="uk-margin-small-bottom">
            <div class="uk-flex uk-flex-between uk-text-small">
                <span>${nome || '-'}</span>
                <span>${formatarMoeda(valor)}</span>
            </div>
            <progress class="uk-progress" value="${percentual}" max="100"></progress>
        </div>
    `;
}

function carregarVencimentos() {
    $.get(model.urls.proximosVencimentos, (data) => {
        if (!Array.isArray(data) || !data.length) {
            $('#lista-vencimentos').html(
                '<li class="uk-text-muted">Nenhum vencimento pendente.</li>'
            );
            return;
        }

        let html = '';

        data.forEach((v: any) => {
            html += criarItemVencimento(v);
        });

        $('#lista-vencimentos').html(html);
    });
}

function criarItemVencimento(v: any) {
    const hoje = new Date();
    const dataVencimento = new Date(v?.dataCompetencia);
    const classe = dataVencimento < hoje ? 'uk-label-danger' : 'uk-label-success';

    return `
        <li class="uk-flex uk-flex-between">
            <span>${v?.descricao || '-'}</span>
            <span class="uk-label ${classe}">
                ${formatarData(v?.dataCompetencia)}
            </span>
        </li>
    `;
}

export function listarLancamentos() {
    const { ano, mes } = obterPeriodo();

    const filtros = {
        ano,
        mes,
        tipo: $('#filtro-tipo').val()
    };

    $.get(model.urls.listarLancamentos, filtros, (data) => {
        renderizarLancamentos(data);
    });
}

function renderizarLancamentos(lista: any[]) {
    const header = $('#lista-lancamentos li:first-child');

    $('#lista-lancamentos').empty().append(header);

    if (!Array.isArray(lista) || !lista.length) {
        $('#lista-lancamentos').append(
            '<li class="uk-padding uk-text-center uk-text-muted">Nenhum registro encontrado.</li>'
        );
        return;
    }

    lista.forEach((item) => {
        $('#lista-lancamentos').append(criarItemLancamento(item));
    });
}

function criarItemLancamento(l: any) {
    const valorClass = l?.tipo === 1 ? 'uk-text-success' : 'uk-text-danger';

    return `
        <li class="uk-card uk-card-default uk-card-body uk-margin-small-bottom uk-padding-small" uk-grid>
            <div class="uk-width-1-5@m">
                <span>${formatarData(l?.data)}</span>
            </div>

            <div class="uk-width-expand@m">
                <div class="uk-text-bold">${l?.descricao || '-'}</div>
                <div class="uk-text-meta">${l?.categoriaNome || '-'}</div>
            </div>

            <div class="uk-width-1-5@m">
                <span>${l?.contaNome || '-'}</span>
            </div>

            <div class="uk-width-1-5@m">
                <span class="${valorClass}">
                    ${formatarMoeda(l?.valor || 0)}
                </span>
            </div>
        </li>
    `;
}


function configurarEventos() {
    $('#form-filtros').on('submit', (e) => {
        e.preventDefault();
        carregarDashboard();
        listarLancamentos();
    });
}

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(dataStr?: string) {
    if (!dataStr) return '-';

    const data = new Date(dataStr);
    if (isNaN(data.getTime())) return '-';

    return data.toLocaleDateString('pt-BR');
}