require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');

async function percentUtilization(id) {
  let connection;
  try {
    connection = await conn();
    //consulta leads
    const queryLead = `SELECT 
              numeroLeitoUTI,
              estimativaVolumeTotalDiárioMaterial,
              numCirurgiasDia
          FROM \`lead\` WHERE id = ?`;
    const [resultsLead] = await connection.query(queryLead, [id]);

    if (resultsLead.length === 0) {
      return null;
    }

    /*const numeroLeitoUTI = resultsLead[0].numeroLeitoUTI
    const estimativaVolumeTotalDiárioMaterial = resultsLead[0].estimativaVolumeTotalDiárioMaterial
    const numCirurgiasDia = resultsLead[0].numCirurgiasDia*/

    const { numeroLeitoUTI, estimativaVolumeTotalDiárioMaterial, numCirurgiasDia } = resultsLead[0];

    //consulta lavadoras
    const queryWashers = `SELECT * FROM \`lavadora\``;
    const [resultsWashers] = await connection.query(queryWashers);

    if (resultsWashers.length === 0) {
      return null;
    }

    let resultados = [];
    for (const washer of resultsWashers) {
      let {
        id,
        capacidadeCargaBandejasInstrumentos,
        capacidadeCargaTraqueias,
        tempMedCicloInstrumentosCargaMaxMin,
        tempMedCicloAssisVentCargaMaxMin,
        numBandejasPorUe,
        intervaloMedEntreCiclos,
        qtdTraqueiasCirurgia,
        qtdTraqueiasLeitoUtiDia,
        quantidadeTermosProjeto
      } = washer;

      //entra na tabela de lavadora
      let capacidadeProcessamUeCargaInstrumentos =
        capacidadeCargaBandejasInstrumentos /
        numBandejasPorUe // enviar para o banco lavadora 5,0 UE - OK

      

      //entra na tabela de lead
      let numCiclosInstrumentosDia =
        estimativaVolumeTotalDiárioMaterial /
        capacidadeProcessamUeCargaInstrumentos// enviar para o banco LEAD 26 - FAZER A MUDANÇA

      let tempProcessamDemandaInstrumentosMin = numCiclosInstrumentosDia *
        (tempMedCicloInstrumentosCargaMaxMin + intervaloMedEntreCiclos) // enviar para o banco LEAD 1826.3 - FAZER A MUDANÇA

      let qtdTraqueiasDia = numCirurgiasDia * qtdTraqueiasCirurgia // enviar para o banco LEAD 216 - FAZER A MUDANÇA
      let qtdTraqueiasUtiDia = numeroLeitoUTI * qtdTraqueiasLeitoUtiDia // enviar para o banco LEAD 90 - FAZER A MUDANÇA
      let qtdTotTraqueiasDia = qtdTraqueiasDia + qtdTraqueiasUtiDia // enviar para o banco LEAD 306 - FAZER A MUDANÇA
      let qtdCiclosAssistVentDia = qtdTotTraqueiasDia / capacidadeCargaTraqueias // enviar para o banco LEAD 17 - FAZER A MUDANÇA
      let demandaCiclosDia = qtdCiclosAssistVentDia + numCiclosInstrumentosDia // enviar para o banco LEAD 43 - FAZER A MUDANÇA
      let tempProcessamDemandaAssistVentMin = qtdCiclosAssistVentDia *
        (tempMedCicloAssisVentCargaMaxMin +
          intervaloMedEntreCiclos) // enviar para o banco LEAD 1190 - FAZER A MUDANÇA

      let demandaTempoDiaMin = tempProcessamDemandaInstrumentosMin +
        tempProcessamDemandaAssistVentMin // enviar para o banco LEAD 3016.3 - FAZER A MUDANÇA
      let minutosDisponiveisTodosEquipamDia = 60 * 24 * quantidadeTermosProjeto // enviar para o banco LEAD 2880 - FAZER A MUDANÇA
      let percentualUtilizacaoCapacidadeMax = Math.round(((demandaTempoDiaMin /
        minutosDisponiveisTodosEquipamDia) * 100) * 100) / 100 // enviar para o banco lead

      const updateQueryLead = `UPDATE \`lead\` SET 
        numCiclosInstrumentosDia = ?,
        tempProcessamDemandaInstrumentosMin = ?, 
        qtdTraqueiasDia = ?, 
        qtdTraqueiasUtiDia = ?,
        qtdTotTraqueiasDia = ?,
        qtdCiclosAssistVentDia = ?,
        demandaCiclosDia = ?,
        tempProcessamDemandaAssistVentMin = ?,
        demandaTempoDiaMin = ?,
        minutosDisponiveisTodosEquipamDia = ?,
        percentualUtilizacaoCapacidadeMax = ?
      WHERE id = ?`;

      await connection.query(updateQueryLead, [
        numCiclosInstrumentosDia,
        tempProcessamDemandaInstrumentosMin,
        qtdTraqueiasDia,
        qtdTraqueiasUtiDia,
        qtdTotTraqueiasDia,
        qtdCiclosAssistVentDia,
        demandaCiclosDia,
        tempProcessamDemandaAssistVentMin,
        demandaTempoDiaMin,
        minutosDisponiveisTodosEquipamDia,
        percentualUtilizacaoCapacidadeMax,
        id
      ]);

      const updateQueryWasher = `UPDATE \`lavadora\` SET 
        capacidadeProcessamUeCargaInstrumentos = ?
      WHERE id = ?`;

      await connection.query(updateQueryWasher, [
        capacidadeProcessamUeCargaInstrumentos,
        id
      ]);

      resultados.push({
        autoclaveId: washer.id,
        percentualUtilizacaoCapacidadeMax //deixar duas casas decimais 
      });
    }

    return resultados;
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