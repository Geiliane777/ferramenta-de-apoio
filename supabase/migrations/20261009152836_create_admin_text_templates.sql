/*
# Create editable text templates and first-admin access

1. New Tables
- `admin_users` stores the authenticated users allowed to edit the shared templates.
- `admin_users.user_id` identifies the account from Supabase Auth.
- `admin_users.created_at` records when administrative access was granted.
- `text_templates` stores the editable message templates used by the text generator.
- `text_templates.template_key` is the stable key used by the application.
- `text_templates.label` is the human-readable name shown in the admin screen.
- `text_templates.content` stores the message with its placeholders.
- `text_templates.updated_at` records the last save time.

2. Security
- Row-level security is enabled on both tables.
- Anyone can read text templates because the generator is a shared tool.
- Only users listed in `admin_users` can create, update, or delete templates.
- Administrative membership can only be read by the signed-in user for their own account.
- The first account created in Supabase Auth is automatically added as an administrator.

3. Important Notes
- Templates are shared across the application, so an administrator's changes affect future generated messages for everyone.
- No existing tables or user data are changed or removed.
*/

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.text_templates (
  template_key text PRIMARY KEY,
  label text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.text_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_read_own_access" ON public.admin_users;
CREATE POLICY "admins_read_own_access" ON public.admin_users
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "public_read_templates" ON public.text_templates;
CREATE POLICY "public_read_templates" ON public.text_templates
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admins_insert_templates" ON public.text_templates;
CREATE POLICY "admins_insert_templates" ON public.text_templates
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_update_templates" ON public.text_templates;
CREATE POLICY "admins_update_templates" ON public.text_templates
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_delete_templates" ON public.text_templates;
CREATE POLICY "admins_delete_templates" ON public.text_templates
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.grant_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    INSERT INTO public.admin_users (user_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_first_admin() FROM PUBLIC;

DROP TRIGGER IF EXISTS grant_first_admin_after_signup ON auth.users;
CREATE TRIGGER grant_first_admin_after_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_first_admin();

-- Configurações de texto da interface. O CSS continua responsável pela aparência.
CREATE TABLE IF NOT EXISTS public.app_settings (
  setting_key text PRIMARY KEY,
  label text NOT NULL,
  setting_value text NOT NULL,
  multiline boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;

DROP POLICY IF EXISTS "public_read_app_settings" ON public.app_settings;
CREATE POLICY "public_read_app_settings" ON public.app_settings
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admins_insert_app_settings" ON public.app_settings;
CREATE POLICY "admins_insert_app_settings" ON public.app_settings
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_update_app_settings" ON public.app_settings;
CREATE POLICY "admins_update_app_settings" ON public.app_settings
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_delete_app_settings" ON public.app_settings;
CREATE POLICY "admins_delete_app_settings" ON public.app_settings
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Inserir valores iniciais somente quando a chave ainda não existir.
-- Assim, executar novamente a migração não sobrescreve mudanças já salvas.
INSERT INTO public.app_settings (setting_key, label, setting_value, multiline) VALUES
  ('app.document_title', 'Título do navegador', 'Ferramentas de Apoio — OdontoGroup', false),
  ('nav.brand_subtitle', 'Subtítulo da marca no menu', 'Ferramentas de Apoio', false),
  ('nav.section_label', 'Título do menu', 'Ferramentas', false),
  ('nav.generator', 'Menu: Gerador de textos', 'Gerador de textos', false),
  ('nav.prorata', 'Menu: Calcular pró-rata', 'Calcular pró-rata', false),
  ('nav.multa', 'Menu: Calcular multa', 'Calcular multa', false),
  ('nav.abrangencias', 'Menu: Abrangências', 'Abrangências', false),
  ('nav.network', 'Menu: Redes credenciadas', 'Redes credenciadas', false),
  ('nav.admin', 'Menu: Administração', 'Administração', false),
  ('nav.theme', 'Texto do seletor de tema', 'Modo escuro', false),
  ('page.generator.title', 'Título: Gerador de textos', 'Gerador de textos', false),
  ('page.generator.subtitle', 'Descrição: Gerador de textos', 'Preencha os campos para gerar a mensagem personalizada.', false),
  ('page.prorata.title', 'Título: Calculadora de pró-rata', 'Calculadora de pró-rata', false),
  ('page.prorata.subtitle', 'Descrição: Calculadora de pró-rata', 'Calcule o valor proporcional por dias utilizados.', false),
  ('page.multa.title', 'Título: Calculadora de multa', 'Calculadora de multa contratual', false),
  ('page.multa.subtitle', 'Descrição: Calculadora de multa', 'Calcule a multa de rescisão com base nos meses restantes.', false),
  ('page.abrangencias.title', 'Título: Abrangências', 'Abrangências dos planos', false),
  ('page.abrangencias.subtitle', 'Descrição: Abrangências', 'Consulte os detalhes de cobertura pelo código do produto (Registro ANS).', false),
  ('page.admin.title', 'Título: Administração', 'Administração', false),
  ('page.admin.subtitle', 'Descrição: Administração', 'Atualize os textos que aparecem no gerador sem alterar a página.', false),
  ('purpose.placeholder', 'Opção inicial do campo Finalidade', '— Selecione um tópico —', false),
  ('form.name.label', 'Campo: Nome do cliente', 'Nome do cliente', false),
  ('form.name.placeholder', 'Exemplo do nome do cliente', 'Ex: Ana Paula Silveira', false),
  ('form.protocol.label', 'Campo: Número do protocolo', 'Número do protocolo', false),
  ('form.protocol.placeholder', 'Exemplo do protocolo', 'Somente números', false),
  ('form.purpose.label', 'Campo: Finalidade', 'Finalidade', false),
  ('form.phone.label', 'Campo: Telefone cadastrado', 'Telefone cadastrado', false),
  ('form.phone.placeholder', 'Exemplo do telefone cadastrado', 'Ex: (61) 99999-0000', false),
  ('form.cancel.vigencia.label', 'Pergunta: Vigência mínima', 'Vigência mínima de 12 meses cumprida?', false),
  ('form.cancel.vigencia.yes', 'Opção: Vigência cumprida', 'Sim — sem multa', false),
  ('form.cancel.vigencia.no', 'Opção: Vigência não cumprida', 'Não — com multa', false),
  ('form.cancel.mensalidades.label', 'Pergunta: Mensalidades em aberto', 'Mensalidades em aberto?', false),
  ('form.cancel.mensalidades.yes', 'Opção: Existem mensalidades em aberto', 'Sim — em aberto', false),
  ('form.cancel.mensalidades.no', 'Opção: Não existem mensalidades em aberto', 'Não — em dia', false),
  ('form.cancel.mes.label', 'Campo: Mês da última mensalidade', 'Mês da última mensalidade devida', false),
  ('form.cancel.mes.placeholder', 'Exemplo do mês da última mensalidade', 'Ex: março/2025', false),
  ('form.gender.label', 'Campo: Sexo', 'Sexo', false),
  ('form.gender.male', 'Opção de sexo: Masculino', 'Masculino', false),
  ('form.gender.female', 'Opção de sexo: Feminino', 'Feminino', false),
  ('form.gender.neutral', 'Opção de sexo: Não sei', 'Não sei', false),
  ('form.agendamento.specialty.label', 'Campo: Especialidade', 'Especialidade', false),
  ('form.agendamento.specialty.placeholder', 'Exemplo da especialidade', 'Ex: Ortodontia, Endodontia...', false),
  ('form.agendamento.datetime.label', 'Campo: Data e hora', 'Data e Hora', false),
  ('form.agendamento.datetime.placeholder', 'Exemplo da data e hora', 'Ex: 15/07/2025 às 14h30', false),
  ('form.agendamento.clinic.label', 'Campo: Clínica', 'Clínica (informações completas)', false),
  ('form.agendamento.clinic.placeholder', 'Exemplo dos dados da clínica', 'Ex: Oral Plus Ltda
Endereço: Av João Isper Gebrim, 457
Bairro: Formosinha
Cep: 73813-210
Município: Formosa
Uf: Goias
Celular: (61)3631.5471', true),
  ('calc.prorata.value.label', 'Pró-rata: campo valor do plano', 'Valor total do plano (R$)', false),
  ('calc.prorata.value.placeholder', 'Pró-rata: exemplo do valor do plano', 'Ex: 89.90', false),
  ('calc.prorata.days.label', 'Pró-rata: campo quantidade de dias', 'Quantidade de dias (1–31)', false),
  ('calc.prorata.days.placeholder', 'Pró-rata: exemplo de quantidade de dias', 'Ex: 15', false),
  ('calc.multa.value.label', 'Multa: campo valor da mensalidade', 'Valor da mensalidade (R$)', false),
  ('calc.multa.value.placeholder', 'Multa: exemplo de valor', 'Ex: 59.90', false),
  ('calc.multa.months.label', 'Multa: campo meses restantes', 'Meses restantes no contrato', false),
  ('calc.multa.months.placeholder', 'Multa: exemplo de meses restantes', 'Ex: 8', false),
  ('calc.abrangencias.code.label', 'Abrangências: campo código do produto', 'Código do produto (Registro ANS)', false),
  ('calc.abrangencias.code.placeholder', 'Abrangências: exemplo de código', 'Ex: 473269153', false),
  ('button.generate', 'Botão: Gerar texto', 'Gerar texto', false),
  ('button.calculate', 'Botão: Calcular', 'Calcular', false),
  ('button.consult_plan', 'Botão: Consultar plano', 'Consultar plano', false),
  ('button.copy_text', 'Botão: Copiar texto', 'Copiar texto', false),
  ('result.label', 'Texto do indicador de resultado', 'Resultado', false),
  ('generator.result.initial', 'Mensagem inicial do resultado do gerador', 'Preencha os campos acima e clique em "Gerar texto".', false),
  ('calculator.prorata.result.initial', 'Mensagem inicial do resultado do pró-rata', 'Digite os valores acima para calcular o valor proporcional.', false),
  ('calculator.multa.result.initial', 'Mensagem inicial do resultado da multa', 'Digite os valores acima para calcular a multa.', false),
  ('calculator.abrangencias.result.initial', 'Mensagem inicial do resultado de abrangências', 'Digite o código do produto para consultar.', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Migrar os 22 modelos que antes estavam escritos diretamente no script.js.
-- ON CONFLICT DO NOTHING preserva modelos que já tenham sido editados no Supabase.
INSERT INTO public.text_templates (template_key, label, content) VALUES
  ('tentativaContato', 'Tentativa de contato', 'Título: ODONTOGROUP - TENTATIVA DE CONTATO

{gender} {name}, {greeting}!

Tentamos contato através do telefone {phone}, porém não obtivemos sucesso.
Por gentileza, entre em contato com a nossa central de atendimento o mais breve possível referente à sua solicitação do protocolo de atendimento n.º {protocol}.'),
  ('acusamosRecebimento', 'Acusar recebimento', '{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação por meio do protocolo de n.º {protocol}, iremos verificar as informações relatadas e em breve retornaremos com mais informações.'),
  ('comprovanteCancelamento', 'Comprovante de cancelamento', 'Título: ODONTOGROUP - COMPROVANTE DE CANCELAMENTO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada através do protocolo de n.º {protocol}, segue em anexo o comprovante de cancelamento do contrato.'),
  ('acusacaoReembolso', 'Acusar recebimento — reembolso', '{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação através do protocolo de n.º {protocol} e informamos que a documentação foi direcionada ao setor responsável para análise.
Em breve retornaremos o contato com mais informações.'),
  ('envioRedes', 'Envio de redes', 'Título: ODONTOGROUP - REDES DE ATENDIMENTO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada sob protocolo de n° {protocol}, seguem abaixo redes de atendimento conforme solicitado.

(indicação de rede)

Orientamos que entre em contato com as clínicas para realizar o agendamento de consulta, caso tenha dificuldade em realizar o contato junto as clínicas, entre em contato com a nossa central de atendimento para que possamos lhe auxiliar.'),
  ('agendamento', 'Agendamento de consulta', 'Título: ODONTOGROUP - AGENDAMENTO DE CONSULTA

{gender} {name}, {greeting}!

Em atendimento à sua solicitação, realizada sob protocolo de n° {protocol}, listamos abaixo as informações referentes ao agendamento de sua consulta:

Avaliação - {agendEspecialidade}
Dia: {agendDataHora}
Clínica: {agendClinica}

Por gentileza, chegue à consulta com antecedência de 10 minutos e leve raio-x, caso possua, isso facilita o seu atendimento.

Obs.: Caso não consiga comparecer ao agendamento informado acima, na data e horário marcado, por gentileza, orientamos que entre em contato diretamente com a clínica para realizar o reagendamento de sua consulta no prazo indicado (24horas de antecedência).'),
  ('carteirinha', 'Carteirinha', 'Título: ODONTOGROUP - CARTEIRINHA

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada por meio do protocolo de n.º {protocol}, segue em anexo sua carteirinha virtual do plano odontológico.

Baixe nosso aplicativo para acessá-la de forma simples e online. 
Caso ainda não possua nosso aplicativo, basta buscar por "OdontoGroup Associado" na loja de aplicativos do seu dispositivo celular e realizar o primeiro acesso.'),
  ('semCPF', 'Solicitar o CPF', 'Prezado(a) cliente, {greeting}!

Acusamos o recebimento da sua solicitação e para que possamos localizar o seu contrato, informe-nos seu nome completo, CPF e telefone.'),
  ('formularioReembolso', 'Formulário de reembolso', 'Título: ODONTOGROUP - FORMULÁRIO DE REQUISIÇÃO DE REEMBOLSO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada sob protocolo n.º{protocol}, informamos que conforme as diretrizes contratuais, o reembolso é realizado de forma tabelada, ou seja, de acordo com o valor disposto na tabela de reembolso do seu plano, informo que essa tabela está disponível pelo portal SEBRAE.
Ressaltamos que o tratamento deve estar compreendido na cobertura do seu plano odontológico para que seja possível reembolsar.
Documentação necessária para análise:
Formulário de Requisição de Reembolso (FRR), o mesmo é enviado pela operadora, e deve ser devolvido devidamente preenchido em todos os campos, com a seção médica assinada e carimbada pelo cirurgião-dentista responsável;
Documentação radiográfica (pré e pós-operatória);
Nota fiscal ou recibo original, emitido pelo profissional executante, com discriminação dos valores;
Comprovante de pagamento (comprovante de cartão, extrato bancário ou comprovante de transferência/PIX).
Processamento:
O prazo para análise e eventual liberação do reembolso será de até 30 dias úteis contados a partir da recepção de toda a documentação em conformidade com os requisitos.
Ressaltamos que a incompletude documental ou irregularidades nos comprovantes implicarão na suspensão do processo até a devida regularização.'),
  ('boleto', 'Envio de boleto', 'Título: ODONTOGROUP - BOLETO

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada através do protocolo de n.º {protocol}, segue em anexo o boleto referente ao período solicitado.'),
  ('guiaContratual', 'Guia de leitura contratual', 'Título: ODONTOGROUP - GUIA DE LEITURA CONTRATUAL

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada por meio do protocolo de n.º {protocol}, segue em anexo o Guia de Leitura Contratual contendo todas as informações referente ao produto contratado, inclusive a cobertura do plano odontológico.'),
  ('exclusaoProposta', 'Exclusão de proposta', 'Título: ODONTOGROUP - EXCLUSÃO DE PROPOSTA

Prezados, {greeting}!

Conforme atendimento realizado através do protocolo de n.º {protocol}, por gentileza, efetuar o cancelamento da proposta em aberto nos dados abaixo:

Nome: [NOME COMPLETO]
CPF: [CPF]'),
  ('demonstrativoIR', 'Demonstrativo IR — PF', 'Título: ODONTOGROUP - DEMONSTRATIVO PARA IMPOSTO DE RENDA

{gender} {name}, {greeting}!

Em atenção à sua solicitação realizada por meio do protocolo de n.º {protocol}, segue em anexo o demonstrativo para comprovação de imposto de renda referente ao ano de 2025. 

Acrescentamos que o demonstrativo também está disponível em nosso aplicativo "OdontoGroup – Associado".'),
  ('demonstrativoPJ', 'Demonstrativo IR — PJ', 'Título: ODONTOGROUP - DEMONSTRATIVO PARA IMPOSTO DE RENDA - PJ

{gender} {name}, {greeting}!

Em atendimento à sua solicitação realizada por meio do protocolo de n.º {protocol}, informamos que, por se tratar de um plano empresarial, o seu demonstrativo para Imposto de Renda deve ser solicitado diretamente ao setor de Recursos Humanos (RH) da empresa xxxxxxxxxxxxx.

Isso ocorre porque, nessa modalidade de contrato, os valores relacionados ao plano são administrados e registrados pela própria empresa responsável pelo convênio, que possui acesso ao detalhamento das contribuições utilizadas para fins de declaração.
Dessa forma, orientamos que entre em contato com a empresa/sindicato/órgão para solicitar o documento ou obter as orientações necessárias para emissão do demonstrativo.'),
  ('alteracaoPlano', 'Acusar recebimento — inclusão GDF', 'Título: ODONTOGROUP - INCLUSÃO GDF

{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação por meio do protocolo de n.º {protocol} e informamos que a documentação encaminhada foi devidamente direcionada ao setor responsável para análise e finalização do processo.

Esclarecemos que, a partir do primeiro dia do mês seguinte, a inclusão estará vigente em seu cadastro e o plano poderá ser utilizado normalmente, conforme as regras e diretrizes do seu plano odontológico.'),
  ('contratoNovo', 'Informações sobre o plano (contrato novo)', 'Título: ODONTOGROUP - INFORMAÇÕES SOBRE O PLANO

{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação por meio do protocolo de n.º {protocol} e informamos que o início de vigência do seu plano está previsto para o dia XXXXX. A partir desta data, o acesso ao aplicativo estará liberado, permitindo a consulta detalhada dos serviços contratados, bem como demais funcionalidades disponíveis para o seu plano.

Adicionalmente, informamos que, em breve, nossa equipe de boas-vindas entrará em contato para confirmar os seus dados cadastrais e fornecer todas as orientações necessárias sobre os benefícios contratados, garantindo que você aproveite ao máximo tudo o que o plano oferece.'),
  ('solicitaCancelamento', 'Solicitação de cancelamento', 'Título: ODONTOGROUP - SOLICITAÇÃO DE CANCELAMENTO

{gender} {name}, {greeting}!

Acusamos o recebimento da sua manifestação por meio do WhatsApp, sob protocolo de n.º {protocol} e informamos que sua solicitação de cancelamento foi devidamente registrada e direcionada ao setor responsável para análise e providências.

O setor responsável de cancelamento realizará contato em até 3 dias úteis, para conclusão da solicitação e formalização do cancelamento.

Antecipamos que o plano possui uma vigência mínima de 12 meses, portanto {multa}

{mensalidade}

Caso seja de seu interesse, podemos encaminhar um boleto bancário com vencimento em até 5 dias a contar da data de hoje, ou, alternativamente, realizar uma nova tentativa de cobrança no cartão de crédito previamente cadastrado. Se preferir efetuar o pagamento utilizando outro cartão de crédito, também podemos encaminhar um link de pagamento para que a transação seja realizada de forma rápida e segura.'),
  ('coberturaTomo', 'Cobertura do plano — tomografia', 'Título: ODONTOGROUP - COBERTURA DO PLANO

{gender} {name}, {greeting}!

Em atendimento à sua solicitação registrada por meio do protocolo de n.º {protocol}, informamos que, conforme as regras contratuais do seu plano, não há cobertura para a realização de tomografia.

Ressaltamos, contudo, que o seu plano contempla a cobertura de diversos procedimentos odontológicos, tais como: restaurações, profilaxia (limpeza), atendimentos em odontopediatria, extração de sisos, exames radiológicos convencionais, tratamento de canal (endodontia), pino, coroa, entre outros procedimentos previstos em contrato.

Para consultar a relação completa de procedimentos cobertos, orientamos que realize a verificação por meio do nosso aplicativo ou pelo portal do beneficiário em nosso site, seguindo os caminhos abaixo:

Aplicativo:
Página inicial > último ícone no canto inferior direito da tela > Meu Plano > Cobertura.
Site:
Acesse: https://odontogroup.s4e.com.br/sys/?TipoUsuario=1
Em seguida: insira seu CPF e senha (a mesma utilizada no aplicativo) > Portal de Informações > Cobertura/Carência.'),
  ('inclusaoDepGDFC', 'Inclusão de dependentes — GDF', 'Título: ODONTOGROUP - INCLUSÃO DE DEPENDENTES GDF

{gender} {name}, {greeting}!

Acusamos o recebimento da sua solicitação, realizada por meio do protocolo de n.º {protocol} e inicialmente gostaríamos de esclarecer que o ressarcimento de 99% do valor do plano escolhido (limitado a R$ 30,00) é válido somente para o titular, conforme prevê o edital.

Os dependentes não receberão o ressarcimento do GDF, porém o valor para inclusão de dependentes no contrato GDF é abaixo do valor comercializado de forma particular, além dos dependentes inclusos entrarem também sem carência para nenhum procedimento.

Conforme previsto no edital, podem ser dependentes:

O(a) cônjuge ou o(a) companheiro(a), desde que não preencha os requisitos para ser beneficiário titular;
O(a) filho(a) solteiro(a) e não emancipado(a), o(a) tutelado(a) e o(a) enteado(a) menor de 21 anos, ou filho(a) estudante universitário(a) até 24 anos, e filhos(as) inválidos(as).

Que podem optar por quatro modalidades de plano, sendo eles:

Odonto Clínico: Possui cobertura para mais de 200 procedimentos, como por exemplo: restaurações, limpeza, odontopediatria, extração de siso, radiologia, canal, bloco, pino e coroa total em cerômero para os dentes da frente de canino.
Valor para o titular: R$ 0,30 (ressarcimento de R$ 29,70 realizado pelo GDF).
Valor por dependente: R$ 22,90.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Odonto Doc: Possui toda cobertura do plano Odonto Clínico, além da documentação inicial, final e a instalação do aparelho fixo metálico convencional.
Valor para o titular: R$ 2,90 (ressarcimento de R$ 30,00 realizado pelo GDF).
Valor por dependente: R$ 32,90.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Odonto Prótese: Possui toda cobertura do plano Odonto Clínico, além da placa de bruxismo, clareamento convencional, coroas unitárias em resina para todos os dentes, prótese parcial removível com grampo, prótese parcial removível provisória e a prótese total.
Valor para o titular: R$ 59,90 (ressarcimento de R$ 30,00 realizado pelo GDF).
Valor por dependente: R$ 89,90.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Odonto Orto: Possui toda a cobertura do Odonto Doc, além das manutenções mensais do aparelho e o clareamento caseiro convencional após a retirada do aparelho.
Valor para o titular: R$ 80,00 (ressarcimento de R$ 30,00 realizado pelo GDF).
Valor por dependente: R$ 110,00.
Abrangência Titular: Nacional.
Abrangência Dependente: AL, DF, GO, PE e TO.

Caso deseje prosseguir com a inclusão, por gentileza, preencha corretamente o formulário de inclusão de dependentes que segue em anexo.

Destacamos que novas inclusões de dependentes em planos já ativos, tem seu início de vigência sempre para o mês seguinte.
Reforçamos que todos os planos ofertados possuem a vigência padrão de 12 meses, sendo necessário permanecer ativo durante o período de vigência. Após os 12 meses, caso possua interesse em cancelar o plano, é necessário entrar em contato conosco.'),
  ('envioToken', 'Envio de token', 'Título: ODONTOGROUP - ENVIO DE TOKEN

{gender} {name}, {greeting}!

Em atenção à sua solicitação, registrada por meio do protocolo nº {protocol}, encaminhamos abaixo o link contendo o token de acesso, por meio do qual será possível realizar a alteração ou atualização do cartão de crédito utilizado para o pagamento das mensalidades do seu plano odontológico:

XXXXXXXXXXXX

Orientamos que o procedimento seja realizado dentro do prazo de validade do token, a fim de garantir o cadastro em tempo hábil.

Ressaltamos que o cartão de crédito informado deve, obrigatoriamente, estar em nome do atual responsável financeiro do contrato, em conformidade com as cláusulas contratuais e com a LGPD.'),
  ('envioProtocolo', 'Envio de protocolo', 'Título: ODONTOGROUP - ENVIO DE PROTOCOLO

{gender} {name}, {greeting}!

Em atendimento à sua solicitação, informamos que o número de protocolo referente ao seu atendimento é nº {protocol}.

Salientamos que este número deve ser utilizado como referência em eventuais contatos futuros, possibilitando maior agilidade na localização e acompanhamento da sua solicitação.'),
  ('posVendas', 'Boas-vindas pós-vendas', 'Título: ODONTOGROUP - BOAS-VINDAS PÓS-VENDAS

{gender} {name}, {greeting}!

Seja muito bem-vindo(a) ao nosso plano odontológico! Parabenizamos você por essa excelente escolha. Estamos à disposição para acompanhá-lo(a) em toda a sua jornada conosco.
 
Caso tenha dúvidas ou precise de qualquer informação, nosso Serviço de Atendimento ao Cliente (SAC) está preparado para atendê-lo(a) com atenção e cuidado. Será um prazer falar com você.
 
Informamos que tentamos contato por telefone, por meio do número xxxxxxxxxxxx, porém, infelizmente, não obtivemos sucesso.
 
Anexamos a este e-mail o Guia de Leitura Contratual, que contém todas as informações importantes sobre o plano contratado, incluindo:
 
- Detalhamento da cobertura do seu plano;
- Vigência contratual de 12 meses;
- Cláusula de multa rescisória de 20% sobre as parcelas vincendas, conforme estipulado em contrato; Renovação automática.
- Informações sobre os prazos de carência, contados a partir de:
 
Protocolo de atendimento: {protocol}.')
ON CONFLICT (template_key) DO NOTHING;

-- Dados de abrangência dos produtos passam a ser mantidos no banco, não no JavaScript.
CREATE TABLE IF NOT EXISTS public.plan_details (
  product_code text PRIMARY KEY,
  content text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plan_details ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.plan_details TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.plan_details TO authenticated;

DROP POLICY IF EXISTS "public_read_plan_details" ON public.plan_details;
CREATE POLICY "public_read_plan_details" ON public.plan_details
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admins_insert_plan_details" ON public.plan_details;
CREATE POLICY "admins_insert_plan_details" ON public.plan_details
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_update_plan_details" ON public.plan_details;
CREATE POLICY "admins_update_plan_details" ON public.plan_details
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_delete_plan_details" ON public.plan_details;
CREATE POLICY "admins_delete_plan_details" ON public.plan_details
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Migra os códigos e conteúdos existentes; códigos já cadastrados são preservados.
INSERT INTO public.plan_details (product_code, content) VALUES
  ('411630995', 'Grupo de estados. | Abrangência: AL, BA, DF, GO, MG, PE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Coletivo empresarial.'),
  ('702168992', 'Grupo de estados. | Abrangência: AL, BA, DF, GO, MG, PE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Coletivo empresarial.'),
  ('473269153', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Coletivo empresarial.'),
  ('468299128', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Manutenção. | Contratação: Coletivo empresarial.'),
  ('486254206', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho. | Contratação: Coletivo empresarial.'),
  ('486113202', 'Nacional. | Abrangência: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Manutenção+Prótese. | Contratação: Coletivo empresarial.'),
  ('486114201', 'Nacional. | Abrangência: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Com Prótese. | Contratação: Coletivo empresarial.'),
  ('481366189', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RJ, RN, RS, SE, SP e TO. | Formação de preço: Misto. | Fator moderador: Não tem. | Rol: Emergência RN 59. | Contratação: Coletivo empresarial.'),
  ('442562036', 'Nacional. | Abrangência: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Coletivo empresarial.'),
  ('437337025', 'Grupo de estados. | Abrangência: DF, GO, TO, PE, AL. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Coletivo empresarial.'),
  ('476630160', 'Nome Comercial: Coletivo Adesão Bronze II. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Municipal. | Situação: Ativo. | Atuação: Brasília (DF). | Formação de preço: Pré-estabelecido. | Fator moderador: Franquia. | Rol: Com Prótese.'),
  ('468297121', 'Nome Comercial: Coletivo Adesão Mais II.B. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Grupo de Estados. | Situação: Ativo. | Atuação: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE, TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Doc+Aparelho+Manutenção.'),
  ('484268195', 'Nome Comercial: Essencial Odonto Brasília CA. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Municipal. | Situação: Ativo. | Atuação: Brasília (DF). | Formação de preço: Pré-estabelecido. | Fator moderador: Co-participação. | Rol: Mínimo ANS.'),
  ('471297148', 'Nome Comercial: FR Clínico Por Adesão II.B (Single). | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Grupo de Estados. | Situação: Ativo. | Atuação: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE, TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Franquia. | Rol: Mínimo ANS.'),
  ('496043232', 'Nome Comercial: Master Especial Premium CA. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Nacional. | Situação: Ativo. | Atuação: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Manutenção+Prótese+Clareamento+Implante.'),
  ('474865154', 'Nome Comercial: Master Especial. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Nacional. | Situação: Ativo. | Atuação: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Co-participação. | Rol: Doc Orto+Aparelho+Manutenção+Prótese+Clareamento.'),
  ('489270214', 'Nome Comercial: Odonto Doc CA. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Nacional. | Situação: Ativo. | Atuação: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho.'),
  ('489269211', 'Nome Comercial: Odonto Doc Premium CA. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Nacional. | Situação: Ativo. | Atuação: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Prótese.'),
  ('489285212', 'Nome Comercial: Odonto Orto CA. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Nacional. | Situação: Ativo. | Atuação: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Manutenção+Prótese.'),
  ('489327211', 'Nome Comercial: Odonto Orto Premium CA. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Nacional. | Situação: Ativo. | Atuação: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Manutenção+Prótese.'),
  ('481954183', 'Nome Comercial: Odonto SOS CA. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Grupo de Estados. | Situação: Ativo. | Atuação: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RJ, RN, RS, SE, SP, TO. | Formação de preço: Misto. | Fator moderador: Não tem. | Rol: Emergência RN 59.'),
  ('467608124', 'Nome Comercial: Odontoclínico Coletivo II.B. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Grupo de Estados. | Situação: Ativo. | Atuação: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE, TO. | Formação de preço: Pré-Estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS.'),
  ('442559036', 'Nome Comercial: Odontoclínico Coletivo por Adesão. | Contratação: Coletivo por Adesão. | Abrangência Geográfica: Nacional. | Situação: Ativo. | Atuação: Nacional. | Formação de preço: Pré-Estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS.'),
  ('442561038', 'Nacional. | Abrangência: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Co-participação. | Rol: Documentação orto+Aparelho+Manutenções. | Contratação: Individual ou Familiar.'),
  ('411629991', 'Grupo de estados. | Abrangência: AL, BA, DF, GO, MG, PE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Individual ou familiar.'),
  ('473268155', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Individual ou familiar.'),
  ('468461133', 'Municipal. | Abrangência: Maceió (AL), Manaus (AM), Salvador (BA), Fortaleza (CE), Brasília (DF), Goiânia (GO). | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Manutenção. | Contratação: Individual ou familiar.'),
  ('484937200', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Doc orto+Aparelho. | Contratação: Individual ou familiar.'),
  ('485957200', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Individual ou familiar.'),
  ('485502207', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Orto Doc+Aparelho+Manutenção+Clareamento. | Contratação: Individual ou familiar.'),
  ('485086206', 'Grupo de estados. | Abrangência: AL, AM, BA, CE, DF, GO, MA, MG, MS, MT, PA, PB, PE, PI, RN, SE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Prótese+Placa oclusal. | Contratação: Individual ou familiar.'),
  ('459559099', 'Municipal. | Abrangência: Brasília (DF), Goiânia (GO), Recife (PE) ou Maceió (AL). | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Individual ou familiar.'),
  ('442560030', 'Nacional. | Abrangência: Nacional. | Formação de preço: Pré-estabelecido. | Fator moderador: Co-participação. | Rol: Mínimo ANS. | Contratação: Individual ou familiar.'),
  ('411631993', 'Grupo de estados. | Abrangência: AL, BA, DF, GO, MG, PE e TO. | Formação de preço: Pré-estabelecido. | Fator moderador: Não tem. | Rol: Mínimo ANS. | Contratação: Individual ou familiar.'),
  ('496805231', 'Nacional. | Nome Comercial: Odonto Doc NA. | Abrangência: Nacional. | Fator moderador: Não tem. | Rol: Instalação do Aparelho+Documentação. | Contratação: Individual ou Familiar.')
ON CONFLICT (product_code) DO NOTHING;
