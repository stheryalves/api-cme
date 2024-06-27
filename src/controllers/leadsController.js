const leads = [

];

getLeads = (req, res) => {
    res.status(200).send(leads);
}

getOneLead = (req, res) => {
    let id = req.params.id;
    const lead = leads.find((item) => item.id === Number(id));

    if (lead) {
        res.status(200).send(lead);
    } else {
        res.status(404).send('Cliente não encontrado!')

    }
}

createOneLead = (req, res) => {
    const lead = req.body;
    if (Object.keys(lead).length > 0) {
        leads.push(lead)
        res.status(201).send(lead)
    } else {
        res.status(406).send('Ops, não foi possível adicionar esse cliente!')
    }

}

updateOneLead = (req, res) => {
    let id = req.params.id;
    let index = findLeadIndex(id);
    leads[index] = req.body;
    res.status(201).send('Informações do cliente atualizadas com sucesso!')

}

deleteOneLead = (req, res) => {
    let id = req.params.id;
    let index = findLeadIndex(id);

    if (index === -1) {
        return res.status(404).send('Não foi possível excluir: ID não encontrado.');
    }

    leads.splice(index, 1);
    res.status(200).send('Cliente removido com sucesso!')
}

findLeadIndex = (id) => {
    const index = leads.findIndex((item) => item.id === Number(id));
    return index
}


module.exports = { getLeads, getOneLead, createOneLead, updateOneLead, deleteOneLead };
