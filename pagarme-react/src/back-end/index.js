const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const pagarme = require('pagarme');
const secret = require('./config/pagme.json');


// configuração de processamento e leitura http por josn
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// rotas pagarme:

// conta bancára
app.post('/contaBank', (req, res) => {
            
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.bankAccounts.create({
        bank_code: '237',
        agencia: '1935',
        agencia_dv: '9',
        conta: '23398',
        conta_dv: '9',
        legal_name: 'API BANK ACCOUNT',
        document_number: '26268738888'
    }) )
    .then(bankAccount => {
        console.log(bankAccount);
        res.send(bankAccount);
    });
});

// cartão de crédito
app.post('/transation', (req, res) => {
    const { card_hash } = req.body;

    let payload = {
        "amount": 21000,
        "card_hash": card_hash,
        "payment_method": "credit_card",
        "installment": 6,
        "customer": {
            "external_id": "15",
            "name": "matheus genital",
            "email": "matheus@test.com",
            "country": "br",
            "type": "individual",
            "documents": [
                {
                    "type": "cpf",
                    "number": "30621143049"
                }
            ],
            "phone_numbers": [
                "+5511999988888",
                "+5511888889999"
            ],
            "birthday": "1965-01-01"
        },
        "billing": {
            "name": "tathiago digital",
            'address': {
                "country": "br",
                "state": "bh",
                "city": "itapetinga",
                "neighborhood": "centro",
                "street": "Rua Stantos Dumont",
                "street_number": "94",
                "zipcode": "45700000"
            }
        },
        "shipping": {
            "name": "matheus",
            "fee": 400,
            "delivery_date": "2020-12-21",
            "expedited": false,
            "address": {
                "country": "br",
                "state": "sp",
                "city":"Cotia",
                "neighborhood": "Rio Cotia",
                "street": "Rua Matrix",
                'street_number': "9999",
                "zipcode": "06714360"
            }
        },
        "items": [
            {
                "id": "13",
                "title": "red pill",
                "unit_price": 10000,
                "quantity": 1,
                "tangible": true
            },{
                "id": "56",
                "title": "blue pill",
                "unit_price": 10000,
                "quantity": 1,
                "tangible": true
            }
        ]
    }

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( async client => {
       try {
          await client.transactions.create(payload)
          .then( resp => console.log(res.id))
        } catch (e) {
            console.log(e.response);
        }
    })
    .catch(err => console.log(err))

    pagarme.transactions.create(payload).catch(e => console.log(e.response));
});

// boleto
app.post('/transation/boleto', (req, res) => {

    let payloadBoleto = {
        "amount": 20000,
        "payment_method": "boleto",
        "postback_url": "http://requestb.in/pkt7pgpk",
        "capture": true,
        "boleto_expiration_date": "2020-12-31",
        "customer": {
            "external_id": "#3311",
            "type": "individual",
            "country": 'br',
            "name": "Aardvark Silva",
            "email": "kelsonredbana12@gmail.com",
            "documents": [
                {
                    "type": "cpf",
                    "number": '00000000000'
                }
            ] 
        },
        "billing": {
            "name": "Trinity Moss",
            "address": {
                "country": "br",
                "state": "bh",
                "city": "vitória da conquista",
                "neighborhood": "centro",
                "street": "Rua cotia",
                "street_number": "9999",
                "zipcode": "06714360"
            }
        },
        "shipping": {
            "name": "Neo Reeves",
            "fee": 1000,
            "delivery_date": "2020-12-21",
            "expedited": true,
            "address": {
                "country": "br",
                "state": "sp",
                "city": "cotia",
                "neighborhood": "centro oeste",
                "street": "Rua matrix",
                "street_number": '9999',
                "zipcode": '06714360'
            }
        },
        "items": [
            {
                "id": "r123",
                "title": "Red pill",
                "unit_price": 10000,
                "quantity": 1,
                "tangible": true
            },
            {
               "id": "b123",
                "title": "blue pill",
                "unit_price": 10000,
                "quantity": 1,
                "tangible": true
            }
        ]
    }

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( async client => {
       try {
          await client.transactions.create(payloadBoleto)
          .then( resp => {
              console.log(resp.id);
              res.send(resp);
            })
        } catch (e) {
            console.log(e.response);
        }
    })
    .catch(err => console.log(err))

    /*
    pagarme.client.connect({ 
        api_key: secret.api_key
     })
     .then( client => client.transactions.create() )
    .then( transtation => {
         console.log(transtation)
         res.send(transtation);
        } ).catch( err => {
            console.log(err.response);
            res.send(err);
        })
    */
        
});


