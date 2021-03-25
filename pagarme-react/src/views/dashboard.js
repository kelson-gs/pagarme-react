import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            transacao: [],
            saldo: [],
            client_id: '',
            payment: '',
            click: 1
        }
        this.getTransaction = this.getTransaction.bind(this);
        this.estornoCartão = this.estornoCartão.bind(this);
        this.estornoBoleto = this.estornoBoleto.bind(this);
    }

    estornoCartão(){
        const { client_id } = this.state;

        axios.post(`http://localhost:8080/transation/${client_id}/refund`)
        .then( success => console.log('Estorno realizado com sucesso: ', success) )
        .catch( err => console.log('Houve um erro ao realizar o estorno: ', err) )
        
    }


    estornoBoleto(){
        axios.post(`http://localhost:8080/transation/boleto/refund`, {
            id: 'id',
            codeb: 'bank_code',
            ag: 'agencia',
            agdv: 'agencia_dv',
            conta: 'conta',
            contadv: 'conta_dv',
            legaln: 'legal_name',
            docnumber: 'document_number'
        })
        .then( success => console.log('Estorno de boleto realizado com sucesso: ', success) )
        .catch( err => console.log( 'Houve um erro ao estornar o boleto: ', err ) );
    }

    async getTransaction(){
        await axios.get('http://localhost:8080/transation/return')
        .then(transacoes => 
            transacoes.data.map( item => ({
                id: item.id,
                amount: item.amount,
                paid_amount: item.paid_amount,
                status: `${item.status}`,
                card_band: `${item.card_band}`,
                card_first_digits: `${item.card_first_digits}`,
                card_holder_name: `${item.card_holder_name}`,
                card_last_digits: `${item.card_last_digits}`,
                card: item.card,
                items: item.items,
                shipping: item.shipping,
                billing: item.billing,
                customer: item.customer,
                payment_method: `${item.payment_method}`,
                date_created: `${item.date_created}`,
                date_updated: `${item.date_updated}`,
                installments: `${item.installments}`,
                risk_level: `${item.risk_level}`,
            }))
        ).then( item => {
            this.setState({
                transacao: item
            })
        }) 
        
    }

    componentDidMount(){
        this.getTransaction();
        
    }

    render(){
        const { transacao, isLoading, client_id} = this.state;
        return(
            <div>
                <h1>Transação</h1>
                <div>
                    
                    <div>
                        <table>
                            <thead>
                                <tr>
                                        <th><input type="checkbox" /></th>
                                        <th><label>Status</label></th>
                                        <th><label>ID</label></th>
                                        <th><label>Data</label></th>
                                        <th><label>Nome</label></th>
                                        <th><label>Forma de Pagamento</label></th>
                                        <th><label>Número do Cartão</label></th>
                                        <th><label>Documento</label></th>
                                        <th><label>Email</label></th>
                                        <th><label>Telefone</label></th>
                                        <th><label>Operadora de Cartão</label></th>
                                        <th><label>Bandeira do Cartão</label></th>
                                        <th><label>Valor</label></th>
                                        <th><label>Valor Capturado</label></th>
                                        <th><label>Valor Estornado</label></th>
                                        <th><label>Score Pagar.me</label></th>
                                </tr>
                            </thead>
                            <tbody >
                            {isLoading === true ? (
                                transacao.map(item => {
                                    const {
                                        amount,  card, 
                                        card_first_digits, card_holder_name,
                                        card_last_digits, date_created ,customer ,
                                        id, payment_method,
                                         status, risk_level
                                    } = item;

                                    const trStyle = {
                                        cursor: 'pointer'
                                    }
                                    return(
                                        
                                            <tr key={id} style={trStyle}>
                                                <td><input value={id} type="checkbox" onChange={ () => {
                                                    const {click} = this.state;

                                                    if(click === 1){
                                                        const client = id;
                                                        const payment = payment_method;

                                                        this.setState({ client_id: client,
                                                            payment: payment,
                                                            click: 2
                                                        });
                                                    } else {
                                                        this.setState({ 
                                                            client_id: '',
                                                            click: 1
                                                        });
                                                    }
                                                } } /></td>
                                                <td><label>{status}</label></td> 
                                                <td><label>{id}</label></td>
                                                <td><label>{date_created}</label></td>
                                                {payment_method === 'boleto' ? (
                                                    <td><label>{customer.name}</label></td>
                                                ):(
                                                    <td><label>{card_holder_name}</label></td>
                                                )}
                                                <td><label>{payment_method}</label></td>
                                                <td><label>{card_first_digits + card_last_digits}</label></td>
                                                <td><label>{customer.documents.numbers}</label></td>
                                                <td><label>{customer.email}</label></td>

                                                {customer.phone_numbers === null ? (
                                                <td><label>sem numero</label> </td>
                                                                ):(
                                                <td><label>{customer.phone_numbers[0]}</label></td>
                                                )}

                                                <td><label>{'pagar.me'}</label></td>
                                                {card === null ? (
                                                <td><label>sem bandeira</label> </td>
                                                                ):(
                                                <td><label>{card.brand}</label></td>
                                                )}
                                                <td><label>{amount}</label></td>
                                                <td><label>{amount}</label></td>
                                                <td><label>{'-'}</label></td>
                                                <td><label>{risk_level}</label></td>
                                                <td><label>{}</label></td>
                                            </tr>
                                    
                                    );
                                
                                })
                            ):(
                                null
                            )}
                            </tbody>
                            
                        </table>
                        <Link to={`/${client_id}/client`} className="btn_transacao"><button>avaliar cliente</button></Link>
                        {this.state.payment === 'credit_card' ? (
                            <button onClick={this.estornoCartão} className="btn_transacao">Extornar</button>
                        ): (
                            <Link to='/:id/estorno/boleto' className="btn_transacao"><button>Extornar</button></Link>
                        )}
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Dashboard;