<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Dettagli Categoria') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-xl mx-auto px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100 space-y-5">

                @if ($category)

                    {{-- 🏷️ Nome --}}
                    <p>
                        <span class="font-medium">🏷️ Nome:</span>
                        {{ $category->name }}
                    </p>

                    {{-- 🗂️ Tipo --}}
                    <p>
                        <span class="font-medium">🗂️ Tipo:</span>
                        @if($category->type === 'entrata')
                            <span class="inline-block px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded dark:bg-green-900 dark:text-green-100">
                                Entrata
                            </span>
                        @elseif($category->type === 'spesa')
                            <span class="inline-block px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-100 rounded dark:bg-red-900 dark:text-red-100">
                                Spesa
                            </span>
                        @else
                            <span class="text-sm text-gray-500 dark:text-gray-400">-</span>
                        @endif
                    </p>

                    {{-- 🔧 Azioni --}}
                    <div class="flex justify-end flex-wrap gap-3 pt-6 mt-6 border-t border-gray-300 dark:border-gray-600">

                        {{-- ⬅️ Indietro --}}
                        <a href="{{ route('categories.web.index') }}"
                            class="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition">
                            ⬅️ Torna all'elenco
                        </a>

                        {{-- ✏️ Modifica --}}
                        <a href="{{ route('categories.web.edit', $category->id) }}"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition">
                            ✏️ Modifica
                        </a>

                        {{-- 🗑️ Elimina --}}
                        <form action="{{ route('categories.web.destroy', $category->id) }}" method="POST"
                            onsubmit="return confirm('Sei sicuro di voler eliminare questa categoria?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit"
                                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-400 transition">
                                🗑️ Elimina
                            </button>
                        </form>

                    </div>

                @else
                    <p class="text-gray-500 dark:text-gray-400">Categoria non trovata.</p>
                    <div class="mt-4">
                        <a href="{{ route('categories.web.index') }}" class="text-blue-600 hover:underline dark:text-blue-400">
                            Torna all'elenco categorie
                        </a>
                    </div>
                @endif

            </div>
        </div>
    </div>
</x-app-layout>

