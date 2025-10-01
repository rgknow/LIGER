import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup microservice for internal communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3015 },
  });
  
  await app.startAllMicroservices();
  
  // HTTP server for external API
  await app.listen(3016);
  console.log('Risk Service running on port 3016 (HTTP) and 3015 (TCP)');
}
bootstrap();