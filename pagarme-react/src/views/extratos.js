import React, { Component } from 'react';
import axios from 'axios';

class Extrato extends Component{
    constructor(props){
        super(props);
        this.state = {
            saldo: [],
            recebivel: [],
            bank_account_id: '',
            recipient_id: ''
        };

        this.saque = this.saque.bind(this);
        this.bank = this.bank.bind(this);
        this.consultaSaldo = this.consultaSaldo.bind(this);
        this.recebiveis = this.recebiveis.bind(this);
    }

    recebiveis(){
        axios.get('http://localhost:8080/recipients')
        .then( success => 
            
           success.data.map( item => ({
                bank_account_id: item.bank_account.id,
                recipient_id: item.id,
                legal_name: item.bank_account.legal_name
            }))
         )
        .then( items => {
            this.setState({
                recebivel: items
            })
        } );
    }

    consultaSaldo(){
        axios.get('http://localhost:8080/saldo/principalReceb')
        .then( client => {
            console.log('saldo: ', client.data)
            // formatação numero de saldo disponivel
            let num_available = client.data.available.amount
            let a = (num_available/100);
            let new_num_available = a.toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });

            // formatação numero de saldo tranferido
            let num_transferred = client.data.available.amount;
            let an = (num_transferred/100);
            let new_num_transferred = an.toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });

            // formatação numero de saldo em espera
            let num_waiting = client.data.waiting_funds.amount;
            let cont = (num_waiting/100);
            let new_num_wating = cont.toLocaleString('pt-br', { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
        
            this.setState({ saldo: {
                waiting_funds: new_num_wating,
                transferred: new_num_transferred,
                available: new_num_available
            } })
            
        } )

    }

    bank(){
        axios.post('http://localhost:8080/contaBank')
        .then( success => console.log('conta criada: ', success) )
        .catch( err => console.log('Houve um erro ao criar banco: ', err) );
    }

    saque(){
        const { bank_account_id, recipient_id } = this.state;
        const { available } = this.state.saldo;

        axios.post('http://localhost:8080/saque/transfers', {
            amount: available,
            bank_account_id: bank_account_id,
            recipient_id: recipient_id
        })
        .then( success => console.log(' Saque realzado ', success) )
        .catch( err => console.log('Houve um erro ao realizar o saque: ', err) );
    }

    componentDidMount(){
        this.consultaSaldo();
        this.recebiveis();
    }

    render(){
        const { waiting_funds, available } = this.state.saldo;
        const { recebivel } = this.state;

        return(
            <div>
                <h1>Extrato</h1>
                <div>
                    <div>
                        <h3>Recebedores</h3>
                        
                        <div>
                            <h3>Selecione o recebedor</h3>
                            <div >
                                {recebivel.map( recebiveis => (
                                    <label key={recebiveis.recipient_id} onClick={() => {
                                        this.setState({
                                            bank_account_id: recebiveis.bank_account_id,
                                            recipient_id: recebiveis.recipient_id
                                        })
                                    }}> {recebiveis.legal_name} </label>
                                ) )}
                            </div>
                            
                        </div>

                        <div>
                            <button onClick={this.saque}>Realizar saque</button>
                            <h2> - Criar antecipação</h2>
                            <button onClick={this.bank}>adicionar conta bancária</button>

                            <hr/>

                            <h3>Saldo disponível</h3>
                            <label> {`${available}`}</label>

                            <h3>Saldo a receber</h3>
                            <label> {`${waiting_funds}`}</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Extrato;