exports.chargeMonitoring = (event, callback) => {
    const pubsubMessage = event.data;
    const dataStr = Buffer.from(pubsubMessage.data, 'base64').toString();
    const data = JSON.parse(dataStr);

    if (this.isCostOver(data.budgetAmount, data.costAmount)) {
        console.log('over amount');
    } else {
        console.log('not over amount');
    }
    callback();
}

exports.isCostOver = (budge, cost) => {
    return budge <= cost;
}