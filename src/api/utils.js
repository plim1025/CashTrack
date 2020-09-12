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

const getTransactionCategory = categories => {
    const firstCategory = categories[0];
    const secondCategory = categories[1];
    const thirdCategory = categories[2];
    if (
        firstCategory === 'Community' ||
        firstCategory === 'Payment' ||
        firstCategory === 'Service' ||
        firstCategory === 'Shops' ||
        firstCategory === 'Transfer'
    ) {
        if (secondCategory) {
            if (
                (secondCategory === 'Financial' || secondCategory === 'Third Party') &&
                thirdCategory
            ) {
                return thirdCategory;
            }
            return secondCategory;
        }
    }
    return firstCategory;
};

const getTransactionType = categoryID => {
    const categoryIDNum = parseInt(categoryID);
    if (
        (categoryIDNum >= 10000000 && categoryIDNum < 15000000) ||
        categoryIDNum === 15002000 ||
        (categoryIDNum >= 16000000 && categoryIDNum < 18020004) ||
        (categoryIDNum >= 18020005 && categoryIDNum < 20001000) ||
        categoryIDNum === 20002000 ||
        categoryIDNum === 21003000 ||
        (categoryIDNum >= 22000000 && categoryIDNum <= 22018000)
    ) {
        return 'expense';
    }
    if (
        categoryIDNum === 15001000 ||
        categoryIDNum === 20001000 ||
        categoryIDNum === 21007001 ||
        categoryIDNum === 21007002 ||
        categoryIDNum === 21009000 ||
        categoryIDNum === 21009001
    ) {
        return 'income';
    }
    return 'other';
};

module.exports = {
    validateEmail,
    getPresentDayFormatted,
    getTransactionCategory,
    getTransactionType,
};
