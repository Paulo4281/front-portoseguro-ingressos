export const APIErrorHandler: Record<number, string> = {
    // INTERNAL
    1: "E-mail ou senha inválidos",
    2: "Senha atual incorreta",
    3: "E-mail já cadastrado",
    4: "Código de confirmação inválido",
    5: "Código para redefinição de senha já foi enviado",
    6: "E-mail não encontrado",
    7: "E-mail ainda não foi confirmado",
    8: "Já existe um cupom com este código para este evento",
    9: "Cupom inválido",
    10: "Este cupom não está mais ativo",
    11: "Este cupom já expirou",
    12: "Este cupom já atingiu o limite de uso",
    13: "Documento já cadastrado",
    14: "Ingresso não disponível para este dia do evento",
    15: "Ingresso não disponível para este tipo de ingresso",
    16: "Ingresso não disponível para este dia do evento e tipo de ingresso",
    17: "Ingresso não disponível para este evento",

    // EXTERNAL
    900: "Erro ao escrever a descrição do evento com IA",
    901: "Ocorreu algum erro ao tentar se autenticar com o Google",
    902: "Erro ao testar o pixel do Facebook",
    903: "Máximo de criações de descrição de evento com IA atingido hoje",
    904: "Ocorreu algum erro ao tentar escrever a descrição do evento com IA"
}