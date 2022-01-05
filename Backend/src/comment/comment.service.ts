import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Response } from '../common/interfaces/response.interface';
import { AllArgs } from '../common/args/general.args';
import { DeveloperResponse } from '../common/enums';
import { ICommentService } from './dto/comment.interface';
import { Comment } from './models/comment.model';
import { CommentCreateFields } from './dto/comment.inputs';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @InjectModel(Comment)
    private readonly model: ReturnModelType<typeof Comment>,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    this.logger.setContext(CommentService.name);
  }

  /**
   * Responsible method of creating a comment record within the database.
   * @param {CommentCreateFields} data Represents the data from the request made by the client, this data is of type CommentCreateFields.
   * @returns {Promise<Response>} Structure of the response message to a request made to the service.
   */
  create(data: CommentCreateFields): Promise<Response> {
    return new Promise(async (resolve) => {
      this.model
        .create(data)
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
        });
    });
  }

  /**
   * Responsible method of searching and returning a user based solely on their ID.
   * @param {ObjectId} id Corresponds to the ID of the comment to be consulted.
   * @returns {Promise<Comment>} Returns a promise with the found comment.
   */
  async get(id: ObjectId): Promise<Comment> {
    throw new Error('Method not implemented.');
  }

  /**
   * Responsible method of searching and returning all existing resquets in the database, in their entirety or with a designated limit.
   * @param {number} skip Number of elements to skip to return
   * @param {number} take Number of elements to take from the result
   * @returns {Promise<Request[]>} Returns a promise of type Comment [] which is a collection of Comments found and may or may not contain a limit.
   */
  async all({ skip, take }: AllArgs = { skip: 0, take: 0 }): Promise<Comment[]> {
    return await this.model.find().skip(skip).limit(take).exec();
  }
}
