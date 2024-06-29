const Lead = require('../schemas/schemaLead');

const getLeads = async (req, res) => {
    try {
        const leads = await Lead.findAll();
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).send('Erro ao buscar clientes.');
    }
};

const getOneLead = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await Lead.findByPk(id);

        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).send('Cliente não encontrado!');
        }
    } catch (error) {
        res.status(500).send('Erro ao buscar cliente.');
    }
};

const createOneLead = async (req, res) => {
    try {
        const lead = req.body;

        if (Object.keys(lead).length > 0) {
            const newLead = await Lead.create(lead);
            res.status(201).json(newLead);
        } else {
            res.status(406).send('Ops, não foi possível adicionar esse cliente!');
        }
    } catch (error) {
        res.status(500).send('Erro ao adicionar cliente.');
    }
};

const updateOneLead = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedLead = await Lead.update(req.body, {
            where: { id }
        });

        if (updatedLead[0] > 0) {
            res.status(200).send('Informações do cliente atualizadas com sucesso!');
        } else {
            res.status(404).send('Cliente não encontrado!');
        }
    } catch (error) {
        res.status(500).send('Erro ao atualizar cliente.');
    }
};

const deleteOneLead = async (req, res) => {
    try {
        const id = req.params.id;
        const rowsDeleted = await Lead.destroy({
            where: { id }
        });

        if (rowsDeleted > 0) {
            res.status(200).send('Cliente removido com sucesso!');
        } else {
            res.status(404).send('Não foi possível excluir: ID não encontrado.');
        }
    } catch (error) {
        res.status(500).send('Erro ao excluir cliente.');
    }
};

module.exports = { getLeads, getOneLead, createOneLead, updateOneLead, deleteOneLead };
