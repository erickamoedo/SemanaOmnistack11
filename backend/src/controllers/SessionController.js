const connection = require('../database/connection');
const { create } = require('./OngController');

module.exports = {

    async create(request, response) {
        const {id} = request.body;

        const ong = await connection('ongs')
            .where('id', id)
            .select('name')
            .first();

        if (!ong)  {
            return response.status(400).json({ error: 'Nenhuma ong encontrada com esse ID'})
        }  
        return response.json(ong);
        
    }


}