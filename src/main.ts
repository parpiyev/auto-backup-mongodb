import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
env();
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();

async function env() {
  if (fs.existsSync(`${__dirname}/../.env`)) {
    console.log('has vault file:', true);
    const envLoad = dotenv.config({ path: `${__dirname}/../.env` });
    if (envLoad.error) {
      throw envLoad.error;
    }
  } else {
    console.log(
      'has vault file:',
      false,
      fs.existsSync(`${__dirname}/../.env`),
    );
    const envLoad = dotenv.config();
    if (envLoad.error) {
      throw envLoad.error;
    }
  }
}
