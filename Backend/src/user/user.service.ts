import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { genSalt, hash } from 'bcrypt';
import moment from 'moment';
import { isEqual } from 'lodash';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

import { IUserService } from './dto/user.interface';
import { Response } from '../common/interfaces/response.interface';
import { AllArgs } from '../common/args/general.args';
import { User } from './models/user.model';
import { UserCreateFields } from './dto/user.inputs';
import { DeveloperResponse } from '../common/enums';

@Injectable()
export class UserService implements IUserService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel(User)
    private readonly model: ReturnModelType<typeof User>,
    private readonly config: ConfigService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(UserService.name);
  }

  /**
   * Responsible method of searching and returning all existing users in the database, in their entirety or with a designated limit.
   * @param {number} skip Number of elements to skip to return
   * @param {number} take Number of elements to take from the result
   * @returns {Promise<User[]>} Returns a promise of type User [] which is a collection of Users found and may or may not contain a limit.
   */
  async all({ skip, take }: AllArgs = { skip: 0, take: 0 }): Promise<User[]> {
    return await this.model.find().skip(skip).limit(take).exec();
  }

  /**
   * Responsible method of searching and returning a user based solely on their ID.
   * @param {ObjectId} id Corresponds to the ID of the user to be consulted.
   * @returns {Promise<User>} Returns a promise with the found user.
   */
  async get(id: ObjectId): Promise<User> {
    const user = await this.model.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $lookup: { from: 'access', foreignField: 'user', localField: '_id', as: 'access' } }
    ]);
    return user[0];
  }

  /**
   * Responsible method of creating a user record within the database.
   * @param {UserCreateFields} data Represents the data from the request made by the client, this data is of type UserCreateFields.
   * @returns {Promise<Response>} Structure of the response message to a request made to the service.
   */
  async create(data: UserCreateFields): Promise<Response> {
    return new Promise(async (resolve) => {
      await this.model
        .countDocuments(
          { $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }] },
          async (err, count) => {
            if (err) {
              this.logger.error(err);
              return resolve({
                message: err.message,
                developerCode: DeveloperResponse.INTERNAL_ERROR
              });
            }

            if (count > 0)
              return resolve({
                message:
                  'There is already a user with the email or phone number you want to enter.',
                developerCode: DeveloperResponse.USER_ALREADY_EXISTING
              });
            else {
              data.password = await this.password(data.password);
              this.model
                .create(data)
                .then(() => {
                  return resolve({
                    message: 'User created successfully',
                    developerCode: DeveloperResponse.SUCCESS_QUERY
                  });
                })
                .catch((error) => {
                  this.logger.error(error);
                  return resolve({
                    message: 'An occurred error.',
                    developerCode: DeveloperResponse.INTERNAL_ERROR
                  });
                });
            }
          }
        )
        .clone();
    });
  }

  async findByEmailOrPhoneNumber(email: string, phoneNumber: string): Promise<User> {
    return this.model.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });
  }

  /**
   * This method is responsible for generating the encryption hash of the password that is passed by parameter.
   * @param {string} password The argument that receives the password that will be processed towards a hash.
   * @returns {Promise<string>} A string type promise is returned in which the return parameter is the generated hash of the password.
   */
  async password(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt(this.saltRounds)
        .then((salt) => {
          hash(password, salt)
            .then((hash) => resolve(hash))
            .catch((err) => {
              this.logger.error(err);
              return reject();
            });
        })
        .catch((err) => {
          this.logger.error(err);
          return reject();
        });
    });
  }
}
