const autoclaveBrands = [
    { 'id': 1, 'brandName': 'Marca A' },
    { 'id': 2, 'brandName': 'Marca B' },
    { 'id': 3, 'brandName': 'Marca C' },
    { 'id': 4, 'brandName': 'Marca D' },
];

getAutoclaveBrands = (req, res) => {
    res.status(200).send(autoclaveBrands);
}

getOneAutoclaveBrand = (req, res) => {
    let id = req.params.id;
    const autoclaveBrand = autoclaveBrands.find((item) => item.id === Number(id));

    if (autoclaveBrand) {
        res.status(200).send(autoclaveBrand);
    } else {
        res.status(404).send('Marca não encontrada!')

    }
}

createOneAutoclaveBrand = (req, res) => {
    const autoclaveBrand = req.body;
    if (Object.keys(autoclaveBrand).length > 0) {
        autoclaveBrands.push(autoclaveBrand)
        res.status(201).send(autoclaveBrand)
    } else {
        res.status(406).send('Ops, não foi possível adicionar essa marca!')
    }

}

updateOneAutoclaveBrand = (req, res) => {
    let id = req.params.id;
    let index = findAutoclaveBrandIndex(id);
    autoclaveBrands[index] = req.body;
    res.status(201).send('Marca atualizada com sucesso!')

}

deleteOneAutoclaveBrand = (req, res) => {
    let id = req.params.id;
    let index = findAutoclaveBrandIndex(id);

    if (index === -1) {
        return res.status(404).send('Não foi possível excluir: ID não encontrado.');
    }

    autoclaveBrands.splice(index, 1);
    res.status(200).send('Marca removida com sucesso!')
}

findAutoclaveBrandIndex = (id) => {
    const index = autoclaveBrands.findIndex((item) => item.id === Number(id));
    return index
}


module.exports = { getAutoclaveBrands, getOneAutoclaveBrand, createOneAutoclaveBrand, updateOneAutoclaveBrand, deleteOneAutoclaveBrand };
