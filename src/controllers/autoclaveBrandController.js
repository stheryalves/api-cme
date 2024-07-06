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
    try {
        const brand = req.body;
        const { nomeMarca } = brand;

        if (!nomeMarca) {
            return res.status(400).json({ message: 'Marca não fornecida.Por favor digite uma marca!' });
        }

        const existingBrand = await Brand.findOne({ where: { nomeMarca } });

        if (existingBrand) {
            return res.status(409).json({ message: 'A Marca já foi cadastrada.' });
        }

        if (Object.keys(brand).length > 0) {
            const newBrand = await Brand.create(brand);
            res.status(201).json(newBrand);
        } else {
            res.status(406).json({ message: 'Ops, não foi possível adicionar essa marca!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOneAutoclaveBrand = async (req, res) => {
    const id = req.params.id;
    const { nomeMarca } = req.body;

    if (!nomeMarca )  {
        return res.status(400).json({ message: 'Marca não fornecida.Por favor digite uma marca!' });
    }

    const existingBrand = await Brand.findOne({ where: { nomeMarca } });

    if (existingBrand) {
        return res.status(409).json({ message: 'Marca já cadastrada no banco de dados.' });
    }

    try {
        const updatedBrand = await Brand.findByPk(id);
        if (updatedBrand) {
            await updatedBrand.update({ nomeMarca });
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
