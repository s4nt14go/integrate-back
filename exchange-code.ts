import { Context, APIGatewayProxyHandler, APIGatewayEvent } from "aws-lambda";
import { wrapper } from './lib';
import civicSip from 'civic-sip-api';

const {
  APP_ID,
  PRV_KEY,
  APP_SECRET,
} = process.env;

// Initialize instance passing your appId and secret.
const civicClient = civicSip.newClient({
  appId: APP_ID,
  prvKey: PRV_KEY,
  appSecret: APP_SECRET,
});

export const handler: APIGatewayProxyHandler = wrapper(async (event: APIGatewayEvent, _context: Context) => {

  console.log('event:', JSON.stringify(event, null, 2));

  // Exchange authorization code for user data.
  const token = event.body;
  console.log('Will call exchangeCode with this token:', token);
  const res = await civicClient.exchangeCode(token);
  console.log('Response from Civic:', res);
  return res;
});
