import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { TypegooseModule } from 'nestjs-typegoose';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from 'apollo-server-core';

import { UserModule } from './user/user.module';
import { RecipesModule } from './recipes/recipes.module';
import { SeedsModule } from './seeds/seeds.module';
import { CommonModule } from './common/common.module';
import { errorName, formatError } from './common/functions';
import { CommentModule } from './comment/comment.module';
import { RequestsModule } from './requests/requests.module';
import TabsQueries from './graphql/tabs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        pinoHttp: {
          safe: true,
          level: config.get<string>('NODE_ENV') !== 'production' ? 'debug' : 'info',
          useLevelLabels: true,
          transport:
            config.get<string>('NODE_ENV') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true
                  }
                }
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true
                  }
                }
        }
      }),
      inject: [ConfigService]
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      inject: [ConfigService]
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useFactory: async (logger: PinoLogger, config: ConfigService): Promise<GqlModuleOptions> => {
        return {
          logger,
          debug: config.get<string>('NODE_ENV') !== 'production',
          cors: false,
          autoSchemaFile: true,
          sortSchema: true,
          installSubscriptionHandlers: true,
          introspection: true,
          playground:
            config.get<string>('APOLLO_STUDIO') === 'true'
              ? false
              : {
                  endpoint: config.get<string>('NODE_ENV') !== 'production' ? '/graphql' : '/',
                  subscriptionEndpoint: '/gql/subs',
                  settings: {
                    'request.credentials': 'include'
                  },
                  tabs: TabsQueries
                },
          plugins:
            config.get<string>('APOLLO_STUDIO') === 'true'
              ? [
                  config.get<string>('NODE_ENV') !== 'production'
                    ? ApolloServerPluginLandingPageLocalDefault()
                    : ApolloServerPluginLandingPageProductionDefault()
                ]
              : [],
          context: ({ req, res }): any => ({ req, res, errorName }),
          formatError: (err) => formatError.getError(err)
        };
      },
      inject: [PinoLogger, ConfigService]
    }),
    UserModule,
    RecipesModule,
    SeedsModule,
    CommonModule,
    CommentModule,
    RequestsModule
  ]
})
export class AppModule {}
