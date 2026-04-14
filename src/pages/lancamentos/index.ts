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

let model: IModelLancamentos;

export const init = (params: IModelLancamentos) => {
    console.log('Iniciando lançamentos...', params);
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
    console.log('Carregando categorias...');
    $.get(model.urls.listarCategorias)
        .done((categorias: any[]) => {
            console.log('Categorias carregadas:', categorias);
            const $select = $('#filtro-categoria');
            $select.empty();
            $select.append('<option value="">Todas</option>');

            categorias.forEach(cat => {
                $select.append(`<option value="${cat.id}">${cat.nome}</option>`);
            });
        })
        .fail((error) => {
            console.error('Erro ao carregar categorias:', error);
        });
}

function conectarEventos() {
    $('#form-filtros').on('submit', (e) => {
        e.preventDefault();
        carregarLancamentos();
    });
}

// export function abrirModalCadastro() {
//     const $placeholder = $("#containerModalAdicionarLancamento");

//     $.get(model.urls.abrirModalCadastro)
//         .done(function (html) {
//             $placeholder.html(html);

//             const modal = UIkit.modal("#modal-cadastro-lancamento");

//             modal.show();
//         })
//         .fail(function () {
//             alert("Erro ao abrir modal");
//         });
// }

export const carregarLancamentos = () => {
    const filtros = obterFiltros();
    
    $('#lista-lancamentos').html('<li class="uk-padding uk-text-center">Carregando...</li>');
    
    $.get(model.urls.buscarLancamentos, filtros)
        .done(function (data) {
            console.log("Lançamentos que chegam na Gestão", data);
            renderizarLancamentos(data);
        })
        .fail(function (error) {
            console.error('Erro ao carregar lançamentos:', error);
            Toast.error('Erro ao carregar lançamentos');
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

function renderizarLancamentos(lista: any[]) {

    const $lista = $('#lista-lancamentos');
    $lista.empty();

    if (!Array.isArray(lista) || !lista.length) {
        $lista.append('<li class="uk-padding uk-text-center uk-text-muted">Nenhum registro encontrado.</li>');
        return;
    }

    lista.forEach(item => {
        $lista.append(criarItemLancamento(item));
    });
}

function criarItemLancamento(l: any) {
    console.log(l);
    
    const valorClass = l?.tipo === 1 ? 'uk-text-success' : 'uk-text-danger';

    return `
        <li class="uk-card uk-card-default uk-card-body uk-padding-small uk-margin-small-bottom">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-1-2 uk-width-1-5@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Data</span>
                    <div class="uk-text-truncate">${formatarData(l?.dataCompetencia)}</div>
                </div>
                
                <div class="uk-width-1-2 uk-width-expand@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Descrição</span>
                    <div class="uk-text-bold uk-text-truncate">${l?.descricao || '-'}</div>
                </div>

                <div class="uk-width-1-2 uk-width-1-5@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Categoria</span>
                    <div class="uk-text-truncate">${l?.categoriaNome || '-'}</div>
                </div>

                <div class="uk-width-1-2 uk-width-1-5@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Conta</span>
                    <div class="uk-text-truncate">${l?.contaNome || '-'}</div>
                </div>

                <div class="uk-width-1-1 uk-width-1-5@m uk-text-right@m">
                    <span class="uk-text-bold uk-text-meta uk-hidden@m">Valor</span>
                    <div class="${valorClass} uk-text-bold">${formatarMoeda(l?.valor || 0)}</div>
                </div>

                <div class="uk-width-1-1 uk-width-auto@m uk-flex uk-flex-center uk-flex-right@m">
                    <div class="uk-button-group">
                        <button class="uk-button uk-button-text uk-margin-small-right" uk-icon="pencil" title="Editar"></button>
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
    $.get('/cadastros/contas/api/listar')
        .done((contas: any[]) => {
            const $select = $('#contaId');
            $select.empty();
            $select.append('<option value="">Selecione...</option>');

            contas.forEach(conta => {
                $select.append(`<option value="${conta.id}">${conta.nome}</option>`);
            });
        })
        .fail(() => {
            console.error('Erro ao carregar contas');
        });
}

function carregarCategoriasModal() {
    $.get(model.urls.listarCategorias)
        .done((categorias: any[]) => {
            const $select = $('#categoriaId');
            $select.empty();
            $select.append('<option value="">Selecione...</option>');

            categorias.forEach(cat => {
                $select.append(`<option value="${cat.id}">${cat.nome}</option>`);
            });
        })
        .fail(() => {
            console.error('Erro ao carregar categorias');
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
        error: (xhr) => {
            const mensagem = xhr.responseText || 'Erro ao cadastrar lançamento';
            console.error('Erro ao salvar lançamento:', mensagem);
            Toast.error(mensagem);
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

// (window as any).ProvaFront = (window as any).ProvaFront || {};
// (window as any).ProvaFront.lancamentos = { init, carregarLancamentos, abrirModalCadastro };
