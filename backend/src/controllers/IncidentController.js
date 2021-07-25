const { response } = require('express');
const connection = require('../database/connection');
const { create } = require('./OngController');

module.exports = {

// metodo listagem - Vai listar tudo da tabela: http://localhost:3333/ongs 
async index (request, response) {

    // nessa constante eu estou armazenando o total de registros dessa tabela incidents
    const [count] = await connection('incidents').count();
    // console.log(count);

    // aqui é um tratamento para paginação, e nao imprimir tudo de uma vez
    const {page = 1} = request.query;
    const incidents = await connection('incidents')
     
        .join ('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select([
           'incidents.*',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf'
        ]);
     
     // eu coloco o total de registros no cabecalho
     response.header('X-Total-Count', count['count(*)']);
     return response.json(incidents);
 },


async create(request, response) {
 const { title, description, value } = request.body;
 const ong_id = request.headers.authorization;

 const [id] = await connection ('incidents').insert({

    title,
    description,
    value,
    ong_id,
 });

  return response.json({ id });

},


// rota para deletar um ID
async delete(request, response) {

    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const incident = await connection ('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

    if (incident.ong_id != ong_id)   {

        return response.status(401).json({ error: 'operação não permitida'});
    }

    await connection('incidents').where('id', id).delete();

    return response.status(204).send();
}

};