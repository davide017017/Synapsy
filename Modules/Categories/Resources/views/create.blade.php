<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Crea Nuova Categoria') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-xl mx-auto px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100">

                <form method="POST" action="{{ route('categories.web.store') }}" class="space-y-6">
                    @csrf

                    {{-- 🏷️ Nome --}}
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            🏷️ Nome
                        </label>
                        <input type="text" name="name" id="name" required
                            value="{{ old('name') }}"
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-orange-300" />
                        @error('name')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 🗂️ Tipo --}}
                    <div>
                        <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            🗂️ Tipo
                        </label>
                        <select name="type" id="type" required
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-orange-300">
                            <option value="">Seleziona un tipo</option>
                            <option value="entrata" @selected(old('type') === 'entrata')>Entrata</option>
                            <option value="spesa" @selected(old('type') === 'spesa')>Spesa</option>
                        </select>
                        @error('type')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 🔧 Azioni --}}
                    <div class="flex justify-between items-center pt-6 border-t border-gray-300 dark:border-gray-600 mt-6">

                        {{-- 🔙 Bottone Annulla --}}
                        <a href="{{ route('categories.web.index') }}"
                            class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:ring focus:ring-gray-300 transition">
                            ⬅️ <span class="ml-2">Annulla</span>
                        </a>

                        {{-- ➕ Bottone Crea --}}
                        <button type="submit"
                            class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded hover:bg-orange-700 focus:ring focus:ring-orange-300 transition">
                            ➕ <span class="ml-2">Crea Categoria</span>
                        </button>

                    </div>

                </form>
            </div>
        </div>
    </div>
</x-app-layout>
