<x-app-layout>
    {{-- 🧭 Intestazione --}}
    <x-slot name="header">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Gestione Categorie') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto --}}
    <div class="py-8">
        <div class="max-w-3xl mx-auto px-6 lg:px-8 space-y-6">

            {{-- 🗂️ Box principale --}}
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-gray-900 dark:text-gray-100">

                {{-- ✅ Messaggi --}}
                @if (session('status'))
                    <div class="mb-4 text-sm text-green-600 dark:text-green-400">{{ session('status') }}</div>
                @endif
                @if (session('error'))
                    <div class="mb-4 text-sm text-red-600 dark:text-red-400">{{ session('error') }}</div>
                @endif

                {{-- ➕ Nuova categoria --}}
                <div class="flex justify-center mb-6">
                    <a href="{{ route('categories.web.create') }}"
                        class="px-5 py-2 text-lg font-bold text-white bg-orange-600 rounded hover:bg-orange-700 transition">
                        ➕ Nuova Categoria
                    </a>
                </div>

                {{-- 📊 Tabella --}}
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm table-auto divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                @foreach (['name' => '🏷️ Nome', 'type' => '🗂️ Tipo'] as $column => $label)
                                    <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        <a href="{{ route('categories.web.index', array_merge(request()->query(), [
                                            'sort_by' => $column,
                                            'sort_direction' => ($sortBy === $column && $sortDirection === 'asc') ? 'desc' : 'asc'
                                        ])) }}" class="inline-flex items-center space-x-1">
                                            <span>{{ $label }}</span>
                                            @if ($sortBy === $column)
                                                <span>{{ $sortDirection === 'asc' ? '↑' : '↓' }}</span>
                                            @endif
                                        </a>
                                    </th>
                                @endforeach
                                <th class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    ⚙️ Azioni
                                </th>
                            </tr>
                        </thead>

                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            @forelse ($categories as $category)
                                <tr>
                                    <td class="px-4 py-2">{{ $category->name }}</td>
                                    <td class="px-4 py-2">
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
                                    </td>
                                    <td class="px-4 py-2 text-right space-x-2 whitespace-nowrap text-sm">
                                        <a href="{{ route('categories.web.show', $category) }}"
                                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">Mostra</a>
                                        <a href="{{ route('categories.web.edit', $category) }}"
                                            class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600">Modifica</a>
                                        <form action="{{ route('categories.web.destroy', $category) }}" method="POST"
                                            class="inline"
                                            onsubmit="return confirm('Confermi l\'eliminazione?');">
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
                                    <td colspan="3" class="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                                        Nessuna categoria trovata.
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

