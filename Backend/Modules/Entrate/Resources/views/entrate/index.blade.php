<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Elenco Entrate') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">

            {{-- 🗂️ Box principale --}}
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100">

                {{-- ✅ Messaggi --}}
                @if(session('status'))
                    <div class="mb-4 text-sm text-green-600 dark:text-green-400">
                        {{ session('status') }}
                    </div>
                @endif
                @if(session('error'))
                    <div class="mb-4 text-sm text-red-600 dark:text-red-400">
                        {{ session('error') }}
                    </div>
                @endif

                {{-- ➕ Pulsante nuova entrata --}}
                <div class="flex justify-center mb-6">
                    <a href="{{ route('entrate.web.create') }}"
                        class="px-5 py-2 text-lg font-bold text-white bg-green-600 rounded hover:bg-green-700 transition">
                        ➕ Aggiungi Nuova Entrata
                    </a>
                </div>

                {{-- 🔍 Filtro --}}
                <form method="GET" action="{{ route('entrate.web.index') }}"
                    class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-6 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-md">

                    {{-- 📅 Data Inizio --}}
                    <div>
                        <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Inizio</label>
                        <input type="date" id="start_date" name="start_date" value="{{ $filterStartDate }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300" />
                    </div>

                    {{-- 📅 Data Fine --}}
                    <div>
                        <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📅 Fine</label>
                        <input type="date" id="end_date" name="end_date" value="{{ $filterEndDate }}"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300" />
                    </div>

                    {{-- 📝 Descrizione --}}
                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">📝 Descrizione</label>
                        <input type="text" id="description" name="description" value="{{ $filterDescription }}"
                            placeholder="Cerca descrizione..."
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300" />
                    </div>

                    {{-- 🗂️ Categoria --}}
                    <div>
                        <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">🗂️ Categoria</label>
                        <select id="category_id" name="category_id"
                            class="mt-1 block w-full rounded-md text-sm border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 focus:ring focus:ring-sky-300">
                            <option value="">Tutte le categorie</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" @selected(($filterCategoryId ?? '') == $category->id)>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- 🎯 Filtra --}}
                    <div class="flex items-end">
                        <button type="submit"
                            class="w-full px-4 py-2 text-sm text-white bg-sky-700 rounded hover:bg-sky-800 transition">
                            🔍 Filtra
                        </button>
                    </div>

                    {{-- 🔄 Reset --}}
                    <div class="flex items-end">
                        <a href="{{ route('entrate.web.index') }}"
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
                                @foreach(['date' => 'Data', 'description' => 'Descrizione', 'amount' => 'Importo'] as $key => $label)
                                    <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <a href="{{ route('entrate.web.index', array_merge(request()->query(), [
                                            'sort_by'        => $key,
                                            'sort_direction' => ($sortBy === $key && $sortDirection === 'asc') ? 'desc' : 'asc'
                                        ])) }}" class="inline-flex items-center space-x-1">
                                            <span>{{ $label }}</span>
                                            @if($sortBy === $key)
                                                <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                            @endif
                                        </a>
                                    </th>
                                @endforeach
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Azioni</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            @forelse($entrate as $entrata)
                                <tr>
                                    <td class="px-4 py-2">{{ $entrata->date?->format('d/m/Y') }}</td>
                                    <td class="px-4 py-2">{{ $entrata->description }}</td>
                                    <td class="px-4 py-2">{{ number_format($entrata->amount, 2, ',', '.') }} €</td>
                                    <td class="px-4 py-2">{{ $entrata->category->name ?? '-' }}</td>
                                    <td class="px-4 py-2 max-w-xs truncate">{{ $entrata->notes ?? '-' }}</td>
                                    <td class="px-4 py-2 space-x-2 whitespace-nowrap">
                                        <a href="{{ route('entrate.web.show', $entrata->id) }}"
                                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">Mostra</a>
                                        <a href="{{ route('entrate.web.edit', $entrata->id) }}"
                                            class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600">Modifica</a>
                                        <form action="{{ route('entrate.web.destroy', $entrata->id) }}" method="POST" class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                                onclick="return confirm('Sei sicuro di voler eliminare questa entrata?')">
                                                Elimina
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                                        Nessuna entrata trovata.
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
