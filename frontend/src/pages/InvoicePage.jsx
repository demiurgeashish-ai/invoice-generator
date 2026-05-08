import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRecoilValue } from 'recoil';
import { invoiceAtom, companyAtom } from '../store/atom';
import { useNavigate } from 'react-router-dom';

function InvoicePage() {
  const invoice = useRecoilValue(invoiceAtom);
  const company = useRecoilValue(companyAtom);
  const navigate = useNavigate();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${invoice?.invoiceNo}`,
  });

  if (!invoice || !invoice._id) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 mb-4">No invoice selected.</p>
        <button onClick={() => navigate('/view-invoices')} className="px-4 py-2 bg-gray-200 rounded">Go Back</button>
      </div>
    );
  }

  if (!company) {
    return <div className="text-center mt-20">Loading company config...</div>;
  }

  const primaryColor = company?.branding?.primaryColor || '#000000';

  return (
    <div className="flex-grow p-6 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-end mb-4 gap-4">
        <button onClick={() => navigate('/view-invoices')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 font-medium">Back</button>
        <button onClick={handlePrint} className="px-4 py-2 text-white rounded shadow hover:opacity-90 font-medium flex items-center gap-2" style={{ backgroundColor: primaryColor }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print / PDF
        </button>
      </div>

      <style>
        {`
          @media print {
            @page { size: A4; margin: 0; }
            body { -webkit-print-color-adjust: exact; margin: 0; }
            .print-container { border: none; shadow: none; width: 100%; min-height: 100vh; }
          }
        `}
      </style>

      <div 
        ref={componentRef} 
        className="print-container bg-white p-12 shadow-md border border-gray-100 relative overflow-hidden flex flex-col"
        style={{ width: '210mm', minHeight: '297mm' }}
      >
        {/* Watermark */}
        {company.logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
            <img src={company.logoUrl} alt="Watermark" className="w-1/2 max-w-md object-contain grayscale" />
          </div>
        )}

        <div className="relative z-10 flex flex-col flex-grow">
          {/* Header */}
        <div className="flex justify-between items-start border-b-2 pb-6 mb-6" style={{ borderColor: primaryColor }}>
          <div>
            {company.logoUrl && <img src={company.logoUrl} alt="Logo" className="h-16 object-contain mb-4" />}
            <h1 className="text-4xl font-extrabold uppercase tracking-widest" style={{ color: primaryColor }}>INVOICE</h1>
            <p className="text-gray-500 font-medium mt-1">Invoice No: <span className="text-gray-900">{invoice.invoiceNo}</span></p>
            <p className="text-gray-500 font-medium">Date: <span className="text-gray-900">{new Date(invoice.date).toLocaleDateString()}</span></p>
            {invoice.dueDate && (
              <p className="text-gray-500 font-medium">Due Date: <span className="text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</span></p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">{company.name}</h2>
            {company.address?.line1 && <p className="text-gray-600">{company.address.line1}</p>}
            {company.address?.line2 && <p className="text-gray-600">{company.address.line2}</p>}
            {(company.address?.state || company.address?.pincode) && (
              <p className="text-gray-600">
                {[company.address.state, company.address.pincode].filter(Boolean).join(', ')}
              </p>
            )}
            {company.tax?.gst && <p className="text-gray-600">GSTIN: {company.tax.gst}</p>}
            {company.tax?.pan && <p className="text-gray-600">PAN: {company.tax.pan}</p>}
            <p className="text-gray-600">{company.contact?.email}</p>
            <p className="text-gray-600">{company.contact?.phone}</p>
          </div>
        </div>

        {/* Billed To */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2 border-l-4 pl-3" style={{ borderColor: primaryColor }}>BILLED TO</h3>
          <div className="text-gray-700 pl-4">
            <p className="font-bold text-lg">{invoice.client?.name}</p>
            <p className="whitespace-pre-line">{invoice.client?.address}</p>
            {invoice.client?.gst && <p className="font-medium">GSTIN: {invoice.client.gst}</p>}
            <p>{invoice.client?.email}</p>
            <p>{invoice.client?.phone}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white" style={{ backgroundColor: primaryColor }}>
                <th className="p-3 font-semibold uppercase text-sm">Description</th>
                <th className="p-3 font-semibold uppercase text-sm text-center">SAC Code</th>
                <th className="p-3 font-semibold uppercase text-sm text-right">Price</th>
                <th className="p-3 font-semibold uppercase text-sm text-right">GST</th>
                <th className="p-3 font-semibold uppercase text-sm text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-3 text-gray-800">{item.description}</td>
                  <td className="p-3 text-center text-gray-600">{item.sacCode || '-'}</td>
                  <td className="p-3 text-right text-gray-800">₹{item.price.toFixed(2)}</td>
                  <td className="p-3 text-right text-gray-600">
                    {item.gstRate ? `${item.gstRate}%` : '-'}
                  </td>
                  <td className="p-3 text-right font-medium text-gray-800">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-72 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>₹{invoice.subTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-600 border-b border-gray-200 pb-2">
              <span>Total Tax</span>
              <span>₹{invoice.taxAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 text-xl font-bold" style={{ color: primaryColor }}>
              <span>Total</span>
              <span>₹{invoice.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Spacer to push footer to bottom */}
        <div className="flex-grow"></div>

        {/* Bank & Footer */}
        <div className="grid grid-cols-2 gap-8 text-sm text-gray-600 mt-auto pt-8 border-t border-gray-200">
          <div>
            {company.bank?.name && (
              <>
                <h4 className="font-bold text-gray-800 mb-2">Payment Details</h4>
                <p><span className="font-semibold">Bank Name:</span> {company.bank.name}</p>
                <p><span className="font-semibold">Account No:</span> {company.bank.accountNo}</p>
                <p><span className="font-semibold">IFSC Code:</span> {company.bank.ifsc}</p>
                {company.bank.branch && <p><span className="font-semibold">Branch:</span> {company.bank.branch}</p>}
                {company.bank.upiId && <p><span className="font-semibold">UPI ID:</span> {company.bank.upiId}</p>}
              </>
            )}
            {invoice.notes && (
              <div className="mt-4">
                <h4 className="font-bold text-gray-800 mb-1">Notes / Terms</h4>
                <p className="whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-800 mb-1">Have Questions?</div>
            <div>Call us: {company.contact?.phone}</div>
            <div>Mail us: {company.contact?.email}</div>
            <div className="font-bold mb-4" style={{ color: primaryColor }}>{company.contact?.website}</div>
            
            <div className="italic text-gray-500 mt-6 leading-relaxed">
              This package is prepared by {company.name}<br/>
              For any discrepancy, kindly connect within 24 hours from the date of generation.<br/>
              No refunds will be entertained.
            </div>
          </div>
        </div>
        </div> {/* End relative wrapper */}
      </div>
    </div>
  );
}

export default InvoicePage;
