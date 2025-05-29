<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Dettagli Spesa') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-xl mx-auto px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100 space-y-5">

                {{-- 🗓️ Data --}}
                <p>
                    <span class="font-medium">📅 Data:</span>
                    {{ $spesa->date?->format('d/m/Y') }}
                </p>

                {{-- 📝 Descrizione --}}
                <p>
                    <span class="font-medium">📝 Descrizione:</span>
                    {{ $spesa->description }}
                </p>

                {{-- 💶 Importo --}}
                <p>
                    <span class="font-medium">💶 Importo:</span>
                    {{ number_format($spesa->amount, 2, ',', '.') }} €
                </p>

                {{-- 🗂️ Categoria --}}
                <p>
                    <span class="font-medium">🗂️ Categoria:</span>
                    {{ $spesa->category->name ?? '-' }}
                </p>

                {{-- 🗒️ Note --}}
                <p>
                    <span class="font-medium">🗒️ Note:</span>
                    {{ $spesa->notes ?? '-' }}
                </p>

                {{-- 🔧 Azioni --}}
                <div class="flex justify-end flex-wrap gap-3 pt-6 mt-6 border-t border-gray-300 dark:border-gray-600">

                    {{-- Torna indietro --}}
                    <a href="{{ route('spese.web.index') }}"
                        class="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition">
                        ⬅️ Torna indietro
                    </a>

                    {{-- Modifica --}}
                    <a href="{{ route('spese.web.edit', $spesa->id) }}"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition">
                        ✏️ Modifica
                    </a>

                    {{-- Elimina --}}
                    <form action="{{ route('spese.web.destroy', $spesa->id) }}" method="POST"
                        onsubmit="return confirm('Sei sicuro di voler eliminare questa spesa?');">
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
