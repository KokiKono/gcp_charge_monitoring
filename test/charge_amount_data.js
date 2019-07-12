const base_data = {
    budgetDisplayName: 'sample',
    alertThresholdExceeded: 1,
    costAmount: 2000,   // 発生した費用
    costIntervalStart: new Date(Date.now()).toISOString(),
    budgetAmount: 1000, // 予算
    budgetAmountType: '',
    currencyCode: ''
};

exports.over_data = base_data;
exports.not_over_data = base_data | {
    costAmount: 1000,
    budgetAmount: 2000,
};