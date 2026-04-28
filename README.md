# 📿 Santo Rosário - PWA

> App Progressive Web App para rezar o Santo Rosário pelo Método de São Luís de Montfort

![Ícone do App](icon-192.png)

## ✨ Recursos

- 🙏 **Oração Guiada** - Mistérios Gozosos, Dolorosos e Gloriosos
- 📖 **Meditações de Montfort** - Reflexões profundas para cada Ave Maria
- 📅 **Calendário** - Acompanhe seus dias de oração
- 🔥 **Streak** - Mantenha sua sequência de dias rezando
- 📊 **Estatísticas** - Total de rosários, Ave Marias e Pai Nossos
- 🎨 **Avatares** - Personalize seu perfil (AGORA FUNCIONA!)
- 📱 **PWA** - Instale no celular como app nativo
- 🔄 **Offline** - Funciona sem internet
- 🔐 **Firebase** - Autenticação e sincronização segura

## 🚀 Instalação como PWA

### Para Usuários:

**Android (Chrome):**
1. Acesse o site no Chrome
2. Clique no menu ⋮ (três pontinhos)
3. Selecione "Instalar app" ou "Adicionar à tela inicial"
4. Confirme a instalação
5. Pronto! O app estará na sua tela inicial 🎉

**iPhone (Safari):**
1. Acesse o site no Safari
2. Toque no botão Compartilhar 📤 (na barra inferior)
3. Role e selecione "Adicionar à Tela Inicial"
4. Confirme tocando em "Adicionar"
5. Pronto! O app estará na sua tela inicial 🎉

**Desktop (Chrome/Edge):**
1. Acesse o site
2. Clique no ícone de instalação ➕ na barra de endereço
3. Ou vá em Menu → "Instalar Santo Rosário..."
4. Confirme a instalação
5. Pronto! O app abrirá em janela própria 🎉

## 📁 Tecnologias

- **HTML5 + CSS3** - Interface responsiva
- **JavaScript Vanilla** - Lógica do app (sem frameworks!)
- **Firebase Auth** - Autenticação segura
- **Firebase Realtime Database** - Sincronização de dados
- **Service Worker** - Funcionalidade offline
- **PWA** - Instalável no celular
- **Web Push** - Notificações diárias (via backend agendado)

## 🔔 Push Diário (Intenção + Mistério)

O app suporta Web Push diário para enviar:
- Mistério recomendado do dia
- Intenção diária

### Configuração rápida
1. Gere chaves VAPID no backend e publique a chave pública em `config.js` (`webPushPublicKey`).
2. Defina as variáveis de ambiente no deploy das funções:
   - `WEB_PUSH_PUBLIC_KEY`
   - `WEB_PUSH_PRIVATE_KEY`
   - `WEB_PUSH_SUBJECT` (opcional, ex.: `mailto:admin@rosario.app`)
3. Faça deploy da função `sendDailyRosaryPush` (pasta `functions/`).
4. No app, usuário ativa push no modal de configurações do perfil.

## 🙏 Orações Incluídas

- Sinal da Cruz
- Credo
- Pai Nosso
- Ave Maria
- Glória ao Pai
- Oração de Fátima
- Salve Rainha

## 📊 Meditações Montfort

Cada Ave Maria tem uma meditação específica de São Luís de Montfort:

### Mistérios Gozosos (Segunda e Sábado)
1. A Anunciação
2. A Visitação
3. O Nascimento de Jesus
4. A Apresentação no Templo
5. O Encontro no Templo

### Mistérios Dolorosos (Terça e Sexta)
1. A Agonia no Horto
2. A Flagelação
3. A Coroação de Espinhos
4. Jesus Carrega a Cruz
5. A Crucificação

### Mistérios Gloriosos (Quarta, Quinta e Domingo)
1. A Ressurreição
2. A Ascensão
3. A Vinda do Espírito Santo
4. A Assunção de Maria
5. A Coroação de Maria

## 📄 Licença

MIT License - Use livremente para propagar a fé! 🙏

## 💖 Créditos

- **Método de Oração:** São Luís de Montfort
- **Desenvolvimento:** Seu Nome
- **Ícone:** Editado do Made by Edgar


**Ad Majorem Dei Gloriam** ✨

Para maior glória de Deus!

## 📞 Contato

- instagram @guardioes.fe
