// src/typings.d.ts
declare namespace Express {
  namespace Multer {
    export interface File {
      name: string;
      size: number;
      type: string;
      // adicione as outras propriedades se necessário, 
      // mas o File do navegador só preencherá estas.
    }
  }
}