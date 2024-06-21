$(document).ready(function(){
$('.ui.dropdown').dropdown();
//const URL = 'https://www.fateclins.edu.br/felipeMaciel/macieulsCoffee/api/v2/produto.php';
const TOKEN = '20f8a284df9d3e7d5db33755da7045b2f4313353';
//const URL_TOKEN = 'https://www.fateclins.edu.br/felipeMaciel/macieulsCoffee/api/v2/produto.php?token=20f8a284df9d3e7d5db33755da7045b2f4313353'
const URL_RESERVA = 'https://cipaon.com.br/api/produto.php';
const URL_TOKEN_RESERVA = 'https://cipaon.com.br/api/produto.php?token=20f8a284df9d3e7d5db33755da7045b2f4313353';
carregarProdutos();
adicionarProduto();
chamarEdicao();
removerProduto();
editarProduto();
buscarProduto();
verificarCampos();

$('#add-button').click(function (){
    $('.ui.modal.add').modal('show');
})

// Aplica a máscara aos campos de preço
//$('#precoAdd, #precoEdit').mask('000.000.000.000.000,00', {reverse: true});
$('#precoAdd, #precoEdit').mask("#.##0,00", {reverse: true});

function adicionarProduto(){
    $('#addProduto').click( function(){
        let nomeAdd = $('#nomeAdd').val();
        let categoriaAdd = $('#categoriaAdd').val();
        let precoAdd = $('#precoAdd').val();
        let linkAdd = $('#linkAdd').val();
        let descricaoAdd = $('#descricaoAdd').val();

        $.ajax({
            url: URL_RESERVA,
            method: 'POST',
            data:{
                token: TOKEN,
                nome: nomeAdd,
                idCategoria: categoriaAdd,
                foto: linkAdd,
                preco: precoAdd,
                descricao: descricaoAdd
            }, 
            success: function (){
                Swal.fire({
                    title: "Produto inserido com sucesso",
                    icon: "success"
                }).then(() => {
                    location.reload(); // Recarrega a página
                });
            },
            error: function (error){
                Swal.fire({
                    title: "Erro ao tentar adicionar produto",
                    text: "Por favor, tente novamente mais tarde ou contate o administrador. Verifique se o CORS está desativado também. :)",
                    icon: "error"
                })
                console.error('Erro encontrado: ', error);
            }
        })
    })
}

//Função para verificar se os campos foram preenchidos e liberar o botão de enviar
function verificarCampos() {
        let nomeProduto = $('#nomeAdd').val().trim(); //trim serve para não permitir o envio apenas com espaços '   '.
        let categoriaProduto = $('#categoriaAdd').val().trim();
        let precoProduto = $('#precoAdd').val().trim();
        let linkProduto = $('#linkAdd').val().trim();
        let descricaoProduto = $('#descricaoAdd').val().trim();
    
        // Verifica se todos os campos estão preenchidos
        if (nomeProduto && categoriaProduto && precoProduto && linkProduto && descricaoProduto) {
            $('#addProduto').removeClass('disabled');
        } else {
            $('#addProduto').addClass('disabled');
        }
}
$('#formAdd').on('input', verificarCampos);

$('#categoriaDropdown').dropdown('set selected', 'todos');
$('#categoriaDropdown').dropdown({
    onChange: function(value) {
        carregarProdutos(value);
    }
});

function carregarProdutos(categoria){
    let contentCard = '';
    $.getJSON(URL_TOKEN_RESERVA, function(res){
        // Ordenação
        res.sort((p1, p2) => {
            if (p1.nome < p2.nome) return -1; // 'p1' vem antes de 'p2'
            if (p1.nome > p2.nome) return 1; // 'p1' vem depois de 'p2'
            return 0; // 'p1' e 'p2' são iguais
        });

        // Filtra os produtos de acordo na categoria
        let produtosFiltrados = res;
        if (categoria == 'bolos') {
            produtosFiltrados = res.filter(produto => produto.idCategoria == 1);
        } else if (categoria == 'bebidas') {
            produtosFiltrados = res.filter(produto => produto.idCategoria == 2);
        }

        produtosFiltrados.forEach((produto) =>{
            contentCard += `
            <div class="card" data-id="${produto.idProduto}">
                <div class="content">
                    <img class="right floated circular tiny ui image produtoLink"
                        src="${produto.foto}">
                    <div class="header">
                        <span class="produtoNome">${produto.nome}</span>
                    </div>
                    <input type="hidden" class="produtoCategoria" value="${produto.idCategoria}">
                    <div class="description produtoDescricao">
                        ${produto.descricao}
                        <div class="meta" style="margin-top: 5px;">
                            Valor: R$<span class="price produtoPreco" style="color: #767676;">${produto.preco}</span>
                        </div>
                    </div>
                </div>
                <div class="extra content">
                    <div class="ui two buttons">
                        <div class="ui blue basic button edit-button">Editar</div>
                        <div class="ui red basic button remove-button">Remover</div>
                    </div>
                </div>
            </div>
            `
        });
        // Limpar o conteúdo anterior e adicionar os novos cards, visto que o .html() define o conteúdo html apenas do conjunto de elementos passando, apagando o que existia anteriormente
        $('#conteudoCards').html(contentCard);
        //$('#conteudoCards').append(contentCard);
    })
}


function chamarEdicao(){
    $('#conteudoCards').on('click', '.edit-button',function (){
        $('.ui.modal.edit').modal('show');
        const produtoCard = $(this).closest('.card');
        const produtoId = produtoCard.data('id');

        const produtoNome = produtoCard.find('.produtoNome').text();
        const produtoPreco = produtoCard.find('.produtoPreco').text();
        const produtoLink = produtoCard.find('.produtoLink').attr('src');
        const produtoDescricao = produtoCard.find('.produtoDescricao').contents().first().text().trim();
        const produtoCategoria = produtoCard.find('.produtoCategoria').val();
        
        $('#nomeEdit').val(produtoNome);
        $('#linkEdit').val(produtoLink);
        $('#descricaoEdit').val(produtoDescricao);
        $('#precoEdit').val(produtoPreco);
        $('#categoriaEdit').dropdown('set selected', produtoCategoria);
        $('#produtoId').val(produtoId);
    })
}

function editarProduto(){
    $('#editarProduto').click(function(){
        let produtoId = $('#produtoId').val();
        let nomeEdit = $('#nomeEdit').val();
        let categoriaEdit = $('#categoriaEdit').val();
        let precoEdit = $('#precoEdit').val();
        let linkEdit = $('#linkEdit').val();
        let descricaoEdit = $('#descricaoEdit').val();


        let dados = {
                nome: nomeEdit,
                idCategoria: categoriaEdit,
                foto: linkEdit,
                preco: precoEdit,
                descricao: descricaoEdit
            
        };
        $.ajax({
            url: URL_TOKEN_RESERVA,
            method: 'PUT',
            data:{
                idProduto: produtoId,
                produto: JSON.stringify(dados)
            },
            success: function (){
                Swal.fire({
                    title: "Produto alterado com sucesso",
                    icon: "success"
                }).then(() => {
                    location.reload(); // Recarrega a página
                });
            },
            error: function (error){
                Swal.fire({
                    title: "Erro ao tentar alterar produto",
                    text: "Por favor, tente novamente mais tarde ou contate o administrador. Verifique se o CORS está desativado também. :)",
                    icon: "error"
                })
                console.error('Erro encontrado: ', error);
            }
        })
    })
}

function removerProduto(){
    $('#conteudoCards').on('click', '.remove-button', function(){
        const produtoCard = $(this).closest('.card');
        const produtoId = produtoCard.data('id');

        Swal.fire({
            title: "Deseja remover esse produto?",
            text: "Não será possível reverter esta operação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, remover!"
          }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${URL_RESERVA}?token=${TOKEN}&idProduto=${produtoId}`,
                    method: 'DELETE',
                    contentType: "application/json",
                    success: function(res) {
                        Swal.fire({
                            title: "Removido!",
                            text: "O produto foi removido.",
                            icon: "success"
                        });
                        produtoCard.remove();
                    },
                    error: function(error) {
                        Swal.fire({
                            title: "Erro!",
                            text: "Ocorreu um erro ao tentar remover o produto.",
                            icon: "error"
                        });
                        console.error('Erro encontrado: ', error);
                    }
                });
            }
          });
    })
}

function buscarProduto(){
    $('#buscaProduto').keyup( function(){
        let produtoProcurado = $('#buscaProduto').val().trim().toLowerCase();

        $('#conteudoCards .card').each(function() {
            const produtoNome = $(this).find('.produtoNome').text().toLowerCase();

            if (produtoNome.includes(produtoProcurado)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    })
}


})