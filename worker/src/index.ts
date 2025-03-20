import { PrismaClient } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import { Kafka } from 'kafkajs';
import { parse } from './parser';
const TOPIC_NAME = 'zap-events';
const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092'],
});
async function main() {
  const prismaClient = new PrismaClient();
  const producer = kafka.producer();
  await producer.connect();
  const consumer = kafka.consumer({ groupId: 'main-worker' });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
      if (!message.value?.toString()) {
        return;
      }
      const parsedValue = JSON.parse(message.value?.toString());
      const zapRunId = parsedValue.zapRunId;
      const stage = parsedValue.stage;

      const zapRunDetails = await prismaClient.zapRun.findFirst({
        where: {
          id: zapRunId,
        },
        include: {
          zap: {
            include: {
              actions: {
                include: {
                  type: true,
                },
              },
            },
          },
        },
      });
      // send a query to get back the zap id
      // send a query to get back the actions associated with zap id
      // find the available actions
      const currentAction = zapRunDetails?.zap.actions.find(
        (x) => x.sortingOrder === stage
      );
      console.log("currentActions->",currentAction);
      if (!currentAction) {
        console.log('Current Action does not found');
        return;
      }
      const zapRunMetadata = zapRunDetails?.metadata;
      
      if (currentAction.type.id === 'send-email') {

        const body = parse((currentAction.metadata as JsonObject)?.body as string,zapRunMetadata);//you just recieved {comment.amount}
        const to = parse((currentAction.metadata as JsonObject)?.email as string,zapRunMetadata);//{comment.email}
        //{comment:{email:"test",amount:100}}
        console.log(`Sending out email to ${to} body is ${body}`);


      }
      if (currentAction.type.id === 'send-sol') {
        console.log('Sending Solana');
        // parse out the amount and whom to send
        const amount = parse((currentAction.metadata as JsonObject)?.amount as string,zapRunMetadata);
        const address = parse((currentAction.metadata as JsonObject)?.address as string,zapRunMetadata);
        console.log(`Sending out SOL of amount ${amount} address is ${address}`);
      }
      // ideally you sendEmail here
      await new Promise((r) => setTimeout(r, 500));

      // const zapId = message.value?.toString();
      const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1;
      if (lastStage !== stage) {
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                zapRunId: zapRunId,
                stage: stage + 1
              }),
            },
          ],
        });
      }
      console.log('processing done!');
      //ack here
      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}
main();
