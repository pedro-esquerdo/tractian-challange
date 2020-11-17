/**
 * Arquivo: produto.js
 * Autor: Pedro Esquerdo
 * Descrição: Criação da classe produto para desafio Tractian
 * Data: 11/11/2020
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  LocationSchema = new Schema({
    name: String,
    description: String,
    adress: String,
    responsable_id: String,
});

module.exports = mongoose.model('LocationCompany', LocationSchema);
