# pagarme-react
 
Estudo da API da [pagar.me](https://docs.pagar.me/reference) e testando suas funcionalidades em geral, incluíndo a visualização de uma dashboard ( Sem estlização de css, apenas React cru com fins didáticos para aprender a utilizar a api da pagarme )
***
**- Pasta back-end**:

 Dentro da pasta "back-end", encontra-se a pasta "config" contendo um arquivo JSON guardando keys para se utilizar na api, em ambiente de teste.

 Há também uma aquivo "index.js" com todas as configurações de um servidor http pelo "express". No mesmo arquivo "index.js" também foi colocado as rotas para o pagarme. Não separei de forma organizada por focar somente em entender o procedimento e funcionamento da API.
***

**- Pasta views**

**arquivo client.js** = Aqui ele busca no banco de dados da pagarme toda informação/dados do que o cliente tenha feito no sistema, informações como: timeline de evento de pagamento, informações do boleto gerado, informações de cartão utilizado do cliente( bandeira, número de parcelas, portador informado, número cartão ), detalhes de transação, informações do cliente, informações de cobrança, informações de entrega, itens comprado pelo cliente.

OBS: Todos as informações são criptografadas pela pagarme, a api fornece tratamentos de segurança, mas sempre é bom ter uma segurança a mais.


**arquivo dashboard.js** = Aqui criei uma tabela com informações expecíficas de cada cliente salva no banco da pagarme, para ter uma melhor visualização. Nela podemos dar acesso a um cliente específico, e ela se redireciona para o arquivo client.js. Resumindo: o arquivo dashboard nos mostra informações superficiais de cada cliente e pode nos redirecionar para a o aquivo client.js pela rota, e ter as informações completas necessárias de um cliente específico.


**arquivo extrato.js** = Nessa sessão podemos realizar o "saque", transferindo o dinheiro disponível para nossa conta informada. Caso tenha mais curiosidades, olhe a documentação da pagarme.


**arquivo forms.js** = Criei um formulário simples para realizar testes de transação de cartão de crédito ou boleto ( com informações fictícias, claro ).
***

**Arquivo App.js e Arquivo routes.js** = Estes arquivos se encontram dentro da pasta **src**. No arquivo App.js, o componente chama um outro componente "Routes", que se encontra no arquivo routes.js. Dentro do arquivo routes.js, foram criadas rodas em ReactJS para direcionar aos arquivos/componentes forms.js, dashboard.js, extrato.js e client.js.
***

# Classificações gerais
Não foi um projeto grande, mas um pequeno teste para aprender e fixar as informações obtidas pela documentação da pagarme. Todos os códigos existem alguns comentários para orientações, pois a sintaxe não possui uma boa organização de código.

Respeitosamente, ao pessoal da pagarme e aos demais que acessarem meu repositório.
