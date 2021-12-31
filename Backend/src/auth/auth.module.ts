import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: 'JwtAccessTokenService',
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtService => {
        return new JwtService({
          secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            audience: config.get<string>('JWT_AUDIENCE'),
            issuer: config.get<string>('JWT_ISSUER'),
            expiresIn: '30min'
          }
        });
      }
    },
    {
      provide: 'JwtRefreshTokenService',
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtService => {
        return new JwtService({
          secret: config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          signOptions: {
            audience: config.get<string>('JWT_AUDIENCE'),
            issuer: config.get<string>('JWT_ISSUER'),
            expiresIn: '30min'
          }
        });
      }
    }
  ]
})
export class AuthModule {}
