package com.gameshop.model.enums;

/**
 * Lý do thay đổi stock
 */
public enum StockMovementReason {
    GoodsReceipt,           // Nhập hàng từ nhà cung cấp
    Sale,                   // Bán hàng (trừ stock)
    Return,                 // Hoàn hàng (cộng lại stock)
    DamagedAdjustment,      // Điều chỉnh hàng hỏng
    StocktakeAdjustment,    // Điều chỉnh kiểm kê
    ManualAdjustment        // Điều chỉnh thủ công (admin)
}