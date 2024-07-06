const Lead = require('../schemas/schemaLead');

const getLeads = async (req, res) => {
    try {
        const leads = await Lead.findAll();
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
};

const createOneLead = async (req, res) => {
    try {
        const lead = req.body;
        const { hospitalEmail } = lead;

        if (!hospitalEmail) {
            return res.status(400).json({ message: 'Email do hospital não fornecido.' });
        }

        const existingLead = await Lead.findOne({ where: { hospitalEmail } });

        if (existingLead) {
            return res.status(409).json({ message: 'O Cliente já obteve orçamento.' });
        }

        if (Object.keys(lead).length > 0) {
            const newLead = await Lead.create(lead);
            res.status(201).json(newLead);
        } else {
            res.status(406).json({ message: 'Ops, não foi possível adicionar esse cliente!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOneLead = async (req, res) => {
    try {
        const lead = req.body;
        const { hospitalEmail } = lead;

        if (!hospitalEmail) {
            return res.status(400).json({ message: 'Email do hospital não fornecido.' });
        }

        const existingLead = await Lead.findOne({ where: { hospitalEmail } });

        if (existingLead) {
            return res.status(409).json({ message: 'Email já cadastrado no banco de dados.' });
        }

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
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLeads, getOneLead, createOneLead, updateOneLead, deleteOneLead };
