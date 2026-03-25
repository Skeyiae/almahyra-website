export interface BankOption {
    label: string;
    type: "fixed" | "stepped";
    periods: {
        label: string;
        monthlyPayment: number;
    }[];
}

export interface BankScheme {
    id: string;
    name: string;
    options: BankOption[];
}

export const BANK_SCHEMES: BankScheme[] = [
    {
        id: "niaga-syariah",
        name: "Bank Niaga Syariah",
        options: [
            {
                label: "Flat Bertahap 15 Tahun",
                type: "stepped",
                periods: [
                    { label: "1-5 Tahun", monthlyPayment: 2778084 },
                    { label: "6-15 Tahun", monthlyPayment: 3897049 },
                ]
            },
            {
                label: "Flat Sampai Akhir (15 Tahun)",
                type: "fixed",
                periods: [
                    { label: "1-15 Tahun", monthlyPayment: 3499254 },
                ]
            }
        ]
    },
    {
        id: "bni",
        name: "Bank BNI",
        options: [
            {
                label: "Flat Bertahap 15 Tahun",
                type: "stepped",
                periods: [
                    { label: "Tahun 1", monthlyPayment: 2545279 },
                    { label: "Tahun 2-3", monthlyPayment: 2884097 },
                    { label: "Tahun 4-10", monthlyPayment: 3336407 },
                    { label: "Tahun 11-15", monthlyPayment: 3526380 },
                ]
            }
        ]
    },
    {
        id: "bsi",
        name: "Bank Syariah Indonesia (BSI)",
        options: [
            {
                label: "Flat Bertahap (Opsi 1)",
                type: "stepped",
                periods: [
                    { label: "Bulan 1-36", monthlyPayment: 2814299 },
                    { label: "Bulan 37-60", monthlyPayment: 3334831 },
                    { label: "Bulan 61-180", monthlyPayment: 3977433 },
                ]
            },
            {
                label: "Flat 15 Tahun (Opsi 2)",
                type: "fixed",
                periods: [
                    { label: "1-15 Tahun", monthlyPayment: 3600000 },
                ]
            }
        ]
    },
    {
        id: "btn-syariah",
        name: "Bank BTN Syariah",
        options: [
            {
                label: "Flat Bertahap 15 Tahun",
                type: "stepped",
                periods: [
                    { label: "Tahun 1", monthlyPayment: 2867277 },
                    { label: "Tahun 2", monthlyPayment: 3133854 },
                    { label: "Tahun 3-4", monthlyPayment: 3578093 },
                    { label: "Tahun 5", monthlyPayment: 4023654 },
                    { label: "Tahun 6-15", monthlyPayment: 4110241 },
                ]
            }
        ]
    }
];

export const BASE_PRICE_KEIKO = 354000000;
