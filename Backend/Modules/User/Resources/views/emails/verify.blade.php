<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? __('Verifica Email') }}</title>
</head>
<body style="margin:0;padding:20px;background:#f7f7f7;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border:1px solid #eaeaea;padding:20px;">
                <tr>
                    <td>
                        <h1 style="font-size:20px;color:#333333;margin:0 0 20px;">{{ $title ?? __('Verifica Email') }}</h1>
                        <p style="margin:0 0 20px;">{{ $intro ?? __('Per completare l\'operazione clicca sul pulsante seguente.') }}</p>
                        <p style="text-align:center;margin:30px 0;">
                            <a href="{{ $url }}" style="display:inline-block;padding:10px 20px;background:#3267FF;color:#ffffff;text-decoration:none;border-radius:4px;">
                                {{ $buttonText ?? __('Verifica') }}
                            </a>
                        </p>
                        <p style="font-size:12px;color:#666;margin:0;">{{ __('Se non hai richiesto questa azione puoi ignorare questa email.') }}</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
