const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

//create pdf

exports.createInvoice = (req, res, order) => {
  const invoiceFile = "invoice-" + req.params.orderId + ".pdf";
  const invoiceFilePath = path.join("data/invoice", invoiceFile);

  let doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="' + invoiceFile + '"'
  );
  generateHeader(doc);
  generateCustomerInformation(doc, order);
  generateInvoiceTable(doc, order);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(invoiceFilePath));
  doc.pipe(res);
};

function generateHeader(doc) {
  doc
    .image(path.join(__dirname, "../public/images", "logo.png"), 50, 45, {
      width: 100,
    })
    .fillColor("#444444")
    .fontSize(10)
    .text("FAKE Inc.", 200, 50, { align: "right" })
    .fontSize(10)
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thank you for your business. Shop again",
      50,
      680,
      { align: "center", width: 500 }
    );
}

function generateCustomerInformation(doc, order) {
  let totalPrice = 0;
  const customerInformationTop = 200;
  order.products.forEach(
    (item) => (totalPrice += item.product.price * item.quantity)
  );
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  doc
    .fontSize(10)
    .text("Order Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(order._id, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Total:", 50, customerInformationTop + 30)
    .text(formatCurrency(totalPrice), 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(order.user.name, 300, customerInformationTop)
    .font("Helvetica-Bold")
    .text(order.user.email, 300, customerInformationTop + 15)
    .font("Helvetica")
    .text("Vijaynagar, Bengaluru - 40", 300, customerInformationTop + 30)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, order) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < order.products.length; i++) {
    const item = order.products[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.product.title,
      item.product.description,
      formatCurrency(item.product.price ),
      item.quantity,
      formatCurrency(item.product.price * item.quantity)
    );

    generateHr(doc, position + 20);
  }
}
function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
    if (description.length > 50 ) {
        description = description.substring(0, 50).concat("...");
    }
  doc
    .fontSize(9)
    .text(item, 50, y)
    .text(description, 125, y, {width: 300})
    .text(unitCost, 320, y, { width: 90, align: "right" })
    .text(quantity, 390, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function formatCurrency(cents) {
  return "Rs. " + cents.toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}
