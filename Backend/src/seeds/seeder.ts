import { Inject, Injectable, Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserService } from '../user/user.service';
import { UserCreateFields } from '../user/dto/user.inputs';
import { DeveloperResponse } from '../common/enums';
import { Status } from '../requests/dto/request.enums';
import { RequestsService } from '../requests/requests.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  // Users Seeds
  private usersSeeds = [
    {
      _id: new ObjectId(),
      image: 'image-zena.jpg',
      name: 'Zena Kelley',
      userName: 'velvetround'
    },
    {
      _id: new ObjectId(),
      image: 'image-suzanne.jpg',
      name: 'Suzanne Chang',
      userName: 'upbeat1811'
    },
    {
      _id: new ObjectId(),
      image: 'image-thomas.jpg',
      name: 'Thomas Hood',
      userName: 'brawnybrave'
    },
    {
      _id: new ObjectId(),
      image: 'image-elijah.jpg',
      name: 'Elijah Moss',
      userName: 'hexagon.bestagon'
    },
    {
      _id: new ObjectId(),
      image: 'image-james.jpg',
      name: 'James Skinner',
      userName: 'hummingbird1'
    },
    {
      _id: new ObjectId(),
      image: 'image-anne.jpg',
      name: 'Anne Valentine',
      userName: 'annev1990'
    },
    {
      _id: new ObjectId(),
      image: 'image-ryan.jpg',
      name: 'Ryan Welles',
      userName: 'voyager.344'
    },
    {
      _id: new ObjectId(),
      image: 'image-george.jpg',
      name: 'George Partridge',
      userName: 'soccerviewer8'
    },
    {
      _id: new ObjectId(),
      image: 'image-javier.jpg',
      name: 'Javier Pollard',
      userName: 'warlikeduke'
    },
    {
      _id: new ObjectId(),
      image: 'image-roxanne.jpg',
      name: 'Roxanne Travis',
      userName: 'peppersprime32'
    },
    {
      _id: new ObjectId(),
      image: 'image-victoria.jpg',
      name: 'Victoria Mejia',
      userName: 'arlen_the_marlin'
    },
    {
      _id: new ObjectId(),
      image: 'image-jackson.jpg',
      name: 'Jackson Barker',
      userName: 'countryspirit'
    },
  ]

  private commentsSeeds = [
    {
      _id: new ObjectId(),
      content: "Awesome idea! Trying to find framework-specific projects within the hubs can be tedious",
      user: this.usersSeeds.filter(objt => objt.userName === 'upbeat1811')[0]._id
    },
    {
      _id: new ObjectId(),
      content: "Please use fun, color-coded labels to easily identify them at a glance",
      user: this.usersSeeds.filter(objt => objt.userName === 'brawnybrave')[0]._id
    },
    {
      _id: new ObjectId(),
      content: "Also, please allow styles to be applied based on system preferences. I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
      user: this.usersSeeds.filter(objt => objt.userName === 'hexagon.bestagon')[0]._id
    },
    {
      _id: new ObjectId(),
      content: 'Second this! I do a lot of late night coding and reading. Adding a dark theme can be great for preventing eye strain and the headaches that result. It’s also quite a trend with modern apps and  apparently saves battery life.',
      user: this.usersSeeds.filter(objt => objt.userName === 'hummingbird1')[0]._id
    }
  ]

  private requestsSeeds = [
    {
      _id: new ObjectId(),
      title: "Add tags for solutions",
      category: "enhancement",
      upVotes: 112,
      status: Status.SUGGESTION,
      description: "Easier to search for solutions based on a specific stack.",
      comments: [this.commentsSeeds[0]._id, this.commentsSeeds[1]._id],
    },
    {
      _id: new ObjectId(),
      title: "Add a dark theme option",
      category: "feature",
      upVotes: 99,
      status: Status.SUGGESTION,
      description: "It would help people with light sensitivities and who prefer dark mode.",
      comments: [this.commentsSeeds[2]._id, this.commentsSeeds[3]._id],
    }
  ]

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(RequestsService)
    private readonly requestService: RequestsService,
    @Inject(CommentService)
    private readonly commentsService: CommentService
  ) { }

  async seed() {
    await this.usersSeeder()
      .then(() => {
        this.logger.debug('Successfully completed seeding users...');
        Promise.resolve();
      })
      .catch((error) => {
        this.logger.error('Failed seeding users...');
        Promise.reject(error);
      });

    await this.requestsSeeder()
    .then(() => {
      this.logger.debug('Successfully completed seeding requests...');
      Promise.resolve();
    })
    .catch((error) => {
      this.logger.error('Failed seeding requests...');
      Promise.reject(error);
    })

    await this.commentsSeeder()
    .then(() => {
      this.logger.debug('Successfully completed seeding comments...');
      Promise.resolve();
    }).catch((error) => {
      this.logger.error('Failed seeding comments...');
      Promise.reject(error);
    })
  }

  async usersSeeder() {
    for (const user of this.usersSeeds) {
      await this.userService.create(user).then((res) => {
        if (res.developerCode === DeveloperResponse.USER_ALREADY_EXISTING) {
          this.logger.debug(`I cannot create the user ${user.userName}, because it already exists.`);
        }
        if (res.developerCode === DeveloperResponse.SUCCESS_QUERY) {
          this.logger.debug('The users has been created, successfully.');
        }
        if (res.developerCode === DeveloperResponse.INTERNAL_ERROR) {
          return Promise.reject(res.message);
        }
      });
    }

    return Promise.resolve();
  }

  async commentsSeeder() {
    const comments = await this.commentsService.all();

    if (comments.length > 0) return Promise.resolve();

    for (const comment of this.commentsSeeds) {
      // @ts-ignore
      await this.commentsService.create(comment).then((res) => {
        if (res.developerCode === DeveloperResponse.SUCCESS_QUERY) {
          this.logger.debug('The comments has been created, successfully.');
        }
        if (res.developerCode === DeveloperResponse.INTERNAL_ERROR) {
          return Promise.reject(res.message);
        }
      });
    }

    return Promise.resolve();
  }

  async requestsSeeder() {
    const requests = await this.requestService.all();

    if (requests.length > 0) return Promise.resolve();

    for (const request of this.requestsSeeds) {
      await this.requestService.create(request).then((res) => {
        if (res.developerCode === DeveloperResponse.SUCCESS_QUERY) {
          this.logger.debug('The request has been created, successfully.');
        }
        if (res.developerCode === DeveloperResponse.INTERNAL_ERROR) {
          return Promise.reject(res.message);
        }
      });
    }

    return Promise.resolve();
  }
}
