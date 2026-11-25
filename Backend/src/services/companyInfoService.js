const CompanyInfo = require('../models/CompanyInfo');

const getCompanyInfo = async () => {
  const rows = await CompanyInfo.get();
  return rows[0] || null;
};

const updateCompanyInfo = async (data) => {
  const info = await getCompanyInfo();
  if (!info) return null;
  const result = await CompanyInfo.update(info.id, data);
  return result[0]?.affected > 0 ? getCompanyInfo() : null;
};

module.exports = { getCompanyInfo, updateCompanyInfo };
