import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addToCart } from "../slices/cartSlice";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HomeContainer = styled.div`

  h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  select {
    margin-bottom: 16px;
    padding: 8px;
    background-color: #111314;
    color: white;
  }
`;

const ProductContainer = styled.div`
   display: flex;
   flex-wrap: wrap;
   gap: 16px;
   justify-content: center; 
   align-items: center;
   text-align: center;
`
const ProductCard = styled.div`
  width: 300px;
  height: 400px; 
  background-color: #000;
  border: 5px solid #17191A;
  padding: 16px;
  margin-bottom: 16px;
  transition: transform 0.3s ease-in-out;
  border-radius: 16px;
  @media (max-width: 768px) {
    width: 100%;
    height: auto; /* Adjust height for smaller screens */
  }

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  img {
    width: 100%;
    height: 60%; 
    object-fit: cover; 
    margin-bottom: 8px;
  }

  .details {
    display: flex;
    flex-direction: column; 
    align-items: center; 
    margin-bottom: 8px;

    .price {
      font-size: 16px;
      font-weight: bold;
    }
  }

   button {
    background-color: #007bff;
    color: #fff;
    padding: 8px 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    margin-top: 8px; /* Add margin to separate button from price */

    &:hover {
      background-color: #0056b3;
    }


  }
`;

const Box = styled.div`
display: flex;
align-items: center;
justify-content: space-around;
margin: 10px 0px;
`



const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maxDescriptionWords = 10;

  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loadingBrandOptions, setLoadingBrandOptions] = useState(true);

  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > maxDescriptionWords
      ? words.slice(0, maxDescriptionWords).join(" ") + " ..."
      : description;
  };

  useEffect(() => {
    const fetchBrandOptions = async () => {
      try {
        const brands = [...new Set(data.map((product) => product.brand))];
        const filteredBrands = brands.filter((brand) => brand.trim() !== "");

        setBrandOptions(filteredBrands);
      } catch (error) {
        console.error("Error fetching brand options:", error);
      } finally {
        setLoadingBrandOptions(false);
      }
    };

    fetchBrandOptions();
  }, [data]);

  let filteredData = [];
  if (status === "success" && data && data.length > 0) {
    filteredData = data.filter(
      (product) => !selectedBrand || product.brand === selectedBrand
    );
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  useEffect(() => {
    setSelectedBrand("");
  }, []);

  return (
    <HomeContainer>
      {status === "success" ? (
        <>
          <Box>
            <h2>New Arrival</h2>
            {loadingBrandOptions ? (
              <p>Loading brands...</p>
            ) : (
              <select value={selectedBrand} onChange={handleBrandChange}>
                <option value="">All Brands</option>
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            )}
          </Box>
          <ProductContainer className="products">
            {filteredData.map((product) => (
              <ProductCard key={product._id}>
                <h3>{product.name}</h3>
                <Link to={`/product/${product._id}`}>
                  <img src={product.images[0].url} alt={product.name} />
                </Link>
                <div className="details">
                  <span className="price">₹{product.price}</span>
                  <span>{truncateDescription(product.name)}</span>
                </div>
                <button onClick={() => handleAddToCart(product)}>
                  Add To Cart
                </button>
              </ProductCard>
            ))}
          </ProductContainer>
        </>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>Unexpected error occurred...</p>
      )}
    </HomeContainer>
  );
};

export default Home;
