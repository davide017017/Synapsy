<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $title ?? 'Synapsy' }}</title>
</head>
<!--
    Layout: table-based per compatibilità client email.
    Stile: dark card, accento verde #14b88a, font stack sicuri.
    No JS, no CSS moderno non supportato.
-->
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,Helvetica,sans-serif;">

    {{-- Wrapper esterno --}}
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0d0d0d;min-width:100%;">
        <tr>
            <td align="center" style="padding:40px 16px;">

                {{-- Card centrale --}}
                <table width="560" cellpadding="0" cellspacing="0" role="presentation"
                    style="max-width:560px;width:100%;background-color:#141414;border-radius:6px;border-top:3px solid #14b88a;overflow:hidden;">

                    {{-- Header: logo / brand --}}
                    <tr>
                        <td style="padding:28px 36px 0 36px;">
                            <span style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#14b88a;">
                                SYNAPSY
                            </span>
                        </td>
                    </tr>

                    {{-- Separatore sottile --}}
                    <tr>
                        <td style="padding:16px 36px 0 36px;">
                            <div style="height:1px;background-color:#222222;font-size:0;line-height:0;">&nbsp;</div>
                        </td>
                    </tr>

                    {{-- Corpo: titolo + intro + pulsante --}}
                    <tr>
                        <td style="padding:28px 36px 32px 36px;">

                            {{-- Titolo --}}
                            <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:600;color:#ffffff;line-height:1.3;">
                                {{ $title ?? 'Verifica Email' }}
                            </h1>

                            {{-- Intro (opzionale) --}}
                            @isset($intro)
                            <p style="margin:0 0 28px 0;font-size:14px;color:#aaaaaa;line-height:1.6;">
                                {{ $intro }}
                            </p>
                            @endisset

                            {{-- Pulsante CTA --}}
                            <table cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="border-radius:4px;background-color:#14b88a;">
                                        <a href="{{ $url }}"
                                            style="display:inline-block;padding:11px 26px;font-size:14px;font-weight:600;color:#0d0d0d;text-decoration:none;letter-spacing:0.3px;">
                                            {{ $buttonText ?? 'Continua' }}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            {{-- Fallback URL testuale --}}
                            <p style="margin:20px 0 0 0;font-size:11px;color:#555555;line-height:1.5;word-break:break-all;">
                                Se il pulsante non funziona, copia questo link nel browser:<br>
                                <span style="color:#14b88a;">{{ $url }}</span>
                            </p>

                        </td>
                    </tr>

                    {{-- Separatore --}}
                    <tr>
                        <td style="padding:0 36px;">
                            <div style="height:1px;background-color:#222222;font-size:0;line-height:0;">&nbsp;</div>
                        </td>
                    </tr>

                    {{-- Footer minimale --}}
                    <tr>
                        <td style="padding:20px 36px 28px 36px;">
                            <p style="margin:0 0 6px 0;font-size:11px;color:#444444;line-height:1.5;">
                                Se non hai richiesto questa operazione, puoi ignorare questa email.
                            </p>
                            <p style="margin:0;font-size:11px;color:#333333;">
                                Synapsy &middot; auth system
                            </p>
                        </td>
                    </tr>

                </table>
                {{-- /Card --}}

            </td>
        </tr>
    </table>

</body>
</html>
