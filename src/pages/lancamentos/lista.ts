// import $ from "components/jquery";
// import Toast from "components/toast";

// export const initLista = () => {
//     carregarLancamentos();
// };

// function carregarLancamentos() {
//     $.get('/gestao/lancamentos/api/listar')
//         .done(function (data) {
//             console.log("Lançamentos que chegam na Gestão",data);
            
//             renderizarLancamentos(data);
//         })
//         .fail(function (error) {
//             Toast.error('Erro ao carregar lançamentos');
//         });
// }

// function renderizarLancamentos(lista: any[]) {

//     const $lista = $('#lista-lancamentos');
//     $lista.empty();

//     if (!Array.isArray(lista) || !lista.length) {
//         $lista.append('<li class="uk-padding uk-text-center uk-text-muted">Nenhum registro encontrado.</li>');
//         return;
//     }

//     lista.forEach(item => {
//         $lista.append(criarItemLancamento(item));
//     });
// }

// function criarItemLancamento(l: any) {
//     console.log(l);
    
//     const valorClass = l?.tipo === 1 ? 'uk-text-success' : 'uk-text-danger';

//     return `
//         <li class="uk-card uk-card-default uk-card-body uk-padding-small uk-margin-small-bottom">
//             <div class="uk-grid-small uk-flex-middle" uk-grid>
//                 <div class="uk-width-1-2 uk-width-1-5@m">
//                     <span class="uk-text-bold uk-text-meta uk-hidden@m">Data</span>
//                     <div class="uk-text-truncate">${formatarData(l?.dataCompetencia)}</div>
//                 </div>
                
//                 <div class="uk-width-1-2 uk-width-expand@m">
//                     <span class="uk-text-bold uk-text-meta uk-hidden@m">Descrição</span>
//                     <div class="uk-text-bold uk-text-truncate">${l?.descricao || '-'}</div>
//                 </div>

//                 <div class="uk-width-1-2 uk-width-1-5@m">
//                     <span class="uk-text-bold uk-text-meta uk-hidden@m">Categoria</span>
//                     <div class="uk-text-truncate">${l?.categoriaNome || '-'}</div>
//                 </div>

//                 <div class="uk-width-1-2 uk-width-1-5@m">
//                     <span class="uk-text-bold uk-text-meta uk-hidden@m">Conta</span>
//                     <div class="uk-text-truncate">${l?.contaNome || '-'}</div>
//                 </div>

//                 <div class="uk-width-1-1 uk-width-1-5@m uk-text-right@m">
//                     <span class="uk-text-bold uk-text-meta uk-hidden@m">Valor</span>
//                     <div class="${valorClass} uk-text-bold">${formatarMoeda(l?.valor || 0)}</div>
//                 </div>

//                 <div class="uk-width-1-1 uk-width-auto@m uk-flex uk-flex-center uk-flex-right@m">
//                     <div class="uk-button-group">
//                         <button class="uk-button uk-button-text uk-margin-small-right" uk-icon="pencil" title="Editar"></button>
//                         <button class="uk-button uk-button-text uk-text-danger" uk-icon="trash" title="Excluir"></button>
//                     </div>
//                 </div>
//             </div>
//         </li>
//     `;
// }

// function formatarMoeda(valor: number) {
//     return new Intl.NumberFormat('pt-BR', {
//         style: 'currency',
//         currency: 'BRL'
//     }).format(valor);
// }

// function formatarData(dataStr: string) {
//     const data = new Date(dataStr);
//     return data.toLocaleDateString('pt-BR');
// }
