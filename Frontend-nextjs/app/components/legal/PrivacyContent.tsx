import { Mail } from "lucide-react";

export default function PrivacyContent() {
    return (
        <div className="prose prose-sm max-w-none space-y-3">
            <p>
                Questa versione beta raccoglie solo i dati strettamente necessari per il funzionamento e il test di
                Synapsy: nome, email, username e password. I dati inseriti sono utilizzati esclusivamente a fini di test
                e potrebbero essere cancellati senza preavviso durante il periodo di beta pubblica.
            </p>
            <p>
                Non condividiamo nessuna informazione con terze parti. Puoi in qualsiasi momento richiedere la
                cancellazione scrivendo a{" "}
                <a
                    href="mailto:synapsy.customer@gmail.com"
                    className="inline-flex items-center gap-1 text-primary underline font-semibold hover:text-primary-dark transition"
                >
                    <Mail size={16} className="inline-block -mt-0.5" />
                    synapsy.customer@gmail.com
                </a>
                .<br />
                In alternativa, puoi eliminare autonomamente il tuo profilo dalla sezione <b>Profilo</b> selezionando
                l’opzione <b>Elimina profilo</b>. Dopo la richiesta, il tuo account verrà disattivato e potrà essere
                definitivamente rimosso entro 30 giorni.
            </p>
            <p>
                Utilizzando questa beta accetti che eventuali errori possano causare perdita di dati. Per segnalare bug
                o suggerimenti, scrivici a{" "}
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
