import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

@Injectable()
export class CronService {
  private readonly mongoUrl: string = process.env.MONGO_URL;
  private readonly database: string = process.env.DATABASE;
  private readonly baseBackupFolder: string = path.join(__dirname, '../../');

  constructor() {
    // Ensure the base backup folder exists
    this.ensureBaseBackupFolder();
  }

  private ensureBaseBackupFolder() {
    if (!fs.existsSync(this.baseBackupFolder)) {
      fs.mkdirSync(this.baseBackupFolder, { recursive: true });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'mongodb-backup' })
  async cronHandle() {
    console.log(1);

    // Generate the date-based folder structure
    const currentDate = moment();
    const year = currentDate.format('YYYY');
    const month = currentDate.format('MM');
    const day = currentDate.format('DD');

    // Construct the backup path
    const backupPath = path.join(this.baseBackupFolder, year, month, day);

    fs.mkdirSync(path.join(this.baseBackupFolder, year), { recursive: true });
    fs.mkdirSync(path.join(this.baseBackupFolder, year, month), {
      recursive: true,
    });
    fs.mkdirSync(path.join(this.baseBackupFolder, year, month, day), {
      recursive: true,
    });
    // Options for the backup process

    const command = `mongodump --uri "${this.mongoUrl}" --db ${this.database} --excludeCollection=recommendedproducts --excludeCollection=productviews --excludeCollection=appreportbygroups --excludeCollection=icps --excludeCollection=notifications --excludeCollection=notificationtokens --excludeCollection=ordernotes --excludeCollection=orderstatuses --excludeCollection=productstatuses --excludeCollection=reports --excludeCollection=resultnotifications --excludeCollection=shoplogs --excludeCollection=appmetrics --excludeCollection=loggers --excludeCollection=productrecommends --out ${this.baseBackupFolder}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.log('Mongodump completed successfully', this.baseBackupFolder);
      }
    });
  }
}
