@php use Illuminate\Support\Str; @endphp

<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Dettagli Operazione Ricorrente') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-xl mx-auto px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100 space-y-5">

                {{-- ✅ Dettagli --}}
                <p><span class="font-medium">📝 Descrizione:</span> {{ $recurringOperation->description }}</p>
                <p><span class="font-medium">💶 Importo:</span> {{ number_format($recurringOperation->amount, 2, ',', '.') }} €</p>
                <p><span class="font-medium">🎯 Tipo:</span> {{ ucfirst($recurringOperation->type) }}</p>
                <p><span class="font-medium">📅 Inizio:</span> {{ $recurringOperation->start_date?->format('d/m/Y') }}</p>
                <p><span class="font-medium">📅 Fine:</span> {{ $recurringOperation->end_date?->format('d/m/Y') ?? '-' }}</p>
                <p><span class="font-medium">🔁 Frequenza:</span> Ogni {{ $recurringOperation->interval }} {{ Str::plural($recurringOperation->frequency) }}</p>
                <p><span class="font-medium">📆 Prossima occorrenza:</span> {{ $recurringOperation->next_occurrence_date?->format('d/m/Y') ?? '-' }}</p>
                <p><span class="font-medium">🗂️ Categoria:</span> {{ $recurringOperation->category->name ?? '-' }}</p>
                <p><span class="font-medium">🗒️ Note:</span> {{ $recurringOperation->notes ?? '-' }}</p>
                <p><span class="font-medium">✅ Attiva:</span> {{ $recurringOperation->is_active ? 'Sì' : 'No' }}</p>

                {{-- 🔧 Azioni --}}
                <div class="flex justify-end flex-wrap gap-3 pt-6 mt-6 border-t border-gray-300 dark:border-gray-600">

                    {{-- Torna indietro --}}
                    <a href="{{ route('recurring-operations.index') }}"
                        class="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition">
                        ⬅️ Torna indietro
                    </a>

                    {{-- Modifica --}}
                    <a href="{{ route('recurring-operations.edit', $recurringOperation->id) }}"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition">
                        ✏️ Modifica
                    </a>

                    {{-- Elimina --}}
                    <form action="{{ route('recurring-operations.destroy', $recurringOperation->id) }}" method="POST"
                        onsubmit="return confirm('Sei sicuro di voler eliminare questa operazione ricorrente?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition">
                            🗑️ Elimina
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
