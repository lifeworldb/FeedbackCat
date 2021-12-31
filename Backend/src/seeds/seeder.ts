import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserCreateFields } from '../user/dto/user.inputs';
import { DeveloperResponse } from '../common/enums';

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  constructor(
    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  async seed() {
    await this.userSeeder()
      .then(() => {
        this.logger.debug('Successfully completed seeding users...');
        Promise.resolve();
      })
      .catch((error) => {
        this.logger.error('Failed seeding users...');
        Promise.reject(error);
      });
  }

  async userSeeder() {
    const userRoot: UserCreateFields = {
      userName: 'SerbySuperAdmin',
      firstName: 'Serby',
      lastName: 'Super Admin',
      email: 'admin@serby.com',
      password: 'serbyAdmin123',
      phoneNumber: '+579999999999'
    };
    return await this.userService.create(userRoot).then((res) => {
      if (res.developerCode === DeveloperResponse.USER_ALREADY_EXISTING) {
        this.logger.debug('I cannot create the root user, because it already exists.');
        return Promise.resolve();
      }
      if (res.developerCode === DeveloperResponse.SUCCESS_QUERY) {
        this.logger.debug('The root user has been created, successfully.');
        return Promise.resolve();
      }
      if (res.developerCode === DeveloperResponse.INTERNAL_ERROR) {
        return Promise.reject(res.message);
      }
    });
  }
}
