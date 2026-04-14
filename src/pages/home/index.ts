import "styles/index.less";
import 'uikitcss';
import UIkit from 'uikit';
import Icons from 'uikiticonsjs';
import toast from 'components/toast';
import $ from 'jquery';

UIkit.use(Icons);

interface IModelHome {
    urls: {
        index: string;
        partial: string;
        resumo: string;
        proximosVencimentos: string;
        lancamentos: string;
    };
}

interface IResumoDashboard {
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
    quantidadePendentes: number;
}

interface IProximoVencimento {
    id: number;
    descricao: string;
    valor: number;
    dataCompetencia: string;
    categoriaNome: string;
    contaNome: string;
}
interface ILancamento {
    descricao: string;
    valor: number;
    categoriaNome: string;
    tipo: number;
}

let model: IModelHome;

export function init(params: IModelHome) {
    model = params;

    carregarResumoDashboard();
    carregarProximosVencimentos();
    carregarDespesasPorCategoria()
}


function carregarResumoDashboard() {
    $.get(model.urls.resumo)
        .done((res: IResumoDashboard) => {
            res.saldo >=1000 ? $('.card-saldo').addClass('positivo').removeClass('negativo') : $('.card-saldo').addClass('negativo').removeClass('positivo');
            res.saldo < 0 ? $('.card-saldo').addClass('critico') : $('.card-saldo').removeClass('critico');
            $('#receitaMes').text(formatarMoeda(res.totalEntradas.toString()));
            $('#despesasMes').text(formatarMoeda(res.totalSaidas.toString()));
            $('#saldoAtual').text(formatarMoeda(res.saldo.toString()));
        }).fail(() => {
            toast.error('Não foi possível carregar o resumo do dashboard');
        });
}

function carregarProximosVencimentos() {
    $.get(model.urls.proximosVencimentos)
        .done((res: IProximoVencimento[]) => {
            const $lista = $('#listaProximosVencimentos');
            $lista.empty();
            if(!res || res.length === 0) {
                $lista.append('<li class="uk-text-muted">Nenhum vencimento encontrado</li>');
                return;
            }
            res.forEach(item =>{
                $lista.append(`
                    <li>
                        <strong>${item.descricao}</strong><br>
                        <span class="uk-text-meta">
                            ${item.categoriaNome ?? "-"} • ${item.contaNome ?? "-"}
                        </span><br>
                        Vencimento: ${formatarData(item.dataCompetencia)}<br>
                        Valor: ${formatarMoeda(item.valor.toString())}
                    </li>
                `);
            });
        })
        .fail(() => {
            toast.error('Não foi possível carregar os próximos vencimentos');
        });
}

function carregarDespesasPorCategoria() {
    $.get(model.urls.lancamentos)
    .done((res : ILancamento[]) => {
        const $container = $('#graficoCategorias');
        $container.empty();

        if(!res || res.length === 0) {
            $container.append('<p class="uk-text-muted">Nenhuma despesa encontrada</p>');
            return;
        }

        const despesas = res.filter(item => item.tipo === 2);

        if(despesas.length === 0) {
            $container.append('<p class="uk-text-muted">Nenhuma despesa encontrada</p>');
            return;
        }

        const despesasPorCategoria = {};

        despesas.forEach(item =>{
            const categoria = item.categoriaNome;
            despesasPorCategoria[categoria] = (despesasPorCategoria[categoria] || 0) + item.valor;
        })

        const dados = Object.keys(despesasPorCategoria)
                            .map(categoria => ({ categoria, valor: despesasPorCategoria[categoria] }))
                            .sort((a, b) => b.valor - a.valor);

        const total = dados.reduce((sum, item) => sum + item.valor, 0);
        dados.forEach(item => {
            const percentual = (item.valor / total) * 100;
            $container.append(`
                <div class="uk-margin-small-bottom">
                    <div class="uk-flex uk-flex-between uk-flex-middle">
                        <span>${item.categoria}</span>
                        <span>${formatarMoeda(item.valor.toString())}</span>
                    </div>
                    <progress class="uk-progress" value="${percentual}" max="100"></progress>
                </div>
            `);
        })
        
    })
    .fail(() => {
        toast.error('Não foi possível carregar as despesas por categoria');
    });
}

function formatarMoeda(valor: string): string {
        if (!valor) return "R$ 0,00";
        const valorNumerico = parseFloat(valor.replace(",", "."));
        const valorFormatado = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        }).format(valorNumerico);

        return valorFormatado;
    }


function formatarData(data: string): string {
    if (!data) 
        return "-";

    const partes = data.split("-");
    if (partes.length !== 3) 
        return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


export {toast}
