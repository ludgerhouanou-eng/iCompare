// ============================================================
// GUIDES « VÉRIFIER AVANT D'ACHETER » — /guides
// ============================================================
// L'angle éditorial du site, choisi pour une raison précise : les requêtes
// « iPhone 17 prix » exigent d'afficher un montant (interdit sans PA API) et
// sont trustées par des sites de dix ans. Les requêtes « mon iPhone est-il
// compatible », « ma garantie court-elle encore », « ce chargeur suffit-il »
// sont à la portée d'un site neuf, et leur lecteur a BESOIN du lien vers la
// fiche — donc le clic affilié y est un service rendu, pas un piège.
//
// Trois règles de rédaction, contrôlées par `npm run check` :
//   1. aucune spécification inventée : les tableaux de compatibilité sont
//      CONSTRUITS depuis lib/modeles.js à l'affichage, jamais recopiés ici ;
//   2. une source datée par affirmation qui ne vient pas du site ;
//   3. un seul lien sortant par guide (l'espace d'achat du rayon), tagué et
//      `rel="sponsored"` — pas de prix, pas de disponibilité.
// Un doute assumé se note dans un `encart: "verifier"` ; il est affiché au
// lecteur tel quel. C'est ce qui distingue une page honnête d'une page vide.

import { TABLE_VERIF_FR, TABLE_SOURCES } from "./modeles.js";

/** Sources partagées par plusieurs guides (évite de retaper une URL). */
const S = {
  wikiIos26: { nom: "Wikipedia — iOS 26, appareils pris en charge", url: "https://en.wikipedia.org/wiki/IOS_26" },
  macworld: { nom: "MacWorld — iOS compatibility, modèle par modèle", url: "https://www.macworld.com/article/1811287/which-version-of-ios-can-my-iphone-run.html" },
  itech: { nom: "itechguides — iOS 26 Supported Devices", url: "https://www.itechguides.com/ios-26-supported-devices-check-whether-your-iphone-can-update/" },
  rottenIpad: { nom: "rottenwifi — iPad et Apple Intelligence : exigence M1 / A17 Pro", url: "https://rottenwifi.com/which-ipad-models-support-apple-intelligence-and-which-dont-2026-guide/" },
  dgccrf: { nom: "Économie.gouv.fr (DGCCRF) — Foire aux questions sur la réforme des garanties", url: "https://www.economie.gouv.fr/files/files/directions_services/dgccrf/Faq/FAQ-garanties.pdf" },
  dgccrf2: { nom: "Économie.gouv.fr — Tout savoir sur la garantie légale de conformité", url: "https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/tout-savoir-sur-la-garantie-legale-de-conformite" },
  frandroid: { nom: "Frandroid — charge rapide iPhone 17 et adaptateur 40 W", url: "https://www.frandroid.com/marques/apple/2797891_il-vous-faudra-peut-etre-un-nouveau-chargeur-pour-les-iphone-17" },
  zero1net: { nom: "01net — l'adaptateur dynamique 40 W (jusqu'à 60 W) vendu en France", url: "https://www.01net.com/actualites/apple-lance-enfin-son-adaptateur-dynamique-40-w-en-france-jusqua-60-w-de-puissance.html" },
};

const CONSULT = "consultée le " + TABLE_VERIF_FR;

