@php use Illuminate\Support\Str; @endphp

<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ $recurringOperation->type === 'spesa' ? 'Modifica Spesa Ricorrente' : 'Modifica Entrata Ricorrente' }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-xl mx-auto px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100">

                <form method="POST" action="{{ route('recurring-operations.update', $recurringOperation->id) }}" class="space-y-6">
                    @csrf
                    @method('PUT')

                    {{-- 📅 Inizio --}}
                    <div>
                        <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Inizio</label>
                        <input type="text" disabled
                            value="{{ $recurringOperation->start_date->format('d/m/Y') }}"
                            class="mt-1 block w-full rounded-md text-sm bg-gray-100 dark:bg-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-600" />
                        <input type="hidden" name="start_date" value="{{ $recurringOperation->start_date->format('Y-m-d') }}">
                    </div>

                    {{-- 📅 Fine --}}
                    <div>
                        <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Fine</label>
                        <input type="date" id="end_date" name="end_date"
                            value="{{ old('end_date', $recurringOperation->end_date?->format('Y-m-d')) }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('end_date')
                            <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 📝 Descrizione --}}
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📝 Descrizione</label>
                        <input type="text" id="description" name="description" required
                            value="{{ old('description', $recurringOperation->description) }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('description')
                            <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 💶 Importo --}}
                    <div>
                        <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">💶 Importo (€)</label>
                        <input type="number" id="amount" name="amount" required step="0.01" min="0.01"
                            value="{{ old('amount', $recurringOperation->amount) }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                        @error('amount')
                            <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 🗂️ Categoria --}}
                    <div>
                        <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">🗂️ Categoria</label>
                        <select name="category_id" id="category_id"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">
                            <option value="">Nessuna categoria</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" @selected(old('category_id', $recurringOperation->category_id) == $category->id)>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('category_id')
                            <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- 🔁 Frequenza --}}
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">🔁 Frequenza</label>
                        <div class="flex flex-col sm:flex-row gap-4 mt-1">
                            <input type="number" name="interval" min="1" required
                                value="{{ old('interval', $recurringOperation->interval) }}"
                                class="flex-1 rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400" />
                            <select name="frequency" required
                                class="flex-1 rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">
                                <option value="daily" @selected(old('frequency', $recurringOperation->frequency) === 'daily')>Giorni</option>
                                <option value="weekly" @selected(old('frequency', $recurringOperation->frequency) === 'weekly')>Settimane</option>
                                <option value="monthly" @selected(old('frequency', $recurringOperation->frequency) === 'monthly')>Mesi</option>
                                <option value="annually" @selected(old('frequency', $recurringOperation->frequency) === 'annually')>Anni</option>
                            </select>
                        </div>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Es. "2 Mesi" indica un'operazione ogni due mesi.
                        </p>
                    </div>

                    {{-- 🗓️ Prossima Occorrenza --}}
                    <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
                        <p class="text-gray-700 dark:text-gray-200 mb-1">
                            <strong>📆 Prossima operazione:</strong>
                            {{ $recurringOperation->next_occurrence_date?->format('d/m/Y') ?? 'N/A' }}
                        </p>
                        <p class="text-xs text-gray-600 dark:text-gray-400 italic">
                            Le modifiche si applicheranno a partire dalla prossima occorrenza.
                        </p>
                    </div>

                    {{-- 🗒️ Note --}}
                    <div>
                        <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">🗒️ Note</label>
                        <textarea id="notes" name="notes" rows="3"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-indigo-400">{{ old('notes', $recurringOperation->notes) }}</textarea>
                        @error('notes')
                            <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- ✅ Attiva --}}
                    <div class="flex items-center">
                        <input type="hidden" name="is_active" value="0">
                        <input type="checkbox" name="is_active" value="1" id="is_active"
                            @checked(old('is_active', $recurringOperation->is_active))
                            class="rounded border-gray-300 text-indigo-600 dark:bg-gray-900 dark:border-gray-600 dark:focus:ring-indigo-600">
                        <label for="is_active" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Regola attiva</label>
                    </div>

                    {{-- 🔧 Azioni --}}
                    <div class="flex justify-between items-center pt-6 border-t border-gray-300 dark:border-gray-600 mt-6">
                        <a href="{{ route('recurring-operations.index') }}"
                            class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 transition">
                            ⬅️ <span class="ml-2">Annulla</span>
                        </a>
                        <button type="submit"
                            class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700 focus:ring focus:ring-green-300 transition">
                            💾 <span class="ml-2">Salva Modifiche</span>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>
