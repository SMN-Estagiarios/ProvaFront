import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import $ from "components/jquery";
import Toast from "components/toast";

UIkit.use(Icons);

interface IModelContas {
    urls: {
        listar: string;
        cadastrar: string;
    };
}

let model: IModelContas;

export const init = (params: IModelContas) => {
    model = params;
    configurarEventos();
    carregarContas();
};

function configurarEventos() {
    $('#form-conta').on('submit', (e) => {
        e.preventDefault();
        cadastrarConta();
    });
}

export const carregarContas = () => {
    $.get(model.urls.listar)
        .done((contas: any[]) => {
            renderizarContas(contas);
        })
        .fail(() => {
            Toast.error('Erro ao carregar contas');
        });
};

function renderizarContas(lista: any[]) {
    const $tbody = $('#lista-contas');
    $tbody.empty();

    if (!Array.isArray(lista) || !lista.length) {
        $tbody.append('<tr><td colspan="2" class="uk-text-center uk-text-muted">Nenhuma conta encontrada.</td></tr>');
        return;
    }

    lista.forEach((conta) => {
        $tbody.append(`
            <tr>
                <td>${conta?.nome || '-'}</td>
            </tr>
        `);
    });
}

function cadastrarConta() {
    const nome = String($('#nome-conta').val() || '').trim();

    if (!nome) {
        Toast.warning('Informe o nome da conta');
        return;
    }

    $.ajax({
        url: model.urls.cadastrar,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ nome }),
        success: () => {
            Toast.success('Conta cadastrada com sucesso!');
            $('#nome-conta').val('');
            carregarContas();
        },
        error: (xhr) => {
            const mensagem = xhr.responseText || 'Erro ao cadastrar conta';
            console.error('Erro ao cadastrar conta:', mensagem);
            Toast.error(mensagem);
        }
    });
}
