# 📿 Santo Rosário - PWA

> App Progressive Web App para rezar o Santo Rosário pelo Método de São Luís de Montfort

![Ícone do App](icon-192.png)

## ✨ Recursos

- 🙏 **Oração Guiada** - Mistérios Gozosos, Dolorosos e Gloriosos
- 📖 **Meditações de Montfort** - Reflexões profundas para cada Ave Maria
- 📅 **Calendário** - Acompanhe seus dias de oração
- 🔥 **Streak** - Mantenha sua sequência de dias rezando
- 📊 **Estatísticas** - Total de rosários, Ave Marias e Pai Nossos
- 🎨 **Avatares** - Personalize seu perfil
- 📱 **PWA** - Instale no celular como app nativo
- 🔄 **Offline** - Funciona sem internet
- 🔐 **Firebase** - Autenticação e sincronização

## 🚀 Instalação

### Para Usuários:

**Android (Chrome):**
1. Acesse o site
2. Menu ⋮ → "Instalar app"
3. Pronto! 🎉

**iPhone (Safari):**
1. Acesse o site
2. Compartilhar 📤 → "Adicionar à Tela Inicial"
3. Pronto! 🎉

### Para Desenvolvedores:

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/rosario-app.git
cd rosario-app

# 2. Configure o Firebase
# - Crie projeto em https://console.firebase.google.com
# - Ative Authentication (Email/Password)
# - Ative Realtime Database
# - Copie as credenciais para index.html

# 3. Deploy
firebase deploy --only hosting

# Ou use Netlify/Vercel (ver DEPLOY_RAPIDO.md)
```

## 📁 Estrutura

```
rosario-pwa/
├── index.html           # App principal
├── manifest.json        # Configuração PWA
├── sw.js               # Service Worker (offline)
├── favicon.ico         # Favicon do navegador
├── icon-*.png          # Ícones PWA (todos os tamanhos)
├── DEPLOY_RAPIDO.md    # Guia de deploy
├── INSTALACAO_PWA.md   # Guia completo PWA
└── ICONES_PWA.md       # Guia de ícones
```

## 🛠️ Tecnologias

- **HTML5 + CSS3** - Interface
- **JavaScript Vanilla** - Lógica do app
- **Firebase Auth** - Autenticação
- **Firebase Realtime Database** - Sincronização de dados
- **Service Worker** - Funcionalidade offline
- **PWA** - Instalável no celular

## 📖 Documentação

- [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md) - Deploy em 3 minutos
- [INSTALACAO_PWA.md](INSTALACAO_PWA.md) - Guia completo PWA
- [ICONES_PWA.md](ICONES_PWA.md) - Como criar ícones

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

## 🎨 Design

- **Cores:** Preto profundo (#080709) + Dourado (#d4a855)
- **Fontes:** Cinzel (títulos) + Cormorant Garamond (corpo)
- **Estilo:** Minimalista, elegante, contemplativo

## 🔐 Segurança

- ✅ HTTPS obrigatório
- ✅ Firebase Authentication
- ✅ Senhas criptografadas (bcrypt automático)
- ✅ Dados privados por usuário
- ✅ LGPD compliant

## 📱 Compatibilidade

- ✅ Chrome Android 90+
- ✅ Safari iOS 14+
- ✅ Chrome Desktop 90+
- ✅ Edge 90+
- ✅ Firefox 88+ (instalação limitada)

## 🐛 Reportar Problemas

Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/rosario-app/issues)

## 📄 Licença

MIT License - Use livremente para propagar a fé! 🙏

## 💖 Créditos

- **Método de Oração:** São Luís de Montfort
- **Desenvolvimento:** [Seu Nome]
- **Ícone:** Design próprio com mãos em oração

## 🌟 Apoie o Projeto

Se este app te ajudou na sua jornada de fé:

- ⭐ Dê uma estrela no GitHub
- 🙏 Reze um Pai Nosso pela intenção do desenvolvedor
- 📢 Compartilhe com outros católicos
- 💝 Doe para manutenção: [link de doação]

---

**Ad Majorem Dei Gloriam** ✨

Para maior glória de Deus!
