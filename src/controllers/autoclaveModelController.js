const autoclaveModels = [
    {
        'id': 1,
        'autoclaveModelName': 'A1',
        'totalChamberVolumeLt': 102,
        'usefulChamberVolumeLt': 81,
        'averageTotalCycleTimeHTMin': 50,
        'loadingAndUnloadingTimeMin': 10,
        'cycleTimeMin': 60,
        'dailyTimeBDTestMin': 30,
        'dailyTimeWarmUpMin': 20,
        'price': 100
    },

];

getAutoclaveModels = (req, res) => {
    res.status(200).send(autoclaveModels);
}

getOneAutoclaveModel = (req, res) => {
    let id = req.params.id;
    const autoclaveModel = autoclaveModels.find((item) => item.id === Number(id));

    if (autoclaveModel) {
        res.status(200).send(autoclaveModel);
    } else {
        res.status(404).send('Modelo não encontrado!')

    }
}

createOneAutoclaveModel = (req, res) => {
    const autoclaveModel = req.body;
    if (Object.keys(autoclaveModel).length > 0) {
        autoclaveModels.push(autoclaveModel)
        res.status(201).send(autoclaveModel)
    } else {
        res.status(406).send('Ops, não foi possível adicionar esse modelo!')
    }

}

updateOneAutoclaveModel = (req, res) => {
    let id = req.params.id;
    let index = findAutoclaveModelIndex(id);
    autoclaveModels[index] = req.body;
    res.status(201).send('Modelo atualizado com sucesso!')

}

deleteOneAutoclaveModel = (req, res) => {
    let id = req.params.id;
    let index = findAutoclaveModelIndex(id);

    if (index === -1) {
        return res.status(404).send('Não foi possível excluir: ID não encontrado.');
    }

    autoclaveModels.splice(index, 1);
    res.status(200).send('Modelo removido com sucesso!')
}

findAutoclaveModelIndex = (id) => {
    const index = autoclaveModels.findIndex((item) => item.id === Number(id));
    return index
}


module.exports = { getAutoclaveModels, getOneAutoclaveModel, createOneAutoclaveModel, updateOneAutoclaveModel, deleteOneAutoclaveModel };
