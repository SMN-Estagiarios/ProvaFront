import 'styles/index.less';
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import toast from 'components/toast';
import $ from 'jquery';

UIkit.use(Icons);

interface IModelAuxiliar {
    urls: {
        index: string;
        abrirModalCadastro: string;
        cadastrarConta: string;
        cadastrarCategoria: string;
        editarConta: string;
        editarCategoria: string;
        listarConta: string;
        listarCategoria: string;
        buscarConta: string;
        buscarCategoria: string;
        excluirConta: string;
        excluirCategoria: string;
    };
}

interface ICategorias {
    id: number;
    nome: string;
    cor: string;
}

interface IContas {
    id: number;
    nome: string;
    cor: string;
    instituicao: string;
}

let model: IModelAuxiliar;

export function init(params: IModelAuxiliar) {
    model = params;
    listarContas();
    listarCategorias();
}

function limparformulario() {
    $('#cadastroId').val('');
    $('#nome').val('');
    $('#cor').val('');
    $('#instituicao').val('');
}

export function abrirModalCadastro(): void {
    $.get(model.urls.abrirModalCadastro)
        .done(() => {
            limparformulario();
            $('#tipoCadastro').on('change', () => {
                atualizarCampoInstituicao();
            });
            $('#tituloModalCadastro').text('Novo Cadastro');

            atualizarCampoInstituicao();
            UIkit.modal('#modalCadastroAuxiliar').show();
        })
        .fail((xhr) => {
            toast.error(xhr.responseText || 'Erro ao carregar o modal.');
        });
}

function atualizarCampoInstituicao(): void {
    const $containerInstituicao = $('#instituicaoContainer');
    const $inputInstituicao = $('#instituicao');

    if ($('#tipoCadastro').val() === '1') {
        $containerInstituicao.removeClass('uk-hidden');
        $inputInstituicao.prop('required', true);
        return;
    }

    $containerInstituicao.addClass('uk-hidden');
    $inputInstituicao.prop('required', false);
    $inputInstituicao.val('');
}

export function salvar(form: HTMLFormElement): void {
    const $form = $(form);
    let url = '';

    const $tipo = $form.find('#tipoCadastro').val() as string;
    const isEdit = !!$form.find('#cadastroId').val();

    if (!isEdit) {
        url = $tipo === '1' ? model.urls.cadastrarConta : model.urls.cadastrarCategoria;
    } else {
        url = $tipo === '1' ? model.urls.editarConta : model.urls.editarCategoria;
    }

    const payload = {
        id: Number(($form.find('#cadastroId').val() as string) || 0),
        nome: ($form.find('#nome').val() as string) || '',
        cor: ($form.find('#cor').val() as string) || '',
        instituicao: ($form.find('#instituicao').val() as string) || '',
    };

    $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
    })
    .done(() => {
        toast.success('Cadastro realizado com sucesso!');
        UIkit.modal('#modalCadastroAuxiliar').hide();

        if ($tipo === '1') {
            listarContas();
        } else {
            listarCategorias();
        }
    })
    .fail(() => {
        toast.error('Erro ao realizar o cadastro.');
    });
}

export function listarContas() {
    $.get(model.urls.listarConta)
        .done((res: IContas[]) => {
            renderizarConta(res);
        })
        .fail(() => {
            toast.error('Erro ao carregar as contas.');
        });
}

function renderizarConta(contas: IContas[]) {
    const $container = $('#listaContas');
    $container.empty();

    if (!contas || contas.length === 0) {
        $container.append(`
            <li class="uk-width-expand uk-padding-small uk-grid-collapse uk-border-bottom uk-flex-middle" uk-grid>
                <div class="uk-width-expand uk-padding-small">
                    <p class="uk-margin-remove uk-text-secondary uk-text-small uk-text-center">
                        Nenhum lançamento encontrado.
                    </p>
                </div>
            </li>
        `);
        return;
    }

    contas.forEach((conta) => {
        $container.append(`
            <li class="uk-width-expand uk-padding-small uk-grid-collapse uk-border-bottom uk-flex-middle" uk-grid>
                <div class="uk-width-1-1 uk-width-expand uk-text-center@m uk-margin-small-bottom@m">
                    <label class="uk-hidden@m uk-margin-small-bottom uk-text uk-flex uk-flex-center uk-text-bold uk-text-emphasis">Descrição</label>
                    <p class="uk-margin-remove uk-flex uk-flex-center uk-text-secondary uk-text-center@m uk-text-small uk-text@m uk-text-truncate" title="${conta.nome}">
                        ${conta.nome}
                    </p>
                </div>
                <div class="uk-width-1-1 uk-width-expand uk-text-center@m uk-margin-bottom-small@m">
                    <label class="uk-hidden@m uk-margin-small-bottom uk-text-bold uk-flex uk-flex-center uk-text-emphasis uk-text-small">Ações</label>
                    <div class="uk-flex uk-flex-center@m uk-flex uk-flex-center uk-flex-left uk-text-center@m uk-gap-small">
                        <button type="button"
                                class="uk-icon-button icon-editar uk-margin-right"
                                uk-icon="file-edit"
                                onclick="ProvaFront.auxiliar.abrirModalEditarConta(${conta.id})"
                                title="Editar">
                        </button>

                        <button type="button"
                                class="uk-icon-button icon-excluir"
                                data-excluir="${conta.id}"
                                uk-icon="trash"
                                onclick="ProvaFront.auxiliar.excluirConta(${conta.id})"
                                title="Excluir">
                        </button>
                    </div>
                </div>
            </li>
        `);
    });
}

