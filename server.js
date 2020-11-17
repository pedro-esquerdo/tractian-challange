/**
 * Arquivo: server.js
 * Descrição: API para o desafio Tractian
 * Autor: Pedro Esquerdo
 * Data de Criação: 10/11/2020
 */

 // App Setup:

 // chamando pacotes
 var express = require('express');
 var app = express();
 var bodyParser = require('body-parser');
 var mongoose = require('mongoose');
 var Ativo = require('./app/models/ativo')
 var LocationCompany = require('./app/models/location')
 var cors = require('cors')

 // Conexão no mongodb atlas
 mongoose.connect('mongodb+srv://pedro-esquerdo:pedro94@cluster0.vcvkk.mongodb.net/tractian-challange-pedro?retryWrites=true&w=majority', {
     useNewUrlParser: true,
      useUnifiedTopology: true}
      );

 // Configuração da app para usar o BodyParser:
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(bodyParser.json());
 app.use(express.json());
 app.use(cors());

 // Definindo porta para uso da API:
 var port = process.env.Port || 8000;

 // Definir rotas via express
 var router = express.Router();

 // Teste rota de exepmlo
 router.use(function(req, res, next) {
    console.log('Atividade reconhecida..');
    next();
});

router.get('/', function(req,res){
    res.json({message: "Welcome"})
});

//Rotas da API:
 //==========================||================================================

