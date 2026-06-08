<?php

namespace App\Http\Controllers;

use App\Models\Alternative;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlternativeController extends Controller
{
    public function index()
    {
        $alternatives = Alternative::orderBy('code')->get();
        return Inertia::render('Alternatives/Index', [
            'alternatives' => $alternatives,
        ]);
    }

    public function store(Request $request)
    {
        if (!in_array(auth()->user()->role, ['admin', 'petugas'])) {
            abort(403, 'Hanya Petugas atau Admin yang dapat menambah nasabah.');
        }

        $request->validate([
            'code' => 'required|string|unique:alternatives,code|max:50',
            'name' => 'required|string|max:255',
            'nik' => 'nullable|string|unique:alternatives,nik|max:20',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ], [
            'code.required' => 'Kode nasabah wajib diisi.',
            'code.unique' => 'Kode nasabah sudah digunakan.',
            'name.required' => 'Nama nasabah wajib diisi.',
            'nik.unique' => 'NIK sudah terdaftar.',
        ]);

        Alternative::create($request->all());

        return redirect()->route('alternatives.index')->with('success', 'Nasabah berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        if (!in_array(auth()->user()->role, ['admin', 'petugas'])) {
            abort(403, 'Hanya Petugas atau Admin yang dapat mengubah nasabah.');
        }

        $alternative = Alternative::findOrFail($id);

        $request->validate([
            'code' => 'required|string|max:50|unique:alternatives,code,' . $alternative->id,
            'name' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20|unique:alternatives,nik,' . $alternative->id,
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ], [
            'code.required' => 'Kode nasabah wajib diisi.',
            'code.unique' => 'Kode nasabah sudah digunakan.',
            'name.required' => 'Nama nasabah wajib diisi.',
            'nik.unique' => 'NIK sudah terdaftar.',
        ]);

        $alternative->update($request->all());

        return redirect()->route('alternatives.index')->with('success', 'Nasabah berhasil diperbarui.');
    }

    public function destroy($id)
    {
        if (!in_array(auth()->user()->role, ['admin', 'petugas'])) {
            abort(403, 'Hanya Petugas atau Admin yang dapat menghapus nasabah.');
        }

        $alternative = Alternative::findOrFail($id);
        $alternative->delete();

        return redirect()->route('alternatives.index')->with('success', 'Nasabah berhasil dihapus.');
    }
}
