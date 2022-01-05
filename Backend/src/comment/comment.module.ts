import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Comment } from './models/comment.model';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { Reply } from './models/reply.model';

@Module({
  imports: [TypegooseModule.forFeature([Comment, Reply])],
  providers: [CommentResolver, CommentService],
  exports: [CommentService]
})
export class CommentModule {}
