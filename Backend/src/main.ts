import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { Logger as LoggerPino } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { AppModule } from './app.module';
import { Seeder } from './seeds/seeder';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter()
  );

  const config: ConfigService = app.get(ConfigService);
  const seeder = app.get(Seeder);

  await seeder
    .seed()
    .then(() => {
      Logger.debug('Seeding complete!');
    })
    .catch((error) => {
      Logger.error('Seeding failed!');
      throw error;
    });

  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        /\.mydomain\.com$/,
        'https://studio.apollographql.com',
        /\.vercel\.app$/
      ],
      credentials: true
    })
  );

  app.use(cookieParser());
  // if (config.get<string>('NODE_ENV') === 'production') app.use(csurf({ cookie: true }));
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  app.useLogger(app.get(LoggerPino));

  return app.listen(config.get<number>('PORT', 3000));
}
bootstrap();
