import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

import { awsSNSConfig } from './awsCommon';

export const snsClient = new SNSClient(awsSNSConfig);

export const pushMessage = async (
  topic: string,
  uuid: string,
  body: string
) => {
  const params = {
    Message: body,
    Subject: uuid,
    TopicArn: topic,
  };

  const response = { result: '' };
  try {
    await snsClient.send(new PublishCommand(params));
    response.result = 'Success';
  } catch (e) {
    response.result = `Error ${e.stack}`;
  }
  return Promise.resolve(response);
};
