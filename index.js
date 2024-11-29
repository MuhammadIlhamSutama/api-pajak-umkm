const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const PTKP = [
    { golongan: 'TK/0', bebasPajak: 54000000 },
    { golongan: 'TK/1', bebasPajak: 58500000 },
    { golongan: 'TK/2', bebasPajak: 63000000 },
    { golongan: 'TK/3', bebasPajak: 67500000 },
    { golongan: 'K/0', bebasPajak: 58500000 },
    { golongan: 'K/1', bebasPajak: 63000000 },
    { golongan: 'K/2', bebasPajak: 67500000 },
    { golongan: 'K/3', bebasPajak: 72000000 },
    { golongan: 'K/I/0', bebasPajak: 112500000 },
    { golongan: 'K/I/1', bebasPajak: 117500000 },
    { golongan: 'K/I/2', bebasPajak: 121500000 },
    { golongan: 'K/I/3', bebasPajak: 126000000 }
];

function hitungPPhTerutang( pkp) {
    
    if (pkp <= 0) return 0;

    const tarif = [
        { batas: 60000000, persen: 0.05 },
        { batas: 250000000, persen: 0.15 },
        { batas: 500000000, persen: 0.25 },
        { batas: Infinity, persen: 0.30 }
    ];

    let totalPajak = 0;
    let sisaPKP = pkp;

    for (let i = 0; i < tarif.length; i++) {
        const { batas, persen } = tarif[i];
        let bagianKenaPajak = Math.min(sisaPKP, batas - (tarif[i - 1]?.batas || 0));
        totalPajak += bagianKenaPajak * persen;
        sisaPKP -= bagianKenaPajak;
        if (sisaPKP <= 0) break;
    }

    return totalPajak;
}

app.post('/calculate-under2025', (req, res) => {
    const { tahun, penghasilan, golongan } = req.body;

    if (typeof penghasilan !== 'number' || penghasilan < 0) {
        return res.status(400).json({ error: "Tolong masukkan angka penghasilan yang valid" });
    }

    let taxAmount = 0;

    // const ptkpEntry = PTKP.find(entry => entry.golongan === golongan);
    // if (!ptkpEntry) {
    //     return res.status(400).json({ error: "Golongan tidak ditemukan" });
    // }
    // const ptkp = ptkpEntry.bebasPajak;

    switch (golongan) {
        case 'pribadi':
            if (penghasilan <= 500000000) {
                taxAmount = 0;
            } else if (tahun <= 7) {
                taxAmount = 0.005;
            } else {
                taxAmount = 0.01;
            }
            break;
        case 'CV':
            if (tahun <= 4) {
                taxAmount = 0.05;
            }
            break;
        case 'PT':
            if (tahun <= 3) {
                taxAmount = 0.5;
            }
            break;
        default:
            return res.status(400).json({ error: "Golongan tidak valid" });
    }

    const final = penghasilan * taxAmount;
    res.json({ taxAmount: final });
});

app.post('/calculate-2025', (req, res) => {
    const { penghasilan, golongan, norma } = req.body;

    if (typeof penghasilan !== 'number' || penghasilan < 0) {
        return res.status(400).json({ error: "Tolong masukkan angka penghasilan yang valid" });
    }

    const ptkpEntry = PTKP.find(entry => entry.golongan === golongan);
    if (!ptkpEntry) {
        return res.status(400).json({ error: "Golongan tidak ditemukan" });
    }
    const ptkp = ptkpEntry.bebasPajak;

    // Calculate PKP (Penghasilan Kena Pajak)
    const LKU = norma / 100;
    const penghasilanNetto = penghasilan * LKU; 
    const pkp = penghasilanNetto - ptkp;
   

    let totalPajak = hitungPPhTerutang(pkp);
    let pkpFinal = Math.max(pkp, 0);

    // Ensure PKP is not negative
    const pphFinal = Math.max(totalPajak, 0);
    
    // Calculate the final tax amount
    const final = pphFinal / 12;

    let finalRounded= Math.round(final);
    

    // Include PKP in the response
    res.json({
        penghasilan: penghasilan,
        penghasilanNetto: penghasilanNetto,
        ptkp: ptkp,
        pkp: pkpFinal,
        PPHTerutang: pphFinal,
        taxAmount: finalRounded
    });
});


app.post('/calculate-pembukuan-progresif', (req, res) => {
    const { penghasilan, hargaPokok, biayaUsaha, golongan } = req.body;

    if (typeof penghasilan !== 'number' || typeof hargaPokok !== 'number' || typeof biayaUsaha !== 'number') {
        return res.status(400).json({ error: "Semua input harus berupa angka" });
    }

    const ptkpEntry = PTKP.find(entry => entry.golongan === golongan);
    if (!ptkpEntry) {
        return res.status(400).json({ error: "Golongan tidak ditemukan" });
    }
    const ptkp = ptkpEntry.bebasPajak;
    
    let penghasilanNetto = penghasilan - hargaPokok - biayaUsaha; 
    let pkp = penghasilanNetto - ptkp;
    let totalPajak = hitungPPhTerutang(pkp);

    res.json({ totalPajak: totalPajak });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});