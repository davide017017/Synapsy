<x-mail::layout>

    {{-- *** AGGIUNGI QUESTO BLOCCO style PER STILI GLOBALI *** --}}
    <style>
        /* Aggiungi qui le tue regole CSS. 
        Attenzione: usa solo CSS supportato dai client email!
        Evita selettori complessi, float, position, ecc. 
        Concentrati su colori, font, margini, padding, bordi.
        */

        body {
            font-family: sans-serif; /* Esempio: font generico */
            line-height: 1.6; /* Esempio: spaziatura tra le righe */
            color: #333333; /* Esempio: colore del testo scuro */
            background-color: #f4f4f4; /* Esempio: colore di sfondo del corpo */
        }

        h1, h2, h3, h4, h5, h6 {
            color: #1A1A1A; /* Esempio: colore per i titoli */
            margin-top: 0;
        }

        p {
            margin-bottom: 10px; /* Esempio: spazio sotto i paragrafi */
        }

        a {
            color: #4A7C59; /* Esempio: colore link (verde pastello scuro) */
            text-decoration: none; /* Rimuove sottolineatura link */
        }

        .button {
            /* Questo selettore .button potrebbe essere usato nel componente button.blade.php
            per applicare stili definiti qui centralmente.
            Assicurati che i selettori nel tuo CSS corrispondano alle classi/elementi 
            nei template o componenti che vuoi stilizzare.
            */
            display: inline-block; /* Essenziale per pulsanti */
            background-color: #4A7C59; /* Esempio: colore di sfondo del pulsante (verde pastello scuro) */
            color: #ffffff ; /* Esempio: colore testo pulsante (bianco), !important per forzare */
            padding: 10px 20px; /* Spaziatura interna del pulsante */
            text-decoration: none ; /* Assicura no sottolineatura */
            border-radius: 5px; /* Angoli arrotondati */
            /* Aggiungi altri stili per il pulsante se necessario */
        }

        /* Aggiungi altre regole CSS qui se vuoi */

    </style>
    {{-- *** FINE BLOCCO style *** --}}


    {{-- Header --}}
    <x-slot:header>
        <x-mail::header :url="config('app.url')">
            {{ config('app.name') }}
        </x-mail::header>
    </x-slot:header>

    {{-- Body (Contenuto Principale dall'Notifica) --}}
    {{-- Usiamo le variabili passate dalla notifica direttamente qui --}}

    @foreach ($introLines as $line)
        {{ $line }}

    @endforeach

    @isset($actionText)
        <?php
            // Determina il colore del pulsante (copiato dal template standard)
            $color = match ($level ?? 'primary') {
                'success', 'error' => $level,
                default => 'primary',
            };
        ?>
        <x-mail::button :url="$actionUrl" :color="$color">
            {{ $actionText }}
        </x-mail::button>
    @endisset

    @foreach ($outroLines as $line)
        {{ $line }}

    @endforeach
    {{-- Fine Contenuto Principale --}}


    {{-- Subcopy (Testo sotto il pulsante con link alternativo) --}}
    @isset($actionText)
        <x-slot:subcopy>
            @lang(
                "If you're having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
                'into your web browser:',
                [
                    'actionText' => $actionText,
                ]
            ) <span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
        </x-slot:subcopy>
    @endisset


    {{-- Footer --}}
    <x-slot:footer>
        <x-mail::footer>
            {{-- Il tuo contenuto del footer personalizzato va qui --}}
            © {{ date('Y') }} {{ config('app.name') }}. @lang('Tutti i diritti riservati.') {{-- <-- LA TUA RIGA DEL COPYRIGHT --}}
            {{-- Puoi aggiungere altre linee qui se vuoi --}}
            {{-- <br>Via Roma 1, 00100 Roma - P.IVA 1234567890 --}}
        </x-mail::footer>
    </x-slot:footer>

</x-mail::layout>