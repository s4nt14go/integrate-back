import { Context, APIGatewayProxyHandler, APIGatewayEvent } from "aws-lambda";
import { wrapper } from './lib';
import { SSM } from 'aws-sdk';
import civicSip from 'civic-sip-api';

const {
  serviceName,
  stage,
} = process.env;

const ssm = new SSM();

export const handler: APIGatewayProxyHandler = wrapper(async (event: APIGatewayEvent, _context: Context) => {

  console.log('event:', JSON.stringify(event, null, 2));

  const Names = [
    `/${serviceName}/${stage}/APP_ID`,
    `/${serviceName}/${stage}/PRV_KEY`,
    `/${serviceName}/${stage}/APP_SECRET`,
  ]
  const request = await ssm.getParameters({ Names }).promise();
  const APP_ID = request.Parameters.filter(p => p.Name === Names[0])[0].Value;
  const PRV_KEY = request.Parameters.filter(p => p.Name === Names[1])[0].Value;
  const APP_SECRET = request.Parameters.filter(p => p.Name === Names[2])[0].Value;

  // Initialize instance passing your appId and secret.
  const civicClient = civicSip.newClient({
    appId: APP_ID,
    prvKey: PRV_KEY,
    appSecret: APP_SECRET,
  });

  // Exchange authorization code for user data.
  const token = event.body;
  console.log('Will call exchangeCode with this token:', token);
  const res = await civicClient.exchangeCode(token);
  console.log('Response from Civic:', res);
  return res;
});
