@php use Illuminate\Support\Str; @endphp

<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ $operationType === 'spesa' ? 'Nuova Spesa Ricorrente' : 'Nuova Entrata Ricorrente' }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-xl mx-auto px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100">

                {{-- ✏️ FORM --}}
                <form method="POST" action="{{ route('recurring-operations.store') }}" class="space-y-4">
                    @csrf
                    <input type="hidden" name="type" value="{{ $operationType }}">

                    {{-- 📝 Descrizione --}}
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📝 Descrizione</label>
                        <input type="text" id="description" name="description" required
                            value="{{ old('description') }}"
                            class="mt-1 w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('description') <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p> @enderror
                    </div>

                    {{-- 💶 Importo --}}
                    <div>
                        <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">💶 Importo (€)</label>
                        <input type="number" id="amount" name="amount" required step="0.01" min="0.01"
                            value="{{ old('amount') }}"
                            class="mt-1 w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('amount') <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p> @enderror
                    </div>

                    {{-- 🗂️ Categoria --}}
                    <div>
                        <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">🗂️ Categoria</label>
                        <select id="category_id" name="category_id" required
                            class="mt-1 w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">
                            <option value="">Seleziona una categoria</option>
                            @foreach ($categories as $category)
                                <option value="{{ $category->id }}" @selected(old('category_id') == $category->id)>
                                    {{ $category->name }} ({{ ucfirst($category->type) }})
                                </option>
                            @endforeach
                        </select>
                        @error('category_id') <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p> @enderror
                        @if($categories->isEmpty())
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Nessuna categoria disponibile.
                                <a href="{{ route('categories.web.create') }}" class="underline text-blue-600 dark:text-blue-400">Crea una nuova categoria</a>.
                            </p>
                        @endif
                    </div>

                    {{-- 📅 Inizio e Fine --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Inizio</label>
                            <input type="date" id="start_date" name="start_date" required
                                value="{{ old('start_date', now()->format('Y-m-d')) }}"
                                class="mt-1 w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                            @error('start_date') <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Fine</label>
                            <input type="date" id="end_date" name="end_date"
                                value="{{ old('end_date') }}"
                                class="mt-1 w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                            @error('end_date') <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    {{-- 🔁 Frequenza --}}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">🔁 Frequenza</label>
                        <div class="flex gap-4 mt-1">
                            <input type="number" name="interval" min="1" required
                                value="{{ old('interval', 1) }}"
                                class="w-1/2 rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                            <select name="frequency" required
                                class="w-1/2 rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">
                                <option value="">Frequenza</option>
                                <option value="daily" @selected(old('frequency') === 'daily')>Giorni</option>
                                <option value="weekly" @selected(old('frequency') === 'weekly')>Settimane</option>
                                <option value="monthly" @selected(old('frequency') === 'monthly')>Mesi</option>
                                <option value="annually" @selected(old('frequency') === 'annually')>Anni</option>
                            </select>
                        </div>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Definisci ogni quanto si ripete l'operazione. Ad esempio, "2 Mesi" significa ogni due mesi.
                        </p>
                        @error('interval') <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p> @enderror
                        @error('frequency') <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p> @enderror
                    </div>

                    {{-- 🗒️ Note --}}
                    <div>
                        <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">🗒️ Note</label>
                        <textarea name="notes" id="notes" rows="3"
                            class="mt-1 w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">{{ old('notes') }}</textarea>
                        @error('notes') <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ $message }}</p> @enderror
                    </div>

                    {{-- ✅ Attiva --}}
                    <div class="flex items-center">
                        <input type="hidden" name="is_active" value="0">
                        <input type="checkbox" name="is_active" id="is_active" value="1" @checked(old('is_active', 1))
                            class="rounded border-gray-300 text-indigo-600 dark:bg-gray-900 dark:border-gray-600 dark:focus:ring-indigo-600">
                        <label for="is_active" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Regola attiva</label>
                    </div>

                    {{-- 📆 Genera occorrenze --}}
                    <div class="flex items-center">
                        <input type="hidden" name="generate_past_now" value="0">
                        <input type="checkbox" name="generate_past_now" id="generate_past_now" value="1" @checked(old('generate_past_now', 1))
                            class="rounded border-gray-300 text-indigo-600 dark:bg-gray-900 dark:border-gray-600 dark:focus:ring-indigo-600">
                        <label for="generate_past_now" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Genera occorrenze passate fino ad oggi</label>
                    </div>

                    {{-- 🔧 Azioni --}}
                    <div class="flex justify-between items-center pt-6 border-t border-gray-300 dark:border-gray-600 mt-6">
                        {{-- Switch tipo --}}
                        @if ($operationType === 'spesa')
                            <a href="{{ route('recurring-operations.create', ['type' => 'entrata']) }}"
                                class="inline-block px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition">
                                🔼🟢 Passa a Entrata
                            </a>
                        @else
                            <a href="{{ route('recurring-operations.create', ['type' => 'spesa']) }}"
                                class="inline-block px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition">
                                🔽🔴 Passa a Spesa
                            </a>
                        @endif

                        <div class="flex gap-2">
                            <a href="{{ route('recurring-operations.index') }}"
                                class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 transition">
                                ⬅️ <span class="ml-2">Annulla</span>
                            </a>

                            <button type="submit"
                                class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700 focus:ring focus:ring-green-300 transition">
                                💾 <span class="ml-2">Salva Regola</span>
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>

