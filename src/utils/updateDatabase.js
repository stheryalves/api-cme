const Autoclave = require("../schemas/schemaAutoclave");
const AutoclaveBrand = require("../schemas/schemaAutoclaveBrand");
const Lead = require("../schemas/schemaLead");
const LeadCalcAutoclave = require("../schemas/schemaLeadCalcAutoclave");
const LeadCalcProject = require("../schemas/schemaLeadCalcProject");
const LeadCalcWasher = require("../schemas/schemaLeadCalcWasher");
const Washer = require("../schemas/schemaWasher");
const WasherBrand = require("../schemas/schemaWasherBrand");

const updateDatabase = async () => {
  await Lead.sync();
  await AutoclaveBrand.sync();
  await Autoclave.sync();
  await LeadCalcProject.sync();
  await LeadCalcAutoclave.sync();
  await LeadCalcWasher.sync();
  await WasherBrand.sync();
  await Washer.sync();
};

module.exports = updateDatabase;
