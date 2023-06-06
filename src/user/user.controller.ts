import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async getUser(@Param('username') username: string) {
    const userInfo = await this.userService.getUser(username);
    const userStats = await this.userService.getUserStats(username);
    const reposInfo = await this.userService.getUserRepos(username);

    const totalStars = reposInfo.reduce(
      (total, repo) => total + repo.stargazers_count,
      0,
    );
    const totalForks = reposInfo.reduce((total, repo) => total + repo.forks, 0);

    return {
      ...userInfo,
      totalStars,
      totalForks,
      ...userStats,
    };
  }
}
