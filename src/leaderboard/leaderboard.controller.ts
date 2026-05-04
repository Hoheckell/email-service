import { Body, Controller, Get, Headers, HttpException, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}

    @Public()
    @Post('add-points')
    async addPoints(@Body('username') username: string, @Body('points_to_add') points: number, @Headers('x-token') token: string) {
        console.log('Token:', process.env.X_TOKEN);
        if (token != process.env.X_TOKEN) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        console.log('Adding points', username, points);
        return await this.leaderboardService.addPoints(username, points);
    }
    
    @Public()
    @Get('rival')
    async getRival(@Query('score', ParseIntPipe) score: number, @Headers('x-token') token: string) {
        if (token != process.env.X_TOKEN) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        console.log('Getting rival for score', score);
        return await this.leaderboardService.getRival(score);
    }
    
    @Public()
    @Get()
    async getLeaderboard(@Headers('x-token') token: string) {
        if (token != process.env.X_TOKEN) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        console.log('Getting leaderboard');
        return await this.leaderboardService.getLeaderboard();
    }
    
    @Public()
    @Get('score')
    async getScore(@Query('username') username: string, @Headers('x-token') token: string) {
        if (token != process.env.X_TOKEN) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        console.log('Getting score for username', username);
        return await this.leaderboardService.getScore(username);
    }
}
