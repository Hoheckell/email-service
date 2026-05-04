import { Body, Controller, Delete, Get, Param, Post, Put,Headers, UploadedFile, UseGuards, UseInterceptors, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) {}

    @Post()
    create(@Body() post: PostDto, @Headers('x-token') token: string): Promise<PostDto> {
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return this.postsService.create(post);
    }

    @Public()
    @Get()
    findAll(@Headers('x-token') token: string): Promise<PostDto[]> {
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return this.postsService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string, @Headers('x-token') token: string): Promise<PostDto> {
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return this.postsService.findOne(id);
    }
    
    @Put(':id')
    update(@Param('id') id: string, @Body() post: PostDto, @Headers('x-token') token: string): Promise<PostDto> {
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return this.postsService.update(id, post);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Headers('x-token') token: string): Promise<boolean> {
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return this.postsService.remove(id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Headers('x-token') token: string) {
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return this.postsService.uploadFile(file);
    }

    @Public()
    @Get('slug/:slug')
    getPostBySlug(@Param('slug') slug: string, @Headers('x-token') token: string): Promise<PostDto> {
        if (token != process.env.X_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }
        return this.postsService.getPostBySlug(slug);
    }
}
