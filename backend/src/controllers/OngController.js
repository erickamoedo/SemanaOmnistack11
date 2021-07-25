const crypto = require('crypto');
const connection = require(`../database/connection`);


module.exports = {
// Vai listar tudo da tabela: http://localhost:3333/ongs  -
async index (request, response) {
    const ongs = await connection(`ongs`).select(`*`);
    return response.json(ongs);
 },


async create(request,response) {

    const { name, email, whatsapp, city, uf } = request.body;

    const id = crypto.randomBytes(4).toString(`HEX`);

    //console.log(data);

    // invoka a conexao para inserir dados no BD
    await connection(`ongs`).insert({

        id,
        name,
        email,
        whatsapp,
        city,
        uf,
    });

    return response.json( { id });
}

};