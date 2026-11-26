const { callProcedure } = require('../../config/db');

module.exports = {
  get: () =>
    callProcedure('GetCompanyInfo', []),

  update: (id, data) =>
    callProcedure('UpdateCompanyInfo', [
      id, data.company_name, data.phone_no, data.email,
      data.address, data.land_phone, data.website
    ])
};
