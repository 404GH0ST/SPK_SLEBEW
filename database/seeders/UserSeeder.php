<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin Koperasi',
                'email' => 'admin@coop.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Pakar / Kepala Koperasi',
                'email' => 'pakar@coop.com',
                'password' => Hash::make('password'),
                'role' => 'pakar',
            ],
            [
                'name' => 'Petugas Koperasi',
                'email' => 'petugas@coop.com',
                'password' => Hash::make('password'),
                'role' => 'petugas',
            ],
            [
                'name' => 'Pimpinan Koperasi',
                'email' => 'pimpinan@coop.com',
                'password' => Hash::make('password'),
                'role' => 'pimpinan',
            ],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(['email' => $u['email']], $u);
        }
    }
}
