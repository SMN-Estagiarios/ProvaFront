import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from "components/jquery";
import Toast from "components/toast";

UIkit.use(Icons);

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
        .done((categorias: any[]) => {
            renderizarCategorias(categorias);
        })
        .fail(() => {
            Toast.error('Erro ao carregar categorias');
        });
};

function renderizarCategorias(lista: any[]) {
    const $tbody = $('#lista-categorias');
    $tbody.empty();

    if (!Array.isArray(lista) || !lista.length) {
        $tbody.append('<tr><td colspan="2" class="uk-text-center uk-text-muted">Nenhuma categoria encontrada.</td></tr>');
        return;
    }

    lista.forEach((cat) => {
        $tbody.append(`
            <tr>
                <td>${cat?.nome || '-'}</td>
            </tr>
        `);
    });
}

function cadastrarCategoria() {
    const nome = String($('#nome-categoria').val() || '').trim();

    if (!nome) {
        Toast.warning('Informe o nome da categoria');
        return;
    }

    $.ajax({
        url: model.urls.cadastrar,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ nome }),
        success: () => {
            Toast.success('Categoria cadastrada com sucesso!');
            $('#nome-categoria').val('');
            carregarCategorias();
        },
        error: (xhr) => {
            const mensagem = xhr.responseText || 'Erro ao cadastrar categoria';
            console.error('Erro ao cadastrar categoria:', mensagem);
            Toast.error(mensagem);
        }
    });
}
