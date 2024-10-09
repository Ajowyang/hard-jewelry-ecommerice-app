import { FaRegHeart } from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import { PiArrowFatLinesLeft } from 'react-icons/pi';
import { RxStar } from 'react-icons/rx';
import { RiShieldCheckLine } from 'react-icons/ri';
import { LuSwords } from 'react-icons/lu';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from './CartContext';
import { CartProd } from '../lib/data.ts';

type ItemDetailsSectionProps = {
  title: string | undefined;
  price: number;
  material: string;
  size: string;
  possibleMaterials: string[];
  possibleSizes: string[];
};

export function DetailsSection({
  title,
  price,
  possibleMaterials,
  possibleSizes,
}: ItemDetailsSectionProps) {
  const [activeMaterialId, setActiveMaterialId] = useState(0);
  const [activeSizeId, setActiveSizeId] = useState(0);
  const [activePrice, setActivePrice] = useState(price);
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(true);
  // const [product, setProduct] = useState<CartProd>();
  const { itemId } = useParams();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!itemId) {
          throw new Error('itemId is required');
        }

        const material = possibleMaterials[activeMaterialId];
        const size = possibleSizes[activeSizeId];
        if (!material || !size) {
          throw new Error('material or size is not defined');
        }

        console.log(
          `/api/getPrice itemId=${itemId} material=${possibleMaterials[activeMaterialId]} size=${possibleSizes[activeSizeId]}`
        );
        const response = await fetch(`/api/getPrice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemId,
            material: possibleMaterials[activeMaterialId],
            size: possibleSizes[activeSizeId],
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP Error! Status N: ${response.status}`);
        }
        const data = await response.json();
        setActivePrice(data[0].price);
        setError(undefined);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (possibleMaterials.length > 0 && possibleSizes.length > 0) {
      fetchData();
    }
  }, [
    possibleMaterials,
    possibleSizes,
    itemId,
    activeMaterialId,
    activeSizeId,
  ]);

  function handleAddToCart() {
    // if (!product) throw new Error('Should never happen');

    // addToCart(product);
    const ProdToAdd: CartProd = {
      imageUrl: '',
      itemId: Number(itemId),
      itemName: title,
      size: possibleSizes[activeSizeId],
      material: possibleMaterials[activeMaterialId],
      qty: 1,
      unitPrice: activePrice,
    };
    console.log(':D ProdToAdd:', ProdToAdd);
    if (!ProdToAdd) throw new Error('Should never happen');
    addToCart(ProdToAdd);
    console.log('added!', CartContext);
    // navigate('/');
  }

  if (loading) {
    return <div>loading</div>;
  }

  // if (error) {
  //   return <div>Error</div>;
  // }

  return (
    <div className="flex flex-col w-full md:w-7/12 px-2">
      <h1 className="text-2xl  mt-3 mb-1">{title}</h1>
      <h1 className="text-3xl my-1">
        ${error ? 'error' : (activePrice / 100).toFixed(2)}
      </h1>
      <div>
        <h1 className="my-1 text-sm">
          Material:{' '}
          {possibleMaterials[activeMaterialId] !== undefined
            ? possibleMaterials[activeMaterialId]
            : null}
        </h1>
        <div className="flex">
          {possibleMaterials.map((material, index) =>
            index === activeMaterialId ? (
              <button
                key={index}
                className="ash border px-2 py-1 rounded my-1 text-red-700 border-red-700 mr-2 text-sm">
                {material}
              </button>
            ) : (
              <button
                key={index}
                className="ash border px-2 py-1 rounded my-1 hover:text-red-700 hover:border-red-700 mr-2 text-sm"
                onClick={() => {
                  setActiveMaterialId(index);
                }}>
                {material}
              </button>
            )
          )}
        </div>
      </div>
      <div>
        <h1 className="my-1 text-sm">
          Size:{' '}
          {possibleSizes[activeSizeId] !== undefined
            ? possibleSizes[activeSizeId]
            : null}
        </h1>
        <div className="flex">
          {possibleSizes.map((size, index) =>
            index === activeSizeId ? (
              <button
                key={index}
                className="ash border px-2 py-1 rounded my-1 text-red-700 border-red-700 mr-2 text-sm">
                {size}
              </button>
            ) : (
              <button
                key={index}
                className="ash border px-2 py-1 rounded my-1 hover:text-red-700 hover:border-red-700 mr-2 text-sm"
                onClick={() => setActiveSizeId(index)}>
                {size}
              </button>
            )
          )}
        </div>
      </div>
      <button
        className="bg-red-500 rounded-full text-center py-2 w-full my-2"
        onClick={handleAddToCart}>
        ADD TO CART
      </button>
      <hr></hr>
      <div className="flex items-center w-full justify-center">
        <div className="text-red-700">
          <FaRegHeart size={15} />
        </div>
        <button className="text-sm mx-2 my-1 hover:text-red-700">
          Add to wishlist
        </button>
      </div>
      <ul>
        <li className="my-2">
          <div className="flex items-center ">
            <TbTruckDelivery />
            <h1 className="mx-1">Free Shipping</h1>
          </div>
        </li>
        <li className="my-2">
          <div className="flex items-center ">
            <PiArrowFatLinesLeft />
            <h1 className="mx-1">Free Returns</h1>
          </div>
        </li>
        <li className="my-2">
          <div className="flex items-center ">
            <RxStar />
            <h1 className="mx-1">Lifetime Warranty</h1>
          </div>
        </li>
        <li className="my-2">
          <div className="flex items-center ">
            <RiShieldCheckLine />
            <h1 className="mx-1">Secured Payments</h1>
          </div>
        </li>
        <li className="my-2">
          <div className="flex items-center ">
            <LuSwords />
            <h1 className="mx-1">Stainless Steel Vs. Sterling Silver</h1>
          </div>
        </li>
      </ul>
    </div>
  );
}
