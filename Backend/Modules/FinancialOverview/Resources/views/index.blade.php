<x-app-layout>
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            Panoramica Finanziaria
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            {{-- ✅ Messaggi --}}
            @if (session('status'))
                <div class="text-sm text-green-500 dark:text-green-300">{{ session('status') }}</div>
            @endif
            @if (session('error'))
                <div class="text-sm text-red-500 dark:text-red-300">{{ session('error') }}</div>
            @endif

            {{-- 📊 Riepilogo & 🔍 Filtro --}}
            <div class="grid grid-cols-3 gap-6">
                {{-- Riepilogo --}}
                <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-md space-y-2 text-sm text-white">
                    <h3 class="text-lg font-semibold">💼 Riepilogo</h3>
                    <p>Totale Entrate: <span class="text-green-400 font-semibold">{{ number_format($totalEntrate ?? 0, 2, ',', '.') }} €</span></p>
                    <p>Totale Spese: <span class="text-red-400 font-semibold">{{ number_format($totalSpese ?? 0, 2, ',', '.') }} €</span></p>
                    <p>Saldo: 
                        <span class="{{ ($balance ?? 0) >= 0 ? 'text-green-400' : 'text-red-400' }} font-semibold">
                            {{ number_format($balance ?? 0, 2, ',', '.') }} €
                        </span>
                    </p>
                </div>

                {{-- Filtro --}}
                <div class="col-span-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-white">
                    <form method="GET" action="{{ route('financial-overview.index') }}" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="start_date" class="text-sm">📅 Inizio</label>
                            <input type="date" id="start_date" name="start_date" value="{{ $filterStartDate ?? '' }}"
                                class="w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label for="end_date" class="text-sm">📅 Fine</label>
                            <input type="date" id="end_date" name="end_date" value="{{ $filterEndDate ?? '' }}"
                                class="w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white" />
                        </div>
                        <div class="flex items-end">
                            <button type="submit" class="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded text-sm">
                                🔍 Filtra
                            </button>
                        </div>
                        <div class="flex items-end">
                            <a href="{{ route('financial-overview.index') }}"
                                class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-center text-sm">
                                ♻️ Reset
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {{-- 📋 Tabella --}}
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-300 uppercase">
                        <tr>
                            @foreach (['date' => 'Data', 'type' => 'Tipo', 'description' => 'Descrizione', 'amount' => 'Importo', 'category' => 'Categoria', 'notes' => 'Note'] as $key => $label)
                                <th class="px-4 py-2 text-left whitespace-nowrap">
                                    <a href="{{ route('financial-overview.index', array_merge(request()->query(), ['sort_by' => $key, 'sort_direction' => ($sortBy === $key && $sortDirection === 'asc') ? 'desc' : 'asc'])) }}"
                                        class="hover:underline flex items-center space-x-1">
                                        <span>{{ $label }}</span>
                                        @if ($sortBy === $key)
                                            <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                        @endif
                                    </a>
                                </th>
                            @endforeach
                            <th class="px-4 py-2 text-left">Azioni</th>
                        </tr>
                    </thead>

                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-white">
                        @php $prevMonth = null; @endphp

                        @forelse ($financialEntries as $entry)
                            @php
                                $isEntrata = $entry instanceof \Modules\Entrate\Models\Entrata;
                                $bgColor = $isEntrata 
                                    ? 'bg-[rgba(34,197,94,0.08)] dark:bg-[rgba(34,197,94,0.08)]' 
                                    : 'bg-[rgba(239,68,68,0.08)] dark:bg-[rgba(239,68,68,0.08)]';
                                $currentMonth = $entry->date?->format('Y-m');
                                $monthLabel = $entry->date?->translatedFormat('F Y');
                                $isMonthBreak = ($sortBy === 'date' && $currentMonth !== $prevMonth);
                                $prevMonth = $currentMonth;
                            @endphp

                            @if($isMonthBreak)
                                <tr>
                                    <td colspan="7" class="text-left text-sm text-gray-600 dark:text-gray-400 pt-6 pb-1">
                                        📅 <strong>{{ ucfirst($monthLabel) }}</strong>
                                    </td>
                                </tr>
                            @endif

                            <tr class="{{ $bgColor }} border-t border-gray-300 dark:border-gray-600 text-xs whitespace-nowrap">
                                <td class="px-3 py-1">{{ $entry->date?->format('d/m/Y') }}</td>
                                <td class="px-3 py-1 font-semibold {{ $isEntrata ? 'text-green-500' : 'text-red-500' }}">
                                    {{ $isEntrata ? '🔼 Entrata' : '🔽 Spesa' }}
                                </td>
                                <td class="px-3 py-1">{{ \Illuminate\Support\Str::limit($entry->description, 30) }}</td>
                                <td class="px-3 py-1 font-mono {{ $isEntrata ? 'text-green-400' : 'text-red-400' }}">
                                    {{ $isEntrata ? '+' : '-' }}{{ number_format($entry->amount, 2, ',', '.') }} €
                                </td>
                                <td class="px-3 py-1">{{ $entry->category->name ?? '-' }}</td>
                                <td class="px-3 py-1 truncate max-w-[150px]">{{ $entry->notes ?? '-' }}</td>

                                {{-- 🎯 Azioni --}}
                                <td class="px-3 py-1 space-x-1">
                                    @php
                                        $routePrefix = $isEntrata ? 'entrate' : 'spese';
                                        $labelDelete = $isEntrata ? 'questa entrata' : 'questa spesa';
                                    @endphp

                                    <a href="{{ route("$routePrefix.web.show", $entry->id) }}"
                                        class="inline-flex items-center justify-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                                        title="Visualizza">👁</a>

                                    <a href="{{ route("$routePrefix.web.edit", $entry->id) }}"
                                        class="inline-flex items-center justify-center px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs"
                                        title="Modifica">✏️</a>

                                    <form action="{{ route("$routePrefix.web.destroy", $entry->id) }}" method="POST" class="inline"
                                            onsubmit="return confirm('Eliminare {{ $labelDelete }}?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                                class="inline-flex items-center justify-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                                                title="Elimina">🗑️</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center text-gray-500 dark:text-gray-400 py-4">
                                    Nessuna voce trovata.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</x-app-layout>
