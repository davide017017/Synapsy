<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Crea Nuova Spesa') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-xl mx-auto px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100">

                <form method="POST" action="{{ route('spese.web.store') }}" class="space-y-6">
                    @csrf

                    {{-- 🗓️ Data --}}
                    <div>
                        <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            📅 Data
                        </label>
                        <input type="date" name="date" id="date" required
                            value="{{ old('date', now()->format('Y-m-d')) }}"
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('date')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 💶 Importo --}}
                    <div>
                        <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            💶 Importo (€)
                        </label>
                        <input type="number" name="amount" id="amount" required step="0.01" min="0.01"
                            value="{{ old('amount') }}"
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('amount')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 🗂️ Categoria --}}
                    <div>
                        <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            🗂️ Categoria
                        </label>
                        <select name="category_id" id="category_id" required
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">
                            <option value="">Seleziona una categoria</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" @selected(old('category_id') == $category->id)>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('category_id')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror

                        @if($categories->isEmpty())
                            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Nessuna categoria disponibile.
                                <a href="{{ route('categories.web.create') }}" class="underline text-blue-600 dark:text-blue-400">
                                    Crea una nuova categoria
                                </a>.
                            </p>
                        @endif
                    </div>

                    {{-- 📝 Descrizione --}}
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            📝 Descrizione
                        </label>
                        <input type="text" name="description" id="description" required
                            value="{{ old('description') }}"
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('description')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 🗒️ Note --}}
                    <div>
                        <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            🗒️ Note (opzionali)
                        </label>
                        <textarea name="notes" id="notes" rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">{{ old('notes') }}</textarea>
                        @error('notes')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 🔧 Azioni --}}
                    <div class="flex justify-between items-center pt-6 border-t border-gray-300 dark:border-gray-600 mt-6">

                        {{-- 🔙 Bottone Annulla --}}
                        <a href="{{ route('spese.web.index') }}"
                            class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:ring focus:ring-gray-300 transition">
                            ⬅️ <span class="ml-2">Annulla</span>
                        </a>

                        {{-- 💾 Bottone Salva --}}
                        <button type="submit"
                            class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 focus:ring focus:ring-red-300 transition">
                            💾 <span class="ml-2">Salva Spesa</span>
                        </button>

                    </div>

                </form>
            </div>
        </div>
    </div>
</x-app-layout>
