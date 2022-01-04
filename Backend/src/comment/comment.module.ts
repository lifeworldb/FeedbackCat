import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Comment } from './models/comment.model';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';

@Module({
  imports: [TypegooseModule.forFeature([Comment])],
  providers: [CommentResolver, CommentService],
  exports: [CommentService]
})
export class CommentModule {}
