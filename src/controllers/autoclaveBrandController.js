const Brand = require('../schemas/schemaBrand');

const getAutoclaveBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOneAutoclaveBrand = async (req, res) => {
    const id = req.params.id;
    try {
        const brand = await Brand.findByPk(id);
        if (brand) {
            res.status(200).json(brand);
        } else {
            res.status(404).send('Marca não encontrada!');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createOneAutoclaveBrand = async (req, res) => {
    const { brandName } = req.body;
    try {
        const newBrand = await Brand.create({ brandName });
        res.status(201).json(newBrand);
    } catch (error) {
        if (error.parent && error.parent.sqlState) {
            const brandNotUnique = error.parent.sqlState
            if (brandNotUnique) {
                return res.status(409).json({ message: 'O marca já existe' })
            }
        }
    }
}

const updateOneAutoclaveBrand = async (req, res) => {
    const id = req.params.id;
    const { brandName } = req.body;
    try {
        const updatedBrand = await Brand.findByPk(id);
        if (updatedBrand) {
            await updatedBrand.update({ brandName });
            res.status(200).send('Marca atualizada com sucesso!');
        } else {
            res.status(404).send('Marca não encontrada!');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteOneAutoclaveBrand = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedBrand = await Brand.findByPk(id);
        if (deletedBrand) {
            await deletedBrand.destroy();
            res.status(200).send('Marca removida com sucesso!');
        } else {
            res.status(404).send('Não foi possível excluir: ID não encontrado.');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAutoclaveBrands,
    getOneAutoclaveBrand,
    createOneAutoclaveBrand,
    updateOneAutoclaveBrand,
    deleteOneAutoclaveBrand
};