// rotas que terminarem com '/ativo servem para get e post
router.route('/ativos')
   /*Metodo 1): Criar ativos: (acessar: POST http://localhost:8000/api/ativos) */
    .post(function(req,res) {
       console.log(req.body);
       console.log(req.body.maintenance);

       var ativo = new Ativo();
       ativo.name = req.body.name;
       ativo.description = req.body.description;
       ativo.model = req.body.model;
       ativo.responsable_id = req.body.responsable_id;
       ativo.location = req.body.location;
       ativo.status = req.body.status;
       ativo.healthscore = req.body.healthscore;
       ativo.maintenance.responsable_id= req.body.responsable_id;
       ativo.maintenance.date= req.body.date;
       ativo.maintenance.initial_healthscore= req.body.initial_healthscore;
       ativo.maintenance.final_healthscore= req.body.final_healthscore;
       ativo.maintenance.details= req.body.details;
        
       //console.log("Res : " , res.toString())
       //console.log("Res : " , req)

       ativo.save(function(error){
            if(error) {
                res.send('Falha ao salvar' , error)
            }
            else {
            res.json({message: 'Produto salvo com sucesso'})
            }



       });
   })   
   // Selcionar todos os ativos.(acessar: GET http://localhost:8000/api/ativos)
   .get(function(req, res){
       Ativo.find(function(error, ativos){
           if(error)
                res.send('Falha ao obter ativos' + error)
           res.json(ativos);
       });
   });


   // Ativos por ID: (acessar: GET, PUT, DELETE http://localhost:8000/api/ativos/<ativo_id>)
   router.route('/ativos/:ativo_id')

   // Selecionar ativo por ID (acessar: GET http://localhost:8000/api/ativos/<ativo_id>)
   .get(function(req,res) {
        console.log(req.params);        
       Ativo.findById(req.params.ativo_id, function(error,ativo){
        if(error)
            res.send('Erro ao achar ativo' + error);
        res.json(ativo);
       });
   })

   // Atualizar ativo por ID (acessar: PUT http://localhost:8000/api/ativos/<ativo_id>)
   .put(function(req,res){

        // Achar id do produto.
        Ativo.findById(req.params.ativo_id, function(error,ativo){
            if(error)
                res.send('Erro ao achar ativo' + error);

        // Entrada dos novos dados
                ativo.name = req.body.name;
                ativo.description = req.body.description;
                ativo.model = req.body.model;
                ativo.responsable_id = req.body.responsable_id;
                ativo.location = req.body.location;
                ativo.status = req.body.status;
                ativo.healthscore = req.body.healthscore;
        
        //Salvar dados atualizados
                ativo.save(function(error){
                    if(error)
                        res.send('Falha ao atualizar dados dados' + error);
                    res.json({message: 'Produto atualizado com sucesso'});
            });            
        });
    })

   // Deletar ativo por ID (acessar: DELETE http://localhost:8000/api/ativos/<ativo_id>)
    .delete(function(req, res) {

        Ativo.remove({
            _id: req.params.ativo_id
        }, function(error) {
            if(error)
                res.send('Erro ao achar ativo' + error);
            res.json({message: 'Ativo excluído' });
        });
    });

        // Ativos por local: (acessar: GET http://localhost:8000/api/ativos/local)
        router.route('/ativos/local/location')
        // Selecionar ativo por local (acessar: GET http://localhost:8000/api/ativos/<local>)
        .post(function(req,res) {

            //console.log(req.body, typeof req.body, Object.values(req.body))
            //console.dir(req.body)
            var hs = Object.entries(req.body.params.healthscore).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), 1000)
            var filters = {
                location: req.body.params.location,
                status: {$regex: req.body.params.status},
                name: {$regex: req.body.params.name},
                healthscore: {$lte: hs}
            };

            var filtered = Object.entries(filters).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})

            console.log({...filtered});
            Ativo.find({...filtered}, function(error,ativo){
            console.log('Get ativo por local: ',req.body.params.location,
                                                req.body.params.status,
                                                req.body.params.name,
                                                req.body.params.healthscore,
                                                ativo
                                                );
            if(error)
                res.send('Erro ao achar ativo' + error);
            res.json(ativo);
            });
        })

    //ROTAS PARA EMPRESAS
    //=====================================================================================

    router.route('/locais')
    /*Metodo 1): Criar empresas: (acessar: POST http://localhost:8000/api/locais) */
     .post(function(req,res) {
        console.log('OI' + req.body.toString())
        var location = new LocationCompany();
        location.name = req.body.name;
        location.description = req.body.description;
        location.adress = req.body.adress;
        location.responsable_id = req.body.responsable_id;
 
        location.save(function(error){
            if(error)
                 res.send('Falha ao salvar' + error)
             res.json({message: 'Produto salvo com sucesso'})
        });
    })   
    // Selcionar todos os locais.(acessar: GET http://localhost:8000/api/locais)
    .get(function(req, res){
        Location.find(function(error, Locais){
            if(error)
                 res.send('Falha ao obter locais' + error)
            res.json(Locais);
        });
    });
 
 
    // Locais por ID: (acessar: GET, PUT, DELETE http://localhost:8000/api/locais/<location_id>)
    router.route('/ativos/:location_id')
 
    // Selecionar Locais por ID (acessar: GET http://localhost:8000/api/locais/<location_id>)
    .get(function(req,res) {
        Location.findById(req.params.location_id, function(error,Locais){
         if(error)
             res.send('Erro ao achar Locais' + error);
         res.json(Locais);
        });
    })
 
    // Atualizar Locais por ID (acessar: PUT http://localhost:8000/api/locais/<location_id>)
    .put(function(req,res){
 
         // Achar id do local.
         Location.findById(req.params.location_id, function(error,location){
             if(error)
                 res.send('Erro ao achar local' + error);
 
         // Entrada dos novos dados
         location.name = req.body.name;
         location.description = req.body.description;
         location.adress = req.body.model;
         location.responsable_id = req.body.responsable_id;
         
         //Salvar dados atualizados
                location.save(function(error){
                     if(error)
                         res.send('Falha ao atualizar dados dados' + error);
                     res.json({message: 'Local atualizado com sucesso'});
             });            
         });
     })
 
    // Deletar local por ID (acessar: DELETE http://localhost:8000/api/locais/<location_id>)
     .delete(function(req, res) {
 
         Location.remove({
             _id: req.params.location_id
         }, function(error) {
             if(error)
                 res.send('Erro ao achar local' + error);
             res.json({message: 'Local excluído' });
         });
     });



// Definindo padrão das rotas:
app.use('/api',router);

// Iniciando a aplicação.
app.listen(port);
console.log("Iniciando app na porta " + port);