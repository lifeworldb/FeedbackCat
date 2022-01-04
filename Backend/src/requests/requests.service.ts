import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReturnModelType } from '@typegoose/typegoose';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from 'nestjs-typegoose';
import { AllArgs } from 'src/common/args/general.args';
import { DeveloperResponse } from '../common/enums';
import { Response } from 'src/common/interfaces/response.interface';
import { RequestCreateFields } from './dto/request.inputs';
import { IRequestService } from './dto/request.interface';
import { Request } from './models/request.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class RequestsService implements IRequestService {
  constructor(
    @InjectModel(Request)
    private readonly model: ReturnModelType<typeof Request>,
    private readonly config: ConfigService,
    private readonly logger: PinoLogger
  ) { 
    logger.setContext(RequestsService.name);
  }

  /**
   * Responsible method of creating a request record within the database.
   * @param {RequestCreateFields} data Represents the data from the request made by the client, this data is of type RequestCreateFields.
   * @returns {Promise<Response>} Structure of the response message to a request made to the service.
   */
  create(data: RequestCreateFields): Promise<Response> {
    return new Promise(async (resolve) => {
      this.model.create(data)
      .then(() => {
        return resolve({
          message: 'Request created successfully',
          developerCode: DeveloperResponse.SUCCESS_QUERY
        });
      })
      .catch((error) => {
        this.logger.error(error);
        return resolve({
          message: 'An occurred error.',
          developerCode: DeveloperResponse.INTERNAL_ERROR
        });
      })
    })
  }

  /**
   * Responsible method of searching and returning a user based solely on their ID.
   * @param {ObjectId} id Corresponds to the ID of the request to be consulted.
   * @returns {Promise<Request>} Returns a promise with the found request.
   */
  async get(id: ObjectId): Promise<Request> {
    throw new Error('Method not implemented.');
  }
  /**
   * Responsible method of searching and returning all existing resquets in the database, in their entirety or with a designated limit.
   * @param {number} skip Number of elements to skip to return
   * @param {number} take Number of elements to take from the result
   * @returns {Promise<Request[]>} Returns a promise of type Request [] which is a collection of Requests found and may or may not contain a limit.
   */
  async all({ skip, take }: AllArgs = { skip: 0, take: 0 }): Promise<Request[]> {
    return await this.model.find().skip(skip).limit(take).exec();
  }
}
