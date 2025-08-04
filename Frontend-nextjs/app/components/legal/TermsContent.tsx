import { Mail } from "lucide-react";

export default function TermsContent() {
    return (
        <div className="prose prose-sm max-w-none space-y-3">
            <p>
                L’accesso a Synapsy è offerto in modalità beta e viene fornito “così com’è”, senza alcuna garanzia di
                disponibilità, corretto funzionamento o continuità del servizio. Funzionalità, interfaccia e dati
                salvati possono variare o essere rimossi senza preavviso durante il periodo di test.
            </p>
            <p>
                Si sconsiglia l’utilizzo per dati sensibili o privi di backup personale. L’autore non si assume
                responsabilità per eventuali malfunzionamenti, perdite o cancellazioni di dati.
            </p>
            <p>
                Gli account e i relativi dati potranno essere cancellati in qualsiasi momento dall’utente, tramite la
                sezione <b>Profilo</b> (“Elimina profilo”), oppure a seguito della chiusura della beta.
            </p>
            <p>
                Per domande, segnalazioni o feedback puoi scrivere a{" "}
                <a
                    href="mailto:synapsy.customer@gmail.com"
                    className="inline-flex items-center gap-1 text-primary underline font-semibold hover:text-primary-dark transition"
                >
                    <Mail size={16} className="inline-block -mt-0.5" />
                    synapsy.customer@gmail.com
                </a>
                .
            </p>
        </div>
    );
}

