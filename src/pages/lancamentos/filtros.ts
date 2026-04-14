import $ from "components/jquery";

export const initFiltros = () => {
    configurarFiltrosIniciais();
    carregarCategorias();
    conectarEventos();
};

function configurarFiltrosIniciais() {
    const hoje = new Date();
    $('#filtro-mes').val(hoje.getMonth() + 1);
    $('#filtro-ano').val(hoje.getFullYear());
}

function carregarCategorias() {
    $.get('/cadastros/categorias/api/listar')
        .done((categorias: any[]) => {
            const $select = $('#filtro-categoria');
            $select.empty();
            $select.append('<option value="">Todas</option>');

            categorias.forEach(cat => {
                $select.append(`<option value="${cat.id}">${cat.nome}</option>`);
            });
        })
        .fail(() => {
            console.error('Erro ao carregar categorias');
        });
}

function conectarEventos() {
    $('#form-filtros').on('submit', (e) => {
        e.preventDefault();
        (window as any).ProvaFront.lancamentos.carregarLancamentos();
    });
}
