/**
 * Arquivo: produto.js
 * Autor: Pedro Esquerdo
 * Descrição: Criação da classe produto para desafio Tractian
 * Data: 11/11/2020
 */

/**
 * Produto:
 * 
 * id: int
 * name: string
 * image: ??
 * description: string
 * model: string
 * responsable_id: int
 * status: string
 * healthscore: number
 * 
 */

     //image: { 
    //    data: Buffer, 
    //    contentType: String 
    //}, 

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var  AtivoSchema = new Schema({
    name: String,
    description: String,
    model: String,
    responsable_id: String,
    location: { type: Schema.Types.ObjectId, ref: 'LocationSchema' },
    status: String,
    healthscore: Number,
    maintenance: {
        responsable_id: String,
        date: Date,
        initial_healthscore: Number,
        final_healthscore: Number,
        details: String
    }

});

module.exports = mongoose.model('Ativo', AtivoSchema);