import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { User } from '../user/models/user.model';

@Injectable()
export class AuthService {
  /**
   * In the constructor of the AuthService the services necessary for its operation are injected.
   * @param {JwtService} accessTokenService Service that is responsible for signing and generating the access jwt token.
   * @param {JwtService} refreshTokenService Service that is responsible for signing and generating the refresh jwt token.
   * @param {PinoLogger} logger Log management service.
   */
  constructor(
    @Inject('JwtAccessTokenService')
    private readonly accessTokenService: JwtService,
    @Inject('JwtRefreshTokenService')
    private readonly refreshTokenService: JwtService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(AuthService.name);
  }

  /**
   * Method in charge of generating the access jwt token.
   * @param {User} user Instance of the user who is signed and the access jwt token is generated.
   * @param {string | number} exp Access token lifetime, this parameter is optional.
   * @returns {Promise<string>} Returns the string that makes up the access jwt token.
   */
  async generateAccessToken(user: User, exp?: string | number): Promise<string> {
    if (exp)
      return this.accessTokenService.sign(
        {
          user: user._id.toString()
        },
        {
          subject: user._id.toString(),
          expiresIn: exp
        }
      );
    return this.accessTokenService.sign(
      {
        user: user._id.toString()
      },
      {
        subject: user._id.toString()
      }
    );
  }

  /**
   * Method in charge of generating the refresh jwt token.
   * @param {User} user Instance of the user who is signed and the refresh jwt token is generated.
   * @param {string | number} exp Refresh token lifetime, this parameter is optional.
   * @returns {Promise<string>} Returns the string that makes up the access jwt token.
   */
  async generateRefreshToken(user: User, exp?: string | number): Promise<string> {
    if (exp)
      return this.refreshTokenService.sign(
        {
          user: user._id.toString()
        },
        {
          subject: user._id.toString(),
          expiresIn: exp
        }
      );
    return this.refreshTokenService.sign(
      {
        user: user._id.toString()
      },
      {
        subject: user._id.toString()
      }
    );
  }
}
