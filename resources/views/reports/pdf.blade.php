<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Hasil Keputusan Kelayakan Penerima Pinjaman</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            color: #333333;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h2 {
            margin: 0;
            font-size: 16pt;
            text-transform: uppercase;
        }
        .header h3 {
            margin: 5px 0 0 0;
            font-size: 12pt;
            font-weight: normal;
            font-style: italic;
        }
        .date-info {
            text-align: right;
            font-size: 10pt;
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            background-color: #f3f4f6;
            padding: 6px 10px;
            margin-top: 25px;
            margin-bottom: 10px;
            border-left: 4px solid #1d4ed8;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 10pt;
        }
        table, th, td {
            border: 1px solid #d1d5db;
        }
        th {
            background-color: #f9fafb;
            font-weight: bold;
            text-align: left;
            padding: 8px;
        }
        td {
            padding: 8px;
            vertical-align: top;
        }
        .center {
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            font-size: 9pt;
            font-weight: bold;
            border-radius: 4px;
            color: #ffffff;
        }
        .badge-sangat-layak {
            background-color: #16a34a;
        }
        .badge-layak {
            background-color: #2563eb;
        }
        .badge-dipertimbangkan {
            background-color: #ca8a04;
        }
        .badge-tidak-prioritas {
            background-color: #dc2626;
        }
        .recommendation-card {
            border: 1px solid #16a34a;
            background-color: #f0fdf4;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            margin-bottom: 30px;
        }
        .recommendation-card h4 {
            margin: 0 0 10px 0;
            color: #16a34a;
            font-size: 12pt;
        }
        .footer {
            margin-top: 50px;
            width: 100%;
        }
        .signature-table {
            border: none;
            width: 100%;
        }
        .signature-table td {
            border: none;
            width: 50%;
            text-align: center;
        }
        .signature-space {
            height: 70px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Sistem Pendukung Keputusan Kelayakan Penerima Pinjaman</h2>
        <h3>Koperasi Simpan Pinjam (Kombinasi Metode SWARA dan MARCOS)</h3>
    </div>

    <div class="date-info">
        Tanggal Laporan: {{ $date }}
    </div>

    <div class="section-title">A. Bobot Kriteria (SWARA)</div>
    <table>
        <thead>
            <tr>
                <th class="center" style="width: 5%">No</th>
                <th style="width: 10%">Kode</th>
                <th style="width: 25%">Nama Kriteria</th>
                <th style="width: 12%">Tipe</th>
                <th class="center" style="width: 12%">Prioritas (Rank)</th>
                <th class="center" style="width: 10%">Sj</th>
                <th class="center" style="width: 10%">Kj</th>
                <th class="center" style="width: 10%">Qj</th>
                <th class="center" style="width: 12%">Bobot (Wj)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($weights as $index => $w)
            <tr>
                <td class="center">{{ $index + 1 }}</td>
                <td>{{ $w->criteria->code }}</td>
                <td>{{ $w->criteria->name }}</td>
                <td>{{ ucfirst($w->criteria->type) }}</td>
                <td class="center">{{ $w->rank_order }}</td>
                <td class="center">{{ number_format($w->sj, 4) }}</td>
                <td class="center">{{ number_format($w->kj, 4) }}</td>
                <td class="center">{{ number_format($w->qj, 4) }}</td>
                <td class="center" style="font-weight: bold;">{{ number_format($w->weight, 4) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">B. Hasil Penilaian dan Ranking Akhir (MARCOS)</div>
    <table>
        <thead>
            <tr>
                <th class="center" style="width: 8%">Rank</th>
                <th style="width: 12%">Kode</th>
                <th style="width: 28%">Nama Nasabah</th>
                <th style="width: 18%">NIK</th>
                <th class="center" style="width: 12%">Nilai Si</th>
                <th class="center" style="width: 12%">Nilai Utility</th>
                <th class="center" style="width: 18%">Status Kelayakan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($results as $res)
            <tr>
                <td class="center" style="font-weight: bold;">{{ $res->rank }}</td>
                <td>{{ $res->alternative->code }}</td>
                <td>{{ $res->alternative->name }}</td>
                <td>{{ $res->alternative->nik }}</td>
                <td class="center">{{ number_format($res->si, 4) }}</td>
                <td class="center" style="font-weight: bold;">{{ number_format($res->utility_value, 4) }}</td>
                <td class="center">
                    @if($res->status === 'Sangat Layak')
                        <span class="badge badge-sangat-layak">Sangat Layak</span>
                    @elseif($res->status === 'Layak')
                        <span class="badge badge-layak">Layak</span>
                    @elseif($res->status === 'Dipertimbangkan')
                        <span class="badge badge-dipertimbangkan">Dipertimbangkan</span>
                    @else
                        <span class="badge badge-tidak-prioritas">Tidak Prioritas</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($recommendation)
    <div class="recommendation-card">
        <h4>Rekomendasi Penerima Pinjaman Terbaik:</h4>
        Berdasarkan perhitungan SPK menggunakan metode SWARA dan MARCOS, nasabah dengan ranking tertinggi (terbaik) adalah <strong>{{ $recommendation->alternative->name }}</strong> ({{ $recommendation->alternative->code }}) dengan nilai utilitas sebesar <strong>{{ number_format($recommendation->utility_value, 4) }}</strong> dan status kelayakan <strong>{{ $recommendation->status }}</strong>.
    </div>
    @endif

    <div class="footer">
        <table class="signature-table">
            <tr>
                <td>
                    Mengetahui,<br>
                    <strong>Kepala Koperasi / Pakar</strong>
                    <div class="signature-space"></div>
                    (...................................................)
                </td>
                <td>
                    Dilaporkan oleh,<br>
                    <strong>Admin SPK</strong>
                    <div class="signature-space"></div>
                    (...................................................)
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
