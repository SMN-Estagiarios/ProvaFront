import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from "components/jquery";

import Toast from "components/toast";

UIkit.use(Icons);

interface IModelLancamentos {
    message?: {
        error?: string;
        success?: string;
    };
    urls: {
        buscarLancamentos: string;
        listarCategorias: string;
        abrirModalCadastro: string;
        listarContas: string;
        cadastrarLancamento: string;
    };
}

interface ICategoria {
    id: number;
    nome: string;
    cor?: string;
}

interface IConta {
    id: number;
    nome: string;
    instituicao?: string;
    cor?: string;
}

interface ILancamento {
    id: number;
    descricao: string;
    valor: number;
    dataCompetencia: string;
    tipo: number;
    categoriaId: number;
    contaId: number;
    pago: boolean;
    observacao?: string;
    categoriaNome?: string;
    contaNome?: string;
}

let model: IModelLancamentos;

export const init = (params: IModelLancamentos) => {
    model = params;
    configurarFiltrosIniciais();
    carregarCategorias();
    conectarEventos();
    carregarLancamentos();
};

function configurarFiltrosIniciais() {
    const hoje = new Date();
    $('#filtro-mes').val(hoje.getMonth() + 1);
    $('#filtro-ano').val(hoje.getFullYear());
}

function carregarCategorias() {
    $.get(model.urls.listarCategorias)
        .done((categorias: ICategoria[]) => {
            const $select = $('#filtro-categoria');
            $select.empty();
            $select.append('<option value="">Todas</option>');

            categorias.forEach(categoria => {
                $select.append(`<option value="${categoria.id}">${categoria.nome}</option>`);
            });
        })
        .fail(() => {
            Toast.error('Erro ao carregar categorias:');
        });
}

function conectarEventos() {
    $('#form-filtros').on('submit', (e) => {
        e.preventDefault();
        carregarLancamentos();
    });
}

export const carregarLancamentos = () => {
    const filtros = obterFiltros();

    $('#lista-lancamentos').html('<li class="uk-padding uk-text-center">Carregando...</li>');

    $.get(model.urls.buscarLancamentos, filtros)
        .done(function (lancamentos: ILancamento[]) {
            renderizarLancamentos(lancamentos);
        })
        .fail(function () {
            Toast.error('Erro ao carregar lançamentos:');
            $('#lista-lancamentos').html('<li class="uk-padding uk-text-center uk-text-muted">Erro ao carregar lançamentos.</li>');
        });
};

function obterFiltros() {
    return {
        mes: $('#filtro-mes').val(),
        ano: $('#filtro-ano').val(),
        tipo: $('#filtro-tipo').val(),
        categoriaId: $('#filtro-categoria').val()
    };
}

function renderizarLancamentos(lancamentos: ILancamento[]) {
    const $lista = $('#lista-lancamentos');
    $lista.empty();

    if (!Array.isArray(lancamentos) || !lancamentos.length) {
        $lista.append('<li class="uk-padding uk-text-center uk-text-muted">Nenhum registro encontrado.</li>');
        return;
    }

    lancamentos.forEach(lancamento => {
        $lista.append(criarItemLancamento(lancamento));
    });
}

function criarItemLancamento(lancamento: ILancamento) {
    const valorClass = lancamento?.tipo === 1 ? 'uk-text-success' : 'uk-text-danger';

    return `
        <li class="uk-card uk-card-default uk-card-body uk-padding-small uk-margin-small-bottom">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-1-2 uk-width-1-5@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Data</span>
                    <div class="uk-text-truncate">${formatarData(lancamento?.dataCompetencia)}</div>
                </div>

                <div class="uk-width-1-2 uk-width-expand@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Descrição</span>
                    <div class="uk-text-bold uk-text-truncate">${lancamento?.descricao || '-'}</div>
                </div>

                <div class="uk-width-1-2 uk-width-1-5@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Categoria</span>
                    <div class="uk-text-truncate">${lancamento?.categoriaNome || '-'}</div>
                </div>

                <div class="uk-width-1-2 uk-width-1-5@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Conta</span>
                    <div class="uk-text-truncate">${lancamento?.contaNome || '-'}</div>
                </div>

                <div class="uk-width-1-1 uk-width-1-5@m uk-text-right@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Valor</span>
                    <div class="${valorClass} uk-text-bold">${formatarMoeda(lancamento?.valor || 0)}</div>
                </div>

                <div class="uk-width-1-1 uk-width-auto@m uk-flex uk-flex-center uk-flex-right@m">
                    <div class="uk-button-group">
                        <button class="uk-button uk-button-text uk-margin-small-right uk-margin-small-left" uk-icon="pencil" title="Editar"></button>
                        <button class="uk-button uk-button-text uk-text-danger" uk-icon="trash" title="Excluir"></button>
                    </div>
                </div>
            </div>
        </li>
    `;
}

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(dataStr: string) {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
}

function carregarContasModal() {
    $.get(model.urls.listarContas)
        .done((contas: IConta[]) => {
            const $select = $('#contaId');
            $select.empty();
            $select.append('<option value="">Selecione...</option>');

            contas.forEach(conta => {
                $select.append(`<option value="${conta.id}">${conta.nome}</option>`);
            });
        })
        .fail(() => {
            Toast.error('Erro ao carregar contas');
        });
}

function carregarCategoriasModal() {
    $.get(model.urls.listarCategorias)
        .done((categorias: ICategoria[]) => {
            const $select = $('#categoriaId');
            $select.empty();
            $select.append('<option value="">Selecione...</option>');

            categorias.forEach(categoria => {
                $select.append(`<option value="${categoria.id}">${categoria.nome}</option>`);
            });
        })
        .fail(() => {
            Toast.error('Erro ao carregar categorias');
        });
}

function configurarFormularioLancamento() {
    $('#btn-salvar-lancamento').off('click').on('click', () => {
        salvarLancamento();
    });

    const hoje = new Date().toISOString().split('T')[0];
    $('#dataCompetencia').val(hoje);
}

function salvarLancamento() {
    const dados = {
        descricao: $('#descricao').val(),
        valor: parseFloat(String($('#valor').val())),
        dataCompetencia: $('#dataCompetencia').val(),
        tipo: parseInt(String($('#tipo').val())),
        categoriaId: parseInt(String($('#categoriaId').val())),
        contaId: parseInt(String($('#contaId').val())),
        pago: $('#pago').is(':checked'),
        observacao: $('#observacao').val()
    };

    $.ajax({
        url: model.urls.cadastrarLancamento,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: () => {
            Toast.success('Lançamento cadastrado com sucesso!');
            UIkit.modal('#modal-lancamento').hide();
            carregarLancamentos();
        },
        error: () => {
            Toast.error('Erro ao cadastrar lançamento');
        }
    });
}

export const abrirModalCadastro = () => {
    $.get(model.urls.abrirModalCadastro)
        .done((html) => {
            $('#containerModalAdicionarLancamento').html(html);
            carregarCategoriasModal();
            carregarContasModal();
            configurarFormularioLancamento();
            UIkit.modal('#modal-lancamento').show();
        })
        .fail(() => {
            Toast.error('Erro ao abrir modal de cadastro');
        });
};
