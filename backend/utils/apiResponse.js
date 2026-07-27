/**
 * Unified API Response Utility
 * Professional standard response formatter for Express API controllers
 */

class ApiResponse {
  static success(res, message = "Berhasil", data = null, statusCode = 200, meta = undefined) {
    const payload = {
      success: true,
      message,
    };

    if (data !== null && data !== undefined) {
      payload.data = data;
    }

    if (meta !== undefined) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, message = "Data berhasil dibuat", data = null) {
    return ApiResponse.success(res, message, data, 201);
  }

  static error(res, message = "Terjadi kesalahan server", statusCode = 500, errors = undefined) {
    const payload = {
      success: false,
      message,
    };

    if (errors !== undefined && process.env.NODE_ENV !== "production") {
      payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
  }

  static badRequest(res, message = "Request tidak valid", errors = undefined) {
    return ApiResponse.error(res, message, 400, errors);
  }

  static unauthorized(res, message = "Akses tidak diizinkan. Token tidak valid atau expired") {
    return ApiResponse.error(res, message, 401);
  }

  static forbidden(res, message = "Akses ditolak. Anda tidak memiliki izin untuk sumber daya ini") {
    return ApiResponse.error(res, message, 403);
  }

  static notFound(res, message = "Sumber daya tidak ditemukan") {
    return ApiResponse.error(res, message, 404);
  }

  static paginate(res, message = "Berhasil mengambil data", data = [], page = 1, limit = 10, total = 0) {
    const totalPages = Math.ceil(total / limit) || 1;
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}

module.exports = ApiResponse;
