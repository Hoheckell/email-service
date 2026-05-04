import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { UserRoleEnum } from '../auth/enum/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Get('/codigo/:codigo')
  async getTurmaByCodigo(
    @Param('codigo') codigo: string,
    @Headers('x-token') token: string,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    if (token != process.env.X_TOKEN) {
      throw new Error('Unauthorized');
    }
    return this.turmasService.getTurmaByCodigo(codigo, authToken);
  }

  @Get('/materiais/:turmaId')
  async getMateriais(
    @Param('turmaId') turmaId: number,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    return this.turmasService.getMateriais(turmaId, authToken);
  }

  @Get('/eventos/:turmaId')
  async getEventos(
    @Param('turmaId') turmaId: number,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    return this.turmasService.getEventos(turmaId, authToken);
  }

  @Get('/alunos/:turmaId')
  async getAlunos(
    @Param('turmaId') turmaId: number,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    return this.turmasService.getAlunos(turmaId, authToken);
  }

  @Get('/:authId/:role')
  async getTurmas(
    @Param('authId') authId: string,
    @Param('role') role: UserRoleEnum,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    return this.turmasService.getTurmas(authId, role, authToken);
  }

  @Post('/:authid')
  async createTurma(
    @Param('authid') professorId: string,
    @Request() req,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    return this.turmasService.createTurma(req.body, professorId, authToken);
  }

  @Patch('/:id')
  async updateTurma(
    @Param('id') id: number,
    @Request() req,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    return this.turmasService.updateTurma(req.body, id, authToken);
  }

  @Delete('/:id')
  async deleteTurma(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ) {
    const authToken = authHeader.replace('Bearer ', '');
    return this.turmasService.deleteTurma(id, authToken);
  }
}
