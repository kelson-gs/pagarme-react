import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import secret from '../back-end/config/pagme.json';
import axios from 'axios';
import pagarme from 'pagarme';

class Forms extends Component{
    constructor(props){
        super(props);
        this.state = {
            card_number: '',
            card_holder_name: '',
            card_expiration_month: '',
            card_expiration_year: '',
            card_cvv: ''
        }
        this.formSubmit = this.formSubmit.bind(this);
        this.boleto = this.boleto.bind(this);
    }

    boleto(){
        axios.post('http://localhost:8080/transation/boleto')
        .then( success => console.log(success) )
        .catch( err => console.log(err) );
    }

    formSubmit(event){
        event.preventDefault();

        

        let { 
            card_number, 
            card_cvv, 
            card_expiration_month, 
            card_expiration_year,
            card_holder_name
         } = this.state;

        let card = {};
        card.card_holder_name = card_holder_name;
        card.card_expiration_date = `${card_expiration_month}${card_expiration_year}`;
        card.card_number = card_number;
        card.card_cvv = card_cvv;
        
         
        // pegar os erros de validação nos campos do form e a bandeira do cartão
        let cardValidations = pagarme.validate({card: card});

        // Então você pode verificar se algum campo não é válido
        if( !cardValidations.card.card_number ){
            console.log('Oops, número de cartão incorreto');
        }

        // Mas caso esteja tudo certo, você pode seguir o fluxo
        pagarme.client.connect({ encryption_key: secret.cryted_key })
        .then( client => client.security.encrypt(card) )
        .then( card_hash => { 
            console.log(card_hash);
            // o próximo passo aqui é enviar o card_hash para seu servidor, e 
            // em seguida criar a transação/assinatura
            axios.post('http://localhost:8080/transation', {
                card_hash: card_hash
            }).then(()=>{
                console.log('card_hash process successfull')
            }).catch( err => console.log(err) )

        } )
        
        return false;
    }

    render(){
        
        return(
            <div>
                <div>
                    <Link to="/dashboard">Painel de controle </Link>

                    <Link to="/extratos" >/ Extratos</Link>
                </div>

                <hr/>

                <div id="form">
                    <h1>Cartão de crédito</h1>
                    Número do cartão: <input type="text" id="card_number"
                                    onChange={ (e) => this.setState({ card_number: e.target.value }) }/>
                    <br/>
                    Nome (como escrito no cartão): <input type="text" id="card_holder_name"
                                                 onChange={ (e) => this.setState({ card_holder_name: e.target.value }) }/>
                    <br/>
                    Mês de expiração: <input type="text" id="card_expiration_month"
                                     onChange={ (e) => this.setState({ card_expiration_month: e.target.value }) }/>
                    <br/>
                    Ano de expiração: <input type="text" id="card_expiration_year" 
                                    onChange={ (e) => this.setState({ card_expiration_year: e.target.value }) }/>
                    <br/>
                    Código de segurança: <input type="text" id="card_cvv" 
                                    onChange={ (e) => this.setState({ card_cvv: e.target.value }) }/>
                    <br/>
                    <div id="field_errors">
                    </div>
                    <br/>
                </div>
                <form id="payment_form">
                    <input type="submit" onClick={this.formSubmit}></input>
                </form>

                <hr/>

                <div>
                    <h1>Boleto</h1>
                    <form>
                        <label>Nome completo: </label>
                        <input type="Text"/>
                        <br/>

                        <label>Email: </label>
                        <input type="email" />
                        <br/>

                        <label>Cidade: </label>
                        <input type="text" />
                        <br/>

                        <label>estado: </label>
                        <input type="text" />
                        <br/>

                        <label>CPF: </label>
                        <input type="text"/>
                        <br/>

                        <label>Rua: </label>
                        <input type="text"/>
                        <br/>
                        
                        <label>Numero da casa: </label>    
                        <input type="number"/>
                        <br/>

                        <label>bairro: </label>
                        <input type="text"/>
                        <br/>

                        <label>CEP: </label>
                        <input type="text" />
                        <br/>
                        <br/>

                        <button onClick={this.boleto}>Enviar</button>
                    </form>              
                </div>
            </div>
        );
    }
}

export default Forms;