export function listarCategorias() {
    $.get(model.urls.listarCategoria)
        .done((res: ICategorias[]) => {
            renderizarCategoria(res);
        })
        .fail(() => {
            toast.error('Erro ao carregar as categorias.');
        });
}

function renderizarCategoria(categorias: ICategorias[]) {
    const $container = $('#listaCategorias');
    $container.empty();

    if (!categorias || categorias.length === 0) {
        $container.append(`
            <li class="uk-width-expand uk-padding-small uk-grid-collapse uk-border-bottom uk-flex-middle" uk-grid>
                <div class="uk-width-expand uk-padding-small">
                    <p class="uk-margin-remove uk-text-secondary uk-text-small uk-text-center">
                        Nenhum lançamento encontrado.
                    </p>
                </div>
            </li>
        `);
        return;
    }

    categorias.forEach((categoria) => {
        $container.append(`
            <li class="uk-width-expand uk-padding-small uk-grid-collapse uk-border-bottom uk-flex-middle" uk-grid>
                <div class="uk-width-1-1 uk-width-expand uk-text-center@m uk-margin-small-bottom@m">
                    <label class="uk-hidden@m uk-margin-small-bottom uk-text uk-flex uk-flex-center uk-text-bold uk-text-emphasis">Descrição</label>
                    <p class="uk-margin-remove uk-flex uk-flex-center uk-text-secondary uk-text-center@m uk-text-small uk-text@m uk-text-truncate" title="${categoria.nome}">
                        ${categoria.nome}
                    </p>
                </div>
                <div class="uk-width-1-1 uk-width-expand uk-text-center@m uk-margin-bottom-small@m">
                    <label class="uk-hidden@m uk-margin-small-bottom uk-text-bold uk-flex uk-flex-center uk-text-emphasis uk-text-small">Ações</label>
                    <div class="uk-flex uk-flex-center@m uk-flex uk-flex-center uk-flex-left uk-text-center@m uk-gap-small">
                        <button type="button"
                                class="uk-icon-button icon-editar uk-margin-right"
                                uk-icon="file-edit"
                                onclick="ProvaFront.auxiliar.abrirModalEditarCategoria(${categoria.id})"
                                title="Editar">
                        </button>

                        <button type="button"
                                class="uk-icon-button icon-excluir"
                                data-excluir="${categoria.id}"
                                uk-icon="trash"
                                onclick="ProvaFront.auxiliar.excluirCategoria(${categoria.id})"
                                title="Excluir">
                        </button>
                    </div>
                </div>
            </li>
        `);
    });
}

export function abrirModalEditarConta(id: number) {
    $.get(`${model.urls.buscarConta}?id=${id}`)
    
    .done((res: any) => {
        $('#tituloModalCadastro').text('Editar Cadastro');
        $('#tipoCadastro').val('1').trigger('change');
        $('#cadastroId').val(res.id);
        $('#nome').val(res.nome);
        $('#cor').val(res.cor);
        $('#instituicao').val(res.instituicao);
        atualizarCampoInstituicao();

        UIkit.modal('#modalCadastroAuxiliar').show();
    })
    .fail(() => {
        toast.error('Não foi possível carregar os dados do lançamento.');
    });
}

export function abrirModalEditarCategoria(id: number) {
    $.get(`${model.urls.buscarCategoria}?id=${id}`)
    .done((res: any) => {
        $('#tituloModalCadastro').text('Editar Cadastro');
        $('#tipoCadastro').val('2').trigger('change');
        $('#cadastroId').val(res.id);
        $('#nome').val(res.nome);
        $('#cor').val(res.cor);
        atualizarCampoInstituicao();

        UIkit.modal('#modalCadastroAuxiliar').show();
    })  
    .fail(() => {
        toast.error('Não foi possível carregar os dados do lançamento.');
    });
}

export function excluirCategoria(id: number) {
    UIkit.modal.confirm('Tem certeza que deseja excluir esta categoria?')
    .then(() => {
        $.post(model.urls.excluirCategoria, { id })
            .done(() => {
                toast.success('Categoria excluída com sucesso.');
                listarCategorias();
            })
            .fail(() => {
                toast.error('Não foi possível excluir a categoria.');
            });
    }).catch(() => {
        
    });
}

export function excluirConta(id: number) {
    UIkit.modal.confirm('Tem certeza que deseja excluir esta conta?')
    .then(() => {
        $.post(model.urls.excluirConta, { id })
            .done(() => {
                toast.success('Conta excluída com sucesso.');
                listarContas();
            })
            .fail(() => {
                toast.error('Não foi possível excluir a conta.');
            });
    }).catch(() => {
        
    });
}
