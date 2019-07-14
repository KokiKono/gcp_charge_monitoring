import {google, cloudbilling_v1} from 'googleapis';

const P_NAME = process.env.P_NAME;
const PROJECT_NAME = `projects/${P_NAME}`;

export const chargeMonitoring = async (data, context, callback) => {
    const dataStr = Buffer.from(data.data, 'base64').toString();
    const pubsubMessage = JSON.parse(dataStr);

    if (this.isCostOver(pubsubMessage.budgetAmount, pubsubMessage.costAmount)) {
        console.log('over amount');
        const cloudbilling = google.cloudbilling('v1');
        const auth = await google.auth.getClient({
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        if (isEnableBilling(PROJECT_NAME, cloudbilling.projects, auth)) {
            const result = await disableBilling(PROJECT_NAME, cloudbilling.projects, auth);
            if (result) {
                console.log(`disable project: ${P_NAME}`);
            } else {
                console.log(`faild disable project: ${P_NAME}`);
            }
        }
    } else {
        console.log('not over amount');
    }
    callback();
}

export const isCostOver = (budge, cost) => {
    return budge <= cost;
}
export const isEnableBilling = async (projectName: string, projects: cloudbilling_v1.Resource$Projects, auth) => {
    const info = await projects.getBillingInfo({name: projectName, auth: auth});
    return info.data.billingEnabled;
}

export const disableBilling = async (projectName: string, projects: cloudbilling_v1.Resource$Projects, auth) => {
    await projects.updateBillingInfo({name: projectName, requestBody: {
        billingEnabled: false
    }, auth: auth});
    // check billing info
    const is_enableBilling = await this.isEnableBilling(projectName, projects, auth);
    if (is_enableBilling === false) return true;
    return false;
}