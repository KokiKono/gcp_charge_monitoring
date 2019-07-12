import {google, cloudbilling_v1} from 'googleapis';

const PROJECT_ID = process.env.TARGET_PID;
const PROJECT_NAME = `projects/${PROJECT_ID}`;

const chargeMonitoring = (event, callback) => {
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

export const isCostOver = (budge, cost) => {
    return budge <= cost;
}
export const isEnableBilling = async (projectName: string, projects: cloudbilling_v1.Resource$Projects) => {
    const info = await projects.getBillingInfo({name: projectName});
    return info.data.billingEnabled;
}
export default chargeMonitoring;