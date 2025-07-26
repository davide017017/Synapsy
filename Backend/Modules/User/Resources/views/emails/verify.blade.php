@component('mail::message')
# {{ $title ?? __('Verifica Email') }}

{{ $intro ?? __('Per completare l\'operazione clicca sul pulsante seguente.') }}

@component('mail::button', ['url' => $url])
{{ $buttonText ?? __('Verifica') }}
@endcomponent

{{ __('Se non hai richiesto questa azione puoi ignorare questa email.') }}

@endcomponent
