const amqp = require('amqplib');

let connection;
let channel;

const connectQueue = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('notifications', { durable: true });
};

const getChannel = () => channel;

module.exports = { connectQueue, getChannel };
