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
            ['name' => 'Clark Kent', 'email_base' => 'clark.kent'],
            ['name' => 'Bruce Wayne', 'email_base' => 'bruce.wayne'],
            ['name' => 'Diana Prince', 'email_base' => 'diana.prince'],
            ['name' => 'Peter Parker', 'email_base' => 'peter.parker'],
            ['name' => 'Tony Stark', 'email_base' => 'tony.stark'],
            ['name' => 'Steve Rogers', 'email_base' => 'steve.rogers'],
            ['name' => 'Natasha Romanoff', 'email_base' => 'natasha.romanoff'],
            ['name' => 'Thor Odinson', 'email_base' => 'thor'],
            ['name' => 'Bruce Banner', 'email_base' => 'bruce.banner'],
            ['name' => 'Barry Allen', 'email_base' => 'barry.allen'],
            ['name' => 'Hal Jordan', 'email_base' => 'hal.jordan'],
            ['name' => 'Arthur Curry', 'email_base' => 'arthur.curry'],
            ['name' => 'Oliver Queen', 'email_base' => 'oliver.queen'],
            ['name' => 'Selina Kyle', 'email_base' => 'selina.kyle'],
            ['name' => 'Harley Quinn', 'email_base' => 'harley.quinn'],
            ['name' => 'Wade Wilson', 'email_base' => 'wade.wilson'],
            ['name' => 'Lois Lane', 'email_base' => 'lois.lane'],
            ['name' => 'Alfred Pennyworth', 'email_base' => 'alfred'],
        ];

        $identity = $this->faker->unique()->randomElement($identities);
        $isVerified = $this->faker->boolean(70);

        return [
            'name'              => $identity['name'],
            'email'             => $identity['email_base'] . '@' . $this->faker->unique()->domainWord() . '.' . $this->faker->tld(),
            'email_verified_at' => $isVerified ? Carbon::now() : null,
            'password'          => Hash::make('password1234'),
            'remember_token'    => Str::random(10),
        ];
    }

    /**
     * Stato: email non verificata.
     */
    public function unverified(): static
    {
        return $this->state(fn () => ['email_verified_at' => null]);
    }

    /**
     * Stato: email verificata.
     */
    public function verified(): static
    {
        return $this->state(fn () => ['email_verified_at' => now()]);
    }

    /**
     * Stato: utente amministratore.
     */
    public function admin(): static
    {
        return $this->state(fn () => ['is_admin' => true]);
    }
}
