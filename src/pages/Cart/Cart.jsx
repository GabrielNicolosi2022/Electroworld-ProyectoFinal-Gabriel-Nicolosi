import './Cart.css';
import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  updateDoc,
} from 'firebase/firestore';

const Cart = () => {
  const { cart, clear, removeItem, total } = useContext(CartContext);
  const [formValue, setFormValue] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const navigate = useNavigate();

  if (cart.length !== 0) {
    const createOrder = (event) => {
      event.preventDefault();
      const db = getFirestore();
      const querySnapshot = collection(db, 'orders');

      addDoc(querySnapshot, {
        buyer: {
          email: formValue.email,
          name: formValue.name,
          phone: formValue.phone,
        },
        products: cart.map((product) => {
          return {
            title: product.name,
            price: product.price,
            id: product.id,
            quantity: product.quantity,
          };
        }),
        total: total,
      })
        .then((response) => {
          console.log(response.id);
          alert(`Orden con el id: ${response.id} ha sido creada`);
          updateStocks(db);
        })
        .catch((error) => console.log(error));
    };

    const updateStocks = (db) => {
      cart.forEach((product) => {
        const querySnapshot = doc(db, 'products', product.id);
        updateDoc(querySnapshot, { stock: product.stock - product.quantity })
          .then(() => {
            // alert('El stock de los productos ha sido actualizado.');
            updateStocks();
          })
          .then(() => {
            alert('El stock de los productos ha sido actualizado');
          })
          .catch((error) => console.log(error));
      });
    };

    const handleInput = (event) => {
      // console.log(event.target.value);
      // console.log(event.target.name);
      setFormValue({
        ...formValue,
        [event.target.name]: event.target.value,
      });
    };
    return (
      <div className='cartContainer'>
        <div className='divCart'>
          <div>
            <h1 className='cartTitle'>Mi Carrito</h1>
            {cart.map((product) => (
              <div className='cartProduct' key={product.name}>
                <div className='itemCart'>
                  <img
                    src={`/img/${product.image}`}
                    alt='imagen del producto'
                    width='100px'
                  />
                  <h4 className='cartProductName'>
                    {product.name} {product.description}
                  </h4>
                  <h4 className='cartProductPrice'>{`U$S ${product.price}`}</h4>
                  <h5 className='cartProductQuant'>
                    Cant: {product.quantity}{' '}
                  </h5>
                  <button
                    className='delete-btn'
                    onClick={() => removeItem(product.id)}
                  >
                    <MdDeleteForever className='delete-icon' size='2em' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='cartFormContainer'>
          <h2>Mi compra</h2>
          <form className='cartForm'>
            <input
              className='cartInput'
              name='name'
              type='text'
              placeholder='Nombre'
              value={formValue.name}
              onChange={handleInput}
              required
            />
            <input
              className='cartInput'
              name='phone'
              type='text'
              placeholder='Telefono'
              value={formValue.phone}
              onChange={handleInput}
              required
            />
            <input
              className='cartInput'
              name='email'
              type='email'
              placeholder='email'
              value={formValue.email}
              onChange={handleInput}
              required
            />
            <div className='cartTotalPrice'>
              <div>Total:</div>
              <div>$ {total}</div>
            </div>
            <div className='buttons'>
              {cart.length > 0 && (
                <button className='btn-compra' onClick={clear}>
                  Vaciar carrito
                </button>
              )}
              <button onClick={() => navigate('/')} className='btn-compra'>
                Seguir comprando
              </button>

              <button className='btn-compra' onClick={createOrder}>
                Completar compra
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className='pageCartEmpty'>
        <p>Aún no tienes productos en tu carrito...</p>
        <button onClick={() => navigate('/')} className='common-btn'>
          Elegir productos
        </button>
      </div>
    );
  }
};
export default Cart;
