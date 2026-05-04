import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Headers } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizDto } from './dto/quizz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TentativaDto } from './dto/tentativa.dto';
import { StatusEnum } from '../auth/enum/enums';
import { RespostaDto } from './dto/resposta.dto';

interface IStatus {
    status: StatusEnum;
}

@UseGuards(JwtAuthGuard)
@Controller('quizz')
export class QuizzController {
    constructor(private readonly quizzService: QuizzService) {}

    @Post()
    async create(@Body() quizz: QuizDto, @Headers('authorization') authHeader: string): Promise<QuizDto> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.create(quizz, token);
    }

    @Get()
    async findAll(@Headers('authorization') authHeader: string): Promise<QuizDto[]> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.findAll(token);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() quizz: QuizDto, @Headers('authorization') authHeader: string): Promise<QuizDto> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.update(id, quizz, token);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Headers('authorization') authHeader: string): Promise<boolean> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.remove(id, token);
    }

    @Get('tentativa/:id')
    async findOneTentativa(@Param('id') id: string, @Headers('authorization') authHeader: string): Promise<TentativaDto> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.findOneTentativa(id, token);
    }

    @Get('turma/:turmaId')
    async findQuizzesByTurma(@Param('turmaId') turmaId: number, @Headers('authorization') authHeader: string): Promise<QuizDto[]> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.findQuizzesByTurma(turmaId, token);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Headers('authorization') authHeader: string): Promise<QuizDto> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.findOne(id, token);
    }

    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Body() status: IStatus, @Headers('authorization') authHeader: string): Promise<QuizDto> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.updateStatus(id, status.status, token);
    }

    @Get('aluno/:alunoId')
    async getQuizzesByAluno(@Param('alunoId') alunoId: string, @Headers('authorization') authHeader: string): Promise<QuizDto[]> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.getQuizzesByAluno(alunoId, token);
    }

    @Get('tentativas/leaderboard/:quizId/aluno/:alunoId')
    async getTentativasByAluno(@Param('quizId') quizId: string, @Param('alunoId') alunoId: string | null = null, @Headers('authorization') authHeader: string): Promise<TentativaDto[]> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.getTentativasByAluno(quizId, alunoId, token);
    }


    @Post('tentativa/save/:quizId/:alunoId/:concluir')
    async createTentativa(@Body() respostas: RespostaDto[], @Headers('authorization') authHeader: string, @Param('quizId') quizId: string, @Param('alunoId') alunoId: string, @Param('concluir') concluir: boolean): Promise<TentativaDto> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.createTentativa(respostas, token, quizId, alunoId, concluir);
    }

    @Get('tentativas/draft/aluno/:alunoId')
    async getTentativasDraftByAluno(@Param('alunoId') alunoId: string, @Headers('authorization') authHeader: string): Promise<TentativaDto[]> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.getTentativasDraftByAluno(alunoId, token);
    }

    @Delete('tentativa/:id')
    async deleteTentativa(@Param('id') id: string, @Headers('authorization') authHeader: string): Promise<boolean> {
        const token = authHeader.replace('Bearer ', '');
        return this.quizzService.deleteTentativa(id, token);
    }
}
