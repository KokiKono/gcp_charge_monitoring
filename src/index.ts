import {google, cloudbilling_v1} from 'googleapis';

export const chargeMonitoring = (data, context, callback) => {
    const dataStr = Buffer.from(data.data, 'base64').toString();
    const pubsubMessage = JSON.parse(dataStr);

    if (this.isCostOver(pubsubMessage.budgetAmount, pubsubMessage.costAmount)) {
        console.log('over amount');
    } else {
        console.log('not over amount');
    }
    callback();
}

export const isCostOver = (budge, cost) => {
    return budge <= cost;
}
export const isEnableBilling = async (projectName: string, projects: cloudbilling_v1.Resource$Projects) => {
    const info = await projects.getBillingInfo({name: projectName});
    return info.data.billingEnabled;
}

export const disableBilling = async (projectName: string, projects: cloudbilling_v1.Resource$Projects) => {
    await projects.updateBillingInfo({name: projectName, requestBody: {
        billingEnabled: false
    }});
    // check billing info
    const is_enableBilling = await this.isEnableBilling(projectName, projects);
    if (is_enableBilling === false) return true;
    return false;
}