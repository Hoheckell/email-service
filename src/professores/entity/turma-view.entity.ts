import { ViewEntity, ViewColumn } from 'typeorm';
import { TurmaComTotalAlunosDto } from '../dto/turma-total.dto';

@ViewEntity({
  name: 'turmas_com_total_alunos',
  synchronize: false, // Importante: Indica que a estrutura já existe no banco (criada via SQL)
})
export class TurmaComTotalAlunos {
  @ViewColumn({ name: 'turma_id' })
  turmaId: number; // BigInt no banco, cuidado se os IDs forem gigantes

  @ViewColumn()
  id: number; // Campo duplicado na view, mas presente no SQL

  @ViewColumn()
  codigo: string;

  @ViewColumn()
  disciplina: string;

  @ViewColumn({ name: 'data_inicio' })
  dataInicio: Date;

  @ViewColumn({ name: 'data_fim' })
  dataFim: Date;

  @ViewColumn({ name: 'criado_em' })
  criadoEm: Date;

  // --- DADOS DO PROFESSOR ---

  @ViewColumn({ name: 'professor_auth_id' })
  professorAuthId: string; // UUID

  @ViewColumn({ name: 'professor_nome' })
  professorNome: string;

  @ViewColumn({ name: 'professor_email' })
  professorEmail: string;

  @ViewColumn({ name: 'professor_avatar' })
  professorAvatar: string;

  // --- CONTADOR ---

  @ViewColumn({
    name: 'total_alunos',
    transformer: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      to: (value) => value, // Na escrita (não usada em views), mantém igual
      from: (value) => {
        // O PostgreSQL retorna COUNT como string. Convertemos para Inteiro.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return value !== null && value !== undefined ? parseInt(value, 10) : 0;
      },
    },
  })
  totalAlunos: number;

  toDto(): TurmaComTotalAlunosDto {
    const dto = new TurmaComTotalAlunosDto();
    dto.turmaId = this.turmaId;
    dto.id = this.id;
    dto.codigo = this.codigo;
    dto.disciplina = this.disciplina;
    dto.dataInicio = this.dataInicio;
    dto.dataFim = this.dataFim;
    dto.criadoEm = this.criadoEm;
    dto.professorAuthId = this.professorAuthId;
    dto.professorNome = this.professorNome;
    dto.professorEmail = this.professorEmail;
    dto.professorAvatar = this.professorAvatar;
    dto.totalAlunos = this.totalAlunos;
    return dto;
  }
}
