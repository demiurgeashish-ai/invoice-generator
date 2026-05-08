const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoiceModel');
const { protect } = require('../middlewares/authMiddleware');
const { z } = require('zod');
const Business = require('../models/businessModel');

router.use(protect);

// Validation Schema
const invoiceSchema = z.object({
  client: z.string().nonempty('Client is required'),
  invoiceNo: z.string().optional(),
  date: z.string().optional(),
  dueDate: z.string().optional(),
  items: z.array(z.object({
    description: z.string().nonempty('Description is required'),
    sacCode: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
    gstRate: z.number().min(0).optional(),
    amount: z.number().min(0, 'Amount must be positive')
  })).min(1, 'At least one item is required'),
  subTotal: z.number().min(0),
  taxRate: z.number().min(0).optional(),
  taxAmount: z.number().min(0).optional(),
  total: z.number().min(0),
  status: z.enum(['Paid', 'Unpaid', 'Overdue']).optional(),
  notes: z.string().optional()
});

// Get all invoices for user
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).populate('client').sort({ date: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client');

    if (invoice) {
      if (invoice.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    const validatedData = invoiceSchema.parse(req.body);

    let finalInvoiceNo;

    if (validatedData.invoiceNo && validatedData.invoiceNo.trim()) {
      // User provided a manual invoice number — check it's not already taken
      const existing = await Invoice.findOne({ user: req.user._id, invoiceNo: validatedData.invoiceNo.trim() });
      if (existing) {
        return res.status(400).json({ message: `Invoice number "${validatedData.invoiceNo.trim()}" already exists. Please use a different number.` });
      }
      finalInvoiceNo = validatedData.invoiceNo.trim();
    } else {
      // Auto-generate: prefix + padded sequential count
      const business = await Business.findOne({ user: req.user._id });
      const prefix = business?.branding?.invoicePrefix || 'IN';
      const count = await Invoice.countDocuments({ user: req.user._id });
      finalInvoiceNo = `${prefix}${String(count + 1).padStart(5, '0')}`;
    }

    const invoice = new Invoice({
      user: req.user._id,
      ...validatedData,
      invoiceNo: finalInvoiceNo
    });

    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      if (invoice.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const validatedData = invoiceSchema.parse(req.body);

      Object.assign(invoice, validatedData);
      const updatedInvoice = await invoice.save();
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      if (invoice.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await Invoice.deleteOne({ _id: invoice._id });
      res.json({ message: 'Invoice removed' });
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
