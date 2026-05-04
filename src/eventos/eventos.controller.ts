import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventosService } from './eventos.service';

@UseGuards(JwtAuthGuard)
@Controller('eventos')
export class EventosController {
    constructor(private readonly eventosService: EventosService) {}

    @Get('/proximos/:turmaId')
    async getEventosTurma(@Param('turmaId') turmaId: number) {
        return await this.eventosService.getEventos(turmaId);
    }

    @Get('/todos/:turmaId')
    async getTodosEventosTurma(@Param('turmaId') turmaId: number) {
        return await this.eventosService.getTodosEventos(turmaId);
    }
}
