import React, { Component } from 'react';
import axios from 'axios';

class Client extends Component{
    constructor(props){
        super(props);
        this.state = {
            id_transation: this.props.match.params.id,
            client: [],
            customer: [],
            billing: [],
            shipping: [],
            items: [],
            history_transation: [],
            events_transition: []
        }
    
    } 

    componentDidMount(){
        const { id_transation } = this.state;

        // pegando uma transação
        axios.get(`http://localhost:8080/transation/${id_transation}/returnOne`)
        .then( item => {
            this.setState({ client: item.data,
                            customer: {
                                name_customer: item.data.customer.name,
                                birthday: item.data.customer.birthday, 
                                external_id: item.data.customer.external_id,
                                document_number: item.data.customer.documents.number,
                                document_type: item.data.customer.documents.type,
                                email: item.data.customer.email, 
                                type: item.data.customer.type, 
                                phone_number: item.data.customer.phone_numbers,
                                

                            },
                            billing: {
                                city: item.data.billing.address.city,
                                name_billing: `${item.data.billing.name}`,
                                country: item.data.billing.address.country,
                                neighborhood: item.data.billing.address.neighborhood,
                                state: item.data.billing.address.state,
                                street: item.data.billing.address.street,
                                street_number: item.data.billing.address.street_number,
                                zipcode: item.data.billing.address.zipcode,
                                complementary: item.data.billing.address.complementary
                                },

                            shipping: {
                                name_shipping: item.data.shipping.name,
                                delivery_date: item.data.shipping.delivery_date,
                                fee: item.data.shipping.fee,
                                city_shipping: item.data.shipping.address.city,
                                country_shipping: item.data.shipping.address.country,
                                complementary_shipping: item.data.shipping.address.complementary,
                                neighborhood_shipping: item.data.shipping.address.neighborhood,
                                state_shipping: item.data.shipping.address.state,
                                street_shipping: item.data.shipping.address.street,
                                street_number_shipping: item.data.shipping.address.street_number,
                                zipcode_shipping: item.data.shipping.address.zipcode

                                },
                            items: item.data.items
            });
            
        } )
        
        // pegando um histórico de transação 
        axios.get(`http://localhost:8080/transation/${id_transation}/operations`)
        .then( history => {
            this.setState({ 
                history_transation: history.data,
            });
            
        } )
        
        // pegando o evento de uma transação
        axios.get(`http://localhost:8080/transation/${id_transation}/events`)
        .then( events => {
            this.setState({ events_transition: events.data });
            
        } )
    }

