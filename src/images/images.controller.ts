import { Controller, Get, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IImage } from './interfaces/images.interface';

@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Get('posts')
  async getPostsImages(@Headers('x-token') token: string): Promise<IImage[]> {
    if (token != process.env.X_TOKEN) {
      throw new UnauthorizedException('Token inválido');
    }
    return await this.imagesService.listPostImages();
  }
}