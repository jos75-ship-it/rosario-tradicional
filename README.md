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

## 🛠️ Para Desenvolvedores:

### Instalação Local:

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/rosario-app.git
cd rosario-app

# 2. Configure o Firebase
# Crie um projeto em https://console.firebase.google.com
# Ative Authentication (Email/Password)
# Ative Realtime Database com as seguintes regras:
```

**Regras do Realtime Database:**
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

```bash
# 3. Configure suas credenciais
# Edite o arquivo config.js e adicione suas credenciais do Firebase
# IMPORTANTE: Adicione config.js ao .gitignore!

# 4. Crie os ícones PWA
# Use um gerador online como https://realfavicongenerator.net/
# Ou use o script fornecido em ICONES_PWA.md

# 5. Sirva localmente
# Você pode usar qualquer servidor HTTP local:
python -m http.server 8000
# ou
npx serve
# ou
php -S localhost:8000

# 6. Acesse no navegador
# http://localhost:8000

# 7. Deploy
# Use Firebase Hosting, Netlify, Vercel ou GitHub Pages
firebase deploy --only hosting
# ou
netlify deploy --prod
# ou
vercel --prod
```

### Estrutura de Arquivos:

```
rosario-pwa/
├── index.html              # App principal com toda a UI
├── app.js                  # Lógica da aplicação
├── config.js              # Configuração Firebase (NÃO VERSIONAR!)
├── manifest.json          # Configuração PWA
├── sw.js                  # Service Worker (offline)
├── .gitignore             # Ignora arquivos sensíveis
├── .env.example           # Exemplo de variáveis de ambiente
├── favicon.ico            # Favicon do navegador
├── icon-*.png             # Ícones PWA (vários tamanhos)
├── README.md              # Este arquivo
├── DEPLOY_RAPIDO.md       # Guia de deploy
├── INSTALACAO_PWA.md      # Guia completo PWA
└── ICONES_PWA.md          # Guia de ícones
```

## 🔐 Segurança da API Firebase

### ⚠️ IMPORTANTE - Proteção da API Key:

A API key do Firebase está agora separada em `config.js`, que **NÃO deve ser versionado**. 

**Passos de segurança:**

1. **Nunca commite o arquivo `config.js`** (já está no .gitignore)
2. Use variáveis de ambiente em produção
3. Configure as regras de segurança do Firebase corretamente
4. Restrinja o domínio autorizado no console do Firebase

**Para produção, use variáveis de ambiente:**

```javascript
// Em produção, carregue do ambiente:
export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // ... resto das configurações
};
```

### Regras de Segurança Firebase:

**Authentication:**
- Apenas Email/Password habilitado
- Senhas com mínimo 6 caracteres

**Realtime Database:**
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['username', 'displayName', 'avatar'])"
      }
    }
  }
}
```

## 📁 Tecnologias

- **HTML5 + CSS3** - Interface responsiva
- **JavaScript Vanilla** - Lógica do app (sem frameworks!)
- **Firebase Auth** - Autenticação segura
- **Firebase Realtime Database** - Sincronização de dados
- **Service Worker** - Funcionalidade offline
- **PWA** - Instalável no celular

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

## 🔧 Correções Implementadas

### ✅ Sistema de Avatares
- **Problema:** Não estava salvando/carregando avatares
- **Solução:** Corrigido o fluxo de salvamento e carregamento via Firebase
- **Status:** FUNCIONANDO ✓

### ✅ Segurança da API
- **Problema:** API key exposta no código
- **Solução:** Movida para arquivo separado `config.js` (não versionado)
- **Status:** PROTEGIDA ✓

### ✅ PWA Instalável
- **Problema:** App não instalava em todos os dispositivos
- **Solução:** Manifest.json otimizado, Service Worker corrigido, ícones em todos os tamanhos
- **Status:** FUNCIONANDO ✓

## 📱 Compatibilidade

- ✅ Chrome Android 90+
- ✅ Safari iOS 14+
- ✅ Chrome Desktop 90+
- ✅ Edge 90+
- ✅ Firefox 88+ (instalação limitada)

## 🐛 Resolução de Problemas

### App não instala no iPhone:
1. Certifique-se de usar Safari (não Chrome)
2. Acesse via HTTPS
3. Use o botão "Compartilhar" e não "Adicionar à favoritos"

### App não funciona offline:
1. Verifique se o Service Worker está registrado (Console → Application → Service Workers)
2. Limpe o cache do navegador
3. Recarregue a página (Ctrl+Shift+R)

### Erro de autenticação Firebase:
1. Verifique se as credenciais em `config.js` estão corretas
2. Confirme que Authentication está habilitado no console Firebase
3. Verifique as regras do Realtime Database

## 📄 Licença

MIT License - Use livremente para propagar a fé! 🙏

## 💖 Créditos

- **Método de Oração:** São Luís de Montfort
- **Desenvolvimento:** Seu Nome
- **Ícone:** Editado do Made by Edgar

## 🌟 Apoie o Projeto

Se este app te ajudou na sua jornada de fé:

- ⭐ Dê uma estrela no GitHub
- 🙏 Reze um Pai Nosso pela intenção do desenvolvedor
- 📢 Compartilhe com outros católicos
- 💝 Contribua com melhorias via Pull Request

---

**Ad Majorem Dei Gloriam** ✨

Para maior glória de Deus!

## 📞 Contato

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Issues: [Reporte bugs aqui](https://github.com/seu-usuario/rosario-app/issues)