// estorno cartão de crédito
app.post('/transation/:id/refund', (req, res) => {
    const { client_id } = req.params;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.transactions.refund({
        id: client_id
    }) )
    .catch(err => console.log(err));

    res.send('refund complet with success!');

});

// estorno boleto
app.post('/transation/boleto/refund', (req, res) => {
    const {id, codeB, ag, agdv,
         conta, contadv, legaln, docnumber} = req.body;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.transactions.refund({
        id: `${id}`,
        bank_code: `${codeB}`,
        agencia: `${ag}`,
        agencia_dv: `${agdv}`,
        conta: `${conta}`,
        conta_dv: `${contadv}`,
        legal_name: `${legaln}`,
        document_number: `${docnumber}`
    }) )
});


// retornando transações
app.get('/transation/return', (req, res) => {
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.transactions.all() )
    .then( transactions => {
        console.log(transactions);
        res.send(transactions);
    });
});


// retornando uma transação
app.get('/transation/:id_transation/returnOne', (req, res) => {
    const { id_transation } = req.params;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.transactions.find({
        id: id_transation
    }) )
    .then( transation => {
        res.send(transation)
        console.log(transation)
    } )


});


// retornando recebíveis de uma transação
app.get('/transation/:id_transation/payables', (req, res) => {
    const { id_transation } = req.params;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.payables.find({
        transactionId: id_transation
    }) )
    .then( payables => console.log(payables))

});

// retornando um recebível da transação
app.get('/transation/:id_transation/payable/:id_payable', (req, res) => {
    const { id_transation, id_payable } = req.params;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.payables.find({
        transactionId: `${id_transation}`,
        id: `${id_payable}`
    }) )
    .then( payables => console.log(payables) )
});


// retorna histórico de uma transação
app.get('/transation/:transation_id/operations', (req, res) => {
    const { transation_id } = req.params;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.gatewayOperations.find({
        transactionId: transation_id
    }) )
    .then( gatewayOperations => {
        res.send(gatewayOperations);
        console.log(gatewayOperations);
    } )
});


// notificando cliente sobre boleto a ser pago
app.post('/transation/:transition_id/collect_payment', (req, res) => {
    const { transation_id, email } = req.body;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.transactions.collectPayment({
        id: transation_id,
        email: email
    }) )
});


// retorna eventos de uma transação
app.get('/transation/:transation_id/events', (req, res) => {
    const { transation_id } = req.params;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.events.find({
        transactionId: transation_id
    }) )
    .then( events => {
        res.send(events)
        console.log(events)
    } )
});


// realizar saque
app.post('/saque/transfers', (req, res) => {

    const { amount, bank_account_id, recipient_id } = req.body;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then(client => client.transfers.create({
        amount: 119700,
        bank_account_id: bank_account_id,
        recipient_id: recipient_id
    }))
    .then(transfer => console.log(transfer))
});

// Cancelando um saque
app.post('/saque/:transfer_id/cancel', (req, res) => {
    const { transfer_id } = req.body;

    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.transfers.cancel({
        id: transfer_id
    }) )
    .then(() => {
        res.send('saque cancell successfull !!');
    })
});

// Consultar saldo do recebedor principal da empresa
app.get('/saldo/principalReceb', (req, res) => {
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.balance.primary() )
    .then( balance => {
        console.log(balance);
        res.send(balance);
    });
});


// Histórico das operações do saldo de sua conta
app.get('/saldo/balance/operations', (req, res) => {
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.balanceOperations.all() )
    .then( balanceOperations => {
        console.log(balanceOperations);
        res.send(balanceOperations);
    } )
});


// retornando recebíveis da sua empresa
app.get('/saldo/payables', (req, res) => {
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.payables.all())
    .then( payables => {
        console.log(payables);
        res.send(payables);
    });
});

// calculando pagamentos parcelados
app.get('/transtion/calculate_installments_amount', (req, res) => {
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.transactions.calculateInstallmentsAmount({
        id: 1234,
        max_installments: 3,
        free_installments: 2,
        interest_rate: 13,
        amount: 1000
    }) )
    .then( installments => console.log(installments) )
});


// retornando um array de objetos com todos os recebedores criados pela companhia.
app.get('/recipients', (req, res) => {
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => client.recipients.all() )
    .then( recipients => {
        console.log(recipients);
        res.send(recipients);
    } );
});


// testando pagamento de boletos
app.put('/transation/:transation_id/boleto_test', (req, res) => {
    pagarme.client.connect({
        api_key: secret.api_key
    })
    .then( client => {
        client.transactions.find({
            id: '2193246'
        })
        .then( transations => {
            client.transactions.update({
                id: transations.id,
                status: 'paid'
            })
        } )
    } )
})


app.listen(8080, () => {
    console.log('Servidor rodando na porta: localhost:8080');
});