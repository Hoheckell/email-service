import { Body, Controller, Patch, Post, Request, UseGuards, Headers, Get, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AlunoDto } from './dto/aluno.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('alunos')
export class AlunosController {
    constructor(private readonly alunosService: AlunosService) {}

    @Patch('/:authId')
    async update(@Body() alunoDto: AlunoDto, @Request() req) {
        return this.alunosService.update(alunoDto, req.params.authId);
    }

    @Public()
    @Post('/turmas/:codigo')
    async joinTurma(@Body() authId: string, @Request() req,
        @Headers('x-token') token: string,) {
        if (token != process.env.X_TOKEN) {
            throw new Error('Unauthorized');
        }
        return this.alunosService.joinTurma(authId, req.params.codigo);
    }

    @Get(':id')
    async show(@Param('id') id: string): Promise<AlunoDto | null> {
        return this.alunosService.show(id);
    }

    @Get()
    async findAll(): Promise<AlunoDto[]> {
        return this.alunosService.findAll();
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<boolean> {
        return this.alunosService.remove(id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.alunosService.uploadFile(file);
    }
}
