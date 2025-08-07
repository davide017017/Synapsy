# 🗺️ Struttura del Sito

Elenco delle pagine effettive con i principali componenti e modali associati.

## Albero pagine

/ (root)
- HomePage
  - HeroCarousel
  - TransazioniCard
  - RicorrentiCard
  - CategorieCard
  - ProssimoPagamentoCard
  - Modali:
    - NewTransactionModal (da NewTransactionButton)
    - NewRicorrenzaModal (da NewRicorrenzaButton)
    - NewCategoryModal (da NewCategoryButton)
- TransazioniPage
  - TransactionsList
  - SelectionToolbar
  - Modal: TransactionDetailModal (clic su transazione)
- RicorrentiPage
  - CardTotaliAnnui
  - CardGraficoPagamenti
  - ListaRicorrenzePerFrequenza
  - ListaProssimiPagamenti
  - AreaGraficiRicorrenze
  - Modal: NewRicorrenzaModal (context `openModal`)
- CategoriePage
  - CategoriesList
  - Modali:
    - NewCategoryModal (da NewCategoryButton)
    - DeleteCategoryModal (dalla lista)
- PanoramicaPage
  - CalendarGrid
- ProfiloPage
  - ProfileRow
  - ThemeSelectorRow
  - AvatarSelector
  - Modali:
    - AvatarPickerModal (clic su avatar)
    - DeleteAccountSection (Dialog di conferma)

(auth)
- LoginPage
  - LoginForm
- ResetPasswordPage
  - ResetPasswordForm

> Aggiornare questo file quando vengono aggiunte o rimosse pagine/modal.
