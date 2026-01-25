// app.js - Lógica principal da aplicação

// ===== SISTEMA DE ÁUDIO INTERATIVO =====
const AudioSystem = {
    ctx: null,
    enabled: false,
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    },
    
    playBead(type = 'ave') {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        filter.type = 'lowpass';
        osc.type = 'triangle';
        
        if (type === 'pater') {
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
            filter.frequency.setValueAtTime(600, now);
            filter.Q.setValueAtTime(3, now);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        } else if (type === 'special') {
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.06);
            filter.frequency.setValueAtTime(500, now);
            filter.Q.setValueAtTime(4, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        } else {
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(130, now + 0.05);
            filter.frequency.setValueAtTime(450, now);
            filter.Q.setValueAtTime(5, now);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        }
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        
        this.addWoodTexture(type);
    },
    
    addWoodTexture(type) {
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.02;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const envelope = Math.exp(-i / (bufferSize * 0.15));
            data[i] = (Math.random() * 2 - 1) * 0.4 * envelope;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = this.ctx.createGain();
        const noiseFilter = this.ctx.createBiquadFilter();
        
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(type === 'pater' ? 800 : 1200, now);
        noiseFilter.Q.setValueAtTime(2, now);
        
        const vol = type === 'pater' ? 0.15 : 0.1;
        noiseGain.gain.setValueAtTime(vol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
    },
    
    playBell() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const frequencies = [523.25, 659.25, 783.99];
        
        frequencies.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, now);
            osc.type = 'sine';
            
            const startTime = now + i * 0.12;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1 / (i + 1), startTime + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 3);
        });
    },
    
    playComplete() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392, 523.25];
        
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(freq, now);
            osc.type = 'sine';
            
            const startTime = now + i * 0.18;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.12, startTime + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 2.5);
        });
    },
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

// ===== TEXTOS DAS ORAÇÕES =====
const TEXTS = {
    cross: `Em nome do Pai, e do Filho, e do Espírito Santo. Amém.`,
    credo: `Creio em Deus Pai todo-poderoso, Criador do Céu e da terra; e em Jesus Cristo, seu único Filho, Nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos Céus; está sentado à direita de Deus Pai todo-poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo; na Santa Igreja Católica; na comunhão dos Santos; na remissão dos pecados; na ressurreição da carne; na vida eterna. Amém.`,
    pater: `Pai nosso que estais nos Céus, santificado seja o vosso Nome, venha a nós o vosso Reino, seja feita a vossa vontade assim na terra como no Céu. O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do Mal. Amém.`,
    ave: `Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`,
    gloria: `Glória ao Pai, e ao Filho, e ao Espírito Santo. Assim como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.`,
    fatima: `Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o Céu, principalmente as que mais precisarem da vossa Misericórdia.`,
    salve: `Salve Rainha, Mãe de Misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei. E depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`
};

