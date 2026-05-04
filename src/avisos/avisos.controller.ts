import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Headers } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AvisosService } from './avisos.service';
import { AvisoDto } from './dto/aviso.dto';


@UseGuards(JwtAuthGuard)
@Controller('avisos')
export class AvisosController {
    constructor(private readonly avisosService: AvisosService) {}

    @Post()
    async create(@Body() aviso: AvisoDto, @Headers('authorization') authHeader: string) {
        const token = authHeader.replace('Bearer ', '');
        return this.avisosService.create(aviso, token);
    }

    @Get()
    async findAll(@Headers('authorization') authHeader: string): Promise<AvisoDto[]> {
        const token = authHeader.replace('Bearer ', '');
        return this.avisosService.findAll(token);
    }

    @Get(':id')
    async show(@Param('id') id: string, @Headers('authorization') authHeader: string): Promise<AvisoDto | null> {
        const token = authHeader.replace('Bearer ', '');
        return this.avisosService.show(id, token);
    }

    @Patch(':id')
    async update(@Body() aviso: AvisoDto, @Param('id') id: string, @Headers('authorization') authHeader: string): Promise<AvisoDto> {
        const token = authHeader.replace('Bearer ', '');
        return this.avisosService.update(aviso, id, token);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Headers('authorization') authHeader: string): Promise<boolean> {
        const token = authHeader.replace('Bearer ', '');
        return this.avisosService.remove(id, token);
    }

    @Get('turma/:turmaId')
    async findAllByTurma(@Param('turmaId') turmaId: string, @Headers('authorization') authHeader: string): Promise<AvisoDto[]> {
        const token = authHeader.replace('Bearer ', '');
        return this.avisosService.findAllByTurma(turmaId, token);
    }
}