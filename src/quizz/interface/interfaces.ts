import { StatusEnum, TipoQuestaoEnum } from "../../auth/enum/enums";
import { StatusTentativaEnum } from "../../enums/status-tentativa.enum";
import { TurmaInterface } from "../../turmas/interface/turma.interface";
import { QuestaoDto } from "../dto/questao.dto";

export interface IOpcao {
  id?: string;
  questao_id: string;
  texto: string;
  is_correta: boolean;
  ordem: number;
}

export interface IQuestao {
  id?: string;
  quiz_id: string;
  tipo: TipoQuestaoEnum;
  enunciado: string;
  ordem: number;
  pontuacao_peso: number;
  configuracao: Record<string, any>;
  opcoes?: IOpcao[] | [];
}

export interface IQuiz {
  questoes: QuestaoDto[];
  id?: string | null;
  turma_id: string;
  titulo: string;
  data_conclusao?: Date | null;
  criado_em?: Date | null;
  atualizado_em?: Date | null;
  status: StatusEnum;
  turma?: any | null;
  totalTentativas?: number | null;
  tentativas?: any[] | null;

}

export interface ITentativa {
  id?: string;
  quiz_id: string;
  aluno_id: string;
  status: StatusTentativaEnum;
  nota_final?: number;
  iniciada_em?: Date;
  concluida_em?: Date;
  respostas: Record<string, any>;
}

export interface IResposta {
  questao_id?: string;
  resposta: string[] | Record<string, any>;
  tipo: TipoQuestaoEnum;
}

export interface IItemArrastavel {
  id: string;
  conteudo: string;
  zona_correta_id: string;
}