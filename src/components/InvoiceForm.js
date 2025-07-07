import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

function InvoiceForm(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currency] = useState('₹');
  const [currentDate, setCurrentDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [dateOfIssue, setDateOfIssue] = useState('');
  const [billTo, setBillTo] = useState('');
  const [billToEmail, setBillToEmail] = useState('');
  const [billToAddress, setBillToAddress] = useState('');
  const [billFrom, setBillFrom] = useState('');
  const [billFromEmail, setBillFromEmail] = useState('');
  const [billFromAddress, setBillFromAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [total, setTotal] = useState('0.00');
  const [subTotal, setSubTotal] = useState('0.00');
  const [taxRate, setTaxRate] = useState('');
  const [taxAmmount, setTaxAmmount] = useState('0.00');
  const [discountRate, setDiscountRate] = useState('');
  const [discountAmmount, setDiscountAmmount] = useState('0.00');
  const [gstRate, setGstRate] = useState(18);
  const [gstAmount, setGstAmount] = useState(0);
  const [buyerState, setBuyerState] = useState('Maharashtra');
  const [sellerState, setSellerState] = useState('Maharashtra');
  const [items, setItems] = useState([
    {
      id: 0,
      name: '',
      description: '',
      price: '1.00',
      quantity: 1,
      gst: 18
    }
  ]);
  const [cgst, setCgst] = useState('0.00');
  const [sgst, setSgst] = useState('0.00');
  const [igst, setIgst] = useState('0.00');

  const editField = (event) => {
    const { name, value } = event.target;
    if (name === 'dateOfIssue') {
      setDateOfIssue(value);
    } else if (name === 'invoiceNumber') {
      setInvoiceNumber(value);
    } else if (name === 'billTo') {
      setBillTo(value);
    } else if (name === 'billToEmail') {
      setBillToEmail(value);
    } else if (name === 'billToAddress') {
      setBillToAddress(value);
    } else if (name === 'billFrom') {
      setBillFrom(value);
    } else if (name === 'billFromEmail') {
      setBillFromEmail(value);
    } else if (name === 'billFromAddress') {
      setBillFromAddress(value);
    } else if (name === 'notes') {
      setNotes(value);
    } else if (name === 'taxRate') {
      setTaxRate(value);
    } else if (name === 'discountRate') {
      setDiscountRate(value);
    }
    calculateTotal();
  };

  const openModal = (event) => {
    event.preventDefault();
    calculateTotal();
    setIsOpen(true);
  };

  const closeModal = (event) => setIsOpen(false);

  const handleRowDel = (delItem) => {
    const newItems = items.filter((i) => i.id !== delItem.id);
    setItems(newItems);
  };

  const handleAddEvent = (evt) => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1,
      gst: 18
    };
    setItems([...items, newItem]);
  };

  const calculateTotal = () => {
    let subtotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    items.forEach(item => {
      const itemTotal = parseFloat(item.price || 0) * parseFloat(item.quantity || 0);
      subtotal += itemTotal;
      const gstRate = parseFloat(item.gst || 0);
      if (buyerState === sellerState) {
        // CGST and SGST split
        totalCGST += (itemTotal * (gstRate / 2) / 100);
        totalSGST += (itemTotal * (gstRate / 2) / 100);
      } else {
        // IGST
        totalIGST += (itemTotal * gstRate / 100);
      }
    });
    setSubTotal(subtotal.toFixed(2));
    setGstAmount((totalCGST + totalSGST + totalIGST).toFixed(2));
    setTotal((subtotal + totalCGST + totalSGST + totalIGST).toFixed(2));
    setTaxAmmount('0.00'); // Not used
    setDiscountAmmount('0.00'); // Not used
    setCgst(totalCGST.toFixed(2));
    setSgst(totalSGST.toFixed(2));
    setIgst(totalIGST.toFixed(2));
  };

  const onItemizedItemEdit = (evt) => {
    const changedItem = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    const newItems = items.map((i) =>
      i.id === changedItem.id ? { ...i, [changedItem.name]: changedItem.value } : i
    );
    setItems(newItems);
    calculateTotal();
  };

  React.useEffect(() => {
    calculateTotal();
  }, [items, gstRate]);

  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control type="date" value={dateOfIssue} name="dateOfIssue" onChange={editField} style={{
                      maxWidth: '150px'
                    }} required="required"/>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control type="number" value={invoiceNumber} name="invoiceNumber" onChange={editField} min="1" style={{
                    maxWidth: '70px'
                  }} required="required"/>
              </div>
            </div>
            <hr className="my-4"/>
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control placeholder={"Who is this invoice to?"} rows={3} value={billTo} type="text" name="billTo" className="my-2" onChange={editField} autoComplete="name" required="required"/>
                <Form.Control placeholder={"Email address"} value={billToEmail} type="email" name="billToEmail" className="my-2" onChange={editField} autoComplete="email" required="required"/>
                <Form.Control placeholder={"Billing address"} value={billToAddress} type="text" name="billToAddress" className="my-2" autoComplete="address" onChange={editField} required="required"/>
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control placeholder={"Who is this invoice from?"} rows={3} value={billFrom} type="text" name="billFrom" className="my-2" onChange={editField} autoComplete="name" required="required"/>
                <Form.Control placeholder={"Email address"} value={billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={editField} autoComplete="email" required="required"/>
                <Form.Control placeholder={"Billing address"} value={billFromAddress} type="text" name="billFromAddress" className="my-2" autoComplete="address" onChange={editField} required="required"/>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label className="fw-bold">Seller State:</Form.Label>
                <Form.Select value={sellerState} onChange={e => setSellerState(e.target.value)}>
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Delhi</option>
                  <option>West Bengal</option>
                  <option>Uttar Pradesh</option>
                  <option>Rajasthan</option>
                  <option>Punjab</option>
                  <option>Kerala</option>
                  <option>Other</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="fw-bold">Buyer State:</Form.Label>
                <Form.Select value={buyerState} onChange={e => setBuyerState(e.target.value)}>
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Delhi</option>
                  <option>West Bengal</option>
                  <option>Uttar Pradesh</option>
                  <option>Rajasthan</option>
                  <option>Punjab</option>
                  <option>Kerala</option>
                  <option>Other</option>
                </Form.Select>
              </Col>
            </Row>
            <InvoiceItem onItemizedItemEdit={onItemizedItemEdit} onRowAdd={handleAddEvent} onRowDel={handleRowDel} currency={currency} items={items}/>
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:
                  </span>
                  <span>{currency}
                    {subTotal}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small ">({discountRate || 0}%)</span>
                    {currency}
                    {discountAmmount || 0}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:
                  </span>
                  <span>
                    <span className="small ">({taxRate || 0}%)</span>
                    {currency}
                    {taxAmmount || 0}</span>
                </div>
                <hr/>
                <div className="d-flex flex-row align-items-start justify-content-between" style={{
                    fontSize: '1.125rem'
                  }}>
                  <span className="fw-bold">Total:
                  </span>
                  <span className="fw-bold">{currency}
                    {total || 0}</span>
                </div>
              </Col>
            </Row>
            <hr className="my-4"/>
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control placeholder="Thanks for your business!" name="notes" value={notes} onChange={editField} as="textarea" className="my-2" rows={1}/>
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100">Review Invoice</Button>
            <InvoiceModal showModal={isOpen} closeModal={closeModal} info={{
              currency,
              currentDate,
              invoiceNumber,
              dateOfIssue,
              billTo,
              billToEmail,
              billToAddress,
              billFrom,
              billFromEmail,
              billFromAddress,
              notes,
              total,
              subTotal,
              cgst,
              sgst,
              igst,
              buyerState,
              sellerState
            }} items={items} currency={currency} subTotal={subTotal} total={total} cgst={cgst} sgst={sgst} igst={igst} />
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="taxRate" type="number" value={taxRate} onChange={editField} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="discountRate" type="number" value={discountRate} onChange={editField} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">GST rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control name="gstRate" type="number" value={gstRate} onChange={e => setGstRate(e.target.value)} className="bg-white border" placeholder="18.0" min="0.00" step="0.01" max="100.00" />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">GST Amount:</Form.Label>
              <Form.Control type="text" value={gstAmount} readOnly className="bg-white border" />
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default InvoiceForm;
