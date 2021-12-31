import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PinoLogger } from 'nestjs-pino';
import { get } from 'lodash';
import { UserService } from '../../user/user.service';
import { User } from '../../user/models/user.model';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  /**
   * In the constructor of the JwtRefreshStrategy the services necessary for its operation are injected.
   * @param {UserService} userService Service responsible for user management.
   * @param {ConfigService} config Configuration management service
   * @param {PinoLogger} logger Log management service.
   */
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly logger: PinoLogger
  ) {
    super({
      secretOrKey: config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      issuer: config.get<string>('JWT_ISSUER'),
      audience: config.get<string>('JWT_AUDIENCE'),
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => get(req, 'cookies.refresh-token')])
    });
    logger.setContext(JwtRefreshStrategy.name);
  }

  /**
   * This method is called by PassportJS when a user tries to refresh a JWT token.
   * @param {string} refreshToken Refresh token sent by the user.
   */
  async validate(refreshToken: any): Promise<User> {
    const user = await this.userService.get(refreshToken.sub);

    if (!user) throw new Error('UNAUTHORIZED');

    return Promise.resolve(user);
  }
}
