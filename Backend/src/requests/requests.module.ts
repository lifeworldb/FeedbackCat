import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Request } from './models/request.model';
import { RequestsService } from './requests.service';
import { RequestsResolver } from './requests.resolver';

@Module({
  imports: [TypegooseModule.forFeature([Request])],
  providers: [RequestsResolver, RequestsService],
  exports: [RequestsService]
})
export class RequestsModule {}
