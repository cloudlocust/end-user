import { FAQItem } from 'src/modules/shared/FAQ/FAQ.types'
import { FormattedMessage } from 'src/common/react-platform-translation'

/**
 * The title of the FAQ for the daily period.
 */
export const faqTitleForDailyPeriod = (
    <FormattedMessage
        id="Comprendre ma consommation journalière"
        defaultMessage="Comprendre ma consommation journalière"
    />
)
/**
 *  The FAQ items questions/answers for the daily period.
 */
export const faqForDailyPeriod: Array<FAQItem> = [
    {
        title: (
            <FormattedMessage
                id="Pourquoi la consommation instantanée sur mon NRLink et ma page consommation à la minute montrent des valeurs différentes ?"
                defaultMessage="Pourquoi la consommation instantanée sur mon NRLink et ma page consommation à la minute montrent des valeurs différentes ?"
            />
        ),
        content: (
            <FormattedMessage
                id={`
🎛️ Afin de rendre notre service accessible à tous, sur votre nrLINK nous affichons une consommation en watts. Toutefois, il convient de préciser que ce chiffre ne représente pas exactement une consommation en watts, mais plutôt les "VA" qui sont visibles sur votre compteur Linky.
        
Les VA, c’est la mesure de puissance apparente qui correspond à la somme de la puissance réactive + la puissance active.
                    
🤓 La Minute Électrique : La puissance apparente représente toute l'électricité qui traverse votre logement à un instant donné. 
                    
        ● Une partie de cette électricité est effectivement consommée et donc facturée, c’est la puissance active. C'est l’électricité que vous utilisez lorsque vous mettez en marche un appareil électrique. 
                    
        ● Une autre partie de l’électricité qui entre dans votre logement, ne fait que traverser sans être consommée et n'est donc pas facturée, la puissance réactive. C’est l'électricité qui traverse les condensateurs et les résistances des appareils par exemple.
                    
Donc puissance apparente = puissance active + puissance réactive. Plus vous avez d’appareils chez vous, plus votre puissance réactive est élevée et ne sachant pas combien d’appareils ni combien ces derniers ont de résistances… nous ne pouvons pas déduire de façon certaine uniquement l’électricité que vous payez à savoir la puissance active, soyez rassuré, nous travaillons sur ce sujet ! 
                    
📱 Dans notre application, sur la vue à la minute, vous ne visualisez pas une donnée instantanée. 
Nous calculons une puissance moyenne à partir de l’évolution de vos index de consommation.
                `}
                defaultMessage={`
🎛️ Afin de rendre notre service accessible à tous, sur votre nrLINK nous affichons une consommation en watts. Toutefois, il convient de préciser que ce chiffre ne représente pas exactement une consommation en watts, mais plutôt les "VA" qui sont visibles sur votre compteur Linky.

Les VA, c’est la mesure de puissance apparente qui correspond à la somme de la puissance réactive + la puissance active.
                    
🤓 La Minute Électrique : La puissance apparente représente toute l'électricité qui traverse votre logement à un instant donné. 
                    
        ● Une partie de cette électricité est effectivement consommée et donc facturée, c’est la puissance active. C'est l’électricité que vous utilisez lorsque vous mettez en marche un appareil électrique. 
                    
        ● Une autre partie de l’électricité qui entre dans votre logement, ne fait que traverser sans être consommée et n'est donc pas facturée, la puissance réactive. C’est l'électricité qui traverse les condensateurs et les résistances des appareils par exemple.
                    
Donc puissance apparente = puissance active + puissance réactive. Plus vous avez d’appareils chez vous, plus votre puissance réactive est élevée et ne sachant pas combien d’appareils ni combien ces derniers ont de résistances… nous ne pouvons pas déduire de façon certaine uniquement l’électricité que vous payez à savoir la puissance active, soyez rassuré, nous travaillons sur ce sujet ! 
                    
📱 Dans notre application, sur la vue à la minute, vous ne visualisez pas une donnée instantanée. 
Nous calculons une puissance moyenne à partir de l’évolution de vos index de consommation.
                    `}
            />
        ),
    },
    {
        title: (
            <FormattedMessage
                id="Pourquoi la consommation instantanée sur mon NRLink et celle sur la page d’accueil de l’application montrent des valeurs différentes ?"
                defaultMessage="Pourquoi la consommation instantanée sur mon NRLink et celle sur la page d’accueil de l’application montrent des valeurs différentes ?"
            />
        ),
        content: (
            <FormattedMessage
                id={`
🎛️ sur votre nrLINK votre puissance instantanée est mise à jours environ toutes les 2 à 4 secondes.
    
📱 Dans notre application, sur la page d’accueil, le widget dernière puissance remontée affiche une des 60 valeurs de la dernière minute, il peut donc avoir une légère différence à l’instant T.
                        `}
                defaultMessage={`
🎛️ sur votre nrLINK votre puissance instantanée est mise à jours environ toutes les 2 à 4 secondes.
                
📱 Dans notre application, sur la page d’accueil, le widget dernière puissance remontée affiche une des 60 valeurs de la dernière minute, il peut donc avoir une légère différence à l’instant T.
                        `}
            />
        ),
    },
    {
        title: (
            <FormattedMessage
                id="Pourquoi est-ce que j’ai des “trous” dans ma consommation journalière ?"
                defaultMessage="Pourquoi est-ce que j’ai des “trous” dans ma consommation journalière ?"
            />
        ),
        content: (
            <FormattedMessage
                id={`
🎛️ La prise TIC que vous avez ajouté sur votre Linky rapporte les informations à votre nrLINK grâce à des ondes radio, puis le nrLINK transmet les informations à l’application via votre réseau wifi.
Par ailleurs, parfois les Linky peuvent ne pas rapporter correctement les données en cas de dysfonctionnement ou de problème de communication.
Cela donne donc plusieurs opportunités de perdre de la donnée en route… 
                            
                            
📱 Lorsque des “trous” apparaissent nous allons chercher les informations auprès d’Enedis pour les combler; malheureusement ces informations ne sont pas disponibles en temps réel et les données de consommation ne sont pas disponibles à la minute mais à la demie-heure. Plutôt que de vous fournir une valeur approximative, nous préférons vous informer que la donnée réelle est manquante.
                            
Votre historique à la semaine, au mois ou encore à l’année vous permet d’avoir une vue d’ensemble et complète de votre consommation.
                        `}
                defaultMessage={`
🎛️ La prise TIC que vous avez ajouté sur votre Linky rapporte les informations à votre nrLINK grâce à des ondes radio, puis le nrLINK transmet les informations à l’application via votre réseau wifi.
Par ailleurs, parfois les Linky peuvent ne pas rapporter correctement les données en cas de dysfonctionnement ou de problème de communication.
Cela donne donc plusieurs opportunités de perdre de la donnée en route… 
                            
                            
📱 Lorsque des “trous” apparaissent nous allons chercher les informations auprès d’Enedis pour les combler; malheureusement ces informations ne sont pas disponibles en temps réel et les données de consommation ne sont pas disponibles à la minute mais à la demie-heure. Plutôt que de vous fournir une valeur approximative, nous préférons vous informer que la donnée réelle est manquante.
                            
Votre historique à la semaine, au mois ou encore à l’année vous permet d’avoir une vue d’ensemble et complète de votre consommation.
                        `}
            />
        ),
    },
    {
        title: (
            <FormattedMessage
                id="Comment est calculée ma consommation totale affichée dans les chiffres clés ?"
                defaultMessage="Comment est calculée ma consommation totale affichée dans les chiffres clés ?"
            />
        ),
        content: (
            <FormattedMessage
                id={`
Sur une journée en cours, votre consommation totale est la différence entre votre index de consommation à minuit et votre index de consommation à l’instant T. Si vous n’avez pas d’index de consommation connu à minuit alors, le total est calculé en faisant la somme de toutes les données reçues sur la journée, c’est donc potentiellement un total incomplet sur la journée en cours. Les données sur la vue semaine une fois la journée passée sont complétées par les données Enedis si ces dernières sont disponibles, n’hésitez pas à les consulter pour avoir une vue globale de votre consommation.
                        `}
                defaultMessage={`
Sur une journée en cours, votre consommation totale est la différence entre votre index de consommation à minuit et votre index de consommation à l’instant T. Si vous n’avez pas d’index de consommation connu à minuit alors, le total est calculé en faisant la somme de toutes les données reçues sur la journée, c’est donc potentiellement un total incomplet sur la journée en cours. Les données sur la vue semaine une fois la journée passée sont complétées par les données Enedis si ces dernières sont disponibles, n’hésitez pas à les consulter pour avoir une vue globale de votre consommation.
                        `}
            />
        ),
    },
    {
        title: (
            <FormattedMessage
                id="Pourquoi je ne peux pas voir ma veille sur ma journée en cours ?"
                defaultMessage="Pourquoi je ne peux pas voir ma veille sur ma journée en cours ?"
            />
        ),
        content: (
            <FormattedMessage
                id={`
La valeur de veille est calculée en prenant les données consécutives de consommation les plus basses sur une durée de 1H. Cela correspond en général à la veille de votre foyer. Il faut alors une journée complète pour avoir une valeur la plus fiable possible, c’est pour cette raison que la veille n’est pas disponible sur la journée en cours.
                        `}
                defaultMessage={`
La valeur de veille est calculée en prenant les données consécutives de consommation les plus basses sur une durée de 1H. Cela correspond en général à la veille de votre foyer. Il faut alors une journée complète pour avoir une valeur la plus fiable possible, c’est pour cette raison que la veille n’est pas disponible sur la journée en cours.
                        `}
            />
        ),
    },
    {
        title: (
            <FormattedMessage
                id="Pourquoi je ne peux pas voir les € sur ma courbe de journée en cours ?"
                defaultMessage="Pourquoi je ne peux pas voir les € sur ma courbe de journée en cours ?"
            />
        ),
        content: (
            <FormattedMessage
                id={`
A la minute, on ne peut pas parler de  kwh, ou alors ça serait des kwminute !
Cela n’aurait aucun sens d’afficher 0.000000001 cts sur une minute ! 
                
Une consommation s’exprime en heure, sur le nrlink nous affichons un prix qui supposerait que votre puissance reste identique pendant 1H afin de vous donner une idée plus “palpable” de votre consommation à l’instant T.
                        `}
                defaultMessage={`
A la minute, on ne peut pas parler de  kwh, ou alors ça serait des kwminute !
Cela n’aurait aucun sens d’afficher 0.000000001 cts sur une minute ! 
                
Une consommation s’exprime en heure, sur le nrlink nous affichons un prix qui supposerait que votre puissance reste identique pendant 1H afin de vous donner une idée plus “palpable” de votre consommation à l’instant T.
                        `}
            />
        ),
    },
]

