import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup microservice for internal communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3017 },
  });
  
  await app.startAllMicroservices();
  
  // HTTP server for external API
  await app.listen(3018);
  console.log('Notification Service running on port 3018 (HTTP) and 3017 (TCP)');
}
bootstrap();