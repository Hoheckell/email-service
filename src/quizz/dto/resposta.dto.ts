import { TipoQuestaoEnum } from "../../auth/enum/enums";
import { IResposta } from "../interface/interfaces";

export class RespostaDto implements IResposta {
    questao_id?: string;
    resposta: string[] | Record<string, any>;
    tipo: TipoQuestaoEnum;

    static fromJson(json: any): RespostaDto {
        return {
            questao_id: json.questao_id,
            resposta: json.resposta,
            tipo: json.tipo,
        };
    }

    static fromRecord(resposta: Record<string, any>): RespostaDto {
        return {
            questao_id: resposta.id,
            resposta: resposta.resposta,
            tipo: resposta.tipo,
        };
    }
}
