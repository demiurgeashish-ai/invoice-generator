import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom, companyAtom, invoiceAtom } from '../store/atom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function UpdateForm() {
  const user = useRecoilValue(userAtom);
  const company = useRecoilValue(companyAtom);
  const currentInvoice = useRecoilValue(invoiceAtom);
  const setInvoiceGlobal = useSetRecoilState(invoiceAtom);
  const navigate = useNavigate();

  const primaryColor = company?.branding?.primaryColor || '#000000';

  const [client, setClient] = useState({ name: '', email: '', phone: '', address: '', gst: '' });
  const [items, setItems] = useState([]);
  const [invoice, setInvoice] = useState({ date: '', dueDate: '', notes: '', status: 'Unpaid' });

  useEffect(() => {
    if (!currentInvoice || !currentInvoice._id) {
      navigate('/view-invoices');
      return;
    }
    setClient(currentInvoice.client || {});
    setItems(currentInvoice.items || []);
    setInvoice({
      date: new Date(currentInvoice.date).toISOString().split('T')[0],
      dueDate: currentInvoice.dueDate ? new Date(currentInvoice.dueDate).toISOString().split('T')[0] : '',
      notes: currentInvoice.notes || '',
      status: currentInvoice.status || 'Unpaid'
    });
  }, [currentInvoice, navigate]);

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    if (e.target.name === 'description' || e.target.name === 'sacCode') {
      newItems[index][e.target.name] = e.target.value;
    } else {
      newItems[index][e.target.name] = parseFloat(e.target.value) || 0;
    }
    newItems[index].amount = newItems[index].quantity * newItems[index].price;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', sacCode: '', quantity: 1, price: 0, gstRate: 0, amount: 0 }]);
  
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const subTotal = items.reduce((acc, item) => acc + item.amount, 0);
  const taxAmount = items.reduce((acc, item) => acc + (item.amount * ((item.gstRate || 0) / 100)), 0);
  const total = subTotal + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentInvoice.client && currentInvoice.client._id) {
        await axios.put(`${BASE_URL}/api/clients/${currentInvoice.client._id}`, client, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
      
      const invoiceData = {
        client: currentInvoice.client._id,
        invoiceNo: currentInvoice.invoiceNo, // Cannot be changed
        date: invoice.date,
        dueDate: invoice.dueDate,
        items,
        subTotal,
        taxAmount,
        total,
        notes: invoice.notes,
        status: invoice.status
      };

      const res = await axios.put(`${BASE_URL}/api/invoices/${currentInvoice._id}`, invoiceData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setInvoiceGlobal({ ...res.data, client: { ...currentInvoice.client, ...client } });
      navigate(`/invoice/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert('Error updating invoice');
    }
  };

  return (
    <div className="flex-grow p-6 bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Update Invoice {currentInvoice.invoiceNo}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Client Details</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Client Name" value={client.name || ''} onChange={(e) => setClient({ ...client, name: e.target.value })} required className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
                <input type="email" placeholder="Client Email" value={client.email || ''} onChange={(e) => setClient({ ...client, email: e.target.value })} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
                <input type="text" placeholder="Client Phone" value={client.phone || ''} onChange={(e) => setClient({ ...client, phone: e.target.value })} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
                <input type="text" placeholder="Client GSTIN (Optional)" value={client.gst || ''} onChange={(e) => setClient({ ...client, gst: e.target.value })} className="w-full p-3 border rounded focus:ring-2 outline-none uppercase" style={{ '--tw-ring-color': primaryColor }} />
                <textarea placeholder="Client Address" value={client.address || ''} onChange={(e) => setClient({ ...client, address: e.target.value })} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} rows="3" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Invoice Details</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-600 mb-1">Issue Date</label>
                    <input type="date" value={invoice.date} onChange={(e) => setInvoice({ ...invoice, date: e.target.value })} required className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                    <input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} />
                  </div>
                </div>
                <select value={invoice.status} onChange={(e) => setInvoice({ ...invoice, status: e.target.value })} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }}>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700" style={{ color: primaryColor }}>Items</h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-50 p-4 rounded-lg border border-gray-100 flex-wrap md:flex-nowrap">
                  <input type="text" name="description" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, e)} required className="flex-grow min-w-[200px] p-2 border rounded" />
                  <input type="text" name="sacCode" placeholder="SAC Code" value={item.sacCode || ''} onChange={(e) => handleItemChange(index, e)} className="w-24 p-2 border rounded" />
                  <input type="number" name="quantity" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required className="w-20 p-2 border rounded" />
                  <input type="number" name="price" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, e)} required className="w-24 p-2 border rounded" />
                  <div className="flex items-center w-24 bg-white border rounded">
                    <input type="number" name="gstRate" placeholder="GST" value={item.gstRate || 0} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 rounded outline-none" />
                    <span className="pr-2 text-gray-500 text-sm">%</span>
                  </div>
                  <div className="w-24 text-right font-medium text-gray-700">₹{item.amount?.toFixed(2)}</div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 px-2 font-bold">X</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition font-medium">
              + Add Item
            </button>
          </div>

          <div className="flex justify-end border-t pt-6">
            <div className="w-64 space-y-3 text-gray-700">
              <div className="flex justify-between"><span>Subtotal:</span> <span className="font-semibold">₹{subTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Total Tax:</span> <span className="font-semibold">₹{taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-xl font-bold" style={{ color: primaryColor }}>
                <span>Total:</span> <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Notes / Terms</label>
            <textarea placeholder="Additional notes..." value={invoice.notes} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} className="w-full p-3 border rounded focus:ring-2 outline-none" style={{ '--tw-ring-color': primaryColor }} rows="2" />
          </div>

          <button type="submit" className="w-full py-4 text-white rounded-lg font-bold text-lg shadow hover:opacity-90 transition" style={{ backgroundColor: primaryColor }}>
            Update Invoice
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateForm;
