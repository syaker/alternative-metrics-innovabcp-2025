import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './config/http-exception.interceptor';
import { ResponseInterceptor } from './config/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Alternative Metrics API')
    .setDescription(
      'Service to calculate data from different alternative sources and analyze it to provide more access to women to bank credits',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.APP_PORT!);

  console.log(`Application is running at port ${process.env.APP_PORT!}`);
}

bootstrap();
