# Tax Calculation API Backend

This project provides an Express.js-based API for calculating various types of taxes. It includes endpoints for different tax calculation scenarios, including progressive tax rates, specific business types, and future tax policies.

---

## 📋 **Features**

1. **PTKP (Non-Taxable Income)** support for different categories.
2. **Progressive Tax Calculation** based on Indonesian tax brackets.
3. **Business-specific logic** for different entities (personal, CV, PT).
4. **Norma-based calculations** simulating future tax scenarios for 2025.
5. **Error handling** for input validation.

---

## 🚀 **Installation**

1. **Install Node.js** (if not already installed):
   - Download from [Node.js official website](https://nodejs.org/).
   - Verify installation:
     ```bash
     node -v
     npm -v
     ```

2. **Initialize the project:**
   ```bash
   npm init -y
   ```

3. **Install required libraries:**
   ```bash
   npm install express cors
   ```

4. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tax-calculation-backend.git
   ```

5. **Navigate to the project directory:**
   ```bash
   cd tax-calculation-backend
   ```

---

## ⚙️ **Usage**

1. **Start the server:**
   ```bash
   node index.js
   ```
   **OR** (if using `npm start`)
   ```bash
   npm run start
   ```

2. **Access the API at:**
   ```
   https://umkm-pajak-api-57151910209.asia-southeast2.run.app
   ```

---

## 📡 **API Endpoints**

### **1. Calculate Tax for Pre-2025 Rules**
- **Endpoint:** `/calculate-under2025`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "tahun": 3,
    "penghasilan": 600000000,
    "golongan": "PT"
  }
  ```
- **Response:**
  ```json
  {
    "taxAmount": 3000000
  }
  ```

### **2. Calculate Tax for 2025 Rules (with Norma)**
- **Endpoint:** `/calculate-2025`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "penghasilan": 80000000,
    "golongan": "K/0",
    "norma": 20
  }
  ```
- **Response:**
  ```json
  {
    "penghasilan": 80000000,
    "penghasilanNetto": 16000000,
    "ptkp": 58500000,
    "pkp": 0,
    "PPHTerutang": 0,
    "taxAmount": 0
  }
  ```

### **3. Calculate Progressive Tax for Businesses**
- **Endpoint:** `/calculate-pembukuan-progresif`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "penghasilan": 100000000,
    "hargaPokok": 30000000,
    "biayaUsaha": 20000000,
    "golongan": "K/2"
  }
  ```
- **Response:**
  ```json
  {
    "totalPajak": 1750000
  }
  ```

---

## 🛠 **Technologies Used**
- **Node.js**
- **Express.js**
- **CORS**

---

## 📝 **Dependencies**
- **Express:** Web framework for Node.js
  ```bash
  npm install express
  ```
- **CORS:** Middleware for handling cross-origin requests
  ```bash
  npm install cors
  ```

---

## ❗ **Error Handling**
- Ensures valid input types (numbers).
- Validates tax categories.
- Returns meaningful error messages.

---

Happy coding! 🚀
