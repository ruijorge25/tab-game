# **Requisitos da 1ª Entrega**



Aplicação de Página Única: Toda a aplicação deve estar numa única página HTML (sem carregar outras páginas). O layout gráfico (CSS) e o código JavaScript devem estar em ficheiros independentes e validados.



Seções da Interface: A página deve ter áreas distintas para: Logotipo, Configuração, Comandos, Identificação, Dado de Paus, Tabuleiro, Instruções, Classificações e Mensagens. Nem todas têm de estar visíveis em simultâneo; algumas podem sobrepor-se a outras.



Logotipo: Exibir o nome do jogo em destaque (por exemplo, “Tâb” ou outro nome escolhido). Pode ser texto estilizado ou imagem.



Configurações: Permitir ao jogador escolher opções do jogo: tamanho do tabuleiro (colunas ímpares entre 7 e 15, geralmente 9), jogar contra computador (obrigatório na 1ª entrega) ou outro jogador, quem começa, e nível da IA.



Comandos: A interação principal é com o tabuleiro, mas devem existir comandos adicionais, por exemplo:



\- Visualizar as instruções de jogo.

\- Iniciar o jogo com as configurações atuais.

\- Passar a vez (somente se não houver jogada válida).

\- Desistir do jogo (cedendo a vitória ao adversário).

\- Ver as classificações/placar de resultados.



Identificação: Espaço para o jogador inserir identificador e senha, mostrando depois o nome do utilizador e opção de terminar sessão. (Na 1ª entrega a autenticação não precisa ser funcional, mas o layout deve existir.)



Dado de Paus: Área onde o jogador lança o dado de paus antes de cada jogada. Ao clicar/lançar, mostrar o resultado (contagem das faces claras) representando 1,2,3,4 ou 6. Após cada jogada, o dado volta à posição inicial. O seu valor vai ser igual ao deslocamento das peças em questão.



Tabuleiro: Principal zona de jogo, com maior interatividade. Deve ter uma estrutura clara (linhas e casas) construída inicialmente em HTML/CSS. Na fase seguinte, o tabuleiro será gerado via JavaScript a partir de uma estrutura de dados, permitindo criar tabuleiros conforme configurações. Uma abordagem orientada a objetos é valorizada.



Modos de Jogo: A interação com o tabuleiro muda conforme o estado do jogo. Normalmente, basta clicar numa peça para movê-la de acordo com o valor do dado. No entanto, se uma peça estiver na 3ª linha, o próximo clique define a casa de destino (pode ir para 4ª ou 2ª linha). Use variáveis de estado para controlar o modo atual; indique-o ao jogador com cursor ou mensagens.



Instruções: Painel (que pode sobrepor-se) exibindo as regras do jogo e orientações de uso. Deve ter comandos para abrir e fechar este painel.



Classificações: Tabela com melhores resultados registrados. Na 1ª entrega, só serão considerados jogos contra a IA local. Em versões futuras (jogos contra outros jogadores), os dados virão do servidor.



Mensagens: Área para exibir notificações durante o jogo, por exemplo:



“É a vez do jogador X mover.”



“Formou-se uma linha! Capture uma peça do adversário.”



“Jogada inválida (é a vez do adversário).”



“Jogo terminado: X venceu.”



“Jogador X desistiu e perdeu.”



Inteligência Artificial (IA): Nesta fase inicial, o jogador só enfrenta o computador. Os movimentos do computador são calculados localmente: listar jogadas válidas e escolher uma aleatoriamente, ou preferir aquelas que resultem em capturas. Para níveis de dificuldade, pode-se alternar entre estratégias (aleatória ou priorizando capturas).



## **Regras do Jogo “Tâb”**



Tabuleiro: O jogo tem 4 linhas, com número de colunas ímpar entre 7 e 15 (normalmente 9).



Peças: Cada jogador tem N peças (N = número de colunas), todas de uma cor própria (diferente da do adversário), posicionadas na linha inicial de cada um. No seu tabuleiro, as peças do jogador ficam embaixo; para o adversário vê-se o mesmo tabuleiro rodado 180º. As peças têm estados diferentes: não movida ainda, movida e chegou à última linha, ou já esteve na última linha. Estes estados podem ser indicados, por exemplo, pela transparência das peças.



Dado de Paus: Em vez de um dado comum, usa-se um feixe de 4 paus de duas faces (lisa clara e arredondada escura). Para jogar, aperta-se os 4 paus juntos, depois solta-se a mão e conta-se quantos paus caíram com a face clara virada para cima: isso define o valor do dado (de 0 a 4 paus claros). Esse número de paus claros corresponde a:



0 claros → valor 6 (Sitteh, joga-se novamente).



1 claro → valor 1 (Tâb, joga-se novamente).



2 claros → valor 2 (Itneyn, sem jogada extra).



3 claros → valor 3 (Telâteh, sem jogada extra).



4 claros → valor 4 (Arba’ah, joga-se novamente).



(Não há resultado 5. As probabilidades aproximadas para os valores são: 6% para 6, 25% para 1, 38% para 2, 25% para 3, 6% para 4.) Cada valor indica quantas casas a peça escolhida deve avançar.



Movimentação das Peças: Antes de mover, deve-se lançar o dado de paus. As regras são:



Início do movimento: A primeira vez que cada peça se movimenta, o valor do dado deve ser 1 (Tâb). Se sair 4 ou 6 nesse primeiro lançamento, o jogador repete a jogada até obter 1. O destino da peça não pode ter outra peça da mesma cor. Por isso, ao começar, movimentam-se primeiro as peças mais à direita.



Percurso das peças: Em cada linha, as peças avançam em direções alternadas: na 1ª e 3ª linhas movem da esquerda para a direita; na 2ª e 4ª linhas, da direita para a esquerda. Ao sair da 1ª linha, uma peça entra na 2ª; da 2ª vai para a 3ª; da 3ª pode ir para a 4ª ou voltar para a 2ª; da 4ª volta para a 3ª. (Setas no tabuleiro podem ajudar a visualizar esses movimentos.)



Restrições: Só pode haver uma peça por casa. Cada peça só pode entrar na 4ª linha uma única vez. Uma peça na 4ª linha só se pode mover se nenhuma peça da sua cor permanecer na sua linha inicial (1ª linha). Nenhuma peça pode voltar à linha inicial do jogador após avançar.



Passar a vez: Se o valor do dado não permitir nenhuma jogada válida e não oferecer novo lançamento extra, o jogador deve passar a vez. Contudo, não é permitido passar a vez se houver alguma jogada possível ou a chance de lançar o dado novamente.



Captura de Peças: Se ao mover uma peça a casa de destino contiver uma peça adversária, essa peça é capturada e removida do tabuleiro.



Fim do Jogo: O jogo termina quando um jogador fica sem peças no tabuleiro. Nesse caso, o outro jogador vence.

