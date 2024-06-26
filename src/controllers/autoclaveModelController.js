const brands = [
    { 'id': 1, 'autoclaveModelName': 'A1', 'totalChamberVolumeLt': 102, 'usefulChamberVolumeLt': 81, 'averageTotalCycleTimeHTMin': 50, 'loadingAndUnloadingTimeMin': 10, 'cycleTimeMin': 60, 'dailyTimeBDTestMin': 30, 'dailyTimeWarmUpMin': 20, },

];

getAutoclaveModels = (req, res) => {
    res.status(200).send(brands);
}

getOneAutoclaveModel = (req, res) => {
    let id = req.params.id;
    const brand = brands.find((item) => item.id === Number(id));

    if (brand) {
        res.status(200).send(brand);
    } else {
        res.status(404).send('Modelo não encontrado!')

    }
}

createOneAutoclaveModel = (req, res) => {
    const brand = req.body;
    if (Object.keys(brand).length > 0) {
        brands.push(brand)
        res.status(201).send(brand)
    } else {
        res.status(406).send('Ops, não foi possível adicionar esse modelo!')
    }

}

updateOneAutoclaveModel = (req, res) => {
    let id = req.params.id;
    let index = findBrandIndex(id);
    brands[index] = req.body;
    res.status(201).send('Modelo atualizado com sucesso!')

}

deleteOneAutoclaveModel = (req, res) => {
    let id = req.params.id;
    let index = findBrandIndex(id);

    if (index === -1) {
        return res.status(404).send('Não foi possível excluir: ID não encontrado.');
    }

    brands.splice(index, 1);
    res.status(200).send('Modelo removido com sucesso!')
}

findAutoclaveModelIndex = (id) => {
    const index = brands.findIndex((item) => item.id === Number(id));
    return index
}


module.exports = { getAutoclaveModels, getOneAutoclaveModel, createOneAutoclaveModel, updateOneAutoclaveModel, deleteOneAutoclaveModel };