export const GUIDES = [
  {
    slug: "ios-26-quels-iphone-compatibles",
    titre: "iOS 26 : quels iPhone sont compatibles, et lesquels n'auront pas tout",
    titreSeo: "iOS 26 : liste complète des iPhone compatibles (2026)",
    description:
      "Tous les iPhone capables d'installer iOS 26, ceux qui s'arrêtent à iOS 18 ou 16, et la distinction qui piège tout le monde : compatible iOS 26 ne veut pas dire compatible Apple Intelligence.",
    chapeau:
      "iOS 26 s'installe sur 31 iPhone, du 11 au 17e et à l'iPhone Air. Mais deux questions distinctes se cachent derrière « mon iPhone est-il compatible » : est-ce qu'il reçoit le système, et est-ce qu'il reçoit les fonctions qui demandent du matériel. La deuxième a une réponse plus courte que la première.",
    maj: TABLE_VERIF_FR,
    lecture: 4,
    blocs: [
      {
        h2: "Le plancher : iPhone 11 et SE 2, rien avant",
        p: [
          "iOS 26 demande une puce A13 Bionic au minimum et 3 Go de mémoire. En pratique, cela fait entrer tout le monde à partir de l'iPhone 11, et deux iPhone hors numérotation : les SE de 2ᵉ et 3ᵉ génération. À l'inverse, l'iPhone XR, le XS et le XS Max s'arrêtent à iOS 18 — la bascule se joue sur le seul composant A12, écarté parce qu'il embarque 3D Touch, dont Apple a abandonné la prise en charge.",
          "Un iPhone bloqué à iOS 18 n'est pas pour autant un téléphone à jeter : il continue de recevoir des correctifs de sécurité tant qu'Apple maintient la branche. C'est la nuance qui manque à la plupart des listes trouvées en cherchant « iPhone obsolète ».",
        ],
      },
      {
        h2: "La zone de flou : les fonctions, pas le système",
        p: [
          "Compatible avec iOS 26 ne veut pas dire compatible avec tout iOS 26. Quelques exemples de planchers propres à une fonction : les scènes spatiales de l'app Photos demandent un iPhone 12 ou plus récent ; certaines améliorations d'appareil photo (et les indications de nettoyage de l'objectif) un iPhone 15 ou plus récent ; la gestion d'énergie adaptative un iPhone 15 Pro ou plus récent.",
          "Et surtout : Apple Intelligence est une exigence matérielle à part, et elle est plus haute que celle du système. C'est le piège le plus courant à l'achat d'occasion — un vendeur peut affirmer, de bonne foi, que son iPhone 15 « est à jour et compatible avec les fonctions IA ».",
        ],
        encart: {
          type: "info",
          titre: "Comment trancher sans se fier à la liste",
          texte:
            "Sur l'iPhone concerné : Réglages → Général → Mise à jour logicielle dit si iOS 26 est proposé ; Réglages → « Apple Intelligence et Siri » dit si la fonction est là. Si cette ligne n'existe pas, le matériel ne suit pas, quelle que soit la version installée.",
        },
      },
      {
        h2: "Le tableau, construit depuis notre relevé",
        p: [
          "Les lignes ci-dessous ne sont pas recopiées d'un article : elles viennent de la table de compatibilité que le site maintient (une ligne par modèle, une source par colonne), et le contrôle de build refuse toute divergence. La colonne qui compte vraiment à l'achat est la dernière.",
        ],
      },
    ],
    table: {
      legende: "Compatibilité iOS 26 et Apple Intelligence, par modèle",
      tableFrom: "iphone",
      note:
        "Relevé " +
        TABLE_VERIF_FR +
        ". « iOS 26 » = le modèle peut installer la famille 26.x. Une fonction peut demander plus que le système (voir ci-dessus).",
    },
    faq: [
      {
        q: "L'iPhone 12 ou l'iPhone 13 est-il compatible Apple Intelligence ?",
        a: "Non. Ces deux générations installent iOS 26 et gardent le nouveau design, l'app Photos repensée et les correctifs de sécurité, mais pas Apple Intelligence : la fonction demande une puce A17 Pro et 8 Go de mémoire. C'est un écart réel d'usage, pas un détail de fiche technique.",
      },
      {
        q: "Un iPhone qui ne dépasse pas iOS 18 est-il dangereux à utiliser ?",
        a: "Pas tant qu'Apple publie des mises à jour de sécurité pour sa branche : iOS 18 a continué d'en recevoir en 2026. Ce qui change, c'est l'accès aux fonctions récentes et, à terme, à certaines apps qui relèveront leur minimum. Pour un usage messagerie-banque-cartes, un iPhone XR à jour de ses correctifs reste utilisable ; pour un achat « pour dix ans », non.",
      },
      {
        q: "La version exacte compte-t-elle (iOS 26 contre iOS 26.6) ?",
        a: "Oui pour quelques fonctions : la version 26.4 est celle où Apple a ouvert des capacités supplémentaires selon les régions et les langues. Si une fonction manque sur un modèle pourtant compatible, vérifiez d'abord la version installée et la langue du Siri — avant de conclure à une limitation matérielle.",
      },
    ],
    sources: [S.wikiIos26, S.macworld, S.itech],
    cta: {
      store: "iphone",
      titre: "Le rayon iPhone sur Amazon",
      texte:
        "Tous les modèles compatibles, leurs coloris et capacités, avec le prix et le stock du jour — c'est Amazon qui les affiche, pas nous.",
    },
    liens: ["/boutique", "/comparatif", "/produit/iphone-16"],
  },

  {
    slug: "apple-intelligence-verifier-iphone",
    titre: "Apple Intelligence : vérifier en deux écrans si votre iPhone y a droit",
    titreSeo: "Apple Intelligence : iPhone, iPad et Mac compatibles (vérif 2026)",
    description:
      "La vraie exigence matérielle d'Apple Intelligence, comment la vérifier en deux écrans sur l'appareil, et pourquoi un iPhone 15 récent n'y a pas droit alors qu'un iPhone 15 Pro y a droit.",
    chapeau:
      "Apple Intelligence n'est pas une option logicielle qu'on active : c'est une contrainte de matériel. Le plancher est une puce A17 Pro avec 8 Go de mémoire sur iPhone, et une puce M1 (ou l'exception A17 Pro du mini) sur iPad. D'où l'étrangeté qui trompe tout le monde : l'iPhone 15 et l'iPhone 15 Plus, sortis la même année que le 15 Pro, n'y ont pas droit.",
    maj: TABLE_VERIF_FR,
    lecture: 4,
    blocs: [
      {
        h2: "Sur l'appareil, deux écrans suffisent",
        p: [
          "Premier réflexe : Réglages → Général → Mise à jour logicielle pour vérifier que la version installée est assez récente (iOS 18.1 minimum pour la famille de fonctions, et iOS 26.4 ou plus pour les ajouts récents). Deuxième : chercher la ligne « Apple Intelligence et Siri » dans Réglages. Elle existe ou elle n'existe pas — il n'y a pas de troisième état, et c'est justement ce qui en fait un test fiable.",
          "Si la ligne existe mais que les fonctions sont grisées, le problème est ailleurs : langue du Siri hors des langues prises en charge, pays, ou fonctions liées à l'Apple ID. Un appareil « compatible au sens matériel » peut donc afficher un menu vide, ce qui nourrit la moitié des discussions sur le sujet.",
        ],
      },
      {
        h2: "Ce que la puce change concrètement",
        p: [
          "8 Go de mémoire ne sont pas un chiffre de marketing : c'est la place nécessaire pour garder le modèle de langage sur l'appareil. Un iPhone à 6 Go comme le 14 Pro, dont la puce est pourtant une A16, ne peut pas l'accueillir — d'où la règle à retenir, qui est plus simple que de comparer les générations : A17 Pro et 8 Go, ou rien.",
          "Les fonctions qui s'exécutent dans le cloud demandent moins de mémoire locale mais nécessitent un appareil compatible pour l'orchestration. Autrement dit, il n'existe pas de « version allégée par le cloud » pour un iPhone 13 : ce qui manque est définitif tant que le matériel ne change pas.",
        ],
        encart: {
          type: "verifier",
          titre: "Le point à confirmer vous-même",
          texte:
            "La liste des langues et des régions prises en charge évolue à chaque version. Nous ne la recopions pas : la seule source qui vaille est le menu de l'appareil, ou la page Apple du pays où vous achetez.",
        },
      },
      {
        h2: "iPhone compatibles, iPhone exclus",
        p: [
          "Le tableau est généré depuis notre table de compatibilité. Il n'y a qu'une colonne à lire pour acheter : celle du bas.",
        ],
      },
    ],
    table: {
      legende: "Apple Intelligence sur iPhone : la ligne de partage",
      tableFrom: "iphone",
      colonnes: ["Modèle", "Puce", "Mémoire", "Apple Intelligence"],
      note: "Relevé " + TABLE_VERIF_FR + ". Un modèle absent de la liste des compatibles n'est pas « en attente » : il est exclu par le matériel.",
    },
    faq: [
      {
        q: "L'iPad (A16) de 2025 a-t-il Apple Intelligence ?",
        a: "Non, et c'est l'erreur la plus fréquente sur les tablettes. Pour l'iPad, la règle n'est pas une puce Axx récente mais une puce M1 ou plus — avec une seule exception à base d'A-series, l'iPad mini (A17 Pro). L'iPad (A16), qui est pourtant le modèle « tout le monde » de 2025, reste en dehors, même sous iPadOS 26.",
      },
      {
        q: "Faut-il acheter un iPhone plus cher pour Apple Intelligence ?",
        a: "Pas forcément : un iPhone 15 Pro ou 16e d'occasion ou reconditionné remplit la condition matérielle pour beaucoup moins qu'un 17. En revanche, si vous achetez un iPhone pour dix ans et que l'assistant vous intéresse, descendre sous la ligne A17 Pro revient à payer pour une génération sans issue sur ce point.",
      },
      {
        q: "Les Mac et les iPad récents sont-ils tous compatibles ?",
        a: "Tout Mac à puce Apple (M1 ou plus récente) l'est. Pour les iPad, voir la réponse ci-dessus. Sur Mac, les fonctions les plus lourdes demandent 12 Go de mémoire — un plancher propre à la machine, distinct de celui de l'iPad.",
      },
    ],
    sources: [S.wikiIos26, S.itech, S.rottenIpad],
    cta: {
      store: "iphone",
      titre: "Les iPhone compatibles, vus par Amazon",
      texte: "16e, 17, 17e et famille Pro : la sélection du rayon iPhone, avec le prix et le stock du jour.",
    },
    liens: ["/guides/ios-26-quels-iphone-compatibles", "/boutique", "/produit/iphone-17e"],
  },

  {
    slug: "verifier-garantie-iphone-numero-de-serie",
    titre: "Vérifier la garantie d'un iPhone avec le numéro de série, sans se tromper",
    titreSeo: "Garantie iPhone : vérifier avec le numéro de série (mode d'emploi)",
    description:
      "Où trouver le numéro de série d'un iPhone, ce que la page officielle d'Apple indique vraiment, et la différence entre couverture technique, garantie constructeur et garantie légale de conformité — qui, elle, protège aussi l'acheteur d'occasion.",
    chapeau:
      "Avant d'acheter un iPhone d'occasion ou reconditionné, il y a un test qui coûte trente secondes et qui répond à trois questions : l'appareil est-il encore couvert, correspond-il à ce que le vendeur annonce, et a-t-il déjà été réparé hors cadre. Ce test passe par le numéro de série, pas par la facture.",
    maj: TABLE_VERIF_FR,
    lecture: 5,
    blocs: [
      {
        h2: "Trouver le numéro de série (et l'IMEI)",
        p: [
          "Sur l'appareil : Réglages → Général → Informations. Le numéro de modèle apparaît d'abord ; en tapotant la ligne, on fait défiler le numéro de série, l'IMEI et les autres identifiants. C'est aussi là que se lit le numéro de modèle au format Axxxx, utile pour vérifier la région de vente — un point sensible quand on compare un exemplaire français et un import.",
          "Sans l'appareil sous la main (achat à distance) : la boîte porte une étiquette avec numéro de série et IMEI, et un iPhone appairé à un Mac ou un PC les expose dans le logiciel de gestion. Un vendeur qui refuse de transmettre le numéro de série avant la vente est un vendeur à écarter, pas à négocier.",
        ],
      },
      {
        h2: "Ce que dit la page officielle, et ce qu'elle ne dit pas",
        p: [
          "La page de vérification de couverture d'Apple (checkcoverage.apple.com, accessible en français avec le sélecteur de langue) indique, pour un numéro de série valide, si la « couverture limitationnée » est active et jusqu'à quand environ — elle ne détaille pas ce que chaque intervention coûte, et elle ne dit rien d'un appareil dont le numéro a été remplacé ou effacé par une réparation non autorisée.",
          "Deux angles morts à connaître. D'abord, la couverture affichée suit l'appareil, pas le vendeur : un iPhone acheté d'occasion avec un an de couverture « Apple » n'engage pas le particulier qui vous le vend. Ensuite, un iPhone dont la batterie a été changée hors réseau agréé peut afficher une couverture et se voir refuser une intervention — la vérification est nécessaire, pas suffisante.",
        ],
        encart: {
          type: "info",
          titre: "Le contrôle à faire en plus, sur place",
          texte:
            "Demandez Réglages → Général → Informations et lisez la ligne « Pièces et historique service ». Sur iOS 17 et plus récent, elle signale un écran ou une batterie non d'origine ou d'origine inconnue. C'est le seul endroit où l'appareil lui-même témoigne contre le vendeur.",
        },
      },
      {
        h2: "La garantie qui vous protège vraiment : légale, pas commerciale",
        p: [
          "En France, la garantie légale de conformité s'applique aux biens neufs comme d'occasion et reconditionnés, vendus par un professionnel à un consommateur, pendant deux ans à compter de l'achat. Ce qui change entre neuf et occasion n'est pas la durée mais la preuve : la présomption d'antériorité du défaut est de deux ans sur un neuf, d'un an sur un bien d'occasion.",
          "Deux précisions qui ont de la valeur en pratique : toute période d'immobilisation pour remise en conformité s'ajoute à la durée totale, et une réparation fait gagner six mois (la couverture passe de 24 à 30 mois) tandis qu'un remplacement repart pour deux ans. Enfin, la « garantie constructeur » souvent mise en avant est une garantie commerciale, facultative, dont le contenu dépend des conditions du vendeur : elle s'ajoute, elle ne remplace jamais la légale.",
        ],
        encart: {
          type: "verifier",
          titre: "À vérifier pour votre situation",
          texte:
            "Ces règles relèvent du droit français de la consommation et ont changé à la dernière réforme. Si un litige se présente, lisez la page de la DGCCRF et non un article de blog — et conservez la facture, qui reste le point de départ du délai.",
        },
      },
      {
        h2: "Et pour un reconditionné vendu sur Amazon",
        p: [
          "Le programme Amazon Renewed ajoute au cadre légal une marge de retour de 90 jours et un an de garantie commerciale via le vendeur reconditionneur, d'après ce que le site affiche sur ses fiches Renewed. C'est ce qui distingue un reconditionné d'une petite annonce entre particuliers, où la garantie légale ne s'applique pas du tout.",
        ],
      },
    ],
    faq: [
      {
        q: "Un iPhone peut-il être bloqué à distance même avec de l'argent payé ?",
        a: "Oui, si le verrouillage d'activation (Localiser) n'a pas été désactivé par le propriétaire précédent, ou si l'appareil est signalé perdu. Le numéro de série servi à la vérification de couverture ne dit rien de ce risque : seul le fait d'effacer l'appareil devant vous, et de voir l'activation se faire sans identifiant étranger, le lève.",
      },
      {
        q: "La date d'achat compte-t-elle si je n'ai pas de facture ?",
        a: "Pour la couverture constructeur, Apple se réfère à la date d'activation. Pour la garantie légale de conformité, le point de départ est la livraison, et la charge de la preuve de la date revient au consommateur — d'où l'intérêt de conserver le courriel de confirmation de commande, qui suffit le plus souvent.",
      },
      {
        q: "Comment connaître la date de fabrication d'un iPhone ?",
        a: "Elle n'est plus lisible sur l'appareil depuis qu'Apple a changé son format de numéro de série (aléatoire en 2021). Le seul repère fiable est la date d'activation, visible via la couverture, ou la date d'achat du premier propriétaire. Toute méthode promettant de « dater un iPhone par son numéro de série » est, depuis, une invention.",
      },
    ],
    sources: [S.dgccrf, S.dgccrf2],
    cta: {
      store: "iphone",
      titre: "Les iPhone reconditionnés et neufs du rayon",
      texte: "Chaque fiche Amazon indique le vendeur, l'état annoncé et les conditions de retour — les trois choses à lire avant de valider.",
    },
    liens: ["/guides/iphone-renewed-ce-que-ca-couvre", "/boutique", "/produit/iphone-13"],
  },

  {
    slug: "esim-iphone-compatibilite",
    titre: "eSIM sur iPhone : compatibilité, et le piège des modèles importés",
    titreSeo: "eSIM iPhone : quels modèles, comment l'activer, les pièges (2026)",
    description:
      "Quels iPhone acceptent une eSIM en France, pourquoi un iPhone venu des États-Unis peut n'avoir aucun tiroir physique, et ce que cela change à la revente comme au dépannage.",
    chapeau:
      "La eSIM n'est pas une option moderne réservée aux derniers iPhone : elle existe depuis les XS, XR et SE 2. Ce qui a changé, c'est l'autre bout de l'équation — sur les modèles vendus aux États-Unis à partir de l'iPhone 14, il n'y a plus de carte physique du tout. C'est ce détail qui piège les acheteurs d'import et de reconditionné.",
    maj: TABLE_VERIF_FR,
    lecture: 4,
    blocs: [
      {
        h2: "Ce que la eSIM règle, et ce qu'elle ne règle pas",
        p: [
          "Une eSIM est un profil d'abonnement téléchargeable : elle supprime le passage en boutique pour changer d'opérateur, permet deux lignes actives en simultané (personnelle et professionnelle, par exemple) et survit à un changement de téléphone par re-téléchargement du profil. En revanche, elle ne rend pas un forfait international plus compétitif et ne remplace pas une carte physique à l'étranger si votre opérateur n'a rien prévu.",
          "Le point à retenir avant un achat d'occasion : un profil eSIM reste lié à l'opérateur, et un téléphone revendu sans suppression du profil peut poser problème. La procédure propre est Réglages → Général → Transférer ou réinitialiser l'iPhone, puis effacement complet, en présence du vendeur.",
        ],
      },
      {
        h2: "Les iPhone sans tiroir SIM, listés",
        p: [
          "Pour les exemplaires destinés au marché américain, l'absence de tiroir nano-SIM commence à l'iPhone 14 et concerne toute la suite de la gamme, y compris les 16e et 17. Conséquences concrètes à l'achat en France : impossible d'insérer une carte physique en dépannage chez un opérateur qui ne saurait pas faire, et valeur de revente plus sensible si l'acheteur suivant n'a pas d'offre eSIM.",
        ],
        liste: [
          "iPhone 14, 14 Plus, 14 Pro, 14 Pro Max — eSIM uniquement aux États-Unis",
          "iPhone 15, 15 Plus, 15 Pro, 15 Pro Max — idem",
          "iPhone 16, 16 Plus, 16 Pro, 16 Pro Max, 16e — idem",
          "iPhone 17, 17 Pro, 17 Pro Max, 17e, iPhone Air — idem",
        ],
        encart: {
          type: "info",
          titre: "Comment savoir d'où vient l'appareil",
          texte:
            "Réglages → Général → Informations, ligne « Numéro de modèle » : le suffixe indique la région (F/A pour la France, LL/A pour les États-Unis). C'est le seul repère qui ne dépend pas de ce que raconte le vendeur.",
        },
      },
      {
        h2: "Avant d'acheter : les trois questions",
        liste: [
          "Le modèle a-t-il un tiroir nano-SIM ? (oui pour tous les exemplaires européens, y compris les plus récents)",
          "Votre opérateur propose-t-il l'activation de eSIM à distance, et sous quelle forme — QR code, app, boutique ?",
          "En cas de panne de l'appareil, accepteriez-vous de ne pas pouvoir mettre une carte physique dans un téléphone de secours ?",
        ],
        p: [
          "La troisième question est celle qui décide, et c'est la moins posée. En France, la eSIM est parfaitement utilisable au quotidien ; elle devient une contrainte le jour où il faut basculer sur un téléphone prêté en vingt minutes.",
        ],
      },
    ],
    faq: [
      {
        q: "Un iPhone 13 français accepte-t-il la eSIM ?",
        a: "Oui. Les iPhone 13 et 13 mini, comme tous les modèles depuis les XS, XR et SE 2, acceptent une eSIM en plus d'une nano-SIM physique, et peuvent garder deux lignes actives.",
      },
      {
        q: "Peut-on mettre plusieurs eSIM sur un iPhone ?",
        a: "Plusieurs profils peuvent être enregistrés, mais un seul ou deux sont actifs à la fois selon le modèle. La limite exacte relève de l'opérateur et de la version d'iOS : à vérifier chez vous plutôt que dans un article.",
      },
      {
        q: "La eSIM use-t-elle la batterie plus vite ?",
        a: "Non, pas de façon mesurable : ce qui consomme, c'est la recherche de réseau et le fait de tenir deux lignes actives, pas le support. Un iPhone qui se décharge vite avec deux lignes actives est surtout un iPhone qui bascule entre deux antennes.",
      },
    ],
    sources: [S.macworld, S.itech],
    cta: {
      store: "iphone",
      titre: "Le rayon iPhone, modèle par modèle",
      texte: "Chaque fiche Amazon précise la région de vente et l'état — les deux lignes qui décident pour la eSIM.",
    },
    liens: ["/guides/verifier-garantie-iphone-numero-de-serie", "/boutique", "/guides/iphone-renewed-ce-que-ca-couvre"],
  },

  {
    slug: "iphone-verrouille-operateur-comment-verifier",
    titre: "iPhone verrouillé ou désimlocké : le vérifier avant de payer",
    titreSeo: "iPhone verrouillé opérateur : comment le vérifier avant d'acheter",
    description:
      "Le seul test qui prouve qu'un iPhone n'est pas verrouillé sur un opérateur, ce que le vendeur peut affirmer de bonne foi sans le savoir, et ce que le désimlockage coûte encore en 2026.",
    chapeau:
      "Un iPhone verrouillé est un téléphone qui n'accepte que la carte SIM d'un opérateur donné — souvent parce qu'il a été vendu subventionné, payé en plusieurs fois, ou déclaré perdu. Sur une annonce, cette information manque ou est inexacte plus souvent qu'on ne le croit, et le remboursement ensuite relève du bras de fer. Le contrôle prend trois minutes.",
    maj: TABLE_VERIF_FR,
    lecture: 4,
    blocs: [
      {
        h2: "Le contrôle qui ne ment pas",
        liste: [
          "Insérez une carte SIM d'un opérateur autre que celui annoncé (ou demandez à l'avoir au téléphone).",
          "Allumez l'appareil après un effacement complet : Réglages → Général → Transférer ou réinitialiser l'iPhone → Effacer contenu et réglages.",
          "Si l'assistant d'activation demande un code de déverrouillage ou refuse la carte, l'iPhone est verrouillé. S'il accepte la carte et capte le réseau, il ne l'est pas.",
        ],
        p: [
          "Pourquoi l'effacement est nécessaire : un iPhone déjà activé peut sembler libre parce qu'il garde la SIM d'origine insérée, sans jamais avoir eu à prouver sa liberté. Le test utile est donc « une SIM étrangère, après effacement » — et un vendeur qui refuse cette manipulation, avec vous, n'a pas de stock à vous vendre.",
          "Sans la carte sous la main, un repère complémentaire existe : Réglages → Général → Informations, ligne « Verrouillage SIM » (ou « Verrouillage du réseau »), qui affiche « Aucun verrouillage SIM » sur un appareil libre. Cette ligne est lue par iOS à l'activation ; elle peut donc être obsolète sur un appareil qui vient de changer de statut, mais elle reste un bon premier filtre.",
        ],
      },
      {
        h2: "Les trois origines d'un verrouillage",
        p: [
          "Le financement d'un forfait : l'opérateur verrouille tant que le téléphone n'est pas soldé, et libère sur demande une fois le solde réglé — parfois automatiquement, parfois après une démarche. L'ancienneté de l'achat ne garantit rien.",
          "Le blocage pour non-paiement ou pour déclaration de perte/vol : là, aucun code ne sera fourni, et un appareil déclaré volé peut en plus voir son IMEI bloqué sur les réseaux. Vérifier l'IMEI sur un service officiel de votre pays fait partie du contrôle, au même titre que le numéro de série.",
          "Le verrouillage d'activation (Localiser) : différent du verrouillage opérateur et plus grave, parce qu'un téléphone non désassocié du compte du précédent propriétaire est inutilisable, reformaté ou non. Le seul test est l'effacement devant vous.",
        ],
        encart: {
          type: "verifier",
          titre: "Ce que nous ne savons pas",
          texte:
            "Les conditions de désimlockage — délai, gratuité, démarche — dépendent de chaque opérateur et changent souvent. Nous ne publions pas de grille : demandez-la à votre opérateur, ou lisez ses conditions, avant de bâtir une négociation dessus.",
        },
      },
      {
        h2: "Acheter ailleurs : où est le risque",
        p: [
          "Un revendeur professionnel qui vend des lots d'opérateurs (les « lots carrier ») peut proposer un prix nettement plus bas sur un iPhone verrouillé, parfois sans le dire méchamment : le stock arrive étiqueté « sim-free » par erreur. C'est la raison pour laquelle une garantie de remboursement de 14 ou 30 jours, écrite dans les conditions de vente, vaut plus que n'importe quelle promesse dans une messagerie.",
          "C'est aussi ce que change un reconditionné vendu par un programme structuré : le désimlockage et la désassociation font partie du contrôle technique annoncé, et le retour reste possible pendant la fenêtre du vendeur.",
        ],
      },
    ],
    faq: [
      {
        q: "Un iPhone verrouillé peut-il être désimlocké gratuitement ?",
        a: "Cela dépend de l'opérateur d'origine et de la situation du contrat (solde payé ou non, engagement terminé ou non). Les délais et conditions bougent assez souvent pour qu'une réponse publiée sur un blog soit fausse le jour où vous en avez besoin : la seule source utilisable est votre opérateur.",
      },
      {
        q: "Un code de désimlockage peut-il être acheté en ligne ?",
        a: "Oui, et c'est un marché où l'arnaque est fréquente : le vendeur demande le numéro de série, encaisse, et fournit un code qui ne fonctionne pas ou rien du tout. Si un code est nécessaire, la voie propre passe par l'opérateur.",
      },
      {
        q: "Et pour un iPhone importé des États-Unis ?",
        a: "Deux précautions au lieu d'une : le verrouillage éventuel de l'opérateur américain, et l'absence de tiroir nano-SIM sur les modèles récents — vérifiez les deux avant de commander. Un appareil avec tiroir physique se dépanne plus facilement en Europe, un import eSIM-only vous obligera à rester chez un opérateur compatible eSIM.",
      },
    ],
    sources: [S.macworld],
    cta: {
      store: "iphone",
      titre: "Les iPhone du rayon, vendus par des professionnels",
      texte: "Conditions de retour, vendeur et état sont affichés sur la fiche Amazon de chaque référence.",
    },
    liens: ["/guides/iphone-renewed-ce-que-ca-couvre", "/guides/verifier-garantie-iphone-numero-de-serie", "/boutique"],
  },

  {
    slug: "quel-chargeur-pour-iphone",
    titre: "Quel chargeur pour quel iPhone : watts, charge rapide, et ce qui abîme",
    titreSeo: "Chargeur iPhone : 20 W, 30 W ou 40 W — lequel sert à quoi",
    description:
      "La puissance réellement utile d'un chargeur iPhone, pourquoi un 60 W ne charge pas plus vite qu'un 30 W sur un ancien modèle, et ce que Apple annonce sur la charge rapide selon la génération.",
    chapeau:
      "Un chargeur plus puissant n'abîme pas un iPhone et ne le fait pas non plus charger plus vite que son propre maximum. Toute la question est donc de savoir quel maximum a le vôtre — et si l'investissement dans un adaptateur plus musclé change quelque chose de mesurable sur votre usage.",
    maj: TABLE_VERIF_FR,
    lecture: 5,
    blocs: [
      {
        h2: "Ce que le chargeur décide, ce que l'iPhone décide",
        p: [
          "La charge se négocie en USB Power Delivery : le chargeur annonce des profils (9 V, 15 V, 20 V…) et une puissance maximale, l'iPhone prend ce qu'il sait consommer. Résultat : un adaptateur 60 W sur un iPhone limité à ~20 W ne chauffe pas plus et ne va pas plus vite ; un adaptateur sous-dimensionné, lui, allonge le temps de charge et peut être la cause de cette impression de « charge molle » quand le téléphone est utilisé en charge.",
          "Le vrai levier de puissance est apparu avec la génération 17 : Apple annonce environ 50 % de batterie en 20 minutes sur un iPhone 17 (50 % en 30 minutes sur l'iPhone Air), à condition d'utiliser un adaptateur d'au moins 40 W — l'adaptateur « dynamique » vendu 40 W pouvant monter à 60 W par pics. Sur iPhone 15 et 16, la charge rapide annoncée est d'environ 50 % en 30 minutes avec un adaptateur 20 W ou plus.",
        ],
      },
      {
        h2: "Le tableau de décision",
        liste: [
          "iPhone 8 au 14 : un adaptateur 20 W suffit ; plus n'apporte rien de mesurable.",
          "iPhone 15, 16 et 16e : 20 à 30 W pour la charge rapide officielle, 30 W si vous chargez aussi une tablette ou un portable léger.",
          "iPhone 17, 17 Pro, 17e : 40 W ou plus pour viser les 20 minutes annoncées ; en dessous, la charge est rapide mais pas au maximum annoncé.",
          "iPhone Air : 40 W, et la cible officielle est 30 minutes.",
          "Usage multi-appareils (téléphone + montre + tablette sur un seul port) : un 30 à 40 W multi-ports, au prix d'une puissance partagée par port.",
        ],
        encart: {
          type: "info",
          titre: "Le câble compte autant que la brique",
          texte:
            "Un câble USB-C non marqué pour la charge en puissance suffisante bride la négociation. Les câbles 60 W (le plus courant) suffisent pour un iPhone ; inutile de payer du 240 W pour un téléphone.",
        },
      },
      {
        h2: "Ce qui use une batterie, réellement",
        p: [
          "La chaleur et le temps passé à 100 %, pas la puissance de l'adaptateur. Une charge rapide dans un environnement chaud use plus qu'une charge lente au frais ; charger la nuit avec recharge optimisée est moins nocif que de maintenir le téléphone branché à plat sur un canapé ensoleillé. iOS gère une partie du problème (limites de charge, recharge optimisée selon l'horaire constaté) ; le reste relève de l'endroit où vous posez le téléphone.",
          "Si votre usage est « 20 % le matin, 100 % le soir », la batterie perdra de sa capacité plus vite qu'avec deux recharges courtes dans la journée — indépendamment du chargeur choisi.",
        ],
      },
      {
        h2: "Officiel ou tiers : ce qu'on regarde",
        p: [
          "La marque Apple n'est pas un prérequis ; la certification USB-IF et un avis de sécurité, si. Un chargeur non certifié qui fait disjoncter ou qui chauffe est un risque d'incendie, pas une économie de 12 euros. À puissance annoncée égale, la différence entre deux bons chargeurs se voit sur la tenue en température, pas sur la vitesse.",
        ],
      },
    ],
    faq: [
      {
        q: "Un chargeur de 30 W est-il un gaspillage pour un iPhone 15 ?",
        a: "Non, et c'est même le choix le plus raisonnable si vous avez plusieurs appareils : il couvre la charge rapide officielle de l'iPhone 15 (20 W ou plus) et garde de la marge pour un iPad. Vous ne gagnerez rien en vitesse par rapport à 20 W sur le téléphone seul, mais vous n'abîmerez rien non plus.",
      },
      {
        q: "La charge sans fil use-t-elle plus ?",
        a: "Elle chauffe davantage à puissance égale, et la chaleur est ce qui use. Une charge MagSafe sur une coque épaisse, dans une voiture en été, use plus vite qu'un câble au frais. Sur un vélo ou en voiture chaude, préférez le fil.",
      },
      {
        q: "Ai-je besoin d'un chargeur pour l'iPhone 17 ?",
        a: "Pour la charge rapide telle qu'Apple l'annonce (50 % en 20 minutes), il faut un adaptateur d'au moins 40 W ; les iPhone récents sont livrés sans adaptateur. C'est la ligne du catalogue où le 30 W officiel Apple reste le meilleur compromis si votre priorité n'est pas ce record de vingt minutes.",
      },
    ],
    sources: [S.frandroid, S.zero1net],
    cta: {
      store: "accessoires",
      titre: "Le rayon accessoires sur Amazon",
      texte: "Adaptateurs, câbles et chargeurs de montre — avec les avis récents et le prix du jour, que nous n'affichons pas.",
    },
    liens: ["/boutique", "/produit/apple-30w", "/guides/apple-intelligence-verifier-iphone"],
  },

  {
    slug: "iphone-renewed-ce-que-ca-couvre",
    titre: "iPhone « Renewed » : ce que le programme couvre, et les 5 points à vérifier",
    titreSeo: "iPhone Renewed Amazon : garantie, retour, et les 5 contrôles",
    description:
      "Ce que le programme de reconditionnement d'Amazon couvre vraiment, ce qu'il ne couvre pas, et la check-list des cinq contrôles à faire dans les premières heures sur un iPhone reconditionné.",
    chapeau:
      "Un iPhone reconditionné peut être le meilleur rapport qualité-prix de l'année — ou une mauvaise surprise sans recours. La différence tient à deux choses : qui est le vendeur, et ce que vous vérifiez dans la première heure après réception. Le programme Amazon Renewed règle la première, la check-list règle la seconde.",
    maj: TABLE_VERIF_FR,
    lecture: 5,
    blocs: [
      {
        h2: "Ce que le programme apporte",
        p: [
          "Un produit Renewed est vendu par un reconditionneur professionnel, contrôlé et remis en état selon un cahier des charges du programme, avec une garantie d'un an et une fenêtre de retour de 90 jours telle que le site marchand l'affiche sur ses fiches. Ajoutée au cadre légal français — la garantie légale de conformité de deux ans pour un bien d'occasion vendu par un professionnel —, c'est ce qui rend l'achat à distance défendable, là où une annonce entre particuliers ne laisse aucune prise.",
          "Ce que le programme ne promet pas : une batterie neuve à coup sûr, l'absence de trace d'usage, une étanchéité retrouvée, ni la même durée de support logiciel qu'un appareil neuf. La batterie est « testée » avec un minimum de capacité, pas remplacée systématiquement — c'est le point à lire dans l'annonce.",
        ],
        encart: {
          type: "verifier",
          titre: "Les chiffres qui comptent sont sur la fiche",
          texte:
            "Capacité minimale de batterie garantie, niveau esthétique (Premium / Excellent / Bon), et inclusion ou non d'accessoires : ces trois lignes varient d'un vendeur à l'autre au sein du même programme. Lisez la fiche du produit, pas notre résumé.",
        },
      },
      {
        h2: "Les cinq contrôles, dans l'ordre",
        liste: [
          "1. Effacement et activation devant vous : l'appareil doit demander votre Apple ID, pas celui d'un tiers, et finir l'assistant sans code de désimlockage.",
          "2. Réglages → Général → Informations → « Pièces et historique service » : un écran ou une batterie non d'origine y figure. Ce n'est pas rédhibitoire, mais cela change la valeur et la réparation future.",
          "3. Capacité de batterie : Réglages → Batterie → État de la batterie. Sous 85 % sur un appareil vendu « comme neuf », ouvrez le litige pendant la fenêtre de retour.",
          "4. Face ID, micros, haut-parleurs, capteurs de proximité, tous les micros, le flash, le bouton d'allumage : cinq minutes, et l'on gagne une semaine de SAV.",
          "5. Numéro de série recoupé avec la couverture officielle : trois minutes sur le site d'Apple pour vérifier que l'appareil correspond à ce qui est annoncé.",
        ],
      },
      {
        h2: "Renewed, « comme neuf », import : trois risques différents",
        p: [
          "Le reconditionné d'un vendeur unknown, même noté 5 étoiles, cumule les trois risques : pas de fenêtre de retour alignée sur le programme, provenance d'import (donc eSIM-only et bandes radio différentes), et historique de service opaque. Le même appareil vendu par un reconditionneur adossé au programme Renewed vous laisse 90 jours pour revenir en arrière.",
          "Pour un étudiant ou un téléphone d'appoint, l'écart de prix vaut le risque calculé. Pour un iPhone destiné à durer quatre ans avec un enfant dessus, la garantie compte plus que la remise.",
        ],
      },
      {
        h2: "Pourquoi un iPhone 13 Renewed reste un achat pertinent",
        p: [
          "C'est le plus ancien modèle de notre sélection à coûter une fraction du prix courant, il prend iOS 26 et ses correctifs, il a la même qualité photo de nuit que les deux générations suivantes pour un usage courant. Ce qu'il n'aura jamais : Apple Intelligence (il lui manque la puce et la mémoire), la Dynamic Island, et l'autonomie des générations récentes. Si ces trois points ne vous manquent pas, le calcul est simple.",
        ],
      },
    ],
    faq: [
      {
        q: "Un iPhone reconditionné est-il étanche ?",
        a: "Ne le considérez jamais comme tel. L'indice IP d'origine est mesuré sur un appareil neuf, et une ouverture en atelier rompt l'étanchéité des joints ; les programmes de reconditionnement ne garantissent pas l'étanchéité. Une coque et pas de piscine.",
      },
      {
        q: "Combien de temps un reconditionné sera-t-il mis à jour ?",
        a: "Autant que le même modèle non reconditionné. Un iPhone 13 reconditionné reçoit iOS 26 comme un iPhone 13 classique, et sera écarté le jour où la branche logicielle remontera la liste des puces : la remise en état ne change rien au calendrier matériel, qui dépend du processeur et non de l'état cosmétique.",
      },
      {
        q: "La batterie est-elle neuve ?",
        a: "Pas nécessairement : le programme exige une capacité minimale, ce qui laisse la place à une batterie d'origine en bon état comme à un remplacement. C'est écrit dans l'annonce du lot, et c'est le premier champ à regarder avant le prix.",
      },
    ],
    sources: [S.dgccrf2],
    cta: {
      store: "iphone",
      titre: "Les iPhone reconditionnés et neufs du rayon",
      texte: "Filtre par état, capacité de batterie annoncée, et conditions de retour visibles sur la fiche.",
    },
    liens: ["/guides/verifier-garantie-iphone-numero-de-serie", "/produit/iphone-13", "/comparatif"],
  },

  {
    slug: "ios-26-sur-iphone-13-14-15",
    titre: "iOS 26 sur iPhone 13, 14 et 15 : ce que vous gagnez, ce qui manque",
    titreSeo: "iOS 26 sur iPhone 13, 14, 15 : le bilan honnête",
    description:
      "Ce qu'un iPhone 13, 14 ou 15 reçoit réellement avec iOS 26, les fonctions absentes pour raison matérielle, et comment décider si l'upgrade vaut un changement de téléphone.",
    chapeau:
      "Ces trois générations sont le cœur du marché de l'occasion : elles installent toutes iOS 26, elles gardent les correctifs de sécurité, et elles n'ont pas droit aux mêmes choses. Voici la frontière exacte, fonction par fonction, avant de se demander s'il faut changer de téléphone.",
    maj: TABLE_VERIF_FR,
    lecture: 4,
    blocs: [
      {
        h2: "Ce qui arrive pareil sur les trois",
        p: [
          "La refonte de l'interface (le style de navigation plus dense, les boutons repensés, les apps Apple adaptées), les mises à jour de l'app Photos avec les scènes spatiales à partir de l'iPhone 12, les améliorations de Messagerie et de Téléphone, les outils de traduction en direct, le nouveau gestionnaire de mots de passe, les correctifs de sécurité annuels. Autrement dit, l'essentiel de ce qu'on appelle « la nouvelle version » arrive vraiment.",
        ],
      },
      {
        h2: "Ce qui manque, et pourquoi",
        p: [
          "Trois absences ont une cause matérielle et non logicielle, donc définitive. Apple Intelligence (résumé d'notifications, rédaction assistée, demandes à Siri plus contextuelles, Visual Intelligence) demande la puce A17 Pro et 8 Go : les trois générations concernées ont 4 ou 6 Go. L'Energy/Adaptive Power, qui étend l'autonomie en adaptant la fréquence, est réservé aux 15 Pro et plus récents. Et certains raffinements de l'appareil photo — nettoyage d'objectif, options de Camera Control — supposent iPhone 15 ou plus.",
        ],
        encart: {
          type: "info",
          titre: "Le détail qui trompe",
          texte:
            "L'iPhone 14 Pro et le 15 standard partagent une même puce A16 et 6 Go : ni l'un ni l'autre n'aura Apple Intelligence. La génération ne protège pas, c'est la combinaison puce-mémoire qui protège.",
        },
      },
      {
        h2: "Faut-il changer de téléphone pour autant ?",
        liste: [
          "Vous voulez l'assistant sur l'appareil : oui, et le plancher le moins cher est un iPhone 15 Pro / 16e d'occasion — pas un 17 neuf.",
          "Vous voulez surtout l'autonomie : un 16 ou 17 change le quotidien, une batterie neuve sur votre 13 change presque autant pour cinq fois moins cher.",
          "Vous voulez la photo de nuit et le zoom : les écarts entre 13, 15 et 16 sont réels mais faibles en usage courant ; le vrai saut est sur le téléobjectif des Pro.",
          "Vous êtes à plus de 80 % de capacité et l'appareil est fluide : gardez-le, iOS 26 est encore prévu pour de nombreuses versions.",
        ],
      },
      {
        h2: "Le tableau, filtré sur ces trois générations",
        p: [
          "Généré depuis notre table de compatibilité — les valeurs sont les mêmes que sur le guide iOS 26, et le contrôle de build refuse qu'elles divergent.",
        ],
      },
    ],
    table: {
      legende: "iPhone 13, 14, 15 sous iOS 26",
      tableFrom: "iphone",
      filtre: ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone SE (3ᵉ"],
      note: "Relevé " + TABLE_VERIF_FR + ". Les restrictions de la colonne « Apple Intelligence » ne se lèvent pas par mise à jour logicielle.",
    },
    faq: [
      {
        q: "L'iPhone 13 va-t-il bientôt être abandonné ?",
        a: "Il est pris en charge par iOS 26, et les iPhone restent généralement supportés six à sept ans après leur sortie ; l'iPhone 11 l'est encore. Un abandon soudain n'est pas le scénario probable — mais aucune date n'est annoncée, et nous n'en inventons pas.",
      },
      {
        q: "iOS 26 ralentit-il les anciens iPhone ?",
        a: "Le ressenti après une grande version vient le plus souvent de l'indexation des données et de la batterie, pas du processeur : après la mise à jour, quelques jours de fonctionnement normal rétablissent la situation. Si la lenteur persiste, regardez la capacité de batterie avant d'accuser iOS.",
      },
      {
        q: "Un iPhone 15 standard a-t-il un intérêt en 2026 ?",
        a: "Oui pour un usage courant : Dynamic Island, USB-C, bon capteur, iOS 26. Non si Apple Intelligence est votre critère — c'est précisément la génération où le piège se referme, parce que seul le 15 Pro est éligible.",
      },
    ],
    sources: [S.itech, S.macworld],
    cta: {
      store: "iphone",
      titre: "Les anciens iPhone, vus par Amazon",
      texte: "13, 15, 16 et 17e dans le rayon, avec le prix et le stock du jour sur chaque fiche.",
    },
    liens: ["/guides/ios-26-quels-iphone-compatibles", "/comparatif", "/produit/iphone-15"],
  },
];

export function getGuide(slug) {
  return GUIDES.find((g) => g.slug === slug) || null;
}

/** Les sources communes à tous les guides (table de compatibilité). */
export const SOURCES_COMMUNES = TABLE_SOURCES.map((s) => ({ ...s, consulte: TABLE_VERIF_FR }));