    render(){
        const { history_transation, items } = this.state;

        const { acquirer_name, acquirer_response_code,
                amount, authorization_code, 
                card_first_digits, card_last_digits, 
                card_holder_name, card_brand, tid, 
                installments, nsu, 
                payment_method, boleto_expiration_date, boleto_barcode,
                boleto_url
            } = this.state.client;
        
        const { birthday, name_customer, external_id,
                document_number, document_type, email, type, phone_number    
                } = this.state.customer;
        
        const { city, complementary, country, neighborhood,
                state, street, street_number, name_billing ,zipcode
                } = this.state.billing;

        const { city_shipping, name_shipping, fee, delivery_date,
                country_shipping, complementary_shipping, neighborhood_shipping,
                state_shipping, street_shipping, street_number_shipping, zipcode_shipping
                } = this.state.shipping;
        
     
        
        return(
            <div>
                <h1>Client area: </h1>
                
                <div id="events">
                    {history_transation.map( item => (
                        <div key={item.id} id="box_events" >
                            <h1>{ item.type }</h1>
                            <h2>{ item.status }</h2>
                        </div>
                    ) )}
                </div>

                { payment_method === "boleto" ? (
                    <div id="boleto_view">
                        <h1>Boleto</h1>
                        <label>Vencimento: </label>
                        <label>{boleto_expiration_date}</label>
                        
                        <br/>
                        <label>Código de barras: </label>
                        <label>{boleto_barcode}</label>

                        <br/>
                        <label>URL do boleto: </label>
                        <a href={boleto_url}>{boleto_url}</a>
                    </div>
                ) : (
                    <div id="card_view">
                        <h1>card View</h1>
                        <label>Número: </label>
                        <label>{card_first_digits + card_last_digits}</label>
                        
                        <br/>
                        <label>Portador informado: </label>
                        <label>{card_holder_name}</label>

                        <br/>
                        <label>Número de parcela: </label>
                        <label>{installments}</label>

                        <br/>
                        <label>Bandeira: </label>
                        <label>{card_brand}</label>
                    </div>
                )}

                <div id="transaction_view">
                    <h1>Detalhes da transação</h1>
                    <label>Operadora de cartão: </label>
                    <label>{acquirer_name}</label>

                    <br/>
                    <label>Resposta da operadora: </label>
                    <label>{acquirer_response_code}</label>

                    <br/>
                    <label>Código de autorização: </label>
                    <label>{authorization_code}</label>

                    <br/>
                    <label>TID: </label>
                    <label>{tid}</label>

                    <br/>
                    <label>NSU: </label>
                    <label>{nsu}</label>
                </div>

                <div id="client_view"> 
                <h1>Detalhes do cliente</h1>
                    <label>Nome do cliente: </label>
                    <label>{name_customer}</label>

                    <br/>
                    <label>Email: </label>
                    <label>{email}</label>

                    <br/>
                    <label>Telefone: </label>
                    <label>{phone_number}</label>

                    <br/>
                    <label>Documentos: </label>
                    <label>{document_type }</label>
                    <label>{document_number}</label>

                    <br/>
                    <label>Data de nascimento: </label>
                    <label>{birthday}</label>

                    <br/>
                    <label>Id do cliente na loja: </label>
                    <label>{external_id}</label>

                    <br/>
                    <label>Tipo de documento: </label>
                    <label>{type}</label>
                </div>

                <div id="billing_view">
                    <h1>Detalhes de cobrança</h1>
                    <label>Nome do pagador: </label>
                    <label>{name_billing}</label>

                    <br/>
                    <h2>Endereço</h2>
                    <label>Endereço: </label>
                    <label>{street}</label>

                    <br/>
                    <label>Complemento: </label>
                    <label>{complementary}</label>

                    <br/>
                    <label>Cidade: </label>
                    <label>{city}</label>

                    <br/>
                    <label>País: </label>
                    <label>{country}</label>

                    <br/>
                    <label>Número: </label>
                    <label>{street_number}</label>

                    <br/>
                    <label>Bairro: </label>
                    <label>{neighborhood}</label>

                    <br/>
                    <label>Estado: </label>
                    <label>{state}</label>

                    <br/>
                    <label>CEP: </label>
                    <label>{zipcode}</label>
                </div>

                <div id="shipping_view">
                    <h1>Detalhes de entrega</h1>
                    <label>Nome do recebedor: </label>
                    <label>{name_shipping}</label>

                    <br/>
                    <label>Data de entrega: </label>
                    <label>{delivery_date}</label>

                    <br/>
                    <label>Taxa de entrega: </label>
                    <label>R$ {fee}</label>
                    
                    <br/>
                    <h2>Endereço</h2>
                    <label>Endereço: </label>
                    <label>{street_shipping}</label>

                    <br/>
                    <label>Complemento: </label>
                    <label>{complementary_shipping}</label>

                    <br/>
                    <label>Cidade: </label>
                    <label>{city_shipping}</label>

                    <br/>
                    <label>País: </label>
                    <label>{country_shipping}</label>

                    <br/>
                    <label>Número: </label>
                    <label>{street_number_shipping}</label>

                    <br/>
                    <label>Bairro: </label>
                    <label>{neighborhood_shipping}</label>

                    <br/>
                    <label>Estado: </label>
                    <label>{state_shipping}</label>

                    <br/>
                    <label>CEP: </label>
                    <label>{zipcode_shipping}</label>
                </div>

                <div id="items_view">
                    <h1>Detalhes da compra</h1>
                    {items.map( item => (
                        <div key={item.id}>
                            <label>ID do produto: </label>
                            <label>{item.id}</label>

                            <br/>
                            <label>Nome do produto: </label>
                            <label>{item.title}</label>

                            <br/>
                            <label>Preço da unidade: </label>
                            <label>{item.unit_price}</label>

                            <br/>
                            <label>Quantidade: </label>
                            <label>{item.quantity}</label>

                            <br/>
                            <label>Bem fisico: </label>
                            <label>{item.tangible === true ? 'Sim' : 'Não'}</label>
                            <br/>
                            <br/>
                        </div>
                    ))}
                </div>

                <div id="valor_view">
                    <h1>Parcelas</h1>
                    <table>
                       <tbody>
                            <tr>
                                <td>{installments}</td>
                                <td>{amount}</td>
                                <td>{10.50}</td>
                                <td>{amount - 1050}</td>
                            </tr>
                       </tbody>
                    </table>
                </div>

            </div>
        );
    }
}

export default Client;