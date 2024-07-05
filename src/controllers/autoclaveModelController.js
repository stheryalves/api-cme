const Autoclave = require('../schemas/schemaAutoclave');

const getAutoclaveModels = async (req, res) => {
    try {
        const autoclaveModels = await Autoclave.findAll();
        res.status(200).send(autoclaveModels);
    } catch (error) {
        res.status(406).send('Erro ao buscar os modelos de autoclave.');
    }
}

const getOneAutoclaveModel = async (req, res) => {
    let id = req.params.id;
    try {
        const autoclaveModel = await Autoclave.findByPk(id);
        if (autoclaveModel) {
            res.status(200).send(autoclaveModel);
        } else {
            res.status(404).send('Modelo não encontrado!');
        }
    } catch (error) {
        res.status(500).send('Erro ao buscar o modelo de autoclave.');
    }
}

// const createOneAutoclaveModel = async (req, res) => {
//     const { autoclaveModel } = req.body;
//     try {
//         const newAutoclaveModel = await Autoclave.create({ autoclaveModel });
//         res.status(201).json(newAutoclaveModel);
//     } catch (error) {
//         res.status(406).send('Ops, não foi possível adicionar esse modelo!');
//         console.log(error)
//     } //edit

// }

const createOneAutoclaveModel = async (req, res) => {
    console.log('Request Body:', req.body);  // Adicione este log para verificar o corpo da requisição

    const {
        autoclaveModelName,
        totalChamberVolumeLt,
        usefulChamberVolumeLt,
        averageTotalCycleTimeHTMin,
        loadingAndUnloadingTimeMin,
        cycleTimeMin,
        dailyTimeBDTestMin,
        dailyTimeWarmUpMin,
        price,
        id_brand
    } = req.body;

    try {
        const newAutoclaveModel = await Autoclave.create({
            autoclaveModelName,
            totalChamberVolumeLt,
            usefulChamberVolumeLt,
            averageTotalCycleTimeHTMin,
            loadingAndUnloadingTimeMin,
            cycleTimeMin,
            dailyTimeBDTestMin,
            dailyTimeWarmUpMin,
            price,
            id_brand
        });
        res.status(201).send(newAutoclaveModel);
    } catch (error) {
        res.status(406).send('Ops, não foi possível adicionar esse modelo!');
        console.log(error);
    }
};

const updateOneAutoclaveModel = async (req, res) => {
    let id = req.params.id;
    try {
        const updated = await Autoclave.update(req.body, {
            where: { id: id }
        });
        if (updated[0] === 1) {
            res.status(200).send('Modelo atualizado com sucesso!');
        } else {
            res.status(404).send('Modelo não encontrado!');
        }
    } catch (error) {
        res.status(500).send('Erro ao atualizar o modelo de autoclave.');
    }
}

const deleteOneAutoclaveModel = async (req, res) => {
    let id = req.params.id;
    try {
        const deleted = await Autoclave.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(200).send('Modelo removido com sucesso!');
        } else {
            res.status(404).send('Modelo não encontrado!');
        }
    } catch (error) {
        res.status(500).send('Erro ao excluir o modelo de autoclave.');
    }
}

module.exports = { getAutoclaveModels, getOneAutoclaveModel, createOneAutoclaveModel, updateOneAutoclaveModel, deleteOneAutoclaveModel };
