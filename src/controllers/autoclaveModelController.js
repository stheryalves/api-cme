const Autoclave = require('../schemas/schemaAutoclave');

const getAutoclaveModels = async (req, res) => {
    try {
        const autoclaveModels = await Autoclave.findAll();
        res.status(200).send(autoclaveModels);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
}

const createOneAutoclaveModel = async (req, res) => {
    const {
        marcaAutoclave,
        modeloAutoclave,
        volumeTotCamaraLt,
        volumeUtilCamaraLt,
        medTotTempoCicloATMin,
        tempoCargaDescargaMin,
        tempoClicloCarDescMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        tempoDisponivelDiarioMin,
        producaoHospitalVolDiarioMaterialLt,
        volumeProcessadoIntervaloPicoLt90totDiario,
        intervaloDiarioPicoMin,
        numMaxCiclosDia,
        numMaxCiclosIntervaloPico,
        aproveitamentoCamaraPorcent,
        numAutoclaves,
        numAutoclavesUmaEmManutencao,
        capProcessamIntervaloPicoTodasAutoclavesOnLt,
        horasTrabalhoAtenderVolTotalHr,
        capUtilizTodasAutoclavesIntervaloPicoPorcent,
        preco
    } = req.body;

    if (!modeloAutoclave) {
        return res.status(400).json({ message: 'Modelo da autoclave não fornecido.' });
    }

    const existingModel = await Autoclave.findOne({ where: { modeloAutoclave } });

    if (existingModel) {
        return res.status(409).json({ message: 'O Modelo já foi cadastrado.' });
    }

    try {
        const newAutoclaveModel = await Autoclave.create({
            marcaAutoclave,
            modeloAutoclave,
            volumeTotCamaraLt,
            volumeUtilCamaraLt,
            medTotTempoCicloATMin,
            tempoCargaDescargaMin,
            tempoClicloCarDescMin,
            tempoTestDiarioBDMin,
            tempoDiarioAquecimentoMaqMin,
            tempoDisponivelDiarioMin,
            producaoHospitalVolDiarioMaterialLt,
            volumeProcessadoIntervaloPicoLt90totDiario,
            intervaloDiarioPicoMin,
            numMaxCiclosDia,
            numMaxCiclosIntervaloPico,
            aproveitamentoCamaraPorcent,
            numAutoclaves,
            numAutoclavesUmaEmManutencao,
            capProcessamIntervaloPicoTodasAutoclavesOnLt,
            horasTrabalhoAtenderVolTotalHr,
            capUtilizTodasAutoclavesIntervaloPicoPorcent,
            preco
        });
        res.status(201).send(newAutoclaveModel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOneAutoclaveModel = async (req, res) => {
    const id = req.params.id;
    const { modeloAutoclave } = req.body;

    try {
        if (!modeloAutoclave) {
            return res.status(400).json({ message: 'Modelo da autoclave não fornecido.' });
        }

        const existingModel = await Autoclave.findOne({ where: { modeloAutoclave } });

        if (existingModel && existingModel.id !== parseInt(id)) {
            return res.status(409).json({ message: 'Modelo já cadastrado no banco de dados.' });
        }

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
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAutoclaveModels, getOneAutoclaveModel, createOneAutoclaveModel, updateOneAutoclaveModel, deleteOneAutoclaveModel };