/**
 * The title of the FAQ for the daily tempo.
 */
export const faqTitleForDailyPeriodTempo = 'Comprendre ma consommation Tempo'
/**
 *  The FAQ items questions/answers for the daily tempo.
 */
export const faqForDailyPeriodTempo: Array<FAQItem> = [
    {
        title: 'Comment expliquer ma consommation alors que je suis absent(e) tempo?',
        content:
            'Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa. Sit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
    },
    {
        title: 'Pourquoi ma facture ne reflète-t-elle pas ma consommation mensuelle tempo ?',
        content:
            'Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est. Aute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
    },
    {
        title: 'Est-il possible de suivre ma consommation en temps réel tempo?',
        content:
            'Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa. Culpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
    },
    {
        title: 'Comment sont utilisées mes données de consommation tempo ?',
        content:
            'Excepteur deserunt tempor do lorem elit id magna pariatur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor. Consequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
    },
]

/**
 * The title of the FAQ for the periodic intervals.
 */
export const faqTitleForPeriodicIntervals = 'Comprendre ma consommation Periodic'

/**
 *  The FAQ items questions/answers for the periodic intervals.
 */
export const faqForPeriodicIntervals: Array<FAQItem> = [
    {
        title: 'Comment expliquer ma consommation alors que je suis absent(e) Periodic?',
        content:
            'Magna consectetur culpa duis ad est tempor parifatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa. Sit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
    },
    {
        title: 'Pourquoi ma facture ne reflète-t-elle pas ma consommation mensuelle Periodic?',
        content:
            'Et in lorem qui ipsum deserunt duis exercitation lorsem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est. Aute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
    },
    {
        title: 'Est-il possible de suivre ma consommation en temps réel Periodic?',
        content:
            'Id fugiat et cupidatat magna nulla nulla eu cillum offifcia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa. Culpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
    },
    {
        title: 'Comment sont utilisées mes données de consommation Periodic?',
        content:
            'Excepteur deserunt tempor do lorem elit id magna pariaetur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor. Consequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
    },
]

/**
 * The title of the FAQ for the periodic intervals tempo.
 */
export const faqTitleForPeriodicIntervalsTempo = 'Comprendre ma consommation Periodic Tempo'

/**
 *  The FAQ items questions/answers for the periodic intervals tempo.
 */
export const faqForPeriodicIntervalsTempo: Array<FAQItem> = [
    {
        title: 'Comment expliquer ma consommation alors que je suis absent(e) Periodic tempo?',
        content:
            'Magna consectetur culpa duis ad est tempor pariatur velfit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa. Sit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
    },
    {
        title: 'Pourquoi ma facture ne reflète-t-elle pas ma consommatiosn mensuelle Periodic tempo ?',
        content:
            'Et in lorem qui ipsum deserunt duis exercitation lorem eleit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est. Aute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
    },
    {
        title: 'Est-il possible de suivre ma consommation en temps réel Periodic tempo?',
        content:
            'Id fugiat et cupidatat magna nulla nulla eu cillum officdia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa. Culpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
    },
    {
        title: 'Comment sont utilisées mes données de consommation Periodic tempo ?',
        content:
            'Excepteur deserunt tempor do lorem elit id magna pariatsur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor. Consequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
    },
]
