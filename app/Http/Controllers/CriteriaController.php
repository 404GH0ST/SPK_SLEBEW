<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CriteriaController extends Controller
{
    public function index()
    {
        $criteria = Criteria::orderBy('code')->get();
        return Inertia::render('Criteria/Index', [
            'criteria' => $criteria,
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Hanya Admin yang dapat menambah kriteria.');
        }

        $request->validate([
            'code' => 'required|string|unique:criteria,code|max:50',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:benefit,cost',
            'unit' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ], [
            'code.required' => 'Kode kriteria wajib diisi.',
            'code.unique' => 'Kode kriteria sudah digunakan.',
            'name.required' => 'Nama kriteria wajib diisi.',
            'type.required' => 'Tipe kriteria wajib diisi.',
            'type.in' => 'Tipe kriteria harus benefit atau cost.',
        ]);

        Criteria::create($request->all());

        return redirect()->route('criteria.index')->with('success', 'Kriteria berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Hanya Admin yang dapat mengubah kriteria.');
        }

        $criterion = Criteria::findOrFail($id);

        $request->validate([
            'code' => 'required|string|max:50|unique:criteria,code,' . $criterion->id,
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:benefit,cost',
            'unit' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ], [
            'code.required' => 'Kode kriteria wajib diisi.',
            'code.unique' => 'Kode kriteria sudah digunakan.',
            'name.required' => 'Nama kriteria wajib diisi.',
            'type.required' => 'Tipe kriteria wajib diisi.',
            'type.in' => 'Tipe kriteria harus benefit atau cost.',
        ]);

        $criterion->update($request->all());

        return redirect()->route('criteria.index')->with('success', 'Kriteria berhasil diperbarui.');
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Hanya Admin yang dapat menghapus kriteria.');
        }

        $criterion = Criteria::findOrFail($id);
        $criterion->delete();

        return redirect()->route('criteria.index')->with('success', 'Kriteria berhasil dihapus.');
    }
}
