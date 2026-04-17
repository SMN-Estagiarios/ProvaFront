import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from "components/jquery";
import Toast from "components/toast";

UIkit.use(Icons);

interface ICategoria {
    id: number;
    nome: string;
    cor?: string;
}

interface IModelCategorias {
    urls: {
        listar: string;
        cadastrar: string;
    };
}

let model: IModelCategorias;

export const init = (params: IModelCategorias) => {
    model = params;
    configurarEventos();
    carregarCategorias();
};

function configurarEventos() {
    $('#form-categoria').on('submit', (e) => {
        e.preventDefault();
        cadastrarCategoria();
    });
}

export const carregarCategorias = () => {
    $.get(model.urls.listar)
        .done((categorias: ICategoria[]) => {
            renderizarCategorias(categorias);
        })
        .fail(() => {
            Toast.error('Erro ao carregar categorias');
        });
};

function renderizarCategorias(categorias: ICategoria[]) {
    const $tbody = $('#lista-categorias');
    $tbody.empty();

    if (!Array.isArray(categorias) || !categorias.length) {
        $tbody.append('<tr><td colspan="2" class="uk-text-center uk-text-muted">Nenhuma categoria encontrada.</td></tr>');
        return;
    }

    categorias.forEach((categoria: ICategoria) => {
        $tbody.append(`
            <tr>
                <td>${categoria?.nome || '-'}</td>
            </tr>
        `);
    });
}

function cadastrarCategoria() {
    const $nome = String($('#nome-categoria').val() || '').trim();

    if (!$nome) {
        Toast.warning('Informe o nome da categoria');
        return;
    }

    $.ajax({
        url: model.urls.cadastrar,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({nome: $nome }),
        success: () => {
            Toast.success('Categoria cadastrada com sucesso!');
            $('#nome-categoria').val('');
            carregarCategorias();
        },
        error: (xhr) => {
            console.log(xhr);

            Toast.error("Erro ao cadastrar categoria");
        }
    });
}
