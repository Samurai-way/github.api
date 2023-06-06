import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private httpService: HttpService,
  ) {}

  async getUser(username: string) {
    const response = await this.httpService
      .get(`https://api.github.com/users/${username}`)
      .toPromise();

    let user = await this.userModel.findOne({ username: username });

    if (!user) {
      user = new this.userModel({ ...response.data, username: username });
    } else {
      // Иначе обновляем данные
      user.set(response.data);
    }

    await user.save();
    return response.data;
  }

  async getUserRepos(username: string) {
    const reposResponse = await this.httpService
      .get(`https://api.github.com/users/${username}/repos`)
      .toPromise();

    return reposResponse.data;
  }

  async getUserRepoCommits(username: string, repo: string) {
    const commitsResponse = await this.httpService
      .get(`https://api.github.com/repos/${username}/${repo}/commits`)
      .toPromise();

    return commitsResponse.data.length;
  }

  async getUserStats(username: string) {
    const repos = await this.getUserRepos(username);
    let totalCommits = 0;

    for (const repo of repos) {
      const commits = await this.getUserRepoCommits(username, repo.name);
      totalCommits += commits;
    }

    const user = await this.userModel.findOne({ username: username });

    if (user) {
      user.totalRepos = repos.length;
      user.totalCommits = totalCommits;
      await user.save();
    }

    return {
      totalRepos: repos.length,
      totalCommits: totalCommits,
    };
  }
}