// ===== MEDITAÇÕES MONTFORT =====
const MONTFORT = {
    intro: [
        "Em honra do Pai Eterno, que gera seu Filho contemplando-Se.",
        "Em honra do Verbo Eterno, igual ao Pai, que com Ele produz o Espírito Santo.",
        "Em honra do Espírito Santo, que procede do Pai e do Filho por via de amor."
    ],
    gozosos: {
        name: "Mistérios Gozosos",
        mysteries: [
            {
                title: "A Anunciação do Anjo a Nossa Senhora",
                pater: "A caridade de Deus, imensa.",
                aves: [
                    "Para lamentar o desgraçado estado de Adão desobediente, sua justa condenação e a de todos os seus filhos.",
                    "Os desejos dos patriarcas e profetas, que pediam a vinda do Messias.",
                    "Os desejos e as preces da Santíssima Virgem, que apressaram a vinda do Messias.",
                    "A caridade do Pai Eterno, que nos deu Seu divino Filho.",
                    "O amor do Filho, que se entregou por nós.",
                    "A embaixada e a saudação do arcanjo Gabriel.",
                    "O temor virginal de Maria.",
                    "A fé e o consentimento da Santíssima Virgem.",
                    "A criação da alma e a formação do Corpo de Jesus Cristo no seio de Maria, pelo Espírito Santo.",
                    "A adoração do Verbo Encarnado, pelos anjos, no seio de Maria."
                ]
            },
            {
                title: "A Visitação de Nossa Senhora a Santa Isabel",
                pater: "A majestade de Deus, adorável.",
                aves: [
                    "O gozo do Coração de Maria e a morada durante nove meses, do Verbo em seu seio.",
                    "O sacrifício que Jesus Cristo fez de Si mesmo ao Pai, ao entrar neste Mundo.",
                    "As complacências de Jesus no seio humilde e virginal de Maria, e de Nossa Senhora, no gozo do seu Deus.",
                    "A dúvida de São José acerca da maternidade de Maria.",
                    "A eleição dos escolhidos, combinada entre Jesus e Maria, em seu seio.",
                    "O fervor de Maria na sua visita a Santa Isabel.",
                    "A santificação de João Batista no ventre de sua mãe.",
                    "A gratidão da Santíssima Virgem para com Deus, no Magnificat.",
                    "A sua caridade e humildade em servir sua prima.",
                    "A mútua dependência de Jesus e de Maria, e a devoção que devemos ter para com um e outra."
                ]
            },
            {
                title: "O Nascimento de Jesus em Belém",
                pater: "As riquezas de Deus, infinitas.",
                aves: [
                    "Os desprezos e injúrias feitas a Maria e a São José em Belém.",
                    "A pobreza do estábulo onde Deus veio ao mundo.",
                    "A alta contemplação e o excessivo amor de Maria no momento de dar à luz.",
                    "A saída do Verbo Eterno do seio de Maria sem romper o selo de sua virgindade.",
                    "As adorações e cânticos dos anjos no nascimento de Jesus.",
                    "A formosura arrebatadora de Sua divina infância.",
                    "A vinda dos pastores ao estábulo, com seus presentes.",
                    "A circuncisão de Jesus Cristo e Suas dores amorosas.",
                    "A imposição do nome de Jesus Cristo e suas grandezas.",
                    "A adoração dos reis magos e seus presentes."
                ]
            },
            {
                title: "A Apresentação de Jesus no Templo",
                pater: "A sabedoria de Deus, eterna.",
                aves: [
                    "A obediência de Jesus e de Maria à Lei.",
                    "O sacrifício que ali fez Jesus de sua humanidade.",
                    "O sacrifício que ali fez Maria de sua honra.",
                    "O gozo e os cânticos de Simeão e Ana, a profetisa.",
                    "O resgate de Jesus pela oferenda de duas rolas.",
                    "A matança dos santos inocentes.",
                    "A fuga de Jesus para o Egito, pela obediência de São José à voz do anjo.",
                    "A estada misteriosa no Egito.",
                    "A Sua volta para Nazaré.",
                    "O seu crescimento em idade, sabedoria e graça."
                ]
            },
            {
                title: "O Encontro de Jesus no Templo",
                pater: "A santidade de Deus, incompreensível.",
                aves: [
                    "A Sua vida oculta, laboriosa e obediente na casa de Nazaré.",
                    "A sua perda e encontro no Templo entre os doutores.",
                    "O seu jejum e tentações no deserto.",
                    "O seu Batismo por São João Batista.",
                    "A sua pregação admirável.",
                    "Os seus milagres portentosos.",
                    "A eleição de seus doze Apóstolos e os poderes que lhes deu.",
                    "A sua transfiguração maravilhosa.",
                    "O lava-pés dos Apóstolos.",
                    "A instituição da Sagrada Eucaristia."
                ]
            }
        ]
    },
    dolorosos: {
        name: "Mistérios Dolorosos",
        mysteries: [
            {
                title: "A Agonia de Jesus no Horto",
                pater: "A felicidade de Deus, essencial.",
                aves: [
                    "Os divinos retiros que fez Jesus em Sua vida, principalmente no horto.",
                    "As suas orações humildes e fervorosas durante Sua vida e nas vésperas da Paixão.",
                    "A paciência e doçura com que suportou Seus Apóstolos, particularmente no horto.",
                    "O tédio de sua Alma durante toda a Sua vida, principalmente no horto.",
                    "Os rios de sangue que a dor fez brotar de seu Ser adorável.",
                    "O consolo que teve por bem aceitar de um anjo na agonia.",
                    "A sua conformidade com a vontade do Pai, apesar da repugnância de Sua natureza.",
                    "A Sua traição por Judas e prisão pelos judeus.",
                    "O valor com que saiu ao encontro dos algozes e a força da palavra com que os lançou por terra.",
                    "O abandono que sofreu de Seus Apóstolos."
                ]
            },
            {
                title: "A Flagelação de Jesus",
                pater: "A paciência de Deus, admirável.",
                aves: [
                    "As cordas com que Jesus foi atado.",
                    "A bofetada que recebeu em casa de Caifás.",
                    "As negações de São Pedro.",
                    "As ignomínias que sofreu em casa de Herodes, quando lhe puseram a veste branca.",
                    "O despojamento de Suas vestes.",
                    "Os desprezos e insultos que sofreu de seus verdugos pela Sua nudez.",
                    "As varas espinhosas e os açoites cruéis com que foi golpeado.",
                    "A coluna em que foi atado.",
                    "O sangue que derramou e as chagas que recebeu.",
                    "A Sua queda no próprio sangue por causa da fraqueza."
                ]
            },
            {
                title: "A Coroação de Espinhos",
                pater: "A formosura de Deus, inefável.",
                aves: [
                    "O despojamento de Suas vestes pela terceira vez.",
                    "A Sua coroa de espinhos.",
                    "O véu com que Lhe vendaram os olhos.",
                    "As bofetadas e os escarros com que Lhe cobriram o rosto.",
                    "O andrajo que Lhe puseram sobre os ombros.",
                    "A cana que Lhe puseram nas mãos.",
                    "A pedra pontiaguda sobre a qual O sentaram.",
                    "Os ultrajes e os insultos que Lhe fizeram.",
                    "O sangue e os suores que escorriam de Sua cabeça adorável.",
                    "Os cabelos e a barba que Lhe arrancaram."
                ]
            },
            {
                title: "Jesus Carrega a Cruz",
                pater: "A onipotência de Deus, sem limites.",
                aves: [
                    "A apresentação de Nosso Senhor diante do povo com o 'Eis o Homem'.",
                    "O haver sido preferido a Barrabás.",
                    "Os falsos testemunhos que contra Ele deram.",
                    "A Sua condenação à morte.",
                    "O amor com que abraçou e beijou a Cruz.",
                    "O trabalho espantoso que teve em carregá-la.",
                    "As quedas de pura debilidade sob seu peso.",
                    "O encontro doloroso com Sua Santa Mãe.",
                    "O véu de Verônica, no qual Seu rosto se estampou.",
                    "As suas lágrimas, as de Sua Santa Mãe e das piedosas mulheres que O seguiram até o Calvário."
                ]
            },
            {
                title: "A Crucificação e Morte de Jesus",
                pater: "A justiça de Deus, espantosa.",
                aves: [
                    "As cinco chagas de Jesus e o sangue que derramou na Cruz.",
                    "O seu coração traspassado e a Cruz em que foi crucificado.",
                    "Os cravos e a lança que O atravessaram.",
                    "A vergonha e a infâmia que sofreu, sendo crucificado entre dois ladrões.",
                    "A compaixão de Sua Mãe Santíssima.",
                    "As sete últimas palavras.",
                    "O seu desamparo e Seu silêncio.",
                    "A aflição de todo o Universo.",
                    "A Sua morte cruel e ignominiosa.",
                    "A descida da Cruz e sepultamento."
                ]
            }
        ]
    },
    gloriosos: {
        name: "Mistérios Gloriosos",
        mysteries: [
            {
                title: "A Ressurreição de Jesus",
                pater: "A eternidade de Deus, sem princípio.",
                aves: [
                    "A descida da Alma de Nosso Senhor aos Infernos.",
                    "O gozo e a saída das almas dos Santos Padres que estavam no limbo.",
                    "A reunião de Sua Alma e de Seu Corpo no sepulcro.",
                    "A sua milagrosa saída do Sepulcro.",
                    "As suas vitórias sobre a morte, o pecado, o mundo e o demônio.",
                    "Os quatro dons gloriosos de Seu Corpo.",
                    "O poder que Lhe deu Seu pai no céu e na terra.",
                    "As aparições com que honrou Sua Santa Mãe.",
                    "As conversações sobre o Céu e a ceia que fez com Seus Apóstolos.",
                    "A autoridade e missão que lhes deu, para que fossem pregar por toda a Terra."
                ]
            },
            {
                title: "A Ascensão de Jesus ao Céu",
                pater: "A imensidade de Deus, sem limites.",
                aves: [
                    "A promessa que fez Jesus aos Apóstolos de lhes enviar o Espírito Santo.",
                    "A reunião no Monte das Oliveiras.",
                    "A benção que lhes deu ao se elevar da Terra aos Céus.",
                    "A Sua gloriosa e admirável Ascensão por Sua própria virtude até o Céu Empíreo.",
                    "O recebimento e o triunfo que lhe fez Deus, Seu Pai, e toda a corte celestial.",
                    "O poder triunfante com que abriu as portas do Céu, onde nenhum mortal havia entrado.",
                    "O seu assento à direita do Pai, como Seu Filho querido, igual a Ele mesmo.",
                    "O poder que Lhe deu de julgar os vivos e os mortos.",
                    "A Sua última vinda sobre a Terra, na qual Seu poder e majestade aparecerão em todo o seu esplendor.",
                    "A justiça que fará no último Juízo, recompensando os bons e castigando os maus por toda a eternidade."
                ]
            },
            {
                title: "A Vinda do Espírito Santo",
                pater: "A providência de Deus, universal.",
                aves: [
                    "A Verdade do Espírito Santo, Deus que procede do Pai e do Filho.",
                    "O dom do Espírito Santo pelo Pai e pelo Filho sobre os Apóstolos.",
                    "O grande estrondo com que desceu, sinal de Sua força e Seu poder.",
                    "As línguas de fogo que enviou sobre os Apóstolos.",
                    "A plenitude de graças com que distinguiu Maria, Sua fiel esposa.",
                    "A Sua conduta maravilhosa, com os santos e com o próprio Jesus Cristo.",
                    "Os doze frutos do Espírito Santo.",
                    "Os sete dons do Espírito Santo.",
                    "Para pedir em particular o dom da Sabedoria e a vinda de Seu reino aos corações.",
                    "Para obter a vitória sobre os três espíritos que Lhe são opostos: o espírito da carne, do mundo e do demônio."
                ]
            },
            {
                title: "A Assunção de Nossa Senhora",
                pater: "A liberalidade de Deus, inenarrável.",
                aves: [
                    "A predestinação eterna de Maria, como obra-prima das mãos de Deus.",
                    "A Sua Conceição Imaculada, a plenitude de graças e o uso da razão no seio de sua mãe.",
                    "A Sua Natividade que regozijou todo o Universo.",
                    "A Sua apresentação e sua vida no Templo.",
                    "A Sua vida admirável e isenta de todo pecado.",
                    "A plenitude de suas virtudes singulares.",
                    "A Sua virgindade fecunda e seu parto sem dor.",
                    "A Sua maternidade divina e sua aliança com a Santíssima Trindade.",
                    "A Sua morte preciosa e cheia de amor.",
                    "A Sua ressurreição e assunção triunfante."
                ]
            },
            {
                title: "A Coroação de Nossa Senhora",
                pater: "A glória de Deus, inacessível.",
                aves: [
                    "A tríplice coroa com que a Santíssima Trindade coroou Maria.",
                    "O gozo e a glória nova que recebeu o Céu por seu triunfo.",
                    "Para reconhecê-la como Rainha do Céu e da Terra, dos anjos e dos homens.",
                    "A tesoureira e dispensadora de todas as graças de Deus.",
                    "A Medianeira e advogada dos homens.",
                    "A destruidora e a ruína do demônio e das heresias.",
                    "O refúgio seguro dos pecadores.",
                    "A mãe e nutriz dos cristãos.",
                    "A que é gozo e doçura dos justos.",
                    "A que é asilo universal dos vivos, consolo todo-poderoso dos aflitos, dos moribundos e das almas do purgatório."
                ]
            }
        ]
    }
};

