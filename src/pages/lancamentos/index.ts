import 'styles/index.less';
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from 'jquery';
import toast from 'components/toast';

UIkit.use(Icons);

interface IModelLancamentos {
    urls: {
        listar: string;
        buscar: string;
        cadastrar: string;
        editar: string;
        excluir: string;
        categorias: string;
        contas: string;
        abrirModalLancamento: string;
    };
}

interface ILancamento {
    id: number;
    descricao: string;
    valor: number;
    dataCompetencia: string;
    tipoLancamento: number;
    categoriaId: number;
    categoriaNome: string;
    contaId: number;
    contaNome: string;
}

interface ICategoria {
    id: number;
    nome: string;
}

interface IConta {
    id: number;
    nome: string;
}

let model: IModelLancamentos;

export function init(params: IModelLancamentos) {
    model = params;

    carregarCategorias();
    carregarContas();
    carregarLancamentos();
}

function limparFiltros() {
    $('#filtroDescricao').val('');
    $('#filtroTipo').val('');
    $('#filtroCategoria').val('');
    $('#filtroConta').val('');
    $('#ano').val('');
    $('#mes').val('');
    $('#pago').val('');
}

function limparFormulario() {
    $('#lancamentoId').val('');
    $('#descricao').val('');
    $('#tipoLancamento').val('1');
    $('#valor').val('');
    $('#dataCompetencia').val('');
    $('#categoriaId').val('');
    $('#contaId').val('');
}

function obterFiltros() {
    return {
        termoBusca: ($('#filtroDescricao').val() as string) || '',
        tipoLancamento: ($('#filtroTipo').val() as string) || '',
        categoriaId: ($('#filtroCategoria').val() as string) || '',
        contaId: ($('#filtroConta').val() as string) || '',
        ano: ($('#ano').val() as number) || '',
        mes: ($('#mes').val() as number) || '',
        pago: ($('#pago').val() as string) || '',
    };
}

export function limparBuscar(){
    limparFiltros();
    carregarLancamentos();
}

export function filtrarLancamentos() {
    carregarLancamentos();
}

function carregarLancamentos() {
    const filtros = obterFiltros();

    $.get(model.urls.listar, filtros)
        .done((res: ILancamento[]) => {
            renderizarLancamentos(res);
        })
        .fail(() => {
            toast.error('Não foi possível carregar os lançamentos.');
        });
}

function renderizarLancamentos(lancamentos: ILancamento[]) {
    const $lista = $('#listaLancamentos');
    $lista.empty();

    if (!lancamentos || lancamentos.length === 0) {
        $lista.append(`
            <li>
                <div class="uk-width-expand uk-padding-small">
                    <p class="uk-margin-remove uk-text-secondary uk-text-small uk-text-center">
                        Nenhum lançamento encontrado.
                    </p>
                </div>
            </li>
        `);
        return;
    }

    lancamentos.forEach((item) => {
        $lista.append(`
            <li class="uk-width-expand uk-padding-small uk-grid-collapse uk-border-bottom uk-flex-middle" uk-grid>
                <div class="uk-width-1-1 uk-width-expand@m uk-text-center@m uk-margin-small-bottom@m">
                    <label class="uk-hidden@m uk-margin-small-left uk-text uk-text-bold uk-text-emphasis">Descrição</label>
                    <p class=" uk-margin-small-left uk-margin-remove-bottom uk-margin-remove-top uk-text-secondary uk-text-center@m uk-text-small uk-text@m uk-text-truncate" title="${item.descricao}">
                        ${item.descricao}
                    </p>
                </div>

                <div class="uk-width-1-3 uk-width-expand@m uk-text-center@m uk-text-left">
                    <label class="uk-hidden@m uk-flex uk-flex-center uk-text-small uk-text-bold uk-text-emphasis">Valor</label>
                    <p class="uk-margin-remove uk-flex uk-flex-center uk-text-secondary uk-text-small uk-text-center@m">
                        ${formatarMoeda(item.valor)}
                    </p>
                </div>

                <div class="uk-width-1-3 uk-width-expand@m uk-text-center@m uk-text-left">
                    <label class="uk-hidden@m uk-flex uk-flex-center uk-text-small uk-text-bold uk-text-emphasis">Categoria</label>
                    <p class="uk-margin-remove uk-flex uk-flex-center uk-text-secondary uk-text-center@m uk-text-small">
                        ${item.categoriaNome ?? '-'}
                    </p>
                </div>

                <div class="uk-width-1-3 uk-width-expand@m uk-text-center@m uk-text-left">
                    <label class="uk-hidden@m uk-flex uk-flex-center uk-text-bold uk-text-emphasis uk-text-small">Conta</label>
                    <p class="uk-margin-remove uk-flex uk-flex-center uk-text-secondary uk-text-center@m uk-text-small">
                        ${item.contaNome ?? '-'}
                    </p>
                </div>

                <div class="uk-width-1-3 uk-width-expand@m uk-text-center@m uk-text-left">
                    <label class="uk-hidden@m uk-flex uk-flex-center uk-text-bold uk-text-emphasis uk-text-small">Tipo</label>
                    <p class="uk-margin-remove uk-flex uk-flex-center uk-text-secondary uk-text-center@m uk-text-small">
                        ${item.tipoLancamento === 1 ? 'Entrada' : 'Saída'}
                    </p>
                </div>

                <div class="uk-width-1-3 uk-width-expand@m uk-text-center@m uk-text-left">
                    <label class="uk-hidden@m uk-flex uk-flex-center uk-text-bold uk-text-emphasis uk-text-small">Data</label>
                    <p class="uk-margin-remove uk-flex uk-flex-center uk-text-secondary uk-text-center@m uk-text-small">
                        ${formatarData(item.dataCompetencia)}
                    </p>
                </div>

                <div class="uk-width-1-3 uk-width-expand@m uk-text-center@m uk-margin-bottom-small@m">
                    <label class="uk-hidden@m uk-flex uk-flex-center uk-text-bold uk-text-emphasis uk-text-small">Ações</label>
                    <div class="uk-flex uk-flex-center uk-flex-left uk-text-center@m uk-gap-small">
                        <button type="button"
                                class="uk-icon-button icon-editar uk-margin-right"
                                uk-icon="file-edit"
                                onclick="ProvaFront.lancamentos.abrirModalEditar(${item.id})"
                                title="Editar">
                        </button>

                        <button type="button"
                                class="uk-icon-button icon-excluir"
                                data-excluir="${item.id}"
                                uk-icon="trash"
                                onclick="ProvaFront.lancamentos.excluir(${item.id})"
                                title="Excluir">
                        </button>
                    </div>
                </div>
            </li>
        `);
    });
}

