import KeycloakService from "./keycloakService";
import axios from "axios";

const getProducts = (page) => {
    let url = "http://localhost:8082/products?page=" + page

    return axios.get(
        url,
        {
            headers: {
                "Authorization": "Bearer " + KeycloakService.getToken()
            }
        }
    )
}

const saveProduct = (productElem) => {
    let url = "http://localhost:8082/products"

    return axios.post(
        url,
        productElem,
        {
            headers: {
                "Authorization": "Bearer " + KeycloakService.getToken()
            }
        },
    )
}

const deleteProduct = (productID) => {
    let url = `http://localhost:8082/products/${productID}`

    return axios.delete(
        url,
        {
            headers: {
                "Authorization": "Bearer " + KeycloakService.getToken()
            }
        })
}

const ProductsService = {
    getProducts,
    saveProduct,
    deleteProduct
};

export default ProductsService;