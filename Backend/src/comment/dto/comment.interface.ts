import { ObjectId } from 'mongodb';
import { Response } from '../../common/interfaces/response.interface';
import { AllArgs } from '../../common/args/general.args';
import { Comment } from '../models/comment.model';
import { CommentCreateFields  } from './comment.inputs';

export interface ICommentService {
  create(data: CommentCreateFields): Promise<Response>;
  get(id: ObjectId): Promise<Comment>;
  all(data: AllArgs): Promise<Comment[]>;
}
