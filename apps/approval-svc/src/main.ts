import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup microservice for internal communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3013 },
  });
  
  await app.startAllMicroservices();
  
  // HTTP server for external API
  await app.listen(3014);
  console.log('Approval Service running on port 3014 (HTTP) and 3013 (TCP)');
}
bootstrap();