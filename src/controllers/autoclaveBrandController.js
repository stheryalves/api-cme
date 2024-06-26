const brands = [
    { 'id': 1, 'brandName': 'Marca A' },
    { 'id': 2, 'brandName': 'Marca B' },
    { 'id': 3, 'brandName': 'Marca C' },
    { 'id': 4, 'brandName': 'Marca D' },
];

getBrands = (req, res) => {
    res.status(200).send(brands);
}

getOneBrand = (req, res) => {
    let id = req.params.id;
    const brand = brands.find((item) => item.id === Number(id));

    if (brand) {
        res.status(200).send(brand);
    } else {
        res.status(404).send('Marca não encontrada!')

    }
}

createOneBrand = (req, res) => {
    const brand = req.body;
    if (Object.keys(brand).length > 0) {
        brands.push(brand)
        res.status(201).send(brand)
    } else {
        res.status(406).send('Ops, não foi possível adicionar essa marca!')
    }

}

updateOneBrand = (req, res) => {
    let id = req.params.id;
    let index = findBrandIndex(id);
    brands[index] = req.body;
    res.status(201).send('Marca atualizada com sucesso!')

}

deleteOneBrand = (req, res) => {
    let id = req.params.id;
    let index = findBrandIndex(id);

    if (index === -1) {
        return res.status(404).send('Não foi possível excluir: ID não encontrado.');
    }

    brands.splice(index, 1);
    res.status(200).send('Marca removida com sucesso!')
}

findBrandIndex = (id) => {
    const index = brands.findIndex((item) => item.id === Number(id));
    return index
}


module.exports = { getBrands, getOneBrand, createOneBrand, updateOneBrand, deleteOneBrand };
