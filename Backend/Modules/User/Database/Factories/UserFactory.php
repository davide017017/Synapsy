<?php

namespace Modules\User\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Modules\User\Models\User;

class UserFactory extends Factory
{
    /**
     * Il modello associato a questa factory.
     *
     * @var class-string<\Modules\User\Models\User>
     */
    protected $model = User::class;

    /**
     * Stato predefinito del modello User.
     */
    public function definition(): array
    {
        $identities = [
            ['full_name' => 'Clark Kent', 'email_base' => 'clark.kent'],
            ['full_name' => 'Bruce Wayne', 'email_base' => 'bruce.wayne'],
            ['full_name' => 'Diana Prince', 'email_base' => 'diana.prince'],
            ['full_name' => 'Peter Parker', 'email_base' => 'peter.parker'],
            ['full_name' => 'Tony Stark', 'email_base' => 'tony.stark'],
            ['full_name' => 'Steve Rogers', 'email_base' => 'steve.rogers'],
            ['full_name' => 'Natasha Romanoff', 'email_base' => 'natasha.romanoff'],
            ['full_name' => 'Thor Odinson', 'email_base' => 'thor'],
            ['full_name' => 'Bruce Banner', 'email_base' => 'bruce.banner'],
            ['full_name' => 'Barry Allen', 'email_base' => 'barry.allen'],
            ['full_name' => 'Hal Jordan', 'email_base' => 'hal.jordan'],
            ['full_name' => 'Arthur Curry', 'email_base' => 'arthur.curry'],
            ['full_name' => 'Oliver Queen', 'email_base' => 'oliver.queen'],
            ['full_name' => 'Selina Kyle', 'email_base' => 'selina.kyle'],
            ['full_name' => 'Harley Quinn', 'email_base' => 'harley.quinn'],
            ['full_name' => 'Wade Wilson', 'email_base' => 'wade.wilson'],
            ['full_name' => 'Lois Lane', 'email_base' => 'lois.lane'],
            ['full_name' => 'Alfred Pennyworth', 'email_base' => 'alfred'],
        ];

        $avatarChoices = [
            'images/avatars/avatar-1.svg',
            'images/avatars/avatar-2.svg',
            'images/avatars/avatar-3.svg',
            'images/avatars/avatar-4.svg',
            'images/avatars/avatar-5.svg',
            'images/avatars/avatar-6.svg',
            'images/avatars/avatar-7.svg',
        ];

        $identity = $this->faker->unique()->randomElement($identities);
        [$name, $surname] = explode(' ', $identity['full_name']) + [null, null];

        // Username generato (senza spazi, minuscolo, oppure random se già esiste)
        $username = Str::slug($identity['full_name'], '.')
            . $this->faker->unique()->randomNumber(3);

        // Temi possibili
        $themes = ['light', 'dark', 'emerald', 'solarized'];

        $isVerified = $this->faker->boolean(70);

        return [
            'name'              => $name,
            'surname'           => $surname,
            'username'          => $username, // NEW
            'theme'             => $this->faker->randomElement($themes), // NEW
            'avatar'            => $this->faker->randomElement($avatarChoices),
            'email'             => $identity['email_base'] . '@' . $this->faker->unique()->domainWord() . '.' . $this->faker->tld(),
            'email_verified_at' => $isVerified ? Carbon::now() : null,
            'password'          => Hash::make('password1234'),
            'remember_token'    => Str::random(10),
            'is_admin'          => false,
            'has_accepted_terms' => true,
        ];
    }

    /**
     * Stato: email non verificata.
     */
    public function unverified(): static
    {
        return $this->state(fn() => ['email_verified_at' => null]);
    }

    /**
     * Stato: email verificata.
     */
    public function verified(): static
    {
        return $this->state(fn() => ['email_verified_at' => now()]);
    }

    /**
     * Stato: utente amministratore.
     */
    public function admin(): static
    {
        return $this->state(fn() => ['is_admin' => true]);
    }
}