// ===== APP =====
const app = {
    state: { type: null, beads: [], index: 0, showText: false },
    els: {},
    
    init() {
        this.els = {
            mainApp: document.getElementById('main-app'),
            prayer: document.getElementById('prayer-screen'),
            completion: document.getElementById('completion-screen'),
            track: document.getElementById('bead-track'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            group: document.getElementById('prayer-group'),
            mystery: document.getElementById('prayer-mystery'),
            name: document.getElementById('prayer-name'),
            count: document.getElementById('prayer-count'),
            meditationBox: document.getElementById('meditation-box'),
            meditationText: document.getElementById('meditation-text'),
            textToggle: document.getElementById('prayer-text-toggle'),
            fullText: document.getElementById('prayer-full-text'),
            prevBtn: document.getElementById('prev-btn'),
            audioToggle: document.getElementById('audio-toggle'),
            audioIconOn: document.getElementById('audio-icon-on'),
            audioIconOff: document.getElementById('audio-icon-off')
        };
        
        this.setupGestures();
        this.setupKeyboard();
    },
    
    setupGestures() {
        let startY = 0;
        let startX = 0;
        const body = document.getElementById('prayer-body');
        
        body.addEventListener('touchstart', e => { 
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        body.addEventListener('touchmove', e => {
            const dy = Math.abs(startY - e.touches[0].clientY);
            const dx = Math.abs(startX - e.touches[0].clientX);
            if (dy > dx && dy > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        body.addEventListener('touchend', e => {
            if (!this.state.type) return;
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const dy = startY - endY;
            const dx = Math.abs(startX - endX);
            
            if (Math.abs(dy) > 30 && Math.abs(dy) > dx) {
                if (dy > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
        
        let wheelTimeout;
        window.addEventListener('wheel', e => {
            if (!this.state.type || wheelTimeout) return;
            if (e.deltaY > 0) this.next();
            else if (e.deltaY < 0) this.prev();
            wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 180);
        }, { passive: true });
    },
    
    setupKeyboard() {
        document.addEventListener('keydown', e => {
            if (!this.state.type) return;
            if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); this.next(); }
            if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); this.prev(); }
            if (e.key === 'Escape') this.confirmExit();
            if (e.key.toLowerCase() === 't') this.toggleText();
            if (e.key.toLowerCase() === 'm') this.toggleAudio();
        });
    },
    
    toggleAudio() {
        const enabled = AudioSystem.toggle();
        this.els.audioToggle.classList.toggle('active', enabled);
        this.els.audioIconOn.style.display = enabled ? 'block' : 'none';
        this.els.audioIconOff.style.display = enabled ? 'none' : 'block';
        if (enabled) AudioSystem.playBell();
    },
    
    generateBeads(type) {
        const beads = [];
        let id = 0;
        const add = (beadType, name, textKey, meditation = '', meta = {}) => {
            beads.push({ id: id++, beadType, name, textKey, meditation, ...meta });
        };
        
        add('special', 'Sinal da Cruz', 'cross', 'Fé na presença de Deus; Fé no Evangelho; Fé e obediência ao Papa como Vigário de Jesus Cristo.');
        add('special', 'Creio em Deus Pai', 'credo', 'Professamos nossa fé no Deus Uno e Trino e em todos os artigos da Santa Fé Católica.');
        add('pater', 'Pai Nosso', 'pater', 'Unidade de um só Deus, vivo e verdadeiro.');
        MONTFORT.intro.forEach((med, i) => {
            add('ave', 'Ave Maria', 'ave', med, { count: `${i + 1}ª Ave Maria · Virtudes Teologais` });
        });
        add('special', 'Glória ao Pai', 'gloria', 'Damos glória à Santíssima Trindade.');
        
        let groups = type === 'completo' ? [MONTFORT.gozosos, MONTFORT.dolorosos, MONTFORT.gloriosos] : [MONTFORT[type]];
        
        groups.forEach(group => {
            group.mysteries.forEach((mystery, mIdx) => {
                const mysteryNum = mIdx + 1;
                add('pater', 'Pai Nosso', 'pater', mystery.pater, { group: group.name, mystery: mystery.title, count: `${mysteryNum}º Mistério` });
                mystery.aves.forEach((med, aIdx) => {
                    add('ave', 'Ave Maria', 'ave', med, { group: group.name, mystery: mystery.title, count: `${mysteryNum}ª Dezena · ${aIdx + 1}ª Ave Maria` });
                });
                add('special', 'Glória ao Pai', 'gloria', '', { group: group.name, mystery: mystery.title, count: `${mysteryNum}ª Dezena` });
                add('special', 'Oração de Fátima', 'fatima', 'Oração ensinada por Nossa Senhora aos pastorinhos de Fátima.', { group: group.name, mystery: mystery.title, count: `${mysteryNum}ª Dezena` });
            });
        });
        
        add('special', 'Salve Rainha', 'salve', 'Saudemos a Rainha do Céu e da Terra, nossa Mãe e Advogada.');
        return beads;
    },
    
    start(type) {
        this.state.type = type;
        this.state.beads = this.generateBeads(type);
        this.state.index = 0;
        this.state.showText = false;
        
        this.els.track.innerHTML = '';
        this.state.beads.forEach((bead, idx) => {
            const el = document.createElement('div');
            el.className = `bead ${bead.beadType}`;
            if (bead.beadType !== 'ave' && bead.beadType !== 'pater') el.classList.add('special');
            if (bead.textKey === 'gloria' || bead.textKey === 'fatima') {
                el.classList.add('rectangle-bead');
            }
            if (idx === 0) el.classList.add('active');
            el.onclick = () => this.goTo(idx);
            this.els.track.appendChild(el);
        });
        
        this.els.prayer.classList.add('active');
        AudioSystem.playBell();
        this.update();
    },
    
    goTo(idx) {
        if (idx >= 0 && idx < this.state.beads.length) {
            this.state.index = idx;
            this.update();
            AudioSystem.playBead(this.state.beads[idx].beadType);
        }
    },
    
    next() {
        if (this.state.index < this.state.beads.length - 1) {
            this.state.index++;
            this.update();
            AudioSystem.playBead(this.state.beads[this.state.index].beadType);
        } else {
            this.complete();
        }
    },
    
    prev() {
        if (this.state.index > 0) {
            this.state.index--;
            this.update();
            AudioSystem.playBead(this.state.beads[this.state.index].beadType);
        }
    },
    
    update() {
        const idx = this.state.index;
        const bead = this.state.beads[idx];
        const total = this.state.beads.length;
        const pct = ((idx + 1) / total) * 100;
        
        this.els.progressFill.style.width = `${pct}%`;
        this.els.progressText.textContent = `${idx + 1} / ${total}`;
        
        const animatedEls = [this.els.group, this.els.mystery, this.els.name, this.els.count, this.els.meditationBox];
        animatedEls.forEach(el => el.classList.remove('visible'));
        
        setTimeout(() => {
            this.els.group.textContent = bead.group || '';
            this.els.mystery.textContent = bead.mystery || '';
            this.els.name.textContent = bead.name;
            this.els.count.textContent = bead.count || '';
            this.els.meditationText.textContent = bead.meditation;
            this.els.fullText.innerHTML = `<p>${TEXTS[bead.textKey]}</p>`;
            
            const isShortPrayer = bead.textKey === 'gloria' || bead.textKey === 'fatima';
            if (isShortPrayer) {
                this.els.fullText.classList.add('visible');
                this.els.textToggle.style.display = 'none';
            } else {
                this.els.textToggle.style.display = 'flex';
                if (!this.state.showText) {
                    this.els.fullText.classList.remove('visible');
                    this.els.textToggle.classList.remove('expanded');
                    this.els.textToggle.querySelector('span').textContent = 'Ver texto da oração';
                } else {
                    this.els.fullText.classList.add('visible');
                    this.els.textToggle.classList.add('expanded');
                    this.els.textToggle.querySelector('span').textContent = 'Esconder texto';
                }
            }
            
            animatedEls.forEach(el => el.classList.add('visible'));
        }, 120);
        
        this.els.prevBtn.disabled = idx === 0;
        
        const beadEls = this.els.track.children;
        Array.from(beadEls).forEach(el => el.classList.remove('active'));
        beadEls[idx].classList.add('active');
        
        const activeEl = beadEls[idx];
        const beadCenter = activeEl.offsetTop + activeEl.offsetHeight / 2;
        this.els.track.style.transform = `translate(-50%, -${beadCenter}px)`;
    },
    
    toggleText() {
        this.state.showText = !this.state.showText;
        if (this.state.showText) {
            this.els.fullText.classList.add('visible');
            this.els.textToggle.classList.add('expanded');
            this.els.textToggle.querySelector('span').textContent = 'Ocultar texto';
        } else {
            this.els.fullText.classList.remove('visible');
            this.els.textToggle.classList.remove('expanded');
            this.els.textToggle.querySelector('span').textContent = 'Ver texto da oração';
        }
    },
    
    confirmExit() {
        if (confirm('Deseja realmente sair do Rosário?')) this.home();
    },
    
    home() {
        this.state.type = null;
        this.els.prayer.classList.remove('active');
        this.els.completion.classList.remove('active');
    },
    
    async complete() {
        AudioSystem.playComplete();
        
        const aves = this.state.beads.filter(b => b.beadType === 'ave').length;
        const paters = this.state.beads.filter(b => b.beadType === 'pater').length;
        
        document.getElementById('stat-aves').textContent = aves;
        document.getElementById('stat-paters').textContent = paters;
        
        const msgs = {
            gozosos: 'Você completou os Mistérios Gozosos. Que a alegria de Maria esteja convosco.',
            dolorosos: 'Você completou os Mistérios Dolorosos. Que os sofrimentos de Cristo vos fortaleçam.',
            gloriosos: 'Você completou os Mistérios Gloriosos. Que a glória do Céu vos aguarde.',
            completo: 'Você completou o Santo Rosário inteiro! Que Nossa Senhora interceda por vós.'
        };
        
        document.getElementById('completion-msg').textContent = msgs[this.state.type];
        
        if (window.currentUser && window.userProfile) {
            await this.saveCompletion(aves, paters);
        }
        
        this.els.prayer.classList.remove('active');
        this.els.completion.classList.add('active');
    },
    
    async saveCompletion(aves, paters) {
        try {
            const database = window.firebaseDatabase;
            const ref = window.firebaseRef;
            const update = window.firebaseUpdate;
            const get = window.firebaseGet;
            
            const userId = window.currentUser.uid;
            const today = new Date();
            const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            const updates = {};
            updates[`users/${userId}/prayedDays/${dateKey}`] = true;
            updates[`users/${userId}/totalRosaries`] = (window.userProfile.totalRosaries || 0) + 1;
            updates[`users/${userId}/totalAves`] = (window.userProfile.totalAves || 0) + aves;
            updates[`users/${userId}/totalPaters`] = (window.userProfile.totalPaters || 0) + paters;
            
            const userRef = ref(database, `users/${userId}`);
            const snapshot = await get(userRef);
            const userData = snapshot.val();
            const prayedDays = userData.prayedDays || {};
            
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
            
            let newStreak = 1;
            if (prayedDays[yesterdayKey]) {
                newStreak = (userData.currentStreak || 0) + 1;
            }
            
            updates[`users/${userId}/currentStreak`] = newStreak;
            updates[`users/${userId}/longestStreak`] = Math.max(newStreak, userData.longestStreak || 0);
            
            await update(ref(database), updates);
            
            window.userProfile.prayedDays = { ...prayedDays, [dateKey]: true };
            window.userProfile.totalRosaries = (window.userProfile.totalRosaries || 0) + 1;
            window.userProfile.totalAves = (window.userProfile.totalAves || 0) + aves;
            window.userProfile.totalPaters = (window.userProfile.totalPaters || 0) + paters;
            window.userProfile.currentStreak = newStreak;
            window.userProfile.longestStreak = Math.max(newStreak, window.userProfile.longestStreak || 0);
            
            if (window.updateUserInterface) {
                window.updateUserInterface();
            }
        } catch (error) {
            console.error('Erro ao salvar conclusão:', error);
        }
    }
};

// Inicializar app
app.init();
window.app = app;

// ===== SISTEMA DE AVATARES =====
const AVATARS = [
    '👤', '🙏', '📿', '✝️', '⛪', '🕊️',
    '🌟', '❤️', '🌹', '📖', '🕯️', '👑',
    '😇', '🌙', '☀️', '💫'
];

let selectedAvatar = '👤';

function renderAvatarGrid() {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';
    
    AVATARS.forEach(avatar => {
        const option = document.createElement('div');
        option.className = 'avatar-option';
        option.textContent = avatar;
        option.onclick = () => selectAvatar(avatar, option);
        
        if (window.userProfile && window.userProfile.avatar === avatar) {
            option.classList.add('selected');
            selectedAvatar = avatar;
        }
        
        grid.appendChild(option);
    });
}

function selectAvatar(avatar, element) {
    selectedAvatar = avatar;
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
}

window.openAvatarModal = function() {
    renderAvatarGrid();
    document.getElementById('avatar-modal').classList.add('active');
};

window.closeAvatarModal = function() {
    document.getElementById('avatar-modal').classList.remove('active');
};

window.saveAvatar = async function() {
    if (!window.currentUser || !selectedAvatar) return;
    
    const saveBtn = document.getElementById('avatar-save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';
    
    try {
        const database = window.firebaseDatabase;
        const ref = window.firebaseRef;
        const update = window.firebaseUpdate;
        
        await update(ref(database, `users/${window.currentUser.uid}`), {
            avatar: selectedAvatar
        });
        
        window.userProfile.avatar = selectedAvatar;
        document.getElementById('profile-avatar').textContent = selectedAvatar;
        
        closeAvatarModal();
        saveBtn.disabled = false;
        saveBtn.textContent = 'Salvar Avatar';
    } catch (error) {
        console.error('Erro ao salvar avatar:', error);
        alert('Erro ao salvar avatar. Tente novamente.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Salvar Avatar';
    }
};

// Fechar modal ao clicar fora
document.addEventListener('click', (e) => {
    const modal = document.getElementById('avatar-modal');
    if (e.target === modal) {
        closeAvatarModal();
    }
});
