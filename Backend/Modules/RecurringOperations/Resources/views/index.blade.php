@php use Illuminate\Support\Str; @endphp

<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Operazioni Ricorrenti') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">

            {{-- 🗂️ Box principale --}}
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100">

                {{-- ✅ Messaggi --}}
                @if (session('status'))
                    <div class="mb-4 text-sm text-green-600 dark:text-green-400">
                        {{ session('status') }}
                    </div>
                @endif
                @if (session('error'))
                    <div class="mb-4 text-sm text-red-600 dark:text-red-400">
                        {{ session('error') }}
                    </div>
                @endif

                {{-- ➕ Pulsanti nuova regola --}}
                <div class="flex justify-center gap-4 mb-6">
                    <a href="{{ route('recurring-operations.create', ['type' => 'entrata']) }}"
                        class="px-5 py-2 text-sm font-bold text-white bg-green-600 rounded hover:bg-green-700 transition">
                        ➕ Nuova Entrata Ricorrente
                    </a>
                    <a href="{{ route('recurring-operations.create', ['type' => 'spesa']) }}"
                        class="px-5 py-2 text-sm font-bold text-white bg-red-600 rounded hover:bg-red-700 transition">
                        ➕ Nuova Spesa Ricorrente
                    </a>
                </div>

                {{-- 🔍 Filtro --}}
                <form method="GET" action="{{ route('recurring-operations.index') }}"
                    class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-6 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-md">

                    {{-- 📅 Inizio --}}
                    <div>
                        <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Inizio</label>
                        <input type="date" id="start_date" name="start_date" value="{{ $filterStartDate }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300" />
                    </div>

                    {{-- 📅 Fine --}}
                    <div>
                        <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Fine</label>
                        <input type="date" id="end_date" name="end_date" value="{{ $filterEndDate }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300" />
                    </div>

                    {{-- 📝 Descrizione --}}
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📝 Descrizione</label>
                        <input type="text" id="description" name="description" value="{{ $filterDescription }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300" />
                    </div>

                    {{-- 🗂️ Categoria --}}
                    <div>
                        <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">🗂️ Categoria</label>
                        <select id="category_id" name="category_id"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300">
                            <option value="">Tutte le categorie</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" @selected(($filterCategoryId ?? '') == $category->id)>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- 🔼🟢 / 🔽🔴 Tipo --}}
                    <div>
                        <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">🔼🟢 / 🔽🔴 Tipo</label>
                        <select id="type" name="type"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300">
                            <option value="">Tutti</option>
                            <option value="entrata" @selected(($filterType ?? '') === 'entrata')>Entrata</option>
                            <option value="spesa" @selected(($filterType ?? '') === 'spesa')>Spesa</option>
                        </select>
                    </div>

                    {{-- ✅ Stato --}}
                    <div>
                        <label for="is_active" class="block text-sm font-medium text-gray-700 dark:text-gray-300">✅ Stato</label>
                        <select id="is_active" name="is_active"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300">
                            <option value="">Tutti</option>
                            <option value="1" @selected(($filterIsActive ?? '') === '1')>Attiva</option>
                            <option value="0" @selected(($filterIsActive ?? '') === '0')>Inattiva</option>
                        </select>
                    </div>

                    {{-- 🔍 Filtra --}}
                    <div class="flex items-end">
                        <button type="submit"
                            class="w-full px-4 py-2 text-sm text-white bg-sky-700 rounded hover:bg-sky-800 transition">
                            🔍 Filtra
                        </button>
                    </div>

                    {{-- 🔄 Reset --}}
                    <div class="flex items-end">
                        <a href="{{ route('recurring-operations.index') }}"
                            class="w-full px-4 py-2 text-sm text-white bg-gray-600 rounded text-center hover:bg-gray-700 transition">
                            ♻️ Reset
                        </a>
                    </div>
                </form>

                {{-- 📊 Tabella --}}
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">


                        <thead>
                            <tr>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <a href="{{ route('recurring-operations.index', array_merge(request()->query(), [
                                        'sort_by' => 'description',
                                        'sort_direction' => ($sortBy === 'description' && $sortDirection === 'asc') ? 'desc' : 'asc'
                                    ])) }}" class="inline-flex items-center space-x-1">
                                        <span>Descrizione</span>
                                        @if($sortBy === 'description')
                                            <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                        @endif
                                    </a>
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <a href="{{ route('recurring-operations.index', array_merge(request()->query(), [
                                        'sort_by' => 'type',
                                        'sort_direction' => ($sortBy === 'type' && $sortDirection === 'asc') ? 'desc' : 'asc'
                                    ])) }}" class="inline-flex items-center space-x-1">
                                        <span>Tipo</span>
                                        @if($sortBy === 'type')
                                            <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                        @endif
                                    </a>
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <a href="{{ route('recurring-operations.index', array_merge(request()->query(), [
                                        'sort_by' => 'amount',
                                        'sort_direction' => ($sortBy === 'amount' && $sortDirection === 'asc') ? 'desc' : 'asc'
                                    ])) }}" class="inline-flex items-center space-x-1">
                                        <span>Importo</span>
                                        @if($sortBy === 'amount')
                                            <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                        @endif
                                    </a>
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Data Inizio
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Data Fine
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Frequenza
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <a href="{{ route('recurring-operations.index', array_merge(request()->query(), [
                                        'sort_by' => 'next_occurrence_date',
                                        'sort_direction' => ($sortBy === 'next_occurrence_date' && $sortDirection === 'asc') ? 'desc' : 'asc'
                                    ])) }}" class="inline-flex items-center space-x-1">
                                        <span>Prossima</span>
                                        @if($sortBy === 'next_occurrence_date')
                                            <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                        @endif
                                    </a>
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <a href="{{ route('recurring-operations.index', array_merge(request()->query(), [
                                        'sort_by' => 'is_active',
                                        'sort_direction' => ($sortBy === 'is_active' && $sortDirection === 'asc') ? 'desc' : 'asc'
                                    ])) }}" class="inline-flex items-center space-x-1">
                                        <span>Attiva</span>
                                        @if($sortBy === 'is_active')
                                            <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                        @endif
                                    </a>
                                </th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Azioni
                                </th>
                            </tr>
                        </thead>

                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            @forelse ($recurringOperations as $rule)
                                <tr>
                                    <td class="px-4 py-2">{{ $rule->description }}</td>
                                    <td class="px-4 py-2">
                                        @if ($rule->type === 'entrata')
                                            <span class="bg-green-600/20 text-green-500 text-xs font-semibold px-2 py-1 rounded">Entrata</span>
                                        @else
                                            <span class="bg-red-600/20 text-red-500 text-xs font-semibold px-2 py-1 rounded">Spesa</span>
                                        @endif
                                    </td>
                                    <td class="px-4 py-2">{{ number_format($rule->amount, 2, ',', '.') }} €</td>
                                    <td class="px-4 py-2">{{ $rule->start_date->format('d/m/Y') }}</td>
                                    <td class="px-4 py-2">{{ $rule->end_date?->format('d/m/Y') ?? '-' }}</td>

                                    <td class="px-4 py-2">
                                        {{ $rule->interval }}
                                        @php
                                            $freqIt = match($rule->frequency) {
                                                'daily' => $rule->interval == 1 ? 'giorno' : 'giorni',
                                                'weekly' => $rule->interval == 1 ? 'settimana' : 'settimane',
                                                'monthly' => $rule->interval == 1 ? 'mese' : 'mesi',
                                                'annually' => $rule->interval == 1 ? 'anno' : 'anni',
                                                default => $rule->frequency,
                                            };
                                        @endphp
                                        {{ $freqIt }}
                                    </td>

                                    <td class="px-4 py-2">{{ $rule->next_occurrence_date?->format('d/m/Y') ?? '-' }}</td>
                                    <td class="px-4 py-2">
                                        @if ($rule->is_active)
                                            <span class="bg-green-600/20 text-green-500 text-xs font-semibold px-2 py-1 rounded">Sì</span>
                                        @else
                                            <span class="bg-red-600/20 text-red-500 text-xs font-semibold px-2 py-1 rounded">No</span>
                                        @endif
                                    </td>
                                    <td class="px-4 py-2 whitespace-nowrap space-x-2">
                                        <a href="{{ route('recurring-operations.show', $rule->id) }}"
                                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">Mostra</a>
                                        <a href="{{ route('recurring-operations.edit', $rule->id) }}"
                                            class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600">Modifica</a>
                                        <form action="{{ route('recurring-operations.destroy', $rule->id) }}" method="POST" class="inline"
                                            onsubmit="return confirm('Sei sicuro di voler eliminare questa regola ricorrente?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600">
                                                Elimina
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="9" class="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                                        Nessuna regola ricorrente trovata.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>

