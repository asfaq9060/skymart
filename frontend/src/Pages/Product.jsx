import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom';
import Breadcrum from '../components/Breadcrums/Breadcrum';
import { ShopContext } from '../Context/ShopContext.js';
import ProductDisplay from '../components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../components/RelatedProducts/RelatedProducts';
import CatalogueState from '../components/CatalogueState/CatalogueState';

function Product() {
  const { all_product, isLoadingProducts, productsError } = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_product.find((e) => e.id === Number(productId))

  if (isLoadingProducts || productsError) {
    return <CatalogueState isLoading={isLoadingProducts} error={productsError} />;
  }

  if (!product) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <h1>Product not found</h1>
        <p>That product is no longer available in the catalogue.</p>
        <Link to="/">Return to shop</Link>
      </div>
    );
  }
  return (
    <div>
      <Breadcrum  product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox />
      <RelatedProducts category={product.category} productId={product.id} />
    </div>
  )
}

export default Product
