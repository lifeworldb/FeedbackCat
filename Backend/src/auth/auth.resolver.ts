import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Context } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PasswordUtils } from '../common/functions';
import { Public } from './metadatas/auth.metadata';
import { Response } from '../common/interfaces/response.interface';
import { AuthArgs } from './dto/auth.args';
import { DeveloperResponse } from '../common/enums';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/models/user.model';

/**
 * Auth resolver
 *
 * @export
 * @class AuthResolver
 */
@Resolver()
export class AuthResolver {
  /**
   * In the constructor of the AuthResolver the services necessary for its operation are injected.
   * @param {UserService} userService Service responsible for user management.
   * @param {AuthService} service Service responsible for the execution of authentication signatures.
   * @param {PasswordUtils} passwordUtils Set of qualities related to password management.
   * @param {ConfigService} config Configuration management service
   * @param {PinoLogger} logger Log management service.
   */
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly service: AuthService,
    private readonly passwordUtils: PasswordUtils,
    private readonly config: ConfigService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(AuthResolver.name);
  }

  /**
   * Method responsible for the authentication of a user.
   * @param context Context of the request.
   * @param {AuthArgs} args Arguments of the request.
   * @returns {Promise<Response>} Response of the request.
   */
  @Public()
  @Recaptcha()
  @Mutation(() => Response)
  async login(@Context() context: any, @Args() args: AuthArgs): Promise<Response> {
    const { res } = context;

    const user = await this.userService.findByEmailOrPhoneNumber(
      args.input.email,
      args.input.phoneNumber
    );

    if (!user) {
      AuthResolver.removeCookies(res);
      return Promise.resolve({
        message: 'The username or password entered is not correct.',
        developerCode: DeveloperResponse.ERROR_QUERY
      });
    }

    if (args.input.password.length < 8) {
      AuthResolver.removeCookies(res);
      return Promise.resolve({
        message: 'The password does not comply with the minimum length rules.',
        developerCode: DeveloperResponse.ERROR_QUERY
      });
    }

    const isSame: boolean = await this.passwordUtils.compare(args.input.password, user.password);

    if (!isSame) {
      AuthResolver.removeCookies(res);
      return Promise.resolve({
        message: 'The username or password entered is not correct.',
        developerCode: DeveloperResponse.ERROR_QUERY
      });
    }

    res.cookie('access-token', await this.service.generateAccessToken(user), {
      httpOnly: true,
      sameSite: this.config.get<string>('APOLLO_STUDIO') === 'true' ? 'none' : 'strict',
      secure: this.config.get<string>('APOLLO_STUDIO') === 'true',
      // domain: this.config.get<string>('NODE_ENV') !== 'development' ? '.mydomain.com' : 'localhost',
      maxAge: 1.8e6
    });

    res.cookie('refresh-token', await this.service.generateRefreshToken(user, '2 days'), {
      httpOnly: true,
      sameSite: this.config.get<string>('APOLLO_STUDIO') === 'true' ? 'none' : 'strict',
      secure: this.config.get<string>('APOLLO_STUDIO') === 'true',
      // domain: this.config.get<string>('NODE_ENV') !== 'development' ? '.mydomain.com' : 'localhost',
      maxAge: 1.728e8
    });

    return Promise.resolve({
      message: 'SignIn Successfully.',
      developerCode: DeveloperResponse.SUCCESS_QUERY
    });
  }

  /**
   * Method responsible for the refresh of the access token.
   * @param context Context of the request.
   * @param {User} user User of the request.
   * @returns {Promise<Response>} Response of the request.
   */
  @Public()
  @UseGuards(RefreshAuthGuard)
  @Mutation(() => Response)
  async refreshToken(@Context() context: any, @CurrentUser() user: User): Promise<Response> {
    this.logger.debug(context);
    const { res } = context;

    res.cookie('access-token', await this.service.generateAccessToken(user), {
      httpOnly: true,
      sameSite: this.config.get<string>('APOLLO_STUDIO') === 'true' ? 'none' : 'strict',
      secure: this.config.get<string>('APOLLO_STUDIO') === 'true',
      // domain: this.config.get<string>('NODE_ENV') !== 'development' ? '.mydomain.com' : 'localhost',
      maxAge: 1.8e6
    });

    res.cookie('refresh-token', await this.service.generateRefreshToken(user, '2 days'), {
      httpOnly: true,
      sameSite: this.config.get<string>('APOLLO_STUDIO') === 'true' ? 'none' : 'strict',
      secure: this.config.get<string>('APOLLO_STUDIO') === 'true',
      // domain: this.config.get<string>('NODE_ENV') !== 'development' ? '.mydomain.com' : 'localhost',
      maxAge: 1.728e8
    });

    return Promise.resolve({
      message: 'Refresh Successfully.',
      developerCode: DeveloperResponse.SUCCESS_QUERY
    });
  }

  /**
   * Method responsible for the logout of a user.
   * @param res Response of the request.
   * @returns {Promise<Response>} Response of the request.
   */
  private static removeCookies(res: any): void {
    res.cookie('access-token', '', {
      httpOnly: true,
      maxAge: 0
    });

    res.cookie('refresh-token', '', {
      httpOnly: true,
      maxAge: 0
    });
  }
}
