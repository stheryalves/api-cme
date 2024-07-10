require('dotenv').config();
const conn = require('./database/conn');

async function calculoVolumeTotalDiarioPorLead() {
    let connection;
    try {
        connection = await conn(); // Obtém a conexão com o banco de dados
        const query = `SELECT 
        numeroSalasCirurgias, 
        numeroCirurgiaSalaDia, 
        numeroLeitoUTI, 
        numeroLeitoInternacao, 
        numeroLeitoRPA,
        numeroLeitoObs,
        numeroLeitoHospitalDia
        FROM \`lead\` WHERE id = 1`;
        const [results] = await connection.query(query, [1]); // Substitua '1' pelo ID desejado

        const UE = 54
        const volumePorCirurgia = 1.5
        const volumePorLeitoUtiDiario = 0.5
        const volumePorLeitoInternaçãoDiario = 0.05

        const calculos = results.map(row => {

            const numeroSalasCirurgias = row.numeroSalasCirurgias;
            const numeroCirurgiaSalaDia = row.numeroCirurgiaSalaDia;
            const numeroLeitoUTI = row.numeroLeitoUTI;
            const numeroLeitoInternacao = row.numeroLeitoInternacao;
            const numeroLeitoRPA = row.numeroLeitoRPA;
            const numeroLeitoObs = row.numeroLeitoObs;
            const numeroLeitoHospitalDia = row.numeroLeitoHospitalDia;
            const numCirurgiasDia = numeroSalasCirurgias * numeroCirurgiaSalaDia;

            numLeitosTotais = numeroLeitoUTI + numeroLeitoInternacao + numeroLeitoRPA + numeroLeitoObs + numeroLeitoHospitalDia
            volumeTotalDiárioCirurgias = numCirurgiasDia * volumePorCirurgia
            volumeTotalDiárioUTIs = numeroLeitoUTI * volumePorLeitoUtiDiario
            volumeTotalDiárioInternação = (numLeitosTotais - numeroLeitoUTI) * volumePorLeitoInternaçãoDiario
            estimativaVolumeTotalDiarioInstrumentalUE = volumeTotalDiárioInternação + volumeTotalDiárioUTIs + volumeTotalDiárioCirurgias
            estimativaVolumeTotalDiarioInstrumentalLt = estimativaVolumeTotalDiarioInstrumentalUE * UE //todo uma casa decimal 

            //todo se processa tecido

            // if (tipoProcessamento)
            // estimativaVolumeTotalDiarioTecidoUE = estimativaVolumeTotalDiarioPorMaterialUE * 2
            // estimativaVolumeTotalDiarioTecidoLt = (estimativaVolumeTotalDiarioPorMaterialUE * UE) * 2

            return { estimativaVolumeTotalDiarioInstrumentalUE, estimativaVolumeTotalDiarioInstrumentalLt };


        });

        return calculos;

    } catch (err) {
        console.error('Erro ao executar a consulta:', err);
        throw err;
    } finally {
        if (connection) {
            await connection.end(); // Fecha a conexão com o banco de dados
        }
    }
}

module.exports = { calculoVolumeTotalDiarioPorLead };

async function main() {
    try {
        const resultado = await calculoVolumeTotalDiarioPorLead();
        console.log('Resultado:', resultado);
        console.log('Número leitos totais:', numLeitosTotais);
        console.log('Volume Total Diário - Cirurgias:', volumeTotalDiárioCirurgias);
        console.log('Volume Total Diário - UTIs:', volumeTotalDiárioUTIs);
        console.log('Volume Total Diário - Internação:', volumeTotalDiárioInternação); //todo uma casa decimal 
    } catch (err) {
        console.error('Erro ao calcular o volume total diário por lead:', err);
    }
}

main();





