# BNN App - React Native

Aplikasi BNN (Badan Narkotika Nasional) Kota Surabaya yang dibangun dengan React Native.

## Struktur Project

```
bnn_app_react_native/
├── App.js                    # Main application component
├── index.js                  # Entry point
├── package.json              # Dependencies
├── babel.config.js           # Babel configuration
├── app.json                  # App configuration
├── constants/
│   ├── AppColors.js         # Color constants
│   └── AppTextStyles.js     # Text style constants
└── screens/
    └── HomeScreen.js        # Home/Login screen
```

## Fitur

- **Tampilan Login**: Halaman login dengan 4 pilihan pengguna
  - Login Masyarakat (Biru)
  - Login Lembaga (Hijau)
  - Login Penyidik (Orange)
  - Login Admin (Abu-abu)
- **Gradient Background**: Background dengan gradient biru
- **Logo BNN**: Logo dan nama kota Surabaya
- **Responsive Design**: Menggunakan SafeAreaView dan Dimensions

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Untuk Android:
```bash
npm run android
```

3. Untuk iOS:
```bash
npm run ios
```

## Dependencies

- react: 18.2.0
- react-native: 0.72.6
- react-native-linear-gradient: ^2.8.3

## Catatan

Aplikasi ini adalah versi React Native yang meniru tampilan dari aplikasi Flutter BNN yang ada di folder `bnn_app`.

### Perbedaan dengan Flutter Version:
- Menggunakan React Native components (View, Text, TouchableOpacity)
- Menggunakan StyleSheet untuk styling
- Menggunakan react-native-linear-gradient untuk gradient background
- File menggunakan ekstensi .js

### Kemiripan dengan Flutter Version:
- Struktur layout yang sama
- Warna yang sama (AppColors)
- Text styles yang konsisten
- 4 tombol login dengan warna yang sama
- Layout dan spacing yang mirip
