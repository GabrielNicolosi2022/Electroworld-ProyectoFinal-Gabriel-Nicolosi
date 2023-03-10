import './ItemListContainer.css';
import { useEffect, useState } from 'react';
import ItemList from '../../components/ItemList/ItemList';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';

const ItemListContainer = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();
  // console.log(categoryId);

  const getProducts = () => {
    const db = getFirestore();
    const queryBase = collection(db, 'products');

    const querySnapshot = categoryId
      ? query(queryBase, where('category', '==', categoryId))
      : queryBase;

    getDocs(querySnapshot)
      .then((response) => {
        const list = response.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        console.log(list);
        setProductList(list);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, [categoryId]);

  // Loading mientras carga base de datos
  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className='ItemListContainer'>
          <ItemList productsList={productList} />
        </div>
      )}
    </>
  );
};

export default ItemListContainer;