function carregarCategorias() {
    $.get(model.urls.categorias)
        .done((res: ICategoria[]) => {
            preencherSelectCategorias(res);
        })
        .fail(() => {
            toast.error('Não foi possível carregar as categorias.');
        });
}

function preencherSelectCategorias(categorias: ICategoria[]) {
    const $filtroCategoria = $('#filtroCategoria');
    const $categoriaId = $('#categoriaId');

    $filtroCategoria.empty().append(`<option value="">Todas</option>`);
    $categoriaId.empty().append(`<option value="">Selecione</option>`);

    categorias.forEach((item) => {
        $filtroCategoria.append(`<option value="${item.id}">${item.nome}</option>`);
        $categoriaId.append(`<option value="${item.id}">${item.nome}</option>`);
    });
}

function carregarContas() {
    $.get(model.urls.contas)
        .done((res: IConta[]) => {
            preencherSelectContas(res);
        })
        .fail(() => {
            toast.error('Não foi possível carregar as contas.');
        });
}

function preencherSelectContas(contas: IConta[]) {
    const $filtroConta = $('#filtroConta');
    const $contaId = $('#contaId');

    $filtroConta.empty().append(`<option value="">Todas</option>`);
    $contaId.empty().append(`<option value="">Selecione</option>`);

    contas.forEach((item) => {
        $filtroConta.append(`<option value="${item.id}">${item.nome}</option>`);
        $contaId.append(`<option value="${item.id}">${item.nome}</option>`);
    });
}

export function abrirModalCadastro(): void {
    limparFormulario();
    $.get(model.urls.abrirModalLancamento)
        .done(() => {
            UIkit.modal('#modalLancamento').show();
            $('#tituloModalLancamento').text('Novo lançamento');
        })
        .fail((xhr) => {
            toast.error(xhr.responseText || 'Erro ao carregar o modal.');
        });
}

export function salvar(form: HTMLFormElement): void {
    const $form = $(form);
    const payload = {
        id: Number(($form.find("#lancamentoId").val() as string) || 0),
        descricao: ($form.find("#descricao").val() as string) || "",
        valor: Number(($form.find("#valor").val() as string) || 0),
        categoriaNome: $form.find("#categoriaId option:selected").text() || "",
        contaNome: $form.find("#contaId option:selected").text() || "",
        dataCompetencia: ($form.find("#dataCompetencia").val() as string) || "",
        tipo: Number(($form.find("#tipoLancamento").val() as string)),
        categoriaId: Number(($form.find("#categoriaId").val() as string) || 0),
        contaId: Number(($form.find("#contaId").val() as string) || 0),
        pago: $form.find("#pago").is(":checked"),
        observacao: $form.find("#observacao").val() as string || "",
    };

    const id = ($("#lancamentoId").val() as string);
    const url = id ? model.urls.editar : model.urls.cadastrar;

    $.ajax({
        url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload)
        })
        .done(() => {
            toast.success(id ? "Lançamento atualizado com sucesso." : "Lançamento cadastrado com sucesso.");
            UIkit.modal("#modalLancamento").hide();
            carregarLancamentos();
        })
        .fail(() => {
            const mensagem =(id
                ? "Não foi possível atualizar o lançamento."
                : "Não foi possível cadastrar o lançamento.");
            toast.error(mensagem);
        });
}

export function abrirModalEditar(id: number) {
    $.get(`${model.urls.buscar}?id=${id}`)
        .done((res: any) => {
            $('#tituloModalLancamento').text('Editar lançamento');
            $('#lancamentoId').val(res.id);
            $('#descricao').val(res.descricao ?? '');
            $('#tipoLancamento').val(res.tipo ?? '');
            $('#valor').val(res.valor ?? '');
            $('#dataCompetencia').val(res.dataCompetencia ?? '');
            $('#categoriaId').val(res.categoriaId ?? '');
            $('#contaId').val(res.contaId ?? '');
            $('#observacao').val(res.observacao ?? '');
            $('#pago').prop('checked', res.pago ?? false);

            UIkit.modal('#modalLancamento').show();
        })
        .fail(() => {
            toast.error('Não foi possível carregar os dados do lançamento.');
        });
}

export function excluir(id: number) {
    UIkit.modal.confirm('Tem certeza que deseja excluir este lançamento?')
    .then(() => {
        $.post(model.urls.excluir, { id })
            .done(() => {
                toast.success('Lançamento excluído com sucesso.');
                carregarLancamentos();
            })
            .fail(() => {
                toast.error('Não foi possível excluir o lançamento.');
            });
    }).catch(() => {
        
    });
}

function formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(valor);
}

function formatarData(data: string): string {
    if (!data) return '-';

    const partes = data.split('-');
    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export { toast };
