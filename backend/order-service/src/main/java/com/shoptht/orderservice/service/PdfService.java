package com.shoptht.orderservice.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.shoptht.orderservice.entity.Order;
import com.shoptht.orderservice.entity.OrderItem;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public void exportReceipt(HttpServletResponse response, Order order) throws IOException {
        // 1. Cấu hình khổ giấy (80mm - In nhiệt)
        // Chiều rộng 226 point (~80mm), chiều dài tùy chỉnh (ở đây để 650)
        Rectangle pageSize = new Rectangle(226, 650);
        Document document = new Document(pageSize, 10, 10, 10, 10);

        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // 2. Font chữ (Dùng Helvetica mặc định để tránh lỗi, nếu muốn Tiếng Việt cần nạp font .ttf)
        BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Font fontTitle = new Font(bf, 14, Font.BOLD);
        Font fontBold = new Font(bf, 9, Font.BOLD);
        Font fontNormal = new Font(bf, 9, Font.NORMAL);
        Font fontSmall = new Font(bf, 8, Font.ITALIC);

        // --- HEADER ---
        Paragraph shopName = new Paragraph("THT STORE", fontTitle);
        shopName.setAlignment(Element.ALIGN_CENTER);
        document.add(shopName);

        Paragraph address = new Paragraph("Phenikaa, Ha Noi\nTel: 1900 272737", fontNormal);
        address.setAlignment(Element.ALIGN_CENTER);
        document.add(address);

        addDashedLine(document, bf);

        // --- THÔNG TIN KHÁCH HÀNG ---
        // Xử lý ngày tháng (Order của bạn dùng LocalDateTime)
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String dateStr = (order.getOrderDate() != null) ? order.getOrderDate().format(dtf) : "N/A";

        // Xử lý null cho SĐT và Email
        String phoneStr = (order.getPhone() != null) ? order.getPhone() : "";
        
        // QUAN TRỌNG: Sửa getEmail() thành getCustomerEmail() cho khớp entity của bạn
        String emailStr = (order.getCustomerEmail() != null) ? order.getCustomerEmail() : "";

        Paragraph orderInfo = new Paragraph(
                "Ngay: " + dateStr + "\n" +
                "So HD: #" + order.getId() + "\n" +
                "Khach: " + order.getCustomerName() + "\n" +
                "SDT: " + phoneStr + "\n" +      
                "Email: " + emailStr,            
                fontNormal);
        document.add(orderInfo);

        Paragraph title = new Paragraph("HOA DON BAN HANG", fontBold);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(5);
        title.setSpacingAfter(5);
        document.add(title);

        addDashedLine(document, bf);

        // --- BẢNG SẢN PHẨM ---
        // Chia cột: Tên(45%), SL(15%), Giá(20%), Thành tiền(20%)
        PdfPTable table = new PdfPTable(new float[]{4.5f, 1.5f, 2f, 2f});
        table.setWidthPercentage(100);
        
        addCell(table, "TEN HANG", fontBold, Element.ALIGN_LEFT);
        addCell(table, "SL", fontBold, Element.ALIGN_CENTER);
        addCell(table, "D.GIA", fontBold, Element.ALIGN_RIGHT);
        addCell(table, "T.TIEN", fontBold, Element.ALIGN_RIGHT);

        DecimalFormat formatter = new DecimalFormat("###,###");
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                addCell(table, item.getProductName(), fontNormal, Element.ALIGN_LEFT);
                addCell(table, String.valueOf(item.getQuantity()), fontNormal, Element.ALIGN_CENTER);
                addCell(table, formatter.format(item.getPrice()), fontNormal, Element.ALIGN_RIGHT);
                addCell(table, formatter.format(item.getPrice() * item.getQuantity()), fontNormal, Element.ALIGN_RIGHT);
            }
        }

        document.add(table);
        addDashedLine(document, bf);

        // --- TỔNG KẾT ---
        PdfPTable totalTable = new PdfPTable(new float[]{6f, 4f});
        totalTable.setWidthPercentage(100);

        Double totalAmount = order.getTotalAmount() != null ? order.getTotalAmount() : 0.0;
        
        addTotalRow(totalTable, "Tong tien:", formatter.format(totalAmount), fontBold);
        addTotalRow(totalTable, "Giam gia:", "0", fontNormal);
        addTotalRow(totalTable, "Thanh toan:", formatter.format(totalAmount), fontBold);

        document.add(totalTable);
        addDashedLine(document, bf);

        // --- FOOTER ---
        Paragraph footer = new Paragraph("Xin cam on Quy khach!\nHen gap lai!", fontSmall);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(10);
        document.add(footer);

        document.close();
    }

    // Hàm vẽ đường kẻ đứt
    private void addDashedLine(Document document, BaseFont bf) throws DocumentException {
        Paragraph line = new Paragraph("------------------------------------------------", new Font(bf, 8));
        line.setAlignment(Element.ALIGN_CENTER);
        document.add(line);
    }

    // Hàm thêm ô vào bảng (căn lề, không viền)
    private void addCell(PdfPTable table, String text, Font font, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(align);
        cell.setPaddingBottom(5);
        table.addCell(cell);
    }

    // Hàm thêm dòng tổng tiền
    private void addTotalRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, font));
        cellLabel.setBorder(Rectangle.NO_BORDER);
        cellLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, font));
        cellValue.setBorder(Rectangle.NO_BORDER);
        cellValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(cellValue);
    }
}