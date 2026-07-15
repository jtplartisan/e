import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../services/wishlistService";
import { addToCart as addToCartAPI } from "../../services/cartService";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";


function Wishlist() {

  const [wishlist, setWishlist] = useState([]);

  const dispatch = useDispatch();



  const fetchWishlist = async () => {

    try {

      const res = await getWishlist();

      setWishlist(res.wishlist || []);

    } 
    catch(err) {

      console.log(err);

    }

  };



  useEffect(() => {

    fetchWishlist();

  }, []);




  const handleRemove = async(productId)=>{

    try{

      await removeFromWishlist(productId);

      fetchWishlist();

    }
    catch(err){

      console.log(err);

    }

  };





  const handleAddToCart = async(product)=>{

    try{


      await addToCartAPI({

        productId: product._id,
        quantity: 1

      });



      dispatch(addToCart(product));

      alert("Added to cart");


    }
    catch(err){

      console.log(err);

    }

  };





  return (

    <div className="p-6">


      <h1 className="text-2xl font-bold mb-6">
        ❤️ My Wishlist
      </h1>




      {
        wishlist.length === 0 ?

        (

          <div className="text-center text-gray-500">

            No products in wishlist

          </div>

        )

        :

        (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">


          {
            wishlist.map((item)=>(


              <div
              key={item._id}
              className="bg-white rounded-xl shadow-md p-4 border"
              >



                <img

                src={item.productId.image}

                alt={item.productId.name}

                className="h-48 w-full object-contain"

                />



                <h2 className="font-semibold text-lg mt-3">

                  {item.productId.name}

                </h2>



                <p className="text-blue-600 font-bold">

                  ₹{item.productId.price}

                </p>




                <div className="flex gap-2 mt-4">


                <button

                onClick={()=>handleAddToCart(item.productId)}

                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"

                >

                  Add Cart

                </button>




                <button

                onClick={()=>handleRemove(item.productId._id)}

                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"

                >

                  Remove

                </button>


                </div>



                <Link

                to={`/product/${item.productId._id}`}

                className="block text-blue-600 mt-3 text-sm"

                >

                View Details

                </Link>



              </div>


            ))
          }


          </div>

        )

      }



    </div>

  );

}


export default Wishlist;