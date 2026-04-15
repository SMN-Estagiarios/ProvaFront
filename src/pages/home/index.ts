import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from "components/jquery";
import Toast from "components/toast";

UIkit.use(Icons);

interface IModelHome {
    urls: {
        resumo: string;
        proximosVencimentos: string;
        listarLancamentos: string;
    };
}
interface IResumo {
    quantidadePendentes: number
    saldo: number
    totalEntradas: number
    totalSaidas: number
}

interface ILancamento {
    categoriaId: number
    categoriaNome: string
    contaId: number
    contaNome: string
    dataCompetencia: string
    descricao: string
    id: number
    observacao: string
    pago: boolean
    tipo: number | string
    valor: number
}

interface ILancamentoAgrupado {
    nome: string;
    valor: number;
}

interface IDespesaPorCategoria {
    nome: string;
    valor: number;
}
interface IResumoDespesas {
    despesasPorCategoria: IDespesaPorCategoria[];
    totalSaidas: number;
}
interface ICategoria {
    nome: string
    valor: number;
}
interface IVencimento {
    categoriaNome: string
    contaNome: string
    dataCompetencia: string
    descricao: string
    id: number
    valor: number
}
let model: IModelHome;

export function init(params: IModelHome) {
    model = params;
    configurarFiltrosIniciais();
    carregarDashboard();
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
    $.get(model.urls.resumo, { ano, mes }, (resumo: IResumo ) => {
        atualizarCardsResumo(resumo);
        carregarDespesasPorCategoria(ano, mes);
    }).fail((xhr) => Toast.error(xhr.responseText || 'Erro ao carregar resumo'));
}

function carregarDespesasPorCategoria(ano: string, mes: string) {
    $.get(model.urls.listarLancamentos, { ano, mes, tipo: 'Saida' }, (lancamentos: ILancamento[]) => {

        const despesasPorCategoria = agruparDespesasPorCategoria(lancamentos);

        renderizarCategorias({
            despesasPorCategoria,
            totalSaidas: calcularTotalDespesas(lancamentos)
        });

    }).fail((xhr) => Toast.error(xhr.responseText || 'Erro ao carregar despesas por categoria'));
}

function agruparDespesasPorCategoria(lancamentos: ILancamento[]): ILancamentoAgrupado[] {
    const agrupado: { [key: string]: number } = {};

    lancamentos.forEach((lancamento: ILancamento) => {
        const categoria = lancamento.categoriaNome || 'Sem categoria';
        const valor = lancamento.valor || 0;
        agrupado[categoria] = (agrupado[categoria] || 0) + valor;
    });

    return Object.keys(agrupado).map(nome => ({
        nome,
        valor: agrupado[nome]
    }));
}

function calcularTotalDespesas(lancamentos: ILancamento[]): number {
    return lancamentos.reduce((total, lancamento) => total + (lancamento?.valor || 0), 0);
}

function atualizarCardsResumo(resumo: IResumo) {
    $('#resumo-receitas').text(formatarMoeda(resumo?.totalEntradas || 0));
    $('#resumo-despesas').text(formatarMoeda(resumo?.totalSaidas || 0));
    $('#resumo-saldo').text(formatarMoeda(resumo?.saldo || 0));
}

function renderizarCategorias(despesa: IResumoDespesas) {
    const categorias = despesa?.despesasPorCategoria || [];
    const total = despesa?.totalSaidas || 0;

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

    categorias.forEach((categoria: ICategoria) => {
        const valor = categoria?.valor || 0;
        const percentual = (valor / total) * 100;

        html += criarItemCategoria(categoria?.nome, valor, percentual);
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
    $.get(model.urls.proximosVencimentos, (vencimentos: IVencimento[]) => {
        if (!Array.isArray(vencimentos) || !vencimentos.length) {
            $('#lista-vencimentos').html(
                '<li class="uk-text-muted">Nenhum vencimento pendente.</li>'
            );
            return;
        }

        let html = '';

        vencimentos.forEach((vencimento: IVencimento) => {
            html += criarItemVencimento(vencimento);
        });

        $('#lista-vencimentos').html(html);
    });
}

function criarItemVencimento(vencimento: IVencimento) {
    const hoje = new Date();
    const dataVencimento = new Date(vencimento.dataCompetencia);

    const classe = dataVencimento < hoje ? 'uk-label-danger' : 'uk-label-success';

    return `
        <li>
            <div class="uk-grid-small uk-flex-middle uk-visible@m" uk-grid>
                <div class="uk-width-1-3">
                    <span class="uk-text-truncate uk-text-emphasis uk-display-block">
                        ${vencimento.descricao}
                    </span>
                </div>

                <div class="uk-width-1-4">
                    <span class="uk-text-muted uk-text-small">
                        ${vencimento.categoriaNome}
                    </span>
                </div>

                <div class="uk-width-1-5 uk-text-center">
                    <span class="uk-text-bold">
                        R$ ${vencimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <div class="uk-width-expand uk-text-right">
                    <span class="uk-label ${classe}">
                        ${formatarData(vencimento.dataCompetencia)}
                    </span>
                </div>
            </div>

            <div class="uk-hidden@m uk-card uk-card-muted uk-card-body uk-border-rounded uk-padding-small">
                <div class="uk-margin-small-bottom">
                    <div class="uk-text-bold uk-text-small">Descrição</div>
                    <div class="uk-text-emphasis">
                        ${vencimento.descricao}
                    </div>
                </div>

                <div class="uk-margin-small-bottom">
                    <div class="uk-text-bold uk-text-small">Categoria</div>
                    <div class="uk-text-muted">
                        ${vencimento.categoriaNome}
                    </div>
                </div>

                <div class="uk-margin-small-bottom">
                    <div class="uk-text-bold uk-text-small">Valor</div>
                    <div class="uk-text-bold">
                        R$ ${vencimento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div>
                    <div class="uk-text-bold uk-text-small">Data</div>
                    <span class="uk-label ${classe}">
                        ${formatarData(vencimento.dataCompetencia)}
                    </span>
                </div>
            </div>
        </li>
    `;
}

function configurarEventos() {
    $('#form-filtros').on('submit', (e) => {
        e.preventDefault();
        carregarDashboard();
    });
}

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(dataStr?: string) {
    if (!dataStr)
        return '-';

    const data = new Date(dataStr);
    if (isNaN(data.getTime()))
        return '-';

    return data.toLocaleDateString('pt-BR');
}
