/* eslint-disable prettier/prettier */
const validateEmail = email => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const getPresentDayFormatted = () => {
    const d = new Date();
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
};

const getTransactionCategory = (categoryID, amount) => {
    const categoryIDNum = parseInt(categoryID);
    if (categoryIDNum <= 10009000 || categoryIDNum === 16000000 || (categoryIDNum >= 18020010 && categoryIDNum <= 18020013) || (categoryIDNum === 21011000 || (categoryIDNum >= 21012000 && categoryIDNum <= 21013000) && amount <= 0)) {
        return 'Bank Fees';
    }
    if (categoryIDNum ===  12004000 || (categoryIDNum >= 12009000 && categoryIDNum <= 12010000) || (categoryIDNum >= 12012000 && categoryIDNum <= 12012002) || categoryIDNum === 12014000) {
        return 'Legal Fees';
    }
    if ((categoryIDNum >= 12000000 && categoryIDNum <= 12002001) || (categoryIDNum >= 12015002 && categoryIDNum <= 12015003) || (categoryIDNum >= 12018000 && categoryIDNum <= 12018004)) {
        return 'Charitable Giving';
    }
    if ((categoryIDNum >= 12002000 && categoryIDNum <= 12002003) || categoryIDNum === 12006000 || categoryIDNum === 12007000 || (categoryIDNum >= 14000000 && categoryIDNum <= 14002020) || categoryIDNum === 18069000 || categoryIDNum === 19029000) {
        return 'Medical';
    }
    if (categoryIDNum === 21004000) {
        return 'Check';
    }
    if (categoryIDNum === 12005000 || (categoryIDNum >= 12008000 && categoryIDNum <= 12008011) || categoryIDNum === 12012003) {
        return 'Education';
    }
    if (categoryIDNum >= 12015000 && categoryIDNum <= 12015001) {
        return 'Membership Fee';
    }
    if (categoryIDNum === 12013000 || categoryIDNum === 12017000 || categoryIDNum === 12019000 || categoryIDNum === 12019001 || (categoryIDNum >= 18000000 && categoryIDNum <= 18005000) || (categoryIDNum >= 18007000 && categoryIDNum <= 18008001) || (categoryIDNum >= 18010000 && categoryIDNum <= 18011000) || (categoryIDNum >= 18014000 && categoryIDNum <= 18017000) || categoryIDNum === 18019000 || categoryIDNum === 18020000 || categoryIDNum === 18020001 || categoryIDNum === 18020003 || (categoryIDNum >= 18020005 && categoryIDNum <= 18020009) || (categoryIDNum >= 18020014 && categoryIDNum <= 18023000) || (categoryIDNum >= 18025000 && categoryIDNum <= 18029000) || categoryIDNum === 18047000 || (categoryIDNum >= 18051000 && categoryIDNum <= 18057000) || categoryIDNum === 18059000 || categoryIDNum === 18060000 || categoryIDNum === 18062000 || categoryIDNum === 18064000 || categoryIDNum === 18065000 || categoryIDNum === 18067000 || categoryIDNum === 18071000 || (categoryIDNum >= 18072000 && categoryIDNum <= 18074000)) {
        return 'Service';
    }
    if ((categoryIDNum >= 18068000 && categoryIDNum <= 18068005) || categoryIDNum === 18070000) {
        return 'Utilities';
    }
    if (categoryIDNum === 12016000 || categoryIDNum === 18058000) {
        return 'Postage/Shipping';
    }
    if ((categoryIDNum >= 13000000 && categoryIDNum <= 13002000) || (categoryIDNum >= 13005000 && categoryIDNum <= 13005059)) {
        return 'Restaurant';
    }
    if ((categoryIDNum >= 13003000 && categoryIDNum <= 13004006) || (categoryIDNum >= 17000000 && categoryIDNum <= 17048000) || (categoryIDNum >= 18018000 && categoryIDNum <= 18018001) || categoryIDNum === 19036000 || categoryIDNum === 19037000 || categoryIDNum === 19038000 || (categoryIDNum >= 19048000 && categoryIDNum <= 19049000)) {
        return 'Entertainment';
    }
    if (categoryIDNum === 15002000 || categoryIDNum === 16001000 || categoryIDNum === 16003000 || (categoryIDNum === 15000000 || categoryIDNum === 18020002 && amount <= 0)) {
        return 'Loan';
    }
    if (categoryIDNum === 16002000) {
        return 'Rent';
    }
    if ((categoryIDNum >= 18013000 && categoryIDNum <= 18013010) || categoryIDNum === 18024000) {
        return 'Home Maintenance/Improvement';
    }
    if ((categoryIDNum >= 18006000 && categoryIDNum <= 18006009) || (categoryIDNum >= 19005000 && categoryIDNum <= 19005007)) {
        return 'Automotive';
    }
    if (categoryIDNum === 18009000 || (categoryIDNum >= 18012000 && categoryIDNum <= 18012002) || categoryIDNum === 18031000 || categoryIDNum === 18063000 || (categoryIDNum >= 19013000 && categoryIDNum <= 19013003) || categoryIDNum === 19019000 || categoryIDNum === 19021000) {
        return 'Electronic';
    }
    if (categoryIDNum === 18030000) {
        return 'Insurance';
    }
    if (categoryIDNum === 18032000 || (categoryIDNum >= 18034000 && categoryIDNum <= 18044000) || categoryIDNum === 18048000 || categoryIDNum === 19032000) {
        return 'Business Expenditure';
    }
    if (categoryIDNum >= 18050000 && categoryIDNum <= 18050010) {
        return 'Real Estate';
    }
    if ((categoryIDNum >= 18045000 && categoryIDNum <= 18045010) || categoryIDNum === 19006000) {
        return 'Personal Care';
    }
    if (categoryIDNum === 18046000 || categoryIDNum === 19026000) {
        return 'Gas';
    }
    if (categoryIDNum === 18061000) {
        return 'Subscription';
    }
    if (categoryIDNum === 18066000 || (categoryIDNum >= 22000000 && categoryIDNum <= 22018000)) {
        return 'Travel';
    }
    if ((categoryIDNum >= 19000000 && categoryIDNum <= 19004000) || (categoryIDNum >= 19007000 && categoryIDNum <= 19011000) || (categoryIDNum >= 19014000 && categoryIDNum <= 19018000) || categoryIDNum === 19020000 || (categoryIDNum >= 19022000 && categoryIDNum <= 19024000) || categoryIDNum === 19028000 || (categoryIDNum >= 19030000 && categoryIDNum <= 19031000) || (categoryIDNum >= 19033000 && categoryIDNum <= 19035000) || categoryIDNum === 19039000 || (categoryIDNum >= 19040007 && categoryIDNum <= 19046000) || (categoryIDNum >= 19050000 && categoryIDNum <= 19054000)) {
        return 'Shopping';
    }
    if ((categoryIDNum >= 19012000 && categoryIDNum <= 19012008) || (categoryIDNum >= 19040000 && categoryIDNum <= 19040006)) {
        return 'Clothing';
    }
    if ((categoryIDNum >= 19025000 && categoryIDNum <= 19025004) || categoryIDNum === 19047000) {
        return 'Groceries';
    }
    if (categoryIDNum === 20002000 || (categoryIDNum === 20000000 && amount <= 0)) {
        return 'Tax';
    }
    if (categoryIDNum === 12011000 || (categoryIDNum === 18020002 && amount > 0)) {
        return 'Subsidy';
    }
    if (categoryIDNum === 15001000 || (categoryIDNum === 15000000 && amount > 0)) {
        return 'Interest';
    }
    if ((categoryIDNum >= 21007000 && categoryIDNum <= 21007002) || (categoryIDNum >= 21010000 && categoryIDNum <= 21010011) || (categoryIDNum === 20000000 || categoryIDNum === 21011000 && categoryIDNum > 0) || ((categoryIDNum >= 21012000 && categoryIDNum <= 21013000) && amount > 0)) {
        return 'Deposit';
    }
    if (categoryIDNum === 21009000 || categoryIDNum === 21009001) {
        return 'Payroll/Salary';
    }
    if (categoryIDNum === 11000000 || categoryIDNum === 18020004 || (categoryIDNum >= 21000000 && categoryIDNum <= 21003000) || (categoryIDNum >= 21005000 && categoryIDNum <= 21006000) || categoryIDNum === 21008000) {
        return 'Transfer';
    }
    console.log('uncaught category');
    return '';
};

const getTransactionType = (categoryID, amount) => {
    const categoryIDNum = parseInt(categoryID);
    if (categoryIDNum === 12011000 || categoryIDNum === 15001000 || (categoryIDNum >= 21007000 && categoryIDNum <= 21007002) || (categoryIDNum >= 21010000 && categoryIDNum <= 21010011) || categoryIDNum === 21009000 || categoryIDNum === 21009001 || (categoryIDNum === 15000000 || categoryIDNum === 18020002 || categoryIDNum === 20000000 || categoryIDNum === 21011000 || (categoryIDNum >= 21012000 && categoryIDNum <= 21013000) && amount > 0)) {
        return 'income';
    }
    if (categoryIDNum === 11000000 || categoryIDNum === 18020004 || (categoryIDNum >= 21000000 && categoryIDNum <= 21003000) || (categoryIDNum >= 21005000 && categoryIDNum <= 21006000) || categoryIDNum === 21008000) {
        return 'other';
    }
    return 'expense';
};

module.exports = {
    validateEmail,
    getPresentDayFormatted,
    getTransactionCategory,
    getTransactionType,
};
