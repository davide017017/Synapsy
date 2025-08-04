<x-app-layout>
    {{-- 🧭 Intestazione della pagina --}}
    <x-slot name="header">
        <h2 class="font-semibold text-3xl text-gray-800 dark:text-gray-200 leading-tight font-playfair">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    {{-- 📦 Contenuto principale --}}
    <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100 space-y-6">

                    {{-- 🔗 Pulsante riepilogo generale --}}
                    <div class="text-center">
                        <a href="{{ route('financial-overview.index') }}"
                            class="inline-block px-6 py-3 text-lg bg-gradient-to-r from-green-300 to-red-300 text-gray-800 font-semibold rounded-lg shadow-md hover:from-green-400 hover:to-red-400 transition duration-300">
                            Riepilogo Completo (Entrate & Spese)
                        </a>
                    </div>

                    {{-- 🧭 Sezione accesso rapido --}}
                    <div>
                        <h4 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 font-playfair text-center">
                            Accesso Rapido ai Moduli:
                        </h4>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                            <a href="{{ route('entrate.web.index') }}"
                                class="block px-4 py-3 text-lg bg-green-100 text-green-800 font-semibold text-center rounded-lg shadow hover:bg-green-300 transition duration-300">
                                Tutte le Entrate
                            </a>
                            <a href="{{ route('spese.web.index') }}"
                                class="block px-4 py-3 text-lg bg-red-100 text-red-800 font-semibold text-center rounded-lg shadow hover:bg-red-300 transition duration-300">
                                Tutte le Spese
                            </a>
                            <a href="{{ route('categories.web.index') }}"
                                class="block px-4 py-3 text-lg bg-yellow-100 text-yellow-800 font-semibold text-center rounded-lg shadow hover:bg-yellow-300 transition duration-300">
                                Tutte le Categorie
                            </a>
                            <a href="{{ route('recurring-operations.index') }}"
                                class="block px-4 py-3 text-lg bg-gray-100 text-gray-800 font-semibold text-center rounded-lg shadow hover:bg-gray-300 transition duration-300">
                                Operazioni Ricorrenti
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>

