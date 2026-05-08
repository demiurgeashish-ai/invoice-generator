import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom, invoiceAtom, companyAtom } from '../store/atom';
import * as XLSX from 'xlsx';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function View() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);
  const company = useRecoilValue(companyAtom);
  const setInvoiceGlobal = useSetRecoilState(invoiceAtom);
  const navigate = useNavigate();

  const primaryColor = company?.branding?.primaryColor || '#000000';

  useEffect(() => {
    if (!user) {
      navigate('/signup');
      return;
    }
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/invoices`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axios.delete(`${BASE_URL}/api/invoices/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setInvoices(invoices.filter((inv) => inv._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleView = (invoice) => {
    setInvoiceGlobal(invoice);
    navigate(`/invoice/${invoice._id}`);
  };

  const handleEdit = (invoice) => {
    setInvoiceGlobal(invoice);
    navigate('/update-invoice');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInvoices(invoices.map(inv => inv._id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedInvoices(prev => [...prev, id]);
    } else {
      setSelectedInvoices(prev => prev.filter(invId => invId !== id));
    }
  };

  const handleDownloadExcel = () => {
    const selectedData = invoices.filter(inv => selectedInvoices.includes(inv._id));
    const excelData = selectedData.map(inv => ({
      'Invoice No': inv.invoiceNo,
      'Date': new Date(inv.date).toLocaleDateString(),
      'Client Name': inv.client?.name || 'N/A',
      'GST Number': inv.client?.gst || 'N/A',
      'Amount': inv.total
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, 'Invoices_Export.xlsx');
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="flex-grow p-6 bg-gray-50 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Invoices</h2>
          <div className="flex space-x-4">
            {selectedInvoices.length > 0 && (
              <button onClick={handleDownloadExcel} className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 font-medium transition">
                Download Excel ({selectedInvoices.length})
              </button>
            )}
            <button onClick={() => navigate('/create-invoice')} className="px-4 py-2 text-white rounded shadow hover:opacity-90 font-medium" style={{ backgroundColor: primaryColor }}>
              + New Invoice
            </button>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No invoices found. Create one to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="p-4 rounded-tl-lg font-medium w-12">
                    <input type="checkbox" onChange={handleSelectAll} checked={invoices.length > 0 && selectedInvoices.length === invoices.length} className="w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="p-4 font-medium">Invoice No</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 rounded-tr-lg font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      <input type="checkbox" onChange={(e) => handleSelectOne(e, inv._id)} checked={selectedInvoices.includes(inv._id)} className="w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="p-4 font-medium" style={{ color: primaryColor }}>{inv.invoiceNo}</td>
                    <td className="p-4 text-gray-800">{inv.client?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold text-gray-800">₹{inv.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {inv.status || 'Unpaid'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => handleView(inv)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition">View</button>
                      <button onClick={() => handleEdit(inv)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition">Edit</button>
                      <button onClick={() => handleDelete(inv._id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default View;
