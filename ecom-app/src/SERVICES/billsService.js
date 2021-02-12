import KeycloakService from "./keycloakService";
import axios from "axios";

const getBills = (page) => {
    let url = "http://localhost:8083/full/bills?page=" + page

    return axios.get(
        url,
        {
            headers: {
                "Authorization": "Bearer " + KeycloakService.getToken()
            }
        }
    )
}

// const saveCustomer = (customerElem) => {
//     let url = "http://localhost:8081/customers"

//     return axios.post(
//         url,
//         customerElem,
//         {
//             headers: {
//                 "Authorization": "Bearer " + KeycloakService.getToken()
//             }
//         },
//     )
// }

// const deleteCustomer = (customerID) => {
//     let url = `http://localhost:8081/customers/${customerID}`

//     return axios.delete(
//         url,
//         {
//             headers: {
//                 "Authorization": "Bearer " + KeycloakService.getToken()
//             }
//         })
// }

const BillsService = {
    getBills
};

export default BillsService;