<?php

namespace Modules\User\Observers;

use Modules\User\Models\User;
use Modules\Categories\Models\Category;

class UserObserver
{
    public function created(User $user): void
    {
        if (app()->runningUnitTests()) {
            return;
        }
        // Set default avatar if not provided
        if (!$user->avatar) {
            $user->avatar = 'images/avatars/avatar-1.svg';
            $user->save();
        }

        // Assign default categories if missing
        $defaults = [
            ['name' => 'Alimentazione', 'type' => 'spesa'],
            ['name' => 'Trasporti', 'type' => 'spesa'],
            ['name' => 'Casa', 'type' => 'spesa'],
            ['name' => 'Utenze', 'type' => 'spesa'],
            ['name' => 'Svago', 'type' => 'spesa'],
            ['name' => 'Salute', 'type' => 'spesa'],
            ['name' => 'Istruzione', 'type' => 'spesa'],
            ['name' => 'Viaggi', 'type' => 'spesa'],
            ['name' => 'Regali', 'type' => 'spesa'],
            ['name' => 'Altro (Spesa)', 'type' => 'spesa'],
            ['name' => 'Stipendio', 'type' => 'entrata'],
            ['name' => 'Investimenti', 'type' => 'entrata'],
            ['name' => 'Regalo', 'type' => 'entrata'],
            ['name' => 'Altro (Entrata)', 'type' => 'entrata'],
        ];

        foreach ($defaults as $cat) {
            $user->categories()->firstOrCreate(
                ['name' => $cat['name']],
                ['type' => $cat['type']]
            );
        }
    }
}

