package com.ms.billingservice.web;

import com.ms.billingservice.entities.Bill;
import com.ms.billingservice.feign.CustomerRestClient;
import com.ms.billingservice.feign.ProductItemRestClient;
import com.ms.billingservice.repositories.BillRepository;
import com.ms.billingservice.repositories.ProductItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class BillingRestController {
    private BillRepository billRepository;
    private ProductItemRepository productItemRepository;
    private CustomerRestClient customerRestClient;
    private ProductItemRestClient productItemRestClient;

    public BillingRestController(
            BillRepository billRepository,
            ProductItemRepository productItemRepository,
            CustomerRestClient customerRestClient,
            ProductItemRestClient productItemRestClient) {
        this.billRepository = billRepository;
        this.productItemRepository = productItemRepository;
        this.customerRestClient = customerRestClient;
        this.productItemRestClient = productItemRestClient;
    }

    @GetMapping("/full/bills/{id}")
    Bill getBill(HttpServletRequest request, @PathVariable(name="id") Long id){
        Bill bill=billRepository.findById(id).get();
        bill.setCustomer(customerRestClient.findCustomerById(request.getHeader("Authorization"),bill.getCustomerID()));
        bill.setProductItems(productItemRepository.findByBillId(id));
        bill.getProductItems().forEach(pi->{
            pi.setProduct(productItemRestClient.findProductById(request.getHeader("Authorization"),pi.getProductID()));
        });
        return bill;
    }

    @GetMapping("/full/bills")
    Page<Bill> getBills(HttpServletRequest request, Pageable pageable){
        Page<Bill> bills = billRepository.findAll(pageable);
        bills.forEach(bill -> {
            bill.setCustomer(customerRestClient.findCustomerById(request.getHeader("Authorization"),bill.getCustomerID()));
            bill.setProductItems(productItemRepository.findByBillId(bill.getId()));
            bill.getProductItems().forEach(pi->{
                pi.setProduct(productItemRestClient.findProductById(request.getHeader("Authorization"),pi.getProductID()));
            });
        });
        return bills;
    }
}
