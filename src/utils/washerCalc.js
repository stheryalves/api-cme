require("dotenv").config();
const conn = require("../database/conn");
const { calculoVolumeTotalDiarioPorLead, getAllLeadIds } = require('./calculadora');

async function percentUtilization(id) {
  let connection;
  try {
    connection = await conn();
    //consulta leads
    const queryLead = `SELECT 
              numeroLeitoUTI
          FROM \`lead\` WHERE id = ?`;
    const [resultsLead] = await connection.query(queryLead, [id]);

    if (resultsLead.length === 0) {
      return null;
    }

    const numeroLeitoUTI = resultsLead[0].numeroLeitoUTI

    //consulta lavadoras
    const queryWasher = `SELECT 
              capacidadeCargaBandejasInstrumentos,
              capacidadeCargaTraqueias,
              tempMedCicloInstrumentosCargaMaxMin,
              tempMedCicloAssisVentCargaMaxMin,
              numBandejasPorUe,
              intervaloMedEntreCiclos,
              qtdTraqueiasCirurgia,
              qtdTraqueiasLeitoUtiDia,
              quantidadeTermosProjeto
          FROM \`lavadora\` WHERE id = ?`;
    const [resultsWasher] = await connection.query(queryWasher, [id]);

    if (resultsWasher.length === 0) {
      return null;
    }

    let {
      capacidadeCargaBandejasInstrumentos,
      capacidadeCargaTraqueias,
      tempMedCicloInstrumentosCargaMaxMin,
      tempMedCicloAssisVentCargaMaxMin,
      numBandejasPorUe,
      intervaloMedEntreCiclos,
      qtdTraqueiasCirurgia,
      qtdTraqueiasLeitoUtiDia,
      quantidadeTermosProjeto
    } = resultsWasher[0];

    /*console.log(`tempoCargaDescargaMin: ${tempoCargaDescargaMin}`);
    console.log(`medTotTempoCicloATMin: ${medTotTempoCicloATMin}`);
    console.log(`tempoTestDiarioBDMin: ${tempoTestDiarioBDMin}`);
    console.log(`tempoDiarioAquecimentoMaqMin: ${tempoDiarioAquecimentoMaqMin}`);
    console.log(`numAutoclaves: ${numAutoclaves}`);
    console.log(`volumeUtilCamaraLt: ${volumeUtilCamaraLt}`);*/


    //calculos
    let capacidadeProcessamUeCargaInstrumentos =
      capacidadeCargaBandejasInstrumentos /
      numBandejasPorUe

    let estimativaVolumeTotalDiarioInstrumentalUE = await calculoVolumeTotalDiarioPorLead(id);
    if (estimativaVolumeTotalDiarioInstrumentalUE === null) {
      return null;
    }

    let numCiclosInstrumentosDia =
      estimativaVolumeTotalDiarioInstrumentalUE / //vem da calculadora
      capacidadeProcessamUeCargaInstrumentos

    let tempProcessamDemandaInstrumentosMin = numCiclosInstrumentosDia *
      (tempMedCicloInstrumentosCargaMaxMin + intervaloMedEntreCiclos)

    console.log(`numCiclosInstrumentosDia: ${numCiclosInstrumentosDia}`); // certo 26
    //console.log(`tempMedCicloInstrumentosCargaMaxMin: ${tempMedCicloInstrumentosCargaMaxMin}`);
    //console.log(`intervaloMedEntreCiclos: ${intervaloMedEntreCiclos}`);

    let numCirurgiasDia = await calculoVolumeTotalDiarioPorLead(id);
    if (numCirurgiasDia === null) {
      return null;
    }

    let qtdTraqueiasDia = numCirurgiasDia * qtdTraqueiasCirurgia // numCirurgiasDia vem da calculadora 216
    let qtdTraqueiasUtiDia = numeroLeitoUTI * qtdTraqueiasLeitoUtiDia
    let qtdTotTraqueiasDia = qtdTraqueiasDia + qtdTraqueiasUtiDia
    let qtdCiclosAssistVentDia = qtdTotTraqueiasDia / capacidadeCargaTraqueias
    let tempProcessamDemandaAssistVentMin = qtdCiclosAssistVentDia *
      (tempMedCicloAssisVentCargaMaxMin +
        intervaloMedEntreCiclos)

    //let demandaCiclosDia = qtdCiclosAssistVentDia + numCiclosInstrumentosDia

    let demandaTempoDiaMin = tempProcessamDemandaInstrumentosMin +
      tempProcessamDemandaAssistVentMin
    let minutosDisponiveisTodosEquipamDia = 60 * 24 * quantidadeTermosProjeto
    let percentualUtilizacaoCapacidadeMax = demandaTempoDiaMin /
      minutosDisponiveisTodosEquipamDia

    console.log(`demandaTempoDiaMin: ${demandaTempoDiaMin}`);
    console.log(`tempProcessamDemandaInstrumentosMin: ${tempProcessamDemandaInstrumentosMin}`);
    console.log(`numCirurgiasDia: ${numCirurgiasDia}`);
    //console.log(`minutosDisponiveisTodosEquipamDia: ${minutosDisponiveisTodosEquipamDia}`);
    //console.log(`quantidadeTermosProjeto: ${quantidadeTermosProjeto}`);       
    //console.log(`tempProcessamDemandaAssistVentMin: ${tempProcessamDemandaAssistVentMin}`); 
    //console.log(`qtdCiclosAssistVentDia: ${qtdCiclosAssistVentDia}`); 
    //console.log(`tempMedCicloAssisVentCargaMaxMin: ${tempMedCicloAssisVentCargaMaxMin}`); 
    //console.log(`intervaloMedEntreCiclos: ${intervaloMedEntreCiclos}`);
    //console.log(`qtdTotTraqueiasDia: ${qtdTotTraqueiasDia}`);
    //console.log(`capacidadeCargaTraqueias: ${capacidadeCargaTraqueias}`);
    //console.log(`qtdTraqueiasDia: ${qtdTraqueiasDia}`); 
    //console.log(`qtdTraqueiasUtiDia: ${qtdTraqueiasUtiDia}`);
    //console.log(`qtdTraqueiasLeitoUtiDia: ${qtdTraqueiasLeitoUtiDia}`);
    //console.log(`numeroLeitoUTI: ${numeroLeitoUTI}`);


    return { percentualUtilizacaoCapacidadeMax }
  } catch (err) {
    console.error("Erro ao executar a consulta:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/*async function recomendaçõesPorLead() {

  if (percentUtilization < 90 && horasTrabalhoAtenderVolTotal < 20) {
    console.log('As marcas recomendadas são', )
  } else {
    //instrução aqui  
  }

}*/


async function visualizarResultados() {
  try {
    const ids = await getAllLeadIds();
    const resultados = [];

    for (const id of ids) {
      const resultadoPercent = await percentUtilization(id);
      resultados.push(resultadoPercent);
    }
    console.log("Resultados:", resultados);
  } catch (err) {
    console.error("Erro ao calcular o volume total diário por lead:", err);
  }
}

visualizarResultados();


module.exports = {
  percentUtilization
};