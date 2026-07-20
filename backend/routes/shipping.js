const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { verifyToken } = require("../middleware/auth");

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || "y8ajBnF40ebd0136939bbd78AtTCwodQDan";
const BASE_URL = "https://rajaongkir.komerce.id/api/v1";

// Proxy semua request shipping ke API RajaOngkir Komerce
router.all("/*", async (req, res) => {
  try {
    if (!RAJAONGKIR_API_KEY) {
      return res.status(500).json({ status: "error", message: "API Key RajaOngkir belum dikonfigurasi" });
    }

    const path = req.path; // e.g. /destination/domestic-destination
    const query = new URLSearchParams(req.query).toString();
    const targetUrl = `${BASE_URL}${path}${query ? "?" + query : ""}`;

    const fetchOptions = {
      method: req.method,
      headers: {
        "key": RAJAONGKIR_API_KEY,
        "Content-Type": "application/json",
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error("RajaOngkir Proxy Error:", error);
    res.status(500).json({ status: "error", message: "Gagal terhubung ke layanan pengiriman", error: error.message });
  }
});

module.exports = router;
