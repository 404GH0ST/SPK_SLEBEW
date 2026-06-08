<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\Alternative;
use App\Models\MarcosResult;
use App\Models\SwaraWeight;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function exportPdf()
    {
        $criteria = Criteria::where('is_active', true)->orderBy('code')->get();
        $weights = SwaraWeight::with('criteria')->orderBy('rank_order')->get();
        $results = MarcosResult::with('alternative')->orderBy('rank')->get();
        $date = Carbon::now()->locale('id')->isoFormat('D MMMM Y');

        // Best recommendation (rank 1)
        $recommendation = $results->first();

        $pdf = Pdf::loadView('reports.pdf', [
            'criteria' => $criteria,
            'weights' => $weights,
            'results' => $results,
            'date' => $date,
            'recommendation' => $recommendation,
        ]);

        return $pdf->stream('Laporan_Kelayakan_Penerima_Pinjaman_' . date('Ymd_His') . '.pdf');
    }

    public function exportExcel()
    {
        $criteria = Criteria::where('is_active', true)->orderBy('code')->get();
        $weights = SwaraWeight::with('criteria')->orderBy('rank_order')->get();
        $results = MarcosResult::with('alternative')->orderBy('rank')->get();
        
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Perhitungan');

        // Styles
        $sheet->setCellValue('A1', 'LAPORAN HASIL KEPUTUSAN KELAYAKAN PENERIMA PINJAMAN KOPERASI');
        $sheet->mergeCells('A1:I1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        
        $sheet->setCellValue('A2', 'Metode Kombinasi SWARA dan MARCOS');
        $sheet->mergeCells('A2:I2');
        $sheet->getStyle('A2')->getFont()->setItalic(true)->setSize(11);
        
        $sheet->setCellValue('A3', 'Tanggal Perhitungan: ' . Carbon::now()->locale('id')->isoFormat('D MMMM Y'));
        $sheet->mergeCells('A3:I3');

        // Table 1: Bobot SWARA
        $sheet->setCellValue('A5', 'Bobot Kriteria (SWARA)');
        $sheet->getStyle('A5')->getFont()->setBold(true)->setSize(12);

        $sheet->setCellValue('A6', 'No');
        $sheet->setCellValue('B6', 'Kode');
        $sheet->setCellValue('C6', 'Nama Kriteria');
        $sheet->setCellValue('D6', 'Tipe');
        $sheet->setCellValue('E6', 'Urutan Prioritas');
        $sheet->setCellValue('F6', 'Sj');
        $sheet->setCellValue('G6', 'Kj');
        $sheet->setCellValue('H6', 'Qj');
        $sheet->setCellValue('I6', 'Bobot Akhir (Wj)');
        
        $sheet->getStyle('A6:I6')->getFont()->setBold(true);

        $row = 7;
        foreach ($weights as $index => $w) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $w->criteria->code);
            $sheet->setCellValue('C' . $row, $w->criteria->name);
            $sheet->setCellValue('D' . $row, ucfirst($w->criteria->type));
            $sheet->setCellValue('E' . $row, $w->rank_order);
            $sheet->setCellValue('F' . $row, $w->sj);
            $sheet->setCellValue('G' . $row, $w->kj);
            $sheet->setCellValue('H' . $row, $w->qj);
            $sheet->setCellValue('I' . $row, $w->weight);
            $row++;
        }

        // Table 2: Hasil Ranking MARCOS
        $row += 2;
        $sheet->setCellValue('A' . $row, 'Hasil Keputusan Kelayakan dan Ranking (MARCOS)');
        $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(12);
        
        $row++;
        $sheet->setCellValue('A' . $row, 'Rank');
        $sheet->setCellValue('B' . $row, 'Kode Nasabah');
        $sheet->setCellValue('C' . $row, 'Nama Nasabah');
        $sheet->setCellValue('D' . $row, 'NIK');
        $sheet->setCellValue('E' . $row, 'Nilai Si');
        $sheet->setCellValue('F' . $row, 'Nilai Utility');
        $sheet->setCellValue('G' . $row, 'Status Kelayakan');
        
        $sheet->getStyle("A{$row}:G{$row}")->getFont()->setBold(true);

        $row++;
        foreach ($results as $res) {
            $sheet->setCellValue('A' . $row, $res->rank);
            $sheet->setCellValue('B' . $row, $res->alternative->code);
            $sheet->setCellValue('C' . $row, $res->alternative->name);
            $sheet->setCellValue('D' . $row, $res->alternative->nik . ' '); // Space to force string formatting
            $sheet->setCellValue('E' . $row, $res->si);
            $sheet->setCellValue('F' . $row, $res->utility_value);
            $sheet->setCellValue('G' . $row, $res->status);
            $row++;
        }

        // Add auto width for columns
        foreach (range('A', 'I') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'Laporan_SPK_Cooperative_' . date('Ymd_His') . '.xlsx';

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        
        $writer->save('php://output');
        exit;
    }
}
